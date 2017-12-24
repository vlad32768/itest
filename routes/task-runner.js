var child_process = require('child_process')
var lineInputStream = require('line-input-stream')
var EventEmitter = require('events');
var fs = require('fs')
var path = require('path')
var _ = require('lodash')

var logDir = path.join(__dirname, '..', 'log')
fs.mkdir(logDir, function(){})
var logFileName = path.normalize(path.join(logDir, 'failed_tasks.log'))

function Task(taskId, taskParam, timeout) {
    this.taskId = taskId
    this.taskParam = taskParam || {}
    this.timeout = timeout
    this.eventEmitter = new EventEmitter
    this.output = []
}

function restartServer() {
    if (this.running) {
        this.procStdout.removeAllListeners('line')
        this.proc
            .removeAllListeners('exit')
            .removeAllListeners('error')
            .kill('SIGKILL') // SIGHUP?
    }
    this.proc = child_process.spawn(
        process.argv[0],
        ['task-runner-server.js'], {
            cwd: __dirname
        })
    this.procStdout = lineInputStream(this.proc.stdout)
    this.procStdout.on('line', processStdoutLine.bind(this))
    this.proc.on('exit', processExit.bind(this))
    this.proc.on('error', processError.bind(this))
    this.running = true
    this.taskQueue = []
    this.serverReady = false
    this.proc
}

function maybeClearTaskTimeout(timeoutReason) {
    if (this.taskTimeoutId && !timeoutReason)
        clearTimeout(this.taskTimeoutId)
    this.taskTimeoutId = undefined
}

function finishTask() {
    maybeClearTaskTimeout.call(this)
    var task = this.taskQueue[0]
    task.eventEmitter.emit('done', task.output)
    this.taskQueue.splice(0, 1)
}

function abortTask(message, timeoutReason) {
    maybeClearTaskTimeout.call(this)
    var task = this.taskQueue[0]
    if (timeoutReason)
        fs.appendFile(logFileName, JSON.stringify(_.pick(task, ['taskId', 'taskParam', 'timeout'])) + '\n', function(err){
            if (err)
                console.log(err)
            else
                console.log('Task failed, id = ' + task.taskId + ' (see file ' + logFileName + ')')
        })
    task.eventEmitter.emit('error', task.output, message)
    this.taskQueue.splice(0, 1)
    restartServer.call(this)
}

function processTaskQueue() {
    if (!this.serverReady)
        return
    if (this.taskQueue.length == 0)
        return
    var task = this.taskQueue[0]
    this.proc.stdin.cork()
    this.proc.stdin.write(['run', task.taskId, JSON.stringify(task.taskParam), ''].join('\n'))
    this.proc.stdin.uncork()
    this.taskTimeoutId = setTimeout(abortTask.bind(this, 'Что-то пошло не так...', true), task.timeout)
    this.serverReady = false
}

function processStdoutLine(line) {
    var rx = /^(\w+) ?(.*)$/
    var m = line.match(rx)
    if (!m)
        return restartServer.call(this)
    switch(m[1]) {
        case 'ready':
            this.serverReady = true
            processTaskQueue.call(this)
            break
        case 'bye':
            break
        case 'out':
            var output = this.taskQueue[0].output
            if (line.length > 500 || output.length >= 100)
                return abortTask.call(this, 'Слишком много букв в ответе')
            output.push(m[2])
            break
        case 'end':
            finishTask.call(this)
            break
        default:
            restartServer.call(this)
            break
    }
}

function processExit(code, signal) {
    this.running = false
}

function processError(err) {
    this.running = false
}

function TaskRunner() {
    restartServer.call(this)
}

TaskRunner.prototype.shutdown = function() {
    if (this.running && !this.shuttingDown)
        this.proc.stdin.end('exit\n')
    this.shuttingDown = true
}

TaskRunner.prototype.run = function(taskId, taskParam, timeout) {
    if (this.shuttingDown)
        throw new Error('No more tasks are allowed because shutdown() has been called')
    var task = new Task(taskId, taskParam, timeout)
    this.taskQueue.push(task)
    processTaskQueue.call(this)
    return task.eventEmitter
}

function taskRunner() {
    return new TaskRunner
}

module.exports = taskRunner

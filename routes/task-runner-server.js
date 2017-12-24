var allTasks = require('./all-tasks.js')
var util = require('./util.js')
var lineInputStream = require('line-input-stream')

function runTask(taskId, taskParam) {
    taskParam = JSON.parse(taskParam)
    taskId = taskId || 'test-01-so:1'
    var task = allTasks.tasks()[taskId]
    var w = util.clamp(taskParam.width, 1, 160, 80)
    var h = util.clamp(taskParam.height, 1, 50, 24)
    var stdin = taskParam.stdin || task.stdin()
    task.scene().paint(w, h, stdin).split('\n').forEach(function(line) {
        process.stdout.write('out ' + line + '\n')
    })
    process.stdout.write('end\n')
}

function main() {
    var state
    function ready() {
        process.stdout.cork()
        process.stdout.write('ready\n')
        process.stdout.uncork()
        state = 'ready'
    }
    ready()
    var taskId
    lineInputStream(process.stdin)
        .on('line', function(line) {
            switch(state) {
            case 'ready': {
                switch(line) {
                case 'run':
                    state = 'taskId'
                    break
                case 'exit':
                    process.stdout.write('bye\n')
                    process.exit(0)
                    break
                default:
                    process.exit(1) // Unrecognized input
                }
                break
            }
            case 'taskId':
                taskId = line
                state = 'taskParam'
                break
            case 'taskParam':
                runTask(taskId, line)
                ready()
                break
            default:
                process.exit(2) // Internal error
            }
        })
        .on('end', function() {
            process.stdout.write('bye\n')
            process.exit(0)
        })
}

main()

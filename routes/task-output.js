var express = require('express');
var router = express.Router();
var csc = require('./console-scene.js')
var sd = require('./student-data.js')
var _ = require('lodash')
var util = require('./util.js')
var allTasks = require('./all-tasks.js')

var taskRunner = require('./task-runner.js')()

var sandboxed = process.env.DEBUG_TASKS? false: true

router
    .get('/task-output', function(req, res, next) {
        var taskId = req.query.taskId || 'test-01-so:1'
        var task = allTasks.tasks()[taskId]
        var taskParam = {
            width: util.clamp(req.query.width, 1, 160, 80),
            height: util.clamp(req.query.height, 1, 50, 24),
            stdin: req.query.stdin || task.stdin()
        }
        if (sandboxed)
            taskRunner.run(taskId, taskParam, 500)
                .on('done', function(output) {
                    res.send(JSON.stringify({
                        width: taskParam.width,
                        height: taskParam.height,
                        data: output.join('\n')
                    }))
                })
                .on('error', function(output, message) {
                    res/*.status(500)*/.send(JSON.stringify({
                        width: taskParam.width,
                        height: taskParam.height,
                        data: output.length > 0 ?  output.join('\n') + '\n...\n' + message :   message
                    }))
                })
        else
            res.send(JSON.stringify({
                width: taskParam.width,
                height: taskParam.height,
                data: task.scene().paint(taskParam.width, taskParam.height, taskParam.stdin)
            }))
    })

module.exports = router

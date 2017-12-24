var express = require('express');
var router = express.Router();
var csc = require('./console-scene.js')
var sd = require('./student-data.js')
var _ = require('lodash')
var util = require('./util.js')
var allTasks = require('./all-tasks.js')

var taskRunner = require('./task-runner.js')()

router
    .get('/task-output', function(req, res, next) {
        var taskId = req.query.taskId || 'test-01-so:1'
        var task = allTasks.tasks()[taskId]
        var taskParam = {
            width: util.clamp(req.query.width, 1, 160, 80),
            height: util.clamp(req.query.height, 1, 50, 24),
            stdin: req.query.stdin || task.stdin()
        }
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

        /*
        // Note: This code was previously used to run tasks within the main process
        //
        var taskSet = req.query.taskId || 'test-01-so:1'
        var task = allTasks.tasks()[taskSet]
        var w = util.clamp(req.query.width, 1, 160, 80)
        var h = util.clamp(req.query.height, 1, 50, 24)
        var stdin = req.query.stdin || task.stdin()
        res.send(JSON.stringify({
            width: w,
            height: h,
            data: task.scene().paint(w, h, stdin)
        }))
        */
    })

module.exports = router

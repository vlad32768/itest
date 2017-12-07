var express = require('express');
var router = express.Router();
var csc = require('./console-scene.js')
var sd = require('./student-data.js')
var _ = require('lodash')
var util = require('./util.js')
var allTasks = require('./all-tasks.js')

/* GET home page. */
router
    .get('/task-output', function(req, res, next) {
        var taskSet = req.query.taskSet || 'test-1'
        var list = allTasks.lists[taskSet]
        var n = util.clamp(req.query.n, 0, list.length()-1, 0)
        var w = util.clamp(req.query.width, 1, 160, 80)
        var h = util.clamp(req.query.height, 1, 50, 24)
        var task = list.task(n)
        var stdin = req.query.stdin || task.stdin()
        res.send(JSON.stringify({
            width: w,
            height: h,
            data: task.scene().paint(w, h, stdin)
        }))
    })

module.exports = router

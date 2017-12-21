var express = require('express')
var allTasks = require('./all-tasks.js')

var router = express.Router()

router
    .get('/task', function(req, res, next) {
        var taskId = req.query.task || 'test-01-so'
        var task = allTasks.tasks()[taskId]
        res.render('task', { taskId: taskId, task: task, allowUpload: false })
    })

module.exports = router

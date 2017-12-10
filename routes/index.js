var express = require('express');
var router = express.Router();
var csc = require('./console-scene.js')
var sd = require('./student-data.js')
var _ = require('lodash')
var util = require('./util.js')
var allTasks = require('./all-tasks.js')

// Note: req.session.teamId must be present, so make sure to use login.js before this module.

/* GET home page. */
router
    .get('/', function(req, res, next) {
        var team = sd.data.team(req.session.teamId)
        var taskId = req.query.task || team.taskId
        var task = allTasks.tasks()[taskId]
        res.render('task', { taskId: taskId, task: task, allowUpload: true, team: team })
    })
    .post('/upload-result', function(req, res, next) {
        var team = sd.data.team(req.session.teamId)
        team.result = req.body.result
        res.sendStatus(200)
    })
    .get('/logout-warning-message', function(req, res) {
        var team = sd.data.team(req.session.teamId)
        if (team.taskSolved)
            res.send('Задача решена, можно уходить')
        else
            res.send('Вам придётся прийти в другой раз, не сегодня')
    })

module.exports = router

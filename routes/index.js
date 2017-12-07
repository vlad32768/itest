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
        var taskSet = req.query.taskSet || team.taskSet
        var list = allTasks.lists[taskSet]
        var n = util.clamp(req.query.n, 0, list.length()-1, team.taskIndex)
        var task = list.task(n)
        res.render('task', { n: n, task: task, allowUpload: true })
    })
    .post('/upload-result', function(req, res, next) {
        var team = sd.data.team(req.session.teamId)
        team.result = req.body.result
        res.sendStatus(200)
    })

module.exports = router

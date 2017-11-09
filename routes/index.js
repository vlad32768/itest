var express = require('express');
var router = express.Router();
var csc = require('./console-scene.js')
var tsk = require('./tasks.js')
var sd = require('./student-data.js')
var _ = require('lodash')
var util = require('./util.js')

// Note: req.session.teamId must be present, so make sure to use login.js before this module.

/* GET home page. */
router
    .use('/', function(req, res, next) {
        var team = sd.data.team(req.session.teamId)
        if (!team.hasOwnProperty('taskIndex')) {
            var ti = sd.data.taskIndices
            if (!ti   ||   ti.length === 0)
                ti = sd.data.taskIndices = _.range(tsk.list.length())
            var i = Math.floor(Math.random() * ti.length)
            team.taskIndex = ti.splice(i, 1)[0]
        }
        next()
    })
    .get('/', function(req, res, next) {
        var team = sd.data.team(req.session.teamId)
        var n = util.clamp(req.query.n, 0, tsk.list.length()-1, team.taskIndex)
        var task = tsk.list.task(n)
        res.render('task', { n: n, task: task, allowUpload: true })
    })
    .post('/upload-result', function(req, res, next) {
        var team = sd.data.team(req.session.teamId)
        team.result = req.body.result
        res.sendStatus(200)
    })

module.exports = router

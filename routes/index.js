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
        var teamTaskIndex = req.query.taskIndex || 0
        if (teamTaskIndex < 0   ||   teamTaskIndex >= sd.data.maxTasksPerTeam)
            return res.status(400).send('Неправильный индекс задачи')
        if (teamTaskIndex >= team.tasks.length) {
            teamTaskIndex = team.tasks.length
            if (sd.data.allowAllTasksAtOnce   ||   teamTaskIndex == 0   ||   team.tasks[teamTaskIndex-1].solved) {
                try {
                    sd.data.allocTask(team)
                }
                catch(err) {
                    return res.status(500).send(error.message)
                }
            }
            else
                return res.status(403).send('Сначала решите <a href="?taskIndex='+(teamTaskIndex-1)+'">задачу ' + teamTaskIndex + '</a>')
        }
        var taskId = team.tasks[teamTaskIndex].id
        var task = allTasks.tasks()[taskId]
        res.render('task', { taskId: taskId, task: task, allowUpload: true, team: team, teamTaskIndex: teamTaskIndex, maxTasks: sd.data.maxTasksPerTeam })
    })
    .post('/upload-result', function(req, res, next) {
        var team = sd.data.team(req.session.teamId)
        var teamTaskIndex = req.body.taskIndex || 0
        if (!(teamTaskIndex >= 0   &&   teamTaskIndex < team.tasks.length))
            return res.sendStatus(400).send('taskIndex is out of range')
        team.tasks[teamTaskIndex].result = req.body.result
        res.sendStatus(200)
    })
    .get('/logout-warning-message', function(req, res) {
        var team = sd.data.team(req.session.teamId)
        var nTasksSolved = _.reduce(team.tasks, function(sum, task) { return sum + (task.solved? 1: 0) }, 0)
        var text
        if (nTasksSolved === sd.data.maxTasksPerTeam) {
            if (sd.data.maxTasksPerTeam === 1)
                text = 'Задача решена, можно уходить'
            else
                text = 'Все задачи решены, можно уходить'
        }
        else if (nTasksSolved === 0) {
            if (sd.data.maxTasksPerTeam === 1)
                text = 'Задача не решена. Вам придётся прийти в другой раз, не сегодня'
            else
                text = 'Ни одна из задач не решена. Вам придётся прийти в другой раз, не сегодня'
        }
        else 
            text = 'Не все задачи решены, ещё есть над чем поработать.'
        res.send(text)
    })

module.exports = router

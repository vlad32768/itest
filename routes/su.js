var express = require('express')
var fs = require('fs')
var path = require('path')
var _ = require('lodash')
var crypto = require('crypto')
var sd = require('./student-data.js')
var allTasks = require('./all-tasks.js')
var util = require('./util.js')
var su_task = require('./su-task.js')

var dataDir = path.join(__dirname, '..', 'data')

fs.mkdir(dataDir, function(){})

var router = express.Router()

function toBool(x) {
    return typeof x === 'string'?   x === 'true' || x === '1':   x == true
}

function postScalarValue(req, res, cb) {
    var b = req.body
    if (b.value === undefined)
        return res.status(400).send('Query \'value\' is required')
    if (cb(b.value) !== false)
        res.sendStatus(200)
}

var nameEnding = ''
router
    .get('/auth', function(req, res) {
        if (req.session.supervisor)
            return res.redirect('/su')
        res.render('su-auth', {message: req.flash('suAuthErrorMessage')})
    })
    .post('/auth', function(req, res) {
        var SuPassHash = 'bc59e772e61054fcfcfa6f9e478b307a5b05286b'
        var shasum = crypto.createHash('sha1')
        shasum.update(req.body.pass, {encoding: 'utf8'})
        var hash = shasum.digest('hex');
        if(hash === SuPassHash) {
            req.session.supervisor = true
            return res.redirect(req.session.originalUrl || '/su')
        }
        req.flash('suAuthErrorMessage', 'Неверный пароль')
        res.redirect('/su/auth')
    })
    .get('/exit', function(req, res) {
        delete req.session.supervisor
        res.redirect('/su/auth')
    })
    .use('/', function(req, res, next) {
        if (!req.session.supervisor) {
            req.session.originalUrl = req.originalUrl
            return res.redirect('/su/auth')
        }
        next()
    })
    .get('/', function(req, res, next) {
        // var teams = sd.data.teams()
        fs.readdir(dataDir, function(err, files) {
            if (err) {
                console.log(err)
                return res.status(500).send('Unable to load data file list')
            }
            res.render('su', {
                studentData: sd.data,
                files: files,
                nameEnding: nameEnding,
                taskStats: sd.data.taskStatsObj(),
                util: util
            })
        })
    })
    .get('/team-result', function(req, res, next) {
        var team = sd.data.team(req.query.id)
        var taskIndex = req.query.taskIndex || 0
        var teamTask = team.tasks[taskIndex]
        res.type('text/plain').send('// ' + team.summary() + '\n' + teamTask.result)
    })
    .post('/set-mark', function(req, res, next) {
        var team = sd.data.team(req.body.id)
        var memberIndex = req.body.memberIndex
        if (team && memberIndex >= 0 && memberIndex < team.members.length) {
            team.members[memberIndex].mark = req.body.mark
            sd.data.unsaved = true
            res.sendStatus(200)
        }
        else
            res.sendStatus(404)
    })
    .post('/remove-team', function(req, res, next) {
        var team = sd.data.team(req.body.id)
        if (team) {
            sd.data.removeTeam(team)
            sd.data.unsaved = true
            res.sendStatus(200)
        }
        else
            res.sendStatus(404)
    })
    .post('/set-team-status', function(req, res) {
        var taskIndex = req.body.taskIndex || 0
        if (req.body.taskSolved !== undefined) {
            sd.data.setTaskSolved(req.body.id, taskIndex, toBool(req.body.taskSolved))
        }
        if (req.body.taskAbandoned !== undefined) {
            sd.data.setTaskAbandoned(req.body.id, taskIndex, toBool(req.body.taskAbandoned))
        }
        if (req.body.allowExtraLogin !== undefined) {
            sd.data.team(req.body.id).allowExtraLogin = toBool(req.body.allowExtraLogin)
        }
        res.sendStatus(200)
    })
    .post('/save', function(req, res) {
        nameEnding = req.body.nameEnding
        var nameEndingFinal = nameEnding? '-' + nameEnding.replace('/', '-'): ''
        var time = (new Date).toISOString().replace(/:/g,'-').replace(/\.\d+\w?$/, '').replace(/T/, '_')
        var fileName = time+nameEndingFinal+'.json'
        var filePath = path.join(dataDir, fileName)
        fs.writeFile(filePath, JSON.stringify(sd.data), {encoding: 'utf8'}, function(err) {
            if (err) {
                console.log(err)
                return res.status(500).send('Failed to save file ' + fileName)
            }
            sd.data.unsaved = false
            res.send('Saved file ' + fileName)
        })
    })
    .get('/load', function(req, res) {
        var fileName = req.query.file
        if (!fileName)
            return res.status(400).send('Query parameter \'file\' is missing')
        if (sd.data.unsaved)
            return res.status(403).send('Cannot load data: save current state first')
        var filePath = path.join(dataDir, fileName)
        fs.readFile(filePath, {encoding: 'utf8'}, function(err, data) {
            if (err) {
                console.log(err)
                return res.status(404).send('Failed to read file ' + fileName)
            }
            var json = JSON.parse(data)
            sd.data = sd.Data.fromJson(json)
            res.redirect('/su')
        })
    })
    .get('/clear', function(req, res) {
       if (sd.data.unsaved && !req.query.force)
           return res.status(403).send('Cannot clear data: save current state first')
       sd.data = new sd.Data
       res.redirect('/su')
    })
    .post('/deny-login', function(req, res) {
        postScalarValue(req, res, function(value) {
            sd.data.denyLogin = toBool(value)
        })
    })
    .post('/set-max-team-size', function(req, res) {
        postScalarValue(req, res, function(value) {
            var v = +value
            if (v < 1 || v > 2) {
                res.status(400).send('Enter size from 1 to 2')
                return false
            }
            else
                sd.data.maxTeamSize = v
        })
    })
    .post('/set-tasks-per-team', function(req, res) {
        postScalarValue(req, res, function(value) {
            var v = +value
            if (v < 1 || v > 3) {
                res.status(400).send('Enter size from 1 to 3')
                return false
            }
            else
                sd.data.maxTasksPerTeam = v
        })
    })
    .post('/tasks-allow-all-tasks-at-once', function(req, res) {
        postScalarValue(req, res, function(value) {
            sd.data.allowAllTasksAtOnce = toBool(value)
        })
    })
    .post('/tasks-start-with-test', function(req, res) {
        postScalarValue(req, res, function(value) {
            sd.data.startWithTest = toBool(value)
            res.status(400).send('Feature is not implemented (TODO)')
            return false
        })
    })
    .get('/mask-tasks', function(req, res) {
        var taskSets = allTasks.taskSets()
        res.render('mask-tasks', { allTasks: allTasks, taskSets: taskSets, sd: sd, taskStats: sd.data.taskStatsObj() })
    })
    .get('/mask-task-set', function(req, res) {
        var taskSet = req.query.taskSet
        var enable = toBool(req.query.enable)
        sd.data.enableTaskSet(taskSet, enable)
        res.sendStatus(200)
    })
    .get('/mask-task', function(req, res) {
        var taskId = req.query.task
        var enable = toBool(req.query.enable)
        sd.data.enableTask(taskId, enable)
        res.sendStatus(200)
    })
    .get('/query-builder', function(req, res) {
        res.render('query-builder')
    })
    .get('/tags', function(req, res) {
        res.send(JSON.stringify(allTasks.taskTags()))
    })
    .use(su_task)

module.exports = router

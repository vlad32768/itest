var express = require('express');
var sd = require('./student-data.js')
var _ = require('lodash')

var router = express.Router();
router
    .get('/login', function(req, res, next) {
        res.render('login', {studentData: sd.data, message: req.flash('loginMessage'), loginData: req.session.loginData || {}})
    })
    .post('/login', function(req, res, next) {
        var b = req.session.loginData = req.body
        b = _.pick(b, ['group', 'firstname1', 'lastname1', 'firstname2', 'lastname2'])
        if (sd.data.denyLogin) {
            req.flash('loginMessage', 'Идентификация в данный момент запрещена')
            return res.redirect( '/login' )
        }
        var ok = true
        if (!(b.group && b.firstname1 && b.lastname1)) {
            req.flash('loginMessage', 'Поля "Номер группы", "Имя" и "Фамилия" (для студента 1) должны быть заполнены')
            ok = false
        }
        if (b.group && !b.group.match(/\d+\/\d+/)) {
            req.flash('loginMessage', 'Номер группы должен иметь формат 12345/6')
            ok = false
        }
        if ((b.firstname2?true:false) !== (b.lastname2?true:false)) {
            req.flash('loginMessage', 'Для второго студента следует задать либо имя и фамилию, либо ничего')
            ok = false
        }
        var team = new sd.Team(b)
        if (!sd.data.canAddTeam(team)) {
            team = sd.data.team(team.id())  // Pick existing team
            if (team && team.allowExtraLogin)
                team.allowExtraLogin = false
            else if (team) {
                req.flash('loginMessage', 'Эта команда уже зарегистрирована. Попросите у преподавателя разрешение на повторный вход, объясните причину.')
                ok = false
            }
            else {
                req.flash('loginMessage', 'Как минимум один студент из этой команды уже зарегистрирован. Повторный вход для всей команды возможен с разрешения преподавателя.')
                ok = false
            }
        }
        if (!ok)
            return res.redirect( '/login' )
        try {
            sd.data.addTeam(team)
        }
        catch(err) {
            req.flash('loginMessage', err.message)
            return res.redirect( '/login' )
        }
        req.session.teamId = team.id()
        res.redirect('/')
    })
    .get('/logout', function(req, res, next) {
        if (req.session.teamId) {
            var team = sd.data.team(req.session.teamId)
            if (team && !team.taskSolved)
                sd.data.setTaskAbandoned(req.session.teamId, true)
        }
        delete req.session.teamId
        res.redirect('/')
    })
    .use('/', function(req, res, next) {
        if (req.session.teamId && !sd.data.team(req.session.teamId))
            delete req.session.teamId
        if (!req.session.teamId)
            return res.redirect('/login')
        next()
    })

module.exports = router

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
        b = _.pick(b, ['group', 'firstname', 'lastname'])
        if (sd.data.denyLogin) {
            req.flash('loginMessage', 'Идентификация в данный момент запрещена')
            return res.redirect( '/login' )
        }
        var teamSize
        if (typeof b.firstname === 'string'   &&   typeof b.lastname === 'string') {
            b.firstname = [b.firstname]
            b.lastname = [b.firstname]
            teamSize = 1
        }
        else if ((b.firstname instanceof Array) && (b.lastname instanceof Array)) {
            if (b.firstname.length !== b.lastname.length) {
                req.flash('loginMessage', 'Неправильные данные')
                return res.redirect('/login')
            }
            teamSize = b.firstname.length
        }
        if (teamSize > sd.data.maxTeamSize) {
            req.flash('loginMessage', 'Слишком большая команда, максимально допустимое число студентов в команде: ' + sd.data.maxTeamSize)
            return res.redirect('/login')
        }
        if (teamSize === 0) {
            req.flash('loginMessage', 'В команде должен быть хотя бы один студент')
            return res.redirect('/login')
        }
        var members = []
        for (var i=0; i<teamSize; ++i) {
            members.push({firstname: b.firstname[i], lastname: b.lastname[i]})
        }
        var fieldsFilled = b.group? true: false
        members.forEach(function(member) {
            if (!member.firstname || !member.lastname)
                fieldsFilled = false
        })
        if (!fieldsFilled) {
            req.flash('loginMessage', 'Поля "Номер группы", "Имя" и "Фамилия" должны быть заполнены')
            return res.redirect('/login')
        }
        if (!b.group.match(/\d+\/\d+/)) {
            req.flash('loginMessage', 'Номер группы должен иметь формат 12345/6')
            return res.redirect('/login')
        }
        var team = new sd.Team({group: b.group, members: members})
        if (!sd.data.canAddTeam(team)) {
            team = sd.data.team(team.id())  // Pick existing team
            if (team && team.allowExtraLogin)
                team.allowExtraLogin = false
            else if (team) {
                req.flash('loginMessage', 'Эта команда уже зарегистрирована. Попросите у преподавателя разрешение на повторный вход, объясните причину.')
                return res.redirect( '/login' )
            }
            else {
                req.flash('loginMessage', 'Как минимум один студент из этой команды уже зарегистрирован. Повторный вход для всей команды возможен с разрешения преподавателя.')
                return res.redirect( '/login' )
            }
        }
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

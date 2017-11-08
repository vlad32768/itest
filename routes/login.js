var express = require('express');
var sd = require('./student-data.js')
var _ = require('lodash')

var router = express.Router();
router
    .get('/login', function(req, res, next) {
        res.render('login', {message: req.flash('loginMessage'), loginData: req.session.loginData || {}})
    })
    .post('/login', function(req, res, next) {
//        if (sd.data.denyIdentification)
//            return res.status(403).send('Идентификация в данный момент запрещена')
        var b = req.session.loginData = req.body
        b = _.pick(b, ['group', 'firstname1', 'lastname1', 'firstname2', 'lastname2'])
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
            req.flash('loginMessage', 'Как минимум один студент из этой команды уже зарегистрирован')
            ok = false
        }
        if (!ok)
            return res.redirect( '/login' )
        sd.data.addTeam(team)
        req.session.team = team
        req.session.teamId = team.id()
        res.redirect('/')
    })
    .get('/logout', function(req, res, next) {
        req.session.team = req.session.teamId = undefined
        res.redirect('/')
    })
    .use('/', function(req, res, next) {
        if (!req.session.teamId && !req.session.supervisor)
            return res.redirect('/login')
        next()
    })

module.exports = router

var express = require('express');
var router = express.Router();

var _ = require('lodash')

function Team(options) {
    _.merge(this, _.pick(options || {}, ['group', 'firstname1', 'lastname1', 'firstname2', 'lastname2']))
}

Team.prototype.keys = function() {
    var self = this
    function verbKey(firstName, lastName) {
        return (firstName + '#' + lastName).toLowerCase()
    }
    function key(firstName, lastName) {
        return [verbKey(firstName, lastName), verbKey(lastName, firstName)]
    }
    var keys = key(self.firstname1, self.lastname1)
    if (self.firstname2 && self.lastname2)
        keys = keys.concat(key(self.firstname2, self.lastname2))
    return keys
}

Team.prototype.id = function() {
    return _(this).pick(['group', 'firstname1', 'lastname1', 'firstname2', 'lastname2']).values().join('#')
}

function Data() {
    this.list = {}
    this.unsaved = false
}

var data = new Data()

Data.prototype.ids = function() {
    return _.keys(this.list)
}
Data.prototype.byid = function(id) {
    return this.list[id]
}
Data.prototype.canAddTeam = function(team) {
    var self = this
    return _.every(team.keys(), function(key) {
        return !self.list.hasOwnProperty(key)
    })
}
Data.prototype.addTeam = function(team) {
    var self = this
    _.each(team.keys(), function(key) {
        self.list[key] = team
    })
    this.unsaved = true
}

router
    .get('/login', function(req, res, next) {
        res.render('login', {message: req.flash('loginMessage'), loginData: req.session.loginData || {}})
    })
    .post('/login', function(req, res, next) {
//        if (data.denyIdentification)
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
        var team = new Team(b)
        if (!data.canAddTeam(team)) {
            req.flash('loginMessage', 'Как минимум один студент из этой команды уже зарегистрирован')
            ok = false
        }
        if (!ok)
            return res.redirect( '/login' )
        data.addTeam(team)
        req.session.team = team
        req.session.teamId = team.id()
        res.redirect('/')
    })
    .get('/logout', function(req, res, next) {
        req.session.team = req.session.teamId = undefined
        res.redirect('/')
    })
    .use('/', function(req, res, next) {
        if (!req.session.teamId)
            return res.redirect('/login')
        req.studentData = data
        next()
    })

module.exports = router

var _ = require('lodash')
var allTasks = require('./all-tasks.js')

function Team(options) {
    _.merge(this, _.pick(options || {}, ['group', 'firstname1', 'lastname1', 'firstname2', 'lastname2']))
    this.startTime = Date.now()
}

Team.prototype.keys = function() {
    var self = this
    function verbKey(firstName, lastName) {
        return (firstName + '-' + lastName).toLowerCase()
    }
    function key(firstName, lastName) {
        return [verbKey(firstName, lastName), verbKey(lastName, firstName)]
    }
    var keys = key(self.firstname1, self.lastname1)
    if (self.firstname2 && self.lastname2)
        keys = keys.concat(key(self.firstname2, self.lastname2))
    keys.push(self.id())
    return keys
}

Team.prototype.id = function() {
    return _(this).pick(['group', 'firstname1', 'lastname1', 'firstname2', 'lastname2']).values().join('-')
}

Team.prototype.summary = function() {
    var result = 'Группа ' + this.group + ', ' + this.firstname1 + ' ' + this.lastname1
    if (this.firstname2 && this.lastname2)
        result += ', ' + this.firstname2 + ' ' + this.lastname2
    return result
}

function Data() {
    this.version = 1
    this.list = {}
    this.unsaved = false
    this.denyLogin = true
    this.statusData = _.reduce(allTasks.allTaskIds(), function(o, taskId) {
        o[taskId] = { chosen: 0, blocked: false, solved: 0, abandoned: 0 }
        return o
    }, {})
}

Data.fromJson = function(d) {
    var version = d.version || 0
    var result = new Data
    for (var key in d.list) {
        if (result.list.hasOwnProperty(key))
            continue
        var team = new Team
        _.merge(team, d.list[key])
        switch (version) {
        case 0:
            team.taskId = 'test-01-so:' + (team.taskIndex+1)
            result.statusData[team.taskId].chosen = true
            break
        }
        result.addTeam(team, version)
    }
    _.assign(result.statusData, d.statusData)
    result.unsaved = false
    result.denyLogin = true
    return result
}

var data = new Data()

Data.prototype.ids = function() {
    return _.keys(this.list)
}
Data.prototype.team = function(id) {
    return this.list[id]
}
Data.prototype.canAddTeam = function(team) {
    var self = this
    return _.every(team.keys(), function(key) {
        return !self.list.hasOwnProperty(key)
    })
}
Data.prototype.taskStats = function() {
    return _.reduce(this.statusData, function(o, st) {
        if (!st.blocked)
            ++o[st.chosen? ( st.solved? 2: st.abandoned? 1: 3 ): 0]
        return o
    }, [0, 0, 0, 0])
}
Data.prototype.taskStatsObj = function() {
    var stats = this.taskStats()
    return {
        unchosen: stats[0],
        abandoned: stats[1],
        solved: stats[2],
        inprogress: stats[3]
    }
}

Data.prototype.addTeam = function(team) {
    if (!team.taskId) {
        // Generate task for the team
        var stats = this.taskStats()
        var filters = [
            function(st) { return !st.blocked && !st.chosen },
            function(st) { return !st.blocked && st.chosen && st.abandoned },
            function(st) { return !st.blocked && st.chosen && st.solved },
            function(st) { return !st.blocked && st.chosen && !st.abandoned && !st.solved }
        ]
        var filterIndex = _.findIndex(stats, function(x) { return x > 0})
        if (filterIndex === -1)
            throw new Error('Для Вас не хватило задания :\'(<br/>Приходите в другой раз!')
        var taskIndex = Math.floor(Math.random() * stats[filterIndex])
        team.taskId = _(this.statusData).pickBy(filters[filterIndex]).keys().nth(taskIndex)
        this.statusData[team.taskId].chosen++
    }


    // Add team keys
    var self = this
    _.each(team.keys(), function(key) {
        self.list[key] = team
    })

    // Mark as unsaved
    this.unsaved = true
}
Data.prototype.removeTeam = function(team) {
    var self = this
    _.each(team.keys(), function(key) {
        delete self.list[key]
    })
    self.statusData[team.taskId].chosen--
    this.unsaved = true
}
Data.prototype.teams = function() {
    var self = this
    var teams = _.values(self.list)
    teams.sort(function(a,b) {
        return a.id().localeCompare(b.id())
    })
    return _.sortedUniqBy(teams, function(team) { return team.id() })
}

Data.prototype.taskSetStatus = function(taskSet)
{
    var taskSetFilter = allTasks.taskSetFilter(taskSet)
    var n = _.reduce(this.statusData, function(s, st, key) {
        if (!st.blocked && taskSetFilter(key))
            ++s;
        return s;
    }, 0)
    return n === 0? 'disabled': 'enabled'
}

Data.prototype.enableTaskSet = function(taskSet, enable) {
    var taskSetFilter = allTasks.taskSetFilter(taskSet)
    _.each(this.statusData, function(st, key) {
        if (taskSetFilter(key))
            st.blocked = !enable
    })
    this.unsaved = true
}

Data.prototype.taskStatus = function(taskId)
{
    return this.statusData[taskId]
}

Data.prototype.taskStatusFormatted = function(taskId)
{
    return _.reduce(this.statusData[taskId], function(o, v, k) {
        if (v && k !== 'blocked') {
            if (typeof v === 'boolean')
                o.push(k)
            else
                o.push(k + ': ' + v)
        }
        return o
    }, []).join(', ')
}

Data.prototype.enableTask = function(taskId, enable) {
    this.statusData[taskId].blocked = !enable
    this.unsaved = true
}

Data.prototype.setTaskSolved = function(teamId, taskSolved) {
    var team = this.team(teamId)
    team.taskSolved = taskSolved
    this.statusData[team.taskId].solved += (taskSolved? 1: -1)
    this.unsaved = true
}

Data.prototype.setTaskAbandoned = function(teamId, taskAbandoned) {
    var team = this.team(teamId)
    team.taskAbandoned = taskAbandoned
    this.statusData[team.taskId].abandoned += (taskAbandoned? 1: -1)
    this.unsaved = true
}

module.exports = {
    Team: Team,
    Data: Data,
    data: data
}

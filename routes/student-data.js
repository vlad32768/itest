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
    this.list = {}
    this.unsaved = false
    this.taskStatus = _.reduce(allTasks.allTaskIds(), function(o, taskId) {
        o[taskId] = { chosen: false, blocked: false, solved: false, abandoned: false }
        return o
    }, {})
}

Data.fromJson = function(d) {
    var result = new Data
    for (var key in d.list) {
        if (result.list.hasOwnProperty(key))
            continue
        var team = new Team
        _.merge(team, d.list[key])
        // TODO: Fix task id
        result.addTeam(team)
    }
    _.assign(result.taskStatus, d.taskStatus)
    result.unsaved = false
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
Data.prototype.addTeam = function(team) {
    // Add team keys
    var self = this
    _.each(team.keys(), function(key) {
        self.list[key] = team
    })
    // Generate task for the team
    var stats = _.reduce(self.taskStatus, function(o, st) {
        if (!st.blocked) {
            var index = st.chosen? ( st.solved? 2: st.abandoned? 1: 3 ): 0
            ++o[index]
            return o
        }
    }, [0, 0, 0, 0])
    var filters = [
        function(st) { return !st.blocked && !st.chosen },
        function(st) { return !st.blocked && st.chosen && st.abandoned },
        function(st) { return !st.blocked && st.chosen && st.solved },
        function(st) { return !st.blocked && st.chosen && !st.abandoned && !st.solved }
    ]
    var filterIndex = _.findIndex(stats, function(x) { return x > 0})
    if (filterIndex === -1)
        throw new Error('Failed to add team: no more tasks are available.')
    var taskIndex = Math.floor(Math.random() * stats[filterIndex])
    team.taskId = _(self.taskStatus).keys().filter(filters[filterIndex]).nth(taskIndex)
    self.taskStatus[team.taskId].chosen = true

    // Mark as unsaved
    self.unsaved = true
}
Data.prototype.removeTeam = function(team) {
    var self = this
    _.each(team.keys(), function(key) {
        delete self.list[key]
    })
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
    var n = _.reduce(this.taskStatus, function(s, st, key) {
        if (!st.blocked && taskSetFilter(key))
            ++s;
        return s;
    }, 0)
    return n === 0? 'disabled': 'enabled'
}

Data.prototype.enableTaskSet = function(taskSet, enable) {
    var taskSetFilter = allTasks.taskSetFilter(taskSet)
    _.each(this.taskStatus, function(st, key) {
        if (taskSetFilter(key))
            st.blocked = !enable
    })
}

Data.prototype.taskStatus = function(taskId)
{
    return this.taskStatus[taskId]
}

Data.prototype.taskStatusFormatted = function(taskId)
{
    return _.reduce(this.taskStatus[taskId], function(o, v, k) {
        if (v)
            o.push(k)
    }, []).join(', ')
}

Data.prototype.enableTask = function(taskId, enable) {
    this.taskStatus[taskId].blocked = !enable
}

module.exports = {
    Team: Team,
    Data: Data,
    data: data
}

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
    this.availableTasks = allTasks.util.allTaskIds()
    this.chosenTasks = []
    this.disabledTasks = []
}

Data.fromJson = function(d) {
    var result = new Data
    for (var key in d.list) {
        if (result.list.hasOwnProperty(key))
            continue
        var team = new Team
        _.merge(team, d.list[key])
        result.addTeam(team)
    }
    result.taskIndices = d.taskIndices
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
    if (this.availableTasks.length === 0) {
        this.availableTasks = allTaskIds()
        this.chosenTasks = []
    }
    var i = Math.floor(Math.random() * this.availableTasks.length)
    var taskId = this.availableTasks.splice(i, 1)[0]
    _.merge(team, taskId)
    this.chosenTasks.push(taskId)

    // Mark as unsaved
    this.unsaved = true
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
    var i = _.findIndex(this.disabledTasks, allTasks.util.filterTaskSet(taskSet))
    return i === -1? 'enabled': 'disabled'
}

Data.prototype.enableTaskSet = function(taskSet, enable) {
    var filter = allTasks.util.filterTaskSet(taskSet)
    _.remove(this.disabledTasks, filter)
    _.remove(this.availableTasks, filter)
    var ids = allTasks.util.taskIds(taskSet)
    if (enable) {
        this.chosenTasks.forEach(function(taskId) {
            _.remove(ids, allTasks.util.filterTaskId(taskId))
        })
        this.availableTasks = this.availableTasks.concat(ids)
    }
    else {
        this.disabledTasks = this.disabledTasks.concat(ids)
    }
}

Data.prototype.taskStatus = function(taskId)
{
    var filter = allTasks.util.filterTaskId(taskId)
    var i = _.findIndex(this.chosenTasks, filter)
    if (i !== -1)
        return 'chosen'
    i = _.findIndex(this.availableTasks, filter)
    if (i !== -1)
        return 'available'
    i = _.findIndex(this.disabledTasks, filter)
    if (i !== -1)
        return 'disabled'
    return 'unknown'
}

Data.prototype.enableTask = function(taskId, enable) {
    // TODO
}

module.exports = {
    Team: Team,
    Data: Data,
    data: data
}

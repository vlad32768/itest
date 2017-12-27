var _ = require('lodash')
var allTasks = require('./all-tasks.js')

function Team(options) {
    _.merge(this, _.pick(options || {}, ['group', 'members']))
    this.tasks = []
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
    var keys = []
    self.members.forEach(function(member) {
        keys = keys.concat(key(member.firstname, member.lastname))
    })
    keys.push(self.id())
    return keys
}

Team.prototype.id = function() {
    var items = [this.group]
    this.members.forEach(function(member) {
        items.push(member.firstname + '-' + member.lastname)
    })
    return items.join('-')
}

Team.prototype.summary = function() {
    var items = ['Группа ' + this.group]
    this.members.forEach(function(member) {
        items.push(member.firstname + ' ' + member.lastname)
    })
    return items.join(', ')
}

Team.prototype.task = function(taskIndex) {
    var teamTask = this.tasks[taskIndex]
    if (!teamTask)
        throw new Error('Invalid team task index')
    return teamTask
}

function Data() {
    this.version = 2
    this.list = {}
    this.unsaved = false
    this.denyLogin = true
    this.maxTeamSize = 2
    this.maxTasksPerTeam = 1
    this.allowAllTasksAtOnce = false
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
        var teamData = d.list[key]
        if (version < 2) {
            var members = [{firstname: teamData.firstname1, lastname: teamData.lastname1, mark: teamData.mark || ''}]
            if (teamData.firstname2)
                members.push({firstname: teamData.firstname2, lastname: teamData.lastname2, mark: teamData.mark || ''})
            var newTeamData =  _.pick(teamData, ['group', 'startTime'])
            if (version === 0   &&   teamData.taskIndex !== undefined)
                teamData.taskId = 'test-01-so:' + (teamData.taskIndex+1)
            newTeamData.tasks = teamData.taskId?  [{
                id:  teamData.taskId,
                solved: teamData.taskSolved,
                abandoned: teamData.taskAbandoned,
                result: teamData.result || ''
            }]: []
            newTeamData.members = members
            teamData = newTeamData
        }
        _.merge(team, teamData)
        result.addTeam(team, version)
    }
    _.assign(result.statusData, d.statusData)
    _.merge(result, _.pick(d, 'maxTeamSize', 'maxTasksPerTeam', 'allowAllTasksAtOnce'))
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

Data.prototype.allocTask = function(team) {
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
    var taskId = _(this.statusData).pickBy(filters[filterIndex]).keys().nth(taskIndex)
    team.tasks.push({id: taskId})
    this.statusData[taskId].chosen++
}

Data.prototype.addTeam = function(team) {
    var self = this
    if (team.tasks.length === 0)
        self.allocTask(team)

    // Add team keys
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
    _.each(team.tasks, function(teamTask) {
        self.statusData[teamTask.id].chosen--
    })
    self.unsaved = true
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

Data.prototype.hasUnblockedTasks = function() {
    return _.some(this.statusData, function(d) { return !d.blocked })
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

Data.prototype.enableTasks = function(filter, enable) {
    var self = this
    _.each(allTasks.taskIds(filter), function(taskId) {
        self.statusData[taskId].blocked = !enable
    })
    self.unsaved = true
}

Data.prototype.setTaskSolved = function(teamId, taskIndex, taskSolved) {
    var teamTask = this.team(teamId).task(taskIndex)
    teamTask.solved = taskSolved
    this.statusData[teamTask.id].solved += (taskSolved? 1: -1)
    this.unsaved = true
}

Data.prototype.setTaskAbandoned = function(teamId, taskIndex, taskAbandoned) {
    var teamTask = this.team(teamId).task(taskIndex)
    teamTask.abandoned = taskAbandoned
    this.statusData[teamTask.id].abandoned += (taskAbandoned? 1: -1)
    this.unsaved = true
}

module.exports = {
    Team: Team,
    Data: Data,
    data: data
}

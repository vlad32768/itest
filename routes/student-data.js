var _ = require('lodash')
var allTasks = require('./all-tasks.js')

function Team(options) {
    _.merge(this, _.pick(options || {}, ['group', 'members', 'startComplexityIndex']))
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
    if (typeof this.startComplexityIndex === 'number')
        items.push('бонусов ' + this.startComplexityIndex)
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
    this.growingTaskComplexity = false
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
    _.merge(result, _.pick(d, 'maxTeamSize', 'maxTasksPerTeam', 'allowAllTasksAtOnce', 'growingTaskComplexity'))
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
Data.prototype.tasksForTeam = function(team, index) {
    var isBlocked
    if (typeof team.startComplexityIndex === 'number') {
        var complexityIndex = index + team.startComplexityIndex
        var isBlockedByComplexity = complexityIndex < 1?
                function(tagsObject) { return !('complexity-1' in tagsObject   ||   'complexity-2' in tagsObject) }:
            complexityIndex > 1?
                function(tagsObject) { return !('complexity-4' in tagsObject   ||   'complexity-5' in tagsObject) }:
                function(tagsObject) { return !('complexity-3' in tagsObject) }
        isBlocked = function(st, taskId) {
            return st.blocked?   true:   isBlockedByComplexity(allTasks.tasks()[taskId].tagsObject())
        }
    }
    else
        isBlocked = function(st, taskId) { return st.blocked }
    var availableTaskIds = []
    var stats = [0, 0, 0, 0]
    var filter = function(st, taskId) {
        return !_.some(team.tasks, function(teamTask) { return teamTask.id === taskId }) && !isBlocked(st, taskId)
    }
    _.each(this.statusData, function(st, taskId) {
        if (filter(st, taskId)) {
            ++stats[st.chosen? ( st.solved? 2: st.abandoned? 1: 3 ): 0]
            availableTaskIds.push(taskId)
        }
    })
    return { stats: stats, filter: filter }
}

Data.prototype.taskStats = function(team, index) {
    return _.reduce(this.statusData, function(o, st, taskId) {
        if (!st.blocked) {
            ++o[st.chosen? ( st.solved? 2: st.abandoned? 1: 3 ): 0]
            var tagsObject = allTasks.tasks()[taskId].tagsObject()
            if ('complexity-1' in tagsObject   ||   'complexity-2' in tagsObject)
                ++o[4]
            else if ('complexity-3' in tagsObject)
                ++o[5]
            else if ('complexity-4' in tagsObject   ||   'complexity-5' in tagsObject)
                ++o[6]
        }
        return o
    }, [0, 0, 0, 0,   0, 0, 0])
}

Data.prototype.taskStatsObj = function() {
    var stats = this.taskStats.apply(this, arguments)
    return {
        unchosen: stats[0],
        abandoned: stats[1],
        solved: stats[2],
        inprogress: stats[3],
        availableLo: stats[4],
        availableMed: stats[5],
        availableHi: stats[6],
    }
}

Data.prototype.allocTask = function(team) {
    // Generate task for the team
    var t4t = this.tasksForTeam(team, team.tasks.length)
    var filters = [
        function(st) { return !st.blocked && !st.chosen },
        function(st) { return !st.blocked && st.chosen && st.abandoned },
        function(st) { return !st.blocked && st.chosen && st.solved },
        function(st) { return !st.blocked && st.chosen && !st.abandoned && !st.solved }
    ]
    var filterIndex = _.findIndex(t4t.stats, function(x) { return x > 0})
    if (filterIndex === -1)
        throw new Error('Для Вас не хватило задания :\'(<br/>Приходите в другой раз!')
    var filter = filters[filterIndex]
    var taskIds = _(this.statusData).pickBy(function(st, taskId) {
        return filter(st) && t4t.filter(st, taskId)
    }).keys().value()
    if (taskIds.length === 0)
        throw new Error('Для Вас ВНЕЗАПНО не хватило задания :\'(<br/>Расскажите об этом преподавателю!')
    var taskIndex = Math.floor(Math.random() * taskIds.length)
    var taskId = taskIds[taskIndex]
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

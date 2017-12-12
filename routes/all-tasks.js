var fs = require('fs')
var path = require('path')
var _ = require('lodash')

var tasksDir = path.join(__dirname, '..', 'tasks')

var tasks = {}
var taskSetDescriptions = {}

;(function() {
    fs.readdirSync(path.join(tasksDir)).forEach(function(id) {
        var taskSet = require(path.join(tasksDir, id))
        var dirTasks = taskSet.data.items
        id = id.replace(/\.js$/, '')
        taskSetDescriptions[id] = taskSet.data.description
        for (var i=0, n=dirTasks.length; i<n; ++i)
            tasks[id + ':' + (i+1)] = dirTasks[i]
    })
})()

function taskSetFilter(taskSet) {
    var rx = new RegExp('^' + taskSet + ':')
    return function (taskId) {
        return  taskId.match(rx)
    }
}

function taskIdFilter(taskId) {
    return function (taskId2) {
        return  taskId2 === taskId
    }
}

function allTaskIds() {
    return _.keys(tasks)
}

function taskIds(taskSet) {
    return _.filter(allTaskIds(), taskSetFilter(taskSet))
}

function taskSets() {
    return _(allTaskIds()).reduce(function(o, taskId) {
        var taskSetId = taskId.match(/^([^:]+):/)[1]
        var d = o[taskSetId]
        if (d === undefined)
            d = o[taskSetId] = []
        d.push(taskId)
        return o
    }, {})
}

function taskSetDescription(taskSet) {
    return taskSetDescriptions[taskSet]
}

module.exports = {
    tasks: function() { return tasks },
    taskIds: taskIds,
    allTaskIds: allTaskIds,
    taskSetFilter: taskSetFilter,
    taskIdFilter: taskIdFilter,
    taskSets: taskSets,
    taskSetDescription: taskSetDescription
}

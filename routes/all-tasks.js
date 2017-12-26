var fs = require('fs')
var path = require('path')
var _ = require('lodash')

var tasksDir = path.join(__dirname, '..', 'tasks')

var tasks = {}
var taskSetDescriptions = {}
var taskTags = []

;(function() {
    var taskTagsObject = {}
    fs.readdirSync(path.join(tasksDir)).forEach(function(id) {
        var taskSet = require(path.join(tasksDir, id))
        var dirTasks = taskSet.data.items
        id = id.replace(/\.js$/, '')
        taskSetDescriptions[id] = taskSet.data.description
        for (var i=0, n=dirTasks.length; i<n; ++i) {
            var task = dirTasks[i]
            _.each(task.tags(), function(tag) {
                taskTagsObject[tag] = true
            })
            tasks[id + ':' + (i+1)] = task
        }
    })
    taskTags = _.keys(taskTagsObject).sort()
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
    taskTags: function() { return taskTags },
    allTaskIds: allTaskIds,
    taskSetFilter: taskSetFilter,
    taskIdFilter: taskIdFilter,
    taskSets: taskSets,
    taskSetDescription: taskSetDescription
}

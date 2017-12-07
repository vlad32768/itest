var fs = require('fs')
var path = require('path')
var _ = require('lodash')

var tasksDir = path.join(__dirname, '..', 'tasks')

var ids = fs.readdirSync(path.join(tasksDir))
var lists = {}

debugger

;(function() {
    for (var i=0; i<ids.length; ++i) {
        var id = ids[i]
        ids[i] = id = id.replace(/\.js$/, '')
        lists[id] = require(path.join(tasksDir, id))
    }
})()

function addTaskIds(dst, taskSet) {
    var list = lists[taskSet]
    for (var i=0, n=list.length(); i<n; ++i)
        dst.push({taskIndex: i, taskSet: taskSet})
}

function taskIds(taskSet) {
    var result = []
    addTaskIds(result, taskSet)
    return result
}

function allTaskIds() {
    var result = []
    ids.forEach(function(taskSet) {
        addTaskIds(result, taskSet)
    })
    return result
}

function compareTaskSets(a, b) {
    return a.taskSet === b.taskSet
}

function compareTaskIds(a, b) {
    return a.taskIndex === b.taskIndex   &&   a.taskSet === b.taskSet
}

function filterTaskSet(taskSet) {
    return function (taskId) {
        return taskSet === taskId.taskSet
    }
}

function filterTaskId(taskId) {
    return compareTaskIds.bind(this, taskId)
}

module.exports = {
    ids: ids,
    lists: lists,
    util: {
        taskIds: taskIds,
        allTaskIds: allTaskIds,
        filterTaskSet: filterTaskSet,
        filterTaskId: filterTaskId
    }
}

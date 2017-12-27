var csc = require('./console-scene.js')
var prog = require('./program-scene.js')
var pgen = require('./pgen.js')
var _ = require('lodash')

var sceneClasses = {
    'shapes': csc.Scene.fromObject,
    'program': prog.Program.fromObject
}

function Task(data) {
    this.data = data
    this.data.tagsObject = _.reduce(this.data.tags || [], function(o, tag) { o[tag] = true; return o }, {})
}

Task.fromObject = function(o) {
    return new Task( {
        text: o.text,
        scene: pgen(sceneClasses, o.scene),
        stdin: o.stdin,
        stdinHint: o.stdinHint,
        options: o.options || {},
        tags: o.tags || []
    })
}
Task.prototype.text = function() {
    return this.data.text
}
Task.prototype.scene = function() {
    return this.data.scene
}
Task.prototype.stdin = function() {
    return this.data.stdin
}
Task.prototype.stdinHint = function() {
    return this.data.stdinHint
}
Task.prototype.tags = function() {
    return this.data.tags
}
Task.prototype.addTag = function(tag) {
    this.data.tags.push(tag)
    this.data.tagsObject[tag] = true
    return this
}
Task.prototype.tagsObject = function() {
    return this.data.tagsObject
}
Task.prototype.options = function() {
    return this.data.options
}

function Tasks(data) {
    this.data = data
}
Tasks.fromObject = function(o) {
    var data = { description: o.description || '', items: [], options: o.options || {}, tags: o.tags || [] }
    o.items.forEach(function(item) {
        var task = Task.fromObject(item)
        _.extend(task.data.options, data.options)
        task.data.tags = task.data.tags.concat(data.tags)
        data.items.push(task)
    })
    return new Tasks(data)
}
Task.prototype.description = function() {
    return this.data.description
}
Tasks.prototype.length = function() {
    return this.data.items.length
}
Tasks.prototype.task = function(index) {
    return this.data.items[index]
}

module.exports = {
    Task: Task,
    Tasks: Tasks
}

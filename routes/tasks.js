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
}

Task.fromObject = function(o) {
    return new Task( {
        text: o.text,
        scene: pgen(sceneClasses, o.scene),
        stdin: o.stdin,
        stdinHint: o.stdinHint,
        options: o.options || {}
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
Task.prototype.options = function() {
    return this.data.options
}

function Tasks(data) {
    this.data = data
}
Tasks.fromObject = function(o) {
    var data = { description: o.description || '', items: [], options: o.options || {} }
    o.items.forEach(function(item) {
        var task = Task.fromObject(item)
        _.extend(task.data.options, data.options)
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

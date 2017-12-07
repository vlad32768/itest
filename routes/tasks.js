var csc = require('./console-scene.js')
var prog = require('./program-scene.js')
var pgen = require('./pgen.js')

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

function Tasks(data) {
    this.data = data
}
Tasks.fromObject = function(o) {
    var data = []
    o.forEach(function(item) {
        data.push(Task.fromObject(item))
    })
    return new Tasks(data)
}
Tasks.prototype.length = function() {
    return this.data.length
}
Tasks.prototype.task = function(index) {
    return this.data[index]
}

module.exports = {
    Task: Task,
    Tasks: Tasks
}

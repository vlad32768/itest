var csc = require('./console-scene.js')

function Task(data) {
    this.data = data
}
Task.fromObject = function(o) {
    return new Task( {
        text: o.text,
        scene: csc.Scene.fromObject(o.scene)
    })
}
Task.prototype.text = function() {
    return this.data.text
}

Task.prototype.scene = function() {
    return this.data.scene
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
    Tasks: Tasks,
    list: Tasks.fromObject([
        {
            text: 'Нарисуйте "равносторонний" треугольник. Нижняя сторона горизонтальна, высота равна 1/2',
            scene: {
                shapes: [
                    { geometry: ['regular', {center: {x: 0.5, y: 0.5}, n: 3, radius: 0.3, phase: 90}], fill: '#' }
                ],
                background: '.'
            }
        }, {
            text: 'Нарисуйте кольцо на фоне прямоугольника, занимающего верхнюю половину экрана.',
            scene: {
                shapes: [
                    { geometry: ['rect', {x: 0, y: 0.5, w: 1, h: 0.5001}], fill: '/' },
                    { geometry: ['d', {a: ['circle', {center: { x: 0.5, y: 0.5 }, radius: 0.4 }], b: ['circle', {center: { x: 0.5, y: 0.5 }, radius: 0.2 }]}], fill: 'o' },
                ],
                background: '.'
            }
        }
    ])
}

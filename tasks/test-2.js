var tasks = require('../routes/tasks.js')

module.exports = tasks.Tasks.fromObject([
    // TODO
    {
        text: 'Сделайте вот так',
        scene: ['program', {name: 'p1'}],
        stdin: 'asd'
    }
])


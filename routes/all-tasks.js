var fs = require('fs')
var path = require('path')

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

module.exports = {
    ids: ids,
    lists: lists
}

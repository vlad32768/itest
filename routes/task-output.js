var express = require('express');
var router = express.Router();
var csc = require('./console-scene.js')
var tsk = require('./tasks.js')
var sd = require('./student-data.js')
var _ = require('lodash')
var util = require('./util.js')

/* GET home page. */
router
    .get('/task-output', function(req, res, next) {
        var n = util.clamp(req.query.n, 0, tsk.list.length()-1, 0)
        var w = util.clamp(req.query.width, 1, 160, 80)
        var h = util.clamp(req.query.height, 1, 50, 24)
        var task = tsk.list.task(n)
        res.send(JSON.stringify({
            width: w,
            height: h,
            data: task.scene().paint(w, h)
        }))
    })

module.exports = router

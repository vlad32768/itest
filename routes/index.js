var express = require('express');
var router = express.Router();
var csc = require('./console-scene.js')

/*
var scene = new csc.Scene({
    shapes: [
        new csc.Shape({
            geometry: new csc.geom.Rectangle({x: 0.3, y: 0.3, w: 0.3, h:0.3}),
            fill: new csc.fill.SolidFill('#')
        }),
        new csc.Shape({
            geometry: new csc.geom.SemiPlane({r1: {x: 0.2, y: 0}, r2: {x: 0.8, y: 1}}),
            fill: new csc.fill.SolidFill('*')
        }),
        new csc.Shape({
            geometry: new csc.geom.Ellipse.circle({center: {x: 0.8, y: 0.2}, radius: 0.15}),
            fill: new csc.fill.SolidFill('o')
        }),
        new csc.Shape({
            geometry: new csc.geom.Convex([
                {x: 0.1, y: 0.1},
                {x: 0.5, y: 0.1},
                {x: 0.3, y: 0.5}
            ]),
            fill: new csc.fill.PatternFill(['=+:', '$^'])
        }),
        new csc.Shape({
            geometry: csc.geom.Convex.regular({
                center: { x: 0.3, y: 0.7 },
                radius: 0.25,
                n: 5,
                phase: 0
            }),
            fill: new csc.fill.PatternFill(['(:)'])
        })
    ],
    // background: new csc.fill.SolidFill('.')
    background: new csc.fill.PatternFill(['.....~~~~~', '.....~~~~~', '.....~~~~~', '~~~~~.....', '~~~~~.....', '~~~~~.....'])
})
*/

var scene = csc.Scene.fromObject({
    shapes: [/*{
            geometry: ['w', { amp: 0.2, length: 1, phase: 0, bias: 0.5 }],
            fill: '@'
        }, {
            geometry: ['d', {
                a: ['t', {dx: 0.5, dy: 0.5, source: ['circle', {radius: 0.3}]}],
                b: ['t', {dx: 0.5, dy: 0.5, source: ['r', {angle: 10, source: ['square', {size: 0.3}]}]}]
            }],
            fill: 'o'
        }, */{
            geometry: ['star', {center: {x: 0.5, y: 0.5}, n: 5, radius: 0.5, phase: 90}],
            fill: '#'
        }],
    background: ['----====', '----====', '====----', '====----']
    })

/* GET home page. */
router
    .get('/', function(req, res, next) {
        res.render('index', { title: 'Express' })
    })
    .get('/task', function(req, res, next) {
        res.render('task', { title: 'Task' })
    })
    .get('/task-output', function(req, res, next) {
        function clamp(x, xmin, xmax, xdefault) {
            if (x === undefined)
                return xdefault
            x = +x
            return x<xmin? xmin: x>xmax? xmax: x
        }
        var w = clamp(req.query.width, 1, 160, 80)
        var h = clamp(req.query.height, 1, 50, 24)
        res.send(JSON.stringify({
            width: w,
            height: h,
            data: scene.paint(w, h)
        }))
    })

module.exports = router;

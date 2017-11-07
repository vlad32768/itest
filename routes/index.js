var express = require('express');
var router = express.Router();

function Rectangle(data) {
    this.data = data
}
Rectangle.prototype.contains = function(x, y)
{
    return x >= this.data.x && x < this.data.x + this.data.w && y >=this.data.y && y < this.data.y + this.data.h
}

function SemiPlane(data) {
    this.data = data
}

SemiPlane.prototype.contains = function(x, y) {
    var ax = this.data.r2.x - this.data.r1.x
    var ay = this.data.r2.y - this.data.r1.y
    var bx = x - this.data.r1.x
    var by = y - this.data.r1.y
    return ax*by - ay*bx > 0
}

function Ellipse(data) {
    this.data = data
}

Ellipse.circle = function(data) {
    var r = data.radius || 0.1
    return new Ellipse({
        center: data.center || { x: 0.5, y: 0.5 },
        rx: r,
        ry: r,
    })
}

Ellipse.prototype.contains = function(x, y) {
    var xc = x - this.data.center.x
    var yc = y - this.data.center.y
    return xc*xc/(this.data.rx*this.data.rx) + yc*yc/(this.data.ry*this.data.ry) < 1
}

function Convex(xy) {
    this.data = []
    for(var i=0, n=xy.length; i<n; ++i) {
        this.data.push(new SemiPlane({r1: xy[i], r2: xy[(i+1)%n]}))
    }
}
Convex.regular = function(data) {
    var c = data.center || { x: 0.5, y: 0.5 }
    var n = data.n || 3
    var r = data.radius || 0.1
    var phase = (data.phase || 0)*Math.PI/180
    var xy = []
    for (var i=0; i<n; ++i) {
        var phi = phase + i/n*Math.PI*2
        xy.push({x: c.x + r*Math.cos(phi), y: c.y + r*Math.sin(phi)})
    }
    return new Convex(xy)
}

Convex.prototype.contains = function(x, y)
{
    var contains = true
    this.data.forEach(function(line) {
        contains = contains && line.contains(x, y)
    })
    return contains
}


function SolidFill(color) {
    this.data = color
}

SolidFill.prototype.color = function(X, Y) {
    return this.data
}

function PatternFill(pattern) {
    this.data = pattern
}

PatternFill.prototype.color = function(X, Y) {
    var d = this.data
    var line = d[Y % d.length]
    return line[X % line.length]
}

function Shape(data) {
    this.data = data
}
Shape.prototype.geometry = function() {
    return this.data.geometry
}
Shape.prototype.fill = function() {
    return this.data.fill
}

function Scene(data) {
    this.data = {}
    if (data) {
        this.data.shapes = data.shapes || []
        this.data.background = data.background || new SolidFill('.')
    }
}

Scene.prototype.paint = function(w, h) {
    var lines = []
    for (var Y=0; Y<h; ++Y)
    {
        var y = 1-Y/h
        var line = ''
        for (var X=0; X<w; ++X) {
            var x = X/w
            var color = this.data.background.color(X, Y)
            this.data.shapes.forEach(function(shape) {
                if (shape.geometry().contains(x, y))
                    color = shape.fill().color(X, Y)
            })
            line += color
        }
        lines.push(line)
    }
    return lines.join('\n')
}

var scene = new Scene({
    shapes: [
        new Shape({
            geometry: new Rectangle({x: 0.3, y: 0.3, w: 0.3, h:0.3}),
            fill: new SolidFill('#')
        }),
        new Shape({
            geometry: new SemiPlane({r1: {x: 0.2, y: 0}, r2: {x: 0.8, y: 1}}),
            fill: new SolidFill('*')
        }),
        new Shape({
            geometry: new Ellipse.circle({center: {x: 0.8, y: 0.2}, radius: 0.15}),
            fill: new SolidFill('o')
        }),
        new Shape({
            geometry: new Convex([
                {x: 0.1, y: 0.1},
                {x: 0.5, y: 0.1},
                {x: 0.3, y: 0.5}
            ]),
            fill: new PatternFill(['=+:', '$^'])
        }),
        new Shape({
            geometry: Convex.regular({
                center: { x: 0.3, y: 0.7 },
                radius: 0.25,
                n: 5,
                phase: 0
            }),
            fill: new PatternFill(['(:)'])
        })
    ],
    // background: new SolidFill('.')
    background: new PatternFill(['.....~~~~~', '.....~~~~~', '.....~~~~~', '~~~~~.....', '~~~~~.....', '~~~~~.....'])
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

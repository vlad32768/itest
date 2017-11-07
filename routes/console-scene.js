function Geom() {}



function Rectangle(data) {
    this.data = data
}

Rectangle.fromObject = function(o) {
    return new Rectangle(o)
}

Rectangle.square = function(data) {
    var r = 0.5*(data.size || 0.1)
    var c = data.center || { x: 0, y: 0 }
    return new Rectangle({
        x: c.x - r, y: c.y - r, w: 2*r, h: 2*r
    })
}

Rectangle.square.fromObject = function(o) {
    return Rectangle.square(o)
}

Rectangle.prototype.contains = function(x, y)
{
    return x >= this.data.x && x < this.data.x + this.data.w && y >=this.data.y && y < this.data.y + this.data.h
}

function Ellipse(data) {
    this.data = data
}

Ellipse.fromObject = function(o) {
    return new Ellipse(o)
}

Ellipse.circle = function(data) {
    var r = data.radius || 0.1
    return new Ellipse({
        center: data.center || { x: 0, y: 0 },
        rx: r,
        ry: r,
    })
}

Ellipse.circle.fromObject = function(o) {
    return Ellipse.circle(o)
}

Ellipse.prototype.contains = function(x, y) {
    var xc = x - this.data.center.x
    var yc = y - this.data.center.y
    return xc*xc/(this.data.rx*this.data.rx) + yc*yc/(this.data.ry*this.data.ry) < 1
}

function SemiPlane(data) {
    this.data = data
}

SemiPlane.fromObject = function(o) {
    return new SemiPlane(o)
}

SemiPlane.prototype.contains = function(x, y) {
    var ax = this.data.r2.x - this.data.r1.x
    var ay = this.data.r2.y - this.data.r1.y
    var bx = x - this.data.r1.x
    var by = y - this.data.r1.y
    return ax*by - ay*bx > 0
}

function Convex(xy) {
    this.data = []
    for(var i=0, n=xy.length; i<n; ++i) {
        this.data.push(new SemiPlane({r1: xy[i], r2: xy[(i+1)%n]}))
    }
}

Convex.fromObject = function(o) {
    return new Convex(o)
}

Convex.regular = function(data) {
    var c = data.center || { x: 0, y: 0 }
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

Convex.regular.fromObject = function(o) {
    return Convex.regular(o)
}

Convex.prototype.contains = function(x, y)
{
    var contains = true
    this.data.forEach(function(line) {
        contains = contains && line.contains(x, y)
    })
    return contains
}

function Wave(data) {
    this.data = data
}

Wave.fromObject = function(o) {
    return new Wave(o)
}

Wave.prototype.contains = function(x, y) {
    var v = this.data.bias + this.data.amp*Math.sin(x*this.data.length*2*Math.PI + this.data.phase)
    return y < v
}



function Translate(data) {
    this.data = data
}

Translate.fromObject = function(o) {
    o.source = Geom.fromObject(o.source)
    return new Translate(o)
}

Translate.prototype.contains = function(x, y) {
    var xt = x - this.data.dx
    var yt = y - this.data.dy
    return this.data.source.contains(xt, yt)
}

function Rotate(data) {
    this.data = data
}

Rotate.fromObject = function(o) {
    o.source = Geom.fromObject(o.source)
    return new Rotate(o)
}

Rotate.prototype.contains = function(x, y) {
    var a = this.data.angle*Math.PI/180
    var c = Math.cos(a)
    var s = Math.sin(a)
    var xt =  c*x + s*y
    var yt = -s*x + c*y
    return this.data.source.contains(xt, yt)
}


function Union(data) {
    this.data = data
}

Union.fromObject = function(o) {
    var data = []
    o.forEach(function(item) {
        data.push(Geom.fromObject(item))
    })
    return new Union(data)
}

Union.star = function(data) {
    var c = data.center || { x: 0, y: 0 }
    var n = data.n || 5
    n += (1-n&1)
    var h = Math.floor(n/2)
    var r = data.radius || 0.2
    var phase = (data.phase || 0)*Math.PI/180
    var xy = []
    var xy2 = []
    var rho = r/(2*Math.cos(Math.PI/n)+1)
    var dphase = Math.PI/n
    for (var i=0; i<n; ++i) {
        var phi = phase + i/n*Math.PI*2
        xy.push({x: c.x + r*Math.cos(phi), y: c.y + r*Math.sin(phi)})
        xy2.push({x: c.x + rho*Math.cos(phi+dphase), y: c.y + rho*Math.sin(phi+dphase)})
    }
    var items = []
    for (i=0; i<n; ++i) {
        items.push(new Convex([xy[i], xy2[i], xy2[(i+n-1)%n]]))
    }
    items.push(new Convex(xy2))
    return new Union(items)
}

Union.star.fromObject = function(o) {
    return Union.star(o)
}

Union.prototype.contains = function(x, y) {
    var contains = false
    this.data.forEach(function(item) {
        contains = contains || item.contains(x, y)
    })
    return contains
}

function Intersection(data) {
    this.data = data
}

Intersection.fromObject = function(o) {
    var data = []
    o.forEach(function(item) {
        data.push(Geom.fromObject(item))
    })
    return new Intersection(data)
}

Intersection.prototype.contains = function(x, y) {
    if (this.data.length === 0)
        return false
    var contains = true
    this.data.forEach(function(item) {
        contains = contains && item.contains(x, y)
    })
    return contains
}

function Difference(data) {
    this.data = data
}

Difference.fromObject = function(o) {
    return new Difference({ a: Geom.fromObject(o.a), b: Geom.fromObject(o.b) })
}

Difference.prototype.contains = function(x, y) {
    return this.data.a.contains(x, y) && !this.data.b.contains(x, y)
}



Geom.gen = {
    rect: Rectangle.fromObject,
    square: Rectangle.square.fromObject,
    ellipse: Ellipse.fromObject,
    circle: Ellipse.circle.fromObject,
    convex: Convex.fromObject,
    regular: Convex.regular.fromObject,
    star: Union.star.fromObject,
    t: Translate.fromObject,
    r: Rotate.fromObject,
    u: Union.fromObject,
    x: Intersection.fromObject,
    d: Difference.fromObject,
    w: Wave.fromObject
}

Geom.fromObject = function(o) {
    if (!((o instanceof Array) && o.length === 2))
        throw new Error('Geom.fromObject(): exepcted array of 2 elements')
    return Geom.gen[o[0]](o[1])
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



function Fill() {}
Fill.fromObject = function(o) {
    if (o instanceof Array)
        return new PatternFill(o)
    else if (typeof o === 'string') {
        switch (o.length) {
        case 0:
            throw new Error('Invalid fill')
        case 1:
            return new SolidFill(o)
        default:
            return new PatternFill([o])
        }
    }
    else
        throw new Error('Invalid fill')
}



function Shape(data) {
    this.data = data
}
Shape.fromObject = function(o) {
    return new Shape({
        geometry: Geom.fromObject(o.geometry),
        fill: Fill.fromObject(o.fill)
    })
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

Scene.fromObject = function(o) {
    var shapes = []
    o.shapes.forEach(function(oShape) {
        shapes.push(Shape.fromObject(oShape))
    })
    return new Scene({shapes: shapes, background: Fill.fromObject(o.background)})
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

module.exports = {
    Scene: Scene,
    geom: {
        Rectangle: Rectangle,
        SemiPlane: SemiPlane,
        Ellipse: Ellipse,
        Convex: Convex
    },
    transform: {
        Translate: Translate,
        Rotate: Rotate
    },
    booleans: {
        Union: Union,
        Intersection: Intersection,
        Difference: Difference
    },
    fill: {
        SolidFill: SolidFill,
        PatternFill: PatternFill
    },
    Shape: Shape
}

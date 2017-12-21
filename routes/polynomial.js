var _ = require('lodash')
var util = require('./util.js')

function Polynomial(c) {
    if (arguments.length === 0)
        this.coeff = [0]
    else if (arguments.length === 1   &&   c instanceof Array)
        this.coeff = c.slice()
    else
        this.coeff = Array.prototype.slice.call(arguments)
    Polynomial.checkCoeff(this.coeff)
}

Polynomial.checkCoeff = function(c) {
    if (c.length < 1)
        throw new Error('Polynomial: invalid coefficients (at least one is expected)')
    if (!_.every(c, function(x) { return typeof x === 'number' }))
        throw new Error('Polynomial: invalid coefficients (all must be numbers)')
    return c
}

Polynomial.coeff = function(x) {
    if (x instanceof Array)
        return Polynomial.checkCoeff(x)
    else if (x instanceof Polynomial)
        return x.coeff
    else if (typeof x === 'number')
        return [x]
    throw new Error('Polynomial.coeff(): Invalid argument')
}

Polynomial.prototype.clone = function() {
    return new Polynomial(this.coeff)
}

Polynomial.prototype.deg = function() {
    return this.coeff.length - 1
}

Polynomial.prototype.val = function(x) {
    var result = 0
    var c = this.coeff
    for (var i=c.length-1; i>=0; --i)
        result = result*x + c[i]
    return result
}

Polynomial.prototype.binaryElementwise = function(x, op) {
    x = Polynomial.coeff(x)
    for (var i=0; i<x.length; ++i)
        this.coeff[i] = op(this.coeff[i], x[i])
    return this
}

Polynomial.prototype.add = function(x) { return this.binaryElementwise(x, _.add) }
Polynomial.prototype.sub = function(x) { return this.binaryElementwise(x, _.subtract) }
Polynomial.prototype.mul = function(x) {
    x = Polynomial.coeff(x)
    var n = this.coeff.length
    var nx = x.length
    var i, c, cx
    if (nx > 1) {
        c = new Array(n + nx - 1).fill(0)
        for (i=0; i<n; ++i)
            for (var ix=0; ix<nx; ++ix)
                c[i+ix] += this.coeff[i]*x[ix]
        this.coeff = c
    }
    else for (i=0; i<n; ++i)
        this.coeff[i] *= x[0]
    return this
}

Polynomial.prototype.multiplyByMonomial = function(x) {
    this.coeff.splice(0, 0, 0)
    var c = this.coeff
    for (var i=1; i<c.length; ++i)
        c[i-1] -= x*c[i]
    return this
}

Polynomial.prototype.d = function(n) {
    var c = this.coeff
    if (arguments.length === 0) {
        if (c.length === 1)
            c[0] = 0
        else {
            for (var i=1; i<c.length; ++i)
                c[i-1] = c[i]*i
            c.pop()
        }
    }
    else if (typeof n === 'number') {
        if (!Number.isInteger(n) || n < 0)
            throw new Error('Polynomial.d: Invalid argument (expected a nonnegative number)')
        if (n >= c.length)
            this.coeff = [0]
        else for (var i=0; i<n; ++i)
            this.d()
    }
    return this
}

function polynomial() {
    return util.construct (Polynomial, arguments)
}

module.exports = polynomial

var _ = require('lodash')

var MaxArrayLength = 100

function throwFailMessage(msg, name) {
    if (name)
        msg += ' (' + name + ')'
    throw new Error(msg)
}

function checkedInt(x, name) {
    x = +x
    if (!Number.isInteger(x))
        throwFailMessage('Ожидалось целое число', name)
    return x
}

function checkedNonnegativeInt(x, name) {
    x = +x
    if (!Number.isInteger(x) || x < 0)
        throwFailMessage('Ожидалось целое неотрицательное число', name)
    return x
}

function checkedPositiveInt(x, name) {
    x = +x
    if (!Number.isInteger(x) || x <= 0)
        throwFailMessage('Ожидалось натуральное число', name)
    return x
}

function checkedNum(x, name) {
    x = +x
    if (!Number.isFinite(x))
        throwFailMessage('Ожидалось число', name)
    return x
}

var checkedInput = {
    int: checkedInt,
    uint: checkedNonnegativeInt,
    whole: checkedPositiveInt,
    real: checkedNum
}

function InputReader(stdin) {
    this.stdin = stdin.trim()
    this.tokens = this.stdin.split(/\s+/)
    this.itok = 0
}

InputReader.prototype.errorPositionIndicator = function(itokBias) {
    itokBias = itokBias || 0
    var itok = this.itok + itokBias
    if (itok === 0)
        return '^'
    var bias = itok === 1? 1: 2
    return ['', this.tokens.join(' '), new Array(this.tokens.slice(0, itok-1).join(' ').length+bias).join('-')+'^'].join('\n')
}

InputReader.prototype.readScalar = function(type) {
    if (this.itok >= this.tokens.length)
        throw new Error('Недостаточно входных данных' + this.errorPositionIndicator(1))
    try {
        return checkedInput[type](this.tokens[this.itok++])
    }
    catch(err) {
        err.message += this.errorPositionIndicator()
        throw err
    }
}

InputReader.prototype.readVector = function(type, length) {
    if (length > MaxArrayLength)
        throw new Error('Массив слишком длинный, длина не должна превышать ' + MaxArrayLength)
    var result = new Array(length)
    for (var i=0; i<length; ++i)
        result[i] = this.readScalar(type)
    return result
}

InputReader.prototype.eof = function() {
    return this.itok === this.tokens.length
}

function parseProgramInput(stdin, format) {
    var inTokens = stdin.split(/\s+/)
    var fmTokens = format.split(/\s*,\s*/)
    var result = {}
    var rxid = /^[a-zA-Z_]\w*$/
    var rxint = /^[0-9]+$/
    var rxidOpen = /^[a-zA-Z_]\w*/
    var rxintOpen = /^[0-9]+/
    var name2type = {}

    var reader = new InputReader(stdin)

    function parseLengthExpr(expr, fmtok) {
        function parseBinOpChain(ops, parseSub, subexpr) {
            var result = parseSub()(subexpr)
            while(result.rest) {
                var op = result.rest[0]
                if (!(op in ops))
                    break
                var x = parseSub()(result.rest.substr(1))
                result.rest = x.rest
                result.value = ops[op](result.value, x.value)
            }
            return result
        }
        var parseSum, parseProduct

        function throwSyntaxError() {
            throw new Error('Invalid input format: syntax error in length specification: ' + fmtok)
        }

        function parseAtom(subexpr) {
            if (!subexpr)
                throwSyntaxError()
            var m = subexpr.match(rxintOpen)
            if (m)
                return {
                    value: +m[0],
                    rest: subexpr.substr(m[0].length)
                }
            m = subexpr.match(rxidOpen)
            if (m) {
                var name = m[0]
                if (!result.hasOwnProperty(name))
                    throw new Error('Invalid input format: length specification contains symbol ' + name + ' that has not been read yet: ' + fmtok)
                var lengthType = name2type[name]
                if (lengthType !== 'uint' && lengthType !== 'whole')
                    throw new Error('Invalid input format: name ' + name + ' has a wrong type (must be uint or whole since it is used to specify array length)')
                return {
                    value: result[name],
                    rest: subexpr.substr(m[0].length)
                }
            }
            if (subexpr[0] === '(') {
                var x = parseSum(subexpr.substr(1))
                if (x.rest[0] !== ')')
                    throwSyntaxError()
                x.rest = x.rest.substr(1)
                return x
            }
            throwSyntaxError()
        }

        parseSum = parseBinOpChain.bind(this, {
            '+': function(a,b){ return a+b },
            '-': function(a,b){ return a-b }
        }, function() {return parseProduct})
        parseProduct = parseBinOpChain.bind(this, {
            '*': function(a,b){ return a*b },
            '/': function(a,b){ return Math.floor(a/b) },    // floor because we are dealing with ints here
            '%': function(a,b){ return a%b }
        }, function() {return parseAtom})

        var lengthExprResult = parseSum(expr)
        if (lengthExprResult.rest)
            throwSyntaxError()
        return lengthExprResult.value
    }

    fmTokens.forEach(function(fmtok) {
        var m = fmtok.match(/^(\S+)\s+(\S+)$/)
        if (!m)
            throw new Error('Invalid input format: ' + fmtok)
        var type = m[1]
        var spec = m[2]
        if (!(checkedInput.hasOwnProperty(type)))
            throw new Error('Invalid type ' + type + ' in input format ' + fmtok)
        if (spec.match(rxid)) {
            if (result.hasOwnProperty(spec))
                throw new Error('Invalid input format: name ' + spec + ' is read more than once')
            result[spec] = reader.readScalar(type)
            name2type[spec] = type
        }
        else {
            m = spec.match(/^([^\[]+)\[([^\]]+)\]$/)
            if (m) {
                var name = m[1]
                if (!name.match(rxid))
                    throw new Error('Invalid input format: ' + fmtok)
                if (result.hasOwnProperty(name))
                    throw new Error('Invalid input format: name ' + name + ' is read more than once')
                var length = parseLengthExpr(m[2])
                if (length > MaxArrayLength)
                    throw new Error('Массив ' + name + ' слишком длинный, длина не должна превышать ' + MaxArrayLength)
                result[name] = reader.readVector(type, length)
                name2type[name] = type
            }
            else
                throw new Error('Invalid input format: ' + fmtok)
        }
    })
    if (!reader.eof())
        throw new Error('Слишком много входных данных' + reader.errorPositionIndicator(1))
    return result
}
parseProgramInput.newReader = function(stdin) { return new InputReader(stdin) }

module.exports = parseProgramInput

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

module.exports = function(stdin, format)
{
    var inTokens = stdin.split(/\s+/)
    var fmTokens = format.split(/\s*,\s*/)
    var itok = 0
    var result = {}
    var rxid = /^[a-zA-Z_]\w*$/
    var rxint = /^[0-9]+$/
    var rxidOpen = /^[a-zA-Z_]\w*/
    var rxintOpen = /^[0-9]+/
    var name2type = {}

    function readScalar(type) {
        if (itok >= inTokens.length)
            throw new Error('Недостаточно входных данных')
        return checkedInput[type](inTokens[itok++])
    }

    function parseLengthExpr(expr, fmtok) {
        if (expr.match(rxid)) {
            if (!result.hasOwnProperty(expr))
                throw new Error('Invalid input format: ' + fmtok)
            var lengthType = name2type[expr]
            if (lengthType !== 'uint' && lengthType !== 'whole')
                throw new Error('Invalid input format: name ' + expr + ' has a wrong type (must be uint or whole since it is used as array length)')
            var length = result[expr]
            return length
        }
        else if (expr.match(rxint))
            return +expr
        else {
            // TODO
            var m = expr.match(rxidOpen)
            throw new Error('Invalid length expression ' + expr + ' in input format element' + fmtok)
        }
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
            result[spec] = readScalar(type)
            name2type[spec] = type
        }
        else {
            m = spec.match(/^(\w+)\[(\w+)\]$/)
            if (m) {
                var name = m[1]
                if (!name.match(rxid))
                    throw new Error('Invalid input format: ' + fmtok)
                if (result.hasOwnProperty(name))
                    throw new Error('Invalid input format: name ' + name + ' is read more than once')
                var length = parseLengthExpr(m[2])
                if (length > MaxArrayLength)
                    throw new Error('Массив ' + name + ' слишком длинный, длина не должна превышать ' + MaxArrayLength)
                var a = result[name] = []
                for (var i=0; i<length; ++i) {
                    a.push(readScalar(type))
                }
                name2type[name] = type
            }
            else
                throw new Error('Invalid input format: ' + fmtok)
        }
    })
    if (itok < inTokens.length)
        throw new Error('Слишком много входных данных')
    return result
}

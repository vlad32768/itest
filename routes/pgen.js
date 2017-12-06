module.exports = function pgen(generators, o) {
    if (!((o instanceof Array) && o.length === 2))
        throw new Error('pgen: exepcted array of 2 elements')
    var generator = generators[o[0]]
    if (typeof generator !== 'function')
        throw new Error('pgen: unknown generator \'' + o[0] + '\'')
    return generator(o[1])
}

function clamp(x, xmin, xmax, xdefault) {
    if (x === undefined)
        return xdefault
    x = +x
    return x<xmin? xmin: x>xmax? xmax: x
}

module.exports = {
    clamp: clamp
}

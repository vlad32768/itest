function clamp(x, xmin, xmax, xdefault) {
    if (x === undefined)
        return xdefault
    x = +x
    return x<xmin? xmin: x>xmax? xmax: x
}

function imgen(imgdb) {
    return function(name) {
        var src = imgdb[name]
        if(typeof src !== 'string')
            throw new Error('Invalid image name ' + name)
        return '<img src="' + src + '"/>'
    }
}

module.exports = {
    clamp: clamp,
    imgen: imgen
}

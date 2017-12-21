function clamp(x, xmin, xmax, xdefault) {
    if (x === undefined)
        return xdefault
    x = +x
    return x<xmin? xmin: x>xmax? xmax: x
}

function isZero(x, threshold) {
    if (arguments.length < 2)
        threshold = 1e-8
    return Math.abs(x) < threshold
}

function imgen(imgdb) {
    return function(name) {
        var src = imgdb[name]
        if(typeof src !== 'string')
            throw new Error('Invalid image name ' + name)
        return '<img src="' + src + '"/>'
    }
}

function construct(constructor, args) {
    function F() {
        return constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;
    return new F();
}

module.exports = {
    clamp: clamp,
    isZero: isZero,
    imgen: imgen,
    construct: construct
}

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

function formatTimeSpan(msec) {
    function formatTwoDigits(n) {
        return (n < 10? '0': '') + n
    }
    var seconds = Math.floor(msec/1000)
    var minutes = Math.floor(seconds/60)
    seconds %= 60
    var hours = Math.floor(minutes/60)
    minutes %= 60
    if (hours > 10)
        return '--'
    else
        return formatTwoDigits(hours) + ':' + formatTwoDigits(minutes) + ':' + formatTwoDigits(seconds)
}

module.exports = {
    clamp: clamp,
    isZero: isZero,
    imgen: imgen,
    construct: construct,
    formatTimeSpan: formatTimeSpan
}

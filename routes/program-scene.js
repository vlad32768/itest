var programs = {
    'p1': function(stdin) {
        return '12\n34\n567\n\n' + stdin
    }
}

function Program(data) {
    this.data = {}
    if (data) {
        var program = programs[data.name]
        if (typeof program !== 'function')
            throw new Error('Program: unknown program name \'' + name + '\'')
        this.data.program = program
    }
}

Program.fromObject = function(o) {
    return new Program(o)
}

Program.prototype.paint = function(w, h, stdin) {
    return this.data.program(stdin)
}

module.exports = { Program: Program }

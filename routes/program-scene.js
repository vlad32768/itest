function Program(data) {
    this.data = {}
    if (data) {
        var program
        if (data instanceof Function)
            program = data
        this.data.program = program
    }
}

Program.fromObject = function(o) {
    return new Program(o)
}

Program.prototype.paint = function(w, h, stdin) {
    var program = this.data.program
    function runProgram() {
        try {
            return program(stdin)
        }
        catch(err) {
            return err.message
        }
    }
    return program instanceof Function? runProgram(): 'N/A'
}

module.exports = { Program: Program }

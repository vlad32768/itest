function args2arr(a) {
    return Array.prototype.slice.apply(a)
}

function Printer()
{
    this.lines = []
    this.pendingLine = ''
}

Printer.prototype.append = function(text) {
    if (this.pendingLine && text)
        this.pendingLine = this.pendingLine + ' ' + text
    else if (text)
        this.pendingLine = text
    return this
}

Printer.prototype.newline = function() {
    this.lines.push(this.pendingLine)
    this.pendingLine = ''
    return this
}

Printer.prototype.println = function()
{
    this.append(args2arr(arguments).join(' '))
    this.newline()
    return this
}

Printer.prototype.print = function()
{
    this.append(args2arr(arguments).join(' '))
    return this
}

Printer.prototype.finish = function() {
    if (this.pendingLine)
        this.newline()
    var result = this.lines.join('\n')
    this.lines = []
    return result
}

module.exports = function() { return new Printer }

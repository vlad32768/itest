function args2arr(a) {
    return Array.prototype.slice.apply(a)
}

function Printer()
{
    this.lines = []
    this.pendingLine = ''
    this.tabSize = 8
}

Printer.prototype.append = function(text) {
    var self = this
    function adjustCaret(tab) {
        if (tab) {
            var n = self.tabSize - self.pendingLine.length % self.tabSize
            self.pendingLine += new Array(n).fill(' ').join('')
        }
        else if (self.pendingLine)
            self.pendingLine += ' '
    }
    text.split('\t').forEach(function(token, i) {
        adjustCaret(i !== 0)
        self.pendingLine += token
    })
    return self
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

Printer.prototype.putc = function(c)
{
    this.pendingLine += c
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

var tasks = require('../routes/tasks.js')
var ppi = require('../routes/parse-program-input.js')
var lp = require('../routes/line-printer.js')

module.exports = tasks.Tasks.fromObject({
    description: 'Unsorted tasks 1',
    items: [{
        text: 'Даны два массива, $A$ и $B$, размеров $n$ и $m$ соответственно, содержащие вещественные числа $a_i$ и $b_j$ соответственно. Напечатать всевозможные упорядоченные пары ($a_i$, $b_j$).',
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'uint n, real a[n], uint m, real b[m]')
            var printer = lp()
            args.a.forEach(function(ai) {
                args.b.forEach(function(bi) {
                    printer.println(ai, bi)
                })
            })
            return printer.finish()
        }],
        stdin: '2 4 5 3 7 8 9',
        stdinHint: 'Введите через пробел $n, a_1, \\ldots, a_n, m, b_1, \\ldots, b_m$'
    }, {
        text: 'Дан массив $A$ размера $n$, содержащий вещественные числа $a_i$. Напечатать всевозможные неупорядоченные пары $(a_i, a_j)$ (Если напечатана пара $(a_1, a_2)$, то пару $(a_2, a_1)$ печатать не надо.)',
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'uint n, real a[n]')
            var printer = lp()
            for (var i=0; i<args.n; ++i)
                for (var j=0; j<=i; ++j)
                    printer.println(args.a[i], args.a[j])
            return printer.finish()
        }],
        stdin: '4 1 2 3 4',
        stdinHint: 'Введите через пробел $n, a_1, \\ldots, a_n$'
    }, {
        text: 'Дан массив, содержащий $2n$ натуральных чисел. Там находятся размеры прямоугольных матриц $A_1, \\ldots A_n$ (например, первый элемент массива &mdash; число строк в $A_1$, второй &mdash; число столбцов в $A_1$, третий &mdash; число строк в $A_2$, четвёртый &mdash; число столбцов в $A_2$, и т. д.). Программа должна выяснить, определено ли матричное произведение $A_1 A_2 \\ldots A_n$, и если да, то сколько строк и столбцов в матрице, которая будет результатом этого произведения.',
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, whole a[2*n]')
            var printer = lp()
            var ok = true
            var _2n = 2*args.n
            for (var i=1; i+2<_2n; i+=2)
                if (args.a[i] !== args.a[i+1]) {
                    ok = false
                    break
                }
            if (ok)
                printer
                    .println('Матричное произведение определено')
                    .println('Оно имеет размер ', args.a[0], 'x', args.a[_2n-1], ' (строк x столбцов)')
            else
                printer.println('Матричное произведение не определено')
            return printer.finish()
        }],
        stdin: '3 5 2 2 4 5 6',
        stdinHint: 'Введите через пробел $n$, число строк в $A_1$, число столбцов в $A_1, \\ldots,$ число строк в $A_n$, число столбцов в $A_n$'
    }, {
        text: 'Дан массив, содержащий $2n$ натуральных чисел. Там находятся размеры прямоугольных матриц $A_1, \\ldots A_n$ (например, первый элемент массива &mdash; число строк в $A_1$, второй &mdash; число столбцов в $A_1$, третий &mdash; число строк в $A_2$, четвёртый &mdash; число столбцов в $A_2$, и т. д.). Программа должна выяснить, определено ли матричное произведение $A_1^T A_2^T \\ldots A_n^T$, и если да, то сколько строк и столбцов в матрице, которая будет результатом этого произведения.',
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, whole a[2*n]')
            var printer = lp()
            var ok = true
            var _2n = 2*args.n
            for (var i=0; i+3<_2n; i+=2)
                if (args.a[i] !== args.a[i+3]) {
                    ok = false
                    break
                }
            if (ok)
                printer
                    .println('Матричное произведение определено')
                    .println('Оно имеет размер ', args.a[1], 'x', args.a[_2n-2], ' (строк x столбцов)')
            else
                printer.println('Матричное произведение не определено')
            return printer.finish()
        }],
        stdin: '3 2 5 4 2 6 5'
    }
]})


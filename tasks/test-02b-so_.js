var tasks = require('../routes/tasks.js')
var ppi = require('../routes/parse-program-input.js')
var lp = require('../routes/line-printer.js')
var util = require('../routes/util.js')

var image = util.imgen({
    pointLineDist: '/task-images/point-to-line-dist.png'
})

var sharedText = {
    aboutRootMultiplicity: [
        'Кратностью корня $x_*$ многочлена степени $n$ называют число $p$ от 1 до $n$, такое, что $x_*$ &mdash; является корнем многочлена и всех его производных',
        'вплоть до $(p-1)$-й включительно и не является корнем $p$-той производной.<br/>',
        'Замечание. При проверке, является ли $x_*$ корнем многочлена, вычисляйте значение многочлена от $x_*$ и считайте, что является, если вычисленное',
        'значение не превосходит по абсолютной величине $\\varepsilon=10^{-8}$.'
    ].join('\n')
}

module.exports = tasks.Tasks.fromObject({
    description: 'Контрольная работа 2 (переписка) СО 2017 осень',
    options: {
        noscreensize: true
    },
    items: [{
        text: [
            'На плоскости заданы своими координатами $x_i$, $y_i$ четыре точки ($i=1,\\ldots,4$),',
            'причём абсциссы всех точек различны. Программа должна напечатать коэффициенты',
            'интерполяционного многочлена Лагранжа $L(x)$, проходящего через эти точки.<br/>',
            'Замечание. $L(x)=\\sum\\limits_{i=1^4} L_i(x)$,',
            '$L_i(x)$=\\Pi\\limits_{k=1,\\ldots,4,\\ k\\ne i}\\frac{x-x_k}{x_i-x_k}'
        ].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real x[4], real y[4]')
            function mulMono(c, x) {
                var result = [0].concat(c.slice())
                for (var i=0; i<c.length; ++i)
                    result[i] -= x*c[i]
                return result
            }
            function val(c, x) {
                var result = 0
                for (var i=c.length-1; i>=0; --i)
                    result = result*x + c[i]
                return result
            }
            function scale(c, factor) {
                for (var i=0; i<c.length; ++i)
                    c[i] *= factor
            }
            function addTo(c, term) {
                for (var i=0; i<term.length; ++i)
                    c[i] += term[i]
            }
            var L = new Array(4).fill(0)
            for (var i=0; i<4; ++i) {
                var c = [1]
                for (var j=0; j<4; ++j)
                    if (j !== i)
                        c = mulMono(c, args.x[j])
                var d = val(c, x[i])
                if (Math.abs(d) < 1e-8)
                    throw new Error('Значение абсциссы ' + x[i] + ' встречается больше одного раза')
                scale(c, args.y[i]/d)
                addTo(L, c)
            }
            return L.join(' ')
        }],
        stdin: '1 2 3 4   1 2 3 4',
        stdinHint: 'Введите через пробел $x_1, x_2, x_3, x_4, y_1, y_2, y_3, y_4$'
    }, {
        text: ['Задана матрица $A$ размера $3\\times 3$. Программа должна напечатать коэффициенты',
               'характеристического многочлена этой матрицы.<br/>',
               'Замечание. Характеристическим многочленом квадратной матрицы $A$ называется',
               'определитель $P(\\lambda)=|A-\\lambda E|$, где $E$ &mdash; единичная матрица.'].join('\n'),
        scene: ['program', function(stdin) {
            // TODO
            var args = ppi(stdin, 'real x[4], real y[4]')
            return lp().println(result).finish()
        }],
        stdin: '5 5 0 0 10 0',
        stdinHint: 'Введите через пробел $x_A, y_A, x_B, y_B, x_C, y_C$'
    }
]})

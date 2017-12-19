var tasks = require('../routes/tasks.js')
var ppi = require('../routes/parse-program-input.js')
var lp = require('../routes/line-printer.js')
var util = require('../routes/util.js')

var image = util.imgen({
    pointLineDist: '/task-images/point-to-line-dist.png'
})

module.exports = tasks.Tasks.fromObject({
    description: 'Контрольная работа 2 (переписка) СО 2017 осень',
    options: {
        noscreensize: true
    },
    items: [{
        text: [
            'На плоскости своими декартовыми координатами заданы три точки, $A$, $B$ и $C$. Найдите ресстояние от точки $A$ до отрезка $BC$, то есть',
            '$\\min\\limits_{{\\bf r}\\in BC} |{\\bf r}_A - {\\bf r}|$ (здесь ${\\bf r}_A$ &mdash;',
            'радиус-вектор точки $A$, ${\\bf r}$ &mdash; радиус-вектор точки на отрезке).<br/>',
            'Указание. Искомое расстояние равно',
            '<ul>',
            '<li>длине отрезка $AB$, если точка $A$ находится в области 1;</li>',
            '<li>расстоянию от точки $A$ до прямой $BC$, если точка $A$ находится в области 2;</li>',
            '<li>длине отрезка $AC$, если точка $A$ находится в области 3.</li>',
            '</ul>',
            '(см. рисунок).<br/>' + image('pointLineDist') + '<br/>',
            'Чтобы узнать, в какой области находится точка $A$, вычислите скалярные произведения',
            '$\\left({\\bf r}_A-{\\bf r}_B\\right)\\cdot\\left({\\bf r}_C-{\\bf r}_B\\right)$, ',
            '$\\left({\\bf r}_A-{\\bf r}_C\\right)\\cdot\\left({\\bf r}_C-{\\bf r}_B\\right)$ и посмотрите на их знаки.',
            'Расстояние от точки до прямой найдите по формуле $|\\left({\\bf r}_A - {\\bf r}_B\\right)\\times\\left({\\bf r}_C - {\\bf r}_B\\right)\\cdot{\\bf k}|/|{\\bf r}_C-{\\bf r}_B|$.',
            'Используйте для смешанного произведения формулу ${\\bf a}\\times{\\bf b}\\cdot{\\bf k}=x_a y_b - y_a x_b$',
            '(${\\bf a}=x_a{\\bf i} + y_a{\\bf j}$, ${\\bf b}=x_b{\\bf i} + y_b{\\bf j}$).'
        ].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real A[2], real B[2], real C[2]')
            function dot(a, b) { return a[0]*b[0] + a[1]*b[1] }
            function cross(a, b) { return a[0]*b[1] - a[1]*b[0] }
            function sub(a, b) { return [a[0]-b[0], a[1]-b[1]] }
            function norm(a) { return Math.sqrt(a[0]*a[0] + a[1]*a[1]) }
            var BA = sub(args.A, args.B)
            var CA = sub(args.A, args.C)
            var BC = sub(args.C, args.B)
            var result
            if (dot(BA, BC) < 0)
                result = norm(BA)
            else if (dot(CA, BC) > 0)
                result = norm(CA)
            else
                result = Math.abs(cross(BC, BA))/norm(BC)
            return lp().println(result).finish()
        }],
        stdin: '5 5 0 0 10 0',
        stdinHint: 'Введите через пробел $x_A, y_A, x_B, y_B, x_C, y_C$'
    }, {
        text: ['Задан массив натуральных чисел $a_1, \\ldots, a_n$. Нарисуйте гистограмму, на которой по оси абсцисс отложен',
               'индекс элемента, а по оси ординат &mdash; его значение.'].join('\n'),
        scene: ['program', function(stdin) {
            var a = ppi(stdin, 'whole n, whole a[n]').a
            var amax = Math.max.apply(Math, a)
            if (amax > 100)
                throw new Error('Пожалуйста, вводите числа не более 100')
            var printer = lp()
            for (var row=amax; row>0; --row) {
                    a.forEach(function(ai) {
                        printer.print(ai >= row? '#': ' ')
                    })
                    printer.println()
                }
            return printer.finish()
        }],
        stdin: '10 1 2 3 4 5 1 2 3 2 1',
        stdinHint: 'Введите через пробел $n, a_1, \\ldots a_n$'
    }, {
        text: ['Заданы две последовательности вещественных чисел, $a_0, \\ldots, a_n$ и $b_0, \\ldots, b_m$.',
               'Это коэффициенты двух многочленов от переменной $x$, $P_1(x)=\\sum\\limits_{k=0}^n a_k x^k$ и',
               '$P_2(x)=\\sum\\limits_{k=0}^m b_k x^k$',
               'Напечатайте коэффициенты $c_0, \\ldots c_{n+m}$ многочлена $P(x)=\\sum\\limits_{k=0}^{n+m} c_k x^k = P_1(x)P_2(x)$.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, whole a[n+1], whole m, whole b[m+1]')
            var c = new Array(args.m + args.n + 1).fill(0)
            for (var ia=0; ia<=args.n; ++ia)
                for (var ib=0;ib<=args.m; ++ib)
                    c[ia+ib] += args.a[ia]*args.b[ib]
            return c.join(' ');
        }],
        stdin: '2   3 2 1     3   1 2 3 4',
        stdinHint: 'Введите через пробел $n, a_0, \\ldots a_n, m, b_0, \\ldots b_m$'
    }, {
        text: ['Задана последовательность вещественных чисел $a_0, \\ldots, a_n$ и вещественное число $x_*$.',
               'В последовательности чисел &mdash; коэффициенты многочлена от переменной $x$, $P(x)=\\sum\\limits_{k=0}^n a_k x^k$.',
               'Требуется определить, является ли $x_*$ корнем многочлена $P(x)$, и если да, то какова его кратность.',
               'Программа должна печатать 0, если $x_*$ &mdash; не корень и кратность, если корень.<br>',
               'Кратностью корня называют число $p$ от 1 до $n$, такое, что $x_*$ &mdash; является корнем всех производных многочлена $P(x)$',
               'вплоть до $(p-1)$-той производной включительно.<br/>',
               'Замечание. При проверке, является ли $x_*$ корнем многочлена, вычисляйте значение многочлена от $x_*$ и считайте, что является, если вычисленное',
               'значение не превосходит по абсолютной величине $\\varepsilon=10^{-8}$.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real a[n+1], real x')
            function val(c, x) {
                var result = 0
                for (var i=c.length-1; i>=0; --i)
                    result = result*x + c[i]
                return result
            }
            function isRoot(c, x) {
                return Math.abs(val(c, x)) <= 1e-8
            }
            function dpol(c) {
                var result = []
                for (var i=1; i<c.length; ++i)
                    result.push(c[i]*i)
                return result
            }
            var p = 0
            var c = args.a
            while (p < args.n && isRoot(c, args.x)) {
                ++p
                c = dpol(c)
            }
            return lp().println(p).finish()
        }],
        stdin: '1   1 1     1',
        stdinHint: 'Введите через пробел $n, a_0, \\ldots a_n, x_*$'
    }, {
        text: ['Задана последовательность вещественных чисел $x_0, \\ldots, x_n$. Это корни многочлена',
               '$P(x)=\\sum\\limits_{k=0}^{n} a_k x^k$, причём $a_n=1$.',
               'Программа должна печатать коэффициенты многочлена $a_0, \\ldots a_n$.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real x[n]')
            function mulMono(c, x) {
                var result = [0].concat(c.slice())
                for (var i=0; i<c.length; ++i)
                    result[i] -= x*c[i]
                return result
            }
            var result = [1]
            args.x.forEach(function(x) {
                result = mulMono(result, x)
            })
            return result.join(' ')
        }],
        stdin: '3   1 2 3',
        stdinHint: 'Введите через пробел $n, x_1, \\ldots x_n$'
    }
]})

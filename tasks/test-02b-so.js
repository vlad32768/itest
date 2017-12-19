var tasks = require('../routes/tasks.js')
var ppi = require('../routes/parse-program-input.js')
var lp = require('../routes/line-printer.js')

module.exports = tasks.Tasks.fromObject({
    description: 'Контрольная работа 2 (переписка) СО 2017 осень',
    items: [{
        text: [
            'На плоскости заданы три точки, $A$, $B$ и $C$. Найдите ресстояние от точки $A$ до отрезка $BC$, то есть',
            '$\\min\\limits_{{\\bf r}\\in BC} |{\\bf r}_A - {\\bf r}|$ (здесь ${\\bf r}_A$ &mdash;',
            'радиус-вектор точки $A$, ${\\bf r}$ &mdash; радиус-вектор точки на отрезке).<br/>',
            'Указание. Искомое расстояние равно',
            '<ul>',
            '<li>длине отрезка $AB$, если точка $A$ находится в области 1;</li>',
            '<li>расстоянию от точки $A$ до прямой $BC$, если точка $A$ находится в области 2;</li>',
            '<li>длине отрезка $AC$, если точка $A$ находится в области 3.</li>',
            '</ul>',
            '(см. рисунок). Чтобы узнать, в какой области находится точка $A$, вычислите скалярные произведения',
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
        text: ['Заданы две последовательности вещественных чисел, $a_0, \\ldots, a_n$, и $b_0, \\ldots, b_m$.',
               'Это коэффициенты двух многочленов от переменной $x$, $P_1=\\sum\\limits_{k=0}^n a_k x^k$ и',
               '$P_2=\\sum\\limits_{k=0}^m b_k x^k$',
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
        stdinHint: 'Введите через пробел $n, a_1, \\ldots a_n, m, b_1, \\ldots b_m$'
    }
]})

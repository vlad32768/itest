var tasks = require('../routes/tasks.js')
var ppi = require('../routes/parse-program-input.js')
var lp = require('../routes/line-printer.js')
var util = require('../routes/util.js')
var polynomial = require('../routes/polynomial.js')

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
    tags: ['so-tests'],
    items: [{   // 1
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
        stdinHint: 'Введите через пробел $x_A, y_A, x_B, y_B, x_C, y_C$',
        tags: ['complexity-3', 'math', 'planimetry', 'numeric']
    }, {   // 2
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
        stdinHint: 'Введите через пробел $n, a_1, \\ldots a_n$',
        tags: ['complexity-3', 'arrays']
    }, {   // 3
        text: ['Заданы две последовательности вещественных чисел, $a_0, \\ldots, a_n$ и $b_0, \\ldots, b_m$.',
               'Это коэффициенты двух многочленов от переменной $x$, $P_1(x)=\\sum\\limits_{k=0}^n a_k x^k$ и',
               '$P_2(x)=\\sum\\limits_{k=0}^m b_k x^k$',
               'Напечатайте коэффициенты $c_0, \\ldots c_{n+m}$ многочлена $P(x)=\\sum\\limits_{k=0}^{n+m} c_k x^k = P_1(x)P_2(x)$.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'uint n, real a[n+1], uint m, real b[m+1]')
            return polynomial(args.a).mul(args.b).coeff.join(' ')
        }],
        stdin: '2   3 2 1     3   1 2 3 4',
        stdinHint: 'Введите через пробел $n, a_0, \\ldots a_n, m, b_0, \\ldots b_m$',
        tags: ['complexity-3', 'arrays', 'math', 'polynomials']
    }, {   // 4
        text: ['Заданы три последовательности вещественных чисел, $a_{10}, a_{11}, a_{12}, a_{13}$,',
               '$a_{20}, a_{21}, a_{22}, a_{23}$ и $a_{30}, a_{31}, a_{32}, a_{33}$.',
               'Это коэффициенты трёх многочленов от переменной $x$, $P_i(x)=\\sum\\limits_{k=0}^3 a_{ik} x^k$, $i=1,2,3$.',
               'Проверьте, являются ли многочлены $P_1$, $P_2$, $P_3$ линейно независимыми.<br/>',
               'Замечание. Элементы линейного пространства линейно независимы тогда и только тогда,',
               'когда матрица их координат в каком-нибудь базисе имеет полный ранг. В свою очередь, матрица',
               'имеет полный ранг, если в ней найдётся базисный минор, то есть отличный от нуля минор порядка $n$,',
               'где $n$ &mdash; число строк или столбцов в матрице, смотря чего меньше.',
               'Для многочленов рассмотрите степенной базис. Вместо сравнения минора с нулём сравнивайие его абсолютное',
               'значение с пороговой точностью $\\varepsilon=10^{-8}$.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real a1[4], real a2[4], real a3[4]')
            function det(c1, c2, c3) {
                return args.a1[c1]*(args.a2[c2]*args.a3[c3] - args.a3[c2]*args.a2[c3]) -
                       args.a2[c1]*(args.a1[c2]*args.a3[c3] - args.a3[c2]*args.a1[c3]) +
                       args.a3[c1]*(args.a1[c2]*args.a2[c3] - args.a2[c2]*args.a1[c3])
            }
            var n = 4
            for (var c1=0; c1<=n-3; ++c1)
                for (var c2=c1+1; c2<=n-2; ++c2)
                    for (var c3=c2+1; c3<=n-1; ++c3)
                        if (!util.isZero(det(c1, c2, c3)))
                            return 'Многочлены линейно независимы'
            return 'Многочлены линейно зависимы'
        }],
        stdin: '1 0 0 0\n0 1 0 0\n0 0 1 0',
        stdinHint: 'Введите через пробел $a_{10}, a_{11}, \\ldots a_{33}$',
        tags: ['complexity-3', 'arrays', 'math', 'polynomials', 'matrices']
    }, {   // 5
        text: ['Задана последовательность вещественных чисел $a_0, \\ldots, a_n$ и вещественное число $x_*$.',
               'В последовательности чисел &mdash; коэффициенты многочлена от переменной $x$, $P(x)=\\sum\\limits_{k=0}^n a_k x^k$.',
               'Требуется определить, является ли $x_*$ корнем многочлена $P(x)$, и если да, то какова его кратность.',
               'Программа должна печатать 0, если $x_*$ &mdash; не корень и кратность, если корень.<br/>',
               sharedText.aboutRootMultiplicity].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'uint n, real a[n+1], real x')
            var pol = polynomial(args.a)
            function isRoot(x) {
                return util.isZero(pol.val(x))
            }
            var p = 0
            while (p < args.n && isRoot(args.x)) {
                ++p
                pol.d()
            }
            return lp().println(p).finish()
        }],
        stdin: '3   -9 15 -7 1     3',
        stdinHint: 'Введите через пробел $n, a_0, \\ldots a_n, x_*$',
        tags: ['complexity-4', 'arrays', 'math', 'polynomials']
    }, {   // 6
        text: ['Задана последовательность вещественных чисел $a_0, a_1, a_2, a_3$.',
               'Проверьте, имеет ли многочлен $P(x)=\\sum\\limits_{k=0}^{3} a_k x^k$',
               'вещественные корни кратности 2 и выше. Если да, напечатайте все такие корни и их кратности.',
               'Кстати, сколько таких корней может быть?<br/>',
               sharedText.aboutRootMultiplicity].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real a[4]')
            var nosuchroots = 'Кратных корней нет'
            var deg = 3
            for (var i=3; i>=0 && args.a[i]===0; --i)
                --deg
            if (deg < 2)
                return nosuchroots
            var da = deg === 3? [args.a[1], args.a[2]*2, args.a[3]*3]: args.a.slice(0, 3)
            var c = da[0]/da[2], b = 0.5*da[1]/da[2]
            var D = b*b - c
            if (D < 0)
                return nosuchroots
            function isRoot(x) {
                return Math.abs(args.a[0] + x*(args.a[1] + x*(args.a[2] + x*args.a[3]))) < 1e-8
            }
            var d = Math.sqrt(D)
            var x = [-b-d]
            if (d > 1e-8)
                x.push(-b+d)
            for (var i=0; i<x.length; ++i)
                if (deg === 2 || isRoot(x[i])) {
                    var p = (d > 1e-8? 2: 3) + (deg-3)
                    return p > 1?   'Корень ' + x[i] + ', кратность ' + p:   nosuchroots
                }
            return nosuchroots
        }],
        stdin: '-4 8 -5 1',
        stdinHint: 'Введите через пробел $a_0, a_1, a_2, a_3$',
        tags: ['complexity-3', 'arrays', 'math', 'polynomials']
    }, {   // 7
        text: ['Задана последовательность вещественных чисел $x_1, \\ldots, x_n$. Это корни многочлена',
               '$P(x)=\\sum\\limits_{k=0}^{n} a_k x^k$, причём $a_n=1$.',
               'Программа должна печатать коэффициенты многочлена $a_0, \\ldots a_n$.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real x[n]')
            var result = polynomial(1)
            args.x.forEach(function(x) {
                result.multiplyByMonomial(x)
            })
            return result.coeff.join(' ')
        }],
        stdin: '3   1 2 3',
        stdinHint: 'Введите через пробел $n, x_1, \\ldots x_n$',
        tags: ['complexity-3', 'arrays', 'math', 'polynomials']
    }, {   // 8
        text: ['Задана последовательность $2n$ вещественных чисел $x_1, y_1, x_2, y_2, \\ldots, x_n, y_n$.',
               'Это декартовы координаты вершин многоугольника на плоскости. Найдите площадь многоугольника.',
               'Считайте, что граница прямоугольника не имеет самопересечений.<br/>',
               'Указание. Для вычисления площади фигуры $F$ с границей $\\partial F$ используйте формулу',
               '$\\int\\limits_F dF = \\int\\limits_{\\partial F}x\\,dy$',
               '(предполагается, что система координат правая, а $\\partial F$ обходится против часовой стрелки).',
               'Интеграл по каждой грани многоугольника легко вычислить точно.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real xy[2*n]')
            var result = 0
            for (var i=0, _2n=2*args.n; i<_2n; i+=2) {
                var inext = (i+2) % _2n
                var x = 0.5*(args.xy[i] + args.xy[inext])
                var dy = args.xy[inext+1] - args.xy[i+1]
                result += x*dy
            }
            return lp().println(Math.abs(result)).finish()
        }],
        stdin: '4   0 0  1 0  1 1  0 1',
        stdinHint: 'Введите через пробел $n, x_1, y_1 \\ldots x_n, y_n$',
        tags: ['complexity-3', 'arrays', 'math', 'planimetry', 'numeric']
    }, {   // 9
        text: [
            'На плоскости заданы своими координатами $x_i$, $y_i$ четыре точки ($i=1,\\ldots,4$),',
            'причём абсциссы всех точек различны. Программа должна напечатать коэффициенты',
            'интерполяционного многочлена Лагранжа $y=L(x)$, проходящего через эти точки.<br/>',
            'Замечание. $L(x)=\\sum\\limits_{i=1}^4 L_i(x)$,',
            '$L_i(x)=\\prod\\limits_{k=1,\\ldots,4,k\\ne i}\\frac{x-x_k}{x_i-x_k}$'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real x[4], real y[4]')
            var L = polynomial()
            for (var i=0; i<4; ++i) {
                var c = polynomial(1)
                for (var j=0; j<4; ++j)
                    if (j !== i)
                        c.multiplyByMonomial(args.x[j])
                var d = c.val(args.x[i])
                if (Math.abs(d) < 1e-8)
                    throw new Error('Значение абсциссы ' + args.x[i] + ' встречается больше одного раза')
                c.mul(args.y[i]/d)
                L.add(c)
            }
            return L.coeff.join(' ')
        }],
        stdin: '1 2 3 4   1 2 3 4',
        stdinHint: 'Введите через пробел $x_1, x_2, x_3, x_4, y_1, y_2, y_3, y_4$',
        tags: ['complexity-4', 'arrays', 'math', 'polynomials', 'numeric']
    }, {   // 10
        text: ['Задана матрица $A$ размера $3\\times 3$. Программа должна напечатать коэффициенты',
               'характеристического многочлена этой матрицы.<br/>',
               'Замечание. Характеристическим многочленом квадратной матрицы $A$ называется',
               'определитель $P(\\lambda)=|A-\\lambda E|$, где $E$ &mdash; единичная матрица.'].join('\n'),
        scene: ['program', function(stdin) {
            // TODO
            var args = ppi(stdin, 'real a11, real a12, real a13, real a21, real a22, real a23, real a31, real a32, real a33')
            var chi = polynomial(args.a11, -1).mul(
                polynomial(args.a22, -1).mul([args.a33, -1]).sub(args.a23*args.a32)
            ).sub(
                polynomial(args.a33, -1).mul(args.a12).sub(args.a13*args.a32).mul(args.a21)
            ).add(
                polynomial(args.a22, -1).mul(-args.a13).add(args.a12*args.a23).mul(args.a31)
            )
            return chi.coeff.join(' ')
        }],
        stdin: '1 2 3   4 5 6   7 8 10',
        stdinHint: 'Введите через пробел $A_{11}, A_{12}, A_{13}, A_{21}, \\ldots A_{33}.$',
        tags: ['complexity-4', 'arrays', 'math', 'polynomials', 'matrices']
    }
]})

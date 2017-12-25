var tasks = require('../routes/tasks.js')
var ppi = require('../routes/parse-program-input.js')
var lp = require('../routes/line-printer.js')
var util = require('../routes/util.js')

module.exports = tasks.Tasks.fromObject({
    description: 'Разные задачи СО на контрольных и экзаменах 2014-2016',
    options: {
        noscreensize: true
    },
    tags: ['so-exams'],
    items: [{
        text: [ // 1
            'Задано натуральное число $n$ и массив из $n$ целых чисел $a_0, a_1, \\ldots, a_{n-1}$.',
            'Написать программу, которая определяет, делится ли сумма всех чётных элементов (то есть с чётными значениями)',
            'массива на сумму всех нечётных (с нечётными значениями).'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int a[n]')
            var s = [0, 0]
            for (var i=0; i<args.n; ++i) {
                var ai = args.a[i]
                s[ai&1] += ai
            }
            return s[1] === 0? 'Сумма всех нечётных значений равна нулю!': s[0] % s[1]? 'Не делится': 'Делится'
        }],
        stdin: '6 1 6 3 4 5 8',
        stdinHint: 'Введите через пробел $n, a_0, \\ldots, a_{n-1}$',
        tags: ['complexity-2', 'arrays'],
        origin: '160315.doc'
    }, {
        text: [ // 2
            'Задано натуральное число $n$ и массив из $n$ целых чисел $a_0, a_1, \\ldots, a_{n-1}$.',
            'Написать программу, которая определяет, делится ли сумма всех элементов массива с чётными',
            'индексами на сумму всех элементов с нечётными индексами.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int a[n]')
            var s = [0, 0]
            for (var i=0; i<args.n; ++i)
                s[i&1] += args.a[i]
            return s[1] === 0? 'Сумма всех значений с нечётными индексами равна нулю!': s[0] % s[1]? 'Не делится': 'Делится'
        }],
        stdin: '6 1 6 3 4 5 8',
        stdinHint: 'Введите через пробел $n, a_0, \\ldots, a_{n-1}$',
        tags: ['complexity-2', 'arrays'],
        origin: '160315.doc'
    }, {
        text: [ // 3
            'Задано натуральное число $n$ и массив из $n$ целых чисел $a_0, a_1, \\ldots, a_{n-1}$, упорядоченных по возрастанию,',
            'а также число $x$. Написать программу, которая вставляет $x$ в массив на $k$-тое место (которое нужно найти)',
            'так, чтобы массив остался упорядоченным. Элементы, бывшие до вставки на местах $k, k+1, \\ldots, n-2$,',
            'после вставки должны оказаться на местах $k+1, k+2, \\ldots, n-1$. Элемента $a_{n-1}$ после вставки не будет.',
            'Напечатать массив до и после вставки'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int a[n], int x')
            var n = args.n,   a = args.a,   x = args.x
            for (var i=1; i<n; ++i)
                if (a[i-1] > a[i])
                    throw new Error('Массив a не упорядочен по возрастанию!')
            var printer = lp()
            printer.println(a.join(' '))
            var k = n-1
            for (i=0; i<n; ++i)
                if (x <= a[i]) {
                    k = i
                    break
                }
            for (i=n-1; i>k; --i)
                a[i] = a[i-1]
            a[k] = x
            printer.println(a.join(' '))
            return printer.finish()
        }],
        stdin: '5   10 20 30 40 50     33',
        stdinHint: 'Введите через пробел $n, a_0, \\ldots, a_{n-1}, x$',
        tags: ['complexity-3', 'arrays'],
        origin: '160315.doc'
    }, {
        text: [ // 4
            'Задано натуральное число $n$ и массив из $n$ целых чисел $a_0, a_1, \\ldots, a_{n-1}$, а также число $x$.', 
            'Написать программу, которая удаляет из массива все элементы, равные $x$. При этом на место каждого удаленного',
            'элемента записывается элемент справа от него. Образовавшиеся в конце массива свободные места заполнить нулевым',
            'значением. Напечатать массив до и после удаления.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int a[n], int x')
            var n = args.n,   a = args.a,   x = args.x
            var printer = lp()
            printer.println(a.join(' '))
            var i = 0,   d = 0
            while (i+d<n) {
                if (a[i+d] === x)
                    ++d
                else {
                    if (d > 0)
                        a[i] = a[i+d]
                    ++i
                }
            }
            for (; i<n; ++i)
                a[i] = 0
            printer.println(a.join(' '))
            return printer.finish()
        }],
        stdin: '5   1 2 3 1 5     1',
        stdinHint: 'Введите через пробел $n, a_0, \\ldots, a_{n-1}, x$',
        tags: ['complexity-3', 'arrays'],
        origin: '160315.doc'
    }, {
        text: [ // 5
            'Дан массив из $n$ вещественных чисел $x_k$, $k=0, \\ldots, n-1$. Найти количество локальных максимумов в последовательности $x_k$',
            '($x_k$ является таким максимумом, если $x_k > x_{k-1}$ и $x_k > x_{k+1}$).'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int x[n]')
            var n = args.n,   x = args.x
            var nmax = 0
            for (var i=1; i<n-1; ++i)
                if (x[i] > x[i-1] && x[i] > x[i+1])
                    ++nmax, ++i
            return lp().println(nmax).finish()
        }],
        stdin: '10   2 1 1 2 1 1 2 1 1 2',
        stdinHint: 'Введите через пробел $n, x_0, \\ldots, x_{n-1}$',
        tags: ['complexity-2', 'arrays'],
        origin: '151111-test151111.pdf'
    }, {
        text: [ // 6
            'На плоскости своими координатами $x_k, y_k$ заданы четыре точки ${\\bf r}_1, {\\bf r}_2, {\\bf r}_3, {\\bf r}_4$.',
            'Определить, находится точка ${\\bf r}_4$ внутри треугольника с вершинами ${\\bf r}_1, {\\bf r}_2, {\\bf r}_3$ или',
            'нет. Для этого можно, например, найти сумму площадей трёх треугольников',
            '${\\bf r}_1, {\\bf r}_2, {\\bf r}_4$; ${\\bf r}_2, {\\bf r}_3, {\\bf r}_4$; ${\\bf r}_3, {\\bf r}_1, {\\bf r}_4$',
            'и сравнить её с площадью треугольника ${\\bf r}_1, {\\bf r}_2, {\\bf r}_3$.'].join('\n'),
        scene: ['program', function(stdin) {
            var xy = ppi(stdin, 'real xy[8]').xy
            function left(i) {
                var ib1 = i << 1,   ib2 = (ib1+2) % 6
                var rb = [xy[ib2]-xy[ib1], xy[ib2+1]-xy[ib1+1]]
                var rp = [xy[ 6 ]-xy[ib1], xy[  7  ]-xy[ib1+1]]
                return rb[0]*rp[1]-rb[1]*rp[0] > 0
            }
            var b1 = left(0),   b2 = left(1),   b3 = left(2)
            return b1 === b2   &&   b1 === b3? 'Точка находится внутри треугольника': 'Точка находится снаружи треугольника'
        }],
        stdin: '-5 -5   5 -5   0 5   0 0',
        stdinHint: 'Введите через пробел $x_1, y_1 \\ldots, x_4, y_4$',
        tags: ['complexity-2', 'math', 'planimetry'],
        origin: '151111-test151111.pdf'
    }, {
        text: [ // 7
            'Заданы два вещественных числа, $c$ и $\\varepsilon>0$. Определить, сходится ли последовательность',
            '$x_{k+1} = x_k^2 - c$, $k = 0, 1, 2, \\ldots$, $x_0 = 0$. Можно считать, что последовательность',
            'сходится, если для некоторого $k < 1000$ имеет место неравенство $|x_{k+1}-x_k| < \\varepsilon.$'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real c, real epsilon')
            var x = 0
            for (var i=0; i<1000; ++i) {
                var xnext = x*x - args.c
                if (Math.abs(x-xnext) < args.epsilon)
                    return 'Последовательность сходится'
                x = xnext
            }
            return 'Последовательность расходится'
        }],
        stdin: '0.7 1e-8',
        stdinHint: 'Введите через пробел $c, \\varepsilon$',
        tags: ['complexity-2', 'math', 'sequence', 'convergence'],
        origin: '151111-test151111.pdf'
    }, {
        text: [ // 8
            'Трамвайные билеты имеют шестизначные номера. Билет называется счастливым,',
            'если сумма первых трёх цифр равна сумме последних трёх цифр. Даны',
            'шесть цифр $n_1,\\ldots n_6$. Определить, можно ли из них составить номер счастливого билета.'].join('\n'),
        scene: ['program', function(stdin) {
            var n = ppi(stdin, 'digit n[6]').n
            var s = 0
            for (var i=0; i<6; ++i)
                s += n[i]
            if (!(s & 1)) {
                s >>= 1
                for (var i=1; i<5; ++i)
                    for (var j=i+1; j<6; ++j)
                        if (n[0] + n[i] + n[j] === s)
                            return 'Можно'
            }
            return 'Нельзя'
        }],
        stdin: '0 4 2 9 6 3',
        stdinHint: 'Введите через пробел $n_1,\\ldots, n_6$',
        tags: ['complexity-2', 'arrays'],
        origin: '151111-test151111.pdf'
    }, {
        text: [ // 9
            'Даны два упорядоченных по возрастанию массива вещественных чисел $a_0,\\ldots,a_{n-1}$',
            'и $b_0,\\ldots,b_{m-1}$, причем $m\\geqslant n$. Определить, можно ли получить массив $a_k$, удаляя',
            'некоторые элементы из массива $b_k$. Если можно, напечатать индексы тех',
            'элементов массива $b_k$, которые надо удалить.'].join('\n'),
        scene: ['program', function(stdin) {
            function checkGrowth(x, name) {
                for (var i=1; i<x.length; ++i)
                    if (x[i] < x[i-1])
                        throw new Error('Нарушено условие упорядоченности по возрастанию для массива ' + name)
            }
            var args = ppi(stdin, 'uint n, real a[n], uint m, real b[m]')
            var a = args.a,   b = args.b,   n = args.n,   m = args.m
            if (n > m)
                throw new Error('Не выполнено условие m >= n')
            checkGrowth(a, 'a')
            checkGrowth(b, 'b')
            var rm = []
            var ia = 0,   ib = 0
            while(ia < n && ib < m) {
                var ai = a[ia],   bi = b[ib]
                if (ai === bi)
                    ++ia, ++ib
                else if (ai < bi)
                    break
                else
                    rm.push(ib++)
            }
            if (ia === n) {
                for (; ib<m; ++ib)
                    rm.push(ib)
                if (rm.length === 0)
                    return 'Можно: массивы одинаковые, ничего удалять не нужно'
                else
                    return 'Можно:\n' + rm.join(' ')
            }
            return 'Нельзя'
        }],
        stdin: '3   2 4 6     7   1 2 3 4 5 6 7',
        stdinHint: 'Введите через пробел $n, a_0\\ldots, a_{n-1}, m, b_0, \\ldots, b_{m-1}$',
        tags: ['complexity-3', 'arrays'],
        origin: '151111-test151111.pdf'
    }, {
        text: [ // 10
            'Дано натуральное число $n$ и массив (размера $N\\geqslant n$) вещественных чисел $x_i$, $i=0,\\ldots,N-1$.',
            'Создать массив вещественных чисел размера $N-n+1$, элементы $y_i$ которого &mdash; средние значения',
            '$n$ элементов исходного массива: $y_i=\\frac{1}{n}\\sum\\limits_{j=0}^{n-1} x_{i+j}$ (это называется',
            'скользящее среднее). Вывести на экран оба массива.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, whole N, real x[N]')
            var n = args.n,   N = args.N,   x = args.x
            if (n > N)
                throw new Error('Не выполнено условие N >= n')
            var y = new Array(N-n+1)
            var s = 0
            for (var i=0; i<n; ++i)
                s += x[i]
            for (i=0; i<N-n+1; ++i) {
                y[i] = s/n
                if (i<N-n)
                    s = s - x[i] + x[i+n]
            }
            return lp().println(x.join('\t')).println(y.join('\t')).finish()
        }],
        stdin: '3     10   1 1 1 1 1 10 10 10 10 10',
        stdinHint: 'Введите через пробел $n, N, x_0\\ldots, x_{N-1}$',
        tags: ['complexity-2', 'numeric', 'arrays', 'elegant-solution'],
        origin: '141222-test-02.tex'
    }, {
        text: [ // 11
            'Дан неупорядоченный непустой массив целых неотрицательных чисел $a_1, \\ldots a_n$.',
            'Найти два самых больших элемента $a$, $b$, причем $b&lt;a$.',
            'Если все элементы массива одинаковы, то $b$ не определено. Напечатать массив и найденные $a$, $b$.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, uint a[n]')
            var n = args.n,   a = args.a
            var A = a[0],   B = A
            for (var i=1; i<n; ++i) {
                var ai = a[i]
                if (A < ai) {
                    B = A
                    A = ai
                }
            }
            var printer = lp()
            printer.println(a.join(' '))
            if (A === B)
                printer.println('a = ' + A + ', b не определено (все элементы массива одинаковые)')
            else
                printer.println('a = ' + A + ', b = ' + B)
            return printer.finish()
        }],
        stdin: '5   6 9 9 1 0',
        stdinHint: 'Введите через пробел $n, a_1\\ldots, a_n$',
        tags: ['complexity-3', 'arrays'],
        origin: '141222-test-02.tex'
    }, {
        text: [ // 12
            'Дан неупорядоченный массив целых чисел $x_i$, $i=0,\\ldots,N-1$, $N&gt;2$. Найти элемент $x_j$, $0&lt;j&lt;N-1$,',
            'наиболее отличающийся от своих соседей справа и слева: $j=\\arg\\max\\limits_j\\left(|x_j-x_{j-1}| + |x_j-x_{j+1}|\\right)$.',
            'Напечатать массив, $j$, $x_j$.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole N, int x[N]')
            var N = args.N,   x = args.x
            if (N < 3)
                throw new Error('Нарушено требование N>2')
            function d(i) {
                return Math.abs(x[i] - x[i-1]) + Math.abs(x[i] - x[i+1])
            }
            var j = 1
            for (var i=2; i+1<N; ++i) {
                if (d(j) < d(i))
                    j = i
            }
            return lp().println(x.join(' ')).println('j = ' + j + ', x[j] = ' + x[j]).finish()
        }],
        stdin: '10   0 3 2 2 10 3 3 20 4 4',
        stdinHint: 'Введите через пробел $N, x_0\\ldots, x_{N-1}$',
        tags: ['complexity-2', 'arrays'],
        origin: '141222-test-02.tex'
    }, {
        text: [ // 13
            'Дан неупорядоченный массив натуральных чисел $a_1,\\ldots,a_N$ и натуральное число $n>1$. Напечатать все элементы,',
            'не имеющие простых делителей от 2 до $n$ (включительно, если $n$ простое). <br/>',
            'Указание. Если у числа нет простых делителей от 2 до $n$, то непростых тоже нет, и наоборот.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, whole N, whole a[N]')
            var n = args.n,   N = args.N,   a = args.a
            if (n < 2)
                throw new Error('Нарушено требование n>1')
            if (n > 100)
                throw new Error('Слишком большое n')
            function good(x) {
                for (var d=2; d<=n; ++d)
                    if (x % d === 0)
                        return false
                return true
            }
            var printer = lp()
            var hasGood = false
            for (var i=0; i<N; ++i) {
                var ai = a[i]
                if (good(ai))
                    printer.print(ai), hasGood = true
            }
            return hasGood? printer.finish(): 'Искомые числа не найдены'
        }],
        stdin: '10      10   70 71 72 73 74 75 76 77 78 79',
        stdinHint: 'Введите через пробел $n, N, a_1\\ldots, a_N$',
        tags: ['complexity-2', 'arrays'],
        origin: '141222-test-02.tex'
    }, {
        text: [ // 14
            'Кусочно-линейная непрерывная функция $f(x)$ задана таблицей значений $x_i$, $f_i$, $i=0,\\ldots,n-1$ &mdash; двумя массивами вещественных чисел,',
            'причем $x_i$ строго монотонно возрастают. Найти номер участка, на котором производная $\\frac{df}{dx}$ имеет наибольшее значение.',
            'Вывести этот номер и значение производной. Считать, что первый участок имеет номер 0.'].join('\n'),
        scene: ['program', function(stdin) {
            function checkStrictGrowth(x) {
                for (var i=1; i<x.length; ++i)
                    if (x[i] <= x[i-1])
                        throw new Error('Нарушено условие строго монотонного возрастания для массива x')
            }
            var args = ppi(stdin, 'whole n, real x[n], real f[n]')
            var n = args.n,   x = args.x,   f = args.f
            if (n < 2)
                throw new Error('Нет ни одного участка, введите n>1')
            checkStrictGrowth(x)
            function dfdx(i) {
                return (f[i+1] - f[i]) / (x[i+1] - x[i])
            }
            var ibest = 0
            for (var i=1; i+1<n; ++i) {
                if (dfdx(i) > dfdx(ibest))
                    ibest = i
            }
            return lp().println('Номер участка: ' + ibest).println('df/dx = ' + dfdx(ibest)).finish()
        }],
        stdin: '5   2 3 4 4.1 5   1 2 3 4 5',
        stdinHint: 'Введите через пробел $n, x_0\\ldots, x_{n-1}, f_0, \\ldots, f_{n-1}$',
        tags: ['complexity-2', 'arrays', 'math'],
        origin: '141222-test-02.tex'
    }, {
        text: [ // 15
            'Дважды дифференцируемая функция $f(x)$ задана таблицей значений $f_i$, $i=0,\\ldots,n-1$ &mdash; массивом вещественных чисел,',
            'причем $f_i=f(hi)$ &mdash; значения в узлах $x_i=hi$ равномерной сетки. Найти номер узла, в котором вторая производная',
            '$\\frac{d^2f}{dx^2}$ имеет наибольшее значение. Вторую производную вычислить по формуле',
            '$\\left.\\frac{d^2f}{dx^2}\\right|_{x=hi}=\\frac{f_{i-1} - 2f_i+f_{i+1}}{h^2}$.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real f[n]')
            var n = args.n,   x = args.x,   f = args.f
            if (n < 3)
                throw new Error('Введите n>2')
            function d2f(i) {
                return f[i-1] - 2*f[i] + f[i+1]
            }
            var ibest = 1
            for (var i=2; i+1<n; ++i) {
                if (d2f(i) > d2f(ibest))
                    ibest = i
            }
            return 'Вторая производная имеет наибольшее значение в узле ' + ibest
        }],
        stdin: '5   1 1 0 1 1',
        stdinHint: 'Введите через пробел $n, f_0, \\ldots, f_{n-1}$',
        tags: ['complexity-2', 'arrays', 'math'],
        origin: '141222-test-02.tex'
    }, {
        text: [ // 16
            'Даны два массива вещественных чисел, $x$ и $y$. Их длина одинакова и равна $n$. Каждый ($i$-й) элемент массива $x$ содержит',
            'абсциссу некоторой точки ${\\bf r}_i$ на плоскости, а элемент массива $y$ &mdash; её ординату. Найти среди этих точек',
            'ближайшую к началу координат и напечатать её координаты.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real x[n], real y[n]')
            var n = args.n,   x = args.x,   y = args.y
            function d2(i) {
                return x[i]*x[i] + y[i]*y[i]
            }
            var ibest = 0
            for (var i=1; i<n; ++i) {
                if (d2(i) < d2(ibest))
                    ibest = i
            }
            return 'Точка с номером ' + ibest + ' - ближайшая к началу координат\nЕё координаты: ' + x[ibest] + ', ' + y[ibest]
        }],
        stdin: '8   3 3 0 -1 -1 -1 0 3   0 2 2 2 0 -4 -4 -4',
        stdinHint: 'Введите через пробел $n, x_0, \\ldots, x_{n-1}, y_0, \\ldots, y_{n-1}$',
        tags: ['complexity-2', 'arrays', 'math', 'planimetry'],
        origin: '151106-test.tex'
    }, {
        text: [ // 17
            'Найти приближенное решение уравнения $x=f(x)$, где $f(x)=\\alpha e^x$, при $\\alpha=0.2$ методом простой итерации:',
            '$x_{n+1}=f(x_n)$. В качестве начального приближения взять $x_0=0$. Итерации продолжать до тех пор,',
            'пока $|x_{n+1}-x_n|\\geqslant \\varepsilon$, где $\\varepsilon$ &mdash; заданная точность.',
            'Напечатать полученную точность и количество проделанных итераций.'].join('\n'),
        scene: ['program', function(stdin) {
            var epsilon = ppi(stdin, 'real epsilon').epsilon
            function next(x) {
                return 0.2*Math.exp(x)
            }
            var x = 0, MaxIters = 10000
            for (var i=1; i<MaxIters; ++i) {
                var xnext = next(x)
                var d = Math.abs(x-xnext)
                x = xnext
                if (d < epsilon)
                    break
            }
            if (i>=MaxIters)
                return 'Процесс не сошёлся за ' + MaxIters + ' итераций'
            return('Решение: x = ' + x + ', итераций: ' + i)
        }],
        stdin: '1e-8',
        stdinHint: 'Введите $\\varepsilon$',
        tags: ['complexity-2', 'arrays', 'math', 'numeric'],
        origin: '151106-test.tex'
    }, {
        text: [ // 18
            'Даны два массива вещественных чисел, $x$ и $y$. Их длина одинакова и равна $n$. Каждый ($i$-й) элемент массива $x$ содержит',
            'абсциссу некоторой точки ${\\bf r}_i$ на плоскости, а элемент массива $y$ &mdash; её ординату. Найти пару точек, расстояние',
            'между которыми минимально (если таких пар несколько, можно выбрать любую). Напечатать номера точек и расстояние между ними.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real x[n], real y[n]')
            var n = args.n,   x = args.x,   y = args.y
            function d2(i, j) {
                var dx = x[i] - x[j],   dy = y[i] - y[j]
                return dx*dx + dy*dy
            }
            var ibest = 0,   jbest = 1
            for (var i=0; i+1<n; ++i)
                for (var j=i+1; j<n; ++j)
                    if (d2(i,j) < d2(ibest, jbest))
                        ibest = i, jbest = j
            return 'Ближайшие друг к другу точки имеют номера ' + ibest + ', ' + jbest +
                   ',\nрасстояние между ними равно ' + Math.sqrt(d2(ibest, jbest))
        }],
        stdin: '8   3 3 0 -1 -1 -1 0 3   0 2 2 2 0 -4 -4 -4',
        stdinHint: 'Введите через пробел $n, x_0, \\ldots, x_{n-1}, y_0, \\ldots, y_{n-1}$',
        tags: ['complexity-2', 'arrays', 'math', 'planimetry'],
        origin: '151106-test.tex'
    }, {
        text: [ // 19
            'Дан массив целых чисел $a_0, \\ldots a_{n-1}$, $n&gt;1$. Найти самый длинный участок строгой монотонности, напечатать индекс его начала и длину.',
            'Например, для массива $\\{1, 2, 3, 2, 0, -5, -5, 1\\}$ программа должна напечатать 2, 4.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int a[n]')
            var n = args.n,   a = args.a
            if (n < 2)
                throw new Error('Нарушено условие n>1')
            function dir(i) {
                var d = a[i] - a[i-1]
                return d > 0? 1: d < 0? -1: 0
            }
            var d0 = 0,   i0 = 0,   i0best = 0,   lbest = 1
            function count(i) {
                var l = i - i0
                if (l > lbest) {
                    lbest = l
                    i0best = i0
                }
            }
            for (var i=1; i<n; ++i) {
                var d = dir(i)
                if (d !== d0) {
                    if (d0)
                        count(i)
                    i0 = i-1
                    d0 = d
                }
            }
            count (i)
            return lp().println(i0best, lbest).finish()
        }],
        stdin: '8   1 2 3 2 0 -5 -5 1',
        stdinHint: 'Введите через пробел $n, a_0, \\ldots, a_{n-1}$',
        tags: ['complexity-4', 'arrays'],
        origin: '151106-test.tex'
    }, {
        text: [ // 20
            'Дан массив целых чисел $x_k$, $k=0, \\ldots n$, $n>1$. Напечатать самую большую по модулю разность соседних элементов $x_k-x_{k-1}$.',
            'Например, для массива $\\{1, 2, 3, 2, 0, -5, -5, -3\\}$ программа должна напечатать $-5$ (в данном массиве это $x_5-x_4$).',
            'То есть искать надо самую большую по модулю разность, но печатать саму разность, не вычисляя модуль.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int x[n]')
            var n = args.n,   x = args.x
            if (n < 2)
                throw new Error('Нарушено условие n>1')
            var dmax = 0
            for (var i=1; i<n; ++i) {
                var d = x[i]-x[i-1]
                if (Math.abs(dmax) < Math.abs(d))
                    dmax = d
            }
            return lp().println(dmax).finish()
        }],
        stdin: '8   1 2 3 2 0 -5 -5 -3',
        stdinHint: 'Введите через пробел $n, a_0, \\ldots, a_{n-1}$',
        tags: ['complexity-2', 'arrays'],
        origin: '151106-test.tex'
    }, {    // 21
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
        stdinHint: 'Введите через пробел $n, a_1, \\ldots, a_n, m, b_1, \\ldots, b_m$',
        tags: ['complexity-1', 'arrays']
    }, {    // 22
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
        stdinHint: 'Введите через пробел $n, a_1, \\ldots, a_n$',
        tags: ['complexity-1', 'arrays']
    }, {    // 23
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
        stdinHint: 'Введите через пробел $n$, число строк в $A_1$, число столбцов в $A_1, \\ldots,$ число строк в $A_n$, число столбцов в $A_n$',
        tags: ['complexity-2', 'arrays']
    }, {    // 24
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
        stdin: '3 2 5 4 2 6 5',
        stdinHint: 'Введите через пробел $n$, число строк в $A_1$, число столбцов в $A_1, \\ldots,$ число строк в $A_n$, число столбцов в $A_n$',
        tags: ['complexity-2', 'arrays']
    }
]})

var tasks = require('../routes/tasks.js')
var ppi = require('../routes/parse-program-input.js')
var lp = require('../routes/line-printer.js')

function isPermutation(a) {
    var n = a.length
    var f = new Array(n).fill(false)
    for (var i=0; i<n; ++i) {
        var ai = a[i]
        if (ai < 1   ||   ai > n   ||   f[ai])
            return false
        f[ai] = true
    }
    return true
}

function sqr(x) { return x*x }

var images = {
    intersect: 'data:image/png;base64,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',
    robots: ' data:image/png;base64,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'
}

function image(name) {
    return '<img src="' + images[name] + '"/>'
}

module.exports = tasks.Tasks.fromObject({
    description: 'Контрольная работа 2 СО 2017 осень',
    items: [{
        text: [
            'Задано натуральное число $n$. Напечатать биномиальные коэффициенты $a_0,\\ldots,a_n$ в разложении $(1+x)^n=a_0 + a_1 x + \\ldots + a_n x^n$.',
            'Воспользлваться формулой $a_k = \\frac{n!}{k!(n-k)!}$, а лучше треугольником Паскаля:',
            '<pre>',
            '        1',
            '      1   1',
            '    1   2   1',
            '  1   3   3   1',
            '1   4   6   4   1',
            '       ...',
            '</pre>'].join('\n'),
        scene: ['program', function(stdin) {
            var n = ppi(stdin, 'whole n').n
            if (n > 100)
                throw new Error('Слишком большое n')
            var bc = [1]
            for (var i=1; i<n; ++i) {
                var bc2 = [1]
                for (var j=1; j<i; ++j)
                    bc2.push(bc[j-1] + bc[j])
                bc2.push(1)
                bc = bc2
            }
            return lp().println(bc.join(' ')).finish()
        }],
        stdin: '5',
        stdinHint: 'Введите $n$'
    }, {
        text: 'Даны натуральные числа $n$, $m$, прямоугольная матрица $A$ вещественных чисел (в ней $n$ строк и $m$ столбцов) и столбец $x$ из $m$ элементов. Напечатать матричное произведение $Ax$.',
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, whole m, real a[n*m], real x[m]')
            var printer = lp()
            for (var i=0; i<args.n; ++i) {
                var s = 0
                for (var j=0; j<args.m; ++j)
                    s += args.a[i*args.m + j] * args.x[j]
                printer.println(s)
            }
            return printer.finish()
        }],
        stdin: '3 2    1 2   3 4   5 6     7 8',
        stdinHint: 'Введите через пробел $n, m, A_{11}, A_{12}, \\ldots A_{nn}, x_1, \\ldots x_n$'
    }, {
        text: 'Даны натуральные числа $n$, $m$, прямоугольная матрица $A$ вещественных чисел (в ней $n$ строк и $m$ столбцов) и столбец $x$ из $n$ элементов. Напечатать матричное произведение $x^T A$.',
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, whole m, real a[n*m], real x[n]')
            var printer = lp()
            for (var j=0; j<args.m; ++j) {
                var s = 0
                for (var i=0; i<args.n; ++i)
                    s += args.x[i] * args.a[i*args.m + j]
                printer.print(s)
            }
            return printer.finish()
        }],
        stdin: '3 2    1 2   3 4   5 6     7 8 9',
        stdinHint: 'Введите через пробел $n, m, A_{11}, A_{12}, \\ldots A_{nn}, x_1, \\ldots x_m$'
    }, {
        text: [
            'Задана последовательность $a_1, \\ldots, a_n$ из $n$ цифр от 0 до 9. Подсчитать и напечатать частоты этих цифр.',
            'Частота $\\omega_k$ цифры $k$ определяется по формуле $\\omega_k=\\frac{n_k}{n}$,',
            'где $n_k$ &mdash; количество повторений цифры $k$'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, uint a[n]')
            var printer = lp()
            var result = new Array(10).fill(0)
            args.a.forEach(function(d, i) {
                if (d < 0   ||   d > 9)
                    throw new Error('Ожидалась цифра от 0 до 9' + ppi.newReader(stdin).errorPositionIndicator(i+2))
                result[d] += 1/args.n
            })
            result.forEach(function(omega, d) {
                printer.println(d, omega)
            })
            return printer.finish()
        }],
        stdin: '50 8 6 1 5 7 4 7 4 4 3 3 3 3 1 6 8 4 1 0 2 5 6 6 0 9 9 4 0 3 3 1 8 6 1 4 4 9 5 0 1 1 7 3 8 0 4 0 8 1 0',
        stdinHint: 'Введите через пробел $n, a_1, \\ldots, a_n$'
    }, {
        text: [
            'Заданы два натуральных числа, $r$ и $n$. Мультииндекс размера $r$ &mdash; это массив натуральных чисел, каждое от 1 до $n$.',
            'Напечатать все возможные для данных $r$ и $n$ мультииндексы.',
            'Указание: можно написать функцию инкремента ("увеличения на единицу") мультииндекса, возвращающую <tt>true</tt>,',
            'если ей это удалось и <tt>false</tt>, если нет (был передан "последний" мультииндекс); вызывать эту функцию в цикле,',
            'пока она не вернёт <tt>false</tt>.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole r, whole n')
            if (Math.pow(args.n, args.r) > 1000)
                throw new Error('Слишком много значений мультииндекса, уменьшите r и/или n')
            var printer = lp()
            function inc(m) {
                for (var i=args.r-1; i>=0; --i) {
                    if (m[i] < args.n) {
                        ++m[i]
                        return true
                    }
                    m[i] = 1
                }
                return false
            }
            var m = new Array(args.r).fill(1)
            do {
                printer.println(m.join(' '))
            } while(inc(m))
            return printer.finish()
        }],
        stdin: '2 3',
        stdinHint: 'Введите через пробел $r, n$'
    }, {
        text: [
            'Перестановкой называется упорядоченный набор из <b>всех</b> чисел от $1$ до $n$. Заданы число $n$ и массив целых чисел $a_1, \\ldots a_n$.',
            'Определить, перестановка в этом массиве или нет (чтобы это была перестановка, все элементы должны быть от 1 до $n$,',
            'и они все должны быть различны).'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int a[n]')
            return isPermutation(args.a)? 'Перестановка': 'Не перестановка'
        }],
        stdin: '5   1 5 3 4 2',
        stdinHint: 'Введите через пробел $n, a_1, \\ldots, a_n$'
    }, {
        text: [
            'Перестановкой называется упорядоченный набор из <b>всех</b> чисел от $1$ до $n$.',
            'Транспозицией называется операция над перестановкой, когда два элемента меняются местами. Результат транспозиции &mdash; другая перестановка.',
            'Заданы число $n>1$ и две перестановки $a_1, \\ldots, a_n, b_1, \\ldots, b_n$. Определить, можно ли одну из них получить из другой при помощи одной транспозиции.',
            'Если введённые данные &mdash; не перестановки, программа имеет право работать некорректно.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, whole a[n], whole b[n]')
            if (args.n < 2)
                throw new Error('Введите n>1' + ppi.newReader(stdin).errorPositionIndicator(0))
            if (!isPermutation(args.a))
                throw new Error('Первый массив - не перестановка' + ppi.newReader(stdin).errorPositionIndicator(2))
            if (!isPermutation(args.b))
                throw new Error('Второй массив - не перестановка' + ppi.newReader(stdin).errorPositionIndicator(args.n+2))
            var nd = 0
            for (var i=0; i<args.n; ++i)
                if (args.a[i] !== args.b[i])
                    ++nd
            return nd === 2? 'Можно': 'Нельзя'
        }],
        stdin: '5   1 5 3 4 2   1 5 2 4 3',
        stdinHint: 'Введите через пробел $n, a_1, \\ldots, a_n, b_1, \\ldots, b_n$'
    }, {
        text: [
            'Задано натуральное число $n$ и массив из $2n$ вещественных чисел. Это декартовы координаты векторов на плоскости',
            '(в первом и втором элементах &mdash; координаты первого вектора, в третьем и четвёртом &mdash; координаты второго и т. д.).',
            'Напечатать координаты самого длинного вектора.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real xy[2*n]')
            function sqlength(i) {
                return sqr(args.xy[i]) + sqr(args.xy[i+1])
            }
            var ilongest = 0
            for (var i=2, _2n=2*args.n; i<_2n; i+=2)
                if (sqlength(i) > sqlength(ilongest))
                    ilongest = i
            return args.xy.slice(ilongest, ilongest+2).join(' ')
        }],
        stdin: '5   -2 0  -1 1   0 2   1 3   2 4',
        stdinHint: 'Введите через пробел $n, x_1, y_1 \\ldots, x_n, y_n$'
    }, {
        text: [
            'Заданы 8 вещественных чисел. Это декартовы координаты четырёх точек, ${\\bf p}_1$, ${\\bf p}_2$, ${\\bf q}_1$, ${\\bf q}_2$, лежащих на плоскости.',
            'Эти точки &mdash; концы двух отрезков на плоскости (один отрезок между точками ${\\bf p}_1$ и ${\\bf p}_2$, другой &mdash; между ${\\bf q}_1$ и ${\\bf q}_2$).',
            'Определить, пересекаются отрезки или нет. Указание. Отрезки пересекаются, если концы каждого из них лежат по разные стороны прямой, содержащей другой отрезок;',
            'о том, с какой стороны, например, точка ${\\bf q}_1$ от прямой, содержащей отрезок между ${\\bf p}_1$ и ${\\bf p}_2$, можно судить по знаку смешанного',
            'произведения $({\\bf q}_1-{\\bf p}_1)\\times({\\bf p}_2-{\\bf p}_1)\\cdot {\\bf k}$ (орт ${\\bf k}$ перпендикулярен плоскости).',
            'Смешанное произведение вычисляется так: ${\\bf a}\\times{\\bf b}\\cdot {\\bf k}=a_1b_2-a_2b_1$ ($a_1$, $a_2$ и $b_1$, $b_2$ &mdash;',
            'координаты ${\\bf a}$ и ${\\bf b}$ соответственно).<br/>',
            image('intersect')].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real p1[2], real p2[2], real q1[2], real q2[2]')
            function sub(a, b) {
                return [a[0]-b[0], a[1]-b[1]]
            }
            function cross(a, b) {
                return a[0]*b[1] - a[1]*b[0]
            }
            var dp = sub(args.p2, args.p1)
            var dq = sub(args.q2, args.q1)
            return cross(sub(args.q1, args.p1), dp) * cross(sub(args.q2, args.p1), dp) <= 0 &&
                   cross(sub(args.p1, args.q1), dq) * cross(sub(args.p2, args.q1), dq) <= 0 ?
                        'Отрезки пересекаются' : 'Отрезки не пересекаются'
        }],
        stdin: '-1 0 1 0 0 -1 0 1',
        stdinHint: 'Введите через пробел $p_{1,x}, p_{1,y}, p_{2,x}, p_{2,y}, q_{1,x}, q_{1,y}, q_{2,x}, q_{2,y}$'
    }, {
        text: [
            'Автодорога состоит из $n$ дуг окружности радиусов $R_1,\\ldots,R_n$. Расставьте знаки ограничения скорости на каждой дуге,',
            'исходя из требования непревышения заданного ускорения $a_{\\max}$. Учтите, что максимально допустимая скорость в любом случае',
            'не должна превышать заданную $v_{\\max}$. Указание. При постоянной скорости движения $v$ по дуге радиуса $R$ ускорение $a=\\omega^2 R$,',
            'где $\\omega$ &mdash; угловая скорость: $v=\\omega R$. Ускорение $a_{\\max}$ и радиусы задавать в СИ, $v_{\\max}$ &mdash; в км/ч,',
            'ограничение скорости печатать в км/ч.'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real amax, real vmax, whole n, real R[n]')
            // var ppi.newReader(stdin).errorPositionIndicator(args.n+2))
            var err = function(msg, n) {
                throw new Error(msg + ppi.newReader(stdin).errorPositionIndicator(n))
            }
            if (args.amax <= 0)
                err('Максимальное ускорение должно быть положительным', 1)
            if (args.vmax <= 0)
                err('Глобальное ограничение максимальной скорости должно быть положительным', 2)
            var printer = lp()
            for (var i=0; i<args.n; ++i) {
                if (args.R[i] <= 0)
                    err('Радиусы должны быть положительными', i+4)
                var vmax = Math.min(args.vmax, Math.sqrt(args.amax*args.R[i])*3.6)
                printer.println(i+1, '(' + args.R[i] + ' м):', vmax + ' км/ч')
            }
            return printer.finish()
        }],
        stdin: '5 110   3   1000   100   10',
        stdinHint: 'Введите через пробел $a_{\\max}, v_{\\max}, n, R_1, \\ldots, R_n$'
    }, {
        text: [
            'В квадратном зале пол покрыт квадратными плитками ($2n$ плиток в длину и столько же в ширину); зал разделён двумя перегородками',
            'на 4 одинаковые квадратные части. В каждой половине каждой перегородки имеется проём шириной в одну плитку. В одном углу зала,',
            'на плитке с координатами $(1,1)$, стоит робот; в другом углу с координатами $(2n,2n)$ стоит другой робот. Как им поменяться местами',
            'и при этом не встретиться друг с другом и с перегородками? Напечатайте траектории их движения. Каждый робот может делать шаги в любую',
            'из четырёх сторон на одну плитку. Роботы шагают одновременно! Проёмы в горизонтальной перегородке заданы координатами $x_1, x_2$,',
            'в вертикальной &mdash; координатами $y_1, y_2$.<br/>',
            image('robots')].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, whole xf[2], whole yf[2]')
            // var ppi.newReader(stdin).errorPositionIndicator(args.n+2))
            var err = function(msg, n) {
                throw new Error(msg + ppi.newReader(stdin).errorPositionIndicator(n))
            }
            if (args.n > 100)
                err('n должно быть не больше 100', 1)
            if (args.xf[0] > args.n)
                err('x1 должно быть не больше n', 2)
            if (args.xf[1] <= args.n   ||   args.xf[1] > 2*args.n)
                err('x2 должно быть от n до 2n', 3)
            if (args.yf[0] > args.n)
                err('y1 должно быть не больше n', 4)
            if (args.yf[1] <= args.n   ||   args.yf[1] > 2*args.n)
                err('y2 должно быть от n до 2n', 5)
            var printer = lp()
            var nsteps = 2*(2*args.n-1)
            var p1 = { id: 'Робот 1', x: 1, y: 1, s: 0, index: 0 }
            var p2 = { id: 'Робот 2', x: 2*args.n, y: 2*args.n, s: 0, index: 1 }
            function printRobotPos(p) {
                printer.print(p.id + ':', p.x, p.y)
            }
            printRobotPos(p1)
            printer.print('    ')
            printRobotPos(p2)
            printer.println()
            function moveRobot(p) {
                var sgn = 1-2*p.index
                var ok = false
                while(!ok) {
                    switch(p.s) {
                    case 0:
                        if (sgn*p.y < sgn*args.yf[p.index]) {
                            p.y += sgn
                            ok = true
                        }
                        else
                            ++p.s
                        break
                    case 1:
                        if (sgn*p.x < sgn*args.xf[1-p.index]) {
                            p.x += sgn
                            ok = true
                        }
                        else
                            ++p.s
                        break
                    case 2:
                        if (sgn*p.y < sgn*((1-p.index)*(2*args.n-1)+1)) {
                            p.y += sgn
                            ok = true
                        }
                        else
                            ++p.s
                        break
                    case 3:
                        if (sgn*p.x < sgn*((1-p.index)*(2*args.n-1)+1)) {
                            p.x += sgn
                            ok = true
                        }
                        else
                            ++p.s
                        break
                    default:
                        return
                    }
                }
                printRobotPos(p)
            }

            for (var i=0; i<nsteps; ++i) {
                moveRobot(p1)
                printer.print('    ')
                moveRobot(p2)
                printer.println()
            }
            return printer.finish()
        }],
        stdin: '4 2 7 1 6',
        stdinHint: 'Введите через пробел $n, x_1, x_2, y_1, y_2$'
    }, {
        text: [
            'Заданы две последовательности целых чисел, $a_1, \\ldots a_n$ и $b_1, \\ldots b_m$,',
            'Определить, встречается ли вторая последовательность в первой, т. е. существует ли такое',
            '$k > 0$, что $a_k=b_1, a_{k+1}=b_2, \\ldots, a_{k+m-1}=b_m$. Если ответ положительный,',
            'напечатать $k$ (если таких $k$ несколько, напечатать наименьшее из них).'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int a[n], whole m, int b[m]')
            var kmax = args.n - args.m
            for (var k=0; k<=kmax; ++k) {
                var same = true
                for (var i=0; i<args.m && same; ++i)
                    if (args.a[k+i] !== args.b[i])
                        same = false
                if (same)
                    return 'Встречается: k = ' + (k+1)
            }
            return 'Не встречается'
        }],
        stdin: '9   1 2 3 4 3 2 3 4 7     3   2 3 4',
        stdinHint: 'Введите через пробел $n, a_1, \\ldots, a_n, m, b_1, \\ldots, b_m$'
    }
]})
/*

Входной поток состоит из слов, разделённых пробелами. Напечатайте палиндромы (слова, читающиеся одинаково слева направо и справа налево, например, \\textit{шалаш}), встречающиеся среди этих слов и состоящие не менее, чем из трёх букв; не печатайте одни и те же слова по нескольку раз. Указание: строками (\\verb=std::string=, \\verb=QString=) можно пользоваться как массивами; в частности, размер можно узнать при помощи метода \\verb=size()=. Уже напечатанные слова можно хранить в \\verb=std::set<std::string>= или \\verb=QSet<QString>=.



Заданы две строки с текстом, $p$ и $q$. Определить, встречается ли текст строки $q$ в строке $p$. Если да, то напечатать смещение, начиная с которого в $p$ начинается текст из $q$ (если $q$ встречается в $p$ несколько раз, то напечатать самое маленькое из всех возможных смещений). Строки можно читать из стандартного ввода при помощи функции \\verb=getline()=.

*/

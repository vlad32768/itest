var tasks = require('../routes/tasks.js')
var ppi = require('../routes/parse-program-input.js')
var lp = require('../routes/line-printer.js')
var util = require('../routes/util.js')

module.exports = tasks.Tasks.fromObject({
    description: 'Разные задачи СО на контрольных и экзаменах 2014-2016',
    options: {
        noscreensize: true
    },
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
        origin: '151111-test151111.pdf'
    }
]})

/*
// 151111-test151111.pdf

# unknown
3. Заданы два числа, c и ε > 0. Определить, сходится ли последовательность
xk+1 = x2k - c, k = 0, 1, 2, . . ., x0 = 0. Можно считать, что последовательность
сходится, если для некоторого k < 1000 имеет место неравенство |xk+1-xk| < ε.

# unknown
4. На плоскости своими координатами xk, yk заданы n точек r0, . . . , rn-1. Найти
площадь многоугольника с вершинами в этих точках, считая, что самопересе-
чения границы отсутствуют. Указание: ⪸F dF = ⰸ∂F xdy, где F ⫈ это область
на плоскости, а ∂F Ⰸ её граница; интеграл по каждой грани многоугольника
легко вычислить точно.

# unknown
5. На плоскости своими координатами xk, yk заданы n точек r0, . . . , rn-1, причем
xk строго монотонно возрастают. Заданные точки определяют на отрезке x ∈
[x0, xn-1] кусочно-линейную функцию f(x). Вычислить ⯘xx0n-1 f(x) dx.

# unknown
6. Трамвайные билеты имеют шестизначные номера. Билет называется счастли-
вым, если сумма первых трёх цифр равна сумме последних трёх цифр. Даны
шесть цифр. Определить, можно ли из них составить номер счастливого билета.

# unknown
8. Даны два упорядоченных по возрастанию массива вещественных чисел a0, .. . ,an-1
и b0, . . . , bm-1, причем m ≥ n. Определить, можно ли получить массив ak, уда-
ляя некоторые элементы из массива bk. Если можно, напечатать индексы тех
элементов массива bk, которые надо удалить.


// 141222-test-02.tex

# unknown
\item Дано натуральное число $n$ и массив (размера $N\ge n$) вещественных чисел $x_i$, $i=0,\ldots,N-1$. Создать массив вещественных чисел размера $N-n+1$, элементы $y_i$ которого --- средние значения $n$ элементов исходного массива: $y_i=\frac{1}{n}\sum\limits_{j=0}^{n-1} x_{i+j}$ (это называется скользящее среднее). Вывести на экран оба массива.

# unknown
\item Дан неупорядоченный непустой массив целых неотрицательных чисел. Найти два самых больших элемента $a$, $b$, причем $b<a$. Если все элементы массива одинаковы, то $b$ не определено. Напечатать массив и найденные $a$, $b$.

# unknown
\item Дан неупорядоченный массив целых чисел $x_i$, $i=0,\ldots,N-1$, $N>2$. Найти элемент $x_j$, $0<j<N-1$, наиболее отличающийся от своих соседей справа и слева: $j=\arg\max\limits_j\max\{|x_j-x_{j-1}|, |x_j-x_{j+1}|\}$. Напечатать массив, $j$, $x_j$.

# unknown
\item Дан неупорядоченный массив натуральных чисел и натуральное число $n>1$. Напечатать все элементы, не имеющие простых делителей от 2 до $n$. Указание. Если у числа нет простых делителей от 2 до $n$, то непростых тоже нет.
\newpage

# unknown
\item Кусочно-линейная непрерывная функция $f(x)$ задана таблицей значений $x_i$, $f_i$ --- двумя массивами вещественных чисел, причем $x_i$ упорядочены по возрастанию. Найти номер участка, на котором производная $\frac{df}{dx}$ имеет наибольшее значение. Вывести этот номер и значение производной.

# unknown
\item Дважды дифференцируемая функция $f(x)$ задана таблицей значений $f_i$ --- массивом вещественных чисел, причем $f_i=f(hi)$ --- значения в узлах $x=hi$ равномерной сетки. Найти номер узла, в котором вторая производная $\frac{d^2f}{dx^2}$ имеет наибольшее значение. Вторую производную вычислить по формуле $\left.\frac{d^2f}{dx^2}\right|_{x=hi}=\frac{-f_{i-1} + 2f_i-f_{i+1}}{h^2}$.


// 141222-test-03.tex

# unknown (but similar to test-02-so:4)
\item Подсчитать и напечатать частоты символов из входного потока. Частота $\omega_k$ символа $k$ определяется по формуле $\omega_k=\frac{n_k}{N}$, где $n_k$ --- количество повторений символа $k$, а $N$ --- общее число символов в потоке. Символы однобайтовые, можно читать их так:
{\scriptsize\begin{verbatim}
while(true) {
    char c; cin >> c;
    if(cin.eof())
        break;
    ...
}
\end{verbatim}
}
Для завершения ввода можно нажать \verb=Ctrl+Z=; можно при запуске перенаправить ввод из файла: \verb=program <file.txt=

# unknown (but similar to test-02-so:12)
\item Заданы две строки с текстом, $p$ и $q$. Определить, встречается ли текст строки $q$ в строке $p$. Если да, то напечатать смещение, начиная с которого в $p$ начинается текст из $q$ (если $q$ встречается в $p$ несколько раз, то напечатать самое маленькое из всех возможных смещений). Строки можно читать из стандартного ввода при помощи функции \verb=getline()=.

# unknown
\item Входной поток состоит из слов, разделённых пробелами. Напечатайте палиндромы (слова, читающиеся одинаково слева направо и справа налево, например, \textit{шалаш}), встречающиеся среди этих слов и состоящие не менее, чем из трёх букв; не печатайте одни и те же слова по нескольку раз. Указание: строками (\verb=std::string=, \verb=QString=) можно пользоваться как массивами; в частности, размер можно узнать при помощи метода \verb=size()=. Уже напечатанные слова можно хранить в \verb=std::set<std::string>= или \verb=QSet<QString>=.


// 150615-1-task-data__c1.tex

# unknown
\item
Дан неупорядоченный непустой массив целых неотрицательных чисел. Найти два самых маленьких элемента $a$, $b$, причем $b>a$. Если все элементы массива одинаковы, то $b$ не определено. Напечатать массив и найденные $a$, $b$.


// 151106-test.tex

# unknown
\item
Даны два массива вещественных чисел, \verb|x| и \verb|y|. Их длина одинакова и равна $n$. Каждый ($i$-й) элемент массива \verb|x| содержит абсциссу некоторой точки $\bf r_i$ на плоскости, а элемент массива \verb|y| --- её ординату. Найти ближайшую к началу координат из этих точек и напечатать её координаты.

# unknown
\item
Найти приближенное решение уравнения $x=f(x)$, где $f(x)=\alpha e^x$, при $\alpha=0,2$ методом простой итерации: $x_{n+1}=f(x_n)$. В качестве начального приближения взять $x_0=0$. Итерации продолжать до тех пор, пока $|x_{n+1}-x_n|\ge \varepsilon$, где $\varepsilon$ --- заданная точность.

# unknown
\item
Даны два массива вещественных чисел, \verb|x| и \verb|y|. Их длина одинакова и равна $n$. Каждый ($i$-й) элемент массива \verb|x| содержит абсциссу некоторой точки $\bf r_i$ на плоскости, а элемент массива \verb|y| --- её ординату. Найти пару точек, расстояние между которыми минимально (если таких пар несколько, можно выбрать любую). Напечатать номера точек и расстояние между ними.

# unknown
\item
Дан массив целых чисел. Найти самый длинный участок строгой монотонности, напечатать индекс его начала и длину. Например, для массива $\{1, 2, 3, 2, 0, -5, -5, 1\}$ программа должна напечатать 2, 4.

# unknown
\item
Дан массив целых чисел $x_k$. Напечатать самую большую по модулю разность соседних элементов $x_k-x_{k-1}$. Например, для массива $\{1, 2, 3, 2, 0, -5, -5, 1\}$ программа должна напечатать $-5$ (в данном массиве это $x_5-x_4$).

*/
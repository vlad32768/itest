var tasks = require('../routes/tasks.js')

function checkMinLength(array, minLength) {
    if (array.length < minLength)
        throw new Error('Количество аргументов должно быть не менее ' + minLength)
}

function throwFailMessage(msg, name) {
    if (name)
        msg += ' (' + name + ')'
    throw new Error(msg)
}

function checkedInt(x, name) {
    x = +x
    if (!Number.isInteger(x))
        throwFailMessage('Ожидалось целое число', name)
    return x
}

function checkedNonnegativeInt(x, name) {
    x = +x
    if (!Number.isInteger(x) || x < 0)
        throwFailMessage('Ожидалось целое неотрицательное число', name)
    return x
}

function checkedNum(x, name) {
    x = +x
    if (!Number.isFinite(x))
        throwFailMessage('Ожидалось число', name)
    return x
}

function checkedArray(array, check, name) {
    for (var i=0; i<array.length; ++i) {
        array[i] = check(array[i], name + '[' + i + ']')
    }
    return array
}

module.exports = tasks.Tasks.fromObject([
    {
        text: 'Даны два массива, $A$ и $B$, размеров $n$ и $m$ соответственно, содержащие вещественные числа $a_i$ и $b_j$ соответственно. Напечатать всевозможные упорядоченные пары ($a_i$, $b_j$).',
        scene: ['program', function(stdin) {
            var args = stdin.split(/ +/)
            checkMinLength(args, 2)
            var n = checkedNonnegativeInt(args[0], 'n')
            checkMinLength(args, n+2)
            var m = checkedNonnegativeInt(args[n+1], 'm')
            checkMinLength(args, n+2+m)
            var a = checkedArray(args.slice(1, n+1), checkedNum, 'a')
            var b = checkedArray(args.slice(n+1, m+n+1), checkedNum, 'b')
            var lines = []
            a.forEach(function(ai) {
                b.forEach(function(bi) {
                    lines.push(ai + ' ' + bi)
                })
            })
            return lines.join('\n')
        }],
        stdin: '2 4 5 3 7 8 9',
        stdinHint: 'Введите через пробел $n, a_1, \\ldots, a_n, m, b_1, \\ldots, b_m$'
    }, {
        text: 'Дан массив $A$ размера $n$, содержащий вещественные числа $a_i$. Напечатать всевозможные неупорядоченные пары $(a_i, a_j)$ (Если напечатана пара $(a_1, a_2)$, то пару $(a_2, a_1)$ печатать не надо.)',
        scene: ['program', {name: 'p1'}],
        stdin: 'asd'
    }, {
        text: 'Дан массив, содержащий $2n$ натуральных чисел. Там находятся размеры прямоугольных матриц $A_1, \\ldots A_n$ (например, первый элемент массива &mdash; число строк в $A_1$, второй &mdash; число столбцов в $A_1$, третий &mdash; число строк в $A_2$, четвёртый &mdash; число столбцов в $A_2$, и т. д.). Программа должна выяснить, определено ли матричное произведение $A_1 A_2 \\ldots A_n$, и если да, то сколько строк и столбцов в матрице, которая будет результатом этого произведения.',
        scene: ['program', {name: 'p1'}],
        stdin: 'asd'
    }, {
        text: 'Дан массив, содержащий $2n$ натуральных чисел. Там находятся размеры прямоугольных матриц $A_1, \\ldots A_n$ (например, первый элемент массива &mdash; число строк в $A_1$, второй &mdash; число столбцов в $A_1$, третий &mdash; число строк в $A_2$, четвёртый &mdash; число столбцов в $A_2$, и т. д.). Программа должна выяснить, определено ли матричное произведение $A_1^T A_2^T \\ldots A_n^T$, и если да, то сколько строк и столбцов в матрице, которая будет результатом этого произведения.',
        scene: ['program', {name: 'p1'}],
        stdin: 'asd'
    }
])


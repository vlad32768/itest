var tasks = require('../routes/tasks.js')
var ppi = require('../routes/parse-program-input.js')
var lp = require('../routes/line-printer.js')



module.exports = tasks.Tasks.fromObject({
    description: 'Контрольная работа 1 AK 2017 осень',
    options: {
        noscroll: true
    },
    items: [ { // No 1
        text: ['Написать программу, получающую на входе целое число $n$',
            'и выводящую на консоль квадрат из $2n\\times 2n$ символов, как показано в примере:'
        ].join(' '),
        scene: ['program', function(stdin){
            var pr = lp()
            var n = ppi(stdin,'whole n').n
            if ( n > 10 )
                throw new Error('Слишком большое n')
            var str = '.'.repeat(n-1) + '||' + '.'.repeat(n-1)
            for (var i = 0; i < n-1; ++i)
                pr.println(str)
            pr.println('-'.repeat(n-1) + '++' + '-'.repeat(n-1))
            pr.println('-'.repeat(n-1) + '++' + '-'.repeat(n-1))
            for (i = 0; i < n-1; ++i)
                pr.println(str)
            return pr.finish()
        }],
        stdin: 4,
        stdinHint: 'Введите $n$:'
    }, { // No 2
        text: ['Написать программу, получающую на входе целое число $n$',
            'и выводящую на консоль квадрат из $2n+1\\times 2n+1$ символов, как показано в примере:'
        ].join(' '),
        scene: ['program', function(stdin){
            var pr = lp()
            var n = ppi(stdin,'whole n').n
            if ( n > 10 )
                throw new Error('Слишком большое n')
            var str = '.'.repeat(n) + '|' + '.'.repeat(n)
            for (var i = 0; i < n; ++i)
                pr.println(str)
            pr.println('-'.repeat(n) + '+' + '-'.repeat(n))
            for (i = 0; i < n; ++i)
                pr.println(str)
            return pr.finish()
        }],
        stdin: 4,
        stdinHint: 'Введите $n$:'
    }, { //No 3
        text: ['Написать программу, получающую на входе целое число $n$',
            'и выводящую на консоль квадрат из $2n\\times 2n$ символов, как показано в примере.',
            'По краю должна быть рамка из *, в центре $-$ квадрат из четырех *.'
        ].join(' '),
        scene: ['program', function(stdin){
            var pr = lp()
            var n = ppi(stdin,'whole n').n
            if ( n > 10 )
                throw new Error('Слишком большое n')
            pr.println('*'.repeat(2*n))
            var str = '*' + '.'.repeat(2*n-2) + '*'
            for (var i = 1; i < n-1; ++i)
                pr.println(str)
            if ( n > 1 ) {
                for (i=0; i < 2; i++)
                    pr.println('*' + '.'.repeat(n-2) + '**' + '.'.repeat(n-2) + '*')
            }
            for (i = 1; i < n-1; ++i)
                pr.println(str)
            pr.println('*'.repeat(2*n))
            return pr.finish()
        }],
        stdin: 4,
        stdinHint: 'Введите $n$:'
    }, { //No 5
        text: ['Написать программу, получающую на входе целое число $n$',
            'и выводящую на консоль квадрат из $2n\\times 2n$ символов, как показано в примере.',
            'В начале и конце каждой строки по 2 звездочки. $n-1$-я и $n$-я строки целиком состоят из звездочек.',
            'Обратите внимание на результат работы программы при $n=1$ и $n=2$!'
        ].join(' '),
        scene: ['program', function(stdin){
            var pr = lp()
            var n = ppi(stdin,'whole n').n
            if ( n > 10 )
                throw new Error('Слишком большое n')
            var str = ''
            if ( n > 1 )
                str = '**' + '.'.repeat(2*n-4) + '**'
            for (var i = 0; i < n-1; ++i)
                pr.println(str)
            pr.println('*'.repeat(2*n))
            pr.println('*'.repeat(2*n))
            for (i = 0; i < n-1; ++i)
                pr.println(str)
            return pr.finish()
        }],
        stdin: 4,
        stdinHint: 'Введите $n$:'
    }, { //No 6
        text: ['Написать программу, получающую на входе целое число $1\\leq n\\leq 10$',
            'и выводящую на консоль квадрат из цифр следующего вида'
        ].join(' '),
        scene: ['program', function(stdin){
            var pr = lp()
            var n = ppi(stdin,'whole n').n
            if ( n > 10 )
                throw new Error('Слишком большое n')
            for (var i = 0; i < n; i++) {
                for ( var j = 0; j < n; j++ )
                    pr.print((n+j-i)%n)
                pr.newline()
            }
            return pr.finish()
        }],
        stdin: 4,
        stdinHint: 'Введите $n$:'
    }, { //No 7
        text: ['Написать программу, получающую на входе целое число $n$',
            'и выводящую на консоль квадрат из $2n+1\\times 2n+1$ символов, как показано в примере.'
        ].join(' '),
        scene: ['program', function(stdin){
            var pr = lp()
            var n = ppi(stdin,'whole n').n
            if ( n > 10 )
                throw new Error('Слишком большое n')
            for (var i=0; i < n-1; i++)
                pr.println('.'.repeat(2*n+1))
            var s = '.'.repeat(n-1)
            pr.println( s + '***' + s ) 
            pr.println( s + '*.*' + s )
            pr.println( s + '***' + s )
            for (i=0; i < n-1; i++)
                pr.println('.'.repeat(2*n+1))
            return pr.finish()
        }],
        stdin: 4,
        stdinHint: 'Введите $n$:'
    },{ //No 8
        text: ['Написать программу, получающую на входе целое число $n$',
            'и выводящую на консоль квадрат из $2n+1\\times 2n+1$ символов, как показано в примере.'
        ].join(' '),
        scene: ['program', function(stdin){
            var pr = lp()
            var n = ppi(stdin,'whole n').n
            if ( n > 10 )
                throw new Error('Слишком большое n')
            for ( var i = 0; i < 2*n+1; i++ ) {
                pr.println('o'.repeat(n) + (i%2 ? '-' : 'o') + '-'.repeat(n))
            }
            return pr.finish()
        }],
        stdin: 4,
        stdinHint: 'Введите $n$:'
    }, { //No 9
        text: ['Написать программу, получающую на входе натуральное число $n$',
            'и выводящую на консоль квадрат из $2n+1\\times 2n+1$, как показано в примере.'
        ].join(' '),
        scene: ['program', function(stdin) {
            var pr = lp()
            //pr.println('++++')
            var n = ppi(stdin,'whole n').n
            //pr.println('typeof(n)=',typeof(n))
            //pr.println('++++')
            if ( n > 10 )
                throw new Error('Слишком большое n')


            for ( var i = 0; i < 2*n+1; ++i ) {
                for (var j=0; j<n; ++j)
                    pr.print('.')
                pr.print(i%2 ? '<' : '>')
                for (j=0; j<n; ++j)
                    pr.print('.')
                pr.newline()
            }
            return pr.finish()
        }],
        stdin: '4',
        stdinHint: 'Введите $n$'
    },{ //No 10
        text: ['Написать программу, получающую на входе целое число $n$',
            'и выводящую на консоль квадрат из $2n+1\\times 2n+1$ символов, как показано в примере.'
        ].join(' '),
        scene: ['program', function(stdin){
            var pr = lp()
            var n = ppi(stdin,'whole n').n
            if ( n > 10 )
                throw new Error('Слишком большое n')
            for (var i=0; i < n-1; i++)
                pr.println('.'.repeat(2*n+1))
            var s = '.'.repeat(n-1)
            pr.println( s + '*.*' + s ) 
            pr.println( s + '.*.' + s )
            pr.println( s + '*.*' + s )
            for (i=0; i < n-1; i++)
                pr.println('.'.repeat(2*n+1))
            return pr.finish()
        }],
        stdin: 4,
        stdinHint: 'Введите $n$:'
    }

    ]
})

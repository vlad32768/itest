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
        stdinHint: 'Введите $n$:',
        tags: ['complexity-1', 'console-painting']
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
        stdinHint: 'Введите $n$:',
        tags: ['complexity-1', 'console-painting']
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
        stdinHint: 'Введите $n$:',
        tags: ['complexity-1', 'console-painting']
    }, { //No 4
        text: ['Дано число, состоящее из четного числа цифр $2n$. Написать программу,',
            'определяющую, является ли это число номером <<счастливого>> билета, то есть равны ли между',
            'собой суммы первых $n$ и последних $n$ цифр. Число цифр в числе заранее не известно!',
            'Если вдруг число цифр нечетное --- вывести об этом сообщение и далее не считать.'
        ].join(' '),
        scene: ['program', function(stdin){
            var pr = lp()
            var n = ppi(stdin,'whole n').n
            if ( n > Math.pow(2,32) )
                throw new Error( 'Слишком большое число!' )
            var n2=n
            for (var nfigs=0; n2; nfigs++) {
                n2-=n2%10
                n2/=10
            }
            if (nfigs%2)
                throw new Error('Нечетное количество цифр!')
            n2=n
            var nums=[0,0]
            for (var k=0; k<2; k++ ) for ( var i=0; i < nfigs/2; i++ ) {
                nums[k] += n2%10
                n2 = (n2-n2%10)/10
            }
            if (nums[0] == nums[1])
                pr.println( 'Билет счастливый!' )
            else
                pr.println( 'Билет не счастливый' )
            return pr.finish()
        }],
        stdin: 4655,
        stdinHint: 'Введите $n$:',
        tags: ['complexity-2']
    },{ //No 5
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
        stdinHint: 'Введите $n$:',
        tags: ['complexity-1', 'console-painting']
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
        stdinHint: 'Введите $n$:',
        tags: ['complexity-1', 'console-painting']
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
        stdinHint: 'Введите $n$:',
        tags: ['complexity-1', 'console-painting']
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
        stdinHint: 'Введите $n$:',
        tags: ['complexity-1', 'console-painting']
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
                    pr.putc('.')
                pr.putc(i%2 ? '<' : '>')
                for (j=0; j<n; ++j)
                    pr.putc('.')
                pr.newline()
            }
            return pr.finish()
        }],
        stdin: '4',
        stdinHint: 'Введите $n$',
        tags: ['complexity-1', 'console-painting']
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
        stdinHint: 'Введите $n$:',
        tags: ['complexity-1', 'console-painting']
    },{ //No 11
        text: ['Написать программу, получающую на входе целое число $n$',
            'и выводящую на консоль квадрат из $n\\times n$ символов, как показано в примере.'
        ].join(' '),
        scene: ['program', function(stdin){
            var pr = lp()
            var n = ppi(stdin,'whole n').n
            if ( n > 20 )
                throw new Error('Слишком большое n')
            for (var i=0; i < n; i++) {
                if (i%2==0){
                    pr.println('<>'.repeat(n/2+1).substr(0,n))
                }
                else
                    pr.println('.'.repeat(n))
            }
            return pr.finish()
        }],
        stdin: 7,
        stdinHint: 'Введите $n$:',
        tags: ['complexity-1', 'console-painting']
    },{ //No 12
        text: ['Написать программу, получающую на входе целое число $n$',
            'и выводящую на консоль квадрат из $n\\times n$ символов, как показано в примере.'
        ].join(' '),
        scene: ['program', function(stdin){
            var pr = lp()
            var n = ppi(stdin,'whole n').n
            if ( n > 20 )
                throw new Error('Слишком большое n')
            pr.println('+'.repeat(n))
            for ( var i = 1; i < n-1; i++ ){
                pr.println('+' + '.'.repeat(n-2-i) + '*'.repeat(i) + '+')
            }
            if (n>1)
                pr.println('+'.repeat(n))
            return pr.finish()
        }],
        stdin: 7,
        stdinHint: 'Введите $n$:',
        tags: ['complexity-1', 'console-painting']
    },{ //No 13
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
            pr.println( s + '.*.' + s ) 
            pr.println( s + '*.*' + s )
            pr.println( s + '.*.' + s )
            for (i=0; i < n-1; i++)
                pr.println('.'.repeat(2*n+1))
            return pr.finish()
        }],
        stdin: 4,
        stdinHint: 'Введите $n$:',
        tags: ['complexity-1', 'console-painting']
    },{ //No 14
        text: ['Написать программу, получающую на входе целое число $n$',
            'и выводящую на консоль квадрат из $n\\times n$ символов, как показано в примере.'
        ].join(' '),
        scene: ['program', function(stdin){
            var pr = lp()
            var n = ppi(stdin,'whole n').n
            if ( n > 20 )
                throw new Error('Слишком большое n')
            for (var i=0; i < n; i++) {
                pr.println( ( ( i%2 ? '+' : '*' ) + '.' ).repeat(n/2+1).substr(0,n) )
            }
            return pr.finish()
        }],
        stdin: 8,
        stdinHint: 'Введите $n$:',
        tags: ['complexity-1', 'console-painting']
    },{ //No 15
        text: ['Написать программу, получающую на входе целое число $n$',
            'и выводящую на консоль квадрат из $2n\\times 2n$ символов, как показано в примере.'
        ].join(' '),
        scene: ['program', function(stdin){
            var pr = lp()
            var n = ppi(stdin,'whole n').n
            if ( n > 10 )
                throw new Error('Слишком большое n')
            var s1 = '*'.repeat(n-1) + '<>' + '*'.repeat(n-1)
            pr.println(s1)
            pr.println(s1)
            var s2 = '.'.repeat(n-1) + '<>' + '.'.repeat(n-1)
            for ( var i = 2; i < 2*n-2; i++ )
                pr.println(s2)
            if (n>1){
                pr.println(s1)
                pr.println(s1)
            }
            return pr.finish()
        }],
        stdin: 4,
        stdinHint: 'Введите $n$:',
        tags: ['complexity-1', 'console-painting']
    }
    ]
})

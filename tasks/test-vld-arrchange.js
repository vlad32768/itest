var tasks = require('../routes/tasks.js')
var ppi = require('../routes/parse-program-input.js')
var lp = require('../routes/line-printer.js')

var _ = require('lodash')

module.exports = tasks.Tasks.fromObject({
    description: 'Tasks with array changing (std::vector)',
    items: [
        //1
        {
            text: [
                'Удалить в массиве все числа, которые повторяются более двух раз. Вывести результирующий массив на экран.',
                '<br>'].join('\n'),
            scene: ['program', function(stdin) {
                var args = ppi(stdin, 'whole n, int a[n]')
                if (args.n > 100)
                    throw new Error('Слишком большое n')
                var printer=lp()
                var m = new Map 

                args.a.forEach(function(val){
                    if (m.has(val))
                        m.set(val,m.get(val)+1)
                    else
                        m.set(val,1)
                })           
                
                m.forEach(function(val,key,map){
                    //printer.println(key,'   ',val)  //TODO: tabulation
                    if (val>2) _.remove(args.a,n => n===key)
                })
                
                printer.println(args.a.join(' '))

                return printer.finish()
            }],
            stdin: '15   2 61 49 23 3 61 4 23 61 5 49 6 49 6 49',
            stdinHint: 'Введите $n, a_0, \\ldots, a_{n-1}$'
        },
        //2
        {
            text: [
                'Введите одномерный целочисленный массив. Найдите наибольший нечетный элемент. Далее трижды осуществите циклический сдвиг влево элементов, стоящих справа от найденного максимума, и один раз сдвиг элементов вправо, стоящих слева от найденного максимума.',
                '<br>'].join('\n'),
            scene: ['program', function(stdin) {
                var args = ppi(stdin, 'whole n, int a[n]')
                if (args.n > 100)
                    throw new Error('Слишком большое n')
                var printer=lp()

                //shift a[f..l] n times in direction dir {-1,1} 
                function sh(a,f,l,n,dir)
                {
                    if (f>=l||l>=a.length||f<0) 
                    {
                        //printer.println('cannot shift: f=',f,'l=',l)
                        return -1
                    }
                    for(var i=0;i<n;++i)
                    {
                        if (dir===1)
                        {
                            let tmp=a[l]
                            for(let x=l;x>f;--x) a[x]=a[x-1]
                            a[f]=tmp
                        }
                        else
                        {
                            let tmp=a[f]
                            for(let x=f;x<l;++x) a[x]=a[x+1]
                            a[l]=tmp
                        }
                    }
                    return 0
                }

                var max_odd_idx=-1
                var max_odd_val=-0.1
                args.a.forEach(function(val,idx){
                    if(val%2!=0&&(max_odd_idx===-1||max_odd_val<val))
                    {
                        max_odd_idx=idx
                        max_odd_val=val
                    }
                })
                sh(args.a,max_odd_idx+1,args.a.length-1,3,-1)
                sh(args.a,0,max_odd_idx-1,1,1)
                printer.println(args.a.join(' '))

                return printer.finish()
            }],
            stdin: '10  1 2 3 99 5 6 7 8 9 10',
            stdinHint: 'Введите $n, a_0, \\ldots, a_{n-1}$'
        },
        //3
        {
            text: [
                'Преобразовать массив так, чтобы сначала шли элементы, равные нулю, а затем все остальные.',
                '<br>'].join('\n'),
            scene: ['program', function(stdin) {
                var args = ppi(stdin, 'whole n, int a[n]')
                if (args.n > 100)
                    throw new Error('Слишком большое n')
                var printer=lp()

                var b=_.remove(args.a,function(n){return n==0})
                args.a=_.concat(b,args.a)
                printer.println(args.a.join(' '))

                return printer.finish()
            }],
            stdin: '10  1 2 0 4 5 0 0 8 9 0',
            stdinHint: 'Введите $a, a_0, \\ldots, a_{n-1}$'
        },
        //4
        {
            text: [
                'Дан упорядоченный по возрастанию массив a и массив b. Вставить значения из массива b в массив а так, чтобы массив а остался упорядоченным.',
                '<br>'].join('\n'),
            scene: ['program', function(stdin) {
                var args = ppi(stdin, 'whole n, int a[n], whole m, int b[m]')
                if (args.n > 20)
                    throw new Error('Слишком большое n')
                if (args.m > 20)
                    throw new Error('Слишком большое m')
                var printer=lp()

                args.b.forEach(function(val){
                    let ins=args.a.findIndex(function(n){return n>=val})
                    if (ins===-1) args.a.push(val)
                    else args.a.splice(ins,0,val)
                })
                printer.println(args.a.join(' '))

                return printer.finish()
            }],
            stdin: '10   10 20 30 40 50 60 70 80 90 100   6  25 35 45 46 55 56',
            stdinHint: 'Введите $n, a_0, \\ldots, a_{n-1}, m, b_0, \\ldots, b_{n-1}$'
        },
        //5
        {
            text: [
                'Удалить из массива все отрицательные и нечётные числа. Вывести результирующий массив.',
                '<br>'].join('\n'),
            scene: ['program', function(stdin) {
                var args = ppi(stdin, 'whole n, int a[n]')
                if (args.n > 100)
                    throw new Error('Слишком большое n')
                var printer=lp()
                printer.println(args.a.filter(n=>n%2===0&&n>0).join(' '))
                return printer.finish()
            }],
            stdin: '10 1 -2 3 4 5 6 7 8 9 10',
            stdinHint: 'Введите $a, a_0, \\ldots, a_{n-1}$'
        },
        //6
        {
            text: [
                '',
                '<br>'].join('\n'),
            scene: ['program', function(stdin) {
                var args = ppi(stdin, 'whole n, int v[n]')
                if (args.n > 100)
                    throw new Error('Слишком большое n')
                var printer=lp()
                return printer.finish()
            }],
            stdin: '',
            stdinHint: 'Введите $n, v_0, \\ldots, v_n$'
        },
        //7
        {
            text: [
                '',
                '<br>'].join('\n'),
            scene: ['program', function(stdin) {
                var args = ppi(stdin, 'whole n, int v[n]')
                if (args.n > 100)
                    throw new Error('Слишком большое n')
                var printer=lp()
                return printer.finish()
            }],
            stdin: '',
            stdinHint: 'Введите $n, v_0, \\ldots, v_n$'
        },
        //8
        {
            text: [
                '',
                '<br>'].join('\n'),
            scene: ['program', function(stdin) {
                var args = ppi(stdin, 'whole n, int v[n]')
                if (args.n > 100)
                    throw new Error('Слишком большое n')
                var printer=lp()
                return printer.finish()
            }],
            stdin: '',
            stdinHint: 'Введите $n, v_0, \\ldots, v_n$'
        },
        //9
        {
            text: [
                '',
                '<br>'].join('\n'),
            scene: ['program', function(stdin) {
                var args = ppi(stdin, 'whole n, int v[n]')
                if (args.n > 100)
                    throw new Error('Слишком большое n')
                var printer=lp()
                return printer.finish()
            }],
            stdin: '',
            stdinHint: 'Введите $n, v_0, \\ldots, v_n$'
        },
        //10
        {
            text: [
                '',
                '<br>'].join('\n'),
            scene: ['program', function(stdin) {
                var args = ppi(stdin, 'whole n, int v[n]')
                if (args.n > 100)
                    throw new Error('Слишком большое n')
                var printer=lp()
                return printer.finish()
            }],
            stdin: '',
            stdinHint: 'Введите $n, v_0, \\ldots, v_n$'
        },
    ]
})
var tasks = require('../routes/tasks.js')
var ppi = require('../routes/parse-program-input.js')
var lp = require('../routes/line-printer.js')

//right
function vecp3(a,b)
{
    return [ a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]  ]
}

function scalp3(a,b)
{
    var s=0
    for(var i=0;i<3;++i) 
        s+=a[i]*b[i]
    return s
}

function mod3(a)
{
    return Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2])
}

module.exports = tasks.Tasks.fromObject({
    description: 'Tasks from Alexey',
    items: [{
        text: [
            'Дан упорядоченный массив целых чисел. Напечатать все различные элементы с указанием числа вхождений каждого элемента в массив. Например, для массива [1,2,2,2,5,6,6] должно быть напечатано<br>',
            '1  1<br>',
            '2  3<br>',
            '5  1<br>',
            '6  2<br>',].join('\n'),
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
                printer.println(key,'   ',val)  //TODO: tabulation
            })
            return printer.finish()
        }],
        stdin: '7   1 2 2 2 5 6 6',
        stdinHint: 'Введите $n, a_1, \\ldots, a_n$'
    },
    {
        text: [
            'Дан неупорядоченный массив целых чисел и целое число $n$. Напечатать количество вхождений числа $n$ в массив.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, whole size, int a[size]')
            if (args.n > 100)
                throw new Error('Слишком большое size')
            var count=0
            args.a.forEach(function(val){if(val===args.n) ++count})
            return lp().println(count).finish()
        }],
        stdin: '5  10  3 7 4 5 5 3 9 5 7 9 ',
        stdinHint: 'Введите $n, s, a_1, \\ldots, a_s$'
    },
    {
        text: [
            'Вычислить $e^x$, используя разложение в ряд Тейлора. Вычисление прекращать, когда член ряда станет меньше $\\varepsilon=10^{-8}$.',
            'На всякий случай, $e^x=\\sum\\limits_{n=0}^\\infty \\frac{x^n}{n!}$.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real x')
            if (args.x>50)
                throw new Error('Слишком большое x')
            
            if (args.x<-10)
                throw new Error('Слишком малое x')
                
            function fact(n){return n<=1?1:fact(n-1)*n}
            // function fact(n){
            //     var s=1.0
            //     for(var i=2;i<=n;++i) s*=i
            //     return s
            // }
            var s=0.0
            for( var n=0;;++n)
            {
                var p=Math.pow(args.x,n)/fact(n)
                s+=p
                if (Math.abs(p)<1e-8) break
            } 
            return lp().println(s).finish()
        }],
        stdin: '1',
        stdinHint: 'Введите $x$'
    },
    {
        text: [
            'Дан массив из шести вещественных чисел $x_1$, $y_1$, $z_1$, $x_2$, $y_2$, $z_2$. Это декартовы координаты двух векторов.',
            'Определить, параллельны векторы или нет (напечатать результат проверки). Указание. Векторы $\\bf a$ и $\\bf b$ параллельны, если их векторное',
            'произведение ${\\bf a}\\times{\\bf b}$ равно нулю; считать, что векторы параллельны при $|{\\bf a}\\times{\\bf b}|\\le\\varepsilon|{\\bf a}||{\\bf b}|$, $\\varepsilon=10^{-8}$.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real a[3], real b[3]')
            var str
            if(mod3(vecp3(args.a,args.b))<=mod3(args.a)*mod3(args.b)*1e-8)
                str='Векторы параллельны'
            else 
                str='Векторы не параллельны'
            return lp().println(str).finish()
        }],
        stdin: '1 2 3 2 4 6.1',
        stdinHint: 'Введите $a_0, \\ldots, a_5$'
    },
    {
        text: [
            'Дан массив из девяти вещественных чисел $x_1$, $y_1$, $z_1$, $x_2$, $y_2$, $z_2$, $x_3$, $y_3$, $z_3$. Это декартовы координаты трех векторов.',
            'Определить, компланарны векторы или нет (напечатать результат проверки). Указание. Векторы $\\bf a$, $\\bf b$ и $\\bf c$ компланарны, если их смешанное ',
            'произведение $({\\bf a}\\times{\\bf b})\\cdot {\\bf c}$ равно нулю; считать, что векторы компланарны при $|({\\bf a}\\times{\\bf b})\\cdot {\\bf c}|\\le\\varepsilon|{\\bf a}||{\\bf b}||{\\bf c}|$, $\\varepsilon=10^{-8}$.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real x[3], real y[3], real z[3]')
            var printer=lp()
            if (Math.abs(scalp3(vecp3(args.x,args.y),args.z))<=mod3(args.x)*mod3(args.y)*mod3(args.z)*1e-8)
                printer.println('Векторы компланарны.')
            else
                printer.println('Векторы не компланарны.')
            return printer.finish()
        }],
        stdin: '-0.24951 0.74612 0.61729 0.5621 0.55952 1.17089 0.81161 -0.1866 0.5536 ',
        stdinHint: 'Введите $a_0, \\ldots, a_8$'
    },
    {
        text: [
            'Дан упорядоченный массив целых чисел. Напечатать элемент, повторяющийся в массиве чаще всего, а также количество повторений. Если есть несколько элементов, ',
            'повторяющихся одинаковое число раз, выбрать любой из них.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int a[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            
            var m = new Map 
            args.a.forEach(function(val){
                if (m.has(val))
                    m.set(val,m.get(val)+1)
                else
                    m.set(val,1)
            })           
            
            var max_count=0
            var max_key
            m.forEach(function(val,key,map){
                if (val>max_count)
                {
                    max_count=val
                    max_key=key
                }
            })
            return lp().println(max_key,m.get(max_key)).finish()
        }],
        stdin: '15  1 3 5 5 5 5 6 6 7 7 7 8 9 9 9',
        stdinHint: 'Введите $n, a_1, \\ldots, a_n$'
    },
    {
        text: [
            'Дан неупорядоченный массив целых чисел. Расставить его элементы в обратном порядке. Напечатать оба массива.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int a[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            var b = new Array
            args.a.forEach(function(val){b.unshift(val);printer.print(val)})
            printer.println()
            b.forEach(function(val){printer.print(val)})
            return printer.finish()
        }],
        stdin: '10    2 4 3 5 4 6 5 7 6 8',
        stdinHint: 'Введите $n, a_1, \\ldots, a_n$'
    },
    {
        text: [
            '',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            return printer.finish()
        }],
        stdin: '',
        stdinHint: 'Введите $n$'
    },
    ]
})
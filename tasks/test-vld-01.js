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
    for(var i=0;i<a.length;++i) 
        s+=a[i]*b[i]
    return s
}

function mod3(a)
{
    return Math.sqrt(scalp3(a,a))
}

module.exports = tasks.Tasks.fromObject({
    description: 'Tasks from Alexey',
    items: [{ //1
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
    { //2
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
    {   //3
        text: [
            'Вычислить $e^x$, используя разложение в ряд Тейлора. Вычисление прекращать, когда член ряда станет меньше $\\varepsilon=10^{-8}$.',
            'На всякий случай, $e^x=\\sum\\limits_{n=0}^\\infty \\frac{x^n}{n!}$.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real x')
            if (args.x>50)
                throw new Error('Слишком большое x')
            
            if (args.x<-15)
                throw new Error('Слишком малое x')
            var s=1
            var p=1
            var n=1
            for( ;n<200;++n)
            {
                p*=args.x/n
                s+=p
                if (Math.abs(p)<1e-8) break
            } 
            return lp().println(s).finish()
        }],
        stdin: '1',
        stdinHint: 'Введите $x$'
    },
    {   //4
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
    {   //5
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
    {   //6
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
    {   //7
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
            printer.println(b.join(' '))
            return printer.finish()
        }],
        stdin: '10    2 4 3 5 4 6 5 7 6 8',
        stdinHint: 'Введите $n, a_1, \\ldots, a_n$'
    },
    {   //8
        text: [
            'Дан неупорядоченный массив целых чисел. Найти (и напечатать) количество участков нестрогой монотонности в нём. Например, в массиве [1,2,2,3] один такой участок, в массиве [1,2,3,2] --- два, а в массиве [1,2,1,2] их три.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int a[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            var m_c=0
            var m_t=-2
            
            for(var i=1;i<args.n;++i)
            {
                var s=Math.sign(args.a[i-1]-args.a[i])
                switch(m_t)
                {
                case -1:
                    if (s>0)
                    {
                        m_t=1
                        m_c++
                    }
                    break
                case 1:
                    if (s<0)
                    {
                        m_t=-1
                        m_c++
                    }
                    break
                default:
                    if(s!=0)
                    {
                        m_t=s
                        m_c++
                    }
                }

            }
            return printer.println(m_c).finish()
        }],
        stdin: '20    2 4 3 5 5 5 5 4 3 2 2 2 3 4 5 6 7 7 6 5',
        stdinHint: 'Введите $n, a_1, \\ldots, a_n$'
    },
    {   //9
        text: [
            'Дан неупорядоченный массив целых чисел. Найти самый длинный участок строгого возрастания, напечатать индексы элементов в начале и в конце этого участка. Если имеется несколько участков строгого возрастания одной длины, можно выбрать любой из них.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int a[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()

            var acc=false
            var acc_s=-1,acc_e=-1
            var acc_s_max=-1,acc_e_max=-1
            
            function finish_acc(end_idx)
            {
                if (!acc) throw new Error('ERROR!!!111')
                acc=false
                acc_e=end_idx
                if (acc_e-acc_s>acc_e_max-acc_s_max)
                {
                    acc_e_max=acc_e
                    acc_s_max=acc_s
                }
            }
            for(var i=1;i<args.n;++i)
            {
                var t=args.a[i]>args.a[i-1]
                if ((!acc) && t)
                {
                    acc=true
                    acc_s=i-1
                }
                if(acc && (!t))
                    finish_acc(i-1)
                if(t && (i==args.n-1))
                    finish_acc(i)
            }
            return printer.print(acc_s_max,acc_e_max).finish()
        }],
        stdin: '20    2 4 3 5  5 5 5 4 3 2 2   2 3 4 5 6 7   7 6 5',
        stdinHint: 'Введите $n, a_1, \\ldots, a_n$'
    },
    {   //10
        text: [
            'Дан неупорядоченный массив целых чисел. Циклически сдвинуть его элементы на одну позицию влево, например, [1,5,3,7] $\\rightarrow$ [5,3,7,1]. Напечатать оба массива.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int a[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            
            printer.println(args.a.join(' '))
            args.a.push(args.a.shift())
            printer.println(args.a.join(' '))
            return printer.finish()
        }],
        stdin: '4   1 5 3 7',
        stdinHint: 'Введите $n, a_1, \\ldots, a_n$'
    },
    {   //11
        text: [
            'Дана последовательность $x_{n+1}=x_n^2 + c$, $x$ и $c$ --- комплексные числа, $n=0,1,2,\\ldots$ Определить, ограниченна ли эта последовательность при заданных $x_0$ и $c$, напечатать результат. Указание. Последовательность неограниченна, если для некоторого $n$ имеет место неравенство $|x_n|>2\\max\\{1,|c|\\}$.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real Re_c, real Im_c, real Re_x0, real Im_x0')
            
            function mod2(r,i)
            {
                return r*r+i*i
            }

            var mod2_c=mod2(args.Re_c,args.Im_c)
            var escape=mod2_c>1?4*mod2_c:4

            var Re_x,Im_x
            var i=0
            var max_iter=1000
            for(;i<max_iter;++i)
            {
                Re_x=args.Re_x0*args.Re_x0-args.Im_x0*args.Im_x0+args.Re_c
                Im_x=2*args.Re_x0*args.Im_x0+args.Im_c
                if(mod2(Re_x,Im_x)>escape) break
                args.Re_x0=Re_x
                args.Im_x0=Im_x
            }
            var printer=lp()
            printer.println('Последовательность '+(i==max_iter?'ограничена':'неограничена'))
            return printer.finish()
        }],
        stdin: '-0.99823459867075659  0.28726115158486704 0 0',
        stdinHint: 'Введите $c$, $x_0$'//TODO:latex Real Im ?
    },
    {   //12
        text: [
            'Дан упорядоченный массив целых чисел. Он описывает лестницу, разность соседних элементов --- высота ступеней. Имеется животное, способное преодолевать ступени высоты не больше $h$, оно сидит в начале лестницы. До какого элемента массива оно может добраться по этой лестнице?',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole h, whole n, int a[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var i=0
            for(;i<args.n-1;++i)
            {
                if(args.a[i+1]-args.a[i]>args.h) break
            }
            return lp().println(i).finish()
        }],
        stdin: '2   7  3 5 7 9 11 14 16',
        stdinHint: 'Введите $h, n, a_1, \\ldots, a_n$'
    },
    {   //13
        text: [
            'Дан неупорядоченный массив целых чисел. Он описывает что-то вроде лестницы, идущей то вверх, то вниз; разность соседних элементов --- высота ступеней. Имеется животное, способное преодолевать ступени высоты не больше $h$. Куда его можно посадить, чтобы оно не убежало с лестницы? На край лестницы сажать нельзя! Возможно, что подходящего места не найдётся, тогда об этом надо сообщить.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole h, whole n, int a[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()

            var b=new Array(args.n)
            b.fill(false)
            b[0]=b[args.n-1]=true

            for(var i=1;i<args.n-1;++i)
            {
                b[i]=Math.abs(args.a[i-1]-args.a[i])<=args.h&&b[i-1]
                if (!b[i]) break
            }
            for(var i=args.n-2;i>0;--i)
            {
                if (b[i]) break
                else
                {
                    b[i]=Math.abs(args.a[i]-args.a[i+1])<=args.h&&b[i+1]
                    if (!b[i]) break
                }
            }
            var no=true
            b.forEach(function(val,idx){
                if(!val) 
                {
                    printer.print(idx)
                    no=false
                }
            })
            
            if(no) printer.println('Нет подходящего места')

            return printer.finish()
        }],
        stdin: '2   7     3 5    8 9 11 12   15',
        stdinHint: 'Введите $h, n, a_1, \\ldots, a_n$'
    },
    {   //14
        text: [
            'Дан упорядоченный массив целых чисел. Он описывает лестницу, разность соседних элементов --- высота ступеней; одинаковые элементы образуют широкие ступени. Сколько ступеней в лестнице? Например, в массиве [2,2,2] одна ступень, в массиве [2,3,3] их две.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int a[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var c=1
            for(var i=0;i<args.n-1;++i)
            {
                if(args.a[i+1]!=args.a[i]) c++
            }
            return lp().println(c).finish()
        }],
        stdin: '7  3 5 5 5 7 7 8',
        stdinHint: 'Введите $n, a_1, \\ldots, a_n$'
    },
    {   //15
        text: [
            'Дан неупорядоченный массив целых чисел. Он описывает что-то вроде лестницы, идущей то вверх, то вниз; разность соседних элементов --- высота ступеней. Имеется животное, способное преодолевать ступени высоты не больше $h$ вверх и не больше $H$ вниз. Животное находится в начале массива. До какого элемента сможет дойти животное?',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole h, whole H, whole n, int a[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var i=0
            for(;i<args.n-1;++i)
            {
                var t=args.a[i+1]-args.a[i]
                if(t>args.h || -t>args.H) break
            }
            return lp().println(i).finish()
        }],
        stdin: '2 4   7  3 5 7 3 4 1 3 ',
        stdinHint: 'Введите $h, H, n, a_1, \\ldots, a_n$'
    },
    {   //16
        text: [
            'Задано натуральное число. Написать программу, генерирующую массив делителей этого числа и вычисляющую среднее арифметическое этих делителей. Массив и среднее арифметическое вывести на экран.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            
            //var a=new Array
            var s=0,count=0
            for(var i=1;i<=args.n/2;++i)
            {
                if(args.n%i==0)
                {
                    printer.print(i)
                    s+=i
                    count++
                }
            }
            printer.println('\nСреднее арифметическое=',s/count)
            return printer.finish()
        }],
        stdin: '28',
        stdinHint: 'Введите $n$'
    },
    { //17
        text: [
            'Задан упорядоченный по возрастанию массив $v$ произвольной длины и натуральное число $n$. Написать программу, выполняющую $n$ раз следующее:',
            '<ul>',
            '<li> Вычисляется значение $p$ --- среднее арифметическое элементов $v$.</li>',
            '<li> Полученное значение $p$ вставляется в $v$ так, что $v$ остается упорядоченным.</li>',
            '</ul>',
            'Исходный массив и результат $n$ вставок следует вывести на консоль. Массивы выводить в строку, отделяя элементы пробелами. Каждый массив начинать с новой строки.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, whole s,  int a[s]')
            if (args.s > 20)
                throw new Error('Слишком большое s')
            if (args.n > 20)
                throw new Error('Слишком большое n')
            var printer=lp()
            printer.println(args.a.join(' '))
            for(var i=0;i<args.n;++i)
            {
                var s=0
                args.a.forEach(function(val){s+=val})
                var avg=s/args.a.length
                for(var j=0;j<args.a.length;++j)
                {
                    if(args.a[j]>avg)
                    {
                        args.a.splice(j,0,avg)
                        break
                    }
                }
            }
            printer.println(args.a.join(' '))
            return printer.finish()
        }],
        stdin: '5  5  2 5 8 15 20 ',
        stdinHint: 'Введите $n, size, a_1, \\ldots, v_{size-1}$'
    },
    { //18
        text: [
            'Задан упорядоченный по возрастанию массив $v$ произвольной длины и натуральное число $n$. Написать программу, выполняющую $n$ раз следующее:',
            '<ul>',
            '<li> Находится индекс $i$, такой, что $|v[i]-v[i+1]|=max$.</li>',
            '<li> Среднее значение $v[i]$ и $v[i+1]$ вставляется в $v$ перед $v[i+1]$.</li>',
            '</ul>',
            'Исходный массив и результат $n$ вставок следует вывести на консоль. Массивы выводить в строку, отделяя элементы пробелами. Каждый массив начинать с новой строки.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, whole s,  int a[s]')
            if (args.s > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            printer.println(args.a.join(' '))
            for(var i=0;i<args.n;++i)
            {
                var max=0,idx=0
                for(var j=0;j<args.a.length-1;++j)
                {
                    var m=args.a[j+1]-args.a[j]
                    if(m>max)
                    {
                        max=m
                        idx=j
                    }
                }
                args.a.splice(idx+1,0,(args.a[idx]+args.a[idx+1])/2)
            }
            printer.println(args.a.join(' '))
            return printer.finish()
        }],
        stdin: '5  5  2 5 8 15 20 ',
        stdinHint: 'Введите $n, size, v_1, \\ldots, v_{size-1}$'
    },
    { //19
        text: [
            'Задан массив $v$ произвольной длины. Написать программу, генерирующую целочисленный массив $w$ такой же длины, где $w[i]$ &mdash; число элементов $v[j]$, таких, что $v[j]>v[i]$ при $j>i$.',
            'Программа должна выводить на консоль оба массива. Массивы выводить в строку, отделяя элементы пробелами. Каждый массив начинать с новой строки.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n,int a[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            printer.println(args.a.join(' '))
            var w = new Array
            for(var i=0;i<args.n;++i)
            {
                var s=0
                for(var j=i;j<args.n;++j)
                {
                    if(args.a[j]>args.a[i]) ++s
                }
                w.push(s)
            }
            printer.println(w.join(' '))
            return printer.finish()
        }],
        stdin: '10  5 2 5 8 1 4 15 20 1 25',
        stdinHint: 'Введите $n, v_1, \\ldots, v_n$'
    },
    { //20
        text: [
            'Задан массив $v$ произвольной длины, в нем допустимы одинаковые элементы. Составить программу, генерирующую массив $w$, содержащий те же элементы, но только один раз. Например, $v=[1,-2, 3, 1,-2,4]$, $w=[1,-2,3,4]$.',
            'Программа должна выводить на консоль оба массива. Массивы выводить в строку, отделяя элементы пробелами. Каждый массив начинать с новой строки.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int a[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()

            printer.println(args.a.join(' '))

            function onlyUnique(value, index, self) { 
                return self.indexOf(value) === index
            }

            printer.println((args.a.filter(onlyUnique)).join(' '))
            
            return printer.finish()
        }],
        stdin: '10  5 2 5 8 1 4 15 20 1 25',
        stdinHint: 'Введите $n, v_1, \\ldots, v_{n-1}$'
    },
    { //21
        text: [
            'Задан массив $v$ произвольной длины и число $d$. Написать программу, генерирующую массив $w$, полученный из $v$ исключением элемента, ближайшего к $d$.',
            'Программа должна выводить на консоль оба массива. Массивы выводить в строку, отделяя элементы пробелами. Каждый массив начинать с новой строки.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'int d, whole n, int a[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            printer.println(args.a.join(' '))

            var diff=Math.abs(args.a[0]-args.d)
            var d_val=args.a[0]
            args.a.forEach(function(val,idx){
                var t=Math.abs(val-args.d)
                if(t<diff)
                {
                    diff=t
                    d_val=val
                }
            })
            
            printer.println(args.a.filter(function(val){return val!=d_val}) )

            return printer.finish()
        }],
        stdin: '7  10  5 2 5 8 1 4 15 20 1 25',
        stdinHint: 'Введите $d, n, v_1, \\ldots, v_{n-1}$'
    },
    { //22
        text: [
            'Задан числовой $v$ массив произвольной длины. Сгенерировать массив $w$, такой, что $w[i]$ --- среднее арифметическое всех элементов $v$ за исключением $v[i]$.',
            'Программа должна выводить на консоль оба массива. Массивы выводить в строку, отделяя элементы пробелами. Каждый массив начинать с новой строки.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int a[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            printer.println(args.a.join(' '))

            var w = new Array
            args.a.forEach(function(val,idx){
                var s=0
                args.a.forEach(function(val2,idx2){ if(idx!=idx2) s+=val2})
                w.push(s/(args.n-1))
            })
            printer.println(w.join(' '))

            return printer.finish()
        }],
        stdin: '5   2 4 6 8 10',
        stdinHint: 'Введите $n, v_1, \\ldots, v_{n-1}$'
    },
    { //23
        text: [
            'Задан числовой массив $v$ произвольной длины $n$. Обозначим $a_k = \\sum\\limits_{i=0}^{k-1}{v[i]}$, $b_k = \\sum\\limits_{i=k+1}^{n-1}{v[i]}$. Сгенерировать массивы чисел $a_k$ и $b_k$, найти индекс $k$, для которого $|a_k-b_k|=min$. Программа должна выводить на консоль все три массива и найденный индекс. Массивы выводить в строку, отделяя элементы пробелами. Каждый массив начинать с новой строки.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int v[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            printer.println(args.v.join(' '))

            var a = new Array
            var b = new Array
            args.v.forEach(function(val,k){
                var s=0
                for(var i=0;i<k;++i) s+=args.v[i]
                a.push(s)

                s=0
                for(i=k+1;i<args.n;++i) s+=args.v[i]
                b.push(s)
            })

            var idx=0,min=Math.abs(a[0]-b[0])
            for(var i=1;i<args.n;++i)
            {
                var m=Math.abs(a[i]-b[i])
                if(m<min){
                    min=m
                    idx=i
                }
            }
            printer.println(a.join(' '))
            printer.println(b.join(' '))
            printer.println(idx)
            return printer.finish()
        }],
        stdin: '5   2 4 6 8 10',
        stdinHint: 'Введите $n, v_1, \\ldots, v_{n-1}$'
    },
    { //24
        text: [
            'Задан числовой массив $v$ произвольной длины $n$. Преобразовать его следующим образом: если $v[i] > v[i-1]$ и $v[i] > v[i+1]$, то $v[i]$ присвоить среднее $v[i-1]$ и $v[i+1]$. Вывести оба массива в строку, каждый массив начать с новой строки.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int v[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            printer.println(args.v.join(' '))
            for(var i=1;i!=args.n-1;++i)
            {
                if (args.v[i]>args.v[i+1]&&args.v[i]>args.v[i-1]) args.v[i]=(args.v[i-1]+args.v[i+1])/2
            }
            printer.println(args.v.join(' '))
            return printer.finish()
        }],
        stdin: '10  5 1 10 5 20 9 3 20 1 25',
        stdinHint: 'Введите $n, v_0, \\ldots, v_{n-1}$'
    },
    { //25
        text: [
            'Задан целочисленный массив $v$ произвольной длины $n$. Вывести на экран индексы четных элементов $v$, но только тех, за которыми непосредственно следует нечетный элемент. Например, $v=[1,2,3,4,6,7,8]\\rightarrow[1,4]$',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int v[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            for(var i=0;i!=args.n-1;++i)
            {
                if(args.v[i]%2==0&&args.v[i+1]%2!=0) printer.print(i)
            }
            return printer.finish()
        }],
        stdin: '10  5 2 5 8 2 4 15 20 1 25',
        stdinHint: 'Введите $n, v_0, \\ldots, v_{n-1}$'
    },
    { //26
        text: [
            'Написать программу, генерирующую $n$ чисел $F_k$, где $n$ --- произвольное натуральное число. Числа $F_k$ задаются соотношением: $F_0=0$, $F_1=1$, $F_k=F_{k-1}+F_{k-2}$. Например, для $n=7$ $F=[0,1,1,2,3,5,8]$.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()

            var f2=0,f1=1
            var f
            for(var i=0;i!=args.n;++i)
            {
                if (i<=1) f=i
                else
                {
                    f=f2+f1
                    f2=f1
                    f1=f
                }
                printer.print(f)
            }
            return printer.finish()
        }],
        stdin: '7',
        stdinHint: 'Введите $n$'
    },
    { //27
        text: [
            'Задан целочисленный массив $v$ произвольной длины $n$. Вычислить и вывести на экран максимальную длину участка, состоящего лишь из четных чисел.',
            'Также вывести исходный массив.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int v[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            
            var even=false
            var start=-1
            var maxlen=0
            function testPart(end)
            {
                even=false
                var t=end-start+1
                if(t>maxlen) maxlen=t
            }
            for(var i=0;i!=args.n;++i)
            {
                var t=(args.v[i]%2==0)
                if(!even&&t) 
                {
                    even=true
                    start=i
                }
                if(even&&(!t)) testPart(i-1)
                if(even&&(i==args.n-1) ) testPart(i) 
            }
            var printer=lp()
            printer.println(args.v.join(' '))
            printer.println(maxlen)
            return printer.finish()
        }],
        stdin: '10 1 2 2 2 3 4 4 4 4 5',
        stdinHint: 'Введите $n, v_0, \\ldots, v_{n-1}$'
    },
    { //28
        text: [
            'Дано целое число $N$. Создать массив $v$, такой, что $v[i]$ есть $i$-я цифра числа $N$. Вычислить и вывести на экран сумму цифр числа $N$. Вывести на экран массив $v$.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n')
            //if (args.n > 100)
            //    throw new Error('Слишком большое n')
            var printer=lp()
            var a=new Array
            var s=0
            while(args.n>0)
            {
                var d=args.n%10
                a.unshift(d)
                s+=d
                args.n=Math.floor(args.n/10) //positive
            }
            printer.println(a.join(' '))
            printer.println(s)
            return printer.finish()
        }],
        stdin: '132435',
        stdinHint: 'Введите $n$'
    },
    { //29
        text: [
            'Задан вещественный массив $v$ произвольной длины $n$. Считая элементы массива коэффициентами полинома степени $n-1$: $f(x)=\\sum\\limits_{i=0}^{n-1}{v_ix^i}$, написать программу вычисления значения полинома и его производной в заданной точке.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real x, whole n, real v[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var f=0,d=0
            args.v.forEach(function(val,idx){
                f+=val*Math.pow(args.x,idx)
                if (idx>0) d+=idx*val*Math.pow(args.x,idx-1)
            })
            return lp().println(f,d).finish()
        }],
        stdin: '3   5   4 2 3 1 2',
        stdinHint: 'Введите $x, n, v_0, \\ldots, v_{n-1}$'
    },
    { //30
        text: [
            'Задан вещественный массив $v$ произвольной длины $n$. Локальным максимумом массива назовем такой элемент $v[i]$, для которого верно $v[i] > v[i-1]$ и $v[i] > v[i+1]$. В этом случае $i$ &mdash; индекс максимума. Найти индексы двух наиболее удаленных смежных максимумов. Смежные максимумы &mdash; те, между которыми нет  других максимумов.',
            'Вывести на экран исходный массив и найденные индексы. Если максимумов меньше 2, вместо индексов вывести $-1$.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real v[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            
            var max_st=-1,max_e=-2
            var st=-1
            for(var i=1;i!=args.n-1;++i)
            {
                if(args.v[i]>args.v[i+1]&&args.v[i]>args.v[i-1])
                {
                    if(st===-1) st=i
                    else
                    {
                        if(i-st>max_e-max_st){
                            max_st=st
                            max_e=i
                        }
                        st=i
                    }
                }
            }
            var printer=lp()
            if(max_st===-1) printer.println(-1)
            else printer.println(max_st,max_e)
            return printer.finish()
        }],
        stdin: '10   2 3 2 3 2 1 2 3 2 2',
        stdinHint: 'Введите $n, v_0, \\ldots, v_{n-1}$'
    },
    { //31  = 23
        text: [
            'Задан вещественный массив $v$ произвольной длины $n$. Найти индекс элемента $k$, такой, что $|s_1-s_2|\\rightarrow \\min$, где ',
            '$',
            's_1=\\sum\\limits_{i=0}^{k-1}{v[i]}; \\quad s_2=\\sum\\limits_{i=k+1}^{n-1}{v[i]}.',
            '$',
            'Вывести на экран исходный массив в строку, элементы разделять пробелами. Вывести найденный индекс $k$ и соответствующие $s_1$ и $s_2$.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real v[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            printer.println(args.v.join(' '))

            var a = new Array
            var b = new Array
            args.v.forEach(function(val,k){
                var s=0
                for(var i=0;i<k;++i) s+=args.v[i]
                a.push(s)

                s=0
                for(i=k+1;i<args.n;++i) s+=args.v[i]
                b.push(s)
            })

            var idx=0,min=Math.abs(a[0]-b[0])
            for(var i=1;i<args.n;++i)
            {
                var m=Math.abs(a[i]-b[i])
                if(m<min){
                    min=m
                    idx=i
                }
            }
            //printer.println(a.join(' '))
            //printer.println(b.join(' '))
            printer.println('Индекс=',idx,'  s1=',a[idx],'  s2=',b[idx])
            return printer.finish()
        }],
        stdin: '5   2 4 6 8 10',
        stdinHint: 'Введите $n, v_0, \\ldots, v_{n-1}$'
    },
    { //32
        text: [
            'Задан вещественный массив $v$ произвольной длины $2n$. Массив определяет последовательность $n$ отрезков числовой оси: начало $i$-го отрезка &mdash; элемент $v[2i]$, конец &mdash; $v[2i+1]$. Также задан отрезок $[a;b]$. Вывести на экран индексы отрезков из $v$, целиком лежащих внутри $[a,b]$.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real a, real b, whole n, real v[2*n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            for (var i=0;i!=args.n;++i)
            {
                if (args.a<=args.v[2*i]&&args.b>=args.v[2*i+1]) printer.print(i)
            }
            return printer.finish()
        }],
        stdin: ' 3 8   10   1 3  2 4  3 5  4 6  5 7  6 8  7 9  8 10  9 11  10 12',
        stdinHint: 'Введите $a, b, n, v_0, \\ldots, v_{2n-1}$'
    },
    { //33
        text: [
            'Задан вещественный массив $v$ произвольной длины $2n$. Массив определяет последовательность $n$ отрезков числовой оси: начало $i$-го отрезка &mdash; элемент $v[2i]$, конец &mdash; $v[2i+1]$. Также задан отрезок $[a;b]$. Вывести на экран индексы отрезков из $v$, целиком содержащих внутри себя $[a,b]$. Учесть ситуацию, когда $v[2i+1] < v[2i]$ (отрезок задан задом наперед).',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real a, real b, whole n, real v[2*n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            for (var i=0;i!=args.n;++i)
            {
                var x,y
                if (args.v[2*i]<=args.v[2*i+1])
                {
                    x=args.v[2*i]
                    y=args.v[2*i+1]
                }
                else
                {
                    y=args.v[2*i]
                    x=args.v[2*i+1]
                }
                if (args.a<=x&&args.b>=y) printer.print(i)
            }
            return printer.finish()
        }],
        stdin: ' 3 8   10   1 3  2 4  3 5  4 6  5 7  6 8  7 9  8 10  9 11  10 12',
        stdinHint: 'Введите $a, b, n, v_0, \\ldots, v_{2n-1}$'
    },
    {   //34
        text: [
            'Даны два целых числа $M$ и $N$. Записать в массив $v$ все общие делители этих чисел. Вывести на экран числа $M$ и $N$, а также массив $v$ (в строку, разделяя элементы пробелами).',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'int m, int n')
            if (Math.abs(args.n) > 200||Math.abs(args.m) > 200)
                throw new Error('Слишком большое n')
            var printer=lp()
            
            var x=args.n<args.m?args.n:args.m

            printer.println(args.m,args.n)
            for (var i=1;i<=x;++i)
            {
                if (args.n%i==0&&args.m%i==0) printer.print(i)
            }

            return printer.finish()
        }],
        stdin: '28 36',
        stdinHint: 'Введите $M, N$'
    },
    {   //35 //27?
        text: [
            'Задан вещественный массив $v$ произвольной длины $n$. Вывести на экран индексы начала и конца самого длинного участка, состоящего только из положительных чисел. Например: ',
            '$',
            '[1,2,3, -1, 2]\\rightarrow[0,2] \\quad [0, 1, 2, -3, 2]\\rightarrow[1,2] \\quad [-1,-2,0]\\rightarrow[]',
            '$',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real v[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var posi=false
            var start=-1
            var maxlen=0,maxstart=-1,maxend=-1
            function testPart(end)
            {
                posi=false
                var t=end-start+1
                if(t>maxlen) 
                {
                    maxlen=t
                    maxstart=start
                    maxend=end
                }
            }
            for(var i=0;i!=args.n;++i)
            {
                var t=(args.v[i]>0)
                if(!posi&&t) 
                {
                    posi=true
                    start=i
                }
                if(posi&&(!t)) testPart(i-1)
                if(posi&&(i==args.n-1) ) testPart(i) 
            }
             
            var printer=lp()
            if (maxstart===-1) return printer.println('no').finish()
            //printer.println(args.v.join(' '))
            printer.println(maxstart,maxend)
            return printer.finish()
        }],
        stdin: '10   3 3 -1 -1 -1 3 -1 3 3 3',
        stdinHint: 'Введите $n, v_0, \\ldots, v_{n-1}$'
    },
    {   //36
        text: [
            'Задан массив положительных целых чисел $v$ произвольной длины $n$. Найти и вывести на экран наибольший общий делитель $M$ всех элементов массива. Также вывести на экран исходный массив и массив $v/M$. Вывод каждого массива начинать с новой строки, элементы выводить в строку через пробел.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int v[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            printer.println(args.v.join(' '))
            var min=args.v[0]
            args.v.forEach(function(val){if(min>Math.abs(val))min=Math.abs(val)})
            var gcd=0
            for(var i=1;i<=min;++i)
            {
                var s=0
                args.v.forEach(function(val){s+=val%i})
                if(s==0&&gcd<i) gcd=i
            }
            printer.println(gcd)
            args.v.forEach(function(val){printer.print(val/gcd)})
            return printer.finish()
        }],
        stdin: '4  28 196 32 56',
        stdinHint: 'Введите $n, v_0, \\ldots, v_{n-1}$'
    },
    {   //37
        text: [
            'Задан массив вещественных чисел $v$ длины $2n$, содержащий координаты вершин $n$-угольника в виде $x_0,y_0,x_1,y_1,....,x_{n-1},y_{n-1}$, то есть координаты $i$-ой вершины есть $(v[2i],v[2i+1])$. Вычислить периметр многоугольника. Вывести на экран значение периметра и исходный массив.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real v[2*n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            printer.println(args.v.join(' '))
            var p=0

            var a=args.v[0]-args.v[2*args.n-2]
            var b=args.v[1]-args.v[2*args.n-1]
            p+=Math.sqrt(a*a+b*b)     
            for(var i=0;i!=args.n-1;++i)
            {
                a=args.v[2*i]-args.v[2*i+2]
                b=args.v[2*i+1]-args.v[2*i+3]
                p+=Math.sqrt(a*a+b*b)
            }
            return printer.println(p).finish()
        }],
        stdin: '5  0 0  0 2  4 5  8 2  8 0',
        stdinHint: 'Введите $n, v_0, \\ldots, v_{2n-1}$'
    },
    {   //38
        text: [
            'Задан массив вещественных чисел $v$ произвольной длины $n$. Найти и вывести на экран индекс $i$ такого элемента, для которого $|(v[i])^2 - (v[i+1])^2 -(v[i-1])^2|\\rightarrow \\min$. Также вывести исходный массив в строку, разделяя элементы пробелами.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real v[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            printer.println(args.v.join(' '))
            var min=Math.abs(args.v[1]*args.v[1]-args.v[2]*args.v[2]-args.v[0]*args.v[0])
            var idx=-1

            for(var i=2;i<args.n-1;++i)
            {
                var t=Math.abs(args.v[i]*args.v[i]-args.v[i+1]*args.v[i+1]-args.v[i-1]*args.v[i-1])
                if(min>t) {
                    min=t
                    idx=i
                }
            }
            return printer.println(idx).finish()
        }],
        stdin: '7   1 2 3 5 4 6 7',
        stdinHint: 'Введите $n, v_0, \\ldots, v_{n-1}$'
    },
    {   //39
        text: [
            'Задан массив вещественных чисел $v$ произвольной длины $n$. Найти и вывести на экран индексы $i$ таких элементов, для которых $v[i] > v[i+1] +v[i-1]$. Также вывести исходный массив в строку, разделяя элементы пробелами.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real v[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            printer.println(args.v.join(' '))
            for(var i=2;i!=args.n-1;++i)
            {
                if(args.v[i]>args.v[i+1]+args.v[i-1]) printer.print(i)
            }
            return printer.finish()
        }],
        stdin: '10   1 2 3 10 5 6 7 8 9 0',
        stdinHint: 'Введите $n, v_0, \\ldots, v_{n-1}$'
    },
    {   //40
        text: [
            'Задан вещественный массив $v$ произвольной длины $2n$. Массив определяет последовательность $n$ отрезков числовой оси: начало $i$-го отрезка &mdash; элемент $v[2i]$, конец &mdash; $v[2i+1]$. Также задано вещественное число $a$. Вывести на экран индексы отрезков из $v$, содержащих внутри себя $a$. Учесть ситуацию, когда $v[2i+1] < v[2i]$ (отрезок задан задом наперед).',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real a, whole n, real v[2*n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            for (var i=0;i!=args.n;++i)
            {
                var x,y
                if (args.v[2*i]<=args.v[2*i+1])
                {
                    x=args.v[2*i]
                    y=args.v[2*i+1]
                }
                else
                {
                    y=args.v[2*i]
                    x=args.v[2*i+1]
                }
                if (args.a>=x&&args.a<=y) printer.print(i)
            }
            return printer.finish()
        }],
        stdin: '4  5   1 3  2 4  3 5  4 6  5 7',
        stdinHint: 'Введите $a, n, v_0, \\ldots, v_{2n-1}$'
    },
    {   //41
        text: [
            'Задан массив вещественных чисел $v$ длины $2n$, содержащий координаты точек на плоскости в виде $x_0,y_0,x_1,y_1,....,x_{n-1},y_{n-1}$, то есть координаты $i$-ой точки есть $(v[2i],v[2i+1])$. Дана точка $A$ с координатами $(x_A,y_A)$. Вывести на экран индекс точки из $v$, ближайшей к $A$.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'real x, real y, whole n, real v[2*n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            function len2(x,y,x1,y1)
            {
                return (x-x1)*(x-x1)+(y-y1)*(y-y1)
            }
            var min=len2(args.x,args.y,args.v[0],args.v[1])
            var idx=0
            for(var i=1;i!=args.n;++i)
            {
                let t=len2(args.x,args.y,args.v[2*i],args.v[2*i+1])
                if(min>t)
                {
                    min=t
                    idx=i
                }   
            }
            return printer.println(idx).finish()
        }],
        stdin: ' 3 4    5     1 1  2 2  3 3  4 4  5 5',
        stdinHint: 'Введите $ x_A, y_A, n, v_0, \\ldots, v_{2n-1}$'
    },
    {   //42
        text: [
            'Даны два массива вещественных чисел $x$ и $y$ длины $n$. Значения в массиве $x$ упорядочены по возрастанию. Считая, что массивы задают табличную функцию $y(x)$, вычислить интеграл',
            '$',
            '\\int\\limits_{x_1}^{x_{n}}y(x)dx = \\sum\\limits_{i=1}^{n-1}\\frac{1}{2}\\left(y_{i+1}+y_{i}\\right)\\left(x_{i+1}-x_i\\right)',
            '$',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real x[n], real y[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var s=0
            for(var i=0;i!=args.n-1;++i)
            {
                s+=(args.y[i+1]+args.y[i])*(args.x[i+1]-args.x[i])/2
            }
            
            return lp().println(s).finish()
        }],
        stdin: ' 7   0 0.2617993877991494 0.5235987755982988 0.7853981633974483 1.0471975511965976 1.308996938995747 1.5707963267948963  0 0.25881904510252074 0.49999999999999994 0.7071067811865475 0.8660254037844386 0.9659258262890682 1',
        stdinHint: 'Введите $n, x_1, \\ldots, x_{n}, y_1, \\ldots, y_{n}$'
    },
    {   //43
        text: [
            'Дан массив $v$ длины $n$. Вывести на экран индексы элементов, значения которых больше суммы впереди стоящих элементов: $v_k>\\sum\\limits_{i=0}^{k-1}v_i$. Например, $v=\\left[1,3,2,-3,4\\right]\\rightarrow \\left[0,1,4\\right]$.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, int v[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            var s=0
            for(var i=0;i!=args.n;++i)
            {
                if (args.v[i]>s) printer.print(i)
                s+=args.v[i]
            }
            return printer.finish()
        }],
        stdin: '5   1 3 2 -3 4',
        stdinHint: 'Введите $n, v_0, \\ldots, v_{n-1}$'
    },
    {   //44
        text: [
            'Даны целочисленные массивы $u$ и $v$ длины $n$. Каждый массив это число, а каждый элемент массива - отдельная цифра. Младший разряд числа хранится в элементе с индексом ноль. Например, число 1239 при $n=10$ запишется как $u=[9,3,2,1,0,0,0,0,0,0]$. Написать программу, выполняющую сложение чисел $u$ и $v$. Результат записывается в массив $w$ такой же длины. Например, для приведенного выше $u$ и $v=[5,4,3,9,9,0,0,0,0,0]$ (число 99345) получим результат $w=[4,8,5,0,0,1,0,0,0,0]$ (число 100584).',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, uint u[n], uint v[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            
            var w = new Array
            
            var s=0
            var carry=0
            var razr=1
            for(var i=0;i!=args.n;++i)
            {
                let t=args.u[i]+args.v[i]+carry
                carry=Math.floor(t/10)
                w.push(t%10)
                s+=(t%10)*razr
                razr*=10
            }
            s+=carry*razr
            printer.println(w.join(' '))
            return printer.finish()
        }],
        stdin: '10   9 3 2 1 0 0 0 0 0 0   5 4 3 9 9 0 0 0 0 0',
        stdinHint: 'Введите $n, u_0, \\ldots, u_{n-1}  v_0, \\ldots, v_{n-1}$'
    },
    {   //45
        text: [
            'Задан целочисленный массив $v$ длины $n$. Найти разность индексов  последнего и первого четных элементов массива. Например: $v=[1,2,3,3,4,6,7]\\rightarrow 4$.',
            '<br>'].join('\n'),
        scene: ['program', function(stdin) {
            var args = ppi(stdin, 'whole n, real v[n]')
            if (args.n > 100)
                throw new Error('Слишком большое n')
            var printer=lp()
            var b=true
            var first=-1, last=-1
            args.v.forEach(function(val,idx){
                if (val%2===0)
                { 
                    if(b)
                    {
                        b=false
                        first=idx
                    }
                    else last=idx
                }
            })
            if(last===-1)
            {
                printer.println(first===-1?'В массиве нет чётных элементов':'В массиве только один чётный элемент')
            }
            else printer.println(last-first)
            return printer.finish()
        }],
        stdin: '7    1 2 3 3 4 6 7',
        stdinHint: 'Введите $n, v_0, \\ldots, v_{n-1}$'
    }
    ]
})

// 32,33,30,19,40 -- тире +++ &mdash;
// 31 = 23 ?
// 23 -- вопрос по индексам а и b: a[0] и b[n-1]
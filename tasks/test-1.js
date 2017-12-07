var tasks = require('../routes/tasks.js')

module.exports = tasks.Tasks.fromObject([
    {
        text: 'Нарисуйте "равносторонний" треугольник. Нижняя сторона горизонтальна, высота равна 0.75 высоты области рисования',
        scene: ['shapes', {
            shapes: [
                { geometry: ['regular', {center: {x: 0.5, y: 0.5}, n: 3, radius: 0.5001, phase: 90}], fill: '#' }
            ],
            background: '.'
        }]
    }, {
        text: 'Нарисуйте кольцо на фоне прямоугольника, занимающего верхнюю половину экрана.',
        scene: ['shapes', {
            shapes: [
                { geometry: ['rect', {x: 0, y: 0.5, w: 1, h: 0.5001}], fill: '/' },
                { geometry: ['d', {a: ['circle', {center: { x: 0.5, y: 0.5 }, radius: 0.4 }], b: ['circle', {center: { x: 0.5, y: 0.5 }, radius: 0.2 }]}], fill: 'o' }
            ],
            background: '.'
        }]
    }, {
        text: 'Нарисуйте в середине "шахматной доски" прямоугольник шириной 1/3 ширины и высотой 1/3 высоты области рисования.',
        scene: ['shapes', {
            shapes: [
                { geometry: ['rect', {x: 0.333, y: 0.333, w: 0.333, h: 0.333}], fill: '/' }
            ],
            background: ['........########', '........########', '........########', '........########', '########........', '########........', '########........', '########........']
        }]
    }, {
        text: 'Нарисуйте "правильный" пятиугольник с центром в центре области рисования.',
        scene: ['shapes', {
            shapes: [
                { geometry: ['regular', {center: {x: 0.5, y: 0.5}, n: 5, radius: 0.4001, phase: 90}], fill: '#' }
            ],
            background: '.'
        }]
    }, {
        text: 'Нарисуйте вот такую рожицу (глаза - круги, рот - эллипс, нос - прямоугольник).',
        scene: ['shapes', {
            shapes: [
                { geometry: ['circle', {center: { x: 0.5, y: 0.5 }, radius: 0.4 }], fill: '-' },
                { geometry: ['circle', {center: { x: 0.3, y: 0.6 }, radius: 0.1 }], fill: '/' },
                { geometry: ['circle', {center: { x: 0.7, y: 0.6 }, radius: 0.1 }], fill: '/' },
                { geometry: ['circle', {center: { x: 0.35, y: 0.6 }, radius: 0.03 }], fill: '#' },
                { geometry: ['circle', {center: { x: 0.75, y: 0.6 }, radius: 0.03 }], fill: '#' },
                { geometry: ['ellipse', {center: { x: 0.5, y: 0.3 }, rx: 0.1, ry: 0.05 }], fill: '@' },
                { geometry: ['square', {center: { x: 0.5, y: 0.5 }, size: 0.1 }], fill: 'v' }
            ],
            background: '.'
        }]
    }, {
        text: 'Нарисуйте такую штуковину (снизу от синусоиды хитроумная заливка)',
        scene: ['shapes', {
            shapes: [
                { geometry: ['w', {bias: 0.5, amp: 0.4, length: 1, phase: 0 }], fill: ['-', '-=-', '--==--'] },
            ],
            background: '.'
        }]
    }, {
        text: 'Нарисуйте синусоиду и два круга',
        scene: ['shapes', {
            shapes: [
                { geometry: ['w', {bias: 0.5, amp: 0.4, length: 1, phase: 0 }], fill: '*' },
                { geometry: ['circle', {center: { x: 0.25, y: 0.5 }, radius: 0.1 }], fill: '@' },
                { geometry: ['circle', {center: { x: 0.75, y: 0.5 }, radius: 0.1 }], fill: '@' },
            ],
            background: '.'
        }]
    }, {
        text: 'Нарисуйте вот такой ромб',
        scene: ['shapes', {
            shapes: [
                { geometry: ['regular', {center: {x: 0.5, y: 0.5}, n: 4, radius: 0.4001}], fill: '<>' }
            ],
            background: '.'
        }]
    }, {
        text: 'Нарисуйте месяц на фоне звёзд',
        scene: ['shapes', {
            shapes: [
                { geometry: ['d', {a: ['circle', {center: { x: 0.5, y: 0.5 }, radius: 0.4 }], b: ['circle', {center: { x: 0.4, y: 0.55 }, radius: 0.43 }]}], fill: ')' }
            ],
            background: ['    .     ', '          ', '         .']
        }]
    }, {
        text: 'Нарисуйте квадрат с круглой дыркой',
        scene: ['shapes', {
            shapes: [
                { geometry: ['d', {a: ['rect', {x: 0.2, y: 0.2, w: 0.6, h: 0.6}], b: ['circle', {center: { x: 0.5, y: 0.5 }, radius: 0.2 }]}], fill: '#' }
            ],
            background: ['.-','-.']
        }]
    }, {
        text: 'Нарисуйте волны',
        scene: ['shapes', {
            shapes: [
                { geometry: ['w', {bias: 0.7, amp: 0.2, length: 0.6, phase: 50 }], fill: '-' },
                { geometry: ['w', {bias: 0.6, amp: 0.25, length: 1, phase: 0 }], fill: '=' },
                { geometry: ['w', {bias: 0.4, amp: 0.35, length: 1.5, phase: 0.3 }], fill: '*' },
                { geometry: ['w', {bias: 0.2, amp: 0.15, length: 0.4, phase: 0.1 }], fill: '#' },
            ],
            background: ' '
        }]
    }, {
        text: 'Нарисуйте круг с квадратной дыркой',
        scene: ['shapes', {
            shapes: [
                { geometry: ['d', {a: ['circle', {center: { x: 0.5, y: 0.5 }, radius: 0.45 }], b: ['square', {center: { x: 0.5, y: 0.5 }, size: 0.2 }]}], fill: '#' }
            ],
            background: '|{}'
        }]
    }
])


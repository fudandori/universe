function isMobile() {
    const regex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const settings = (navigator.userAgent || navigator.vendor || window.opera).toLowerCase();

    return regex.test(settings);
}

window.requestAnimationFrame =
    window.__requestAnimationFrame ||
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;



var loaded = false;


function init() {


    if (loaded) return;

    loaded = true;

    let enabled = false;
    let started = false;

    let world = document.getElementById('world');
    let inside = document.getElementById('inside');
    let mySpan = document.getElementById('span');

    document.getElementsByTagName('body')[0].removeChild(document.getElementById('main'));

    const mobile = isMobile();
    const screenCoefficient = mobile ? 0.5 : 1;
    const canvas = document.getElementById('heart');
    const ctx = canvas.getContext('2d');
    const rand = Math.random;

    let width = canvas.width = screenCoefficient * innerWidth;
    let height = canvas.height = screenCoefficient * innerHeight;

    const black = 'rgba(0,0,0,1)';

    ctx.fillStyle = black;
    ctx.fillRect(0, 0, width, height);

    const fillBackground =  () => {
        width = canvas.width = screenCoefficient * innerWidth;
        height = canvas.height = screenCoefficient * innerHeight;
        ctx.fillStyle = black;
        ctx.fillRect(0, 0, width, height);
    }

    window.addEventListener('resize', fillBackground);

    const [tau, delta, layer1, layer2, layer3] = [Math.PI * 2, mobile ? 0.3 : 0.1, [210, 13], [150, 9], [90, 5]];
    
    //AUX
    const getPos = (rad) => [Math.pow(Math.sin(rad), 3), -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))];
    const scale = (pos, scaleX, scaleY) => [pos[0] * scaleX, pos[1] * scaleY];
    
    
    const addPoint = (rad, layer, list) => {
        const heartPos = getPos(rad);
        const point = scale(heartPos, layer[0], layer[1]);
        list.push(point);
    };

    const buildPoints = () => {
        const list = [];
        for (let rad = 0; rad < tau; rad += delta) addPoint(rad, layer1, list);
        for (let rad = 0; rad < tau; rad += delta) addPoint(rad, layer2, list);
        for (let rad = 0; rad < tau; rad += delta) addPoint(rad, layer3, list);
        return list;
    }
    
    const originPoints = buildPoints();

    const heartPointsCount = originPoints.length;
    const traceCount = mobile ? 20 : 50;

    //AUX
    const fillTrace = (quantity, x, y) => Array(quantity).fill(0).map(() => { return { x: x, y: y }; });
    const randomizeHsla = () => "hsla(0," + Math.trunc(40 * rand() + 60) + "%," + Math.trunc(60 * rand() + 20) + "%,.3)";
    const createProperties = (init, n) => {
        const x = rand() * width;
        const y = rand() * height;
        return {
            vx: init,
            vy: init,
            R: 2,
            speed: rand() + 5,
            q: Math.trunc(rand() * heartPointsCount),
            D: 2 * (n % 2) - 1,
            force: 0.2 * rand() + 0.7,
            f: randomizeHsla(),
            trace: fillTrace(traceCount, x, y)
        };
    };

    const universe = Array(heartPointsCount)
        .fill(0)
        .map((o, n) => createProperties(o, n))
        .reverse();

    const [traceK, timeDelta] = [0.4, 0.01];

    let time = 0;

    const loop = () => {
        const n = -Math.cos(time);
        const [increment, timeCoeff] = [(1 + n) * .5, Math.sin(time) < 0 ? 9 : (n > 0.8) ? .2 : 1];

        const targetPoints = originPoints.map(p => [increment * p[0] + width / 2, increment * p[1] + height / 2]);

        time += timeCoeff * timeDelta;

        ctx.fillStyle = "rgba(0,0,0,.1)";
        ctx.fillRect(0, 0, width, height);

        for (let i = universe.length; i--;) {
            var u = universe[i];
            var q = targetPoints[u.q];
            var dx = u.trace[0].x - q[0];
            var dy = u.trace[0].y - q[1];
            var length = Math.sqrt(dx * dx + dy * dy);
            if (10 > length) {
                if (0.95 < rand()) {
                    u.q = Math.trunc(rand() * heartPointsCount);
                } else {
                    if (0.99 < rand()) {
                        u.D *= -1;
                    }
                    u.q += u.D;
                    u.q %= heartPointsCount;
                    if (0 > u.q) {
                        u.q += heartPointsCount;
                    }
                }
            }
            u.vx += -dx / length * u.speed;
            u.vy += -dy / length * u.speed;
            u.trace[0].x += u.vx;
            u.trace[0].y += u.vy;
            u.vx *= u.force;
            u.vy *= u.force;
            for (k = 0; k < u.trace.length - 1;) {
                var T = u.trace[k];
                var N = u.trace[++k];
                N.x -= traceK * (N.x - T.x);
                N.y -= traceK * (N.y - T.y);
            }
            ctx.fillStyle = u.f;
            for (k = 0; k < u.trace.length; k++) {
                ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
            }
        }

        //if ((time < .60 && started) || enabled)
        window.requestAnimationFrame(loop, canvas)

    };

    loop();

    start = () => {

        setTimeout(() => {
            mySpan.innerHTML = 'Esa energía se transformó en un sol';
            mySpan.style.opacity = '1';
        }, 4000);

        let c2 = 0;
        let text2 = [
            'Una pequeña estrella dentro de ambos',
            'Les daba calor y esperanzas',
            'Poco a poco, ese sol crecía...',
            'Y se expandía',
            'Ese calor interno llegó a provocar miedo',
            'Miedo a lo inesperado...',
            'Miedo a lo impredecible...',
            'Miedo a las dificultades...',
            'Miedo a sufrir consecuencias...',
            'Miedo a no ser correspondido...',
            'Miedo a tener miedo...',
            'Los viajeros, a pesar del regalo del universo...',
            'No se veían preparados para aceptarlo',
            'Decidieron seguir su camino',
            'Ignorando el calor de esa estrella en su interior',
            'Pero el problema de ignorar las cosas...',
            'Es que no desaparecen',
            'Así que el sol siguió creciendo...',
            'Y creciendo',
            'Hasta que ya no pudieron ignorarlo',
            'Fue entonces cuando explotó...',
            'Y se transformó'
        ];

        mySpan.style.opacity = '0';

        started = true;
        window.requestAnimationFrame(loop, canvas);
        document.getElementById('universe').onclick = null;
        document.getElementById('universe').style.cursor = 'default';

        let me2 = setInterval(() => {

            mySpan.style.opacity = '0';



            setTimeout(() => {
                if (c2 < text2.length) {
                    mySpan.innerHTML = text2[c2++];
                    mySpan.style.opacity = '1';
                } else {
                    clearInterval(me2);
                    mySpan.innerHTML = '(Haz click en el sol para transformarlo)';
                    mySpan.style.opacity = '1';
                    document.getElementById('center').style.visibility = 'visible';
                    document.getElementById('center').onclick = enable;

                }
            }, 4000)


        }, 8000);

    };

    enable = () => {
        world.pause();
        inside.play();

        mySpan.style.opacity = '0';
        enabled = true;
        window.requestAnimationFrame(loop, canvas);
        document.getElementById('center').onclick = null;
        document.getElementById('center').style.visibility = 'hidden';

        setTimeout(() => {
            mySpan.innerHTML = 'Se transformó en puro amor';
            mySpan.style.opacity = '1';
        }, 4000);

        let c3 = 0;
        text3 = [
            'Dona, el universo quiso juntarnos',
            'No despreciemos su esfuerzo',
            'Eres la mujer más maravillosa que he conocido',
            'Te amo con toda la energía de un sol',
            'Y te voy a amar siempre'
        ];

        let me3 = setInterval(() => {

            mySpan.style.opacity = '0';



            setTimeout(() => {
                if (c3 < text3.length) {
                    mySpan.innerHTML = text3[c3++];
                    mySpan.style.opacity = '1';
                } else {
                    mySpan.innerHTML = 'Felíz día de San Valentín mi amor';
                    mySpan.style.opacity = '1';
                    clearInterval(me3);
                }
            }, 4000)


        }, 8000);
    };

    world.play();


    let c = 0;
    var text = [
        'Es inmensamente grande, quizás infinito',
        'Frío y casi vacío, está atado y gobernado por las leyes físicas',
        'Sin embargo...',
        'En ocasiones aparenta tener vida propia y consciencia',
        '¿Por qué?',
        'Porque a veces lo imposible, se convierte en posible',
        'Hace muchos años, el universo tuvo un plan',
        'No era un plan sencillo',
        'Ni tampoco un plan a corto plazo',
        'Para aprender a correr, primero hay que caminar',
        'Y para aprender a amar, también hay que aprender a sufrir',
        'El universo quiso juntar a dos personas',
        'Pero no estaban preparadas',
        'Primero debían vivir',
        'Aprender qué es sufrir...',
        'Y qué amar',
        'Y así fue',
        'Dos personas se conocieron',
        'Pero no sabían lo que estaba pasando',
        'No sabían que el universo...',
        'Les estaba preparando para un viaje',
        'El viaje de sus vidas',
        'El que lo cambiaría todo...',
        'Dos personas viajaban juntas',
        'Pero ellos no sabían que estaban viajando',
        'El universo concentró su energía...'

    ];

    setTimeout(() => mySpan.style.opacity = '1', 4000);

    var me = setInterval(() => {

        mySpan.style.opacity = '0';

        setTimeout(() => {
            if (c < text.length) {
                mySpan.innerHTML = text[c++];
                mySpan.style.opacity = '1';
            } else {
                mySpan.innerHTML = '(Haz click en cualquier parte del universo para concentrar su energía)';
                mySpan.style.opacity = '1';
                clearInterval(me);
                document.getElementById('universe').style.cursor = 'pointer';
                document.getElementById('universe').onclick = start;
            }
        }, 4000)
    }, 8000);


};
import ScrollReveal from 'scrollreveal';
import { TweenLite } from 'gsap';
import { tween, easing, svg, delay } from 'popmotion';
let Autogrow = require('textarea-autogrow');

/**
 * custom polyfills
 */

(function() {
    let lastTime = 0;
    let vendors = ['ms', 'moz', 'webkit', 'o'];
    for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            let currTime = new Date().getTime();
            let timeToCall = Math.max(0, 16 - (currTime - lastTime));
            let id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


/**
 * action after onload event
 */
window.onload = function() {
    loadCustomerLogos();
    checkResize();
    const canvas = document.getElementById('bg-animation');
    if (canvas) {
        backgroundAnimation();
    }
};

/**
 * menu toggle
 */

const  menu = document.getElementById('collapsible'),
    toggler = document.getElementById('toggler'),
    togglericon = document.getElementById('togglericon')
;
if (toggler) {
    // toggle the navigation UI
    let rootElement = document.getElementById('root');
    let toggleNavigation = function() {
        if(menu.classList.contains('expanded')) {
            // close nav
            menu.classList.remove('expanded');
            togglericon.classList.remove('expanded');
            rootElement.style.overflow = 'auto';
        } else {
            // open nav
            menu.classList.add('expanded');
            togglericon.classList.add('expanded');
            rootElement.style.overflow = 'hidden'; // disable scroll on body when menu open
        }
    };
    toggler.addEventListener('click', function() {
        toggleNavigation();
    });
}


/**
 * equalize height of elements
 */

function equalize() {
    const nodes = document.querySelectorAll('.equalize'),
          elems = [].slice.call(nodes),
          tallest = Math.max.apply(Math, elems.map(function(elem, index) {
            elem.style.minHeight = '';
            return elem.offsetHeight;
        }))
    ;

    for (let i = 0; i < elems.length; i++) {
        const elem = elems[i];
        elem.style.minHeight = tallest + 'px';
    }
}

/**
 * load customer logos responsively
 */

const loadCustomerLogos = function() {
    const customerLogos = [
        { src: '/images/uploads/customers/kyburz-switzerland.png', alt: 'Logo Kyburz Switzerland', title: 'Kyburz Switzerland' },
        { src: '/images/uploads/customers/universitaet-zuerich.png', alt: 'Logo Universitaet Zürich', title: 'Universitaet Zürich' },
        { src: '/images/uploads/customers/amt-fuer-violksschule-kt-thurgau.png', alt: 'Logo Amt für Volksschule Thurgau', title: 'Amt für Volksschule Thurgau' },
        { src: '/images/uploads/customers/keller-swiss-group.png', alt: 'Logo Keller Swiss Group', title: 'Keller Swiss Group' },
        { src: '/images/uploads/customers/volksschulamt-kt-zuerich.png', alt: 'Logo Volksschulamt Kanton Zürich', title: 'Volksschulamt Kanton Zürich' },
        { src: '/images/uploads/customers/filtex.png', alt: 'Logo Filtex AG', title: 'Filtex AG' },
        { src: '/images/uploads/customers/margarethen-garage.png', alt: 'Logo Margarethen Garage Basel', title: 'Margarethen Garage Basel' },
        { src: '/images/uploads/customers/cm-informatik.png', alt: 'Logo CM Informatik AG', title: 'CM Informatik AG' },
        { src: '/images/uploads/customers/avidec.png', alt: 'Logo Avidec', title: 'Avidec' },
        { src: '/images/uploads/customers/privatklinik-hohenegg.png', alt: 'Logo Privatklinik Hohenegg', title: 'Privatklinik Hohenegg' },
        { src: '/images/uploads/customers/rehaklinik-zihlschlacht.png', alt: 'Logo Rehaklinik Zihlschlacht', title: 'Rehaklinik Zihlschlacht' },
        { src: '/images/uploads/customers/langfilm.png', alt: 'Logo Lang Film', title: 'Lang Film' }
    ];

    const customerWrapper = document.querySelector('#cWrapper');
    if (customerWrapper) {
        customerWrapper.innerHTML = '';
        for (let i = 0; i < customerLogos.length; i++) {
            let customer = customerLogos[i];
            let imgNode = document.createElement('img');
            imgNode.src = customer.src;
            imgNode.alt = customer.alt;
            imgNode.title = customer.title;
            customerWrapper.appendChild(imgNode);
        }
    }
};

/**
 * window resize event listener
 */

let resized = true,
    timeout = null
;
const checkResize = function() {
        if (resized) {
            if(window.requestAnimationFrame) {
                window.requestAnimationFrame(equalize);
            }
            loadCustomerLogos();
        }
        clearTimeout(timeout);
        timeout = setTimeout(checkResize, 50);
        resized = false;
    }
;

/**
 * logo hovering effect
 *
 * @see https://popmotion.io/api/svg/
 */

const pixelRotations = [];
const pixelColors = [];

let changeLogo = function() {
    const logoPixels = document.querySelectorAll('rect');
    const allowedDegrees = [0, 0];
    const allowedColors = ['#AAAAAA', '#888888', '#666666', '#444444', '#222222', '#111111'];

    for (let j = 0; j < logoPixels.length; j++) {
        const logoPixel = logoPixels[j];
        const pixelStyler = svg(logoPixel);

        const randDelay = Math.round(Math.random() * 12);
        const randDuration = 100 + Math.round(Math.random() * 100);

        pixelRotations[j] = allowedDegrees[Math.round(Math.random() * allowedDegrees.length) - 1];
        pixelColors[j] = allowedColors[Math.round(Math.random() * allowedColors.length) - 1];

        if(Math.random() > 0.5) {
            pixelRotations[j] = -pixelRotations[j];
        }

        delay(j * randDelay).start({
            complete: () => {
                tween({
                    from: {
                        fill: '#000000',
                        stroke: '#000000'
                    },
                    to: {
                        fill: pixelColors[j],
                        stroke: pixelColors[j]
                    },
                    duration: randDuration,
                    ease: easing.easeOut
                }).start(pixelStyler.set);
            }
        });
    }
};


const reverseLogo = function() {
    const logoPixels = document.querySelectorAll('rect');
    for (let j = (logoPixels.length - 1); j >= 0 ; j--) {

        const invj = (logoPixels.length - 1) - j;
        const logoPixel = logoPixels[j];
        const pixelStyler = svg(logoPixel);
        const randDelay = Math.round(Math.random() * 12);
        const randDuration = 100 + Math.round(Math.random() * 100);

        delay(invj*randDelay).start({
            complete: () => {
                tween({
                    from: {
                        fill: pixelColors[j],
                        stroke: pixelColors[j]
                    },
                    to: {
                        fill: '#000000',
                        stroke: '#000000'
                    },
                    duration: randDuration,
                    ease: easing.easeOut
                }).start(pixelStyler.set);
            }
        });
    }
};

const logo = document.querySelector('#svglogo');

logo.addEventListener('mouseenter', () => {
    changeLogo();
});

logo.addEventListener('mouseleave', () => {
    setTimeout(() => {reverseLogo()}, 300);
});


/**
 * animate the services logo
 */

// let animateServicesSvg = function() {
//
//     const circles = document.querySelectorAll('circle');
//
//     const digital  = circles[0];
//     const brand = circles[1];
//
//     let digitalStyler = svg(digital);
//     let brandStyle = svg(brand);
//
//     delay(1000).start({
//         complete: () => {
//             tween({
//                 from: {
//                     r: 150,
//                     cx: 195
//                 },
//                 to: {
//                     r: 200,
//                     cx: 210
//                 },
//                 ease: easing.easeInOut,
//                 duration: 500,
//                 flip: 3.5,
//             }).start(digitalStyler.set);
//         }
//     });
//
//     delay(1000).start({
//         complete: () => {
//             tween({
//                 from: {
//                     r: 150,
//                     cx: 405,
//                 },
//                 to: {
//                     r: 200,
//                     cx: 430
//                 },
//                 ease: easing.easeInOut,
//                 duration: 500,
//                 flip: 3.5,
//             }).start(brandStyle.set);
//         }
//     });
//
// };
//
// let svgservices = document.querySelector('#svgservices');
// if (svgservices) {
//     console.log('animating svg...');
//     animateServicesSvg();
// }


/**
 * resize inquiry comments box as the user types in
 */

const autoresizes = document.querySelectorAll('.autoresize');
if (autoresizes) {
    for (let j = 0; j < autoresizes.length; j++) {
        new Autogrow(autoresizes[j]);
    }
}


/**
 * background animation on landing page
 */

const backgroundAnimation = function() {

    let width, height, canvas, ctx, points, target, animateHeader = true;

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width / 2, y: height / 2};

        canvas = document.getElementById('bg-animation');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // points density based on breakpoints: phone: 600px, tablet: 768px, desktop: 1200px, mega: 1600px;
        let density = 5;

        if (width >= 1600) {
            density = 20;
        } else if (width >= 1200) {
            density = 15;
        } else if (width >= 768) {
            density = 10;
        }

        // create points
        points = [];
        for (let x = 0; x < width; x = x + width / density) {
            for (let y = 0; y < height; y = y + height / density) {
                const px = x + Math.random() * width / density;
                const py = y + Math.random() * height / density;
                const p = {x: px, originX: px, y: py, originY: py};
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for (let i = 0; i < points.length; i++) {
            const closest = [];
            const p1 = points[i];
            for (let j = 0; j < points.length; j++) {
                const p2 = points[j];
                if (!(p1 === p2)) {
                    let placed = false;
                    for (let k = 0; k < 5; k++) {
                        if (!placed) {
                            if (closest[k] === undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                    for (let k = 0; k < 5; k++) {
                        if (!placed) {
                            if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for (let i in points) {
            points[i].circle = new Circle(points[i], 2 + Math.random() * 2, 'rgba(0,0,0,0.2');
        }
    }

    // Event handling
    function addListeners() {
        if (!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        let posx = 0,
            posy = 0
        ;
        if (e.pageX || e.pageY) {
            posx = e.pageX - (document.body.scrollLeft + document.documentElement.scrollLeft);
            posy = e.pageY - (document.body.scrollTop + document.documentElement.scrollTop);
        } else if (e.clientX || e.clientY) {
            posx = e.clientX;
            posy = e.clientY;
        }
        target.x = posx;
        target.y = posy;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        for (let i = 0; i < points.length; i++) {
            shiftPoint(points[i]);
        }
    }

    function animate() {

        if (animateHeader) {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < points.length; i++) {
                // detect points in range
                if (Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.6;
                    points[i].circle.active = 0.8;
                } else if (Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.4;
                    points[i].circle.active = 0.5;
                } else if (Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.15;
                    points[i].circle.active = 0.3;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1 + 1 * Math.random(), {
            x: p.originX - 50 + Math.random() * 100,
            y: p.originY - 50 + Math.random() * 100, ease: Circ.easeInOut,
            onComplete: function () {
                shiftPoint(p);
            }
        });
    }

    // Canvas manipulation
    function drawLines(p) {
        if (!p.active) return;
        for (let i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(164,164,164,' + p.active + ')';
            ctx.stroke();
        }
    }

    function Circle(pos, rad, color) {
        const _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if (!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(164,164,164,' + _this.active + ')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
};

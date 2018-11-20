import {fadeOut, forEach} from 'ditoy-js-utils';

/**
 * custom polyfills
 */

(function() {
    let lastTime = 0;
    const vendors = ['ms', 'moz', 'webkit', 'o'];
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            const currTime = new Date().getTime();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
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
    // equalize div heights
    checkResize();
};


/**
 * action after viewport was resized
 */
window.onresize = function() {
    resized = true;
};


/**
 * action before unload event (does not work on Safari)
 */
const ua = navigator.userAgent.toLowerCase();
if (ua.indexOf('safari') === -1 || ua.indexOf('chrome') >= -1) {
    window.addEventListener('beforeunload', (e) => { fadeOut(document.querySelector('.wrapper')); });
}


/**
 * menu toggle
 */

const  menu = document.getElementById('collapsible'),
    toggler = document.getElementById('toggler'),
    togglericon = document.getElementById('togglericon')
;
if (toggler) {
    // toggle the navigation UI
    const rootElement = document.getElementById('root');
    const toggleNavigation = function() {
        if (menu.classList.contains('expanded')) {
            // close nav
            menu.classList.remove('expanded');
            menu.setAttribute('aria-hidden', 'true');
            toggler.setAttribute('aria-expanded', 'false');
            togglericon.innerHTML = "▲";
        } else {
            // open nav
            menu.classList.add('expanded');
            menu.setAttribute('aria-hidden', 'false');
            toggler.setAttribute('aria-expanded', 'true');
            togglericon.innerHTML = "▼";
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
    const equalizers = document.querySelectorAll('.equalize');
    const parents = new Set();
    for (const item of equalizers) {
        parents.add(item.parentNode);
    }

    for (const parent of parents) {
        const children = parent.querySelectorAll('.equalize');
        const tallest = Math.max.apply(Math, Array.from(children).map(function(elem) {
            elem.style.minHeight = '';
            return elem.offsetHeight;
        }));

        console.log('tallest: ' + tallest);

        for (const child of children) {
            child.style.minHeight = (tallest + 1) + 'px';
        }
    }
}


/**
 * window resize event listener
 */

let resized = true,
    timeout = null
;
const checkResize = function() {
        if (resized) {
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(equalize);
            }
        }

        clearTimeout(timeout);
        timeout = setTimeout(checkResize, 50);
        resized = false;
    }
;

/**
 * youtube video url handling
 */

function youtube_parser (url) {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
}

let elements = document.querySelectorAll('[data-youtube]');
forEach(elements, (element) => {
    let youtubeId = youtube_parser(element.dataset.youtube);
    let height = Math.round(element.clientWidth / 16 * 9);
    let embed = '<iframe frameborder="0"  width="100%" height="' + height + '" ' +
        'allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen ' +
        'src="https://www.youtube.com/embed/' + encodeURI(youtubeId) + '?controls=0&rel=0">' +
        '</iframe>'
    ;
    element.innerHTML = embed;
});
import lightGallery from 'lightgallery.js'; // ATTENTION: this is actually used as window.lightGallery - the import statement is required here
import * as axios from 'axios';
const Autogrow = require('textarea-autogrow');
const Vivus = require('vivus');


/**
 * get projects json data and populate filters
 */
if (document.getElementById('projects-filterable')) {
    let projects = [];
    axios.get("/projects/index.json").then((r) => {
        projects = r.data;
        console.log(projects);
    });
}


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
    checkResize();

    try {
        selectProjects('kompetenzen', competenceList);
        // selectProjects('aufgaben', activityList, []);
    }
    catch (e) {}

    listProjects('project-list');

    window.lightGallery(document.getElementById('lightgallery'));


/*
    if (document.getElementById('animated-grid-svg')) {
        new Vivus(
            'animated-grid-svg', {
                duration: 500,
                type: 'delayed'
            }, () => {
                // gridAnimationDirection = gridAnimationDirection * -1;
                // gridAnimationForward.play(gridAnimationDirection);
            });
    }
*/
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
    const rootElement = document.getElementById('root');
    const toggleNavigation = function() {
        if (menu.classList.contains('expanded')) {
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
    const equalizers = document.querySelectorAll('.equalize');
    const parents = new Set();
    for (const item of equalizers) {
        parents.add(item.parentNode);
    }
    parents.forEach(function(parent) {
        const children = parent.querySelectorAll('.equalize');
        const tallest = Math.max.apply(Math, Array.from(children).map(function(elem) {
            elem.style.minHeight = '';
            return elem.offsetHeight;
        }));

        children.forEach(function(child) {
            child.style.minHeight = (tallest + 1) + 'px';
        });

    });
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
 * auto-resize textareas as user types in
 */

const autoresizes = document.querySelectorAll('.autoresize');
if (autoresizes) {
    for (let j = 0; j < autoresizes.length; j++) {
        new Autogrow(autoresizes[j]);
    }
}

/**
 * handle filter tags in references
 */

function selectProjects(id, originList) {
    if (document.getElementById(id)) {
        const mySellect = sellect('#' + id, {
            originList: originList,
            onInsert: function(event, item) {
                console.log(mySellect.getSelected());
                const element = document.getElementById('aufgaben');
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
            }
        });
        mySellect.init();
    }
}

function listProjects(id) {
    var options = {
        valueNames: [
            {name: 'competence', attr: 'data-competence'},
            {name: 'activity', attr: 'data-activity'}
        ]
    };

    var mylist = new List(id, options);
    console.log('List.js');
    console.log(mylist.visibleItems);

}

/**
 * hide letters in customer list where no customers available for that letter
 */

const customersList = document.querySelector('.customers');
if (!!customersList) {
    const letterLists = customersList.querySelectorAll('ul');
    if (!!letterLists) {
        letterLists.forEach((list) => {
            const items = list.querySelectorAll('li');
            if (!items.length || items.length === 1) {
                list.style.display = 'none';
            }
        });
    }
}
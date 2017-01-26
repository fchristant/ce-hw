
"use strict";

// shortcut for easier console logging

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _CustomElement() {
    return Reflect.construct(HTMLElement, [], this.__proto__.constructor);
}

;
Object.setPrototypeOf(_CustomElement.prototype, HTMLElement.prototype);
Object.setPrototypeOf(_CustomElement, HTMLElement);
var log = console.log.bind(console);

// check for native support for custom elements V1
var supportsCustomElementsV1 = 'customElements' in window;

// global helper method to log diagnostic information on screen,
// since it's not easy to check console messages on devices
function logScreen(message) {
    var d = new Date();
    var ul = document.getElementById("screen_log");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(d.toLocaleString() + ' : ' + message));
    ul.appendChild(li);
}

// catch all global unhandled error and print them on screen,
// so that errors become visible on devices without a console
window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1) {
        logScreen('Script Error: See Browser Console for Detail');
    } else {
        var message = ['Message: ' + msg, 'URL: ' + url, 'Line: ' + lineNo, 'Column: ' + columnNo, 'Error object: ' + JSON.stringify(error)].join(' - ');

        logScreen(message);
    }

    return false;
};

// helper function to dynamically load a JS script in the
// current document. Not using promises here to keep it
// simple and robust across browsers.
function loadScript(url, callback) {
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

// Let's do this...
logScreen('Start.');
logScreen('Checking native support for custom elements V1....');

// Lazy load the polyfill if necessary.
if (!supportsCustomElementsV1) {
    // no native support, load polyfill
    logScreen('Native support not available, loading polyfil...');
    loadScript('js/poly/custom-elements.min.js', function () {
        logScreen('Polyfill loaded.');
        upgrade();
    });
} else {
    // native support, carry on
    logScreen('Native support detected.');
    upgrade();
}

function upgrade() {

    // Example of a custom element class, containing
    // "reactions" (lifecycle methods) as well as custom
    // properties and event handlers
    var HelloWorld = function (_CustomElement2) {
        _inherits(HelloWorld, _CustomElement2);

        function HelloWorld(element) {
            _classCallCheck(this, HelloWorld);

            // Always call super first in constructor
            return _possibleConstructorReturn(this, (HelloWorld.__proto__ || Object.getPrototypeOf(HelloWorld)).call(this));

            // we can't do much in the constructor, really:
            // - Don’t add, remove, mutate, or access any attribute inside a constructor
            // - Don’t insert, remove, mutate, or access a child
            // source: https://webkit.org/blog/7027/introducing-custom-elements/
        }

        _createClass(HelloWorld, [{
            key: "connectedCallback",
            value: function connectedCallback() {

                // Called when the custom element is inserted into a document
                // this is a safe place to do instance-specific things like
                // setting component-level variables or event handlers

                this._logMessage('ConnectedCallback called.');

                // example of setting an inner style via JS
                // will be visible in DOM as inline style
                // in a way, this is "scoped styles", a term used in
                // several frameworks
                this.style.cursor = 'pointer';

                // example of an internal event listener
                this.addEventListener('submit', this.onSubmit);
            }
        }, {
            key: "disconnectedCallback",
            value: function disconnectedCallback() {

                // Called when the custom element is removed from the document
                // clean up any event handlers added in connectedCallback here...

                this._logMessage('DisconnectedCallback called.');
                this.removeEventListener('submit', this.onSubmit);
            }
        }, {
            key: "adoptedCallback",
            value: function adoptedCallback(oldDocument, newDocument) {

                // Called when the custom element is adopted from an old document to a new document.
                // I have no idea what this means

                this._logMessage('AdoptedCallback called.');
            }
        }, {
            key: "attributeChangedCallback",
            value: function attributeChangedCallback(attr, oldValue, newValue) {

                // Called anytime any of our watched attributes changes
                // We'll call our own custom method Render in case this happens

                this._logMessage('AttributeChangedCallback called.');
                this.render();
            }
        }, {
            key: "_logMessage",
            value: function _logMessage(message) {

                // Not part of API. Just a custom internal helper method to log component-instance specific
                // messages for the sake of diagnostics. the _methodname suggests
                // that this is a private method, but this is only a convention
                // private methods do not exist in JS classes.

                var d = new Date();
                var li = document.createElement("li");
                li.appendChild(document.createTextNode(this.getAttribute('id') + ' : ' + d.toLocaleString() + ' : ' + message));
                this.querySelector('.log').appendChild(li);
            }
        }, {
            key: "render",
            value: function render() {

                // Not part of API. A single custom render method which is called
                // whenever a watched attribute is changed. It will update part of
                // the custom element's DOM based on the latest attribute value

                this.querySelector('.name').innerHTML = this.name;
                this._logMessage('Render called.');
            }
        }, {
            key: "onSubmit",
            value: function onSubmit(e) {

                // Not part of API. A custom event handler specific to our component
                // instance. This will receive any form submit events of the instance
                // We'll read the name value from the form, and then simply do
                // this.name = value.
                // Since we have centralized our rendering, this event handler
                // does not need to know anything about HOW to render this change.

                this._logMessage('Submit handler called.');
                e.preventDefault();
                this.name = this.querySelector('.nameField').value;
            }
        }, {
            key: "name",
            get: function get() {

                // a getter for an attribute, [name] in this case
                // accessing this via element.name will always return the
                // most up-to-date value

                this._logMessage('Name getter called');
                return this.getAttribute('name');
            },
            set: function set(val) {

                // a setter for an attribute, [name] in this case
                // setting this via element.name will trigger
                // attributeChangedCallback, which will update
                // both the internal value and the DOM

                if (val) {
                    this.setAttribute('name', val);
                }
                this._logMessage('Name setter called: ' + val);
            }
        }], [{
            key: "observedAttributes",
            get: function get() {

                // The million dollar feature of the custom elements V1 API
                // in this API method, you declare the attributes to watch
                // in case any change happens to that attribute,
                // attributeChangedCallback will be called.
                // effectively, this allows for super easy synchronization
                // between the DOM and the API

                // let's watch our name attribute
                // this means that when it changed in markup or via the API,
                // the change will be detected

                return ['name'];
            }
        }]);

        return HelloWorld;
    }(_CustomElement);

    // custom element class defined, let's upgrade it...


    logScreen('Starting upgrade...');

    customElements.define('hello-world', HelloWorld);

    // do stuff with some custom elements, but only when they are
    // succesfully defined...
    customElements.whenDefined('hello-world').then(function (value) {

        logScreen('Upgrade successful!');

        logScreen('Updating name of instance 2 via JS...');

        // get handle to existing instance of hello-world in DOM and change its name
        var hw1 = document.querySelector('#hw2');

        // check out how powerful this is. the consuming code only has to set a property
        // and has no knowledge at all how to render such a change, we encapsulated
        // all of that in the custom elements code
        hw1.name = "Upgraded world (JS)!";

        logScreen('Creating instance 3 from JS...');

        // Next, we're going to create an instance of our custom elements completely from
        // JS and insert it into the DOM. This can be done from a handlebars template,
        // HTML5 template elements, or just a multiline string like below...
        var domStr = "\n      <p>Hello, <span class=\"name\">World!</span></p>\n      <form class=\"frm\" action=\"\" method=\"post\" accept-charset=\"UTF-8\">\n        <input type=\"text\" class=\"nameField\" value=\"\" />\n        <input type=\"submit\" value=\"submit\" />\n      </form>\n      <ul class=\"log\">\n        <li>DOM init</li>\n      </ul>\n    ";
        //

        // create it
        var hw2 = new HelloWorld();
        hw2.innerHTML = domStr;
        hw2.setAttribute('id', 'hw3');
        hw2.setAttribute('name', 'DOM created world!');
        document.querySelector("#instances").appendChild(hw2);
        // change a property after DOM creation to see if it reflects.
        hw2.name = "DOM created world (JS)!";

        logScreen('End.');
    }, function (reason) {
        logScreen('Upgrade failed: ' + reason);
        logScreen('End.');
    });
}
//# sourceMappingURL=main.js.map

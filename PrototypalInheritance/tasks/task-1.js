//@formatter:off
/* Task Description */
/*
* Create an object domElement, that has the following properties and methods:
  * use prototypal inheritance, without function constructors
  * method init() that gets the domElement type
    * i.e. `Object.create(domElement).init('div')`
  * property type that is the type of the domElement
    * a valid type is any non-empty string that contains only Latin letters and digits
  * property innerHTML of type string
    * gets the domElement, parsed as valid HTML
      * <type attr1="value1" attr2="value2" ...> .. content / children's.innerHTML .. </type>
  * property content of type string
    * sets the content of the element
    * works only if there are no children
  * property attributes
    * each attribute has name and value
    * a valid attribute has a non-empty string for a name that contains only Latin letters and digits or dashes (-)
  * property children
    * each child is a domElement or a string
  * property parent
    * parent is a domElement
  * method appendChild(domElement / string)
    * appends to the end of children list
  * method addAttribute(name, value)
    * throw Error if type is not valid
  * method removeAttribute(attribute)
    * throw Error if attribute does not exist in the domElement
*/


/* Example
var meta = Object.create(domElement)
	.init('meta')
	.addAttribute('charset', 'utf-8');
var head = Object.create(domElement)
	.init('head')
	.appendChild(meta)
var div = Object.create(domElement)
	.init('div')
	.addAttribute('style', 'font-size: 42px');
div.content = 'Hello, world!';
var body = Object.create(domElement)
	.init('body')
	.appendChild(div)
	.addAttribute('id', 'cuki')
	.addAttribute('bgcolor', '#012345');
var root = Object.create(domElement)
	.init('html')
	.appendChild(head)
	.appendChild(body);
console.log(root.innerHTML);
Outputs:
<html><head><meta charset="utf-8"></meta></head><body bgcolor="#012345" id="cuki"><div style="font-size: 42px">Hello, world!</div></body></html>
*/
//@formatter:on

function solve() {
    var domElement = (function () {

        function getSortedAttributes(attributes) {
            return Object.keys(attributes).sort().reduce(function (prev, currentKey) {
                return prev + ' ' + currentKey + '="' + attributes[currentKey] + '"';
            }, '');
        }

        var domElement = {
            init: function (type) {
                this.type = type;
                this.children = [];
                this.attributes = {};

                return this;
            },

            appendChild: function (child) {
                switch (true) {
                    case domElement.isPrototypeOf(child):
                        child.parent = this;
                        // Intentional Fallthrough !
                    case typeof child === 'string':
                        this.children.push(child);
                        break;
                    default:
                        throw new TypeError('child must be a string or a domElement');
                }

                return this;
            },

            addAttribute: function (name, value) {
                if (typeof name !== 'string' || !/^(?:\w|-)+$/.test(name)) {
                    throw new Error('attribute name must be a non-empty string containing only Latin letters and digits or dashes (-)')
                }

                this.attributes[name] = value;

                return this;
            },

            removeAttribute: function(name) {
                if (this.attributes.hasOwnProperty(name)) {
                    delete this.attributes[name];
                    return this;
                } else {
                    throw new Error('attribute name: ' + name + ' does not exist');
                }
            },

            get innerHTML() {
                var i,
                    len,
                    child,
                    innerHtml,
                    attributesString = getSortedAttributes(this.attributes);

                innerHtml = '<' + this.type + attributesString + '>';

                for (i = 0, len = this.children.length; i < len; i += 1) {
                    child = this.children[i];

                    if (typeof child === 'string') {
                        innerHtml += child;
                    } else {
                        innerHtml += child.innerHTML;
                    }
                }

                innerHtml += this.content;
                innerHtml += '</' + this.type + '>';

                return innerHtml;
            },

            get type() {
                return this._type;
            },

            set type(value) {
                if (typeof value !== 'string' || !/^\w+$/.test(value)) {
                    throw new Error('type must be an non-empty string that contains only Latin letters and digits')
                }

                this._type = value;
            },

            get content() {
                if (this.children.length || this._content == null) {
                    return '';
                }

                return this._content;
            },

            set content(value) {
                if (typeof value !== 'string') {
                    throw new TypeError('content must be a string');
                }

                this._content = value;
            },

            get attributes() {
                return this._attributes;
            },

            set attributes(value) {
                this._attributes = value;
            },

            get children() {
                return this._children;
            },

            set children(value) {
                this._children = value;
            },

            get parent() {
                return this._parent;
            },

            set parent(value) {
                this._parent = value;
            }
        };

        return domElement;
    }());

    return domElement;
}

module.exports = solve;
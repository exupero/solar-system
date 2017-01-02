if(typeof Math.imul == "undefined" || (Math.imul(0xffffffff,5) == 0)) {
    Math.imul = function (a, b) {
        var ah  = (a >>> 16) & 0xffff;
        var al = a & 0xffff;
        var bh  = (b >>> 16) & 0xffff;
        var bl = b & 0xffff;
        // the shift by 0 fixes the sign on the high part
        // the final |0 converts the unsigned value into a signed value
        return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
    }
}

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":13}],3:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":36}],4:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],5:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":7}],6:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":6}],8:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],9:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],10:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],11:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":16}],12:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":27,"is-object":9}],13:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":25,"../vnode/is-vnode.js":28,"../vnode/is-vtext.js":29,"../vnode/is-widget.js":30,"./apply-properties":12,"global/document":8}],14:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],15:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var render = require("./create-element")
var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":30,"../vnode/vpatch.js":33,"./apply-properties":12,"./create-element":13,"./update-widget":17}],16:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches) {
    return patchRecursive(rootNode, patches)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions) {
        renderOptions = { patch: patchRecursive }
        if (ownerDocument !== document) {
            renderOptions.document = ownerDocument
        }
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./dom-index":14,"./patch-op":15,"global/document":8,"x-is-array":10}],17:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":30}],18:[function(require,module,exports){
'use strict';

module.exports = AttributeHook;

function AttributeHook(namespace, value) {
    if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value);
    }

    this.namespace = namespace;
    this.value = value;
}

AttributeHook.prototype.hook = function (node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
        prev.value === this.value &&
        prev.namespace === this.namespace) {
        return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
};

AttributeHook.prototype.unhook = function (node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
        next.namespace === this.namespace) {
        return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
};

AttributeHook.prototype.type = 'AttributeHook';

},{}],19:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":5}],20:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],21:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":26,"../vnode/is-vhook":27,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vnode.js":32,"../vnode/vtext.js":34,"./hooks/ev-hook.js":19,"./hooks/soft-set-hook.js":20,"./parse-tag.js":22,"x-is-array":10}],22:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":4}],23:[function(require,module,exports){
'use strict';

var DEFAULT_NAMESPACE = null;
var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

// http://www.w3.org/TR/SVGTiny12/attributeTable.html
// http://www.w3.org/TR/SVG/attindex.html
var SVG_PROPERTIES = {
    'about': DEFAULT_NAMESPACE,
    'accent-height': DEFAULT_NAMESPACE,
    'accumulate': DEFAULT_NAMESPACE,
    'additive': DEFAULT_NAMESPACE,
    'alignment-baseline': DEFAULT_NAMESPACE,
    'alphabetic': DEFAULT_NAMESPACE,
    'amplitude': DEFAULT_NAMESPACE,
    'arabic-form': DEFAULT_NAMESPACE,
    'ascent': DEFAULT_NAMESPACE,
    'attributeName': DEFAULT_NAMESPACE,
    'attributeType': DEFAULT_NAMESPACE,
    'azimuth': DEFAULT_NAMESPACE,
    'bandwidth': DEFAULT_NAMESPACE,
    'baseFrequency': DEFAULT_NAMESPACE,
    'baseProfile': DEFAULT_NAMESPACE,
    'baseline-shift': DEFAULT_NAMESPACE,
    'bbox': DEFAULT_NAMESPACE,
    'begin': DEFAULT_NAMESPACE,
    'bias': DEFAULT_NAMESPACE,
    'by': DEFAULT_NAMESPACE,
    'calcMode': DEFAULT_NAMESPACE,
    'cap-height': DEFAULT_NAMESPACE,
    'class': DEFAULT_NAMESPACE,
    'clip': DEFAULT_NAMESPACE,
    'clip-path': DEFAULT_NAMESPACE,
    'clip-rule': DEFAULT_NAMESPACE,
    'clipPathUnits': DEFAULT_NAMESPACE,
    'color': DEFAULT_NAMESPACE,
    'color-interpolation': DEFAULT_NAMESPACE,
    'color-interpolation-filters': DEFAULT_NAMESPACE,
    'color-profile': DEFAULT_NAMESPACE,
    'color-rendering': DEFAULT_NAMESPACE,
    'content': DEFAULT_NAMESPACE,
    'contentScriptType': DEFAULT_NAMESPACE,
    'contentStyleType': DEFAULT_NAMESPACE,
    'cursor': DEFAULT_NAMESPACE,
    'cx': DEFAULT_NAMESPACE,
    'cy': DEFAULT_NAMESPACE,
    'd': DEFAULT_NAMESPACE,
    'datatype': DEFAULT_NAMESPACE,
    'defaultAction': DEFAULT_NAMESPACE,
    'descent': DEFAULT_NAMESPACE,
    'diffuseConstant': DEFAULT_NAMESPACE,
    'direction': DEFAULT_NAMESPACE,
    'display': DEFAULT_NAMESPACE,
    'divisor': DEFAULT_NAMESPACE,
    'dominant-baseline': DEFAULT_NAMESPACE,
    'dur': DEFAULT_NAMESPACE,
    'dx': DEFAULT_NAMESPACE,
    'dy': DEFAULT_NAMESPACE,
    'edgeMode': DEFAULT_NAMESPACE,
    'editable': DEFAULT_NAMESPACE,
    'elevation': DEFAULT_NAMESPACE,
    'enable-background': DEFAULT_NAMESPACE,
    'end': DEFAULT_NAMESPACE,
    'ev:event': EV_NAMESPACE,
    'event': DEFAULT_NAMESPACE,
    'exponent': DEFAULT_NAMESPACE,
    'externalResourcesRequired': DEFAULT_NAMESPACE,
    'fill': DEFAULT_NAMESPACE,
    'fill-opacity': DEFAULT_NAMESPACE,
    'fill-rule': DEFAULT_NAMESPACE,
    'filter': DEFAULT_NAMESPACE,
    'filterRes': DEFAULT_NAMESPACE,
    'filterUnits': DEFAULT_NAMESPACE,
    'flood-color': DEFAULT_NAMESPACE,
    'flood-opacity': DEFAULT_NAMESPACE,
    'focusHighlight': DEFAULT_NAMESPACE,
    'focusable': DEFAULT_NAMESPACE,
    'font-family': DEFAULT_NAMESPACE,
    'font-size': DEFAULT_NAMESPACE,
    'font-size-adjust': DEFAULT_NAMESPACE,
    'font-stretch': DEFAULT_NAMESPACE,
    'font-style': DEFAULT_NAMESPACE,
    'font-variant': DEFAULT_NAMESPACE,
    'font-weight': DEFAULT_NAMESPACE,
    'format': DEFAULT_NAMESPACE,
    'from': DEFAULT_NAMESPACE,
    'fx': DEFAULT_NAMESPACE,
    'fy': DEFAULT_NAMESPACE,
    'g1': DEFAULT_NAMESPACE,
    'g2': DEFAULT_NAMESPACE,
    'glyph-name': DEFAULT_NAMESPACE,
    'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
    'glyph-orientation-vertical': DEFAULT_NAMESPACE,
    'glyphRef': DEFAULT_NAMESPACE,
    'gradientTransform': DEFAULT_NAMESPACE,
    'gradientUnits': DEFAULT_NAMESPACE,
    'handler': DEFAULT_NAMESPACE,
    'hanging': DEFAULT_NAMESPACE,
    'height': DEFAULT_NAMESPACE,
    'horiz-adv-x': DEFAULT_NAMESPACE,
    'horiz-origin-x': DEFAULT_NAMESPACE,
    'horiz-origin-y': DEFAULT_NAMESPACE,
    'id': DEFAULT_NAMESPACE,
    'ideographic': DEFAULT_NAMESPACE,
    'image-rendering': DEFAULT_NAMESPACE,
    'in': DEFAULT_NAMESPACE,
    'in2': DEFAULT_NAMESPACE,
    'initialVisibility': DEFAULT_NAMESPACE,
    'intercept': DEFAULT_NAMESPACE,
    'k': DEFAULT_NAMESPACE,
    'k1': DEFAULT_NAMESPACE,
    'k2': DEFAULT_NAMESPACE,
    'k3': DEFAULT_NAMESPACE,
    'k4': DEFAULT_NAMESPACE,
    'kernelMatrix': DEFAULT_NAMESPACE,
    'kernelUnitLength': DEFAULT_NAMESPACE,
    'kerning': DEFAULT_NAMESPACE,
    'keyPoints': DEFAULT_NAMESPACE,
    'keySplines': DEFAULT_NAMESPACE,
    'keyTimes': DEFAULT_NAMESPACE,
    'lang': DEFAULT_NAMESPACE,
    'lengthAdjust': DEFAULT_NAMESPACE,
    'letter-spacing': DEFAULT_NAMESPACE,
    'lighting-color': DEFAULT_NAMESPACE,
    'limitingConeAngle': DEFAULT_NAMESPACE,
    'local': DEFAULT_NAMESPACE,
    'marker-end': DEFAULT_NAMESPACE,
    'marker-mid': DEFAULT_NAMESPACE,
    'marker-start': DEFAULT_NAMESPACE,
    'markerHeight': DEFAULT_NAMESPACE,
    'markerUnits': DEFAULT_NAMESPACE,
    'markerWidth': DEFAULT_NAMESPACE,
    'mask': DEFAULT_NAMESPACE,
    'maskContentUnits': DEFAULT_NAMESPACE,
    'maskUnits': DEFAULT_NAMESPACE,
    'mathematical': DEFAULT_NAMESPACE,
    'max': DEFAULT_NAMESPACE,
    'media': DEFAULT_NAMESPACE,
    'mediaCharacterEncoding': DEFAULT_NAMESPACE,
    'mediaContentEncodings': DEFAULT_NAMESPACE,
    'mediaSize': DEFAULT_NAMESPACE,
    'mediaTime': DEFAULT_NAMESPACE,
    'method': DEFAULT_NAMESPACE,
    'min': DEFAULT_NAMESPACE,
    'mode': DEFAULT_NAMESPACE,
    'name': DEFAULT_NAMESPACE,
    'nav-down': DEFAULT_NAMESPACE,
    'nav-down-left': DEFAULT_NAMESPACE,
    'nav-down-right': DEFAULT_NAMESPACE,
    'nav-left': DEFAULT_NAMESPACE,
    'nav-next': DEFAULT_NAMESPACE,
    'nav-prev': DEFAULT_NAMESPACE,
    'nav-right': DEFAULT_NAMESPACE,
    'nav-up': DEFAULT_NAMESPACE,
    'nav-up-left': DEFAULT_NAMESPACE,
    'nav-up-right': DEFAULT_NAMESPACE,
    'numOctaves': DEFAULT_NAMESPACE,
    'observer': DEFAULT_NAMESPACE,
    'offset': DEFAULT_NAMESPACE,
    'opacity': DEFAULT_NAMESPACE,
    'operator': DEFAULT_NAMESPACE,
    'order': DEFAULT_NAMESPACE,
    'orient': DEFAULT_NAMESPACE,
    'orientation': DEFAULT_NAMESPACE,
    'origin': DEFAULT_NAMESPACE,
    'overflow': DEFAULT_NAMESPACE,
    'overlay': DEFAULT_NAMESPACE,
    'overline-position': DEFAULT_NAMESPACE,
    'overline-thickness': DEFAULT_NAMESPACE,
    'panose-1': DEFAULT_NAMESPACE,
    'path': DEFAULT_NAMESPACE,
    'pathLength': DEFAULT_NAMESPACE,
    'patternContentUnits': DEFAULT_NAMESPACE,
    'patternTransform': DEFAULT_NAMESPACE,
    'patternUnits': DEFAULT_NAMESPACE,
    'phase': DEFAULT_NAMESPACE,
    'playbackOrder': DEFAULT_NAMESPACE,
    'pointer-events': DEFAULT_NAMESPACE,
    'points': DEFAULT_NAMESPACE,
    'pointsAtX': DEFAULT_NAMESPACE,
    'pointsAtY': DEFAULT_NAMESPACE,
    'pointsAtZ': DEFAULT_NAMESPACE,
    'preserveAlpha': DEFAULT_NAMESPACE,
    'preserveAspectRatio': DEFAULT_NAMESPACE,
    'primitiveUnits': DEFAULT_NAMESPACE,
    'propagate': DEFAULT_NAMESPACE,
    'property': DEFAULT_NAMESPACE,
    'r': DEFAULT_NAMESPACE,
    'radius': DEFAULT_NAMESPACE,
    'refX': DEFAULT_NAMESPACE,
    'refY': DEFAULT_NAMESPACE,
    'rel': DEFAULT_NAMESPACE,
    'rendering-intent': DEFAULT_NAMESPACE,
    'repeatCount': DEFAULT_NAMESPACE,
    'repeatDur': DEFAULT_NAMESPACE,
    'requiredExtensions': DEFAULT_NAMESPACE,
    'requiredFeatures': DEFAULT_NAMESPACE,
    'requiredFonts': DEFAULT_NAMESPACE,
    'requiredFormats': DEFAULT_NAMESPACE,
    'resource': DEFAULT_NAMESPACE,
    'restart': DEFAULT_NAMESPACE,
    'result': DEFAULT_NAMESPACE,
    'rev': DEFAULT_NAMESPACE,
    'role': DEFAULT_NAMESPACE,
    'rotate': DEFAULT_NAMESPACE,
    'rx': DEFAULT_NAMESPACE,
    'ry': DEFAULT_NAMESPACE,
    'scale': DEFAULT_NAMESPACE,
    'seed': DEFAULT_NAMESPACE,
    'shape-rendering': DEFAULT_NAMESPACE,
    'slope': DEFAULT_NAMESPACE,
    'snapshotTime': DEFAULT_NAMESPACE,
    'spacing': DEFAULT_NAMESPACE,
    'specularConstant': DEFAULT_NAMESPACE,
    'specularExponent': DEFAULT_NAMESPACE,
    'spreadMethod': DEFAULT_NAMESPACE,
    'startOffset': DEFAULT_NAMESPACE,
    'stdDeviation': DEFAULT_NAMESPACE,
    'stemh': DEFAULT_NAMESPACE,
    'stemv': DEFAULT_NAMESPACE,
    'stitchTiles': DEFAULT_NAMESPACE,
    'stop-color': DEFAULT_NAMESPACE,
    'stop-opacity': DEFAULT_NAMESPACE,
    'strikethrough-position': DEFAULT_NAMESPACE,
    'strikethrough-thickness': DEFAULT_NAMESPACE,
    'string': DEFAULT_NAMESPACE,
    'stroke': DEFAULT_NAMESPACE,
    'stroke-dasharray': DEFAULT_NAMESPACE,
    'stroke-dashoffset': DEFAULT_NAMESPACE,
    'stroke-linecap': DEFAULT_NAMESPACE,
    'stroke-linejoin': DEFAULT_NAMESPACE,
    'stroke-miterlimit': DEFAULT_NAMESPACE,
    'stroke-opacity': DEFAULT_NAMESPACE,
    'stroke-width': DEFAULT_NAMESPACE,
    'surfaceScale': DEFAULT_NAMESPACE,
    'syncBehavior': DEFAULT_NAMESPACE,
    'syncBehaviorDefault': DEFAULT_NAMESPACE,
    'syncMaster': DEFAULT_NAMESPACE,
    'syncTolerance': DEFAULT_NAMESPACE,
    'syncToleranceDefault': DEFAULT_NAMESPACE,
    'systemLanguage': DEFAULT_NAMESPACE,
    'tableValues': DEFAULT_NAMESPACE,
    'target': DEFAULT_NAMESPACE,
    'targetX': DEFAULT_NAMESPACE,
    'targetY': DEFAULT_NAMESPACE,
    'text-anchor': DEFAULT_NAMESPACE,
    'text-decoration': DEFAULT_NAMESPACE,
    'text-rendering': DEFAULT_NAMESPACE,
    'textLength': DEFAULT_NAMESPACE,
    'timelineBegin': DEFAULT_NAMESPACE,
    'title': DEFAULT_NAMESPACE,
    'to': DEFAULT_NAMESPACE,
    'transform': DEFAULT_NAMESPACE,
    'transformBehavior': DEFAULT_NAMESPACE,
    'type': DEFAULT_NAMESPACE,
    'typeof': DEFAULT_NAMESPACE,
    'u1': DEFAULT_NAMESPACE,
    'u2': DEFAULT_NAMESPACE,
    'underline-position': DEFAULT_NAMESPACE,
    'underline-thickness': DEFAULT_NAMESPACE,
    'unicode': DEFAULT_NAMESPACE,
    'unicode-bidi': DEFAULT_NAMESPACE,
    'unicode-range': DEFAULT_NAMESPACE,
    'units-per-em': DEFAULT_NAMESPACE,
    'v-alphabetic': DEFAULT_NAMESPACE,
    'v-hanging': DEFAULT_NAMESPACE,
    'v-ideographic': DEFAULT_NAMESPACE,
    'v-mathematical': DEFAULT_NAMESPACE,
    'values': DEFAULT_NAMESPACE,
    'version': DEFAULT_NAMESPACE,
    'vert-adv-y': DEFAULT_NAMESPACE,
    'vert-origin-x': DEFAULT_NAMESPACE,
    'vert-origin-y': DEFAULT_NAMESPACE,
    'viewBox': DEFAULT_NAMESPACE,
    'viewTarget': DEFAULT_NAMESPACE,
    'visibility': DEFAULT_NAMESPACE,
    'width': DEFAULT_NAMESPACE,
    'widths': DEFAULT_NAMESPACE,
    'word-spacing': DEFAULT_NAMESPACE,
    'writing-mode': DEFAULT_NAMESPACE,
    'x': DEFAULT_NAMESPACE,
    'x-height': DEFAULT_NAMESPACE,
    'x1': DEFAULT_NAMESPACE,
    'x2': DEFAULT_NAMESPACE,
    'xChannelSelector': DEFAULT_NAMESPACE,
    'xlink:actuate': XLINK_NAMESPACE,
    'xlink:arcrole': XLINK_NAMESPACE,
    'xlink:href': XLINK_NAMESPACE,
    'xlink:role': XLINK_NAMESPACE,
    'xlink:show': XLINK_NAMESPACE,
    'xlink:title': XLINK_NAMESPACE,
    'xlink:type': XLINK_NAMESPACE,
    'xml:base': XML_NAMESPACE,
    'xml:id': XML_NAMESPACE,
    'xml:lang': XML_NAMESPACE,
    'xml:space': XML_NAMESPACE,
    'y': DEFAULT_NAMESPACE,
    'y1': DEFAULT_NAMESPACE,
    'y2': DEFAULT_NAMESPACE,
    'yChannelSelector': DEFAULT_NAMESPACE,
    'z': DEFAULT_NAMESPACE,
    'zoomAndPan': DEFAULT_NAMESPACE
};

module.exports = SVGAttributeNamespace;

function SVGAttributeNamespace(value) {
  if (SVG_PROPERTIES.hasOwnProperty(value)) {
    return SVG_PROPERTIES[value];
  }
}

},{}],24:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var h = require('./index.js');


var SVGAttributeNamespace = require('./svg-attribute-namespace');
var attributeHook = require('./hooks/attribute-hook');

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

module.exports = svg;

function svg(tagName, properties, children) {
    if (!children && isChildren(properties)) {
        children = properties;
        properties = {};
    }

    properties = properties || {};

    // set namespace for svg
    properties.namespace = SVG_NAMESPACE;

    var attributes = properties.attributes || (properties.attributes = {});

    for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
            continue;
        }

        var namespace = SVGAttributeNamespace(key);

        if (namespace === undefined) { // not a svg attribute
            continue;
        }

        var value = properties[key];

        if (typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
        ) {
            continue;
        }

        if (namespace !== null) { // namespaced attribute
            properties[key] = attributeHook(namespace, value);
            continue;
        }

        attributes[key] = value
        properties[key] = undefined
    }

    return h(tagName, properties, children);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x);
}

},{"./hooks/attribute-hook":18,"./index.js":21,"./svg-attribute-namespace":23,"x-is-array":10}],25:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":26,"./is-vnode":28,"./is-vtext":29,"./is-widget":30}],26:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],27:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],28:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":31}],29:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":31}],30:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],31:[function(require,module,exports){
module.exports = "2"

},{}],32:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":26,"./is-vhook":27,"./is-vnode":28,"./is-widget":30,"./version":31}],33:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":31}],34:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":31}],35:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":27,"is-object":9}],36:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free,     // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":25,"../vnode/is-thunk":26,"../vnode/is-vnode":28,"../vnode/is-vtext":29,"../vnode/is-widget":30,"../vnode/vpatch":33,"./diff-props":35,"x-is-array":10}],37:[function(require,module,exports){
return VDOM = {
  diff: require("virtual-dom/diff"),
  patch: require("virtual-dom/patch"),
  create: require("virtual-dom/create-element"),
  VHtml: require("virtual-dom/vnode/vnode"),
  VText: require("virtual-dom/vnode/vtext"),
  VSvg: require("virtual-dom/virtual-hyperscript/svg")
}

},{"virtual-dom/create-element":2,"virtual-dom/diff":3,"virtual-dom/patch":11,"virtual-dom/virtual-hyperscript/svg":24,"virtual-dom/vnode/vnode":32,"virtual-dom/vnode/vtext":34}]},{},[37]);

var g,ba=ba||{},ea=this;function fa(){}
function t(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b}function ga(a){var b=t(a);return"array"==b||"object"==b&&"number"==typeof a.length}function ia(a){return"string"==typeof a}function ka(a){return"function"==t(a)}function la(a){return a[na]||(a[na]=++oa)}var na="closure_uid_"+(1E9*Math.random()>>>0),oa=0;function pa(a,b,c){return a.call.apply(a.bind,arguments)}
function ra(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function ua(a,b,c){ua=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?pa:ra;return ua.apply(null,arguments)}var va=Date.now||function(){return+new Date};
function wa(a,b){function c(){}c.prototype=b.prototype;a.fc=b.prototype;a.prototype=new c;a.prototype.constructor=a;a.Tb=function(a,c,f){for(var h=Array(arguments.length-2),k=2;k<arguments.length;k++)h[k-2]=arguments[k];return b.prototype[c].apply(a,h)}};function xa(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")}var ya=String.prototype.trim?function(a){return a.trim()}:function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};function za(a,b){return a<b?-1:a>b?1:0};function Aa(a,b){for(var c in a)b.call(void 0,a[c],c,a)}function Ca(a,b){for(var c in a)if(b.call(void 0,a[c],c,a))return!0;return!1}function Da(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b}function Ea(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b}var Fa="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function Ga(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<Fa.length;f++)c=Fa[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}}function Ha(a){var b=arguments.length;if(1==b&&"array"==t(arguments[0]))return Ha.apply(null,arguments[0]);for(var c={},d=0;d<b;d++)c[arguments[d]]=!0;return c};function Ia(a,b){null!=a&&this.append.apply(this,arguments)}g=Ia.prototype;g.Ua="";g.set=function(a){this.Ua=""+a};g.append=function(a,b,c){this.Ua+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.Ua+=arguments[d];return this};g.clear=function(){this.Ua=""};g.toString=function(){return this.Ua};function Ja(a){if(Error.captureStackTrace)Error.captureStackTrace(this,Ja);else{var b=Error().stack;b&&(this.stack=b)}a&&(this.message=String(a))}wa(Ja,Error);Ja.prototype.name="CustomError";function La(a,b){b.unshift(a);Ja.call(this,xa.apply(null,b));b.shift()}wa(La,Ja);La.prototype.name="AssertionError";function Ma(a,b){throw new La("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));};var Na=Array.prototype,Oa=Na.indexOf?function(a,b,c){return Na.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(ia(a))return ia(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1},Ra=Na.forEach?function(a,b,c){Na.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=ia(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)};
function Sa(a){var b;a:{b=Ta;for(var c=a.length,d=ia(a)?a.split(""):a,e=0;e<c;e++)if(e in d&&b.call(void 0,d[e],e,a)){b=e;break a}b=-1}return 0>b?null:ia(a)?a.charAt(b):a[b]}function Ua(a,b){var c=Oa(a,b),d;(d=0<=c)&&Na.splice.call(a,c,1);return d}function Va(a,b){return a>b?1:a<b?-1:0};var Wa;if("undefined"===typeof Ya)var Ya=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof Za)var Za=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var $a=null;if("undefined"===typeof ab)var ab=null;function bb(){return new v(null,5,[cb,!0,db,!0,fb,!1,gb,!1,hb,null],null)}ib;function y(a){return null!=a&&!1!==a}kb;A;function lb(a){return null==a}function mb(a){return a instanceof Array}
function nb(a){return null==a?!0:!1===a?!0:!1}function C(a,b){return a[t(null==b?null:b)]?!0:a._?!0:!1}function D(a,b){var c=null==b?null:b.constructor,c=y(y(c)?c.uc:c)?c.Eb:t(b);return Error(["No protocol method ",a," defined for type ",c,": ",b].join(""))}function ob(a){var b=a.Eb;return y(b)?b:""+F(a)}var pb="undefined"!==typeof Symbol&&"function"===t(Symbol)?Symbol.iterator:"@@iterator";function qb(a){for(var b=a.length,c=Array(b),d=0;;)if(d<b)c[d]=a[d],d+=1;else break;return c}G;rb;
var ib=function ib(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ib.a(arguments[0]);case 2:return ib.b(arguments[0],arguments[1]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};ib.a=function(a){return ib.b(null,a)};ib.b=function(a,b){function c(a,b){a.push(b);return a}var d=[];return rb.c?rb.c(c,d,b):rb.call(null,c,d,b)};ib.w=2;function sb(){}
var tb=function tb(b){if(null!=b&&null!=b.aa)return b.aa(b);var c=tb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=tb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("ICounted.-count",b);},ub=function ub(b){if(null!=b&&null!=b.Y)return b.Y(b);var c=ub[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ub._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IEmptyableCollection.-empty",b);};function vb(){}
var wb=function wb(b,c){if(null!=b&&null!=b.V)return b.V(b,c);var d=wb[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=wb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw D("ICollection.-conj",b);};function yb(){}
var H=function H(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return H.b(arguments[0],arguments[1]);case 3:return H.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};
H.b=function(a,b){if(null!=a&&null!=a.X)return a.X(a,b);var c=H[t(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=H._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw D("IIndexed.-nth",a);};H.c=function(a,b,c){if(null!=a&&null!=a.Ca)return a.Ca(a,b,c);var d=H[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=H._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw D("IIndexed.-nth",a);};H.w=3;function zb(){}
var Ab=function Ab(b){if(null!=b&&null!=b.$)return b.$(b);var c=Ab[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ab._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("ISeq.-first",b);},Bb=function Bb(b){if(null!=b&&null!=b.ra)return b.ra(b);var c=Bb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Bb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("ISeq.-rest",b);};function Cb(){}function Db(){}
var Eb=function Eb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Eb.b(arguments[0],arguments[1]);case 3:return Eb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};
Eb.b=function(a,b){if(null!=a&&null!=a.M)return a.M(a,b);var c=Eb[t(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=Eb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw D("ILookup.-lookup",a);};Eb.c=function(a,b,c){if(null!=a&&null!=a.H)return a.H(a,b,c);var d=Eb[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Eb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw D("ILookup.-lookup",a);};Eb.w=3;
var Fb=function Fb(b,c){if(null!=b&&null!=b.oc)return b.oc(b,c);var d=Fb[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Fb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw D("IAssociative.-contains-key?",b);},Gb=function Gb(b,c,d){if(null!=b&&null!=b.$a)return b.$a(b,c,d);var e=Gb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Gb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw D("IAssociative.-assoc",b);};function Hb(){}
var Ib=function Ib(b,c){if(null!=b&&null!=b.tc)return b.tc(b,c);var d=Ib[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Ib._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw D("IMap.-dissoc",b);};function Jb(){}
var Kb=function Kb(b){if(null!=b&&null!=b.zb)return b.zb(b);var c=Kb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Kb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IMapEntry.-key",b);},Lb=function Lb(b){if(null!=b&&null!=b.Ab)return b.Ab(b);var c=Lb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Lb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IMapEntry.-val",b);};function Mb(){}
var Nb=function Nb(b){if(null!=b&&null!=b.Wa)return b.Wa(b);var c=Nb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Nb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IStack.-peek",b);},Ob=function Ob(b){if(null!=b&&null!=b.Xa)return b.Xa(b);var c=Ob[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ob._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IStack.-pop",b);};function Pb(){}
var Qb=function Qb(b,c,d){if(null!=b&&null!=b.cb)return b.cb(b,c,d);var e=Qb[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=Qb._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw D("IVector.-assoc-n",b);},Rb=function Rb(b){if(null!=b&&null!=b.Wb)return b.Wb(b);var c=Rb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Rb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IDeref.-deref",b);};function Sb(){}
var Tb=function Tb(b){if(null!=b&&null!=b.P)return b.P(b);var c=Tb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Tb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IMeta.-meta",b);};function Ub(){}var Vb=function Vb(b,c){if(null!=b&&null!=b.S)return b.S(b,c);var d=Vb[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Vb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw D("IWithMeta.-with-meta",b);};function Wb(){}
var Xb=function Xb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Xb.b(arguments[0],arguments[1]);case 3:return Xb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};
Xb.b=function(a,b){if(null!=a&&null!=a.ba)return a.ba(a,b);var c=Xb[t(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=Xb._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw D("IReduce.-reduce",a);};Xb.c=function(a,b,c){if(null!=a&&null!=a.ca)return a.ca(a,b,c);var d=Xb[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=Xb._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw D("IReduce.-reduce",a);};Xb.w=3;
var Yb=function Yb(b,c){if(null!=b&&null!=b.A)return b.A(b,c);var d=Yb[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=Yb._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw D("IEquiv.-equiv",b);},Zb=function Zb(b){if(null!=b&&null!=b.N)return b.N(b);var c=Zb[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Zb._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IHash.-hash",b);};function $b(){}
var ac=function ac(b){if(null!=b&&null!=b.U)return b.U(b);var c=ac[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ac._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("ISeqable.-seq",b);};function bc(){}function cc(){}function dc(){}
var ec=function ec(b){if(null!=b&&null!=b.Yb)return b.Yb(b);var c=ec[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=ec._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IReversible.-rseq",b);},fc=function fc(b,c){if(null!=b&&null!=b.Ic)return b.Ic(0,c);var d=fc[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=fc._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw D("IWriter.-write",b);},gc=function gc(b,c,d){if(null!=b&&null!=b.K)return b.K(b,c,d);var e=
gc[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=gc._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw D("IPrintWithWriter.-pr-writer",b);},jc=function jc(b,c,d){if(null!=b&&null!=b.Hc)return b.Hc(0,c,d);var e=jc[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=jc._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw D("IWatchable.-notify-watches",b);},kc=function kc(b,c,d){if(null!=b&&null!=b.Gc)return b.Gc(0,c,d);var e=kc[t(null==
b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=kc._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw D("IWatchable.-add-watch",b);},lc=function lc(b){if(null!=b&&null!=b.lb)return b.lb(b);var c=lc[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=lc._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IEditableCollection.-as-transient",b);},mc=function mc(b,c){if(null!=b&&null!=b.bb)return b.bb(b,c);var d=mc[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,
c):d.call(null,b,c);d=mc._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw D("ITransientCollection.-conj!",b);},nc=function nc(b){if(null!=b&&null!=b.mb)return b.mb(b);var c=nc[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=nc._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("ITransientCollection.-persistent!",b);},oc=function oc(b,c,d){if(null!=b&&null!=b.Db)return b.Db(b,c,d);var e=oc[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=oc._;if(null!=
e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw D("ITransientAssociative.-assoc!",b);},pc=function pc(b,c,d){if(null!=b&&null!=b.Fc)return b.Fc(0,c,d);var e=pc[t(null==b?null:b)];if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);e=pc._;if(null!=e)return e.c?e.c(b,c,d):e.call(null,b,c,d);throw D("ITransientVector.-assoc-n!",b);};function qc(){}
var rc=function rc(b,c){if(null!=b&&null!=b.ab)return b.ab(b,c);var d=rc[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=rc._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw D("IComparable.-compare",b);},sc=function sc(b){if(null!=b&&null!=b.Dc)return b.Dc();var c=sc[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=sc._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IChunk.-drop-first",b);},tc=function tc(b){if(null!=b&&null!=b.qc)return b.qc(b);var c=
tc[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=tc._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IChunkedSeq.-chunked-first",b);},uc=function uc(b){if(null!=b&&null!=b.rc)return b.rc(b);var c=uc[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=uc._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IChunkedSeq.-chunked-rest",b);},vc=function vc(b){if(null!=b&&null!=b.pc)return b.pc(b);var c=vc[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,
b);c=vc._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IChunkedNext.-chunked-next",b);},wc=function wc(b){if(null!=b&&null!=b.Bb)return b.Bb(b);var c=wc[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=wc._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("INamed.-name",b);},xc=function xc(b){if(null!=b&&null!=b.Cb)return b.Cb(b);var c=xc[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=xc._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("INamed.-namespace",
b);},yc=function yc(b,c){if(null!=b&&null!=b.jd)return b.jd(b,c);var d=yc[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=yc._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw D("IReset.-reset!",b);},zc=function zc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return zc.b(arguments[0],arguments[1]);case 3:return zc.c(arguments[0],arguments[1],arguments[2]);case 4:return zc.m(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return zc.D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};zc.b=function(a,b){if(null!=a&&null!=a.ld)return a.ld(a,b);var c=zc[t(null==a?null:a)];if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);c=zc._;if(null!=c)return c.b?c.b(a,b):c.call(null,a,b);throw D("ISwap.-swap!",a);};
zc.c=function(a,b,c){if(null!=a&&null!=a.md)return a.md(a,b,c);var d=zc[t(null==a?null:a)];if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);d=zc._;if(null!=d)return d.c?d.c(a,b,c):d.call(null,a,b,c);throw D("ISwap.-swap!",a);};zc.m=function(a,b,c,d){if(null!=a&&null!=a.nd)return a.nd(a,b,c,d);var e=zc[t(null==a?null:a)];if(null!=e)return e.m?e.m(a,b,c,d):e.call(null,a,b,c,d);e=zc._;if(null!=e)return e.m?e.m(a,b,c,d):e.call(null,a,b,c,d);throw D("ISwap.-swap!",a);};
zc.D=function(a,b,c,d,e){if(null!=a&&null!=a.od)return a.od(a,b,c,d,e);var f=zc[t(null==a?null:a)];if(null!=f)return f.D?f.D(a,b,c,d,e):f.call(null,a,b,c,d,e);f=zc._;if(null!=f)return f.D?f.D(a,b,c,d,e):f.call(null,a,b,c,d,e);throw D("ISwap.-swap!",a);};zc.w=5;var Ac=function Ac(b){if(null!=b&&null!=b.Ma)return b.Ma(b);var c=Ac[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ac._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IIterable.-iterator",b);};
function Bc(a){this.zd=a;this.i=1073741824;this.B=0}Bc.prototype.Ic=function(a,b){return this.zd.append(b)};function Cc(a){var b=new Ia;a.K(null,new Bc(b),bb());return""+F(b)}var Dc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(a,b){return Math.imul(a,b)}:function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16&65535)*d+c*(b>>>16&65535)<<16>>>0)|0};function Ec(a){a=Dc(a|0,-862048943);return Dc(a<<15|a>>>-15,461845907)}
function Fc(a,b){var c=(a|0)^(b|0);return Dc(c<<13|c>>>-13,5)+-430675100|0}function Gc(a,b){var c=(a|0)^b,c=Dc(c^c>>>16,-2048144789),c=Dc(c^c>>>13,-1028477387);return c^c>>>16}function Hc(a){var b;a:{b=1;for(var c=0;;)if(b<a.length){var d=b+2,c=Fc(c,Ec(a.charCodeAt(b-1)|a.charCodeAt(b)<<16));b=d}else{b=c;break a}}b=1===(a.length&1)?b^Ec(a.charCodeAt(a.length-1)):b;return Gc(b,Dc(2,a.length))}Ic;I;Jc;Kc;var Lc={},Mc=0;
function Nc(a){if(null!=a){var b=a.length;if(0<b)for(var c=0,d=0;;)if(c<b)var e=c+1,d=Dc(31,d)+a.charCodeAt(c),c=e;else return d;else return 0}else return 0}function Pc(a){255<Mc&&(Lc={},Mc=0);var b=Lc[a];"number"!==typeof b&&(b=Nc(a),Lc[a]=b,Mc+=1);return a=b}
function Qc(a){null!=a&&(a.i&4194304||a.Fd)?a=a.N(null):"number"===typeof a?a=Math.floor(a)%2147483647:!0===a?a=1:!1===a?a=0:"string"===typeof a?(a=Pc(a),0!==a&&(a=Ec(a),a=Fc(0,a),a=Gc(a,4))):a=a instanceof Date?a.valueOf():null==a?0:Zb(a);return a}function Rc(a,b){return a^b+2654435769+(a<<6)+(a>>2)}function kb(a,b){return b instanceof a}
function Sc(a,b){if(a.Pa===b.Pa)return 0;var c=nb(a.ua);if(y(c?b.ua:c))return-1;if(y(a.ua)){if(nb(b.ua))return 1;c=Va(a.ua,b.ua);return 0===c?Va(a.name,b.name):c}return Va(a.name,b.name)}K;function I(a,b,c,d,e){this.ua=a;this.name=b;this.Pa=c;this.kb=d;this.ya=e;this.i=2154168321;this.B=4096}g=I.prototype;g.toString=function(){return this.Pa};g.equiv=function(a){return this.A(null,a)};g.A=function(a,b){return b instanceof I?this.Pa===b.Pa:!1};
g.call=function(){function a(a,b,c){return K.c?K.c(b,this,c):K.call(null,b,this,c)}function b(a,b){return K.b?K.b(b,this):K.call(null,b,this)}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,0,e);case 3:return a.call(this,0,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(qb(b)))};g.a=function(a){return K.b?K.b(a,this):K.call(null,a,this)};
g.b=function(a,b){return K.c?K.c(a,this,b):K.call(null,a,this,b)};g.P=function(){return this.ya};g.S=function(a,b){return new I(this.ua,this.name,this.Pa,this.kb,b)};g.N=function(){var a=this.kb;return null!=a?a:this.kb=a=Rc(Hc(this.name),Pc(this.ua))};g.Bb=function(){return this.name};g.Cb=function(){return this.ua};g.K=function(a,b){return fc(b,this.Pa)};
var Tc=function Tc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Tc.a(arguments[0]);case 2:return Tc.b(arguments[0],arguments[1]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};Tc.a=function(a){if(a instanceof I)return a;var b=a.indexOf("/");return-1===b?Tc.b(null,a):Tc.b(a.substring(0,b),a.substring(b+1,a.length))};Tc.b=function(a,b){var c=null!=a?[F(a),F("/"),F(b)].join(""):b;return new I(a,b,c,null,null)};
Tc.w=2;L;Uc;M;function N(a){if(null==a)return null;if(null!=a&&(a.i&8388608||a.kd))return a.U(null);if(mb(a)||"string"===typeof a)return 0===a.length?null:new M(a,0);if(C($b,a))return ac(a);throw Error([F(a),F(" is not ISeqable")].join(""));}function O(a){if(null==a)return null;if(null!=a&&(a.i&64||a.Va))return a.$(null);a=N(a);return null==a?null:Ab(a)}function Vc(a){return null!=a?null!=a&&(a.i&64||a.Va)?a.ra(null):(a=N(a))?Bb(a):Wc:Wc}
function P(a){return null==a?null:null!=a&&(a.i&128||a.Xb)?a.va(null):N(Vc(a))}var Jc=function Jc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Jc.a(arguments[0]);case 2:return Jc.b(arguments[0],arguments[1]);default:return Jc.l(arguments[0],arguments[1],new M(c.slice(2),0))}};Jc.a=function(){return!0};Jc.b=function(a,b){return null==a?null==b:a===b||Yb(a,b)};
Jc.l=function(a,b,c){for(;;)if(Jc.b(a,b))if(P(c))a=b,b=O(c),c=P(c);else return Jc.b(b,O(c));else return!1};Jc.C=function(a){var b=O(a),c=P(a);a=O(c);c=P(c);return Jc.l(b,a,c)};Jc.w=2;function Xc(a){this.F=a}Xc.prototype.next=function(){if(null!=this.F){var a=O(this.F);this.F=P(this.F);return{value:a,done:!1}}return{value:null,done:!0}};function Yc(a){return new Xc(N(a))}Zc;function $c(a,b,c){this.value=a;this.rb=b;this.lc=c;this.i=8388672;this.B=0}$c.prototype.U=function(){return this};
$c.prototype.$=function(){return this.value};$c.prototype.ra=function(){null==this.lc&&(this.lc=Zc.a?Zc.a(this.rb):Zc.call(null,this.rb));return this.lc};function Zc(a){var b=a.next();return y(b.done)?Wc:new $c(b.value,a,null)}function ad(a,b){var c=Ec(a),c=Fc(0,c);return Gc(c,b)}function bd(a){var b=0,c=1;for(a=N(a);;)if(null!=a)b+=1,c=Dc(31,c)+Qc(O(a))|0,a=P(a);else return ad(c,b)}var cd=ad(1,0);function dd(a){var b=0,c=0;for(a=N(a);;)if(null!=a)b+=1,c=c+Qc(O(a))|0,a=P(a);else return ad(c,b)}
var ed=ad(0,0);fd;Ic;gd;sb["null"]=!0;tb["null"]=function(){return 0};Date.prototype.A=function(a,b){return b instanceof Date&&this.valueOf()===b.valueOf()};Date.prototype.xb=!0;Date.prototype.ab=function(a,b){if(b instanceof Date)return Va(this.valueOf(),b.valueOf());throw Error([F("Cannot compare "),F(this),F(" to "),F(b)].join(""));};Yb.number=function(a,b){return a===b};hd;Sb["function"]=!0;Tb["function"]=function(){return null};Zb._=function(a){return la(a)};function id(a){return a+1}Q;
function jd(a){this.L=a;this.i=32768;this.B=0}jd.prototype.Wb=function(){return this.L};function kd(a){return a instanceof jd}function Q(a){return Rb(a)}function ld(a,b){var c=tb(a);if(0===c)return b.v?b.v():b.call(null);for(var d=H.b(a,0),e=1;;)if(e<c){var f=H.b(a,e),d=b.b?b.b(d,f):b.call(null,d,f);if(kd(d))return Rb(d);e+=1}else return d}function md(a,b,c){var d=tb(a),e=c;for(c=0;;)if(c<d){var f=H.b(a,c),e=b.b?b.b(e,f):b.call(null,e,f);if(kd(e))return Rb(e);c+=1}else return e}
function nd(a,b){var c=a.length;if(0===a.length)return b.v?b.v():b.call(null);for(var d=a[0],e=1;;)if(e<c){var f=a[e],d=b.b?b.b(d,f):b.call(null,d,f);if(kd(d))return Rb(d);e+=1}else return d}function od(a,b,c){var d=a.length,e=c;for(c=0;;)if(c<d){var f=a[c],e=b.b?b.b(e,f):b.call(null,e,f);if(kd(e))return Rb(e);c+=1}else return e}function pd(a,b,c,d){for(var e=a.length;;)if(d<e){var f=a[d];c=b.b?b.b(c,f):b.call(null,c,f);if(kd(c))return Rb(c);d+=1}else return c}qd;R;rd;sd;
function td(a){return null!=a?a.i&2||a.$c?!0:a.i?!1:C(sb,a):C(sb,a)}function ud(a){return null!=a?a.i&16||a.Ec?!0:a.i?!1:C(yb,a):C(yb,a)}function vd(a,b){this.f=a;this.s=b}vd.prototype.ta=function(){return this.s<this.f.length};vd.prototype.next=function(){var a=this.f[this.s];this.s+=1;return a};function M(a,b){this.f=a;this.s=b;this.i=166199550;this.B=8192}g=M.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};
g.X=function(a,b){var c=b+this.s;return c<this.f.length?this.f[c]:null};g.Ca=function(a,b,c){a=b+this.s;return a<this.f.length?this.f[a]:c};g.Ma=function(){return new vd(this.f,this.s)};g.va=function(){return this.s+1<this.f.length?new M(this.f,this.s+1):null};g.aa=function(){var a=this.f.length-this.s;return 0>a?0:a};g.Yb=function(){var a=tb(this);return 0<a?new rd(this,a-1,null):null};g.N=function(){return bd(this)};g.A=function(a,b){return gd.b?gd.b(this,b):gd.call(null,this,b)};g.Y=function(){return Wc};
g.ba=function(a,b){return pd(this.f,b,this.f[this.s],this.s+1)};g.ca=function(a,b,c){return pd(this.f,b,c,this.s)};g.$=function(){return this.f[this.s]};g.ra=function(){return this.s+1<this.f.length?new M(this.f,this.s+1):Wc};g.U=function(){return this.s<this.f.length?this:null};g.V=function(a,b){return R.b?R.b(b,this):R.call(null,b,this)};M.prototype[pb]=function(){return Yc(this)};
var Uc=function Uc(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Uc.a(arguments[0]);case 2:return Uc.b(arguments[0],arguments[1]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};Uc.a=function(a){return Uc.b(a,0)};Uc.b=function(a,b){return b<a.length?new M(a,b):null};Uc.w=2;
var L=function L(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return L.a(arguments[0]);case 2:return L.b(arguments[0],arguments[1]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};L.a=function(a){return Uc.b(a,0)};L.b=function(a,b){return Uc.b(a,b)};L.w=2;hd;wd;function rd(a,b,c){this.Vb=a;this.s=b;this.o=c;this.i=32374990;this.B=8192}g=rd.prototype;g.toString=function(){return Cc(this)};
g.equiv=function(a){return this.A(null,a)};g.P=function(){return this.o};g.va=function(){return 0<this.s?new rd(this.Vb,this.s-1,null):null};g.aa=function(){return this.s+1};g.N=function(){return bd(this)};g.A=function(a,b){return gd.b?gd.b(this,b):gd.call(null,this,b)};g.Y=function(){var a=Wc,b=this.o;return hd.b?hd.b(a,b):hd.call(null,a,b)};g.ba=function(a,b){return wd.b?wd.b(b,this):wd.call(null,b,this)};g.ca=function(a,b,c){return wd.c?wd.c(b,c,this):wd.call(null,b,c,this)};
g.$=function(){return H.b(this.Vb,this.s)};g.ra=function(){return 0<this.s?new rd(this.Vb,this.s-1,null):Wc};g.U=function(){return this};g.S=function(a,b){return new rd(this.Vb,this.s,b)};g.V=function(a,b){return R.b?R.b(b,this):R.call(null,b,this)};rd.prototype[pb]=function(){return Yc(this)};Yb._=function(a,b){return a===b};
var xd=function xd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return xd.v();case 1:return xd.a(arguments[0]);case 2:return xd.b(arguments[0],arguments[1]);default:return xd.l(arguments[0],arguments[1],new M(c.slice(2),0))}};xd.v=function(){return yd};xd.a=function(a){return a};xd.b=function(a,b){return null!=a?wb(a,b):wb(Wc,b)};xd.l=function(a,b,c){for(;;)if(y(c))a=xd.b(a,b),b=O(c),c=P(c);else return xd.b(a,b)};
xd.C=function(a){var b=O(a),c=P(a);a=O(c);c=P(c);return xd.l(b,a,c)};xd.w=2;function S(a){if(null!=a)if(null!=a&&(a.i&2||a.$c))a=a.aa(null);else if(mb(a))a=a.length;else if("string"===typeof a)a=a.length;else if(null!=a&&(a.i&8388608||a.kd))a:{a=N(a);for(var b=0;;){if(td(a)){a=b+tb(a);break a}a=P(a);b+=1}}else a=tb(a);else a=0;return a}function zd(a,b){for(var c=null;;){if(null==a)return c;if(0===b)return N(a)?O(a):c;if(ud(a))return H.c(a,b,c);if(N(a)){var d=P(a),e=b-1;a=d;b=e}else return c}}
function Ad(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number");if(null==a)return a;if(null!=a&&(a.i&16||a.Ec))return a.X(null,b);if(mb(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.Va)){var c;a:{c=a;for(var d=b;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(N(c)){c=O(c);break a}throw Error("Index out of bounds");}if(ud(c)){c=H.b(c,d);break a}if(N(c))c=P(c),--d;else throw Error("Index out of bounds");
}}return c}if(C(yb,a))return H.b(a,b);throw Error([F("nth not supported on this type "),F(ob(null==a?null:a.constructor))].join(""));}
function U(a,b){if("number"!==typeof b)throw Error("index argument to nth must be a number.");if(null==a)return null;if(null!=a&&(a.i&16||a.Ec))return a.Ca(null,b,null);if(mb(a))return b<a.length?a[b]:null;if("string"===typeof a)return b<a.length?a.charAt(b):null;if(null!=a&&(a.i&64||a.Va))return zd(a,b);if(C(yb,a))return H.b(a,b);throw Error([F("nth not supported on this type "),F(ob(null==a?null:a.constructor))].join(""));}
var K=function K(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return K.b(arguments[0],arguments[1]);case 3:return K.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};K.b=function(a,b){return null==a?null:null!=a&&(a.i&256||a.cd)?a.M(null,b):mb(a)?b<a.length?a[b|0]:null:"string"===typeof a?b<a.length?a[b|0]:null:C(Db,a)?Eb.b(a,b):null};
K.c=function(a,b,c){return null!=a?null!=a&&(a.i&256||a.cd)?a.H(null,b,c):mb(a)?b<a.length?a[b]:c:"string"===typeof a?b<a.length?a[b]:c:C(Db,a)?Eb.c(a,b,c):c:c};K.w=3;Bd;var Cd=function Cd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Cd.c(arguments[0],arguments[1],arguments[2]);default:return Cd.l(arguments[0],arguments[1],arguments[2],new M(c.slice(3),0))}};
Cd.c=function(a,b,c){if(null!=a)a=Gb(a,b,c);else a:{a=[b];c=[c];b=a.length;var d=0,e;for(e=lc(Dd);;)if(d<b){var f=d+1;e=e.Db(null,a[d],c[d]);d=f}else{a=nc(e);break a}}return a};Cd.l=function(a,b,c,d){for(;;)if(a=Cd.c(a,b,c),y(d))b=O(d),c=O(P(d)),d=P(P(d));else return a};Cd.C=function(a){var b=O(a),c=P(a);a=O(c);var d=P(c),c=O(d),d=P(d);return Cd.l(b,a,c,d)};Cd.w=3;
var Ed=function Ed(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ed.a(arguments[0]);case 2:return Ed.b(arguments[0],arguments[1]);default:return Ed.l(arguments[0],arguments[1],new M(c.slice(2),0))}};Ed.a=function(a){return a};Ed.b=function(a,b){return null==a?null:Ib(a,b)};Ed.l=function(a,b,c){for(;;){if(null==a)return null;a=Ed.b(a,b);if(y(c))b=O(c),c=P(c);else return a}};
Ed.C=function(a){var b=O(a),c=P(a);a=O(c);c=P(c);return Ed.l(b,a,c)};Ed.w=2;function Fd(a,b){this.g=a;this.o=b;this.i=393217;this.B=0}g=Fd.prototype;g.P=function(){return this.o};g.S=function(a,b){return new Fd(this.g,b)};
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x,jb,B,z,E,J){a=this;return G.yb?G.yb(a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x,jb,B,z,E,J):G.call(null,a.g,b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x,jb,B,z,E,J)}function b(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x,B,z,E,J){a=this;return a.g.oa?a.g.oa(b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x,B,z,E,J):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x,B,z,E,J)}function c(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x,B,z,E){a=this;return a.g.na?a.g.na(b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x,B,z,
E):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x,B,z,E)}function d(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x,B,z){a=this;return a.g.ma?a.g.ma(b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x,B,z):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x,B,z)}function e(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x,B){a=this;return a.g.la?a.g.la(b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x,B):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x,B)}function f(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x){a=this;return a.g.ka?a.g.ka(b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x):a.g.call(null,
b,c,d,e,f,h,k,l,m,n,p,q,r,u,w,x)}function h(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,w){a=this;return a.g.ja?a.g.ja(b,c,d,e,f,h,k,l,m,n,p,q,r,u,w):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,u,w)}function k(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u){a=this;return a.g.ia?a.g.ia(b,c,d,e,f,h,k,l,m,n,p,q,r,u):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r,u)}function l(a,b,c,d,e,f,h,k,l,m,n,p,q,r){a=this;return a.g.ha?a.g.ha(b,c,d,e,f,h,k,l,m,n,p,q,r):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q,r)}function m(a,b,c,d,e,f,h,k,l,m,n,p,q){a=this;
return a.g.ga?a.g.ga(b,c,d,e,f,h,k,l,m,n,p,q):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p,q)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;return a.g.fa?a.g.fa(b,c,d,e,f,h,k,l,m,n,p):a.g.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,n){a=this;return a.g.ea?a.g.ea(b,c,d,e,f,h,k,l,m,n):a.g.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;return a.g.qa?a.g.qa(b,c,d,e,f,h,k,l,m):a.g.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;return a.g.pa?a.g.pa(b,c,
d,e,f,h,k,l):a.g.call(null,b,c,d,e,f,h,k,l)}function u(a,b,c,d,e,f,h,k){a=this;return a.g.Z?a.g.Z(b,c,d,e,f,h,k):a.g.call(null,b,c,d,e,f,h,k)}function x(a,b,c,d,e,f,h){a=this;return a.g.W?a.g.W(b,c,d,e,f,h):a.g.call(null,b,c,d,e,f,h)}function w(a,b,c,d,e,f){a=this;return a.g.D?a.g.D(b,c,d,e,f):a.g.call(null,b,c,d,e,f)}function B(a,b,c,d,e){a=this;return a.g.m?a.g.m(b,c,d,e):a.g.call(null,b,c,d,e)}function E(a,b,c,d){a=this;return a.g.c?a.g.c(b,c,d):a.g.call(null,b,c,d)}function J(a,b,c){a=this;return a.g.b?
a.g.b(b,c):a.g.call(null,b,c)}function ca(a,b){a=this;return a.g.a?a.g.a(b):a.g.call(null,b)}function ta(a){a=this;return a.g.v?a.g.v():a.g.call(null)}var z=null,z=function(Pa,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,z,Xa,eb,xb,jb,ic,Oc,Nd,Pf){switch(arguments.length){case 1:return ta.call(this,Pa);case 2:return ca.call(this,Pa,X);case 3:return J.call(this,Pa,X,aa);case 4:return E.call(this,Pa,X,aa,T);case 5:return B.call(this,Pa,X,aa,T,da);case 6:return w.call(this,Pa,X,aa,T,da,ha);case 7:return x.call(this,
Pa,X,aa,T,da,ha,ja);case 8:return u.call(this,Pa,X,aa,T,da,ha,ja,ma);case 9:return r.call(this,Pa,X,aa,T,da,ha,ja,ma,qa);case 10:return q.call(this,Pa,X,aa,T,da,ha,ja,ma,qa,sa);case 11:return p.call(this,Pa,X,aa,T,da,ha,ja,ma,qa,sa,Ba);case 12:return n.call(this,Pa,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka);case 13:return m.call(this,Pa,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa);case 14:return l.call(this,Pa,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,z);case 15:return k.call(this,Pa,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,z,Xa);case 16:return h.call(this,
Pa,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,z,Xa,eb);case 17:return f.call(this,Pa,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,z,Xa,eb,xb);case 18:return e.call(this,Pa,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,z,Xa,eb,xb,jb);case 19:return d.call(this,Pa,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,z,Xa,eb,xb,jb,ic);case 20:return c.call(this,Pa,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,z,Xa,eb,xb,jb,ic,Oc);case 21:return b.call(this,Pa,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,z,Xa,eb,xb,jb,ic,Oc,Nd);case 22:return a.call(this,Pa,X,aa,T,da,ha,ja,
ma,qa,sa,Ba,Ka,Qa,z,Xa,eb,xb,jb,ic,Oc,Nd,Pf)}throw Error("Invalid arity: "+arguments.length);};z.a=ta;z.b=ca;z.c=J;z.m=E;z.D=B;z.W=w;z.Z=x;z.pa=u;z.qa=r;z.ea=q;z.fa=p;z.ga=n;z.ha=m;z.ia=l;z.ja=k;z.ka=h;z.la=f;z.ma=e;z.na=d;z.oa=c;z.sc=b;z.yb=a;return z}();g.apply=function(a,b){return this.call.apply(this,[this].concat(qb(b)))};g.v=function(){return this.g.v?this.g.v():this.g.call(null)};g.a=function(a){return this.g.a?this.g.a(a):this.g.call(null,a)};
g.b=function(a,b){return this.g.b?this.g.b(a,b):this.g.call(null,a,b)};g.c=function(a,b,c){return this.g.c?this.g.c(a,b,c):this.g.call(null,a,b,c)};g.m=function(a,b,c,d){return this.g.m?this.g.m(a,b,c,d):this.g.call(null,a,b,c,d)};g.D=function(a,b,c,d,e){return this.g.D?this.g.D(a,b,c,d,e):this.g.call(null,a,b,c,d,e)};g.W=function(a,b,c,d,e,f){return this.g.W?this.g.W(a,b,c,d,e,f):this.g.call(null,a,b,c,d,e,f)};
g.Z=function(a,b,c,d,e,f,h){return this.g.Z?this.g.Z(a,b,c,d,e,f,h):this.g.call(null,a,b,c,d,e,f,h)};g.pa=function(a,b,c,d,e,f,h,k){return this.g.pa?this.g.pa(a,b,c,d,e,f,h,k):this.g.call(null,a,b,c,d,e,f,h,k)};g.qa=function(a,b,c,d,e,f,h,k,l){return this.g.qa?this.g.qa(a,b,c,d,e,f,h,k,l):this.g.call(null,a,b,c,d,e,f,h,k,l)};g.ea=function(a,b,c,d,e,f,h,k,l,m){return this.g.ea?this.g.ea(a,b,c,d,e,f,h,k,l,m):this.g.call(null,a,b,c,d,e,f,h,k,l,m)};
g.fa=function(a,b,c,d,e,f,h,k,l,m,n){return this.g.fa?this.g.fa(a,b,c,d,e,f,h,k,l,m,n):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n)};g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p){return this.g.ga?this.g.ga(a,b,c,d,e,f,h,k,l,m,n,p):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q){return this.g.ha?this.g.ha(a,b,c,d,e,f,h,k,l,m,n,p,q):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};
g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){return this.g.ia?this.g.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u){return this.g.ja?this.g.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u)};g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x){return this.g.ka?this.g.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x)};
g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w){return this.g.la?this.g.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w)};g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B){return this.g.ma?this.g.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B)};
g.na=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E){return this.g.na?this.g.na(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E)};g.oa=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J){return this.g.oa?this.g.oa(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J):this.g.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J)};
g.sc=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J,ca){return G.yb?G.yb(this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J,ca):G.call(null,this.g,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J,ca)};function hd(a,b){return ka(a)?new Fd(a,b):null==a?null:Vb(a,b)}function Gd(a){var b=null!=a;return(b?null!=a?a.i&131072||a.fd||(a.i?0:C(Sb,a)):C(Sb,a):b)?Tb(a):null}function Hd(a){return null==a?!1:null!=a?a.i&4096||a.Jd?!0:a.i?!1:C(Mb,a):C(Mb,a)}
function Id(a){return null!=a?a.i&16777216||a.Id?!0:a.i?!1:C(bc,a):C(bc,a)}function Jd(a){return null==a?!1:null!=a?a.i&1024||a.dd?!0:a.i?!1:C(Hb,a):C(Hb,a)}function Kd(a){return null!=a?a.i&16384||a.Kd?!0:a.i?!1:C(Pb,a):C(Pb,a)}Ld;Md;function Od(a){return null!=a?a.B&512||a.Cd?!0:!1:!1}function Pd(a){var b=[];Aa(a,function(a,b){return function(a,c){return b.push(c)}}(a,b));return b}function Qd(a,b,c,d,e){for(;0!==e;)c[d]=a[b],d+=1,--e,b+=1}var Rd={};
function Sd(a){return null==a?!1:null!=a?a.i&64||a.Va?!0:a.i?!1:C(zb,a):C(zb,a)}function Td(a){return null==a?!1:!1===a?!1:!0}function Ud(a,b){return K.c(a,b,Rd)===Rd?!1:!0}
function Kc(a,b){if(a===b)return 0;if(null==a)return-1;if(null==b)return 1;if("number"===typeof a){if("number"===typeof b)return Va(a,b);throw Error([F("Cannot compare "),F(a),F(" to "),F(b)].join(""));}if(null!=a?a.B&2048||a.xb||(a.B?0:C(qc,a)):C(qc,a))return rc(a,b);if("string"!==typeof a&&!mb(a)&&!0!==a&&!1!==a||(null==a?null:a.constructor)!==(null==b?null:b.constructor))throw Error([F("Cannot compare "),F(a),F(" to "),F(b)].join(""));return Va(a,b)}
function Vd(a,b){var c=S(a),d=S(b);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=Kc(Ad(a,d),Ad(b,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}Wd;var wd=function wd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return wd.b(arguments[0],arguments[1]);case 3:return wd.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};
wd.b=function(a,b){var c=N(b);if(c){var d=O(c),c=P(c);return rb.c?rb.c(a,d,c):rb.call(null,a,d,c)}return a.v?a.v():a.call(null)};wd.c=function(a,b,c){for(c=N(c);;)if(c){var d=O(c);b=a.b?a.b(b,d):a.call(null,b,d);if(kd(b))return Rb(b);c=P(c)}else return b};wd.w=3;Xd;
var rb=function rb(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return rb.b(arguments[0],arguments[1]);case 3:return rb.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};rb.b=function(a,b){return null!=b&&(b.i&524288||b.hd)?b.ba(null,a):mb(b)?nd(b,a):"string"===typeof b?nd(b,a):C(Wb,b)?Xb.b(b,a):wd.b(a,b)};
rb.c=function(a,b,c){return null!=c&&(c.i&524288||c.hd)?c.ca(null,a,b):mb(c)?od(c,a,b):"string"===typeof c?od(c,a,b):C(Wb,c)?Xb.c(c,a,b):wd.c(a,b,c)};rb.w=3;function Yd(a){return a}var Zd=function Zd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Zd.v();case 1:return Zd.a(arguments[0]);case 2:return Zd.b(arguments[0],arguments[1]);default:return Zd.l(arguments[0],arguments[1],new M(c.slice(2),0))}};Zd.v=function(){return 0};
Zd.a=function(a){return a};Zd.b=function(a,b){return a+b};Zd.l=function(a,b,c){return rb.c(Zd,a+b,c)};Zd.C=function(a){var b=O(a),c=P(a);a=O(c);c=P(c);return Zd.l(b,a,c)};Zd.w=2;var $d=function $d(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return $d.a(arguments[0]);case 2:return $d.b(arguments[0],arguments[1]);default:return $d.l(arguments[0],arguments[1],new M(c.slice(2),0))}};$d.a=function(a){return-a};
$d.b=function(a,b){return a-b};$d.l=function(a,b,c){return rb.c($d,a-b,c)};$d.C=function(a){var b=O(a),c=P(a);a=O(c);c=P(c);return $d.l(b,a,c)};$d.w=2;var ae=function ae(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return ae.v();case 1:return ae.a(arguments[0]);case 2:return ae.b(arguments[0],arguments[1]);default:return ae.l(arguments[0],arguments[1],new M(c.slice(2),0))}};ae.v=function(){return 1};ae.a=function(a){return a};
ae.b=function(a,b){return a*b};ae.l=function(a,b,c){return rb.c(ae,a*b,c)};ae.C=function(a){var b=O(a),c=P(a);a=O(c);c=P(c);return ae.l(b,a,c)};ae.w=2;({}).Md;function be(a){return a-1}ce;function de(a){return a|0}function ce(a,b){return(a%b+b)%b}function ee(a){a=(a-a%2)/2;return 0<=a?Math.floor(a):Math.ceil(a)}function fe(a){a-=a>>1&1431655765;a=(a&858993459)+(a>>2&858993459);return 16843009*(a+(a>>4)&252645135)>>24}function ge(a){var b=2;for(a=N(a);;)if(a&&0<b)--b,a=P(a);else return a}
var F=function F(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return F.v();case 1:return F.a(arguments[0]);default:return F.l(arguments[0],new M(c.slice(1),0))}};F.v=function(){return""};F.a=function(a){return null==a?"":""+a};F.l=function(a,b){for(var c=new Ia(""+F(a)),d=b;;)if(y(d))c=c.append(""+F(O(d))),d=P(d);else return c.toString()};F.C=function(a){var b=O(a);a=P(a);return F.l(b,a)};F.w=1;he;ie;
function gd(a,b){var c;if(Id(b))if(td(a)&&td(b)&&S(a)!==S(b))c=!1;else a:{c=N(a);for(var d=N(b);;){if(null==c){c=null==d;break a}if(null!=d&&Jc.b(O(c),O(d)))c=P(c),d=P(d);else{c=!1;break a}}}else c=null;return Td(c)}function qd(a){if(N(a)){var b=Qc(O(a));for(a=P(a);;){if(null==a)return b;b=Rc(b,Qc(O(a)));a=P(a)}}else return 0}je;ke;ie;le;me;function sd(a,b,c,d,e){this.o=a;this.first=b;this.xa=c;this.count=d;this.u=e;this.i=65937646;this.B=8192}g=sd.prototype;g.toString=function(){return Cc(this)};
g.equiv=function(a){return this.A(null,a)};g.P=function(){return this.o};g.va=function(){return 1===this.count?null:this.xa};g.aa=function(){return this.count};g.Wa=function(){return this.first};g.Xa=function(){return Bb(this)};g.N=function(){var a=this.u;return null!=a?a:this.u=a=bd(this)};g.A=function(a,b){return gd(this,b)};g.Y=function(){return Vb(Wc,this.o)};g.ba=function(a,b){return wd.b(b,this)};g.ca=function(a,b,c){return wd.c(b,c,this)};g.$=function(){return this.first};
g.ra=function(){return 1===this.count?Wc:this.xa};g.U=function(){return this};g.S=function(a,b){return new sd(b,this.first,this.xa,this.count,this.u)};g.V=function(a,b){return new sd(this.o,b,this,this.count+1,null)};sd.prototype[pb]=function(){return Yc(this)};function ne(a){this.o=a;this.i=65937614;this.B=8192}g=ne.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};g.P=function(){return this.o};g.va=function(){return null};g.aa=function(){return 0};
g.Wa=function(){return null};g.Xa=function(){throw Error("Can't pop empty list");};g.N=function(){return cd};g.A=function(a,b){return(null!=b?b.i&33554432||b.Gd||(b.i?0:C(cc,b)):C(cc,b))||Id(b)?null==N(b):!1};g.Y=function(){return this};g.ba=function(a,b){return wd.b(b,this)};g.ca=function(a,b,c){return wd.c(b,c,this)};g.$=function(){return null};g.ra=function(){return Wc};g.U=function(){return null};g.S=function(a,b){return new ne(b)};g.V=function(a,b){return new sd(this.o,b,null,1,null)};
var Wc=new ne(null);ne.prototype[pb]=function(){return Yc(this)};function oe(a){return(null!=a?a.i&134217728||a.Hd||(a.i?0:C(dc,a)):C(dc,a))?ec(a):rb.c(xd,Wc,a)}var Ic=function Ic(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ic.l(0<c.length?new M(c.slice(0),0):null)};
Ic.l=function(a){var b;if(a instanceof M&&0===a.s)b=a.f;else a:for(b=[];;)if(null!=a)b.push(a.$(null)),a=a.va(null);else break a;a=b.length;for(var c=Wc;;)if(0<a){var d=a-1,c=c.V(null,b[a-1]);a=d}else return c};Ic.w=0;Ic.C=function(a){return Ic.l(N(a))};function pe(a,b,c,d){this.o=a;this.first=b;this.xa=c;this.u=d;this.i=65929452;this.B=8192}g=pe.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};g.P=function(){return this.o};
g.va=function(){return null==this.xa?null:N(this.xa)};g.N=function(){var a=this.u;return null!=a?a:this.u=a=bd(this)};g.A=function(a,b){return gd(this,b)};g.Y=function(){return hd(Wc,this.o)};g.ba=function(a,b){return wd.b(b,this)};g.ca=function(a,b,c){return wd.c(b,c,this)};g.$=function(){return this.first};g.ra=function(){return null==this.xa?Wc:this.xa};g.U=function(){return this};g.S=function(a,b){return new pe(b,this.first,this.xa,this.u)};g.V=function(a,b){return new pe(null,b,this,this.u)};
pe.prototype[pb]=function(){return Yc(this)};function R(a,b){var c=null==b;return(c?c:null!=b&&(b.i&64||b.Va))?new pe(null,a,b,null):new pe(null,a,N(b),null)}function qe(a,b){if(a.Na===b.Na)return 0;var c=nb(a.ua);if(y(c?b.ua:c))return-1;if(y(a.ua)){if(nb(b.ua))return 1;c=Va(a.ua,b.ua);return 0===c?Va(a.name,b.name):c}return Va(a.name,b.name)}function A(a,b,c,d){this.ua=a;this.name=b;this.Na=c;this.kb=d;this.i=2153775105;this.B=4096}g=A.prototype;g.toString=function(){return[F(":"),F(this.Na)].join("")};
g.equiv=function(a){return this.A(null,a)};g.A=function(a,b){return b instanceof A?this.Na===b.Na:!1};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return K.b(c,this);case 3:return K.c(c,this,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return K.b(c,this)};a.c=function(a,c,d){return K.c(c,this,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(qb(b)))};g.a=function(a){return K.b(a,this)};
g.b=function(a,b){return K.c(a,this,b)};g.N=function(){var a=this.kb;return null!=a?a:this.kb=a=Rc(Hc(this.name),Pc(this.ua))+2654435769|0};g.Bb=function(){return this.name};g.Cb=function(){return this.ua};g.K=function(a,b){return fc(b,[F(":"),F(this.Na)].join(""))};
var re=function re(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return re.a(arguments[0]);case 2:return re.b(arguments[0],arguments[1]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};
re.a=function(a){if(a instanceof A)return a;if(a instanceof I){var b;if(null!=a&&(a.B&4096||a.gd))b=a.Cb(null);else throw Error([F("Doesn't support namespace: "),F(a)].join(""));return new A(b,ie.a?ie.a(a):ie.call(null,a),a.Pa,null)}return"string"===typeof a?(b=a.split("/"),2===b.length?new A(b[0],b[1],a,null):new A(null,b[0],a,null)):null};re.b=function(a,b){return new A(a,b,[F(y(a)?[F(a),F("/")].join(""):null),F(b)].join(""),null)};re.w=2;
function se(a,b,c,d){this.o=a;this.pb=b;this.F=c;this.u=d;this.i=32374988;this.B=0}g=se.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};function te(a){null!=a.pb&&(a.F=a.pb.v?a.pb.v():a.pb.call(null),a.pb=null);return a.F}g.P=function(){return this.o};g.va=function(){ac(this);return null==this.F?null:P(this.F)};g.N=function(){var a=this.u;return null!=a?a:this.u=a=bd(this)};g.A=function(a,b){return gd(this,b)};g.Y=function(){return hd(Wc,this.o)};
g.ba=function(a,b){return wd.b(b,this)};g.ca=function(a,b,c){return wd.c(b,c,this)};g.$=function(){ac(this);return null==this.F?null:O(this.F)};g.ra=function(){ac(this);return null!=this.F?Vc(this.F):Wc};g.U=function(){te(this);if(null==this.F)return null;for(var a=this.F;;)if(a instanceof se)a=te(a);else return this.F=a,N(this.F)};g.S=function(a,b){return new se(b,this.pb,this.F,this.u)};g.V=function(a,b){return R(b,this)};se.prototype[pb]=function(){return Yc(this)};ue;
function ve(a,b){this.mc=a;this.end=b;this.i=2;this.B=0}ve.prototype.add=function(a){this.mc[this.end]=a;return this.end+=1};ve.prototype.sa=function(){var a=new ue(this.mc,0,this.end);this.mc=null;return a};ve.prototype.aa=function(){return this.end};function we(a){return new ve(Array(a),0)}function ue(a,b,c){this.f=a;this.da=b;this.end=c;this.i=524306;this.B=0}g=ue.prototype;g.aa=function(){return this.end-this.da};g.X=function(a,b){return this.f[this.da+b]};
g.Ca=function(a,b,c){return 0<=b&&b<this.end-this.da?this.f[this.da+b]:c};g.Dc=function(){if(this.da===this.end)throw Error("-drop-first of empty chunk");return new ue(this.f,this.da+1,this.end)};g.ba=function(a,b){return pd(this.f,b,this.f[this.da],this.da+1)};g.ca=function(a,b,c){return pd(this.f,b,c,this.da)};function Ld(a,b,c,d){this.sa=a;this.Oa=b;this.o=c;this.u=d;this.i=31850732;this.B=1536}g=Ld.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};
g.P=function(){return this.o};g.va=function(){if(1<tb(this.sa))return new Ld(sc(this.sa),this.Oa,this.o,null);var a=ac(this.Oa);return null==a?null:a};g.N=function(){var a=this.u;return null!=a?a:this.u=a=bd(this)};g.A=function(a,b){return gd(this,b)};g.Y=function(){return hd(Wc,this.o)};g.$=function(){return H.b(this.sa,0)};g.ra=function(){return 1<tb(this.sa)?new Ld(sc(this.sa),this.Oa,this.o,null):null==this.Oa?Wc:this.Oa};g.U=function(){return this};g.qc=function(){return this.sa};
g.rc=function(){return null==this.Oa?Wc:this.Oa};g.S=function(a,b){return new Ld(this.sa,this.Oa,b,this.u)};g.V=function(a,b){return R(b,this)};g.pc=function(){return null==this.Oa?null:this.Oa};Ld.prototype[pb]=function(){return Yc(this)};function xe(a,b){return 0===tb(a)?b:new Ld(a,b,null,null)}function ye(a,b){a.add(b)}function le(a){return tc(a)}function me(a){return uc(a)}function Wd(a){for(var b=[];;)if(N(a))b.push(O(a)),a=P(a);else return b}
function ze(a,b){if(td(a))return S(a);for(var c=a,d=b,e=0;;)if(0<d&&N(c))c=P(c),--d,e+=1;else return e}var Ae=function Ae(b){return null==b?null:null==P(b)?N(O(b)):R(O(b),Ae(P(b)))},Be=function Be(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Be.v();case 1:return Be.a(arguments[0]);case 2:return Be.b(arguments[0],arguments[1]);default:return Be.l(arguments[0],arguments[1],new M(c.slice(2),0))}};
Be.v=function(){return new se(null,function(){return null},null,null)};Be.a=function(a){return new se(null,function(){return a},null,null)};Be.b=function(a,b){return new se(null,function(){var c=N(a);return c?Od(c)?xe(tc(c),Be.b(uc(c),b)):R(O(c),Be.b(Vc(c),b)):b},null,null)};Be.l=function(a,b,c){return function e(a,b){return new se(null,function(){var c=N(a);return c?Od(c)?xe(tc(c),e(uc(c),b)):R(O(c),e(Vc(c),b)):y(b)?e(O(b),P(b)):null},null,null)}(Be.b(a,b),c)};
Be.C=function(a){var b=O(a),c=P(a);a=O(c);c=P(c);return Be.l(b,a,c)};Be.w=2;var Ce=function Ce(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Ce.v();case 1:return Ce.a(arguments[0]);case 2:return Ce.b(arguments[0],arguments[1]);default:return Ce.l(arguments[0],arguments[1],new M(c.slice(2),0))}};Ce.v=function(){return lc(yd)};Ce.a=function(a){return a};Ce.b=function(a,b){return mc(a,b)};
Ce.l=function(a,b,c){for(;;)if(a=mc(a,b),y(c))b=O(c),c=P(c);else return a};Ce.C=function(a){var b=O(a),c=P(a);a=O(c);c=P(c);return Ce.l(b,a,c)};Ce.w=2;
function De(a,b,c){var d=N(c);if(0===b)return a.v?a.v():a.call(null);c=Ab(d);var e=Bb(d);if(1===b)return a.a?a.a(c):a.a?a.a(c):a.call(null,c);var d=Ab(e),f=Bb(e);if(2===b)return a.b?a.b(c,d):a.b?a.b(c,d):a.call(null,c,d);var e=Ab(f),h=Bb(f);if(3===b)return a.c?a.c(c,d,e):a.c?a.c(c,d,e):a.call(null,c,d,e);var f=Ab(h),k=Bb(h);if(4===b)return a.m?a.m(c,d,e,f):a.m?a.m(c,d,e,f):a.call(null,c,d,e,f);var h=Ab(k),l=Bb(k);if(5===b)return a.D?a.D(c,d,e,f,h):a.D?a.D(c,d,e,f,h):a.call(null,c,d,e,f,h);var k=Ab(l),
m=Bb(l);if(6===b)return a.W?a.W(c,d,e,f,h,k):a.W?a.W(c,d,e,f,h,k):a.call(null,c,d,e,f,h,k);var l=Ab(m),n=Bb(m);if(7===b)return a.Z?a.Z(c,d,e,f,h,k,l):a.Z?a.Z(c,d,e,f,h,k,l):a.call(null,c,d,e,f,h,k,l);var m=Ab(n),p=Bb(n);if(8===b)return a.pa?a.pa(c,d,e,f,h,k,l,m):a.pa?a.pa(c,d,e,f,h,k,l,m):a.call(null,c,d,e,f,h,k,l,m);var n=Ab(p),q=Bb(p);if(9===b)return a.qa?a.qa(c,d,e,f,h,k,l,m,n):a.qa?a.qa(c,d,e,f,h,k,l,m,n):a.call(null,c,d,e,f,h,k,l,m,n);var p=Ab(q),r=Bb(q);if(10===b)return a.ea?a.ea(c,d,e,f,h,
k,l,m,n,p):a.ea?a.ea(c,d,e,f,h,k,l,m,n,p):a.call(null,c,d,e,f,h,k,l,m,n,p);var q=Ab(r),u=Bb(r);if(11===b)return a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q):a.fa?a.fa(c,d,e,f,h,k,l,m,n,p,q):a.call(null,c,d,e,f,h,k,l,m,n,p,q);var r=Ab(u),x=Bb(u);if(12===b)return a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r):a.ga?a.ga(c,d,e,f,h,k,l,m,n,p,q,r):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r);var u=Ab(x),w=Bb(x);if(13===b)return a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,u):a.ha?a.ha(c,d,e,f,h,k,l,m,n,p,q,r,u):a.call(null,c,d,e,f,h,k,l,m,n,p,q,
r,u);var x=Ab(w),B=Bb(w);if(14===b)return a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,u,x):a.ia?a.ia(c,d,e,f,h,k,l,m,n,p,q,r,u,x):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x);var w=Ab(B),E=Bb(B);if(15===b)return a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,u,x,w):a.ja?a.ja(c,d,e,f,h,k,l,m,n,p,q,r,u,x,w):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w);var B=Ab(E),J=Bb(E);if(16===b)return a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B):a.ka?a.ka(c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B);var E=Ab(J),
ca=Bb(J);if(17===b)return a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E):a.la?a.la(c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E);var J=Ab(ca),ta=Bb(ca);if(18===b)return a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J):a.ma?a.ma(c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J);ca=Ab(ta);ta=Bb(ta);if(19===b)return a.na?a.na(c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J,ca):a.na?a.na(c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J,ca):a.call(null,c,d,e,
f,h,k,l,m,n,p,q,r,u,x,w,B,E,J,ca);var z=Ab(ta);Bb(ta);if(20===b)return a.oa?a.oa(c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J,ca,z):a.oa?a.oa(c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J,ca,z):a.call(null,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J,ca,z);throw Error("Only up to 20 arguments supported on functions");}
var G=function G(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return G.b(arguments[0],arguments[1]);case 3:return G.c(arguments[0],arguments[1],arguments[2]);case 4:return G.m(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return G.D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return G.l(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new M(c.slice(5),0))}};
G.b=function(a,b){var c=a.w;if(a.C){var d=ze(b,c+1);return d<=c?De(a,d,b):a.C(b)}return a.apply(a,Wd(b))};G.c=function(a,b,c){b=R(b,c);c=a.w;if(a.C){var d=ze(b,c+1);return d<=c?De(a,d,b):a.C(b)}return a.apply(a,Wd(b))};G.m=function(a,b,c,d){b=R(b,R(c,d));c=a.w;return a.C?(d=ze(b,c+1),d<=c?De(a,d,b):a.C(b)):a.apply(a,Wd(b))};G.D=function(a,b,c,d,e){b=R(b,R(c,R(d,e)));c=a.w;return a.C?(d=ze(b,c+1),d<=c?De(a,d,b):a.C(b)):a.apply(a,Wd(b))};
G.l=function(a,b,c,d,e,f){b=R(b,R(c,R(d,R(e,Ae(f)))));c=a.w;return a.C?(d=ze(b,c+1),d<=c?De(a,d,b):a.C(b)):a.apply(a,Wd(b))};G.C=function(a){var b=O(a),c=P(a);a=O(c);var d=P(c),c=O(d),e=P(d),d=O(e),f=P(e),e=O(f),f=P(f);return G.l(b,a,c,d,e,f)};G.w=5;
var Ee=function Ee(){"undefined"===typeof Wa&&(Wa=function(b,c){this.wd=b;this.ud=c;this.i=393216;this.B=0},Wa.prototype.S=function(b,c){return new Wa(this.wd,c)},Wa.prototype.P=function(){return this.ud},Wa.prototype.ta=function(){return!1},Wa.prototype.next=function(){return Error("No such element")},Wa.prototype.remove=function(){return Error("Unsupported operation")},Wa.sd=function(){return new V(null,2,5,W,[hd(Fe,new v(null,1,[Ge,Ic(He,Ic(yd))],null)),Ie],null)},Wa.uc=!0,Wa.Eb="cljs.core/t_cljs$core15706",
Wa.Jc=function(b,c){return fc(c,"cljs.core/t_cljs$core15706")});return new Wa(Ee,Je)};Ke;function Ke(a,b,c,d){this.ub=a;this.first=b;this.xa=c;this.o=d;this.i=31719628;this.B=0}g=Ke.prototype;g.S=function(a,b){return new Ke(this.ub,this.first,this.xa,b)};g.V=function(a,b){return R(b,ac(this))};g.Y=function(){return Wc};g.A=function(a,b){return null!=ac(this)?gd(this,b):Id(b)&&null==N(b)};g.N=function(){return bd(this)};g.U=function(){null!=this.ub&&this.ub.step(this);return null==this.xa?null:this};
g.$=function(){null!=this.ub&&ac(this);return null==this.xa?null:this.first};g.ra=function(){null!=this.ub&&ac(this);return null==this.xa?Wc:this.xa};g.va=function(){null!=this.ub&&ac(this);return null==this.xa?null:ac(this.xa)};Ke.prototype[pb]=function(){return Yc(this)};function Le(a,b){for(;;){if(null==N(b))return!0;var c;c=O(b);c=a.a?a.a(c):a.call(null,c);if(y(c)){c=a;var d=P(b);a=c;b=d}else return!1}}
function Me(a){for(var b=Yd;;)if(N(a)){var c;c=O(a);c=b.a?b.a(c):b.call(null,c);if(y(c))return c;a=P(a)}else return null}
function Ne(a){return function(){function b(b,c){return nb(a.b?a.b(b,c):a.call(null,b,c))}function c(b){return nb(a.a?a.a(b):a.call(null,b))}function d(){return nb(a.v?a.v():a.call(null))}var e=null,f=function(){function b(a,d,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new M(h,0)}return c.call(this,a,d,f)}function c(b,d,e){return nb(G.m(a,b,d,e))}b.w=2;b.C=function(a){var b=O(a);a=P(a);var d=O(a);a=Vc(a);return c(b,d,a)};b.l=
c;return b}(),e=function(a,e,l){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,a);case 2:return b.call(this,a,e);default:var m=null;if(2<arguments.length){for(var m=0,n=Array(arguments.length-2);m<n.length;)n[m]=arguments[m+2],++m;m=new M(n,0)}return f.l(a,e,m)}throw Error("Invalid arity: "+arguments.length);};e.w=2;e.C=f.C;e.v=d;e.a=c;e.b=b;e.l=f.l;return e}()}
var Oe=function Oe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Oe.v();case 1:return Oe.a(arguments[0]);case 2:return Oe.b(arguments[0],arguments[1]);case 3:return Oe.c(arguments[0],arguments[1],arguments[2]);default:return Oe.l(arguments[0],arguments[1],arguments[2],new M(c.slice(3),0))}};Oe.v=function(){return Yd};Oe.a=function(a){return a};
Oe.b=function(a,b){return function(){function c(c,d,e){c=b.c?b.c(c,d,e):b.call(null,c,d,e);return a.a?a.a(c):a.call(null,c)}function d(c,d){var e=b.b?b.b(c,d):b.call(null,c,d);return a.a?a.a(e):a.call(null,e)}function e(c){c=b.a?b.a(c):b.call(null,c);return a.a?a.a(c):a.call(null,c)}function f(){var c=b.v?b.v():b.call(null);return a.a?a.a(c):a.call(null,c)}var h=null,k=function(){function c(a,b,e,f){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+
3],++h;h=new M(k,0)}return d.call(this,a,b,e,h)}function d(c,e,f,h){c=G.D(b,c,e,f,h);return a.a?a.a(c):a.call(null,c)}c.w=3;c.C=function(a){var b=O(a);a=P(a);var c=O(a);a=P(a);var e=O(a);a=Vc(a);return d(b,c,e,a)};c.l=d;return c}(),h=function(a,b,h,p){switch(arguments.length){case 0:return f.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,h);default:var q=null;if(3<arguments.length){for(var q=0,r=Array(arguments.length-3);q<r.length;)r[q]=arguments[q+
3],++q;q=new M(r,0)}return k.l(a,b,h,q)}throw Error("Invalid arity: "+arguments.length);};h.w=3;h.C=k.C;h.v=f;h.a=e;h.b=d;h.c=c;h.l=k.l;return h}()};
Oe.c=function(a,b,c){return function(){function d(d,e,f){d=c.c?c.c(d,e,f):c.call(null,d,e,f);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}function e(d,e){var f;f=c.b?c.b(d,e):c.call(null,d,e);f=b.a?b.a(f):b.call(null,f);return a.a?a.a(f):a.call(null,f)}function f(d){d=c.a?c.a(d):c.call(null,d);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}function h(){var d;d=c.v?c.v():c.call(null);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}var k=null,l=function(){function d(a,
b,c,f){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new M(k,0)}return e.call(this,a,b,c,h)}function e(d,f,h,k){d=G.D(c,d,f,h,k);d=b.a?b.a(d):b.call(null,d);return a.a?a.a(d):a.call(null,d)}d.w=3;d.C=function(a){var b=O(a);a=P(a);var c=O(a);a=P(a);var d=O(a);a=Vc(a);return e(b,c,d,a)};d.l=e;return d}(),k=function(a,b,c,k){switch(arguments.length){case 0:return h.call(this);case 1:return f.call(this,a);case 2:return e.call(this,a,b);
case 3:return d.call(this,a,b,c);default:var r=null;if(3<arguments.length){for(var r=0,u=Array(arguments.length-3);r<u.length;)u[r]=arguments[r+3],++r;r=new M(u,0)}return l.l(a,b,c,r)}throw Error("Invalid arity: "+arguments.length);};k.w=3;k.C=l.C;k.v=h;k.a=f;k.b=e;k.c=d;k.l=l.l;return k}()};
Oe.l=function(a,b,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new M(e,0)}return c.call(this,d)}function c(b){b=G.b(O(a),b);for(var d=P(a);;)if(d)b=O(d).call(null,b),d=P(d);else return b}b.w=0;b.C=function(a){a=N(a);return c(a)};b.l=c;return b}()}(oe(R(a,R(b,R(c,d)))))};Oe.C=function(a){var b=O(a),c=P(a);a=O(c);var d=P(c),c=O(d),d=P(d);return Oe.l(b,a,c,d)};Oe.w=3;Pe;
function Qe(a,b,c,d){this.state=a;this.o=b;this.Ad=c;this.ic=d;this.B=16386;this.i=6455296}g=Qe.prototype;g.equiv=function(a){return this.A(null,a)};g.A=function(a,b){return this===b};g.Wb=function(){return this.state};g.P=function(){return this.o};
g.Hc=function(a,b,c){a=N(this.ic);for(var d=null,e=0,f=0;;)if(f<e){var h=d.X(null,f),k=U(h,0),h=U(h,1);h.m?h.m(k,this,b,c):h.call(null,k,this,b,c);f+=1}else if(a=N(a))Od(a)?(d=tc(a),a=uc(a),k=d,e=S(d),d=k):(d=O(a),k=U(d,0),h=U(d,1),h.m?h.m(k,this,b,c):h.call(null,k,this,b,c),a=P(a),d=null,e=0),f=0;else return null};g.Gc=function(a,b,c){this.ic=Cd.c(this.ic,b,c);return this};g.N=function(){return la(this)};
var Re=function Re(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Re.a(arguments[0]);default:return Re.l(arguments[0],new M(c.slice(1),0))}};Re.a=function(a){return new Qe(a,null,null,null)};Re.l=function(a,b){var c=null!=b&&(b.i&64||b.Va)?G.b(fd,b):b,d=K.b(c,fb),c=K.b(c,Se);return new Qe(a,d,c,null)};Re.C=function(a){var b=O(a);a=P(a);return Re.l(b,a)};Re.w=1;Te;
function Ue(a,b){if(a instanceof Qe){var c=a.Ad;if(null!=c&&!y(c.a?c.a(b):c.call(null,b)))throw Error([F("Assert failed: "),F("Validator rejected reference state"),F("\n"),F(function(){var a=Ic(Ve,We);return Te.a?Te.a(a):Te.call(null,a)}())].join(""));c=a.state;a.state=b;null!=a.ic&&jc(a,c,b);return b}return yc(a,b)}
var Xe=function Xe(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Xe.b(arguments[0],arguments[1]);case 3:return Xe.c(arguments[0],arguments[1],arguments[2]);case 4:return Xe.m(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Xe.l(arguments[0],arguments[1],arguments[2],arguments[3],new M(c.slice(4),0))}};Xe.b=function(a,b){var c;a instanceof Qe?(c=a.state,c=b.a?b.a(c):b.call(null,c),c=Ue(a,c)):c=zc.b(a,b);return c};
Xe.c=function(a,b,c){if(a instanceof Qe){var d=a.state;b=b.b?b.b(d,c):b.call(null,d,c);a=Ue(a,b)}else a=zc.c(a,b,c);return a};Xe.m=function(a,b,c,d){if(a instanceof Qe){var e=a.state;b=b.c?b.c(e,c,d):b.call(null,e,c,d);a=Ue(a,b)}else a=zc.m(a,b,c,d);return a};Xe.l=function(a,b,c,d,e){return a instanceof Qe?Ue(a,G.D(b,a.state,c,d,e)):zc.D(a,b,c,d,e)};Xe.C=function(a){var b=O(a),c=P(a);a=O(c);var d=P(c),c=O(d),e=P(d),d=O(e),e=P(e);return Xe.l(b,a,c,d,e)};Xe.w=4;
function Ye(a){this.state=a;this.i=32768;this.B=0}Ye.prototype.Wb=function(){return this.state};function Pe(a){return new Ye(a)}
var he=function he(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return he.a(arguments[0]);case 2:return he.b(arguments[0],arguments[1]);case 3:return he.c(arguments[0],arguments[1],arguments[2]);case 4:return he.m(arguments[0],arguments[1],arguments[2],arguments[3]);default:return he.l(arguments[0],arguments[1],arguments[2],arguments[3],new M(c.slice(4),0))}};
he.a=function(a){return function(b){return function(){function c(c,d){var e=a.a?a.a(d):a.call(null,d);return b.b?b.b(c,e):b.call(null,c,e)}function d(a){return b.a?b.a(a):b.call(null,a)}function e(){return b.v?b.v():b.call(null)}var f=null,h=function(){function c(a,b,e){var f=null;if(2<arguments.length){for(var f=0,h=Array(arguments.length-2);f<h.length;)h[f]=arguments[f+2],++f;f=new M(h,0)}return d.call(this,a,b,f)}function d(c,e,f){e=G.c(a,e,f);return b.b?b.b(c,e):b.call(null,c,e)}c.w=2;c.C=function(a){var b=
O(a);a=P(a);var c=O(a);a=Vc(a);return d(b,c,a)};c.l=d;return c}(),f=function(a,b,f){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var n=null;if(2<arguments.length){for(var n=0,p=Array(arguments.length-2);n<p.length;)p[n]=arguments[n+2],++n;n=new M(p,0)}return h.l(a,b,n)}throw Error("Invalid arity: "+arguments.length);};f.w=2;f.C=h.C;f.v=e;f.a=d;f.b=c;f.l=h.l;return f}()}};
he.b=function(a,b){return new se(null,function(){var c=N(b);if(c){if(Od(c)){for(var d=tc(c),e=S(d),f=we(e),h=0;;)if(h<e)ye(f,function(){var b=H.b(d,h);return a.a?a.a(b):a.call(null,b)}()),h+=1;else break;return xe(f.sa(),he.b(a,uc(c)))}return R(function(){var b=O(c);return a.a?a.a(b):a.call(null,b)}(),he.b(a,Vc(c)))}return null},null,null)};
he.c=function(a,b,c){return new se(null,function(){var d=N(b),e=N(c);if(d&&e){var f=R,h;h=O(d);var k=O(e);h=a.b?a.b(h,k):a.call(null,h,k);d=f(h,he.c(a,Vc(d),Vc(e)))}else d=null;return d},null,null)};he.m=function(a,b,c,d){return new se(null,function(){var e=N(b),f=N(c),h=N(d);if(e&&f&&h){var k=R,l;l=O(e);var m=O(f),n=O(h);l=a.c?a.c(l,m,n):a.call(null,l,m,n);e=k(l,he.m(a,Vc(e),Vc(f),Vc(h)))}else e=null;return e},null,null)};
he.l=function(a,b,c,d,e){var f=function k(a){return new se(null,function(){var b=he.b(N,a);return Le(Yd,b)?R(he.b(O,b),k(he.b(Vc,b))):null},null,null)};return he.b(function(){return function(b){return G.b(a,b)}}(f),f(xd.l(e,d,L([c,b],0))))};he.C=function(a){var b=O(a),c=P(a);a=O(c);var d=P(c),c=O(d),e=P(d),d=O(e),e=P(e);return he.l(b,a,c,d,e)};he.w=4;
function Ze(a,b){if("number"!==typeof a)throw Error([F("Assert failed: "),F(function(){var a=Ic($e,af);return Te.a?Te.a(a):Te.call(null,a)}())].join(""));return new se(null,function(){if(0<a){var c=N(b);return c?R(O(c),Ze(a-1,Vc(c))):null}return null},null,null)}function bf(a){return new se(null,function(b){return function(){return b(1,a)}}(function(a,c){for(;;){var d=N(c);if(0<a&&d){var e=a-1,d=Vc(d);a=e;c=d}else return d}}),null,null)}
function cf(a){return new se(null,function(){return R(a,cf(a))},null,null)}var df=function df(b,c){return R(c,new se(null,function(){return df(b,b.a?b.a(c):b.call(null,c))},null,null))},ef=function ef(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ef.b(arguments[0],arguments[1]);default:return ef.l(arguments[0],arguments[1],new M(c.slice(2),0))}};
ef.b=function(a,b){return new se(null,function(){var c=N(a),d=N(b);return c&&d?R(O(c),R(O(d),ef.b(Vc(c),Vc(d)))):null},null,null)};ef.l=function(a,b,c){return new se(null,function(){var d=he.b(N,xd.l(c,b,L([a],0)));return Le(Yd,d)?Be.b(he.b(O,d),G.b(ef,he.b(Vc,d))):null},null,null)};ef.C=function(a){var b=O(a),c=P(a);a=O(c);c=P(c);return ef.l(b,a,c)};ef.w=2;function ff(a){return bf(ef.b(cf("L"),a))}gf;
function hf(a,b){return new se(null,function(){var c=N(b);if(c){if(Od(c)){for(var d=tc(c),e=S(d),f=we(e),h=0;;)if(h<e){var k;k=H.b(d,h);k=a.a?a.a(k):a.call(null,k);y(k)&&(k=H.b(d,h),f.add(k));h+=1}else break;return xe(f.sa(),hf(a,uc(c)))}d=O(c);c=Vc(c);return y(a.a?a.a(d):a.call(null,d))?R(d,hf(a,c)):hf(a,c)}return null},null,null)}
function jf(a){return function c(a){return new se(null,function(){var e=R,f;y(Sd.a?Sd.a(a):Sd.call(null,a))?(f=L([N.a?N.a(a):N.call(null,a)],0),f=G.b(Be,G.c(he,c,f))):f=null;return e(a,f)},null,null)}(a)}function kf(a,b){var c;null!=a?null!=a&&(a.B&4||a.Ed)?(c=rb.c(mc,lc(a),b),c=nc(c),c=hd(c,Gd(a))):c=rb.c(wb,a,b):c=rb.c(xd,Wc,b);return c}function lf(a,b,c){return kf(yd,he.c(a,b,c))}
var mf=function mf(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return mf.c(arguments[0],arguments[1],arguments[2]);case 4:return mf.m(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return mf.D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return mf.W(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);default:return mf.l(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5],new M(c.slice(6),0))}};mf.c=function(a,b,c){return Cd.c(a,b,function(){var d=K.b(a,b);return c.a?c.a(d):c.call(null,d)}())};mf.m=function(a,b,c,d){return Cd.c(a,b,function(){var e=K.b(a,b);return c.b?c.b(e,d):c.call(null,e,d)}())};mf.D=function(a,b,c,d,e){return Cd.c(a,b,function(){var f=K.b(a,b);return c.c?c.c(f,d,e):c.call(null,f,d,e)}())};mf.W=function(a,b,c,d,e,f){return Cd.c(a,b,function(){var h=K.b(a,b);return c.m?c.m(h,d,e,f):c.call(null,h,d,e,f)}())};
mf.l=function(a,b,c,d,e,f,h){return Cd.c(a,b,G.l(c,K.b(a,b),d,e,f,L([h],0)))};mf.C=function(a){var b=O(a),c=P(a);a=O(c);var d=P(c),c=O(d),e=P(d),d=O(e),f=P(e),e=O(f),h=P(f),f=O(h),h=P(h);return mf.l(b,a,c,d,e,f,h)};mf.w=6;function nf(a,b){this.O=a;this.f=b}function of(a){return new nf(a,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function pf(a){return new nf(a.O,qb(a.f))}
function qf(a){a=a.j;return 32>a?0:a-1>>>5<<5}function rf(a,b,c){for(;;){if(0===b)return c;var d=of(a);d.f[0]=c;c=d;b-=5}}var sf=function sf(b,c,d,e){var f=pf(d),h=b.j-1>>>c&31;5===c?f.f[h]=e:(d=d.f[h],b=null!=d?sf(b,c-5,d,e):rf(null,c-5,e),f.f[h]=b);return f};function tf(a,b){throw Error([F("No item "),F(a),F(" in vector of length "),F(b)].join(""));}function uf(a,b){if(b>=qf(a))return a.I;for(var c=a.root,d=a.shift;;)if(0<d)var e=d-5,c=c.f[b>>>d&31],d=e;else return c.f}
function vf(a,b){return 0<=b&&b<a.j?uf(a,b):tf(b,a.j)}var wf=function wf(b,c,d,e,f){var h=pf(d);if(0===c)h.f[e&31]=f;else{var k=e>>>c&31;b=wf(b,c-5,d.f[k],e,f);h.f[k]=b}return h},xf=function xf(b,c,d){var e=b.j-2>>>c&31;if(5<c){b=xf(b,c-5,d.f[e]);if(null==b&&0===e)return null;d=pf(d);d.f[e]=b;return d}if(0===e)return null;d=pf(d);d.f[e]=null;return d};function yf(a,b,c,d,e,f){this.s=a;this.Tb=b;this.f=c;this.Ga=d;this.start=e;this.end=f}yf.prototype.ta=function(){return this.s<this.end};
yf.prototype.next=function(){32===this.s-this.Tb&&(this.f=uf(this.Ga,this.s),this.Tb+=32);var a=this.f[this.s&31];this.s+=1;return a};zf;Af;Bf;Q;Cf;Df;Ef;function V(a,b,c,d,e,f){this.o=a;this.j=b;this.shift=c;this.root=d;this.I=e;this.u=f;this.i=167668511;this.B=8196}g=V.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};g.M=function(a,b){return Eb.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?H.c(this,b,c):c};
g.X=function(a,b){return vf(this,b)[b&31]};g.Ca=function(a,b,c){return 0<=b&&b<this.j?uf(this,b)[b&31]:c};g.cb=function(a,b,c){if(0<=b&&b<this.j)return qf(this)<=b?(a=qb(this.I),a[b&31]=c,new V(this.o,this.j,this.shift,this.root,a,null)):new V(this.o,this.j,this.shift,wf(this,this.shift,this.root,b,c),this.I,null);if(b===this.j)return wb(this,c);throw Error([F("Index "),F(b),F(" out of bounds  [0,"),F(this.j),F("]")].join(""));};
g.Ma=function(){var a=this.j;return new yf(0,0,0<S(this)?uf(this,0):null,this,0,a)};g.P=function(){return this.o};g.aa=function(){return this.j};g.zb=function(){return H.b(this,0)};g.Ab=function(){return H.b(this,1)};g.Wa=function(){return 0<this.j?H.b(this,this.j-1):null};
g.Xa=function(){if(0===this.j)throw Error("Can't pop empty vector");if(1===this.j)return Vb(yd,this.o);if(1<this.j-qf(this))return new V(this.o,this.j-1,this.shift,this.root,this.I.slice(0,-1),null);var a=uf(this,this.j-2),b=xf(this,this.shift,this.root),b=null==b?W:b,c=this.j-1;return 5<this.shift&&null==b.f[1]?new V(this.o,c,this.shift-5,b.f[0],a,null):new V(this.o,c,this.shift,b,a,null)};g.Yb=function(){return 0<this.j?new rd(this,this.j-1,null):null};
g.N=function(){var a=this.u;return null!=a?a:this.u=a=bd(this)};g.A=function(a,b){if(b instanceof V)if(this.j===S(b))for(var c=Ac(this),d=Ac(b);;)if(y(c.ta())){var e=c.next(),f=d.next();if(!Jc.b(e,f))return!1}else return!0;else return!1;else return gd(this,b)};g.lb=function(){return new Bf(this.j,this.shift,zf.a?zf.a(this.root):zf.call(null,this.root),Af.a?Af.a(this.I):Af.call(null,this.I))};g.Y=function(){return hd(yd,this.o)};g.ba=function(a,b){return ld(this,b)};
g.ca=function(a,b,c){a=0;for(var d=c;;)if(a<this.j){var e=uf(this,a);c=e.length;a:for(var f=0;;)if(f<c){var h=e[f],d=b.b?b.b(d,h):b.call(null,d,h);if(kd(d)){e=d;break a}f+=1}else{e=d;break a}if(kd(e))return Q.a?Q.a(e):Q.call(null,e);a+=c;d=e}else return d};g.$a=function(a,b,c){if("number"===typeof b)return Qb(this,b,c);throw Error("Vector's key for assoc must be a number.");};
g.U=function(){if(0===this.j)return null;if(32>=this.j)return new M(this.I,0);var a;a:{a=this.root;for(var b=this.shift;;)if(0<b)b-=5,a=a.f[0];else{a=a.f;break a}}return Ef.m?Ef.m(this,a,0,0):Ef.call(null,this,a,0,0)};g.S=function(a,b){return new V(b,this.j,this.shift,this.root,this.I,this.u)};
g.V=function(a,b){if(32>this.j-qf(this)){for(var c=this.I.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.I[e],e+=1;else break;d[c]=b;return new V(this.o,this.j+1,this.shift,this.root,d,null)}c=(d=this.j>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=of(null),d.f[0]=this.root,e=rf(null,this.shift,new nf(null,this.I)),d.f[1]=e):d=sf(this,this.shift,this.root,new nf(null,this.I));return new V(this.o,this.j+1,c,d,[b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.X(null,c);case 3:return this.Ca(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.X(null,c)};a.c=function(a,c,d){return this.Ca(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(qb(b)))};g.a=function(a){return this.X(null,a)};g.b=function(a,b){return this.Ca(null,a,b)};
var W=new nf(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),yd=new V(null,0,5,W,[],cd);V.prototype[pb]=function(){return Yc(this)};function Xd(a){if(mb(a))a:{var b=a.length;if(32>b)a=new V(null,b,5,W,a,null);else for(var c=32,d=(new V(null,32,5,W,a.slice(0,32),null)).lb(null);;)if(c<b)var e=c+1,d=Ce.b(d,a[c]),c=e;else{a=nc(d);break a}}else a=nc(rb.c(mc,lc(yd),a));return a}Ff;
function Md(a,b,c,d,e,f){this.Ea=a;this.node=b;this.s=c;this.da=d;this.o=e;this.u=f;this.i=32375020;this.B=1536}g=Md.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};g.P=function(){return this.o};g.va=function(){if(this.da+1<this.node.length){var a;a=this.Ea;var b=this.node,c=this.s,d=this.da+1;a=Ef.m?Ef.m(a,b,c,d):Ef.call(null,a,b,c,d);return null==a?null:a}return vc(this)};g.N=function(){var a=this.u;return null!=a?a:this.u=a=bd(this)};
g.A=function(a,b){return gd(this,b)};g.Y=function(){return hd(yd,this.o)};g.ba=function(a,b){var c;c=this.Ea;var d=this.s+this.da,e=S(this.Ea);c=Ff.c?Ff.c(c,d,e):Ff.call(null,c,d,e);return ld(c,b)};g.ca=function(a,b,c){a=this.Ea;var d=this.s+this.da,e=S(this.Ea);a=Ff.c?Ff.c(a,d,e):Ff.call(null,a,d,e);return md(a,b,c)};g.$=function(){return this.node[this.da]};
g.ra=function(){if(this.da+1<this.node.length){var a;a=this.Ea;var b=this.node,c=this.s,d=this.da+1;a=Ef.m?Ef.m(a,b,c,d):Ef.call(null,a,b,c,d);return null==a?Wc:a}return uc(this)};g.U=function(){return this};g.qc=function(){var a=this.node;return new ue(a,this.da,a.length)};g.rc=function(){var a=this.s+this.node.length;if(a<tb(this.Ea)){var b=this.Ea,c=uf(this.Ea,a);return Ef.m?Ef.m(b,c,a,0):Ef.call(null,b,c,a,0)}return Wc};
g.S=function(a,b){return Ef.D?Ef.D(this.Ea,this.node,this.s,this.da,b):Ef.call(null,this.Ea,this.node,this.s,this.da,b)};g.V=function(a,b){return R(b,this)};g.pc=function(){var a=this.s+this.node.length;if(a<tb(this.Ea)){var b=this.Ea,c=uf(this.Ea,a);return Ef.m?Ef.m(b,c,a,0):Ef.call(null,b,c,a,0)}return null};Md.prototype[pb]=function(){return Yc(this)};
var Ef=function Ef(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Ef.c(arguments[0],arguments[1],arguments[2]);case 4:return Ef.m(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Ef.D(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};Ef.c=function(a,b,c){return new Md(a,vf(a,b),b,c,null,null)};
Ef.m=function(a,b,c,d){return new Md(a,b,c,d,null,null)};Ef.D=function(a,b,c,d,e){return new Md(a,b,c,d,e,null)};Ef.w=5;Gf;function Hf(a,b,c,d,e){this.o=a;this.Ga=b;this.start=c;this.end=d;this.u=e;this.i=167666463;this.B=8192}g=Hf.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};g.M=function(a,b){return Eb.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?H.c(this,b,c):c};
g.X=function(a,b){return 0>b||this.end<=this.start+b?tf(b,this.end-this.start):H.b(this.Ga,this.start+b)};g.Ca=function(a,b,c){return 0>b||this.end<=this.start+b?c:H.c(this.Ga,this.start+b,c)};g.cb=function(a,b,c){var d=this.start+b;a=this.o;c=Cd.c(this.Ga,d,c);b=this.start;var e=this.end,d=d+1,d=e>d?e:d;return Gf.D?Gf.D(a,c,b,d,null):Gf.call(null,a,c,b,d,null)};g.P=function(){return this.o};g.aa=function(){return this.end-this.start};g.Wa=function(){return H.b(this.Ga,this.end-1)};
g.Xa=function(){if(this.start===this.end)throw Error("Can't pop empty vector");var a=this.o,b=this.Ga,c=this.start,d=this.end-1;return Gf.D?Gf.D(a,b,c,d,null):Gf.call(null,a,b,c,d,null)};g.Yb=function(){return this.start!==this.end?new rd(this,this.end-this.start-1,null):null};g.N=function(){var a=this.u;return null!=a?a:this.u=a=bd(this)};g.A=function(a,b){return gd(this,b)};g.Y=function(){return hd(yd,this.o)};g.ba=function(a,b){return ld(this,b)};g.ca=function(a,b,c){return md(this,b,c)};
g.$a=function(a,b,c){if("number"===typeof b)return Qb(this,b,c);throw Error("Subvec's key for assoc must be a number.");};g.U=function(){var a=this;return function(b){return function d(e){return e===a.end?null:R(H.b(a.Ga,e),new se(null,function(){return function(){return d(e+1)}}(b),null,null))}}(this)(a.start)};g.S=function(a,b){return Gf.D?Gf.D(b,this.Ga,this.start,this.end,this.u):Gf.call(null,b,this.Ga,this.start,this.end,this.u)};
g.V=function(a,b){var c=this.o,d=Qb(this.Ga,this.end,b),e=this.start,f=this.end+1;return Gf.D?Gf.D(c,d,e,f,null):Gf.call(null,c,d,e,f,null)};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.X(null,c);case 3:return this.Ca(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.X(null,c)};a.c=function(a,c,d){return this.Ca(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(qb(b)))};
g.a=function(a){return this.X(null,a)};g.b=function(a,b){return this.Ca(null,a,b)};Hf.prototype[pb]=function(){return Yc(this)};function Gf(a,b,c,d,e){for(;;)if(b instanceof Hf)c=b.start+c,d=b.start+d,b=b.Ga;else{var f=S(b);if(0>c||0>d||c>f||d>f)throw Error("Index out of bounds");return new Hf(a,b,c,d,e)}}
var Ff=function Ff(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ff.b(arguments[0],arguments[1]);case 3:return Ff.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};Ff.b=function(a,b){return Ff.c(a,b,S(a))};Ff.c=function(a,b,c){return Gf(null,a,b,c,null)};Ff.w=3;function If(a,b){return a===b.O?b:new nf(a,qb(b.f))}function zf(a){return new nf({},qb(a.f))}
function Af(a){var b=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];Qd(a,0,b,0,a.length);return b}var Jf=function Jf(b,c,d,e){d=If(b.root.O,d);var f=b.j-1>>>c&31;if(5===c)b=e;else{var h=d.f[f];b=null!=h?Jf(b,c-5,h,e):rf(b.root.O,c-5,e)}d.f[f]=b;return d};function Bf(a,b,c,d){this.j=a;this.shift=b;this.root=c;this.I=d;this.B=88;this.i=275}g=Bf.prototype;
g.bb=function(a,b){if(this.root.O){if(32>this.j-qf(this))this.I[this.j&31]=b;else{var c=new nf(this.root.O,this.I),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=b;this.I=d;if(this.j>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=rf(this.root.O,this.shift,c);this.root=new nf(this.root.O,d);this.shift=e}else this.root=Jf(this,this.shift,this.root,c)}this.j+=1;return this}throw Error("conj! after persistent!");};g.mb=function(){if(this.root.O){this.root.O=null;var a=this.j-qf(this),b=Array(a);Qd(this.I,0,b,0,a);return new V(null,this.j,this.shift,this.root,b,null)}throw Error("persistent! called twice");};
g.Db=function(a,b,c){if("number"===typeof b)return pc(this,b,c);throw Error("TransientVector's key for assoc! must be a number.");};
g.Fc=function(a,b,c){var d=this;if(d.root.O){if(0<=b&&b<d.j)return qf(this)<=b?d.I[b&31]=c:(a=function(){return function f(a,k){var l=If(d.root.O,k);if(0===a)l.f[b&31]=c;else{var m=b>>>a&31,n=f(a-5,l.f[m]);l.f[m]=n}return l}}(this).call(null,d.shift,d.root),d.root=a),this;if(b===d.j)return mc(this,c);throw Error([F("Index "),F(b),F(" out of bounds for TransientVector of length"),F(d.j)].join(""));}throw Error("assoc! after persistent!");};
g.aa=function(){if(this.root.O)return this.j;throw Error("count after persistent!");};g.X=function(a,b){if(this.root.O)return vf(this,b)[b&31];throw Error("nth after persistent!");};g.Ca=function(a,b,c){return 0<=b&&b<this.j?H.b(this,b):c};g.M=function(a,b){return Eb.c(this,b,null)};g.H=function(a,b,c){return"number"===typeof b?H.c(this,b,c):c};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.M(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.M(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(qb(b)))};g.a=function(a){return this.M(null,a)};g.b=function(a,b){return this.H(null,a,b)};function Kf(a,b){this.qb=a;this.Qb=b}
Kf.prototype.ta=function(){var a=null!=this.qb&&N(this.qb);return a?a:(a=null!=this.Qb)?this.Qb.ta():a};Kf.prototype.next=function(){if(null!=this.qb){var a=O(this.qb);this.qb=P(this.qb);return a}if(null!=this.Qb&&this.Qb.ta())return this.Qb.next();throw Error("No such element");};Kf.prototype.remove=function(){return Error("Unsupported operation")};function Lf(a,b,c,d){this.o=a;this.Da=b;this.La=c;this.u=d;this.i=31850572;this.B=0}g=Lf.prototype;g.toString=function(){return Cc(this)};
g.equiv=function(a){return this.A(null,a)};g.P=function(){return this.o};g.N=function(){var a=this.u;return null!=a?a:this.u=a=bd(this)};g.A=function(a,b){return gd(this,b)};g.Y=function(){return hd(Wc,this.o)};g.$=function(){return O(this.Da)};g.ra=function(){var a=P(this.Da);return a?new Lf(this.o,a,this.La,null):null==this.La?ub(this):new Lf(this.o,this.La,null,null)};g.U=function(){return this};g.S=function(a,b){return new Lf(b,this.Da,this.La,this.u)};g.V=function(a,b){return R(b,this)};
Lf.prototype[pb]=function(){return Yc(this)};function Mf(a,b,c,d,e){this.o=a;this.count=b;this.Da=c;this.La=d;this.u=e;this.i=31858766;this.B=8192}g=Mf.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};g.Ma=function(){return new Kf(this.Da,Ac(this.La))};g.P=function(){return this.o};g.aa=function(){return this.count};g.Wa=function(){return O(this.Da)};
g.Xa=function(){if(y(this.Da)){var a=P(this.Da);return a?new Mf(this.o,this.count-1,a,this.La,null):new Mf(this.o,this.count-1,N(this.La),yd,null)}return this};g.N=function(){var a=this.u;return null!=a?a:this.u=a=bd(this)};g.A=function(a,b){return gd(this,b)};g.Y=function(){return hd(Nf,this.o)};g.$=function(){return O(this.Da)};g.ra=function(){return Vc(N(this))};g.U=function(){var a=N(this.La),b=this.Da;return y(y(b)?b:a)?new Lf(null,this.Da,N(a),null):null};
g.S=function(a,b){return new Mf(b,this.count,this.Da,this.La,this.u)};g.V=function(a,b){var c;y(this.Da)?(c=this.La,c=new Mf(this.o,this.count+1,this.Da,xd.b(y(c)?c:yd,b),null)):c=new Mf(this.o,this.count+1,xd.b(this.Da,b),yd,null);return c};var Nf=new Mf(null,0,null,yd,cd);Mf.prototype[pb]=function(){return Yc(this)};function Of(){this.i=2097152;this.B=0}Of.prototype.equiv=function(a){return this.A(null,a)};Of.prototype.A=function(){return!1};var Qf=new Of;
function Rf(a,b){return Td(Jd(b)?S(a)===S(b)?Le(Yd,he.b(function(a){return Jc.b(K.c(b,O(a),Qf),O(P(a)))},a)):null:null)}function Sf(a){this.F=a}Sf.prototype.next=function(){if(null!=this.F){var a=O(this.F),b=U(a,0),a=U(a,1);this.F=P(this.F);return{value:[b,a],done:!1}}return{value:null,done:!0}};function Tf(a){return new Sf(N(a))}function Uf(a){this.F=a}Uf.prototype.next=function(){if(null!=this.F){var a=O(this.F);this.F=P(this.F);return{value:[a,a],done:!1}}return{value:null,done:!0}};
function Vf(a,b){var c;if(b instanceof A)a:{c=a.length;for(var d=b.Na,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof A&&d===a[e].Na){c=e;break a}e+=2}}else if(ia(b)||"number"===typeof b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(b===a[d]){c=d;break a}d+=2}else if(b instanceof I)a:for(c=a.length,d=b.Pa,e=0;;){if(c<=e){c=-1;break a}if(a[e]instanceof I&&d===a[e].Pa){c=e;break a}e+=2}else if(null==b)a:for(c=a.length,d=0;;){if(c<=d){c=-1;break a}if(null==a[d]){c=d;break a}d+=2}else a:for(c=a.length,
d=0;;){if(c<=d){c=-1;break a}if(Jc.b(b,a[d])){c=d;break a}d+=2}return c}Wf;function Xf(a,b,c){this.f=a;this.s=b;this.ya=c;this.i=32374990;this.B=0}g=Xf.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};g.P=function(){return this.ya};g.va=function(){return this.s<this.f.length-2?new Xf(this.f,this.s+2,this.ya):null};g.aa=function(){return(this.f.length-this.s)/2};g.N=function(){return bd(this)};g.A=function(a,b){return gd(this,b)};
g.Y=function(){return hd(Wc,this.ya)};g.ba=function(a,b){return wd.b(b,this)};g.ca=function(a,b,c){return wd.c(b,c,this)};g.$=function(){return new V(null,2,5,W,[this.f[this.s],this.f[this.s+1]],null)};g.ra=function(){return this.s<this.f.length-2?new Xf(this.f,this.s+2,this.ya):Wc};g.U=function(){return this};g.S=function(a,b){return new Xf(this.f,this.s,b)};g.V=function(a,b){return R(b,this)};Xf.prototype[pb]=function(){return Yc(this)};Yf;Zf;function $f(a,b,c){this.f=a;this.s=b;this.j=c}
$f.prototype.ta=function(){return this.s<this.j};$f.prototype.next=function(){var a=new V(null,2,5,W,[this.f[this.s],this.f[this.s+1]],null);this.s+=2;return a};function v(a,b,c,d){this.o=a;this.j=b;this.f=c;this.u=d;this.i=16647951;this.B=8196}g=v.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};g.keys=function(){return Yc(Yf.a?Yf.a(this):Yf.call(null,this))};g.entries=function(){return Tf(N(this))};
g.values=function(){return Yc(Zf.a?Zf.a(this):Zf.call(null,this))};g.has=function(a){return Ud(this,a)};g.get=function(a,b){return this.H(null,a,b)};g.forEach=function(a){for(var b=N(this),c=null,d=0,e=0;;)if(e<d){var f=c.X(null,e),h=U(f,0),f=U(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=N(b))Od(b)?(c=tc(b),b=uc(b),h=c,d=S(c),c=h):(c=O(b),h=U(c,0),f=U(c,1),a.b?a.b(f,h):a.call(null,f,h),b=P(b),c=null,d=0),e=0;else return null};g.M=function(a,b){return Eb.c(this,b,null)};
g.H=function(a,b,c){a=Vf(this.f,b);return-1===a?c:this.f[a+1]};g.Ma=function(){return new $f(this.f,0,2*this.j)};g.P=function(){return this.o};g.aa=function(){return this.j};g.N=function(){var a=this.u;return null!=a?a:this.u=a=dd(this)};g.A=function(a,b){if(null!=b&&(b.i&1024||b.dd)){var c=this.f.length;if(this.j===b.aa(null))for(var d=0;;)if(d<c){var e=b.H(null,this.f[d],Rd);if(e!==Rd)if(Jc.b(this.f[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Rf(this,b)};
g.lb=function(){return new Wf({},this.f.length,qb(this.f))};g.Y=function(){return Vb(Je,this.o)};g.ba=function(a,b){return wd.b(b,this)};g.ca=function(a,b,c){return wd.c(b,c,this)};g.tc=function(a,b){if(0<=Vf(this.f,b)){var c=this.f.length,d=c-2;if(0===d)return ub(this);for(var d=Array(d),e=0,f=0;;){if(e>=c)return new v(this.o,this.j-1,d,null);Jc.b(b,this.f[e])||(d[f]=this.f[e],d[f+1]=this.f[e+1],f+=2);e+=2}}else return this};
g.$a=function(a,b,c){a=Vf(this.f,b);if(-1===a){if(this.j<ag){a=this.f;for(var d=a.length,e=Array(d+2),f=0;;)if(f<d)e[f]=a[f],f+=1;else break;e[d]=b;e[d+1]=c;return new v(this.o,this.j+1,e,null)}return Vb(Gb(kf(Dd,this),b,c),this.o)}if(c===this.f[a+1])return this;b=qb(this.f);b[a+1]=c;return new v(this.o,this.j,b,null)};g.oc=function(a,b){return-1!==Vf(this.f,b)};g.U=function(){var a=this.f;return 0<=a.length-2?new Xf(a,0,null):null};g.S=function(a,b){return new v(b,this.j,this.f,this.u)};
g.V=function(a,b){if(Kd(b))return Gb(this,H.b(b,0),H.b(b,1));for(var c=this,d=N(b);;){if(null==d)return c;var e=O(d);if(Kd(e))c=Gb(c,H.b(e,0),H.b(e,1)),d=P(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.M(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.M(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(qb(b)))};g.a=function(a){return this.M(null,a)};g.b=function(a,b){return this.H(null,a,b)};var Je=new v(null,0,[],ed),ag=8;v.prototype[pb]=function(){return Yc(this)};
bg;function Wf(a,b,c){this.ob=a;this.hb=b;this.f=c;this.i=258;this.B=56}g=Wf.prototype;g.aa=function(){if(y(this.ob))return ee(this.hb);throw Error("count after persistent!");};g.M=function(a,b){return Eb.c(this,b,null)};g.H=function(a,b,c){if(y(this.ob))return a=Vf(this.f,b),-1===a?c:this.f[a+1];throw Error("lookup after persistent!");};
g.bb=function(a,b){if(y(this.ob)){if(null!=b?b.i&2048||b.ed||(b.i?0:C(Jb,b)):C(Jb,b))return oc(this,je.a?je.a(b):je.call(null,b),ke.a?ke.a(b):ke.call(null,b));for(var c=N(b),d=this;;){var e=O(c);if(y(e))c=P(c),d=oc(d,je.a?je.a(e):je.call(null,e),ke.a?ke.a(e):ke.call(null,e));else return d}}else throw Error("conj! after persistent!");};g.mb=function(){if(y(this.ob))return this.ob=!1,new v(null,ee(this.hb),this.f,null);throw Error("persistent! called twice");};
g.Db=function(a,b,c){if(y(this.ob)){a=Vf(this.f,b);if(-1===a){if(this.hb+2<=2*ag)return this.hb+=2,this.f.push(b),this.f.push(c),this;a=bg.b?bg.b(this.hb,this.f):bg.call(null,this.hb,this.f);return oc(a,b,c)}c!==this.f[a+1]&&(this.f[a+1]=c);return this}throw Error("assoc! after persistent!");};cg;Bd;function bg(a,b){for(var c=lc(Dd),d=0;;)if(d<a)c=oc(c,b[d],b[d+1]),d+=2;else return c}function dg(){this.L=!1}eg;fg;Ue;gg;Re;Q;
function hg(a,b){return a===b?!0:a===b||a instanceof A&&b instanceof A&&a.Na===b.Na?!0:Jc.b(a,b)}function ig(a,b,c){a=qb(a);a[b]=c;return a}function jg(a,b){var c=Array(a.length-2);Qd(a,0,c,0,2*b);Qd(a,2*(b+1),c,2*b,c.length-2*b);return c}function kg(a,b,c,d){a=a.eb(b);a.f[c]=d;return a}lg;function mg(a,b,c,d){this.f=a;this.s=b;this.Pb=c;this.Ka=d}
mg.prototype.advance=function(){for(var a=this.f.length;;)if(this.s<a){var b=this.f[this.s],c=this.f[this.s+1];null!=b?b=this.Pb=new V(null,2,5,W,[b,c],null):null!=c?(b=Ac(c),b=b.ta()?this.Ka=b:!1):b=!1;this.s+=2;if(b)return!0}else return!1};mg.prototype.ta=function(){var a=null!=this.Pb;return a?a:(a=null!=this.Ka)?a:this.advance()};
mg.prototype.next=function(){if(null!=this.Pb){var a=this.Pb;this.Pb=null;return a}if(null!=this.Ka)return a=this.Ka.next(),this.Ka.ta()||(this.Ka=null),a;if(this.advance())return this.next();throw Error("No such element");};mg.prototype.remove=function(){return Error("Unsupported operation")};function ng(a,b,c){this.O=a;this.T=b;this.f=c}g=ng.prototype;g.eb=function(a){if(a===this.O)return this;var b=fe(this.T),c=Array(0>b?4:2*(b+1));Qd(this.f,0,c,0,2*b);return new ng(a,this.T,c)};
g.Kb=function(){return eg.a?eg.a(this.f):eg.call(null,this.f)};g.Ya=function(a,b,c,d){var e=1<<(b>>>a&31);if(0===(this.T&e))return d;var f=fe(this.T&e-1),e=this.f[2*f],f=this.f[2*f+1];return null==e?f.Ya(a+5,b,c,d):hg(c,e)?f:d};
g.Ja=function(a,b,c,d,e,f){var h=1<<(c>>>b&31),k=fe(this.T&h-1);if(0===(this.T&h)){var l=fe(this.T);if(2*l<this.f.length){a=this.eb(a);b=a.f;f.L=!0;a:for(c=2*(l-k),f=2*k+(c-1),l=2*(k+1)+(c-1);;){if(0===c)break a;b[l]=b[f];--l;--c;--f}b[2*k]=d;b[2*k+1]=e;a.T|=h;return a}if(16<=l){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>b&31]=og.Ja(a,b+5,c,d,e,f);for(e=d=0;;)if(32>d)0!==
(this.T>>>d&1)&&(k[d]=null!=this.f[e]?og.Ja(a,b+5,Qc(this.f[e]),this.f[e],this.f[e+1],f):this.f[e+1],e+=2),d+=1;else break;return new lg(a,l+1,k)}b=Array(2*(l+4));Qd(this.f,0,b,0,2*k);b[2*k]=d;b[2*k+1]=e;Qd(this.f,2*k,b,2*(k+1),2*(l-k));f.L=!0;a=this.eb(a);a.f=b;a.T|=h;return a}l=this.f[2*k];h=this.f[2*k+1];if(null==l)return l=h.Ja(a,b+5,c,d,e,f),l===h?this:kg(this,a,2*k+1,l);if(hg(d,l))return e===h?this:kg(this,a,2*k+1,e);f.L=!0;f=b+5;d=gg.Z?gg.Z(a,f,l,h,c,d,e):gg.call(null,a,f,l,h,c,d,e);e=2*k;
k=2*k+1;a=this.eb(a);a.f[e]=null;a.f[k]=d;return a};
g.Ia=function(a,b,c,d,e){var f=1<<(b>>>a&31),h=fe(this.T&f-1);if(0===(this.T&f)){var k=fe(this.T);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[b>>>a&31]=og.Ia(a+5,b,c,d,e);for(d=c=0;;)if(32>c)0!==(this.T>>>c&1)&&(h[c]=null!=this.f[d]?og.Ia(a+5,Qc(this.f[d]),this.f[d],this.f[d+1],e):this.f[d+1],d+=2),c+=1;else break;return new lg(null,k+1,h)}a=Array(2*(k+1));Qd(this.f,
0,a,0,2*h);a[2*h]=c;a[2*h+1]=d;Qd(this.f,2*h,a,2*(h+1),2*(k-h));e.L=!0;return new ng(null,this.T|f,a)}var l=this.f[2*h],f=this.f[2*h+1];if(null==l)return k=f.Ia(a+5,b,c,d,e),k===f?this:new ng(null,this.T,ig(this.f,2*h+1,k));if(hg(c,l))return d===f?this:new ng(null,this.T,ig(this.f,2*h+1,d));e.L=!0;e=this.T;k=this.f;a+=5;a=gg.W?gg.W(a,l,f,b,c,d):gg.call(null,a,l,f,b,c,d);c=2*h;h=2*h+1;d=qb(k);d[c]=null;d[h]=a;return new ng(null,e,d)};
g.Lb=function(a,b,c){var d=1<<(b>>>a&31);if(0===(this.T&d))return this;var e=fe(this.T&d-1),f=this.f[2*e],h=this.f[2*e+1];return null==f?(a=h.Lb(a+5,b,c),a===h?this:null!=a?new ng(null,this.T,ig(this.f,2*e+1,a)):this.T===d?null:new ng(null,this.T^d,jg(this.f,e))):hg(c,f)?new ng(null,this.T^d,jg(this.f,e)):this};g.Ma=function(){return new mg(this.f,0,null,null)};var og=new ng(null,0,[]);function pg(a,b,c){this.f=a;this.s=b;this.Ka=c}
pg.prototype.ta=function(){for(var a=this.f.length;;){if(null!=this.Ka&&this.Ka.ta())return!0;if(this.s<a){var b=this.f[this.s];this.s+=1;null!=b&&(this.Ka=Ac(b))}else return!1}};pg.prototype.next=function(){if(this.ta())return this.Ka.next();throw Error("No such element");};pg.prototype.remove=function(){return Error("Unsupported operation")};function lg(a,b,c){this.O=a;this.j=b;this.f=c}g=lg.prototype;g.eb=function(a){return a===this.O?this:new lg(a,this.j,qb(this.f))};
g.Kb=function(){return fg.a?fg.a(this.f):fg.call(null,this.f)};g.Ya=function(a,b,c,d){var e=this.f[b>>>a&31];return null!=e?e.Ya(a+5,b,c,d):d};g.Ja=function(a,b,c,d,e,f){var h=c>>>b&31,k=this.f[h];if(null==k)return a=kg(this,a,h,og.Ja(a,b+5,c,d,e,f)),a.j+=1,a;b=k.Ja(a,b+5,c,d,e,f);return b===k?this:kg(this,a,h,b)};
g.Ia=function(a,b,c,d,e){var f=b>>>a&31,h=this.f[f];if(null==h)return new lg(null,this.j+1,ig(this.f,f,og.Ia(a+5,b,c,d,e)));a=h.Ia(a+5,b,c,d,e);return a===h?this:new lg(null,this.j,ig(this.f,f,a))};
g.Lb=function(a,b,c){var d=b>>>a&31,e=this.f[d];if(null!=e){a=e.Lb(a+5,b,c);if(a===e)d=this;else if(null==a)if(8>=this.j)a:{e=this.f;a=e.length;b=Array(2*(this.j-1));c=0;for(var f=1,h=0;;)if(c<a)c!==d&&null!=e[c]&&(b[f]=e[c],f+=2,h|=1<<c),c+=1;else{d=new ng(null,h,b);break a}}else d=new lg(null,this.j-1,ig(this.f,d,a));else d=new lg(null,this.j,ig(this.f,d,a));return d}return this};g.Ma=function(){return new pg(this.f,0,null)};
function qg(a,b,c){b*=2;for(var d=0;;)if(d<b){if(hg(c,a[d]))return d;d+=2}else return-1}function rg(a,b,c,d){this.O=a;this.Qa=b;this.j=c;this.f=d}g=rg.prototype;g.eb=function(a){if(a===this.O)return this;var b=Array(2*(this.j+1));Qd(this.f,0,b,0,2*this.j);return new rg(a,this.Qa,this.j,b)};g.Kb=function(){return eg.a?eg.a(this.f):eg.call(null,this.f)};g.Ya=function(a,b,c,d){a=qg(this.f,this.j,c);return 0>a?d:hg(c,this.f[a])?this.f[a+1]:d};
g.Ja=function(a,b,c,d,e,f){if(c===this.Qa){b=qg(this.f,this.j,d);if(-1===b){if(this.f.length>2*this.j)return b=2*this.j,c=2*this.j+1,a=this.eb(a),a.f[b]=d,a.f[c]=e,f.L=!0,a.j+=1,a;c=this.f.length;b=Array(c+2);Qd(this.f,0,b,0,c);b[c]=d;b[c+1]=e;f.L=!0;d=this.j+1;a===this.O?(this.f=b,this.j=d,a=this):a=new rg(this.O,this.Qa,d,b);return a}return this.f[b+1]===e?this:kg(this,a,b+1,e)}return(new ng(a,1<<(this.Qa>>>b&31),[null,this,null,null])).Ja(a,b,c,d,e,f)};
g.Ia=function(a,b,c,d,e){return b===this.Qa?(a=qg(this.f,this.j,c),-1===a?(a=2*this.j,b=Array(a+2),Qd(this.f,0,b,0,a),b[a]=c,b[a+1]=d,e.L=!0,new rg(null,this.Qa,this.j+1,b)):Jc.b(this.f[a],d)?this:new rg(null,this.Qa,this.j,ig(this.f,a+1,d))):(new ng(null,1<<(this.Qa>>>a&31),[null,this])).Ia(a,b,c,d,e)};g.Lb=function(a,b,c){a=qg(this.f,this.j,c);return-1===a?this:1===this.j?null:new rg(null,this.Qa,this.j-1,jg(this.f,ee(a)))};g.Ma=function(){return new mg(this.f,0,null,null)};
var gg=function gg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return gg.W(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return gg.Z(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};
gg.W=function(a,b,c,d,e,f){var h=Qc(b);if(h===d)return new rg(null,h,2,[b,c,e,f]);var k=new dg;return og.Ia(a,h,b,c,k).Ia(a,d,e,f,k)};gg.Z=function(a,b,c,d,e,f,h){var k=Qc(c);if(k===e)return new rg(null,k,2,[c,d,f,h]);var l=new dg;return og.Ja(a,b,k,c,d,l).Ja(a,b,e,f,h,l)};gg.w=7;function sg(a,b,c,d,e){this.o=a;this.Za=b;this.s=c;this.F=d;this.u=e;this.i=32374860;this.B=0}g=sg.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};g.P=function(){return this.o};
g.N=function(){var a=this.u;return null!=a?a:this.u=a=bd(this)};g.A=function(a,b){return gd(this,b)};g.Y=function(){return hd(Wc,this.o)};g.ba=function(a,b){return wd.b(b,this)};g.ca=function(a,b,c){return wd.c(b,c,this)};g.$=function(){return null==this.F?new V(null,2,5,W,[this.Za[this.s],this.Za[this.s+1]],null):O(this.F)};
g.ra=function(){if(null==this.F){var a=this.Za,b=this.s+2;return eg.c?eg.c(a,b,null):eg.call(null,a,b,null)}var a=this.Za,b=this.s,c=P(this.F);return eg.c?eg.c(a,b,c):eg.call(null,a,b,c)};g.U=function(){return this};g.S=function(a,b){return new sg(b,this.Za,this.s,this.F,this.u)};g.V=function(a,b){return R(b,this)};sg.prototype[pb]=function(){return Yc(this)};
var eg=function eg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return eg.a(arguments[0]);case 3:return eg.c(arguments[0],arguments[1],arguments[2]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};eg.a=function(a){return eg.c(a,0,null)};
eg.c=function(a,b,c){if(null==c)for(c=a.length;;)if(b<c){if(null!=a[b])return new sg(null,a,b,null,null);var d=a[b+1];if(y(d)&&(d=d.Kb(),y(d)))return new sg(null,a,b+2,d,null);b+=2}else return null;else return new sg(null,a,b,c,null)};eg.w=3;function tg(a,b,c,d,e){this.o=a;this.Za=b;this.s=c;this.F=d;this.u=e;this.i=32374860;this.B=0}g=tg.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};g.P=function(){return this.o};
g.N=function(){var a=this.u;return null!=a?a:this.u=a=bd(this)};g.A=function(a,b){return gd(this,b)};g.Y=function(){return hd(Wc,this.o)};g.ba=function(a,b){return wd.b(b,this)};g.ca=function(a,b,c){return wd.c(b,c,this)};g.$=function(){return O(this.F)};g.ra=function(){var a=this.Za,b=this.s,c=P(this.F);return fg.m?fg.m(null,a,b,c):fg.call(null,null,a,b,c)};g.U=function(){return this};g.S=function(a,b){return new tg(b,this.Za,this.s,this.F,this.u)};g.V=function(a,b){return R(b,this)};
tg.prototype[pb]=function(){return Yc(this)};var fg=function fg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return fg.a(arguments[0]);case 4:return fg.m(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};fg.a=function(a){return fg.m(null,a,0,null)};
fg.m=function(a,b,c,d){if(null==d)for(d=b.length;;)if(c<d){var e=b[c];if(y(e)&&(e=e.Kb(),y(e)))return new tg(a,b,c+1,e,null);c+=1}else return null;else return new tg(a,b,c,d,null)};fg.w=4;cg;function ug(a,b,c){this.Ba=a;this.Uc=b;this.Ac=c}ug.prototype.ta=function(){return this.Ac&&this.Uc.ta()};ug.prototype.next=function(){if(this.Ac)return this.Uc.next();this.Ac=!0;return this.Ba};ug.prototype.remove=function(){return Error("Unsupported operation")};
function Bd(a,b,c,d,e,f){this.o=a;this.j=b;this.root=c;this.wa=d;this.Ba=e;this.u=f;this.i=16123663;this.B=8196}g=Bd.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};g.keys=function(){return Yc(Yf.a?Yf.a(this):Yf.call(null,this))};g.entries=function(){return Tf(N(this))};g.values=function(){return Yc(Zf.a?Zf.a(this):Zf.call(null,this))};g.has=function(a){return Ud(this,a)};g.get=function(a,b){return this.H(null,a,b)};
g.forEach=function(a){for(var b=N(this),c=null,d=0,e=0;;)if(e<d){var f=c.X(null,e),h=U(f,0),f=U(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=N(b))Od(b)?(c=tc(b),b=uc(b),h=c,d=S(c),c=h):(c=O(b),h=U(c,0),f=U(c,1),a.b?a.b(f,h):a.call(null,f,h),b=P(b),c=null,d=0),e=0;else return null};g.M=function(a,b){return Eb.c(this,b,null)};g.H=function(a,b,c){return null==b?this.wa?this.Ba:c:null==this.root?c:this.root.Ya(0,Qc(b),b,c)};
g.Ma=function(){var a=this.root?Ac(this.root):Ee;return this.wa?new ug(this.Ba,a,!1):a};g.P=function(){return this.o};g.aa=function(){return this.j};g.N=function(){var a=this.u;return null!=a?a:this.u=a=dd(this)};g.A=function(a,b){return Rf(this,b)};g.lb=function(){return new cg({},this.root,this.j,this.wa,this.Ba)};g.Y=function(){return Vb(Dd,this.o)};
g.tc=function(a,b){if(null==b)return this.wa?new Bd(this.o,this.j-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Lb(0,Qc(b),b);return c===this.root?this:new Bd(this.o,this.j-1,c,this.wa,this.Ba,null)};g.$a=function(a,b,c){if(null==b)return this.wa&&c===this.Ba?this:new Bd(this.o,this.wa?this.j:this.j+1,this.root,!0,c,null);a=new dg;b=(null==this.root?og:this.root).Ia(0,Qc(b),b,c,a);return b===this.root?this:new Bd(this.o,a.L?this.j+1:this.j,b,this.wa,this.Ba,null)};
g.oc=function(a,b){return null==b?this.wa:null==this.root?!1:this.root.Ya(0,Qc(b),b,Rd)!==Rd};g.U=function(){if(0<this.j){var a=null!=this.root?this.root.Kb():null;return this.wa?R(new V(null,2,5,W,[null,this.Ba],null),a):a}return null};g.S=function(a,b){return new Bd(b,this.j,this.root,this.wa,this.Ba,this.u)};
g.V=function(a,b){if(Kd(b))return Gb(this,H.b(b,0),H.b(b,1));for(var c=this,d=N(b);;){if(null==d)return c;var e=O(d);if(Kd(e))c=Gb(c,H.b(e,0),H.b(e,1)),d=P(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.M(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.M(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(qb(b)))};g.a=function(a){return this.M(null,a)};g.b=function(a,b){return this.H(null,a,b)};var Dd=new Bd(null,0,null,!1,null,ed);Bd.prototype[pb]=function(){return Yc(this)};
function cg(a,b,c,d,e){this.O=a;this.root=b;this.count=c;this.wa=d;this.Ba=e;this.i=258;this.B=56}function vg(a,b,c){if(a.O){if(null==b)a.Ba!==c&&(a.Ba=c),a.wa||(a.count+=1,a.wa=!0);else{var d=new dg;b=(null==a.root?og:a.root).Ja(a.O,0,Qc(b),b,c,d);b!==a.root&&(a.root=b);d.L&&(a.count+=1)}return a}throw Error("assoc! after persistent!");}g=cg.prototype;g.aa=function(){if(this.O)return this.count;throw Error("count after persistent!");};
g.M=function(a,b){return null==b?this.wa?this.Ba:null:null==this.root?null:this.root.Ya(0,Qc(b),b)};g.H=function(a,b,c){return null==b?this.wa?this.Ba:c:null==this.root?c:this.root.Ya(0,Qc(b),b,c)};
g.bb=function(a,b){var c;a:if(this.O)if(null!=b?b.i&2048||b.ed||(b.i?0:C(Jb,b)):C(Jb,b))c=vg(this,je.a?je.a(b):je.call(null,b),ke.a?ke.a(b):ke.call(null,b));else{c=N(b);for(var d=this;;){var e=O(c);if(y(e))c=P(c),d=vg(d,je.a?je.a(e):je.call(null,e),ke.a?ke.a(e):ke.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};g.mb=function(){var a;if(this.O)this.O=null,a=new Bd(null,this.count,this.root,this.wa,this.Ba,null);else throw Error("persistent! called twice");return a};
g.Db=function(a,b,c){return vg(this,b,c)};wg;xg;function xg(a,b,c,d,e){this.key=a;this.L=b;this.left=c;this.right=d;this.u=e;this.i=32402207;this.B=0}g=xg.prototype;g.replace=function(a,b,c,d){return new xg(a,b,c,d,null)};g.M=function(a,b){return H.c(this,b,null)};g.H=function(a,b,c){return H.c(this,b,c)};g.X=function(a,b){return 0===b?this.key:1===b?this.L:null};g.Ca=function(a,b,c){return 0===b?this.key:1===b?this.L:c};
g.cb=function(a,b,c){return(new V(null,2,5,W,[this.key,this.L],null)).cb(null,b,c)};g.P=function(){return null};g.aa=function(){return 2};g.zb=function(){return this.key};g.Ab=function(){return this.L};g.Wa=function(){return this.L};g.Xa=function(){return new V(null,1,5,W,[this.key],null)};g.N=function(){var a=this.u;return null!=a?a:this.u=a=bd(this)};g.A=function(a,b){return gd(this,b)};g.Y=function(){return yd};g.ba=function(a,b){return ld(this,b)};g.ca=function(a,b,c){return md(this,b,c)};
g.$a=function(a,b,c){return Cd.c(new V(null,2,5,W,[this.key,this.L],null),b,c)};g.U=function(){return wb(wb(Wc,this.L),this.key)};g.S=function(a,b){return hd(new V(null,2,5,W,[this.key,this.L],null),b)};g.V=function(a,b){return new V(null,3,5,W,[this.key,this.L,b],null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.M(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.M(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(qb(b)))};g.a=function(a){return this.M(null,a)};g.b=function(a,b){return this.H(null,a,b)};xg.prototype[pb]=function(){return Yc(this)};
function wg(a,b,c,d,e){this.key=a;this.L=b;this.left=c;this.right=d;this.u=e;this.i=32402207;this.B=0}g=wg.prototype;g.replace=function(a,b,c,d){return new wg(a,b,c,d,null)};g.M=function(a,b){return H.c(this,b,null)};g.H=function(a,b,c){return H.c(this,b,c)};g.X=function(a,b){return 0===b?this.key:1===b?this.L:null};g.Ca=function(a,b,c){return 0===b?this.key:1===b?this.L:c};g.cb=function(a,b,c){return(new V(null,2,5,W,[this.key,this.L],null)).cb(null,b,c)};g.P=function(){return null};g.aa=function(){return 2};
g.zb=function(){return this.key};g.Ab=function(){return this.L};g.Wa=function(){return this.L};g.Xa=function(){return new V(null,1,5,W,[this.key],null)};g.N=function(){var a=this.u;return null!=a?a:this.u=a=bd(this)};g.A=function(a,b){return gd(this,b)};g.Y=function(){return yd};g.ba=function(a,b){return ld(this,b)};g.ca=function(a,b,c){return md(this,b,c)};g.$a=function(a,b,c){return Cd.c(new V(null,2,5,W,[this.key,this.L],null),b,c)};g.U=function(){return wb(wb(Wc,this.L),this.key)};
g.S=function(a,b){return hd(new V(null,2,5,W,[this.key,this.L],null),b)};g.V=function(a,b){return new V(null,3,5,W,[this.key,this.L,b],null)};g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.M(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.M(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(qb(b)))};
g.a=function(a){return this.M(null,a)};g.b=function(a,b){return this.H(null,a,b)};wg.prototype[pb]=function(){return Yc(this)};je;var fd=function fd(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return fd.l(0<c.length?new M(c.slice(0),0):null)};fd.l=function(a){for(var b=N(a),c=lc(Dd);;)if(b){a=P(P(b));var d=O(b),b=O(P(b)),c=oc(c,d,b),b=a}else return nc(c)};fd.w=0;fd.C=function(a){return fd.l(N(a))};
function yg(a,b){this.G=a;this.ya=b;this.i=32374988;this.B=0}g=yg.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};g.P=function(){return this.ya};g.va=function(){var a=(null!=this.G?this.G.i&128||this.G.Xb||(this.G.i?0:C(Cb,this.G)):C(Cb,this.G))?this.G.va(null):P(this.G);return null==a?null:new yg(a,this.ya)};g.N=function(){return bd(this)};g.A=function(a,b){return gd(this,b)};g.Y=function(){return hd(Wc,this.ya)};g.ba=function(a,b){return wd.b(b,this)};
g.ca=function(a,b,c){return wd.c(b,c,this)};g.$=function(){return this.G.$(null).zb(null)};g.ra=function(){var a=(null!=this.G?this.G.i&128||this.G.Xb||(this.G.i?0:C(Cb,this.G)):C(Cb,this.G))?this.G.va(null):P(this.G);return null!=a?new yg(a,this.ya):Wc};g.U=function(){return this};g.S=function(a,b){return new yg(this.G,b)};g.V=function(a,b){return R(b,this)};yg.prototype[pb]=function(){return Yc(this)};function Yf(a){return(a=N(a))?new yg(a,null):null}function je(a){return Kb(a)}
function zg(a,b){this.G=a;this.ya=b;this.i=32374988;this.B=0}g=zg.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};g.P=function(){return this.ya};g.va=function(){var a=(null!=this.G?this.G.i&128||this.G.Xb||(this.G.i?0:C(Cb,this.G)):C(Cb,this.G))?this.G.va(null):P(this.G);return null==a?null:new zg(a,this.ya)};g.N=function(){return bd(this)};g.A=function(a,b){return gd(this,b)};g.Y=function(){return hd(Wc,this.ya)};g.ba=function(a,b){return wd.b(b,this)};
g.ca=function(a,b,c){return wd.c(b,c,this)};g.$=function(){return this.G.$(null).Ab(null)};g.ra=function(){var a=(null!=this.G?this.G.i&128||this.G.Xb||(this.G.i?0:C(Cb,this.G)):C(Cb,this.G))?this.G.va(null):P(this.G);return null!=a?new zg(a,this.ya):Wc};g.U=function(){return this};g.S=function(a,b){return new zg(this.G,b)};g.V=function(a,b){return R(b,this)};zg.prototype[pb]=function(){return Yc(this)};function Zf(a){return(a=N(a))?new zg(a,null):null}function ke(a){return Lb(a)}
var Ag=function Ag(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ag.l(0<c.length?new M(c.slice(0),0):null)};Ag.l=function(a){return y(Me(a))?rb.b(function(a,c){return xd.b(y(a)?a:Je,c)},a):null};Ag.w=0;Ag.C=function(a){return Ag.l(N(a))};Bg;function Cg(a){this.rb=a}Cg.prototype.ta=function(){return this.rb.ta()};Cg.prototype.next=function(){if(this.rb.ta())return this.rb.next().I[0];throw Error("No such element");};Cg.prototype.remove=function(){return Error("Unsupported operation")};
function Dg(a,b,c){this.o=a;this.fb=b;this.u=c;this.i=15077647;this.B=8196}g=Dg.prototype;g.toString=function(){return Cc(this)};g.equiv=function(a){return this.A(null,a)};g.keys=function(){return Yc(N(this))};g.entries=function(){var a=N(this);return new Uf(N(a))};g.values=function(){return Yc(N(this))};g.has=function(a){return Ud(this,a)};
g.forEach=function(a){for(var b=N(this),c=null,d=0,e=0;;)if(e<d){var f=c.X(null,e),h=U(f,0),f=U(f,1);a.b?a.b(f,h):a.call(null,f,h);e+=1}else if(b=N(b))Od(b)?(c=tc(b),b=uc(b),h=c,d=S(c),c=h):(c=O(b),h=U(c,0),f=U(c,1),a.b?a.b(f,h):a.call(null,f,h),b=P(b),c=null,d=0),e=0;else return null};g.M=function(a,b){return Eb.c(this,b,null)};g.H=function(a,b,c){return Fb(this.fb,b)?b:c};g.Ma=function(){return new Cg(Ac(this.fb))};g.P=function(){return this.o};g.aa=function(){return tb(this.fb)};
g.N=function(){var a=this.u;return null!=a?a:this.u=a=dd(this)};g.A=function(a,b){return Hd(b)&&S(this)===S(b)&&Le(function(a){return function(b){return Ud(a,b)}}(this),b)};g.lb=function(){return new Bg(lc(this.fb))};g.Y=function(){return hd(Eg,this.o)};g.U=function(){return Yf(this.fb)};g.S=function(a,b){return new Dg(b,this.fb,this.u)};g.V=function(a,b){return new Dg(this.o,Cd.c(this.fb,b,null),null)};
g.call=function(){var a=null,a=function(a,c,d){switch(arguments.length){case 2:return this.M(null,c);case 3:return this.H(null,c,d)}throw Error("Invalid arity: "+arguments.length);};a.b=function(a,c){return this.M(null,c)};a.c=function(a,c,d){return this.H(null,c,d)};return a}();g.apply=function(a,b){return this.call.apply(this,[this].concat(qb(b)))};g.a=function(a){return this.M(null,a)};g.b=function(a,b){return this.H(null,a,b)};var Eg=new Dg(null,Je,ed);Dg.prototype[pb]=function(){return Yc(this)};
function Bg(a){this.Sa=a;this.B=136;this.i=259}g=Bg.prototype;g.bb=function(a,b){this.Sa=oc(this.Sa,b,null);return this};g.mb=function(){return new Dg(null,nc(this.Sa),null)};g.aa=function(){return S(this.Sa)};g.M=function(a,b){return Eb.c(this,b,null)};g.H=function(a,b,c){return Eb.c(this.Sa,b,Rd)===Rd?c:b};
g.call=function(){function a(a,b,c){return Eb.c(this.Sa,b,Rd)===Rd?c:b}function b(a,b){return Eb.c(this.Sa,b,Rd)===Rd?null:b}var c=null,c=function(c,e,f){switch(arguments.length){case 2:return b.call(this,c,e);case 3:return a.call(this,c,e,f)}throw Error("Invalid arity: "+arguments.length);};c.b=b;c.c=a;return c}();g.apply=function(a,b){return this.call.apply(this,[this].concat(qb(b)))};g.a=function(a){return Eb.c(this.Sa,a,Rd)===Rd?null:a};g.b=function(a,b){return Eb.c(this.Sa,a,Rd)===Rd?b:a};
function ie(a){if(null!=a&&(a.B&4096||a.gd))return a.Bb(null);if("string"===typeof a)return a;throw Error([F("Doesn't support name: "),F(a)].join(""));}function Fg(a,b){if("string"===typeof b){var c=a.exec(b);return Jc.b(O(c),b)?1===S(c)?O(c):Xd(c):null}throw new TypeError("re-matches must match against a string.");}
function Gg(a){if(a instanceof RegExp)return a;var b;var c=/^\(\?([idmsux]*)\)/;if("string"===typeof a)c=c.exec(a),b=null==c?null:1===S(c)?O(c):Xd(c);else throw new TypeError("re-find must match against a string.");c=U(b,0);b=U(b,1);c=S(c);return new RegExp(a.substring(c),y(b)?b:"")}
function Cf(a,b,c,d,e,f,h){var k=$a;$a=null==$a?null:$a-1;try{if(null!=$a&&0>$a)return fc(a,"#");fc(a,c);if(0===hb.a(f))N(h)&&fc(a,function(){var a=Hg.a(f);return y(a)?a:"..."}());else{if(N(h)){var l=O(h);b.c?b.c(l,a,f):b.call(null,l,a,f)}for(var m=P(h),n=hb.a(f)-1;;)if(!m||null!=n&&0===n){N(m)&&0===n&&(fc(a,d),fc(a,function(){var a=Hg.a(f);return y(a)?a:"..."}()));break}else{fc(a,d);var p=O(m);c=a;h=f;b.c?b.c(p,c,h):b.call(null,p,c,h);var q=P(m);c=n-1;m=q;n=c}}return fc(a,e)}finally{$a=k}}
function Ig(a,b){for(var c=N(b),d=null,e=0,f=0;;)if(f<e){var h=d.X(null,f);fc(a,h);f+=1}else if(c=N(c))d=c,Od(d)?(c=tc(d),e=uc(d),d=c,h=S(c),c=e,e=h):(h=O(d),fc(a,h),c=P(d),d=null,e=0),f=0;else return null}var Jg={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function Kg(a){return[F('"'),F(a.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return Jg[a]})),F('"')].join("")}Lg;
function Mg(a,b){var c=Td(K.b(a,fb));return c?(c=null!=b?b.i&131072||b.fd?!0:!1:!1)?null!=Gd(b):c:c}
function Ng(a,b,c){if(null==a)return fc(b,"nil");if(Mg(c,a)){fc(b,"^");var d=Gd(a);Df.c?Df.c(d,b,c):Df.call(null,d,b,c);fc(b," ")}if(a.uc)return a.Jc(a,b,c);if(null!=a&&(a.i&2147483648||a.R))return a.K(null,b,c);if(!0===a||!1===a||"number"===typeof a)return fc(b,""+F(a));if(null!=a&&a.constructor===Object)return fc(b,"#js "),d=he.b(function(b){return new V(null,2,5,W,[re.a(b),a[b]],null)},Pd(a)),Lg.m?Lg.m(d,Df,b,c):Lg.call(null,d,Df,b,c);if(mb(a))return Cf(b,Df,"#js ["," ","]",c,a);if(ia(a))return y(db.a(c))?
fc(b,Kg(a)):fc(b,a);if(ka(a)){var e=a.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return Ig(b,L(["#object[",c,' "',""+F(a),'"]'],0))}if(a instanceof Date)return c=function(a,b){for(var c=""+F(a);;)if(S(c)<b)c=[F("0"),F(c)].join("");else return c},Ig(b,L(['#inst "',""+F(a.getUTCFullYear()),"-",c(a.getUTCMonth()+1,2),"-",c(a.getUTCDate(),2),"T",c(a.getUTCHours(),2),":",c(a.getUTCMinutes(),2),":",c(a.getUTCSeconds(),2),".",c(a.getUTCMilliseconds(),3),"-",'00:00"'],
0));if(a instanceof RegExp)return Ig(b,L(['#"',a.source,'"'],0));if(null!=a&&(a.i&2147483648||a.R))return gc(a,b,c);if(y(a.constructor.Eb))return Ig(b,L(["#object[",a.constructor.Eb.replace(RegExp("/","g"),"."),"]"],0));e=a.constructor.name;c=y(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return Ig(b,L(["#object[",c," ",""+F(a),"]"],0))}function Df(a,b,c){var d=Og.a(c);return y(d)?(c=Cd.c(c,Pg,Ng),d.c?d.c(a,b,c):d.call(null,a,b,c)):Ng(a,b,c)}
var Te=function Te(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Te.l(0<c.length?new M(c.slice(0),0):null)};Te.l=function(a){var b=bb();if(null==a||nb(N(a)))b="";else{var c=F,d=new Ia;a:{var e=new Bc(d);Df(O(a),e,b);a=N(P(a));for(var f=null,h=0,k=0;;)if(k<h){var l=f.X(null,k);fc(e," ");Df(l,e,b);k+=1}else if(a=N(a))f=a,Od(f)?(a=tc(f),h=uc(f),f=a,l=S(a),a=h,h=l):(l=O(f),fc(e," "),Df(l,e,b),a=P(f),f=null,h=0),k=0;else break a}b=""+c(d)}return b};Te.w=0;
Te.C=function(a){return Te.l(N(a))};function Lg(a,b,c,d){return Cf(c,function(a,c,d){var k=Kb(a);b.c?b.c(k,c,d):b.call(null,k,c,d);fc(c," ");a=Lb(a);return b.c?b.c(a,c,d):b.call(null,a,c,d)},"{",", ","}",d,N(a))}Ye.prototype.R=!0;Ye.prototype.K=function(a,b,c){fc(b,"#object [cljs.core.Volatile ");Df(new v(null,1,[Qg,this.state],null),b,c);return fc(b,"]")};M.prototype.R=!0;M.prototype.K=function(a,b,c){return Cf(b,Df,"("," ",")",c,this)};se.prototype.R=!0;
se.prototype.K=function(a,b,c){return Cf(b,Df,"("," ",")",c,this)};sg.prototype.R=!0;sg.prototype.K=function(a,b,c){return Cf(b,Df,"("," ",")",c,this)};xg.prototype.R=!0;xg.prototype.K=function(a,b,c){return Cf(b,Df,"["," ","]",c,this)};Xf.prototype.R=!0;Xf.prototype.K=function(a,b,c){return Cf(b,Df,"("," ",")",c,this)};$c.prototype.R=!0;$c.prototype.K=function(a,b,c){return Cf(b,Df,"("," ",")",c,this)};Md.prototype.R=!0;Md.prototype.K=function(a,b,c){return Cf(b,Df,"("," ",")",c,this)};
pe.prototype.R=!0;pe.prototype.K=function(a,b,c){return Cf(b,Df,"("," ",")",c,this)};rd.prototype.R=!0;rd.prototype.K=function(a,b,c){return Cf(b,Df,"("," ",")",c,this)};Bd.prototype.R=!0;Bd.prototype.K=function(a,b,c){return Lg(this,Df,b,c)};tg.prototype.R=!0;tg.prototype.K=function(a,b,c){return Cf(b,Df,"("," ",")",c,this)};Hf.prototype.R=!0;Hf.prototype.K=function(a,b,c){return Cf(b,Df,"["," ","]",c,this)};Dg.prototype.R=!0;Dg.prototype.K=function(a,b,c){return Cf(b,Df,"#{"," ","}",c,this)};
Ld.prototype.R=!0;Ld.prototype.K=function(a,b,c){return Cf(b,Df,"("," ",")",c,this)};Qe.prototype.R=!0;Qe.prototype.K=function(a,b,c){fc(b,"#object [cljs.core.Atom ");Df(new v(null,1,[Qg,this.state],null),b,c);return fc(b,"]")};zg.prototype.R=!0;zg.prototype.K=function(a,b,c){return Cf(b,Df,"("," ",")",c,this)};wg.prototype.R=!0;wg.prototype.K=function(a,b,c){return Cf(b,Df,"["," ","]",c,this)};V.prototype.R=!0;V.prototype.K=function(a,b,c){return Cf(b,Df,"["," ","]",c,this)};Lf.prototype.R=!0;
Lf.prototype.K=function(a,b,c){return Cf(b,Df,"("," ",")",c,this)};ne.prototype.R=!0;ne.prototype.K=function(a,b){return fc(b,"()")};Ke.prototype.R=!0;Ke.prototype.K=function(a,b,c){return Cf(b,Df,"("," ",")",c,this)};Mf.prototype.R=!0;Mf.prototype.K=function(a,b,c){return Cf(b,Df,"#queue ["," ","]",c,N(this))};v.prototype.R=!0;v.prototype.K=function(a,b,c){return Lg(this,Df,b,c)};yg.prototype.R=!0;yg.prototype.K=function(a,b,c){return Cf(b,Df,"("," ",")",c,this)};sd.prototype.R=!0;
sd.prototype.K=function(a,b,c){return Cf(b,Df,"("," ",")",c,this)};I.prototype.xb=!0;I.prototype.ab=function(a,b){if(b instanceof I)return Sc(this,b);throw Error([F("Cannot compare "),F(this),F(" to "),F(b)].join(""));};A.prototype.xb=!0;A.prototype.ab=function(a,b){if(b instanceof A)return qe(this,b);throw Error([F("Cannot compare "),F(this),F(" to "),F(b)].join(""));};Hf.prototype.xb=!0;
Hf.prototype.ab=function(a,b){if(Kd(b))return Vd(this,b);throw Error([F("Cannot compare "),F(this),F(" to "),F(b)].join(""));};V.prototype.xb=!0;V.prototype.ab=function(a,b){if(Kd(b))return Vd(this,b);throw Error([F("Cannot compare "),F(this),F(" to "),F(b)].join(""));};function Rg(a){return function(b,c){var d=a.b?a.b(b,c):a.call(null,b,c);return kd(d)?new jd(d):d}}
function gf(a){return function(b){return function(){function c(a,c){return rb.c(b,a,c)}function d(b){return a.a?a.a(b):a.call(null,b)}function e(){return a.v?a.v():a.call(null)}var f=null,f=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};f.v=e;f.a=d;f.b=c;return f}()}(Rg(a))}Sg;function Tg(){}
var Ug=function Ug(b){if(null!=b&&null!=b.bd)return b.bd(b);var c=Ug[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=Ug._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("IEncodeJS.-clj-\x3ejs",b);};Vg;function Wg(a){return(null!=a?a.ad||(a.pd?0:C(Tg,a)):C(Tg,a))?Ug(a):"string"===typeof a||"number"===typeof a||a instanceof A||a instanceof I?Vg.a?Vg.a(a):Vg.call(null,a):Te.l(L([a],0))}
var Vg=function Vg(b){if(null==b)return null;if(null!=b?b.ad||(b.pd?0:C(Tg,b)):C(Tg,b))return Ug(b);if(b instanceof A)return ie(b);if(b instanceof I)return""+F(b);if(Jd(b)){var c={};b=N(b);for(var d=null,e=0,f=0;;)if(f<e){var h=d.X(null,f),k=U(h,0),h=U(h,1);c[Wg(k)]=Vg(h);f+=1}else if(b=N(b))Od(b)?(e=tc(b),b=uc(b),d=e,e=S(e)):(e=O(b),d=U(e,0),e=U(e,1),c[Wg(d)]=Vg(e),b=P(b),d=null,e=0),f=0;else break;return c}if(null==b?0:null!=b?b.i&8||b.Dd||(b.i?0:C(vb,b)):C(vb,b)){c=[];b=N(he.b(Vg,b));d=null;for(f=
e=0;;)if(f<e)k=d.X(null,f),c.push(k),f+=1;else if(b=N(b))d=b,Od(d)?(b=tc(d),f=uc(d),d=b,e=S(b),b=f):(b=O(d),c.push(b),b=P(d),d=null,e=0),f=0;else break;return c}return b},Sg=function Sg(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Sg.v();case 1:return Sg.a(arguments[0]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};Sg.v=function(){return Sg.a(1)};Sg.a=function(a){return Math.random()*a};Sg.w=1;var Xg=null;
function Yg(){if(null==Xg){var a=new v(null,3,[Zg,Je,$g,Je,ah,Je],null);Xg=Re.a?Re.a(a):Re.call(null,a)}return Xg}function bh(a,b,c){var d=Jc.b(b,c);if(!d&&!(d=Ud(ah.a(a).call(null,b),c))&&(d=Kd(c))&&(d=Kd(b)))if(d=S(c)===S(b))for(var d=!0,e=0;;)if(d&&e!==S(c))d=bh(a,b.a?b.a(e):b.call(null,e),c.a?c.a(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function ch(a){var b;b=Yg();b=Q.a?Q.a(b):Q.call(null,b);a=K.b(Zg.a(b),a);return N(a)?a:null}
function dh(a,b,c,d){Xe.b(a,function(){return Q.a?Q.a(b):Q.call(null,b)});Xe.b(c,function(){return Q.a?Q.a(d):Q.call(null,d)})}var eh=function eh(b,c,d){var e=(Q.a?Q.a(d):Q.call(null,d)).call(null,b),e=y(y(e)?e.a?e.a(c):e.call(null,c):e)?!0:null;if(y(e))return e;e=function(){for(var e=ch(c);;)if(0<S(e))eh(b,O(e),d),e=Vc(e);else return null}();if(y(e))return e;e=function(){for(var e=ch(b);;)if(0<S(e))eh(O(e),c,d),e=Vc(e);else return null}();return y(e)?e:!1};
function fh(a,b,c){c=eh(a,b,c);if(y(c))a=c;else{c=bh;var d;d=Yg();d=Q.a?Q.a(d):Q.call(null,d);a=c(d,a,b)}return a}
var gh=function gh(b,c,d,e,f,h,k){var l=rb.c(function(e,h){var k=U(h,0);U(h,1);if(bh(Q.a?Q.a(d):Q.call(null,d),c,k)){var l;l=(l=null==e)?l:fh(k,O(e),f);l=y(l)?h:e;if(!y(fh(O(l),k,f)))throw Error([F("Multiple methods in multimethod '"),F(b),F("' match dispatch value: "),F(c),F(" -\x3e "),F(k),F(" and "),F(O(l)),F(", and neither is preferred")].join(""));return l}return e},null,Q.a?Q.a(e):Q.call(null,e));if(y(l)){if(Jc.b(Q.a?Q.a(k):Q.call(null,k),Q.a?Q.a(d):Q.call(null,d)))return Xe.m(h,Cd,c,O(P(l))),
O(P(l));dh(h,e,k,d);return gh(b,c,d,e,f,h,k)}return null};function Y(a,b){throw Error([F("No method in multimethod '"),F(a),F("' for dispatch value: "),F(b)].join(""));}function hh(a,b,c,d,e,f,h,k){this.name=a;this.h=b;this.qd=c;this.Jb=d;this.sb=e;this.yd=f;this.Ob=h;this.vb=k;this.i=4194305;this.B=4352}g=hh.prototype;
g.call=function(){function a(a,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z,B,E,J,ca){a=this;var ta=G.l(a.h,b,c,d,e,L([f,h,k,l,m,n,p,r,q,u,w,x,z,B,E,J,ca],0)),pi=Z(this,ta);y(pi)||Y(a.name,ta);return G.l(pi,b,c,d,e,L([f,h,k,l,m,n,p,r,q,u,w,x,z,B,E,J,ca],0))}function b(a,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z,B,E,J){a=this;var ca=a.h.oa?a.h.oa(b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z,B,E,J):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z,B,E,J),ta=Z(this,ca);y(ta)||Y(a.name,ca);return ta.oa?ta.oa(b,c,d,e,f,h,k,l,m,n,p,r,
q,u,w,x,z,B,E,J):ta.call(null,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z,B,E,J)}function c(a,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z,B,E){a=this;var J=a.h.na?a.h.na(b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z,B,E):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z,B,E),ca=Z(this,J);y(ca)||Y(a.name,J);return ca.na?ca.na(b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z,B,E):ca.call(null,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z,B,E)}function d(a,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z,B){a=this;var E=a.h.ma?a.h.ma(b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z,B):a.h.call(null,
b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z,B),J=Z(this,E);y(J)||Y(a.name,E);return J.ma?J.ma(b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z,B):J.call(null,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z,B)}function e(a,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z){a=this;var B=a.h.la?a.h.la(b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z),E=Z(this,B);y(E)||Y(a.name,B);return E.la?E.la(b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z):E.call(null,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x,z)}function f(a,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,
x){a=this;var z=a.h.ka?a.h.ka(b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x),B=Z(this,z);y(B)||Y(a.name,z);return B.ka?B.ka(b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x):B.call(null,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w,x)}function h(a,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w){a=this;var x=a.h.ja?a.h.ja(b,c,d,e,f,h,k,l,m,n,p,r,q,u,w):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w),z=Z(this,x);y(z)||Y(a.name,x);return z.ja?z.ja(b,c,d,e,f,h,k,l,m,n,p,r,q,u,w):z.call(null,b,c,d,e,f,h,k,l,m,n,p,r,q,u,w)}
function k(a,b,c,d,e,f,h,k,l,m,n,p,r,q,u){a=this;var w=a.h.ia?a.h.ia(b,c,d,e,f,h,k,l,m,n,p,r,q,u):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,r,q,u),x=Z(this,w);y(x)||Y(a.name,w);return x.ia?x.ia(b,c,d,e,f,h,k,l,m,n,p,r,q,u):x.call(null,b,c,d,e,f,h,k,l,m,n,p,r,q,u)}function l(a,b,c,d,e,f,h,k,l,m,n,p,r,q){a=this;var u=a.h.ha?a.h.ha(b,c,d,e,f,h,k,l,m,n,p,r,q):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,r,q),w=Z(this,u);y(w)||Y(a.name,u);return w.ha?w.ha(b,c,d,e,f,h,k,l,m,n,p,r,q):w.call(null,b,c,d,e,f,h,k,l,m,n,p,
r,q)}function m(a,b,c,d,e,f,h,k,l,m,n,p,r){a=this;var q=a.h.ga?a.h.ga(b,c,d,e,f,h,k,l,m,n,p,r):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p,r),u=Z(this,q);y(u)||Y(a.name,q);return u.ga?u.ga(b,c,d,e,f,h,k,l,m,n,p,r):u.call(null,b,c,d,e,f,h,k,l,m,n,p,r)}function n(a,b,c,d,e,f,h,k,l,m,n,p){a=this;var r=a.h.fa?a.h.fa(b,c,d,e,f,h,k,l,m,n,p):a.h.call(null,b,c,d,e,f,h,k,l,m,n,p),q=Z(this,r);y(q)||Y(a.name,r);return q.fa?q.fa(b,c,d,e,f,h,k,l,m,n,p):q.call(null,b,c,d,e,f,h,k,l,m,n,p)}function p(a,b,c,d,e,f,h,k,l,m,
n){a=this;var p=a.h.ea?a.h.ea(b,c,d,e,f,h,k,l,m,n):a.h.call(null,b,c,d,e,f,h,k,l,m,n),r=Z(this,p);y(r)||Y(a.name,p);return r.ea?r.ea(b,c,d,e,f,h,k,l,m,n):r.call(null,b,c,d,e,f,h,k,l,m,n)}function q(a,b,c,d,e,f,h,k,l,m){a=this;var n=a.h.qa?a.h.qa(b,c,d,e,f,h,k,l,m):a.h.call(null,b,c,d,e,f,h,k,l,m),p=Z(this,n);y(p)||Y(a.name,n);return p.qa?p.qa(b,c,d,e,f,h,k,l,m):p.call(null,b,c,d,e,f,h,k,l,m)}function r(a,b,c,d,e,f,h,k,l){a=this;var m=a.h.pa?a.h.pa(b,c,d,e,f,h,k,l):a.h.call(null,b,c,d,e,f,h,k,l),n=
Z(this,m);y(n)||Y(a.name,m);return n.pa?n.pa(b,c,d,e,f,h,k,l):n.call(null,b,c,d,e,f,h,k,l)}function u(a,b,c,d,e,f,h,k){a=this;var l=a.h.Z?a.h.Z(b,c,d,e,f,h,k):a.h.call(null,b,c,d,e,f,h,k),m=Z(this,l);y(m)||Y(a.name,l);return m.Z?m.Z(b,c,d,e,f,h,k):m.call(null,b,c,d,e,f,h,k)}function x(a,b,c,d,e,f,h){a=this;var k=a.h.W?a.h.W(b,c,d,e,f,h):a.h.call(null,b,c,d,e,f,h),l=Z(this,k);y(l)||Y(a.name,k);return l.W?l.W(b,c,d,e,f,h):l.call(null,b,c,d,e,f,h)}function w(a,b,c,d,e,f){a=this;var h=a.h.D?a.h.D(b,c,
d,e,f):a.h.call(null,b,c,d,e,f),k=Z(this,h);y(k)||Y(a.name,h);return k.D?k.D(b,c,d,e,f):k.call(null,b,c,d,e,f)}function B(a,b,c,d,e){a=this;var f=a.h.m?a.h.m(b,c,d,e):a.h.call(null,b,c,d,e),h=Z(this,f);y(h)||Y(a.name,f);return h.m?h.m(b,c,d,e):h.call(null,b,c,d,e)}function E(a,b,c,d){a=this;var e=a.h.c?a.h.c(b,c,d):a.h.call(null,b,c,d),f=Z(this,e);y(f)||Y(a.name,e);return f.c?f.c(b,c,d):f.call(null,b,c,d)}function J(a,b,c){a=this;var d=a.h.b?a.h.b(b,c):a.h.call(null,b,c),e=Z(this,d);y(e)||Y(a.name,
d);return e.b?e.b(b,c):e.call(null,b,c)}function ca(a,b){a=this;var c=a.h.a?a.h.a(b):a.h.call(null,b),d=Z(this,c);y(d)||Y(a.name,c);return d.a?d.a(b):d.call(null,b)}function ta(a){a=this;var b=a.h.v?a.h.v():a.h.call(null),c=Z(this,b);y(c)||Y(a.name,b);return c.v?c.v():c.call(null)}var z=null,z=function(z,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,hc,Xa,eb,xb,jb,ic,Oc,Nd,Pf){switch(arguments.length){case 1:return ta.call(this,z);case 2:return ca.call(this,z,X);case 3:return J.call(this,z,X,aa);case 4:return E.call(this,
z,X,aa,T);case 5:return B.call(this,z,X,aa,T,da);case 6:return w.call(this,z,X,aa,T,da,ha);case 7:return x.call(this,z,X,aa,T,da,ha,ja);case 8:return u.call(this,z,X,aa,T,da,ha,ja,ma);case 9:return r.call(this,z,X,aa,T,da,ha,ja,ma,qa);case 10:return q.call(this,z,X,aa,T,da,ha,ja,ma,qa,sa);case 11:return p.call(this,z,X,aa,T,da,ha,ja,ma,qa,sa,Ba);case 12:return n.call(this,z,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka);case 13:return m.call(this,z,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa);case 14:return l.call(this,z,
X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,hc);case 15:return k.call(this,z,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,hc,Xa);case 16:return h.call(this,z,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,hc,Xa,eb);case 17:return f.call(this,z,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,hc,Xa,eb,xb);case 18:return e.call(this,z,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,hc,Xa,eb,xb,jb);case 19:return d.call(this,z,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,hc,Xa,eb,xb,jb,ic);case 20:return c.call(this,z,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,hc,Xa,eb,xb,jb,ic,Oc);
case 21:return b.call(this,z,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,hc,Xa,eb,xb,jb,ic,Oc,Nd);case 22:return a.call(this,z,X,aa,T,da,ha,ja,ma,qa,sa,Ba,Ka,Qa,hc,Xa,eb,xb,jb,ic,Oc,Nd,Pf)}throw Error("Invalid arity: "+arguments.length);};z.a=ta;z.b=ca;z.c=J;z.m=E;z.D=B;z.W=w;z.Z=x;z.pa=u;z.qa=r;z.ea=q;z.fa=p;z.ga=n;z.ha=m;z.ia=l;z.ja=k;z.ka=h;z.la=f;z.ma=e;z.na=d;z.oa=c;z.sc=b;z.yb=a;return z}();g.apply=function(a,b){return this.call.apply(this,[this].concat(qb(b)))};
g.v=function(){var a=this.h.v?this.h.v():this.h.call(null),b=Z(this,a);y(b)||Y(this.name,a);return b.v?b.v():b.call(null)};g.a=function(a){var b=this.h.a?this.h.a(a):this.h.call(null,a),c=Z(this,b);y(c)||Y(this.name,b);return c.a?c.a(a):c.call(null,a)};g.b=function(a,b){var c=this.h.b?this.h.b(a,b):this.h.call(null,a,b),d=Z(this,c);y(d)||Y(this.name,c);return d.b?d.b(a,b):d.call(null,a,b)};
g.c=function(a,b,c){var d=this.h.c?this.h.c(a,b,c):this.h.call(null,a,b,c),e=Z(this,d);y(e)||Y(this.name,d);return e.c?e.c(a,b,c):e.call(null,a,b,c)};g.m=function(a,b,c,d){var e=this.h.m?this.h.m(a,b,c,d):this.h.call(null,a,b,c,d),f=Z(this,e);y(f)||Y(this.name,e);return f.m?f.m(a,b,c,d):f.call(null,a,b,c,d)};g.D=function(a,b,c,d,e){var f=this.h.D?this.h.D(a,b,c,d,e):this.h.call(null,a,b,c,d,e),h=Z(this,f);y(h)||Y(this.name,f);return h.D?h.D(a,b,c,d,e):h.call(null,a,b,c,d,e)};
g.W=function(a,b,c,d,e,f){var h=this.h.W?this.h.W(a,b,c,d,e,f):this.h.call(null,a,b,c,d,e,f),k=Z(this,h);y(k)||Y(this.name,h);return k.W?k.W(a,b,c,d,e,f):k.call(null,a,b,c,d,e,f)};g.Z=function(a,b,c,d,e,f,h){var k=this.h.Z?this.h.Z(a,b,c,d,e,f,h):this.h.call(null,a,b,c,d,e,f,h),l=Z(this,k);y(l)||Y(this.name,k);return l.Z?l.Z(a,b,c,d,e,f,h):l.call(null,a,b,c,d,e,f,h)};
g.pa=function(a,b,c,d,e,f,h,k){var l=this.h.pa?this.h.pa(a,b,c,d,e,f,h,k):this.h.call(null,a,b,c,d,e,f,h,k),m=Z(this,l);y(m)||Y(this.name,l);return m.pa?m.pa(a,b,c,d,e,f,h,k):m.call(null,a,b,c,d,e,f,h,k)};g.qa=function(a,b,c,d,e,f,h,k,l){var m=this.h.qa?this.h.qa(a,b,c,d,e,f,h,k,l):this.h.call(null,a,b,c,d,e,f,h,k,l),n=Z(this,m);y(n)||Y(this.name,m);return n.qa?n.qa(a,b,c,d,e,f,h,k,l):n.call(null,a,b,c,d,e,f,h,k,l)};
g.ea=function(a,b,c,d,e,f,h,k,l,m){var n=this.h.ea?this.h.ea(a,b,c,d,e,f,h,k,l,m):this.h.call(null,a,b,c,d,e,f,h,k,l,m),p=Z(this,n);y(p)||Y(this.name,n);return p.ea?p.ea(a,b,c,d,e,f,h,k,l,m):p.call(null,a,b,c,d,e,f,h,k,l,m)};g.fa=function(a,b,c,d,e,f,h,k,l,m,n){var p=this.h.fa?this.h.fa(a,b,c,d,e,f,h,k,l,m,n):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n),q=Z(this,p);y(q)||Y(this.name,p);return q.fa?q.fa(a,b,c,d,e,f,h,k,l,m,n):q.call(null,a,b,c,d,e,f,h,k,l,m,n)};
g.ga=function(a,b,c,d,e,f,h,k,l,m,n,p){var q=this.h.ga?this.h.ga(a,b,c,d,e,f,h,k,l,m,n,p):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p),r=Z(this,q);y(r)||Y(this.name,q);return r.ga?r.ga(a,b,c,d,e,f,h,k,l,m,n,p):r.call(null,a,b,c,d,e,f,h,k,l,m,n,p)};g.ha=function(a,b,c,d,e,f,h,k,l,m,n,p,q){var r=this.h.ha?this.h.ha(a,b,c,d,e,f,h,k,l,m,n,p,q):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q),u=Z(this,r);y(u)||Y(this.name,r);return u.ha?u.ha(a,b,c,d,e,f,h,k,l,m,n,p,q):u.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q)};
g.ia=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r){var u=this.h.ia?this.h.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r),x=Z(this,u);y(x)||Y(this.name,u);return x.ia?x.ia(a,b,c,d,e,f,h,k,l,m,n,p,q,r):x.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r)};
g.ja=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u){var x=this.h.ja?this.h.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u),w=Z(this,x);y(w)||Y(this.name,x);return w.ja?w.ja(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u):w.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u)};
g.ka=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x){var w=this.h.ka?this.h.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x),B=Z(this,w);y(B)||Y(this.name,w);return B.ka?B.ka(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x):B.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x)};
g.la=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w){var B=this.h.la?this.h.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w),E=Z(this,B);y(E)||Y(this.name,B);return E.la?E.la(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w):E.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w)};
g.ma=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B){var E=this.h.ma?this.h.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B),J=Z(this,E);y(J)||Y(this.name,E);return J.ma?J.ma(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B):J.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B)};
g.na=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E){var J=this.h.na?this.h.na(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E),ca=Z(this,J);y(ca)||Y(this.name,J);return ca.na?ca.na(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E):ca.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E)};
g.oa=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J){var ca=this.h.oa?this.h.oa(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J):this.h.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J),ta=Z(this,ca);y(ta)||Y(this.name,ca);return ta.oa?ta.oa(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J):ta.call(null,a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J)};
g.sc=function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J,ca){var ta=G.l(this.h,a,b,c,d,L([e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J,ca],0)),z=Z(this,ta);y(z)||Y(this.name,ta);return G.l(z,a,b,c,d,L([e,f,h,k,l,m,n,p,q,r,u,x,w,B,E,J,ca],0))};function ih(a,b){var c=jh;Xe.m(c.sb,Cd,a,b);dh(c.Ob,c.sb,c.vb,c.Jb)}
function Z(a,b){Jc.b(Q.a?Q.a(a.vb):Q.call(null,a.vb),Q.a?Q.a(a.Jb):Q.call(null,a.Jb))||dh(a.Ob,a.sb,a.vb,a.Jb);var c=(Q.a?Q.a(a.Ob):Q.call(null,a.Ob)).call(null,b);if(y(c))return c;c=gh(a.name,b,a.Jb,a.sb,a.yd,a.Ob,a.vb);return y(c)?c:(Q.a?Q.a(a.sb):Q.call(null,a.sb)).call(null,a.qd)}g.Bb=function(){return wc(this.name)};g.Cb=function(){return xc(this.name)};g.N=function(){return la(this)};function kh(a,b){this.jb=a;this.u=b;this.i=2153775104;this.B=2048}g=kh.prototype;g.toString=function(){return this.jb};
g.equiv=function(a){return this.A(null,a)};g.A=function(a,b){return b instanceof kh&&this.jb===b.jb};g.K=function(a,b){return fc(b,[F('#uuid "'),F(this.jb),F('"')].join(""))};g.N=function(){null==this.u&&(this.u=Nc(this.jb));return this.u};g.ab=function(a,b){return Va(this.jb,b.jb)};var lh=new I("locations","add","locations/add",-1465163552,null),mh=new A(null,"text-anchor","text-anchor",585613696),nh=new A(null,"path","path",-188191168),oh=new A(null,"onmouseup","onmouseup",168100736),ph=new A(null,"onchange","onchange",1355467329),qh=new A(null,"epoch","epoch",1435633666),rh=new I("pan","drag","pan/drag",2090593570,null),sh=new A(null,"zoom","zoom",-1827487038),th=new A(null,"date","date",-1463434462),uh=new A(null,"r","r",-471384190),vh=new A(null,"stroke","stroke",1741823555),
wh=new A(null,"transform","transform",1381301764),fb=new A(null,"meta","meta",1499536964),xh=new I(null,"blockable","blockable",-28395259,null),gb=new A(null,"dup","dup",556298533),yh=new A(null,"placeholder","placeholder",-104873083),zh=new A(null,"font-size","font-size",-1847940346),Ah=new A(null,"button","button",1456579943),We=new I(null,"new-value","new-value",-1567397401,null),Se=new A(null,"validator","validator",-1966190681),Bh=new A(null,"pan","pan",-307712792),Ch=new A(null,"default","default",
-1987822328),Dh=new A(null,"name","name",1843675177),Eh=new I(null,"epoch","epoch",-1218802103,null),Fh=new A(null,"fill","fill",883462889),Gh=new A(null,"value","value",305978217),Hh=new A(null,"circle","circle",1903212362),Ih=new A(null,"width","width",-384071477),Jh=new A(null,"onclick","onclick",1297553739),Kh=new A(null,"dy","dy",1719547243),Lh=new A(null,"asteroid","asteroid",1186392555),Mh=new A(null,"hold","hold",-1621118005),Qg=new A(null,"val","val",128701612),Nh=new A(null,"cursor","cursor",
1011937484),Oh=new I(null,"au","au",486987020,null),Ph=new A(null,"type","type",1174270348),Ie=new I(null,"meta15707","meta15707",73036332,null),Ve=new I(null,"validate","validate",1439230700,null),Pg=new A(null,"fallback-impl","fallback-impl",-1501286995),cb=new A(null,"flush-on-newline","flush-on-newline",-151457939),Qh=new I(null,"kg","kg",-227796082,null),Rh=new A(null,"className","className",-1983287057),$g=new A(null,"descendants","descendants",1824886031),Sh=new I("set","date","set/date",176688527,
null),Th=new A(null,"mean-anomaly-at-epoch","mean-anomaly-at-epoch",-1855777680),ah=new A(null,"ancestors","ancestors",-776045424),Uh=new A(null,"style","style",-496642736),af=new I(null,"n","n",-2092305744,null),Vh=new A(null,"div","div",1057191632),db=new A(null,"readably","readably",1129599760),Wh=new I(null,"m","m",-1021758608,null),Xh=new A(null,"locations","locations",-435476560),Hg=new A(null,"more-marker","more-marker",-14717935),Yh=new I(null,"J2000","J2000",1946055985,null),Zh=new A(null,
"g","g",1738089905),$h=new I("zoom","change","zoom/change",473729586,null),ai=new A(null,"stroke-width","stroke-width",716836435),bi=new I(null,"days","days",246458963,null),ci=new A(null,"longitude-of-ascending-node","longitude-of-ascending-node",-484579437),hb=new A(null,"print-length","print-length",1931866356),Zg=new A(null,"parents","parents",-2027538891),di=new I(null,"/","/",-1371932971,null),ei=new A(null,"onmousedown","onmousedown",-1118865611),fi=new A(null,"eccentricity","eccentricity",
-1281160106),gi=new I(null,"meta11406","meta11406",1007463510,null),hi=new A(null,"svg","svg",856789142),ii=new I(null,"deg","deg",958975446,null),ji=new I("pan","hold","pan/hold",19647927,null),ki=new I("pan","release","pan/release",105984951,null),li=new A(null,"position","position",-2011731912),mi=new A(null,"d","d",1972142424),ni=new A(null,"tag","tag",-1290361223),oi=new A(null,"rerender","rerender",-1601192263),qi=new A(null,"period","period",-352129191),ri=new A(null,"input","input",556931961),
si=new A(null,"onmousemove","onmousemove",341554202),He=new I(null,"quote","quote",1377916282,null),ti=new A(null,"inclination","inclination",-214950214),Ge=new A(null,"arglists","arglists",1661989754),Fe=new I(null,"nil-iter","nil-iter",1101030523,null),ui=new A(null,"main","main",-2117802661),vi=new A(null,"hierarchy","hierarchy",-1053470341),wi=new A(null,"border","border",1444987323),xi=new A(null,"argument-of-perihelion","argument-of-perihelion",-2014117157),Og=new A(null,"alt-impl","alt-impl",
670969595),yi=new A(null,"bodies","bodies",-1295887172),zi=new A(null,"rect","rect",-108902628),Ai=new I(null,"deref","deref",1494944732,null),Bi=new I(null,"years","years",341951838,null),$e=new I(null,"number?","number?",-1747282210,null),Ci=new A(null,"font-family","font-family",-667419874),Di=new A(null,"height","height",1025178622),Ei=new A(null,"dwarf-planet","dwarf-planet",1357458527),Fi=new A(null,"foreignObject","foreignObject",25502111),Gi=new A(null,"semi-major-axis","semi-major-axis",
-1739907617),Hi=new A(null,"text","text",-1790561697),Ii=new A(null,"span","span",1394872991),Ji=new I(null,"f","f",43394975,null);var Ki;var Li;a:{var Mi=ea.navigator;if(Mi){var Ni=Mi.userAgent;if(Ni){Li=Ni;break a}}Li=""}function Oi(a){return-1!=Li.indexOf(a)};Ha("area base br col command embed hr img input keygen link meta param source track wbr".split(" "));var Pi=Oi("Opera")||Oi("OPR"),Qi=Oi("Trident")||Oi("MSIE"),Ri=Oi("Edge"),Si=Oi("Gecko")&&!(-1!=Li.toLowerCase().indexOf("webkit")&&!Oi("Edge"))&&!(Oi("Trident")||Oi("MSIE"))&&!Oi("Edge"),Ti=-1!=Li.toLowerCase().indexOf("webkit")&&!Oi("Edge");function Ui(){var a=Li;if(Si)return/rv\:([^\);]+)(\)|;)/.exec(a);if(Ri)return/Edge\/([\d\.]+)/.exec(a);if(Qi)return/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);if(Ti)return/WebKit\/(\S+)/.exec(a)}function Vi(){var a=ea.document;return a?a.documentMode:void 0}
var Wi=function(){if(Pi&&ea.opera){var a=ea.opera.version;return ka(a)?a():a}var a="",b=Ui();b&&(a=b?b[1]:"");return Qi&&(b=Vi(),b>parseFloat(a))?String(b):a}(),Xi={};
function Yi(a){var b;if(!(b=Xi[a])){b=0;for(var c=ya(String(Wi)).split("."),d=ya(String(a)).split("."),e=Math.max(c.length,d.length),f=0;0==b&&f<e;f++){var h=c[f]||"",k=d[f]||"",l=RegExp("(\\d*)(\\D*)","g"),m=RegExp("(\\d*)(\\D*)","g");do{var n=l.exec(h)||["","",""],p=m.exec(k)||["","",""];if(0==n[0].length&&0==p[0].length)break;b=za(0==n[1].length?0:parseInt(n[1],10),0==p[1].length?0:parseInt(p[1],10))||za(0==n[2].length,0==p[2].length)||za(n[2],p[2])}while(0==b)}b=Xi[a]=0<=b}return b}
var Zi=ea.document,$i=Zi&&Qi?Vi()||("CSS1Compat"==Zi.compatMode?parseInt(Wi,10):5):void 0;var aj;(aj=!Qi)||(aj=9<=$i);var bj=aj,cj=Qi&&!Yi("9");!Ti||Yi("528");Si&&Yi("1.9b")||Qi&&Yi("8")||Pi&&Yi("9.5")||Ti&&Yi("528");Si&&!Yi("8")||Qi&&Yi("9");function dj(){0!=ej&&(fj[la(this)]=this);this.Gb=this.Gb;this.cc=this.cc}var ej=0,fj={};dj.prototype.Gb=!1;dj.prototype.Fb=function(){if(this.cc)for(;this.cc.length;)this.cc.shift()()};function gj(a,b){this.type=a;this.currentTarget=this.target=b;this.defaultPrevented=this.ib=!1;this.Tc=!0}gj.prototype.stopPropagation=function(){this.ib=!0};gj.prototype.preventDefault=function(){this.defaultPrevented=!0;this.Tc=!1};function hj(a){hj[" "](a);return a}hj[" "]=fa;function ij(a,b){gj.call(this,a?a.type:"");this.relatedTarget=this.currentTarget=this.target=null;this.charCode=this.keyCode=this.button=this.screenY=this.screenX=this.clientY=this.clientX=this.offsetY=this.offsetX=0;this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1;this.Hb=this.state=null;if(a){var c=this.type=a.type;this.target=a.target||a.srcElement;this.currentTarget=b;var d=a.relatedTarget;if(d){if(Si){var e;a:{try{hj(d.nodeName);e=!0;break a}catch(f){}e=!1}e||(d=null)}}else"mouseover"==
c?d=a.fromElement:"mouseout"==c&&(d=a.toElement);this.relatedTarget=d;this.offsetX=Ti||void 0!==a.offsetX?a.offsetX:a.layerX;this.offsetY=Ti||void 0!==a.offsetY?a.offsetY:a.layerY;this.clientX=void 0!==a.clientX?a.clientX:a.pageX;this.clientY=void 0!==a.clientY?a.clientY:a.pageY;this.screenX=a.screenX||0;this.screenY=a.screenY||0;this.button=a.button;this.keyCode=a.keyCode||0;this.charCode=a.charCode||("keypress"==c?a.keyCode:0);this.ctrlKey=a.ctrlKey;this.altKey=a.altKey;this.shiftKey=a.shiftKey;
this.metaKey=a.metaKey;this.state=a.state;this.Hb=a;a.defaultPrevented&&this.preventDefault()}}wa(ij,gj);ij.prototype.stopPropagation=function(){ij.fc.stopPropagation.call(this);this.Hb.stopPropagation?this.Hb.stopPropagation():this.Hb.cancelBubble=!0};ij.prototype.preventDefault=function(){ij.fc.preventDefault.call(this);var a=this.Hb;if(a.preventDefault)a.preventDefault();else if(a.returnValue=!1,cj)try{if(a.ctrlKey||112<=a.keyCode&&123>=a.keyCode)a.keyCode=-1}catch(b){}};var jj="closure_listenable_"+(1E6*Math.random()|0),mj=0;function nj(a,b,c,d,e){this.listener=a;this.ec=null;this.src=b;this.type=c;this.wb=!!d;this.$b=e;this.key=++mj;this.tb=this.Ub=!1}function oj(a){a.tb=!0;a.listener=null;a.ec=null;a.src=null;a.$b=null};function pj(a){this.src=a;this.Aa={};this.Sb=0}pj.prototype.add=function(a,b,c,d,e){var f=a.toString();a=this.Aa[f];a||(a=this.Aa[f]=[],this.Sb++);var h=qj(a,b,d,e);-1<h?(b=a[h],c||(b.Ub=!1)):(b=new nj(b,this.src,f,!!d,e),b.Ub=c,a.push(b));return b};pj.prototype.remove=function(a,b,c,d){a=a.toString();if(!(a in this.Aa))return!1;var e=this.Aa[a];b=qj(e,b,c,d);return-1<b?(oj(e[b]),Na.splice.call(e,b,1),0==e.length&&(delete this.Aa[a],this.Sb--),!0):!1};
function rj(a,b){var c=b.type;c in a.Aa&&Ua(a.Aa[c],b)&&(oj(b),0==a.Aa[c].length&&(delete a.Aa[c],a.Sb--))}pj.prototype.wc=function(a,b,c,d){a=this.Aa[a.toString()];var e=-1;a&&(e=qj(a,b,c,d));return-1<e?a[e]:null};pj.prototype.hasListener=function(a,b){var c=void 0!==a,d=c?a.toString():"",e=void 0!==b;return Ca(this.Aa,function(a){for(var h=0;h<a.length;++h)if(!(c&&a[h].type!=d||e&&a[h].wb!=b))return!0;return!1})};
function qj(a,b,c,d){for(var e=0;e<a.length;++e){var f=a[e];if(!f.tb&&f.listener==b&&f.wb==!!c&&f.$b==d)return e}return-1};var sj="closure_lm_"+(1E6*Math.random()|0),tj={},uj=0;
function vj(a,b,c,d,e){if("array"==t(b))for(var f=0;f<b.length;f++)vj(a,b[f],c,d,e);else if(c=wj(c),a&&a[jj])a.Ha.add(String(b),c,!1,d,e);else{if(!b)throw Error("Invalid event type");var f=!!d,h=xj(a);h||(a[sj]=h=new pj(a));c=h.add(b,c,!1,d,e);if(!c.ec){d=yj();c.ec=d;d.src=a;d.listener=c;if(a.addEventListener)a.addEventListener(b.toString(),d,f);else if(a.attachEvent)a.attachEvent(zj(b.toString()),d);else throw Error("addEventListener and attachEvent are unavailable.");uj++}}}
function yj(){var a=Aj,b=bj?function(c){return a.call(b.src,b.listener,c)}:function(c){c=a.call(b.src,b.listener,c);if(!c)return c};return b}function Bj(a,b,c,d,e){if("array"==t(b))for(var f=0;f<b.length;f++)Bj(a,b[f],c,d,e);else c=wj(c),a&&a[jj]?a.Ha.remove(String(b),c,d,e):a&&(a=xj(a))&&(b=a.wc(b,c,!!d,e))&&Cj(b)}
function Cj(a){if("number"!=typeof a&&a&&!a.tb){var b=a.src;if(b&&b[jj])rj(b.Ha,a);else{var c=a.type,d=a.ec;b.removeEventListener?b.removeEventListener(c,d,a.wb):b.detachEvent&&b.detachEvent(zj(c),d);uj--;(c=xj(b))?(rj(c,a),0==c.Sb&&(c.src=null,b[sj]=null)):oj(a)}}}function zj(a){return a in tj?tj[a]:tj[a]="on"+a}function Dj(a,b,c,d){var e=!0;if(a=xj(a))if(b=a.Aa[b.toString()])for(b=b.concat(),a=0;a<b.length;a++){var f=b[a];f&&f.wb==c&&!f.tb&&(f=Ej(f,d),e=e&&!1!==f)}return e}
function Ej(a,b){var c=a.listener,d=a.$b||a.src;a.Ub&&Cj(a);return c.call(d,b)}
function Aj(a,b){if(a.tb)return!0;if(!bj){var c;if(!(c=b))a:{c=["window","event"];for(var d=ea,e;e=c.shift();)if(null!=d[e])d=d[e];else{c=null;break a}c=d}e=c;c=new ij(e,this);d=!0;if(!(0>e.keyCode||void 0!=e.returnValue)){a:{var f=!1;if(0==e.keyCode)try{e.keyCode=-1;break a}catch(h){f=!0}if(f||void 0==e.returnValue)e.returnValue=!0}e=[];for(f=c.currentTarget;f;f=f.parentNode)e.push(f);for(var f=a.type,k=e.length-1;!c.ib&&0<=k;k--){c.currentTarget=e[k];var l=Dj(e[k],f,!0,c),d=d&&l}for(k=0;!c.ib&&
k<e.length;k++)c.currentTarget=e[k],l=Dj(e[k],f,!1,c),d=d&&l}return d}return Ej(a,new ij(b,this))}function xj(a){a=a[sj];return a instanceof pj?a:null}var Fj="__closure_events_fn_"+(1E9*Math.random()>>>0);function wj(a){if(ka(a))return a;a[Fj]||(a[Fj]=function(b){return a.handleEvent(b)});return a[Fj]};function Gj(a,b,c,d,e){for(var f=0;;)if(f<e)c[d+f]=a[b+f],f+=1;else break}function Hj(a,b,c,d){this.head=a;this.I=b;this.length=c;this.f=d}Hj.prototype.pop=function(){if(0===this.length)return null;var a=this.f[this.I];this.f[this.I]=null;this.I=(this.I+1)%this.f.length;--this.length;return a};Hj.prototype.unshift=function(a){this.f[this.head]=a;this.head=(this.head+1)%this.f.length;this.length+=1;return null};
Hj.prototype.resize=function(){var a=Array(2*this.f.length);return this.I<this.head?(Gj(this.f,this.I,a,0,this.length),this.I=0,this.head=this.length,this.f=a):this.I>this.head?(Gj(this.f,this.I,a,0,this.f.length-this.I),Gj(this.f,0,a,this.f.length-this.I,this.head),this.I=0,this.head=this.length,this.f=a):this.I===this.head?(this.head=this.I=0,this.f=a):null};if("undefined"===typeof Ij)var Ij={};var Jj;
function Kj(){var a=ea.MessageChannel;"undefined"===typeof a&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&!Oi("Presto")&&(a=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ua(function(a){if(("*"==d||a.origin==d)&&a.data==
c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof a&&!Oi("Trident")&&!Oi("MSIE")){var b=new a,c={},d=c;b.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.Cc;c.Cc=null;a()}};return function(a){d.next={Cc:a};d=d.next;b.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=document.createElement("SCRIPT");
b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){ea.setTimeout(a,0)}};var Lj;Lj=new Hj(0,0,0,Array(32));var Mj=!1,Nj=!1;Oj;function Pj(){Mj=!0;Nj=!1;for(var a=0;;){var b=Lj.pop();if(null!=b&&(b.v?b.v():b.call(null),1024>a)){a+=1;continue}break}Mj=!1;return 0<Lj.length?Oj.v?Oj.v():Oj.call(null):null}function Oj(){var a=Nj;if(y(y(a)?Mj:a))return null;Nj=!0;!ka(ea.setImmediate)||ea.Window&&ea.Window.prototype&&ea.Window.prototype.setImmediate==ea.setImmediate?(Jj||(Jj=Kj()),Jj(Pj)):ea.setImmediate(Pj)};for(var Qj=Array(1),Rj=0;;)if(Rj<Qj.length)Qj[Rj]=null,Rj+=1;else break;(function(a){"undefined"===typeof Ki&&(Ki=function(a,c,d){this.rd=a;this.Yc=c;this.td=d;this.i=393216;this.B=0},Ki.prototype.S=function(a,c){return new Ki(this.rd,this.Yc,c)},Ki.prototype.P=function(){return this.td},Ki.sd=function(){return new V(null,3,5,W,[Ji,xh,gi],null)},Ki.uc=!0,Ki.Eb="cljs.core.async/t_cljs$core$async11405",Ki.Jc=function(a,c){return fc(c,"cljs.core.async/t_cljs$core$async11405")});return new Ki(a,!0,Je)})(function(){return null});var Sj=VDOM.diff,Tj=VDOM.patch,Uj=VDOM.create;function Vj(a){return hf(Ne(lb),hf(Ne(Sd),jf(a)))}function Wj(a,b,c){return new VDOM.VHtml(ie(a),Vg(b),Vg(c))}function Xj(a,b,c){return new VDOM.VSvg(ie(a),Vg(b),Vg(c))}Yj;
var Zj=function Zj(b){if(null==b)return new VDOM.VText("");if(Sd(b))return Wj(Vh,Je,he.b(Zj,Vj(b)));if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(Jc.b(hi,O(b)))return Yj.a?Yj.a(b):Yj.call(null,b);var c=U(b,0),d=U(b,1);b=ge(b);return Wj(c,d,he.b(Zj,Vj(b)))},Yj=function Yj(b){if(null==b)return new VDOM.VText("");if("string"===typeof b||"number"===typeof b)return new VDOM.VText(b);if(Jc.b(Fi,O(b))){var c=U(b,0),d=U(b,1);b=ge(b);return Xj(c,d,he.b(Zj,Vj(b)))}c=U(b,0);d=U(b,1);
b=ge(b);return Xj(c,d,he.b(Yj,Vj(b)))};
function ak(){var a=document.getElementById("app"),b=function(){var a=new VDOM.VText("");return Re.a?Re.a(a):Re.call(null,a)}(),c=function(){var a;a=Q.a?Q.a(b):Q.call(null,b);a=Uj.a?Uj.a(a):Uj.call(null,a);return Re.a?Re.a(a):Re.call(null,a)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.v?a.v():a.call(null)}}(b,c):function(){return function(a){return window.requestAnimationFrame(a)}}(b,c);a.appendChild(Q.a?Q.a(c):Q.call(null,c));return function(a,b,c){return function(d){var l=
Zj(d);d=function(){var b=Q.a?Q.a(a):Q.call(null,a);return Sj.b?Sj.b(b,l):Sj.call(null,b,l)}();Ue.b?Ue.b(a,l):Ue.call(null,a,l);d=function(a,b,c,d){return function(){return Xe.c(d,Tj,b)}}(l,d,a,b,c);return c.a?c.a(d):c.call(null,d)}}(b,c,d)};var bk=Math.E,ck=Math.PI,dk=2*ck;function ek(a){return a*a}function fk(a){return 1/180*ck*a}function gk(a,b){return Math.abs(a-b)}function hk(a,b,c){for(;;){var d=c-(a.a?a.a(c):a.call(null,c))/(b.a?b.a(c):b.call(null,c));if(1E-7>gk(c,d))return d;c=d}}function ik(a,b){return Ze(61,df(function(a,b){return function(a){var c=new Date;c.setTime(a.getTime()+1E3*-b);return c}}(60,b/60),a))}function jk(a){return 86400*a}function kk(a,b){return he.b(function(a){return rb.b(Zd,he.c(ae,a,b))},a)}
function lk(a){return new V(null,3,5,W,[new V(null,3,5,W,[Math.cos(a),-Math.sin(a),0],null),new V(null,3,5,W,[Math.sin(a),Math.cos(a),0],null),new V(null,3,5,W,[0,0,1],null)],null)}function mk(a){return 1496E8*a}
var nk=function nk(b){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return nk.c(arguments[0],arguments[1],arguments[2]);case 4:return nk.m(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([F("Invalid arity: "),F(c.length)].join(""));}};nk.c=function(a,b,c){return nk.m(a,b,c,12)};nk.m=function(a,b,c,d){return new Date(a,b-1,c,d,0,0)};nk.w=4;var ok=nk.m(2E3,1,1,12);function pk(a,b){function c(c){return c-a*Math.sin(c)-b}return hk(c,function(){return function(b){return 1-a*Math.cos(b)}}(c),b)}
function qk(a,b){var c=li.a(a);if(!y(c))var d=Gi.a(a),e=fi.a(a),c=ti.a(a),f=ci.a(a),h=xi.a(a),k=qi.a(a),l=Th.a(a),m=(a.a?a.a(qh):a.call(null,qh)).getTime()/1E3,k=pk(e,(b.getTime()/1E3-m)*dk/k+l),k=2*Math.atan2(Math.sqrt(1+e)*Math.sin(k/2),Math.sqrt(1-e)*Math.cos(k/2)),d=d*(1-e*e)/(1+e*Math.cos(k)),c=kk(lk(f),kk(new V(null,3,5,W,[new V(null,3,5,W,[1,0,0],null),new V(null,3,5,W,[0,Math.cos(c),-Math.sin(c)],null),new V(null,3,5,W,[0,Math.sin(c),Math.cos(c)],null)],null),kk(lk(h),new V(null,3,5,W,[d*
Math.cos(k),d*Math.sin(k),0],null))));return c};function rk(a){var b=new Ia;for(a=N(a);;)if(null!=a)b.append(""+F(O(a))),a=P(a),null!=a&&b.append("");else return b.toString()}function sk(a){a:for(a="/(?:)/"===""+F("-")?xd.b(Xd(R("",he.b(F,N(a)))),""):Xd((""+F(a)).split("-"));;)if(""===(null==a?null:Nb(a)))a=null==a?null:Ob(a);else break a;return a};var tk=new Dg(null,new v(null,2,[Lh,null,Ei,null],null),null);function uk(a,b){return[F("translate("),F(a),F(","),F(b),F(")")].join("")}function vk(a){var b=U(a,0);a=U(a,1);return[F(b),F(","),F(a)].join("")}function wk(a){return[F("M"),F(rk(ff(he.b(vk,a))))].join("")}function xk(a){var b;b=2-S(""+F(a));b=Ze(b,cf("0"));return[F(G.b(F,b)),F(a)].join("")}function yk(a){return[F(a.getFullYear()),F("-"),F(xk(a.getMonth()+1)),F("-"),F(xk(a.getDate()))].join("")}
function zk(a,b){var c=null!=b&&(b.i&64||b.Va)?G.b(fd,b):b,d=K.b(c,sh),e=K.b(c,Xh),f=K.b(c,th);return new V(null,5,5,W,[Vh,Je,new V(null,3,5,W,[Vh,new v(null,1,[Rh,"right"],null),function(){var a=U(e,0),b=U(e,1);return y(y(a)?b:a)?(a=qk(a,f),b=qk(b,f),b=rb.b(Zd,he.c(Oe.b(ek,gk),a,b)),b=Math.sqrt(b),new V(null,3,5,W,[Vh,Je,new V(null,7,5,W,[Vh,Je,(b/1496E8).toFixed(3)," AU"," (",(1*Math.round(b/1E3/1)).toLocaleString()," km)"],null)],null)):"Click two bodies to see the distance between them."}()],
null),new V(null,6,5,W,[Vh,new v(null,1,[Rh,"spaced"],null),"Zoom:",new V(null,3,5,W,[Ah,new v(null,2,[Rh,"button--square",Jh,function(){return function(){return a.b?a.b($h,be):a.call(null,$h,be)}}(b,c,d,e,f)],null),"-"],null),new V(null,3,5,W,[Ii,Je,d],null),new V(null,3,5,W,[Ah,new v(null,2,[Rh,"button--square",Jh,function(){return function(){return a.b?a.b($h,id):a.call(null,$h,id)}}(b,c,d,e,f)],null),"+"],null)],null),new V(null,4,5,W,[Vh,new v(null,1,[Rh,"spaced"],null),"Date:",new V(null,2,
5,W,[ri,new v(null,3,[yh,"YYYY-MM-DD",Gh,yk(f),ph,function(){return function(){var b=this.value;return a.b?a.b(Sh,b):a.call(null,Sh,b)}}(b,c,d,e,f)],null)],null)],null)],null)}
function Ak(a,b,c,d){var e=y(function(){var a=Ph.a(d);return tk.a?tk.a(a):tk.call(null,a)}())?"8":"10",f=y(function(){var a=Ph.a(d);return tk.a?tk.a(a):tk.call(null,a)}())?"hsl(0, 0%, 70%)":"hsl(0, 0%, 100%)";return new V(null,5,5,W,[Zh,new v(null,3,[wh,G.b(uk,function(){var a=qk(d,c);return b.a?b.a(a):b.call(null,a)}()),Uh,new v(null,1,[Nh,"pointer"],null),Jh,function(){return function(){return a.b?a.b(lh,d):a.call(null,lh,d)}}(e,f)],null),new V(null,2,5,W,[Hh,new v(null,2,[uh,2,Fh,f],null)],null),
new V(null,3,5,W,[Hi,new v(null,5,[Kh,-3,zh,e,mh,"middle",vh,"black",ai,2],null),Dh.a(d)],null),new V(null,3,5,W,[Hi,new v(null,4,[Kh,-3,zh,e,mh,"middle",Fh,f],null),Dh.a(d)],null)],null)}
function Bk(a,b){var c=null!=b&&(b.i&64||b.Va)?G.b(fd,b):b,d=K.b(c,yi),e=K.b(c,sh),f=K.b(c,Bh),h=K.b(c,Xh),k=K.b(c,th),l=new V(null,2,5,W,[960,600],null),m=U(l,0),n=U(l,1),p=function(){return function(a){var b=Math.log(2E-12)/-100;return Math.pow(bk,b*a)}}(l,m,n,b,c,d,e,f,h,k),q=function(a,b,c,d,e,f,h,k){return function(a){var b=U(a,0);a=U(a,1);var c=d(k);return new V(null,2,5,W,[c*b,c*-a],null)}}(l,m,n,p,b,c,d,e,f,h,k);return new V(null,4,5,W,[hi,new v(null,8,[Ih,m,Di,n,Ci,"PT Sans",zh,"8pt",Uh,
new v(null,2,[wi,"1px solid lightgray",Nh,"move"],null),ei,function(){return function(b){b.preventDefault();var c=b.clientX;b=b.clientY;return a.c?a.c(ji,c,b):a.call(null,ji,c,b)}}(l,m,n,p,q,b,c,d,e,f,h,k),si,function(){return function(b){b.preventDefault();var c=b.clientX;b=b.clientY;return a.c?a.c(rh,c,b):a.call(null,rh,c,b)}}(l,m,n,p,q,b,c,d,e,f,h,k),oh,function(){return function(b){b.preventDefault();return a.a?a.a(ki):a.call(null,ki)}}(l,m,n,p,q,b,c,d,e,f,h,k)],null),new V(null,2,5,W,[zi,new v(null,
3,[Ih,m,Di,n,Fh,"black"],null)],null),new V(null,3,5,W,[Zh,new v(null,1,[wh,uk(m/2,n/2)],null),new V(null,5,5,W,[Zh,new v(null,1,[wh,G.b(uk,f)],null),function(){return function(a,b,c,d,e,f,h,k,l,m,n,p){return function T(q){return new se(null,function(a,b,c,d,e,f,h,k,l,m,n,p){return function(){for(;;){var r=N(q);if(r){var w=r;if(Od(w)){var u=tc(w),x=S(u),z=we(x);return function(){for(var q=0;;)if(q<x){var B=H.b(u,q);ye(z,new V(null,2,5,W,[nh,new v(null,3,[mi,wk(function(){return function(a,b,c,d,e,
f,h,k,l,m,n,p,q,r,w,u,x,z,B){return function lj(E){return new se(null,function(a,b,c,d,e,f,h,k,l,m,n,p){return function(){for(;;){var a=N(E);if(a){if(Od(a)){var c=tc(a),d=S(c),e=we(d);a:for(var f=0;;)if(f<d){var h=H.b(c,f),h=p(qk(b,h));e.add(h);f+=1}else{c=!0;break a}return c?xe(e.sa(),lj(uc(a))):xe(e.sa(),null)}e=O(a);return R(p(qk(b,e)),lj(Vc(a)))}return null}}}(a,b,c,d,e,f,h,k,l,m,n,p,q,r,w,u,x,z,B),null,null)}}(q,B,u,x,z,w,r,a,b,c,d,e,f,h,k,l,m,n,p)(ik(p,qi.a(B)))}()),vh,y(function(){var a=Ph.a(B);
return tk.a?tk.a(a):tk.call(null,a)}())?"hsl(0, 0%, 20%)":"hsl(0, 0%, 50%)",Fh,"none"],null)],null));q+=1}else return!0}()?xe(z.sa(),T(uc(w))):xe(z.sa(),null)}var B=O(w);return R(new V(null,2,5,W,[nh,new v(null,3,[mi,wk(function(){return function(a,b,c,d,e,f,h,k,l,m,n,p,q,r,w){return function kj(u){return new se(null,function(a,b,c,d,e,f,h,k){return function(){for(;;){var b=N(u);if(b){if(Od(b)){var c=tc(b),d=S(c),e=we(d);a:for(var f=0;;)if(f<d){var h=H.b(c,f),h=k(qk(a,h));e.add(h);f+=1}else{c=!0;
break a}return c?xe(e.sa(),kj(uc(b))):xe(e.sa(),null)}e=O(b);return R(k(qk(a,e)),kj(Vc(b)))}return null}}}(a,b,c,d,e,f,h,k,l,m,n,p,q,r,w),null,null)}}(B,w,r,a,b,c,d,e,f,h,k,l,m,n,p)(ik(p,qi.a(B)))}()),vh,y(function(){var a=Ph.a(B);return tk.a?tk.a(a):tk.call(null,a)}())?"hsl(0, 0%, 20%)":"hsl(0, 0%, 50%)",Fh,"none"],null)],null),T(Vc(w)))}return null}}}(a,b,c,d,e,f,h,k,l,m,n,p),null,null)}}(l,m,n,p,q,b,c,d,e,f,h,k)(d)}(),function(){return function(b,c,d,e,f,h,k,l,m,n,p,q){return function T(da){return new se(null,
function(b,c,d,e,f,h,k,l,m,n,p,q){return function(){for(;;){var b=N(da);if(b){if(Od(b)){var c=tc(b),d=S(c),e=we(d);a:for(var h=0;;)if(h<d){var k=H.b(c,h),k=Ak(a,f,q,k);e.add(k);h+=1}else{c=!0;break a}return c?xe(e.sa(),T(uc(b))):xe(e.sa(),null)}e=O(b);return R(Ak(a,f,q,e),T(Vc(b)))}return null}}}(b,c,d,e,f,h,k,l,m,n,p,q),null,null)}}(l,m,n,p,q,b,c,d,e,f,h,k)(d)}(),function(){var a=U(h,0),b=U(h,1);return y(y(a)?b:a)?(a=q(qk(a,k)),b=q(qk(b,k)),new V(null,3,5,W,[Zh,Je,new V(null,2,5,W,[nh,new v(null,
3,[mi,wk(new V(null,2,5,W,[a,b],null)),vh,"dodgerblue",Fh,"none"],null)],null)],null)):null}()],null)],null)],null)};function Ck(){dj.call(this);this.Ha=new pj(this);this.Xc=this;this.zc=null}wa(Ck,dj);Ck.prototype[jj]=!0;g=Ck.prototype;g.addEventListener=function(a,b,c,d){vj(this,a,b,c,d)};g.removeEventListener=function(a,b,c,d){Bj(this,a,b,c,d)};
g.dispatchEvent=function(a){var b,c=this.zc;if(c)for(b=[];c;c=c.zc)b.push(c);var c=this.Xc,d=a.type||a;if(ia(a))a=new gj(a,c);else if(a instanceof gj)a.target=a.target||c;else{var e=a;a=new gj(d,c);Ga(a,e)}var e=!0,f;if(b)for(var h=b.length-1;!a.ib&&0<=h;h--)f=a.currentTarget=b[h],e=Dk(f,d,!0,a)&&e;a.ib||(f=a.currentTarget=c,e=Dk(f,d,!0,a)&&e,a.ib||(e=Dk(f,d,!1,a)&&e));if(b)for(h=0;!a.ib&&h<b.length;h++)f=a.currentTarget=b[h],e=Dk(f,d,!1,a)&&e;return e};
g.Fb=function(){Ck.fc.Fb.call(this);if(this.Ha){var a=this.Ha,b=0,c;for(c in a.Aa){for(var d=a.Aa[c],e=0;e<d.length;e++)++b,oj(d[e]);delete a.Aa[c];a.Sb--}}this.zc=null};function Dk(a,b,c,d){b=a.Ha.Aa[String(b)];if(!b)return!0;b=b.concat();for(var e=!0,f=0;f<b.length;++f){var h=b[f];if(h&&!h.tb&&h.wb==c){var k=h.listener,l=h.$b||h.src;h.Ub&&rj(a.Ha,h);e=!1!==k.call(l,d)&&e}}return e&&0!=d.Tc}g.wc=function(a,b,c,d){return this.Ha.wc(String(a),b,c,d)};
g.hasListener=function(a,b){return this.Ha.hasListener(void 0!==a?String(a):void 0,b)};function Ek(a,b,c){if(ka(a))c&&(a=ua(a,c));else if(a&&"function"==typeof a.handleEvent)a=ua(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<b?-1:ea.setTimeout(a,b||0)};function Fk(a){if("function"==typeof a.Zb)return a.Zb();if(ia(a))return a.split("");if(ga(a)){for(var b=[],c=a.length,d=0;d<c;d++)b.push(a[d]);return b}return Da(a)}
function Gk(a,b){if("function"==typeof a.forEach)a.forEach(b,void 0);else if(ga(a)||ia(a))Ra(a,b,void 0);else{var c;if("function"==typeof a.Ib)c=a.Ib();else if("function"!=typeof a.Zb)if(ga(a)||ia(a)){c=[];for(var d=a.length,e=0;e<d;e++)c.push(e)}else c=Ea(a);else c=void 0;for(var d=Fk(a),e=d.length,f=0;f<e;f++)b.call(void 0,d[f],c&&c[f],a)}};function Hk(a,b){this.Ra={};this.za=[];this.nb=0;var c=arguments.length;if(1<c){if(c%2)throw Error("Uneven number of arguments");for(var d=0;d<c;d+=2)this.set(arguments[d],arguments[d+1])}else a&&this.addAll(a)}g=Hk.prototype;g.Zb=function(){Ik(this);for(var a=[],b=0;b<this.za.length;b++)a.push(this.Ra[this.za[b]]);return a};g.Ib=function(){Ik(this);return this.za.concat()};g.clear=function(){this.Ra={};this.nb=this.za.length=0};
g.remove=function(a){return Object.prototype.hasOwnProperty.call(this.Ra,a)?(delete this.Ra[a],this.nb--,this.za.length>2*this.nb&&Ik(this),!0):!1};function Ik(a){if(a.nb!=a.za.length){for(var b=0,c=0;b<a.za.length;){var d=a.za[b];Object.prototype.hasOwnProperty.call(a.Ra,d)&&(a.za[c++]=d);b++}a.za.length=c}if(a.nb!=a.za.length){for(var e={},c=b=0;b<a.za.length;)d=a.za[b],Object.prototype.hasOwnProperty.call(e,d)||(a.za[c++]=d,e[d]=1),b++;a.za.length=c}}
g.get=function(a,b){return Object.prototype.hasOwnProperty.call(this.Ra,a)?this.Ra[a]:b};g.set=function(a,b){Object.prototype.hasOwnProperty.call(this.Ra,a)||(this.nb++,this.za.push(a));this.Ra[a]=b};g.addAll=function(a){var b;a instanceof Hk?(b=a.Ib(),a=a.Zb()):(b=Ea(a),a=Da(a));for(var c=0;c<b.length;c++)this.set(b[c],a[c])};g.forEach=function(a,b){for(var c=this.Ib(),d=0;d<c.length;d++){var e=c[d],f=this.get(e);a.call(b,f,e,this)}};g.clone=function(){return new Hk(this)};function Jk(a,b,c,d,e){this.reset(a,b,c,d,e)}Jk.prototype.Mc=null;var Kk=0;Jk.prototype.reset=function(a,b,c,d,e){"number"==typeof e||Kk++;d||va();this.Nb=a;this.vd=b;delete this.Mc};Jk.prototype.Vc=function(a){this.Nb=a};function Lk(a){this.Qc=a;this.Nc=this.nc=this.Nb=this.dc=null}function Mk(a,b){this.name=a;this.value=b}Mk.prototype.toString=function(){return this.name};var Nk=new Mk("SEVERE",1E3),Ok=new Mk("INFO",800),Pk=new Mk("CONFIG",700),Qk=new Mk("FINE",500);g=Lk.prototype;g.getName=function(){return this.Qc};g.getParent=function(){return this.dc};g.Vc=function(a){this.Nb=a};function Rk(a){if(a.Nb)return a.Nb;if(a.dc)return Rk(a.dc);Ma("Root logger has no level set.");return null}
g.log=function(a,b,c){if(a.value>=Rk(this).value)for(ka(b)&&(b=b()),a=new Jk(a,String(b),this.Qc),c&&(a.Mc=c),c="log:"+a.vd,ea.console&&(ea.console.timeStamp?ea.console.timeStamp(c):ea.console.markTimeline&&ea.console.markTimeline(c)),ea.msWriteProfilerMark&&ea.msWriteProfilerMark(c),c=this;c;){b=c;var d=a;if(b.Nc)for(var e=0,f=void 0;f=b.Nc[e];e++)f(d);c=c.getParent()}};g.info=function(a,b){this.log(Ok,a,b)};var Sk={},Tk=null;
function Uk(a){Tk||(Tk=new Lk(""),Sk[""]=Tk,Tk.Vc(Pk));var b;if(!(b=Sk[a])){b=new Lk(a);var c=a.lastIndexOf("."),d=a.substr(c+1),c=Uk(a.substr(0,c));c.nc||(c.nc={});c.nc[d]=b;b.dc=c;Sk[a]=b}return b};function Vk(a,b){a&&a.log(Qk,b,void 0)};function Wk(){}Wk.prototype.Bc=null;function Xk(a){var b;(b=a.Bc)||(b={},Yk(a)&&(b[0]=!0,b[1]=!0),b=a.Bc=b);return b};var Zk;function $k(){}wa($k,Wk);function al(a){return(a=Yk(a))?new ActiveXObject(a):new XMLHttpRequest}function Yk(a){if(!a.Oc&&"undefined"==typeof XMLHttpRequest&&"undefined"!=typeof ActiveXObject){for(var b=["MSXML2.XMLHTTP.6.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],c=0;c<b.length;c++){var d=b[c];try{return new ActiveXObject(d),a.Oc=d}catch(e){}}throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed");}return a.Oc}Zk=new $k;var bl=/^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/;function cl(a){if(dl){dl=!1;var b=ea.location;if(b){var c=b.href;if(c&&(c=(c=cl(c)[3]||null)?decodeURI(c):c)&&c!=b.hostname)throw dl=!0,Error();}}return a.match(bl)}var dl=Ti;function el(a){Ck.call(this);this.headers=new Hk;this.kc=a||null;this.Ta=!1;this.jc=this.J=null;this.Mb=this.Pc=this.bc="";this.gb=this.yc=this.ac=this.vc=!1;this.Rb=0;this.gc=null;this.Sc=fl;this.hc=this.Bd=!1}wa(el,Ck);var fl="",gl=el.prototype,hl=Uk("goog.net.XhrIo");gl.Fa=hl;var il=/^https?$/i,jl=["POST","PUT"],kl=[];g=el.prototype;g.Zc=function(){if(!this.Gb&&(this.Gb=!0,this.Fb(),0!=ej)){var a=la(this);delete fj[a]}Ua(kl,this)};
g.send=function(a,b,c,d){if(this.J)throw Error("[goog.net.XhrIo] Object is active with another request\x3d"+this.bc+"; newUri\x3d"+a);b=b?b.toUpperCase():"GET";this.bc=a;this.Mb="";this.Pc=b;this.vc=!1;this.Ta=!0;this.J=this.kc?al(this.kc):al(Zk);this.jc=this.kc?Xk(this.kc):Xk(Zk);this.J.onreadystatechange=ua(this.Rc,this);try{Vk(this.Fa,ll(this,"Opening Xhr")),this.yc=!0,this.J.open(b,String(a),!0),this.yc=!1}catch(e){Vk(this.Fa,ll(this,"Error opening Xhr: "+e.message));ml(this,e);return}a=c||"";
var f=this.headers.clone();d&&Gk(d,function(a,b){f.set(b,a)});d=Sa(f.Ib());c=ea.FormData&&a instanceof ea.FormData;!(0<=Oa(jl,b))||d||c||f.set("Content-Type","application/x-www-form-urlencoded;charset\x3dutf-8");f.forEach(function(a,b){this.J.setRequestHeader(b,a)},this);this.Sc&&(this.J.responseType=this.Sc);"withCredentials"in this.J&&(this.J.withCredentials=this.Bd);try{nl(this),0<this.Rb&&(this.hc=ol(this.J),Vk(this.Fa,ll(this,"Will abort after "+this.Rb+"ms if incomplete, xhr2 "+this.hc)),this.hc?
(this.J.timeout=this.Rb,this.J.ontimeout=ua(this.Wc,this)):this.gc=Ek(this.Wc,this.Rb,this)),Vk(this.Fa,ll(this,"Sending request")),this.ac=!0,this.J.send(a),this.ac=!1}catch(h){Vk(this.Fa,ll(this,"Send error: "+h.message)),ml(this,h)}};function ol(a){return Qi&&Yi(9)&&"number"==typeof a.timeout&&void 0!==a.ontimeout}function Ta(a){return"content-type"==a.toLowerCase()}
g.Wc=function(){"undefined"!=typeof ba&&this.J&&(this.Mb="Timed out after "+this.Rb+"ms, aborting",Vk(this.Fa,ll(this,this.Mb)),this.dispatchEvent("timeout"),this.abort(8))};function ml(a,b){a.Ta=!1;a.J&&(a.gb=!0,a.J.abort(),a.gb=!1);a.Mb=b;pl(a);ql(a)}function pl(a){a.vc||(a.vc=!0,a.dispatchEvent("complete"),a.dispatchEvent("error"))}
g.abort=function(){this.J&&this.Ta&&(Vk(this.Fa,ll(this,"Aborting")),this.Ta=!1,this.gb=!0,this.J.abort(),this.gb=!1,this.dispatchEvent("complete"),this.dispatchEvent("abort"),ql(this))};g.Fb=function(){this.J&&(this.Ta&&(this.Ta=!1,this.gb=!0,this.J.abort(),this.gb=!1),ql(this,!0));el.fc.Fb.call(this)};g.Rc=function(){this.Gb||(this.yc||this.ac||this.gb?rl(this):this.xd())};g.xd=function(){rl(this)};
function rl(a){if(a.Ta&&"undefined"!=typeof ba)if(a.jc[1]&&4==sl(a)&&2==tl(a))Vk(a.Fa,ll(a,"Local request error detected and ignored"));else if(a.ac&&4==sl(a))Ek(a.Rc,0,a);else if(a.dispatchEvent("readystatechange"),4==sl(a)){Vk(a.Fa,ll(a,"Request complete"));a.Ta=!1;try{var b=tl(a),c;a:switch(b){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:c=!0;break a;default:c=!1}var d;if(!(d=c)){var e;if(e=0===b){var f=cl(String(a.bc))[1]||null;if(!f&&ea.self&&ea.self.location)var h=ea.self.location.protocol,
f=h.substr(0,h.length-1);e=!il.test(f?f.toLowerCase():"")}d=e}if(d)a.dispatchEvent("complete"),a.dispatchEvent("success");else{var k;try{k=2<sl(a)?a.J.statusText:""}catch(l){Vk(a.Fa,"Can not get status: "+l.message),k=""}a.Mb=k+" ["+tl(a)+"]";pl(a)}}finally{ql(a)}}}function ql(a,b){if(a.J){nl(a);var c=a.J,d=a.jc[0]?fa:null;a.J=null;a.jc=null;b||a.dispatchEvent("ready");try{c.onreadystatechange=d}catch(e){(c=a.Fa)&&c.log(Nk,"Problem encountered resetting onreadystatechange: "+e.message,void 0)}}}
function nl(a){a.J&&a.hc&&(a.J.ontimeout=null);"number"==typeof a.gc&&(ea.clearTimeout(a.gc),a.gc=null)}function sl(a){return a.J?a.J.readyState:0}function tl(a){try{return 2<sl(a)?a.J.status:-1}catch(b){return-1}}function ul(a){try{return a.J?a.J.responseText:""}catch(b){return Vk(a.Fa,"Can not get responseText: "+b.message),""}}g.getResponseHeader=function(a){return this.J&&4==sl(this)?this.J.getResponseHeader(a):void 0};
g.getAllResponseHeaders=function(){return this.J&&4==sl(this)?this.J.getAllResponseHeaders():""};function ll(a,b){return b+" ["+a.Pc+" "+a.bc+" "+tl(a)+"]"};var vl=function vl(b){if(null!=b&&null!=b.Kc)return b.Kc();var c=vl[t(null==b?null:b)];if(null!=c)return c.a?c.a(b):c.call(null,b);c=vl._;if(null!=c)return c.a?c.a(b):c.call(null,b);throw D("PushbackReader.read-char",b);},wl=function wl(b,c){if(null!=b&&null!=b.Lc)return b.Lc(0,c);var d=wl[t(null==b?null:b)];if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);d=wl._;if(null!=d)return d.b?d.b(b,c):d.call(null,b,c);throw D("PushbackReader.unread",b);};
function xl(a,b,c){this.F=a;this.buffer=b;this.xc=c}xl.prototype.Kc=function(){return 0===this.buffer.length?(this.xc+=1,this.F[this.xc]):this.buffer.pop()};xl.prototype.Lc=function(a,b){return this.buffer.push(b)};function yl(a){var b=!/[^\t\n\r ]/.test(a);return y(b)?b:","===a}zl;Al;Bl;function Cl(a){throw Error(G.b(F,a));}
function Dl(a,b){for(var c=new Ia(b),d=vl(a);;){var e;if(!(e=null==d||yl(d))){e=d;var f="#"!==e;e=f?(f="'"!==e)?(f=":"!==e)?Al.a?Al.a(e):Al.call(null,e):f:f:f}if(e)return wl(a,d),c.toString();c.append(d);d=vl(a)}}function El(a){for(;;){var b=vl(a);if("\n"===b||"\r"===b||null==b)return a}}var Fl=Gg("^([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+))(N)?$"),Gl=Gg("^([-+]?[0-9]+)/([0-9]+)$"),Hl=Gg("^([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?$"),Il=Gg("^[:]?([^0-9/].*/)?([^0-9/][^/]*)$");
function Jl(a,b){var c=a.exec(b);return null!=c&&c[0]===b?1===c.length?c[0]:c:null}var Kl=Gg("^[0-9A-Fa-f]{2}$"),Ll=Gg("^[0-9A-Fa-f]{4}$");function Ml(a,b,c){return y(Fg(a,c))?c:Cl(L(["Unexpected unicode escape \\",b,c],0))}function Nl(a){return String.fromCharCode(parseInt(a,16))}
function Ol(a){var b=vl(a),c="t"===b?"\t":"r"===b?"\r":"n"===b?"\n":"\\"===b?"\\":'"'===b?'"':"b"===b?"\b":"f"===b?"\f":null;y(c)?b=c:"x"===b?(a=(new Ia(vl(a),vl(a))).toString(),b=Nl(Ml(Kl,b,a))):"u"===b?(a=(new Ia(vl(a),vl(a),vl(a),vl(a))).toString(),b=Nl(Ml(Ll,b,a))):b=/[^0-9]/.test(b)?Cl(L(["Unexpected unicode escape \\",b],0)):String.fromCharCode(b);return b}
function Pl(a,b){for(var c=lc(yd);;){var d;a:{d=yl;for(var e=b,f=vl(e);;)if(y(d.a?d.a(f):d.call(null,f)))f=vl(e);else{d=f;break a}}y(d)||Cl(L(["EOF while reading"],0));if(a===d)return nc(c);e=Al.a?Al.a(d):Al.call(null,d);y(e)?d=e.b?e.b(b,d):e.call(null,b,d):(wl(b,d),d=zl.m?zl.m(b,!0,null,!0):zl.call(null,b,!0,null));c=d===b?c:Ce.b(c,d)}}function Ql(a,b){return Cl(L(["Reader for ",b," not implemented yet"],0))}Rl;
function Sl(a,b){var c=vl(a),d=Bl.a?Bl.a(c):Bl.call(null,c);if(y(d))return d.b?d.b(a,b):d.call(null,a,b);d=Rl.b?Rl.b(a,c):Rl.call(null,a,c);return y(d)?d:Cl(L(["No dispatch macro for ",c],0))}function Tl(a,b){return Cl(L(["Unmatched delimiter ",b],0))}function Ul(a){return G.b(Ic,Pl(")",a))}function Vl(a){return Pl("]",a)}
function Wl(a){a=Pl("}",a);var b=S(a);if("number"!==typeof b||isNaN(b)||Infinity===b||parseFloat(b)!==parseInt(b,10))throw Error([F("Argument must be an integer: "),F(b)].join(""));0!==(b&1)&&Cl(L(["Map literal must contain an even number of forms"],0));return G.b(fd,a)}function Xl(a){for(var b=new Ia,c=vl(a);;){if(null==c)return Cl(L(["EOF while reading"],0));if("\\"===c)b.append(Ol(a));else{if('"'===c)return b.toString();b.append(c)}c=vl(a)}}
function Yl(a){for(var b=new Ia,c=vl(a);;){if(null==c)return Cl(L(["EOF while reading"],0));if("\\"===c){b.append(c);var d=vl(a);if(null==d)return Cl(L(["EOF while reading"],0));var e=function(){var a=b;a.append(d);return a}(),f=vl(a)}else{if('"'===c)return b.toString();e=function(){var a=b;a.append(c);return a}();f=vl(a)}b=e;c=f}}
function Zl(a,b){var c=Dl(a,b),d=-1!=c.indexOf("/");y(y(d)?1!==c.length:d)?c=Tc.b(c.substring(0,c.indexOf("/")),c.substring(c.indexOf("/")+1,c.length)):(d=Tc.a(c),c="nil"===c?null:"true"===c?!0:"false"===c?!1:"/"===c?di:d);return c}
function $l(a,b){var c=Dl(a,b),d=c.substring(1);return 1===d.length?d:"tab"===d?"\t":"return"===d?"\r":"newline"===d?"\n":"space"===d?" ":"backspace"===d?"\b":"formfeed"===d?"\f":"u"===d.charAt(0)?Nl(d.substring(1)):"o"===d.charAt(0)?Ql(0,c):Cl(L(["Unknown character literal: ",c],0))}
function am(a){a=Dl(a,vl(a));var b=Jl(Il,a);a=b[0];var c=b[1],b=b[2];return void 0!==c&&":/"===c.substring(c.length-2,c.length)||":"===b[b.length-1]||-1!==a.indexOf("::",1)?Cl(L(["Invalid token: ",a],0)):null!=c&&0<c.length?re.b(c.substring(0,c.indexOf("/")),b):re.a(a)}function bm(a){return function(b){return wb(wb(Wc,zl.m?zl.m(b,!0,null,!0):zl.call(null,b,!0,null)),a)}}function cm(){return function(){return Cl(L(["Unreadable form"],0))}}
function dm(a){var b;b=zl.m?zl.m(a,!0,null,!0):zl.call(null,a,!0,null);if(b instanceof I)b=new v(null,1,[ni,b],null);else if("string"===typeof b)b=new v(null,1,[ni,b],null);else if(b instanceof A){b=[b,!0];for(var c=[],d=0;;)if(d<b.length){var e=b[d],f=b[d+1];-1===Vf(c,e)&&(c.push(e),c.push(f));d+=2}else break;b=new v(null,c.length/2,c,null)}Jd(b)||Cl(L(["Metadata must be Symbol,Keyword,String or Map"],0));a=zl.m?zl.m(a,!0,null,!0):zl.call(null,a,!0,null);return(null!=a?a.i&262144||a.Ld||(a.i?0:C(Ub,
a)):C(Ub,a))?hd(a,Ag.l(L([Gd(a),b],0))):Cl(L(["Metadata can only be applied to IWithMetas"],0))}function em(a){a:if(a=Pl("}",a),a=N(a),null==a)a=Eg;else if(a instanceof M&&0===a.s){a=a.f;b:for(var b=0,c=lc(Eg);;)if(b<a.length)var d=b+1,c=c.bb(null,a[b]),b=d;else break b;a=c.mb(null)}else for(d=lc(Eg);;)if(null!=a)b=P(a),d=d.bb(null,a.$(null)),a=b;else{a=nc(d);break a}return a}function fm(a){return Gg(Yl(a))}function gm(a){zl.m?zl.m(a,!0,null,!0):zl.call(null,a,!0,null);return a}
function Al(a){return'"'===a?Xl:":"===a?am:";"===a?El:"'"===a?bm(He):"@"===a?bm(Ai):"^"===a?dm:"`"===a?Ql:"~"===a?Ql:"("===a?Ul:")"===a?Tl:"["===a?Vl:"]"===a?Tl:"{"===a?Wl:"}"===a?Tl:"\\"===a?$l:"#"===a?Sl:null}function Bl(a){return"{"===a?em:"\x3c"===a?cm():'"'===a?fm:"!"===a?El:"_"===a?gm:null}
function zl(a,b,c){for(;;){var d=vl(a);if(null==d)return y(b)?Cl(L(["EOF while reading"],0)):c;if(!yl(d))if(";"===d)a=El.b?El.b(a,d):El.call(null,a);else{var e=Al(d);if(y(e))e=e.b?e.b(a,d):e.call(null,a,d);else{var e=a,f=void 0;!(f=!/[^0-9]/.test(d))&&(f=void 0,f="+"===d||"-"===d)&&(f=vl(e),wl(e,f),f=!/[^0-9]/.test(f));if(f)a:for(e=a,d=new Ia(d),f=vl(e);;){var h;h=null==f;h||(h=(h=yl(f))?h:Al.a?Al.a(f):Al.call(null,f));if(y(h)){wl(e,f);d=e=d.toString();f=void 0;y(Jl(Fl,d))?(d=Jl(Fl,d),f=d[2],null!=
(Jc.b(f,"")?null:f)?f=0:(f=y(d[3])?[d[3],10]:y(d[4])?[d[4],16]:y(d[5])?[d[5],8]:y(d[6])?[d[7],parseInt(d[6],10)]:[null,null],h=f[0],null==h?f=null:(f=parseInt(h,f[1]),f="-"===d[1]?-f:f))):(f=void 0,y(Jl(Gl,d))?(d=Jl(Gl,d),f=parseInt(d[1],10)/parseInt(d[2],10)):f=y(Jl(Hl,d))?parseFloat(d):null);d=f;e=y(d)?d:Cl(L(["Invalid number format [",e,"]"],0));break a}d.append(f);f=vl(e)}else e=Zl(a,d)}if(e!==a)return e}}}
var hm=function(a,b){return function(c,d){return K.b(y(d)?b:a,c)}}(new V(null,13,5,W,[null,31,28,31,30,31,30,31,31,30,31,30,31],null),new V(null,13,5,W,[null,31,29,31,30,31,30,31,31,30,31,30,31],null)),im=/(\d\d\d\d)(?:-(\d\d)(?:-(\d\d)(?:[T](\d\d)(?::(\d\d)(?::(\d\d)(?:[.](\d+))?)?)?)?)?)?(?:[Z]|([-+])(\d\d):(\d\d))?/;function jm(a){a=parseInt(a,10);return nb(isNaN(a))?a:null}
function km(a,b,c,d){a<=b&&b<=c||Cl(L([[F(d),F(" Failed:  "),F(a),F("\x3c\x3d"),F(b),F("\x3c\x3d"),F(c)].join("")],0));return b}
function lm(a){var b=Fg(im,a);U(b,0);var c=U(b,1),d=U(b,2),e=U(b,3),f=U(b,4),h=U(b,5),k=U(b,6),l=U(b,7),m=U(b,8),n=U(b,9),p=U(b,10);if(nb(b))return Cl(L([[F("Unrecognized date/time syntax: "),F(a)].join("")],0));var q=jm(c),r=function(){var a=jm(d);return y(a)?a:1}();a=function(){var a=jm(e);return y(a)?a:1}();var b=function(){var a=jm(f);return y(a)?a:0}(),c=function(){var a=jm(h);return y(a)?a:0}(),u=function(){var a=jm(k);return y(a)?a:0}(),x=function(){var a;a:if(Jc.b(3,S(l)))a=l;else if(3<S(l))a=
l.substring(0,3);else for(a=new Ia(l);;)if(3>a.Ua.length)a=a.append("0");else{a=a.toString();break a}a=jm(a);return y(a)?a:0}(),m=(Jc.b(m,"-")?-1:1)*(60*function(){var a=jm(n);return y(a)?a:0}()+function(){var a=jm(p);return y(a)?a:0}());return new V(null,8,5,W,[q,km(1,r,12,"timestamp month field must be in range 1..12"),km(1,a,function(){var a;a=0===ce(q,4);y(a)&&(a=nb(0===ce(q,100)),a=y(a)?a:0===ce(q,400));return hm.b?hm.b(r,a):hm.call(null,r,a)}(),"timestamp day field must be in range 1..last day in month"),
km(0,b,23,"timestamp hour field must be in range 0..23"),km(0,c,59,"timestamp minute field must be in range 0..59"),km(0,u,Jc.b(c,59)?60:59,"timestamp second field must be in range 0..60"),km(0,x,999,"timestamp millisecond field must be in range 0..999"),m],null)}
var mm,nm=new v(null,4,["inst",function(a){var b;if("string"===typeof a)if(b=lm(a),y(b)){a=U(b,0);var c=U(b,1),d=U(b,2),e=U(b,3),f=U(b,4),h=U(b,5),k=U(b,6);b=U(b,7);b=new Date(Date.UTC(a,c-1,d,e,f,h,k)-6E4*b)}else b=Cl(L([[F("Unrecognized date/time syntax: "),F(a)].join("")],0));else b=Cl(L(["Instance literal expects a string for its timestamp."],0));return b},"uuid",function(a){return"string"===typeof a?new kh(a,null):Cl(L(["UUID literal expects a string as its representation."],0))},"queue",function(a){return Kd(a)?
kf(Nf,a):Cl(L(["Queue literal expects a vector for its elements."],0))},"js",function(a){if(Kd(a)){var b=[];a=N(a);for(var c=null,d=0,e=0;;)if(e<d){var f=c.X(null,e);b.push(f);e+=1}else if(a=N(a))c=a,Od(c)?(a=tc(c),e=uc(c),c=a,d=S(a),a=e):(a=O(c),b.push(a),a=P(c),c=null,d=0),e=0;else break;return b}if(Jd(a)){b={};a=N(a);c=null;for(e=d=0;;)if(e<d){var h=c.X(null,e),f=U(h,0),h=U(h,1);b[ie(f)]=h;e+=1}else if(a=N(a))Od(a)?(d=tc(a),a=uc(a),c=d,d=S(d)):(d=O(a),c=U(d,0),d=U(d,1),b[ie(c)]=d,a=P(a),c=null,
d=0),e=0;else break;return b}return Cl(L([[F("JS literal expects a vector or map containing "),F("only string or unqualified keyword keys")].join("")],0))}],null);mm=Re.a?Re.a(nm):Re.call(null,nm);var om=Re.a?Re.a(null):Re.call(null,null);
function Rl(a,b){var c=Zl(a,b),d=K.b(Q.a?Q.a(mm):Q.call(null,mm),""+F(c)),e=Q.a?Q.a(om):Q.call(null,om);return y(d)?(c=zl(a,!0,null),d.a?d.a(c):d.call(null,c)):y(e)?(d=zl(a,!0,null),e.b?e.b(c,d):e.call(null,c,d)):Cl(L(["Could not find tag parser for ",""+F(c)," in ",Te.l(L([Yf(Q.a?Q.a(mm):Q.call(null,mm))],0))],0))}function pm(a,b){var c=""+F(a);K.b(Q.a?Q.a(mm):Q.call(null,mm),c);Xe.m(mm,Cd,c,b)}function qm(a){a=""+F(a);K.b(Q.a?Q.a(mm):Q.call(null,mm),a);Xe.c(mm,Ed,a)};Ya=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new M(e,0)}return b.call(this,d)}function b(a){return console.log.apply(console,ib.a?ib.a(a):ib.call(null,a))}a.w=0;a.C=function(a){a=N(a);return b(a)};a.l=b;return a}();
Za=function(){function a(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new M(e,0)}return b.call(this,d)}function b(a){return console.error.apply(console,ib.a?ib.a(a):ib.call(null,a))}a.w=0;a.C=function(a){a=N(a);return b(a)};a.l=b;return a}();
if("undefined"===typeof rm){var rm,sm=new V(null,2,5,W,[0,0],null),tm=yd,um=new Date;um.setTime((new Date).getTime());um.setHours(0);um.setMinutes(0);um.setSeconds(0);um.setMilliseconds(0);var vm=new v(null,5,[sh,-77,Bh,sm,Xh,tm,th,um,yi,yd],null);rm=Re.a?Re.a(vm):Re.call(null,vm)}
if("undefined"===typeof jh)var jh=function(){var a=Re.a?Re.a(Je):Re.call(null,Je),b=Re.a?Re.a(Je):Re.call(null,Je),c=Re.a?Re.a(Je):Re.call(null,Je),d=Re.a?Re.a(Je):Re.call(null,Je),e=K.c(Je,vi,Yg());return new hh(Tc.b("nav.core","emit"),function(){return function(){function a(b,c){if(1<arguments.length)for(var d=0,e=Array(arguments.length-1);d<e.length;)e[d]=arguments[d+1],++d;return b}a.w=1;a.C=function(a){var b=O(a);Vc(a);return b};a.l=function(a){return a};return a}()}(a,b,c,d,e),Ch,e,a,b,c,d)}();
ih($h,function(a,b){return Xe.m(rm,mf,sh,b)});ih(Sh,function(a,b){var c=he.b(de,sk(b)),d=U(c,0),e=U(c,1),c=U(c,2);return Xe.m(rm,Cd,th,new Date(d,e-1,c))});ih(lh,function(a,b){return Xe.m(rm,mf,Xh,function(a){var d=W;a:for(;;){var e=P(a);if(null!=e)a=e;else{a=O(a);break a}}return new V(null,2,5,d,[a,b],null)})});ih(ji,function(a,b,c){return Xe.m(rm,Cd,Mh,new V(null,2,5,W,[b,c],null))});
ih(rh,function(a,b,c){a=(Q.a?Q.a(rm):Q.call(null,rm)).call(null,Mh);if(y(a)){var d=lf($d,new V(null,2,5,W,[b,c],null),a);return Xe.b(rm,function(a,d,h){return function(k){return mf.c(Cd.c(k,Mh,new V(null,2,5,W,[b,c],null)),Bh,function(a){return function(b){return lf(Zd,b,a)}}(a,d,h))}}(d,a,a))}return null});ih(ki,function(){return Xe.c(rm,Ed,Mh)});
if("undefined"===typeof wm)var wm=function(a){return function(){var b;b=jh;var c=Q.a?Q.a(rm):Q.call(null,rm);b=new V(null,4,5,W,[ui,Je,zk(b,c),Bk(b,c)],null);return a.a?a.a(b):a.call(null,b)}}(ak());if("undefined"===typeof xm){var xm,ym=rm;kc(ym,oi,function(a,b,c,d){return wm.a?wm.a(d):wm.call(null,d)});xm=ym}
function zm(a){if(Jc.b(a,Yh))return ok;var b;b=(b=Kd(a))?(new Dg(null,new v(null,2,[4,null,3,null],null),null)).call(null,S(a)):b;if(y(b))return G.b(nk,a);throw Error([F("Bad epoch: "),F(a)].join(""));}function Am(a){pm(Qh,Yd);pm(Wh,Yd);pm(ii,fk);pm(bi,jk);pm(Eh,zm);pm(Oh,mk);pm(Bi,function(a){return 3.15581497635456E7*a});if("string"!==typeof a)throw Error("Cannot read from non-string object.");a=zl(new xl(a,[],-1),!1,null);qm(Qh);qm(Wh);qm(ii);qm(bi);qm(Eh);qm(Oh);qm(Bi);return a}
if("undefined"===typeof Bm){var Bm,Cm=function(){return Xe.m(rm,Cd,yi,Am(ul(this)))},Dm=new el;kl.push(Dm);Cm&&Dm.Ha.add("complete",Cm,!1,void 0,void 0);Dm.Ha.add("ready",Dm.Zc,!0,void 0,void 0);Dm.send("bodies.edn","GET",null,{"Content-Type":"application/edn"});Bm=Dm}var Em=Q.a?Q.a(rm):Q.call(null,rm);wm.a?wm.a(Em):wm.call(null,Em);
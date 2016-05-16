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

var f,aa=this;
function ba(b){var a=typeof b;if("object"==a)if(b){if(b instanceof Array)return"array";if(b instanceof Object)return a;var c=Object.prototype.toString.call(b);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof b.length&&"undefined"!=typeof b.splice&&"undefined"!=typeof b.propertyIsEnumerable&&!b.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof b.call&&"undefined"!=typeof b.propertyIsEnumerable&&!b.propertyIsEnumerable("call"))return"function"}else return"null";else if("function"==
a&&"undefined"==typeof b.call)return"object";return a}var ca="closure_uid_"+(1E9*Math.random()>>>0),da=0;function ea(b,a,c){return b.call.apply(b.bind,arguments)}function fa(b,a,c){if(!b)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return b.apply(a,c)}}return function(){return b.apply(a,arguments)}}
function ga(b,a,c){ga=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?ea:fa;return ga.apply(null,arguments)}function ia(b,a){var c=b.split("."),d=aa;c[0]in d||!d.execScript||d.execScript("var "+c[0]);for(var e;c.length&&(e=c.shift());)c.length||void 0===a?d=d[e]?d[e]:d[e]={}:d[e]=a};function ja(b,a){for(var c in b)a.call(void 0,b[c],c,b)};function ka(b,a){null!=b&&this.append.apply(this,arguments)}f=ka.prototype;f.Hb="";f.set=function(b){this.Hb=""+b};f.append=function(b,a,c){this.Hb+=b;if(null!=a)for(var d=1;d<arguments.length;d++)this.Hb+=arguments[d];return this};f.clear=function(){this.Hb=""};f.toString=function(){return this.Hb};function la(b,a){b.sort(a||na)}function oa(b,a){for(var c=0;c<b.length;c++)b[c]={index:c,value:b[c]};var d=a||na;la(b,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<b.length;c++)b[c]=b[c].value}function na(b,a){return b>a?1:b<a?-1:0};var qa={},ra;if("undefined"===typeof sa)var sa=function(){throw Error("No *print-fn* fn set for evaluation environment");};if("undefined"===typeof ta)var ta=function(){throw Error("No *print-err-fn* fn set for evaluation environment");};var ua=null;if("undefined"===typeof va)var va=null;function ya(){return new l(null,5,[za,!0,Aa,!0,Ba,!1,Ca,!1,Da,null],null)}Ea;function p(b){return null!=b&&!1!==b}Fa;q;function Ha(b){return null==b}function Ia(b){return b instanceof Array}
function Ka(b){return null==b?!0:!1===b?!0:!1}function La(b,a){return b[ba(null==a?null:a)]?!0:b._?!0:!1}function Ma(b){return null==b?null:b.constructor}function Na(b,a){var c=Ma(a),c=p(p(c)?c.xc:c)?c.Wb:ba(a);return Error(["No protocol method ",b," defined for type ",c,": ",a].join(""))}function Oa(b){var a=b.Wb;return p(a)?a:""+r(b)}var Pa="undefined"!==typeof Symbol&&"function"===ba(Symbol)?Symbol.iterator:"@@iterator";
function Qa(b){for(var a=[],c=arguments.length,d=0;;)if(d<c)a.push(arguments[d]),d+=1;else break;switch(a.length){case 1:return Array(arguments[0]);case 2:return Array(arguments[1]);default:throw Error([r("Invalid arity: "),r(a.length)].join(""));}}function Ra(b){return Array(b)}function Sa(b){for(var a=b.length,c=Array(a),d=0;;)if(d<a)c[d]=b[d],d+=1;else break;return c}Ta;w;
var Ea=function Ea(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Ea.c(arguments[0]);case 2:return Ea.b(arguments[0],arguments[1]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};Ea.c=function(b){return Ea.b(null,b)};Ea.b=function(b,a){function c(a,b){a.push(b);return a}var d=[];return w.f?w.f(c,d,a):w.call(null,c,d,a)};Ea.A=2;function Va(){}
var Wa=function Wa(a){if(null!=a&&null!=a.T)return a.T(a);var c=Wa[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=Wa._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("ICounted.-count",a);},Xa=function Xa(a){if(null!=a&&null!=a.ha)return a.ha(a);var c=Xa[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=Xa._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IEmptyableCollection.-empty",a);};function Ya(){}
var Za=function Za(a,c){if(null!=a&&null!=a.S)return a.S(a,c);var d=Za[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=Za._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("ICollection.-conj",a);};function $a(){}
var y=function y(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return y.b(arguments[0],arguments[1]);case 3:return y.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};
y.b=function(b,a){if(null!=b&&null!=b.da)return b.da(b,a);var c=y[ba(null==b?null:b)];if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);c=y._;if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);throw Na("IIndexed.-nth",b);};y.f=function(b,a,c){if(null!=b&&null!=b.Pa)return b.Pa(b,a,c);var d=y[ba(null==b?null:b)];if(null!=d)return d.f?d.f(b,a,c):d.call(null,b,a,c);d=y._;if(null!=d)return d.f?d.f(b,a,c):d.call(null,b,a,c);throw Na("IIndexed.-nth",b);};y.A=3;function ab(){}
var bb=function bb(a){if(null!=a&&null!=a.ja)return a.ja(a);var c=bb[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=bb._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("ISeq.-first",a);},db=function db(a){if(null!=a&&null!=a.ra)return a.ra(a);var c=db[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=db._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("ISeq.-rest",a);};function eb(){}function fb(){}
var gb=function gb(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return gb.b(arguments[0],arguments[1]);case 3:return gb.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};
gb.b=function(b,a){if(null!=b&&null!=b.I)return b.I(b,a);var c=gb[ba(null==b?null:b)];if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);c=gb._;if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);throw Na("ILookup.-lookup",b);};gb.f=function(b,a,c){if(null!=b&&null!=b.H)return b.H(b,a,c);var d=gb[ba(null==b?null:b)];if(null!=d)return d.f?d.f(b,a,c):d.call(null,b,a,c);d=gb._;if(null!=d)return d.f?d.f(b,a,c):d.call(null,b,a,c);throw Na("ILookup.-lookup",b);};gb.A=3;
var hb=function hb(a,c){if(null!=a&&null!=a.Sb)return a.Sb(a,c);var d=hb[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=hb._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("IAssociative.-contains-key?",a);},ib=function ib(a,c,d){if(null!=a&&null!=a.U)return a.U(a,c,d);var e=ib[ba(null==a?null:a)];if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);e=ib._;if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);throw Na("IAssociative.-assoc",a);};function jb(){}
var kb=function kb(a,c){if(null!=a&&null!=a.Y)return a.Y(a,c);var d=kb[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=kb._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("IMap.-dissoc",a);};function lb(){}
var mb=function mb(a){if(null!=a&&null!=a.sc)return a.sc(a);var c=mb[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=mb._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IMapEntry.-key",a);},nb=function nb(a){if(null!=a&&null!=a.tc)return a.tc(a);var c=nb[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=nb._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IMapEntry.-val",a);};function ob(){}
var qb=function qb(a,c){if(null!=a&&null!=a.$c)return a.$c(a,c);var d=qb[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=qb._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("ISet.-disjoin",a);},sb=function sb(a){if(null!=a&&null!=a.Ib)return a.Ib(a);var c=sb[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=sb._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IStack.-peek",a);},tb=function tb(a){if(null!=a&&null!=a.Jb)return a.Jb(a);var c=tb[ba(null==
a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=tb._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IStack.-pop",a);};function ub(){}var xb=function xb(a,c,d){if(null!=a&&null!=a.Vb)return a.Vb(a,c,d);var e=xb[ba(null==a?null:a)];if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);e=xb._;if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);throw Na("IVector.-assoc-n",a);};function zb(){}
var Ab=function Ab(a){if(null!=a&&null!=a.fc)return a.fc(a);var c=Ab[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=Ab._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IDeref.-deref",a);};function Bb(){}var Cb=function Cb(a){if(null!=a&&null!=a.O)return a.O(a);var c=Cb[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=Cb._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IMeta.-meta",a);};function Db(){}
var Eb=function Eb(a,c){if(null!=a&&null!=a.P)return a.P(a,c);var d=Eb[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=Eb._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("IWithMeta.-with-meta",a);};function Fb(){}
var Gb=function Gb(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Gb.b(arguments[0],arguments[1]);case 3:return Gb.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};
Gb.b=function(b,a){if(null!=b&&null!=b.oa)return b.oa(b,a);var c=Gb[ba(null==b?null:b)];if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);c=Gb._;if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);throw Na("IReduce.-reduce",b);};Gb.f=function(b,a,c){if(null!=b&&null!=b.pa)return b.pa(b,a,c);var d=Gb[ba(null==b?null:b)];if(null!=d)return d.f?d.f(b,a,c):d.call(null,b,a,c);d=Gb._;if(null!=d)return d.f?d.f(b,a,c):d.call(null,b,a,c);throw Na("IReduce.-reduce",b);};Gb.A=3;
var Hb=function Hb(a,c,d){if(null!=a&&null!=a.hc)return a.hc(a,c,d);var e=Hb[ba(null==a?null:a)];if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);e=Hb._;if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);throw Na("IKVReduce.-kv-reduce",a);},Ib=function Ib(a,c){if(null!=a&&null!=a.B)return a.B(a,c);var d=Ib[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=Ib._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("IEquiv.-equiv",a);},Jb=function Jb(a){if(null!=a&&null!=
a.M)return a.M(a);var c=Jb[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=Jb._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IHash.-hash",a);};function Kb(){}var Lb=function Lb(a){if(null!=a&&null!=a.N)return a.N(a);var c=Lb[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=Lb._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("ISeqable.-seq",a);};function Mb(){}function Nb(){}function Ob(){}function Pb(){}
var Qb=function Qb(a){if(null!=a&&null!=a.Bb)return a.Bb(a);var c=Qb[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=Qb._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IReversible.-rseq",a);},Rb=function Rb(a,c){if(null!=a&&null!=a.Gd)return a.Gd(0,c);var d=Rb[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=Rb._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("IWriter.-write",a);},Sb=function Sb(a,c,d){if(null!=a&&null!=a.J)return a.J(a,c,d);
var e=Sb[ba(null==a?null:a)];if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);e=Sb._;if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);throw Na("IPrintWithWriter.-pr-writer",a);},Tb=function Tb(a,c,d){if(null!=a&&null!=a.Fd)return a.Fd(0,c,d);var e=Tb[ba(null==a?null:a)];if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);e=Tb._;if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);throw Na("IWatchable.-notify-watches",a);},Ub=function Ub(a,c,d){if(null!=a&&null!=a.Ed)return a.Ed(0,c,d);var e=
Ub[ba(null==a?null:a)];if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);e=Ub._;if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);throw Na("IWatchable.-add-watch",a);},Vb=function Vb(a){if(null!=a&&null!=a.gc)return a.gc(a);var c=Vb[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=Vb._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IEditableCollection.-as-transient",a);},Wb=function Wb(a,c){if(null!=a&&null!=a.Ub)return a.Ub(a,c);var d=Wb[ba(null==a?null:a)];if(null!=d)return d.b?
d.b(a,c):d.call(null,a,c);d=Wb._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("ITransientCollection.-conj!",a);},Xb=function Xb(a){if(null!=a&&null!=a.ic)return a.ic(a);var c=Xb[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=Xb._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("ITransientCollection.-persistent!",a);},Zb=function Zb(a,c,d){if(null!=a&&null!=a.wc)return a.wc(a,c,d);var e=Zb[ba(null==a?null:a)];if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);e=
Zb._;if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);throw Na("ITransientAssociative.-assoc!",a);},$b=function $b(a,c,d){if(null!=a&&null!=a.Cd)return a.Cd(0,c,d);var e=$b[ba(null==a?null:a)];if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);e=$b._;if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);throw Na("ITransientVector.-assoc-n!",a);};function ac(){}
var bc=function bc(a,c){if(null!=a&&null!=a.Tb)return a.Tb(a,c);var d=bc[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=bc._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("IComparable.-compare",a);},cc=function cc(a){if(null!=a&&null!=a.zd)return a.zd();var c=cc[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=cc._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IChunk.-drop-first",a);},dc=function dc(a){if(null!=a&&null!=a.Mc)return a.Mc(a);
var c=dc[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=dc._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IChunkedSeq.-chunked-first",a);},ec=function ec(a){if(null!=a&&null!=a.Nc)return a.Nc(a);var c=ec[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=ec._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IChunkedSeq.-chunked-rest",a);},fc=function fc(a){if(null!=a&&null!=a.Lc)return a.Lc(a);var c=fc[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):
c.call(null,a);c=fc._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IChunkedNext.-chunked-next",a);},hc=function hc(a){if(null!=a&&null!=a.uc)return a.uc(a);var c=hc[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=hc._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("INamed.-name",a);},ic=function ic(a){if(null!=a&&null!=a.vc)return a.vc(a);var c=ic[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=ic._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("INamed.-namespace",
a);},jc=function jc(a,c){if(null!=a&&null!=a.Zd)return a.Zd(a,c);var d=jc[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=jc._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("IReset.-reset!",a);},kc=function kc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return kc.b(arguments[0],arguments[1]);case 3:return kc.f(arguments[0],arguments[1],arguments[2]);case 4:return kc.w(arguments[0],arguments[1],arguments[2],
arguments[3]);case 5:return kc.R(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};kc.b=function(b,a){if(null!=b&&null!=b.ae)return b.ae(b,a);var c=kc[ba(null==b?null:b)];if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);c=kc._;if(null!=c)return c.b?c.b(b,a):c.call(null,b,a);throw Na("ISwap.-swap!",b);};
kc.f=function(b,a,c){if(null!=b&&null!=b.be)return b.be(b,a,c);var d=kc[ba(null==b?null:b)];if(null!=d)return d.f?d.f(b,a,c):d.call(null,b,a,c);d=kc._;if(null!=d)return d.f?d.f(b,a,c):d.call(null,b,a,c);throw Na("ISwap.-swap!",b);};kc.w=function(b,a,c,d){if(null!=b&&null!=b.ce)return b.ce(b,a,c,d);var e=kc[ba(null==b?null:b)];if(null!=e)return e.w?e.w(b,a,c,d):e.call(null,b,a,c,d);e=kc._;if(null!=e)return e.w?e.w(b,a,c,d):e.call(null,b,a,c,d);throw Na("ISwap.-swap!",b);};
kc.R=function(b,a,c,d,e){if(null!=b&&null!=b.de)return b.de(b,a,c,d,e);var g=kc[ba(null==b?null:b)];if(null!=g)return g.R?g.R(b,a,c,d,e):g.call(null,b,a,c,d,e);g=kc._;if(null!=g)return g.R?g.R(b,a,c,d,e):g.call(null,b,a,c,d,e);throw Na("ISwap.-swap!",b);};kc.A=5;
var lc=function lc(a,c){if(null!=a&&null!=a.Dd)return a.Dd(0,c);var d=lc[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=lc._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("IVolatile.-vreset!",a);},mc=function mc(a){if(null!=a&&null!=a.V)return a.V(a);var c=mc[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=mc._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IIterable.-iterator",a);};function nc(b){this.re=b;this.m=1073741824;this.F=0}
nc.prototype.Gd=function(b,a){return this.re.append(a)};function oc(b){var a=new ka;b.J(null,new nc(a),ya());return""+r(a)}var pc="undefined"!==typeof Math.imul&&0!==Math.imul(4294967295,5)?function(b,a){return Math.imul(b,a)}:function(b,a){var c=b&65535,d=a&65535;return c*d+((b>>>16&65535)*d+c*(a>>>16&65535)<<16>>>0)|0};function rc(b){b=pc(b|0,-862048943);return pc(b<<15|b>>>-15,461845907)}function sc(b,a){var c=(b|0)^(a|0);return pc(c<<13|c>>>-13,5)+-430675100|0}
function tc(b,a){var c=(b|0)^a,c=pc(c^c>>>16,-2048144789),c=pc(c^c>>>13,-1028477387);return c^c>>>16}function uc(b){var a;a:{a=1;for(var c=0;;)if(a<b.length){var d=a+2,c=sc(c,rc(b.charCodeAt(a-1)|b.charCodeAt(a)<<16));a=d}else{a=c;break a}}a=1===(b.length&1)?a^rc(b.charCodeAt(b.length-1)):a;return tc(a,pc(2,b.length))}vc;z;B;wc;var xc={},yc=0;
function zc(b){if(null!=b){var a=b.length;if(0<a)for(var c=0,d=0;;)if(c<a)var e=c+1,d=pc(31,d)+b.charCodeAt(c),c=e;else return d;else return 0}else return 0}function Ac(b){255<yc&&(xc={},yc=0);var a=xc[b];"number"!==typeof a&&(a=zc(b),xc[b]=a,yc+=1);return b=a}
function Bc(b){null!=b&&(b.m&4194304||b.Ad)?b=b.M(null):"number"===typeof b?b=Math.floor(b)%2147483647:!0===b?b=1:!1===b?b=0:"string"===typeof b?(b=Ac(b),0!==b&&(b=rc(b),b=sc(0,b),b=tc(b,4))):b=b instanceof Date?b.valueOf():null==b?0:Jb(b);return b}function Cc(b,a){return b^a+2654435769+(b<<6)+(b>>2)}function Fa(b,a){return a instanceof b}function Dc(b){return b instanceof z}
function Ec(b,a){if(b.vb===a.vb)return 0;var c=Ka(b.Oa);if(p(c?a.Oa:c))return-1;if(p(b.Oa)){if(Ka(a.Oa))return 1;c=na(b.Oa,a.Oa);return 0===c?na(b.name,a.name):c}return na(b.name,a.name)}C;function z(b,a,c,d,e){this.Oa=b;this.name=a;this.vb=c;this.ec=d;this.Ra=e;this.m=2154168321;this.F=4096}f=z.prototype;f.toString=function(){return this.vb};f.equiv=function(b){return this.B(null,b)};f.B=function(b,a){return a instanceof z?this.vb===a.vb:!1};
f.call=function(){function b(a,b,c){return C.f?C.f(b,this,c):C.call(null,b,this,c)}function a(a,b){return C.b?C.b(b,this):C.call(null,b,this)}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return a.call(this,0,e);case 3:return b.call(this,0,e,g)}throw Error("Invalid arity: "+arguments.length);};c.b=a;c.f=b;return c}();f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.c=function(b){return C.b?C.b(b,this):C.call(null,b,this)};
f.b=function(b,a){return C.f?C.f(b,this,a):C.call(null,b,this,a)};f.O=function(){return this.Ra};f.P=function(b,a){return new z(this.Oa,this.name,this.vb,this.ec,a)};f.M=function(){var b=this.ec;return null!=b?b:this.ec=b=Cc(uc(this.name),Ac(this.Oa))};f.uc=function(){return this.name};f.vc=function(){return this.Oa};f.J=function(b,a){return Rb(a,this.vb)};
var Fc=function Fc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Fc.c(arguments[0]);case 2:return Fc.b(arguments[0],arguments[1]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};Fc.c=function(b){if(b instanceof z)return b;var a=b.indexOf("/");return-1===a?Fc.b(null,b):Fc.b(b.substring(0,a),b.substring(a+1,b.length))};Fc.b=function(b,a){var c=null!=b?[r(b),r("/"),r(a)].join(""):a;return new z(b,a,c,null,null)};
Fc.A=2;E;Gc;Hc;function F(b){if(null==b)return null;if(null!=b&&(b.m&8388608||b.Pc))return b.N(null);if(Ia(b)||"string"===typeof b)return 0===b.length?null:new Hc(b,0);if(La(Kb,b))return Lb(b);throw Error([r(b),r(" is not ISeqable")].join(""));}function G(b){if(null==b)return null;if(null!=b&&(b.m&64||b.Ua))return b.ja(null);b=F(b);return null==b?null:bb(b)}function Ic(b){return null!=b?null!=b&&(b.m&64||b.Ua)?b.ra(null):(b=F(b))?db(b):Jc:Jc}
function H(b){return null==b?null:null!=b&&(b.m&128||b.Oc)?b.wa(null):F(Ic(b))}var B=function B(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return B.c(arguments[0]);case 2:return B.b(arguments[0],arguments[1]);default:return B.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};B.c=function(){return!0};B.b=function(b,a){return null==b?null==a:b===a||Ib(b,a)};
B.h=function(b,a,c){for(;;)if(B.b(b,a))if(H(c))b=a,a=G(c),c=H(c);else return B.b(a,G(c));else return!1};B.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return B.h(a,b,c)};B.A=2;function Kc(b){this.aa=b}Kc.prototype.next=function(){if(null!=this.aa){var b=G(this.aa);this.aa=H(this.aa);return{value:b,done:!1}}return{value:null,done:!0}};function Mc(b){return new Kc(F(b))}Nc;function Oc(b,a,c){this.value=b;this.lc=a;this.Uc=c;this.m=8388672;this.F=0}Oc.prototype.N=function(){return this};
Oc.prototype.ja=function(){return this.value};Oc.prototype.ra=function(){null==this.Uc&&(this.Uc=Nc.c?Nc.c(this.lc):Nc.call(null,this.lc));return this.Uc};function Nc(b){var a=b.next();return p(a.done)?Jc:new Oc(a.value,b,null)}function Pc(b,a){var c=rc(b),c=sc(0,c);return tc(c,a)}function Qc(b){var a=0,c=1;for(b=F(b);;)if(null!=b)a+=1,c=pc(31,c)+Bc(G(b))|0,b=H(b);else return Pc(c,a)}var Rc=Pc(1,0);function Sc(b){var a=0,c=0;for(b=F(b);;)if(null!=b)a+=1,c=c+Bc(G(b))|0,b=H(b);else return Pc(c,a)}
var Tc=Pc(0,0);Uc;vc;Vc;Va["null"]=!0;Wa["null"]=function(){return 0};Date.prototype.B=function(b,a){return a instanceof Date&&this.valueOf()===a.valueOf()};Date.prototype.qc=!0;Date.prototype.Tb=function(b,a){if(a instanceof Date)return na(this.valueOf(),a.valueOf());throw Error([r("Cannot compare "),r(this),r(" to "),r(a)].join(""));};Ib.number=function(b,a){return b===a};Wc;Bb["function"]=!0;Cb["function"]=function(){return null};Jb._=function(b){return b[ca]||(b[ca]=++da)};
function Xc(b){return b+1}I;function Yc(b){this.L=b;this.m=32768;this.F=0}Yc.prototype.fc=function(){return this.L};function Zc(b){return new Yc(b)}function $c(b){return b instanceof Yc}function I(b){return Ab(b)}function ad(b,a){var c=Wa(b);if(0===c)return a.C?a.C():a.call(null);for(var d=y.b(b,0),e=1;;)if(e<c){var g=y.b(b,e),d=a.b?a.b(d,g):a.call(null,d,g);if($c(d))return Ab(d);e+=1}else return d}
function bd(b,a,c){var d=Wa(b),e=c;for(c=0;;)if(c<d){var g=y.b(b,c),e=a.b?a.b(e,g):a.call(null,e,g);if($c(e))return Ab(e);c+=1}else return e}function cd(b,a){var c=b.length;if(0===b.length)return a.C?a.C():a.call(null);for(var d=b[0],e=1;;)if(e<c){var g=b[e],d=a.b?a.b(d,g):a.call(null,d,g);if($c(d))return Ab(d);e+=1}else return d}function dd(b,a,c){var d=b.length,e=c;for(c=0;;)if(c<d){var g=b[c],e=a.b?a.b(e,g):a.call(null,e,g);if($c(e))return Ab(e);c+=1}else return e}
function ed(b,a,c,d){for(var e=b.length;;)if(d<e){var g=b[d];c=a.b?a.b(c,g):a.call(null,c,g);if($c(c))return Ab(c);d+=1}else return c}fd;gd;hd;id;function jd(b){return null!=b?b.m&2||b.Xc?!0:b.m?!1:La(Va,b):La(Va,b)}function kd(b){return null!=b?b.m&16||b.Bd?!0:b.m?!1:La($a,b):La($a,b)}function ld(b,a){this.l=b;this.G=a}ld.prototype.ta=function(){return this.G<this.l.length};ld.prototype.next=function(){var b=this.l[this.G];this.G+=1;return b};
function Hc(b,a){this.l=b;this.G=a;this.m=166199550;this.F=8192}f=Hc.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.da=function(b,a){var c=a+this.G;return c<this.l.length?this.l[c]:null};f.Pa=function(b,a,c){b=a+this.G;return b<this.l.length?this.l[b]:c};f.V=function(){return new ld(this.l,this.G)};f.wa=function(){return this.G+1<this.l.length?new Hc(this.l,this.G+1):null};f.T=function(){var b=this.l.length-this.G;return 0>b?0:b};
f.Bb=function(){var b=Wa(this);return 0<b?new hd(this,b-1,null):null};f.M=function(){return Qc(this)};f.B=function(b,a){return Vc.b?Vc.b(this,a):Vc.call(null,this,a)};f.ha=function(){return Jc};f.oa=function(b,a){return ed(this.l,a,this.l[this.G],this.G+1)};f.pa=function(b,a,c){return ed(this.l,a,c,this.G)};f.ja=function(){return this.l[this.G]};f.ra=function(){return this.G+1<this.l.length?new Hc(this.l,this.G+1):Jc};f.N=function(){return this.G<this.l.length?this:null};
f.S=function(b,a){return gd.b?gd.b(a,this):gd.call(null,a,this)};Hc.prototype[Pa]=function(){return Mc(this)};var Gc=function Gc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Gc.c(arguments[0]);case 2:return Gc.b(arguments[0],arguments[1]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};Gc.c=function(b){return Gc.b(b,0)};Gc.b=function(b,a){return a<b.length?new Hc(b,a):null};Gc.A=2;
var E=function E(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return E.c(arguments[0]);case 2:return E.b(arguments[0],arguments[1]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};E.c=function(b){return Gc.b(b,0)};E.b=function(b,a){return Gc.b(b,a)};E.A=2;Wc;md;function hd(b,a,c){this.Kc=b;this.G=a;this.D=c;this.m=32374990;this.F=8192}f=hd.prototype;f.toString=function(){return oc(this)};
f.equiv=function(b){return this.B(null,b)};f.O=function(){return this.D};f.wa=function(){return 0<this.G?new hd(this.Kc,this.G-1,null):null};f.T=function(){return this.G+1};f.M=function(){return Qc(this)};f.B=function(b,a){return Vc.b?Vc.b(this,a):Vc.call(null,this,a)};f.ha=function(){var b=Jc,a=this.D;return Wc.b?Wc.b(b,a):Wc.call(null,b,a)};f.oa=function(b,a){return md.b?md.b(a,this):md.call(null,a,this)};f.pa=function(b,a,c){return md.f?md.f(a,c,this):md.call(null,a,c,this)};
f.ja=function(){return y.b(this.Kc,this.G)};f.ra=function(){return 0<this.G?new hd(this.Kc,this.G-1,null):Jc};f.N=function(){return this};f.P=function(b,a){return new hd(this.Kc,this.G,a)};f.S=function(b,a){return gd.b?gd.b(a,this):gd.call(null,a,this)};hd.prototype[Pa]=function(){return Mc(this)};function nd(b){return G(H(b))}function od(b){return G(G(b))}function pd(b){for(;;){var a=H(b);if(null!=a)b=a;else return G(b)}}Ib._=function(b,a){return b===a};
var qd=function qd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return qd.C();case 1:return qd.c(arguments[0]);case 2:return qd.b(arguments[0],arguments[1]);default:return qd.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};qd.C=function(){return rd};qd.c=function(b){return b};qd.b=function(b,a){return null!=b?Za(b,a):Za(Jc,a)};qd.h=function(b,a,c){for(;;)if(p(c))b=qd.b(b,a),a=G(c),c=H(c);else return qd.b(b,a)};
qd.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return qd.h(a,b,c)};qd.A=2;function sd(b){return null==b?null:Xa(b)}function L(b){if(null!=b)if(null!=b&&(b.m&2||b.Xc))b=b.T(null);else if(Ia(b))b=b.length;else if("string"===typeof b)b=b.length;else if(null!=b&&(b.m&8388608||b.Pc))a:{b=F(b);for(var a=0;;){if(jd(b)){b=a+Wa(b);break a}b=H(b);a+=1}}else b=Wa(b);else b=0;return b}
function td(b,a){for(var c=null;;){if(null==b)return c;if(0===a)return F(b)?G(b):c;if(kd(b))return y.f(b,a,c);if(F(b)){var d=H(b),e=a-1;b=d;a=e}else return c}}
function ud(b,a){if("number"!==typeof a)throw Error("index argument to nth must be a number");if(null==b)return b;if(null!=b&&(b.m&16||b.Bd))return b.da(null,a);if(Ia(b))return a<b.length?b[a]:null;if("string"===typeof b)return a<b.length?b.charAt(a):null;if(null!=b&&(b.m&64||b.Ua)){var c;a:{c=b;for(var d=a;;){if(null==c)throw Error("Index out of bounds");if(0===d){if(F(c)){c=G(c);break a}throw Error("Index out of bounds");}if(kd(c)){c=y.b(c,d);break a}if(F(c))c=H(c),--d;else throw Error("Index out of bounds");
}}return c}if(La($a,b))return y.b(b,a);throw Error([r("nth not supported on this type "),r(Oa(Ma(b)))].join(""));}
function M(b,a){if("number"!==typeof a)throw Error("index argument to nth must be a number.");if(null==b)return null;if(null!=b&&(b.m&16||b.Bd))return b.Pa(null,a,null);if(Ia(b))return a<b.length?b[a]:null;if("string"===typeof b)return a<b.length?b.charAt(a):null;if(null!=b&&(b.m&64||b.Ua))return td(b,a);if(La($a,b))return y.b(b,a);throw Error([r("nth not supported on this type "),r(Oa(Ma(b)))].join(""));}
var C=function C(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return C.b(arguments[0],arguments[1]);case 3:return C.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};C.b=function(b,a){return null==b?null:null!=b&&(b.m&256||b.Zc)?b.I(null,a):Ia(b)?a<b.length?b[a|0]:null:"string"===typeof b?a<b.length?b[a|0]:null:La(fb,b)?gb.b(b,a):null};
C.f=function(b,a,c){return null!=b?null!=b&&(b.m&256||b.Zc)?b.H(null,a,c):Ia(b)?a<b.length?b[a]:c:"string"===typeof b?a<b.length?b[a]:c:La(fb,b)?gb.f(b,a,c):c:c};C.A=3;vd;var N=function N(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return N.f(arguments[0],arguments[1],arguments[2]);default:return N.h(arguments[0],arguments[1],arguments[2],new Hc(c.slice(3),0))}};N.f=function(b,a,c){return null!=b?ib(b,a,c):wd([a],[c])};
N.h=function(b,a,c,d){for(;;)if(b=N.f(b,a,c),p(d))a=G(d),c=nd(d),d=H(H(d));else return b};N.K=function(b){var a=G(b),c=H(b);b=G(c);var d=H(c),c=G(d),d=H(d);return N.h(a,b,c,d)};N.A=3;var O=function O(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return O.c(arguments[0]);case 2:return O.b(arguments[0],arguments[1]);default:return O.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};O.c=function(b){return b};
O.b=function(b,a){return null==b?null:kb(b,a)};O.h=function(b,a,c){for(;;){if(null==b)return null;b=O.b(b,a);if(p(c))a=G(c),c=H(c);else return b}};O.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return O.h(a,b,c)};O.A=2;function xd(b,a){this.o=b;this.D=a;this.m=393217;this.F=0}f=xd.prototype;f.O=function(){return this.D};f.P=function(b,a){return new xd(this.o,a)};
f.call=function(){function b(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,P,xa){a=this;return Ta.rc?Ta.rc(a.o,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,P,xa):Ta.call(null,a.o,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,P,xa)}function a(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,P){a=this;return a.o.Ja?a.o.Ja(b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,P):a.o.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,P)}function c(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha){a=this;return a.o.Ia?a.o.Ia(b,c,d,e,g,h,k,m,n,t,u,v,x,
A,D,J,K,V,ha):a.o.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha)}function d(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V){a=this;return a.o.Ha?a.o.Ha(b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V):a.o.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V)}function e(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K){a=this;return a.o.Ga?a.o.Ga(b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K):a.o.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K)}function g(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J){a=this;return a.o.Fa?a.o.Fa(b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J):
a.o.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J)}function h(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D){a=this;return a.o.Ea?a.o.Ea(b,c,d,e,g,h,k,m,n,t,u,v,x,A,D):a.o.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D)}function k(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A){a=this;return a.o.Da?a.o.Da(b,c,d,e,g,h,k,m,n,t,u,v,x,A):a.o.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A)}function m(a,b,c,d,e,g,h,k,m,n,t,u,v,x){a=this;return a.o.Ca?a.o.Ca(b,c,d,e,g,h,k,m,n,t,u,v,x):a.o.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x)}function n(a,b,c,d,e,g,h,k,m,
n,t,u,v){a=this;return a.o.Ba?a.o.Ba(b,c,d,e,g,h,k,m,n,t,u,v):a.o.call(null,b,c,d,e,g,h,k,m,n,t,u,v)}function t(a,b,c,d,e,g,h,k,m,n,t,u){a=this;return a.o.Aa?a.o.Aa(b,c,d,e,g,h,k,m,n,t,u):a.o.call(null,b,c,d,e,g,h,k,m,n,t,u)}function u(a,b,c,d,e,g,h,k,m,n,t){a=this;return a.o.za?a.o.za(b,c,d,e,g,h,k,m,n,t):a.o.call(null,b,c,d,e,g,h,k,m,n,t)}function v(a,b,c,d,e,g,h,k,m,n){a=this;return a.o.La?a.o.La(b,c,d,e,g,h,k,m,n):a.o.call(null,b,c,d,e,g,h,k,m,n)}function x(a,b,c,d,e,g,h,k,m){a=this;return a.o.Ka?
a.o.Ka(b,c,d,e,g,h,k,m):a.o.call(null,b,c,d,e,g,h,k,m)}function A(a,b,c,d,e,g,h,k){a=this;return a.o.qa?a.o.qa(b,c,d,e,g,h,k):a.o.call(null,b,c,d,e,g,h,k)}function D(a,b,c,d,e,g,h){a=this;return a.o.ca?a.o.ca(b,c,d,e,g,h):a.o.call(null,b,c,d,e,g,h)}function J(a,b,c,d,e,g){a=this;return a.o.R?a.o.R(b,c,d,e,g):a.o.call(null,b,c,d,e,g)}function K(a,b,c,d,e){a=this;return a.o.w?a.o.w(b,c,d,e):a.o.call(null,b,c,d,e)}function V(a,b,c,d){a=this;return a.o.f?a.o.f(b,c,d):a.o.call(null,b,c,d)}function ha(a,
b,c){a=this;return a.o.b?a.o.b(b,c):a.o.call(null,b,c)}function xa(a,b){a=this;return a.o.c?a.o.c(b):a.o.call(null,b)}function Ua(a){a=this;return a.o.C?a.o.C():a.o.call(null)}var P=null,P=function(rb,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc,P,Gd,ne,nf,Jg,nj,di){switch(arguments.length){case 1:return Ua.call(this,rb);case 2:return xa.call(this,rb,pa);case 3:return ha.call(this,rb,pa,wa);case 4:return V.call(this,rb,pa,wa,ma);case 5:return K.call(this,rb,pa,wa,ma,Ga);case 6:return J.call(this,rb,
pa,wa,ma,Ga,Ja);case 7:return D.call(this,rb,pa,wa,ma,Ga,Ja,cb);case 8:return A.call(this,rb,pa,wa,ma,Ga,Ja,cb,pb);case 9:return x.call(this,rb,pa,wa,ma,Ga,Ja,cb,pb,yb);case 10:return v.call(this,rb,pa,wa,ma,Ga,Ja,cb,pb,yb,vb);case 11:return u.call(this,rb,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb);case 12:return t.call(this,rb,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb);case 13:return n.call(this,rb,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc);case 14:return m.call(this,rb,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc);case 15:return k.call(this,
rb,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc);case 16:return h.call(this,rb,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc,P);case 17:return g.call(this,rb,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc,P,Gd);case 18:return e.call(this,rb,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc,P,Gd,ne);case 19:return d.call(this,rb,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc,P,Gd,ne,nf);case 20:return c.call(this,rb,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc,P,Gd,ne,nf,Jg);case 21:return a.call(this,rb,pa,wa,ma,Ga,Ja,cb,pb,
yb,vb,wb,Yb,gc,qc,Lc,P,Gd,ne,nf,Jg,nj);case 22:return b.call(this,rb,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc,P,Gd,ne,nf,Jg,nj,di)}throw Error("Invalid arity: "+arguments.length);};P.c=Ua;P.b=xa;P.f=ha;P.w=V;P.R=K;P.ca=J;P.qa=D;P.Ka=A;P.La=x;P.za=v;P.Aa=u;P.Ba=t;P.Ca=n;P.Da=m;P.Ea=k;P.Fa=h;P.Ga=g;P.Ha=e;P.Ia=d;P.Ja=c;P.Yc=a;P.rc=b;return P}();f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.C=function(){return this.o.C?this.o.C():this.o.call(null)};
f.c=function(b){return this.o.c?this.o.c(b):this.o.call(null,b)};f.b=function(b,a){return this.o.b?this.o.b(b,a):this.o.call(null,b,a)};f.f=function(b,a,c){return this.o.f?this.o.f(b,a,c):this.o.call(null,b,a,c)};f.w=function(b,a,c,d){return this.o.w?this.o.w(b,a,c,d):this.o.call(null,b,a,c,d)};f.R=function(b,a,c,d,e){return this.o.R?this.o.R(b,a,c,d,e):this.o.call(null,b,a,c,d,e)};f.ca=function(b,a,c,d,e,g){return this.o.ca?this.o.ca(b,a,c,d,e,g):this.o.call(null,b,a,c,d,e,g)};
f.qa=function(b,a,c,d,e,g,h){return this.o.qa?this.o.qa(b,a,c,d,e,g,h):this.o.call(null,b,a,c,d,e,g,h)};f.Ka=function(b,a,c,d,e,g,h,k){return this.o.Ka?this.o.Ka(b,a,c,d,e,g,h,k):this.o.call(null,b,a,c,d,e,g,h,k)};f.La=function(b,a,c,d,e,g,h,k,m){return this.o.La?this.o.La(b,a,c,d,e,g,h,k,m):this.o.call(null,b,a,c,d,e,g,h,k,m)};f.za=function(b,a,c,d,e,g,h,k,m,n){return this.o.za?this.o.za(b,a,c,d,e,g,h,k,m,n):this.o.call(null,b,a,c,d,e,g,h,k,m,n)};
f.Aa=function(b,a,c,d,e,g,h,k,m,n,t){return this.o.Aa?this.o.Aa(b,a,c,d,e,g,h,k,m,n,t):this.o.call(null,b,a,c,d,e,g,h,k,m,n,t)};f.Ba=function(b,a,c,d,e,g,h,k,m,n,t,u){return this.o.Ba?this.o.Ba(b,a,c,d,e,g,h,k,m,n,t,u):this.o.call(null,b,a,c,d,e,g,h,k,m,n,t,u)};f.Ca=function(b,a,c,d,e,g,h,k,m,n,t,u,v){return this.o.Ca?this.o.Ca(b,a,c,d,e,g,h,k,m,n,t,u,v):this.o.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v)};
f.Da=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x){return this.o.Da?this.o.Da(b,a,c,d,e,g,h,k,m,n,t,u,v,x):this.o.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x)};f.Ea=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A){return this.o.Ea?this.o.Ea(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A):this.o.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A)};f.Fa=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D){return this.o.Fa?this.o.Fa(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D):this.o.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D)};
f.Ga=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J){return this.o.Ga?this.o.Ga(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J):this.o.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J)};f.Ha=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K){return this.o.Ha?this.o.Ha(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K):this.o.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K)};
f.Ia=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V){return this.o.Ia?this.o.Ia(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V):this.o.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V)};f.Ja=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha){return this.o.Ja?this.o.Ja(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha):this.o.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha)};
f.Yc=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,xa){return Ta.rc?Ta.rc(this.o,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,xa):Ta.call(null,this.o,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,xa)};function Wc(b,a){return"function"==ba(b)?new xd(b,a):null==b?null:Eb(b,a)}function yd(b){var a=null!=b;return(a?null!=b?b.m&131072||b.Wd||(b.m?0:La(Bb,b)):La(Bb,b):a)?Cb(b):null}
var zd=function zd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return zd.c(arguments[0]);case 2:return zd.b(arguments[0],arguments[1]);default:return zd.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};zd.c=function(b){return b};zd.b=function(b,a){return null==b?null:qb(b,a)};zd.h=function(b,a,c){for(;;){if(null==b)return null;b=zd.b(b,a);if(p(c))a=G(c),c=H(c);else return b}};
zd.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return zd.h(a,b,c)};zd.A=2;function Ad(b){return null==b||Ka(F(b))}function Bd(b){return null==b?!1:null!=b?b.m&8||b.ue?!0:b.m?!1:La(Ya,b):La(Ya,b)}function Cd(b){return null==b?!1:null!=b?b.m&4096||b.ze?!0:b.m?!1:La(ob,b):La(ob,b)}function Dd(b){return null!=b?b.m&16777216||b.ye?!0:b.m?!1:La(Mb,b):La(Mb,b)}function Ed(b){return null==b?!1:null!=b?b.m&1024||b.Ud?!0:b.m?!1:La(jb,b):La(jb,b)}
function Fd(b){return null!=b?b.m&67108864||b.xe?!0:b.m?!1:La(Ob,b):La(Ob,b)}function Hd(b){return null!=b?b.m&16384||b.Ae?!0:b.m?!1:La(ub,b):La(ub,b)}Id;Jd;function Kd(b){return null!=b?b.F&512||b.te?!0:!1:!1}function Ld(b){var a=[];ja(b,function(a,b){return function(a,c){return b.push(c)}}(b,a));return a}function Md(b,a,c,d,e){for(;0!==e;)c[d]=b[a],d+=1,--e,a+=1}var Nd={};function Od(b){return null==b?!1:null!=b?b.m&64||b.Ua?!0:b.m?!1:La(ab,b):La(ab,b)}
function Pd(b){return null!=b?b.m&8388608||b.Pc?!0:b.m?!1:La(Kb,b):La(Kb,b)}function Qd(b){return null==b?!1:!1===b?!1:!0}function Rd(b,a){return C.f(b,a,Nd)===Nd?!1:!0}var Sd=function Sd(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Sd.c(arguments[0]);case 2:return Sd.b(arguments[0],arguments[1]);default:return Sd.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};Sd.c=function(){return!0};Sd.b=function(b,a){return!B.b(b,a)};
Sd.h=function(b,a,c){if(B.b(b,a))return!1;a:if(b=[b,a],a=b.length,a<=Td)for(var d=0,e=Vb(Q);;)if(d<a)var g=d+1,e=Zb(e,b[d],null),d=g;else{b=new Ud(null,Xb(e),null);break a}else for(d=0,e=Vb(Vd);;)if(d<a)g=d+1,e=Wb(e,b[d]),d=g;else{b=Xb(e);break a}for(a=c;;)if(d=G(a),c=H(a),p(a)){if(Rd(b,d))return!1;b=qd.b(b,d);a=c}else return!0};Sd.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return Sd.h(a,b,c)};Sd.A=2;
function wc(b,a){if(b===a)return 0;if(null==b)return-1;if(null==a)return 1;if("number"===typeof b){if("number"===typeof a)return na(b,a);throw Error([r("Cannot compare "),r(b),r(" to "),r(a)].join(""));}if(null!=b?b.F&2048||b.qc||(b.F?0:La(ac,b)):La(ac,b))return bc(b,a);if("string"!==typeof b&&!Ia(b)&&!0!==b&&!1!==b||Ma(b)!==Ma(a))throw Error([r("Cannot compare "),r(b),r(" to "),r(a)].join(""));return na(b,a)}
function Wd(b,a){var c=L(b),d=L(a);if(c<d)c=-1;else if(c>d)c=1;else if(0===c)c=0;else a:for(d=0;;){var e=wc(ud(b,d),ud(a,d));if(0===e&&d+1<c)d+=1;else{c=e;break a}}return c}function Xd(b){return B.b(b,wc)?wc:function(a,c){var d=b.b?b.b(a,c):b.call(null,a,c);return"number"===typeof d?d:p(d)?-1:p(b.b?b.b(c,a):b.call(null,c,a))?1:0}}Yd;function Zd(b,a){if(F(a)){var c=Yd.c?Yd.c(a):Yd.call(null,a),d=Xd(b);oa(c,d);return F(c)}return Jc}
var md=function md(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return md.b(arguments[0],arguments[1]);case 3:return md.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};md.b=function(b,a){var c=F(a);if(c){var d=G(c),c=H(c);return w.f?w.f(b,d,c):w.call(null,b,d,c)}return b.C?b.C():b.call(null)};
md.f=function(b,a,c){for(c=F(c);;)if(c){var d=G(c);a=b.b?b.b(a,d):b.call(null,a,d);if($c(a))return Ab(a);c=H(c)}else return a};md.A=3;$d;var w=function w(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return w.b(arguments[0],arguments[1]);case 3:return w.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};
w.b=function(b,a){return null!=a&&(a.m&524288||a.Yd)?a.oa(null,b):Ia(a)?cd(a,b):"string"===typeof a?cd(a,b):La(Fb,a)?Gb.b(a,b):md.b(b,a)};w.f=function(b,a,c){return null!=c&&(c.m&524288||c.Yd)?c.pa(null,b,a):Ia(c)?dd(c,b,a):"string"===typeof c?dd(c,b,a):La(Fb,c)?Gb.f(c,b,a):md.f(b,a,c)};w.A=3;function ae(b,a,c){return null!=c?Hb(c,b,a):a}function be(b){return b}function ce(b,a,c,d){b=b.c?b.c(a):b.call(null,a);c=w.f(b,c,d);return b.c?b.c(c):b.call(null,c)}
var de=function de(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return de.C();case 1:return de.c(arguments[0]);case 2:return de.b(arguments[0],arguments[1]);default:return de.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};de.C=function(){return 0};de.c=function(b){return b};de.b=function(b,a){return b+a};de.h=function(b,a,c){return w.f(de,b+a,c)};de.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return de.h(a,b,c)};de.A=2;
var ee=function ee(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ee.c(arguments[0]);case 2:return ee.b(arguments[0],arguments[1]);default:return ee.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};ee.c=function(b){return-b};ee.b=function(b,a){return b-a};ee.h=function(b,a,c){return w.f(ee,b-a,c)};ee.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return ee.h(a,b,c)};ee.A=2;
var fe=function fe(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return fe.C();case 1:return fe.c(arguments[0]);case 2:return fe.b(arguments[0],arguments[1]);default:return fe.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};fe.C=function(){return 1};fe.c=function(b){return b};fe.b=function(b,a){return b*a};fe.h=function(b,a,c){return w.f(fe,b*a,c)};fe.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return fe.h(a,b,c)};fe.A=2;qa.Ge;
var ge=function ge(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ge.c(arguments[0]);case 2:return ge.b(arguments[0],arguments[1]);default:return ge.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};ge.c=function(b){return 1/b};ge.b=function(b,a){return b/a};ge.h=function(b,a,c){return w.f(ge,b/a,c)};ge.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return ge.h(a,b,c)};ge.A=2;
var he=function he(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return he.c(arguments[0]);case 2:return he.b(arguments[0],arguments[1]);default:return he.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};he.c=function(){return!0};he.b=function(b,a){return b<a};he.h=function(b,a,c){for(;;)if(b<a)if(H(c))b=a,a=G(c),c=H(c);else return a<G(c);else return!1};he.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return he.h(a,b,c)};he.A=2;
var ie=function ie(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ie.c(arguments[0]);case 2:return ie.b(arguments[0],arguments[1]);default:return ie.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};ie.c=function(){return!0};ie.b=function(b,a){return b<=a};ie.h=function(b,a,c){for(;;)if(b<=a)if(H(c))b=a,a=G(c),c=H(c);else return a<=G(c);else return!1};ie.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return ie.h(a,b,c)};ie.A=2;
var je=function je(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return je.c(arguments[0]);case 2:return je.b(arguments[0],arguments[1]);default:return je.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};je.c=function(){return!0};je.b=function(b,a){return b>a};je.h=function(b,a,c){for(;;)if(b>a)if(H(c))b=a,a=G(c),c=H(c);else return a>G(c);else return!1};je.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return je.h(a,b,c)};je.A=2;
var ke=function ke(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ke.c(arguments[0]);case 2:return ke.b(arguments[0],arguments[1]);default:return ke.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};ke.c=function(){return!0};ke.b=function(b,a){return b>=a};ke.h=function(b,a,c){for(;;)if(b>=a)if(H(c))b=a,a=G(c),c=H(c);else return a>=G(c);else return!1};ke.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return ke.h(a,b,c)};ke.A=2;
function le(b){return b-1}var me=function me(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return me.c(arguments[0]);case 2:return me.b(arguments[0],arguments[1]);default:return me.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};me.c=function(b){return b};me.b=function(b,a){return b>a?b:a};me.h=function(b,a,c){return w.f(me,b>a?b:a,c)};me.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return me.h(a,b,c)};me.A=2;
var oe=function oe(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return oe.c(arguments[0]);case 2:return oe.b(arguments[0],arguments[1]);default:return oe.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};oe.c=function(b){return b};oe.b=function(b,a){return b<a?b:a};oe.h=function(b,a,c){return w.f(oe,b<a?b:a,c)};oe.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return oe.h(a,b,c)};oe.A=2;pe;
function qe(b){return 0<=b?Math.floor(b):Math.ceil(b)}function re(b){return b|0}function pe(b,a){return(b%a+a)%a}function se(b,a){return qe((b-b%a)/a)}function te(b){b-=b>>1&1431655765;b=(b&858993459)+(b>>2&858993459);return 16843009*(b+(b>>4)&252645135)>>24}
var ue=function ue(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ue.c(arguments[0]);case 2:return ue.b(arguments[0],arguments[1]);default:return ue.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};ue.c=function(){return!0};ue.b=function(b,a){return Ib(b,a)};ue.h=function(b,a,c){for(;;)if(b===a)if(H(c))b=a,a=G(c),c=H(c);else return a===G(c);else return!1};ue.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return ue.h(a,b,c)};
ue.A=2;function ve(b,a){for(var c=a,d=F(b);;)if(d&&0<c)--c,d=H(d);else return d}var r=function r(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return r.C();case 1:return r.c(arguments[0]);default:return r.h(arguments[0],new Hc(c.slice(1),0))}};r.C=function(){return""};r.c=function(b){return null==b?"":""+b};r.h=function(b,a){for(var c=new ka(""+r(b)),d=a;;)if(p(d))c=c.append(""+r(G(d))),d=H(d);else return c.toString()};
r.K=function(b){var a=G(b);b=H(b);return r.h(a,b)};r.A=1;var we=function we(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return we.b(arguments[0],arguments[1]);case 3:return we.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};we.b=function(b,a){return b.substring(a)};we.f=function(b,a,c){return b.substring(a,c)};we.A=3;R;xe;
function Vc(b,a){var c;if(Dd(a))if(jd(b)&&jd(a)&&L(b)!==L(a))c=!1;else a:{c=F(b);for(var d=F(a);;){if(null==c){c=null==d;break a}if(null!=d&&B.b(G(c),G(d)))c=H(c),d=H(d);else{c=!1;break a}}}else c=null;return Qd(c)}function fd(b){if(F(b)){var a=Bc(G(b));for(b=H(b);;){if(null==b)return a;a=Cc(a,Bc(G(b)));b=H(b)}}else return 0}ye;ze;function Ae(b){var a=0;for(b=F(b);;)if(b){var c=G(b),a=(a+(Bc(ye.c?ye.c(c):ye.call(null,c))^Bc(ze.c?ze.c(c):ze.call(null,c))))%4503599627370496;b=H(b)}else return a}xe;
Be;Ce;function id(b,a,c,d,e){this.D=b;this.first=a;this.Qa=c;this.count=d;this.j=e;this.m=65937646;this.F=8192}f=id.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.O=function(){return this.D};f.wa=function(){return 1===this.count?null:this.Qa};f.T=function(){return this.count};f.Ib=function(){return this.first};f.Jb=function(){return db(this)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Qc(this)};f.B=function(b,a){return Vc(this,a)};
f.ha=function(){return Eb(Jc,this.D)};f.oa=function(b,a){return md.b(a,this)};f.pa=function(b,a,c){return md.f(a,c,this)};f.ja=function(){return this.first};f.ra=function(){return 1===this.count?Jc:this.Qa};f.N=function(){return this};f.P=function(b,a){return new id(a,this.first,this.Qa,this.count,this.j)};f.S=function(b,a){return new id(this.D,a,this,this.count+1,null)};function De(b){return null!=b?b.m&33554432||b.we?!0:b.m?!1:La(Nb,b):La(Nb,b)}id.prototype[Pa]=function(){return Mc(this)};
function Ee(b){this.D=b;this.m=65937614;this.F=8192}f=Ee.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.O=function(){return this.D};f.wa=function(){return null};f.T=function(){return 0};f.Ib=function(){return null};f.Jb=function(){throw Error("Can't pop empty list");};f.M=function(){return Rc};f.B=function(b,a){return De(a)||Dd(a)?null==F(a):!1};f.ha=function(){return this};f.oa=function(b,a){return md.b(a,this)};
f.pa=function(b,a,c){return md.f(a,c,this)};f.ja=function(){return null};f.ra=function(){return Jc};f.N=function(){return null};f.P=function(b,a){return new Ee(a)};f.S=function(b,a){return new id(this.D,a,null,1,null)};var Jc=new Ee(null);Ee.prototype[Pa]=function(){return Mc(this)};function Fe(b){return(null!=b?b.m&134217728||b.$d||(b.m?0:La(Pb,b)):La(Pb,b))?Qb(b):w.f(qd,Jc,b)}
var vc=function vc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return vc.h(0<c.length?new Hc(c.slice(0),0):null)};vc.h=function(b){var a;if(b instanceof Hc&&0===b.G)a=b.l;else a:for(a=[];;)if(null!=b)a.push(b.ja(null)),b=b.wa(null);else break a;b=a.length;for(var c=Jc;;)if(0<b){var d=b-1,c=c.S(null,a[b-1]);b=d}else return c};vc.A=0;vc.K=function(b){return vc.h(F(b))};
function Ge(b,a,c,d){this.D=b;this.first=a;this.Qa=c;this.j=d;this.m=65929452;this.F=8192}f=Ge.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.O=function(){return this.D};f.wa=function(){return null==this.Qa?null:F(this.Qa)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Qc(this)};f.B=function(b,a){return Vc(this,a)};f.ha=function(){return Wc(Jc,this.D)};f.oa=function(b,a){return md.b(a,this)};f.pa=function(b,a,c){return md.f(a,c,this)};f.ja=function(){return this.first};
f.ra=function(){return null==this.Qa?Jc:this.Qa};f.N=function(){return this};f.P=function(b,a){return new Ge(a,this.first,this.Qa,this.j)};f.S=function(b,a){return new Ge(null,a,this,this.j)};Ge.prototype[Pa]=function(){return Mc(this)};function gd(b,a){var c=null==a;return(c?c:null!=a&&(a.m&64||a.Ua))?new Ge(null,b,a,null):new Ge(null,b,F(a),null)}
function He(b,a){if(b.W===a.W)return 0;var c=Ka(b.Oa);if(p(c?a.Oa:c))return-1;if(p(b.Oa)){if(Ka(a.Oa))return 1;c=na(b.Oa,a.Oa);return 0===c?na(b.name,a.name):c}return na(b.name,a.name)}function q(b,a,c,d){this.Oa=b;this.name=a;this.W=c;this.ec=d;this.m=2153775105;this.F=4096}f=q.prototype;f.toString=function(){return[r(":"),r(this.W)].join("")};f.equiv=function(b){return this.B(null,b)};f.B=function(b,a){return a instanceof q?this.W===a.W:!1};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return C.b(b,this);case 3:return C.f(b,this,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return C.b(b,this)};b.f=function(a,b,d){return C.f(b,this,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.c=function(b){return C.b(b,this)};f.b=function(b,a){return C.f(b,this,a)};
f.M=function(){var b=this.ec;return null!=b?b:this.ec=b=Cc(uc(this.name),Ac(this.Oa))+2654435769|0};f.uc=function(){return this.name};f.vc=function(){return this.Oa};f.J=function(b,a){return Rb(a,[r(":"),r(this.W)].join(""))};function S(b,a){return b===a?!0:b instanceof q&&a instanceof q?b.W===a.W:!1}function Ie(b){if(null!=b&&(b.F&4096||b.Xd))return b.vc(null);throw Error([r("Doesn't support namespace: "),r(b)].join(""));}
var Je=function Je(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Je.c(arguments[0]);case 2:return Je.b(arguments[0],arguments[1]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};Je.c=function(b){if(b instanceof q)return b;if(b instanceof z)return new q(Ie(b),xe.c?xe.c(b):xe.call(null,b),b.vb,null);if("string"===typeof b){var a=b.split("/");return 2===a.length?new q(a[0],a[1],b,null):new q(null,a[0],b,null)}return null};
Je.b=function(b,a){return new q(b,a,[r(p(b)?[r(b),r("/")].join(""):null),r(a)].join(""),null)};Je.A=2;function Ke(b,a,c,d){this.D=b;this.$=a;this.aa=c;this.j=d;this.m=32374988;this.F=0}f=Ke.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};function Le(b){null!=b.$&&(b.aa=b.$.C?b.$.C():b.$.call(null),b.$=null);return b.aa}f.O=function(){return this.D};f.wa=function(){Lb(this);return null==this.aa?null:H(this.aa)};
f.M=function(){var b=this.j;return null!=b?b:this.j=b=Qc(this)};f.B=function(b,a){return Vc(this,a)};f.ha=function(){return Wc(Jc,this.D)};f.oa=function(b,a){return md.b(a,this)};f.pa=function(b,a,c){return md.f(a,c,this)};f.ja=function(){Lb(this);return null==this.aa?null:G(this.aa)};f.ra=function(){Lb(this);return null!=this.aa?Ic(this.aa):Jc};f.N=function(){Le(this);if(null==this.aa)return null;for(var b=this.aa;;)if(b instanceof Ke)b=Le(b);else return this.aa=b,F(this.aa)};
f.P=function(b,a){return new Ke(a,this.$,this.aa,this.j)};f.S=function(b,a){return gd(a,this)};Ke.prototype[Pa]=function(){return Mc(this)};Me;function Ne(b,a){this.Wc=b;this.end=a;this.m=2;this.F=0}Ne.prototype.add=function(b){this.Wc[this.end]=b;return this.end+=1};Ne.prototype.Ab=function(){var b=new Me(this.Wc,0,this.end);this.Wc=null;return b};Ne.prototype.T=function(){return this.end};function Oe(b){return new Ne(Array(b),0)}
function Me(b,a,c){this.l=b;this.ya=a;this.end=c;this.m=524306;this.F=0}f=Me.prototype;f.T=function(){return this.end-this.ya};f.da=function(b,a){return this.l[this.ya+a]};f.Pa=function(b,a,c){return 0<=a&&a<this.end-this.ya?this.l[this.ya+a]:c};f.zd=function(){if(this.ya===this.end)throw Error("-drop-first of empty chunk");return new Me(this.l,this.ya+1,this.end)};f.oa=function(b,a){return ed(this.l,a,this.l[this.ya],this.ya+1)};f.pa=function(b,a,c){return ed(this.l,a,c,this.ya)};
function Id(b,a,c,d){this.Ab=b;this.tb=a;this.D=c;this.j=d;this.m=31850732;this.F=1536}f=Id.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.O=function(){return this.D};f.wa=function(){if(1<Wa(this.Ab))return new Id(cc(this.Ab),this.tb,this.D,null);var b=Lb(this.tb);return null==b?null:b};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Qc(this)};f.B=function(b,a){return Vc(this,a)};f.ha=function(){return Wc(Jc,this.D)};
f.ja=function(){return y.b(this.Ab,0)};f.ra=function(){return 1<Wa(this.Ab)?new Id(cc(this.Ab),this.tb,this.D,null):null==this.tb?Jc:this.tb};f.N=function(){return this};f.Mc=function(){return this.Ab};f.Nc=function(){return null==this.tb?Jc:this.tb};f.P=function(b,a){return new Id(this.Ab,this.tb,a,this.j)};f.S=function(b,a){return gd(a,this)};f.Lc=function(){return null==this.tb?null:this.tb};Id.prototype[Pa]=function(){return Mc(this)};
function Pe(b,a){return 0===Wa(b)?a:new Id(b,a,null,null)}function Qe(b,a){b.add(a)}function Re(b){return b.Ab()}function Be(b){return dc(b)}function Ce(b){return ec(b)}function Yd(b){for(var a=[];;)if(F(b))a.push(G(b)),b=H(b);else return a}function Se(b,a){if(jd(b))return L(b);for(var c=b,d=a,e=0;;)if(0<d&&F(c))c=H(c),--d,e+=1;else return e}
var Te=function Te(a){return null==a?null:null==H(a)?F(G(a)):gd(G(a),Te(H(a)))},T=function T(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return T.C();case 1:return T.c(arguments[0]);case 2:return T.b(arguments[0],arguments[1]);default:return T.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};T.C=function(){return new Ke(null,function(){return null},null,null)};T.c=function(b){return new Ke(null,function(){return b},null,null)};
T.b=function(b,a){return new Ke(null,function(){var c=F(b);return c?Kd(c)?Pe(dc(c),T.b(ec(c),a)):gd(G(c),T.b(Ic(c),a)):a},null,null)};T.h=function(b,a,c){return function e(a,b){return new Ke(null,function(){var c=F(a);return c?Kd(c)?Pe(dc(c),e(ec(c),b)):gd(G(c),e(Ic(c),b)):p(b)?e(G(b),H(b)):null},null,null)}(T.b(b,a),c)};T.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return T.h(a,b,c)};T.A=2;function Ue(b){return F(b)}function Ve(b){return Vb(b)}function We(b){return Xb(b)}
var Xe=function Xe(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Xe.C();case 1:return Xe.c(arguments[0]);case 2:return Xe.b(arguments[0],arguments[1]);default:return Xe.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};Xe.C=function(){return Vb(rd)};Xe.c=function(b){return b};Xe.b=function(b,a){return Wb(b,a)};Xe.h=function(b,a,c){for(;;)if(b=Wb(b,a),p(c))a=G(c),c=H(c);else return b};
Xe.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return Xe.h(a,b,c)};Xe.A=2;var Ye=function Ye(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Ye.f(arguments[0],arguments[1],arguments[2]);default:return Ye.h(arguments[0],arguments[1],arguments[2],new Hc(c.slice(3),0))}};Ye.f=function(b,a,c){return Zb(b,a,c)};Ye.h=function(b,a,c,d){for(;;)if(b=Zb(b,a,c),p(d))a=G(d),c=nd(d),d=H(H(d));else return b};
Ye.K=function(b){var a=G(b),c=H(b);b=G(c);var d=H(c),c=G(d),d=H(d);return Ye.h(a,b,c,d)};Ye.A=3;
function Ze(b,a,c){var d=F(c);if(0===a)return b.C?b.C():b.call(null);c=bb(d);var e=db(d);if(1===a)return b.c?b.c(c):b.c?b.c(c):b.call(null,c);var d=bb(e),g=db(e);if(2===a)return b.b?b.b(c,d):b.b?b.b(c,d):b.call(null,c,d);var e=bb(g),h=db(g);if(3===a)return b.f?b.f(c,d,e):b.f?b.f(c,d,e):b.call(null,c,d,e);var g=bb(h),k=db(h);if(4===a)return b.w?b.w(c,d,e,g):b.w?b.w(c,d,e,g):b.call(null,c,d,e,g);var h=bb(k),m=db(k);if(5===a)return b.R?b.R(c,d,e,g,h):b.R?b.R(c,d,e,g,h):b.call(null,c,d,e,g,h);var k=bb(m),
n=db(m);if(6===a)return b.ca?b.ca(c,d,e,g,h,k):b.ca?b.ca(c,d,e,g,h,k):b.call(null,c,d,e,g,h,k);var m=bb(n),t=db(n);if(7===a)return b.qa?b.qa(c,d,e,g,h,k,m):b.qa?b.qa(c,d,e,g,h,k,m):b.call(null,c,d,e,g,h,k,m);var n=bb(t),u=db(t);if(8===a)return b.Ka?b.Ka(c,d,e,g,h,k,m,n):b.Ka?b.Ka(c,d,e,g,h,k,m,n):b.call(null,c,d,e,g,h,k,m,n);var t=bb(u),v=db(u);if(9===a)return b.La?b.La(c,d,e,g,h,k,m,n,t):b.La?b.La(c,d,e,g,h,k,m,n,t):b.call(null,c,d,e,g,h,k,m,n,t);var u=bb(v),x=db(v);if(10===a)return b.za?b.za(c,
d,e,g,h,k,m,n,t,u):b.za?b.za(c,d,e,g,h,k,m,n,t,u):b.call(null,c,d,e,g,h,k,m,n,t,u);var v=bb(x),A=db(x);if(11===a)return b.Aa?b.Aa(c,d,e,g,h,k,m,n,t,u,v):b.Aa?b.Aa(c,d,e,g,h,k,m,n,t,u,v):b.call(null,c,d,e,g,h,k,m,n,t,u,v);var x=bb(A),D=db(A);if(12===a)return b.Ba?b.Ba(c,d,e,g,h,k,m,n,t,u,v,x):b.Ba?b.Ba(c,d,e,g,h,k,m,n,t,u,v,x):b.call(null,c,d,e,g,h,k,m,n,t,u,v,x);var A=bb(D),J=db(D);if(13===a)return b.Ca?b.Ca(c,d,e,g,h,k,m,n,t,u,v,x,A):b.Ca?b.Ca(c,d,e,g,h,k,m,n,t,u,v,x,A):b.call(null,c,d,e,g,h,k,m,
n,t,u,v,x,A);var D=bb(J),K=db(J);if(14===a)return b.Da?b.Da(c,d,e,g,h,k,m,n,t,u,v,x,A,D):b.Da?b.Da(c,d,e,g,h,k,m,n,t,u,v,x,A,D):b.call(null,c,d,e,g,h,k,m,n,t,u,v,x,A,D);var J=bb(K),V=db(K);if(15===a)return b.Ea?b.Ea(c,d,e,g,h,k,m,n,t,u,v,x,A,D,J):b.Ea?b.Ea(c,d,e,g,h,k,m,n,t,u,v,x,A,D,J):b.call(null,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J);var K=bb(V),ha=db(V);if(16===a)return b.Fa?b.Fa(c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K):b.Fa?b.Fa(c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K):b.call(null,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K);var V=
bb(ha),xa=db(ha);if(17===a)return b.Ga?b.Ga(c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V):b.Ga?b.Ga(c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V):b.call(null,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V);var ha=bb(xa),Ua=db(xa);if(18===a)return b.Ha?b.Ha(c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha):b.Ha?b.Ha(c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha):b.call(null,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha);xa=bb(Ua);Ua=db(Ua);if(19===a)return b.Ia?b.Ia(c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,xa):b.Ia?b.Ia(c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,xa):b.call(null,
c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,xa);var P=bb(Ua);db(Ua);if(20===a)return b.Ja?b.Ja(c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,xa,P):b.Ja?b.Ja(c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,xa,P):b.call(null,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,xa,P);throw Error("Only up to 20 arguments supported on functions");}
var Ta=function Ta(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ta.b(arguments[0],arguments[1]);case 3:return Ta.f(arguments[0],arguments[1],arguments[2]);case 4:return Ta.w(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Ta.R(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:return Ta.h(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],new Hc(c.slice(5),0))}};
Ta.b=function(b,a){var c=b.A;if(b.K){var d=Se(a,c+1);return d<=c?Ze(b,d,a):b.K(a)}return b.apply(b,Yd(a))};Ta.f=function(b,a,c){a=gd(a,c);c=b.A;if(b.K){var d=Se(a,c+1);return d<=c?Ze(b,d,a):b.K(a)}return b.apply(b,Yd(a))};Ta.w=function(b,a,c,d){a=gd(a,gd(c,d));c=b.A;return b.K?(d=Se(a,c+1),d<=c?Ze(b,d,a):b.K(a)):b.apply(b,Yd(a))};Ta.R=function(b,a,c,d,e){a=gd(a,gd(c,gd(d,e)));c=b.A;return b.K?(d=Se(a,c+1),d<=c?Ze(b,d,a):b.K(a)):b.apply(b,Yd(a))};
Ta.h=function(b,a,c,d,e,g){a=gd(a,gd(c,gd(d,gd(e,Te(g)))));c=b.A;return b.K?(d=Se(a,c+1),d<=c?Ze(b,d,a):b.K(a)):b.apply(b,Yd(a))};Ta.K=function(b){var a=G(b),c=H(b);b=G(c);var d=H(c),c=G(d),e=H(d),d=G(e),g=H(e),e=G(g),g=H(g);return Ta.h(a,b,c,d,e,g)};Ta.A=5;
var $e=function $e(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return $e.c(arguments[0]);case 2:return $e.b(arguments[0],arguments[1]);default:return $e.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};$e.c=function(){return!1};$e.b=function(b,a){return!B.b(b,a)};$e.h=function(b,a,c){return Ka(Ta.w(B,b,a,c))};$e.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return $e.h(a,b,c)};$e.A=2;function af(b){return F(b)?b:null}
var bf=function bf(){"undefined"===typeof ra&&(ra=function(a,c){this.me=a;this.le=c;this.m=393216;this.F=0},ra.prototype.P=function(a,c){return new ra(this.me,c)},ra.prototype.O=function(){return this.le},ra.prototype.ta=function(){return!1},ra.prototype.next=function(){return Error("No such element")},ra.prototype.remove=function(){return Error("Unsupported operation")},ra.pd=function(){return new U(null,2,5,W,[Wc(cf,new l(null,1,[df,vc(ef,vc(rd))],null)),qa.Fe],null)},ra.xc=!0,ra.Wb="cljs.core/t_cljs$core20827",
ra.Qc=function(a,c){return Rb(c,"cljs.core/t_cljs$core20827")});return new ra(bf,Q)};ff;function ff(b,a,c,d){this.oc=b;this.first=a;this.Qa=c;this.D=d;this.m=31719628;this.F=0}f=ff.prototype;f.P=function(b,a){return new ff(this.oc,this.first,this.Qa,a)};f.S=function(b,a){return gd(a,Lb(this))};f.ha=function(){return Jc};f.B=function(b,a){return null!=Lb(this)?Vc(this,a):Dd(a)&&null==F(a)};f.M=function(){return Qc(this)};f.N=function(){null!=this.oc&&this.oc.step(this);return null==this.Qa?null:this};
f.ja=function(){null!=this.oc&&Lb(this);return null==this.Qa?null:this.first};f.ra=function(){null!=this.oc&&Lb(this);return null==this.Qa?Jc:this.Qa};f.wa=function(){null!=this.oc&&Lb(this);return null==this.Qa?null:Lb(this.Qa)};ff.prototype[Pa]=function(){return Mc(this)};function gf(b,a){for(;;){if(null==F(a))return!0;var c;c=G(a);c=b.c?b.c(c):b.call(null,c);if(p(c)){c=b;var d=H(a);b=c;a=d}else return!1}}
function hf(b,a){for(;;)if(F(a)){var c;c=G(a);c=b.c?b.c(c):b.call(null,c);if(p(c))return c;c=b;var d=H(a);b=c;a=d}else return null}function jf(b){if("number"===typeof b&&!isNaN(b)&&Infinity!==b&&parseFloat(b)===parseInt(b,10))return 0===(b&1);throw Error([r("Argument must be an integer: "),r(b)].join(""));}function kf(b){return!jf(b)}
function lf(b){return function(){function a(a,c){return Ka(b.b?b.b(a,c):b.call(null,a,c))}function c(a){return Ka(b.c?b.c(a):b.call(null,a))}function d(){return Ka(b.C?b.C():b.call(null))}var e=null,g=function(){function a(b,d,e){var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new Hc(h,0)}return c.call(this,b,d,g)}function c(a,d,e){return Ka(Ta.w(b,a,d,e))}a.A=2;a.K=function(a){var b=G(a);a=H(a);var d=G(a);a=Ic(a);return c(b,d,a)};a.h=
c;return a}(),e=function(b,e,m){switch(arguments.length){case 0:return d.call(this);case 1:return c.call(this,b);case 2:return a.call(this,b,e);default:var n=null;if(2<arguments.length){for(var n=0,t=Array(arguments.length-2);n<t.length;)t[n]=arguments[n+2],++n;n=new Hc(t,0)}return g.h(b,e,n)}throw Error("Invalid arity: "+arguments.length);};e.A=2;e.K=g.K;e.C=d;e.c=c;e.b=a;e.h=g.h;return e}()}
var mf=function mf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return mf.C();case 1:return mf.c(arguments[0]);case 2:return mf.b(arguments[0],arguments[1]);case 3:return mf.f(arguments[0],arguments[1],arguments[2]);default:return mf.h(arguments[0],arguments[1],arguments[2],new Hc(c.slice(3),0))}};mf.C=function(){return be};mf.c=function(b){return b};
mf.b=function(b,a){return function(){function c(c,d,e){c=a.f?a.f(c,d,e):a.call(null,c,d,e);return b.c?b.c(c):b.call(null,c)}function d(c,d){var e=a.b?a.b(c,d):a.call(null,c,d);return b.c?b.c(e):b.call(null,e)}function e(c){c=a.c?a.c(c):a.call(null,c);return b.c?b.c(c):b.call(null,c)}function g(){var c=a.C?a.C():a.call(null);return b.c?b.c(c):b.call(null,c)}var h=null,k=function(){function c(a,b,e,g){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+
3],++h;h=new Hc(k,0)}return d.call(this,a,b,e,h)}function d(c,e,g,h){c=Ta.R(a,c,e,g,h);return b.c?b.c(c):b.call(null,c)}c.A=3;c.K=function(a){var b=G(a);a=H(a);var c=G(a);a=H(a);var e=G(a);a=Ic(a);return d(b,c,e,a)};c.h=d;return c}(),h=function(a,b,h,u){switch(arguments.length){case 0:return g.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,h);default:var v=null;if(3<arguments.length){for(var v=0,x=Array(arguments.length-3);v<x.length;)x[v]=arguments[v+
3],++v;v=new Hc(x,0)}return k.h(a,b,h,v)}throw Error("Invalid arity: "+arguments.length);};h.A=3;h.K=k.K;h.C=g;h.c=e;h.b=d;h.f=c;h.h=k.h;return h}()};
mf.f=function(b,a,c){return function(){function d(d,e,g){d=c.f?c.f(d,e,g):c.call(null,d,e,g);d=a.c?a.c(d):a.call(null,d);return b.c?b.c(d):b.call(null,d)}function e(d,e){var g;g=c.b?c.b(d,e):c.call(null,d,e);g=a.c?a.c(g):a.call(null,g);return b.c?b.c(g):b.call(null,g)}function g(d){d=c.c?c.c(d):c.call(null,d);d=a.c?a.c(d):a.call(null,d);return b.c?b.c(d):b.call(null,d)}function h(){var d;d=c.C?c.C():c.call(null);d=a.c?a.c(d):a.call(null,d);return b.c?b.c(d):b.call(null,d)}var k=null,m=function(){function d(a,
b,c,g){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new Hc(k,0)}return e.call(this,a,b,c,h)}function e(d,g,h,k){d=Ta.R(c,d,g,h,k);d=a.c?a.c(d):a.call(null,d);return b.c?b.c(d):b.call(null,d)}d.A=3;d.K=function(a){var b=G(a);a=H(a);var c=G(a);a=H(a);var d=G(a);a=Ic(a);return e(b,c,d,a)};d.h=e;return d}(),k=function(a,b,c,k){switch(arguments.length){case 0:return h.call(this);case 1:return g.call(this,a);case 2:return e.call(this,a,
b);case 3:return d.call(this,a,b,c);default:var x=null;if(3<arguments.length){for(var x=0,A=Array(arguments.length-3);x<A.length;)A[x]=arguments[x+3],++x;x=new Hc(A,0)}return m.h(a,b,c,x)}throw Error("Invalid arity: "+arguments.length);};k.A=3;k.K=m.K;k.C=h;k.c=g;k.b=e;k.f=d;k.h=m.h;return k}()};
mf.h=function(b,a,c,d){return function(a){return function(){function b(a){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Hc(e,0)}return c.call(this,d)}function c(b){b=Ta.b(G(a),b);for(var d=H(a);;)if(d)b=G(d).call(null,b),d=H(d);else return b}b.A=0;b.K=function(a){a=F(a);return c(a)};b.h=c;return b}()}(Fe(gd(b,gd(a,gd(c,d)))))};mf.K=function(b){var a=G(b),c=H(b);b=G(c);var d=H(c),c=G(d),d=H(d);return mf.h(a,b,c,d)};mf.A=3;
function of(b,a){return function(){function c(c,d,e){return b.w?b.w(a,c,d,e):b.call(null,a,c,d,e)}function d(c,d){return b.f?b.f(a,c,d):b.call(null,a,c,d)}function e(c){return b.b?b.b(a,c):b.call(null,a,c)}function g(){return b.c?b.c(a):b.call(null,a)}var h=null,k=function(){function c(a,b,e,g){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new Hc(k,0)}return d.call(this,a,b,e,h)}function d(c,e,g,h){return Ta.h(b,a,c,e,g,E([h],0))}c.A=
3;c.K=function(a){var b=G(a);a=H(a);var c=G(a);a=H(a);var e=G(a);a=Ic(a);return d(b,c,e,a)};c.h=d;return c}(),h=function(a,b,h,u){switch(arguments.length){case 0:return g.call(this);case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,h);default:var v=null;if(3<arguments.length){for(var v=0,x=Array(arguments.length-3);v<x.length;)x[v]=arguments[v+3],++v;v=new Hc(x,0)}return k.h(a,b,h,v)}throw Error("Invalid arity: "+arguments.length);};h.A=3;h.K=k.K;h.C=g;h.c=
e;h.b=d;h.f=c;h.h=k.h;return h}()}
function pf(b,a){return function(){function c(c,d,e){c=null==c?a:c;return b.f?b.f(c,d,e):b.call(null,c,d,e)}function d(c,d){var e=null==c?a:c;return b.b?b.b(e,d):b.call(null,e,d)}function e(c){c=null==c?a:c;return b.c?b.c(c):b.call(null,c)}var g=null,h=function(){function c(a,b,e,g){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new Hc(k,0)}return d.call(this,a,b,e,h)}function d(c,e,g,h){return Ta.R(b,null==c?a:c,e,g,h)}c.A=3;c.K=function(a){var b=
G(a);a=H(a);var c=G(a);a=H(a);var e=G(a);a=Ic(a);return d(b,c,e,a)};c.h=d;return c}(),g=function(a,b,g,t){switch(arguments.length){case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var u=null;if(3<arguments.length){for(var u=0,v=Array(arguments.length-3);u<v.length;)v[u]=arguments[u+3],++u;u=new Hc(v,0)}return h.h(a,b,g,u)}throw Error("Invalid arity: "+arguments.length);};g.A=3;g.K=h.K;g.c=e;g.b=d;g.f=c;g.h=h.h;return g}()}qf;
function rf(b,a,c,d){this.state=b;this.D=a;this.se=c;this.Tc=d;this.F=16386;this.m=6455296}f=rf.prototype;f.equiv=function(b){return this.B(null,b)};f.B=function(b,a){return this===a};f.fc=function(){return this.state};f.O=function(){return this.D};
f.Fd=function(b,a,c){b=F(this.Tc);for(var d=null,e=0,g=0;;)if(g<e){var h=d.da(null,g),k=M(h,0),h=M(h,1);h.w?h.w(k,this,a,c):h.call(null,k,this,a,c);g+=1}else if(b=F(b))Kd(b)?(d=dc(b),b=ec(b),k=d,e=L(d),d=k):(d=G(b),k=M(d,0),h=M(d,1),h.w?h.w(k,this,a,c):h.call(null,k,this,a,c),b=H(b),d=null,e=0),g=0;else return null};f.Ed=function(b,a,c){this.Tc=N.f(this.Tc,a,c);return this};f.M=function(){return this[ca]||(this[ca]=++da)};
var sf=function sf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return sf.c(arguments[0]);default:return sf.h(arguments[0],new Hc(c.slice(1),0))}};sf.c=function(b){return new rf(b,null,null,null)};sf.h=function(b,a){var c=null!=a&&(a.m&64||a.Ua)?Ta.b(Uc,a):a,d=C.b(c,Ba),c=C.b(c,tf);return new rf(b,d,c,null)};sf.K=function(b){var a=G(b);b=H(b);return sf.h(a,b)};sf.A=1;X;
function uf(b,a){if(b instanceof rf){var c=b.se;if(null!=c&&!p(c.c?c.c(a):c.call(null,a)))throw Error([r("Assert failed: "),r("Validator rejected reference state"),r("\n"),r(function(){var a=vc(vf,wf);return X.c?X.c(a):X.call(null,a)}())].join(""));c=b.state;b.state=a;null!=b.Tc&&Tb(b,c,a);return a}return jc(b,a)}
var xf=function xf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return xf.b(arguments[0],arguments[1]);case 3:return xf.f(arguments[0],arguments[1],arguments[2]);case 4:return xf.w(arguments[0],arguments[1],arguments[2],arguments[3]);default:return xf.h(arguments[0],arguments[1],arguments[2],arguments[3],new Hc(c.slice(4),0))}};xf.b=function(b,a){var c;b instanceof rf?(c=b.state,c=a.c?a.c(c):a.call(null,c),c=uf(b,c)):c=kc.b(b,a);return c};
xf.f=function(b,a,c){if(b instanceof rf){var d=b.state;a=a.b?a.b(d,c):a.call(null,d,c);b=uf(b,a)}else b=kc.f(b,a,c);return b};xf.w=function(b,a,c,d){if(b instanceof rf){var e=b.state;a=a.f?a.f(e,c,d):a.call(null,e,c,d);b=uf(b,a)}else b=kc.w(b,a,c,d);return b};xf.h=function(b,a,c,d,e){return b instanceof rf?uf(b,Ta.R(a,b.state,c,d,e)):kc.R(b,a,c,d,e)};xf.K=function(b){var a=G(b),c=H(b);b=G(c);var d=H(c),c=G(d),e=H(d),d=G(e),e=H(e);return xf.h(a,b,c,d,e)};xf.A=4;
function yf(b){this.state=b;this.m=32768;this.F=0}yf.prototype.Dd=function(b,a){return this.state=a};yf.prototype.fc=function(){return this.state};function qf(b){return new yf(b)}function zf(b,a){lc(b,a)}
function Af(){var b=Bf,a=Cf;return function(){function c(c,d,e){var g=b.c?b.c(c):b.call(null,c);if(p(g))return g;g=b.c?b.c(d):b.call(null,d);if(p(g))return g;g=b.c?b.c(e):b.call(null,e);if(p(g))return g;c=a.c?a.c(c):a.call(null,c);if(p(c))return c;d=a.c?a.c(d):a.call(null,d);return p(d)?d:a.c?a.c(e):a.call(null,e)}function d(c,d){var e=b.c?b.c(c):b.call(null,c);if(p(e))return e;e=b.c?b.c(d):b.call(null,d);if(p(e))return e;e=a.c?a.c(c):a.call(null,c);return p(e)?e:a.c?a.c(d):a.call(null,d)}function e(c){var d=
b.c?b.c(c):b.call(null,c);return p(d)?d:a.c?a.c(c):a.call(null,c)}var g=null,h=function(){function c(a,b,e,g){var h=null;if(3<arguments.length){for(var h=0,k=Array(arguments.length-3);h<k.length;)k[h]=arguments[h+3],++h;h=new Hc(k,0)}return d.call(this,a,b,e,h)}function d(c,e,h,k){c=g.f(c,e,h);return p(c)?c:hf(function(){return function(c){var d=b.c?b.c(c):b.call(null,c);return p(d)?d:a.c?a.c(c):a.call(null,c)}}(c),k)}c.A=3;c.K=function(a){var b=G(a);a=H(a);var c=G(a);a=H(a);var e=G(a);a=Ic(a);return d(b,
c,e,a)};c.h=d;return c}(),g=function(a,b,g,t){switch(arguments.length){case 0:return null;case 1:return e.call(this,a);case 2:return d.call(this,a,b);case 3:return c.call(this,a,b,g);default:var u=null;if(3<arguments.length){for(var u=0,v=Array(arguments.length-3);u<v.length;)v[u]=arguments[u+3],++u;u=new Hc(v,0)}return h.h(a,b,g,u)}throw Error("Invalid arity: "+arguments.length);};g.A=3;g.K=h.K;g.C=function(){return null};g.c=e;g.b=d;g.f=c;g.h=h.h;return g}()}
var R=function R(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return R.c(arguments[0]);case 2:return R.b(arguments[0],arguments[1]);case 3:return R.f(arguments[0],arguments[1],arguments[2]);case 4:return R.w(arguments[0],arguments[1],arguments[2],arguments[3]);default:return R.h(arguments[0],arguments[1],arguments[2],arguments[3],new Hc(c.slice(4),0))}};
R.c=function(b){return function(a){return function(){function c(c,d){var e=b.c?b.c(d):b.call(null,d);return a.b?a.b(c,e):a.call(null,c,e)}function d(b){return a.c?a.c(b):a.call(null,b)}function e(){return a.C?a.C():a.call(null)}var g=null,h=function(){function c(a,b,e){var g=null;if(2<arguments.length){for(var g=0,h=Array(arguments.length-2);g<h.length;)h[g]=arguments[g+2],++g;g=new Hc(h,0)}return d.call(this,a,b,g)}function d(c,e,g){e=Ta.f(b,e,g);return a.b?a.b(c,e):a.call(null,c,e)}c.A=2;c.K=function(a){var b=
G(a);a=H(a);var c=G(a);a=Ic(a);return d(b,c,a)};c.h=d;return c}(),g=function(a,b,g){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b);default:var t=null;if(2<arguments.length){for(var t=0,u=Array(arguments.length-2);t<u.length;)u[t]=arguments[t+2],++t;t=new Hc(u,0)}return h.h(a,b,t)}throw Error("Invalid arity: "+arguments.length);};g.A=2;g.K=h.K;g.C=e;g.c=d;g.b=c;g.h=h.h;return g}()}};
R.b=function(b,a){return new Ke(null,function(){var c=F(a);if(c){if(Kd(c)){for(var d=dc(c),e=L(d),g=Oe(e),h=0;;)if(h<e)Qe(g,function(){var a=y.b(d,h);return b.c?b.c(a):b.call(null,a)}()),h+=1;else break;return Pe(Re(g),R.b(b,ec(c)))}return gd(function(){var a=G(c);return b.c?b.c(a):b.call(null,a)}(),R.b(b,Ic(c)))}return null},null,null)};
R.f=function(b,a,c){return new Ke(null,function(){var d=F(a),e=F(c);if(d&&e){var g=gd,h;h=G(d);var k=G(e);h=b.b?b.b(h,k):b.call(null,h,k);d=g(h,R.f(b,Ic(d),Ic(e)))}else d=null;return d},null,null)};R.w=function(b,a,c,d){return new Ke(null,function(){var e=F(a),g=F(c),h=F(d);if(e&&g&&h){var k=gd,m;m=G(e);var n=G(g),t=G(h);m=b.f?b.f(m,n,t):b.call(null,m,n,t);e=k(m,R.w(b,Ic(e),Ic(g),Ic(h)))}else e=null;return e},null,null)};
R.h=function(b,a,c,d,e){var g=function k(a){return new Ke(null,function(){var b=R.b(F,a);return gf(be,b)?gd(R.b(G,b),k(R.b(Ic,b))):null},null,null)};return R.b(function(){return function(a){return Ta.b(b,a)}}(g),g(qd.h(e,d,E([c,a],0))))};R.K=function(b){var a=G(b),c=H(b);b=G(c);var d=H(c),c=G(d),e=H(d),d=G(e),e=H(e);return R.h(a,b,c,d,e)};R.A=4;
function Df(b){if("number"!==typeof b)throw Error([r("Assert failed: "),r(function(){var a=vc(Ef,Ff);return X.c?X.c(a):X.call(null,a)}())].join(""));return function(a){return function(b){return function(){function d(d,e){var g=Ab(b),h=lc(b,Ab(b)-1),g=0<g?a.b?a.b(d,e):a.call(null,d,e):d;return 0<h?g:$c(g)?g:Zc(g)}function e(b){return a.c?a.c(b):a.call(null,b)}function g(){return a.C?a.C():a.call(null)}var h=null,h=function(a,b){switch(arguments.length){case 0:return g.call(this);case 1:return e.call(this,
a);case 2:return d.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};h.C=g;h.c=e;h.b=d;return h}()}(qf(b))}}function Gf(b,a){if("number"!==typeof b)throw Error([r("Assert failed: "),r(function(){var a=vc(Ef,Ff);return X.c?X.c(a):X.call(null,a)}())].join(""));return new Ke(null,function(){if(0<b){var c=F(a);return c?gd(G(c),Gf(b-1,Ic(c))):null}return null},null,null)}
function Hf(b,a){if("number"!==typeof b)throw Error([r("Assert failed: "),r(function(){var a=vc(Ef,Ff);return X.c?X.c(a):X.call(null,a)}())].join(""));return new Ke(null,function(c){return function(){return c(b,a)}}(function(a,b){for(;;){var e=F(b);if(0<a&&e){var g=a-1,e=Ic(e);a=g;b=e}else return e}}),null,null)}
function If(b,a){return new Ke(null,function(c){return function(){return c(b,a)}}(function(a,b){for(;;){var e=F(b),g;if(g=e)g=G(e),g=a.c?a.c(g):a.call(null,g);if(p(g))g=a,e=Ic(e),a=g,b=e;else return e}}),null,null)}function Jf(b){return new Ke(null,function(){return gd(b,Jf(b))},null,null)}function Kf(b){return new Ke(null,function(){return gd(b.C?b.C():b.call(null),Kf(b))},null,null)}function Lf(b,a){return Gf(b,Kf(a))}
var Mf=function Mf(a,c){return gd(c,new Ke(null,function(){return Mf(a,a.c?a.c(c):a.call(null,c))},null,null))},Nf=function Nf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Nf.b(arguments[0],arguments[1]);default:return Nf.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};Nf.b=function(b,a){return new Ke(null,function(){var c=F(b),d=F(a);return c&&d?gd(G(c),gd(G(d),Nf.b(Ic(c),Ic(d)))):null},null,null)};
Nf.h=function(b,a,c){return new Ke(null,function(){var d=R.b(F,qd.h(c,a,E([b],0)));return gf(be,d)?T.b(R.b(G,d),Ta.b(Nf,R.b(Ic,d))):null},null,null)};Nf.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return Nf.h(a,b,c)};Nf.A=2;function Of(b){return Hf(1,Nf.b(Jf("L"),b))}Pf;function Qf(b,a){return Ta.b(T,Ta.f(R,b,a))}
function Rf(b){return function(a){return function(){function c(c,d){return p(b.c?b.c(d):b.call(null,d))?a.b?a.b(c,d):a.call(null,c,d):c}function d(b){return a.c?a.c(b):a.call(null,b)}function e(){return a.C?a.C():a.call(null)}var g=null,g=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};g.C=e;g.c=d;g.b=c;return g}()}}
function Sf(b,a){return new Ke(null,function(){var c=F(a);if(c){if(Kd(c)){for(var d=dc(c),e=L(d),g=Oe(e),h=0;;)if(h<e){var k;k=y.b(d,h);k=b.c?b.c(k):b.call(null,k);p(k)&&(k=y.b(d,h),g.add(k));h+=1}else break;return Pe(Re(g),Sf(b,ec(c)))}d=G(c);c=Ic(c);return p(b.c?b.c(d):b.call(null,d))?gd(d,Sf(b,c)):Sf(b,c)}return null},null,null)}function Tf(b,a){return Sf(lf(b),a)}
function Uf(b){return function c(b){return new Ke(null,function(){return gd(b,p(Od.c?Od.c(b):Od.call(null,b))?Qf(c,E([F.c?F.c(b):F.call(null,b)],0)):null)},null,null)}(b)}var Vf=function Vf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Vf.b(arguments[0],arguments[1]);case 3:return Vf.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};
Vf.b=function(b,a){return null!=b?null!=b&&(b.F&4||b.Rd)?Wc(We(w.f(Wb,Vb(b),a)),yd(b)):w.f(Za,b,a):w.f(qd,Jc,a)};Vf.f=function(b,a,c){return null!=b&&(b.F&4||b.Rd)?Wc(We(ce(a,Xe,Vb(b),c)),yd(b)):ce(a,qd,b,c)};Vf.A=3;
var Wf=function Wf(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Wf.b(arguments[0],arguments[1]);case 3:return Wf.f(arguments[0],arguments[1],arguments[2]);case 4:return Wf.w(arguments[0],arguments[1],arguments[2],arguments[3]);default:return Wf.h(arguments[0],arguments[1],arguments[2],arguments[3],new Hc(c.slice(4),0))}};Wf.b=function(b,a){return We(w.f(function(a,d){return Xe.b(a,b.c?b.c(d):b.call(null,d))},Vb(rd),a))};
Wf.f=function(b,a,c){return Vf.b(rd,R.f(b,a,c))};Wf.w=function(b,a,c,d){return Vf.b(rd,R.w(b,a,c,d))};Wf.h=function(b,a,c,d,e){return Vf.b(rd,Ta.h(R,b,a,c,d,E([e],0)))};Wf.K=function(b){var a=G(b),c=H(b);b=G(c);var d=H(c),c=G(d),e=H(d),d=G(e),e=H(e);return Wf.h(a,b,c,d,e)};Wf.A=4;function Xf(b,a){return Yf(b,a,null)}function Yf(b,a,c){var d=Nd;for(a=F(a);;)if(a)if(null!=b?b.m&256||b.Zc||(b.m?0:La(fb,b)):La(fb,b)){b=C.f(b,G(a),d);if(d===b)return c;a=H(a)}else return c;else return b}
var Zf=function Zf(a,c,d){var e=M(c,0);c=ve(c,1);return p(c)?N.f(a,e,Zf(C.b(a,e),c,d)):N.f(a,e,d)},$f=function $f(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return $f.f(arguments[0],arguments[1],arguments[2]);case 4:return $f.w(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return $f.R(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return $f.ca(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5]);default:return $f.h(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],new Hc(c.slice(6),0))}};$f.f=function(b,a,c){var d=M(a,0);a=ve(a,1);return p(a)?N.f(b,d,$f.f(C.b(b,d),a,c)):N.f(b,d,function(){var a=C.b(b,d);return c.c?c.c(a):c.call(null,a)}())};$f.w=function(b,a,c,d){var e=M(a,0);a=ve(a,1);return p(a)?N.f(b,e,$f.w(C.b(b,e),a,c,d)):N.f(b,e,function(){var a=C.b(b,e);return c.b?c.b(a,d):c.call(null,a,d)}())};
$f.R=function(b,a,c,d,e){var g=M(a,0);a=ve(a,1);return p(a)?N.f(b,g,$f.R(C.b(b,g),a,c,d,e)):N.f(b,g,function(){var a=C.b(b,g);return c.f?c.f(a,d,e):c.call(null,a,d,e)}())};$f.ca=function(b,a,c,d,e,g){var h=M(a,0);a=ve(a,1);return p(a)?N.f(b,h,$f.ca(C.b(b,h),a,c,d,e,g)):N.f(b,h,function(){var a=C.b(b,h);return c.w?c.w(a,d,e,g):c.call(null,a,d,e,g)}())};$f.h=function(b,a,c,d,e,g,h){var k=M(a,0);a=ve(a,1);return p(a)?N.f(b,k,Ta.h($f,C.b(b,k),a,c,d,E([e,g,h],0))):N.f(b,k,Ta.h(c,C.b(b,k),d,e,g,E([h],0)))};
$f.K=function(b){var a=G(b),c=H(b);b=G(c);var d=H(c),c=G(d),e=H(d),d=G(e),g=H(e),e=G(g),h=H(g),g=G(h),h=H(h);return $f.h(a,b,c,d,e,g,h)};$f.A=6;
var ag=function ag(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return ag.f(arguments[0],arguments[1],arguments[2]);case 4:return ag.w(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return ag.R(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return ag.ca(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);default:return ag.h(arguments[0],arguments[1],arguments[2],arguments[3],
arguments[4],arguments[5],new Hc(c.slice(6),0))}};ag.f=function(b,a,c){return N.f(b,a,function(){var d=C.b(b,a);return c.c?c.c(d):c.call(null,d)}())};ag.w=function(b,a,c,d){return N.f(b,a,function(){var e=C.b(b,a);return c.b?c.b(e,d):c.call(null,e,d)}())};ag.R=function(b,a,c,d,e){return N.f(b,a,function(){var g=C.b(b,a);return c.f?c.f(g,d,e):c.call(null,g,d,e)}())};ag.ca=function(b,a,c,d,e,g){return N.f(b,a,function(){var h=C.b(b,a);return c.w?c.w(h,d,e,g):c.call(null,h,d,e,g)}())};
ag.h=function(b,a,c,d,e,g,h){return N.f(b,a,Ta.h(c,C.b(b,a),d,e,g,E([h],0)))};ag.K=function(b){var a=G(b),c=H(b);b=G(c);var d=H(c),c=G(d),e=H(d),d=G(e),g=H(e),e=G(g),h=H(g),g=G(h),h=H(h);return ag.h(a,b,c,d,e,g,h)};ag.A=6;function bg(b,a){this.ia=b;this.l=a}function cg(b){return new bg(b,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null])}function dg(b){return new bg(b.ia,Sa(b.l))}
function eg(b){b=b.u;return 32>b?0:b-1>>>5<<5}function fg(b,a,c){for(;;){if(0===a)return c;var d=cg(b);d.l[0]=c;c=d;a-=5}}var gg=function gg(a,c,d,e){var g=dg(d),h=a.u-1>>>c&31;5===c?g.l[h]=e:(d=d.l[h],a=null!=d?gg(a,c-5,d,e):fg(null,c-5,e),g.l[h]=a);return g};function hg(b,a){throw Error([r("No item "),r(b),r(" in vector of length "),r(a)].join(""));}function ig(b,a){if(a>=eg(b))return b.ea;for(var c=b.root,d=b.shift;;)if(0<d)var e=d-5,c=c.l[a>>>d&31],d=e;else return c.l}
function jg(b,a){return 0<=a&&a<b.u?ig(b,a):hg(a,b.u)}var kg=function kg(a,c,d,e,g){var h=dg(d);if(0===c)h.l[e&31]=g;else{var k=e>>>c&31;a=kg(a,c-5,d.l[k],e,g);h.l[k]=a}return h},lg=function lg(a,c,d){var e=a.u-2>>>c&31;if(5<c){a=lg(a,c-5,d.l[e]);if(null==a&&0===e)return null;d=dg(d);d.l[e]=a;return d}if(0===e)return null;d=dg(d);d.l[e]=null;return d};function mg(b,a,c,d,e,g){this.G=b;this.Vc=a;this.l=c;this.v=d;this.start=e;this.end=g}mg.prototype.ta=function(){return this.G<this.end};
mg.prototype.next=function(){32===this.G-this.Vc&&(this.l=ig(this.v,this.G),this.Vc+=32);var b=this.l[this.G&31];this.G+=1;return b};ng;og;pg;I;Y;qg;rg;function U(b,a,c,d,e,g){this.D=b;this.u=a;this.shift=c;this.root=d;this.ea=e;this.j=g;this.m=167668511;this.F=8196}f=U.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){return"number"===typeof a?y.f(this,a,c):c};
f.hc=function(b,a,c){b=0;for(var d=c;;)if(b<this.u){var e=ig(this,b);c=e.length;a:for(var g=0;;)if(g<c){var h=g+b,k=e[g],d=a.f?a.f(d,h,k):a.call(null,d,h,k);if($c(d)){e=d;break a}g+=1}else{e=d;break a}if($c(e))return I.c?I.c(e):I.call(null,e);b+=c;d=e}else return d};f.da=function(b,a){return jg(this,a)[a&31]};f.Pa=function(b,a,c){return 0<=a&&a<this.u?ig(this,a)[a&31]:c};
f.Vb=function(b,a,c){if(0<=a&&a<this.u)return eg(this)<=a?(b=Sa(this.ea),b[a&31]=c,new U(this.D,this.u,this.shift,this.root,b,null)):new U(this.D,this.u,this.shift,kg(this,this.shift,this.root,a,c),this.ea,null);if(a===this.u)return Za(this,c);throw Error([r("Index "),r(a),r(" out of bounds  [0,"),r(this.u),r("]")].join(""));};f.V=function(){var b=this.u;return new mg(0,0,0<L(this)?ig(this,0):null,this,0,b)};f.O=function(){return this.D};f.T=function(){return this.u};
f.sc=function(){return y.b(this,0)};f.tc=function(){return y.b(this,1)};f.Ib=function(){return 0<this.u?y.b(this,this.u-1):null};
f.Jb=function(){if(0===this.u)throw Error("Can't pop empty vector");if(1===this.u)return Eb(rd,this.D);if(1<this.u-eg(this))return new U(this.D,this.u-1,this.shift,this.root,this.ea.slice(0,-1),null);var b=ig(this,this.u-2),a=lg(this,this.shift,this.root),a=null==a?W:a,c=this.u-1;return 5<this.shift&&null==a.l[1]?new U(this.D,c,this.shift-5,a.l[0],b,null):new U(this.D,c,this.shift,a,b,null)};f.Bb=function(){return 0<this.u?new hd(this,this.u-1,null):null};
f.M=function(){var b=this.j;return null!=b?b:this.j=b=Qc(this)};f.B=function(b,a){if(a instanceof U)if(this.u===L(a))for(var c=mc(this),d=mc(a);;)if(p(c.ta())){var e=c.next(),g=d.next();if(!B.b(e,g))return!1}else return!0;else return!1;else return Vc(this,a)};f.gc=function(){return new pg(this.u,this.shift,ng.c?ng.c(this.root):ng.call(null,this.root),og.c?og.c(this.ea):og.call(null,this.ea))};f.ha=function(){return Wc(rd,this.D)};f.oa=function(b,a){return ad(this,a)};
f.pa=function(b,a,c){b=0;for(var d=c;;)if(b<this.u){var e=ig(this,b);c=e.length;a:for(var g=0;;)if(g<c){var h=e[g],d=a.b?a.b(d,h):a.call(null,d,h);if($c(d)){e=d;break a}g+=1}else{e=d;break a}if($c(e))return I.c?I.c(e):I.call(null,e);b+=c;d=e}else return d};f.U=function(b,a,c){if("number"===typeof a)return xb(this,a,c);throw Error("Vector's key for assoc must be a number.");};
f.N=function(){if(0===this.u)return null;if(32>=this.u)return new Hc(this.ea,0);var b;a:{b=this.root;for(var a=this.shift;;)if(0<a)a-=5,b=b.l[0];else{b=b.l;break a}}return rg.w?rg.w(this,b,0,0):rg.call(null,this,b,0,0)};f.P=function(b,a){return new U(a,this.u,this.shift,this.root,this.ea,this.j)};
f.S=function(b,a){if(32>this.u-eg(this)){for(var c=this.ea.length,d=Array(c+1),e=0;;)if(e<c)d[e]=this.ea[e],e+=1;else break;d[c]=a;return new U(this.D,this.u+1,this.shift,this.root,d,null)}c=(d=this.u>>>5>1<<this.shift)?this.shift+5:this.shift;d?(d=cg(null),d.l[0]=this.root,e=fg(null,this.shift,new bg(null,this.ea)),d.l[1]=e):d=gg(this,this.shift,this.root,new bg(null,this.ea));return new U(this.D,this.u+1,c,d,[a],null)};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.da(null,b);case 3:return this.Pa(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.da(null,b)};b.f=function(a,b,d){return this.Pa(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.c=function(b){return this.da(null,b)};f.b=function(b,a){return this.Pa(null,b,a)};
var W=new bg(null,[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]),rd=new U(null,0,5,W,[],Rc);function sg(b){var a=b.length;if(32>a)return new U(null,a,5,W,b,null);for(var c=32,d=(new U(null,32,5,W,b.slice(0,32),null)).gc(null);;)if(c<a)var e=c+1,d=Xe.b(d,b[c]),c=e;else return Xb(d)}U.prototype[Pa]=function(){return Mc(this)};function $d(b){return Ia(b)?sg(b):Xb(w.f(Wb,Vb(rd),b))}
var tg=function tg(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return tg.h(0<c.length?new Hc(c.slice(0),0):null)};tg.h=function(b){return b instanceof Hc&&0===b.G?sg(b.l):$d(b)};tg.A=0;tg.K=function(b){return tg.h(F(b))};ug;function Jd(b,a,c,d,e,g){this.Za=b;this.node=a;this.G=c;this.ya=d;this.D=e;this.j=g;this.m=32375020;this.F=1536}f=Jd.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.O=function(){return this.D};
f.wa=function(){if(this.ya+1<this.node.length){var b;b=this.Za;var a=this.node,c=this.G,d=this.ya+1;b=rg.w?rg.w(b,a,c,d):rg.call(null,b,a,c,d);return null==b?null:b}return fc(this)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Qc(this)};f.B=function(b,a){return Vc(this,a)};f.ha=function(){return Wc(rd,this.D)};f.oa=function(b,a){var c;c=this.Za;var d=this.G+this.ya,e=L(this.Za);c=ug.f?ug.f(c,d,e):ug.call(null,c,d,e);return ad(c,a)};
f.pa=function(b,a,c){b=this.Za;var d=this.G+this.ya,e=L(this.Za);b=ug.f?ug.f(b,d,e):ug.call(null,b,d,e);return bd(b,a,c)};f.ja=function(){return this.node[this.ya]};f.ra=function(){if(this.ya+1<this.node.length){var b;b=this.Za;var a=this.node,c=this.G,d=this.ya+1;b=rg.w?rg.w(b,a,c,d):rg.call(null,b,a,c,d);return null==b?Jc:b}return ec(this)};f.N=function(){return this};f.Mc=function(){var b=this.node;return new Me(b,this.ya,b.length)};
f.Nc=function(){var b=this.G+this.node.length;if(b<Wa(this.Za)){var a=this.Za,c=ig(this.Za,b);return rg.w?rg.w(a,c,b,0):rg.call(null,a,c,b,0)}return Jc};f.P=function(b,a){return rg.R?rg.R(this.Za,this.node,this.G,this.ya,a):rg.call(null,this.Za,this.node,this.G,this.ya,a)};f.S=function(b,a){return gd(a,this)};f.Lc=function(){var b=this.G+this.node.length;if(b<Wa(this.Za)){var a=this.Za,c=ig(this.Za,b);return rg.w?rg.w(a,c,b,0):rg.call(null,a,c,b,0)}return null};Jd.prototype[Pa]=function(){return Mc(this)};
var rg=function rg(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return rg.f(arguments[0],arguments[1],arguments[2]);case 4:return rg.w(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return rg.R(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};rg.f=function(b,a,c){return new Jd(b,jg(b,a),a,c,null,null)};
rg.w=function(b,a,c,d){return new Jd(b,a,c,d,null,null)};rg.R=function(b,a,c,d,e){return new Jd(b,a,c,d,e,null)};rg.A=5;vg;function wg(b,a,c,d,e){this.D=b;this.v=a;this.start=c;this.end=d;this.j=e;this.m=167666463;this.F=8192}f=wg.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){return"number"===typeof a?y.f(this,a,c):c};
f.hc=function(b,a,c){b=this.start;for(var d=0;;)if(b<this.end){var e=d,g=y.b(this.v,b);c=a.f?a.f(c,e,g):a.call(null,c,e,g);if($c(c))return I.c?I.c(c):I.call(null,c);d+=1;b+=1}else return c};f.da=function(b,a){return 0>a||this.end<=this.start+a?hg(a,this.end-this.start):y.b(this.v,this.start+a)};f.Pa=function(b,a,c){return 0>a||this.end<=this.start+a?c:y.f(this.v,this.start+a,c)};
f.Vb=function(b,a,c){var d=this.start+a;b=this.D;c=N.f(this.v,d,c);a=this.start;var e=this.end,d=d+1,d=e>d?e:d;return vg.R?vg.R(b,c,a,d,null):vg.call(null,b,c,a,d,null)};f.O=function(){return this.D};f.T=function(){return this.end-this.start};f.Ib=function(){return y.b(this.v,this.end-1)};f.Jb=function(){if(this.start===this.end)throw Error("Can't pop empty vector");var b=this.D,a=this.v,c=this.start,d=this.end-1;return vg.R?vg.R(b,a,c,d,null):vg.call(null,b,a,c,d,null)};
f.Bb=function(){return this.start!==this.end?new hd(this,this.end-this.start-1,null):null};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Qc(this)};f.B=function(b,a){return Vc(this,a)};f.ha=function(){return Wc(rd,this.D)};f.oa=function(b,a){return ad(this,a)};f.pa=function(b,a,c){return bd(this,a,c)};f.U=function(b,a,c){if("number"===typeof a)return xb(this,a,c);throw Error("Subvec's key for assoc must be a number.");};
f.N=function(){var b=this;return function(a){return function d(e){return e===b.end?null:gd(y.b(b.v,e),new Ke(null,function(){return function(){return d(e+1)}}(a),null,null))}}(this)(b.start)};f.P=function(b,a){return vg.R?vg.R(a,this.v,this.start,this.end,this.j):vg.call(null,a,this.v,this.start,this.end,this.j)};f.S=function(b,a){var c=this.D,d=xb(this.v,this.end,a),e=this.start,g=this.end+1;return vg.R?vg.R(c,d,e,g,null):vg.call(null,c,d,e,g,null)};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.da(null,b);case 3:return this.Pa(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.da(null,b)};b.f=function(a,b,d){return this.Pa(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.c=function(b){return this.da(null,b)};f.b=function(b,a){return this.Pa(null,b,a)};wg.prototype[Pa]=function(){return Mc(this)};
function vg(b,a,c,d,e){for(;;)if(a instanceof wg)c=a.start+c,d=a.start+d,a=a.v;else{var g=L(a);if(0>c||0>d||c>g||d>g)throw Error("Index out of bounds");return new wg(b,a,c,d,e)}}var ug=function ug(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ug.b(arguments[0],arguments[1]);case 3:return ug.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};
ug.b=function(b,a){return ug.f(b,a,L(b))};ug.f=function(b,a,c){return vg(null,b,a,c,null)};ug.A=3;function xg(b,a){return b===a.ia?a:new bg(b,Sa(a.l))}function ng(b){return new bg({},Sa(b.l))}function og(b){var a=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];Md(b,0,a,0,b.length);return a}
var yg=function yg(a,c,d,e){d=xg(a.root.ia,d);var g=a.u-1>>>c&31;if(5===c)a=e;else{var h=d.l[g];a=null!=h?yg(a,c-5,h,e):fg(a.root.ia,c-5,e)}d.l[g]=a;return d};function pg(b,a,c,d){this.u=b;this.shift=a;this.root=c;this.ea=d;this.F=88;this.m=275}f=pg.prototype;
f.Ub=function(b,a){if(this.root.ia){if(32>this.u-eg(this))this.ea[this.u&31]=a;else{var c=new bg(this.root.ia,this.ea),d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];d[0]=a;this.ea=d;if(this.u>>>5>1<<this.shift){var d=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],e=this.shift+
5;d[0]=this.root;d[1]=fg(this.root.ia,this.shift,c);this.root=new bg(this.root.ia,d);this.shift=e}else this.root=yg(this,this.shift,this.root,c)}this.u+=1;return this}throw Error("conj! after persistent!");};f.ic=function(){if(this.root.ia){this.root.ia=null;var b=this.u-eg(this),a=Array(b);Md(this.ea,0,a,0,b);return new U(null,this.u,this.shift,this.root,a,null)}throw Error("persistent! called twice");};
f.wc=function(b,a,c){if("number"===typeof a)return $b(this,a,c);throw Error("TransientVector's key for assoc! must be a number.");};
f.Cd=function(b,a,c){var d=this;if(d.root.ia){if(0<=a&&a<d.u)return eg(this)<=a?d.ea[a&31]=c:(b=function(){return function g(b,k){var m=xg(d.root.ia,k);if(0===b)m.l[a&31]=c;else{var n=a>>>b&31,t=g(b-5,m.l[n]);m.l[n]=t}return m}}(this).call(null,d.shift,d.root),d.root=b),this;if(a===d.u)return Wb(this,c);throw Error([r("Index "),r(a),r(" out of bounds for TransientVector of length"),r(d.u)].join(""));}throw Error("assoc! after persistent!");};
f.T=function(){if(this.root.ia)return this.u;throw Error("count after persistent!");};f.da=function(b,a){if(this.root.ia)return jg(this,a)[a&31];throw Error("nth after persistent!");};f.Pa=function(b,a,c){return 0<=a&&a<this.u?y.b(this,a):c};f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){return"number"===typeof a?y.f(this,a,c):c};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.I(null,b);case 3:return this.H(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.I(null,b)};b.f=function(a,b,d){return this.H(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.c=function(b){return this.I(null,b)};f.b=function(b,a){return this.H(null,b,a)};function zg(b,a){this.kc=b;this.Ic=a}
zg.prototype.ta=function(){var b=null!=this.kc&&F(this.kc);return b?b:(b=null!=this.Ic)?this.Ic.ta():b};zg.prototype.next=function(){if(null!=this.kc){var b=G(this.kc);this.kc=H(this.kc);return b}if(null!=this.Ic&&this.Ic.ta())return this.Ic.next();throw Error("No such element");};zg.prototype.remove=function(){return Error("Unsupported operation")};function Ag(b,a,c,d){this.D=b;this.Va=a;this.ob=c;this.j=d;this.m=31850572;this.F=0}f=Ag.prototype;f.toString=function(){return oc(this)};
f.equiv=function(b){return this.B(null,b)};f.O=function(){return this.D};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Qc(this)};f.B=function(b,a){return Vc(this,a)};f.ha=function(){return Wc(Jc,this.D)};f.ja=function(){return G(this.Va)};f.ra=function(){var b=H(this.Va);return b?new Ag(this.D,b,this.ob,null):null==this.ob?Xa(this):new Ag(this.D,this.ob,null,null)};f.N=function(){return this};f.P=function(b,a){return new Ag(a,this.Va,this.ob,this.j)};f.S=function(b,a){return gd(a,this)};
Ag.prototype[Pa]=function(){return Mc(this)};function Bg(b,a,c,d,e){this.D=b;this.count=a;this.Va=c;this.ob=d;this.j=e;this.m=31858766;this.F=8192}f=Bg.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.V=function(){return new zg(this.Va,mc(this.ob))};f.O=function(){return this.D};f.T=function(){return this.count};f.Ib=function(){return G(this.Va)};
f.Jb=function(){if(p(this.Va)){var b=H(this.Va);return b?new Bg(this.D,this.count-1,b,this.ob,null):new Bg(this.D,this.count-1,F(this.ob),rd,null)}return this};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Qc(this)};f.B=function(b,a){return Vc(this,a)};f.ha=function(){return Wc(Cg,this.D)};f.ja=function(){return G(this.Va)};f.ra=function(){return Ic(F(this))};f.N=function(){var b=F(this.ob),a=this.Va;return p(p(a)?a:b)?new Ag(null,this.Va,F(b),null):null};
f.P=function(b,a){return new Bg(a,this.count,this.Va,this.ob,this.j)};f.S=function(b,a){var c;p(this.Va)?(c=this.ob,c=new Bg(this.D,this.count+1,this.Va,qd.b(p(c)?c:rd,a),null)):c=new Bg(this.D,this.count+1,qd.b(this.Va,a),rd,null);return c};var Cg=new Bg(null,0,null,rd,Rc);Bg.prototype[Pa]=function(){return Mc(this)};function Dg(){this.m=2097152;this.F=0}Dg.prototype.equiv=function(b){return this.B(null,b)};Dg.prototype.B=function(){return!1};var Eg=new Dg;
function Fg(b,a){return Qd(Ed(a)?L(b)===L(a)?gf(be,R.b(function(b){return B.b(C.f(a,G(b),Eg),nd(b))},b)):null:null)}function Gg(b,a,c,d,e){this.G=b;this.qe=a;this.wd=c;this.ge=d;this.Ld=e}Gg.prototype.ta=function(){var b=this.G<this.wd;return b?b:this.Ld.ta()};Gg.prototype.next=function(){if(this.G<this.wd){var b=ud(this.ge,this.G);this.G+=1;return new U(null,2,5,W,[b,gb.b(this.qe,b)],null)}return this.Ld.next()};Gg.prototype.remove=function(){return Error("Unsupported operation")};
function Hg(b){this.aa=b}Hg.prototype.next=function(){if(null!=this.aa){var b=G(this.aa),a=M(b,0),b=M(b,1);this.aa=H(this.aa);return{value:[a,b],done:!1}}return{value:null,done:!0}};function Kg(b){return new Hg(F(b))}function Lg(b){this.aa=b}Lg.prototype.next=function(){if(null!=this.aa){var b=G(this.aa);this.aa=H(this.aa);return{value:[b,b],done:!1}}return{value:null,done:!0}};
function Mg(b,a){var c;if(a instanceof q)a:{c=b.length;for(var d=a.W,e=0;;){if(c<=e){c=-1;break a}if(b[e]instanceof q&&d===b[e].W){c=e;break a}e+=2}}else if("string"==typeof a||"number"===typeof a)a:for(c=b.length,d=0;;){if(c<=d){c=-1;break a}if(a===b[d]){c=d;break a}d+=2}else if(a instanceof z)a:for(c=b.length,d=a.vb,e=0;;){if(c<=e){c=-1;break a}if(b[e]instanceof z&&d===b[e].vb){c=e;break a}e+=2}else if(null==a)a:for(c=b.length,d=0;;){if(c<=d){c=-1;break a}if(null==b[d]){c=d;break a}d+=2}else a:for(c=
b.length,d=0;;){if(c<=d){c=-1;break a}if(B.b(a,b[d])){c=d;break a}d+=2}return c}Ng;function Og(b,a,c){this.l=b;this.G=a;this.Ra=c;this.m=32374990;this.F=0}f=Og.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.O=function(){return this.Ra};f.wa=function(){return this.G<this.l.length-2?new Og(this.l,this.G+2,this.Ra):null};f.T=function(){return(this.l.length-this.G)/2};f.M=function(){return Qc(this)};f.B=function(b,a){return Vc(this,a)};
f.ha=function(){return Wc(Jc,this.Ra)};f.oa=function(b,a){return md.b(a,this)};f.pa=function(b,a,c){return md.f(a,c,this)};f.ja=function(){return new U(null,2,5,W,[this.l[this.G],this.l[this.G+1]],null)};f.ra=function(){return this.G<this.l.length-2?new Og(this.l,this.G+2,this.Ra):Jc};f.N=function(){return this};f.P=function(b,a){return new Og(this.l,this.G,a)};f.S=function(b,a){return gd(a,this)};Og.prototype[Pa]=function(){return Mc(this)};Pg;Qg;function Rg(b,a,c){this.l=b;this.G=a;this.u=c}
Rg.prototype.ta=function(){return this.G<this.u};Rg.prototype.next=function(){var b=new U(null,2,5,W,[this.l[this.G],this.l[this.G+1]],null);this.G+=2;return b};function l(b,a,c,d){this.D=b;this.u=a;this.l=c;this.j=d;this.m=16647951;this.F=8196}f=l.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.keys=function(){return Mc(Pg.c?Pg.c(this):Pg.call(null,this))};f.entries=function(){return Kg(F(this))};
f.values=function(){return Mc(Qg.c?Qg.c(this):Qg.call(null,this))};f.has=function(b){return Rd(this,b)};f.get=function(b,a){return this.H(null,b,a)};f.forEach=function(b){for(var a=F(this),c=null,d=0,e=0;;)if(e<d){var g=c.da(null,e),h=M(g,0),g=M(g,1);b.b?b.b(g,h):b.call(null,g,h);e+=1}else if(a=F(a))Kd(a)?(c=dc(a),a=ec(a),h=c,d=L(c),c=h):(c=G(a),h=M(c,0),g=M(c,1),b.b?b.b(g,h):b.call(null,g,h),a=H(a),c=null,d=0),e=0;else return null};f.I=function(b,a){return gb.f(this,a,null)};
f.H=function(b,a,c){b=Mg(this.l,a);return-1===b?c:this.l[b+1]};f.hc=function(b,a,c){b=this.l.length;for(var d=0;;)if(d<b){var e=this.l[d],g=this.l[d+1];c=a.f?a.f(c,e,g):a.call(null,c,e,g);if($c(c))return I.c?I.c(c):I.call(null,c);d+=2}else return c};f.V=function(){return new Rg(this.l,0,2*this.u)};f.O=function(){return this.D};f.T=function(){return this.u};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Sc(this)};
f.B=function(b,a){if(null!=a&&(a.m&1024||a.Ud)){var c=this.l.length;if(this.u===a.T(null))for(var d=0;;)if(d<c){var e=a.H(null,this.l[d],Nd);if(e!==Nd)if(B.b(this.l[d+1],e))d+=2;else return!1;else return!1}else return!0;else return!1}else return Fg(this,a)};f.gc=function(){return new Ng({},this.l.length,Sa(this.l))};f.ha=function(){return Eb(Q,this.D)};f.oa=function(b,a){return md.b(a,this)};f.pa=function(b,a,c){return md.f(a,c,this)};
f.Y=function(b,a){if(0<=Mg(this.l,a)){var c=this.l.length,d=c-2;if(0===d)return Xa(this);for(var d=Array(d),e=0,g=0;;){if(e>=c)return new l(this.D,this.u-1,d,null);B.b(a,this.l[e])||(d[g]=this.l[e],d[g+1]=this.l[e+1],g+=2);e+=2}}else return this};
f.U=function(b,a,c){b=Mg(this.l,a);if(-1===b){if(this.u<Td){b=this.l;for(var d=b.length,e=Array(d+2),g=0;;)if(g<d)e[g]=b[g],g+=1;else break;e[d]=a;e[d+1]=c;return new l(this.D,this.u+1,e,null)}return Eb(ib(Vf.b(Sg,this),a,c),this.D)}if(c===this.l[b+1])return this;a=Sa(this.l);a[b+1]=c;return new l(this.D,this.u,a,null)};f.Sb=function(b,a){return-1!==Mg(this.l,a)};f.N=function(){var b=this.l;return 0<=b.length-2?new Og(b,0,null):null};f.P=function(b,a){return new l(a,this.u,this.l,this.j)};
f.S=function(b,a){if(Hd(a))return ib(this,y.b(a,0),y.b(a,1));for(var c=this,d=F(a);;){if(null==d)return c;var e=G(d);if(Hd(e))c=ib(c,y.b(e,0),y.b(e,1)),d=H(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.I(null,b);case 3:return this.H(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.I(null,b)};b.f=function(a,b,d){return this.H(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.c=function(b){return this.I(null,b)};f.b=function(b,a){return this.H(null,b,a)};var Q=new l(null,0,[],Tc),Td=8;
function Tg(b){for(var a=[],c=0;;)if(c<b.length){var d=b[c],e=b[c+1];-1===Mg(a,d)&&(a.push(d),a.push(e));c+=2}else break;return new l(null,a.length/2,a,null)}l.prototype[Pa]=function(){return Mc(this)};Ug;function Ng(b,a,c){this.jc=b;this.$b=a;this.l=c;this.m=258;this.F=56}f=Ng.prototype;f.T=function(){if(p(this.jc))return se(this.$b,2);throw Error("count after persistent!");};f.I=function(b,a){return gb.f(this,a,null)};
f.H=function(b,a,c){if(p(this.jc))return b=Mg(this.l,a),-1===b?c:this.l[b+1];throw Error("lookup after persistent!");};f.Ub=function(b,a){if(p(this.jc)){if(null!=a?a.m&2048||a.Vd||(a.m?0:La(lb,a)):La(lb,a))return Zb(this,ye.c?ye.c(a):ye.call(null,a),ze.c?ze.c(a):ze.call(null,a));for(var c=F(a),d=this;;){var e=G(c);if(p(e))c=H(c),d=Zb(d,ye.c?ye.c(e):ye.call(null,e),ze.c?ze.c(e):ze.call(null,e));else return d}}else throw Error("conj! after persistent!");};
f.ic=function(){if(p(this.jc))return this.jc=!1,new l(null,se(this.$b,2),this.l,null);throw Error("persistent! called twice");};f.wc=function(b,a,c){if(p(this.jc)){b=Mg(this.l,a);if(-1===b)return this.$b+2<=2*Td?(this.$b+=2,this.l.push(a),this.l.push(c),this):Ye.f(Ug.b?Ug.b(this.$b,this.l):Ug.call(null,this.$b,this.l),a,c);c!==this.l[b+1]&&(this.l[b+1]=c);return this}throw Error("assoc! after persistent!");};Vg;vd;
function Ug(b,a){for(var c=Vb(Sg),d=0;;)if(d<b)c=Ye.f(c,a[d],a[d+1]),d+=2;else return c}function Wg(){this.L=!1}Xg;Yg;uf;Zg;sf;I;function $g(b,a){return b===a?!0:S(b,a)?!0:B.b(b,a)}function ah(b,a,c){b=Sa(b);b[a]=c;return b}function bh(b,a){var c=Array(b.length-2);Md(b,0,c,0,2*a);Md(b,2*(a+1),c,2*a,c.length-2*a);return c}function ch(b,a,c,d){b=b.Xb(a);b.l[c]=d;return b}
function dh(b,a,c){for(var d=b.length,e=0,g=c;;)if(e<d){c=b[e];if(null!=c){var h=b[e+1];c=a.f?a.f(g,c,h):a.call(null,g,c,h)}else c=b[e+1],c=null!=c?c.Zb(a,g):g;if($c(c))return I.c?I.c(c):I.call(null,c);e+=2;g=c}else return g}eh;function fh(b,a,c,d){this.l=b;this.G=a;this.Gc=c;this.nb=d}fh.prototype.advance=function(){for(var b=this.l.length;;)if(this.G<b){var a=this.l[this.G],c=this.l[this.G+1];null!=a?a=this.Gc=new U(null,2,5,W,[a,c],null):null!=c?(a=mc(c),a=a.ta()?this.nb=a:!1):a=!1;this.G+=2;if(a)return!0}else return!1};
fh.prototype.ta=function(){var b=null!=this.Gc;return b?b:(b=null!=this.nb)?b:this.advance()};fh.prototype.next=function(){if(null!=this.Gc){var b=this.Gc;this.Gc=null;return b}if(null!=this.nb)return b=this.nb.next(),this.nb.ta()||(this.nb=null),b;if(this.advance())return this.next();throw Error("No such element");};fh.prototype.remove=function(){return Error("Unsupported operation")};function gh(b,a,c){this.ia=b;this.na=a;this.l=c}f=gh.prototype;
f.Xb=function(b){if(b===this.ia)return this;var a=te(this.na),c=Array(0>a?4:2*(a+1));Md(this.l,0,c,0,2*a);return new gh(b,this.na,c)};f.Dc=function(){return Xg.c?Xg.c(this.l):Xg.call(null,this.l)};f.Zb=function(b,a){return dh(this.l,b,a)};f.Mb=function(b,a,c,d){var e=1<<(a>>>b&31);if(0===(this.na&e))return d;var g=te(this.na&e-1),e=this.l[2*g],g=this.l[2*g+1];return null==e?g.Mb(b+5,a,c,d):$g(c,e)?g:d};
f.mb=function(b,a,c,d,e,g){var h=1<<(c>>>a&31),k=te(this.na&h-1);if(0===(this.na&h)){var m=te(this.na);if(2*m<this.l.length){b=this.Xb(b);a=b.l;g.L=!0;a:for(c=2*(m-k),g=2*k+(c-1),m=2*(k+1)+(c-1);;){if(0===c)break a;a[m]=a[g];--m;--c;--g}a[2*k]=d;a[2*k+1]=e;b.na|=h;return b}if(16<=m){k=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];k[c>>>a&31]=hh.mb(b,a+5,c,d,e,g);for(e=d=0;;)if(32>d)0!==
(this.na>>>d&1)&&(k[d]=null!=this.l[e]?hh.mb(b,a+5,Bc(this.l[e]),this.l[e],this.l[e+1],g):this.l[e+1],e+=2),d+=1;else break;return new eh(b,m+1,k)}a=Array(2*(m+4));Md(this.l,0,a,0,2*k);a[2*k]=d;a[2*k+1]=e;Md(this.l,2*k,a,2*(k+1),2*(m-k));g.L=!0;b=this.Xb(b);b.l=a;b.na|=h;return b}m=this.l[2*k];h=this.l[2*k+1];if(null==m)return m=h.mb(b,a+5,c,d,e,g),m===h?this:ch(this,b,2*k+1,m);if($g(d,m))return e===h?this:ch(this,b,2*k+1,e);g.L=!0;g=a+5;d=Zg.qa?Zg.qa(b,g,m,h,c,d,e):Zg.call(null,b,g,m,h,c,d,e);e=
2*k;k=2*k+1;b=this.Xb(b);b.l[e]=null;b.l[k]=d;return b};
f.lb=function(b,a,c,d,e){var g=1<<(a>>>b&31),h=te(this.na&g-1);if(0===(this.na&g)){var k=te(this.na);if(16<=k){h=[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null];h[a>>>b&31]=hh.lb(b+5,a,c,d,e);for(d=c=0;;)if(32>c)0!==(this.na>>>c&1)&&(h[c]=null!=this.l[d]?hh.lb(b+5,Bc(this.l[d]),this.l[d],this.l[d+1],e):this.l[d+1],d+=2),c+=1;else break;return new eh(null,k+1,h)}b=Array(2*(k+1));Md(this.l,
0,b,0,2*h);b[2*h]=c;b[2*h+1]=d;Md(this.l,2*h,b,2*(h+1),2*(k-h));e.L=!0;return new gh(null,this.na|g,b)}var m=this.l[2*h],g=this.l[2*h+1];if(null==m)return k=g.lb(b+5,a,c,d,e),k===g?this:new gh(null,this.na,ah(this.l,2*h+1,k));if($g(c,m))return d===g?this:new gh(null,this.na,ah(this.l,2*h+1,d));e.L=!0;e=this.na;k=this.l;b+=5;b=Zg.ca?Zg.ca(b,m,g,a,c,d):Zg.call(null,b,m,g,a,c,d);c=2*h;h=2*h+1;d=Sa(k);d[c]=null;d[h]=b;return new gh(null,e,d)};
f.Ec=function(b,a,c){var d=1<<(a>>>b&31);if(0===(this.na&d))return this;var e=te(this.na&d-1),g=this.l[2*e],h=this.l[2*e+1];return null==g?(b=h.Ec(b+5,a,c),b===h?this:null!=b?new gh(null,this.na,ah(this.l,2*e+1,b)):this.na===d?null:new gh(null,this.na^d,bh(this.l,e))):$g(c,g)?new gh(null,this.na^d,bh(this.l,e)):this};f.V=function(){return new fh(this.l,0,null,null)};var hh=new gh(null,0,[]);function ih(b,a,c){this.l=b;this.G=a;this.nb=c}
ih.prototype.ta=function(){for(var b=this.l.length;;){if(null!=this.nb&&this.nb.ta())return!0;if(this.G<b){var a=this.l[this.G];this.G+=1;null!=a&&(this.nb=mc(a))}else return!1}};ih.prototype.next=function(){if(this.ta())return this.nb.next();throw Error("No such element");};ih.prototype.remove=function(){return Error("Unsupported operation")};function eh(b,a,c){this.ia=b;this.u=a;this.l=c}f=eh.prototype;f.Xb=function(b){return b===this.ia?this:new eh(b,this.u,Sa(this.l))};
f.Dc=function(){return Yg.c?Yg.c(this.l):Yg.call(null,this.l)};f.Zb=function(b,a){for(var c=this.l.length,d=0,e=a;;)if(d<c){var g=this.l[d];if(null!=g&&(e=g.Zb(b,e),$c(e)))return I.c?I.c(e):I.call(null,e);d+=1}else return e};f.Mb=function(b,a,c,d){var e=this.l[a>>>b&31];return null!=e?e.Mb(b+5,a,c,d):d};f.mb=function(b,a,c,d,e,g){var h=c>>>a&31,k=this.l[h];if(null==k)return b=ch(this,b,h,hh.mb(b,a+5,c,d,e,g)),b.u+=1,b;a=k.mb(b,a+5,c,d,e,g);return a===k?this:ch(this,b,h,a)};
f.lb=function(b,a,c,d,e){var g=a>>>b&31,h=this.l[g];if(null==h)return new eh(null,this.u+1,ah(this.l,g,hh.lb(b+5,a,c,d,e)));b=h.lb(b+5,a,c,d,e);return b===h?this:new eh(null,this.u,ah(this.l,g,b))};
f.Ec=function(b,a,c){var d=a>>>b&31,e=this.l[d];if(null!=e){b=e.Ec(b+5,a,c);if(b===e)d=this;else if(null==b)if(8>=this.u)a:{e=this.l;b=e.length;a=Array(2*(this.u-1));c=0;for(var g=1,h=0;;)if(c<b)c!==d&&null!=e[c]&&(a[g]=e[c],g+=2,h|=1<<c),c+=1;else{d=new gh(null,h,a);break a}}else d=new eh(null,this.u-1,ah(this.l,d,b));else d=new eh(null,this.u,ah(this.l,d,b));return d}return this};f.V=function(){return new ih(this.l,0,null)};
function jh(b,a,c){a*=2;for(var d=0;;)if(d<a){if($g(c,b[d]))return d;d+=2}else return-1}function kh(b,a,c,d){this.ia=b;this.Db=a;this.u=c;this.l=d}f=kh.prototype;f.Xb=function(b){if(b===this.ia)return this;var a=Array(2*(this.u+1));Md(this.l,0,a,0,2*this.u);return new kh(b,this.Db,this.u,a)};f.Dc=function(){return Xg.c?Xg.c(this.l):Xg.call(null,this.l)};f.Zb=function(b,a){return dh(this.l,b,a)};f.Mb=function(b,a,c,d){b=jh(this.l,this.u,c);return 0>b?d:$g(c,this.l[b])?this.l[b+1]:d};
f.mb=function(b,a,c,d,e,g){if(c===this.Db){a=jh(this.l,this.u,d);if(-1===a){if(this.l.length>2*this.u)return a=2*this.u,c=2*this.u+1,b=this.Xb(b),b.l[a]=d,b.l[c]=e,g.L=!0,b.u+=1,b;c=this.l.length;a=Array(c+2);Md(this.l,0,a,0,c);a[c]=d;a[c+1]=e;g.L=!0;d=this.u+1;b===this.ia?(this.l=a,this.u=d,b=this):b=new kh(this.ia,this.Db,d,a);return b}return this.l[a+1]===e?this:ch(this,b,a+1,e)}return(new gh(b,1<<(this.Db>>>a&31),[null,this,null,null])).mb(b,a,c,d,e,g)};
f.lb=function(b,a,c,d,e){return a===this.Db?(b=jh(this.l,this.u,c),-1===b?(b=2*this.u,a=Array(b+2),Md(this.l,0,a,0,b),a[b]=c,a[b+1]=d,e.L=!0,new kh(null,this.Db,this.u+1,a)):B.b(this.l[b],d)?this:new kh(null,this.Db,this.u,ah(this.l,b+1,d))):(new gh(null,1<<(this.Db>>>b&31),[null,this])).lb(b,a,c,d,e)};f.Ec=function(b,a,c){b=jh(this.l,this.u,c);return-1===b?this:1===this.u?null:new kh(null,this.Db,this.u-1,bh(this.l,se(b,2)))};f.V=function(){return new fh(this.l,0,null,null)};
var Zg=function Zg(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 6:return Zg.ca(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);case 7:return Zg.qa(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};
Zg.ca=function(b,a,c,d,e,g){var h=Bc(a);if(h===d)return new kh(null,h,2,[a,c,e,g]);var k=new Wg;return hh.lb(b,h,a,c,k).lb(b,d,e,g,k)};Zg.qa=function(b,a,c,d,e,g,h){var k=Bc(c);if(k===e)return new kh(null,k,2,[c,d,g,h]);var m=new Wg;return hh.mb(b,a,k,c,d,m).mb(b,a,e,g,h,m)};Zg.A=7;function lh(b,a,c,d,e){this.D=b;this.Nb=a;this.G=c;this.aa=d;this.j=e;this.m=32374860;this.F=0}f=lh.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.O=function(){return this.D};
f.M=function(){var b=this.j;return null!=b?b:this.j=b=Qc(this)};f.B=function(b,a){return Vc(this,a)};f.ha=function(){return Wc(Jc,this.D)};f.oa=function(b,a){return md.b(a,this)};f.pa=function(b,a,c){return md.f(a,c,this)};f.ja=function(){return null==this.aa?new U(null,2,5,W,[this.Nb[this.G],this.Nb[this.G+1]],null):G(this.aa)};
f.ra=function(){if(null==this.aa){var b=this.Nb,a=this.G+2;return Xg.f?Xg.f(b,a,null):Xg.call(null,b,a,null)}var b=this.Nb,a=this.G,c=H(this.aa);return Xg.f?Xg.f(b,a,c):Xg.call(null,b,a,c)};f.N=function(){return this};f.P=function(b,a){return new lh(a,this.Nb,this.G,this.aa,this.j)};f.S=function(b,a){return gd(a,this)};lh.prototype[Pa]=function(){return Mc(this)};
var Xg=function Xg(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Xg.c(arguments[0]);case 3:return Xg.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};Xg.c=function(b){return Xg.f(b,0,null)};
Xg.f=function(b,a,c){if(null==c)for(c=b.length;;)if(a<c){if(null!=b[a])return new lh(null,b,a,null,null);var d=b[a+1];if(p(d)&&(d=d.Dc(),p(d)))return new lh(null,b,a+2,d,null);a+=2}else return null;else return new lh(null,b,a,c,null)};Xg.A=3;function mh(b,a,c,d,e){this.D=b;this.Nb=a;this.G=c;this.aa=d;this.j=e;this.m=32374860;this.F=0}f=mh.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.O=function(){return this.D};
f.M=function(){var b=this.j;return null!=b?b:this.j=b=Qc(this)};f.B=function(b,a){return Vc(this,a)};f.ha=function(){return Wc(Jc,this.D)};f.oa=function(b,a){return md.b(a,this)};f.pa=function(b,a,c){return md.f(a,c,this)};f.ja=function(){return G(this.aa)};f.ra=function(){var b=this.Nb,a=this.G,c=H(this.aa);return Yg.w?Yg.w(null,b,a,c):Yg.call(null,null,b,a,c)};f.N=function(){return this};f.P=function(b,a){return new mh(a,this.Nb,this.G,this.aa,this.j)};f.S=function(b,a){return gd(a,this)};
mh.prototype[Pa]=function(){return Mc(this)};var Yg=function Yg(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Yg.c(arguments[0]);case 4:return Yg.w(arguments[0],arguments[1],arguments[2],arguments[3]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};Yg.c=function(b){return Yg.w(null,b,0,null)};
Yg.w=function(b,a,c,d){if(null==d)for(d=a.length;;)if(c<d){var e=a[c];if(p(e)&&(e=e.Dc(),p(e)))return new mh(b,a,c+1,e,null);c+=1}else return null;else return new mh(b,a,c,d,null)};Yg.A=4;Vg;function nh(b,a,c){this.Na=b;this.Pd=a;this.qd=c}nh.prototype.ta=function(){return this.qd&&this.Pd.ta()};nh.prototype.next=function(){if(this.qd)return this.Pd.next();this.qd=!0;return this.Na};nh.prototype.remove=function(){return Error("Unsupported operation")};
function vd(b,a,c,d,e,g){this.D=b;this.u=a;this.root=c;this.Ma=d;this.Na=e;this.j=g;this.m=16123663;this.F=8196}f=vd.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.keys=function(){return Mc(Pg.c?Pg.c(this):Pg.call(null,this))};f.entries=function(){return Kg(F(this))};f.values=function(){return Mc(Qg.c?Qg.c(this):Qg.call(null,this))};f.has=function(b){return Rd(this,b)};f.get=function(b,a){return this.H(null,b,a)};
f.forEach=function(b){for(var a=F(this),c=null,d=0,e=0;;)if(e<d){var g=c.da(null,e),h=M(g,0),g=M(g,1);b.b?b.b(g,h):b.call(null,g,h);e+=1}else if(a=F(a))Kd(a)?(c=dc(a),a=ec(a),h=c,d=L(c),c=h):(c=G(a),h=M(c,0),g=M(c,1),b.b?b.b(g,h):b.call(null,g,h),a=H(a),c=null,d=0),e=0;else return null};f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){return null==a?this.Ma?this.Na:c:null==this.root?c:this.root.Mb(0,Bc(a),a,c)};
f.hc=function(b,a,c){b=this.Ma?a.f?a.f(c,null,this.Na):a.call(null,c,null,this.Na):c;return $c(b)?I.c?I.c(b):I.call(null,b):null!=this.root?this.root.Zb(a,b):b};f.V=function(){var b=this.root?mc(this.root):bf;return this.Ma?new nh(this.Na,b,!1):b};f.O=function(){return this.D};f.T=function(){return this.u};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Sc(this)};f.B=function(b,a){return Fg(this,a)};f.gc=function(){return new Vg({},this.root,this.u,this.Ma,this.Na)};
f.ha=function(){return Eb(Sg,this.D)};f.Y=function(b,a){if(null==a)return this.Ma?new vd(this.D,this.u-1,this.root,!1,null,null):this;if(null==this.root)return this;var c=this.root.Ec(0,Bc(a),a);return c===this.root?this:new vd(this.D,this.u-1,c,this.Ma,this.Na,null)};
f.U=function(b,a,c){if(null==a)return this.Ma&&c===this.Na?this:new vd(this.D,this.Ma?this.u:this.u+1,this.root,!0,c,null);b=new Wg;a=(null==this.root?hh:this.root).lb(0,Bc(a),a,c,b);return a===this.root?this:new vd(this.D,b.L?this.u+1:this.u,a,this.Ma,this.Na,null)};f.Sb=function(b,a){return null==a?this.Ma:null==this.root?!1:this.root.Mb(0,Bc(a),a,Nd)!==Nd};f.N=function(){if(0<this.u){var b=null!=this.root?this.root.Dc():null;return this.Ma?gd(new U(null,2,5,W,[null,this.Na],null),b):b}return null};
f.P=function(b,a){return new vd(a,this.u,this.root,this.Ma,this.Na,this.j)};f.S=function(b,a){if(Hd(a))return ib(this,y.b(a,0),y.b(a,1));for(var c=this,d=F(a);;){if(null==d)return c;var e=G(d);if(Hd(e))c=ib(c,y.b(e,0),y.b(e,1)),d=H(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.I(null,b);case 3:return this.H(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.I(null,b)};b.f=function(a,b,d){return this.H(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.c=function(b){return this.I(null,b)};f.b=function(b,a){return this.H(null,b,a)};var Sg=new vd(null,0,null,!1,null,Tc);
function wd(b,a){for(var c=b.length,d=0,e=Vb(Sg);;)if(d<c)var g=d+1,e=e.wc(null,b[d],a[d]),d=g;else return Xb(e)}vd.prototype[Pa]=function(){return Mc(this)};function Vg(b,a,c,d,e){this.ia=b;this.root=a;this.count=c;this.Ma=d;this.Na=e;this.m=258;this.F=56}
function oh(b,a,c){if(b.ia){if(null==a)b.Na!==c&&(b.Na=c),b.Ma||(b.count+=1,b.Ma=!0);else{var d=new Wg;a=(null==b.root?hh:b.root).mb(b.ia,0,Bc(a),a,c,d);a!==b.root&&(b.root=a);d.L&&(b.count+=1)}return b}throw Error("assoc! after persistent!");}f=Vg.prototype;f.T=function(){if(this.ia)return this.count;throw Error("count after persistent!");};f.I=function(b,a){return null==a?this.Ma?this.Na:null:null==this.root?null:this.root.Mb(0,Bc(a),a)};
f.H=function(b,a,c){return null==a?this.Ma?this.Na:c:null==this.root?c:this.root.Mb(0,Bc(a),a,c)};f.Ub=function(b,a){var c;a:if(this.ia)if(null!=a?a.m&2048||a.Vd||(a.m?0:La(lb,a)):La(lb,a))c=oh(this,ye.c?ye.c(a):ye.call(null,a),ze.c?ze.c(a):ze.call(null,a));else{c=F(a);for(var d=this;;){var e=G(c);if(p(e))c=H(c),d=oh(d,ye.c?ye.c(e):ye.call(null,e),ze.c?ze.c(e):ze.call(null,e));else{c=d;break a}}}else throw Error("conj! after persistent");return c};
f.ic=function(){var b;if(this.ia)this.ia=null,b=new vd(null,this.count,this.root,this.Ma,this.Na,null);else throw Error("persistent! called twice");return b};f.wc=function(b,a,c){return oh(this,a,c)};function ph(b,a,c){for(var d=a;;)if(null!=b)a=c?b.left:b.right,d=qd.b(d,b),b=a;else return d}function qh(b,a,c,d,e){this.D=b;this.stack=a;this.Jc=c;this.u=d;this.j=e;this.m=32374862;this.F=0}f=qh.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.O=function(){return this.D};
f.T=function(){return 0>this.u?L(H(this))+1:this.u};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Qc(this)};f.B=function(b,a){return Vc(this,a)};f.ha=function(){return Wc(Jc,this.D)};f.oa=function(b,a){return md.b(a,this)};f.pa=function(b,a,c){return md.f(a,c,this)};f.ja=function(){var b=this.stack;return null==b?null:sb(b)};f.ra=function(){var b=G(this.stack),b=ph(this.Jc?b.right:b.left,H(this.stack),this.Jc);return null!=b?new qh(null,b,this.Jc,this.u-1,null):Jc};f.N=function(){return this};
f.P=function(b,a){return new qh(a,this.stack,this.Jc,this.u,this.j)};f.S=function(b,a){return gd(a,this)};qh.prototype[Pa]=function(){return Mc(this)};function rh(b,a,c){return new qh(null,ph(b,null,a),a,c,null)}sh;th;
function uh(b,a,c,d){return c instanceof sh?c.left instanceof sh?new sh(c.key,c.L,c.left.zb(),new th(b,a,c.right,d,null),null):c.right instanceof sh?new sh(c.right.key,c.right.L,new th(c.key,c.L,c.left,c.right.left,null),new th(b,a,c.right.right,d,null),null):new th(b,a,c,d,null):new th(b,a,c,d,null)}
function vh(b,a,c,d){return d instanceof sh?d.right instanceof sh?new sh(d.key,d.L,new th(b,a,c,d.left,null),d.right.zb(),null):d.left instanceof sh?new sh(d.left.key,d.left.L,new th(b,a,c,d.left.left,null),new th(d.key,d.L,d.left.right,d.right,null),null):new th(b,a,c,d,null):new th(b,a,c,d,null)}
function wh(b,a,c,d){if(c instanceof sh)return new sh(b,a,c.zb(),d,null);if(d instanceof th)return vh(b,a,c,d.Hc());if(d instanceof sh&&d.left instanceof th)return new sh(d.left.key,d.left.L,new th(b,a,c,d.left.left,null),vh(d.key,d.L,d.left.right,d.right.Hc()),null);throw Error("red-black tree invariant violation");}
var xh=function xh(a,c,d){d=null!=a.left?xh(a.left,c,d):d;if($c(d))return I.c?I.c(d):I.call(null,d);var e=a.key,g=a.L;d=c.f?c.f(d,e,g):c.call(null,d,e,g);if($c(d))return I.c?I.c(d):I.call(null,d);a=null!=a.right?xh(a.right,c,d):d;return $c(a)?I.c?I.c(a):I.call(null,a):a};function th(b,a,c,d,e){this.key=b;this.L=a;this.left=c;this.right=d;this.j=e;this.m=32402207;this.F=0}f=th.prototype;f.td=function(b){return b.vd(this)};f.Hc=function(){return new sh(this.key,this.L,this.left,this.right,null)};
f.zb=function(){return this};f.sd=function(b){return b.ud(this)};f.replace=function(b,a,c,d){return new th(b,a,c,d,null)};f.ud=function(b){return new th(b.key,b.L,this,b.right,null)};f.vd=function(b){return new th(b.key,b.L,b.left,this,null)};f.Zb=function(b,a){return xh(this,b,a)};f.I=function(b,a){return y.f(this,a,null)};f.H=function(b,a,c){return y.f(this,a,c)};f.da=function(b,a){return 0===a?this.key:1===a?this.L:null};f.Pa=function(b,a,c){return 0===a?this.key:1===a?this.L:c};
f.Vb=function(b,a,c){return(new U(null,2,5,W,[this.key,this.L],null)).Vb(null,a,c)};f.O=function(){return null};f.T=function(){return 2};f.sc=function(){return this.key};f.tc=function(){return this.L};f.Ib=function(){return this.L};f.Jb=function(){return new U(null,1,5,W,[this.key],null)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Qc(this)};f.B=function(b,a){return Vc(this,a)};f.ha=function(){return rd};f.oa=function(b,a){return ad(this,a)};f.pa=function(b,a,c){return bd(this,a,c)};
f.U=function(b,a,c){return N.f(new U(null,2,5,W,[this.key,this.L],null),a,c)};f.N=function(){return Za(Za(Jc,this.L),this.key)};f.P=function(b,a){return Wc(new U(null,2,5,W,[this.key,this.L],null),a)};f.S=function(b,a){return new U(null,3,5,W,[this.key,this.L,a],null)};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.I(null,b);case 3:return this.H(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.I(null,b)};b.f=function(a,b,d){return this.H(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.c=function(b){return this.I(null,b)};f.b=function(b,a){return this.H(null,b,a)};th.prototype[Pa]=function(){return Mc(this)};
function sh(b,a,c,d,e){this.key=b;this.L=a;this.left=c;this.right=d;this.j=e;this.m=32402207;this.F=0}f=sh.prototype;f.td=function(b){return new sh(this.key,this.L,this.left,b,null)};f.Hc=function(){throw Error("red-black tree invariant violation");};f.zb=function(){return new th(this.key,this.L,this.left,this.right,null)};f.sd=function(b){return new sh(this.key,this.L,b,this.right,null)};f.replace=function(b,a,c,d){return new sh(b,a,c,d,null)};
f.ud=function(b){return this.left instanceof sh?new sh(this.key,this.L,this.left.zb(),new th(b.key,b.L,this.right,b.right,null),null):this.right instanceof sh?new sh(this.right.key,this.right.L,new th(this.key,this.L,this.left,this.right.left,null),new th(b.key,b.L,this.right.right,b.right,null),null):new th(b.key,b.L,this,b.right,null)};
f.vd=function(b){return this.right instanceof sh?new sh(this.key,this.L,new th(b.key,b.L,b.left,this.left,null),this.right.zb(),null):this.left instanceof sh?new sh(this.left.key,this.left.L,new th(b.key,b.L,b.left,this.left.left,null),new th(this.key,this.L,this.left.right,this.right,null),null):new th(b.key,b.L,b.left,this,null)};f.Zb=function(b,a){return xh(this,b,a)};f.I=function(b,a){return y.f(this,a,null)};f.H=function(b,a,c){return y.f(this,a,c)};
f.da=function(b,a){return 0===a?this.key:1===a?this.L:null};f.Pa=function(b,a,c){return 0===a?this.key:1===a?this.L:c};f.Vb=function(b,a,c){return(new U(null,2,5,W,[this.key,this.L],null)).Vb(null,a,c)};f.O=function(){return null};f.T=function(){return 2};f.sc=function(){return this.key};f.tc=function(){return this.L};f.Ib=function(){return this.L};f.Jb=function(){return new U(null,1,5,W,[this.key],null)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Qc(this)};
f.B=function(b,a){return Vc(this,a)};f.ha=function(){return rd};f.oa=function(b,a){return ad(this,a)};f.pa=function(b,a,c){return bd(this,a,c)};f.U=function(b,a,c){return N.f(new U(null,2,5,W,[this.key,this.L],null),a,c)};f.N=function(){return Za(Za(Jc,this.L),this.key)};f.P=function(b,a){return Wc(new U(null,2,5,W,[this.key,this.L],null),a)};f.S=function(b,a){return new U(null,3,5,W,[this.key,this.L,a],null)};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.I(null,b);case 3:return this.H(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.I(null,b)};b.f=function(a,b,d){return this.H(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.c=function(b){return this.I(null,b)};f.b=function(b,a){return this.H(null,b,a)};sh.prototype[Pa]=function(){return Mc(this)};
var yh=function yh(a,c,d,e,g){if(null==c)return new sh(d,e,null,null,null);var h;h=c.key;h=a.b?a.b(d,h):a.call(null,d,h);if(0===h)return g[0]=c,null;if(0>h)return a=yh(a,c.left,d,e,g),null!=a?c.sd(a):null;a=yh(a,c.right,d,e,g);return null!=a?c.td(a):null},zh=function zh(a,c){if(null==a)return c;if(null==c)return a;if(a instanceof sh){if(c instanceof sh){var d=zh(a.right,c.left);return d instanceof sh?new sh(d.key,d.L,new sh(a.key,a.L,a.left,d.left,null),new sh(c.key,c.L,d.right,c.right,null),null):
new sh(a.key,a.L,a.left,new sh(c.key,c.L,d,c.right,null),null)}return new sh(a.key,a.L,a.left,zh(a.right,c),null)}if(c instanceof sh)return new sh(c.key,c.L,zh(a,c.left),c.right,null);d=zh(a.right,c.left);return d instanceof sh?new sh(d.key,d.L,new th(a.key,a.L,a.left,d.left,null),new th(c.key,c.L,d.right,c.right,null),null):wh(a.key,a.L,a.left,new th(c.key,c.L,d,c.right,null))},Ah=function Ah(a,c,d,e){if(null!=c){var g;g=c.key;g=a.b?a.b(d,g):a.call(null,d,g);if(0===g)return e[0]=c,zh(c.left,c.right);
if(0>g)return a=Ah(a,c.left,d,e),null!=a||null!=e[0]?c.left instanceof th?wh(c.key,c.L,a,c.right):new sh(c.key,c.L,a,c.right,null):null;a=Ah(a,c.right,d,e);if(null!=a||null!=e[0])if(c.right instanceof th)if(e=c.key,d=c.L,c=c.left,a instanceof sh)c=new sh(e,d,c,a.zb(),null);else if(c instanceof th)c=uh(e,d,c.Hc(),a);else if(c instanceof sh&&c.right instanceof th)c=new sh(c.right.key,c.right.L,uh(c.key,c.L,c.left.Hc(),c.right.left),new th(e,d,c.right.right,a,null),null);else throw Error("red-black tree invariant violation");
else c=new sh(c.key,c.L,c.left,a,null);else c=null;return c}return null},Bh=function Bh(a,c,d,e){var g=c.key,h=a.b?a.b(d,g):a.call(null,d,g);return 0===h?c.replace(g,e,c.left,c.right):0>h?c.replace(g,c.L,Bh(a,c.left,d,e),c.right):c.replace(g,c.L,c.left,Bh(a,c.right,d,e))};ye;function Ch(b,a,c,d,e){this.cb=b;this.Gb=a;this.u=c;this.D=d;this.j=e;this.m=418776847;this.F=8192}f=Ch.prototype;
f.forEach=function(b){for(var a=F(this),c=null,d=0,e=0;;)if(e<d){var g=c.da(null,e),h=M(g,0),g=M(g,1);b.b?b.b(g,h):b.call(null,g,h);e+=1}else if(a=F(a))Kd(a)?(c=dc(a),a=ec(a),h=c,d=L(c),c=h):(c=G(a),h=M(c,0),g=M(c,1),b.b?b.b(g,h):b.call(null,g,h),a=H(a),c=null,d=0),e=0;else return null};f.get=function(b,a){return this.H(null,b,a)};f.entries=function(){return Kg(F(this))};f.toString=function(){return oc(this)};f.keys=function(){return Mc(Pg.c?Pg.c(this):Pg.call(null,this))};
f.values=function(){return Mc(Qg.c?Qg.c(this):Qg.call(null,this))};f.equiv=function(b){return this.B(null,b)};function Dh(b,a){for(var c=b.Gb;;)if(null!=c){var d;d=c.key;d=b.cb.b?b.cb.b(a,d):b.cb.call(null,a,d);if(0===d)return c;c=0>d?c.left:c.right}else return null}f.has=function(b){return Rd(this,b)};f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){b=Dh(this,a);return null!=b?b.L:c};f.hc=function(b,a,c){return null!=this.Gb?xh(this.Gb,a,c):c};f.O=function(){return this.D};f.T=function(){return this.u};
f.Bb=function(){return 0<this.u?rh(this.Gb,!1,this.u):null};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Sc(this)};f.B=function(b,a){return Fg(this,a)};f.ha=function(){return new Ch(this.cb,null,0,this.D,0)};f.Y=function(b,a){var c=[null],d=Ah(this.cb,this.Gb,a,c);return null==d?null==ud(c,0)?this:new Ch(this.cb,null,0,this.D,null):new Ch(this.cb,d.zb(),this.u-1,this.D,null)};
f.U=function(b,a,c){b=[null];var d=yh(this.cb,this.Gb,a,c,b);return null==d?(b=ud(b,0),B.b(c,b.L)?this:new Ch(this.cb,Bh(this.cb,this.Gb,a,c),this.u,this.D,null)):new Ch(this.cb,d.zb(),this.u+1,this.D,null)};f.Sb=function(b,a){return null!=Dh(this,a)};f.N=function(){return 0<this.u?rh(this.Gb,!0,this.u):null};f.P=function(b,a){return new Ch(this.cb,this.Gb,this.u,a,this.j)};
f.S=function(b,a){if(Hd(a))return ib(this,y.b(a,0),y.b(a,1));for(var c=this,d=F(a);;){if(null==d)return c;var e=G(d);if(Hd(e))c=ib(c,y.b(e,0),y.b(e,1)),d=H(d);else throw Error("conj on a map takes map entries or seqables of map entries");}};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.I(null,b);case 3:return this.H(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.I(null,b)};b.f=function(a,b,d){return this.H(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.c=function(b){return this.I(null,b)};f.b=function(b,a){return this.H(null,b,a)};var Eh=new Ch(wc,null,0,null,Tc);Ch.prototype[Pa]=function(){return Mc(this)};
var Uc=function Uc(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Uc.h(0<c.length?new Hc(c.slice(0),0):null)};Uc.h=function(b){b=F(b);for(var a=Vb(Sg);;)if(b){var c=H(H(b)),a=Ye.f(a,G(b),nd(b));b=c}else return Xb(a)};Uc.A=0;Uc.K=function(b){return Uc.h(F(b))};function Fh(b,a){this.ba=b;this.Ra=a;this.m=32374988;this.F=0}f=Fh.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.O=function(){return this.Ra};
f.wa=function(){var b=(null!=this.ba?this.ba.m&128||this.ba.Oc||(this.ba.m?0:La(eb,this.ba)):La(eb,this.ba))?this.ba.wa(null):H(this.ba);return null==b?null:new Fh(b,this.Ra)};f.M=function(){return Qc(this)};f.B=function(b,a){return Vc(this,a)};f.ha=function(){return Wc(Jc,this.Ra)};f.oa=function(b,a){return md.b(a,this)};f.pa=function(b,a,c){return md.f(a,c,this)};f.ja=function(){return this.ba.ja(null).sc(null)};
f.ra=function(){var b=(null!=this.ba?this.ba.m&128||this.ba.Oc||(this.ba.m?0:La(eb,this.ba)):La(eb,this.ba))?this.ba.wa(null):H(this.ba);return null!=b?new Fh(b,this.Ra):Jc};f.N=function(){return this};f.P=function(b,a){return new Fh(this.ba,a)};f.S=function(b,a){return gd(a,this)};Fh.prototype[Pa]=function(){return Mc(this)};function Pg(b){return(b=F(b))?new Fh(b,null):null}function ye(b){return mb(b)}function Gh(b,a){this.ba=b;this.Ra=a;this.m=32374988;this.F=0}f=Gh.prototype;f.toString=function(){return oc(this)};
f.equiv=function(b){return this.B(null,b)};f.O=function(){return this.Ra};f.wa=function(){var b=(null!=this.ba?this.ba.m&128||this.ba.Oc||(this.ba.m?0:La(eb,this.ba)):La(eb,this.ba))?this.ba.wa(null):H(this.ba);return null==b?null:new Gh(b,this.Ra)};f.M=function(){return Qc(this)};f.B=function(b,a){return Vc(this,a)};f.ha=function(){return Wc(Jc,this.Ra)};f.oa=function(b,a){return md.b(a,this)};f.pa=function(b,a,c){return md.f(a,c,this)};f.ja=function(){return this.ba.ja(null).tc(null)};
f.ra=function(){var b=(null!=this.ba?this.ba.m&128||this.ba.Oc||(this.ba.m?0:La(eb,this.ba)):La(eb,this.ba))?this.ba.wa(null):H(this.ba);return null!=b?new Gh(b,this.Ra):Jc};f.N=function(){return this};f.P=function(b,a){return new Gh(this.ba,a)};f.S=function(b,a){return gd(a,this)};Gh.prototype[Pa]=function(){return Mc(this)};function Qg(b){return(b=F(b))?new Gh(b,null):null}function ze(b){return nb(b)}
var Hh=function Hh(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Hh.h(0<c.length?new Hc(c.slice(0),0):null)};Hh.h=function(b){return p(hf(be,b))?w.b(function(a,b){return qd.b(p(a)?a:Q,b)},b):null};Hh.A=0;Hh.K=function(b){return Hh.h(F(b))};function Ih(b,a){for(var c=Q,d=F(a);;)if(d)var e=G(d),g=C.f(b,e,Jh),c=$e.b(g,Jh)?N.f(c,e,g):c,d=H(d);else return Wc(c,yd(b))}Kh;function Lh(b){this.lc=b}Lh.prototype.ta=function(){return this.lc.ta()};
Lh.prototype.next=function(){if(this.lc.ta())return this.lc.next().ea[0];throw Error("No such element");};Lh.prototype.remove=function(){return Error("Unsupported operation")};function Ud(b,a,c){this.D=b;this.Lb=a;this.j=c;this.m=15077647;this.F=8196}f=Ud.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};f.keys=function(){return Mc(F(this))};f.entries=function(){var b=F(this);return new Lg(F(b))};f.values=function(){return Mc(F(this))};
f.has=function(b){return Rd(this,b)};f.forEach=function(b){for(var a=F(this),c=null,d=0,e=0;;)if(e<d){var g=c.da(null,e),h=M(g,0),g=M(g,1);b.b?b.b(g,h):b.call(null,g,h);e+=1}else if(a=F(a))Kd(a)?(c=dc(a),a=ec(a),h=c,d=L(c),c=h):(c=G(a),h=M(c,0),g=M(c,1),b.b?b.b(g,h):b.call(null,g,h),a=H(a),c=null,d=0),e=0;else return null};f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){return hb(this.Lb,a)?a:c};f.V=function(){return new Lh(mc(this.Lb))};f.O=function(){return this.D};f.T=function(){return Wa(this.Lb)};
f.M=function(){var b=this.j;return null!=b?b:this.j=b=Sc(this)};f.B=function(b,a){return Cd(a)&&L(this)===L(a)&&gf(function(a){return function(b){return Rd(a,b)}}(this),a)};f.gc=function(){return new Kh(Vb(this.Lb))};f.ha=function(){return Wc(Vd,this.D)};f.$c=function(b,a){return new Ud(this.D,kb(this.Lb,a),null)};f.N=function(){return Pg(this.Lb)};f.P=function(b,a){return new Ud(a,this.Lb,this.j)};f.S=function(b,a){return new Ud(this.D,N.f(this.Lb,a,null),null)};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.I(null,b);case 3:return this.H(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.I(null,b)};b.f=function(a,b,d){return this.H(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.c=function(b){return this.I(null,b)};f.b=function(b,a){return this.H(null,b,a)};var Vd=new Ud(null,Q,Tc);Ud.prototype[Pa]=function(){return Mc(this)};
function Kh(b){this.Fb=b;this.F=136;this.m=259}f=Kh.prototype;f.Ub=function(b,a){this.Fb=Ye.f(this.Fb,a,null);return this};f.ic=function(){return new Ud(null,Xb(this.Fb),null)};f.T=function(){return L(this.Fb)};f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){return gb.f(this.Fb,a,Nd)===Nd?c:a};
f.call=function(){function b(a,b,c){return gb.f(this.Fb,b,Nd)===Nd?c:b}function a(a,b){return gb.f(this.Fb,b,Nd)===Nd?null:b}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return a.call(this,c,e);case 3:return b.call(this,c,e,g)}throw Error("Invalid arity: "+arguments.length);};c.b=a;c.f=b;return c}();f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.c=function(b){return gb.f(this.Fb,b,Nd)===Nd?null:b};f.b=function(b,a){return gb.f(this.Fb,b,Nd)===Nd?a:b};
function Mh(b){b=F(b);if(null==b)return Vd;if(b instanceof Hc&&0===b.G){b=b.l;a:for(var a=0,c=Vb(Vd);;)if(a<b.length)var d=a+1,c=c.Ub(null,b[a]),a=d;else break a;return c.ic(null)}for(d=Vb(Vd);;)if(null!=b)a=H(b),d=d.Ub(null,b.ja(null)),b=a;else return Xb(d)}var Nh=function Nh(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Nh.C();case 1:return Nh.c(arguments[0]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};
Nh.C=function(){return function(b){return function(a){return function(){function c(c,d){if(Rd(I.c?I.c(a):I.call(null,a),d))return c;lc(a,qd.b(Ab(a),d));return b.b?b.b(c,d):b.call(null,c,d)}function d(a){return b.c?b.c(a):b.call(null,a)}function e(){return b.C?b.C():b.call(null)}var g=null,g=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};g.C=e;g.c=d;g.b=c;return g}()}(qf(Vd))}};
Nh.c=function(b){return function c(b,e){return new Ke(null,function(){return function(b,d){for(;;){var e=b,m=M(e,0);if(e=F(e))if(Rd(d,m))m=Ic(e),e=d,b=m,d=e;else return gd(m,c(Ic(e),qd.b(d,m)));else return null}}.call(null,b,e)},null,null)}(b,Vd)};Nh.A=1;function Oh(b){for(var a=rd;;)if(H(b))a=qd.b(a,G(b)),b=H(b);else return F(a)}function xe(b){if(null!=b&&(b.F&4096||b.Xd))return b.uc(null);if("string"===typeof b)return b;throw Error([r("Doesn't support name: "),r(b)].join(""));}
function Ph(b,a){for(var c=Vb(Q),d=F(b),e=F(a);;)if(d&&e)c=Ye.f(c,G(d),G(e)),d=H(d),e=H(e);else return Xb(c)}var Qh=function Qh(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Qh.b(arguments[0],arguments[1]);case 3:return Qh.f(arguments[0],arguments[1],arguments[2]);default:return Qh.h(arguments[0],arguments[1],arguments[2],new Hc(c.slice(3),0))}};Qh.b=function(b,a){return a};
Qh.f=function(b,a,c){return(b.c?b.c(a):b.call(null,a))>(b.c?b.c(c):b.call(null,c))?a:c};Qh.h=function(b,a,c,d){return w.f(function(a,c){return Qh.f(b,a,c)},Qh.f(b,a,c),d)};Qh.K=function(b){var a=G(b),c=H(b);b=G(c);var d=H(c),c=G(d),d=H(d);return Qh.h(a,b,c,d)};Qh.A=3;function Rh(b,a){return new Ke(null,function(){var c=F(a);if(c){var d;d=G(c);d=b.c?b.c(d):b.call(null,d);c=p(d)?gd(G(c),Rh(b,Ic(c))):null}else c=null;return c},null,null)}function Sh(b,a,c){this.G=b;this.end=a;this.step=c}
Sh.prototype.ta=function(){return 0<this.step?this.G<this.end:this.G>this.end};Sh.prototype.next=function(){var b=this.G;this.G+=this.step;return b};function Th(b,a,c,d,e){this.D=b;this.start=a;this.end=c;this.step=d;this.j=e;this.m=32375006;this.F=8192}f=Th.prototype;f.toString=function(){return oc(this)};f.equiv=function(b){return this.B(null,b)};
f.da=function(b,a){if(a<Wa(this))return this.start+a*this.step;if(this.start>this.end&&0===this.step)return this.start;throw Error("Index out of bounds");};f.Pa=function(b,a,c){return a<Wa(this)?this.start+a*this.step:this.start>this.end&&0===this.step?this.start:c};f.V=function(){return new Sh(this.start,this.end,this.step)};f.O=function(){return this.D};
f.wa=function(){return 0<this.step?this.start+this.step<this.end?new Th(this.D,this.start+this.step,this.end,this.step,null):null:this.start+this.step>this.end?new Th(this.D,this.start+this.step,this.end,this.step,null):null};f.T=function(){return Ka(Lb(this))?0:Math.ceil((this.end-this.start)/this.step)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Qc(this)};f.B=function(b,a){return Vc(this,a)};f.ha=function(){return Wc(Jc,this.D)};f.oa=function(b,a){return ad(this,a)};
f.pa=function(b,a,c){for(b=this.start;;)if(0<this.step?b<this.end:b>this.end){c=a.b?a.b(c,b):a.call(null,c,b);if($c(c))return I.c?I.c(c):I.call(null,c);b+=this.step}else return c};f.ja=function(){return null==Lb(this)?null:this.start};f.ra=function(){return null!=Lb(this)?new Th(this.D,this.start+this.step,this.end,this.step,null):Jc};f.N=function(){return 0<this.step?this.start<this.end?this:null:0>this.step?this.start>this.end?this:null:this.start===this.end?null:this};
f.P=function(b,a){return new Th(a,this.start,this.end,this.step,this.j)};f.S=function(b,a){return gd(a,this)};Th.prototype[Pa]=function(){return Mc(this)};var Uh=function Uh(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Uh.C();case 1:return Uh.c(arguments[0]);case 2:return Uh.b(arguments[0],arguments[1]);case 3:return Uh.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};
Uh.C=function(){return Uh.f(0,Number.MAX_VALUE,1)};Uh.c=function(b){return Uh.f(0,b,1)};Uh.b=function(b,a){return Uh.f(b,a,1)};Uh.f=function(b,a,c){return new Th(null,b,a,c,null)};Uh.A=3;function Vh(b,a){return new U(null,2,5,W,[Rh(b,a),If(b,a)],null)}
function Wh(b,a){return new Ke(null,function(){var c=F(a);if(c){var d=G(c),e=b.c?b.c(d):b.call(null,d),d=gd(d,Rh(function(a,c){return function(a){return B.b(c,b.c?b.c(a):b.call(null,a))}}(d,e,c,c),H(c)));return gd(d,Wh(b,F(Hf(L(d),c))))}return null},null,null)}function Xh(b){a:for(var a=b;;)if(F(a))a=H(a);else break a;return b}function Yh(b,a){if("string"===typeof a){var c=b.exec(a);return B.b(G(c),a)?1===L(c)?G(c):$d(c):null}throw new TypeError("re-matches must match against a string.");}
function Zh(b,a){if("string"===typeof a){var c=b.exec(a);return null==c?null:1===L(c)?G(c):$d(c)}throw new TypeError("re-find must match against a string.");}function $h(b){if(b instanceof RegExp)return b;var a=Zh(/^\(\?([idmsux]*)\)/,b),c=M(a,0),a=M(a,1);b=we.b(b,L(c));return new RegExp(b,p(a)?a:"")}
function Y(b,a,c,d,e,g,h){var k=ua;ua=null==ua?null:ua-1;try{if(null!=ua&&0>ua)return Rb(b,"#");Rb(b,c);if(0===Da.c(g))F(h)&&Rb(b,function(){var a=ai.c(g);return p(a)?a:"..."}());else{if(F(h)){var m=G(h);a.f?a.f(m,b,g):a.call(null,m,b,g)}for(var n=H(h),t=Da.c(g)-1;;)if(!n||null!=t&&0===t){F(n)&&0===t&&(Rb(b,d),Rb(b,function(){var a=ai.c(g);return p(a)?a:"..."}()));break}else{Rb(b,d);var u=G(n);c=b;h=g;a.f?a.f(u,c,h):a.call(null,u,c,h);var v=H(n);c=t-1;n=v;t=c}}return Rb(b,e)}finally{ua=k}}
function bi(b,a){for(var c=F(a),d=null,e=0,g=0;;)if(g<e){var h=d.da(null,g);Rb(b,h);g+=1}else if(c=F(c))d=c,Kd(d)?(c=dc(d),e=ec(d),d=c,h=L(c),c=e,e=h):(h=G(d),Rb(b,h),c=H(d),d=null,e=0),g=0;else return null}var ci={'"':'\\"',"\\":"\\\\","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t"};function ei(b){return[r('"'),r(b.replace(RegExp('[\\\\"\b\f\n\r\t]',"g"),function(a){return ci[a]})),r('"')].join("")}fi;
function gi(b,a){var c=Qd(C.b(b,Ba));return c?(c=null!=a?a.m&131072||a.Wd?!0:!1:!1)?null!=yd(a):c:c}
function hi(b,a,c){if(null==b)return Rb(a,"nil");if(gi(c,b)){Rb(a,"^");var d=yd(b);qg.f?qg.f(d,a,c):qg.call(null,d,a,c);Rb(a," ")}if(b.xc)return b.Qc(b,a,c);if(null!=b&&(b.m&2147483648||b.fa))return b.J(null,a,c);if(!0===b||!1===b||"number"===typeof b)return Rb(a,""+r(b));if(null!=b&&b.constructor===Object)return Rb(a,"#js "),d=R.b(function(a){return new U(null,2,5,W,[Je.c(a),b[a]],null)},Ld(b)),fi.w?fi.w(d,qg,a,c):fi.call(null,d,qg,a,c);if(Ia(b))return Y(a,qg,"#js ["," ","]",c,b);if("string"==typeof b)return p(Aa.c(c))?
Rb(a,ei(b)):Rb(a,b);if("function"==ba(b)){var e=b.name;c=p(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Function":e;return bi(a,E(["#object[",c,' "',""+r(b),'"]'],0))}if(b instanceof Date)return c=function(a,b){for(var c=""+r(a);;)if(L(c)<b)c=[r("0"),r(c)].join("");else return c},bi(a,E(['#inst "',""+r(b.getUTCFullYear()),"-",c(b.getUTCMonth()+1,2),"-",c(b.getUTCDate(),2),"T",c(b.getUTCHours(),2),":",c(b.getUTCMinutes(),2),":",c(b.getUTCSeconds(),2),".",c(b.getUTCMilliseconds(),
3),"-",'00:00"'],0));if(b instanceof RegExp)return bi(a,E(['#"',b.source,'"'],0));if(null!=b&&(b.m&2147483648||b.fa))return Sb(b,a,c);if(p(b.constructor.Wb))return bi(a,E(["#object[",b.constructor.Wb.replace(RegExp("/","g"),"."),"]"],0));e=b.constructor.name;c=p(function(){var a=null==e;return a?a:/^[\s\xa0]*$/.test(e)}())?"Object":e;return bi(a,E(["#object[",c," ",""+r(b),"]"],0))}function qg(b,a,c){var d=ii.c(c);return p(d)?(c=N.f(c,ji,hi),d.f?d.f(b,a,c):d.call(null,b,a,c)):hi(b,a,c)}
function ki(b,a){var c=new ka;a:{var d=new nc(c);qg(G(b),d,a);for(var e=F(H(b)),g=null,h=0,k=0;;)if(k<h){var m=g.da(null,k);Rb(d," ");qg(m,d,a);k+=1}else if(e=F(e))g=e,Kd(g)?(e=dc(g),h=ec(g),g=e,m=L(e),e=h,h=m):(m=G(g),Rb(d," "),qg(m,d,a),e=H(g),g=null,h=0),k=0;else break a}return c}function li(b,a){return Ad(b)?"":""+r(ki(b,a))}function mi(b,a){if(Ad(b))return"\n";var c=ki(b,a);c.append("\n");return""+r(c)}
var X=function X(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return X.h(0<c.length?new Hc(c.slice(0),0):null)};X.h=function(b){return li(b,ya())};X.A=0;X.K=function(b){return X.h(F(b))};var ni=function ni(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return ni.h(0<c.length?new Hc(c.slice(0),0):null)};ni.h=function(b){return mi(b,ya())};ni.A=0;ni.K=function(b){return ni.h(F(b))};
var oi=function oi(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return oi.h(0<c.length?new Hc(c.slice(0),0):null)};oi.h=function(b){return li(b,N.f(ya(),Aa,!1))};oi.A=0;oi.K=function(b){return oi.h(F(b))};var pi=function pi(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return pi.h(0<c.length?new Hc(c.slice(0),0):null)};pi.h=function(b){return mi(b,N.f(ya(),Aa,!1))};pi.A=0;pi.K=function(b){return pi.h(F(b))};
function fi(b,a,c,d){return Y(c,function(b,c,d){var k=mb(b);a.f?a.f(k,c,d):a.call(null,k,c,d);Rb(c," ");b=nb(b);return a.f?a.f(b,c,d):a.call(null,b,c,d)},"{",", ","}",d,F(b))}yf.prototype.fa=!0;yf.prototype.J=function(b,a,c){Rb(a,"#object [cljs.core.Volatile ");qg(new l(null,1,[qi,this.state],null),a,c);return Rb(a,"]")};Hc.prototype.fa=!0;Hc.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};Ke.prototype.fa=!0;Ke.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};
qh.prototype.fa=!0;qh.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};lh.prototype.fa=!0;lh.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};th.prototype.fa=!0;th.prototype.J=function(b,a,c){return Y(a,qg,"["," ","]",c,this)};Og.prototype.fa=!0;Og.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};Oc.prototype.fa=!0;Oc.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};Jd.prototype.fa=!0;
Jd.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};Ge.prototype.fa=!0;Ge.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};hd.prototype.fa=!0;hd.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};vd.prototype.fa=!0;vd.prototype.J=function(b,a,c){return fi(this,qg,a,c)};mh.prototype.fa=!0;mh.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};wg.prototype.fa=!0;wg.prototype.J=function(b,a,c){return Y(a,qg,"["," ","]",c,this)};Ch.prototype.fa=!0;
Ch.prototype.J=function(b,a,c){return fi(this,qg,a,c)};Ud.prototype.fa=!0;Ud.prototype.J=function(b,a,c){return Y(a,qg,"#{"," ","}",c,this)};Id.prototype.fa=!0;Id.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};rf.prototype.fa=!0;rf.prototype.J=function(b,a,c){Rb(a,"#object [cljs.core.Atom ");qg(new l(null,1,[qi,this.state],null),a,c);return Rb(a,"]")};Gh.prototype.fa=!0;Gh.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};sh.prototype.fa=!0;
sh.prototype.J=function(b,a,c){return Y(a,qg,"["," ","]",c,this)};U.prototype.fa=!0;U.prototype.J=function(b,a,c){return Y(a,qg,"["," ","]",c,this)};Ag.prototype.fa=!0;Ag.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};Ee.prototype.fa=!0;Ee.prototype.J=function(b,a){return Rb(a,"()")};ff.prototype.fa=!0;ff.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};Bg.prototype.fa=!0;Bg.prototype.J=function(b,a,c){return Y(a,qg,"#queue ["," ","]",c,F(this))};l.prototype.fa=!0;
l.prototype.J=function(b,a,c){return fi(this,qg,a,c)};Th.prototype.fa=!0;Th.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};Fh.prototype.fa=!0;Fh.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};id.prototype.fa=!0;id.prototype.J=function(b,a,c){return Y(a,qg,"("," ",")",c,this)};z.prototype.qc=!0;z.prototype.Tb=function(b,a){if(a instanceof z)return Ec(this,a);throw Error([r("Cannot compare "),r(this),r(" to "),r(a)].join(""));};q.prototype.qc=!0;
q.prototype.Tb=function(b,a){if(a instanceof q)return He(this,a);throw Error([r("Cannot compare "),r(this),r(" to "),r(a)].join(""));};wg.prototype.qc=!0;wg.prototype.Tb=function(b,a){if(Hd(a))return Wd(this,a);throw Error([r("Cannot compare "),r(this),r(" to "),r(a)].join(""));};U.prototype.qc=!0;U.prototype.Tb=function(b,a){if(Hd(a))return Wd(this,a);throw Error([r("Cannot compare "),r(this),r(" to "),r(a)].join(""));};
function ri(b){return function(a,c){var d=b.b?b.b(a,c):b.call(null,a,c);return $c(d)?Zc(d):d}}function Pf(b){return function(a){return function(){function c(b,c){return w.f(a,b,c)}function d(a){return b.c?b.c(a):b.call(null,a)}function e(){return b.C?b.C():b.call(null)}var g=null,g=function(a,b){switch(arguments.length){case 0:return e.call(this);case 1:return d.call(this,a);case 2:return c.call(this,a,b)}throw Error("Invalid arity: "+arguments.length);};g.C=e;g.c=d;g.b=c;return g}()}(ri(b))}si;
function ti(){}var ui=function ui(a){if(null!=a&&null!=a.Td)return a.Td(a);var c=ui[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=ui._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IEncodeJS.-clj-\x3ejs",a);};vi;function wi(b){return(null!=b?b.Sd||(b.Cb?0:La(ti,b)):La(ti,b))?ui(b):"string"===typeof b||"number"===typeof b||b instanceof q||b instanceof z?vi.c?vi.c(b):vi.call(null,b):X.h(E([b],0))}
var vi=function vi(a){if(null==a)return null;if(null!=a?a.Sd||(a.Cb?0:La(ti,a)):La(ti,a))return ui(a);if(a instanceof q)return xe(a);if(a instanceof z)return""+r(a);if(Ed(a)){var c={};a=F(a);for(var d=null,e=0,g=0;;)if(g<e){var h=d.da(null,g),k=M(h,0),h=M(h,1);c[wi(k)]=vi(h);g+=1}else if(a=F(a))Kd(a)?(e=dc(a),a=ec(a),d=e,e=L(e)):(e=G(a),d=M(e,0),e=M(e,1),c[wi(d)]=vi(e),a=H(a),d=null,e=0),g=0;else break;return c}if(Bd(a)){c=[];a=F(R.b(vi,a));d=null;for(g=e=0;;)if(g<e)k=d.da(null,g),c.push(k),g+=1;
else if(a=F(a))d=a,Kd(d)?(a=dc(d),g=ec(d),d=a,e=L(a),a=g):(a=G(d),c.push(a),a=H(d),d=null,e=0),g=0;else break;return c}return a},si=function si(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return si.C();case 1:return si.c(arguments[0]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};si.C=function(){return si.c(1)};si.c=function(b){return Math.random()*b};si.A=1;function xi(b){return Math.floor(Math.random()*b)}
function yi(b,a){return We(w.f(function(a,d){var e=b.c?b.c(d):b.call(null,d);return Ye.f(a,e,qd.b(C.f(a,e,rd),d))},Vb(Q),a))}var zi=null;function Ai(){if(null==zi){var b=new l(null,3,[Bi,Q,Ci,Q,Di,Q],null);zi=sf.c?sf.c(b):sf.call(null,b)}return zi}
function Ei(b,a,c){var d=B.b(a,c);if(!d&&!(d=Rd(Di.c(b).call(null,a),c))&&(d=Hd(c))&&(d=Hd(a)))if(d=L(c)===L(a))for(var d=!0,e=0;;)if(d&&e!==L(c))d=Ei(b,a.c?a.c(e):a.call(null,e),c.c?c.c(e):c.call(null,e)),e+=1;else return d;else return d;else return d}function Fi(b){var a;a=Ai();a=I.c?I.c(a):I.call(null,a);return af(C.b(Bi.c(a),b))}function Gi(b,a,c,d){xf.b(b,function(){return I.c?I.c(a):I.call(null,a)});xf.b(c,function(){return I.c?I.c(d):I.call(null,d)})}
var Hi=function Hi(a,c,d){var e=(I.c?I.c(d):I.call(null,d)).call(null,a),e=p(p(e)?e.c?e.c(c):e.call(null,c):e)?!0:null;if(p(e))return e;e=function(){for(var e=Fi(c);;)if(0<L(e))Hi(a,G(e),d),e=Ic(e);else return null}();if(p(e))return e;e=function(){for(var e=Fi(a);;)if(0<L(e))Hi(G(e),c,d),e=Ic(e);else return null}();return p(e)?e:!1};function Ii(b,a,c){c=Hi(b,a,c);if(p(c))b=c;else{c=Ei;var d;d=Ai();d=I.c?I.c(d):I.call(null,d);b=c(d,b,a)}return b}
var Ji=function Ji(a,c,d,e,g,h,k){var m=w.f(function(e,h){var k=M(h,0);M(h,1);if(Ei(I.c?I.c(d):I.call(null,d),c,k)){var m;m=(m=null==e)?m:Ii(k,G(e),g);m=p(m)?h:e;if(!p(Ii(G(m),k,g)))throw Error([r("Multiple methods in multimethod '"),r(a),r("' match dispatch value: "),r(c),r(" -\x3e "),r(k),r(" and "),r(G(m)),r(", and neither is preferred")].join(""));return m}return e},null,I.c?I.c(e):I.call(null,e));if(p(m)){if(B.b(I.c?I.c(k):I.call(null,k),I.c?I.c(d):I.call(null,d)))return xf.w(h,N,c,nd(m)),nd(m);
Gi(h,e,k,d);return Ji(a,c,d,e,g,h,k)}return null};function Ki(b,a){throw Error([r("No method in multimethod '"),r(b),r("' for dispatch value: "),r(a)].join(""));}function Li(b,a,c,d,e,g,h,k){this.name=b;this.s=a;this.fe=c;this.Cc=d;this.mc=e;this.oe=g;this.Fc=h;this.pc=k;this.m=4194305;this.F=4352}f=Li.prototype;
f.call=function(){function b(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,P,ha,xa){a=this;var Ua=Ta.h(a.s,b,c,d,e,E([g,h,k,m,n,t,u,v,x,A,D,J,K,V,P,ha,xa],0)),kq=Mi(this,Ua);p(kq)||Ki(a.name,Ua);return Ta.h(kq,b,c,d,e,E([g,h,k,m,n,t,u,v,x,A,D,J,K,V,P,ha,xa],0))}function a(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,P,ha){a=this;var xa=a.s.Ja?a.s.Ja(b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,P,ha):a.s.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,P,ha),Ua=Mi(this,xa);p(Ua)||Ki(a.name,xa);return Ua.Ja?Ua.Ja(b,c,d,e,g,h,
k,m,n,t,u,v,x,A,D,J,K,V,P,ha):Ua.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,P,ha)}function c(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,P){a=this;var ha=a.s.Ia?a.s.Ia(b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,P):a.s.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,P),xa=Mi(this,ha);p(xa)||Ki(a.name,ha);return xa.Ia?xa.Ia(b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,P):xa.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,P)}function d(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V){a=this;var P=a.s.Ha?a.s.Ha(b,c,d,e,g,h,k,m,n,t,u,
v,x,A,D,J,K,V):a.s.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V),ha=Mi(this,P);p(ha)||Ki(a.name,P);return ha.Ha?ha.Ha(b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V):ha.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V)}function e(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K){a=this;var V=a.s.Ga?a.s.Ga(b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K):a.s.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K),P=Mi(this,V);p(P)||Ki(a.name,V);return P.Ga?P.Ga(b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K):P.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K)}function g(a,
b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J){a=this;var K=a.s.Fa?a.s.Fa(b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J):a.s.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J),V=Mi(this,K);p(V)||Ki(a.name,K);return V.Fa?V.Fa(b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J):V.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J)}function h(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D){a=this;var J=a.s.Ea?a.s.Ea(b,c,d,e,g,h,k,m,n,t,u,v,x,A,D):a.s.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D),K=Mi(this,J);p(K)||Ki(a.name,J);return K.Ea?K.Ea(b,c,d,e,g,h,k,m,n,t,u,v,x,A,D):K.call(null,
b,c,d,e,g,h,k,m,n,t,u,v,x,A,D)}function k(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A){a=this;var D=a.s.Da?a.s.Da(b,c,d,e,g,h,k,m,n,t,u,v,x,A):a.s.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A),J=Mi(this,D);p(J)||Ki(a.name,D);return J.Da?J.Da(b,c,d,e,g,h,k,m,n,t,u,v,x,A):J.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x,A)}function m(a,b,c,d,e,g,h,k,m,n,t,u,v,x){a=this;var A=a.s.Ca?a.s.Ca(b,c,d,e,g,h,k,m,n,t,u,v,x):a.s.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x),D=Mi(this,A);p(D)||Ki(a.name,A);return D.Ca?D.Ca(b,c,d,e,g,h,k,m,n,t,u,v,x):
D.call(null,b,c,d,e,g,h,k,m,n,t,u,v,x)}function n(a,b,c,d,e,g,h,k,m,n,t,u,v){a=this;var x=a.s.Ba?a.s.Ba(b,c,d,e,g,h,k,m,n,t,u,v):a.s.call(null,b,c,d,e,g,h,k,m,n,t,u,v),A=Mi(this,x);p(A)||Ki(a.name,x);return A.Ba?A.Ba(b,c,d,e,g,h,k,m,n,t,u,v):A.call(null,b,c,d,e,g,h,k,m,n,t,u,v)}function t(a,b,c,d,e,g,h,k,m,n,t,u){a=this;var v=a.s.Aa?a.s.Aa(b,c,d,e,g,h,k,m,n,t,u):a.s.call(null,b,c,d,e,g,h,k,m,n,t,u),x=Mi(this,v);p(x)||Ki(a.name,v);return x.Aa?x.Aa(b,c,d,e,g,h,k,m,n,t,u):x.call(null,b,c,d,e,g,h,k,m,
n,t,u)}function u(a,b,c,d,e,g,h,k,m,n,t){a=this;var u=a.s.za?a.s.za(b,c,d,e,g,h,k,m,n,t):a.s.call(null,b,c,d,e,g,h,k,m,n,t),v=Mi(this,u);p(v)||Ki(a.name,u);return v.za?v.za(b,c,d,e,g,h,k,m,n,t):v.call(null,b,c,d,e,g,h,k,m,n,t)}function v(a,b,c,d,e,g,h,k,m,n){a=this;var t=a.s.La?a.s.La(b,c,d,e,g,h,k,m,n):a.s.call(null,b,c,d,e,g,h,k,m,n),u=Mi(this,t);p(u)||Ki(a.name,t);return u.La?u.La(b,c,d,e,g,h,k,m,n):u.call(null,b,c,d,e,g,h,k,m,n)}function x(a,b,c,d,e,g,h,k,m){a=this;var n=a.s.Ka?a.s.Ka(b,c,d,e,
g,h,k,m):a.s.call(null,b,c,d,e,g,h,k,m),t=Mi(this,n);p(t)||Ki(a.name,n);return t.Ka?t.Ka(b,c,d,e,g,h,k,m):t.call(null,b,c,d,e,g,h,k,m)}function A(a,b,c,d,e,g,h,k){a=this;var m=a.s.qa?a.s.qa(b,c,d,e,g,h,k):a.s.call(null,b,c,d,e,g,h,k),n=Mi(this,m);p(n)||Ki(a.name,m);return n.qa?n.qa(b,c,d,e,g,h,k):n.call(null,b,c,d,e,g,h,k)}function D(a,b,c,d,e,g,h){a=this;var k=a.s.ca?a.s.ca(b,c,d,e,g,h):a.s.call(null,b,c,d,e,g,h),m=Mi(this,k);p(m)||Ki(a.name,k);return m.ca?m.ca(b,c,d,e,g,h):m.call(null,b,c,d,e,g,
h)}function J(a,b,c,d,e,g){a=this;var h=a.s.R?a.s.R(b,c,d,e,g):a.s.call(null,b,c,d,e,g),k=Mi(this,h);p(k)||Ki(a.name,h);return k.R?k.R(b,c,d,e,g):k.call(null,b,c,d,e,g)}function K(a,b,c,d,e){a=this;var g=a.s.w?a.s.w(b,c,d,e):a.s.call(null,b,c,d,e),h=Mi(this,g);p(h)||Ki(a.name,g);return h.w?h.w(b,c,d,e):h.call(null,b,c,d,e)}function V(a,b,c,d){a=this;var e=a.s.f?a.s.f(b,c,d):a.s.call(null,b,c,d),g=Mi(this,e);p(g)||Ki(a.name,e);return g.f?g.f(b,c,d):g.call(null,b,c,d)}function ha(a,b,c){a=this;var d=
a.s.b?a.s.b(b,c):a.s.call(null,b,c),e=Mi(this,d);p(e)||Ki(a.name,d);return e.b?e.b(b,c):e.call(null,b,c)}function xa(a,b){a=this;var c=a.s.c?a.s.c(b):a.s.call(null,b),d=Mi(this,c);p(d)||Ki(a.name,c);return d.c?d.c(b):d.call(null,b)}function Ua(a){a=this;var b=a.s.C?a.s.C():a.s.call(null),c=Mi(this,b);p(c)||Ki(a.name,b);return c.C?c.C():c.call(null)}var P=null,P=function(P,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc,Ig,Gd,ne,nf,Jg,nj,di){switch(arguments.length){case 1:return Ua.call(this,P);case 2:return xa.call(this,
P,pa);case 3:return ha.call(this,P,pa,wa);case 4:return V.call(this,P,pa,wa,ma);case 5:return K.call(this,P,pa,wa,ma,Ga);case 6:return J.call(this,P,pa,wa,ma,Ga,Ja);case 7:return D.call(this,P,pa,wa,ma,Ga,Ja,cb);case 8:return A.call(this,P,pa,wa,ma,Ga,Ja,cb,pb);case 9:return x.call(this,P,pa,wa,ma,Ga,Ja,cb,pb,yb);case 10:return v.call(this,P,pa,wa,ma,Ga,Ja,cb,pb,yb,vb);case 11:return u.call(this,P,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb);case 12:return t.call(this,P,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb);case 13:return n.call(this,
P,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc);case 14:return m.call(this,P,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc);case 15:return k.call(this,P,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc);case 16:return h.call(this,P,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc,Ig);case 17:return g.call(this,P,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc,Ig,Gd);case 18:return e.call(this,P,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc,Ig,Gd,ne);case 19:return d.call(this,P,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc,Ig,Gd,ne,nf);case 20:return c.call(this,
P,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc,Ig,Gd,ne,nf,Jg);case 21:return a.call(this,P,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc,Ig,Gd,ne,nf,Jg,nj);case 22:return b.call(this,P,pa,wa,ma,Ga,Ja,cb,pb,yb,vb,wb,Yb,gc,qc,Lc,Ig,Gd,ne,nf,Jg,nj,di)}throw Error("Invalid arity: "+arguments.length);};P.c=Ua;P.b=xa;P.f=ha;P.w=V;P.R=K;P.ca=J;P.qa=D;P.Ka=A;P.La=x;P.za=v;P.Aa=u;P.Ba=t;P.Ca=n;P.Da=m;P.Ea=k;P.Fa=h;P.Ga=g;P.Ha=e;P.Ia=d;P.Ja=c;P.Yc=a;P.rc=b;return P}();
f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.C=function(){var b=this.s.C?this.s.C():this.s.call(null),a=Mi(this,b);p(a)||Ki(this.name,b);return a.C?a.C():a.call(null)};f.c=function(b){var a=this.s.c?this.s.c(b):this.s.call(null,b),c=Mi(this,a);p(c)||Ki(this.name,a);return c.c?c.c(b):c.call(null,b)};f.b=function(b,a){var c=this.s.b?this.s.b(b,a):this.s.call(null,b,a),d=Mi(this,c);p(d)||Ki(this.name,c);return d.b?d.b(b,a):d.call(null,b,a)};
f.f=function(b,a,c){var d=this.s.f?this.s.f(b,a,c):this.s.call(null,b,a,c),e=Mi(this,d);p(e)||Ki(this.name,d);return e.f?e.f(b,a,c):e.call(null,b,a,c)};f.w=function(b,a,c,d){var e=this.s.w?this.s.w(b,a,c,d):this.s.call(null,b,a,c,d),g=Mi(this,e);p(g)||Ki(this.name,e);return g.w?g.w(b,a,c,d):g.call(null,b,a,c,d)};f.R=function(b,a,c,d,e){var g=this.s.R?this.s.R(b,a,c,d,e):this.s.call(null,b,a,c,d,e),h=Mi(this,g);p(h)||Ki(this.name,g);return h.R?h.R(b,a,c,d,e):h.call(null,b,a,c,d,e)};
f.ca=function(b,a,c,d,e,g){var h=this.s.ca?this.s.ca(b,a,c,d,e,g):this.s.call(null,b,a,c,d,e,g),k=Mi(this,h);p(k)||Ki(this.name,h);return k.ca?k.ca(b,a,c,d,e,g):k.call(null,b,a,c,d,e,g)};f.qa=function(b,a,c,d,e,g,h){var k=this.s.qa?this.s.qa(b,a,c,d,e,g,h):this.s.call(null,b,a,c,d,e,g,h),m=Mi(this,k);p(m)||Ki(this.name,k);return m.qa?m.qa(b,a,c,d,e,g,h):m.call(null,b,a,c,d,e,g,h)};
f.Ka=function(b,a,c,d,e,g,h,k){var m=this.s.Ka?this.s.Ka(b,a,c,d,e,g,h,k):this.s.call(null,b,a,c,d,e,g,h,k),n=Mi(this,m);p(n)||Ki(this.name,m);return n.Ka?n.Ka(b,a,c,d,e,g,h,k):n.call(null,b,a,c,d,e,g,h,k)};f.La=function(b,a,c,d,e,g,h,k,m){var n=this.s.La?this.s.La(b,a,c,d,e,g,h,k,m):this.s.call(null,b,a,c,d,e,g,h,k,m),t=Mi(this,n);p(t)||Ki(this.name,n);return t.La?t.La(b,a,c,d,e,g,h,k,m):t.call(null,b,a,c,d,e,g,h,k,m)};
f.za=function(b,a,c,d,e,g,h,k,m,n){var t=this.s.za?this.s.za(b,a,c,d,e,g,h,k,m,n):this.s.call(null,b,a,c,d,e,g,h,k,m,n),u=Mi(this,t);p(u)||Ki(this.name,t);return u.za?u.za(b,a,c,d,e,g,h,k,m,n):u.call(null,b,a,c,d,e,g,h,k,m,n)};f.Aa=function(b,a,c,d,e,g,h,k,m,n,t){var u=this.s.Aa?this.s.Aa(b,a,c,d,e,g,h,k,m,n,t):this.s.call(null,b,a,c,d,e,g,h,k,m,n,t),v=Mi(this,u);p(v)||Ki(this.name,u);return v.Aa?v.Aa(b,a,c,d,e,g,h,k,m,n,t):v.call(null,b,a,c,d,e,g,h,k,m,n,t)};
f.Ba=function(b,a,c,d,e,g,h,k,m,n,t,u){var v=this.s.Ba?this.s.Ba(b,a,c,d,e,g,h,k,m,n,t,u):this.s.call(null,b,a,c,d,e,g,h,k,m,n,t,u),x=Mi(this,v);p(x)||Ki(this.name,v);return x.Ba?x.Ba(b,a,c,d,e,g,h,k,m,n,t,u):x.call(null,b,a,c,d,e,g,h,k,m,n,t,u)};f.Ca=function(b,a,c,d,e,g,h,k,m,n,t,u,v){var x=this.s.Ca?this.s.Ca(b,a,c,d,e,g,h,k,m,n,t,u,v):this.s.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v),A=Mi(this,x);p(A)||Ki(this.name,x);return A.Ca?A.Ca(b,a,c,d,e,g,h,k,m,n,t,u,v):A.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v)};
f.Da=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x){var A=this.s.Da?this.s.Da(b,a,c,d,e,g,h,k,m,n,t,u,v,x):this.s.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x),D=Mi(this,A);p(D)||Ki(this.name,A);return D.Da?D.Da(b,a,c,d,e,g,h,k,m,n,t,u,v,x):D.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x)};
f.Ea=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A){var D=this.s.Ea?this.s.Ea(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A):this.s.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A),J=Mi(this,D);p(J)||Ki(this.name,D);return J.Ea?J.Ea(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A):J.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A)};
f.Fa=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D){var J=this.s.Fa?this.s.Fa(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D):this.s.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D),K=Mi(this,J);p(K)||Ki(this.name,J);return K.Fa?K.Fa(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D):K.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D)};
f.Ga=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J){var K=this.s.Ga?this.s.Ga(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J):this.s.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J),V=Mi(this,K);p(V)||Ki(this.name,K);return V.Ga?V.Ga(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J):V.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J)};
f.Ha=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K){var V=this.s.Ha?this.s.Ha(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K):this.s.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K),ha=Mi(this,V);p(ha)||Ki(this.name,V);return ha.Ha?ha.Ha(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K):ha.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K)};
f.Ia=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V){var ha=this.s.Ia?this.s.Ia(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V):this.s.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V),xa=Mi(this,ha);p(xa)||Ki(this.name,ha);return xa.Ia?xa.Ia(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V):xa.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V)};
f.Ja=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha){var xa=this.s.Ja?this.s.Ja(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha):this.s.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha),Ua=Mi(this,xa);p(Ua)||Ki(this.name,xa);return Ua.Ja?Ua.Ja(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha):Ua.call(null,b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha)};
f.Yc=function(b,a,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,xa){var Ua=Ta.h(this.s,b,a,c,d,E([e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,xa],0)),P=Mi(this,Ua);p(P)||Ki(this.name,Ua);return Ta.h(P,b,a,c,d,E([e,g,h,k,m,n,t,u,v,x,A,D,J,K,V,ha,xa],0))};function Ni(b,a){var c=Oi;xf.w(c.mc,N,b,a);Gi(c.Fc,c.mc,c.pc,c.Cc)}
function Mi(b,a){B.b(I.c?I.c(b.pc):I.call(null,b.pc),I.c?I.c(b.Cc):I.call(null,b.Cc))||Gi(b.Fc,b.mc,b.pc,b.Cc);var c=(I.c?I.c(b.Fc):I.call(null,b.Fc)).call(null,a);if(p(c))return c;c=Ji(b.name,a,b.Cc,b.mc,b.oe,b.Fc,b.pc);return p(c)?c:(I.c?I.c(b.mc):I.call(null,b.mc)).call(null,b.fe)}f.uc=function(){return hc(this.name)};f.vc=function(){return ic(this.name)};f.M=function(){return this[ca]||(this[ca]=++da)};function Pi(b,a){this.cc=b;this.j=a;this.m=2153775104;this.F=2048}f=Pi.prototype;
f.toString=function(){return this.cc};f.equiv=function(b){return this.B(null,b)};f.B=function(b,a){return a instanceof Pi&&this.cc===a.cc};f.J=function(b,a){return Rb(a,[r('#uuid "'),r(this.cc),r('"')].join(""))};f.M=function(){null==this.j&&(this.j=zc(this.cc));return this.j};f.Tb=function(b,a){return na(this.cc,a.cc)};
function Qi(b,a,c){var d=Error(b);this.message=b;this.data=a;this.xd=c;this.name=d.name;this.description=d.description;this.ne=d.ne;this.fileName=d.fileName;this.lineNumber=d.lineNumber;this.columnNumber=d.columnNumber;this.stack=d.stack;return this}Qi.prototype.__proto__=Error.prototype;Qi.prototype.fa=!0;Qi.prototype.J=function(b,a,c){Rb(a,"#error {:message ");qg(this.message,a,c);p(this.data)&&(Rb(a,", :data "),qg(this.data,a,c));p(this.xd)&&(Rb(a,", :cause "),qg(this.xd,a,c));return Rb(a,"}")};
Qi.prototype.toString=function(){return oc(this)};function Ri(b,a){return new Qi(b,a,null)};var Si=new q("transact","unique","transact/unique",-940992320),Ti=new z(null,"res","res",245523648,null),Ui=new q(null,"used-args","used-args",23596256),Vi=new q(null,"args","args",1315556576),Wi=new z("locations","add","locations/add",-1465163552,null),Xi=new q("parser","in","parser/in",1617442048),Yi=new q(null,"text-anchor","text-anchor",585613696),Zi=new q(null,"path","path",-188191168),$i=new q(null,"onmouseup","onmouseup",168100736),aj=new q(null,"find","find",496279456),bj=new z(null,"subs",
"subs",1453849536,null),cj=new z(null,"tx-meta","tx-meta",-1495152575,null),dj=new q(null,"tempids","tempids",1767509089),ej=new q(null,"schema","schema",-1582001791),fj=new z(null,"get-else","get-else",1312024065,null),gj=new q(null,"onchange","onchange",1355467329),hj=new z(null,"println-str","println-str",-2049216703,null),ij=new q(null,"tuples","tuples",-676032639),jj=new q("parser","find","parser/find",-801023103),kj=new q(null,"attribute","attribute",-2074029119),lj=new z(null,"aggregate","aggregate",
-1142967327,null),mj=new q("transact","cas","transact/cas",816687170),oj=new z("pan","drag","pan/drag",2090593570,null),pj=new q("lookup-ref","unique","lookup-ref/unique",-960647710),qj=new q(null,"expand-kvps","expand-kvps",44141154),rj=new q("db.unique","identity","db.unique/identity",1675950722),sj=new q(null,"zoom","zoom",-1827487038),tj=new z(null,"pull","pull",779986722,null),uj=new q(null,"date","date",-1463434462),vj=new q(null,"r","r",-471384190),wj=new q(null,"*","*",-1294732318),xj=new q("db",
"index","db/index",-1531680669),yj=new q("datascript.pull-api","expand-rev","datascript.pull-api/expand-rev",2143627459),zj=new z(null,"\x3d","\x3d",-1501502141,null),Aj=new q(null,"stroke","stroke",1741823555),Bj=new q(null,"max-tx","max-tx",1119558339),Cj=new z(null,"rand-int","rand-int",-495012157,null),Dj=new z(null,"dec","dec",-766002333,null),Ej=new z(null,"future-call","future-call",96010083,null),Fj=new z(null,"entity","entity",1189561251,null),Gj=new q(null,"multi?","multi?",-749311069),
Hj=new q(null,"where","where",-2044795965),Ij=new q(null,"v","v",21465059),Jj=new q(null,"fn","fn",-1175266204),Kj=new z(null,"\x3c","\x3c",993667236,null),Lj=new q("db","unique","db/unique",329396388),Mj=new q(null,"wildcard","wildcard",-622473020),Nj=new q(null,"transform","transform",1381301764),Oj=new q(null,"done","done",-889844188),Ba=new q(null,"meta","meta",1499536964),Pj=new q(null,"variable","variable",-281346492),Qj=new z(null,"re-seq","re-seq",-2105554076,null),Rj=new q("body","epoch",
"body/epoch",1421622180),Sj=new z(null,"blockable","blockable",-28395259,null),Tj=new z(null,"some?","some?",234752293,null),Ca=new q(null,"dup","dup",556298533),Uj=new q(null,"aevt","aevt",-585148059),Vj=new q(null,"pred","pred",1927423397),Wj=new q(null,"rattr","rattr",-1122345563),Xj=new z(null,"range","range",-1014743483,null),Yj=new q(null,"key","key",-1516042587),Zj=new q(null,"element","element",1974019749),ak=new q(null,"limit","limit",-1355822363),bk=new z(null,"sum","sum",1777518341,null),
ck=new q(null,"placeholder","placeholder",-104873083),dk=new q("parser","where","parser/where",-966053850),ek=new q(null,"datom","datom",-371556090),fk=new q(null,"private","private",-558947994),gk=new z(null,"conn","conn",1918841190,null),hk=new q(null,"font-size","font-size",-1847940346),ik=new z(null,"pos?","pos?",-244377722,null),jk=new q(null,"db-after","db-after",-571884666),kk=new q("body","period","body/period",-349426489),lk=new q("parser","rule-vars","parser/rule-vars",-1493174969),mk=new q(null,
"button","button",1456579943),wf=new z(null,"new-value","new-value",-1567397401,null),nk=new z(null,"neg?","neg?",-1902175577,null),tf=new q(null,"validator","validator",-1966190681),ok=new q(null,"fragment","fragment",826775688),pk=new q(null,"pan","pan",-307712792),qk=new q(null,"default","default",-1987822328),rk=new q(null,"rule-vars","rule-vars",1665972520),sk=new q(null,"free","free",801364328),tk=new q(null,"added","added",2057651688),uk=new q(null,"new","new",-2085437848),vk=new q(null,"other",
"other",995793544),wk=new q(null,"bindings","bindings",1271397192),xk=new q("db","valueType","db/valueType",1827971944),yk=new q(null,"symbol","symbol",-1038572696),zk=new q(null,"avet","avet",1383857032),Ak=new q(null,"sources","sources",-321166424),Bk=new z(null,"schema","schema",58529736,null),Ck=new q(null,"name","name",1843675177),Dk=new z(null,"\x3c\x3d","\x3c\x3d",1244895369,null),Ek=new q("query","binding","query/binding",698240489),Fk=new z(null,"*","*",345799209,null),Gk=new z(null,"min",
"min",2085523049,null),Hk=new q("db.type","ref","db.type/ref",-1728373079),Ik=new q(null,"fill","fill",883462889),Jk=new z(null,"prn-str","prn-str",-145225943,null),Kk=new q(null,"value","value",305978217),Lk=new q(null,"prefix-context","prefix-context",-1269613591),Mk=new q("datascript.pull-api","recursion","datascript.pull-api/recursion",-1897884534),Nk=new z(null,"map?","map?",-1780568534,null),Ok=new q(null,"expand-rev","expand-rev",1249112650),Pk=new q(null,"operation","operation",-1267664310),
Qk=new z(null,"get-some","get-some",409442058,null),Rk=new z(null,"identity","identity",-1007039734,null),Sk=new z("db","db?","db/db?",1715868458,null),Tk=new q(null,"circle","circle",1903212362),Uk=new q(null,"max-eid","max-eid",2134868075),Vk=new z(null,"meta","meta",-1154898805,null),Wk=new q(null,"width","width",-384071477),Xk=new q(null,"onclick","onclick",1297553739),Yk=new q(null,"dy","dy",1719547243),Zk=new q(null,"asteroid","asteroid",1186392555),$k=new z(null,"empty?","empty?",76408555,
null),al=new q(null,"hold","hold",-1621118005),bl=new z(null,"quot","quot",-1125214196,null),cl=new z(null,"db?","db?",1715863724,null),qi=new q(null,"val","val",128701612),dl=new z(null,"stddev","stddev",775056588,null),el=new q(null,"cursor","cursor",1011937484),fl=new z(null,"not\x3d","not\x3d",1466536204,null),gl=new z(null,"limit","limit",284709164,null),hl=new q(null,"eids","eids",1546550700),vf=new z(null,"validate","validate",1439230700,null),il=new z(null,"realized","realized",1487343404,
null),jl=new z(null,"or-join","or-join",591375469,null),kl=new z(null,"ground","ground",-1460862835,null),ll=new q(null,"state","state",-1988618099),ml=new z(null,"rand","rand",-1745930995,null),nl=new q(null,"entity-id","entity-id",1485898093),ol=new z(null,"\x3e","\x3e",1085014381,null),ji=new q(null,"fallback-impl","fallback-impl",-1501286995),pl=new q(null,"star","star",279424429),ql=new q(null,"op","op",-1882987955),rl=new q(null,"source","source",-433931539),sl=new q("transaction","filtered",
"transaction/filtered",1699706605),za=new q(null,"flush-on-newline","flush-on-newline",-151457939),tl=new z(null,"db","db",-1661185010,null),ul=new q("db","isComponent","db/isComponent",423352398),vl=new z(null,"even?","even?",-1827825394,null),wl=new z(null,"_","_",-1201019570,null),xl=new q("body","mean-anomaly-at-epoch","body/mean-anomaly-at-epoch",-1856940594),yl=new q("body","type","body/type",1177290286),zl=new q("db.fn","call","db.fn/call",-151594418),Al=new q("transact","upsert","transact/upsert",
412688078),Bl=new q(null,"e","e",1381269198),Cl=new q(null,"rules","rules",1198912366),Dl=new z(null,"%","%",-950237169,null),El=new z(null,"pr-str","pr-str",-2066912145,null),Fl=new q(null,"elements","elements",657646735),Gl=new q(null,"className","className",-1983287057),Ci=new q(null,"descendants","descendants",1824886031),Hl=new z("set","date","set/date",176688527,null),Il=new q("body","name","body/name",1845098959),Jl=new z(null,"mod","mod",1510044207,null),Kl=new q(null,"eavt","eavt",-666437073),
Ll=new q("db.fn","retractEntity","db.fn/retractEntity",-1423535441),Ml=new z(null,"default","default",-347290801,null),Nl=new q("body","mass","body/mass",-2135932880),Ol=new z("datascript","Datom","datascript/Datom",-901340080,null),Di=new q(null,"ancestors","ancestors",-776045424),Pl=new q("db.unique","value","db.unique/value",276903088),Ql=new z(null,"-","-",-471816912,null),Rl=new q(null,"style","style",-496642736),Sl=new q(null,"planet","planet",276671984),Tl=new z(null,"or","or",1876275696,null),
Ul=new z(null,"name","name",-810760592,null),Vl=new q(null,"db-before","db-before",-553691536),Ff=new z(null,"n","n",-2092305744,null),Wl=new q(null,"div","div",1057191632),Aa=new q(null,"readably","readably",1129599760),Xl=new z(null,"?i","?i",1333985104,null),Yl=new q(null,"locations","locations",-435476560),ai=new q(null,"more-marker","more-marker",-14717935),Zl=new q(null,"tx-data","tx-data",934159761),$l=new q(null,"g","g",1738089905),am=new q(null,"rels","rels",1770187185),bm=new z(null,"entity?",
"entity?",555338193,null),cm=new q("body","longitude-of-ascending-node","body/longitude-of-ascending-node",-496001551),dm=new q("db","retract","db/retract",-1549825231),em=new z(null,"zero?","zero?",325758897,null),fm=new q(null,"binding","binding",539932593),gm=new z(null,"rem","rem",664046770,null),hm=new z("de","entity?","de/entity?",555337042,null),im=new q("body","position","body/position",-2025775662),jm=new z("zoom","change","zoom/change",473729586,null),km=new q(null,"tx","tx",466630418),
lm=new z(null,"nil?","nil?",1612038930,null),mm=new q(null,"porrl","porrl",-1693905102),nm=new z(null,"variance","variance",-1522424942,null),om=new q("parser","with","parser/with",-386255821),pm=new q(null,"recursion","recursion",-749738765),qm=new q(null,"seen","seen",-518999789),rm=new q(null,"stroke-width","stroke-width",716836435),sm=new q(null,"var","var",-769682797),tm=new z(null,"re-find","re-find",1143444147,null),um=new z(null,"not","not",1044554643,null),vm=new q("db.part","tx","db.part/tx",
-1480923213),wm=new z(null,"type","type",-1480165421,null),xm=new z(null,"identical?","identical?",-745864205,null),ym=new z(null,"$","$",-1580747756,null),zm=new q(null,"with","with",-1536296876),Am=new q(null,"pending-guards","pending-guards",-1255527308),Bm=new q("db","current-tx","db/current-tx",1600722132),Cm=new q("body","eccentricity","body/eccentricity",-1284168460),Da=new q(null,"print-length","print-length",1931866356),Dm=new z(null,"not-join","not-join",-645515756,null),Em=new q("db.fn",
"retractAttribute","db.fn/retractAttribute",937402164),Fm=new q("lookup-ref","syntax","lookup-ref/syntax",-317304012),Gm=new q("db.fn","cas","db.fn/cas",-379352172),Hm=new q("entity-id","syntax","entity-id/syntax",1921317045),Im=new z(null,"e","e",-1273166571,null),Jm=new z(null,"resolve-datom","resolve-datom",-294110827,null),Km=new z(null,"true?","true?",-1600332395,null),Lm=new q(null,"specs","specs",1426570741),Bi=new q(null,"parents","parents",-2027538891),Mm=new q("db","cardinality","db/cardinality",
-104975659),Nm=new q(null,"expected","expected",1583670997),Om=new z(null,"/","/",-1371932971,null),Pm=new q(null,"onmousedown","onmousedown",-1118865611),Qm=new z(null,"\x3e\x3d","\x3e\x3d",1016916022,null),Rm=new q(null,"svg","svg",856789142),Sm=new z(null,"not-empty","not-empty",2029453590,null),Tm=new z(null,"distinct","distinct",-148347594,null),Um=new q("db","id","db/id",-1388397098),Vm=new q("entity-id","missing","entity-id/missing",1234588374),Wm=new q(null,"attrs","attrs",-2090668713),Xm=
new z("pan","hold","pan/hold",19647927,null),Ym=new q(null,"context","context",-830191113),Zm=new z("pan","release","pan/release",105984951,null),$m=new q("datascript.impl.entity","nf","datascript.impl.entity/nf",-953741353),an=new q(null,"subpattern","subpattern",45002743),bn=new z(null,"sample","sample",1719555128,null),cn=new z("datascript","DB","datascript/DB",-487332776,null),dn=new q(null,"d","d",1972142424),en=new q(null,"error","error",-978969032),fn=new q(null,"depth","depth",1768663640),
gn=new z(null,"re-matches","re-matches",-1865705768,null),hn=new q("parser","binding","parser/binding",-346395752),jn=new z(null,"tx-data","tx-data",-1720276008,null),kn=new z(null,"spec","spec",1988051928,null),ln=new q("body","argument-of-perihelion","body/argument-of-perihelion",-2017111815),mn=new q("schema","validation","schema/validation",1178447161),nn=new q("db","add","db/add",235286841),on=new q(null,"clauses","clauses",1454841241),pn=new z(null,"odd?","odd?",-1458588199,null),qn=new q(null,
"form","form",-1624062471),rn=new q(null,"tag","tag",-1290361223),sn=new q(null,"rerender","rerender",-1601192263),tn=new q(null,"unfiltered-db","unfiltered-db",-1363720391),un=new z(null,"inc","inc",324505433,null),vn=new q(null,"input","input",556931961),wn=new q(null,"onmousemove","onmousemove",341554202),xn=new z(null,".",".",1975675962,null),yn=new q(null,"eid","eid",559519930),zn=new z(null,"+","+",-740910886,null),An=new z(null,"missing?","missing?",-1710383910,null),Bn=new q(null,"rschema",
"rschema",-1196134054),ef=new z(null,"quote","quote",1377916282,null),Cn=new q(null,"tx-meta","tx-meta",1159283194),Dn=new z(null,"median","median",-2084869638,null),En=new z(null,"conn?","conn?",1807755802,null),Fn=new q("db.cardinality","many","db.cardinality/many",772806234),Gn=new q("transact","syntax","transact/syntax",-299207078),Hn=new z(null,"str","str",-1564826950,null),df=new q(null,"arglists","arglists",1661989754),In=new q(null,"wildcard?","wildcard?",-686044101),cf=new z(null,"nil-iter",
"nil-iter",1101030523,null),Jn=new z(null,"false?","false?",-1522377573,null),Kn=new q(null,"main","main",-2117802661),Ln=new q(null,"hierarchy","hierarchy",-1053470341),Mn=new q(null,"border","border",1444987323),ii=new q(null,"alt-impl","alt-impl",670969595),Nn=new z(null,"max","max",1701898075,null),On=new q("query","where","query/where",-1935159429),Pn=new z(null,"...","...",-1926939749,null),Qn=new z(null,"!\x3d","!\x3d",-201205829,null),Rn=new z(null,"\x3d\x3d","\x3d\x3d",-234118149,null),Sn=
new q("parser","pull","parser/pull",-2147427204),Tn=new z(null,"count","count",-514511684,null),Un=new q(null,"entity","entity",-450970276),Vn=new q("body","inclination","body/inclination",-222110308),Wn=new q(null,"prefix-clauses","prefix-clauses",1294180028),Xn=new q(null,"rect","rect",-108902628),Yn=new z(null,"?p","?p",-10896580,null),Zn=new z(null,"deref","deref",1494944732,null),$n=new q(null,"expand","expand",595248157),ao=new z(null,"-differ?","-differ?",1465687357,null),bo=new q(null,"listeners",
"listeners",394544445),co=new q(null,"map","map",1371690461),eo=new z(null,"compare","compare",1109853757,null),fo=new q(null,"conflict","conflict",1978796605),go=new z(null,"complement","complement",-913606051,null),ho=new q(null,"kvps","kvps",65308317),io=new q("body","semi-major-axis","body/semi-major-axis",-1736120515),jo=new z(null,"count-distinct","count-distinct",-1566572514,null),ko=new z(null,"?name","?name",2050703390,null),lo=new q("db.cardinality","one","db.cardinality/one",1428352190),
mo=new q(null,"required","required",1807647006),no=new z(null,"-index-range","-index-range",898114142,null),oo=new z(null,"and","and",668631710,null),Ef=new z(null,"number?","number?",-1747282210,null),po=new q(null,"a","a",-2123407586),qo=new q(null,"font-family","font-family",-667419874),ro=new z(null,"print-str","print-str",-699700354,null),so=new q(null,"datoms","datoms",-290874434),to=new q(null,"assertion","assertion",-1645134882),uo=new q(null,"old","old",-1825222690),vo=new q(null,"height",
"height",1025178622),wo=new z(null,"avg","avg",1837937727,null),xo=new q(null,"dwarf-planet","dwarf-planet",1357458527),yo=new q(null,"in","in",-1531184865),zo=new q(null,"vars","vars",-2046957217),Ao=new q(null,"pattern","pattern",242135423),Jh=new q("cljs.core","not-found","cljs.core/not-found",-1572889185),Bo=new q(null,"foreignObject","foreignObject",25502111),Co=new q(null,"text","text",-1790561697),Do=new q(null,"span","span",1394872991),Eo=new z(null,"f","f",43394975,null),Fo=new q("parser",
"query","parser/query",1877320671),Go=new q(null,"attr","attr",-604132353),Ho=new q(null,"results","results",-1134170113);function Io(b){var a=new ka;for(b=F(b);;)if(null!=b)a.append(""+r(G(b))),b=H(b),null!=b&&a.append("");else return a.toString()}function Jo(b){a:for(b="/(?:)/"===""+r("-")?qd.b($d(gd("",R.b(r,F(b)))),""):$d((""+r(b)).split("-"));;)if(""===(null==b?null:sb(b)))b=null==b?null:tb(b);else break a;return b};var Ko=G(Sf(function(b){return 0!=(32&1<<b)},Uh.f(31,-1,-1)))+1,Lo=(1<<Ko)-1;function Mo(b,a,c,d){for(var e=0,g=qe(c);;)if(e<=g){c=e+g>>>1;var h=a[c];0>(b.b?b.b(h,d):b.call(null,h,d))?e=c+1:g=c-1}else return e}function No(b,a,c,d){for(var e=0,g=qe(c);;)if(e<=g){c=e+g>>>1;var h=a[c];0<(b.b?b.b(h,d):b.call(null,h,d))?g=c-1:e=c+1}else return e}function Oo(b,a,c){var d=a.length,e=Mo(b,a,d-1,c);if(d=e<d)a=a[e],d=0===(b.b?b.b(a,c):b.call(null,a,c));return d?e:-1}
function Po(b,a,c){var d=a.length;b=Mo(b,a,d-1,c);return b===d?-1:b}function Qo(b){return b[b.length-1]}function Ro(b,a,c,d,e,g){var h=g.length,k=d-a,m=k+h,n;n=k+h+(c-e);n=Ra?Array(n):Qa.call(null,n);d-=a;for(var t=0;;)if(t<d)n[t+0]=b[t+a],t+=1;else break;a=h-0;for(h=0;;)if(h<a)n[h+k]=g[h+0],h+=1;else break;c-=e;for(g=0;;)if(g<c)n[g+m]=b[g+e],g+=1;else break;return n}function So(b,a,c,d){return Ro(b,0,b.length,a,c,d)}
function To(b,a){var c=b.length,d=a.length,e=c+d,g=e>>>1,h=e-g,e=Ra?Array(g):Qa.call(null,g),h=Ra?Array(h):Qa.call(null,h);if(c<=g){for(var k=c-0,m=0;;)if(m<k)e[m+0]=b[m+0],m+=1;else break;k=g-c-0;for(m=0;;)if(m<k)e[m+c]=a[m+0],m+=1;else break;d-=g-c;for(k=0;;)if(k<d)h[k+0]=a[k+(g-c)],k+=1;else break}else{k=g-0;for(m=0;;)if(m<k)e[m+0]=b[m+0],m+=1;else break;k=c-g;for(m=0;;)if(m<k)h[m+0]=b[m+g],m+=1;else break;d-=0;for(k=0;;)if(k<d)h[k+(c-g)]=a[k+0],k+=1;else break}return[e,h]}
function Uo(b,a,c,d,e,g){d-=c;if(g=d===g-0)for(g=0;;){if(g===d)return!0;var h=a[g+c],k=e[g+0];if(0!==(b.b?b.b(h,k):b.call(null,h,k)))return!1;g+=1}else return g}function Vo(b,a){for(var c=a.length,d=0;;)if(d<c){var e=d,g;g=a[d];g=b.c?b.c(g):b.call(null,g);a[e]=g;d+=1}else break;return a}function Wo(b){var a=b.length,c=Vb(rd);if(0<a)for(var d=0;;){var e=a-d;if(32>=e){Xe.b(c,b.slice(d));break}else 40<=e?(Xe.b(c,b.slice(d,d+24)),d+=24):(e>>>=1,Xe.b(c,b.slice(d,d+e)),d+=e)}return Yd(Xb(c))}
function Xo(b,a){return p(b)?p(a)?[b,a]:[b]:[a]}function Yo(b,a,c){return p(b)?p(a)?p(c)?[b,a,c]:[b,a]:p(c)?[b,c]:[b]:p(a)?p(c)?[a,c]:[a]:[c]}
var Zo=function Zo(a){if(null!=a&&null!=a.cd)return a.cd(a);var c=Zo[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=Zo._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("INode.node-lim-key",a);},$o=function $o(a){if(null!=a&&null!=a.Jd)return a.keys.length;var c=$o[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=$o._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("INode.node-len",a);},ap=function ap(a,c){if(null!=a&&null!=a.ed)return a.ed(a,c);var d=
ap[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=ap._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("INode.node-merge",a);},bp=function bp(a,c){if(null!=a&&null!=a.fd)return a.fd(a,c);var d=bp[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=bp._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("INode.node-merge-n-split",a);},cp=function cp(a,c,d){if(null!=a&&null!=a.dd)return a.dd(a,c,d);var e=cp[ba(null==a?null:a)];if(null!=e)return e.f?
e.f(a,c,d):e.call(null,a,c,d);e=cp._;if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);throw Na("INode.node-lookup",a);},dp=function dp(a,c,d){if(null!=a&&null!=a.ad)return a.ad(a,c,d);var e=dp[ba(null==a?null:a)];if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);e=dp._;if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);throw Na("INode.node-conj",a);},ep=function ep(a,c,d,e,g,h){if(null!=a&&null!=a.bd)return a.bd(a,c,d,e,g,h);var k=ep[ba(null==a?null:a)];if(null!=k)return k.ca?k.ca(a,c,d,e,g,
h):k.call(null,a,c,d,e,g,h);k=ep._;if(null!=k)return k.ca?k.ca(a,c,d,e,g,h):k.call(null,a,c,d,e,g,h);throw Na("INode.node-disj",a);};function fp(b,a,c,d){if(p(a))return[b];if(16<$o(b))return Yo(c,b,d);if(p(p(c)?16>=$o(c):c))return Xo(ap(c,b),d);if(p(p(d)?16>=$o(d):d))return Xo(c,ap(b,d));if(p(p(c)?null==d||$o(c)<$o(d):c))return b=bp(c,b),Yo(b[0],b[1],d);b=bp(b,d);return Yo(c,b[0],b[1])}function gp(b,a){this.keys=b;this.sa=a}f=gp.prototype;f.cd=function(){return Qo(this.keys)};f.Jd=function(){return this.keys.length};
f.ed=function(b,a){return new gp(this.keys.concat(a.keys),this.sa.concat(a.sa))};f.fd=function(b,a){var c=To(this.keys,a.keys),d=To(this.sa,a.sa);return Xo(new gp(c[0],d[0]),new gp(c[1],d[1]))};f.dd=function(b,a,c){b=Po(a,this.keys,c);return-1===b?null:cp(this.sa[b],a,c)};
f.ad=function(b,a,c){b=Mo(a,this.keys,this.keys.length-2,c);c=dp(this.sa[b],a,c);if(p(c)){var d=this.keys,e=b+1,g=c.map(Zo);a=Uo(a,d,b,e,g,g.length)?d:So(d,b,e,g);b=So(this.sa,b,b+1,c);if(32>=b.length)return[new gp(a,b)];c=b.length>>>1;return[new gp(a.slice(0,c),b.slice(0,c)),new gp(a.slice(c),b.slice(c))]}return null};
f.bd=function(b,a,c,d,e,g){var h=Po(a,this.keys,c);if(-1===h)return null;b=0<=h-1?this.sa[h-1]:null;var k=h+1<this.sa.length?this.sa[h+1]:null;c=ep(this.sa[h],a,c,!1,b,k);if(p(c)){b=p(b)?h-1:h;var h=p(k)?2+h:1+h,k=this.keys,m=c.map(Zo);a=Uo(a,k,b,h,m,m.length)?k:So(k,b,h,m);c=So(this.sa,b,h,c);return fp(new gp(a,c),d,e,g)}return null};function hp(b){this.keys=b}f=hp.prototype;f.cd=function(){return Qo(this.keys)};f.Jd=function(){return this.keys.length};f.ed=function(b,a){return new hp(this.keys.concat(a.keys))};
f.fd=function(b,a){var c=To(this.keys,a.keys);return Xo(new hp(c[0]),new hp(c[1]))};f.dd=function(b,a,c){b=Oo(a,this.keys,c);return-1===b?null:this.keys[b]};f.ad=function(b,a,c){b=Mo(a,this.keys,this.keys.length-1,c);var d=this.keys.length,e;if(e=b<d)e=this.keys[b],e=0===(a.b?a.b(c,e):a.call(null,c,e));return e?null:32===d?(a=d+1>>>1,b>a?[new hp(this.keys.slice(0,a)),new hp(Ro(this.keys,a,d,b,b,[c]))]:[new hp(Ro(this.keys,0,a,b,b,[c])),new hp(this.keys.slice(a,d))]):[new hp(So(this.keys,b,b,[c]))]};
f.bd=function(b,a,c,d,e,g){b=Oo(a,this.keys,c);if(-1===b)return null;b=So(this.keys,b,b+1,[]);return fp(new hp(b),d,e,g)};ip;jp;kp;function lp(b,a,c,d,e,g){this.root=b;this.shift=a;this.u=c;this.ab=d;this.D=e;this.j=g;this.m=2297303311;this.F=8192}f=lp.prototype;f.toString=function(){return oc(this)};f.I=function(b,a){return cp(this.root,this.ab,a)};f.H=function(b,a,c){b=cp(this.root,this.ab,a);return p(b)?b:c};f.J=function(b,a,c){return Y(a,qg,"#{"," ","}",c,F(this))};f.O=function(){return this.D};
f.T=function(){return this.u};f.Bb=function(){var b=kp.c?kp.c(this):kp.call(null,this);return Qb(b)};f.M=function(){var b=this.j;if(null!=b)return b;a:for(var b=0,a=F(this);;)if(a)var c=G(a),b=(b+Bc(c))%4503599627370496,a=H(a);else break a;return this.j=b};f.B=function(b,a){return Cd(a)&&this.u===L(a)&&gf(function(a){return function(b){return Rd(a,b)}}(this),a)};f.ha=function(){return new lp(new hp([]),0,0,this.ab,this.D,null)};
f.$c=function(b,a){return jp.f?jp.f(this,a,this.ab):jp.call(null,this,a,this.ab)};f.oa=function(b,a){var c=kp.c?kp.c(this):kp.call(null,this);return p(c)?Gb.b(c,a):a.C?a.C():a.call(null)};f.pa=function(b,a,c){b=kp.c?kp.c(this):kp.call(null,this);return p(b)?Gb.f(b,a,c):c};f.N=function(){return kp.c?kp.c(this):kp.call(null,this)};f.P=function(b,a){return new lp(this.root,this.shift,this.u,this.ab,a,this.j)};f.S=function(b,a){return ip.f?ip.f(this,a,this.ab):ip.call(null,this,a,this.ab)};
f.call=function(){var b=null,b=function(a,b,d){switch(arguments.length){case 2:return this.I(null,b);case 3:return this.H(null,b,d)}throw Error("Invalid arity: "+arguments.length);};b.b=function(a,b){return this.I(null,b)};b.f=function(a,b,d){return this.H(null,b,d)};return b}();f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.c=function(b){return this.I(null,b)};f.b=function(b,a){return this.H(null,b,a)};function mp(b,a,c,d){return new lp(a,c,d,b.ab,b.D,null)}
function np(b,a){for(var c=b.shift,d=b.root;;)if(0<c)d=d.sa[Lo&a>>>c],c-=Ko;else return d.keys}function ip(b,a,c){a=dp(b.root,c,a);return null==a?b:1===a.length?mp(b,a[0],b.shift,b.u+1):mp(b,new gp(a.map(Zo),a),b.shift+Ko,b.u+1)}function jp(b,a,c){a=ep(b.root,c,a,!0,null,null);if(null==a)return b;a=a[0];return a instanceof gp&&1===a.sa.length?mp(b,a.sa[0],b.shift-Ko,b.u-1):mp(b,a,b.shift,b.u-1)}
var op=function op(a,c,d){var e=Lo&c>>>d;return 0<d?(c=op(a.sa[e],c,d-Ko),-1===c?e+1<a.sa.length?0|e+1<<d:-1:c|e<<d):e+1<a.keys.length?0|e+1<<0:-1};function pp(b,a){for(var c=b,d=0,e=a;;)if(0<e)d|=c.sa.length-1<<e,e-=Ko,c=Qo(c.sa);else return d|c.keys.length-1<<0}var qp=function qp(a,c,d){var e=Lo&c>>>d;if(0<d){var g=d-Ko;c=qp(a.sa[e],c,g);return-1===c?0<=e-1?(--e,pp(a.sa[e],g)|e<<d):-1:c|e<<d}return 0<=e-1?0|e-1<<0:-1};rp;sp;tp;up;vp;wp;xp;yp;
function kp(b){if(0<$o(b.root)){var a=pp(b.root,b.shift)+1;return rp.f?rp.f(b,0,a):rp.call(null,b,0,a)}return null}function zp(b,a,c,d,e){this.set=b;this.left=a;this.right=c;this.keys=d;this.eb=e;this.m=143130816;this.F=1536}f=zp.prototype;f.N=function(){return p(this.keys)?this:null};f.ja=function(){return tp.c?tp.c(this):tp.call(null,this)};f.ra=function(){var b=up.c?up.c(this):up.call(null,this);return p(b)?b:Jc};f.wa=function(){return up.c?up.c(this):up.call(null,this)};
f.Mc=function(){return vp.c?vp.c(this):vp.call(null,this)};f.Nc=function(){var b=fc(this);return p(b)?b:Jc};f.Lc=function(){return wp.c?wp.c(this):wp.call(null,this)};f.oa=function(b,a){return yp.b?yp.b(this,a):yp.call(null,this,a)};f.pa=function(b,a,c){return yp.f?yp.f(this,a,c):yp.call(null,this,a,c)};f.Bb=function(){return xp.c?xp.c(this):xp.call(null,this)};function rp(b,a,c){return new zp(b,a,c,np(b,a),Lo&a>>>0)}function tp(b){return p(b.keys)?b.keys[b.eb]:null}
function up(b){var a=b.set,c=b.left,d=b.right,e=b.keys;b=b.eb;if(p(e)){if(b+1<e.length)return c+1<d?new zp(a,c+1,d,e,b+1):null;c=op(a.root,c,a.shift);return $e.b(-1,c)&&c<d?rp(a,c,d):null}return null}function vp(b){var a=b.right,c=b.keys,d=b.eb;b=B.b(b.left|Lo,a|Lo)?a&Lo:c.length;return new Me(c,d,b)}function wp(b){var a=b.set,c=b.right;b=op(a.root,b.left+(b.keys.length-b.eb-1),a.shift);return $e.b(-1,b)&&b<c?rp(a,b,c):null}
function xp(b){var a=b.set,c=b.left,d=b.right;return p(b.keys)?(b=qp(a.root,c,a.shift),d=qp(a.root,d,a.shift),sp.f?sp.f(a,b,d):sp.call(null,a,b,d)):null}var yp=function yp(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return yp.b(arguments[0],arguments[1]);case 3:return yp.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};
yp.b=function(b,a){if(null==b.keys)return a.C?a.C():a.call(null);var c=tp(b),d=up(b);return p(d)?yp.f(d,a,c):c};yp.f=function(b,a,c){var d=b.set,e=b.right,g=b.left,h=b.keys;for(b=b.eb;;){if(null==h)return c;var k=h[b];c=a.b?a.b(c,k):a.call(null,c,k);if($c(c))return I.c?I.c(c):I.call(null,c);if(b+1<h.length)if(g+1<e)b+=1,g+=1;else return c;else if(g=op(d.root,g,d.shift),-1!==g&&g<e)h=np(d,g),b=Lo&g>>>0;else return c}};yp.A=3;Ap;Bp;Cp;
function Dp(b,a,c,d,e){this.set=b;this.left=a;this.right=c;this.keys=d;this.eb=e;this.m=142606528;this.F=0}f=Dp.prototype;f.N=function(){return p(this.keys)?this:null};f.ja=function(){return Ap.c?Ap.c(this):Ap.call(null,this)};f.ra=function(){var b=Bp.c?Bp.c(this):Bp.call(null,this);return p(b)?b:Jc};f.wa=function(){return Bp.c?Bp.c(this):Bp.call(null,this)};f.Bb=function(){return Cp.c?Cp.c(this):Cp.call(null,this)};function sp(b,a,c){return new Dp(b,a,c,np(b,c),Lo&c>>>0)}
function Ap(b){return p(b.keys)?b.keys[b.eb]:null}function Bp(b){var a=b.set,c=b.left,d=b.right,e=b.keys;b=b.eb;if(p(e)){if(0<=b-1)return d-1>c?new Dp(a,c,d-1,e,b-1):null;d=qp(a.root,d,a.shift);return $e.b(-1,d)&&d>c?sp(a,c,d):null}return null}function Cp(b){var a=b.set,c=b.left;b=b.right;if(p(Pg)){var d=op(a.root,b,a.shift);return rp(a,-1===c?0:op(a.root,c,a.shift),-1===d?b+1:d)}return null}
function Ep(b,a,c){a:for(var d=b.root,e=0,g=b.shift;;){var h=$o(d);if(0===g){var k=d.keys,k=Mo(b.ab,k,h-1,a);a=h===k?-1:e|k<<0;break a}k=d.keys;k=Mo(b.ab,k,h-2,a);e|=k<<g;g-=Ko;d=d.sa[k]}if(0>a)return null;a:for(d=b.root,e=0,g=b.shift;;){k=$o(d);if(0===g){h=d.keys;k=No(b.ab,h,k-1,c);c=e|k<<0;break a}h=d.keys;k=No(b.ab,h,k-2,c);e|=k<<g;g-=Ko;d=d.sa[k]}return c>a?new zp(b,a,c,np(b,a),Lo&a>>>0):null}function Fp(b,a){return Ep(b,a,a)}
function Gp(b,a){for(var c=Vo(function(a){return new hp(a)},Wo(b)),d=c,e=0;;){var g=L(d);switch(g){case 0:return new lp(new hp([]),0,0,a,null,null);case 1:return new lp(G(d),e,b.length,a,null,null);default:d=Vo(function(){return function(a){return new gp(a.map(Zo),a)}}(d,e,g,c),Wo(d)),e+=Ko}}}function Hp(b){return new lp(new hp([]),0,0,b,null,null)};function Ip(b,a,c){if(De(c))return c=Ta.b(vc,R.b(b,c)),a.c?a.c(c):a.call(null,c);if(Od(c))return c=Xh(R.b(b,c)),a.c?a.c(c):a.call(null,c);if(Fd(c))return c=w.f(function(a,c){return qd.b(a,b.c?b.c(c):b.call(null,c))},c,c),a.c?a.c(c):a.call(null,c);Bd(c)&&(c=Vf.b(sd(c),R.b(b,c)));return a.c?a.c(c):a.call(null,c)}var Jp=function Jp(a,c){return Ip(of(Jp,a),a,c)};var Kp=Error;function Lp(b){return"number"===typeof b&&0>b}Mp;Np;Op;Pp;Qp;Rp;function Sp(b,a,c,d,e){this.e=b;this.a=a;this.v=c;this.tx=d;this.added=e;this.m=2162164496;this.F=0}f=Sp.prototype;f.M=function(){var b=this.j;return p(b)?b:this.j=Mp.c?Mp.c(this):Mp.call(null,this)};f.B=function(b,a){var c=a instanceof Sp;return c?Np.b?Np.b(this,a):Np.call(null,this,a):c};f.N=function(){return Op.c?Op.c(this):Op.call(null,this)};f.I=function(b,a){return Pp.f?Pp.f(this,a,null):Pp.call(null,this,a,null)};
f.H=function(b,a,c){return Pp.f?Pp.f(this,a,c):Pp.call(null,this,a,c)};f.da=function(b,a){return Qp.b?Qp.b(this,a):Qp.call(null,this,a)};f.Pa=function(b,a,c){return Qp.f?Qp.f(this,a,c):Qp.call(null,this,a,c)};f.U=function(b,a,c){return Rp.f?Rp.f(this,a,c):Rp.call(null,this,a,c)};f.J=function(b,a,c){return Y(a,qg,"#datascript/Datom ["," ","]",c,new U(null,5,5,W,[this.e,this.a,this.v,this.tx,this.added],null))};
var Tp=function Tp(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 3:return Tp.f(arguments[0],arguments[1],arguments[2]);case 4:return Tp.w(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Tp.R(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};Tp.f=function(b,a,c){return new Sp(b,a,c,536870912,!0)};
Tp.w=function(b,a,c,d){return new Sp(b,a,c,d,!0)};Tp.R=function(b,a,c,d,e){return new Sp(b,a,c,d,e)};Tp.A=5;function Up(b){return b instanceof Sp}function Mp(b){return Cc(Cc(Bc(b.e),Bc(b.a)),Bc(b.v))}function Np(b,a){return B.b(b.e,a.e)&&B.b(b.a,a.a)&&B.b(b.v,a.v)}function Op(b){return Za(Za(Za(Za(Za(Jc,b.added),b.tx),b.v),b.a),b.e)}
function Pp(b,a,c){return B.b(Ij,a)?b.v:B.b("e",a)?b.e:B.b(tk,a)?b.added:B.b("v",a)?b.v:B.b(Bl,a)?b.e:B.b("a",a)?b.a:B.b(km,a)?b.tx:B.b("added",a)?b.added:B.b("tx",a)?b.tx:B.b(po,a)?b.a:c}var Qp=function Qp(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Qp.b(arguments[0],arguments[1]);case 3:return Qp.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};
Qp.b=function(b,a){switch(a){case 0:return b.e;case 1:return b.a;case 2:return b.v;case 3:return b.tx;case 4:return b.added;default:throw Error([r("Datom/-nth: Index out of bounds: "),r(a)].join(""));}};Qp.f=function(b,a,c){switch(a){case 0:return b.e;case 1:return b.a;case 2:return b.v;case 3:return b.tx;case 4:return b.added;default:return c}};Qp.A=3;
function Rp(b,a,c){switch(a instanceof q?a.W:null){case "e":return new Sp(c,b.a,b.v,b.tx,b.added);case "a":return new Sp(b.e,c,b.v,b.tx,b.added);case "v":return new Sp(b.e,b.a,c,b.tx,b.added);case "tx":return new Sp(b.e,b.a,b.v,c,b.added);case "added":return new Sp(b.e,b.a,b.v,b.tx,c);default:throw new Kp([r("invalid key for #datascript/Datom: "),r(a)].join(""));}}function Vp(b,a){return p(p(b)?a:b)?wc(b,a):0}function Wp(b,a){return p(p(b)?a:b)?b-a:0}
function Xp(b,a){return null!=b&&null!=a?wc(b,a):0}function Yp(b,a){var c=Wp(b.e,a.e);return 0===c&&(c=Vp(b.a,a.a),0===c&&(c=Xp(b.v,a.v),0===c))?(c=Wp(b.tx,a.tx),0===c?0:c):c}function Zp(b,a){var c=Vp(b.a,a.a);return 0===c&&(c=Wp(b.e,a.e),0===c&&(c=Xp(b.v,a.v),0===c))?(c=Wp(b.tx,a.tx),0===c?0:c):c}function $p(b,a){var c=Vp(b.a,a.a);return 0===c&&(c=Xp(b.v,a.v),0===c&&(c=Wp(b.e,a.e),0===c))?(c=Wp(b.tx,a.tx),0===c?0:c):c}function aq(b,a){return b instanceof q?bc(b,a):na(b,a)}
function bq(b,a){var c=b.e-a.e;return 0===c&&(c=aq(b.a,a.a),0===c&&(c=wc(b.v,a.v),0===c))?(c=b.tx-a.tx,0===c?0:c):c}function cq(b,a){var c=aq(b.a,a.a);return 0===c&&(c=b.e-a.e,0===c&&(c=wc(b.v,a.v),0===c))?(c=b.tx-a.tx,0===c?0:c):c}function dq(b,a){var c=aq(b.a,a.a);return 0===c&&(c=wc(b.v,a.v),0===c&&(c=b.e-a.e,0===c))?(c=b.tx-a.tx,0===c?0:c):c}function eq(){}
var fq=function fq(a,c){if(null!=a&&null!=a.nd)return a.nd(a,c);var d=fq[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=fq._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("ISearch.-search",a);};function gq(){}
var hq=function hq(a,c,d){if(null!=a&&null!=a.jd)return a.jd(a,c,d);var e=hq[ba(null==a?null:a)];if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);e=hq._;if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);throw Na("IIndexAccess.-datoms",a);},iq=function iq(a,c,d){if(null!=a&&null!=a.ld)return a.ld(a,c,d);var e=iq[ba(null==a?null:a)];if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);e=iq._;if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);throw Na("IIndexAccess.-seek-datoms",a);},jq=function jq(a,
c,d,e){if(null!=a&&null!=a.kd)return a.kd(a,c,d,e);var g=jq[ba(null==a?null:a)];if(null!=g)return g.w?g.w(a,c,d,e):g.call(null,a,c,d,e);g=jq._;if(null!=g)return g.w?g.w(a,c,d,e):g.call(null,a,c,d,e);throw Na("IIndexAccess.-index-range",a);};function lq(){}
var mq=function mq(a){if(null!=a&&null!=a.hd)return a.hd(a);var c=mq[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=mq._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IDB.-schema",a);},nq=function nq(a,c){if(null!=a&&null!=a.gd)return a.gd(a,c);var d=nq[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=nq._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("IDB.-attrs-by",a);};oq;pq;qq;rq;sq;tq;uq;vq;wq;
function xq(b,a,c,d,e,g,h,k,m,n){this.Xa=b;this.Sa=a;this.$a=c;this.Wa=d;this.fb=e;this.gb=g;this.bb=h;this.i=k;this.g=m;this.j=n;this.m=2229667594;this.F=8192}f=xq.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "schema":return this.Xa;case "eavt":return this.Sa;case "aevt":return this.$a;case "avet":return this.Wa;case "max-eid":return this.fb;case "max-tx":return this.gb;case "rschema":return this.bb;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.db.DB{",", ","}",c,T.b(new U(null,7,5,W,[new U(null,2,5,W,[ej,this.Xa],null),new U(null,2,5,W,[Kl,this.Sa],null),new U(null,2,5,W,[Uj,this.$a],null),new U(null,2,5,W,[zk,this.Wa],null),new U(null,2,5,W,[Uk,this.fb],null),new U(null,2,5,W,[Bj,this.gb],null),new U(null,2,5,W,[Bn,this.bb],null)],null),this.g))};
f.V=function(){return new Gg(0,this,7,new U(null,7,5,W,[ej,Kl,Uj,zk,Uk,Bj,Bn],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 7+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};
f.Y=function(b,a){return Rd(new Ud(null,new l(null,7,[ej,null,Bj,null,Uj,null,zk,null,Uk,null,Kl,null,Bn,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new xq(this.Xa,this.Sa,this.$a,this.Wa,this.fb,this.gb,this.bb,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(ej,a):S.call(null,ej,a))?new xq(c,this.Sa,this.$a,this.Wa,this.fb,this.gb,this.bb,this.i,this.g,null):p(S.b?S.b(Kl,a):S.call(null,Kl,a))?new xq(this.Xa,c,this.$a,this.Wa,this.fb,this.gb,this.bb,this.i,this.g,null):p(S.b?S.b(Uj,a):S.call(null,Uj,a))?new xq(this.Xa,this.Sa,c,this.Wa,this.fb,this.gb,this.bb,this.i,this.g,null):p(S.b?S.b(zk,a):S.call(null,zk,a))?new xq(this.Xa,this.Sa,this.$a,c,this.fb,this.gb,this.bb,this.i,this.g,null):p(S.b?S.b(Uk,a):S.call(null,
Uk,a))?new xq(this.Xa,this.Sa,this.$a,this.Wa,c,this.gb,this.bb,this.i,this.g,null):p(S.b?S.b(Bj,a):S.call(null,Bj,a))?new xq(this.Xa,this.Sa,this.$a,this.Wa,this.fb,c,this.bb,this.i,this.g,null):p(S.b?S.b(Bn,a):S.call(null,Bn,a))?new xq(this.Xa,this.Sa,this.$a,this.Wa,this.fb,this.gb,c,this.i,this.g,null):new xq(this.Xa,this.Sa,this.$a,this.Wa,this.fb,this.gb,this.bb,this.i,N.f(this.g,a,c),null)};
f.N=function(){return F(T.b(new U(null,7,5,W,[new U(null,2,5,W,[ej,this.Xa],null),new U(null,2,5,W,[Kl,this.Sa],null),new U(null,2,5,W,[Uj,this.$a],null),new U(null,2,5,W,[zk,this.Wa],null),new U(null,2,5,W,[Uk,this.fb],null),new U(null,2,5,W,[Bj,this.gb],null),new U(null,2,5,W,[Bn,this.bb],null)],null),this.g))};f.P=function(b,a){return new xq(this.Xa,this.Sa,this.$a,this.Wa,this.fb,this.gb,this.bb,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};
function yq(b){return new xq(ej.c(b),Kl.c(b),Uj.c(b),zk.c(b),Uk.c(b),Bj.c(b),Bn.c(b),null,O.h(b,ej,E([Kl,Uj,zk,Uk,Bj,Bn],0)),null)}f.fa=!0;f.J=function(b,a,c){return sq.f?sq.f(this,a,c):sq.call(null,this,a,c)};f.Xc=!0;f.T=function(){return L(this.Sa)};f.$d=!0;f.Bb=function(){return Qb(this.Sa)};f.Ad=!0;f.M=function(){return oq.c?oq.c(this):oq.call(null,this)};f.B=function(b,a){return qq.b?qq.b(this,a):qq.call(null,this,a)};f.ha=function(){var b=this.Xa;return rq.c?rq.c(b):rq.call(null,b)};f.Pc=!0;
f.N=function(){return Lb(this.Sa)};f.Kd=!0;f.jd=function(b,a,c){return Fp(C.b(this,a),vq.f?vq.f(this,a,c):vq.call(null,this,a,c))};f.ld=function(b,a,c){b=C.b(this,a);a=vq.f?vq.f(this,a,c):vq.call(null,this,a,c);return Ep(b,a,new Sp(null,null,null,null,null))};
f.kd=function(b,a,c,d){if(!p(wq.b?wq.b(this,a):wq.call(null,this,a)))throw Ri([r("Attribute"),r(X.h(E([a],0)))].join(""),"should be marked as :db/index true");b=Za(Za(Za(Za(Za(Jc,d),c),a),tl),no);uq.b?uq.b(a,b):uq.call(null,a,b);c=tq.R?tq.R(this,null,a,c,null):tq.call(null,this,null,a,c,null);a=tq.R?tq.R(this,null,a,d,null):tq.call(null,this,null,a,d,null);return Ep(this.Wa,c,a)};f.Rc=!0;f.hd=function(){return this.Xa};f.gd=function(b,a){return this.bb.call(null,a)};f.md=!0;
f.nd=function(b,a){var c=M(a,0),d=M(a,1),e=M(a,2),g=M(a,3),h=this.Sa,k=this.$a,m=this.Wa;return p(c)?p(d)?null!=e?p(g)?Fp(h,new Sp(c,d,e,g,null)):Fp(h,new Sp(c,d,e,null,null)):p(g)?Sf(function(a,b,c,d,e){return function(a){return B.b(e,a.tx)}}(a,c,d,e,g,h,k,m,this),Fp(h,new Sp(c,d,null,null,null))):Fp(h,new Sp(c,d,null,null,null)):null!=e?p(g)?Sf(function(a,b,c,d,e){return function(a){return B.b(d,a.v)&&B.b(e,a.tx)}}(a,c,d,e,g,h,k,m,this),Fp(h,new Sp(c,null,null,null,null))):Sf(function(a,b,c,d){return function(a){return B.b(d,
a.v)}}(a,c,d,e,g,h,k,m,this),Fp(h,new Sp(c,null,null,null,null))):p(g)?Sf(function(a,b,c,d,e){return function(a){return B.b(e,a.tx)}}(a,c,d,e,g,h,k,m,this),Fp(h,new Sp(c,null,null,null,null))):Fp(h,new Sp(c,null,null,null,null)):p(d)?null!=e?p(g)?p(wq.b?wq.b(this,d):wq.call(null,this,d))?Sf(function(a,b,c,d,e){return function(a){return B.b(e,a.tx)}}(a,c,d,e,g,h,k,m,this),Fp(m,new Sp(null,d,e,null,null))):Sf(function(a,b,c,d,e){return function(a){return B.b(d,a.v)&&B.b(e,a.tx)}}(a,c,d,e,g,h,k,m,this),
Fp(k,new Sp(null,d,null,null,null))):p(wq.b?wq.b(this,d):wq.call(null,this,d))?Fp(m,new Sp(null,d,e,null,null)):Sf(function(a,b,c,d){return function(a){return B.b(d,a.v)}}(a,c,d,e,g,h,k,m,this),Fp(k,new Sp(null,d,null,null,null))):p(g)?Sf(function(a,b,c,d,e){return function(a){return B.b(e,a.tx)}}(a,c,d,e,g,h,k,m,this),Fp(k,new Sp(null,d,null,null,null))):Fp(k,new Sp(null,d,null,null,null)):null!=e?p(g)?Sf(function(a,b,c,d,e){return function(a){return B.b(d,a.v)&&B.b(e,a.tx)}}(a,c,d,e,g,h,k,m,this),
h):Sf(function(a,b,c,d){return function(a){return B.b(d,a.v)}}(a,c,d,e,g,h,k,m,this),h):p(g)?Sf(function(a,b,c,d,e){return function(a){return B.b(e,a.tx)}}(a,c,d,e,g,h,k,m,this),h):h};function zq(b){var a=null!=b?b.md?!0:b.Cb?!1:La(eq,b):La(eq,b);return a?(a=null!=b?b.Kd?!0:b.Cb?!1:La(gq,b):La(gq,b))?null!=b?b.Rc?!0:b.Cb?!1:La(lq,b):La(lq,b):a:a}function Aq(b,a,c,d,e){this.Ya=b;this.hb=a;this.i=c;this.g=d;this.j=e;this.m=2229667594;this.F=8192}f=Aq.prototype;f.I=function(b,a){return gb.f(this,a,null)};
f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "unfiltered-db":return this.Ya;case "pred":return this.hb;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.db.FilteredDB{",", ","}",c,T.b(new U(null,2,5,W,[new U(null,2,5,W,[tn,this.Ya],null),new U(null,2,5,W,[Vj,this.hb],null)],null),this.g))};f.V=function(){return new Gg(0,this,2,new U(null,2,5,W,[tn,Vj],null),mc(this.g))};f.O=function(){return this.i};
f.T=function(){return 2+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,2,[Vj,null,tn,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new Aq(this.Ya,this.hb,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(tn,a):S.call(null,tn,a))?new Aq(c,this.hb,this.i,this.g,null):p(S.b?S.b(Vj,a):S.call(null,Vj,a))?new Aq(this.Ya,c,this.i,this.g,null):new Aq(this.Ya,this.hb,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,2,5,W,[new U(null,2,5,W,[tn,this.Ya],null),new U(null,2,5,W,[Vj,this.hb],null)],null),this.g))};f.P=function(b,a){return new Aq(this.Ya,this.hb,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};
f.Zc=!0;f.I=function(){throw Error("-lookup is not supported on FilteredDB");};f.H=function(){throw Error("-lookup is not supported on FilteredDB");};f.fa=!0;f.J=function(b,a,c){return sq.f?sq.f(this,a,c):sq.call(null,this,a,c)};f.Xc=!0;f.T=function(){return L(hq(this,Kl,rd))};f.Ad=!0;f.M=function(){return pq.c?pq.c(this):pq.call(null,this)};f.B=function(b,a){return qq.b?qq.b(this,a):qq.call(null,this,a)};f.ha=function(){throw Error("-empty is not supported on FilteredDB");};
f.Sb=function(){throw Error("-contains-key? is not supported on FilteredDB");};f.U=function(){throw Error("-assoc is not supported on FilteredDB");};f.Pc=!0;f.N=function(){return hq(this,Kl,rd)};f.Kd=!0;f.jd=function(b,a,c){return Sf(this.hb,hq(this.Ya,a,c))};f.ld=function(b,a,c){return Sf(this.hb,iq(this.Ya,a,c))};f.kd=function(b,a,c,d){return Sf(this.hb,jq(this.Ya,a,c,d))};f.Rc=!0;f.hd=function(){return mq(this.Ya)};f.gd=function(b,a){return nq(this.Ya,a)};f.md=!0;
f.nd=function(b,a){return Sf(this.hb,fq(this.Ya,a))};function Bq(b,a){return B.b(new U(null,2,5,W,[b,a],null),new U(null,2,5,W,[ul,!0],null))?new U(null,1,5,W,[ul],null):B.b(a,Hk)?new U(null,2,5,W,[Hk,xj],null):B.b(a,Fn)?new U(null,1,5,W,[Fn],null):B.b(a,rj)?new U(null,3,5,W,[Lj,rj,xj],null):B.b(a,Pl)?new U(null,3,5,W,[Lj,Pl,xj],null):B.b(new U(null,2,5,W,[b,a],null),new U(null,2,5,W,[xj,!0],null))?new U(null,1,5,W,[xj],null):null}
function Cq(b){var a=Vd;return w.f(function(b,d){var e=M(d,0),g=M(d,1);return $f.w(b,new U(null,1,5,W,[e],null),pf(qd,a),g)},Q,b)}
function Dq(b){return Cq(function(){return function c(b){return new Ke(null,function(){for(var e=b;;){var g=F(e);if(g){var h=g,k=G(h),m=M(k,0),n=M(k,1);if(g=F(function(b,c,d,e,g,h){return function K(k){return new Ke(null,function(b,c,d,e,g,h){return function(){for(var m=k;;){var n=F(m);if(n){var t=n,u=G(t),v=M(u,0),x=M(u,1);if(n=F(function(b,c,d,e,g,h,k,m,n,t,u,v){return function di(x){return new Ke(null,function(b,c,d,e,g,h,k,m,n){return function(){for(;;){var b=F(x);if(b){if(Kd(b)){var c=dc(b),
d=L(c),e=Oe(d);a:for(var g=0;;)if(g<d){var h=y.b(c,g);e.add(new U(null,2,5,W,[h,n],null));g+=1}else{c=!0;break a}return c?Pe(Re(e),di(ec(b))):Pe(Re(e),null)}e=G(b);return gd(new U(null,2,5,W,[e,n],null),di(Ic(b)))}return null}}}(b,c,d,e,g,h,k,m,n,t,u,v),null,null)}}(m,b,u,v,x,t,n,c,d,e,g,h)(Bq(v,x))))return T.b(n,K(Ic(m)));m=Ic(m)}else return null}}}(b,c,d,e,g,h),null,null)}}(e,k,m,n,h,g)(n)))return T.b(g,c(Ic(e)));e=Ic(e)}else return null}},null,null)}(b)}())}
function Eq(b,a,c,d){if(null!=c&&!Rd(d,c))throw Ri([r("Bad attribute specification for "),r(X.h(E([Tg([b,Tg([a,c])])],0))),r(", expected one of "),r(d)].join(""),new l(null,4,[en,mn,kj,b,Yj,a,Kk,c],null));}
function Fq(b){for(var a=F(b),c=null,d=0,e=0;;)if(e<d){var g=c.da(null,e),h=M(g,0),k=M(g,1),m=ul.b(k,!1);Eq(h,ul,ul.c(k),new Ud(null,new l(null,2,[!0,null,!1,null],null),null));if(p(function(){var a=m;return p(a)?$e.b(xk.c(k),Hk):a}()))throw Ri([r("Bad attribute specification for "),r(h),r(": {:db/isComponent true} should also have {:db/valueType :db.type/ref}")].join(""),new l(null,3,[en,mn,kj,h,Yj,ul],null));Eq(h,Lj,Lj.c(k),new Ud(null,new l(null,2,[rj,null,Pl,null],null),null));Eq(h,xk,xk.c(k),
new Ud(null,new l(null,1,[Hk,null],null),null));Eq(h,Mm,Mm.c(k),new Ud(null,new l(null,2,[Fn,null,lo,null],null),null));e+=1}else if(a=F(a)){if(Kd(a))d=dc(a),a=ec(a),c=d,d=L(d);else{var c=G(a),d=M(c,0),n=M(c,1),t=ul.b(n,!1);Eq(d,ul,ul.c(n),new Ud(null,new l(null,2,[!0,null,!1,null],null),null));if(p(function(){var a=t;return p(a)?$e.b(xk.c(n),Hk):a}()))throw Ri([r("Bad attribute specification for "),r(d),r(": {:db/isComponent true} should also have {:db/valueType :db.type/ref}")].join(""),new l(null,
3,[en,mn,kj,d,Yj,ul],null));Eq(d,Lj,Lj.c(n),new Ud(null,new l(null,2,[rj,null,Pl,null],null),null));Eq(d,xk,xk.c(n),new Ud(null,new l(null,1,[Hk,null],null),null));Eq(d,Mm,Mm.c(n),new Ud(null,new l(null,2,[Fn,null,lo,null],null),null));a=H(a);c=null;d=0}e=0}else break;return b}
var rq=function rq(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return rq.C();case 1:return rq.c(arguments[0]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};rq.C=function(){return rq.c(null)};rq.c=function(b){if(null!=b&&!Ed(b))throw Error([r("Assert failed: "),r(X.h(E([vc(Tl,vc(lm,Bk),vc(Nk,Bk))],0)))].join(""));return yq(new l(null,7,[ej,Fq(b),Kl,Hp(Yp),Uj,Hp(Zp),zk,Hp($p),Uk,0,Bj,536870912,Bn,Dq(b)],null))};
rq.A=1;var Gq=function Gq(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Gq.c(arguments[0]);case 2:return Gq.b(arguments[0],arguments[1]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};Gq.c=function(b){return Gq.b(b,null)};
Gq.b=function(b,a){if(Ad(b))return rq.c(a);var c=Fq(a),d=Dq(a),e=xj.c(d),g=Ea.c?Ea.c(b):Ea.call(null,b),h=Gp(g.sort(bq),Yp),k=Gp(g.sort(cq),Zp),m=w.f(function(a,b,c){return function(a,b){Rd(c,b.a)&&a.push(b);return a}}(c,d,e,g,h,k),[],b).sort(dq),n=Gp(m,$p),t=Bl.c(G(Qb(h))),c=ce(R.c(function(){return function(a){return a.tx}}(c,d,e,g,h,k,m,n,t)),me,536870912,h);return yq(new l(null,7,[ej,a,Kl,h,Uj,k,zk,n,Uk,t,Bj,c,Bn,d],null))};Gq.A=2;function oq(b){var a=b.j;return p(a)?a:b.j=Qc(hq(b,Kl,rd))}
function pq(b){var a=b.j;return p(a)?a:b.j=Qc(hq(b,Kl,rd))}function qq(b,a){var c=a instanceof xq||a instanceof Aq;if(c&&(c=B.b(mq(b),mq(a))))a:{var d=hq(b,Kl,rd),c=hq(a,Kl,rd),e=B.b(L(d),L(c));if(e)for(d=F(d),c=F(c);;){if(null==d){c=!0;break a}if(B.b(G(d),G(c)))d=H(d),c=H(c);else{c=!1;break a}}else c=e}return c}
function sq(b,a,c){Rb(a,"#datascript/DB {");Rb(a,":schema ");qg(mq(b),a,c);Rb(a,", :datoms ");Y(a,function(a,b,c){return Y(b,qg,"["," ","]",c,new U(null,4,5,W,[a.e,a.a,a.v,a.tx],null))},"["," ","]",c,hq(b,Kl,rd));return Rb(a,"}")}Hq;Iq;Jq;
function tq(b,a,c,d,e){if(p(c)){var g=Za(Za(Za(Za(Za(Za(Jc,e),d),c),a),tl),Jm);uq.b?uq.b(c,g):uq.call(null,c,g)}a=Iq.b?Iq.b(b,a):Iq.call(null,b,a);g=(g=null!=d)?Jq.b?Jq.b(b,c):Jq.call(null,b,c):g;return new Sp(a,c,p(g)?Hq.b?Hq.b(b,d):Hq.call(null,b,d):d,Iq.b?Iq.b(b,e):Iq.call(null,b,e),null)}
function vq(b,a,c){var d=M(c,0),e=M(c,1),g=M(c,2);c=M(c,3);switch(a instanceof q?a.W:null){case "eavt":return tq(b,d,e,g,c);case "aevt":return tq(b,e,d,g,c);case "avet":return tq(b,g,d,e,c);default:throw Error([r("No matching clause: "),r(a)].join(""));}}function Kq(b,a,c,d,e,g,h,k){this.sb=b;this.rb=a;this.ib=c;this.wb=d;this.jb=e;this.i=g;this.g=h;this.j=k;this.m=2229667594;this.F=8192}f=Kq.prototype;f.I=function(b,a){return gb.f(this,a,null)};
f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "db-before":return this.sb;case "db-after":return this.rb;case "tx-data":return this.ib;case "tempids":return this.wb;case "tx-meta":return this.jb;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.db.TxReport{",", ","}",c,T.b(new U(null,5,5,W,[new U(null,2,5,W,[Vl,this.sb],null),new U(null,2,5,W,[jk,this.rb],null),new U(null,2,5,W,[Zl,this.ib],null),new U(null,2,5,W,[dj,this.wb],null),new U(null,2,5,W,[Cn,this.jb],null)],null),this.g))};f.V=function(){return new Gg(0,this,5,new U(null,5,5,W,[Vl,jk,Zl,dj,Cn],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 5+L(this.g)};
f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,5,[dj,null,jk,null,Vl,null,Zl,null,Cn,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new Kq(this.sb,this.rb,this.ib,this.wb,this.jb,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(Vl,a):S.call(null,Vl,a))?new Kq(c,this.rb,this.ib,this.wb,this.jb,this.i,this.g,null):p(S.b?S.b(jk,a):S.call(null,jk,a))?new Kq(this.sb,c,this.ib,this.wb,this.jb,this.i,this.g,null):p(S.b?S.b(Zl,a):S.call(null,Zl,a))?new Kq(this.sb,this.rb,c,this.wb,this.jb,this.i,this.g,null):p(S.b?S.b(dj,a):S.call(null,dj,a))?new Kq(this.sb,this.rb,this.ib,c,this.jb,this.i,this.g,null):p(S.b?S.b(Cn,a):S.call(null,Cn,a))?new Kq(this.sb,this.rb,this.ib,this.wb,c,this.i,this.g,
null):new Kq(this.sb,this.rb,this.ib,this.wb,this.jb,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,5,5,W,[new U(null,2,5,W,[Vl,this.sb],null),new U(null,2,5,W,[jk,this.rb],null),new U(null,2,5,W,[Zl,this.ib],null),new U(null,2,5,W,[dj,this.wb],null),new U(null,2,5,W,[Cn,this.jb],null)],null),this.g))};f.P=function(b,a){return new Kq(this.sb,this.rb,this.ib,this.wb,this.jb,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};
function Lq(b){return new Kq(Vl.c(b),jk.c(b),Zl.c(b),dj.c(b),Cn.c(b),null,O.h(b,Vl,E([jk,Zl,dj,Cn],0)),null)}function Mq(b,a,c){return Rd(nq(b,c),a)}function Jq(b,a){return Mq(b,a,Hk)}function wq(b,a){return Mq(b,a,xj)}
function Nq(b,a){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(cl,tl)],0)))].join(""));if("number"===typeof a)return a;if(Dd(a)){if($e.b(L(a),2))throw Ri([r("Lookup ref should contain 2 elements: "),r(X.h(E([a],0)))].join(""),new l(null,2,[en,Fm,nl,a],null));if(Mq(b,G(a),rj))return null==nd(a)?null:Bl.c(G(hq(b,zk,a)));throw Ri([r("Lookup ref attribute should be marked as :db.unique/identity: "),r(X.h(E([a],0)))].join(""),new l(null,2,[en,pj,nl,a],null));}throw Ri([r("Expected number or lookup ref for entity id, got "),
r(X.h(E([a],0)))].join(""),new l(null,2,[en,Hm,nl,a],null));}function Hq(b,a){var c=Nq(b,a);if(p(c))return c;throw Ri([r("Nothing found for entity id "),r(X.h(E([a],0)))].join(""),new l(null,2,[en,Vm,nl,a],null));}function Iq(b,a){return p(a)?Hq(b,a):null}function uq(b,a){if(b instanceof q||"string"===typeof b)return null;throw Ri([r("Bad entity attribute "),r(X.h(E([b],0))),r(" at "),r(X.h(E([a],0))),r(", expected keyword or string")].join(""),new l(null,3,[en,Gn,kj,b,Ym,a],null));}
function Oq(b,a){if(null==b)throw Ri([r("Cannot store nil as a value at "),r(X.h(E([a],0)))].join(""),new l(null,3,[en,Gn,Kk,b,Ym,a],null));return null}function Pq(b){return Xf(b,new U(null,2,5,W,[Vl,Bj],null))+1}function Qq(b){return B.b(b,Bm)||B.b(b,":db/current-tx")}function Rq(b,a){return a>Uk.c(b)&&536870912>a?N.f(b,Uk,a):b}function Sq(b,a,c){b=Lp(a)?Zf(b,new U(null,2,5,W,[dj,a],null),c):b;a=Qq(a)?Zf(b,new U(null,2,5,W,[dj,a],null),c):b;return $f.w(a,new U(null,1,5,W,[jk],null),Rq,c)}
function Tq(b,a){var c;c=a.added;c=p(c)?Mq(b,a.a,Lj):c;if(p(c)&&(c=af(hq(b,zk,new U(null,2,5,W,[a.a,a.v],null))),p(c)))throw Ri([r("Cannot add "),r(X.h(E([a],0))),r(" because of unique constraint: "),r(X.h(E([c],0)))].join(""),new l(null,3,[en,Si,kj,a.a,ek,a],null));c=wq(b,a.a);if(p(a.added)){var d=$f.R(b,new U(null,1,5,W,[Kl],null),ip,a,bq),d=$f.R(d,new U(null,1,5,W,[Uj],null),ip,a,cq);c=c?$f.R(d,new U(null,1,5,W,[zk],null),ip,a,dq):d;return Rq(c,a.e)}d=G(fq(b,new U(null,3,5,W,[a.e,a.a,a.v],null)));
if(p(d)){var e=$f.R(b,new U(null,1,5,W,[Kl],null),jp,d,bq),e=$f.R(e,new U(null,1,5,W,[Uj],null),jp,d,cq);return c?$f.R(e,new U(null,1,5,W,[zk],null),jp,d,dq):e}return b}function Uq(b,a){return $f.w($f.w(b,new U(null,1,5,W,[jk],null),Tq,a),new U(null,1,5,W,[Zl],null),qd,a)}
function Vq(b){if(b instanceof q)return B.b("_",ud(xe(b),0));if("string"===typeof b)return Qd(Yh(/(?:([^\/]+)\/)?_([^\/]+)/,b));throw Ri([r("Bad attribute type: "),r(X.h(E([b],0))),r(", expected keyword or string")].join(""),new l(null,2,[en,Gn,kj,b],null));}
function Wq(b){if(b instanceof q)return Vq(b)?Je.b(Ie(b),we.b(xe(b),1)):Je.b(Ie(b),[r("_"),r(xe(b))].join(""));if("string"===typeof b){var a=Yh(/(?:([^\/]+)\/)?([^\/]+)/,b);M(a,0);b=M(a,1);a=M(a,2);return B.b("_",ud(a,0))?p(b)?[r(b),r("/"),r(we.b(a,1))].join(""):we.b(a,1):p(b)?[r(b),r("/_"),r(a)].join(""):[r("_"),r(a)].join("")}throw Ri([r("Bad attribute type: "),r(X.h(E([b],0))),r(", expected keyword or string")].join(""),new l(null,2,[en,Gn,kj,b],null));}
function Xq(b,a){var c=M(a,0),d=M(a,1),e=M(a,2),g=Um.c(b);if(null==g||0>g||null==a||g===c)return a;throw Ri([r("Conflicting upsert: "),r(X.h(E([new U(null,2,5,W,[d,e],null)],0))),r(" resolves to "),r(X.h(E([c],0))),r(", but entity already has :db/id "),r(X.h(E([g],0)))].join(""),new l(null,3,[en,Al,Un,b,to,a],null));}
function Yq(b,a){var c=af(nq(b,rj));return p(c)?G(Xq(a,ae(function(c){return function(e,g,h){if(Rd(c,g)){var k=Bl.c(G(hq(b,zk,new U(null,2,5,W,[g,h],null))));if(p(k)){if(null==e)return new U(null,3,5,W,[k,g,h],null);if(B.b(C.b(e,0),k))return e;var m=M(e,0),n=M(e,1);e=M(e,2);throw Ri([r("Conflicting upserts: "),r(X.h(E([new U(null,2,5,W,[n,e],null)],0))),r(" resolves to "),r(X.h(E([m],0))),r(", but "),r(X.h(E([new U(null,2,5,W,[g,h],null)],0))),r(" resolves to "),r(X.h(E([k],0)))].join(""),new l(null,
4,[en,Al,Un,a,to,new U(null,3,5,W,[k,g,h],null),fo,new U(null,3,5,W,[m,n,e],null)],null));}}return e}}(c,c),null,a))):null}function Zq(b,a,c){Vq(a)||Mq(b,a,Fn)?(a=Ia.c?Ia.c(c):Ia.call(null,c),a=p(a)?a:Bd(c)&&!Ed(c),b=Ka(a)?new U(null,1,5,W,[c],null):B.b(L(c),2)&&Mq(b,G(c),rj)?new U(null,1,5,W,[c],null):c):b=new U(null,1,5,W,[c],null);return b}
function $q(b,a){return function(a){return function e(g){return new Ke(null,function(a){return function(){for(var c=g;;){var m=F(c);if(m){var n=m,t=G(n),u=M(t,0),v=M(t,1);if($e.b(u,Um)){var x=uq(u,Tg([Um,a,u,v])),A=Vq(u),D=A?Wq(u):u;if(A&&!Jq(b,D))throw Ri([r("Bad attribute "),r(X.h(E([u],0))),r(": reverse attribute name requires {:db/valueType :db.type/ref} in schema")].join(""),new l(null,3,[en,Gn,kj,u,Ym,Tg([Um,a,u,v])],null));if(m=F(function(a,c,e,g,h,k,m,n,t,u,v){return function Ja(x){return new Ke(null,
function(a,c,e,g,h,k,m,n,t,u,v){return function(){for(;;){var a=F(x);if(a){if(Kd(a)){var c=dc(a),h=L(c),k=Oe(h);a:for(var n=0;;)if(n<h){var t=y.b(c,n),t=Jq(b,g)&&Ed(t)?N.f(t,Wq(m),v):e?new U(null,4,5,W,[nn,t,g,v],null):new U(null,4,5,W,[nn,v,g,t],null);k.add(t);n+=1}else{c=!0;break a}return c?Pe(Re(k),Ja(ec(a))):Pe(Re(k),null)}k=G(a);return gd(Jq(b,g)&&Ed(k)?N.f(k,Wq(m),v):e?new U(null,4,5,W,[nn,k,g,v],null):new U(null,4,5,W,[nn,v,g,k],null),Ja(Ic(a)))}return null}}}(a,c,e,g,h,k,m,n,t,u,v),null,null)}}(c,
x,A,D,null,t,u,v,n,m,a)(Zq(b,u,v))))return T.b(m,e(Ic(c)))}c=Ic(c)}else return null}}}(a),null,null)}}(Um.c(a))(a)}function ar(b,a){M(a,0);var c=M(a,1),d=M(a,2),e=M(a,3),g=M(a,4);uq(d,a);Oq(e,a);var g=p(g)?g:Pq(b),h=jk.c(b),c=Hq(h,c),e=Jq(h,d)?Hq(h,e):e,k=new Sp(c,d,e,g,!0);if(Mq(h,d,Fn))return Ad(fq(h,new U(null,3,5,W,[c,d,e],null)))?Uq(b,k):b;h=G(fq(h,new U(null,2,5,W,[c,d],null)));return p(h)?B.b(h.v,e)?b:Uq(Uq(b,new Sp(c,d,h.v,g,!1)),k):Uq(b,k)}
function br(b,a){var c=Pq(b);return Uq(b,new Sp(a.e,a.a,a.v,c,!1))}function cr(b,a){return Vf.f(Vd,mf.b(Rf(function(a){return Mq(b,a.a,ul)}),R.c(function(a){return new U(null,2,5,W,[Ll,a.v],null)})),a)}dr;
function er(b,a,c,d){if(Rd(dj.c(b),c))throw Ri([r("Conflicting upsert: "),r(X.h(E([c],0))),r(" resolves"),r(" both to "),r(X.h(E([d],0))),r(" and "),r(X.h(E([C.b(dj.c(b),c)],0)))].join(""),new l(null,1,[en,Al],null));b=Zf(b,new U(null,2,5,W,[dj,c],null),d);return dr.b?dr.b(b,a):dr.call(null,b,a)}
function dr(b,a){if(null!=a&&!Dd(a))throw Ri([r("Bad transaction data "),r(X.h(E([a],0))),r(", expected sequential collection")].join(""),new l(null,2,[en,Gn,Zl,a],null));for(var c=b,d=a;;){var e=d,g=M(e,0),h=ve(e,1),k=jk.c(c);if(null==g)return $f.f(Zf(c,new U(null,2,5,W,[dj,Bm],null),Pq(c)),new U(null,2,5,W,[jk,Bj],null),Xc);if(Ed(g)){var m=Um.c(g);if(Qq(m))var n=Pq(c),t=Sq(c,m,n),h=gd(N.f(g,Um,n),h),c=t,d=h;else if(Dd(m))n=Hq(k,m),t=c,h=gd(N.f(g,Um,n),h),c=t,d=h;else{var u=Yq(k,g);if(p(u)){var v=
u;if(Lp(m)&&Rd(dj.c(c),m)&&$e.b(v,C.b(dj.c(c),m)))return er(b,a,m,v);n=Sq(c,m,v);h=T.b($q(k,N.f(g,Um,v)),h);c=n;d=h}else if("number"===typeof m||null==m)n=null==m?Uk.c(k)+1:0>m?function(){var a=C.b(dj.c(c),m);return p(a)?a:Uk.c(k)+1}():m,t=N.f(g,Um,n),n=Sq(c,m,n),h=T.b($q(k,t),h),c=n,d=h;else throw Ri([r("Expected number or lookup ref for :db/id, got "),r(X.h(E([m],0)))].join(""),new l(null,2,[en,Hm,Un,g],null));}}else if(Dd(g)){var x=g,A=M(x,0),t=M(x,1),n=M(x,2),D=M(x,3);if(B.b(A,zl))t=g,u=M(t,0),
n=M(t,1),D=ve(t,2),t=c,h=T.b(Ta.f(n,k,D),h),c=t,d=h;else if(B.b(A,Gm)){var J=g,u=M(J,0),K=M(J,1),V=M(J,2),ha=M(J,3),xa=M(J,4),Ua=Hq(k,K),P=uq(V,g),rb=Jq(k,V)?Hq(k,ha):ha,pa=Jq(k,V)?Hq(k,xa):xa,wa=Oq(pa,g),ma=fq(k,new U(null,2,5,W,[Ua,V],null));if(Mq(k,V,Fn))if(p(hf(function(a,b,c,d,e,g,h,k,m,n,t){return function(a){return B.b(a.v,t)}}(c,d,J,u,K,V,ha,xa,Ua,P,rb,pa,wa,ma,x,A,t,n,D,e,g,h,k),ma)))c=n=ar(c,new U(null,4,5,W,[nn,Ua,V,pa],null)),d=h;else throw Ri([r(":db.fn/cas failed on datom ["),r(X.h(E([Ua],
0))),r(" "),r(X.h(E([V],0))),r(" "),r(X.h(E([R.b(Ij,ma)],0))),r("], expected "),r(X.h(E([rb],0)))].join(""),new l(null,4,[en,mj,uo,ma,Nm,rb,uk,pa],null));else if(t=Ij.c(G(ma)),B.b(t,rb))c=n=ar(c,new U(null,4,5,W,[nn,Ua,V,pa],null)),d=h;else throw Ri([r(":db.fn/cas failed on datom ["),r(X.h(E([Ua],0))),r(" "),r(X.h(E([V],0))),r(" "),r(X.h(E([t],0))),r("], expected "),r(X.h(E([rb],0)))].join(""),new l(null,4,[en,mj,uo,G(ma),Nm,rb,uk,pa],null));}else if(Qq(t))t=c,h=gd(new U(null,4,5,W,[A,Pq(c),n,D],
null),h),c=t,d=h;else if(Jq(k,n)&&Qq(D))D=c,h=gd(new U(null,4,5,W,[A,t,n,Pq(c)],null),h),c=D,d=h;else if(Lp(t)){if($e.b(A,nn))throw Ri(""+r("Negative entity ids are resolved for :db/add only"),new l(null,2,[en,Gn,ql,g],null));var v=Mq(k,n,rj)?Bl.c(G(hq(k,zk,new U(null,2,5,W,[n,D],null)))):null,Ga=Xf(c,new U(null,2,5,W,[dj,t],null));if(p(function(){var a=v;return p(a)?(a=Ga,p(a)?$e.b(v,Ga):a):a}()))return er(b,a,t,v);g=function(){var a=v;if(p(a))return a;a=Ga;return p(a)?a:Uk.c(k)+1}();t=Sq(c,t,g);
h=gd(new U(null,4,5,W,[A,g,n,D],null),h);c=t;d=h}else if(Jq(k,n)&&Lp(D))u=Xf(c,new U(null,2,5,W,[dj,D],null)),p(u)?(D=c,h=gd(new U(null,4,5,W,[A,t,n,u],null),h),c=D,d=h):(h=Sq(c,D,Uk.c(k)+1),n=d,c=h,d=n);else if(B.b(A,nn))c=n=ar(c,g),d=h;else if(B.b(A,dm))u=Nq(k,t),p(u)&&(K=u,t=Jq(k,n)?Hq(k,D):D,uq(n,g),Oq(t,g),n=G(fq(k,new U(null,3,5,W,[K,n,t],null))),p(n)&&(c=n=br(c,n))),d=h;else if(B.b(A,Em))u=Nq(k,t),p(u)&&(K=u,u=uq(n,g),ma=fq(k,new U(null,2,5,W,[K,n],null)),n=w.f(br,c,ma),h=T.b(cr(k,ma),h),c=
n),d=h;else if(B.b(A,Ll))u=Nq(k,t),p(u)&&(K=u,ma=fq(k,new U(null,1,5,W,[K],null)),n=Qf(function(a,b,c,d,e,g,h,k,m,n,t,u,v,x){return function(a){return fq(x,new U(null,3,5,W,[null,a,d],null))}}(c,d,ma,K,u,x,A,t,n,D,e,g,h,k),E([nq(k,Hk)],0)),n=w.f(br,c,T.b(ma,n)),h=T.b(cr(k,ma),h),c=n),d=h;else throw Ri([r("Unknown operation at "),r(X.h(E([g],0))),r(", expected :db/add, :db/retract, :db.fn/call, :db.fn/retractAttribute or :db.fn/retractEntity")].join(""),new l(null,3,[en,Gn,Pk,A,Zl,g],null));}else if(p(Up(g)))A=
g,t=M(A,0),n=M(A,1),D=M(A,2),g=M(A,3),A=M(A,4),p(A)?c=n=ar(c,new U(null,5,5,W,[nn,t,n,D,g],null)):(g=c,h=gd(new U(null,4,5,W,[dm,t,n,D],null),h),c=g),d=h;else throw Ri([r("Bad entity type at "),r(X.h(E([g],0))),r(", expected map or vector")].join(""),new l(null,2,[en,Gn,Zl,g],null));}};var fr;a:{var gr=aa.navigator;if(gr){var hr=gr.userAgent;if(hr){fr=hr;break a}}fr=""};var ir;function jr(b,a,c,d,e){for(var g=0;;)if(g<e)c[d+g]=b[a+g],g+=1;else break}function kr(b,a,c,d){this.head=b;this.ea=a;this.length=c;this.l=d}kr.prototype.pop=function(){if(0===this.length)return null;var b=this.l[this.ea];this.l[this.ea]=null;this.ea=(this.ea+1)%this.l.length;--this.length;return b};kr.prototype.unshift=function(b){this.l[this.head]=b;this.head=(this.head+1)%this.l.length;this.length+=1;return null};
kr.prototype.resize=function(){var b=Array(2*this.l.length);return this.ea<this.head?(jr(this.l,this.ea,b,0,this.length),this.ea=0,this.head=this.length,this.l=b):this.ea>this.head?(jr(this.l,this.ea,b,0,this.l.length-this.ea),jr(this.l,0,b,this.l.length-this.ea,this.head),this.ea=0,this.head=this.length,this.l=b):this.ea===this.head?(this.head=this.ea=0,this.l=b):null};if("undefined"===typeof lr)var lr={};var mr;
function nr(){var b=aa.MessageChannel;"undefined"===typeof b&&"undefined"!==typeof window&&window.postMessage&&window.addEventListener&&-1==fr.indexOf("Presto")&&(b=function(){var a=document.createElement("IFRAME");a.style.display="none";a.src="";document.documentElement.appendChild(a);var b=a.contentWindow,a=b.document;a.open();a.write("");a.close();var c="callImmediate"+Math.random(),d="file:"==b.location.protocol?"*":b.location.protocol+"//"+b.location.host,a=ga(function(a){if(("*"==d||a.origin==
d)&&a.data==c)this.port1.onmessage()},this);b.addEventListener("message",a,!1);this.port1={};this.port2={postMessage:function(){b.postMessage(c,d)}}});if("undefined"!==typeof b&&-1==fr.indexOf("Trident")&&-1==fr.indexOf("MSIE")){var a=new b,c={},d=c;a.port1.onmessage=function(){if(void 0!==c.next){c=c.next;var a=c.yd;c.yd=null;a()}};return function(b){d.next={yd:b};d=d.next;a.port2.postMessage(0)}}return"undefined"!==typeof document&&"onreadystatechange"in document.createElement("SCRIPT")?function(a){var b=
document.createElement("SCRIPT");b.onreadystatechange=function(){b.onreadystatechange=null;b.parentNode.removeChild(b);b=null;a();a=null};document.documentElement.appendChild(b)}:function(a){aa.setTimeout(a,0)}};var or;or=new kr(0,0,0,Array(32));var pr=!1,tr=!1;ur;function vr(){pr=!0;tr=!1;for(var b=0;;){var a=or.pop();if(null!=a&&(a.C?a.C():a.call(null),1024>b)){b+=1;continue}break}pr=!1;return 0<or.length?ur.C?ur.C():ur.call(null):null}function ur(){var b=tr;if(p(p(b)?pr:b))return null;tr=!0;"function"!=ba(aa.setImmediate)||aa.Window&&aa.Window.prototype&&aa.Window.prototype.setImmediate==aa.setImmediate?(mr||(mr=nr()),mr(vr)):aa.setImmediate(vr)};for(var wr=Array(1),xr=0;;)if(xr<wr.length)wr[xr]=null,xr+=1;else break;(function(b){"undefined"===typeof ir&&(ir=function(a,b,d){this.od=a;this.Qd=b;this.ie=d;this.m=393216;this.F=0},ir.prototype.P=function(a,b){return new ir(this.od,this.Qd,b)},ir.prototype.O=function(){return this.ie},ir.pd=function(){return new U(null,3,5,W,[Eo,Sj,qa.Ce],null)},ir.xc=!0,ir.Wb="cljs.core.async/t_cljs$core$async14387",ir.Qc=function(a,b){return Rb(b,"cljs.core.async/t_cljs$core$async14387")});return new ir(b,!0,Q)})(function(){return null});var yr=VDOM.diff,zr=VDOM.patch,Ar=VDOM.create;function Br(b){return Tf(Ha,Tf(Od,Uf(b)))}function Cr(b,a,c){return new VDOM.VHtml(xe(b),vi(a),vi(c))}function Dr(b,a,c){return new VDOM.VSvg(xe(b),vi(a),vi(c))}Er;
var Fr=function Fr(a){if(null==a)return new VDOM.VText("");if(Od(a))return Cr(Wl,Q,R.b(Fr,Br(a)));if("string"===typeof a||"number"===typeof a)return new VDOM.VText(a);if(B.b(Rm,G(a)))return Er.c?Er.c(a):Er.call(null,a);var c=M(a,0),d=M(a,1);a=ve(a,2);return Cr(c,d,R.b(Fr,Br(a)))},Er=function Er(a){if(null==a)return new VDOM.VText("");if("string"===typeof a||"number"===typeof a)return new VDOM.VText(a);if(B.b(Bo,G(a))){var c=M(a,0),d=M(a,1);a=ve(a,2);return Dr(c,d,R.b(Fr,Br(a)))}c=M(a,0);d=M(a,1);
a=ve(a,2);return Dr(c,d,R.b(Er,Br(a)))};
function Gr(){var b=document.getElementById("app"),a=function(){var a=new VDOM.VText("");return sf.c?sf.c(a):sf.call(null,a)}(),c=function(){var b;b=I.c?I.c(a):I.call(null,a);b=Ar.c?Ar.c(b):Ar.call(null,b);return sf.c?sf.c(b):sf.call(null,b)}(),d=null==window.requestAnimationFrame?function(){return function(a){return a.C?a.C():a.call(null)}}(a,c):function(){return function(a){return window.requestAnimationFrame(a)}}(a,c);b.appendChild(I.c?I.c(c):I.call(null,c));return function(a,b,c){return function(d){var m=
Fr(d);d=function(){var b=I.c?I.c(a):I.call(null,a);return yr.b?yr.b(b,m):yr.call(null,b,m)}();uf.b?uf.b(a,m):uf.call(null,a,m);d=function(a,b,c,d){return function(){return xf.f(d,zr,b)}}(m,d,a,b,c);return c.c?c.c(d):c.call(null,d)}}(a,c,d)};var Hr=Math.E,Ir=Math.PI,Jr=2*Ir;function Kr(b){return b*b}function Lr(b){return 1/180*Ir*b}function Mr(b,a){return Math.abs(b-a)}function Nr(b,a,c){for(;;){var d=c-(b.c?b.c(c):b.call(null,c))/(a.c?a.c(c):a.call(null,c));if(1E-7>Mr(c,d))return d;c=d}}function Or(b,a){return Gf(61,Mf(function(a,b){return function(a){var c=new Date;c.setTime(a.getTime()+1E3*-b);return c}}(60,a/60),b))}function Pr(b){return 86400*b}function Qr(b,a){return R.b(function(b){return w.b(de,R.f(fe,b,a))},b)}
function Rr(b){return new U(null,3,5,W,[new U(null,3,5,W,[Math.cos(b),-Math.sin(b),0],null),new U(null,3,5,W,[Math.sin(b),Math.cos(b),0],null),new U(null,3,5,W,[0,0,1],null)],null)}function Sr(b){Wf.b(function(a){return a/2},b)};function Tr(b,a){function c(c){return c-b*Math.sin(c)-a}return Nr(c,function(){return function(a){return 1-b*Math.cos(a)}}(c),a)};function Ur(b,a){var c=Ta.f(Qh,b,a);return gd(c,Tf(function(a){return function(b){return a===b}}(c),a))}function Vr(b,a){return L(b)<L(a)?w.f(qd,a,b):w.f(qd,b,a)}var Wr=function Wr(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Wr.c(arguments[0]);case 2:return Wr.b(arguments[0],arguments[1]);default:return Wr.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};Wr.c=function(b){return b};
Wr.b=function(b,a){for(;;)if(L(a)<L(b)){var c=b;b=a;a=c}else return w.f(function(a,b){return function(a,c){return Rd(b,c)?a:zd.b(a,c)}}(b,a),b,b)};Wr.h=function(b,a,c){b=Ur(function(a){return-L(a)},qd.h(c,a,E([b],0)));return w.f(Wr,G(b),Ic(b))};Wr.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return Wr.h(a,b,c)};Wr.A=2;
var Xr=function Xr(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Xr.c(arguments[0]);case 2:return Xr.b(arguments[0],arguments[1]);default:return Xr.h(arguments[0],arguments[1],new Hc(c.slice(2),0))}};Xr.c=function(b){return b};Xr.b=function(b,a){return L(b)<L(a)?w.f(function(b,d){return Rd(a,d)?zd.b(b,d):b},b,b):w.f(zd,b,a)};Xr.h=function(b,a,c){return w.f(Xr,b,qd.b(c,a))};
Xr.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return Xr.h(a,b,c)};Xr.A=2;Z;function Yr(){}var Zr=function Zr(a,c,d){if(null!=a&&null!=a.la)return a.la(a,c,d);var e=Zr[ba(null==a?null:a)];if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);e=Zr._;if(null!=e)return e.f?e.f(a,c,d):e.call(null,a,c,d);throw Na("ITraversable.-collect",a);},$r=function $r(a,c){if(null!=a&&null!=a.ma)return a.ma(a,c);var d=$r[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=$r._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("ITraversable.-collect-vars",a);};
function as(b,a){return Dd(b)&&B.b(L(b),a)}function bs(b,a){return Dd(a)?w.f(function(a,d){var e=b.c?b.c(d):b.call(null,d);return p(e)?qd.b(a,e):Zc(null)},rd,a):null}function cs(b){for(var a=[],c=arguments.length,d=0;;)if(d<c)a.push(arguments[d]),d+=1;else break;return ds(arguments[0],arguments[1],2<a.length?new Hc(a.slice(2),0):null)}
function ds(b,a,c){var d=M(c,0),e=p(d)?d:rd;return p(b.c?b.c(a):b.call(null,a))?qd.b(e,a):(null!=a?a.ka||(a.Cb?0:La(Yr,a)):La(Yr,a))?Zr(a,b,e):p(Pd.c?Pd.c(a):Pd.call(null,a))?w.f(function(){return function(a,c){return ds(b,c,E([a],0))}}(e,c,d),e,a):e}function es(b){var a=Ad(b);return a?a:Ta.b(Sd,b)}function fs(b,a){return Wc(b,new l(null,1,[rl,a],null))}function gs(b){var a=rl.c(yd(b));return p(a)?a:b}function hs(b,a,c){this.i=b;this.g=a;this.j=c;this.m=2229667594;this.F=8192}f=hs.prototype;
f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a){default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.Placeholder{",", ","}",c,T.b(rd,this.g))};f.V=function(){return new Gg(0,this,0,rd,mc(this.g))};f.O=function(){return this.i};f.T=function(){return 0+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(Vd,a)?O.b(Wc(Vf.b(Q,this),this.i),a):new hs(this.i,af(O.b(this.g,a)),null)};f.U=function(b,a,c){return new hs(this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(rd,this.g))};f.P=function(b,a){return new hs(a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return c};f.ma=function(b,a){return a};
function is(b,a,c,d){this.symbol=b;this.i=a;this.g=c;this.j=d;this.m=2229667594;this.F=8192}f=is.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "symbol":return this.symbol;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.Variable{",", ","}",c,T.b(new U(null,1,5,W,[new U(null,2,5,W,[yk,this.symbol],null)],null),this.g))};
f.V=function(){return new Gg(0,this,1,new U(null,1,5,W,[yk],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 1+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,1,[yk,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new is(this.symbol,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(yk,a):S.call(null,yk,a))?new is(c,this.i,this.g,null):new is(this.symbol,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,1,5,W,[new U(null,2,5,W,[yk,this.symbol],null)],null),this.g))};f.P=function(b,a){return new is(this.symbol,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.symbol,E([c],0))};
f.ma=function(b,a){return Z.b?Z.b(a,this.symbol):Z.call(null,a,this.symbol)};function js(b,a,c,d){this.symbol=b;this.i=a;this.g=c;this.j=d;this.m=2229667594;this.F=8192}f=js.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "symbol":return this.symbol;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.SrcVar{",", ","}",c,T.b(new U(null,1,5,W,[new U(null,2,5,W,[yk,this.symbol],null)],null),this.g))};f.V=function(){return new Gg(0,this,1,new U(null,1,5,W,[yk],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 1+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,1,[yk,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new js(this.symbol,this.i,af(O.b(this.g,a)),null)};f.U=function(b,a,c){return p(S.b?S.b(yk,a):S.call(null,yk,a))?new js(c,this.i,this.g,null):new js(this.symbol,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,1,5,W,[new U(null,2,5,W,[yk,this.symbol],null)],null),this.g))};
f.P=function(b,a){return new js(this.symbol,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.symbol,E([c],0))};f.ma=function(b,a){return Z.b?Z.b(a,this.symbol):Z.call(null,a,this.symbol)};function ks(b,a,c){this.i=b;this.g=a;this.j=c;this.m=2229667594;this.F=8192}f=ks.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a){default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.DefaultSrc{",", ","}",c,T.b(rd,this.g))};f.V=function(){return new Gg(0,this,0,rd,mc(this.g))};f.O=function(){return this.i};f.T=function(){return 0+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};
f.Y=function(b,a){return Rd(Vd,a)?O.b(Wc(Vf.b(Q,this),this.i),a):new ks(this.i,af(O.b(this.g,a)),null)};f.U=function(b,a,c){return new ks(this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(rd,this.g))};f.P=function(b,a){return new ks(a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return c};f.ma=function(b,a){return a};function ls(b,a,c){this.i=b;this.g=a;this.j=c;this.m=2229667594;this.F=8192}f=ls.prototype;
f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a){default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.RulesVar{",", ","}",c,T.b(rd,this.g))};f.V=function(){return new Gg(0,this,0,rd,mc(this.g))};f.O=function(){return this.i};f.T=function(){return 0+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(Vd,a)?O.b(Wc(Vf.b(Q,this),this.i),a):new ls(this.i,af(O.b(this.g,a)),null)};f.U=function(b,a,c){return new ls(this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(rd,this.g))};f.P=function(b,a){return new ls(a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return c};f.ma=function(b,a){return a};
function ms(b,a,c,d){this.value=b;this.i=a;this.g=c;this.j=d;this.m=2229667594;this.F=8192}f=ms.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "value":return this.value;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.Constant{",", ","}",c,T.b(new U(null,1,5,W,[new U(null,2,5,W,[Kk,this.value],null)],null),this.g))};
f.V=function(){return new Gg(0,this,1,new U(null,1,5,W,[Kk],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 1+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,1,[Kk,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new ms(this.value,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(Kk,a):S.call(null,Kk,a))?new ms(c,this.i,this.g,null):new ms(this.value,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,1,5,W,[new U(null,2,5,W,[Kk,this.value],null)],null),this.g))};f.P=function(b,a){return new ms(this.value,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.value,E([c],0))};
f.ma=function(b,a){return Z.b?Z.b(a,this.value):Z.call(null,a,this.value)};function ns(b,a,c,d){this.symbol=b;this.i=a;this.g=c;this.j=d;this.m=2229667594;this.F=8192}f=ns.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "symbol":return this.symbol;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.PlainSymbol{",", ","}",c,T.b(new U(null,1,5,W,[new U(null,2,5,W,[yk,this.symbol],null)],null),this.g))};f.V=function(){return new Gg(0,this,1,new U(null,1,5,W,[yk],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 1+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,1,[yk,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new ns(this.symbol,this.i,af(O.b(this.g,a)),null)};f.U=function(b,a,c){return p(S.b?S.b(yk,a):S.call(null,yk,a))?new ns(c,this.i,this.g,null):new ns(this.symbol,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,1,5,W,[new U(null,2,5,W,[yk,this.symbol],null)],null),this.g))};
f.P=function(b,a){return new ns(this.symbol,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.symbol,E([c],0))};f.ma=function(b,a){return Z.b?Z.b(a,this.symbol):Z.call(null,a,this.symbol)};function os(b){return b instanceof z&&B.b(G(xe(b)),"?")?new is(b,null,null,null):null}function ps(b){return b instanceof z&&B.b(G(xe(b)),"$")?new js(b,null,null,null):null}
function qs(b){return b instanceof z?null:new ms(b,null,null,null)}function rs(b){return b instanceof z&&Ka(os(b))&&Ka(ps(b))&&Ka(B.b(Dl,b)?new ls(null,null,null):null)&&Ka(B.b(wl,b)?new hs(null,null,null):null)?new ns(b,null,null,null):null}function ss(b){return p(rs(b))?new is(b,null,null,null):null}function ts(b){var a=os(b);if(p(a))return a;a=qs(b);return p(a)?a:ps(b)}function us(b,a,c,d,e){this.required=b;this.Eb=a;this.i=c;this.g=d;this.j=e;this.m=2229667594;this.F=8192}f=us.prototype;
f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "required":return this.required;case "free":return this.Eb;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.RuleVars{",", ","}",c,T.b(new U(null,2,5,W,[new U(null,2,5,W,[mo,this.required],null),new U(null,2,5,W,[sk,this.Eb],null)],null),this.g))};
f.V=function(){return new Gg(0,this,2,new U(null,2,5,W,[mo,sk],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 2+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,2,[sk,null,mo,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new us(this.required,this.Eb,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(mo,a):S.call(null,mo,a))?new us(c,this.Eb,this.i,this.g,null):p(S.b?S.b(sk,a):S.call(null,sk,a))?new us(this.required,c,this.i,this.g,null):new us(this.required,this.Eb,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,2,5,W,[new U(null,2,5,W,[mo,this.required],null),new U(null,2,5,W,[sk,this.Eb],null)],null),this.g))};f.P=function(b,a){return new us(this.required,this.Eb,a,this.g,this.j)};
f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.Eb,E([ds(a,this.required,E([c],0))],0))};f.ma=function(b,a){var c=Z.b?Z.b(a,this.required):Z.call(null,a,this.required),d=this.Eb;return Z.b?Z.b(c,d):Z.call(null,c,d)};function vs(b,a,c){this.i=b;this.g=a;this.j=c;this.m=2229667594;this.F=8192}f=vs.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a){default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.BindIgnore{",", ","}",c,T.b(rd,this.g))};f.V=function(){return new Gg(0,this,0,rd,mc(this.g))};f.O=function(){return this.i};f.T=function(){return 0+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};
f.Y=function(b,a){return Rd(Vd,a)?O.b(Wc(Vf.b(Q,this),this.i),a):new vs(this.i,af(O.b(this.g,a)),null)};f.U=function(b,a,c){return new vs(this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(rd,this.g))};f.P=function(b,a){return new vs(a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return c};f.ma=function(b,a){return a};function ws(b,a,c,d){this.ua=b;this.i=a;this.g=c;this.j=d;this.m=2229667594;this.F=8192}f=ws.prototype;
f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "variable":return this.ua;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.BindScalar{",", ","}",c,T.b(new U(null,1,5,W,[new U(null,2,5,W,[Pj,this.ua],null)],null),this.g))};f.V=function(){return new Gg(0,this,1,new U(null,1,5,W,[Pj],null),mc(this.g))};f.O=function(){return this.i};
f.T=function(){return 1+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,1,[Pj,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new ws(this.ua,this.i,af(O.b(this.g,a)),null)};f.U=function(b,a,c){return p(S.b?S.b(Pj,a):S.call(null,Pj,a))?new ws(c,this.i,this.g,null):new ws(this.ua,this.i,N.f(this.g,a,c),null)};
f.N=function(){return F(T.b(new U(null,1,5,W,[new U(null,2,5,W,[Pj,this.ua],null)],null),this.g))};f.P=function(b,a){return new ws(this.ua,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.ua,E([c],0))};f.ma=function(b,a){return Z.b?Z.b(a,this.ua):Z.call(null,a,this.ua)};function xs(b,a,c,d){this.yb=b;this.i=a;this.g=c;this.j=d;this.m=2229667594;this.F=8192}f=xs.prototype;f.I=function(b,a){return gb.f(this,a,null)};
f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "bindings":return this.yb;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.BindTuple{",", ","}",c,T.b(new U(null,1,5,W,[new U(null,2,5,W,[wk,this.yb],null)],null),this.g))};f.V=function(){return new Gg(0,this,1,new U(null,1,5,W,[wk],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 1+L(this.g)};
f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,1,[wk,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new xs(this.yb,this.i,af(O.b(this.g,a)),null)};f.U=function(b,a,c){return p(S.b?S.b(wk,a):S.call(null,wk,a))?new xs(c,this.i,this.g,null):new xs(this.yb,this.i,N.f(this.g,a,c),null)};
f.N=function(){return F(T.b(new U(null,1,5,W,[new U(null,2,5,W,[wk,this.yb],null)],null),this.g))};f.P=function(b,a){return new xs(this.yb,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.yb,E([c],0))};f.ma=function(b,a){return Z.b?Z.b(a,this.yb):Z.call(null,a,this.yb)};function ys(b,a,c,d){this.va=b;this.i=a;this.g=c;this.j=d;this.m=2229667594;this.F=8192}f=ys.prototype;f.I=function(b,a){return gb.f(this,a,null)};
f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "binding":return this.va;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.BindColl{",", ","}",c,T.b(new U(null,1,5,W,[new U(null,2,5,W,[fm,this.va],null)],null),this.g))};f.V=function(){return new Gg(0,this,1,new U(null,1,5,W,[fm],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 1+L(this.g)};
f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,1,[fm,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new ys(this.va,this.i,af(O.b(this.g,a)),null)};f.U=function(b,a,c){return p(S.b?S.b(fm,a):S.call(null,fm,a))?new ys(c,this.i,this.g,null):new ys(this.va,this.i,N.f(this.g,a,c),null)};
f.N=function(){return F(T.b(new U(null,1,5,W,[new U(null,2,5,W,[fm,this.va],null)],null),this.g))};f.P=function(b,a){return new ys(this.va,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.va,E([c],0))};f.ma=function(b,a){return Z.b?Z.b(a,this.va):Z.call(null,a,this.va)};As;function Bs(b){return B.b(wl,b)?fs(new vs(null,null,null),b):null}
function Cs(b){if(p(function(){var a=as(b,2);return p(a)?B.b(nd(b),Pn):a}())){var a=function(){var a=G(b);return As.c?As.c(a):As.call(null,a)}();if(p(a))return fs(new ys(a,null,null,null),b);throw Ri(""+r("Cannot parse collection binding"),new l(null,2,[en,hn,qn,b],null));}return null}function Ds(b){var a=Bs(b);return p(a)?a:As.c?As.c(b):As.call(null,b)}
function Es(b){var a=bs(Ds,b);if(p(a)){if(Ad(a))throw Ri(""+r("Tuple binding cannot be empty"),new l(null,2,[en,hn,qn,b],null));return fs(new xs(a,null,null,null),b)}return null}
function As(b){var a=Cs(b);if(p(a))return a;a=as(b,1);a=p(a)?Dd(G(b)):a;a=p(a)?fs(new ys(Es(G(b)),null,null,null),b):null;if(p(a))return a;a=Es(b);if(p(a))return a;a=Bs(b);if(p(a))return a;a=os(b);a=p(a)?fs(new ws(a,null,null,null),b):null;if(p(a))return a;throw Ri(""+r("Cannot parse binding, expected (bind-scalar | bind-tuple | bind-coll | bind-rel)"),new l(null,2,[en,hn,qn,b],null));}
var Fs=function Fs(a){if(null!=a&&null!=a.Sc)return a.Sc(a);var c=Fs[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=Fs._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IFindVars.-find-vars",a);};is.prototype.Sc=function(){return new U(null,1,5,W,[this.symbol],null)};function Gs(b,a,c,d,e){this.$=b;this.Z=a;this.i=c;this.g=d;this.j=e;this.m=2229667594;this.F=8192}f=Gs.prototype;f.Sc=function(){return Fs(pd(this.Z))};f.I=function(b,a){return gb.f(this,a,null)};
f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "fn":return this.$;case "args":return this.Z;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.Aggregate{",", ","}",c,T.b(new U(null,2,5,W,[new U(null,2,5,W,[Jj,this.$],null),new U(null,2,5,W,[Vi,this.Z],null)],null),this.g))};f.V=function(){return new Gg(0,this,2,new U(null,2,5,W,[Jj,Vi],null),mc(this.g))};f.O=function(){return this.i};
f.T=function(){return 2+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,2,[Vi,null,Jj,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new Gs(this.$,this.Z,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(Jj,a):S.call(null,Jj,a))?new Gs(c,this.Z,this.i,this.g,null):p(S.b?S.b(Vi,a):S.call(null,Vi,a))?new Gs(this.$,c,this.i,this.g,null):new Gs(this.$,this.Z,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,2,5,W,[new U(null,2,5,W,[Jj,this.$],null),new U(null,2,5,W,[Vi,this.Z],null)],null),this.g))};f.P=function(b,a){return new Gs(this.$,this.Z,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;
f.la=function(b,a,c){return ds(a,this.Z,E([ds(a,this.$,E([c],0))],0))};f.ma=function(b,a){var c=Z.b?Z.b(a,this.$):Z.call(null,a,this.$),d=this.Z;return Z.b?Z.b(c,d):Z.call(null,c,d)};function Hs(b,a,c,d,e,g){this.source=b;this.ua=a;this.pattern=c;this.i=d;this.g=e;this.j=g;this.m=2229667594;this.F=8192}f=Hs.prototype;f.Sc=function(){return Fs(this.ua)};f.I=function(b,a){return gb.f(this,a,null)};
f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "source":return this.source;case "variable":return this.ua;case "pattern":return this.pattern;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.Pull{",", ","}",c,T.b(new U(null,3,5,W,[new U(null,2,5,W,[rl,this.source],null),new U(null,2,5,W,[Pj,this.ua],null),new U(null,2,5,W,[Ao,this.pattern],null)],null),this.g))};
f.V=function(){return new Gg(0,this,3,new U(null,3,5,W,[rl,Pj,Ao],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 3+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};
f.Y=function(b,a){return Rd(new Ud(null,new l(null,3,[Pj,null,rl,null,Ao,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new Hs(this.source,this.ua,this.pattern,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(rl,a):S.call(null,rl,a))?new Hs(c,this.ua,this.pattern,this.i,this.g,null):p(S.b?S.b(Pj,a):S.call(null,Pj,a))?new Hs(this.source,c,this.pattern,this.i,this.g,null):p(S.b?S.b(Ao,a):S.call(null,Ao,a))?new Hs(this.source,this.ua,c,this.i,this.g,null):new Hs(this.source,this.ua,this.pattern,this.i,N.f(this.g,a,c),null)};
f.N=function(){return F(T.b(new U(null,3,5,W,[new U(null,2,5,W,[rl,this.source],null),new U(null,2,5,W,[Pj,this.ua],null),new U(null,2,5,W,[Ao,this.pattern],null)],null),this.g))};f.P=function(b,a){return new Hs(this.source,this.ua,this.pattern,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.pattern,E([ds(a,this.ua,E([ds(a,this.source,E([c],0))],0))],0))};
f.ma=function(b,a){var c;c=Z.b?Z.b(a,this.source):Z.call(null,a,this.source);var d=this.ua;c=Z.b?Z.b(c,d):Z.call(null,c,d);d=this.pattern;return Z.b?Z.b(c,d):Z.call(null,c,d)};var Is=function Is(a){if(null!=a&&null!=a.yc)return a.yc(a);var c=Is[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=Is._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IFindElements.find-elements",a);};function Js(b,a,c,d){this.elements=b;this.i=a;this.g=c;this.j=d;this.m=2229667594;this.F=8192}f=Js.prototype;
f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "elements":return this.elements;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.FindRel{",", ","}",c,T.b(new U(null,1,5,W,[new U(null,2,5,W,[Fl,this.elements],null)],null),this.g))};f.V=function(){return new Gg(0,this,1,new U(null,1,5,W,[Fl],null),mc(this.g))};f.O=function(){return this.i};
f.T=function(){return 1+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,1,[Fl,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new Js(this.elements,this.i,af(O.b(this.g,a)),null)};f.yc=function(){return this.elements};
f.U=function(b,a,c){return p(S.b?S.b(Fl,a):S.call(null,Fl,a))?new Js(c,this.i,this.g,null):new Js(this.elements,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,1,5,W,[new U(null,2,5,W,[Fl,this.elements],null)],null),this.g))};f.P=function(b,a){return new Js(this.elements,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.elements,E([c],0))};
f.ma=function(b,a){return Z.b?Z.b(a,this.elements):Z.call(null,a,this.elements)};function Ks(b,a,c,d){this.element=b;this.i=a;this.g=c;this.j=d;this.m=2229667594;this.F=8192}f=Ks.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "element":return this.element;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.FindColl{",", ","}",c,T.b(new U(null,1,5,W,[new U(null,2,5,W,[Zj,this.element],null)],null),this.g))};f.V=function(){return new Gg(0,this,1,new U(null,1,5,W,[Zj],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 1+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,1,[Zj,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new Ks(this.element,this.i,af(O.b(this.g,a)),null)};f.yc=function(){return new U(null,1,5,W,[this.element],null)};f.U=function(b,a,c){return p(S.b?S.b(Zj,a):S.call(null,Zj,a))?new Ks(c,this.i,this.g,null):new Ks(this.element,this.i,N.f(this.g,a,c),null)};
f.N=function(){return F(T.b(new U(null,1,5,W,[new U(null,2,5,W,[Zj,this.element],null)],null),this.g))};f.P=function(b,a){return new Ks(this.element,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.element,E([c],0))};f.ma=function(b,a){return Z.b?Z.b(a,this.element):Z.call(null,a,this.element)};function Ls(b,a,c,d){this.element=b;this.i=a;this.g=c;this.j=d;this.m=2229667594;this.F=8192}f=Ls.prototype;
f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "element":return this.element;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.FindScalar{",", ","}",c,T.b(new U(null,1,5,W,[new U(null,2,5,W,[Zj,this.element],null)],null),this.g))};f.V=function(){return new Gg(0,this,1,new U(null,1,5,W,[Zj],null),mc(this.g))};f.O=function(){return this.i};
f.T=function(){return 1+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,1,[Zj,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new Ls(this.element,this.i,af(O.b(this.g,a)),null)};f.yc=function(){return new U(null,1,5,W,[this.element],null)};
f.U=function(b,a,c){return p(S.b?S.b(Zj,a):S.call(null,Zj,a))?new Ls(c,this.i,this.g,null):new Ls(this.element,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,1,5,W,[new U(null,2,5,W,[Zj,this.element],null)],null),this.g))};f.P=function(b,a){return new Ls(this.element,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.element,E([c],0))};
f.ma=function(b,a){return Z.b?Z.b(a,this.element):Z.call(null,a,this.element)};function Ms(b,a,c,d){this.elements=b;this.i=a;this.g=c;this.j=d;this.m=2229667594;this.F=8192}f=Ms.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "elements":return this.elements;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.FindTuple{",", ","}",c,T.b(new U(null,1,5,W,[new U(null,2,5,W,[Fl,this.elements],null)],null),this.g))};f.V=function(){return new Gg(0,this,1,new U(null,1,5,W,[Fl],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 1+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,1,[Fl,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new Ms(this.elements,this.i,af(O.b(this.g,a)),null)};f.yc=function(){return this.elements};f.U=function(b,a,c){return p(S.b?S.b(Fl,a):S.call(null,Fl,a))?new Ms(c,this.i,this.g,null):new Ms(this.elements,this.i,N.f(this.g,a,c),null)};
f.N=function(){return F(T.b(new U(null,1,5,W,[new U(null,2,5,W,[Fl,this.elements],null)],null),this.g))};f.P=function(b,a){return new Ms(this.elements,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.elements,E([c],0))};f.ma=function(b,a){return Z.b?Z.b(a,this.elements):Z.call(null,a,this.elements)};function Ns(b){return b instanceof Gs}function Os(b){return b instanceof Hs}
function Ps(b){var a=os(b);if(p(a))return a;a:{if(Dd(b)&&B.b(G(b),tj)){if(3<=L(b)&&4>=L(b)){var c=(a=B.b(L(b),4))?ud(b,1):ym,a=a?H(H(b)):H(b),d=M(a,0),a=M(a,1),c=ps(c),d=os(d);var e=os(a);p(e)?a=e:(e=ss(a),a=p(e)?e:qs(a));if(p(p(c)?p(d)?a:d:c)){a=new Hs(c,d,a,null,null,null);break a}}throw Ri(""+r("Cannot parse pull expression, expect ['pull' src-var? variable (constant | variable | plain-symbol)]"),new l(null,2,[en,jj,ok,b],null));}a=null}if(p(a))return a;a:{if(Dd(b)&&B.b(G(b),lj)){if(3<=L(b)&&(M(b,
0),c=M(b,1),a=ve(b,2),c=os(c),a=bs(ts,a),p(p(c)?a:c))){a=new Gs(c,a,null,null,null);break a}throw Ri(""+r("Cannot parse custom aggregate call, expect ['aggregate' variable fn-arg+]"),new l(null,2,[en,jj,ok,b],null));}a=null}p(a)?b=a:Dd(b)&&2<=L(b)?(a=M(b,0),b=ve(b,1),a=rs(a),b=bs(ts,b),b=p(p(a)?b:a)?new Gs(a,b,null,null,null):null):b=null;return b}
function Qs(b){var a;a=bs(Ps,b);a=null==a?null:new Js(a,null,null,null);if(p(a))return a;a:{if(Dd(b)&&B.b(L(b),1)&&(a=G(b),Dd(a)&&B.b(L(a),2)&&B.b(nd(a),Pn))){a=Ps(G(a));a=null==a?null:new Ks(a,null,null,null);break a}a=null}if(p(a))return a;Dd(b)&&B.b(L(b),2)&&B.b(nd(b),xn)?(a=Ps(G(b)),a=null==a?null:new Ls(a,null,null,null)):a=null;if(p(a))return a;Dd(b)&&B.b(L(b),1)?(a=G(b),a=bs(Ps,a),a=null==a?null:new Ms(a,null,null,null)):a=null;if(p(a))return a;throw Ri(""+r("Cannot parse :find, expected: (find-rel | find-coll | find-tuple | find-scalar)"),
new l(null,2,[en,jj,ok,b],null));}function Rs(b){var a;a=ps(b);p(a)||(a=B.b(Dl,b)?new ls(null,null,null):null,a=p(a)?a:ss(b));return p(a)?fs(new ws(a,null,null,null),b):As(b)}function Ss(b,a,c,d,e){this.source=b;this.pattern=a;this.i=c;this.g=d;this.j=e;this.m=2229667594;this.F=8192}f=Ss.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "source":return this.source;case "pattern":return this.pattern;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.Pattern{",", ","}",c,T.b(new U(null,2,5,W,[new U(null,2,5,W,[rl,this.source],null),new U(null,2,5,W,[Ao,this.pattern],null)],null),this.g))};f.V=function(){return new Gg(0,this,2,new U(null,2,5,W,[rl,Ao],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 2+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,2,[rl,null,Ao,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new Ss(this.source,this.pattern,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(rl,a):S.call(null,rl,a))?new Ss(c,this.pattern,this.i,this.g,null):p(S.b?S.b(Ao,a):S.call(null,Ao,a))?new Ss(this.source,c,this.i,this.g,null):new Ss(this.source,this.pattern,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,2,5,W,[new U(null,2,5,W,[rl,this.source],null),new U(null,2,5,W,[Ao,this.pattern],null)],null),this.g))};f.P=function(b,a){return new Ss(this.source,this.pattern,a,this.g,this.j)};
f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.pattern,E([ds(a,this.source,E([c],0))],0))};f.ma=function(b,a){var c=Z.b?Z.b(a,this.source):Z.call(null,a,this.source),d=this.pattern;return Z.b?Z.b(c,d):Z.call(null,c,d)};function Ts(b,a,c,d,e){this.$=b;this.Z=a;this.i=c;this.g=d;this.j=e;this.m=2229667594;this.F=8192}f=Ts.prototype;f.I=function(b,a){return gb.f(this,a,null)};
f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "fn":return this.$;case "args":return this.Z;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.Predicate{",", ","}",c,T.b(new U(null,2,5,W,[new U(null,2,5,W,[Jj,this.$],null),new U(null,2,5,W,[Vi,this.Z],null)],null),this.g))};f.V=function(){return new Gg(0,this,2,new U(null,2,5,W,[Jj,Vi],null),mc(this.g))};f.O=function(){return this.i};
f.T=function(){return 2+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,2,[Vi,null,Jj,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new Ts(this.$,this.Z,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(Jj,a):S.call(null,Jj,a))?new Ts(c,this.Z,this.i,this.g,null):p(S.b?S.b(Vi,a):S.call(null,Vi,a))?new Ts(this.$,c,this.i,this.g,null):new Ts(this.$,this.Z,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,2,5,W,[new U(null,2,5,W,[Jj,this.$],null),new U(null,2,5,W,[Vi,this.Z],null)],null),this.g))};f.P=function(b,a){return new Ts(this.$,this.Z,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;
f.la=function(b,a,c){return ds(a,this.Z,E([ds(a,this.$,E([c],0))],0))};f.ma=function(b,a){var c=Z.b?Z.b(a,this.$):Z.call(null,a,this.$),d=this.Z;return Z.b?Z.b(c,d):Z.call(null,c,d)};function Us(b,a,c,d,e,g){this.$=b;this.Z=a;this.va=c;this.i=d;this.g=e;this.j=g;this.m=2229667594;this.F=8192}f=Us.prototype;f.I=function(b,a){return gb.f(this,a,null)};
f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "fn":return this.$;case "args":return this.Z;case "binding":return this.va;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.Function{",", ","}",c,T.b(new U(null,3,5,W,[new U(null,2,5,W,[Jj,this.$],null),new U(null,2,5,W,[Vi,this.Z],null),new U(null,2,5,W,[fm,this.va],null)],null),this.g))};
f.V=function(){return new Gg(0,this,3,new U(null,3,5,W,[Jj,Vi,fm],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 3+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,3,[Vi,null,Jj,null,fm,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new Us(this.$,this.Z,this.va,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(Jj,a):S.call(null,Jj,a))?new Us(c,this.Z,this.va,this.i,this.g,null):p(S.b?S.b(Vi,a):S.call(null,Vi,a))?new Us(this.$,c,this.va,this.i,this.g,null):p(S.b?S.b(fm,a):S.call(null,fm,a))?new Us(this.$,this.Z,c,this.i,this.g,null):new Us(this.$,this.Z,this.va,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,3,5,W,[new U(null,2,5,W,[Jj,this.$],null),new U(null,2,5,W,[Vi,this.Z],null),new U(null,2,5,W,[fm,this.va],null)],null),this.g))};
f.P=function(b,a){return new Us(this.$,this.Z,this.va,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.va,E([ds(a,this.Z,E([ds(a,this.$,E([c],0))],0))],0))};f.ma=function(b,a){var c;c=Z.b?Z.b(a,this.$):Z.call(null,a,this.$);var d=this.Z;c=Z.b?Z.b(c,d):Z.call(null,c,d);d=this.va;return Z.b?Z.b(c,d):Z.call(null,c,d)};
function Vs(b,a,c,d,e,g){this.source=b;this.name=a;this.Z=c;this.i=d;this.g=e;this.j=g;this.m=2229667594;this.F=8192}f=Vs.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "source":return this.source;case "name":return this.name;case "args":return this.Z;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.RuleExpr{",", ","}",c,T.b(new U(null,3,5,W,[new U(null,2,5,W,[rl,this.source],null),new U(null,2,5,W,[Ck,this.name],null),new U(null,2,5,W,[Vi,this.Z],null)],null),this.g))};f.V=function(){return new Gg(0,this,3,new U(null,3,5,W,[rl,Ck,Vi],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 3+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,3,[Vi,null,Ck,null,rl,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new Vs(this.source,this.name,this.Z,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(rl,a):S.call(null,rl,a))?new Vs(c,this.name,this.Z,this.i,this.g,null):p(S.b?S.b(Ck,a):S.call(null,Ck,a))?new Vs(this.source,c,this.Z,this.i,this.g,null):p(S.b?S.b(Vi,a):S.call(null,Vi,a))?new Vs(this.source,this.name,c,this.i,this.g,null):new Vs(this.source,this.name,this.Z,this.i,N.f(this.g,a,c),null)};
f.N=function(){return F(T.b(new U(null,3,5,W,[new U(null,2,5,W,[rl,this.source],null),new U(null,2,5,W,[Ck,this.name],null),new U(null,2,5,W,[Vi,this.Z],null)],null),this.g))};f.P=function(b,a){return new Vs(this.source,this.name,this.Z,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.Z,E([ds(a,this.name,E([ds(a,this.source,E([c],0))],0))],0))};
f.ma=function(b,a){var c;c=Z.b?Z.b(a,this.source):Z.call(null,a,this.source);var d=this.name;c=Z.b?Z.b(c,d):Z.call(null,c,d);d=this.Z;return Z.b?Z.b(c,d):Z.call(null,c,d)};function Ws(b,a,c,d,e,g){this.source=b;this.xb=a;this.ga=c;this.i=d;this.g=e;this.j=g;this.m=2229667594;this.F=8192}f=Ws.prototype;f.I=function(b,a){return gb.f(this,a,null)};
f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "source":return this.source;case "vars":return this.xb;case "clauses":return this.ga;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.Not{",", ","}",c,T.b(new U(null,3,5,W,[new U(null,2,5,W,[rl,this.source],null),new U(null,2,5,W,[zo,this.xb],null),new U(null,2,5,W,[on,this.ga],null)],null),this.g))};
f.V=function(){return new Gg(0,this,3,new U(null,3,5,W,[rl,zo,on],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 3+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};
f.Y=function(b,a){return Rd(new Ud(null,new l(null,3,[rl,null,on,null,zo,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new Ws(this.source,this.xb,this.ga,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(rl,a):S.call(null,rl,a))?new Ws(c,this.xb,this.ga,this.i,this.g,null):p(S.b?S.b(zo,a):S.call(null,zo,a))?new Ws(this.source,c,this.ga,this.i,this.g,null):p(S.b?S.b(on,a):S.call(null,on,a))?new Ws(this.source,this.xb,c,this.i,this.g,null):new Ws(this.source,this.xb,this.ga,this.i,N.f(this.g,a,c),null)};
f.N=function(){return F(T.b(new U(null,3,5,W,[new U(null,2,5,W,[rl,this.source],null),new U(null,2,5,W,[zo,this.xb],null),new U(null,2,5,W,[on,this.ga],null)],null),this.g))};f.P=function(b,a){return new Ws(this.source,this.xb,this.ga,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.ga,E([ds(a,this.xb,E([ds(a,this.source,E([c],0))],0))],0))};
f.ma=function(b,a){var c;c=Z.b?Z.b(a,this.source):Z.call(null,a,this.source);var d=this.xb;c=Z.b?Z.b(c,d):Z.call(null,c,d);d=this.ga;return Z.b?Z.b(c,d):Z.call(null,c,d)};function Xs(b,a,c,d,e,g){this.source=b;this.ub=a;this.ga=c;this.i=d;this.g=e;this.j=g;this.m=2229667594;this.F=8192}f=Xs.prototype;f.I=function(b,a){return gb.f(this,a,null)};
f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "source":return this.source;case "rule-vars":return this.ub;case "clauses":return this.ga;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.Or{",", ","}",c,T.b(new U(null,3,5,W,[new U(null,2,5,W,[rl,this.source],null),new U(null,2,5,W,[rk,this.ub],null),new U(null,2,5,W,[on,this.ga],null)],null),this.g))};
f.V=function(){return new Gg(0,this,3,new U(null,3,5,W,[rl,rk,on],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 3+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};
f.Y=function(b,a){return Rd(new Ud(null,new l(null,3,[rk,null,rl,null,on,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new Xs(this.source,this.ub,this.ga,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(rl,a):S.call(null,rl,a))?new Xs(c,this.ub,this.ga,this.i,this.g,null):p(S.b?S.b(rk,a):S.call(null,rk,a))?new Xs(this.source,c,this.ga,this.i,this.g,null):p(S.b?S.b(on,a):S.call(null,on,a))?new Xs(this.source,this.ub,c,this.i,this.g,null):new Xs(this.source,this.ub,this.ga,this.i,N.f(this.g,a,c),null)};
f.N=function(){return F(T.b(new U(null,3,5,W,[new U(null,2,5,W,[rl,this.source],null),new U(null,2,5,W,[rk,this.ub],null),new U(null,2,5,W,[on,this.ga],null)],null),this.g))};f.P=function(b,a){return new Xs(this.source,this.ub,this.ga,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.ga,E([ds(a,this.ub,E([ds(a,this.source,E([c],0))],0))],0))};
f.ma=function(b,a){var c;c=Z.b?Z.b(a,this.source):Z.call(null,a,this.source);var d=this.ub;c=Z.b?Z.b(c,d):Z.call(null,c,d);d=this.ga;return Z.b?Z.b(c,d):Z.call(null,c,d)};function Ys(b,a,c,d){this.ga=b;this.i=a;this.g=c;this.j=d;this.m=2229667594;this.F=8192}f=Ys.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "clauses":return this.ga;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.And{",", ","}",c,T.b(new U(null,1,5,W,[new U(null,2,5,W,[on,this.ga],null)],null),this.g))};f.V=function(){return new Gg(0,this,1,new U(null,1,5,W,[on],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 1+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,1,[on,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new Ys(this.ga,this.i,af(O.b(this.g,a)),null)};f.U=function(b,a,c){return p(S.b?S.b(on,a):S.call(null,on,a))?new Ys(c,this.i,this.g,null):new Ys(this.ga,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,1,5,W,[new U(null,2,5,W,[on,this.ga],null)],null),this.g))};
f.P=function(b,a){return new Ys(this.ga,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.ga,E([c],0))};f.ma=function(b,a){return Z.b?Z.b(a,this.ga):Z.call(null,a,this.ga)};Cf;Zs;function $s(b){var a=B.b(wl,b)?new hs(null,null,null):null;if(p(a))return a;a=os(b);return p(a)?a:qs(b)}
function at(b){if(Dd(b)){var a=ps(G(b));return p(a)?new U(null,2,5,W,[a,H(b)],null):new U(null,2,5,W,[new ks(null,null,null),b],null)}return null}function bt(b){if(Dd(b)){var a=M(b,0);b=ve(b,1);b=null==b?rd:b;var c=rs(a),a=p(c)?c:os(a);b=bs(ts,b);return p(p(a)?b:a)?new U(null,2,5,W,[a,b],null):null}return null}var Z=function Z(a,c){return c instanceof is?qd.b(a,c):c instanceof Ws?Vf.b(a,zo.c(c)):c instanceof Xs?Z(a,rk.c(c)):(null!=c?c.ka||(c.Cb?0:La(Yr,c)):La(Yr,c))?$r(c,a):Dd(c)?w.f(Z,a,c):a};
function ct(b){return Z(rd,b)}function dt(b,a,c){a=Xr.b(Mh(b),Mh(ct(a)));if(!Ad(a))throw Ri([r("Join variable not declared inside clauses: "),r(X.h(E([Wf.b(yk,a)],0)))].join(""),new l(null,2,[en,dk,qn,c],null));if(Ad(b))throw Ri(""+r("Join variables should not be empty"),new l(null,2,[en,dk,qn,c],null));}function et(b,a){dt(zo.c(b),on.c(b),a);return b}
function ft(b,a){for(var c=null!=b&&(b.m&64||b.Ua)?Ta.b(Uc,b):b,d=C.b(c,rk),e=null!=d&&(d.m&64||d.Ua)?Ta.b(Uc,d):d,d=C.b(e,mo),e=C.b(e,sk),g=C.b(c,on),c=T.b(d,e),d=F(g),e=null,h=g=0;;)if(h<g){var k=e.da(null,h);dt(c,new U(null,1,5,W,[k],null),a);h+=1}else if(d=F(d))e=d,Kd(e)?(d=dc(e),h=ec(e),e=d,g=L(d),d=h):(d=G(e),dt(c,new U(null,1,5,W,[d],null),a),d=H(e),e=null,g=0),h=0;else break;return b}
function Bf(b){if(Dd(b)&&B.b(oo,G(b))){var a;a=H(b);a=Zs.c?Zs.c(a):Zs.call(null,a);if(p(af(a)))return new Ys(a,null,null,null);throw Ri(""+r("Cannot parse 'and' clause, expected [ 'and' clause+ ]"),new l(null,2,[en,dk,qn,b],null));}return null}
function Cf(b){var a;a:{var c=at(b);if(p(c)){a=M(c,0);var d=M(c,1),c=M(d,0),d=ve(d,1);if(B.b(um,c)){c=Zs.c?Zs.c(d):Zs.call(null,d);if(p(c)){a=et(fs(new Ws(a,$d(Nh.c(ct(c))),c,null,null,null),b),b);break a}throw Ri(""+r("Cannot parse 'not' clause, expected [ src-var? 'not' clause+ ]"),new l(null,2,[en,dk,qn,b],null));}}a=null}if(p(a))return a;a:{c=at(b);if(p(c)){a=M(c,0);var e=M(c,1),c=M(e,0),d=M(e,1),e=ve(e,2);if(B.b(Dm,c)){c=bs(os,d);d=Zs.c?Zs.c(e):Zs.call(null,e);if(p(p(c)?d:c)){a=et(fs(new Ws(a,
c,d,null,null,null),b),b);break a}throw Ri(""+r("Cannot parse 'not-join' clause, expected [ src-var? 'not-join' [variable+] clause+ ]"),new l(null,2,[en,dk,qn,b],null));}}a=null}if(p(a))return a;a:{c=at(b);if(p(c)&&(a=M(c,0),d=M(c,1),c=M(d,0),d=ve(d,1),B.b(Tl,c))){c=bs(Af(),d);if(p(c)){a=ft(fs(new Xs(a,new us(null,$d(Nh.c(ct(c))),null,null,null),c,null,null,null),b),b);break a}throw Ri(""+r("Cannot parse 'or' clause, expected [ src-var? 'or' clause+ ]"),new l(null,2,[en,dk,qn,b],null));}a=null}if(p(a))return a;
a:{c=at(b);if(p(c)&&(a=M(c,0),d=M(c,1),e=M(d,0),c=M(d,1),d=ve(d,2),B.b(jl,e))){if(Dd(c)){var g=Dd(G(c))?new U(null,2,5,W,[G(c),H(c)],null):new U(null,2,5,W,[null,c],null),e=M(g,0),g=M(g,1),e=bs(os,e),g=bs(os,g);if(Ad(e)&&Ad(g))throw Ri(""+r("Cannot parse rule-vars, expected [ variable+ | ([ variable+ ] variable*) ]"),new l(null,2,[en,lk,qn,c],null));if(!p(es(T.b(e,g))))throw Ri(""+r("Rule variables should be distinct"),new l(null,2,[en,lk,qn,c],null));c=new us(e,g,null,null,null)}else throw Ri(""+
r("Cannot parse rule-vars, expected [ variable+ | ([ variable+ ] variable*) ]"),new l(null,2,[en,lk,qn,c],null));d=bs(Af(),d);if(p(p(c)?d:c)){a=ft(fs(new Xs(a,c,d,null,null,null),b),b);break a}throw Ri(""+r("Cannot parse 'or-join' clause, expected [ src-var? 'or-join' [variable+] clause+ ]"),new l(null,2,[en,dk,qn,b],null));}a=null}if(p(a))return a;a:{if(p(as(b,1))&&(c=bt(G(b)),p(c))){a=M(c,0);c=M(c,1);a=fs(new Ts(a,c,null,null,null),b);break a}a=null}if(p(a))return a;a:{if(p(as(b,2))&&(c=M(b,0),
a=M(b,1),d=bt(c),p(d))){c=M(d,0);d=M(d,1);a=As(a);a=p(a)?fs(new Us(c,d,a,null,null,null),b):null;break a}a=null}if(p(a))return a;a:{c=at(b);if(p(c)&&(a=M(c,0),c=M(c,1),d=M(c,0),c=ve(c,1),d=rs(d),e=bs($s,c),p(d))){if(Ad(c))throw Ri(""+r("rule-expr requires at least one argument"),new l(null,2,[en,dk,qn,b],null));if(null==e)throw Ri(""+r("Cannot parse rule-expr arguments, expected [ (variable | constant | '_')+ ]"),new l(null,2,[en,dk,qn,b],null));a=new Vs(a,d,e,null,null,null);break a}a=null}if(p(a))return a;
a:{c=at(b);if(p(c)&&(a=M(c,0),c=M(c,1),c=bs($s,c),p(c))){if(Ad(c))throw Ri(""+r("Pattern could not be empty"),new l(null,2,[en,dk,qn,b],null));a=fs(new Ss(a,c,null,null,null),b);break a}a=null}if(p(a))return a;throw Ri(""+r("Cannot parse clause, expected (data-pattern | pred-expr | fn-expr | rule-expr | not-clause | not-join-clause | or-clause | or-join-clause)"),new l(null,2,[en,dk,qn,b],null));}function Zs(b){return bs(Cf,b)}
function gt(b,a,c,d,e,g,h){this.find=b;this.qb=a;this.kb=c;this.pb=d;this.i=e;this.g=g;this.j=h;this.m=2229667594;this.F=8192}f=gt.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "find":return this.find;case "with":return this.qb;case "in":return this.kb;case "where":return this.pb;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.parser.Query{",", ","}",c,T.b(new U(null,4,5,W,[new U(null,2,5,W,[aj,this.find],null),new U(null,2,5,W,[zm,this.qb],null),new U(null,2,5,W,[yo,this.kb],null),new U(null,2,5,W,[Hj,this.pb],null)],null),this.g))};f.V=function(){return new Gg(0,this,4,new U(null,4,5,W,[aj,zm,yo,Hj],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 4+L(this.g)};
f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,4,[aj,null,Hj,null,zm,null,yo,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new gt(this.find,this.qb,this.kb,this.pb,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(aj,a):S.call(null,aj,a))?new gt(c,this.qb,this.kb,this.pb,this.i,this.g,null):p(S.b?S.b(zm,a):S.call(null,zm,a))?new gt(this.find,c,this.kb,this.pb,this.i,this.g,null):p(S.b?S.b(yo,a):S.call(null,yo,a))?new gt(this.find,this.qb,c,this.pb,this.i,this.g,null):p(S.b?S.b(Hj,a):S.call(null,Hj,a))?new gt(this.find,this.qb,this.kb,c,this.i,this.g,null):new gt(this.find,this.qb,this.kb,this.pb,this.i,N.f(this.g,a,c),null)};
f.N=function(){return F(T.b(new U(null,4,5,W,[new U(null,2,5,W,[aj,this.find],null),new U(null,2,5,W,[zm,this.qb],null),new U(null,2,5,W,[yo,this.kb],null),new U(null,2,5,W,[Hj,this.pb],null)],null),this.g))};f.P=function(b,a){return new gt(this.find,this.qb,this.kb,this.pb,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};f.ka=!0;f.la=function(b,a,c){return ds(a,this.pb,E([ds(a,this.kb,E([ds(a,this.qb,E([ds(a,this.find,E([c],0))],0))],0))],0))};
f.ma=function(b,a){return Z(Z(Z(Z(a,this.find),this.qb),this.kb),this.pb)};function ht(b){for(var a=Q,c=null;;){var d=G(b);if(p(d))d instanceof q?c=d:a=$f.w(a,new U(null,1,5,W,[c],null),pf(qd,rd),d),b=H(b);else return a}}
function it(b,a){var c=Mh(ct(aj.c(b))),d=Mh(zm.c(b)),e=Mh(ct(yo.c(b))),g=Mh(ct(Hj.c(b))),e=Xr.b(Vr(c,d),Vr(g,e)),c=Wr.b(c,d);if(!Ad(e))throw Ri([r("Query for unknown vars: "),r(X.h(E([Wf.b(yk,e)],0)))].join(""),new l(null,3,[en,Fo,zo,e,qn,a],null));if(!Ad(c))throw Ri([r(":in and :with should not use same variables: "),r(X.h(E([Wf.b(yk,c)],0)))].join(""),new l(null,3,[en,Fo,zo,c,qn,a],null));var h=ct(yo.c(b)),k=cs(function(){return function(a){return a instanceof js}}(h),yo.c(b)),m=cs(function(){return function(a){return a instanceof
ls}}(h,k),yo.c(b));if(!p(function(){var a=es(h);return p(a)?(a=es(k),p(a)?es(m):a):a}()))throw Ri(""+r("Vars used in :in should be distinct"),new l(null,2,[en,Fo,qn,a],null));c=ct(zm.c(b));if(!p(es(c)))throw Ri(""+r("Vars used in :with should be distinct"),new l(null,2,[en,Fo,qn,a],null));c=ds(function(a){return a instanceof js},yo.c(b),E([Vd],0));d=ds(function(){return function(a){return a instanceof js}}(c),Hj.c(b),E([Vd],0));c=Xr.b(d,c);if(!Ad(c))throw Ri([r("Where uses unknown source vars: "),
r(X.h(E([Wf.b(yk,c)],0)))].join(""),new l(null,3,[en,Fo,zo,c,qn,a],null));c=cs(function(a){return a instanceof Vs},Hj.c(b));d=cs(function(){return function(a){return a instanceof ls}}(c),yo.c(b));if(!Ad(c)&&Ad(d))throw Ri(""+r("Missing rules var '%' in :in"),new l(null,2,[en,Fo,qn,a],null));};jt;kt;function lt(b,a,c,d,e){this.Yb=b;this.Nd=a;this.Od=c;this.Md=d;this.xa=e;this.m=2147484416;this.F=0}f=lt.prototype;f.U=function(b,a,c){return jt.f?jt.f(this,a,c):jt.call(null,this,a,c)};f.Sb=function(b,a){return hb(this.Yb,a)};f.I=function(b,a){return gb.f(this.Yb,a,null)};f.H=function(b,a,c){return gb.f(this.Yb,a,c)};f.J=function(b,a,c){return Sb(Xb(this.Yb),a,c)};function mt(b,a,c,d,e){return new lt(b,a,c,d,e)}
function jt(b,a,c){var d=b.Yb,e=b.Nd,g=b.Od,h=b.Md;b=b.xa;var k=g.b?g.b(a,null):g.call(null,a,null);if(p(k))return mt(d,N.f(O.b(e,k),h,a),N.f(g,a,h),h+1,b);a=mt(N.f(d,a,c),N.f(e,h,a),N.f(g,a,h),h+1,b);return kt.c?kt.c(a):kt.call(null,a)}function kt(b){if(L(b.Yb)>b.xa){var a=b.Yb,c=b.Nd,d=b.Od,e=b.Md;b=b.xa;var g=G(c),h=M(g,0),g=M(g,1);return mt(O.b(a,g),O.b(c,h),O.b(d,g),e,b)}return b};function nt(b,a,c,d,e){this.dc=b;this.Ta=a;this.i=c;this.g=d;this.j=e;this.m=2229667594;this.F=8192}f=nt.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "wildcard?":return this.dc;case "attrs":return this.Ta;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.pull-parser.PullSpec{",", ","}",c,T.b(new U(null,2,5,W,[new U(null,2,5,W,[In,this.dc],null),new U(null,2,5,W,[Wm,this.Ta],null)],null),this.g))};f.V=function(){return new Gg(0,this,2,new U(null,2,5,W,[In,Wm],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 2+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,2,[Wm,null,In,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new nt(this.dc,this.Ta,this.i,af(O.b(this.g,a)),null)};f.U=function(b,a,c){return p(S.b?S.b(In,a):S.call(null,In,a))?new nt(c,this.Ta,this.i,this.g,null):p(S.b?S.b(Wm,a):S.call(null,Wm,a))?new nt(this.dc,c,this.i,this.g,null):new nt(this.dc,this.Ta,this.i,N.f(this.g,a,c),null)};
f.N=function(){return F(T.b(new U(null,2,5,W,[new U(null,2,5,W,[In,this.dc],null),new U(null,2,5,W,[Wm,this.Ta],null)],null),this.g))};f.P=function(b,a){return new nt(this.dc,this.Ta,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};
var ot=function ot(a){if(null!=a&&null!=a.Kb)return a.Kb(a);var c=ot[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=ot._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("IPullSpecComponent.-as-spec",a);};function pt(b,a,c,d){this.X=b;this.i=a;this.g=c;this.j=d;this.m=2229667594;this.F=8192}f=pt.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "attr":return this.X;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.pull-parser.PullAttrName{",", ","}",c,T.b(new U(null,1,5,W,[new U(null,2,5,W,[Go,this.X],null)],null),this.g))};f.V=function(){return new Gg(0,this,1,new U(null,1,5,W,[Go],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 1+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Kb=function(){return new U(null,2,5,W,[this.X,new l(null,1,[Go,this.X],null)],null)};f.Y=function(b,a){return Rd(new Ud(null,new l(null,1,[Go,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new pt(this.X,this.i,af(O.b(this.g,a)),null)};f.U=function(b,a,c){return p(S.b?S.b(Go,a):S.call(null,Go,a))?new pt(c,this.i,this.g,null):new pt(this.X,this.i,N.f(this.g,a,c),null)};
f.N=function(){return F(T.b(new U(null,1,5,W,[new U(null,2,5,W,[Go,this.X],null)],null),this.g))};f.P=function(b,a){return new pt(this.X,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};function qt(b,a,c,d,e){this.X=b;this.Pb=a;this.i=c;this.g=d;this.j=e;this.m=2229667594;this.F=8192}f=qt.prototype;f.I=function(b,a){return gb.f(this,a,null)};
f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "attr":return this.X;case "rattr":return this.Pb;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.pull-parser.PullReverseAttrName{",", ","}",c,T.b(new U(null,2,5,W,[new U(null,2,5,W,[Go,this.X],null),new U(null,2,5,W,[Wj,this.Pb],null)],null),this.g))};f.V=function(){return new Gg(0,this,2,new U(null,2,5,W,[Go,Wj],null),mc(this.g))};f.O=function(){return this.i};
f.T=function(){return 2+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Kb=function(){return new U(null,2,5,W,[this.Pb,new l(null,1,[Go,this.X],null)],null)};f.Y=function(b,a){return Rd(new Ud(null,new l(null,2,[Wj,null,Go,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new qt(this.X,this.Pb,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(Go,a):S.call(null,Go,a))?new qt(c,this.Pb,this.i,this.g,null):p(S.b?S.b(Wj,a):S.call(null,Wj,a))?new qt(this.X,c,this.i,this.g,null):new qt(this.X,this.Pb,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,2,5,W,[new U(null,2,5,W,[Go,this.X],null),new U(null,2,5,W,[Wj,this.Pb],null)],null),this.g))};f.P=function(b,a){return new qt(this.X,this.Pb,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};
function rt(b,a,c,d,e){this.X=b;this.xa=a;this.i=c;this.g=d;this.j=e;this.m=2229667594;this.F=8192}f=rt.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "attr":return this.X;case "limit":return this.xa;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.pull-parser.PullLimitExpr{",", ","}",c,T.b(new U(null,2,5,W,[new U(null,2,5,W,[Go,this.X],null),new U(null,2,5,W,[ak,this.xa],null)],null),this.g))};f.V=function(){return new Gg(0,this,2,new U(null,2,5,W,[Go,ak],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 2+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Kb=function(){return Zf(ot(this.X),new U(null,2,5,W,[1,ak],null),this.xa)};f.Y=function(b,a){return Rd(new Ud(null,new l(null,2,[ak,null,Go,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new rt(this.X,this.xa,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(Go,a):S.call(null,Go,a))?new rt(c,this.xa,this.i,this.g,null):p(S.b?S.b(ak,a):S.call(null,ak,a))?new rt(this.X,c,this.i,this.g,null):new rt(this.X,this.xa,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,2,5,W,[new U(null,2,5,W,[Go,this.X],null),new U(null,2,5,W,[ak,this.xa],null)],null),this.g))};f.P=function(b,a){return new rt(this.X,this.xa,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};
function st(b,a,c,d,e){this.X=b;this.value=a;this.i=c;this.g=d;this.j=e;this.m=2229667594;this.F=8192}f=st.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "attr":return this.X;case "value":return this.value;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.pull-parser.PullDefaultExpr{",", ","}",c,T.b(new U(null,2,5,W,[new U(null,2,5,W,[Go,this.X],null),new U(null,2,5,W,[Kk,this.value],null)],null),this.g))};f.V=function(){return new Gg(0,this,2,new U(null,2,5,W,[Go,Kk],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 2+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Kb=function(){return Zf(ot(this.X),new U(null,2,5,W,[1,qk],null),this.value)};f.Y=function(b,a){return Rd(new Ud(null,new l(null,2,[Kk,null,Go,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new st(this.X,this.value,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(Go,a):S.call(null,Go,a))?new st(c,this.value,this.i,this.g,null):p(S.b?S.b(Kk,a):S.call(null,Kk,a))?new st(this.X,c,this.i,this.g,null):new st(this.X,this.value,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,2,5,W,[new U(null,2,5,W,[Go,this.X],null),new U(null,2,5,W,[Kk,this.value],null)],null),this.g))};f.P=function(b,a){return new st(this.X,this.value,a,this.g,this.j)};
f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};function tt(b,a,c){this.i=b;this.g=a;this.j=c;this.m=2229667594;this.F=8192}f=tt.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a){default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.pull-parser.PullWildcard{",", ","}",c,T.b(rd,this.g))};f.V=function(){return new Gg(0,this,0,rd,mc(this.g))};f.O=function(){return this.i};
f.T=function(){return 0+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(Vd,a)?O.b(Wc(Vf.b(Q,this),this.i),a):new tt(this.i,af(O.b(this.g,a)),null)};f.U=function(b,a,c){return new tt(this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(rd,this.g))};f.P=function(b,a){return new tt(a,this.g,this.j)};
f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};function ut(b,a,c,d){this.xa=b;this.i=a;this.g=c;this.j=d;this.m=2229667594;this.F=8192}f=ut.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "limit":return this.xa;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.pull-parser.PullRecursionLimit{",", ","}",c,T.b(new U(null,1,5,W,[new U(null,2,5,W,[ak,this.xa],null)],null),this.g))};f.V=function(){return new Gg(0,this,1,new U(null,1,5,W,[ak],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 1+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Kb=function(){return new U(null,2,5,W,[pm,this.xa],null)};f.Y=function(b,a){return Rd(new Ud(null,new l(null,1,[ak,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new ut(this.xa,this.i,af(O.b(this.g,a)),null)};f.U=function(b,a,c){return p(S.b?S.b(ak,a):S.call(null,ak,a))?new ut(c,this.i,this.g,null):new ut(this.xa,this.i,N.f(this.g,a,c),null)};
f.N=function(){return F(T.b(new U(null,1,5,W,[new U(null,2,5,W,[ak,this.xa],null)],null),this.g))};f.P=function(b,a){return new ut(this.xa,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};function vt(b,a,c,d,e){this.X=b;this.Ob=a;this.i=c;this.g=d;this.j=e;this.m=2229667594;this.F=8192}f=vt.prototype;f.I=function(b,a){return gb.f(this,a,null)};
f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "attr":return this.X;case "porrl":return this.Ob;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.pull-parser.PullMapSpecEntry{",", ","}",c,T.b(new U(null,2,5,W,[new U(null,2,5,W,[Go,this.X],null),new U(null,2,5,W,[mm,this.Ob],null)],null),this.g))};f.V=function(){return new Gg(0,this,2,new U(null,2,5,W,[Go,mm],null),mc(this.g))};f.O=function(){return this.i};
f.T=function(){return 2+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Kb=function(){return ag.w(ot(this.X),1,qd,ot(this.Ob))};f.Y=function(b,a){return Rd(new Ud(null,new l(null,2,[mm,null,Go,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new vt(this.X,this.Ob,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(Go,a):S.call(null,Go,a))?new vt(c,this.Ob,this.i,this.g,null):p(S.b?S.b(mm,a):S.call(null,mm,a))?new vt(this.X,c,this.i,this.g,null):new vt(this.X,this.Ob,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,2,5,W,[new U(null,2,5,W,[Go,this.X],null),new U(null,2,5,W,[mm,this.Ob],null)],null),this.g))};f.P=function(b,a){return new vt(this.X,this.Ob,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};
function wt(b,a){return a instanceof tt?N.f(b,In,!0):ag.w(b,Wm,Xe,ot(a))}function xt(b,a,c,d){this.ac=b;this.i=a;this.g=c;this.j=d;this.m=2229667594;this.F=8192}f=xt.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "specs":return this.ac;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.pull-parser.PullPattern{",", ","}",c,T.b(new U(null,1,5,W,[new U(null,2,5,W,[Lm,this.ac],null)],null),this.g))};f.V=function(){return new Gg(0,this,1,new U(null,1,5,W,[Lm],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 1+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Kb=function(){var b=new nt(!1,Vb(Q),null,null,null),b=w.f(wt,b,this.ac);return new U(null,2,5,W,[an,ag.f(b,Wm,We)],null)};f.Y=function(b,a){return Rd(new Ud(null,new l(null,1,[Lm,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new xt(this.ac,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(Lm,a):S.call(null,Lm,a))?new xt(c,this.i,this.g,null):new xt(this.ac,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,1,5,W,[new U(null,2,5,W,[Lm,this.ac],null)],null),this.g))};f.P=function(b,a){return new xt(this.ac,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};yt;var zt=new Ud(null,new l(null,3,[wj,null,"*",null,Fk,null],null),null);
function At(b){return b instanceof q||"string"===typeof b?Vq(b)?new qt(Wq(b),b,null,null,null):new pt(b,null,null,null):null}var Bt=new Ud(null,new l(null,2,["...",null,Pn,null],null),null);function Ct(b){return Dd(b)&&B.b(3,L(b))}var Dt=new Ud(null,new l(null,3,[gl,null,ak,null,"limit",null],null),null);
function Et(b){var a=M(b,0),c=M(b,1),d=M(b,2);if(p(Dt.c?Dt.c(a):Dt.call(null,a))){c=(a=null==d||"number"===typeof d&&0<d)?At(c):a;if(p(c))return new rt(c,d,null,null,null);throw Ri(""+r('Expected ["limit" attr-name (positive-number | nil)]'),new l(null,2,[en,Sn,ok,b],null));}return null}var Ft=new Ud(null,new l(null,3,[Ml,null,qk,null,"default",null],null),null);
function Gt(b){var a=M(b,0),c=M(b,1);b=function(){var b=At(a);return p(b)?b:p(Ct(a))?Et(a):null}();if(p(b)){var d=function(){var a;a=p(Bt.c?Bt.c(c):Bt.call(null,c))?new ut(null,null,null,null):"number"===typeof c&&0<c?new ut(c,null,null,null):null;return p(a)?a:yt.c?yt.c(c):yt.call(null,c)}();if(p(d))return new vt(b,d,null,null,null);throw Ri(""+r("Expected (pattern | recursion-limit)"),new l(null,2,[en,Sn,ok,new U(null,2,5,W,[a,c],null)],null));}throw Ri(""+r("Expected (attr-name | limit-expr)"),
new l(null,2,[en,Sn,ok,new U(null,2,5,W,[a,c],null)],null));}
function Ht(b){var a=At(b);if(p(a))return a;a=p(zt.c?zt.c(b):zt.call(null,b))?new tt(null,null,null):null;if(p(a))return a;if(Ed(b)){if(!B.b(1,L(b)))throw Error([r("Assert failed: "),r("Maps should contain exactly 1 entry"),r("\n"),r(X.h(E([vc(zj,1,vc(Tn,kn))],0)))].join(""));a=Gt(G(b))}else a=null;if(p(a))return a;if(p(Ct(b))){if(a=Et(b),!p(a))b:{var c=M(b,0),d=M(b,1),a=M(b,2);if(p(Ft.c?Ft.c(c):Ft.call(null,c))){c=Ft.c?Ft.c(c):Ft.call(null,c);d=p(c)?At(d):c;if(p(d)){a=new st(d,a,null,null,null);
break b}throw Ri(""+r('Expected ["default" attr-name any-value]'),new l(null,2,[en,Sn,ok,b],null));}a=null}}else a=null;if(p(a))return a;throw Ri(""+r("Cannot parse attr-spec, expected: (attr-name | wildcard | map-spec | attr-expr)"),new l(null,2,[en,Sn,ok,b],null));}function It(b){return Ed(b)?co:p(zt.c?zt.c(b):zt.call(null,b))?Mj:vk}function Jt(b){return Vf.f(rd,R.c(function(a){return qd.b(Q,a)}),b)}
function Kt(b){b=yi(It,b);var a=p(af(C.b(b,Mj)))?new U(null,1,5,W,[Fk],null):rd;return Vf.f(Vf.b(a,C.b(b,vk)),mf.b(R.c(Jt),Pf),C.b(b,co))}function yt(b){return Dd(b)?new xt(Vf.f(rd,R.c(Ht),Kt(b)),null,null,null):null}function Lt(b){var a;a=null==b?null:yt(b);a=null==a?null:ud(ot(a),1);if(p(a))return a;throw Ri(""+r("Cannot parse pull pattern, expected: [attr-spec+]"),new l(null,2,[en,Sn,ok,b],null));};function Mt(b,a){return w.f(Xe,b,a)}function Nt(b,a,c){return wd([Gj,hl,ll,pm,Lm,In,ho,Ao,Ho],[c,a,Ao,new l(null,2,[fn,Q,qm,Vd],null),F(Wm.c(b)),In.c(b),Vb(Q),b,Vb(rd)])}function Ot(b,a,c,d){return N.f(Nt(b,a,c),Go,d)}function Pt(b,a,c){var d=Ao.c(b);return N.h(b,hl,a,E([Lm,F(Wm.c(d)),In,In.c(d),ho,Vb(Q),Ho,function(){var a=Ho.c(b);return F(c)?Xe.b(a,c):a}()],0))}
function Qt(b,a,c){var d=null!=b&&(b.m&64||b.Ua)?Ta.b(Uc,b):b,e=C.b(d,fn),d=C.b(d,qm);return N.h(b,fn,ag.f(e,a,pf(Xc,0)),E([qm,qd.b(d,c)],0))}function Rt(b,a,c){var d;d=Rd(Yf(b,new U(null,2,5,W,[pm,qm],null),Vd),c);return p(d)?qd.b(a,ag.w(b,Ho,Xe,new l(null,1,[Um,c],null))):null}function St(b,a){var c=ho.c(a),c=null==c?null:Xb(c);return null==c?null:C.b(c,b)}var Tt=of(St,Mk);function Ut(b,a){var c=Go.c(b),c=Qt(pm.c(b),c,a);return N.f(Ot(Ao.c(b),new U(null,1,5,W,[a],null),!1,Mk),pm,c)}
function Vt(b){var a=M(b,0);b=ve(b,1);var c=F(hl.c(a));if(c){var a=Pt(a,Ic(c),Tt.c?Tt.c(a):Tt.call(null,a)),c=G(c),d=Rt(a,b,c);return p(d)?d:qd.h(b,a,E([Ut(a,c)],0))}c=Tt.c?Tt.c(a):Tt.call(null,a);d=Ho.c(a);c=F(c)?Xe.b(d,c):d;return qd.b(b,N.h(a,ll,Oj,E([Ho,c],0)))}
function Wt(b,a,c,d,e){var g=null!=d&&(d.m&64||d.Ua)?Ta.b(Uc,d):d,h=C.b(g,pm),g=C.b(g,Ao),k=C.f(C.b(h,fn),b,0);return B.b(pm.c(C.b(Wm.c(g),b)),k)?qd.b(e,d):Vt(qd.h(e,d,E([new l(null,7,[ll,pm,Ao,g,Go,b,Gj,a,hl,c,pm,h,Ho,Vb(rd)],null)],0)))}var Xt=function(b){return function(a,c,d,e,g){a=Qt(pm.c(a),d,c);return N.f(Ot(b,g,e,d),pm,a)}}(new nt(!0,Q,null,null,null));
function Yt(b,a,c,d,e,g,h,k){var m=M(k,0),n=ve(k,1),t=C.f(h,ak,1E3),u=af(p(t)?Vf.f(rd,Df(t),g):g);if(p(u)){var v=Jq(b,c),x=v&&Mq(b,c,ul),A=p(e)?Mq(b,c,Fn):!x,D=p(e)?function(){return function(a){return a.v}}(v,x,A,t,u,k,m,n):function(){return function(a){return a.e}}(v,x,A,t,u,k,m,n);if(Rd(h,an))return qd.h(n,m,E([Ot(an.c(h),Wf.b(D,u),A,a)],0));if(Rd(h,pm))return Wt(a,A,Wf.b(D,u),m,n);if(p(x?e:x))return qd.h(n,m,E([Xt(m,d,a,A,Wf.b(D,u))],0));var J=function(){return v?mf.b(function(){return function(a){return wd([Um],
[a])}}(D,v,x,A,D,t,u,k,m,n),D):D}(),K=!A;return qd.b(n,ag.R(m,ho,Ye,a,function(){var a=Vf.f(rd,R.c(J),u);return K?G(a):a}()))}return qd.b(n,Rd(h,qk)?ag.R(m,ho,Ye,a,qk.c(h)):m)}var Zt=Rf(function(b){var a=M(b,0);b=M(b,1);return $e.b(a,Go.c(b))});function $t(b,a,c){return Ot(N.h(Ao.c(b),Wm,c,E([In,!1],0)),new U(null,1,5,W,[a],null),!1,yj)}function au(b,a){return qd.b(Ic(b),ag.w(G(b),ho,Mt,Xb(a)))}function bu(b){var a=M(b,0);b=ve(b,1);var c=qj.c(a),a=St(yj,a);return au(b,Mt(c,p(a)?a:Q))}
function cu(b,a){var c=M(a,0),d=ve(a,1),e=F(so.c(c));if(e){var g=G(e),e=M(g,0),g=M(g,1),h=C.f(Xf(c,new U(null,2,5,W,[Ao,Wm],null)),e,Q);return Yt(b,e,e,yn.c(c),!0,g,h,qd.b(d,ag.f(c,so,Ic)))}e=af(Vf.f(Q,Zt,Xf(c,new U(null,2,5,W,[Ao,Wm],null))));return p(e)?(c=N.h(c,ll,Ok,E([qj,ho.c(c),ho,Vb(Q)],0)),qd.h(d,c,E([$t(c,yn.c(c),e)],0))):au(d,ho.c(c))}
function du(b,a,c,d,e){var g=yi(function(a){return a.a},hq(b,Kl,new U(null,1,5,W,[d],null))),h=null!=a&&(a.m&64||a.Ua)?Ta.b(Uc,a):a,k=C.b(h,Go),h=C.b(h,pm),k=null!=k?Qt(h,k,d):h;return cu(b,qd.h(c,a,E([new l(null,6,[ll,$n,ho,Ve(new l(null,1,[Um,d],null)),yn,d,Ao,e,so,F(g),pm,k],null)],0)))}
function eu(b,a){for(;;){var c=a,d=M(c,0),e=ve(c,1);if(c=F(hl.c(d))){if(p(In.c(d))){var g=b,d=N.h(d,Lm,rd,E([yn,G(c),In,!1],0)),c=e,h=null!=d&&(d.m&64||d.Ua)?Ta.b(Uc,d):d,e=C.b(h,yn),h=C.b(h,Ao),k=Rt(d,c,e);return p(k)?k:du(g,d,c,e,h)}if(g=F(Lm.c(d))){h=g;g=G(h);Ao.c(d);e=qd.b(e,N.f(d,Lm,Ic(h)));d=b;h=g;c=G(c);g=M(h,0);h=M(h,1);if(B.b(Um,g))d=p(af(hq(d,Kl,new U(null,1,5,W,[c],null))))?qd.b(Ic(e),ag.R(G(e),ho,Ye,Um,c)):e;else var k=Go.c(h),m=B.b(g,k),n=m?hq(d,Kl,new U(null,2,5,W,[c,k],null)):hq(d,
zk,new U(null,2,5,W,[k,c],null)),d=Yt(d,g,k,c,m,n,h,e);return d}g=b;d=qd.b(e,Pt(d,Ic(c),af(We(ho.c(d)))));b=g;a=d}else return qd.b(e,N.f(d,ll,Oj))}}
function fu(b,a){for(;;)switch(ll.c(G(a))instanceof q?ll.c(G(a)).W:null){case "expand":var c=b,d=cu(b,a);b=c;a=d;continue;case "expand-rev":c=b;d=bu(a);b=c;a=d;continue;case "pattern":c=b;d=eu(b,a);b=c;a=d;continue;case "recursion":c=b;d=Vt(a);b=c;a=d;continue;case "done":var c=a,e=M(c,0),g=ve(c,1),h=function(){var a=We(Ho.c(e));return Ka(Gj.c(e))?G(a):a}();if(F(g)){c=b;d=qd.b(Ic(g),function(){var a=G(g);return p(h)?ag.R(a,ho,Ye,Go.c(e),h):a}());b=c;a=d;continue}else return h;default:throw Error([r("No matching clause: "),
r(ll.c(G(a)))].join(""));}}function gu(b,a,c,d){c=Vf.f(rd,R.c(function(a){return Hq(b,a)}),c);return fu(b,Za(Jc,Nt(a,c,d)))};var hu=function hu(a){if(null!=a&&null!=a.Hd)return a.Hd();var c=hu[ba(null==a?null:a)];if(null!=c)return c.c?c.c(a):c.call(null,a);c=hu._;if(null!=c)return c.c?c.c(a):c.call(null,a);throw Na("PushbackReader.read-char",a);},iu=function iu(a,c){if(null!=a&&null!=a.Id)return a.Id(0,c);var d=iu[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=iu._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("PushbackReader.unread",a);};
function ju(b,a,c){this.aa=b;this.buffer=a;this.eb=c}ju.prototype.Hd=function(){return 0===this.buffer.length?(this.eb+=1,this.aa[this.eb]):this.buffer.pop()};ju.prototype.Id=function(b,a){return this.buffer.push(a)};function ku(b){var a=!/[^\t\n\r ]/.test(b);return p(a)?a:","===b}lu;mu;nu;function ou(b){throw Error(Ta.b(r,b));}
function pu(b,a){for(var c=new ka(a),d=hu(b);;){var e;if(!(e=null==d||ku(d))){e=d;var g="#"!==e;e=g?(g="'"!==e)?(g=":"!==e)?mu.c?mu.c(e):mu.call(null,e):g:g:g}if(e)return iu(b,d),c.toString();c.append(d);d=hu(b)}}function qu(b){for(;;){var a=hu(b);if("\n"===a||"\r"===a||null==a)return b}}var ru=$h("^([-+]?)(?:(0)|([1-9][0-9]*)|0[xX]([0-9A-Fa-f]+)|0([0-7]+)|([1-9][0-9]?)[rR]([0-9A-Za-z]+))(N)?$"),su=$h("^([-+]?[0-9]+)/([0-9]+)$"),tu=$h("^([-+]?[0-9]+(\\.[0-9]*)?([eE][-+]?[0-9]+)?)(M)?$"),uu=$h("^[:]?([^0-9/].*/)?([^0-9/][^/]*)$");
function vu(b,a){var c=b.exec(a);return null!=c&&c[0]===a?1===c.length?c[0]:c:null}var wu=$h("^[0-9A-Fa-f]{2}$"),xu=$h("^[0-9A-Fa-f]{4}$");function yu(b,a,c){return p(Yh(b,c))?c:ou(E(["Unexpected unicode escape \\",a,c],0))}function zu(b){return String.fromCharCode(parseInt(b,16))}
function Au(b){var a=hu(b),c="t"===a?"\t":"r"===a?"\r":"n"===a?"\n":"\\"===a?"\\":'"'===a?'"':"b"===a?"\b":"f"===a?"\f":null;p(c)?a=c:"x"===a?(b=(new ka(hu(b),hu(b))).toString(),a=zu(yu(wu,a,b))):"u"===a?(b=(new ka(hu(b),hu(b),hu(b),hu(b))).toString(),a=zu(yu(xu,a,b))):a=/[^0-9]/.test(a)?ou(E(["Unexpected unicode escape \\",a],0)):String.fromCharCode(a);return a}
function Bu(b,a){for(var c=Vb(rd);;){var d;a:{d=ku;for(var e=a,g=hu(e);;)if(p(d.c?d.c(g):d.call(null,g)))g=hu(e);else{d=g;break a}}p(d)||ou(E(["EOF while reading"],0));if(b===d)return Xb(c);e=mu.c?mu.c(d):mu.call(null,d);p(e)?d=e.b?e.b(a,d):e.call(null,a,d):(iu(a,d),d=lu.w?lu.w(a,!0,null,!0):lu.call(null,a,!0,null));c=d===a?c:Xe.b(c,d)}}function Cu(b,a){return ou(E(["Reader for ",a," not implemented yet"],0))}Du;
function Eu(b,a){var c=hu(b),d=nu.c?nu.c(c):nu.call(null,c);if(p(d))return d.b?d.b(b,a):d.call(null,b,a);d=Du.b?Du.b(b,c):Du.call(null,b,c);return p(d)?d:ou(E(["No dispatch macro for ",c],0))}function Fu(b,a){return ou(E(["Unmatched delimiter ",a],0))}function Gu(b){return Ta.b(vc,Bu(")",b))}function Hu(b){return Bu("]",b)}function Iu(b){b=Bu("}",b);kf(L(b))&&ou(E(["Map literal must contain an even number of forms"],0));return Ta.b(Uc,b)}
function Ju(b){for(var a=new ka,c=hu(b);;){if(null==c)return ou(E(["EOF while reading"],0));if("\\"===c)a.append(Au(b));else{if('"'===c)return a.toString();a.append(c)}c=hu(b)}}
function Ku(b){for(var a=new ka,c=hu(b);;){if(null==c)return ou(E(["EOF while reading"],0));if("\\"===c){a.append(c);var d=hu(b);if(null==d)return ou(E(["EOF while reading"],0));var e=function(){var b=a;b.append(d);return b}(),g=hu(b)}else{if('"'===c)return a.toString();e=function(){var b=a;b.append(c);return b}();g=hu(b)}a=e;c=g}}
function Lu(b,a){var c=pu(b,a),d=-1!=c.indexOf("/");p(p(d)?1!==c.length:d)?c=Fc.b(we.f(c,0,c.indexOf("/")),we.f(c,c.indexOf("/")+1,c.length)):(d=Fc.c(c),c="nil"===c?null:"true"===c?!0:"false"===c?!1:"/"===c?Om:d);return c}function Mu(b,a){var c=pu(b,a),d=we.b(c,1);return 1===d.length?d:"tab"===d?"\t":"return"===d?"\r":"newline"===d?"\n":"space"===d?" ":"backspace"===d?"\b":"formfeed"===d?"\f":"u"===d.charAt(0)?zu(we.b(d,1)):"o"===d.charAt(0)?Cu(0,c):ou(E(["Unknown character literal: ",c],0))}
function Nu(b){b=pu(b,hu(b));var a=vu(uu,b);b=a[0];var c=a[1],a=a[2];return void 0!==c&&":/"===c.substring(c.length-2,c.length)||":"===a[a.length-1]||-1!==b.indexOf("::",1)?ou(E(["Invalid token: ",b],0)):null!=c&&0<c.length?Je.b(c.substring(0,c.indexOf("/")),a):Je.c(b)}function Ou(b){return function(a){return Za(Za(Jc,lu.w?lu.w(a,!0,null,!0):lu.call(null,a,!0,null)),b)}}function Pu(){return function(){return ou(E(["Unreadable form"],0))}}
function Qu(b){var a;a=lu.w?lu.w(b,!0,null,!0):lu.call(null,b,!0,null);a=a instanceof z?new l(null,1,[rn,a],null):"string"===typeof a?new l(null,1,[rn,a],null):a instanceof q?Tg([a,!0]):a;Ed(a)||ou(E(["Metadata must be Symbol,Keyword,String or Map"],0));b=lu.w?lu.w(b,!0,null,!0):lu.call(null,b,!0,null);return(null!=b?b.m&262144||b.Be||(b.m?0:La(Db,b)):La(Db,b))?Wc(b,Hh.h(E([yd(b),a],0))):ou(E(["Metadata can only be applied to IWithMetas"],0))}function Ru(b){return Mh(Bu("}",b))}
function Su(b){return $h(Ku(b))}function Tu(b){lu.w?lu.w(b,!0,null,!0):lu.call(null,b,!0,null);return b}function mu(b){return'"'===b?Ju:":"===b?Nu:";"===b?qu:"'"===b?Ou(ef):"@"===b?Ou(Zn):"^"===b?Qu:"`"===b?Cu:"~"===b?Cu:"("===b?Gu:")"===b?Fu:"["===b?Hu:"]"===b?Fu:"{"===b?Iu:"}"===b?Fu:"\\"===b?Mu:"#"===b?Eu:null}function nu(b){return"{"===b?Ru:"\x3c"===b?Pu():'"'===b?Su:"!"===b?qu:"_"===b?Tu:null}
function lu(b,a,c){for(;;){var d=hu(b);if(null==d)return p(a)?ou(E(["EOF while reading"],0)):c;if(!ku(d))if(";"===d)b=qu.b?qu.b(b,d):qu.call(null,b);else{var e=mu(d);if(p(e))e=e.b?e.b(b,d):e.call(null,b,d);else{var e=b,g=void 0;!(g=!/[^0-9]/.test(d))&&(g=void 0,g="+"===d||"-"===d)&&(g=hu(e),iu(e,g),g=!/[^0-9]/.test(g));if(g)a:for(e=b,d=new ka(d),g=hu(e);;){var h;h=null==g;h||(h=(h=ku(g))?h:mu.c?mu.c(g):mu.call(null,g));if(p(h)){iu(e,g);d=e=d.toString();g=void 0;p(vu(ru,d))?(d=vu(ru,d),g=d[2],null!=
(B.b(g,"")?null:g)?g=0:(g=p(d[3])?[d[3],10]:p(d[4])?[d[4],16]:p(d[5])?[d[5],8]:p(d[6])?[d[7],parseInt(d[6],10)]:[null,null],h=g[0],null==h?g=null:(g=parseInt(h,g[1]),g="-"===d[1]?-g:g))):(g=void 0,p(vu(su,d))?(d=vu(su,d),g=parseInt(d[1],10)/parseInt(d[2],10)):g=p(vu(tu,d))?parseFloat(d):null);d=g;e=p(d)?d:ou(E(["Invalid number format [",e,"]"],0));break a}d.append(g);g=hu(e)}else e=Lu(b,d)}if(e!==b)return e}}}
var Uu=function(b,a){return function(c,d){return C.b(p(d)?a:b,c)}}(new U(null,13,5,W,[null,31,28,31,30,31,30,31,31,30,31,30,31],null),new U(null,13,5,W,[null,31,29,31,30,31,30,31,31,30,31,30,31],null)),Vu=/(\d\d\d\d)(?:-(\d\d)(?:-(\d\d)(?:[T](\d\d)(?::(\d\d)(?::(\d\d)(?:[.](\d+))?)?)?)?)?)?(?:[Z]|([-+])(\d\d):(\d\d))?/;function Wu(b){b=parseInt(b,10);return Ka(isNaN(b))?b:null}
function Xu(b,a,c,d){b<=a&&a<=c||ou(E([[r(d),r(" Failed:  "),r(b),r("\x3c\x3d"),r(a),r("\x3c\x3d"),r(c)].join("")],0));return a}
function Yu(b){var a=Yh(Vu,b);M(a,0);var c=M(a,1),d=M(a,2),e=M(a,3),g=M(a,4),h=M(a,5),k=M(a,6),m=M(a,7),n=M(a,8),t=M(a,9),u=M(a,10);if(Ka(a))return ou(E([[r("Unrecognized date/time syntax: "),r(b)].join("")],0));var v=Wu(c),x=function(){var a=Wu(d);return p(a)?a:1}();b=function(){var a=Wu(e);return p(a)?a:1}();var a=function(){var a=Wu(g);return p(a)?a:0}(),c=function(){var a=Wu(h);return p(a)?a:0}(),A=function(){var a=Wu(k);return p(a)?a:0}(),D=function(){var a;a:if(B.b(3,L(m)))a=m;else if(3<L(m))a=
we.f(m,0,3);else for(a=new ka(m);;)if(3>a.Hb.length)a=a.append("0");else{a=a.toString();break a}a=Wu(a);return p(a)?a:0}(),n=(B.b(n,"-")?-1:1)*(60*function(){var a=Wu(t);return p(a)?a:0}()+function(){var a=Wu(u);return p(a)?a:0}());return new U(null,8,5,W,[v,Xu(1,x,12,"timestamp month field must be in range 1..12"),Xu(1,b,function(){var a;a=0===pe(v,4);p(a)&&(a=Ka(0===pe(v,100)),a=p(a)?a:0===pe(v,400));return Uu.b?Uu.b(x,a):Uu.call(null,x,a)}(),"timestamp day field must be in range 1..last day in month"),
Xu(0,a,23,"timestamp hour field must be in range 0..23"),Xu(0,c,59,"timestamp minute field must be in range 0..59"),Xu(0,A,B.b(c,59)?60:59,"timestamp second field must be in range 0..60"),Xu(0,D,999,"timestamp millisecond field must be in range 0..999"),n],null)}
var Zu,$u=new l(null,4,["inst",function(b){var a;if("string"===typeof b)if(a=Yu(b),p(a)){b=M(a,0);var c=M(a,1),d=M(a,2),e=M(a,3),g=M(a,4),h=M(a,5),k=M(a,6);a=M(a,7);a=new Date(Date.UTC(b,c-1,d,e,g,h,k)-6E4*a)}else a=ou(E([[r("Unrecognized date/time syntax: "),r(b)].join("")],0));else a=ou(E(["Instance literal expects a string for its timestamp."],0));return a},"uuid",function(b){return"string"===typeof b?new Pi(b,null):ou(E(["UUID literal expects a string as its representation."],0))},"queue",function(b){return Hd(b)?
Vf.b(Cg,b):ou(E(["Queue literal expects a vector for its elements."],0))},"js",function(b){if(Hd(b)){var a=[];b=F(b);for(var c=null,d=0,e=0;;)if(e<d){var g=c.da(null,e);a.push(g);e+=1}else if(b=F(b))c=b,Kd(c)?(b=dc(c),e=ec(c),c=b,d=L(b),b=e):(b=G(c),a.push(b),b=H(c),c=null,d=0),e=0;else break;return a}if(Ed(b)){a={};b=F(b);c=null;for(e=d=0;;)if(e<d){var h=c.da(null,e),g=M(h,0),h=M(h,1);a[xe(g)]=h;e+=1}else if(b=F(b))Kd(b)?(d=dc(b),b=ec(b),c=d,d=L(d)):(d=G(b),c=M(d,0),d=M(d,1),a[xe(c)]=d,b=H(b),c=
null,d=0),e=0;else break;return a}return ou(E([[r("JS literal expects a vector or map containing "),r("only string or unqualified keyword keys")].join("")],0))}],null);Zu=sf.c?sf.c($u):sf.call(null,$u);var av=sf.c?sf.c(null):sf.call(null,null);
function Du(b,a){var c=Lu(b,a),d=C.b(I.c?I.c(Zu):I.call(null,Zu),""+r(c)),e=I.c?I.c(av):I.call(null,av);return p(d)?(c=lu(b,!0,null),d.c?d.c(c):d.call(null,c)):p(e)?(d=lu(b,!0,null),e.b?e.b(c,d):e.call(null,c,d)):ou(E(["Could not find tag parser for ",""+r(c)," in ",X.h(E([Pg(I.c?I.c(Zu):I.call(null,Zu))],0))],0))}function bv(b,a){var c=""+r(b);C.b(I.c?I.c(Zu):I.call(null,Zu),c);xf.w(Zu,N,c,a)};cv;dv;ev;fv;gv;function cv(b,a){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));var c;c="number"===typeof a||Dd(a)?Nq(b,a):null;if(p(c)){var d=qf(!1),e=qf(Q);return dv.w?dv.w(b,c,d,e):dv.call(null,b,c,d,e)}return null}function hv(b,a,c){return Mq(b,a,Fn)?Jq(b,a)?w.f(function(a,c){return qd.b(a,cv(b,Ij.c(c)))},Vd,c):w.f(function(a,b){return qd.b(a,Ij.c(b))},Vd,c):Jq(b,a)?cv(b,Ij.c(G(c))):Ij.c(G(c))}
function iv(b,a,c,d){a=af(fq(b,new U(null,3,5,W,[null,c,a],null)));return p(a)?Mq(b,c,ul)?cv(b,Bl.c(G(a))):w.f(function(){return function(a,c){return qd.b(a,cv(b,Bl.c(c)))}}(a,a),Vd,a):d}function jv(b){return p(b)?Yd(b):null}
function kv(b){gv.c?gv.c(b):gv.call(null,b);return function c(d){return new Ke(null,function(){for(;;){var e=F(d);if(e){if(Kd(e)){var g=dc(e),h=L(g),k=Oe(h);a:for(var m=0;;)if(m<h){var n=y.b(g,m),t=M(n,0),n=M(n,1),t=Mq(b.db,t,Fn)?new U(null,2,5,W,[t,jv(n)],null):new U(null,2,5,W,[t,n],null);k.add(t);m+=1}else{g=!0;break a}return g?Pe(Re(k),c(ec(e))):Pe(Re(k),null)}g=G(e);k=M(g,0);g=M(g,1);return gd(Mq(b.db,k,Fn)?new U(null,2,5,W,[k,jv(g)],null):new U(null,2,5,W,[k,g],null),c(Ic(e)))}return null}},
null,null)}(function(){var c=b.cache;return I.c?I.c(c):I.call(null,c)}())}function lv(b,a,c,d){this.db=b;this.eid=a;this.rd=c;this.cache=d;this.m=2162164483;this.F=0}f=lv.prototype;f.entry_set=function(){return Yd(R.b(Yd,kv(this)))};
f.forEach=function(){function b(a,b){for(var c=F(kv(this)),h=null,k=0,m=0;;)if(m<k){var n=h.da(null,m),t=M(n,0),n=M(n,1);a.call(b,n,t,this);m+=1}else if(c=F(c))Kd(c)?(h=dc(c),c=ec(c),t=h,k=L(h),h=t):(h=G(c),t=M(h,0),n=M(h,1),a.call(b,n,t,this),c=H(c),h=null,k=0),m=0;else return null}function a(a){for(var b=F(kv(this)),c=null,h=0,k=0;;)if(k<h){var m=c.da(null,k),n=M(m,0),m=M(m,1);a.f?a.f(m,n,this):a.call(null,m,n,this);k+=1}else if(b=F(b))Kd(b)?(c=dc(b),b=ec(b),n=c,h=L(c),c=n):(c=G(b),n=M(c,0),m=M(c,
1),a.f?a.f(m,n,this):a.call(null,m,n,this),b=H(b),c=null,h=0),k=0;else return null}var c=null,c=function(c,e){switch(arguments.length){case 1:return a.call(this,c);case 2:return b.call(this,c,e)}throw Error("Invalid arity: "+arguments.length);};c.c=a;c.b=b;return c}();f.get=function(b){if(B.b(b,":db/id"))return this.eid;if(Vq(b))return jv(iv(this.db,this.eid,Wq(b),null));var a=fv.b?fv.b(this,b):fv.call(null,this,b);return Mq(this.db,b,Fn)?jv(a):a};f.key_set=function(){return Yd(Pg(this))};
f.entries=function(){return Kg(kv(this))};f.value_set=function(){return Yd(R.b(nd,kv(this)))};f.toString=function(){return oc(this)};f.keys=function(){return Mc(Pg(this))};f.values=function(){return Mc(R.b(nd,kv(this)))};f.equiv=function(b){return ev.b?ev.b(this,b):ev.call(null,this,b)};f.has=function(b){return null!=this.get(b)};f.B=function(b,a){return ev.b?ev.b(this,a):ev.call(null,this,a)};f.M=function(){return Bc(this.eid)};
f.N=function(){gv.c?gv.c(this):gv.call(null,this);return F(I.c?I.c(this.cache):I.call(null,this.cache))};f.T=function(){gv.c?gv.c(this):gv.call(null,this);return L(I.c?I.c(this.cache):I.call(null,this.cache))};f.I=function(b,a){return fv.f?fv.f(this,a,null):fv.call(null,this,a,null)};f.H=function(b,a,c){return fv.f?fv.f(this,a,c):fv.call(null,this,a,c)};f.Sb=function(b,a){return $e.b($m,fv.f?fv.f(this,a,$m):fv.call(null,this,a,$m))};
f.call=function(){function b(a,b,c){return fv.f?fv.f(this,b,c):fv.call(null,this,b,c)}function a(a,b){return fv.b?fv.b(this,b):fv.call(null,this,b)}var c=null,c=function(c,e,g){switch(arguments.length){case 2:return a.call(this,0,e);case 3:return b.call(this,0,e,g)}throw Error("Invalid arity: "+arguments.length);};c.b=a;c.f=b;return c}();f.apply=function(b,a){return this.call.apply(this,[this].concat(Sa(a)))};f.c=function(b){return fv.b?fv.b(this,b):fv.call(null,this,b)};
f.b=function(b,a){return fv.f?fv.f(this,b,a):fv.call(null,this,b,a)};f.J=function(b,a,c){return Sb(N.f(I.c?I.c(this.cache):I.call(null,this.cache),Um,this.eid),a,c)};function dv(b,a,c,d){return new lv(b,a,c,d)}function ev(b,a){return a instanceof lv&&B.b(b.eid,a.eid)}
var fv=function fv(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return fv.b(arguments[0],arguments[1]);case 3:return fv.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};fv.b=function(b,a){return fv.f(b,a,null)};
fv.f=function(b,a,c){if(B.b(a,Um))return b.eid;if(Vq(a))return iv(b.db,b.eid,Wq(a),c);var d=function(){var a=b.cache;return I.c?I.c(a):I.call(null,a)}().call(null,a);if(p(d))return d;if(p(function(){var a=b.rd;return I.c?I.c(a):I.call(null,a)}()))return c;d=af(fq(b.db,new U(null,2,5,W,[b.eid,a],null)));p(d)&&(c=hv(b.db,a,d),zf(b.cache,N.f(function(){var a=b.cache;return I.c?I.c(a):I.call(null,a)}(),a,c)));return c};fv.A=3;
function mv(b,a){return ae(function(a,d,e){return N.f(a,d,Mq(b,d,ul)?Mq(b,d,Fn)?Mh(R.b(gv,e)):gv.c?gv.c(e):gv.call(null,e):e)},Q,a)}function nv(b,a){return w.f(function(a,d){var e=po.c(G(d));return N.f(a,e,hv(b,e,d))},Q,Wh(po,a))}function gv(b){if(!p(b instanceof lv))throw Error([r("Assert failed: "),r(X.h(E([vc(bm,Im)],0)))].join(""));var a;a=b.rd;a=I.c?I.c(a):I.call(null,a);p(a)||(a=af(fq(b.db,new U(null,1,5,W,[b.eid],null))),p(a)&&(a=mv(b.db,nv(b.db,a)),lc(b.cache,a),lc(b.rd,!0)));return b}
ia("datascript.impl.entity.Entity.prototype.get",lv.prototype.get);ia("datascript.impl.entity.Entity.prototype.has",lv.prototype.has);ia("datascript.impl.entity.Entity.prototype.forEach",lv.prototype.forEach);ia("datascript.impl.entity.Entity.prototype.key_set",lv.prototype.key_set);ia("datascript.impl.entity.Entity.prototype.value_set",lv.prototype.value_set);ia("datascript.impl.entity.Entity.prototype.entry_set",lv.prototype.entry_set);ia("datascript.impl.entity.Entity.prototype.keys",lv.prototype.keys);
ia("datascript.impl.entity.Entity.prototype.values",lv.prototype.values);ia("datascript.impl.entity.Entity.prototype.entries",lv.prototype.entries);ia("cljs.core.ES6Iterator.prototype.next",Kc.prototype.next);ia("cljs.core.ES6EntriesIterator.prototype.next",Hg.prototype.next);ov;function pv(b,a,c,d,e,g){this.Qb=b;this.Rb=a;this.rules=c;this.i=d;this.g=e;this.j=g;this.m=2229667594;this.F=8192}f=pv.prototype;f.I=function(b,a){return gb.f(this,a,null)};f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "rels":return this.Qb;case "sources":return this.Rb;case "rules":return this.rules;default:return C.f(this.g,a,c)}};
f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.query.Context{",", ","}",c,T.b(new U(null,3,5,W,[new U(null,2,5,W,[am,this.Qb],null),new U(null,2,5,W,[Ak,this.Rb],null),new U(null,2,5,W,[Cl,this.rules],null)],null),this.g))};f.V=function(){return new Gg(0,this,3,new U(null,3,5,W,[am,Ak,Cl],null),mc(this.g))};f.O=function(){return this.i};f.T=function(){return 3+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};
f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,3,[Ak,null,Cl,null,am,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new pv(this.Qb,this.Rb,this.rules,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(am,a):S.call(null,am,a))?new pv(c,this.Rb,this.rules,this.i,this.g,null):p(S.b?S.b(Ak,a):S.call(null,Ak,a))?new pv(this.Qb,c,this.rules,this.i,this.g,null):p(S.b?S.b(Cl,a):S.call(null,Cl,a))?new pv(this.Qb,this.Rb,c,this.i,this.g,null):new pv(this.Qb,this.Rb,this.rules,this.i,N.f(this.g,a,c),null)};
f.N=function(){return F(T.b(new U(null,3,5,W,[new U(null,2,5,W,[am,this.Qb],null),new U(null,2,5,W,[Ak,this.Rb],null),new U(null,2,5,W,[Cl,this.rules],null)],null),this.g))};f.P=function(b,a){return new pv(this.Qb,this.Rb,this.rules,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};function qv(b,a,c,d,e){this.Ta=b;this.bc=a;this.i=c;this.g=d;this.j=e;this.m=2229667594;this.F=8192}f=qv.prototype;f.I=function(b,a){return gb.f(this,a,null)};
f.H=function(b,a,c){switch(a instanceof q?a.W:null){case "attrs":return this.Ta;case "tuples":return this.bc;default:return C.f(this.g,a,c)}};f.J=function(b,a,c){return Y(a,function(){return function(b){return Y(a,qg,""," ","",c,b)}}(this),"#datascript.query.Relation{",", ","}",c,T.b(new U(null,2,5,W,[new U(null,2,5,W,[Wm,this.Ta],null),new U(null,2,5,W,[ij,this.bc],null)],null),this.g))};f.V=function(){return new Gg(0,this,2,new U(null,2,5,W,[Wm,ij],null),mc(this.g))};f.O=function(){return this.i};
f.T=function(){return 2+L(this.g)};f.M=function(){var b=this.j;return null!=b?b:this.j=b=Ae(this)};f.B=function(b,a){var c;c=p(a)?(c=this.constructor===a.constructor)?Fg(this,a):c:a;return p(c)?!0:!1};f.Y=function(b,a){return Rd(new Ud(null,new l(null,2,[ij,null,Wm,null],null),null),a)?O.b(Wc(Vf.b(Q,this),this.i),a):new qv(this.Ta,this.bc,this.i,af(O.b(this.g,a)),null)};
f.U=function(b,a,c){return p(S.b?S.b(Wm,a):S.call(null,Wm,a))?new qv(c,this.bc,this.i,this.g,null):p(S.b?S.b(ij,a):S.call(null,ij,a))?new qv(this.Ta,c,this.i,this.g,null):new qv(this.Ta,this.bc,this.i,N.f(this.g,a,c),null)};f.N=function(){return F(T.b(new U(null,2,5,W,[new U(null,2,5,W,[Wm,this.Ta],null),new U(null,2,5,W,[ij,this.bc],null)],null),this.g))};f.P=function(b,a){return new qv(this.Ta,this.bc,a,this.g,this.j)};f.S=function(b,a){return Hd(a)?ib(this,y.b(a,0),y.b(a,1)):w.f(Za,this,a)};
function rv(b,a){return Wr.b(Mh(Pg(b)),Mh(Pg(a)))}function sv(b){return Vf.f(rd,Pf,b)}var tv=function tv(a,c){return B.b(wl,a)?!0:B.b(new U(null,1,5,W,[Fk],null),a)?Dd(c):a instanceof z?B.b(c,a):Dd(a)?B.b(pd(a),Fk)?Dd(c)&&gf(function(a){var c=M(a,0);a=M(a,1);return tv(c,a)},R.f(tg,Oh(a),c)):Dd(c)&&B.b(L(c),L(a))&&gf(function(a){var c=M(a,0);a=M(a,1);return tv(c,a)},R.f(tg,a,c)):a.c?a.c(c):a.call(null,c)};function uv(b){return b instanceof z&&B.b("$",G(xe(b)))}
function vv(b){return b instanceof z&&B.b("?",G(xe(b)))}function wv(b){return b instanceof q||"string"===typeof b}function xv(b){return tv(new U(null,2,5,W,[wv,wl],null),b)}function yv(b,a,c,d){var e=a.length,g=d.length,h;h=e+g;h=Ra?Array(h):Qa.call(null,h);for(var k=0;;)if(k<e)h[k]=b[a[k]],k+=1;else break;for(b=0;;)if(b<g)h[e+b]=c[d[b]],b+=1;else break;return h}function zv(b,a){return new qv(Wm.c(b),Vf.b(ij.c(b),ij.c(a)),null,null,null)}
var Av=function Av(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Av.C();case 2:return Av.b(arguments[0],arguments[1]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};Av.C=function(){return new qv(Q,new U(null,1,5,W,[Ra?[]:Qa.call(null,0)],null),null,null,null)};
Av.b=function(b,a){var c=Pg(Wm.c(b)),d=Pg(Wm.c(a)),e=Yd(R.b(Wm.c(b),c)),g=Yd(R.b(Wm.c(a),d));return new qv(Ph(T.b(c,d),Uh.C()),We(w.f(function(b,c,d,e){return function(g,u){return w.f(function(a,b,c,d){return function(a,b){return Xe.b(a,yv(u,c,b,d))}}(b,c,d,e),g,ij.c(a))}}(c,d,e,g),Vb(rd),ij.c(b))),null,null,null)};Av.A=2;var Bv=function Bv(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Bv.h(0<c.length?new Hc(c.slice(0),0):null)};
Bv.h=function(b){var a=L(b);return $e.b(Gf(a/2,b),Hf(a/2,b))};Bv.A=0;Bv.K=function(b){return Bv.h(F(b))};var Cv=function Cv(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Cv.h(arguments[0],arguments[1],2<c.length?new Hc(c.slice(2),0):null)};Cv.h=function(b,a,c){return w.f(function(c,e){var g=G(fq(b,new U(null,2,5,W,[a,e],null)));return p(g)?Zc(new U(null,2,5,W,[po.c(g),Ij.c(g)],null)):null},null,c)};Cv.A=2;
Cv.K=function(b){var a=G(b),c=H(b);b=G(c);c=H(c);return Cv.h(a,b,c)};var Dv=function Dv(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Dv.h(0<c.length?new Hc(c.slice(0),0):null)};Dv.h=function(b){return w.f(function(a,b){return p(b)?b:Zc(b)},!0,b)};Dv.A=0;Dv.K=function(b){return Dv.h(F(b))};var Ev=function Ev(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return Ev.h(0<c.length?new Hc(c.slice(0),0):null)};
Ev.h=function(b){return w.f(function(a,b){return p(b)?Zc(b):b},null,b)};Ev.A=0;Ev.K=function(b){return Ev.h(F(b))};
var ov=wd([Km,oo,pn,fj,Qm,ro,ol,Tn,Qk,lm,un,Om,bl,Jn,um,Rk,ao,Qj,Dk,zj,Gk,zn,Ul,An,kl,Cj,go,Rn,eo,Xj,Nn,$k,Fk,El,hj,Vk,em,Qn,Jk,Dj,fl,Hn,Kj,Ql,Tj,ik,ml,gn,bj,Jl,gm,vl,wm,nk,Sm,Tl,xm,tm],[function(b){return!0===b},Dv,kf,function(b,a,c,d){b=G(fq(b,new U(null,2,5,W,[a,c],null)));return p(b)?Ij.c(b):d},ke,oi,je,L,Cv,Ha,Xc,ge,se,function(b){return!1===b},Ka,be,Bv,function Fv(a,c){var d=Zh(a,c),e=c.search(a),g=Bd(d)?G(d):d,h=we.b(c,e+L(g));return p(d)?new Ke(null,function(c,d,e,g){return function(){return gd(c,
F(g)?Fv(a,g):null)}}(d,e,g,h),null,null):null},ie,B,oe,de,xe,function(b,a,c){return null==C.b(cv(b,a),c)},be,xi,lf,ue,wc,Uh,me,sd,fe,X,pi,yd,function(b){return 0===b},$e,ni,le,$e,r,he,ee,function(b){return null!=b},function(b){return 0<b},si,Yh,we,pe,function(b,a){return b-a*se(b,a)},jf,Ma,function(b){return 0>b},af,Ev,function(b,a){return b===a},Zh]),Gv=function(){function b(b){var e=a(b);return c(function(){return function(a){return function k(b){return new Ke(null,function(a){return function(){for(;;){var c=
F(b);if(c){if(Kd(c)){var d=dc(c),e=L(d),g=Oe(e);a:for(var A=0;;)if(A<e){var D=y.b(d,A)-a;g.add(D*D);A+=1}else{d=!0;break a}return d?Pe(Re(g),k(ec(c))):Pe(Re(g),null)}g=G(c)-a;return gd(g*g,k(Ic(c)))}return null}}}(a),null,null)}}(e)(b)}())/L(b)}function a(a){return c(a)/L(a)}function c(a){return w.f(de,0,a)}return wd([nm,Tn,Dn,bk,Gk,Nn,jo,Tm,wo,dl,ml,bn],[b,L,function(a){var b=Zd(wc,a);a=L(a);var c=a>>1,h=ud(b,c);return jf(a)?(h+ud(b,c-1))/2:h},c,function(){function a(b,c){return $d(w.f(function(a,
c){return L(a)<b?Zd(wc,qd.b(a,c)):0>wc(c,pd(a))?Zd(wc,qd.b(Oh(a),c)):a},rd,c))}function b(a){return w.f(function(a,b){return 0>wc(b,a)?b:a},G(a),H(a))}var c=null,c=function(c,g){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,g)}throw Error("Invalid arity: "+arguments.length);};c.c=b;c.b=a;return c}(),function(){function a(b,c){return $d(w.f(function(a,c){return L(a)<b?Zd(wc,qd.b(a,c)):0<wc(c,G(a))?Zd(wc,qd.b(H(a),c)):a},rd,c))}function b(a){return w.f(function(a,
b){return 0<wc(b,a)?b:a},G(a),H(a))}var c=null,c=function(c,g){switch(arguments.length){case 1:return b.call(this,c);case 2:return a.call(this,c,g)}throw Error("Invalid arity: "+arguments.length);};c.c=b;c.b=a;return c}(),function(a){return L(Nh.c(a))},mf.b($d,Nh),a,function(a){a=b(a);return Math.sqrt(a)},function(){function a(b,c){return $d(Lf(b,function(){return ud(c,xi(L(c)))}))}var b=null,b=function(b,c){switch(arguments.length){case 1:return ud(b,xi(L(b)));case 2:return a.call(this,b,c)}throw Error("Invalid arity: "+
arguments.length);};b.c=function(a){return ud(a,xi(L(a)))};b.b=a;return b}(),function(a,b){var c=Gf,h;h=Yd.c?Yd.c(b):Yd.call(null,b);for(var k=Math.random,m=h.length-1;0<m;m--){var n=Math.floor(k()*(m+1)),t=h[m];h[m]=h[n];h[n]=t}h=$d.c?$d.c(h):$d.call(null,h);return $d(c(a,h))}])}();function Hv(b){if("string"===typeof b){if("string"!==typeof b)throw Error("Cannot read from non-string object.");b=lu(new ju(b,[],-1),!1,null)}return yi(od,b)}
function Iv(b){var a=Pd.c?Pd.c(b):Pd.call(null,b);return p(a)?a:Ia.c?Ia.c(b):Ia.call(null,b)}function Jv(b){b=R.b(yk,$d(Nh.c(ct(b))));return new qv(Ph(b,Uh.C()),rd,null,null,null)}var Kv=function Kv(a,c){if(null!=a&&null!=a.zc)return a.zc(a,c);var d=Kv[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=Kv._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("IBinding.in-\x3erel",a);};vs.prototype.zc=function(){return Av.C()};
ws.prototype.zc=function(b,a){return new qv(Tg([Xf(this,new U(null,2,5,W,[Pj,yk],null)),0]),new U(null,1,5,W,[Ea.c(new U(null,1,5,W,[a],null))],null),null,null,null)};ys.prototype.zc=function(b,a){if(Ka(Iv(a)))throw Ri([r("Cannot bind value "),r(X.h(E([a],0))),r(" to collection "),r(X.h(E([gs(this)],0)))].join(""),new l(null,3,[en,Ek,Kk,a,fm,gs(this)],null));return Ad(a)?Jv(this):w.b(zv,R.b(function(a){return function(b){return Kv(fm.c(a),b)}}(this),a))};
xs.prototype.zc=function(b,a){if(Ka(Iv(a)))throw Ri([r("Cannot bind value "),r(X.h(E([a],0))),r(" to tuple "),r(X.h(E([gs(this)],0)))].join(""),new l(null,3,[en,Ek,Kk,a,fm,gs(this)],null));if(L(a)<L(wk.c(this)))throw Ri([r("Not enough elements in a collection "),r(X.h(E([a],0))),r(" to bind tuple "),r(X.h(E([gs(this)],0)))].join(""),new l(null,3,[en,Ek,Kk,a,fm,gs(this)],null));return w.b(Av,R.f(function(){return function(a,b){return Kv(a,b)}}(this),wk.c(this),a))};
function Lv(b,a){var c=M(a,0),d=M(a,1);return c instanceof ws&&Pj.c(c)instanceof js?$f.R(b,new U(null,1,5,W,[Ak],null),N,Xf(c,new U(null,2,5,W,[Pj,yk],null)),d):c instanceof ws&&Pj.c(c)instanceof ls?N.f(b,Cl,Hv(d)):$f.w(b,new U(null,1,5,W,[am],null),qd,Kv(c,d))}function Mv(b,a,c){return w.f(Lv,b,Ph(a,c))}var Nv=null,Ov=null;
function Pv(b,a){var c=b.c?b.c(a):b.call(null,a);return null!=Nv&&Rd(Nv,a)?function(a){return function(b){b=b[a];return"number"===typeof b?b:Nq(Ov,b)}}(c):function(a){return function(b){return b[a]}}(c)}function Qv(b){return 1===L(b)?G(b):function(a){return function(b){return Ue(a.map(function(){return function(a){return a.c?a.c(b):a.call(null,b)}}(a)))}}(Yd(b))}
function Rv(b,a){for(var c=a,d=Vb(Q);;){var e=G(c);if(p(e))var g=b.c?b.c(e):b.call(null,e),c=H(c),d=Ye.f(d,g,qd.b(C.f(d,g,Jc),e));else return Xb(d)}}
function Sv(b,a){var c=ij.c(b),d=ij.c(a),e=Wm.c(b),g=Wm.c(a),h=$d(rv(Wm.c(b),Wm.c(a))),k=R.b(function(a,b,c){return function(a){return Pv(c,a)}}(c,d,e,g,h),h),m=R.b(function(a,b,c,d){return function(a){return Pv(d,a)}}(c,d,e,g,h,k),h),n=Pg(e),t=$d(Xr.b(Mh(Pg(g)),Mh(Pg(e)))),u=Yd(R.b(e,n)),v=Yd(R.b(g,t)),x=Qv(k),A=Rv(x,c),D=Qv(m),c=We(w.f(function(a,b,c,d,e,g,h,k,m,n,t,u,v,x){return function(A,D){var vb=x.c?x.c(D):x.call(null,D),wb=C.b(v,vb);return p(wb)?w.f(function(a,b,c,d,e,g,h,k,m,n,t,u,v,x){return function(a,
b){return Xe.b(a,yv(b,v,D,x))}}(wb,wb,vb,a,b,c,d,e,g,h,k,m,n,t,u,v,x),A,wb):A}}(c,d,e,g,h,k,m,n,t,u,v,x,A,D),Vb(rd),d));return new qv(Ph(T.b(n,t),Uh.C()),c,null,null,null)}function Tv(b,a){var c=Wf.b(function(a){return a instanceof z?null:a},a),d=fq(b,c),c=Vf.b(Q,Sf(function(){return function(a){var b=M(a,0);M(a,1);return vv(b)}}(c,d),R.f(tg,a,new U(null,4,5,W,["e","a","v","tx"],null))));return new qv(c,d,null,null,null)}
function Uv(b,a){var c=Sf(function(b){a:for(var c=a;;){var d=b;if(p(p(d)?c:d)){var d=G(b),k=G(c);if(k instanceof z||B.b(d,k))b=H(b),c=H(c);else{b=!1;break a}}else{b=!0;break a}}return b},b),d=Vf.b(Q,Sf(function(){return function(a){var b=M(a,0);M(a,1);return vv(b)}}(c),R.f(tg,a,Uh.C())));return new qv(d,R.b(Yd,c),null,null,null)}function Vv(b){return p(uv(G(b)))?b:T.b(new U(null,1,5,W,[ym],null),b)}function Wv(b,a){return(null!=b?b.md||(b.Cb?0:La(eq,b)):La(eq,b))?Tv(b,a):Uv(b,a)}
function Xv(b,a){for(var c=b,d=a,e=rd;;){var g=G(c);if(p(g))p(af(rv(Wm.c(d),Wm.c(g))))?(c=H(c),d=Sv(g,d)):(c=H(c),e=qd.b(e,g));else return qd.b(e,d)}}function Yv(b,a){return hf(function(b){return Rd(Wm.c(b),a)?b:null},am.c(b))}function Zv(b,a){var c=Yv(b,a);if(p(c)){var d=G(ij.c(c));return p(d)?d[Wm.c(c).call(null,a)]:null}return null}
function $v(b,a){var c=Sf(function(b){return!Ad(Wr.b(Mh(a),Mh(Pg(Wm.c(b)))))},am.c(b)),d=w.b(Av,c);return new U(null,2,5,W,[$f.f(b,new U(null,1,5,W,[am],null),function(a){return function(b){return Tf(Mh(a),b)}}(c,d)),d],null)}function aw(b,a,c,d){return function(e){var g=R.b(function(c){if(c instanceof z){var d=C.b(Ak.c(b),c);return p(d)?d:e[C.b(Wm.c(a),c)]}return c},d);return Ta.b(c,g)}}
function bw(b,a){var c=M(a,0),d=M(c,0),e=ve(c,1),g=function(){var c=C.b(ov,d);if(p(c))return c;c=Zv(b,d);if(p(c))return c;if(null==Yv(b,d))throw Ri([r("Unknown predicate '"),r(d),r(" in "),r(a)].join(""),new l(null,3,[en,On,qn,a,sm,d],null));return null}(),h=$v(b,Sf(Dc,e)),k=M(h,0),m=M(h,1),n=p(g)?function(){return $f.f(m,new U(null,1,5,W,[ij],null),function(a){return function(b){return Sf(a,b)}}(aw(k,m,g,e),a,c,d,e,g,h,k,m))}():N.f(m,new U(null,1,5,W,[ij],null),rd);return $f.w(k,new U(null,1,5,W,
[am],null),qd,n)}
function cw(b,a){var c=M(a,0),d=M(c,0),e=ve(c,1),g=M(a,1),h=As(g),k=function(){var c=C.b(ov,d);if(p(c))return c;c=Zv(b,d);if(p(c))return c;if(null==Yv(b,d))throw Ri([r("Unknown function '"),r(d),r(" in "),r(a)].join(""),new l(null,3,[en,On,qn,a,sm,d],null));return null}(),m=$v(b,Sf(Dc,e)),n=M(m,0),t=M(m,1),u=p(k)?function(){var b=aw(n,t,k,e),u=function(){return function(a,b,c,d,e,g,h,k,m,n,t){return function ma(u){return new Ke(null,function(a,b,c,d,e,g,h,k,m,n,t){return function(){for(var b=u;;)if(b=
F(b)){if(Kd(b)){var c=dc(b),d=L(c),e=Oe(d);a:for(var g=0;;)if(g<d){var k=y.b(c,g),m=a.c?a.c(k):a.call(null,k);null!=m&&(k=Av.b(new qv(Wm.c(t),new U(null,1,5,W,[k],null),null,null,null),Kv(h,m)),e.add(k));g+=1}else{c=!0;break a}return c?Pe(Re(e),ma(ec(b))):Pe(Re(e),null)}e=G(b);c=a.c?a.c(e):a.call(null,e);if(null!=c)return gd(Av.b(new qv(Wm.c(t),new U(null,1,5,W,[e],null),null,null,null),Kv(h,c)),ma(Ic(b)));b=Ic(b)}else return null}}(a,b,c,d,e,g,h,k,m,n,t),null,null)}}(b,a,c,d,e,g,h,k,m,n,t)(ij.c(t))}();
return Ad(u)?Av.b(t,Jv(h)):w.b(zv,u)}():Av.b(N.f(t,new U(null,1,5,W,[ij],null),rd),Jv(h));return $f.w(n,new U(null,1,5,W,[am],null),Xv,u)}function dw(b,a){return Dd(a)&&Rd(Cl.c(b),p(uv(G(a)))?nd(a):G(a))}ew;fw;var gw=sf.c?sf.c(0):sf.call(null,0);
function hw(b,a){var c=M(b,0),d=ve(b,1),e=xf.b(gw,Xc),g=C.b(Cl.c(a),c);return function(a,b,c,d,e){return function v(g){return new Ke(null,function(a,b,c,d,e){return function(){for(;;){var h=F(g);if(h){var k=h;if(Kd(k)){var m=dc(k),n=L(m),t=Oe(n);return function(){for(var g=0;;)if(g<n){var v=y.b(m,g),x=v,ma=M(x,0),pa=M(ma,0),Ja=ve(ma,1),wa=ve(x,1),Ga=Ph(Ja,c);Qe(t,Jp(function(a,b,c,d,e,g,h,k,m,n,t,v,x,A,D,J,K){return function(a){if(p(vv(a))){var b=h.c?h.c(a):h.call(null,a);return p(b)?b:Fc.c([r(xe(a)),
r("__auto__"),r(K)].join(""))}return a}}(g,x,ma,pa,Ja,wa,Ga,v,m,n,t,k,h,a,b,c,d,e),wa));g+=1}else return!0}()?Pe(Re(t),v(ec(k))):Pe(Re(t),null)}var pa=G(k),wa=pa,ma=M(wa,0),Ga=M(ma,0),Ja=ve(ma,1),cb=ve(wa,1),pb=Ph(Ja,c);return gd(Jp(function(a,b,c,d,e,g,h,k,m,n,t,v,x){return function(a){if(p(vv(a))){var b=g.c?g.c(a):g.call(null,a);return p(b)?b:Fc.c([r(xe(a)),r("__auto__"),r(x)].join(""))}return a}}(wa,ma,Ga,Ja,cb,pb,pa,k,h,a,b,c,d,e),cb),v(Ic(k)))}return null}}}(a,b,c,d,e),null,null)}}(b,c,d,e,g)(g)}
function iw(b,a){var c=Tf(function(a){var b=M(a,0);a=M(a,1);return B.b(b,a)},R.f(tg,b,a));return new U(null,2,5,W,[R.b(G,c),R.b(nd,c)],null)}
function jw(b,a){var c=M(b,0),d=ve(b,1),e=C.b(a,c);return function(a,b,c,d){return function t(e){return new Ke(null,function(a,b,c){return function(){for(;;){var a=F(e);if(a){if(Kd(a)){var b=dc(a),d=L(b),g=Oe(d);a:for(var h=0;;)if(h<d){var k=y.b(b,h),m=iw(c,k),k=M(m,0),m=M(m,1),k=new U(null,1,5,W,[T.h(new U(null,1,5,W,[ao],null),k,E([m],0))],null);g.add(k);h+=1}else{b=!0;break a}return b?Pe(Re(g),t(ec(a))):Pe(Re(g),null)}g=G(a);b=iw(c,g);g=M(b,0);b=M(b,1);return gd(new U(null,1,5,W,[T.h(new U(null,
1,5,W,[ao],null),g,E([b],0))],null),t(Ic(a)))}return null}}}(a,b,c,d),null,null)}}(b,c,d,e)(e)}function kw(b){var a=sf.c?sf.c(rd):sf.call(null,rd);Jp(function(a){return function(b){p(vv.c?vv.c(b):vv.call(null,b))&&xf.f(a,qd,b);return b}}(a),b);return I.c?I.c(a):I.call(null,a)}function lw(b,a){var c=function(a){return function(b){b=M(b,0);M(b,0);b=ve(b,1);return gf(a,b)}}(Mh(kw(b)));return new U(null,2,5,W,[Sf(c,a),Tf(c,a)],null)}
function mw(b,a){for(var c=Sf(vv,a),d=Ph(c,Uh.C()),e=function(){return function(a,b){return w.f(fw,a,b)}}(c,d),g=function(a,b,c){return function(d){return hf(function(){return function(a){return Ad(ij.c(a))}}(a,b,c),am.c(d))}}(c,d,e),h=Za(Jc,new l(null,5,[Wn,rd,Lk,b,on,new U(null,1,5,W,[a],null),Ui,Q,Am,Q],null)),k=new qv(d,rd,null,null,null);;){var m=G(h);if(p(m)){var n=m,t=Vh(function(){return function(a){return Ka(dw(b,a))}}(h,k,n,m,c,d,e,g),on.c(n)),u=M(t,0),v=M(t,1),x=M(v,0),A=ve(v,1);if(null==
x)var D=e(Lk.c(n),u),D=ew.b?ew.b(D,c):ew.call(null,D,c),J=new qv(d,D,null,null,null),D=H(h),J=zv(k,J);else{var K=x,V=M(K,0),ha=ve(K,1),xa=jw(x,Ui.c(n)),Ua=lw(T.b(Wn.c(n),u),T.b(xa,Am.c(n))),P=M(Ua,0),rb=M(Ua,1);if(p(hf(function(){return function(a){return B.b(a,new U(null,1,5,W,[vc(ao)],null))}}(h,k,K,V,ha,xa,Ua,P,rb,t,u,v,x,A,n,m,c,d,e,g),P)))D=H(h);else{var pa=T.b(u,P),wa=e(Lk.c(n),pa);if(p(g(wa)))D=H(h);else var ma=N.f(Ui.c(n),V,qd.b(C.f(Ui.c(n),V,rd),ha)),Ga=hw(x,b),D=T.b(function(){return function(a,
b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,P,V,ha,ma,pa,wa){return function rr(xa){return new Ke(null,function(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K){return function(){for(;;){var a=F(xa);if(a){if(Kd(a)){var b=dc(a),d=L(b),h=Oe(d);a:for(var k=0;;)if(k<d){var m=y.b(b,k),m=new l(null,5,[Wn,e,Lk,g,on,sv(E([m,K],0)),Ui,c,Am,v],null);h.add(m);k+=1}else{b=!0;break a}return b?Pe(Re(h),rr(ec(a))):Pe(Re(h),null)}h=G(a);return gd(new l(null,5,[Wn,e,Lk,g,on,sv(E([h,K],0)),Ui,c,Am,v],null),rr(Ic(a)))}return null}}}(a,b,
c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K,P,V,ha,ma,pa,wa),null,null)}}(h,k,ma,Ga,pa,wa,K,V,ha,xa,Ua,P,rb,t,u,v,x,A,n,m,c,d,e,g)(Ga)}(),H(h))}J=k}h=D;k=J}else return k}}function nw(b,a){if(null!=b?b.Rc||(b.Cb?0:La(lq,b)):La(lq,b)){var c=M(a,0),d=M(a,1),e=M(a,2),g=M(a,3);return ug.f(new U(null,4,5,W,[p(xv(c))?Hq(b,c):c,d,p(function(){if(p(e)){var a=wv(d);return p(a)?(a=Jq(b,d))?xv(e):a:a}return e}())?Hq(b,e):e,p(xv(g))?Hq(b,g):g],null),0,L(a))}return a}
function ow(b,a){var c=M(a,0),d=M(a,1),e=M(a,2),g=M(a,3),c=p(vv(c))?qd.b(Vd,c):Vd,g=p(vv(g))?qd.b(c,g):c,c=vv(e),d=p(c)?Ka(vv(d))&&Jq(b,d):c;return p(d)?qd.b(g,e):g}
function fw(b,a){if(p(function(){var b=new U(null,1,5,W,[new U(null,2,5,W,[Dc,Fk],null)],null);return tv.b?tv.b(b,a):tv.call(null,b,a)}()))return bw(b,a);if(p(function(){var b=new U(null,2,5,W,[new U(null,2,5,W,[Dc,Fk],null),wl],null);return tv.b?tv.b(b,a):tv.call(null,b,a)}()))return cw(b,a);if(p(function(){var b=new U(null,1,5,W,[Fk],null);return tv.b?tv.b(b,a):tv.call(null,b,a)}())){var c=Vv(a),d=M(c,0),c=ve(c,1),d=C.b(Ak.c(b),d),c=nw(d,c),e=Wv(d,c),g=null!=d?d.Rc?!0:d.Cb?!1:La(lq,d):La(lq,d),
h=Ov,k=Nv;Ov=g?d:null;Nv=g?ow(d,c):null;try{return $f.w(b,new U(null,1,5,W,[am],null),Xv,e)}finally{Nv=k,Ov=h}}else throw Error([r("No matching clause: "),r(a)].join(""));}function pw(b,a){if(p(dw(b,a))){var c=p(uv(G(a)))?new U(null,2,5,W,[G(a),H(a)],null):new U(null,2,5,W,[ym,a],null),d=M(c,0),c=M(c,1),d=Xf(b,new U(null,2,5,W,[Ak,d],null)),d=mw(N.f(b,Ak,new l(null,1,[ym,d],null)),c);return $f.w(b,new U(null,1,5,W,[am],null),Xv,d)}return fw(b,a)}
var ew=function ew(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return ew.b(arguments[0],arguments[1]);case 3:return ew.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};ew.b=function(b,a){var c=am.c(b);return ew.f(new U(null,1,5,W,[function(){var b=L(a);return Ra?Array(b):Qa.call(null,b)}()],null),c,a)};
ew.f=function(b,a,c){for(;;){var d=G(a);if(p(d)){var e=d,g=Ih(Wm.c(e),c);if(Ad(g))var h=b,k=H(a),m=c;else var n=Yd(R.b(function(a,b,c,d){return function(a){return C.b(d,a)}}(b,a,c,g,e,d),c)),t=L(c),h=function(){return function(a,b,c,d,e,g,h,k){return function xa(m){return new Ke(null,function(a,b,c,d,e,g,h,k){return function(){for(var n=m;;){var t=F(n);if(t){var u=t,v=G(u);if(t=F(function(a,b,c,d,e,g,h,k,m,n,t,u){return function qr(v){return new Ke(null,function(a,b,c,d,e,g,h,k,m){return function(){for(;;){var a=
F(v);if(a){if(Kd(a)){var b=dc(a),c=L(b),d=Oe(c);return function(){for(var a=0;;)if(a<c){for(var g=y.b(b,a),h=d,n=Sa(e),t=0;;)if(t<m){var u=k[t];p(u)&&(n[t]=g[u]);t+=1}else break;h.add(n);a+=1}else return!0}()?Pe(Re(d),qr(ec(a))):Pe(Re(d),null)}var g=G(a);return gd(function(){for(var a=Sa(e),b=0;;)if(b<m){var c=k[b];p(c)&&(a[b]=g[c]);b+=1}else break;return a}(),qr(Ic(a)))}return null}}}(a,b,c,d,e,g,h,k,m,n,t,u),null,null)}}(n,a,b,c,v,u,t,d,e,g,h,k)(ij.c(h))))return T.b(t,xa(Ic(n)));n=Ic(n)}else return null}}}(a,
b,c,d,e,g,h,k),null,null)}}(b,a,c,n,t,g,e,d)(b)}(),k=H(a),m=c;b=h;a=k;c=m}else return b}};ew.A=3;function qw(b,a){return Mh(R.b($d,ew.b(b,a)))}var rw=function rw(a,c){if(null!=a&&null!=a.Ac)return a.Ac(a,c);var d=rw[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=rw._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("IContextResolve.-context-resolve",a);};is.prototype.Ac=function(b,a){return Zv(a,this.symbol)};
js.prototype.Ac=function(b,a){return Xf(a,new U(null,2,5,W,[Ak,this.symbol],null))};ns.prototype.Ac=function(){return C.b(Gv,this.symbol)};ms.prototype.Ac=function(){return this.value};function sw(b,a,c){return Wf.w(function(b,e,g){if(p(Ns(b))){e=rw(Jj.c(b),a);b=R.b(function(){return function(b){return rw(b,a)}}(e),Oh(Vi.c(b)));var h=R.b(function(){return function(a){return ud(a,g)}}(e,b),c);return Ta.b(e,T.b(b,new U(null,1,5,W,[h],null)))}return e},b,G(c),Uh.C())}
function tw(b){var a=lf(Ns);return Tf(Ha,R.f(function(b,d){return p(a.c?a.c(b):a.call(null,b))?d:null},b,Uh.C()))}
function uw(b,a,c){var d=tw(b),e=function(a){return function(b){return R.b(function(){return function(a){return ud(b,a)}}(a),a)}}(d);c=yi(e,c);return function(c,d,e){return function n(t){return new Ke(null,function(){return function(){for(;;){var c=F(t);if(c){if(Kd(c)){var d=dc(c),e=L(d),g=Oe(e);a:for(var h=0;;)if(h<e){var k=y.b(d,h);M(k,0);k=M(k,1);k=sw(b,a,k);g.add(k);h+=1}else{d=!0;break a}return d?Pe(Re(g),n(ec(c))):Pe(Re(g),null)}g=G(c);M(g,0);g=M(g,1);return gd(sw(b,a,g),n(Ic(c)))}return null}}}(c,
d,e),null,null)}}(d,e,c)(c)}var vw=function vw(a,c){if(null!=a&&null!=a.Bc)return a.Bc(a,c);var d=vw[ba(null==a?null:a)];if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);d=vw._;if(null!=d)return d.b?d.b(a,c):d.call(null,a,c);throw Na("IPostProcess.-post-process",a);};Js.prototype.Bc=function(b,a){return a};Ks.prototype.Bc=function(b,a){return Vf.f(rd,R.c(G),a)};Ls.prototype.Bc=function(b,a){return od(a)};Ms.prototype.Bc=function(b,a){return G(a)};
function ww(b,a,c){return function(a){return function g(b){return new Ke(null,function(a){return function(){for(;;){var c=F(b);if(c){var d=c;if(Kd(d)){var t=dc(d),u=L(t),v=Oe(u);return function(){for(var b=0;;)if(b<u){var g=y.b(t,b);Qe(v,Wf.f(function(){return function(a,b){if(p(a)){var c=M(a,0),d=M(a,1);return gu(c,d,new U(null,1,5,W,[b],null),!1)}return b}}(b,g,t,u,v,d,c,a),a,g));b+=1}else return!0}()?Pe(Re(v),g(ec(d))):Pe(Re(v),null)}var x=G(d);return gd(Wf.f(function(){return function(a,b){if(p(a)){var c=
M(a,0),d=M(a,1);return gu(c,d,new U(null,1,5,W,[b],null),!1)}return b}}(x,d,c,a),a,x),g(Ic(d)))}return null}}}(a),null,null)}}(function(){return function e(b){return new Ke(null,function(){for(;;){var c=F(b);if(c){if(Kd(c)){var k=dc(c),m=L(k),n=Oe(m);a:for(var t=0;;)if(t<m){var u=y.b(k,t),u=p(Os(u))?new U(null,2,5,W,[rw(rl.c(u),a),Lt(rw(Ao.c(u),a))],null):null;n.add(u);t+=1}else{k=!0;break a}return k?Pe(Re(n),e(ec(c))):Pe(Re(n),null)}n=G(c);return gd(p(Os(n))?new U(null,2,5,W,[rw(rl.c(n),a),Lt(rw(Ao.c(n),
a))],null):null,e(Ic(c)))}return null}},null,null)}(b)}())(c)}var xw=qf(mt(Q,function(b){for(var a=[],c=arguments.length,d=0;;)if(d<c)a.push(arguments[d]),d+=1;else break;a:for(a=F(0<a.length?new Hc(a.slice(0),0):null),d=Eh;;)if(a)c=H(H(a)),d=N.f(d,G(a),nd(a)),a=c;else break a;return d}(),Q,0,100));
function yw(b){var a=C.f(I.c?I.c(xw):I.call(null,xw),b,null);if(p(a))return a;if(Ed(b))a=b;else if(Dd(b))a=ht(b);else throw Ri(""+r("Query should be a vector or a map"),new l(null,2,[en,Fo,qn,b],null));var c=a,a=Qs(aj.c(c)),d=zm.c(c);if(p(d)){var e=bs(os,d);if(p(e))d=e;else throw Ri(""+r("Cannot parse :with clause, expected [ variable+ ]"),new l(null,2,[en,om,qn,d],null));}else d=null;var e=yo.b(c,new U(null,1,5,W,[ym],null)),g=bs(Rs,e);if(!p(g))throw Ri(""+r("Cannot parse :in clause, expected (src-var | % | plain-symbol | bind-scalar | bind-tuple | bind-coll | bind-rel)"),
new l(null,2,[en,Xi,qn,e],null));e=g;c=Hj.b(c,rd);g=Zs(c);if(!p(g))throw Ri(""+r("Cannot parse :where clause, expected [clause+]"),new l(null,2,[en,dk,qn,c],null));a=new l(null,4,[aj,a,zm,d,yo,e,Hj,g],null);a=new gt(aj.c(a),zm.c(a),yo.c(a),Hj.c(a),null,O.h(a,aj,E([zm,yo,Hj],0)),null);it(a,b);lc(xw,N.f(Ab(xw),b,a));return a}var zw=function zw(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;return zw.h(arguments[0],1<c.length?new Hc(c.slice(1),0):null)};
zw.h=function(b,a){var c=yw(b),d=aj.c(c),e=Is(d),g=Qf(Fs,E([Is(d)],0)),h=L(e),k=zm.c(c),m=T.b(g,R.b(yk,k)),n=Dd(b)?ht(b):b,t=Hj.c(n),u=Mv(new pv(rd,Q,Q,null,null,null),yo.c(c),a),v=qw(w.f(pw,u,t),m),c=p(zm.c(n))?Wf.b(function(a,b,c,d,e,g){return function(a){return $d(ug.f(a,0,g))}}(v,c,d,e,g,h,k,m,n,t,u,v),v):v,c=p(hf(Ns,e))?uw(e,u,c):c,e=p(hf(Os,e))?ww(e,u,c):c;return vw(d,e)};zw.A=1;zw.K=function(b){var a=G(b);b=H(b);return zw.h(a,b)};var Aw,Bw;ia("datascript.core.q",zw);ia("datascript.core.entity",cv);ia("datascript.core.entity_db",function(b){if(!p(b instanceof lv))throw Error([r("Assert failed: "),r(X.h(E([vc(hm,Fj)],0)))].join(""));return b.db});ia("datascript.core.datom",Tp);ia("datascript.core.pull",function(b,a,c){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));return gu(b,Lt(a),new U(null,1,5,W,[c],null),!1)});
ia("datascript.core.pull_many",function(b,a,c){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));return gu(b,Lt(a),c,!0)});ia("datascript.core.touch",gv);ia("datascript.core.empty_db",rq);ia("datascript.core.init_db",Gq);ia("datascript.core.datom_QMARK_",Up);ia("datascript.core.db_QMARK_",zq);ia("datascript.core.tx0",536870912);function Cw(b){return b instanceof Aq}ia("datascript.core.is_filtered",Cw);
ia("datascript.core.filter",function(b,a){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));if(p(Cw(b))){var c=b.Ya;return new Aq(c,function(b,c){return function(g){var h=a.b?a.b(c,g):a.call(null,c,g);return p(h)?b.hb.call(null,g):h}}(b,c),null,null,null)}return new Aq(b,function(c){return a.b?a.b(b,c):a.call(null,b,c)},null,null,null)});
function Dw(b){for(var a=[],c=arguments.length,d=0;;)if(d<c)a.push(arguments[d]),d+=1;else break;switch(a.length){case 2:return Dw.b(arguments[0],arguments[1]);case 3:return Dw.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(a.length)].join(""));}}ia("datascript.core.with$",Dw);Dw.b=function(b,a){return Dw.f(b,a,null)};
Dw.f=function(b,a,c){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));if(p(Cw(b)))throw Ri("Filtered DB cannot be modified",new l(null,1,[en,sl],null));return dr(Lq(new l(null,5,[Vl,b,jk,b,Zl,rd,dj,Q,Cn,c],null)),a)};Dw.A=3;ia("datascript.core.db_with",function(b,a){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));return jk.c(Dw.b(b,a))});
var Ew=function Ew(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Ew.b(arguments[0],arguments[1]);case 3:return Ew.f(arguments[0],arguments[1],arguments[2]);case 4:return Ew.w(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Ew.R(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return Ew.ca(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);default:throw Error([r("Invalid arity: "),
r(c.length)].join(""));}};ia("datascript.core.datoms",Ew);Ew.b=function(b,a){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));return hq(b,a,rd)};Ew.f=function(b,a,c){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));return hq(b,a,new U(null,1,5,W,[c],null))};Ew.w=function(b,a,c,d){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));return hq(b,a,new U(null,2,5,W,[c,d],null))};
Ew.R=function(b,a,c,d,e){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));return hq(b,a,new U(null,3,5,W,[c,d,e],null))};Ew.ca=function(b,a,c,d,e,g){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));return hq(b,a,new U(null,4,5,W,[c,d,e,g],null))};Ew.A=6;
var Fw=function Fw(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Fw.b(arguments[0],arguments[1]);case 3:return Fw.f(arguments[0],arguments[1],arguments[2]);case 4:return Fw.w(arguments[0],arguments[1],arguments[2],arguments[3]);case 5:return Fw.R(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);case 6:return Fw.ca(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);default:throw Error([r("Invalid arity: "),
r(c.length)].join(""));}};ia("datascript.core.seek_datoms",Fw);Fw.b=function(b,a){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));return iq(b,a,rd)};Fw.f=function(b,a,c){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));return iq(b,a,new U(null,1,5,W,[c],null))};Fw.w=function(b,a,c,d){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));return iq(b,a,new U(null,2,5,W,[c,d],null))};
Fw.R=function(b,a,c,d,e){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));return iq(b,a,new U(null,3,5,W,[c,d,e],null))};Fw.ca=function(b,a,c,d,e,g){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));return iq(b,a,new U(null,4,5,W,[c,d,e,g],null))};Fw.A=6;ia("datascript.core.index_range",function(b,a,c,d){if(!p(zq(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(Sk,tl)],0)))].join(""));return jq(b,a,c,d)});
ia("datascript.core.entid",Nq);function Gw(b){var a=null!=b?b.m&32768||b.ve?!0:b.m?!1:La(zb,b):La(zb,b);return a?zq(I.c?I.c(b):I.call(null,b)):a}ia("datascript.core.conn_QMARK_",Gw);function Hw(b){var a=new l(null,1,[bo,sf.c?sf.c(Q):sf.call(null,Q)],null);return sf.f?sf.f(b,Ba,a):sf.call(null,b,Ba,a)}ia("datascript.core.conn_from_db",Hw);
var Iw=function Iw(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return Iw.c(arguments[0]);case 2:return Iw.b(arguments[0],arguments[1]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};ia("datascript.core.conn_from_datoms",Iw);Iw.c=function(b){return Hw(Gq.c?Gq.c(b):Gq.call(null,b))};Iw.b=function(b,a){return Hw(Gq.b?Gq.b(b,a):Gq.call(null,b,a))};Iw.A=2;
var Jw=function Jw(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return Jw.C();case 1:return Jw.c(arguments[0]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};ia("datascript.core.create_conn",Jw);Jw.C=function(){return Hw(rq.C?rq.C():rq.call(null))};Jw.c=function(b){return Hw(rq.c?rq.c(b):rq.call(null,b))};Jw.A=1;
function Kw(b,a,c){if(!p(Gw(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(En,gk)],0)))].join(""));var d=sf.c?sf.c(null):sf.call(null,null);xf.b(b,function(b){return function(d){d=Dw.f(d,a,c);uf.b?uf.b(b,d):uf.call(null,b,d);return jk.c(d)}}(d));return I.c?I.c(d):I.call(null,d)}
var Lw=function Lw(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Lw.b(arguments[0],arguments[1]);case 3:return Lw.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};ia("datascript.core.transact_BANG_",Lw);Lw.b=function(b,a){return Lw.f(b,a,null)};
Lw.f=function(b,a,c){if(!p(Gw(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(En,gk)],0)))].join(""));a=Kw(b,a,c);b=bo.c(yd(b));b=I.c?I.c(b):I.call(null,b);b=F(b);c=null;for(var d=0,e=0;;)if(e<d){var g=c.da(null,e);M(g,0);g=M(g,1);g.c?g.c(a):g.call(null,a);e+=1}else if(b=F(b))Kd(b)?(d=dc(b),b=ec(b),c=d,d=L(d)):(c=G(b),M(c,0),c=M(c,1),c.c?c.c(a):c.call(null,a),b=H(b),c=null,d=0),e=0;else break;return a};Lw.A=3;
var Mw=function Mw(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Mw.b(arguments[0],arguments[1]);case 3:return Mw.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};ia("datascript.core.reset_conn_BANG_",Mw);Mw.b=function(b,a){return Mw.f(b,a,null)};
Mw.f=function(b,a,c){c=Lq(new l(null,4,[Vl,I.c?I.c(b):I.call(null,b),jk,a,Zl,T.b(R.b(function(a){return N.f(a,tk,!1)},Ew.b(I.c?I.c(b):I.call(null,b),Kl)),Ew.b(a,Kl)),Cn,c],null));uf.b?uf.b(b,a):uf.call(null,b,a);for(var d=F(function(){var a=bo.c(yd(b));return I.c?I.c(a):I.call(null,a)}()),e=null,g=0,h=0;;)if(h<g){var k=e.da(null,h);M(k,0);k=M(k,1);k.c?k.c(c):k.call(null,c);h+=1}else if(d=F(d))Kd(d)?(g=dc(d),d=ec(d),e=g,g=L(g)):(e=G(d),M(e,0),e=M(e,1),e.c?e.c(c):e.call(null,c),d=H(d),e=null,g=0),h=
0;else break;return a};Mw.A=3;var Nw=function Nw(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return Nw.b(arguments[0],arguments[1]);case 3:return Nw.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};ia("datascript.core.listen_BANG_",Nw);Nw.b=function(b,a){return Nw.f(b,si.C(),a)};
Nw.f=function(b,a,c){if(!p(Gw(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(En,gk)],0)))].join(""));xf.w(bo.c(yd(b)),N,a,c);return a};Nw.A=3;ia("datascript.core.unlisten_BANG_",function(b,a){if(!p(Gw(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(En,gk)],0)))].join(""));return xf.f(bo.c(yd(b)),O,a)});
for(var Ow=F(new l(null,2,[Ol,function(b){return Ta.b(Tp,b)},cn,function(b){var a=null!=b&&(b.m&64||b.Ua)?Ta.b(Uc,b):b,c=C.b(a,ej),d=C.b(a,so);return Gq.b(R.b(function(){return function(a){var b=M(a,0),c=M(a,1),d=M(a,2);a=M(a,3);return new Sp(b,c,d,a,!0)}}(b,a,c,d),d),c)}],null)),Pw=null,Qw=0,Rw=0;;)if(Rw<Qw){var Sw=Pw.da(null,Rw),Tw=M(Sw,0),Uw=M(Sw,1);bv(Tw,Uw);Rw+=1}else{var Vw=F(Ow);if(Vw){var Ww=Vw;if(Kd(Ww))var Xw=dc(Ww),Yw=ec(Ww),Zw=Xw,$w=L(Xw),Ow=Yw,Pw=Zw,Qw=$w;else{var ax=G(Ww),bx=M(ax,0),
cx=M(ax,1);bv(bx,cx);Ow=H(Ww);Pw=null;Qw=0}Rw=0}else break}var dx=sf.c?sf.c(-1E6):sf.call(null,-1E6),ex=function ex(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 1:return ex.c(arguments[0]);case 2:return ex.b(arguments[0],arguments[1]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};ia("datascript.core.tempid",ex);ex.c=function(b){return B.b(b,vm)?Bm:xf.b(dx,le)};ex.b=function(b,a){return B.b(b,vm)?Bm:a};ex.A=2;
ia("datascript.core.resolve_tempid",function(b,a,c){return C.b(a,c)});ia("datascript.core.db",function(b){if(!p(Gw(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(En,gk)],0)))].join(""));return I.c?I.c(b):I.call(null,b)});
var fx=function fx(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return fx.b(arguments[0],arguments[1]);case 3:return fx.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};ia("datascript.core.transact",fx);fx.b=function(b,a){return fx.f(b,a,null)};
fx.f=function(b,a,c){if(!p(Gw(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(En,gk)],0)))].join(""));var d=Lw.f(b,a,c);"undefined"===typeof Aw&&(Aw=function(a,b,c,d,m){this.ee=a;this.ib=b;this.jb=c;this.nc=d;this.je=m;this.m=491520;this.F=1},Aw.prototype.P=function(){return function(a,b){return new Aw(this.ee,this.ib,this.jb,this.nc,b)}}(d),Aw.prototype.O=function(){return function(){return this.je}}(d),Aw.prototype.fc=function(){return function(){return this.nc}}(d),Aw.pd=function(){return function(){return new U(null,
5,5,W,[gk,jn,cj,Ti,qa.De],null)}}(d),Aw.xc=!0,Aw.Wb="datascript.core/t_datascript$core17729",Aw.Qc=function(){return function(a,b){return Rb(b,"datascript.core/t_datascript$core17729")}}(d));return new Aw(b,a,c,d,Q)};fx.A=3;
var gx=function gx(a){var c=sf.c?sf.c(null):sf.call(null,null),d=sf.c?sf.c(!1):sf.call(null,!1);setTimeout(function(c,d){return function(){var h=a.C?a.C():a.call(null);uf.b?uf.b(c,h):uf.call(null,c,h);return uf.b?uf.b(d,!0):uf.call(null,d,!0)}}(c,d),0);"undefined"===typeof Bw&&(Bw=function(a,c,d,k,m){this.he=a;this.od=c;this.nc=d;this.pe=k;this.ke=m;this.m=491520;this.F=1},Bw.prototype.P=function(){return function(a,c){return new Bw(this.he,this.od,this.nc,this.pe,c)}}(c,d),Bw.prototype.O=function(){return function(){return this.ke}}(c,
d),Bw.prototype.fc=function(){return function(){return I.c?I.c(this.nc):I.call(null,this.nc)}}(c,d),Bw.pd=function(){return function(){return new U(null,5,5,W,[Wc(Ej,new l(null,2,[fk,!0,df,vc(ef,vc(new U(null,1,5,W,[Eo],null)))],null)),Eo,Ti,il,qa.Ee],null)}}(c,d),Bw.xc=!0,Bw.Wb="datascript.core/t_datascript$core17751",Bw.Qc=function(){return function(a,c){return Rb(c,"datascript.core/t_datascript$core17751")}}(c,d));return new Bw(gx,a,c,d,Q)},hx=function hx(a){for(var c=[],d=arguments.length,e=0;;)if(e<
d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 2:return hx.b(arguments[0],arguments[1]);case 3:return hx.f(arguments[0],arguments[1],arguments[2]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};ia("datascript.core.transact_async",hx);hx.b=function(b,a){return hx.f(b,a,null)};hx.f=function(b,a,c){if(!p(Gw(b)))throw Error([r("Assert failed: "),r(X.h(E([vc(En,gk)],0)))].join(""));return gx(function(){return Lw.f(b,a,c)})};hx.A=3;
function ix(b,a){var c=b.toString(16),d=L(c);return d>a?we.f(c,0,a):d<a?[r(Ta.b(r,Gf(a-d,Jf("0")))),r(c)].join(""):c}var jx=function jx(a){for(var c=[],d=arguments.length,e=0;;)if(e<d)c.push(arguments[e]),e+=1;else break;switch(c.length){case 0:return jx.C();case 1:return jx.c(arguments[0]);default:throw Error([r("Invalid arity: "),r(c.length)].join(""));}};ia("datascript.core.squuid",jx);jx.C=function(){return jx.c((new Date).getTime())};
jx.c=function(b){b=[r(ix(b/1E3|0,8)),r("-"),r(ix(xi(65536),4)),r("-"),r(ix(xi(65536)&4095|16384,4)),r("-"),r(ix(xi(65536)&16383|32768,4)),r("-"),r(ix(xi(65536),4)),r(ix(xi(65536),4)),r(ix(xi(65536),4))].join("");return new Pi(b,null)};jx.A=1;ia("datascript.core.squuid_time_millis",function(b){b=we.f(""+r(b),0,8);return 1E3*parseInt(b,16)});if("undefined"===typeof kx)var kx=Jw.c(new l(null,1,[Il,new l(null,1,[Lj,rj],null)],null));function lx(b,a,c){return new Date(b,a-1,c,12,0,0)}var mx=lx(2E3,1,1);function nx(){var b=new U(null,4,5,W,[aj,new U(null,2,5,W,[vc(tj,Xl,new U(null,11,5,W,[Il,yl,im,io,Cm,Vn,cm,ln,kk,xl,Rj],null)),Pn],null),Hj,new U(null,2,5,W,[Xl,Il],null)],null),a=I.c?I.c(kx):I.call(null,kx);return zw.b?zw.b(b,a):zw.call(null,b,a)}
function ox(b){var a=new U(null,8,5,W,[aj,vc(tj,Xl,new U(null,11,5,W,[Il,yl,im,io,Cm,Vn,cm,ln,kk,xl,Rj],null)),xn,yo,ym,ko,Hj,new U(null,3,5,W,[Xl,Il,ko],null)],null),c=I.c?I.c(kx):I.call(null,kx);return zw.f?zw.f(a,c,b):zw.call(null,a,c,b)}
function px(b,a){var c=b.c?b.c(im):b.call(null,im);if(!p(c))var d=b.c?b.c(io):b.call(null,io),e=b.c?b.c(Cm):b.call(null,Cm),c=Lr(b.c?b.c(Vn):b.call(null,Vn)),g=Lr(b.c?b.c(cm):b.call(null,cm)),h=Lr(b.c?b.c(ln):b.call(null,ln)),k=Pr(b.c?b.c(kk):b.call(null,kk)),m=Lr(b.c?b.c(xl):b.call(null,xl)),n=(b.c?b.c(Rj):b.call(null,Rj)).getTime()/1E3,k=Tr(e,(a.getTime()/1E3-n)*Jr/k+m),k=2*Math.atan2(Math.sqrt(1+e)*Math.sin(k/2),Math.sqrt(1-e)*Math.cos(k/2)),d=d*(1-e*e)/(1+e*Math.cos(k)),c=Qr(Rr(g),Qr(new U(null,
3,5,W,[new U(null,3,5,W,[1,0,0],null),new U(null,3,5,W,[0,Math.cos(c),-Math.sin(c)],null),new U(null,3,5,W,[0,Math.sin(c),Math.cos(c)],null)],null),Qr(Rr(h),new U(null,3,5,W,[d*Math.cos(k),d*Math.sin(k),0],null))));return c}function qx(b){var a=new U(null,9,5,W,[aj,Yn,xn,yo,ym,ko,Hj,new U(null,3,5,W,[Xl,Il,ko],null),new U(null,3,5,W,[Xl,kk,Yn],null)],null),c=I.c?I.c(kx):I.call(null,kx);return zw.f?zw.f(a,c,b):zw.call(null,a,c,b)}
if("undefined"===typeof rx)var rx=Lw.b(kx,new U(null,31,5,W,[new l(null,4,[Il,"Sol",yl,pl,Nl,1.98855E30,im,new U(null,3,5,W,[0,0,0],null)],null),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[mx,87.969,174.796,Sl,"Mercury",3.3011E23,48.331,.20563,29.124,7.005,5790905E4]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[mx,224.701,50.115,Sl,"Venus",4.8675E24,76.86,.006772,54.884,3.39458,108208E6]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[mx,365.256363004,358.617,Sl,"Earth",5.97237E24,-11.26064,.0167086,114.20783,5E-5,
149598023E3]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[mx,686.971,19.373,Sl,"Mars",6.4171E23,49.558,.0934,286.502,1.85,2279392E5]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[mx,4332.59,20.02,Sl,"Jupiter",1.8986E27,100.464,.048498,273.867,1.303,778299E6]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[mx,10759.22,317.02,Sl,"Saturn",5.6836E26,113.665,.05555,339.392,2.48524,142939E7]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[mx,30688.5,142.2386,Sl,"Uranus",8.681E25,74.006,.046381,96.998857,.773,287504E7]),wd([Rj,kk,
xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[mx,60182,256.228,Sl,"Neptune",1.0243E26,131.784,.009456,276.336,1.767975,450445E7]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2014,12,9),1681.63,95.9891,xo,"Ceres",9.393E20,80.3293,.075823,72.522,10.593,41401E7]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2014,12,9),1685.371678,78.228704,Zk,"Pallas",2.11E20,173.096248,.23127363,309.930328,34.840998,4147E8]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2014,12,9),1325.75,20.86384,Zk,"Vesta",2.59076E20,103.85136,.08874,151.19853,
7.14043,353323784E3]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2014,12,9),1594.18,33.077,Zk,"Juno",2.67E19,169.8712,.25545,248.41,12.9817,399725E6]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2014,12,9),1508.213773,260.189542,Zk,"Astrea",29E17,141.59556,.19113549,358.92898,5.368523,384945E6]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2005,11,26),1379.756,247.947,Zk,"Hebe",1.28E19,138.752,.202,239.492,14.751,362851E6]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2005,11,26),1345.375,269.531,Zk,"Iris",
1.62E19,259.727,.231,145.44,5.527,356798E6]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2005,11,26),1193.549,156.401,Zk,"Flora",847E16,111.011,.1561,285.128,5.886,329422E6]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2004,7,14),1346.815,274.183,Zk,"Metis",1.47E19,68.982,.122,5.489,5.576,357556E6]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2015,6,27),2034.3,264.46,Zk,"Hygiea",8.67E19,283.41,.1146,312.1,3.8377,47005816E4]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[mx,90581,14.53,xo,"Pluto",1.303E22,110.299,
.24905,113.834,17.1405,5915E9]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2014,12,9),103774,209.07,xo,"Haumea",4.006E21,121.79,.19126,240.2,28.19,6465E9]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2014,12,9),112897,15,xo,"Makemake",4.4E21,79.3659,.15586,297.24,29.00685,45.715*1496E8]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2014,12,9),203830,204.16,xo,"Eris",1.66E22,35.9531,.44068,150.997,44.0445,101400376E5]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2016,1,13),90571.28,174.67,xo,"Orcus",6.41E20,
268.57,.21799,72.977,20.564,59045E9]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2016,1,13),98924,121.85,xo,"Salacia",4.38E20,280.14,.10905,307.9,23.936,62622E9]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2016,1,13),104334,287.542,xo,"Quaoar",1.4E21,188.772,.034704,155.246,7.987,64885E9]),wd([Rj,kk,xl,yl,Il,cm,Cm,ln,Vn,io],[lx(2016,1,13),4163922.5382455997,358.163,xo,"Sedna",311.29,.85491,311.29,11.92872,7573E10]),wd([Rj,kk,xl,yl,Il,Nl,cm,Cm,ln,Vn,io],[lx(2016,1,13),103435,105.119,xo,"Varuna",3.7E26,
97.29,.050464,270.89,17.165,64511E8]),wd([Rj,kk,xl,yl,Il,cm,Cm,ln,Vn,io],[lx(2016,1,13),90692.7,280.54,xo,"Ixion",71.019,.24171,299.73,19.619,59099E8]),wd([Rj,kk,xl,yl,Il,cm,Cm,ln,Vn,io],[lx(2016,1,13),113199,337.2998,xo,"Chaos",50.9239,.10567,58.4097,12.0502,6851E9]),wd([Rj,kk,xl,yl,Il,cm,Cm,ln,Vn,io],[lx(2016,1,13),91117.9,1.5319,xo,"Huya",169.23,.27997,67.576,15.463,59283E8])],null));var sx=new Ud(null,new l(null,2,[Zk,null,xo,null],null),null);function tx(b,a){return[r("translate("),r(b),r(","),r(a),r(")")].join("")}function ux(b){var a=M(b,0);b=M(b,1);return[r(a),r(","),r(b)].join("")}function vx(b){return[r("M"),r(Io(Of(R.b(ux,b))))].join("")}function wx(b){var a;a=2-L(""+r(b));a=Gf(a,Jf("0"));return[r(Ta.b(r,a)),r(b)].join("")}function xx(b){return[r(b.getFullYear()),r("-"),r(wx(b.getMonth()+1)),r("-"),r(wx(b.getDate()))].join("")}
function yx(b,a){var c=null!=a&&(a.m&64||a.Ua)?Ta.b(Uc,a):a,d=C.b(c,sj),e=C.b(c,Yl),g=C.b(c,uj);return new U(null,5,5,W,[Wl,Q,new U(null,3,5,W,[Wl,new l(null,1,[Gl,"right"],null),function(){var a=M(e,0),b=M(e,1);if(p(p(a)?b:a)){var c,a=px(ox(a),g),b=px(ox(b),g),b=w.b(de,R.f(mf.b(Kr,Mr),a,b));c=Math.sqrt(b);var b=W,a=Q,d=W,t=Q,u=.01*Math.round(c/1496E8/.01),v;v=(1*Math.round(c/1E3/1)).toString();var x=/\B(?=(\d{3})+(?!\d))/;if("string"===typeof x)v=v.replace(new RegExp(String(x).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,
"\\$1").replace(/\x08/g,"\\x08"),"g"),",");else if(x instanceof RegExp)v=v.replace(new RegExp(x.source,"g"),",");else throw[r("Invalid match arg: "),r(x)].join("");d=new U(null,7,5,d,[Wl,t,u," AU"," (",v," km)"],null);if(p(Zh(/travel/,window.location.search))){t=W;u=Q;v=W;var x=Q,A,D=2*Math.sqrt(c/9.8)/60/60/24,J=D|0,D=24*(D-J);A=D|0;A=new U(null,3,5,W,[J,A,1*Math.round(60*(D-A)/1)],null);J=M(A,0);D=M(A,1);A=M(A,2);c=new U(null,4,5,t,[Wl,u,new U(null,3,5,v,[Wl,x,new U(null,8,5,W,[Do,Q,J," days ",
D," hours ",A," minutes"],null)],null),new U(null,4,5,W,[Wl,Q,.1*Math.round(100*(Math.pow(Hr,Math.sqrt(19.6*c)/1499E4)-1)/.1),"%"],null)],null)}else c=null;return new U(null,4,5,b,[Wl,a,d,c],null)}return"Click two bodies to see the distance between them."}()],null),new U(null,6,5,W,[Wl,new l(null,1,[Gl,"spaced"],null),"Zoom:",new U(null,3,5,W,[mk,new l(null,2,[Gl,"button--square",Xk,function(){return function(){return b.b?b.b(jm,le):b.call(null,jm,le)}}(a,c,d,e,g)],null),"-"],null),new U(null,3,5,
W,[Do,Q,d],null),new U(null,3,5,W,[mk,new l(null,2,[Gl,"button--square",Xk,function(){return function(){return b.b?b.b(jm,Xc):b.call(null,jm,Xc)}}(a,c,d,e,g)],null),"+"],null)],null),new U(null,4,5,W,[Wl,new l(null,1,[Gl,"spaced"],null),"Date:",new U(null,2,5,W,[vn,new l(null,3,[ck,"YYYY-MM-DD",Kk,xx(g),gj,function(){return function(){var a=this.value;return b.b?b.b(Hl,a):b.call(null,Hl,a)}}(a,c,d,e,g)],null)],null)],null)],null)}
function zx(b,a,c,d){var e=p(function(){var a=d.c?d.c(yl):d.call(null,yl);return sx.c?sx.c(a):sx.call(null,a)}())?"8":"10",g=p(function(){var a=d.c?d.c(yl):d.call(null,yl);return sx.c?sx.c(a):sx.call(null,a)}())?"hsl(0, 0%, 70%)":"hsl(0, 0%, 100%)";return new U(null,5,5,W,[$l,new l(null,3,[Nj,Ta.b(tx,function(){var b=px(d,c);return a.c?a.c(b):a.call(null,b)}()),Rl,new l(null,1,[el,"pointer"],null),Xk,function(){return function(){var a=d.c?d.c(Il):d.call(null,Il);return b.b?b.b(Wi,a):b.call(null,Wi,
a)}}(e,g)],null),new U(null,2,5,W,[Tk,new l(null,2,[vj,2,Ik,g],null)],null),new U(null,3,5,W,[Co,new l(null,5,[Yk,-3,hk,e,Yi,"middle",Aj,"black",rm,2],null),d.c?d.c(Il):d.call(null,Il)],null),new U(null,3,5,W,[Co,new l(null,4,[Yk,-3,hk,e,Yi,"middle",Ik,g],null),d.c?d.c(Il):d.call(null,Il)],null)],null)}
function Ax(b,a){var c=null!=a&&(a.m&64||a.Ua)?Ta.b(Uc,a):a,d=C.b(c,sj),e=C.b(c,pk),g=C.b(c,Yl),h=C.b(c,uj),k=new U(null,2,5,W,[960,600],null),m=M(k,0),n=M(k,1),t=function(){return function(a){var b=Math.log(2E-12)/-100;return Math.pow(Hr,b*a)}}(k,m,n,a,c,d,e,g,h),u=function(a,b,c,d,e,g,h){return function(a){var b=M(a,0);a=M(a,1);var c=d(h);return new U(null,2,5,W,[c*b,c*-a],null)}}(k,m,n,t,a,c,d,e,g,h);return new U(null,4,5,W,[Rm,new l(null,8,[Wk,m,vo,n,qo,"PT Sans",hk,"8pt",Rl,new l(null,2,[Mn,
"1px solid lightgray",el,"move"],null),Pm,function(){return function(a){a.preventDefault();var c=a.clientX;a=a.clientY;return b.f?b.f(Xm,c,a):b.call(null,Xm,c,a)}}(k,m,n,t,u,a,c,d,e,g,h),wn,function(){return function(a){a.preventDefault();var c=a.clientX;a=a.clientY;return b.f?b.f(oj,c,a):b.call(null,oj,c,a)}}(k,m,n,t,u,a,c,d,e,g,h),$i,function(){return function(a){a.preventDefault();return b.c?b.c(Zm):b.call(null,Zm)}}(k,m,n,t,u,a,c,d,e,g,h)],null),new U(null,2,5,W,[Xn,new l(null,3,[Wk,m,vo,n,Ik,
"black"],null)],null),new U(null,3,5,W,[$l,new l(null,1,[Nj,tx(m/2,n/2)],null),new U(null,5,5,W,[$l,new l(null,1,[Nj,Ta.b(tx,e)],null),function(){return function(a,b,c,d,e,g,h,k,m,n,t){return function pa(u){return new Ke(null,function(a,b,c,d,e,g,h,k,m,n,t){return function(){for(;;){var v=F(u);if(v){var x=v;if(Kd(x)){var A=dc(x),D=L(A),J=Oe(D);return function(){for(var u=0;;)if(u<D){var K=y.b(A,u);Qe(J,new U(null,2,5,W,[Zi,new l(null,3,[dn,vx(function(){return function(a,b,c,d,e,g,h,k,m,n,t,u,v,x,
A,D,J,K){return function zs(P){return new Ke(null,function(a,b,c,d,e,g,h,k,m,n,t,u){return function(){for(;;){var a=F(P);if(a){if(Kd(a)){var c=dc(a),d=L(c),e=Oe(d);a:for(var g=0;;)if(g<d){var h=y.b(c,g),h=u(px(b,h));e.add(h);g+=1}else{c=!0;break a}return c?Pe(Re(e),zs(ec(a))):Pe(Re(e),null)}e=G(a);return gd(u(px(b,e)),zs(Ic(a)))}return null}}}(a,b,c,d,e,g,h,k,m,n,t,u,v,x,A,D,J,K),null,null)}}(u,K,A,D,J,x,v,a,b,c,d,e,g,h,k,m,n,t)(Or(t,Pr(qx(K.c?K.c(Il):K.call(null,Il)))))}()),Aj,p(function(){var a=
K.c?K.c(yl):K.call(null,yl);return sx.c?sx.c(a):sx.call(null,a)}())?"hsl(0, 0%, 20%)":"hsl(0, 0%, 50%)",Ik,"none"],null)],null));u+=1}else return!0}()?Pe(Re(J),pa(ec(x))):Pe(Re(J),null)}var K=G(x);return gd(new U(null,2,5,W,[Zi,new l(null,3,[dn,vx(function(){return function(a,b,c,d,e,g,h,k,m,n,t,u,v,x){return function sr(A){return new Ke(null,function(a,b,c,d,e,g,h,k){return function(){for(;;){var b=F(A);if(b){if(Kd(b)){var c=dc(b),d=L(c),e=Oe(d);a:for(var g=0;;)if(g<d){var h=y.b(c,g),h=k(px(a,h));
e.add(h);g+=1}else{c=!0;break a}return c?Pe(Re(e),sr(ec(b))):Pe(Re(e),null)}e=G(b);return gd(k(px(a,e)),sr(Ic(b)))}return null}}}(a,b,c,d,e,g,h,k,m,n,t,u,v,x),null,null)}}(K,x,v,a,b,c,d,e,g,h,k,m,n,t)(Or(t,Pr(qx(K.c?K.c(Il):K.call(null,Il)))))}()),Aj,p(function(){var a=K.c?K.c(yl):K.call(null,yl);return sx.c?sx.c(a):sx.call(null,a)}())?"hsl(0, 0%, 20%)":"hsl(0, 0%, 50%)",Ik,"none"],null)],null),pa(Ic(x)))}return null}}}(a,b,c,d,e,g,h,k,m,n,t),null,null)}}(k,m,n,t,u,a,c,d,e,g,h)(nx())}(),function(){return function(a,
c,d,e,g,h,k,m,n,t,u){return function pa(wa){return new Ke(null,function(a,c,d,e,g,h,k,m,n,t,u){return function(){for(;;){var a=F(wa);if(a){if(Kd(a)){var c=dc(a),d=L(c),e=Oe(d);a:for(var h=0;;)if(h<d){var k=y.b(c,h),k=zx(b,g,u,k);e.add(k);h+=1}else{c=!0;break a}return c?Pe(Re(e),pa(ec(a))):Pe(Re(e),null)}e=G(a);return gd(zx(b,g,u,e),pa(Ic(a)))}return null}}}(a,c,d,e,g,h,k,m,n,t,u),null,null)}}(k,m,n,t,u,a,c,d,e,g,h)(nx())}(),function(){var a=M(g,0),b=M(g,1);if(p(p(a)?b:a)){var a=u(px(ox(a),h)),b=u(px(ox(b),
h)),c;c=E([a,b],0);c=Ta.f(Wf,de,c);Sr(c);return new U(null,3,5,W,[$l,Q,new U(null,2,5,W,[Zi,new l(null,3,[dn,vx(new U(null,2,5,W,[a,b],null)),Aj,"dodgerblue",Ik,"none"],null)],null)],null)}return null}()],null)],null)],null)};sa=function(){function b(b){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Hc(e,0)}return a.call(this,d)}function a(a){return console.log.apply(console,Ea.c?Ea.c(a):Ea.call(null,a))}b.A=0;b.K=function(b){b=F(b);return a(b)};b.h=a;return b}();
ta=function(){function b(b){var d=null;if(0<arguments.length){for(var d=0,e=Array(arguments.length-0);d<e.length;)e[d]=arguments[d+0],++d;d=new Hc(e,0)}return a.call(this,d)}function a(a){return console.error.apply(console,Ea.c?Ea.c(a):Ea.call(null,a))}b.A=0;b.K=function(b){b=F(b);return a(b)};b.h=a;return b}();
if("undefined"===typeof Bx){var Bx,Cx=new U(null,2,5,W,[0,0],null),Dx=rd,Ex=new Date;Ex.setTime((new Date).getTime());Ex.setHours(0);Ex.setMinutes(0);Ex.setSeconds(0);Ex.setMilliseconds(0);var Fx=new l(null,4,[sj,-77,pk,Cx,Yl,Dx,uj,Ex],null);Bx=sf.c?sf.c(Fx):sf.call(null,Fx)}
if("undefined"===typeof Oi)var Oi=function(){var b=sf.c?sf.c(Q):sf.call(null,Q),a=sf.c?sf.c(Q):sf.call(null,Q),c=sf.c?sf.c(Q):sf.call(null,Q),d=sf.c?sf.c(Q):sf.call(null,Q),e=C.f(Q,Ln,Ai());return new Li(Fc.b("nav.core","emit"),function(){return function(){function a(b,c){if(1<arguments.length)for(var d=0,e=Array(arguments.length-1);d<e.length;)e[d]=arguments[d+1],++d;return b}a.A=1;a.K=function(a){var b=G(a);Ic(a);return b};a.h=function(a){return a};return a}()}(b,a,c,d,e),qk,e,b,a,c,d)}();
Ni(jm,function(b,a){return xf.w(Bx,ag,sj,a)});Ni(Hl,function(b,a){var c=R.b(re,Jo(a)),d=M(c,0),e=M(c,1),c=M(c,2);return xf.w(Bx,N,uj,new Date(d,e-1,c))});Ni(Wi,function(b,a){return xf.w(Bx,ag,Yl,function(b){return new U(null,2,5,W,[pd(b),a],null)})});Ni(Xm,function(b,a,c){return xf.w(Bx,N,al,new U(null,2,5,W,[a,c],null))});
Ni(oj,function(b,a,c){b=(I.c?I.c(Bx):I.call(null,Bx)).call(null,al);if(p(b)){var d=Wf.f(ee,new U(null,2,5,W,[a,c],null),b);return xf.b(Bx,function(b,d,h){return function(k){return ag.f(N.f(k,al,new U(null,2,5,W,[a,c],null)),pk,function(a){return function(b){return Wf.f(de,b,a)}}(b,d,h))}}(d,b,b))}return null});Ni(Zm,function(){return xf.f(Bx,O,al)});
if("undefined"===typeof Gx)var Gx=function(b){return function(){var a;a=Oi;var c=I.c?I.c(Bx):I.call(null,Bx);a=new U(null,4,5,W,[Kn,Q,yx(a,c),Ax(a,c)],null);return b.c?b.c(a):b.call(null,a)}}(Gr());if("undefined"===typeof Hx){var Hx,Ix=Bx;Ub(Ix,sn,function(b,a,c,d){return Gx.c?Gx.c(d):Gx.call(null,d)});Hx=Ix}var Jx=I.c?I.c(Bx):I.call(null,Bx);Gx.c?Gx.c(Jx):Gx.call(null,Jx);


/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-indexof/index.js", Function("exports, require, module",
"\nvar indexOf = [].indexOf;\n\nmodule.exports = function(arr, obj){\n  if (indexOf) return arr.indexOf(obj);\n  for (var i = 0; i < arr.length; ++i) {\n    if (arr[i] === obj) return i;\n  }\n  return -1;\n};//@ sourceURL=component-indexof/index.js"
));
require.register("component-classes/index.js", Function("exports, require, module",
"\n/**\n * Module dependencies.\n */\n\nvar index = require('indexof');\n\n/**\n * Whitespace regexp.\n */\n\nvar re = /\\s+/;\n\n/**\n * Wrap `el` in a `ClassList`.\n *\n * @param {Element} el\n * @return {ClassList}\n * @api public\n */\n\nmodule.exports = function(el){\n  return new ClassList(el);\n};\n\n/**\n * Initialize a new ClassList for `el`.\n *\n * @param {Element} el\n * @api private\n */\n\nfunction ClassList(el) {\n  this.el = el;\n  this.list = el.classList;\n}\n\n/**\n * Add class `name` if not already present.\n *\n * @param {String} name\n * @return {ClassList}\n * @api public\n */\n\nClassList.prototype.add = function(name){\n  // classList\n  if (this.list) {\n    this.list.add(name);\n    return this;\n  }\n\n  // fallback\n  var arr = this.array();\n  var i = index(arr, name);\n  if (!~i) arr.push(name);\n  this.el.className = arr.join(' ');\n  return this;\n};\n\n/**\n * Remove class `name` when present.\n *\n * @param {String} name\n * @return {ClassList}\n * @api public\n */\n\nClassList.prototype.remove = function(name){\n  // classList\n  if (this.list) {\n    this.list.remove(name);\n    return this;\n  }\n\n  // fallback\n  var arr = this.array();\n  var i = index(arr, name);\n  if (~i) arr.splice(i, 1);\n  this.el.className = arr.join(' ');\n  return this;\n};\n\n/**\n * Toggle class `name`.\n *\n * @param {String} name\n * @return {ClassList}\n * @api public\n */\n\nClassList.prototype.toggle = function(name){\n  // classList\n  if (this.list) {\n    this.list.toggle(name);\n    return this;\n  }\n\n  // fallback\n  if (this.has(name)) {\n    this.remove(name);\n  } else {\n    this.add(name);\n  }\n  return this;\n};\n\n/**\n * Return an array of classes.\n *\n * @return {Array}\n * @api public\n */\n\nClassList.prototype.array = function(){\n  var arr = this.el.className.split(re);\n  if ('' === arr[0]) arr.pop();\n  return arr;\n};\n\n/**\n * Check if class `name` is present.\n *\n * @param {String} name\n * @return {ClassList}\n * @api public\n */\n\nClassList.prototype.has =\nClassList.prototype.contains = function(name){\n  return this.list\n    ? this.list.contains(name)\n    : !! ~index(this.array(), name);\n};\n//@ sourceURL=component-classes/index.js"
));
require.register("infinite-carousel/index.js", Function("exports, require, module",
"\n/**\n * infinite-carousel\n *\n * fork of: tomerdmnt/carousel\n *\n * licence MIT\n */\n\nvar classes = require('classes');\n\nmodule.exports = Carousel;\n\nfunction isCarouselItem(elem) {\n  return elem && elem.nodeName === 'LI';\n}\n\nfunction nextSibling(item) {\n  do {\n    item = item.nextSibling;\n  } while (item && !isCarouselItem(item));\n\n  return item;\n}\n\nfunction prevSibling(item) {\n  do {\n    item = item.previousSibling;\n  } while (item && !isCarouselItem(item))\n\n  return item;\n}\n\nfunction Carousel(el, opts) {\n  if (!(this instanceof Carousel)) return new Carousel(el, opts);\n  opts = opts || {};\n  this.el = el;\n  classes(el).add('carousel');\n\n  var first = this.first()\n  this.rearrange(first);\n  this.show(first);\n}\n\nCarousel.prototype.list = function () {\n  return this.el.querySelector('ul');\n}\n\nCarousel.prototype.first = function () {\n  return this.el.querySelector('li');\n}\n\nCarousel.prototype.last = function () {\n  var arr = this.el.querySelectorAll('li');\n  return arr[arr.length-1];\n}\n\nCarousel.prototype.active = function () {\n  return this.el.querySelector('li.carousel-active');\n}\n\nCarousel.prototype.forEach = function (cb) {\n  var item = this.first()\n  while (item) {\n    cb(item);\n    item = nextSibling(item);\n  }\n}\n\nCarousel.prototype.next = function () {\n  var current = this.active();\n  var next = nextSibling(current);\n\n  this.show(next);\n\n  return next;\n}\n\nCarousel.prototype.prev = function () {\n  var current = this.active();\n  var prev = prevSibling(current);\n\n  this.show(prev);\n\n  return prev;\n}\n\nCarousel.prototype.getSiblings = function (item) {\n  var next = nextSibling(item);\n  var prev = prevSibling(item);\n  if (!next) {\n    next = this.first();\n  }\n  if (!prev) {\n    prev = this.last();\n  }\n  return { next: next, prev: prev };  \n}\n\nCarousel.prototype.rearrange = function (item) {\n  if (!nextSibling(item)) {\n    this.list().insertBefore(item, this.first());\n    this.list().insertBefore(this.last(), this.first());\n  }\n  if (!prevSibling(item)) {\n    this.list().appendChild(item);\n    this.list().appendChild(this.first());\n  }\n}\n\nCarousel.prototype.show = function (item) {\n  if (!item) return;\n\n  var sib = this.getSiblings(item);\n\n  this.forEach(function (ci) {\n    classes(ci)\n      .remove('carousel-next')\n      .remove('carousel-prev')\n      .remove('carousel-active');\n  });\n\n  classes(sib.next).add('carousel-next');\n  classes(sib.prev).add('carousel-prev');\n  classes(item).add('carousel-active');\n\n  setTimeout(function (self) {\n    self.rearrange(item)\n  }, 600, this)\n}\n//@ sourceURL=infinite-carousel/index.js"
));
require.alias("component-classes/index.js", "infinite-carousel/deps/classes/index.js");
require.alias("component-indexof/index.js", "component-classes/deps/indexof/index.js");


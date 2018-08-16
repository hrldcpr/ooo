// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"tC5m":[function(require,module,exports) {
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });

var default_1 = function default_1(start, g, tail, tailAngle) {
    var _this = this;

    _classCallCheck(this, default_1);

    this.add = function (point) {
        _this.points.push(point);
    };
    this.pop = function () {
        _this.points.pop();
    };
    this.angle = function () {
        if (_this.points.length < 2) return;

        var _points$slice = _this.points.slice(-2),
            _points$slice2 = _slicedToArray(_points$slice, 2),
            a = _points$slice2[0],
            b = _points$slice2[1];

        return Math.atan2(b.y - a.y, b.x - a.x);
    };
    this.distance = function (point) {
        return Math.min.apply(Math, _toConsumableArray(_this.points.map(function (_ref) {
            var x = _ref.x,
                y = _ref.y;
            return Math.hypot(point.x - x, point.y - y);
        })));
    };
    this.size = function () {
        return _this.points.length;
    };
    this.tailDistance = function (point) {
        var _points = _this.points[_this.points.length - 1],
            x = _points.x,
            y = _points.y;

        return Math.hypot(point.x - x, point.y - y);
    };
    this.g = g;
    this.tail = tail;
    this.tailAngle = tailAngle;
    this.points = [start];
};

exports.default = default_1;
},{}],"caD7":[function(require,module,exports) {

},{}],"7QCb":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Trail_1 = __importDefault(require("./Trail"));
require("sanitize.css");
require("./index.scss");
var G_DISTANCE = 50;
var O_DISTANCE = 40;
var GLE_LENGTH = 74;
var EDGE_DISTANCE = 40;
var START_DISTANCE = 80;
var FADE_DELAY = 10 * 1000; // ms
var createSvgElement = function createSvgElement(tag, attributes) {
    var e = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attributes) {
        e.setAttribute(k, attributes[k]);
    }
    return e;
};
var createG = function createG(_ref, angle) {
    var x = _ref.x,
        y = _ref.y;
    return createSvgElement('path', {
        transform: "translate(" + x + ", " + y + ") rotate(" + angle * 180 / Math.PI + ") translate(-29, -37)",
        fill: '#4285F4',
        d: 'M29.95,59.05C13.68,59.05,0,45.8,0,29.52S13.68,0,29.95,0c9,0,15.41,3.53,20.23,8.14l-5.69,5.69c-3.46-3.24-8.14-5.76-14.55-5.76c-11.88,0-21.17,9.58-21.17,21.46c0,11.88,9.29,21.46,21.17,21.46c7.71,0,12.1-3.1,14.91-5.9c2.3-2.3,3.82-5.65,4.39-10.18h-19.3v-8H57.1c0.29,1.44,0.43,3.13,0.43,5.01c0,6.05-1.66,13.54-6.99,18.87C45.36,56.17,38.74,59.05,29.95,59.05z'
    });
};
var createO = function createO(_ref2, parity) {
    var x = _ref2.x,
        y = _ref2.y;

    var o = createSvgElement('path', {
        transform: "translate(" + x + ", " + y + ") translate(-120, -38)",
        fill: parity ? '#E94235' : '#FABB05',
        d: 'M139.49,40.04c0,10.94-8.51,19.01-18.95,19.01c-10.44,0-18.95-8.07-18.95-19.01c0-11.02,8.51-19.01,18.95-19.01C130.98,21.03,139.49,29.02,139.49,40.04z M131.19,40.04c0-6.84-4.93-11.52-10.66-11.52c-5.72,0-10.65,4.68-10.65,11.52c0,6.77,4.93,11.52,10.65,11.52C126.26,51.56,131.19,46.8,131.19,40.04z'
    });
    o.classList.add('o');
    return o;
};
var createGle = function createGle(point, angle) {
    var g = createSvgElement('g');
    g.classList.add('gle');
    g.appendChild(createSvgElement('path', {
        fill: '#4285F4',
        d: 'M178.54,22.18v33.81c0,14.04-8.28,19.8-18.07,19.8c-9.22,0-14.76-6.19-16.85-11.23l7.27-3.02c1.3,3.1,4.46,6.77,9.58,6.77c6.26,0,10.15-3.89,10.15-11.16v-2.42h-0.29c-1.87,2.3-5.47,4.32-10.01,4.32c-9.5,0-17.78-8.28-17.78-18.94c0-10.73,8.28-19.08,17.78-19.08c4.54,0,8.14,2.02,10.01,4.25h0.29v-3.1H178.54z M171.19,40.11c0-6.7-4.42-11.59-10.06-11.59c-5.71,0-10.25,4.9-10.25,11.59c0,6.62,4.54,11.45,10.25,11.45C166.77,51.56,171.19,46.73,171.19,40.11z'
    }));
    g.appendChild(createSvgElement('path', {
        fill: '#34A853',
        d: 'M192.31,2.02v55.88h-8.35V2.02H192.31z'
    }));
    g.appendChild(createSvgElement('path', {
        fill: '#E94235',
        d: 'M224.07,46.3l6.48,4.32c-2.09,3.1-7.13,8.42-15.84,8.42c-10.8,0-18.87-8.35-18.87-19.01c0-11.31,8.14-19.01,17.93-19.01c9.86,0,14.69,7.85,16.27,12.1l0.86,2.16L205.49,45.8c1.94,3.82,4.97,5.76,9.22,5.76S221.91,49.47,224.07,46.3z M204.12,39.46l16.99-7.06c-0.94-2.38-3.75-4.03-7.06-4.03C209.81,28.37,203.9,32.12,204.12,39.46z'
    }));
    moveGle(g, point, angle);
    return g;
};
var moveGle = function moveGle(gle, _ref3, angle) {
    var x = _ref3.x,
        y = _ref3.y;

    gle.style.transform = "translate(" + x + "px, " + y + "px) rotate(" + angle + "rad) translate(-120px, -40px)";
};
var svg = document.getElementById('floor');
var trails = [];
var enabled = false;
var closestEdge = function closestEdge(_ref4) {
    var x = _ref4.x,
        y = _ref4.y;

    var right = svg.clientWidth - x;
    var bottom = svg.clientHeight - y;
    var distance = Math.min(x, y, right, bottom);
    var angle = distance === x ? 0 : distance === y ? Math.PI / 2 : distance === right ? Math.PI : -Math.PI / 2;
    return { angle: angle, distance: distance };
};
var closestAngle = function closestAngle(_ref5) {
    var angle = _ref5.angle,
        oldAngle = _ref5.oldAngle;

    if (angle < oldAngle) {
        while (oldAngle - angle > Math.PI) {
            angle += 2 * Math.PI;
        }
    } else {
        while (angle - oldAngle > Math.PI) {
            angle -= 2 * Math.PI;
        }
    }
    return angle;
};
svg.addEventListener('mousemove', function (_ref6) {
    var x = _ref6.offsetX,
        y = _ref6.offsetY;

    if (!enabled) return;
    var point = { x: x, y: y };
    if (trails.length === 0) {
        if (x < EDGE_DISTANCE || svg.clientWidth - x < EDGE_DISTANCE || y < EDGE_DISTANCE || svg.clientHeight - y < EDGE_DISTANCE) {
            return;
        }
        document.getElementById('note').classList.add('fading');
        var edge = closestEdge(point);
        var g = createG(point, edge.angle);
        var gle = createGle(point, edge.angle);
        var container = createSvgElement('g');
        container.appendChild(g);
        container.appendChild(gle);
        svg.appendChild(container);
        trails.push(new Trail_1.default(point, container, gle, edge.angle));
    }
    var trail = trails[trails.length - 1];
    var distance = trail.tailDistance(point);
    var minDistance = trail.size() === 1 ? G_DISTANCE : O_DISTANCE;
    if (distance < minDistance) return;
    trail.add(point);
    trail.tailAngle = closestAngle({
        angle: trail.angle(),
        oldAngle: trail.tailAngle
    });
    var tailPoint = {
        x: point.x + GLE_LENGTH * Math.cos(trail.tailAngle),
        y: point.y + GLE_LENGTH * Math.sin(trail.tailAngle)
    };
    if (tailPoint.x < EDGE_DISTANCE || svg.clientWidth - tailPoint.x < EDGE_DISTANCE || tailPoint.y < EDGE_DISTANCE || svg.clientHeight - tailPoint.y < EDGE_DISTANCE) {
        trail.pop();
        return;
    }
    trail.g.appendChild(createO(point, trail.size() % 2 === 0));
    moveGle(trail.tail, point, trail.tailAngle);
});
svg.addEventListener('mouseleave', function () {
    enabled = true;
    var trail = trails.pop();
    if (!trail) return;
    trail.g.classList.add('fading');
    setTimeout(function () {
        svg.removeChild(trail.g);
    }, FADE_DELAY);
});
},{"./Trail":"tC5m","sanitize.css":"caD7","./index.scss":"caD7"}]},{},["7QCb"], null)
//# sourceMappingURL=src.620a7cd9.map
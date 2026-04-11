var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.createTemplateTagFirstArg = function(a) {
  return a.raw = a;
};
$jscomp.createTemplateTagFirstArgWithRaw = function(a, b) {
  a.raw = b;
  return a;
};
$jscomp.owns = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.ISOLATE_POLYFILLS = !1;
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  if (a == Array.prototype || a == Object.prototype) {
    return a;
  }
  a[b] = c.value;
  return a;
};
$jscomp.getGlobal = function(a) {
  a = ["object" == typeof globalThis && globalThis, a, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global,];
  for (var b = 0; b < a.length; ++b) {
    var c = a[b];
    if (c && c.Math == Math) {
      return c;
    }
  }
  throw Error("Cannot find global object");
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
$jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
$jscomp.polyfills = {};
$jscomp.propertyToPolyfillSymbol = {};
$jscomp.POLYFILL_PREFIX = "$jscp$";
var $jscomp$lookupPolyfilledValue = function(a, b, c) {
  if (!c || null != a) {
    c = $jscomp.propertyToPolyfillSymbol[b];
    if (null == c) {
      return a[b];
    }
    c = a[c];
    return void 0 !== c ? c : a[b];
  }
};
$jscomp.polyfill = function(a, b, c, d) {
  b && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(a, b, c, d) : $jscomp.polyfillUnisolated(a, b, c, d));
};
$jscomp.polyfillUnisolated = function(a, b, c, d) {
  c = $jscomp.global;
  a = a.split(".");
  for (d = 0; d < a.length - 1; d++) {
    var e = a[d];
    if (!(e in c)) {
      return;
    }
    c = c[e];
  }
  a = a[a.length - 1];
  d = c[a];
  b = b(d);
  b != d && null != b && $jscomp.defineProperty(c, a, {configurable:!0, writable:!0, value:b});
};
$jscomp.polyfillIsolated = function(a, b, c, d) {
  var e = a.split(".");
  a = 1 === e.length;
  d = e[0];
  d = !a && d in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
  for (var f = 0; f < e.length - 1; f++) {
    var g = e[f];
    if (!(g in d)) {
      return;
    }
    d = d[g];
  }
  e = e[e.length - 1];
  c = $jscomp.IS_SYMBOL_NATIVE && "es6" === c ? d[e] : null;
  b = b(c);
  null != b && (a ? $jscomp.defineProperty($jscomp.polyfills, e, {configurable:!0, writable:!0, value:b}) : b !== c && (void 0 === $jscomp.propertyToPolyfillSymbol[e] && (c = 1E9 * Math.random() >>> 0, $jscomp.propertyToPolyfillSymbol[e] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(e) : $jscomp.POLYFILL_PREFIX + c + "$" + e), $jscomp.defineProperty(d, $jscomp.propertyToPolyfillSymbol[e], {configurable:!0, writable:!0, value:b})));
};
$jscomp.assign = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign ? Object.assign : function(a, b) {
  for (var c = 1; c < arguments.length; c++) {
    var d = arguments[c];
    if (d) {
      for (var e in d) {
        $jscomp.owns(d, e) && (a[e] = d[e]);
      }
    }
  }
  return a;
};
$jscomp.polyfill("Object.assign", function(a) {
  return a || $jscomp.assign;
}, "es6", "es3");
$jscomp.checkStringArgs = function(a, b, c) {
  if (null == a) {
    throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
  }
  if (b instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
  }
  return a + "";
};
$jscomp.polyfill("String.prototype.startsWith", function(a) {
  return a ? a : function(b, c) {
    var d = $jscomp.checkStringArgs(this, b, "startsWith");
    b += "";
    var e = d.length, f = b.length;
    c = Math.max(0, Math.min(c | 0, d.length));
    for (var g = 0; g < f && c < e;) {
      if (d[c++] != b[g++]) {
        return !1;
      }
    }
    return g >= f;
  };
}, "es6", "es3");
$jscomp.polyfill("Object.is", function(a) {
  return a ? a : function(b, c) {
    return b === c ? 0 !== b || 1 / b === 1 / c : b !== b && c !== c;
  };
}, "es6", "es3");
$jscomp.polyfill("Array.prototype.includes", function(a) {
  return a ? a : function(b, c) {
    var d = this;
    d instanceof String && (d = String(d));
    var e = d.length;
    c = c || 0;
    for (0 > c && (c = Math.max(c + e, 0)); c < e; c++) {
      var f = d[c];
      if (f === b || Object.is(f, b)) {
        return !0;
      }
    }
    return !1;
  };
}, "es7", "es3");
$jscomp.polyfill("String.prototype.includes", function(a) {
  return a ? a : function(b, c) {
    return -1 !== $jscomp.checkStringArgs(this, b, "includes").indexOf(b, c || 0);
  };
}, "es6", "es3");
$jscomp.arrayIteratorImpl = function(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++],} : {done:!0};
  };
};
$jscomp.arrayIterator = function(a) {
  return {next:$jscomp.arrayIteratorImpl(a)};
};
$jscomp.initSymbol = function() {
};
$jscomp.polyfill("Symbol", function(a) {
  if (a) {
    return a;
  }
  var b = function(f, g) {
    this.$jscomp$symbol$id_ = f;
    $jscomp.defineProperty(this, "description", {configurable:!0, writable:!0, value:g});
  };
  b.prototype.toString = function() {
    return this.$jscomp$symbol$id_;
  };
  var c = "jscomp_symbol_" + (1E9 * Math.random() >>> 0) + "_", d = 0, e = function(f) {
    if (this instanceof e) {
      throw new TypeError("Symbol is not a constructor");
    }
    return new b(c + (f || "") + "_" + d++, f);
  };
  return e;
}, "es6", "es3");
$jscomp.polyfill("Symbol.iterator", function(a) {
  if (a) {
    return a;
  }
  a = Symbol("Symbol.iterator");
  for (var b = "Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array".split(" "), c = 0; c < b.length; c++) {
    var d = $jscomp.global[b[c]];
    "function" === typeof d && "function" != typeof d.prototype[a] && $jscomp.defineProperty(d.prototype, a, {configurable:!0, writable:!0, value:function() {
      return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
    }});
  }
  return a;
}, "es6", "es3");
$jscomp.iteratorPrototype = function(a) {
  a = {next:a};
  a[Symbol.iterator] = function() {
    return this;
  };
  return a;
};
$jscomp.iteratorFromArray = function(a, b) {
  a instanceof String && (a += "");
  var c = 0, d = !1, e = {next:function() {
    if (!d && c < a.length) {
      var f = c++;
      return {value:b(f, a[f]), done:!1};
    }
    d = !0;
    return {done:!0, value:void 0};
  }};
  e[Symbol.iterator] = function() {
    return e;
  };
  return e;
};
$jscomp.polyfill("Array.prototype.keys", function(a) {
  return a ? a : function() {
    return $jscomp.iteratorFromArray(this, function(b) {
      return b;
    });
  };
}, "es6", "es3");
$jscomp.polyfill("String.prototype.repeat", function(a) {
  return a ? a : function(b) {
    var c = $jscomp.checkStringArgs(this, null, "repeat");
    if (0 > b || 1342177279 < b) {
      throw new RangeError("Invalid count value");
    }
    b |= 0;
    for (var d = ""; b;) {
      if (b & 1 && (d += c), b >>>= 1) {
        c += c;
      }
    }
    return d;
  };
}, "es6", "es3");
$jscomp.polyfill("Math.clz32", function(a) {
  return a ? a : function(b) {
    b = Number(b) >>> 0;
    if (0 === b) {
      return 32;
    }
    var c = 0;
    0 === (b & 4294901760) && (b <<= 16, c += 16);
    0 === (b & 4278190080) && (b <<= 8, c += 8);
    0 === (b & 4026531840) && (b <<= 4, c += 4);
    0 === (b & 3221225472) && (b <<= 2, c += 2);
    0 === (b & 2147483648) && c++;
    return c;
  };
}, "es6", "es3");
$jscomp.polyfill("Array.prototype.entries", function(a) {
  return a ? a : function() {
    return $jscomp.iteratorFromArray(this, function(b, c) {
      return [b, c];
    });
  };
}, "es6", "es3");
$jscomp.makeIterator = function(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  if (b) {
    return b.call(a);
  }
  if ("number" == typeof a.length) {
    return $jscomp.arrayIterator(a);
  }
  throw Error(String(a) + " is not an iterable or ArrayLike");
};
$jscomp.polyfill("Promise", function(a) {
  function b() {
    this.batch_ = null;
  }
  function c(g) {
    return g instanceof e ? g : new e(function(h, l) {
      h(g);
    });
  }
  if (a && (!($jscomp.FORCE_POLYFILL_PROMISE || $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION && "undefined" === typeof $jscomp.global.PromiseRejectionEvent) || !$jscomp.global.Promise || -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))) {
    return a;
  }
  b.prototype.asyncExecute = function(g) {
    if (null == this.batch_) {
      this.batch_ = [];
      var h = this;
      this.asyncExecuteFunction(function() {
        h.executeBatch_();
      });
    }
    this.batch_.push(g);
  };
  var d = $jscomp.global.setTimeout;
  b.prototype.asyncExecuteFunction = function(g) {
    d(g, 0);
  };
  b.prototype.executeBatch_ = function() {
    for (; this.batch_ && this.batch_.length;) {
      var g = this.batch_;
      this.batch_ = [];
      for (var h = 0; h < g.length; ++h) {
        var l = g[h];
        g[h] = null;
        try {
          l();
        } catch (k) {
          this.asyncThrow_(k);
        }
      }
    }
    this.batch_ = null;
  };
  b.prototype.asyncThrow_ = function(g) {
    this.asyncExecuteFunction(function() {
      throw g;
    });
  };
  var e = function(g) {
    this.state_ = 0;
    this.result_ = void 0;
    this.onSettledCallbacks_ = [];
    this.isRejectionHandled_ = !1;
    var h = this.createResolveAndReject_();
    try {
      g(h.resolve, h.reject);
    } catch (l) {
      h.reject(l);
    }
  };
  e.prototype.createResolveAndReject_ = function() {
    function g(k) {
      return function(m) {
        l || (l = !0, k.call(h, m));
      };
    }
    var h = this, l = !1;
    return {resolve:g(this.resolveTo_), reject:g(this.reject_)};
  };
  e.prototype.resolveTo_ = function(g) {
    if (g === this) {
      this.reject_(new TypeError("A Promise cannot resolve to itself"));
    } else if (g instanceof e) {
      this.settleSameAsPromise_(g);
    } else {
      a: {
        switch(typeof g) {
          case "object":
            var h = null != g;
            break a;
          case "function":
            h = !0;
            break a;
          default:
            h = !1;
        }
      }
      h ? this.resolveToNonPromiseObj_(g) : this.fulfill_(g);
    }
  };
  e.prototype.resolveToNonPromiseObj_ = function(g) {
    var h = void 0;
    try {
      h = g.then;
    } catch (l) {
      this.reject_(l);
      return;
    }
    "function" == typeof h ? this.settleSameAsThenable_(h, g) : this.fulfill_(g);
  };
  e.prototype.reject_ = function(g) {
    this.settle_(2, g);
  };
  e.prototype.fulfill_ = function(g) {
    this.settle_(1, g);
  };
  e.prototype.settle_ = function(g, h) {
    if (0 != this.state_) {
      throw Error("Cannot settle(" + g + ", " + h + "): Promise already settled in state" + this.state_);
    }
    this.state_ = g;
    this.result_ = h;
    2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
    this.executeOnSettledCallbacks_();
  };
  e.prototype.scheduleUnhandledRejectionCheck_ = function() {
    var g = this;
    d(function() {
      if (g.notifyUnhandledRejection_()) {
        var h = $jscomp.global.console;
        "undefined" !== typeof h && h.error(g.result_);
      }
    }, 1);
  };
  e.prototype.notifyUnhandledRejection_ = function() {
    if (this.isRejectionHandled_) {
      return !1;
    }
    var g = $jscomp.global.CustomEvent, h = $jscomp.global.Event, l = $jscomp.global.dispatchEvent;
    if ("undefined" === typeof l) {
      return !0;
    }
    "function" === typeof g ? g = new g("unhandledrejection", {cancelable:!0}) : "function" === typeof h ? g = new h("unhandledrejection", {cancelable:!0}) : (g = $jscomp.global.document.createEvent("CustomEvent"), g.initCustomEvent("unhandledrejection", !1, !0, g));
    g.promise = this;
    g.reason = this.result_;
    return l(g);
  };
  e.prototype.executeOnSettledCallbacks_ = function() {
    if (null != this.onSettledCallbacks_) {
      for (var g = 0; g < this.onSettledCallbacks_.length; ++g) {
        f.asyncExecute(this.onSettledCallbacks_[g]);
      }
      this.onSettledCallbacks_ = null;
    }
  };
  var f = new b();
  e.prototype.settleSameAsPromise_ = function(g) {
    var h = this.createResolveAndReject_();
    g.callWhenSettled_(h.resolve, h.reject);
  };
  e.prototype.settleSameAsThenable_ = function(g, h) {
    var l = this.createResolveAndReject_();
    try {
      g.call(h, l.resolve, l.reject);
    } catch (k) {
      l.reject(k);
    }
  };
  e.prototype.then = function(g, h) {
    function l(p, q) {
      return "function" == typeof p ? function(r) {
        try {
          k(p(r));
        } catch (t) {
          m(t);
        }
      } : q;
    }
    var k, m, n = new e(function(p, q) {
      k = p;
      m = q;
    });
    this.callWhenSettled_(l(g, k), l(h, m));
    return n;
  };
  e.prototype.catch = function(g) {
    return this.then(void 0, g);
  };
  e.prototype.callWhenSettled_ = function(g, h) {
    function l() {
      switch(k.state_) {
        case 1:
          g(k.result_);
          break;
        case 2:
          h(k.result_);
          break;
        default:
          throw Error("Unexpected state: " + k.state_);
      }
    }
    var k = this;
    null == this.onSettledCallbacks_ ? f.asyncExecute(l) : this.onSettledCallbacks_.push(l);
    this.isRejectionHandled_ = !0;
  };
  e.resolve = c;
  e.reject = function(g) {
    return new e(function(h, l) {
      l(g);
    });
  };
  e.race = function(g) {
    return new e(function(h, l) {
      for (var k = $jscomp.makeIterator(g), m = k.next(); !m.done; m = k.next()) {
        c(m.value).callWhenSettled_(h, l);
      }
    });
  };
  e.all = function(g) {
    var h = $jscomp.makeIterator(g), l = h.next();
    return l.done ? c([]) : new e(function(k, m) {
      function n(r) {
        return function(t) {
          p[r] = t;
          q--;
          0 == q && k(p);
        };
      }
      var p = [], q = 0;
      do {
        p.push(void 0), q++, c(l.value).callWhenSettled_(n(p.length - 1), m), l = h.next();
      } while (!l.done);
    });
  };
  return e;
}, "es6", "es3");
$jscomp.polyfill("Promise.prototype.finally", function(a) {
  return a ? a : function(b) {
    return this.then(function(c) {
      return Promise.resolve(b()).then(function() {
        return c;
      });
    }, function(c) {
      return Promise.resolve(b()).then(function() {
        throw c;
      });
    });
  };
}, "es9", "es3");
var Module = "undefined" != typeof Module ? Module : {}, Promise = function() {
  function a() {
  }
  function b(k, m) {
    return function() {
      k.apply(m, arguments);
    };
  }
  function c(k) {
    if (!(this instanceof c)) {
      throw new TypeError("Promises must be constructed via new");
    }
    if ("function" != typeof k) {
      throw new TypeError("not a function");
    }
    this._state = 0;
    this._handled = !1;
    this._value = void 0;
    this._deferreds = [];
    l(k, this);
  }
  function d(k, m) {
    for (; 3 === k._state;) {
      k = k._value;
    }
    0 === k._state ? k._deferreds.push(m) : (k._handled = !0, c._immediateFn(function() {
      var n = 1 === k._state ? m.onFulfilled : m.onRejected;
      if (null === n) {
        (1 === k._state ? e : f)(m.promise, k._value);
      } else {
        try {
          var p = n(k._value);
        } catch (q) {
          f(m.promise, q);
          return;
        }
        e(m.promise, p);
      }
    }));
  }
  function e(k, m) {
    try {
      if (m === k) {
        throw new TypeError("A promise cannot be resolved with itself.");
      }
      if (m && ("object" == typeof m || "function" == typeof m)) {
        var n = m.then;
        if (m instanceof c) {
          k._state = 3;
          k._value = m;
          g(k);
          return;
        }
        if ("function" == typeof n) {
          l(b(n, m), k);
          return;
        }
      }
      k._state = 1;
      k._value = m;
      g(k);
    } catch (p) {
      f(k, p);
    }
  }
  function f(k, m) {
    k._state = 2;
    k._value = m;
    g(k);
  }
  function g(k) {
    2 === k._state && 0 === k._deferreds.length && c._immediateFn(function() {
      k._handled || c._unhandledRejectionFn(k._value);
    });
    for (var m = 0, n = k._deferreds.length; m < n; m++) {
      d(k, k._deferreds[m]);
    }
    k._deferreds = null;
  }
  function h(k, m, n) {
    this.onFulfilled = "function" == typeof k ? k : null;
    this.onRejected = "function" == typeof m ? m : null;
    this.promise = n;
  }
  function l(k, m) {
    var n = !1;
    try {
      k(function(p) {
        n || (n = !0, e(m, p));
      }, function(p) {
        n || (n = !0, f(m, p));
      });
    } catch (p) {
      n || (n = !0, f(m, p));
    }
  }
  c.prototype["catch"] = function(k) {
    return this.then(null, k);
  };
  c.prototype.then = function(k, m) {
    var n = new this.constructor(a);
    d(this, new h(k, m, n));
    return n;
  };
  c.all = function(k) {
    return new c(function(m, n) {
      function p(w, v) {
        try {
          if (v && ("object" == typeof v || "function" == typeof v)) {
            var x = v.then;
            if ("function" == typeof x) {
              x.call(v, function(y) {
                p(w, y);
              }, n);
              return;
            }
          }
          q[w] = v;
          0 === --r && m(q);
        } catch (y) {
          n(y);
        }
      }
      if (!Array.isArray(k)) {
        return n(new TypeError("Promise.all accepts an array"));
      }
      var q = Array.prototype.slice.call(k);
      if (0 === q.length) {
        return m([]);
      }
      for (var r = q.length, t = 0; t < q.length; t++) {
        p(t, q[t]);
      }
    });
  };
  c.resolve = function(k) {
    return k && "object" == typeof k && k.constructor == c ? k : new c(function(m) {
      m(k);
    });
  };
  c.reject = function(k) {
    return new c(function(m, n) {
      n(k);
    });
  };
  c.race = function(k) {
    return new c(function(m, n) {
      if (!Array.isArray(k)) {
        return n(new TypeError("Promise.race accepts an array"));
      }
      for (var p = 0, q = k.length; p < q; p++) {
        c.resolve(k[p]).then(m, n);
      }
    });
  };
  c._immediateFn = "function" == typeof setImmediate && function(k) {
    setImmediate(k);
  } || function(k) {
    setTimeout(k, 0);
  };
  c._unhandledRejectionFn = function(k) {
    "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", k);
  };
  return c;
}();
"undefined" == typeof Object.assign && (Object.assign = function(a, b) {
  for (var c = 1; c < arguments.length; c++) {
    if (b = arguments[c]) {
      for (var d in b) {
        b.hasOwnProperty(d) && (a[d] = b[d]);
      }
    }
  }
  return a;
});
var moduleOverrides = Object.assign({}, Module), arguments_ = [], thisProgram = "./this.program", quit_ = function(a, b) {
  throw b;
}, ENVIRONMENT_IS_WEB = !0, ENVIRONMENT_IS_WORKER = !1, scriptDirectory = "";
function locateFile(a) {
  return Module.locateFile ? Module.locateFile(a, scriptDirectory) : scriptDirectory + a;
}
var read_, readAsync, readBinary;
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  ENVIRONMENT_IS_WORKER ? scriptDirectory = self.location.href : "undefined" != typeof document && document.currentScript && (scriptDirectory = document.currentScript.src), scriptDirectory = 0 !== scriptDirectory.indexOf("blob:") ? scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", read_ = function(a) {
    var b = new XMLHttpRequest();
    b.open("GET", a, !1);
    b.send(null);
    return b.responseText;
  }, ENVIRONMENT_IS_WORKER && (readBinary = function(a) {
    var b = new XMLHttpRequest();
    b.open("GET", a, !1);
    b.responseType = "arraybuffer";
    b.send(null);
    return new Uint8Array(b.response);
  }), readAsync = function(a, b, c) {
    var d = new XMLHttpRequest();
    d.open("GET", a, !0);
    d.responseType = "arraybuffer";
    d.onload = function() {
      200 == d.status || 0 == d.status && d.response ? b(d.response) : c();
    };
    d.onerror = c;
    d.send(null);
  };
}
var out = Module.print || console.log.bind(console), err = Module.printErr || console.error.bind(console);
Object.assign(Module, moduleOverrides);
moduleOverrides = null;
Module.arguments && (arguments_ = Module.arguments);
Module.thisProgram && (thisProgram = Module.thisProgram);
Module.quit && (quit_ = Module.quit);
var wasmBinary;
Module.wasmBinary && (wasmBinary = Module.wasmBinary);
var WebAssembly = {Memory:function(a) {
  this.buffer = new ArrayBuffer(65536 * a.initial);
}, Module:function(a) {
}, Instance:function(a, b) {
  this.exports = (
// EMSCRIPTEN_START_ASM
function instantiate(kd){function c(d){d.set=function(a,b){this[a]=b};d.get=function(a){return this[a]};return d}var e;var f=new Uint8Array(123);for(var a=25;a>=0;--a){f[48+a]=52+a;f[65+a]=a;f[97+a]=26+a}f[43]=62;f[47]=63;function l(m,n,o){var g,h,a=0,i=n,j=o.length,k=n+(j*3>>2)-(o[j-2]=="=")-(o[j-1]=="=");for(;a<j;a+=4){g=f[o.charCodeAt(a+1)];h=f[o.charCodeAt(a+2)];m[i++]=f[o.charCodeAt(a)]<<2|g>>4;if(i<k)m[i++]=g<<4|h>>2;if(i<k)m[i++]=h<<6|f[o.charCodeAt(a+3)]}}function p(q){l(e,1024,"sLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f/gCfq6zg4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+/z9AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh9/m5ydnqanqKmqra6v+foAgIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmaoKGio6SlAH0AU25vd3kARW50aXR5UHJvcGVydHkAbW91c2VzZW5zaXRpdml0eQBNb3VzZSBzZW5zaXRpdml0eQBmb2dEZW5zaXR5AEZ1bmN0aW9uYWxpdHkAaGFja3MtanVtcHZlbG9jaXR5AHNlbGVjdGVkLWJsb2NrLW91dGxpbmUtb3BhY2l0eQBmYW50YXN5AFdlJ3JlIHNvcnJ5AG5vc3RhbGdpYS1jbGFzc2ljaW52ZW50b3J5AENsYXNzaWMgaW52ZW50b3J5AEludmVudG9yeQBjcmVhdGluZyBkaXJlY3RvcnkAWzNdIFNldERlZmF1bHRDdXJyZW50RGlyZWN0b3J5AGFsbG9jYXRpbmcgdGVtcCBtZW1vcnkAT3V0IG9mIG1lbW9yeQBHZnhfQWxsb2NUZW1wTWVtb3J5AFN1bm55AFJhaW55ACZjTXVzaWMgaXMgbm90IHN1cHBvcnRlZCBjdXJyZW50bHkAJmMgIFNvbWUgYmxvY2tzIG1heSB0aGVyZWZvcmUgYXBwZWFyIGluY29ycmVjdGx5AEtleXBhZE11bHRpcGx5AC1mbHkAK2ZseQBGbHkAZW52aXJvbm1lbnQuc2t5AFNreQBodHRwcy12ZXJpZnkAUmVtb3ZlIGhvdGtleQBBZGQgaG90a2V5AFRleHRIb3RLZXkARmFuY3kAbGVnYWN5ACAgICZjQXR0ZW1wdGVkIHRvIGxvYWQgbWFwIHdpdGhvdXQgYSBCbG9ja3MgYXJyYXkAcmVzaXppbmcgYXJyYXkAaW5pdGluZyBhcnJheQBCbG9ja0FycmF5AEJsb2NrcyBmaWVsZCBtdXN0IGJlIEFycmF5AEdyYXkASUQgb3ZlcmxheQBJRE92ZXJsYXkATWVkaWFQbGF5AFNreWJveABMaW5lL0JveABFbW90ZUZpeABtYXgALW9waGF4ACtvcGhheAAtaGF4AFNub3cAWWVsbG93ACAgJmVBeGlzIGxpbmVzICgmNFgmZSwgJjJZJmUsICYxWiZlKSBub3cgc2hvdwAgICZlQXhpcyBsaW5lcyBubyBsb25nZXIgc2hvdwBTY2FsZSB3aXRoIHdpbmRvdwBlbnRpdHlzaGFkb3cARmllbGQgb2YgdmlldwBDb3VyaWVyIE5ldwBtYXBzLyVzLmN3AEJsb2NrRHJhdwBpbl91dgBoYWNrcy1mb3YAQnJvd3NlclByZXYATWVkaWFQcmV2AE1haW4gbWVudQBHYW1lIG1lbnUATWVudQBvcHRpb25zLWRlZmF1bHQudHh0AG9wdGlvbnMudHh0AGFuaW1hdGlvbnMudHh0AHRleHR1cmVjYWNoZS9hY2NlcHRlZHVybHMudHh0AHRleHR1cmVjYWNoZS9kZW5pZWR1cmxzLnR4dAB0ZXh0dXJlY2FjaGUvZXRhZ3MudHh0ACVzLnR4dAAlcyBfJWkudHh0AC9zZGNhcmQvQW5kcm9pZC9kYXRhL2NvbS52b3hlbGNyYWZ0LmFuZHJvaWQuY2xpZW50L2ZpbGVzL2xvZy50eHQAdGV4dHVyZWNhY2hlL2xhc3Rtb2RpZmllZC50eHQAUmVjcmVhdGluZyBncmFwaGljcyBjb250ZXh0AGluaXRpbmcgV2ViQXVkaW8gY29udGV4dABIb3RrZXkgdGV4dABCcm93c2VyTmV4dABNZWRpYU5leHQAQmxvY2tEZWZpbml0aW9uc0V4dABTaG93IGV4dCBpbnB1dABFeHRJbnB1dABXZWJHTCBjb250ZXh0IGxvc3QAR0xDb250ZXh0IGxvc3QAV2Vic2l0ZSBkZW5pZWQgZG93bmxvYWQgb3IgZG9lc24ndCBleGlzdAAgICZjVGhlIHRleHR1cmUgcGFjayBVUkwgbWF5IGJlIGluY29ycmVjdCBvciBubyBsb25nZXIgZXhpc3QAbm9zdGFsZ2lhLWNsYXNzaWN0YWJsaXN0AFRhYmxpc3QAQ2xhc3NpYyBwbGF5ZXIgbGlzdABQbGF5ZXIgbGlzdAB2aWV3ZGlzdABFeHRQbGF5ZXJMaXN0AFRvZ2dsZUJsb2NrTGlzdABsZWdhY3lmYXN0AG5vcm1hbGZhc3QARXh0RW50aXR5VGVsZXBvcnQARGlydABJbnNlcnQAU2NyZWVuc2hvdABmcm9udABndWktYXJpYWxjaGF0Zm9udABTZWxlY3Qgc3lzdGVtIGZvbnQAVXNlIHN5c3RlbSBmb250AG1ha2luZyBmb250AFNlbGVjdCBhIGZvbnQAU2V0U3Bhd25wb2ludAAmZUlmIG5vIGNvb3JkaW5hdGVzIGFyZSBwcm92aWRlZCwgY3VycmVudABJbnZhbGlkIGFyZ3VtZW50AEVudmlyb25tZW50AC9jbGllbnQAQW1iaWVudABnaWFudAAgQWx0AHNpdABbMV0gTG9nZ2VyIGluaXQAWzRdIFdpbmRvd19QcmVJbml0AFs1XSBXaW5kb3dfSW5pdABbMl0gUGxhdGZvcm1fSW5pdABmcHNsaW1pdAAmY0NoYXQgbG9nIGNsZWFyZWQgYXMgaXQgaGl0IDguMyBtaWxsaW9uIGNoYXJhY3RlciBsaW1pdAAmYSAgZnVsbGJyaWdodCAmZS0gU2V0cyB3aGV0aGVyIHRoZSBibG9jayBpcyBmdWxseSBsaXQAQmxvY2tFZGl0AGZ1bGxicmlnaHQARnVsbEJyaWdodABTbG90IHJpZ2h0AGJsb2Nrc2xpZ2h0AFN1bmxpZ2h0ACZhICBibG9ja3NsaWdodCAmZS0gU2V0cyB3aGV0aGVyIHRoZSBibG9jayBzdG9wcyBsaWdodABCbG9ja3MgbGlnaHQAd2luZG93LWhlaWdodAAmY1dpZHRoIG9mIGRlZmF1bHQucG5nIG11c3QgZXF1YWwgaXRzIGhlaWdodABDbG91ZHMgaGVpZ2h0AEp1bXAgaGVpZ2h0AENsb3Vkc0hlaWdodABTdXJyb3VuZGluZ1dhdGVySGVpZ2h0AEVkZ2VIZWlnaHQAQ2xvdWRIZWlnaHQAU3Vycm91bmRpbmdHcm91bmRIZWlnaHQAQWx0UmlnaHQAU2hpZnRSaWdodABCcmFja2V0UmlnaHQASG90YmFyUmlnaHQAV2luUmlnaHQAQ29udHJvbFJpZ2h0AFdoZWVsUmlnaHQATG9va1JpZ2h0AExvb2sgUmlnaHQAVHJhbnNtaXRzTGlnaHQAIFNoaWZ0AFNsb3QgbGVmdABBbHRMZWZ0AFNoaWZ0TGVmdABCcmFja2V0TGVmdABIb3RiYXJMZWZ0AFdpbkxlZnQAQ29udHJvbExlZnQAV2hlZWxMZWZ0AExvb2tMZWZ0AExvb2sgTGVmdABWb3hlbENyYWZ0AHRleE9mZnNldABTaWRlc09mZnNldABWaW9sZXQAVGV4dHVyZSBJRCByZWZlcmVuY2Ugc2hlZXQARW52TWFwQXNwZWN0AFJlY29ubmVjdAAmZVJlcXVpcmVzIHJlc3RhcnRpbmcgZ2FtZSB0byB0YWtlIGZ1bGwgZWZmZWN0AEtleXBhZFN1YnRyYWN0AEltcGFjdABVbnN1cHBvcnRlZCBXQVYgYXVkaW8gZm9ybWF0AEludmFsaWQgdHlwZSBmb3Igc3RyaW5nIGZvcm1hdABCZSBjYXJlZnVsIC0gbGlua3MgZnJvbSBzdHJhbmdlcnMgbWF5IGJlIHdlYnNpdGVzIHRoYXQAZ3VpLWF1dG9zY2FsZWNoYXQAbm9zdGFsZ2lhLWNsYXNzaWNjaGF0AEVudGVyIGNoYXQAQ2xpY2thYmxlIGNoYXQAU2VuZCBjaGF0AENsYXNzaWMgY2hhdABTZW5kQ2hhdAAuZGF0AEJHUkEgc3VwcG9ydCAtIEV4dDogJXQsIEFwcGxlOiAldABNb2RpZnkgaG90a2V5cwAmY0Nhbm5vdCBkZWZpbmUgbW9yZSB0aGFuIDI1NiBob3RrZXlzAGd1aS1ibGFja3RleHRzaGFkb3dzACZlRlBTIGxpbWl0LCB2aWV3IGRpc3RhbmNlLCBlbnRpdHkgbmFtZXMvc2hhZG93cwBCbGFjayB0ZXh0IHNoYWRvd3MAU2hhZG93cwBNaW51cwBQbHVzAGNodW5rIHBhcnRzAEhvc3QgY291bGQgbm90IGJlIHJlc29sdmVkIHRvIGFuIElQIGFkZHJlc3MASW52YWxpZCBJUCBhZGRyZXNzAE92ZXJydW4gaW4gU29ja2V0X1BhcnNlQWRkcmVzcwBGdWxsIGJyaWdodG5lc3MAUG9zdCBwcm9jZXNzAE5vIHdvcmtpbmcgbmV0d29yayBhY2Nlc3MARmxhdGdyYXNzAEdyYXNzAGNhbWVyYW1hc3MAR2xhc3MAQ2FtZXJhIE1hc3MAQ29sb3VycwBFbnZDb2xvcnMAVGV4dENvbG9ycwBQbGF5ZXJzAFBsYW50aW5nIGZsb3dlcnMATGV0dGVycwBOb3QgZW5vdWdoIGNvbnRyb2xsZXJzAGh0dHAtbm8taHR0cHMAZ3VpLXNob3dmcHMAZ2Z4LW1pcG1hcHMATWlwbWFwcwBpbl9wb3MAZ3VpLXRvdWNoYnV0dG9ucwBub3N0YWxnaWEtY2xhc3NpY29wdGlvbnMAJmVDaGF0IG9wdGlvbnMAQ2xhc3NpYyBvcHRpb25zAE5vc3RhbGdpYSBvcHRpb25zAEV4dEVudGl0eVBvc2l0aW9ucwBCbG9ja0RlZmluaXRpb25zACZjQ2Fubm90IHNob3cgb3ZlciA1MTIgYW5pbWF0aW9ucwBCbG9ja1Blcm1pc3Npb25zAFRleHR1cmVzIG11c3QgaGF2ZSBwb3dlciBvZiB0d28gZGltZW5zaW9ucwBIaXQgbWF4IHNjcmVlbnMAbm9zdGFsZ2lhLXNpbXBsZWFybXMAUGxhbnRpbmcgbXVzaHJvb21zACwgcGluZyAlaSBtcwBIYWNrcyBjb250cm9scwBPdGhlciBjb250cm9scwBIb3RiYXIgY29udHJvbHMAT24tc2NyZWVuIGNvbnRyb2xzAE5vcm1hbCBjb250cm9scwBDb250cm9scwBDdXN0b21Nb2RlbHMAJmUvY2xpZW50IHRlbGVwb3J0OiAmY0Nvb3JkaW5hdGVzIG11c3QgYmUgZGVjaW1hbHMAbGlnaHQgY2h1bmtzAE1vc3N5IHJvY2tzAG5vc3RhbGdpYS1jdXN0b21ibG9ja3MAU2V0dGluZyBkaXJ0IGJsb2NrcwBTZXR0aW5nIGdyYXNzIGJsb2NrcwBTZXR0aW5nIGFpciBibG9ja3MALmN3IG1hcCBibG9ja3MALm1jbGV2ZWwgbWFwIGJsb2NrcwBBbGxvdyBjdXN0b20gYmxvY2tzAEN1c3RvbUJsb2NrcwBFeHRlbmRlZEJsb2NrcwB0ZXhwYWNrcwBUZXh0dXJlIHBhY2tzAGhhY2tzLXdvbXN0eWxlaGFja3MAbm9zdGFsZ2lhLWhhY2tzAFdvTSBzdHlsZSBoYWNrcwBoYWNrcy1wZXJtLW1zZ3MAbG9ncwBNb3VzZSBrZXkgYmluZGluZ3MAJmVTZXQga2V5IGFuZCBtb3VzZSBiaW5kaW5ncwBsaWdodCBmbGFncwBBbHdheXMgeWVzAExlYXZlcwBDYXJ2aW5nIGNhdmVzAEhUVFAgcmV0dXJuZWQgZGF0YTogJWkgYnl0ZXMAQnJvd3NlckZhdm9yaXRlcwBjb2xsaXNpb24gc2VhcmNoIHN0YXRlcwBnZngtbWF4Y2h1bmt1cGRhdGVzACVpIGNodW5rIHVwZGF0ZXMAbm9zdGFsZ2lhLXNlcnZlcnRleHR1cmVzAFVzZSBzZXJ2ZXIgdGV4dHVyZXMAQ2xhc3NpYyBHVUkgdGV4dHVyZXMARXh0ZW5kZWRUZXh0dXJlcwBOb24tY2xhc3NpYyBmZWF0dXJlcwBNZXNzYWdlVHlwZXMAZ3VpLWNoYXRsaW5lcwBDaGF0IGxpbmVzAFNob3cgYXhpcyBsaW5lcwBBeGlzTGluZXMALW5hbWVzACtuYW1lcwBOYW1lcwBGb250IGZpbGVzAENsYXNzaWMgbWFwIGZpbGVzAEN1c3RvbVBhcnRpY2xlcwAmYS9jbGllbnQgYmxvY2tlZGl0IHByb3BlcnRpZXMAJmVMaXN0cyB0aGUgZWRpdGFibGUgYmxvY2sgcHJvcGVydGllcwAmZVNlZSAmYS9jbGllbnQgYmxvY2tlZGl0IHByb3BlcnRpZXMgMiAmZWZvciBtb3JlIHByb3BlcnRpZXMAQ2Fubm90IGxvYWQgLnppcCBmaWxlcyB3aXRoIG92ZXIgMTAyNCBlbnRyaWVzAFNhdmUgY2hhbmdlcwBMb25nZXJNZXNzYWdlcwBQbHVnaW5NZXNzYWdlcwBQbGFudGluZyB0cmVlcwBzaWRlcwBjaHVuayBkaXN0YW5jZXMAQ3VzdG9tTW9kZWwgdmVydGljZXMAJWkgdmVydGljZXMAWWVzAENvb3JkcwBwbGF5aW5nIHNvdW5kcwAmY0Rpc2FibGluZyBzb3VuZHMAQnJlYWthYmxlIGxpcXVpZHMAQnJlYWthYmxlTGlxdWlkcwBzaW5nbGVwbGF5ZXJwaHlzaWNzAEJsb2NrIHBoeXNpY3MAI2NhbnZhcwAlcyVyJXMAJmVOYW1lOiAmZiVzACZlTU9URDogJmYlcwAmYyVzACVjJXMAJmElcwBtYXBzLyVzAHRleHBhY2tzLyVzAHRleHR1cmVjYWNoZS8lcwBodHRwOi8vJXMAJXQmJXMATG9hZGVkIGZvbnQgZnJvbSAlcwBGZXRjaGluZyAlcwAmY0ludmFsaWQgYW5pbSBmcmFtZSBkZWxheTogJXMAJmNJbnZhbGlkIGFuaW0gc3RhdGVzIGNvdW50OiAlcwAmZVNhdmVkIG1hcCB0bzogJXMAJmNOb3QgZW5vdWdoIGFyZ3VtZW50cyBmb3IgYW5pbTogJXMAVGV4IHVybDogJXMACiAgRXJyb3IgbWVhbmluZzogJXMAJmNJbnZhbGlkIGFuaW0gZnJhbWUgc2l6ZTogJXMAU2VydmVyIHNvZnR3YXJlOiAlcwAmY0ludmFsaWQgYW5pbSBmcmFtZSBZIGNvb3JkOiAlcwAmY0ludmFsaWQgYW5pbSB0aWxlIFkgY29vcmQ6ICVzACZjSW52YWxpZCBhbmltIGZyYW1lIFggY29vcmQ6ICVzACZjSW52YWxpZCBhbmltIHRpbGUgWCBjb29yZDogJXMAVHJhbnNmZXJyaW5nIHNraW4gZG93bmxvYWQ6ICVzAENhbmNlbGxpbmcgc2tpbiBkb3dubG9hZDogJXMAQ1BFIGhvdGtleSBhZGRlZDogJWMsICViOiAlcwBzaGVlcF9ub2Z1cgBNYXBHZW5lcmF0b3IARXJyb3IAc2VsZWN0ZWQtYmxvY2stb3V0bGluZS1jb2xvcgBTa3kgY29sb3IAU2hhZG93IGNvbG9yAFN1bmxpZ2h0IGNvbG9yAENsb3VkcyBjb2xvcgBGb2cgY29sb3IAU2t5Q29sb3IARm9nQ29sb3IAQ2xvdWRDb2xvcgBvcGVuaW5nIGNhY2hlIGZvcgBTa3lib3hIb3IAQWlyAFNpbmdsZXBsYXllcgAmZUNoYW5nZXMgdG8gdGhlIHNraW4gdG8gdGhlIGdpdmVuIHBsYXllcgAmYmxlZ2FjeTogJmVTYW1lIGFzIG5vcm1hbCBtb2RlLCAmY2J1dCBpcyB1c3VhbGx5IHNsaWdodGx5IHNsb3dlcgBodHRwLXNraW5zZXJ2ZXIAWW91J3ZlIGxvc3QgY29ubmVjdGlvbiB0byB0aGUgc2VydmVyACZlTG9zdCBjb25uZWN0aW9uIHRvIHRoZSBzZXJ2ZXIAU2tpcHBpbmcgaW52YWxpZCBIYWNrQ29udHJvbCBieXRlIGZyb20gRDMgc2VydmVyAEtleXBhZEVudGVyAFN0aWxsIHdhdGVyAEZsb29kaW5nIHdhdGVyAEZsb29kaW5nIGVkZ2Ugd2F0ZXIAV2F0ZXIAb3BlbmluZyB1cmwgaW4gYnJvd3NlcgBeZGV0YWlsLnVzZXIAY2FudmFzX3dyYXBwZXIAY3JlZXBlcgBHYW1lcGFkL0NvbnRyb2xsZXIAVW5hYmxlIHRvIHJlZ2lzdGVyIGFub3RoZXIgZXZlbnQgaGFuZGxlcgBoYWNrcy1zcGVlZG11bHRpcGxpZXIAU3BlZWQgbXVsdGlwbGllcgBXZWF0aGVyAE90aGVyACZlQmxvY2tFZGl0OiAmZSVjIG11c3QgYmUgYW4gaW50ZWdlcgBTdHJpbmcgdG9vIGJpZyB0byBpbnNlcnQgaW50byBTdHJpbmdzQnVmZmVyAEludmVudG9yeU9yZGVyACZjU29tZXRoaW5nIGhhcyBkZWxldGVkIHN5c3RlbSBtYW5hZ2VkIGNhY2hlIGZvbGRlcgBzcGlkZXIARmFpbGVkIHRvIGNyZWF0ZSB2ZXJ0ZXggc2hhZGVyAEZhaWxlZCB0byBjcmVhdGUgZnJhZ21lbnQgc2hhZGVyAEZhaWxlZCB0byBjb21waWxlIHNoYWRlcgBTa3lib3hWZXIAUGlsbGFyAFN3aXRjaCBob3RiYXIAU2V0SG90YmFyAG12cABGbHkgdXAAJmNGYWlsZWQgdG8gb3BlbiBhIGNoYXQgbG9nIGZpbGUgYWZ0ZXIgJWkgdHJpZXMsIGdpdmluZyB1cABCcm93c2VyU3RvcABNZWRpYVN0b3AASnVtcAB0bXAAR2Z4X1VwZGF0ZVRleHR1cmUgdGVtcABMb2FkZWQgdGVycmFpbiBhdGxhczogJWkgYm1wcywgJWkgcGVyIGJtcABIZWxwAHRleHBhY2tzL2RlZmF1bHQuemlwAHRleHBhY2tzL2NsYXNzaWN1YmUuemlwAHRleHBhY2tzL2RlZmF1bHRfMDAyMy56aXAALW5vY2xpcAArbm9jbGlwAE5vY2xpcABOb0NsaXAAaGFja3MtZnVsbGJsb2Nrc3RlcABTbGVlcAAmYm5hbWVzOiAmZWNoaWJpLCBjaGlja2VuLCBjcmVlcGVyLCBodW1hbiwgcGlnLCBzaGVlcAB3ZWF0aGVyIGhlaWdodG1hcABCdWlsZGluZyBoZWlnaHRtYXAAJmNGYWlsZWQgdG8gbG9hZCBtYXAsIHRyeSBqb2luaW5nIGEgZGlmZmVyZW50IG1hcABGaWxsaW5nIG1hcAAgICAmY05vdCBlbm91Z2ggZnJlZSBtZW1vcnkgdG8gbG9hZCB0aGUgbWFwAENsYXNzaUN1YmUgbWFwAE1pbmVjcmFmdCBjbGFzc2ljIG1hcABGYXN0TWFwAEZseVVwAFdoZWVsVXAATG9va1VwAFZvbHVtZVVwAFBhZ2VVcABMb29rIFVwACZjV2lkdGggb2YgZGVmYXVsdC5wbmcgbXVzdCBiZSBhIHBvd2VyIG9mIHR3bwB3cml0aW5nIHRvAGFwcGVuZGluZyB0bwAmZUJsb2NrRWRpdDogJmUlYyBtdXN0IGJlIGVpdGhlciAmYXllcyAmZW9yICZhbm8AQWx3YXlzIG5vAGF1ZGlvAEluZGlnbwAmYS9jbGllbnQgZ3B1aW5mbwBHTF9OVlhfZ3B1X21lbW9yeV9pbmZvAHJlbmRlciBjaHVuayBpbmZvAHNvcnRlZCBjaHVuayBpbmZvAEdwdUluZm8ATm8AQnJvd24ARG93bmxvYWQgc2l6ZTogVW5rbm93bgBGbHkgZG93bgBGbHlEb3duAFdoZWVsRG93bgBMb29rRG93bgBWb2x1bWVEb3duAFBhZ2VEb3duAExvb2sgRG93bgAtcmVzcGF3bgArcmVzcGF3bgBSZXNwYXduAFNldCBzcGF3bgB6U3Bhd24AeVNwYXduAHhTcGF3bgBTZXRTcGF3bgBza2VsZXRvbgAtdGhpcmRwZXJzb24AK3RoaXJkcGVyc29uAFRoaXJkIHBlcnNvbgBUaGlyZFBlcnNvbgBJcm9uAFNlbWljb2xvbgBSZXNvbHV0aW9uACZjRW5kIG9mIHN0cmVhbSByZWFkaW5nIC5sdmwgY3VzdG9tIGJsb2NrcyBzZWN0aW9uAE5vdGlmeUFjdGlvbgBTYXZlIGxvY2F0aW9uAExvYWQgbG9jYXRpb24AZ2FtZS12ZXJzaW9uAEludmFsaWQgT0dHIGZvcm1hdCB2ZXJzaW9uACZlTm90ZSB0aGF0IHN1cHBvcnQgZm9yIHZlcnNpb25zIGVhcmxpZXIgdGhhbiAwLjMwIGlzIGluY29tcGxldGUuCgomY05vdGUgdGhhdCBzb21lIHNlcnZlcnMgb25seSBzdXBwb3J0IDAuMzAgZ2FtZSB2ZXJzaW9uAEdhbWUgdmVyc2lvbgBGb3JtYXRWZXJzaW9uAERhbmRlbGlvbgBtaW4AaHR0cDovL2Nkbi5jbGFzc2ljdWJlLm5ldC9za2luAGRlY29kaW5nIHNraW4AU2tpbgBObyBhdWRpbyBvdXRwdXQgZGV2aWNlcyBwbHVnZ2VkIGluAGd1aS10b3VjaC1oYWxpZ24AY2hpY2tlbgBGb3Jlc3QgZ3JlZW4AbGVhdmluZyBmdWxsc2NyZWVuAGdvaW5nIGZ1bGxzY3JlZW4ARnVsbHNjcmVlbgBUcmllZCB0byBhZGQgdG9vIG1hbnkgd2lkZ2V0cyB0byBzY3JlZW4AUHJpbnRTY3JlZW4AR3JlZW4AQ3lhbgBUaW1lcyBOZXcgUm9tYW4AT2JzaWRpYW4Abm9zdGFsZ2lhLWNsYXNzaWNhcm0AYm90dG9tAGxvYWRpbmcgZm9udCBmcm9tAHJlYWRpbmcgZnJvbQBTY3JvbGwgem9vbQBCcm93biBtdXNocm9vbQBSZWQgbXVzaHJvb20AdXNld2F0ZXJhbmltAHVzZWxhdmFhbmltAENsYXNzaWMgd2FsayBhbmltAC5mY20ARmFpbGVkIHRvIGNyZWF0ZSBwcm9ncmFtAEZhaWxlZCB0byBjb21waWxlIHByb2dyYW0ARW5kIG9mIHN0cmVhbQAubHZsACBDdHJsAFZlbG9jaXR5Q29udHJvbABIYWNrQ29udHJvbABpbl9jb2wAZm9nQ29sAFBORyBpbWFnZSB0b28gdGFsbABCeXRlQXJyYXkgTkJUIHRhZyB0b28gc21hbGwAU21hbGwAQ2lyY2xlQWxsAHVzZXIuZGV0YWlsAExhdW5jaE1haWwALm1jbGV2ZWwAZW52aXJvbm1lbnQubGV2ZWwAR2VuZXJhdGUgbmV3IGxldmVsAFdhdGVyIGxldmVsAEdlbmVyYXRpbmcgbGV2ZWwATG9hZCBsZXZlbABTaWRlTGV2ZWwAY29tLm1vamFuZy5taW5lY3JhZnQubGV2ZWwuTGV2ZWwAR3JhdmVsAENsYXNzaWMgaGFuZCBtb2RlbABDaGFuZ2VNb2RlbABDYW5jZWwAbm9ybWFsAE5vcm1hbABLZXlwYWREZWNpbWFsAEFyaWFsAFRlYWwATG9nIHRvIGRpc2sATGlnaHQgcGluawBQaW5rAEJlZHJvY2sAU2VsZWN0IGJsb2NrAERyb3AgYmxvY2sAJmVFZGl0cyB0aGUgZ2l2ZW4gcHJvcGVydHkgb2YgdGhlIGdpdmVuIGJsb2NrAFBpY2sgYmxvY2sARGVsZXRlIGJsb2NrACZhICBtaW4vbWF4ICZlLSBTZXRzIG1pbi9tYXggY29ybmVyIGNvb3JkaW5hdGVzIG9mIHRoZSBibG9jawAmYSAgYWxsICZlLSBTZXRzIHRleHR1cmVzIG9uIGFsbCBzaXggc2lkZXMgb2YgdGhlIGJsb2NrACZhICBzaWRlcyAmZS0gU2V0cyB0ZXh0dXJlcyBvbiBmb3VyIHNpZGVzIG9mIHRoZSBibG9jawAmYSAgbmFtZSAmZS0gU2V0cyB0aGUgbmFtZSBvZiB0aGUgYmxvY2sAJmEgIGRyYXdtb2RlICZlLSBTZXRzIGRyYXcgbW9kZSBvZiB0aGUgYmxvY2sAJmEgIGNvbGxpZGUgJmUtIFNldHMgY29sbGlzaW9uIG1vZGUgb2YgdGhlIGJsb2NrACZhICB3YWxrc291bmQgJmUtIFNldHMgd2Fsay9zdGVwIHNvdW5kIG9mIHRoZSBibG9jawAmYSAgYnJlYWtzb3VuZCAmZS0gU2V0cyBicmVhayBzb3VuZCBvZiB0aGUgYmxvY2sAUGxhY2UgYmxvY2sARHJvcEJsb2NrAFNuYXBUb0Jsb2NrAFBpY2tCbG9jawBEZWxldGVCbG9jawBFZGdlQmxvY2sAU2lkZUJsb2NrAFBsYWNlQmxvY2sASGVsZEJsb2NrAENhcHNMb2NrAE51bUxvY2sAU2Nyb2xsTG9jawBTdG9uZSBicmljawBCcmljawBQbGF5ZXJDbGljawBQaWNrAGRlZmF1bHR0ZXhwYWNrACZlRG93bmxvYWRpbmcgdGV4dHVyZSBwYWNrACZjJWkgZXJyb3Igd2hlbiB0cnlpbmcgdG8gZG93bmxvYWQgdGV4dHVyZSBwYWNrACZjNDA0IE5vdCBGb3VuZCBlcnJvciB3aGVuIHRyeWluZyB0byBkb3dubG9hZCB0ZXh0dXJlIHBhY2sAJmMlaSBOb3QgQXV0aG9yaXNlZCBlcnJvciB3aGVuIHRyeWluZyB0byBkb3dubG9hZCB0ZXh0dXJlIHBhY2sAU2VsZWN0IGEgdGV4dHVyZSBwYWNrAEFyaWFsIEJsYWNrAEdvIGJhY2sAQmFjawBub3N0YWxnaWEtY2xhc3NpY2d1aQBIaWRlIGd1aQBDaW5lbWF0aWNHdWkAc3lzdGVtLXVpAGNoaWJpAD90PSVpJWkARmFpbGVkIHRvIGNvbm5lY3QgdG8gJXM6JWkAUmVjb25uZWN0IGluICVpACZjQ3VzdG9tIE1vZGVsICclcycgZXhjZWVkcyBwYXJ0cyBsaW1pdCBvZiAlaQAmZUJsb2NrRWRpdDogJmUlYyBtdXN0IGJlIGJldHdlZW4gJWkgYW5kICVpAFNlbnNpdGl2aXR5OiAlaQBVbmtub3duIGtleTogJWkAbWFwIGxvYWRpbmcgdG9vazogJWkAVW5zdXBwb3J0ZWQuemlwIGVudHJ5IGNvbXByZXNzaW9uIG1ldGhvZDogJWkAY3BlIGV4dDogJXMsICVpAGRlcHRoAGNhbWVyYS1zbW9vdGgAbGVuZ3RoAHdpbmRvdy13aWR0aABNYXRoAC1wdXNoACtwdXNoAEJyb3dzZXJSZWZyZXNoAEJhY2tTbGFzaAAzZCBhbmFnbHlwaAAzRCBhbmFnbHlwaABCcm93c2VyU3NlYXJjaABzaG93aW5nIG9wZW4gZmlsZSBkaWFsb2cAc2hvd2luZyBzYXZlIGZpbGUgZGlhbG9nAGVudmlyb25tZW50LmZvZwBUb2dnbGUgZm9nAExvZwBFeHBGb2cAVG9nZ2xlRm9nAHNreWJveC5wbmcAc25vdy5wbmcAZGVmYXVsdC5wbmcAJmNidXQgaXMgbWlzc2luZyBhbmltYXRpb25zLnBuZwAmY1NvbWUgb2YgdGhlIGFuaW1hdGlvbiBmcmFtZXMgZm9yIHRpbGUgKCVpLCAlaSkgYXJlIGF0IGNvb3JkaW5hdGVzIG91dHNpZGUgYW5pbWF0aW9ucy5wbmcAaWNvbnMucG5nAHBhcnRpY2xlcy5wbmcAY2xvdWRzLnBuZwAlcy8lcy5wbmcAc2hlZXBfZnVyLnBuZwBjcmVlcGVyLnBuZwBzcGlkZXIucG5nAGNoYXIucG5nAHNoZWVwLnBuZwBza2VsZXRvbi5wbmcAJmNBbmltYXRpb24gZnJhbWVzIGZvciB0aWxlICglaSwgJWkpIGFyZSBiaWdnZXIgdGhhbiB0aGUgc2l6ZSBvZiBhIHRpbGUgaW4gdGVycmFpbi5wbmcAY2hpY2tlbi5wbmcAZ3VpLnBuZwB0b3VjaC5wbmcAcGlnLnBuZwB6b21iaWUucG5nAHNraW5uZWRjdWJlLnBuZwBndWlfY2xhc3NpYy5wbmcALSVwMi0lcDItJXAyLnBuZwBOQlQgc3RyaW5nIHRvbyBsb25nAGdmeC1zbW9vdGhsaWdodGluZwBTbW9vdGggbGlnaHRpbmcAZXh0cmFjdGluZwBjcmVhdGluZwBjbG9zaW5nAENhbm5vdCBpbnNlcnQgY2hhcmFjdGVyIGludG8gZnVsbCBzdHJpbmcAV29yZFdyYXBfR2V0QmFja0xlbmd0aCAtIGluZGV4IHBhc3QgZW5kIG9mIHN0cmluZwBXb3JkV3JhcF9HZXRGb3J3YXJkTGVuZ3RoIC0gaW5kZXggcGFzdCBlbmQgb2Ygc3RyaW5nACZjVG9vIG1hbnkgcGh5c2ljcyBlbnRyaWVzLCBjbGVhcmluZwAmY1RvbyBtYW55IGdlbmVyaWMgcXVldWUgZW50cmllcywgY2xlYXJpbmcAaGFja3MtY2FtZXJhY2xpcHBpbmcAQ2FtZXJhIGNsaXBwaW5nAEZ1bGwgYmxvY2sgc3RlcHBpbmcAb3BlbmluZwBTYXBsaW5nAFpvb21TY3JvbGxpbmcASG90YmFyIHN3aXRjaGluZwBIb3RiYXJTd2l0Y2hpbmcAY2FjaGluZwBjaGF0LWxvZ2dpbmcAJmNEaXNhYmxpbmcgY2hhdCBsb2dnaW5nAGVuY29kaW5nAGRlY29kaW5nACZlUHJlc3MgZXNjYXBlIHRvIHJlc2V0IHRoZSBiaW5kaW5nAGhhY2tzLXB1c2hiYWNrcGxhY2luZwBQdXNoYmFjayBwbGFjaW5nAHZpZXdib2JiaW5nAFZpZXcgYm9iYmluZwBUd29XYXlQaW5nAHBpZwBFeHBlY3RlZCBCeXRlQXJyYXkgTkJUIHRhZwBJbnZhbGlkIHJvb3QgTkJUIHRhZwBFeHBlY3RlZCBTdHJpbmcgTkJUIHRhZwBFeHBlY3RlZCBJbnQ4IE5CVCB0YWcARXhwZWN0ZWQgSW50MTYgTkJUIHRhZwBFeHBlY3RlZCBJbnQzMiBOQlQgdGFnAEV4cGVjdGVkIEZsb2F0MzIgTkJUIHRhZwAudHRmAC5vdGYAQm9va3NoZWxmAHNhbnMtc2VyaWYALCBkZWxldGUgJmNObyZmACwgcGxhY2UgJmNObyZmACAoSUQgJWkmZgBJbnZhbGlkIFBORyBoZWFkZXIgc2l6ZQAgICAmY0F0dGVtcHRlZCB0byBsb2FkIG1hcCBvdmVyIDIgR0IgaW4gc2l6ZQBjdXJzaXZlAFNhdmUAdHJ1ZQBUcnVlAERlZXAgYmx1ZQBEZWZhdWx0IHZhbHVlAEJsdWUAcGh5c2ljcyB0aWNrIHF1ZXVlAEdlbmVyaWMgcXVldWUAVm9sdW1lTXV0ZQBsaWdodCBjb2xvciBwYWxldHRlAFF1b3RlAFdoaXRlAGd1aS10YWItYXV0b2NvbXBsZXRlAFRhYiBhdXRvLWNvbXBsZXRlAFRhcDogRGVsZXRlAEhvbGQ6IERlbGV0ZQBBdXRvLXJvdGF0ZQBBdXRvUm90YXRlAExpbWl0IGZyYW1lcmF0ZQBDcmF0ZQBCdWxrQmxvY2tVcGRhdGUAJmVSZWxvYWRpbmcgbGV2ZWwgbGlzdCBhcyBpdCBtYXkgYmUgb3V0IG9mIGRhdGUAJmVSZWxvYWRpbmcgdGV4dHVyZSBwYWNrIGxpc3QgYXMgaXQgbWF5IGJlIG91dCBvZiBkYXRlAGludmVydG1vdXNlAEludmVydCBtb3VzZQBSaWdodE1vdXNlAExlZnRNb3VzZQBNaWRkbGVNb3VzZQBLZXlib2FyZC9Nb3VzZQBhdXRvLXBhdXNlAFBhdXNlAGNvcnBzZQBSb3NlAGZhbHNlAEZhbHNlAFR1cnF1b2lzZQAmYSAgbGVmdC9yaWdodC9mcm9udC9iYWNrL3RvcC9ib3R0b20gJmUtIFNldHMgb25lIHRleHR1cmUAVGV4dHVyZQBJJ20gc3VyZQAmZUd1aSBzY2FsZSwgZm9udCBzZXR0aW5ncywgYW5kIG1vcmUAJmVIYWNrcyBhbGxvd2VkLCBqdW1wIHNldHRpbmdzLCBhbmQgbW9yZQAmZUVudiBjb2xvdXJzLCB3YXRlciBsZXZlbCwgd2VhdGhlciwgYW5kIG1vcmUAJmVNdXNpYy9Tb3VuZCwgdmlldyBib2JiaW5nLCBhbmQgbW9yZQBNb3JlAENhcnZpbmcgaXJvbiBvcmUASXJvbiBvcmUAQ2FydmluZyBjb2FsIG9yZQBDb2FsIG9yZQBDYXJ2aW5nIGdvbGQgb3JlAEdvbGQgb3JlAEZpcmUAVW5rbm93biBOQlQgdGFnIHR5cGUASW52YWxpZCBQTkcgc2NhbmxpbmUgdHlwZQBJbnZhbGlkIFdBViB0eXBlAFN1cnJvdW5kaW5nV2F0ZXJUeXBlAEVudldlYXRoZXJUeXBlAFJlbmRlclR5cGUAQ29sbGlkZVR5cGUAU3Vycm91bmRpbmdHcm91bmRUeXBlAFJvcGUAbGx2bXBpcGUAbm9zdGFsZ2lhLXVzZWNwZQBTaGFwZQBFc2NhcGUAQ29iYmxlc3RvbmUAU2FuZHN0b25lAFN0b25lAFs3XSBTZXR1cFByb2dyYW0gZG9uZQBMaW1pdE5vbmUAVGFwOiBOb25lAEhvbGQ6IE5vbmUARG9uZQAubWluZQBzb3VuZHN2b2x1bWUAbXVzaWN2b2x1bWUAU291bmRzIHZvbHVtZQBNdXNpYyB2b2x1bWUAQnJvd3NlckhvbWUATGltZQBndWktZm9udG5hbWUAJmVQbGVhc2UgZW50ZXIgYSBmaWxlbmFtZQBNYXAgbmFtZQBRdWl0IGdhbWUAQmFjayB0byBnYW1lAE5hbWUAQ2VyYW1pYyB0aWxlAE1pc3NpbmcgZmlsZQBWb3hlbENyYWZ0IDEuMCB3ZWIgbW9iaWxlAENpcmNsZQBndWktY2hhdGNsaWNrYWJsZQBoYWNrcy1saXF1aWRzYnJlYWthYmxlAGd1aS1pbnZlbnRvcnlzY2FsZQBndWktY2hhdHNjYWxlAGd1aS1jcm9zc2hhaXJzY2FsZQBndWktaG90YmFyc2NhbGUAZ3VpLXRvdWNoc2NhbGUAaW52LXNjcm9sbGJhci1zY2FsZQBzZWxlY3RlZC1ibG9jay1vdXRsaW5lLXNjYWxlAEludmVudG9yeSBzY2FsZQBDaGF0IHNjYWxlAENyb3NzaGFpciBzY2FsZQBIb3RiYXIgc2NhbGUAem9tYmllAC90ZXh0dXJlY2FjaGUASHVnZQAmY1NraW4gJXMgaXMgdG9vIGxhcmdlAFNwb25nZQBPcmFuZ2UAU3ViIG9mZnNldCBvdXQgb2YgcmFuZ2UAT2Zmc2V0IGZvciBJbnNlcnRBdCBvdXQgb2YgcmFuZ2UAT2Zmc2V0IGZvciBEZWxldGVBdCBvdXQgb2YgcmFuZ2UAUmVzdWx0IHN1YnN0cmluZyBpcyBvdXQgb2YgcmFuZ2UAT2Zmc2V0IGZvciBzdWJzdHJpbmcgb3V0IG9mIHJhbmdlAExlbmd0aCBmb3Igc3Vic3RyaW5nIG91dCBvZiByYW5nZQBkcmF3bW9kZQBuYW1lc21vZGUAZ2Z4LWxpZ2h0aW5nbW9kZQBEcmF3IG1vZGUAICAgJmVJZiB5b3UgaGF2ZSBpc3N1ZXMgd2l0aCBjbG91ZHMgYW5kIG1hcCBlZGdlcyBkaXNhcHBlYXJpbmcgcmFuZG9tbHksIHVzZSB0aGlzIG1vZGUATGlnaHRpbmcgbW9kZQBDb2xsaWRlIG1vZGUARlBTIG1vZGUATGlnaHRpbmdNb2RlAFRpbGRlACZjZGVmYXVsdC5wbmcgbXVzdCBiZSBhdCBsZWFzdCAxNiBwaXhlbHMgd2lkZQBQTkcgaW1hZ2UgdG9vIHdpZGUAS2V5cGFkRGl2aWRlAGhhY2tzLW5vY2xpcHNsaWRlAE5vY2xpcCBzbGlkZQBjb2xsaWRlAFdlYXRoZXJGYWRlAFZpZXcgZGlzdGFuY2UAUmVuZGVyIGRpc3RhbmNlAFJlYWNoIGRpc3RhbmNlAENsaWNrRGlzdGFuY2UARW52TWFwQXBwZWFyYW5jZQAmYmZhc3Q6ICZlU2FjcmlmaWNlcyBjbG91ZHMsIGZvZyBhbmQgb3ZlcmhlYWQgc2t5IGZvciBmYXN0ZXIgcGVyZm9ybWFuY2UAbW9ub3NwYWNlAEJhY2tTcGFjZQBSZXBsYWNlAFRhcDogUGxhY2UASG9sZDogUGxhY2UAQ3JlYXRpbmcgc3VyZmFjZQBJY2UAL2NsYXNzaWN1YmUAc2tpbm5lZGN1YmUAV2ViR0wgaXMgcmVxdWlyZWQgdG8gcnVuIENsYXNzaUN1YmUAJmUARXJyb3IgZnJvbSBzZW5kOiAlZQBlbnZpcm9ubWVudC5jbG91ZABDbG91ZAAmYS9jbGllbnQgbW90ZABNb3RkAFogY29vcmQAWSBjb29yZABYIGNvb3JkAEZvcndhcmQAV29vZABQZXJpb2QAd2Fsa3NvdW5kAGJyZWFrc291bmQAV2Fsa1NvdW5kAEdhcmFtb25kAFNlbmQAVHJpZWQgdG8gcmVtb3ZlIGVsZW1lbnQgYXQgbGlzdCBlbmQAVHJpZWQgdG8gZ2V0IFN0cmluZyBwYXN0IFN0cmluZ3NCdWZmZXIgZW5kAFRyaWVkIHRvIHJlbW92ZSBTdHJpbmcgcGFzdCBTdHJpbmdzQnVmZmVyIGVuZABTdHJpbmcgdG9vIGxvbmcgdG8gZXhwYW5kACZlICBJZiBwZXJzaXN0IGlzIGdpdmVuIGFuZCBpcyAieWVzIiwgdGhlbiB0aGUgY29tbWFuZABndWktYmxvY2tpbmhhbmQAU2FuZABmb2dFbmQAQ2xhc3NpY1dvcmxkAGhvbGQAR29sZABCdWlsZABodW1hbm9pZABTZWxlY3Rpb25DdWJvaWQASW52YWxpZAAxNiBicHAgUE5HcyB1bnN1cHBvcnRlZABJbnRlcmxhY2VkIFBOR3MgdW5zdXBwb3J0ZWQAcG9sbCB1bnN1cHBvcnRlZABXZWJHTCB1bnN1cHBvcnRlZABIVFRQUyBVUkxzIGFyZSBub3QgY3VycmVudGx5IHN1cHBvcnRlZABPcGVyYXRpb24gbm90IHN1cHBvcnRlZABNUDMgYXVkaW8gZmlsZXMgYXJlIG5vdCBzdXBwb3J0ZWQAT25seSBXQVYgc291bmQgZmlsZXMgc3VwcG9ydGVkAE9ubHkgT0dHIG11c2ljIGZpbGVzIHN1cHBvcnRlZABPbmx5IFBORyBpbWFnZXMgc3VwcG9ydGVkAFNraXBwaW5nIHZlcnkgbG9uZyAoJWkgY2hhcmFjdGVycykgbGluZSBpbiAlYywgZmlsZSBtYXkgYmUgY29ycnVwdGVkAERpc2Nvbm5lY3RlZAAmZVJlcGxhY2U6ICZjQXQgbGVhc3Qgb25lIGFyZ3VtZW50IGlzIHJlcXVpcmVkAEFsbEhvdmVyZWQAQXR0ZW1wdCB0byByZWdpc3RlciBldmVudCBoYW5kbGVyIHRoYXQgd2FzIGFscmVhZHkgcmVnaXN0ZXJlZAAgICZjVGhlIHRleHR1cmUgcGFjayBVUkwgbWF5IG5vdCBiZSBwdWJsaWNseSBzaGFyZWQAJWM6IFJpZ2h0IGFsaWduZWQAJWM6IExlZnQgYWxpZ25lZAAgICZlQnJlYWthYmxlIGxpcXVpZHMgaXMgJmNkaXNhYmxlZAAgICZlQXV0byByb3RhdGUgaXMgJmNkaXNhYmxlZAAgICZlU21vb3RoIGNhbWVyYSBpcyAmY2Rpc2FibGVkACZjTm9jbGlwIGlzIGN1cnJlbnRseSBkaXNhYmxlZAAmY0Nhbm5vdCB6b29tIGNhbWVyYSBvdXQgYXMgZmx5aW5nIGlzIGN1cnJlbnRseSBkaXNhYmxlZAAmY0ZseWluZyBpcyBjdXJyZW50bHkgZGlzYWJsZWQAJmNSZXNwYXduaW5nIGlzIGN1cnJlbnRseSBkaXNhYmxlZAAmY0Nhbm5vdCBzZXQgc3Bhd24gbWlkYWlyIHdoZW4gbm9jbGlwIGlzIGRpc2FibGVkAGhhY2tzLWhhY2tzZW5hYmxlZAAgICZlQnJlYWthYmxlIGxpcXVpZHMgaXMgJmFlbmFibGVkACAgJmVBdXRvIHJvdGF0ZSBpcyAmYWVuYWJsZWQAICAmZVNtb290aCBjYW1lcmEgaXMgJmFlbmFibGVkACZibm9ybWFsOiAmZURlZmF1bHQgcmVuZGVyIG1vZGUsIHdpdGggYWxsIGVudmlyb25tZW50YWwgZWZmZWN0cyBlbmFibGVkAEhhY2tzIGVuYWJsZWQAQWxsVW5zY2FsZWQAJmEvY2xpZW50IGNsZWFyZGVuaWVkACZlQ2xlYXJzIHRoZSBsaXN0IG9mIHRleHR1cmUgcGFjayBVUkxzIHlvdSBoYXZlIGRlbmllZABDbGVhckRlbmllZAAtc3BlZWQAK3NwZWVkAFJhaW4vU25vdyBzcGVlZABDbG91ZHMgc3BlZWQASGFsZiBzcGVlZACrU3BlZWQAQ2xvdWRzU3BlZWQAV2VhdGhlclNwZWVkAEhhbGZTcGVlZABTZWVkAFJlZABLZXlwYWRBZGQAVXBsb2FkAERvd25sb2FkAFs2XSBPcHRpb25zX0xvYWQAaGVhZABhbmFnbHlwaC0zZABMaW1pdFZTeW5jAExhdW5jaENhbGMALnNjaGVtYXRpYwBNaW5lY3JhZnQgc2NoZW1hdGljAE11c2ljAG1vZGUtY2xhc3NpYwAmZVNldHRpbmdzIGZvciByZXNlbWJsaW5nIHRoZSBvcmlnaW5hbCBjbGFzc2ljAENsYXNzaWMAJXMlYwAlYzogJWMlYyVjAGtleS0lYwBwYWQtJWMAQ2xlYW5pbmcgdXAgZm9yZ290dGVuIGRvd25sb2FkIGZvciAlYwBFcnJvciAlZSB3aGVuICVjAExvc3QgZ3JhcGhpY3MgY29udGV4dDogJWMACiAgRXJyb3IgZGV0YWlsczogJWMACiAgRXJyb3IgbWVhbmluZzogJWMAVm94ZWxDcmFmdCAxLjAgd2ViAENvYmJsZXN0b25lIHNsYWIARG91YmxlIHNsYWIAU2xhYgBUYWIAQ2hlY2tNYXhWZXJ0aWNlcyBmb3VuZCBzbWFsbGVyIGJ1ZmZlciwgcmVzZXR0aW5nIE1vZGVscy5WYgBob3RrZXktJWMmJWIAcndhAFN0aWxsIGxhdmEARmxvb2RpbmcgbGF2YQBMYXZhAEFxdWEATWFnZW50YQBDcmVhdGluZyBzdHJhdGEATWV0YWRhdGEAYml0bWFwIGRhdGEASW5jb21wbGV0ZSBQTkcgaW1hZ2UgZGF0YQBIdHRwX1Bvc3REYXRhAFNtb290aCBjYW1lcmEAU21vb3RoQ2FtZXJhAFZlcmRhbmEAVGFob21hAENvbW1hAE1hZ21hAFZhbmlsbGEAR2VvcmdpYQBMYXVuY2hNZWRpYQBIZWx2ZXRpY2EAMC4wLjE5YQAwLjAuMTdhADAuMC4yM2EAXwAmYS9jbGllbnQgdHAgW3ggeSB6XQAmYS9jbGllbnQgcGxhY2UgW2Jsb2NrXSBbeCB5IHpdACZhL2NsaWVudCByZXBsYWNlIFtzb3VyY2VdIFtyZXBsYWNlbWVudF0gW3BlcnNpc3RdACZhL2NsaWVudCBjdWJvaWQgW2Jsb2NrXSBbcGVyc2lzdF0AJmEvY2xpZW50IHJlbmRlcnR5cGUgW25vcm1hbC9sZWdhY3kvZmFzdF0AJmEvY2xpZW50IHJlc29sdXRpb24gW3dpZHRoXSBbaGVpZ2h0XQAmYS9jbGllbnQgc2tpbiBbdXJsXQAmYS9jbGllbnQgYmxvY2tlZGl0IFtibG9ja10gW3Byb3BlcnR5XSBbdmFsdWVdACZhL2NsaWVudCBza2luIFtuYW1lXQAmYS9jbGllbnQgbW9kZWwgW25hbWVdACZhL2NsaWVudCBoZWxwIFtjb21tYW5kIG5hbWVdACZlVG8gc2VlIGhlbHAgZm9yIGEgY29tbWFuZCwgdHlwZSAvY2xpZW50IGhlbHAgW2NtZCBuYW1lXQBQQURfWgBQQURfWQBUSU5ZAE1VTFRJUExZAE1FRElBUExBWQBQQURfWAAtU1cALU5XAC1XAEJST1dTRVJQUkVWAE1FRElBUFJFVgBNRU5VAC1VAEJST1dTRVJORVhUAE1FRElBTkVYVABTSE9SVABJTlNFUlQAUEFEX1NUQVJUAFROVABQUklOVABSQUxUAExBTFQAUEFEX1JJR0hUAFdIRUVMUklHSFQAUEFEX0NSSUdIVABSU0hJRlQATFNISUZUAFBBRF9MRUZUAFdIRUVMTEVGVABQQURfQ0xFRlQAUkJSQUNLRVQATEJSQUNLRVQAUEFEX1NFTEVDVABTVUJUUkFDVABNSU5VUwBQTFVTAEhpZGVGUFMATGltaXQxNDRGUFMATGltaXQ2MEZQUwBMaW1pdDMwRlBTAExpbWl0MTIwRlBTAFNob3cgRlBTAEhpZGUgRlBTAC1OUwBUcmVidWNoZXQgTVMAQ29taWMgU2FucyBNUwBCUk9XU0VSRkFWT1JJVEVTAC1TAFBBRF9SAFBBRF9aUgBQUklPUgBOVU1QQURFTlRFUgBGQVIAUQBQQURfVVAAV0hFRUxVUABWT0xVTUVVUABQQURfQ1VQAFRQAEJST1dTRVJTVE9QAE1FRElBU1RPUABTTEVFUABPAFBBRF9ET1dOAFdIRUVMRE9XTgBWT0xVTUVET1dOAFBBRF9DRE9XTgBSRVRVUk4AU0VNSUNPTE9OAFJXSU4ATFdJTgAtTgBNAFBBRF9MAFBBRF9aTABUZXh0dXJlVVJMAENhbm5vdCBuYXZpZ2F0ZSB0byBpbnZhbGlkIFVSTABDYW5ub3QgZG93bmxvYWQgZnJvbSBpbnZhbGlkIFVSTABSQ09OVFJPTABMQ09OVFJPTABTQ1JPTEwATEFVTkNITUFJTABDQVBJVEFMAE5PUk1BTABERUNJTUFMAE9LAE5VTUxPQ0sAUEFEX1JTVElDSwBQQURfTFNUSUNLAEJBQ0sASgBIaWRlR1VJAEJST1dTRVJSRUZSRVNIAEJBQ0tTTEFTSABCUk9XU0VSU0VBUkNIACZlQ2hhbmdlcyBza2luIHRvIGEgVVJMIGxpbmtpbmcgZGlyZWN0bHkgdG8gYSAuUE5HAE5vIGltYWdlIGluIFBORwBPRkYALVdFAEdSQVZFAFZPTFVNRU1VVEUAREVMRVRFAFJNT1VTRQBNTU9VU0UATE1PVVNFAFBBVVNFAC1TRQBDUEUARVNDQVBFAE5PTkUALU5FAEJST1dTRVJIT01FAE9QRU4gU0VTQU1FAEdSQVlTQ0FMRQBBUE9TVFJPUEhFAERJVklERQBTUEFDRQAtRQBQQURfRAAtVUQASW5zdGFudE1PVEQAUEVSSU9EAEVORABVVUlEACZlQmxvY2tFZGl0OiAmYyIlcyIgaXMgbm90IGEgdmFsaWQgYmxvY2sgbmFtZSBvciBJRABBREQALUQAUEFEX0MATEFVTkNIQ0FMQwBQQURfQgBbQgBEb3dubG9hZCBzaXplOiAlZjMgTUIAVEFCAFBBRF9BAENPTU1BAExBVU5DSE1FRElBAFlvdSBoYXZlIHVuc2F2ZWQgY2hhbmdlcy4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHF1aXQ/ACZlQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIG9wZW4gdGhpcyBsaW5rPwBEbyB5b3Ugd2FudCB0byBkb3dubG9hZCB0aGUgc2VydmVyJ3MgdGV4dHVyZSBwYWNrPwBTdXJlIHlvdSBkb24ndCB3YW50IHRvIGRvd25sb2FkIHRoZSB0ZXh0dXJlIHBhY2s/ACZjT3ZlcndyaXRlIGV4aXN0aW5nPwAmZSAgICAgICBza2VsZXRvbiwgc3BpZGVyLCB6b21iaWUsIHNpdCwgPG51bWVyaWNhbCBibG9jayBpZD4AanVtcHM9AF5kZXRhaWwudXNlcj0AY2ZnPQBtYXhzcGVlZD0AaG9yc3BlZWQ9AD09PSBWb3hlbENyYWZ0IE1vYmlsZSBEZWJ1Z2dlciA9PT0APiAlYzogJWMlYyVjIDwASGVpZ2h0OgBDb25uZWN0ZWQgcGxheWVyczoATW9kaWZpZXJzOgAmZUVkaXRhYmxlIGJsb2NrIHByb3BlcnRpZXM6ACZlTGlzdCBvZiBjbGllbnQgY29tbWFuZHM6AFRleHR1cmUgcGFjayB1cmw6AExlbmd0aDoAV2lkdGg6AFNlZWQ6ACZlRWRpdGFibGUgYmxvY2sgcHJvcGVydGllcyAocGFnZSAyKToATnVtYmVyOQBIb3RiYXI5AEtleXBhZDkARjkATlVNUEFEOQAwMTIzNDU2Nzg5AEYxOQBTbG90ICM5AE51bWJlcjgASG90YmFyOABLZXlwYWQ4AEY4AE5VTVBBRDgARVhUX3RleHR1cmVfZm9ybWF0X0JHUkE4ODg4AEdMX0lNR190ZXh0dXJlX2Zvcm1hdF9CR1JBODg4OABBUFBMRV90ZXh0dXJlX2Zvcm1hdF9CR1JBODg4OAAyMTQ3NDgzNjQ4AEYxOABTbG90ICM4AE51bWJlcjcASG90YmFyNwBLZXlwYWQ3AEY3AE5VTVBBRDcAMjE0NzQ4MzY0NwBGdWxsQ1A0MzcARjE3AC93b21pZCBXb01DbGllbnQtMi4wLjcAU2xvdCAjNwBOdW1iZXI2AEhvcmJhcjYAWEJ1dHRvbjYAS2V5cGFkNgBYQlVUVE9ONgBGNgBOVU1QQUQ2AEYxNgBTbG90ICM2AE51bWJlcjUASG90YmFyNQBYQnV0dG9uNQBLZXlwYWQ1AFhCVVRUT041AEY1AE5VTVBBRDUARjE1AFNsb3QgIzUAc3RlcF9zbm93NABkaWdfc25vdzQAc3RlcF9ncmFzczQAZGlnX2dyYXNzNABOdW1iZXI0AEhvdGJhcjQAWEJ1dHRvbjQAc3RlcF9ncmF2ZWw0AGRpZ19ncmF2ZWw0AHN0ZXBfY2xvdGg0AGRpZ19jbG90aDQAc3RlcF9zdG9uZTQAZGlnX3N0b25lNABzdGVwX3dvb2Q0AGRpZ193b29kNABzdGVwX3NhbmQ0AGRpZ19zYW5kNABLZXlwYWQ0AFhCVVRUT040AEY0AE5VTVBBRDQARjI0AEYxNABTbG90ICM0AHN0ZXBfc25vdzMAZGlnX3Nub3czAHN0ZXBfZ3Jhc3MzAGRpZ19ncmFzczMAZGlnX2dsYXNzMwBOdW1iZXIzAEhvdGJhcjMAWEJ1dHRvbjMAc3RlcF9ncmF2ZWwzAGRpZ19ncmF2ZWwzAHN0ZXBfY2xvdGgzAGRpZ19jbG90aDMAc3RlcF9zdG9uZTMAZGlnX3N0b25lMwBzdGVwX3dvb2QzAGRpZ193b29kMwBzdGVwX3NhbmQzAGRpZ19zYW5kMwBLZXlwYWQzAFhCVVRUT04zAEYzAE5VTVBBRDMARjIzAEYxMwBTbG90ICMzAEJsb2NrQXJyYXkyAHN0ZXBfc25vdzIAZGlnX3Nub3cyAHN0ZXBfZ3Jhc3MyAGRpZ19ncmFzczIAZGlnX2dsYXNzMgAuY3cgbWFwIGJsb2NrczIATnVtYmVyMgBIb3RiYXIyAHNjcmVlbnNob3RfJXA0LSVwMi0lcDIAWEJ1dHRvbjIAc3RlcF9ncmF2ZWwyAGRpZ19ncmF2ZWwyAHN0ZXBfY2xvdGgyAGRpZ19jbG90aDIAJmUvY2xpZW50OiAmZkN1cnJlbnQgcmVzb2x1dGlvbiBpcyAlaUAlZjIgeCAlaUAlZjIAc3RlcF9zdG9uZTIAZGlnX3N0b25lMgBzdGVwX3dvb2QyAGRpZ193b29kMgBzdGVwX3NhbmQyAGRpZ19zYW5kMgBLZXlwYWQyAFhCVVRUT04yAEYyAElEMgBOVU1QQUQyAEZpZWxkIHR5cGUgbXVzdCBiZSBJbnQzMgBGMjIARjEyAFNsb3QgIzIAcHJvcGVydGllcyAyAHN0ZXBfc25vdzEAZGlnX3Nub3cxAHN0ZXBfZ3Jhc3MxAGRpZ19ncmFzczEAZGlnX2dsYXNzMQBOdW1iZXIxAEhvdGJhcjEATGF1bmNoQXBwMQBYQnV0dG9uMQBzdGVwX2dyYXZlbDEAZGlnX2dyYXZlbDEAc3RlcF9jbG90aDEAZGlnX2Nsb3RoMQBzdGVwX3N0b25lMQBkaWdfc3RvbmUxAHN0ZXBfd29vZDEAZGlnX3dvb2QxAHN0ZXBfc2FuZDEAZGlnX3NhbmQxAEtleXBhZDEATEFVTkNIQVBQMQBYQlVUVE9OMQBGMQBOVU1QQUQxAEYyMQBGMTEAU2xvdCAjMQBOdW1iZXIwAEtleXBhZDAATlVNUEFEMAAwLjMwAEYyMABGMTAAaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vAGh0dHBzOi8vZGwuZHJvcGJveC5jb20vAGh0dHA6Ly9kbC5kcm9wYm94LmNvbS8AaHR0cHM6Ly9kbC5kcm9wYm94dXNlcmNvbnRlbnQuY29tLwBodHRwczovL2ltZ3VyLmNvbS8AaHR0cHM6Ly93d3cuaW1ndXIuY29tLwBodHRwczovL2kuaW1ndXIuY29tLwBodHRwczovLwBodHRwOi8vACZlUHJlY2lzZWx5IHNldHMgdGhlIHNpemUgb2YgdGhlIHJlbmRlcmVkIHdpbmRvdy4AJmVZb3UgbWlnaHQgYmUgbWlzc2luZyBvdXQuACZjIEl0cyBzaXplIGlzICVmMyBNQiwgeW91ciBHUFUgc3VwcG9ydHMgJWYzIE1CIGF0IG1vc3QuACZjIEl0cyBzaXplIGlzICglaSwlaSksIHlvdXIgR1BVIHN1cHBvcnRzICglaSwlaSkgYXQgbW9zdC4AJmMgdGVycmFpbi5wbmcgc2l6ZSBpcyAoJWksJWkpLCB5b3VyIEdQVSBzdXBwb3J0cyAoJWksJWkpIGF0IG1vc3QuACZjIFRpbGUgc2l6ZSBpcyAoJWksJWkpLCB5b3VyIEdQVSBzdXBwb3J0cyAoJWksJWkpIGF0IG1vc3QuACZjIEl0IG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUgcm93IGluIGl0LgAmZVRvbyBmZXcgYXJndW1lbnRzLgAmY1lvdSBtYXkgbmVlZCB0byBpbnN0YWxsIHZpZGVvIGNhcmQgZHJpdmVycy4AJmUvY2xpZW50OiAmY1dpZHRoIGFuZCBoZWlnaHQgbXVzdCBiZSBpbnRlZ2Vycy4AVGV4dHVyZSBwYWNrcyBjYW4gcGxheSBhIHZpdGFsIHJvbGUgaW4gdGhlIGxvb2sgYW5kIGZlZWwgb2YgbWFwcy4AJmVNb3ZlcyB5b3UgdG8gdGhlIGdpdmVuIGNvb3JkaW5hdGVzLgAmZUNvdWxkIG5vdCBwYXJzZSBjb29yZGluYXRlcy4AJmUvY2xpZW50IHRlbGVwb3J0OiAmY1lvdSBkaWRuJ3Qgc3BlY2lmeSBYLCBZIGFuZCBaIGNvb3JkaW5hdGVzLgBCb3RoIGRlZmF1bHQuemlwIGFuZCBjbGFzc2ljdWJlLnppcCBhcmUgbWlzc2luZywKIHRyeSBkb3dubG9hZGluZyByZXNvdXJjZXMgZmlyc3QuCgpWb3hlbENyYWZ0IHdpbGwgc3RpbGwgcnVuLCBidXQgd2l0aG91dCBhbnkgdGV4dHVyZXMuACZlTm9uZTogJmZObyBlbnRpdHkgc2hhZG93cyBhcmUgZHJhd24uCiZlU25hcFRvQmxvY2s6ICZmQSBzcXVhcmUgc2hhZG93IGlzIHNob3duIG9uIGJsb2NrIHlvdSBhcmUgZGlyZWN0bHkgYWJvdmUuCiZlQ2lyY2xlOiAmZkEgY2lyY3VsYXIgc2hhZG93IGlzIHNob3duIGFjcm9zcyB0aGUgYmxvY2tzIHlvdSBhcmUgYWJvdmUuCiZlQ2lyY2xlQWxsOiAmZkEgY2lyY3VsYXIgc2hhZG93IGlzIHNob3duIHVuZGVybmVhdGggYWxsIGVudGl0aWVzLgAmZUNvb3JkaW5hdGVzIGFyZSBvdXRzaWRlIHRoZSB3b3JsZCBib3VuZGFyaWVzLgAmZS9jbGllbnQ6IFR5cGUgJmEvY2xpZW50ICZlZm9yIGEgbGlzdCBvZiBjb21tYW5kcy4AUmVtb3ZlZCAmZSVpICZmZGVuaWVkIHRleHR1cmUgcGFjayBVUkxzLgAmZS9jbGllbnQ6ICZmUmVuZGVyIHR5cGUgaXMgbm93ICVzLgAmZVRoaXMgY29tbWFuZCBjYW4gb25seSBiZSB1c2VkIGluIG11bHRpcGxheWVyLgAmZS9jbGllbnQ6ICImZiVzJmUiIGNhbiBvbmx5IGJlIHVzZWQgaW4gc2luZ2xlcGxheWVyLgAmZUNsYXNzaWM6ICZmVHdvIGxldmVscyBvZiBsaWdodCwgc3VuIGFuZCBzaGFkb3cuCiAgICBHb29kIGZvciBwZXJmb3JtYW5jZS4KJmVGYW5jeTogJmZCcmlnaHQgYmxvY2tzIGNhc3QgYSBtdWNoIHdpZGVyIHJhbmdlIG9mIGxpZ2h0CiAgICBNYXkgaGVhdmlseSByZWR1Y2UgcGVyZm9ybWFuY2UuCiZjTm90ZTogJmVJbiBtdWx0aXBsYXllciwgdGhpcyBvcHRpb24gbWF5IGJlIGNoYW5nZWQgb3IgbG9ja2VkIGJ5IHRoZSBzZXJ2ZXIuACZjU29mdHdhcmUgcmVuZGVyaW5nIGlzIGJlaW5nIHVzZWQsIHBlcmZvcm1hbmNlIHdpbGwgZ3JlYXRseSBzdWZmZXIuAE5vdCBlbm91Z2ggZnJlZSBtZW1vcnkgdG8gam9pbiB0aGF0IG1hcC4KVHJ5IGpvaW5pbmcgYSBkaWZmZXJlbnQgbWFwLgBOb3QgZW5vdWdoIGZyZWUgbWVtb3J5IHRvIGxvYWQgdGhlIG1hcC4KVHJ5IGpvaW5pbmcgYSBkaWZmZXJlbnQgbWFwLgAmY0ZhaWxlZCB0byBnZW5lcmF0ZSB0aGUgbWFwLgAmZUlmICZmT0ZGJmUsIHlvdSB3aWxsIGltbWVkaWF0ZWx5IHN0b3Agd2hlbiBpbiBub2NsaXAKJmVtb2RlIGFuZCBubyBtb3ZlbWVudCBrZXlzIGFyZSBoZWxkIGRvd24uACZlICB3aWxsIHJlcGVhdGVkbHkgcmVwbGFjZSwgd2l0aG91dCBuZWVkaW5nIHRvIGJlIHR5cGVkIGluIGFnYWluLgAmZSAgd2lsbCByZXBlYXRlZGx5IGN1Ym9pZCwgd2l0aG91dCBuZWVkaW5nIHRvIGJlIHR5cGVkIGluIGFnYWluLgAmY1ZTeW5jIG1heSBhbHNvIG5vdCB3b3JrLgAmZUNvdWxkIG5vdCBwYXJzZSBibG9jay4AJmVJZiBubyBibG9jayBpcyBnaXZlbiwgdXNlcyB5b3VyIGN1cnJlbnRseSBoZWxkIGJsb2NrLgAmZUlmIG5vIFtyZXBsYWNlbWVudF0gaXMgZ2l2ZW4sIHJlcGxhY2VzIHdpdGggeW91ciBjdXJyZW50bHkgaGVsZCBibG9jay4AJmNUaGUgc2VydmVyIGhhcyBmb3JiaWRkZW4geW91IGZyb20gY2hhbmdpbmcgeW91ciBoZWxkIGJsb2NrLgAmZUlmICZmT04mZSwgdGhlbiB0aGUgdGhpcmQgcGVyc29uIGNhbWVyYXMgd2lsbCBsaW1pdAomZXRoZWlyIHpvb20gZGlzdGFuY2UgaWYgdGhleSBoaXQgYSBzb2xpZCBibG9jay4AJmUlYzogJmZQbGFjZSBvciBkZWxldGUgYSBibG9jay4AJmNFcnJvciBsb2FkaW5nICVzIGZyb20gdGhlIHRleHR1cmUgcGFjay4AJmNVbmFibGUgdG8gdXNlICVzIGZyb20gdGhlIHRleHR1cmUgcGFjay4AJmNVbmFibGUgdG8gdXNlIHRlcnJhaW4ucG5nIGZyb20gdGhlIHRleHR1cmUgcGFjay4AJmNIZWlnaHQgb2YgdGVycmFpbi5wbmcgaXMgbGVzcyB0aGFuIGl0cyB3aWR0aC4AJmVJZiAmZk9OJmUsIHBsYWNpbmcgYmxvY2tzIHRoYXQgaW50ZXJzZWN0IHlvdXIgb3duIHBvc2l0aW9uIGNhdXNlCiZldGhlIGJsb2NrIHRvIGJlIHBsYWNlZCwgYW5kIHlvdSB0byBiZSBtb3ZlZCBvdXQgb2YgdGhlIHdheS4KJmZUaGlzIGlzIG1haW5seSB1c2VmdWwgZm9yIHF1aWNrIHBpbGxhcmluZy90b3dlcmluZy4AJmVOb25lOiAmZk5vIG5hbWVzIG9mIHBsYXllcnMgYXJlIGRyYXduLgomZUhvdmVyZWQ6ICZmTmFtZSBvZiB0aGUgdGFyZ2V0ZWQgcGxheWVyIGlzIGRyYXduIHNlZS10aHJvdWdoLgomZUFsbDogJmZOYW1lcyBvZiBhbGwgb3RoZXIgcGxheWVycyBhcmUgZHJhd24gbm9ybWFsbHkuCiZlQWxsSG92ZXJlZDogJmZBbGwgbmFtZXMgb2YgcGxheWVycyBhcmUgZHJhd24gc2VlLXRocm91Z2guCiZlQWxsVW5zY2FsZWQ6ICZmQWxsIG5hbWVzIG9mIHBsYXllcnMgYXJlIGRyYXduIHNlZS10aHJvdWdoIHdpdGhvdXQgc2NhbGluZy4AJmVTZXRzIGhvdyBtYW55IGJsb2NrcyBoaWdoIHlvdSBjYW4ganVtcCB1cC4KJmVOb3RlOiBZb3UganVtcCBtdWNoIGhpZ2hlciB3aGVuIGhvbGRpbmcgZG93biB0aGUgU3BlZWQga2V5IGJpbmRpbmcuACZjVGhlIGdlbmVyYXRlZCBtYXAncyB2b2x1bWUgaXMgdG9vIGJpZy4ATm90IGVub3VnaCBmcmVlIG1lbW9yeSB0byBnZW5lcmF0ZSBhIG1hcCB0aGF0IGxhcmdlLgpUcnkgYSBzbWFsbGVyIHNpemUuACZjIEl0cyBzaXplIGlzICglaSwlaSksIHdoaWNoIGlzIG5vdCBhIHBvd2VyIG9mIHR3byBzaXplLgAmYyBTb21lIHRpbGVzIHdpbGwgdGhlcmVmb3JlIGFwcGVhciBjb21wbGV0ZWx5IHdoaXRlLgAmZS9jbGllbnQ6ICZjWW91IGRpZG4ndCBzcGVjaWZ5IGEgbmV3IHJlbmRlciB0eXBlLgAmZS9jbGllbnQgc2tpbjogJmNZb3UgZGlkbid0IHNwZWNpZnkgYSBza2luIG5hbWUuACZlL2NsaWVudCBtb2RlbDogJmNZb3UgZGlkbid0IHNwZWNpZnkgYSBtb2RlbCBuYW1lLgAlYy4gJmVQcmVzcyAmYSVjICZldG8gZGlzYWJsZS4AJWMuICZlUHJlc3MgJmElYyAmZXRvIHJlLWVuYWJsZS4AIGhhdmUgdmlydXNlcywgb3IgdGhpbmdzIHlvdSBtYXkgbm90IHdhbnQgdG8gb3Blbi9zZWUuACZjIEl0IG11c3QgYmUgMTYgb3IgbW9yZSBwaXhlbHMgd2lkZS4AJmVTbW9vdGggbGlnaHRpbmcgc21vb3RocyBsaWdodGluZyBhbmQgYWRkcyBhIG1pbm9yIGdsb3cgdG8gYnJpZ2h0IGJsb2Nrcy4KJmNOb3RlOiAmZVRoaXMgc2V0dGluZyBtYXkgcmVkdWNlIHBlcmZvcm1hbmNlLgAmY1lvdSBtYXkgZXhwZXJpZW5jZSBzaWduaWZpY2FudGx5IHJlZHVjZWQgcGVyZm9ybWFuY2UuACZlRGlzcGxheXMgdGhlIGhlbHAgZm9yIHRoZSBnaXZlbiBjb21tYW5kLgAmY09uZSBvZiB0aGUgbWFwIGRpbWVuc2lvbnMgaXMgaW52YWxpZC4AJmUlYzogJmMiJXMiIGlzIG5vdCBhIHZhbGlkIGJsb2NrIG5hbWUgb3IgaWQuACZlSWYgJmZPTiZlLCBnaXZlcyB5b3UgYSB0cmlwbGUganVtcCB3aGljaCBpbmNyZWFzZXMgc3BlZWQgbWFzc2l2ZWx5LAomZWFsb25nIHdpdGggb2xkZXIgbm9jbGlwIHN0eWxlLiBUaGlzIGlzIGJhc2VkIG9uIHRoZSAiV29ybGQgb2YgTWluZWNyYWZ0IgomZWNsYXNzaWMgY2xpZW50IG1vZCwgd2hpY2ggcG9wdWxhcml6ZWQgaGFja3MgY29udmVudGlvbnMgYW5kIGNvbnRyb2xzCiZlYmVmb3JlIENsYXNzaUN1YmUgd2FzIGNyZWF0ZWQuACZlSWYgbm8gYmxvY2sgaXMgcHJvdmlkZWQsIGhlbGQgYmxvY2sgaXMgdXNlZC4AJmUgY29vcmRpbmF0ZXMgYXJlIHVzZWQuAHQgPiAxIGluIHBoeXNpY3MgY2FsY3VsYXRpb24uLiB0aGlzIHNob3VsZG4ndCBoYXZlIGhhcHBlbmVkLgAmZS9jbGllbnQ6ICZjVW5yZWNvZ25pc2VkIHJlbmRlciB0eXBlICZmIiVzIiZjLgAmZUNoYW5nZSB0aGUgc21vb3RobmVzcyBvZiB0aGUgc21vb3RoIGNhbWVyYS4AJmVQbGFjZXMgYmxvY2sgYXQgW3ggeSB6XS4AJmVSZXBsYWNlcyBhbGwgW3NvdXJjZV0gYmxvY2tzIGJldHdlZW4gdHdvIHBvaW50cyB3aXRoIFtyZXBsYWNlbWVudF0uACZlRmlsbHMgdGhlIDNEIHJlY3RhbmdsZSBiZXR3ZWVuIHR3byBwb2ludHMgd2l0aCBbYmxvY2tdLgAmZURpc3BsYXlzIGluZm9ybWF0aW9uIGFib3V0IHlvdXIgR1BVLgAmZURpc3BsYXlzIHRoZSBzZXJ2ZXIncyBuYW1lIGFuZCBNT1RELgAmZSVjOiAmZk1hcmsgMSBwbGFjZWQgYXQgKCVpLCAlaSwgJWkpLCBwbGFjZSBtYXJrIDIuACZlL2NsaWVudDogJmNXaWR0aCBhbmQgaGVpZ2h0IG11c3QgYmUgYWJvdmUgMC4AS2V5OiBwcmVzcyBhIGtleS4uAE1vZGlmaWVyczogcHJlc3MgYSBrZXkuLgBTYXZlIGxldmVsLi4ATG9hZCBsZXZlbC4uACZlUmV0cmlldmluZyB0ZXh0dXJlIHBhY2suLgBDb25uZWN0aW5nIHRvICVzOiVpLi4AR2VuZXJhdGluZy4uACZjT3V0IG9mIFZSQU0hIEhhbHZpbmcgdmlldyBkaXN0YW5jZS4uACAgJmNGYWxsaW5nIGJhY2sgdG8gY2FjaGluZyB0byBnYW1lIGZvbGRlciBpbnN0ZWFkLi4ATmV3IGhvdGtleS4uLgBMb2FkIGZvbnQuLi4ASG90a2V5cy4uLgBDaGF0IG9wdGlvbnMuLi4AR3JhcGhpY3Mgb3B0aW9ucy4uLgBHdWkgb3B0aW9ucy4uLgBNaXNjIG9wdGlvbnMuLi4ATm9zdGFsZ2lhIG9wdGlvbnMuLi4AT3B0aW9ucy4uLgBDb250cm9scy4uLgBFbnYgc2V0dGluZ3MuLi4ASGFja3Mgc2V0dGluZ3MuLi4AR2VuZXJhdGUgbmV3IGxldmVsLi4uAFNhdmUgbGV2ZWwuLi4ATG9hZCBsZXZlbC4uLgBDaGFuZ2UgdGV4dHVyZSBwYWNrLi4uAERvd25sb2FkIHNpemU6IERldGVybWluaW5nLi4uACZlU3VjY2Vzc2Z1bGx5IHBsYWNlZCAlcyBibG9jayBhdCAoJWksICVpLCAlaSkuACZlJWM6ICZjVGhlcmUgaXMgbm8gYmxvY2sgd2l0aCBpZCAiJXMiLgAmZVRoZXJlIGlzIG5vIGJsb2NrIHdpdGggaWQgIiVpIi4AJmUvY2xpZW50OiBNdWx0aXBsZSBjb21tYW5kcyBmb3VuZCB0aGF0IHN0YXJ0IHdpdGg6ICImZiVzJmUiLgAmZS9jbGllbnQ6IFVucmVjb2duaXNlZCBjb21tYW5kOiAiJmYlcyZlIi4AaG90a2V5LQAtLS0AJmNDdXJyZW50IHRleHR1cmUgcGFjayBzcGVjaWZpZXMgaXQgdXNlcyBhbmltYXRpb25zLAAgKwAmNyhFbnRlciB0ZXh0KQAlYyAoJXMpACY3KGFuIGludGVnZXIpACZlUnVubmluZyBpbiByZWR1Y2VkIHBlcmZvcm1hbmNlIG1vZGUgKGdhbWUgbWluaW1pc2VkIG9yIGhpZGRlbikAICY3KHBhZ2UgJWkvJWkpAElnbm9yaW5nIGludmFsaWQgcmVxdWVzdCAoJWkpACAgICZjQmxvY2tzIGFycmF5IHNpemUgKCVpKSBkb2VzIG5vdCBtYXRjaCB2b2x1bWUgb2YgbWFwICglaSkAJjcoJWkgLSAlaSkAJjcoRW50ZXIgbmFtZSkAJmVCbG9ja0VkaXQ6ICZlVW5rbm93biBwcm9wZXJ0eSAlcyAmZShTZWUgJmEvY2xpZW50IGhlbHAgYmxvY2tlZGl0JmUpACZlQmxvY2tFZGl0OiAmZVRocmVlIGFyZ3VtZW50cyByZXF1aXJlZCAmZShTZWUgJmEvY2xpZW50IGhlbHAgYmxvY2tlZGl0JmUpAFNlcnZlciBzZW50IGNvcnJ1cHRlZCBtYXAgZGF0YSAoZXJyb3IgJWUpAE91dCBvZiBtZW1vcnkhICh3aGVuIGFsbG9jYXRpbmcgJWMpAFNlcnZlciBzZW50IGludmFsaWQgcGFja2V0ICViISAocHJldiAlYikAQWRkaW5nICVzICh0eXBlICViKQAmZUJsb2NrRWRpdDogJmMzIHZhbHVlcyBhcmUgcmVxdWlyZWQgZm9yIGEgY29vcmRpbmF0ZSAoWCBZIFopACY3KCMwMDAwMDAgLSAjRkZGRkZGKQBPdXQgb2YgdmlkZW8gbWVtb3J5ISAoYWxsb2NhdGluZyBzdGF0aWMgVkIpAE91dCBvZiB2aWRlbyBtZW1vcnkhIChhbGxvY2F0aW5nIGR5bmFtaWMgVkIpACY3KCVmMiAtICVmMikAU29tZXRoaW5nIHdlbnQgd3JvbmcsIGRpZCBvdmVyIDI1LDAwMCBpdGVyYXRpb25zIGluIFBpY2tpbmdfUmF5VHJhY2UoKQAwMTIzNDU2Nzg5LSwgKCkAJmVEb3dubG9hZGluZyB0ZXh0dXJlIHBhY2sgKCY3JWkmZSUlKQBFcnJvciAlZSB3aGVuICVjICclcycAWW91IGZhaWxlZCB0byBjb25uZWN0IHRvIHRoZSBzZXJ2ZXIuIEl0J3MgcHJvYmFibHkgZG93biEAJmVWU3luYzogJmZOdW1iZXIgb2YgZnJhbWVzIHJlbmRlcmVkIGlzIGF0IG1vc3QgdGhlIG1vbml0b3IncyByZWZyZXNoIHJhdGUuCiZlMzAvNjAvMTIwLzE0NCBGUFM6ICZmUmVuZGVycyAzMC82MC8xMjAvMTQ0IGZyYW1lcyBhdCBtb3N0IGVhY2ggc2Vjb25kLgomZU5vTGltaXQ6ICZmUmVuZGVycyBhcyBtYW55IGZyYW1lcyBhcyBwb3NzaWJsZSBlYWNoIHNlY29uZC4KJmNOb0xpbWl0IGlzIHBvaW50bGVzcyAtIGl0IHdhc3RlZnVsbHkgcmVuZGVycyBmcmFtZXMgdGhhdCB5b3UgZG9uJ3QgZXZlbiBzZWUhAERpc2Nvbm5lY3RlZCEAIChnb3QgAC9jbGllbnQgACVzIABCYW5uZWQgAEtpY2tlZCAAWyVwMjolcDI6JXAyXSAAPiAAS2V5OiAAJmUlaSBtYXRjaGluZyBuYW1lczogAFBvc2l0aW9uOiAASW5wdXQgc3RheXMgb3BlbjogAFNjYWxlOiAAR1BVOiAAbG9ncy8lcDQtJXAyLSVwMiAAJWkgZnBzLCAAJWYxIGZwcywgACVpIGNodW5rcy9zLCAAKGxvdyBwZXJmIG1vZGUpLCAAICsgAFpvb20gZm92ICVpICAAU3BlZWQgJWYxeCAgIABGbHkgT04gICAATm9jbGlwIE9OICAgAB8AHgB2b2lkIG1haW4oKSB7CgBEZXB0aCBidWZmZXIgYml0czogJWkKACVoCgBWaWRlbyBtZW1vcnk6ICVmMiBNQiB0b3RhbCwgJWYyIGZyZWUKAEVycm9yIGNvbm5lY3RpbmcgdG8gJXM6JWk6ICVlCgBFcnJvciByZWFkaW5nIGZyb20gJXM6JWk6ICVlCgBWZW5kb3I6ICVjCgBSZW5kZXJlcjogJWMKAFJlYXNvbjogJWMKAEdMIHZlcnNpb246ICVjCgBNYXggdGV4dHVyZSBzaXplOiAoJWksICVpKSwgdXAgdG8gJWYzIE1CCgB1bmlmb3JtIGZsb2F0IGZvZ0RlbnNpdHk7CgAgIGZsb2F0IGRlcHRoID0gMS4wIC8gZ2xfRnJhZ0Nvb3JkLnc7CgB2YXJ5aW5nIHZlYzIgb3V0X3V2OwoAICBvdXRfdXYgID0gaW5fdXY7CgBhdHRyaWJ1dGUgdmVjMiBpbl91djsKAHVuaWZvcm0gdmVjMiB0ZXhPZmZzZXQ7CgAgIG91dF91diAgPSBvdXRfdXYgKyB0ZXhPZmZzZXQ7CgBwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDsKAHByZWNpc2lvbiBoaWdocCBmbG9hdDsKAGF0dHJpYnV0ZSB2ZWMzIGluX3BvczsKAHVuaWZvcm0gbWF0NCBtdnA7CgAgIHZlYzQgY29sID0gb3V0X2NvbDsKAHZhcnlpbmcgdmVjNCBvdXRfY29sOwoAICB2ZWM0IGNvbCA9IHRleHR1cmUyRCh0ZXhJbWFnZSwgb3V0X3V2KSAqIG91dF9jb2w7CgAgIG91dF9jb2wgPSBpbl9jb2w7CgBhdHRyaWJ1dGUgdmVjNCBpbl9jb2w7CgAgIGdsX0ZyYWdDb2xvciA9IGNvbDsKAHVuaWZvcm0gdmVjMyBmb2dDb2w7CgB1bmlmb3JtIHNhbXBsZXIyRCB0ZXhJbWFnZTsKACAgaWYgKGNvbC5hIDwgMC41KSBkaXNjYXJkOwoAdW5pZm9ybSBmbG9hdCBmb2dFbmQ7CgAgIGZsb2F0IGdyYXkgPSAwLjIxICogY29sLnIgKyAwLjcxICogY29sLmcgKyAwLjA3ICogY29sLmI7CgAgIGNvbC5yZ2IgPSBtaXgoZm9nQ29sLCBjb2wucmdiLCBmKTsKACAgY29sID0gdmVjNChncmF5LCBncmF5LCBncmF5LCBjb2wuYSk7CgAgIGdsX1Bvc2l0aW9uID0gbXZwICogdmVjNChpbl9wb3MsIDEuMCk7CgAgIGZsb2F0IGYgPSBjbGFtcCgxLjAgLSBkZXB0aCAqIGZvZ0VuZCwgMC4wLCAxLjApOwoAICBmbG9hdCBmID0gY2xhbXAoZXhwKGZvZ0RlbnNpdHkgKiBkZXB0aCksIDAuMCwgMS4wKTsKAENsYXNzaUN1YmUgY3Jhc2hlZC4KAC0tIHJlZ2lzdGVycyAtLQoALS0gYmFja3RyYWNlIC0tCgAtLSBVc2luZyBPcGVuR0wgTW9kZXJuICglaSBiaXQpIC0tCgBNYXggdGV4dHVyZSBzaXplOiAoJWksICVpKQoAUGxlYXNlIHJlcG9ydCB0aGlzIG9uIHRoZSBDbGFzc2lDdWJlIGZvcnVtcyBvciBEaXNjb3JkLgoKAEZ1bGwgZGV0YWlscyBvZiB0aGUgY3Jhc2ggaGF2ZSBiZWVuIGxvZ2dlZCB0byAnY2xpZW50LmxvZycuCgo=");l(e,29952,"AgIBAgIDBAIDBAIBAQICAQIEAwIEAwICAQIDAQQDAwQBAwIB/wAA/wAA//8A/wD/iVBORw0KGgoBAAMBAgAEABIAAAATAAAAEgAAABQAAAASAAAAEgAAABIAAAAVAAAAFgAAABcAAAAWAAAAGAAAABYAAAAWAAAAFgAAABkAAAAiGwAAAAAAEAAAAAAAAABkBAAAANI1AAABAQEQAAAAAAAAAWQAAgQEdREAAAADAhAAAAAAAAABZAACAwPnCgAAAgICEAAAAAAAAAFkAAICArw1AAAQEBAQAAAAAAAAAWQAAgQEgDsAAAQEBBAAAAAAAAABZAACAQG+LwAADw8PEAAAAAAAAABkBQADAM8mAAAREREQAAAAAAAAAWQAAgQEYBwAAA4ODhAFBTP/CgABZAMFAAAxHAAADg4OEAUFM/8KAAFkAwUAAMhDAAAeHh4QmRkA/7QPAWQABgAAr0MAAB4eHhCZGQD/tA8BZAAGAACXPAAAEhISEAAAAAAAAAFkAAIICF8mAAATExMQAAAAAAAAAWQAAgIC8TQAACAgIBAAAAAAAAABZAACBAS9NAAAISEhEAAAAAAAAAFkAAIEBNc0AAAiIiIQAAAAAAAAAWQAAgQEbywAABUUFRAAAAAAAAABZAACAQFEFQAAFhYWEAAAAAAAAAAoAgIDA/o3AAAwMDAQAAAAAAAAAVoAAgMDhhEAADExMRAAAAAAAAAAZAECBgXSQQAAQEBAEAAAAAAAAAFkAAIHBwE4AABBQUEQAAAAAAAAAWQAAgcHewcAAEJCQhAAAAAAAAABZAACBwdYNgAAQ0NDEAAAAAAAAAFkAAIHB1skAABEREQQAAAAAAAAAWQAAgcHriYAAEVFRRAAAAAAAAABZAACBwfNQwAARkZGEAAAAAAAAAFkAAIHB2EkAABHR0cQAAAAAAAAAWQAAgcHCTIAAEhISBAAAAAAAAABZAACBwf/IAAASUlJEAAAAAAAAAFkAAIHB68OAABKSkoQAAAAAAAAAWQAAgcH0kMAAEtLSxAAAAAAAAABZAACBwfKJgAATExMEAAAAAAAAAFkAAIHB1wqAABNTU0QAAAAAAAAAWQAAgcHIgcAAE5OThAAAAAAAAABZAACBwdUMgAAT09PEAAAAAAAAAFkAAIHB28jAAANDQ0QAAAAAAAAAGQFAAMAnzMAAAwMDBAAAAAAAAAAZAUAAwDGJAAAHR0dEAAAAAAAAABkBQADANUkAAAcHBwQAAAAAAAAAGQFAAMAtTwAABgoOBAAAAAAAAABZAACBQU7IgAAFyc3EAAAAAAAAAFkAAIFBU5DAAAGBQYQAAAAAAAAAWQAAgQEWkMAAAYFBggAAAAAAAABZAACBARVKQAABwcHEAAAAAAAAAFkAAIEBMFGAAAJCAoQAAAAAAAAAWQAAgMDVzEAAAQjBBAAAAAAAAABZAACAQHrEwAAJCQkEAAAAAAAAAFkAAIEBHYkAAAlJSUQAAAAAAAAAWQAAgQEPUMAABAQEAgAAAAAAAABZAACBASQNQAACwsLEAAAAAAAAABkBQcHB8g1AAAZKTkQAAAAAAAAAWQAAgQEdgcAADIyMgQAAAAAAAABZAAACQn6NAAAJiYmEAAAAAAADwBkBQABAL8mAABQUFAQAAAAAAAAAWQAAgcH6yMAAFFRURAAAAAAAAABZAACBwdeIQAAUlJSEAAAAAAAAAFkAAIHB/ExAABTU1MQAAAAAAAAAWQAAgcHsDMAAFRUVBAAAAAAAAABZAACBwfdOgAAMzMzEAAAAAAAAAFkAwMEBKk2AAA2NjYQAAAAAAAAAWQAAgQEV0QAAFZWVhAAAAAAAAoBZAACBAQQHgAAGio6EAAAAAAAAAFkAAIEBMEyAAA1NTUQAAAAAAAAAWQAAgEBSSkAADQ0NBAAAAAAAAABZAACBATZPAAAAAAAEAAAAAAAAAFkAAIAAAAAAAAHDhwAwIEDB/8BAAAAAPwHSZIkASRJkgT4FAAABAAEANhuAAAIAAgAqAsAAAcABwBAFQAAAwAD");l(e,31488,"CAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwgICAgICAgIBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUQERIACAcJBgoFCwQMAw0CDgEP");l(e,31848,"AQEBAQICAgIDAwMDBAQEBAUFBQUAAAAAAwAEAAUABgAHAAgACQAKAAsADQAPABEAEwAXABsAHwAjACsAMwA7AEMAUwBjAHMAgwCjAMMA4wACAQ==");l(e,31940,"AQECAgMDBAQFBQYGBwcICAkJCgoLCwwMDQ0AAAEAAgADAAQABQAHAAkADQARABkAIQAxAEEAYQCBAMEAAQGBAQECAQMBBAEGAQgBDAEQARgBIAEwAUABYAAAAAADAAQABQAGAAcACAAJAAoACwANAA8AEQATABcAGwAfACMAKwAzADsAQwBTAGMAcwCDAKMAwwDjAAIB//8AAAAAAQACAAMABAAFAAcACQANABEAGQAhADEAQQBhAIEAwQABAYEBAQIBAwEEAQYBCAEMARABGAEgATABQAFg//8AABcNAAAsACwAgzkAAC0ALQB4IAAALQAt");l(e,32206,"gD8AAIA/");l(e,32227,"/wAAv/8AvwD/AL+//78AAP+/AL//v78A/7+/v/9AQED/QED//wAAAAAAAAAAQP9A/0D/////QED//0D/////QP//////AAAAAAAAAAAINgAAdT4AAMMlAAByPgAACEE=");l(e,32336,"CDYAAOIoAADdNgAAvSUAAMA8AAAIAAgAAACAPAAAAAAAAIA8iAAAAIkAAACKAAAAiwAAAIwAAACNAAAA0igAAAUABQCSAAAAiQAAAJMAAACLAAAAlAAAAJU=");l(e,32434,"gL8AAIC/AACAvwAAAAAAAIA+AACAPwAAgD8AAIC/AACAvwAAAAAAAAA/AACAPwAAgD8AAIA/AACAvwAAAAAAAAA/AAAAPwAAgL8AAIA/AACAvwAAAAAAAIA+AAAAPwAAgL8AAIC/AACAPw==");l(e,32550,"gD8AAIC/AACAvwAAgL8AAAAAAACAPgAAgD8AAIC/AACAPwAAgL8AAAAAAACAPgAAAD8AAIC/AACAPwAAgD8=");l(e,32623,"PwAAgD8AAIC/AACAPwAAAAAAAEA/AACAPwAAgL8AAIC/AACAPwAAAAAAAIA/AACAPwAAgL8AAIA/AACAPwAAAAAAAIA/AAAAPwAAgD8AAIA/AACAPwAAAAAAAEA/AAAAPwAAgD8AAIC/AACAvwAAAAAAAAA/AACAPwAAgD8AAIC/AACAPwAAAAAAAEA/AACAPwAAgD8AAIA/AACAPwAAAAAAAEA/AAAAPwAAgD8AAIA/AACAvwAAAAAAAAA/AAAAPwAAgD8AAIA/AACAvwAAAAAAAAA/AAAAPwAAgD8AAIA/AACAPwAAAAAAAAA/AAAAAAAAgL8AAIA/AACAPwAAAAAAAIA+AAAAAAAAgL8AAIA/AACAvwAAAAAAAIA+AAAAPwAAgD8AAIC/AACAvwAAAAAAAEA/AAAAPwAAgD8AAIC/AACAPwAAAAAAAEA/AAAAAAAAgL8AAIC/AACAPwAAAAAAAAA/AAAAAAAAgL8AAIC/AACAvwAAAAAAAAA/AAAAP2VzLThSweA/b0gQebB/mL9i2J8+JH41P6yVxRop9cG+o8FHaiKBQT6HA2AGMji2vQAAAAAnG7eIAqztAAUAAABJAAAAyysAAJxeHABJAAAAqSsAAKBeHABJAAAAVw0AAKReHABJAQAA7yEAAFS7DABJAQAA6CEAAFi7DABJAQAA4SEAAFy7DABbAAAAehQAAAAAAAB4cA==");l(e,33168,"LCcMAAshGQMdHBQqMSQFAScpAAAFAAU=");l(e,33201,"AQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEEAAAAAJyQkCi4VFhYWFgQAFhUAFhcYFhobHB4fICEiIyQWFDEtAQQACQsEEwURCjEUARIMBRkuLBExFAESDAUZJCIACQsuLAAJCwgKFhsWCAocETEUARIMBRkuLAsJAAkLowAACQsAAAAAAAAAHBYVCwAAAC4uCgouFCkqCwkACAoKCAAWFg==");l(e,33411,"FQoAAAAAABYWKgMCHS8AAAAAABsuMBgWJCIIChUdFgoWFikTIxUdMSIQKQAWEkIAAHBHAABlRwAAe0cAAFlHAADuNQAACAAgAIAAAAIIABAAIABAAIAAAAEAAgAEAAgAEFVVBUJVVYVBVVUFQeQ43kAcUwAAAR8HQQoqAAAAAAAAbIMAANoeAAAcUwAAAB4HMQkqAACAgwAAbIMAANoeAACTRAAAAB0GKQggAACwgwAAbIMAAAcfAACDRAAAABwFFAYLAADQgwAAbIMAAAcfAACLRAAAABsEEgYJAADbgwAAbIMAAAcfAAABBC0DBRESFCw=");l(e,33664,"AQQtAwUREhQsMAYlJicoDA0TFRYXGBkaGxwdHh8gISIjJBAPDiopLy4xAAAAAAAAAQQDBRESBiUmJygMDRQTKRUWFxgZGhscHR4fICEiIyQBBAMFERIGDA0UEwEEAwUREgYMDVSDAAA8gwAAJIMAAAyDAADIAAAAyQAAAMoAAADLAAAAN2oAAEAAQAAQAAAAGAAAAPFJAAASSgAAaE0AABsAGwCjTQAAHQAdAIRNAAAeAB4AGCEAABYAFg==");l(e,33864,"6w==");l(e,33888,"CDYAAOlSAAC8UQAAaVAAAHxPAACeTgAAXU4AAPBNAABdTQAAI00AACVTAAD4UgAA6FEAAHhQAACLTwAAqU4AAGhOAAAQTgAAzE0AADlNAAAhUwAA9FIAAORRAAB0UAAAh08AAH05AAC/EAAAxRAAAEYOAADFDQAA9SsAAEAiAABOMgAAUUQAAIU7AADxKwAAPA4AALoNAABlDgAA5w0AADQOAACxDQAAXQ4AAN4NAAB1IAAAuCEAAIkOAAAODgAABFMAADhSAADXUAAAzk8AAOFOAAB0TgAAM04AANhNAABFTQAAC00AAOwKAACTMgAAUzYAAJ88AABpIAAAqiEAAFYIAADiSgAAykoAAKdKAACWSgAANUoAAKlJAAClSQAAYkkAADtJAAAzSQAAMUkAAAtJAAB4SAAAdkgAADBIAAAuSAAA70cAAO1HAADKRwAAREcAAJJGAACKRgAAdEYAAGlGAABjRgAARUYAACscAAC1NQAApzoAAKM6AABfQwAALSkAAD4pAABPJAAAkjMAADYpAAAMUwAAzVIAAKtRAABYUAAAa08AAI1OAABMTgAA6E0AAFVNAAAbTQAAxDkAAD4GAAAXDwAA1kEAAJomAAAlHAAAU1IAAP5QAABiMwAAVzMAAGwzAABRIAAAjCEAAHEOAAD0DQAA3k8AAPFOAACETgAAQ04AAC8yAABgIAAAnyEAAFMfAACZCQAAOAgAADwHAACBHgAALAgAAI0JAADiKwAAdR4AABMsAAB2FQAATDYAANMlAABtRAAASFIAAB1CAADMSgAAqUoAAGVGAABHRgAAekgAAMxHAABBRgAAmEoAADdKAAADRwAA1UYAAPFHAAAySAAAt0YAADJHAACASAAA0kcAACNJAAAYSQAAFkcAAOpGAAAJSAAAUEgAAFcAUwBBAEQAXQBSAFsAVABCAEYAWwBfACQAWABaAFEARQAoAAMADAALAAUAAQAHAEMAJgB3AHkAeAAGACgACABHAAo=");l(e,34654,"MQAyADMANAA1ADYANwA4ADk=");l(e,34688,"oAChAJ4AnwCVAAAAogCYAJcAAACiAAAAlpmWl5aalqCWoQ==");l(e,34740,"mQAAAJo=");l(e,34784,"pACl");l(e,34800,"eDsAAGoqAACJDgAADg4AAIseAADPIQAA9iEAAP0PAABpBQAAeiwAAPkPAACkCgAAx0EAADgfAABXBgAASyAAAIQhAADGCQAAUUcAAPMKAAAcJAAALyIAADVJAABiFgAAxi8AAMNBAAD4KAAA7igAABgpAACmMgAA5S8AADVEAADYKAAAMgcAAA0YAABZIAAAliEAAP8NAAB7DgAAQFIAAN9QAADWTwAA6U4AAHxOAAA7TgAA4E0AAE1NAAATTQAAUg4AANIN");l(e,35010,"gD4AAAA/AACAPwAAAEAAAIBABA==");l(e,35040,"8QAAAKAAAAChAAAAngAAAJ8AAACiAAAAlQAAAKIAAAAAAAAAow==");l(e,35088,"lwAAAKhC");l(e,35105,"XDEyMzQ1Njc4OTAaG15fUVdFUlRZVUlPUBwdWyZBU0RGR0hKS0wfIBkkI1pYQ1ZCTk0hIh4lAChdYAECAwQFBgcICQpkYWxtbnFpamtyZmdoZXMAAAALDA==");l(e,35204,"DQ4PEBES");l(e,35245,"cg==");l(e,35260,"dCc=");l(e,35285,"bwAAKQ==");l(e,35301,"YwA8LD4ALgAvAD0tPzo7AAAAAAAAACor");l(e,35360,"zWkAAAcABwCJQgAAoAYAAN8BAADgAQAA4QEAAOIBAADjAQAA5AEAAOUBAADmAQAA5wEAAOgBAADpAQAA6gEAAOsBAADsAQAA7QEAAO4B");l(e,35456,"TUYAAKpGAAD+SAAA60cAADICAADgAQAAMwIAADQCAADjAQAANQIAAOUBAADmAQAA5wEAAOgBAADpAQAANgIAAOsBAAA3AgAAOAIAADkCAAAAAAAAOgIAAOABAAA7AgAAPAIAAOMBAADkAQAA5QEAAOYBAADnAQAA6AEAAOkBAAA2AgAA6wEAAD0CAAA+AgAAPwIAAEACAABBAgAA4AEAAEICAAA8AgAA4wEAAOQBAADlAQAA5gEAAOcBAADoAQAA6QEAADYCAADrAQAAQwIAAD4CAABEAgAAQAIAAEUCAADgAQAARgIAADwCAADjAQAA5AEAAOUBAADmAQAA5wEAAOgBAADpAQAARwIAAOsBAABIAgAASQIAAEoCAABAAgAASwIAAEwCAABNAgAATgIAAOMBAABPAgAA5QEAAFACAABRAgAA6AEAAOkBAAA2AgAA6wEAAFICAABTAgAAVAIAAAAAAABVAgAAVgIAAE0CAAA8AgAA4wEAAOQBAADlAQAAVwIAAFgCAABZAgAA6QEAADYCAADrAQAAWgIAAFsCAABcAgAAQAIAAF0CAADgAQAAQgIAADwCAADjAQAA5AEAAOUBAADmAQAA5wEAAOgBAADpAQAANgIAAOsBAABeAgAAPgIAAF8CAABAAgAAYAIAAGECAABNAgAAPAIAAOMBAABiAgAA5QEAAGMCAABkAgAA6AEAAOkBAAA2AgAA6wEAAGUCAABmAgAAZwIAAAAAAABoAgAA4AEAAEICAAA8AgAA4wEAAOQBAADlAQAA5gEAAOcBAADoAQAA6QEAADYCAADrAQAAaQIAAD4CAABqAgAAQAIAAAABBAcGAgMICQUAAHg7AABqKgAAix4AAP0PAACVIgAAiQ4AAA4OAAC6PAAAZCwAAKMiAAAMDRkODxAAAMdBAAAxHwAAmEEAAFcGAAAzHgAAeyEAAAABBAcGCwIDCAkFCg==");l(e,36192,"eDsAAGoqAACLHgAA/Q8AANchAACMCgAAiQ4AAA4OAABpBQAAZCwAAM8hAADiDwAADA0ZGA4PEBUAAAAAAAAAAMdBAAAxHwAAmEEAALokAABXBgAAMx4AAHshAAAiIgAAERIWHiATFBcdHyEiAAAAALcJAACQRwAAhCoAANQvAADkJgAA8woAABwkAABSFgAAmjIAACdEAAAnBwAA+xcAABobHCMkJiU=");l(e,36368,"KCcAAB0nAADMKAAAcCAAALMhAACEDgAACQ4AACcoKSorLC0uLzAx");l(e,36416,"/FIAAOxRAAB8UAAAj08AAK1OAABsTgAAK04AANBNAAA9TQAAKg4AAKUMAABrAgAAbAIAAG0CAABuAgAA4wEAAG8CAADlAQAAcAIAAHECAAByAgAA6QEAAHMCAADrAQAAdAIAAHUCAAB2AgAAAAAAAHcCAADgAQAAeAIAAHkCAAB6AgAAewIAAOUBAAB8AgAAfQIAAOgBAADpAQAANgIAAOsBAAB+AgAAfwIAAIACAAAAAAAAgQIAAOABAABCAgAAPAIAAOMBAADkAQAA5QEAAOYBAADnAQAA6AEAAOkBAAA2AgAA6wEAAIICAAA+AgAAgwIAAEACAACEAgAAhQIAAEICAAA8AgAA4wEAAOQBAADlAQAA5gEAAOcBAADoAQAA6QEAADYCAADrAQAAhgIAAIcCAACIAgAAAAAAAIkCAADgAQAAQgIAADwCAADjAQAA5AEAAOUBAADmAQAA5wEAAOgBAADpAQAANgIAAOsBAACKAgAAPgIAAIsCAABAAgAAjAIAAOABAABCAgAAPAIAAOMBAADkAQAA5QEAAOYBAADnAQAA6AEAAOkBAAA2AgAA6wEAAI0CAAA+AgAAjgI=");l(e,36872,"12kAAAEAAQBg/87/SmgAACMCAABg/wAAtWgAAI8CAABg/zIA52cAABQCAACgAM7/g2gAAJACAACgAAAAp2gAAJECAACgADIAmWgAAJIC");l(e,36962,"nP9KaAAAIgIAAAAAzv+DaAAAkwIAAAAAAAAXZwAAkgIAAAAAMgAkZwAAkQIAAAAAZAA1aAAAlAIAAAAAAABg/5z/JWgAAJUCAABg/87/FmgAAPMBAABg/wAAAmgAAJYCAABg/zIAVWgAAJcCAACgAJz/8mcAAJgCAACgAM7/cWgAAJkCAACgAAAAYWgAAJoCAACgADIANWgAAJQCAACBNAAABTQAAHMQAAAQFQAATBIAACo0AABTNAAAWkIAAChCAAAKAAoAEjYAAAUABQAeIAAAM0IAAC0gAAAAAAAADggAAChCAAASNgAAAAAAABwfAAAAAAAAnRQAAAgACAAcHwAABAAEAE0xAABSMQ==");l(e,37248,"DggAAAIQAABTJQAAEjYAAA0lAADeJQAAAAAAABYSAAAEAAQAngIAAOABAACfAgAAPAIAAOMBAADkAQAA5QEAAOYBAADnAQAA6AEAAOkBAAA2AgAA6wEAAKACAAChAgAAogIAAEACAAAuTQAACgAKAJMxAAABAAEA01MAAAgACADcUwAABwAHAAAAAAAICAgAAACAvgAAwD8AAIC+AACAPgAAAEAAAIA+AAAAAAAAwD8AAAAAEAAQAAgMBAAAAIC+AABAPwAAAL4AAIA+AADAPwAAAD4AAAAAAABAPwAAAAAgAAAACAgIAAAAkL4AALw/AACQvgAAkD4AAAJAAACQPgAAAAAAAMA/AAAAABAAIAAIDAQAAACQvgAAOD8AACC+AACQPgAAxD8AACA+AAAAAAAAQD8AAAAAKAAQAAQMBAAAAIC+AABAPwAAAL4AAAC/AADAPwAAAD4AAKC+AACwPwAAAAAoABAABAwEAAAAgD4AAEA/AAAAvgAAAD8AAMA/AAAAPgAAoD4AALA/AAAAAAAAEAAEDAQ=");l(e,37667,"vgAAgL4AAEA/AAAAPgAAAAAAAEA/AAAAAAAAEAAEDAQ=");l(e,37711,"vgAAgD4AAEA/AAAAPgAAAAAAAEA/AAAAACAAMAAEDAQAAAAAvwAAQD8AAAC+AACAvgAAwD8AAAA+AACgvgAAsD8AAAAAEAAwAAQMBAAAAIC+AAAAAAAAAL4AAAAAAABAPwAAAD4AAAAAAABAPwAAAAAwADAABAwEAAAACL8AADg/AAAgvgAAYL4AAMQ/AAAgPgAAoL4AALA/AAAAACgAIAAEDAQAAABgPgAAOD8AACC+AAAIPwAAxD8AACA+AACgPgAAsD8AAAAAAAAwAAQMBAAAAJC+AAAAvQAAIL4AAAA9AABIPwAAID4AAAAAAABAPwAAAAAAACAABAwEAAAAAL0AAAC9AAAgvgAAkD4AAEg/AAAgPgAAAAAAAEA/AAAAACAAMAADDAQAAADgvgAAQD8AAAC+AACAvgAAwD8AAAA+AACgvgAAsD8AAAAAKAAQAAMMBAAAAIA+AABAPwAAAL4AAOA+AADAPwAAAD4AAKA+AACwPwAAAAAwADAAAwwEAAAA8L4AADg/AAAgvgAAYL4AAMQ/AAAgPgAAoL4AALA/AAAAACgAIAADDAQAAABgPgAAOD8AACC+AADwPgAAxD8AACA+AACgPgAAsD8AAAAAmpkJP83M4D+amQk/AAAAvwAAAAAAAIC+AAAAPwAAAEAAAIA+AAAAAAQGAwAAAAC+AAAQPwAAwL4AAAA+AABwPwAAQL4AAAAAAAAQPwAAgL4OAAQAAgICAAAAgL0AABA/AADgvgAAgD0AADA/AACgvgAAAAAAABA/AACAvg4AAAAEAgIAAAAAvgAAMD8AAAC/AAAAPgAAUD8AAMC+AAAAAAAAED8AAIC+AAAJAAYGBwAAAEC+AACgPgAAgL4AAEA+AAAwPwAAQD4AAAAAAACgPgAAAAAYAA0AAQQGAAAAgL4AAOA+AABAvgAAQL4AADA/AABAPgAAQL4AADA/AAAAABgADQABBAYAAABAPgAA4D4AAEC+AACAPgAAMD8AAEA+AABAPgAAMD8AAAAAAAAAPwAAQD8AAAA/AACAvgAAAAAAAAC/AACAPgAAcD8AAIA+AAAAAAgICAAAAIC+AACQPwAAgL4AAIA+AADQPwAAgD4AAAAAAACQPwAAAAAQABAACAwEAAAAgL4AAMA+AAAAvgAAgD4AAJA/AAAAPgAAAAAAAMA+AAAAAAAAEAAEBgQAAACAvgAAAAAAAMC+AAAAAAAAwD4AAAC+AAAAAAAAwD4AAAC+AAAQAAQGBA==");l(e,38662,"wL4AAIA+AADAPgAAAL4AAAAAAADAPgAAAL4AABAABAYEAAAAgL4AAAAAAAAAPgAAAAAAAMA+AADAPgAAAAAAAMA+AAAAPgAAEAAEBgQ=");l(e,38751,"PgAAgD4AAMA+AADAPgAAAAAAAMA+AAAAPgAAAD8AANA/AAAAPwAAgL4AAAAAAADAvgAAgD4AANA/AADAPgAAAAAICAgAAACAvgAAAD8AAGC/AACAPgAAgD8AAMC+AAAAAAAAQD8AAMC+HAAIAAoIEAAAAKC+AADAPgAAAL8AAKA+AABgPwAAAD8AAAAAAADAPgAAAAAAABAABAYEAAAAoL4AAAAAAADgvgAAgL0AAMA+AABAvgAAAAAAAMA+AACgvgAAEAAEBgQAAACAPQAAAAAAAOC+AACgPgAAwD4AAEC+AAAAAAAAwD4AAKC+AAAQAAQGBAAAAKC+AAAAAAAAoD4AAIC9AADAPgAAED8AAAAAAADAPgAA4D4AABAABAYEAAAAgD0AAAAAAACgPgAAoD4AAMA+AAAQPwAAAAAAAMA+AADgPgAAYD8AAGA/AABgPwAAoL4AAAAAAABgvwAAoD4AAIA/AAAQPwAAAAAGBggAAABAvgAAgD8AAGC/AABAPgAAsD8AAMC+AAAAAAAAkD8AAAC/HAAIAAgGEAAAAIC+AABAPwAAAL8AAIA+AACQPwAAAD8AAAAAAABAPwAAAAAAABAABAwEAAAAoL4AAAAAAADgvgAAgL0AAEA/AABAvgAAAAAAAEA/AACgvgAAEAAEDAQAAACAPQAAAAAAAOC+AACgPgAAQD8AAEC+AAAAAAAAQD8AAKC+AAAQAAQMBAAAAKC+AAAAAAAAoD4AAIC9AABAPwAAED8AAAAAAABAPwAA4D4AABAABAwEAAAAgD0AAAAAAACgPgAAoD4AAEA/AAAQPwAAAAAAAEA/AADgPgAAAAAGBgYAAABgvgAAeD8AAEi/AABgPgAAtD8AALC+AAAAAAAAkD8AAAC/HAAIAAgGEAAAAMC+AAAoPwAAIL8AAMA+AACcPwAAID8AAAAAAABAPwAAAAAAABAABAYEAAAAsL4AALA+AADwvgAAAL0AAEg/AAAgvgAAAAAAAEA/AACgvgAAEAAEBgQAAAAAPQAAsD4AAPC+AACwPgAASD8AACC+AAAAAAAAQD8AAKC+AAAQAAQGBAAAALC+AACwPgAAkD4AAAC9AABIPwAAGD8AAAAAAABAPwAA4D4AABAABAYEAAAAAD0AALA+AACQPgAAsD4AAEg/AAAYPwAAAAAAAEA/AADgPgAAID8AAKA/AAAgPwAAwL4AAAAAAABQvwAAwD4AALg/AAAgPwAAAAAICAgAAACAvgAAwD8AAIC+AACAPgAAAEAAAIA+AAAAAAAAwD8AAAAAEAAQAAgMBAAAAIC+AABAPwAAAL4AAIA+AADAPwAAAD4AAAAAAABAPwAAAAAAABAAAgwCAAAAgL0AAAAAAACAvQAAQL4AAEA/AACAPQAAAAAAAEA/AAAAAAAAEAACDAIAAACAPQAAAAAAAIC9AABAPgAAQD8AAIA9AAAAAAAAQD8AAAAAKAAQAAIMAgAAAIC+AABAPwAAgL0AAMC+AADAPwAAgD0AAKC+AAC4PwAAAAAoABAAAgwCAAAAgD4AAEA/AACAvQAAwD4AAMA/AACAPQAAoD4AALg/AAAAAAAAAD/NzOA/AAAAPyAABAAICAgAAACAvgAAgD4AADC/AACAPgAAQD8AAEC+AAAAAAAAAD8AAEC+AAAAAAYGBgAAAEC+AACgPgAAQD4AAEA+AAAwPwAAQL4AAAAAAACgPgAAAAAAAAwACggMAAAAoL4AAIA+AABAPgAAoD4AAEA/AABwPwAAAAAAAIA+AAAQPxIAAAAQAgIAAACYvwAA4D4AAIC9AABAvgAAED8AAIA9AABAvgAAAD8AAAAAEgAAABACAgAAAEA+AADgPgAAgL0AAJg/AAAQPwAAgD0AAEA+AAAAPwAAAAAAAHA/AABAPwAAcD8AAKC+AAAAAAAAML8AAKA+AABAPwAAcD8AAIC+AAAAAAAAgL4AAIA+AAAAQAAAgD4AAAAACAgIAAAAgL4AAEA/AACAvgAAgD4AAKA/AACAPgAAAAAAAFA/AAAAACAAAAAICAgAAACIvgAAPD8AAIi+AACIPgAAoj8AAIg+AAAAAAAAUD8AAAAAMzOTPs3MoD8zM5M+AACAvgAAAAAAAIC+AACAPgAAgD8AAIA+zcz8Ps3M/D7NzPw+AACAvgAAAAAAAIC+AACAPgAAAD8AAIA+mpkJP83MkD+amQk/AAAAvwAAAAAAAIC+AAAAPwAAsD8AAIA+AAAAABAQEAAAAAC/AAAAAAAAAL8AAAA/AACAPwAAAD8AAAAAAAAAPwAAAAAAAHA/AABwPwAAcD8AAAC/AAAAAAAAAL8AAAA/AACAPwAAAD/sMQAABAAEAKozAAAFAAUANj4AAAwADAAUTgAAFgAWALURAAAHAAcAB0wAAA0ADQB9HAAADAAMANQbAAAfAB8AAAAAAIzOAACUzgAAXM4AAJzOAACkzgAArM4AALTOAAC8zgAAfM4AAMTOAADMzgAA1M4AAHTOAADczgAA5M4AAOzOAAD0zgAA/M4AAATPAAAMzwAAFM8AABzPAAAkzwAAZM4AAGzOAAAszwAANM8AAITOAAA8zwAARM8AAEzPAABUzwAAPM4AAFzPAABkzwAAbM8AAHTPAAB8zwAAhM8AAIzPAAA0zgAAGxwAAAkACQBdAwAAXgMAAF8DAABgAwAAYQMAAGIDAABjAwAAfAIAAH0CAABkAwAAZQMAAGYDAABnAwAAaAMAAGkDAABqAwAAAAAAAGsDAADgAQAAbAMAAG0DAABuAwAAbwMAAHADAAB8AgAAfQIAAHEDAADpAQAAcgMAAHMDAAB0AwAAdQMAAHYDAAAAAAAAdwMAAHgDAAB5AwAAegMAAHsDAAB8AwAAfQMAAH4DAAB/AwAAgAMAAOkBAAByAwAAgQMAAIIDAACDAwAAhAMAAAAAAACFAwAAhgMAAIcDAACIAwAA4wEAAG8DAADlAQAAfAIAAH0CAAByAwAA6QEAAHIDAABzAwAAiQMAAIoDAACLAwAAAAAAAIwDAACNAwAAjgMAAI8DAADjAQAAkAMAAJEDAADmAQAA5wEAAJIDAACTAwAAlAMAAJUDAACWAwAAlwMAAJgDAACZAwAAmgMAAOABAACbAwAAnAMAAJ0DAACeAwAA5QEAAOYBAADnAQAAnwMAAOkBAACfAwAA6wEAAKADAAChAwAAogMAAAAAAAAYJgAAEAAQAGNnAAAMAAwAowMAAKQDAAClAwAApgMAAJ0DAACeAwAA5QEAAOYBAADnAQAAnwMAAOkBAAByAwAA6wEAAKADAAChAwAAogMAAAAAAADtbgAABwAHAOVuAAAHAAcApwMAAKgDAACpAwAAqgMAAOMBAADkAQAA5QEAAOYBAADnAQAA6AEAAOkBAAA2AgAA6wEAAKsDAACsAwAArQMAAAAAAAAdbQAADwAPACNvAAAKAAoA4lMAAAEAAQ==");l(e,41362,"AQAAAgEAAgEAAQMAAQMAAgIAAgIAAQAAAAAAAQMAAQMAAAAAAwAAAgMAAgMAAwADAQADAgEDAgEDAQMDAQMDAgIDAgIDAQADAAADAQMDAQMDAAADAwADAgMDAgMDAwABAAACAAACAQABAQABAwACAwACAgABAgAAAAABAAABAwAAAwADAAACAAACAwADAwMBAAMCAAMCAQMBAQMBAwMCAwMCAgMBAgMAAAMBAAMBAwMAAwMDAAMCAAMCAwMDAwABAAACAAECAAEBAAMBAAMCAAICAAIBAAAAAAABAAMBAAMAAAADAAACAAMCAAMDAAABAwACAwECAwEBAwMBAwMCAwICAwIBAwAAAwABAwMBAwMAAwADAwACAwMCAwMDAwABAQUFBAQAAgMDBwcGBgIAAgEDBQcEBg==");l(e,41681,"BAUBAgYHAwACAwEEBgcFAAIGBAEDBwUmGwAADAAMAAIRAAASABIAaW0AADgAOADDbgAADQANAK8bAAAkACQANj4AAAwADA==");l(e,41762,"OiY7JmUmZiZjJmAmIiDYJcsl2SVCJkAmaiZrJjwmuiXEJZUhPCC2AKcArCWoIZEhkyGSIZAhHyKUIbIlvCUCI8cA/ADpAOIA5ADgAOUA5wDqAOsA6ADvAO4A7ADEAMUAyQDmAMYA9AD2APIA+wD5AP8A1gDcAKIAowClAKcgkgHhAO0A8wD6APEA0QCqALoAvwAQI6wAvQC8AKEAqwC7AJElkiWTJQIlJCVhJWIlViVVJWMlUSVXJV0lXCVbJRAlFCU0JSwlHCUAJTwlXiVfJVolVCVpJWYlYCVQJWwlZyVoJWQlZSVZJVglUiVTJWslaiUYJQwliCWEJYwlkCWAJbED3wCTA8ADowPDA7UAxAOmA5gDqQO0Ax4ixgO1AykiYSKxAGUiZCIgIyEj9wBIIrAAGSK3ABoifyCyAKAloA==");l(e,42096,"AQEBAQEAAQAFBQUAAAAAAAoKHwofCgoABB8BHxAfBAAAIREIBCIhAAwSDC4ZES4AAQEBAAAAAAAEAgEBAQIEAAECBAQEAgEAAAIHAgUAAAAABAQfBAQAAAAAAAAAAgIBAAAAHw==");l(e,42205,"AQEACAgEBAICAQAGCQ0LCQkGAAIDAgICAgcABgkIBAIJDwAGCQgGCAkGAAUFBQ8EBAQADwEHCAgJBgAGCQEHCQkGAA8ICAQEAgIABgkJBgkJBgAGCQkOCAkGAAABAQAAAQEAAAICAAACAgEABAIBAgQAAAAAHwAAHwAAAAECBAIBAAAHCQgEAgACAA4RHR0dAQ4ABgkJDwkJCQAHCQkHCQkHAAYJAQEBCQYABwkJCQkJBwAPAQEHAQEPAA8BAQcBAQEABgkBDQkJBgAJCQkPCQkJAAcCAgICAgcACAgICAgJBwAJCQUDBQkJAAEBAQEBAQ8AERsVEREREQAJCw0JCQkJAAYJCQkJCQYABwkJBwEBAQAGCQkJCQUOAAcJCQcJCQkABgkBBggJBgAHAgICAgICAAkJCQkJCQYAEREREREKBAARERERFRsRABERCgQKEREAEREKBAQEBAAPCAQCAQEPAAcBAQEBAQcAAQECAgQECAAHBAQEBAQHAAQKEQ==");l(e,42599,"HwEBAgAAAAAAAAAOCQkNCwABAQcJCQkHAAAABgkBCQYACAgOCQkJDgAAAAYJDwEOAAYBBwEBAQEAAAAOCQkOCAcBAQcJCQkJAAEAAQEBAQEACAAICAgICQYBAQkFAwUJAAEBAQEBAQIAAAALFRUREQAAAAcJCQkJAAAABgkJCQYAAAAHCQkHAQEAAA4JCQ4ICAAABQMBAQEAAAAOAQYIBwACAgcCAgICAAAACQkJCQ4AAAAJCQkFAwAAABERFRUaAAAABQUCBQUAAAAJCQkOCAcAAA8IBAIPAAQCAgECAgQAAQEBAQEBAQEBAgIEAgIBAAAAJhkAAAAA//////////8AAAAAAAAAAKgmAABWKgAA+wcAAKpHAABlRAAAqzsAAHlEAAAmDwAASkQAAGYkAACdRwAAQkQAANoxAAAoBQAAmToAAGExAABmMQAAmioAANwtAAALAAsA9AMAAOABAAD1AwAAPAIAAOMBAADkAQAA5QEAAOYBAADnAQAA6AEAAOkBAAA2AgAA6wEAAPYDAAA+AgAA9wMAAAAAAAD4AwAA4AEAAEICAAA8AgAA4wEAAOQBAADlAQAA5gEAAOcBAADoAQAA6QEAADYCAADrAQAA+QMAAPoDAAD7AwAAAAAAAPwDAADgAQAAQgIAADwCAADjAQAA5AEAAOUBAADmAQAA5wEAAOgBAADpAQAANgIAAOsBAAD9AwAAPgIAAP4DAAAAAAAA/wMAAOABAAAABAAAAQQAAOMBAABvAwAA5QEAAHwCAAB9AgAAAgQAAAMEAAByAwAAcwMAAAQEAAAFBAAABgQAAAAAAAD9DwAAcAoAAPkhAADXIQAAVwYAADEfAADHQQAAmEEAACIiAACTMgAAZykAAMY6AAAXHgAA1WkAANVpAADVaQAAmv/O//F0AAAHBAAAZgDO//F0AAAIBAAAmv8AAPF0AAAJBAAAZgAAAPF0AAAKBAAAAAAyAHITAAALBAAAAAAAAJr/zv/zCgAADAQAAJr/AAAcJAAADQQAAGYAzv/9DwAADgQAAGYAAACALAAADwQAAAAAMgCVEwAAEAQAAAAAZABCCAAAEQQ=");l(e,43428,"ljAHdyxhDu66UQmZGcRtB4/0anA1pWPpo5VknjKI2w6kuNx5HunV4IjZ0pcrTLYJvXyxfgctuOeRHb+QZBC3HfIgsGpIcbnz3kG+hH3U2hrr5N1tUbXU9MeF04NWmGwTwKhrZHr5Yv3syWWKT1wBFNlsBmNjPQ/69Q0IjcggbjteEGlM5EFg1XJxZ6LR5AM8R9QES/2FDdJrtQql+qi1NWyYskLWybvbQPm8rONs2DJ1XN9Fzw3W3Fk90ausMNkmOgDeUYBR18gWYdC/tfS0ISPEs1aZlbrPD6W9uJ64AigIiAVfstkMxiTpC7GHfG8vEUxoWKsdYcE9LWa2kEHcdgZx2wG8INKYKhDV74mFsXEftbYGpeS/nzPUuOiiyQd4NPkAD46oCZYYmA7huw1qfy09bQiXbGSRAVxj5vRRa2tiYWwc2DBlhU4AYvLtlQZse6UBG8H0CIJXxA/1xtmwZVDptxLquL6LfIi5/N8d3WJJLdoV83zTjGVM1PtYYbJNzlG1OnQAvKPiMLvUQaXfSteV2D1txNGk+/TW02rpaUP82W40RohnrdC4YNpzLQRE5R0DM19MCqrJfA3dPHEFUKpBAicQEAu+hiAMySW1aFezhW8gCdRmuZ/kYc4O+d5emMnZKSKY0LC0qNfHFz2zWYENtC47XL23rWy6wCCDuO22s7+aDOK2A5rSsXQ5R9Xqr3fSnRUm2wSDFtxzEgtj44Q7ZJQ+am0NqFpqegvPDuSd/wmTJ64ACrGeB31Ekw/w0qMIh2jyAR7+wgZpXVdi98tnZYBxNmwZ5wZrbnYb1P7gK9OJWnraEMxK3Wdv37n5+e++jkO+txfVjrBg6KPW1n6T0aHEwtg4UvLfT/Fnu9FnV7ym3Qa1P0s2skjaKw3YTBsKr/ZKAzZgegRBw+9g31XfZ6jvjm4xeb5pRoyzYcsag2a8oNJvJTbiaFKVdwzMA0cLu7kWAiIvJgVVvju6xSgLvbKSWrQrBGqzXKf/18Ixz9C1i57ZLB2u3luwwmSbJvJj7JyjanUKk20CqQYJnD82DuuFZwdyE1cABYJKv5UUerjiriuxezgbtgybjtKSDb7V5bfv3Hwh39sL1NLThkLi1PH4s91oboPaH80WvoFbJrn24Xewb3dHtxjmWgiIcGoP/8o7BmZcCwER/55lj2muYvjT/2thRc9sFnjiCqDu0g3XVIMETsKzAzlhJmen9xZg0E1HaUnbd24+SmrRrtxa1tlmC99A8DvYN1OuvKnFnrvef8+yR+n/tTAc8r29isK6yjCTs1Omo7QkBTbQupMG180pV95Uv2fZIy56ZrO4SmHEAhtoXZQrbyo3vgu0oY4MwxvfBVqN7wItAACAPw==");l(e,44470,"gD8=");l(e,44490,"gD8=");l(e,44510,"gD8fBAAAIAQAACEEAAAiBAAAIwQAACQEAAAlBAAAJgQAACcEAAAoBAAAKQQAACoEAAAAAAAAKwQAACwEAAAtBAAAIgQAACMEAAAkBAAAJQQAACYEAAAnBAAALgQAAC8EAAAwBAAAAAAAADEEAAAyBAAAMwQAACIEAAAjBAAANAQAADUEAAA2BAAANwQ=");l(e,44672,"OAQAADkEAAA6BAAAOwQAADwEAAA9BAAAPgQAAD8EAABABAAAQQQAAEIEAAAAAAAA5mgAAAMAAwAAAAAAQwQAAEQEAABFBAAAIwQAAEYEAABHBAAASAQAAEkEAABKBAAASwQAAEwEAABNBAAATgQAAE8EAABQBAAAUQQAAFIEAABTBAAAVAQAAFUEAABWBAAAVwQAAFgEAABTBAAAWQQAAFUEAABWBAAAVwQAAFoEAABTBAAAWwQAAFwEAABdBAAAXgQAAF8EAABTBAAAYAQAAGEEAABiBAAAYgQAAFoEAABTBAAAYwQAAGQEAABlBAAAZQQAAFoEAABTBAAAZgQAAGcEAABoBAAAaQQAACMEAAAkBAAAagQAACYEAAAnBAAAawQAAGwEAABtBAAAAAAAAG4EAABnBAAAaAQAAG8EAAAjBAAAJAQAAHAEAAAmBAAAJwQ=");l(e,45028,"BG8AAAIAAgBxBAAAcgQAAHMEAAAiBAAAIwQAACQEAAAlBAAAJgQAACcEAAB0BAAAdQQAAHYEAAAAAAAAdwQAAHgEAAB5BAAAIgQAACMEAAAkBAAAegQAACYEAAAnBA==");l(e,45144,"QgIAAHsEAAAiBAAAIwQAACQEAAAlBAAAJgQAACcEAAB8BAAAfQQ=");l(e,45210,"LD8AAEg/AABUPw==");l(e,45238,"BD8AAEg/AAAsPw==");l(e,45266,"uD4AAEg/AAAEP5tEAAABAAEAAAAAAJgRAAAHAAcA0SsAAAQABAAyBAAAHwAfAE0HAAAIAAgAAAQAADEAMQDOEQAABwAHAIEEAAAhACEADB0AAAUABQBSBAAALgAuAN4FAADkBQAApQQAAAAAAAAHAAAAdVIAAAcAAAAgUQAABwAAAABQAAAHAAAAE08AAAMAAAAWUgAAAwAAAKVQAAADAAAArE8AAAMAAADKTgAAAgAAAFxSAAACAAAAB1EAAAIAAADnTwAAAgAAAPpOAAAIAAAAuFIAAAgAAACWUQAACAAAAENQAAAIAAAAVk8AAAkAAAABUgAACQAAAJBQAAAJAAAAl08AAAkAAAC1TgAABAAAAIxSAAAEAAAAalEAAAQAAAAXUAAABAAAACpPAAABAAAAo1IAAAEAAACBUQAAAQAAAC5QAAABAAAAQU8=");l(e,45608,"BwAAAIFSAAAHAAAALFEAAAcAAAAMUAAABwAAAB9PAAADAAAAIlIAAAMAAACxUAAAAwAAALhPAAADAAAA1k4AAAYAAAAtUgAABgAAALxQAAAGAAAAw08AAAIAAABpUgAAAgAAABRRAAACAAAA9E8AAAIAAAAHTwAACAAAAMNSAAAIAAAAoVEAAAgAAABOUAAACAAAAGFPAAAJAAAADFIAAAkAAACbUAAACQAAAKJPAAAJAAAAwE4AAAQAAACYUgAABAAAAHZRAAAEAAAAI1AAAAQAAAA2TwAAAQAAAK5SAAABAAAAjFEAAAEAAAA5UAAAAQAAAExPAADTUwAACAAIANxTAAAHAAcAWlMAABYAFgBCUwAAFwAXAClTAAAYABgAp1MAABYAFgCUUwAAEgAS");l(e,45920,"cVMAAHFTAABxUwAAvlMAAL5TAAAAypo7AgAAABoAAAAGAAAAEQAAAHcAAAB5AAAAeAAAAHUAAAB2AAAAANQAAJjUAABObyBlcnJvciBpbmZvcm1hdGlvbgBJbGxlZ2FsIGJ5dGUgc2VxdWVuY2UARG9tYWluIGVycm9yAFJlc3VsdCBub3QgcmVwcmVzZW50YWJsZQBOb3QgYSB0dHkAUGVybWlzc2lvbiBkZW5pZWQAT3BlcmF0aW9uIG5vdCBwZXJtaXR0ZWQATm8gc3VjaCBmaWxlIG9yIGRpcmVjdG9yeQBObyBzdWNoIHByb2Nlc3MARmlsZSBleGlzdHMAVmFsdWUgdG9vIGxhcmdlIGZvciBkYXRhIHR5cGUATm8gc3BhY2UgbGVmdCBvbiBkZXZpY2UAT3V0IG9mIG1lbW9yeQBSZXNvdXJjZSBidXN5AEludGVycnVwdGVkIHN5c3RlbSBjYWxsAFJlc291cmNlIHRlbXBvcmFyaWx5IHVuYXZhaWxhYmxlAEludmFsaWQgc2VlawBDcm9zcy1kZXZpY2UgbGluawBSZWFkLW9ubHkgZmlsZSBzeXN0ZW0ARGlyZWN0b3J5IG5vdCBlbXB0eQBDb25uZWN0aW9uIHJlc2V0IGJ5IHBlZXIAT3BlcmF0aW9uIHRpbWVkIG91dABDb25uZWN0aW9uIHJlZnVzZWQASG9zdCBpcyBkb3duAEhvc3QgaXMgdW5yZWFjaGFibGUAQWRkcmVzcyBpbiB1c2UAQnJva2VuIHBpcGUASS9PIGVycm9yAE5vIHN1Y2ggZGV2aWNlIG9yIGFkZHJlc3MAQmxvY2sgZGV2aWNlIHJlcXVpcmVkAE5vIHN1Y2ggZGV2aWNlAE5vdCBhIGRpcmVjdG9yeQBJcyBhIGRpcmVjdG9yeQBUZXh0IGZpbGUgYnVzeQBFeGVjIGZvcm1hdCBlcnJvcgBJbnZhbGlkIGFyZ3VtZW50AEFyZ3VtZW50IGxpc3QgdG9vIGxvbmcAU3ltYm9saWMgbGluayBsb29wAEZpbGVuYW1lIHRvbyBsb25nAFRvbyBtYW55IG9wZW4gZmlsZXMgaW4gc3lzdGVtAE5vIGZpbGUgZGVzY3JpcHRvcnMgYXZhaWxhYmxlAEJhZCBmaWxlIGRlc2NyaXB0b3IATm8gY2hpbGQgcHJvY2VzcwBCYWQgYWRkcmVzcwBGaWxlIHRvbyBsYXJnZQBUb28gbWFueSBsaW5rcwBObyBsb2NrcyBhdmFpbGFibGUAUmVzb3VyY2UgZGVhZGxvY2sgd291bGQgb2NjdXIAU3RhdGUgbm90IHJlY292ZXJhYmxlAFByZXZpb3VzIG93bmVyIGRpZWQAT3BlcmF0aW9uIGNhbmNlbGVkAEZ1bmN0aW9uIG5vdCBpbXBsZW1lbnRlZABObyBtZXNzYWdlIG9mIGRlc2lyZWQgdHlwZQBJZGVudGlmaWVyIHJlbW92ZWQARGV2aWNlIG5vdCBhIHN0cmVhbQBObyBkYXRhIGF2YWlsYWJsZQBEZXZpY2UgdGltZW91dABPdXQgb2Ygc3RyZWFtcyByZXNvdXJjZXMATGluayBoYXMgYmVlbiBzZXZlcmVkAFByb3RvY29sIGVycm9yAEJhZCBtZXNzYWdlAEZpbGUgZGVzY3JpcHRvciBpbiBiYWQgc3RhdGUATm90IGEgc29ja2V0AERlc3RpbmF0aW9uIGFkZHJlc3MgcmVxdWlyZWQATWVzc2FnZSB0b28gbGFyZ2UAUHJvdG9jb2wgd3JvbmcgdHlwZSBmb3Igc29ja2V0AFByb3RvY29sIG5vdCBhdmFpbGFibGUAUHJvdG9jb2wgbm90IHN1cHBvcnRlZABTb2NrZXQgdHlwZSBub3Qgc3VwcG9ydGVkAE5vdCBzdXBwb3J0ZWQAUHJvdG9jb2wgZmFtaWx5IG5vdCBzdXBwb3J0ZWQAQWRkcmVzcyBmYW1pbHkgbm90IHN1cHBvcnRlZCBieSBwcm90b2NvbABBZGRyZXNzIG5vdCBhdmFpbGFibGUATmV0d29yayBpcyBkb3duAE5ldHdvcmsgdW5yZWFjaGFibGUAQ29ubmVjdGlvbiByZXNldCBieSBuZXR3b3JrAENvbm5lY3Rpb24gYWJvcnRlZABObyBidWZmZXIgc3BhY2UgYXZhaWxhYmxlAFNvY2tldCBpcyBjb25uZWN0ZWQAU29ja2V0IG5vdCBjb25uZWN0ZWQAQ2Fubm90IHNlbmQgYWZ0ZXIgc29ja2V0IHNodXRkb3duAE9wZXJhdGlvbiBhbHJlYWR5IGluIHByb2dyZXNzAE9wZXJhdGlvbiBpbiBwcm9ncmVzcwBTdGFsZSBmaWxlIGhhbmRsZQBSZW1vdGUgSS9PIGVycm9yAFF1b3RhIGV4Y2VlZGVkAE5vIG1lZGl1bSBmb3VuZABXcm9uZyBtZWRpdW0gdHlwZQBNdWx0aWhvcCBhdHRlbXB0ZWQAUmVxdWlyZWQga2V5IG5vdCBhdmFpbGFibGUAS2V5IGhhcyBleHBpcmVkAEtleSBoYXMgYmVlbiByZXZva2VkAEtleSB3YXMgcmVqZWN0ZWQgYnkgc2VydmljZQAAAAAApQJbAPABtQWMBSUBgwYdA5QE/wDHAzEDCwa8AY8BfwPKBCsA2gavAEIDTgPcAQ4EFQChBg0BlAILAjgGZAK8Av8CXQPnBAsHzwLLBe8F2wXhAh4GRQKFAIICbANvBPEA8wMYBdkA2gNMBlQCewGdA70EAABRABUCuwCzA20A/wGFBC8F+QQ4AGUBRgGfALcGqAFzAlMB");l(e,48104,"IQQAAAAAAAAAAC8C");l(e,48136,"NQRHBFYE");l(e,48158,"oAQ=");l(e,48178,"RgVgBW4FYQYAAM8BAAAAAAAAAADJBukG+QYeBzkHSQdeBw==");l(e,48224,"AwAAAAQ=");l(e,48248,"EC0AAAUAAAAAAAAAewgAAAYAAAAAAAAA4iQAAAcAAAAAAAAA7yQAAAgAAAAAAAAACgAAAAs=");l(e,48320,"DQAAAA4=");l(e,48344,"GwAAAAAAAAAc");l(e,48368,"PA==");l(e,48384,"PQ==");l(e,48400,"/////wEAAADu////EgAAALz+//9EAQAAAAAAAEIAAABDAAAARAAAAEUAAABGAAAARwAAAEgAAABJAAAASgAAAEsAAAAAAAAAAQAAAEIAAABDAAAATAAAAE0AAABGAAAARwAAAEgAAABJAAAASgAAAE4AAAAAAAAAAQAAAEIAAABDAAAATAAAAE0AAABGAAAARwAAAEgAAABJAAAASgAAAE4AAAAAAAAATw==");l(e,48594,"QEAAAEBAAAAAAAAAAABAaQwAAABAAIBpDAAAAEAAwGkMAAAAQAAAagwAAABAAEBqDAAAAEA=");l(e,48656,"gGoMAAAAQADAagwAAABAAABrDAAAAEA=");l(e,48688,"QGsMAAAAQACAawwAAABAAMBrDAAAAEAAAGwMAAAAQABAbAwAAABAAOCVDAAAAEAAUAAAAFEAAABS");l(e,48760,"YJYMAAAABAFWAAAAVw==");l(e,48792,"UyEAAFgAAAACAAAABiEAADlm");l(e,48828,"1R4AAFkAAAACAAAA6UUAAEFj");l(e,48864,"YzUAAFoAAAACAAAAKEUAALJAAABdGwAA9TgAAFA6AAAAAAAASiIAAFsAAAAAAAAAUkUAAORT");l(e,48936,"fyYAAFwAAAADAAAA0kUAAFkfAADDSw==");l(e,48972,"qiMAAF0AAAADAAAAvEUAADMbAAB4RQAAZEk=");l(e,49008,"EUgAAF4AAAABAAAAnUQAAAJW");l(e,49044,"YUEAAF8AAAACAAAAFEEAACpB");l(e,49080,"WzsAAGAAAAACAAAATDsAAGBm");l(e,49116,"xjoAAGEAAAABAAAAskQAAJ5lAAC7ZAAAYQsAAOpkAAAAAAAAhQwAAGIAAAADAAAAjUUAAO8mAACtFgAAzBY=");l(e,49188,"0jwAAGMAAAADAAAABUUAAP9lAAAmXAAAUDwAALBbAAAAAAAArToAAGQAAAADAAAA0kQAALllAABeXAAAUDwAAG1bAAAAAAAAH4sI");l(e,49272,"CAAAAGsAAABsAAAAbQ==");l(e,49300,"mCwAAG4AAAAAAAAAhgAAAIcAAACH");l(e,49336,"jgAAAI8AAACQAAAAkQ==");l(e,49360,"Lj+uwrcix8Ii08nCnAAAAJ0=");l(e,49396,"pAAAAKUAAACmAAAApgAAAKcAAAAAAAAANy0AAKgAAAAAAAAAhCwAAKkAAAAAAAAAjywAAKoAAAAAAAAA3y0AAKs=");l(e,49472,"CgAJU2NoZW1hdGljCAAJTWF0ZXJpYWxzAAdDbGFzc2ljAgAFV2lkdGgAAAIABkhlaWdodAAAAgAGTGVuZ3RoAAAHAAZCbG9ja3MAAAAABwAERGF0YQ==");l(e,49568,"CQAIRW50aXRpZXMKAAAAAAkADFRpbGVFbnRpdGllcwoAAAAAAAAAALoAAAC7");l(e,49632,"DggAALwAAAAAAAAAAhAAAL0AAAAAAAAAUyUAAL4AAAAAAAAAEjYAAL0AAAAAAAAADSUAAL8AAAAAAAAA3iUAAMAAAAAAAAAAAAIAAAACAAAAgAAAQBQQAAAAQACAFBAAAABAAAEBAQHV");l(e,49762,"gL8AAIC///////////8=");l(e,49808,"Ag==");l(e,49840,"AQ==");l(e,49872,"Aw==");l(e,49904,"BQ==");l(e,49936,"Bw==");l(e,49968,"CA==");l(e,5e4,"Cg==");l(e,50032,"CQ==");l(e,50064,"Cw==");l(e,50096,"DQ==");l(e,50128,"Dw==");l(e,50160,"EA==");l(e,50192,"Eg==");l(e,50224,"EQ==");l(e,50256,"Ew==");l(e,50288,"FQ==");l(e,50320,"Fw==");l(e,50352,"3wAAAOAAAADh");l(e,50376,"9C0AAOIAAAAAAAAAKS4AAOMAAAAAAAAAHy0AAOQAAAAAAAAA/C0AAOU=");l(e,50426,"gD7q");l(e,50452,"AQ==");l(e,50464,"8UkAAOlSAAC8UQAAaVAAAHxPAACeTgAAXU4AAPBNAABdTQAAI00AACVTAAD4UgAA6FEAAHhQAACLTwAAqU4AAGhOAAAQTgAAzE0AADlNAAAhUwAA9FIAAORRAAB0UAAAh08AAK9JAABGRwAATEcAAClHAAAgRwAAUEkAAGFIAAAcSgAA0koAAE1KAABMSQAA/EYAAPVGAADbSAAA0kgAANBGAADLRgAAcEgAAGtIAAAOSAAAVUgAABtHAADvRgAAJ1MAAAJTAAD/UQAAglAAAJVPAACzTgAAck4AADFOAADWTQAAQ00AALBGAADASQAAAUoAAFRKAADZRwAAVUgAAIxGAADiSgAAykoAAKdKAACWSgAANUoAAKlJAAClSQAAYkkAADtJAAAzSQAAMUkAAAtJAAB4SAAAdkgAADBIAAAuSAAA70cAAO1HAADKRwAAREcAAJJGAACKRgAAdEYAAGlGAABjRgAARUYAAFpIAADqSQAALkoAAC5JAADISgAA9kgAAORIAADFRgAA3EkAABBJAAAUUwAA7FIAAMNRAABsUAAAf08AAKFOAABgTgAA800AAGBNAAAmTQAAJ0oAAFJGAAA9RwAAkUoAAAVJAADfRwAA4FIAALNRAADVSQAAx0kAAM5JAAD4RwAAO0gAAAxHAADfRgAAYFAAAHNPAACVTgAAVE4AALVJAAAASAAARUgAACpIAACgRgAAgkYAAFtGAAAgSAAAdkYAAJRGAAA9SQAAFEgAAFZJAAC4RwAA+kkAAOtIAADYSgAA1VIAAJ5KAADiSgAAykoAAGlGAABjRgAAC0kAAO1HAABFRgAAp0oAAJZKAAAbRwAA70YAAA5IAABVSAAAu0YAADZHAACESAAA1kcAACdJAAAcSQAAGkcAAO5GAAANSAAAVEgAAAE=");l(e,51164,"7QAAACwAAAAtAAAALgAAAC8AAABbAAAAdAAAAFwAAABjAAAAXAAAAD4AAAA/AAAAXwAAAKFCAAAQhwAAYB4QAAI=");l(e,51240,"7g==");l(e,51308,"AQAAAAIAAAACAAAA7wAAAPA=");l(e,51344,"/////wAAgL8SAQAAEwE=");l(e,51376,"FAEAAAAAAAAVAQAAAAAAABYBAAAAAAAAFwE=");l(e,51416,"KAEAACkBAAApAQAAKQEAACoBAAAAAAAAiRoAAMEAAAAyAQAAMwEAADMBAAAzAQAANAEAAAAAAAAMAAAAphQAAFCRAACbAgAAAQAAAJ0UAACAFgAAaJEAAJwCAAAAAAAAkB4AAIsWAACAkQAAnQIAAAAAAACQHgAAtwIAALgCAAC5Ag==");l(e,51560,"cS0=");l(e,51576,"6C0=");l(e,51592,"Wi0=");l(e,51608,"Bi4=");l(e,51624,"ei0=");l(e,51640,"TC0=");l(e,51656,"hC0=");l(e,51672,"Zi0=");l(e,51688,"Di4=");l(e,51704,"GS4=");l(e,51720,"wDwAAMBgFwBoyQAAugIAALsCAAC8AgAAvQIAAL4CAAC/Ag==");l(e,51792,"0igAAAAAAABoyQAAqwIAAMACAADBAgAAwgIAAMMCAADEAg==");l(e,51864,"4yMAAPB7FwB4yQAAxQIAAMYCAADHAgAAyAIAAMkCAADKAg==");l(e,51936,"mRwAAHCGFwCIyQAAywIAAMwCAADNAgAAzgIAAM8CAADQAg==");l(e,52008,"pDAAANCPFwCYyQAA0QIAANICAADTAgAA1AIAANUCAADWAg==");l(e,52080,"iR8AADCZFwCoyQAA1wIAANgCAADZAgAA2gIAANsCAADcAg==");l(e,52152,"cBoAADCZFwCoyQAA1wIAAN0CAADZAgAA2gIAANsCAADcAg==");l(e,52224,"/yEAAPCrFwDIyQAA3gIAAN8CAAC8AgAAvQIAAOACAADhAg==");l(e,52296,"ph0AAFC1FwDYyQAA4gIAAOMCAADkAgAA5QIAAOYCAADnAg==");l(e,52368,"yTcAAMBgFwDoyQAAqwIAAOgCAAC8AgAAvQIAAL4CAADpAg==");l(e,52440,"pCoAACC9FwBoyQAA6gIAAOsCAADsAgAA7QIAAO4CAADvAg==");l(e,52512,"AUIAAMBgFwBoyQAAqwIAAPACAAC8AgAA8QIAAPICAADzAg==");l(e,52584,"wwsAAMBgFwBoyQAAqwIAAPQCAAC8AgAA9QIAAPYCAAD3Ag==");l(e,52656,"7ToAADDaFwD4yQAA+AIAAPkCAAD6AgAA+wIAAPwCAAD9Ag==");l(e,52728,"BQMAAAYDAAAHAwAABwM=");l(e,52754,"gDwAAOA9AAAgPQAAAD4pLQAACAMAAAAAAACgtxkAQAAAAI4UAAABAAAAeRcAAAEAAABDAwAAAAAAAEQD");l(e,52828,"IykAAAEAAAB9EgAAAQAAAJkwAAABAAAALBYAAAEAAADDEgAAAQAAAEMgAAABAAAAMToAAAEAAACBFAAAAQAAAFYHAAABAAAAlQYAAAEAAAChCgAAAgAAAKARAAABAAAAyTwAAAEAAAB5JgAAAQAAAD86AAACAAAAVDUAAAEAAABuJQAAAQAAAFspAAABAAAABk4AAAEAAABqFwAAAQAAAJASAAABAAAAowkAAAIAAADHMgAAAQAAAKoRAAABAAAA0Q4AAAIAAACrBAAAAgAAAGMdAAABAAAAQUoAAAEAAAAlHgAAAQAAAFMLAAABAAAAXiUAAAEAAACdFgAAAQAAANUKAAABAAAAcDkAAAEAAACNKgAAAQAAAIgiAAABAAAArwoAAAEAAACeEwAAAgAAAAYWAAAB");l(e,53162,"cD0AAHA+rwMAALAD");l(e,53192,"sgMAALMDAAC0AwAAtAM=");l(e,53216,"IKQbAAAABAG/AwAAwAMAAMEDAADCAw==");l(e,53248,"/////3D2GwAAAEAA3wM=");l(e,53284,"qCYAAAUABQAAAAAAICccAAAAgACgJxwAAAAEAeYDAADnAwAA6AM=");l(e,53344,"YJBV/4GAf/97V0L/rnxK/7iXaf/IyMX/r62t/5llS/92b2X/PRQL/7NDF/+agFn/owId/8vOAv9WkNiAJlgp/6Wjn/8lMD3/49+X/6CYk/9aRzr/rYdX/yZiJf/h5ev/9ucX/+Hanf/38+r/OXOe/+ISEv+sg2X//3of/094T/+BgH//vZeG/zUsPf+0l2b/paOf/xQUIf/zixz/wcXK/+u8IP/LwYf/4NzU/zRahv85c57/NFqG/zlznv+ufEr/r5Qr/7zh5//u9fX/zej8gJmWlf9pUDb/7Ozw/6Glqv/hkh7/y8GH//fz6v85c57/NFqG/zlznv80Wob/OXOe/9kjI//biQ3/4OAA/4DdAv8N2Q3/CNqF/wTb2/9Zr9v/enrZ/4Mn4f+yReb/4zTj/+Mphf9JSUn/l5eX/+Pj4//cf6L/KkII/0slC/8YJZX/HXGV/5uhrv+nKQ3/OXOe/zRahv85c57/NFqG/zlznv80Wob/OXOe/zRahv85c57/OXOe/zRahv85c57/NFqG/zlznv80Wob/OXOe/zRahv85c57/NFqG/zlznv80Wob/OXOe/zRahv85c57/NFqG/zRahv85c57/NFqG/zlznv80Wob/OXOe/zRahv85c57/NFqG/zlznv80Wob/OXOe/zRahv85c57/NFqG/zlznv/cLQAA6QM=");l(e,53872,"/Q8AAAAAAAASBAAAAAAAAHAKAAAAAAAAEwQAAAAAAADPIQAABQAAABQEAAArvQwA1yEAAAYAAAAUBAAAK70MAFcGAAAOAAAAFAQAACq9DAAxHwAADQAAABQEAAAsvQwAx0EAAAwAAAAUBAAAKb0MAKNBAAAZAAAAFAQAACm9DAA7RAAAFQAAABQEAAAovQwAkzIAABoAAAAUBAAAAAAAAGcpAAAbAAAAFAQAAAAAAADGOgAAHAAAABQEAAAAAAAAKB4AAAAAAAAVBAAAAAAAAM1vAAAPMkYAFAQAAAAAAADLbwAAEDIKABQEAAAAAAAAzW8AAAQyCgAUBA==");l(e,54188,"SFgcAGBdHAAWBAAAAAAAAH4EAAB+BA==");l(e,54228,"0IQcAAAAgACCBAAAgwQAAIME");l(e,54260,"8XQAAAEAAAAAAAAABQ==");l(e,54284,"mAQ=");l(e,54308,"lgQAAJUEAAAgiBw=");l(e,54332,"Ag==");l(e,54348,"//////////8=");l(e,54417,"1AAAAAAAAAU=");l(e,54436,"mQQ=");l(e,54460,"lgQAAJoEAAAoiBwAAAQ=");l(e,54484,"AQ==");l(e,54500,"/////wo=");l(e,54568,"mNQAAKCOIA==")}var r=new ArrayBuffer(16);var s=new Int32Array(r);var t=new Float32Array(r);var u=new Float64Array(r);function v(w){return s[w]}function x(w,y){s[w]=y}function z(){return u[0]}function A(y){u[0]=y}function B(y){t[2]=y}function C(){throw new Error("abort")}function D(){return t[2]}function jd(q){var E=q.a;var F=E.a;var G=F.buffer;F.grow=hd;var H=new Int8Array(G);var I=new Int16Array(G);var J=new Int32Array(G);var K=new Uint8Array(G);var L=new Uint16Array(G);var M=new Uint32Array(G);var N=new Float32Array(G);var O=new Float64Array(G);var P=Math.imul;var Q=Math.fround;var R=Math.abs;var S=Math.clz32;var T=Math.min;var U=Math.max;var V=Math.floor;var W=Math.ceil;var X=Math.trunc;var Y=Math.sqrt;var Z=E.b;var _=E.c;var $=E.d;var aa=E.e;var ba=E.f;var ca=E.g;var da=E.h;var ea=E.i;var fa=E.j;var ga=E.k;var ha=E.l;var ia=E.m;var ja=E.n;var ka=E.o;var la=E.p;var ma=E.q;var na=E.r;var oa=E.s;var pa=E.t;var qa=E.u;var ra=E.v;var sa=E.w;var ta=E.x;var ua=E.y;var va=E.z;var wa=E.A;var xa=E.B;var ya=E.C;var za=E.D;var Aa=E.E;var Ba=E.F;var Ca=E.G;var Da=E.H;var Ea=E.I;var Fa=E.J;var Ga=E.K;var Ha=E.L;var Ia=E.M;var Ja=E.N;var Ka=E.O;var La=E.P;var Ma=E.Q;var Na=E.R;var Oa=E.S;var Pa=E.T;var Qa=E.U;var Ra=E.V;var Sa=E.W;var Ta=E.X;var Ua=E.Y;var Va=E.Z;var Wa=E._;var Xa=E.$;var Ya=E.aa;var Za=E.ba;var _a=E.ca;var $a=E.da;var ab=E.ea;var bb=E.fa;var cb=E.ga;var db=E.ha;var eb=E.ia;var fb=E.ja;var gb=E.ka;var hb=E.la;var ib=E.ma;var jb=E.na;var kb=E.oa;var lb=E.pa;var mb=E.qa;var nb=E.ra;var ob=E.sa;var pb=E.ta;var qb=E.ua;var rb=E.va;var sb=E.wa;var tb=E.xa;var ub=E.ya;var vb=E.za;var wb=E.Aa;var xb=E.Ba;var yb=E.Ca;var zb=E.Da;var Ab=E.Ea;var Bb=E.Fa;var Cb=E.Ga;var Db=E.Ha;var Eb=E.Ia;var Fb=E.Ja;var Gb=E.Ka;var Hb=E.La;var Ib=E.Ma;var Jb=E.Na;var Kb=E.Oa;var Lb=E.Pa;var Mb=E.Qa;var Nb=E.Ra;var Ob=E.Sa;var Pb=E.Ta;var Qb=E.Ua;var Rb=E.Va;var Sb=E.Wa;var Tb=E.Xa;var Ub=E.Ya;var Vb=E.Za;var Wb=E._a;var Xb=E.$a;var Yb=E.ab;var Zb=E.bb;var _b=E.cb;var $b=E.db;var ac=E.eb;var bc=E.fb;var cc=E.gb;var dc=E.hb;var ec=E.ib;var fc=E.jb;var gc=E.kb;var hc=E.lb;var ic=E.mb;var jc=E.nb;var kc=E.ob;var lc=E.pb;var mc=E.qb;var nc=E.rb;var oc=E.sb;var pc=E.tb;var qc=E.ub;var rc=E.vb;var sc=E.wb;var tc=E.xb;var uc=E.yb;var vc=E.zb;var wc=E.Ab;var xc=E.Bb;var yc=E.Cb;var zc=E.Db;var Ac=E.Eb;var Bc=E.Fb;var Cc=E.Gb;var Dc=E.Hb;var Ec=E.Ib;var Fc=E.Jb;var Gc=E.Kb;var Hc=E.Lb;var Ic=E.Mb;var Jc=E.Nb;var Kc=E.Ob;var Lc=E.Pb;var Mc=E.Qb;var Nc=E.Rb;var Oc=E.Sb;var Pc=E.Tb;var Qc=E.Ub;var Rc=E.Vb;var Sc=E.Wb;var Tc=E.Xb;var Uc=E.Yb;var Vc=E.Zb;var Wc=E._b;var Xc=E.$b;var Yc=E.ac;var Zc=E.bc;var _c=E.cc;var $c=2133664;var ad=0;
// EMSCRIPTEN_START_FUNCS
function sl(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=Q(0),k=Q(0),l=0,m=Q(0),n=Q(0),o=Q(0),p=0,q=Q(0),r=Q(0),s=0,t=0,u=Q(0),v=Q(0),w=0,x=0,y=0,z=0,A=Q(0),B=Q(0),C=Q(0),D=0,E=0,F=0,G=0,S=0,T=0,U=0,V=0,W=0,X=0,_=Q(0);s=$c+-64|0;$c=s;bd[J[J[203292]+8>>2]](1054312);Me(1,1054312);Me(0,1054376);me(s,1054312,1054376);j=N[s+60>>2];A=N[s+48>>2];k=N[s+44>>2];B=N[s+32>>2];o=Q(k-B);m=N[s+12>>2];C=N[s>>2];r=Q(m-C);q=N[s+28>>2];v=N[s+16>>2];u=Q(q-v);n=Q(Y(Q(Q(o*o)+Q(Q(r*r)+Q(u*u)))));N[464790]=Q(j-A)/n;N[464789]=o/n;N[464788]=u/n;N[464787]=r/n;o=Q(k+B);r=Q(m+C);u=Q(q+v);n=Q(Y(Q(Q(o*o)+Q(Q(r*r)+Q(u*u)))));N[464786]=Q(j+A)/n;N[464785]=o/n;N[464784]=u/n;N[464783]=r/n;A=N[s+52>>2];B=N[s+36>>2];o=Q(k-B);C=N[s+4>>2];r=Q(m-C);v=N[s+20>>2];u=Q(q-v);n=Q(Y(Q(Q(o*o)+Q(Q(r*r)+Q(u*u)))));N[464798]=Q(j-A)/n;N[464797]=o/n;N[464796]=u/n;N[464795]=r/n;o=Q(k+B);r=Q(m+C);u=Q(q+v);n=Q(Y(Q(Q(o*o)+Q(Q(r*r)+Q(u*u)))));N[464794]=Q(j+A)/n;N[464793]=o/n;N[464792]=u/n;N[464791]=r/n;v=Q(j-N[s+56>>2]);k=Q(k-N[s+40>>2]);m=Q(m-N[s+8>>2]);q=Q(q-N[s+24>>2]);j=Q(Y(Q(Q(k*k)+Q(Q(m*m)+Q(q*q)))));N[464802]=v/j;N[464801]=k/j;N[464800]=q/j;N[464799]=m/j;if(!K[1040232]&J[260064]!=0){c=$c-272|0;$c=c;a:{if(!J[260065]){e=ih(24);J[260065]=e;e=qe(1,24);Kd(e,32432,576);f=J[464862];while(1){J[(e+P(d,24)|0)+12>>2]=f;d=d+1|0;if((d|0)!=24){continue}break}hh();if(!J[260065]){break a}}Z(0);de(J[260064]);ie(1);e=c+80|0;F=O[131740];j=Q((F+F)*3.1415927410125732);Em(e,Q(N[464857]*j));f=c+144|0;Ai(f,Q(N[464858]*j));d=c+208|0;me(d,e,f);J[c+8>>2]=J[203291];J[203291]=0;e=J[203289];f=J[203290];J[203289]=0;J[203290]=0;J[c>>2]=e;J[c+4>>2]=f;e=c+16|0;bd[J[J[203292]+8>>2]](e);me(d,d,e);J[203291]=J[c+8>>2];e=J[c+4>>2];J[203289]=J[c>>2];J[203290]=e;Me(1,d);Ve(J[260065]);ae(24);Me(1,1054312);Z(1)}$c=c+272|0}d=$c+-64|0;$c=d;if(K[66889]){e=J[16723];if(!e){e=of(0,12);J[16723]=e}c=J[207101];b:{if(K[J[203292]]){k=N[c+12>>2];m=N[c+4>>2];q=Q(1);n=Q(1);v=Q(N[c+8>>2]+Q(.05000000074505806));break b}j=N[203290];k=N[203291];m=N[203289];Wj(d,Q(N[c+20>>2]*Q(.01745329238474369)),Q(N[c+16>>2]*Q(.01745329238474369)));k=Q(k+Q(N[d+8>>2]*Q(.5)));m=Q(m+Q(N[d>>2]*Q(.5)));n=Q(.125);q=Q(.03125);v=Q(j+Q(N[d+4>>2]*Q(.5)))}j=v;N[d+32>>2]=k;N[d+28>>2]=j;o=Q(q*Q(3));N[d+56>>2]=k+o;N[d+52>>2]=j+o;r=Q(n*Q(.03125));N[d+44>>2]=k+r;N[d+40>>2]=j+r;n=Q(n*Q(-.03125));N[d+20>>2]=k+n;N[d+16>>2]=j+n;N[d+24>>2]=m;N[d+48>>2]=m+o;N[d+36>>2]=m+r;N[d+12>>2]=m+n;v=k;k=Q(q*Q(-3));N[d+8>>2]=v+k;N[d+4>>2]=j+k;N[d>>2]=m+k;c=qe(0,12);while(1){e=P(g,3);N[c>>2]=N[d+P(K[e+29952|0],12)>>2];N[c+4>>2]=N[(d+P(K[e+29953|0],12)|0)+4>>2];j=N[(d+P(K[e+29954|0],12)|0)+8>>2];J[c+12>>2]=J[(g&-4)+29988>>2];N[c+8>>2]=j;c=c+16|0;g=g+1|0;if((g|0)!=12){continue}break}ie(0);Pd(J[16723]);ae(12)}$c=d- -64|0;d=0;be(1);while(1){c=J[(d<<2)+827376>>2];if(c){bd[J[J[c>>2]+16>>2]](c,a,b)}d=d+1|0;if((d|0)!=256){continue}break}be(0);c:{if(K[1811800]|!K[828400]){break c}c=J[207101];U=1040216,V=wq(c),J[U>>2]=V;if(!K[c+478|0]|K[828400]!=2){break c}be(1);c=K[1054292];if(c){Bf(0)}d=J[260054];e=0;while(1){f=J[(e<<2)+827376>>2];if(!(!f|(d|0)==(e|0))){_p(f);d=J[260054]}e=e+1|0;if((e|0)!=256){continue}break}be(0);if(!c){break c}Bf(1)}g=0;h=$c-48|0;$c=h;if(!(K[1054308]|!(J[413028]|(J[400098]|J[393492])))){if(!J[420833]){U=1683332,V=of(1,2400),J[U>>2]=V}be(1);ie(1);c=J[400098];d:{if(!c){break d}p=qe(1,c<<2);e=Gd(1684368,0,1024);Gd(1683344,0,1024);d=J[400098];if((d|0)>0){f=J[458159];c=0;while(1){i=e+(L[(c<<6)+1600460>>1]>>>f<<1)|0;I[i>>1]=L[i>>1]+4;c=c+1|0;if((d|0)!=(c|0)){continue}break}}c=1;e=J[458156];if((e|0)>1){while(1){f=c<<1;g=L[f+1684366>>1]+g|0;I[f+1683344>>1]=g;c=c+1|0;if((e|0)!=(c|0)){continue}break}}if((d|0)>0){g=0;while(1){c=g<<6;l=(L[c+1600460>>1]>>>J[458159]<<1)+1683344|0;t=L[l>>1];d=h+8|0;Jh(d,c+1600416|0,c+1600428|0,b);j=Q(N[c+1600440>>2]*Q(.015625));N[h+40>>2]=j;N[h+36>>2]=j;e=-1;f=h+36|0;i=c+1600444|0;w=c+1600462|0;c=L[w>>1];if(!K[c+68432|0]){e=(V=Bd(N[h+8>>2]),W=Bd(N[h+12>>2]),X=Bd(N[h+16>>2]),U=J[266959],bd[U](V|0,W|0,X|0)|0);c=L[w>>1]}if(K[c+83024|0]){e=sd(e,J[(c<<2)+69200>>2])}ok(f,d,i,e,p+P(t,24)|0);I[l>>1]=L[l>>1]+4;g=g+1|0;if((g|0)<J[400098]){continue}break}}g=0;Pd(J[420833]);e=J[458156];if((e|0)<=0){break d}c=0;while(1){d=L[(c<<1)+1684368>>1];if(d){bg(c);he(d,g);g=d+g|0;e=J[458156]}c=c+1|0;if((e|0)>(c|0)){continue}break}}c=J[393492];if(c){c=qe(1,c<<2);if(J[393492]>0){e=0;while(1){f=h+8|0;d=P(e,44);Jh(f,d+1574e3|0,d+1574012|0,b);j=Q(N[d+1574024>>2]*Q(.015625));N[h+40>>2]=j;N[h+36>>2]=j;ok(h+36|0,f,52752,(X=Bd(N[h+8>>2]),W=Bd(N[h+12>>2]),V=Bd(N[h+16>>2]),U=J[266958],bd[U](X|0,W|0,V|0)|0),c);c=c+96|0;e=e+1|0;if((e|0)<J[393492]){continue}break}}de(J[421348]);Pd(J[420833]);ae(J[393492]<<2)}c=J[413028];if(c){g=qe(1,c<<2);if(J[413028]>0){e=0;while(1){f=P(e,52);d=P(J[f+1652172>>2],52)+1638800|0;c=J[d+12>>2];J[h+16>>2]=J[d+8>>2];J[h+20>>2]=c;c=J[d+4>>2];J[h+8>>2]=J[d>>2];J[h+12>>2]=c;j=N[f+1652176>>2];c=Bd(Q(Q(Q(j-N[f+1652140>>2])/j)*Q(K[d+20|0])));k=N[h+16>>2];m=N[h+8>>2];j=Q(Q(k-m)*Q(c|0));N[h+16>>2]=k+j;N[h+8>>2]=m+j;c=h+36|0;Jh(c,f+1652144|0,f+1652156|0,b);j=N[f+1652168>>2];N[h+32>>2]=j;N[h+28>>2]=j;f=Bd(N[h+36>>2]);i=Bd(N[h+40>>2]);l=Bd(N[h+44>>2]);z=h+28|0;y=h+8|0;if(K[d+23|0]){i=-1}else{i=bd[J[266958]](f,i,l)|0}ok(z,c,y,sd(i,J[d+16>>2]),g);g=g+96|0;e=e+1|0;if((e|0)<J[413028]){continue}break}}de(J[421348]);Pd(J[420833]);ae(J[413028]<<2)}be(0)}$c=h+48|0;l=$c+-64|0;$c=l;e:{if(K[1040232]?0:J[260064]){break e}if(!J[260062]){if(!(K[1040232]|!K[1859276])){b=Q(Q(J[12426])*Q(1.4142135381698608));f:{if(Q(R(b))<Q(2147483648)){c=~~b;break f}c=-2147483648}i=c+J[464807]|0;h=c+J[464809]|0;d=Jg(c+i|0,h+c|0);J[260063]=d;d=ih(d);J[260062]=d;f=qe(0,J[260063]);e=0-c|0;if((e|0)<(i|0)){p=K[1054441]&4?8:K[1040328]?128:2048;g=J[464859];c=J[464808]+2|0;d=J[464851];b=Q(((c|0)>(d|0)?c:d)+6|0);c=e;while(1){d=c;c=d+p|0;if((e|0)<(h|0)){j=Q(((c|0)<(i|0)?c:i)|0);k=Q(d|0);d=e;while(1){N[f+48>>2]=j;N[f+32>>2]=j;N[f+16>>2]=k;J[f+12>>2]=g;N[f+4>>2]=b;N[f>>2]=k;J[f+60>>2]=g;m=Q(d|0);N[f+56>>2]=m;N[f+52>>2]=b;J[f+44>>2]=g;N[f+36>>2]=b;J[f+28>>2]=g;N[f+20>>2]=b;N[f+8>>2]=m;d=d+p|0;t=(h|0)>(d|0);m=Q((t?d:h)|0);N[f+40>>2]=m;N[f+24>>2]=m;f=f- -64|0;if(t){continue}break}}if((c|0)<(i|0)){continue}break}}hh()}if(!J[260062]){break e}}b=N[203290];c=J[464808];ie(0);Ve(J[260062]);j=Q(b+Q(8));b=Q(Q(c|0)+Q(8));j=b<j?j:b;if(b==j){ae(J[260063]);break e}c=Qd(l,1054312,64);b=Q(j-b);N[c+52>>2]=Q(b*N[c+20>>2])+N[c+52>>2];N[c+56>>2]=Q(b*N[c+24>>2])+N[c+56>>2];N[c+60>>2]=Q(b*N[c+28>>2])+N[c+60>>2];N[c+48>>2]=Q(b*N[c+16>>2])+N[c+48>>2];Me(1,c);ae(J[260063]);Me(1,1054312)}$c=l- -64|0;g:{if(!J[260059]|J[464851]<-2e3){break g}if(!J[260060]){if(!(K[1040232]|!K[1859276])){b=Q(Q(J[12426])*Q(1.4142135381698608));h:{if(Q(R(b))<Q(2147483648)){c=~~b;break h}c=-2147483648}i=c+J[464807]|0;h=c+J[464809]|0;d=Jg(c+i|0,h+c|0);J[260061]=d;d=ih(d);J[260060]=d;f=qe(1,J[260061]);d=K[1040328];l=K[1054441];p=J[464851];g=J[464861];t=Ge(c,2048);e=0-c|0;if((e|0)<(i|0)){l=l&4?8:d?128:2048;b=Q(Q(p|0)+Q(.10000000149011612));j=Q(t|0);c=e;while(1){d=c;c=d+l|0;if((e|0)<(h|0)){k=Q(d|0);m=Q(Q(k*Q(.00048828125))+j);q=Q(((c|0)<(i|0)?c:i)|0);n=Q(Q(q*Q(.00048828125))+j);d=e;while(1){N[f+72>>2]=q;N[f+48>>2]=q;N[f+24>>2]=k;N[f+16>>2]=m;J[f+12>>2]=g;N[f+4>>2]=b;N[f>>2]=k;N[f+88>>2]=n;J[f+84>>2]=g;o=Q(d|0);N[f+80>>2]=o;N[f+76>>2]=b;N[f- -64>>2]=n;J[f+60>>2]=g;N[f+52>>2]=b;N[f+40>>2]=m;J[f+36>>2]=g;N[f+28>>2]=b;N[f+8>>2]=o;o=Q(Q(o*Q(.00048828125))+j);N[f+92>>2]=o;N[f+20>>2]=o;d=d+l|0;p=(h|0)>(d|0);o=Q((p?d:h)|0);N[f+56>>2]=o;N[f+32>>2]=o;o=Q(Q(o*Q(.00048828125))+j);N[f+68>>2]=o;N[f+44>>2]=o;f=f+96|0;if(p){continue}break}}if((c|0)<(i|0)){continue}break}}hh()}if(!J[260060]){break g}}b=Q(O[131740]*.00048828125*.6000000238418579*+N[464852]);c=0;N[263675]=0;N[263674]=b;H[1054704]=1;while(1){d=(c<<5)+49780|0;J[d>>2]=J[d>>2]|2;c=c+1|0;if((c|0)!=18){continue}break}Fg();be(1);de(J[260059]);ie(1);Ve(J[260060]);ae(J[260061]);be(0);H[1054704]=0;Fg()}d=$c-16|0;$c=d;i:{if(!J[266966]){break i}Ae(d+4|0,813156);c=J[d+8>>2]&-16|8;J[d+8>>2]=c;e=J[d+12>>2]&-16|8;J[d+12>>2]=e;f=J[d+4>>2]&-16|8;J[d+4>>2]=f;j:{if(!((f|0)!=J[268505]|(c|0)!=J[268506])&(e|0)==J[268507]){break j}c=J[d+8>>2];J[268505]=J[d+4>>2];J[268506]=c;J[268507]=J[d+12>>2];i=J[268510];if(!i){break j}if((i|0)>0){c=0;l=J[268514];p=J[268513];while(1){g=c<<2;e=J[g+p>>2];f=L[e+2>>1]-J[d+8>>2]|0;y=g+l|0;g=L[e>>1]-J[d+4>>2]|0;h=L[e+4>>1]-J[d+12>>2]|0;J[y>>2]=(P(f,f)+P(g,g)|0)+P(h,h);H[e+7|0]=(h>>>29&4|(K[e+7|0]&192|(f>>>27&16|(((g|0)<=0)<<1|(g|0)>=0|((f|0)<=0)<<5)|((h|0)<=0)<<3)))^20;c=c+1|0;if((i|0)!=(c|0)){continue}break}}Jk(0,i-1|0);Gd(1070432,1,512);Gd(1069920,0,512);Gd(1073504,1,512);Gd(1072992,0,512)}g=0;c=J[12868]+(a<Q(.04333333671092987)?1:-1)|0;c=(c|0)<=4?4:c;e=J[268515];J[12868]=(c|0)<(e|0)?c:e;J[d+4>>2]=0;f=J[207101];k:{l:{if(N[203289]!=N[268516]|N[203290]!=N[268517]|(N[203291]!=N[268518]|N[f+16>>2]!=N[268519])){break l}if(N[f+20>>2]!=N[268520]){break l}c=0;g=1;if(J[268510]<=0){break k}l=J[268521];p=J[268522];t=p+512|0;i=0;while(1){h=i<<2;e=J[h+J[268513]>>2];g=K[e+6|0];m:{if(g&2){break m}h=J[h+J[268514]>>2];if(!(g&16|(h|0)<(t|0))){Zh(e);break m}n:{if(!(!(g&4)|(h|0)>(p|0)|J[d+4>>2]>=J[12868])){Zh(e);$n(e,d+4|0);g=0;if((h|0)<=(l|0)){g=(Dm(Q(L[e>>1]),Q(L[e+2>>1]),Q(L[e+4>>1]),Q(14))|0)!=0}h=K[e+6|0];H[e+6|0]=h&254|g;if(!g|h&2){break m}break n}if(!(g&1)){break m}}J[J[268512]+(c<<2)>>2]=e;c=c+1|0}g=1;i=i+1|0;if((i|0)<J[268510]){continue}break}break k}if(J[268510]<=0){c=0;break k}p=J[268521];t=J[268522];w=t+512|0;i=0;c=0;while(1){l=i<<2;e=J[l+J[268513]>>2];h=K[e+6|0];o:{if(h&2){break o}l=J[l+J[268514]>>2];if(!(h&16|(l|0)<(w|0))){Zh(e);break o}if(!(!(h&4)|(l|0)>(t|0)|J[d+4>>2]>=J[12868])){Zh(e);$n(e,d+4|0)}if((l|0)<=(p|0)){g=(Dm(Q(L[e>>1]),Q(L[e+2>>1]),Q(L[e+4>>1]),Q(14))|0)!=0}h=K[e+6|0];H[e+6|0]=h&254|g;if(!g|h&2){break o}J[J[268512]+(c<<2)>>2]=e;c=c+1|0}g=0;i=i+1|0;if((i|0)<J[268510]){continue}break}}J[268511]=c;c=J[203290];J[268516]=J[203289];J[268517]=c;J[268518]=J[203291];N[268519]=N[f+16>>2];N[268520]=N[f+20>>2];if(J[d+4>>2]?0:g){break i}Gd(1070432,1,512);Gd(1069920,0,512);Gd(1073504,1,512);Gd(1072992,0,512)}$c=d+16|0;l=$c-16|0;$c=l;if(J[266966]){G=1;ie(1);be(1);d=J[266967];if((d|0)>0){while(1){p:{if(J[(x<<2)+1067872>>2]<=0){break p}S=x+1069920|0;if(!(K[S|0]|K[x+1070432|0])){break p}bg(x);w=0;if(J[268511]>0){y=P(J[268510],x);while(1){p=J[J[268512]+(w<<2)>>2];c=J[p+12>>2];q:{if(!c){break q}d=c+P(y,20)|0;D=J[d>>2];if((D|0)<0){break q}h=L[d+18>>1];c=L[d+16>>1];i=L[d+14>>1];e=L[d+12>>1];E=J[d+4>>2];f=L[d+8>>1];g=L[d+10>>1];H[S|0]=1;Ro(J[p+8>>2]);d=K[p+7|0];T=d>>>1&(g|0)!=0;t=D+E|0;z=(f|0)!=0&d;r:{s:{if(!(!z|!T)){tf(1);d=f+g|0;ve(d,t);tf(0);break s}if(z){ve(f,t);d=f;break s}if(!T){break r}ve(g,f+t|0);d=g}J[263512]=J[263512]+d;d=K[p+7|0]}f=g+(f+t|0)|0;g=d>>>2&(e|0)!=0;t=d>>>3&(i|0)!=0;t:{u:{if(!(!g|!t)){tf(1);d=e+i|0;ve(d,f);tf(0);break u}if(g){ve(e,f);d=e;break u}if(!t){break t}ve(i,e+f|0);d=i}J[263512]=J[263512]+d;d=K[p+7|0]}e=f+(e+i|0)|0;f=d>>>4&(c|0)!=0;d=d>>>5&(h|0)!=0;v:{w:{if(!(!f|!d)){tf(1);c=c+h|0;ve(c,e);tf(0);break w}if(f){ve(c,e);break w}if(!d){break v}ve(h,c+e|0);c=h}J[263512]=J[263512]+c}if(!E){break q}tf(1);d=E>>2;e=d+D|0;c=K[p+7|0];if(c&6){ve(d,D);J[263512]=d+J[263512];c=K[p+7|0]}if(c&9){ve(d,e);J[263512]=d+J[263512];c=K[p+7|0]}e=d+e|0;if(c&5){ve(d,e);J[263512]=d+J[263512];c=K[p+7|0]}if(c&10){ve(d,d+e|0);J[263512]=d+J[263512]}tf(0)}w=w+1|0;if((w|0)<J[268511]){continue}break}}H[x+1070432|0]=0;d=J[266967]}x=x+1|0;if((x|0)<(d|0)){continue}break}}Ae(l+4|0,813156);c=Eh(J[l+4>>2],J[l+8>>2],J[l+12>>2]);e=J[l+8>>2];if((e|0)>=0){G=M[464807]<=M[l+4>>2]|M[464809]<=M[l+12>>2]}d=1;d=K[c+80720|0]!=3?(e|0)<J[464849]&G:d;H[1074016]=d;if(!(!d|!J[464855])){We(1);Wp(a);We(0)}be(0)}$c=l+16|0;e=0;d=J[260076];x:{if(!d){c=$c-80|0;$c=c;y:{if(!K[1859276]|K[1054441]&16){break y}i=L[929697];if(K[i+80720|0]==4){break y}d=J[464809];J[c+76>>2]=d;J[c+68>>2]=0;J[c+60>>2]=d;J[c+52>>2]=0;J[c+36>>2]=d;b=Q(Q(J[12426])*Q(1.4142135381698608));z:{if(Q(R(b))<Q(2147483648)){d=~~b;break z}d=-2147483648}J[c+72>>2]=d;J[c+56>>2]=d;J[c+44>>2]=d;f=J[464807];g=f+(d<<1)|0;J[c+40>>2]=g;J[c+64>>2]=f;J[c+28>>2]=d;d=0-d|0;J[c+20>>2]=d;J[c+16>>2]=d;J[c+48>>2]=d;J[c+32>>2]=d;J[c+24>>2]=g;J[260078]=0;while(1){d=(c+16|0)+(e<<4)|0;U=1040312,V=Jg(J[d+8>>2],J[d+12>>2])+J[260078]|0,J[U>>2]=V;e=e+1|0;if((e|0)!=4){continue}break}e=J[464850];f=J[464849];d=0;U=1040312,V=Jg(J[464807],J[464809])+J[260078]|0,J[U>>2]=V;f=e+f|0;e=f>>31;e=(e^f)-e|0;g=Jg(J[464807],e);J[260078]=J[260078]+(g<<1);e=Jg(J[464809],e);e=J[260078]+(e<<1)|0;J[260078]=e;e=ih(e);J[260076]=e;U=c,V=qe(1,J[260078]),J[U+12>>2]=V;g=i+66896|0;e=K[g+1536|0]?-1:J[464867];if(K[g+16128|0]){e=sd(e,J[(i<<2)+69200>>2])}i=P(i,12)+66896|0;g=i+18436|0;h=i+36868|0;b=Q(f|0);while(1){i=(c+16|0)+(d<<4)|0;l=J[i>>2];p=J[i+4>>2];z=l+J[i+8>>2]|0;y=p+J[i+12>>2]|0;i=c+12|0;Jl(l,p,z,y,b,e,Q(0),Q(N[h>>2]-N[g>>2]),i);d=d+1|0;if((d|0)!=4){continue}break}Jl(0,0,J[464807],J[464809],Q(0),e,Q(0),Q(0),i);d=f&f>>31;f=(f|0)>0?f:0;Up(0,J[464807],d,f,e,i);Up(J[464809],J[464807],d,f,e,i);Tp(0,J[464809],d,f,e,i);Tp(J[464807],J[464809],d,f,e,i);hh()}$c=c+80|0;d=J[260076];if(!d){break x}}Vp(L[929697],d,J[260077],J[260078])}c=0;d=$c-65552|0;$c=d;if(K[828401]){H[1040206]=0;if(!J[260052]){J[d+8>>2]=128;J[d+12>>2]=128;J[d+4>>2]=d+16;while(1){f=(d+16|0)+(c<<9)|0;b=Q(Q(64)-Q(Q(c>>>0)+Q(.5)));b=Q(b*b);e=0;while(1){j=Q(Q(64)-Q(Q(e>>>0)+Q(.5)));J[f+(e<<2)>>2]=Q(Q(j*j)+b)<Q(4096)?-939524096:0;e=e+1|0;if((e|0)!=128){continue}break}c=c+1|0;if((c|0)!=128){continue}break}U=1040208,V=qj(d+4|0,0,0),J[U>>2]=V}if(!J[260053]){U=1040212,V=of(1,208),J[U>>2]=V}e=0;Z(0);We(1);ie(1);$p(J[207101]);if(K[828401]==3){while(1){c=J[(e<<2)+827376>>2];if(!(!c|!K[c+55|0]|(c|0)==J[207101])){$p(c)}e=e+1|0;if((e|0)!=256){continue}break}}Z(1);We(0)}$c=d+65552|0;if(!(K[1054203]|!K[1054180])){Ps(1)}A:{B:{if(!(N[203290]<Q(J[464849]))){break B}b=N[203289];C:{if(b<Q(0)){break C}j=N[203291];if(j<Q(0)|b>Q(J[464807])){break C}if(!(j>Q(J[464809]))){break B}}bo(a);Sp();break A}Sp();bo(a)}if(!(K[1054203]|!K[1054180]|K[L[527058]+80720|0]!=3)){Ps(0)}e=0;i=0;f=$c-32|0;$c=f;d=J[452740];if(d){if((d|0)>0){o=N[203291];r=N[203290];u=N[203289];while(1){c=P(e,36);b=Q(u-N[c+1801744>>2]);b=Q(b*b);j=Q(u-N[c+1801756>>2]);j=Q(j*j);k=Q(r-N[c+1801748>>2]);k=Q(k*k);m=Q(r-N[c+1801760>>2]);m=Q(m*m);q=Q(o-N[c+1801752>>2]);q=Q(q*q);n=Q(o-N[c+1801764>>2]);n=Q(n*n);N[c+1801776>>2]=Q((b>j?b:j)+(k>m?k:m))+(n<q?q:n);N[c+1801772>>2]=Q((b<j?b:j)+(k<m?k:m))+(n>q?q:n);e=e+1|0;if((d|0)!=(e|0)){continue}break}}Zm(0,d-1|0);if(!J[452808]){U=1811232,V=of(0,6144),J[U>>2]=V;U=1811236,V=of(0,6144),J[U>>2]=V}c=J[452740];ie(0);g=P(c,24);c=qe(0,g);l=J[452740];if((l|0)>0){while(1){d=P(i,36);b=N[d+1801772>>2]<Q(1024)?Q(.03125):Q(.0625);N[f>>2]=N[d+1801744>>2]-b;N[f+4>>2]=N[d+1801748>>2]-b;N[f+8>>2]=N[d+1801752>>2]-b;N[f+12>>2]=b+N[d+1801756>>2];N[f+16>>2]=b+N[d+1801760>>2];N[f+20>>2]=b+N[d+1801764>>2];p=J[d+1801768>>2]^16777215;d=c;e=0;while(1){h=K[e+41648|0];N[d>>2]=N[(f|P(h&1,12))>>2];N[d+4>>2]=N[(f|P(h>>>1&1,12))+4>>2];b=N[(f+P(h>>>2|0,12)|0)+8>>2];J[d+12>>2]=p;N[d+8>>2]=b;d=d+16|0;e=e+1|0;if((e|0)!=24){continue}break}c=c+384|0;i=i+1|0;if((l|0)!=(i|0)){continue}break}}Pd(J[452809]);bd[J[263677]]();ac(1,0,g|0);c=qe(0,g);l=J[452740];if((l|0)>0){i=0;while(1){d=P(i,36);b=N[d+1801772>>2]<Q(1024)?Q(.03125):Q(.0625);N[f>>2]=N[d+1801744>>2]-b;N[f+4>>2]=N[d+1801748>>2]-b;N[f+8>>2]=N[d+1801752>>2]-b;N[f+12>>2]=b+N[d+1801756>>2];N[f+16>>2]=b+N[d+1801760>>2];N[f+20>>2]=b+N[d+1801764>>2];p=J[d+1801768>>2];e=0;d=c;while(1){h=K[e+41680|0];N[d>>2]=N[(f|P(h&1,12))>>2];N[d+4>>2]=N[(f|P(h>>>1&1,12))+4>>2];b=N[(f+P(h>>>2|0,12)|0)+8>>2];J[d+12>>2]=p;N[d+8>>2]=b;d=d+16|0;e=e+1|0;if((e|0)!=24){continue}break}c=c+384|0;i=i+1|0;if((l|0)!=(i|0)){continue}break}}Pd(J[452808]);Z(0);We(1);ae(g);Z(1);We(0)}$c=f+32|0;e=0;f=0;c=0;d=K[828400];D:{if(K[1811800]|!d){break D}i=J[207101];f=d>>>0>=3?K[i+478|0]!=0:f;d=1;E:{F:while(1){h=J[260054];while(1){g=J[(e<<2)+827376>>2];if(!(!((e|0)==(h|0)|f)|(!g|(g|0)==(i|0)))){G:{if(!d){break G}be(1);c=0;lh(0);Z(0);d=K[1054292];if(!d){break G}Bf(0);c=d}_p(g);d=0;e=e+1|0;if((e|0)!=256){continue F}break E}e=e+1|0;if((e|0)!=256){continue}break}break}if(d){break D}}be(0);lh(1);Z(1);if(!(c&255)){break D}Bf(1)}if(!K[1054203]){f=$c-128|0;$c=f;if(K[1054880]){I[527444]=L[(J[266937]+J[266938]<<1)+1066048>>1];m=N[263721];J[263721]=0;i=Qd(f,1054312,64);Me(0,1054892);c=i- -64|0;ag(c,Q(-0),Q(-Dq(J[207101])),Q(-0));me(1054312,c,813084);c=J[207101];b=Dq(c);J[263746]=0;J[263747]=-1036779520;J[263744]=0;J[263745]=-1036779520;I[527506]=L[527444];j=Q(Q(0)-N[203288]);N[263743]=j;N[263742]=b-N[203287];N[263741]=j;H[1055068]=K[c+108|0];J[263768]=J[c+112>>2];H[1055076]=K[c+116|0];N[263770]=N[c+120>>2];N[263771]=N[c+124>>2];H:{if(!K[1054874]){break H}c=K[1054873];d=K[1054872];j=Q(N[263719]/N[12606]);k=Jd(Q(j*Q(3.1415927410125732)));I:{if(c?d:1){b=Q(k*Q(-.4000000059604645));N[263721]=b;N[263742]=b+N[263742];if(!K[1054872]){break I}J:{if(!(b>m)){d=L[527478];break J}d=L[527444];I[527478]=d}I[527506]=d;I[527444]=d;break I}b=Q(Q(Y(j))*Q(3.1415927410125732));m=Jd(b);N[263741]=N[263741]+Q(m*Q(-.4000000059604645));U=1054968,_=Q(Q(Jd(Q(b+b))*Q(.20000000298023224))+N[263742]),N[U>>2]=_;N[263743]=N[263743]-Q(k*Q(.20000000298023224));j=Jd(Q(Q(j*j)*Q(3.1415927410125732)));k=Jd(b);N[263747]=N[263747]-Q(k*Q(80));b=Jd(b);N[263745]=N[263745]-Q(b*Q(80));N[263746]=Q(j*Q(20))+N[263746]}a=Q(N[263719]+a);N[263719]=a;if(!(a>N[12606])){break H}J[12606]=1048576e3;I[527478]=L[(J[266937]+J[266938]<<1)+1066048>>1];J[263721]=0;J[263719]=0;H[1054874]=0;H[1054872]=0}N[263743]=N[263743]+Q(-.7200000286102295);c=L[527444];d=K[c+80720|0];e=(d|0)==5;a=Q((e?Q(-.5199999809265137):Q(-.7200000286102295))+N[263742]);N[263742]=a;N[263741]=N[263741]+(e?Q(.46000000834465027):Q(.5600000023841858));if((d&254)!=4){c=P(c,12)+66896|0;N[263742]=Q(Q(Q(N[c+18436>>2]-N[c+27652>>2])+Q(1))*Q(.20000000298023224))+a}if(!K[J[203292]]){tf(1);lh(0);c=K[L[527444]+80720|0];K:{if((c|0)==4){d=J[J[207101]+48>>2];J[263762]=1065353216;J[263760]=1065353216;J[263761]=1065353216;c=$c-176|0;$c=c;J[c+40>>2]=J[263743];e=J[263742];J[c+32>>2]=J[263741];J[c+36>>2]=e;if(K[d+43|0]){N[c+36>>2]=N[263772]+N[c+36>>2]}wk(d,1054960);ie(1);yf(1054960);g=c+48|0;a=Q(Q(0-K[d+40|0]|0)*Q(.0625));e=K[1092886];ag(g,e?a:Q(a+Q(.10000000149011612)),Q(Q(Q(0-K[d+41|0]|0)*Q(.0625))+(e?Q(-.10000000149011612):Q(-.25999999046325684))),Q(0));J[c+24>>2]=J[c+40>>2];e=J[c+36>>2];J[c+16>>2]=J[c+32>>2];J[c+20>>2]=e;J[c+8>>2]=J[263762];e=J[263761];J[c>>2]=J[263760];J[c+4>>2]=e;e=c+112|0;ui(1054960,c+16|0,c,e);me(e,e,1054312);me(e,g,e);Me(1,e);H[1092884]=2;bd[J[d+52>>2]](1054960);H[1092884]=0;Me(1,1054312);$c=c+176|0;be(0);break K}J[263762]=1053609165;J[263760]=1053609165;J[263761]=1053609165;d=J[273227];hp(c);sn(d,1054960);gp(K[L[527444]+80720|0])}lh(1);tf(0)}Qd(1054312,i,64);Me(0,1054376)}$c=f+128|0}$c=s- -64|0}function xh(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;l=$c-16|0;$c=l;a:{b:{c:{d:{e:{f:{g:{h:{i:{if(a>>>0<=244){g=J[467755];h=a>>>0<11?16:a+11&-8;c=h>>>3|0;b=g>>>c|0;if(b&3){c=c+((b^-1)&1)|0;a=c<<3;b=a+1871060|0;d=J[a+1871068>>2];a=J[d+8>>2];j:{if((b|0)==(a|0)){m=1871020,n=HN(c)&g,J[m>>2]=n;break j}J[a+12>>2]=b;J[b+8>>2]=a}a=d+8|0;b=c<<3;J[d+4>>2]=b|3;b=b+d|0;J[b+4>>2]=J[b+4>>2]|1;break a}k=J[467757];if(k>>>0>=h>>>0){break i}if(b){a=2<<c;d=FN((0-a|a)&b<<c);a=d<<3;b=a+1871060|0;e=J[a+1871068>>2];a=J[e+8>>2];k:{if((b|0)==(a|0)){g=HN(d)&g;J[467755]=g;break k}J[a+12>>2]=b;J[b+8>>2]=a}J[e+4>>2]=h|3;c=e+h|0;a=d<<3;d=a-h|0;J[c+4>>2]=d|1;J[a+e>>2]=d;if(k){b=(k&-8)+1871060|0;f=J[467760];a=1<<(k>>>3);l:{if(!(a&g)){J[467755]=a|g;a=b;break l}a=J[b+8>>2]}J[b+8>>2]=f;J[a+12>>2]=f;J[f+12>>2]=b;J[f+8>>2]=a}a=e+8|0;J[467760]=c;J[467757]=d;break a}j=J[467756];if(!j){break i}c=J[(FN(j)<<2)+1871324>>2];e=(J[c+4>>2]&-8)-h|0;b=c;while(1){m:{a=J[b+16>>2];if(!a){a=J[b+20>>2];if(!a){break m}}b=(J[a+4>>2]&-8)-h|0;d=b>>>0<e>>>0;e=d?b:e;c=d?a:c;b=a;continue}break}i=J[c+24>>2];d=J[c+12>>2];if((d|0)!=(c|0)){a=J[c+8>>2];J[a+12>>2]=d;J[d+8>>2]=a;break b}b=c+20|0;a=J[b>>2];if(!a){a=J[c+16>>2];if(!a){break h}b=c+16|0}while(1){f=b;d=a;b=a+20|0;a=J[b>>2];if(a){continue}b=d+16|0;a=J[d+16>>2];if(a){continue}break}J[f>>2]=0;break b}h=-1;if(a>>>0>4294967231){break i}a=a+11|0;h=a&-8;j=J[467756];if(!j){break i}e=0-h|0;g=0;n:{if(h>>>0<256){break n}g=31;if(h>>>0>16777215){break n}a=S(a>>>8|0);g=((h>>>38-a&1)-(a<<1)|0)+62|0}b=J[(g<<2)+1871324>>2];o:{p:{q:{if(!b){a=0;break q}a=0;c=h<<((g|0)!=31?25-(g>>>1|0)|0:0);while(1){r:{f=(J[b+4>>2]&-8)-h|0;if(f>>>0>=e>>>0){break r}d=b;e=f;if(e){break r}e=0;a=b;break p}f=J[b+20>>2];b=J[((c>>>29&4)+b|0)+16>>2];a=f?(f|0)==(b|0)?a:f:a;c=c<<1;if(b){continue}break}}if(!(a|d)){d=0;a=2<<g;a=(0-a|a)&j;if(!a){break i}a=J[(FN(a)<<2)+1871324>>2]}if(!a){break o}}while(1){b=(J[a+4>>2]&-8)-h|0;c=b>>>0<e>>>0;e=c?b:e;d=c?a:d;b=J[a+16>>2];if(b){a=b}else{a=J[a+20>>2]}if(a){continue}break}}if(!d|J[467757]-h>>>0<=e>>>0){break i}g=J[d+24>>2];c=J[d+12>>2];if((d|0)!=(c|0)){a=J[d+8>>2];J[a+12>>2]=c;J[c+8>>2]=a;break c}b=d+20|0;a=J[b>>2];if(!a){a=J[d+16>>2];if(!a){break g}b=d+16|0}while(1){f=b;c=a;b=a+20|0;a=J[b>>2];if(a){continue}b=c+16|0;a=J[c+16>>2];if(a){continue}break}J[f>>2]=0;break c}a=J[467757];if(a>>>0>=h>>>0){d=J[467760];b=a-h|0;s:{if(b>>>0>=16){c=d+h|0;J[c+4>>2]=b|1;J[a+d>>2]=b;J[d+4>>2]=h|3;break s}J[d+4>>2]=a|3;a=a+d|0;J[a+4>>2]=J[a+4>>2]|1;c=0;b=0}J[467757]=b;J[467760]=c;a=d+8|0;break a}i=J[467758];if(i>>>0>h>>>0){b=i-h|0;J[467758]=b;c=J[467761];a=c+h|0;J[467761]=a;J[a+4>>2]=b|1;J[c+4>>2]=h|3;a=c+8|0;break a}a=0;e=h+47|0;if(J[467873]){c=J[467875]}else{J[467876]=-1;J[467877]=-1;J[467874]=4096;J[467875]=4096;J[467873]=l+12&-16^1431655768;J[467878]=0;J[467866]=0;c=4096}g=e+c|0;f=0-c|0;b=g&f;if(b>>>0<=h>>>0){break a}d=J[467865];if(d){c=J[467863];j=c+b|0;if(d>>>0<j>>>0|c>>>0>=j>>>0){break a}}t:{if(!(K[1871464]&4)){u:{v:{w:{x:{d=J[467761];if(d){a=1871468;while(1){c=J[a>>2];if(c>>>0<=d>>>0&d>>>0<c+J[a+4>>2]>>>0){break x}a=J[a+8>>2];if(a){continue}break}}c=yh(0);if((c|0)==-1){break u}g=b;d=J[467874];a=d-1|0;if(a&c){g=(b-c|0)+(a+c&0-d)|0}if(g>>>0<=h>>>0){break u}d=J[467865];if(d){a=J[467863];f=a+g|0;if(d>>>0<f>>>0|a>>>0>=f>>>0){break u}}a=yh(g);if((c|0)!=(a|0)){break w}break t}g=f&g-i;c=yh(g);if((c|0)==(J[a>>2]+J[a+4>>2]|0)){break v}a=c}if((a|0)==-1){break u}if(h+48>>>0<=g>>>0){c=a;break t}c=J[467875];c=c+(e-g|0)&0-c;if((yh(c)|0)==-1){break u}g=c+g|0;c=a;break t}if((c|0)!=-1){break t}}J[467866]=J[467866]|4}c=yh(b);a=yh(0);if((c|0)==-1|(a|0)==-1|a>>>0<=c>>>0){break d}g=a-c|0;if(g>>>0<=h+40>>>0){break d}}a=J[467863]+g|0;J[467863]=a;if(a>>>0>M[467864]){J[467864]=a}y:{e=J[467761];if(e){a=1871468;while(1){d=J[a>>2];b=J[a+4>>2];if((d+b|0)==(c|0)){break y}a=J[a+8>>2];if(a){continue}break}break f}a=J[467759];if(!(a>>>0<=c>>>0?a:0)){J[467759]=c}a=0;J[467868]=g;J[467867]=c;J[467763]=-1;J[467764]=J[467873];J[467870]=0;while(1){d=a<<3;b=d+1871060|0;J[d+1871068>>2]=b;J[d+1871072>>2]=b;a=a+1|0;if((a|0)!=32){continue}break}d=g-40|0;a=-8-c&7;b=d-a|0;J[467758]=b;a=a+c|0;J[467761]=a;J[a+4>>2]=b|1;J[(c+d|0)+4>>2]=40;J[467762]=J[467877];break e}if(J[a+12>>2]&8|(c>>>0<=e>>>0|d>>>0>e>>>0)){break f}J[a+4>>2]=b+g;a=-8-e&7;c=a+e|0;J[467761]=c;b=J[467758]+g|0;a=b-a|0;J[467758]=a;J[c+4>>2]=a|1;J[(b+e|0)+4>>2]=40;J[467762]=J[467877];break e}d=0;break b}c=0;break c}if(M[467759]>c>>>0){J[467759]=c}b=c+g|0;a=1871468;z:{A:{B:{while(1){if((b|0)!=J[a>>2]){a=J[a+8>>2];if(a){continue}break B}break}if(!(K[a+12|0]&8)){break A}}a=1871468;while(1){C:{b=J[a>>2];if(b>>>0<=e>>>0){f=b+J[a+4>>2]|0;if(f>>>0>e>>>0){break C}}a=J[a+8>>2];continue}break}d=g-40|0;a=-8-c&7;b=d-a|0;J[467758]=b;a=a+c|0;J[467761]=a;J[a+4>>2]=b|1;J[(c+d|0)+4>>2]=40;J[467762]=J[467877];a=(f+(39-f&7)|0)-47|0;d=a>>>0<e+16>>>0?e:a;J[d+4>>2]=27;a=J[467870];J[d+16>>2]=J[467869];J[d+20>>2]=a;a=J[467868];J[d+8>>2]=J[467867];J[d+12>>2]=a;J[467869]=d+8;J[467868]=g;J[467867]=c;J[467870]=0;a=d+24|0;while(1){J[a+4>>2]=7;b=a+8|0;a=a+4|0;if(b>>>0<f>>>0){continue}break}if((d|0)==(e|0)){break e}J[d+4>>2]=J[d+4>>2]&-2;f=d-e|0;J[e+4>>2]=f|1;J[d>>2]=f;if(f>>>0<=255){b=(f&-8)+1871060|0;c=J[467755];a=1<<(f>>>3);D:{if(!(c&a)){J[467755]=a|c;a=b;break D}a=J[b+8>>2]}J[b+8>>2]=e;J[a+12>>2]=e;J[e+12>>2]=b;J[e+8>>2]=a;break e}a=31;if(f>>>0<=16777215){a=S(f>>>8|0);a=((f>>>38-a&1)-(a<<1)|0)+62|0}J[e+28>>2]=a;J[e+16>>2]=0;J[e+20>>2]=0;b=(a<<2)+1871324|0;d=J[467756];c=1<<a;E:{if(!(d&c)){J[467756]=c|d;J[b>>2]=e;break E}a=f<<((a|0)!=31?25-(a>>>1|0)|0:0);d=J[b>>2];while(1){b=d;if((f|0)==(J[b+4>>2]&-8)){break z}c=a>>>29|0;a=a<<1;c=(c&4)+b|0;d=J[c+16>>2];if(d){continue}break}J[c+16>>2]=e}J[e+24>>2]=b;J[e+12>>2]=e;J[e+8>>2]=e;break e}J[a>>2]=c;J[a+4>>2]=J[a+4>>2]+g;j=(-8-c&7)+c|0;J[j+4>>2]=h|3;e=b+(-8-b&7)|0;i=h+j|0;g=e-i|0;F:{if(J[467761]==(e|0)){J[467761]=i;a=J[467758]+g|0;J[467758]=a;J[i+4>>2]=a|1;break F}if(J[467760]==(e|0)){J[467760]=i;a=J[467757]+g|0;J[467757]=a;J[i+4>>2]=a|1;J[a+i>>2]=a;break F}c=J[e+4>>2];if((c&3)==1){f=c&-8;G:{if(c>>>0<=255){b=J[e+12>>2];a=J[e+8>>2];if((b|0)==(a|0)){m=1871020,n=J[467755]&HN(c>>>3|0),J[m>>2]=n;break G}J[a+12>>2]=b;J[b+8>>2]=a;break G}h=J[e+24>>2];a=J[e+12>>2];H:{if((e|0)!=(a|0)){b=J[e+8>>2];J[b+12>>2]=a;J[a+8>>2]=b;break H}I:{b=e+20|0;c=J[b>>2];if(!c){c=J[e+16>>2];if(!c){break I}b=e+16|0}while(1){d=b;a=c;b=a+20|0;c=J[b>>2];if(c){continue}b=a+16|0;c=J[a+16>>2];if(c){continue}break}J[d>>2]=0;break H}a=0}if(!h){break G}c=J[e+28>>2];b=(c<<2)+1871324|0;J:{if(J[b>>2]==(e|0)){J[b>>2]=a;if(a){break J}m=1871024,n=J[467756]&HN(c),J[m>>2]=n;break G}J[h+(J[h+16>>2]==(e|0)?16:20)>>2]=a;if(!a){break G}}J[a+24>>2]=h;b=J[e+16>>2];if(b){J[a+16>>2]=b;J[b+24>>2]=a}b=J[e+20>>2];if(!b){break G}J[a+20>>2]=b;J[b+24>>2]=a}g=f+g|0;e=e+f|0;c=J[e+4>>2]}J[e+4>>2]=c&-2;J[i+4>>2]=g|1;J[g+i>>2]=g;if(g>>>0<=255){b=(g&-8)+1871060|0;c=J[467755];a=1<<(g>>>3);K:{if(!(c&a)){J[467755]=a|c;a=b;break K}a=J[b+8>>2]}J[b+8>>2]=i;J[a+12>>2]=i;J[i+12>>2]=b;J[i+8>>2]=a;break F}c=31;if(g>>>0<=16777215){a=S(g>>>8|0);c=((g>>>38-a&1)-(a<<1)|0)+62|0}J[i+28>>2]=c;J[i+16>>2]=0;J[i+20>>2]=0;b=(c<<2)+1871324|0;L:{d=J[467756];a=1<<c;M:{if(!(d&a)){J[467756]=a|d;J[b>>2]=i;break M}c=g<<((c|0)!=31?25-(c>>>1|0)|0:0);a=J[b>>2];while(1){b=a;if((J[a+4>>2]&-8)==(g|0)){break L}d=c>>>29|0;c=c<<1;d=(d&4)+a|0;a=J[d+16>>2];if(a){continue}break}J[d+16>>2]=i}J[i+24>>2]=b;J[i+12>>2]=i;J[i+8>>2]=i;break F}a=J[b+8>>2];J[a+12>>2]=i;J[b+8>>2]=i;J[i+24>>2]=0;J[i+12>>2]=b;J[i+8>>2]=a}a=j+8|0;break a}a=J[b+8>>2];J[a+12>>2]=e;J[b+8>>2]=e;J[e+24>>2]=0;J[e+12>>2]=b;J[e+8>>2]=a}a=J[467758];if(a>>>0<=h>>>0){break d}b=a-h|0;J[467758]=b;c=J[467761];a=c+h|0;J[467761]=a;J[a+4>>2]=b|1;J[c+4>>2]=h|3;a=c+8|0;break a}J[467445]=48;a=0;break a}N:{if(!g){break N}b=J[d+28>>2];a=(b<<2)+1871324|0;O:{if(J[a>>2]==(d|0)){J[a>>2]=c;if(c){break O}j=HN(b)&j;J[467756]=j;break N}J[g+(J[g+16>>2]==(d|0)?16:20)>>2]=c;if(!c){break N}}J[c+24>>2]=g;a=J[d+16>>2];if(a){J[c+16>>2]=a;J[a+24>>2]=c}a=J[d+20>>2];if(!a){break N}J[c+20>>2]=a;J[a+24>>2]=c}P:{if(e>>>0<=15){a=e+h|0;J[d+4>>2]=a|3;a=a+d|0;J[a+4>>2]=J[a+4>>2]|1;break P}J[d+4>>2]=h|3;f=d+h|0;J[f+4>>2]=e|1;J[e+f>>2]=e;if(e>>>0<=255){b=(e&-8)+1871060|0;c=J[467755];a=1<<(e>>>3);Q:{if(!(c&a)){J[467755]=a|c;a=b;break Q}a=J[b+8>>2]}J[b+8>>2]=f;J[a+12>>2]=f;J[f+12>>2]=b;J[f+8>>2]=a;break P}a=31;if(e>>>0<=16777215){a=S(e>>>8|0);a=((e>>>38-a&1)-(a<<1)|0)+62|0}J[f+28>>2]=a;J[f+16>>2]=0;J[f+20>>2]=0;b=(a<<2)+1871324|0;R:{c=1<<a;S:{if(!(c&j)){J[467756]=c|j;J[b>>2]=f;break S}a=e<<((a|0)!=31?25-(a>>>1|0)|0:0);h=J[b>>2];while(1){b=h;if((J[b+4>>2]&-8)==(e|0)){break R}c=a>>>29|0;a=a<<1;c=(c&4)+b|0;h=J[c+16>>2];if(h){continue}break}J[c+16>>2]=f}J[f+24>>2]=b;J[f+12>>2]=f;J[f+8>>2]=f;break P}a=J[b+8>>2];J[a+12>>2]=f;J[b+8>>2]=f;J[f+24>>2]=0;J[f+12>>2]=b;J[f+8>>2]=a}a=d+8|0;break a}T:{if(!i){break T}b=J[c+28>>2];a=(b<<2)+1871324|0;U:{if(J[a>>2]==(c|0)){J[a>>2]=d;if(d){break U}m=1871024,n=HN(b)&j,J[m>>2]=n;break T}J[i+(J[i+16>>2]==(c|0)?16:20)>>2]=d;if(!d){break T}}J[d+24>>2]=i;a=J[c+16>>2];if(a){J[d+16>>2]=a;J[a+24>>2]=d}a=J[c+20>>2];if(!a){break T}J[d+20>>2]=a;J[a+24>>2]=d}V:{if(e>>>0<=15){a=e+h|0;J[c+4>>2]=a|3;a=a+c|0;J[a+4>>2]=J[a+4>>2]|1;break V}J[c+4>>2]=h|3;d=c+h|0;J[d+4>>2]=e|1;J[d+e>>2]=e;if(k){b=(k&-8)+1871060|0;f=J[467760];a=1<<(k>>>3);W:{if(!(a&g)){J[467755]=a|g;a=b;break W}a=J[b+8>>2]}J[b+8>>2]=f;J[a+12>>2]=f;J[f+12>>2]=b;J[f+8>>2]=a}J[467760]=d;J[467757]=e}a=c+8|0}$c=l+16|0;return a|0}function RA(){var a=0,b=0,c=0,d=0,e=0,f=Q(0),g=0,h=0,i=0,j=0,k=Q(0),l=0,m=0,n=0,o=Q(0),p=0,q=Q(0),r=Q(0),s=Q(0),t=Q(0),u=Q(0),v=0,w=Q(0),x=Q(0),y=Q(0),z=Q(0),A=Q(0),B=Q(0),C=Q(0),D=Q(0);m=$c-20528|0;$c=m;a:{b:{c:{d:{e:{f:{g:{h:{i:{j:{k:{l:{m:{n:{o:{switch(J[263564]){case 5:break j;case 4:break k;case 3:break l;case 2:break m;case 1:break n;case 0:break o;case 12:break c;case 11:break d;case 10:break e;case 9:break f;case 8:break g;case 7:break h;case 6:break i;default:break b}}og(m+12320|0,8);j=m+16420|0;og(j,8);og(m+4112|0,8);i=m+8212|0;og(i,8);og(m+12|0,6);J[263563]=8097;h=J[464809];if((h|0)>0){g=J[263572];r=Q(h|0);c=J[263571];s=Q(J[263570]);n=J[464807];l=(n|0)<=0;while(1){q=Q(e|0);N[263562]=q/r;if(!l){k=Q(q*Q(1.2999999523162842));b=0;while(1){t=Q(b|0);o=Q(t*Q(1.2999999523162842));f=Q(Q(ng(m+12320|0,Q(o+ng(j,o,k)),k)/Q(6))+Q(-4));if(ng(m+12|0,t,q)<=Q(0)){o=Q(Q(ng(m+4112|0,Q(o+ng(i,o,k)),k)/Q(5))+Q(6));f=f>o?f:o}f=Q(f*Q(.5));f=Q((f<Q(0)?Q(f*Q(.800000011920929)):f)+s);p:{if(Q(R(f))<Q(2147483648)){a=~~f;break p}a=-2147483648}c=(a|0)>(c|0)?c:a;J[263571]=c;I[g+(d<<1)>>1]=a;d=d+1|0;b=b+1|0;if((n|0)!=(b|0)){continue}break}}e=e+1|0;if((h|0)!=(e|0)){continue}break}}J[263564]=J[263564]+1;b=se();a=ad;if((Oe(J[263566],J[263567],b,a)|0)<101){break n}J[263566]=b;J[263567]=a;break a}J[263563]=8166;J[263562]=0;d=J[464811];c=J[464813];je(J[263559],11,c);a=J[263571];b=a-14|0;q:{if((a|0)>14){a=1;while(1){je(J[263559]+P(a,c)|0,1,c);e=J[464808];N[263562]=Q(a|0)/Q(e|0);h=(a|0)!=(b|0);a=a+1|0;if(h){continue}break}break q}e=J[464808]}a=((b|0)>0?b:0)+1|0;if((e|0)>(a|0)){while(1){je(J[263559]+P(a,c)|0,0,c);e=J[464808];N[263562]=Q(a|0)/Q(e|0);a=a+1|0;if((e|0)>(a|0)){continue}break}}og(m+12320|0,8);J[263563]=17370;a=J[464809];if((a|0)>0){e=(b|0)<=1?1:b;b=J[464807];l=J[263572];i=0;j=0;while(1){f=Q(i|0);N[263562]=f/Q(a|0);h=0;if((b|0)>0){while(1){g=I[l+(j<<1)>>1];k=Q(Q(ng(m+12320|0,Q(h|0),f)/Q(24))+Q(-4));r:{if(Q(R(k))<Q(2147483648)){a=~~k;break r}a=-2147483648}c=J[464809];a=a+g|0;n=(a|0)<(d|0)?a:d;if((n|0)>=(e|0)){a=P(P(c,e)+i|0,b)+h|0;b=e;while(1){H[J[263559]+a|0]=1;a=J[464813]+a|0;c=(b|0)!=(n|0);b=b+1|0;if(c){continue}break}c=J[464809];b=J[464807]}j=j+1|0;a=(n|0)>0?n:0;g=(d|0)<(g|0)?d:g;if((a|0)<(g|0)){a=a+1|0;b=P(P(c,a)+i|0,b)+h|0;while(1){H[J[263559]+b|0]=3;b=J[464813]+b|0;c=(a|0)!=(g|0);a=a+1|0;if(c){continue}break}b=J[464807]}h=h+1|0;if((h|0)<(b|0)){continue}break}a=J[464809]}i=i+1|0;if((i|0)<(a|0)){continue}break}}J[263564]=J[263564]+1;b=se();a=ad;if((Oe(J[263566],J[263567],b,a)|0)<101){break m}J[263566]=b;J[263567]=a;break a}J[263563]=5451;b=J[464806];h=(b|0)/8192|0;if((b|0)>=8192){z=Q(h|0);j=0;while(1){N[263562]=Q(j|0)/z;a=zd(1054272,J[464807]);e=zd(1054272,J[464808]);d=zd(1054272,J[464809]);k=Fd(1054272);q=Fd(1054272);f=Fd(1054272);o=Fd(1054272);r=Fd(1054272);s=Fd(1054272);k=Q(Q(k*q)*Q(200));s:{if(Q(R(k))<Q(2147483648)){c=~~k;break s}c=-2147483648}if((c|0)>0){A=Q(r*s);k=Q(Q(f+f)*Q(3.1415927410125732));f=Q(Q(o+o)*Q(3.1415927410125732));B=Q(c|0);o=Q(a|0);q=Q(e|0);r=Q(d|0);s=Q(0);a=0;t=Q(0);while(1){o=Q(Q(Jd(k)*Md(f))+o);x=Md(k);y=Md(f);q=Q(q+Jd(f));r=Q(Q(x*y)+r);x=Q(Q(s*Q(.8999999761581421))+Fd(1054272));y=Fd(1054272);C=Q(Q(t*Q(.75))+Fd(1054272));D=Fd(1054272);if(!(Fd(1054272)<Q(.25))){d=zd(1054272,4);w=Q(Q(Q(zd(1054272,4)-2|0)*Q(.20000000298023224))+q);t:{if(Q(R(w))<Q(2147483648)){b=~~w;break t}b=-2147483648}i=zd(1054272,4);e=J[464808];w=Q(Jd(Q(Q(Q(a|0)*Q(3.1415927410125732))/B))*Q(Q(Q(Q(Q(Q(e-b|0)/Q(e|0))*Q(3.5))+Q(1))*A)+Q(1.2000000476837158)));u=Q(Q(Q(d-2|0)*Q(.20000000298023224))+o);u:{if(Q(R(u))<Q(2147483648)){e=~~u;break u}e=-2147483648}u=Q(Q(Q(i-2|0)*Q(.20000000298023224))+r);v:{if(Q(R(u))<Q(2147483648)){d=~~u;break v}d=-2147483648}np(e,b,d,w,0)}f=Q(Q(f*Q(.5))+Q(t*Q(.25)));k=Q(Q(s*Q(.20000000298023224))+k);s=Q(x-y);t=Q(C-D);a=a+1|0;if((c|0)!=(a|0)){continue}break}}j=j+1|0;if((h|0)!=(j|0)){continue}break}}J[263564]=J[263564]+1;b=se();a=ad;if((Oe(J[263566],J[263567],b,a)|0)<101){break l}J[263566]=b;J[263567]=a;break a}ml(Q(.8999999761581421),13510,16);J[263564]=J[263564]+1;b=se();a=ad;if((Oe(J[263566],J[263567],b,a)|0)<101){break k}J[263566]=b;J[263567]=a;break a}ml(Q(.699999988079071),13484,15);J[263564]=J[263564]+1;b=se();a=ad;if((Oe(J[263566],J[263567],b,a)|0)<101){break j}J[263566]=b;J[263567]=a;break a}ml(Q(.5),13536,14);J[263564]=J[263564]+1;b=se();a=ad;if((Oe(J[263566],J[263567],b,a)|0)<101){break i}J[263566]=b;J[263567]=a;break a}J[263563]=7244;h=J[263570]-1|0;d=J[464809];e=J[464807];if((e|0)>0){b=P(d,h);a=P(b,e);b=P((b+d|0)-1|0,e);c=0;while(1){N[263562]=Q(Q(Q(c|0)/Q(e|0))*Q(.5))+Q(0);nh(a,9);nh(b,9);b=b+1|0;a=a+1|0;c=c+1|0;e=J[464807];if((c|0)<(e|0)){continue}break}d=J[464809]}if((d|0)>0){a=P(P(d,h),e);b=(e+a|0)-1|0;c=0;while(1){N[263562]=Q(Q(Q(c|0)/Q(d|0))*Q(.5))+Q(.5);nh(a,9);nh(b,9);e=J[464807];b=e+b|0;a=a+e|0;d=J[464809];c=c+1|0;if((d|0)>(c|0)){continue}break}}J[263564]=J[263564]+1;b=se();a=ad;if((Oe(J[263566],J[263567],b,a)|0)<101){break h}J[263566]=b;J[263567]=a;break a}J[263563]=7229;a=P(J[464809],J[464807]);b=(a|0)/800|0;if((a|0)>=800){f=Q(b|0);a=0;while(1){N[263562]=Q(a|0)/f;nh(zd(1054272,J[464807])+P(zd(1054272,J[464809])+P(J[263570]+(zd(1054272,2)^-1)|0,J[464809])|0,J[464807])|0,9);a=a+1|0;if((b|0)!=(a|0)){continue}break}}J[263564]=J[263564]+1;b=se();a=ad;if((Oe(J[263566],J[263567],b,a)|0)<101){break g}J[263566]=b;J[263567]=a;break a}J[263563]=17338;a=P(J[464809],J[464807]);b=(a|0)/2e4|0;if((a|0)>=2e4){f=Q(b|0);a=0;while(1){N[263562]=Q(a|0)/f;e=zd(1054272,J[464807]);h=zd(1054272,J[464809]);c=J[263570];k=Fd(1054272);k=Q(Fd(1054272)*Q(k*Q(c-3|0)));w:{if(Q(R(k))<Q(2147483648)){c=~~k;break w}c=-2147483648}nh(e+P(J[464807],h+P(c,J[464809])|0)|0,11);a=a+1|0;if((b|0)!=(a|0)){continue}break}}J[263564]=J[263564]+1;b=se();a=ad;if((Oe(J[263566],J[263567],b,a)|0)<101){break f}J[263566]=b;J[263567]=a;break a}og(m+12320|0,8);og(m+4112|0,8);J[263563]=15052;a=J[464809];if((a|0)>0){d=J[464807];i=J[263570];g=J[263572];b=0;j=0;while(1){f=Q(j|0);N[263562]=f/Q(a|0);c=0;if((d|0)>0){while(1){a=I[g+(b<<1)>>1];x:{if((a|0)<0|(a|0)>=J[464808]){break x}e=P(P(a,J[464809])+j|0,d)+c|0;y:{if((a|0)>=J[464811]){break y}h=e+J[263559]|0;d=K[h+J[464813]|0];if(!d){break y}if((d|0)!=9){break x}if(!(ng(m+4112|0,Q(c|0),f)>Q(12))){break x}H[h|0]=13;break x}h=2;if((a|0)<=(i|0)){h=ng(m+12320|0,Q(c|0),f)>Q(8)?12:2}H[e+J[263559]|0]=h}b=b+1|0;d=J[464807];c=c+1|0;if((d|0)>(c|0)){continue}break}a=J[464809]}j=j+1|0;if((j|0)<(a|0)){continue}break}}J[263564]=J[263564]+1;b=se();a=ad;if((Oe(J[263566],J[263567],b,a)|0)<101){break e}J[263566]=b;J[263567]=a;break a}z:{if(K[1054209]<29){break z}J[263563]=4541;b=P(J[464809],J[464807]);if((b|0)<3e3){break z}g=(b|0)/3e3|0;f=Q(g|0);d=0;while(1){j=0;N[263562]=Q(d|0)/f;n=zd(1054272,2)+37|0;e=zd(1054272,J[464807]);h=zd(1054272,J[464809]);while(1){b=e;c=0;a=h;while(1){i=zd(1054272,6);l=zd(1054272,6);a=(zd(1054272,6)-zd(1054272,6)|0)+a|0;b=(i-l|0)+b|0;i=J[464807];A:{if(b>>>0>=i>>>0){break A}l=J[464809];if(l>>>0<=a>>>0){break A}p=I[(J[263572]+(P(a,i)<<1)|0)+(b<<1)>>1];if((p|0)<0){break A}p=p+1|0;if((p|0)>=J[464808]){break A}v=J[263559];i=P(i,P(l,p)+a|0)+b|0;l=v+i|0;if(K[l|0]|K[v+(i-J[464813]|0)|0]!=2){break A}H[l|0]=n}c=c+1|0;if((c|0)!=5){continue}break}j=j+1|0;if((j|0)!=10){continue}break}d=d+1|0;if((g|0)!=(d|0)){continue}break}}J[263564]=J[263564]+1;b=se();a=ad;if((Oe(J[263566],J[263567],b,a)|0)<101){break d}J[263566]=b;J[263567]=a;break a}B:{if(K[1054209]<29){break B}J[263563]=4900;b=J[464806];if((b|0)<2e3){break B}n=(b|0)/2e3|0;f=Q(n|0);d=0;while(1){j=0;N[263562]=Q(d|0)/f;l=zd(1054272,2)+39|0;e=zd(1054272,J[464807]);i=zd(1054272,J[464808]);h=zd(1054272,J[464809]);while(1){b=e;c=0;a=h;while(1){g=zd(1054272,6);p=zd(1054272,6);a=(zd(1054272,6)-zd(1054272,6)|0)+a|0;b=(g-p|0)+b|0;g=J[464807];C:{if(b>>>0>=g>>>0){break C}p=J[464809];if(p>>>0<=a>>>0|(i|0)>=(I[(J[263572]+(P(a,g)<<1)|0)+(b<<1)>>1]-1|0)){break C}v=J[263559];g=P(g,P(i,p)+a|0)+b|0;p=v+g|0;if(K[p|0]|K[v+(g-J[464813]|0)|0]!=1){break C}H[p|0]=l}c=c+1|0;if((c|0)!=5){continue}break}j=j+1|0;if((j|0)!=20){continue}break}d=d+1|0;if((n|0)!=(d|0)){continue}break}}J[263564]=J[263564]+1;b=se();a=ad;if((Oe(J[263566],J[263567],b,a)|0)<101){break c}J[263566]=b;J[263567]=a;break a}J[263561]=1054272;J[263563]=6024;J[263560]=J[263559];b=P(J[464809],J[464807]);n=(b|0)/4e3|0;if((b|0)>=4e3){f=Q(n|0);i=0;while(1){N[263562]=Q(i|0)/f;e=zd(1054272,J[464807]);h=zd(1054272,J[464809]);j=0;while(1){c=0;b=e;a=h;while(1){d=zd(1054272,6);g=zd(1054272,6);a=(zd(1054272,6)-zd(1054272,6)|0)+a|0;b=(d-g|0)+b|0;D:{if(M[464809]<=a>>>0|b>>>0>=M[464807]){break D}if(Fd(1054272)>=Q(.25)){break D}d=I[(J[263572]+(P(J[464807],a)<<1)|0)+(b<<1)>>1];g=d+1|0;if((g|0)>=J[464808]){break D}l=zd(1054272,3);if(K[J[263559]+((P(J[464807],P(g,J[464809])+a|0)+b|0)-J[464813]|0)|0]!=2|(d|0)<0){break D}l=l+5|0;if(!mp(b,g,a,l)){break D}d=0;l=lp(b,g,a,l,m+12320|0,m+4112|0);if((l|0)<=0){break D}while(1){g=(m+12320|0)+P(d,12)|0;H[(J[263559]+P(J[464807],P(J[464809],J[g+4>>2])+J[g+8>>2]|0)|0)+J[g>>2]|0]=K[(m+4112|0)+d|0];d=d+1|0;if((l|0)!=(d|0)){continue}break}}c=c+1|0;if((c|0)!=20){continue}break}j=j+1|0;if((j|0)!=20){continue}break}i=i+1|0;if((n|0)!=(i|0)){continue}break}}J[263564]=J[263564]+1;b=se();a=ad;if((Oe(J[263566],J[263567],b,a)|0)<101){break b}J[263566]=b;J[263567]=a;break a}qd(J[263572]);H[1054228]=1;J[263572]=0}$c=m+20528|0}function TB(a,b){a=a|0;b=Q(b);var c=0,d=Q(0),e=0,f=0,g=Q(0),h=0,i=0,j=Q(0),k=0,l=Q(0),m=Q(0),n=Q(0),o=0,p=Q(0),q=0,r=0,s=Q(0),t=0,u=0;i=$c+-64|0;$c=i;J[i+60>>2]=0;J[i+56>>2]=0;if(K[1859276]){g=Q(.5);N[a+724>>2]=!K[a+469|0]|!K[a+470|0]?g:K[a+473|0]?Q(1):Q(.5);c=J[a+40>>2];J[a+436>>2]=J[a+36>>2];J[a+440>>2]=c;J[a+444>>2]=J[a+44>>2];t=K[a+111|0];e=J[a+388>>2];c=J[a+384>>2];J[a+4>>2]=c;J[a+8>>2]=e;J[a+352>>2]=c;J[a+356>>2]=e;J[a+12>>2]=J[a+392>>2];c=J[a+412>>2];J[a+376>>2]=J[a+408>>2];J[a+380>>2]=c;c=J[a+404>>2];J[a+368>>2]=J[a+400>>2];J[a+372>>2]=c;c=J[a+396>>2];J[a+360>>2]=J[a+392>>2];J[a+364>>2]=c;c=a+648|0;e=J[c>>2];if(e){N[a+408>>2]=N[c+4>>2];Ie(c+4|0,c+8|0,60);J[c>>2]=e-1}a:{if(J[263697]){break a}c=J[208590];b:{if(!c){g=Q(0);d=Q(0);break b}while(1){bd[J[c>>2]](a,i+60|0,i+56|0);c=J[c+4>>2];if(c){continue}break}g=Q(N[i+60>>2]*Q(.9800000190734863));d=Q(N[i+56>>2]*Q(.9800000190734863))}N[i+56>>2]=d;N[i+60>>2]=g;if(!K[a+476|0]|(!K[a+493|0]|!K[a+470|0])){break a}if(K[a+494|0]){J[a+36>>2]=0;J[a+40>>2]=0;J[a+44>>2]=0}iq(a+460|0,K[a+462|0])}c:{if(K[a+494|0]){H[a+461|0]=1;break c}c=K[a+495|0];H[a+461|0]=(c|0)!=0;if(!K[a+480|0]|c){break c}c=$c-16|0;$c=c;J[c+8>>2]=0;while(1){e=J[(h<<2)+827376>>2];d:{if(!e|(a|0)==(e|0)|!K[J[e+48>>2]+47|0]){break d}g=N[a+8>>2];d=N[e+8>>2];if(!(g<=Q(d+N[e+96>>2]))|!(d<=Q(g+N[a+96>>2]))){break d}d=Q(N[e+4>>2]-N[a+4>>2]);N[c+4>>2]=d;g=Q(N[e+12>>2]-N[a+12>>2]);N[c+12>>2]=g;d=Q(Q(d*d)+Q(g*g));if(d<Q(.0020000000949949026)|d>Q(1)){break d}Gm(c+4|0);d=Q(Q(N[e+420>>2]-d)*Q(.03125));g=Q(d*N[c+12>>2]);N[c+12>>2]=g;j=Q(d*N[c+8>>2]);N[c+8>>2]=j;d=Q(N[c+4>>2]*d);N[c+4>>2]=d;N[a+36>>2]=N[a+36>>2]-d;N[a+40>>2]=N[a+40>>2]-j;N[a+44>>2]=N[a+44>>2]-g}h=h+1|0;if((h|0)!=256){continue}break}$c=c+16|0}if(!(K[a+492|0]|!K[a+494|0]|(N[i+60>>2]!=Q(0)|N[i+56>>2]!=Q(0)))){J[a+36>>2]=0;J[a+40>>2]=0;J[a+44>>2]=0}f=$c-32|0;$c=f;e=a+728|0;c=J[e+8>>2];h=J[e+24>>2];e:{if(K[h+1|0]){k=1;d=Q((K[h+36|0]|K[e+2|0]?k:K[h+37|0]?-1:0)|0);g=Q(Q(d*Q(.11999999731779099))+Q(0));N[c+40>>2]=g;if(!(!K[h+38|0]|!K[h+13|0])){g=Q(Q(d*Q(.11999999731779099))+g);N[c+40>>2]=g}if(!K[h+39|0]|!K[h+13|0]){break e}N[c+40>>2]=Q(d*Q(.05999999865889549))+g;break e}if(!K[e+2|0]){break e}if(!Wl(c)|!(N[c+40>>2]>Q(.019999999552965164))){break e}J[c+40>>2]=1017370378}f:{if(!K[e+2|0]){H[e+1|0]=0;break f}k=zq(c);q=Aq(c);if(k|q){r=f+8|0;Lg(c,r);o=Bd(N[f+12>>2]);k=Bd(N[f+24>>2]);d=Q(o|0);N[f+24>>2]=d;N[f+12>>2]=d;u=Of(r,150);o=(k|0)>(o|0)?o+1|0:k;N[f+24>>2]=((k|0)<(o|0)?o:k)|0;N[f+12>>2]=((k|0)>(o|0)?o:k)|0;g:{if(!(Of(r,150)|!u)){if(Gl(N[c+8>>2])>=Q(.4000000059604645)){break g}}H[e+1|0]=1;g=Q(N[c+40>>2]+Q(.03999999910593033));N[c+40>>2]=g;if(!(!K[h+38|0]|!K[h+13|0])){g=Q(g+Q(.03999999910593033));N[c+40>>2]=g}if(!K[h+39|0]|!K[h+13|0]){break f}N[c+40>>2]=g+Q(.019999999552965164);break f}h:{i:{j:{h=J[e+28>>2];if(!(K[h+4|0]|K[h+7|0]|K[h+6|0])){if(!K[h+9|0]){break j}}d=q?Q(.30000001192092896):Q(.12999999523162842);break i}if(!K[e+1|0]){break h}d=q?Q(.20000000298023224):Q(.10000000149011612)}N[c+40>>2]=d+N[c+40>>2]}H[e+1|0]=0;break f}if(K[e|0]){g=Q(N[c+40>>2]+Q(.03999999910593033));N[c+40>>2]=g;if(!(!K[h+38|0]|!K[h+13|0])){g=Q(g+Q(.03999999910593033));N[c+40>>2]=g}if(!(!K[h+39|0]|!K[h+13|0])){N[c+40>>2]=g+Q(.019999999552965164)}H[e+1|0]=0;break f}if(Wl(c)){N[c+40>>2]=(K[h+38|0]?K[h+13|0]?Q(.15000000596046448):Q(.10000000149011612):Q(.10000000149011612))+N[c+40>>2];H[e+1|0]=0;break f}if(!K[c+111|0]){break f}cq(e)}$c=f+32|0;Fm(i+44|0,N[i+60>>2],Q(0),N[i+56>>2],Q(N[a+20>>2]*Q(.01745329238474369)));J[i+40>>2]=J[i+52>>2];c=J[i+48>>2];J[i+32>>2]=J[i+44>>2];J[i+36>>2]=c;c=$c-112|0;$c=c;h=J[e+8>>2];k=J[e+24>>2];if(K[k+34|0]){H[h+111|0]=0}f=c+88|0;Lg(h,f);H[e|0]=0;d=bq(e,f,0);N[c+92>>2]=N[c+92>>2]+Q(-.03125);g=bq(e,f,1);j=aq(k,Q(8),K[k+13|0]);d=d==Q(1e9)?g==Q(1e9)?Q(1):g:d;g=Q(Q(d*aq(k,Q(1.600000023841858),1))*N[k+24>>2]);g=g<Q(-75)?Q(-75):g;g=g>Q(75)?Q(75):g;j=Q(d*Q(j/Q(5)));j=d>j?d:j;k:{if(!K[k+19|0]){o=k+1|0;break k}o=k+1|0;if(K[k+1|0]|!K[k+33|0]){break k}f=J[e+4>>2];if((f|0)==1){j=Q(j*Q(7.5));g=Q(g*Q(46.5));break k}if((f|0)<2){break k}j=Q(j*Q(10));g=Q(g*Q(93))}l:{if(!(!zq(h)|K[o|0])){J[c+96>>2]=1061997773;J[c+88>>2]=1061997773;J[c+92>>2]=1061997773;d=N[i+32>>2];l=N[i+40>>2];m=Q(Y(Q(Q(d*d)+Q(l*l))));if(!(m<Q(9999999747378752e-21))){p=N[i+36>>2];f=J[e+8>>2];n=d;d=Q(Q(g*Q(.019999999552965164))/(m<Q(1)?Q(1):m));N[f+36>>2]=Q(n*d)+N[f+36>>2];N[f+40>>2]=Q(d*p)+N[f+40>>2];N[f+44>>2]=Q(l*d)+N[f+44>>2]}J[c+80>>2]=J[c+96>>2];f=J[c+92>>2];J[c+72>>2]=J[c+88>>2];J[c+76>>2]=f;ti(e,c+72|0,Q(.019999999552965164),j);break l}if(!(!Aq(h)|K[o|0])){J[c+96>>2]=1056964608;J[c+88>>2]=1056964608;J[c+92>>2]=1056964608;d=N[i+32>>2];l=N[i+40>>2];m=Q(Y(Q(Q(d*d)+Q(l*l))));if(!(m<Q(9999999747378752e-21))){p=N[i+36>>2];f=J[e+8>>2];n=d;d=Q(Q(g*Q(.019999999552965164))/(m<Q(1)?Q(1):m));N[f+36>>2]=Q(n*d)+N[f+36>>2];N[f+40>>2]=Q(d*p)+N[f+40>>2];N[f+44>>2]=Q(l*d)+N[f+44>>2]}J[c- -64>>2]=J[c+96>>2];f=J[c+92>>2];J[c+56>>2]=J[c+88>>2];J[c+60>>2]=f;ti(e,c+56|0,Q(.019999999552965164),j);break l}q=Wl(h);f=K[o|0];m:{n:{if(q){if(f){break n}J[c+96>>2]=1056964608;J[c+88>>2]=1056964608;J[c+92>>2]=1062836634;d=N[i+32>>2];g=N[i+40>>2];l=Q(Y(Q(Q(d*d)+Q(g*g))));if(!(l<Q(9999999747378752e-21))){m=N[i+36>>2];f=J[e+8>>2];n=d;d=Q(Q(.03400000184774399)/(l<Q(1)?Q(1):l));N[f+36>>2]=Q(n*d)+N[f+36>>2];N[f+40>>2]=Q(d*m)+N[f+40>>2];N[f+44>>2]=Q(g*d)+N[f+44>>2]}J[c+48>>2]=J[c+96>>2];f=J[c+92>>2];J[c+40>>2]=J[c+88>>2];J[c+44>>2]=f;ti(e,c+40|0,Q(.03400000184774399),j);break l}if(f){break n}f=1;d=K[h+111|0]?Q(.10000000149011612):Q(.019999999552965164);break m}f=0;d=Q(.10000000149011612)}l=Q(.019999999552965164);l=K[e|0]?l:N[e+32>>2];o:{if(!f){J[c+96>>2]=K[e+44|0]|K[e+45|0]<<8|(K[e+46|0]<<16|K[e+47|0]<<24);f=K[e+40|0]|K[e+41|0]<<8|(K[e+42|0]<<16|K[e+43|0]<<24);J[c+88>>2]=K[e+36|0]|K[e+37|0]<<8|(K[e+38|0]<<16|K[e+39|0]<<24);J[c+92>>2]=f;q=J[e+24>>2];f=J[e+8>>2];m=N[i+32>>2];p=N[i+40>>2];n=Q(Y(Q(Q(m*m)+Q(p*p))));p:{if(n<Q(9999999747378752e-21)){g=N[f+44>>2];d=N[f+36>>2];break p}s=N[i+36>>2];g=Q(Q(g*d)/(n<Q(1)?Q(1):n));d=Q(Q(m*g)+N[f+36>>2]);N[f+36>>2]=d;N[f+40>>2]=Q(g*s)+N[f+40>>2];g=Q(Q(p*g)+N[f+44>>2]);N[f+44>>2]=g}q:{if(!(m!=Q(0)|p!=Q(0))){break q}d=Q(Y(Q(Q(d*d)+Q(g*g))));if(!(d>Q(.0010000000474974513))){break q}J[f+40>>2]=0;if(K[q+36|0]|K[e+2|0]){N[f+40>>2]=d;g=d}else{g=Q(0)}j=Q(1);if(!K[q+37|0]){break q}N[f+40>>2]=g-d}J[c+32>>2]=J[c+96>>2];f=J[c+92>>2];J[c+24>>2]=J[c+88>>2];J[c+28>>2]=f;ti(e,c+24|0,l,j);break o}J[c+96>>2]=K[e+44|0]|K[e+45|0]<<8|(K[e+46|0]<<16|K[e+47|0]<<24);f=K[e+40|0]|K[e+41|0]<<8|(K[e+42|0]<<16|K[e+43|0]<<24);J[c+88>>2]=K[e+36|0]|K[e+37|0]<<8|(K[e+38|0]<<16|K[e+39|0]<<24);J[c+92>>2]=f;m=N[i+32>>2];p=N[i+40>>2];n=Q(Y(Q(Q(m*m)+Q(p*p))));if(!(n<Q(9999999747378752e-21))){s=N[i+36>>2];f=J[e+8>>2];d=Q(Q(g*d)/(n<Q(1)?Q(1):n));N[f+36>>2]=Q(m*d)+N[f+36>>2];N[f+40>>2]=Q(d*s)+N[f+40>>2];N[f+44>>2]=Q(p*d)+N[f+44>>2]}J[c+16>>2]=J[c+96>>2];f=J[c+92>>2];J[c+8>>2]=J[c+88>>2];J[c+12>>2]=f;ti(e,c+8|0,l,j)}r:{if(K[um(Bd(N[h+4>>2]),Bd(Q(N[h+8>>2]+Q(-.009999999776482582))),Bd(N[h+12>>2]))+76112|0]!=3){f=c+88|0;Lg(h,f);d=Q(N[c+92>>2]+Q(-.009999999776482582));N[c+104>>2]=d;N[c+92>>2]=d;if(!Of(f,151)){break r}}if(K[o|0]){break r}d=N[h+36>>2];g=N[h+44>>2];if(!(Q(R(d))>Q(.25)|Q(R(g))>Q(.25))){break l}n=g;j=Q(R(Q(Q(.25)/d)));g=Q(R(Q(Q(.25)/g)));g=g>j?j:g;N[h+44>>2]=n*g;N[h+36>>2]=d*g;break l}if(!(K[h+111|0]|K[k+35|0])){break l}N[h+36>>2]=N[h+36>>2]*N[e+48>>2];N[h+40>>2]=N[h+40>>2]*N[e+52>>2];N[h+44>>2]=N[h+44>>2]*N[e+56>>2]}if(K[h+111|0]){J[e+4>>2]=0}$c=c+112|0;if(K[a+461|0]){J[a+40>>2]=0}h=J[a+4>>2];f=J[a+8>>2];e=J[a+356>>2];c=J[a+352>>2];J[a+4>>2]=c;J[a+8>>2]=e;J[a+384>>2]=h;J[a+388>>2]=f;h=J[a+12>>2];f=J[a+360>>2];J[a+12>>2]=f;J[a+392>>2]=h;J[i+24>>2]=f;J[i+16>>2]=c;J[i+20>>2]=e;J[i+8>>2]=J[a+392>>2];c=J[a+388>>2];J[i>>2]=J[a+384>>2];J[i+4>>2]=c;oq(a,i+16|0,i,b);c=0;b=N[a+644>>2];N[a+640>>2]=b;e=K[a+461|0];while(1){b=e?Q(b*Q(.8399999737739563)):Q(b+Q(.10000000149011612));b=b<Q(0)?Q(0):b;b=b>Q(1)?Q(1):b;c=c+1|0;if((c|0)!=3){continue}break}N[a+644>>2]=b;rq(a);c=$c+-64|0;$c=c;b=N[a+392>>2];g=N[a+388>>2];j=N[a+384>>2];e=c+40|0;Lg(a,e);H[1040204]=0;H[1040205]=0;Of(e,152);s:{if(!K[1040205]){J[c+32>>2]=J[a+392>>2];e=J[a+388>>2];J[c+24>>2]=J[a+384>>2];J[c+28>>2]=e;N[c+28>>2]=N[c+28>>2]+Q(-.009999999776482582);Ae(c+12|0,c+24|0);t:{e=Eh(J[c+12>>2],J[c+16>>2],J[c+20>>2]);d=N[c+28>>2];if(!(Q(N[P(e,12)+94548>>2]+Q(J[c+16>>2]))>=d)){break t}e=e+66896|0;if(K[e+8448|0]!=2){break t}e=K[e+15360|0];if(!e){break t}H[1040205]=e;H[1040204]=1;break s}N[c+56>>2]=d;N[c+44>>2]=d;Of(c+40|0,153)}if(K[1040204]){break s}j=Q(9999999562023526e9);g=Q(9999999562023526e9);b=Q(9999999562023526e9)}u:{if(!K[a+111|0]){break u}v:{if(N[a+136>>2]<Q(.9990000128746033)){d=Q(N[12342]-b);n=Q(d*d);d=Q(N[12340]-j);l=Q(d*d);d=Q(N[12341]-g);a=Q(n+Q(l+Q(d*d)))>Q(3.0625);break v}d=N[a+140>>2];w:{if(K[J[203292]]){l=Md(d);d=Md(N[a+144>>2]);break w}l=Jd(d);d=Jd(N[a+144>>2])}a=(sg(l)|0)!=(sg(d)|0)}if(a?0:t){break u}Kn(K[1040205],64828);N[12341]=g;N[12340]=j;N[12342]=b}$c=c- -64|0}$c=i- -64|0}function uw(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=Q(0),g=Q(0),h=0,i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=Q(0),y=Q(0),z=Q(0),A=0,B=Q(0),C=Q(0),D=Q(0),E=0,F=Q(0),G=0,I=0,M=0;h=L[390030];e=K[h+80720|0];if((e|0)==5){Dk(b,c,d);return}a=J[195009]+a|0;E=K[a+5|0];w=K[a+4|0];p=K[a+1|0];q=K[a|0];r=K[a+2|0];u=K[a+3|0];a:{if(!(w|(p|q|(r|u))|E)){break a}e=((e|0)==3)<<9;J[203220]=e;a=h+66896|0;G=K[a+1536|0];H[780096]=G;I=K[a+16128|0];H[812884]=I;a=P(h,12)+66896|0;f=N[a+46088>>2];j=N[a+46084>>2];g=N[a+46080>>2];m=N[a+36872>>2];i=N[a+36868>>2];n=Q(b|0);k=Q(N[a+36864>>2]+n);N[203222]=k;o=Q(c|0);l=Q(i+o);N[203223]=l;i=m;m=Q(d|0);i=Q(i+m);N[203224]=i;N[203225]=g+n;j=Q(j+o);N[203226]=j;N[203227]=f+m;b=a+18432|0;c=J[b+4>>2];J[203228]=J[b>>2];J[203229]=c;J[203230]=J[a+18440>>2];b=a+27648|0;c=J[b+4>>2];J[203231]=J[b>>2];J[203232]=c;J[203233]=J[a+27656>>2];f=Q(Q(1)-N[203229]);N[203229]=f;g=Q(Q(1)-N[203232]);N[203232]=g;if(q){b=J[J[203236]+(J[195016]<<2)>>2];c=b>>>11&1;d=b>>>10&1;v=d+(b>>>19&1)|0;t=v+(c+(b>>>20&1)|0)|0;s=c+(b>>>2&1)|0;c=d+(b>>>1&1)|0;s=s+c|0;d=b>>>9&1;v=(d+(b>>>18&1)|0)+v|0;A=c+(d+(b&1)|0)|0;m=N[203233];d=-1;l=f;f=N[458160];i=Q(l*f);a=L[a+55296>>1];l=Q(a&J[458158]);M=e+(a>>>J[458159]|0)<<5;c=-1;b=-1;e=-1;if(!G){e=J[(v<<2)+812960>>2];d=J[(t<<2)+812960>>2];c=J[(A<<2)+812960>>2];b=J[(s<<2)+812960>>2]}B=N[203230];if(I){a=J[(h<<2)+69200>>2];c=sd(c,a);b=sd(b,a);d=sd(d,a);e=sd(e,a);k=N[203222];j=N[203226]}o=Q(q-1|0);C=Q(Q(m*Q(.9993749856948853))+o);m=Q(f*l);D=Q(Q(i*Q(.9993749856948853))+m);F=Q(Q(g*f)+m);h=M+780112|0;a=J[h>>2];b:{if(t+A>>>0>s+v>>>0){i=N[203224];J[a+12>>2]=b;N[a+8>>2]=i;N[a+4>>2]=j;N[a>>2]=k;m=B;b=c;x=N[203223];l=x;c=e;n=C;g=j;y=Q(N[203227]+o);o=y;z=F;f=D;break b}f=N[203227];J[a+12>>2]=d;N[a+4>>2]=j;N[a>>2]=k;o=Q(f+o);N[a+8>>2]=o;m=C;x=j;i=N[203224];y=i;n=B;l=N[203223];g=l;d=e;z=D;f=F}N[a+72>>2]=k;N[a+48>>2]=k;N[a+24>>2]=k;N[a+20>>2]=F;N[a+16>>2]=m;N[a+92>>2]=z;N[a+88>>2]=C;J[a+84>>2]=d;N[a+80>>2]=o;N[a+76>>2]=g;N[a+68>>2]=D;N[a- -64>>2]=n;J[a+60>>2]=c;N[a+56>>2]=y;N[a+52>>2]=l;N[a+44>>2]=f;N[a+40>>2]=B;J[a+36>>2]=b;N[a+32>>2]=i;N[a+28>>2]=x;J[h>>2]=a+96}if(p){a=J[J[203236]+(J[195016]<<2)>>2];b=a>>>17&1;c=a>>>16&1;d=c+(a>>>25&1)|0;q=d+(b+(a>>>26&1)|0)|0;e=b+(a>>>8&1)|0;b=c+(a>>>7&1)|0;t=e+b|0;c=a>>>15&1;s=(c+(a>>>24&1)|0)+d|0;v=b+(c+(a>>>6&1)|0)|0;f=N[458160];g=Q(f*N[203229]);e=L[390030];a=L[P(e,12)+122194>>1];m=Q(a&J[458158]);i=N[203232];l=N[203233];h=a>>>J[458159]|0;A=J[203220];d=-1;c=-1;a=-1;b=-1;if(!K[780096]){b=J[(s<<2)+812960>>2];d=J[(q<<2)+812960>>2];c=J[(v<<2)+812960>>2];a=J[(t<<2)+812960>>2]}n=N[203230];if(K[812884]){e=J[(e<<2)+69200>>2];c=sd(c,e);a=sd(a,e);d=sd(d,e);b=sd(b,e);j=N[203226]}k=Q(g*Q(.9993749856948853));g=Q(f*m);k=Q(k+g);B=Q(Q(i*f)+g);C=Q(Q(p>>>0)-n);D=Q(Q(Q(1)-l)*Q(.9993749856948853));A=(h+A<<5)+780116|0;h=J[A>>2];z=N[203225];c:{if(q+v>>>0>t+s>>>0){i=N[203224];N[h+8>>2]=i;N[h+4>>2]=j;N[h>>2]=z;e=a;m=j;x=Q(N[203227]+Q(p-1|0));n=x;g=D;l=N[203223];j=l;o=k;F=C;f=B;break c}f=N[203227];N[h+4>>2]=j;N[h>>2]=z;x=Q(f+Q(p-1|0));N[h+8>>2]=x;e=d;d=b;m=N[203223];l=m;b=c;g=C;n=N[203224];i=n;c=a;o=B;F=D;f=k}N[h+72>>2]=z;N[h+48>>2]=z;J[h+36>>2]=d;N[h+32>>2]=x;N[h+28>>2]=m;N[h+24>>2]=z;N[h+20>>2]=B;N[h+16>>2]=F;J[h+12>>2]=e;N[h+92>>2]=o;N[h+88>>2]=C;J[h+84>>2]=c;N[h+80>>2]=i;N[h+76>>2]=j;N[h+68>>2]=k;N[h- -64>>2]=g;J[h+60>>2]=b;N[h+56>>2]=n;N[h+52>>2]=l;N[h+44>>2]=f;N[h+40>>2]=D;J[A>>2]=h+96}if(r){a=J[J[203236]+(J[195016]<<2)>>2];b=a>>>5&1;c=a>>>4&1;d=c+(a>>>7&1)|0;h=d+(b+(a>>>8&1)|0)|0;e=a>>>3&1;p=d+(e+(a>>>6&1)|0)|0;d=b+(a>>>2&1)|0;b=c+(a>>>1&1)|0;q=d+b|0;t=b+(e+(a&1)|0)|0;f=N[458160];j=Q(f*N[203229]);e=L[390030];a=L[P(e,12)+122196>>1];g=Q(a&J[458158]);m=N[203232];l=N[203231];s=a>>>J[458159]|0;v=J[203220];d=-1;b=-1;a=-1;c=-1;if(!K[780096]){c=J[(q<<2)+812992>>2];d=J[(h<<2)+812992>>2];b=J[(t<<2)+812992>>2];a=J[(p<<2)+812992>>2]}k=N[203228];if(K[812884]){e=J[(e<<2)+69200>>2];b=sd(b,e);a=sd(a,e);d=sd(d,e);c=sd(c,e);i=N[203224]}g=Q(f*g);j=Q(Q(j*Q(.9993749856948853))+g);n=Q(Q(m*f)+g);k=Q(Q(r>>>0)-k);o=Q(Q(Q(1)-l)*Q(.9993749856948853));s=(s+v<<5)+780120|0;e=J[s>>2];d:{if(h+t>>>0>p+q>>>0){f=N[203225];l=N[203223];N[e+20>>2]=j;N[e+16>>2]=o;J[e+12>>2]=a;N[e+8>>2]=i;N[e+4>>2]=l;g=Q(f+Q(r-1|0));N[e>>2]=g;m=N[203222];N[e+44>>2]=j;N[e+40>>2]=k;J[e+36>>2]=b;N[e+32>>2]=i;N[e+28>>2]=l;N[e+24>>2]=m;f=N[203226];N[e+48>>2]=m;j=n;m=f;break d}g=N[203222];l=N[203223];N[e+20>>2]=j;N[e+16>>2]=k;J[e+12>>2]=b;N[e+8>>2]=i;N[e+4>>2]=l;N[e>>2]=g;f=N[203226];N[e+44>>2]=n;N[e+40>>2]=k;J[e+36>>2]=c;N[e+32>>2]=i;N[e+28>>2]=f;N[e+24>>2]=g;g=Q(N[203225]+Q(r-1|0));N[e+48>>2]=g;c=d;k=o;d=a;m=l}N[e+72>>2]=g;N[e+92>>2]=j;N[e+88>>2]=o;J[e+84>>2]=d;N[e+80>>2]=i;N[e+76>>2]=m;N[e+68>>2]=n;N[e- -64>>2]=k;J[e+60>>2]=c;N[e+56>>2]=i;N[e+52>>2]=f;J[s>>2]=e+96}if(u){a=J[J[203236]+(J[195016]<<2)>>2];b=a>>>23&1;c=a>>>22&1;d=c+(a>>>25&1)|0;h=d+(b+(a>>>26&1)|0)|0;e=b+(a>>>20&1)|0;b=c+(a>>>19&1)|0;p=e+b|0;c=a>>>21&1;r=(c+(a>>>24&1)|0)+d|0;q=b+(c+(a>>>18&1)|0)|0;f=N[203231];d=-1;g=N[458160];m=Q(g*N[203229]);e=L[390030];a=L[P(e,12)+122198>>1];i=Q(a&J[458158]);k=N[203232];t=a>>>J[458159]|0;s=J[203220];c=-1;b=-1;a=-1;if(!K[780096]){d=J[(q<<2)+812992>>2];b=J[(r<<2)+812992>>2];c=J[(h<<2)+812992>>2];a=J[(p<<2)+812992>>2]}j=N[203228];if(K[812884]){e=J[(e<<2)+69200>>2];d=sd(d,e);b=sd(b,e);c=sd(c,e);a=sd(a,e)}n=Q(u-1|0);f=Q(Q(f*Q(.9993749856948853))+n);i=Q(g*i);m=Q(Q(m*Q(.9993749856948853))+i);k=Q(Q(k*g)+i);u=(t+s<<5)+780124|0;e=J[u>>2];i=N[203227];e:{if(h+q>>>0>p+r>>>0){o=N[203222];g=N[203226];N[e+20>>2]=k;N[e+16>>2]=j;J[e+12>>2]=a;N[e+8>>2]=i;N[e+4>>2]=g;N[e>>2]=o;l=N[203223];N[e+44>>2]=m;N[e+40>>2]=j;J[e+36>>2]=d;N[e+32>>2]=i;N[e+28>>2]=l;N[e+24>>2]=o;y=Q(N[203225]+n);N[e+48>>2]=y;d=b;j=f;break e}l=N[203225];g=N[203226];N[e+20>>2]=k;N[e+16>>2]=f;J[e+12>>2]=c;N[e+8>>2]=i;N[e+4>>2]=g;y=Q(l+n);N[e>>2]=y;n=N[203222];N[e+44>>2]=k;N[e+40>>2]=j;J[e+36>>2]=a;N[e+32>>2]=i;N[e+28>>2]=g;N[e+24>>2]=n;l=N[203223];N[e+48>>2]=n;g=l;c=b;k=m}N[e+72>>2]=y;N[e+92>>2]=k;N[e+88>>2]=f;J[e+84>>2]=c;N[e+80>>2]=i;N[e+76>>2]=g;N[e+68>>2]=m;N[e- -64>>2]=j;J[e+60>>2]=d;N[e+56>>2]=i;N[e+52>>2]=l;J[u>>2]=e+96}if(w){a=J[J[203236]+(J[195016]<<2)>>2];b=a>>>21&1;c=a>>>12&1;d=c+(a>>>15&1)|0;h=d+(b+(a>>>24&1)|0)|0;e=b+(a>>>18&1)|0;b=c+(a>>>9&1)|0;p=e+b|0;c=a>>>3&1;r=(c+(a>>>6&1)|0)+d|0;q=b+(c+(a&1)|0)|0;j=N[203231];d=-1;f=N[458160];g=Q(f*N[203233]);e=L[390030];a=L[P(e,12)+122200>>1];n=Q(a&J[458158]);o=N[203230];u=a>>>J[458159]|0;t=J[203220];b=-1;a=-1;c=-1;if(!K[780096]){c=J[(q<<2)+813024>>2];d=J[(r<<2)+813024>>2];b=J[(p<<2)+813024>>2];a=J[(h<<2)+813024>>2]}i=N[203228];if(K[812884]){e=J[(e<<2)+69200>>2];c=sd(c,e);d=sd(d,e);a=sd(a,e);b=sd(b,e);l=N[203223]}k=Q(w-1|0);m=Q(Q(j*Q(.9993749856948853))+k);j=Q(g*Q(.9993749856948853));g=Q(f*n);j=Q(j+g);n=Q(Q(o*f)+g);w=(t+u<<5)+780128|0;e=J[w>>2];f:{if(p+r>>>0>h+q>>>0){g=N[203225];f=N[203227];N[e+20>>2]=j;N[e+16>>2]=m;J[e+12>>2]=a;N[e+8>>2]=f;N[e+4>>2]=l;k=Q(g+k);N[e>>2]=k;g=N[203222];N[e+44>>2]=j;N[e+40>>2]=i;J[e+36>>2]=b;N[e+32>>2]=f;N[e+28>>2]=l;N[e+24>>2]=g;f=N[203224];N[e+48>>2]=g;g=f;j=n;break f}o=N[203222];g=N[203227];N[e+20>>2]=j;N[e+16>>2]=i;J[e+12>>2]=b;N[e+8>>2]=g;N[e+4>>2]=l;N[e>>2]=o;f=N[203224];N[e+44>>2]=n;N[e+40>>2]=i;J[e+36>>2]=c;N[e+32>>2]=f;N[e+28>>2]=l;N[e+24>>2]=o;k=Q(N[203225]+k);N[e+48>>2]=k;c=d;i=m;d=a}N[e+72>>2]=k;N[e+92>>2]=j;N[e+88>>2]=m;J[e+84>>2]=d;N[e+80>>2]=g;N[e+76>>2]=l;N[e+68>>2]=n;N[e- -64>>2]=i;J[e+60>>2]=c;N[e+56>>2]=f;N[e+52>>2]=l;J[w>>2]=e+96}if(!E){break a}a=J[J[203236]+(J[195016]<<2)>>2];b=a>>>23&1;c=a>>>14&1;d=c+(a>>>17&1)|0;h=d+(b+(a>>>26&1)|0)|0;e=b+(a>>>20&1)|0;b=c+(a>>>11&1)|0;p=e+b|0;c=a>>>5&1;r=(c+(a>>>8&1)|0)+d|0;w=b+(c+(a>>>2&1)|0)|0;f=N[203231];d=-1;j=N[458160];g=Q(j*N[203233]);e=L[390030];a=L[P(e,12)+122202>>1];l=Q(a&J[458158]);n=N[203230];q=a>>>J[458159]|0;u=J[203220];b=-1;a=-1;c=-1;if(!K[780096]){c=J[(p<<2)+813056>>2];d=J[(h<<2)+813056>>2];b=J[(w<<2)+813056>>2];a=J[(r<<2)+813056>>2]}i=N[203228];if(K[812884]){e=J[(e<<2)+69200>>2];b=sd(b,e);a=sd(a,e);d=sd(d,e);c=sd(c,e)}k=Q(E-1|0);m=Q(Q(f*Q(.9993749856948853))+k);f=Q(j*l);l=Q(Q(g*Q(.9993749856948853))+f);j=Q(Q(n*j)+f);E=(q+u<<5)+780132|0;e=J[E>>2];n=N[203226];g:{if(h+w>>>0>p+r>>>0){g=N[203225];f=N[203224];N[e+20>>2]=j;N[e+16>>2]=m;J[e+12>>2]=a;N[e+8>>2]=f;N[e+4>>2]=n;k=Q(g+k);N[e>>2]=k;g=N[203222];N[e+44>>2]=j;N[e+40>>2]=i;J[e+36>>2]=b;N[e+32>>2]=f;N[e+28>>2]=n;N[e+24>>2]=g;f=N[203227];N[e+48>>2]=g;g=f;j=l;break g}o=N[203222];g=N[203224];N[e+20>>2]=j;N[e+16>>2]=i;J[e+12>>2]=b;N[e+8>>2]=g;N[e+4>>2]=n;N[e>>2]=o;f=N[203227];N[e+44>>2]=l;N[e+40>>2]=i;J[e+36>>2]=c;N[e+32>>2]=f;N[e+28>>2]=n;N[e+24>>2]=o;k=Q(N[203225]+k);N[e+48>>2]=k;c=d;i=m;d=a}N[e+72>>2]=k;N[e+92>>2]=j;N[e+88>>2]=m;J[e+84>>2]=d;N[e+80>>2]=g;N[e+76>>2]=n;N[e+68>>2]=l;N[e- -64>>2]=i;J[e+60>>2]=c;N[e+56>>2]=f;N[e+52>>2]=n;J[E>>2]=e+96}}function FE(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;t=$c-16|0;$c=t;J[d>>2]=0;e=J[a+32>>2];J[e+24>>2]=c;J[e+20>>2]=b;a:{if(!c){break a}v=e- -64|0;w=e+8256|0;b=1;while(1){if(K[e|0]==13){f=J[e+44736>>2];break a}if(!J[e+16>>2]){c=J[e+12>>2];if((w|0)==(c|0)){J[e+12>>2]=v;c=v}a=J[e+28>>2];f=bd[J[a>>2]](a,c,w-c|0,t+12|0)|0;if(f){break a}a=J[t+12>>2];J[e+16>>2]=a+J[e+16>>2];c=J[e+24>>2];b=(a|0)!=0}u=e+8256|0;q=e+10272|0;p=e+8576|0;m=e+11968|0;b:{while(1){c:{d:{e:{f:{g:{h:{i:{j:{k:{l:{m:{n:{o:{p:{q:{r:{s:{t:{u:{v:{switch(K[e|0]){case 2:a=J[e+8>>2];break s;case 10:j=J[e+60>>2];break h;case 8:j=J[e+56>>2];break j;case 3:f=J[e+8>>2];if(f>>>0<14){break r}i=J[e+4>>2];break q;case 1:f=J[e+8>>2];if(f>>>0<32){break u}i=J[e+4>>2];break t;case 12:break f;case 11:break g;case 9:break i;case 7:break k;case 6:break l;case 5:break m;case 4:break p;case 0:break v;case 13:break b;default:continue}}g=J[e+8>>2];w:{if(g>>>0>=3){a=J[e+4>>2];break w}a=J[e+16>>2];if(!a){break b}J[e+16>>2]=a-1;a=J[e+12>>2];J[e+12>>2]=a+1;a=J[e+4>>2]|K[a|0]<<g;g=g+8|0}f=g-3|0;J[e+8>>2]=f;g=a>>>3|0;J[e+4>>2]=g;H[e+1|0]=a&1;x:{switch((a>>>1&3)-1|0){default:H[e|0]=1;J[e+8>>2]=f&-8;J[e+4>>2]=g>>>(f&7);continue;case 0:Gh(p,31488,288);Gh(q,31776,32);H[e|0]=M[e+16>>2]<10?7:M[e+24>>2]>257?12:7;continue;case 1:H[e|0]=3;continue;case 2:break x}}H[e|0]=13;J[e+44736>>2]=-857812906;continue}g=J[e+16>>2];a=f;while(1){if(!g){break b}g=g-1|0;J[e+16>>2]=g;f=J[e+12>>2];J[e+12>>2]=f+1;h=K[f|0];f=a+8|0;J[e+8>>2]=f;i=J[e+4>>2]|h<<a;J[e+4>>2]=i;h=a>>>0<24;a=f;if(h){continue}break}}J[e+4>>2]=0;a=f-32|0;J[e+8>>2]=a;f=i&65535;if((f^i>>>16)!=65535){a=-857812906;break c}H[e|0]=2;J[e+32>>2]=f}y:{if(!a){break y}a=J[e+24>>2];while(1){if(!a|!J[e+32>>2]){break y}H[J[e+20>>2]]=J[e+4>>2];J[e+4>>2]=J[e+4>>2]>>>8;J[e+8>>2]=J[e+8>>2]-8;H[(J[e+36>>2]+e|0)+11968|0]=K[J[e+20>>2]];J[e+20>>2]=J[e+20>>2]+1;a=J[e+24>>2]-1|0;J[e+24>>2]=a;J[e+32>>2]=J[e+32>>2]-1;J[e+36>>2]=J[e+36>>2]+1&32767;if(J[e+8>>2]){continue}break}}a=J[e+16>>2];if(!a){break b}f=J[e+24>>2];if(!f){break b}g=J[e+32>>2];if(g){a=a>>>0<f>>>0?a:f;a=a>>>0<g>>>0?a:g;Kd(J[e+20>>2],J[e+12>>2],a);g=J[e+36>>2];h=32768-g|0;f=h>>>0<a>>>0;k=(e+g|0)+11968|0;g=f?h:a;Kd(k,J[e+20>>2],g);if(f){Kd(m,g+J[e+20>>2]|0,a-g|0)}J[e+20>>2]=a+J[e+20>>2];J[e+24>>2]=J[e+24>>2]-a;f=J[e+32>>2];J[e+32>>2]=f-a;J[e+12>>2]=a+J[e+12>>2];J[e+16>>2]=J[e+16>>2]-a;J[e+36>>2]=a+J[e+36>>2]&32767;if((a|0)!=(f|0)){continue}}H[e|0]=K[e+1|0]?13:0;continue}g=J[e+16>>2];a=f;while(1){if(!g){break b}g=g-1|0;J[e+16>>2]=g;f=J[e+12>>2];J[e+12>>2]=f+1;h=K[f|0];f=a+8|0;J[e+8>>2]=f;i=J[e+4>>2]|h<<a;J[e+4>>2]=i;h=a>>>0<6;a=f;if(h){continue}break}}g=0;J[e+32>>2]=0;H[e|0]=4;J[e+8>>2]=f-14;J[e+4>>2]=i>>>14;J[e+44>>2]=(i&31)+257;J[e+48>>2]=(i>>>5&31)+1;f=(i>>>10&15)+4|0;J[e+40>>2]=f;break o}f=J[e+40>>2];g=J[e+32>>2];if(f>>>0<=g>>>0){break n}}a=J[e+8>>2];while(1){z:{if(a>>>0>=3){h=J[e+4>>2];break z}h=J[e+16>>2];if(!h){break b}J[e+16>>2]=h-1;h=J[e+12>>2];J[e+12>>2]=h+1;h=J[e+4>>2]|K[h|0]<<a;a=a+8|0}H[(K[g+31808|0]+e|0)+8256|0]=h&7;g=g+1|0;J[e+32>>2]=g;a=a-3|0;J[e+8>>2]=a;J[e+4>>2]=h>>>3;if((f|0)!=(g|0)){continue}break}}if(f>>>0<19){while(1){H[(K[f+31808|0]+e|0)+8256|0]=0;f=f+1|0;if((f|0)!=19){continue}break}}H[e|0]=5;J[e+32>>2]=0;a=Gh(p,u,19);if(a){break c}}a=J[e+32>>2];f=J[e+48>>2]+J[e+44>>2]|0;if(a>>>0>=f>>>0){break d}while(1){a=Am(e,p);if((a|0)>15){break e}if((a|0)==-1){break b}H[(J[e+32>>2]+e|0)+8256|0]=a;a=J[e+32>>2]+1|0;J[e+32>>2]=a;if(a>>>0<f>>>0){continue}break}break d}a=-857812903;A:{B:{C:{D:{E:{F:{G:{switch(J[e+52>>2]-16|0){case 2:g=J[e+8>>2];if(g>>>0<7){break D}f=J[e+4>>2];break C;case 1:g=J[e+8>>2];if(g>>>0<3){break F}f=J[e+4>>2];break E;case 0:break G;default:break c}}g=J[e+8>>2];H:{if(g>>>0>=2){f=J[e+4>>2];break H}f=J[e+16>>2];if(!f){break b}J[e+16>>2]=f-1;f=J[e+12>>2];J[e+12>>2]=f+1;f=J[e+4>>2]|K[f|0]<<g;g=g+8|0}J[e+8>>2]=g-2;J[e+4>>2]=f>>>2;h=J[e+32>>2];if(!h){a=-857812904;break c}g=(f&3)+3|0;f=K[(e+h|0)+8255|0];break A}f=J[e+16>>2];if(!f){break b}J[e+16>>2]=f-1;f=J[e+12>>2];J[e+12>>2]=f+1;f=J[e+4>>2]|K[f|0]<<g;g=g+8|0}J[e+8>>2]=g-3;J[e+4>>2]=f>>>3;g=(f&7)+3|0;break B}f=J[e+16>>2];if(!f){break b}J[e+16>>2]=f-1;f=J[e+12>>2];J[e+12>>2]=f+1;f=J[e+4>>2]|K[f|0]<<g;g=g+8|0}J[e+8>>2]=g-7;J[e+4>>2]=f>>>7;g=(f&127)+11|0}f=0}h=J[e+32>>2];if(h+g>>>0>J[e+48>>2]+J[e+44>>2]>>>0){break c}je((e+h|0)+8256|0,f&255,g);H[e|0]=5;J[e+32>>2]=J[e+32>>2]+g;continue}if(!J[e+24>>2]){break b}a=Am(e,p);if((a|0)<=255){if((a|0)==-1){break b}H[J[e+20>>2]]=a;H[(J[e+36>>2]+e|0)+11968|0]=a;J[e+20>>2]=J[e+20>>2]+1;J[e+24>>2]=J[e+24>>2]-1;J[e+36>>2]=J[e+36>>2]+1&32767;continue}if((a|0)==256){H[e|0]=K[e+1|0]?13:0;continue}H[e|0]=8;j=a-257|0;J[e+56>>2]=j}a=J[e+8>>2];i=K[j+31840|0];I:{if(a>>>0>=i>>>0){h=J[e+4>>2];break I}g=J[e+16>>2];f=a;while(1){if(!g){break b}g=g-1|0;J[e+16>>2]=g;a=J[e+12>>2];J[e+12>>2]=a+1;h=K[a|0];a=f+8|0;J[e+8>>2]=a;h=J[e+4>>2]|h<<f;J[e+4>>2]=h;f=a;if(a>>>0<i>>>0){continue}break}}H[e|0]=9;J[e+8>>2]=a-i;J[e+4>>2]=h>>>i;J[e+56>>2]=L[(j<<1)+31872>>1]+((-1<<i^-1)&h)}j=Am(e,q);J[e+60>>2]=j;if((j|0)==-1){break b}H[e|0]=10}a=J[e+8>>2];i=K[j+31936|0];J:{if(a>>>0>=i>>>0){h=J[e+4>>2];break J}g=J[e+16>>2];f=a;while(1){if(!g){break b}g=g-1|0;J[e+16>>2]=g;a=J[e+12>>2];J[e+12>>2]=a+1;h=K[a|0];a=f+8|0;J[e+8>>2]=a;h=J[e+4>>2]|h<<f;J[e+4>>2]=h;f=a;if(a>>>0<i>>>0){continue}break}}H[e|0]=11;J[e+8>>2]=a-i;J[e+4>>2]=h>>>i;J[e+60>>2]=L[(j<<1)+31968>>1]+((-1<<i^-1)&h)}a=J[e+24>>2];if(!a){break b}g=J[e+56>>2];f=a>>>0>g>>>0?g:a;h=J[e+36>>2];if(g){i=h-J[e+60>>2]|0;l=f>>>0<=1?1:f;g=J[e+20>>2];a=0;while(1){k=g;g=K[(a+i&32767)+m|0];H[k|0]=g;H[(a+h&32767)+m|0]=g;g=J[e+20>>2]+1|0;J[e+20>>2]=g;a=a+1|0;if((l|0)!=(a|0)){continue}break}a=J[e+24>>2];g=J[e+56>>2]}else{g=0}J[e+56>>2]=g-f;a=a-f|0;J[e+24>>2]=a;J[e+36>>2]=f+h&32767;if((f|0)!=(g|0)){continue}H[e|0]=M[e+16>>2]<=9?7:a>>>0>257?12:7;continue}l=0;r=J[e+36>>2];n=r;if(M[e+24>>2]>=258){while(1){K:{i=J[e+16>>2];if(i>>>0<10|l>>>0>32509){break K}f=J[e+4>>2];a=J[e+8>>2];L:{if(a>>>0>15){h=a;break L}g=J[e+12>>2];while(1){k=g+1|0;J[e+12>>2]=k;i=i-1|0;J[e+16>>2]=i;g=K[g|0];h=a+8|0;J[e+8>>2]=h;f=g<<a|f;J[e+4>>2]=f;j=a>>>0<8;g=k;a=h;if(j){continue}break}}a=I[((f&511)<<1)+p>>1];M:{if((a|0)>=0){a=a&65535;g=a>>>9|0;J[e+8>>2]=h-g;J[e+4>>2]=f>>>g;a=a&511;break M}a=Pr(e,p)}N:{if(a>>>0<=256){if((a|0)!=256){H[m+n|0]=a;a=J[e+24>>2]-1|0;J[e+24>>2]=a;i=n+1|0;l=l+1|0;break N}H[e|0]=K[e+1|0]?13:0;break K}o=a-257|0;h=J[e+4>>2];g=J[e+8>>2];j=K[a+31583|0];O:{if(g>>>0>=j>>>0){a=g;break O}f=J[e+12>>2];i=J[e+16>>2];while(1){k=f+1|0;J[e+12>>2]=k;i=i-1|0;J[e+16>>2]=i;f=K[f|0];a=g+8|0;J[e+8>>2]=a;h=f<<g|h;J[e+4>>2]=h;f=k;g=a;if(a>>>0<j>>>0){continue}break}}a=a-j|0;J[e+8>>2]=a;f=h>>>j|0;J[e+4>>2]=f;s=-1<<j^-1;o=L[(o<<1)+31872>>1];P:{if(a>>>0>15){i=a;break P}g=J[e+12>>2];j=J[e+16>>2];while(1){k=g+1|0;J[e+12>>2]=k;j=j-1|0;J[e+16>>2]=j;g=K[g|0];i=a+8|0;J[e+8>>2]=i;f=g<<a|f;J[e+4>>2]=f;x=a>>>0<8;g=k;a=i;if(x){continue}break}}g=h&s;a=I[((f&511)<<1)+q>>1];Q:{if((a|0)>=0){k=i;i=a&65535;h=i>>>9|0;a=k-h|0;J[e+8>>2]=a;h=f>>>h|0;J[e+4>>2]=h;s=i&511;break Q}s=Pr(e,q);h=J[e+4>>2];a=J[e+8>>2]}k=g+o|0;o=K[s+31936|0];R:{if(o>>>0<=a>>>0){g=a;break R}f=J[e+12>>2];i=J[e+16>>2];while(1){j=f+1|0;J[e+12>>2]=j;i=i-1|0;J[e+16>>2]=i;f=K[f|0];g=a+8|0;J[e+8>>2]=g;h=f<<a|h;J[e+4>>2]=h;f=j;a=g;if(o>>>0>a>>>0){continue}break}}J[e+8>>2]=g-o;J[e+4>>2]=h>>>o;i=k+n|0;f=n-(L[(s<<1)+31968>>1]+((-1<<o^-1)&h)|0)|0;g=f&32767;S:{if(!(i>>>0<32768&g>>>0<=n>>>0)){a=0;if(!k){break S}while(1){H[(a+n&32767)+m|0]=K[(a+f&32767)+m|0];a=a+1|0;if((k|0)!=(a|0)){continue}break}break S}a=m+n|0;g=g+m|0;h=k&-4;if(h){j=h-1|0;f=0;while(1){H[a|0]=K[g|0];H[a+1|0]=K[g+1|0];H[a+2|0]=K[g+2|0];H[a+3|0]=K[g+3|0];a=a+4|0;g=g+4|0;f=f+4|0;if(h>>>0>f>>>0){continue}break}f=(j&-4)+4|0}else{f=0}if(k>>>0<=f>>>0){break S}while(1){H[a|0]=K[g|0];a=a+1|0;g=g+1|0;f=f+1|0;if((k|0)!=(f|0)){continue}break}}a=J[e+24>>2]-k|0;J[e+24>>2]=a;l=k+l|0}n=i&32767;if(a>>>0>257){continue}}break}J[e+36>>2]=n;if(l){T:{if(l+r>>>0<=32767){Kd(J[e+20>>2],(e+r|0)+11968|0,l);break T}a=32768-r|0;Kd(J[e+20>>2],(e+r|0)+11968|0,a);f=a+J[e+20>>2]|0;J[e+20>>2]=f;l=l-a|0;Kd(f,m,l)}J[e+20>>2]=J[e+20>>2]+l}if(K[e|0]!=12){continue}}H[e|0]=M[e+16>>2]<10?7:M[e+24>>2]>257?12:7;continue}H[e|0]=6;J[e+52>>2]=a;a=J[e+32>>2]}if((a|0)!=(f|0)){continue}J[e+32>>2]=0;H[e|0]=M[e+16>>2]<10?7:M[e+24>>2]>257?12:7;a=Gh(p,u,J[e+44>>2]);if(a){break c}a=Gh(q,J[e+44>>2]+u|0,J[e+48>>2]);if(!a){continue}}break}H[e|0]=13;J[e+44736>>2]=a}J[d>>2]=J[d>>2]+(c-J[e+24>>2]|0);f=0;c=J[e+24>>2];if(!c){break a}if(b&255){continue}break}}$c=t+16|0;return f|0}function dB(a){a=a|0;var b=0,c=0,d=0,e=Q(0),f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;f=$c-16|0;$c=f;b=a;while(1){c=d;d=d+1|0;b=J[b>>2];if(b){continue}break}a:{b:{switch(c-1|0){case 0:b=a+8|0;if(ld(b,18025)){c:{d:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break c;case 0:a=K[a+20|0];break c;default:break d}}J[a+220>>2]=-857812895;a=0}J[464807]=a;break a}if(ld(b,18019)){e:{f:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break e;case 0:a=K[a+20|0];break e;default:break f}}J[a+220>>2]=-857812895;a=0}J[464808]=a;break a}if(ld(b,17989)){g:{h:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break g;case 0:a=K[a+20|0];break g;default:break h}}J[a+220>>2]=-857812895;a=0}J[464809]=a;break a}if(ld(b,19032)){if(J[a+16>>2]!=16){J[a+220>>2]=-857812909;break a}Kd(1859256,a+20|0,16);break a}if(ld(b,1788)){J[464806]=J[a+16>>2];q=1859216,r=Al(a,5194),J[q>>2]=r}if(!ld(b,20612)){break a}rr(Al(a,20679));break a;case 1:if(ld(J[a>>2]+8|0,6780)){if(!ld(a+8|0,16845)){break a}i:{j:{switch(K[a+4|0]-1|0){case 2:a=J[a+20>>2];break i;case 1:a=I[a+20>>1];break i;case 0:a=K[a+20|0];break i;default:break j}}J[a+220>>2]=-857812894;a=0}J[464828]=a;break a}if(!ld(J[a>>2]+8|0,8697)){break a}H[J[263427]+28|0]=7;b=a+8|0;if(ld(b,18025)){k:{l:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break k;case 0:a=K[a+20|0];break k;default:break l}}J[a+220>>2]=-857812895;a=0}N[J[263427]>>2]=a<<16>>16;break a}if(ld(b,18019)){m:{n:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break m;case 0:a=K[a+20|0];break m;default:break n}}J[a+220>>2]=-857812895;a=0}N[J[263427]+4>>2]=a<<16>>16;break a}if(ld(b,17989)){o:{p:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break o;case 0:a=K[a+20|0];break o;default:break p}}J[a+220>>2]=-857812895;a=0}N[J[263427]+8>>2]=a<<16>>16;break a}if(ld(b,18786)){if(K[a+4|0]==1){e=Q(Q(Q(K[a+20|0])*Q(360))*Q(.00390625))}else{J[a+220>>2]=-857812896;e=Q(0)}N[J[263427]+16>>2]=e;break a}if(!ld(b,18478)){break a}if(K[a+4|0]==1){e=Q(Q(Q(K[a+20|0])*Q(360))*Q(.00390625))}else{J[a+220>>2]=-857812896;e=Q(0)}N[J[263427]+12>>2]=e;break a;case 3:d=L[526856];if(!ld(J[J[a>>2]>>2]+8|0,18918)){break a}if(!ld(J[J[J[a>>2]>>2]>>2]+8|0,17386)){break a}q:{if(!ld(J[a>>2]+8|0,14897)){break q}if(!ld(a+8|0,14902)){break q}r:{s:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break r;case 0:a=K[a+20|0];break r;default:break s}}J[a+220>>2]=-857812895;a=0}N[208710]=Q(a>>>0)*Q(.03125);break a}t:{if(!ld(J[a>>2]+8|0,13652)){break t}if(!ld(a+8|0,13655)){break t}if(K[a+4|0]==1){a=K[a+20|0]}else{J[a+220>>2]=-857812896;a=0}J[464855]=a;break a}u:{if(!ld(J[a>>2]+8|0,14911)){break u}b=a+8|0;if(ld(b,10510)){if(K[a+4|0]==1){a=K[a+20|0]}else{J[a+220>>2]=-857812896;a=0}I[929697]=a;break a}if(ld(b,10500)){if(K[a+4|0]==1){a=K[a+20|0]}else{J[a+220>>2]=-857812896;a=0}I[929696]=a;break a}if(ld(b,9780)){v:{w:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break v;case 0:a=K[a+20|0];break v;default:break w}}J[a+220>>2]=-857812895;a=0}J[464849]=a<<16>>16;break a}if(!ld(b,18567)){break u}if(K[a+4|0]==8){a=a+20|0}else{J[a+220>>2]=-857812892;a=41752}b=J[a+4>>2];a=J[a>>2];J[f+8>>2]=a;J[f+12>>2]=b;if(!(b&65535)){break a}Ns(f+8|0);break a}x:{if(!ld(J[a>>2]+8|0,3793)){break x}b=a+8|0;if(ld(b,10500)){y:{z:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break y;case 0:a=K[a+20|0];break y;default:break z}}J[a+220>>2]=-857812895;a=0}I[929696]=a;break a}if(ld(b,10510)){A:{B:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break A;case 0:a=K[a+20|0];break A;default:break B}}J[a+220>>2]=-857812895;a=0}I[929697]=a;break a}if(ld(b,3458)){C:{D:{switch(K[a+4|0]-1|0){case 2:a=J[a+20>>2];break C;case 1:a=I[a+20>>1];break C;case 0:a=K[a+20|0];break C;default:break D}}J[a+220>>2]=-857812894;a=0}J[464849]=a;break a}if(ld(b,3747)){E:{F:{switch(K[a+4|0]-1|0){case 2:a=J[a+20>>2];break E;case 1:a=I[a+20>>1];break E;case 0:a=K[a+20|0];break E;default:break F}}J[a+220>>2]=-857812894;a=0}J[464850]=a;break a}if(ld(b,3422)){G:{H:{switch(K[a+4|0]-1|0){case 2:a=J[a+20>>2];break G;case 1:a=I[a+20>>1];break G;case 0:a=K[a+20|0];break G;default:break H}}J[a+220>>2]=-857812894;a=0}J[464851]=a;break a}if(ld(b,16810)){if(K[a+4|0]==5){e=N[a+20>>2]}else{J[a+220>>2]=-857812893;e=Q(0)}N[464852]=e;break a}if(ld(b,16822)){if(K[a+4|0]==5){e=N[a+20>>2]}else{J[a+220>>2]=-857812893;e=Q(0)}N[464853]=e;break a}if(ld(b,14840)){if(K[a+4|0]==5){e=N[a+20>>2]}else{J[a+220>>2]=-857812893;e=Q(0)}N[464854]=e;break a}if(ld(b,11379)){if(K[a+4|0]==1){a=K[a+20|0]}else{J[a+220>>2]=-857812896;a=0}J[464856]=a;break a}if(ld(b,6936)){if(K[a+4|0]==5){e=N[a+20>>2]}else{J[a+220>>2]=-857812893;e=Q(0)}N[464857]=e;break a}if(!ld(b,7686)){break x}if(K[a+4|0]==5){e=N[a+20>>2]}else{J[a+220>>2]=-857812893;e=Q(0)}N[464858]=e;break a}I:{if(!ld(J[a>>2]+8|0,4512)){break I}b=a+8|0;if(ld(b,1643)){q=1859436,r=oh(-13159),J[q>>2]=r;break a}if(ld(b,15174)){q=1859444,r=oh(-1),J[q>>2]=r;break a}if(ld(b,11392)){q=1859440,r=oh(-1),J[q>>2]=r;break a}if(ld(b,3260)){om(oh(-1));break a}if(ld(b,2992)){nm(oh(-6579301));break a}if(!ld(b,1862)){break I}q=1859448,r=oh(-1),J[q>>2]=r;break a}if(!ld(J[a>>2]+8|0,4752)|!K[1054199]){break a}if(!_e(a+8|0,33184)){break a}b=0;a=d+66896|0;if(!K[a+17664|0]){c=a+13824|0;b=K[c|0];H[c|0]=5}H[a+17664|0]=b;zj(d,0);H[a+65280|0]=1;H[a+64512|0]=1;Nd(1044756);I[526856]=0;break a;case 4:break b;default:break a}}d=L[526856];if(!ld(J[J[J[a>>2]>>2]>>2]+8|0,18918)){break a}if(!ld(J[J[J[J[a>>2]>>2]>>2]>>2]+8|0,17386)){break a}J:{if(!ld(J[J[a>>2]>>2]+8|0,4512)){break J}b=a+8|0;if(ld(b,18413)){K:{L:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break K;case 0:a=K[a+20|0];break K;default:break L}}J[a+220>>2]=-857812895;a=0}J[263429]=a;break a}if(ld(b,18853)){M:{N:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break M;case 0:a=K[a+20|0];break M;default:break N}}J[a+220>>2]=-857812895;a=0}J[263430]=a;break a}if(!ld(b,19146)){break J}O:{P:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break O;case 0:a=K[a+20|0];break O;default:break P}}J[a+220>>2]=-857812895;a=0}J[263431]=a;break a}if(!ld(J[J[a>>2]>>2]+8|0,4752)|!K[1054199]){break a}b=a+8|0;if(ld(b,19086)){if(K[a+4|0]==1){a=K[a+20|0]}else{J[a+220>>2]=-857812896;a=0}I[526856]=a;break a}if(ld(b,20927)){Q:{R:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break Q;case 0:a=K[a+20|0];break Q;default:break R}}J[a+220>>2]=-857812895;a=0}I[526856]=a;break a}if(ld(b,13678)){c=d+75344|0;if(K[a+4|0]==1){a=K[a+20|0]}else{J[a+220>>2]=-857812896;a=0}H[c|0]=a;break a}if(ld(b,16839)){c=(d<<2)+76880|0;if(K[a+4|0]==5){e=N[a+20>>2]}else{J[a+220>>2]=-857812893;e=Q(0)}N[c>>2]=e;break a}if(ld(b,3604)){b=1;S:{if(K[a+4|0]==1){b=!K[a+20|0];break S}J[a+220>>2]=-857812896}H[d+67664|0]=b;break a}if(ld(b,3226)){c=d+68432|0;if(K[a+4|0]==1){a=K[a+20|0]}else{J[a+220>>2]=-857812896;a=0}q=c,r=kp(a),H[q|0]=r;break a}if(ld(b,2066)){c=d+80720|0;if(K[a+4|0]==1){a=K[a+20|0]}else{J[a+220>>2]=-857812896;a=0}H[c|0]=a;break a}if(ld(b,13743)){c=d+84560|0;if(K[a+4|0]==1){a=K[a+20|0]}else{J[a+220>>2]=-857812896;a=0}H[c|0]=a;break a}if(ld(b,13988)){if(K[a+4|0]==8){a=a+20|0}else{J[a+220>>2]=-857812892;a=41752}b=J[a+4>>2];J[f+8>>2]=J[a>>2];J[f+12>>2]=b;tl(d,f+8|0);break a}if(ld(b,5646)){if(K[a+4|0]!=7){J[a+220>>2]=-857812891;break a}c=J[a+16>>2];if(c>>>0<=5){J[a+220>>2]=-857812890;break a}b=a+20|0;if(c>>>0>=65){b=J[a+20>>2];if(!b){break a}}a=P(d,12)+66896|0;d=a+55306|0;g=K[b|0];I[d>>1]=g;h=a+55304|0;i=K[b+1|0];I[h>>1]=i;j=a+55296|0;k=K[b+2|0];I[j>>1]=k;l=a+55298|0;m=K[b+3|0];I[l>>1]=m;n=a+55300|0;o=K[b+4|0];I[n>>1]=o;a=a+55302|0;p=K[b+5|0];I[a>>1]=p;if(c>>>0<12){break a}I[d>>1]=K[b+6|0]<<8|g;I[h>>1]=K[b+7|0]<<8|i;I[j>>1]=K[b+8|0]<<8|k;I[l>>1]=K[b+9|0]<<8|m;I[n>>1]=o|K[b+10|0]<<8;I[a>>1]=p|K[b+11|0]<<8;break a}if(ld(b,15265)){c=d+82256|0;T:{if(K[a+4|0]!=1){J[a+220>>2]=-857812896;H[d+81488|0]=0;a=0;break T}a=K[a+20|0];H[d+81488|0]=a;a=(a|0)==6?4:a}H[c|0]=a;break a}if(ld(b,11392)){if(K[a+4|0]!=7){J[a+220>>2]=-857812891;break a}c=J[a+16>>2];if(c>>>0<=3){J[a+220>>2]=-857812890;break a}b=a+20|0;if(c>>>0>=65){b=J[a+20>>2];if(!b){break a}}a=(d<<2)+72272|0;N[a>>2]=Q(K[b|0]+1|0)*Q(.0078125);c=K[b|0];if(!(c?(c|0)!=255:0)){J[a>>2]=0}J[(d<<2)+69200>>2]=K[b+1|0]|K[b+2|0]<<8|K[b+3|0]<<16|-16777216;break a}if(!ld(b,6098)){break a}if(K[a+4|0]!=7){J[a+220>>2]=-857812891;break a}c=J[a+16>>2];if(c>>>0<=5){J[a+220>>2]=-857812890;break a}b=a+20|0;if(c>>>0>=65){b=J[a+20>>2];if(!b){break a}}a=P(d,12)+66896|0;N[a+18432>>2]=Q(H[b|0])*Q(.0625);N[a+27648>>2]=Q(H[b+3|0])*Q(.0625);N[a+18436>>2]=Q(H[b+1|0])*Q(.0625);N[a+27652>>2]=Q(H[b+4|0])*Q(.0625);N[a+18440>>2]=Q(H[b+2|0])*Q(.0625);N[a+27656>>2]=Q(H[b+5|0])*Q(.0625)}$c=f+16|0}function lD(){var a=0,b=0,c=0,d=Q(0),e=0,f=Q(0),g=0,h=0,i=Q(0),j=0,k=0,l=0,m=0,n=0,o=0,p=Q(0),q=0,r=0,s=0,t=0,u=0;if(K[1054053]){l=$c-128|0;$c=l;a=se();h=ad;c=er(J[263490],J[263491],a,h);b=ad;q=+((!b&c>>>0>=5e6|b?5e6:c)|0)/1e6;i=Q(q);a:{if(!K[1869769]){break a}H[1869769]=0;if(!K[1869220]){break a}b:{if(Ua()|0){c=ya()|0;m=+ca()*+(c|0);c:{if(R(m)<2147483648){c=~~m;break c}c=-2147483648}b=xa()|0;m=+ca()*+(b|0);d:{if(R(m)<2147483648){b=~~m;break d}b=-2147483648}Xa(6208,c|0,b|0)|0;break b}Oc()}Bh()}e:{if(i<=Q(0)){break e}J[263490]=a;J[263491]=h;f:{if(K[1054308]){if(Cc(0)|0){break f}H[1054308]=0;Pg(2380);Nd(1043456)}$(34963,J[263615]);O[131740]=q+O[131740];J[263512]=0;e=$c-1440|0;$c=e;g:{if(Nc()|0){break g}r=Mc()|0;if((r|0)<=0){break g}h=e+48|0;j=e+40|0;k=e+32|0;s=e+24|0;while(1){h:{if(Lc(o|0,e+8|0)|0){break h}b=o+235|0;a=0;i:{while(1){c=P(a,220)+1056736|0;n=J[c+76>>2];if((n|0)==(b|0)){break i}if(!n){Kd(c,35028,76);J[c+72>>2]=P(a,100)+1057840;J[c+4>>2]=a;J[c+76>>2]=b;J[c+68>>2]=34688;Eo(c);H[1056337]=K[1056337]|2;break i}a=a+1|0;if((a|0)!=5){continue}break}a=0;Yd(4566)}b=a;c=a;j:{k:{l:{m:{n:{o:{p:{q:{r:{s:{t:{u:{v:{w:{x:{y:{z:{A:{B:{C:{D:{E:{F:{G:{H:{I:{J:{K:{a=J[e+20>>2];L:{if((a|0)<=0){Vd(b,149,0);break L}Vd(b,149,J[e+1048>>2]);if((a|0)!=1){break K}}Vd(b,150,0);break J}Vd(b,150,J[e+1052>>2]);if(a>>>0>2){break I}}Vd(b,151,0);break H}Vd(b,151,J[e+1056>>2]);if((a|0)!=3){break G}}Vd(b,152,0);break F}Vd(b,152,J[e+1060>>2]);if(a>>>0>4){break E}}Vd(b,164,0);break D}Vd(b,164,J[e+1064>>2]);if((a|0)!=5){break C}}Vd(b,165,0);break B}Vd(b,165,J[e+1068>>2]);if(a>>>0>6){break A}}Vd(b,153,0);break z}Vd(b,153,J[e+1072>>2]);if((a|0)!=7){break y}}Vd(b,154,0);break x}Vd(b,154,J[e+1076>>2]);if(a>>>0>8){break w}}Vd(b,163,0);break v}Vd(b,163,J[e+1080>>2]);if((a|0)!=9){break u}}Vd(b,162,0);break t}Vd(b,162,J[e+1084>>2]);if(a>>>0>10){break s}}Vd(b,166,0);break r}Vd(b,166,J[e+1088>>2]);if((a|0)!=11){break q}}Vd(b,167,0);break p}Vd(b,167,J[e+1092>>2]);if(a>>>0>12){break o}}Vd(b,160,0);break n}Vd(b,160,J[e+1096>>2]);if((a|0)!=13){break m}}Vd(b,161,0);break l}Vd(b,161,J[e+1100>>2]);if(a>>>0>14){break k}}Vd(b,158,0);a=0;break j}Vd(b,158,J[e+1104>>2]);a=(a|0)!=15?J[e+1108>>2]:0}Vd(c,159,a);n=J[e+16>>2];M:{if((n|0)>=4){d=Q(O[e+24>>3]);f=Q(d*Q(8));p=d>=Q(-.10000000149011612)?d<=Q(.10000000149011612)?Q(0):f:f;d=Q(O[e+32>>3]);f=Q(d*Q(8));Do(b,0,p,d>=Q(-.10000000149011612)?d<=Q(.10000000149011612)?Q(0):f:f,i);c=h;a=j;break M}c=k;a=s;if((n|0)<2){break h}}d=Q(O[a>>3]);f=Q(d*Q(8));p=d>=Q(-.10000000149011612)?d<=Q(.10000000149011612)?Q(0):f:f;d=Q(O[c>>3]);f=Q(d*Q(8));Do(b,1,p,d>=Q(-.10000000149011612)?d<=Q(.10000000149011612)?Q(0):f:f,i)}o=o+1|0;if((r|0)!=(o|0)){continue}break}}$c=e+1440|0;while(1){a=P(g,220)+1056736|0;if(J[a+76>>2]){c=0;while(1){N:{if(!K[(a+c|0)+96|0]){break N}b=a+(c<<2)|0;d=Q(N[b+120>>2]+i);N[b+120>>2]=d;if(d<Q(1)){break N}J[b+120>>2]=0;J[a+8>>2]=0;He(1050996,c+149|0,1,a)}c=c+1|0;if((c|0)!=23){continue}break}}g=g+1|0;if((g|0)!=5){continue}break}bd[J[J[203292]+20>>2]](J[207101],i);g=J[263697];if(!(!K[1054052]|(g|K[1869221]))){gh();g=J[263697]}if(!(g|!K[1065592])){a=J[203296];c=J[207101];if(!(!K[c+470|0]|!K[c+472|0])){J[203296]=a;uk(a)}}g=J[263474];if(g){while(1){d=Q(N[g>>2]+i);N[g>>2]=d;if(d>=N[g+4>>2]){while(1){bd[J[g+8>>2]](g)|0;d=N[g+4>>2];f=Q(N[g>>2]-d);N[g>>2]=f;if(d<=f){continue}break}}g=J[g+12>>2];if(g){continue}break}}d=Q(N[263492]/N[263493]);a=J[207101];if(!(K[a+494|0]?K[a+493|0]:0)){Jh(a+4|0,a+352|0,a+384|0,d)}Tl(a,d);h=l- -64|0;bd[J[J[203292]+16>>2]](h,d);J[203291]=J[l+72>>2];a=J[l+68>>2];J[203289]=J[l+64>>2];J[203290]=a;Kl();if(K[1869223]){break e}jp(3);O:{if(!Oo()){bd[J[J[203292]+36>>2]](1054056);P:{if(J[263697]){break P}f=Q(Q(i*Q(1e3))*Q(Q(J[203269])/Q(25)));a=J[263483];if(K[1065603]){c=(a<<3)+813196|0;N[c>>2]=N[c>>2]-f}if(K[1065604]){c=(a<<3)+813196|0;N[c>>2]=f+N[c>>2]}if(K[1065606]){c=(a<<3)+813192|0;N[c>>2]=N[c>>2]-f}if(!K[1065605]){break P}a=(a<<3)+813192|0;N[a>>2]=f+N[a>>2]}c=0;f=Q(N[266388]+i);N[266388]=f;Q:{if(J[263697]|f<Q(.24950000643730164)){break Q}J[266388]=0;R:{if(!K[1055388]){a=K[1065557];c=K[1065556];b=K[1065558];break R}S:{T:{b=J[12613];U:{if((b|0)!=1){break U}a=J[264040];if((a|0)<=0){break T}V:{while(1){j=P(c,24)+1055392|0;k=K[j+4|0];if(k&4){break V}c=c+1|0;if((a|0)!=(c|0)){continue}break}c=0;break U}H[j+4|0]=k&6;c=1}a=0;if(b){break S}a=0;b=J[264040];if((b|0)<=0){break S}while(1){j=P(a,24)+1055392|0;k=K[j+4|0];if(!(k&4)){a=a+1|0;if((b|0)!=(a|0)){continue}break T}break}H[j+4|0]=k&6;a=1;break S}a=0}b=0}W:{if(!K[1811803]){break W}J[12836]=-1;if(c&255){cf(0,1)}if(a&255){cf(1,1)}if(!b){break W}cf(2,1)}if(c&255){Uk();break Q}if(a&255){Tk();break Q}if(!b){break Q}zo()}if(K[1054201]){Qd(h,1054376,64);a=Qd(l,1054312,64);c=$c-128|0;$c=c;b=c- -64|0;ag(b,Q(.07000000029802322),Q(0),Q(0));h=a- -64|0;me(1054376,h,b);ag(c,Q(-.10000000149011612),Q(0),Q(0));me(1054312,a,c);ll(0,1,1,0);$c=c+128|0;sl(i,d);c=$c-128|0;$c=c;b=c- -64|0;ag(b,Q(-.07000000029802322),Q(0),Q(0));me(1054376,h,b);ag(c,Q(.10000000149011612),Q(0),Q(0));me(1054312,a,c);jp(2);ll(1,0,0,0);$c=c+128|0;sl(i,d);Qd(1054376,h,64);ll(1,1,1,1);break O}sl(i,d);break O}J[263514]=-1;J[263515]=-1;J[263542]=-1;J[263543]=-1;I[527090]=1536;I[527058]=0;J[263516]=-1;J[263544]=-1}g=0;c=J[263478];b=J[263479];a=$c+-64|0;$c=a;a=Qd(a,44448,64);J[a+56>>2]=-1085180835;J[a+40>>2]=-1158787057;N[a+20>>2]=Q(-2)/Q(b|0);J[a+48>>2]=-1082130432;J[a+52>>2]=1065353216;N[a>>2]=Q(2)/Q(c|0);Me(0,a);Me(1,44448);lh(0);Z(0);We(1);c=K[1054292];H[1054472]=c;if(c){Bf(0)}$c=a- -64|0;d=Q(0);f=N[263700];X:{if(!(f>Q(0))){break X}Y:{if(!(f<Q(0))){d=Q(1);if(!(f>Q(1))){break Y}}N[263700]=d}a=J[467304];h=J[467303];if(!J[263717]){c=of(0,8);J[263717]=c;if(!c){break X}}ie(0);b=J[263701];k=N[263700]==Q(1)?4:8;j=qe(0,k);d=N[263700];Z:{if(d==Q(1)){jl(0,h,a,b,b,j);break Z}c=a;d=Q(Q(d*Q(a|0))*Q(.5));_:{if(Q(R(d))<Q(2147483648)){a=~~d;break _}a=-2147483648}jl(c-a|0,h,a,b,b,jl(0,h,a,b,b,j))}Pd(J[263717]);ae(k)}c=J[263682];if((c|0)>0){while(1){a=c-1|0;b=J[(a<<2)+1054816>>2];bd[J[J[b>>2]+4>>2]](b,i);if(K[b+7|0]){bd[J[J[b>>2]+16>>2]](b);H[b+7|0]=0}bd[J[J[b>>2]+12>>2]](b,i);b=c>>>0>1;c=a;if(b){continue}break}}while(1){a=J[(g<<2)+1053936>>2];if(a){bd[a|0](i)}g=g+1|0;if((g|0)!=4){continue}break}lh(1);Z(1);We(0);if(K[1054472]){Bf(1)}if(K[1053956]){a=$c-720|0;$c=a;H[1053956]=0;b=a+612|0;Ca(b|0);J[a+716>>2]=4194304;J[a+712>>2]=a+640;c=a+712|0;Tf(c,20711,b,a+616|0,a+620|0);Tf(c,11833,a+624|0,a+628|0,a+632|0);b=a+12|0;Je(b,c);_c(b|0);$c=a+720|0}break e}O[131740]=O[131740]+ +i;bd[J[452938]](1053984)|0}$c=l+128|0;return}H[1054310]=0;J[260148]=0;J[260278]=0;J[260473]=0;J[260668]=0;J[260993]=0;J[261253]=0;J[261383]=0;J[260213]=0;J[260408]=0;J[260343]=0;J[260603]=0;J[260538]=0;J[260928]=0;J[260863]=0;J[260798]=0;J[260733]=0;J[261123]=0;J[261058]=0;J[261318]=0;J[261643]=0;J[261578]=0;J[261513]=0;J[261448]=0;J[261903]=0;J[261838]=0;J[261773]=0;J[261708]=0;J[262423]=0;J[262358]=0;J[262293]=0;J[262228]=0;J[262163]=0;J[262098]=0;J[262033]=0;J[261968]=0;J[262878]=0;J[262813]=0;J[262748]=0;J[262683]=0;J[262618]=0;J[262553]=0;J[262488]=0;J[263138]=0;J[263073]=0;J[263008]=0;J[262943]=0;J[263203]=0;J[263398]=0;J[263333]=0;J[263268]=0;J[263474]=0;a=J[263472];if(a){while(1){c=J[a+4>>2];if(c){bd[c|0]()}a=J[a+20>>2];if(a){continue}break}}J[12861]=193;H[1054053]=0;ap();Bc(J[467444])|0;Ta(6208,0,0,0,2)|0;if(J[392204]){b=$c-32|0;$c=b;a=J[390916];if((a|0)>0){while(1){c=a-1|0;$d(b,1563656,c);h=J[b+4>>2];J[b+24>>2]=J[b>>2];J[b+28>>2]=h;h=b+16|0;kf(b+24|0,61,h,b+8|0);if(!pn(h)){Lh(1563656,c)}h=a>>>0>1;a=c;if(h){continue}break}}t=1573960,u=Zj(1563656,2159,61,766),J[t>>2]=u;$c=b+32|0;Kh(1563656,2159);cg(1568808)}ar();$q();ia()}function $n(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;J[263482]=J[263482]+1;J[b>>2]=J[b>>2]+1;l=$c-59600|0;$c=l;m=L[a>>1];t=L[a+2>>1];u=L[a+4>>1];J[195009]=l+23328;J[195008]=l+47904;J[195010]=l;bd[J[195011]]();a:{b:{c:{w=u-8|0;x=m-8|0;o=t-8|0;d:{if(!w|(!x|!o)){break d}p=J[464807];if((p|0)<=(m+8|0)|J[464808]<=(t+8|0)){break d}q=J[464809];if((q|0)>(u+8|0)){break c}}je(l+47904|0,0,11664);g=J[464804];if(J[464818]<=255){j=m-9|0;p=J[195008];q=J[464808];k=-1;c=1;while(1){b=k+o|0;e:{if((b|0)<0){break e}if((b|0)>=(q|0)){break b}v=P(k,324)+342|0;r=J[464809];s=P(r,b);h=J[464807];f=-1;while(1){b=f+w|0;f:{if((b|0)<0){break f}if((b|0)>=(r|0)){break e}i=v+P(f,18)|0;d=j+P(h,b+s|0)|0;b=-1;while(1){e=b+x|0;if((e|0)>=0){if((e|0)>=(h|0)){break f}e=K[d+g|0];c=c&255?K[e+80720|0]==4:0;I[p+(i<<1)>>1]=e}i=i+1|0;d=d+1|0;b=b+1|0;if((b|0)!=17){continue}break}}f=f+1|0;if((f|0)!=17){continue}break}}k=k+1|0;if((k|0)!=17){continue}break}break b}j=m-9|0;p=J[195008];q=J[464808];v=J[464805];k=-1;c=1;while(1){b=k+o|0;g:{if((b|0)<0){break g}if((b|0)>=(q|0)){break b}r=P(k,324)+342|0;s=J[464809];y=P(s,b);f=J[464807];e=-1;while(1){b=e+w|0;h:{if((b|0)<0){break h}if((b|0)>=(s|0)){break g}d=r+P(e,18)|0;b=j+P(f,b+y|0)|0;i=-1;while(1){h=i+x|0;if((h|0)>=0){if((f|0)<=(h|0)){break h}h=K[b+g|0]|K[b+v|0]<<8;c=c&255?K[h+80720|0]==4:0;I[p+(d<<1)>>1]=h}d=d+1|0;b=b+1|0;i=i+1|0;if((i|0)!=17){continue}break}}e=e+1|0;if((e|0)!=17){continue}break}}k=k+1|0;if((k|0)!=17){continue}break}break b}v=J[464804];if(J[464818]<=255){r=m-9|0;s=J[195008];k=-1;e=18;c=1;b=1;while(1){y=P(k,324)+324|0;z=P(q,k+o|0)+w|0;f=e;h=-1;while(1){g=h;h=h+1|0;d=y+P(h,18)|0;j=r+P(p,g+z|0)|0;g=b;while(1){A=c&255;i=K[j+v|0];b=0;c=0;c=A?K[i+80720|0]==4:c;b=g&255?K[i+83792|0]!=0:b;I[s+(d<<1)>>1]=i;j=j+1|0;g=b;d=d+1|0;if((d|0)!=(f|0)){continue}break}f=f+18|0;if((h|0)!=17){continue}break}e=e+324|0;k=k+1|0;if((k|0)!=17){continue}break}break a}r=m-9|0;s=J[195008];y=J[464805];e=-1;k=18;c=1;b=1;while(1){z=P(e,324)+324|0;A=P(q,e+o|0)+w|0;f=k;d=-1;while(1){g=d;d=d+1|0;j=z+P(d,18)|0;i=r+P(p,g+A|0)|0;g=b;while(1){h=K[i+v|0]|K[i+y|0]<<8;B=c&255;b=0;c=0;c=B?K[h+80720|0]==4:c;b=g&255?K[h+83792|0]!=0:b;I[s+(j<<1)>>1]=h;i=i+1|0;g=b;j=j+1|0;if((j|0)!=(f|0)){continue}break}f=f+18|0;if((d|0)!=17){continue}break}k=k+324|0;e=e+1|0;if((e|0)!=17){continue}break}break a}b=0}H[a+6|0]=K[a+6|0]&247|c<<3&8;i:{if(c&255|b){break i}bd[J[266954]](m-9|0,t-9|0,u-9|0);je(l+23328|0,1,24576);k=0;q=J[464807];b=m+8|0;r=(b|0)>(q|0)?q:b;J[195012]=r;v=J[464809];b=u+8|0;s=(b|0)>(v|0)?v:b;J[195013]=s;b=J[464808];c=t+8|0;y=(b|0)<(c|0)?b:c;z=(b|0)<=(o|0);if(!z){p=0;f=o;while(1){if((v|0)>(w|0)){A=p<<8;B=P(p,324)+325|0;c=0;h=w;while(1){g=c+1|0;if((q|0)>(x|0)){C=A|c<<4;c=P(g,18)+B|0;i=0;b=x;while(1){u=c<<1;e=u+J[195008]|0;j=L[e>>1];d=j+66896|0;m=K[d+13824|0];j:{if((m|0)==4){break j}if((m|0)==5){d=(L[P(j,12)+122194>>1]>>>J[458159]<<5)+780136|0;J[d>>2]=J[d>>2]+16;break j}J[195022]=f;J[195021]=b;J[195023]=h;H[780096]=K[d+1536|0];t=P(j,768);k:{l:{d=J[195009];m=P(i|C,6);n=d+m|0;m:{if(!K[n|0]){break m}if(!b){if(J[195019]>(f|0)){break m}if((j&65532)!=8){break l}if(J[195020]>(f|0)){break m}break l}if(!(H[(t+L[e-2>>1]|0)+132944|0]&1)){break l}}H[n|0]=0;break k}e=bd[J[195025]](m,b,f,h,c,j,0)|0;d=J[195009];H[m+d|0]=e}n:{o:{e=m|1;n=e+d|0;p:{if(!K[n|0]){break p}if(J[464810]==(b|0)){if(J[195019]>(f|0)){break p}if((j&65532)!=8){break o}if(J[195020]>(f|0)){break p}break o}if(!(K[(t+L[(u+J[195008]|0)+2>>1]|0)+132944|0]&2)){break o}}H[n|0]=0;break n}n=bd[J[195025]](e,b,f,h,c,j,1)|0;d=J[195009];H[e+d|0]=n}q:{r:{e=d;d=m+2|0;e=e+d|0;s:{if(!K[e|0]){break s}if(!h){if(J[195019]>(f|0)){break s}if((j&65532)!=8){break r}if(J[195020]>(f|0)){break s}break r}if(!(K[(t+L[(u+J[195008]|0)-36>>1]|0)+132944|0]&4)){break r}}H[e|0]=0;e=J[195009];break q}n=bd[J[195026]](d,b,f,h,c,j,2)|0;e=J[195009];H[d+e|0]=n}t:{u:{d=m+3|0;n=d+e|0;v:{if(!K[n|0]){break v}if(J[464812]==(h|0)){if(J[195019]>(f|0)){break v}if((j&65532)!=8){break u}if(J[195020]>(f|0)){break v}break u}if(!(K[(t+L[(u+J[195008]|0)+36>>1]|0)+132944|0]&8)){break u}}H[n|0]=0;break t}n=bd[J[195026]](d,b,f,h,c,j,3)|0;e=J[195009];H[d+e|0]=n}w:{x:{d=m+4|0;e=d+e|0;if(!(!f|!K[e|0])){if(!(K[(t+L[(u+J[195008]|0)-648>>1]|0)+132944|0]&16)){break x}}H[e|0]=0;e=J[195009];break w}n=bd[J[195026]](d,b,f,h,c,j,4)|0;e=J[195009];H[d+e|0]=n}y:{d=m+5|0;e=d+e|0;if(K[e|0]){if(!(K[(t+L[(u+J[195008]|0)+648>>1]|0)+132944|0]&32)){break y}}H[e|0]=0;break j}if((j-12&65535)>>>0<=65531){e=bd[J[195026]](d,b,f,h,c,j,5)|0;H[d+J[195009]|0]=e;break j}e=bd[J[195027]](d,b,f,h,c,j)|0;H[d+J[195009]|0]=e}c=c+1|0;i=i+1|0;b=b+1|0;if((r|0)>(b|0)){continue}break}}c=g;h=h+1|0;if((s|0)>(h|0)){continue}break}}p=p+1|0;f=f+1|0;if((y|0)>(f|0)){continue}break}}d=0;while(1){b=d<<5;g=b+780112|0;b=J[b+780136>>2];c=0;while(1){b=J[g+(c<<2)>>2]+b|0;c=c+1|0;if((c|0)!=6){continue}break}k=b+k|0;d=d+1|0;if((d|0)!=1024){continue}break}if(!k){break i}b=0;J[l+59568>>2]=0;z:{if(J[266967]<=0){break z}g=P(J[464824],P(J[464825],w>>4)+(o>>4)|0)+(x>>4)|0;i=0;c=0;while(1){f=c<<5;h=l+59568|0;d=P(g+P(J[464827],c)|0,20);b=Nn(f+780112|0,h,d+J[268508]|0)|b;i=Nn(f+796496|0,h,d+J[268509]|0)|i;c=c+1|0;if((c|0)<J[266967]){continue}break}A:{if(b&255){J[a+12>>2]=J[268508]+P(g,20);if(i&255){break A}break z}if(!(i&255)){break z}}J[a+16>>2]=J[268509]+P(g,20)}b=k+1|0;g=ih(b);J[a+8>>2]=g;c=0;i=qe(1,b);J[195014]=i;h=l+59584|0;f=0;while(1){g=f<<5;J[g+780140>>2]=c;b=g+780128|0;d=J[b+4>>2];J[h>>2]=J[b>>2];J[h+4>>2]=d;b=g+780120|0;d=J[b+4>>2];J[l+59576>>2]=J[b>>2];J[l+59580>>2]=d;d=g+780112|0;b=J[d+4>>2];J[l+59568>>2]=J[d>>2];J[l+59572>>2]=b;c=J[g+780136>>2]+c|0;b=0;while(1){k=b<<2;J[k+d>>2]=i+P(c,24);c=J[k+(l+59568|0)>>2]+c|0;b=b+1|0;if((b|0)!=6){continue}break}J[g+796524>>2]=c;b=g+796512|0;d=J[b+4>>2];J[h>>2]=J[b>>2];J[h+4>>2]=d;b=g+796504|0;d=J[b+4>>2];J[l+59576>>2]=J[b>>2];J[l+59580>>2]=d;d=g+796496|0;b=J[d+4>>2];J[l+59568>>2]=J[d>>2];J[l+59572>>2]=b;c=J[g+796520>>2]+c|0;b=0;while(1){g=b<<2;J[g+d>>2]=i+P(c,24);c=J[g+(l+59568|0)>>2]+c|0;b=b+1|0;if((b|0)!=6){continue}break}f=f+1|0;if((f|0)!=512){continue}break}if(!z){h=0;while(1){if((v|0)>(w|0)){f=h<<8;d=P(h,324)+325|0;c=0;j=w;while(1){g=c+1|0;if((q|0)>(x|0)){k=f|c<<4;c=d+P(g,18)|0;b=0;i=x;while(1){e=L[(l+47904|0)+(c<<1)>>1];I[390030]=e;if(K[e+80720|0]!=4){J[195016]=c;bd[J[195017]](P(b|k,6),i,o,j)}c=c+1|0;b=b+1|0;i=i+1|0;if((r|0)>(i|0)){continue}break}}c=g;j=j+1|0;if((s|0)>(j|0)){continue}break}}h=h+1|0;o=o+1|0;if((y|0)>(o|0)){continue}break}}hh()}$c=l+59600|0;c=K[a+6|0];b=J[a+12>>2];B:{if(!b){b=c&233;if(J[a+16>>2]){H[a+6|0]=b;break B}H[a+6|0]=b|18;return}H[a+6|0]=c&233;c=J[266967];if((c|0)<=0){break B}f=P(J[268510],20);g=0;while(1){if(J[b>>2]>=0){h=(g<<2)+1067872|0;J[h>>2]=J[h>>2]+1}b=b+f|0;g=g+1|0;if((c|0)!=(g|0)){continue}break}}b=J[a+16>>2];C:{if(!b){break C}a=J[266967];if((a|0)<=0){break C}c=P(J[268510],20);g=0;while(1){if(J[b>>2]>=0){f=(g<<2)+1070944|0;J[f>>2]=J[f>>2]+1}b=b+c|0;g=g+1|0;if((a|0)!=(g|0)){continue}break}}}function ux(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=Q(0),g=Q(0),h=0,i=Q(0),j=Q(0),k=0,l=0,m=0,n=Q(0),o=Q(0),p=Q(0),q=Q(0),r=Q(0),s=Q(0),t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0;h=L[390030];e=K[h+80720|0];if((e|0)==5){Dk(b,c,d);return}a=J[195009]+a|0;z=K[a+5|0];A=K[a+4|0];t=K[a+1|0];u=K[a|0];y=K[a+3|0];v=K[a+2|0];a:{if(!(A|(t|u|(y|v))|z)){break a}x=((e|0)==3)<<9;J[203220]=x;a=h+66896|0;H[780096]=K[a+1536|0];H[812884]=K[a+16128|0];a=P(h,12)+66896|0;g=N[a+46088>>2];f=N[a+46084>>2];p=N[a+46080>>2];j=N[a+36872>>2];i=N[a+36868>>2];n=Q(b|0);N[203222]=N[a+36864>>2]+n;o=i;i=Q(c|0);N[203223]=o+i;o=j;j=Q(d|0);N[203224]=o+j;N[203225]=p+n;N[203226]=f+i;N[203227]=g+j;h=a+18432|0;e=J[h+4>>2];J[203228]=J[h>>2];J[203229]=e;J[203230]=J[a+18440>>2];h=a+27648|0;e=J[h+4>>2];J[203231]=J[h>>2];J[203232]=e;J[203233]=J[a+27656>>2];n=Q(Q(1)-N[203229]);N[203229]=n;i=Q(Q(1)-N[203232]);N[203232]=i;if(u){w=L[a+55296>>1];a=-1;B=J[458159];o=N[203233];p=N[203230];f=N[458160];C=J[458158];e=b-1|0;k=bd[J[266964]](e,c,d)|0;l=-1;h=-1;m=-1;b:{if(K[780096]){break b}l=kg(k,e,c,d,-1,-1);if(K[780096]){break b}h=kg(k,e,c,d,1,-1);if(K[780096]){break b}a=kg(k,e,c,d,1,1);if(K[780096]){break b}m=kg(k,e,c,d,-1,1)}if(K[812884]){e=J[(L[390030]<<2)+69200>>2];l=sd(l,e);h=sd(h,e);a=sd(a,e);m=sd(m,e)}g=N[203222];j=N[203226];q=N[203227];k=(x+(w>>>B|0)<<5)+780112|0;e=J[k>>2];r=Q(f*Q(w&C));s=Q(Q(i*f)+r);N[e+20>>2]=s;i=Q(u-1|0);o=Q(Q(o*Q(.9993749856948853))+i);N[e+16>>2]=o;J[e+12>>2]=a;q=Q(q+i);N[e+8>>2]=q;N[e+4>>2]=j;N[e>>2]=g;i=N[203224];N[e+44>>2]=s;N[e+40>>2]=p;J[e+36>>2]=h;N[e+32>>2]=i;N[e+28>>2]=j;N[e+24>>2]=g;j=N[203223];f=Q(Q(Q(n*f)*Q(.9993749856948853))+r);N[e+92>>2]=f;N[e+88>>2]=o;J[e+84>>2]=m;N[e+80>>2]=q;N[e+76>>2]=j;N[e+72>>2]=g;N[e+68>>2]=f;N[e- -64>>2]=p;J[e+60>>2]=l;N[e+56>>2]=i;N[e+52>>2]=j;N[e+48>>2]=g;J[k>>2]=e+96}if(t){u=L[P(L[390030],12)+122194>>1];w=J[458159];x=J[203220];i=N[203229];j=N[203232];n=N[203233];o=N[203230];f=N[458160];B=J[458158];e=b+1|0;k=bd[J[266964]](e,c,d)|0;a=-1;h=-1;l=-1;m=-1;c:{if(K[780096]){break c}h=kg(k,e,c,d,-1,-1);if(K[780096]){break c}l=kg(k,e,c,d,1,-1);if(K[780096]){break c}a=kg(k,e,c,d,1,1);if(K[780096]){break c}m=kg(k,e,c,d,-1,1)}if(K[812884]){e=J[(L[390030]<<2)+69200>>2];h=sd(h,e);l=sd(l,e);a=sd(a,e);m=sd(m,e)}g=N[203225];p=N[203226];q=N[203227];k=(x+(u>>>w|0)<<5)+780116|0;e=J[k>>2];r=Q(f*Q(u&B));s=Q(Q(j*f)+r);N[e+20>>2]=s;n=Q(Q(Q(1)-n)*Q(.9993749856948853));N[e+16>>2]=n;J[e+12>>2]=a;q=Q(q+Q(t-1|0));N[e+8>>2]=q;N[e+4>>2]=p;N[e>>2]=g;j=N[203223];i=Q(Q(Q(f*i)*Q(.9993749856948853))+r);N[e+44>>2]=i;N[e+40>>2]=n;J[e+36>>2]=m;N[e+32>>2]=q;N[e+28>>2]=j;N[e+24>>2]=g;f=N[203224];N[e+92>>2]=s;n=Q(Q(t>>>0)-o);N[e+88>>2]=n;J[e+84>>2]=l;N[e+80>>2]=f;N[e+76>>2]=p;N[e+72>>2]=g;N[e+68>>2]=i;N[e- -64>>2]=n;J[e+60>>2]=h;N[e+56>>2]=f;N[e+52>>2]=j;N[e+48>>2]=g;J[k>>2]=e+96}if(v){t=L[P(L[390030],12)+122196>>1];k=-1;u=J[458159];w=J[203220];i=N[203229];n=N[203232];o=N[203231];q=N[203228];f=N[458160];x=J[458158];e=d-1|0;l=bd[J[266965]](b,c,e)|0;m=-1;h=-1;a=-1;d:{if(K[780096]){break d}m=jg(l,b,c,e,-1,-1);if(K[780096]){break d}h=jg(l,b,c,e,1,-1);if(K[780096]){break d}k=jg(l,b,c,e,1,1);if(K[780096]){break d}a=jg(l,b,c,e,-1,1)}if(K[812884]){e=J[(L[390030]<<2)+69200>>2];m=sd(m,e);h=sd(h,e);k=sd(k,e);a=sd(a,e)}p=N[203222];j=N[203223];g=N[203224];l=(w+(t>>>u|0)<<5)+780120|0;e=J[l>>2];r=Q(f*Q(t&x));s=Q(Q(Q(f*i)*Q(.9993749856948853))+r);N[e+20>>2]=s;q=Q(Q(v>>>0)-q);N[e+16>>2]=q;J[e+12>>2]=m;N[e+8>>2]=g;N[e+4>>2]=j;N[e>>2]=p;i=N[203226];f=Q(Q(n*f)+r);N[e+44>>2]=f;N[e+40>>2]=q;J[e+36>>2]=a;N[e+32>>2]=g;N[e+28>>2]=i;N[e+24>>2]=p;p=N[203225];N[e+92>>2]=s;n=Q(Q(Q(1)-o)*Q(.9993749856948853));N[e+88>>2]=n;J[e+84>>2]=h;N[e+80>>2]=g;N[e+76>>2]=j;N[e+68>>2]=f;N[e- -64>>2]=n;J[e+60>>2]=k;N[e+56>>2]=g;N[e+52>>2]=i;g=Q(p+Q(v-1|0));N[e+72>>2]=g;N[e+48>>2]=g;J[l>>2]=e+96}if(y){t=L[P(L[390030],12)+122198>>1];v=J[458159];u=J[203220];n=N[203229];i=N[203232];o=N[203231];p=N[203228];f=N[458160];w=J[458158];e=d+1|0;l=bd[J[266965]](b,c,e)|0;k=-1;a=-1;m=-1;h=-1;e:{if(K[780096]){break e}a=jg(l,b,c,e,-1,-1);if(K[780096]){break e}m=jg(l,b,c,e,1,-1);if(K[780096]){break e}k=jg(l,b,c,e,1,1);if(K[780096]){break e}h=jg(l,b,c,e,-1,1)}if(K[812884]){e=J[(L[390030]<<2)+69200>>2];a=sd(a,e);m=sd(m,e);k=sd(k,e);h=sd(h,e)}q=N[203225];j=N[203226];g=N[203227];l=(u+(t>>>v|0)<<5)+780124|0;e=J[l>>2];r=Q(f*Q(t&w));s=Q(Q(i*f)+r);N[e+20>>2]=s;i=Q(y-1|0);o=Q(Q(o*Q(.9993749856948853))+i);N[e+16>>2]=o;J[e+12>>2]=k;N[e+8>>2]=g;N[e+4>>2]=j;q=Q(q+i);N[e>>2]=q;i=N[203222];N[e+44>>2]=s;N[e+40>>2]=p;J[e+36>>2]=h;N[e+32>>2]=g;N[e+28>>2]=j;N[e+24>>2]=i;j=N[203223];f=Q(Q(Q(f*n)*Q(.9993749856948853))+r);N[e+92>>2]=f;N[e+88>>2]=o;J[e+84>>2]=m;N[e+80>>2]=g;N[e+76>>2]=j;N[e+72>>2]=q;N[e+68>>2]=f;N[e- -64>>2]=p;J[e+60>>2]=a;N[e+56>>2]=g;N[e+52>>2]=j;N[e+48>>2]=i;J[l>>2]=e+96}if(A){t=L[P(L[390030],12)+122200>>1];k=-1;v=J[458159];u=J[203220];n=N[203233];o=N[203230];q=N[203231];p=N[203228];f=N[458160];y=J[458158];e=c-1|0;m=bd[J[266963]](b,e,d)|0;a=-1;l=-1;h=-1;f:{if(K[780096]){break f}a=Wi(m,b,e,d,-1,-1);if(K[780096]){break f}l=Wi(m,b,e,d,1,-1);if(K[780096]){break f}k=Wi(m,b,e,d,1,1);if(K[780096]){break f}h=Wi(m,b,e,d,-1,1)}if(K[812884]){e=J[(L[390030]<<2)+69200>>2];a=sd(a,e);l=sd(l,e);k=sd(k,e);h=sd(h,e)}j=N[203222];g=N[203223];i=N[203227];m=(u+(t>>>v|0)<<5)+780128|0;e=J[m>>2];r=Q(f*Q(t&y));s=Q(Q(Q(f*n)*Q(.9993749856948853))+r);N[e+20>>2]=s;N[e+16>>2]=p;J[e+12>>2]=h;N[e+8>>2]=i;N[e+4>>2]=g;N[e>>2]=j;n=N[203224];f=Q(Q(o*f)+r);N[e+44>>2]=f;N[e+40>>2]=p;J[e+36>>2]=a;N[e+32>>2]=n;N[e+28>>2]=g;N[e+24>>2]=j;p=N[203225];N[e+92>>2]=s;j=Q(A-1|0);o=Q(Q(q*Q(.9993749856948853))+j);N[e+88>>2]=o;J[e+84>>2]=k;N[e+80>>2]=i;N[e+76>>2]=g;N[e+68>>2]=f;N[e- -64>>2]=o;J[e+60>>2]=l;N[e+56>>2]=n;N[e+52>>2]=g;g=Q(p+j);N[e+72>>2]=g;N[e+48>>2]=g;J[m>>2]=e+96}if(!z){break a}l=L[P(L[390030],12)+122202>>1];t=J[458159];v=J[203220];o=N[203233];n=N[203230];q=N[203231];p=N[203228];f=N[458160];u=J[458158];e=c+1|0;m=bd[J[266958]](b,e,d)|0;c=-1;h=-1;a=-1;k=-1;g:{if(K[780096]){break g}h=Bk(m,b,e,d,-1,-1);if(K[780096]){break g}a=Bk(m,b,e,d,1,-1);if(K[780096]){break g}c=Bk(m,b,e,d,1,1);if(K[780096]){break g}k=Bk(m,b,e,d,-1,1)}if(K[812884]){b=J[(L[390030]<<2)+69200>>2];h=sd(h,b);a=sd(a,b);c=sd(c,b);k=sd(k,b)}j=N[203222];g=N[203226];i=N[203224];d=(v+(l>>>t|0)<<5)+780132|0;b=J[d>>2];r=Q(f*Q(l&u));s=Q(Q(n*f)+r);N[b+20>>2]=s;N[b+16>>2]=p;J[b+12>>2]=h;N[b+8>>2]=i;N[b+4>>2]=g;N[b>>2]=j;n=N[203227];f=Q(Q(Q(f*o)*Q(.9993749856948853))+r);N[b+44>>2]=f;N[b+40>>2]=p;J[b+36>>2]=k;N[b+32>>2]=n;N[b+28>>2]=g;N[b+24>>2]=j;p=N[203225];N[b+92>>2]=s;j=Q(z-1|0);o=Q(Q(q*Q(.9993749856948853))+j);N[b+88>>2]=o;J[b+84>>2]=a;N[b+80>>2]=i;N[b+76>>2]=g;N[b+68>>2]=f;N[b- -64>>2]=o;J[b+60>>2]=c;N[b+56>>2]=n;N[b+52>>2]=g;g=Q(p+j);N[b+72>>2]=g;N[b+48>>2]=g;J[d>>2]=b+96}}function fu(a){var b=Q(0),c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=Q(0),s=Q(0),t=Q(0),u=Q(0),v=Q(0);l=$c-720|0;$c=l;k=wf(1,115588);a:{if(!k){d=-857812988;Mk(-857812988,1445);break a}c=l+8|0;Je(c,a);b:{d=Gs(l+664|0,c);c:{if(d){Te(d,11916,c);break c}d=$c-1696|0;$c=d;c=l+608|0;Ks(c);J[c+28>>2]=102;J[c+8>>2]=103;J[c+32>>2]=k;H[k+115576|0]=0;J[k+20>>2]=l+664;J[k+16>>2]=8192;J[k+12>>2]=k+33656;J[k>>2]=0;J[k+4>>2]=0;J[k+8>>2]=16384;je(k+41848|0,0,8192);je(k+50040|0,0,65536);Gh(d,31488,288);j=k+600|0;o=k+24|0;while(1){i=d+(f<<1)|0;e=L[i+1056>>1];d:{if(!e){break d}g=e;e=L[i+1024>>1];n=g-e|0;if((n|0)<=0){break d}g=16-f|0;p=L[i+1088>>1];i=0;while(1){m=L[(d+(i+p<<1)|0)+1120>>1];H[m+j|0]=f;q=o+(m<<1)|0;m=i+e|0;m=m<<8|(m&65280)>>>8;m=m>>>4&3855|(m&3855)<<4;m=m>>>2&13107|(m&13107)<<2;I[q>>1]=(m>>>1&21845|(m&21845)<<1)>>>g;i=i+1|0;if((n|0)!=(i|0)){continue}break}}f=f+1|0;if((f|0)!=16){continue}break}$c=d+1696|0;J[k+115580>>2]=-1;J[k+115584>>2]=0;J[c+28>>2]=104;J[c+8>>2]=105;e:{if(Ii(a,37152)){a=$c-8448|0;$c=a;h=Gd(a,0,8192);Kd(h- -8192|0,49472,78);fe(h+8233|0,L[929614]);fe(h+8244|0,L[929616]);fe(h+8255|0,L[929618]);Gf(h+8266|0,J[464806]);d=h- -8192|0;a=ce(c,d,78);f:{if(a){break f}a=ce(c,J[464804],J[464806]);if(a){break f}Kd(d,49550,11);Gf(d|7,J[464806]);a=ce(c,d,11);if(a){break f}d=0;a=J[464806];if((a|0)>0){while(1){a=a-d|0;a=ce(c,h,a>>>0>=8192?8192:a);if(a){break f}d=d- -8192|0;a=J[464806];if((d|0)<(a|0)){continue}break}}a=ce(c,49568,37)}$c=h+8448|0;break e}if(Ii(a,37160)){i=$c-32784|0;$c=i;c=l+608|0;a=ce(c,33060,9);g:{if(a){break g}a=Ap(c,115,9790,7,33072);if(a){break g}while(1){a=P(h,12);h:{if(K[a+33072|0]==73){a=J[a+33080>>2];d=i+12|0;if(h-6>>>0>=4294967293){b=N[a>>2]}else{b=Q(J[a>>2])}i:{if(Q(R(b))<Q(2147483648)){a=~~b;break i}a=-2147483648}Gf(d,a);a=ce(c,d,4);if(!a){break h}break g}a=Ap(c,117,19119,0,0);if(a){break g}a=i+12|0;Gf(a,J[464806]);a=ce(c,a,4);if(a){break g}f=0;j=J[464806];if((j|0)<=0){break h}j:while(1){o=J[464818];e=J[464805];n=J[464804];a=0;while(1){g=i+16|0;p=g+a|0;d=o&(K[f+n|0]|K[f+e|0]<<8);d=d>>>0>65?1:d;if(d>>>0>=50){d=K[d+33118|0]}H[p|0]=d;if((a|0)==32767){a=ce(c,g,32768);if(a){break g}f=f+1|0;j=J[464806];if((f|0)<(j|0)){continue j}break h}a=a+1|0;f=f+1|0;if((j|0)>(f|0)){continue}break}break}a=ce(c,i+16|0,a);if(a){break g}}h=h+1|0;if((h|0)!=7){continue}break}a=0}$c=i+32784|0;break e}i=l+608|0;c=$c-3104|0;$c=c;h=J[207101];H[c|0]=10;a=Fe(15523);H[c+2|0]=a;H[c+1|0]=0;d=c|3;if((a|0)>0){Qd(d,15523,a);a=(a+c|0)+3|0}else{a=d}a=rh(ef(a,9057,1),19032,16);Kd(a,1859256,16);a=tj(Mf(df(df(df(a+16|0,18025,L[929614]),18019,L[929616]),17989,L[929618]),6780),16845,J[464828]);H[a|0]=0;e=Mf(a+1|0,8697);b=N[h+4>>2];k:{if(b<Q(4294967296)&b>=Q(0)){a=~~b>>>0;break k}a=0}e=df(e,18025,a);b=N[h+8>>2];l:{if(b<Q(4294967296)&b>=Q(0)){a=~~b>>>0;break l}a=0}e=df(e,18019,a);b=N[h+12>>2];m:{if(b<Q(4294967296)&b>=Q(0)){a=~~b>>>0;break m}a=0}e=df(e,17989,a);b=Q(Q(N[h+448>>2]*Q(256))/Q(360));n:{if(b<Q(4294967296)&b>=Q(0)){a=~~b>>>0;break n}a=0}e=ef(e,18786,a);b=Q(Q(N[h+452>>2]*Q(256))/Q(360));o:{if(b<Q(4294967296)&b>=Q(0)){a=~~b>>>0;break o}a=0}a=ef(e,18478,a);H[a|0]=0;a=ce(i,c,rh(a+1|0,1788,J[464806])-c|0);p:{if(a){break p}a=ce(i,J[464804],J[464806]);if(a){break p}if(J[464804]!=J[464805]){a=ce(i,c,rh(c,20612,J[464806])-c|0);if(a){break p}a=ce(i,J[464805],J[464806]);if(a){break p}}H[c|0]=10;a=Fe(17386);H[c+2|0]=a;H[c+1|0]=0;if((a|0)>0){Qd(d,17386,a);d=(a+c|0)+3|0}d=Mf(Mf(d,18918),14897);b=Q(N[h+456>>2]*Q(32));q:{if(b<Q(4294967296)&b>=Q(0)){a=~~b>>>0;break q}a=0}a=df(d,14902,a);H[a|0]=0;a=ef(Mf(a+1|0,13652),13655,K[1859420]);H[a|0]=0;a=qh(qh(qh(qh(qh(qh(Mf(a+1|0,4512),1643,J[464859]),15174,J[464861]),11392,J[464860]),2992,J[464867]),3260,J[464863]),1862,J[464862]);H[a|0]=0;a=Bp(df(ef(ef(Mf(a+1|0,14911),10510,K[1859394]),10500,K[1859392]),9780,L[929698]),18567,53296);H[a|0]=0;a=ph(ph(ef(ph(ph(ph(tj(tj(tj(df(df(Mf(a+1|0,3793),10500,L[929696]),10510,L[929697]),3458,J[464849]),3747,J[464850]),3422,J[464851]),16810,N[464852]),16822,N[464853]),14840,N[464854]),11379,K[1859424]),6936,N[464857]),7686,N[464858]);H[a|0]=0;a=ce(i,c,Mf(a+1|0,4752)-c|0);if(a){break p}d=c+2080|3;h=767;while(1){o=h&65535;if(qi(o)){J[c+2060>>2]=589824;j=h+66896|0;n=K[j+13824|0];f=c+2070|0;J[c+2056>>2]=f;a=c+2056|0;od(a,10535);eg(a,h>>>8&255);e=h&255;eg(a,e);H[c+2080|0]=10;H[c+2079|0]=0;a=Fe(f);H[c+2082|0]=a;H[c+2081|0]=0;if((a|0)>0){a=Qd(d,f,a)+a|0}else{a=d}a=ef(df(ef(a,19086,e),20927,o),13678,K[j+8448|0]);e=(h<<2)+66896|0;a=rh(ph(a,16839,N[e+9984>>2]),5646,12);f=P(h,12)+66896|0;g=L[f+55306>>1];H[a|0]=g;H[a+6|0]=g>>>8;g=L[f+55304>>1];H[a+1|0]=g;H[a+7|0]=g>>>8;g=L[f+55296>>1];H[a+2|0]=g;H[a+8|0]=g>>>8;g=L[f+55298>>1];H[a+3|0]=g;H[a+9|0]=g>>>8;g=L[f+55300>>1];H[a+4|0]=g;H[a+10|0]=g>>>8;g=L[f+55302>>1];H[a+5|0]=g;H[a+11|0]=g>>>8;g=ef(ef(a+12|0,3604,!K[j+768|0]),15265,K[j+14592|0]);j=K[j+1536|0];a=j&15;r:{if(a){a=a|-128;break r}a=0;if(j>>>0<16){break r}a=j>>>4|-64}g=ef(g,3226,a&255);n=(n|0)==5;a=0;s:{if(n){break s}b=Q(N[f+27652>>2]*Q(16));if(b<Q(4294967296)&b>=Q(0)){a=~~b>>>0;break s}a=0}a=rh(ef(ef(g,13743,a),2066,K[((n?17664:13824)+h|0)+66896|0]),11392,4);b=N[e+5376>>2];j=J[e+2304>>2];H[a+1|0]=j;H[a+3|0]=j>>>16;H[a+2|0]=j>>>8;e=b!=Q(0);b=Q(Q(b*Q(128))+Q(-1));t:{if(b<Q(4294967296)&b>=Q(0)){g=~~b>>>0;break t}g=0}H[a|0]=e?g:-1;a=rh(a+4|0,6098,6);r=N[f+18432>>2];s=N[f+18436>>2];t=N[f+18440>>2];u=N[f+27648>>2];v=N[f+27652>>2];b=Q(N[f+27656>>2]*Q(16));u:{if(b<Q(4294967296)&b>=Q(0)){e=~~b>>>0;break u}e=0}H[a+5|0]=e;b=Q(v*Q(16));v:{if(b<Q(4294967296)&b>=Q(0)){e=~~b>>>0;break v}e=0}H[a+4|0]=e;b=Q(u*Q(16));w:{if(b<Q(4294967296)&b>=Q(0)){e=~~b>>>0;break w}e=0}H[a+3|0]=e;b=Q(t*Q(16));x:{if(b<Q(4294967296)&b>=Q(0)){e=~~b>>>0;break x}e=0}H[a+2|0]=e;b=Q(s*Q(16));y:{if(b<Q(4294967296)&b>=Q(0)){e=~~b>>>0;break y}e=0}H[a+1|0]=e;b=Q(r*Q(16));z:{if(b<Q(4294967296)&b>=Q(0)){e=~~b>>>0;break z}e=0}H[a|0]=e;tg(c+2048|0,o);f=J[c+2052>>2];J[c+2056>>2]=J[c+2048>>2];J[c+2060>>2]=f;a=Bp(a+6|0,13988,c+2056|0);H[a|0]=0;a=ce(i,c+2080|0,(a-c|0)-2079|0);if(a){break p}}a=h>>>0>1;h=h-1|0;if(a){continue}break}a=ce(i,33056,4)}$c=c+3104|0}d=a;if(a){bd[J[l+692>>2]](l+664|0)|0;Te(a,12323,l+8|0);break c}d=bd[J[l+636>>2]](l+608|0)|0;a=bd[J[l+692>>2]](l+664|0)|0;if(d){Te(d,11925,l+8|0);break c}if(!a){break b}Te(a,11925,l+8|0);d=a}qd(k);break a}qd(k);O[232410]=O[131740];gh();d=0}$c=l+720|0;return d}function Fh(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,I=0,L=0,N=0,O=0,Q=0;f=$c-46736|0;$c=f;J[a+8>>2]=0;J[a>>2]=0;J[a+4>>2]=0;c=f+46656|0;d=Sd(b,c,8);a:{if(d){break a}if(!ir(c,3e4,8)){d=-857812961;break a}while(1){J[(f+45632|0)+(e<<2)>>2]=-16777216;e=e+1|0;if((e|0)!=256){continue}break}yg(f- -64|0,f+120|0,b);C=f+46656|4;w=-16777216;j=255;while(1){e=f+46656|0;d=Sd(b,e,8);if(d){break a}c=ud(e);b:{c:{d:{e:{f:{g:{h:{i:{j:{e=ud(C);if((e|0)<=1347179588){if((e|0)==1229209940){break e}if((e|0)==1229472850){break j}if((e|0)!=1229278788){break d}d=-857812950;break a}if((e|0)==1347179589){break i}if((e|0)!=1951551059){break d}d=-857812951;switch(j|0){case 3:break g;case 0:break h;case 2:break f;default:break a}}if((c|0)!=13){d=-857812960;break a}e=f+46656|0;d=Sd(b,e,13);if(d){break a}O=a,Q=ud(e),J[O+4>>2]=Q;e=ud(C);J[a+8>>2]=e;c=J[a+4>>2];if(c>>>0>32768){d=-857812959;break a}if(e>>>0>32768){d=-857812958;break a}k=K[f+46664|0];if((k|0)==16){d=-857812879;break a}d=-857812957;k:{l:{m:{n:{o:{p:{q:{j=K[f+46665|0];switch(j|0){case 6:break l;case 4:break m;case 3:break o;case 2:break p;case 0:break q;default:break a}}g=k-1|0;i=g&255;if(i>>>0>=8|!(139>>>i&1)){break a}d=(g<<24>>24<<2)+30016|0;break n}q=15;if((k|0)==8){break k}break a}g=k-1|0;i=g&255;if(i>>>0>=8|!(139>>>i&1)){break a}d=(g<<24>>24<<2)+30048|0}q=J[d>>2];break k}q=16;if((k|0)==8){break k}break a}q=17;if((k|0)!=8){break a}}if(K[f+46666|0]){d=-857812956;break a}if(K[f+46667|0]){d=-857812955;break a}if(K[f+46668|0]){d=-857812954;break a}d=e;e=P(K[j+30008|0],k);i=P(e,c)+7>>>3|0;n=i+1|0;c=c<<2;s=wf(d,c>>>0<n>>>0?n:c);J[a>>2]=s;if(!s){d=-857812988;break a}D=P(J[a+8>>2],n);z=e+7>>>3|0;break c}d=-857812953;if((c>>>0)%3|c>>>0>768){break a}d=Sd(b,f+44864|0,c);if(d){break a}e=0;if(!c){break c}while(1){g=(f+45632|0)+((e>>>0)/3<<2)|0;d=(f+44864|0)+e|0;J[g>>2]=K[d+2|0]<<16|(K[d|0]|K[g+3|0]<<24|K[d+1|0]<<8);e=e+3|0;if(c>>>0>e>>>0){continue}break}break c}if((c|0)!=2){break b}d=Sd(b,f+44864|0,2);if(d){break a}j=0;e=K[f+44865|0];w=Cq(k,e,e,e);break c}if(c>>>0>256){break b}d=Sd(b,f+44864|0,c);if(d){break a}e=0;j=3;if(!c){break c}while(1){H[((f+45632|0)+(e<<2)|0)+3|0]=K[(f+44864|0)+e|0];e=e+1|0;if((c|0)!=(e|0)){continue}break}break c}if((c|0)!=6){break b}d=Sd(b,f+44864|0,6);if(d){break a}j=2;w=Cq(k,K[f+44865|0],K[f+44867|0],K[f+44869|0]);break c}e=f+8|0;Xm(e,b,c);J[f+148>>2]=e;r:{if((E|0)==2){break r}s:{while(1){t:{switch(E|0){case 1:break s;case 0:break t;default:continue}}break}d=bd[J[f+12>>2]](f+8|0,f+46735|0)|0;if(d){break a}if((K[f+46735|0]&15)==8){break s}d=-857812935;break a}d=bd[J[f+12>>2]](f+8|0,f+46735|0)|0;if(d){break a}if(!(K[f+46735|0]&32)){break r}d=-857812934;break a}if(!J[a>>2]){d=-857812949;break a}E=2;if(M[a+8>>2]<=o>>>0){break c}d=bd[J[f+64>>2]](f- -64|0,s+x|0,D-x|0,f+44860|0)|0;if(d){break a}A=J[f+44860>>2];if(!A){break c}F=s+1|0;t=t+A|0;u:{if(t>>>0<n>>>0){break u}e=z&255;r=i-e|0;while(1){if(M[a+8>>2]<=o>>>0){break u}y=P(n,o)+s|0;c=K[y|0];if(c>>>0>4){d=-857812948;break a}v:{w:{if(!o){g=y+1|0;x:{y:{switch(c-1|0){case 0:d=0;c=e;if(i>>>0<=c>>>0){break x}while(1){h=c+g|0;H[h|0]=K[h|0]+K[d+g|0];c=c+1|0;d=d+1|0;if((r|0)!=(d|0)){continue}break};break x;case 2:d=0;c=e;if(i>>>0<=c>>>0){break x}while(1){h=c+g|0;H[h|0]=K[h|0]+(K[d+g|0]>>>1|0);c=c+1|0;d=d+1|0;if((r|0)!=(d|0)){continue}break};break x;case 3:break y;default:break x}}d=0;c=e;if(i>>>0<=c>>>0){break x}while(1){h=c+g|0;H[h|0]=K[h|0]+K[d+g|0];c=c+1|0;d=d+1|0;if((r|0)!=(d|0)){continue}break}}if((j|0)==6){break w}break v}g=y+1|0;G=o-1|0;h=P(G,n)+F|0;z:{A:{switch(c-1|0){case 0:c=0;d=e;if(e>>>0>=i>>>0){break z}while(1){l=d+g|0;H[l|0]=K[l|0]+K[c+g|0];d=d+1|0;c=c+1|0;if((r|0)!=(c|0)){continue}break};break z;case 1:c=0;if(!i){break z}while(1){d=c+g|0;H[d|0]=K[d|0]+K[c+h|0];c=c+1|0;if((i|0)!=(c|0)){continue}break};break z;case 2:c=0;if(z&255){while(1){d=c+g|0;H[d|0]=K[d|0]+(K[c+h|0]>>>1|0);c=c+1|0;if((e|0)!=(c|0)){continue}break}}d=0;c=e;if(i>>>0<=c>>>0){break z}while(1){l=c+g|0;H[l|0]=K[l|0]+(K[d+g|0]+K[c+h|0]>>>1|0);c=c+1|0;d=d+1|0;if((r|0)!=(d|0)){continue}break};break z;case 3:break A;default:break z}}c=0;if(z&255){while(1){d=c+g|0;H[d|0]=K[d|0]+K[c+h|0];c=c+1|0;if((e|0)!=(c|0)){continue}break}}c=0;d=e;if(e>>>0>=i>>>0){break z}while(1){l=K[d+h|0];p=K[c+g|0];B=K[c+h|0];m=(l+p|0)-B|0;I=m-B|0;u=I>>31;L=m-p|0;N=L>>31;v=m-l|0;m=v>>31;v=(m^v)-m|0;m=(N^L)-N|0;u=(u^I)-u|0;B:{if(!(v>>>0<m>>>0|m>>>0>u>>>0)){l=d+g|0;H[l|0]=p+K[l|0];break B}p=d+g|0;m=K[p|0];if(u>>>0>=v>>>0){H[p|0]=m+l;break B}H[p|0]=m+B}d=d+1|0;c=c+1|0;if((r|0)!=(c|0)){continue}break}}if((j|0)!=6){break v}c=J[a+4>>2];bd[q|0](c,f+45632|0,h,J[a>>2]+(P(c,G)<<2)|0)}if((J[a+8>>2]-1|0)!=(o|0)){break v}c=J[a+4>>2];bd[q|0](c,f+45632|0,y+1|0,J[a>>2]+(P(c,o)<<2)|0)}o=o+1|0;t=t-n|0;if(t>>>0>=n>>>0){continue}break}}x=x+A|0;if((D|0)!=(x|0)){break c}C:{if((j|0)==6){break C}e=J[a+8>>2];if((e|0)<=0){break C}while(1){c=J[a+4>>2];b=e-1|0;bd[q|0](c,f+45632|0,P(b,n)+F|0,J[a>>2]+(P(b,c)<<2)|0);c=e>>>0>1;e=b;if(c){continue}break}}d=0;if(w>>>0>16777215){break a}b=0;j=J[a+8>>2];if((j|0)>0){c=w&16777215;i=J[a>>2];k=J[a+4>>2];n=(k|0)<=0;while(1){if(!n){o=i+(P(J[a+4>>2],b)<<2)|0;e=0;while(1){h=o+(e<<2)|0;g=J[h>>2];J[h>>2]=(c|0)==(g&16777215)?c:g;e=e+1|0;if((k|0)!=(e|0)){continue}break}}b=b+1|0;if((j|0)!=(b|0)){continue}break}}break a}d=bd[J[b+12>>2]](b,c)|0;if(d){break a}}d=bd[J[b+12>>2]](b,4)|0;if(!d){continue}break a}break}d=-857812952}$c=f+46736|0;return d}function ti(a,b,c,d){var e=0,f=0,g=Q(0),h=0,i=0,j=Q(0),k=Q(0),l=0,m=0,n=Q(0),o=0,p=0,q=0,r=0,s=0,t=Q(0),u=0,v=Q(0),w=Q(0),x=0,y=0,z=0,A=0;o=J[a+8>>2];g=Q(N[o+40>>2]*d);N[o+40>>2]=g;if(!K[J[a+24>>2]+34|0]){l=J[a+28>>2];a=0;e=$c-128|0;$c=e;i=J[l>>2];a:{if(!(N[i+36>>2]!=Q(0)|N[i+40>>2]!=Q(0))&N[i+44>>2]==Q(0)){break a}f=$c-80|0;$c=f;J[f+72>>2]=J[i+44>>2];h=J[i+40>>2];J[f+64>>2]=J[i+36>>2];J[f+68>>2]=h;r=e+28|0;Lg(i,r);s=e+4|0;g=N[f+64>>2];N[s>>2]=N[r>>2]+(g<Q(0)?g:Q(0));j=N[f+68>>2];N[s+4>>2]=N[r+4>>2]+(j<Q(0)?j:Q(0));k=N[f+72>>2];N[s+8>>2]=N[r+8>>2]+(k<Q(0)?k:Q(0));N[s+12>>2]=(g>Q(0)?g:Q(0))+N[r+12>>2];N[s+16>>2]=(j>Q(0)?j:Q(0))+N[r+16>>2];N[s+20>>2]=(k>Q(0)?k:Q(0))+N[r+20>>2];Ae(f+52|0,s);Ae(f+40|0,s+12|0);h=J[13195];i=J[f+44>>2];q=J[f+56>>2];m=P((J[f+48>>2]-J[f+60>>2]|0)+1|0,P((i-q|0)+1|0,(J[f+40>>2]-J[f+52>>2]|0)+1|0));if(m>>>0>M[13196]){if((h|0)!=1685408){qd(h)}J[13196]=m;J[13195]=1685408;h=Ye(m,16,5511);J[13195]=h;q=J[f+56>>2];i=J[f+44>>2]}b:{if((i|0)<(q|0)){break b}a=J[f+48>>2];while(1){m=J[f+60>>2];if((m|0)<=(a|0)){y=q<<4;g=Q(q|0);p=J[f+40>>2];while(1){i=J[f+52>>2];if((p|0)>=(i|0)){z=m<<3;j=Q(m|0);while(1){a=i;i=um(i,q,m);c:{if(K[i+75344|0]!=2){break c}p=P(i,12)+66896|0;J[f+24>>2]=J[p+18440>>2];u=p+18432|0;A=J[u>>2];u=J[u+4>>2];N[f+24>>2]=N[f+24>>2]+j;J[f+16>>2]=A;J[f+20>>2]=u;k=Q(a|0);N[f+16>>2]=N[f+16>>2]+k;N[f+20>>2]=N[f+20>>2]+g;J[f+36>>2]=J[p+27656>>2];p=p+27648|0;u=J[p+4>>2];J[f+28>>2]=J[p>>2];J[f+32>>2]=u;N[f+28>>2]=N[f+28>>2]+k;N[f+32>>2]=N[f+32>>2]+g;N[f+36>>2]=N[f+36>>2]+j;p=f+16|0;if(!gg(s,p)){break c}yt(f- -64|0,r,p,f+12|0,f+8|0,f+4|0);k=N[f+12>>2];if(k>Q(1)){break c}t=N[f+8>>2];if(t>Q(1)){break c}n=N[f+4>>2];if(n>Q(1)){break c}J[h>>2]=i&7|a<<3;N[h+12>>2]=Q(n*n)+Q(Q(k*k)+Q(t*t));J[h+8>>2]=i>>>7&7|z;J[h+4>>2]=i>>>3&15|y;h=h+16|0}i=a+1|0;p=J[f+40>>2];if((a|0)<(p|0)){continue}break}a=J[f+48>>2]}i=(a|0)>(m|0);m=m+1|0;if(i){continue}break}i=J[f+44>>2]}m=(i|0)>(q|0);q=q+1|0;if(m){continue}break}i=J[13195];a=h-i>>4;if((h|0)==(i|0)){break b}ln(0,a-1|0)}$c=f+80|0;i=J[l>>2];f=K[i+111|0];H[i+111|0]=0;I[l+8>>1]=0;J[l+4>>2]=0;J[e+72>>2]=J[i+100>>2];h=J[i+96>>2];J[e+64>>2]=J[i+92>>2];J[e+68>>2]=h;if((a|0)<=0){break a}s=i+36|0;while(1){h=J[13195]+(x<<4)|0;q=J[h+4>>2];r=J[h>>2];m=J[h+8>>2];h=P(q<<3&120|r&7|m<<7&896,12)+66896|0;g=Q(r>>3);N[e+104>>2]=N[h+18432>>2]+g;j=Q(q>>4);N[e+108>>2]=N[h+18436>>2]+j;k=Q(m>>3);N[e+112>>2]=N[h+18440>>2]+k;N[e+116>>2]=N[h+27648>>2]+g;N[e+120>>2]=N[h+27652>>2]+j;N[e+124>>2]=N[h+27656>>2]+k;h=e+104|0;d:{if(!gg(e+4|0,h)){break d}yt(s,e+28|0,h,e+60|0,e+56|0,e+52|0);g=N[e+60>>2];e:{f:{if(g>Q(1)){break f}j=N[e+56>>2];if(j>Q(1)){break f}k=N[e+52>>2];if(!(k>Q(1))){break e}}Pg(25859);k=N[e+52>>2];j=N[e+56>>2];g=N[e+60>>2]}t=N[i+44>>2];n=N[i+40>>2];v=Q(g*N[i+36>>2]);g=Q(v+N[e+28>>2]);N[e+80>>2]=g;n=Q(j*n);j=Q(n+N[e+32>>2]);N[e+84>>2]=j;w=Q(k*t);k=Q(w+N[e+36>>2]);N[e+88>>2]=k;t=Q(v+N[e+40>>2]);N[e+92>>2]=t;n=Q(n+N[e+44>>2]);N[e+96>>2]=n;v=Q(w+N[e+48>>2]);N[e+100>>2]=v;g:{if(!K[l+5|0]){w=Q(j+Q(.0010000000474974513));j=N[e+120>>2];if(w>=j){h=J[l>>2];H[h+111|0]=1;g=Q(j+Q(.0010000000474974513));N[h+8>>2]=g;J[h+40>>2]=0;N[e+8>>2]=g;N[e+32>>2]=g;g=Q(g+N[e+68>>2]);N[e+44>>2]=g;N[e+20>>2]=g;H[l+8|0]=1;break d}j=Q(n+Q(-.0010000000474974513));n=N[e+108>>2];if(j<=n){j=N[e+68>>2];h=J[l>>2];J[h+40>>2]=0;g=Q(Q(n-j)+Q(-.0010000000474974513));N[h+8>>2]=g;break g}if(N[e+116>>2]<=Q(g+Q(.0010000000474974513))){gq(l,e+104|0,e+28|0,f,e+80|0,e+4|0,e- -64|0);break d}if(N[e+104>>2]>=Q(t+Q(-.0010000000474974513))){fq(l,e+104|0,e+28|0,f,e+80|0,e+4|0,e- -64|0);break d}if(N[e+124>>2]<=Q(k+Q(.0010000000474974513))){eq(l,e+104|0,e+28|0,f,e+80|0,e+4|0,e- -64|0);break d}if(!(N[e+112>>2]>=Q(v+Q(-.0010000000474974513)))){break d}dq(l,e+104|0,e+28|0,f,e+80|0,e+4|0,e- -64|0);break d}if(N[e+116>>2]<=Q(g+Q(.0010000000474974513))){gq(l,e+104|0,e+28|0,f,e+80|0,e+4|0,e- -64|0);break d}if(N[e+104>>2]>=Q(t+Q(-.0010000000474974513))){fq(l,e+104|0,e+28|0,f,e+80|0,e+4|0,e- -64|0);break d}if(N[e+124>>2]<=Q(k+Q(.0010000000474974513))){eq(l,e+104|0,e+28|0,f,e+80|0,e+4|0,e- -64|0);break d}if(N[e+112>>2]>=Q(v+Q(-.0010000000474974513))){dq(l,e+104|0,e+28|0,f,e+80|0,e+4|0,e- -64|0);break d}g=N[e+120>>2];if(g<=Q(j+Q(.0010000000474974513))){h=J[l>>2];H[h+111|0]=1;g=Q(g+Q(.0010000000474974513));N[h+8>>2]=g;J[h+40>>2]=0;N[e+8>>2]=g;N[e+32>>2]=g;g=Q(g+N[e+68>>2]);N[e+44>>2]=g;N[e+20>>2]=g;H[l+8|0]=1;break d}g=N[e+108>>2];if(!(g>=Q(n+Q(-.0010000000474974513)))){break d}j=N[e+68>>2];h=J[l>>2];J[h+40>>2]=0;g=Q(Q(g-j)+Q(-.0010000000474974513));N[h+8>>2]=g}N[e+8>>2]=g;N[e+32>>2]=g;g=Q(j+g);N[e+44>>2]=g;N[e+20>>2]=g;H[l+5|0]=1}x=x+1|0;if((x|0)!=(a|0)){continue}break}}$c=e+128|0;g=N[o+40>>2]}j=N[o+36>>2];N[o+4>>2]=N[o+4>>2]+j;N[o+8>>2]=N[o+8>>2]+g;k=N[o+44>>2];N[o+12>>2]=N[o+12>>2]+k;N[o+36>>2]=j*N[b>>2];j=N[b+4>>2];N[o+44>>2]=k*N[b+8>>2];N[o+40>>2]=Q(j*Q(g/d))-c}function Gp(a,b,c,d,e,f){var g=0,h=0,i=0,j=0,k=0,l=0,m=0;g=$c-32|0;$c=g;k=K[d+68432|0];h=ff(a,b,c,f);j=K[e+68432|0];j=f?j>>>4|0:j&15;a:{if(!(h|j|!K[e+67664|0])&K[e+79952|0]==255){break a}if(h>>>0<j>>>0){H[g+28|0]=j;J[g+24>>2]=c;J[g+20>>2]=b;J[g+16>>2]=a;ze(1053596,g+16|0);El(f,1);break a}d=d+66896|0;i=K[d+13824|0];b:{if(!i|(K[d+768|0]?(i&254)!=2:0)){break b}i=e+66896|0;d=K[i+13824|0];if(!d){break b}e=f?k>>>4|0:k&15;if(!(!K[i+768|0]|(d|0)==2)){if(j|(e|(d|0)!=3)){break b}break a}if(!(e|j)){break a}}qg(0,a,b,c,f,1);H[g+28|0]=h;J[g+24>>2]=c;J[g+20>>2]=b;J[g+16>>2]=a;ze(1053628,g+16|0);if(J[263411]>0){d=0;while(1){a=lt(1053628);b=J[a+8>>2];c=J[a+12>>2];J[g+24>>2]=b;J[g+28>>2]=c;c=J[a+4>>2];a=J[a>>2];J[g+16>>2]=a;J[g+20>>2]=c;l=J[464818];e=J[464805];c=J[g+20>>2];h=P(J[464807],b+P(c,J[464809])|0);j=a+h|0;i=J[464804];j=l&(K[e+j|0]<<8|K[j+i|0]);k=d?j:0;c:{if((a|0)<=0){break c}if(!Ld(k,1)){break c}m=e;e=a-1|0;h=e+h|0;i=(K[m+h|0]<<8|K[h+i|0])&l;if(!Ld(i,0)){break c}h=ff(e,c,b,f);i=K[i+68432|0];i=f?i>>>4|0:i&15;if(i){H[g+12|0]=i;J[g+8>>2]=b;J[g+4>>2]=c;J[g>>2]=e;ze(1053596,g)}if(!h){break c}d:{if(K[g+28|0]>h>>>0){qg(0,e,c,b,f,1);J[g+8>>2]=b;J[g+4>>2]=c;J[g>>2]=e;e=1053628;break d}if(!Ld(j,1)){break c}e=e+P(J[464807],b+P(c,J[464809])|0)|0;if(!Ld(J[464818]&(K[e+J[464805]|0]<<8|K[e+J[464804]|0]),0)){break c}e=J[g+28>>2];J[g+8>>2]=J[g+24>>2];J[g+12>>2]=e;e=J[g+20>>2];J[g>>2]=J[g+16>>2];J[g+4>>2]=e;h=h-1|0;e=1053596}H[g+12|0]=h;ze(e,g)}e:{if((a|0)>=J[464810]){break e}if(!Ld(k,0)){break e}h=a+1|0;e=h+P(J[464807],b+P(c,J[464809])|0)|0;i=J[464818]&(K[e+J[464805]|0]<<8|K[e+J[464804]|0]);if(!Ld(i,1)){break e}e=ff(h,c,b,f);i=K[i+68432|0];i=f?i>>>4|0:i&15;if(i){H[g+12|0]=i;J[g+8>>2]=b;J[g+4>>2]=c;J[g>>2]=h;ze(1053596,g)}if(!e){break e}f:{if(K[g+28|0]>e>>>0){qg(0,h,c,b,f,1);J[g+8>>2]=b;J[g+4>>2]=c;J[g>>2]=h;h=1053628;break f}if(!Ld(j,0)){break e}h=h+P(J[464807],b+P(c,J[464809])|0)|0;if(!Ld(J[464818]&(K[h+J[464805]|0]<<8|K[h+J[464804]|0]),1)){break e}h=J[g+28>>2];J[g+8>>2]=J[g+24>>2];J[g+12>>2]=h;h=J[g+20>>2];J[g>>2]=J[g+16>>2];J[g+4>>2]=h;e=e-1|0;h=1053596}H[g+12|0]=e;ze(h,g)}g:{if((c|0)<=0){break g}if(!Ld(k,5)){break g}h=c-1|0;e=a+P(J[464807],b+P(h,J[464809])|0)|0;i=J[464818]&(K[e+J[464805]|0]<<8|K[e+J[464804]|0]);if(!Ld(i,4)){break g}e=ff(a,h,b,f);i=K[i+68432|0];i=f?i>>>4|0:i&15;if(i){H[g+12|0]=i;J[g+8>>2]=b;J[g+4>>2]=h;J[g>>2]=a;ze(1053596,g)}if(!e){break g}h:{if(K[g+28|0]>e>>>0){qg(0,a,h,b,f,1);J[g+8>>2]=b;J[g+4>>2]=h;J[g>>2]=a;h=1053628;break h}if(!Ld(j,5)){break g}h=a+P(J[464807],b+P(h,J[464809])|0)|0;if(!Ld(J[464818]&(K[h+J[464805]|0]<<8|K[h+J[464804]|0]),4)){break g}h=J[g+28>>2];J[g+8>>2]=J[g+24>>2];J[g+12>>2]=h;h=J[g+20>>2];J[g>>2]=J[g+16>>2];J[g+4>>2]=h;e=e-1|0;h=1053596}H[g+12|0]=e;ze(h,g)}i:{if((c|0)>=J[464811]){break i}if(!Ld(k,4)){break i}h=c+1|0;e=a+P(J[464807],b+P(h,J[464809])|0)|0;i=J[464818]&(K[e+J[464805]|0]<<8|K[e+J[464804]|0]);if(!Ld(i,5)){break i}e=ff(a,h,b,f);i=K[i+68432|0];i=f?i>>>4|0:i&15;if(i){H[g+12|0]=i;J[g+8>>2]=b;J[g+4>>2]=h;J[g>>2]=a;ze(1053596,g)}if(!e){break i}j:{if(K[g+28|0]>e>>>0){qg(0,a,h,b,f,1);J[g+8>>2]=b;J[g+4>>2]=h;J[g>>2]=a;h=1053628;break j}if(!Ld(j,4)){break i}h=a+P(J[464807],b+P(h,J[464809])|0)|0;if(!Ld(J[464818]&(K[h+J[464805]|0]<<8|K[h+J[464804]|0]),5)){break i}h=J[g+28>>2];J[g+8>>2]=J[g+24>>2];J[g+12>>2]=h;h=J[g+20>>2];J[g>>2]=J[g+16>>2];J[g+4>>2]=h;e=e-1|0;h=1053596}H[g+12|0]=e;ze(h,g)}k:{if((b|0)<=0){break k}if(!Ld(k,3)){break k}h=b-1|0;e=a+P(J[464807],h+P(c,J[464809])|0)|0;i=J[464818]&(K[e+J[464805]|0]<<8|K[e+J[464804]|0]);if(!Ld(i,2)){break k}e=ff(a,c,h,f);i=K[i+68432|0];i=f?i>>>4|0:i&15;if(i){H[g+12|0]=i;J[g+8>>2]=h;J[g+4>>2]=c;J[g>>2]=a;ze(1053596,g)}if(!e){break k}l:{if(K[g+28|0]>e>>>0){qg(0,a,c,h,f,1);J[g+8>>2]=h;J[g+4>>2]=c;J[g>>2]=a;h=1053628;break l}if(!Ld(j,3)){break k}h=a+P(J[464807],h+P(c,J[464809])|0)|0;if(!Ld(J[464818]&(K[h+J[464805]|0]<<8|K[h+J[464804]|0]),2)){break k}h=J[g+28>>2];J[g+8>>2]=J[g+24>>2];J[g+12>>2]=h;h=J[g+20>>2];J[g>>2]=J[g+16>>2];J[g+4>>2]=h;e=e-1|0;h=1053596}H[g+12|0]=e;ze(h,g)}m:{if((b|0)>=J[464812]){break m}if(!Ld(k,2)){break m}b=b+1|0;e=a+P(J[464807],b+P(c,J[464809])|0)|0;k=J[464818]&(K[e+J[464805]|0]<<8|K[e+J[464804]|0]);if(!Ld(k,3)){break m}e=ff(a,c,b,f);k=K[k+68432|0];k=f?k>>>4|0:k&15;if(k){H[g+12|0]=k;J[g+8>>2]=b;J[g+4>>2]=c;J[g>>2]=a;ze(1053596,g)}if(!e){break m}n:{if(K[g+28|0]>e>>>0){qg(0,a,c,b,f,1);J[g+8>>2]=b;J[g+4>>2]=c;J[g>>2]=a;a=1053628;break n}if(!Ld(j,2)){break m}a=a+P(J[464807],b+P(c,J[464809])|0)|0;if(!Ld(J[464818]&(K[a+J[464805]|0]<<8|K[a+J[464804]|0]),3)){break m}a=J[g+28>>2];J[g+8>>2]=J[g+24>>2];J[g+12>>2]=a;a=J[g+20>>2];J[g>>2]=J[g+16>>2];J[g+4>>2]=a;e=e-1|0;a=1053596}H[g+12|0]=e;ze(a,g)}d=d+1|0;if(J[263411]>0){continue}break}}El(f,1)}$c=g+32|0}function Wp(a){var b=0,c=0,d=0,e=Q(0),f=Q(0),g=Q(0),h=0,i=0,j=0,k=0,l=0,m=Q(0),n=Q(0),o=0,p=0,q=Q(0),r=0,s=Q(0),t=Q(0),u=0,v=0,w=0,x=Q(0);h=$c-992|0;$c=h;j=J[464855];a:{if(!j){break a}b:{if(J[260066]){break b}d=Ye(P(J[464809],J[464807]),2,8079);J[260066]=d;c=P(J[464809],J[464807]);if((c|0)<=0){break b}while(1){I[d+(b<<1)>>1]=32767;b=b+1|0;if((c|0)!=(b|0)){continue}break}}if(!J[260067]){v=1040268,w=of(1,648),J[v>>2]=w}Ae(h+4|0,813156);c=J[h+8>>2];d=1;c:{if(J[h+4>>2]!=J[260068]){break c}d=1;if((c|0)!=J[260069]){break c}d=J[h+12>>2]!=J[260070]}b=J[h+8>>2];J[260068]=J[h+4>>2];J[260069]=b;J[260070]=J[h+12>>2];a=Q(N[260071]+a);N[260071]=a;b=J[464808];c=c- -64|0;J[h+8>>2]=(b|0)>(c|0)?b:c;p=(j|0)==1?d|a>=Q(.25):0;k=-4;while(1){b=-4;while(1){d=J[h+12>>2]+b|0;d:{e:{c=J[h+4>>2]+k|0;if(c>>>0<M[464807]){i=J[464809];if(i>>>0>d>>>0){break e}}a=Q(J[464849]);break d}l=d+P(c,i)|0;i=I[J[260066]+(l<<1)>>1];if((i|0)==32767){i=Xp(c,J[464811],d,l)}a=Q(0);if((i|0)==-1){break d}l=c+P(J[464807],d+P(J[464809],i)|0)|0;a=Q(N[P(J[464818]&(K[l+J[464805]|0]<<8|K[l+J[464804]|0]),12)+94548>>2]+Q(i|0))}if(!(a>=Q(J[h+8>>2]))){if(p){e=Q(c|0);g=Q(d|0);d=1;while(1){c=J[393492];if((c|0)==600){Ie(1573984,1574028,26356);c=599}J[393492]=c+1;c=P(c,44);v=c+1573984|0,x=Q(Q(Fd(1600384)*Q(.800000011920929))+Q(-.4000000059604645)),N[v>>2]=x;v=c+1573992|0,x=Q(Q(Fd(1600384)*Q(.800000011920929))+Q(-.4000000059604645)),N[v>>2]=x;v=c+1573988|0,x=Q(Fd(1600384)+Q(.4000000059604645)),N[v>>2]=x;i=c+1574e3|0;v=i,x=Q(Fd(1600384)+e),N[v>>2]=x;v=c+1574004|0,x=Q(Q(Q(Fd(1600384)*Q(.10000000149011612))+a)+Q(.009999999776482582)),N[v>>2]=x;l=c+1574008|0;v=l,x=Q(Fd(1600384)+g),N[v>>2]=x;J[c+1573996>>2]=1109393408;u=J[i+4>>2];r=c+1574012|0;J[r>>2]=J[i>>2];J[r+4>>2]=u;J[c+1574020>>2]=J[l>>2];i=c+1574024|0;c=zd(1600384,30);N[i>>2]=((c|0)>27?2:(c|0)>24?4:3)|0;c=d;d=0;if(c){continue}break}}d=(h+16|0)+P(o,12)|0;N[d+8>>2]=a;J[d>>2]=k;J[d+4>>2]=b;o=o+1|0}b=b+1|0;if((b|0)!=5){continue}break}k=k+1|0;if((k|0)!=5){continue}break}de(J[((j|0)==1?1040288:1040292)>>2]);if(p){J[260071]=0}if(!o){break a}be(0);Z(0);ie(1);p=o<<3;b=qe(1,p);if((o|0)>0){d=(j|0)==1;t=d?Q(0):Q(.25);l=J[464863]&16777215;a=Q(Q((d?Q(1):Q(.20000000298023224))*N[464853])*Q(O[131740]));r=(j|0)!=2;k=0;while(1){f=Q(0);i=(h+16|0)+P(k,12)|0;c=J[i+4>>2];j=J[i>>2];e=Q(P(c,c)+P(j,j)|0);e=Q(Q(Q(Q(Q(e*Q(.05000000074505806))*e)+Q(e*Q(-7)))*N[464854])+Q(178));e=e<Q(0)?Q(0):e;e=e>Q(255)?Q(255):e;f:{if(e<Q(4294967296)&e>=Q(0)){d=~~e>>>0;break f}d=0}c=c+J[h+12>>2]|0;j=j+J[h+4>>2]|0;g=N[i+8>>2];n=Q(Q(J[h+8>>2])-g);m=Q(0);e=a;if(!r){xj(1040296,j+P(c,1217)&2147483647);e=Q(Q(N[464853]*Q(O[131740]))*Q(.5));f=Fd(1040296);m=Q(e*Q(Q(f+f)+Q(-1)));f=e;e=Fd(1040296);f=Q(f*Q(Q(e+e)+Q(-1)));e=Q(a*Q(Q(Fd(1040296)*Q(.75))+Q(.25)))}N[b+16>>2]=m;d=l|d<<24;J[b+12>>2]=d;N[b+4>>2]=g;N[b+184>>2]=f;J[b+180>>2]=d;N[b+172>>2]=g;s=Q(j|0);N[b+168>>2]=s;N[b+160>>2]=f;J[b+156>>2]=d;n=Q(g+n);N[b+148>>2]=n;N[b+144>>2]=s;q=Q(f+Q(1));N[b+136>>2]=q;J[b+132>>2]=d;f=Q(c|0);N[b+128>>2]=f;N[b+124>>2]=n;N[b+112>>2]=q;J[b+108>>2]=d;N[b+104>>2]=f;N[b+100>>2]=g;q=Q(m+Q(1));N[b+88>>2]=q;J[b+84>>2]=d;N[b+76>>2]=g;N[b- -64>>2]=q;J[b+60>>2]=d;N[b+52>>2]=n;N[b+40>>2]=m;J[b+36>>2]=d;N[b+32>>2]=f;N[b+28>>2]=n;N[b+24>>2]=s;N[b+8>>2]=f;N[b>>2]=s;f=Q(c+1|0);N[b+176>>2]=f;N[b+152>>2]=f;m=Q(j+1|0);N[b+120>>2]=m;N[b+96>>2]=m;N[b+80>>2]=f;N[b+72>>2]=m;N[b+56>>2]=f;N[b+48>>2]=m;f=Q(g/Q(6));g=Q(Q(Q(Q(c&1)*Q(.5))+e)+Q(Q(j&15)*Q(-.0625)));e=Q(f+g);N[b+188>>2]=e;g=Q(Q(n/Q(6))+g);N[b+164>>2]=g;N[b+140>>2]=g;N[b+116>>2]=e;e=Q(t+e);N[b+92>>2]=e;g=Q(t+g);N[b+68>>2]=g;N[b+44>>2]=g;N[b+20>>2]=e;b=b+192|0;k=k+1|0;if((o|0)!=(k|0)){continue}break}}Pd(J[260067]);ae(p);Z(1);be(0)}$c=h+992|0}function RG(a){a=a|0;var b=0,c=0,d=0,e=0,f=Q(0),g=0,h=0,i=Q(0),j=0,k=0,l=Q(0),m=Q(0),n=Q(0);d=$c-160|0;$c=d;a:{if(K[1811801]){break a}if(K[1832516]){b=0-(Db(J[13312],d+152|0)|0)|0;f=Q(N[a+4>>2]+N[458130]);N[458130]=f;if(b){hk(b);break a}if(K[d+152|0]){a=0-(Cb(J[13312])|0)|0;if(a){hk(a);break a}H[1832516]=0;Nd(1052816);yj(1045536,Q(0));J[458128]=1812032;O[229066]=O[131740];a=d+16|0;H[a|0]=0;H[a+1|0]=K[1054210];Qi(a+2|0,49716);Qi(a+66|0,49724);H[a+130|0]=K[1054208]?66:K[1054210]<6;bd[J[452942]](a,131);break a}if(f>Q(15)){Ls();break a}yj(1045536,Q(Q(Q(15)-f)/Q(15)));break a}e=J[13312];b=J[458128];c=16384;J[d+12>>2]=0;b:{c:{while(1){a=Gb(e|0,b|0,c|0)|0;if((a|0)<0){break c}J[d+12>>2]=a+J[d+12>>2];b=a+b|0;c=c-a|0;if(c){continue}break}b=0;break b}b=J[d+12>>2]?0:6;if((a|0)==-6){break b}b=0-a|0}a=b;d:{if(a){b=(a|0)==J[11487];if(b){break d}a=b?0:a;if((a|0)==J[11488]){break d}J[d+148>>2]=a;J[d+156>>2]=8388608;J[d+152>>2]=d+16;a=d+152|0;Tf(a,28734,1811808,1811816,d+148|0);co(a);Gg(41728,41736);break a}j=O[131740];c=J[d+12>>2];if(!c){if(!(O[229066]+30<j)){break d}Gg(41728,41736);break a}a=0;O[229066]=j;b=1812032;c=c+J[458128]|0;e:{if(c>>>0<=1812032){break e}while(1){e=K[b|0];f:{if(!(!K[1687968]|(K[1832536]!=32|(e+1&255)>>>0>1))){Pg(7156);vq(J[207101]);b=b+1|0;break f}g=(e<<1)+1686432|0;if(c>>>0<L[g>>1]+b>>>0){break e}h=J[(e<<2)+1686944>>2];if(!h){H[d+148|0]=e;J[d+156>>2]=4194304;J[d+152>>2]=d+16;a=d+152|0;xe(a,27614,d+148|0,1832536);Gg(41744,a);break a}H[1832536]=e;bd[h|0](b+1|0);b=L[g>>1]+b|0}if(c>>>0>b>>>0){continue}break}}c=c-b|0;if((c|0)>0){while(1){H[a+1812032|0]=K[a+b|0];a=a+1|0;if((c|0)!=(a|0)){continue}break}}J[458128]=c+1812032}if(J[458135]){vf(15136,1832540);Gg(41728,41736);break a}a=J[453004];J[453004]=a+1;if((a|0)%3|0){break a}qs();a=$c-800|0;$c=a;b=a;if(K[1687969]){b=J[207101];f=(x(2,K[b+392|0]|K[b+393|0]<<8|(K[b+394|0]<<16|K[b+395|0]<<24)),D());i=(x(2,K[b+388|0]|K[b+389|0]<<8|(K[b+390|0]<<16|K[b+391|0]<<24)),D());l=(x(2,K[b+384|0]|K[b+385|0]<<8|(K[b+386|0]<<16|K[b+387|0]<<24)),D());m=N[b+16>>2];n=N[b+20>>2];H[a|0]=8;if(K[52833]){b=L[(J[266937]+J[266938]<<1)+1066048>>1]}else{b=255}g:{if(K[52793]){fe(a|1,b&65535);b=a|3;break g}H[a+1|0]=b;b=a|2}i=Q(i*Q(32));h:{if(Q(R(i))<Q(2147483648)){g=~~i;break h}g=-2147483648}f=Q(f*Q(32));i:{if(Q(R(f))<Q(2147483648)){c=~~f;break i}c=-2147483648}f=Q(l*Q(32));j:{if(Q(R(f))<Q(2147483648)){e=~~f;break j}e=-2147483648}g=g+51|0;k:{if(K[52841]){Gf(b,e);Gf(b+4|0,g);Gf(b+8|0,c);c=12;break k}fe(b,e&65535);fe(b+2|0,g&65535);fe(b+4|0,c&65535);c=6}b=c+b|0;f=Q(Q(m*Q(256))/Q(360));l:{if(f<Q(4294967296)&f>=Q(0)){c=~~f>>>0;break l}c=0}H[b+1|0]=c;f=Q(Q(n*Q(256))/Q(360));m:{if(f<Q(4294967296)&f>=Q(0)){c=~~f>>>0;break m}c=0}H[b|0]=c;b=b+2|0}c=J[421993];J[421993]=c+1;if(!(!K[52849]|(c|0)<19)){e=J[452810];g=(e+1>>>0)%10|0;c=P(g,24);e=L[P(e,24)+1811264>>1]+1|0;I[c+1811264>>1]=e;h=se();k=c+1811256|0;J[k>>2]=0;J[k+4>>2]=0;c=c+1811248|0;J[c>>2]=h;J[c+4>>2]=ad;J[452810]=g;H[b|0]=43;H[b+1|0]=0;fe(b+2|0,e&65535);J[421993]=0;b=b+4|0}if(Mj(J[421994],a+264|0)){n:{if(!K[a+569|0]){break n}J[a+796>>2]=8388608;J[a+792>>2]=a+656;c=a+600|0;fk(c,J[a+420>>2],J[a+424>>2]);if(ek(c,a+792|0)){break n}while(1){Jj(J[a+792>>2],L[a+796>>1]);c=a+592|0;e=a+584|0;o:{if(!kf(a+792|0,61,c,e)){break o}if(ld(c,15156)){pm(kn(e,-1));break o}if(ld(a+592|0,1627)){rm(kn(a+584|0,-13159));break o}if(ld(a+592|0,11348)){qm(kn(a+584|0,-1));break o}if(ld(a+592|0,9703)){if(!De(a+584|0,a+580|0)){break o}Pj(J[a+580>>2]);break o}if(!ld(a+592|0,9671)|K[52857]){break o}ne(a+584|0,2)}if(!ek(a+600|0,a+792|0)){continue}break}}Oj(a+264|0)}if((a|0)!=(b|0)){bd[J[452942]](a,b-a|0)}$c=a+800|0}$c=d+160|0;return 1}function mD(){var a=0,b=0,c=0,d=0,e=0,f=Q(0),g=0,h=0;a=pc(-100,2285,0)|0;if((a|0)==-31){a=oc(2285)|0}_l(a);a=J[11496];if(Rq(2074,a)){b=J[11495];Rq(17561,b);Oq(a);Oq(b);wg(19502);qf(a)}wg(3015);qf(a);J[12861]=193;wg(3066);qf(a);zb();yb();xb();wg(1414);qf(a);wg(3031);qf(a);H[1869198]=1;wg(3050);qf(a);b=ya()|0;e=+ca()*+(b|0);a:{if(R(e)<2147483648){b=~~e;break a}b=-2147483648}J[467297]=b;b=xa()|0;e=+ca();J[467292]=24;H[1056337]=1;e=e*+(b|0);b:{if(R(e)<2147483648){b=~~e;break b}b=-2147483648}J[467298]=b;f=Q(+ca());N[467294]=f;N[467293]=f;qb();b=0;c=pb()|0;d=ob()|0;c=(c|d)!=0;H[1055388]=c;while(1){H[(P(b,24)+1055392|0)+4|0]=0;b=b+1|0;if((b|0)!=32){continue}break}J[264040]=!c;H[1054793]=c;H[1869222]=d?2:1;if(K[1055388]){nb()}wg(16880);qf(a);J[392200]=11;J[392201]=2047;g=1573960,h=Zj(1563656,2139,61,0),J[g>>2]=h;g=1573960,h=Zj(1563656,2159,61,0),J[g>>2]=h;wg(13784);qf(a);ia();rb(1156,0,0);d=$c-80|0;$c=d;Le(11204,0,J[467297],0);Le(3337,0,J[467298],0);J[d+76>>2]=4194304;J[d+72>>2]=d;b=d+72|0;xe(b,27168,3726,49716);J[467307]=986500301;J[467308]=990414985;I[934610]=257;lb(2,0,0,1157,2)|0;kb(6208,0,0,1158,2)|0;jb(6208,0,0,1158,2)|0;ib(6208,0,0,1159,2)|0;Xc(6208,0,0,1160,2)|0;hb(2,0,0,1161,2)|0;gb(2,0,0,1161,2)|0;fb(2,0,0,1162,2)|0;eb(0,1163,1)|0;db(0,0,1164,2)|0;cb(2,0,0,1165,2)|0;bb(2,0,0,1166,2)|0;ab(2,0,0,1167,2)|0;$a(2,0,0,1168,2)|0;_a(2,0,0,1169,2)|0;Za(2,0,0,1170,2)|0;Ya(2,0,0,1170,2)|0;g=1869212,h=Wa()|0,J[g>>2]=h;g=1869216,h=Va()|0,J[g>>2]=h;Vc();a=$c-608|0;$c=a;Rf(a,b);Uc(a|0);$c=a+608|0;J[263483]=0;H[1054053]=1;a=J[467303];J[263478]=(a|0)<=1?1:a;a=J[467304];J[263479]=(a|0)<=1?1:a;hi(pk(3084,0,33456,6));b=$c-32|0;$c=b;c=$c+-64|0;$c=c;a=c+8|0;Fc(a|0);J[c+16>>2]=0;J[c+20>>2]=0;J[c+8>>2]=0;J[c+12>>2]=1;a=Ec(6208,a|0)|0;J[467444]=a;if(!a){Qf(15654,15097);br(1464290336);a=J[467444]}Dc(a|0)|0;Ta(6208,0,0,1172,2)|0;$c=c- -64|0;H[1054442]=3;ba(3379,1054296);H[1054311]=1;H[1054308]=0;J[263575]=J[263574];J[b+28>>2]=0;J[b+24>>2]=0;a=b+16|0;Wd(a,aa(7939)|0);g=b,h=Ji(a,33820),H[g+15|0]=h;g=b,h=Ji(a,33828),H[g+14|0]=h;Ji(a,33836);ba(33307,b+28|0);ba(33308,b+24|0);H[1054473]=J[b+28>>2]>2&J[b+24>>2]>1;Kj(4103,b+15|0,b+14|0);fl();Uq(K[1054480]);$c=b+32|0;J[12861]=194;g=1054197,h=Id(16973,0),H[g|0]=h;g=1054198,h=Id(5320,0),H[g|0]=h;g=1054201,h=Id(16902,0),H[g|0]=h;g=1054202,h=Id(12416,1),H[g|0]=h;c:{d:{e:{if(K[1054197]){H[1054199]=0;break e}g=1054199,h=(Id(5111,1)|0)!=0,H[g|0]=h;if(!K[1054197]){break d}}a=0;H[1053904]=0;H[1054196]=0;break c}a=0;g=1054196,h=(Id(4879,0)|0)!=0,H[g|0]=h;if(K[1054197]){H[1053904]=0;break c}g=1053904,h=(Id(14070,0)|0)!=0,H[g|0]=h;if(K[1054197]){break c}a=(Id(5572,1)|0)!=0}H[1054200]=a;a=Le(2712,8,4096,512);J[12427]=a;J[12426]=a;g=1054052,h=Id(13191,1),H[g|0]=h;ql();ak(4630);nd(1045276,0,195);nd(1045796,0,196);nd(1047876,0,197);nd(1048136,0,198);nd(1049176,0,199);Td(54204);Td(53312);Td(51320);Td(51352);Td(48568);Td(49736);Td(48344);Td(49276);Td(53260);Td(48736);Td(48768);Td(52728);Td(49312);Td(51536);Td(54236);Td(51416);Td(48224);Td(51392);Td(48368);Td(51448);Td(49396);Td(53224);Td(52804);Td(49336);Td(50352);Td(53192);Td(50428);Td(53168);Td(48296);Td(48320);Td(49608);Td(49372);a=J[263472];if(a){while(1){b=J[a>>2];if(b){bd[b|0]()}a=J[a+20>>2];if(a){continue}break}}Vg(1);if(K[1845428]){Qf(14006,22152)}a=$c-16|0;$c=a;b=a+8|0;Wd(b,aa(7937)|0);if((rf(b,13717)|0)>=0){pd(23069);pd(23538);pd(21858)}$c=a+16|0;a=K[1054441];if(a&2){Il(K[1040232]|2);a=K[1054441]}if(a&8){Il(1)}bd[J[452937]]();Nd(1047876);g=1053960,h=se(),J[g>>2]=h;J[263491]=ad;$c=d+80|0}function xt(a,b,c,d,e){var f=Q(0),g=0,h=0,i=0,j=0,k=Q(0),l=0,m=0,n=Q(0),o=Q(0),p=0,q=0,r=0,s=Q(0),t=Q(0),u=0,v=0,w=Q(0),x=0,y=0;l=$c-16|0;$c=l;g=J[b+4>>2];J[a+12>>2]=J[b>>2];J[a+16>>2]=g;J[a+20>>2]=J[b+8>>2];g=J[c+4>>2];J[a+24>>2]=J[c>>2];J[a+28>>2]=g;J[a+32>>2]=J[c+8>>2];f=N[c>>2];N[a+128>>2]=Q(R(f))<Q(9.999999974752427e-7)?Q(1e9):Q(Q(1)/f);f=N[c+4>>2];N[a+132>>2]=Q(R(f))<Q(9.999999974752427e-7)?Q(1e9):Q(Q(1)/f);f=N[c+8>>2];N[a+136>>2]=Q(R(f))<Q(9.999999974752427e-7)?Q(1e9):Q(Q(1)/f);Ae(a,b);x=a,y=sg(N[c>>2]),J[x+64>>2]=y;x=a,y=sg(N[c+4>>2]),J[x+68>>2]=y;g=sg(N[c+8>>2]);J[a+72>>2]=g;i=J[a+64>>2];f=N[c>>2];N[a+76>>2]=Q(R(f))<Q(9.999999974752427e-7)?Q(1e9):Q(Q(Q(J[a>>2]+((i|0)>0)|0)-N[b>>2])/f);j=J[a+68>>2];f=N[c+4>>2];N[a+80>>2]=Q(R(f))<Q(9.999999974752427e-7)?Q(1e9):Q(Q(Q(J[a+4>>2]+((j|0)>0)|0)-N[b+4>>2])/f);f=N[c+8>>2];k=N[b+8>>2];N[a+88>>2]=N[a+128>>2]*Q(i|0);N[a+84>>2]=Q(R(f))<Q(9.999999974752427e-7)?Q(1e9):Q(Q(Q(J[a+8>>2]+((g|0)>0)|0)-k)/f);N[a+92>>2]=N[a+132>>2]*Q(j|0);N[a+96>>2]=N[a+136>>2]*Q(g|0);c=0;f=N[b>>2];a:{if(f!=f){break a}f=N[b+4>>2];if(f!=f){break a}f=N[b+8>>2];if(f!=f){break a}Ae(l+4|0,b);v=M[464807]>M[l+4>>2]&M[464809]>M[l+12>>2]&J[l+8>>2]>=0;w=Q(d*d);while(1){i=J[a+8>>2];d=Q(i|0);g=J[a+4>>2];f=Q(g|0);j=J[a>>2];k=Q(j|0);b:{if(v){c:{d:{h=J[464807];if(h>>>0<=j>>>0){break d}m=J[464809];if(m>>>0<=i>>>0){break d}c=0;if((g|0)>=J[464808]){break b}c=0;if((g|0)<0){break c}c=j+P(h,i+P(g,m)|0)|0;c=J[464818]&(K[c+J[464805]|0]<<8|K[c+J[464804]|0]);break b}c=J[464850]+J[464849]|0}c=L[929697]?(c|0)>(g|0)?7:0:0;break b}h=L[929697];m=J[464807];q=J[464809];e:{if(!(m>>>0<=j>>>0|i>>>0>=q>>>0)){c=0;if((g|0)>=J[464808]){break b}c=7;p=J[l+8>>2];if(!(!h|(g|0)!=-1)&(p|0)>0|!(g|!h)&(p|0)<0){break b}r=(g|0)<0;f:{if(!(r|!h)){h=J[464850]+J[464849]|0;if((h|0)<=(g|0)|(h|0)<=(p|0)){break f}h=J[l+4>>2];if(!j&(h|0)<0){break b}p=J[l+12>>2];if(!i&(p|0)<0|(j|0)==J[464810]&(h|0)>=0){break b}if((i|0)!=J[464812]|(p|0)<0){break f}break b}if(r){break e}}c=j+P(m,i+P(g,q)|0)|0;c=J[464818]&(K[c+J[464805]|0]<<8|K[c+J[464804]|0]);break b}if(!h|(g|0)<0|(g|0)>=(J[464850]+J[464849]|0)){break e}c=7;h=(i|0)<(q|0);g=J[l+4>>2];if(h&!((j|0)!=-1|(g|i)<0)|!(h?(j|0)!=(m|0)|(i|0)<0|(g|0)>=0:1)){break b}g=(j|0)>=(m|0);h=J[l+12>>2];if(!(g|(i|0)!=-1)&(h|j)>=0){break b}if(g|(j|0)<0|(i|0)!=(q|0)){break e}if((h|0)<0){break b}}c=0}I[a+60>>1]=c;c=P(c,12)+66896|0;n=Q(N[c+36864>>2]+k);N[a+36>>2]=n;s=Q(N[c+36868>>2]+f);N[a+40>>2]=s;o=Q(N[c+36872>>2]+d);N[a+44>>2]=o;k=Q(N[c+46080>>2]+k);N[a+48>>2]=k;f=Q(N[c+46084>>2]+f);N[a+52>>2]=f;d=Q(N[c+46088>>2]+d);N[a+56>>2]=d;t=N[b+8>>2];o=Q(R(Q(t-o)));d=Q(R(Q(t-d)));d=d>o?o:d;o=Q(d*d);d=N[b>>2];n=Q(R(Q(d-n)));d=Q(R(Q(d-k)));d=d>n?n:d;n=Q(d*d);d=N[b+4>>2];k=Q(R(Q(d-s)));d=Q(R(Q(d-f)));d=d>k?k:d;if(Q(o+Q(n+Q(d*d)))>w){c=0;break a}if(bd[e|0](a)|0){c=1;break a}d=N[a+76>>2];c=a+80|0;f=N[c>>2];k=N[a+84>>2];g:{if(!(!(d<f)|!(k>d))){c=a+76|0;J[a>>2]=J[a>>2]+J[a+64>>2];g=a+88|0;break g}if(f<k){J[a+4>>2]=J[a+4>>2]+J[a+68>>2];d=f;g=a+92|0;break g}J[a+8>>2]=J[a+8>>2]+J[a+72>>2];c=a+84|0;d=k;g=a+96|0}N[c>>2]=d+N[g>>2];u=u+1|0;if((u|0)!=25e3){continue}break}c=0;Yd(27862)}$c=l+16|0;return c}function SL(a){a=a|0;var b=0,c=Q(0),d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=Q(0);f=J[273222];yf(a);N[273217]=N[a+120>>2]/Q(L[f+184>>1]);N[273218]=N[a+124>>2]/Q(L[f+186>>1]);af(P(K[f+188|0],24));if(K[f+188|0]){while(1){h=P(o,104)+f|0;g=h+192|0;d=0;if(K[h+292|0]){while(1){i=d<<2;b=i+1092844|0;J[i+1531232>>2]=J[b>>2];J[b>>2]=-1;d=d+1|0;if((d|0)!=6){continue}break}}H[1092884]=3;r=g+4|0;s=g+8|0;t=g+12|0;l=Q(N[h+216>>2]*Q(.01745329238474369));m=Q(N[h+212>>2]*Q(.01745329238474369));n=Q(N[h+208>>2]*Q(.01745329238474369));j=0;i=0;p=0;while(1){b=h+j|0;d=K[b+284|0];a:{if(!d){break a}q=K[b+288|0];b=(j<<4)+h|0;c=Q(0);b:{c:{switch(d-1|0){case 0:c=Q(N[a+16>>2]*Q(-.01745329238474369));break b;case 1:c=N[a+164>>2];break b;case 2:c=N[a+172>>2];break b;case 3:H[1092884]=1;c=N[a+180>>2];break b;case 4:H[1092884]=1;c=N[a+184>>2];break b;case 5:H[1092884]=1;c=N[a+188>>2];break b;case 6:H[1092884]=1;c=N[a+192>>2];break b;case 7:c=Q(Q(Q(O[131740])*N[b+220>>2])+N[b+224>>2]);break b;case 8:c=Q(Q(N[a+132>>2]*N[b+220>>2])+N[b+224>>2]);break b;case 9:case 11:case 13:c=Q(Q(Jd(Q(Q(Q(O[131740])*N[b+220>>2])+Q(N[b+228>>2]*Q(6.2831854820251465))))+N[b+232>>2])*N[b+224>>2]);break b;case 10:case 12:case 14:c=Q(Q(Jd(Q(Q(N[a+132>>2]*N[b+220>>2])+Q(N[b+228>>2]*Q(6.2831854820251465))))+N[b+232>>2])*N[b+224>>2]);break b;case 15:case 17:case 19:c=Q(Q(Q(O[131740])*N[b+220>>2])+N[b+228>>2]);k=N[b+232>>2];e=Bd(Q(c/k));c=Q(N[b+224>>2]*Q(c-Q(k*Q(e|0))));break b;case 16:case 18:case 20:break c;default:break b}}c=Q(Q(N[a+132>>2]*N[b+220>>2])+N[b+228>>2]);k=N[b+232>>2];e=Bd(Q(c/k));c=Q(N[b+224>>2]*Q(c-Q(k*Q(e|0))))}b=1;d:{if(i){break d}b=0;if(!(1<<d&3993600)|d>>>0>21){break d}Kd(1531264,J[f+4>>2]+(L[g>>1]<<4)|0,384);b=1}i=b;e:{f:{g:{h:{i:{j:{if(d>>>0>21){break j}b=1<<d;if(b&798720){break i}if(b&3194880){break h}if((d|0)!=1){break j}p=1}switch(q|0){case 2:break e;case 1:break f;case 0:break g;default:break a}}e=L[g>>1];u=J[f+4>>2];d=0;while(1){b=(d<<4)+u|0;k:{l:{m:{switch(q|0){case 0:b=b+(e<<4)|0;break l;case 1:b=(b+(e<<4)|0)+4|0;break l;case 2:break m;default:break k}}b=(b+(e<<4)|0)+8|0}N[b>>2]=c+N[b>>2]}d=d+1|0;if((d|0)!=24){continue}break}break a}d=0;while(1){b=J[f+4>>2]+(d<<4)|0;e=L[g>>1];n:{o:{p:{switch(q|0){case 0:e=b+(e<<4)|0;b=r;break o;case 1:e=(b+(e<<4)|0)+4|0;b=s;break o;case 2:break p;default:break n}}e=(b+(e<<4)|0)+8|0;b=t}v=e,w=Nf(N[b>>2],N[e>>2],c),N[v>>2]=w}d=d+1|0;if((d|0)!=24){continue}break}break a}n=Q(n+c);break a}m=Q(m+c);break a}l=Q(l+c)}j=j+1|0;if((j|0)!=4){continue}break}q:{if(n!=Q(0)|m!=Q(0)|l!=Q(0)|p){yd(n,m,l,g,p);break q}If(g)}if(i){Kd(J[f+4>>2]+(L[g>>1]<<4)|0,1531264,384)}if(K[h+292|0]){b=J[382813];J[273215]=J[382812];J[273216]=b;b=J[382811];J[273213]=J[382810];J[273214]=b;b=J[382809];J[273211]=J[382808];J[273212]=b}o=o+1|0;if(o>>>0<K[f+188|0]){continue}break}}Pd(J[273228]);J[273224]=J[273229];ae(P(K[f+188|0],24));H[1092884]=0}function Fj(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;a:{if(!a){break a}d=a-8|0;b=J[a-4>>2];a=b&-8;f=d+a|0;b:{if(b&1){break b}if(!(b&3)){break a}b=J[d>>2];d=d-b|0;if(d>>>0<M[467759]){break a}a=a+b|0;c:{d:{if(J[467760]!=(d|0)){if(b>>>0<=255){e=b>>>3|0;b=J[d+12>>2];c=J[d+8>>2];if((b|0)==(c|0)){i=1871020,j=J[467755]&HN(e),J[i>>2]=j;break b}J[c+12>>2]=b;J[b+8>>2]=c;break b}h=J[d+24>>2];b=J[d+12>>2];if((d|0)!=(b|0)){c=J[d+8>>2];J[c+12>>2]=b;J[b+8>>2]=c;break c}e=d+20|0;c=J[e>>2];if(!c){c=J[d+16>>2];if(!c){break d}e=d+16|0}while(1){g=e;b=c;e=b+20|0;c=J[e>>2];if(c){continue}e=b+16|0;c=J[b+16>>2];if(c){continue}break}J[g>>2]=0;break c}b=J[f+4>>2];if((b&3)!=3){break b}J[467757]=a;J[f+4>>2]=b&-2;J[d+4>>2]=a|1;J[f>>2]=a;return}b=0}if(!h){break b}c=J[d+28>>2];e=(c<<2)+1871324|0;e:{if(J[e>>2]==(d|0)){J[e>>2]=b;if(b){break e}i=1871024,j=J[467756]&HN(c),J[i>>2]=j;break b}J[h+(J[h+16>>2]==(d|0)?16:20)>>2]=b;if(!b){break b}}J[b+24>>2]=h;c=J[d+16>>2];if(c){J[b+16>>2]=c;J[c+24>>2]=b}c=J[d+20>>2];if(!c){break b}J[b+20>>2]=c;J[c+24>>2]=b}if(d>>>0>=f>>>0){break a}b=J[f+4>>2];if(!(b&1)){break a}f:{g:{h:{i:{if(!(b&2)){if(J[467761]==(f|0)){J[467761]=d;a=J[467758]+a|0;J[467758]=a;J[d+4>>2]=a|1;if(J[467760]!=(d|0)){break a}J[467757]=0;J[467760]=0;return}if(J[467760]==(f|0)){J[467760]=d;a=J[467757]+a|0;J[467757]=a;J[d+4>>2]=a|1;J[a+d>>2]=a;return}a=(b&-8)+a|0;if(b>>>0<=255){e=b>>>3|0;b=J[f+12>>2];c=J[f+8>>2];if((b|0)==(c|0)){i=1871020,j=J[467755]&HN(e),J[i>>2]=j;break g}J[c+12>>2]=b;J[b+8>>2]=c;break g}h=J[f+24>>2];b=J[f+12>>2];if((f|0)!=(b|0)){c=J[f+8>>2];J[c+12>>2]=b;J[b+8>>2]=c;break h}e=f+20|0;c=J[e>>2];if(!c){c=J[f+16>>2];if(!c){break i}e=f+16|0}while(1){g=e;b=c;e=b+20|0;c=J[e>>2];if(c){continue}e=b+16|0;c=J[b+16>>2];if(c){continue}break}J[g>>2]=0;break h}J[f+4>>2]=b&-2;J[d+4>>2]=a|1;J[a+d>>2]=a;break f}b=0}if(!h){break g}c=J[f+28>>2];e=(c<<2)+1871324|0;j:{if(J[e>>2]==(f|0)){J[e>>2]=b;if(b){break j}i=1871024,j=J[467756]&HN(c),J[i>>2]=j;break g}J[h+(J[h+16>>2]==(f|0)?16:20)>>2]=b;if(!b){break g}}J[b+24>>2]=h;c=J[f+16>>2];if(c){J[b+16>>2]=c;J[c+24>>2]=b}c=J[f+20>>2];if(!c){break g}J[b+20>>2]=c;J[c+24>>2]=b}J[d+4>>2]=a|1;J[a+d>>2]=a;if(J[467760]!=(d|0)){break f}J[467757]=a;return}if(a>>>0<=255){b=(a&-8)+1871060|0;c=J[467755];a=1<<(a>>>3);k:{if(!(c&a)){J[467755]=a|c;a=b;break k}a=J[b+8>>2]}J[b+8>>2]=d;J[a+12>>2]=d;J[d+12>>2]=b;J[d+8>>2]=a;return}c=31;if(a>>>0<=16777215){b=S(a>>>8|0);c=((a>>>38-b&1)-(b<<1)|0)+62|0}J[d+28>>2]=c;J[d+16>>2]=0;J[d+20>>2]=0;b=(c<<2)+1871324|0;l:{m:{e=J[467756];g=1<<c;n:{if(!(e&g)){J[467756]=e|g;J[b>>2]=d;J[d+24>>2]=b;break n}c=a<<((c|0)!=31?25-(c>>>1|0)|0:0);b=J[b>>2];while(1){e=b;if((J[b+4>>2]&-8)==(a|0)){break m}g=c>>>29|0;c=c<<1;g=(g&4)+b|0;b=J[g+16>>2];if(b){continue}break}J[g+16>>2]=d;J[d+24>>2]=e}J[d+12>>2]=d;J[d+8>>2]=d;break l}a=J[e+8>>2];J[a+12>>2]=d;J[e+8>>2]=d;J[d+24>>2]=0;J[d+12>>2]=e;J[d+8>>2]=a}a=J[467763]-1|0;J[467763]=a?a:-1}}function YB(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=Q(0),h=0,i=0,j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=0,o=0,p=Q(0);h=$c-32|0;$c=h;c=a+424|0;j=N[c+88>>2];k=N[c+84>>2];m=N[c+80>>2];g=N[c+76>>2];i=K[b+28|0];a:{if(!(i&1)){break a}J[h+24>>2]=J[c+72>>2];f=J[c+68>>2];J[h+16>>2]=J[c+64>>2];J[h+20>>2]=f;f=c- -64|0;b:{d=i&96;if((d|32)!=32){N[c+64>>2]=N[c+64>>2]+N[b>>2];N[c+68>>2]=N[c+68>>2]+N[b+4>>2];N[c+72>>2]=N[c+72>>2]+N[b+8>>2];break b}e=J[b+4>>2];J[f>>2]=J[b>>2];J[f+4>>2]=e;J[f+8>>2]=J[b+8>>2];if(d){break b}d=J[b>>2];e=J[b+4>>2];J[a+360>>2]=J[b+8>>2];J[a+352>>2]=d;J[a+356>>2]=e;e=J[f+4>>2];J[a+384>>2]=J[f>>2];J[a+388>>2]=e;J[a+392>>2]=J[f+8>>2];J[c+92>>2]=0;break a}Jh(h+4|0,h+16|0,f,Q(.5));e=J[c+92>>2];if((e|0)==10){Ie(c+100|0,c+112|0,108);e=9}J[c+92>>2]=e+1;d=P(e,12)+c|0;J[d+108>>2]=J[h+12>>2];e=J[h+8>>2];J[d+100>>2]=J[h+4>>2];J[d+104>>2]=e;e=J[c+92>>2];if((e|0)==10){Ie(c+100|0,c+112|0,108);e=9}J[c+92>>2]=e+1;d=f;f=K[d|0]|K[d+1|0]<<8|(K[d+2|0]<<16|K[d+3|0]<<24);n=K[d+4|0]|K[d+5|0]<<8|(K[d+6|0]<<16|K[d+7|0]<<24);e=P(e,12)+c|0;d=K[d+8|0]|K[d+9|0]<<8|(K[d+10|0]<<16|K[d+11|0]<<24);H[e+108|0]=d;H[e+109|0]=d>>>8;H[e+110|0]=d>>>16;H[e+111|0]=d>>>24;H[e+100|0]=f;H[e+101|0]=f>>>8;H[e+102|0]=f>>>16;H[e+103|0]=f>>>24;H[e+104|0]=n;H[e+105|0]=n>>>8;H[e+106|0]=n>>>16;H[e+107|0]=n>>>24}if(i&8){o=c,p=Cf(N[b+20>>2]),N[o+84>>2]=p}if(i&16){o=c,p=Cf(N[b+24>>2]),N[o+88>>2]=p}if(i&2){o=c,p=Cf(N[b+12>>2]),N[o+76>>2]=p}if(i&4){o=c,p=Cf(N[b+16>>2]),N[o+80>>2]=p}c:{if(i<<24>>24>=0){j=N[c+76>>2];N[a+364>>2]=j;l=N[c+80>>2];N[a+368>>2]=l;k=N[c+84>>2];N[a+372>>2]=k;g=N[c+88>>2];N[a+412>>2]=g;N[a+404>>2]=k;N[a+400>>2]=l;N[a+396>>2]=j;N[a+376>>2]=l;N[a+380>>2]=g;N[a+408>>2]=l;J[c+96>>2]=0;J[c>>2]=0;break c}l=Xe(k,N[c+84>>2],Q(.5));j=Xe(j,N[c+88>>2],Q(.5));k=Xe(g,N[c+76>>2],Q(.5));g=Xe(m,N[c+80>>2],Q(.5));a=J[c+96>>2];if((a|0)==10){Ie(c+220|0,c+236|0,144);a=9}J[c+96>>2]=a+1;a=(a<<4)+c|0;N[a+232>>2]=j;N[a+228>>2]=l;N[a+224>>2]=g;N[a+220>>2]=k;a=J[c+96>>2];if((a|0)==10){Ie(c+220|0,c+236|0,144);a=9}J[c+96>>2]=a+1;f=K[c+76|0]|K[c+77|0]<<8|(K[c+78|0]<<16|K[c+79|0]<<24);b=K[c+80|0]|K[c+81|0]<<8|(K[c+82|0]<<16|K[c+83|0]<<24);e=K[c+88|0]|K[c+89|0]<<8|(K[c+90|0]<<16|K[c+91|0]<<24);d=(a<<4)+c|0;a=K[c+84|0]|K[c+85|0]<<8|(K[c+86|0]<<16|K[c+87|0]<<24);H[d+228|0]=a;H[d+229|0]=a>>>8;H[d+230|0]=a>>>16;H[d+231|0]=a>>>24;H[d+232|0]=e;H[d+233|0]=e>>>8;H[d+234|0]=e>>>16;H[d+235|0]=e>>>24;H[d+220|0]=f;H[d+221|0]=f>>>8;H[d+222|0]=f>>>16;H[d+223|0]=f>>>24;H[d+224|0]=b;H[d+225|0]=b>>>8;H[d+226|0]=b>>>16;H[d+227|0]=b>>>24;g=Xe(m,N[c+80>>2],Q(.3333333432674408));a=J[c>>2];if((a|0)==15){Ie(c+4|0,c+8|0,60);a=14}N[((a<<2)+c|0)+4>>2]=g;J[c>>2]=a+1;g=Xe(m,N[c+80>>2],Q(.6666666865348816));a=J[c>>2];if((a|0)==15){Ie(c+4|0,c+8|0,60);a=14}N[((a<<2)+c|0)+4>>2]=g;J[c>>2]=a+1;g=Xe(m,N[c+80>>2],Q(1));a=J[c>>2];if((a|0)==15){Ie(c+4|0,c+8|0,60);a=14}N[((a<<2)+c|0)+4>>2]=g;J[c>>2]=a+1}$c=h+32|0}function Tk(){var a=0,b=0,c=0,d=0,e=0,f=Q(0),g=0,h=Q(0),i=Q(0),j=0,k=Q(0),l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=Q(0),v=Q(0);b=$c-176|0;$c=b;J[b+32>>2]=J[263544];a=J[263543];J[b+24>>2]=J[263542];J[b+28>>2]=a;a:{if(!K[1054180]){break a}l=J[b+24>>2];a=J[464807];if(l>>>0>=a>>>0){break a}m=J[b+28>>2];if(m>>>0>=M[464808]){break a}n=J[b+32>>2];e=J[464809];if(n>>>0>=e>>>0){break a}a=P(a,P(e,m)+n|0)+l|0;j=J[464818]&(K[a+J[464805]|0]<<8|K[a+J[464804]|0]);e=L[(J[266937]+J[266938]<<1)+1066048>>1];if(K[775856]){a=$c-160|0;$c=a;c=a+8|0;tg(c,e);J[a+156>>2]=8388608;J[a+152>>2]=a+16;d=a+152|0;ye(d,c);c=mh(d,0);$c=a+160|0;e=((c|0)==-1?e:c)&65535}if(pp(j)){break a}a=e+66896|0;if(!K[a+64512|0]|K[a+13824|0]==4&K[j+80720|0]!=4){break a}a=j+66896|0;if(!(K[a+8448|0]|K[a+65280|0])){break a}b:{if(K[e+75344|0]!=2){break b}a=J[207101];Bi(b+116|0,1054168);f=N[b+124>>2];h=N[b+120>>2];k=N[b+116>>2];c=P(e,12)+66896|0;p=c+18432|0;N[b+152>>2]=k+N[p>>2];q=c+18436|0;N[b+156>>2]=h+N[q>>2];r=c+18440|0;N[b+160>>2]=f+N[r>>2];s=c+27648|0;N[b+164>>2]=k+N[s>>2];d=c+27652|0;N[b+168>>2]=h+N[d>>2];t=c+27656|0;N[b+172>>2]=f+N[t>>2];g=J[207101];c=0;while(1){o=J[(c<<2)+827376>>2];if(!(!o|(g|0)==(o|0))){g=b+128|0;Lg(o,g);N[b+132>>2]=N[b+132>>2]+Q(.03125);if(gg(g,b+152|0)){break a}g=J[207101]}c=c+1|0;if((c|0)!=256){continue}break}h=N[a+392>>2];f=N[a+388>>2];k=N[a+384>>2];i=N[b+116>>2];N[b+92>>2]=i+N[p>>2];u=N[b+120>>2];N[b+96>>2]=u+N[q>>2];v=N[b+124>>2];N[b+100>>2]=v+N[r>>2];N[b+104>>2]=i+N[s>>2];N[b+108>>2]=u+N[d>>2];N[b+112>>2]=v+N[t>>2];c=b+68|0;Lg(a,c);i=N[b+72>>2];N[b+72>>2]=f<i?f:i;if(K[a+494|0]){break b}if(!gg(c,b+92|0)){break b}if(K[a+470|0]?!K[a+477|0]|!K[a+468|0]:1){N[b+72>>2]=N[b+72>>2]+Q(.25099998712539673);if(gg(b+68|0,b+92|0)){break a}f=N[d>>2];H[b+64|0]=1;N[b+44>>2]=h;N[b+36>>2]=k;N[b+40>>2]=Q(f+N[b+120>>2])+Q(.0010000000474974513);bd[J[J[a>>2]+8>>2]](a,b+36|0);break b}a=$c-80|0;$c=a;c=J[207101];J[a+72>>2]=J[c+12>>2];d=J[c+8>>2];J[a+64>>2]=J[c+4>>2];J[a+68>>2]=d;c:{d:{switch(K[1054181]){case 1:N[a+64>>2]=N[b+104>>2]+Q(.5);break c;case 3:N[a+72>>2]=N[b+112>>2]+Q(.5);break c;case 0:N[a+64>>2]=N[b+92>>2]+Q(-.5);break c;case 2:N[a+72>>2]=N[b+100>>2]+Q(-.5);break c;case 5:N[a+68>>2]=Q(N[b+96>>2]+Q(1))+Q(.0010000000474974513);break c;case 4:break d;default:break c}}N[a+68>>2]=Q(N[b+96>>2]-N[c+96>>2])+Q(-.0010000000474974513)}d=0;f=N[a+64>>2];e:{if(!(f>Q(0))|!(N[a+68>>2]>=Q(0))){break e}h=N[a+72>>2];if(!(h>Q(0))|!(f<Q(J[464807]))|!(h<Q(J[464809]))){break e}g=a+40|0;Dg(g,a- -64|0,c+92|0);if(!K[c+494|0]){if(Of(g,242)){break e}}J[a+16>>2]=J[a+72>>2];d=J[a+68>>2];J[a+8>>2]=J[a+64>>2];J[a+12>>2]=d;d=1;H[a+36|0]=1;bd[J[J[c>>2]+8>>2]](c,a+8|0)}$c=a+80|0;if(!d){break a}}ii(l,m,n,e);J[b+16>>2]=J[b+32>>2];a=J[b+28>>2];J[b+8>>2]=J[b+24>>2];J[b+12>>2]=a;Op(b+8|0,j,e)}$c=b+176|0}function Mq(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;f=a+b|0;c=J[a+4>>2];a:{b:{if(c&1){break b}if(!(c&3)){break a}c=J[a>>2];b=c+b|0;c:{d:{e:{a=a-c|0;if((a|0)!=J[467760]){if(c>>>0<=255){d=J[a+8>>2];e=J[a+12>>2];if((d|0)!=(e|0)){break e}i=1871020,j=J[467755]&HN(c>>>3|0),J[i>>2]=j;break b}h=J[a+24>>2];c=J[a+12>>2];if((c|0)!=(a|0)){d=J[a+8>>2];J[d+12>>2]=c;J[c+8>>2]=d;break c}e=a+20|0;d=J[e>>2];if(!d){d=J[a+16>>2];if(!d){break d}e=a+16|0}while(1){g=e;c=d;e=c+20|0;d=J[e>>2];if(d){continue}e=c+16|0;d=J[c+16>>2];if(d){continue}break}J[g>>2]=0;break c}c=J[f+4>>2];if((c&3)!=3){break b}J[467757]=b;J[f+4>>2]=c&-2;J[a+4>>2]=b|1;J[f>>2]=b;return}J[d+12>>2]=e;J[e+8>>2]=d;break b}c=0}if(!h){break b}d=J[a+28>>2];e=(d<<2)+1871324|0;f:{if(J[e>>2]==(a|0)){J[e>>2]=c;if(c){break f}i=1871024,j=J[467756]&HN(d),J[i>>2]=j;break b}J[h+(J[h+16>>2]==(a|0)?16:20)>>2]=c;if(!c){break b}}J[c+24>>2]=h;d=J[a+16>>2];if(d){J[c+16>>2]=d;J[d+24>>2]=c}d=J[a+20>>2];if(!d){break b}J[c+20>>2]=d;J[d+24>>2]=c}g:{h:{i:{j:{c=J[f+4>>2];if(!(c&2)){if(J[467761]==(f|0)){J[467761]=a;b=J[467758]+b|0;J[467758]=b;J[a+4>>2]=b|1;if(J[467760]!=(a|0)){break a}J[467757]=0;J[467760]=0;return}if(J[467760]==(f|0)){J[467760]=a;b=J[467757]+b|0;J[467757]=b;J[a+4>>2]=b|1;J[a+b>>2]=b;return}b=(c&-8)+b|0;if(c>>>0<=255){e=c>>>3|0;c=J[f+12>>2];d=J[f+8>>2];if((c|0)==(d|0)){i=1871020,j=J[467755]&HN(e),J[i>>2]=j;break h}J[d+12>>2]=c;J[c+8>>2]=d;break h}h=J[f+24>>2];c=J[f+12>>2];if((f|0)!=(c|0)){d=J[f+8>>2];J[d+12>>2]=c;J[c+8>>2]=d;break i}e=f+20|0;d=J[e>>2];if(!d){d=J[f+16>>2];if(!d){break j}e=f+16|0}while(1){g=e;c=d;e=c+20|0;d=J[e>>2];if(d){continue}e=c+16|0;d=J[c+16>>2];if(d){continue}break}J[g>>2]=0;break i}J[f+4>>2]=c&-2;J[a+4>>2]=b|1;J[a+b>>2]=b;break g}c=0}if(!h){break h}d=J[f+28>>2];e=(d<<2)+1871324|0;k:{if(J[e>>2]==(f|0)){J[e>>2]=c;if(c){break k}i=1871024,j=J[467756]&HN(d),J[i>>2]=j;break h}J[h+(J[h+16>>2]==(f|0)?16:20)>>2]=c;if(!c){break h}}J[c+24>>2]=h;d=J[f+16>>2];if(d){J[c+16>>2]=d;J[d+24>>2]=c}d=J[f+20>>2];if(!d){break h}J[c+20>>2]=d;J[d+24>>2]=c}J[a+4>>2]=b|1;J[a+b>>2]=b;if(J[467760]!=(a|0)){break g}J[467757]=b;return}if(b>>>0<=255){c=(b&-8)+1871060|0;d=J[467755];b=1<<(b>>>3);l:{if(!(d&b)){J[467755]=b|d;b=c;break l}b=J[c+8>>2]}J[c+8>>2]=a;J[b+12>>2]=a;J[a+12>>2]=c;J[a+8>>2]=b;return}d=31;if(b>>>0<=16777215){c=S(b>>>8|0);d=((b>>>38-c&1)-(c<<1)|0)+62|0}J[a+28>>2]=d;J[a+16>>2]=0;J[a+20>>2]=0;c=(d<<2)+1871324|0;m:{e=J[467756];g=1<<d;n:{if(!(e&g)){J[467756]=e|g;J[c>>2]=a;J[a+24>>2]=c;break n}d=b<<((d|0)!=31?25-(d>>>1|0)|0:0);c=J[c>>2];while(1){e=c;if((J[c+4>>2]&-8)==(b|0)){break m}g=d>>>29|0;d=d<<1;g=(g&4)+c|0;c=J[g+16>>2];if(c){continue}break}J[g+16>>2]=a;J[a+24>>2]=e}J[a+12>>2]=a;J[a+8>>2]=a;return}b=J[e+8>>2];J[b+12>>2]=a;J[e+8>>2]=a;J[a+24>>2]=0;J[a+12>>2]=e;J[a+8>>2]=b}}function Br(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;if(!K[a+115576|0]){H[a+115576|0]=1;d=J[a+4>>2];J[a+4>>2]=d+3;J[a>>2]=J[a>>2]|3<<d}o=a+17272|0;m=a+888|0;a:{b:{if((b|0)<4){f=o;break b}q=a+33656|0;e=o;while(1){f=e+1|0;c:{d:{e:{l=(((K[e+2|0]^(K[e|0]<<8&3840^K[e+1|0]<<4))<<1)+a|0)+41848|0;h=L[l>>1];f:{if(h){j=(b|0)>=258?258:b;n=0;c=h;k=0;i=2;while(1){p=c&65535;c=p+m|0;d=0;g=e;g:{while(1){if(K[c|0]!=K[g|0]){break g}g=g+1|0;c=c+1|0;d=d+1|0;if((j|0)!=(d|0)){continue}break}d=j}c=(d|0)>(i|0);n=c?p:n;i=c?d:i;c=L[((p<<1)+a|0)+50040>>1];if(c){d=k>>>0<4;k=k+1|0;if(d){continue}}break}k=e-m|0;I[l>>1]=k;I[((k<<1)+a|0)+50040>>1]=h;if(!n){break f}c=L[(((K[e+3|0]^(K[e+1|0]<<8&3840^K[e+2|0]<<4))<<1)+a|0)+41848>>1];h:{if(!c){break h}h=((b|0)>=259?259:b)-1|0;j=0;while(1){l=c&65535;c=l+m|0;d=0;g=f;i:{while(1){if(K[c|0]!=K[g|0]){break i}g=g+1|0;c=c+1|0;d=d+1|0;if((h|0)!=(d|0)){continue}break}d=h}if((d|0)>(i|0)){break f}c=L[((l<<1)+a|0)+50040>>1];if(!c){break h}d=j>>>0<4;j=j+1|0;if(d){continue}break}}c=0;while(1){f=c;c=c+1|0;if(L[(c<<1)+32032>>1]<=(i|0)){continue}break}d=f+257|0;c=J[a+4>>2];h=J[a>>2]|L[((d<<1)+a|0)+24>>1]<<c;J[a>>2]=h;c=c+K[(a+d|0)+600|0]|0;J[a+4>>2]=c;j:{if(f-28>>>0<4294967276){d=c;break j}d=c+K[f+31840|0]|0;J[a+4>>2]=d;h=i-L[(f<<1)+32032>>1]<<c|h;J[a>>2]=h}if(d>>>0>7){break e}break d}d=e-m|0;I[l>>1]=d;I[((d<<1)+a|0)+50040>>1]=h}tr(a,K[e|0]);b=b-1|0;break c}while(1){d=J[a+12>>2];J[a+12>>2]=d+1;H[d|0]=h;J[a+16>>2]=J[a+16>>2]-1;h=J[a>>2]>>>8|0;J[a>>2]=h;d=J[a+4>>2]-8|0;J[a+4>>2]=d;if(d>>>0>7){continue}break}}j=k-n|0;c=0;while(1){f=c;c=c+1|0;if((j|0)>=L[(c<<1)+32096>>1]){continue}break}g=d+5|0;J[a+4>>2]=g;c=f<<8|(f&65280)>>>8;c=c>>>4&3855|(c&3855)<<4;c=c>>>2&13107|(c&13107)<<2;c=(c>>>1&20480|(c&21504)<<1)>>>11<<d|h;J[a>>2]=c;k:{if(f-30>>>0<4294967270){d=g;break k}d=g+K[f+31936|0]|0;J[a+4>>2]=d;c=j-L[(f<<1)+32096>>1]<<g|c;J[a>>2]=c}if(d>>>0>=8){while(1){d=J[a+12>>2];J[a+12>>2]=d+1;H[d|0]=c;J[a+16>>2]=J[a+16>>2]-1;c=J[a>>2]>>>8|0;J[a>>2]=c;d=J[a+4>>2]-8|0;J[a+4>>2]=d;if(d>>>0>7){continue}break}}f=e+i|0;b=b-i|0}d=J[a+16>>2];if(d>>>0<20){i=ce(J[a+20>>2],q,8192-d|0);J[a+16>>2]=8192;J[a+12>>2]=q;if(i){break a}}e=f;if((b|0)>3){continue}break}}g=0;if((b|0)>0){while(1){tr(a,K[f|0]);f=f+1|0;d=b>>>0>1;b=b-1|0;if(d){continue}break}}b=a+33656|0;i=ce(J[a+20>>2],b,8192-J[a+16>>2]|0);J[a+16>>2]=8192;J[a+12>>2]=b;Kd(m,o,16384);J[a+8>>2]=16384;while(1){c=0;d=((g<<1)+a|0)+41848|0;e=L[d>>1];b=e-16384|0;I[d>>1]=b>>>0<=e>>>0?b:0;g=g+1|0;if((g|0)!=4096){continue}break}while(1){d=((c<<1)+a|0)+50040|0;e=L[d>>1];b=e-16384|0;I[d>>1]=b>>>0<=e>>>0?b:0;c=c+1|0;if((c|0)!=32768){continue}break}}return i}function Nm(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;h=$c-6144|0;$c=h;Nd(1041896);a:{if(K[1054308]){H[1845431]=1;break a}H[1845431]=0;b:{c=Fh(h,a);if(!c){if(Qm(h)){break b}qd(J[h>>2]);break b}qd(J[h>>2]);if((c|0)==-857812961){d=$c-624|0;$c=d;J[d+8>>2]=0;c=bd[J[a+24>>2]](a,d+12|0)|0;c:{if(c){break c}d:{c=J[d+12>>2];if(c>>>0<23){break d}e=c>>>0>=257?257:c;f=22;while(1){if(bd[J[a+16>>2]](a,J[d+12>>2]-f|0)|0){c=-857812946;break c}c=Wm(a,d+8|0);if(c){break c}if(J[d+8>>2]!=101010256){f=f+1|0;if((e|0)==(f|0)){break d}continue}break}J[d+32>>2]=512;J[d+28>>2]=h;J[d+24>>2]=994;J[d+20>>2]=993;J[d+16>>2]=a;c=Sd(a,d+48|0,18);if(c){break c}e=K[d+54|0]|K[d+55|0]<<8;J[d+40>>2]=e;f=K[d+60|0]|K[d+61|0]<<8|(K[d+62|0]<<16|K[d+63|0]<<24);J[d+44>>2]=f;c=-857812944;if(bd[J[a+16>>2]](a,f)|0){break c}e:{if(!e){break e}while(1){c=Wm(a,d+8|0);if(c){break c}f=J[d+8>>2];f:{if((f|0)!=33639248){c=-857812943;if((f|0)==101010256){break f}break c}c=Sd(a,d+582|0,42);if(c){break c}c=K[d+606|0]|K[d+607|0]<<8;if(c>>>0>512){c=-857812940;break c}I[d+578>>1]=c;I[d+576>>1]=c;f=d+48|0;J[d+572>>2]=f;c=Sd(a,f,c);if(c){break c}c=bd[J[a+12>>2]](a,(K[d+608|0]|K[d+609|0]<<8)+(K[d+610|0]|K[d+611|0]<<8)|0)|0;if(c){break c}if((j|0)>=512){c=-857812947;break c}c=P(j,12)+h|0;J[c>>2]=K[d+598|0]|K[d+599|0]<<8|(K[d+600|0]<<16|K[d+601|0]<<24);J[c+4>>2]=K[d+602|0]|K[d+603|0]<<8|(K[d+604|0]<<16|K[d+605|0]<<24);J[c+8>>2]=K[d+620|0]|K[d+621|0]<<8|(K[d+622|0]<<16|K[d+623|0]<<24);j=j+1|0;i=i+1|0;if((e|0)!=(i|0)){continue}}break}J[d+36>>2]=j;if((j|0)<=0){break e}f=0;while(1){k=P(f,12)+h|0;if(bd[J[a+16>>2]](a,J[k+8>>2])|0){c=-857812942;break c}c=Wm(a,d+8|0);if(c){break c}if(J[d+8>>2]!=67324752){c=-857812941;break c}e=$c-45424|0;$c=e;i=J[d+16>>2];c=Sd(i,e+45398|0,26);g:{if(c){break g}c=-857812940;g=e+45420|0;g=K[g|0]|K[g+1|0]<<8;if(g>>>0>512){break g}I[e+45394>>1]=g;I[e+45392>>1]=g;c=e+44864|0;J[e+45388>>2]=c;c=Sd(i,c,g);if(c){break g}c=0;if(!(bd[J[d+20>>2]](e+45388|0)|0)){break g}c=e+45422|0;c=bd[J[i+12>>2]](i,K[c|0]|K[c+1|0]<<8)|0;if(c){break g}c=e+45402|0;g=K[c|0]|K[c+1|0]<<8;J[e+44860>>2]=g;c=e+45416|0;l=K[c|0]|K[c+1|0]<<8|(K[c+2|0]<<16|K[c+3|0]<<24);c=e+45412|0;c=K[c|0]|K[c+1|0]<<8|(K[c+2|0]<<16|K[c+3|0]<<24);if(!c){c=J[k>>2]}l=l?l:J[k+4>>2];h:{if((g|0)!=8){if(g){break h}c=e+44804|0;Xm(c,i,l);c=bd[J[d+24>>2]](e+45388|0,c,k)|0;break g}g=e+44804|0;Xm(g,i,c);c=e+44748|0;yg(c,e+8|0,g);c=bd[J[d+24>>2]](e+45388|0,c,k)|0;break g}vf(11116,e+44860|0);c=0}$c=e+45424|0;if(c){break c}f=f+1|0;if((j|0)!=(f|0)){continue}break}}c=0;break c}c=-857812945}$c=d+624|0;if(!c){break b}Af(c,11905,b);break a}Af(c,12332,b);break a}c=0}$c=h+6144|0;return c}function nK(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=Q(0),f=0,g=0,h=0,i=0,j=0,k=0,l=Q(0),m=Q(0),n=0,o=0,p=0,q=Q(0),r=Q(0),s=0,t=0,u=Q(0),v=Q(0),w=Q(0),x=Q(0),y=Q(0),z=Q(0),A=Q(0),B=Q(0),C=Q(0),D=Q(0),E=Q(0),F=0,G=0,H=Q(0),M=Q(0),O=0,S=Q(0),T=0,U=Q(0),V=0,W=Q(0),X=0,Y=Q(0);a=$c-16|0;$c=a;J[a+8>>2]=J[b+8>>2];j=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=j;g=$c-32|0;$c=g;if(!(K[c+80720|0]==4|d)){Bi(g+16|0,a);h=P(c,12)+66896|0;t=L[h+55296>>1];Gi(g,t,g+28|0);u=N[g>>2];v=N[g+4>>2];w=N[h+27656>>2];e=Q(w*Q(16));a:{if(Q(R(e))<Q(2147483648)){b=~~e;break a}b=-2147483648}x=N[h+27648>>2];e=Q(x*Q(16));b:{if(Q(R(e))<Q(2147483648)){d=~~e;break b}d=-2147483648}i=(b|0)>(d|0)?d:b;y=N[h+18440>>2];e=Q(y*Q(16));c:{if(Q(R(e))<Q(2147483648)){d=~~e;break c}d=-2147483648}m=Q(N[458160]*Q(.0625));b=(i|0)>12?12:i;z=N[h+18432>>2];e=Q(z*Q(16));d:{if(Q(R(e))<Q(2147483648)){k=~~e;break d}k=-2147483648}p=(d|0)>(k|0)?k:d;F=((p|0)<12?b:i)-p|0;A=N[h+18436>>2];e=Q(Q(16)-Q(A*Q(16)));e:{if(Q(R(e))<Q(2147483648)){b=~~e;break e}b=-2147483648}B=Q(Q(Q(b|0)*m)+v);d=(b|0)>12?12:b;C=N[h+27652>>2];e=Q(Q(16)-Q(C*Q(16)));f:{if(Q(R(e))<Q(2147483648)){j=~~e;break f}j=-2147483648}G=((j|0)<12?d:b)-j|0;D=Q(Q(Q(i|0)*Q(.0625))+u);H=Q(m*Q(4));M=Q(m*Q(-.009999999776482582));d=0;while(1){e=Q(Q(d|0)*Q(.25));q=Q(e+Q(.125));O=z>q|q>x;S=Q(Q(e+Q(-.5))+Q(.125));n=0;while(1){e=Q(Q(n|0)*Q(.25));r=Q(e+Q(.0625));T=r<A|O|r>C;U=Q(e+Q(.125));o=0;while(1){g:{if(T){break g}e=Q(Q(o|0)*Q(.25));l=Q(e+Q(.125));if(l<y|l>w){break g}b=J[400098];if((b|0)==600){Ie(1600400,1600464,38336);b=599}J[400098]=b+1;f=b<<6;X=f+1600400|0,Y=Q(S+Q(Q(Fd(1600384)*Q(.4000000059604645))+Q(-.20000000298023224))),N[X>>2]=Y;X=f+1600404|0,Y=Q(U+Q(Q(Fd(1600384)*Q(.4000000059604645))+Q(-.20000000298023224))),N[X>>2]=Y;X=f+1600408|0,Y=Q(Q(Q(e+Q(-.5))+Q(.125))+Q(Q(Fd(1600384)*Q(.4000000059604645))+Q(-.20000000298023224))),N[X>>2]=Y;V=zd(1600384,F);h=zd(1600384,G);s=f+1600416|0;N[s>>2]=q+N[g+16>>2];N[f+1600420>>2]=r+N[g+20>>2];k=f+1600424|0;N[k>>2]=l+N[g+24>>2];b=J[s+4>>2];i=f+1600428|0;J[i>>2]=J[s>>2];J[i+4>>2]=b;J[f+1600436>>2]=J[k>>2];W=Fd(1600384);I[f+1600462>>1]=c;I[f+1600460>>1]=t;E=Q(Q(Q(h+j|0)*m)+v);e=Q(H+E);N[f+1600456>>2]=M+(e<B?e:B);l=Q(Q(Q(p+V|0)*Q(.0625))+u);e=Q(l+Q(.25));N[f+1600452>>2]=(e<D?e:D)+Q(-.0006249999860301614);N[f+1600448>>2]=E;N[f+1600444>>2]=l;N[f+1600412>>2]=Q(W*Q(1.2000000476837158))+Q(.30000001192092896);b=zd(1600384,30);N[f+1600440>>2]=((b|0)>27?12:(b|0)>24?10:8)|0}o=o+1|0;if((o|0)!=4){continue}break}n=n+1|0;if((n|0)!=4){continue}break}d=d+1|0;if((d|0)!=4){continue}break}}$c=g+32|0;$c=a+16|0}function Tq(a,b){var c=0,d=0;d=$c-16|0;$c=d;J[d+12>>2]=a;a:{if(!(a-48>>>0<10|a-65>>>0<26)){if(a-112>>>0<=23){c=a-111|0;break a}if(a-96>>>0<=9){c=a+5|0;break a}b:{c:{d:{e:{f:{g:{h:{i:{j:{k:{l:{m:{n:{o:{p:{q:{r:{s:{t:{u:{v:{w:{x:{y:{z:{A:{B:{C:{D:{E:{F:{G:{H:{I:{J:{K:{L:{M:{N:{O:{P:{Q:{R:{S:{T:{U:{V:{W:{if((a|0)<=105){c=94;switch(a-8|0){case 0:break a;case 51:break g;case 38:break D;case 37:break E;case 36:break F;case 32:break G;case 31:break H;case 30:break I;case 29:break J;case 28:break K;case 27:break L;case 26:break M;case 25:break N;case 24:break O;case 19:break P;case 12:break Q;case 11:break R;case 10:break S;case 9:break T;case 8:break U;case 5:break V;case 1:break W;case 2:case 3:case 4:case 6:case 7:case 13:case 14:case 15:case 16:case 17:case 18:case 20:case 21:case 22:case 23:case 33:case 34:case 35:case 39:case 40:case 41:case 42:case 43:case 44:case 45:case 46:case 47:case 48:case 49:case 50:case 52:break c;case 53:break f;default:break d}}X:{switch(a-173|0){case 13:break g;case 6:break h;case 5:break i;case 4:break j;case 3:break k;case 2:case 10:break l;case 1:case 9:break m;case 8:break n;case 49:break o;case 48:break p;case 47:break q;case 46:break r;case 19:break s;case 18:break t;case 17:break u;case 15:break v;case 7:case 11:case 12:case 20:case 21:case 22:case 23:case 24:case 25:case 26:case 27:case 28:case 29:case 30:case 31:case 32:case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:case 41:case 42:case 43:case 44:case 45:break c;case 0:case 16:break e;case 14:break f;default:break X}}Y:{switch(a-106|0){case 5:break y;case 4:break z;case 3:break A;case 1:break B;case 0:break C;case 2:break c;default:break Y}}switch(a-144|0){case 1:break w;case 0:break x;default:break c}}c=95;break a}c=(b|0)==3?116:91;break a}c=(b|0)==2?37:36;break a}c=(b|0)==2?39:38;break a}c=(b|0)==2?41:40;break a}c=99;break a}c=96;break a}c=92;break a}c=93;break a}c=62;break a}c=63;break a}c=61;break a}c=60;break a}c=46;break a}c=44;break a}c=47;break a}c=45;break a}c=98;break a}c=58;break a}c=59;break a}c=112;break a}c=114;break a}c=113;break a}c=115;break a}c=111;break a}c=100;break a}c=97;break a}c=33;break a}c=34;break a}c=30;break a}c=25;break a}c=28;break a}c=35;break a}c=29;break a}c=32;break a}c=130;break a}c=132;break a}c=131;break a}c=134;break a}c=135;break a}c=137;break a}c=136;break a}c=31;break a}c=27;break a}c=26;break a}if((a|0)==91){break b}}vf(11079,d+12|0);c=0;break a}c=(b|0)==2?43:42;break a}c=a}$c=d+16|0;return c}function rq(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;b=$c-672|0;$c=b;a:{if(!K[J[a+48>>2]+44|0]){break a}b:{switch(K[a+109|0]){case 0:Ee(b+88|0,a+196|0,64);c:{while(1){d:{c=J[(d<<2)+827376>>2];if(!c|K[c+109|0]<2){break d}Ee(b+32|0,c+196|0,64);e=J[b+36>>2];J[b+400>>2]=J[b+32>>2];J[b+404>>2]=e;if(!Uf(b+88|0,b+400|0)){break d}d=1;if(K[c+109|0]!=3){break c}J[a+112>>2]=J[c+112>>2];H[a+108|0]=K[c+108|0];N[a+120>>2]=N[c+120>>2];N[a+124>>2]=N[c+124>>2];d=3;break c}d=d+1|0;if((d|0)!=256){continue}break}d=a;f=((a|0)==834384)<<1;c=$c-144|0;$c=c;J[c+140>>2]=8388608;J[c+136>>2]=c;e=b+88|0;e:{if(Di(e)){ke(c+136|0,e);break e}xe(c+136|0,11586,54228,e)}e=Nj(c+136|0,f,0,0,0);$c=c+144|0;J[d+104>>2]=e;d=2}H[a+109|0]=d;break a;case 2:break b;default:break a}}if(!Mj(J[a+104>>2],b+88|0)){break a}qq(a,1);if(!K[b+393|0]){break a}d=b+32|0;fk(d,J[b+244>>2],J[b+248>>2]);Ee(b+12|0,a+196|0,64);f:{g:{h:{d=Fh(b+20|0,d);if(!d){Cd(a+112|0);c=rg(J[b+24>>2]);e=rg(J[b+28>>2]);if((c|0)==J[b+24>>2]&(e|0)==J[b+28>>2]){break g}f=Lj(P(c,e),4);if(f){break h}d=-857812988}e=J[b+248>>2];f=J[b+244>>2];J[b+668>>2]=16777216;J[b+664>>2]=b+400;a=$c-16|0;$c=a;J[a+12>>2]=d;c=b+664|0;Tf(c,27987,a+12|0,9116,b+12|0);fj(c,J[a+12>>2],133);$c=a+16|0;if((d|0)==-857812961){od(c,28369);zs(c,f,(e|0)>=8?8:e);od(c,27985)}bd[J[12861]](b+664|0);break f}d=J[b+24>>2];N[a+120>>2]=Q(d|0)/Q(c|0);g=J[b+28>>2];N[a+124>>2]=Q(g|0)/Q(e|0);if((g|0)>0){g=d<<2;d=0;while(1){Kd(f+(P(c,d)<<2)|0,J[b+20>>2]+(P(J[b+24>>2],d)<<2)|0,g);d=d+1|0;if((d|0)<J[b+28>>2]){continue}break}}qd(J[b+20>>2]);J[b+28>>2]=e;J[b+24>>2]=c;J[b+20>>2]=f}l=a,m=as(b+20|0),H[l+108|0]=m;if(!hl(J[b+24>>2],J[b+28>>2],0)){Od(14307,b+12|0);break f}i:{if(!(K[J[a+48>>2]+42|0]&2)){break i}d=J[b+28>>2]/((K[a+108|0]?64:32)|0)|0;if((d|0)<=0){break i}e=J[b+24>>2];c=(e|0)/64|0;f=c<<5;f=(f|0)<=1?1:f;g=d<<4;j=J[b+20>>2]+(c<<7)|0;c=0;i=(e|0)>63;while(1){if(i){h=(P(c,e)<<2)+j|0;d=0;while(1){if(M[h+(d<<2)>>2]<=4278190079){break i}d=d+1|0;if((f|0)!=(d|0)){continue}break}}c=c+1|0;if((g|0)!=(c|0)){continue}break}c=0;e=(e|0)<64;while(1){if(!e){i=(P(J[b+24>>2],c)<<2)+j|0;d=0;while(1){h=i+(d<<2)|0;k=J[h>>2];if(!((k|0)!=-1&(k|0)!=-16777216)){J[h>>2]=0}d=d+1|0;if((f|0)!=(d|0)){continue}break}}c=c+1|0;if((g|0)!=(c|0)){continue}break}}l=a,m=qj(b+20|0,1,0),J[l+112>>2]=m;qq(a,0)}qd(J[b+20>>2]);Oj(b+88|0)}$c=b+672|0}function ko(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0;k=$c-1296|0;$c=k;h=J[464807];b=a+18|0;q=(a|0)>0?a:0;g=((b|0)>(h|0)?h:b)-q|0;u=J[464809];a=c+18|0;r=(c|0)>0?c:0;o=((a|0)>(u|0)?u:a)-r|0;if((o|0)>0){j=J[266950];l=(g|0)<=0;c=0;while(1){if(!l){a=c+g|0;b=P(i+r|0,h)+q|0;d=0;while(1){p=L[j+(b<<1)>>1];J[(c<<2)+k>>2]=0;a:{if((p|0)==32767){s=s+1|0;d=0;break a}p=(c-d<<2)+k|0;J[p>>2]=J[p>>2]+1;d=d+1|0}b=b+1|0;c=c+1|0;if((a|0)!=(c|0)){continue}break}c=a}i=i+1|0;if((o|0)!=(i|0)){continue}break}}a=J[464808];b:{c:{if(J[464818]<=255){if((a|0)<=0){break c}p=P(h,r)+q|0;v=J[266950];while(1){if((s|0)<=0){break b}w=a;a=a-1|0;if((o|0)>0){j=P(P(a,u)+r|0,h)+q|0;i=0;l=p;while(1){if((g|0)>0){c=P(g,i);x=v+(l<<1)|0;e=0;y=J[464804];b=j;f=0;while(1){d=J[(c<<2)+k>>2];m=d+c|0;b=b+d|0;d:{e:{d=d+e|0;if((g|0)<=(d|0)){break e}n=K[b+y|0]+66896|0;if(!K[n+768|0]){break e}I[x+(d<<1)>>1]=a-(K[n+13056|0]>>>6&1);J[(m<<2)+k>>2]=0;n=e-f|0;f:{g:{e=(c-f<<2)+k|0;f=J[e>>2]+1|0;if((n+f|0)>=(g|0)){break g}n=e+(f<<2)|0;c=J[n>>2];if(!c){break g}J[n>>2]=0;f=c+f|0;break f}c=0}s=s-1|0;J[e>>2]=f;b=b+c|0;m=c+m|0;d=c+d|0;break d}f=0}c=m+1|0;b=b+1|0;e=d+1|0;if((g|0)>(e|0)){continue}break}}j=h+j|0;l=h+l|0;i=i+1|0;if((o|0)!=(i|0)){continue}break}}if((w|0)>=2){continue}break}break c}if((a|0)<=0){break c}p=P(h,r)+q|0;v=J[266950];while(1){if((s|0)<=0){break b}w=a;a=a-1|0;if((o|0)>0){i=P(P(a,u)+r|0,h)+q|0;l=0;j=p;while(1){if((g|0)>0){b=P(g,l);x=v+(j<<1)|0;y=J[464805];e=0;n=J[464804];c=i;f=0;while(1){d=J[(b<<2)+k>>2];m=d+b|0;c=c+d|0;h:{i:{d=d+e|0;if((g|0)<=(d|0)){break i}t=(K[c+n|0]|K[c+y|0]<<8)+66896|0;if(!K[t+768|0]){break i}I[x+(d<<1)>>1]=a-(K[t+13056|0]>>>6&1);J[(m<<2)+k>>2]=0;t=e-f|0;j:{k:{e=(b-f<<2)+k|0;f=J[e>>2]+1|0;if((t+f|0)>=(g|0)){break k}t=e+(f<<2)|0;b=J[t>>2];if(!b){break k}J[t>>2]=0;f=b+f|0;break j}b=0}s=s-1|0;J[e>>2]=f;c=b+c|0;m=b+m|0;d=b+d|0;break h}f=0}b=m+1|0;c=c+1|0;e=d+1|0;if((g|0)>(e|0)){continue}break}}i=h+i|0;j=h+j|0;l=l+1|0;if((o|0)!=(l|0)){continue}break}}if((w|0)>=2){continue}break}}if((o|0)<=0){break b}e=0;a=J[266950];j=(g|0)<=0;while(1){if(!j){c=P(e+r|0,h)+q|0;b=0;while(1){d=a+(c<<1)|0;if(L[d>>1]==32767){I[d>>1]=65526}c=c+1|0;b=b+1|0;if((g|0)!=(b|0)){continue}break}}e=e+1|0;if((o|0)!=(e|0)){continue}break}}$c=k+1296|0}function Dk(a,b,c){var d=0,e=Q(0),f=Q(0),g=Q(0),h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=0,n=0,o=0,p=0;f=Q(c|0);j=Q(f+Q(.84375));i=Q(b|0);k=Q(i+Q(1));g=Q(a|0);l=Q(g+Q(.84375));f=Q(f+Q(.15625));g=Q(g+Q(.15625));d=L[390030];n=L[P(d,12)+122194>>1];h=N[458160];o=J[458158];d=K[d+84560|0];a:{if((d&254)!=6){break a}xj(812936,P(c,1217)+a&2147483647);e=Q(Q(zd(812936,7)-3|0)*Q(.0625));l=Q(l+Q(e+Q(.10625000298023224)));g=Q(g+Q(e+Q(-.10625000298023224)));m=zd(812936,4);e=Q(Q(zd(812936,7)-3|0)*Q(.0625));j=Q(j+Q(e+Q(.10625000298023224)));f=Q(f+Q(e+Q(-.10625000298023224)));if((d|0)!=7){break a}e=Q(Q(m|0)*Q(.0625));k=Q(k-e);i=Q(i-e)}p=J[458159];d=-1;m=L[390030];if(!K[m+68432|0]){d=bd[J[266961]](a,b,c)|0;m=L[390030]}if(K[m+83024|0]){d=sd(d,J[(m<<2)+69200>>2])}b=n>>>p<<5;c=b+780140|0;m=J[c>>2];a=J[195014]+P(m,24)|0;N[a+72>>2]=l;N[a+48>>2]=l;N[a+24>>2]=g;e=Q(h*Q(.9993749856948853));h=Q(h*Q(n&o));e=Q(e+h);N[a+20>>2]=e;J[a+16>>2]=1065342730;J[a+12>>2]=d;N[a+8>>2]=f;N[a+4>>2]=i;N[a>>2]=g;N[a+92>>2]=e;J[a+88>>2]=0;J[a+84>>2]=d;N[a+80>>2]=j;N[a+76>>2]=i;N[a+68>>2]=h;J[a- -64>>2]=0;J[a+60>>2]=d;N[a+56>>2]=j;N[a+52>>2]=k;N[a+44>>2]=h;J[a+40>>2]=1065342730;J[a+36>>2]=d;N[a+32>>2]=f;N[a+28>>2]=k;b=P(J[b+780136>>2]>>2,24);a=b+a|0;N[a+72>>2]=g;N[a+48>>2]=g;N[a+24>>2]=l;N[a+20>>2]=e;J[a+16>>2]=1065342730;J[a+12>>2]=d;N[a+8>>2]=j;N[a+4>>2]=i;N[a>>2]=l;N[a+92>>2]=e;J[a+88>>2]=0;J[a+84>>2]=d;N[a+80>>2]=f;N[a+76>>2]=i;N[a+68>>2]=h;J[a- -64>>2]=0;J[a+60>>2]=d;N[a+56>>2]=f;N[a+52>>2]=k;N[a+44>>2]=h;J[a+40>>2]=1065342730;J[a+36>>2]=d;N[a+32>>2]=j;N[a+28>>2]=k;a=a+b|0;N[a+92>>2]=e;J[a+88>>2]=0;J[a+84>>2]=d;N[a+80>>2]=f;N[a+76>>2]=i;N[a+72>>2]=l;N[a+68>>2]=h;J[a- -64>>2]=0;J[a+60>>2]=d;N[a+56>>2]=f;N[a+52>>2]=k;N[a+48>>2]=l;N[a+44>>2]=h;J[a+40>>2]=1065342730;J[a+36>>2]=d;N[a+32>>2]=j;N[a+28>>2]=k;N[a+24>>2]=g;N[a+20>>2]=e;J[a+16>>2]=1065342730;J[a+12>>2]=d;N[a+8>>2]=j;N[a+4>>2]=i;N[a>>2]=g;a=a+b|0;N[a+92>>2]=e;J[a+88>>2]=0;J[a+84>>2]=d;N[a+80>>2]=j;N[a+76>>2]=i;N[a+72>>2]=g;N[a+68>>2]=h;J[a- -64>>2]=0;J[a+60>>2]=d;N[a+56>>2]=j;N[a+52>>2]=k;N[a+48>>2]=g;N[a+44>>2]=h;J[a+40>>2]=1065342730;J[a+36>>2]=d;N[a+32>>2]=f;N[a+28>>2]=k;N[a+24>>2]=l;N[a+20>>2]=e;J[a+16>>2]=1065342730;J[a+12>>2]=d;N[a+8>>2]=f;N[a+4>>2]=i;N[a>>2]=l;J[c>>2]=m+4}function bB(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;f=$c-44832|0;$c=f;e=f+44740|0;yg(e,f,a);a=Cl(a);a:{if(a){break a}c=f+44800|0;a=Sd(e,c,18);if(a){break a}a=-857812931;if((K[c|0]|K[c+1|0]<<8)!=1874){break a}a=c|2;J[464807]=K[a|0]|K[a+1|0]<<8;a=c|4;J[464809]=K[a|0]|K[a+1|0]<<8;a=c|6;J[464808]=K[a|0]|K[a+1|0]<<8;H[J[263427]+28|0]=7;a=c|8;N[J[263427]>>2]=(K[a|0]|K[a+1|0]<<8)>>>0;a=c|10;N[J[263427]+8>>2]=(K[a|0]|K[a+1|0]<<8)>>>0;a=J[263427];c=c|12;N[a+4>>2]=(K[c|0]|K[c+1|0]<<8)>>>0;N[a+16>>2]=Q(Q(K[f+44814|0])*Q(360))*Q(.00390625);N[a+12>>2]=Q(Q(K[f+44815|0])*Q(360))*Q(.00390625);a=zl(e);if(a){break a}a=J[464804];e=J[464806];if((e&-4)>0){while(1){H[a|0]=K[K[a|0]+33200|0];H[a+1|0]=K[K[a+1|0]+33200|0];H[a+2|0]=K[K[a+2|0]+33200|0];H[a+3|0]=K[K[a+3|0]+33200|0];a=a+4|0;b=b+4|0;e=J[464806];if((b|0)<(e&-4)){continue}break}}if((b|0)<(e|0)){while(1){H[a|0]=K[K[a|0]+33200|0];a=a+1|0;b=b+1|0;if((b|0)<J[464806]){continue}break}}i=f+44740|0;a=bd[J[f+44744>>2]](i,f+44799|0)|0;b:{if((a|0)==-857812991){break b}if(a){break a}if(K[f+44799|0]!=189){break b}a=0;g=$c-4112|0;$c=g;d=J[464808];c:{if((d|0)>0){c=J[464809];q=c&-16;r=d&-16;b=J[464807];s=b&-16;while(1){k=a+16|0;if((c|0)>0){e=0;t=(k|0)>(r|0);while(1){l=e+16|0;if((b|0)>0){c=0;u=(l|0)>(q|0);while(1){b=bd[J[i+4>>2]](i,g+15|0)|0;if(b){break c}if(K[g+15|0]!=1){j=c+16|0}else{b=Sd(i,g+16|0,4096);if(b){break c}d=J[464807];m=P(d,P(J[464809],a)+e|0)+c|0;b=0;j=c+16|0;d:{if(!((j|0)>(s|0)|t|u)){while(1){d=((J[464804]+m|0)+P(J[464807],P(J[464809],b>>>8|0)+(b>>>4&15)|0)|0)+(b&15)|0;c=K[d|0];if((c|0)==163){c=K[(g+16|0)+b|0]}H[d|0]=c;b=b+1|0;if((b|0)!=4096){continue}break d}}while(1){h=b&15;e:{if((h|c)>=(d|0)){break e}n=b>>>8|0;if(J[464808]<=(n|a)){break e}o=J[464809];p=b>>>4&15;if((o|0)<=(p|e)){break e}h=h+((J[464804]+m|0)+P(P(n,o)+p|0,d)|0)|0;d=K[h|0];if((d|0)==163){d=K[(g+16|0)+b|0]}H[h|0]=d;d=J[464807]}b=b+1|0;if((b|0)!=4096){continue}break}}}c=j;b=J[464807];if((c|0)<(b|0)){continue}break}c=J[464809]}e=l;if((c|0)>(e|0)){continue}break}d=J[464808]}a=k;if((d|0)>(a|0)){continue}break}}b=0}$c=g+4112|0;a=b;if((a|0)!=-857812991){break a}pd(8789);pd(1549)}a=0}$c=f+44832|0;return a|0}function $I(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=Q(0),h=0,i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=0,o=0,p=0;e=$c-96|0;$c=e;b=rn(K[a|0]);a:{if(!b|!K[b+138|0]){break a}h=K[b+139|0];if(h>>>0>=K[b+188|0]){break a}o=e,p=ud(a+1|0),J[o+8>>2]=p;o=e,p=ud(a+5|0),J[o+12>>2]=p;o=e,p=ud(a+9|0),J[o+16>>2]=p;o=e,p=ud(a+13|0),J[o+20>>2]=p;o=e,p=ud(a+17|0),J[o+24>>2]=p;o=e,p=ud(a+21|0),J[o+28>>2]=p;n=a+25|0;while(1){f=(e+8|0)+(c<<1)|0;d=(c<<3)+n|0;o=f,p=vd(d),I[o+24>>1]=p;o=f,p=vd(d+2|0),I[o+36>>1]=p;o=f,p=vd(d+4|0),I[o+48>>1]=p;o=f,p=vd(d+6|0),I[o+60>>1]=p;c=c+1|0;if((c|0)!=6){continue}break}o=e,p=ud(a+73|0),J[o+80>>2]=p;o=e,p=ud(a+77|0),J[o+84>>2]=p;o=e,p=ud(a+81|0),J[o+88>>2]=p;d=P(h,104)+b|0;o=d,p=ud(a+85|0),J[o+208>>2]=p;o=d,p=ud(a+89|0),J[o+212>>2]=p;o=d,p=ud(a+93|0),J[o+216>>2]=p;f=0;b:{if(K[53129]==1){H[e+92|0]=K[a+102|0];break b}H[e+92|0]=K[a+165|0];c=a+97|0;d=d+192|0;while(1){a=d+f|0;h=K[c|0];H[a+96|0]=h>>>6;H[a+92|0]=h&63;a=d+(f<<4)|0;o=a,p=ud(c+1|0),J[o+28>>2]=p;o=a,p=ud(c+5|0),J[o+32>>2]=p;o=a,p=ud(c+9|0),J[o+36>>2]=p;o=a,p=ud(c+13|0),J[o+40>>2]=p;c=c+17|0;f=f+1|0;if((f|0)!=4){continue}break}}a=e+8|0;g=N[a+20>>2];i=N[a+16>>2];j=N[a+12>>2];k=N[a+8>>2];l=N[a+4>>2];m=N[a>>2];c=K[b+139|0];J[b+36>>2]=P(c,24);c=P(c,104)+b|0;f=K[a+84|0];d=f&2;H[c+293|0]=d;H[c+292|0]=f&1;if(d){H[b+189|0]=K[b+189|0]+1}ah(b,m,j,g,k,i,L[a+24>>1],L[a+36>>1],L[a+48>>1],L[a+60>>1]);ah(b,j,m,g,k,l,L[a+26>>1],L[a+38>>1],L[a+50>>1],L[a+62>>1]);$g(b,m,j,l,i,k,L[a+28>>1],L[a+40>>1],L[a+52>>1],L[a- -64>>1]);$g(b,j,m,l,i,g,L[a+30>>1],L[a+42>>1],L[a+54>>1],L[a+66>>1]);Qh(b,k,g,l,i,j,L[a+32>>1],L[a+44>>1],L[a+56>>1],L[a+68>>1]);Qh(b,g,k,l,i,m,L[a+34>>1],L[a+46>>1],L[a+58>>1],L[a+70>>1]);g=N[a+80>>2];f=L[b+36>>1];d=J[a+76>>2];a=J[a+72>>2];I[c+194>>1]=24;N[c+204>>2]=g;J[c+196>>2]=a;J[c+200>>2]=d;I[c+192>>1]=f-24;a=K[b+139|0]+1|0;H[b+139|0]=a;if(K[b+188|0]!=(a&255)){break a}if(J[273225]<=1535){Pg(17251);J[273225]=1536;Dd(1092892)}J[b+8>>2]=1531216;J[b+52>>2]=677;J[b+32>>2]=678;J[b+28>>2]=679;J[b+24>>2]=680;J[b+20>>2]=681;J[b+16>>2]=682;J[b+12>>2]=683;J[b>>2]=b+72;J[b+64>>2]=P(K[b+188|0],24);a=J[273230];c:{if(!a){J[273231]=b;break c}J[b+68>>2]=a}J[273230]=b;H[b+137|0]=1}$c=e+96|0}function LD(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0,i=0;d=$c-368|0;$c=d;a:{b:{if((b|0)==95){e=J[a+160>>2];if((e|0)==-1){e=L[a+68>>1]-1|0}if((e|0)<0){break b}g=J[a+64>>2];c=e;while(1){c:{b=c;f=K[b+g|0];if(!((f|0)==46|(f|0)==95|((f-58&255)>>>0>245|((f&223)-91&255)>>>0>=230))){f=b;break c}f=-1;c=b-1|0;if((b|0)>0){continue}}break}if((e|0)<=(f|0)){break b}g=a- -64|0;i=f+1|0;Ke(d+24|0,g,i,e-f|0);ne(41752,257);c=0;J[d+12>>2]=0;b=0;while(1){h=L[(b<<1)+828408>>1];d:{if(!h){break d}$d(d+288|0,829176,h-3|0);h=J[d+292>>2];J[d+16>>2]=J[d+288>>2];J[d+20>>2]=h;if(!Ji(d+16|0,d+24|0)){break d}H[(d+32|0)+c|0]=b;c=c+1|0;J[d+12>>2]=c}b=b+1|0;if((b|0)!=256){continue}break}if((c|0)==1){b=J[a+160>>2];c=((f^-1)+e|0)+((b|0)==-1)|0;if((c|0)>0){b=0;while(1){dg(g,i);b=b+1|0;if((c|0)!=(b|0)){continue}break}b=J[a+160>>2]}if((b|0)!=-1){J[a+160>>2]=b-c}$d(d+288|0,829176,L[(K[d+32|0]<<1)+828408>>1]-3|0);b=J[d+292>>2];J[d+16>>2]=J[d+288>>2];J[d+20>>2]=b;Ih(a,d+16|0);break b}if((c|0)<2){break b}J[d+364>>2]=4194304;J[d+360>>2]=d+288;Hd(d+360|0,28429,d+12|0);e:{if(J[d+12>>2]<=0){break e}b=0;while(1){$d(d,829176,L[(K[(d+32|0)+b|0]<<1)+828408>>1]-3|0);c=J[d+4>>2];a=J[d>>2];J[d+16>>2]=a;J[d+20>>2]=c;if(L[d+364>>1]+(c&65535)>>>0>63){break e}a=d+360|0;ye(a,d+16|0);Ud(a,32);b=b+1|0;if((b|0)<J[d+12>>2]){continue}break}}ne(d+360|0,257);break b}if(J[c+16>>2]==(b|0)){if(K[1056202]|K[1056203]){b=J[a+160>>2];if((b|0)==-1){b=L[a+68>>1]}if((b|0)<64){break b}J[a+160>>2]=b+-64;Rg(a);break b}b=J[204913];if((b|0)==J[a+204>>2]){ke(a+208|0,a- -64|0);b=J[204913]}if(!b){break b}I[a+68>>1]=0;c=J[a+204>>2];b=c-1|0;J[a+204>>2]=b;e=d+32|0;if((c|0)<=0){J[a+204>>2]=0;b=0}$d(e,819644,b);ye(a- -64|0,e);J[a+160>>2]=-1;Ff(a);break b}if(J[c+20>>2]==(b|0)){if(K[1056202]|K[1056203]){b=J[a+160>>2];if((b|0)==-1){break b}b=b- -64|0;J[a+160>>2]=(b|0)>=L[a+68>>1]?-1:b;Rg(a);break b}b=J[204913];if(!b){break b}I[a+68>>1]=0;c=J[a+204>>2]+1|0;J[a+204>>2]=c;e=a- -64|0;f:{if((b|0)<=(c|0)){J[a+204>>2]=b;ye(e,a+208|0);break f}b=d+32|0;$d(b,819644,c);ye(e,b)}J[a+160>>2]=-1;Ff(a);break b}a=yr(a,b,c);break a}a=1}$c=d+368|0;return a|0}function _j(a,b,c,d,e){var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;j=e;e=J[b>>2];j=j+e|0;J[b>>2]=j;a:{if((d|0)>=(e|0)){b=Ye(j,c,1774);Kd(b,J[a>>2],P(c,e));break a}k=J[a>>2];h=gr(j,c);b=0;b:{if(!h){break b}c:{if(!k){d=xh(h);break c}if(h>>>0>=4294967232){J[467445]=48;d=0;break c}f=h>>>0<11?16:h+11&-8;b=0;c=k-8|0;i=J[c+4>>2];d=i&-8;d:{if(!(i&3)){if(f>>>0<256){break d}if(d>>>0>=f+4>>>0){b=c;if(d-f>>>0<=J[467875]<<1>>>0){break d}}b=0;break d}g=c+d|0;e:{if(d>>>0>=f>>>0){b=d-f|0;if(b>>>0<16){break e}J[c+4>>2]=i&1|f|2;d=c+f|0;J[d+4>>2]=b|3;J[g+4>>2]=J[g+4>>2]|1;Mq(d,b);break e}if(J[467761]==(g|0)){d=d+J[467758]|0;if(d>>>0<=f>>>0){break d}J[c+4>>2]=i&1|f|2;b=c+f|0;d=d-f|0;J[b+4>>2]=d|1;J[467758]=d;J[467761]=b;break e}if(J[467760]==(g|0)){d=d+J[467757]|0;if(d>>>0<f>>>0){break d}b=d-f|0;f:{if(b>>>0>=16){J[c+4>>2]=i&1|f|2;e=c+f|0;J[e+4>>2]=b|1;d=c+d|0;J[d>>2]=b;J[d+4>>2]=J[d+4>>2]&-2;break f}J[c+4>>2]=d|i&1|2;b=c+d|0;J[b+4>>2]=J[b+4>>2]|1;b=0;e=0}J[467760]=e;J[467757]=b;break e}e=J[g+4>>2];if(e&2){break d}l=d+(e&-8)|0;if(l>>>0<f>>>0){break d}n=l-f|0;g:{if(e>>>0<=255){b=J[g+12>>2];d=J[g+8>>2];if((b|0)==(d|0)){o=1871020,p=J[467755]&HN(e>>>3|0),J[o>>2]=p;break g}J[d+12>>2]=b;J[b+8>>2]=d;break g}m=J[g+24>>2];d=J[g+12>>2];h:{if((g|0)!=(d|0)){b=J[g+8>>2];J[b+12>>2]=d;J[d+8>>2]=b;break h}i:{b=g+20|0;e=J[b>>2];if(!e){e=J[g+16>>2];if(!e){break i}b=g+16|0}while(1){j=b;d=e;b=d+20|0;e=J[b>>2];if(e){continue}b=d+16|0;e=J[d+16>>2];if(e){continue}break}J[j>>2]=0;break h}d=0}if(!m){break g}b=J[g+28>>2];e=(b<<2)+1871324|0;j:{if(J[e>>2]==(g|0)){J[e>>2]=d;if(d){break j}o=1871024,p=J[467756]&HN(b),J[o>>2]=p;break g}J[(J[m+16>>2]==(g|0)?16:20)+m>>2]=d;if(!d){break g}}J[d+24>>2]=m;b=J[g+16>>2];if(b){J[d+16>>2]=b;J[b+24>>2]=d}b=J[g+20>>2];if(!b){break g}J[d+20>>2]=b;J[b+24>>2]=d}if(n>>>0<=15){J[c+4>>2]=i&1|l|2;b=c+l|0;J[b+4>>2]=J[b+4>>2]|1;break e}J[c+4>>2]=i&1|f|2;b=c+f|0;J[b+4>>2]=n|3;d=c+l|0;J[d+4>>2]=J[d+4>>2]|1;Mq(b,n)}b=c}d=b+8|0;if(b){break c}c=xh(h);d=0;if(!c){break c}b=J[k-4>>2];b=(b&3?-4:-8)+(b&-8)|0;Qd(c,k,b>>>0<h>>>0?b:h);Fj(k);d=c}b=d}if(!b){gm(1759)}}J[a>>2]=b}function yr(a,b,c){var d=0,e=0,f=0,g=0;f=$c-2064|0;$c=f;a:{b:{c:{if(J[c+24>>2]==(b|0)){if(K[1056202]|K[1056203]){b=J[a+160>>2];if((b|0)==-1){b=L[a+68>>1]-1|0;J[a+160>>2]=b}b=vs(a- -64|0,b);J[a+160>>2]=J[a+160>>2]-b;break c}b=L[a+68>>1];if(!b){break b}c=b;b=J[a+160>>2];b=(b|0)==-1?c:b;J[a+160>>2]=(b|0)>0?b-1|0:0;break c}if(J[c+28>>2]==(b|0)){if(K[1056202]|K[1056203]){c=J[a+160>>2];if((c|0)==-1){b=0}else{d:{e:{e=a- -64|0;d=L[e+4>>1];if((c|0)>=(d|0)){Yd(12024);b=c;break e}g=J[e>>2];b=c;while(1){if(K[b+g|0]==32){break e}b=b+1|0;if((d|0)!=(b|0)){continue}break}break d}f:{if((b|0)>=(d|0)){break f}e=J[e>>2];while(1){if(K[b+e|0]!=32){break f}b=b+1|0;if((d|0)!=(b|0)){continue}break}break d}d=b}b=d-c|0}b=b+J[a+160>>2]|0;J[a+160>>2]=(b|0)>=L[a+68>>1]?-1:b;break c}c=1;b=L[a+68>>1];if(!b){break a}d=J[a+160>>2];if((d|0)==-1){break a}d=d+1|0;J[a+160>>2]=(b|0)<=(d|0)?-1:d;Rg(a);break a}g:{h:{switch(b-59|0){default:if((b|0)!=94){break g}i:{if(K[1056202]|K[1056203]){b=J[a+160>>2];if((b|0)==-1){b=L[a+68>>1]-1|0;J[a+160>>2]=b}d=a- -64|0;e=vs(d,b);if(!e){break b}b=0;c=J[a+160>>2]-e|0;c=(c|0)>0?c:0;J[a+160>>2]=c;if((e|0)>=0){while(1){dg(d,J[a+160>>2]);c=(b|0)!=(e|0);b=b+1|0;if(c){continue}break}c=J[a+160>>2]}j:{k:{b=L[a+68>>1];l:{if((c|0)>=(b|0)){J[a+160>>2]=-1;break l}if((c|0)!=-1){break k}}if(b){break j}break i}if((c|0)<0){break i}b=c;if(K[b+J[d>>2]|0]==32){break i}}dk(d,b,32);break i}c=1;if(!L[a+68>>1]|!J[a+160>>2]){break a}Or(a)}Ff(a);break b;case 0:c=1;if(!L[a+68>>1]){break a}b=J[a+160>>2];if((b|0)==-1){break a}dg(a- -64|0,b);if(J[a+160>>2]>=L[a+68>>1]){J[a+160>>2]=-1}Ff(a);break a;case 1:c=1;if(!L[a+68>>1]){break a}J[a+160>>2]=0;Rg(a);break a;case 2:break h}}J[a+160>>2]=-1;break c}c=0;d=bd[J[a+44>>2]]()|0;m:{switch(b-1001|0){case 1:if(L[a+68>>1]>=d<<6){break a}J[f+2060>>2]=134217728;J[f+2056>>2]=f;b=f+2056|0;Tc();if(!(!K[1055388]|!(H[1869768]&1))){I[934882]=0}ke(b,1869760);I[934882]=0;Ih(a,b);break b;case 0:break m;default:break a}}c=1;if(!L[a+68>>1]){break a}b=$c-608|0;$c=b;Rf(b,a- -64|0);Sc(b|0);$c=b+608|0;break a}Rg(a)}c=1}$c=f+2064|0;return c}function cB(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0;e=$c-44816|0;$c=e;b=e+44752|0;yg(b,e+12|0,a);a=Cl(a);a:{if(a){break a}a=b;b=e+44811|0;a=Sd(a,b,5);if(a){break a}b=ud(b);if((b|0)!=656127880){a=-857812930;if((b|0)!=16843009){break a}J[464859]=-13185;J[464860]=-13185;J[464851]=-3e4;J[464808]=64;J[464809]=256;J[464806]=4194304;J[464807]=256;J[263427]=0;J[464848]=0;a=wf(4194304,1);J[464804]=a;if(!a){a=-857812988;break a}je(a,1,5);a=Sd(e+44752|0,J[464804]+5|0,4194299);break a}a=-857812929;b:{switch(K[e+44815|0]-1|0){case 0:b=$c-112|0;$c=b;J[464859]=-13185;J[464860]=-13185;J[464851]=-3e4;J[263427]=0;c=e+44752|0;a=li(c,b- -64|0);c:{if(a){break c}a=li(c,b+16|0);if(a){break c}a=Sd(c,b+2|0,14);if(a){break c}g=1859228,h=vd(b+10|0),J[g>>2]=h;g=1859236,h=vd(b+12|0),J[g>>2]=h;g=1859232,h=vd(b+14|0),J[g>>2]=h;a=zl(c)}$c=b+112|0;break a;case 1:break b;default:break a}}b=$c-70528|0;$c=b;c=e+44752|0;f=b+76|0;a=Sd(c,f,4);d:{if(a){break d}J[263434]=8257536;J[263433]=0;J[263432]=b+80;a=-857812928;if((vd(f)|0)!=44269){break d}a=-857812927;if((vd(b+78|0)|0)!=5){break d}f=b+24|0;a=bd[J[c+4>>2]](c,f)|0;if(a){break d}a=ki(c,f);if(a){break d}a=-857812926;if(K[b+24|0]!=115){break d}c=0;f=J[b+28>>2];if(J[f+52>>2]<=0){a=0;break d}while(1){a=f+P(c,60)|0;Ee(b+8|0,a+57|0,48);d=J[b+12>>2];J[b+16>>2]=J[b+8>>2];J[b+20>>2]=d;e:{if(ld(b+16|0,11211)){if(K[a+56|0]!=73){Yd(20939)}J[464807]=J[a+108>>2];break e}if(ld(b+16|0,3415)){if(K[a+56|0]!=73){Yd(20939)}J[464809]=J[a+108>>2];break e}if(ld(b+16|0,11177)){if(K[a+56|0]!=73){Yd(20939)}J[464808]=J[a+108>>2];break e}if(ld(b+16|0,5242)){if(K[a+56|0]!=91){Yd(1799)}J[464804]=J[a+108>>2];J[464806]=J[a+112>>2];break e}if(ld(b+16|0,8687)){if(K[a+56|0]!=73){Yd(20939)}a=J[a+108>>2];d=J[263427];H[d+28|0]=1;N[d>>2]=a|0;break e}if(ld(b+16|0,8680)){if(K[a+56|0]!=73){Yd(20939)}a=J[a+108>>2];d=J[263427];H[d+28|0]=1;N[d+4>>2]=a|0;break e}if(!ld(b+16|0,8673)){break e}if(K[a+56|0]!=73){Yd(20939)}a=J[a+108>>2];d=J[263427];H[d+28|0]=1;N[d+8>>2]=a|0}a=0;c=c+1|0;if((c|0)<J[f+52>>2]){continue}break}}$c=b+70528|0}$c=e+44816|0;return a|0}function El(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;d=$c-16|0;$c=d;if(J[263403]>0){while(1){c=lt(1053596);h=J[c+8>>2];e=J[c+12>>2];J[d+8>>2]=h;J[d+12>>2]=e;e=J[c+4>>2];c=J[c>>2];J[d>>2]=c;J[d+4>>2]=e;e=J[d+4>>2];g=ff(c,e,h,a);f=K[d+12|0];a:{if(g>>>0>=f>>>0){break a}qg(f,c,e,h,a,b);f=J[464804];j=J[d+8>>2];g=J[d+4>>2];k=P(J[464807],j+P(g,J[464809])|0);e=J[d>>2];c=k+e|0;h=K[f+c|0];l=J[464805];c=K[c+l|0];i=K[d+12|0]-1|0;H[d+12|0]=i;i=i&255;if(!i){break a}m=J[464818];h=m&(h|c<<8);c=e-1|0;J[d>>2]=c;b:{if((e|0)<=0){break b}if(!Ld(h,1)){break b}e=c+k|0;if(!Ld((K[e+l|0]<<8|K[e+f|0])&m,0)){break b}if(ff(c,g,j,a)>>>0>=i>>>0){break b}ze(1053596,d);c=J[d>>2]}c=c+2|0;J[d>>2]=c;c:{if(J[464810]<(c|0)){break c}if(!Ld(h,0)){break c}f=J[d+8>>2];e=J[d+4>>2];g=P(J[464807],f+P(e,J[464809])|0)+c|0;if(!Ld(J[464818]&(K[g+J[464805]|0]<<8|K[g+J[464804]|0]),1)){break c}if(ff(c,e,f,a)>>>0>=K[d+12|0]){break c}ze(1053596,d);c=J[d>>2]}e=c-1|0;J[d>>2]=e;f=J[d+4>>2];c=f-1|0;J[d+4>>2]=c;d:{if((f|0)<=0){break d}if(!Ld(h,5)){break d}f=J[d+8>>2];g=e+P(J[464807],f+P(J[464809],c)|0)|0;if(!Ld(J[464818]&(K[g+J[464805]|0]<<8|K[g+J[464804]|0]),4)){break d}if(ff(e,c,f,a)>>>0>=K[d+12|0]){break d}ze(1053596,d);c=J[d+4>>2]}c=c+2|0;J[d+4>>2]=c;e:{if(J[464811]<(c|0)){break e}if(!Ld(h,4)){break e}f=J[d>>2];e=J[d+8>>2];g=f+P(J[464807],e+P(J[464809],c)|0)|0;if(!Ld(J[464818]&(K[g+J[464805]|0]<<8|K[g+J[464804]|0]),5)){break e}if(ff(f,c,e,a)>>>0>=K[d+12|0]){break e}ze(1053596,d);c=J[d+4>>2]}e=c-1|0;J[d+4>>2]=e;f=J[d+8>>2];c=f-1|0;J[d+8>>2]=c;f:{if((f|0)<=0){break f}if(!Ld(h,3)){break f}f=J[d>>2];g=f+P(J[464807],P(e,J[464809])+c|0)|0;if(!Ld(J[464818]&(K[g+J[464805]|0]<<8|K[g+J[464804]|0]),2)){break f}if(ff(f,e,c,a)>>>0>=K[d+12|0]){break f}ze(1053596,d);c=J[d+8>>2]}c=c+2|0;J[d+8>>2]=c;if((c|0)>J[464812]){break a}if(!Ld(h,2)){break a}e=J[d>>2];h=J[d+4>>2];f=e+P(J[464807],c+P(h,J[464809])|0)|0;if(!Ld(J[464818]&(K[f+J[464805]|0]<<8|K[f+J[464804]|0]),3)){break a}if(ff(e,h,c,a)>>>0>=K[d+12|0]){break a}ze(1053596,d)}if(J[263403]>0){continue}break}}$c=d+16|0}function Rk(a,b,c,d){var e=0,f=0,g=0,h=0,i=Q(0),j=Q(0),k=0,l=0,m=Q(0),n=Q(0);h=$c-32|0;$c=h;e=K[a+80720|0];a:{if((e|0)==4){break a}N[266944]=d;N[266943]=c;if((e|0)==5){Gi(h+12|0,L[P(a,12)+122198>>1],h+28|0);e=J[266942];J[266942]=e+4;J[e>>2]=J[h+28>>2];if(K[a+83024|0]){a=sd(-1,J[(a<<2)+69200>>2])}else{a=-1}f=Ig(Q((K[1054197]?Q(.699999988079071):Q(.8799999952316284))*b));c=N[266943];d=N[266944];e=J[266940];J[e+12>>2]=a;J[e+8>>2]=0;b=Q(f|0);i=Q(d-b);N[e+4>>2]=i;m=Q(c-b);N[e>>2]=m;n=N[h+12>>2];N[e+16>>2]=n;j=N[h+16>>2];J[e+36>>2]=a;J[e+32>>2]=0;N[e+28>>2]=i;c=Q(c+b);N[e+24>>2]=c;N[e+20>>2]=j;i=N[h+20>>2];N[e- -64>>2]=i;J[e+60>>2]=a;J[e+56>>2]=0;b=Q(d+b);N[e+52>>2]=b;N[e+48>>2]=c;N[e+44>>2]=j;N[e+40>>2]=i;c=N[h+24>>2];N[e+92>>2]=c;N[e+88>>2]=n;J[e+84>>2]=a;J[e+80>>2]=0;N[e+76>>2]=b;N[e+72>>2]=m;N[e+68>>2]=c;J[266940]=e+96;break a}e=P(a,12)+66896|0;f=e+18432|0;g=J[f+4>>2];J[206316]=J[f>>2];J[206317]=g;k=e+18440|0;J[206318]=J[k>>2];N[206317]=Q(1)-N[206317];g=e+27648|0;l=J[g+4>>2];J[206319]=J[g>>2];J[206320]=l;l=e+27656|0;J[206321]=J[l>>2];N[206320]=Q(1)-N[206320];c=N[f>>2];d=N[k>>2];j=N[l>>2];i=N[e+18436>>2];m=N[e+27652>>2];b=Q(b/Q(1.4142135381698608));n=N[g>>2];N[206325]=b*Q(Q(1)-Q(n+n));N[206326]=b*Q(Q(1)-Q(m+m));N[206323]=b*Q(Q(1)-Q(i+i));N[206327]=b*Q(Q(1)-Q(j+j));N[206324]=b*Q(Q(1)-Q(d+d));N[206322]=b*Q(Q(1)-Q(c+c));f=a+66896|0;H[825256]=K[f+16128|0];J[206315]=J[(a<<2)+69200>>2];f=K[f+1536|0];g=L[e+55298>>1];a=J[266940];k=J[266942];J[266942]=k+4;l=J[266946];J[k>>2]=g>>>J[458159];mm(1,f?-1:l,g,1067760);g=L[e+55300>>1];k=J[266942];J[266942]=k+4;l=J[266947];J[k>>2]=g>>>J[458159];im(1,f?-1:l,g,1067760);e=L[e+55306>>1];f=J[266942];J[266942]=f+4;J[f>>2]=e>>>J[458159];em(1,-1,e,1067760);e=J[266940];if(e>>>0<=a>>>0){break a}b=N[266944];c=N[266943];while(1){d=N[a>>2];j=N[a+8>>2];N[a>>2]=c+Q(Q(d*Q(.7071067690849304))+Q(j*Q(.7071067690849304)));N[a+4>>2]=b+Q(Q(Q(j*Q(.5))*Q(.7071067690849304))+Q(Q(Q(d*Q(.5))*Q(-.7071067690849304))+Q(N[a+4>>2]*Q(.8660253882408142))));a=a+24|0;if(e>>>0>a>>>0){continue}break}}$c=h+32|0}function _A(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;b=a;while(1){d=c;c=c+1|0;b=J[b>>2];if(b){continue}break}a:{b:{switch(d-2|0){case 0:b=J[a>>2]+8|0;if(ld(b,8263)){b=a+8|0;if(ld(b,11211)){c:{d:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break c;case 0:a=K[a+20|0];break c;default:break d}}J[a+220>>2]=-857812895;a=0}J[464807]=a;return}if(ld(b,3415)){e:{f:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break e;case 0:a=K[a+20|0];break e;default:break f}}J[a+220>>2]=-857812895;a=0}J[464808]=a;return}if(ld(b,11197)){g:{h:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break g;case 0:a=K[a+20|0];break g;default:break h}}J[a+220>>2]=-857812895;a=0}J[464809]=a;return}if(!ld(b,5242)){break a}J[464806]=J[a+16>>2];e=1859216,f=Al(a,5209),J[e>>2]=f;return}if(!ld(b,2972)){break a}b=a+8|0;if(ld(b,6889)){e=1859436,f=vl(a),J[e>>2]=f;return}if(ld(b,6898)){e=1859440,f=vl(a),J[e>>2]=f;return}if(ld(b,6907)){e=1859444,f=vl(a),J[e>>2]=f;return}if(ld(b,3469)){i:{j:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break i;case 0:a=K[a+20|0];break i;default:break j}}J[a+220>>2]=-857812895;a=0}J[464851]=a;return}if(ld(b,13690)){k:{if(K[a+4|0]!=1){J[a+220>>2]=-857812896;a=0;break k}a=K[a+20|0];a=(a|0)==2?3:a}I[929697]=a&255;return}if(ld(b,13631)){if(K[a+4|0]==1){a=K[a+20|0]}else{J[a+220>>2]=-857812896;a=0}I[929696]=a;return}if(ld(b,3481)){l:{m:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break l;case 0:a=K[a+20|0];break l;default:break m}}J[a+220>>2]=-857812895;a=0}J[263436]=a;return}if(!ld(b,3435)){break a}n:{o:{switch(K[a+4|0]-1|0){case 1:a=L[a+20>>1];break n;case 0:a=K[a+20|0];break n;default:break o}}J[a+220>>2]=-857812895;a=0}J[263435]=a;return;case 1:break b;default:break a}}b=J[a>>2];if(!ld(J[b>>2]+8|0,8263)){break a}if(!ld(b+8|0,8667)){break a}p:{q:{switch(K[a+4|0]-1|0){case 1:b=L[a+20>>1];break p;case 0:b=K[a+20|0];break p;default:break q}}J[a+220>>2]=-857812895;b=0}c=J[263427];H[c+28|0]=1;r:{switch(J[a+224>>2]){case 0:N[c>>2]=b<<16>>16;return;case 1:N[c+4>>2]=Q(b<<16>>16)+Q(-1);return;case 2:break r;default:break a}}N[c+8>>2]=b<<16>>16}}function iG(a,b){a=a|0;b=b|0;var c=0,d=0;b=$c-48|0;$c=b;a:{if(ld(a,5924)){pd(19590);pd(10209);pd(10098);pd(10154);pd(13242);pd(10294);pd(10249);pd(10037);pd(5874);break a}if(ld(a,20980)){pd(19685);pd(10343);pd(10395);pd(3150);pd(3269);break a}if((Ag(a,32,b+16|0,3)|0)<=2){pd(27461);break a}c=b+16|0;a=sj(c);if((a|0)==-1){Od(19037,c);break a}c=b+32|0;b:{d=b+16|8;c:{if(ld(d,13960)){tl(a&65535,c);break c}if(ld(d,9657)){if(!Ze(c,13300,b+4|0,0,511)){break a}Ll(L[b+4>>1],a&65535);c=P(a,12)+66896|0;d=L[b+4>>1];I[c+55304>>1]=d;I[c+55306>>1]=d;break c}if(ld(d,6039)){if(!Ze(c,13300,b+4|0,0,511)){break a}Ll(L[b+4>>1],a&65535);break c}if(ld(d,3631)){if(!Ze(c,13300,b+4|0,0,511)){break a}I[P(a,12)+122192>>1]=J[b+4>>2];break c}if(ld(d,3242)){if(!Ze(c,13300,b+4|0,0,511)){break a}I[P(a,12)+122194>>1]=J[b+4>>2];break c}if(ld(d,9364)){if(!Ze(c,13300,b+4|0,0,511)){break a}I[P(a,12)+122200>>1]=J[b+4>>2];break c}if(ld(d,7815)){if(!Ze(c,13300,b+4|0,0,511)){break a}I[P(a,12)+122202>>1]=J[b+4>>2];break c}if(ld(d,2814)){if(!Ze(c,13300,b+4|0,0,511)){break a}I[P(a,12)+122196>>1]=J[b+4>>2];break c}if(ld(d,10853)){if(!Ze(c,13300,b+4|0,0,511)){break a}I[P(a,12)+122198>>1]=J[b+4>>2];break c}if(ld(d,14832)){if(!Ze(c,14682,b+4|0,0,7)){break a}H[a+75344|0]=J[b+4>>2];break c}if(ld(d,14535)){if(!Ze(c,14571,b+4|0,0,5)){break a}H[a+80720|0]=J[b+4>>2];break c}if(ld(d,9081)){if(!ms(c,b+4|0)){break a}c=P(a,12)+66896|0;J[c+18440>>2]=J[b+12>>2];d=J[b+8>>2];c=c+18432|0;J[c>>2]=J[b+4>>2];J[c+4>>2]=d;break c}if(ld(d,1887)){if(!ms(c,b+4|0)){break a}c=P(a,12)+66896|0;J[c+27656>>2]=J[b+12>>2];d=J[b+8>>2];c=c+27648|0;J[c>>2]=J[b+4>>2];J[c+4>>2]=d;break c}if(ld(d,15244)){if(!Ze(c,15269,b+4|0,0,9)){break a}H[a+82256|0]=J[b+4>>2];break c}if(ld(d,15254)){if(!Ze(c,15269,b+4|0,0,9)){break a}H[a+81488|0]=J[b+4>>2];break c}if(ld(d,3215)){if(!is(c,4404,b+4|0)){break a}H[a+68432|0]=K[b+4|0];break c}if(!ld(d,3248)){break b}if(!is(c,3324,b+4|0)){break a}H[a+67664|0]=K[b+4|0]}zj(a&65535,0);break a}Od(27391,d)}$c=b+48|0}function vv(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=Q(0),p=Q(0),q=Q(0),r=Q(0),s=Q(0),t=Q(0),u=Q(0),v=0;i=L[390030];k=K[i+80720|0];if((k|0)==5){Dk(b,c,d);return}j=J[195009]+a|0;a=K[j+5|0];e=K[j+1|0];g=K[j|0];m=K[j+3|0];n=K[j+2|0];j=K[j+4|0];a:{if(!(e|g|(m|n)|j|a)){break a}f=P(i,12)+66896|0;h=f+18432|0;l=J[h+4>>2];J[206316]=J[h>>2];J[206317]=l;J[206318]=J[f+18440>>2];N[206317]=Q(1)-N[206317];h=f+27648|0;l=J[h+4>>2];J[206319]=J[h>>2];J[206320]=l;J[206321]=J[f+27656>>2];N[206320]=Q(1)-N[206320];s=N[f+36864>>2];t=N[f+36868>>2];u=N[f+36872>>2];o=N[f+46080>>2];p=N[f+46084>>2];r=Q(d|0);N[206327]=N[f+46088>>2]+r;q=p;p=Q(c|0);N[206326]=q+p;q=o;o=Q(b|0);N[206325]=q+o;N[206324]=u+r;N[206323]=t+p;N[206322]=s+o;h=i+66896|0;H[825256]=K[h+16128|0];J[206315]=J[(i<<2)+69200>>2];i=((k|0)==3)<<9;k=K[h+13056|0];h=K[h+1536|0];if(g){l=L[f+55296>>1];v=(i+(l>>>J[458159]|0)<<5)+780112|0;f=-1;b:{if(h){break b}f=k&1;if((f|0)<=(b|0)){f=bd[J[266964]](b-f|0,c,d)|0;break b}f=J[464864]}or(g,f,l,v)}if(e){f=L[P(L[390030],12)+122194>>1];l=i+(f>>>J[458159]|0)|0;g=-1;c:{if(h){break c}g=k>>>1&1;if((J[464810]-g|0)>=(b|0)){g=bd[J[266964]](b+g|0,c,d)|0;break c}g=J[464864]}mm(e,g,f,(l<<5)+780116|0)}if(n){g=L[P(L[390030],12)+122196>>1];f=i+(g>>>J[458159]|0)|0;e=-1;d:{if(h){break d}e=k>>>2&1;if((e|0)<=(d|0)){e=bd[J[266965]](b,c,d-e|0)|0;break d}e=J[464865]}im(n,e,g,(f<<5)+780120|0)}if(m){g=L[P(L[390030],12)+122198>>1];n=i+(g>>>J[458159]|0)|0;e=-1;e:{if(h){break e}e=k>>>3&1;if((J[464812]-e|0)>=(d|0)){e=bd[J[266965]](b,c,d+e|0)|0;break e}e=J[464865]}hr(m,e,g,(n<<5)+780124|0)}if(j){g=L[P(L[390030],12)+122200>>1];m=i+(g>>>J[458159]|0)|0;if(h){e=-1}else{e=bd[J[266963]](b,(k<<27>>31)+c|0,d)|0}fr(j,e,g,(m<<5)+780128|0)}if(!a){break a}e=L[P(L[390030],12)+122202>>1];g=(e>>>J[458159]|0)+i|0;if(h){b=-1}else{b=bd[J[266962]](b,(k>>>5&1)+c|0,d)|0}em(a,b,e,(g<<5)+780132|0)}}function vC(){var a=Q(0),b=0,c=0,d=0,e=0,f=0,g=0,h=Q(0);nd(1043196,0,114);c=828400,d=(e=1,f=pk(14544,1,32304,5),g=K[1054197],g?e:f),H[c|0]=d;b=pk(2016,0,32336,4);J[208618]=1065353216;J[208616]=1065353216;J[208617]=1065353216;J[208701]=1065353216;J[208626]=1065353216;J[208627]=1065353216;H[834438]=2;H[834644]=0;H[834580]=0;J[208622]=0;H[828401]=K[1054197]?0:b;vh(834384,32352);Ml(834384);Vf(834644,64,49716);Vl(834384,49716);nd(1043976,834384,115);J[208774]=834384;je(834844,0,180);H[834858]=1;H[834859]=1;H[834860]=1;H[834861]=1;H[834855]=1;H[834856]=1;H[834857]=1;H[834858]=1;H[834854]=1;J[208712]=1092616192;J[208721]=1065353216;I[417431]=257;H[834844]=1;H[834876]=1;J[208717]=1065353216;J[208718]=1;J[208723]=8388608;J[208722]=834896;H[834864]=1;je(835112,0,60);J[208792]=1058642330;J[208790]=1058642330;J[208791]=1065353216;J[208788]=1065017672;J[208789]=1063843267;J[208786]=1034147594;J[208787]=1063843267;J[208783]=1054280253;J[208781]=1054280253;J[208782]=1054280253;J[208780]=834384;H[835113]=1;J[208756]=1065353216;J[208757]=1065353216;J[208785]=835096;J[208784]=834844;J[208710]=1084227584;H[835176]=0;J[208596]=32404;H[834438]=K[834438]|1;a:{if(!(K[1054198]|!K[1054197])){H[834854]=0;break a}c=834854,d=(Id(16448,1)|0)!=0,H[c|0]=d;if(K[1054197]){break a}c=834848,h=Wf(7389,Q(.10000000149011612),Q(50),Q(10)),N[c>>2]=h;c=834852,d=Id(12377,0),H[c|0]=d;c=834876,d=Id(14801,0),H[c|0]=d;c=834877,d=Id(5300,0),H[c|0]=d;c=834853,d=Id(7999,0),H[c|0]=d;a=Wf(1270,Q(0),Q(52),Q(.41999998688697815));N[208781]=a;N[208782]=a;c=834368,d=Id(5352,1),H[c|0]=d}J[207101]=834384;J[207099]=834384;J[266422]=116;J[266414]=117;J[266413]=118;J[266421]=119;J[266433]=120;J[266412]=121;J[266420]=122;J[266485]=123;J[266472]=124;J[266424]=125;J[266423]=126;J[266476]=127;J[266475]=128;J[266473]=129;J[266464]=130;J[263494]=131;J[263493]=1028443341;ji(1053968)}function wq(a){var b=0,c=0,d=0,e=Q(0),f=0,g=Q(0),h=0,i=0;c=$c+-64|0;$c=c;J[c+56>>2]=J[a+12>>2];b=J[a+8>>2];J[c+48>>2]=J[a+4>>2];J[c+52>>2]=b;g=Q(bd[J[J[a+48>>2]+24>>2]](a));N[c+52>>2]=N[c+52>>2]+Q(g*N[a+84>>2]);Wj(c+36|0,Q(N[a+20>>2]*Q(.01745329238474369)),Q(N[a+16>>2]*Q(.01745329238474369)));b=J[207101];i=-1;g=Q(-200);a=0;while(1){d=J[(a<<2)+827376>>2];a:{if(!d|(b|0)==(d|0)){break a}J[c+24>>2]=J[c+56>>2];J[c+8>>2]=J[c+44>>2];b=J[c+52>>2];J[c+16>>2]=J[c+48>>2];J[c+20>>2]=b;b=J[c+40>>2];J[c>>2]=J[c+36>>2];J[c+4>>2]=b;b=$c-144|0;$c=b;N[b+128>>2]=N[c+16>>2]-N[d+4>>2];N[b+132>>2]=N[c+20>>2]-N[d+8>>2];N[b+136>>2]=N[c+24>>2]-N[d+12>>2];J[b+88>>2]=J[b+136>>2];f=J[b+132>>2];J[b+80>>2]=J[b+128>>2];J[b+84>>2]=f;f=b+92|0;zt(f,b+80|0,d);J[b+136>>2]=J[b+100>>2];h=J[b+96>>2];J[b+128>>2]=J[b+92>>2];J[b+132>>2]=h;N[c+16>>2]=N[b+128>>2]+N[d+4>>2];N[c+20>>2]=N[b+132>>2]+N[d+8>>2];N[c+24>>2]=N[b+136>>2]+N[d+12>>2];J[b+72>>2]=J[c+8>>2];h=J[c+4>>2];J[b+64>>2]=J[c>>2];J[b+68>>2]=h;zt(f,b- -64|0,d);J[c+8>>2]=J[b+100>>2];h=J[b+96>>2];J[c>>2]=J[b+92>>2];J[c+4>>2]=h;Bq(d,f);e=N[c>>2];N[b+116>>2]=Q(R(e))<Q(9.999999974752427e-7)?Q(1e9):Q(Q(1)/e);e=N[c+4>>2];N[b+120>>2]=Q(R(e))<Q(9.999999974752427e-7)?Q(1e9):Q(Q(1)/e);e=N[c+8>>2];N[b+124>>2]=Q(R(e))<Q(9.999999974752427e-7)?Q(1e9):Q(Q(1)/e);J[b+56>>2]=J[c+24>>2];d=J[c+20>>2];f=J[c+16>>2];J[b+40>>2]=J[b+124>>2];J[b+24>>2]=J[b+100>>2];J[b+48>>2]=f;J[b+52>>2]=d;d=J[b+120>>2];J[b+32>>2]=J[b+116>>2];J[b+36>>2]=d;d=J[b+96>>2];J[b+16>>2]=J[b+92>>2];J[b+20>>2]=d;J[b+8>>2]=J[b+112>>2];d=J[b+108>>2];J[b>>2]=J[b+104>>2];J[b+4>>2]=d;d=nk(b+48|0,b+32|0,b+16|0,b,c+32|0,c+28|0);$c=b+144|0;b=J[207101];if(!d){break a}e=N[c+32>>2];d=(i|0)<0|e<g;g=d?e:g;i=d?a:i}a=a+1|0;if((a|0)!=256){continue}break}$c=c- -64|0;return i}function Kq(a,b,c,d,e){var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;h=$c-1792|0;$c=h;k=J[206431];n=L[b+4>>1];g=J[b+8>>2];l=L[g+4>>1];if(e){k=K[825313]?-16777216:k>>>2&4144959|k&-16777216}if(n){q=J[b>>2];while(1){a:{b:{o=K[f+q|0];if((o|0)!=38){break b}i=f+1|0;if((i|0)>=(n|0)){break b}g=J[(K[i+q|0]<<2)+825316>>2];if(g>>>0<16777216){break b}if(!e){f=i;k=g;break a}k=K[825313]?-16777216:g>>>2&4144959|g&-16777216;f=i;break a}H[(h+1536|0)+j|0]=o;J[(h+512|0)+(j<<2)>>2]=k;A=(j<<1)+h|0,B=Ge(P(J[(o<<2)+826352>>2],l),J[12318]),I[A>>1]=B;j=j+1|0}f=f+1|0;if((n|0)>(f|0)){continue}break}g=J[b+8>>2]}u=((J[g+8>>2]-l|0)/2|0)+d|0;v=Ge(l,8);if(l){w=J[206586];x=J[206585];t=J[12318];y=(j|0)<=0;while(1){d=r+u|0;if(!(y|d>>>0>=M[a+8>>2])){z=(P(t,r)|0)/(l|0)|0;n=J[a>>2]+(P(d,J[a+4>>2])<<2)|0;m=0;d=c;while(1){s=L[(m<<1)+h>>1];if(s){e=K[(h+1536|0)+m|0];q=J[(e<<2)+826352>>2];o=((P(P(e>>>4|0,t)+z|0,w)<<2)+x|0)+(P(e&15,t)<<2)|0;e=J[(h+512|0)+(m<<2)>>2];k=e&255;g=e>>>16&255;i=e>>>8&255;f=0;while(1){p=J[o+((P(f,q)|0)/(s|0)<<2)>>2];c:{if(p>>>0<16777216){break c}e=d+f|0;if(e>>>0>=M[a+4>>2]){break c}J[n+(e<<2)>>2]=(P(g,p>>>16&255)>>>0)/255<<16&16711680|((P(i,p>>>8&255)>>>0)/255<<8&65280|((P(k,p&255)>>>0)/255|p&-16777216))}f=f+1|0;if((s|0)!=(f|0)){continue}break}}d=(d+v|0)+s|0;m=m+1|0;if((m|0)!=(j|0)){continue}break}}r=r+1|0;if((r|0)!=(l|0)){continue}break}}d:{if(!(K[J[b+8>>2]+6|0]&2)|(j|0)<=0){break d}b=P(l,7)>>>3|0;e=l-b|0;d=b+u|0;f=0;while(1){b=f+1|0;b=(b|0)<(j|0)?j:b;i=J[(h+512|0)+(f<<2)>>2];g=0;e:{while(1){if((i|0)!=J[(h+512|0)+(f<<2)>>2]){break e}g=L[(f<<1)+h>>1]+(g+v|0)|0;f=f+1|0;if((b|0)!=(f|0)){continue}break}Fq(a,c,d,g,e,i);break d}Fq(a,c,d,g,e,i);c=c+g|0;if((f|0)<(j|0)){continue}break}}$c=h+1792|0}function OH(a){a=a|0;var b=Q(0),c=0,d=0,e=0,f=Q(0),g=Q(0),h=0,i=0,j=0;J[a+28>>2]=2;J[a+20>>2]=0;J[a+16>>2]=a+2840;pe(a,a+2764|0);e=a+48|0;b=Q(Wf(14176,Q(0),Q(10),Q(1))*Q(22));a:{if(Q(R(b))<Q(2147483648)){d=~~b;break a}d=-2147483648}Kf(e);J[e+56>>2]=-1e3;J[e>>2]=44728;c=e+1628|0;Kf(c);J[c>>2]=44616;f=N[467293];b=Q(f+f);b:{if(Q(R(b))<Q(2147483648)){h=~~b;break b}h=-2147483648}J[c+68>>2]=h;b=Q(f*Q(d|0));c:{if(Q(R(b))<Q(2147483648)){d=~~b;break c}d=-2147483648}J[c+12>>2]=d;g=N[467294];b=Q(f*Q(3));d:{if(Q(R(b))<Q(2147483648)){d=~~b;break d}d=-2147483648}J[c+76>>2]=d;J[c+40>>2]=0;J[c+44>>2]=0;J[c+48>>2]=0;J[c+52>>2]=0;J[c+56>>2]=0;J[c+60>>2]=0;b=Q(g*Q(3));e:{if(Q(R(b))<Q(2147483648)){d=~~b;break e}d=-2147483648}J[c+88>>2]=d;b=Q(-g);f:{if(Q(R(b))<Q(2147483648)){d=~~b;break f}d=-2147483648}J[c+84>>2]=d;b=Q(g*Q(-5));g:{if(Q(R(b))<Q(2147483648)){d=~~b;break g}d=-2147483648}J[c+80>>2]=d;b=Q(g+g);h:{if(Q(R(b))<Q(2147483648)){d=~~b;break h}d=-2147483648}J[c+72>>2]=d;if(K[1054793]){b=Q(f*Q(15));i:{if(Q(R(b))<Q(2147483648)){d=~~b;break i}d=-2147483648}J[c+64>>2]=d}J[e+1720>>2]=-20;J[e+1724>>2]=-20;I[e+22>>1]=257;J[e+88>>2]=1065353216;if(!K[e+85|0]){J[e+60>>2]=-1;H[e+85|0]=1}zi(a,e);f=N[467293];d=K[1054743];b=Q(f*(d?Q(28):Q(15)));j:{if(Q(R(b))<Q(2147483648)){c=~~b;break j}c=-2147483648}J[e+1736>>2]=c;b=Q(f*(d?Q(20):Q(15)));k:{if(Q(R(b))<Q(2147483648)){c=~~b;break k}c=-2147483648}J[e+1732>>2]=c;f=N[467294];b=Q((d?Q(14):Q(15))*f);l:{if(Q(R(b))<Q(2147483648)){c=~~b;break l}c=-2147483648}J[e+1744>>2]=c;b=Q((d?Q(46):Q(35))*f);m:{if(Q(R(b))<Q(2147483648)){c=~~b;break m}c=-2147483648}J[e+1740>>2]=c;c=K[1067757];J[a+1796>>2]=853;J[a+92>>2]=c;Wr(e);H[a+2837|0]=1;nd(1041636,a,854);nd(1044756,a,855);nd(1045016,a,855);i=a,j=oe(a),J[i+8>>2]=j}function yL(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0);e=$c-16|0;$c=e;a=L[a+52>>1];I[769504]=a;J[384753]=0;a=a+66896|0;f=K[a+13824|0];a:{if((f|0)==4){break a}if(K[a+1536|0]){J[273211]=-1;J[273212]=-1;J[273215]=-1;J[273216]=-1;J[273213]=-1;J[273214]=-1}a=(f|0)==5;af(a?32:24);b=J[273224];J[e+12>>2]=b;b:{if(a){J[384754]=b;rk(0,0);rk(0,1);qk(0,0);qk(0,1);qk(1,0);qk(1,1);rk(1,0);rk(1,1);break b}b=L[769504];c=P(b,12);a=c+66896|0;d=a+18432|0;g=J[d+4>>2];J[206316]=J[d>>2];J[206317]=g;J[206318]=J[a+18440>>2];N[206317]=Q(1)-N[206317];d=a+27648|0;g=J[d+4>>2];J[206319]=J[d>>2];J[206320]=g;d=J[a+27656>>2];J[206315]=J[(b<<2)+69200>>2];J[206321]=d;H[825256]=K[b+83024|0];N[206320]=Q(1)-N[206320];h=N[a+36864>>2];i=N[a+36872>>2];j=N[a+46080>>2];k=N[a+46088>>2];l=N[a+36868>>2];N[206326]=N[a+46084>>2];N[206323]=l;N[206327]=k+Q(-.5);N[206325]=j+Q(-.5);N[206324]=i+Q(-.5);N[206322]=h+Q(-.5);a=L[(c+122192|0)+8>>1];b=J[384753];J[384753]=b+1;J[(b<<2)+1539024>>2]=a>>>J[458159];b=a;a=e+12|0;fr(1,J[273212],b,a);b=L[(P(L[769504],12)+122192|0)+4>>1];c=J[384753];J[384753]=c+1;J[(c<<2)+1539024>>2]=b>>>J[458159];im(1,J[273214],b,a);b=L[(P(L[769504],12)+122192|0)+2>>1];c=J[384753];J[384753]=c+1;J[(c<<2)+1539024>>2]=b>>>J[458159];mm(1,J[273216],b,a);b=L[(P(L[769504],12)+122192|0)+6>>1];c=J[384753];J[384753]=c+1;J[(c<<2)+1539024>>2]=b>>>J[458159];hr(1,J[273213],b,a);b=L[P(L[769504],12)+122192>>1];c=J[384753];J[384753]=c+1;J[(c<<2)+1539024>>2]=b>>>J[458159];or(1,J[273215],b,a);b=L[(P(L[769504],12)+122192|0)+10>>1];c=J[384753];J[384753]=c+1;J[(c<<2)+1539024>>2]=b>>>J[458159];em(1,J[273211],b,a)}Pd(J[273228]);J[273224]=J[273229];if((f|0)==5){tf(1);Rt();tf(0);break a}Rt()}$c=e+16|0}function zg(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=Q(0),k=0,l=0;c=$c-3296|0;$c=c;J[c+32>>2]=0;J[c+24>>2]=0;J[c+28>>2]=0;J[c+16>>2]=0;J[c+20>>2]=0;J[c+8>>2]=0;J[c+12>>2]=0;Cd(J[a+84>>2]+P(b,28)|0);d=c+56|0;bd[J[a+88>>2]](d,b);a:{b:{c:{d:{if(!Lq(d)){Ef(c+40|0,d,J[a+48>>2],1);e:{if(!K[a+82|0]|J[a+40>>2]<=0){break e}while(1){f:{bd[J[a+88>>2]](c+208|0,e);d=J[c+212>>2];J[c+416>>2]=J[c+208>>2];J[c+420>>2]=d;if((Zg(c+416|0,0,47)|0)>=0){break f}e=e+1|0;if((e|0)<J[a+40>>2]){continue}break e}break}e=0;i=Ng(c+40|0);h=Mr(a,c+416|0,b,c+208|0);if((h|0)<=0){break d}while(1){g=c+72|0;d=(c+208|0)+(e<<3)|0;Ke(g,c+56|0,I[d+4>>1],I[d+6>>1]);d=J[c+76>>2];J[c+40>>2]=J[c+72>>2];J[c+44>>2]=d;d=Ne(c+40|0);J[(c+96|0)+(e<<2)>>2]=d;f=d+f|0;e=e+1|0;if((h|0)!=(e|0)){continue}break}vg(g,f,i);f=0;e=0;while(1){d=(c+208|0)+(e<<3)|0;g=I[d+2>>1];Ke(c- -64|0,c+56|0,I[d+4>>1],I[d+6>>1]);d=J[c+68>>2];J[c+40>>2]=J[c+64>>2];J[c+44>>2]=d;g:{if((g|0)<0){d=J[c+48>>2];I[d+6>>1]=L[d+6>>1]|2;pf(c+72|0,c+40|0,f,0);d=J[c+48>>2];I[d+6>>1]=L[d+6>>1]&65533;break g}pf(c+72|0,c+40|0,f,0)}f=J[(c+96|0)+(e<<2)>>2]+f|0;e=e+1|0;if((h|0)!=(e|0)){continue}break}break c}wh(c+8|0,c+40|0);break b}I[c+18>>1]=K[(a+b|0)+52|0]?0:J[a+44>>2];d=0;break a}vg(c+72|0,0,i)}d=c+72|0;Mg(c+8|0,d);ug(d)}h=L[J[a+48>>2]+4>>1];if(K[825312]){d=L[c+18>>1];g=rg(d);d=(d-h|0)/3|0;I[c+18>>1]=L[c+18>>1]-(d<<1);j=Q(Q(d|0)/Q(g|0));N[c+24>>2]=N[c+24>>2]+j;N[c+32>>2]=N[c+32>>2]-j}d=L[c+16>>1]}k=c,l=mf(K[a+22|0],J[a+24>>2],d,J[467303]),I[k+12>>1]=l;d=J[a+84>>2]+P(b,28)|0;b=J[c+12>>2];J[d>>2]=J[c+8>>2];J[d+4>>2]=b;J[d+24>>2]=J[c+32>>2];b=J[c+28>>2];J[d+16>>2]=J[c+24>>2];J[d+20>>2]=b;b=J[c+20>>2];J[d+8>>2]=J[c+16>>2];J[d+12>>2]=b;bd[J[J[a>>2]+8>>2]](a);$c=c+3296|0}function tt(){var a=0;fk(1687980,0,0);J[421736]=779;J[421737]=780;J[421738]=781;J[421739]=782;J[421740]=783;J[421742]=784;I[843217]=1;I[843218]=1;I[843219]=1028;I[843220]=7;J[421743]=785;I[843222]=8;J[421744]=786;J[421745]=787;J[421746]=788;I[843223]=74;I[843224]=10;I[843225]=7;I[843226]=5;J[421747]=789;I[843227]=4;J[421748]=790;I[843216]=K[1054210]>5?131:130;H[1687969]=0;H[1688036]=0;J[421749]=791;J[421614]=4325378;J[421615]=131137;J[421750]=792;J[421751]=793;J[444427]=0;J[421993]=0;while(1){H[J[(a<<2)+40576>>2]+5|0]=0;a=a+1|0;if((a|0)!=41){continue}break}H[1054054]=0;H[1687968]=0;if(K[1054208]){I[843232]=67;I[843233]=69;I[843234]=3;I[843235]=2;I[843236]=3;I[843237]=134;I[843238]=196;I[843239]=130;I[843240]=3;I[843241]=8;I[843242]=86;I[843243]=2;J[421753]=794;J[421752]=795;J[421754]=796;J[421755]=797;J[421756]=798;J[421757]=799;J[421758]=800;J[421759]=801;J[421760]=802;J[421761]=803;J[421762]=804;J[421763]=805;J[421764]=806;J[421765]=807;J[421622]=4325380;J[421766]=808;J[421767]=809;J[421623]=131141;J[421624]=9043976;J[421768]=810;J[421769]=811;J[421774]=812;J[421775]=813;J[421627]=394498;J[421628]=393281;J[421776]=814;J[421777]=815;J[421778]=816;J[421779]=817;J[421629]=262151;J[421780]=818;J[421781]=819;I[843260]=3;J[421782]=820;I[843261]=3;I[843262]=9;I[843263]=16;I[843264]=36;J[421783]=821;J[421784]=822;J[421785]=823;J[421789]=824;I[843265]=26;J[421790]=825;I[843269]=66;I[843270]=11;I[843271]=3;I[843272]=10;J[421791]=826;J[421792]=827;J[421795]=828;I[843275]=2;if(K[1054199]){I[843251]=80;J[421626]=5570562;J[421772]=829;J[421771]=830;J[421773]=831}I[843266]=116;I[843267]=104;I[843268]=2;J[421787]=832;J[421786]=833;J[421788]=834}H[1777704]=0;J[421994]=0;H[1777705]=0}function ne(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;d=$c-320|0;$c=d;a:{if(!b){if(J[203557]>=8388001){je(819376,0,256);cg(814216);c=d+48|0;Wd(c,3093);ne(c,0)}e=J[a+4>>2];c=J[a>>2];O[((J[203556]&31)<<3)+819376>>3]=O[131740];J[d+8>>2]=c;J[d+12>>2]=e;c=e&65535;I[d+12>>1]=c>>>0>=256?256:c;b:{if(!L[24366]|!K[814208]){break b}Ca(d+20|0);c=J[d+28>>2];c:{d:{if((c|0)!=J[206297]){break d}e=J[d+24>>2];if((e|0)!=J[206298]){break d}f=J[d+20>>2];if((f|0)==J[203553]){break c}}mk();g=d+20|0;e=$c-608|0;$c=e;e:{if(K[1869164]){break e}Je(e+8|0,31448);j=g+8|0;k=g+4|0;J[e+4>>2]=0;i=J[11485];while(1){I[24382]=0;Tf(48760,28495,g,k,j);f:{if(J[e+4>>2]>0){xe(48760,2274,48728,e+4|0);break f}Hd(48760,2267,48728)}h=e+8|0;Je(h,48760);f=$c-16|0;$c=f;c=ja(h|0,66)|0;J[f+12>>2]=(c|0)<0?-1:c;c=0-c&c>>31;g:{if(c){break g}c=dm(J[f+12>>2],0,2);if(c){break g}gk(824864,J[f+12>>2]);c=0}$c=f+16|0;if(!(!c|(c|0)==(i|0))){Pi();Te(c,8369,h);break e}if((c|0)!=(i|0)){break e}c=J[e+4>>2];J[e+4>>2]=c+1;if((c|0)<19){continue}break}Pi();Od(7738,e+4|0)}$c=e+608|0;f=J[d+20>>2];e=J[d+24>>2];c=J[d+28>>2]}J[206298]=e;J[206297]=c;J[203553]=f;if(!J[206224]){break b}J[d+316>>2]=16777216;J[d+312>>2]=d+48;c=d+312|0;Tf(c,28405,d+32|0,d+36|0,d+40|0);Iq(c,d+8|0);c=Cs(824864,c);if(!c){break b}Pi();Af(c,8358,48760)}jf(814216,d+8|0);break a}if(b>>>0<=3){ke((b<<3)+48616|0,a);break a}c=b-11|0;if(c>>>0<=2){ke((c<<3)+48656|0,a);break a}h:{switch(b-100|0){case 0:ke(48704,a);J[204908]=1084227584;break a;case 1:ke(48712,a);J[204909]=1084227584;break a;case 2:ke(48720,a);J[204910]=1084227584;break a;default:break h}}c=b&-2;if((c|0)!=360){if((c|0)!=256){break a}ke((b<<3)+46640|0,a);break a}ke((b<<3)+45728|0,a)}pi(1046836,a,b);$c=d+320|0}function Mr(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;e=$c-288|0;$c=e;J[e+284>>2]=d;if(J[a+40>>2]>0){while(1){bd[J[a+88>>2]](e+24|0,f);g=f<<2;h=g+(e+160|0)|0;J[h>>2]=-1;l=g+(e+32|0)|0;J[l>>2]=-1;g=L[e+28>>1];if(g){m=J[e+24>>2];J[h>>2]=i;g=g>>>0>=96?96:g;Kd(b+i|0,m,g);i=g+i|0;J[l>>2]=i}f=f+1|0;if((f|0)<J[a+40>>2]){continue}break}c=c<<2;l=J[c+(e+32|0)>>2];m=J[c+(e+160|0)>>2]}while(1){g=i;c=j;a:{if((g|0)<=(c|0)){break a}while(1){b:{f=K[b+c|0];c:{if(!((f|0)==104|(f|0)==38)){f=c;break c}f=c;h=i-f|0;if((h|0)<7){break b}while(1){g=b+f|0;k=K[g|0];if((k|0)==38){f=f+2|0;g=(h|0)>3;h=h-2|0;if(g){continue}break c}break}if((k|0)!=104|h>>>0<7|K[g+1|0]!=116|(K[g+2|0]!=116|K[g+3|0]!=112)){break c}k=f+4|0;g=K[k+b|0]==115;f=g?f+5|0:k;if((g?-5:-4)+h>>>0<3){break c}h=b+f|0;if(K[h|0]!=58|K[h+1|0]!=47){break c}g=c;if(K[h+2|0]==47){break a}}c=f+1|0;if((i|0)>(c|0)){continue}}break}g=i}I[e+24>>1]=j;I[e+26>>1]=g-j;c=L[e+28>>1]|L[e+30>>1]<<16;J[e+16>>2]=L[e+24>>1]|L[e+26>>1]<<16;J[e+20>>2]=c;wr(e+16|0,m,l,e+284|0);if((g|0)!=(i|0)){j=g;d:{if((g|0)>=(i|0)){break d}k=J[a+40>>2];while(1){c=K[b+j|0];if((c|0)==32){break d}f=0;e:{f:{if((k|0)<=0){break f}while(1){if(J[(e+160|0)+(f<<2)>>2]!=(j|0)){f=f+1|0;if((k|0)!=(f|0)){continue}break f}break}f=g;if((g|0)==(j|0)){break e}if((c|0)!=62){break d}f=j+1|0;h=i-f|0;g:{if((h|0)>=2){while(1){c=K[b+f|0];if((c|0)!=38){break g}f=f+2|0;c=(h|0)>3;h=h-2|0;if(c){continue}break}}if(!h){break d}c=K[b+f|0]}if((c|0)!=32){break d}break e}f=j}j=f+1|0;if((j|0)<(i|0)){continue}break}}I[e+24>>1]=g;I[e+26>>1]=j-g|32768;c=L[e+28>>1]|L[e+30>>1]<<16;J[e+8>>2]=L[e+24>>1]|L[e+26>>1]<<16;J[e+12>>2]=c;wr(e+8|0,m,l,e+284|0);continue}break}$c=e+288|0;return J[e+284>>2]-d>>3}function ct(a){a=a|0;var b=0,c=0,d=0,e=Q(0),f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=Q(0),q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0;l=Ge(J[a+56>>2],16);if((l|0)>0){j=J[a+56>>2];while(1){b=k<<4;a:{if((j|0)>(b|0)){c=b+16|0;h=(c|0)>(j|0)?j:c;f=0;c=b;while(1){i=L[(P(c,28)+a|0)+1184>>1];f=(f|0)>(i|0)?f:i;c=c+1|0;if((h|0)>(c|0)){continue}break}i=J[a+60>>2];c=0;while(1){c=(L[(P(b,28)+a|0)+1186>>1]+c|0)+1|0;b=b+1|0;if((h|0)>(b|0)){continue}break}b=(f+i|0)+5|0;break a}c=0;b=J[a+60>>2]+5|0}g=(c|0)<(g|0)?g:c;d=b+d|0;k=k+1|0;if((l|0)!=(k|0)){continue}break}}p=N[467293];e=Q(p*Q(480));b:{if(Q(R(e))<Q(2147483648)){b=~~e;break b}b=-2147483648}c=(b|0)<(d|0)?d:b;e=Q(p*Q(10));c:{if(Q(R(e))<Q(2147483648)){d=~~e;break c}d=-2147483648}e=N[467294];b=J[467304];q=c+(d<<1)|0;w=a,x=mf(1,0,q,J[467303]),J[w+36>>2]=x;b=(b|0)/4|0;e=Q(e*Q(10));d:{if(Q(R(e))<Q(2147483648)){h=~~e;break d}h=-2147483648}m=(h<<1)+g|0;b=b+((m|0)/-2|0)|0;r=mf(1,0-((b|0)>0?b:0)|0,m,J[467304]);if((l|0)>0){i=h+r|0;d=d+J[a+36>>2]|0;s=J[a+60>>2];n=J[a+56>>2];while(1){c=o<<4;if((n|0)>(c|0)){b=c+16|0;t=(b|0)>(n|0)?n:b;v=K[a+52|0];g=i;f=c;while(1){b=P(f,28)+a|0;u=b+1176|0;j=L[b+1186>>1]+g|0;b=d;if(!v){b=(L[((f<<1)+a|0)+152>>1]!=65535?s:0)+b|0}k=g-10|0;g=j+1|0;I[u+6>>1]=k;I[u+4>>1]=b;b=0;f=f+1|0;if((t|0)>(f|0)){continue}break}while(1){g=L[(P(c,28)+a|0)+1184>>1];b=(b|0)>(g|0)?b:g;c=c+1|0;if((t|0)>(c|0)){continue}break}b=b+5|0}else{b=5}d=(b+d|0)+s|0;o=o+1|0;if((l|0)!=(o|0)){continue}break}}J[a+44>>2]=q;b=J[a+80>>2];d=r-(b+h|0)|0;J[a+40>>2]=d;e=N[467294];H[a+86|0]=1;J[a+92>>2]=d+((h|0)/2|0);d=b+m|0;e=Q(e*Q(300));e:{if(Q(R(e))<Q(2147483648)){b=~~e;break e}b=-2147483648}J[a+48>>2]=(b|0)<(d|0)?d:b;bd[J[J[a+64>>2]+8>>2]](a- -64|0)}function Qm(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;d=$c-32|0;$c=d;a:{if(!op(42936,a)){break a}c=J[a+4>>2];b=(c|0)/16|0;J[d+8>>2]=b;if((c|0)<=15){pd(24001);pd(25193);break a}if((b|0)>J[a+8>>2]){pd(24001);pd(21797);break a}if(!hl(b,b,0)){pd(24001);a=d+8|0;Cg(21737,a,a,1054296,1054300);break a}c=a+4|0;b=J[c>>2];e=a+8|0;if((b|0)>J[e>>2]){pd(24052);pd(24867);b=J[c>>2]}if(J[263574]<(b|0)){pd(25353);Cg(21670,c,e,1054296,1054300)}if(K[1054308]){break a}b=0;if(J[458156]>0){while(1){Cd((b<<2)+1832644|0);b=b+1|0;if((b|0)<J[458156]){continue}break}}b=J[458673];if((b|0)!=53344){qd(b)}J[458677]=0;J[458673]=0;b=J[a+4>>2];J[458673]=J[a>>2];J[458674]=b;J[458675]=J[a+8>>2];b=J[a+4>>2]/16|0;J[458676]=b;a=J[a+8>>2]/(b|0)|0;c=(a|0)>=32?32:a;J[458677]=c;a=J[263575];e=J[263576];if(e){e=(e|0)/(b|0)|0;a=(a|0)<(e|0)?a:e}a=(((a|0)>=4096?4096:a)|0)/(b|0)|0;b=c<<4;c=(a|0)<(b|0)?a:b;J[458157]=c;a=0;q=1832624,r=Ge(b,c),J[q>>2]=r;b=J[458157];J[458158]=b-1;N[458160]=Q(1)/Q(b|0);q=1832636,r=oi(b),J[q>>2]=r;b=J[458676];J[d+28>>2]=J[458157];J[d+24>>2]=J[458156];Kj(7851,d+24|0,d+28|0);Xr(d+12|0,b,P(b,J[d+28>>2]));j=1;if(J[d+24>>2]>0){while(1){h=J[458157];if((h|0)>0){c=J[458676];b=P(a,h);f=0;while(1){if((c|0)>0){k=P(c,b>>4);l=P(c,f);m=J[d+12>>2];n=J[458673]+(P(c,b&15)<<2)|0;e=0;while(1){o=(P(J[d+16>>2],e+l|0)<<2)+m|0;p=(P(J[458674],e+k|0)<<2)+n|0;g=0;while(1){i=g<<2;J[i+o>>2]=J[p+i>>2];g=g+1|0;if((c|0)!=(g|0)){continue}break}e=e+1|0;if((c|0)!=(e|0)){continue}break}}b=b+1|0;f=f+1|0;if((h|0)!=(f|0)){continue}break}}il((a<<2)+1832644|0,d+12|0,3,K[1054309]);a=a+1|0;if((a|0)<J[d+24>>2]){continue}break}}qd(J[d+12>>2]);Nd(1041636)}$c=d+32|0;return j}function SB(a,b){a=a|0;b=b|0;var c=Q(0),d=0,e=0,f=0,g=0;d=a+648|0;f=K[b+28|0];a:{if(!(f&1)){break a}b:{c:{d:{e:{e=f&96;switch((e>>>5|0)-2|0){case 1:break c;case 0:break d;default:break e}}g=J[b+4>>2];J[a+384>>2]=J[b>>2];J[a+388>>2]=g;J[a+392>>2]=J[b+8>>2];c=N[a+388>>2];break b}N[a+384>>2]=N[a+384>>2]+N[b>>2];c=Q(N[a+388>>2]+N[b+4>>2]);N[a+388>>2]=c;N[a+392>>2]=N[a+392>>2]+N[b+8>>2];break b}N[a+352>>2]=N[a+352>>2]+N[b>>2];N[a+356>>2]=N[a+356>>2]+N[b+4>>2];N[a+360>>2]=N[a+360>>2]+N[b+8>>2];N[a+384>>2]=N[a+384>>2]+N[b>>2];c=Q(N[a+388>>2]+N[b+4>>2]);N[a+388>>2]=c;N[a+392>>2]=N[a+392>>2]+N[b+8>>2]}if(Q(c-Q(Bd(c)|0))<Q(.0010000000474974513)){N[a+388>>2]=N[a+388>>2]+Q(.0010000000474974513)}if(e){break a}e=J[a+388>>2];J[a+352>>2]=J[a+384>>2];J[a+356>>2]=e;J[a+360>>2]=J[a+392>>2];e=J[a+388>>2];J[a+4>>2]=J[a+384>>2];J[a+8>>2]=e;J[a+12>>2]=J[a+392>>2]}e=f&128;f:{if(!(f&2)){break f}c=Cf(N[b+12>>2]);N[a+396>>2]=c;if(e){break f}N[a+364>>2]=c}g:{if(!(f&8)){break g}c=Cf(N[b+20>>2]);N[a+404>>2]=c;if(e){break g}N[a+372>>2]=c}h:{if(!(f&16)){break h}c=Cf(N[b+24>>2]);N[a+412>>2]=c;if(e){break h}N[a+380>>2]=c}i:{if(!(f&4)){break i}c=Cf(N[b+16>>2]);N[a+400>>2]=c;if(!e){N[a+368>>2]=c;N[a+408>>2]=c;J[d>>2]=0;break i}c=Xe(N[a+368>>2],c,Q(.3333333432674408));b=J[d>>2];if((b|0)==15){Ie(d+4|0,d+8|0,60);b=14}N[((b<<2)+d|0)+4>>2]=c;J[d>>2]=b+1;c=Xe(N[a+368>>2],N[a+400>>2],Q(.6666666865348816));b=J[d>>2];if((b|0)==15){Ie(d+4|0,d+8|0,60);b=14}N[((b<<2)+d|0)+4>>2]=c;J[d>>2]=b+1;c=Xe(N[a+368>>2],N[a+400>>2],Q(1));b=J[d>>2];if((b|0)==15){Ie(d+4|0,d+8|0,60);b=14}N[(d+4|0)+(b<<2)>>2]=c;J[d>>2]=b+1;N[a+408>>2]=N[d+4>>2]}Tl(a,Q(0))}function tI(a){a=a|0;var b=0,c=0,d=Q(0);c=a+72|0;Kf(c);J[c+160>>2]=-1;d=N[467294];J[c+60>>2]=0;d=Q(d+d);a:{if(Q(R(d))<Q(2147483648)){b=~~d;break a}b=-2147483648}J[c+164>>2]=b;b=J[204913];J[c>>2]=44976;J[c+204>>2]=b;b=K[1054197];H[c+145|0]=5;H[c+146|0]=1;J[c+212>>2]=12582912;J[c+208>>2]=c+408;J[c+68>>2]=12582912;J[c+64>>2]=c+216;J[c+56>>2]=1051;J[c+52>>2]=1052;J[c+48>>2]=1053;J[c+44>>2]=1054;H[c+144|0]=!b;J[a+132>>2]=844;b=a+856|0;Kf(b);J[b+88>>2]=a+60;H[b+23|0]=2;J[b>>2]=45088;J[b+56>>2]=c;Hr(b);J[b+104>>2]=0;c=J[11323];J[b+108>>2]=J[11322];J[b+112>>2]=c;c=J[11325];J[b+136>>2]=J[11324];J[b+140>>2]=c;J[b+96>>2]=10;J[b+100>>2]=4;c=J[11327];J[b+144>>2]=J[11326];J[b+148>>2]=c;J[b+132>>2]=0;c=J[11329];J[b+164>>2]=J[11328];J[b+168>>2]=c;J[b+124>>2]=16;J[b+128>>2]=1;c=J[11331];J[b+172>>2]=J[11330];J[b+176>>2]=c;J[b+160>>2]=0;c=J[11333];J[b+192>>2]=J[11332];J[b+196>>2]=c;J[b+152>>2]=17;J[b+156>>2]=1;c=J[11335];J[b+200>>2]=J[11334];J[b+204>>2]=c;J[b+188>>2]=0;J[b+180>>2]=17;J[b+184>>2]=1;c=J[11337];J[b+220>>2]=J[11336];J[b+224>>2]=c;J[b+216>>2]=0;c=J[11339];J[b+228>>2]=J[11338];J[b+232>>2]=c;c=J[b+240>>2];J[b+116>>2]=J[b+236>>2];J[b+120>>2]=c;J[b+208>>2]=16;J[b+212>>2]=1;c=a+672|0;Rj(c,J[263684],a+2432|0,845);Rj(a+764|0,2,a+2376|0,846);I[a+816>>1]=257;H[a+754|0]=!K[1054197];J[a+44>>2]=J[203556]-J[263684];nd(1046836,a,847);nd(1047356,a,848);if((bd[J[J[a+672>>2]+44>>2]](c)|0)>=4){c=bd[J[J[c>>2]+44>>2]](c)|0}else{c=4}J[a+8>>2]=c;H[a+93|0]=K[a+93|0]|4;H[a+877|0]=K[a+877|0]|4;H[a+693|0]=K[a+693|0]|4;H[a+785|0]=K[a+785|0]|4;Tg(a+2124|0,100,0);Tg(a+2208|0,100,0);Tg(a+2292|0,100,0)}function fj(a,b,c){var d=0,e=0;e=$c-144|0;$c=e;J[e+140>>2]=8388608;J[e+136>>2]=e;d=9541;a:{b:{c:{d:{e:{f:{g:{h:{i:{j:{k:{l:{m:{n:{o:{p:{q:{r:{s:{t:{u:{v:{switch(b+857812991|0){default:switch(b+857812913|0){case 20:break j;case 19:break k;case 18:break l;case 17:break m;case 16:break n;case 15:break o;case 14:break p;case 13:break q;case 3:break r;case 2:break s;case 1:break t;case 34:break u;case 35:break d;case 0:break e;case 24:break f;case 23:break g;case 22:break h;case 21:break i;default:break b};case 1:d=15711;break c;case 2:d=2955;break c;case 3:d=1468;break c;case 4:d=15800;break c;case 5:d=8894;break c;case 9:d=15735;break c;case 6:d=15769;break c;case 7:d=13614;break c;case 8:d=3885;break c;case 44:d=5935;break c;case 30:d=15831;break c;case 31:d=12693;break c;case 32:d=14769;break c;case 33:d=9608;break c;case 37:d=15609;break c;case 41:d=17407;break c;case 42:d=18839;break c;case 10:case 11:case 12:case 13:case 14:case 15:case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 23:case 24:case 25:case 26:case 27:case 28:case 29:case 34:case 35:case 36:case 38:case 39:case 40:break b;case 43:break v;case 0:break c}}d=13588;break c}d=15585;break c}d=13567;break c}d=12483;break c}d=11850;break c}d=2545;break c}d=9135;break c}d=18609;break c}d=18578;break c}d=12528;break c}d=12550;break c}d=12573;break c}d=12596;break c}d=12504;break c}d=12456;break c}d=9627;break c}d=15672;break c}d=4310;break c}d=4433}Hd(a,17173,d);break a}d=b;b=e+136|0;if(!(bd[c|0](d,b)|0)){break a}Hd(a,6478,b)}$c=e+144|0}function $p(a){var b=0,c=0,d=0,e=Q(0),f=Q(0),g=Q(0),h=Q(0),i=0,j=0,k=0,l=0,m=Q(0);b=$c-3120|0;$c=b;e=N[a+8>>2];a:{if(e<Q(0)){break a}g=N[a+12>>2];h=N[a+4>>2];f=N[a+84>>2];f=Q((f<Q(1)?Q(f*Q(7)):Q(7))*N[J[a+48>>2]+60>>2]);m=Q(f*Q(.0625));N[260055]=m;N[260056]=Q(16)/Q(f+f);d=J[464811];if(Q(R(e))<Q(2147483648)){c=~~e}else{c=-2147483648}c=(c|0)>(d|0)?d:c;d=K[828401];J[b+44>>2]=b+48;b:{if((d|0)==1){l=a;a=Bd(h);d=c;c=Bd(g);si(l,a,d,c,b);J[b+136>>2]=1056702464;J[b+140>>2]=1056964608;J[b+132>>2]=-587202561;J[b+112>>2]=1056964608;J[b+116>>2]=1056964608;J[b+108>>2]=-587202561;J[b+88>>2]=1056964608;J[b+92>>2]=1056702464;J[b+84>>2]=-587202561;h=Q(c|0);N[b+80>>2]=h;e=Q(h+Q(1));N[b+128>>2]=e;g=N[b>>2];N[b+124>>2]=g;N[b+104>>2]=e;N[b+100>>2]=g;N[b+76>>2]=g;e=Q(a|0);N[b+120>>2]=e;f=Q(e+Q(1));N[b+96>>2]=f;N[b+72>>2]=f;J[b+64>>2]=1056702464;J[b+68>>2]=1056702464;J[b+60>>2]=-587202561;N[b+56>>2]=h;N[b+48>>2]=e;N[b+52>>2]=g;J[b+44>>2]=b+144;break b}d=Bd(Q(h-m));i=Bd(Q(g-N[260055]));j=Bd(Q(h+N[260055]));k=Bd(Q(g+N[260055]));si(a,d,c,i,b);if(K[b+6|0]){Bj(b+44|0,a,b,Q(d|0),Q(i|0))}l=(d|0)==(j|0);c:{if(l){break c}si(a,j,c,i,b);if(!K[b+6|0]){break c}Bj(b+44|0,a,b,Q(j|0),Q(i|0))}if((i|0)==(k|0)){break b}si(a,d,c,k,b);if(K[b+6|0]){Bj(b+44|0,a,b,Q(d|0),Q(k|0))}if(l){break b}si(a,j,c,k,b);if(!K[b+6|0]){break b}Bj(b+44|0,a,b,Q(j|0),Q(k|0))}a=J[b+44>>2];if((a|0)==(b+48|0)){break a}if(!K[1040206]){de(J[260052]);H[1040206]=1}c=J[263623];$(34962,J[260053]);d=c;c=a;a=b+48|0;c=(c-a|0)/24|0;Aa(34962,0,P(d,c)|0,a|0);ae(c)}$c=b+3120|0}function Cj(a,b,c,d,e,f){var g=0,h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=0,m=Q(0),n=0,o=0,p=Q(0),q=Q(0),r=Q(0),s=Q(0),t=0,u=0,v=0,w=0;g=$c-80|0;$c=g;k=N[b+16>>2];i=Q(k-N[e+4>>2]);a:{if(!(i>Q(0))|!(i<=Q(N[a+12>>2]+Q(.009999999776482582)))){break a}i=N[b+20>>2];j=N[b+8>>2];s=N[c+8>>2];p=N[d>>2];h=N[b>>2];m=N[b+12>>2];r=Q(N[c>>2]*Q(.5));q=Q(m-r);q=Q((h>q?h:q)+Q(.0010000000474974513));N[g+8>>2]=p<q?p:q;p=N[d+12>>2];h=Q(h+r);h=Q((h>m?m:h)+Q(-.0010000000474974513));N[g+20>>2]=h<p?p:h;h=Q(k+Q(.0010000000474974513));N[g+12>>2]=h;N[g+24>>2]=h+N[c+4>>2];h=N[d+8>>2];m=Q(s*Q(.5));k=Q(i-m);k=Q((j>k?j:k)+Q(.0010000000474974513));N[g+16>>2]=h<k?h:k;h=N[d+20>>2];j=Q(j+m);i=Q((i<j?i:j)+Q(-.0010000000474974513));N[g+28>>2]=i<h?h:i;Ae(g+68|0,g+8|0);Ae(g+56|0,g+20|0);d=J[g+60>>2];n=J[g+72>>2];if((d|0)>=(n|0)){b=J[g+64>>2];while(1){l=J[g+76>>2];if((l|0)<=(b|0)){i=Q(n|0);o=J[g+56>>2];while(1){d=J[g+68>>2];if((o|0)>=(d|0)){j=Q(l|0);while(1){o=um(d,n,l);b=P(o,12)+66896|0;h=Q(d|0);N[g+32>>2]=N[b+18432>>2]+h;N[g+36>>2]=N[b+18436>>2]+i;N[g+40>>2]=N[b+18440>>2]+j;N[g+44>>2]=N[b+27648>>2]+h;N[g+48>>2]=N[b+27652>>2]+i;N[g+52>>2]=N[b+27656>>2]+j;if(u=gg(g+32|0,g+8|0),v=0,w=K[o+75344|0]==2,w?u:v){break a}o=J[g+56>>2];b=(o|0)>(d|0);d=d+1|0;if(b){continue}break}b=J[g+64>>2]}d=(b|0)>(l|0);l=l+1|0;if(d){continue}break}d=J[g+60>>2]}l=(d|0)>(n|0);n=n+1|0;if(l){continue}break}}i=N[g+12>>2];t=1;a=J[a>>2];H[a+111|0]=1;N[a+8>>2]=i;J[a+40>>2]=0;N[e+4>>2]=i;N[f+4>>2]=i;i=Q(i+N[c+4>>2]);N[e+16>>2]=i;N[f+16>>2]=i}$c=g+80|0;return t}function yd(a,b,c,d,e){var f=Q(0),g=Q(0),h=0,i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=0,n=Q(0),o=Q(0),p=Q(0),q=0,r=0,s=0,t=Q(0),u=Q(0),v=Q(0),w=0,x=Q(0),y=Q(0),z=Q(0),A=Q(0),B=Q(0),C=Q(0),D=Q(0),E=0,F=Q(0);m=J[273224];h=L[d>>1];q=J[273222];r=J[q+36>>2];s=J[q+4>>2];a=Q(-a);i=Md(a);n=Jd(a);a=Q(-b);j=Md(a);o=Jd(a);a=Q(-c);k=Md(a);p=Jd(a);w=L[d+2>>1];if(w){x=N[d+12>>2];y=N[d+8>>2];z=N[d+4>>2];h=s+(h<<4)|0;d=m+P(r,24)|0;A=N[273218];B=N[273217];C=N[273219];t=Q(-p);u=Q(-o);v=Q(-n);E=K[1092884];D=N[273220];F=Q(-D);m=0;while(1){b=Q(N[h+8>>2]-x);a=Q(N[h+4>>2]-y);c=Q(N[h>>2]-z);a:{b:{switch(E|0){case 0:f=Q(Q(t*c)+Q(k*a));c=Q(Q(k*c)+Q(p*a));g=Q(Q(o*c)+Q(j*b));a=Q(Q(i*f)+Q(n*g));c=Q(Q(j*c)+Q(b*u));b=Q(Q(v*f)+Q(i*g));break a;case 1:f=Q(Q(i*a)+Q(n*b));g=Q(Q(k*c)+Q(p*f));l=Q(Q(v*a)+Q(i*b));b=Q(Q(o*g)+Q(j*l));a=Q(Q(t*c)+Q(k*f));c=Q(Q(j*g)+Q(l*u));break a;case 2:f=Q(Q(j*c)+Q(b*u));g=Q(Q(t*f)+Q(k*a));l=Q(Q(o*c)+Q(j*b));b=Q(Q(v*g)+Q(i*l));c=Q(Q(k*f)+Q(p*a));a=Q(Q(i*g)+Q(n*l));break a;case 3:break b;default:break a}}f=Q(Q(v*a)+Q(i*b));g=Q(Q(j*c)+Q(f*u));l=Q(Q(i*a)+Q(n*b));a=Q(Q(t*g)+Q(k*l));b=Q(Q(o*c)+Q(j*f));c=Q(Q(k*g)+Q(p*l))}c:{if(!e){f=b;break c}f=Q(Q(D*c)+Q(b*C));c=Q(Q(C*c)+Q(b*F))}r=L[h+14>>1];s=L[h+12>>1];N[d+8>>2]=x+f;N[d+4>>2]=y+a;N[d>>2]=z+c;J[d+12>>2]=J[(m&-4)+1092844>>2];N[d+20>>2]=Q(Q(r&32767)*A)+Q(Q(Q(r>>>15|0)*Q(-.009999999776482582))*A);N[d+16>>2]=Q(Q(s&32767)*B)+Q(Q(Q(s>>>15|0)*Q(-.009999999776482582))*B);d=d+24|0;h=h+16|0;m=m+1|0;if((w|0)!=(m|0)){continue}break}}J[q+36>>2]=J[q+36>>2]+w}function NJ(a){a=a|0;var b=0,c=0,d=0,e=0;c=$c-16|0;$c=c;d=63;a:{b:{while(1){b=d;if(K[b+a|0]&223){break b}d=b-1|0;if(b){continue}break}b=0;break a}b=b+1|0}I[c+14>>1]=64;I[c+12>>1]=b;J[c+8>>2]=a;J[c+4>>2]=K[a+67|0];Kj(11161,c+8|0,c+4|0);a=0;J[444427]=J[444427]-1;qt();c:{while(1){b=J[(a<<2)+40576>>2];if(!ld(c+8|0,J[b>>2])){a=a+1|0;if((a|0)!=41){continue}break c}break}e=b;d=J[c+4>>2];b=K[b+4|0];b=(b|0)>(d|0)?d:b;H[e+5|0]=b;d:{e:{f:{g:{h:{switch(a-10|0){default:i:{switch(a-36|0){case 2:break g;case 1:break d;case 3:break e;case 0:break f;default:break i}}if((a|0)!=5){break d}H[1811802]=1;break c;case 4:H[1811803]=1;break c;case 0:if((b&255)==1){break c}I[843246]=L[843246]+4;break c;case 6:H[1811804]=1;break c;case 5:H[1811805]=1;break c;case 8:if((b&255)==1){break c}I[843253]=L[843253]+3;break c;case 13:I[843224]=L[843224]+6;I[843223]=L[843223]+6;I[843249]=L[843249]+6;I[843262]=L[843262]+6;I[843270]=L[843270]+6;break c;case 17:I[843218]=L[843218]+4;break c;case 11:break h;case 1:case 2:case 3:case 7:case 9:case 10:case 12:case 14:case 15:case 16:break d}}if((b&255)==1){break c}I[843256]=L[843256]- -64;break c}if((b&255)!=2){break c}I[843267]=167;break c}H[1811820]=1;break c}I[843251]=L[843251]+3;I[843253]=L[843253]+6;break c}if(!K[1054199]|(a|0)!=40){break c}I[843222]=L[843222]+1;I[843236]=L[843236]+1;I[843244]=L[843244]+1;I[843251]=L[843251]+1;I[843252]=L[843252]+1;I[843253]=L[843253]+1;I[843260]=L[843260]+2;I[843254]=L[843254]- -64;I[843261]=L[843261]+1}$c=c+16|0}function ot(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=Q(0),m=0;g=$c-16|0;$c=g;c=J[a>>2];a:{if(K[52793]){e=(vd(c)>>>0)%768|0;c=c+2|0;break a}e=K[c|0];c=c+1|0}d=e+66896|0;i=K[d+1536|0];j=K[d+768|0];ul(e);f=63;b:{c:{while(1){d=f;if(K[d+c|0]&223){break c}f=d-1|0;if(d){continue}break}d=0;break b}d=d+1|0}I[g+14>>1]=64;I[g+12>>1]=d;J[g+8>>2]=c;tl(e,g+8|0);H[e+75344|0]=K[c+64|0];k=(e<<2)+76880|0,l=Q(wj(+Q(Q(K[c+65|0]-128|0)*Q(.015625)))),N[k>>2]=l;f=P(e,6);h=(f<<1)+122202|0;d:{if(!K[53137]){d=c+67|0;c=K[c+66|0];break d}d=c+68|0;c=vd(c+66|0)&511}I[h>>1]=c;c=K[53137];e:{if(b){b=f<<1;h=b+122198|0;f:{g:{h:{i:{j:{k:{l:{if(!c){I[b+122192>>1]=K[d|0];c=d+1|0;break l}b=f<<1;k=b+122192|0,m=vd(d)&511,I[k>>1]=m;c=d+2|0;if(K[53137]){break k}}I[(f<<1|2)+122192>>1]=K[c|0];c=c+1|0;break j}k=(b|2)+122192|0,m=vd(c)&511,I[k>>1]=m;c=d+4|0;if(K[53137]){break i}}I[(f<<1)+122196>>1]=K[c|0];b=c+1|0;break h}k=(f<<1)+122196|0,m=vd(c)&511,I[k>>1]=m;b=d+6|0;if(K[53137]){break g}}c=b+1|0;b=K[b|0];break f}c=d+8|0;b=vd(b)&511}I[h>>1]=b;break e}m:{if(!c){c=d+1|0;b=K[d|0];break m}c=d+2|0;b=vd(d)&511}Ll(b,e)}f=(f<<1)+122200|0;n:{if(!K[53137]){d=c+1|0;b=K[c|0];break n}d=c+2|0;b=vd(c)&511}I[f>>1]=b;b=e+66896|0;c=!K[d|0];H[b+768|0]=c;if(!(!K[1859276]|(c|0)==(j|0))){bd[J[266956]]()}c=K[d+1|0];H[b+14592|0]=c;H[b+15360|0]=c;if((c|0)==6){H[(e+66896|0)+15360|0]=4}b=kp(K[d+2|0]);H[(e+66896|0)+1536|0]=b;if(!(!K[1859276]|(!K[1067796]|(b|0)==(i|0)))){bd[J[266956]]()}J[a>>2]=d+3;$c=g+16|0;return e}function uj(a){var b=0,c=0,d=0,e=0,f=0,g=Q(0),h=0,i=Q(0),j=Q(0),k=Q(0),l=0,m=0,n=0,o=0,p=0,q=Q(0),r=Q(0);f=$c-16|0;$c=f;p=f+4|0;h=P(a,12)+66896|0;e=L[h+55298>>1];b=e>>>4|0;a:{if((b|0)>=J[458677]){k=Q(1);g=Q(-.5);i=Q(.5);break a}d=J[458676];b:{if((d|0)<=0){g=Q(1);j=Q(1);break b}l=P(b,d);b=0;m=J[458673]+(P(e&15,d)<<2)|0;n=J[458674];c:{while(1){e=(b<<2)+m|0;c=0;d:{while(1){if(M[e+(P(c+l|0,n)<<2)>>2]<16777216){c=c+1|0;if((d|0)!=(c|0)){continue}break d}break}g=Q(Q(b|0)/Q(d|0));break c}b=b+1|0;if((d|0)!=(b|0)){continue}break}g=Q(1)}b=d;e:{while(1){e=b;b=b-1|0;o=(P(l+b|0,n)<<2)+m|0;c=0;f:{while(1){if(M[o+(c<<2)>>2]<16777216){c=c+1|0;if((d|0)!=(c|0)){continue}break f}break}j=Q(Q(1)-Q(Q(e|0)/Q(d|0)));break e}if((e|0)>=2){continue}break}j=Q(1)}b=d;g:{while(1){e=b;b=b-1|0;o=(b<<2)+m|0;c=0;h:{while(1){if(M[o+(P(c+l|0,n)<<2)>>2]<16777216){c=c+1|0;if((d|0)!=(c|0)){continue}break h}break}i=Q(Q(e|0)/Q(d|0));break g}if((e|0)>=2){continue}break}i=Q(0)}b=0;while(1){e=(P(b+l|0,n)<<2)+m|0;c=0;i:{while(1){if(M[e+(c<<2)>>2]<16777216){c=c+1|0;if((d|0)!=(c|0)){continue}break i}break}k=Q(Q(1)-Q(Q(b|0)/Q(d|0)));break b}b=b+1|0;if((d|0)!=(b|0)){continue}break}}g=Q(g+Q(-.5));i=Q(i+Q(-.5))}Fm(p,g,j,Q(0),Q(.7853981852531433));g=N[f+4>>2];j=N[f+8>>2];q=N[f+12>>2];Fm(p,i,k,Q(0),Q(.7853981852531433));i=N[f+12>>2];k=N[f+8>>2];r=N[f+4>>2];N[h+18440>>2]=q+Q(.5);N[h+18436>>2]=j+Q(0);N[h+18432>>2]=g+Q(.5);N[h+27648>>2]=r+Q(.5);N[h+27652>>2]=k+Q(0);N[h+27656>>2]=i+Q(.5);Fl(a);$c=f+16|0}function lo(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;a:{i=J[464807];k=P(i,c)+a|0;j=J[266950]+(k<<1)|0;f=I[j>>1];if((f|0)==32767){break a}g=K[d+67664|0];h=K[e+67664|0];l=(g|0)==(h|0);m=!g;g=K[e+79952|0]>>>6&1;d=K[d+79952|0]>>>6&1;b:{if(l&(m|(g|0)==(d|0))){break b}c:{g=b-g|0;if((g|0)>=(f|0)){if(h){break c}Qk(a,b,c,k);break b}if(d|(b|0)!=(f|0)){break b}if((J[464808]-1|0)!=(b|0)){d=P(i,P(J[464809],b+1|0)+c|0)+a|0;d=J[464818]&(K[d+J[464805]|0]<<8|K[d+J[464804]|0])}else{d=0}if(K[d+67664|0]){break b}if(h){break c}Qk(a,b-1|0,c,k);break b}I[j>>1]=g}h=c>>4;j=b>>4;g=a&15;i=a>>4;d=(f|0)>=-1?f+1>>>4|0:0;f=I[J[266950]+(k<<1)>>1];f=(f|0)>=-1?f+1>>>4|0:0;k=(d|0)<(f|0)?d:f;d=(d|0)>(f|0)?d:f;d:{if((k|0)!=(d|0)){f=d;while(1){Jf(i,f,h);l=(f|0)>(k|0);f=f-1|0;if(l){continue}break}break d}Jf(i,j,h)}if(!(g|(i|0)<=0)){gj(a-1|0,b,c,e,i-1|0,j,h,k,d)}f=c&15;l=b&15;e:{if(l|(j|0)<=0){break e}if(!K[e+80720|0]){m=P(J[464807],P(J[464809],b-1|0)+c|0)+a|0;if(K[(J[464818]&(K[m+J[464805]|0]<<8|K[J[464804]+m|0]))+80720|0]==4){break e}}Jf(i,j-1|0,h)}if(!(f|(h|0)<=0)){gj(a,b,c-1|0,e,i,j,h-1|0,k,d)}if(!((g|0)!=15|(i|0)>=(J[464824]-1|0))){gj(a+1|0,b,c,e,i+1|0,j,h,k,d)}f:{if((l|0)!=15|(j|0)>=(J[464825]-1|0)){break f}if(!K[e+80720|0]){g=P(J[464807],P(J[464809],b+1|0)+c|0)+a|0;if(K[(J[464818]&(K[g+J[464805]|0]<<8|K[g+J[464804]|0]))+80720|0]==4){break f}}Jf(i,j+1|0,h)}if((f|0)!=15|(h|0)>=(J[464826]-1|0)){break a}gj(a,b,c+1|0,e,i,j,h+1|0,k,d)}}function IC(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;g=$c-16|0;$c=g;e=J[13647];a:{if(!e){break a}if(!J[13644]){pd(27097);pd(11428);J[13647]=0;break a}b:{if(K[62784]){break b}H[62784]=1;if((e|0)<=0){break b}d=J[458677];f=J[458676];a=0;while(1){b=a<<4;h=L[b+54596>>1];i=L[b+54602>>1];k=L[b+54594>>1];c=L[b+54598>>1];b=L[b+54592>>1];j=b>>>4|0;J[g>>2]=j;J[g+4>>2]=b&15;b=11665;c:{d:{if((d|0)<=(j|0)|(c|0)>(f|0)){break d}b=11460;if(J[13645]<(P(c,i)+k|0)){break d}if(J[13646]>=(c+h|0)){break c}}Bg(b,g+4|0,g);b=a;e=J[13647]-1|0;if((a|0)<(e|0)){while(1){c=b<<4;d=c+54600|0;b=b+1|0;f=b<<4;h=f+54600|0;i=J[h+4>>2];J[d>>2]=J[h>>2];J[d+4>>2]=i;d=f+54592|0;f=J[d+4>>2];c=c+54592|0;J[c>>2]=J[d>>2];J[c+4>>2]=f;if((b|0)!=(e|0)){continue}break}}d=J[458677];f=J[458676];J[13647]=e;a=a-1|0}a=a+1|0;if((e|0)>(a|0)){continue}break}}if((e|0)<=0){break a}b=0;while(1){a=b<<4;c=a+54604|0;d=L[c>>1];e:{if(d){I[c>>1]=d-1;break e}f=a+54600|0;d=((L[f>>1]+1&65535)>>>0)%L[a+54602>>1]|0;I[f>>1]=d;I[c>>1]=L[a+54606>>1];f=L[a+54592>>1];h=L[a+54598>>1];J[g+12>>2]=h;J[g+8>>2]=h;c=J[13645];J[g+4>>2]=((J[13644]+(P(c,L[a+54596>>1])<<2)|0)+(P(d,h)<<2)|0)+(L[a+54594>>1]<<2);a=J[(f>>>J[458159]<<2)+1832644>>2];if(!a){break e}e=P(J[458676],f&J[458158]);d=K[1054309];wa(3553,a|0);a=g+4|0;f:{if((c|0)==J[a+4>>2]){va(3553,0,0,e|0,c|0,J[a+8>>2],6408,5121,J[a>>2]);break f}dp(e,a,c,0)}if(d){cp(e,a,c,1)}e=J[13647]}b=b+1|0;if((e|0)>(b|0)){continue}break}}$c=g+16|0;return 1}function Vg(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;b=$c-1216|0;$c=b;e=J[13325];J[b+64>>2]=J[13324];J[b+68>>2]=e;if(!(!a&(H[1845412]&1))){a=$c-32|0;$c=a;J[a+28>>2]=7919;J[a+24>>2]=7898;J[a+20>>2]=J[263556];a:{while(1){c=J[(a+20|0)+(d<<2)>>2];Wd(a,c);f=J[a+4>>2];J[a+8>>2]=J[a>>2];J[a+12>>2]=f;f=Pm(a+8|0);if(!f){break a}d=d+1|0;if((d|0)!=3){continue}break}c=0}J[b+944>>2]=c;$c=a+32|0;H[1845428]=(f|0)==J[11486];c=J[13327];J[b+72>>2]=J[13326];J[b+76>>2]=c;a=J[b+944>>2];b:{if(a){if(ld(b+72|0,a)){break b}a=L[b+76>>1]}else{a=c}if(K[1054197]|!(a&65535)){break b}f=Pm(b+72|0)}H[1845412]=1}c:{if(!(e&65535)){break c}J[b+1212>>2]=17039360;J[b+940>>2]=17039360;J[b+1208>>2]=b+944;J[b+936>>2]=b+672;a=b+1208|0;d=b+936|0;Om(a,d,b- -64|0);c=b+72|0;Je(c,a);e=b+8|0;a=Mi(e,c);g=J[11486];if(!((a|0)!=(g|0)|!L[b+940>>1])){Je(c,d);a=Mi(e,c)}if((a|0)==(g|0)){break c}if(a){Af(a,6918,b- -64|0);break c}a=b+8|0;f=Nm(a,b- -64|0);H[1845412]=0;bd[J[b+36>>2]](a)|0}if(!J[458673]){J[b+944>>2]=53344;J[b+948>>2]=16;J[b+952>>2]=8;e=b+944|0;a=e;c=J[263612];d=J[263613];if(c|d){a=b+72|0;Xr(a,c<<4,d<<3);c=0;g=J[a+8>>2];if((g|0)>0){i=J[e>>2];j=J[a>>2];h=J[a+4>>2];k=(h|0)<=0;while(1){d=(c<<3)/(g|0)|0;if(!k){l=(P(J[a+4>>2],c)<<2)+j|0;m=(P(d,J[e+4>>2])<<2)+i|0;d=0;while(1){J[(d<<2)+l>>2]=J[((d<<4)/(h|0)<<2)+m>>2];d=d+1|0;if((h|0)!=(d|0)){continue}break}}c=c+1|0;if((g|0)!=(c|0)){continue}break}}}Qm(a)}$c=b+1216|0;return f}function sy(a){a=a|0;var b=0,c=0;J[a+104>>2]=0;b=rd(a,6866,337,338,339,0)<<5;J[b+1074116>>2]=-1;J[b+1074112>>2]=44780;J[b+1074108>>2]=340;J[b+1074104>>2]=341;b=rd(a,6828,337,338,339,0)<<5;J[b+1074116>>2]=-13159;J[b+1074112>>2]=44780;J[b+1074108>>2]=342;J[b+1074104>>2]=343;b=rd(a,6879,337,338,339,0)<<5;J[b+1074116>>2]=-1;J[b+1074112>>2]=44780;J[b+1074108>>2]=344;J[b+1074104>>2]=345;b=rd(a,16779,337,346,347,0)<<5;J[b+1074124>>2]=1065353216;c=b+1074116|0;J[c>>2]=0;J[c+4>>2]=1148846080;J[b+1074112>>2]=44852;J[b+1074108>>2]=348;J[b+1074104>>2]=349;c=J[464808];b=rd(a,3396,337,350,351,0)<<5;J[b+1074124>>2]=c+2;c=b+1074116|0;J[c>>2]=-1e4;J[c+4>>2]=1e4;J[b+1074112>>2]=44804;J[b+1074108>>2]=352;J[b+1074104>>2]=353;b=rd(a,6851,337,338,339,0)<<5;J[b+1074116>>2]=-1;J[b+1074112>>2]=44780;J[b+1074108>>2]=354;J[b+1074104>>2]=355;b=rd(a,6838,337,338,339,0)<<5;J[b+1074116>>2]=-6579301;J[b+1074112>>2]=44780;J[b+1074108>>2]=356;J[b+1074104>>2]=357;b=rd(a,7428,309,310,0,0)<<5;J[b+1074116>>2]=3;J[b+1074112>>2]=45360;J[b+1074108>>2]=358;J[b+1074104>>2]=359;b=rd(a,16763,337,346,347,0)<<5;J[b+1074124>>2]=1065353216;c=b+1074116|0;J[c>>2]=-1027080192;J[c+4>>2]=1120403456;J[b+1074112>>2]=44852;J[b+1074108>>2]=360;J[b+1074104>>2]=361;c=J[464808];b=rd(a,9740,337,350,351,0)<<5;J[b+1074124>>2]=(c|0)/2;c=b+1074116|0;J[c>>2]=-2048;J[c+4>>2]=2048;J[b+1074112>>2]=44804;J[b+1074108>>2]=362;J[b+1074104>>2]=363;Zf(a,-1,364)}function Sr(a,b){var c=0,d=0,e=0;e=$c-16|0;$c=e;a:{b:{c:{d:{e:{f:{g:{h:{i:{j:{k:{c=K[b|0];switch(c|0){case 1:break j;case 0:break k;case 7:break b;case 9:break c;case 8:break d;case 6:break e;case 5:break f;case 4:break g;case 3:break h;case 2:break i;default:break a}}d=bd[J[a+4>>2]](a,e+15|0)|0;if(d){break a}d=-857812939;if(K[e+15|0]!=31){break a}H[b|0]=K[b|0]+1}d=bd[J[a+4>>2]](a,e+15|0)|0;if(d){break a}d=-857812938;if(K[e+15|0]!=139){break a}H[b|0]=K[b|0]+1}d=bd[J[a+4>>2]](a,e+15|0)|0;if(d){break a}d=-857812937;if(K[e+15|0]!=8){break a}H[b|0]=K[b|0]+1}d=bd[J[a+4>>2]](a,e+15|0)|0;if(d){break a}c=K[e+15|0];J[b+4>>2]=c;d=-857812936;if(c&4){break a}c=K[b|0]+1|0;H[b|0]=c}if(K[b+2|0]<=3){while(1){d=bd[J[a+4>>2]](a,e+15|0)|0;if(d){break a}c=K[b+2|0]+1|0;H[b+2|0]=c;if((c&255)>>>0<4){continue}break}c=K[b|0]}H[b+2|0]=0;H[b|0]=c+1}d=bd[J[a+4>>2]](a,e+15|0)|0;if(d){break a}H[b|0]=K[b|0]+1}d=bd[J[a+4>>2]](a,e+15|0)|0;if(d){break a}c=K[b|0]+1|0;H[b|0]=c}if(K[b+4|0]&8){while(1){d=bd[J[a+4>>2]](a,e+15|0)|0;if(d){break a}if(K[e+15|0]){continue}break}c=K[b|0]}c=c+1|0;H[b|0]=c}if(K[b+4|0]&16){while(1){d=bd[J[a+4>>2]](a,e+15|0)|0;if(d){break a}if(K[e+15|0]){continue}break}c=K[b|0]}c=c+1|0;H[b|0]=c}if(!(!(K[b+4|0]&2)|K[b+2|0]>1)){while(1){d=bd[J[a+4>>2]](a,e+15|0)|0;if(d){break a}c=K[b+2|0]+1|0;H[b+2|0]=c;if((c&255)>>>0<2){continue}break}c=K[b|0]}H[b+1|0]=1;H[b+2|0]=0;H[b|0]=c+1;d=0}$c=e+16|0;return d}function _p(a){var b=0,c=0,d=Q(0),e=0,f=0,g=0,h=0,i=Q(0),j=Q(0),k=0,l=0;b=$c-192|0;$c=b;if(!(!(bd[J[J[a>>2]+20>>2]](a)|0)|L[a+328>>1]==35536)){h=a+324|0;f=J[h>>2];a:{if(f){break a}f=0;d=N[467294];c=b+84|0;I[c+6>>1]=0;J[c>>2]=0;d=Q(d*Q(24));b:{if(Q(R(d))<Q(2147483648)){e=~~d;break b}e=-2147483648}I[c+4>>1]=e;k=c,l=Ge(P(e,3),2),J[k+8>>2]=l;J[b+92>>2]=24;I[b+88>>1]=24;e=b+72|0;Ee(e,a+260|0,64);g=b+96|0;Ef(g,e,c,0);e=Ne(g);if(!e){I[a+328>>1]=35536;J[a+324>>2]=0;break a}J[b+188>>2]=4194304;J[b+184>>2]=b+112;c=b+8|0;f=b+96|0;vg(c,e+3|0,Ng(f)+3|0);e=J[206431];J[206431]=-11513776;Iq(b+184|0,b+72|0);g=J[b+188>>2];J[b+96>>2]=J[b+184>>2];J[b+100>>2]=g;pf(c,f,3,3);J[206431]=e;e=J[b+76>>2];J[b+96>>2]=J[b+72>>2];J[b+100>>2]=e;pf(c,f,0,0);Mg(h,c);ug(c);f=J[h>>2]}de(f);if(!J[260057]){k=1040228,l=of(1,4),J[k>>2]=l}f=J[a+48>>2];c=b+8|0;Wt(f,a,c);d=Q(bd[J[f+20>>2]](a));N[b+96>>2]=Q(d*N[c+16>>2])+N[c+48>>2];N[b+100>>2]=Q(d*N[c+20>>2])+N[c+52>>2];N[b+104>>2]=Q(d*N[c+24>>2])+N[c+56>>2];d=N[a+84>>2];d=d>Q(1)?Q(.014285714365541935):Q(d/Q(70));i=Q(d*Q(L[a+332>>1]));N[b+84>>2]=i;d=Q(d*Q(L[a+334>>1]));N[b+88>>2]=d;if(!(!K[J[207101]+478|0]|K[828400]!=4)){me(b+112|0,1054312,1054376);j=Q(Q(Q(Q(N[b+104>>2]*N[b+156>>2])+Q(Q(N[b+96>>2]*N[b+124>>2])+Q(N[b+100>>2]*N[b+140>>2])))+N[b+172>>2])*Q(.20000000298023224));N[b+88>>2]=j*d;N[b+84>>2]=i*j}ie(1);ok(b+84|0,b+96|0,a+336|0,-1,qe(1,4));Pd(J[260057]);ae(4)}$c=b+192|0}function iJ(a){a=a|0;var b=Q(0),c=0,d=0,e=Q(0),f=Q(0),g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=Q(0),o=Q(0),p=Q(0),q=Q(0),r=Q(0),s=Q(0),t=0,u=0,v=0,w=Q(0);n=Q(Q(ud(a+1|0)|0)*Q(.03125));o=Q(Q(ud(a+5|0)|0)*Q(.03125));p=Q(Q(ud(a+9|0)|0)*Q(.03125));q=Q(Q(ud(a+13|0)|0)*Q(.03125));r=Q(Q(ud(a+17|0)|0)*Q(.03125));s=Q(Q(ud(a+21|0)|0)*Q(.03125));c=$c-32|0;$c=c;h=K[a|0];d=P(h,52)+1638800|0;i=K[d+21|0];if(i){while(1){a=J[413028];if((a|0)==600){Ie(1652128,1652180,31148);a=599}J[413028]=a+1;a=P(a,52);J[a+1652172>>2]=h;v=c,w=Q(Fd(1600384)+Q(-.5)),N[v+20>>2]=w;v=c,w=Q(Fd(1600384)+Q(-.5)),N[v+24>>2]=w;v=c,w=Q(Fd(1600384)+Q(-.5)),N[v+28>>2]=w;Gm(c+20|0);t=wj(mi(+Fd(1600384))/3);g=a+1652144|0;b=Q(N[d+32>>2]*Q(t));e=Q(Q(N[c+20>>2]*b)+n);N[g>>2]=e;f=Q(Q(N[c+24>>2]*b)+o);N[a+1652148>>2]=f;j=a+1652152|0;b=Q(Q(N[c+28>>2]*b)+p);N[j>>2]=b;N[c+16>>2]=b-s;N[c+12>>2]=f-r;N[c+8>>2]=e-q;Gm(c+8|0);k=a+1652128|0;b=N[d+36>>2];N[k>>2]=N[c+8>>2]*b;N[a+1652132>>2]=b*N[c+12>>2];e=N[c+16>>2];u=J[g+4>>2];l=a+1652156|0;J[l>>2]=J[g>>2];J[l+4>>2]=u;J[a+1652164>>2]=J[j>>2];N[a+1652136>>2]=b*e;b=N[d+44>>2];e=Q(b*N[d+48>>2]);f=b;b=Q(Fd(1600384)+Q(-.5));b=Q(f+Q(e*Q(b+b)));N[a+1652176>>2]=b;N[a+1652140>>2]=b;b=N[d+24>>2];e=Q(b*N[d+28>>2]);f=b;b=Q(Fd(1600384)+Q(-.5));N[a+1652168>>2]=f+Q(e*Q(b+b));H[1683328]=K[d+22|0];if(Et(k,767)){J[413028]=J[413028]-1}m=m+1|0;if((i|0)!=(m|0)){continue}break}}$c=c+32|0}function sq(a,b){a=a|0;b=b|0;var c=0,d=Q(0),e=0,f=0,g=0,h=0,i=0;a=$c-96|0;$c=a;a:{if(J[263697]){break a}f=J[b+8>>2];e=P(f,796)+834384|0;if(K[e+475|0]){c=P(f,796)+834384|0;J[a+32>>2]=J[c+432>>2];b=J[c+428>>2];J[a+24>>2]=J[c+424>>2];J[a+28>>2]=b;if(K[1859276]){b=a+24|0;Ae(a+12|0,b);b:{if(!K[c+476|0]){break b}Dg(a+40|0,b,e+92|0);c=J[a+16>>2];if((c|0)>J[464808]){break b}while(1){if(lr(a+40|0)==Q(-1e5)){b=Eh(J[a+12>>2],c,J[a+20>>2]);if(K[b+75344|0]==2){d=N[P(b,12)+94548>>2]}else{d=Q(0)}N[a+28>>2]=Q(d+Q(c|0))+Q(.0010000000474974513);break b}N[a+44>>2]=N[a+44>>2]+Q(1);N[a+56>>2]=N[a+56>>2]+Q(1);b=J[464808]>(c|0);c=c+1|0;if(b){continue}break}}d=N[e+360>>2];c:{if(Q(R(d))<Q(2147483648)){c=~~d;break c}c=-2147483648}d=N[e+356>>2];d:{if(Q(R(d))<Q(2147483648)){b=~~d;break d}b=-2147483648}d=N[e+352>>2];e:{if(Q(R(d))<Q(2147483648)){g=~~d;break e}g=-2147483648}ut(3,g,b,c);J[a+72>>2]=J[a+32>>2];N[a+28>>2]=N[a+28>>2]+Q(.125);H[a+92|0]=7;b=J[a+28>>2];J[a+64>>2]=J[a+24>>2];J[a+68>>2]=b;b=P(f,796)+834384|0;N[a+80>>2]=N[b+448>>2];N[a+76>>2]=N[b+452>>2];bd[J[J[e>>2]+8>>2]](e,a- -64|0);J[e+44>>2]=0;J[e+36>>2]=0;J[e+40>>2]=0;b=a+40|0;Dg(b,e+4|0,e+92|0);d=Q(N[a+44>>2]+Q(-.009999999776482582));N[a+56>>2]=d;N[a+44>>2]=d;h=e,i=Of(b,132),H[h+111|0]=i}c=1;break a}b=P(f,796)+834384|0;if(K[b+788|0]){break a}H[b+788|0]=1;if(!K[834368]){break a}pd(16363)}$c=a+96|0;return c|0}function Ff(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;c=$c-96|0;$c=c;i=bd[J[a+44>>2]]()|0;a:{if((i|0)>=2){h=a- -64|0;b=a+72|0;e=$c-16|0;$c=e;b:{if((i|0)<=0){break b}l=Gd(b,0,i<<3);while(1){f=g- -64|0;if((f|0)<L[h+4>>1]){j=g-1|0;m=J[h>>2];d=f;c:{while(1){b=d;d=K[m+b|0];d:{if(d>>>0<=59){e:{switch(d-45|0){case 0:case 2:break c;case 1:break d;default:break e}}if(!d){break c}if((d|0)!=32){break d}break c}f:{switch(d-60|0){case 0:case 2:break c;case 1:break d;default:break f}}if((d|0)==92){break c}}d=b-1|0;if((b|0)>(g|0)){continue}break}b=j}g:{h:{if((b|0)>=(g|0)){b=b+1|0;if((b|0)<(f|0)){break h}}Ke(e+8|0,h,g,64);j=J[e+12>>2];b=f;d=J[e+8>>2];break g}Ke(e+8|0,h,g,b-g|0);j=J[e+12>>2];d=J[e+8>>2]}g=b;b=(k<<3)+l|0;J[b>>2]=d;J[b+4>>2]=j;k=k+1|0;if((i|0)!=(k|0)){continue}break b}break}Qe(e+8|0,h,g);f=J[e+12>>2];b=(k<<3)+l|0;J[b>>2]=J[e+8>>2];J[b+4>>2]=f}$c=e+16|0;break a}b=J[a+68>>2];J[a+72>>2]=J[a+64>>2];J[a+76>>2]=b}Cd(a+112|0);J[a+100>>2]=0;J[a+104>>2]=0;J[a+96>>2]=J[a+140>>2];Og(c,J[a+40>>2],1);I[c+94>>1]=64;J[c+88>>2]=c+16;if((bd[J[a+44>>2]]()|0)>0){b=0;while(1){I[c+92>>1]=0;yi(a,b,c+88|0);f=J[c+92>>2];J[c>>2]=J[c+88>>2];J[c+4>>2]=f;f=(b<<2)+a|0;n=f,o=Ne(c)+J[f+96>>2]|0,J[n+96>>2]=o;b=b+1|0;if((bd[J[a+44>>2]]()|0)>(b|0)){continue}break}}bd[J[a+48>>2]](a);Rg(a);Wq(a- -64|0);b=J[a+60>>2];if(b){bd[b|0](a)}$c=c+96|0}function RL(){var a=0,b=0,c=0;J[273225]=1536;Yf(51560);Yf(51576);Yf(51592);Yf(51608);Yf(51624);Yf(51640);Yf(51656);Yf(51672);Yf(51688);Yf(51704);bf(51720);H[51765]=1;H[51766]=1;J[12943]=684;J[12946]=288;H[51762]=K[51762]|2;Se(51720);a=J[273222];J[273222]=51720;J[12939]=0;bd[J[12933]]();J[273226]=51720;J[273222]=a;H[51762]=K[51762]|1;J[12939]=0;bf(51792);J[12964]=32;H[51839]=0;H[51835]=0;H[51836]=0;Se(51792);J[273227]=51792;bf(51864);J[12982]=160;Se(51864);bf(51936);J[13e3]=144;Se(51936);bf(52008);J[13018]=144;Se(52008);bf(52080);J[13036]=288;Se(52080);bf(52152);J[13054]=144;Se(52152);bf(52224);J[13072]=144;H[52264]=5;J[13069]=685;Se(52224);bf(52296);J[13090]=264;Se(52296);bf(52368);J[13108]=288;J[13105]=686;Se(52368);bf(52440);H[52485]=1;H[52486]=1;I[26240]=1539;J[13123]=687;J[13126]=288;J[13124]=1077936128;J[13125]=1056964608;H[52482]=K[52482]|2;Se(52440);bf(52512);I[26279]=1;J[13144]=48;J[13140]=688;H[52554]=K[52554]|2;Se(52512);bf(52584);H[52629]=1;H[52630]=1;J[13159]=684;J[13161]=1056964608;J[13162]=288;J[13158]=689;H[52626]=K[52626]|2;Se(52584);a=Qd(1563104,51720,72);J[390780]=690;J[390779]=683;J[390776]=13208;Se(a);bf(52656);J[13180]=24;I[26351]=1;Se(52656);a=Qd(1563584,51720,72);J[390902]=691;J[390900]=692;J[390899]=683;J[390896]=15536;Se(a);b=1092886,c=Id(9343,K[1054197]),H[b|0]=c;nd(1042156,0,693);nd(1043196,0,694)}function Ow(a){a=a|0;var b=0,c=0;J[a+104>>2]=0;b=rd(a,14882,337,346,347,0)<<5;J[b+1074124>>2]=1084227584;c=b+1074116|0;J[c>>2]=1065353216;J[c+4>>2]=1149239296;J[b+1074112>>2]=44852;J[b+1074108>>2]=431;J[b+1074104>>2]=432;b=rd(a,4492,337,346,347,25968)<<5;J[b+1074124>>2]=1101004800;c=b+1074116|0;J[c>>2]=1065353216;J[c+4>>2]=1120403456;J[b+1074112>>2]=44852;J[b+1074108>>2]=433;J[b+1074104>>2]=434;b=rd(a,13887,337,350,351,0)<<5;J[b+1074124>>2]=0;c=b+1074116|0;J[c>>2]=0;J[c+4>>2]=100;J[b+1074112>>2]=44804;J[b+1074108>>2]=435;J[b+1074104>>2]=436;b=rd(a,13873,337,350,351,0)<<5;J[b+1074124>>2]=0;c=b+1074116|0;J[c>>2]=0;J[c+4>>2]=100;J[b+1074112>>2]=44804;J[b+1074108>>2]=437;J[b+1074104>>2]=438;b=rd(a,6194,313,314,0,0)<<5;J[b+1074108>>2]=439;J[b+1074104>>2]=440;b=rd(a,17447,313,314,0,0)<<5;J[b+1074108>>2]=441;J[b+1074104>>2]=442;b=rd(a,12428,313,314,0,0)<<5;J[b+1074108>>2]=443;J[b+1074104>>2]=444;b=rd(a,13130,313,314,0,0)<<5;J[b+1074108>>2]=445;J[b+1074104>>2]=446;b=rd(a,1227,337,350,351,0)<<5;J[b+1074124>>2]=30;c=b+1074116|0;J[c>>2]=1;J[c+4>>2]=200;J[b+1074112>>2]=44804;J[b+1074108>>2]=447;J[b+1074104>>2]=448;Zf(a,-1,364);a:{if(K[1811800]){break a}b=J[a+16>>2];c=J[b>>2];b:{if(!c){J[b>>2]=0;break b}bd[J[J[c>>2]+4>>2]](c);c=K[1811800];J[b>>2]=0;if(c){break a}}b=J[a+16>>2];a=J[b+16>>2];if(a){bd[J[J[a>>2]+4>>2]](a)}J[b+16>>2]=0}}function Qj(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;d=$c-48|0;$c=d;j=J[a+48>>2];Og(d+8|0,J[a+88>>2],0);while(1){e=P(b,28)+a|0;c=J[e+112>>2];J[d+8>>2]=J[e+108>>2];J[d+12>>2]=c;h=e;f=d+8|0;e=f;c=Ne(e)+10|0;J[h+104>>2]=c;g=c+g|0;b=b+1|0;if((b|0)!=5){continue}break}k=Ng(e);J[a+92>>2]=k;b=0;Og(e,J[a+88>>2],0);e=P(j,28)+a|0;I[d+12>>1]=J[e+100>>2];h=Ng(f);a:{if(!L[e+120>>1]){f=J[e+100>>2];b=5;break a}c=0;while(1){J[d+8>>2]=J[e+116>>2]+c;f=Ne(d+8|0);b=(b|0)>(f|0)?b:f;f=J[e+100>>2];c=f+c|0;i=L[e+120>>1];if((c|0)<(i|0)){continue}break}b=b+5|0}J[a+40>>2]=b;J[a+44>>2]=h+5;c=J[e+96>>2];f=Ge((i|0)/(f|0)|0,c);h=J[a+44>>2];i=a+60|0;Cd(i);b=P(b,c);l=(b|0)<(g|0)?g:b;h=P(f,h);vg(d+8|0,l,h+k|0);Og(d+32|0,J[a+88>>2],0);b=0;g=0;while(1){c=P(g,28)+a|0;f=J[c+112>>2];J[d+32>>2]=J[c+108>>2];J[d+36>>2]=f;f=d+8|0;c=J[c+104>>2];Zl(f,J[a+48>>2]==(g|0)?-937550306:2130706432,b,0,c,J[a+92>>2]);m=d+32|0;pf(f,m,b+5|0,0);b=b+c|0;g=g+1|0;if((g|0)!=5){continue}break}b=0;Zl(f,-937550306,0,k,l,h);g=J[e+96>>2];Og(m,J[a+88>>2],0);c=J[e+100>>2];I[d+36>>1]=c;if(L[e+120>>1]){j=P(j,28)+a|0;while(1){J[d+32>>2]=J[j+116>>2]+b;f=(b|0)/(c|0)|0;c=(f|0)/(g|0)|0;pf(d+8|0,d+32|0,P(J[a+40>>2],f-P(c,g)|0),P(c,J[a+44>>2])+k|0);c=J[e+100>>2];b=c+b|0;if((b|0)<L[e+120>>1]){continue}break}}b=d+8|0;Mg(i,b);ug(b);H[a+52|0]=0;bd[J[J[a>>2]+8>>2]](a);$c=d+48|0}function Rg(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;c=$c-112|0;$c=c;if(!J[a+172>>2]){b=c+16|0;Ef(b,45276,J[a+40>>2],1);wh(a+172|0,b);J[a+148>>2]=P(L[a+180>>1],3)>>>2}b=bd[J[a+44>>2]]()|0;d=J[a+160>>2];if((d|0)>=b<<6){J[a+160>>2]=-1;d=-1}f=a+72|0;g=bd[J[a+44>>2]]()|0;b=0;J[a+152>>2]=-1;J[a+156>>2]=0;a:{b:{if((g|0)<=0){break b}h=(d|0)==-1?2147483647:d;while(1){d=L[((e<<3)+f|0)+4>>1];if(!d){break b}J[a+156>>2]=e;d=b+d|0;if((d|0)<=(h|0)){b=d;e=e+1|0;if((g|0)==(e|0)){break b}continue}break}e=h-b|0;J[a+152>>2]=e;break a}e=J[a+152>>2]}if((e|0)==-1){J[a+152>>2]=L[((J[a+156>>2]<<3)+f|0)+4>>1]}Og(c+16|0,J[a+40>>2],0);J[a+200>>2]=0;I[a+180>>1]=J[a+148>>2];b=64;c:{if(J[a+152>>2]==64){d=J[a+156>>2];e=J[((d<<2)+a|0)+96>>2];break c}J[c+108>>2]=4194304;J[c+104>>2]=c+32;b=c+104|0;yi(a,J[a+156>>2],b);Ke(c+8|0,b,0,J[a+152>>2]);b=J[c+12>>2];J[c+16>>2]=J[c+8>>2];J[c+20>>2]=b;e=Ne(c+16|0);d=J[a+156>>2];e=d?e:J[a+140>>2]+e|0;b=J[a+152>>2];if((b|0)>=L[c+108>>1]){break c}Ke(c+8|0,c+104|0,b,1);b=J[c+12>>2];J[c+16>>2]=J[c+8>>2];J[c+20>>2]=b;H[c+28|0]=1;i=a,j=Ne(c+16|0),I[i+180>>1]=j;b=J[a+152>>2];d=J[a+156>>2]}I[a+176>>1]=K[a+145|0]+(J[a+4>>2]+e|0);I[a+178>>1]=(J[a+164>>2]+L[a+118>>1]|0)+P(J[a+108>>2],d);b=Qr(a,b,d);d:{if(b){d=J[((b&255)<<2)+825316>>2];break d}d=ue(-1,Q(.800000011920929))}J[a+168>>2]=d;$c=c+112|0}function Fg(){var a=0,b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;b=$c-2064|0;$c=b;a=K[1054292]?J[12442]>0?12:6:0;a=J[12443]==1?a+2|0:a;g=K[1054293]!=0|(K[1054704]?a+2|0:a);a=g<<5;e=a+49776|0;if((e|0)!=J[263679]){f=a+49784|0;a=J[f>>2];if(!a){c=Na(35633)|0;a:{if(!c){Pg(7597);break a}J[b+12>>2]=134217728;J[b+8>>2]=b+16;d=J[e>>2];a=b+8|0;od(a,29099);od(a,29262);h=d&1;if(h){od(a,28968);od(a,29165);i=28926}else{i=29165}od(a,i);od(a,29123);d=d&4;if(d){od(a,28991)}a=b+8|0;od(a,28623);od(a,29550);od(a,29241);if(h){od(a,28948)}if(d){od(b+8|0,29016)}a=b+8|0;od(a,1187);if(!el(c,a)){Vo(c)}d=Na(35632)|0;if(!d){Pg(7628);pa(c|0);break a}I[b+12>>1]=0;a=b+8|0;Uo(e,a);b:{if(el(d,a)){break b}J[e>>2]=J[e>>2]|128;I[b+12>>1]=0;Uo(e,a);if(el(d,a)){break b}Vo(d)}a=hc()|0;if(!a){Yd(9490)}J[f>>2]=a;Ma(a|0,c|0);Ma(a|0,d|0);na(a|0,0,4635);na(a|0,1,9594);na(a|0,2,2076);gc(a|0);La(a|0,35714,b+4|0);if(J[b+4>>2]){Ka(a|0,c|0);Ka(a|0,d|0);pa(c|0);pa(d|0);c=g<<5;j=c+49788|0,k=da(a|0,7727)|0,J[j>>2]=k;j=c+49792|0,k=da(a|0,3737)|0,J[j>>2]=k;j=c+49796|0,k=da(a|0,9601)|0,J[j>>2]=k;j=c+49800|0,k=da(a|0,15516)|0,J[j>>2]=k;j=c+49804|0,k=da(a|0,1245)|0,J[j>>2]=k;break a}J[b+4>>2]=0;La(a|0,35716,b+4|0);if(J[b+4>>2]>0){c=a;a=b+16|0;fc(c|0,2047,0,a|0);H[b+2063|0]=0;Qf(9515,a)}Yd(9515)}a=J[f>>2]}J[263679]=e;ec(a|0)}gi();$c=b+2064|0}function Wg(a,b,c,d,e,f){var g=0,h=0,i=0,j=0,k=0;g=$c-16|0;$c=g;J[g+12>>2]=f;J[g+8>>2]=e;J[g+4>>2]=d;J[g>>2]=c;f=0;d=0;while(1){a:{c=K[b+f|0];b:{if((c|0)!=37){if(!c){break a}Ud(a,c<<24>>24);e=f;break b}j=d+1|0;c=J[(d<<2)+g>>2];c:{d:{e:{f:{g:{h:{i:{j:{k:{l:{m:{n:{o:{p:{q:{e=f+1|0;d=H[e+b|0];switch(d-98|0){case 22:break h;case 16:break i;case 17:break j;case 1:break k;case 18:break l;case 14:break m;case 4:break n;case 7:break o;case 0:break p;case 2:case 5:case 8:case 9:case 10:case 11:case 12:case 13:case 15:case 19:case 20:case 21:break d;case 3:break f;case 6:break g;default:break q}}if((d|0)==37){break e}if((d|0)!=78){break d}c=L[a+4>>1];I[a+4>>1]=c+1;H[c+J[a>>2]|0]=0;break c}Yg(a,K[c|0]);break c}Yg(a,J[c>>2]);break c}e=f+2|0;$e(a,N[c>>2],H[e+b|0]-48|0);break c}c=J[c>>2];e=f+2|0;i=H[e+b|0]-48|0;f=0;h=$c-32|0;$c=h;if((i|0)>0){Gd(h,48,i)}while(1){d=(c>>>0)/10|0;H[f+h|0]=c-P(d,10)|48;f=f+1|0;k=c>>>0>9;c=d;if(k){continue}break}c=(f|0)>(i|0)?f:i;while(1){d=c-1|0;Ud(a,H[d+h|0]);f=(c|0)>1;c=d;if(f){continue}break}$c=h+32|0;break c}od(a,K[c|0]?12780:13226);break c}od(a,c);break c}ye(a,c);break c}Ud(a,H[c|0]);break c}Vm(a,J[c>>2]);break c}Vm(a,J[c>>2]);break c}c=J[c>>2];if(c+65535>>>0<=131070){Yg(a,c);break c}Vm(a,c);break c}Ud(a,37);break c}Yd(3914)}d=j}f=e+1|0;continue}break}$c=g+16|0}function me(a,b,c){var d=Q(0),e=Q(0),f=Q(0),g=Q(0),h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=Q(0),q=Q(0),r=Q(0),s=Q(0),t=Q(0),u=Q(0),v=Q(0),w=Q(0);l=N[c+52>>2];m=N[c+36>>2];n=N[c+20>>2];o=N[c+56>>2];p=N[c+40>>2];q=N[c+24>>2];h=N[c+60>>2];i=N[c+44>>2];j=N[c+28>>2];r=N[c+4>>2];s=N[c+8>>2];k=N[c+12>>2];d=N[b+12>>2];t=N[c+48>>2];e=N[b+8>>2];u=N[c+32>>2];f=N[b>>2];v=N[c>>2];w=N[c+16>>2];g=N[b+4>>2];N[a>>2]=Q(d*t)+Q(Q(e*u)+Q(Q(f*v)+Q(w*g)));N[a+12>>2]=Q(d*h)+Q(Q(e*i)+Q(Q(f*k)+Q(j*g)));N[a+8>>2]=Q(d*o)+Q(Q(e*p)+Q(Q(f*s)+Q(q*g)));N[a+4>>2]=Q(d*l)+Q(Q(e*m)+Q(Q(f*r)+Q(n*g)));d=N[b+28>>2];e=N[b+24>>2];f=N[b+16>>2];g=N[b+20>>2];N[a+28>>2]=Q(h*d)+Q(Q(i*e)+Q(Q(k*f)+Q(j*g)));N[a+24>>2]=Q(d*o)+Q(Q(e*p)+Q(Q(f*s)+Q(q*g)));N[a+20>>2]=Q(d*l)+Q(Q(e*m)+Q(Q(f*r)+Q(n*g)));N[a+16>>2]=Q(d*t)+Q(Q(e*u)+Q(Q(f*v)+Q(w*g)));d=N[b+44>>2];e=N[b+40>>2];f=N[b+32>>2];g=N[b+36>>2];N[a+44>>2]=Q(h*d)+Q(Q(i*e)+Q(Q(k*f)+Q(j*g)));N[a+40>>2]=Q(d*o)+Q(Q(e*p)+Q(Q(f*s)+Q(q*g)));N[a+36>>2]=Q(d*l)+Q(Q(e*m)+Q(Q(f*r)+Q(n*g)));N[a+32>>2]=Q(d*t)+Q(Q(e*u)+Q(Q(f*v)+Q(w*g)));d=h;h=N[b+60>>2];e=i;i=N[b+56>>2];f=k;k=N[b+48>>2];g=j;j=N[b+52>>2];N[a+60>>2]=Q(d*h)+Q(Q(e*i)+Q(Q(f*k)+Q(g*j)));N[a+56>>2]=Q(h*o)+Q(Q(i*p)+Q(Q(k*s)+Q(q*j)));N[a+52>>2]=Q(h*l)+Q(Q(i*m)+Q(Q(k*r)+Q(n*j)));N[a+48>>2]=Q(h*t)+Q(Q(i*u)+Q(Q(k*v)+Q(w*j)))}function Kl(){var a=0,b=0,c=0,d=Q(0),e=0,f=Q(0),g=Q(0),h=Q(0),i=0;b=$c-48|0;$c=b;if(K[1859276]){Ae(b,813156);c=1040332;e=Eh(J[b>>2],J[b+4>>2],J[b+8>>2]);i=(e<<2)+72272|0;a:{if(N[i>>2]==Q(0)){break a}Bi(b+12|0,b);f=N[b+12>>2];a=P(e,12)+66896|0;N[b+24>>2]=f+N[a+18432>>2];g=N[b+16>>2];N[b+28>>2]=g+N[a+18436>>2];h=N[b+20>>2];N[b+32>>2]=h+N[a+18440>>2];N[b+36>>2]=f+N[a+27648>>2];N[b+40>>2]=g+N[a+27652>>2];N[b+44>>2]=h+N[a+27656>>2];a=0;f=N[203289];b:{if(!(f>=N[b+24>>2])){break b}g=N[203290];if(!(g>=N[b+28>>2])){break b}h=N[203291];if(!(g<=N[b+40>>2])|(!(h>=N[b+32>>2])|!(f<=N[b+36>>2]))){break b}a=h<=N[b+44>>2]}if(!a){break a}c=(e<<2)+69200|0;d=N[i>>2]}c=J[c>>2];a=c;if((a|0)!=J[263619]){_o(a);J[263619]=a}c:{if(K[1040232]){if(d!=Q(0)){c=J[12427];d=Q(Q(2.995732307434082)/d);d:{if(Q(R(d))<Q(2147483648)){a=~~d;break d}a=-2147483648}c=(a|0)>(c|0)?c:a;break c}c=J[12427];break c}e:{if(d!=Q(0)){dl(1);To(d);break e}if(J[464856]){dl(1);To(Q(Q(4.605170249938965)/Q(Q(J[12426])*Q(.9900000095367432))));break e}dl(0);a=0;d=Q(J[12426]);if(d!=N[12441]){N[12441]=d;while(1){e=(a<<5)+49780|0;J[e>>2]=J[e>>2]|8;a=a+1|0;if((a|0)!=18){continue}break}gi()}}a=0;if((c|0)!=J[263625]){J[263625]=c;while(1){c=(a<<5)+49780|0;J[c>>2]=J[c>>2]|4;a=a+1|0;if((a|0)!=18){continue}break}gi()}c=J[12427]}Hg(c)}$c=b+48|0}function Ep(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0;f=$c-16|0;$c=f;j=c-1|0;g=c>>>0>=j>>>0?j:0;e=c;c=c+1|0;r=(c|0)==J[464825]?e:c;if((g|0)<=(r|0)){c=d+1|0;h=J[464826];s=(c|0)==(h|0)?d:c;c=b+1|0;e=J[464824];t=(c|0)==(e|0)?b:c;c=d-1|0;u=c>>>0<=d>>>0?c:0;c=b-1|0;v=b>>>0>=c>>>0?c:0;while(1){if((s|0)>=(u|0)){p=g<<4;w=p+16|0;k=u;while(1){if((t|0)>=(v|0)){j=k<<4;x=j+16|0;d=J[263414];l=v;while(1){y=P(P(g,h)+k|0,e)+l|0;if(!K[y+d|0]){c=J[464808];if((c|0)>(p|0)){q=l<<4;b=q+16|0;n=J[464807];B=(b|0)<(n|0)?b:n;o=J[464809];C=(o|0)>(x|0)?x:o;D=(c|0)>(w|0)?w:c;z=n;d=o;m=p;while(1){e=j;if((o|0)>(e|0)){while(1){if((n|0)>(q|0)){h=J[464818];b=J[464805];A=J[464804];c=q;while(1){i=P(P(d,m)+e|0,z)+c|0;i=K[((K[i+b|0]<<8|K[i+A|0])&h)+68432|0];if(i){J[f+8>>2]=e;J[f+4>>2]=m;J[f>>2]=c;b=i&15;H[f+12|0]=b?b:i>>>4|0;ze(1053596,f);El(!b,0);h=J[464818];A=J[464804];z=J[464807];d=J[464809];b=J[464805]}c=c+1|0;if((B|0)>(c|0)){continue}break}}e=e+1|0;if((C|0)>(e|0)){continue}break}}m=m+1|0;if((D|0)>(m|0)){continue}break}d=J[263414]}H[d+y|0]=1;h=J[464826];e=J[464824]}b=(l|0)<(t|0);l=l+1|0;if(b){continue}break}}b=(k|0)<(s|0);k=k+1|0;if(b){continue}break}}b=(g|0)<(r|0);g=g+1|0;if(b){continue}break}}H[J[263414]+a|0]=2;$c=f+16|0}function ml(a,b,c){var d=Q(0),e=Q(0),f=Q(0),g=0,h=0,i=0,j=0,k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=0,p=Q(0),q=Q(0),r=0,s=Q(0),t=Q(0),u=Q(0),v=Q(0),w=Q(0),x=Q(0),y=Q(0),z=Q(0),A=Q(0);J[263563]=b;d=Q(Q(Q(J[464806])*a)*Q(6103515625e-14));a:{if(Q(R(d))<Q(2147483648)){g=~~d;break a}g=-2147483648}if((g|0)>0){s=Q(g|0);while(1){N[263562]=Q(o|0)/s;h=zd(1054272,J[464807]);i=zd(1054272,J[464808]);b=zd(1054272,J[464809]);d=Q(Q(Q(Fd(1054272)*Fd(1054272))*Q(75))*a);b:{if(Q(R(d))<Q(2147483648)){j=~~d;break b}j=-2147483648}k=Fd(1054272);d=Fd(1054272);if((j|0)>0){e=Q(Q(k+k)*Q(3.1415927410125732));f=Q(Q(d+d)*Q(3.1415927410125732));t=Q(j|0);l=Q(h|0);m=Q(i|0);n=Q(b|0);p=Q(0);b=0;q=Q(0);while(1){u=Jd(e);v=Md(f);w=Md(e);x=Md(f);e=Jd(f);y=Fd(1054272);z=Fd(1054272);A=Fd(1054272);k=Fd(1054272);d=Jd(Q(Q(Q(b|0)*Q(3.1415927410125732))/t));l=Q(Q(u*v)+l);c:{if(Q(R(l))<Q(2147483648)){i=~~l;break c}i=-2147483648}d=Q(a*d);n=Q(Q(w*x)+n);d:{if(Q(R(n))<Q(2147483648)){h=~~n;break d}h=-2147483648}d=Q(d+Q(1));m=Q(m+e);e:{if(Q(R(m))<Q(2147483648)){r=~~m;break e}r=-2147483648}np(i,r,h,d,c);f=Q(Q(f*Q(.5))+Q(p*Q(.25)));e=Q(q*Q(.20000000298023224));q=Q(Q(Q(q*Q(.8999999761581421))+y)-z);p=Q(Q(Q(p*Q(.8999999761581421))+A)-k);b=b+1|0;if((j|0)!=(b|0)){continue}break}}o=o+1|0;if((g|0)!=(o|0)){continue}break}}}function WG(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;a:{if(K[1811801]){break a}a=J[453004];J[453004]=a+1;if((a|0)%3|0){break a}a=0;h=$c-16|0;$c=h;b:{if(!K[775860]|!J[464804]){break b}b=J[194993];if((b|0)>0){while(1){c:{if(!On(779960,h+8|0)){break c}d=J[h+8>>2];if((K[d+J[464804]|0]&254)!=10){break c}eo(d,0)}a=a+1|0;if((b|0)!=(a|0)){continue}break}}a=0;b=J[194999];if((b|0)>0){while(1){d:{if(!On(779984,h+12|0)){break d}d=J[h+12>>2];if((K[d+J[464804]|0]&254)!=8){break d}ho(d,0)}a=a+1|0;if((b|0)!=(a|0)){continue}break}}J[195002]=J[195002]+1;b=J[464808];if((b|0)<=0){break b}a=J[464809];d=0;while(1){if((a|0)>0){b=d|15;f=J[464811];j=(b|0)<(f|0)?b:f;b=J[464807];f=0;while(1){if((b|0)>0){a=f|15;e=J[464812];k=(a|0)<(e|0)?a:e;a=0;while(1){c=J[464809];e=P(P(c,d)+f|0,b)+a|0;g=P(P(c,j)+k|0,b);b=a|15;c=J[464810];b=(g+((b|0)<(c|0)?b:c)|0)-e|0;c=e+zd(780024,b)|0;g=K[c+J[464804]|0];i=J[(g<<2)+776888>>2];if(i){bd[i|0](c,g)}c=zd(780024,b)+e|0;g=K[c+J[464804]|0];i=J[(g<<2)+776888>>2];if(i){bd[i|0](c,g)}b=zd(780024,b)+e|0;e=K[b+J[464804]|0];c=J[(e<<2)+776888>>2];if(c){bd[c|0](b,e)}a=a+16|0;b=J[464807];if((a|0)<(b|0)){continue}break}a=J[464809]}f=f+16|0;if((f|0)<(a|0)){continue}break}b=J[464808]}d=d+16|0;if((d|0)<(b|0)){continue}break}}$c=h+16|0;qs()}return 1}function Ne(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=Q(0);b=J[a+8>>2];a:{if(!J[b>>2]){if(!J[206585]){c=$c-32|0;$c=c;b=a;d=J[b+4>>2];J[c+24>>2]=J[b>>2];J[c+28>>2]=d;a=L[J[b+8>>2]+4>>1];H[c+15|0]=102;h=a>>>0<8?1:a>>>3|0;if(Df(c+24|0,c+16|0,c+15|0)){d=h<<1;while(1){f=0;e=L[c+20>>1];if(e){while(1){a=d;g=K[J[c+16>>2]+f|0];if((g|0)!=32){g=(g-33&255)>>>0>=94?42848:(g<<3)+41832|0;a=0;e=0;while(1){j=K[e+g|0];a=(a|0)>(j|0)?a:j;e=e+1|0;if((e|0)!=8){continue}break}a=P(h,oi(a)+2|0);e=L[c+20>>1]}i=a+i|0;f=f+1|0;if(f>>>0<e>>>0){continue}break}}if(Df(c+24|0,c+16|0,c+15|0)){continue}break}}$c=c+32|0;return(K[b+12|0]?h:0)+((i|0)<=1?1:i)|0}e=L[b+4>>1];h=Ge(e,8);f=L[a+4>>1];if(!f){break a}i=J[a>>2];b=0;while(1){b:{c:{g=K[b+i|0];if((g|0)!=38){break c}c=b+1|0;if((c|0)>=(f|0)|M[(K[c+i|0]<<2)+825316>>2]<=16777215){break c}b=c;break b}d=Ge(P(e,J[(g<<2)+826352>>2]),J[12318])+(d+h|0)|0}b=b+1|0;if((f|0)>(b|0)){continue}break}if(!d){return 0}return(d-(K[J[a+8>>2]+6|0]&4?0:h)|0)+(K[a+12|0]?e>>>3|0:0)|0}b=$c-624|0;$c=b;d=J[a+8>>2];c=J[a+4>>2];J[b+616>>2]=J[a>>2];J[b+620>>2]=c;Ga(J[d>>2],L[d+4>>1],L[d+6>>1]);if(Df(b+616|0,b+608|0,b+607|0)){while(1){a=b+608|0;k=k+ +Xb(b|0,Rf(b,a)|0);if(Df(b+616|0,a,b+607|0)){continue}break}l=Q(k)}else{l=Q(0)}d=Ig(l);$c=b+624|0}return d}function mh(a,b){var c=0,d=Q(0),e=0,f=0,g=0,h=Q(0);f=$c-16|0;$c=f;c=-1;e=ys(a,b);a:{if((e|0)==-1){break a}Qe(f,a,e);g=J[f+4>>2];e=J[f>>2];J[f+8>>2]=e;J[f+12>>2]=g;e=g-b|0;I[f+12>>1]=e;e=e&65535;if(e>>>0>3){break a}b=b+e|0;b:{c:{switch(fp(f+8|0)|0){case 0:d=Q(N[263541]-Q(J[263544]));h=Q(N[263539]-Q(J[263542]));d:{e:{if(h<Q(.5)){c=18031;if(d<Q(.5)){break e}}if(h>=Q(.5)){c=18934;if(d<Q(.5)){break e}}if(h<Q(.5)){c=18027;if(d>=Q(.5)){break e}}if(!(h>=Q(.5))){break d}c=18914;if(!(d>=Q(.5))){break d}}jh(a,b,c)}c=mh(a,b);if((c|0)==-1){break b}break a;case 1:jh(a,b,Q(N[263540]-Q(J[263543]))>=Q(.5)?18065:19093);c=mh(a,b);if((c|0)==-1){break b}break a;case 2:d=Cf(N[J[207101]+20>>2]);f:{if(d>=Q(45)){c=18996;if(d<Q(135)){break f}}if(d>=Q(135)){c=18377;if(d<Q(225)){break f}}c=d>=Q(225)?d<Q(315)?18035:18549:18549}jh(a,b,c);c=mh(a,b);if((c|0)==-1){break b}break a;case 3:break c;default:break a}}c=19005;jh(a,b,19005);if((rl(a)|0)==-1){d=Cf(N[J[207101]+20>>2]);if(d<Q(45)){c=18859}else{c=d>Q(315)?18859:d>=Q(135)?d<Q(225)?18859:18329:18329}jh(a,b,c);c=mh(a,b);if((c|0)==-1){break b}break a}e=K[1054181];g=e&254;g:{h:{if((g|0)==4){break h}c=18859;if(e>>>0<2){break h}c=18329;if((g|0)!=2){break g}}jh(a,b,c)}c=mh(a,b);if((c|0)!=-1){break a}}c=rl(a)}$c=f+16|0;return c}function bq(a,b,c){var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=0,p=0,q=0,r=0,s=0;e=$c-48|0;$c=e;Ae(e+36|0,b);Ae(e+24|0,b+12|0);d=J[e+36>>2];J[e+36>>2]=(d|0)>0?d:0;d=J[e+24>>2];f=J[464810];h=(d|0)<(f|0)?d:f;J[e+24>>2]=h;d=J[e+40>>2];i=(d|0)>0?d:0;J[e+40>>2]=i;d=J[e+28>>2];f=J[464811];d=(d|0)<(f|0)?d:f;J[e+28>>2]=d;f=J[e+44>>2];J[e+44>>2]=(f|0)>0?f:0;f=J[e+32>>2];g=J[464812];g=(f|0)<(g|0)?f:g;J[e+32>>2]=g;l=Q(1e9);if((d|0)>=(i|0)){while(1){j=J[e+44>>2];if((j|0)<=(g|0)){m=Q(i|0);while(1){d=J[e+36>>2];if((h|0)>=(d|0)){n=Q(j|0);g=J[464818];o=J[464805];p=J[464804];q=J[464807];r=J[464809];while(1){f=d;d=P(P(i,r)+j|0,q)+d|0;h=(K[d+o|0]<<8|K[d+p|0])&g;a:{if(!h){break a}s=h+66896|0;if(!c&K[s+8448|0]==2){break a}d=P(h,12)+66896|0;k=Q(f|0);N[e>>2]=N[d+18432>>2]+k;N[e+4>>2]=N[d+18436>>2]+m;N[e+8>>2]=N[d+18440>>2]+n;N[e+12>>2]=N[d+27648>>2]+k;N[e+16>>2]=N[d+27652>>2]+m;N[e+20>>2]=N[d+27656>>2]+n;d=gg(e,b);g=J[464818];o=J[464805];p=J[464804];q=J[464807];r=J[464809];if(!d){break a}k=N[(h<<2)+76880>>2];l=l<k?l:k;if(K[s+9216|0]!=1){break a}H[a|0]=1}d=f+1|0;h=J[e+24>>2];if((f|0)<(h|0)){continue}break}g=J[e+32>>2]}d=(g|0)>(j|0);j=j+1|0;if(d){continue}break}d=J[e+28>>2]}f=(d|0)>(i|0);i=i+1|0;if(f){continue}break}}$c=e+48|0;return l}function eK(a){a=a|0;var b=0,c=0,d=0,e=Q(0),f=0;b=$c-144|0;$c=b;c=L[a+60>>1]+66896|0;a:{if(K[c+13824|0]==4|K[c+8448|0]!=2){break a}J[b+128>>2]=J[a+20>>2];c=J[a+16>>2];J[b+120>>2]=J[a+12>>2];J[b+124>>2]=c;J[b+112>>2]=J[a+136>>2];c=J[a+132>>2];J[b+104>>2]=J[a+128>>2];J[b+108>>2]=c;J[b+96>>2]=J[a+44>>2];c=J[a+40>>2];J[b+88>>2]=J[a+36>>2];J[b+92>>2]=c;J[b+80>>2]=J[a+56>>2];c=J[a+52>>2];J[b+72>>2]=J[a+48>>2];J[b+76>>2]=c;c=b+140|0;f=b+136|0;if(!nk(b+120|0,b+104|0,b+88|0,b+72|0,c,f)){break a}N[a+36>>2]=N[a+36>>2]+Q(-.10000000149011612);N[a+48>>2]=N[a+48>>2]+Q(.10000000149011612);N[a+40>>2]=N[a+40>>2]+Q(-.10000000149011612);N[a+44>>2]=N[a+44>>2]+Q(-.10000000149011612);N[a+52>>2]=N[a+52>>2]+Q(.10000000149011612);N[a+56>>2]=N[a+56>>2]+Q(.10000000149011612);J[b- -64>>2]=J[a+20>>2];d=J[a+16>>2];J[b+56>>2]=J[a+12>>2];J[b+60>>2]=d;J[b+48>>2]=J[a+136>>2];d=J[a+132>>2];J[b+40>>2]=J[a+128>>2];J[b+44>>2]=d;J[b+32>>2]=J[a+44>>2];d=J[a+40>>2];J[b+24>>2]=J[a+36>>2];J[b+28>>2]=d;J[b+16>>2]=J[a+56>>2];d=J[a+52>>2];J[b+8>>2]=J[a+48>>2];J[b+12>>2]=d;nk(b+56|0,b+40|0,b+24|0,b+8|0,c,f);e=N[b+140>>2];N[a+100>>2]=Q(e*N[a+24>>2])+N[a+12>>2];N[a+104>>2]=Q(e*N[a+28>>2])+N[a+16>>2];N[a+108>>2]=Q(e*N[a+32>>2])+N[a+20>>2];wt(a);d=1}$c=b+144|0;return d|0}function Rq(a,b){var c=0,d=0,e=0,f=0,g=0,h=0;g=$c-16|0;$c=g;h=Sq(a);qf(b);e=$c-16|0;$c=e;a:{b:{if(!zh(17323,H[a|0])){J[467445]=28;break b}d=Sq(a);J[e>>2]=438;J[e+4>>2]=0;f=_l(tc(-100,2285,d|32768,e|0)|0);if((f|0)<0){break a}d=$c-32|0;$c=d;c:{d:{e:{if(!zh(17323,H[a|0])){J[467445]=28;break e}c=xh(1176);if(c){break d}}c=0;break c}Gd(c,0,144);if(!zh(a,43)){J[c>>2]=K[a|0]==114?8:4}f:{if(K[a|0]!=97){a=J[c>>2];break f}a=Sa(f|0,3,0)|0;if(!(a&1024)){a=a|1024;J[d+16>>2]=a;J[d+20>>2]=a>>31;Sa(f|0,4,d+16|0)|0}a=J[c>>2]|128;J[c>>2]=a}J[c+80>>2]=-1;J[c+48>>2]=1024;J[c+60>>2]=f;J[c+44>>2]=c+152;g:{if(a&8){break g}J[d>>2]=d+24;J[d+4>>2]=0;if(sc(f|0,21523,d|0)|0){break g}J[c+80>>2]=10}J[c+40>>2]=1173;J[c+36>>2]=1174;J[c+32>>2]=1175;J[c+12>>2]=1176;if(!K[1869785]){J[c+76>>2]=-1}a=J[467461];J[c+56>>2]=a;if(a){J[a+52>>2]=c}J[467461]=c}$c=d+32|0;if(c){break a}Qa(f|0)|0}c=0}$c=e+16|0;h:{if(c){i:{a=J[c+60>>2];d=J[b+60>>2];j:{if((a|0)==(d|0)){J[c+60>>2]=-1;break j}f=h&524288;while(1){e=qc(a|0,d|0,f|0)|0;if((e|0)==-10){continue}break}if((_l(e)|0)<0){break i}}J[b>>2]=J[c>>2]|J[b>>2]&1;J[b+32>>2]=J[c+32>>2];J[b+36>>2]=J[c+36>>2];J[b+40>>2]=J[c+40>>2];J[b+12>>2]=J[c+12>>2];$l(c);J[b+136>>2]=0;J[b+72>>2]=0;break h}$l(c)}$l(b);b=0}$c=g+16|0;return b}function gA(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;c=$c-2352|0;$c=c;f=c+2136|0;J[f>>2]=0;J[f+4>>2]=0;J[c+2128>>2]=0;J[c+2132>>2]=0;J[c+2348>>2]=8388608;J[c+2344>>2]=c+2208;Ds(c+8|0,a,c- -64|0);n=c+2142|0;g=c+2192|0;o=c+2138|0;h=c+2184|0;a=c+2128|0;p=a|6;i=c+2176|0;q=a|4;j=c+2168|0;r=a|2;k=c+2160|0;l=c+2144|8;while(1){a:{a=ek(c+8|0,c+2344|0);b:{if(a){if((a|0)==-857812991){break b}Af(a,9389,b);break b}if(!L[c+2348>>1]|K[J[c+2344>>2]]==35){continue}a=c+2344|0;if((Ag(a,32,c+2144|0,7)|0)<=6){Od(6430,a);continue}a=c+2144|0;if(!(s=Mh(a,c+2127|0),t=0,u=K[c+2127|0]<16,u?s:t)){Od(6647,a);continue}if(!(s=Mh(l,c+2126|0),t=0,u=K[c+2126|0]<32,u?s:t)){Od(6582,l);continue}if(!Hi(k,r)){Od(6614,k);continue}if(!Hi(j,q)){Od(6549,j);continue}if(!(s=Hi(i,p),t=0,u=L[c+2134>>1],u?s:t)){Od(6499,i);continue}if(!Hi(h,o)){Od(6379,h);continue}if(!Hi(g,n)){Od(6348,g);continue}a=J[13647];if((a|0)!=512){break a}pd(4769)}$c=c+2352|0;return}J[13647]=a+1;I[c+2128>>1]=K[c+2127|0]+(K[c+2126|0]<<4);d=J[f+4>>2];e=a<<4;a=e+54600|0;m=J[f>>2];I[a>>1]=m;I[a+2>>1]=m>>>16;I[a+4>>1]=d;I[a+6>>1]=d>>>16;d=J[c+2132>>2];a=e+54592|0;e=J[c+2128>>2];I[a>>1]=e;I[a+2>>1]=e>>>16;I[a+4>>1]=d;I[a+6>>1]=d>>>16;continue}}function kk(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;d=$c-32|0;$c=d;b=J[a+56>>2];a:{if(!b){break a}if(!K[a+52|0]){if((b|0)>0){while(1){c=b-1|0;if(L[((c<<1)+a|0)+152>>1]==65535){bt(a,c)}e=b>>>0>1;b=c;if(e){continue}break}b=J[a+56>>2]}J[444631]=842;Ni(0,b-1|0);J[444631]=843;if(J[a+56>>2]<=0){break a}while(1){e=(h<<1)+a|0;i=(L[e+152>>1]<<1)+828408|0;$d(d+24|0,829176,L[i>>1]-1|0);b=511;if((h|0)<=510){while(1){c=a+152|0;g=c+(b<<1)|0;f=c;c=b-1|0;I[g>>1]=L[f+(c<<1)>>1];b=P(b,28)+a|0;J[b+1200>>2]=J[b+1172>>2];g=b+1164|0;j=J[g+4>>2];f=b+1192|0;J[f>>2]=J[g>>2];J[f+4>>2]=j;g=b+1156|0;j=J[g+4>>2];f=b+1184|0;J[f>>2]=J[g>>2];J[f+4>>2]=j;f=b+1176|0;b=b+1148|0;g=J[b+4>>2];J[f>>2]=J[b>>2];J[f+4>>2]=g;b=c;if((h|0)<(b|0)){continue}break}}I[e+152>>1]=65535;c=0;b=(P(h,28)+a|0)+1176|0;J[b>>2]=0;e=b;b=d+24|0;at(e,a,b);J[a+56>>2]=J[a+56>>2]+1;$d(b,829176,L[i>>1]-1|0);e=h+1|0;b=e;b:{if((b|0)>=J[a+56>>2]){break b}while(1){$d(d+8|0,829176,L[(L[((b<<1)+a|0)+152>>1]<<1)+828408>>1]-1|0);i=J[d+12>>2];J[d+16>>2]=J[d+8>>2];J[d+20>>2]=i;if(!fg(d+24|0,d+16|0)){break b}c=c+1|0;b=b+1|0;if((b|0)<J[a+56>>2]){continue}break}}Ni(e,c+h|0);h=c+e|0;if((h|0)<J[a+56>>2]){continue}break}break a}J[444631]=843;Ni(0,b-1|0)}ct(a);H[a+7|0]=1;$c=d+32|0}function ao(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;if(J[268511]>0){k=P(P(J[268510],a),20);l=a+1072992|0;a=0;while(1){h=J[J[268512]+(a<<2)>>2];b=J[h+16>>2];a:{if(!b){break a}b=b+k|0;i=J[b>>2];if((i|0)<0){break a}j=L[b+18>>1];e=L[b+16>>1];f=L[b+14>>1];c=L[b+12>>1];g=L[b+10>>1];d=L[b+8>>1];H[l|0]=1;Ro(J[h+8>>2]);b:{c:{d:{e:{f:{g:{h:{if(!K[1074016]){b=K[h+7|0];if(!(b&1)){break h}if(!(b&2)){break g}}b=(d|0)!=0;if(!b|!g){break f}b=d+g|0;ve(b,i);break c}if(!(b&2)){break b}break d}if(d){break e}break b}if(!b){break d}}ve(d,i);b=d;break c}if(!g){break b}ve(g,d+i|0);b=g}J[263512]=J[263512]+b}d=g+(d+i|0)|0;i:{j:{k:{l:{m:{n:{o:{if(!K[1074016]){b=K[h+7|0];if(!(b&4)){break o}if(!(b&8)){break n}}b=(c|0)!=0;if(!b|!f){break m}b=c+f|0;ve(b,d);break j}if(!(b&8)){break i}break k}if(c){break l}break i}if(!b){break k}}ve(c,d);b=c;break j}if(!f){break i}ve(f,c+d|0);b=f}J[263512]=J[263512]+b}b=d+(c+f|0)|0;p:{q:{r:{s:{t:{u:{if(!K[1074016]){c=K[h+7|0];if(!(c&16)){break u}if(!(c&32)){break t}}c=(e|0)!=0;if(!c|!j){break s}e=e+j|0;break r}if(!(c&32)){break a}break q}if(e){break r}break a}if(!c){break q}}ve(e,b);break p}if(!j){break a}ve(j,b+e|0);e=j}J[263512]=J[263512]+e}a=a+1|0;if((a|0)<J[268511]){continue}break}}}function Sp(){var a=0,b=0,c=0,d=0,e=0,f=Q(0),g=0,h=0,i=0,j=0,k=0,l=0,m=0;a:{b=J[464850]+J[464849]|0;if(J[260076]?N[203290]<Q(b>>31&b):0){break a}b=J[260079];if(!b){b=$c-80|0;$c=b;b:{if(!K[1859276]|K[1054441]&16){break b}d=L[929696];if(K[d+80720|0]==4){break b}a=J[464809];J[b+76>>2]=a;J[b+68>>2]=0;J[b+60>>2]=a;J[b+52>>2]=0;J[b+36>>2]=a;f=Q(Q(J[12426])*Q(1.4142135381698608));c:{if(Q(R(f))<Q(2147483648)){a=~~f;break c}a=-2147483648}J[b+72>>2]=a;J[b+56>>2]=a;J[b+44>>2]=a;g=J[464807];e=g+(a<<1)|0;J[b+40>>2]=e;J[b+64>>2]=g;J[b+28>>2]=a;a=0-a|0;J[b+20>>2]=a;J[b+16>>2]=a;J[b+48>>2]=a;J[b+32>>2]=a;J[b+24>>2]=e;J[260081]=0;while(1){a=(b+16|0)+(c<<4)|0;a=Jg(J[a+8>>2],J[a+12>>2])+J[260081]|0;J[260081]=a;c=c+1|0;if((c|0)!=4){continue}break}a=ih(a);J[260079]=a;l=b,m=qe(1,J[260081]),J[l+12>>2]=m;a=d+66896|0;c=K[a+1536|0]?-1:J[464863];if(K[a+16128|0]){c=sd(c,J[(d<<2)+69200>>2])}a=P(d,12)+66896|0;j=a+18436|0;k=a+36868|0;d=a+18432|0;g=a+36864|0;f=Q(J[464849]);while(1){h=(b+16|0)+(i<<4)|0;e=J[h>>2];a=J[h+4>>2];Jl(e,a,J[h+8>>2]+e|0,J[h+12>>2]+a|0,f,c,Q(N[g>>2]-N[d>>2]),Q(N[k>>2]-N[j>>2]),b+12|0);i=i+1|0;if((i|0)!=4){continue}break}hh()}$c=b+80|0;b=J[260079];if(!b){break a}}Vp(L[929696],b,J[260080],J[260081])}}function qs(){var a=0,b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;a=$c-624|0;$c=a;if(Mj(J[461354],a)){a:{if(K[a+305|0]){Ee(a+312|0,a,128);b:{if(K[1869164]){break b}c=a+616|0;Ee(c,a,128);b=a+600|0;Ee(b,a+240|0,64);ps(c,1845432,b,2244);d=a+320|0;Ee(d,a+176|0,64);e=J[a+324>>2];J[a+600>>2]=J[a+320>>2];J[a+604>>2]=e;ps(c,1850584,b,2350);J[a+596>>2]=17039360;b=J[10439];J[a+608>>2]=J[10438];J[a+612>>2]=b;J[a+592>>2]=d;d=a+592|0;Om(d,a+608|0,c);f=J[a+156>>2];g=J[a+160>>2];b=$c-672|0;$c=b;e=b+12|0;Je(e,d);d=dr(b+668|0,e);e=b+612|0;gk(e,J[b+668>>2]);if(!d){d=ce(e,f,g);d=(h=d,i=bd[J[b+640>>2]](e)|0,j=d,j?h:i)}$c=b+672|0;if(!d){break b}Af(d,12277,c)}b=a+312|0;if(!Uf(53296,b)){break a}c=a+320|0;fk(c,J[a+156>>2],J[a+160>>2]);Nm(c,b);H[1845412]=0;break a}if(J[a+152>>2]){b=$c-528|0;$c=b;J[b+524>>2]=33554432;J[b+520>>2]=b;c=$c-16|0;$c=c;J[c+12>>2]=J[a+152>>2];d=b+520|0;xe(d,17109,c+12|0,10784);fj(d,J[c+12>>2],1152);$c=c+16|0;c=J[a+172>>2];if(!(!c|!K[c|0])){Hd(d,17152,c)}bd[J[12861]](b+520|0);$c=b+528|0;break a}b=J[a+144>>2];if((b|0)==200|(b|0)==304){break a}if((b|0)==404){pd(10694);pd(2586);break a}c=a+144|0;if((b&-3)==401){Od(10753,c);pd(16059);break a}Od(10646,c)}Oj(a)}$c=a+624|0}function xl(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0;f=$c-16|0;$c=f;c=bd[J[a+4>>2]](a,f+13|0)|0;a:{if(c){break a}c=-857812922;b:{switch(K[f+13|0]-112|0){case 0:c=0;J[b>>2]=0;break a;case 1:c=Oh(a,f+8|0);if(c){break a}a=0;c=-857812918;e=J[263433];if((e|0)<=0){break a}g=J[263432];i=J[f+8>>2];while(1){h=g+P(a,2348)|0;if((i|0)==J[h+2336>>2]){J[b>>2]=h;c=0;break a}a=a+1|0;if((e|0)!=(a|0)){continue}break};break a;case 2:break b;default:break a}}c=-857812919;g=J[263433];if((g|0)>29){break a}J[263433]=g+1;d=b;i=J[263432];b=P(g,2348);c=i+b|0;J[d>>2]=c;c=li(a,c);if(c){break a}c=bd[J[a+12>>2]](a,8)|0;if(c){break a}e=b+i|0;c=bd[J[a+4>>2]](a,e+48|0)|0;if(c){break a}b=J[263434];J[e+2336>>2]=b;J[263434]=b+1;b=f+14|0;c=Sd(a,b,2);if(c){break a}b=vd(b);J[e+52>>2]=b;c=-857812921;if(b>>>0>38){break a}if(b){b=0;while(1){h=$c+-64|0;$c=h;d=(e+P(b,60)|0)+56|0;c=bd[J[a+4>>2]](a,d)|0;c:{if(c){break c}c=li(a,d+1|0);if(c){break c}d=K[d|0];if((d|0)!=91){c=0;if((d|0)!=76){break c}}d=h+12|0;c=bd[J[a+4>>2]](a,d)|0;if(c){break c}c=ki(a,d)}$c=h- -64|0;if(c){break a}b=b+1|0;if((b|0)<J[e+52>>2]){continue}break}}c=vp(a);if(c){break a}c=xl(a,(i+P(g,2348)|0)+2340|0)}$c=f+16|0;return c}function _G(){var a=0,b=0,c=0,d=0,e=0;J[452947]=1811952;J[452945]=1811888;J[452943]=1811824;H[1811820]=0;J[452948]=4194304;J[452946]=4194304;J[452944]=4194304;a:{if(!L[905906]){H[1811801]=0;H[1811802]=0;H[1811803]=0;H[1811804]=0;H[1811805]=0;nd(1045796,0,29);a=Id(6174,1);J[194990]=0;J[194991]=0;H[775860]=a;J[194992]=0;J[194993]=0;J[194994]=0;J[194995]=0;J[194996]=0;J[194997]=0;J[194998]=0;J[194999]=0;J[195e3]=0;J[195001]=0;J[194491]=30;J[194490]=30;J[194235]=30;J[194234]=30;J[193979]=30;J[193978]=30;J[194228]=31;J[194225]=32;J[194262]=33;J[194260]=34;J[194259]=34;J[194224]=35;J[194488]=36;J[194261]=33;J[194486]=37;J[194497]=38;J[194753]=39;J[193974]=37;J[193975]=37;J[193976]=36;J[193977]=36;J[194230]=40;J[194231]=40;J[194232]=41;J[194233]=41;J[194522]=42;if(!K[1054197]){J[194524]=43;J[194528]=44}H[1811804]=1;H[1811800]=1;H[1811805]=!K[1054197];b=949;c=950;d=951;e=953;a=952;break a}J[452950]=0;J[458128]=1812032;I[905902]=0;b=954;c=955;d=956;e=958;a=957}J[452942]=b;J[452940]=c;J[452939]=d;J[452938]=a;J[452937]=e;J[263498]=a;J[263497]=1015580809;ji(1053984);od(1811788,17194);od(1811788,J[13565]);if(K[1055388]){I[905896]=0;od(1811788,14019)}}function Ni(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;d=$c-32|0;$c=d;if((a|0)<(b|0)){m=J[444631];while(1){n=L[((a+b|0)/2<<1)+1778528>>1];h=b;i=a;while(1){c=i;i=c+1|0;g=(c<<1)+1778528|0;if((bd[m|0](n,L[g>>1])|0)>0){continue}while(1){e=h;h=e-1|0;f=(e<<1)+1778528|0;if((bd[m|0](n,L[f>>1])|0)<0){continue}break}a:{if((c|0)>(e|0)){i=c;h=e;break a}j=L[g>>1];I[g>>1]=L[f>>1];I[f>>1]=j;c=P(c,28);l=c+1779576|0;J[d+24>>2]=J[l>>2];g=c+1779568|0;f=J[g+4>>2];J[d+16>>2]=J[g>>2];J[d+20>>2]=f;f=c+1779560|0;j=J[f+4>>2];J[d+8>>2]=J[f>>2];J[d+12>>2]=j;j=c+1779552|0;c=j;k=J[c+4>>2];J[d>>2]=J[c>>2];J[d+4>>2]=k;k=l;c=P(e,28);l=c+1779576|0;J[k>>2]=J[l>>2];e=c+1779568|0;k=J[e+4>>2];J[g>>2]=J[e>>2];J[g+4>>2]=k;g=c+1779560|0;k=J[g+4>>2];J[f>>2]=J[g>>2];J[f+4>>2]=k;c=c+1779552|0;f=J[c+4>>2];J[j>>2]=J[c>>2];J[j+4>>2]=f;J[l>>2]=J[d+24>>2];f=J[d+20>>2];J[e>>2]=J[d+16>>2];J[e+4>>2]=f;e=J[d+12>>2];J[g>>2]=J[d+8>>2];J[g+4>>2]=e;e=J[d+4>>2];J[c>>2]=J[d>>2];J[c+4>>2]=e}if((h|0)>=(i|0)){continue}break}b:{c:{if((h-a|0)<=(b-i|0)){if((a|0)>=(h|0)){break c}Ni(a,h);break c}if((b|0)>(i|0)){Ni(i,b)}b=h;break b}a=i}if((a|0)<(b|0)){continue}break}}$c=d+32|0}function Bl(a,b,c,d,e,f){var g=0,h=0,i=0;g=$c-240|0;$c=g;a:{if(!a){f=0;break a}J[g+24>>2]=4194304;J[g+28>>2]=0;J[g+236>>2]=f;J[g+12>>2]=d;H[g+16|0]=a;J[g+20>>2]=g+168;if(b){f=xp(c,g+20|0);if(f){break a}}f=-857812912;b:{c:{d:{switch(a-1|0){case 1:a=g+6|0;f=Sd(c,a,2);h=g,i=vd(a),I[h+32>>1]=i;break c;case 2:case 4:f=Oh(c,g+32|0);break c;case 3:case 5:f=bd[J[c+12>>2]](c,8)|0;break c;case 6:f=Oh(c,g+28|0);if(f){break a}a=J[g+28>>2];if(a>>>0<=64){f=Sd(c,g+32|0,a);break c}a=wf(a,1);J[g+32>>2]=a;if(!a){f=-857812988;break a}f=Sd(c,a,J[g+28>>2]);if(!f){break b}qd(J[g+32>>2]);break a;case 7:J[g+36>>2]=8388608;J[g+32>>2]=g+40;f=xp(c,g+32|0);break c;case 8:f=Sd(c,g+6|0,5);if(f){break a}b=K[g+6|0];H[g+11|0]=b;d=ud(g+7|0);if(!d){break b}a=0;while(1){f=Bl(b,0,c,g+12|0,e,a);if(f){break a}a=a+1|0;if((d|0)!=(a|0)){continue}break};break b;case 9:while(1){f=bd[J[c+4>>2]](c,g+11|0)|0;if(f){break c}a=K[g+11|0];if(!a){break c}f=Bl(a,1,c,g+12|0,e,0);if(!f){continue}break};break a;case 0:break d;default:break a}}f=bd[J[c+4>>2]](c,g+32|0)|0}if(f){break a}}J[g+232>>2]=0;bd[e|0](g+12|0);if(M[g+28>>2]>=65){qd(J[g+32>>2])}f=J[g+232>>2]}$c=g+240|0;return f}function yo(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0;a:{a=J[264085];b:{if(a){if(bd[a|0](b,d)|0){break b}}if(!(!(K[1056204]|K[1056205])|(b|0)!=4)){Yq();return}if(!(Ue(19,b,d)?c:1)){break a}e=1;if(!c){e=0;c=0;while(1){a=c;c:{if(!Ue(a,b,d)){break c}f=a+1065568|0;H[f|0]=K[f|0]|K[d|0];c=J[(a<<2)+1065632>>2];if(!c){break c}e=bd[c|0](b,d)|e}c=a+1|0;if(a>>>0<=48){continue}break}e=(e&255)!=0}c=0;if(J[263682]>0){while(1){a=J[(c<<2)+1054816>>2];H[a+7|0]=1;if(bd[J[J[a>>2]+20>>2]](a,b,d)|0){break b}c=c+1|0;if((c|0)<J[263682]){continue}break}}if(J[263697]){break b}if(!(J[d+40>>2]!=(b|0)&J[d+44>>2]!=(b|0))){H[1066044]=1;gh();return}if(e){break b}if(!(!K[1054197]|(b|0)!=5)){sm(!J[464855]);return}c=$c-16|0;$c=c;a=0;d=J[265102];d:{if((d|0)>0){e=(K[1056202]|K[1056203])!=0;e=K[1056200]|K[1056201]?e|2:e;e=K[1056204]|K[1056205]?e|4:e;while(1){f=(a<<3)+1058352|0;g=K[f+5|0];if(!((g|0)!=(e&g)|K[f+4|0]!=(b|0))){break d}a=a+1|0;if((d|0)!=(a|0)){continue}break}}a=-1}e:{if((a|0)==-1){break e}b=c+8|0;a=(a<<3)+1058352|0;$d(b,1060400,J[a>>2]);if(!(H[a+6|0]&1)){_m(b,0);break e}if(J[263697]){break e}Oi(c+8|0)}$c=c+16|0}return}H[1053956]=1}function IF(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;a=$c-128|0;$c=a;J[a+100>>2]=4194304;J[a+96>>2]=a+32;re(J[b>>2],J[b+4>>2],J[b+8>>2],c);c=b+8|0;a:{if(!K[825217]){d=J[b+4>>2];J[206305]=J[b>>2];J[206306]=d;J[206307]=J[c>>2];H[825217]=1;d=a+96|0;Wg(d,26247,J[206301],b,b+4|0,c);ne(d,256);break a}d=J[b+4>>2];J[206308]=J[b>>2];J[206309]=d;J[206310]=J[c>>2];b=J[206305];c=J[206308];J[a+116>>2]=(b|0)<(c|0)?b:c;b=J[206306];c=J[206309];J[a+120>>2]=(b|0)<(c|0)?b:c;b=J[206307];c=J[206310];J[a+124>>2]=(b|0)<(c|0)?b:c;b=J[206305];c=J[206308];J[a+104>>2]=(b|0)>(c|0)?b:c;b=J[206306];c=J[206309];J[a+108>>2]=(b|0)>(c|0)?b:c;b=J[206307];c=J[206310];J[a+112>>2]=(b|0)>(c|0)?b:c;b=J[464807];b:{if(b>>>0<=M[a+116>>2]){break b}c=J[464808];if(c>>>0<=M[a+120>>2]){break b}d=J[464809];if(d>>>0<=M[a+124>>2]|b>>>0<=M[a+104>>2]|(c>>>0<=M[a+108>>2]|d>>>0<=M[a+112>>2])){break b}J[a+24>>2]=J[a+124>>2];J[a+8>>2]=J[a+112>>2];b=J[a+120>>2];J[a+16>>2]=J[a+116>>2];J[a+20>>2]=b;b=J[a+108>>2];J[a>>2]=J[a+104>>2];J[a+4>>2]=b;bd[J[206302]](a+16|0,a)}if(K[825216]){_d(1043716,0,83);H[825216]=0}H[825217]=0;if(!K[825244]){ne(41752,256);break a}Im()}$c=a+128|0}function Qd(a,b,c){var d=0,e=0,f=0;if(c>>>0>=512){vc(a|0,b|0,c|0);return a}e=a+c|0;a:{if(!((a^b)&3)){b:{if(!(a&3)){c=a;break b}if(!c){c=a;break b}c=a;while(1){H[c|0]=K[b|0];b=b+1|0;c=c+1|0;if(!(c&3)){break b}if(c>>>0<e>>>0){continue}break}}d=e&-4;c:{if(d>>>0<64){break c}f=d+-64|0;if(f>>>0<c>>>0){break c}while(1){J[c>>2]=J[b>>2];J[c+4>>2]=J[b+4>>2];J[c+8>>2]=J[b+8>>2];J[c+12>>2]=J[b+12>>2];J[c+16>>2]=J[b+16>>2];J[c+20>>2]=J[b+20>>2];J[c+24>>2]=J[b+24>>2];J[c+28>>2]=J[b+28>>2];J[c+32>>2]=J[b+32>>2];J[c+36>>2]=J[b+36>>2];J[c+40>>2]=J[b+40>>2];J[c+44>>2]=J[b+44>>2];J[c+48>>2]=J[b+48>>2];J[c+52>>2]=J[b+52>>2];J[c+56>>2]=J[b+56>>2];J[c+60>>2]=J[b+60>>2];b=b- -64|0;c=c- -64|0;if(f>>>0>=c>>>0){continue}break}}if(c>>>0>=d>>>0){break a}while(1){J[c>>2]=J[b>>2];b=b+4|0;c=c+4|0;if(d>>>0>c>>>0){continue}break}break a}if(e>>>0<4){c=a;break a}d=e-4|0;if(d>>>0<a>>>0){c=a;break a}c=a;while(1){H[c|0]=K[b|0];H[c+1|0]=K[b+1|0];H[c+2|0]=K[b+2|0];H[c+3|0]=K[b+3|0];b=b+4|0;c=c+4|0;if(d>>>0>=c>>>0){continue}break}}if(c>>>0<e>>>0){while(1){H[c|0]=K[b|0];b=b+1|0;c=c+1|0;if((e|0)!=(c|0)){continue}break}}return a}function us(a,b,c,d,e){var f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;f=$c-32|0;$c=f;g=J[a+4>>2];J[f+24>>2]=J[a>>2];J[f+28>>2]=g;g=J[a+8>>2];a=L[g+4>>1];H[f+15|0]=102;g=(J[g+8>>2]-a|0)/2|0;if(Df(f+24|0,f+16|0,f+15|0)){h=a>>>0<8?1:a>>>3|0;a=e?h:0;o=g+(a+d|0)|0;p=h<<1;g=a+c|0;while(1){i=J[(K[f+15|0]<<2)+825316>>2];if(e){i=K[825313]?-16777216:i>>>2&4144959|i&-16777216}j=0;d=L[f+20>>1];if(d){while(1){a=p;c=K[J[f+16>>2]+j|0];if((c|0)!=32){n=(c-33&255)>>>0>=94?42848:(c<<3)+41832|0;k=0;c=o;while(1){if(h){q=k+n|0;m=0;while(1){if(!((c|0)<0|J[b+8>>2]<=(c|0))){r=J[b>>2]+(P(J[b+4>>2],c)<<2)|0;s=K[q|0];l=0;a=g;while(1){t=1<<l&s;d=0;while(1){if(!(!t|J[b+4>>2]<=(a|0)|(a|0)<0)){J[(a<<2)+r>>2]=i}a=a+1|0;d=d+1|0;if((h|0)!=(d|0)){continue}break}l=l+1|0;if((l|0)!=8){continue}break}}c=c+1|0;m=m+1|0;if((m|0)!=(h|0)){continue}break}}k=k+1|0;if((k|0)!=8){continue}break}a=0;d=0;while(1){c=K[d+n|0];a=(a|0)>(c|0)?a:c;d=d+1|0;if((d|0)!=8){continue}break}a=P(oi(a)+2|0,h);d=L[f+20>>1]}g=a+g|0;j=j+1|0;if(j>>>0<(d&65535)>>>0){continue}break}}if(Df(f+24|0,f+16|0,f+15|0)){continue}break}}$c=f+32|0}function yl(a,b){var c=0,d=0,e=0,f=Q(0),g=0,h=0,i=0,j=0,k=0,l=0,m=Q(0),n=0,o=Q(0),p=Q(0),q=Q(0),r=0,s=Q(0),t=Q(0),u=Q(0),v=Q(0),w=Q(0),x=Q(0),y=Q(0);c=a+66896|0;a:{if(K[c+16896|0]){d=63;if(K[b+83792|0]){break a}}g=K[c+13824|0];if((g|0)==5){d=0;break a}b:{if((a&65534)==8&(b&65534)==10){break b}if((a|0)==(b|0)){d=0;if((g|0)!=2){break b}break a}e=b+66896|0;c=K[e+13824|0];if(c){d=0;if((g|0)!=3|(c|0)!=3){break a}if(K[b+75344|0]==2|K[a+75344|0]!=2){break b}break a}d=0;if(K[e|0]){break a}}d=1;i=P(b,12);j=i+94544|0;f=N[j+4>>2];g=K[b+66896|0];p=g?Q(f+Q(-.09375)):f;c=P(a,12);k=c+94544|0;f=N[k+4>>2];e=K[a+66896|0];q=e?Q(f+Q(-.09375)):f;r=p>=q;l=i+85328|0;m=N[l+4>>2];n=c+85328|0;o=N[n+4>>2];s=N[n+8>>2];t=N[l+8>>2];u=N[k+8>>2];v=N[j+8>>2];c=!(s>=t)|!(u<=v);i=c?0:r&m<=o;w=N[l>>2];x=N[n>>2];y=N[j>>2];f=N[k>>2];if(!(!(w<=x)|!(y>=f))){h=r&m<=o;d=c}h=i&y==Q(1)&x==Q(0)|(i?w==Q(0)?(f==Q(1))<<1:0:0)|(h?v==Q(1)?(s==Q(0))<<2:0:0)|(t==Q(0)?h?(u==Q(1))<<3:0:0);e=(g|0)!=0&(e|0)!=0;c=e|d;if(d){d=0}else{h=(e?16:p==Q(1)?(o==Q(0))<<4:0)|h;d=32}d=(c?d:m==Q(0)?(q==Q(1))<<5:0)|h}H[(P(a,768)+b|0)+132944|0]=d}function Ps(a){var b=Q(0),c=0,d=Q(0),e=Q(0),f=0,g=Q(0),h=Q(0),i=Q(0),j=0,k=Q(0),l=0,m=0,n=0;c=$c-48|0;$c=c;if(!K[1054308]){if(!J[450432]){m=1801728,n=of(0,96),J[m>>2]=n}We(1);Z(0);ie(0);a:{if(a){a=0;e=N[450433];d=N[263525];b=Q(N[203291]-d);g=Q(b*b);h=N[263523];b=Q(N[203289]-h);k=Q(b*b);i=N[263524];b=Q(N[203290]-i);b=Q(g+Q(k+Q(b*b)));f=b<Q(16);g=d;j=b<Q(4);d=j?Q(.004999999888241291):f?Q(.0062500000931322575):Q(.009999999776482582);g=Q(g-d);N[c+8>>2]=g;b=Q(e*(j?Q(.0052083334885537624):f?Q(.0078125):b<Q(64)?Q(.010416666977107525):b<Q(256)?Q(.015625):b<Q(1024)?Q(.03125):Q(.0625)));N[c+20>>2]=g+b;e=Q(i-d);N[c+4>>2]=e;N[c+16>>2]=e+b;e=Q(h-d);N[c>>2]=e;N[c+12>>2]=e+b;e=Q(d+N[263526]);N[c+36>>2]=e;h=Q(d+N[263527]);N[c+40>>2]=h;i=N[263528];N[c+28>>2]=h-b;d=Q(d+i);N[c+44>>2]=d;N[c+32>>2]=d-b;N[c+24>>2]=e-b;f=qe(0,96);j=J[450434];while(1){N[f>>2]=N[P(K[a+41360|0],12)+c>>2];N[f+4>>2]=N[(P(K[a+41361|0],12)+c|0)+4>>2];d=N[(P(K[a+41362|0],12)+c|0)+8>>2];J[f+12>>2]=j;N[f+8>>2]=d;f=f+16|0;l=a>>>0<285;a=a+3|0;if(l){continue}break}Pd(J[450432]);break a}Ve(J[450432])}ae(96);Z(1);We(0)}$c=c+48|0}function QI(a){a=a|0;var b=0,c=0,d=0,e=Q(0),f=0,g=Q(0),h=0,i=0;b=$c-48|0;$c=b;h=b,i=mj(a),J[h>>2]=i;d=J[467303]/2|0;g=N[263689];e=Q(Q(Q(N[467308]*Q(J[467304]))*Q(10))+Q(.5));a:{if(Q(R(e))<Q(2147483648)){c=~~e;break a}c=-2147483648}e=Q(Q(g*Q(Q(c|0)/Q(10)))*Q(16));b:{if(Q(R(e))<Q(2147483648)){c=~~e;break b}c=-2147483648}I[26572]=d-c;d=c<<1;I[26575]=d;I[26574]=d;I[26573]=(J[467304]/2|0)-c;we(53140,-1,b);bd[J[J[a+48>>2]+36>>2]](a+48|0,b);bd[J[J[a+120>>2]+36>>2]](a+120|0,b);bd[J[J[a+332>>2]+36>>2]](a+332|0,b);if(!K[1054197]){f=J[b>>2];J[b+44>>2]=f;c=J[a+204>>2];J[b+24>>2]=J[a+200>>2];J[b+28>>2]=c;c=J[a+212>>2];J[b+32>>2]=J[a+208>>2];J[b+36>>2]=c;J[b+40>>2]=J[a+216>>2];c=J[a+196>>2];J[b+16>>2]=J[a+192>>2];J[b+20>>2]=c;I[b+20>>1]=L[934600]+2;I[b+24>>1]=J[a+220>>2];c=b+44|0;we(b+16|0,-1,c);Ae(b+4|0,J[207101]+4|0);J[a+224>>2]=L[b+24>>1]+I[b+20>>1];d=a+192|0;fh(d,13,c);nj(d,J[b+4>>2],c);fh(d,11,c);nj(d,J[b+8>>2],c);fh(d,11,c);nj(d,J[b+12>>2],c);fh(d,14,c);J[a+320>>2]=J[b+4>>2];J[a+324>>2]=J[b+8>>2];J[a+328>>2]=J[b+12>>2];J[a+304>>2]=(J[b+44>>2]-f|0)/24}Pd(J[a+12>>2]);$c=b+48|0}function Kr(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0,k=0;e=$c-3136|0;$c=e;a:{b:{f=J[a+40>>2];if((f|0)>0){while(1){h=J[a+84>>2]+P(g,28)|0;if(J[h>>2]){if($f(I[h+4>>1],I[h+6>>1],L[h+8>>1],L[h+10>>1],c,d)){break b}f=J[a+40>>2]}g=g+1|0;if((f|0)>(g|0)){continue}break}}g=-1;break a}J[e+40>>2]=0;J[e+44>>2]=0;J[e+32>>2]=0;J[e+36>>2]=0;d=I[(J[a+84>>2]+P(g,28)|0)+4>>1];H[e+44|0]=1;bd[J[a+88>>2]](e+24|0,g);c:{if(K[1054197]){break c}i=Mr(a,e+256|0,g,e+48|0);if((i|0)<=0){break c}h=c-d|0;c=0;f=0;while(1){d:{d=(e+48|0)+(f<<3)|0;k=I[d>>1];j=I[d+2>>1];Ke(e+8|0,e+24|0,I[d+4>>1],I[d+6>>1]);d=J[e+12>>2];J[e+32>>2]=J[e+8>>2];J[e+36>>2]=d;J[e+40>>2]=J[a+48>>2];d=c;c=Ne(e+32|0)+d|0;if(!((d|0)>(h|0)|(j|0)>=0)&(c|0)>(h|0)){break d}f=f+1|0;if((i|0)!=(f|0)){continue}break c}break}a=j&32767;I[e+22>>1]=a;I[e+20>>1]=a;J[e+16>>2]=(e+256|0)+k;ye(b,e+16|0);a=L[b+4>>1];if(a>>>0>=2){d=J[b>>2];a=a-2|0;while(1){c=a;e:{if(K[a+d|0]!=62){break e}f=a+1|0;if(K[f+d|0]!=32){break e}dg(b,f);dg(b,a);Jr(b,a)}a=c-1|0;if((c|0)>0){continue}break}}Jr(b,0);break a}c=e+256|0;bd[J[a+88>>2]](c,g);ye(b,c)}$c=e+3136|0;return g}function hx(a){a=a|0;var b=0,c=0;J[a+104>>2]=0;b=rd(a,16634,313,314,0,0)<<5;J[b+1074108>>2]=409;J[b+1074104>>2]=410;b=rd(a,7411,337,346,347,0)<<5;J[b+1074124>>2]=1092616192;c=b+1074116|0;J[c>>2]=1036831949;J[c+4>>2]=1112014848;J[b+1074112>>2]=44852;J[b+1074108>>2]=411;J[b+1074104>>2]=412;b=rd(a,12178,313,314,0,23781)<<5;J[b+1074108>>2]=413;J[b+1074104>>2]=414;b=rd(a,3410,337,346,347,24580)<<5;J[b+1074124>>2]=1067307762;c=b+1074116|0;J[c>>2]=1036831949;J[c+4>>2]=1157627904;J[b+1074112>>2]=44852;J[b+1074108>>2]=415;J[b+1074104>>2]=416;b=rd(a,5336,313,314,0,25538)<<5;J[b+1074108>>2]=417;J[b+1074104>>2]=418;b=rd(a,12194,313,314,0,0)<<5;J[b+1074108>>2]=419;J[b+1074104>>2]=420;b=rd(a,6139,313,314,0,0)<<5;J[b+1074108>>2]=421;J[b+1074104>>2]=422;b=rd(a,12399,313,314,0,24100)<<5;J[b+1074108>>2]=423;J[b+1074104>>2]=424;b=rd(a,14819,313,314,0,23307)<<5;J[b+1074108>>2]=425;J[b+1074104>>2]=426;b=rd(a,2029,337,350,351,0)<<5;J[b+1074124>>2]=70;c=b+1074116|0;J[c>>2]=1;J[c+4>>2]=179;J[b+1074112>>2]=44804;J[b+1074108>>2]=427;J[b+1074104>>2]=428;Zf(a,-1,364);J[a+96>>2]=429;Jn(a)}
function ki(a,b){var c=0,d=0,e=0;e=$c-16|0;$c=e;a:{b:{c:{switch(K[b|0]-112|0){case 4:J[263434]=J[263434]+1;c=li(a,b+4|0);break a;case 1:c=Oh(a,e+8|0);break a;case 3:c=xl(a,b+4|0);if(c){break a}J[263434]=J[263434]+1;d=J[b+4>>2];J[d+2344>>2]=0;c=J[d+2340>>2];d:{if(!c){b=d;break d}while(1){b=c;J[b+2344>>2]=d;d=b;c=J[b+2340>>2];if(c){continue}break}}while(1){c=K[b+48|0];if(!(c&2)){c=-857812917;break a}d=0;if(J[b+52>>2]>0){while(1){c=P(d,60)+b|0;c=wp(a,K[c+56|0],c+108|0);if(c){break a}d=d+1|0;if((d|0)<J[b+52>>2]){continue}break}c=K[b+48|0]}if(c&1){c=vp(a);if(c){break a}}c=0;b=J[b+2344>>2];if(b){continue}break};break a;case 5:c=xl(a,b+4|0);if(c){break a}c=Oh(a,e+4|0);if(c){break a}d=K[J[b+4>>2]+1|0];J[263434]=J[263434]+1;c=J[e+4>>2];if((d|0)!=66){if(!c){break b}b=0;while(1){c=wp(a,d,e+8|0);if(c){break a}b=b+1|0;if(b>>>0<M[e+4>>2]){continue}break}break b}J[b+12>>2]=c;d=wf(c,1);J[b+8>>2]=d;if(!d){c=-857812988;break a}c=0;a=Sd(a,d,J[e+4>>2]);if(!a){break a}qd(J[b+8>>2]);c=a;break a;case 0:break a;default:break c}}c=-857812925;break a}c=0}$c=e+16|0;return c}function eE(a){a=a|0;var b=0,c=Q(0),d=Q(0),e=0,f=0,g=Q(0),h=0,i=Q(0),j=0,k=Q(0);f=K[1054743];g=Q(Y(N[a+88>>2]));c=Q((f?Q(48):Q(50))*g);a:{if(Q(R(c))<Q(2147483648)){b=~~c;break a}b=-2147483648}c=N[467293];i=Q(b|0);d=Q(c*i);b:{if(Q(R(d))<Q(2147483648)){b=~~d;break b}b=-2147483648}J[a+64>>2]=b;k=N[467294];b=J[a+48>>2];e=(b|0)>=8?8:b;J[a+52>>2]=e;d=Q((f?Q(40):Q(50))*g);c:{if(Q(R(d))<Q(2147483648)){b=~~d;break c}b=-2147483648}c=Q(c*Q(b|0));d:{if(Q(R(c))<Q(2147483648)){b=~~c;break d}b=-2147483648}d=Q(b|0);N[a+72>>2]=Q(d*Q(.699999988079071))*Q(.5);c=Q(k*i);e:{if(Q(R(c))<Q(2147483648)){b=~~c;break e}b=-2147483648}J[a+68>>2]=b;N[a+76>>2]=Q(Q(Q(g*Q(25))+d)*Q(.699999988079071))*Q(.5);while(1){f:{J[a+12>>2]=P(J[a+44>>2],J[a+64>>2]);J[a+16>>2]=P(J[a+68>>2],e);_f(a);h=J[a+1740>>2];j=J[a+8>>2];if(f){e=J[a+52>>2];break f}b=J[a+52>>2];if((h|0)<=(j|0)){e=b;break f}e=b-1|0;J[a+52>>2]=e;if((b|0)>2){continue}}break}J[a+1636>>2]=j-h;J[a+1676>>2]=e;J[a+1672>>2]=J[a+48>>2];J[a+1632>>2]=J[a+1736>>2]+(J[a+12>>2]+J[a+4>>2]|0);J[a+1644>>2]=J[a+1744>>2]+(J[a+16>>2]+h|0)}function Of(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=Q(0),j=Q(0),k=Q(0);c=$c-48|0;$c=c;Ae(c+36|0,a);Ae(c+24|0,a+12|0);d=J[c+36>>2];J[c+36>>2]=(d|0)>0?d:0;d=J[c+24>>2];g=J[464810];h=(d|0)<(g|0)?d:g;J[c+24>>2]=h;d=J[c+40>>2];g=(d|0)>0?d:0;J[c+40>>2]=g;d=J[c+28>>2];e=J[464811];d=(d|0)<(e|0)?d:e;J[c+28>>2]=d;e=J[c+44>>2];J[c+44>>2]=(e|0)>0?e:0;e=J[c+32>>2];f=J[464812];f=(e|0)<(f|0)?e:f;J[c+32>>2]=f;e=0;a:{if((d|0)<(g|0)){break a}while(1){e=J[c+44>>2];if((e|0)<=(f|0)){i=Q(g|0);while(1){d=J[c+36>>2];if((h|0)>=(d|0)){j=Q(e|0);while(1){f=P(J[464807],P(J[464809],g)+e|0)+d|0;h=J[464818]&(K[f+J[464805]|0]<<8|K[f+J[464804]|0]);f=P(h,12)+66896|0;k=Q(d|0);N[c>>2]=N[f+18432>>2]+k;N[c+4>>2]=N[f+18436>>2]+i;N[c+8>>2]=N[f+18440>>2]+j;N[c+12>>2]=N[f+27648>>2]+k;N[c+16>>2]=N[f+27652>>2]+i;N[c+20>>2]=N[f+27656>>2]+j;b:{if(!gg(c,a)){break b}if(!(bd[b|0](h)|0)){break b}e=1;break a}h=J[c+24>>2];f=(h|0)>(d|0);d=d+1|0;if(f){continue}break}f=J[c+32>>2]}d=(e|0)<(f|0);e=e+1|0;if(d){continue}break}d=J[c+28>>2]}e=(d|0)>(g|0);g=g+1|0;if(e){continue}break}e=0}$c=c+48|0;return e}function CA(){var a=0,b=0,c=0,d=0,e=Q(0);J[263681]=1054816;hf(50376);hf(50388);hf(50400);hf(50412);nd(1050476,0,214);nd(1051516,0,215);nd(1052556,0,216);nd(1046576,0,217);nd(1043196,0,218);nd(1043456,0,219);nd(1049696,0,220);nd(1047876,0,221);nd(1050736,0,222);a=K[1054197]?10:12;J[263694]=a;c=1054736,d=Le(5689,0,30,a),J[c>>2]=d;a:{if(K[1054197]){H[1054740]=0;break a}c=1054740,d=(Id(14052,!K[1055388])|0)!=0,H[c|0]=d;if(K[1054197]){break a}b=(Id(12890,1)|0)!=0}H[1054741]=b;c=1054732,d=(Id(10863,1)|K[1054197])!=0,H[c|0]=d;c=1054733,d=(Id(2647,0)|K[1054197])!=0,H[c|0]=d;c=1054734,d=(Id(4659,0)|K[1054197])!=0,H[c|0]=d;if(Id(4018,0)){a=1}else{a=!K[1054198]&K[1054197]!=0}H[1054735]=a;c=1054743,d=(Id(1340,0)|K[1054197])!=0,H[c|0]=d;c=1054742,d=Id(4603,1),H[c|0]=d;c=1054752,e=Wf(14093,Q(.25),Q(5),Q(1)),N[c>>2]=e;c=1054744,e=Wf(14145,Q(.25),Q(5),Q(1)),N[c>>2]=e;c=1054748,e=Wf(14112,Q(.25),Q(5),Q(1)),N[c>>2]=e;c=1054756,e=Wf(14126,Q(.25),Q(5),Q(1)),N[c>>2]=e;c=1054784,e=Wf(14161,Q(.25),Q(5),Q(1)),N[c>>2]=e;c=1054792,d=Id(4e3,1),H[c|0]=d;Qo()}function lI(a,b){a=a|0;b=Q(b);var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;a:{b:{if(K[a+4|0]){N[a+272>>2]=N[a+272>>2]+b;f=0;if(!K[1054203]){break b}bd[J[J[a+72>>2]>>2]](a+72|0)}if(K[1054203]){break a}f=!K[a+4|0]}c:{if(f|K[1054735]){break c}c=Lr(a+672|0);e=c+J[a+780>>2]|0;if((e|0)<=0){break c}d=J[a+48>>2];h=J[a+676>>2]-d|0;f=c;c=J[a+52>>2];i=d<<1;d=J[a+776>>2];g=J[a+684>>2];uf(h,J[a+680>>2]+J[a+688>>2]-(f+c)|0,i+((d|0)>(g|0)?d:g)|0,e+(c<<1)|0,2130706432)}bd[J[J[a+764>>2]>>2]](a+764|0);ie(1);Ve(J[a+12>>2]);d:{if(!K[a+4|0]){e=J[a+712>>2];if((e|0)<=0){break d}j=O[131740];c=0;while(1){g=J[J[a+756>>2]+P(c,28)>>2];e:{if(!g){break e}d=J[a+44>>2]+c|0;if((d|0)<0|(d|0)>=J[203556]|O[((d&31)<<3)+819376>>3]+10<j){break e}de(g);he(4,c<<2);e=J[a+712>>2]}c=c+1|0;if((e|0)>(c|0)){continue}break}break d}bd[J[J[a+672>>2]+40>>2]](a+672|0,0)|0}if(!K[a+4|0]){break a}bd[J[J[a+72>>2]>>2]](a+72|0);if(K[a+876|0]){bd[J[J[a+856>>2]>>2]](a+856|0)}if(!K[1054793]){break a}bd[J[J[a+2292>>2]>>2]](a+2292|0);bd[J[J[a+2124>>2]>>2]](a+2124|0);bd[J[J[a+2208>>2]>>2]](a+2208|0)}}function zE(a){a=a|0;var b=0,c=0,d=Q(0),e=0;b=$c-32|0;$c=b;a:{if(K[a+20|0]){J[b+24>>2]=J[11304];c=J[11303];J[b+16>>2]=J[11302];J[b+20>>2]=c;c=J[11301];J[b+8>>2]=J[11300];J[b+12>>2]=c;c=J[11299];J[b>>2]=J[11298];J[b+4>>2]=c;break a}J[b+24>>2]=J[11311];c=J[11310];J[b+16>>2]=J[11309];J[b+20>>2]=c;c=J[11308];J[b+8>>2]=J[11307];J[b+12>>2]=c;c=J[11306];J[b>>2]=J[11305];J[b+4>>2]=c}if(H[a+21|0]&1){J[b+24>>2]=J[11318];c=J[11317];J[b+16>>2]=J[11316];J[b+20>>2]=c;c=J[11315];J[b+8>>2]=J[11314];J[b+12>>2]=c;c=J[11313];J[b>>2]=J[11312];J[b+4>>2]=c}e=J[(K[1054732]?40:36)+1054724>>2];J[b>>2]=e;I[b+4>>1]=J[a+4>>2];c=J[a+12>>2];I[b+8>>1]=c;I[b+6>>1]=J[a+8>>2];I[b+10>>1]=J[a+16>>2];b:{if((c|0)>=400){kh(b);break b}d=N[467293];de(e);e=J[a+12>>2];d=Q(Q(Q(c|0)/Q(400))/Q(d+d));N[b+20>>2]=d*Q(.78125);J[b+12>>2]=0;I[b+8>>1]=(e|0)/2;rj(b,J[a+68>>2]);c=J[a+12>>2];J[b+20>>2]=1061683200;N[b+12>>2]=Q(Q(1)-d)*Q(.78125);I[b+4>>1]=L[b+4>>1]+((c|0)/2|0);rj(b,J[a+68>>2])}if(J[a+40>>2]){gl(a+40|0,H[a+21|0]&1?-6250336:K[a+20|0]?-6225921:-2039584)}$c=b+32|0}function Zx(a){a=a|0;var b=0,c=0;J[a+104>>2]=0;b=rd(a,14695,309,310,0,28066)<<5;J[b+1074116>>2]=6;J[b+1074112>>2]=33456;J[b+1074108>>2]=366;J[b+1074104>>2]=367;b=rd(a,14852,337,350,351,0)<<5;J[b+1074124>>2]=512;c=b+1074116|0;J[c>>2]=8;J[c+4>>2]=4096;J[b+1074112>>2]=44804;J[b+1074108>>2]=368;J[b+1074104>>2]=369;b=rd(a,11889,313,314,0,25231)<<5;J[b+1074108>>2]=370;J[b+1074104>>2]=371;b=rd(a,14668,309,310,0,22821)<<5;J[b+1074116>>2]=2;J[b+1074112>>2]=35368;J[b+1074108>>2]=372;J[b+1074104>>2]=373;b=rd(a,5754,309,310,0,24283)<<5;J[b+1074116>>2]=5;J[b+1074112>>2]=32304;J[b+1074108>>2]=374;J[b+1074104>>2]=375;b=rd(a,4279,309,310,0,22289)<<5;J[b+1074116>>2]=4;J[b+1074112>>2]=32336;J[b+1074108>>2]=376;J[b+1074104>>2]=377;b=rd(a,4420,309,310,0,0)<<5;J[b+1074116>>2]=2;J[b+1074112>>2]=33812;J[b+1074108>>2]=212;J[b+1074104>>2]=211;b=rd(a,4627,313,314,0,0)<<5;J[b+1074108>>2]=378;J[b+1074104>>2]=379;b=rd(a,11271,313,314,0,0)<<5;J[b+1074108>>2]=321;J[b+1074104>>2]=322;Zf(a,-1,364);J[a+100>>2]=380;le(J[J[a+16>>2]+12>>2],K[1067804])}function ng(a,b,c){var d=Q(0),e=Q(0),f=0,g=0,h=0,i=0,j=0,k=Q(0),l=Q(0),m=0,n=0,o=Q(0),p=Q(0),q=Q(0),r=Q(0),s=Q(0),t=Q(0);n=J[a+4096>>2];if((n|0)>0){k=Q(1);l=Q(1);while(1){e=Q(k*c);f=!(e>=Q(0));h=(m<<9)+a|0;if(Q(R(e))<Q(2147483648)){i=~~e}else{i=-2147483648}f=i-f|0;j=h+(f&255)|0;d=Q(k*b);g=!(d>=Q(0));e=Q(e-Q(f|0));t=Q(Q(e*Q(e*e))*Q(Q(e*Q(Q(e*Q(6))+Q(-15)))+Q(10)));if(Q(R(d))<Q(2147483648)){i=~~d}else{i=-2147483648}f=i-g|0;d=Q(d-Q(f|0));o=Q(Q(d*Q(d*d))*Q(Q(d*Q(Q(d*Q(6))+Q(-15)))+Q(10)));g=h+(f&255)|0;i=j+K[g+1|0]|0;f=K[h+K[i+1|0]|0]<<1;j=j+K[g|0]|0;g=K[h+K[j+1|0]|0]<<1;p=Q(e+Q(-1));q=Q(Q(Q((1179984418>>>g&3)-1|0)*d)+Q(p*Q((572675338>>>g&3)-1|0)));g=K[h+K[i|0]|0]<<1;r=Q(d+Q(-1));h=K[h+K[j|0]|0]<<1;d=Q(Q(Q((1179984418>>>h&3)-1|0)*d)+Q(e*Q((572675338>>>h&3)-1|0)));d=Q(Q(o*Q(Q(Q(Q((1179984418>>>g&3)-1|0)*r)+Q(e*Q((572675338>>>g&3)-1|0)))-d))+d);s=Q(Q(Q(Q(t*Q(Q(Q(o*Q(Q(Q(Q((1179984418>>>f&3)-1|0)*r)+Q(p*Q((572675338>>>f&3)-1|0)))-q))+q)-d))+d)*l)+s);k=Q(k*Q(.5));l=Q(l+l);m=m+1|0;if((n|0)!=(m|0)){continue}break}}return s}function oK(a){a=a|0;var b=0,c=0,d=0,e=Q(0);e=N[a+4>>2];if(J[400098]>0){while(1){a=c<<6;a=nn(a+1600400|0,N[(L[a+1600462>>1]<<2)+723536>>2],771,e);b=J[400098];if(a){a=c;b=b-1|0;if((a|0)<(b|0)){while(1){d=(a<<6)+1600400|0;a=a+1|0;Qd(d,(a<<6)+1600400|0,64);if((a|0)!=(b|0)){continue}break}}J[400098]=b;c=c-1|0}c=c+1|0;if((c|0)<(b|0)){continue}break}}b=0;if(J[393492]>0){while(1){H[1685396]=0;a=nn(P(b,44)+1573984|0,Q(3.5),772,e);c=J[393492];if(a|H[1685396]&1){a=b;c=c-1|0;if((a|0)<(c|0)){while(1){d=P(a,44);Qd(d+1573984|0,d+1574028|0,44);a=a+1|0;if((c|0)!=(a|0)){continue}break}}J[393492]=c;b=b-1|0}b=b+1|0;if((b|0)<(c|0)){continue}break}}b=0;if(J[413028]>0){while(1){c=P(b,52);a=J[c+1652172>>2];H[1685396]=0;a=P(a,52)+1638800|0;H[1683328]=K[a+22|0];a:{if(!nn(c+1652128|0,N[a+40>>2],767,e)){if(!K[1685396]|!(H[a+22|0]&1)){break a}}a=b;c=J[413028]-1|0;if((a|0)<(c|0)){while(1){d=P(a,52);Qd(d+1652128|0,d+1652180|0,52);a=a+1|0;if((c|0)!=(a|0)){continue}break}}J[413028]=c;b=b-1|0}b=b+1|0;if((b|0)<J[413028]){continue}break}}return 1}function Kn(a,b){var c=0,d=0,e=0,f=0;d=$c-32|0;$c=d;a:{if(!J[16717]|(a-10&255)>>>0<247){break a}e=(a|0)==5;c=P(e?4:a,204)+b|0;f=J[c>>2];if(!f){break a}c=c+P(zd(66880,f),20)|0;J[d+8>>2]=J[c+20>>2];f=J[c+16>>2];J[d>>2]=J[c+12>>2];J[d+4>>2]=f;J[d+12>>2]=J[c+4>>2];c=J[c+8>>2];J[d+24>>2]=100;J[d+16>>2]=c;c=J[16717];J[d+20>>2]=c;b:{c:{if((b|0)==62788){b=e?120:80;break c}J[d+20>>2]=(c|0)/2;b=140;if((a|0)!=5){break b}}J[d+24>>2]=b}a=0;b=$c-16|0;$c=b;d:{while(1){c=P(a,12);e=c+1859504|0;f=c+1859508|0;e:{if(J[f>>2]){f=J[e>>2];break e}J[f>>2]=1;f=Ub()|0;J[e>>2]=f;J[c+1859512>>2]=0}J[b+8>>2]=1;c=Fa(f|0,b+8|0)|0;if(c){break d}if(J[b+8>>2]<=0){Ea(J[e>>2],J[d+20>>2])|0;c=Da(J[e>>2],J[d>>2],J[d+24>>2])|0;break d}a=a+1|0;if((a|0)!=8){continue}break}a=0;while(1){J[b+12>>2]=1;e=P(a,12)+1859504|0;c=Fa(J[e>>2],b+12|0)|0;if(c){break d}if(J[b+12>>2]<=0){Ea(J[e>>2],J[d+20>>2])|0;c=Da(J[e>>2],J[d>>2],J[d+24>>2])|0;break d}a=a+1|0;if((a|0)!=8){continue}break}c=0}$c=b+16|0;if(!c){break a}dj(c,6105,1151);pd(6120);J[16717]=0;lm()}$c=d+32|0}function zM(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=Q(0),k=Q(0),l=0,m=0,n=0,o=0,p=0;c=$c-32|0;$c=c;o=c,p=mj(a),J[o>>2]=p;bd[J[J[a+156>>2]+36>>2]](a+156|0,c);e=J[a+36>>2];d=J[a+44>>2];J[c+24>>2]=1065342730;I[c+14>>1]=d;I[c+12>>1]=d;b=J[458677];J[c+16>>2]=0;a:{b:{c:{if((b|0)<=0){d=J[c>>2];break c}h=d<<4;while(1){b=0;while(1){I[c+8>>1]=P(d,b&15)+e;I[c+10>>1]=J[a+40>>2]+P(d,b>>>4|0);j=N[458160];k=Q(j*Q(J[458158]&b+f));N[c+20>>2]=k;N[c+28>>2]=Q(j*Q(.9993749856948853))+k;we(c+4|0,-1,c);b=b+1|0;if((b|0)!=256){continue}break}e=e+h|0;f=f+256|0;g=g+16|0;b=J[458677];if((g|0)<(b|0)){continue}break}d=J[c>>2];if((b|0)>0){break b}}b=d;break a}l=a+52|0;e=J[a+44>>2];m=e<<4;f=J[a+36>>2];g=0;h=0;while(1){I[a+58>>1]=(e+J[a+40>>2]|0)-L[a+62>>1];n=f+3|0;i=0;while(1){b=0;while(1){J[a+84>>2]=P(b,e)+n;nj(l,g,c);g=g+1|0;b=b+1|0;if((b|0)!=16){continue}break}I[a+58>>1]=e+L[a+58>>1];i=i+1|0;if((i|0)!=16){continue}break}f=f+m|0;h=h+16|0;if((h|0)<J[458677]){continue}break}b=J[c>>2]}J[a+48>>2]=(b-d|0)/24;Pd(J[a+12>>2]);$c=c+32|0}function aB(a){a=a|0;var b=0,c=0,d=0;c=$c-44880|0;$c=c;yg(c+44744|0,c+4|0,a);b=c+44800|0;a=Sd(a,b,79);a:{if(a){break a}a=-857812933;if((K[b|0]|K[b+1|0]<<8|(K[b+2|0]<<16|K[b+3|0]<<24))!=264417088){break a}a=-857812932;if(K[c+44804|0]!=13){break a}a=b|5;J[464807]=K[a|0]|K[a+1|0]<<8;a=b|7;J[464808]=K[a|0]|K[a+1|0]<<8;a=b|9;J[464809]=K[a|0]|K[a+1|0]<<8;H[J[263427]+28|0]=7;a=b|11;N[J[263427]>>2]=Q(K[a|0]|K[a+1|0]<<8|(K[a+2|0]<<16|K[a+3|0]<<24))*Q(.03125);a=b|15;N[J[263427]+4>>2]=Q(K[a|0]|K[a+1|0]<<8|(K[a+2|0]<<16|K[a+3|0]<<24))*Q(.03125);b=J[263427];a=c+44819|0;N[b+8>>2]=Q(K[a|0]|K[a+1|0]<<8|(K[a+2|0]<<16|K[a+3|0]<<24))*Q(.03125);N[b+16>>2]=Q(Q(K[c+44823|0])*Q(360))*Q(.00390625);N[b+12>>2]=Q(Q(K[c+44824|0])*Q(360))*Q(.00390625);Kd(1859256,c+44833|0,16);a=c+44875|0;b=K[a|0]|K[a+1|0]<<8|(K[a+2|0]<<16|K[a+3|0]<<24);if((b|0)>0){while(1){a=wl(c+44744|0);if(a){break a}a=wl(c+44744|0);if(a){break a}a=wl(c+44744|0);if(a){break a}d=d+1|0;if((b|0)!=(d|0)){continue}break}}a=zl(c+44744|0)}$c=c+44880|0;return a|0}function zt(a,b,c){var d=0,e=Q(0),f=Q(0),g=0,h=Q(0),i=Q(0),j=0;d=$c+-64|0;$c=d;f=N[c+28>>2];J[d+48>>2]=J[b+8>>2];g=J[b+4>>2];J[d+40>>2]=J[b>>2];J[d+44>>2]=g;e=Q(f*Q(-.01745329238474369));f=Md(e);e=Jd(e);h=N[d+40>>2];i=N[d+48>>2];g=d+52|0;N[g+4>>2]=N[d+44>>2];N[g+8>>2]=Q(e*h)+Q(f*i);N[g>>2]=Q(f*h)-Q(i*e);J[b+8>>2]=J[d+60>>2];j=J[d+56>>2];J[b>>2]=J[d+52>>2];J[b+4>>2]=j;f=N[c+32>>2];J[d+32>>2]=J[b+8>>2];j=J[b+4>>2];J[d+24>>2]=J[b>>2];J[d+28>>2]=j;e=Q(f*Q(-.01745329238474369));f=Md(e);e=Jd(e);h=N[d+28>>2];i=N[d+24>>2];N[g+8>>2]=N[d+32>>2];N[g+4>>2]=Q(f*h)-Q(e*i);N[g>>2]=Q(f*i)+Q(e*h);J[b+8>>2]=J[d+60>>2];j=J[d+56>>2];J[b>>2]=J[d+52>>2];J[b+4>>2]=j;f=N[c+24>>2];J[d+16>>2]=J[b+8>>2];c=J[b+4>>2];J[d+8>>2]=J[b>>2];J[d+12>>2]=c;e=Q(f*Q(-.01745329238474369));f=Md(e);e=Jd(e);h=N[d+16>>2];i=N[d+12>>2];N[g>>2]=N[d+8>>2];N[g+8>>2]=Q(f*h)-Q(e*i);N[g+4>>2]=Q(f*i)+Q(e*h);J[b+8>>2]=J[d+60>>2];c=J[d+56>>2];J[b>>2]=J[d+52>>2];J[b+4>>2]=c;J[a+8>>2]=J[b+8>>2];c=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=c;$c=d- -64|0}function Gh(a,b,c){var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;g=$c-128|0;$c=g;I[a+1088>>1]=0;I[a+1024>>1]=0;I[a+1056>>1]=0;Gd(g- -64|0,0,64);if((c|0)>0){while(1){d=(g- -64|0)+(K[b+e|0]<<2)|0;J[d>>2]=J[d>>2]+1;e=e+1|0;if((e|0)!=(c|0)){continue}break}}d=1;a:{b:{while(1){if(J[(g- -64|0)+(d<<2)>>2]>1<<d){break b}e=1;d=d+1|0;if((d|0)!=16){continue}break}d=0;while(1){k=e<<2;J[k+g>>2]=f;i=(e<<1)+a|0;I[i+1088>>1]=f;j=d+j<<1;I[i+1024>>1]=j;d=J[k+(g- -64|0)>>2];I[i+1056>>1]=d?j+d|0:0;f=d+f|0;e=e+1|0;if((e|0)!=16){continue}break}je(a,255,1024);j=0;if((c|0)<=0){break a}f=0;while(1){d=K[b+f|0];if(d){k=(d<<2)+g|0;i=J[k>>2];I[((i<<1)+a|0)+1120>>1]=f;if(d>>>0<=9){e=(d<<1)+a|0;l=9-d|0;e=(i+L[e+1024>>1]|0)-L[e+1088>>1]<<l;m=d<<9|f;d=0;while(1){h=e<<8|(e&65280)>>>8;h=h>>>4&3855|(h&3855)<<4;h=h>>>2&13107|(h&13107)<<2;I[((h>>>1&21760|(h&21824)<<1)>>>6|0)+a>>1]=m;e=e+1|0;d=d+1|0;if(!(d>>>l|0)){continue}break}}J[k>>2]=i+1}f=f+1|0;if((f|0)!=(c|0)){continue}break}break a}j=-857812901}$c=g+128|0;return j}function xE(a,b){a=a|0;b=b|0;var c=0,d=0,e=Q(0),f=0;c=$c-32|0;$c=c;a:{if(K[a+20|0]){J[c+24>>2]=J[11304];d=J[11303];J[c+16>>2]=J[11302];J[c+20>>2]=d;d=J[11301];J[c+8>>2]=J[11300];J[c+12>>2]=d;d=J[11299];J[c>>2]=J[11298];J[c+4>>2]=d;break a}J[c+24>>2]=J[11311];d=J[11310];J[c+16>>2]=J[11309];J[c+20>>2]=d;d=J[11308];J[c+8>>2]=J[11307];J[c+12>>2]=d;d=J[11306];J[c>>2]=J[11305];J[c+4>>2]=d}if(H[a+21|0]&1){J[c+24>>2]=J[11318];d=J[11317];J[c+16>>2]=J[11316];J[c+20>>2]=d;d=J[11315];J[c+8>>2]=J[11314];J[c+12>>2]=d;d=J[11313];J[c>>2]=J[11312];J[c+4>>2]=d}I[c+4>>1]=J[a+4>>2];d=J[a+12>>2];I[c+8>>1]=d;I[c+6>>1]=J[a+8>>2];I[c+10>>1]=J[a+16>>2];f=J[a+68>>2];b:{if((d|0)>=400){we(c,f,b);J[b>>2]=J[b>>2]+96;break b}e=N[467293];e=Q(Q(Q(d|0)/Q(400))/Q(e+e));N[c+20>>2]=e*Q(.78125);J[c+12>>2]=0;I[c+8>>1]=(d|0)/2;we(c,f,b);d=J[a+12>>2];J[c+20>>2]=1061683200;N[c+12>>2]=Q(Q(1)-e)*Q(.78125);I[c+4>>1]=L[c+4>>1]+((d|0)/2|0);we(c,f,b)}we(a+40|0,H[a+21|0]&1?-6250336:K[a+20|0]?-6225921:-2039584,b);$c=c+32|0}function lp(a,b,c,d,e,f){var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;n=b+d|0;h=n-4|0;l=n-2|0;if((h|0)<(l|0)){while(1){k=-2;while(1){m=c+k|0;g=k>>31;o=((g^k)-g|0)!=2;g=-2;while(1){j=g>>31;a:{if(!(o|((j^g)-j|0)!=2)){if(!(Fd(J[263561])>=Q(.5))){break a}}j=P(i,12)+e|0;J[j+8>>2]=m;J[j+4>>2]=h;J[j>>2]=a+g;H[f+i|0]=18;i=i+1|0}g=g+1|0;if((g|0)!=3){continue}break}k=k+1|0;if((k|0)!=3){continue}break}h=h+1|0;if((l|0)!=(h|0)){continue}break}h=l}if((h|0)<(n|0)){while(1){j=-1;while(1){o=c+j|0;g=-1;while(1){k=h;b:{if(!(!j|!g)){if((h|0)!=(l|0)){break b}k=l;if(!(Fd(J[263561])>=Q(.5))){break b}}m=P(i,12)+e|0;J[m+8>>2]=o;J[m+4>>2]=k;J[m>>2]=a+g;H[f+i|0]=18;i=i+1|0}g=g+1|0;if((g|0)!=2){continue}break}j=j+1|0;if((j|0)!=2){continue}break}h=h+1|0;if((n|0)!=(h|0)){continue}break}}if((d|0)>=2){h=d-2|0;g=0;while(1){d=P(i,12)+e|0;J[d+8>>2]=c;J[d+4>>2]=b+g;J[d>>2]=a;H[f+i|0]=17;i=i+1|0;d=(g|0)!=(h|0);g=g+1|0;if(d){continue}break}}d=P(i,12)+e|0;J[d+8>>2]=c;J[d+4>>2]=b-1;J[d>>2]=a;H[f+i|0]=3;return i+1|0}function et(a){var b=0,c=0,d=0,e=0,f=0,g=Q(0),h=0,i=0,j=0,k=0,l=Q(0),m=0,n=0,o=0;b=$c-160|0;$c=b;J[b+156>>2]=8388608;J[b+152>>2]=b+16;if(J[a+88>>2]?K[1054742]:1){g=N[a+296>>2];c=1;a:{if(g==Q(0)){break a}l=Q(Q(J[a+300>>2])/g);if(Q(R(l))<Q(2147483648)){c=~~l;break a}c=-2147483648}J[b+4>>2]=c;b:{if(K[1054456]|K[1054457]){od(b+152|0,28546);H[1054457]=K[1054457]-1;break b}if(!c){N[b>>2]=Q(J[a+300>>2])/g;Hd(b+152|0,28522,b);break b}Hd(b+152|0,28513,b+4|0)}c:{if(K[1054197]){Hd(b+152|0,5555,1053928);break c}if(J[263482]){Hd(b+152|0,28532,1053928)}J[b+12>>2]=P(J[263512]>>2,6);m=b+152|0;Hd(m,6082,b+12|0);while(1){c=P(h,24);e=c+1811256|0;i=J[e>>2];d=c+1811248|0;c=J[d>>2];n=J[d+4>>2];e=J[e+4>>2];d=(n|c)!=0&(e|i)!=0;o=d?i-c|0:0;j=o+j|0;f=(d?e-(n+(c>>>0>i>>>0)|0)|0:0)+f|0;f=j>>>0<o>>>0?f+1|0:f;k=k+d|0;h=h+1|0;if((h|0)!=10){continue}break}c=0;d:{if(!k){break d}c=((Oe(0,0,j,f)|0)/2|0)/(k|0)|0}J[b+8>>2]=c;if(!c){break c}Hd(m,4919,b+8|0)}Ce(a+48|0,b+152|0,a+36|0);H[a+7|0]=1}$c=b+160|0}function RK(a){a=a|0;var b=Q(0),c=Q(0),d=Q(0),e=Q(0),f=Q(0),g=Q(0);yf(a);af(264);yd(Q(N[a+16>>2]*Q(-.01745329238474369)),Q(0),Q(0),1555664,1);If(1555680);If(1555696);c=Jd(N[a+132>>2]);d=N[a+136>>2];e=N[a+132>>2];e=Md(Q(e+e));f=N[a+136>>2];b=N[a+132>>2];b=Jd(Q(b+b));g=N[a+136>>2];H[1092884]=1;d=Q(Q(c*d)*Q(3.1415927410125732));c=Q(Q(Q(b*g)*Q(3.1415927410125732))*Q(.03125));e=Q(Q(Q(e*f)*Q(3.1415927410125732))*Q(.0625));b=Q(e+Q(.39269909262657166));yd(d,Q(c+Q(.7853981852531433)),b,1555712,0);f=Q(-d);yd(f,Q(c+Q(.39269909262657166)),b,1555712,0);b=Q(Q(.39269909262657166)-e);yd(d,Q(Q(-.39269909262657166)-c),b,1555712,0);yd(f,Q(Q(-.7853981852531433)-c),b,1555712,0);b=Q(e+Q(-.39269909262657166));yd(d,Q(c+Q(-.7853981852531433)),b,1555728,0);yd(f,Q(c+Q(-.39269909262657166)),b,1555728,0);b=d;d=Q(Q(-.39269909262657166)-e);yd(b,Q(Q(.39269909262657166)-c),d,1555728,0);yd(f,Q(Q(.7853981852531433)-c),d,1555728,0);H[1092884]=0;Pd(J[273228]);J[273224]=J[273229];ae(264)}function De(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;f=$c-16|0;$c=f;J[b>>2]=0;i=f+5|0;H[f+15|0]=0;c=L[a+4>>1];h=0;a:{if(!c){break a}e=i+9|0;g=K[J[a>>2]];if((g|0)==45){H[f+15|0]=1;g=K[J[a>>2]];j=1;c=L[a+4>>1]}c=c&65535;j=(g|0)==43|j;if(c>>>0>j>>>0){while(1){c=c-1|0;g=K[c+J[a>>2]|0];h=0;if((g-58&255)>>>0<246|e>>>0<i>>>0){break a}H[e|0]=g;e=e-1|0;if((c|0)>(j|0)){continue}break}}h=1;if(e>>>0<i>>>0){break a}a=e-1|0;c=i-1|0;a=a>>>0<c>>>0?a:c;Gd(a+1|0,48,e-a|0);h=1}g=h;a=0;b:{if(!g){break b}a=50;c:{e=K[f+15|0];d:{e:{if(e){while(1){c=H[(f+5|0)+d|0];a=a<<24>>24;if((c|0)>(a|0)){break c}if((a|0)>(c|0)){break e}a=K[d+19906|0];d=d+1|0;if((d|0)!=10){continue}break}a=-2147483648;break d}while(1){c=H[(f+5|0)+d|0];a=a<<24>>24;if((c|0)>(a|0)){break c}if((a|0)>(c|0)){break e}a=K[d+19964|0];d=d+1|0;if((d|0)!=10){continue}break}}a=0;d=0;while(1){a=(H[(f+5|0)+d|0]+P(a,10)|0)-48|0;d=d+1|0;if((d|0)!=10){continue}break}a=e?0-a|0:a}J[b>>2]=a;a=1;break b}a=0}$c=f+16|0;return a}function Sy(){var a=0,b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;J[268510]=J[464827];_n();qd(J[268508]);J[268509]=0;J[268508]=0;m=1067864,n=Ye(J[268510],20,8520),J[m>>2]=n;m=1074052,n=Ye(J[268510],4,8513),J[m>>2]=n;m=1074048,n=Ye(J[268510],4,8495),J[m>>2]=n;m=1074056,n=Ye(J[268510],4,6045),J[m>>2]=n;a=P(J[266967],J[268510]);b=Ch(a<<1,20,4298);J[268508]=b;J[268509]=b+P(a,20);a=J[464809];if((a|0)>0){b=J[464808];g=J[268514];h=J[268512];i=J[268513];j=J[266966];while(1){if((b|0)>0){k=d|8;a=J[464807];c=0;while(1){if((a|0)>0){l=c|8;b=0;while(1){a=P(e,20)+j|0;J[a+8>>2]=0;I[a+4>>1]=k;I[a+2>>1]=l;I[a>>1]=b|8;J[a+12>>2]=0;J[a+16>>2]=0;H[a+7|0]=K[a+7|0]&192;H[a+6|0]=K[a+6|0]&224|21;f=e<<2;J[i+f>>2]=a;J[f+h>>2]=a;J[f+g>>2]=0;e=e+1|0;a=J[464807];b=b+16|0;if((a|0)>(b|0)){continue}break}b=J[464808]}c=c+16|0;if((c|0)<(b|0)){continue}break}a=J[464809]}d=d+16|0;if((d|0)<(a|0)){continue}break}}J[268518]=1761892689;J[268516]=1761892689;J[268517]=1761892689}function _B(a,b){a=a|0;b=Q(b);var c=0,d=0,e=0;e=$c-32|0;$c=e;c=J[a+388>>2];d=J[a+384>>2];J[a+4>>2]=d;J[a+8>>2]=c;J[a+352>>2]=d;J[a+356>>2]=c;J[a+12>>2]=J[a+392>>2];c=J[a+412>>2];J[a+376>>2]=J[a+408>>2];J[a+380>>2]=c;c=J[a+404>>2];J[a+368>>2]=J[a+400>>2];J[a+372>>2]=c;c=J[a+396>>2];J[a+360>>2]=J[a+392>>2];J[a+364>>2]=c;c=a+424|0;a:{if(!J[c+92>>2]){break a}d=J[c+104>>2];J[a+384>>2]=J[c+100>>2];J[a+388>>2]=d;J[a+392>>2]=J[c+108>>2];d=J[c+92>>2];J[c+92>>2]=d-1;if((d|0)<2){break a}Ie(c+100|0,c+112|0,P(d,12)-12|0)}d=J[c+96>>2];b:{if(!d){break b}N[a+396>>2]=N[c+220>>2];N[a+400>>2]=N[c+224>>2];N[a+404>>2]=N[c+228>>2];N[a+412>>2]=N[c+232>>2];J[c+96>>2]=d-1;if((d|0)<2){break b}Ie(c+220|0,c+236|0,(d<<4)-16|0)}d=J[c>>2];if(d){N[a+408>>2]=N[c+4>>2];Ie(c+4|0,c+8|0,60);J[c>>2]=d-1}rq(a);J[e+24>>2]=J[a+360>>2];c=J[a+356>>2];J[e+16>>2]=J[a+352>>2];J[e+20>>2]=c;J[e+8>>2]=J[a+392>>2];c=J[a+388>>2];J[e>>2]=J[a+384>>2];J[e+4>>2]=c;oq(a,e+16|0,e,b);$c=e+32|0}function rk(a,b){var c=0,d=0,e=Q(0),f=0,g=Q(0),h=Q(0),i=Q(0),j=Q(0),k=Q(0);c=$c-32|0;$c=c;d=J[384753];J[384753]=d+1;f=(d<<2)+1539024|0;d=L[P(L[769504],12)+122194>>1];J[f>>2]=d>>>J[458159];Gi(c+12|0,d,c+28|0);d=J[273211];f=L[769504];if(K[f+83024|0]){d=sd(d,J[(f<<2)+69200>>2])}a:{b:{if(a){if(b){J[c+20>>2]=1056964608;g=Q(-.34375);h=Q(.34375);break b}J[c+12>>2]=1056964608;i=Q(-.34375);e=Q(.34375);break a}if(b){J[c+12>>2]=1056964608;i=Q(.34375);e=Q(-.34375);break a}J[c+20>>2]=1056964608;g=Q(.34375);h=Q(-.34375)}e=Q(0)}j=N[c+20>>2];a=J[384754];N[a+20>>2]=N[c+24>>2];N[a+16>>2]=j;J[a+12>>2]=d;N[a+8>>2]=e;J[a+4>>2]=0;N[a>>2]=i;k=N[c+16>>2];N[a+44>>2]=k;N[a+40>>2]=j;J[a+36>>2]=d;N[a+32>>2]=e;J[a+28>>2]=1065353216;N[a+24>>2]=i;e=N[c+12>>2];N[a+68>>2]=k;N[a- -64>>2]=e;J[a+60>>2]=d;N[a+56>>2]=h;J[a+52>>2]=1065353216;N[a+48>>2]=g;N[a+92>>2]=N[c+24>>2];N[a+88>>2]=e;J[a+84>>2]=d;N[a+80>>2]=h;J[a+76>>2]=0;N[a+72>>2]=g;J[384754]=a+96;$c=c+32|0}function fI(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0;e=$c-272|0;$c=e;a:{if(K[1054203]){break a}g=K[1054793];if(!K[a+4|0]){if(!g){break a}J[e+268>>2]=16777216;J[e+264>>2]=e;b=e+264|0;c=Kr(a+672|0,b,c,d);if(!Di(b)|O[131740]>O[((c+J[a+44>>2]&31)<<3)+819376>>3]+10){break a}Dn(b);f=1;break a}b:{if(!g){break b}if(lg(a+2124|0,c,d)){jk(a,0);f=1;break a}if(lg(a+2208|0,c,d)){f=1;jk(a,1);break a}if(!lg(a+2292|0,c,d)){break b}ym(a+856|0,!K[a+876|0]);_g(a);f=1;break a}g=a+672|0;if(!lg(g,c,d)){c:{if(!K[a+876|0]){break c}f=a+856|0;if(!lg(f,c,d)){break c}bd[J[J[a+856>>2]+24>>2]](f,b,c,d)|0;_g(a);f=1;break a}bd[J[J[a+72>>2]+24>>2]](a+72|0,b,c,d)|0;f=1;break a}b=Lr(g);if(!$f(J[a+676>>2],J[a+688>>2]+(J[a+680>>2]-b|0)|0,J[a+684>>2],b,c,d)){break a}J[e+268>>2]=16777216;J[e+264>>2]=e;a=e+264|0;Kr(g,a,c,d);if(!L[e+268>>1]){break a}if(!(!Di(a)|!K[54264])){Dn(a);f=1;break a}f=1;if(!K[1054740]){break a}Ih(1793960,e+264|0)}$c=e+272|0;return f|0}function ri(a,b,c,d,e,f,g){var h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=Q(0),q=0;a:{if(Q(R(Q(f-d)))<Q(.0010000000474974513)|d>f|(Q(R(Q(g-e)))<Q(.0010000000474974513)|e>g)){break a}i=N[b+4>>2];h=N[260056];j=Q(Q(Q(f-i)*h)+Q(.5));if(j<=Q(0)){break a}n=N[b+12>>2];k=Q(Q(Q(g-n)*h)+Q(.5));if(k<=Q(0)){break a}l=Q(Q(Q(d-i)*h)+Q(.5));if(l>=Q(1)){break a}o=Q(Q(Q(e-n)*h)+Q(.5));if(o>=Q(1)){break a}q=K[c+6|0];b=J[a>>2];h=N[260055];m=Q(i-h);m=d>m?d:m;N[b>>2]=m;d=N[c>>2];k=k<=Q(1)?k:Q(1);N[b+92>>2]=k;l=l>=Q(0)?l:Q(0);N[b+88>>2]=l;c=q<<24|16777215;J[b+84>>2]=c;p=Q(n+h);g=g<p?g:p;N[b+80>>2]=g;N[b+76>>2]=d;N[b+72>>2]=m;N[b+68>>2]=k;j=j<=Q(1)?j:Q(1);N[b- -64>>2]=j;J[b+60>>2]=c;N[b+56>>2]=g;N[b+52>>2]=d;g=Q(i+h);f=f<g?f:g;N[b+48>>2]=f;g=o>=Q(0)?o:Q(0);N[b+44>>2]=g;N[b+40>>2]=j;J[b+36>>2]=c;i=Q(n-h);e=e>i?e:i;N[b+32>>2]=e;N[b+28>>2]=d;N[b+24>>2]=f;N[b+20>>2]=g;N[b+16>>2]=l;J[b+12>>2]=c;N[b+8>>2]=e;N[b+4>>2]=d;J[a>>2]=b+96}}function lq(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=Q(0);d=$c-16|0;$c=d;e=a+14|0;c=e;f=a+44|0;g=rf(f,1905);b=P(g>>>31|0,16843009);H[c|0]=b;h=b>>>8|0;H[c+1|0]=h;i=b>>>16|0;H[c+2|0]=i;c=b>>>24|0;H[e+3|0]=c;H[a+11|0]=b;H[a+12|0]=h;H[a+13|0]=i;H[a+14|0]=c;b=0;b=(g|0)<0?K[a|0]!=0:b;c=1;H[a+20|0]=1;H[a+18|0]=b;Kg(a,1618,1613,e);Kg(a,7977,7969,a+16|0);Kg(a,16756,16749,a+13|0);Kg(a,8646,8637,a+15|0);Kg(a,11228,11222,a+20|0);Kg(a,8725,8712,a+12|0);Kg(a,5747,5740,a+18|0);a:{if(!K[a|0]){break a}b=a+11|0;if((rf(f,1898)|0)>=0){H[b|0]=1;H[b+1|0]=1;H[b+2|0]=1;H[b+3|0]=1;H[b+3|0]=1;H[b+4|0]=1;H[b+5|0]=1;H[b+6|0]=1;H[a+18|0]=K[a|0]!=0;break a}if((rf(f,1891)|0)<0){break a}H[b|0]=0;H[b+1|0]=0;H[b+2|0]=0;H[b+3|0]=0;H[b+4|0]=0;H[b+5|0]=0;H[b+6|0]=0;H[b+7|0]=0}j=a,k=kq(19492,a),N[j+24>>2]=k;j=a,k=kq(19482,a),N[j+40>>2]=k;b=d+8|0;jq(b,19456,a);if(!(K[1054197]|!L[d+12>>1])){b=De(b,d+4|0);c=b?J[d+4>>2]:1}J[a+28>>2]=c;Pl(a);$c=d+16|0}function cp(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0;j=J[b>>2];o=bp(J[b+4>>2],J[b+8>>2]);a:{if((o|0)<=0){i=j;break a}f=J[b+4>>2];g=J[b+8>>2];k=1;while(1){a=(a|0)/2|0;p=(p|0)/2|0;f=f>>>((f|0)>1)|0;g=g>>>((g|0)>1)|0;i=Ye(P(f,g),4,4619);b:{if((c|0)!=1){if((g|0)<=0){break b}l=0;s=c<<3;m=i;h=j;while(1){if((f|0)>0){q=(c<<2)+h|0;e=0;while(1){n=e<<3;r=n|4;t=(e<<2)+m|0,u=pj(pj(J[h+n>>2],J[h+r>>2]),pj(J[q+n>>2],J[q+r>>2])),J[t>>2]=u;e=e+1|0;if((f|0)!=(e|0)){continue}break}}m=(f<<2)+m|0;h=h+s|0;l=l+1|0;if((l|0)!=(g|0)){continue}break}break b}h=0;c=i;e=j;if((g|0)<=0){break b}while(1){t=c,u=pj(J[e>>2],J[e+4>>2]),J[t>>2]=u;e=e+8|0;c=(f<<2)+c|0;h=h+1|0;if((h|0)!=(g|0)){continue}break}}c:{if(d){va(3553,k|0,p|0,a|0,f|0,g|0,6408,5121,i|0);break c}sa(3553,k|0,6408,f|0,g|0,0,6408,5121,i|0)}if(J[b>>2]!=(j|0)){qd(j)}e=(k|0)!=(o|0);k=k+1|0;j=i;c=f;if(e){continue}break}}if(J[b>>2]!=(i|0)){qd(i)}}function _J(a){a=a|0;var b=0,c=0,d=0,e=Q(0),f=0;d=$c-16|0;$c=d;if(!K[1688036]){jn()}c=vd(a);b=a+2|0;J[422006]=b;J[422003]=b;J[422005]=c;J[422004]=c;a:{if(K[52793]){b=1732868;if(K[a+1026|0]){break a}}b=1688044}b:{c:{if(!K[b+44801|0]){a=Sr(1687980,b+44800|0);if(!((a|0)==-857812991|!a)){rt(a);break b}if(!K[b+44801|0]){break c}}if(K[b+44820|0]){break c}d:{a=J[b+44816>>2];e:{if((a|0)<=3){a=bd[J[b+44740>>2]](b+44740|0,(a+b|0)+44808|0,4-a|0,d+12|0)|0;c=J[b+44816>>2]+J[d+12>>2]|0;J[b+44816>>2]=c;if(a){break e}if((c|0)<4){break c}}a=J[422010];if(!a){a=ud(b+44808|0);J[422010]=a}c=J[b+44796>>2];if(!c){c=wf(a,1);J[b+44796>>2]=c;if(!c){break d}a=J[422010]}f=c;c=J[b+44812>>2];a=bd[J[b+44740>>2]](b+44740|0,f+c|0,a-c|0,d+12|0)|0;J[b+44812>>2]=J[b+44812>>2]+J[d+12>>2];if(!a){break c}}rt(a);break b}Qf(1468,23138);H[b+44820|0]=1}a=J[422010];if(a){e=Q(Q(J[433214])/Q(a|0))}else{e=Q(0)}yj(1045536,e)}$c=d+16|0}function _I(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0;d=$c-16|0;$c=d;b=rn(K[a|0]);a:{if(!b){break a}sk(b);bf(b);f=a+1|0;e=63;b:{c:{while(1){c=e;if(K[c+f|0]&223){break c}e=c-1|0;if(c){continue}break}c=0;break b}c=c+1|0}I[d+14>>1]=64;I[d+12>>1]=c;J[d+8>>2]=f;e=d+8|0;Vf(b+72|0,65,e);c=K[a+65|0];H[b+47|0]=c&2;H[b+43|0]=c&1;H[b+46|0]=c&4;H[b+45|0]=c&8;g=b,h=ud(a+66|0),J[g+140>>2]=h;g=b,h=ud(a+70|0),J[g+144>>2]=h;g=b,h=ud(a+74|0),J[g+148>>2]=h;g=b,h=ud(a+78|0),J[g+152>>2]=h;g=b,h=ud(a+82|0),J[g+156>>2]=h;g=b,h=ud(a+86|0),J[g+160>>2]=h;g=b,h=ud(a+90|0),J[g+164>>2]=h;g=b,h=ud(a+94|0),J[g+168>>2]=h;g=b,h=ud(a+98|0),J[g+172>>2]=h;g=b,h=ud(a+102|0),J[g+176>>2]=h;g=b,h=ud(a+106|0),J[g+180>>2]=h;g=b,h=vd(a+110|0),I[g+184>>1]=h;g=b,h=vd(a+112|0),I[g+186>>1]=h;a=K[a+114|0];if(a>>>0>=65){J[d+4>>2]=64;Bg(10973,e,d+4|0);break a}H[b+188|0]=a;a=Ch(P(a,24),16,6061);H[b+138|0]=1;J[b+4>>2]=a}$c=d+16|0}function si(a,b,c,d,e){var f=0,g=Q(0),h=0,i=Q(0),j=0,k=Q(0);J[e>>2]=0;J[e+4>>2]=0;J[e+24>>2]=0;J[e+28>>2]=0;J[e+16>>2]=0;J[e+20>>2]=0;J[e+8>>2]=0;J[e+12>>2]=0;g=N[a+8>>2];a:{if((c|0)>=0){j=M[464807]<=b>>>0|M[464809]<=d>>>0;k=Q(g+Q(.009999999776482582));while(1){b:{if(!j){a=P(J[464807],P(J[464809],c)+d|0)+b|0;a=J[464818]&(K[a+J[464805]|0]<<8|K[a+J[464804]|0]);break b}f=J[464849]-1|0;a=K[L[929696]+80720|0]!=4?7:0;if((f|0)==(c|0)){break b}a=0;if((f+J[464850]|0)!=(c|0)){break b}a=K[L[929697]+80720|0]!=4?7:0}f=a+66896|0;c:{if((K[f+13824|0]&254)==4|K[f|0]){break c}f=P(a,12)+66896|0;i=Q(N[f+27652>>2]+Q(c|0));if(i>=k){break c}N[e>>2]=i;I[e+4>>1]=a;Yp(g,e);e=e+8|0;h=h+1|0;if(N[f+18432>>2]!=Q(0)|N[f+27648>>2]!=Q(1)|N[f+18440>>2]!=Q(0)){break c}if(N[f+27656>>2]==Q(1)){break a}}if((c|0)>0){c=c-1|0;if((h|0)<4){continue}}break}if((h|0)>3){break a}}a=L[929696];J[e>>2]=0;I[e+4>>1]=a;Yp(g,e)}}function VH(a,b){a=a|0;b=Q(b);var c=0,d=0,e=Q(0),f=0,g=0,h=0,i=0;c=$c-80|0;$c=c;i=J[461354];d=-3;g=J[465684];a:{if((g|0)<=0){break a}h=J[465686];while(1){if(J[(P(f,312)+h|0)+128>>2]!=(i|0)){f=f+1|0;if((g|0)!=(f|0)){continue}break a}break}d=J[(P(f,312)+h|0)+132>>2]}J[c+76>>2]=d;if((d|0)!=J[a+36>>2]){J[a+36>>2]=d;J[c+72>>2]=4194304;J[c+68>>2]=c;b:{c:{switch(d+2|0){case 0:od(c+68|0,26417);break b;case 1:od(c+68|0,10619);break b;default:break c}}if(d>>>0>100){break b}Hd(c+68|0,27949,c+76|0)}ne(c+68|0,360)}d:{if(!J[a+128>>2]){break d}e=Q(N[204908]-b);N[204908]=e;if(!(e<=Q(0))){break d}bd[J[J[a+88>>2]+4>>2]](a+88|0);H[a+7|0]=1}e:{if(!J[a+200>>2]){break e}e=Q(N[204909]-b);N[204909]=e;if(!(e<=Q(0))){break e}bd[J[J[a+160>>2]+4>>2]](a+160|0);H[a+7|0]=1}f:{if(!J[a+272>>2]){break f}b=Q(N[204910]-b);N[204910]=b;if(!(b<=Q(0))){break f}bd[J[J[a+232>>2]+4>>2]](a+232|0);H[a+7|0]=1}$c=c+80|0}function Yy(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;a:{if(b-15>>>0<=1){b=0;a=J[266966];if(!a){break a}c=J[268510];if((c|0)<=0){break a}while(1){d=a+P(b,20)|0;e=K[d+6|0];if(!(e&8)){H[d+6|0]=e&249|4}b=b+1|0;if((c|0)!=(b|0)){continue}break}break a}if((b&-2)!=2){break a}J[268507]=2147483647;J[268505]=2147483647;J[268506]=2147483647;b=J[195020];a=J[464849];c=(a|0)>0?a:0;J[195020]=c;a=a+J[464850]|0;J[195019]=(a|0)>0?a:0;if(!J[266966]|!J[464804]){break a}a=J[464826];if((a|0)<=0){break a}e=(b|0)>(c|0)?b:c;b=J[464825];c=0;while(1){if((b|0)>0){a=J[464824];d=0;while(1){if((a|0)>0){f=d<<4;b=0;while(1){b:{c:{if(!(!c|!b|(a-1|0)==(b|0))){if((J[464826]-1|0)!=(c|0)){break b}if(e>>>0>f>>>0){break c}break b}if(e>>>0<=f>>>0){break b}}Jf(b,d,c);a=J[464824]}b=b+1|0;if((b|0)<(a|0)){continue}break}b=J[464825]}d=d+1|0;if((d|0)<(b|0)){continue}break}a=J[464826]}c=c+1|0;if((c|0)<(a|0)){continue}break}}}function XJ(a,b){a=a|0;b=Q(b);var c=0,d=0,e=0,f=0,g=Q(0),h=Q(0);c=$c-32|0;$c=c;d=J[207101];g=b;b=N[(K[813200]?48592:48596)>>2];if(b>Q(3)){e=1;a:{if(K[d+474|0]){break a}e=0;if(K[d+791|0]){break a}H[d+791|0]=1;if(!K[834368]){break a}pd(16275)}b=e?b:Q(3)}Jt(d,g,b);e=c+20|0;Xl(e,d);N[c+24>>2]=N[203287]+N[c+24>>2];d=c+8|0;bd[J[J[203292]+12>>2]](d);Wj(d,N[c+8>>2],N[c+12>>2]);N[c+8>>2]=-N[c+8>>2];N[c+12>>2]=-N[c+12>>2];N[c+16>>2]=-N[c+16>>2];f=J[207101];if(K[f+494|0]|!K[813081]){f=!K[f+476|0]}else{f=1}b:{if(!(!f|!K[1859276])){if(xt(813232,e,d,b,778)){break b}}J[203308]=-1;J[203309]=-1;J[203336]=-1;J[203337]=-1;I[406678]=1536;I[406646]=0;J[203310]=-1;J[203338]=-1;h=Q(N[d>>2]*b);N[203333]=h;g=Q(N[d+4>>2]*b);N[203334]=g;b=Q(N[d+8>>2]*b);N[203335]=b;N[203333]=h+N[e>>2];N[203334]=g+N[e+4>>2];N[203335]=b+N[e+8>>2]}J[a+8>>2]=J[203335];d=J[203334];J[a>>2]=J[203333];J[a+4>>2]=d;$c=c+32|0}function qk(a,b){var c=0,d=0,e=Q(0),f=Q(0),g=0,h=Q(0),i=Q(0);c=$c-32|0;$c=c;d=J[384753];J[384753]=d+1;g=(d<<2)+1539024|0;d=L[P(L[769504],12)+122198>>1];J[g>>2]=d>>>J[458159];Gi(c+12|0,d,c+28|0);d=J[273211];g=L[769504];if(K[g+83024|0]){d=sd(d,J[(g<<2)+69200>>2])}a:{if(a){if(b){J[c+12>>2]=1056964608;e=Q(-.34375);f=Q(0);break a}J[c+20>>2]=1056964608;f=Q(-.34375);break a}if(b){J[c+20>>2]=1056964608;f=Q(.34375);break a}J[c+12>>2]=1056964608;e=Q(.34375);f=Q(0)}h=N[c+20>>2];a=J[384754];N[a+20>>2]=N[c+24>>2];N[a+16>>2]=h;J[a+12>>2]=d;N[a+8>>2]=e;J[a+4>>2]=0;N[a>>2]=e;i=N[c+16>>2];N[a+44>>2]=i;N[a+40>>2]=h;J[a+36>>2]=d;N[a+32>>2]=e;J[a+28>>2]=1065353216;N[a+24>>2]=e;e=N[c+12>>2];N[a+68>>2]=i;N[a- -64>>2]=e;J[a+60>>2]=d;N[a+56>>2]=f;J[a+52>>2]=1065353216;N[a+48>>2]=f;N[a+92>>2]=N[c+24>>2];N[a+88>>2]=e;J[a+84>>2]=d;N[a+80>>2]=f;J[a+76>>2]=0;N[a+72>>2]=f;J[384754]=a+96;$c=c+32|0}function zo(){var a=0,b=0,c=0,d=0,e=0;a:{b=J[464807];a=J[263514];if(b>>>0<=a>>>0){break a}c=J[263515];if(c>>>0>=M[464808]){break a}d=J[464809];e=J[263516];if(d>>>0<=e>>>0){break a}b=a+P(b,e+P(c,d)|0)|0;c=J[464818]&(K[b+J[464805]|0]<<8|K[b+J[464804]|0]);b=c+66896|0;if(K[b+13824|0]==4|!(K[b+64512|0]|K[c+132176|0])){break a}a=0;b:{if(!K[1067756]){pd(23719);break b}d=J[266938];b=L[(d+J[266937]<<1)+1066048>>1];if((b|0)!=(c|0)){e=(c|0)==2?3:c;c=K[1054197]?K[1054198]?c:(e|0)==43?44:e:c;while(1){if((c|0)==L[(a+d<<1)+1066048>>1]){ch(a);break b}a=a+1|0;if((a|0)!=9){continue}break}a=0;c:{if(K[775856]){while(1){if($o(L[(J[266938]+a<<1)+1066048>>1],c)){ch(a);break c}a=a+1|0;if((a|0)!=9){continue}break}d=J[266938];b=L[(d+J[266937]<<1)+1066048>>1]}if(!b){break c}a=0;while(1){b=(a+d<<1)+1066048|0;if(!L[b>>1]){I[b>>1]=c;ch(a);break b}a=a+1|0;if((a|0)!=9){continue}break}}hj(c)}}}}function xx(a){a=a|0;var b=0,c=0;J[a+104>>2]=0;b=rd(a,18311,313,314,0,0)<<5;J[b+1074108>>2]=393;J[b+1074104>>2]=394;b=rd(a,14268,337,346,347,0)<<5;J[b+1074124>>2]=1065353216;c=b+1074116|0;J[c>>2]=1048576e3;J[c+4>>2]=1082130432;J[b+1074112>>2]=44852;J[b+1074108>>2]=395;J[b+1074104>>2]=396;b=rd(a,14225,337,346,347,0)<<5;J[b+1074124>>2]=1065353216;c=b+1074116|0;J[c>>2]=1048576e3;J[c+4>>2]=1082130432;J[b+1074112>>2]=44852;J[b+1074108>>2]=397;J[b+1074104>>2]=398;b=rd(a,14252,337,346,347,0)<<5;J[b+1074124>>2]=1065353216;c=b+1074116|0;J[c>>2]=1048576e3;J[c+4>>2]=1082130432;J[b+1074112>>2]=44852;J[b+1074108>>2]=399;J[b+1074104>>2]=400;b=rd(a,4260,313,314,0,0)<<5;J[b+1074108>>2]=401;J[b+1074104>>2]=402;b=rd(a,12911,313,314,0,0)<<5;J[b+1074108>>2]=403;J[b+1074104>>2]=404;b=rd(a,2857,313,314,0,0)<<5;J[b+1074108>>2]=405;J[b+1074104>>2]=406;rd(a,2838,407,0,0,0);Zf(a,-1,364)}function FL(){var a=0;wd(1531648,37384);wd(1531664,37428);wd(1531680,37472);wd(1531696,37516);wd(1531712,37648);wd(1531728,37692);wd(1531744,37560);wd(1531760,37604);wd(1531840,37780);a=J[382935];J[382966]=J[382934];J[382967]=a;a=J[382933];J[382964]=J[382932];J[382965]=a;wd(1531872,37736);a=J[382943];J[382974]=J[382942];J[382975]=a;a=J[382941];J[382972]=J[382940];J[382973]=a;a=J[382961];J[382992]=J[382960];J[382993]=a;a=J[382963];J[382994]=J[382962];J[382995]=a;a=J[382965];J[382996]=J[382964];J[382997]=a;a=J[382967];J[382998]=J[382966];J[382999]=a;wd(1532e3,38e3);wd(1532016,38044);wd(1531904,37912);wd(1531920,37956);wd(1531936,37824);wd(1531952,37868);a=J[382979];J[383010]=J[382978];J[383011]=a;a=J[382977];J[383008]=J[382976];J[383009]=a;a=J[382981];J[383012]=J[382980];J[383013]=a;a=J[382983];J[383014]=J[382982];J[383015]=a;wd(1532064,38088);wd(1532080,38132)}function DC(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;c=$c-16|0;$c=c;a=Fh(c+4|0,a);a:{if(a){Af(a,12332,b);qd(J[c+4>>2]);break a}a=J[c+8>>2];b:{if((a|0)!=J[c+12>>2]){bd[J[12861]](32160);a=0;break b}if((a|0)<=15){bd[J[12861]](32168);a=0;break b}if(!ni(a)){bd[J[12861]](32176);a=0;break b}k=Gd(826352,0,1024);qd(J[206585]);g=J[c+12>>2];J[206587]=g;a=J[c+8>>2];J[206585]=J[c+4>>2];J[206586]=a;b=J[c+8>>2]>>4;J[12318]=b;if((g|0)>0){l=J[206585];h=J[206586];m=(h|0)<=0;while(1){if(!m){n=(P(d,h)<<2)+l|0;i=(d|0)/(b|0)<<4;e=0;while(1){f=(e<<2)+n|0;a=b;c:{while(1){j=a;if((a|0)<=0){break c}a=a-1|0;if(M[(a<<2)+f>>2]<16777216){continue}break}f=(i<<2)+k|0;a=J[f>>2];J[f>>2]=(a|0)>(j|0)?a:j}i=i+1|0;e=b+e|0;if((h|0)>(e|0)){continue}break}}d=d+1|0;if((g|0)!=(d|0)){continue}break}}J[206620]=(b|0)/4;a=1}if(a){Nd(1046576);break a}qd(J[c+4>>2])}$c=c+16|0}function HE(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0;c=$c-128|0;$c=c;a:{if((bd[J[a+44>>2]]()|0)>0){while(1){if(L[((b<<3)+a|0)+76>>1]){d=J[((b<<2)+a|0)+96>>2];e=(d|0)<(e|0)?e:d;f=J[a+108>>2]+f|0;b=b+1|0;if((bd[J[a+44>>2]]()|0)>(b|0)){continue}}break}if(e){break a}}e=J[a+140>>2]}f=f?f:J[a+108>>2];b:{if(H[a+21|0]&1){Cd(a+112|0);break b}b=c+8|0;vg(b,e,f);d=c+32|0;Ef(d,45028,J[a+40>>2],1);pf(b,d,0,0);J[c+124>>2]=4325376;J[c+120>>2]=c+48;d=0;b=0;while(1){if(L[((b<<3)+a|0)+76>>1]){I[c+124>>1]=0;g=Qr(a,0,b);if(!Gq(g)){h=c+120|0;Ud(h,38);Ud(h,g)}yi(a,b,c+120|0);g=J[c+124>>2];J[c+32>>2]=J[c+120>>2];J[c+36>>2]=g;pf(c+8|0,c+32|0,b?0:J[a+140>>2],d);d=J[a+108>>2]+d|0;b=b+1|0;if((b|0)!=3){continue}}break}b=c+8|0;Mg(a+112|0,b);ug(b)}J[a+16>>2]=f;J[a+12>>2]=e;J[a+200>>2]=0;bd[J[J[a>>2]+8>>2]](a);I[a+118>>1]=J[a+8>>2];I[a+116>>1]=J[a+4>>2]+K[a+145|0];$c=c+128|0}function qJ(a){a=a|0;var b=0,c=Q(0),d=0;d=ud(a+1|0);b=(d|0)<=-16777215?-16777215:d;b=(b|0)>=16777215?16777215:b;a:{switch(K[a|0]){case 0:a=(b|0)>0?b:0;pr(a>>>0>=767?767:a);return;case 1:a=(b|0)>0?b:0;qr(a>>>0>=767?767:a);return;case 2:Pj(b);return;case 3:tm(b);return;case 4:a=(b|0)<=-32767?-32767:b;J[12428]=(d|0)<=0?32768:(a|0)>=32767?32767:a;Hg(J[12427]);return;case 5:nr(Q(Q(b|0)*Q(.00390625)));return;case 6:mr(Q(Q(b|0)*Q(.00390625)));return;case 7:c=Q(Q(b|0)*Q(.0078125));if(c!=N[464854]){N[464854]=c;Rd(1046056,7)}return;case 8:a=(d|0)!=0;if((a|0)!=J[464856]){J[464856]=a;Rd(1046056,9)}return;case 9:if((b|0)!=J[464850]){J[464850]=b;Rd(1046056,3)}return;case 10:c=Q(Q(b|0)*Q(.0009765625));if(c!=N[464857]){N[464857]=c;Rd(1046056,10)}return;case 11:c=Q(Q(b|0)*Q(.0009765625));if(c!=N[464858]){N[464858]=c;Rd(1046056,11)}break;default:break a}}}function ul(a){var b=0,c=0,d=0,e=0,f=0,g=Q(0),h=Q(0),i=Q(0);f=$c-16|0;$c=f;d=f+8|0;c=K[1054211]<a>>>0?31400:P(a,20)+30080|0;Wd(d,J[c>>2]);b=a+66896|0;H[b+1536|0]=K[c+13|0];H[b+768|0]=K[c+14|0];e=(a<<2)+66896|0;N[e+5376>>2]=Q(K[c+12|0])/Q(100);J[e+2304>>2]=J[c+8>>2];Pp(a,K[c+17|0]);H[b+15360|0]=K[c+19|0];H[b+14592|0]=K[c+18|0];J[e+9984>>2]=1065353216;Vf((a<<6)+726704|0,64,d);H[b+17664|0]=0;H[b+16128|0]=0;d=K[c+16|0];H[b+13824|0]=d;a:{if((d|0)==5){h=Q(1);i=Q(.15625);g=Q(.84375);break a}h=Q(Q(K[c+7|0])*Q(.0625));g=Q(1)}b=P(a,12)+66896|0;N[b+18440>>2]=i;J[b+18436>>2]=0;N[b+18432>>2]=i;N[b+27648>>2]=g;N[b+27652>>2]=h;N[b+27656>>2]=g;Mp(a,d);Fl(a);Dp(a);a=K[c+5|0];I[b+55296>>1]=a;I[b+55306>>1]=K[c+4|0];I[b+55298>>1]=a;I[b+55300>>1]=a;I[b+55304>>1]=K[c+6|0];I[b+55302>>1]=a;N[e+656640>>2]=Q(Q(K[c+15|0])/Q(100))*Q(5.400000095367432);$c=f+16|0}function OG(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;a=$c-464|0;$c=a;J[a+12>>2]=29360128;J[a+8>>2]=a+16;b=$c-32|0;$c=b;J[b>>2]=32;d=a+8|0;Hd(d,29754,b);J[b+4>>2]=0;ba(3414,b+4|0);Hd(d,28764,aa(7936)|0);Hd(d,28776,aa(7937)|0);Hd(d,28802,aa(7938)|0);c=b+8|0;Wd(c,aa(7939)|0);a:{if(!Ji(c,33844)){break a}ba(36936,b+28|0);ba(36937,b+24|0);c=J[b+28>>2];if((c|0)<=0){break a}e=J[b+24>>2];if((e|0)<=0){break a}N[b+16>>2]=Q(e|0)*Q(.0009765625);N[b+20>>2]=Q(c|0)*Q(.0009765625);xe(d,28665,b+20|0,b+16|0)}c=J[263576];b:{if(c){N[b+8>>2]=Q(c|0)*Q(9.5367431640625e-7);Tf(d,28818,1054296,1054300,b+8|0);break b}xe(d,29790,1054296,1054300)}Hd(d,28638,b+4|0);c=$c-608|0;$c=c;Ac(c|0,600);e=Nh(c,600);if(e){od(d,28489);Sf(d,c,e)}$c=c+608|0;$c=b+32|0;if(L[a+12>>1]){while(1){Bs(a+8|0,a);if(L[a+4>>1]){Od(6259,a)}if(L[a+12>>1]){continue}break}}$c=a+464|0}function sK(a,b){a=a|0;b=Q(b);var c=Q(0),d=Q(0),e=0,f=0,g=0,h=Q(0),i=Q(0);e=$c-32|0;$c=e;h=Q(Q(J[203269])*Q(.0038197184912860394));g=J[263483];f=g;a:{if(J[263697]){break a}f=g;if(!K[1869221]){break a}f=J[263483]}f=f<<3;c=N[f+813192>>2];b:{if(K[813080]){d=c;c=N[203306];i=N[203293];d=Q(Q(Q(Q(Q(d-c)*Q(35))/i)*b)+c);c=Q(c*d)<Q(0)?Q(0):d;d=N[203307];b=Q(Q(Q(Q(Q(N[f+813196>>2]-d)*Q(35))/i)*b)+d);b=Q(d*b)<Q(0)?Q(0):b;break b}b=N[f+813196>>2]}N[203307]=b;N[203306]=c;b=Q(h*b);b=K[813082]?Q(-b):b;c=Q(h*c);c:{if(!(!(K[1056204]|K[1056205])|!K[J[203292]])){N[203301]=c+N[203301];N[203302]=b+N[203302];break c}H[e+28|0]=6;N[e+16>>2]=c+N[a+400>>2];b=Cf(Q(b+N[a+396>>2]));N[e+12>>2]=b;if(!(!(b>=Q(90))|!(b<=Q(270)))){N[e+12>>2]=N[a+396>>2]<Q(180)?Q(90):Q(270)}bd[J[J[a>>2]+8>>2]](a,e)}a=(g<<3)+813192|0;J[a>>2]=0;J[a+4>>2]=0;$c=e+32|0}function mp(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;p=J[263560];g=J[464809];q=J[464808];h=J[464807];i=b+d|0;e=i-4|0;a:{if((e|0)>(b|0)){j=(b|0)>(e|0)?b:e;k=a-1|0;l=c-1|0;while(1){m=P(b,g);n=b>>>0<q>>>0;f=l;while(1){if(!(f>>>0<g>>>0&n)){break a}r=P(f+m|0,h)+p|0;d=k;while(1){if(K[d+r|0]|d>>>0>=h>>>0){break a}s=(a|0)<(d|0);d=d+1|0;if(!s){continue}break}d=(c|0)>=(f|0);f=f+1|0;if(d){continue}break}b=b+1|0;if((j|0)!=(b|0)){continue}break}}o=1;if((i|0)<=-2147483645){break a}f=a+2|0;a=a-2|0;k=c+2|0;c=c-2|0;while(1){l=P(e,g);j=e>>>0<q>>>0;b=c;while(1){o=0;if(!(j&b>>>0<g>>>0)){break a}m=P(b+l|0,h)+p|0;d=a;while(1){if(K[d+m|0]|d>>>0>=h>>>0){break a}n=(d|0)>=(f|0);d=d+1|0;if(!n){continue}break}d=(b|0)<(k|0);b=b+1|0;if(d){continue}break}o=1;e=e+1|0;if((i|0)>(e|0)){continue}break}}return o}function ZD(a,b){a=a|0;b=b|0;var c=0,d=0,e=Q(0),f=0,g=0,h=Q(0),i=0,j=Q(0);c=J[a+1732>>2];d=J[a+1740>>2];mg(J[a+4>>2]-c|0,J[a+8>>2]-d|0,J[a+1736>>2]+(c+J[a+12>>2]|0)|0,J[a+1744>>2]+(d+J[a+16>>2]|0)|0,-1474158046,-899139271);if(J[a+52>>2]<J[a+48>>2]){bd[J[J[a+1628>>2]>>2]](a+1628|0)}d=J[a+60>>2];if(!(!K[1054743]|(d|0)==-1|!L[((d<<1)+a|0)+92>>1])){f=J[a+44>>2];i=(d|0)/(f|0)|0;g=J[a+64>>2];j=Q(g|0);e=Q(j*Q(.10000000149011612));h=Q(Q((J[a+8>>2]+P(J[a+68>>2],i-J[a+1668>>2]|0)|0)+3|0)-e);a:{if(Q(R(h))<Q(2147483648)){c=~~h;break a}c=-2147483648}h=Q(Q(J[a+4>>2]+P(d-P(f,i)|0,g)|0)-e);b:{if(Q(R(h))<Q(2147483648)){g=~~h;break b}g=-2147483648}e=Q(Q(e+e)+j);c:{if(Q(R(e))<Q(2147483648)){f=~~e;break c}f=-2147483648}mg(g,c,f,f,-1895825409,-1056964609)}ie(1);Ve(J[a+80>>2]);c=J[a+2712>>2];if(c){qo(c,b,a+1752|0)}return b+960|0}function nq(a,b){var c=Q(0),d=Q(0),e=0,f=Q(0),g=0,h=Q(0);c=Q(O[131740]);d=Jd(Q(c*Q(1.2566370964050293)));c=Md(Q(c*Q(1.7951958179473877)));g=a,h=Nf(N[a+148>>2],N[a+152>>2],b),N[g+136>>2]=h;b=Nf(N[a+140>>2],N[a+144>>2],b);N[a+132>>2]=b;f=Md(b);b=Q(Q(c*Q(.05235987901687622))+Q(.05235987901687622));N[a+184>>2]=-b;c=Q(d*Q(.05235987901687622));N[a+180>>2]=Q(Q(f*N[a+136>>2])*Q(1.0471975803375244))-c;d=Md(N[a+132>>2]);J[a+176>>2]=-2147483648;J[a+168>>2]=0;N[a+188>>2]=-N[a+180>>2];N[a+192>>2]=-N[a+184>>2];d=Q(Q(d*N[a+136>>2])*Q(-1.3962633609771729));N[a+164>>2]=d;N[a+172>>2]=-d;g=a,h=Q(Q(Q(R(Md(N[a+132>>2])))*N[a+136>>2])*Q(.25)),N[g+128>>2]=h;if(!(K[1054196]|!K[J[a+48>>2]+45|0])){e=a+128|0;mq(e,Q(.23000000417232513),c,b,1);mq(e,Q(.2800000011920929),c,b,0);N[a+188>>2]=-N[a+188>>2];N[a+192>>2]=-N[a+192>>2]}}function fK(a){a=a|0;var b=0,c=Q(0),d=0,e=Q(0),f=Q(0),g=0;b=$c-80|0;$c=b;a:{if(!pp(L[a+60>>1])){break a}J[b- -64>>2]=J[a+20>>2];d=J[a+16>>2];J[b+56>>2]=J[a+12>>2];J[b+60>>2]=d;J[b+48>>2]=J[a+136>>2];d=J[a+132>>2];J[b+40>>2]=J[a+128>>2];J[b+44>>2]=d;J[b+32>>2]=J[a+44>>2];d=J[a+40>>2];J[b+24>>2]=J[a+36>>2];J[b+28>>2]=d;J[b+16>>2]=J[a+56>>2];d=J[a+52>>2];J[b+8>>2]=J[a+48>>2];J[b+12>>2]=d;if(!nk(b+56|0,b+40|0,b+24|0,b+8|0,b+76|0,b+72|0)){break a}c=N[b+76>>2];e=Q(c*N[a+24>>2]);N[a+100>>2]=e+N[a+12>>2];f=Q(c*N[a+28>>2]);N[a+104>>2]=f+N[a+16>>2];c=Q(c*N[a+32>>2]);N[a+108>>2]=c+N[a+20>>2];e=Q(Q(c*c)+Q(Q(e*e)+Q(f*f)));c=N[J[207101]+456>>2];b:{if(e<=Q(c*c)){wt(a);break b}J[a>>2]=-1;J[a+4>>2]=-1;J[a+112>>2]=-1;J[a+116>>2]=-1;I[a+124>>1]=1536;I[a+60>>1]=0;J[a+8>>2]=-1;J[a+120>>2]=-1}g=1}$c=b+80|0;return g|0}function uJ(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;d=$c-1536|0;$c=d;b=a+1|0;g=K[a|0];a=0;while(1){i=(d+512|0)+(a<<2)|0,j=ud(b),J[i>>2]=j;b=b+4|0;c=(a|0)!=(g|0);a=a+1|0;if(c){continue}break}b=(g<<2^1020)+b|0;a=0;while(1){I[(a<<1)+d>>1]=K[a+b|0];c=(a|0)!=(g|0);a=a+1|0;if(c){continue}break}a=0;if(K[52793]){f=b+256|0;while(1){b=a<<1;c=b+d|0;e=c;h=L[c>>1];c=K[f+(a>>>2|0)|0];I[e>>1]=h|c<<8&768;e=(b|2)+d|0;I[e>>1]=L[e>>1]|c<<6&768;e=(b|4)+d|0;I[e>>1]=L[e>>1]|c<<4&768;b=(b|6)+d|0;I[b>>1]=L[b>>1]|(c&192)<<2;a=a+4|0;if(g>>>0>=a>>>0){continue}break}}f=J[464806];b=0;while(1){a=b;c=J[(d+512|0)+(a<<2)>>2];if(!((c|0)<0|(c|0)>=(f|0))){b=J[464807];f=(c|0)/(b|0)|0;h=J[464809];e=(f|0)/(h|0)|0;re(c-P(b,f)|0,e,f-P(e,h)|0,L[(a<<1)+d>>1]%768|0);f=J[464806]}b=a+1|0;if((a|0)!=(g|0)){continue}break}$c=d+1536|0}function JL(a){a=a|0;var b=0,c=0,d=Q(0),e=0,f=Q(0),g=Q(0);b=$c-176|0;$c=b;It(a);d=N[a+132>>2];d=Jd(Q(d+d));J[a+192>>2]=0;f=N[a+136>>2];g=Q(N[a+188>>2]*Q(Q(1)-f));d=Q(Q(Q(d*f)*Q(3.1415927410125732))*Q(.0625));N[a+188>>2]=g+Q(d+Q(.5));wk(J[273226],a);Ph(a,1531648,1);c=J[a+12>>2];J[b+40>>2]=c;e=J[a+8>>2];J[b+32>>2]=J[a+4>>2];J[b+36>>2]=e;f=N[a+128>>2];J[b+24>>2]=c;N[b+36>>2]=f+N[b+36>>2];c=J[b+36>>2];J[b+16>>2]=J[b+32>>2];J[b+20>>2]=c;J[b+8>>2]=J[a+88>>2];c=J[a+84>>2];J[b>>2]=J[a+80>>2];J[b+4>>2]=c;c=b+112|0;ui(a,b+16|0,b,c);me(c,c,1054312);e=b+48|0;ag(e,Q(.33000001311302185),Q(Q(Q(Q(g+Q(d+Q(1.0471975803375244)))*Q(10))*Q(.0625))+Q(.12700000405311584)),Q(-.4375));me(c,e,c);Yr(e,Q(.3333333432674408),Q(.3333333432674408),Q(.3333333432674408));me(c,e,c);wk(51792,a);Me(1,c);bd[J[12952]](a);$c=b+176|0}function _m(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;e=$c-16|0;$c=e;a:{if(!L[a+4>>1]){break a}pi(1047096,a,0);b:{if(!b){break b}b=J[204913];if(b){c=e+8|0;$d(c,819644,b-1|0);if(Uf(a,c)){break b}}jf(819644,a)}b=$c-432|0;$c=b;c=8;c:{d:{if(_e(a,31456)){break d}c=7;if(fg(a,31464)){break d}if(!K[1811800]){break c}if(_e(a,31464)){break d}if(!K[1811800]|!L[a+4>>1]){break c}c=1;if(K[J[a>>2]]!=47){break c}}Qe(b,a,c);c=J[b+4>>2];d=J[b>>2];J[b+424>>2]=d;J[b+428>>2]=c;e:{if(!(c&65535)){Ts();break e}d=b+416|0;kf(b+424|0,32,d,b+408|0);c=Rs(d);if(!c){break e}f=K[c+8|0];if(!(K[1811800]|!(f&1))){Od(22767,d);break e}if(f&2){bd[J[c+4>>2]](b+408|0,L[b+412>>1]!=0);break e}h=b,i=(j=Ag(b+408|0,32,b,50),k=0,l=L[b+412>>1],l?j:k),g=J[c+4>>2],bd[g](h|0,i|0)}d=1}$c=b+432|0;if(d){break a}bd[J[452940]](a)}$c=e+16|0}function iD(a,b,c){a=a|0;b=b|0;c=c|0;var d=Q(0);a=Ug(1056456,Q(0-sg(Q(O[b+72>>3]))|0));a:{b:{if((a|0)>0){while(1){c=K[1056289];H[1056289]=1;He(1050996,125,c,51152);a=a-1|0;if(a){continue}break}a=125;if(K[1056289]){break b}break a}if((a|0)>=0){break a}while(1){c=K[1056288];H[1056288]=1;He(1050996,124,c,51152);a=a+1|0;if(a){continue}break}a=124;if(!K[1056288]){break a}}H[a+1056164|0]=0;He(1051256,a,1,51152)}d=Q(0-sg(Q(O[b+80>>3]))|0);a=Ug(1056452,d);yj(1050476,d);c:{d:{if((a|0)>0){while(1){b=K[1056286];H[1056286]=1;He(1050996,122,b,51152);a=a-1|0;if(a){continue}break}a=122;if(K[1056286]){break d}break c}if((a|0)>=0){break c}while(1){b=K[1056287];H[1056287]=1;He(1050996,123,b,51152);a=a+1|0;if(a){continue}break}a=123;if(!K[1056287]){break c}}H[a+1056164|0]=0;He(1051256,a,1,51152)}Ah();return 1}function zB(a,b){a=a|0;b=b|0;var c=Q(0),d=0,e=0;a:{switch(b|0){case 0:uh(1040320,L[929696]);Dd(1040316);return;case 1:uh(1040308,L[929697]);Dd(1040304);return;default:break a}}if((b&-2)==2){Dd(1040316);Dd(1040304);return}b:{switch(b-4|0){case 11:Dd(1040316);return;case 12:Dd(1040304);return;case 8:c=Q(Q(Q(Q(mi(+Q(J[12426])))*Q(.17328999936580658))*Q(.2800000011920929))+Q(-.12999999523162842));c=c<Q(0)?Q(0):c;d=1040332,e=hg(J[464860],J[464859],c>Q(1)?Q(1):c),J[d>>2]=e;Dd(1040248);return;case 10:c=Q(Q(Q(Q(mi(+Q(J[12426])))*Q(.17328999936580658))*Q(.2800000011920929))+Q(-.12999999523162842));c=c<Q(0)?Q(0):c;d=1040332,e=hg(J[464860],J[464859],c>Q(1)?Q(1):c),J[d>>2]=e;Kl();return;case 9:Dd(1040240);return;case 0:Dd(1040248);Dd(1040240);return;case 13:Dd(1040260);break;default:break b}}}function ZJ(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0;c=$c-16|0;$c=c;if(!K[1688036]){jn()}d=se();f=c,g=Oe(J[444424],J[444425],d,ad),J[f+8>>2]=g;vf(11095,c+8|0);H[1688036]=0;if(!(!K[1777704]|H[1777705]&1)){_m(40532,0);H[1777705]=1}if(K[1777688]){qd(J[433210]);J[433210]=0;qd(J[444416]);J[444416]=0}d=vd(a);e=vd(a+2|0);a=vd(a+4|0);b=P(P(d,e),a);J[c+12>>2]=b;a:{if(K[1732864]){pd(8116);pd(8178);break a}if(!J[433210]){pd(8116);pd(1709);break a}if((b|0)!=J[422010]){pd(8116);Bg(27302,1688040,c+12|0);qd(J[433210]);J[433210]=0;qd(J[444416]);J[444416]=0;break a}b=GN(a,0,GN(e,0,d,0),ad);if(!ad&b>>>0<2147483648){break a}pd(8116);pd(12717);qd(J[433210]);J[433210]=0;qd(J[444416]);J[444416]=0}b:{if(!K[52793]){break b}b=J[444416];if(!b){break b}rr(b)}J[444416]=0;vm(J[433210],d,e,a);J[433210]=0;$c=c+16|0}function Ey(a){a=a|0;var b=0;J[a+104>>2]=0;b=rd(a,16967,313,314,0,0)<<5;J[b+1074108>>2]=315;J[b+1074104>>2]=316;b=rd(a,13130,313,314,0,0)<<5;J[b+1074108>>2]=317;J[b+1074104>>2]=318;b=rd(a,14866,309,310,0,0)<<5;J[b+1074116>>2]=4;J[b+1074112>>2]=35456;J[b+1074108>>2]=319;J[b+1074104>>2]=320;b=rd(a,11259,313,314,0,0)<<5;J[b+1074108>>2]=321;J[b+1074104>>2]=322;b=rd(a,15269,313,314,0,0)<<5;J[b+1074108>>2]=323;J[b+1074104>>2]=324;b=rd(a,18311,313,314,0,0)<<5;J[b+1074108>>2]=325;J[b+1074104>>2]=326;b=rd(a,12428,313,314,0,0)<<5;J[b+1074108>>2]=327;J[b+1074104>>2]=328;b=rd(a,12977,313,314,0,0)<<5;J[b+1074108>>2]=329;J[b+1074104>>2]=330;if(K[1054198]){b=rd(a,16634,313,314,0,0)<<5;J[b+1074108>>2]=331;J[b+1074104>>2]=332}Zf(a,4,333);J[a+92>>2]=334;b=a;a=a+1120|0;xd(b,a,400,335);md(a,1,2,0,95)}function oE(a){a=a|0;var b=Q(0),c=0,d=Q(0),e=0,f=Q(0),g=0,h=0,i=0;d=N[a+116>>2];b=Q(d*N[467293]);f=Q(b*Q(182));a:{if(Q(R(f))<Q(2147483648)){c=~~f;break a}c=-2147483648}f=N[467294];J[a+12>>2]=c;d=Q(d*f);h=a,i=Bd(Q(d*Q(22))),J[h+16>>2]=i;_f(a);c=Ig(Q(b*Q(24)));N[a+108>>2]=b*Q(13.5);N[a+104>>2]=b*Q(11.100000381469727);N[a+96>>2]=b*Q(20);J[a+88>>2]=1060503552;J[a+92>>2]=1043333120;J[a+80>>2]=0;J[a+84>>2]=0;J[a+60>>2]=1035993088;J[a+64>>2]=1051721728;J[a+52>>2]=0;J[a+56>>2]=1043333120;I[a+44>>1]=0;b=Q(c|0);N[a+100>>2]=b;I[a+72>>1]=J[a+4>>2];c=J[a+8>>2];I[a+74>>1]=c;I[a+76>>1]=J[a+12>>2];g=J[a+16>>2];I[a+78>>1]=g;I[a+50>>1]=g;if(Q(R(b))<Q(2147483648)){e=~~b}else{e=-2147483648}I[a+48>>1]=e;b=Q(d*Q(23));b:{if(Q(R(b))<Q(2147483648)){e=~~b;break b}e=-2147483648}I[a+46>>1]=g+(c-e|0)}function nM(a){a=a|0;var b=0,c=0,d=0;c=$c-32|0;$c=c;Zd(a);b=c+4|0;te(b);d=a+56|0;nf(d);ee(a+404|0,K[a+36|0]?21526:19272,b);ee(a+476|0,K[a+36|0]?21952:19646,d);b=J[10439];J[c+24>>2]=J[10438];J[c+28>>2]=b;a:{if(K[a+36|0]){break a}b=J[a+48>>2];J[c+24>>2]=J[a+44>>2];J[c+28>>2]=b;b=c+24|0;if(_e(b,37368)){Qe(c+16|0,b,8);b=J[c+20>>2];J[c+24>>2]=J[c+16>>2];J[c+28>>2]=b}b=c+24|0;if(!_e(b,37376)){break a}Qe(c+16|0,b,7);b=J[c+20>>2];J[c+24>>2]=J[c+16>>2];J[c+28>>2]=b}Ce(a+548|0,c+24|0,d);Zt(a);d=c+4|0;td(a+68|0,K[a+36|0]?13308:6094,d);td(a+152|0,K[a+36|0]?10850:8539,d);b=K[a+36|0];J[a+184>>2]=b?554:555;J[a+100>>2]=b?556:557;if(b){b=6}else{td(a+236|0,5433,d);td(a+320|0,8431,d);J[a+352>>2]=555;J[a+268>>2]=557;J[a+356>>2]=1;J[a+272>>2]=1;b=K[a+36|0]?6:8}J[a+20>>2]=b;Ed(c+4|0);$c=c+32|0}function Jt(a,b,c){var d=0,e=Q(0),f=0,g=Q(0),h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=Q(0);d=$c-128|0;$c=d;a:{b:{if(!K[1054202]){Qd(813084,44448,64);b=Q(0);break b}e=Nf(N[a+156>>2],N[a+160>>2],b);g=Md(N[a+132>>2]);h=N[a+136>>2];i=Jd(N[a+132>>2]);j=N[a+136>>2];k=Md(N[a+132>>2]);l=N[a+136>>2];m=Jd(N[a+132>>2]);n=N[a+136>>2];Zr(813084,Q(e*Q(Q(k*l)*Q(-.0026179938577115536))));f=d- -64|0;Ai(f,Q(e*Q(Q(R(Q(Q(m*n)*Q(.0026179938577115536))))*Q(3))));me(813084,813084,f);N[203287]=e*Q(Q(Q(j*Q(R(i)))*Q(.15625))*Q(.6000000238418579));N[203288]=e*Q(Q(Q(g*h)*Q(.15625))*Q(.30000001192092896));b=Q(Q(Nf(N[a+640>>2],N[a+644>>2],b)*Q(Q(Nf(N[a+440>>2],N[a+40>>2],b)+Q(.07999999821186066))*Q(-.05000000074505806)))/c);Ai(d,b);me(813084,813084,d);if(K[1054197]){break a}}N[203297]=b}$c=d+128|0}function ok(a,b,c,d,e){var f=Q(0),g=Q(0),h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=Q(0),q=Q(0),r=Q(0),s=Q(0);h=N[263579];k=N[263582];i=N[263583];f=N[263586];l=N[263587];m=N[b>>2];j=N[263578];o=N[b+4>>2];n=N[b+8>>2];g=N[a>>2];p=N[a+4>>2];J[e+12>>2]=d;g=Q(g*Q(.5));q=Q(f*g);r=Q(n-q);f=Q(p*Q(.5));l=Q(l*f);N[e+8>>2]=r-l;o=Q(f+o);p=Q(g*k);s=Q(o-p);k=Q(f*i);N[e+4>>2]=s-k;i=Q(g*j);j=Q(m-i);f=Q(f*h);N[e>>2]=j-f;h=N[c>>2];N[e+16>>2]=h;g=N[c+12>>2];N[e+40>>2]=h;J[e+36>>2]=d;N[e+32>>2]=r+l;N[e+28>>2]=s+k;N[e+24>>2]=j+f;N[e+20>>2]=g;h=N[c+4>>2];J[e+60>>2]=d;n=Q(n+q);N[e+56>>2]=n+l;j=Q(o+p);N[e+52>>2]=j+k;i=Q(m+i);N[e+48>>2]=i+f;N[e+44>>2]=h;m=N[c+8>>2];N[e+92>>2]=g;N[e+88>>2]=m;J[e+84>>2]=d;N[e+80>>2]=n-l;N[e+76>>2]=j-k;N[e+72>>2]=i-f;N[e+68>>2]=h;N[e- -64>>2]=m}function Zm(a,b){var c=0,d=0,e=0,f=Q(0),g=Q(0),h=0,i=0,j=0,k=0,l=0,m=Q(0),n=0,o=0,p=0;j=$c-48|0;$c=j;if((a|0)<(b|0)){while(1){c=P(a+b>>1,36);l=c+1801776|0;o=c+1801772|0;e=b;c=a;while(1){m=N[o>>2];while(1){f=m;i=c;d=P(c,36);g=N[d+1801772>>2];if(f==g){g=N[d+1801776>>2];f=N[l>>2]}c=i+1|0;if(f<g){continue}break}while(1){h=e;f=m;k=P(e,36);g=N[k+1801772>>2];if(f==g){g=N[k+1801776>>2];f=N[l>>2]}e=h-1|0;if(f>g){continue}break}a:{if((i|0)>(h|0)){c=i;e=h;break a}n=j+12|0;d=d+1801744|0;Qd(n,d,36);p=d;d=k+1801744|0;Qd(p,d,36);Qd(d,n,36);d=i+1810976|0;i=K[d|0];h=h+1810976|0;H[d|0]=K[h|0];H[h|0]=i}if((c|0)<=(e|0)){continue}break}b:{c:{if((e-a|0)<=(b-c|0)){if((a|0)>=(e|0)){break c}Zm(a,e);break c}if((b|0)>(c|0)){Zm(c,b)}b=e;break b}a=c}if((a|0)<(b|0)){continue}break}}$c=j+48|0}function wD(){var a=0,b=0,c=0,d=0,e=0,f=0,g=0;f=1869141,g=Id(4589,0),H[f|0]=g;Id(1647,1);Ht(7071,54228,9085);J[263510]=1153;J[263509]=1106247680;ji(1054032);f=1869140,g=Rb()|0,H[f|0]=g;a=$c-16|0;$c=a;e=+uc();b=e/1e3;a:{if(R(b)<0x8000000000000000){c=~~b>>>0;if(R(b)>=1){d=~~(b>0?T(V(b*2.3283064365386963e-10),4294967295):W((b-+(~~b>>>0>>>0))*2.3283064365386963e-10))>>>0}else{d=0}break a}d=-2147483648}J[a>>2]=c;J[a+4>>2]=d;b=(e-(+(GN(c,d,1e3,0)>>>0)+ +(ad|0)*4294967296))*1e3;b:{if(R(b)<2147483648){d=~~b;break b}d=-2147483648}J[a+8>>2]=d;$c=a+16|0;c=J[a+4>>2]+14|0;a=J[a>>2]+2006054656|0;c=a>>>0<2006054656?c+1|0:c;J[467286]=a;J[467287]=c;J[466470]=1865888;J[466468]=0;J[466469]=10;J[465686]=1862752;J[465684]=0;J[465685]=10;J[464902]=1859616;J[464900]=0;J[464901]=10}function lr(a){var b=0,c=0,d=0,e=0,f=0,g=Q(0),h=Q(0),i=0,j=0,k=0,l=0,m=0,n=0,o=Q(0),p=Q(0);b=$c-32|0;$c=b;j=Bd(N[a>>2]);k=Bd(N[a+12>>2]);d=Bd(N[a+4>>2]);l=Bd(N[a+16>>2]);m=Bd(N[a+8>>2]);n=Bd(N[a+20>>2]);h=Q(-1e5);if((d|0)<=(l|0)){while(1){if((m|0)<=(n|0)){o=Q(d|0);f=m;while(1){if((j|0)<=(k|0)){p=Q(f|0);c=j;while(1){i=c;c=Eh(c,d,f);e=P(c,12)+66896|0;g=Q(i|0);N[b+8>>2]=N[e+18432>>2]+g;N[b+12>>2]=N[e+18436>>2]+o;N[b+16>>2]=N[e+18440>>2]+p;N[b+20>>2]=N[e+27648>>2]+g;N[b+24>>2]=N[e+27652>>2]+o;N[b+28>>2]=N[e+27656>>2]+p;a:{if(K[c+75344|0]!=2){break a}if(!gg(a,b+8|0)){break a}g=N[b+24>>2];if(!(g>h)){break a}h=g}c=i+1|0;if((i|0)!=(k|0)){continue}break}}c=(f|0)!=(n|0);f=f+1|0;if(c){continue}break}}c=(d|0)!=(l|0);d=d+1|0;if(c){continue}break}}$c=b+32|0;return h}function ln(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=Q(0);e=$c-16|0;$c=e;if((a|0)<(b|0)){h=J[13195];while(1){k=N[((a+b<<3&-16)+h|0)+12>>2];c=b;d=a;while(1){i=d;while(1){d=i;i=d+1|0;f=(d<<4)+h|0;if(N[f+12>>2]<k){continue}break}j=c;while(1){c=j;j=c-1|0;g=(c<<4)+h|0;if(N[g+12>>2]>k){continue}break}if((c|0)>=(d|0)){c=J[f+12>>2];J[e+8>>2]=J[f+8>>2];J[e+12>>2]=c;c=J[f+4>>2];J[e>>2]=J[f>>2];J[e+4>>2]=c;c=J[g+12>>2];J[f+8>>2]=J[g+8>>2];J[f+12>>2]=c;c=J[g+4>>2];J[f>>2]=J[g>>2];J[f+4>>2]=c;c=J[e+12>>2];J[g+8>>2]=J[e+8>>2];J[g+12>>2]=c;c=J[e+4>>2];J[g>>2]=J[e>>2];J[g+4>>2]=c;d=i;c=j}if((c|0)>=(d|0)){continue}break}a:{b:{if((c-a|0)<=(b-d|0)){if((a|0)>=(c|0)){break b}ln(a,c);break b}if((b|0)>(d|0)){ln(d,b)}b=c;break a}a=d}if((a|0)<(b|0)){continue}break}}$c=e+16|0}function nh(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;c=$c-32800|0;$c=c;J[c+12>>2]=8192;J[c+32796>>2]=c+16;a:{if((a|0)<0){break a}J[c+16>>2]=a;g=1;while(1){a=g-1|0;h=a<<2;d=J[h+J[c+32796>>2]>>2];e=d+J[263559]|0;b:{if(K[e|0]){break b}H[e|0]=b;j=(d|0)/J[464813]|0;f=J[464807];i=(d|0)/(f|0)|0;e=(i|0)%J[464809]|0;if((J[c+12>>2]-6|0)<(g|0)){_j(c+32796|0,c+12|0,4,8192,8192)}f=d-P(f,i)|0;if((f|0)>0){J[J[c+32796>>2]+h>>2]=d-1;a=g}if((f|0)<J[464810]){J[J[c+32796>>2]+(a<<2)>>2]=d+1;a=a+1|0}if((e|0)>0){J[J[c+32796>>2]+(a<<2)>>2]=d-J[464807];a=a+1|0}if((e|0)<J[464812]){J[J[c+32796>>2]+(a<<2)>>2]=J[464807]+d;a=a+1|0}if((j|0)<=0){break b}J[J[c+32796>>2]+(a<<2)>>2]=d-J[464813];a=a+1|0}g=a;if(a){continue}break}if(J[c+12>>2]<8193){break a}qd(J[c+32796>>2])}$c=c+32800|0}function Zl(a,b,c,d,e,f){var g=0,h=0,i=0,j=0,k=0;g=$c-16|0;$c=g;J[g+8>>2]=d;J[g+12>>2]=c;J[g+4>>2]=e;J[g>>2]=f;e=0;c=J[g+12>>2];a:{if((c|0)>=J[a+12>>2]){break a}d=J[g+8>>2];if((d|0)>=J[a+16>>2]){break a}if((c|0)<0){J[g+4>>2]=J[g+4>>2]+c;J[g+12>>2]=0;d=J[g+8>>2];c=0}if((d|0)<0){J[g>>2]=J[g>>2]+d;J[g+8>>2]=0;c=J[g+12>>2]}d=J[g+4>>2]+c|0;e=J[a+12>>2];J[g+4>>2]=((d|0)<(e|0)?d:e)-c;c=J[g+8>>2];d=c+J[g>>2]|0;e=J[a+16>>2];c=((d|0)<(e|0)?d:e)-c|0;J[g>>2]=c;e=J[g+4>>2]>0&(c|0)>0}b:{if(!e){break b}c=J[g>>2];if((c|0)<=0){break b}e=J[a>>2]+(J[g+12>>2]<<2)|0;f=0;i=J[g+8>>2];h=J[g+4>>2];j=(h|0)<=0;while(1){if(!j){k=e+(P(J[a+4>>2],f+i|0)<<2)|0;d=0;while(1){J[(d<<2)+k>>2]=b;d=d+1|0;if((h|0)!=(d|0)){continue}break}}f=f+1|0;if((c|0)!=(f|0)){continue}break}}$c=g+16|0}function rC(a,b){a=a|0;b=b|0;var c=0,d=Q(0),e=0,f=0,g=0,h=Q(0);if(J[263697]){a=0}else{e=J[b+8>>2];a=P(e,796)+834384|0;if(K[a+475|0]){c=P(e,796)+834384|0;a:{if(!K[c+476|0]){if(!K[a+111|0]){pd(16398);return 0}f=J[a+356>>2];c=P(e,796)+834384|0;J[c+424>>2]=J[a+352>>2];J[c+428>>2]=f;J[c+432>>2]=J[a+360>>2];break a}g=c,h=Q(Q(Bd(N[a+4>>2])|0)+Q(.5)),N[g+424>>2]=h;N[c+428>>2]=N[a+8>>2];g=c,h=Q(Q(Bd(N[a+12>>2])|0)+Q(.5)),N[g+432>>2]=h}c=P(e,796)+834384|0;N[c+448>>2]=N[a+20>>2];if(!K[1054197]){N[c+452>>2]=N[a+16>>2]}d=N[c+424>>2];b:{if(Q(R(d))<Q(2147483648)){a=~~d;break b}a=-2147483648}d=N[c+432>>2];c:{if(Q(R(d))<Q(2147483648)){e=~~d;break c}e=-2147483648}d=N[c+428>>2];d:{if(Q(R(d))<Q(2147483648)){c=~~d;break d}c=-2147483648}ut(4,a,c,e)}a=sq(a,b)}return a|0}function jG(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;c=$c-32|0;$c=c;a:{b:{c:{switch(b|0){case 2:pd(21837);break a;default:d=sj(a);J[c+20>>2]=d;if((d|0)!=-1){break b}pd(23565);break a;case 0:case 3:break c}}d=L[(J[266937]+J[266938]<<1)+1066048>>1];J[c+20>>2]=d}d:{if(K[1054211]>=(d|0)){break d}if(qi(d&65535)){break d}Od(26946,c+20|0);break a}e:{if((b|0)>=3){b=(b|0)==4;f:{if(!De((b<<3)+a|0,c+8|0)){break f}if(!De((b?16:8)+a|0,c+12|0)){break f}if(De((b?24:16)+a|0,c+16|0)){break e}}pd(22056);break a}Ae(c+8|0,J[207101]+4|0)}g:{a=J[c+8>>2];h:{if(a>>>0>=M[464807]){break h}b=J[c+12>>2];if(b>>>0>=M[464808]){break h}e=J[c+16>>2];if(e>>>0<M[464809]){break g}}pd(22542);break a}f=a;a=d&65535;ii(f,b,e,a);b=c+24|0;tg(b,a);Cg(26858,b,c+8|0,c+12|0,c+16|0)}$c=c+32|0}function GJ(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;c=$c-32|0;$c=c;g=a+2|0;h=K[a+1|0];b=63;a:{b:{while(1){d=b;if(K[b+g|0]&223){break b}b=b-1|0;if(d){continue}break}e=0;break a}e=d+1|0}I[c+30>>1]=64;I[c+28>>1]=e;J[c+24>>2]=g;i=a+66|0;b=63;c:{d:{while(1){d=b;if(K[b+i|0]&223){break d}b=b-1|0;if(d){continue}break}f=0;break c}f=d+1|0}I[c+22>>1]=64;I[c+20>>1]=f;J[c+16>>2]=i;j=a+130|0;b=63;e:{f:{while(1){d=b;if(K[b+j|0]&223){break f}b=b-1|0;if(d){continue}break}b=0;break e}b=d+1|0}I[c+14>>1]=64;I[c+12>>1]=b;J[c+8>>2]=j;b=e&65535;if(!(!b|K[(b+g|0)-1|0]!=43)){I[c+28>>1]=e-1}d=K[a+194|0];a=f&65535;if(!(!a|K[(a+i|0)-1|0]!=43)){I[c+20>>1]=f-1}b=(h>>>3|0)+834328|0;a=K[b|0];k=b,l=HN(h&7)&a,H[k|0]=l;Sl(h,c+24|0,c+16|0,c+8|0,d);$c=c+32|0}function mF(a){a=a|0;var b=0,c=0,d=Q(0),e=Q(0),f=0,g=0,h=Q(0),i=0,j=0,k=0,l=Q(0);h=N[263696];k=1778160,l=oj(),N[k>>2]=l;bd[J[J[444511]+8>>2]](1778044);i=J[444515];if(J[a+40>>2]>0){d=Q(h*Q(60));a:{if(Q(R(d))<Q(2147483648)){b=~~d;break a}b=-2147483648}d=Q(b|0);while(1){b=P(f,84)+a|0;g=b+1192|0;c=J[b+1228>>2];md(g,2,2,K[c+5|0],K[c+6|0]);c=b+1220|0;J[c>>2]=J[c>>2]+i;j=b+1264|0;e=Q(N[467293]*d);b:{if(Q(R(e))<Q(2147483648)){c=~~e;break b}c=-2147483648}J[j>>2]=c;c=b+1268|0;e=Q(N[467294]*d);c:{if(Q(R(e))<Q(2147483648)){b=~~e;break c}b=-2147483648}J[c>>2]=b;bd[J[J[g>>2]+8>>2]](g);f=f+1|0;if((f|0)<J[a+40>>2]){continue}break}}cs(a,0);cs(a,2);md(a+1360|0,1,0,0,10);b=a+56|0;md(b,0,2,30,5);N[a+96>>2]=h;J[a+84>>2]=J[a+84>>2]+i;bd[J[J[a+56>>2]+8>>2]](b)}function js(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;c=J[207101];i=Le(9170,0,2147483647,0);j=Le(4642,0,2147483647,K[1811800]?80:81);while(1){J[J[a+16>>2]+(b<<2)>>2]=0;b=b+1|0;if((b|0)!=15){continue}break}b=0;while(1){d=1<<b;if(d&j){e=b<<4;H[e+53877|0]=!(d&i)<<1;d=P(f,84)+a|0;g=d+100|0;Tg(g,100,J[e+53880>>2]);h=J[e+53884>>2];if(h){le(g,!K[h|0])}J[d+168>>2]=-922746881;J[d+136>>2]=e+53872;J[J[a+16>>2]+(f<<2)>>2]=g;f=f+1|0}b=b+1|0;if((b|0)!=13){continue}break}J[a+36>>2]=f;f=54080;if(K[c+495|0]){c=2}else{b=K[c+494|0];f=b?54080:54112;c=b?2:1}J[a+40>>2]=c;b=0;while(1){e=P(b,84)+a|0;c=e+1192|0;J[(J[a+16>>2]+(b<<2)|0)+52>>2]=c;d=c;c=(b<<4)+f|0;Tg(d,60,J[c+8>>2]);J[e+1228>>2]=c;J[e+1260>>2]=-922746881;b=b+1|0;if((b|0)<J[a+40>>2]){continue}break}}function Xh(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0;a:{l=b;m=c;n=d;g=J[464804];e=K[g+a|0];b:{if((e&252)==8){a=1;if((e&254)==10){break b}break a}if(K[e+75344|0]){break a}f=(c|0)>=2?c-2|0:0;h=J[195004]<(c|0)?J[464811]:c+2|0;if((f|0)<=(h|0)){i=(b|0)>=2?b-2|0:0;e=(d|0)>=2?d-2|0:0;j=J[195003]<(b|0)?J[464810]:b+2|0;k=J[195005]<(d|0)?J[464812]:d+2|0;o=J[464818];p=J[464805];q=J[464807];r=J[464809];while(1){if((e|0)<=(k|0)){s=P(f,r);c=e;while(1){if((i|0)<=(j|0)){t=P(c+s|0,q);b=i;while(1){d=b+t|0;if(((K[d+p|0]<<8|K[d+g|0])&o)==19){break a}d=(b|0)>=(j|0);b=b+1|0;if(!d){continue}break}}b=(c|0)<(k|0);c=c+1|0;if(b){continue}break}}b=(f|0)<(h|0);f=f+1|0;if(b){continue}break}}bh(779984,a|671088640);a=8}re(l,m,n,a)}}function Lf(a,b,c,d,e){var f=0,g=0,h=0,i=0,j=0,k=0;g=$c-16|0;$c=g;b=Fh(g+4|0,b);if(b){Af(b,12332,c)}a:{if(!e){break a}f=J[g+12>>2];e=J[e>>2];if((f|0)<(e|0)){break a}J[g+12>>2]=(f|0)/(e|0)}b:{if(b){break b}f=0;b=$c-16|0;$c=b;h=J[263574];J[b+12>>2]=h;i=J[263575];J[b+8>>2]=i;e=g+4|0;c:{if(!J[e>>2]){Od(23917,c);break c}d:{f=J[e+4>>2];if((f|0)<=(h|0)){h=J[e+8>>2];if((h|0)<=(i|0)){break d}}Od(23959,c);Cg(21611,e+4|0,e+8|0,b+12|0,b+8|0);f=0;break c}i=J[263576];if(!(!i|(i|0)>=(P(f,h)|0))){Od(23959,c);c=J[e+8>>2];f=J[e+4>>2];N[b>>2]=Q(J[263576])*Q(9.5367431640625e-7);N[b+4>>2]=Q(P(c,f)|0)*Q(9.5367431640625e-7);Bg(21554,b+4|0,b);f=0;break c}f=op(c,e)}$c=b+16|0;if(!f){break b}if(d){j=d,k=as(e),H[j|0]=k}il(a,g+4|0,1,0)}qd(J[g+4>>2]);$c=g+16|0}function mm(a,b,c,d){var e=0,f=Q(0),g=Q(0),h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=0;k=N[206317];l=N[206320];m=N[206321];n=N[206318];o=N[206327];g=N[206324];i=N[206326];j=N[206323];f=N[206325];h=N[458160];p=J[458158];e=J[d>>2];if(K[825256]){b=sd(b,J[206315])}N[e+72>>2]=f;N[e+48>>2]=f;N[e+24>>2]=f;J[e+12>>2]=b;N[e+8>>2]=g;N[e+4>>2]=i;N[e>>2]=f;J[e+84>>2]=b;N[e+80>>2]=g;N[e+76>>2]=j;J[e+60>>2]=b;N[e+52>>2]=j;J[e+36>>2]=b;N[e+28>>2]=i;f=Q(Q(a|0)-n);N[e+88>>2]=f;g=Q(Q(Q(1)-m)*Q(.9993749856948853));N[e- -64>>2]=g;N[e+40>>2]=g;N[e+16>>2]=f;f=Q(o+Q(a-1|0));N[e+56>>2]=f;N[e+32>>2]=f;f=Q(h*Q(c&p));g=Q(Q(Q(h*k)*Q(.9993749856948853))+f);N[e+92>>2]=g;N[e+68>>2]=g;f=Q(Q(l*h)+f);N[e+44>>2]=f;N[e+20>>2]=f;J[d>>2]=e+96}function mi(a){var b=0,c=0,d=0,e=0,f=0,g=0;b=$c+-64|0;d=Infinity;a:{if(a==Infinity){break a}d=NaN;if(a<=0){break a}J[b+56>>2]=859573298;J[b+60>>2]=1075003123;J[b+48>>2]=1993319583;J[b+52>>2]=1075342436;J[b+40>>2]=-1874591239;J[b+44>>2]=-1071531602;J[b+32>>2]=451136746;J[b+36>>2]=-1073713163;J[b+16>>2]=1017550689;J[b+20>>2]=1075426844;J[b+8>>2]=1177654975;J[b+12>>2]=1074933313;J[b>>2]=-1950546417;J[b+4>>2]=1071030430;A(+a);c=v(1)|0;e=v(0)|0;f=c>>>20|0;J[b+24>>2]=0;J[b+28>>2]=1072693248;x(0,e|0);x(1,c&-2146435073|1072693248);g=+z();a=4.81147460989;c=2;while(1){e=c;a=a*g+O[(b+32|0)+(c<<3)>>3];c=c-1|0;if(e){continue}break}f=f-1023|0;d=1;c=2;while(1){e=c;d=d*g+O[(c<<3)+b>>3];c=c-1|0;if(e){continue}break}d=a/d+ +(f|0)}return d}function im(a,b,c,d){var e=0,f=Q(0),g=Q(0),h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=0;k=N[206317];l=N[206320];f=N[206324];g=N[206326];i=N[206323];m=N[206325];j=N[206322];n=N[206319];o=N[206316];h=N[458160];p=J[458158];e=J[d>>2];if(K[825256]){b=sd(b,J[206315])}N[e+48>>2]=j;N[e+24>>2]=j;J[e+12>>2]=b;N[e+8>>2]=f;N[e+4>>2]=i;J[e+84>>2]=b;N[e+80>>2]=f;N[e+76>>2]=g;J[e+60>>2]=b;N[e+56>>2]=f;N[e+52>>2]=g;J[e+36>>2]=b;N[e+32>>2]=f;N[e+28>>2]=i;f=Q(Q(Q(1)-n)*Q(.9993749856948853));N[e+88>>2]=f;g=Q(Q(a|0)-o);N[e- -64>>2]=g;N[e+40>>2]=g;N[e+16>>2]=f;f=Q(m+Q(a-1|0));N[e+72>>2]=f;N[e>>2]=f;f=Q(h*Q(c&p));g=Q(Q(l*h)+f);N[e+92>>2]=g;N[e+68>>2]=g;f=Q(Q(Q(h*k)*Q(.9993749856948853))+f);N[e+44>>2]=f;N[e+20>>2]=f;J[d>>2]=e+96}function wt(a){var b=Q(0),c=Q(0),d=0,e=Q(0),f=0;H[a+124|0]=1;d=J[a+4>>2];J[a+112>>2]=J[a>>2];J[a+116>>2]=d;J[a+120>>2]=J[a+8>>2];c=Q(1e9);e=N[a+100>>2];b=Q(R(Q(e-N[a+36>>2])));if(!(b>=Q(1e9))){H[a+125|0]=0;c=b}b=Q(R(Q(e-N[a+48>>2])));if(!(b>=c)){H[a+125|0]=1;c=b}e=N[a+104>>2];b=Q(R(Q(e-N[a+40>>2])));if(!(b>=c)){H[a+125|0]=4;c=b}b=Q(R(Q(e-N[a+52>>2])));if(!(b>=c)){H[a+125|0]=5;c=b}e=N[a+108>>2];b=Q(R(Q(e-N[a+44>>2])));if(!(b>=c)){H[a+125|0]=2;c=b}a:{b:{c:{d:{if(!(Q(R(Q(e-N[a+56>>2])))>=c)){H[a+125|0]=3;break d}d=a+112|0;f=-1;e:{switch(K[a+125|0]){case 2:d=a+120|0;break b;case 4:d=a+116|0;break b;case 5:break e;case 0:break b;case 1:break c;case 3:break d;default:break a}}d=a+116|0;break c}d=a+120|0}f=1}J[d>>2]=J[d>>2]+f}}function _D(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;f=J[a+68>>2];g=J[a+64>>2];h=J[b>>2];so(h,a+1752|0);d=J[a+40>>2];if((d|0)>0){k=(g|0)/2|0;l=((f|0)/2|0)+3|0;while(1){i=J[a+44>>2];j=(c|0)/(i|0)|0;e=j-J[a+1668>>2]|0;if(!((e|0)<0|J[a+52>>2]<=(e|0)|J[a+60>>2]==(c|0))){Rk(L[((c<<1)+a|0)+92>>1],N[a+72>>2],Q((J[a+4>>2]+k|0)+P(J[a+64>>2],c-P(i,j)|0)|0),Q((J[a+8>>2]+l|0)+P(J[a+68>>2],e)|0));d=J[a+40>>2]}c=c+1|0;if((d|0)>(c|0)){continue}break}}c=J[a+60>>2];if((c|0)!=-1){e=J[a+44>>2];d=(c|0)/(e|0)|0;Rk(L[((c<<1)+a|0)+92>>1],N[a+76>>2],Q((J[a+4>>2]+((g|0)/2|0)|0)+P(J[a+64>>2],c-P(d,e)|0)|0),Q(((J[a+8>>2]+((f|0)/2|0)|0)+P(J[a+68>>2],d-J[a+1668>>2]|0)|0)+3|0))}m=a,n=ro(),J[m+2712>>2]=n;J[b>>2]=h+23040}function Ph(a,b,c){var d=0,e=0,f=0,g=0;yf(a);e=K[1092885]&3;f=e?144:24;g=f+144|0;af(g);yd(Q(N[a+16>>2]*Q(-.01745329238474369)),Q(0),Q(0),b,1);If(b+16|0);d=(e<<7)+b|0;yd(N[a+164>>2],Q(0),N[a+168>>2],d- -64|0,0);yd(N[a+172>>2],Q(0),N[a+176>>2],d+80|0,0);H[1092884]=1;yd(N[a+180>>2],Q(0),N[a+184>>2],d+96|0,0);yd(N[a+188>>2],Q(0),N[a+192>>2],d+112|0,0);H[1092884]=0;if(e){If(b+48|0);yd(N[a+164>>2],Q(0),N[a+168>>2],d+128|0,0);yd(N[a+172>>2],Q(0),N[a+176>>2],d+144|0,0);H[1092884]=1;yd(N[a+180>>2],Q(0),N[a+184>>2],d+160|0,0);yd(N[a+188>>2],Q(0),N[a+192>>2],d+176|0,0);H[1092884]=0}yd(Q(N[a+16>>2]*Q(-.01745329238474369)),Q(0),Q(0),b+32|0,1);Pd(J[273228]);J[273224]=J[273229];if(c){be(0);he(144,0);be(1);he(f,144);return}ae(g)}function PC(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0;d=$c-32|0;$c=d;e=J[a+28>>2];J[d+16>>2]=e;f=J[a+20>>2];J[d+28>>2]=c;J[d+24>>2]=b;b=f-e|0;J[d+20>>2]=b;f=b+c|0;i=2;a:{b:{b=d+16|0;c:{d:{if(Gj(Ra(J[a+60>>2],b|0,2,d+12|0)|0)){e=b;break d}while(1){g=J[d+12>>2];if((g|0)==(f|0)){break c}if((g|0)<0){e=b;break b}h=J[b+4>>2];j=h>>>0<g>>>0;e=(j<<3)+b|0;h=g-(j?h:0)|0;J[e>>2]=h+J[e>>2];b=(j?12:4)+b|0;J[b>>2]=J[b>>2]-h;f=f-g|0;b=e;i=i-j|0;if(!Gj(Ra(J[a+60>>2],b|0,i|0,d+12|0)|0)){continue}break}}if((f|0)!=-1){break b}}b=J[a+44>>2];J[a+28>>2]=b;J[a+20>>2]=b;J[a+16>>2]=b+J[a+48>>2];a=c;break a}J[a+28>>2]=0;J[a+16>>2]=0;J[a+20>>2]=0;J[a>>2]=J[a>>2]|32;a=0;if((i|0)==2){break a}a=c-J[e+4>>2]|0}$c=d+32|0;return a|0}function Ie(a,b,c){var d=0,e=0;a:{if((a|0)==(b|0)){break a}e=a+c|0;if(b-e>>>0<=0-(c<<1)>>>0){Qd(a,b,c);return}d=(a^b)&3;b:{c:{if(a>>>0<b>>>0){if(d){break b}if(!(a&3)){break c}while(1){if(!c){break a}H[a|0]=K[b|0];b=b+1|0;c=c-1|0;a=a+1|0;if(a&3){continue}break}break c}d:{if(d){break d}if(e&3){while(1){if(!c){break a}c=c-1|0;d=c+a|0;H[d|0]=K[b+c|0];if(d&3){continue}break}}if(c>>>0<=3){break d}while(1){c=c-4|0;J[c+a>>2]=J[b+c>>2];if(c>>>0>3){continue}break}}if(!c){break a}while(1){c=c-1|0;H[c+a|0]=K[b+c|0];if(c){continue}break}break a}if(c>>>0<=3){break b}while(1){J[a>>2]=J[b>>2];b=b+4|0;a=a+4|0;c=c-4|0;if(c>>>0>3){continue}break}}if(!c){break a}while(1){H[a|0]=K[b|0];a=a+1|0;b=b+1|0;c=c-1|0;if(c){continue}break}}}function re(a,b,c,d){var e=0,f=0,g=0,h=0,i=0;f=P(J[464807],P(J[464809],b)+c|0)+a|0;g=K[f+J[464804]|0];h=K[f+J[464805]|0];i=J[464818];H[f+J[464804]|0]=d;e=J[464805];a:{if((e|0)==J[464804]){if(d>>>0<256){break a}e=Lj(J[464806],1);b:{if(!e){Qf(1468,23208);vi();break b}J[464818]=1023;J[464805]=e;H[f+e|0]=d>>>8}break a}H[f+e|0]=d>>>8}f=(h<<8|g)&i;if(J[260066]){c:{e=K[d+80720|0]-6|0;if((K[f+80720|0]&254)==4^(e&255)>>>0<254){break c}g=P(J[464809],a)+c|0;h=J[260066]+(g<<1)|0;if(I[h>>1]>(b|0)){break c}if((e&255)>>>0<=253){I[h>>1]=b;break c}Xp(a,b,c,g)}}bd[J[266955]](a,b,c,f,d);b=(J[266966]+P(P(J[464824],P(J[464825],c>>4)+(b>>4)|0),20)|0)+P(a>>4,20)|0;c=K[b+6|0];a=K[d+80720|0]==4?c&8:0;d=b;b=a|c&247;H[d+6|0]=a?b:b&249|4}function Fl(a){var b=0,c=Q(0),d=Q(0),e=Q(0),f=Q(0),g=Q(0),h=Q(0);b=P(a,12)+66896|0;c=N[b+27656>>2];d=N[b+27652>>2];e=N[b+27648>>2];f=N[b+18440>>2];g=N[b+18436>>2];h=N[b+18432>>2];b=a+66896|0;a:{if(K[b|0]){d=Q(d+Q(-.09375));g=Q(g+Q(-.09375));c=Q(c+Q(.0062500000931322575));f=Q(f+Q(.0062500000931322575));e=Q(e+Q(.0062500000931322575));h=Q(h+Q(.0062500000931322575));break a}if(K[a+75344|0]==2|K[b+13824|0]!=3){break a}d=Q(d+Q(-.0062500000931322575));g=Q(g+Q(-.0062500000931322575));c=Q(c+Q(.0062500000931322575));f=Q(f+Q(.0062500000931322575));e=Q(e+Q(.0062500000931322575));h=Q(h+Q(.0062500000931322575))}a=P(a,12)+66896|0;N[a+36872>>2]=f;N[a+36868>>2]=g;N[a+36864>>2]=h;N[a+46080>>2]=e;N[a+46084>>2]=d;N[a+46088>>2]=c}function or(a,b,c,d){var e=0,f=Q(0),g=Q(0),h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=0;l=N[206317];m=N[206320];n=N[206321];g=N[206318];o=N[206327];i=N[206324];j=N[206326];k=N[206323];f=N[206322];h=N[458160];p=J[458158];e=J[d>>2];if(K[825256]){b=sd(b,J[206315])}N[e+72>>2]=f;N[e+48>>2]=f;N[e+24>>2]=f;J[e+12>>2]=b;N[e+4>>2]=j;N[e>>2]=f;J[e+84>>2]=b;N[e+76>>2]=k;N[e- -64>>2]=g;J[e+60>>2]=b;N[e+56>>2]=i;N[e+52>>2]=k;N[e+40>>2]=g;J[e+36>>2]=b;N[e+32>>2]=i;N[e+28>>2]=j;f=Q(a-1|0);g=Q(Q(n*Q(.9993749856948853))+f);N[e+88>>2]=g;f=Q(o+f);N[e+80>>2]=f;N[e+16>>2]=g;N[e+8>>2]=f;f=Q(h*Q(c&p));g=Q(Q(Q(h*l)*Q(.9993749856948853))+f);N[e+92>>2]=g;N[e+68>>2]=g;f=Q(Q(m*h)+f);N[e+44>>2]=f;N[e+20>>2]=f;J[d>>2]=e+96}function hr(a,b,c,d){var e=0,f=Q(0),g=Q(0),h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=0;l=N[206317];m=N[206320];f=N[206327];g=N[206326];i=N[206323];n=N[206325];j=N[206322];o=N[206319];k=N[206316];h=N[458160];p=J[458158];e=J[d>>2];if(K[825256]){b=sd(b,J[206315])}N[e+48>>2]=j;N[e+24>>2]=j;J[e+12>>2]=b;N[e+8>>2]=f;N[e+4>>2]=g;J[e+84>>2]=b;N[e+80>>2]=f;N[e+76>>2]=i;N[e- -64>>2]=k;J[e+60>>2]=b;N[e+56>>2]=f;N[e+52>>2]=i;N[e+40>>2]=k;J[e+36>>2]=b;N[e+32>>2]=f;N[e+28>>2]=g;f=Q(a-1|0);g=Q(Q(o*Q(.9993749856948853))+f);N[e+88>>2]=g;f=Q(n+f);N[e+72>>2]=f;N[e+16>>2]=g;N[e>>2]=f;f=Q(h*Q(c&p));g=Q(Q(Q(h*l)*Q(.9993749856948853))+f);N[e+92>>2]=g;N[e+68>>2]=g;f=Q(Q(m*h)+f);N[e+44>>2]=f;N[e+20>>2]=f;J[d>>2]=e+96}function fr(a,b,c,d){var e=0,f=Q(0),g=Q(0),h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=0;l=N[206321];m=N[206318];g=N[206327];i=N[206324];f=N[206323];n=N[206325];j=N[206322];o=N[206319];k=N[206316];h=N[458160];p=J[458158];e=J[d>>2];if(K[825256]){b=sd(b,J[206315])}N[e+48>>2]=j;N[e+24>>2]=j;J[e+12>>2]=b;N[e+8>>2]=g;N[e+4>>2]=f;J[e+84>>2]=b;N[e+80>>2]=i;N[e+76>>2]=f;N[e- -64>>2]=k;J[e+60>>2]=b;N[e+56>>2]=i;N[e+52>>2]=f;N[e+40>>2]=k;J[e+36>>2]=b;N[e+32>>2]=g;N[e+28>>2]=f;f=Q(a-1|0);g=Q(Q(o*Q(.9993749856948853))+f);N[e+88>>2]=g;f=Q(n+f);N[e+72>>2]=f;N[e+16>>2]=g;N[e>>2]=f;f=Q(h*Q(c&p));g=Q(Q(m*h)+f);N[e+92>>2]=g;N[e+68>>2]=g;f=Q(Q(Q(h*l)*Q(.9993749856948853))+f);N[e+44>>2]=f;N[e+20>>2]=f;J[d>>2]=e+96}function em(a,b,c,d){var e=0,f=Q(0),g=Q(0),h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=0;l=N[206321];m=N[206318];g=N[206327];i=N[206324];f=N[206326];n=N[206325];j=N[206322];o=N[206319];k=N[206316];h=N[458160];p=J[458158];e=J[d>>2];if(K[825256]){b=sd(b,J[206315])}N[e+48>>2]=j;N[e+24>>2]=j;J[e+12>>2]=b;N[e+8>>2]=i;N[e+4>>2]=f;J[e+84>>2]=b;N[e+80>>2]=g;N[e+76>>2]=f;N[e- -64>>2]=k;J[e+60>>2]=b;N[e+56>>2]=g;N[e+52>>2]=f;N[e+40>>2]=k;J[e+36>>2]=b;N[e+32>>2]=i;N[e+28>>2]=f;f=Q(a-1|0);g=Q(Q(o*Q(.9993749856948853))+f);N[e+88>>2]=g;f=Q(n+f);N[e+72>>2]=f;N[e+16>>2]=g;N[e>>2]=f;f=Q(h*Q(c&p));g=Q(Q(Q(h*l)*Q(.9993749856948853))+f);N[e+92>>2]=g;N[e+68>>2]=g;f=Q(Q(m*h)+f);N[e+44>>2]=f;N[e+20>>2]=f;J[d>>2]=e+96}function Jl(a,b,c,d,e,f,g,h,i){var j=0,k=0,l=Q(0),m=Q(0),n=Q(0),o=0,p=Q(0),q=0;j=J[i>>2];if((a|0)<(c|0)){o=K[1054441]&4?8:K[1040328]?128:2048;e=Q(e+h);while(1){k=a;a=k+o|0;if((b|0)<(d|0)){n=Q(k|0);h=Q(n+g);l=Q(((a|0)<(c|0)?a:c)|0);p=Q(l+g);n=Q(l-n);k=b;while(1){N[j+72>>2]=p;N[j+48>>2]=p;N[j+24>>2]=h;J[j+16>>2]=0;J[j+20>>2]=0;J[j+12>>2]=f;N[j+4>>2]=e;N[j>>2]=h;J[j+92>>2]=0;N[j+88>>2]=n;J[j+84>>2]=f;N[j+76>>2]=e;N[j- -64>>2]=n;J[j+60>>2]=f;N[j+52>>2]=e;J[j+40>>2]=0;J[j+36>>2]=f;N[j+28>>2]=e;l=Q(k|0);m=Q(l+g);N[j+80>>2]=m;N[j+8>>2]=m;k=k+o|0;q=(k|0)<(d|0);m=Q((q?k:d)|0);l=Q(m-l);N[j+68>>2]=l;m=Q(m+g);N[j+56>>2]=m;N[j+44>>2]=l;N[j+32>>2]=m;j=j+96|0;if(q){continue}break}}if((a|0)<(c|0)){continue}break}}J[i>>2]=j}function Lo(a,b,c,d){var e=0,f=0,g=0,h=0,i=Q(0);e=$c-48|0;$c=e;Cd(a);f=e+32|0;Ef(f,d,c,1);f=Ne(f);J[a+28>>2]=f;if(L[b+4>>1]){c=0;while(1){Ke(e+8|0,b,c,1);g=J[e+12>>2];J[e+32>>2]=J[e+8>>2];J[e+36>>2]=g;g=Ne(e+32|0);h=(c<<1)+a|0;I[h+72>>1]=f;I[h+40>>1]=g;f=(f+g|0)+1|0;c=c+1|0;if(c>>>0<L[b+4>>1]){continue}break}}g=e+8|0;c=f;f=e+32|0;vg(g,c,Ng(f));c=J[d+4>>2];J[e+32>>2]=J[d>>2];J[e+36>>2]=c;c=0;pf(g,f,0,0);if(L[b+4>>1]){while(1){Ke(e,b,c,1);d=J[e+4>>2];J[e+32>>2]=J[e>>2];J[e+36>>2]=d;pf(e+8|0,e+32|0,I[((c<<1)+a|0)+72>>1],0);c=c+1|0;if(c>>>0<L[b+4>>1]){continue}break}}b=e+8|0;Mg(a,b);ug(b);b=J[e+12>>2];if(K[1054440]==1){b=rg(b)}i=Q(Q(1)/Q(b|0));N[a+36>>2]=i;b=J[a+28>>2];I[a+8>>1]=b;N[a+20>>2]=i*Q(b|0);$c=e+48|0}function TI(a,b){a=a|0;b=Q(b);var c=0,d=0,e=Q(0),f=0,g=0;d=$c-16|0;$c=d;J[a+300>>2]=J[a+300>>2]+1;e=Q(N[a+296>>2]+b);N[a+296>>2]=e;if(!(e<Q(1))){et(a);J[a+296>>2]=0;J[a+300>>2]=0;J[263482]=0}if(K[1054793]){g=a+332|0;while(1){c=(f<<2)+g|0;a:{if(J[c+264>>2]<0){break a}e=Q(N[c+296>>2]+b);N[c+296>>2]=e;if(e<=Q(1)){break a}J[c+264>>2]=-1;J[c+296>>2]=0;I[(J[266938]+f<<1)+1066048>>1]=0}f=f+1|0;if((f|0)!=8){continue}break}}b:{if(K[1054197]){break b}c:{if(!bn()|!K[1054742]){break c}c=J[207101];if(!(hq(c+460|0,K[c+473|0])!=N[a+312>>2]|J[203294]!=J[a+316>>2]|K[a+308|0])){break c}dt(a)}Ae(d+4|0,J[207101]+4|0);if(!(J[d+4>>2]!=J[a+320>>2]|J[d+8>>2]!=J[a+324>>2])&J[d+12>>2]==J[a+328>>2]){break b}H[a+7|0]=1}$c=d+16|0}function xr(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0;b=$c-112|0;$c=b;e=I[a+116>>1];f=I[a+118>>1];Og(b+16|0,J[a+40>>2],1);g=J[a+108>>2];J[b+108>>2]=4194304;J[b+104>>2]=b+32;a:{if((bd[J[a+44>>2]]()|0)>0){h=d-f|0;i=c-e|0;f=0;e=0;while(1){I[b+108>>1]=0;yi(a,e,b+104|0);if(L[b+108>>1]){j=P(e,g);d=0;while(1){Ke(b+8|0,b+104|0,0,d);c=J[b+12>>2];J[b+16>>2]=J[b+8>>2];J[b+20>>2]=c;c=Ne(b+16|0);c=e?c:J[a+140>>2]+c|0;Ke(b+8|0,b+104|0,d,1);k=J[b+12>>2];J[b+16>>2]=J[b+8>>2];J[b+20>>2]=k;if($f(c,j,Ne(b+16|0),g,i,h)){J[a+160>>2]=d+f;break a}d=d+1|0;c=L[b+108>>1];if(d>>>0<c>>>0){continue}break}f=c+f|0}e=e+1|0;if((bd[J[a+44>>2]]()|0)>(e|0)){continue}break}}J[a+160>>2]=-1}Rg(a);$c=b+112|0;return 1}function np(a,b,c,d,e){var f=0,g=Q(0),h=Q(0),i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0;g=Q(a|0);h=Q(g-d);l=Bd(h>Q(0)?h:Q(0));g=Q(g+d);h=Q(J[464810]);m=Bd(g<h?g:h);g=Q(b|0);h=Q(g-d);i=Bd(h>Q(0)?h:Q(0));g=Q(g+d);h=Q(J[464811]);n=Bd(g<h?g:h);g=Q(c|0);h=Q(g-d);o=Bd(h>Q(0)?h:Q(0));g=Q(g+d);h=Q(J[464812]);p=Bd(g<h?g:h);if((i|0)<=(n|0)){d=Q(d*d);while(1){if((o|0)<=(p|0)){f=i-b|0;q=P(f,f)<<1;j=o;while(1){if((l|0)<=(m|0)){f=j-c|0;r=P(f,f)+q|0;f=l;while(1){k=f;f=f-a|0;a:{if(!(d>Q(P(f,f)+r|0))){break a}f=(J[263559]+P(J[464807],P(J[464809],i)+j|0)|0)+k|0;if(K[f|0]!=1){break a}H[f|0]=e}f=k+1|0;if((k|0)!=(m|0)){continue}break}}f=(j|0)!=(p|0);j=j+1|0;if(f){continue}break}}f=(i|0)!=(n|0);i=i+1|0;if(f){continue}break}}}function Gd(a,b,c){var d=0,e=0,f=0,g=0;a:{if(!c){break a}H[a|0]=b;d=a+c|0;H[d-1|0]=b;if(c>>>0<3){break a}H[a+2|0]=b;H[a+1|0]=b;H[d-3|0]=b;H[d-2|0]=b;if(c>>>0<7){break a}H[a+3|0]=b;H[d-4|0]=b;if(c>>>0<9){break a}d=0-a&3;e=d+a|0;b=P(b&255,16843009);J[e>>2]=b;d=c-d&-4;c=d+e|0;J[c-4>>2]=b;if(d>>>0<9){break a}J[e+8>>2]=b;J[e+4>>2]=b;J[c-8>>2]=b;J[c-12>>2]=b;if(d>>>0<25){break a}J[e+24>>2]=b;J[e+20>>2]=b;J[e+16>>2]=b;J[e+12>>2]=b;J[c-16>>2]=b;J[c-20>>2]=b;J[c-24>>2]=b;J[c-28>>2]=b;g=e&4|24;c=d-g|0;if(c>>>0<32){break a}d=GN(b,0,1,1);f=ad;b=e+g|0;while(1){J[b+24>>2]=d;J[b+28>>2]=f;J[b+16>>2]=d;J[b+20>>2]=f;J[b+8>>2]=d;J[b+12>>2]=f;J[b>>2]=d;J[b+4>>2]=f;b=b+32|0;c=c-32|0;if(c>>>0>31){continue}break}}return a}function Am(a,b){var c=0,d=0,e=0,f=0,g=0,h=0;a:{c=J[a+8>>2];b:{c:{if(c>>>0>16){d=c;break c}e=J[a+16>>2];while(1){if(e){e=e-1|0;J[a+16>>2]=e;d=J[a+12>>2];J[a+12>>2]=d+1;f=K[d|0];d=c+8|0;J[a+8>>2]=d;J[a+4>>2]=J[a+4>>2]|f<<c;f=c>>>0<9;c=d;if(f){continue}break c}break}d=c;if(c>>>0<9){break b}}f=J[a+4>>2];c=I[((f&511)<<1)+b>>1];if((c|0)>=0){break a}c=d}e=0;d=1;d:{while(1){if((c|0)==(e|0)){break d}h=J[a+4>>2];g=h>>>e&1|g<<1;f=(d<<1)+b|0;if(g>>>0<L[f+1056>>1]){e=L[f+1024>>1];f=L[f+1088>>1];J[a+8>>2]=c-d;J[a+4>>2]=h>>>d;return L[(((f+g|0)-e<<1)+b|0)+1120>>1]}d=d+1|0;e=e+1|0;if((e|0)!=15){continue}break}H[a|0]=13;J[a+44736>>2]=-857812902}return-1}c=c&65535;b=c>>>9|0;J[a+8>>2]=d-b;J[a+4>>2]=f>>>b;return c&511}function $z(){var a=0,b=0,c=0,d=0,e=0;b=$c-32|0;$c=b;Rl(51376);Rl(51384);J[266428]=243;J[266426]=244;J[266436]=245;J[266434]=246;J[266417]=247;J[266435]=248;J[266488]=249;J[266486]=250;J[266487]=251;if(!K[1054197]){J[266439]=252;J[266430]=253;J[266437]=254;J[266431]=255;J[266442]=256;J[266441]=257;J[266440]=258;J[266429]=259}nd(1051776,0,260);nd(1052036,0,261);nd(1049956,0,262);nd(1050996,0,263);nd(1051256,0,264);nd(1043976,0,265);if(J[390916]>0){while(1){a=b+24|0;bk(1563656,c,a);e=a;a=b+16|0;d=b+8|0;kf(e,61,a,d);if(_e(a,35360)){Bo(a,d)}c=c+1|0;if((c|0)<J[390916]){continue}break}}J[266411]=266;J[266410]=267;J[266409]=268;J[266408]=269;J[266463]=270;J[266462]=271;J[266461]=272;J[266460]=273;$c=b+32|0}function pJ(a){a=a|0;var b=Q(0),c=0,d=0,e=0,f=Q(0);d=$c-32|0;$c=d;c=K[a|0];e=K[a+1|0];a=ud(a+2|0);c=J[(c<<2)+827376>>2];a:{if(!c){break a}b:{c:{switch(e|0){case 1:H[d+28|0]=132;N[d+16>>2]=a|0;break b;case 2:H[d+28|0]=144;N[d+24>>2]=a|0;break b;case 3:case 4:case 5:b=Q(Q(a|0)/Q(1e3));if(H[c+54|0]&1){f=N[J[c+48>>2]+56>>2];b=b<Q(.009999999776482582)?Q(.009999999776482582):b;b=b>f?f:b}d:{e:{f:{switch(e-3|0){case 0:a=c+80|0;break e;case 1:a=c+84|0;break e;case 2:break f;default:break d}}a=c+88|0}N[a>>2]=b}Yl(c);break a;case 6:b=Q(Q(a|0)/Q(1e3));b=b<Q(-1024)?Q(-1024):b;N[c+420>>2]=b>Q(1024)?Q(1024):b;break a;case 0:break c;default:break a}}H[d+28|0]=136;N[d+20>>2]=a|0}bd[J[J[c>>2]+8>>2]](c,d)}$c=d+32|0}function Zj(a,b,c,d){var e=0,f=0,g=0,h=0;e=$c-3840|0;$c=e;f=e+2792|0;Wd(f,b);g=J[a+5148>>2];h=e+8|0;Je(h,f);a:{f=Mi(e+664|0,h);if((f|0)==J[11486]){break a}if(f){Te(f,12214,h);break a}h=g?g:511;Ds(e+608|0,e+664|0,e+720|0);while(1){J[e+3836>>2]=67108864;J[e+3832>>2]=e+2800;f=ek(e+608|0,e+3832|0);if(f){if((f|0)!=-857812991){Te(f,9389,e+8|0)}bd[J[e+692>>2]](e+664|0)|0;break a}g=e+3832|0;As(g);Li(g);f=L[e+3836>>1];if(!f){continue}if(d){if(!(bd[d|0](g)|0)){continue}f=L[e+3836>>1]}f=f&65535;if((f|0)>(h|0)){J[e+2772>>2]=f;I[e+3836>>1]=0;f=e+3832|0;xe(f,15857,e+2772|0,b);bd[J[12861]](f);continue}if(c){f=e+2784|0;g=e+2776|0;kf(e+3832|0,c,f,g);Ci(a,f,g,c)}else{jf(a,e+3832|0)}continue}}$c=e+3840|0;return f}function dh(a,b,c,d){var e=0,f=0,g=0;a:{if((a|0)<=0){break a}e=d-1|0;f=K[e+J[464804]|0];g=J[(f<<2)+775864>>2];if(!g){break a}bd[g|0](e,f)}b:{if(J[464810]<=(a|0)){break b}a=d+1|0;e=K[a+J[464804]|0];f=J[(e<<2)+775864>>2];if(!f){break b}bd[f|0](a,e)}c:{if((c|0)<=0){break c}a=d-J[464807]|0;e=K[a+J[464804]|0];f=J[(e<<2)+775864>>2];if(!f){break c}bd[f|0](a,e)}d:{if(J[464812]<=(c|0)){break d}a=J[464807]+d|0;c=K[a+J[464804]|0];e=J[(c<<2)+775864>>2];if(!e){break d}bd[e|0](a,c)}e:{if((b|0)<=0){break e}a=d-J[464813]|0;c=K[a+J[464804]|0];e=J[(c<<2)+775864>>2];if(!e){break e}bd[e|0](a,c)}f:{if(J[464811]<=(b|0)){break f}a=J[464813]+d|0;b=K[a+J[464804]|0];c=J[(b<<2)+775864>>2];if(!c){break f}bd[c|0](a,b)}}function os(a){var b=0,c=0,d=0,e=0,f=0,g=0;b=$c-1760|0;$c=b;if(L[a+4>>1]){c=J[10439];d=J[10438];J[b+8>>2]=d;J[b+12>>2]=c;J[b>>2]=d;J[b+4>>2]=c;J[b+1756>>2]=17039360;J[b+1484>>2]=17039360;J[b+1752>>2]=b+1488;J[b+1480>>2]=b+1216;c=b+1752|0;d=b+1480|0;Om(c,d,a);e=b+616|0;Je(e,c);c=b+16|0;Je(c,d);a:{if(!(ka(e|0)|0)){if(!L[b+1484>>1]){break a}if(!(ka(c|0)|0)){break a}}ns(b+616|0,a,1850584);d=L[b+620>>1];b:{if(d){c=0;e=J[b+616>>2];while(1){if((K[c+e|0]-58&255)>>>0<246){break b}c=c+1|0;if((d|0)!=(c|0)){continue}break}}I[b+620>>1]=0}c=J[b+620>>2];J[b>>2]=J[b+616>>2];J[b+4>>2]=c;ns(b+8|0,a,1845432)}kr(J[461354]);f=1845416,g=Nj(a,1,0,b,b+8|0),J[f>>2]=g}if(!Uf(a,53296)){ke(53296,a);Vg(0)}$c=b+1760|0}function uv(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;e=$c-32|0;$c=e;c=e+24|0;Yi(c,a,b);a=c;f=e+16|0;c=e+8|0;kf(a,43,f,c);b=0;a=rf(c,9561);h=rf(c,3620);c=rf(c,3007);j=Ei(f,0,50464,172);a:{b:{f=J[265102];if((f|0)<=0){break b}a=(a^-1)>>>31|0;a=(h|0)<0?a:a|2;h=(c|0)<0?a:a|4;while(1){c:{g=(b<<3)+1058352|0;c=K[g+4|0];if((c|0)==(j|0)){a=K[g+5|0];if((h|0)==(a|0)){break c}}b=b+1|0;if((f|0)!=(b|0)){continue}break b}break}k=a<<8;d=L[g+6>>1]<<16;l=J[g>>2];b=0;a=c;break a}b=0;a=0}H[1083754]=1;H[1083752]=1;J[270937]=35744;d=d+k|0;c=i+i|0;d=a+(c>>>0<i>>>0?d+1|0:d)|0;a=b+c|0;d=a>>>0<b>>>0?d+1|0:d;a=a|l;J[270948]=a;J[270949]=d;J[270946]=a;J[270947]=d;Ad(1083748,50);$c=e+32|0}function jI(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;d=1;d=!K[1054741]|K[1056374]!=95?d:!K[a+4|0];a:{if(!(!Ue(11,b,c)|!d)){if(K[1801724]|K[1811800]){break a}J[444594]=40816;H[1778429]=0;Ad(1778376,17);return 1}H[a+40|0]=0;if(K[a+4|0]){b:{if(!(!Ue(10,b,c)&(b|0)!=116)){jk(a,0);break b}if(J[c+52>>2]==(b|0)){ik(a,0-J[263684]|0);break b}if(J[c+56>>2]==(b|0)){ik(a,J[263684]);break b}c:{switch(b-122|0){case 0:ik(a,-1);break b;case 1:ik(a,1);break b;default:break c}}bd[J[J[a+72>>2]+12>>2]](a+72|0,b,c)|0}return b-25>>>0<4294967272|0}if(Ue(7,b,c)){Oi(41752);return 1}if((b|0)==30){Oi(41340);return 1}if(!Ue(8,b,c)){return 0}H[1797902]=1;H[1797900]=1;J[449474]=41020;Ad(1797896,20);xf(1,1)}return 1}function cf(a,b){var c=0,d=Q(0),e=0,f=0;H[a+1065556|0]=b;if(K[1811803]){c=J[12836];if((c|0)==-1){c=wq(J[207101]);c=(c|0)==-1?255:c;J[12836]=c}f=c&255;c=$c-16|0;$c=c;e=J[207101];H[c+3|0]=!b;H[c+2|0]=a;H[c+1|0]=34;a=c+4|0;d=Q(Q(N[e+20>>2]*Q(65536))/Q(360));a:{if(Q(R(d))<Q(2147483648)){b=~~d;break a}b=-2147483648}fe(a,b&65535);a=c+6|0;d=Q(Q(N[e+16>>2]*Q(65536))/Q(360));b:{if(Q(R(d))<Q(2147483648)){b=~~d;break b}b=-2147483648}fe(a,b&65535);H[c+8|0]=f;fe(c+9|0,L[527028]);fe(c+11|0,L[527030]);fe(c+13|0,L[527032]);H[c+15|0]=255;a=K[1054181];if(a>>>0<=5){b=a<<3;a=b&31;if((b&63)>>>0>=32){a=515>>>a|0}else{a=((1<<a)-1&515)<<32-a|67436545>>>a}H[c+15|0]=a}bd[J[452942]](c+1|0,15);$c=c+16|0}}function Up(a,b,c,d,e,f){var g=0,h=Q(0),i=Q(0),j=0,k=Q(0),l=Q(0),m=Q(0),n=0,o=Q(0),p=0;g=J[f>>2];if((b|0)>0){n=K[1054441]&4?8:K[1040328]?128:2048;i=Q(a|0);while(1){a=j;j=a+n|0;if((c|0)<(d|0)){k=Q(((b|0)>(j|0)?j:b)|0);l=Q(a|0);o=Q(k-l);a=c;while(1){N[g+72>>2]=k;N[g+48>>2]=k;N[g+24>>2]=l;J[g+16>>2]=0;J[g+12>>2]=e;N[g+8>>2]=i;N[g>>2]=l;N[g+88>>2]=o;J[g+84>>2]=e;N[g+80>>2]=i;h=Q(a|0);N[g+76>>2]=h;J[g+68>>2]=0;N[g- -64>>2]=o;J[g+60>>2]=e;N[g+56>>2]=i;J[g+40>>2]=0;J[g+44>>2]=0;J[g+36>>2]=e;N[g+32>>2]=i;N[g+4>>2]=h;a=a+n|0;p=(d|0)>(a|0);m=Q((p?a:d)|0);N[g+52>>2]=m;N[g+28>>2]=m;h=Q(m-h);N[g+92>>2]=h;N[g+20>>2]=h;g=g+96|0;if(p){continue}break}}if((b|0)>(j|0)){continue}break}}J[f>>2]=g}function Tp(a,b,c,d,e,f){var g=0,h=Q(0),i=Q(0),j=0,k=Q(0),l=Q(0),m=Q(0),n=0,o=Q(0),p=0;g=J[f>>2];if((b|0)>0){n=K[1054441]&4?8:K[1040328]?128:2048;i=Q(a|0);while(1){a=j;j=a+n|0;if((c|0)<(d|0)){k=Q(((b|0)>(j|0)?j:b)|0);l=Q(a|0);o=Q(k-l);a=c;while(1){N[g+72>>2]=i;N[g+48>>2]=i;N[g+24>>2]=i;J[g+16>>2]=0;J[g+12>>2]=e;N[g+8>>2]=l;N[g>>2]=i;N[g+88>>2]=o;J[g+84>>2]=e;N[g+80>>2]=k;h=Q(a|0);N[g+76>>2]=h;J[g+68>>2]=0;N[g- -64>>2]=o;J[g+60>>2]=e;N[g+56>>2]=k;J[g+40>>2]=0;J[g+44>>2]=0;J[g+36>>2]=e;N[g+32>>2]=l;N[g+4>>2]=h;a=a+n|0;p=(d|0)>(a|0);m=Q((p?a:d)|0);N[g+52>>2]=m;N[g+28>>2]=m;h=Q(m-h);N[g+92>>2]=h;N[g+20>>2]=h;g=g+96|0;if(p){continue}break}}if((b|0)>(j|0)){continue}break}}J[f>>2]=g}function hE(a,b){a=a|0;b=b|0;var c=Q(0),d=0,e=0,f=Q(0),g=0,h=0,i=0,j=0;h=J[b>>2];we(a+68|0,-1,b);c=Q(Q(N[a+96>>2]*Q(J[266937]))+Q(N[a+104>>2]+Q(J[a+4>>2])));a:{if(Q(R(c))<Q(2147483648)){d=~~c;break a}d=-2147483648}c=Q(Q(d|0)-Q(N[a+100>>2]*Q(.5)));b:{if(Q(R(c))<Q(2147483648)){d=~~c;break b}d=-2147483648}I[a+44>>1]=d;we(a+40|0,-1,b);so(J[b>>2],a+152|0);c=Q(N[a+108>>2]*Q(.5));while(1){if(!(K[1054793]?(e|0)==8:0)){d=L[(J[266938]+e<<1)+1066048>>1];f=Q(Q(N[a+96>>2]*Q(e|0))+Q(N[a+104>>2]+Q(J[a+4>>2])));c:{if(Q(R(f))<Q(2147483648)){g=~~f;break c}g=-2147483648}Rk(d,c,Q(g|0),Q(J[a+8>>2]+(J[a+16>>2]/2|0)|0));e=e+1|0;if((e|0)!=9){continue}}break}i=a,j=ro(),J[i+260>>2]=j;J[b>>2]=h+2784}function Ys(a){var b=0,c=Q(0),d=0,e=0;c=Q(ei()*Q(8));a:{if(Q(R(c))<Q(2147483648)){b=~~c;break a}b=-2147483648}b=(b|0)<=8?8:b;b=b>>>0>=64?64:b;c=Q(N[467294]*Q(b|0));b:{if(Q(R(c))<Q(2147483648)){d=~~c;break b}d=-2147483648}if((d|0)!=L[a+44>>1]){Ws(a);d=a+40|0;Pf(d,b,4);e=a+52|0;c=Q(ei()*Q(16));c:{if(Q(R(c))<Q(2147483648)){b=~~c;break c}b=-2147483648}b=(b|0)<=8?8:b;Pf(e,b>>>0>=64?64:b,0);e=a- -64|0;c=Q(ei()*Q(24));d:{if(Q(R(c))<Q(2147483648)){b=~~c;break d}b=-2147483648}b=(b|0)<=8?8:b;Pf(e,b>>>0>=64?64:b,0);e=a+76|0;c=Q(ei()*Q(8));e:{if(Q(R(c))<Q(2147483648)){b=~~c;break e}b=-2147483648}b=(b|0)<=8?8:b;Pf(e,b>>>0>=64?64:b,0);wi(a+304|0,d);wi(a+396|0,d);a=1}else{a=0}return a}function nu(a){a=a|0;var b=Q(0),c=0,d=0,e=Q(0),f=0,g=0;b=Q(N[467293]*Q(500));a:{if(Q(R(b))<Q(2147483648)){c=~~b;break a}c=-2147483648}J[a+68>>2]=c;f=a,g=mf(1,0,c,J[467303]),J[f+56>>2]=g;b=N[467294];e=Q(b+b);b:{if(Q(R(e))<Q(2147483648)){c=~~e;break b}c=-2147483648}J[a+72>>2]=c;b=Q(b*Q(-65));c:{if(Q(R(b))<Q(2147483648)){d=~~b;break c}d=-2147483648}f=a,g=mf(1,d,c,J[467304]),J[f+60>>2]=g;d=a- -64|0;b=Q(N[467294]*Q(45));d:{if(Q(R(b))<Q(2147483648)){c=~~b;break d}c=-2147483648}f=d,g=mf(1,c,J[a+72>>2],J[467304]),J[f>>2]=g;md(a+400|0,1,1,0,-150);md(a+484|0,1,1,0,-100);md(a+568|0,1,1,-100,10);md(a+652|0,1,1,0,80);md(a+736|0,1,1,0,130);md(a+100|0,1,1,0,-35);md(a+820|0,1,2,0,25)}function tk(a,b){var c=0,d=0,e=0,f=Q(0),g=0,h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=0,n=0,o=0,p=0,q=0;f=N[b+12>>2];q=L[b>>1];g=K[b+5|0];m=q+g|0;o=K[b+4|0];d=m+o|0;p=L[b+2>>1];c=g+p|0;n=c+K[b+6|0]|0;e=J[273222];h=N[b+8>>2];i=N[b+20>>2];j=N[b+16>>2];k=N[b+28>>2];l=N[b+24>>2];g=d+g|0;ah(e,h,i,j,k,l,g,c,g+o|0,n);ah(e,i,h,j,k,f,m,c,d,n);$g(e,i,h,f,l,j,m,p,d,c);$g(e,h,i,l,f,k,d,p,d+o|0,c);Qh(e,l,f,k,j,i,q,c,m,n);Qh(e,f,l,k,j,h,d,c,g,n);d=J[e+36>>2]-8|0;while(1){c=J[e+4>>2]+(d<<4)|0;f=N[c+8>>2];N[c+8>>2]=N[c+4>>2];N[c+4>>2]=f;d=d+1|0;c=J[e+36>>2];if((d|0)<(c|0)){continue}break}e=J[b+36>>2];d=J[b+32>>2];f=N[b+40>>2];I[a+2>>1]=24;N[a+12>>2]=f;J[a+4>>2]=d;J[a+8>>2]=e;I[a>>1]=c-24}function mz(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;c=J[464807];b=(a|0)/(c|0)|0;f=J[464809];g=(b|0)/(f|0)|0;h=b-P(g,f)|0;j=h+3|0;f=h-3|0;k=g+3|0;d=g-3|0;i=a-P(b,c)|0;l=i+3|0;m=i-3|0;while(1){b=d-g|0;a=b>>31;n=((a^b)-a|0)==3;b=f;while(1){c=b-h|0;a=c>>31;o=((a^c)-a|0)==3|n;a=m;while(1){c=a;a:{if(!o){e=a-i|0;a=e>>31;if(((a^e)-a|0)!=3){break a}}a=J[464807];if(a>>>0<=c>>>0|M[464808]<=d>>>0){break a}e=J[464809];if(e>>>0<=b>>>0){break a}a=c+P(a,P(d,e)+b|0)|0;if((K[a+J[464804]|0]&254)!=8){break a}bh(779984,a|134217728)}a=c+1|0;if((c|0)<(l|0)){continue}break}a=(b|0)<(j|0);b=b+1|0;if(a){continue}break}a=(d|0)<(k|0);d=d+1|0;if(a){continue}break}}function HJ(a){a=a|0;var b=0,c=0,d=0,e=0;c=$c-16|0;$c=c;e=a- -64|0;d=63;a:{b:{while(1){b=d;if(K[b+e|0]&223){break b}d=b-1|0;if(b){continue}break}b=0;break a}b=b+1|0}I[c+14>>1]=64;I[c+12>>1]=b;J[c+8>>2]=e;b=ud(a+128|0);H[c+7|0]=K[a+132|0];c:{if(b>>>0>255){break c}a=K[b+35104|0];if(!a){break c}d=a<<2;fm(6739,J[d+50464>>2],c+7|0,c+8|0);b=L[c+12>>1];if(!b){Vk(a,K[c+7|0]);a=$c-96|0;$c=a;H[a+95|0]=K[c+7|0];J[a+88>>2]=4194304;b=J[d+33888>>2];J[a+84>>2]=a;d=a+84|0;xe(d,17310,b,a+95|0);H[J[a+84>>2]+L[a+88>>1]|0]=0;b=a+76|0;Hf(J[a+84>>2],b);Bo(d,b);$c=a+96|0;break c}if(K[(b+J[c+8>>2]|0)-1|0]==10){I[c+12>>1]=b-1;jj(a,K[c+7|0],c+8|0,2);break c}jj(a,K[c+7|0],c+8|0,3)}$c=c+16|0}function Tj(a,b,c,d,e){var f=Q(0),g=0,h=Q(0);Kf(b);J[b+160>>2]=-1;f=N[467294];J[b+60>>2]=0;J[b>>2]=44924;h=Q(f+f);a:{if(Q(R(h))<Q(2147483648)){g=~~h;break a}g=-2147483648}J[b+164>>2]=g;h=N[467293];f=Q(f*Q(30));b:{if(Q(R(f))<Q(2147483648)){g=~~f;break b}g=-2147483648}J[b+208>>2]=g;f=Q(h*Q(c|0));c:{if(Q(R(f))<Q(2147483648)){c=~~f;break c}c=-2147483648}J[b+204>>2]=c;c=J[e+4>>2];J[b+212>>2]=J[e>>2];J[b+216>>2]=c;c=J[e+12>>2];J[b+220>>2]=J[e+8>>2];J[b+224>>2]=c;I[b+144>>1]=768;c=K[1054793];J[b+68>>2]=4194304;J[b+64>>2]=b+228;J[b+56>>2]=1047;J[b+52>>2]=1048;J[b+48>>2]=1049;J[b+44>>2]=1050;H[b+21|0]=2;H[b+146|0]=!c;ke(b- -64|0,d);J[b+296>>2]=0;J[b+292>>2]=29937;zi(a,b)}function hF(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;c=J[206312];if((c|0)==-1){c=L[(J[266937]+J[266938]<<1)+1066048>>1]}d=J[a+4>>2];f=J[b+4>>2];if((d|0)<=(f|0)){g=J[b>>2];h=J[a>>2];i=J[b+8>>2];a=J[a+8>>2];o=J[206313]&65535;p=c&65535;while(1){c=a;if((i|0)>=(c|0)){while(1){if((g|0)>=(h|0)){j=J[464818];k=J[464805];l=J[464804];m=J[464807];n=J[464809];b=h;while(1){e=P(P(d,n)+c|0,m)+b|0;if(((K[k+e|0]<<8|K[e+l|0])&j)==(o|0)){ii(b,d,c,p);k=J[464805];l=J[464804];m=J[464807];n=J[464809];j=J[464818]}e=(b|0)!=(g|0);b=b+1|0;if(e){continue}break}}b=(c|0)!=(i|0);c=c+1|0;if(b){continue}break}}b=(d|0)!=(f|0);d=d+1|0;if(b){continue}break}}}function _C(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0;a=$c-16|0;$c=a;if(!K[1869221]){H[1869221]=1;Nd(1048396)}d=J[b+8>>2];if((d|0)>0){c=0;while(1){e=P(c,52)+b|0;if(J[e+56>>2]){J[a+12>>2]=J[e- -64>>2];J[a+8>>2]=J[e+68>>2];d=a+12|0;f=a+8|0;ta(d|0,f|0);Hj(d,f);d=0;h=J[e+28>>2];f=J[a+12>>2];g=J[a+8>>2];a:{if(Go(h,f,g)){break a}while(1){e=P(d,24)+1055392|0;if(!K[e+4|0]){J[e>>2]=h;H[e+4|0]=7;J[e+12>>2]=g;J[e+8>>2]=f;O[e+16>>3]=O[131740];if(J[264040]==(d|0)){J[264040]=d+1}bi(d,f,g);e=J[264180];if(e){if(bd[e|0](d)|0){break a}}Rd(1051776,d);break a}d=d+1|0;if((d|0)!=32){continue}break}}d=J[b+8>>2]}c=c+1|0;if((d|0)>(c|0)){continue}break}}$c=a+16|0;return 1}function RM(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;e=J[272014];c=0;a:{if(J[b>>2]!=J[e>>2]){break a}J[264085]=0;d=J[272024];c=0;if((d|0)==-1){break a}c=K[d+J[272027]|0];b:{if(J[b+48>>2]==(a|0)){a=$c-80|0;$c=a;J[a+76>>2]=4194304;b=J[(c<<2)+34800>>2];J[a+72>>2]=a;d=a+72|0;Hd(d,J[e+64>>2],b);Si(d,41752);b=c<<1;c=b+J[e+72>>2]|0;b=b+J[e+68>>2]|0;b=K[b|0]|K[b+1|0]<<8;H[c|0]=b;H[c+1|0]=b>>>8;$c=a+80|0;break b}b=$c-96|0;$c=b;J[b+92>>2]=4194304;d=J[(c<<2)+34800>>2];J[b+88>>2]=b+16;f=b+88|0;Hd(f,J[e+64>>2],d);d=b+8|0;Wd(d,J[(a<<2)+33888>>2]);Si(f,d);e=J[e+72>>2]+(c<<1)|0;H[e+1|0]=0;H[e|0]=a;$c=b+96|0}H[1088066]=1;a=J[272024];J[272024]=-1;yk(1088060,a);c=1}return c|0}function Uk(){var a=0,b=0,c=0,d=0,e=0,f=0;a=$c-32|0;$c=a;H[1054873]=1;H[1054874]=1;N[12606]=.3499999940395355;I[527478]=L[(J[266937]+J[266938]<<1)+1066048>>1];J[263721]=0;J[263719]=0;H[1054872]=0;J[a+24>>2]=J[263516];c=J[263515];J[a+16>>2]=J[263514];J[a+20>>2]=c;a:{if(!K[1054180]){break a}c=J[a+16>>2];b=J[464807];if(c>>>0>=b>>>0){break a}e=J[a+20>>2];if(e>>>0>=M[464808]){break a}f=J[a+24>>2];d=J[464809];if(f>>>0>=d>>>0){break a}b=P(b,P(d,e)+f|0)+c|0;b=J[464818]&(K[b+J[464805]|0]<<8|K[b+J[464804]|0]);d=b+66896|0;if(K[d+13824|0]==4|!K[d+65280|0]){break a}ii(c,e,f,0);J[a+8>>2]=J[a+24>>2];c=J[a+20>>2];J[a>>2]=J[a+16>>2];J[a+4>>2]=c;Op(a,b,0)}$c=a+32|0}function yt(a,b,c,d,e,f){var g=Q(0),h=Q(0),i=0,j=Q(0),k=0,l=Q(0),m=Q(0),n=0,o=0,p=Q(0);g=N[a>>2];i=g>Q(0);l=N[(i?b:c)+12>>2];m=N[(i?c:b)>>2];i=N[a+8>>2]>Q(0);n=i?c:b;i=i?b:c;k=N[a+4>>2]>Q(0);o=k?c:b;k=k?b:c;a:{if(N[b>>2]<=N[c+12>>2]&N[b+12>>2]>=N[c>>2]){break a}h=Q(1e9);if(g==Q(0)){break a}h=Q(R(Q(Q(m-l)/g)))}l=N[n+8>>2];m=N[i+20>>2];g=N[o+4>>2];p=N[k+16>>2];N[d>>2]=h;b:{if(N[b+16>>2]>=N[c+4>>2]){j=Q(0);if(N[b+4>>2]<=N[c+16>>2]){break b}}h=N[a+4>>2];j=Q(1e9);if(h==Q(0)){break b}j=Q(R(Q(Q(g-p)/h)))}N[e>>2]=j;c:{if(N[b+20>>2]>=N[c+8>>2]){g=Q(0);if(N[b+8>>2]<=N[c+20>>2]){break c}}h=N[a+8>>2];g=Q(1e9);if(h==Q(0)){break c}g=Q(R(Q(Q(l-m)/h)))}N[f>>2]=g}function jJ(a){a=a|0;var b=0,c=0,d=Q(0);b=P(K[a|0],52)+1638800|0;N[b>>2]=Q(K[a+1|0])*Q(.00390625);N[b+4>>2]=Q(K[a+2|0])*Q(.00390625);N[b+8>>2]=Q(K[a+3|0]+1|0)*Q(.00390625);N[b+12>>2]=Q(K[a+4|0]+1|0)*Q(.00390625);J[b+16>>2]=K[a+5|0]|K[a+6|0]<<8|K[a+7|0]<<16|-16777216;H[b+20|0]=K[a+8|0];H[b+21|0]=K[a+9|0];N[b+24>>2]=Q(K[a+10|0])*Q(.03125);c=b,d=Q(Q(ud(a+11|0)|0)/Q(1e4)),N[c+28>>2]=d;c=b,d=Q(Q(vd(a+15|0)>>>0)*Q(.03125)),N[c+32>>2]=d;c=b,d=Q(Q(ud(a+17|0)|0)/Q(1e4)),N[c+36>>2]=d;c=b,d=Q(Q(ud(a+21|0)|0)/Q(1e4)),N[c+40>>2]=d;c=b,d=Q(Q(ud(a+25|0)|0)/Q(1e4)),N[c+44>>2]=d;c=b,d=Q(Q(ud(a+29|0)|0)/Q(1e4)),N[c+48>>2]=d;H[b+22|0]=K[a+33|0];H[b+23|0]=K[a+34|0]}function LE(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0;b=$c-128|0;$c=b;c=b+32|0;Ef(c,a- -64|0,J[a+40>>2],0);g=Ne(c);J[a+200>>2]=0;c=J[a+108>>2];J[b+124>>2]=4194304;J[b+120>>2]=b+48;bd[J[J[a+212>>2]>>2]](a+212|0,b+120|0);e=J[a+204>>2];h=(e|0)<(g|0)?g:e;J[a+12>>2]=h;f=J[a+208>>2];d=(c|0)>(f|0)?c:f;J[a+16>>2]=d;vg(b+8|0,h,d);e=0;if((c|0)<(f|0)){e=((d|0)/2|0)+((c|0)/-2|0)|0}J[a+164>>2]=e+2;c=b+8|0;Zl(c,-937550306,0,0,h,d);d=b+32|0;pf(c,d,K[a+145|0],e);f=J[b+124>>2];J[b+32>>2]=J[b+120>>2];J[b+36>>2]=f;f=g+3|0;g=h-Ne(d)|0;if((f|0)<(g|0)){pf(c,d,g,e)}c=b+8|0;Mg(a+112|0,c);ug(c);bd[J[J[a>>2]+8>>2]](a);I[a+116>>1]=J[a+4>>2];I[a+118>>1]=J[a+8>>2];$c=b+128|0}function ik(a,b){var c=0,d=0,e=0,f=0,g=0;a:{if(!K[1054198]&K[1054197]!=0){break a}c=J[203556]-J[263684]|0;d=c>>31&c;e=b;b=J[a+44>>2];e=e+b|0;d=(d|0)>(e|0)?d:e;b=((c|0)>(d|0)?d:c)-b|0;if(!b){break a}e=a+672|0;while(1){c=J[a+44>>2];b:{if((b|0)<0){J[a+44>>2]=c-1;c=J[e+40>>2];f=c-1|0;Cd(J[e+84>>2]+P(f,28)|0);if((c|0)>=2){while(1){c=J[e+84>>2]+P(f,28)|0;d=c-28|0;g=J[d+4>>2];J[c>>2]=J[d>>2];J[c+4>>2]=g;J[c+24>>2]=J[d+24>>2];g=J[d+20>>2];J[c+16>>2]=J[d+16>>2];J[c+20>>2]=g;g=J[d+12>>2];J[c+8>>2]=J[d+8>>2];J[c+12>>2]=g;c=f>>>0>1;f=f-1|0;if(c){continue}break}}J[J[e+84>>2]>>2]=0;zg(e,0);b=b+1|0;break b}J[a+44>>2]=c+1;Nr(e);b=b-1|0}if(b){continue}break}}}function $y(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;c=J[464807];b=(a|0)/(c|0)|0;e=J[464809];g=(b|0)/(e|0)|0;j=b-P(g,e)|0;k=a-P(b,c)|0;re(k,g,j,0);dh(k,g,j,a);b=-4;while(1){e=b+g|0;l=P(b,b);c=-4;while(1){h=c+j|0;m=P(c,c)+l|0;a=-4;while(1){a:{if(P(a,a)+m>>>0>16){break a}i=a+k|0;f=J[464807];if(M[464808]<=e>>>0|i>>>0>=f>>>0){break a}d=J[464809];if(d>>>0<=h>>>0){break a}f=P(f,P(e,d)+h|0)+i|0;d=K[f+J[464804]|0];if((d&252)==8){break a}d=d+66896|0;if(K[d+9216|0]==2&(K[d+14592|0]&254)==4){break a}re(i,e,h,0);dh(i,e,h,f)}a=a+1|0;if((a|0)!=5){continue}break}c=c+1|0;if((c|0)!=5){continue}break}b=b+1|0;if((b|0)!=5){continue}break}}function vh(a,b){var c=0,d=Q(0),e=0,f=Q(0);c=$c-32|0;$c=c;J[a+88>>2]=1065353216;J[a+80>>2]=1065353216;J[a+84>>2]=1065353216;e=b;b=c+24|0;kf(e,124,b,c+16|0);if(ld(b,3e3)){Wd(c+8|0,15552);b=J[c+12>>2];J[c+24>>2]=J[c+8>>2];J[c+28>>2]=b;J[a+88>>2]=1073741824;J[a+80>>2]=1073741824;J[a+84>>2]=1073741824}I[a+52>>1]=0;b=c+24|0;e=Vt(b);J[a+48>>2]=e;if(!e){b=sj(b);a:{if((b|0)==-1){b=J[273226];break a}I[a+52>>1]=b;b=Vt(32396)}J[a+48>>2]=b}if(Pe(c+16|0,c+8|0)){d=N[c+8>>2];d=d>Q(.0010000000474974513)?d:Q(.0010000000474974513);if(H[a+54|0]&1){f=N[J[a+48>>2]+56>>2];d=d<f?d:f}N[a+88>>2]=d;N[a+84>>2]=d;N[a+80>>2]=d}Yl(a);if(K[a+54|0]&2){Dd(a+416|0)}$c=c+32|0}function Ad(a,b){var c=0,d=0,e=0,f=0,g=0;$k(a);c=Zk(b);if(c){$k(c)}d=J[263682];if((d|0)>=10){Yd(4863);d=J[263682]}a:{if((d|0)<=0){break a}while(1){if(K[e+1054856|0]<(b|0)){if((d|0)<=(e|0)){break a}c=d;while(1){g=c-1|0;J[(c<<2)+1054816>>2]=J[(g<<2)+1054816>>2];H[c+1054856|0]=K[c+1054855|0];c=g;if((e|0)<(c|0)){continue}break}break a}e=e+1|0;if((e|0)!=(d|0)){continue}break}e=d}J[(e<<2)+1054816>>2]=a;H[e+1054856|0]=b;J[263682]=d+1;H[a+7|0]=1;bd[J[J[a>>2]>>2]](a);bd[J[J[a>>2]+60>>2]](a);bd[J[J[a>>2]+52>>2]](a);if(J[264040]>0){while(1){b=(f<<3)+1056464|0;bd[J[J[a>>2]+44>>2]](a,f,J[b>>2],J[b+4>>2])|0;f=f+1|0;if((f|0)<J[264040]){continue}break}}Po()}function wp(a,b,c){var d=0,e=0;e=$c+-64|0;$c=e;d=-857812916;a:{b:{c:{d:{e:{f:{g:{switch(b-66|0){case 1:case 3:case 5:case 6:case 9:break a;case 10:break c;case 2:case 8:break d;case 4:case 7:break e;case 0:break f;default:break g}}switch(b-90|0){case 1:break b;case 0:break f;default:break a}}d=bd[J[a+4>>2]](a,c)|0;break a}d=Oh(a,c);break a}d=bd[J[a+12>>2]](a,8)|0;break a}b=e+12|0;d=bd[J[a+4>>2]](a,b)|0;if(d){break a}d=ki(a,b);break a}b=e+12|0;d=bd[J[a+4>>2]](a,b)|0;if(d){break a}d=ki(a,b);if(d){break a}J[c>>2]=0;J[c+4>>2]=0;d=0;if(K[e+12|0]!=117|K[J[e+16>>2]+1|0]!=66){break a}J[c+4>>2]=J[e+24>>2];J[c>>2]=J[e+20>>2]}$c=e- -64|0;return d}function YC(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0,i=0;a=$c-16|0;$c=a;e=J[b+8>>2];if((e|0)>0){c=0;while(1){d=P(c,52)+b|0;if(J[d+56>>2]){J[a+12>>2]=J[d- -64>>2];J[a+8>>2]=J[d+68>>2];e=a+12|0;f=a+8|0;ta(e|0,f|0);Hj(e,f);f=J[d+28>>2];h=J[a+12>>2];i=J[a+8>>2];d=0;g=J[264040];a:{if((g|0)<=0){break a}while(1){e=P(d,24)+1055392|0;if(!((f|0)!=J[e>>2]|!K[e+4|0])){bi(d,h,i);f=J[264181];b:{if(f){if(bd[f|0](d)|0){break b}}Rd(1052036,d)}bi(d,-1e5,-1e5);H[e+4|0]=0;if(J[264040]!=(d+1|0)){break a}J[264040]=d;break a}d=d+1|0;if((g|0)!=(d|0)){continue}break}}e=J[b+8>>2]}c=c+1|0;if((e|0)>(c|0)){continue}break}}$c=a+16|0;return(K[1869768]^-1)&1}function Dl(a){var b=0,c=0,d=0;b=$c-720|0;$c=b;J[b+688>>2]=0;J[b+692>>2]=0;J[b+680>>2]=0;J[b+684>>2]=0;J[b+672>>2]=0;J[b+676>>2]=0;J[b+664>>2]=0;J[b+668>>2]=0;qp();J[263427]=b+664;d=b+8|0;Je(d,a);c=Mi(b+608|0,d);a:{if(c){Te(c,12214,d);break a}b:{c:{c=Cp(a);d:{if(!c){c=-857812990;break d}c=bd[J[c+4>>2]](b+608|0)|0;if(!c){break c}vi()}bd[J[b+636>>2]](b+608|0)|0;Te(c,12332,b+8|0);break b}bd[J[b+636>>2]](b+608|0)|0;c=0}vm(J[464804],J[464807],J[464808],J[464809]);if(!J[263427]){tq(J[207101],b+664|0)}uq(b+664|0);d=J[a+4>>2];J[b+712>>2]=J[a>>2];J[b+716>>2]=d;a=b+712|0;Lm(a);d=a;a=b+704|0;kf(d,46,a,b+696|0);ke(1859288,a)}$c=b+720|0;return c}function Go(a,b,c){var d=0,e=0,f=Q(0),g=0,h=0;h=J[264040];if((h|0)>0){while(1){a:{g=P(e,24)+1055392|0;if(J[g>>2]!=(a|0)){break a}d=K[g+4|0];if(!d){break a}if(!(!(d&2)|!K[1056336])){b:{if((d|0)!=7){break b}d=b-J[g+8>>2]|0;a=d>>31;d=(a^d)-a|0;f=Q(N[467293]*Q(5));c:{if(Q(R(f))<Q(2147483648)){a=~~f;break c}a=-2147483648}if((a|0)>=(d|0)){d=c-J[(P(e,24)+1055392|0)+12>>2]|0;a=d>>31;d=(a^d)-a|0;f=Q(N[467294]*Q(5));d:{if(Q(R(f))<Q(2147483648)){a=~~f;break d}a=-2147483648}if((a|0)>=(d|0)){break b}}H[g+4|0]=2}a=(e<<3)+1056464|0;Np(Q(b-J[a>>2]|0),Q(c-J[a+4>>2]|0))}bi(e,b,c);return 1}e=e+1|0;if((h|0)!=(e|0)){continue}break}}return 0}function tq(a,b){var c=0,d=0,e=0,f=0,g=Q(0);c=$c-32|0;$c=c;d=J[464807];f=J[464809];H[b+28|0]=7;J[c+16>>2]=J[a+100>>2];e=J[a+96>>2];J[c+8>>2]=J[a+92>>2];J[c+12>>2]=e;a=$c-32|0;$c=a;e=c+20|0;N[e>>2]=Q((d|0)/2|0)+Q(.5);d=J[464808];N[e+8>>2]=Q((f|0)/2|0)+Q(.5);N[e+4>>2]=Q(d|0)+Q(.0010000000474974513);Dg(a+8|0,e,c+8|0);J[e+4>>2]=0;d=J[464808];a:{if((d|0)<0){break a}while(1){g=lr(a+8|0);if(g!=Q(-1e5)){N[e+4>>2]=g;break a}N[a+12>>2]=N[a+12>>2]+Q(-1);N[a+24>>2]=N[a+24>>2]+Q(-1);f=(d|0)>0;d=d-1|0;if(f){continue}break}}$c=a+32|0;J[b+8>>2]=J[c+28>>2];a=J[c+24>>2];J[b>>2]=J[c+20>>2];J[b+4>>2]=a;J[b+12>>2]=0;J[b+16>>2]=0;$c=c+32|0}function uu(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;b=$c-16|0;$c=b;c=K[a+48|0];if(c){d=K[a+49|0];Vk(c,d);Ao(c,d)}c=K[a+40|0];if(c){d=K[a+41|0];f=K[a+42|0];e=J[a+168>>2];J[b+8>>2]=J[a+164>>2];J[b+12>>2]=e;e=b+8|0;jj(c,d,e,f);a=$c-224|0;$c=a;H[a+222|0]=f&1;H[a+223|0]=d;J[a+216>>2]=4194304;J[a+140>>2]=8388608;c=J[(c<<2)+33888>>2];J[a+212>>2]=a+144;J[a+136>>2]=a;d=a+212|0;xe(d,17310,c,a+223|0);c=a+136|0;xe(c,6310,a+222|0,e);Si(d,c);$c=a+224|0}J[269191]=26572;J[269194]=4137;J[269192]=519;J[269190]=520;J[269193]=521;J[269189]=517;J[269188]=522;H[1075950]=1;H[1075948]=1;J[268986]=35472;Ad(1075944,50);$c=b+16|0}function AI(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0;b=$c-32|0;$c=b;f=_k();g=b,h=qe(1,(J[a+56>>2]<<2)+4|0),J[g+28>>2]=h;bd[J[J[a+64>>2]+36>>2]](a- -64|0,b+28|0);c=J[a+56>>2];if((c|0)>0){while(1){d=(P(e,28)+a|0)+1176|0;if(J[d>>2]){J[b+24>>2]=J[d+24>>2];c=J[d+20>>2];J[b+16>>2]=J[d+16>>2];J[b+20>>2]=c;c=J[d+12>>2];J[b+8>>2]=J[d+8>>2];J[b+12>>2]=c;c=J[d+4>>2];J[b>>2]=J[d>>2];J[b+4>>2]=c;a:{if(!f|L[((e<<1)+a|0)+152>>1]==65535){break a}if(!bl(I[b+4>>1],I[b+6>>1],L[b+8>>1],L[b+10>>1])){break a}I[b+4>>1]=L[b+4>>1]+4}we(b,-1,b+28|0);c=J[a+56>>2]}e=e+1|0;if((c|0)>(e|0)){continue}break}}Pd(J[a+12>>2]);$c=b+32|0}function jn(){var a=0,b=0,c=0,d=0,e=0;a=$c-96|0;$c=a;wm();ht(1811772,1811780);b=J[452946];c=J[452945];J[a+8>>2]=c;J[a+12>>2]=b;a:{if(!(b&65535)){break a}c=a+8|0;b=rf(c,19477);if(!K[1054198]&K[1054197]!=0|(b|0)==-1){break a}Qe(a,c,b+4|0);J[a+92>>2]=4194304;J[a+88>>2]=a+16;b=a+88|0;Hd(b,6300,a);b=Nj(b,1,0,0,0);H[1777704]=1;J[421994]=b}H[1688036]=1;H[1687969]=0;d=1777696,e=se(),J[d>>2]=e;J[444425]=ad;J[422010]=0;yg(1732784,1688044,1687980);Cm(1732844);J[433214]=0;J[433215]=0;J[433210]=0;H[1732864]=0;yg(1777608,1732868,1687980);Cm(1777668);J[444420]=0;J[444421]=0;J[444416]=0;H[1777688]=0;$c=a+96|0}function bh(a,b){var c=0,d=0,e=0,f=0;c=J[a+12>>2];a:{if((c|0)!=J[a+4>>2]){c=J[a+20>>2];d=J[a>>2];break a}b:{if((c|0)<536870911){break b}pd(12077);c=J[a>>2];if(!c){c=J[a+4>>2];break b}qd(c);J[a+16>>2]=0;J[a+20>>2]=0;J[a+8>>2]=0;J[a+12>>2]=0;J[a>>2]=0;J[a+4>>2]=0;c=0}c=c<<1;e=(c|0)<=32?32:c;d=Ye(e,4,12814);f=J[a>>2];if(J[a+12>>2]>0){c=0;while(1){J[(c<<2)+d>>2]=J[((J[a+8>>2]&J[a+16>>2]+c)<<2)+f>>2];c=c+1|0;if((c|0)<J[a+12>>2]){continue}break}}qd(f);J[a+16>>2]=0;J[a+8>>2]=e-1;J[a+4>>2]=e;J[a>>2]=d;c=J[a+12>>2];J[a+20>>2]=c}J[(c<<2)+d>>2]=b;J[a+12>>2]=J[a+12>>2]+1;J[a+20>>2]=J[a+8>>2]&J[a+20>>2]+1}function At(a,b,c,d){var e=Q(0),f=0,g=0,h=0,i=Q(0);a:{b:{if((b|0)<0){J[a+20>>2]=981668463;J[a+32>>2]=981668463;break b}e=N[a+36>>2];c:{if(Q(R(e))<Q(2147483648)){f=~~e;break c}f=-2147483648}g=1;e=N[a+28>>2];d:{if(Q(R(e))<Q(2147483648)){h=~~e;break d}h=-2147483648}f=Dt(h,b,f);if(bd[d|0](f)|0){break a}d=P(f,12)+66896|0;e=Q(N[(c?d+27652|0:d+18436|0)>>2]+Q(b|0));i=N[a+32>>2];e:{if(c){if(e>i){break e}break a}if(!(e<i)){break a}}if(!Ct(a+28|0,f)){break a}e=Q((c?Q(.0010000000474974513):Q(-.0010000000474974513))+e);N[a+32>>2]=e;N[a+20>>2]=e}g=0;J[a+8>>2]=0;J[a>>2]=0;J[a+4>>2]=0;H[1685396]=1}return g}function ze(a,b){var c=0,d=0,e=0,f=0,g=0;c=J[a+16>>2];a:{if((c|0)!=J[a+8>>2]){c=J[a>>2];break a}if((c|0)>=536870911){pd(12114);c=J[a>>2];if(!c){c=0;break a}qd(c);c=0;J[a>>2]=0;d=a+8|0;J[d+16>>2]=0;J[d+8>>2]=0;J[d+12>>2]=0;J[d>>2]=0;J[d+4>>2]=0;break a}c=c<<1;d=(c|0)<=32?32:c;c=Ye(d,J[a+4>>2],12833);e=J[a+20>>2];g=J[a+4>>2];f=P(e,g);e=P(g,J[a+8>>2]-e|0);Kd(c,f+J[a>>2]|0,e);if(J[a+20>>2]){Kd(c+e|0,J[a>>2],f)}qd(J[a>>2]);J[a+20>>2]=0;J[a+12>>2]=d-1;J[a+8>>2]=d;J[a>>2]=c;J[a+24>>2]=J[a+16>>2]}f=c;c=J[a+4>>2];Kd(f+P(c,J[a+24>>2])|0,b,c);J[a+16>>2]=J[a+16>>2]+1;J[a+24>>2]=J[a+12>>2]&J[a+24>>2]+1}function Jk(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;if((a|0)<(b|0)){f=J[268514];i=J[268513];while(1){j=J[(a+b<<1&-4)+f>>2];c=b;d=a;while(1){g=d;while(1){d=g;g=d+1|0;e=d<<2;k=e+f|0;l=J[k>>2];if(l>>>0<j>>>0){continue}break}h=c;while(1){c=h;h=c-1|0;m=c<<2;n=m+f|0;o=J[n>>2];if(o>>>0>j>>>0){continue}break}if((c|0)>=(d|0)){J[k>>2]=o;J[n>>2]=l;c=i+e|0;d=J[c>>2];e=c;c=i+m|0;J[e>>2]=J[c>>2];J[c>>2]=d;d=g;c=h}if((c|0)>=(d|0)){continue}break}a:{b:{if((c-a|0)<=(b-d|0)){if((a|0)>=(c|0)){break b}Jk(a,c);break b}if((b|0)>(d|0)){Jk(d,b)}b=c;break a}a=d}if((a|0)<(b|0)){continue}break}}}function Ez(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;a:{if((b|0)!=92){break a}a=0;b:{c:{e=J[263682];if((e|0)<=0){break c}while(1){c=J[(a<<2)+1054816>>2];if(!K[c+6|0]){a=a+1|0;if((e|0)!=(a|0)){continue}break c}break}a=c;break b}a=0}if(!a){break a}if(K[1066044]){H[1066044]=0;return}ge(a);return}if(J[263682]>0){a=0;while(1){c=J[(a<<2)+1054816>>2];H[c+7|0]=1;bd[J[J[c>>2]+24>>2]](c,b,d);a=a+1|0;if((a|0)<J[263682]){continue}break}}a=0;while(1){d:{if(!Ue(a,b,d)){break d}c=a+1065568|0;H[c|0]=K[c|0]&(K[d|0]^-1);c=J[(a<<2)+1065840>>2];if(!c){break d}bd[c|0](b,d)}a=a+1|0;if((a|0)!=50){continue}break}}function Jx(a){a=a|0;var b=0,c=0;J[a+104>>2]=0;b=rd(a,1998,313,314,0,0)<<5;J[b+1074108>>2]=382;J[b+1074104>>2]=383;b=rd(a,14241,337,346,347,0)<<5;J[b+1074124>>2]=1065353216;c=b+1074116|0;J[c>>2]=1048576e3;J[c+4>>2]=1082130432;J[b+1074112>>2]=44852;J[b+1074108>>2]=384;J[b+1074104>>2]=385;c=J[263694];b=rd(a,5703,337,350,351,0)<<5;J[b+1074124>>2]=c;c=b+1074116|0;J[c>>2]=0;J[c+4>>2]=30;J[b+1074112>>2]=44804;J[b+1074108>>2]=386;J[b+1074104>>2]=387;b=rd(a,9907,313,314,0,0)<<5;J[b+1074108>>2]=388;J[b+1074104>>2]=389;b=rd(a,4051,313,314,0,0)<<5;J[b+1074108>>2]=390;J[b+1074104>>2]=391;Zf(a,-1,364)}function Ul(a){var b=0,c=0,d=0,e=0,f=0;d=$c-16|0;$c=d;e=J[a+112>>2];a:{if(!e){break a}f=a+112|0;while(1){b=J[(c<<2)+827376>>2];if(!(!b|(a|0)==(b|0))&(e|0)==J[b+112>>2]){break a}c=c+1|0;if((c|0)!=256){continue}break}Cd(f)}b:{if(K[a+109|0]!=2){break b}Ee(d,a+196|0,64);c=0;while(1){c:{b=J[(c<<2)+827376>>2];if(!b|K[b+109|0]!=1){break c}e=d+8|0;Ee(e,b+196|0,64);if(!(Uf(d,e)&255)){break c}vf(6679,d);H[b+109|0]=2;J[b+104>>2]=J[a+104>>2];break b}c=c+1|0;if((c|0)!=256){continue}break}vf(6710,d);kr(J[a+104>>2])}J[a+120>>2]=1065353216;J[a+124>>2]=1065353216;J[a+112>>2]=0;H[a+109|0]=0;$c=d+16|0}function vi(){var a=0,b=0;a=J[464804];b=J[464805];if((a|0)!=(b|0)){qd(b);a=J[464804]}J[464818]=255;J[464805]=0;qd(a);J[464823]=4194304;J[464822]=1859328;J[464804]=0;xm(0,0,0);J[464828]=0;J[464820]=0;J[464821]=-1066860544;H[1859276]=0;J[464850]=-2;J[464851]=-1;J[464848]=458761;J[464849]=-1;J[464867]=-6579301;J[464857]=0;J[464858]=0;J[464854]=1065353216;J[464852]=1065353216;J[464853]=1065353216;Ri(-6579301,1859472,1859476,1859480);J[464863]=-1;Ri(-1,1859456,1859460,1859464);J[464871]=-3740673;J[464872]=-1;J[464861]=-1;J[464862]=-1;J[464859]=-13159;J[464860]=-1;J[464855]=0;J[464856]=0}function nn(a,b,c,d){var e=0,f=0,g=Q(0),h=0;e=J[a+32>>2];J[a+16>>2]=J[a+28>>2];J[a+20>>2]=e;J[a+24>>2]=J[a+36>>2];if(Et(a,c)){a=1}else{N[a+4>>2]=N[a+4>>2]-Q(b*d);e=Bd(N[a+32>>2]);b=Q(d*Q(3));N[a+28>>2]=Q(b*N[a>>2])+N[a+28>>2];g=Q(Q(b*N[a+4>>2])+N[a+32>>2]);N[a+32>>2]=g;N[a+36>>2]=Q(b*N[a+8>>2])+N[a+36>>2];f=Bd(g);a:{if(N[a+4>>2]>Q(0)){f=(e|0)>(f|0)?e:f;while(1){if((e|0)==(f|0)){break a}e=e+1|0;if(At(a,e,0,c)){continue}break}break a}if((e|0)<(f|0)){break a}while(1){if(!At(a,e,1,c)){break a}h=(e|0)>(f|0);e=e-1|0;if(h){continue}break}}b=Q(N[a+12>>2]-d);N[a+12>>2]=b;a=b<Q(0)}return a}function oq(a,b,c,d){var e=Q(0),f=Q(0),g=Q(0),h=Q(0),i=Q(0),j=Q(0);e=N[b>>2];f=N[c>>2];i=N[b+8>>2];j=N[c+8>>2];g=N[a+144>>2];N[a+140>>2]=g;h=N[a+152>>2];N[a+148>>2]=h;e=Q(f-e);f=Q(e*e);e=Q(j-i);e=Q(Y(Q(f+Q(e*e))));a:{if(e>Q(.05000000074505806)){N[a+144>>2]=g+Q(Q(d*Q(20))*Q(e+e));break a}d=Q(-d)}e=N[a+160>>2];N[a+156>>2]=e;d=Q(Q(d*Q(3))+h);d=d<Q(0)?Q(0):d;N[a+152>>2]=d>Q(1)?Q(1):d;b=0;c=K[1054202];while(1){d=c?K[a+111|0]?Q(e+Q(.10000000149011612)):Q(e*Q(.8399999737739563)):Q(e*Q(.8399999737739563));d=d<Q(0)?Q(0):d;e=d>Q(1)?Q(1):d;b=b+1|0;if((b|0)!=3){continue}break}N[a+160>>2]=e}function wj(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0;d=$c-32|0;b=Infinity;a:{if(a==Infinity){break a}if(R(a)<2147483648){c=~~a}else{c=-2147483648}b=0;if((c|0)<-1021){break a}b=Infinity;if((c|0)>1023){break a}J[d+16>>2]=1433278389;J[d+20>>2]=1066902984;J[d+8>>2]=-1827410917;J[d+12>>2]=1077162938;J[d>>2]=-1880200776;J[d+4>>2]=1083680672;c=c-(a<0)|0;e=a-+(c|0)+-.5;f=e*e;x(0,0);x(1,c+1023<<20);b=+z();a=.023093347753750233;g=1;while(1){c=g;a=f*a+O[(c<<3)+d>>3];g=c-1|0;if(c){continue}break}h=b*1.4142135623730951;b=f*(f+233.1842114274816)+4368.211662727558;a=e*a;b=h*((b+a)/(b-a))}return b}function ss(a,b,c,d,e){var f=0,g=0,h=0,i=0;f=$c-640|0;$c=f;g=J[a+8>>2];h=J[a+4>>2];J[f+632>>2]=J[a>>2];J[f+636>>2]=h;H[f+623|0]=102;a=J[g+8>>2];h=L[g+4>>1];Ga(J[g>>2],h|0,L[g+6>>1]);if(Df(f+632|0,f+624|0,f+623|0)){h=((a-h|0)/2|0)+d|0;while(1){d=Rf(f,f+624|0);a=J[(K[f+623|0]<<2)+825316>>2];if(e){a=K[825313]?-16777216:a>>>2&4144959}J[f+612>>2]=458752;J[f+608>>2]=f+616;g=f+608|0;Ud(g,35);eg(g,a&255);eg(g,a>>>8&255);eg(g,a>>>16&255);if(R(i)<2147483648){a=~~i}else{a=-2147483648}i=i+ +Wb(f|0,d|0,b|0,a+c|0,h|0,e|0,f+616|0);if(Df(f+632|0,f+624|0,f+623|0)){continue}break}}$c=f+640|0}function gn(a,b,c,d,e){var f=0,g=0;g=J[207101];f=g;if((b|0)!=255){Dj(b);f=P(b,804)+835184|0;je(f,0,804);J[f+88>>2]=1065353216;J[f+80>>2]=1065353216;J[f+84>>2]=1065353216;J[f+420>>2]=1065353216;J[f+120>>2]=1065353216;J[f+124>>2]=1065353216;H[f+54|0]=2;H[f+260|0]=0;H[f+196|0]=0;J[f+104>>2]=0;vh(f,32352);J[f>>2]=32372;H[f+54|0]=K[f+54|0]|4;J[(b<<2)+827376>>2]=f;Rd(1040336,b)}Vl(f,d);Ml(f);Vf(f+260|0,64,c);a:{if(!e){break a}fn(a,b,7);if((b|0)!=255){break a}a=J[g+8>>2];J[g+424>>2]=J[g+4>>2];J[g+428>>2]=a;J[g+432>>2]=J[g+12>>2];ad=J[g+16>>2];J[g+448>>2]=J[g+20>>2];J[g+452>>2]=ad}}function Rm(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0;f=$c-32|0;$c=f;if((a|0)<(b|0)){h=J[458136];j=J[h+4>>2];while(1){$d(f+24|0,h,a+b>>1);d=b;e=a;while(1){g=f+16|0;c=e;$d(g,h,c);e=c+1|0;if((ck(f+24|0,g)|0)>0){continue}while(1){g=d;i=f+8|0;$d(i,h,d);d=d-1|0;if((ck(f+24|0,i)|0)<0){continue}break}a:{if((c|0)>(g|0)){e=c;d=g;break a}c=(c<<2)+j|0;i=J[c>>2];k=c;c=(g<<2)+j|0;J[k>>2]=J[c>>2];J[c>>2]=i}if((d|0)>=(e|0)){continue}break}b:{c:{if((d-a|0)<=(b-e|0)){if((a|0)>=(d|0)){break c}Rm(a,d);break c}if((b|0)>(e|0)){Rm(e,b)}b=d;break b}a=e}if((a|0)<(b|0)){continue}break}}$c=f+32|0}function pz(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0;e=J[464807];c=(a|0)/(e|0)|0;f=J[464809];b=(c|0)/(f|0)|0;g=c-P(b,f)|0;j=g+2|0;g=g-2|0;k=b+2|0;d=b-2|0;a=a-P(c,e)|0;l=a+2|0;m=a-2|0;h=J[464808];while(1){b=g;while(1){a=m;while(1){c=a;a:{if(a>>>0>=e>>>0|d>>>0>=h>>>0|b>>>0>=f>>>0){break a}i=P(P(d,f)+b|0,e)+a|0;if((J[464818]&(K[i+J[464805]|0]<<8|K[i+J[464804]|0])&65534)!=8){break a}re(a,d,b,0);f=J[464809];h=J[464808];e=J[464807]}a=c+1|0;if((c|0)<(l|0)){continue}break}a=(b|0)<(j|0);b=b+1|0;if(a){continue}break}a=(d|0)<(k|0);d=d+1|0;if(a){continue}break}}function fl(){var a=0,b=0,c=0,d=0,e=0,f=0;b=$c-16|0;$c=b;J[b>>2]=-1;a=$c-196608|0;$c=a;ea(1,a|0);$(34963,J[a>>2]);d=J[a>>2];Xo(a,98304,0);ra(34963,196608,a|0,35044);$c=a+196608|0;J[263615]=d;Dd(1054464);e=1054464,f=of(0,4),J[e>>2]=f;Dd(1054468);e=1054468,f=of(1,4),J[e>>2]=f;ma(0);ma(1);J[12443]=-1;J[12441]=-1082130432;J[12440]=-1082130432;J[12442]=-1;J[263619]=0;J[263625]=0;while(1){a=(c<<5)+49780|0;J[a>>2]=J[a>>2]|31;c=c+1|0;if((c|0)!=18){continue}break}_o(0);jc(770,771);ic(515);J[b+8>>2]=1;J[b+12>>2]=1;J[b+4>>2]=b;Cd(1054496);e=1054496,f=qj(b+4|0,0,0),J[e>>2]=f;$c=b+16|0}function Bj(a,b,c,d,e){var f=0,g=0,h=Q(0),i=0,j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=Q(0),q=Q(0);i=Bd(d);g=Bd(e);f=P(L[c+4>>1],12)+66896|0;d=N[f+18432>>2];j=Q(i|0);l=N[f+18440>>2];k=Q(g|0);e=N[f+27648>>2];h=N[f+27656>>2];ri(a,b,c,Q(d+j),Q(l+k),Q(e+j),Q(h+k));i=1;while(1){f=(i<<3)+c|0;g=L[f+4>>1];if(g){g=P(g,12)+66896|0;o=N[g+27648>>2];p=N[g+18432>>2];q=N[g+27656>>2];m=Q(l+k);d=Q(d+j);l=N[g+18440>>2];n=Q(l+k);e=Q(e+j);ri(a,b,f,d,n,e,m);m=Q(h+k);h=Q(q+k);ri(a,b,f,d,m,e,h);ri(a,b,f,Q(p+j),n,d,h);ri(a,b,f,e,n,Q(o+j),h);d=p;h=q;e=o;i=i+1|0;if((i|0)!=4){continue}}break}}function Nj(a,b,c,d,e){var f=0;f=$c-336|0;$c=f;H[f+319|0]=c;c=Gd(f,0,312);Vf(c,128,a);Kj(27655,a,c+319|0);a=J[467284]+1|0;J[467284]=a;H[c+304|0]=K[c+319|0];J[c+128>>2]=a;a:{if(!K[1869140]){break a}a=c+328|0;Ee(a,c,128);if(!_e(a,45864)){break a}dk(a,4,115)}b:{if(!K[1869141]){break b}a=c+328|0;Ee(a,c,128);if(!_e(a,45856)){break b}dg(a,4)}if(d){Vf(c+176|0,64,d)}if(e){Vf(c+240|0,64,e)}J[c+132>>2]=-3;J[c+308>>2]=0;if(b&2){a=c+328|0;Ee(a,c,128);d=J[467287];e=J[467286];J[c+324>>2]=e;J[c+320>>2]=d;xe(a,10922,c+320|0,c+324|0)}km(1865872,c,b);jm();$c=c+336|0;return J[c+128>>2]}function sE(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0;f=$c-16|0;$c=f;g=J[a+60>>2];a:{b:{if((g|0)==(b|0)){break b}h=g;g=J[a+4>>2];if(h|(g|0)>(c|0)|(J[a+64>>2]+(g+J[a+12>>2]|0)|0)<=(c|0)){break a}c=J[a+8>>2];Dr(a,f+12|0,f+8|0);c=d-c|0;d=J[f+12>>2];c:{if((c|0)<(d|0)){b=J[a+48>>2];e=J[a+40>>2]-b|0;J[a+40>>2]=e;break c}if((c|0)>=(d+J[f+8>>2]|0)){b=J[a+48>>2];e=b+J[a+40>>2]|0;J[a+40>>2]=e;break c}J[a+60>>2]=b;J[a+56>>2]=c-d;e=J[a+40>>2];b=J[a+48>>2]}c=J[a+44>>2]-b|0;b=(c|0)>(e|0);c=b?e:c;if(b&(c|0)>=0){break b}J[a+40>>2]=(c|0)>0?c:0}e=1}$c=f+16|0;return e|0}function QG(){var a=0,b=0,c=0,d=0,e=0;b=$c-2688|0;$c=b;H[131408]=0;H[131415]=0;H[131416]=0;H[131417]=0;H[131418]=0;H[131419]=0;H[132183]=0;H[132184]=0;H[132185]=0;H[132186]=0;H[132187]=0;J[b+2684>>2]=4194304;J[b+2680>>2]=b+2608;a=J[452954];c=b+16|0;if((Rf(c+4|0,1811808)|0)>=512){Yd(4373)}J[c>>2]=a;J[b+12>>2]=1;d=53248,e=Ib()|0,J[d>>2]=e;a=b+16|0;a=Hb(J[13312],a+4|0,J[a>>2])|0;a=(a|0)==-23?-857812989:0-a|0;a:{if(!(!a|(a|0)==J[11487]|(a|0)==J[11488])){hk(a);break a}H[1832516]=1;H[1811801]=0;J[458130]=0;a=b+2680|0;xe(a,26445,1811808,1811816);ht(a,41752)}$c=b+2688|0}function rL(a){a=a|0;var b=0,c=0,d=0,e=0;c=J[273211];yf(a);af(160);yd(Q(N[a+16>>2]*Q(-.01745329238474369)),Q(0),Q(0),1541616,1);yd(Q(N[a+16>>2]*Q(-.01745329238474369)),Q(0),Q(0),1541632,1);yd(Q(N[a+16>>2]*Q(-.01745329238474369)),Q(0),Q(0),1541648,1);If(1541664);yd(Q(0),Q(0),Q(-Q(R(N[a+180>>2]))),1541680,0);yd(Q(0),Q(0),Q(R(N[a+180>>2])),1541696,0);while(1){d=(b<<2)+1092844|0,e=ue(c,Q(.699999988079071)),J[d>>2]=e;b=b+1|0;if((b|0)!=6){continue}break}yd(N[a+164>>2],Q(0),Q(0),1541712,0);yd(N[a+172>>2],Q(0),Q(0),1541728,0);Pd(J[273228]);J[273224]=J[273229];ae(160)}function _y(){var a=0,b=Q(0),c=0,d=0;nd(1041636,0,300);nd(1046056,0,301);nd(1045016,0,302);nd(1042416,0,303);nd(1042936,0,303);nd(1043196,0,304);nd(1043456,0,305);J[268507]=2147483647;J[268505]=2147483647;J[268506]=2147483647;J[266967]=87;c=1074060,d=Le(5535,4,1024,30),J[c>>2]=d;a=J[12427];b=Q(Q(((a|0)<=16?16:a)|0)*Q(1.4142135381698608));a:{if(Q(R(b))<Q(2147483648)){a=~~b;break a}a=-2147483648}a=a+24|0;J[268522]=P(a,a);a=J[12426];b=Q(Q(((a|0)<=16?16:a)|0)*Q(1.4142135381698608));b:{if(Q(R(b))<Q(2147483648)){a=~~b;break b}a=-2147483648}a=a+24|0;J[268521]=P(a,a)}function dv(a,b,c){a=a|0;b=b|0;c=c|0;a:{b:{if(!(J[c+24>>2]!=(b|0)&J[c+52>>2]!=(b|0))){b=J[a+804>>2]-5|0;c=J[a+916>>2];b=(b|0)<(c|0)?b:c-1|0;J[a+804>>2]=(b|0)>0?b:0;break b}if(!(J[c+28>>2]!=(b|0)&J[c+56>>2]!=(b|0))){b=J[a+804>>2]+5|0;c=J[a+916>>2];b=(b|0)<(c|0)?b:c-1|0;J[a+804>>2]=(b|0)>0?b:0;break b}c:{switch(b-122|0){case 0:b=J[a+916>>2];c=J[a+804>>2];b=(b|0)<(c|0)?b:c;J[a+804>>2]=((b|0)<=1?1:b)-1;break b;case 1:b=J[a+804>>2]+1|0;c=J[a+916>>2];b=(b|0)<(c|0)?b:c-1|0;J[a+804>>2]=(b|0)>0?b:0;break b;default:break c}}_i(a,b,c);ci(b);break a}Uh(a);Th(a)}return 1}function Eo(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;c=$c-112|0;$c=c;h=J[a+72>>2];j=J[a+68>>2];I[c+110>>1]=64;J[c+104>>2]=c+32;while(1){I[c+108>>1]=0;Hd(c+104|0,J[a+64>>2],J[(f<<2)+34800>>2]);H[J[c+104>>2]+L[c+108>>1]|0]=0;d=f<<1;b=j+d|0;a:{if(!Hf(J[c+104>>2],c+24|0)){d=d+h|0;b=K[b|0]|K[b+1|0]<<8;H[d|0]=b;H[d+1|0]=b>>>8;break a}e=c+16|0;g=c+8|0;kf(c+24|0,44,e,g);e=Ei(e,K[b|0],33888,172);g=Ei(g,K[b+1|0],33888,172);if((e&255)==92){i=d+h|0;b=K[b|0]|K[b+1|0]<<8;H[i|0]=b;H[i+1|0]=b>>>8}b=d+h|0;H[b+1|0]=g;H[b|0]=e}f=f+1|0;if((f|0)!=50){continue}break}$c=c+112|0}function Gz(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;a=P(b,24)+1055392|0;a:{if(O[131740]>O[a+16>>3]+.25|K[a+4|0]!=7){break a}a=1;c=J[263846];if(c){a=0;if((c|0)!=1){break a}}d=K[a+1065556|0];J[12836]=-1;J[266388]=0;cf(a,1);b:{if(c){Uk();break b}Tk()}if(d){break a}J[12836]=-1;if(!K[a+1065556|0]){break a}cf(a,0)}c:{if(K[1055388]){if(!(H[(P(b,24)+1055392|0)+4|0]&1)){break c}}if(J[263682]<=0){break c}a=(b<<3)+1056464|0;c=J[a+4>>2];d=J[a>>2];e=1<<b;b=0;while(1){a=J[(b<<2)+1054816>>2];H[a+7|0]=1;bd[J[J[a>>2]+40>>2]](a,e,d,c);b=b+1|0;if((b|0)<J[263682]){continue}break}}}function Er(a){a=a|0;var b=0,c=0;b=J[a+32>>2];a=Br(b,J[b+8>>2]-16384|0);if(!a){c=J[b+4>>2];a=c+K[b+856|0]|0;J[b+4>>2]=a;c=J[b>>2]|L[b+536>>1]<<c;J[b>>2]=c;if(a>>>0>=8){while(1){a=J[b+12>>2];J[b+12>>2]=a+1;H[a|0]=c;J[b+16>>2]=J[b+16>>2]-1;c=J[b>>2]>>>8|0;J[b>>2]=c;a=J[b+4>>2]-8|0;J[b+4>>2]=a;if(a>>>0>7){continue}break}}if(a){J[b+4>>2]=(a>>>0<=7?7:a)+1;while(1){a=J[b+12>>2];J[b+12>>2]=a+1;H[a|0]=c;J[b+16>>2]=J[b+16>>2]-1;c=J[b>>2]>>>8|0;J[b>>2]=c;a=J[b+4>>2]-8|0;J[b+4>>2]=a;if(a>>>0>7){continue}break}}a=ce(J[b+20>>2],b+33656|0,8192-J[b+16>>2]|0)}return a|0}function Wk(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;if((a|0)<(b|0)){while(1){i=K[(a+b<<2&-8)+1058357|0];c=b;d=a;while(1){g=d;while(1){d=g;g=d+1|0;e=(d<<3)+1058352|0;if(K[e+5|0]>i>>>0){continue}break}h=c;while(1){c=h;h=c-1|0;f=(c<<3)+1058352|0;if(K[f+5|0]<i>>>0){continue}break}if((d|0)<=(c|0)){j=J[e>>2];c=J[e+4>>2];d=J[f+4>>2];J[e>>2]=J[f>>2];J[e+4>>2]=d;J[f>>2]=j;J[f+4>>2]=c;c=h;d=g}if((d|0)<=(c|0)){continue}break}a:{b:{if((c-a|0)<=(b-d|0)){if((a|0)>=(c|0)){break b}Wk(a,c);break b}if((b|0)>(d|0)){Wk(d,b)}b=c;break a}a=d}if((a|0)<(b|0)){continue}break}}}function we(a,b,c){var d=0,e=Q(0),f=Q(0),g=0,h=0,i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=0,n=0;m=L[a+10>>1];n=L[a+8>>1];g=I[a+4>>1];h=I[a+6>>1];d=J[c>>2];J[d+12>>2]=b;J[d+8>>2]=0;e=Q(h|0);N[d+4>>2]=e;i=Q(g|0);N[d>>2]=i;j=N[a+12>>2];N[d+16>>2]=j;f=N[a+16>>2];J[d+36>>2]=b;J[d+32>>2]=0;N[d+28>>2]=e;e=Q(g+n|0);N[d+24>>2]=e;N[d+20>>2]=f;k=N[a+20>>2];N[d- -64>>2]=k;J[d+60>>2]=b;J[d+56>>2]=0;l=Q(h+m|0);N[d+52>>2]=l;N[d+48>>2]=e;N[d+44>>2]=f;N[d+40>>2]=k;f=N[a+24>>2];N[d+92>>2]=f;N[d+88>>2]=j;J[d+84>>2]=b;J[d+80>>2]=0;N[d+76>>2]=l;N[d+72>>2]=i;N[d+68>>2]=f;J[c>>2]=d+96}function gi(){var a=0,b=0;a:{a=J[263679];if(!a){break a}b=J[a+4>>2];if(b&1){dc(J[a+12>>2],1,0,1054632);b=J[a+4>>2]&-2;J[a+4>>2]=b}if(!(!(b&2)|!(K[a|0]&4))){cc(J[a+16>>2],Q(N[263674]),Q(N[263675]));b=J[a+4>>2]&-3;J[a+4>>2]=b}if(!(!(b&4)|!(K[a|0]&24))){b=J[263625];bc(J[a+20>>2],Q(Q(Q(b&255)/Q(255))),Q(Q(Q(b>>>8&255)/Q(255))),Q(Q(Q(b>>>16&255)/Q(255))));b=J[a+4>>2]&-5;J[a+4>>2]=b}if(!(!(b&8)|!(K[a|0]&8))){Ia(J[a+24>>2],Q(Q(Q(1)/N[12441])));b=J[a+4>>2]&-9;J[a+4>>2]=b}if(!(b&16)|!(K[a|0]&16)){break a}Ia(J[a+28>>2],Q(Q(-N[12440])));J[a+4>>2]=J[a+4>>2]&-17}}function vH(a){a=a|0;var b=0,c=Q(0),d=0,e=Q(0),f=0,g=0,h=0;md(a+72|0,1,1,0,-31);md(a+144|0,1,1,0,17);c=Q(N[467293]*Q(200));a:{if(Q(R(c))<Q(2147483648)){b=~~c;break a}b=-2147483648}c=N[467294];J[a+64>>2]=b;g=a,h=mf(1,0,b,J[467303]),J[g+56>>2]=h;e=Q(N[467294]*Q(4));b:{if(Q(R(e))<Q(2147483648)){b=~~e;break b}b=-2147483648}J[a+68>>2]=b;c=Q(c*Q(34));c:{if(Q(R(c))<Q(2147483648)){d=~~c;break c}d=-2147483648}g=a,h=mf(1,d,b,J[467304]),J[g+60>>2]=h;b=J[a+52>>2];g=a,h=Ge(J[467304],64),J[g+52>>2]=h;f=oe(a);d=J[a+52>>2];J[a+8>>2]=f+(d<<2);if((b|0)!=(d|0)){Zd(a)}}function fp(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0;c=L[a+4>>1];b=0;a:{if(c>>>0<2){break a}e=J[a>>2];a=K[e+1|0];f=(a-65&255)>>>0<26?a+32|0:a;b=0;if((c|0)==2){break a}b=K[e+2|0]}a=f&255;e=(a|0)!=110;c=(b-65&255)>>>0<26?b+32|0:b;b=c&255;g=!e&(b|0)==119;h=!e;e=(b|0)==101;b:{if(g|h&e|(e|(b|0)==119)&(a|0)==115){break b}if(!((a|0)!=117&(a|0)!=100)){d=1;if(!(c&255)){break b}}d=2;a=f&255;b=c&255;f=!b;c=(a|0)!=119;if((a|0)==110&f|!(f?c&((a|0)!=115&(a|0)!=101):1)){break b}d=c?-1:(b|0)==101?3:-1;d=(a|0)==117?(b|0)==100?3:d:d;d=(a|0)==110?(b|0)==115?3:d:d}return d}function wd(a,b){var c=0,d=0,e=0,f=0,g=Q(0),h=0,i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=0,o=0,p=0,q=0;q=K[b+5|0];g=N[b+12>>2];p=L[b>>1];h=K[b+6|0];n=p+h|0;o=K[b+4|0];e=n+o|0;f=L[b+2>>1];c=f+h|0;d=J[273222];i=N[b+8>>2];j=N[b+20>>2];k=N[b+28>>2];l=N[b+16>>2];m=N[b+24>>2];ah(d,i,j,k,l,m,e,f,n,c);ah(d,j,i,k,l,g,e,f,e+o|0,c);f=c+q|0;$g(d,i,j,g,m,l,e,c,n,f);h=e+h|0;$g(d,j,i,g,m,k,h+o|0,c,h,f);Qh(d,l,k,g,m,j,n,c,p,f);Qh(d,k,l,g,m,i,h,c,e,f);c=L[d+36>>1];e=J[b+36>>2];d=J[b+32>>2];g=N[b+40>>2];I[a+2>>1]=24;N[a+12>>2]=g;J[a+4>>2]=d;J[a+8>>2]=e;I[a>>1]=c-24}function kD(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;b=d;d=a-1|0;b=b+(d<<2)|0;d=P(d,3)+c|0;a:{if((a|0)<=3){c=a;break a}while(1){J[b>>2]=K[d|0]|K[d+1|0]<<8|K[d+2|0]<<16|-16777216;c=d-3|0;J[b-4>>2]=K[c|0]|K[c+1|0]<<8|K[d-1|0]<<16|-16777216;c=d-6|0;J[b-8>>2]=K[c|0]|K[c+1|0]<<8|K[d-4|0]<<16|-16777216;c=d-9|0;J[b-12>>2]=K[c|0]|K[c+1|0]<<8|K[d-7|0]<<16|-16777216;d=d-12|0;b=b-16|0;e=a>>>0>7;c=a-4|0;a=c;if(e){continue}break}}if((c|0)>0){while(1){J[b>>2]=K[d|0]|K[d+1|0]<<8|K[d+2|0]<<16|-16777216;d=d-3|0;b=b-4|0;a=c>>>0>1;c=c-1|0;if(a){continue}break}}}function aJ(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0;c=$c-16|0;$c=c;J[c+12>>2]=a;d=ot(c+12|0,K[53001]>1);a=J[c+12>>2];e=H[a+5|0];f=H[a+4|0];g=H[a+3|0];h=H[a|0];i=H[a+1|0];b=P(d,12)+66896|0;N[b+18440>>2]=Q(H[a+2|0])*Q(.0625);N[b+18436>>2]=Q(i|0)*Q(.0625);N[b+18432>>2]=Q(h|0)*Q(.0625);N[b+27648>>2]=Q(g|0)*Q(.0625);N[b+27652>>2]=Q(f|0)*Q(.0625);N[b+27656>>2]=Q(e|0)*Q(.0625);H[d+80720|0]=K[a+6|0];b=(d<<2)+66896|0;e=K[a+7|0];N[b+5376>>2]=e?Q(Q(e+1|0)*Q(.0078125)):Q(0);J[b+2304>>2]=K[a+8|0]|K[a+9|0]<<8|K[a+10|0]<<16|-16777216;zj(d,0);$c=c+16|0}function MH(a,b){a=a|0;b=Q(b);var c=0,d=0;if(K[a+2837|0]){H[a+2837|0]=0;c=a+48|0;if(K[1054197]){Bm(c,J[a+108>>2]);Sg(c,1);return}Vr(c,L[(J[266937]+J[266938]<<1)+1066048>>1],0);d=-1;a:{if(!K[775856]){break a}d=-1;if(J[a+108>>2]!=-1){break a}Vr(c,L[(J[266937]+J[266938]<<1)+1066048>>1],1);d=L[(J[266937]+J[266938]<<1)+1066048>>1]}if(J[a+108>>2]==-1){Vs(L[(J[266937]+J[266938]<<1)+1066048>>1]);return}a=d;if(J[c+40>>2]){d=J[c+60>>2];J[c+56>>2]=d;b:{if((a|0)>=0){break b}if((d|0)==-1){a=0;break b}a=L[((d<<1)+c|0)+92>>1]}bd[J[c+1748>>2]](a&65535)}}}function $D(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0;if(!(bd[J[J[a+1628>>2]+32>>2]](a+1628|0,b,c,d)|J[a+1720>>2]==(c|0)&J[a+1724>>2]==(d|0))){J[a+1724>>2]=d;J[a+1720>>2]=c;J[a+60>>2]=-1;h=J[a+64>>2];e=J[a+68>>2];a:{if(!$f(J[a+4>>2],J[a+8>>2]+3|0,J[a+12>>2],P(e,J[a+52>>2])-6|0,c,d)|J[a+40>>2]<=0){break a}b=0;while(1){f=J[a+44>>2];g=(b|0)/(f|0)|0;if($f(J[a+4>>2]+P(J[a+64>>2],b-P(g,f)|0)|0,(J[a+8>>2]+P(J[a+68>>2],g-J[a+1668>>2]|0)|0)+3|0,h,e,c,d)){J[a+60>>2]=b;break a}b=b+1|0;if((b|0)<J[a+40>>2]){continue}break}}Sg(a,0)}return 1}function vm(a,b,c,d){var e=0,f=0,g=0,h=0;e=$c-16|0;$c=e;f=a?b:0;b=a?c:0;xm(f,b,a?d:0);I[929646]=0;J[464804]=a;if(!J[464806]){J[464804]=0;a=0}if(!J[464805]){J[464818]=255;J[464805]=a}if(J[464849]==-1){J[464849]=(b|0)/2}if(J[464851]==-1){J[464851]=b+2}th(e+8|0);if(L[24860]){a=0;while(1){zd(e+8|0,H[J[12429]+a|0]+3|0);a=a+1|0;if(a>>>0<L[24860]){continue}break}}a=0;while(1){g=a+1859256|0,h=zd(e+8|0,256),H[g|0]=h;a=a+1|0;if((a|0)!=16){continue}break}H[1859262]=K[1859262]&15|64;H[1859264]=K[1859264]&63|128;H[1859276]=1;Nd(1045796);$c=e+16|0}function ep(a,b,c,d){var e=0,f=0;a:{if(K[1054440]?c&4:0){break a}if(ni(J[a+4>>2])){if(ni(J[a+8>>2])){break a}}Yd(4820)}b:{if(K[1054308]){break b}if(!hl(J[a+4>>2],J[a+8>>2],c)){break b}e=$c-16|0;$c=e;J[e+12>>2]=0;xc(1,e+12|0);f=J[e+12>>2];wa(3553,f|0);c=c&16?9729:9728;fa(3553,10240,c|0);c:{if(d){fa(3553,10241,9986);if(!K[1054473]){break c}fa(3553,33085,bp(J[a+4>>2],J[a+8>>2])|0);break c}fa(3553,10241,c|0)}d:{if(J[a+4>>2]==(b|0)){sa(3553,0,6408,b|0,J[a+8>>2],0,6408,5121,J[a>>2]);break d}dp(0,a,b,1)}if(d){cp(0,a,b,0)}$c=e+16|0}return f}function qg(a,b,c,d,e,f){var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;j=b&15;k=d&15;l=c&15;m=j|(k<<4|l<<8);g=J[263406];b=b>>4;d=d>>4;i=c>>4;h=b+P(J[464824],d+P(i,J[464826])|0)<<2;c=J[g+h>>2];if(!c){c=Lj(4096,1);g=J[263406];J[h+g>>2]=c}n=c+m|0;c=K[n|0];e=((e|0)!=0)<<2;H[n|0]=c&(15<<e^-1);g=g+h|0;h=J[g>>2]+m|0;H[h|0]=K[h|0]|a<<e;a:{if(!f|(c|0)==K[J[g>>2]+m|0]){break a}b:{if((j|0)==15){a=1}else{if(j){break b}a=-1}Jf(a+b|0,i,d)}c:{if((l|0)==15){a=1}else{if(l){break c}a=-1}Jf(b,a+i|0,d)}if((k|0)==15){a=1}else{if(k){break a}a=-1}Jf(b,i,a+d|0)}}function Qk(a,b,c,d){var e=0,f=0,g=0,h=0,i=0;c=P(J[464807],P(J[464809],b)+c|0)+a|0;a:{if(J[464818]>=256){a=-10;e=65526;if((b|0)<0){break a}h=J[464813];i=J[464805];f=J[464804];while(1){g=K[c+f|0]|K[c+i|0]<<8;if(K[g+67664|0]){e=b-(K[g+79952|0]>>>6&1)|0;a=e;break a}c=c-h|0;g=(b|0)>0;b=b-1|0;if(g){continue}break}break a}a=-10;e=65526;if((b|0)<0){break a}h=J[464813];i=J[464804];while(1){f=K[c+i|0];if(K[f+67664|0]){e=b-(K[f+79952|0]>>>6&1)|0;a=e;break a}c=c-h|0;f=(b|0)>0;b=b-1|0;if(f){continue}break}}I[J[266950]+(d<<1)>>1]=e;return a}function yw(a){a=a|0;var b=0;J[a+104>>2]=0;b=rd(a,9830,313,314,0,0)<<5;J[b+1074108>>2]=450;J[b+1074104>>2]=451;b=rd(a,9467,313,314,0,0)<<5;J[b+1074108>>2]=452;J[b+1074104>>2]=453;b=rd(a,4076,313,314,0,0)<<5;J[b+1074108>>2]=454;J[b+1074104>>2]=455;b=rd(a,1367,313,314,0,0)<<5;J[b+1074108>>2]=456;J[b+1074104>>2]=457;b=rd(a,5617,313,314,0,0)<<5;J[b+1074108>>2]=458;J[b+1074104>>2]=459;b=rd(a,2680,313,314,0,0)<<5;J[b+1074108>>2]=460;J[b+1074104>>2]=461;b=rd(a,4699,313,314,0,0)<<5;J[b+1074108>>2]=462;J[b+1074104>>2]=463;Zf(a,-1,464)}function If(a){var b=0,c=0,d=0,e=0,f=0,g=Q(0),h=Q(0),i=0,j=0,k=0,l=0;c=J[273222];f=J[c+36>>2];d=L[a+2>>1];if(d){g=N[273218];h=N[273217];b=J[273224]+P(f,24)|0;a=J[c+4>>2]+(L[a>>1]<<4)|0;while(1){i=L[a+12>>1];j=L[a+14>>1];k=J[a+4>>2];l=J[a>>2];N[b+8>>2]=N[a+8>>2];J[b>>2]=l;J[b+4>>2]=k;J[b+12>>2]=J[(e&-4)+1092844>>2];N[b+20>>2]=Q(Q(j&32767)*g)+Q(g*Q(Q(j>>>15|0)*Q(-.009999999776482582)));N[b+16>>2]=Q(Q(i&32767)*h)+Q(h*Q(Q(i>>>15|0)*Q(-.009999999776482582)));b=b+24|0;a=a+16|0;e=e+1|0;if((d|0)!=(e|0)){continue}break}}J[c+36>>2]=f+d}function Xf(a,b){var c=0,d=0,e=0,f=0,g=0;g=J[273222];c=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=c;c=J[b+12>>2];J[a+8>>2]=J[b+8>>2];J[a+12>>2]=c;N[a+4>>2]=N[a+4>>2]*Q(.5);N[a+8>>2]=N[a+8>>2]*Q(.5);N[a+12>>2]=N[a+12>>2]*Q(.5);if(L[b+2>>1]){d=J[g+4>>2];c=L[b>>1];while(1){e=c<<4;d=e+d|0;a=e+J[12931]|0;f=J[a+4>>2];J[d>>2]=J[a>>2];J[d+4>>2]=f;f=J[a+12>>2];J[d+8>>2]=J[a+8>>2];J[d+12>>2]=f;d=J[g+4>>2];a=e+d|0;N[a+8>>2]=N[a+8>>2]*Q(.5);N[a+4>>2]=N[a+4>>2]*Q(.5);N[a>>2]=N[a>>2]*Q(.5);c=c+1|0;if(c>>>0<L[b+2>>1]+L[b>>1]>>>0){continue}break}}}function nk(a,b,c,d,e,f){var g=Q(0),h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=0,n=0,o=Q(0),p=Q(0),q=0;J[e>>2]=0;J[f>>2]=0;h=N[b>>2];m=h>=Q(0);g=N[b+4>>2];n=g>=Q(0);i=N[a+4>>2];l=Q(g*Q(N[(n?d:c)+4>>2]-i));k=N[c>>2];o=N[d>>2];p=N[a>>2];j=Q(h*Q((m?k:o)-p));a:{if(l<j){break a}g=Q(g*Q(N[(n?c:d)+4>>2]-i));h=Q(h*Q((m?o:k)-p));if(g>h){break a}i=N[b+8>>2];b=i>=Q(0);g=g>j?g:j;k=N[a+8>>2];j=Q(i*Q(N[(b?d:c)+8>>2]-k));if(g>j){break a}i=Q(i*Q(N[(b?c:d)+8>>2]-k));h=h>l?l:h;if(i>h){break a}g=g<i?i:g;N[e>>2]=g;N[f>>2]=h>j?j:h;q=g>=Q(0)}return q}function KI(a,b){a=a|0;b=Q(b);var c=Q(0),d=0,e=Q(0),f=0,g=0;a:{b:{if(K[1056204]|K[1056205]|(K[1056202]|K[1056203])){break b}if(K[1056200]|K[1056201]){break b}d=1;if(bd[J[J[203292]+40>>2]](b)|0){break a}}d=0;if(!K[1065592]){break a}f=J[207101];if(!K[f+470|0]|!K[f+472|0]){break a}e=Q(J[203295]);c=N[12837];c=Q((c==Q(-1)?Q(J[203296]):c)+Q(b*Q(-5)));c=c<Q(1)?Q(1):c;e=c>e?e:c;N[12837]=e;if(Q(R(e))<Q(2147483648)){d=~~e}else{d=-2147483648}J[203296]=d;uk(d);d=1}if(!(!K[1067756]|d)){g=bd[J[J[a+332>>2]+20>>2]](a+332|0,b)|0}return g|0}function yI(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,i=0;b=$c-288|0;$c=b;a:{if(!K[1793892]){break a}J[b+284>>2]=16777216;J[b+280>>2]=b+16;g=J[a+56>>2];if((g|0)<=0){break a}while(1){b:{e=(P(f,28)+a|0)+1176|0;c:{if(!J[e>>2]){break c}h=(f<<1)+a|0;if(L[h+152>>1]==65535){break c}if($f(I[e+4>>1],I[e+6>>1],L[e+8>>1],L[e+10>>1],c,d)){break b}g=J[a+56>>2]}f=f+1|0;if((g|0)>(f|0)){continue}break a}break}i=1;a=b+8|0;$d(a,829176,L[(L[h+152>>1]<<1)+828408>>1]-3|0);c=b+280|0;Hd(c,28385,a);Ih(1793960,c)}$c=b+288|0;return i|0}function iA(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;e=$c-1248|0;$c=e;f=J[464807];d=(a|0)/(f|0)|0;c=J[464809];b=(d|0)/(c|0)|0;c=d-P(b,c)|0;d=a-P(d,f)|0;a:{if((b|0)<=0){re(d,b,c,0);break a}a=K[J[464804]+(a-J[464813]|0)|0];if((a|0)==3){break a}re(d,b,c,0);if((a|0)!=2){break a}if(!(bd[J[266957]](d,b,c)|0)){break a}a=zd(780024,3)+5|0;if(!mp(d,b,c,a)){break a}c=lp(d,b,c,a,e+96|0,e);if((c|0)<=0){break a}a=0;while(1){b=(e+96|0)+P(a,12)|0;re(J[b>>2],J[b+4>>2],J[b+8>>2],K[a+e|0]);a=a+1|0;if((c|0)!=(a|0)){continue}break}}$c=e+1248|0}function SH(a){a=a|0;var b=0,c=Q(0),d=0,e=0,f=Q(0);if(Ys(a)){Xs(a)}md(a+304|0,2,0,0,0);b=a+396|0;md(b,2,2,0,0);e=1778160,f=oj(),N[e>>2]=f;bd[J[J[444511]+8>>2]](1778044);c=Q(N[467294]*Q(15));a:{if(Q(R(c))<Q(2147483648)){d=~~c;break a}d=-2147483648}J[a+424>>2]=d+J[444515];bd[J[J[a+396>>2]+8>>2]](b);b=a+88|0;md(b,1,1,0,0);J[a+116>>2]=J[467304]/-4;bd[J[J[a+88>>2]+8>>2]](b);b=a+160|0;md(b,1,1,0,0);J[a+188>>2]=J[467304]/-16;bd[J[J[a+160>>2]+8>>2]](b);b=a+232|0;md(b,1,1,0,0);J[a+260>>2]=J[467304]/20;bd[J[J[a+232>>2]+8>>2]](b)}function BD(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0;b=$c-16|0;$c=b;e=d-J[a+8>>2]|0;g=c-J[a+4>>2]|0;c=0;d=0;a:{b:{while(1){f=J[(P(d,28)+a|0)+104>>2];if($f(c,0,f,J[a+92>>2],g,e)){break b}c=c+f|0;d=d+1|0;if((d|0)!=5){continue}break}f=J[a+48>>2];c=P(f,28)+a|0;d=J[c+100>>2];e=P(d,P(J[c+96>>2],(e-J[a+92>>2]|0)/J[a+44>>2]|0)+((g|0)/J[a+40>>2]|0)|0);if((e|0)>=L[c+120>>1]){break a}c=J[c+116>>2];I[b+14>>1]=0;I[b+12>>1]=d;J[b+8>>2]=c+e;if(!f){I[b+12>>1]=2}Ih(J[a+56>>2],b+8|0);break a}J[a+48>>2]=d;Qj(a)}$c=b+16|0;return 1}function Ap(a,b,c,d,e){var f=0,g=0,h=0,i=0;f=$c-256|0;$c=f;f=Gd(f,0,256);H[f+1|0]=114;H[f|0]=b;b=Fe(c);H[f+3|0]=b;H[f+2|0]=0;Kd(f|4,c,b);c=b+f|0;H[c+14|0]=d;H[c+12|0]=2;H[c+13|0]=0;b=ce(a,f,b+15|0);a:{if(b){break a}if((d|0)>0){i=f|3;while(1){c=P(h,12)+e|0;H[f|0]=K[c|0];g=J[c+4>>2];b=Fe(g);H[f+2|0]=b;H[f+1|0]=0;Kd(i,g,b);if(K[c|0]==91){c=b+f|0;H[c+3|0]=116;g=Fe(19119);H[c+5|0]=g;H[c+4|0]=0;Kd(c+6|0,19119,g);b=b+5|0}b=ce(a,f,b+3|0);if(b){break a}h=h+1|0;if((h|0)!=(d|0)){continue}break}}b=ce(a,33156,2)}$c=f+256|0;return b}function jf(a,b){var c=0,d=0;c=J[a+20>>2];a:{if(!c){J[a+16>>2]=4096;J[a+20>>2]=256;J[a+8>>2]=0;J[a+12>>2]=0;J[a+4>>2]=a+4120;J[a>>2]=a+24;if(J[a+5144>>2]){break a}J[a+5144>>2]=9;J[a+5148>>2]=511;break a}if((c|0)!=J[a+8>>2]){break a}_j(a+4|0,a+20|0,4,256,512)}c=L[b+4>>1];if((c|0)>J[a+5148>>2]){Yd(7479);c=L[b+4>>1]}d=J[a+12>>2];if(J[a+16>>2]<=(d+c|0)){_j(a,a+16|0,1,4096,8192);c=L[b+4>>1]}Kd(J[a>>2]+d|0,J[b>>2],c);b=L[b+4>>1];J[J[a+4>>2]+(J[a+8>>2]<<2)>>2]=b|d<<J[a+5144>>2];J[a+8>>2]=J[a+8>>2]+1;J[a+12>>2]=b+J[a+12>>2]}function on(a,b){var c=0,d=0,e=0,f=0,g=0;c=$c-32|0;$c=c;d=L[a+4>>1];a:{if(d>>>0<6){break a}a=J[a>>2];e=K[a|0];if(((e|0)!=35|d>>>0>7)&(d|0)!=6){break a}f=a+((e|0)==35)|0;d=0;b:{while(1){c:{e=H[d+f|0];a=e-48|0;if((a&255)>>>0>9){if((e-97&255)>>>0<=5){a=e-87|0}else{a=(e-65&255)>>>0>=6?-1:e-55|0}}J[(d<<2)+c>>2]=a;if((a|0)==-1){break c}a=1;d=d+1|0;if((d|0)!=6){continue}break b}break}a=0}if(!a){break a}H[b|0]=J[c+4>>2]|J[c>>2]<<4;H[b+1|0]=J[c+12>>2]|J[c+8>>2]<<4;H[b+2|0]=J[c+20>>2]|J[c+16>>2]<<4;g=1}$c=c+32|0;return g}function CJ(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0;b=$c-32|0;$c=b;f=b,g=vd(a+65|0)<<16>>16,J[f+20>>2]=g;f=b,g=vd(a+67|0)<<16>>16,J[f+24>>2]=g;f=b,g=vd(a+69|0)<<16>>16,J[f+28>>2]=g;f=b,g=vd(a+71|0)<<16>>16,J[f+8>>2]=g;f=b,g=vd(a+73|0)<<16>>16,J[f+12>>2]=g;f=b,g=vd(a+75|0)<<16>>16,J[f+16>>2]=g;d=K[a|0];c=K[a+78|0]|K[a+80|0]<<8|K[a+82|0]<<16|K[a+84|0]<<24;a=$c-48|0;$c=a;e=a+12|0;Bi(e,b+20|0);Bi(a+24|0,b+8|0);J[a+36>>2]=c;Os(d);c=J[452740];Qd(P(c,36)+1801744|0,e,36);H[c+1810976|0]=d;J[452740]=c+1;$c=a+48|0;$c=b+32|0}function Lh(a,b){var c=0,d=0,e=0,f=0,g=0,h=0;if(!(J[a+8>>2]>(b|0)&(b|0)>=0)){Yd(15368)}g=J[J[a+4>>2]+(b<<2)>>2];f=g&J[a+5148>>2];e=J[a+5144>>2];c=f+(g>>>e|0)|0;d=J[a+12>>2];if(c>>>0<d>>>0){while(1){d=J[a>>2];H[d+(c-f|0)|0]=K[c+d|0];c=c+1|0;d=J[a+12>>2];if(c>>>0<d>>>0){continue}break}e=J[a+5144>>2]}c=J[a+8>>2]-1|0;if(c>>>0>b>>>0){e=f<<e;d=J[a+4>>2];while(1){h=d+(b<<2)|0;b=b+1|0;c=J[d+(b<<2)>>2];J[h>>2]=c-(c>>>0>=g>>>0?e:0);c=J[a+8>>2]-1|0;if(c>>>0>b>>>0){continue}break}d=J[a+12>>2]}J[a+8>>2]=c;J[a+12>>2]=d-f}function DJ(a){a=a|0;var b=0,c=0;c=K[a|0];b=1;b=K[a+1|0]|K[a+3|0]?b:K[a+5|0]!=0;a=K[a+2|0]|K[a+4|0]<<8|K[a+6|0]<<16|-16777216;a:{switch(c|0){case 0:rm(b?-13159:a);return;case 1:pm(b?-1:a);return;case 2:qm(b?-1:a);return;case 3:nm(b?-6579301:a);return;case 4:om(b?-1:a);return;case 5:a=b?-1:a;if((a|0)!=J[464862]){J[464862]=a;Rd(1046056,17)}return;case 6:a=b?-3740673:a;if((a|0)!=J[464871]){J[464871]=a;Rd(1046056,18)}return;case 7:a=b?-1:a;if((a|0)!=J[464872]){J[464872]=a;Rd(1046056,19)}break;default:break a}}}function Um(a,b){var c=0;a:{b:{if(a-32>>>0<=94){break b}c=a;c:{if(a>>>0<126976){break c}if((a|0)<=128511){c=9788;if((a|0)==127774){break c}c=a;if((a|0)!=127925){break c}c=9835;break c}c=a-128512|0;d:{if(c>>>0<=10){c=1<<c;if(c&11|c&1104){break d}}c=a;if((a|0)!=128578){break c}}c=9786}a=0;while(1){if((c|0)==L[(a<<1)+41760>>1]){break b}a=a+1|0;if((a|0)!=32){continue}break}a=0;while(1){if((c|0)==L[(a<<1)+41824>>1]){a=a+127|0;break b}a=a+1|0;if((a|0)!=129){continue}break}a=63;c=0;break a}c=1}H[b|0]=a;return c}function yu(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;b=$c-32|0;$c=b;J[a+28>>2]=7;J[a+16>>2]=a+904;J[a+20>>2]=0;J[a+24>>2]=-1;J[b+16>>2]=44900;xd(a,a+400|0,300,527);xd(a,a+484|0,300,528);xd(a,a+568|0,300,529);xd(a,a+652|0,300,530);xd(a,a+736|0,300,531);a:{if(K[a+48|0]){$d(b+8|0,1060400,J[a+44>>2]);c=J[b+12>>2];d=J[b+8>>2];break a}c=J[10439];d=J[10438]}J[b+8>>2]=d;J[b+12>>2]=c;Tj(a,a+100|0,500,b+8|0,b+16|0);xd(a,a+820|0,K[1054197]?400:J[467303]<300?200:400,532);J[a+392>>2]=2433;e=a,f=oe(a),J[e+8>>2]=f;$c=b+32|0}function XM(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;J[a+36>>2]=-1;J[a+28>>2]=17;J[a+20>>2]=0;J[a+16>>2]=a+1500;if(J[a+40>>2]>0){while(1){c=P(b,84)+a|0;d=c+492|0;xd(a,d,J[a+60>>2],545);J[J[a+16>>2]+(b<<2)>>2]=d;J[c+528>>2]=b;b=b+1|0;if((b|0)<J[a+40>>2]){continue}break}}pe(a,a+96|0);pe(a,a+168|0);xd(a,a+240|0,K[1054197]?400:J[467303]<300?200:400,K[1054734]?546:547);b=J[a+52>>2];if(b|J[a+56>>2]){c=a+324|0;xd(a,c,40,b);b=a+408|0;xd(a,b,40,J[a+56>>2]);le(c,!J[a+52>>2]);le(b,!J[a+56>>2])}e=a,f=oe(a),J[e+8>>2]=f}function Df(a,b,c){var d=0,e=0,f=0;e=J[a>>2];a:{b:{d=L[a+4>>1];if(d>>>0>=2){if(K[e|0]!=38){break b}f=K[e+1|0];if(M[(f<<2)+825316>>2]<16777216){break b}H[c|0]=f;e=J[a>>2]+2|0;J[a>>2]=e;d=L[a+4>>1]-2|0;I[a+4>>1]=d}if(d&65535){break b}c=0;break a}f=d&65535;d=0;while(1){c=d;d=d+1|0;if(!(K[e+c|0]!=38|f>>>0<=d>>>0)){if(M[(K[d+e|0]<<2)+825316>>2]>16777215){break a}}if((d|0)!=(f|0)){continue}break}c=f}I[b+4>>1]=c;J[b>>2]=e;J[a>>2]=J[a>>2]+c;d=a;a=L[a+4>>1];I[d+4>>1]=a-c;return L[b+4>>1]!=0|(a|0)!=(c&65535)}function qt(){var a=0,b=0,c=0,d=0,e=0,f=0;a=$c-96|0;$c=a;if(!J[444427]){c=K[1054199];H[a+16|0]=16;b=a+16|0;e=b|1;Qi(e,1811788);f=a+81|0;fe(f,c?41:38);bd[J[452942]](b,67);c=0;while(1){b=J[(c<<2)+40576>>2];Wd(a+16|0,J[b>>2]);d=J[a+20>>2];J[a+8>>2]=J[a+16>>2];J[a+12>>2]=d;d=K[b+5|0];if(!d){d=K[b+4|0]}a:{if(!K[1054199]){b=a+8|0;if(ld(b,2467)){break a}if(ld(b,4752)){break a}if(ld(b,5262)){break a}}H[a+16|0]=17;Qi(e,a+8|0);Gf(f,d);bd[J[452942]](a+16|0,69)}c=c+1|0;if((c|0)!=41){continue}break}}$c=a+96|0}function UG(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;e=$c-16|0;$c=e;a:{if(K[1811801]|!b){break a}h=J[11488];i=J[11487];while(1){c=cr(J[13312],a,b,e+12|0);g=(c|0)!=0;b:{c:{d:{if(!c){f=d;break d}f=d;if((d|0)>999){break d}while(1){if((c|0)!=(i|0)&(c|0)!=(h|0)){break c}c=cr(J[13312],a,b,e+12|0);g=(c|0)!=0;f=d+1|0;if(!c){break d}j=(d|0)<999;d=f;if(j){continue}break}}if(g){break c}c=J[e+12>>2];if(c){break b}c=-857812989}J[458135]=c;break a}a=a+c|0;d=f;b=b-c|0;if(b){continue}break}}$c=e+16|0}function bt(a,b){var c=0,d=0,e=0,f=0,g=0;Cd((P(b,28)+a|0)+1176|0);c=J[a+56>>2]-1|0;if((c|0)>(b|0)){g=a+152|0;while(1){c=b+1|0;I[(b<<1)+g>>1]=L[(c<<1)+g>>1];b=P(b,28)+a|0;J[b+1200>>2]=J[b+1228>>2];e=b+1220|0;f=J[e+4>>2];d=b+1192|0;J[d>>2]=J[e>>2];J[d+4>>2]=f;e=b+1212|0;f=J[e+4>>2];d=b+1184|0;J[d>>2]=J[e>>2];J[d+4>>2]=f;d=b+1176|0;b=b+1204|0;e=J[b+4>>2];J[d>>2]=J[b>>2];J[d+4>>2]=e;b=c;c=J[a+56>>2]-1|0;if((b|0)<(c|0)){continue}break}}J[a+56>>2]=c;I[((c<<1)+a|0)+152>>1]=0;J[(P(c,28)+a|0)+1176>>2]=0}function jm(){var a=0,b=0,c=0,d=0,e=0;a=$c-752|0;$c=a;a:{if(!J[466468]|J[465684]>5){break a}J[a+604>>2]=8388608;J[a+600>>2]=a+608;c=J[466470];Ee(a,c,128);b:{while(1){d=b<<3;if(_e(a,d+45872|0)){e=a+744|0;Qe(e,a,L[d+45876>>1]);xe(a+600|0,6254,J[(b<<2)+45920>>2],e);break b}b=b+1|0;if((b|0)!=5){continue}break}ke(a+600|0,a)}b=a+600|0;vf(6336,b);Rf(a,b);b=Qb(a|0,K[c+304|0],J[c+128>>2])|0;if(b){J[c+152>>2]=(b|0)==1?-857812898:b;jr(c);Dh(1865872,0);jm();break a}km(1862736,c,0);Dh(1865872,0)}$c=a+752|0}function pN(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0;b=$c-16|0;$c=b;J[a+28>>2]=5;J[a+20>>2]=0;J[a+16>>2]=a+684;J[b>>2]=44876;xd(a,a+60|0,400,538);xd(a,a+144|0,400,539);xd(a,a+228|0,K[1054197]?400:J[467303]<300?200:400,517);Tj(a,a+312|0,400,1859288,b);d=J[a+16>>2];g=J[d+12>>2];e=J[a+20>>2];if((e|0)>0){while(1){f=J[(c<<2)+d>>2];if(f){H[f+20|0]=0}c=c+1|0;if((e|0)!=(c|0)){continue}break}}J[a+24>>2]=3;H[g+20|0]=1;pe(a,a+612|0);J[a+372>>2]=540;J[a+604>>2]=13956;h=a,i=oe(a),J[h+8>>2]=i;$c=b+16|0}function GC(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;if((a|0)>3){while(1){J[d>>2]=K[c|0]|K[c+1|0]<<8|(K[c+2|0]<<16|K[c+3|0]<<24);J[d+4>>2]=K[c+4|0]|K[c+5|0]<<8|(K[c+6|0]<<16|K[c+7|0]<<24);J[d+8>>2]=K[c+8|0]|K[c+9|0]<<8|(K[c+10|0]<<16|K[c+11|0]<<24);J[d+12>>2]=K[c+12|0]|K[c+13|0]<<8|(K[c+14|0]<<16|K[c+15|0]<<24);c=c+16|0;d=d+16|0;b=a>>>0>7;a=a-4|0;if(b){continue}break}}if((a|0)>0){while(1){J[d>>2]=K[c|0]|K[c+1|0]<<8|(K[c+2|0]<<16|K[c+3|0]<<24);c=c+4|0;d=d+4|0;b=a>>>0>1;a=a-1|0;if(b){continue}break}}}function HC(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;b=d;d=a-1|0;b=b+(d<<2)|0;d=(d<<1)+c|0;a:{if((a|0)<=3){c=a;break a}while(1){c=K[d|0];J[b>>2]=c<<16|c<<8|K[d+1|0]<<24|c;c=K[d-2|0];J[b-4>>2]=c<<16|c<<8|K[d-1|0]<<24|c;c=K[d-4|0];J[b-8>>2]=c<<16|c<<8|K[d-3|0]<<24|c;c=K[d-6|0];J[b-12>>2]=c<<16|c<<8|K[d-5|0]<<24|c;d=d-8|0;b=b-16|0;e=a>>>0>7;c=a-4|0;a=c;if(e){continue}break}}if((c|0)>0){while(1){a=K[d|0];J[b>>2]=a<<16|a<<8|K[d+1|0]<<24|a;d=d-2|0;b=b-4|0;a=c>>>0>1;c=c-1|0;if(a){continue}break}}}function zj(a,b){var c=0,d=0,e=0,f=0,g=0;f=$c-16|0;$c=f;tg(f+8|0,a);c=K[a+75344|0];a:{if((a|0)==51){d=7;if(!c){break a}}if((a|0)==60){d=3;if((c|0)==2){break a}}e=a&65534;if((e|0)==8){d=5;if((c|0)==1){break a}}d=(e|0)==10?(c|0)==1?6:c:c}e=d;c=a+66896|0;g=c+16128|0;if(J[(a<<2)+69200>>2]!=-16777216){d=(Zg(f+8|0,0,35)|0)>=0}else{d=0}H[g|0]=d;Pp(a,e&255);Mp(a,K[c+13824|0]);Fl(a);Jp(a);Dp(a);uo(a);e=(a>>>3&8188)+726608|0;J[e>>2]=J[e>>2]|1<<a;Nd(1045016);if(!(!b|K[c+13824|0]!=5)){uj(a)}$c=f+16|0}function Sl(a,b,c,d,e){var f=0,g=0,h=0,i=0,j=0,k=0;f=$c-96|0;$c=f;J[f+68>>2]=4194304;J[f+64>>2]=f;Xg(f- -64|0,b);b=(a<<1)+828408|0;g=L[b>>1];a:{b:{if(!g){g=1040856;break b}h=f+88|0;$d(h,829176,g-3|0);i=f+80|0;$d(i,829176,L[b>>1]-2|0);j=f+72|0;$d(j,829176,L[b>>1]-1|0);g=1041116;k=K[a+828920|0];if(!Uf(f- -64|0,h)){break b}if(!Uf(c,i)){break b}if(!Uf(d,j)){break b}if((e|0)==(k|0)){break a}}xq(a);jf(829176,f- -64|0);jf(829176,c);jf(829176,d);I[b>>1]=J[207296];H[a+828920|0]=e;Rd(g,a)}$c=f+96|0}function MD(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0;if(!(H[a+21|0]&1)){f=J[a+4>>2];g=f<<2;e=J[a+8>>2];while(1){if(!(L[((b<<3)+a|0)+76>>1]?0:b)){a:{if(J[a+156>>2]!=(b|0)){d=J[((b<<2)+a|0)+96>>2];c=0;break a}b:{if(J[a+152>>2]==64){d=J[((b<<2)+a|0)+96>>2];break b}d=J[((b<<2)+a|0)+96>>2];c=0;if(J[a+160>>2]!=-1){break a}}c=L[a+180>>1]}d=d+c|0;c=J[467303]-g|0;uf(f,e,(K[a+145|0]<<1)+((d|0)>(c|0)?d:c)|0,J[a+108>>2],2130706432);e=J[a+108>>2]+e|0;b=b+1|0;if((b|0)!=3){continue}}break}kh(a+112|0);zr(a)}}function du(a,b,c,d,e){var f=0;e=K[e+79952|0]>>>d&1;a:{switch(d|0){case 0:if((a|0)<(e|0)){return J[464864]}return bd[J[266964]](a-e|0,b,c)|0;case 1:if((J[464810]-e|0)<(a|0)){return J[464864]}return bd[J[266964]](a+e|0,b,c)|0;case 2:if((c|0)<(e|0)){return J[464865]}return bd[J[266965]](a,b,c-e|0)|0;case 3:if((J[464812]-e|0)<(c|0)){return J[464865]}return bd[J[266965]](a,b,c+e|0)|0;case 4:return bd[J[266963]](a,b-e|0,c)|0;case 5:f=bd[J[266962]](a,b+e|0,c)|0;break;default:break a}}return f}function go(a,b,c,d,e){var f=0,g=0,h=0,i=0;a:{b:{if(J[464818]>=256){if((c|0)>(d|0)){break b}f=J[464813];g=J[464805];h=J[464804];a=a+66896|0;while(1){if(K[(K[b+h|0]|K[b+g|0]<<8)+80720|0]!=4|(K[a+13824|0]?(d|0)==(e|0):0)){break a}b=b-f|0;i=(c|0)<(d|0);d=d-1|0;if(i){continue}break}break b}if((c|0)>(d|0)){break b}f=J[464813];g=J[464804];a=a+66896|0;while(1){if(K[K[b+g|0]+80720|0]!=4|(K[a+13824|0]?(d|0)==(e|0):0)){break a}b=b-f|0;h=(c|0)<(d|0);d=d-1|0;if(h){continue}break}}return 0}return 1}function Xp(a,b,c,d){var e=0,f=0,g=0,h=0;c=P(J[464807],P(J[464809],b)+c|0)+a|0;a:{b:{c:{if(J[464818]>=256){a=65535;if((b|0)<0){break c}e=J[464813];f=J[464805];g=J[464804];while(1){if((K[(K[c+g|0]|K[c+f|0]<<8)+80720|0]&254)!=4){break b}c=c-e|0;h=(b|0)>0;b=b-1|0;if(h){continue}break}break c}a=65535;if((b|0)<0){break c}e=J[464813];f=J[464804];while(1){if((K[K[c+f|0]+80720|0]&254)!=4){break b}c=c-e|0;g=(b|0)>0;b=b-1|0;if(g){continue}break}}b=-1;break a}a=b}I[J[260066]+(d<<1)>>1]=a;return b}function qf(a){var b=0,c=0,d=0;if(!a){if(J[13642]){b=qf(J[13642])}if(J[13604]){b=qf(J[13604])|b}a=J[467461];if(a){while(1){if(J[a+20>>2]!=J[a+28>>2]){b=qf(a)|b}a=J[a+56>>2];if(a){continue}break}}return b}d=J[a+76>>2]<0;a:{b:{if(J[a+20>>2]==J[a+28>>2]){break b}bd[J[a+36>>2]](a,0,0)|0;if(J[a+20>>2]){break b}b=-1;break a}b=J[a+8>>2];c=J[a+4>>2];if((b|0)!=(c|0)){b=c-b|0;bd[J[a+40>>2]](a,b,b>>31,1)|0}b=0;J[a+28>>2]=0;J[a+16>>2]=0;J[a+20>>2]=0;J[a+4>>2]=0;J[a+8>>2]=0;if(d){break a}}return b}function dp(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;i=$c-16384|0;$c=i;f=i;e=J[b+4>>2];g=J[b+8>>2];j=P(e,g);if((j|0)>=4097){f=Ye(j,4,7828);g=J[b+8>>2];e=J[b+4>>2]}h=J[b>>2];k=c<<2;c=e<<2;a:{if((k|0)!=(c|0)){if((g|0)<=0){break a}e=f;while(1){Kd(e,h,c);e=c+e|0;h=h+k|0;l=l+1|0;if((l|0)!=(g|0)){continue}break}break a}Kd(f,h,P(c,g))}c=J[b+8>>2];b=J[b+4>>2];b:{if(d){sa(3553,0,6408,b|0,c|0,0,6408,5121,f|0);break b}va(3553,0,0,a|0,b|0,c|0,6408,5121,f|0)}if((j|0)>=4097){qd(f)}$c=i+16384|0}function Pe(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;J[b>>2]=0;e=L[a+4>>1];a:{if(!e){break a}f=J[a>>2];g=K[f|0];a=(g|0)==43|(g|0)==45;b:{if(a>>>0<e>>>0){while(1){c=K[a+f|0];if((c&253)!=44){if((c-58&255)>>>0<246){break a}h=h*10+ +((c<<24>>24)-48|0);a=a+1|0;if((e|0)!=(a|0)){continue}break b}break}a=a+1|0}if((a|0)>=(e|0)){break b}d=10;while(1){c=K[a+f|0]-48|0;if((c&255)>>>0>9){break a}i=i+ +(c|0)/d;d=d*10;a=a+1|0;if((e|0)!=(a|0)){continue}break}}d=h+i;N[b>>2]=(g|0)==45?-d:d;j=1}return j}function fn(a,b,c){var d=0,e=0,f=0,g=0,h=0;d=$c-32|0;$c=d;a:{if(K[52841]){e=ud(a);f=ud(a+4|0);g=12;h=ud(a+8|0);break a}e=vd(a);f=vd(a+2|0)<<16>>16;e=e<<16>>16;g=6;h=vd(a+4|0)<<16>>16}N[d+8>>2]=Q(h|0)*Q(.03125);N[d>>2]=Q(e|0)*Q(.03125);H[d+28|0]=c;e=(b|0)==255;N[d+4>>2]=Q((c&64?0:e?-29:-51)+f|0)*Q(.03125);a=a+g|0;N[d+16>>2]=Q(Q(K[a|0])*Q(360))*Q(.00390625);N[d+12>>2]=Q(Q(K[a+1|0])*Q(360))*Q(.00390625);if(e){H[1687969]=1}a=J[(b<<2)+827376>>2];if(a){bd[J[J[a>>2]+8>>2]](a,d)}$c=d+32|0}function bo(a){var b=0,c=0,d=0,e=0;if(J[266966]){e=J[263512];ie(1);We(0);So(1);c=J[266967];if((c|0)>0){while(1){d=b+1073504|0;if(!(!(K[b+1072992|0]|K[d|0])|J[(b<<2)+1070944>>2]<=0)){ao(b);H[d|0]=0;c=J[266967]}b=b+1|0;if((c|0)>(b|0)){continue}break}}b=0;J[263512]=e;We(1);So(0);Z(0);c=J[266967];if((c|0)>0){while(1){if(!(!K[b+1072992|0]|J[(b<<2)+1070944>>2]<=0)){bg(b);ao(b);c=J[266967]}b=b+1|0;if((c|0)>(b|0)){continue}break}}Z(1);if(!(K[1074016]|!J[464855])){be(1);Wp(a);be(0)}We(0)}}function RI(a,b){a=a|0;b=Q(b);var c=0;a:{if(K[1054203]){break a}ie(1);Ve(J[a+12>>2]);if(K[1054742]){bd[J[J[a+48>>2]+40>>2]](a+48|0,4)|0}b:{if(K[1054197]){bd[J[J[a+120>>2]+40>>2]](a+120|0,8)|0;break b}if(!bn()|!K[1054742]){break b}bd[J[J[a+120>>2]+40>>2]](a+120|0,8)|0;de(J[a+192>>2]);he(J[a+304>>2],128)}if(Oo()){break a}Ve(J[a+12>>2]);if(!K[1054796]){bd[J[J[a+332>>2]+40>>2]](a+332|0,12)|0}if(K[1054794]){break a}c=J[263692];if(!c|H[1801724]&1){break a}de(c);Ve(J[a+12>>2]);he(4,0)}}function wG(a,b){a=a|0;b=b|0;var c=0,d=Q(0);c=$c-16|0;$c=c;a:{if((b|0)<=1){Cg(20791,1869212,1869172,1869216,1869176);break a}b:{if(De(a,c+12|0)){if(De(a+8|0,c+8|0)){break b}}pd(21904);break a}c:{a=J[c+12>>2];if((a|0)>0){b=J[c+8>>2];if((b|0)>0){break c}}pd(26300);break a}_q(a,b);d=Q(Q(J[c+12>>2])/N[467293]);d:{if(Q(R(d))<Q(2147483648)){a=~~d;break d}a=-2147483648}lf(11204,a);d=Q(Q(J[c+8>>2])/N[467294]);e:{if(Q(R(d))<Q(2147483648)){a=~~d;break e}a=-2147483648}lf(3337,a)}$c=c+16|0}function uE(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0;e=$c-16|0;$c=e;b=J[a+4>>2];f=J[a+12>>2];uf(b,J[a+8>>2],f,J[a+16>>2],-603321846);Dr(a,e+12|0,e+8|0);g=b;b=J[a+68>>2];c=g+b|0;d=J[e+12>>2]+J[a+8>>2]|0;f=f-(b<<1)|0;b=J[e+8>>2];uf(c,d,f,b,bl(c,d,f,b)&255?-595953030:-597400476);if((b|0)>=20){g=J[a+76>>2];c=g+c|0;b=d+(b>>>1|0)|0;d=f-(g<<1)|0;uf(c,b+J[a+80>>2]|0,d,J[a+72>>2],-603321846);uf(c,b+J[a+84>>2]|0,d,J[a+72>>2],-603321846);uf(c,b+J[a+88>>2]|0,d,J[a+72>>2],-603321846)}$c=e+16|0}function Pk(){var a=0;if(K[1067796]){J[266965]=172;J[266964]=173;J[266963]=174;J[266962]=175;J[266961]=175;J[266960]=176;J[266959]=173;J[266958]=175;J[266957]=177;J[266956]=178;J[266955]=179;J[266954]=180;J[266953]=181;J[266952]=182;return}a=281;if(!K[1054197]){a=Id(11870,0)?282:281}J[266965]=283;J[266964]=284;J[266963]=285;J[266962]=286;J[266961]=287;J[266960]=288;J[266959]=289;J[266958]=a;J[266957]=290;J[266956]=291;J[266955]=292;J[266954]=293;J[266953]=294;J[266952]=295}function Et(a,b){var c=Q(0),d=0,e=0,f=Q(0),g=0,h=0,i=Q(0);c=N[a+36>>2];a:{if(Q(R(c))<Q(2147483648)){d=~~c;break a}d=-2147483648}f=N[a+32>>2];b:{if(Q(R(f))<Q(2147483648)){g=~~f;break b}g=-2147483648}c=N[a+28>>2];c:{if(Q(R(c))<Q(2147483648)){e=~~c;break c}e=-2147483648}e=Dt(e,g,d);h=Bd(f);d=P(e,12)+66896|0;i=N[d+18436>>2];g=Bd(N[a+32>>2]);f=N[d+27652>>2];d=0;d:{if(bd[b|0](e)|0){break d}c=N[a+32>>2];if(!(c>=Q(i+Q(h|0)))|!(Q(f+Q(g|0))>c)){break d}d=(Ct(a+28|0,e)|0)!=0}return d}function bI(a){a=a|0;var b=0,c=Q(0),d=0,e=0;if($s(a)){_s(a)}c=Q(N[467293]*Q(5));a:{if(Q(R(c))<Q(2147483648)){b=~~c;break a}b=-2147483648}J[a+48>>2]=b;c=Q(N[467294]*Q(5));b:{if(Q(R(c))<Q(2147483648)){b=~~c;break b}b=-2147483648}J[a+52>>2]=b;b=2;md(a+72|0,0,2,5,5);md(a+856|0,0,2,5,5);md(a+672|0,0,2,10,0);md(a+764|0,0,2,10,0);_g(a);d=a+2208|0;e=a+2124|0;c:{if(K[1869222]==2){md(e,2,2,10,60);md(d,2,2,10,10);break c}md(e,2,0,10,10);md(d,2,0,10,60);b=0}md(a+2292|0,2,b,10,110)}function Xt(a){var b=Q(0),c=Q(0),d=Q(0),e=Q(0),f=Q(0),g=Q(0);b=Q(N[203291]-N[a+12>>2]);c=Q(R(b));d=Q(Q(N[a+76>>2]-N[a- -64>>2])*Q(.5));e=Q(R(Q(b-d)));b=Q(R(Q(b+d)));b=b>e?e:b;b=b>c?c:b;f=Q(b*b);b=Q(N[203289]-N[a+4>>2]);c=Q(R(b));d=Q(Q(N[a+68>>2]-N[a+56>>2])*Q(.5));e=Q(R(Q(b-d)));b=Q(R(Q(b+d)));b=b>e?e:b;b=b>c?c:b;g=Q(b*b);b=Q(Q(N[a+72>>2]-N[a+60>>2])*Q(.5));c=Q(N[203290]-Q(b+N[a+8>>2]));d=Q(R(c));e=Q(R(Q(c-b)));b=Q(R(Q(b+c)));b=b>e?e:b;b=b>d?d:b;return Q(f+Q(g+Q(b*b)))}function wk(a,b){var c=0,d=Q(0),e=0,f=0,g=0,h=Q(0);J[a+36>>2]=0;c=bd[J[J[b>>2]+12>>2]](b)|0;J[273217]=1120403456;J[273218]=1120403456;J[273211]=c;a:{if(!K[b+110|0]){f=1092848,g=ue(c,Q(.5)),J[f>>2]=g;f=1092852,g=ue(c,Q(.800000011920929)),J[f>>2]=g;e=ue(c,Q(.6000000238418579));c=J[273213];break a}J[273213]=c;J[273212]=c;e=c}J[273216]=e;J[273214]=c;J[273215]=e;d=Q(Q(N[b+20>>2]-N[b+28>>2])*Q(.01745329238474369));f=1092876,h=Md(d),N[f>>2]=h;d=Jd(d);J[273222]=a;N[273220]=d}function wg(a){var b=0,c=0;a:{b=Nq(a);b:{if(J[13625]<0){c=Pq(a,b);break b}c=Pq(a,b)}a=b;c:{if((a|0)==(c|0)){break c}a=c}if((((a|0)!=(b|0)?-1:0)|0)<0){break a}d:{if(J[13626]==10){break d}a=J[13611];if((a|0)==J[13610]){break d}J[13611]=a+1;H[a|0]=10;break a}b=$c-16|0;$c=b;H[b+15|0]=10;a=J[13610];e:{if(!a){if(Qq()){break e}a=J[13610]}c=a;a=J[13611];if(!((c|0)==(a|0)|J[13626]==10)){J[13611]=a+1;H[a|0]=10;break e}if((bd[J[13615]](54424,b+15|0,1)|0)!=1){break e}}$c=b+16|0}}function gu(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;c=$c-880|0;$c=c;d=J[a+380>>2];e=J[a+376>>2];J[c+600>>2]=e;J[c+604>>2]=d;a:{if(!(d&65535)){ee(a+612|0,13930,a+48|0);break a}J[c+876>>2]=17039360;J[c+872>>2]=c+608;d=c+872|0;e=c+600|0;Hd(d,2055,e);ke(1859288,e);Je(c,d);if(!(!(ka(c|0)|0)|J[b+80>>2])){J[b+80>>2]=29937;td(a+60|0,J[a+140>>2]?19373:12770,a+36|0);break a}if(J[a+140>>2]){J[a+140>>2]=0;td(a+60|0,12770,a+36|0)}a=c+872|0;if(fu(a)){break a}Od(6411,a);xf(2,0)}$c=c+880|0}function Rs(a){var b=0,c=0,d=0,e=0;b=$c-16|0;$c=b;c=J[206299];a:{b:{c:{if(!c){break c}while(1){Wd(b,J[c>>2]);d=J[b+4>>2];J[b+8>>2]=J[b>>2];J[b+12>>2]=d;if(fg(b+8|0,a)){break a}c=J[c+32>>2];if(c){continue}break}d=J[206299];if(!d){break c}while(1){Wd(b,J[d>>2]);c=J[b+4>>2];J[b+8>>2]=J[b>>2];J[b+12>>2]=c;d:{if(!_e(b+8|0,a)){c=e;break d}c=d;if(!e){break d}Od(26980,a);break b}e=c;d=J[d+32>>2];if(d){continue}break}if(c){break a}}Od(27042,a);pd(22590)}c=0}$c=b+16|0;return c}function oN(a,b){a=a|0;b=b|0;var c=0,d=0;b=$c-32|0;$c=b;J[b+16>>2]=37168;J[b+12>>2]=37184;c=J[a+380>>2];d=J[a+376>>2];J[b+28>>2]=541;J[b+20>>2]=d;J[b+24>>2]=c;d=$c-272|0;$c=d;c=b+12|0;if(L[c+12>>1]){J[467443]=J[c+16>>2];J[d+268>>2]=17039360;J[d+264>>2]=d;xe(d+264|0,17041,c+8|0,J[J[c>>2]>>2]);H[d+L[d+268>>1]|0]=0;c=Jc(d|0,J[c>>2],J[c+4>>2])|0}else{c=-857812980}$c=d+272|0;a:{if(!c){break a}if((c|0)==-857812980){ee(a+612|0,13930,a+48|0);break a}ej(c,11323)}$c=b+32|0}function QM(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0;J[a+28>>2]=3;J[a+20>>2]=0;J[a+16>>2]=a+600;xd(a,a+52|0,K[1055388]?200:40,549);xd(a,a+136|0,200,550);Tj(a,a+220|0,400,a+528|0,J[a+520>>2]);c=J[a+16>>2];f=J[c+8>>2];d=J[a+20>>2];if((d|0)>0){while(1){e=J[(b<<2)+c>>2];if(e){H[e+20|0]=0}b=b+1|0;if((d|0)!=(b|0)){continue}break}}J[a+24>>2]=2;H[f+20|0]=1;b=J[J[a+520>>2]>>2];a:{if((b|0)!=44804){if((b|0)!=44852){break a}b=1}else{b=3}J[a+516>>2]=b}g=a,h=oe(a),J[g+8>>2]=h}function tA(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0;a:{e=J[464813];if((e|0)>(a|0)){break a}c=a-e|0;g=J[464804];d=K[c+g|0];b:{if(d){f=-1;if((d&252)!=8){break b}}while(1){f=c;if((e|0)>(c|0)){break b}c=c-e|0;d=K[g+c|0];if(!d|(d&252)==8){continue}break}}if((f|0)==-1){break a}d=J[464807];e=(f|0)/(d|0)|0;c=J[464809];g=(e|0)/(c|0)|0;re(f-P(d,e)|0,g,e-P(c,g)|0,b);c=J[464807];f=(a|0)/(c|0)|0;b=J[464809];d=(f|0)/(b|0)|0;c=a-P(c,f)|0;b=f-P(b,d)|0;re(c,d,b,0);dh(c,d,b,a)}}function zh(a,b){var c=0,d=0,e=0;d=b&255;a:{if(d){if(a&3){while(1){c=K[a|0];if(!c|(c|0)==(d|0)){break a}a=a+1|0;if(a&3){continue}break}}c=J[a>>2];b:{if((c^-1)&c-16843009&-2139062144){break b}d=P(d,16843009);while(1){c=c^d;if((c^-1)&c-16843009&-2139062144){break b}c=J[a+4>>2];a=a+4|0;if(!(c-16843009&(c^-1)&-2139062144)){continue}break}}c=b&255;while(1){d=a;e=K[a|0];if(e){a=a+1|0;if((c|0)!=(e|0)){continue}}break}a=d;break a}a=Nq(a)+a|0}return K[a|0]==(b&255)?a:0}function Ji(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;a:{f=L[a+4>>1];if(!f){break a}h=L[b+4>>1];while(1){b:{g=0;c:{if(!h){break c}g=(e>>>0>f>>>0?e:f)+i|0;c=0;while(1){if((c|0)==(g|0)){break c}d=K[(J[a>>2]+c|0)+e|0];j=((d-65&255)>>>0<26?d+32|0:d)&255;d=K[J[b>>2]+c|0];if((j|0)!=(((d-65&255)>>>0<26?d+32|0:d)&255)){g=c;break c}c=c+1|0;if((h|0)!=(c|0)){continue}break}break b}if((g|0)!=(h|0)){i=i-1|0;e=e+1|0;if((f|0)==(e|0)){break a}continue}}break}return 1}return 0}function Ss(a,b){a=a|0;b=Q(b);var c=0,d=0,e=0,f=0,g=0,h=0;ie(1);Ve(J[a+12>>2]);d=a+144|0;e=a+72|0;if(J[a+52>>2]){bg(L[61119]>>>J[458159]|0);he(J[a+52>>2]<<2,0);c=J[a+52>>2]<<2}else{c=0}g=d,h=bd[J[J[a+72>>2]+40>>2]](e,c)|0,f=J[J[a+144>>2]+40>>2],bd[f](g|0,h|0)|0;b=N[a+48>>2];c=J[a+64>>2];uf(J[a+56>>2],J[a+60>>2],c,J[a+68>>2],-8355712);d=J[a+56>>2];e=J[a+60>>2];b=Q(b*Q(c|0));a:{if(Q(R(b))<Q(2147483648)){c=~~b;break a}c=-2147483648}uf(d,e,c,J[a+68>>2],-8323200)}function ah(a,b,c,d,e,f,g,h,i,j){var k=0,l=0,m=0,n=0,o=0;n=J[a+36>>2];k=J[a+4>>2]+(n<<4)|0;l=j;m=j|32768;j=(h|0)>(j|0);m=j?l:m;I[k+14>>1]=m;o=g|32768;l=g;g=(g|0)>(i|0);l=g?o:l;I[k+12>>1]=l;N[k+8>>2]=e;N[k+4>>2]=f;N[k>>2]=b;N[k+16>>2]=b;I[k+28>>1]=l;N[k+24>>2]=d;N[k+20>>2]=f;h=j?h|32768:h;I[k+30>>1]=h;I[k+46>>1]=h;g=g?i:i|32768;I[k+44>>1]=g;N[k+40>>2]=d;N[k+36>>2]=f;N[k+32>>2]=c;I[k+62>>1]=m;I[k+60>>1]=g;N[k+56>>2]=e;N[k+52>>2]=f;N[k+48>>2]=c;J[a+36>>2]=n+4}function Qh(a,b,c,d,e,f,g,h,i,j){var k=0,l=0,m=0,n=0,o=0;n=J[a+36>>2];k=J[a+4>>2]+(n<<4)|0;l=j;m=j|32768;j=(h|0)>(j|0);m=j?l:m;I[k+14>>1]=m;o=g|32768;l=g;g=(g|0)>(i|0);l=g?o:l;I[k+12>>1]=l;N[k+8>>2]=b;N[k+4>>2]=d;N[k>>2]=f;N[k+16>>2]=f;I[k+28>>1]=l;N[k+24>>2]=b;N[k+20>>2]=e;h=j?h|32768:h;I[k+30>>1]=h;I[k+46>>1]=h;g=g?i:i|32768;I[k+44>>1]=g;N[k+40>>2]=c;N[k+36>>2]=e;N[k+32>>2]=f;I[k+62>>1]=m;I[k+60>>1]=g;N[k+56>>2]=c;N[k+52>>2]=d;N[k+48>>2]=f;J[a+36>>2]=n+4}function $g(a,b,c,d,e,f,g,h,i,j){var k=0,l=0,m=0,n=0,o=0;n=J[a+36>>2];k=J[a+4>>2]+(n<<4)|0;l=j;m=j|32768;j=(h|0)>(j|0);m=j?l:m;I[k+14>>1]=m;o=g|32768;l=g;g=(g|0)>(i|0);l=g?o:l;I[k+12>>1]=l;N[k+8>>2]=f;N[k+4>>2]=d;N[k>>2]=b;N[k+16>>2]=b;I[k+28>>1]=l;N[k+24>>2]=f;N[k+20>>2]=e;h=j?h|32768:h;I[k+30>>1]=h;I[k+46>>1]=h;g=g?i:i|32768;I[k+44>>1]=g;N[k+40>>2]=f;N[k+36>>2]=e;N[k+32>>2]=c;I[k+62>>1]=m;I[k+60>>1]=g;N[k+56>>2]=f;N[k+52>>2]=d;N[k+48>>2]=c;J[a+36>>2]=n+4}function dt(a){var b=0,c=0,d=Q(0),e=0,f=0;b=$c-160|0;$c=b;c=J[207101];H[a+7|0]=1;a:{if(K[1054197]){ee(a+120|0,J[263551],a+36|0);break a}d=hq(c+460|0,K[c+473|0]);N[b+12>>2]=d;N[a+312>>2]=d;e=J[203294];H[a+308|0]=0;J[a+316>>2]=e;J[b+156>>2]=8388608;f=J[203295];J[b+152>>2]=b+16;if((e|0)!=(f|0)){Hd(b+152|0,28568,813176)}if(K[c+495|0]){od(b+152|0,28596)}if(d!=Q(0)){Hd(b+152|0,28582,b+12|0)}if(K[c+494|0]){od(b+152|0,28606)}Ce(a+120|0,b+152|0,a+36|0)}$c=b+160|0}function Pw(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;if(!Sh(e)){g=zk(b,c,d,e);J[203237]=g;J[J[203236]+(e<<2)>>2]=g;g=1;h=f+66896|0;b=b+1|0;a:{if(!(K[h+655872|0]&32)|(b|0)>=J[195012]){break a}while(1){e=e+1|0;if(!vn(f,e,b,c,d,5)){break a}if(Sh(e)){break a}a=a+6|0;H[a+J[195009]|0]=0;g=g+1|0;b=b+1|0;if((b|0)<J[195012]){continue}break}}a=(((K[h+13824|0]==3)<<9)+(L[P(f,12)+122202>>1]>>>J[458159]|0)<<5)+780132|0;J[a>>2]=J[a>>2]+4}return g|0}function Fw(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0;h=zk(b,c,d,e);J[203237]=h;J[J[203236]+(e<<2)>>2]=h;h=1;i=f+66896|0;d=d+1|0;a:{if(!(K[i+655872|0]&1<<g)|(d|0)>=J[195013]){break a}while(1){e=e+18|0;if(!vn(f,e,b,c,d,g)){break a}a=a+96|0;H[a+J[195009]|0]=0;h=h+1|0;d=d+1|0;if((d|0)<J[195013]){continue}break}}a=((((K[i+13824|0]==3)<<9)+(L[(P(f,6)+g<<1)+122192>>1]>>>J[458159]|0)<<5)+(g<<2)|0)+780112|0;J[a>>2]=J[a>>2]+4;return h|0}function _w(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0;h=zk(b,c,d,e);J[203237]=h;J[J[203236]+(e<<2)>>2]=h;h=1;i=f+66896|0;b=b+1|0;a:{if(!(K[i+655872|0]&1<<g)|(b|0)>=J[195012]){break a}while(1){e=e+1|0;if(!vn(f,e,b,c,d,g)){break a}a=a+6|0;H[a+J[195009]|0]=0;h=h+1|0;b=b+1|0;if((b|0)<J[195012]){continue}break}}a=((((K[i+13824|0]==3)<<9)+(L[(P(f,6)+g<<1)+122192>>1]>>>J[458159]|0)<<5)+(g<<2)|0)+780112|0;J[a>>2]=J[a>>2]+4;return h|0}function XK(a){a=a|0;var b=0,c=0,d=0,e=0;b=$c-48|0;$c=b;J[b+40>>2]=J[203291];c=J[203290];J[b+32>>2]=J[203289];J[b+36>>2]=c;bd[J[J[203292]+12>>2]](b+24|0);J[b+16>>2]=J[b+40>>2];c=J[b+36>>2];J[b+8>>2]=J[b+32>>2];J[b+12>>2]=c;c=J[b+28>>2];J[b>>2]=J[b+24>>2];J[b+4>>2]=c;c=$c-192|0;$c=c;d=c+128|0;Ai(d,N[b+4>>2]);e=c- -64|0;Em(e,N[b>>2]);ag(c,Q(-N[b+8>>2]),Q(-N[b+12>>2]),Q(-N[b+16>>2]));me(a,e,d);me(a,c,a);$c=c+192|0;if(K[1054202]){me(a,a,813084)}$c=b+48|0}function $s(a){var b=0,c=0,d=Q(0),e=0,f=0,g=0;d=Q(ei()*Q(8));a:{if(Q(R(d))<Q(2147483648)){b=~~d;break a}b=-2147483648}b=(b|0)<=8?8:b;c=b>>>0>=64?64:b;d=Q(N[467294]*Q(c|0));b:{if(Q(R(d))<Q(2147483648)){b=~~d;break b}b=-2147483648}if((b|0)!=L[a- -64>>1]){b=a+60|0;Ed(b);Pf(b,c,4);c=$c-16|0;$c=c;Ef(c,45028,b,1);e=a+72|0;J[e+40>>2]=b;f=e,g=Ne(c),J[f+140>>2]=g;f=e,g=Ng(c),J[f+108>>2]=g;Cd(e+172|0);$c=c+16|0;wi(a+672|0,b);wi(a+764|0,b);a=1}else{a=0}return a}function Dm(a,b,c,d){var e=0;d=Q(-d);e=0;a:{if(d>=Q(N[464786]+Q(Q(N[464785]*c)+Q(Q(N[464783]*a)+Q(N[464784]*b))))){break a}e=0;if(d>=Q(N[464790]+Q(Q(N[464789]*c)+Q(Q(N[464787]*a)+Q(N[464788]*b))))){break a}e=0;if(d>=Q(N[464794]+Q(Q(N[464793]*c)+Q(Q(N[464791]*a)+Q(N[464792]*b))))){break a}e=0;if(d>=Q(N[464798]+Q(Q(N[464797]*c)+Q(Q(N[464795]*a)+Q(N[464796]*b))))){break a}e=!(d>=Q(N[464802]+Q(Q(N[464801]*c)+Q(Q(N[464799]*a)+Q(N[464800]*b)))))}return e}function OC(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0;d=$c-32|0;$c=d;J[d+16>>2]=b;e=J[a+48>>2];J[d+20>>2]=c-((e|0)!=0);g=J[a+44>>2];J[d+28>>2]=e;J[d+24>>2]=g;a:{b:{if(Gj(rc(J[a+60>>2],d+16|0,2,d+12|0)|0)){b=32}else{e=J[d+12>>2];if((e|0)>0){break b}b=e?32:16}J[a>>2]=b|J[a>>2];break a}f=e;g=J[d+20>>2];if(g>>>0>=e>>>0){break a}f=J[a+44>>2];J[a+4>>2]=f;J[a+8>>2]=f+(e-g|0);if(J[a+48>>2]){J[a+4>>2]=f+1;H[(b+c|0)-1|0]=K[f|0]}f=c}$c=d+32|0;return f|0}function HK(a){a=a|0;var b=0,c=0;b=$c-16|0;$c=b;yf(a);af(48);c=J[382915];J[b+8>>2]=J[382914];J[b+12>>2]=c;N[b+8>>2]=N[b+8>>2]+Q(.25);c=J[382913];J[b>>2]=J[382912];J[b+4>>2]=c;yd(Q(N[a+16>>2]*Q(-.01745329238474369)),Q(0),Q(0),b,1);c=J[382923];J[b+8>>2]=J[382922];J[b+12>>2]=c;N[b+8>>2]=N[b+8>>2]+Q(.25);c=J[382921];J[b>>2]=J[382920];J[b+4>>2]=c;yd(Q(N[a+16>>2]*Q(-.01745329238474369)),Q(0),Q(0),b,1);Pd(J[273228]);J[273224]=J[273229];ae(48);$c=b+16|0}function yA(a){a=a|0;var b=0;a=0;a:{if(J[263682]<=0){break a}while(1){b=J[(a<<2)+1054816>>2];bd[J[J[b>>2]+56>>2]](b);a=a+1|0;b=J[263682];if((a|0)<(b|0)){continue}break}if((b|0)<=0){break a}a=0;while(1){b=J[(a<<2)+1054816>>2];bd[J[J[b>>2]+60>>2]](b);H[b+7|0]=1;a=a+1|0;b=J[263682];if((a|0)<(b|0)){continue}break}if((b|0)<=0){break a}a=0;while(1){b=J[(a<<2)+1054816>>2];bd[J[J[b>>2]+52>>2]](b);H[b+7|0]=1;a=a+1|0;if((a|0)<J[263682]){continue}break}}}function Wr(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;b=K[1054054];J[a+40>>2]=0;j=b?767:49;h=J[a+44>>2];b=0;while(1){e=1;d=c+h|0;f=d>>>0>=768?768:d;a:{if(f>>>0>c>>>0){while(1){g=L[(c<<1)+1066210>>1];if(j>>>0>=g>>>0){d=b+1|0;J[a+40>>2]=d;I[((b<<1)+a|0)+92>>1]=g;e=g?0:e;b=d}c=c+1|0;if((f|0)!=(c|0)){continue}break}c=f;if(!(e&255)){break a}}J[a+40>>2]=i;b=i}i=b;if(c>>>0<768){continue}break}k=a,l=Ge(b,h),J[k+48>>2]=l;bd[J[J[a>>2]+8>>2]](a)}function sJ(a){a=a|0;var b=0,c=0,d=0;b=$c-160|0;$c=b;c=63;a:{b:{while(1){d=c;if(K[d+a|0]&223){break b}c=d-1|0;if(d){continue}break}c=0;break a}c=d+1|0}I[b+22>>1]=64;I[b+20>>1]=c;J[b+16>>2]=a;J[b+28>>2]=8388608;J[b+24>>2]=b+32;ke(b+24|0,b+16|0);if(K[53025]>=2){d=a- -64|0;c=63;c:{d:{while(1){a=c;if(K[a+d|0]&223){break d}c=a-1|0;if(a){continue}break}a=0;break c}a=a+1|0}I[b+14>>1]=64;I[b+12>>1]=a;J[b+8>>2]=d;ye(b+24|0,b+8|0)}pt(b+24|0);$c=b+160|0}function Zh(a){var b=0,c=0,d=0,e=0,f=0;Dd(a+8|0);H[a+6|0]=K[a+6|0]&225|20;b=J[a+12>>2];if(b){d=J[266967];if((d|0)>0){f=P(J[268510],20);while(1){if(J[b>>2]>=0){e=(c<<2)+1067872|0;J[e>>2]=J[e>>2]-1}b=b+f|0;c=c+1|0;if((d|0)!=(c|0)){continue}break}}J[a+12>>2]=0}b=J[a+16>>2];if(b){d=J[266967];if((d|0)>0){f=P(J[268510],20);c=0;while(1){if(J[b>>2]>=0){e=(c<<2)+1070944|0;J[e>>2]=J[e>>2]-1}b=b+f|0;c=c+1|0;if((d|0)!=(c|0)){continue}break}}J[a+16>>2]=0}}function gH(){var a=0,b=0,c=0,d=0,e=0,f=0,g=0,h=Q(0);b=$c-16|0;$c=b;nd(1043196,0,942);g=1801732,h=Wf(14196,Q(1),Q(16),Q(1)),N[g>>2]=h;f=Le(1289,0,255,102);c=b+13|0;a=$c-32|0;$c=a;d=a+24|0;a:{if(!Hf(6799,d)){break a}e=1;if(on(d,c)){break a}e=0;if(!Ag(d,44,a,3)){break a}if(!Mh(a,c)){break a}if(!Mh(a|8,c+1|0)){break a}e=(Mh(a+16|0,c+2|0)|0)!=0}$c=a+32|0;a=K[b+13|0]|K[b+14|0]<<8|K[b+15|0]<<16|f<<24;b:{if(e){break b}a=f<<24}J[450434]=a;$c=b+16|0}function xF(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;c=J[206303];if((c|0)==-1){c=L[(J[266937]+J[266938]<<1)+1066048>>1]}d=J[a+4>>2];e=J[b+4>>2];if((d|0)<=(e|0)){f=J[b>>2];h=J[a>>2];g=J[b+8>>2];a=J[a+8>>2];i=c&65535;while(1){c=a;if((g|0)>=(c|0)){while(1){b=h;if((f|0)>=(b|0)){while(1){ii(b,d,c,i);j=(b|0)!=(f|0);b=b+1|0;if(j){continue}break}}b=(c|0)!=(g|0);c=c+1|0;if(b){continue}break}}b=(d|0)!=(e|0);d=d+1|0;if(b){continue}break}}}function sD(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0;f=$c-16|0;$c=f;J[f+12>>2]=a;a:{b:{g=J[465684];if((g|0)>0){h=J[465686];while(1){if(J[(P(e,312)+h|0)+128>>2]==(a|0)){break b}e=e+1|0;if((g|0)!=(e|0)){continue}break}}qd(b);vf(27272,f+12|0);break a}a=P(e,312)+h|0;J[a+160>>2]=c;J[a+156>>2]=b;J[a+148>>2]=c;J[a+144>>2]=d;c:{if(!(b|d)){J[a+152>>2]=-857812900;break c}if(!b){break c}vf(5465,a+160|0)}jr(a);Dh(1862736,e)}jm();$c=f+16|0}function ek(a,b){var c=0,d=0,e=0,f=0;e=$c-16|0;$c=e;I[b+4>>1]=0;f=-857812991;while(1){c=0;a:{while(1){d=bd[J[a+4>>2]](a,(e+4|0)+c|0)|0;if(d){f=(d|0)==-857812991?f:d;break a}c=c+1|0;if(!xs(e+12|0,e+4|0,c)){continue}break}f=0;b:{c:{d=J[e+12>>2];switch(d-10|0){case 3:continue;case 0:break a;case 1:case 2:break b;default:break c}}if((d|0)==65279){continue}}c=$c-16|0;$c=c;Um(d,c+15|0);$c=c+16|0;Ud(b,H[c+15|0]);continue}break}$c=e+16|0;return f}function wr(a,b,c,d){var e=0,f=0,g=0;a:{f=I[a>>1];if((f|0)>=(c|0)){break a}g=L[a+2>>1];if(!g){break a}e=g&32767;I[a+6>>1]=e;if((b|0)<=(f|0)){g=f}else{if((e+f|0)<=(b|0)){break a}e=(f-b|0)+e|0;I[a+6>>1]=e;f=b<<16>>16;g=b}c=(e<<16>>16)+(f-c|0)|0;if((c|0)>0){e=e-c|0;I[a+6>>1]=e}I[a+4>>1]=g-b;if(!(e&65535)){break a}c=L[a+4>>1]|L[a+6>>1]<<16;b=J[d>>2];a=L[a>>1]|L[a+2>>1]<<16;I[b>>1]=a;I[b+2>>1]=a>>>16;I[b+4>>1]=c;I[b+6>>1]=c>>>16;J[d>>2]=b+8}}function Gg(a,b){var c=0,d=0;Nd(1053076);qp();d=$c-80|0;$c=d;J[450424]=8388608;J[450423]=1801500;I[900560]=257;ye(1801692,a);J[450426]=4194304;J[450425]=1801628;ye(1801700,b);J[d+76>>2]=4194304;J[d+72>>2]=d;c=d+72|0;Xg(c,b);a=0;if(!_e(c,41240)){a=!_e(c,41248)}J[450279]=41256;H[1801156]=a;Ad(1801116,60);a=J[263682];if((a|0)>0){while(1){b=a-1|0;c=J[(b<<2)+1054816>>2];if((c|0)!=1801116){ge(c)}c=a>>>0>1;a=b;if(c){continue}break}}$c=d+80|0}function st(a){var b=0,c=0,d=0;a:{if(L[24366]){break a}d=L[a+4>>1];if(!d){break a}while(1){b:{c:{b=K[J[a>>2]+c|0];d:{if(b-40>>>0<2){break d}e:{f:{switch(b-91|0){case 0:case 2:break d;case 1:break e;default:break f}}switch(b-123|0){case 0:case 2:break d;default:break e}}if((b-58&255)>>>0>245){break d}if(((b&223)-91&255)>>>0<230){break c}}Ud(48728,b<<24>>24);d=L[a+4>>1];break b}c=((b|0)==38)+c|0}c=c+1|0;if((d|0)>(c|0)){continue}break}}}function qq(a,b){var c=0,d=0,e=0,f=0,g=Q(0),h=Q(0);c=$c-32|0;$c=c;Ee(c+24|0,a+196|0,64);while(1){d=J[(f<<2)+827376>>2];a:{if(!d){break a}Ee(c+8|0,d+196|0,64);e=J[c+12>>2];J[c+16>>2]=J[c+8>>2];J[c+20>>2]=e;if(!Uf(c+24|0,c+16|0)){break a}b:{if(b){e=0;g=Q(1);h=Q(1);break b}e=J[a+112>>2];H[d+108|0]=K[a+108|0];g=N[a+120>>2];h=N[a+124>>2]}N[d+124>>2]=h;N[d+120>>2]=g;J[d+112>>2]=e;H[d+109|0]=3}f=f+1|0;if((f|0)!=256){continue}break}$c=c+32|0}function qu(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;d=J[a+24>>2];if((d|0)>=0){a:{b:{switch(d|0){case 0:H[a+40|0]=b;break a;case 1:break b;default:break a}}c:{switch((b&-2)-36|0){case 2:H[a+41|0]=K[a+41|0]|1;break a;case 0:H[a+41|0]=K[a+41|0]|2;break a;case 4:H[a+41|0]=K[a+41|0]|4;break a;default:break c}}H[a+41|0]=0}J[a+24>>2]=-1;H[a+52|0]=1;Vi(a);Ui(a);return 1}if(bd[J[J[a+100>>2]+12>>2]](a+100|0,b,c)|0){a=1}else{a=(ci(b)|0)!=0}return a|0}function wh(a,b){var c=0,d=0,e=0;d=$c-32|0;$c=d;a:{if(K[1054308]){J[a+24>>2]=J[8052];b=J[8051];J[a+16>>2]=J[8050];J[a+20>>2]=b;b=J[8049];J[a+8>>2]=J[8048];J[a+12>>2]=b;b=J[8047];J[a>>2]=J[8046];J[a+4>>2]=b;break a}e=Ne(b);if(!e){J[a+24>>2]=J[8052];b=J[8051];J[a+16>>2]=J[8050];J[a+20>>2]=b;b=J[8049];J[a+8>>2]=J[8048];J[a+12>>2]=b;b=J[8047];J[a>>2]=J[8046];J[a+4>>2]=b;break a}c=d+8|0;vg(c,e,Ng(b));pf(c,b,0,0);Mg(a,c);ug(c)}$c=d+32|0}function Pr(a,b){var c=0,d=0,e=0,f=0,g=0;e=J[a+4>>2];c=e<<4&3840|((e<<8|(e&256)>>>8)&3841)<<4;c=c>>>2&13056|(c&13072)<<2;g=(c>>>1&21760|(c&21824)<<1)>>>7|0;c=10;d=9;while(1){g=e>>>d&1|g<<1;f=(c<<1)+b|0;if(g>>>0<L[f+1056>>1]){d=L[f+1024>>1];f=L[f+1088>>1];J[a+4>>2]=e>>>c;J[a+8>>2]=J[a+8>>2]-c;return L[(((f+g|0)-d<<1)+b|0)+1120>>1]}c=c+1|0;d=d+1|0;if((d|0)!=15){continue}break}J[a+16>>2]=0;H[a|0]=13;J[a+44736>>2]=-857812902;return 0}function ig(a,b,c,d){var e=0,f=0,g=0;e=7;if(!((b|0)<0|J[464808]<=(b|0))){if(!(M[464807]>a>>>0&M[464809]>c>>>0)){a=J[195020];return(a|0)<=(b|0)?7:(a-1|0)==(b|0)?6:0}d=d<<1;e=L[d+J[195008]>>1];f=b-(K[e+79952|0]>>>6&1)|0;g=bd[J[266960]](a,f,c)|0;b=((bd[J[266960]](a,b,c)|0)!=0)<<1|(g|0)!=0|((bd[J[266960]](a,f+1|0,c)|0)!=0)<<2;a=d+J[195008]|0;b=b|K[L[a-648>>1]+68432|0]!=0;b=K[e+68432|0]?b|2:b;e=K[L[a+648>>1]+68432|0]?b|4:b}return e}function XG(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=0;if(K[775860]){a:{if(e){break a}e=0;if((L[929696]&65534)!=8){break a}f=J[464849];if(!(!a|!c|J[464810]==(a|0))&J[464812]!=(c|0)|((f|0)<=(b|0)|(f+J[464850]|0)>(b|0))){break a}e=9;re(a,b,c,9)}f=P(J[464807],P(J[464809],b)+c|0)+a|0;b:{if(!e){e=J[((d&255)<<2)+778936>>2];if(!e){break b}bd[e|0](f,d);break b}d=J[((e&255)<<2)+777912>>2];if(!d){break b}bd[d|0](f,e)}dh(a,b,c,f)}}function lj(a,b,c,d){var e=0,f=0,g=0,h=0,i=0;f=J[a+20>>2];e=f-1|0;if((f|0)<=0){return e}g=J[a+16>>2];a:{while(1){b:{f=e;e=J[g+(e<<2)>>2];if(!e){break b}h=J[e+4>>2];if((h|0)>(c|0)){break b}i=J[e+8>>2];if((J[e+12>>2]+h|0)<=(c|0)|(i|0)>(d|0)|(J[e+16>>2]+i|0)<=(d|0)){break b}if(H[e+21|0]&1){break a}g=J[e+32>>2];if(g){bd[g|0](a,e);break a}bd[J[J[e>>2]+24>>2]](e,b,c,d)|0;break a}e=f-1|0;if((f|0)>0){continue}break}return-1}return f}function ID(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0;f=J[a+84>>2];e=J[a+40>>2];if((e|0)>0){while(1){g=P(c,28)+f|0;h=L[g+8>>1];b=(b|0)>(h|0)?b:h;d=L[g+10>>1]+d|0;c=c+1|0;if((e|0)!=(c|0)){continue}break}}J[a+16>>2]=d;J[a+12>>2]=b;_f(a);if(J[a+40>>2]>0){c=J[a+8>>2];d=0;while(1){b=P(d,28)+f|0;e=mf(K[a+22|0],J[a+24>>2],L[b+8>>1],J[467303]);I[b+6>>1]=c;I[b+4>>1]=e;c=L[b+10>>1]+c|0;d=d+1|0;if((d|0)<J[a+40>>2]){continue}break}}}function _i(a,b,c){var d=0,e=0,f=0;f=$c-16|0;$c=f;Fo(b,c,f+12|0,f+8|0);d=J[f+8>>2];a:{if(d){d=Zi(a,d);break a}b:{d=J[f+12>>2];if(!d){break b}e=J[a+32>>2];if(!e){break b}d=Zi(a,P(d,e));break a}d=0;e=J[a+24>>2];if((e|0)<0){break a}e=J[J[a+16>>2]+(e<<2)>>2];if(!e|(K[e+21|0]&3)!=2){break a}d=J[e+32>>2];if(!(!d|J[c+32>>2]!=(b|0)&J[c+36>>2]!=(b|0))){bd[d|0](a,e);d=1;break a}d=bd[J[J[e>>2]+12>>2]](e,b,c)|0}$c=f+16|0;return d}function UM(a){a=a|0;var b=0,c=0,d=0,e=0;b=J[a+60>>2]/2|0;if(J[a+40>>2]>0){e=b+5|0;d=J[a+72>>2];c=J[a+64>>2];b=0;while(1){c=(b|0)==(d|0)?J[a+64>>2]:c;md((P(b,84)+a|0)+492|0,1,1,P((d|0)!=-1?(b|0)<(d|0)?-1:1:0,e),c);c=c+50|0;b=b+1|0;if((b|0)<J[a+40>>2]){continue}break}}md(a+96|0,1,1,0,-180);md(a+168|0,1,1,0,100);md(a+240|0,1,2,0,25);md(a+324|0,1,1,-35-J[a+60>>2]|0,J[a+68>>2]);md(a+408|0,1,1,J[a+60>>2]+35|0,J[a+68>>2])}function Fp(){var a=0,b=0,c=0;while(1){b=(a<<2)+1053664|0,c=Ye(256,4,12858),J[b>>2]=c;a=a+1|0;if((a|0)!=8){continue}break}pg(J[263416],Q(1),J[464867]);pg(J[263417],Q(.6000000238418579),J[464867]);pg(J[263418],Q(.800000011920929),J[464867]);pg(J[263419],Q(.5),J[464867]);pg(J[263420],Q(1),J[464863]);pg(J[263421],Q(.6000000238418579),J[464863]);pg(J[263422],Q(.800000011920929),J[464863]);pg(J[263423],Q(.5),J[464863])}function sk(a){var b=0,c=0,d=0,e=0;if(K[a+138|0]){if(K[a+137|0]){d=$c-16|0;$c=d;b=J[273230];if((b|0)==(a|0)){J[273230]=J[a+68>>2]}if(b){while(1){c=b;b=J[b+68>>2];if((b|0)==(a|0)){b=J[a+68>>2];J[c+68>>2]=b}if(b){continue}break}J[273231]=c}b=0;while(1){e=J[(b<<2)+827376>>2];if(!(!e|J[e+48>>2]!=(a|0))){c=d+8|0;Wd(c,J[J[273226]>>2]);vh(e,c)}b=b+1|0;if((b|0)!=256){continue}break}$c=d+16|0}qd(J[a+4>>2]);je(a,0,6848)}}function zd(a,b){var c=0,d=0,e=0,f=0;c=J[a>>2];d=J[a+4>>2];if(b-1&b){while(1){c=GN(c,d,-554899859,5);d=ad;c=c+11|0;d=(c>>>0<11?d+1|0:d)&65535;e=d<<15|c>>>17;f=(e|0)%(b|0)|0;if((((f^-1)+b|0)+e|0)<0){continue}break}J[a>>2]=c;J[a+4>>2]=d;return f}c=GN(c,d,-554899859,5);d=ad;c=c+11|0;d=c>>>0<11?d+1|0:d;J[a>>2]=c;e=a;a=d&65535;J[e+4>>2]=a;a=GN(b,b>>31,(a&131071)<<15|c>>>17,a>>>17|0);return(ad&2147483647)<<1|a>>>31}function fC(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;b=a-1|0;c=c+b|0;d=(b<<2)+d|0;if((a|0)>3){while(1){J[d>>2]=P(K[c|0],65793)|-16777216;J[d-4>>2]=P(K[c-1|0],65793)|-16777216;J[d-8>>2]=P(K[c-2|0],65793)|-16777216;J[d-12>>2]=P(K[c-3|0],65793)|-16777216;c=c-4|0;d=d-16|0;b=a>>>0>7;a=a-4|0;if(b){continue}break}}if((a|0)>0){while(1){J[d>>2]=P(K[c|0],65793)|-16777216;c=c-1|0;d=d-4|0;b=a>>>0>1;a=a-1|0;if(b){continue}break}}}function wH(a){a=a|0;var b=0,c=0,d=0,e=0;b=$c-48|0;$c=b;d=b,e=mj(a),J[d+44>>2]=e;J[b+20>>2]=0;I[b+26>>1]=64;I[b+24>>1]=J[467303];Gi(b+28|0,L[61119],b+12|0);N[b+36>>2]=Q(J[467303])*Q(.015625);if(J[a+52>>2]>0){while(1){I[b+22>>1]=c<<6;we(b+16|0,-12566464,b+44|0);c=c+1|0;if((c|0)<J[a+52>>2]){continue}break}}c=b+44|0;bd[J[J[a+72>>2]+36>>2]](a+72|0,c);bd[J[J[a+144>>2]+36>>2]](a+144|0,c);Pd(J[a+12>>2]);$c=b+48|0}function as(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0;b=J[a+4>>2];d=J[a+8>>2];a:{if((b|0)==d<<1){break a}e=240;if((b|0)!=(d|0)){break a}e=2;f=b;b=(b|0)/64|0;d=P(b,20);c=P(b,54);if(J[(J[a>>2]+(P(f,d)<<2)|0)+(c<<2)>>2]>=0){break a}e=1;f=c;c=b<<1;g=P(b,12);if(!$j(a,f,d,c,g)){break a}h=b<<4;f=c;c=b<<2;if(!$j(a,P(b,50),h,f,c)){break a}e=2;if(!$j(a,P(b,40),d,P(b,14),g)){break a}e=$j(a,P(b,44),h,P(b,6),c)?1:2}return e}function VB(a,b,c){a=a|0;b=Q(b);c=Q(c);var d=0,e=0,f=Q(0),g=Q(0),h=Q(0);Jh(a+4|0,a+352|0,a+384|0,c);Tl(a,c);nq(a,c);d=$c-32|0;$c=d;g=N[a+12>>2];f=N[a+8>>2];h=N[a+4>>2];Bq(a,d+8|0);b=Q(N[d+24>>2]-N[d+12>>2]);c=Q(N[d+28>>2]-N[d+16>>2]);c=b>c?b:c;f=Q(f+Q(b*Q(.5)));b=Q(N[d+20>>2]-N[d+8>>2]);e=Dm(h,f,g,b>c?b:c);$c=d+32|0;H[a+55|0]=e;if(K[1054197]){e=Xt(a)<=Q(4096)&K[a+55|0];H[a+55|0]=e}if(e){sn(J[a+48>>2],a)}}function Kp(a,b){var c=Q(0),d=Q(0),e=0;a:{if(a==Q(0)){a=Q(1.5707963705062866);if(b>Q(0)){break a}return b<Q(0)?Q(-1.5707963705062866):Q(0)}d=Q(R(a));c=Q(R(b));e=d<c;b:{if(e){c=Q(d/c);break b}c=Q(c/d)}d=Q(c*c);c=Q(Q(Q(d*Q(Q(d*Q(Q(d*Q(-.046496473252773285))+Q(.15931421518325806)))+Q(-.32762277126312256)))*c)+c);c=e?Q(Q(1.5707963705062866)-c):c;a=a<Q(0)?Q(Q(3.1415927410125732)-c):c;a=b<Q(0)?Q(-a):a}return a}function Ev(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0;h=1;i=f+66896|0;d=d+1|0;a:{if(!(K[i+655872|0]&1<<g)|(d|0)>=J[195013]){break a}while(1){e=e+18|0;if(!un(f,e,b,c,d,g)){break a}a=a+96|0;H[a+J[195009]|0]=0;h=h+1|0;d=d+1|0;if((d|0)<J[195013]){continue}break}}a=((((K[i+13824|0]==3)<<9)+(L[(P(f,6)+g<<1)+122192>>1]>>>J[458159]|0)<<5)+(g<<2)|0)+780112|0;J[a>>2]=J[a>>2]+4;return h|0}function $v(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0;if(!Sh(e)){g=1;h=f+66896|0;b=b+1|0;a:{if(!(K[h+655872|0]&32)|(b|0)>=J[195012]){break a}while(1){e=e+1|0;if(!un(f,e,b,c,d,5)){break a}if(Sh(e)){break a}a=a+6|0;H[a+J[195009]|0]=0;g=g+1|0;b=b+1|0;if((b|0)<J[195012]){continue}break}}a=(((K[h+13824|0]==3)<<9)+(L[P(f,12)+122202>>1]>>>J[458159]|0)<<5)+780132|0;J[a>>2]=J[a>>2]+4}return g|0}function Mv(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;var h=0,i=0;h=1;i=f+66896|0;b=b+1|0;a:{if(!(K[i+655872|0]&1<<g)|(b|0)>=J[195012]){break a}while(1){e=e+1|0;if(!un(f,e,b,c,d,g)){break a}a=a+6|0;H[a+J[195009]|0]=0;h=h+1|0;b=b+1|0;if((b|0)<J[195012]){continue}break}}a=((((K[i+13824|0]==3)<<9)+(L[(P(f,6)+g<<1)+122192>>1]>>>J[458159]|0)<<5)+(g<<2)|0)+780112|0;J[a>>2]=J[a>>2]+4;return h|0}function vJ(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;c=$c-16|0;$c=c;e=a+1|0;f=K[a|0];b=63;a:{b:{while(1){d=b;if(K[d+e|0]&223){break b}b=d-1|0;if(d){continue}break}b=0;break a}b=d+1|0}I[c+14>>1]=64;I[c+12>>1]=b;J[c+8>>2]=e;e=a+65|0;b=63;c:{d:{while(1){d=b;if(K[d+e|0]&223){break d}b=d-1|0;if(d){continue}break}b=0;break c}b=d+1|0}I[c+6>>1]=64;I[c+4>>1]=b;J[c>>2]=e;b=c+8|0;hn(f,b,c);gn(a+129|0,f,b,c,1);$c=c+16|0}function og(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0;J[a+4096>>2]=b;if((b|0)>0){while(1){f=(e<<9)+a|0;d=0;c=0;while(1){H[c+f|0]=c;c=c+1|0;if((c|0)!=256){continue}break}while(1){g=zd(1054272,256-d|0);c=d+f|0;h=K[c|0];i=c;c=c+g|0;H[i|0]=K[c|0];H[c|0]=h;d=d+1|0;if((d|0)!=256){continue}break}d=0;while(1){c=d+f|0;H[c+256|0]=K[c|0];d=d+1|0;if((d|0)!=256){continue}break}e=e+1|0;if((e|0)!=(b|0)){continue}break}}}function oA(){var a=0,b=0;J[263760]=1065353216;J[263761]=1065353216;J[263845]=1065353216;J[263770]=1065353216;J[263771]=1065353216;H[1055014]=2;H[1055220]=0;H[1055156]=0;J[263766]=0;J[263762]=1065353216;vh(1054960,32352);H[1055070]=1;J[263740]=33852;a=1054880,b=Id(15495,1),H[a|0]=b;I[527478]=L[(J[266937]+J[266938]<<1)+1066048>>1];nd(1042936,0,230);nd(1044236,0,231);nd(1043716,0,232);nd(1043196,0,233)}function bJ(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;d=$c-16|0;$c=d;J[d+12>>2]=a;e=ot(d+12|0,0);f=e+80720|0;a=J[d+12>>2];c=K[a|0];a:{if((c-1&255)>>>0<=15){N[P(e,12)+94548>>2]=Q(c>>>0)*Q(.0625);b=K[a+1|0];break a}b=K[a+1|0];if(c){break a}H[e+84560|0]=b;b=5}H[f|0]=b;b=(e<<2)+66896|0;c=K[a+2|0];N[b+5376>>2]=c?Q(Q(c+1|0)*Q(.0078125)):Q(0);J[b+2304>>2]=K[a+3|0]|K[a+4|0]<<8|K[a+5|0]<<16|-16777216;zj(e,1);$c=d+16|0}function FJ(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;c=$c-16|0;$c=c;e=a+1|0;f=K[a|0];b=63;a:{b:{while(1){d=b;if(K[d+e|0]&223){break b}b=d-1|0;if(d){continue}break}b=0;break a}b=d+1|0}I[c+14>>1]=64;I[c+12>>1]=b;J[c+8>>2]=e;e=a+65|0;b=63;c:{d:{while(1){d=b;if(K[d+e|0]&223){break d}b=d-1|0;if(d){continue}break}b=0;break c}b=d+1|0}I[c+6>>1]=64;I[c+4>>1]=b;J[c>>2]=e;b=c+8|0;hn(f,b,c);gn(a+129|0,f,b,c,0);$c=c+16|0}function pg(a,b,c){var d=0,e=0,f=Q(0),g=0,h=0,i=Q(0),j=0,k=0,l=0;while(1){h=d<<4;i=Q(Q(Q(d|0)/Q(15))*Q(1.5707963705062866));j=(d|0)!=15;e=0;while(1){if(j){f=Md(i);g=hg(0,J[464872],Q(Q(1)-f))}else{g=J[464872]}f=Md(Q(Q(Q(e|0)/Q(15))*Q(1.5707963705062866)));k=((e|h)<<2)+a|0,l=ue(Gt(Gt(g,hg(0,J[464871],Q(Q(1)-f))),c),b),J[k>>2]=l;e=e+1|0;if((e|0)!=16){continue}break}d=d+1|0;if((d|0)!=16){continue}break}}function TG(a){a=a|0;var b=0,c=0,d=0;b=$c-160|0;$c=b;a:{if(!L[a+4>>1]|H[1832516]&1){break a}c=J[a+4>>2];a=J[a>>2];J[b+8>>2]=a;J[b+12>>2]=c;a=c;if(!(a&65535)){break a}while(1){c=b+16|0;H[c|0]=13;H[c+1|0]=K[1811804]?(a&65535)>>>0>64:-1;a=b+8|0;Qi(c+2|0,a);d=a;a=L[b+12>>1];Qe(b,d,a>>>0>=64?64:a);a=J[b+4>>2];J[b+8>>2]=J[b>>2];J[b+12>>2]=a;bd[J[452942]](c,66);a=L[b+12>>1];if(a){continue}break}}$c=b+160|0}function Uo(a,b){var c=0,d=0,e=0,f=0;a=J[a>>2];od(b,a&128?29049:29075);od(b,29165);d=a&1;if(d){od(b,28926);od(b,29331)}c=a&24;if(c){od(b,29309)}e=a&8;if(e){od(b,29389)}f=a&16;if(f){od(b,28860)}od(b,28623);od(b,d?29188:29142);if(a&2){od(b,29360)}if(c){od(b,28887)}if(e){od(b,29592)}if(f){od(b,29644)}a:{if(!c){break a}od(b,29472);if(J[263680]!=1){break a}od(b,29412);od(b,29510)}od(b,29286);od(b,1187)}function vp(a){var b=0,c=0,d=0;c=$c+-64|0;$c=c;b=bd[J[a+4>>2]](a,c+63|0)|0;a:{if(b){break a}while(1){b=0;b:{c:{d:{d=K[c+63|0];switch(d-119|0){case 1:break a;case 0:break d;default:break c}}b=bd[J[a+4>>2]](a,c+62|0)|0;if(b){break a}b=bd[J[a+12>>2]](a,K[c+62|0])|0;if(!b){break b}break a}H[c+8|0]=d;b=ki(a,c+8|0);if(b){break a}}b=bd[J[a+4>>2]](a,c+63|0)|0;if(!b){continue}break}}$c=c- -64|0;return b}function Vs(a){a=a|0;var b=0,c=0,d=0;b=$c-160|0;$c=b;J[b+144>>2]=8388608;J[b+140>>2]=b;J[b+148>>2]=a;a:{if(!(K[1054198]|!K[1054197])){od(b+140|0,9943);break a}if(!a){break a}d=b+152|0;tg(d,a);c=b+140|0;ye(c,d);if(K[1054197]){break a}Hd(c,12683,b+148|0);a=a+66896|0;if(!K[a+64512|0]){od(c,12668)}if(!K[a+65280|0]){od(b+140|0,12652)}Ud(b+140|0,41)}Ce(1800660,b+140|0,1797932);H[1797903]=1;$c=b+160|0}function bD(a,b,c){a=a|0;b=b|0;c=c|0;c=0;a=Tq(J[b+36>>2],J[b+8>>2]);a:{if(!((a|0)!=94|!K[1055388])&(H[1869768]&1)){break a}if(a){Yk(a);Ah();c=1;if(K[1056204]|K[1056205]){break a}if(K[1056206]|K[1056207]){c=(a|0)!=67&(a|0)!=86;break a}if(K[1056202]|K[1056203]){c=(a|0)!=67&(a|0)!=86;break a}if((a|0)==93){c=K[1869768]^1;break a}c=a>>>0<25|a-58>>>0<7|(a&252)==44|a-91>>>0<10;break a}Ah()}return c&1}function Lp(a){var b=0,c=0,d=0,e=0;a:{b:{if(a<.25){b=a*4;d=b*b;break b}if(a<.5){b=(.5-a)*4;d=b*b;break b}if(a<.75){b=(a+-.5)*4;d=b*b;break a}b=(1-a)*4;d=b*b;break a}a=-2020852964e-20;c=4;while(1){e=c;a=d*a+O[(c<<3)+33008>>3];c=c-1|0;if(e){continue}break}a=b*a;return a*(a*(a*-4)+3)}a=-2020852964e-20;c=4;while(1){e=c;a=d*a+O[(c<<3)+33008>>3];c=c-1|0;if(e){continue}break}a=b*a;return(a*-4*a+3)*-a}function Kh(a,b){var c=0,d=0;c=$c-944|0;$c=c;J[c+940>>2]=17039360;J[c+936>>2]=c+656;d=c+936|0;od(d,b);Je(c,d);a:{b:{c:{b=Gs(c+600|0,c);if(!b){b=0;if(J[a+8>>2]<=0){break b}break c}Te(b,11916,c);break a}while(1){d:{d=c+928|0;bk(a,b,d);d=Cs(c+600|0,d);if(d){break d}b=b+1|0;if((b|0)<J[a+8>>2]){continue}break b}break}Te(d,8358,c)}a=bd[J[c+628>>2]](c+600|0)|0;if(!a){break a}Te(a,11925,c)}$c=c+944|0}function Dv(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0;b=$c-16|0;$c=b;f=a+908|0;c=$c-16|0;$c=c;while(1){g=c+8|0;Wd(g,J[(d<<2)+42864>>2]);jf(f,g);d=d+1|0;if((d|0)!=18){continue}break}$c=c+16|0;c=L[26628]?53252:53284;a:{if(J[a+916>>2]<=0){break a}while(1){$d(b,f,e);d=J[b+4>>2];J[b+8>>2]=J[b>>2];J[b+12>>2]=d;if(fg(b+8|0,c)){J[a+804>>2]=e;break a}e=e+1|0;if((e|0)<J[a+916>>2]){continue}break}}$c=b+16|0}function Ag(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0;h=$c-16|0;$c=h;a:{b:{if((d|0)<=0){break b}j=d-1|0;while(1){f=L[a+4>>1];if((f|0)<(g|0)){break b}i=f;f=Zg(a,g,b);f=(f|0)==-1?i:(e|0)==(j|0)?i:f;Ke(h+8|0,a,g,f-g|0);i=J[h+12>>2];g=(e<<3)+c|0;J[g>>2]=J[h+8>>2];J[g+4>>2]=i;g=f+1|0;e=e+1|0;if((e|0)!=(d|0)){continue}break}e=d;break a}if((d|0)<=(e|0)){break a}Gd((e<<3)+c|0,0,d-e<<3)}$c=h+16|0;return e}function vk(a){var b=0,c=0,d=0;b=$c-16|0;$c=b;d=J[273222];c=J[a+12>>2];J[b+8>>2]=J[a+8>>2];J[b+12>>2]=c;c=J[a+4>>2];J[b>>2]=J[a>>2];J[b+4>>2]=c;N[b+4>>2]=Q(K[d+40|0])*Q(.0625);a=K[d+41|0];N[b+8>>2]=Q((a>>>1|0)+a|0)*Q(.0625);a:{if(K[1092886]){yd(Q(0),Q(-1.5707963705062866),Q(2.094395160675049),b,0);break a}yd(Q(-.3490658402442932),Q(-1.2217304706573486),Q(2.356194496154785),b,0)}$c=b+16|0}function fh(a,b,c){var d=0,e=0,f=0,g=Q(0),h=Q(0);d=$c-32|0;$c=d;J[d+24>>2]=J[a+24>>2];e=J[a+20>>2];J[d+16>>2]=J[a+16>>2];J[d+20>>2]=e;e=J[a+12>>2];J[d+8>>2]=J[a+8>>2];J[d+12>>2]=e;e=J[a+4>>2];J[d>>2]=J[a>>2];J[d+4>>2]=e;e=J[a+32>>2];f=(b<<1)+a|0;b=I[f+40>>1];I[d+8>>1]=b;I[d+4>>1]=e;g=N[a+36>>2];h=Q(g*Q(I[f+72>>1]));N[d+12>>2]=h;N[d+20>>2]=Q(g*Q(b|0))+h;J[a+32>>2]=b+e;we(d,-1,c);$c=d+32|0}function WL(){var a=0,b=0,c=0,d=Q(0);tn(48424);tn(48520);tn(48472);J[203292]=48424;J[266484]=62;nd(1052296,0,63);nd(1052556,0,64);nd(1043976,0,65);b=813076,c=Le(1210,1,200,30),J[b>>2]=c;b=813081,c=Id(12157,1),H[b|0]=c;b=813082,c=Id(13118,0),H[b|0]=c;b=813172,d=Wf(4475,Q(1),Q(100),Q(20)),N[b>>2]=d;b=813080,c=Id(11183,0),H[b|0]=c;a=Le(2082,1,179,70);J[203296]=a;J[203294]=a;J[203295]=a;Rh()}function KB(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=a-1|0;c=e+c|0;d=(e<<2)+d|0;if((a|0)>3){while(1){J[d>>2]=J[(K[c|0]<<2)+b>>2];J[d-4>>2]=J[(K[c-1|0]<<2)+b>>2];J[d-8>>2]=J[(K[c-2|0]<<2)+b>>2];J[d-12>>2]=J[(K[c-3|0]<<2)+b>>2];d=d-16|0;c=c-4|0;e=a>>>0>7;a=a-4|0;if(e){continue}break}}if((a|0)>0){while(1){J[d>>2]=J[(K[c|0]<<2)+b>>2];d=d-4|0;c=c-1|0;e=a>>>0>1;a=a-1|0;if(e){continue}break}}}function tp(){var a=0,b=0,c=0,d=0,e=0;a=K[1054734];c=a?4:10;d=a?33480:33488;a:{if(K[1056200]|K[1056201]){e=J[12427];c=c-1|0;a=c;while(1){b=I[(a<<1)+d>>1];if((e|0)>(b|0)){break a}b=(a|0)<=0;a=a-1|0;if(!b){continue}break}b=I[(c<<1)+d>>1];break a}a=0;e=J[12427];while(1){b=I[(a<<1)+d>>1];if((e|0)<(b|0)){break a}a=a+1|0;if((c|0)!=(a|0)){continue}break}b=I[d>>1]}J[12427]=b;lf(2712,b);Hg(b)}function Hz(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;J[266388]=0;a:{if(K[1055388]){if(!(H[(P(b,24)+1055392|0)+4|0]&1)){break a}}if(J[263682]<=0){break a}a=(b<<3)+1056464|0;d=J[a+4>>2];e=J[a>>2];f=1<<b;a=0;while(1){b:{c=J[(a<<2)+1054816>>2];H[c+7|0]=1;c=bd[J[J[c>>2]+36>>2]](c,f,e,d)|0;if(c){break b}a=a+1|0;if((a|0)<J[263682]){continue}break a}break}a=P(b,24)+1055392|0;H[a+4|0]=c&K[a+4|0]}}function Pq(a,b){var c=0,d=0,e=0;c=J[13610];a:{if(!c){if(Qq()){break a}c=J[13610]}d=J[13611];if(c-d>>>0<b>>>0){return bd[J[13615]](54424,a,b)|0}b:{c:{if(!b|J[13626]<0){break c}c=b;while(1){e=a+c|0;if(K[e-1|0]!=10){c=c-1|0;if(c){continue}break c}break}d=bd[J[13615]](54424,a,c)|0;if(d>>>0<c>>>0){break a}b=b-c|0;d=J[13611];break b}e=a;c=0}Qd(d,e,b);J[13611]=J[13611]+b;d=b+c|0}return d}function Ti(a,b,c){var d=0,e=0,f=0;d=$c-96|0;$c=d;a:{if((b|0)==3){e=2147483647;f=-2147483648;c=44828;break a}J[d+12>>2]=c;e=8192;f=1;c=44804}J[d+8>>2]=e;J[d+4>>2]=f;J[d+92>>2]=4194304;J[d+88>>2]=d+16;J[d>>2]=c;e=d+88|0;bd[J[c+16>>2]](d,e);c=P(b,72)+a|0;pe(a,c+1500|0);J[c+1568>>2]=-2039584;c=a;a=P(b,300)+a|0;Tj(c,a+300|0,200,e,d);J[a+596>>2]=3;H[a+446|0]=0;J[a+336>>2]=1e4;$c=d+96|0}function kg(a,b,c,d,e,f){var g=0,h=0,i=0;e=c+e|0;g=zf(b,e,d);f=d+f|0;h=zf(b,c,f);i=zf(b,e,f);a:{if(g){d=ue(a,Q(.5));break a}d=bd[J[266964]](b,e,d)|0}b:{if(h){c=ue(a,Q(.5));break b}c=bd[J[266964]](b,c,f)|0}c:{if((g|0)!=0&(h|0)!=0|i){b=ue(a,Q(.5));break c}b=bd[J[266964]](b,e,f)|0}a=((b^a)>>>1&2139062143)+(a&b)|0;b=((c^d)>>>1&2139062143)+(c&d)|0;return((a^b)>>>1&2139062143)+(a&b)|0}function jg(a,b,c,d,e,f){var g=0,h=0,i=0;e=b+e|0;g=zf(e,c,d);f=c+f|0;h=zf(b,f,d);i=zf(e,f,d);a:{if(g){c=ue(a,Q(.5));break a}c=bd[J[266965]](e,c,d)|0}b:{if(h){b=ue(a,Q(.5));break b}b=bd[J[266965]](b,f,d)|0}c:{if((g|0)!=0&(h|0)!=0|i){d=ue(a,Q(.5));break c}d=bd[J[266965]](e,f,d)|0}a=((d^a)>>>1&2139062143)+(a&d)|0;b=((b^c)>>>1&2139062143)+(b&c)|0;return((a^b)>>>1&2139062143)+(a&b)|0}function Yk(a){var b=0,c=0;c=a+1056164|0;b=K[c|0];H[c|0]=1;if((a|0)<=121){He(1049956,a,b,51152)}He(1050996,a,b,51152);a:{b:{if((a|0)!=86){if((a|0)!=67){break b}if(!(K[1056202]|K[1056203])){break a}He(1050996,1001,0,51152);return}if(!(K[1056202]|K[1056203])){break a}He(1050996,1002,0,51152);return}if((a|0)!=119|b){break a}a=J[264180];if(a){if(bd[a|0](0)|0){break a}}Rd(1051776,0)}}function Wi(a,b,c,d,e,f){var g=0,h=0,i=0;e=b+e|0;g=zf(e,c,d);f=d+f|0;h=zf(b,c,f);i=zf(e,c,f);a:{if(g){d=ue(a,Q(.5));break a}d=bd[J[266963]](e,c,d)|0}b:{if(h){b=ue(a,Q(.5));break b}b=bd[J[266963]](b,c,f)|0}c:{if((g|0)!=0&(h|0)!=0|i){c=ue(a,Q(.5));break c}c=bd[J[266963]](e,c,f)|0}a=((c^a)>>>1&2139062143)+(a&c)|0;b=((b^d)>>>1&2139062143)+(b&d)|0;return((a^b)>>>1&2139062143)+(a&b)|0}function Bk(a,b,c,d,e,f){var g=0,h=0,i=0;e=b+e|0;g=zf(e,c,d);f=d+f|0;h=zf(b,c,f);i=zf(e,c,f);a:{if(g){d=ue(a,Q(.5));break a}d=bd[J[266958]](e,c,d)|0}b:{if(h){b=ue(a,Q(.5));break b}b=bd[J[266958]](b,c,f)|0}c:{if((g|0)!=0&(h|0)!=0|i){c=ue(a,Q(.5));break c}c=bd[J[266958]](e,c,f)|0}a=((c^a)>>>1&2139062143)+(a&c)|0;b=((b^d)>>>1&2139062143)+(b&d)|0;return((a^b)>>>1&2139062143)+(a&b)|0}function Wy(a){a=a|0;var b=Q(0);J[268518]=1761892689;J[268516]=1761892689;J[268517]=1761892689;a=J[12427];b=Q(Q(((a|0)<=16?16:a)|0)*Q(1.4142135381698608));a:{if(Q(R(b))<Q(2147483648)){a=~~b;break a}a=-2147483648}a=a+24|0;J[268522]=P(a,a);a=J[12426];b=Q(Q(((a|0)<=16?16:a)|0)*Q(1.4142135381698608));b:{if(Q(R(b))<Q(2147483648)){a=~~b;break b}a=-2147483648}a=a+24|0;J[268521]=P(a,a)}function Ts(){var a=0,b=0,c=0,d=0;a=$c-96|0;$c=a;pd(19619);J[a+92>>2]=4194304;J[a+88>>2]=a+16;b=J[206299];a:{if(!b){break a}while(1){Wd(a,J[b>>2]);d=J[a+4>>2];c=J[a>>2];J[a+8>>2]=c;J[a+12>>2]=d;if(L[a+94>>1]<(L[a+92>>1]+(d&65535)|0)+2>>>0){an(a+88|0);I[a+92>>1]=0}c=a+88|0;ye(c,a+8|0);od(c,28561);b=J[b+32>>2];if(b){continue}break}if(!L[a+92>>1]){break a}an(c)}pd(17927);$c=a+96|0}function Do(a,b,c,d,e){var f=0,g=0,h=0,i=0,j=0,k=0;f=$c-32|0;$c=f;g=P(a,220)+1056736|0;h=b<<2;i=g+h|0;N[i+88>>2]=d;N[i+80>>2]=c;if(!(c==Q(0)&d==Q(0))){J[f+12>>2]=b;e=Q(Q(e*Q(60))*N[(J[h+51312>>2]<<2)+35008>>2]);d=Q(e*d);N[f+20>>2]=d;c=Q(e*c);N[f+16>>2]=c;J[f+8>>2]=a;j=f,k=Ug(g+212|0,Q(c/Q(100))),J[j+24>>2]=k;j=f,k=Ug(g+216|0,Q(d/Q(100))),J[j+28>>2]=k;Rd(1052556,f+8|0)}$c=f+32|0}function lJ(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;b=J[207101];a:{if(K[52841]){c=ud(a);d=ud(a+4|0);e=12;f=ud(a+8|0);break a}c=vd(a);d=vd(a+2|0)<<16>>16;c=c<<16>>16;e=6;f=vd(a+4|0)<<16>>16}a=a+e|0;N[b+448>>2]=Q(Q(K[a|0])*Q(360))*Q(.00390625);a=K[a+1|0];N[b+432>>2]=Q(f|0)*Q(.03125);N[b+428>>2]=Q(d-51|0)*Q(.03125);N[b+424>>2]=Q(c|0)*Q(.03125);N[b+452>>2]=Q(Q(a>>>0)*Q(360))*Q(.00390625)}function gj(a,b,c,d,e,f,g,h,i){var j=0,k=0,l=0,m=0;a:{if((h|0)!=(i|0)){if((h|0)>(i|0)){break a}l=J[464807];m=J[464809];f=J[464811];while(1){k=i<<4;j=k|15;j=(f|0)>(j|0)?j:f;if(go(d,P(P(j,m)+c|0,l)+a|0,k,j,b)){Jf(e,i,g);l=J[464807];m=J[464809];f=J[464811]}k=(h|0)<(i|0);i=i-1|0;if(k){continue}break}break a}if(!go(d,P(J[464807],P(J[464809],b)+c|0)+a|0,f<<4,b,b)){break a}Jf(e,f,g)}}function Mp(a,b){var c=0,d=0,e=0,f=0;c=a+66896|0;b=b?b:K[a+75344|0]!=2;H[c+13824|0]=b;d=3;a:{switch(K[c+9216|0]-5|0){case 1:d=1;case 0:e=(b|0)==(d|0);break;default:break a}}H[c|0]=e;b:{if(b){break b}b=P(a,12)+66896|0;if(N[b+18432>>2]!=Q(0)|N[b+18436>>2]!=Q(0)|(N[b+18440>>2]!=Q(0)|N[b+27648>>2]!=Q(1))){break b}if(N[b+27652>>2]!=Q(1)){break b}f=N[b+27656>>2]==Q(1)}H[a+83792|0]=f}function yk(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0;d=$c-80|0;$c=d;J[d+76>>2]=4194304;J[d+72>>2]=d;e=d+72|0;g=J[a+36>>2]==(b|0)?19537:17046;h=J[J[a+44>>2]+(b<<2)>>2];c=J[J[272014]+72>>2]+(K[J[a+48>>2]+b|0]<<1)|0;i=J[(K[c|0]<<2)+50464>>2];c=K[c+1|0];a:{if(!c){f=29937;c=29937;break a}f=28564;c=J[(c<<2)+50464>>2]}Wg(e,g,h,i,f,c);gf((P(b,84)+a|0)+492|0,e,a+84|0);H[a+7|0]=1;$c=d+80|0}function Mg(a,b){var c=0,d=0,e=0;c=K[1054441];il(a,b,12,0);c=c&1;I[a+8>>1]=J[(c?4:12)+b>>2];c=J[(c?8:16)+b>>2];J[a+12>>2]=0;J[a+16>>2]=0;I[a+10>>1]=c;c=J[b+4>>2];d=J[b+12>>2];a:{if(K[1054440]!=1){N[a+20>>2]=Q(d|0)/Q(c|0);c=J[b+8>>2];b=J[b+16>>2];break a}c=rg(c);e=K[1054440];N[a+20>>2]=Q(d|0)/Q(c|0);c=J[b+8>>2];b=J[b+16>>2];if((e|0)!=1){break a}c=rg(c)}N[a+24>>2]=Q(b|0)/Q(c|0)}function BI(a,b){a=a|0;b=Q(b);var c=0,d=0,e=0,f=0;a:{if(K[1054203]){break a}if(!bn()){break a}mg(J[a+36>>2],J[a+40>>2],J[a+44>>2],J[a+48>>2],-1275068416,-852348366);ie(1);Ve(J[a+12>>2]);c=bd[J[J[a+64>>2]+40>>2]](a- -64|0,0)|0;d=J[a+56>>2];if((d|0)<=0){break a}while(1){f=J[(P(e,28)+a|0)+1176>>2];if(f){de(f);he(4,c);d=J[a+56>>2];c=c+4|0}e=e+1|0;if((d|0)>(e|0)){continue}break}}}function Ar(a,b,c){var d=0,e=0;e=J[a+60>>2];a:{if((e|0)==-1){if(!J[a+40>>2]){return 0}Bm(a,0);break a}d=c;c=J[a+44>>2];b=b+P(d,c)|0;d=b+e|0;d=(d|0)<0?e:d;b=d-((d|0)>=J[a+40>>2]?b:0)|0;J[a+60>>2]=b;d=a+1668|0;b=J[d>>2]+(((b|0)/(c|0)|0)-((e|0)/(c|0)|0)|0)|0;J[d>>2]=b;e=J[a+1672>>2]-J[a+1676>>2]|0;c=(e|0)>(b|0);b=c?b:e;if(!(c&(b|0)>=0)){J[a+1668>>2]=(b|0)>0?b:0}Sg(a,0)}return 1}function iv(a){a=a|0;var b=0,c=0,d=0,e=0;J[a+804>>2]=0;J[a+28>>2]=10;J[a+20>>2]=0;J[a+16>>2]=a+6060;while(1){c=P(b,84)+a|0;xd(a,c+36|0,300,J[a+808>>2]);J[c+72>>2]=b;b=b+1|0;if((b|0)!=5){continue}break}b=K[1055388]?140:400;xd(a,a+708|0,b,J[a+816>>2]);xd(a,a+456|0,40,509);xd(a,a+540|0,40,510);pe(a,a+836|0);xd(a,a+624|0,b,J[a+812>>2]);d=a,e=oe(a),J[d+8>>2]=e;bd[J[a+824>>2]](a)}function sr(a,b,c){var d=0,e=Q(0),f=0,g=0,h=Q(0),i=Q(0),j=Q(0);f=c;c=J[a+4>>2];f=f+c|0;b=J[b>>2]-96|0;g=J[a+8>>2];i=Q(g|0);j=Q(c|0);c=0;while(1){a=b+P(c,24)|0;e=N[a+4>>2];h=Q(N[a>>2]-j);a:{if(Q(R(h))<Q(2147483648)){d=~~h;break a}d=-2147483648}N[a+4>>2]=d+g|0;e=Q(e-i);b:{if(Q(R(e))<Q(2147483648)){d=~~e;break b}d=-2147483648}N[a>>2]=f-d|0;c=c+1|0;if((c|0)!=4){continue}break}}function jj(a,b,c,d){var e=0,f=0,g=0;a:{f=J[265102];if((f|0)<=0){break a}e=1058352;while(1){if(!(K[e+4|0]!=(a|0)|K[e+5|0]!=(b|0))){Co(J[e>>2]);H[e+6|0]=d;J[e>>2]=J[265102];jf(1060400,c);return}e=e+8|0;g=g+1|0;if((g|0)!=(f|0)){continue}break}if((f|0)!=256){break a}pd(4152);return}e=(f<<3)+1058352|0;H[e+6|0]=d;H[e+5|0]=b;H[e+4|0]=a;J[e>>2]=f;jf(1060400,c);Wk(0,J[265102]-1|0)}function iF(a,b){a=a|0;b=b|0;var c=0;b=$c-32|0;$c=b;c=J[a+4>>2];J[b+24>>2]=J[a>>2];J[b+28>>2]=c;if(K[825216]){_d(1043716,0,83);H[825216]=0}J[206301]=15021;J[206302]=85;H[825217]=0;ds(b+24|0);J[206312]=-1;a:{if(!L[b+28>>1]){pd(15939);break a}a=Ag(b+24|0,32,b,2);c=Km(b);J[206313]=c;if((c|0)==-1){break a}if((a|0)>=2){a=Km(b|8);J[206312]=a;if((a|0)==-1){break a}}Im()}$c=b+32|0}function bE(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;H[a+84|0]=0;if(bd[J[J[a+1628>>2]+24>>2]](a+1628|0,b,c,d)|0){a=1}else{a:{b=J[a+60>>2];if((b|0)==-1){break a}b=L[((b<<1)+a|0)+92>>1];if(!b){break a}hj(b);H[a+84|0]=1;return 1}b=J[a+1732>>2];e=J[a+1740>>2];a=($f(J[a+4>>2]-b|0,J[a+8>>2]-e|0,J[a+1736>>2]+(b+J[a+12>>2]|0)|0,J[a+1744>>2]+(e+J[a+16>>2]|0)|0,c,d)|0)!=0}return a|0}function cm(a){var b=0,c=0,d=0,e=0,f=0,g=0;b=$c-1040|0;$c=b;c=J[a+4>>2];J[b+1036>>2]=67043328;J[b+1032>>2]=b;e=J[c>>2];a:{if(!e){c=b;d=0;break a}d=c;while(1){g=b+1032|0;if(f){Ud(g,44);e=J[d>>2]}od(g,e);f=f+1|0;d=(f<<2)+c|0;e=J[d>>2];if(e){continue}break}c=J[b+1032>>2];d=L[b+1036>>1]}H[d+c|0]=0;J[467443]=J[a+8>>2];Kc(J[b+1032>>2],J[a+12>>2],J[a+16>>2]);$c=b+1040|0;return 0}function cE(a,b){a=a|0;b=Q(b);var c=0,d=0;c=J[a+1732>>2];d=J[a+1740>>2];if(!(bl(J[a+4>>2]-c|0,J[a+8>>2]-d|0,J[a+1640>>2]+(J[a+1736>>2]+(c+J[a+12>>2]|0)|0)|0,J[a+1744>>2]+(d+J[a+16>>2]|0)|0)&255)){return 0}c=J[a+1668>>2];bd[J[J[a+1628>>2]+20>>2]](a+1628|0,b)|0;d=J[a+60>>2];if((d|0)!=-1){c=d+P(J[a+44>>2],J[a+1668>>2]-c|0)|0;J[a+60>>2]=(c|0)>=J[a+40>>2]?-1:c;Sg(a,0)}return 1}function xs(a,b,c){var d=0,e=0,f=0;J[a>>2]=0;a:{if(!c){break a}f=H[b|0];d=f&255;b:{if((f|0)>=0){e=1;break b}c:{if((d&224)==192){if(c>>>0<2){break a}c=d<<6&1984;e=2;d=1;break c}if((d&240)==224){if(c>>>0<3){break a}c=d<<12&61440|(K[b+1|0]&63)<<6;e=3;d=2;break c}if(c>>>0<4){break a}c=d<<18&1835008|(K[b+1|0]&63)<<12|(K[b+2|0]&63)<<6;e=4;d=3}d=K[b+d|0]&63|c}J[a>>2]=d}return e}function Gr(a){var b=0,c=Q(0),d=0,e=0;while(1){if(K[a+20|0]>>>d&1){e=b;b=(d<<3)+1056464|0;c=Q(Kp(Q((J[b>>2]-J[a+4>>2]|0)+(J[a+12>>2]/-2|0)|0),Q((J[b+4>>2]-J[a+8>>2]|0)+(J[a+16>>2]/-2|0)|0))*Q(57.2957763671875));b=e|c>=Q(30)&c<=Q(150);b=c>=Q(-60)?c<=Q(60)?b|4:b:b;b=c>=Q(-150)?c<=Q(-30)?b|2:b:b;e=b|8;b=c<Q(-120)?e:c>Q(120)?e:b}d=d+1|0;if((d|0)!=32){continue}break}return b}function uL(a){a=a|0;var b=0,c=Q(0),d=Q(0),e=Q(0),f=Q(0),g=Q(0);b=P(L[a+52>>1],12)+66896|0;c=N[b+18432>>2];f=N[b+27648>>2];d=N[b+18436>>2];g=N[b+27652>>2];e=Q(Q(N[b+27656>>2]-N[b+18440>>2])+Q(-.046875));N[a+100>>2]=e>Q(.0078125)?e:Q(.0078125);d=Q(Q(g-d)+Q(-.046875));N[a+96>>2]=d>Q(.0078125)?d:Q(.0078125);c=Q(Q(f-c)+Q(-.046875));N[a+92>>2]=c>Q(.0078125)?c:Q(.0078125)}function uI(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;c=$c-176|0;$c=c;d=K[a+828920|0];e=K[b+828920|0];a:{if((d|0)!=(e|0)){a=d>>>0<e>>>0?-1:1;break a}J[c+172>>2]=4194304;a=L[(a<<1)+828408>>1];J[c+168>>2]=c+96;d=c+8|0;$d(d,829176,a-2|0);a=c+168|0;Xg(a,d);J[c+92>>2]=4194304;b=L[(b<<1)+828408>>1];J[c+88>>2]=c+16;$d(c,829176,b-2|0);b=c+88|0;Xg(b,c);a=ck(a,b)}$c=c+176|0;return a|0}function pC(a,b){a=a|0;b=b|0;var c=0,d=0;c=J[b+8>>2];d=P(c,796)+834384|0;H[d+462|0]=1;b=0;a:{if(J[263697]){break a}b:{if(!K[d+476|0]){break b}a=P(c,796)+834384|0;if(!K[a+470|0]){break b}b=1;if(K[a+493|0]){break a}b=K[a+494|0];if(b){J[a+40>>2]=0}iq(d+460|0,!b);return 1}a=P(c,796)+834384|0;if(K[a+790|0]){break a}H[a+790|0]=1;if(!K[834368]){break a}pd(16244)}return b|0}function hg(a,b,c){var d=Q(0),e=0,f=0;d=Nf(Q((a&255)>>>0),Q((b&255)>>>0),c);a:{if(d<Q(4294967296)&d>=Q(0)){e=~~d>>>0;break a}e=0}f=e|a&-16777216;d=Nf(Q((a>>>8&255)>>>0),Q((b>>>8&255)>>>0),c);b:{if(d<Q(4294967296)&d>=Q(0)){e=~~d>>>0;break b}e=0}e=f|e<<8;c=Nf(Q((a>>>16&255)>>>0),Q((b>>>16&255)>>>0),c);c:{if(c<Q(4294967296)&c>=Q(0)){a=~~c>>>0;break c}a=0}return e|a<<16}function _g(a){var b=0,c=0,d=0,e=Q(0);d=1778160,e=oj(),N[d>>2]=e;bd[J[J[444511]+8>>2]](1778044);b=J[a+80>>2];c=J[444513];J[a+884>>2]=J[467304]+(J[a+100>>2]-((b|0)<(c|0)?b:c)|0);bd[J[J[a+856>>2]+8>>2]](a+856|0);J[a+792>>2]=(J[467304]-J[a+864>>2]|0)+(K[a+876|0]?5:10);bd[J[J[a+764>>2]+8>>2]](a+764|0);J[a+700>>2]=J[a+780>>2]+J[a+792>>2];bd[J[J[a+672>>2]+8>>2]](a+672|0)}function VI(a){a=a|0;var b=0;J[a+8>>2]=280;b=a+332|0;Kf(b);J[b+264>>2]=-1;J[b+268>>2]=-1;J[b+260>>2]=0;J[b+116>>2]=1065353216;I[b+22>>1]=513;J[b>>2]=44668;J[b+272>>2]=-1;J[b+276>>2]=-1;J[b+280>>2]=-1;J[b+284>>2]=-1;J[b+288>>2]=-1;J[b+292>>2]=-1;Vj(a+48|0);Vj(a+120|0);H[a+69|0]=K[a+69|0]|4;H[a+141|0]=K[a+141|0]|4;nd(1044496,a,837);nd(1041636,a,838);nd(1045016,a,838)}function JI(a){a=a|0;var b=0,c=0,d=0,e=0,f=Q(0);d=a+48|0;md(d,0,0,J[467300]+2|0,J[467301]+2|0);b=J[a- -64>>2]+J[a+56>>2]|0;I[a+198>>1]=b;c=a+120|0;md(c,0,0,J[467300]+2|0,0);a:{if(K[1054197]){J[a+148>>2]=J[a+76>>2];J[a+76>>2]=b;bd[J[J[a+48>>2]+8>>2]](d);break a}J[a+148>>2]=L[a+202>>1]+b}e=1778160,f=oj(),N[e>>2]=f;bd[J[J[444511]+8>>2]](1778044);bd[J[J[c>>2]+8>>2]](c)}function gE(a,b){a=a|0;b=b|0;var c=0,d=Q(0);de(J[(K[1054732]?40:36)+1054724>>2]);he(8,b);c=J[a+260>>2];if(c){qo(c,b+8|0,a+152|0)}if(K[1054793]){I[a+130>>1]=J[a+8>>2]+(J[a+16>>2]/2|0)-(L[a+134>>1]>>>1);d=Q(Q(N[a+96>>2]*Q(8))+Q(N[a+104>>2]+Q(J[a+4>>2])));a:{if(Q(R(d))<Q(2147483648)){b=~~d;break a}b=-2147483648}I[a+128>>1]=b-(L[a+132>>1]>>>1|0);kh(a+124|0)}return 116}function YG(a){a=a|0;var b=0,c=0,d=0;b=$c-32|0;$c=b;if(L[a+4>>1]){H[1812020]=0;c=J[a+4>>2];a=J[a>>2];J[b+24>>2]=a;J[b+28>>2]=c;if((c&65535)>>>0>=65){while(1){a=b+8|0;c=b+24|0;Ke(a,c,0,64);d=J[b+12>>2];J[b+16>>2]=J[b+8>>2];J[b+20>>2]=d;Ms(b+16|0);Qe(a,c,64);c=J[b+12>>2];a=J[b+8>>2];J[b+24>>2]=a;J[b+28>>2]=c;if((c&65535)>>>0>64){continue}break}}Ms(b+24|0)}$c=b+32|0}function pG(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0;f=$c-16|0;$c=f;e=J[a+36>>2];a:{if(!e){e=J[a+44>>2];J[a+32>>2]=e;g=J[a+48>>2];e=bd[J[g>>2]](g,e,J[a+40>>2],f+12|0)|0;if(e){break a}e=J[f+12>>2];J[a+36>>2]=e;J[a+52>>2]=J[a+52>>2]+e}g=b;b=c>>>0>e>>>0?e:c;Kd(g,J[a+32>>2],b);J[a+32>>2]=b+J[a+32>>2];J[a+36>>2]=J[a+36>>2]-b;J[d>>2]=b;e=0}$c=f+16|0;return e|0}function cu(a){a=a|0;var b=0,c=0,d=Q(0),e=0,f=0,g=0;b=J[467304]/128<<3;b=(b|0)<=8?8:b;b=b>>>0>=40?40:b;f=a,g=mf(1,0,P(b,J[458677]),J[467303]),J[f+36>>2]=g;c=mf(1,0,b<<4,J[467304]);J[a+44>>2]=b;J[a+40>>2]=c;c=a+156|0;md(c,1,0,0,0);e=J[a+40>>2];d=Q(N[467294]*Q(30));a:{if(Q(R(d))<Q(2147483648)){b=~~d;break a}b=-2147483648}J[a+184>>2]=e-b;bd[J[J[a+156>>2]+8>>2]](c)}function Zi(a,b){var c=0,d=0,e=0,f=0,g=0,h=0;e=J[a+20>>2];if((e|0)>0){h=J[a+24>>2]+b|0;f=J[a+16>>2];while(1){d=(P(b,c)+h|0)%(e|0)|0;g=(d>>31&e)+d|0;d=J[(g<<2)+f>>2];if(!(!d|(K[d+21|0]&3)!=2)){c=0;while(1){b=J[(c<<2)+f>>2];if(b){H[b+20|0]=0}c=c+1|0;if((e|0)!=(c|0)){continue}break}J[a+24>>2]=g;H[d+20|0]=1;return 1}c=c+1|0;if((e|0)!=(c|0)){continue}break}}return 0}function $k(a){var b=0,c=0,d=0;c=J[263682];if((c|0)>0){while(1){if(J[(b<<2)+1054816>>2]==(a|0)){d=c-1|0;if((d|0)>(b|0)){while(1){c=b+1|0;J[(b<<2)+1054816>>2]=J[(c<<2)+1054816>>2];H[b+1054856|0]=K[b+1054857|0];b=c;if((d|0)!=(b|0)){continue}break}}J[263682]=d;bd[J[J[a>>2]+56>>2]](a);bd[J[J[a>>2]+8>>2]](a);return 1}b=b+1|0;if((c|0)!=(b|0)){continue}break}}return 0}function kE(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=Q(0),h=0;if(lg(a,c,d)){h=J[a+16>>2];g=N[a+96>>2];a:{if(Q(R(g))<Q(2147483648)){f=~~g;break a}f=-2147483648}while(1){if($f(J[a+4>>2]+P(e,f)|0,J[a+8>>2],f,h,c,d)){if(K[1054793]){if((e|0)==8){it();return 1}a=(e<<2)+a|0;J[a+296>>2]=0;J[a+264>>2]=b}ch(e);return 1}e=e+1|0;if((e|0)!=9){continue}break}}return 0}function Ms(a){var b=0,c=0,d=0;b=$c-144|0;$c=b;J[b+140>>2]=8388608;J[b+136>>2]=b;if(!Gq(H[1812020])){c=b+136|0;Ud(c,38);Ud(c,H[1812020])}ye(b+136|0,a);a=L[b+140>>1];if(a){while(1){c=J[b+136>>2]+d|0;if(K[c|0]==37){H[c|0]=38;a=L[b+140>>1]}d=d+1|0;if(d>>>0<(a&65535)>>>0){continue}break}}a=b+136|0;Li(a);a=Hq(a,L[b+140>>1]);if(a){H[1812020]=a}an(b+136|0);$c=b+144|0}function wi(a,b){var c=0,d=0,e=0,f=0,g=0,h=0;c=$c-16|0;$c=c;g=c,h=Ej(b,1),J[g+12>>2]=h;d=L[b+4>>1];if(K[825312]){e=J[c+12>>2];J[c+12>>2]=e-((e-d|0)/3<<1)}J[a+44>>2]=J[c+12>>2];d=J[a+40>>2];if((d|0)>0){e=J[a+84>>2];while(1){I[(e+P(f,28)|0)+10>>1]=K[(a+f|0)+52|0]?0:L[c+12>>1];f=f+1|0;if((d|0)!=(f|0)){continue}break}}J[a+48>>2]=b;bd[J[J[a>>2]+8>>2]](a);$c=c+16|0}function hw(a){a=a|0;var b=0;J[a+104>>2]=0;b=rd(a,5597,313,314,0,0)<<5;J[b+1074108>>2]=466;J[b+1074104>>2]=467;b=rd(a,5229,313,314,0,0)<<5;J[b+1074108>>2]=468;J[b+1074104>>2]=469;b=rd(a,5655,313,314,0,0)<<5;J[b+1074108>>2]=470;J[b+1074104>>2]=471;rd(a,9044,472,473,474,8921);Zf(a,-1,464);J[a+92>>2]=475;pe(a,1075872);md(1075872,1,1,0,100);le(1075064,K[1054208])}function _d(a,b,c){var d=0,e=0,f=0;e=J[a+256>>2];if((e|0)>0){while(1){f=(d<<2)+a|0;if(!(J[f>>2]!=(c|0)|J[f+128>>2]!=(b|0))){b=e-1|0;if((b|0)>(d|0)){c=a+128|0;while(1){e=d<<2;d=d+1|0;f=d<<2;J[e+a>>2]=J[f+a>>2];J[c+e>>2]=J[c+f>>2];if((b|0)!=(d|0)){continue}break}}J[a+256>>2]=b;a=(b<<2)+a|0;J[a>>2]=0;J[a+128>>2]=0;return}d=d+1|0;if((e|0)!=(d|0)){continue}break}}}function _H(a){a=a|0;var b=0;J[a+28>>2]=5;J[a+20>>2]=0;J[a+16>>2]=a+712;Ir(a,a+304|0,5,a+488|0,849);Ir(a,a+396|0,3,a+628|0,850);pe(a,a+88|0);pe(a,a+160|0);pe(a,a+232|0);nd(1046836,a,851);nd(1047356,a,852);b=oe(a);I[a+356>>1]=257;J[a+8>>2]=b;H[a+325|0]=K[a+325|0]|4;H[a+417|0]=K[a+417|0]|4;H[a+109|0]=K[a+109|0]|4;H[a+181|0]=K[a+181|0]|4;H[a+253|0]=K[a+253|0]|4}function Vk(a,b){var c=0,d=0,e=0;a:{e=J[265102];if((e|0)<=0){break a}c=1058352;while(1){if(!(K[c+4|0]!=(a|0)|K[c+5|0]!=(b|0))){Co(J[c>>2]);a=J[265102];if((a|0)<=(d|0)){break a}while(1){b=(d<<3)+1058352|0;d=d+1|0;c=(d<<3)+1058352|0;e=J[c+4>>2];J[b>>2]=J[c>>2];J[b+4>>2]=e;if((a|0)!=(d|0)){continue}break}break a}c=c+8|0;d=d+1|0;if((e|0)!=(d|0)){continue}break}}}function jr(a){var b=0,c=0,d=0,e=0;a:{b:{c:{if(J[a+152>>2]|J[a+144>>2]!=200){break c}c=J[a+156>>2];if(!c){break c}b=J[a+160>>2];H[a+305|0]=(b|0)!=0;if(!b){break b}break a}H[a+305|0]=0;c=J[a+156>>2]}b=J[a+172>>2];J[a+172>>2]=0;qd(c);qd(J[a+172>>2]);J[a+172>>2]=b;J[a+164>>2]=0;J[a+156>>2]=0;J[a+160>>2]=0}d=a,e=se(),J[d+136>>2]=e;J[a+140>>2]=ad;km(1859600,a,0)}function aK(a){a=a|0;var b=0,c=0,d=0;b=$c-16|0;$c=b;I[905892]=0;I[905888]=0;J[b+12>>2]=a+1;a=b+12|0;lk(a,1811772);lk(a,1811780);st(1811772);d=J[207101];a=H[J[b+12>>2]]>99;H[d+460|0]=a;if(!K[52865]){c=P(a,16843009);H[131415]=c;H[131416]=c>>>8;H[131417]=c>>>16;H[131418]=c>>>24;H[132183]=a;H[131419]=a}a=d+504|0;ke(a,1811772);ye(a,1811780);lq(d+460|0);$c=b+16|0}function yJ(a){a=a|0;var b=0,c=0,d=0;c=$c-16|0;$c=c;d=63;a:{b:{while(1){b=d;if(K[b+a|0]&223){break b}d=b-1|0;if(b){continue}break}b=0;break a}b=b+1|0}I[c+14>>1]=64;I[c+12>>1]=b;J[c+8>>2]=a;pt(c+8|0);pr(K[a+64|0]);qr(K[a+65|0]);Pj(vd(a+66|0)<<16>>16);if(K[52945]!=1){tm(vd(a+68|0)<<16>>16);a=vd(a+70|0)<<16>>16;J[12428]=(a|0)<=0?32768:a;Hg(J[12427])}$c=c+16|0}function Uh(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0;b=$c-16|0;$c=b;g=a+908|0;h=J[9218];i=J[9219];while(1){d=i;c=J[a+804>>2]+e|0;f=h;a:{if((c|0)<0){break a}if((c|0)>=J[a+916>>2]){break a}$d(b,g,c);d=J[b+4>>2];f=J[b>>2]}J[b+8>>2]=f;J[b+12>>2]=d;c=(P(e,84)+a|0)+36|0;d=b+8|0;le(c,ld(d,27095));bd[J[a+828>>2]](a,c,d);e=e+1|0;if((e|0)!=5){continue}break}$c=b+16|0}function ms(a,b){var c=0,d=0;c=$c-48|0;$c=c;a:{if((Ag(a,32,c+16|0,3)|0)!=3){pd(27675);a=0;break a}a=0;d=c+16|0;if(!Ze(d,15216,c+4|0,-127,127)){break a}if(!Ze(d|8,15208,c+8|0,-127,127)){break a}if(!Ze(c+32|0,15200,c+12|0,-127,127)){break a}N[b>>2]=Q(J[c+4>>2])*Q(.0625);N[b+4>>2]=Q(J[c+8>>2])*Q(.0625);N[b+8>>2]=Q(J[c+12>>2])*Q(.0625);a=1}$c=c+48|0;return a}function nE(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;a:{while(1){if(Ue(d+39|0,b,c)){break a}d=d+1|0;if((d|0)!=9){continue}break}if(Ue(48,b,c)){a=J[266937];a=((a|0)<=0?8:-1)+a|0;J[266937]=(a|0)>8?a-9|0:a;return 1}if(!Ue(49,b,c)){return 0}a=J[266937];a=((a|0)<-1?10:1)+a|0;J[266937]=(a|0)>8?a-9|0:a;return 1}if(K[1065598]){Sk(d);H[a+120|0]=1;return 1}ch(d);return 1}function jw(){var a=0,b=0,c=Q(0),d=0,e=0;je(780112,0,32768);J[203236]=J[195010];while(1){b=a<<2;c=Q(Q(a|0)*Q(.25));d=b+813056|0,e=hg(J[464867],J[464863],c),J[d>>2]=e;d=b+812960|0,e=hg(J[464868],J[464864],c),J[d>>2]=e;d=b+812992|0,e=hg(J[464869],J[464865],c),J[d>>2]=e;d=b+813024|0,e=hg(J[464870],J[464866],c),J[d>>2]=e;a=a+1|0;if((a|0)!=5){continue}break}}function qE(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=Q(0),f=0;a:{if(J[a+60>>2]!=(b|0)){break a}f=1;c=J[a+44>>2];e=Q(Q(d-(J[a+8>>2]+J[a+56>>2]|0)|0)/Q(Q(J[a+16>>2]-(J[a+72>>2]<<1)|0)/Q(c|0)));b:{if(Q(R(e))<Q(2147483648)){b=~~e;break b}b=-2147483648}J[a+40>>2]=b;d=c-J[a+48>>2]|0;c=(d|0)>(b|0);b=c?b:d;if(c&(b|0)>=0){break a}J[a+40>>2]=(b|0)>0?b:0}return f|0}function Yl(a){var b=0,c=Q(0),d=Q(0),e=Q(0);b=J[a+48>>2];bd[J[b+28>>2]](a);bd[J[b+32>>2]](a);c=N[a+80>>2];N[a+92>>2]=N[a+92>>2]*c;d=N[a+84>>2];N[a+96>>2]=N[a+96>>2]*d;e=N[a+88>>2];N[a+100>>2]=N[a+100>>2]*e;N[a+56>>2]=c*N[a+56>>2];N[a+60>>2]=d*N[a+60>>2];b=a- -64|0;N[b>>2]=e*N[b>>2];N[a+68>>2]=c*N[a+68>>2];N[a+72>>2]=d*N[a+72>>2];N[a+76>>2]=e*N[a+76>>2]}function Nr(a){var b=0,c=0,d=0,e=0;Cd(J[a+84>>2]);b=J[a+40>>2];d=b-1|0;if((b|0)>=2){while(1){b=J[a+84>>2]+P(e,28)|0;J[b+24>>2]=J[b+52>>2];c=J[b+48>>2];J[b+16>>2]=J[b+44>>2];J[b+20>>2]=c;c=J[b+40>>2];J[b+8>>2]=J[b+36>>2];J[b+12>>2]=c;c=J[b+32>>2];J[b>>2]=J[b+28>>2];J[b+4>>2]=c;e=e+1|0;if((e|0)!=(d|0)){continue}break}}J[J[a+84>>2]+P(d,28)>>2]=0;zg(a,d)}function XH(a,b,c){a=a|0;b=b|0;c=c|0;a:{if(K[1054308]){break a}b:{if(c-1>>>0<=2){zg(a+304|0,c+1|0);break b}if(c-11>>>0<=2){zg(a+396|0,13-c|0);break b}c:{switch(c-100|0){case 0:Ce(a+88|0,b,a+52|0);break b;case 1:Ce(a+160|0,b,a- -64|0);break b;case 2:Ce(a+232|0,b,a+76|0);break b;default:break c}}if((c&-2)!=360){break a}zg(a+304|0,c-360|0)}H[a+7|0]=1}}function Hk(a){var b=0,c=0,d=0,e=0;J[16717]=a;a:{if(a){a=Sb()|0;if(a){dj(a,2408,1151);a=0}else{a=1}if(!a){J[16717]=0;return}if(K[66888]){break a}H[66888]=1;a=0;c=64828;while(1){d=a<<3;b=J[d+45376>>2];b:{if(!b){c=62788;break b}b=P(b,204)+c|0;e=J[b>>2];J[b>>2]=e+1;J[(b+P(e,20)|0)+12>>2]=J[d+45380>>2]}a=a+1|0;if((a|0)!=60){continue}break}return}lm()}}function ui(a,b,c,d){var e=0,f=Q(0);e=$c+-64|0;$c=e;Yr(d,N[c>>2],N[c+4>>2],N[c+8>>2]);f=N[a+32>>2];if(f!=Q(0)){Zr(e,Q(f*Q(-.01745329238474369)));me(d,d,e)}f=N[a+24>>2];if(f!=Q(0)){Ai(e,Q(f*Q(-.01745329238474369)));me(d,d,e)}f=N[a+28>>2];if(f!=Q(0)){Em(e,Q(f*Q(-.01745329238474369)));me(d,d,e)}ag(e,N[b>>2],N[b+4>>2],N[b+8>>2]);me(d,d,e);$c=e- -64|0}function Fi(a,b){var c=0,d=0,e=0,f=0,g=0;c=$c-80|0;$c=c;e=Le(4642,0,2147483647,K[1811800]?80:81);g=Le(9170,0,2147483647,0);d=J[b+36>>2];f=1<<d;e=e&f;J[b+68>>2]=e?-1:-8421505;J[c+12>>2]=4194304;d=J[(d<<2)+43216>>2];J[c+8>>2]=c+16;a:{if(!(!e|!(g&f))){Hd(c+8|0,16129,d);break a}if(e){Hd(c+8|0,16111,d);break a}od(c+8|0,d)}gf(b,c+8|0,a+624|0);$c=c+80|0}function $j(a,b,c,d,e){var f=0,g=0,h=0,i=0,j=0,k=0;f=1;a:{if((e|0)<=0){break a}g=c+e|0;h=b+d|0;i=J[a+4>>2];j=J[a>>2];e=0;d=(d|0)<=0;while(1){if(!d){k=(P(c,i)<<2)+j|0;f=b;while(1){a=(f<<2)+k|0;b:{if(!e){e=a;break b}if(J[a>>2]==J[e>>2]){break b}f=0;break a}f=f+1|0;if((h|0)>(f|0)){continue}break}}f=1;c=c+1|0;if((g|0)>(c|0)){continue}break}}return f}function Hf(a,b){var c=0,d=0,e=0;c=$c-16|0;$c=c;d=c+8|0;Wd(d,a);Hm(c,1563656,d,61);e=J[c+4>>2];a=J[c>>2];J[b>>2]=a;J[b+4>>2]=e;a=1;a:{if(e&65535){break a}e=Zg(d,0,45);a=0;if((e|0)==-1){break a}Qe(c,d,e+1|0);a=J[c+4>>2];J[c+8>>2]=J[c>>2];J[c+12>>2]=a;Hm(c,1563656,d,61);a=J[c+4>>2];d=J[c>>2];J[b>>2]=d;J[b+4>>2]=a;a=(a&65535)!=0}$c=c+16|0;return a}function Sj(a,b){var c=0,d=0,e=0,f=0,g=0,h=0;c=$c-16|0;$c=c;if(J[a+40>>2]>0){f=b&255;while(1){bd[J[a+88>>2]](c+8|0,d);b=L[c+12>>1];a:{if(b>>>0<2){break a}g=J[c+8>>2];h=b-2|0;b=0;while(1){e=b+g|0;if(!(K[e|0]!=38|K[e+1|0]!=(f|0))){zg(a,d);break a}e=(b|0)!=(h|0);b=b+1|0;if(e){continue}break}}d=d+1|0;if((d|0)<J[a+40>>2]){continue}break}}$c=c+16|0}function JH(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;a:{if(!(!Ue(8,b,c)|!K[a+2836|0]|K[1054197])){break a}b:{if(J[c+32>>2]!=(b|0)&J[c+36>>2]!=(b|0)){break b}d=J[a+108>>2];if((d|0)==-1){break b}hj(L[((d<<1)+a|0)+140>>1]);break a}if(bd[J[J[a+48>>2]+12>>2]](a+48|0,b,c)|0){a=1}else{a=bd[J[J[444511]+12>>2]](1778044,b,c)|0}return a|0}ge(a);xf(1,0);return 1}function nC(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;a:{if(J[263697]){break a}a=J[b+8>>2];c=P(a,796)+834384|0;H[c+730|0]=1;if(K[c+111|0]){break a}a=P(a,796)+834384|0;if(K[a+495|0]|K[a+494|0]){break a}e=1;d=J[a+488>>2];b=K[a+479|0]?(K[a+493|0]!=0)<<1:0;if(J[a+732>>2]>=(((b|0)<(d|0)?d-1|0:b)|0)){break a}cq(c+728|0);J[a+732>>2]=J[a+732>>2]+1}return e|0}function kf(a,b,c,d){var e=0,f=0,g=0,h=0;e=$c-16|0;$c=e;b=Zg(a,0,b);a:{if((b|0)==-1){b=J[a+4>>2];J[c>>2]=J[a>>2];J[c+4>>2]=b;J[d>>2]=0;J[d+4>>2]=0;break a}f=e+8|0;Ke(f,a,0,b);g=J[e+12>>2];J[c>>2]=J[e+8>>2];J[c+4>>2]=g;Qe(f,a,b+1|0);a=J[e+12>>2];J[d>>2]=J[e+8>>2];J[d+4>>2]=a;Li(c);As(d);if(!L[c+4>>1]){break a}h=L[d+4>>1]!=0}$c=e+16|0;return h}function Om(a,b,c){var d=0;d=$c-640|0;$c=d;J[d+36>>2]=1572864;J[d+32>>2]=d;Ki(d+32|0,Jm(J[c>>2],L[c+4>>1]));a:{b:{if(!L[a+4>>1]|H[1845429]&1){break b}od(a,14288);Je(d+40|0,a);if(K[1845430]){pd(7538);pd(26519);H[1845429]=1}H[1845430]=1;c=d+32|0;Hd(a,6306,c);if(K[1845429]){break b}Hd(b,6284,c);break a}I[a+4>>1]=0;Hd(a,6284,d+32|0)}$c=d+640|0}function Hn(a,b){var c=0,d=0;d=$c-48|0;$c=d;Zn(a);a:{if(J[a+84>>2]){break a}c=b<<2;b=J[(c+a|0)+36>>2];if(!b){break a}c=J[c+J[a+16>>2]>>2];if(!c|H[c+21|0]&1){break a}c=d+40|0;Wd(c,b);c=Ag(c,10,d,5);J[a+1372>>2]=b;J[a+172>>2]=c;b=a+132|0;xg(b);md(b,0,3,0,100);J[a+156>>2]=(J[a+144>>2]/-2|0)+(J[467303]/2|0);bd[J[J[a+132>>2]+8>>2]](b)}$c=d+48|0}function Eg(){var a=0,b=0;J[268507]=2147483647;J[268505]=2147483647;J[268506]=2147483647;a:{if(!J[266966]|!J[464804]){break a}Lk();b=J[266967];a=Kk();J[266967]=a;if((b|0)==(a|0)){break a}qd(J[268508]);J[268509]=0;J[268508]=0;b=P(J[266967],J[268510]);a=Ch(b<<1,20,4298);J[268508]=a;J[268509]=a+P(b,20)}Gd(1067872,0,2048);Gd(1070944,0,2048)}function lK(a){a=a|0;var b=0,c=0,d=0,e=0;b=$c-32|0;$c=b;d=b+20|0;c=J[207101];Wj(d,Q(N[c+20>>2]*Q(.01745329238474369)),Q(Q(N[c+16>>2]*Q(.01745329238474369))+N[203297]));e=b+8|0;Xl(e,c);if(!xt(a,e,d,N[c+456>>2],777)){J[a>>2]=-1;J[a+4>>2]=-1;J[a+112>>2]=-1;J[a+116>>2]=-1;I[a+124>>1]=1536;I[a+60>>1]=0;J[a+8>>2]=-1;J[a+120>>2]=-1}$c=b+32|0}function hn(a,b,c){var d=0,e=0;d=$c-80|0;$c=d;e=L[b+4>>1];if(!(!e|K[(J[b>>2]+e|0)-1|0]!=43)){I[b+4>>1]=e-1}a:{if((a|0)!=255){break a}J[d+76>>2]=4194304;J[d+72>>2]=d;a=d+72|0;Xg(a,b);if(Uf(a,49716)){break a}ke(b,49716)}a=L[c+4>>1];b:{if(!a){ke(c,b);a=L[c+4>>1];if(!a){break b}}if(K[(J[c>>2]+a|0)-1|0]!=43){break b}I[c+4>>1]=a-1}$c=d+80|0}function QJ(a){a=a|0;var b=0,c=0;b=$c-112|0;$c=b;J[b+108>>2]=a+1;c=K[a|0];J[b+100>>2]=4325376;J[b+96>>2]=b+16;a=0;a:{if(K[52857]){a=c;break a}if((c|0)!=255){break a}od(b+96|0,15133)}c=b+96|0;lk(b+108|0,c);if(_e(c,40548)){Qe(b+8|0,c,13);a=J[b+12>>2];J[b+96>>2]=J[b+8>>2];J[b+100>>2]=a;a=3}c=b+96|0;if(!_e(c,40556)){ne(c,a&255)}$c=b+112|0}function uq(a){var b=0,c=0;b=$c-16|0;$c=b;bd[J[J[208596]+8>>2]](834384,a);c=K[a+28|0];if(c&1){c=J[a+4>>2];J[208702]=J[a>>2];J[208703]=c;J[208704]=J[a+8>>2];c=K[a+28|0]}if(c&4){N[208708]=N[a+16>>2]}if(c&2){N[208709]=N[a+12>>2]}bd[J[J[203292]+16>>2]](b+4|0,Q(0));J[203291]=J[b+12>>2];a=J[b+8>>2];J[203289]=J[b+4>>2];J[203290]=a;$c=b+16|0}function $i(a,b,c){var d=0,e=0,f=0;e=J[a+20>>2];a:{if((e|0)<=0){break a}f=J[a+16>>2];a=0;while(1){d=J[(a<<2)+f>>2];if(d){H[d+20|0]=0}a=a+1|0;if((e|0)!=(a|0)){continue}break}if((e|0)<=0){break a}while(1){b:{a=e-1|0;d=J[(a<<2)+f>>2];if(!d){break b}if(!lg(d,b,c)){break b}H[d+20|0]=1;return a}d=e>>>0>1;e=a;if(d){continue}break}}return-1}function Th(a){var b=0,c=0,d=0;b=$c-96|0;$c=b;c=J[a+916>>2];le(a+456|0,J[a+804>>2]<=0);le(a+540|0,J[a+804>>2]>=(c-5|0));J[b+92>>2]=4194304;J[b+88>>2]=b+16;c=b+88|0;od(c,J[a+832>>2]);if(!K[1054197]){J[b+12>>2]=(J[a+804>>2]/5|0)+1;d=Ge(J[a+916>>2],5);J[b+8>>2]=d>>>0<=1?1:d;xe(c,27256,b+12|0,b+8|0)}Ce(a+836|0,b+88|0,a+792|0);$c=b+96|0}function No(){var a=0,b=0,c=0;Gd(726608,0,96);while(1){ul(a&65535);a=a+1|0;if((a|0)!=768){continue}break}while(1){c=b&65535;zp(c);a=0;while(1){yl(c,a&65535);a=a+1|0;if((a|0)!=768){continue}break}b=b+1|0;if((b|0)!=768){continue}break}a=0;while(1){if(K[a+80720|0]==5){uj(a&65535)}a=a+1|0;if((a|0)!=768){continue}break}Gd(131408,1,1536)}function HH(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0;a:{if(J[a+1736>>2]==(b|0)){break a}if(K[1054793]|J[263697]){if(bd[J[J[444511]+24>>2]](J[444593]+332|0,b,c,d)|0){break a}}if((e=0,f=bd[J[J[a+48>>2]+24>>2]](a+48|0,b,c,d)&255,g=K[a+132|0],g?e:f)|(K[1056202]|K[1056203])|(K[1056200]|K[1056201])){break a}ge(a);xf(1,0)}return 1}function $e(a,b,c){var d=0,e=0,f=0;if(b<Q(0)){Ud(a,45);b=Q(-b)}a:{if(Q(R(b))<Q(2147483648)){d=~~b;break a}d=-2147483648}Ki(a,d);e=+b-+(d|0);b:{if(e==0){break b}Ud(a,46);if((c|0)<=0){break b}d=0;while(1){e=e*10;c:{if(R(e)<2147483648){f=~~e;break c}f=-2147483648}Ud(a,((f|0)%10|0)+48<<24>>24);d=d+1|0;if((d|0)!=(c|0)){continue}break}}}function yv(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0;b=$c-80|0;$c=b;J[b+76>>2]=4194304;c=J[265102];J[b+72>>2]=b;if((c|0)>0){g=a+908|0;c=0;while(1){I[b+76>>1]=0;e=(c<<3)+1058352|0;f=K[e+5|0];d=b+72|0;od(d,J[(K[e+4|0]<<2)+50464>>2]);if(f){od(d,27150);Fn(f,d)}jf(g,b+72|0);c=c+1|0;if((c|0)<J[265102]){continue}break}}Sm(a+908|0);$c=b+80|0}function tD(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=Q(0);a:{e=J[465684];if((e|0)<=0){break a}f=J[465686];while(1){if(J[(P(d,312)+f|0)+128>>2]!=(a|0)){d=d+1|0;if((e|0)!=(d|0)){continue}break a}break}if(!c){break a}d=P(d,312)+f|0;g=Q(Q(Q(b|0)*Q(100))/Q(c|0));b:{if(Q(R(g))<Q(2147483648)){a=~~g;break b}a=-2147483648}J[d+132>>2]=a}}function nF(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0;d=b^-1;H[a+76|0]=d&K[a+76|0];c=a+1380|0;H[c|0]=K[c|0]&d;g=J[a+40>>2];if((g|0)>0){c=0;while(1){h=P(c,84)+a|0;e=h+1212|0;f=K[e|0];if(f&b){a=K[J[h+1228>>2]+4|0];if(a){bd[J[(a<<2)+1065840>>2]](0,51228);f=K[e|0]}H[e|0]=f&d;return}c=c+1|0;if((g|0)!=(c|0)){continue}break}}}function Wt(a,b,c){var d=0,e=0;d=$c-32|0;$c=d;J[d+24>>2]=J[b+12>>2];e=J[b+8>>2];J[d+16>>2]=J[b+4>>2];J[d+20>>2]=e;if(K[a+43|0]){N[d+20>>2]=N[b+128>>2]+N[d+20>>2]}if(!(!K[1054197]|!(K[b+54|0]&4))){N[d+20>>2]=N[d+20>>2]+Q(-.09375)}a=J[a+48>>2];J[d+8>>2]=J[d+24>>2];e=J[d+20>>2];J[d>>2]=J[d+16>>2];J[d+4>>2]=e;bd[a|0](b,d,c);$c=d+32|0}function ql(){var a=0,b=0,c=0;a:{b:{if(K[1054197]){b=Le(8881,27,30,30);break b}a=Id(13726,1);b=Le(8881,27,30,30);c=33524;if(a){break a}}a=b-27|0;c=33524;if(a>>>0>3){break a}c=J[(a<<2)+33764>>2]}b=c;a=J[b+4>>2];J[263551]=J[b>>2];J[263552]=a;a=J[b+20>>2];J[263555]=J[b+16>>2];J[263556]=a;a=J[b+12>>2];J[263553]=J[b+8>>2];J[263554]=a}function pl(a,b,c,d,e){var f=0,g=0;wm();xm(c,d,e);J[263558]=a;J[464828]=b;J[263563]=29937;J[263562]=0;H[1054228]=0;c=wf(J[464806],1);J[263559]=c;a:{b:{if(c){if(bd[J[a>>2]](b)|0){break b}}Qf(1468,24736);H[1054228]=1;break a}J[263564]=0;f=1054264,g=se(),J[f>>2]=g;J[263567]=ad;bd[J[J[263558]+4>>2]]()}J[450186]=41172;gt(41156,41164)}function YL(a){a=a|0;var b=0,c=0,d=0;a=J[273222];if(K[a+189|0]){be(1);N[273217]=Q(1)/Q(L[a+184>>1]);N[273218]=Q(1)/Q(L[a+186>>1]);af(P(K[a+189|0],24));b=K[a+188|0];if(b){while(1){d=P(c,104)+a|0;if(K[d+293|0]){vk(d+192|0);b=K[a+188|0]}c=c+1|0;if(b>>>0>c>>>0){continue}break}}Pd(J[273228]);J[273224]=J[273229];ae(P(K[a+189|0],24))}}function mg(a,b,c,d,e,f){var g=0,h=Q(0),i=Q(0);ie(0);g=qe(0,4);h=Q(a|0);N[g+48>>2]=h;i=Q(a+c|0);N[g+32>>2]=i;N[g+16>>2]=i;J[g+12>>2]=e;J[g+8>>2]=0;i=Q(b|0);N[g+4>>2]=i;N[g>>2]=h;J[g+60>>2]=f;J[g+56>>2]=0;h=Q(b+d|0);N[g+52>>2]=h;J[g+44>>2]=f;J[g+40>>2]=0;N[g+36>>2]=h;J[g+28>>2]=e;J[g+24>>2]=0;N[g+20>>2]=i;Pd(J[263616]);he(4,0)}function ho(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;e=J[464807];c=(a|0)/(e|0)|0;d=J[464809];b=(c|0)/(d|0)|0;d=c-P(b,d)|0;c=a-P(c,e)|0;if((c|0)>0){Xh(a-1|0,c-1|0,b,d)}if((c|0)<J[464810]){Xh(a+1|0,c+1|0,b,d)}if((d|0)>0){Xh(a-J[464807]|0,c,b,d-1|0)}if((d|0)<J[464812]){Xh(J[464807]+a|0,c,b,d+1|0)}if((b|0)>0){Xh(a-J[464813]|0,c,b-1|0,d)}}function eo(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;e=J[464807];c=(a|0)/(e|0)|0;d=J[464809];b=(c|0)/(d|0)|0;d=c-P(b,d)|0;c=a-P(c,e)|0;if((c|0)>0){Wh(a-1|0,c-1|0,b,d)}if((c|0)<J[464810]){Wh(a+1|0,c+1|0,b,d)}if((d|0)>0){Wh(a-J[464807]|0,c,b,d-1|0)}if((d|0)<J[464812]){Wh(J[464807]+a|0,c,b,d+1|0)}if((b|0)>0){Wh(a-J[464813]|0,c,b-1|0,d)}}function Ue(a,b,c){var d=0,e=0,f=0;a:{f=J[c+72>>2];d=f+(a<<1)|0;b:{if(!K[d+1|0]){a=0;while(1){e=(a<<1)+f|0;c:{if(!K[e+1|0]){break c}if(!(bd[J[c+12>>2]](c,K[e|0])|0)){break c}if(K[e+1|0]==(b|0)){break a}}a=a+1|0;if((a|0)!=50){continue}break}break b}if(!(bd[J[c+12>>2]](c,K[d|0])|0)){break a}d=d+1|0}return K[d|0]==(b|0)}return 0}function UK(a){a=a|0;yf(a);af(144);yd(Q(N[a+16>>2]*Q(-.01745329238474369)),Q(0),Q(0),1553648,1);If(1553664);yd(N[a+164>>2],Q(0),Q(0),1553680,0);yd(N[a+172>>2],Q(0),Q(0),1553696,0);yd(Q(1.5707963705062866),Q(0),N[a+184>>2],1553712,0);yd(Q(1.5707963705062866),Q(0),N[a+192>>2],1553728,0);Pd(J[273228]);J[273224]=J[273229];ae(144)}function Zt(a){var b=0,c=0,d=0;b=$c-96|0;$c=b;a:{if(K[a+36|0]){ee(a+620|0,19323,a+56|0);break a}c=J[a+40>>2];if(c){J[b+92>>2]=4194304;N[b+12>>2]=Q(c>>>0)*Q(9.5367431640625e-7);J[b+88>>2]=b+16;c=b+88|0;Hd(c,19122,b+12|0);Ce(a+620|0,c,a+56|0);break a}c=a+56|0;d=a+620|0;if(K[a+38|0]){ee(d,8548,c);break a}ee(d,26828,c)}$c=b+96|0}function uf(a,b,c,d,e){var f=0,g=Q(0),h=Q(0);ie(0);f=qe(0,4);g=Q(a|0);N[f+48>>2]=g;h=Q(a+c|0);N[f+32>>2]=h;N[f+16>>2]=h;J[f+12>>2]=e;J[f+8>>2]=0;h=Q(b|0);N[f+4>>2]=h;N[f>>2]=g;J[f+60>>2]=e;J[f+56>>2]=0;g=Q(b+d|0);N[f+52>>2]=g;J[f+44>>2]=e;J[f+40>>2]=0;N[f+36>>2]=g;J[f+28>>2]=e;J[f+24>>2]=0;N[f+20>>2]=h;Pd(J[263616]);he(4,0)}function mG(a,b){a=a|0;b=b|0;var c=0;c=$c-48|0;$c=c;a:{if((b|0)!=3){pd(22087);break a}b=J[207101];b:{c:{if(!Pe(a,c+4|0)){break c}if(!Pe(a+8|0,c+8|0)){break c}if(Pe(a+16|0,c+12|0)){break b}}pd(5035);break a}J[c+24>>2]=J[c+12>>2];a=J[c+8>>2];J[c+16>>2]=J[c+4>>2];J[c+20>>2]=a;H[c+44|0]=1;bd[J[J[b>>2]+8>>2]](b,c+16|0)}$c=c+48|0}function Ko(a){a=a|0;a=J[194990];if(a){qd(a);J[194994]=0;J[194995]=0;J[194992]=0;J[194993]=0;J[194990]=0;J[194991]=0}a=J[194996];if(a){qd(a);J[195e3]=0;J[195001]=0;J[194998]=0;J[194999]=0;J[194996]=0;J[194997]=0}J[263560]=J[464804];J[195003]=J[464810]-2;J[195004]=J[464811]-2;J[195005]=J[464812]-2;th(780024);J[263561]=780024}function aL(a){a=a|0;yf(a);af(288);Mt(a);yd(Q(N[a+16>>2]*Q(-.01745329238474369)),Q(0),Q(0),1551248,1);If(1551264);yd(N[a+164>>2],Q(0),Q(0),1551280,0);yd(N[a+172>>2],Q(0),Q(0),1551296,0);yd(N[a+172>>2],Q(0),Q(0),1551312,0);yd(N[a+164>>2],Q(0),Q(0),1551328,0);Pd(J[273228]);J[273224]=J[273229];ae(144);de(J[12912]);he(144,144)}function Yv(a){a=a|0;var b=0,c=0,d=0,e=0;J[a+28>>2]=12;J[a+20>>2]=0;J[a+16>>2]=1075824;while(1){c=b<<2;J[c+J[a+16>>2]>>2]=0;J[(a+c|0)+36>>2]=0;b=b+1|0;if((b|0)!=11){continue}break}J[a+24>>2]=-1;J[a+84>>2]=0;bd[J[a+88>>2]](a);Rj(a+132|0,5,a+224|0,476);J[a+172>>2]=0;nd(1043976,a,477);nd(1046316,a,478);d=a,e=oe(a),J[d+8>>2]=e}function Nn(a,b,c){var d=0,e=0;e=J[a+24>>2];while(1){e=J[(d<<2)+a>>2]+e|0;d=d+1|0;if((d|0)!=6){continue}break}J[c>>2]=-1;if(!e){return 0}d=J[b>>2];J[c>>2]=d;J[b>>2]=e+d;I[c+8>>1]=J[a>>2];I[c+10>>1]=J[a+4>>2];I[c+12>>1]=J[a+8>>2];I[c+14>>1]=J[a+12>>2];I[c+16>>1]=J[a+16>>2];I[c+18>>1]=J[a+20>>2];J[c+4>>2]=J[a+24>>2];return 1}function ck(a,b){var c=0,d=0,e=0,f=0,g=0,h=0;a:{c=L[a+4>>1];d=L[b+4>>1];e=c>>>0<d>>>0?c:d;if(!e){break a}g=J[b>>2];h=J[a>>2];b=0;while(1){a=K[b+h|0];f=(a-65&255)>>>0<26?a+32|0:a;a=K[b+g|0];a=(a-65&255)>>>0<26?a+32|0:a;if((f&255)==(a&255)){b=b+1|0;if((e|0)!=(b|0)){continue}break a}break}return(f&255)-(a&255)|0}return c-d|0}function Hj(a,b){var c=0,d=0,e=0,f=0;d=$c-16|0;$c=d;wc(6208,d+8|0,d|0)|0;c=O[d+8>>3];a:{if(c==0){break a}e=O[d>>3];if(e==0){break a}c=+(P(J[467303],J[a>>2])|0)/c;b:{if(R(c)<2147483648){f=~~c;break b}f=-2147483648}J[a>>2]=f;c=+(P(J[467304],J[b>>2])|0)/e;c:{if(R(c)<2147483648){a=~~c;break c}a=-2147483648}J[b>>2]=a}$c=d+16|0}function Dt(a,b,c){var d=0,e=0;a:{b:{d=J[464807];if(d>>>0<=a>>>0|M[464808]<=b>>>0){break b}e=J[464809];if(e>>>0<=c>>>0){break b}a=P(P(b,e)+c|0,d)+a|0;a=J[464818]&(K[a+J[464805]|0]<<8|K[a+J[464804]|0]);break a}c=J[464849];a=0;if((c|0)<=(b|0)){break a}a=L[929696];if((c+J[464850]|0)<=(b|0)){break a}a=L[929697]}return a&65535}function uo(a){var b=0,c=0,d=0,e=0,f=0,g=0;a:{b:{if(a>>>0<=65){d=K[1054211];e=J[263554];f=K[1054213];g=K[1054197];while(1){c:{if(g){c=0;if(b>>>0>=f>>>0){break c}c=K[b+e|0];break c}c=0;if(b>>>0>=d>>>0){break c}c=b+1|0}if((c&65535)==(a|0)){break b}b=b+1|0;if((b|0)!=65){continue}break}break a}b=a-1|0}I[(b<<1)+1066210>>1]=a}}function oF(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;a:{if(J[263697]){break a}c=lj(a,b,c,d);if((c|0)<=12){return(c^-1)>>>31|0}c=J[J[a+16>>2]+(c<<2)>>2];H[c+20|0]=K[c+20|0]|b;b=0;d=J[a+40>>2];if((d|0)<=0){return 1}while(1){if((c|0)!=((P(b,84)+a|0)+1192|0)){e=1;b=b+1|0;if((d|0)!=(b|0)){continue}break a}break}e=3}return e|0}function ZC(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0;a=$c-16|0;$c=a;d=J[b+8>>2];if((d|0)>0){c=0;while(1){e=P(c,52)+b|0;if(J[e+56>>2]){J[a+12>>2]=J[e- -64>>2];J[a+8>>2]=J[e+68>>2];d=a+12|0;f=a+8|0;ta(d|0,f|0);Hj(d,f);Go(J[e+28>>2],J[a+12>>2],J[a+8>>2]);d=J[b+8>>2]}c=c+1|0;if((d|0)>(c|0)){continue}break}}$c=a+16|0;return 1}function AD(a){a=a|0;var b=0,c=Q(0),d=Q(0),e=Q(0);e=N[467293];c=Q(N[a+40>>2]*Q(128));a:{if(Q(R(c))<Q(2147483648)){b=~~c;break a}b=-2147483648}d=Q(b|0);c=Q(e*d);b:{if(Q(R(c))<Q(2147483648)){b=~~c;break b}b=-2147483648}J[a+12>>2]=b;d=Q(N[467294]*d);c:{if(Q(R(d))<Q(2147483648)){b=~~d;break c}b=-2147483648}J[a+16>>2]=b;_f(a)}function wN(a){a=a|0;var b=0,c=0,d=0;d=$c-16|0;$c=d;c=d+4|0;te(c);b=a+36|0;nf(b);Zd(a);Qg(a+300|0,b);Qg(a+600|0,b);Qg(a+900|0,b);Qg(a+1200|0,b);ee(a+1500|0,19672,b);ee(a+1572|0,19552,b);ee(a+1644|0,19664,b);ee(a+1716|0,19679,b);ee(a+1788|0,9721,b);td(a+48|0,4459,c);td(a+132|0,17501,c);td(a+216|0,9861,c);Ed(c);$c=d+16|0}function vD(a){a=a|0;var b=0,c=0,d=0,e=0;d=se();e=ad;a=J[464900];if((a|0)>0){while(1){c=a-1|0;b=J[464902]+P(c,312)|0;if((Oe(J[b+136>>2],J[b+140>>2],d,e)|0)>=1e4){vf(17071,b);qd(J[b+156>>2]);qd(J[b+172>>2]);J[b+172>>2]=0;J[b+156>>2]=0;J[b+160>>2]=0;J[b+164>>2]=0;Dh(1859600,c)}b=a>>>0>1;a=c;if(b){continue}break}}return 1}function SM(a){a=a|0;var b=0,c=0,d=0;d=$c-16|0;$c=d;Zd(a);c=a+84|0;te(c);nf(d+4|0);if(J[a+40>>2]>0){while(1){yk(a,b);b=b+1|0;if((b|0)<J[a+40>>2]){continue}break}}ee(a+96|0,J[a+76>>2],c);b=d+4|0;ee(a+168|0,J[a+80>>2],b);td(a+240|0,13837,c);Ed(b);if(J[a+52>>2]|J[a+56>>2]){td(a+324|0,19550,c);td(a+408|0,19454,c)}$c=d+16|0}function UJ(a){a=a|0;var b=0,c=0;b=$c-32|0;$c=b;c=K[a|0];H[b+28|0]=199;N[b>>2]=Q(H[a+1|0])*Q(.03125);N[b+4>>2]=Q(H[a+2|0])*Q(.03125);N[b+8>>2]=Q(H[a+3|0])*Q(.03125);N[b+16>>2]=Q(Q(K[a+4|0])*Q(360))*Q(.00390625);N[b+12>>2]=Q(Q(K[a+5|0])*Q(360))*Q(.00390625);a=J[(c<<2)+827376>>2];if(a){bd[J[J[a>>2]+8>>2]](a,b)}$c=b+32|0}function Dp(a){var b=0,c=0,d=0,e=Q(0),f=0;c=P(a,12)+66896|0;b=N[c+18432>>2]!=Q(0)?254:255;b=N[c+27648>>2]!=Q(1)?b&253:b;b=N[c+18440>>2]!=Q(0)?b&251:b;b=N[c+27656>>2]!=Q(1)?b&247:b;e=N[c+18436>>2];b=e!=Q(0)?b&239:b;f=b&223;d=b;b=N[c+27652>>2]!=Q(1);c=b?f:d;d=a+79952|0;if(!(b|e==Q(0))){c=K[a+80720|0]==4?c:c&191}H[d|0]=c}function kF(a){a=a|0;var b=0,c=0,d=0;Zd(a);d=a+44|0;te(d);if(J[a+36>>2]>0){while(1){c=P(b,84)+a|0;td(c+100|0,J[J[c+136>>2]>>2],d);b=b+1|0;if((b|0)<J[a+36>>2]){continue}break}}b=0;if(J[a+40>>2]>0){while(1){c=P(b,84)+a|0;td(c+1192|0,J[J[c+1228>>2]>>2],d);b=b+1|0;if((b|0)<J[a+40>>2]){continue}break}}td(a+1360|0,26854,d)}function Ku(a){a=a|0;var b=0,c=0,d=0,e=0;nd(1043976,a,526);J[a+16>>2]=a+876;J[a+28>>2]=10;J[a+32>>2]=4;J[a+20>>2]=0;J[a+24>>2]=-1;c=a+48|0;while(1){xd(a,P(b,84)+c|0,300,J[P(b,12)+37032>>2]);b=b+1|0;if((b|0)!=8){continue}break}pe(a,a+720|0);xd(a,a+792|0,K[1054197]?400:J[467303]<300?200:400,517);d=a,e=oe(a),J[d+8>>2]=e}function Fq(a,b,c,d,e,f){var g=0,h=0,i=0;a:{if((e|0)<=0){break a}g=c+e|0;h=b+d|0;d=(d|0)<=0;while(1){if(J[a+8>>2]<=(c|0)){break a}b:{if(d){break b}i=J[a>>2]+(P(J[a+4>>2],c)<<2)|0;e=b;while(1){if(J[a+4>>2]<=(e|0)){break b}J[(e<<2)+i>>2]=f;e=e+1|0;if((h|0)>(e|0)){continue}break}}c=c+1|0;if((g|0)>(c|0)){continue}break}}}function rG(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;a:{c=J[a+52>>2];if(c>>>0<=b>>>0){break a}d=J[a+44>>2];e=J[a+36>>2]+(J[a+32>>2]-d|0)|0;c=c-e|0;if(c>>>0>b>>>0){break a}b=b-c|0;J[a+36>>2]=e-b;J[a+32>>2]=b+d;return 0}c=J[a+48>>2];c=bd[J[c+16>>2]](c,b)|0;if(!c){J[a+52>>2]=b;J[a+36>>2]=0;J[a+32>>2]=J[a+44>>2];c=0}return c|0}function Yd(a){var b=0,c=0;b=$c-3872|0;$c=b;J[b+3084>>2]=0;J[b+3080>>2]=201195520;J[b+3076>>2]=b;c=b+3076|0;od(c,29699);if(a){Hd(c,28790,a)}J[b+3084>>2]=1;Jj(J[b+3076>>2],L[b+3080>>1]);a=b+3076|0;od(a,29876);od(a,29818);Jj(29737,16);H[J[b+3076>>2]+L[b+3080>>1]|0]=0;Qf(1328,J[b+3076>>2]);br(J[b+3084>>2]);$c=b+3872|0}function rf(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0;e=L[a+4>>1];if(!e){return-1}g=K[b|0];while(1){if(!g){return 0}i=(c>>>0>e>>>0?c:e)+h|0;f=g;d=0;a:{while(1){if((d|0)==(i|0)|K[(J[a>>2]+d|0)+c|0]!=(f&255)){break a}d=d+1|0;f=K[d+b|0];if(f){continue}break}return c}h=h-1|0;c=c+1|0;if((e|0)!=(c|0)){continue}break}return-1}function Bo(a,b){var c=0,d=0,e=0,f=0;c=$c-48|0;$c=c;I[a+4>>1]=L[a+4>>1]-7;J[a>>2]=J[a>>2]+7;d=a;a=c+40|0;e=c+32|0;a:{if(!kf(d,38,a,e)){break a}d=b;b=c+24|0;f=c+16|0;if(!kf(d,38,b,f)){break a}a=Ei(a,0,33888,172);if(!a){break a}if(!Mh(e,c+15|0)){break a}if(!ws(b,c+14|0)){break a}jj(a,K[c+15|0],f,K[c+14|0])}$c=c+48|0}function cJ(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0;a:{if(K[52793]){a=(vd(a)>>>0)%768|0;break a}a=K[a|0]}b=a+66896|0;d=K[b+768|0];ul(a);Jp(a);to(a);if(a>>>0<=65){uo(a)}c=(a>>>3&8188)+726608|0;e=J[c>>2];f=c,g=HN(a)&e,J[f>>2]=g;Nd(1045016);if(K[a+80720|0]==5){uj(a)}if(!(!K[1859276]|K[b+768|0]==(d|0))){bd[J[266956]]()}}function yi(a,b,c){var d=0,e=0;d=$c-16|0;$c=d;b=(b<<3)+a|0;e=J[b+72>>2];b=J[b+76>>2];J[d+8>>2]=e;J[d+12>>2]=b;a:{if(K[a+144|0]){if(!(b&65535)){break a}b=0;while(1){a=b+1|0;b=K[J[d+8>>2]+b|0];if((b|0)==37){b=Jq(d+8|0,a)?38:37}Ud(c,b<<24>>24);b=a;if(b>>>0<L[d+12>>1]){continue}break}break a}ye(c,d+8|0)}$c=d+16|0}function Pn(a,b){a=a|0;b=b|0;J[272035]=29937;J[272033]=5;J[272031]=-140;J[272032]=-40;H[1088066]=1;H[1088064]=1;J[272015]=37284;J[272027]=36084;J[272025]=10;J[272026]=36096;a=K[1054198];J[272030]=a?260:300;J[272029]=a?502:0;J[272034]=a?4997:5013;J[272014]=K[1056337]==2?1056736:51152;J[272028]=0;Ad(1088060,50)}function LJ(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;c=$c-16|0;$c=c;d=63;a:{b:{while(1){b=d;if(K[b+a|0]&223){break b}d=b-1|0;if(b){continue}break}b=0;break a}b=b+1|0}I[c+12>>1]=b;I[c+14>>1]=64;J[c+8>>2]=a;d=c+8|0;e=1687968,f=_e(d,40740),H[e|0]=f;Od(6529,d);e=1777708,f=vd(a- -64|0)+J[444427]|0,J[e>>2]=f;qt();$c=c+16|0}function Yp(a,b){var c=Q(0),d=Q(0),e=0;d=N[b>>2];a=Q(a-d);a:{if(a<=Q(6)){a=Q(Q(Q(a*Q(160))/Q(-6))+Q(160));b:{if(a<Q(4294967296)&a>=Q(0)){e=~~a>>>0;break b}e=0}H[b+6|0]=e;c=Q(.015625);break a}H[b+6|0]=0;c=Q(.015625);if(a<=Q(16)){break a}c=Q(.0625);if(a<=Q(32)){break a}c=a<=Q(96)?Q(.125):Q(.25)}a=c;N[b>>2]=d+a}function hu(a,b){var c=0,d=0,e=0,f=0,g=0,h=0;e=Ak(a,0);f=Ak(a,1);g=Ak(a,2);c=$c-16|0;$c=c;a:{if(!L[a+1268>>1]){d=c+8|0;th(d);d=zd(d,2147483647);break a}d=Ak(a,3)}$c=c+16|0;c=GN(g,g>>31,GN(f,f>>31,e,e>>31),ad);h=ad;if(!h&c>>>0>=2147483648|h){pd(24695);return}if(g?!e|!f:1){pd(25452);return}ge(a);pl(b,d,e,f,g)}function Ii(a,b){var c=0,d=0,e=0,f=0;e=L[b+4>>1];d=L[a+4>>1]-e|0;a:{if((d|0)<0){break a}if(!e){return 1}d=d+J[a>>2]|0;a=J[b>>2];b=0;while(1){c=K[b+d|0];f=((c-65&255)>>>0<26?c+32|0:c)&255;c=K[a+b|0];if((f|0)==(((c-65&255)>>>0<26?c+32|0:c)&255)){c=1;b=b+1|0;if((e|0)!=(b|0)){continue}break a}break}c=0}return c}function gz(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;a:{d=J[464807];if(!(d>>>0<=a>>>0|M[464808]<=b>>>0)){e=J[464809];if(e>>>0>c>>>0){break a}}return J[464863]}d=P(d,P(b,e)+c|0)+a|0;if(K[(J[464818]&(K[d+J[464805]|0]<<8|K[d+J[464804]|0]))+68432|0]){return J[464863]}return J[(($h(a,c)|0)<(b|0)?60:76)+1859392>>2]}function Vr(a,b,c){var d=0,e=0;e=J[a+40>>2];a:{if(c){c=0;d=-1;if((e|0)<=0){break a}while(1){d=$o(L[((c<<1)+a|0)+92>>1],b)?c:d;c=c+1|0;if((c|0)<J[a+40>>2]){continue}break}break a}c=0;d=-1;if((e|0)<=0){break a}while(1){d=L[((c<<1)+a|0)+92>>1]==(b|0)?c:d;c=c+1|0;if((e|0)!=(c|0)){continue}break}}Bm(a,b?d:-1)}function Mm(a){var b=0,c=0,d=0;J[a+28>>2]=7;J[a+20>>2]=0;J[a+16>>2]=1859008;c=J[a+636>>2]<<2;while(1){d=P(b,84)+a|0;xd(a,d+288|0,300,1002);J[d+324>>2]=b+c;b=b+1|0;if((b|0)!=4){continue}break}xd(a,a+36|0,400,1003);b=a+120|0;xd(a,b,40,1004);c=a+204|0;xd(a,c,40,1005);le(b,!J[a+636>>2]);le(c,J[a+636>>2]==3)}
function eq(a,b,c,d,e,f,g){var h=Q(0),i=Q(0);a:{if(d){if(Cj(a,b,g,e,c,f)){break a}}h=N[b+20>>2];i=N[g+8>>2];b=J[a>>2];J[b+44>>2]=0;h=Q(Q(h+Q(i*Q(.5)))+Q(.0010000000474974513));N[b+12>>2]=h;i=Q(h-Q(N[g+8>>2]*Q(.5)));N[c+8>>2]=i;N[f+8>>2]=i;h=Q(h+Q(N[g+8>>2]*Q(.5)));N[c+20>>2]=h;N[f+20>>2]=h;H[a+9|0]=1}}function dq(a,b,c,d,e,f,g){var h=Q(0),i=Q(0);a:{if(d){if(Cj(a,b,g,e,c,f)){break a}}h=N[b+8>>2];i=N[g+8>>2];b=J[a>>2];J[b+44>>2]=0;h=Q(Q(h-Q(i*Q(.5)))+Q(-.0010000000474974513));N[b+12>>2]=h;i=Q(h-Q(N[g+8>>2]*Q(.5)));N[c+8>>2]=i;N[f+8>>2]=i;h=Q(h+Q(N[g+8>>2]*Q(.5)));N[c+20>>2]=h;N[f+20>>2]=h;H[a+6|0]=1}}function Cr(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;a=J[a+32>>2];J[d>>2]=0;a:{if(c){while(1){e=J[a+8>>2];f=c+e>>>0>32767?32768-e|0:c;Kd((a+e|0)+888|0,b,f);J[a+8>>2]=f+J[a+8>>2];J[d>>2]=f+J[d>>2];if(J[a+8>>2]==32768){e=Br(a,16384);if(e){break a}}b=b+f|0;c=c-f|0;if(c){continue}break}}e=0}return e|0}function zk(a,b,c,d){var e=0,f=0,g=0,h=0;if(K[780096]){a=67108863}else{e=a-1|0;f=c-1|0;h=ig(e,b,f,d-19|0)|ig(e,b,c,d-1|0)<<9;g=e;e=c+1|0;g=h|ig(g,b,e,d+17|0)<<18|ig(a,b,f,d-18|0)<<3|ig(a,b,c,d)<<12|ig(a,b,e,d+18|0)<<21;a=a+1|0;a=g|ig(a,b,f,d-17|0)<<6|ig(a,b,c,d+1|0)<<15|ig(a,b,e,d+19|0)<<24}return a}function cv(a){a=a|0;var b=0,c=0;while(1){md((P(b,84)+a|0)+36|0,1,1,0,P(b,50)-100|0);b=b+1|0;if((b|0)!=5){continue}break}b=a+708|0;c=a+624|0;a:{if(K[1055388]){md(c,3,2,-150,25);md(b,4,2,-150,25);break a}md(c,1,2,0,25);md(b,1,2,0,70)}md(a+456|0,1,1,-220,0);md(a+540|0,1,1,220,0);md(a+836|0,1,1,0,-155)}function Qt(a,b,c,d,e){var f=0;f=J[273222];ah(f,Q(Q(c|0)*Q(.0625)),Q(Q(b|0)*Q(.0625)),Q(-.125),Q(.0625),Q(.015625),32,0,35,3);$g(f,Q(Q(d|0)*Q(.0625)),Q(Q(e|0)*Q(.0625)),Q(.015625),Q(.3125),Q(.0625),36,3,37,8);b=L[f+36>>1];J[a+12>>2]=1031798784;J[a+4>>2]=0;J[a+8>>2]=1050673152;I[a+2>>1]=8;I[a>>1]=b-8}function Ns(a){var b=0,c=0;a:{if(!K[1054200]){break a}if((Xj(1839864,a,32)^-1)>>>31|0){break a}b:{if(L[a+4>>1]){if(!((Xj(1834712,a,32)^-1)>>>31|0)){break b}}os(a);return}J[272825]=8388608;J[272824]=1091944;J[272813]=36664;H[1091256]=1;ke(1091296,a);b=1091304,c=Nj(a,1,1,0,0),J[b>>2]=c;Ad(1091252,35)}}function Bp(a,b,c){var d=0,e=0;H[a|0]=8;e=Fe(b);H[a+2|0]=e;H[a+1|0]=0;a=a+3|0;if((e|0)>0){while(1){H[a|0]=K[b+d|0];a=a+1|0;d=d+1|0;if((e|0)!=(d|0)){continue}break}}d=a+2|0;if(L[c+4>>1]){b=0;while(1){d=Tm(H[J[c>>2]+b|0],d)+d|0;b=b+1|0;if(b>>>0<L[c+4>>1]){continue}break}}fe(a,(d-a|0)-2&65535);return d}function Qv(a){a=a|0;var b=0,c=0,d=0,e=0;b=J[a+20>>2];if((b|0)>0){e=J[a+16>>2];while(1){d=J[(c<<2)+e>>2];if(d){bd[J[J[d>>2]+8>>2]](d);b=J[a+20>>2]}c=c+1|0;if((b|0)>(c|0)){continue}break}}aj(a+1288|0);b=a+132|0;md(b,0,3,0,100);J[a+156>>2]=(J[a+144>>2]/-2|0)+(J[467303]/2|0);bd[J[J[a+132>>2]+8>>2]](b)}function fg(a,b){var c=0,d=0,e=0,f=0;d=L[a+4>>1];a:{if((d|0)!=L[b+4>>1]){break a}if(!d){return 1}e=J[b>>2];a=J[a>>2];b=0;while(1){c=K[a+b|0];f=((c-65&255)>>>0<26?c+32|0:c)&255;c=K[b+e|0];if((f|0)==(((c-65&255)>>>0<26?c+32|0:c)&255)){c=1;b=b+1|0;if((d|0)!=(b|0)){continue}break a}break}c=0}return c}function hj(a){var b=0,c=0,d=0;a:{if(K[1067756]){c=J[266938];break a}pd(23719);return}b:{c:{while(1){d=(b+c<<1)+1066048|0;if(L[d>>1]!=(a|0)){b=b+1|0;if((b|0)!=9){continue}break c}break}b=J[266937]+c|0;I[d>>1]=L[(b<<1)+1066048>>1];break b}b=J[266937]+c|0}I[(b<<1)+1066048>>1]=a;Nd(1044236);xf(0,a)}function _e(a,b){var c=0,d=0,e=0,f=0;d=L[b+4>>1];a:{if(d>>>0>L[a+4>>1]){break a}if(!d){return 1}e=J[b>>2];a=J[a>>2];b=0;while(1){c=K[a+b|0];f=((c-65&255)>>>0<26?c+32|0:c)&255;c=K[b+e|0];if((f|0)==(((c-65&255)>>>0<26?c+32|0:c)&255)){c=1;b=b+1|0;if((d|0)!=(b|0)){continue}break a}break}c=0}return c}function Ov(a){a=a|0;var b=0,c=0,d=0,e=0;d=a+108|0;te(d);e=a+120|0;nf(e);Zd(a);c=J[a+104>>2];if((c|0)>0){while(1){if(J[J[a+16>>2]+(b<<2)>>2]){Yh(a,(P(b,84)+a|0)+364|0);c=J[a+104>>2]}b=b+1|0;if((c|0)>(b|0)){continue}break}}td(a+1288|0,13837,d);b=J[a+92>>2];if(b){bd[b|0](a)}a=a+132|0;wi(a,e);xg(a)}function aA(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;a:{d=J[464807];c=(a|0)/(d|0)|0;e=J[464809];b=(c|0)/(e|0)|0;b:{d=a-P(c,d)|0;c=c-P(b,e)|0;if(bd[J[266957]](d,b,c)|0){break b}if((b|0)<=0){break a}switch(K[J[464804]+(a-J[464813]|0)|0]-1|0){case 0:case 3:break a;default:break b}}re(d,b,c,0);dh(d,b,c,a)}}function AM(a,b){a=a|0;b=Q(b);var c=0,d=0,e=0;mg(0,0,J[467303],J[467304],1763186712,-1570622669);ie(1);Ve(J[a+12>>2]);c=bd[J[J[a+156>>2]+40>>2]](a+156|0,0)|0;if(J[458156]>0){e=J[458157]<<2;while(1){bg(d);he(e,c);c=c+e|0;d=d+1|0;if((d|0)<J[458156]){continue}break}}de(J[a+52>>2]);he(J[a+48>>2],c)}function cs(a,b){var c=0,d=0,e=0,f=0,g=0;if(J[a+36>>2]>0){c=10;d=10;while(1){e=P(f,84)+a|0;a:{if(K[J[e+136>>2]+5|0]!=(b|0)){break a}g=e+100|0;md(g,b,0,d,c);if(J[a+1200>>2]>=(J[e+116>>2]+J[e+108>>2]|0)){c=c+40|0;break a}c=10;d=d+110|0;md(g,b,0,d,10)}f=f+1|0;if((f|0)<J[a+36>>2]){continue}break}}}function Nq(a){var b=0,c=0,d=0;a:{b:{b=a;if(!(b&3)){break b}if(!K[b|0]){return 0}while(1){b=b+1|0;if(!(b&3)){break b}if(K[b|0]){continue}break}break a}while(1){c=b;b=b+4|0;d=J[c>>2];if(!((d^-1)&d-16843009&-2139062144)){continue}break}while(1){b=c;c=b+1|0;if(K[b|0]){continue}break}}return b-a|0}function Jn(a){a=a|0;var b=0,c=0,d=0;c=J[a+16>>2];d=J[c+12>>2];b=J[207101];a:{if(!K[b+470|0]){le(d,1);le(J[c+16>>2],1);le(J[c+20>>2],1);b=1;break a}le(d,!K[b+473|0]);le(J[c+16>>2],!K[b+473|0]);le(J[c+20>>2],!K[b+473|0]);b=!K[b+477|0]}le(J[c+28>>2],b);a=J[a+84>>2];if(!(!a|!(H[a+21|0]&1))){En()}}function oJ(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;b=$c-32|0;$c=b;c=K[a|0];d=vd(a+1|0);a:{if(!c){a=0;while(1){c=P(a,24);if((d|0)==L[c+1811264>>1]){a=c+1811256|0;e=a,f=se(),J[e>>2]=f;J[a+4>>2]=ad;break a}a=a+1|0;if((a|0)!=10){continue}break}break a}I[b>>1]=299;fe(b|2,d);bd[J[452942]](b,4)}$c=b+32|0}
function mL(a){a=a|0;yf(a);af(144);yd(Q(N[a+16>>2]*Q(-.01745329238474369)),Q(0),Q(0),1544048,1);If(1544064);yd(N[a+164>>2],Q(0),Q(0),1544080,0);yd(N[a+172>>2],Q(0),Q(0),1544096,0);yd(N[a+172>>2],Q(0),Q(0),1544112,0);yd(N[a+164>>2],Q(0),Q(0),1544128,0);Pd(J[273228]);J[273224]=J[273229];ae(144)}function gL(a){a=a|0;yf(a);af(144);yd(Q(N[a+16>>2]*Q(-.01745329238474369)),Q(0),Q(0),1546448,1);If(1546464);yd(N[a+164>>2],Q(0),Q(0),1546480,0);yd(N[a+172>>2],Q(0),Q(0),1546496,0);yd(N[a+172>>2],Q(0),Q(0),1546512,0);yd(N[a+164>>2],Q(0),Q(0),1546528,0);Pd(J[273228]);J[273224]=J[273229];ae(144)}function Pl(a){var b=0,c=0,d=0;if(!(K[a+10|0]?K[a+14|0]:0)){if(K[a+35|0]){H[a+35|0]=0;Nd(1044496)}I[a+36>>1]=0}if(!(!K[a+34|0]|(K[a+10|0]?K[a+16|0]:0))){H[a+34|0]=0;Nd(1044496)}c=K[a+10|0];d=K[a+13|0];a:{if(d){b=1;if(c){break a}b=0}else{b=(c|0)!=0}I[a+38>>1]=0}H[a+19|0]=(d|0)!=0&b;Nd(1043976)}function ku(a){a=a|0;var b=0,c=0;J[a+28>>2]=12;J[a+20>>2]=0;J[a+24>>2]=-1;J[a+16>>2]=a+1860;Ti(a,0,J[464807]);Ti(a,1,J[464808]);Ti(a,2,J[464809]);Ti(a,3,0);pe(a,a+1788|0);xd(a,a+48|0,200,533);xd(a,a+132|0,200,534);xd(a,a+216|0,K[1054197]?400:J[467303]<300?200:400,517);b=a,c=oe(a),J[b+8>>2]=c}function $q(){mb()|0;Bh();_q(0,0);lb(2,0,0,0,2)|0;kb(6208,0,0,0,2)|0;jb(6208,0,0,0,2)|0;ib(6208,0,0,0,2)|0;hb(2,0,0,0,2)|0;gb(2,0,0,0,2)|0;fb(2,0,0,0,2)|0;eb(0,0,1)|0;db(0,0,0,2)|0;cb(2,0,0,0,2)|0;bb(2,0,0,0,2)|0;ab(2,0,0,0,2)|0;$a(2,0,0,0,2)|0;_a(2,0,0,0,2)|0;Za(2,0,0,0,2)|0;Ya(2,0,0,0,2)|0}function ue(a,b){var c=Q(0),d=0,e=0;c=Q(Q(a&255)*b);a:{if(c<Q(4294967296)&c>=Q(0)){d=~~c>>>0;break a}d=0}e=d|a&-16777216;c=Q(Q(a>>>8&255)*b);b:{if(c<Q(4294967296)&c>=Q(0)){d=~~c>>>0;break b}d=0}d=e|d<<8;b=Q(Q(a>>>16&255)*b);c:{if(b<Q(4294967296)&b>=Q(0)){a=~~b>>>0;break c}a=0}return d|a<<16}function gq(a,b,c,d,e,f,g){var h=Q(0),i=Q(0);a:{if(d){if(Cj(a,b,g,e,c,f)){break a}}h=N[b+12>>2];i=N[g>>2];b=J[a>>2];J[b+36>>2]=0;h=Q(Q(h+Q(i*Q(.5)))+Q(.0010000000474974513));N[b+4>>2]=h;i=Q(h-Q(N[g>>2]*Q(.5)));N[c>>2]=i;N[f>>2]=i;h=Q(h+Q(N[g>>2]*Q(.5)));N[c+12>>2]=h;N[f+12>>2]=h;H[a+7|0]=1}}function Os(a){var b=0,c=0;c=J[452740];if((c|0)>0){while(1){if(K[b+1810976|0]==(a|0)){a=c-1|0;if((a|0)>(b|0)){while(1){c=P(b,36);Qd(c+1801744|0,c+1801780|0,36);H[b+1810976|0]=K[b+1810977|0];b=b+1|0;if((a|0)!=(b|0)){continue}break}}J[452740]=a;return}b=b+1|0;if((c|0)!=(b|0)){continue}break}}}function nd(a,b,c){var d=0,e=0,f=0;a:{d=J[a+256>>2];if((d|0)<=0){break a}while(1){f=(e<<2)+a|0;if(!(J[f>>2]!=(c|0)|J[f+128>>2]!=(b|0))){Yd(15997);d=J[a+256>>2]}e=e+1|0;if((e|0)<(d|0)){continue}break}if((d|0)!=32){break a}Yd(7348);return}e=(d<<2)+a|0;J[e>>2]=c;J[e+128>>2]=b;J[a+256>>2]=d+1}function fq(a,b,c,d,e,f,g){var h=Q(0),i=Q(0);a:{if(d){if(Cj(a,b,g,e,c,f)){break a}}h=N[b>>2];i=N[g>>2];b=J[a>>2];J[b+36>>2]=0;h=Q(Q(h-Q(i*Q(.5)))+Q(-.0010000000474974513));N[b+4>>2]=h;i=Q(h-Q(N[g>>2]*Q(.5)));N[c>>2]=i;N[f>>2]=i;h=Q(h+Q(N[g>>2]*Q(.5)));N[c+12>>2]=h;N[f+12>>2]=h;H[a+4|0]=1}}function bl(a,b,c,d){var e=0,f=0,g=0,h=0;a:{g=J[264040];if((g|0)<=0){break a}d=b+d|0;c=a+c|0;while(1){b:{f=(e<<3)+1056464|0;h=J[f>>2];if((h|0)<(a|0)){break b}f=J[f+4>>2];if((f|0)<(b|0)|(c|0)<=(h|0)|(d|0)<=(f|0)){break b}e=1;break a}e=e+1|0;if((g|0)!=(e|0)){continue}break}return 0}return e}function Fu(a){a=a|0;var b=0,c=0,d=0,e=0;b=$c-16|0;$c=b;Zd(a);te(b+4|0);nf(a+36|0);e=a+48|0;while(1){d=b+4|0;td(P(c,84)+e|0,J[P(c,12)+37028>>2],d);c=c+1|0;if((c|0)!=8){continue}break}td(a+792|0,13837,d);if(J[a+24>>2]>=0){zn(a)}le(a+552|0,!K[J[207101]+471|0]);H[a+7|0]=1;Ed(b+4|0);$c=b+16|0}function Tg(a,b,c){var d=Q(0);Kf(a);J[a+80>>2]=0;J[a+68>>2]=-1;J[a>>2]=44564;H[a+21|0]=2;d=Q(N[467293]*Q(b|0));a:{if(Q(R(d))<Q(2147483648)){b=~~d;break a}b=-2147483648}J[a+72>>2]=b;d=N[467294];J[a+32>>2]=c;d=Q(d*Q(40));b:{if(Q(R(d))<Q(2147483648)){b=~~d;break b}b=-2147483648}J[a+76>>2]=b}function Aj(){var a=Q(0),b=0,c=0;Hl();a=Q(Q(Q(Q(mi(+Q(J[12426])))*Q(.17328999936580658))*Q(.2800000011920929))+Q(-.12999999523162842));a=a<Q(0)?Q(0):a;b=1040332,c=hg(J[464860],J[464859],a>Q(1)?Q(1):a),J[b>>2]=c;Kl();Dd(1040268);if(!K[1054308]){uh(1040320,L[929696]);uh(1040308,L[929697])}}function dk(a,b,c){var d=0,e=0;a:{if((b|0)>=0){d=L[a+4>>1];if(d>>>0>=b>>>0){break a}}Yd(14368);d=L[a+4>>1]}if(L[a+6>>1]==(d&65535)){Yd(11933)}d=L[a+4>>1];if((d|0)>(b|0)){while(1){e=J[a>>2]+d|0;H[e|0]=K[e-1|0];d=d-1|0;if((d|0)>(b|0)){continue}break}}H[J[a>>2]+b|0]=c;I[a+4>>1]=L[a+4>>1]+1}function Ol(a){var b=0,c=0,d=0,e=0;c=+Q(Q(a*Q(-49))+Q(-196));d=mi(+a*.247483075+.9899323)*34.30961849;a:{if(R(d)<2147483648){b=~~d;break a}b=-2147483648}d=+Q(a*Q(50));e=wj(+(b|0)*-.02914633510256746)*c-+(b<<2)+d+196;b=b+1|0;c=wj(+(b|0)*-.02914633510256746)*c-+(b<<2)+d+196;return c<e?e:c}function Hp(){var a=0;jo();if(J[263414]){while(1){qd(J[(a<<2)+1053664>>2]);a=a+1|0;if((a|0)!=8){continue}break}a=0;if(J[263424]>0){while(1){qd(J[J[263406]+(a<<2)>>2]);a=a+1|0;if((a|0)<J[263424]){continue}break}}qd(J[263414]);qd(J[263406]);J[263406]=0;J[263414]=0;mt(1053596);mt(1053628)}}function tr(a,b){var c=0,d=0;d=J[a+4>>2];c=J[a>>2]|L[((b<<1)+a|0)+24>>1]<<d;J[a>>2]=c;b=K[(a+b|0)+600|0]+d|0;J[a+4>>2]=b;if(b>>>0>=8){while(1){b=J[a+12>>2];J[a+12>>2]=b+1;H[b|0]=c;J[a+16>>2]=J[a+16>>2]-1;c=J[a>>2]>>>8|0;J[a>>2]=c;b=J[a+4>>2]-8|0;J[a+4>>2]=b;if(b>>>0>7){continue}break}}}function fG(){var a=0,b=0;a=$c-16|0;$c=a;nd(1042156,0,995);nd(1043196,0,996);nd(1043456,0,997);I[26654]=0;b=a+8|0;if(Hf(10604,b)){Hd(53304,6272,b)}J[461356]=53856;J[461355]=53856;J[13466]=0;ak(5277);ak(14289);Yj(1845432,2244);Yj(1850584,2350);Yj(1834712,2186);Yj(1839864,2216);$c=a+16|0}function WJ(a){a=a|0;var b=0,c=0,d=0;b=$c-160|0;$c=b;J[b+152>>2]=4194304;J[b+156>>2]=a+1;J[b+76>>2]=4194304;J[b+148>>2]=b+80;J[b+72>>2]=b;a=K[a|0];c=b+148|0;lk(b+156|0,c);d=b+72|0;hn(a,c,d);gn(J[b+156>>2],a,c,d,1);Sl(a,c,c,40540,0);c=(a>>>3|0)+834328|0;H[c|0]=K[c|0]|1<<(a&7);$c=b+160|0}function NH(a){a=a|0;var b=0,c=0,d=0;a=a+48|0;Wr(a);b=J[a+60>>2];c=J[a+40>>2];if((b|0)>=(c|0)){b=c-1|0;J[a+60>>2]=b}J[a+1720>>2]=-1;J[a+1724>>2]=-1;b=(b|0)/J[a+44>>2]|0;J[a+1668>>2]=b;d=J[a+1672>>2]-J[a+1676>>2]|0;c=(d|0)>(b|0);b=c?b:d;if(!(c&(b|0)>=0)){J[a+1668>>2]=(b|0)>0?b:0}Sg(a,1)}function Hm(a,b,c,d){var e=0,f=0,g=0,h=0,i=0;e=$c-32|0;$c=e;g=41752;a:{if(J[b+8>>2]<=0){break a}while(1){b:{f=e+24|0;bk(b,h,f);i=f;f=e+16|0;kf(i,d,f,e+8|0);if(fg(c,f)){break b}h=h+1|0;if((h|0)<J[b+8>>2]){continue}break a}break}g=e+8|0}b=J[g+4>>2];J[a>>2]=J[g>>2];J[a+4>>2]=b;$c=e+32|0}function DH(a){a=a|0;var b=0,c=Q(0);c=Q(Q(Q(Q(N[263688]*Q(.5))*Q(cl()|0))*Q(10))+Q(.5));a:{if(Q(R(c))<Q(2147483648)){b=~~c;break a}b=-2147483648}N[a+136>>2]=Q(b|0)/Q(10);md(a+48|0,1,1,0,0);b=a+2764|0;md(b,1,0,0,0);J[a+2792>>2]=(J[a+56>>2]-J[a+2780>>2]|0)-3;bd[J[J[a+2764>>2]+8>>2]](b)}function DB(){var a=0,b=0;b=$c-16|0;$c=b;a=b+8|0;Hf(9868,a);a=Rp(a);a=(a|0)!=-1?a:0;H[1040232]=a&1;H[1040328]=a&2;hf(49420);hf(49432);hf(49444);hf(49456);nd(1041896,0,158);nd(1041636,0,159);nd(1042416,0,160);nd(1046056,0,161);nd(1043196,0,162);nd(1043456,0,163);Hg(J[12427]);$c=b+16|0}function uh(a,b){var c=0,d=0,e=0,f=0;if(!K[1054308]){d=L[P(b,12)+122202>>1];Cd(a);b=0;c=$c-16|0;$c=c;e=d>>>4|0;if((e|0)<J[458677]){b=J[458676];J[c+12>>2]=b;J[c+8>>2]=b;f=J[458674];J[c+4>>2]=(J[458673]+(P(f,P(b,e))<<2)|0)+(P(b,d&15)<<2);b=ep(c+4|0,f,0,K[1054309])}$c=c+16|0;J[a>>2]=b}}function jl(a,b,c,d,e,f){var g=Q(0);J[f+12>>2]=d;J[f+8>>2]=0;J[f+60>>2]=e;J[f+56>>2]=0;N[f+48>>2]=0;J[f+44>>2]=e;J[f+40>>2]=0;J[f+28>>2]=d;J[f+24>>2]=0;g=Q(a|0);N[f+20>>2]=g;N[f+4>>2]=g;N[f>>2]=0;g=Q(a+c|0);N[f+52>>2]=g;N[f+36>>2]=g;g=Q(b|0);N[f+32>>2]=g;N[f+16>>2]=g;return f- -64|0}function hm(a,b){var c=0,d=0,e=0;a:{d=J[a>>2];if((d|0)<=0){break a}e=J[a+8>>2];while(1){if(J[(P(c,312)+e|0)+128>>2]!=(b|0)){c=c+1|0;if((d|0)!=(c|0)){continue}break a}break}b=P(c,312)+e|0;qd(J[b+156>>2]);qd(J[b+172>>2]);J[b+172>>2]=0;J[b+156>>2]=0;J[b+160>>2]=0;J[b+164>>2]=0;Dh(a,c)}}function Hq(a,b){var c=0,d=0,e=0;c=L[a+4>>1];b=(b|0)<(c|0)?b:c-1|0;a:{if((b|0)<0){break a}e=J[a>>2];while(1){a=b;b:{if(K[b+e|0]!=38){break b}b=b+1|0;if((b|0)>=(c|0)){break b}d=K[b+e|0];if(M[(d<<2)+825316>>2]>16777215){break a}}b=a-1|0;d=0;if((a|0)>0){continue}break}}return d<<24>>24}function zD(a,b){a=a|0;b=b|0;var c=0,d=0;c=$c-32|0;$c=c;I[c+8>>1]=J[a+4>>2];I[c+12>>1]=J[a+12>>2];d=J[a+16>>2];J[c+24>>2]=1065353216;J[c+28>>2]=1056964608;J[c+16>>2]=0;J[c+20>>2]=0;I[c+14>>1]=(d|0)/2;d=c+4|0;ur(a,d,b);J[c+28>>2]=1065353216;J[c+20>>2]=1056964608;ur(a,d,b);$c=c+32|0}function vn(a,b,c,d,e,f){var g=0,h=0,i=0;g=b<<1;h=L[g+J[195008]>>1];c=zk(c,d,e,b);J[J[203236]+(b<<2)>>2]=c;if(!(K[(L[(J[195008]+(J[(f<<2)+48400>>2]<<1)|0)+g>>1]+P(a,768)|0)+132944|0]>>>f&1|(a|0)!=(h|0)|(c|0)!=J[203237])){if(!c){return 1}a=J[(f<<2)+31424>>2];i=(a&c)==(a|0)}return i}function cg(a){var b=0,c=0,d=0;a:{if(!J[a+20>>2]){break a}c=a+24|0;b=J[a>>2];if((c|0)!=(b|0)){qd(b)}b=a+4120|0;d=J[a+4>>2];if((b|0)!=(d|0)){qd(d)}J[a+16>>2]=4096;J[a+20>>2]=256;J[a+4>>2]=b;J[a>>2]=c;J[a+8>>2]=0;J[a+12>>2]=0;if(J[a+5144>>2]){break a}J[a+5144>>2]=9;J[a+5148>>2]=511}}function RF(a,b){a=a|0;b=b|0;var c=0;b=$c-16|0;$c=b;c=J[a+4>>2];J[b+8>>2]=J[a>>2];J[b+12>>2]=c;if(K[825216]){_d(1043716,0,83);H[825216]=0}J[206301]=15570;J[206302]=84;H[825217]=0;a=b+8|0;ds(a);J[206303]=-1;a:{if(L[b+12>>1]){a=Km(a);J[206303]=a;if((a|0)==-1){break a}}Im()}$c=b+16|0}function Qs(a){var b=0,c=0,d=0;b=$c-96|0;$c=b;J[b+92>>2]=4194304;J[b+88>>2]=b+16;a:{if(K[a+40|0]){c=Ig(N[a+36>>2]);J[b+12>>2]=c;d=a+48|0;if((c|0)<=0){c=0}else{Hd(b+88|0,10957,b+12|0);c=J[b+12>>2]>0}le(d,c);if(L[b+92>>1]){break a}}od(b+88|0,3806)}gf(a+48|0,b+88|0,a+216|0);$c=b+96|0}function Lr(a){var b=0,c=0,d=0;c=J[a+84>>2];a:{b:{a=J[a+40>>2];if((a|0)<=0){break b}while(1){if(J[P(b,28)+c>>2]){break b}b=b+1|0;if((a|0)!=(b|0)){continue}break}break a}if((a|0)<=(b|0)){break a}while(1){d=L[(P(b,28)+c|0)+10>>1]+d|0;b=b+1|0;if((a|0)!=(b|0)){continue}break}}return d}function DA(a){a=a|0;var b=0,c=0,d=0,e=0,f=0,g=0,h=0;b=$c-16|0;$c=b;f=J[a+16>>2];g=b,h=qe(1,J[a+8>>2]),J[g+12>>2]=h;c=J[a+20>>2];if((c|0)>0){while(1){e=J[(d<<2)+f>>2];if(e){bd[J[J[e>>2]+36>>2]](e,b+12|0);c=J[a+20>>2]}d=d+1|0;if((c|0)>(d|0)){continue}break}}Pd(J[a+12>>2]);$c=b+16|0}function WB(a){a=a|0;var b=0,c=0,d=Q(0);b=$c-32|0;$c=b;J[b+24>>2]=J[a+12>>2];c=J[a+8>>2];J[b+16>>2]=J[a+4>>2];J[b+20>>2]=c;d=Q(bd[J[J[a+48>>2]+24>>2]](a));N[b+20>>2]=N[b+20>>2]+Q(d*N[a+84>>2]);Ae(b+4|0,b+16|0);a=bd[J[266958]](J[b+4>>2],J[b+8>>2],J[b+12>>2])|0;$c=b+32|0;return a|0}function vs(a,b){var c=0,d=0,e=0;if((b|0)<=0){return 0}if(L[a+4>>1]<=b>>>0){Yd(11974)}d=J[a>>2];c=b;a:{b:{while(1){if(K[c+d|0]==32){e=(c|0)>1;c=c-1|0;if(e){continue}break b}break}a=J[a>>2];while(1){if(K[a+c|0]==32){break a}d=(c|0)>1;c=c-1|0;if(d){continue}break}}c=0}return b-c|0}function dK(a){a=a|0;var b=0,c=Q(0),d=Q(0);b=J[207101];c=N[b+16>>2];d=Q(N[b+20>>2]*Q(.01745329238474369));b=K[813200];N[a>>2]=Q(N[203301]*Q(.01745329238474369))+(b?Q(d+Q(3.1415927410125732)):d);c=Q(c*Q(.01745329238474369));N[a+4>>2]=Q(N[203302]*Q(.01745329238474369))+(b?Q(-c):c)}function pv(a,b){a=a|0;b=b|0;J[272035]=29937;J[272029]=0;J[272030]=260;J[272028]=503;J[272033]=3;J[272031]=-90;J[272032]=-40;H[1088066]=1;H[1088064]=1;J[272034]=4932;J[272015]=37284;J[272027]=36136;J[272025]=6;J[272026]=36144;J[272014]=K[1056337]==2?1056736:51152;Ad(1088060,50)}function Zf(a,b,c){var d=0,e=0,f=0;d=J[a+104>>2];if((b|0)<0){b=(d+1|0)/2|0}if((d|0)>0){d=(d&1?1:2)-b|0;f=(d|0)<=-3?-3:d;d=0;while(1){e=(b|0)>(d|0);md((P(d,84)+a|0)+364|0,1,1,e?-160:160,P((d+f|0)-(e?0:b)|0,50));d=d+1|0;if((d|0)<J[a+104>>2]){continue}break}}xd(a,a+1288|0,400,c)}function Tl(a,b){var c=0,d=Q(0);c=a,d=Xe(N[a+364>>2],N[a+396>>2],b),N[c+16>>2]=d;c=a,d=Xe(N[a+368>>2],N[a+400>>2],b),N[c+20>>2]=d;c=a,d=Xe(N[a+372>>2],N[a+404>>2],b),N[c+24>>2]=d;c=a,d=Xe(N[a+376>>2],N[a+408>>2],b),N[c+28>>2]=d;c=a,d=Xe(N[a+380>>2],N[a+412>>2],b),N[c+32>>2]=d}function md(a,b,c,d,e){var f=Q(0);H[a+23|0]=c;H[a+22|0]=b;f=Q(N[467293]*Q(d|0));a:{if(Q(R(f))<Q(2147483648)){b=~~f;break a}b=-2147483648}J[a+24>>2]=b;f=Q(N[467294]*Q(e|0));b:{if(Q(R(f))<Q(2147483648)){b=~~f;break b}b=-2147483648}J[a+28>>2]=b;b=J[a>>2];if(b){bd[J[b+8>>2]](a)}}function vj(a,b,c,d){var e=0,f=0,g=0,h=0,i=0;f=a>>4;g=c>>4;h=b>>4;e=f+P(J[464824],g+P(h,J[464826])|0)|0;if(K[e+J[263414]|0]<=1){Ep(e,f,h,g)}e=J[J[263406]+(e<<2)>>2];if(e){i=K[e+(c<<4&240|(b<<8&3840|a&15))|0]}return J[J[((($h(a,c)|0)<(b|0)?d+4|0:d)<<2)+1053664>>2]+(i<<2)>>2]}function sC(a,b){a=a|0;b=b|0;a:{if(J[263697]){break a}b=J[b+8>>2];a=P(b,796)+834384|0;if(!(!K[a+474|0]|!K[a+470|0])){b=!K[P(b,796)+834879|0];if((b|0)!=K[a+495|0]){H[a+495|0]=b;Nd(1044496)}return 1}if(K[a+789|0]){break a}H[a+789|0]=1;if(!K[834368]){break a}pd(16332)}return 0}function nj(a,b,c){var d=0,e=0,f=0,g=0;e=$c-32|0;$c=e;if((b|0)<0){fh(a,10,c);b=0-b|0}while(1){f=(b>>>0)/10|0;H[d+e|0]=b-P(f,10)|48;d=d+1|0;g=b>>>0>9;b=f;if(g){continue}break}b=d;if((b|0)>0){while(1){d=b-1|0;fh(a,H[d+e|0]-48|0,c);f=b>>>0>1;b=d;if(f){continue}break}}$c=e+32|0}function Zo(a,b,c,d){var e=Q(0),f=Q(0);b=Q(b*Q(.5));f=Md(b);b=Jd(b);a=Qd(a,44448,56);J[a+60>>2]=0;e=Q(d+Q(-.10000000149011612));N[a+56>>2]=Q(Q(d+d)*Q(-.10000000149011612))/e;J[a+44>>2]=-1082130432;N[a+40>>2]=Q(-Q(d+Q(.10000000149011612)))/e;b=Q(f/b);N[a+20>>2]=b;N[a>>2]=b/c}function GM(a){a=a|0;var b=0,c=0;b=a+136|0;if(!K[1055388]){md(a+220|0,1,1,0,110);md(a+52|0,1,1,240,110);md(b,1,1,0,150);return}c=a+52|0;a=a+220|0;if(K[1869222]==2){md(a,1,2,0,65);md(c,1,2,120,25);md(b,1,2,-120,25);return}md(a,1,1,0,110);md(c,1,1,120,150);md(b,1,1,-120,150)}function zp(a){var b=0,c=0;b=P(a,12)+66896|0;a:{if(!(N[b+18432>>2]!=Q(0)|N[b+27648>>2]!=Q(1))){c=a+722768|0;b=K[c|0]|60;break a}c=a+722768|0;b=K[c|0]&-61}H[c|0]=b;c=P(a,12)+66896|0;if(!(N[c+18440>>2]!=Q(0)|N[c+27656>>2]!=Q(1))){H[a+722768|0]=b|3;return}H[a+722768|0]=b&252}function yf(a){var b=0,c=0;a:{b:{c=J[273222];if(!(K[c+46|0]|K[a+116|0])){break b}b=J[a+112>>2];if(!b){break b}c=a+108|0;break a}b=J[c+8>>2];c=b+4|0;b=J[b+8>>2]}H[1092885]=K[c|0];de(b);N[273217]=N[a+120>>2]*Q(.015625);N[273218]=(K[1092885]?Q(.015625):Q(.03125))*N[a+124>>2]}function pH(a,b){a=a|0;b=Q(b);var c=0;c=$c-32|0;$c=c;N[a+48>>2]=N[263562];Ss(a,Q(0));if(!K[1054228]){bd[J[J[263558]+4>>2]]()}a:{if(!K[1054228]){break a}vm(J[263559],J[464807],J[464808],J[464809]);if(!J[263559]){pd(23277);break a}J[263559]=0;tq(J[207101],c);uq(c)}$c=c+32|0}function oI(a,b){a=a|0;b=b|0;var c=0,d=0,e=Q(0);if(!K[1054308]){c=a+856|0;Hr(c);d=J[c+240>>2];J[c+116>>2]=J[c+236>>2];J[c+120>>2]=d;if(!J[c+48>>2]){a:{if(!K[c+20|0]){H[c+52|0]=1;break a}Qj(c)}}b=b<<24>>24;Sj(a+672|0,b);Sj(a+764|0,b);e=N[a+272>>2];Ff(a+72|0);N[a+272>>2]=e}}function aI(a){a=a|0;Ed(a+60|0);Be(a);bd[J[J[a+672>>2]+4>>2]](a+672|0);bd[J[J[a+72>>2]+4>>2]](a+72|0);bd[J[J[a+856>>2]+4>>2]](a+856|0);bd[J[J[a+764>>2]+4>>2]](a+764|0);bd[J[J[a+2292>>2]+4>>2]](a+2292|0);bd[J[J[a+2124>>2]+4>>2]](a+2124|0);bd[J[J[a+2208>>2]+4>>2]](a+2208|0)}function Dx(a){a=a|0;var b=0;J[263684]=a;bd[J[J[448640]+4>>2]](1794560);b=J[448650];J[448650]=a;J[448483]=J[448483]+(b-a|0);xg(1794560);if((bd[J[J[448640]+44>>2]](1794560)|0)>=4){b=bd[J[J[448640]+44>>2]](1794560)|0}else{b=4}J[448474]=b;Zd(1793888);H[1793895]=1;lf(5689,a)}function Bs(a,b){var c=0,d=0,e=0,f=0;d=$c-16|0;$c=d;c=Zg(a,0,10);a:{if((c|0)==-1){c=J[a+4>>2];J[b>>2]=J[a>>2];J[b+4>>2]=c;c=0;b=0;break a}e=d+8|0;Ke(e,a,0,c);f=J[d+12>>2];J[b>>2]=J[d+8>>2];J[b+4>>2]=f;Qe(e,a,c+1|0);c=J[d+12>>2];b=J[d+8>>2]}J[a>>2]=b;J[a+4>>2]=c;$c=d+16|0}function wJ(a){a=a|0;var b=0,c=Q(0);b=J[207101];H[b+474|0]=K[a|0]!=0;H[b+476|0]=K[a+1|0]!=0;H[b+473|0]=K[a+2|0]!=0;H[b+475|0]=K[a+3|0]!=0;H[b+472|0]=K[a+4|0]!=0;Pl(b+460|0);a=vd(a+5|0);if((a|0)==65535){vq(b);return}c=Nl(Q(Q(a>>>0)*Q(.03125)));N[b+748>>2]=c;N[b+740>>2]=c}function ur(a,b,c){var d=Q(0);I[b+6>>1]=J[a+8>>2]+(J[a+16>>2]/2|0);we(b,-1,c);I[b+6>>1]=J[a+8>>2];d=N[b+16>>2];N[b+16>>2]=N[b+24>>2];N[b+24>>2]=d;we(b,-1,c);we(b,-1,c);sr(a,c,J[a+12>>2]);d=N[b+24>>2];N[b+24>>2]=N[b+16>>2];N[b+16>>2]=d;we(b,-1,c);sr(a,c,J[a+12>>2]/2|0)}function vo(){var a=0,b=0,c=0,d=0,e=0,f=0,g=0;c=K[1054211];d=J[263554];e=K[1054213];f=K[1054197];while(1){g=(a<<1)+1066210|0;a:{if(f){b=0;if(a>>>0>=e>>>0){break a}b=K[a+d|0];break a}b=0;if(a>>>0>=c>>>0){break a}b=a+1|0}I[g>>1]=b;a=a+1|0;if((a|0)!=768){continue}break}}function Qr(a,b,c){var d=0,e=0,f=0;d=$c-80|0;$c=d;I[d+78>>1]=64;J[d+72>>2]=d;a:{if((c|0)<0){break a}while(1){I[d+76>>1]=0;e=d+72|0;yi(a,c,e);e=Hq(e,b);if(e){break a}e=0;if(!c){break a}f=(c|0)>0;c=c-1|0;b=L[((c<<3)+a|0)+76>>1];if(f){continue}break}}$c=d+80|0;return e}function dg(a,b){var c=0,d=0;a:{if((b|0)>=0){c=L[a+4>>1];if(c>>>0>b>>>0){break a}}Yd(14401);c=L[a+4>>1]}c=c-1|0;if((c|0)>(b|0)){while(1){c=J[a>>2];d=c+b|0;b=b+1|0;H[d|0]=K[c+b|0];c=L[a+4>>1]-1|0;if((c|0)>(b|0)){continue}break}}H[J[a>>2]+c|0]=0;I[a+4>>1]=L[a+4>>1]-1}function Cs(a,b){var c=0,d=0,e=0,f=0;d=$c-2064|0;$c=d;a:{if(L[b+4>>1]){while(1){b:{if((c|0)<2048){e=c;break b}e=0;c=ce(a,d,c);if(c){break a}}c=Tm(H[J[b>>2]+f|0],d+e|0)+e|0;f=f+1|0;if(f>>>0<L[b+4>>1]){continue}break}}H[c+d|0]=10;c=ce(a,d,c+1|0)}$c=d+2064|0;return c}function ML(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;d=$c-32|0;$c=d;N[b+4>>2]=Q(N[a+84>>2]*Q(-.625))+N[b+4>>2];J[d+24>>2]=J[b+8>>2];e=J[b+4>>2];J[d+16>>2]=J[b>>2];J[d+20>>2]=e;J[d+8>>2]=J[a+88>>2];b=J[a+84>>2];J[d>>2]=J[a+80>>2];J[d+4>>2]=b;ui(a,d+16|0,d,c);$c=d+32|0}function en(a,b,c){var d=Q(0),e=Q(0);d=Q(ud(b)|0);b=sg(d);d=Q(Nl(Q(R(Q(d/Q(1e4)))))*Q(b|0));a:{b:{switch(c|0){case 0:d=Q(d+N[a>>2]);case 1:N[a>>2]=d;break a;default:break b}}d=N[a>>2]}e=Q(-1024);c:{if(!(d<Q(-1024))){e=Q(1024);if(!(d>Q(1024))){break c}}N[a>>2]=e}}function OL(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;d=$c-32|0;$c=d;N[b+4>>2]=Q(N[a+84>>2]*Q(-1.5))+N[b+4>>2];J[d+24>>2]=J[b+8>>2];e=J[b+4>>2];J[d+16>>2]=J[b>>2];J[d+20>>2]=e;J[d+8>>2]=J[a+88>>2];b=J[a+84>>2];J[d>>2]=J[a+80>>2];J[d+4>>2]=b;ui(a,d+16|0,d,c);$c=d+32|0}function mq(a,b,c,d,e){var f=Q(0),g=Q(0);f=Jd(Q(N[a+4>>2]*b));g=Md(N[a+4>>2]);b=N[a+8>>2];c=Q(Q(Q(Q(g*b)*Q(1.0471975803375244))*Q(1.5))+c);a:{if(e){N[a+52>>2]=c;a=a+56|0;break a}N[a+60>>2]=c;a=a- -64|0}N[a>>2]=Q(Q(b*Q(Q(f*Q(.5))+Q(.5)))*Q(-1.919862151145935))-d}function Tm(a,b){if((a-32&255)>>>0<=94){H[b|0]=a;return 1}a=L[((a&255)<<1)+(a>>>0<32?41760:41570)>>1];if(a>>>0<=127){H[b|0]=a;return 1}if(a>>>0<=2047){H[b+1|0]=a&63|128;H[b|0]=a>>>6|192;return 2}H[b+2|0]=a&63|128;H[b|0]=a>>>12|224;H[b+1|0]=a>>>6&63|128;return 3}function Rt(){var a=0,b=0,c=0,d=0,e=0,f=0;a:{c=J[384753];if((c|0)<=0){break a}b=J[384756];while(1){f=(d<<2)+1539024|0;if((b|0)!=J[f>>2]){bg(b);he(a,e);e=a+e|0;c=J[384753];b=J[f>>2];a=0}a=a+4|0;d=d+1|0;if((c|0)>(d|0)){continue}break}if(!a){break a}bg(b);he(a,e)}}function vr(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0;e=J[a+32>>2];J[e+115584>>2]=J[e+115584>>2]+c;f=J[e+115580>>2];if(c){while(1){f=J[(((K[b+g|0]^f)&255)<<2)+43424>>2]^f>>>8;g=g+1|0;if((g|0)!=(c|0)){continue}break}}J[e+115580>>2]=f;return Cr(a,b,c,d)|0}function mA(a){a=a|0;var b=Q(0),c=Q(0);a:{if(K[1054872]){b=N[263719];c=N[12606];if(!(b>Q(c*Q(.5)))){break a}N[263719]=c-b;return}if(L[527444]==L[(J[266937]+J[266938]<<1)+1066048>>1]){break a}J[12606]=1048576e3;H[1054874]=1;H[1054872]=1;J[263721]=0;J[263719]=0}}function ld(a,b){var c=0,d=0,e=0,f=0,g=0;d=L[a+4>>1];a:{if(d){f=J[a>>2];a=0;while(1){c=K[a+b|0];e=((c-65&255)>>>0<26?c+32|0:c)&255;c=K[a+f|0];if((e|0)!=(((c-65&255)>>>0<26?c+32|0:c)&255)|!e){break a}a=a+1|0;if((d|0)!=(a|0)){continue}break}}g=!K[b+d|0]}return g}function cq(a){var b=Q(0),c=0,d=0,e=Q(0);a:{b=N[a+12>>2];if(b==Q(0)){break a}c=J[a+24>>2];if(J[c+28>>2]<=0){break a}d=J[a+8>>2];N[d+40>>2]=b;e=b;if(!(!K[c+38|0]|!K[c+13|0])){e=Q(b+b);N[d+40>>2]=e}if(!(!K[c+39|0]|!K[c+13|0])){N[d+40>>2]=Q(b*Q(.5))+e}H[a+1|0]=0}}function bs(a){var b=0,c=0,d=0,e=0,f=0;c=$c-16|0;$c=c;d=L[a+4>>1];a:{if(!d){break a}f=J[a>>2];while(1){e=K[b+f|0];if(!((e|0)!=92&(e|0)!=47)){Qe(c+8|0,a,b+1|0);b=J[c+12>>2];J[a>>2]=J[c+8>>2];J[a+4>>2]=b;break a}b=b+1|0;if((d|0)!=(b|0)){continue}break}}$c=c+16|0}function zJ(a){a=a|0;var b=0,c=0,d=0,e=0;b=$c-16|0;$c=b;c=a+1|0;e=K[a|0];d=63;a:{b:{while(1){a=d;if(K[a+c|0]&223){break b}d=a-1|0;if(a){continue}break}a=0;break a}a=a+1|0}I[b+14>>1]=64;I[b+12>>1]=a;J[b+8>>2]=c;a=J[(e<<2)+827376>>2];if(a){vh(a,b+8|0)}$c=b+16|0}function Dr(a,b,c){var d=Q(0),e=0,f=0,g=0,h=0;d=Q(Q(J[a+16>>2]-(J[a+72>>2]<<1)|0)/Q(J[a+44>>2]));g=b,h=Ig(Q(d*Q(J[a+40>>2])))+J[a+72>>2]|0,J[g>>2]=h;e=Ig(Q(d*Q(J[a+48>>2])));J[c>>2]=e;f=c;b=J[b>>2];c=b+e|0;a=J[a+16>>2]-J[a+72>>2]|0;J[f>>2]=((a|0)>(c|0)?c:a)-b}function KG(a,b){a=a|0;b=b|0;var c=0,d=0;d=$c-3600|0;$c=d;a:{b:{if(!b){break b}while(1){c=bd[J[a>>2]](a,d+16|0,b>>>0>=3584?3584:b,d+12|0)|0;if(c){break a}c=J[d+12>>2];if(c){b=b-c|0;if(!b){break b}continue}break}c=-857812991;break a}c=0}$c=d+3600|0;return c|0}function Op(a,b,c){var d=0,e=0,f=0,g=0,h=0;d=$c-16|0;$c=d;if(J[260993]>0){while(1){e=(f<<2)+1043716|0;g=J[e>>2];e=J[e+128>>2];J[d+8>>2]=J[a+8>>2];h=J[a+4>>2];J[d>>2]=J[a>>2];J[d+4>>2]=h;bd[g|0](e,d,b,c);f=f+1|0;if((f|0)<J[260993]){continue}break}}$c=d+16|0}function EK(a,b){a=a|0;b=Q(b);var c=0,d=Q(0),e=0,f=Q(0);c=J[207101];Xl(a,c);d=N[c+20>>2];Jt(c,b,Q(1));N[a+4>>2]=N[203287]+N[a+4>>2];b=Q(d*Q(.01745329238474369));e=a,f=Q(Q(N[203288]*Md(b))+N[a>>2]),N[e>>2]=f;e=a,f=Q(Q(N[203288]*Jd(b))+N[a+8>>2]),N[e+8>>2]=f}function AA(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;a:{if(J[263682]<=0){break a}a=(b<<3)+1056464|0;c=J[a+4>>2];d=J[a>>2];e=1<<b;a=0;while(1){b=J[(a<<2)+1054816>>2];H[b+7|0]=1;if(bd[J[J[b>>2]+44>>2]](b,e,d,c)|0){break a}a=a+1|0;if((a|0)<J[263682]){continue}break}}}function rd(a,b,c,d,e,f){var g=0,h=0,i=0,j=0;g=J[a+104>>2];h=P(g,84)+a|0;i=h+364|0;xd(a,i,300,c);c=g<<5;j=c+1074096|0;J[h+400>>2]=j;J[h+444>>2]=b;b=g<<2;J[b+J[a+16>>2]>>2]=i;J[(a+b|0)+36>>2]=f;J[c+1074100>>2]=e;J[j>>2]=d;J[a+104>>2]=J[a+104>>2]+1;return g}function Pu(a){a=a|0;var b=0,c=0;J[a+40>>2]=36960;J[a+28>>2]=7;J[a+20>>2]=0;J[a+16>>2]=1092816;J[a+36>>2]=K[1054197]?4:5;Cn(a,400);b=a,c=oe(a),J[b+8>>2]=c;a:{if(K[1811800]){break a}H[a+317|0]=1;H[a+149|0]=1;if(K[1054198]|!K[1054197]){break a}H[a+233|0]=1}}function yE(a){a=a|0;var b=0,c=0;b=J[a+72>>2];c=L[a+48>>1];J[a+12>>2]=(b|0)>(c|0)?b:c;b=J[a+76>>2];c=L[a+50>>1];J[a+16>>2]=(b|0)>(c|0)?b:c;_f(a);I[a+44>>1]=J[a+4>>2]+(J[a+12>>2]/2|0)-(L[a+48>>1]>>>1);I[a+46>>1]=J[a+8>>2]+(J[a+16>>2]/2|0)-(L[a+50>>1]>>>1)}function un(a,b,c,d,e,f){var g=0,h=0;g=J[195008];b=b<<1;a:{if(L[g+b>>1]!=(a|0)|K[(L[b+((J[(f<<2)+48400>>2]<<1)+g|0)>>1]+P(a,768)|0)+132944|0]>>>f&1){break a}h=1;if(K[780096]){break a}h=(du(J[195021],J[195022],J[195023],f,a)|0)==(du(c,d,e,f,a)|0)}return h}function Ct(a,b){var c=Q(0),d=Q(0),e=Q(0),f=Q(0),g=0,h=0;g=Bd(N[a>>2]);h=Bd(N[a+8>>2]);c=N[a>>2];b=P(b,12)+66896|0;d=Q(g|0);if(c>=Q(N[b+18432>>2]+d)){e=N[a+8>>2];f=Q(h|0);a=e<Q(N[b+27656>>2]+f)&Q(N[b+27648>>2]+d)>c&Q(N[b+18440>>2]+f)<=e}else{a=0}return a}function BN(a,b){a=a|0;b=Q(b);var c=0,d=0,e=0;c=J[a+24>>2];a:{if((c|0)>=0){c=J[J[a+16>>2]+(c<<2)>>2];if(J[c+36>>2]==1e4){break a}}c=0}while(1){e=P(d,300)+a|0;H[e+446|0]=(e+300|0)==(c|0);d=d+1|0;if((d|0)!=4){continue}break}if(c){N[c+200>>2]=N[c+200>>2]+b}}function xN(a){a=a|0;var b=0,c=0;while(1){c=P(b,40)-80|0;md((P(b,300)+a|0)+300|0,1,1,0,c);md((P(b,72)+a|0)+1500|0,4,1,110,c);b=b+1|0;if((b|0)!=4){continue}break}md(a+1788|0,1,1,0,-130);md(a+48|0,1,1,-120,100);md(a+132|0,1,1,120,100);md(a+216|0,1,2,0,25)}function gD(a,b,c){a=a|0;b=b|0;c=c|0;a=$c-16|0;$c=a;c=L[b+42>>1];Xk(119,c&1);Xk(120,c&2);Xk(121,c&4);J[a+12>>2]=J[b+52>>2];J[a+8>>2]=J[b+56>>2];Hj(a+12|0,a+8|0);bi(0,J[a+12>>2],J[a+8>>2]);if(K[1056336]){Np(Q(J[b+44>>2]),Q(J[b+48>>2]))}$c=a+16|0;return 1}function up(){var a=0,b=0;a:{if(Ua()|0){mb()|0;Bh();break a}a=$c-32|0;$c=a;J[a+24>>2]=0;J[a+20>>2]=1171;J[a+16>>2]=0;J[a+8>>2]=1;J[a+12>>2]=2;b=Qc((Rc()|0?7306:6208)|0,1,a+8|0)|0;b=(b|0)==-1?-857812990:b;if(!b){Pc()}$c=a+32|0;if(!b){break a}Mk(b,9227)}}function Vt(a){var b=0;b=J[273230];a:{if(b){while(1){if(ld(a,J[b>>2])){if(H[b+42|0]&1){break a}a=J[273222];J[273222]=b;J[b+36>>2]=0;bd[J[b+12>>2]]();J[b+36>>2]=0;H[b+42|0]=K[b+42|0]|1;J[273222]=a;return b}b=J[b+68>>2];if(b){continue}break}}b=0}return b}function pj(a,b){var c=0,d=0,e=0;d=b>>>24|0;e=a>>>24|0;c=d+e|0;c=c>>>0<=1?1:c;return(P(b>>>16&255,d)+P(a>>>16&255,e)>>>0)/(c>>>0)<<16&16711680|(((P(b&255,d)+P(a&255,e)>>>0)/(c>>>0)|c<<23)&-16776961|(P(b>>>8&255,d)+P(a>>>8&255,e)>>>0)/(c>>>0)<<8&65280)}function dD(a,b,c){a=a|0;b=b|0;c=c|0;a=0;b=1;a:{if(!K[1054053]){break a}b=O[131740]<=O[232410]+5;if(K[1811800]){break a}if(!(K[1056202]|K[1056203]|(K[1056206]|K[1056207]))){a=!K[1056281]}b=a}if(!b){ha()|0;return 19172}H[1869220]=0;Nd(1048136);return 0}function Ik(){if(K[780072]){if(K[1067796]){J[195026]=45;J[195027]=46;J[195025]=47;J[195017]=48;J[195011]=49;return}J[195026]=50;J[195027]=51;J[195025]=52;J[195017]=53;J[195011]=54;return}J[195027]=55;J[195011]=56;J[195026]=57;J[195025]=58;J[195017]=59}function um(a,b,c){var d=0,e=0,f=0;d=7;a:{if((b|0)<0){break a}e=J[464807];if(e>>>0<=a>>>0){break a}f=J[464809];if(f>>>0<=c>>>0){break a}d=0;if(J[464808]<=(b|0)){break a}a=P(P(b,f)+c|0,e)+a|0;d=J[464818]&(K[a+J[464805]|0]<<8|K[a+J[464804]|0])}return d}function qK(a){a=a|0;var b=0;b=a+66896|0;a:{if(K[b+13824|0]==2){a=1;if(!(K[1683328]&8)){break a}}b:{c:{switch(K[b+8448|0]-1|0){case 1:a=0;if(!(K[1683328]&2)){break b}break a;case 0:break c;default:break b}}a=0;if(K[1683328]&4){break a}}a=1}return a|0}function $o(a,b){var c=0,d=0,e=0,f=0;c=$c-32|0;$c=c;d=c+24|0;tg(d,a);Wo(d,c+8|0);a=0;f=J[c+8>>2];a:{if((f|0)==-1){break a}e=c+16|0;tg(e,b);Wo(e,c);b=J[c>>2];if((b|0)==-1|(b|0)!=(f|0)|J[c+12>>2]!=J[c+4>>2]){break a}a=(fg(d,e)|0)!=0}$c=c+32|0;return a}function km(a,b,c){var d=0;if(J[a>>2]>=J[a+4>>2]){_j(a+8|0,a+4|0,312,10,10)}d=J[a>>2];if(c&1){if((d|0)>0){while(1){c=J[a+8>>2]+P(d,312)|0;Kd(c,c-312|0,312);c=d>>>0>1;d=d-1|0;if(c){continue}break}}d=0}Kd(J[a+8>>2]+P(d,312)|0,b,312);J[a>>2]=J[a>>2]+1}function pn(a){var b=0,c=0,d=0,e=0;b=$c-16|0;$c=b;a:{if(J[392204]<=0){break a}while(1){b:{$d(b,1568808,c);d=J[b+4>>2];J[b+8>>2]=J[b>>2];J[b+12>>2]=d;if(fg(b+8|0,a)){break b}c=c+1|0;if((c|0)<J[392204]){continue}break a}break}e=1}$c=b+16|0;return e}function pf(a,b,c,d){var e=0,f=0;if(!Lq(b)){f=J[b+8>>2];if(!J[f>>2]){e=K[b+12|0];if(!J[206585]){if(e){us(b,a,c,d,1)}us(b,a,c,d,0);return}if(e){e=L[f+4>>1]>>>3|0;Kq(a,b,e+c|0,d+e|0,1)}Kq(a,b,c,d,0);return}if(K[b+12|0]){ss(b,a,c,d,1)}ss(b,a,c,d,0)}}function fJ(a){a=a|0;var b=0;a:{b=K[a|0];b:{if(!b){if(!K[1067805]){break a}H[1067805]=0;H[1067804]=0;b=K[1067806];break b}b=b-1|0;if((b&255)>>>0>1){break a}a=K[a+1|0]!=0;if(!K[1067805]){H[1067806]=K[1067796]}H[1067805]=1;H[1067804]=a}po(b&255,1)}}function tL(a){a=a|0;var b=0;b=P(L[a+52>>1],12)+66896|0;N[a+56>>2]=N[b+18432>>2]+Q(-.5);N[a+60>>2]=N[b+18436>>2]+Q(0);N[a- -64>>2]=N[b+18440>>2]+Q(-.5);N[a+68>>2]=N[b+27648>>2]+Q(-.5);N[a+72>>2]=N[b+27652>>2]+Q(0);N[a+76>>2]=N[b+27656>>2]+Q(-.5)}function of(a,b){var c=0,d=0;c=$c-16|0;$c=c;a:{if(K[1054308]){break a}a=(a<<2)+33804|0;while(1){ea(1,c+12|0);$(34962,J[c+12>>2]);d=J[c+12>>2];ra(34962,P(J[a>>2],b)|0,0,35048);if(d){break a}if(sp()){continue}Yd(27803);continue}}$c=c+16|0;return d}function eJ(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;b=K[a+2|0];c=K[a|0];d=K[a+1|0];e=vd(a+7|0);if(!d){f=(Id(15495,1)|0)!=0}H[1054796]=b;H[1054794]=c;H[1054880]=f;a=K[a+3|0]|K[a+4|0]<<8|(K[a+5|0]<<16|K[a+6|0]<<24);N[263700]=Q(e>>>0)/Q(65535);J[263701]=a}function PF(a){a=a|0;var b=0,c=0,d=0;c=a+540|0;te(c);Zd(a);b=a+120|0;Gn(b,c,43280,5);td(a+36|0,13837,c);d=b;b=J[263846];td(d,b?(b|0)==1?12929:13816:15029,c);H[a+7|0]=1;b=J[12613];td(a+204|0,b?(b|0)==1?12941:13826:15040,c);H[a+7|0]=1;fs(a);es(a)}function Cn(a,b){var c=0,d=0,e=0,f=0;pe(a,a+716|0);d=J[a+36>>2];if((d|0)>0){e=a+44|0;f=J[a+40>>2];while(1){xd(a,P(c,84)+e|0,b,J[(P(c,12)+f|0)+8>>2]);c=c+1|0;if((d|0)!=(c|0)){continue}break}}xd(a,a+632|0,K[1054197]?400:J[467303]<300?200:400,513)}function oH(a){a=a|0;var b=0,c=0;J[a+28>>2]=4;J[a+20>>2]=0;J[a+16>>2]=a+592;pe(a,a+240|0);pe(a,a+312|0);xd(a,a+48|0,300,859);xd(a,a+132|0,300,860);if(!K[a+40|0]){H[a+69|0]=1}bm(Q(200));J[a+44>>2]=5;J[a+36>>2]=1084227584;b=a,c=oe(a),J[b+8>>2]=c}function nv(a,b){a=a|0;b=b|0;J[272035]=29937;J[272030]=260;J[272029]=507;J[272028]=504;J[272033]=6;J[272031]=-140;J[272032]=10;H[1088066]=1;H[1088064]=1;J[272034]=4947;J[272015]=37284;J[272027]=36288;J[272025]=12;J[272026]=36304;Ad(1088060,50)}function lE(a,b){a=a|0;b=Q(b);var c=0;a:{if(K[1065598]){c=(J[266938]/9|0)+((Ug(a+112|0,b)|0)%9|0)|0;c=(c|0)<0?c+9|0:c;Sk((c|0)>8?c-9|0:c);H[a+120|0]=1;break a}a=J[266937]-((Ug(a+112|0,b)|0)%9|0)|0;a=(a|0)<0?a+9|0:a;ch((a|0)>8?a-9|0:a)}return 1}function ap(){var a=0,b=0,c=0;Dd(1054464);Dd(1054468);a=$c-16|0;$c=a;c=J[263615];J[a+12>>2]=c;if(c){Oa(1,a+12|0);J[263615]=0}$c=a+16|0;J[263679]=0;while(1){a=(b<<5)+49784|0;Pa(J[a>>2]);J[a>>2]=0;b=b+1|0;if((b|0)!=18){continue}break}Cd(1054496)}function Xz(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;a:{d=J[464807];c=(a|0)/(d|0)|0;e=J[464809];b=(c|0)/(e|0)|0;d=a-P(c,d)|0;c=c-P(b,e)|0;if(bd[J[266957]](d,b,c)|0){if((K[J[464804]+(a-J[464813]|0)|0]&254)==2|(b|0)<=0){break a}}re(d,b,c,0);dh(d,b,c,a)}}function IE(a){a=a|0;var b=0,c=0;b=$c-16|0;$c=b;c=J[a+68>>2];J[b+8>>2]=J[a+64>>2];J[b+12>>2]=c;c=b+8|0;Li(c);if(L[b+12>>1]){_m(c,1)}I[a+212>>1]=0;J[a+204>>2]=J[204913];ne(41752,257);Uj(a);J[a+16>>2]=J[a+108>>2];bd[J[J[a>>2]+8>>2]](a);$c=b+16|0}function nl(a,b,c){var d=0,e=0,f=0,g=Q(0),h=0;J[263562]=0;d=(b|0)>0?b:0;b=(a|0)>0?a:0;if(d>>>0>=b>>>0){e=J[464813];f=J[263559];g=Q((d-b|0)+1|0);a=b;while(1){je(P(a,e)+f|0,c,e);N[263562]=Q(a-b|0)/g;h=(a|0)!=(d|0);a=a+1|0;if(h){continue}break}}}function kv(a,b){a=a|0;b=b|0;J[272035]=12341;J[272032]=10;J[272033]=3;J[272030]=260;J[272031]=-140;J[272029]=508;J[272028]=505;H[1088066]=1;H[1088064]=1;J[272034]=5373;J[272015]=37284;J[272027]=36352;J[272025]=7;J[272026]=36368;Ad(1088060,50)}function ov(a,b){a=a|0;b=b|0;J[272035]=29937;J[272030]=260;J[272029]=505;J[272028]=506;J[272033]=4;J[272031]=-40;J[272032]=10;H[1088066]=1;H[1088064]=1;J[272034]=4932;J[272015]=37284;J[272027]=36240;J[272025]=8;J[272026]=36256;Ad(1088060,50)}function jv(a,b){a=a|0;b=b|0;J[272035]=29937;J[272029]=0;J[272030]=260;J[272028]=507;J[272033]=6;J[272031]=-140;J[272032]=10;H[1088066]=1;H[1088064]=1;J[272034]=4962;J[272015]=37284;J[272027]=36396;J[272025]=11;J[272026]=36416;Ad(1088060,50)}function Dj(a){var b=0,c=0;a:{c=(a<<2)+827376|0;b=J[c>>2];if(!b){break a}Rd(1040596,a);bd[J[J[b>>2]+4>>2]](b);J[c>>2]=0;if((a|0)>255){break a}c=1<<(a&7);b=(a>>3)+828408|0;if(!(c&K[b+5920|0])){break a}yq(a&255);H[b+5920|0]=K[b+5920|0]&(c^-1)}}function Jf(a,b,c){var d=0,e=0;a:{if((a|b|c)<0){break a}d=J[464824];if((d|0)<=(a|0)){break a}e=J[464825];if((e|0)<=(b|0)|J[464826]<=(c|0)){break a}a=(J[266966]+P(P(P(c,e)+b|0,d),20)|0)+P(a,20)|0;b=K[a+6|0];if(b&8){break a}H[a+6|0]=b&249|4}}function kj(a){var b=0;a:{b=a+1056164|0;if(!K[b|0]){break a}H[b|0]=0;if((a|0)>=122){He(1051256,a,1,51152);return}He(1050216,a,1,51152);He(1051256,a,1,51152);if((a|0)!=119){break a}a=J[264181];if(a){if(bd[a|0](0)|0){break a}}Rd(1052036,0)}}function Vd(a,b,c){var d=0,e=0,f=0,g=0,h=0;d=b-149|0;e=P(a,220);f=(d+e|0)+1056832|0;g=K[f|0];h=(c|0)!=0;if((g|0)!=(h|0)){if(!(!c|g)){J[((d<<2)+e|0)+1056856>>2]=0}H[f|0]=h;a=P(a,220)+1056736|0;J[a+8>>2]=0;He((c?1300:1560)+1049696|0,b,0,a)}}function Pf(a,b,c){var d=Q(0),e=0,f=0;if(K[825312]){d=N[467294];I[a+6>>1]=c;J[a>>2]=0;d=Q(d*Q(b|0));a:{if(Q(R(d))<Q(2147483648)){b=~~d;break a}b=-2147483648}I[a+4>>1]=b;e=a,f=Ge(P(b,3),2),J[e+8>>2]=f;return}ts(a,L[26628]?53252:53284,b,c)}function $u(a){a=a|0;var b=0,c=0;J[a+28>>2]=9;J[a+32>>2]=3;J[a+20>>2]=0;J[a+16>>2]=1092768;nd(1043976,a,511);J[a+36>>2]=6;J[a+40>>2]=36880;Cn(a,300);xd(a,a+548|0,120,512);b=a,c=oe(a),J[b+8>>2]=c;if(!K[1811800]){H[a+401|0]=1;H[a+317|0]=1}}function vg(a,b,c){var d=0,e=0,f=0,g=0;J[a+20>>2]=0;J[a+16>>2]=c;J[a+12>>2]=b;if(!K[1054440]){b=rg(b);c=rg(c)}d=J[263612];e=J[263613];c=e?(c|0)>(e|0)?c:e:c;J[a+8>>2]=c;b=d?(b|0)>(d|0)?b:d:b;J[a+4>>2]=b;f=a,g=Ch(P(b,c),4,17395),J[f>>2]=g}function WF(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;d=Le(4642,0,2147483647,K[1811800]?80:81);e=Le(9170,0,2147483647,0);c=1<<J[b+36>>2];f=c&d;a:{if(e&f){c=c^-1;e=c&e;d=d&c;break a}if(f){e=e|c;break a}d=d|c}lf(4642,d);lf(9170,e);Fi(a,b);ks()}function Cq(a,b,c,d){a:{b:{switch(a-1|0){case 0:d=P(d,255);c=P(c,255);b=P(b,255);break a;case 1:d=P(d,85);c=P(c,85);b=P(b,85);break a;case 3:break b;default:break a}}d=P(d,17);c=P(c,17);b=P(b,17)}return d<<16&16711680|(c<<8&65280|b&255)}function hl(a,b,c){var d=0,e=0;a:{if(J[263574]<(a|0)|J[263575]<(b|0)){break a}d=J[263612];if((a|0)<(d|0)?d:0){break a}d=J[263613];if((b|0)<(d|0)?d:0){break a}d=J[263611];e=J[263576];c=(c&8)>>>3|0?d?d:e:e;e=!c|(c|0)>=(P(a,b)|0)}return e}function Xj(a,b,c){var d=0,e=0,f=0,g=0,h=0;d=$c-32|0;$c=d;g=-1;a:{if(J[a+8>>2]<=0){break a}while(1){e=d+24|0;bk(a,f,e);h=e;e=d+16|0;kf(h,c,e,d+8|0);if(fg(b,e)){g=f;break a}f=f+1|0;if((f|0)<J[a+8>>2]){continue}break}}$c=d+32|0;return g}function It(a){var b=0,c=Q(0);c=Q(Q(N[a+80>>2]+Q(-.9998999834060669))*Q(1e3));a:{if(c<Q(4294967296)&c>=Q(0)){b=~~c>>>0;break a}b=0}if(b){J[a+80>>2]=1065353216;J[a+84>>2]=1065353216;J[a+88>>2]=1065353216;I[a+52>>1]=b>>>0<768?b:0;Yl(a)}}function vN(a){a=a|0;var b=0,c=0;J[a+28>>2]=5;J[a+20>>2]=0;J[a+16>>2]=a+444;pe(a,a+372|0);xd(a,a+36|0,400,535);xd(a,a+120|0,400,536);xd(a,a+204|0,400,537);xd(a,a+288|0,K[1054197]?400:J[467303]<300?200:400,517);b=a,c=oe(a),J[b+8>>2]=c}function bi(a,b,c){var d=0;a:{d=(a<<3)+1056464|0;if(J[d>>2]==(b|0)&J[d+4>>2]==(c|0)){break a}J[d>>2]=b;J[d+4>>2]=c;b=J[264182];if(b){if(bd[b|0](a)|0){break a}}if(K[1055388]){if(!(H[(P(a,24)+1055392|0)+4|0]&1)){break a}}Rd(1051516,a)}}function Me(a,b){a:{b:{switch(a|0){case 1:Qd(1054504,b,64);break a;case 0:break b;default:break a}}Qd(1054568,b,64)}me(1054632,1054504,1054568);a=0;while(1){b=(a<<5)+49780|0;J[b>>2]=J[b>>2]|1;a=a+1|0;if((a|0)!=18){continue}break}gi()}function IA(a){a=a|0;var b=0;J[263680]=a;J[263679]=0;a=0;while(1){b=(a<<5)+49784|0;Pa(J[b>>2]);J[b>>2]=0;a=a+1|0;if((a|0)!=18){continue}break}Fg();a=0;while(1){b=(a<<5)+49780|0;J[b>>2]=J[b>>2]|31;a=a+1|0;if((a|0)!=18){continue}break}}function Dh(a,b){var c=0;a:{if((b|0)>=0){c=J[a>>2];if((c|0)>(b|0)){break a}}Yd(15289);c=J[a>>2]}c=c-1|0;if((c|0)>(b|0)){while(1){c=J[a+8>>2]+P(b,312)|0;Kd(c,c+312|0,312);b=b+1|0;c=J[a>>2]-1|0;if((b|0)<(c|0)){continue}break}}J[a>>2]=c}function zA(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;a:{c=J[263682];if((c|0)<=0){break a}a=0;while(1){d=J[(a<<2)+1054816>>2];e=J[J[d>>2]+64>>2];if(e){H[d+7|0]=1;if(bd[e|0](d,b)|0){break a}c=J[263682]}a=a+1|0;if((c|0)>(a|0)){continue}break}}}function tu(a,b){a=a|0;b=b|0;b=K[a+48|0];if(b){a=K[a+49|0];Vk(b,a);Ao(b,a)}J[269191]=26572;J[269194]=4137;J[269192]=519;J[269190]=520;J[269193]=521;J[269189]=517;J[269188]=522;H[1075950]=1;H[1075948]=1;J[268986]=35472;Ad(1075944,50)}function se(){var a=0,b=0,c=0;a=+Pb()*1e3;if(a<0x10000000000000000&a>=0){c=~~a>>>0;if(R(a)>=1){b=~~(a>0?T(V(a*2.3283064365386963e-10),4294967295):W((a-+(~~a>>>0>>>0))*2.3283064365386963e-10))>>>0}else{b=0}ad=b;return c}ad=0;return 0}function qG(a,b){a=a|0;b=b|0;var c=0;c=$c-16|0;$c=c;a:{if(!J[a+36>>2]){a=bd[J[a>>2]](a,b,1,c+12|0)|0;a=a?a:J[c+12>>2]?0:-857812991;break a}H[b|0]=K[J[a+32>>2]];J[a+32>>2]=J[a+32>>2]+1;J[a+36>>2]=J[a+36>>2]-1;a=0}$c=c+16|0;return a|0}function Mj(a,b){var c=0,d=0,e=0;d=J[464900];if((d|0)>0){e=J[464902];a:{while(1){if(J[(P(c,312)+e|0)+128>>2]==(a|0)){break a}c=c+1|0;if((d|0)!=(c|0)){continue}break}return 0}Qd(b,P(c,312)+e|0,312);Dh(1859600,c);a=1}else{a=0}return a}function KF(a,b){a=a|0;b=b|0;var c=0;b=$c-80|0;$c=b;J[464773]=1065353216;J[464771]=1048576e3;J[464772]=1084227584;J[464770]=44852;J[b+76>>2]=4194304;J[b+72>>2]=b;c=b+72|0;$e(c,N[263696],1);Ek(1859080,c,1008,1);H[a+392|0]=0;$c=b+80|0}function xA(a,b){a=a|0;b=b|0;var c=0;a=$c-16|0;$c=a;a:{if(!Um(b,a+15|0)|J[263682]<=0){break a}b=0;while(1){c=J[(b<<2)+1054816>>2];if(bd[J[J[c>>2]+28>>2]](c,H[a+15|0])|0){break a}b=b+1|0;if((b|0)<J[263682]){continue}break}}$c=a+16|0}function Mt(a){yd(Q(N[a+16>>2]*Q(-.01745329238474369)),Q(0),Q(0),1551152,1);If(1551168);yd(N[a+164>>2],Q(0),Q(0),1551184,0);yd(N[a+172>>2],Q(0),Q(0),1551200,0);yd(N[a+172>>2],Q(0),Q(0),1551216,0);yd(N[a+164>>2],Q(0),Q(0),1551232,0)}function xm(a,b,c){var d=0;J[464809]=c;J[464808]=b;J[464807]=a;d=P(a,c);J[464813]=d;J[464812]=c-1;J[464811]=b-1;J[464810]=a-1;J[464806]=P(b,d);c=c+15>>4;J[464826]=c;b=b+15>>4;J[464825]=b;a=a+15>>4;J[464824]=a;J[464827]=P(c,P(a,b))}function NE(a,b){a=a|0;b=b|0;var c=0,d=0;a:{if((b|0)==38){break a}c=a+212|0;if(!(bd[J[J[a+212>>2]+4>>2]](c,b)|0)){break a}if(bd[J[a+44>>2]]()<<6==L[a+68>>1]){break a}Rr(a,b);d=bd[J[J[a+212>>2]+8>>2]](c,a- -64|0)|0;Or(a)}return d|0}function rM(a){a=a|0;var b=0,c=0;J[a+40>>2]=0;J[a+28>>2]=8;J[a+20>>2]=0;H[a+38|0]=0;H[a+36|0]=0;J[a+16>>2]=a+820;au(a,a+404|0);xd(a,a+68|0,160,0);xd(a,a+152|0,160,0);xd(a,a+236|0,160,0);xd(a,a+320|0,160,0);b=a,c=oe(a),J[b+8>>2]=c}function bL(){wd(1551152,39112);tk(1551168,39156);wd(1551184,39200);wd(1551200,39244);wd(1551216,39288);wd(1551232,39332);wd(1551248,39376);tk(1551264,39420);wd(1551280,39464);wd(1551296,39508);wd(1551312,39552);wd(1551328,39596)}function Wo(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0;d=$c-16|0;$c=d;J[b>>2]=-1;J[b+4>>2]=-1;e=1;while(1){c=ys(a,0);if((c|0)!=-1){f=d+8|0;Qe(f,a,c);h=(g<<2)+b|0,i=fp(f),J[h>>2]=i;I[a+4>>1]=c;g=1;c=e;e=0;if(c){continue}}break}$c=d+16|0}function Lm(a){var b=0,c=0,d=0,e=0;c=$c-16|0;$c=c;b=L[a+4>>1];a:{while(1){e=b;if((b|0)<=0){break a}b=b-1|0;d=K[b+J[a>>2]|0];if((d|0)!=92&(d|0)!=47){continue}break}Qe(c+8|0,a,e);b=J[c+12>>2];J[a>>2]=J[c+8>>2];J[a+4>>2]=b}$c=c+16|0}function at(a,b,c){var d=0,e=0;d=$c-96|0;$c=d;a:{if(!(K[1054198]|!K[1054197])){J[d+92>>2]=4194304;J[d+88>>2]=d+16;Xg(d+88|0,c);break a}e=J[c+4>>2];J[d+88>>2]=J[c>>2];J[d+92>>2]=e}Ef(d,d+88|0,b+136|0,!K[b+52|0]);wh(a,d);$c=d+96|0}function TJ(a){a=a|0;var b=0,c=0;b=$c-32|0;$c=b;c=K[a|0];H[b+28|0]=193;N[b>>2]=Q(H[a+1|0])*Q(.03125);N[b+4>>2]=Q(H[a+2|0])*Q(.03125);N[b+8>>2]=Q(H[a+3|0])*Q(.03125);a=J[(c<<2)+827376>>2];if(a){bd[J[J[a>>2]+8>>2]](a,b)}$c=b+32|0}function Ld(a,b){var c=0,d=0,e=0;d=a+66896|0;e=K[d+13824|0];a:{if(e){c=1;if(!K[d+768|0]|(e&254)==2){break a}}c=1;if(K[d+1536|0]){break a}a=a+66896|0;if(!(!K[a+768|0]|K[a+13056|0]!=255)){return 0}c=!(K[a+66816|0]>>>b&1)}return c}function Fo(a,b,c,d){J[c>>2]=0;J[d>>2]=0;if(!((a|0)!=105&J[b+24>>2]!=(a|0))){J[c>>2]=-1}if(!((a|0)!=107&J[b+28>>2]!=(a|0))){J[c>>2]=1}if(!((a|0)!=109&J[b+16>>2]!=(a|0))){J[d>>2]=-1}if(!((a|0)!=103&J[b+20>>2]!=(a|0))){J[d>>2]=1}}function Ci(a,b,c,d){var e=0;e=$c-3088|0;$c=e;H[e+3087|0]=d;J[e+3080>>2]=201326592;J[e+3076>>2]=e;a:{if(L[c+4>>1]){Tf(e+3076|0,6216,b,e+3087|0,c);d=K[e+3087|0];break a}ke(e+3076|0,b)}$r(a,b,d<<24>>24);jf(a,e+3076|0);$c=e+3088|0}function io(){var a=0,b=0,c=0;a=wf(P(J[464809],J[464807]),2);J[266950]=a;a:{if(a){c=P(J[464809],J[464807]);if((c|0)<=0){break a}while(1){I[(b<<1)+a>>1]=32767;b=b+1|0;if((c|0)!=(b|0)){continue}break}break a}Qf(1468,23208);vi()}}function Xi(){J[272035]=29937;J[272030]=250;J[272029]=504;J[272033]=6;J[272031]=-140;J[272032]=10;H[1088066]=1;H[1088064]=1;J[272034]=4997;J[272015]=37284;J[272027]=36168;J[272025]=12;J[272026]=36192;J[272028]=0;Ad(1088060,50)}function Cp(a){var b=0,c=0,d=0,e=0;b=$c-16|0;$c=b;c=J[263425];a:{if(!c){break a}while(1){Wd(b,J[c>>2]);d=J[b+4>>2];J[b+8>>2]=J[b>>2];J[b+12>>2]=d;if(Ii(a,b+8|0)){e=c;break a}c=J[c+8>>2];if(c){continue}break}}$c=b+16|0;return e}function sM(a){a=a|0;var b=0,c=0,d=0;d=$c-32|0;$c=d;Zd(a);b=d+20|0;te(b);c=d+8|0;nf(c);ee(a+212|0,19229,b);Ce(a+284|0,a+36|0,c);ee(a+356|0,3945,c);ee(a+428|0,25138,c);td(a+44|0,6094,b);td(a+128|0,8539,b);Ed(b);Ed(c);$c=d+32|0}function SJ(a){a=a|0;var b=0,c=0;b=$c-32|0;$c=b;c=K[a|0];H[b+28|0]=134;N[b+16>>2]=Q(Q(K[a+1|0])*Q(360))*Q(.00390625);N[b+12>>2]=Q(Q(K[a+2|0])*Q(360))*Q(.00390625);a=J[(c<<2)+827376>>2];if(a){bd[J[J[a>>2]+8>>2]](a,b)}$c=b+32|0}function Ho(a){a=a|0;var b=0;if(J[263682]>0){a=0;while(1){b=J[(a<<2)+1054816>>2];bd[J[J[b>>2]+56>>2]](b);a=a+1|0;if((a|0)<J[263682]){continue}break}}Dd(1054868);if(!K[1054310]){Cd(1054760);Cd(1054764);Cd(1054768);Cd(1054772)}}function Ui(a){var b=0,c=0,d=0;b=$c-80|0;$c=b;J[b+76>>2]=4194304;J[b+72>>2]=b;a:{if(J[a+24>>2]==1){od(b+72|0,26366);break a}c=b+72|0;od(c,19579);d=K[a+41|0];if(!d){od(c,13831)}Fn(d,b+72|0)}gf(a+484|0,b+72|0,a+76|0);$c=b+80|0}function Dg(a,b,c){var d=Q(0);N[a>>2]=N[b>>2]-Q(N[c>>2]*Q(.5));d=N[b+4>>2];N[a+4>>2]=d;N[a+8>>2]=N[b+8>>2]-Q(N[c+8>>2]*Q(.5));N[a+12>>2]=Q(N[c>>2]*Q(.5))+N[b>>2];N[a+16>>2]=d+N[c+4>>2];N[a+20>>2]=Q(N[c+8>>2]*Q(.5))+N[b+8>>2]}function An(a,b){var c=0,d=0,e=0,f=0;Zd(a);te(b);d=J[a+36>>2];if((d|0)>0){e=a+44|0;f=J[a+40>>2];while(1){td(P(c,84)+e|0,J[(P(c,12)+f|0)+4>>2],b);c=c+1|0;if((d|0)!=(c|0)){continue}break}}td(a+632|0,13975,b);ee(a+716|0,2124,b)}function Pp(a,b){var c=0,d=0;a=a+66896|0;H[a+9216|0]=b;c=3;a:{switch(b-5|0){case 1:c=1;case 0:d=K[a+13824|0]==(c|0);break;default:break a}}H[a|0]=d;c=a+8448|0;a=(b|0)==3?2:b;a=(a|0)==4?2:a;a=(a|0)==5?1:a;H[c|0]=(a|0)==6?1:a}function Us(a){a=a|0;var b=0,c=0;J[a+28>>2]=2;J[a+20>>2]=0;J[a+16>>2]=a+364;pe(a,a+72|0);pe(a,a+144|0);b=a,c=Ge(J[467304],64),J[b+52>>2]=c;b=a,c=oe(a)+(J[a+52>>2]<<2)|0,J[b+8>>2]=c;Bf(0);nd(1045536,a,856);nd(1045796,a,857)}function LL(a){a=a|0;J[a+164>>2]=1020054733;J[a+168>>2]=-1105618534;J[a+188>>2]=1020054733;J[a+192>>2]=1045220557;J[a+180>>2]=1020054733;J[a+184>>2]=-1102263091;J[a+172>>2]=1020054733;J[a+176>>2]=1041865114;Ph(a,1531648,1)}function yp(a,b){var c=0,d=0;c=$c-44800|0;$c=c;d=c+44744|0;yg(d,c+4|0,a);a=Cl(a);a:{if(a){break a}a=bd[J[c+44748>>2]](d,c+3|0)|0;if(a){break a}a=-857812911;if(K[c+3|0]!=10){break a}a=Bl(10,1,d,0,b,0)}$c=c+44800|0;return a}function xo(a,b,c,d){var e=Q(0),f=Q(0),g=0,h=Q(0);a:{b=b<<2;if(J[b+51304>>2]){break a}a=b+(P(a,220)+1056736|0)|0;e=N[a+88>>2];f=N[a+80>>2];if(f==Q(0)&e==Q(0)){break a}e=Kp(f,e);g=c,h=Md(e),N[g>>2]=h;g=d,h=Jd(e),N[g>>2]=h}}function cl(){var a=Q(0),b=Q(0),c=0;a=Q(N[467308]*Q(J[467304]));b=Q(N[467307]*Q(J[467303]));if(!K[1054793]){b=Q(b/N[467293]);a=Q(a/N[467294])}a=a>b?b:a;a:{if(Q(R(a))<Q(2147483648)){c=~~a;break a}c=-2147483648}return c+1|0}function Oi(a){var b=0;b=$c-32|0;$c=b;H[1793928]=1;H[1793892]=1;Mo();ke(1794024,a);J[b+28>>2]=0;J[b+8>>2]=a;I[b+24>>1]=256;J[b+20>>2]=4040;J[b+12>>2]=256;J[b+16>>2]=30;Xq(b+8|0);le(1793960,K[b+24|0]);Ff(1793960);$c=b+32|0}function Ke(a,b,c,d){var e=0;if(!((c|0)>=0&L[b+4>>1]>=c>>>0)){Yd(14467)}a:{if((d|0)>=0){e=L[b+4>>1];if(e>>>0>=d>>>0){break a}}Yd(14501);e=L[b+4>>1]}if((c+d|0)>(e|0)){Yd(14434)}b=J[b>>2];I[a+6>>1]=d;I[a+4>>1]=d;J[a>>2]=b+c}function aq(a,b,c){var d=Q(0);d=K[a+1|0]?b:Q(1);b=Q(0);a:{if(!c){break a}b=K[a+39|0]?Q(Q(N[a+4>>2]*Q(.5))+Q(0)):Q(0);if(!K[a+38|0]){break a}b=Q(b+N[a+4>>2])}b=Q(d*Q(b+Q(1)));if(!K[a+13|0]){d=N[a+40>>2];b=b<d?b:d}return b}function _L(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;d=$c-32|0;$c=d;J[d+24>>2]=J[b+8>>2];e=J[b+4>>2];J[d+16>>2]=J[b>>2];J[d+20>>2]=e;J[d+8>>2]=J[a+88>>2];b=J[a+84>>2];J[d>>2]=J[a+80>>2];J[d+4>>2]=b;ui(a,d+16|0,d,c);$c=d+32|0}function Hr(a){var b=0,c=0;J[a+240>>2]=67108864;J[a+236>>2]=a+244;b=a+236|0;a=0;while(1){if(!(a-65>>>0<6|M[(a<<2)+825316>>2]<16777216)){Ud(b,38);c=a<<24>>24;Ud(b,c);Ud(b,37);Ud(b,c)}a=a+1|0;if((a|0)!=256){continue}break}}function qF(a){a=a|0;var b=0;_d(1044496,a,1010);_d(1043976,a,1010);a=J[208590];if((a|0)==54196){J[208590]=J[13550]}if(a){while(1){b=a;a=J[a+4>>2];if((a|0)==54196){a=J[13550];J[b+4>>2]=a}if(a){continue}break}J[208591]=b}}function xq(a){var b=0,c=0,d=0;b=L[(a<<1)+828408>>1];if(b){Lh(829176,b-1|0);Lh(829176,b-2|0);Lh(829176,b-3|0);a=0;while(1){c=(a<<1)+828408|0;d=L[c>>1];if(d>>>0>b>>>0){I[c>>1]=d-3}a=a+1|0;if((a|0)!=256){continue}break}}}function mH(a,b){a=a|0;b=Q(b);var c=0;a:{if(!K[a+40|0]){break a}b=Q(N[a+36>>2]-b);N[a+36>>2]=b;c=Ig(b);c=(c|0)>0?c:0;if((c|0)==J[a+44>>2]&K[a+68|0]==K[a+41|0]){break a}Qs(a);J[a+44>>2]=c;H[a+7|0]=1;H[a+41|0]=K[a+68|0]}}function az(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;d=J[464807];c=(a|0)/(d|0)|0;e=J[464809];b=(c|0)/(e|0)|0;f=J[464813];if(!((f|0)>(a|0)|K[J[464804]+(a-f|0)|0]!=44)){a=a-P(c,d)|0;c=c-P(b,e)|0;re(a,b,c,0);re(a,b-1|0,c,43)}}function Nl(a){var b=Q(0),c=0;a:{if(a==Q(0)){break a}b=a>=Q(768)?Q(22.5):a>=Q(512)?Q(16.5):a>=Q(256)?Q(10):Q(0);c=+a;if(!(Ol(b)<=c)){break a}while(1){b=Q(b+Q(.0010000000474974513));if(Ol(b)<=c){continue}break}}return b}function qo(a,b,c){var d=0,e=0,f=0,g=0;g=(a|0)/4|0;e=J[c>>2];if((a|0)>=4){a=0;while(1){f=(a<<2)+c|0;if((e|0)!=J[f>>2]){bg(e);he(d,b);b=b+d|0;e=J[f>>2];d=0}d=d+4|0;a=a+1|0;if((g|0)!=(a|0)){continue}break}}bg(e);he(d,b)}function iE(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;while(1){a:{f=(e<<2)+a|0;if(J[f+264>>2]!=(b|0)){break a}if(lg(a,c,d)){break a}J[f+264>>2]=-1;J[f+296>>2]=0;return 1}e=e+1|0;if((e|0)!=8){continue}break}return 0}function Ry(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;d=J[464807];c=(a|0)/(d|0)|0;e=J[464809];b=(c|0)/(e|0)|0;f=J[464813];if(!((f|0)>(a|0)|K[J[464804]+(a-f|0)|0]!=50)){a=a-P(c,d)|0;c=c-P(b,e)|0;re(a,b,c,0);re(a,b-1|0,c,4)}}function Ki(a,b){var c=0,d=0,e=0,f=0;d=$c-32|0;$c=d;while(1){e=(b>>>0)/10|0;H[c+d|0]=b-P(e,10)|48;c=c+1|0;f=b>>>0>9;b=e;if(f){continue}break}while(1){b=c-1|0;Ud(a,H[b+d|0]);e=(c|0)>1;c=b;if(e){continue}break}$c=d+32|0}function sF(a){a=a|0;J[a+20>>2]=17;J[a+16>>2]=54128;J[a+8>>2]=224;nd(1044496,a,1010);nd(1043976,a,1010);js(a);Tg(a+1360|0,40,1011);J[a+1428>>2]=-922746881;a=a+56|0;Kf(a);J[a+40>>2]=1065353216;J[a>>2]=45140;Rl(54196)}function Ze(a,b,c,d,e){var f=0;f=$c-16|0;$c=f;J[f+8>>2]=e;J[f+12>>2]=d;a:{b:{if(!De(a,c)){Od(7442,b);break b}c=J[c>>2];if((c|0)>=(d|0)){a=1;if((c|0)<=(e|0)){break a}}Cg(11019,b,f+12|0,f+8|0,0)}a=0}$c=f+16|0;return a}function Qo(){J[444593]=1777712;J[444428]=40748;Ad(1777712,10);J[448472]=40884;J[448486]=-3;J[449290]=1793888;Ad(1793888,15);J[449291]=40952;J[449300]=-3;Ad(1797164,13);J[464388]=43148;if(K[1054793]){Ad(1857552,25)}}function GN(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0;e=c>>>16|0;f=a>>>16|0;j=P(e,f);g=c&65535;h=a&65535;i=P(g,h);f=(i>>>16|0)+P(f,g)|0;e=(f&65535)+P(e,h)|0;ad=(P(b,c)+j|0)+P(a,d)+(f>>>16)+(e>>>16)|0;return i&65535|e<<16}function dA(a){a=a|0;if(!K[1869221]){a=0;while(1){if(K[a+1056164|0]){kj(a)}a=a+1|0;if((a|0)!=172){continue}break}a=0;while(1){H[(P(a,24)+1055392|0)+4|0]=0;a=a+1|0;if((a|0)!=32){continue}break}J[264040]=!K[1055388]}}function PJ(a){a=a|0;var b=0,c=0,d=0;c=$c-16|0;$c=c;d=63;a:{b:{while(1){b=d;if(K[b+a|0]&223){break b}d=b-1|0;if(b){continue}break}b=0;break a}b=b+1|0}I[c+14>>1]=64;I[c+12>>1]=b;J[c+8>>2]=a;Gg(40564,c+8|0);$c=c+16|0}function Ds(a,b,c){J[a+28>>2]=963;J[a+24>>2]=964;J[a+20>>2]=964;J[a+12>>2]=966;J[a+8>>2]=967;J[a+16>>2]=988;J[a+4>>2]=989;J[a>>2]=990;J[a+32>>2]=c;J[a+52>>2]=0;J[a+36>>2]=0;J[a+44>>2]=c;J[a+48>>2]=b;J[a+40>>2]=2048}function eh(a){var b=0,c=0,d=0,e=0,f=0;e=J[a+16>>2];ie(1);Ve(J[a+12>>2]);b=J[a+20>>2];if((b|0)>0){while(1){d=J[(c<<2)+e>>2];if(d){f=bd[J[J[d>>2]+40>>2]](d,f)|0;b=J[a+20>>2]}c=c+1|0;if((c|0)<(b|0)){continue}break}}}function bn(){var a=0,b=0,c=0,d=0;a=1;c=J[263682];a:{if((c|0)<=0){break a}d=J[449290];while(1){a=J[(b<<2)+1054816>>2];if(!((a|0)!=(d|0)?K[a+4|0]:0)){a=1;b=b+1|0;if((c|0)!=(b|0)){continue}break a}break}a=0}return a}function bM(a,b){a=a|0;b=b|0;var c=0;ge(1092480);a=$c-16|0;$c=a;st(41704);H[1054054]=K[1054208];a:{if(L[26610]){Dl(53216);break a}b=K[1054197];c=a+8|0;th(c);b=b?256:128;pl(33788,zd(c,2147483647),b,64,b)}$c=a+16|0}function Xo(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;if((b|0)>0){c=0;while(1){I[a+10>>1]=c;I[a>>1]=c;I[a+8>>1]=c|3;d=c|2;I[a+6>>1]=d;I[a+4>>1]=d;I[a+2>>1]=c|1;c=c+4|0;a=a+12|0;e=e+6|0;if((e|0)<(b|0)){continue}break}}}function Vl(a,b){var c=0,d=0;c=$c-80|0;$c=c;Ul(a);a:{if(Di(b)){d=J[b+4>>2];J[c+72>>2]=J[b>>2];J[c+76>>2]=d;b=1;break a}J[c+76>>2]=4194304;J[c+72>>2]=c;Xg(c+72|0,b);b=0}H[a+116|0]=b;Vf(a+196|0,64,c+72|0);$c=c+80|0}function ce(a,b,c){var d=0,e=0;e=$c-16|0;$c=e;a:{if(c){while(1){d=bd[J[a+8>>2]](a,b,c,e+12|0)|0;if(d){break a}d=J[e+12>>2];if(!d){d=-857812991;break a}b=b+d|0;c=c-d|0;if(c){continue}break}}d=0}$c=e+16|0;return d}function aN(a){a=a|0;var b=0,c=0;J[a+28>>2]=3;J[a+20>>2]=0;J[a+24>>2]=-1;J[a+16>>2]=a+288;xd(a,a+36|0,300,543);xd(a,a+120|0,300,544);xd(a,a+204|0,K[1054197]?400:J[467303]<300?200:400,517);b=a,c=oe(a),J[b+8>>2]=c}function vl(a){a:{b:{switch(K[a+4|0]-1|0){case 2:a=J[a+20>>2];break a;case 1:a=I[a+20>>1];break a;case 0:a=K[a+20|0];break a;default:break b}}J[a+220>>2]=-857812894;a=0}return a&65280|a>>>16&255|a<<16|-16777216}function Po(){var a=0,b=0;a=1054788,b=_k(),J[a>>2]=b;Yt();J[12836]=-1;J[266388]=0;a:{if(!J[263697]){break a}if(K[1065556]){cf(0,0)}J[12836]=-1;if(K[1065557]){cf(1,0)}J[12836]=-1;if(!K[1065558]){break a}cf(2,0)}}function Eh(a,b,c){var d=0,e=0,f=0;d=J[464807];a:{if(d>>>0<=a>>>0|M[464808]<=b>>>0){break a}e=J[464809];if(e>>>0<=c>>>0){break a}a=P(P(b,e)+c|0,d)+a|0;f=J[464818]&(K[a+J[464805]|0]<<8|K[a+J[464804]|0])}return f}function Sd(a,b,c){var d=0,e=0;e=$c-16|0;$c=e;a:{if(c){while(1){d=bd[J[a>>2]](a,b,c,e+12|0)|0;if(d){break a}d=J[e+12>>2];if(!d){d=-857812991;break a}b=b+d|0;c=c-d|0;if(c){continue}break}}d=0}$c=e+16|0;return d}function pI(a,b,c){a=a|0;b=b|0;c=c|0;a:{if(K[1054308]){break a}if(!c){H[a+7|0]=1;J[a+44>>2]=J[a+44>>2]+1;if(!J[263684]){break a}Nr(a+672|0);return}if((c&-2)!=256){break a}H[a+7|0]=1;zg(a+764|0,c-256|0);_g(a)}}function jA(a){a=a|0;var b=Q(0),c=0;a=J[207101];c=bd[J[J[a>>2]+12>>2]](a)|0;b=Q(N[a+16>>2]+Q(-90));return ue(c,Nf(Q(.8999999761581421),Q(.699999988079071),Q(Q(R(Q((b<Q(0)?Q(b+Q(360)):b)+Q(-180))))/Q(180))))|0}function Bv(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0;d=$c-16|0;$c=d;a:{if(ld(c,27095)){gf(b,c,a+792|0);break a}f=b;b=d+4|0;e=ts(b,c,16,0);b:{if(!e){break b}Ok(e,2873,c);b=a+792|0}gf(f,c,b);Ed(d+4|0)}$c=d+16|0}function ih(a){var b=0;b=$c-16|0;$c=b;ea(1,b+12|0);$(34962,J[b+12>>2]);a=J[b+12>>2];if(!a){while(1){if(!sp()){Yd(27759)}ea(1,b+12|0);$(34962,J[b+12>>2]);a=J[b+12>>2];if(!a){continue}break}}$c=b+16|0;return a}function gg(a,b){var c=0;a:{if(!(N[a+12>>2]>=N[b>>2])|!(N[a>>2]<=N[b+12>>2])|(!(N[a+16>>2]>=N[b+4>>2])|!(N[a+4>>2]<=N[b+16>>2]))){break a}if(!(N[a+20>>2]>=N[b+8>>2])){break a}c=N[a+8>>2]<=N[b+20>>2]}return c}function Vi(a){var b=0,c=0;b=$c-80|0;$c=b;J[b+76>>2]=4194304;J[b+72>>2]=b;a:{if(!J[a+24>>2]){od(b+72|0,26347);break a}c=b+72|0;od(c,28423);od(c,J[(K[a+40|0]<<2)+50464>>2])}gf(a+400|0,b+72|0,a+76|0);$c=b+80|0}function Qi(a,b){var c=0,d=0,e=0,f=0;a:{c=L[b+4>>1];if(c){e=c>>>0>=64?64:c;while(1){f=K[J[b>>2]+d|0];H[a+d|0]=(f|0)==38?37:f;d=d+1|0;if((d|0)!=(e|0)){continue}break}if(c>>>0>63){break a}}Gd(a+e|0,32,64-e|0)}}function MK(){Xf(1562672,1531664);Xf(1562704,1531696);qn(1562720,1531712);qn(1562848,1531840);qn(1562976,1531968);J[J[273222]+36>>2]=L[765824];wd(1562656,40232);J[J[273222]+36>>2]=L[765840];wd(1562688,40276)}function MF(a,b){a=a|0;b=b|0;var c=0;b=$c-80|0;$c=b;J[464769]=30;J[464767]=1;J[464768]=200;J[464766]=44804;J[b+76>>2]=4194304;J[b+72>>2]=b;c=b+72|0;Yg(c,J[203269]);Ek(1859064,c,1007,1);H[a+308|0]=0;$c=b+80|0}function wI(a){a=a|0;var b=0,c=0;c=a+136|0;Pf(c,K[825312]?16:11,4);J[a+56>>2]=0;ee(a- -64|0,19560,c);am(c,1);Zd(a);while(1){if(L[(b<<1)+828408>>1]){$m(a,b&255,-1)}b=b+1|0;if((b|0)!=256){continue}break}kk(a)}function XL(a){a=a|0;var b=0,c=0,d=0;b=J[a+48>>2];c=J[b+164>>2];J[a+56>>2]=J[b+160>>2];J[a+60>>2]=c;d=J[b+172>>2];c=a- -64|0;J[c>>2]=J[b+168>>2];J[c+4>>2]=d;c=J[b+180>>2];J[a+72>>2]=J[b+176>>2];J[a+76>>2]=c}function Sf(a,b,c){var d=0,e=0;d=$c-16|0;$c=d;a:{if((c|0)<=0){break a}while(1){e=xs(d+12|0,b,c);if(!e){break a}if(Um(J[d+12>>2],d+11|0)){Ud(a,H[d+11|0])}b=b+e|0;c=c-e|0;if((c|0)>0){continue}break}}$c=d+16|0}function Jz(a,b){a=a|0;b=b|0;a=0;a:{if(J[263697]){break a}if(K[1067756]){a=1}else{pd(23719);a=0}if(!a){return 1}a=1;b=(J[266937]+J[266938]<<1)+1066048|0;if(!L[b>>1]){break a}I[b>>1]=0;Nd(1044236)}return a|0}function GD(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0;c=J[a+40>>2];if((c|0)>0){f=J[a+84>>2];while(1){e=J[P(d,28)+f>>2];if(e){de(e);he(4,b);c=J[a+40>>2]}b=b+4|0;d=d+1|0;if((d|0)<(c|0)){continue}break}}return b|0}function Ak(a,b){var c=0;c=$c-16|0;$c=c;a=P(b,300)+a|0;b=J[a+368>>2];J[c+8>>2]=J[a+364>>2];J[c+12>>2]=b;b=c+8|0;if(bd[J[J[a+512>>2]+12>>2]](a+512|0,b)|0){De(b,c+4|0);a=J[c+4>>2]}else{a=0}$c=c+16|0;return a}function vt(a,b,c,d,e){var f=0;f=$c-32|0;$c=f;H[f|0]=5;fe(f|1,a&65535);fe(f|3,b&65535);fe(f|5,c&65535);H[f+7|0]=d;a:{if(K[52793]){fe(f|8,e);a=f|10;break a}H[f+8|0]=e;a=f|9}bd[J[452942]](f,a-f|0);$c=f+32|0}function oe(a){var b=0,c=0,d=0,e=0,f=0;b=J[a+20>>2];if((b|0)>0){f=J[a+16>>2];while(1){d=J[(c<<2)+f>>2];if(d){e=(bd[J[J[d>>2]+44>>2]](d)|0)+e|0;b=J[a+20>>2]}c=c+1|0;if((b|0)>(c|0)){continue}break}}return e}function SD(a,b,c){a=a|0;b=b|0;c=c|0;if(!(J[c+32>>2]!=(b|0)&J[c+36>>2]!=(b|0)|(K[1869197]|!K[1869222]))){zm(a,c);return 1}if(yr(a,b,c)){a=1}else{a=bd[J[J[a+212>>2]+20>>2]](a+212|0,a- -64|0,b)|0}return a|0}function ru(a,b){a=a|0;b=Q(b);mg(0,0,J[467303],J[467304],1763186712,-1570622669);eh(a);uf(J[a+56>>2],J[a+60>>2],J[a+68>>2],J[a+72>>2],-6908266);uf(J[a+56>>2],J[a- -64>>2],J[a+68>>2],J[a+72>>2],-6908266)}function EI(a,b){a=a|0;b=b|0;var c=0,d=0;d=J[a+56>>2];if((d|0)>0){while(1){if(L[((c<<1)+a|0)+152>>1]==(b|0)){Cd((P(c,28)+a|0)+1176|0);$m(a,b&255,c);kk(a);return}c=c+1|0;if((d|0)!=(c|0)){continue}break}}}function Bm(a,b){var c=0,d=0;J[a+60>>2]=b;b=(((b|0)/J[a+44>>2]|0)-J[a+52>>2]|0)+1|0;J[a+1668>>2]=b;c=J[a+1672>>2]-J[a+1676>>2]|0;d=(c|0)>(b|0);b=d?b:c;if(!(d&(b|0)>=0)){J[a+1668>>2]=(b|0)>0?b:0}Sg(a,1)}function rl(a){var b=0,c=0,d=0;b=$c-16|0;$c=b;a:{while(1){tg(b,c&65535);d=J[b+4>>2];J[b+8>>2]=J[b>>2];J[b+12>>2]=d;if(fg(b+8|0,a)){break a}c=c+1|0;if((c|0)!=768){continue}break}c=-1}$c=b+16|0;return c}function YJ(a){a=a|0;var b=0,c=0,d=0;b=a+6|0;c=vd(a);d=vd(a+2|0);a=vd(a+4|0);a:{if(K[52793]){b=(vd(b)>>>0)%768|0;break a}b=K[b|0]}if(!(M[464807]<=c>>>0|M[464808]<=d>>>0|a>>>0>=M[464809])){re(c,d,a,b)}}function ff(a,b,c,d){var e=0;e=J[(J[263406]+(P(J[464824],P(J[464826],b>>4)+(c>>4)|0)<<2)|0)+(a>>4<<2)>>2];if(e){a=K[(c<<4&240|(b<<8&3840|a&15))+e|0];if(d){return(a&240)>>>4|0}a=a&15}else{a=0}return a}function Cu(a,b){a=a|0;b=b|0;a:{b:{switch(K[1056337]-2|0){case 1:H[1087762]=1;H[1087760]=1;J[271939]=36016;Ad(1087756,50);return;case 0:J[272014]=1056736;break a;default:break b}}J[272014]=51152}Xi()}function TD(a){a=a|0;var b=0,c=0;b=J[a+8>>2];c=J[a+4>>2];_f(a);c=J[a+4>>2]-c|0;I[a+176>>1]=c+L[a+176>>1];b=J[a+8>>2]-b|0;I[a+178>>1]=b+L[a+178>>1];I[a+116>>1]=c+L[a+116>>1];I[a+118>>1]=b+L[a+118>>1]}function Be(a){a=a|0;var b=0,c=0,d=0,e=0;e=J[a+16>>2];Dd(a+12|0);b=J[a+20>>2];if((b|0)>0){while(1){d=J[(c<<2)+e>>2];if(d){bd[J[J[d>>2]+4>>2]](d);b=J[a+20>>2]}c=c+1|0;if((b|0)>(c|0)){continue}break}}}function oC(a,b){a=a|0;b=b|0;var c=0;if(J[263697]){a=0}else{a=J[b+8>>2];c=P(a,796)+834883|0;a:{if(J[b>>2]==2){b=0;if(K[P(a,796)+834883|0]){break a}}b=K[P(a,796)+834854|0]!=0}H[c|0]=b;a=1}return a|0}function mC(a,b){a=a|0;b=b|0;var c=0;if(J[263697]){a=0}else{a=J[b+8>>2];c=P(a,796)+834882|0;a:{if(J[b>>2]==2){b=0;if(K[P(a,796)+834882|0]){break a}}b=K[P(a,796)+834854|0]!=0}H[c|0]=b;a=1}return a|0}function Rf(a,b){var c=0,d=0;c=L[b+4>>1];if(c>>>0>=261){Yd(15414);c=L[b+4>>1]}if(c&65535){c=0;while(1){d=Tm(H[J[b>>2]+c|0],a+d|0)+d|0;c=c+1|0;if(c>>>0<L[b+4>>1]){continue}break}}H[a+d|0]=0;return d}function On(a,b){var c=0,d=0;d=J[a+16>>2];c=J[J[a>>2]+(d<<2)>>2];J[a+16>>2]=J[a+8>>2]&d+1;J[a+12>>2]=J[a+12>>2]-1;J[b>>2]=c&134217727;if(c>>>0>=134217728){bh(a,c+-134217728|0);a=0}else{a=1}return a}function OJ(a){a=a|0;var b=0,c=0;c=J[207101];a=H[a|0]>99;H[c+460|0]=a;if(!K[52865]){b=P(a,16843009);H[131415]=b;H[131416]=b>>>8;H[131417]=b>>>16;H[131418]=b>>>24;H[132183]=a;H[131419]=a}lq(c+460|0)}function GI(a){a=a|0;var b=0,c=0;H[1801724]=1;b=K[1811802];c=K[1054733];J[a+8>>2]=2052;b=!b|(c|0)!=0;H[a+52|0]=b;J[a+60>>2]=b?0:10;Vj(a- -64|0);nd(1040856,a,839);nd(1041116,a,840);nd(1041376,a,841)}function Ce(a,b,c){var d=0,e=0;d=$c-16|0;$c=d;e=a+40|0;Cd(e);Ef(d,b,c,1);wh(e,d);b=L[a+50>>1];if(!b){b=Ej(c,1);I[a+50>>1]=b}J[a+16>>2]=b&65535;J[a+12>>2]=L[a+48>>1];bd[J[J[a>>2]+8>>2]](a);$c=d+16|0}function BA(a,b){a=a|0;b=Q(b);var c=0;a=0;a:{if(J[263682]<=0){break a}while(1){c=J[(a<<2)+1054816>>2];H[c+7|0]=1;if(bd[J[J[c>>2]+48>>2]](c,b)|0){break a}a=a+1|0;if((a|0)<J[263682]){continue}break}}}function nJ(a){a=a|0;var b=0;a:{b:{if(!K[52793]){b=a+1|0;a=K[a|0];break b}b=a+2|0;a=(vd(a)>>>0)%768|0;if(!K[52793]){break b}b=(vd(b)>>>0)%768|0;break a}b=K[b|0]}to(a);if(b){I[(b<<1)+1066208>>1]=a}}function mn(a,b,c){N[a>>2]=N[b>>2]+N[c>>2];N[a+4>>2]=N[b+4>>2]+N[c+4>>2];N[a+8>>2]=N[b+8>>2]+N[c+8>>2];N[a+12>>2]=N[b+12>>2]+N[c>>2];N[a+16>>2]=N[b+16>>2]+N[c+4>>2];N[a+20>>2]=N[b+20>>2]+N[c+8>>2]}function $m(a,b,c){var d=0,e=0;d=$c-16|0;$c=d;if((c|0)==-1){c=J[a+56>>2];J[a+56>>2]=c+1}e=d+8|0;$d(e,829176,L[(b<<1)+828408>>1]-2|0);I[((c<<1)+a|0)+152>>1]=b;at((P(c,28)+a|0)+1176|0,a,e);$c=d+16|0}function Zy(a){a=a|0;var b=0;a=J[458157];if(!(!J[266967]|(a|0)==J[268523])){Eg();a=J[458157]}b=Kk();J[268523]=a;J[266967]=b;Gd(1070432,1,512);Gd(1069920,0,512);Gd(1073504,1,512);Gd(1072992,0,512)}function qv(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0;d=$c-16|0;$c=d;e=Cp(a);f=J[a+4>>2];J[d+8>>2]=J[a>>2];J[d+12>>2]=f;a:{if(c){Ij(a,b,501);break a}if(!e){break a}a=d+8|0;bs(a);jf(b,a)}$c=d+16|0}function ph(a,b,c){var d=0,e=0;H[a|0]=5;d=Fe(b);H[a+2|0]=d;H[a+1|0]=0;a=a+3|0;if((d|0)>0){while(1){H[a|0]=K[b+e|0];a=a+1|0;e=e+1|0;if((d|0)!=(e|0)){continue}break}}Gf(a,(B(c),v(2)));return a+4|0}function UE(a,b){a=a|0;b=b|0;var c=0,d=Q(0),e=Q(0),f=Q(0);c=$c-16|0;$c=c;e=N[a+8>>2];d=N[a+4>>2];a=0;a:{if(!Pe(b,c+12|0)){break a}f=d;d=N[c+12>>2];if(!(f<=d)){break a}a=d<=e}$c=c+16|0;return a|0}function Lq(a){var b=0,c=0;b=$c-32|0;$c=b;c=J[a+4>>2];J[b+24>>2]=J[a>>2];J[b+28>>2]=c;a:{while(1){a=1;if(!Df(b+24|0,b+16|0,b+15|0)){break a}if(!L[b+20>>1]){continue}break}a=0}$c=b+32|0;return a}function JE(a,b){a=a|0;b=b|0;var c=0;if(K[1811805]){a=1}else{a=b&255;c=L[(a<<1)+41760>>1];a:{if(b>>>0<=31){break a}c=b&255;if(b>>>0<=126){break a}c=L[(a<<1)+41570>>1]}a=(c|0)==(b|0)}return a|0}function Iq(a,b){var c=0,d=0;c=$c-32|0;$c=c;d=J[b+4>>2];J[c+24>>2]=J[b>>2];J[c+28>>2]=d;if(Df(c+24|0,c+16|0,c+15|0)){while(1){b=c+16|0;ye(a,b);if(Df(c+24|0,b,c+15|0)){continue}break}}$c=c+32|0}function Fv(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;d=$c-16|0;$c=d;e=J[a+4>>2];J[d+8>>2]=J[a>>2];J[d+12>>2]=e;a:{if(c){Ij(a,b,495);break a}if(!Ii(a,37216)){break a}a=d+8|0;bs(a);jf(b,a)}$c=d+16|0}function lA(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;if(d){J[12606]=1048576e3;H[1054874]=1;J[263719]=1040187392;I[527478]=L[(J[266937]+J[266938]<<1)+1066048>>1];J[263721]=0;H[1054872]=0;H[1054873]=0}}function iI(a,b,c){a=a|0;b=b|0;c=c|0;a:{if(!K[a+4|0]|J[263697]!=(a|0)){break a}if((b|0)==92){jk(a,1)}if(!K[1811805]){break a}if(!Ue(17,b,c)|!K[1869221]){break a}ym(a+856|0,!K[a+876|0]);_g(a)}}function Sh(a){var b=0;a=J[195008]+(a<<1)|0;if(!(!K[L[a+648>>1]+83792|0]|K[L[a+612>>1]+80720|0]==4|(K[L[a+646>>1]+80720|0]==4|K[L[a+650>>1]+80720|0]==4))){b=K[L[a+684>>1]+80720|0]!=4}return b}function Gm(a){var b=Q(0),c=Q(0),d=Q(0),e=Q(0),f=Q(0);b=N[a+8>>2];c=N[a>>2];d=N[a+4>>2];e=Q(Q(b*b)+Q(Q(c*c)+Q(d*d)));if(e!=Q(0)){f=b;b=Q(Q(1)/Q(Y(e)));N[a+8>>2]=f*b;N[a+4>>2]=d*b;N[a>>2]=c*b}}function $d(a,b,c){var d=0,e=0,f=0;if(!(J[b+8>>2]>(c|0)&(c|0)>=0)){Yd(15325)}d=J[b>>2];e=J[b+5144>>2];f=J[b+5148>>2];b=J[J[b+4>>2]+(c<<2)>>2];c=f&b;I[a+6>>1]=c;I[a+4>>1]=c;J[a>>2]=(b>>>e|0)+d}function Yh(a,b){var c=0,d=0,e=0;c=$c-80|0;$c=c;e=J[b+36>>2];J[c+76>>2]=4194304;J[c+72>>2]=c;d=c+72|0;od(d,J[b+80>>2]);if(J[e>>2]){od(d,28492);bd[J[e>>2]](b,d)}gf(b,c+72|0,a+108|0);$c=c+80|0}function zf(a,b,c){a=Eh(a,b,c);b=a+66896|0;c=0;a:{if(K[b+1536|0]){break a}c=1;if(K[b+16896|0]){break a}b=a+66896|0;if(!(K[b+13824|0]!=1|!K[b+768|0]|K[a+79952|0]!=255)){return 1}c=0}return c}function sz(a,b,c){a=a|0;b=b|0;c=c|0;a=J[(K[a+792|0]<<2)+1066040>>2];if(a&16){N[c>>2]=N[c>>2]+Q(-1)}if(a&32){N[c>>2]=N[c>>2]+Q(1)}if(a&1){N[b>>2]=N[b>>2]+Q(-1)}if(a&2){N[b>>2]=N[b>>2]+Q(1)}}function qC(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;if((a|0)>0){while(1){b=a-1|0;e=b<<2;J[e+d>>2]=P(K[(b>>>1|0)+c|0]>>>((e^-1)&4)&15,1118481)|-16777216;e=a>>>0>1;a=b;if(e){continue}break}}}function bu(){var a=0,b=0;if(!K[1054197]){a=K[834856]?K[834854]?J[J[203292]+44>>2]:48424:48424;J[203292]=a;b=(a|0)==48472;H[813200]=b;xf(7,(a|0)==48520?1:b<<1);J[203302]=0;J[203301]=0;Rh()}}function Gi(a,b,c){var d=Q(0),e=Q(0),f=0;f=J[458158];J[c>>2]=b>>>J[458159];J[a>>2]=0;d=N[458160];N[a+8>>2]=.9993749856948853;e=Q(d*Q(b&f));N[a+4>>2]=e;N[a+12>>2]=Q(d*Q(.9993749856948853))+e}function tE(a,b){a=a|0;b=Q(b);var c=0,d=0,e=0;c=Ug(a+52|0,b);c=J[a+40>>2]-c|0;J[a+40>>2]=c;d=J[a+44>>2]-J[a+48>>2]|0;e=(d|0)>(c|0);c=e?c:d;if(!(e&(c|0)>=0)){J[a+40>>2]=(c|0)>0?c:0}return 1}function cx(a){a=a|0;var b=0,c=Q(0),d=0;b=$c-80|0;$c=b;d=J[207101];Pe(a,b);c=Nl(N[b>>2]);N[d+744>>2]=c;N[d+740>>2]=c;J[b+76>>2]=4194304;J[b+72>>2]=b;a=b+72|0;$e(a,c,8);Re(1270,a);$c=b+80|0}function Ln(a,b,c,d,e,f,g){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;g=g|0;a=((((K[f+80720|0]==3)<<9)+(L[(P(f,6)+g<<1)+122192>>1]>>>J[458159]|0)<<5)+(g<<2)|0)+780112|0;J[a>>2]=J[a>>2]+4;return 1}function HI(a){a=a|0;var b=0,c=0,d=0;Zd(a);b=a+36|0;Pf(b,16,4);am(b,2);d=a+332|0;c=$c-16|0;$c=c;if(K[1054793]){Ef(c,44720,b,1);wh(d+124|0,c)}$c=c+16|0;et(a);Lo(a+192|0,41324,b,41332);dt(a)}function Fx(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;if(Sh(e)){a=0}else{a=(((K[f+80720|0]==3)<<9)+(L[P(f,12)+122202>>1]>>>J[458159]|0)<<5)+780132|0;J[a>>2]=J[a>>2]+4;a=1}return a|0}function lu(a){a=a|0;var b=0,c=0,d=0;c=K[a+48|0];b=a+76|0;te(b);d=a+88|0;nf(d);Zd(a);Vi(a);Ui(a);xn(a);td(a+652|0,c?5981:1674,b);td(a+736|0,c?1660:9861,b);Qg(a+100|0,d);td(a+820|0,9861,b)}function Vu(a,b){a=a|0;b=b|0;J[269191]=16864;J[269194]=10816;J[269192]=514;J[269190]=515;J[269193]=516;J[269189]=517;J[269188]=518;H[1075950]=1;H[1075948]=1;J[268986]=35472;Ad(1075944,50)}function OB(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;if((a|0)>0){while(1){f=a-1|0;e=f<<2;J[e+d>>2]=J[((K[(f>>>1|0)+c|0]>>>((e^-1)&4)&15)<<2)+b>>2];e=a>>>0>1;a=f;if(e){continue}break}}}function $l(a){var b=0,c=0;qf(a);bd[J[a+12>>2]](a)|0;if(!(H[a|0]&1)){b=J[a+56>>2];c=J[a+52>>2];if(c){J[c+56>>2]=b}if(b){J[b+52>>2]=c}if(J[467461]==(a|0)){J[467461]=b}Fj(J[a+96>>2]);Fj(a)}}function wC(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;if((a|0)>0){while(1){b=a-1|0;J[(b<<2)+d>>2]=P(K[(b>>>2|0)+c|0]>>>(0-a<<1&6)&3,5592405)|-16777216;e=a>>>0>1;a=b;if(e){continue}break}}}function rv(a,b){a=a|0;b=b|0;var c=0,d=0;c=$c-288|0;$c=c;d=c+8|0;Yi(d,a,b);J[c+284>>2]=17039360;J[c+280>>2]=c+16;b=c+280|0;Hd(b,6264,d);if((Dl(b)|0)==J[11486]){pd(13015);Fk(a)}$c=c+288|0}function ix(a,b){a=a|0;b=b|0;J[269191]=26586;J[269194]=2885;J[269192]=496;J[269190]=497;J[269193]=498;J[269189]=499;J[269188]=500;H[1075950]=1;H[1075948]=1;J[268986]=35472;Ad(1075944,50)}function Uu(a,b){a=a|0;b=b|0;J[269191]=26572;J[269194]=4137;J[269192]=519;J[269190]=520;J[269193]=521;J[269189]=517;J[269188]=522;H[1075950]=1;H[1075948]=1;J[268986]=35472;Ad(1075944,50)}function Su(a,b){a=a|0;b=b|0;J[269191]=16864;J[269194]=9769;J[269192]=523;J[269190]=524;J[269193]=516;J[269189]=517;J[269188]=525;H[1075950]=1;H[1075948]=1;J[268986]=35472;Ad(1075944,50)}function wA(a,b){a=a|0;b=b|0;var c=0;a=0;a:{if(J[263682]<=0){break a}while(1){c=J[(a<<2)+1054816>>2];if(bd[J[J[c>>2]+32>>2]](c,b)|0){break a}a=a+1|0;if((a|0)<J[263682]){continue}break}}}function fk(a,b,c){J[a+28>>2]=963;J[a+8>>2]=967;J[a+32>>2]=b;J[a+24>>2]=982;J[a+20>>2]=983;J[a+16>>2]=984;J[a+12>>2]=985;J[a+4>>2]=986;J[a>>2]=987;J[a+44>>2]=b;J[a+40>>2]=c;J[a+36>>2]=c}function ef(a,b,c){var d=0,e=0;H[a|0]=1;d=Fe(b);H[a+2|0]=d;H[a+1|0]=0;a=a+3|0;if((d|0)>0){while(1){H[a|0]=K[b+e|0];a=a+1|0;e=e+1|0;if((d|0)!=(e|0)){continue}break}}H[a|0]=c;return a+1|0}function Fd(a){var b=0,c=0,d=0;b=GN(J[a>>2],J[a+4>>2],-554899859,5);c=ad;b=b+11|0;c=b>>>0<11?c+1|0:c;J[a>>2]=b;d=a;a=c&65535;J[d+4>>2]=a;return Q(Q(a<<8|b>>>24)*Q(5.960464477539063e-8))}function tj(a,b,c){var d=0,e=0;H[a|0]=3;d=Fe(b);H[a+2|0]=d;H[a+1|0]=0;a=a+3|0;if((d|0)>0){while(1){H[a|0]=K[b+e|0];a=a+1|0;e=e+1|0;if((d|0)!=(e|0)){continue}break}}Gf(a,c);return a+4|0}function rh(a,b,c){var d=0,e=0;H[a|0]=7;d=Fe(b);H[a+2|0]=d;H[a+1|0]=0;a=a+3|0;if((d|0)>0){while(1){H[a|0]=K[b+e|0];a=a+1|0;e=e+1|0;if((d|0)!=(e|0)){continue}break}}Gf(a,c);return a+4|0}function mf(a,b,c,d){a:{switch(a|0){case 2:return d-(b+c|0)|0;case 3:return((d|0)/2|0)+b|0;case 4:return((d|0)/2|0)-(b+c|0)|0;default:b=((d-c|0)/2|0)+b|0;break;case 0:break a}}return b}function df(a,b,c){var d=0,e=0;H[a|0]=2;d=Fe(b);H[a+2|0]=d;H[a+1|0]=0;a=a+3|0;if((d|0)>0){while(1){H[a|0]=K[b+e|0];a=a+1|0;e=e+1|0;if((d|0)!=(e|0)){continue}break}}fe(a,c);return a+2|0}function PB(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;if((a|0)>0){while(1){e=a-1|0;J[(e<<2)+d>>2]=J[((K[(e>>>2|0)+c|0]>>>(0-a<<1&6)&3)<<2)+b>>2];f=a>>>0>1;a=e;if(f){continue}break}}}function ei(){var a=Q(0),b=0;if(K[1054792]){a=Q(Q(Q(N[263687]*Q(cl()|0))*Q(10))+Q(.5));a:{if(Q(R(a))<Q(2147483648)){b=~~a;break a}b=-2147483648}return Q(Q(b|0)/Q(10))}return N[263687]}function My(a,b){a=a|0;b=b|0;var c=0,d=0;c=$c-80|0;$c=c;d=J[b+36>>2];Zn(a);J[a+84>>2]=b;J[c+76>>2]=4194304;J[c+72>>2]=c;a=c+72|0;bd[J[d>>2]](b,a);Ek(d+16|0,a,311,K[1054793]);$c=c+80|0}function yg(a,b,c){Ks(a);J[b+44736>>2]=0;J[b+36>>2]=0;J[b+28>>2]=c;J[b+24>>2]=0;J[b+16>>2]=0;J[b+20>>2]=0;J[b+4>>2]=0;J[b+8>>2]=0;I[b>>1]=0;J[b+12>>2]=b- -64;J[a>>2]=101;J[a+32>>2]=b}function gt(a,b){J[450241]=4194304;J[450240]=1800980;J[450198]=0;J[450244]=0;ye(1800960,a);J[450243]=4194304;J[450242]=1801044;ye(1800968,b);I[900374]=257;Ad(1800744,K[1054197]?55:5)}function uD(){var a=0;a=J[466470];if((a|0)!=1865888){qd(a)}J[466470]=1865888;J[466468]=0;J[466469]=10;a=J[465686];if((a|0)!=1862752){qd(a)}J[465686]=1862752;J[465684]=0;J[465685]=10}function XB(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;if((a|0)>0){while(1){e=a-1|0;J[(e<<2)+d>>2]=J[((K[(e>>>3|0)+c|0]>>>(0-a&7)&1)<<2)+b>>2];f=a>>>0>1;a=e;if(f){continue}break}}}function Li(a){var b=0,c=0,d=0,e=0,f=0;a:{b=L[a+4>>1];if(!b){break a}e=J[a>>2];c=b;while(1){d=c-1|0;if(K[d+e|0]!=32){break a}b=b-1|0;I[a+4>>1]=b;f=c>>>0>1;c=d;if(f){continue}break}}}function EH(a,b){a=a|0;b=Q(b);var c=0;a:{if(K[1056204]|K[1056205]|(K[1056202]|K[1056203])){break a}if(K[1056200]|K[1056201]){break a}c=bd[J[J[a+48>>2]+20>>2]](a+48|0,b)|0}return c|0}function xp(a,b){var c=0,d=0,e=0;c=$c-256|0;$c=c;d=Sd(a,c,2);a:{if(d){break a}d=-857812910;e=vd(c);if(e>>>0>256){break a}d=Sd(a,c,e);if(d){break a}Sf(b,c,e);d=0}$c=c+256|0;return d}function jh(a,b,c){var d=0;d=K[c|0];if(d){b=L[a+4>>1]-b|0;while(1){a:{if(L[a+4>>1]>(b|0)){H[J[a>>2]+b|0]=d;break a}Ud(a,d<<24>>24)}b=b+1|0;d=K[c+1|0];c=c+1|0;if(d){continue}break}}}function Uj(a){var b=0,c=0,d=0,e=0;I[a+68>>1]=0;d=J[10438];e=J[10439];while(1){c=(b<<3)+a|0;J[c+72>>2]=d;J[c+76>>2]=e;b=b+1|0;if((b|0)!=3){continue}break}J[a+160>>2]=-1;Cd(a+112|0)}function oh(a){var b=0,c=0,d=0;b=J[263429];a:{if((b|0)>255){break a}c=J[263430];if((c|0)>255){break a}d=J[263431];if((d|0)>255){break a}a=b&255|c<<8&65280|d<<16|-16777216}return a}function ZA(a){a=a|0;var b=0,c=0;b=$c-16|0;$c=b;c=J[a+4>>2];a=J[a>>2];J[b+8>>2]=a;J[b+12>>2]=c;if(c&65535){while(1){Bs(b+8|0,b);Od(6249,b);if(L[b+12>>1]){continue}break}}$c=b+16|0}function VE(a,b){a=a|0;b=b|0;var c=0,d=0;a=$c-16|0;$c=a;c=1;a:{if(L[b+4>>1]==1){d=K[J[b>>2]];if((d-58&255)>>>0>245|(d-47&255)>>>0>252){break a}}c=Pe(b,a+12|0)}$c=a+16|0;return c|0}function Co(a){var b=0,c=0,d=0,e=0;c=J[265102];if((c|0)>0){b=1058352;while(1){d=J[b>>2];if((d|0)>=(a|0)){J[b>>2]=d-1}b=b+8|0;e=e+1|0;if((c|0)!=(e|0)){continue}break}}Lh(1060400,a)}function ut(a,b,c,d){var e=0;e=$c-16|0;$c=e;if(K[1811820]){H[e+7|0]=58;fe(e+8|0,a&65535);fe(e+10|0,b&65535);fe(e+12|0,c&65535);fe(e+14|0,d&65535);bd[J[452942]](e+7|0,9)}$c=e+16|0}function ts(a,b,c,d){var e=0,f=0;I[a+6>>1]=d;I[a+4>>1]=c;e=a,f=Ge(P(c,3),2),J[e+8>>2]=f;c=a;a=wf(L[b+4>>1]+1|0,1);J[c>>2]=a;if(!a){return-857812988}Vf(a,L[b+4>>1]+1|0,b);return 0}function qN(a){a=a|0;var b=0,c=0;c=$c-16|0;$c=c;Zd(a);b=c+4|0;te(b);ee(a+372|0,9721,b);td(a+36|0,9655,b);td(a+120|0,9875,b);td(a+204|0,14302,b);td(a+288|0,9861,b);Ed(b);$c=c+16|0}function iM(a){a=a|0;var b=0,c=0;J[a+28>>2]=4;J[a+20>>2]=0;J[a+16>>2]=a+360;xd(a,a+36|0,400,558);xd(a,a+120|0,400,559);xd(a,a+204|0,400,560);pe(a,a+288|0);b=a,c=oe(a),J[b+8>>2]=c}function Xg(a,b){var c=0,d=0,e=0;d=L[b+4>>1];if(d){while(1){e=K[J[b>>2]+c|0];a:{if((e|0)==38){c=c+1|0;break a}Ud(a,e<<24>>24);d=L[b+4>>1]}c=c+1|0;if((d|0)>(c|0)){continue}break}}}function Vf(a,b,c){var d=0,e=0,f=0;e=L[c+4>>1];f=(b|0)>(e|0)?e:b;if((f|0)>0){while(1){H[a+d|0]=K[J[c>>2]+d|0];d=d+1|0;if((f|0)!=(d|0)){continue}break}}if((b|0)>(e|0)){H[a+f|0]=0}}function yh(a){var b=0,c=0;b=J[13643];c=a+7&-8;a=b+c|0;a:{if(a>>>0<=b>>>0?c:0){break a}if(a>>>0>cd()<<16>>>0){if(!(nc(a|0)|0)){break a}}J[13643]=a;return b}J[467445]=48;return-1}function uC(a){a=a|0;var b=0;a=0;while(1){b=J[(a<<2)+827376>>2];a:{if(!b){break a}if(K[b+54|0]&2){Dd(b+416|0)}if(K[1054310]){break a}Ul(b)}a=a+1|0;if((a|0)!=256){continue}break}}function _k(){var a=0,b=0,c=0;a:{b=J[263682];if((b|0)<=0){break a}while(1){c=J[(a<<2)+1054816>>2];if(!K[c+4|0]){a=a+1|0;if((b|0)!=(a|0)){continue}break a}break}return c}return 0}function Si(a,b){a:{b:{if(!(L[b+4>>1]?b:0)){if($r(1563656,a,61)){break b}break a}Ci(1563656,a,b,61)}if(!K[1573964]){Kh(1563656,2159);cg(1568808)}if(pn(a)){break a}jf(1568808,a)}}function Oo(){var a=0,b=0,c=0;a:{b=J[263682];if((b|0)<=0){break a}while(1){c=J[(a<<2)+1054816>>2];if(!K[c+5|0]){a=a+1|0;if((b|0)!=(a|0)){continue}break a}break}return c}return 0}function zC(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;if((a|0)>0){while(1){b=a-1|0;J[(b<<2)+d>>2]=K[(b>>>3|0)+c|0]>>>(0-a&7)&1?-1:-16777216;e=a>>>0>1;a=b;if(e){continue}break}}}function xI(a){a=a|0;var b=0;if(J[a+56>>2]>0){while(1){Cd((P(b,28)+a|0)+1176|0);b=b+1|0;if((b|0)<J[a+56>>2]){continue}break}}bd[J[J[a+64>>2]+4>>2]](a- -64|0);Ed(a+136|0);Be(a)}function YD(a){a=a|0;var b=0,c=0;b=$c-16|0;$c=b;c=J[a+32>>2];a=Er(a);if(!a){a=b+8|0;_r(a,J[c+115580>>2]^-1);_r(b+12|0,J[c+115584>>2]);a=ce(J[c+20>>2],a,8)}$c=b+16|0;return a|0}function TF(a){a=a|0;var b=0,c=0;J[a+28>>2]=6;J[a+20>>2]=0;J[a+16>>2]=1859040;bj(a,a+120|0,195,43280,4);bj(a,a+456|0,400,43328,1);xd(a,a+36|0,400,1006);b=a,c=oe(a),J[b+8>>2]=c}function Le(a,b,c,d){var e=0,f=0;e=$c-16|0;$c=e;f=a;a=e+8|0;a:{if(!Hf(f,a)){break a}if(!De(a,e+4|0)){break a}a=J[e+4>>2];a=(a|0)>(b|0)?a:b;d=(a|0)<(c|0)?a:c}$c=e+16|0;return d}function GF(a){a=a|0;var b=0,c=0;J[a+28>>2]=7;J[a+20>>2]=0;J[a+16>>2]=1859104;bj(a,a+120|0,195,43344,4);bj(a,a+456|0,400,43392,2);xd(a,a+36|0,400,1009);b=a,c=oe(a),J[b+8>>2]=c}function jq(a,b,c){var d=0,e=0;e=c+44|0;d=rf(e,b);if((d|0)<0){b=J[10439];J[a>>2]=J[10438];J[a+4>>2]=b;return}b=Fe(b)+d|0;d=Zg(e,b,32);if((d|0)<0){d=L[c+48>>1]}Ke(a,e,b,d-b|0)}function XF(a){a=a|0;var b=0;Zd(a);while(1){Fi(a,(P(b,84)+a|0)+288|0);b=b+1|0;if((b|0)!=4){continue}break}b=a+624|0;td(a+36|0,13837,b);td(a+120|0,19550,b);td(a+204|0,19454,b)}function Wh(a,b,c,d){var e=0;a:{e=b;b=K[J[464804]+a|0];b:{if((b&252)==8){a=1;if((b&254)==8){break b}break a}if(K[b+75344|0]){break a}bh(779960,a|-268435456);a=10}re(e,c,d,a)}}function Ty(){J[263482]=0;Lk();Gd(1067872,0,2048);Gd(1070944,0,2048);J[268507]=2147483647;J[268505]=2147483647;J[268506]=2147483647;_n();qd(J[268508]);J[268509]=0;J[268508]=0}function Nk(a,b,c,d){var e=0;e=$c-272|0;$c=e;J[e+264>>2]=16777216;J[e+260>>2]=e;J[e+268>>2]=a;a=e+260|0;Tf(a,27987,e+268|0,b,c);fj(a,J[e+268>>2],d);bd[J[12861]](a);$c=e+272|0}function zm(a,b){var c=0,d=0;c=$c-32|0;$c=c;d=J[a+296>>2];I[c+24>>1]=0;J[c+16>>2]=0;J[c+12>>2]=d;J[c+8>>2]=a- -64;a=J[a+292>>2];J[c+28>>2]=b;J[c+20>>2]=a;Xq(c+8|0);$c=c+32|0}function sG(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=b;b=J[a+36>>2];b=b>>>0<c>>>0?b:c;Kd(e,J[a+32>>2],b);J[a+32>>2]=b+J[a+32>>2];J[a+36>>2]=J[a+36>>2]-b;J[d>>2]=b;return 0}function Vo(a){var b=0,c=0;b=$c-2064|0;$c=b;J[b+12>>2]=0;Ha(a|0,35716,b+12|0);if(J[b+12>>2]>=2){c=a;a=b+16|0;Zb(c|0,2047,0,a|0);H[b+2063|0]=0;Qf(7661,a)}Yd(7661);$c=b+2064|0}function Qq(){var a=0;a=J[13624];J[13624]=a-1|a;a=J[13606];if(a&8){J[13606]=a|32;return-1}J[13607]=0;J[13608]=0;a=J[13617];J[13613]=a;J[13611]=a;J[13610]=a+J[13618];return 0}function KD(a){a=a|0;var b=0,c=0,d=0,e=0;b=J[a+40>>2];if((b|0)>0){e=J[a+84>>2];while(1){d=P(c,28)+e|0;if(J[d>>2]){kh(d);b=J[a+40>>2]}c=c+1|0;if((b|0)>(c|0)){continue}break}}}function ie(a){var b=0;if(J[12443]!=(a|0)){J[12443]=a;J[263623]=J[(a<<2)+33804>>2];a:{if((a|0)==1){ma(2);b=204;a=205;break a}Kb(2);b=206;a=207}J[263678]=b;J[263677]=a;Fg()}}function YF(a){a=a|0;var b=0;while(1){md((P(b,84)+a|0)+288|0,1,1,0,P(b,50)-75|0);b=b+1|0;if((b|0)!=4){continue}break}aj(a+36|0);md(a+120|0,1,1,-220,0);md(a+204|0,1,1,220,0)}function Xm(a,b,c){J[a+28>>2]=963;J[a+16>>2]=965;J[a+8>>2]=967;J[a+32>>2]=b;J[a+24>>2]=977;J[a+20>>2]=978;J[a+12>>2]=979;J[a+4>>2]=980;J[a>>2]=981;J[a+40>>2]=c;J[a+36>>2]=c}function Sq(a){var b=0;b=2;if(!zh(a,43)){b=K[a|0]!=114}b=zh(a,120)?b|128:b;b=zh(a,101)?b|524288:b;a=K[a|0];b=(a|0)==114?b:b|64;b=(a|0)==119?b|512:b;return(a|0)==97?b|1024:b}function $H(a){a=a|0;var b=0,c=0;c=$c-16|0;$c=c;$s(a);_s(a);Zd(a);if(K[1054793]){b=c+4|0;te(b);td(a+2292|0,13479,b);td(a+2124|0,15284,b);td(a+2208|0,9861,b);Ed(b)}$c=c+16|0}function zG(a,b){a=a|0;b=b|0;var c=0;c=-857812989;a:{if(M[a+36>>2]<b>>>0){break a}c=J[a+32>>2];c=bd[J[c+12>>2]](c,b)|0;if(c){break a}J[a+36>>2]=J[a+36>>2]-b;c=0}return c|0}function yK(a){a=a|0;var b=0,c=0;b=J[10106];J[a+72>>2]=J[10105];J[a+76>>2]=b;c=J[10104];b=a- -64|0;J[b>>2]=J[10103];J[b+4>>2]=c;b=J[10102];J[a+56>>2]=J[10101];J[a+60>>2]=b}function uK(a){a=a|0;var b=0,c=0;b=J[10126];J[a+72>>2]=J[10125];J[a+76>>2]=b;c=J[10124];b=a- -64|0;J[b>>2]=J[10123];J[b+4>>2]=c;b=J[10122];J[a+56>>2]=J[10121];J[a+60>>2]=b}function tJ(a){a=a|0;var b=0;b=K[a+4|0];if(!(!b|(b|0)==32|((b|0)==255|(b-37&255)>>>0<2))){J[(b<<2)+825316>>2]=K[a|0]|K[a+1|0]<<8|(K[a+2|0]<<16|K[a+3|0]<<24);Rd(1047356,b)}}function _E(a,b){a=a|0;b=b|0;var c=0,d=0;c=$c-16|0;$c=c;d=J[a+8>>2];a=J[a+4>>2];if(De(b,c+12|0)){b=a;a=J[c+12>>2];a=(b|0)<=(a|0)&(a|0)<=(d|0)}else{a=0}$c=c+16|0;return a|0}function PK(a){a=a|0;var b=0,c=0;b=J[10051];J[a+72>>2]=J[10050];J[a+76>>2]=b;c=J[10049];b=a- -64|0;J[b>>2]=J[10048];J[b+4>>2]=c;b=J[10047];J[a+56>>2]=J[10046];J[a+60>>2]=b}function Mf(a,b){var c=0,d=0;H[a|0]=10;c=Fe(b);H[a+2|0]=c;H[a+1|0]=0;a=a+3|0;if((c|0)>0){while(1){H[a|0]=K[b+d|0];a=a+1|0;d=d+1|0;if((c|0)!=(d|0)){continue}break}}return a}function Lt(a){a=a|0;var b=0,c=0;b=J[10057];J[a+72>>2]=J[10056];J[a+76>>2]=b;c=J[10055];b=a- -64|0;J[b>>2]=J[10054];J[b+4>>2]=c;b=J[10053];J[a+56>>2]=J[10052];J[a+60>>2]=b}function IK(a){a=a|0;var b=0,c=0;b=J[10088];J[a+72>>2]=J[10087];J[a+76>>2]=b;c=J[10086];b=a- -64|0;J[b>>2]=J[10085];J[b+4>>2]=c;b=J[10084];J[a+56>>2]=J[10083];J[a+60>>2]=b}function DI(a,b){a=a|0;b=b|0;var c=0,d=0;d=J[a+56>>2];if((d|0)>0){while(1){if(L[((c<<1)+a|0)+152>>1]==(b|0)){bt(a,c);kk(a);return}c=c+1|0;if((d|0)!=(c|0)){continue}break}}}function CK(a){a=a|0;var b=0,c=0;b=J[10097];J[a+72>>2]=J[10096];J[a+76>>2]=b;c=J[10095];b=a- -64|0;J[b>>2]=J[10094];J[b+4>>2]=c;b=J[10093];J[a+56>>2]=J[10092];J[a+60>>2]=b}function yN(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;b=lj(a,b,c,d);J[a+24>>2]=b;a:{if((b|0)<0){break a}a=J[J[a+16>>2]+(b<<2)>>2];if(J[a+36>>2]!=1e4){break a}Wq(a- -64|0)}return 1}function jk(a,b){H[a+4|0]=0;Mo();Vq();if(b){Uj(a+72|0)}bd[J[a+124>>2]](a+72|0);ym(a+856|0,0);_g(a);b=J[203556]-J[263684]|0;if((b|0)!=J[a+44>>2]){J[a+44>>2]=b;xg(a+672|0)}}function ii(a,b,c,d){var e=0,f=0,g=0;e=P(J[464807],P(J[464809],b)+c|0)+a|0;f=K[e+J[464804]|0];e=K[e+J[464805]|0];g=J[464818];re(a,b,c,d);bd[J[452939]](a,b,c,(e<<8|f)&g,d)}function dj(a,b,c){var d=0;d=$c-272|0;$c=d;J[d+264>>2]=16777216;J[d+260>>2]=d;J[d+268>>2]=a;a=d+260|0;xe(a,17109,d+268|0,b);fj(a,J[d+268>>2],c);bd[J[12861]](a);$c=d+272|0}function Zp(a){a=a|0;var b=0;Cd(1040208);Dd(1040212);Dd(1040228);a=0;while(1){b=J[(a<<2)+827376>>2];if(b){Cd(b+324|0);I[b+328>>1]=0}a=a+1|0;if((a|0)!=256){continue}break}}function Pm(a){a=a|0;var b=0,c=0,d=0;b=$c-656|0;$c=b;Je(b,a);c=Mi(b+600|0,b);a:{if(c){Te(c,12214,b);break a}d=b+600|0;c=Nm(d,a);bd[J[b+628>>2]](d)|0}$c=b+656|0;return c|0}function yD(a,b){a=a|0;b=b|0;var c=0;c=Gr(a);a=J[263693];if(a){de(a);a=0;while(1){he(4,((a<<2)+b|0)+(!(c>>>a&1)<<4)|0);a=a+1|0;if((a|0)!=4){continue}break}}return b+32|0}function lk(a,b){var c=0,d=0,e=0;d=63;e=b;c=J[a>>2];a:{b:{while(1){b=d;if(K[b+c|0]&223){break b}d=b-1|0;if(b){continue}break}b=0;break a}b=b+1|0}zs(e,c,b);J[a>>2]=c- -64}function jF(a,b,c){a=a|0;b=b|0;c=c|0;a=Gr(1857608);if(a&8){N[b>>2]=N[b>>2]+Q(-1)}if(a&4){N[b>>2]=N[b>>2]+Q(1)}if(a&2){N[c>>2]=N[c>>2]+Q(-1)}if(a&1){N[c>>2]=N[c>>2]+Q(1)}}function TA(){var a=0;J[263563]=5175;nl(J[464808]/2|0,J[464811],0);J[263563]=5134;nl(0,(J[464808]/2|0)-2|0,3);J[263563]=5154;a=(J[464808]/2|0)-1|0;nl(a,a,2);H[1054228]=1}function Mz(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;d=J[464807];c=(a|0)/(d|0)|0;e=J[464809];b=(c|0)/(e|0)|0;a=a-P(c,d)|0;c=c-P(b,e)|0;if(!(bd[J[266957]](a,b,c)|0)){re(a,b,c,3)}}function AJ(a){a=a|0;var b=0;a:{if(K[52793]){b=a+2|0;a=(vd(a)>>>0)%768|0;break a}b=a+1|0;a=K[a|0]}a=a+66896|0;H[a+64512|0]=K[b|0]!=0;H[a+65280|0]=K[b+1|0]!=0;Nd(1044756)}function vI(a,b){a=a|0;b=b|0;var c=0,d=0;c=$c-16|0;$c=c;d=c+8|0;$d(d,829176,L[(a<<1)+828408>>1]-1|0);$d(c,829176,L[(b<<1)+828408>>1]-1|0);a=ck(d,c);$c=c+16|0;return a|0}function _f(a){a=a|0;var b=0,c=0,d=0;b=J[467304];c=a,d=mf(K[a+22|0],J[a+24>>2],J[a+12>>2],J[467303]),J[c+4>>2]=d;c=a,d=mf(K[a+23|0],J[a+28>>2],J[a+16>>2],b),J[c+8>>2]=d}function Lk(){var a=0;if(J[266966]){if(J[268510]>0){while(1){Zh(J[266966]+P(a,20)|0);a=a+1|0;if((a|0)<J[268510]){continue}break}}Gd(1067872,0,2048);Gd(1070944,0,2048)}}function LB(a){a=a|0;var b=0;a=$c-16|0;$c=a;qd(J[13644]);J[13644]=0;J[13647]=0;H[62784]=0;a:{if(L[26650]){break a}b=a+8|0;if(!Hf(10604,b)){break a}ld(b,7907)}$c=a+16|0}function xG(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0;e=J[a+32>>2];f=b;b=J[a+36>>2];b=bd[J[e>>2]](e,f,b>>>0<c>>>0?b:c,d)|0;J[a+36>>2]=J[a+36>>2]-J[d>>2];return b|0}function fA(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;d=J[464807];c=(a|0)/(d|0)|0;e=J[464809];b=(c|0)/(e|0)|0;a=a-P(c,d)|0;c=c-P(b,e)|0;if(bd[J[266957]](a,b,c)|0){re(a,b,c,2)}}function Tv(a,b){a=a|0;b=Q(b);Gk(a,b);if(J[a+172>>2]){uf(J[a+136>>2]-5|0,J[a+140>>2]-5|0,J[a+144>>2]+10|0,J[a+148>>2]+10|0,-938208236);bd[J[J[a+132>>2]>>2]](a+132|0)}}function zL(a){a=a|0;var b=0,c=0;b=J[9552];J[a+72>>2]=J[9551];J[a+76>>2]=b;c=J[9550];b=a- -64|0;J[b>>2]=J[9549];J[b+4>>2]=c;b=J[9548];J[a+56>>2]=J[9547];J[a+60>>2]=b}function oL(a){a=a|0;var b=0,c=0;b=J[9627];J[a+72>>2]=J[9626];J[a+76>>2]=b;c=J[9625];b=a- -64|0;J[b>>2]=J[9624];J[b+4>>2]=c;b=J[9623];J[a+56>>2]=J[9622];J[a+60>>2]=b}function iL(a){a=a|0;var b=0,c=0;b=J[9702];J[a+72>>2]=J[9701];J[a+76>>2]=b;c=J[9700];b=a- -64|0;J[b>>2]=J[9699];J[b+4>>2]=c;b=J[9698];J[a+56>>2]=J[9697];J[a+60>>2]=b}function cL(a){a=a|0;var b=0,c=0;b=J[9777];J[a+72>>2]=J[9776];J[a+76>>2]=b;c=J[9775];b=a- -64|0;J[b>>2]=J[9774];J[b+4>>2]=c;b=J[9773];J[a+56>>2]=J[9772];J[a+60>>2]=b}function YK(a){a=a|0;var b=0,c=0;b=J[9918];J[a+72>>2]=J[9917];J[a+76>>2]=b;c=J[9916];b=a- -64|0;J[b>>2]=J[9915];J[b+4>>2]=c;b=J[9914];J[a+56>>2]=J[9913];J[a+60>>2]=b}function Wu(a,b){a=a|0;b=b|0;var c=0,d=0;c=J[b+20>>2];if(c){return Zi(a,c)|0}c=0;b=J[b+16>>2];a:{if(!b){break a}d=J[a+32>>2];if(!d){break a}c=Zi(a,P(b,d))}return c|0}function Ip(){var a=0,b=0,c=0;io();Fp();a=J[464827];J[263424]=a;b=1053656,c=Ch(a,1,5421),J[b>>2]=c;b=1053624,c=Ch(J[263424],4,5086),J[b>>2]=c;nt(1053596);nt(1053628)}function As(a){var b=0,c=0;a:{b=L[a+4>>1];if(!b){break a}c=J[a>>2];while(1){if(K[c|0]!=32){break a}b=b-1|0;I[a+4>>1]=b;c=c+1|0;J[a>>2]=c;if(b&65535){continue}break}}}function sL(){wd(1541616,38212);wd(1541632,38256);wd(1541648,38300);tk(1541664,38344);wd(1541680,38388);wd(1541696,38432);Qt(1541712,-3,0,-2,-1);Qt(1541728,0,3,1,2)}function pp(a){var b=0;a:{b:{c:{a=a+66896|0;switch(K[a+13824|0]-4|0){case 0:break a;case 1:break c;default:break b}}return 1}b=K[a+8448|0]!=1|K[1053904]!=0}return b}function is(a,b,c){a:{if(!ld(a,12775)){if(!ld(a,5440)){break a}}H[c|0]=1;return 1}b:{if(!ld(a,13220)){if(!ld(a,8438)){break b}}H[c|0]=0;return 1}Od(8382,b);return 0}function gf(a,b,c){var d=0,e=0,f=0,g=0;d=$c-16|0;$c=d;e=a+40|0;Cd(e);Ef(d,b,c,1);wh(e,d);if(!L[a+50>>1]){f=a,g=Ej(c,1),I[f+50>>1]=g}bd[J[J[a>>2]+8>>2]](a);$c=d+16|0}function bf(a){J[a+56>>2]=1073741824;J[a+60>>2]=1065353216;H[a+47|0]=1;H[a+43|0]=1;H[a+44|0]=1;H[a+45|0]=0;H[a+46|0]=0;J[a+52>>2]=675;J[a+48>>2]=676;I[a+40>>1]=3078}function QC(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=$c-16|0;$c=e;a=Gj(mc(J[a+60>>2],b|0,c|0,d&255,e+8|0)|0);$c=e+16|0;ad=a?-1:J[e+12>>2];return(a?-1:J[e+8>>2])|0}function Ek(a,b,c,d){J[272538]=c;J[272537]=a;H[1089634]=1;H[1089632]=1;H[1089664]=d;J[272540]=4194304;J[272539]=1090164;J[272407]=36460;ke(1090156,b);Ad(1089628,57)}function $L(a){a=a|0;var b=0,c=0,d=0;b=$c-32|0;$c=b;Zd(a);c=b+20|0;te(c);d=b+8|0;nf(d);ee(a+120|0,3726,c);ee(a+192|0,6950,d);td(a+36|0,1857,c);Ed(c);Ed(d);$c=b+32|0}function _F(a){a=a|0;var b=0,c=0,d=0;J[a+636>>2]=0;te(a+624|0);Mm(a);while(1){Fi(a,(P(b,84)+a|0)+288|0);b=b+1|0;if((b|0)!=4){continue}break}c=a,d=oe(a),J[c+8>>2]=d}function Zk(a){var b=0,c=0;c=J[263682];if((c|0)>0){while(1){if(K[b+1054856|0]==(a|0)){return J[(b<<2)+1054816>>2]}b=b+1|0;if((c|0)!=(b|0)){continue}break}}return 0}function Wd(a,b){var c=0,d=0,e=0;c=b;while(1){a:{if(!K[c|0]){e=d;break a}c=c+1|0;e=65535;d=d+1|0;if((d|0)!=65535){continue}}break}I[a+6>>1]=e;I[a+4>>1]=e;J[a>>2]=b}function Or(a){var b=0,c=0;a:{c=L[a+68>>1];if(!c){break a}b=J[a+160>>2];b:{if((b|0)==-1){b=c-1|0;break b}if((b|0)<=0){break a}b=b-1|0;J[a+160>>2]=b}dg(a- -64|0,b)}}function rB(a,b,c){a=a|0;b=b|0;c=c|0;if(!(!(M[464807]<=a>>>0|M[464808]<=b>>>0)&M[464809]>c>>>0)){return J[(J[464849]>(b|0)?84:68)+1859392>>2]}return vj(a,b,c,2)|0}function qB(a,b,c){a=a|0;b=b|0;c=c|0;if(!(!(M[464807]<=a>>>0|M[464808]<=b>>>0)&M[464809]>c>>>0)){return J[(J[464849]>(b|0)?80:64)+1859392>>2]}return vj(a,b,c,1)|0}function pB(a,b,c){a=a|0;b=b|0;c=c|0;if(!(!(M[464807]<=a>>>0|M[464808]<=b>>>0)&M[464809]>c>>>0)){return J[(J[464849]>(b|0)?88:72)+1859392>>2]}return vj(a,b,c,3)|0}function oB(a,b,c){a=a|0;b=b|0;c=c|0;if(!(!(M[464807]<=a>>>0|M[464808]<=b>>>0)&M[464809]>c>>>0)){return J[(J[464849]>(b|0)?76:60)+1859392>>2]}return vj(a,b,c,0)|0}function Xu(a){a=a|0;var b=0,c=0;b=$c-16|0;$c=b;c=b+4|0;An(a,c);td(a+548|0,13965,c);if(!K[1054734]){le(a+128|0,!K[J[207101]+471|0]);H[a+7|0]=1}Ed(b+4|0);$c=b+16|0}function Xl(a,b){var c=0,d=Q(0);c=J[b+8>>2];J[a>>2]=J[b+4>>2];J[a+4>>2]=c;J[a+8>>2]=J[b+12>>2];d=Q(bd[J[J[b+48>>2]+24>>2]](b));N[a+4>>2]=N[a+4>>2]+Q(d*N[b+84>>2])}function ps(a,b,c,d){var e=0,f=0;e=$c-32|0;$c=e;if(L[c+4>>1]){J[e+28>>2]=1572864;J[e+24>>2]=e;f=e+24|0;Ki(f,Jm(J[a>>2],L[a+4>>1]));Ci(b,f,c,32);Kh(b,d)}$c=e+32|0}function Jh(a,b,c,d){var e=Q(0);e=N[b>>2];N[a>>2]=Q(d*Q(N[c>>2]-e))+e;e=N[b+4>>2];N[a+4>>2]=Q(d*Q(N[c+4>>2]-e))+e;e=d;d=N[b+8>>2];N[a+8>>2]=Q(e*Q(N[c+8>>2]-d))+d}function xM(a){a=a|0;var b=0,c=0;c=$c-32|0;$c=c;Zd(a);b=c+20|0;Pf(b,8,4);am(b,1);Lo(a+52|0,37352,b,37360);Ed(b);b=c+8|0;te(b);ee(a+156|0,3766,b);Ed(b);$c=c+32|0}function hz(a,b,c){a=a|0;b=b|0;c=c|0;if(!(!(M[464807]<=a>>>0|M[464808]<=b>>>0)&M[464809]>c>>>0)){return J[464863]}return J[(($h(a,c)|0)<(b|0)?60:76)+1859392>>2]}function hk(a){var b=0;b=$c-144|0;$c=b;J[b+140>>2]=a;J[b+136>>2]=8388608;J[b+132>>2]=b;if(a){a=b+132|0;Tf(a,28703,1811808,1811816,b+140|0);co(a)}Ls();$c=b+144|0}function dM(a){a=a|0;var b=0,c=0;c=$c-16|0;$c=c;Zd(a);b=c+4|0;te(b);ee(a+288|0,4715,b);td(a+36|0,14917,b);td(a+120|0,1256,b);td(a+204|0,13837,b);Ed(b);$c=c+16|0}function cz(a,b,c){a=a|0;b=b|0;c=c|0;if(!(!(M[464807]<=a>>>0|M[464808]<=b>>>0)&M[464809]>c>>>0)){return J[464864]}return J[(($h(a,c)|0)<(b|0)?64:80)+1859392>>2]}function bz(a){a=a|0;var b=0;b=$c-528|0;$c=b;J[b+524>>2]=33488896;J[b+520>>2]=b;ke(b+520|0,a);H[J[b+520>>2]+L[b+524>>1]|0]=0;Qf(J[12860],J[b+520>>2]);$c=b+528|0}function Zg(a,b,c){var d=0;d=L[a+4>>1];if((d|0)>(b|0)){a=J[a>>2];c=c&255;while(1){if((c|0)==K[a+b|0]){return b}b=b+1|0;if((d|0)!=(b|0)){continue}break}}return-1}function OM(a,b){a=a|0;b=b|0;var c=0,d=0;b=$c-80|0;$c=b;J[b+76>>2]=4194304;J[b+72>>2]=b;c=J[a+520>>2];d=b+72|0;bd[J[J[c>>2]+16>>2]](c,d);Hh(a+220|0,d);$c=b+80|0}function Hi(a,b){var c=0,d=0;c=$c-16|0;$c=c;I[b>>1]=0;a:{if(!De(a,c+12|0)){break a}a=J[c+12>>2];if((a|0)<0|(a|0)>65535){break a}I[b>>1]=a;d=1}$c=c+16|0;return d}function FA(a){a=a|0;var b=0;if(J[263682]>0){a=0;while(1){b=J[(a<<2)+1054816>>2];bd[J[J[b>>2]+60>>2]](b);H[b+7|0]=1;a=a+1|0;if((a|0)<J[263682]){continue}break}}}function EA(a){a=a|0;var b=0;if(J[263682]>0){a=0;while(1){b=J[(a<<2)+1054816>>2];bd[J[J[b>>2]+52>>2]](b);H[b+7|0]=1;a=a+1|0;if((a|0)<J[263682]){continue}break}}}function jE(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;c=0;while(1){d=(c<<2)+a|0;if(J[d+264>>2]==(b|0)){J[d+264>>2]=-1;J[d+296>>2]=0}c=c+1|0;if((c|0)!=8){continue}break}}function Wf(a,b,c,d){var e=0,f=0;e=$c-16|0;$c=e;f=a;a=e+8|0;a:{if(!Hf(f,a)){break a}if(!Pe(a,e+4|0)){break a}d=N[e+4>>2];b=b>d?b:d;d=b>c?c:b}$c=e+16|0;return d}function gN(a){a=a|0;var b=0,c=0;b=a+36|0;te(b);c=a+48|0;nf(c);Zd(a);td(a+60|0,J[a+140>>2]?19373:12770,b);Qg(a+312|0,c);td(a+228|0,9861,b);td(a+144|0,16871,b)}function aC(){var a=Q(0),b=0;J[208605]=0;J[208606]=0;J[208710]=1084227584;J[208607]=0;b=Ql(834844);a=b?N[208782]:Q(.41999998688697815);N[208783]=a;N[208781]=a}function kq(a,b){var c=0,d=0,e=Q(0);c=$c-16|0;$c=c;d=c+8|0;jq(d,a,b);e=Q(1);if(!(K[1054197]|!L[c+12>>1])){a=Pe(d,c+4|0);e=a?N[c+4>>2]:Q(1)}$c=c+16|0;return e}function OD(a,b){a=a|0;b=b|0;de(J[a+112>>2]);he(4,b);a:{if(!K[a+146|0]){break a}if(!(Gl(N[a+200>>2])<Q(.5))){break a}de(J[a+172>>2]);he(4,b+4|0)}return b+8|0}function Jm(a,b){var c=0,d=0;if(b){c=-1;while(1){c=J[(((K[a+d|0]^c)&255)<<2)+43424>>2]^c>>>8;d=d+1|0;if((d|0)!=(b|0)){continue}break}a=c^-1}else{a=0}return a}function wM(a){a=a|0;var b=0,c=0;J[a+28>>2]=6;J[a+20>>2]=0;J[a+16>>2]=a+756;au(a,a+212|0);xd(a,a+44|0,160,552);xd(a,a+128|0,160,553);b=a,c=oe(a),J[b+8>>2]=c}function qn(a,b){Xf(a,b);Xf(a+16|0,b+16|0);Xf(a+32|0,b+32|0);Xf(a+48|0,b+48|0);Xf(a- -64|0,b- -64|0);Xf(a+80|0,b+80|0);Xf(a+96|0,b+96|0);Xf(a+112|0,b+112|0)}function jB(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;ko(a,b,c);a=a+9>>4;c=c+9>>4;b=b+9>>4;d=a+P(J[464824],c+P(b,J[464826])|0)|0;if(K[d+J[263414]|0]<=1){Ep(d,a,b,c)}}function el(a,b){var c=0;c=$c-16|0;$c=c;J[c+12>>2]=J[b>>2];J[c+8>>2]=L[b+4>>1];$b(a|0,1,c+12|0,c+8|0);_b(a|0);Ha(a|0,35713,c+4|0);$c=c+16|0;return J[c+4>>2]}function Xv(a,b){a=a|0;b=b|0;var c=0,d=0;c=$c-48|0;$c=c;d=c+40|0;Wd(d,J[268955]);Ag(d,10,c,5);b=(b<<3)+c|0;d=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=d;$c=c+48|0}function Rr(a,b){var c=0,d=0;c=a- -64|0;d=J[a+160>>2];if((d|0)==-1){dk(c,L[a+68>>1],b);return}dk(c,d,b);b=J[a+160>>2]+1|0;J[a+160>>2]=(b|0)>=L[a+68>>1]?-1:b}function Qe(a,b,c){var d=0;a:{if((c|0)>=0){d=L[b+4>>1];if(d>>>0>=c>>>0){break a}}Yd(14344);d=L[b+4>>1]}b=J[b>>2];d=d-c|0;I[a+6>>1]=d;I[a+4>>1]=d;J[a>>2]=b+c}function Mh(a,b){var c=0,d=0;c=$c-16|0;$c=c;H[b|0]=0;a:{if(!De(a,c+12|0)){break a}a=J[c+12>>2];if((a|0)<0|(a|0)>255){break a}H[b|0]=a;d=1}$c=c+16|0;return d}function LG(a,b){a=a|0;b=b|0;var c=0;if(!b){Ts();return}a=Rs(a);if(a){b=0;while(1){c=J[(a+(b<<2)|0)+12>>2];if(c){pd(c)}b=b+1|0;if((b|0)!=5){continue}break}}}function xn(a){var b=0,c=0;b=$c-80|0;$c=b;J[b+76>>2]=4194304;J[b+72>>2]=b;c=b+72|0;od(c,28462);od(c,H[a+42|0]&1?18536:18855);gf(a+568|0,c,a+76|0);$c=b+80|0}function rH(a,b){a=a|0;b=Q(b);var c=0,d=0;c=J[263563];if((c|0)!=J[a+232>>2]){J[a+232>>2]=c;I[a+228>>1]=0;d=a+224|0;od(d,c);Ce(a+144|0,d,a+36|0);H[a+7|0]=1}}function qM(a,b){a=a|0;b=Q(b);var c=0,d=0;c=$c-320|0;$c=c;d=c+8|0;if(Mj(J[a+52>>2],d)){H[a+38|0]=1;H[a+7|0]=1;J[a+40>>2]=J[c+156>>2];Zt(a);Oj(d)}$c=c+320|0}function lm(){var a=0,b=0,c=0,d=0;while(1){b=P(a,12);c=b+1859504|0;d=J[c>>2];if(d){Tb(d|0)}J[c>>2]=0;J[b+1859508>>2]=0;a=a+1|0;if((a|0)!=8){continue}break}}function es(a){var b=0,c=0;b=$c-80|0;$c=b;J[b+76>>2]=4194304;J[b+72>>2]=b;c=b+72|0;od(c,28481);$e(c,N[263696],1);gf(a+372|0,c,a+540|0);H[a+7|0]=1;$c=b+80|0}function am(a,b){var c=Q(0),d=0;if(!J[a>>2]){d=L[a+4>>1];c=Q(N[467294]*Q(b|0));a:{if(Q(R(c))<Q(2147483648)){b=~~c;break a}b=-2147483648}J[a+8>>2]=d+(b<<1)}}function Kk(){var a=0,b=0,c=0;while(1){a=a&65535;c=L[(b<<1)+122192>>1];a=a>>>0>c>>>0?a:c;b=b+1|0;if((b|0)!=4608){continue}break}return(a>>>J[458159]|0)+1|0}function EM(a){a=a|0;var b=0,c=0,d=0;c=$c-16|0;$c=c;b=c+4|0;te(b);d=a+40|0;nf(d);Zd(a);Qg(a+220|0,d);td(a+52|0,18701,b);td(a+136|0,12795,b);Ed(b);$c=c+16|0}function dE(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;d=$c-16|0;$c=d;Fo(b,c,d+12|0,d+8|0);c=0;b=J[d+8>>2];e=J[d+12>>2];if(b|e){c=Ar(a,e,b)}$c=d+16|0;return c|0}function NI(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;a:{if(!K[1054793]){e=0;if(!J[263697]){break a}}e=bd[J[J[a+332>>2]+24>>2]](a+332|0,b,c,d)|0}return e|0}function Ls(){var a=0,b=0;a=$c-144|0;$c=a;J[a+140>>2]=8388608;H[1832516]=0;J[a+136>>2]=a;b=a+136|0;xe(b,10930,1811808,1811816);Gg(b,41720);Ym();$c=a+144|0}function Km(a){var b=0;b=sj(a);a:{if((b|0)==-1){b=25492}else{if(K[1054211]>=(b|0)){break a}if(qi(b&65535)){break a}b=26906}Bg(b,J[206301],a);b=-1}return b}function qD(a,b){a=a|0;b=b|0;var c=0;a:{if(a>>>0>999){break a}a=L[((a>>>0<=153?a:0)<<1)+47904>>1]+45988|0;if(!a){break a}Sf(b,a,Nh(a,600));c=1}return c|0}function oz(){var a=0,b=0;vo();H[1067756]=1;H[1067757]=K[1054212];b=J[263555];while(1){I[(a<<1)+1066048>>1]=K[a+b|0];a=a+1|0;if((a|0)!=9){continue}break}}function mv(){var a=0,b=0;J[12104]=-324;J[12105]=324;J[12102]=-18;J[12103]=18;J[12100]=-1;J[12101]=1;if(!K[1054197]){a=780072,b=Id(11870,0),H[a|0]=b}Ik()}function mJ(a){a=a|0;var b=0;a:{if(K[52793]){b=a+2|0;a=(vd(a)>>>0)%768|0;break a}b=a+1|0;a=K[a|0]}b=K[b|0];if(b>>>0<=8){I[(b+J[266938]<<1)+1066048>>1]=a}}function al(){var a=0,b=0;if(J[263682]>0){while(1){b=J[(a<<2)+1054816>>2];bd[J[J[b>>2]+52>>2]](b);H[b+7|0]=1;a=a+1|0;if((a|0)<J[263682]){continue}break}}}function Lj(a,b){var c=0,d=0;a:{if(!a){break a}c=GN(a,0,b,0);d=ad;if((a|b)>>>0<65536){break a}c=d?-1:c}a=xh(c);if(!(!a|!(K[a-4|0]&3))){Gd(a,0,c)}return a}function ys(a,b){var c=0;b=L[a+4>>1]+(b^-1)|0;if((b|0)>=0){a=J[a>>2];while(1){if(K[a+b|0]==45){return b}c=(b|0)>0;b=b-1|0;if(c){continue}break}}return-1}function ir(a,b,c){var d=0,e=0,f=0;d=1;a:{while(1){if(!c){break a}c=c-1|0;e=K[b|0];f=K[a|0];a=a+1|0;b=b+1|0;if((e|0)==(f|0)){continue}break}d=0}return d}function Sv(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;b=$i(a,c,d);a:{if((b|0)==-1|J[a+24>>2]==(b|0)){break a}J[a+24>>2]=b;if(J[a+84>>2]){break a}Hn(a,b)}return 1}function Rp(a){var b=0;a:{if(ld(a,9868)){break a}b=2;if(ld(a,1702)){break a}b=1;if(ld(a,2768)){break a}if(ld(a,2762)){break a}b=ld(a,2751)?3:-1}return b}function Jy(a,b){a=a|0;b=b|0;if(b){b=J[268633];bd[J[J[b+36>>2]+4>>2]](b,a);Yh(1074448,b);H[1074455]=1}a=J[268618];if((a|0)>=0){Hn(1074448,a)}J[268633]=0}function Im(){var a=0,b=0;a=$c-80|0;$c=a;J[a+76>>2]=4194304;J[a+72>>2]=a;b=a+72|0;Hd(b,23884,J[206301]);ne(b,256);nd(1043716,0,83);H[825216]=1;$c=a+80|0}function Gv(a,b){a=a|0;b=b|0;var c=0,d=0;c=$c-16|0;$c=c;d=c+8|0;Yi(d,a,b);rs(d);I[26650]=0;b=Vg(1);xf(5,0);if((b|0)==J[11486]){pd(13063);Fk(a)}$c=c+16|0}function Cf(a){if(a>=Q(360)){while(1){a=Q(a+Q(-360));if(a>=Q(360)){continue}break}}if(a<Q(0)){while(1){a=Q(a+Q(360));if(a<Q(0)){continue}break}}return a}function Ao(a,b){var c=0;c=$c-80|0;$c=c;H[c+79|0]=b;J[c+72>>2]=4194304;a=J[(a<<2)+33888>>2];J[c+68>>2]=c;b=c+68|0;xe(b,17310,a,c+79|0);Si(b,0);$c=c+80|0}function oj(){var a=Q(0),b=0;a=Q(Q(Q(N[263686]*Q(cl()|0))*Q(10))+Q(.5));a:{if(Q(R(a))<Q(2147483648)){b=~~a;break a}b=-2147483648}return Q(Q(b|0)/Q(10))}function gG(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;c=$c-16|0;$c=c;d=J[a+4>>2];J[c+8>>2]=J[a>>2];J[c+12>>2]=d;a=c+8|0;Lm(a);pi(1042156,b,a);$c=c+16|0;return 0}function mo(){var a=0,b=0,c=0;b=P(J[464809],J[464807]);if((b|0)>0){c=J[266950];while(1){I[(a<<1)+c>>1]=32767;a=a+1|0;if((b|0)!=(a|0)){continue}break}}}function ls(a){a=a|0;a:{if(K[1054310]){break a}a=0;if(J[458156]<=0){break a}while(1){Cd((a<<2)+1832644|0);a=a+1|0;if((a|0)<J[458156]){continue}break}}}function Ky(a,b){a=a|0;b=b|0;var c=0;c=$c-16|0;$c=c;a=J[a+36>>2];on(b,c+13|0);bd[J[a+12>>2]](K[c+13|0]|K[c+14|0]<<8|K[c+15|0]<<16|-16777216);$c=c+16|0}function He(a,b,c,d){var e=0,f=0;if(J[a+256>>2]>0){while(1){f=(e<<2)+a|0;bd[J[f>>2]](J[f+128>>2],b,c,d);e=e+1|0;if((e|0)<J[a+256>>2]){continue}break}}}function gh(){if(K[1054734]){H[1082050]=1;H[1082048]=1;J[270511]=35608;Ad(1082044,50);return}H[1082050]=1;H[1082048]=1;J[270511]=35540;Ad(1082044,50)}function Wm(a,b){var c=0,d=0;d=$c-16|0;$c=d;c=a;a=d+12|0;c=Sd(c,a,4);if(!c){J[b>>2]=K[a|0]|K[a+1|0]<<8|(K[a+2|0]<<16|K[a+3|0]<<24)}$c=d+16|0;return c}function cM(a){a=a|0;var b=0,c=0;J[a+28>>2]=3;J[a+20>>2]=0;J[a+16>>2]=a+264;pe(a,a+120|0);pe(a,a+192|0);xd(a,a+36|0,200,561);b=a,c=oe(a),J[b+8>>2]=c}function av(a){a=a|0;var b=0;Zd(a);b=a+792|0;te(b);Uh(a);td(a+456|0,19550,b);td(a+540|0,19454,b);td(a+624|0,13837,b);Th(a);td(a+708|0,J[a+820>>2],b)}function St(a){var b=0,c=0;be(1);b=K[1092885];c=b?48:24;af(c);a=((b&3)<<7)+a|0;vk(a+112|0);if(b){vk(a+176|0)}Pd(J[273228]);J[273224]=J[273229];ae(c)}function rD(a){a=a|0;var b=0,c=0;b=$c-272|0;$c=b;J[b+268>>2]=17039360;J[b+264>>2]=b;c=b+264|0;Sf(c,a,Fe(a));bd[J[467288]](c,J[467289],0);$c=b+272|0}function cC(a){a=a|0;var b=0,c=0;while(1){c=J[(b<<2)+827376>>2];if(c){bd[J[J[c>>2]>>2]](c,N[a+4>>2])}b=b+1|0;if((b|0)!=256){continue}break}return 1}function UC(a){a=a|0;var b=0,c=0;b=$c-272|0;$c=b;J[b+268>>2]=17039360;J[b+264>>2]=b;c=b+264|0;Sf(c,a,Fe(a));bd[J[467443]](c);J[467443]=0;$c=b+272|0}function sn(a,b){var c=0,d=0;c=$c-128|0;$c=c;wk(a,b);ie(1);Wt(a,b,c);d=c- -64|0;me(d,c,1054312);Me(1,d);bd[J[a+16>>2]](b);Me(1,1054312);$c=c+128|0}function pi(a,b,c){var d=0,e=0;if(J[a+256>>2]>0){while(1){e=(d<<2)+a|0;bd[J[e>>2]](J[e+128>>2],b,c);d=d+1|0;if((d|0)<J[a+256>>2]){continue}break}}}function eA(){var a=0;nd(1048396,0,236);while(1){H[(P(a,24)+1055392|0)+4|0]=0;a=a+1|0;if((a|0)!=32){continue}break}J[264040]=!K[1055388];Eo(51152)}function Np(a,b){var c=0,d=0;if(J[263138]>0){while(1){d=(c<<2)+1052296|0;bd[J[d>>2]](J[d+128>>2],a,b);c=c+1|0;if((c|0)<J[263138]){continue}break}}}function IL(a,b,c){a=a|0;b=b|0;c=c|0;a=J[273232];if(a){while(1){if(ld(c,J[a>>2])){Lf(a+8|0,b,c,a+4|0,0);return}a=J[a+12>>2];if(a){continue}break}}}function II(a){a=a|0;Ed(a+36|0);Be(a);Cd(a+192|0);bd[J[J[a+332>>2]+4>>2]](a+332|0);bd[J[J[a+48>>2]+4>>2]](a+48|0);bd[J[J[a+120>>2]+4>>2]](a+120|0)}function $F(a,b){a=a|0;b=b|0;var c=0;c=$c-16|0;$c=c;a=Fh(c+4|0,a);a:{b:{if(a){Af(a,12332,b);break b}if(Qm(c+4|0)){break a}}qd(J[c+4>>2])}$c=c+16|0}function vM(a,b){a=a|0;b=b|0;var c=0,d=0;c=$c-608|0;$c=c;b=a+36|0;Rf(c,b);d=Ab(c|0)|0;$c=c+608|0;c=(d|0)==1?-857812897:d;if(c){Ok(c,7270,b)}ge(a)}function Vh(a,b,c){var d=0,e=0;if((c|0)>0){while(1){e=P(d,12)+b|0;md(P(d,84)+a|0,1,1,I[e>>1],I[e+2>>1]);d=d+1|0;if((d|0)!=(c|0)){continue}break}}}function Ri(a,b,c,d){var e=0,f=0;e=b,f=ue(a,Q(.6000000238418579)),J[e>>2]=f;e=c,f=ue(a,Q(.800000011920929)),J[e>>2]=f;e=d,f=ue(a,Q(.5)),J[e>>2]=f}function jC(a,b){a=a|0;b=b|0;if(J[263697]){a=0}else{a=P(J[b+8>>2],796)+834384|0;H[a+497|0]=1;if(!K[a+474|0]){return 0}a=K[a+470|0]!=0}return a|0}function iC(a,b){a=a|0;b=b|0;if(J[263697]){a=0}else{a=P(J[b+8>>2],796)+834384|0;H[a+496|0]=1;if(!K[a+474|0]){return 0}a=K[a+470|0]!=0}return a|0}function gk(a,b){J[a+32>>2]=b;J[a+4>>2]=968;J[a+28>>2]=970;J[a+8>>2]=971;J[a>>2]=972;J[a+24>>2]=973;J[a+20>>2]=974;J[a+16>>2]=975;J[a+12>>2]=976}function fs(a){var b=0,c=0;b=$c-80|0;$c=b;J[b+76>>2]=4194304;J[b+72>>2]=b;c=b+72|0;Hd(c,11063,813076);gf(a+288|0,c,a+540|0);H[a+7|0]=1;$c=b+80|0}function UA(a){a=a|0;a:{if(K[1869223]){ne(33796,361);Yo(0);bm(Q(1e3));a=1;break a}ne(41752,361);hi(J[263488]);H[1054457]=2;a=0}H[1054456]=a;Zc()}function Cl(a){var b=0,c=0;b=$c-16|0;$c=b;Cm(b+8|0);while(1){a:{if(K[b+9|0]){c=0;break a}c=Sr(a,b+8|0);if(!c){continue}}break}$c=b+16|0;return c}function $J(a){a=a|0;a:{if(K[1688036]){break a}jn();if(!K[52873]){break a}a=ud(a);J[433215]=4;H[1732845]=1;J[422010]=a;J[444421]=4;H[1777669]=1}}function zl(a){var b=0;b=P(J[464808],P(J[464809],J[464807]));J[464806]=b;b=wf(b,1);J[464804]=b;if(!b){return-857812988}return Sd(a,b,J[464806])}function zN(a,b){a=a|0;b=b|0;var c=0;c=J[a+24>>2];a:{if((c|0)<0){break a}a=J[J[a+16>>2]+(c<<2)>>2];if(J[a+36>>2]!=1e4){break a}Hh(a,b)}return 1}function fH(){sf(48792);sf(48828);sf(48864);sf(48900);sf(48936);sf(48972);sf(49008);sf(49044);sf(49080);sf(49116);sf(49152);sf(49188);sf(49224)}function Fk(a){var b=0,c=0;cg(a+908|0);bd[J[a+824>>2]](a);b=J[a+804>>2];c=J[a+916>>2];b=(b|0)<(c|0)?b:c-1|0;J[a+804>>2]=(b|0)>0?b:0;Uh(a);Th(a)}function AN(a,b){a=a|0;b=b|0;var c=0;c=J[a+24>>2];a:{if((c|0)<0){break a}a=J[J[a+16>>2]+(c<<2)>>2];if(J[a+36>>2]!=1e4){break a}xi(a,b)}return 1}function yj(a,b){var c=0,d=0;if(J[a+256>>2]>0){while(1){d=(c<<2)+a|0;bd[J[d>>2]](J[d+128>>2],b);c=c+1|0;if((c|0)<J[a+256>>2]){continue}break}}}function kI(a){a=a|0;var b=0,c=0,d=0;b=$c-16|0;$c=b;c=b,d=mj(a),J[c+12>>2]=d;bd[J[J[a+672>>2]+36>>2]](a+672|0,b+12|0);Pd(J[a+12>>2]);$c=b+16|0}function gm(a){var b=0;b=$c-96|0;$c=b;J[b+92>>2]=5505024;J[b+88>>2]=b;Hd(b+88|0,27578,a);H[J[b+88>>2]+L[b+92>>1]|0]=0;Yd(J[b+88>>2]);$c=b+96|0}function eG(a,b,c){a=a|0;b=b|0;c=c|0;a=J[461355];if(a){while(1){if(ld(c,J[a>>2])){bd[J[a+4>>2]](b,c);return}a=J[a+8>>2];if(a){continue}break}}}function Xq(a){var b=0;b=$c-608|0;$c=b;H[1869768]=1;if(K[1055388]){Rf(b,J[a>>2]);Pg(18950);Ic(b|0,J[a+4>>2],J[a+12>>2]);H[a+16|0]=1}$c=b+608|0}function VF(a,b){a=a|0;b=b|0;J[a+636>>2]=J[a+636>>2]-1;Mm(a);di(a);b=0;while(1){Fi(a,(P(b,84)+a|0)+288|0);b=b+1|0;if((b|0)!=4){continue}break}}function UF(a,b){a=a|0;b=b|0;J[a+636>>2]=J[a+636>>2]+1;Mm(a);di(a);b=0;while(1){Fi(a,(P(b,84)+a|0)+288|0);b=b+1|0;if((b|0)!=4){continue}break}}function Rd(a,b){var c=0,d=0;if(J[a+256>>2]>0){while(1){d=(c<<2)+a|0;bd[J[d>>2]](J[d+128>>2],b);c=c+1|0;if((c|0)<J[a+256>>2]){continue}break}}}function Ng(a){var b=0,c=0;c=K[a+12|0];b=J[a+8>>2];a=J[b+8>>2];a:{if(!J[b>>2]){if(!c){break a}return(L[b+4>>1]>>>3|0)+a|0}a=c?a+2|0:a}return a}function wE(a,b){a=a|0;b=b|0;de(J[(K[1054732]?40:36)+1054724>>2]);he(J[a+12>>2]>399?4:8,b);a=J[a+40>>2];if(a){de(a);he(4,b+8|0)}return b+12|0}function af(a){var b=0,c=0,d=0;b=J[273223];if(!b){b=of(1,J[273225]);J[273223]=b}J[273228]=b;J[273229]=J[273224];c=1092896,d=qe(1,a),J[c>>2]=d}function WM(a,b){a=a|0;b=b|0;var c=0;J[264085]=0;b=J[b+36>>2];H[a+6|0]=0;c=J[a+36>>2];J[a+36>>2]=b;yk(a,b);if((c|0)>=0){yk(a,c)}J[264085]=548}function To(a){var b=0,c=0;if(N[12440]!=a){N[12440]=a;while(1){c=(b<<5)+49780|0;J[c>>2]=J[c>>2]|16;b=b+1|0;if((b|0)!=18){continue}break}gi()}}function hH(a){a=a|0;var b=0,c=0;Zd(a);b=a+216|0;te(b);c=a+228|0;nf(c);Ce(a+240|0,a+576|0,b);Ce(a+312|0,a+584|0,c);Qs(a);td(a+132|0,13965,b)}function fm(a,b,c,d){var e=0;e=$c-528|0;$c=e;J[e+524>>2]=33554432;J[e+520>>2]=e;Wg(e+520|0,a,b,c,d,0);la(J[e+520>>2],L[e+524>>1]);$c=e+528|0}function Yi(a,b,c){c=J[b+804>>2]+J[c+36>>2]|0;if(!((c|0)<0|(c|0)>=J[b+916>>2])){$d(a,b+908|0,c);return}b=J[9219];J[a>>2]=J[9218];J[a+4>>2]=b}function YM(a){a=a|0;var b=0,c=0;c=$c-16|0;$c=c;b=c+4|0;te(b);Zd(a);td(a+36|0,13176,b);td(a+120|0,7329,b);td(a+204|0,9861,b);Ed(b);$c=c+16|0}function Tt(a){a=a|0;Dd(1092892);a:{if(K[1054310]){break a}a=J[273232];if(!a){break a}while(1){Cd(a+8|0);a=J[a+12>>2];if(a){continue}break}}}function Sg(a,b){if(!(!J[a+40>>2]|!b&J[a+60>>2]==J[a+56>>2])){b=J[a+60>>2];J[a+56>>2]=b;bd[J[a+1748>>2]]((b|0)!=-1?L[((b<<1)+a|0)+92>>1]:0)}}function tG(a,b){a=a|0;b=b|0;if(!J[a+36>>2]){return-857812991}H[b|0]=K[J[a+32>>2]];J[a+32>>2]=J[a+32>>2]+1;J[a+36>>2]=J[a+36>>2]-1;return 0}function IJ(a){a=a|0;var b=0;a:{if(K[52793]){b=a+2|0;a=(vd(a)>>>0)%768|0;break a}b=a+1|0;a=K[a|0]}b=K[b|0];H[1067756]=1;hj(a);H[1067756]=!b}function uG(a,b){a=a|0;b=b|0;var c=0;c=J[a+36>>2];if(c>>>0>=b>>>0){J[a+36>>2]=c-b;J[a+32>>2]=J[a+32>>2]+b;a=0}else{a=-857812989}return a|0}function rI(a,b){a=a|0;b=b|0;b=J[448483]+b|0;if(!((b|0)<0|(b|0)>=J[203556])){$d(a,814216,b);return}b=J[10439];J[a>>2]=J[10438];J[a+4>>2]=b}function eN(a){a=a|0;var b=0,c=0;b=$c-16|0;$c=b;c=J[a+4>>2];J[b+8>>2]=J[a>>2];J[b+12>>2]=c;a=b+8|0;Lm(a);rs(a);Fk(1075944);Vg(1);$c=b+16|0}function Nh(a,b){var c=0;a:{if((b|0)<=0){break a}while(1){if(!K[a|0]){break a}a=a+1|0;c=c+1|0;if((c|0)!=(b|0)){continue}break}c=b}return c}function Nd(a){var b=0,c=0;if(J[a+256>>2]>0){while(1){c=(b<<2)+a|0;bd[J[c>>2]](J[c+128>>2]);b=b+1|0;if((b|0)<J[a+256>>2]){continue}break}}}function Md(a){var b=0,c=0,d=0;b=+a*.15915494309189535+.25;d=!(b>=0);if(R(b)<2147483648){c=~~b}else{c=-2147483648}return Q(Lp(b-+(c-d|0)))}function HD(a,b){a=a|0;b=b|0;var c=0;if(J[a+40>>2]>0){while(1){we(J[a+84>>2]+P(c,28)|0,-1,b);c=c+1|0;if((c|0)<J[a+40>>2]){continue}break}}}function vG(a,b){a=a|0;b=b|0;var c=0;c=J[a+40>>2];if(c>>>0>b>>>0){J[a+36>>2]=c-b;J[a+32>>2]=J[a+44>>2]+b;a=0}else{a=-857812989}return a|0}function ns(a,b,c){var d=0,e=0;d=$c-32|0;$c=d;J[d+28>>2]=1572864;J[d+24>>2]=d;e=d+24|0;Ki(e,Jm(J[b>>2],L[b+4>>1]));Hm(a,c,e,32);$c=d+32|0}function TC(a){a=a|0;var b=0,c=0;b=$c-816|0;$c=b;J[b+812>>2]=52428800;J[b+808>>2]=b;c=b+808|0;Sf(c,a,Nh(a,3200));Rd(1050736,c);$c=b+816|0}function Ah(){var a=0;a=$c-272|0;$c=a;a:{if(!K[1056336]){break a}J[a+12>>2]=0;zc(a+12|0)|0;if(J[a+12>>2]){break a}yc(6208,0)|0}$c=a+272|0}function vA(){if(J[263682]){while(1){ge(J[263704]);if(J[263682]){continue}break}}Ho(0);H[1054796]=0;H[1054794]=0;J[263700]=0;J[263701]=0}function qe(a,b){var c=0;c=J[263622];a=P(J[(a<<2)+33804>>2],b);if((a|0)>J[263621]){qd(c);c=Ye(a,1,1482);J[263622]=c}J[263621]=a;return c}function lz(){var a=0;a=pk(14554,0,35368,2);H[1067796]=a;H[1067806]=a;H[1067804]=0;H[1067805]=0;nd(1046056,0,183);Pk();nd(1046316,0,280)}function Xy(a){a=a|0;var b=0,c=0;Eg();b=1067868,c=Kk(),J[b>>2]=c;Gd(1070432,1,512);Gd(1069920,0,512);Gd(1073504,1,512);Gd(1072992,0,512)}function SA(a){a=a|0;xj(1054272,a);a=J[464808];J[263571]=a;J[263570]=(a|0)/2;a=wf(P(J[464809],J[464807]),2);J[263572]=a;return(a|0)!=0|0}function wK(a){a=a|0;yf(a);af(24);yd(Q(N[a+16>>2]*Q(-.01745329238474369)),Q(0),Q(0),1563568,1);Pd(J[273228]);J[273224]=J[273229];ae(24)}function bj(a,b,c,d,e){var f=0;if((e|0)>0){while(1){xd(a,P(f,84)+b|0,c,J[(P(f,12)+d|0)+8>>2]);f=f+1|0;if((f|0)!=(e|0)){continue}break}}}function JB(a){a=a|0;var b=0;a=a+66896|0;b=K[a+15360|0];if(!(!b|K[a+8448|0]==2)){H[1040205]=b}if(K[a+13824|0]!=4){H[1040204]=1}return 0}function sd(a,b){return(P(b&255,a&255)>>>0)/255|a&-16777216|(P(b>>>8&255,a>>>8&255)>>>0)/255<<8|(P(b>>>16&255,a>>>16&255)>>>0)/255<<16}function hD(a,b,c){a=a|0;b=b|0;c=c|0;b=I[b+40>>1];if(b>>>0<=4){a:{b=J[(b<<2)+45960>>2];if((a|0)==5){Yk(b);break a}kj(b)}}Ah();return 1}function Jd(a){var b=0,c=0,d=0;b=+a*.15915494309189535;d=!(b>=0);if(R(b)<2147483648){c=~~b}else{c=-2147483648}return Q(Lp(b-+(c-d|0)))}function GB(a){a=a|0;var b=0;a=0;while(1){b=J[(a<<2)+827376>>2];if(b){Cd(b+324|0);I[b+328>>1]=0}a=a+1|0;if((a|0)!=256){continue}break}}function xv(a,b){a=a|0;b=b|0;H[1083754]=1;H[1083752]=1;J[270946]=0;J[270947]=0;J[270937]=35744;J[270948]=0;J[270949]=0;Ad(1083748,50)}function xf(a,b){var c=0;c=$c-16|0;$c=c;if(K[1811820]){H[c+11|0]=57;fe(c+12|0,a&65535);fe(c+14|0,b);bd[J[452942]](c+11|0,5)}$c=c+16|0}function wl(a){var b=0,c=0,d=0;b=$c-16|0;$c=b;c=b+14|0;d=Sd(a,c,2);if(!d){d=bd[J[a+12>>2]](a,K[c|0]|K[c+1|0]<<8)|0}$c=b+16|0;return d}function kz(a,b,c){a=a|0;b=b|0;c=c|0;if(K[1067796]!=(b|0)){Ik();if(K[1859276]){bd[J[266952]]();Pk();bd[J[266953]]();Eg();return}Pk()}}function jM(a,b){a=a|0;b=b|0;var c=0;c=a+44|0;os(c);if(J[b+36>>2]){Ci(1834712,c,41752,32);Kh(1834712,2186)}ge(a);xf(6,J[b+36>>2]?3:2)}function eu(a){var b=0;b=J[a+520>>2];a=bd[J[J[b>>2]+12>>2]](b,a+284|0)|0;ge(1089628);b=J[272538];if(b){bd[b|0](1089912,a)}J[272538]=0}function QD(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0;e=ce(J[J[a+32>>2]+20>>2],49260,10);if(!e){J[a+8>>2]=106;e=vr(a,b,c,d)}return e|0}function Ei(a,b,c,d){var e=0;if((d|0)>0){while(1){if(ld(a,J[(e<<2)+c>>2])){return e}e=e+1|0;if((e|0)!=(d|0)){continue}break}}return b}function rt(a){var b=0;b=$c-80|0;$c=b;J[b+76>>2]=a;J[b+72>>2]=4194304;J[b+68>>2]=b;a=b+68|0;Hd(a,27536,b+76|0);Gg(40524,a);$c=b+80|0}function lg(a,b,c){var d=0,e=0;d=J[a+4>>2];e=J[a+8>>2];return(d|0)<=(b|0)&(e|0)<=(c|0)&(J[a+12>>2]+d|0)>(b|0)&(J[a+16>>2]+e|0)>(c|0)}function xL(a,b){a=a|0;b=b|0;if(!(!K[1056336]|J[(J[b+4>>2]<<2)+51304>>2]!=1)){bd[J[J[203292]+24>>2]](N[b+8>>2],N[b+12>>2],J[b>>2])}}function li(a,b){var c=0,d=0;c=Sd(a,b,2);a:{if(c){break a}d=vd(b);je(b,0,48);c=-857812924;if(d>>>0>48){break a}c=Sd(a,b,d)}return c}function Wl(a){var b=0,c=0;b=$c-32|0;$c=b;c=b+8|0;Dg(c,a+4|0,a+92|0);N[b+24>>2]=N[b+24>>2]+Q(.03125);a=Of(c,111);$c=b+32|0;return a}function Ur(a,b){var c=0,d=0;if(L[b+4>>1]){while(1){d=Tr(a,H[J[b>>2]+c|0])+d|0;c=c+1|0;if(c>>>0<L[b+4>>1]){continue}break}}return d}function SG(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;if(!e){vt(a,b,c,0,L[(J[266937]+J[266938]<<1)+1066048>>1]);return}vt(a,b,c,1,e)}function Gn(a,b,c,d){var e=0;if((d|0)>0){while(1){td(P(e,84)+a|0,J[(P(e,12)+c|0)+4>>2],b);e=e+1|0;if((e|0)!=(d|0)){continue}break}}}function Al(a,b){var c=0;c=J[a+16>>2];if(c>>>0<=64){b=Ye(c,1,b);Kd(b,a+20|0,J[a+16>>2]);return b}b=J[a+20>>2];J[a+20>>2]=0;return b}function sp(){var a=0;a=J[12427];if((a|0)>=17){a=a>>>1|0;J[12427]=a>>>0<=16?16:a;Eg();Hg(J[12427]);pd(26480);a=1}else{a=0}return a}function hq(a,b){var c=Q(0);if(!b){return Q(0)}c=K[a+39|0]?Q(Q(N[a+4>>2]*Q(.5))+Q(0)):Q(0);if(K[a+38|0]){c=Q(c+N[a+4>>2])}return c}function Zs(){ne(41752,100);ne(41752,101);ne(41752,102);ne(41752,1);ne(41752,2);ne(41752,3);ne(41752,11);ne(41752,12);ne(41752,13)}function Oy(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;c=J[b+36>>2];e=((bd[J[c+8>>2]]()|0)+1|0)%J[c+20>>2]|0,d=J[c+12>>2],bd[d](e|0);Yh(a,b)}function yG(a,b){a=a|0;b=b|0;var c=0;c=J[a+36>>2];if(!c){return-857812991}J[a+36>>2]=c-1;a=J[a+32>>2];return bd[J[a+4>>2]](a,b)|0}function Tr(a,b){var c=0;a:{if(bd[J[a+44>>2]]()<<6<=L[a+68>>1]){break a}if(!(bd[J[a+56>>2]](a,b)|0)){break a}Rr(a,b);c=1}return c}function Ks(a){J[a+28>>2]=963;J[a+24>>2]=964;J[a+20>>2]=964;J[a+16>>2]=965;J[a+12>>2]=966;J[a+8>>2]=967;J[a+4>>2]=968;J[a>>2]=969}function JG(a,b){a=a|0;b=b|0;var c=0;c=$c-16|0;$c=c;a=bd[J[a>>2]](a,b,1,c+12|0)|0;$c=c+16|0;return(a?a:J[c+12>>2]?0:-857812991)|0}function Ht(a,b,c){var d=0,e=0;d=$c-16|0;$c=d;e=a;a=d+8|0;Hf(e,a);I[b+4>>1]=0;a:{if(L[d+12>>1]){ye(b,a);break a}od(b,c)}$c=d+16|0}function Cg(a,b,c,d,e){var f=0,g=0;f=$c-144|0;$c=f;J[f+140>>2]=8388608;J[f+136>>2]=f;g=f+136|0;Wg(g,a,b,c,d,e);ne(g,0);$c=f+144|0}function By(a){a=a|0;var b=0;b=512;a:{b:{switch(a-2|0){default:b=(a|0)==1?32:8;break a;case 1:break a;case 0:break b}}b=128}rp(b)}function BK(a){a=a|0;J[a+164>>2]=1069547520;J[a+168>>2]=-1110651699;J[a+172>>2]=1069547520;J[a+176>>2]=1036831949;Ph(a,1531648,1)}function $C(a,b,c){a=a|0;b=b|0;c=c|0;Ah();a=0;if(!(J[b+24>>2]|(H[1869768]&1?K[1055388]:0))){Rd(1049696,J[b+32>>2]);a=1}return a|0}function rN(a){a=a|0;md(a+372|0,1,1,0,-150);md(a+36|0,1,1,0,-100);md(a+120|0,1,1,0,-50);md(a+204|0,1,1,0,0);md(a+288|0,1,2,0,80)}function mE(a,b,c){a=a|0;b=b|0;c=c|0;a:{if(!Ue(30,b,c)){break a}if(K[a+120|0]){H[a+120|0]=0;return}if(!K[1869221]){break a}wo()}}function hp(a){a:{switch(a-1|0){case 2:We(1);return;case 0:be(1);return;case 1:be(1);return;case 4:be(1);break;default:break a}}}function gp(a){a:{switch(a-1|0){case 2:We(0);return;case 0:be(0);return;case 1:be(0);return;case 4:be(0);break;default:break a}}}function er(a,b,c,d){var e=0;e=c-a|0;a=d-((a>>>0>c>>>0)+b|0)|0;b=(d|0)==(a|0)&c>>>0>=e>>>0|a>>>0<d>>>0;c=b?e:0;ad=b?a:0;return c}function au(a,b){var c=0,d=0;pe(a,b);c=1;while(1){d=P(c,72)+b|0;pe(a,d);J[d+68>>2]=-2039584;c=c+1|0;if((c|0)!=4){continue}break}}function Te(a,b,c){var d=0,e=0;d=$c-288|0;$c=d;J[d+12>>2]=17039360;J[d+8>>2]=d+16;e=d+8|0;Sf(e,c,Fe(c));Nk(a,b,e,133);$c=d+288|0}function $r(a,b,c){var d=0;d=Xj(a,b,c);if((d|0)==-1){return 0}while(1){Lh(a,d);d=Xj(a,b,c);if((d|0)!=-1){continue}break}return 1}function rj(a,b){var c=0,d=0,e=0;c=$c-16|0;$c=c;ie(1);d=c,e=qe(1,4),J[d+12>>2]=e;we(a,b,c+12|0);Pd(J[263617]);he(4,0);$c=c+16|0}function Ym(){if(K[1811800]){_d(1045796,0,29);return}je(1811248,0,240);J[452810]=0;if(!K[1811801]){Eb(J[13312])|0;H[1811801]=1}}function Sx(a){a=a|0;var b=0,c=0;b=$c-16|0;$c=b;c=b+8|0;Wd(c,J[(a<<2)+35368>>2]);Re(14554,c);H[1067805]=0;po(a&255,0);$c=b+16|0}function Hu(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;b=$i(a,c,d);if(!((b|0)==-1|b>>>0>7|J[a+24>>2]==(b|0))){J[a+24>>2]=b;zn(a)}return 1}function hv(a,b){a=a|0;b=b|0;var c=0;b=J[a+804>>2]-5|0;c=J[a+916>>2];b=(b|0)<(c|0)?b:c-1|0;J[a+804>>2]=(b|0)>0?b:0;Uh(a);Th(a)}function gv(a,b){a=a|0;b=b|0;var c=0;b=J[a+804>>2]+5|0;c=J[a+916>>2];b=(b|0)<(c|0)?b:c-1|0;J[a+804>>2]=(b|0)>0?b:0;Uh(a);Th(a)}function Wj(a,b,c){var d=Q(0),e=Q(0),f=Q(0);d=Md(c);e=Jd(b);f=Jd(c);c=Md(c);b=Md(b);N[a+4>>2]=-f;N[a>>2]=d*e;N[a+8>>2]=b*Q(-c)}function Qp(a){a=a|0;Hl();Dd(1040268);Cd(1040308);Cd(1040320);if(!K[1054310]){Cd(1040236);Cd(1040256);Cd(1040288);Cd(1040292)}}function Kz(a,b){a=a|0;b=b|0;a=Zk(30);a:{if(a){ge(a);break a}H[1090246]=1;H[1090244]=1;J[272560]=36528;Ad(1090240,30)}return 1}function CD(a){a=a|0;J[a+12>>2]=L[a+68>>1];J[a+16>>2]=K[a+20|0]?L[a+70>>1]:0;_f(a);I[a- -64>>1]=J[a+4>>2];I[a+66>>1]=J[a+8>>2]}function $h(a,b){var c=0,d=0;d=P(J[464807],b)+a|0;c=I[J[266950]+(d<<1)>>1];if((c|0)==32767){c=Qk(a,J[464808]-1|0,b,d)}return c}function $E(a,b){a=a|0;b=b|0;var c=0;a=$c-16|0;$c=a;c=1;if(!(L[b+4>>1]==1&K[J[b>>2]]==45)){c=De(b,a+12|0)}$c=a+16|0;return c|0}function xB(){Bf(0);Hl();Dd(1040268);qd(J[260066]);J[260070]=2147483647;J[260068]=2147483647;J[260069]=2147483647;J[260066]=0}function kn(a,b){var c=0;c=$c-16|0;$c=c;if(De(a,c+12|0)){a=J[c+12>>2];b=a&65280|a>>>16&255|a<<16|-16777216}$c=c+16|0;return b}function iN(a){a=a|0;md(a+312|0,1,1,0,-30);md(a+60|0,1,1,0,20);md(a+612|0,1,1,0,65);md(a+144|0,1,2,0,70);md(a+228|0,1,2,0,25)}function Xe(a,b,c){var d=Q(0);d=a<Q(90)?b>Q(270)?Q(b+Q(-360)):b:b;a=a>Q(270)?b<Q(90)?Q(a+Q(-360)):a:a;return Q(Q(Q(d-a)*c)+a)}function WD(a,b){a=a|0;b=b|0;var c=0,d=0;c=a;a=J[b+16>>2];d=a?(a|0)<=0?-1:1:0;a=J[b+20>>2];return Ar(c,d,a?(a|0)<=0?-1:1:0)|0}function JD(a){a=a|0;var b=0;if(J[a+40>>2]>0){while(1){Cd(J[a+84>>2]+P(b,28)|0);b=b+1|0;if((b|0)<J[a+40>>2]){continue}break}}}function FC(){var a=0,b=0,c=0;Eq();hf(49300);if(K[1054197]){a=0}else{a=Id(2820,0)}H[825312]=!a;b=825313,c=Id(4190,0),H[b|0]=c}function sj(a){var b=0,c=0;b=$c-16|0;$c=b;a:{if(De(a,b+12|0)){c=J[b+12>>2];if((c|0)<768){break a}}c=rl(a)}$c=b+16|0;return c}function lG(a,b){a=a|0;b=b|0;a=$c-16|0;$c=a;b=J[459968];cg(1839864);Kh(1839864,2216);J[a+12>>2]=b;Od(22642,a+12|0);$c=a+16|0}function Oh(a,b){var c=0,d=0,e=0,f=0;d=$c-16|0;$c=d;c=a;a=d+12|0;c=Sd(c,a,4);if(!c){e=b,f=ud(a),J[e>>2]=f}$c=d+16|0;return c}function OK(a){a=a|0;var b=0;b=J[207101];N[a>>2]=N[b+20>>2]*Q(.01745329238474369);N[a+4>>2]=N[b+16>>2]*Q(.01745329238474369)}function LF(a,b){a=a|0;b=b|0;var c=0;c=$c-16|0;$c=c;if(b){De(a,c+12|0);J[203269]=J[c+12>>2];Re(1210,a);fs(1856376)}$c=c+16|0}function DF(a){a=a|0;var b=0,c=0;c=$c-16|0;$c=c;b=c+4|0;te(b);Zd(a);Gn(a+120|0,b,43344,6);td(a+36|0,13975,b);Ed(b);$c=c+16|0}function $t(a){var b=0;md(a,1,1,0,-120);b=1;while(1){md(P(b,72)+a|0,1,1,0,P(b,20)-70|0);b=b+1|0;if((b|0)!=4){continue}break}}function zu(a,b){a=a|0;b=b|0;H[1074454]=1;H[1074452]=1;J[268635]=0;J[268636]=0;J[268634]=336;J[268612]=35376;Ad(1074448,50)}function op(a,b){var c=0;a:{if(ni(J[b+4>>2])){c=1;if(ni(J[b+8>>2])){break a}}Od(23959,a);Bg(24809,b+4|0,b+8|0);c=0}return c}function hM(a,b){a=a|0;b=b|0;H[1074454]=1;H[1074452]=1;J[268635]=0;J[268636]=0;J[268634]=449;J[268612]=35376;Ad(1074448,50)}function gM(a,b){a=a|0;b=b|0;H[1074454]=1;H[1074452]=1;J[268635]=0;J[268636]=0;J[268634]=465;J[268612]=35376;Ad(1074448,50)}function WA(a){a=a|0;a=J[467303];J[263478]=(a|0)<=1?1:a;a=J[467304];J[263479]=(a|0)<=1?1:a;kc(0,0,J[263478],J[263479]);Rh()}function Mu(a,b){a=a|0;b=b|0;H[1074454]=1;H[1074452]=1;J[268635]=0;J[268636]=0;J[268634]=312;J[268612]=35376;Ad(1074448,50)}function FK(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;a:{if(d){if(K[1054197]){break a}a=d+82256|0}else{a=c+81488|0}Kn(K[a|0],62788)}}function Eu(a,b){a=a|0;b=b|0;H[1074454]=1;H[1074452]=1;J[268635]=0;J[268636]=0;J[268634]=430;J[268612]=35376;Ad(1074448,50)}function Du(a,b){a=a|0;b=b|0;H[1074454]=1;H[1074452]=1;J[268635]=0;J[268636]=0;J[268634]=365;J[268612]=35376;Ad(1074448,50)}function Bu(a,b){a=a|0;b=b|0;H[1074454]=1;H[1074452]=1;J[268635]=0;J[268636]=0;J[268634]=381;J[268612]=35376;Ad(1074448,50)}function Av(a,b){a=a|0;b=b|0;H[1074454]=1;H[1074452]=1;J[268635]=0;J[268636]=0;J[268634]=392;J[268612]=35376;Ad(1074448,50)}function Au(a,b){a=a|0;b=b|0;H[1074454]=1;H[1074452]=1;J[268635]=0;J[268636]=0;J[268634]=408;J[268612]=35376;Ad(1074448,50)}function zi(a,b){var c=0;c=J[a+20>>2];if((c|0)>=J[a+28>>2]){Yd(9255);c=J[a+20>>2]}J[a+20>>2]=c+1;J[J[a+16>>2]+(c<<2)>>2]=b}function to(a){var b=0,c=0;while(1){c=(b<<1)+1066210|0;if(L[c>>1]==(a|0)){I[c>>1]=0}b=b+1|0;if((b|0)!=768){continue}break}}function Ug(a,b){var c=0;b=Q(N[a>>2]+b);a:{if(Q(R(b))<Q(2147483648)){c=~~b;break a}c=-2147483648}N[a>>2]=b-Q(c|0);return c}function OF(a,b){a=a|0;b=b|0;b=(J[263846]+1|0)%3|0;J[263846]=b;td(a+120|0,b?(b|0)==1?12929:13816:15029,a+540|0);H[a+7|0]=1}function Jr(a,b){var c=0;a:{if(K[J[a>>2]+b|0]!=38|L[a+4>>1]<(b+2|0)){break a}c=b+1|0;if(!Jq(a,c)){break a}dg(a,c);dg(a,b)}}function Dn(a){H[1090478]=1;H[1090476]=1;J[272628]=16777216;J[272627]=1090972;J[272618]=36596;ke(1090508,a);Ad(1090472,40)}function qp(){var a=0,b=0;wm();a=J[263472];if(a){while(1){b=J[a+8>>2];if(b){bd[b|0]()}a=J[a+20>>2];if(a){continue}break}}}function nL(){wd(1544048,38512);wd(1544064,38556);wd(1544080,38600);wd(1544096,38644);wd(1544112,38688);wd(1544128,38732)}function hL(){wd(1546448,38812);tk(1546464,38856);wd(1546480,38900);wd(1546496,38944);wd(1546512,38988);wd(1546528,39032)}function bk(a,b,c){b=J[J[a+4>>2]+(b<<2)>>2];J[c>>2]=J[a>>2]+(b>>>J[a+5144>>2]|0);a=J[a+5148>>2];I[c+6>>1]=0;I[c+4>>1]=a&b}function VK(){wd(1553648,39676);wd(1553664,39720);wd(1553680,39764);wd(1553696,39808);wd(1553712,39852);wd(1553728,39896)}function OI(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;d=J[263697];if(!((d|0)!=1797896?d:0)){bd[J[J[a+332>>2]+16>>2]](a+332|0,b,c)}}function Mi(a,b){var c=0;c=$c-16|0;$c=c;b=ja(b|0,0)|0;J[c+12>>2]=(b|0)<0?-1:b;gk(a,J[c+12>>2]);$c=c+16|0;return 0-b&b>>31}function EG(a,b){a=a|0;b=b|0;if(!b){pd(24921);return}b=Rp(a);if((b|0)>=0){Il(b);Re(9868,a);Od(22683,a);return}Od(25920,a)}function Bh(){var a=0,b=0;a=Wa()|0;b=Va()|0;if(!(J[467303]==(a|0)&J[467304]==(b|0))){J[467304]=b;J[467303]=a;Nd(1047876)}}function iB(a,b){a=a|0;b=b|0;a:{if(!K[1067796]){break a}if(!(!(1<<b&884736)|b>>>0>19)){Fp()}if((b&-2)!=18){break a}Eg()}}function YA(a){a=a|0;var b=0;a=J[263472];if(a){while(1){b=J[a+12>>2];if(b){bd[b|0]()}a=J[a+20>>2];if(a){continue}break}}}function XA(a){a=a|0;var b=0;a=J[263472];if(a){while(1){b=J[a+16>>2];if(b){bd[b|0]()}a=J[a+20>>2];if(a){continue}break}}}function NF(a,b){a=a|0;b=b|0;b=(J[12613]+1|0)%3|0;J[12613]=b;td(a+204|0,b?(b|0)==1?12941:13826:15040,a+540|0);H[a+7|0]=1}function Ae(a,b){var c=0,d=0;c=a,d=Bd(N[b>>2]),J[c>>2]=d;c=a,d=Bd(N[b+4>>2]),J[c+4>>2]=d;c=a,d=Bd(N[b+8>>2]),J[c+8>>2]=d}function zv(a,b){a=a|0;b=b|0;var c=0,d=0;c=$c-16|0;$c=c;d=c+8|0;Yi(d,a,b);Re(13917,d);ke(53252,d);Nd(1046576);$c=c+16|0}function mt(a){var b=0;b=J[a>>2];if(b){qd(b);J[a+8>>2]=0;J[a+12>>2]=0;J[a>>2]=0;J[a+16>>2]=0;J[a+20>>2]=0;J[a+24>>2]=0}}function VL(a){a=a|0;var b=0,c=0;b=J[a+48>>2];c=J[b+152>>2];J[a+92>>2]=J[b+148>>2];J[a+96>>2]=c;J[a+100>>2]=J[b+156>>2]}function JJ(a){a=a|0;a=$c-16|0;$c=a;H[a+14|0]=19;H[a+15|0]=1;bd[J[452942]](a+14|0,2);H[1054054]=1;Nd(1044756);$c=a+16|0}function Id(a,b){var c=0,d=0;c=$c-16|0;$c=c;d=a;a=c+8|0;if(Hf(d,a)){a=ws(a,c+7|0);b=a?K[c+7|0]:b}$c=c+16|0;return b&255}function fz(a,b,c){a=a|0;b=b|0;c=c|0;return J[(I[(J[266950]+(P(J[464807],c)<<1)|0)+(a<<1)>>1]<(b|0)?68:84)+1859392>>2]}function fo(a,b,c){a=a|0;b=b|0;c=c|0;return J[(I[(J[266950]+(P(J[464807],c)<<1)|0)+(a<<1)>>1]<(b|0)?60:76)+1859392>>2]}function ez(a,b,c){a=a|0;b=b|0;c=c|0;return J[(I[(J[266950]+(P(J[464807],c)<<1)|0)+(a<<1)>>1]<(b|0)?64:80)+1859392>>2]}function dz(a,b,c){a=a|0;b=b|0;c=c|0;return J[(I[(J[266950]+(P(J[464807],c)<<1)|0)+(a<<1)>>1]<(b|0)?72:88)+1859392>>2]}function cA(){var a=0;while(1){H[(P(a,24)+1055392|0)+4|0]=0;a=a+1|0;if((a|0)!=32){continue}break}J[264040]=!K[1055388]}function _o(a){lc(Q(Q(Q(a&255)/Q(255))),Q(Q(Q(a>>>8&255)/Q(255))),Q(Q(Q(a>>>16&255)/Q(255))),Q(Q(Q(a>>>24|0)/Q(255))))}function LI(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;if(!K[1054793]){return 0}return bd[J[J[a+332>>2]+32>>2]](a+332|0,b,c,d)|0}function pK(){J[263502]=768;J[263501]=1028443341;ji(1054e3);th(1600384);hf(52768);nd(1043716,0,769);nd(1043196,0,770)}function lt(a){var b=0;J[a+16>>2]=J[a+16>>2]-1;b=J[a+20>>2];J[a+20>>2]=J[a+12>>2]&b+1;return J[a>>2]+P(J[a+4>>2],b)|0}function lN(a,b,c){a=a|0;b=b|0;c=c|0;if(!(_i(a,b,c)|J[c+32>>2]!=(b|0)&J[c+36>>2]!=(b|0))){gu(a,a+60|0)}return ci(b)|0}function kJ(a){a=a|0;var b=0;b=J[207101];en(b+36|0,a,K[a+12|0]);en(b+40|0,a+4|0,K[a+13|0]);en(b+44|0,a+8|0,K[a+14|0])}function _n(){qd(J[266966]);qd(J[268513]);qd(J[268512]);qd(J[268514]);J[268513]=0;J[266966]=0;J[268512]=0;J[268514]=0}function Yu(a){a=a|0;Vh(a+44|0,J[a+40>>2],J[a+36>>2]);md(a+632|0,1,2,0,25);md(a+548|0,2,2,5,5);md(a+716|0,1,1,0,-100)}function kB(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;if((d|0)!=(e|0)){lo(a,b,c,d,e);Gp(a,b,c,d,e,0);Gp(a,b,c,d,e,1)}}function IB(a){a=a|0;var b=0;a=a+66896|0;b=K[a+15360|0];if(b){H[1040205]=b}if(K[a+13824|0]!=4){H[1040204]=1}return 0}function Ej(a,b){var c=0;c=J[a+8>>2];a:{if(!J[a>>2]){if(!b){break a}return(L[a+4>>1]>>>3|0)+c|0}c=b?c+2|0:c}return c}function wn(a){var b=0,c=0;c=$c-16|0;$c=c;b=c+8|0;th(b);b=zd(b,2147483647);ge(1086588);pl(33788,b,a,64,a);$c=c+16|0}function vy(a){a=a|0;var b=0,c=0;b=$c-16|0;$c=b;c=b+8|0;a=a?0:5;Wd(c,J[(a<<2)+33456>>2]);Re(3084,c);hi(a);$c=b+16|0}function NA(){var a=0,b=0;nd(1043196,0,208);nd(1043456,0,209);a=1054309,b=Id(4615,0),H[a|0]=b;if(!K[1054308]){fl()}}function uH(a){a=a|0;var b=0;b=a+36|0;nf(b);Ce(a+72|0,a+216|0,b);H[a+7|0]=1;Ce(a+144|0,a+224|0,b);H[a+7|0]=1;Zd(a)}function ij(a,b,c,d){var e=0;e=b;b=K[b|0];H[e|0]=!b;a=J[(a<<2)+50464>>2];if(!b){Bg(25074,c,a);return}Bg(25105,d,a)}function Xs(a){Ce(a+88|0,48704,a+52|0);Ce(a+160|0,48712,a- -64|0);Ce(a+232|0,48720,a+76|0);xg(a+304|0);xg(a+396|0)}function Qx(a){a=a|0;var b=0,c=0;b=$c-16|0;$c=b;c=b+8|0;Wd(c,J[(a<<2)+32304>>2]);H[828400]=a;Re(14544,c);$c=b+16|0}function Hy(a,b){a=a|0;b=b|0;var c=0;c=$c-16|0;$c=c;a=J[a+36>>2];De(b,c+12|0);bd[J[a+12>>2]](J[c+12>>2]);$c=c+16|0}function Gf(a,b){b=b<<24|(b&65280)<<8|(b>>>8&65280|b>>>24);H[a|0]=b;H[a+1|0]=b>>>8;H[a+2|0]=b>>>16;H[a+3|0]=b>>>24}function EN(){hf(48248);hf(48260);hf(48272);hf(48284);J[263506]=1;J[263505]=1028443341;ji(1054016);nd(1041896,0,2)}function zq(a){var b=0,c=0;c=$c-32|0;$c=c;b=c+8|0;Dg(b,a+4|0,a+92|0);mn(b,b,32360);a=Of(b,113);$c=c+32|0;return a}function ye(a,b){var c=0;if(L[b+4>>1]){while(1){Ud(a,H[J[b>>2]+c|0]);c=c+1|0;if(c>>>0<L[b+4>>1]){continue}break}}}function qh(a,b,c){a=df(df(df(Mf(a,b),18413,c&255),18853,(c&65280)>>>8|0),19146,c>>>16&255);H[a|0]=0;return a+1|0}function Ox(a){a=a|0;var b=0,c=0;b=$c-16|0;$c=b;c=b+8|0;Wd(c,J[(a<<2)+32336>>2]);H[828401]=a;Re(2016,c);$c=b+16|0}function Fe(a){var b=0;while(1){if(!K[a|0]){return b}a=a+1|0;b=b+1|0;if((b|0)!=65535){continue}break}return 65535}function Ay(){var a=0,b=0;b=J[12426];a=3;a:{if((b|0)>511){break a}a=2;if((b|0)>127){break a}a=(b|0)>31}return a|0}function Aq(a){var b=0,c=0;c=$c-32|0;$c=c;b=c+8|0;Dg(b,a+4|0,a+92|0);mn(b,b,32360);a=Of(b,112);$c=c+32|0;return a}function Ai(a,b){var c=Q(0);c=Md(b);b=Jd(b);a=Qd(a,44448,64);N[a+40>>2]=c;N[a+36>>2]=-b;N[a+24>>2]=b;N[a+20>>2]=c}function vu(a,b){a=a|0;b=b|0;if(J[a+24>>2]>=0){H[a+52|0]=0;J[a+24>>2]=-1;Vi(a);Ui(a)}H[a+42|0]=K[a+42|0]^1;xn(a)}function vq(a){var b=Q(0);if(Ql(a+460|0)){b=N[a+744>>2]}else{b=Q(.41999998688697815)}N[a+748>>2]=b;N[a+740>>2]=b}function so(a,b){if(!K[1067780]){H[1067780]=1;Ri(-1,1067784,1067788,1067792)}J[266941]=a;J[266940]=a;J[266942]=b}function fM(a,b){a=a|0;b=b|0;if(K[1054734]){gh();return}H[1082838]=1;H[1082836]=1;J[270708]=35676;Ad(1082832,50)}function RE(a,b){a=a|0;b=b|0;a=b-34|0;if(!((b|0)==92|(b|0)==124|(1<<a&889204993?a>>>0<=29:0))){return 1}return 0}function Qy(a,b){a=a|0;b=b|0;var c=0,d=0,e=0;c=J[b+36>>2];e=!(bd[J[c+8>>2]]()|0),d=J[c+12>>2],bd[d](e|0);Yh(a,b)}function Ou(a){a=a|0;Vh(a+44|0,J[a+40>>2],J[a+36>>2]);md(a+632|0,1,2,0,K[1054197]?80:25);md(a+716|0,1,1,0,-150)}function ve(a,b){if((a+b|0)>=65537){ip(b);ga(4,P(a>>2,6)|0,5123,0);kl();return}ga(4,P(a>>2,6)|0,5123,P(b,3)|0)}function ud(a){a=K[a|0]|K[a+1|0]<<8|(K[a+2|0]<<16|K[a+3|0]<<24);return a<<24|(a&65280)<<8|(a>>>8&65280|a>>>24)}function qz(a,b,c){a=a|0;b=b|0;c=c|0;a=0;while(1){xo(a,0,b,c);xo(a,1,b,c);a=a+1|0;if((a|0)!=5){continue}break}}function lf(a,b){var c=0,d=0;c=$c-32|0;$c=c;J[c+28>>2]=1572864;J[c+24>>2]=c;d=c+24|0;Yg(d,b);Re(a,d);$c=c+32|0}function kM(a,b){a=a|0;b=b|0;if(K[a+37|0]){Ci(1839864,a+44|0,41752,32);Kh(1839864,2216)}ge(a);xf(6,!K[a+37|0])}function Pi(){var a=0,b=0;a=$c-16|0;$c=a;J[203553]=-321;H[814208]=0;b=a+8|0;Wd(b,12298);ne(b,0);mk();$c=a+16|0}function LM(a,b,c){a=a|0;b=b|0;c=c|0;if(!(_i(a,b,c)|J[c+32>>2]!=(b|0)&J[c+36>>2]!=(b|0))){eu(a)}return ci(b)|0}function DM(a){a=a|0;J[a+28>>2]=1;J[a+20>>2]=0;J[a+8>>2]=7756;J[a+16>>2]=a+228;pe(a,a+156|0);nd(1041636,a,551)}function xD(a,b){a=a|0;b=b|0;var c=0;c=$c-608|0;$c=c;a=Vb(a|0,c|0,600)|0;Sf(b,c,a);$c=c+608|0;return(a|0)>0|0}function hi(a){var b=0,c=Q(0);J[263488]=a;b=a-1|0;if(b>>>0<=3){c=N[(b<<2)+33508>>2]}Yo(!a);if(c!=Q(0)){bm(c)}}function bG(){var a=0;ls(0);a=J[458673];if((a|0)!=53344){qd(a)}J[458677]=0;I[26650]=0;J[458673]=0;J[461355]=0}function Zr(a,b){var c=Q(0);c=Md(b);b=Jd(b);a=Qd(a,44448,64);N[a+20>>2]=c;N[a+16>>2]=-b;N[a+4>>2]=b;N[a>>2]=c}function HG(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;a=Mb(J[a+32>>2],b|0,c|0)|0;J[d>>2]=(a|0)<0?-1:a;return 0-a&a>>31}function GG(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;a=Nb(J[a+32>>2],b|0,c|0)|0;J[d>>2]=(a|0)<0?-1:a;return 0-a&a>>31}function Em(a,b){var c=Q(0);c=Md(b);b=Jd(b);a=Qd(a,44448,64);N[a+40>>2]=c;N[a+32>>2]=b;N[a+8>>2]=-b;N[a>>2]=c}function hI(a,b){a=a|0;b=b|0;if(!K[a+4|0]){return 0}if(K[a+40|0]){H[a+40|0]=0;return 0}xi(a+72|0,b);return 1}function gx(a){a=a|0;var b=0;b=$c-16|0;$c=b;Pe(a,b+12|0);N[J[207101]+464>>2]=N[b+12>>2];Re(7389,a);$c=b+16|0}function gJ(a){a=a|0;var b=0,c=0,d=0;c=a+2|0;d=K[a|0];a=K[a+1|0];b=a<<4&96|a&1;fn(c,d,(a&16?b|6:b)|a<<2&128)}function Yt(){var a=0,b=0;a=J[263697];b=!a;if((b|0)!=K[813220]){H[813220]=b;bd[J[J[203292]+(a?32:28)>>2]]()}}function oi(a){var b=0,c=0;if(a>>>0>=2){while(1){b=b+1|0;c=a>>>0>3;a=a>>>1|0;if(c){continue}break}}return b}function mk(){var a=0;a:{if(!J[206224]){break a}a=bd[J[206223]](824864)|0;if(!a){break a}Af(a,11925,48760)}}function Yx(a){a=a|0;var b=0,c=0;b=$c-16|0;$c=b;c=b+8|0;Wd(c,J[(a<<2)+33456>>2]);Re(3084,c);hi(a);$c=b+16|0}function VC(a){a=a|0;J[467441]=33554432;J[467440]=1869248;Sf(1869760,a,Nh(a,2048));He(1050996,1002,0,51152)}function Ij(a,b,c){var d=0,e=0;d=$c-608|0;$c=d;e=d+8|0;Je(e,a);J[467288]=c;J[467289]=b;Ob(e|0)|0;$c=d+608|0}function Fm(a,b,c,d,e){var f=Q(0);f=Md(e);e=Jd(e);N[a+4>>2]=c;N[a+8>>2]=Q(e*b)+Q(f*d);N[a>>2]=Q(f*b)-Q(e*d)}function od(a,b){var c=0;c=K[b|0];if(c){while(1){Ud(a,c<<24>>24);c=K[b+1|0];b=b+1|0;if(c){continue}break}}}function eM(a){a=a|0;md(a+288|0,1,1,0,-100);md(a+36|0,1,1,0,-25);md(a+120|0,1,1,0,25);md(a+204|0,1,2,0,25)}function bp(a,b){a=oi(a);b=oi(b);if(K[1054473]){a=(a|0)<(b|0)?a:b;return(a|0)>=4?4:a}return(a|0)>(b|0)?a:b}function bK(){if(!K[1811800]){je(1686432,0,1536);tt();qd(J[433210]);J[433210]=0;qd(J[444416]);J[444416]=0}}function Uf(a,b){var c=0;c=L[a+4>>1];if((c|0)==L[b+4>>1]){a=(ir(J[a>>2],J[b>>2],c)|0)!=0}else{a=0}return a}function Jp(a){var b=0,c=0;zp(a);while(1){c=b&65535;yl(a,c);yl(c,a);b=b+1|0;if((b|0)!=768){continue}break}}function jH(a){a=a|0;md(a+240|0,1,1,0,-30);md(a+312|0,1,1,0,10);md(a+48|0,1,1,0,80);md(a+132|0,1,1,0,130)}function fL(a){a=a|0;Zo(a,Q(Q(J[203294])*Q(.01745329238474369)),Q(Q(J[263478])/Q(J[263479])),Q(J[12426]))}function cD(a,b,c){a=a|0;b=b|0;c=c|0;a=!J[b+4>>2];if((a|0)!=K[1869223]){H[1869223]=a;Nd(1049176)}return 0}function KH(a,b){a=a|0;b=Q(b);bd[J[J[a+48>>2]+40>>2]](a+48|0,4)|0;bd[J[J[a+2764>>2]+40>>2]](a+2764|0,0)|0}function zs(a,b,c){var d=0;if((c|0)>0){while(1){Ud(a,H[b+d|0]);d=d+1|0;if((d|0)!=(c|0)){continue}break}}}function pk(a,b,c,d){var e=0,f=0;e=$c-16|0;$c=e;f=a;a=e+8|0;if(Hf(f,a)){b=Ei(a,b,c,d)}$c=e+16|0;return b}function GA(a){a=a|0;a=0;while(1){if(K[a+80720|0]==5){uj(a&65535)}a=a+1|0;if((a|0)!=768){continue}break}}function zr(a){a:{if(!K[a+146|0]){break a}if(!(Gl(N[a+200>>2])<Q(.5))){break a}gl(a+172|0,J[a+168>>2])}}function Yz(a,b){a=a|0;b=b|0;if(J[263697]){a=0}else{J[12836]=-1;J[266388]=0;cf(1,1);Tk();a=1}return a|0}function Wz(a,b){a=a|0;b=b|0;if(J[263697]){a=0}else{J[12836]=-1;J[266388]=0;cf(0,1);Uk();a=1}return a|0}function Uz(a,b){a=a|0;b=b|0;if(J[263697]){a=0}else{J[12836]=-1;J[266388]=0;cf(2,1);zo();a=1}return a|0}function SK(){wd(1555664,39952);wd(1555680,39996);wd(1555696,40040);wd(1555712,40084);wd(1555728,40128)}function Kg(a,b,c,d){var e=0;e=1;a=a+44|0;a:{if((rf(a,b)|0)<0){e=0;if((rf(a,c)|0)<0){break a}}H[d|0]=e}}function Dd(a){var b=0,c=0;b=$c-16|0;$c=b;c=J[a>>2];J[b+12>>2]=c;if(c){Oa(1,b+12|0)}J[a>>2]=0;$c=b+16|0}function Cd(a){var b=0,c=0;b=$c-16|0;$c=b;c=J[a>>2];if(c){J[b+12>>2]=c;Wc(1,b+12|0)}J[a>>2]=0;$c=b+16|0}function xg(a){var b=0;if(J[a+40>>2]>0){while(1){zg(a,b);b=b+1|0;if((b|0)<J[a+40>>2]){continue}break}}}function RB(a,b,c){a=a|0;b=Q(b);c=Q(c);nq(a,c);if(!(!K[J[203292]]&J[207101]==(a|0))){sn(J[a+48>>2],a)}}function Oj(a){qd(J[a+156>>2]);qd(J[a+172>>2]);J[a+172>>2]=0;J[a+156>>2]=0;J[a+160>>2]=0;J[a+164>>2]=0}function tK(a){a=a|0;var b=0,c=0;b=$c-16|0;$c=b;c=a;a=b+8|0;kf(c,61,a,b);a=pn(a);$c=b+16|0;return a^1}function nt(a){J[a+8>>2]=0;J[a+12>>2]=0;J[a+4>>2]=16;J[a>>2]=0;J[a+16>>2]=0;J[a+20>>2]=0;J[a+24>>2]=0}function SC(a,b,c){a=a|0;b=b|0;c=c|0;if(!K[1054308]){H[1054308]=1;vf(17126,2511);Nd(1043196)}return 1}function IM(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;if((lj(a,b,c,d)|0)<0){a=K[a+36|0]!=0}else{a=1}return a|0}function vF(a,b){a=a|0;b=b|0;a=Zk(17);if(a){ge(a);return}H[1778429]=1;J[444594]=40816;Ad(1778376,17)}function eg(a,b){var c=0;c=b>>>4|0;Ud(a,b>>>0<160?c|48:c+55|0);c=a;a=b&15;Ud(c,a>>>0<10?a|48:a+55|0)}function MM(a,b){a=a|0;b=Q(b);if(K[a+36|0]){mg(0,0,J[467303],J[467304],1763186712,-1570622669)}eh(a)}function MI(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;if(K[1054793]){bd[J[J[a+332>>2]+28>>2]](a+332|0,b,c,d)}}function Hg(a){var b=0;b=J[12428];a=(a|0)>(b|0)?b:a;if((a|0)!=J[12426]){J[12426]=a;Nd(1042416);Rh()}}function sA(a,b){a=a|0;b=b|0;var c=0;c=$c-16|0;$c=c;J[c+12>>2]=2;Lf(1054760,a,b,0,c+12|0);$c=c+16|0}function rA(a,b){a=a|0;b=b|0;var c=0;c=$c-16|0;$c=c;J[c+12>>2]=2;Lf(1054764,a,b,0,c+12|0);$c=c+16|0}function qA(a,b){a=a|0;b=b|0;var c=0;c=$c-16|0;$c=c;J[c+12>>2]=4;Lf(1054768,a,b,0,c+12|0);$c=c+16|0}function ip(a){a=a|0;a=P(a,24);_(0,3,5126,0,24,a|0);_(1,4,5121,1,24,a+12|0);_(2,2,5126,0,24,a+16|0)}function Ru(a,b){a=a|0;b=b|0;H[1087058]=1;H[1087056]=1;J[271763]=35948;Ad(1087052,50);zm(1087364,0)}function Ny(a,b){a=a|0;b=b|0;var c=0;a=J[a+36>>2];c=bd[J[a+8>>2]]()|0;od(b,J[J[a+16>>2]+(c<<2)>>2])}function MJ(a){a=Q(a);var b=0;b=K[813200]?48592:48596;a=Q(N[b>>2]-a);N[b>>2]=a>Q(2)?a:Q(2);return 1}function HM(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;if(($i(a,c,d)|0)<0){a=K[a+36|0]!=0}else{a=1}return a|0}function no(a,b,c){a=a|0;b=b|0;c=c|0;return I[(J[266950]+(P(J[464807],c)<<1)|0)+(a<<1)>>1]<(b|0)|0}function Lw(a){a=a|0;var b=0;b=$c-16|0;$c=b;Pe(a,b+12|0);N[203293]=N[b+12>>2];Re(4475,a);$c=b+16|0}function Ll(a,b){b=P(b,12)+66896|0;I[b+55298>>1]=a;I[b+55296>>1]=a;I[b+55300>>1]=a;I[b+55302>>1]=a}function Jq(a,b){if(L[a+4>>1]>(b|0)){a=M[(K[J[a>>2]+b|0]<<2)+825316>>2]>16777215}else{a=0}return a}function HL(){var a=0;Tt(0);while(1){sk(P(a,6848)+1092944|0);a=a+1|0;if((a|0)!=64){continue}break}}function vL(a){a=a|0;a=P(L[a+52>>1],12)+66896|0;return Q(Q(Q(N[a+18436>>2]+N[a+27652>>2])*Q(.5)))}function tn(a){var b=0;b=J[203303];J[(b?J[203304]+44|0:813212)>>2]=a;J[203304]=a;J[a+44>>2]=b?b:a}function di(a){bd[J[J[a>>2]+56>>2]](a);bd[J[J[a>>2]+60>>2]](a);bd[J[J[a>>2]+52>>2]](a);H[a+7|0]=1}function aD(a,b,c){a=a|0;b=b|0;c=c|0;a=Tq(J[b+36>>2],J[b+8>>2]);if(a){kj(a)}Ah();return(a|0)!=0|0}function Nw(a){a=a|0;var b=0;b=$c-16|0;$c=b;Pe(a,b+12|0);N[J[207101]+456>>2]=N[b+12>>2];$c=b+16|0}function $B(){J[208793]=0;J[208705]=0;J[208706]=0;J[208605]=0;J[208606]=0;J[208707]=0;J[208607]=0}function $A(a){a=a|0;var b=0;a=yp(a,185);b=J[263435];J[464849]=b;J[464850]=J[263436]-b;return a|0}function cj(a,b,c){var d=0;d=$c-16|0;$c=d;Pe(a,d+12|0);N[b>>2]=N[d+12>>2];Re(c,a);al();$c=d+16|0}function Ef(a,b,c,d){var e=0;e=J[b+4>>2];b=J[b>>2];H[a+12|0]=d;J[a+8>>2]=c;J[a>>2]=b;J[a+4>>2]=e}function nA(a){a=a|0;Zo(1054892,Q(1.2217304706573486),Q(Q(J[263478])/Q(J[263479])),Q(J[12426]))}function YH(a,b){a=a|0;b=b|0;var c=0;b=(0-b<<3)+48672|0;c=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=c}function UB(a){a=a|0;if(!K[a+55|0]){return 0}return Xt(a)<=(K[828400]==4?Q(67108864):Q(1024))|0}function Qf(a,b){if(K[1056336]){ha()|0;H[1056336]=0;za(a|0,b|0);H[1056336]=1;return}za(a|0,b|0)}function Ig(a){var b=0;if(Q(R(a))<Q(2147483648)){b=~~a}else{b=-2147483648}return b+(Q(b|0)<a)|0}function Bd(a){var b=0;if(Q(R(a))<Q(2147483648)){b=~~a}else{b=-2147483648}return b-(Q(b|0)>a)|0}function kG(a,b){a=a|0;b=b|0;if(K[1811800]){pd(22719);return}Od(6223,1811772);Od(6236,1811780)}function Jg(a,b){var c=0;c=a;a=K[1054441]&4?8:K[1040328]?128:2048;return P(Ge(c,a),Ge(b,a))<<2}function zz(a,b){a=a|0;b=b|0;a=(J[b+8>>2]<<2)+1066040|0;J[a>>2]=J[a>>2]|32;return!J[263697]|0}function zK(a){a=a|0;var b=0;J[a+100>>2]=J[10100];b=J[10099];J[a+92>>2]=J[10098];J[a+96>>2]=b}function yz(a,b){a=a|0;b=b|0;a=(J[b+8>>2]<<2)+1066040|0;J[a>>2]=J[a>>2]|16;return!J[263697]|0}function vK(a){a=a|0;var b=0;J[a+100>>2]=J[10120];b=J[10119];J[a+92>>2]=J[10118];J[a+96>>2]=b}function uF(a,b){a=a|0;b=b|0;a=J[(K[J[b+36>>2]+4|0]<<2)+1065632>>2];if(a){bd[a|0](0,51228)|0}}function rE(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;if(J[a+60>>2]==(b|0)){J[a+56>>2]=0;J[a+60>>2]=0}}function qr(a){if((a|0)==255){a=qi(255)?255:9}if(L[929696]!=(a|0)){I[929696]=a;Rd(1046056,0)}}function qI(a,b){a=a|0;b=b|0;var c=0;b=(b<<3)+48688|0;c=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=c}function pr(a){if((a|0)==255){a=qi(255)?255:7}if(L[929697]!=(a|0)){I[929697]=a;Rd(1046056,1)}}function om(a){Ri(a,1859456,1859460,1859464);if(J[464863]!=(a|0)){J[464863]=a;Rd(1046056,15)}}function nm(a){Ri(a,1859472,1859476,1859480);if(J[464867]!=(a|0)){J[464867]=a;Rd(1046056,16)}}function gr(a,b){var c=0,d=0,e=0;if(!a|!b){a=1}else{a=(c=0,d=GN(b,0,a,0),e=ad,e?c:d)}return a}function ev(){var a=0;a=J[464849];J[195020]=(a|0)>0?a:0;a=a+J[464850]|0;J[195019]=(a|0)>0?a:0}function _q(a,b){Xa(6208,a|0,b|0)|0;Yc(6208,+Q(Q(a|0)/N[467293]),+Q(Q(b|0)/N[467294]))|0;Bh()}function ZH(a,b){a=a|0;b=b|0;var c=0;b=(b<<3)+48608|0;c=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=c}function Sk(a){if(!K[1067756]){pd(23719);return}if(!K[1054197]){J[266938]=P(a,9);Nd(1044236)}}function QK(a){a=a|0;var b=0;J[a+100>>2]=J[10045];b=J[10044];J[a+92>>2]=J[10043];J[a+96>>2]=b}function JK(a){a=a|0;var b=0;J[a+100>>2]=J[10082];b=J[10081];J[a+92>>2]=J[10080];J[a+96>>2]=b}function DK(a){a=a|0;var b=0;J[a+100>>2]=J[10091];b=J[10090];J[a+92>>2]=J[10089];J[a+96>>2]=b}function ws(a,b){a:{if(ld(a,12780)){a=1;H[b|0]=1;break a}a=ld(a,13226);H[b|0]=0}return a&255}function ji(a){J[a>>2]=0;J[(J[263474]?J[263475]+12|0:1053896)>>2]=a;J[263475]=a;J[a+12>>2]=0}function Vm(a,b){var c=0,d=0;d=24;while(1){c=d;eg(a,b>>>c&255);d=c-8|0;if(c){continue}break}}function MG(){var a=0;if(!K[1811800]){while(1){Dj(a);a=a+1|0;if((a|0)!=255){continue}break}}}function Lz(a,b){a=a|0;b=b|0;if(J[263697]){a=0}else{ij(a,1053904,16467,16146);a=1}return a|0}function Gl(a){var b=0;if(Q(R(a))<Q(2147483648)){b=~~a}else{b=-2147483648}return Q(a-Q(b|0))}function GL(){var a=0;while(1){sk(P(a,6848)+1092944|0);a=a+1|0;if((a|0)!=64){continue}break}}function Bz(a,b){a=a|0;b=b|0;a=(J[b+8>>2]<<2)+1066040|0;J[a>>2]=J[a>>2]|2;return!J[263697]|0}function Az(a,b){a=a|0;b=b|0;a=(J[b+8>>2]<<2)+1066040|0;J[a>>2]=J[a>>2]|1;return!J[263697]|0}function Qz(a,b){a=a|0;b=b|0;if(J[263697]){a=0}else{ij(a,813080,16531,16212);a=1}return a|0}function Oz(a,b){a=a|0;b=b|0;if(J[263697]){a=0}else{ij(a,775856,16502,16182);a=1}return a|0}function FH(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return bd[J[J[a+48>>2]+32>>2]](a+48|0,b,c,d)|0}function Eq(){je(825316,0,1024);Kd(825508,32224,40);Kd(825704,32272,24);Kd(825576,32272,24)}function rg(a){var b=0,c=0;c=1;while(1){b=c;c=b<<1;if((a|0)>(b|0)){continue}break}return b}function qL(a){a=a|0;var b=0;J[a+100>>2]=J[9621];b=J[9620];J[a+92>>2]=J[9619];J[a+96>>2]=b}function pM(a){a=a|0;$t(a+404|0);_t(a+68|0);md(a+236|0,1,1,-110,85);md(a+320|0,1,1,110,85)}function jL(a){a=a|0;var b=0;J[a+100>>2]=J[9696];b=J[9695];J[a+92>>2]=J[9694];J[a+96>>2]=b}function jK(a){a=a|0;a=a+66896|0;if((K[a+13824|0]&254)!=4){a=K[a|0]!=0}else{a=1}return a|0}function dL(a){a=a|0;var b=0;J[a+100>>2]=J[9771];b=J[9770];J[a+92>>2]=J[9769];J[a+96>>2]=b}function bA(a,b){a=a|0;b=b|0;b=b-149|0;if(b>>>0<=22){a=K[(a+b|0)+96|0]}else{a=0}return a|0}function ZK(a){a=a|0;var b=0;J[a+100>>2]=J[9912];b=J[9911];J[a+92>>2]=J[9910];J[a+96>>2]=b}function TK(a){a=a|0;var b=0;J[a+100>>2]=J[9987];b=J[9986];J[a+92>>2]=J[9985];J[a+96>>2]=b}function Gs(a,b){var c=0;c=$c-16|0;$c=c;b=dr(c+12|0,b);gk(a,J[c+12>>2]);$c=c+16|0;return b}function AL(a){a=a|0;var b=0;J[a+100>>2]=J[9546];b=J[9545];J[a+92>>2]=J[9544];J[a+96>>2]=b}function pD(a){a=a|0;var b=0,c=0;b=$c-16|0;$c=b;c=b+8|0;Wd(c,a);bd[J[12861]](c);$c=b+16|0}function aw(a,b){a=a|0;b=b|0;var c=0;c=K[1054209];lf(8881,c>>>0<28?30:c-1|0);ql();Yh(a,b)}function Zz(a,b){a=a|0;b=b|0;if(J[263697]){a=0}else{H[1054742]=!K[1054742];a=1}return a|0}function Xr(a,b,c){var d=0,e=0;J[a+8>>2]=c;J[a+4>>2]=b;d=a,e=Ye(P(b,c),4,17395),J[d>>2]=e}function Ud(a,b){var c=0;c=L[a+4>>1];if((c|0)!=L[a+6>>1]){I[a+4>>1]=c+1;H[J[a>>2]+c|0]=b}}function Rh(){var a=0;a=J[203292];if(a){bd[J[a+4>>2]](1054376);Me(0,1054376);Nd(1042936)}}function Pz(a,b){a=a|0;b=b|0;if(J[263697]){a=0}else{H[1054203]=!K[1054203];a=1}return a|0}function Oe(a,b,c,d){a=er(a,b,c,d);b=ad;return!b&a>>>0>2147483647|b?2147483:(a>>>0)/1e3|0}function CG(a,b){a=a|0;b=b|0;a=Ba(J[a+32>>2],0,1)|0;J[b>>2]=(a|0)<0?-1:a;return 0-a&a>>31}function pu(a,b){a=a|0;b=b|0;a:{if(K[a+52|0]){H[a+52|0]=0;break a}xi(a+100|0,b)}return 1}function Nz(a,b){a=a|0;b=b|0;if(J[263697]){a=0}else{ij(a,66889,1922,1968);a=1}return a|0}function OA(a,b){a=a|0;b=b|0;a=Fh(54576,a);if(a){Af(a,12332,b);qd(J[13644]);J[13644]=0}}function CI(a){a=a|0;H[1801724]=0;_d(1040856,a,839);_d(1041116,a,840);_d(1041376,a,841)}function fF(a,b){a=a|0;b=b|0;return(b-48&255)>>>0<10|(b-65&255)>>>0<6|(b-97&255)>>>0<6}function bC(){var a=0;while(1){Dj(a);a=a+1|0;if((a|0)!=256){continue}break}J[208590]=0}function aE(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;bd[J[J[a+1628>>2]+28>>2]](a+1628|0,b,c,d)}function RD(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;zm(a,0);H[a+146|0]=1;xr(a,a,c,d);return 1}function QL(a){a=a|0;be(1);af(24);vk(1553728);Pd(J[273228]);J[273224]=J[273229];ae(24)}function Gk(a,b){a=a|0;b=Q(b);mg(0,0,J[467303],J[467304],1763186712,-1570622669);eh(a)}function hs(a,b){a=a|0;b=b|0;H[1856382]=1;H[1856380]=1;J[464094]=43012;Ad(1856376,45)}function gs(a,b){a=a|0;b=b|0;H[1856934]=1;H[1856932]=1;J[464232]=43080;Ad(1856928,45)}function bm(a){var b=0;if(Q(R(a))<Q(2147483648)){b=~~a}else{b=-2147483648}ua(0,b|0)|0}function aM(a){a=a|0;md(a+120|0,1,1,0,-100);md(a+192|0,1,1,0,-60);md(a+36|0,1,1,0,30)}function WH(a,b){a=a|0;b=b|0;if(!K[1054308]){b=b<<24>>24;Sj(a+304|0,b);Sj(a+396|0,b)}}function Vv(a,b,c){a=a|0;b=b|0;c=c|0;if(c){b=J[a+100>>2];if(b){bd[b|0](a)}H[a+7|0]=1}}function Tu(a,b){a=a|0;b=b|0;H[1084686]=1;H[1084684]=1;J[271170]=35812;Ad(1084680,50)}function Mn(a,b){a=a|0;b=b|0;H[1082838]=1;H[1082836]=1;J[270708]=35676;Ad(1082832,50)}function Lu(a,b){a=a|0;b=b|0;H[1086594]=1;H[1086592]=1;J[271647]=35880;Ad(1086588,50)}function In(a,b){a=a|0;b=b|0;H[1092110]=1;H[1092108]=1;J[273026]=36732;Ad(1092104,50)}function HF(a,b){a=a|0;b=b|0;H[1855742]=1;H[1855740]=1;J[463934]=42944;Ad(1855736,45)}function DG(a,b){a=a|0;b=b|0;a=Jb(J[a+32>>2])|0;J[b>>2]=(a|0)<0?-1:a;return 0-a&a>>31}function wL(a){a=a|0;return Q(Q(N[P(L[a+52>>1],12)+94548>>2]+Q(.07500000298023224)))}function ll(a,b,c,d){H[49733]=b;H[49732]=a;H[49734]=c;H[49735]=d;Ja(a|0,b|0,c|0,d|0)}function $f(a,b,c,d,e,f){return(a|0)<=(e|0)&(b|0)<=(f|0)&(a+c|0)>(e|0)&(b+d|0)>(f|0)}function kH(a,b){a=a|0;b=Q(b);mg(0,0,J[467303],J[467304],-14671808,-15724464);eh(a)}function ds(a){H[825244]=0;if(Ii(a,31472)){H[825244]=1;I[a+4>>1]=L[a+4>>1]-3;Li(a)}}function ZM(a){a=a|0;md(a+36|0,1,1,0,-25);md(a+120|0,1,1,0,25);md(a+204|0,1,2,0,25)}function Pv(a){a=a|0;Ed(a+108|0);Ed(a+120|0);Be(a);bd[J[J[a+132>>2]+4>>2]](a+132|0)}function PI(a,b,c){a=a|0;b=b|0;c=c|0;return bd[J[J[a+332>>2]+12>>2]](a+332|0,b,c)|0}function Nu(a){a=a|0;var b=0,c=0;b=$c-16|0;$c=b;c=a;a=b+4|0;An(c,a);Ed(a);$c=b+16|0}function rK(a,b,c){a=Q(a);b=Q(b);c=c|0;N[203298]=N[203298]+a;N[203299]=N[203299]+b}function dr(a,b){var c=0;c=a;a=ja(b|0,578)|0;J[c>>2]=(a|0)<0?-1:a;return 0-a&a>>31}function cr(a,b,c,d){a=Fb(a|0,b|0,c|0)|0;b=(a|0)>=0;J[d>>2]=b?a:0;return b?0:0-a|0}function Yf(a){J[(J[273232]?J[273233]+12|0:1092928)>>2]=a;J[273233]=a;J[a+12>>2]=0}function WK(a){a=a|0;yf(a);af(144);Mt(a);Pd(J[273228]);J[273224]=J[273229];ae(144)}function WC(a){a=a|0;J[467441]=33554432;J[467440]=1869248;Sf(1869760,a,Nh(a,2048))}function Td(a){J[(J[263472]?J[263473]+20|0:1053888)>>2]=a;J[263473]=a;J[a+20>>2]=0}function Se(a){J[(J[273230]?J[273231]+68|0:1092920)>>2]=a;J[273231]=a;J[a+68>>2]=0}function Og(a,b,c){H[a+12|0]=c;J[a+8>>2]=b;b=J[10439];J[a>>2]=J[10438];J[a+4>>2]=b}function NK(a){a=a|0;J[a+188>>2]=1070141403;J[a+180>>2]=1070141403;Ph(a,1531648,0)}function Gu(a){a=a|0;Vh(a+48|0,37024,8);md(a+720|0,1,1,0,100);md(a+792|0,1,2,0,25)}function GH(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;bd[J[J[a+48>>2]+28>>2]](a+48|0,b,c,d)}function En(){var a=0;ge(1089628);a=J[272538];if(a){bd[a|0](1089912,0)}J[272538]=0}function td(a,b,c){var d=0,e=0;d=$c-16|0;$c=d;e=d+8|0;Wd(e,b);gf(a,e,c);$c=d+16|0}function sf(a){J[(J[206299]?J[206300]+32|0:825196)>>2]=a;J[206300]=a;J[a+32>>2]=0}function ly(a){a=a|0;var b=0;b=$c-16|0;$c=b;Pe(a,b+12|0);nr(N[b+12>>2]);$c=b+16|0}function ee(a,b,c){var d=0,e=0;d=$c-16|0;$c=d;e=d+8|0;Wd(e,b);Ce(a,e,c);$c=d+16|0}function by(a){a=a|0;var b=0;b=$c-16|0;$c=b;Pe(a,b+12|0);mr(N[b+12>>2]);$c=b+16|0}function We(a){if(K[1054294]!=(a|0)){H[1054294]=a;if(a){qa(3042);return}oa(3042)}}function Rw(a){a=a|0;if(J[203296]>(a|0)){J[203296]=a}J[203295]=a;lf(2082,a);uk(a)}function sh(a){J[(J[263425]?J[263426]+8|0:1053700)>>2]=a;J[263426]=a;J[a+8>>2]=0}function hf(a){J[(J[461355]?J[461356]+8|0:1845420)>>2]=a;J[461356]=a;J[a+8>>2]=0}function _u(a){a=a|0;if(!K[1054734]){le(a+128|0,!K[J[207101]+471|0]);H[a+7|0]=1}}function Wq(a){var b=0;b=$c-608|0;$c=b;if(K[1055388]){Rf(b,a);Hc(b|0)}$c=b+608|0}function TH(a,b){a=a|0;b=Q(b);if(!(K[1054203]|(K[1054198]?0:K[1054197]))){eh(a)}}function dF(a,b){a=a|0;b=b|0;a=$c-16|0;$c=a;b=on(b,a+13|0);$c=a+16|0;return b|0}function Rl(a){J[(J[208590]?J[208591]+4|0:834360)>>2]=a;J[208591]=a;J[a+4>>2]=0}function Rj(a,b,c,d){Kf(a);J[a+88>>2]=d;J[a+84>>2]=c;J[a+40>>2]=b;J[a>>2]=45036}function NL(a,b){a=a|0;b=b|0;a=J[203295];if((a|0)!=J[203294]){J[203294]=a;Rh()}}function ym(a,b){H[a+20|0]=b;if(!(!b|!K[a+52|0])){Qj(a)}bd[J[J[a>>2]+8>>2]](a)}function lM(a,b){a=a|0;b=b|0;b=J[b+36>>2];H[a+36|0]=1;H[a+37|0]=(b|0)!=0;di(a)}function it(){H[1797902]=1;H[1797900]=1;J[449474]=41020;Ad(1797896,20);xf(1,1)}function fD(a,b,c){a=a|0;b=b|0;c=c|0;H[1869221]=(a|0)==13;Nd(1048396);return 1}function Vp(a,b,c,d){a=a+80720|0;hp(K[a|0]);de(c);ie(1);Ve(b);ae(d);gp(K[a|0])}function JF(a,b){a=a|0;b=b|0;if(b){Pe(a,1054784);Re(14161,a);es(1856376);al()}}function Fz(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;if((d|0)!=51152){yo(d,b,c,51152)}}function Dz(a){a=a|0;a=J[207101];if(!(K[a+472|0]?K[a+470|0]:0)){uk(J[203295])}}function Re(a,b){var c=0,d=0;c=$c-16|0;$c=c;d=c+8|0;Wd(d,a);Si(d,b);$c=c+16|0}function ag(a,b,c,d){a=Qd(a,44448,64);N[a+56>>2]=d;N[a+52>>2]=c;N[a+48>>2]=b}function vz(a,b){a=a|0;b=b|0;a=(J[b+8>>2]<<2)+1066040|0;J[a>>2]=J[a>>2]&-33}function uz(a,b){a=a|0;b=b|0;a=(J[b+8>>2]<<2)+1066040|0;J[a>>2]=J[a>>2]&-17}function pd(a){var b=0,c=0;b=$c-16|0;$c=b;c=b+8|0;Wd(c,a);ne(c,0);$c=b+16|0}function lC(a,b){a=a|0;b=b|0;if(J[b>>2]!=2){H[P(J[b+8>>2],796)+834883|0]=0}}function kC(a,b){a=a|0;b=b|0;if(J[b>>2]!=2){H[P(J[b+8>>2],796)+834882|0]=0}}function Qg(a,b){var c=0,d=0;J[a+40>>2]=b;c=a,d=Ej(b,0),J[c+108>>2]=d;Ff(a)}function HN(a){var b=0;b=a&31;a=0-a&31;return(-1>>>b&-2)<<b|(-1<<a&-2)>>>a}
function xz(a,b){a=a|0;b=b|0;a=(J[b+8>>2]<<2)+1066040|0;J[a>>2]=J[a>>2]&-3}function wz(a,b){a=a|0;b=b|0;a=(J[b+8>>2]<<2)+1066040|0;J[a>>2]=J[a>>2]&-2}function qH(a){a=a|0;_d(1045536,a,856);_d(1045796,a,857);_d(1041636,0,858)}function _s(a){xg(a+672|0);xg(a+764|0);if(K[a+4|0]){Ff(a+72|0)}Qj(a+856|0)}function SI(a){a=a|0;_d(1044496,a,837);_d(1041636,a,838);_d(1045016,a,838)}function LH(a){a=a|0;_d(1041636,a,854);_d(1044756,a,855);_d(1045016,a,855)}function Fn(a,b){if(a&1){od(b,9560)}if(a&2){od(b,3619)}if(a&4){od(b,3006)}}function BE(a,b){a=a|0;b=b|0;a=J[a+40>>2];if(a){de(a);he(4,b)}return b+4|0}function oD(a,b){a=a|0;b=b|0;J[467290]=b;wb();vb(15073);ub(7898);return 0}function nN(a){a=a|0;if(J[271798]){J[271798]=0;td(1087112,12770,1087088)}}function gI(a,b){a=a|0;b=b|0;if(!K[a+4|0]){return 0}Hh(a+72|0,b);return 1}function gB(){sh(49632);sh(49644);sh(49656);sh(49668);sh(49680);sh(49692)}function Yr(a,b,c,d){a=Qd(a,44448,64);N[a+40>>2]=d;N[a+20>>2]=c;N[a>>2]=b}function Sn(a){a=a|0;H[J[207101]+470|0]=a;Xd(16448,a);Pl(J[207101]+460|0)}function Py(a,b){a=a|0;b=b|0;od(b,bd[J[J[a+36>>2]+8>>2]]()|0?18536:18855)}function IG(a){a=a|0;var b=0;b=Lb(J[a+32>>2])|0;J[a+32>>2]=0;return 0-b|0}function Hl(){Dd(1040248);Dd(1040240);Dd(1040260);Dd(1040304);Dd(1040316)}function BH(a){a=a|0;Zd(a);J[a+128>>2]=J[a+12>>2];nf(a+36|0);Sg(a+48|0,1)}function zI(a,b,c){a=a|0;b=b|0;c=c|0;if(!(!Ue(11,b,c)|K[a+53|0])){ge(a)}}function yq(a){xq(a);I[(a<<1)+828408>>1]=0;H[a+828920|0]=0;Rd(1041376,a)}function kl(){_(0,3,5126,0,24,0);_(1,4,5121,1,24,12);_(2,2,5126,0,24,16)}function _r(a,b){H[a|0]=b;H[a+1|0]=b>>>8;H[a+2|0]=b>>>16;H[a+3|0]=b>>>24}function Zd(a){var b=0,c=0;Dd(a+12|0);b=a,c=of(1,J[a+8>>2]),J[b+12>>2]=c}function Xk(a,b){a:{if(b){if(K[a+1056164|0]){break a}Yk(a);return}kj(a)}}function ME(a){a=a|0;Uj(a);J[a+16>>2]=J[a+108>>2];bd[J[J[a>>2]+8>>2]](a)}function Bi(a,b){N[a>>2]=J[b>>2];N[a+4>>2]=J[b+4>>2];N[a+8>>2]=J[b+8>>2]}function ch(a){if(!K[1067756]){pd(23719);return}J[266937]=a;Nd(1044236)}function _z(a,b){a=a|0;b=b|0;if(J[263697]){a=0}else{up();a=1}return a|0}function Vz(a,b){a=a|0;b=b|0;if(J[263697]){a=0}else{tp();a=1}return a|0}function PD(a,b){a=a|0;b=b|0;we(a+112|0,-1,b);we(a+172|0,J[a+168>>2],b)}function Iz(a,b){a=a|0;b=b|0;if(J[263697]){a=0}else{bu();a=1}return a|0}function Ge(a,b){var c=0;c=(a|0)/(b|0)|0;return c+((P(b,c)|0)!=(a|0))|0}function AH(a,b){a=a|0;b=b|0;return bd[J[J[a+48>>2]+48>>2]](a+48|0,b)|0}function VG(){H[1092484]=1;J[273120]=36800;H[1092486]=0;Ad(1092480,50)}function QA(a){a=a|0;a=a<<4;_(0,3,5126,0,16,a|0);_(1,4,5121,1,16,a|12)}function Gt(a,b){return sd(a^-1|-16777216,b^-1|-16777216)^-1|-16777216}function Ee(a,b,c){var d=0;d=Nh(b,c);I[a+6>>1]=c;I[a+4>>1]=d;J[a>>2]=b}function pL(a){a=a|0;a=J[207101];if(!(K[a+470|0]?K[a+472|0]:0)){bu()}}function ak(a){var b=0;b=$c-608|0;$c=b;Wd(b,a);Je(b+8|0,b);$c=b+608|0}function Wv(a){a=a|0;var b=0;b=J[a+96>>2];if(b){bd[b|0](a)}H[a+7|0]=1}function WE(a,b){a=a|0;b=b|0;return(b-48&255)>>>0<10|(b-44&255)>>>0<3}function uM(a,b){a=a|0;b=b|0;if(K[1054740]){Ih(1793960,a+36|0)}ge(a)}function pt(a){a:{if(L[a+4>>1]){if(!Di(a)){break a}}Ns(a)}vf(6466,a)}function Il(a){var b=0;b=a&1;H[1040232]=b;H[1040328]=a&2;Bf(!b);Aj()}function EL(a,b,c){a=a|0;b=Q(b);c=Q(c);bd[J[J[203292]+24>>2]](b,c,0)}function DE(a){a=a|0;_f(a);I[a+44>>1]=J[a+4>>2];I[a+46>>1]=J[a+8>>2]}function wv(a,b,c){a=a|0;b=b|0;c=c|0;if(L[c+4>>1]){gf(b,c,a+792|0)}}function oG(a,b){a=a|0;b=b|0;if(b){vh(J[207101],a);return}pd(25022)}function nG(a,b){a=a|0;b=b|0;if(b){Vl(J[207101],a);return}pd(24972)}function So(a){a=!a;Ja(a&K[49732],a&K[49733],a&K[49734],a&K[49735])}function KJ(a){a=a|0;a=vd(a);N[J[207101]+456>>2]=Q(a>>>0)*Q(.03125)}function Es(a,b){a=a|0;b=b|0;J[b>>2]=J[a+40>>2]-J[a+36>>2];return 0}function po(a,b){var c=0;c=K[1067796];H[1067796]=a;pi(1046316,c,b)}function Nv(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;lj(a,b,c,d);return 1}function IH(a,b,c){a=a|0;b=b|0;c=c|0;if(Ue(8,b,c)){H[a+2836|0]=1}}function Dq(a){return Q(Q(bd[J[J[a+48>>2]+24>>2]](a))*N[a+84>>2])}function Bx(a){a=a|0;H[814208]=a;Xd(12285,a);if(!K[814208]){Pi()}}function pA(a,b){a=a|0;b=b|0;if(K[1054793]){Lf(1054772,a,b,0,0)}}function il(a,b,c,d){var e=0,f=0;Cd(a);e=a,f=qj(b,c,d),J[e>>2]=f}function _l(a){if(a>>>0>=4294963201){J[467445]=0-a;a=-1}return a}function Tz(a,b){a=a|0;b=b|0;J[12836]=-1;if(K[1065557]){cf(1,0)}}function Sz(a,b){a=a|0;b=b|0;J[12836]=-1;if(K[1065556]){cf(0,0)}}function Rz(a,b){a=a|0;b=b|0;J[12836]=-1;if(K[1065558]){cf(2,0)}}function BB(a){a=a|0;uh(1040320,L[929696]);uh(1040308,L[929697])}function uA(){H[1054796]=0;H[1054794]=0;J[263700]=0;J[263701]=0}function rm(a){if(J[464859]!=(a|0)){J[464859]=a;Rd(1046056,12)}}function qm(a){if(J[464860]!=(a|0)){J[464860]=a;Rd(1046056,14)}}function pm(a){if(J[464861]!=(a|0)){J[464861]=a;Rd(1046056,13)}}function eD(a,b,c){a=a|0;b=b|0;c=c|0;Bh();H[1869769]=1;return 1}function dJ(a){a=a|0;if(K[a|0]){ge(1797896);xf(1,0);return}it()}function Zq(a,b,c){a=a|0;b=b|0;c=c|0;Bh();H[1869769]=1;return 0}function Lv(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;$i(a,c,d);return 1}function Ju(a){a=a|0;le(a+552|0,!K[J[207101]+471|0]);H[a+7|0]=1}function tm(a){if(J[464851]!=(a|0)){J[464851]=a;Rd(1046056,4)}}function tC(a){a=a|0;if(!Ql(a+460|0)){N[a+740>>2]=N[a+748>>2]}}function sm(a){if(J[464855]!=(a|0)){J[464855]=a;Rd(1046056,8)}}function oo(a,b,c){a=a|0;b=b|0;c=c|0;return($h(a,c)|0)<(b|0)|0}function iq(a,b){if(K[a+34|0]!=(b|0)){H[a+34|0]=b;Nd(1044496)}}function hG(){Ht(13917,53252,29937);if(K[1054197]){I[26628]=0}}function dI(){mk();Zs();je(819376,0,256);cg(814216);cg(819644)}function aF(a,b){a=a|0;b=b|0;return(b|0)==45|(b-48&255)>>>0<10}function Pj(a){if(J[464849]!=(a|0)){J[464849]=a;Rd(1046056,2)}}function zn(a){ee(a+720|0,J[(J[a+24>>2]<<2)+37120>>2],a+36|0)}function xj(a,b){J[a>>2]=b^-554899859;J[a+4>>2]=b>>31&65535^5}function kp(a){return(a<<24>>24>=0?a?15:0:a&64?a<<4:a&15)&255}function Zn(a){bd[J[J[a+132>>2]+4>>2]](a+132|0);J[a+172>>2]=0}function ZB(a){a=a|0;Ul(a);Ml(a);if(K[a+54|0]&2){Dd(a+416|0)}}function Uv(a){a=a|0;_d(1043976,a,477);_d(1046316,a,478);En()}function Ly(a,b){a=a|0;b=b|0;Ft(b,bd[J[J[a+36>>2]+8>>2]]()|0)}function Kv(a,b,c){a=a|0;b=b|0;c=c|0;_i(a,b,c);return ci(b)|0}function Iy(a,b){a=a|0;b=b|0;Yg(b,bd[J[J[a+36>>2]+8>>2]]()|0)}function Hs(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return-857812990}function Ft(a,b){eg(a,b&255);eg(a,b>>>8&255);eg(a,b>>>16&255)}function Bt(a){a=a|0;Dd(1683332);if(!K[1054310]){Cd(1685392)}}function vd(a){a=K[a|0]|K[a+1|0]<<8;return(a<<8|a>>>8)&65535}function cw(a){a=a|0;Xd(13726,a);ql();le(1075064,K[1054208])}function cG(a){a=a|0;if(!(H[1845431]&1?0:K[1054310])){Vg(1)}}function ZL(){ak(8441);Hk(Le(13848,0,100,0));nd(1043716,0,9)}function Ws(a){Ed(a+40|0);Ed(a+52|0);Ed(a- -64|0);Ed(a+76|0)}function Oq(a){J[a+80>>2]=-1;J[a+48>>2]=0;J[a>>2]=J[a>>2]|64}function xu(a,b){a=a|0;b=b|0;H[a+52|0]=1;J[a+24>>2]=0;Vi(a)}function wu(a,b){a=a|0;b=b|0;H[a+52|0]=1;J[a+24>>2]=1;Ui(a)}function sv(a,b){a=a|0;b=b|0;a=cm(51516);if(a){ej(a,11298)}}function hC(a,b){a=a|0;b=b|0;H[P(J[b+8>>2],796)+834881|0]=0}function hB(){qd(J[13644]);J[13644]=0;J[13647]=0;H[62784]=0}function gC(a,b){a=a|0;b=b|0;H[P(J[b+8>>2],796)+834880|0]=0}function eC(a,b){a=a|0;b=b|0;H[P(J[b+8>>2],796)+834846|0]=0}function dC(a,b){a=a|0;b=b|0;H[P(J[b+8>>2],796)+835114|0]=0}function Pd(a){$(34962,a|0);Aa(34962,0,J[263621],J[263622])}function Iv(a,b){a=a|0;b=b|0;a=cm(51476);if(a){ej(a,11298)}}function Di(a){if(!rf(a,21468)){return 1}return!rf(a,21459)}function Cv(a,b){a=a|0;b=b|0;a=cm(51496);if(a){ej(a,11298)}}function xC(){je(828408,0,512);je(828920,0,256);cg(829176)}function nr(a){if(N[464852]!=a){N[464852]=a;Rd(1046056,5)}}function mr(a){if(N[464853]!=a){N[464853]=a;Rd(1046056,6)}}function he(a,b){bd[J[263678]](b);ga(4,P(a>>2,6)|0,5123,0)}function Ql(a){if(!K[a+10|0]){return 0}return K[a+13|0]!=0}function MC(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;ad=0;return 0}function EE(a){a=a|0;if(J[a+40>>2]){gl(a+40|0,J[a+68>>2])}}function mI(){var a=0,b=0;a=814208,b=Id(12285,0),H[a|0]=b}function Mo(){var a=0,b=0;a=1054788,b=_k(),J[a>>2]=b;Yt()}function EC(){Gd(826352,0,1024);qd(J[206585]);J[206585]=0}function xH(a){a=a|0;_d(1045536,a,856);_d(1045796,a,857)}function nI(a){a=a|0;_d(1046836,a,847);_d(1047356,a,848)}function lx(a){a=a|0;H[825312]=!a;Xd(2820,a);Nd(1046576)}function kr(a){hm(1865872,a);hm(1862736,a);hm(1859600,a)}function UH(a){a=a|0;_d(1046836,a,851);_d(1047356,a,852)}function Fs(a,b){a=a|0;b=b|0;J[b>>2]=J[a+40>>2];return 0}function BG(a,b){a=a|0;b=b|0;return dm(J[a+32>>2],b,0)|0}function AG(a,b){a=a|0;b=b|0;return dm(J[a+32>>2],b,1)|0}function wf(a,b){a=gr(a,b);if(!a){return 0}return xh(a)}function su(a,b){a=a|0;b=Q(b);N[a+300>>2]=N[a+300>>2]+b}function px(a){a=a|0;H[825313]=a;Xd(4190,a);Nd(1046576)}function nH(a,b){a=a|0;b=b|0;ge(a);Qo();bd[J[452937]]()}function nB(a,b,c){a=a|0;b=b|0;c=c|0;return no(a,b,c)|0}function mN(a,b){a=a|0;b=Q(b);N[a+512>>2]=N[a+512>>2]+b}function mB(a,b,c){a=a|0;b=b|0;c=c|0;return oo(a,b,c)|0}function dm(a,b,c){a=Ba(a|0,b|0,c|0)|0;return a>>31&0-a}function bx(a){a=a|0;$e(a,Q(Ol(N[J[207101]+740>>2])),3)}function be(a){if(K[1054293]!=(a|0)){H[1054293]=a;Fg()}}function ae(a){bd[J[263677]]();ga(4,P(a>>2,6)|0,5123,0)}function NM(a,b){a=a|0;b=Q(b);N[a+420>>2]=N[a+420>>2]+b}function Kx(a){a=a|0;le(J[J[a+16>>2]+12>>2],K[1067804])}function Fy(a,b){a=a|0;b=b|0;bd[J[J[a+36>>2]+12>>2]](b)}function Ed(a){I[a+4>>1]=0;if(J[a>>2]){ug(a);J[a>>2]=0}}function rs(a){I[26654]=0;Hd(53304,6272,a);Re(10604,a)}function _t(a){md(a,1,1,-110,30);md(a+84|0,1,1,110,30)}function Ux(a){a=a|0;H[780072]=a;Xd(11870,a);Ik();Eg()}function Gy(a,b){a=a|0;b=b|0;bd[J[J[a+36>>2]+8>>2]](b)}function uk(a){if(J[203294]!=(a|0)){J[203294]=a;Rh()}}function qi(a){return J[(a>>>3&8188)+726608>>2]>>>a&1}function fe(a,b){b=b<<8|b>>>8;H[a|0]=b;H[a+1|0]=b>>>8}function dn(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return 0}function Yg(a,b){if((b|0)<0){Ud(a,45);b=0-b|0}Ki(a,b)}function WI(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;return 1}function Vw(a){a=a|0;H[J[207101]+468|0]=a;Xd(12377,a)}function Tw(a){a=a|0;H[J[207101]+492|0]=a;Xd(14801,a)}function CF(a,b){a=a|0;b=b|0;ge(1856928);H[1053956]=1}function tv(a){a=a|0;a=a+908|0;Ij(37276,a,501);Sm(a)}function rn(a){return(a|0)<=63?P(a,6848)+1092944|0:0}function lL(a){a=a|0;return Q(Q(1.7000000476837158))}function jx(){je(780112,0,32768);J[203236]=J[195010]}function iu(a){J[16718]=a;if(a){pd(1514);J[16718]=0}}function bF(a,b){a=a|0;b=b|0;xe(b,27364,a+4|0,a+8|0)}function ax(a){a=a|0;H[J[207101]+493|0]=a;Xd(5300,a)}function Zw(a){a=a|0;H[J[207101]+469|0]=a;Xd(7999,a)}function XE(a,b){a=a|0;b=b|0;xe(b,27848,a+4|0,a+8|0)}function Pt(a){a=a|0;return Q(Q(1.0125000476837158))}function PA(){_(0,3,5126,0,16,0);_(1,4,5121,1,16,12)}function Nt(a){a=a|0;return Q(Q(1.0750000476837158))}function KK(a){a=a|0;return Q(Q(1.2625000476837158))}function Jv(a){a=a|0;a=a+908|0;Ij(37208,a,495);Sm(a)}function Hv(a,b,c){a=a|0;b=b|0;c=c|0;gf(b,c,a+792|0)}function Cz(a,b){a=a|0;b=b|0;bh(779960,a|-268435456)}function CE(a,b){a=a|0;b=b|0;we(a+40|0,J[a+68>>2],b)}function $K(a){a=a|0;return Q(Q(1.4812500476837158))}function xy(a){a=a|0;Hk(a?100:0);lf(13848,J[16717])}function rz(a,b){a=a|0;b=b|0;bh(779984,a|671088640)}function pF(a,b){a=a|0;b=Q(b);if(!J[263697]){eh(a)}}function ou(a,b){a=a|0;b=b|0;Hh(a+100|0,b);return 1}function kN(a,b){a=a|0;b=b|0;xi(a+312|0,b);return 1}function jN(a,b){a=a|0;b=b|0;Hh(a+312|0,b);return 1}function fN(a){a=a|0;if(!fu(a)){Od(6411,a);xf(2,0)}}function dl(a){if(J[12442]!=(a|0)){J[12442]=a;Fg()}}function _M(a,b){a=a|0;b=b|0;J[272014]=1056736;Xi()}function UL(a){a=a|0;return Q(N[J[a+48>>2]+144>>2])}function TL(a){a=a|0;return Q(N[J[a+48>>2]+140>>2])}function SF(a){a=a|0;Vh(a+120|0,43280,5);aj(a+36|0)}function RJ(a){a=a|0;a=K[a|0];if((a|0)!=255){Dj(a)}}function KM(a,b){a=a|0;b=b|0;xi(a+220|0,b);return 1}function JM(a,b){a=a|0;b=b|0;Hh(a+220|0,b);return 1}function Gj(a){if(!a){return 0}J[467445]=a;return-1}function GE(){return(K[1054197]?1:K[1811804]?3:1)|0}function FN(a){if(a){return 31-S(a-1^a)|0}return 32}function EF(a){a=a|0;Vh(a+120|0,43344,6);aj(a+36|0)}function Dy(a){a=a|0;iu(a?100:0);lf(13861,J[16718])}function CH(a){a=a|0;Ed(a+36|0);Be(a);J[a+128>>2]=0}function iK(a){a=a|0;return(K[a+80720|0]&254)==4|0}function iH(a){a=a|0;Ed(a+216|0);Ed(a+228|0);Be(a)}function hA(a,b){a=a|0;b=b|0;return K[b+1056164|0]}function Ye(a,b,c){a=wf(a,b);if(!a){gm(c)}return a}function OE(a,b){a=a|0;b=b|0;return L[b+4>>1]<65|0}function Mx(a){a=a|0;H[1054309]=a;Xd(4615,a);Vg(1)}function Ch(a,b,c){a=Lj(a,b);if(!a){gm(c)}return a}function AF(a,b){a=a|0;b=b|0;ge(1856928);Oi(41752)}function vw(a){a=a|0;a=!a;H[1054196]=a;Xd(4879,a)}function le(a,b){H[a+21|0]=K[a+21|0]&254|(b|0)!=0}function ks(){Be(1857552);js(1857552);di(1857552)}function kK(){J[400098]=0;J[393492]=0;J[413028]=0}function hh(){ra(34962,J[263621],J[263622],35044)}function eF(a,b){a=a|0;b=b|0;return L[b+4>>1]<7|0}function Yo(a){H[1054480]=a;if(K[1054311]){Uq(a)}}function PH(){mk();J[203553]=-123;I[24366]=0;Zs()}function HB(){nd(1043196,0,154);nd(1046576,0,155)}function FI(a,b){a=a|0;b=b|0;$m(a,b&255,-1);kk(a)}function Ew(a){a=a|0;H[775860]=a;Ko(a);Xd(6174,a)}function $M(a,b){a=a|0;b=b|0;J[272014]=51152;Xi()}function vB(a,b){a=a|0;b=b|0;Lf(1040236,a,b,0,0)}function uB(a,b){a=a|0;b=b|0;Lf(1040256,a,b,0,0)}function tB(a,b){a=a|0;b=b|0;Lf(1040292,a,b,0,0)}function sB(a,b){a=a|0;b=b|0;Lf(1040288,a,b,0,0)}function ro(){return(J[266940]-J[266941]|0)/24|0}function pE(a){a=a|0;if(K[1054793]){Cd(a+124|0)}}function mu(a){a=a|0;Ed(a+76|0);Ed(a+88|0);Be(a)}function hN(a){a=a|0;Ed(a+36|0);Ed(a+48|0);Be(a)}function hK(a,b){a=a|0;b=b|0;Lf(1685392,a,b,0,0)}function fx(a){a=a|0;$e(a,N[J[207101]+464>>2],2)}function Vj(a){Kf(a);J[a+68>>2]=-1;J[a>>2]=44512}function Uq(a){if(a){ua(1,1)|0;return}ua(0,16)|0}function Mw(a){a=a|0;$e(a,N[J[207101]+456>>2],2)}function Ix(a){a=a|0;H[1054792]=a;Xd(4e3,a);al()}function ty(a){a=a|0;td(a+1120|0,26709,a+108|0)}function Vq(){H[1869768]=0;if(K[1055388]){Gc()}}function TE(a,b){a=a|0;b=b|0;$e(b,N[a+12>>2],3)}function NG(){if(!K[1811800]){J[458135]=0;Ym()}}function JC(a){a=a|0;a=$c-a&-16;$c=a;return a|0}function HA(){H[775856]=1;nd(1041636,0,26);No()}function Cm(a){J[a+4>>2]=0;I[a>>1]=0;H[a+2|0]=0}function mM(a,b){a=a|0;b=b|0;H[a+36|0]=0;di(a)}function ZI(a){a=a|0;a=rn(K[a|0]);if(a){sk(a)}}function Sm(a){J[458136]=a;Rm(0,J[a+8>>2]-1|0)}function PE(a,b){a=a|0;b=b|0;return(b|0)!=38|0}function zy(a){a=a|0;H[1054201]=a;Xd(16902,a)}function zx(a){a=a|0;H[1054740]=a;Xd(14052,a)}function yF(a,b){a=a|0;b=b|0;ge(1856928);gh()}function yB(){Qp(0);qd(J[260066]);J[260066]=0}function xk(a,b,c){a=a|0;b=b|0;c=c|0;return 0}function tf(a){if(a){qa(2884);return}oa(2884)}function qj(a,b,c){return ep(a,J[a+4>>2],b,c)}function pq(a){a=a|0;return K[a+75344|0]==2|0}function ow(a){a=a|0;H[1054732]=a;Xd(10863,a)}function nx(a){a=a|0;H[1054741]=a;Xd(12890,a)}function lh(a){if(a){qa(2929);return}oa(2929)}function hJ(a){a=a|0;pi(1053336,K[a|0],a+1|0)}function cI(a,b){a=a|0;b=Q(b);return K[a+4|0]}function Zv(a){a=a|0;ee(1075872,3816,a+120|0)}function ZE(a,b){a=a|0;b=b|0;Yg(b,J[a+12>>2])}function YI(a,b,c){a=a|0;b=b|0;c=c|0;return 1}function Xw(a){a=a|0;H[1053904]=a;Xd(14070,a)}function Un(a){a=a|0;H[1054202]=a;Xd(12416,a)}function NB(a){a=a|0;return K[a+75344|0]==1|0}function MB(a){a=a|0;return K[a+76112|0]==4|0}function KL(a){a=a|0;It(a);return Q(Q(1.625))}function Is(a,b){a=a|0;b=b|0;return-857812990}function CC(a){a=a|0;return K[a+76112|0]==7|0}function BF(a,b){a=a|0;b=b|0;ge(1856928);up()}function BC(a){a=a|0;return K[a+76112|0]==6|0}function AC(a){a=a|0;return K[a+76112|0]==5|0}function xw(a){a=a|0;H[1092886]=a;Xd(9343,a)}function tH(a){a=a|0;Us(a);nd(1041636,0,858)}function sw(a){a=a|0;H[1054735]=a;Xd(4018,a)}function qw(a){a=a|0;H[1054743]=a;Xd(1340,a)}function mw(a){a=a|0;H[1054733]=a;Xd(2647,a)}function kw(a){a=a|0;H[1054734]=a;Xd(4659,a)}function ju(){J[467746]=1869816;J[467728]=42}function gw(a){a=a|0;H[1054200]=a;Xd(5572,a)}function ex(a){a=a|0;H[813081]=a;Xd(12157,a)}function ew(a){a=a|0;H[1054199]=a;Xd(5111,a)}function cF(a,b){a=a|0;b=b|0;Ft(b,J[a+4>>2])}function bH(a){a=a|0;Dd(1811232);Dd(1811236)}function aG(){if(L[26650]){I[26650]=0;Vg(0)}}function _v(a,b){a=a|0;b=b|0;od(b,J[263551])}function Yn(a){a=a|0;H[813082]=a;Xd(13118,a)}function Wn(a){a=a|0;H[1054742]=a;Xd(4603,a)}function UD(a){a=a|0;Cd(a+112|0);Cd(a+172|0)}function NC(a){a=a|0;return Qa(J[a+60>>2])|0}function Io(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0}function Gq(a){return!a|(a|0)==70|(a|0)==102}function Cw(a){a=a|0;H[813080]=a;Xd(11183,a)}function tM(a){a=a|0;$t(a+212|0);_t(a+44|0)}function Aw(a){a=a|0;J[203269]=a;lf(1210,a)}function zH(a,b){a=a|0;b=Q(b);N[a+48>>2]=b}function sg(a){return a>Q(0)?1:a<Q(0)?-1:0}function rp(a){J[12427]=a;lf(2712,a);Hg(a)}function dN(a){a=a|0;Ok(-857812990,9371,a)}function Nf(a,b,c){return Q(Q(Q(b-a)*c)+a)}function Ir(a,b,c,d,e){Rj(b,c,d,e);zi(a,b)}function yC(){Sl(255,49716,49716,41752,0)}function tl(a,b){Vf((a<<6)+726704|0,64,b)}function tg(a,b){Ee(a,(b<<6)+726704|0,64)}function rr(a){J[464818]=1023;J[464805]=a}function de(a){wa(3553,(a?a:J[263624])|0)}function ci(a){return a-25>>>0<4294967272}function VJ(a){a=a|0;fn(a+1|0,K[a|0],167)}function FD(a){a=a|0;return J[a+40>>2]<<2}function EB(a){a=a|0;Bf(!K[1040232]);Aj()}function CL(a){a=a|0;return Q(Q(2.03125))}function wx(a){a=a|0;cj(a,1054744,14145)}function tx(a){a=a|0;cj(a,1054752,14093)}function rx(a){a=a|0;cj(a,1054756,14126)}function ht(a,b){J[450186]=41088;gt(a,b)}function gF(a,b){a=a|0;b=b|0;od(b,27737)}function YE(a,b){a=a|0;b=b|0;od(b,27176)}function SE(a,b){a=a|0;b=b|0;od(b,27376)}function Qu(a,b){a=a|0;b=b|0;ge(1082044)}function QE(a,b){a=a|0;b=b|0;od(b,27153)}function QB(a){a=a|0;return K[J[203292]]}function Ml(a){Cd(a+324|0);I[a+328>>1]=0}function Gx(a){a=a|0;cj(a,1054748,14112)}function FF(a,b){a=a|0;b=b|0;ge(1856928)}function DN(a,b){a=a|0;b=b|0;hu(a,33780)}function CN(a,b){a=a|0;b=b|0;hu(a,33788)}function kL(a){a=a|0;return Q(Q(1.375))}function jp(a){Yb(a<<14&16384|a<<7&256)}function jo(){qd(J[266950]);J[266950]=0}function eB(a){a=a|0;return yp(a,184)|0}function bg(a){de(J[(a<<2)+1832644>>2])}function Yw(){return K[J[207101]+469|0]}function Uw(){return K[J[207101]+468|0]}function Sw(){return K[J[207101]+492|0]}function Rn(){return K[J[207101]+470|0]}function BL(a){a=a|0;return Q(Q(1.625))}function $w(){return K[J[207101]+493|0]}function xd(a,b,c,d){Tg(b,c,d);zi(a,b)}function wF(a,b){a=a|0;b=b|0;Oi(41752)}function vx(a){a=a|0;$e(a,N[263686],1)}function sx(a){a=a|0;$e(a,N[263688],1)}function qx(a){a=a|0;$e(a,N[263689],1)}function ky(a){a=a|0;$e(a,N[464852],2)}function kt(a,b){a=a|0;b=Q(b);return 0}function bv(a){a=a|0;Be(a);Ed(a+792|0)}function ay(a){a=a|0;$e(a,N[464853],2)}function _K(a){a=a|0;return Q(Q(1.25))}function Zu(a){a=a|0;_d(1043976,a,511)}function Yq(){H[1869220]=0;Nd(1048136)}function XI(a,b){a=a|0;b=Q(b);return 1}function XC(){He(1050996,1001,0,51152)}function VD(a){a=a|0;kh(a+112|0);zr(a)}function Tf(a,b,c,d,e){Wg(a,b,c,d,e,0)}function QH(a){a=a|0;Ys(a);Xs(a);Zd(a)}function QF(a){a=a|0;Ed(a+540|0);Be(a)}function Ot(a){a=a|0;return Q(Q(.875))}function Kw(a){a=a|0;$e(a,N[203293],2)}function Jw(a){a=a|0;lf(13861,a);iu(a)}function Iu(a){a=a|0;_d(1043976,a,526)}function Hw(a){a=a|0;lf(13848,a);Hk(a)}function GK(a){a=a|0;return Q(Q(.375))}function Ex(a){a=a|0;$e(a,N[263687],1)}function BM(a){a=a|0;_d(1041636,a,551)}function yM(a){a=a|0;Be(a);Cd(a+52|0)}function oM(a){a=a|0;Ed(a+56|0);Be(a)}function mj(a){return qe(1,J[a+8>>2])}function lF(a){a=a|0;Ed(a+44|0);Be(a)}function eL(a){a=a|0;return Q(Q(.75))}function cn(a,b){a=a|0;b=b|0;return 1}function ai(a,b){a=a|0;b=b|0;return 0}function aH(){Dd(1811232);Dd(1811236)}function TM(a){a=a|0;Ed(a+84|0);Be(a)}function FM(a){a=a|0;Ed(a+40|0);Be(a)}function Ck(a){a=a|0;Ed(a+36|0);Be(a)}function CM(a){a=a|0;H[a+7|0]=1;cu(a)}function xe(a,b,c,d){Wg(a,b,c,d,0,0)}function uN(a,b){a=a|0;b=b|0;wn(128)}function tN(a,b){a=a|0;b=b|0;wn(256)}function sN(a,b){a=a|0;b=b|0;wn(512)}function ke(a,b){I[a+4>>1]=0;ye(a,b)}function gl(a,b){de(J[a>>2]);rj(a,b)}function co(a){Jj(J[a>>2],L[a+4>>1])}function br(a){$q();ia();Bb(a|0);C()}function Xd(a,b){Re(a,b?40508:40516)}function LK(a){a=a|0;Ph(a,1562656,1)}function Kt(a){a=a|0;return Q(Q(.5))}function Jo(a,b,c){a=a|0;b=b|0;c=c|0}function Hh(a,b){Uj(a);Ur(a,b);Ff(a)}function DL(a){a=a|0;Ph(a,1531648,1)}function xi(a,b){if(Tr(a,b)){Ff(a)}}function kh(a){de(J[a>>2]);rj(a,-1)}function cK(){if(!K[1811800]){tt()}}function Lg(a,b){Dg(b,a+4|0,a+92|0)}function Ih(a,b){if(Ur(a,b)){Ff(a)}}function Bq(a,b){mn(b,a+56|0,a+4|0)}function AK(a){a=a|0;return Q(Q(1))}function wB(){Bf(!K[1040232]);Aj()}function lH(a){a=a|0;hi(J[263488])}function PM(a,b){a=a|0;b=b|0;eu(a)}function Hd(a,b,c){Wg(a,b,c,0,0,0)}function zF(a,b){a=a|0;b=b|0;tp()}function wy(){return J[16717]>0|0}function tw(){return!K[1054196]|0}function tF(a,b){a=a|0;b=b|0;wo()}function sH(a){a=a|0;H[1800751]=1}function lv(a,b){a=a|0;b=b|0;Xi()}function ar(){ha()|0;H[1056336]=0}function VA(a){a=a|0;H[1054053]=0}function UI(a){a=a|0;H[a+308|0]=1}function Qn(a,b){a=a|0;b=b|0;gh()}function EJ(a){a=a|0;yq(K[a+1|0])}function Cy(){return J[16718]>0|0}function Bn(a,b){a=a|0;b=b|0;Yq()}function uy(){return!J[263488]|0}function sI(a){a=a|0;_g(1793888)}function ni(a){return!(!a|a-1&a)}function kx(){return!K[825312]|0}function kA(a){a=a|0;Dd(1055376)}function fv(a){a=a|0;cg(a+908|0)}function eH(a){a=a|0;Dd(1801728)}function ZF(a){a=a|0;Ed(a+624|0)}function VM(a){a=a|0;J[264085]=0}function Ut(a){a=a|0;St(1531648)}function Rv(){je(780112,0,32768)}function RH(a){a=a|0;Ws(a);Be(a)}function PL(a){a=a|0;St(1562656)}function Ok(a,b,c){Nk(a,b,c,299)}function CB(a){a=a|0;Cd(1040256)}function Bg(a,b,c){Cg(a,b,c,0,0)}function Bf(a){H[1054292]=a;Fg()}function Af(a,b,c){Nk(a,b,c,133)}function yy(){return K[1054201]}function yx(){return K[1054740]}function xK(){wd(1563568,40428)}function xJ(a){a=a|0;sm(K[a|0])}function ww(){return K[1092886]}function rw(){return K[1054735]}function pw(){return K[1054743]}function nz(){vo();H[1067756]=1}function nw(){return K[1054732]}function mx(){return K[1054741]}function lw(){return K[1054733]}function iw(){return K[1054734]}function fw(){return K[1054200]}function ft(a){a=a|0;H[a+7|0]=1}function fE(a){a=a|0;return 116}function dw(){return K[1054199]}function cN(a){a=a|0;Od(6316,a)}function cH(){nd(1043196,0,945)}function bw(){return K[1054208]}function XD(a){a=a|0;return 960}function Ww(){return K[1053904]}function Vn(){return K[1054742]}function Tn(){return K[1054202]}function Rx(){return K[1067796]}function Lx(){return K[1054309]}function Hx(){return K[1054792]}function Fr(a){a=a|0;Cd(a+40|0)}function ED(a){a=a|0;kh(a+60|0)}function DD(a){a=a|0;Cd(a+60|0)}function BJ(a){a=a|0;Os(K[a|0])}function zw(){return J[203269]}function wm(){vi();Nd(1045276)}function vE(a){a=a|0;return 12}function qy(){return J[464861]}function pe(a,b){Vj(b);zi(a,b)}function oy(){return J[464859]}function ox(){return K[825313]}function my(){return J[464860]}function iy(){return J[464851]}function gy(){return J[464863]}function ge(a){if($k(a)){Po()}}function gK(a){a=Q(a);return 0}function ey(){return J[464867]}function eI(){nd(1043196,0,12)}function dx(){return K[813081]}function cy(){return J[464855]}function _x(){return J[464849]}function Xx(){return J[263488]}function Xn(){return K[813082]}function Tx(){return K[780072]}function Qw(){return J[203294]}function Px(){return K[828400]}function Pg(a){la(a|0,Fe(a)|0)}function PG(){I[905906]=0;Ym()}function Od(a,b){Cg(a,b,0,0,0)}function Nx(){return K[828401]}function Kj(a,b,c){fm(a,b,c,0)}function JA(){return J[263680]}function FG(a){a=a|0;Dd(66892)}function Dw(){return K[775860]}function Cx(){return J[263684]}function Bw(){return K[813080]}function Ax(){return K[814208]}function ol(a){a=a|0;return 1}function jz(){bd[J[266952]]()}function jt(a,b){a=a|0;b=Q(b)}function iz(){bd[J[266953]]()}function aj(a){md(a,1,2,0,25)}function Vx(){return J[12426]}function ND(a){a=a|0;return 8}function Kf(a){Gd(a+4|0,0,36)}function Js(a){a=a|0;return 0}function Iw(){return J[16718]}function Gw(){return J[16717]}function AE(a){a=a|0;return 4}function wo(){Sk(!J[266938])}function vf(a,b){fm(a,b,0,0)}function lB(){mo();Hp();Ip()}function je(a,b,c){Gd(a,b,c)}function ej(a,b){dj(a,b,299)}function _h(a,b){a=a|0;b=b|0}function Yj(a,b){Zj(a,b,0,0)}function RC(){return 1869780}function Mk(a,b){dj(a,b,133)}function Kd(a,b,c){Qd(a,b,c)}function Jj(a,b){la(a|0,b|0)}function qd(a){if(a){Fj(a)}}function Ve(a){$(34962,a|0)}function yH(a){a=a|0;ge(a)}function ug(a){qd(J[a>>2])}function ry(a){a=a|0;pm(a)}function py(a){a=a|0;rm(a)}function ny(a){a=a|0;qm(a)}function jy(a){a=a|0;tm(a)}function jD(){H[1056336]=1}function hy(a){a=a|0;om(a)}function fy(a){a=a|0;nm(a)}function dy(a){a=a|0;sm(a)}function bN(a){a=a|0;Dl(a)}function Wx(a){a=a|0;rp(a)}function $x(a){a=a|0;Pj(a)}function yn(a){a=a|0;Vq()}function tz(){J[265102]=0}function th(a){xj(a,se())}function te(a){Pf(a,16,1)}function rF(a){a=a|0;ks()}function nf(a){Pf(a,16,0)}function fB(){J[263425]=0}function dH(){Dd(1801728)}function ZG(){J[206299]=0}function Vy(a){a=a|0;Lk()}function Uy(a){a=a|0;Eg()}function Ro(a){Ve(a);kl()}function MA(a){a=a|0;ap()}function LC(){return $c|0}function LA(a){a=a|0;fl()}function KC(a){a=a|0;$c=a}function AB(a){a=a|0;Aj()}function $G(){J[452740]=0}function Je(a,b){Rf(a,b)}function nD(){tb();sb()}function dG(){Dd(66892)}function an(a){ne(a,0)}function KE(){return 1}function fi(a){a=a|0}function mK(){Bt(0)}function FB(){Zp(0)}function rJ(){lm()}function KA(){}
// EMSCRIPTEN_END_FUNCS
e=K;p(q);var bd=c([null,IC,LB,EN,hB,OA,gA,_h,_h,FK,ZL,rJ,FG,eI,dG,kD,HC,GC,zC,wC,qC,fC,XB,PB,OB,KB,GA,HA,No,Ko,tA,iA,fA,aA,Xz,Mz,Cz,rz,pz,mz,ho,eo,az,$y,Ry,Ln,Fx,Ln,ux,jx,_w,Pw,Fw,uw,jw,$v,Rv,Mv,Ev,vv,mv,ev,NL,EL,xL,pL,fL,XK,OK,EK,sK,rK,jD,ar,lK,gK,dK,XJ,MJ,WL,mI,dI,PH,IF,xF,hF,fH,ZG,OG,LG,EG,wG,oG,nG,mG,lG,kG,jG,iG,RF,iF,FE,Er,Cr,YD,QD,vr,FC,EC,Eq,DC,CC,BC,AC,uC,tC,sC,rC,sq,pC,oC,nC,mC,lC,kC,jC,iC,hC,gC,eC,dC,cC,pq,qD,yC,xC,_B,ZB,YB,WB,VB,UB,vC,bC,aC,$B,TB,SB,RB,QB,NB,MB,JB,IB,Zp,GB,HB,FB,CB,BB,AB,zB,Qp,EB,DB,yB,xB,wB,vB,uB,tB,sB,rB,qB,pB,oB,nB,mB,lB,kB,jB,Ip,Hp,iB,dB,_A,gB,fB,eB,cB,bB,aB,$A,bz,ZA,YA,XA,WA,VA,UA,ol,TA,SA,RA,ip,kl,QA,PA,MA,LA,Xo,JA,IA,NA,BA,AA,zA,yA,Ho,FA,xA,EA,wA,CA,vA,uA,sA,rA,qA,pA,nA,mA,lA,kA,oA,jA,dA,hA,ai,eA,cA,bA,pq,_z,Zz,Yz,Wz,Vz,Uz,Tz,Sz,Rz,Qz,Pz,Oz,Nz,Lz,Kz,Jz,Iz,Hz,Gz,Fz,yo,Ez,Dz,Bz,Az,zz,yz,xz,wz,vz,uz,$z,tz,sz,qz,oz,nz,kz,hz,gz,fz,ez,dz,fo,fo,no,cz,oo,mo,lo,ko,io,jo,lz,jz,iz,ai,Zy,Yy,Xy,Wy,Vy,Uy,_y,Ty,Sy,Oy,Ny,Jy,Ey,Qy,Py,Dy,Cy,Yn,Xn,By,Ay,zy,yy,xy,wy,Wn,Vn,Un,Tn,vy,uy,Sn,Rn,Qn,ty,Pn,sy,My,Ly,Ky,ry,qy,py,oy,ny,my,Gy,Fy,ly,ky,Iy,Hy,jy,iy,hy,gy,fy,ey,dy,cy,by,ay,$x,_x,Mn,Zx,Yx,Xx,Wx,Vx,Ux,Tx,Sx,Rx,Qx,Px,Ox,Nx,Mx,Lx,Kx,Jx,Ix,Hx,Gx,Ex,Dx,Cx,Bx,Ax,zx,yx,xx,Wn,Vn,wx,vx,tx,sx,rx,qx,px,ox,nx,mx,lx,kx,ix,hx,Sn,Rn,gx,fx,ex,dx,cx,bx,ax,$w,Zw,Yw,Xw,Ww,Vw,Uw,Tw,Sw,Rw,Qw,Jn,Ow,Nw,Mw,Lw,Kw,Jw,Iw,Hw,Gw,Ew,Dw,Cw,Bw,Un,Tn,Yn,Xn,Aw,zw,yw,xw,ww,vw,tw,sw,rw,qw,pw,ow,nw,mw,lw,kw,iw,In,hw,gw,fw,ew,dw,cw,bw,aw,_v,_h,Zv,Xv,Wv,Vv,Yv,jt,Uv,Tv,DA,Kv,Jo,cn,cn,Nv,Io,Sv,XI,Qv,Pv,Ov,Fv,Dv,Cv,Bv,Av,zv,qv,pv,Pn,ov,nv,lv,kv,jv,hv,gv,_u,Bn,Qu,Jv,Iv,Hv,Qn,Gv,yv,xv,wv,uv,tv,sv,rv,Ju,xu,wu,vu,uu,tu,Uu,DN,CN,uN,tN,sN,gu,oN,nN,fN,cN,$M,_M,WM,Mu,Mn,RM,PM,OM,CM,vM,uM,mM,lM,kM,jM,hM,gM,fM,bM,iv,fv,Gk,dv,Lv,cv,bv,av,$u,Zu,Gk,Yu,Be,Xu,Wu,Pu,fi,Ou,Nu,Ku,Iu,Hu,Gu,Ck,Fu,yu,su,yn,ru,qu,pu,ou,nu,mu,lu,ku,BN,AN,zN,yN,xN,Ck,wN,vN,rN,qN,pN,mN,lN,kN,jN,iN,hN,gN,aN,ZM,YM,QM,NM,yn,MM,LM,KM,JM,IM,HM,GM,FM,EM,DM,BM,AM,zM,xk,ai,ai,cu,yM,xM,wM,tM,sM,rM,qM,pM,oM,nM,iM,eM,dM,cM,aM,$L,Vu,Tu,Su,Ru,Lu,In,Eu,Du,Cu,Bu,Au,zu,eN,dN,bN,XM,VM,UM,TM,SM,fi,_L,YL,XL,VL,UL,TL,SL,KA,Ut,QL,Ut,PL,OL,ML,LL,KL,JL,IL,Tt,RL,HL,GL,FL,DL,CL,BL,AL,zL,yL,wL,vL,uL,tL,sL,rL,Pt,Ot,qL,oL,nL,mL,lL,kL,jL,iL,hL,gL,Nt,eL,dL,cL,bL,aL,$K,_K,ZK,YK,WK,VK,UK,TK,Lt,SK,RK,Pt,Kt,QK,PK,NK,Lt,MK,LK,KK,Ot,JK,IK,HK,GK,DK,CK,BK,AK,zK,yK,xK,wK,Nt,Kt,vK,uK,tK,qK,oK,nK,Bt,jK,iK,pK,mK,kK,hK,fK,eK,aK,fi,$J,_J,ZJ,YJ,WJ,VJ,UJ,TJ,SJ,RJ,QJ,PJ,OJ,NJ,LJ,KJ,JJ,IJ,HJ,GJ,FJ,EJ,DJ,CJ,BJ,AJ,zJ,yJ,xJ,wJ,vJ,uJ,tJ,sJ,qJ,pJ,oJ,nJ,mJ,lJ,kJ,jJ,iJ,hJ,gJ,fJ,eJ,dJ,cJ,bJ,aJ,$I,_I,ZI,cK,bK,UI,ft,FI,EI,DI,vI,uI,sI,rI,qI,pI,oI,ZH,YH,XH,WH,Vs,ft,NH,zH,yH,sH,nH,Bn,VI,TI,SI,RI,QI,PI,OI,NI,MI,LI,KI,JI,II,HI,GI,CI,BI,AI,xk,zI,yI,dn,kt,ct,xI,wI,tI,jt,nI,lI,kI,jI,iI,hI,gI,fI,cI,bI,aI,$H,_H,VH,UH,TH,SH,RH,QH,OH,MH,LH,KH,JH,IH,HH,GH,FH,EH,DH,CH,BH,AH,Us,xH,Ss,wH,YI,WI,vH,Ck,uH,tH,rH,qH,pH,oH,mH,lH,kH,jH,iH,hH,eH,gH,dH,bH,cH,aH,$G,_h,YG,XG,WG,VG,UG,TG,SG,RG,QG,_G,PG,NG,MG,Js,Is,Is,KG,Hs,JG,Hs,IG,HG,GG,DG,CG,BG,AG,Fs,Es,zG,yG,xG,Fs,Es,vG,uG,tG,sG,rG,qG,pG,hG,Pm,ol,gG,eG,ls,cG,fG,bG,aG,$F,WF,hs,VF,UF,gs,LF,JF,FF,rF,gs,_F,ZF,YF,XF,TF,SF,QF,PF,GF,EF,DF,sF,qF,pF,oF,nF,mF,lF,kF,OF,NF,MF,KF,HF,CF,BF,AF,zF,hs,yF,wF,vF,uF,tF,jF,NE,ME,LE,KE,JE,IE,HE,GE,EE,Fr,DE,xk,Jo,kt,dn,Io,dn,CE,BE,AE,zE,Fr,yE,xE,wE,vE,uE,fi,_f,tE,sE,rE,qE,pE,oE,nE,mE,lE,kE,jE,iE,hE,gE,fE,fi,eE,dE,cE,bE,aE,$D,_D,ZD,XD,WD,gF,fF,eF,dF,cF,xk,bF,aF,$E,_E,ZE,YE,_h,XE,WE,VE,UE,TE,SE,RE,cn,QE,PE,OE,VD,UD,TD,SD,RD,PD,OD,ND,MD,LD,xr,KD,JD,ID,HD,GD,FD,ED,DD,CD,BD,AD,zD,yD,vi,xD,ai,vD,wD,uD,lD,iD,hD,gD,Zq,fD,eD,dD,cD,bD,aD,$C,_C,ZC,YC,Zq,SC,QC,PC,OC,NC,Js,MC]);function cd(){return G.byteLength/65536|0}function hd(id){id=id|0;var dd=cd()|0;var ed=dd+id|0;if(dd<ed&&ed<65536){var fd=new ArrayBuffer(P(ed,65536));var gd=new Int8Array(fd);gd.set(H);H=new Int8Array(fd);I=new Int16Array(fd);J=new Int32Array(fd);K=new Uint8Array(fd);L=new Uint16Array(fd);M=new Uint32Array(fd);N=new Float32Array(fd);O=new Float64Array(fd);G=fd;F.buffer=G;e=K}return dd}return{"dc":ju,"ec":bd,"fc":tD,"gc":sD,"hc":xh,"ic":rD,"jc":pD,"kc":oD,"lc":nD,"mc":mD,"nc":XC,"oc":WC,"pc":VC,"qc":UC,"rc":TC,"sc":RC,"tc":LC,"uc":KC,"vc":JC}}return jd(kd)}
// EMSCRIPTEN_END_ASM


)(b);
}, instantiate:function(a, b) {
  return {then:function(c) {
    var d = new WebAssembly.Module(a);
    c({instance:new WebAssembly.Instance(d, b)});
  }};
}, RuntimeError:Error};
wasmBinary = [];
"object" != typeof WebAssembly && abort("no native wasm support detected");
function intArrayFromBase64(a) {
  a = atob(a);
  for (var b = new Uint8Array(a.length), c = 0; c < a.length; ++c) {
    b[c] = a.charCodeAt(c);
  }
  return b;
}
function tryParseAsDataURI(a) {
  if (isDataURI(a)) {
    return intArrayFromBase64(a.slice(dataURIPrefix.length));
  }
}
var wasmMemory, ABORT = !1, EXITSTATUS;
function assert(a, b) {
  a || abort(b);
}
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
function updateMemoryViews() {
  var a = wasmMemory.buffer;
  Module.HEAP8 = HEAP8 = new Int8Array(a);
  Module.HEAP16 = HEAP16 = new Int16Array(a);
  Module.HEAPU8 = HEAPU8 = new Uint8Array(a);
  Module.HEAPU16 = HEAPU16 = new Uint16Array(a);
  Module.HEAP32 = HEAP32 = new Int32Array(a);
  Module.HEAPU32 = HEAPU32 = new Uint32Array(a);
  Module.HEAPF32 = HEAPF32 = new Float32Array(a);
  Module.HEAPF64 = HEAPF64 = new Float64Array(a);
}
var INITIAL_MEMORY = Module.INITIAL_MEMORY || 67108864;
wasmMemory = Module.wasmMemory ? Module.wasmMemory : new WebAssembly.Memory({initial:INITIAL_MEMORY / 65536, maximum:32768});
updateMemoryViews();
INITIAL_MEMORY = wasmMemory.buffer.byteLength;
var __ATPRERUN__ = [], __ATINIT__ = [], __ATMAIN__ = [], __ATEXIT__ = [], __ATPOSTRUN__ = [], runtimeInitialized = !1;
function preRun() {
  if (Module.preRun) {
    for ("function" == typeof Module.preRun && (Module.preRun = [Module.preRun]); Module.preRun.length;) {
      addOnPreRun(Module.preRun.shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function initRuntime() {
  runtimeInitialized = !0;
  Module.noFSInit || FS.init.initialized || FS.init();
  FS.ignorePermissions = !1;
  TTY.init();
  callRuntimeCallbacks(__ATINIT__);
}
function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}
function postRun() {
  if (Module.postRun) {
    for ("function" == typeof Module.postRun && (Module.postRun = [Module.postRun]); Module.postRun.length;) {
      addOnPostRun(Module.postRun.shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(a) {
  __ATPRERUN__.unshift(a);
}
function addOnInit(a) {
  __ATINIT__.unshift(a);
}
function addOnPostRun(a) {
  __ATPOSTRUN__.unshift(a);
}
Math.imul || (Math.imul = function(a, b) {
  var c = a & 65535, d = b & 65535;
  return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16) | 0;
});
if (!Math.fround) {
  var froundBuffer = new Float32Array(1);
  Math.fround = function(a) {
    froundBuffer[0] = a;
    return froundBuffer[0];
  };
}
Math.clz32 || (Math.clz32 = function(a) {
  var b = 32, c = a >> 16;
  c && (b -= 16, a = c);
  if (c = a >> 8) {
    b -= 8, a = c;
  }
  if (c = a >> 4) {
    b -= 4, a = c;
  }
  if (c = a >> 2) {
    b -= 2, a = c;
  }
  return a >> 1 ? b - 2 : b - a;
});
Math.trunc || (Math.trunc = function(a) {
  return 0 > a ? Math.ceil(a) : Math.floor(a);
});
var runDependencies = 0, runDependencyWatcher = null, dependenciesFulfilled = null;
function getUniqueRunDependency(a) {
  return a;
}
function addRunDependency(a) {
  runDependencies++;
  Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies);
}
function removeRunDependency(a) {
  runDependencies--;
  Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies);
  0 == runDependencies && (null !== runDependencyWatcher && (clearInterval(runDependencyWatcher), runDependencyWatcher = null), dependenciesFulfilled && (a = dependenciesFulfilled, dependenciesFulfilled = null, a()));
}
function abort(a) {
  if (Module.onAbort) {
    Module.onAbort(a);
  }
  a = "Aborted(" + a + ")";
  err(a);
  ABORT = !0;
  EXITSTATUS = 1;
  throw new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
}
var dataURIPrefix = "data:application/octet-stream;base64,", isDataURI = function(a) {
  return a.startsWith(dataURIPrefix);
}, wasmBinaryFile;
wasmBinaryFile = "<<< WASM_BINARY_FILE >>>";
isDataURI(wasmBinaryFile) || (wasmBinaryFile = locateFile(wasmBinaryFile));
function getBinarySync(a) {
  if (a == wasmBinaryFile && wasmBinary) {
    return new Uint8Array(wasmBinary);
  }
  var b = tryParseAsDataURI(a);
  if (b) {
    return b;
  }
  if (readBinary) {
    return readBinary(a);
  }
  throw "both async and sync fetching of the wasm failed";
}
function getBinaryPromise(a) {
  return Promise.resolve().then(function() {
    return getBinarySync(a);
  });
}
function instantiateArrayBuffer(a, b, c) {
  return getBinaryPromise(a).then(function(d) {
    return WebAssembly.instantiate(d, b);
  }).then(function(d) {
    return d;
  }).then(c, function(d) {
    err("failed to asynchronously prepare wasm: " + d);
    abort(d);
  });
}
function instantiateAsync(a, b, c, d) {
  return instantiateArrayBuffer(b, c, d);
}
function createWasm() {
  function a(c, d) {
    wasmExports = c.exports;
    wasmTable = wasmExports.ec;
    addOnInit(wasmExports.dc);
    removeRunDependency("wasm-instantiate");
    return wasmExports;
  }
  var b = {a:wasmImports};
  addRunDependency("wasm-instantiate");
  if (Module.instantiateWasm) {
    try {
      return Module.instantiateWasm(b, a);
    } catch (c) {
      return err("Module.instantiateWasm callback failed with error: " + c), !1;
    }
  }
  instantiateAsync(wasmBinary, wasmBinaryFile, b, function(c) {
    a(c.instance);
  });
  return {};
}
var tempDouble, tempI64;
function ExitStatus(a) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + a + ")";
  this.status = a;
}
var callRuntimeCallbacks = function(a) {
  for (; 0 < a.length;) {
    a.shift()(Module);
  }
}, noExitRuntime = Module.noExitRuntime || !0;
function _CC_gpu_getRenderer(a, b) {
  var c = GLctx.getExtension("WEBGL_debug_renderer_info");
  c = c ? GLctx.getParameter(c.UNMASKED_RENDERER_WEBGL) : "";
  stringToUTF8(c, a, b);
}
var PATH = {isAbs:function(a) {
  return "/" === a.charAt(0);
}, splitPath:function(a) {
  return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(a).slice(1);
}, normalizeArray:function(a, b) {
  for (var c = 0, d = a.length - 1; 0 <= d; d--) {
    var e = a[d];
    "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--);
  }
  if (b) {
    for (; c; c--) {
      a.unshift("..");
    }
  }
  return a;
}, normalize:function(a) {
  var b = PATH.isAbs(a), c = "/" === a.substr(-1);
  (a = PATH.normalizeArray(a.split("/").filter(function(d) {
    return !!d;
  }), !b).join("/")) || b || (a = ".");
  a && c && (a += "/");
  return (b ? "/" : "") + a;
}, dirname:function(a) {
  var b = PATH.splitPath(a);
  a = b[0];
  b = b[1];
  if (!a && !b) {
    return ".";
  }
  b && (b = b.substr(0, b.length - 1));
  return a + b;
}, basename:function(a) {
  if ("/" === a) {
    return "/";
  }
  a = PATH.normalize(a);
  a = a.replace(/\/$/, "");
  var b = a.lastIndexOf("/");
  return -1 === b ? a : a.substr(b + 1);
}, join:function() {
  var a = Array.prototype.slice.call(arguments);
  return PATH.normalize(a.join("/"));
}, join2:function(a, b) {
  return PATH.normalize(a + "/" + b);
}}, initRandomFill = function() {
  if ("object" == typeof crypto && "function" == typeof crypto.getRandomValues) {
    return function(a) {
      return crypto.getRandomValues(a);
    };
  }
  abort("initRandomDevice");
}, randomFill = function(a) {
  return (randomFill = initRandomFill())(a);
}, PATH_FS = {resolve:function() {
  for (var a = "", b = !1, c = arguments.length - 1; -1 <= c && !b; c--) {
    b = 0 <= c ? arguments[c] : FS.cwd();
    if ("string" != typeof b) {
      throw new TypeError("Arguments to path.resolve must be strings");
    }
    if (!b) {
      return "";
    }
    a = b + "/" + a;
    b = PATH.isAbs(b);
  }
  a = PATH.normalizeArray(a.split("/").filter(function(d) {
    return !!d;
  }), !b).join("/");
  return (b ? "/" : "") + a || ".";
}, relative:function(a, b) {
  function c(g) {
    for (var h = 0; h < g.length && "" === g[h]; h++) {
    }
    for (var l = g.length - 1; 0 <= l && "" === g[l]; l--) {
    }
    return h > l ? [] : g.slice(h, l - h + 1);
  }
  a = PATH_FS.resolve(a).substr(1);
  b = PATH_FS.resolve(b).substr(1);
  a = c(a.split("/"));
  b = c(b.split("/"));
  for (var d = Math.min(a.length, b.length), e = d, f = 0; f < d; f++) {
    if (a[f] !== b[f]) {
      e = f;
      break;
    }
  }
  d = [];
  for (f = e; f < a.length; f++) {
    d.push("..");
  }
  d = d.concat(b.slice(e));
  return d.join("/");
}}, UTF8Decoder = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0, UTF8ArrayToString = function(a, b, c) {
  var d = b + c;
  for (c = b; a[c] && !(c >= d);) {
    ++c;
  }
  if (16 < c - b && a.buffer && UTF8Decoder) {
    return UTF8Decoder.decode(a.subarray(b, c));
  }
  for (d = ""; b < c;) {
    var e = a[b++];
    if (e & 128) {
      var f = a[b++] & 63;
      if (192 == (e & 224)) {
        d += String.fromCharCode((e & 31) << 6 | f);
      } else {
        var g = a[b++] & 63;
        e = 224 == (e & 240) ? (e & 15) << 12 | f << 6 | g : (e & 7) << 18 | f << 12 | g << 6 | a[b++] & 63;
        65536 > e ? d += String.fromCharCode(e) : (e -= 65536, d += String.fromCharCode(55296 | e >> 10, 56320 | e & 1023));
      }
    } else {
      d += String.fromCharCode(e);
    }
  }
  return d;
}, FS_stdin_getChar_buffer = [], lengthBytesUTF8 = function(a) {
  for (var b = 0, c = 0; c < a.length; ++c) {
    var d = a.charCodeAt(c);
    127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
  }
  return b;
}, stringToUTF8Array = function(a, b, c, d) {
  if (!(0 < d)) {
    return 0;
  }
  var e = c;
  d = c + d - 1;
  for (var f = 0; f < a.length; ++f) {
    var g = a.charCodeAt(f);
    if (55296 <= g && 57343 >= g) {
      var h = a.charCodeAt(++f);
      g = 65536 + ((g & 1023) << 10) | h & 1023;
    }
    if (127 >= g) {
      if (c >= d) {
        break;
      }
      b[c++] = g;
    } else {
      if (2047 >= g) {
        if (c + 1 >= d) {
          break;
        }
        b[c++] = 192 | g >> 6;
      } else {
        if (65535 >= g) {
          if (c + 2 >= d) {
            break;
          }
          b[c++] = 224 | g >> 12;
        } else {
          if (c + 3 >= d) {
            break;
          }
          b[c++] = 240 | g >> 18;
          b[c++] = 128 | g >> 12 & 63;
        }
        b[c++] = 128 | g >> 6 & 63;
      }
      b[c++] = 128 | g & 63;
    }
  }
  b[c] = 0;
  return c - e;
};
function intArrayFromString(a, b, c) {
  c = 0 < c ? c : lengthBytesUTF8(a) + 1;
  c = Array(c);
  a = stringToUTF8Array(a, c, 0, c.length);
  b && (c.length = a);
  return c;
}
var FS_stdin_getChar = function() {
  if (!FS_stdin_getChar_buffer.length) {
    var a = null;
    "undefined" != typeof window && "function" == typeof window.prompt ? (a = window.prompt("Input: "), null !== a && (a += "\n")) : "function" == typeof readline && (a = readline(), null !== a && (a += "\n"));
    if (!a) {
      return null;
    }
    FS_stdin_getChar_buffer = intArrayFromString(a, !0);
  }
  return FS_stdin_getChar_buffer.shift();
}, TTY = {ttys:[], init:function() {
}, shutdown:function() {
}, register:function(a, b) {
  TTY.ttys[a] = {input:[], output:[], ops:b};
  FS.registerDevice(a, TTY.stream_ops);
}, stream_ops:{open:function(a) {
  var b = TTY.ttys[a.node.rdev];
  if (!b) {
    throw new FS.ErrnoError(43);
  }
  a.tty = b;
  a.seekable = !1;
}, close:function(a) {
  a.tty.ops.fsync(a.tty);
}, fsync:function(a) {
  a.tty.ops.fsync(a.tty);
}, read:function(a, b, c, d, e) {
  if (!a.tty || !a.tty.ops.get_char) {
    throw new FS.ErrnoError(60);
  }
  for (var f = e = 0; f < d; f++) {
    try {
      var g = a.tty.ops.get_char(a.tty);
    } catch (h) {
      throw new FS.ErrnoError(29);
    }
    if (void 0 === g && 0 === e) {
      throw new FS.ErrnoError(6);
    }
    if (null === g || void 0 === g) {
      break;
    }
    e++;
    b[c + f] = g;
  }
  e && (a.node.timestamp = Date.now());
  return e;
}, write:function(a, b, c, d, e) {
  if (!a.tty || !a.tty.ops.put_char) {
    throw new FS.ErrnoError(60);
  }
  try {
    for (e = 0; e < d; e++) {
      a.tty.ops.put_char(a.tty, b[c + e]);
    }
  } catch (f) {
    throw new FS.ErrnoError(29);
  }
  d && (a.node.timestamp = Date.now());
  return e;
}}, default_tty_ops:{get_char:function(a) {
  return FS_stdin_getChar();
}, put_char:function(a, b) {
  null === b || 10 === b ? (out(UTF8ArrayToString(a.output, 0)), a.output = []) : 0 != b && a.output.push(b);
}, fsync:function(a) {
  a.output && 0 < a.output.length && (out(UTF8ArrayToString(a.output, 0)), a.output = []);
}, ioctl_tcgets:function(a) {
  return {c_iflag:25856, c_oflag:5, c_cflag:191, c_lflag:35387, c_cc:[3, 28, 127, 21, 4, 0, 1, 0, 17, 19, 26, 0, 18, 15, 23, 22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]};
}, ioctl_tcsets:function(a, b, c) {
  return 0;
}, ioctl_tiocgwinsz:function(a) {
  return [24, 80];
}}, default_tty1_ops:{put_char:function(a, b) {
  null === b || 10 === b ? (err(UTF8ArrayToString(a.output, 0)), a.output = []) : 0 != b && a.output.push(b);
}, fsync:function(a) {
  a.output && 0 < a.output.length && (err(UTF8ArrayToString(a.output, 0)), a.output = []);
}}}, mmapAlloc = function(a) {
  abort();
}, MEMFS = {ops_table:null, mount:function(a) {
  return MEMFS.createNode(null, "/", 16895, 0);
}, createNode:function(a, b, c, d) {
  if (FS.isBlkdev(c) || FS.isFIFO(c)) {
    throw new FS.ErrnoError(63);
  }
  MEMFS.ops_table || (MEMFS.ops_table = {dir:{node:{getattr:MEMFS.node_ops.getattr, setattr:MEMFS.node_ops.setattr, lookup:MEMFS.node_ops.lookup, mknod:MEMFS.node_ops.mknod, rename:MEMFS.node_ops.rename, unlink:MEMFS.node_ops.unlink, rmdir:MEMFS.node_ops.rmdir, readdir:MEMFS.node_ops.readdir, symlink:MEMFS.node_ops.symlink}, stream:{llseek:MEMFS.stream_ops.llseek}}, file:{node:{getattr:MEMFS.node_ops.getattr, setattr:MEMFS.node_ops.setattr}, stream:{llseek:MEMFS.stream_ops.llseek, read:MEMFS.stream_ops.read, 
  write:MEMFS.stream_ops.write, allocate:MEMFS.stream_ops.allocate, mmap:MEMFS.stream_ops.mmap, msync:MEMFS.stream_ops.msync}}, link:{node:{getattr:MEMFS.node_ops.getattr, setattr:MEMFS.node_ops.setattr, readlink:MEMFS.node_ops.readlink}, stream:{}}, chrdev:{node:{getattr:MEMFS.node_ops.getattr, setattr:MEMFS.node_ops.setattr}, stream:FS.chrdev_stream_ops}});
  c = FS.createNode(a, b, c, d);
  FS.isDir(c.mode) ? (c.node_ops = MEMFS.ops_table.dir.node, c.stream_ops = MEMFS.ops_table.dir.stream, c.contents = {}) : FS.isFile(c.mode) ? (c.node_ops = MEMFS.ops_table.file.node, c.stream_ops = MEMFS.ops_table.file.stream, c.usedBytes = 0, c.contents = null) : FS.isLink(c.mode) ? (c.node_ops = MEMFS.ops_table.link.node, c.stream_ops = MEMFS.ops_table.link.stream) : FS.isChrdev(c.mode) && (c.node_ops = MEMFS.ops_table.chrdev.node, c.stream_ops = MEMFS.ops_table.chrdev.stream);
  c.timestamp = Date.now();
  a && (a.contents[b] = c, a.timestamp = c.timestamp);
  return c;
}, getFileDataAsTypedArray:function(a) {
  return a.contents ? a.contents.subarray ? a.contents.subarray(0, a.usedBytes) : new Uint8Array(a.contents) : new Uint8Array(0);
}, expandFileStorage:function(a, b) {
  var c = a.contents ? a.contents.length : 0;
  c >= b || (b = Math.max(b, c * (1048576 > c ? 2 : 1.125) >>> 0), 0 != c && (b = Math.max(b, 256)), c = a.contents, a.contents = new Uint8Array(b), 0 < a.usedBytes && a.contents.set(c.subarray(0, a.usedBytes), 0));
}, resizeFileStorage:function(a, b) {
  if (a.usedBytes != b) {
    if (0 == b) {
      a.contents = null, a.usedBytes = 0;
    } else {
      var c = a.contents;
      a.contents = new Uint8Array(b);
      c && a.contents.set(c.subarray(0, Math.min(b, a.usedBytes)));
      a.usedBytes = b;
    }
  }
}, node_ops:{getattr:function(a) {
  var b = {};
  b.dev = FS.isChrdev(a.mode) ? a.id : 1;
  b.ino = a.id;
  b.mode = a.mode;
  b.nlink = 1;
  b.uid = 0;
  b.gid = 0;
  b.rdev = a.rdev;
  FS.isDir(a.mode) ? b.size = 4096 : FS.isFile(a.mode) ? b.size = a.usedBytes : FS.isLink(a.mode) ? b.size = a.link.length : b.size = 0;
  b.atime = new Date(a.timestamp);
  b.mtime = new Date(a.timestamp);
  b.ctime = new Date(a.timestamp);
  b.blksize = 4096;
  b.blocks = Math.ceil(b.size / b.blksize);
  return b;
}, setattr:function(a, b) {
  void 0 !== b.mode && (a.mode = b.mode);
  void 0 !== b.timestamp && (a.timestamp = b.timestamp);
  void 0 !== b.size && MEMFS.resizeFileStorage(a, b.size);
}, lookup:function(a, b) {
  throw FS.genericErrors[44];
}, mknod:function(a, b, c, d) {
  return MEMFS.createNode(a, b, c, d);
}, rename:function(a, b, c) {
  if (FS.isDir(a.mode)) {
    try {
      var d = FS.lookupNode(b, c);
    } catch (f) {
    }
    if (d) {
      for (var e in d.contents) {
        throw new FS.ErrnoError(55);
      }
    }
  }
  delete a.parent.contents[a.name];
  a.parent.timestamp = Date.now();
  a.name = c;
  b.contents[c] = a;
  b.timestamp = a.parent.timestamp;
  a.parent = b;
}, unlink:function(a, b) {
  delete a.contents[b];
  a.timestamp = Date.now();
}, rmdir:function(a, b) {
  var c = FS.lookupNode(a, b), d;
  for (d in c.contents) {
    throw new FS.ErrnoError(55);
  }
  delete a.contents[b];
  a.timestamp = Date.now();
}, readdir:function(a) {
  var b = [".", ".."], c;
  for (c in a.contents) {
    a.contents.hasOwnProperty(c) && b.push(c);
  }
  return b;
}, symlink:function(a, b, c) {
  a = MEMFS.createNode(a, b, 41471, 0);
  a.link = c;
  return a;
}, readlink:function(a) {
  if (!FS.isLink(a.mode)) {
    throw new FS.ErrnoError(28);
  }
  return a.link;
}}, stream_ops:{read:function(a, b, c, d, e) {
  var f = a.node.contents;
  if (e >= a.node.usedBytes) {
    return 0;
  }
  a = Math.min(a.node.usedBytes - e, d);
  if (8 < a && f.subarray) {
    b.set(f.subarray(e, e + a), c);
  } else {
    for (d = 0; d < a; d++) {
      b[c + d] = f[e + d];
    }
  }
  return a;
}, write:function(a, b, c, d, e, f) {
  b.buffer === HEAP8.buffer && (f = !1);
  if (!d) {
    return 0;
  }
  a = a.node;
  a.timestamp = Date.now();
  if (b.subarray && (!a.contents || a.contents.subarray)) {
    if (f) {
      return a.contents = b.subarray(c, c + d), a.usedBytes = d;
    }
    if (0 === a.usedBytes && 0 === e) {
      return a.contents = b.slice(c, c + d), a.usedBytes = d;
    }
    if (e + d <= a.usedBytes) {
      return a.contents.set(b.subarray(c, c + d), e), d;
    }
  }
  MEMFS.expandFileStorage(a, e + d);
  if (a.contents.subarray && b.subarray) {
    a.contents.set(b.subarray(c, c + d), e);
  } else {
    for (f = 0; f < d; f++) {
      a.contents[e + f] = b[c + f];
    }
  }
  a.usedBytes = Math.max(a.usedBytes, e + d);
  return d;
}, llseek:function(a, b, c) {
  1 === c ? b += a.position : 2 === c && FS.isFile(a.node.mode) && (b += a.node.usedBytes);
  if (0 > b) {
    throw new FS.ErrnoError(28);
  }
  return b;
}, allocate:function(a, b, c) {
  MEMFS.expandFileStorage(a.node, b + c);
  a.node.usedBytes = Math.max(a.node.usedBytes, b + c);
}, mmap:function(a, b, c, d, e) {
  if (!FS.isFile(a.node.mode)) {
    throw new FS.ErrnoError(43);
  }
  a = a.node.contents;
  if (e & 2 || a.buffer !== HEAP8.buffer) {
    if (0 < c || c + b < a.length) {
      a = a.subarray ? a.subarray(c, c + b) : Array.prototype.slice.call(a, c, c + b);
    }
    c = !0;
    b = mmapAlloc(b);
    if (!b) {
      throw new FS.ErrnoError(48);
    }
    HEAP8.set(a, b);
  } else {
    c = !1, b = a.byteOffset;
  }
  return {ptr:b, allocated:c};
}, msync:function(a, b, c, d, e) {
  MEMFS.stream_ops.write(a, b, 0, d, c, !1);
  return 0;
}}}, asyncLoad = function(a, b, c, d) {
  var e = d ? "" : getUniqueRunDependency("al " + a);
  readAsync(a, function(f) {
    assert(f, 'Loading data file "' + a + '" failed (no arrayBuffer).');
    b(new Uint8Array(f));
    e && removeRunDependency(e);
  }, function(f) {
    if (c) {
      c();
    } else {
      throw 'Loading data file "' + a + '" failed.';
    }
  });
  e && addRunDependency(e);
}, FS_createDataFile = function(a, b, c, d, e, f) {
  FS.createDataFile(a, b, c, d, e, f);
}, preloadPlugins = Module.preloadPlugins || [], FS_handledByPreloadPlugin = function(a, b, c, d) {
  "undefined" != typeof Browser && Browser.init();
  var e = !1;
  preloadPlugins.forEach(function(f) {
    !e && f.canHandle(b) && (f.handle(a, b, c, d), e = !0);
  });
  return e;
}, FS_createPreloadedFile = function(a, b, c, d, e, f, g, h, l, k) {
  function m(q) {
    function r(t) {
      k && k();
      h || FS_createDataFile(a, b, t, d, e, l);
      f && f();
      removeRunDependency(p);
    }
    FS_handledByPreloadPlugin(q, n, r, function() {
      g && g();
      removeRunDependency(p);
    }) || r(q);
  }
  var n = b ? PATH_FS.resolve(PATH.join2(a, b)) : a, p = getUniqueRunDependency("cp " + n);
  addRunDependency(p);
  "string" == typeof c ? asyncLoad(c, function(q) {
    return m(q);
  }, g) : m(c);
}, FS_modeStringToFlags = function(a) {
  var b = {r:0, "r+":2, w:577, "w+":578, a:1089, "a+":1090}[a];
  if ("undefined" == typeof b) {
    throw Error("Unknown file open mode: " + a);
  }
  return b;
}, FS_getMode = function(a, b) {
  var c = 0;
  a && (c |= 365);
  b && (c |= 146);
  return c;
}, FS = {root:null, mounts:[], devices:{}, streams:[], nextInode:1, nameTable:null, currentPath:"/", initialized:!1, ignorePermissions:!0, ErrnoError:null, genericErrors:{}, filesystems:null, syncFSRequests:0, lookupPath:function(a, b) {
  b = void 0 === b ? {} : b;
  a = PATH_FS.resolve(a);
  if (!a) {
    return {path:"", node:null};
  }
  b = Object.assign({follow_mount:!0, recurse_count:0}, b);
  if (8 < b.recurse_count) {
    throw new FS.ErrnoError(32);
  }
  a = a.split("/").filter(function(g) {
    return !!g;
  });
  for (var c = FS.root, d = "/", e = 0; e < a.length; e++) {
    var f = e === a.length - 1;
    if (f && b.parent) {
      break;
    }
    c = FS.lookupNode(c, a[e]);
    d = PATH.join2(d, a[e]);
    FS.isMountpoint(c) && (!f || f && b.follow_mount) && (c = c.mounted.root);
    if (!f || b.follow) {
      for (f = 0; FS.isLink(c.mode);) {
        if (c = FS.readlink(d), d = PATH_FS.resolve(PATH.dirname(d), c), c = FS.lookupPath(d, {recurse_count:b.recurse_count + 1}).node, 40 < f++) {
          throw new FS.ErrnoError(32);
        }
      }
    }
  }
  return {path:d, node:c};
}, getPath:function(a) {
  for (var b;;) {
    if (FS.isRoot(a)) {
      return a = a.mount.mountpoint, b ? "/" !== a[a.length - 1] ? a + "/" + b : a + b : a;
    }
    b = b ? a.name + "/" + b : a.name;
    a = a.parent;
  }
}, hashName:function(a, b) {
  for (var c = 0, d = 0; d < b.length; d++) {
    c = (c << 5) - c + b.charCodeAt(d) | 0;
  }
  return (a + c >>> 0) % FS.nameTable.length;
}, hashAddNode:function(a) {
  var b = FS.hashName(a.parent.id, a.name);
  a.name_next = FS.nameTable[b];
  FS.nameTable[b] = a;
}, hashRemoveNode:function(a) {
  var b = FS.hashName(a.parent.id, a.name);
  if (FS.nameTable[b] === a) {
    FS.nameTable[b] = a.name_next;
  } else {
    for (b = FS.nameTable[b]; b;) {
      if (b.name_next === a) {
        b.name_next = a.name_next;
        break;
      }
      b = b.name_next;
    }
  }
}, lookupNode:function(a, b) {
  var c = FS.mayLookup(a);
  if (c) {
    throw new FS.ErrnoError(c, a);
  }
  c = FS.hashName(a.id, b);
  for (c = FS.nameTable[c]; c; c = c.name_next) {
    var d = c.name;
    if (c.parent.id === a.id && d === b) {
      return c;
    }
  }
  return FS.lookup(a, b);
}, createNode:function(a, b, c, d) {
  a = new FS.FSNode(a, b, c, d);
  FS.hashAddNode(a);
  return a;
}, destroyNode:function(a) {
  FS.hashRemoveNode(a);
}, isRoot:function(a) {
  return a === a.parent;
}, isMountpoint:function(a) {
  return !!a.mounted;
}, isFile:function(a) {
  return 32768 === (a & 61440);
}, isDir:function(a) {
  return 16384 === (a & 61440);
}, isLink:function(a) {
  return 40960 === (a & 61440);
}, isChrdev:function(a) {
  return 8192 === (a & 61440);
}, isBlkdev:function(a) {
  return 24576 === (a & 61440);
}, isFIFO:function(a) {
  return 4096 === (a & 61440);
}, isSocket:function(a) {
  return 49152 === (a & 49152);
}, flagsToPermissionString:function(a) {
  var b = ["r", "w", "rw"][a & 3];
  a & 512 && (b += "w");
  return b;
}, nodePermissions:function(a, b) {
  if (FS.ignorePermissions) {
    return 0;
  }
  if (!b.includes("r") || a.mode & 292) {
    if (b.includes("w") && !(a.mode & 146) || b.includes("x") && !(a.mode & 73)) {
      return 2;
    }
  } else {
    return 2;
  }
  return 0;
}, mayLookup:function(a) {
  var b = FS.nodePermissions(a, "x");
  return b ? b : a.node_ops.lookup ? 0 : 2;
}, mayCreate:function(a, b) {
  try {
    return FS.lookupNode(a, b), 20;
  } catch (c) {
  }
  return FS.nodePermissions(a, "wx");
}, mayDelete:function(a, b, c) {
  try {
    var d = FS.lookupNode(a, b);
  } catch (e) {
    return e.errno;
  }
  if (a = FS.nodePermissions(a, "wx")) {
    return a;
  }
  if (c) {
    if (!FS.isDir(d.mode)) {
      return 54;
    }
    if (FS.isRoot(d) || FS.getPath(d) === FS.cwd()) {
      return 10;
    }
  } else {
    if (FS.isDir(d.mode)) {
      return 31;
    }
  }
  return 0;
}, mayOpen:function(a, b) {
  return a ? FS.isLink(a.mode) ? 32 : FS.isDir(a.mode) && ("r" !== FS.flagsToPermissionString(b) || b & 512) ? 31 : FS.nodePermissions(a, FS.flagsToPermissionString(b)) : 44;
}, MAX_OPEN_FDS:4096, nextfd:function() {
  for (var a = 0; a <= FS.MAX_OPEN_FDS; a++) {
    if (!FS.streams[a]) {
      return a;
    }
  }
  throw new FS.ErrnoError(33);
}, getStreamChecked:function(a) {
  a = FS.getStream(a);
  if (!a) {
    throw new FS.ErrnoError(8);
  }
  return a;
}, getStream:function(a) {
  return FS.streams[a];
}, createStream:function(a, b) {
  b = void 0 === b ? -1 : b;
  FS.FSStream || (FS.FSStream = function() {
    this.shared = {};
  }, FS.FSStream.prototype = {}, Object.defineProperties(FS.FSStream.prototype, {object:{get:function() {
    return this.node;
  }, set:function(c) {
    this.node = c;
  }}, isRead:{get:function() {
    return 1 !== (this.flags & 2097155);
  }}, isWrite:{get:function() {
    return 0 !== (this.flags & 2097155);
  }}, isAppend:{get:function() {
    return this.flags & 1024;
  }}, flags:{get:function() {
    return this.shared.flags;
  }, set:function(c) {
    this.shared.flags = c;
  }}, position:{get:function() {
    return this.shared.position;
  }, set:function(c) {
    this.shared.position = c;
  }}}));
  a = Object.assign(new FS.FSStream(), a);
  -1 == b && (b = FS.nextfd());
  a.fd = b;
  return FS.streams[b] = a;
}, closeStream:function(a) {
  FS.streams[a] = null;
}, chrdev_stream_ops:{open:function(a) {
  var b = FS.getDevice(a.node.rdev);
  a.stream_ops = b.stream_ops;
  a.stream_ops.open && a.stream_ops.open(a);
}, llseek:function() {
  throw new FS.ErrnoError(70);
}}, major:function(a) {
  return a >> 8;
}, minor:function(a) {
  return a & 255;
}, makedev:function(a, b) {
  return a << 8 | b;
}, registerDevice:function(a, b) {
  FS.devices[a] = {stream_ops:b};
}, getDevice:function(a) {
  return FS.devices[a];
}, getMounts:function(a) {
  var b = [];
  for (a = [a]; a.length;) {
    var c = a.pop();
    b.push(c);
    a.push.apply(a, c.mounts);
  }
  return b;
}, syncfs:function(a, b) {
  function c(g) {
    FS.syncFSRequests--;
    return b(g);
  }
  function d(g) {
    if (g) {
      if (!d.errored) {
        return d.errored = !0, c(g);
      }
    } else {
      ++f >= e.length && c(null);
    }
  }
  "function" == typeof a && (b = a, a = !1);
  FS.syncFSRequests++;
  1 < FS.syncFSRequests && err("warning: " + FS.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
  var e = FS.getMounts(FS.root.mount), f = 0;
  e.forEach(function(g) {
    if (!g.type.syncfs) {
      return d(null);
    }
    g.type.syncfs(g, a, d);
  });
}, mount:function(a, b, c) {
  var d = "/" === c, e = !c;
  if (d && FS.root) {
    throw new FS.ErrnoError(10);
  }
  if (!d && !e) {
    var f = FS.lookupPath(c, {follow_mount:!1});
    c = f.path;
    f = f.node;
    if (FS.isMountpoint(f)) {
      throw new FS.ErrnoError(10);
    }
    if (!FS.isDir(f.mode)) {
      throw new FS.ErrnoError(54);
    }
  }
  b = {type:a, opts:b, mountpoint:c, mounts:[]};
  a = a.mount(b);
  a.mount = b;
  b.root = a;
  d ? FS.root = a : f && (f.mounted = b, f.mount && f.mount.mounts.push(b));
  return a;
}, unmount:function(a) {
  a = FS.lookupPath(a, {follow_mount:!1});
  if (!FS.isMountpoint(a.node)) {
    throw new FS.ErrnoError(28);
  }
  a = a.node;
  var b = a.mounted, c = FS.getMounts(b);
  Object.keys(FS.nameTable).forEach(function(d) {
    for (d = FS.nameTable[d]; d;) {
      var e = d.name_next;
      c.includes(d.mount) && FS.destroyNode(d);
      d = e;
    }
  });
  a.mounted = null;
  b = a.mount.mounts.indexOf(b);
  a.mount.mounts.splice(b, 1);
}, lookup:function(a, b) {
  return a.node_ops.lookup(a, b);
}, mknod:function(a, b, c) {
  var d = FS.lookupPath(a, {parent:!0}).node;
  a = PATH.basename(a);
  if (!a || "." === a || ".." === a) {
    throw new FS.ErrnoError(28);
  }
  var e = FS.mayCreate(d, a);
  if (e) {
    throw new FS.ErrnoError(e);
  }
  if (!d.node_ops.mknod) {
    throw new FS.ErrnoError(63);
  }
  return d.node_ops.mknod(d, a, b, c);
}, create:function(a, b) {
  return FS.mknod(a, (void 0 !== b ? b : 438) & 4095 | 32768, 0);
}, mkdir:function(a, b) {
  return FS.mknod(a, (void 0 !== b ? b : 511) & 1023 | 16384, 0);
}, mkdirTree:function(a, b) {
  a = a.split("/");
  for (var c = "", d = 0; d < a.length; ++d) {
    if (a[d]) {
      c += "/" + a[d];
      try {
        FS.mkdir(c, b);
      } catch (e) {
        if (20 != e.errno) {
          throw e;
        }
      }
    }
  }
}, mkdev:function(a, b, c) {
  "undefined" == typeof c && (c = b, b = 438);
  return FS.mknod(a, b | 8192, c);
}, symlink:function(a, b) {
  if (!PATH_FS.resolve(a)) {
    throw new FS.ErrnoError(44);
  }
  var c = FS.lookupPath(b, {parent:!0}).node;
  if (!c) {
    throw new FS.ErrnoError(44);
  }
  b = PATH.basename(b);
  var d = FS.mayCreate(c, b);
  if (d) {
    throw new FS.ErrnoError(d);
  }
  if (!c.node_ops.symlink) {
    throw new FS.ErrnoError(63);
  }
  return c.node_ops.symlink(c, b, a);
}, rename:function(a, b) {
  var c = PATH.dirname(a), d = PATH.dirname(b), e = PATH.basename(a), f = PATH.basename(b);
  var g = FS.lookupPath(a, {parent:!0});
  var h = g.node;
  g = FS.lookupPath(b, {parent:!0});
  g = g.node;
  if (!h || !g) {
    throw new FS.ErrnoError(44);
  }
  if (h.mount !== g.mount) {
    throw new FS.ErrnoError(75);
  }
  var l = FS.lookupNode(h, e);
  a = PATH_FS.relative(a, d);
  if ("." !== a.charAt(0)) {
    throw new FS.ErrnoError(28);
  }
  a = PATH_FS.relative(b, c);
  if ("." !== a.charAt(0)) {
    throw new FS.ErrnoError(55);
  }
  try {
    var k = FS.lookupNode(g, f);
  } catch (m) {
  }
  if (l !== k) {
    b = FS.isDir(l.mode);
    if (e = FS.mayDelete(h, e, b)) {
      throw new FS.ErrnoError(e);
    }
    if (e = k ? FS.mayDelete(g, f, b) : FS.mayCreate(g, f)) {
      throw new FS.ErrnoError(e);
    }
    if (!h.node_ops.rename) {
      throw new FS.ErrnoError(63);
    }
    if (FS.isMountpoint(l) || k && FS.isMountpoint(k)) {
      throw new FS.ErrnoError(10);
    }
    if (g !== h && (e = FS.nodePermissions(h, "w"))) {
      throw new FS.ErrnoError(e);
    }
    FS.hashRemoveNode(l);
    try {
      h.node_ops.rename(l, g, f);
    } catch (m) {
      throw m;
    } finally {
      FS.hashAddNode(l);
    }
  }
}, rmdir:function(a) {
  var b = FS.lookupPath(a, {parent:!0}).node;
  a = PATH.basename(a);
  var c = FS.lookupNode(b, a), d = FS.mayDelete(b, a, !0);
  if (d) {
    throw new FS.ErrnoError(d);
  }
  if (!b.node_ops.rmdir) {
    throw new FS.ErrnoError(63);
  }
  if (FS.isMountpoint(c)) {
    throw new FS.ErrnoError(10);
  }
  b.node_ops.rmdir(b, a);
  FS.destroyNode(c);
}, readdir:function(a) {
  a = FS.lookupPath(a, {follow:!0}).node;
  if (!a.node_ops.readdir) {
    throw new FS.ErrnoError(54);
  }
  return a.node_ops.readdir(a);
}, unlink:function(a) {
  var b = FS.lookupPath(a, {parent:!0}).node;
  if (!b) {
    throw new FS.ErrnoError(44);
  }
  a = PATH.basename(a);
  var c = FS.lookupNode(b, a), d = FS.mayDelete(b, a, !1);
  if (d) {
    throw new FS.ErrnoError(d);
  }
  if (!b.node_ops.unlink) {
    throw new FS.ErrnoError(63);
  }
  if (FS.isMountpoint(c)) {
    throw new FS.ErrnoError(10);
  }
  b.node_ops.unlink(b, a);
  FS.destroyNode(c);
}, readlink:function(a) {
  a = FS.lookupPath(a).node;
  if (!a) {
    throw new FS.ErrnoError(44);
  }
  if (!a.node_ops.readlink) {
    throw new FS.ErrnoError(28);
  }
  return PATH_FS.resolve(FS.getPath(a.parent), a.node_ops.readlink(a));
}, stat:function(a, b) {
  a = FS.lookupPath(a, {follow:!b}).node;
  if (!a) {
    throw new FS.ErrnoError(44);
  }
  if (!a.node_ops.getattr) {
    throw new FS.ErrnoError(63);
  }
  return a.node_ops.getattr(a);
}, lstat:function(a) {
  return FS.stat(a, !0);
}, chmod:function(a, b, c) {
  a = "string" == typeof a ? FS.lookupPath(a, {follow:!c}).node : a;
  if (!a.node_ops.setattr) {
    throw new FS.ErrnoError(63);
  }
  a.node_ops.setattr(a, {mode:b & 4095 | a.mode & -4096, timestamp:Date.now()});
}, lchmod:function(a, b) {
  FS.chmod(a, b, !0);
}, fchmod:function(a, b) {
  a = FS.getStreamChecked(a);
  FS.chmod(a.node, b);
}, chown:function(a, b, c, d) {
  a = "string" == typeof a ? FS.lookupPath(a, {follow:!d}).node : a;
  if (!a.node_ops.setattr) {
    throw new FS.ErrnoError(63);
  }
  a.node_ops.setattr(a, {timestamp:Date.now()});
}, lchown:function(a, b, c) {
  FS.chown(a, b, c, !0);
}, fchown:function(a, b, c) {
  a = FS.getStreamChecked(a);
  FS.chown(a.node, b, c);
}, truncate:function(a, b) {
  if (0 > b) {
    throw new FS.ErrnoError(28);
  }
  a = "string" == typeof a ? FS.lookupPath(a, {follow:!0}).node : a;
  if (!a.node_ops.setattr) {
    throw new FS.ErrnoError(63);
  }
  if (FS.isDir(a.mode)) {
    throw new FS.ErrnoError(31);
  }
  if (!FS.isFile(a.mode)) {
    throw new FS.ErrnoError(28);
  }
  var c = FS.nodePermissions(a, "w");
  if (c) {
    throw new FS.ErrnoError(c);
  }
  a.node_ops.setattr(a, {size:b, timestamp:Date.now()});
}, ftruncate:function(a, b) {
  a = FS.getStreamChecked(a);
  if (0 === (a.flags & 2097155)) {
    throw new FS.ErrnoError(28);
  }
  FS.truncate(a.node, b);
}, utime:function(a, b, c) {
  a = FS.lookupPath(a, {follow:!0}).node;
  a.node_ops.setattr(a, {timestamp:Math.max(b, c)});
}, open:function(a, b, c) {
  if ("" === a) {
    throw new FS.ErrnoError(44);
  }
  b = "string" == typeof b ? FS_modeStringToFlags(b) : b;
  c = b & 64 ? ("undefined" == typeof c ? 438 : c) & 4095 | 32768 : 0;
  if ("object" == typeof a) {
    var d = a;
  } else {
    a = PATH.normalize(a);
    try {
      d = FS.lookupPath(a, {follow:!(b & 131072)}).node;
    } catch (f) {
    }
  }
  var e = !1;
  if (b & 64) {
    if (d) {
      if (b & 128) {
        throw new FS.ErrnoError(20);
      }
    } else {
      d = FS.mknod(a, c, 0), e = !0;
    }
  }
  if (!d) {
    throw new FS.ErrnoError(44);
  }
  FS.isChrdev(d.mode) && (b &= -513);
  if (b & 65536 && !FS.isDir(d.mode)) {
    throw new FS.ErrnoError(54);
  }
  if (!e && (c = FS.mayOpen(d, b))) {
    throw new FS.ErrnoError(c);
  }
  b & 512 && !e && FS.truncate(d, 0);
  b &= -131713;
  d = FS.createStream({node:d, path:FS.getPath(d), flags:b, seekable:!0, position:0, stream_ops:d.stream_ops, ungotten:[], error:!1});
  d.stream_ops.open && d.stream_ops.open(d);
  !Module.logReadFiles || b & 1 || (FS.readFiles || (FS.readFiles = {}), a in FS.readFiles || (FS.readFiles[a] = 1));
  return d;
}, close:function(a) {
  if (FS.isClosed(a)) {
    throw new FS.ErrnoError(8);
  }
  a.getdents && (a.getdents = null);
  try {
    a.stream_ops.close && a.stream_ops.close(a);
  } catch (b) {
    throw b;
  } finally {
    FS.closeStream(a.fd);
  }
  a.fd = null;
}, isClosed:function(a) {
  return null === a.fd;
}, llseek:function(a, b, c) {
  if (FS.isClosed(a)) {
    throw new FS.ErrnoError(8);
  }
  if (!a.seekable || !a.stream_ops.llseek) {
    throw new FS.ErrnoError(70);
  }
  if (0 != c && 1 != c && 2 != c) {
    throw new FS.ErrnoError(28);
  }
  a.position = a.stream_ops.llseek(a, b, c);
  a.ungotten = [];
  return a.position;
}, read:function(a, b, c, d, e) {
  if (0 > d || 0 > e) {
    throw new FS.ErrnoError(28);
  }
  if (FS.isClosed(a)) {
    throw new FS.ErrnoError(8);
  }
  if (1 === (a.flags & 2097155)) {
    throw new FS.ErrnoError(8);
  }
  if (FS.isDir(a.node.mode)) {
    throw new FS.ErrnoError(31);
  }
  if (!a.stream_ops.read) {
    throw new FS.ErrnoError(28);
  }
  var f = "undefined" != typeof e;
  if (!f) {
    e = a.position;
  } else if (!a.seekable) {
    throw new FS.ErrnoError(70);
  }
  b = a.stream_ops.read(a, b, c, d, e);
  f || (a.position += b);
  return b;
}, write:function(a, b, c, d, e, f) {
  if (0 > d || 0 > e) {
    throw new FS.ErrnoError(28);
  }
  if (FS.isClosed(a)) {
    throw new FS.ErrnoError(8);
  }
  if (0 === (a.flags & 2097155)) {
    throw new FS.ErrnoError(8);
  }
  if (FS.isDir(a.node.mode)) {
    throw new FS.ErrnoError(31);
  }
  if (!a.stream_ops.write) {
    throw new FS.ErrnoError(28);
  }
  a.seekable && a.flags & 1024 && FS.llseek(a, 0, 2);
  var g = "undefined" != typeof e;
  if (!g) {
    e = a.position;
  } else if (!a.seekable) {
    throw new FS.ErrnoError(70);
  }
  b = a.stream_ops.write(a, b, c, d, e, f);
  g || (a.position += b);
  return b;
}, allocate:function(a, b, c) {
  if (FS.isClosed(a)) {
    throw new FS.ErrnoError(8);
  }
  if (0 > b || 0 >= c) {
    throw new FS.ErrnoError(28);
  }
  if (0 === (a.flags & 2097155)) {
    throw new FS.ErrnoError(8);
  }
  if (!FS.isFile(a.node.mode) && !FS.isDir(a.node.mode)) {
    throw new FS.ErrnoError(43);
  }
  if (!a.stream_ops.allocate) {
    throw new FS.ErrnoError(138);
  }
  a.stream_ops.allocate(a, b, c);
}, mmap:function(a, b, c, d, e) {
  if (0 !== (d & 2) && 0 === (e & 2) && 2 !== (a.flags & 2097155)) {
    throw new FS.ErrnoError(2);
  }
  if (1 === (a.flags & 2097155)) {
    throw new FS.ErrnoError(2);
  }
  if (!a.stream_ops.mmap) {
    throw new FS.ErrnoError(43);
  }
  return a.stream_ops.mmap(a, b, c, d, e);
}, msync:function(a, b, c, d, e) {
  return a.stream_ops.msync ? a.stream_ops.msync(a, b, c, d, e) : 0;
}, munmap:function(a) {
  return 0;
}, ioctl:function(a, b, c) {
  if (!a.stream_ops.ioctl) {
    throw new FS.ErrnoError(59);
  }
  return a.stream_ops.ioctl(a, b, c);
}, readFile:function(a, b) {
  b = void 0 === b ? {} : b;
  b.flags = b.flags || 0;
  b.encoding = b.encoding || "binary";
  if ("utf8" !== b.encoding && "binary" !== b.encoding) {
    throw Error('Invalid encoding type "' + b.encoding + '"');
  }
  var c, d = FS.open(a, b.flags);
  a = FS.stat(a).size;
  var e = new Uint8Array(a);
  FS.read(d, e, 0, a, 0);
  "utf8" === b.encoding ? c = UTF8ArrayToString(e, 0) : "binary" === b.encoding && (c = e);
  FS.close(d);
  return c;
}, writeFile:function(a, b, c) {
  c = void 0 === c ? {} : c;
  c.flags = c.flags || 577;
  a = FS.open(a, c.flags, c.mode);
  if ("string" == typeof b) {
    var d = new Uint8Array(lengthBytesUTF8(b) + 1);
    b = stringToUTF8Array(b, d, 0, d.length);
    FS.write(a, d, 0, b, void 0, c.canOwn);
  } else if (ArrayBuffer.isView(b)) {
    FS.write(a, b, 0, b.byteLength, void 0, c.canOwn);
  } else {
    throw Error("Unsupported data type");
  }
  FS.close(a);
}, cwd:function() {
  return FS.currentPath;
}, chdir:function(a) {
  a = FS.lookupPath(a, {follow:!0});
  if (null === a.node) {
    throw new FS.ErrnoError(44);
  }
  if (!FS.isDir(a.node.mode)) {
    throw new FS.ErrnoError(54);
  }
  var b = FS.nodePermissions(a.node, "x");
  if (b) {
    throw new FS.ErrnoError(b);
  }
  FS.currentPath = a.path;
}, createDefaultDirectories:function() {
  FS.mkdir("/tmp");
  FS.mkdir("/home");
  FS.mkdir("/home/web_user");
}, createDefaultDevices:function() {
  FS.mkdir("/dev");
  FS.registerDevice(FS.makedev(1, 3), {read:function() {
    return 0;
  }, write:function(d, e, f, g, h) {
    return g;
  }});
  FS.mkdev("/dev/null", FS.makedev(1, 3));
  TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
  TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
  FS.mkdev("/dev/tty", FS.makedev(5, 0));
  FS.mkdev("/dev/tty1", FS.makedev(6, 0));
  var a = new Uint8Array(1024), b = 0, c = function() {
    0 === b && (b = randomFill(a).byteLength);
    return a[--b];
  };
  FS.createDevice("/dev", "random", c);
  FS.createDevice("/dev", "urandom", c);
  FS.mkdir("/dev/shm");
  FS.mkdir("/dev/shm/tmp");
}, createSpecialDirectories:function() {
  FS.mkdir("/proc");
  var a = FS.mkdir("/proc/self");
  FS.mkdir("/proc/self/fd");
  FS.mount({mount:function() {
    var b = FS.createNode(a, "fd", 16895, 73);
    b.node_ops = {lookup:function(c, d) {
      var e = FS.getStreamChecked(+d);
      c = {parent:null, mount:{mountpoint:"fake"}, node_ops:{readlink:function() {
        return e.path;
      }}};
      return c.parent = c;
    }};
    return b;
  }}, {}, "/proc/self/fd");
}, createStandardStreams:function() {
  Module.stdin ? FS.createDevice("/dev", "stdin", Module.stdin) : FS.symlink("/dev/tty", "/dev/stdin");
  Module.stdout ? FS.createDevice("/dev", "stdout", null, Module.stdout) : FS.symlink("/dev/tty", "/dev/stdout");
  Module.stderr ? FS.createDevice("/dev", "stderr", null, Module.stderr) : FS.symlink("/dev/tty1", "/dev/stderr");
  FS.open("/dev/stdin", 0);
  FS.open("/dev/stdout", 1);
  FS.open("/dev/stderr", 1);
}, ensureErrnoError:function() {
  FS.ErrnoError || (FS.ErrnoError = function(a, b) {
    this.name = "ErrnoError";
    this.node = b;
    this.setErrno = function(c) {
      this.errno = c;
    };
    this.setErrno(a);
    this.message = "FS error";
  }, FS.ErrnoError.prototype = Error(), FS.ErrnoError.prototype.constructor = FS.ErrnoError, [44].forEach(function(a) {
    FS.genericErrors[a] = new FS.ErrnoError(a);
    FS.genericErrors[a].stack = "<generic error, no stack>";
  }));
}, staticInit:function() {
  FS.ensureErrnoError();
  FS.nameTable = Array(4096);
  FS.mount(MEMFS, {}, "/");
  FS.createDefaultDirectories();
  FS.createDefaultDevices();
  FS.createSpecialDirectories();
  FS.filesystems = {MEMFS:MEMFS};
}, init:function(a, b, c) {
  FS.init.initialized = !0;
  FS.ensureErrnoError();
  Module.stdin = a || Module.stdin;
  Module.stdout = b || Module.stdout;
  Module.stderr = c || Module.stderr;
  FS.createStandardStreams();
}, quit:function() {
  FS.init.initialized = !1;
  for (var a = 0; a < FS.streams.length; a++) {
    var b = FS.streams[a];
    b && FS.close(b);
  }
}, findObject:function(a, b) {
  a = FS.analyzePath(a, b);
  return a.exists ? a.object : null;
}, analyzePath:function(a, b) {
  try {
    var c = FS.lookupPath(a, {follow:!b});
    a = c.path;
  } catch (e) {
  }
  var d = {isRoot:!1, exists:!1, error:0, name:null, path:null, object:null, parentExists:!1, parentPath:null, parentObject:null};
  try {
    c = FS.lookupPath(a, {parent:!0}), d.parentExists = !0, d.parentPath = c.path, d.parentObject = c.node, d.name = PATH.basename(a), c = FS.lookupPath(a, {follow:!b}), d.exists = !0, d.path = c.path, d.object = c.node, d.name = c.node.name, d.isRoot = "/" === c.path;
  } catch (e) {
    d.error = e.errno;
  }
  return d;
}, createPath:function(a, b, c, d) {
  a = "string" == typeof a ? a : FS.getPath(a);
  for (b = b.split("/").reverse(); b.length;) {
    if (c = b.pop()) {
      var e = PATH.join2(a, c);
      try {
        FS.mkdir(e);
      } catch (f) {
      }
      a = e;
    }
  }
  return e;
}, createFile:function(a, b, c, d, e) {
  a = PATH.join2("string" == typeof a ? a : FS.getPath(a), b);
  d = FS_getMode(d, e);
  return FS.create(a, d);
}, createDataFile:function(a, b, c, d, e, f) {
  var g = b;
  a && (a = "string" == typeof a ? a : FS.getPath(a), g = b ? PATH.join2(a, b) : a);
  a = FS_getMode(d, e);
  g = FS.create(g, a);
  if (c) {
    if ("string" == typeof c) {
      b = Array(c.length);
      d = 0;
      for (e = c.length; d < e; ++d) {
        b[d] = c.charCodeAt(d);
      }
      c = b;
    }
    FS.chmod(g, a | 146);
    b = FS.open(g, 577);
    FS.write(b, c, 0, c.length, 0, f);
    FS.close(b);
    FS.chmod(g, a);
  }
}, createDevice:function(a, b, c, d) {
  a = PATH.join2("string" == typeof a ? a : FS.getPath(a), b);
  b = FS_getMode(!!c, !!d);
  FS.createDevice.major || (FS.createDevice.major = 64);
  var e = FS.makedev(FS.createDevice.major++, 0);
  FS.registerDevice(e, {open:function(f) {
    f.seekable = !1;
  }, close:function(f) {
    d && d.buffer && d.buffer.length && d(10);
  }, read:function(f, g, h, l, k) {
    for (var m = k = 0; m < l; m++) {
      try {
        var n = c();
      } catch (p) {
        throw new FS.ErrnoError(29);
      }
      if (void 0 === n && 0 === k) {
        throw new FS.ErrnoError(6);
      }
      if (null === n || void 0 === n) {
        break;
      }
      k++;
      g[h + m] = n;
    }
    k && (f.node.timestamp = Date.now());
    return k;
  }, write:function(f, g, h, l, k) {
    for (k = 0; k < l; k++) {
      try {
        d(g[h + k]);
      } catch (m) {
        throw new FS.ErrnoError(29);
      }
    }
    l && (f.node.timestamp = Date.now());
    return k;
  }});
  return FS.mkdev(a, b, e);
}, forceLoadFile:function(a) {
  if (a.isDevice || a.isFolder || a.link || a.contents) {
    return !0;
  }
  if ("undefined" != typeof XMLHttpRequest) {
    throw Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
  }
  if (read_) {
    try {
      a.contents = intArrayFromString(read_(a.url), !0), a.usedBytes = a.contents.length;
    } catch (b) {
      throw new FS.ErrnoError(29);
    }
  } else {
    throw Error("Cannot load without read() or XMLHttpRequest.");
  }
}, createLazyFile:function(a, b, c, d, e) {
  function f() {
    this.lengthKnown = !1;
    this.chunks = [];
  }
  function g(m, n, p, q, r) {
    m = m.node.contents;
    if (r >= m.length) {
      return 0;
    }
    q = Math.min(m.length - r, q);
    if (m.slice) {
      for (var t = 0; t < q; t++) {
        n[p + t] = m[r + t];
      }
    } else {
      for (t = 0; t < q; t++) {
        n[p + t] = m.get(r + t);
      }
    }
    return q;
  }
  f.prototype.get = function(m) {
    if (!(m > this.length - 1 || 0 > m)) {
      var n = m % this.chunkSize;
      return this.getter(m / this.chunkSize | 0)[n];
    }
  };
  f.prototype.setDataGetter = function(m) {
    this.getter = m;
  };
  f.prototype.cacheLength = function() {
    var m = new XMLHttpRequest();
    m.open("HEAD", c, !1);
    m.send(null);
    if (!(200 <= m.status && 300 > m.status || 304 === m.status)) {
      throw Error("Couldn't load " + c + ". Status: " + m.status);
    }
    var n = Number(m.getResponseHeader("Content-length")), p, q = (p = m.getResponseHeader("Accept-Ranges")) && "bytes" === p;
    m = (p = m.getResponseHeader("Content-Encoding")) && "gzip" === p;
    var r = 1048576;
    q || (r = n);
    var t = this;
    t.setDataGetter(function(w) {
      var v = w * r, x = (w + 1) * r - 1;
      x = Math.min(x, n - 1);
      if ("undefined" == typeof t.chunks[w]) {
        var y = t.chunks;
        if (v > x) {
          throw Error("invalid range (" + v + ", " + x + ") or no bytes requested!");
        }
        if (x > n - 1) {
          throw Error("only " + n + " bytes available! programmer error!");
        }
        var u = new XMLHttpRequest();
        u.open("GET", c, !1);
        n !== r && u.setRequestHeader("Range", "bytes=" + v + "-" + x);
        u.responseType = "arraybuffer";
        u.overrideMimeType && u.overrideMimeType("text/plain; charset=x-user-defined");
        u.send(null);
        if (!(200 <= u.status && 300 > u.status || 304 === u.status)) {
          throw Error("Couldn't load " + c + ". Status: " + u.status);
        }
        v = void 0 !== u.response ? new Uint8Array(u.response || []) : intArrayFromString(u.responseText || "", !0);
        y[w] = v;
      }
      if ("undefined" == typeof t.chunks[w]) {
        throw Error("doXHR failed!");
      }
      return t.chunks[w];
    });
    if (m || !n) {
      r = n = 1, r = n = this.getter(0).length, out("LazyFiles on gzip forces download of the whole file when length is accessed");
    }
    this._length = n;
    this._chunkSize = r;
    this.lengthKnown = !0;
  };
  if ("undefined" != typeof XMLHttpRequest) {
    if (!ENVIRONMENT_IS_WORKER) {
      throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
    }
    var h = new f();
    Object.defineProperties(h, {length:{get:function() {
      this.lengthKnown || this.cacheLength();
      return this._length;
    }}, chunkSize:{get:function() {
      this.lengthKnown || this.cacheLength();
      return this._chunkSize;
    }}});
    h = {isDevice:!1, contents:h};
  } else {
    h = {isDevice:!1, url:c};
  }
  var l = FS.createFile(a, b, h, d, e);
  h.contents ? l.contents = h.contents : h.url && (l.contents = null, l.url = h.url);
  Object.defineProperties(l, {usedBytes:{get:function() {
    return this.contents.length;
  }}});
  var k = {};
  Object.keys(l.stream_ops).forEach(function(m) {
    var n = l.stream_ops[m];
    k[m] = function() {
      FS.forceLoadFile(l);
      return n.apply(null, arguments);
    };
  });
  k.read = function(m, n, p, q, r) {
    FS.forceLoadFile(l);
    return g(m, n, p, q, r);
  };
  k.mmap = function(m, n, p, q, r) {
    FS.forceLoadFile(l);
    q = mmapAlloc(n);
    if (!q) {
      throw new FS.ErrnoError(48);
    }
    g(m, HEAP8, q, n, p);
    return {ptr:q, allocated:!0};
  };
  l.stream_ops = k;
  return l;
}}, UTF8ToString = function(a, b) {
  return a ? UTF8ArrayToString(HEAPU8, a, b) : "";
}, SYSCALLS = {DEFAULT_POLLMASK:5, calculateAt:function(a, b, c) {
  if (PATH.isAbs(b)) {
    return b;
  }
  a = -100 === a ? FS.cwd() : SYSCALLS.getStreamFromFD(a).path;
  if (0 == b.length) {
    if (!c) {
      throw new FS.ErrnoError(44);
    }
    return a;
  }
  return PATH.join2(a, b);
}, doStat:function(a, b, c) {
  try {
    var d = a(b);
  } catch (f) {
    if (f && f.node && PATH.normalize(b) !== PATH.normalize(FS.getPath(f.node))) {
      return -54;
    }
    throw f;
  }
  HEAP32[c >> 2] = d.dev;
  HEAP32[c + 4 >> 2] = d.mode;
  HEAPU32[c + 8 >> 2] = d.nlink;
  HEAP32[c + 12 >> 2] = d.uid;
  HEAP32[c + 16 >> 2] = d.gid;
  HEAP32[c + 20 >> 2] = d.rdev;
  tempI64 = [d.size >>> 0, (tempDouble = d.size, 1 <= +Math.abs(tempDouble) ? 0 < tempDouble ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
  HEAP32[c + 24 >> 2] = tempI64[0];
  HEAP32[c + 28 >> 2] = tempI64[1];
  HEAP32[c + 32 >> 2] = 4096;
  HEAP32[c + 36 >> 2] = d.blocks;
  a = d.atime.getTime();
  b = d.mtime.getTime();
  var e = d.ctime.getTime();
  tempI64 = [Math.floor(a / 1E3) >>> 0, (tempDouble = Math.floor(a / 1E3), 1 <= +Math.abs(tempDouble) ? 0 < tempDouble ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
  HEAP32[c + 40 >> 2] = tempI64[0];
  HEAP32[c + 44 >> 2] = tempI64[1];
  HEAPU32[c + 48 >> 2] = a % 1E3 * 1E3;
  tempI64 = [Math.floor(b / 1E3) >>> 0, (tempDouble = Math.floor(b / 1E3), 1 <= +Math.abs(tempDouble) ? 0 < tempDouble ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
  HEAP32[c + 56 >> 2] = tempI64[0];
  HEAP32[c + 60 >> 2] = tempI64[1];
  HEAPU32[c + 64 >> 2] = b % 1E3 * 1E3;
  tempI64 = [Math.floor(e / 1E3) >>> 0, (tempDouble = Math.floor(e / 1E3), 1 <= +Math.abs(tempDouble) ? 0 < tempDouble ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
  HEAP32[c + 72 >> 2] = tempI64[0];
  HEAP32[c + 76 >> 2] = tempI64[1];
  HEAPU32[c + 80 >> 2] = e % 1E3 * 1E3;
  tempI64 = [d.ino >>> 0, (tempDouble = d.ino, 1 <= +Math.abs(tempDouble) ? 0 < tempDouble ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
  HEAP32[c + 88 >> 2] = tempI64[0];
  HEAP32[c + 92 >> 2] = tempI64[1];
  return 0;
}, doMsync:function(a, b, c, d, e) {
  if (!FS.isFile(b.node.mode)) {
    throw new FS.ErrnoError(43);
  }
  if (d & 2) {
    return 0;
  }
  a = HEAPU8.slice(a, a + c);
  FS.msync(b, a, e, c, d);
}, varargs:void 0, get:function() {
  var a = HEAP32[+SYSCALLS.varargs >> 2];
  SYSCALLS.varargs += 4;
  return a;
}, getp:function() {
  return SYSCALLS.get();
}, getStr:function(a) {
  return UTF8ToString(a);
}, getStreamFromFD:function(a) {
  return FS.getStreamChecked(a);
}};
function ___syscall_dup3(a, b, c) {
  try {
    var d = SYSCALLS.getStreamFromFD(a);
    if (d.fd === b) {
      return -28;
    }
    var e = FS.getStream(b);
    e && FS.close(e);
    return FS.createStream(d, b).fd;
  } catch (f) {
    if ("undefined" == typeof FS || "ErrnoError" !== f.name) {
      throw f;
    }
    return -f.errno;
  }
}
var setErrNo = function(a) {
  return HEAP32[___errno_location() >> 2] = a;
};
function ___syscall_fcntl64(a, b, c) {
  SYSCALLS.varargs = c;
  try {
    var d = SYSCALLS.getStreamFromFD(a);
    switch(b) {
      case 0:
        var e = SYSCALLS.get();
        if (0 > e) {
          return -28;
        }
        for (; FS.streams[e];) {
          e++;
        }
        return FS.createStream(d, e).fd;
      case 1:
      case 2:
        return 0;
      case 3:
        return d.flags;
      case 4:
        return e = SYSCALLS.get(), d.flags |= e, 0;
      case 5:
        return e = SYSCALLS.getp(), HEAP16[e + 0 >> 1] = 2, 0;
      case 6:
      case 7:
        return 0;
      case 16:
      case 8:
        return -28;
      case 9:
        return setErrNo(28), -1;
      default:
        return -28;
    }
  } catch (f) {
    if ("undefined" == typeof FS || "ErrnoError" !== f.name) {
      throw f;
    }
    return -f.errno;
  }
}
function ___syscall_ioctl(a, b, c) {
  SYSCALLS.varargs = c;
  try {
    var d = SYSCALLS.getStreamFromFD(a);
    switch(b) {
      case 21509:
        return d.tty ? 0 : -59;
      case 21505:
        if (!d.tty) {
          return -59;
        }
        if (d.tty.ops.ioctl_tcgets) {
          var e = d.tty.ops.ioctl_tcgets(d), f = SYSCALLS.getp();
          HEAP32[f >> 2] = e.c_iflag || 0;
          HEAP32[f + 4 >> 2] = e.c_oflag || 0;
          HEAP32[f + 8 >> 2] = e.c_cflag || 0;
          HEAP32[f + 12 >> 2] = e.c_lflag || 0;
          for (var g = 0; 32 > g; g++) {
            HEAP8[f + g + 17 >> 0] = e.c_cc[g] || 0;
          }
        }
        return 0;
      case 21510:
      case 21511:
      case 21512:
        return d.tty ? 0 : -59;
      case 21506:
      case 21507:
      case 21508:
        if (!d.tty) {
          return -59;
        }
        if (d.tty.ops.ioctl_tcsets) {
          f = SYSCALLS.getp();
          var h = HEAP32[f >> 2], l = HEAP32[f + 4 >> 2], k = HEAP32[f + 8 >> 2], m = HEAP32[f + 12 >> 2];
          a = [];
          for (g = 0; 32 > g; g++) {
            a.push(HEAP8[f + g + 17 >> 0]);
          }
          return d.tty.ops.ioctl_tcsets(d.tty, b, {c_iflag:h, c_oflag:l, c_cflag:k, c_lflag:m, c_cc:a});
        }
        return 0;
      case 21519:
        if (!d.tty) {
          return -59;
        }
        f = SYSCALLS.getp();
        return HEAP32[f >> 2] = 0;
      case 21520:
        return d.tty ? -28 : -59;
      case 21531:
        return f = SYSCALLS.getp(), FS.ioctl(d, b, f);
      case 21523:
        if (!d.tty) {
          return -59;
        }
        if (d.tty.ops.ioctl_tiocgwinsz) {
          var n = d.tty.ops.ioctl_tiocgwinsz(d.tty);
          f = SYSCALLS.getp();
          HEAP16[f >> 1] = n[0];
          HEAP16[f + 2 >> 1] = n[1];
        }
        return 0;
      case 21524:
        return d.tty ? 0 : -59;
      case 21515:
        return d.tty ? 0 : -59;
      default:
        return -28;
    }
  } catch (p) {
    if ("undefined" == typeof FS || "ErrnoError" !== p.name) {
      throw p;
    }
    return -p.errno;
  }
}
function ___syscall_openat(a, b, c, d) {
  SYSCALLS.varargs = d;
  try {
    b = SYSCALLS.getStr(b);
    b = SYSCALLS.calculateAt(a, b);
    var e = d ? SYSCALLS.get() : 0;
    return FS.open(b, c, e).fd;
  } catch (f) {
    if ("undefined" == typeof FS || "ErrnoError" !== f.name) {
      throw f;
    }
    return -f.errno;
  }
}
function ___syscall_rmdir(a) {
  try {
    return a = SYSCALLS.getStr(a), FS.rmdir(a), 0;
  } catch (b) {
    if ("undefined" == typeof FS || "ErrnoError" !== b.name) {
      throw b;
    }
    return -b.errno;
  }
}
function ___syscall_unlinkat(a, b, c) {
  try {
    return b = SYSCALLS.getStr(b), b = SYSCALLS.calculateAt(a, b), 0 === c ? FS.unlink(b) : 512 === c ? FS.rmdir(b) : abort("Invalid flags passed to unlinkat"), 0;
  } catch (d) {
    if ("undefined" == typeof FS || "ErrnoError" !== d.name) {
      throw d;
    }
    return -d.errno;
  }
}
var _emscripten_set_main_loop_timing = function(a, b) {
  Browser.mainLoop.timingMode = a;
  Browser.mainLoop.timingValue = b;
  if (!Browser.mainLoop.func) {
    return 1;
  }
  Browser.mainLoop.running || (Browser.mainLoop.running = !0);
  if (0 == a) {
    Browser.mainLoop.scheduler = function() {
      var d = Math.max(0, Browser.mainLoop.tickStartTime + b - _emscripten_get_now()) | 0;
      setTimeout(Browser.mainLoop.runner, d);
    }, Browser.mainLoop.method = "timeout";
  } else if (1 == a) {
    Browser.mainLoop.scheduler = function() {
      Browser.requestAnimationFrame(Browser.mainLoop.runner);
    }, Browser.mainLoop.method = "rAF";
  } else if (2 == a) {
    if ("undefined" == typeof Browser.setImmediate) {
      if ("undefined" == typeof setImmediate) {
        var c = [];
        addEventListener("message", function(d) {
          if ("setimmediate" === d.data || "setimmediate" === d.data.target) {
            d.stopPropagation(), c.shift()();
          }
        }, !0);
        Browser.setImmediate = function(d) {
          c.push(d);
          ENVIRONMENT_IS_WORKER ? (void 0 === Module.setImmediates && (Module.setImmediates = []), Module.setImmediates.push(d), postMessage({target:"setimmediate"})) : postMessage("setimmediate", "*");
        };
      } else {
        Browser.setImmediate = setImmediate;
      }
    }
    Browser.mainLoop.scheduler = function() {
      Browser.setImmediate(Browser.mainLoop.runner);
    };
    Browser.mainLoop.method = "immediate";
  }
  return 0;
}, _emscripten_get_now;
_emscripten_get_now = "undefined" != typeof performance && performance.now ? function() {
  return performance.now();
} : Date.now;
var setMainLoop = function(a, b, c, d, e) {
  assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");
  Browser.mainLoop.func = a;
  Browser.mainLoop.arg = d;
  var f = Browser.mainLoop.currentlyRunningMainloop;
  Browser.mainLoop.running = !1;
  Browser.mainLoop.runner = function() {
    if (!ABORT) {
      if (0 < Browser.mainLoop.queue.length) {
        Date.now();
        var g = Browser.mainLoop.queue.shift();
        g.func(g.arg);
        if (Browser.mainLoop.remainingBlockers) {
          var h = Browser.mainLoop.remainingBlockers, l = 0 == h % 1 ? h - 1 : Math.floor(h);
          Browser.mainLoop.remainingBlockers = g.counted ? l : (8 * h + (l + .5)) / 9;
        }
        Browser.mainLoop.updateStatus();
        f < Browser.mainLoop.currentlyRunningMainloop || setTimeout(Browser.mainLoop.runner, 0);
      } else {
        f < Browser.mainLoop.currentlyRunningMainloop || (Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0, 1 == Browser.mainLoop.timingMode && 1 < Browser.mainLoop.timingValue && 0 != Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue ? Browser.mainLoop.scheduler() : (0 == Browser.mainLoop.timingMode && (Browser.mainLoop.tickStartTime = _emscripten_get_now()), Browser.mainLoop.runIter(a), f < Browser.mainLoop.currentlyRunningMainloop || ("object" == 
        typeof SDL && SDL.audio && SDL.audio.queueNewAudioData && SDL.audio.queueNewAudioData(), Browser.mainLoop.scheduler())));
      }
    }
  };
  e || (b && 0 < b ? _emscripten_set_main_loop_timing(0, 1E3 / b) : _emscripten_set_main_loop_timing(1, 1), Browser.mainLoop.scheduler());
  if (c) {
    throw "unwind";
  }
}, handleException = function(a) {
  if (a instanceof ExitStatus || "unwind" == a) {
    return EXITSTATUS;
  }
  quit_(1, a);
}, runtimeKeepaliveCounter = 0, keepRuntimeAlive = function() {
  return noExitRuntime || 0 < runtimeKeepaliveCounter;
}, _proc_exit = function(a) {
  EXITSTATUS = a;
  if (!keepRuntimeAlive()) {
    if (Module.onExit) {
      Module.onExit(a);
    }
    ABORT = !0;
  }
  quit_(a, new ExitStatus(a));
}, exitJS = function(a, b) {
  EXITSTATUS = a;
  _proc_exit(a);
}, _exit = exitJS, maybeExit = function() {
  if (!keepRuntimeAlive()) {
    try {
      _exit(EXITSTATUS);
    } catch (a) {
      handleException(a);
    }
  }
}, callUserCallback = function(a) {
  if (!ABORT) {
    try {
      a(), maybeExit();
    } catch (b) {
      handleException(b);
    }
  }
}, safeSetTimeout = function(a, b) {
  return setTimeout(function() {
    callUserCallback(a);
  }, b);
}, warnOnce = function(a) {
  warnOnce.shown || (warnOnce.shown = {});
  warnOnce.shown[a] || (warnOnce.shown[a] = 1, err(a));
}, Browser = {mainLoop:{running:!1, scheduler:null, method:"", currentlyRunningMainloop:0, func:null, arg:0, timingMode:0, timingValue:0, currentFrameNumber:0, queue:[], pause:function() {
  Browser.mainLoop.scheduler = null;
  Browser.mainLoop.currentlyRunningMainloop++;
}, resume:function() {
  Browser.mainLoop.currentlyRunningMainloop++;
  var a = Browser.mainLoop.timingMode, b = Browser.mainLoop.timingValue, c = Browser.mainLoop.func;
  Browser.mainLoop.func = null;
  setMainLoop(c, 0, !1, Browser.mainLoop.arg, !0);
  _emscripten_set_main_loop_timing(a, b);
  Browser.mainLoop.scheduler();
}, updateStatus:function() {
  if (Module.setStatus) {
    var a = Module.statusMessage || "Please wait...", b = Browser.mainLoop.remainingBlockers, c = Browser.mainLoop.expectedBlockers;
    b ? b < c ? Module.setStatus(a + " (" + (c - b) + "/" + c + ")") : Module.setStatus(a) : Module.setStatus("");
  }
}, runIter:function(a) {
  ABORT || Module.preMainLoop && !1 === Module.preMainLoop() || (callUserCallback(a), Module.postMainLoop && Module.postMainLoop());
}}, isFullscreen:!1, pointerLock:!1, moduleContextCreatedCallbacks:[], workers:[], init:function() {
  function a() {
    Browser.pointerLock = document.pointerLockElement === Module.canvas || document.mozPointerLockElement === Module.canvas || document.webkitPointerLockElement === Module.canvas || document.msPointerLockElement === Module.canvas;
  }
  if (!Browser.initted) {
    Browser.initted = !0;
    preloadPlugins.push({canHandle:function(c) {
      return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(c);
    }, handle:function(c, d, e, f) {
      var g = new Blob([c], {type:Browser.getMimetype(d)});
      g.size !== c.length && (g = new Blob([(new Uint8Array(c)).buffer], {type:Browser.getMimetype(d)}));
      var h = URL.createObjectURL(g), l = new Image();
      l.onload = function() {
        assert(l.complete, "Image " + d + " could not be decoded");
        var k = document.createElement("canvas");
        k.width = l.width;
        k.height = l.height;
        k.getContext("2d").drawImage(l, 0, 0);
        preloadedImages[d] = k;
        URL.revokeObjectURL(h);
        e && e(c);
      };
      l.onerror = function(k) {
        err("Image " + h + " could not be decoded");
        f && f();
      };
      l.src = h;
    }});
    preloadPlugins.push({canHandle:function(c) {
      return !Module.noAudioDecoding && c.substr(-4) in {".ogg":1, ".wav":1, ".mp3":1};
    }, handle:function(c, d, e, f) {
      function g(k) {
        h || (h = !0, preloadedAudios[d] = k, e && e(c));
      }
      var h = !1;
      f = new Blob([c], {type:Browser.getMimetype(d)});
      f = URL.createObjectURL(f);
      var l = new Audio();
      l.addEventListener("canplaythrough", function() {
        return g(l);
      }, !1);
      l.onerror = function(k) {
        if (!h) {
          err("warning: browser could not fully decode audio " + d + ", trying slower base64 approach");
          k = "data:audio/x-" + d.substr(-3) + ";base64,";
          for (var m = "", n = 0, p = 0, q = 0; q < c.length; q++) {
            for (n = n << 8 | c[q], p += 8; 6 <= p;) {
              var r = n >> p - 6 & 63;
              p -= 6;
              m += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[r];
            }
          }
          2 == p ? (m += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(n & 3) << 4], m += "==") : 4 == p && (m += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(n & 15) << 2], m += "=");
          l.src = k + m;
          g(l);
        }
      };
      l.src = f;
      safeSetTimeout(function() {
        g(l);
      }, 1E4);
    }});
    var b = Module.canvas;
    b && (b.requestPointerLock = b.requestPointerLock || b.mozRequestPointerLock || b.webkitRequestPointerLock || b.msRequestPointerLock || function() {
    }, b.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock || document.msExitPointerLock || function() {
    }, b.exitPointerLock = b.exitPointerLock.bind(document), document.addEventListener("pointerlockchange", a, !1), document.addEventListener("mozpointerlockchange", a, !1), document.addEventListener("webkitpointerlockchange", a, !1), document.addEventListener("mspointerlockchange", a, !1), Module.elementPointerLock && b.addEventListener("click", function(c) {
      !Browser.pointerLock && Module.canvas.requestPointerLock && (Module.canvas.requestPointerLock(), c.preventDefault());
    }, !1));
  }
}, createContext:function(a, b, c, d) {
  if (b && Module.ctx && a == Module.canvas) {
    return Module.ctx;
  }
  var e;
  if (b) {
    var f = {antialias:!1, alpha:!1, majorVersion:1};
    if (d) {
      for (var g in d) {
        f[g] = d[g];
      }
    }
    if ("undefined" != typeof GL && (e = GL.createContext(a, f))) {
      var h = GL.getContext(e).GLctx;
    }
  } else {
    h = a.getContext("2d");
  }
  if (!h) {
    return null;
  }
  c && (b || assert("undefined" == typeof GLctx, "cannot set in module if GLctx is used, but we are a non-GL context that would replace it"), Module.ctx = h, b && GL.makeContextCurrent(e), Module.useWebGL = b, Browser.moduleContextCreatedCallbacks.forEach(function(l) {
    return l();
  }), Browser.init());
  return h;
}, destroyContext:function(a, b, c) {
}, fullscreenHandlersInstalled:!1, lockPointer:void 0, resizeCanvas:void 0, requestFullscreen:function(a, b) {
  function c() {
    Browser.isFullscreen = !1;
    var f = d.parentNode;
    (document.fullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement || document.webkitCurrentFullScreenElement) === f ? (d.exitFullscreen = Browser.exitFullscreen, Browser.lockPointer && d.requestPointerLock(), Browser.isFullscreen = !0, Browser.resizeCanvas ? Browser.setFullscreenCanvasSize() : Browser.updateCanvasDimensions(d)) : (f.parentNode.insertBefore(d, f), f.parentNode.removeChild(f), Browser.resizeCanvas ? Browser.setWindowedCanvasSize() : 
    Browser.updateCanvasDimensions(d));
    if (Module.onFullScreen) {
      Module.onFullScreen(Browser.isFullscreen);
    }
    if (Module.onFullscreen) {
      Module.onFullscreen(Browser.isFullscreen);
    }
  }
  Browser.lockPointer = a;
  Browser.resizeCanvas = b;
  "undefined" == typeof Browser.lockPointer && (Browser.lockPointer = !0);
  "undefined" == typeof Browser.resizeCanvas && (Browser.resizeCanvas = !1);
  var d = Module.canvas;
  Browser.fullscreenHandlersInstalled || (Browser.fullscreenHandlersInstalled = !0, document.addEventListener("fullscreenchange", c, !1), document.addEventListener("mozfullscreenchange", c, !1), document.addEventListener("webkitfullscreenchange", c, !1), document.addEventListener("MSFullscreenChange", c, !1));
  var e = document.createElement("div");
  d.parentNode.insertBefore(e, d);
  e.appendChild(d);
  e.requestFullscreen = e.requestFullscreen || e.mozRequestFullScreen || e.msRequestFullscreen || (e.webkitRequestFullscreen ? function() {
    return e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } : null) || (e.webkitRequestFullScreen ? function() {
    return e.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
  } : null);
  e.requestFullscreen();
}, exitFullscreen:function() {
  if (!Browser.isFullscreen) {
    return !1;
  }
  (document.exitFullscreen || document.cancelFullScreen || document.mozCancelFullScreen || document.msExitFullscreen || document.webkitCancelFullScreen || function() {
  }).apply(document, []);
  return !0;
}, nextRAF:0, fakeRequestAnimationFrame:function(a) {
  var b = Date.now();
  if (0 === Browser.nextRAF) {
    Browser.nextRAF = b + 1E3 / 60;
  } else {
    for (; b + 2 >= Browser.nextRAF;) {
      Browser.nextRAF += 1E3 / 60;
    }
  }
  setTimeout(a, Math.max(Browser.nextRAF - b, 0));
}, requestAnimationFrame:function(a) {
  if ("function" == typeof requestAnimationFrame) {
    requestAnimationFrame(a);
  } else {
    var b = Browser.fakeRequestAnimationFrame;
    "undefined" != typeof window && (b = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || b);
    b(a);
  }
}, safeSetTimeout:function(a, b) {
  return safeSetTimeout(a, b);
}, safeRequestAnimationFrame:function(a) {
  return Browser.requestAnimationFrame(function() {
    callUserCallback(a);
  });
}, getMimetype:function(a) {
  return {jpg:"image/jpeg", jpeg:"image/jpeg", png:"image/png", bmp:"image/bmp", ogg:"audio/ogg", wav:"audio/wav", mp3:"audio/mpeg"}[a.substr(a.lastIndexOf(".") + 1)];
}, getUserMedia:function(a) {
  window.getUserMedia || (window.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia);
  window.getUserMedia(a);
}, getMovementX:function(a) {
  return a.movementX || a.mozMovementX || a.webkitMovementX || 0;
}, getMovementY:function(a) {
  return a.movementY || a.mozMovementY || a.webkitMovementY || 0;
}, getMouseWheelDelta:function(a) {
  switch(a.type) {
    case "DOMMouseScroll":
      var b = a.detail / 3;
      break;
    case "mousewheel":
      b = a.wheelDelta / 120;
      break;
    case "wheel":
      b = a.deltaY;
      switch(a.deltaMode) {
        case 0:
          b /= 100;
          break;
        case 1:
          b /= 3;
          break;
        case 2:
          b *= 80;
          break;
        default:
          throw "unrecognized mouse wheel delta mode: " + a.deltaMode;
      }break;
    default:
      throw "unrecognized mouse wheel event: " + a.type;
  }
  return b;
}, mouseX:0, mouseY:0, mouseMovementX:0, mouseMovementY:0, touches:{}, lastTouches:{}, calculateMouseEvent:function(a) {
  if (Browser.pointerLock) {
    "mousemove" != a.type && "mozMovementX" in a ? Browser.mouseMovementX = Browser.mouseMovementY = 0 : (Browser.mouseMovementX = Browser.getMovementX(a), Browser.mouseMovementY = Browser.getMovementY(a)), "undefined" != typeof SDL ? (Browser.mouseX = SDL.mouseX + Browser.mouseMovementX, Browser.mouseY = SDL.mouseY + Browser.mouseMovementY) : (Browser.mouseX += Browser.mouseMovementX, Browser.mouseY += Browser.mouseMovementY);
  } else {
    var b = Module.canvas.getBoundingClientRect(), c = Module.canvas.width, d = Module.canvas.height, e = "undefined" != typeof window.scrollX ? window.scrollX : window.pageXOffset, f = "undefined" != typeof window.scrollY ? window.scrollY : window.pageYOffset;
    if ("touchstart" === a.type || "touchend" === a.type || "touchmove" === a.type) {
      var g = a.touch;
      if (void 0 !== g) {
        if (e = g.pageX - (e + b.left), f = g.pageY - (f + b.top), e *= c / b.width, f *= d / b.height, b = {x:e, y:f}, "touchstart" === a.type) {
          Browser.lastTouches[g.identifier] = b, Browser.touches[g.identifier] = b;
        } else if ("touchend" === a.type || "touchmove" === a.type) {
          (a = Browser.touches[g.identifier]) || (a = b), Browser.lastTouches[g.identifier] = a, Browser.touches[g.identifier] = b;
        }
      }
    } else {
      g = a.pageX - (e + b.left), a = a.pageY - (f + b.top), g *= c / b.width, a *= d / b.height, Browser.mouseMovementX = g - Browser.mouseX, Browser.mouseMovementY = a - Browser.mouseY, Browser.mouseX = g, Browser.mouseY = a;
    }
  }
}, resizeListeners:[], updateResizeListeners:function() {
  var a = Module.canvas;
  Browser.resizeListeners.forEach(function(b) {
    return b(a.width, a.height);
  });
}, setCanvasSize:function(a, b, c) {
  Browser.updateCanvasDimensions(Module.canvas, a, b);
  c || Browser.updateResizeListeners();
}, windowedWidth:0, windowedHeight:0, setFullscreenCanvasSize:function() {
  "undefined" != typeof SDL && (HEAP32[SDL.screen >> 2] = HEAPU32[SDL.screen >> 2] | 8388608);
  Browser.updateCanvasDimensions(Module.canvas);
  Browser.updateResizeListeners();
}, setWindowedCanvasSize:function() {
  "undefined" != typeof SDL && (HEAP32[SDL.screen >> 2] = HEAPU32[SDL.screen >> 2] & -8388609);
  Browser.updateCanvasDimensions(Module.canvas);
  Browser.updateResizeListeners();
}, updateCanvasDimensions:function(a, b, c) {
  b && c ? (a.widthNative = b, a.heightNative = c) : (b = a.widthNative, c = a.heightNative);
  var d = b, e = c;
  Module.forcedAspectRatio && 0 < Module.forcedAspectRatio && (d / e < Module.forcedAspectRatio ? d = Math.round(e * Module.forcedAspectRatio) : e = Math.round(d / Module.forcedAspectRatio));
  if ((document.fullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement || document.webkitCurrentFullScreenElement) === a.parentNode && "undefined" != typeof screen) {
    var f = Math.min(screen.width / d, screen.height / e);
    d = Math.round(d * f);
    e = Math.round(e * f);
  }
  Browser.resizeCanvas ? (a.width != d && (a.width = d), a.height != e && (a.height = e), "undefined" != typeof a.style && (a.style.removeProperty("width"), a.style.removeProperty("height"))) : (a.width != b && (a.width = b), a.height != c && (a.height = c), "undefined" != typeof a.style && (d != b || e != c ? (a.style.setProperty("width", d + "px", "important"), a.style.setProperty("height", e + "px", "important")) : (a.style.removeProperty("width"), a.style.removeProperty("height"))));
}}, _emscripten_cancel_main_loop = function() {
  Browser.mainLoop.pause();
  Browser.mainLoop.func = null;
}, _emscripten_date_now = function() {
  return Date.now();
}, withStackSave = function(a) {
  var b = stackSave();
  a = a();
  stackRestore(b);
  return a;
}, JSEvents = {inEventHandler:0, removeAllEventListeners:function() {
  for (var a = JSEvents.eventHandlers.length - 1; 0 <= a; --a) {
    JSEvents._removeHandler(a);
  }
  JSEvents.eventHandlers = [];
  JSEvents.deferredCalls = [];
}, registerRemoveEventListeners:function() {
  JSEvents.removeEventListenersRegistered || (__ATEXIT__.push(JSEvents.removeAllEventListeners), JSEvents.removeEventListenersRegistered = !0);
}, deferredCalls:[], deferCall:function(a, b, c) {
  function d(g, h) {
    if (g.length != h.length) {
      return !1;
    }
    for (var l in g) {
      if (g[l] != h[l]) {
        return !1;
      }
    }
    return !0;
  }
  for (var e in JSEvents.deferredCalls) {
    var f = JSEvents.deferredCalls[e];
    if (f.targetFunction == a && d(f.argsList, c)) {
      return;
    }
  }
  JSEvents.deferredCalls.push({targetFunction:a, precedence:b, argsList:c});
  JSEvents.deferredCalls.sort(function(g, h) {
    return g.precedence < h.precedence;
  });
}, removeDeferredCalls:function(a) {
  for (var b = 0; b < JSEvents.deferredCalls.length; ++b) {
    JSEvents.deferredCalls[b].targetFunction == a && (JSEvents.deferredCalls.splice(b, 1), --b);
  }
}, canPerformEventHandlerRequests:function() {
  return navigator.userActivation ? navigator.userActivation.isActive : JSEvents.inEventHandler && JSEvents.currentEventHandler.allowsDeferredCalls;
}, runDeferredCalls:function() {
  if (JSEvents.canPerformEventHandlerRequests()) {
    for (var a = 0; a < JSEvents.deferredCalls.length; ++a) {
      var b = JSEvents.deferredCalls[a];
      JSEvents.deferredCalls.splice(a, 1);
      --a;
      b.targetFunction.apply(null, b.argsList);
    }
  }
}, eventHandlers:[], isInternetExplorer:function() {
  return navigator.userAgent.includes("MSIE") || 0 < navigator.appVersion.indexOf("Trident/");
}, removeAllHandlersOnTarget:function(a, b) {
  for (var c = 0; c < JSEvents.eventHandlers.length; ++c) {
    JSEvents.eventHandlers[c].target != a || b && b != JSEvents.eventHandlers[c].eventTypeString || JSEvents._removeHandler(c--);
  }
}, _removeHandler:function(a) {
  var b = JSEvents.eventHandlers[a];
  b.target.removeEventListener(b.eventTypeString, b.eventListenerFunc, b.useCapture);
  JSEvents.eventHandlers.splice(a, 1);
}, registerOrRemoveHandler:function(a) {
  if (!a.target) {
    return -4;
  }
  var b = function(c) {
    ++JSEvents.inEventHandler;
    JSEvents.currentEventHandler = a;
    JSEvents.runDeferredCalls();
    a.handlerFunc(c);
    JSEvents.runDeferredCalls();
    --JSEvents.inEventHandler;
  };
  if (a.callbackfunc) {
    a.eventListenerFunc = b, a.target.addEventListener(a.eventTypeString, b, a.useCapture), JSEvents.eventHandlers.push(a), JSEvents.registerRemoveEventListeners();
  } else {
    for (b = 0; b < JSEvents.eventHandlers.length; ++b) {
      JSEvents.eventHandlers[b].target == a.target && JSEvents.eventHandlers[b].eventTypeString == a.eventTypeString && JSEvents._removeHandler(b--);
    }
  }
  return 0;
}, getNodeNameForTarget:function(a) {
  return a ? a == window ? "#window" : a == screen ? "#screen" : a && a.nodeName ? a.nodeName : "" : "";
}, fullscreenEnabled:function() {
  return document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled;
}}, currentFullscreenStrategy = {}, maybeCStringToJsString = function(a) {
  return 2 < a ? UTF8ToString(a) : a;
}, specialHTMLTargets = [0, document, window], findEventTarget = function(a) {
  a = maybeCStringToJsString(a);
  return specialHTMLTargets[a] || document.querySelector(a);
}, findCanvasEventTarget = function(a) {
  return findEventTarget(a);
}, _emscripten_get_canvas_element_size = function(a, b, c) {
  a = findCanvasEventTarget(a);
  if (!a) {
    return -4;
  }
  HEAP32[b >> 2] = a.width;
  HEAP32[c >> 2] = a.height;
}, stringToUTF8 = function(a, b, c) {
  return stringToUTF8Array(a, HEAPU8, b, c);
}, stringToUTF8OnStack = function(a) {
  var b = lengthBytesUTF8(a) + 1, c = stackAlloc(b);
  stringToUTF8(a, c, b);
  return c;
}, getCanvasElementSize = function(a) {
  return withStackSave(function() {
    var b = stackAlloc(8), c = b + 4, d = stringToUTF8OnStack(a.id);
    _emscripten_get_canvas_element_size(d, b, c);
    return [HEAP32[b >> 2], HEAP32[c >> 2]];
  });
}, _emscripten_set_canvas_element_size = function(a, b, c) {
  a = findCanvasEventTarget(a);
  if (!a) {
    return -4;
  }
  a.width = b;
  a.height = c;
  return 0;
}, setCanvasElementSize = function(a, b, c) {
  a.controlTransferredOffscreen ? withStackSave(function() {
    var d = stringToUTF8OnStack(a.id);
    _emscripten_set_canvas_element_size(d, b, c);
  }) : (a.width = b, a.height = c);
}, wasmTable, getWasmTableEntry = function(a) {
  return wasmTable.get(a);
}, registerRestoreOldStyle = function(a) {
  function b() {
    document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement || (document.removeEventListener("fullscreenchange", b), document.removeEventListener("mozfullscreenchange", b), document.removeEventListener("webkitfullscreenchange", b), document.removeEventListener("MSFullscreenChange", b), setCanvasElementSize(a, d, e), a.style.width = f, a.style.height = g, a.style.backgroundColor = h, l || (document.body.style.backgroundColor = 
    "white"), document.body.style.backgroundColor = l, a.style.paddingLeft = k, a.style.paddingRight = m, a.style.paddingTop = n, a.style.paddingBottom = p, a.style.marginLeft = q, a.style.marginRight = r, a.style.marginTop = t, a.style.marginBottom = w, document.body.style.margin = v, document.documentElement.style.overflow = x, document.body.scroll = y, a.style.imageRendering = u, a.GLctxObject && a.GLctxObject.GLctx.viewport(0, 0, d, e), currentFullscreenStrategy.canvasResizedCallback && getWasmTableEntry(currentFullscreenStrategy.canvasResizedCallback)(37, 
    0, currentFullscreenStrategy.canvasResizedCallbackUserData));
  }
  var c = getCanvasElementSize(a), d = c[0], e = c[1], f = a.style.width, g = a.style.height, h = a.style.backgroundColor, l = document.body.style.backgroundColor, k = a.style.paddingLeft, m = a.style.paddingRight, n = a.style.paddingTop, p = a.style.paddingBottom, q = a.style.marginLeft, r = a.style.marginRight, t = a.style.marginTop, w = a.style.marginBottom, v = document.body.style.margin, x = document.documentElement.style.overflow, y = document.body.scroll, u = a.style.imageRendering;
  document.addEventListener("fullscreenchange", b);
  document.addEventListener("mozfullscreenchange", b);
  document.addEventListener("webkitfullscreenchange", b);
  document.addEventListener("MSFullscreenChange", b);
  return b;
}, setLetterbox = function(a, b, c) {
  JSEvents.isInternetExplorer() ? (a.style.marginLeft = a.style.marginRight = c + "px", a.style.marginTop = a.style.marginBottom = b + "px") : (a.style.paddingLeft = a.style.paddingRight = c + "px", a.style.paddingTop = a.style.paddingBottom = b + "px");
}, getBoundingClientRect = function(a) {
  return 0 > specialHTMLTargets.indexOf(a) ? a.getBoundingClientRect() : {left:0, top:0};
}, JSEvents_resizeCanvasForFullscreen = function(a, b) {
  var c = registerRestoreOldStyle(a), d = b.softFullscreen ? innerWidth : screen.width, e = b.softFullscreen ? innerHeight : screen.height, f = getBoundingClientRect(a), g = f.right - f.left;
  f = f.bottom - f.top;
  var h = getCanvasElementSize(a), l = h[0];
  h = h[1];
  3 == b.scaleMode ? (setLetterbox(a, (e - f) / 2, (d - g) / 2), d = g, e = f) : 2 == b.scaleMode && (d * h < l * e ? (g = h * d / l, setLetterbox(a, (e - g) / 2, 0), e = g) : (g = l * e / h, setLetterbox(a, 0, (d - g) / 2), d = g));
  a.style.backgroundColor || (a.style.backgroundColor = "black");
  document.body.style.backgroundColor || (document.body.style.backgroundColor = "black");
  a.style.width = d + "px";
  a.style.height = e + "px";
  1 == b.filteringMode && (a.style.imageRendering = "optimizeSpeed", a.style.imageRendering = "-moz-crisp-edges", a.style.imageRendering = "-o-crisp-edges", a.style.imageRendering = "-webkit-optimize-contrast", a.style.imageRendering = "optimize-contrast", a.style.imageRendering = "crisp-edges", a.style.imageRendering = "pixelated");
  g = 2 == b.canvasResolutionScaleMode ? devicePixelRatio : 1;
  0 != b.canvasResolutionScaleMode && (b = d * g | 0, e = e * g | 0, setCanvasElementSize(a, b, e), a.GLctxObject && a.GLctxObject.GLctx.viewport(0, 0, b, e));
  return c;
}, JSEvents_requestFullscreen = function(a, b) {
  0 == b.scaleMode && 0 == b.canvasResolutionScaleMode || JSEvents_resizeCanvasForFullscreen(a, b);
  if (a.requestFullscreen) {
    a.requestFullscreen();
  } else if (a.msRequestFullscreen) {
    a.msRequestFullscreen();
  } else if (a.mozRequestFullScreen) {
    a.mozRequestFullScreen();
  } else if (a.mozRequestFullscreen) {
    a.mozRequestFullscreen();
  } else if (a.webkitRequestFullscreen) {
    a.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else {
    return JSEvents.fullscreenEnabled() ? -3 : -1;
  }
  currentFullscreenStrategy = b;
  b.canvasResizedCallback && getWasmTableEntry(b.canvasResizedCallback)(37, 0, b.canvasResizedCallbackUserData);
  return 0;
}, _emscripten_exit_fullscreen = function() {
  if (!JSEvents.fullscreenEnabled()) {
    return -1;
  }
  JSEvents.removeDeferredCalls(JSEvents_requestFullscreen);
  var a = specialHTMLTargets[1];
  if (a.exitFullscreen) {
    a.fullscreenElement && a.exitFullscreen();
  } else if (a.msExitFullscreen) {
    a.msFullscreenElement && a.msExitFullscreen();
  } else if (a.mozCancelFullScreen) {
    a.mozFullScreenElement && a.mozCancelFullScreen();
  } else if (a.webkitExitFullscreen) {
    a.webkitFullscreenElement && a.webkitExitFullscreen();
  } else {
    return -1;
  }
  return 0;
}, requestPointerLock = function(a) {
  if (a.requestPointerLock) {
    a.requestPointerLock();
  } else if (a.mozRequestPointerLock) {
    a.mozRequestPointerLock();
  } else if (a.webkitRequestPointerLock) {
    a.webkitRequestPointerLock();
  } else if (a.msRequestPointerLock) {
    a.msRequestPointerLock();
  } else {
    return document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock || document.body.msRequestPointerLock ? -3 : -1;
  }
  return 0;
}, _emscripten_exit_pointerlock = function() {
  JSEvents.removeDeferredCalls(requestPointerLock);
  if (document.exitPointerLock) {
    document.exitPointerLock();
  } else if (document.msExitPointerLock) {
    document.msExitPointerLock();
  } else if (document.mozExitPointerLock) {
    document.mozExitPointerLock();
  } else if (document.webkitExitPointerLock) {
    document.webkitExitPointerLock();
  } else {
    return -1;
  }
  return 0;
}, _emscripten_get_device_pixel_ratio = function() {
  return window.devicePixelRatio || 1;
}, _emscripten_get_element_css_size = function(a, b, c) {
  a = findEventTarget(a);
  if (!a) {
    return -4;
  }
  a = getBoundingClientRect(a);
  HEAPF64[b >> 3] = a.right - a.left;
  HEAPF64[c >> 3] = a.bottom - a.top;
  return 0;
}, fillGamepadEventData = function(a, b) {
  HEAPF64[a >> 3] = b.timestamp;
  for (var c = 0; c < b.axes.length; ++c) {
    HEAPF64[a + 8 * c + 16 >> 3] = b.axes[c];
  }
  for (c = 0; c < b.buttons.length; ++c) {
    HEAPF64[a + 8 * c + 528 >> 3] = "object" == typeof b.buttons[c] ? b.buttons[c].value : b.buttons[c];
  }
  for (c = 0; c < b.buttons.length; ++c) {
    HEAP32[a + 4 * c + 1040 >> 2] = "object" == typeof b.buttons[c] ? b.buttons[c].pressed : 1 == b.buttons[c];
  }
  HEAP32[a + 1296 >> 2] = b.connected;
  HEAP32[a + 1300 >> 2] = b.index;
  HEAP32[a + 8 >> 2] = b.axes.length;
  HEAP32[a + 12 >> 2] = b.buttons.length;
  stringToUTF8(b.id, a + 1304, 64);
  stringToUTF8(b.mapping, a + 1368, 64);
}, _emscripten_get_gamepad_status = function(a, b) {
  if (0 > a || a >= JSEvents.lastGamepadState.length) {
    return -5;
  }
  if (!JSEvents.lastGamepadState[a]) {
    return -7;
  }
  fillGamepadEventData(b, JSEvents.lastGamepadState[a]);
  return 0;
}, _emscripten_get_num_gamepads = function() {
  return JSEvents.lastGamepadState.length;
}, fillPointerlockChangeEventData = function(a) {
  var b = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement;
  HEAP32[a >> 2] = !!b;
  var c = JSEvents.getNodeNameForTarget(b);
  b = b && b.id ? b.id : "";
  stringToUTF8(c, a + 4, 128);
  stringToUTF8(b, a + 132, 128);
}, _emscripten_get_pointerlock_status = function(a) {
  a && fillPointerlockChangeEventData(a);
  return document.body && (document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock || document.body.msRequestPointerLock) ? 0 : -1;
}, webgl_enable_ANGLE_instanced_arrays = function(a) {
  var b = a.getExtension("ANGLE_instanced_arrays");
  if (b) {
    return a.vertexAttribDivisor = function(c, d) {
      return b.vertexAttribDivisorANGLE(c, d);
    }, a.drawArraysInstanced = function(c, d, e, f) {
      return b.drawArraysInstancedANGLE(c, d, e, f);
    }, a.drawElementsInstanced = function(c, d, e, f, g) {
      return b.drawElementsInstancedANGLE(c, d, e, f, g);
    }, 1;
  }
}, webgl_enable_OES_vertex_array_object = function(a) {
  var b = a.getExtension("OES_vertex_array_object");
  if (b) {
    return a.createVertexArray = function() {
      return b.createVertexArrayOES();
    }, a.deleteVertexArray = function(c) {
      return b.deleteVertexArrayOES(c);
    }, a.bindVertexArray = function(c) {
      return b.bindVertexArrayOES(c);
    }, a.isVertexArray = function(c) {
      return b.isVertexArrayOES(c);
    }, 1;
  }
}, webgl_enable_WEBGL_draw_buffers = function(a) {
  var b = a.getExtension("WEBGL_draw_buffers");
  if (b) {
    return a.drawBuffers = function(c, d) {
      return b.drawBuffersWEBGL(c, d);
    }, 1;
  }
}, webgl_enable_WEBGL_multi_draw = function(a) {
  return !!(a.multiDrawWebgl = a.getExtension("WEBGL_multi_draw"));
}, GL = {counter:1, buffers:[], programs:[], framebuffers:[], renderbuffers:[], textures:[], shaders:[], vaos:[], contexts:[], offscreenCanvases:{}, queries:[], stringCache:{}, unpackAlignment:4, recordError:function(a) {
  GL.lastError || (GL.lastError = a);
}, getNewId:function(a) {
  for (var b = GL.counter++, c = a.length; c < b; c++) {
    a[c] = null;
  }
  return b;
}, getSource:function(a, b, c, d) {
  a = "";
  for (var e = 0; e < b; ++e) {
    var f = d ? HEAP32[d + 4 * e >> 2] : -1;
    a += UTF8ToString(HEAP32[c + 4 * e >> 2], 0 > f ? void 0 : f);
  }
  return a;
}, createContext:function(a, b) {
  a.getContextSafariWebGL2Fixed || (a.getContextSafariWebGL2Fixed = a.getContext, a.getContext = function(d, e) {
    e = a.getContextSafariWebGL2Fixed(d, e);
    return "webgl" == d == e instanceof WebGLRenderingContext ? e : null;
  });
  var c = a.getContext("webgl", b) || a.getContext("experimental-webgl", b);
  return c ? GL.registerContext(c, b) : 0;
}, registerContext:function(a, b) {
  var c = GL.getNewId(GL.contexts), d = {handle:c, attributes:b, version:b.majorVersion, GLctx:a};
  d.cannotHandleOffsetsInUniformArrayViews = function(e) {
    function f(k, m) {
      m = e.createShader(m);
      e.shaderSource(m, k);
      e.compileShader(m);
      return m;
    }
    try {
      var g = e.createProgram();
      e.attachShader(g, f("attribute vec4 p;void main(){gl_Position=p;}", 35633));
      e.attachShader(g, f("precision lowp float;uniform vec4 u;void main(){gl_FragColor=u;}", 35632));
      e.linkProgram(g);
      var h = new Float32Array(8);
      h[4] = 1;
      e.useProgram(g);
      var l = e.getUniformLocation(g, "u");
      e.uniform4fv(l, h.subarray(4, 8));
      return !e.getUniform(g, l)[0];
    } catch (k) {
      return !1;
    }
  }();
  a.canvas && (a.canvas.GLctxObject = d);
  GL.contexts[c] = d;
  ("undefined" == typeof b.enableExtensionsByDefault || b.enableExtensionsByDefault) && GL.initExtensions(d);
  return c;
}, makeContextCurrent:function(a) {
  GL.currentContext = GL.contexts[a];
  Module.ctx = GLctx = GL.currentContext && GL.currentContext.GLctx;
  return !(a && !GLctx);
}, getContext:function(a) {
  return GL.contexts[a];
}, deleteContext:function(a) {
  GL.currentContext === GL.contexts[a] && (GL.currentContext = null);
  "object" == typeof JSEvents && JSEvents.removeAllHandlersOnTarget(GL.contexts[a].GLctx.canvas);
  GL.contexts[a] && GL.contexts[a].GLctx.canvas && (GL.contexts[a].GLctx.canvas.GLctxObject = void 0);
  GL.contexts[a] = null;
}, initExtensions:function(a) {
  a || (a = GL.currentContext);
  if (!a.initExtensionsDone) {
    a.initExtensionsDone = !0;
    var b = a.GLctx;
    webgl_enable_ANGLE_instanced_arrays(b);
    webgl_enable_OES_vertex_array_object(b);
    webgl_enable_WEBGL_draw_buffers(b);
    b.disjointTimerQueryExt = b.getExtension("EXT_disjoint_timer_query");
    webgl_enable_WEBGL_multi_draw(b);
    (b.getSupportedExtensions() || []).forEach(function(c) {
      c.includes("lose_context") || c.includes("debug") || b.getExtension(c);
    });
  }
}, getExtensions:function() {
  var a = GLctx.getSupportedExtensions() || [];
  return a = a.concat(a.map(function(b) {
    return "GL_" + b;
  }));
}}, _emscripten_is_webgl_context_lost = function(a) {
  return !GL.contexts[a] || GL.contexts[a].GLctx.isContextLost();
}, _emscripten_memcpy_js = Uint8Array.prototype.copyWithin ? function(a, b, c) {
  return HEAPU8.copyWithin(a, b, b + c);
} : function(a, b, c) {
  return HEAPU8.set(HEAPU8.subarray(b, b + c), a);
}, doRequestFullscreen = function(a, b) {
  if (!JSEvents.fullscreenEnabled()) {
    return -1;
  }
  a = findEventTarget(a);
  return a ? a.requestFullscreen || a.msRequestFullscreen || a.mozRequestFullScreen || a.mozRequestFullscreen || a.webkitRequestFullscreen ? JSEvents.canPerformEventHandlerRequests() ? JSEvents_requestFullscreen(a, b) : b.deferUntilInEventHandler ? (JSEvents.deferCall(JSEvents_requestFullscreen, 1, [a, b]), 1) : -2 : -3 : -4;
}, _emscripten_request_fullscreen_strategy = function(a, b, c) {
  return doRequestFullscreen(a, {scaleMode:HEAP32[c >> 2], canvasResolutionScaleMode:HEAP32[c + 4 >> 2], filteringMode:HEAP32[c + 8 >> 2], deferUntilInEventHandler:b, canvasResizedCallback:HEAP32[c + 12 >> 2], canvasResizedCallbackUserData:HEAP32[c + 16 >> 2]});
}, _emscripten_request_pointerlock = function(a, b) {
  a = findEventTarget(a);
  return a ? a.requestPointerLock || a.mozRequestPointerLock || a.webkitRequestPointerLock || a.msRequestPointerLock ? JSEvents.canPerformEventHandlerRequests() ? requestPointerLock(a) : b ? (JSEvents.deferCall(requestPointerLock, 2, [a]), 1) : -2 : -1 : -4;
}, getHeapMax = function() {
  return 2147483648;
}, growMemory = function(a) {
  a = (a - wasmMemory.buffer.byteLength + 65535) / 65536;
  try {
    return wasmMemory.grow(a), updateMemoryViews(), 1;
  } catch (b) {
  }
}, _emscripten_resize_heap = function(a) {
  var b = HEAPU8.length;
  a >>>= 0;
  var c = getHeapMax();
  if (a > c) {
    return !1;
  }
  for (var d = 1; 4 >= d; d *= 2) {
    var e = b * (1 + .2 / d);
    e = Math.min(e, a + 100663296);
    var f = Math;
    e = Math.max(a, e);
    f = f.min.call(f, c, e + (65536 - e % 65536) % 65536);
    if (growMemory(f)) {
      return !0;
    }
  }
  return !1;
}, _emscripten_resume_main_loop = function() {
  Browser.mainLoop.resume();
}, _emscripten_sample_gamepad_data = function() {
  return (JSEvents.lastGamepadState = navigator.getGamepads ? navigator.getGamepads() : navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : null) ? 0 : -1;
}, registerBeforeUnloadEventCallback = function(a, b, c, d, e, f) {
  a = {target:findEventTarget(a), eventTypeString:f, callbackfunc:d, handlerFunc:function(g) {
    g = void 0 === g ? event : g;
    var h = getWasmTableEntry(d)(e, 0, b);
    h && (h = UTF8ToString(h));
    if (h) {
      return g.preventDefault(), g.returnValue = h;
    }
  }, useCapture:c};
  return JSEvents.registerOrRemoveHandler(a);
}, _emscripten_set_beforeunload_callback_on_thread = function(a, b, c) {
  return "undefined" == typeof onbeforeunload ? -1 : 1 !== c ? -5 : registerBeforeUnloadEventCallback(2, a, !0, b, 28, "beforeunload");
}, registerFocusEventCallback = function(a, b, c, d, e, f, g) {
  JSEvents.focusEvent || (JSEvents.focusEvent = _malloc(256));
  a = {target:findEventTarget(a), eventTypeString:f, callbackfunc:d, handlerFunc:function(h) {
    h = void 0 === h ? event : h;
    var l = JSEvents.getNodeNameForTarget(h.target), k = h.target.id ? h.target.id : "", m = JSEvents.focusEvent;
    stringToUTF8(l, m + 0, 128);
    stringToUTF8(k, m + 128, 128);
    getWasmTableEntry(d)(e, m, b) && h.preventDefault();
  }, useCapture:c};
  return JSEvents.registerOrRemoveHandler(a);
}, _emscripten_set_blur_callback_on_thread = function(a, b, c, d, e) {
  return registerFocusEventCallback(a, b, c, d, 12, "blur", e);
}, _emscripten_set_element_css_size = function(a, b, c) {
  a = findEventTarget(a);
  if (!a) {
    return -4;
  }
  a.style.width = b + "px";
  a.style.height = c + "px";
  return 0;
}, _emscripten_set_focus_callback_on_thread = function(a, b, c, d, e) {
  return registerFocusEventCallback(a, b, c, d, 13, "focus", e);
}, fillFullscreenChangeEventData = function(a) {
  var b = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement, c = !!b;
  HEAP32[a >> 2] = c;
  HEAP32[a + 4 >> 2] = JSEvents.fullscreenEnabled();
  var d = c ? b : JSEvents.previousFullscreenElement, e = JSEvents.getNodeNameForTarget(d), f = d && d.id ? d.id : "";
  stringToUTF8(e, a + 8, 128);
  stringToUTF8(f, a + 136, 128);
  HEAP32[a + 264 >> 2] = d ? d.clientWidth : 0;
  HEAP32[a + 268 >> 2] = d ? d.clientHeight : 0;
  HEAP32[a + 272 >> 2] = screen.width;
  HEAP32[a + 276 >> 2] = screen.height;
  c && (JSEvents.previousFullscreenElement = b);
}, registerFullscreenChangeEventCallback = function(a, b, c, d, e, f, g) {
  JSEvents.fullscreenChangeEvent || (JSEvents.fullscreenChangeEvent = _malloc(280));
  return JSEvents.registerOrRemoveHandler({target:a, eventTypeString:f, callbackfunc:d, handlerFunc:function(h) {
    h = void 0 === h ? event : h;
    var l = JSEvents.fullscreenChangeEvent;
    fillFullscreenChangeEventData(l);
    getWasmTableEntry(d)(e, l, b) && h.preventDefault();
  }, useCapture:c});
}, _emscripten_set_fullscreenchange_callback_on_thread = function(a, b, c, d, e) {
  if (!JSEvents.fullscreenEnabled()) {
    return -1;
  }
  a = findEventTarget(a);
  if (!a) {
    return -4;
  }
  registerFullscreenChangeEventCallback(a, b, c, d, 19, "mozfullscreenchange", e);
  registerFullscreenChangeEventCallback(a, b, c, d, 19, "webkitfullscreenchange", e);
  registerFullscreenChangeEventCallback(a, b, c, d, 19, "MSFullscreenChange", e);
  return registerFullscreenChangeEventCallback(a, b, c, d, 19, "fullscreenchange", e);
}, registerKeyEventCallback = function(a, b, c, d, e, f, g) {
  JSEvents.keyEvent || (JSEvents.keyEvent = _malloc(176));
  a = {target:findEventTarget(a), allowsDeferredCalls:JSEvents.isInternetExplorer() ? !1 : !0, eventTypeString:f, callbackfunc:d, handlerFunc:function(h) {
    var l = JSEvents.keyEvent;
    HEAPF64[l >> 3] = h.timeStamp;
    var k = l >> 2;
    HEAP32[k + 2] = h.location;
    HEAP32[k + 3] = h.ctrlKey;
    HEAP32[k + 4] = h.shiftKey;
    HEAP32[k + 5] = h.altKey;
    HEAP32[k + 6] = h.metaKey;
    HEAP32[k + 7] = h.repeat;
    HEAP32[k + 8] = h.charCode;
    HEAP32[k + 9] = h.keyCode;
    HEAP32[k + 10] = h.which;
    stringToUTF8(h.key || "", l + 44, 32);
    stringToUTF8(h.code || "", l + 76, 32);
    stringToUTF8(h.char || "", l + 108, 32);
    stringToUTF8(h.locale || "", l + 140, 32);
    getWasmTableEntry(d)(e, l, b) && h.preventDefault();
  }, useCapture:c};
  return JSEvents.registerOrRemoveHandler(a);
}, _emscripten_set_keydown_callback_on_thread = function(a, b, c, d, e) {
  return registerKeyEventCallback(a, b, c, d, 2, "keydown", e);
}, _emscripten_set_keypress_callback_on_thread = function(a, b, c, d, e) {
  return registerKeyEventCallback(a, b, c, d, 1, "keypress", e);
}, _emscripten_set_keyup_callback_on_thread = function(a, b, c, d, e) {
  return registerKeyEventCallback(a, b, c, d, 3, "keyup", e);
}, _emscripten_set_main_loop = function(a, b, c) {
  a = getWasmTableEntry(a);
  setMainLoop(a, b, c);
}, fillMouseEventData = function(a, b, c) {
  HEAPF64[a >> 3] = b.timeStamp;
  a >>= 2;
  HEAP32[a + 2] = b.screenX;
  HEAP32[a + 3] = b.screenY;
  HEAP32[a + 4] = b.clientX;
  HEAP32[a + 5] = b.clientY;
  HEAP32[a + 6] = b.ctrlKey;
  HEAP32[a + 7] = b.shiftKey;
  HEAP32[a + 8] = b.altKey;
  HEAP32[a + 9] = b.metaKey;
  HEAP16[2 * a + 20] = b.button;
  HEAP16[2 * a + 21] = b.buttons;
  HEAP32[a + 11] = b.movementX || b.mozMovementX || b.webkitMovementX || b.screenX - JSEvents.previousScreenX;
  HEAP32[a + 12] = b.movementY || b.mozMovementY || b.webkitMovementY || b.screenY - JSEvents.previousScreenY;
  c = getBoundingClientRect(c);
  HEAP32[a + 13] = b.clientX - c.left;
  HEAP32[a + 14] = b.clientY - c.top;
  "wheel" !== b.type && (JSEvents.previousScreenX = b.screenX, JSEvents.previousScreenY = b.screenY);
}, registerMouseEventCallback = function(a, b, c, d, e, f, g) {
  JSEvents.mouseEvent || (JSEvents.mouseEvent = _malloc(72));
  a = findEventTarget(a);
  c = {target:a, allowsDeferredCalls:"mousemove" != f && "mouseenter" != f && "mouseleave" != f, eventTypeString:f, callbackfunc:d, handlerFunc:function(h) {
    h = void 0 === h ? event : h;
    fillMouseEventData(JSEvents.mouseEvent, h, a);
    getWasmTableEntry(d)(e, JSEvents.mouseEvent, b) && h.preventDefault();
  }, useCapture:c};
  JSEvents.isInternetExplorer() && "mousedown" == f && (c.allowsDeferredCalls = !1);
  return JSEvents.registerOrRemoveHandler(c);
}, _emscripten_set_mousedown_callback_on_thread = function(a, b, c, d, e) {
  return registerMouseEventCallback(a, b, c, d, 5, "mousedown", e);
}, _emscripten_set_mousemove_callback_on_thread = function(a, b, c, d, e) {
  return registerMouseEventCallback(a, b, c, d, 8, "mousemove", e);
}, _emscripten_set_mouseup_callback_on_thread = function(a, b, c, d, e) {
  return registerMouseEventCallback(a, b, c, d, 6, "mouseup", e);
}, registerUiEventCallback = function(a, b, c, d, e, f, g) {
  JSEvents.uiEvent || (JSEvents.uiEvent = _malloc(36));
  a = findEventTarget(a);
  return JSEvents.registerOrRemoveHandler({target:a, eventTypeString:f, callbackfunc:d, handlerFunc:function(h) {
    h = void 0 === h ? event : h;
    if (h.target == a) {
      var l = document.body;
      if (l) {
        var k = JSEvents.uiEvent;
        HEAP32[k >> 2] = h.detail;
        HEAP32[k + 4 >> 2] = l.clientWidth;
        HEAP32[k + 8 >> 2] = l.clientHeight;
        HEAP32[k + 12 >> 2] = innerWidth;
        HEAP32[k + 16 >> 2] = innerHeight;
        HEAP32[k + 20 >> 2] = outerWidth;
        HEAP32[k + 24 >> 2] = outerHeight;
        HEAP32[k + 28 >> 2] = pageXOffset;
        HEAP32[k + 32 >> 2] = pageYOffset;
        getWasmTableEntry(d)(e, k, b) && h.preventDefault();
      }
    }
  }, useCapture:c});
}, _emscripten_set_resize_callback_on_thread = function(a, b, c, d, e) {
  return registerUiEventCallback(a, b, c, d, 10, "resize", e);
}, registerTouchEventCallback = function(a, b, c, d, e, f, g) {
  JSEvents.touchEvent || (JSEvents.touchEvent = _malloc(1696));
  a = findEventTarget(a);
  return JSEvents.registerOrRemoveHandler({target:a, allowsDeferredCalls:"touchstart" == f || "touchend" == f, eventTypeString:f, callbackfunc:d, handlerFunc:function(h) {
    for (var l, k = {}, m = h.touches, n = 0; n < m.length; ++n) {
      l = m[n], l.isChanged = l.onTarget = 0, k[l.identifier] = l;
    }
    for (n = 0; n < h.changedTouches.length; ++n) {
      l = h.changedTouches[n], l.isChanged = 1, k[l.identifier] = l;
    }
    for (n = 0; n < h.targetTouches.length; ++n) {
      k[h.targetTouches[n].identifier].onTarget = 1;
    }
    m = JSEvents.touchEvent;
    HEAPF64[m >> 3] = h.timeStamp;
    var p = m >> 2;
    HEAP32[p + 3] = h.ctrlKey;
    HEAP32[p + 4] = h.shiftKey;
    HEAP32[p + 5] = h.altKey;
    HEAP32[p + 6] = h.metaKey;
    p += 7;
    var q = getBoundingClientRect(a), r = 0;
    for (n in k) {
      if (l = k[n], HEAP32[p + 0] = l.identifier, HEAP32[p + 1] = l.screenX, HEAP32[p + 2] = l.screenY, HEAP32[p + 3] = l.clientX, HEAP32[p + 4] = l.clientY, HEAP32[p + 5] = l.pageX, HEAP32[p + 6] = l.pageY, HEAP32[p + 7] = l.isChanged, HEAP32[p + 8] = l.onTarget, HEAP32[p + 9] = l.clientX - q.left, HEAP32[p + 10] = l.clientY - q.top, p += 13, 31 < ++r) {
        break;
      }
    }
    HEAP32[m + 8 >> 2] = r;
    getWasmTableEntry(d)(e, m, b) && h.preventDefault();
  }, useCapture:c});
}, _emscripten_set_touchcancel_callback_on_thread = function(a, b, c, d, e) {
  return registerTouchEventCallback(a, b, c, d, 25, "touchcancel", e);
}, _emscripten_set_touchend_callback_on_thread = function(a, b, c, d, e) {
  return registerTouchEventCallback(a, b, c, d, 23, "touchend", e);
}, _emscripten_set_touchmove_callback_on_thread = function(a, b, c, d, e) {
  return registerTouchEventCallback(a, b, c, d, 24, "touchmove", e);
}, _emscripten_set_touchstart_callback_on_thread = function(a, b, c, d, e) {
  return registerTouchEventCallback(a, b, c, d, 22, "touchstart", e);
}, fillVisibilityChangeEventData = function(a) {
  var b = ["hidden", "visible", "prerender", "unloaded"].indexOf(document.visibilityState);
  HEAP32[a >> 2] = document.hidden;
  HEAP32[a + 4 >> 2] = b;
}, registerVisibilityChangeEventCallback = function(a, b, c, d, e, f, g) {
  JSEvents.visibilityChangeEvent || (JSEvents.visibilityChangeEvent = _malloc(8));
  return JSEvents.registerOrRemoveHandler({target:a, eventTypeString:f, callbackfunc:d, handlerFunc:function(h) {
    h = void 0 === h ? event : h;
    var l = JSEvents.visibilityChangeEvent;
    fillVisibilityChangeEventData(l);
    getWasmTableEntry(d)(e, l, b) && h.preventDefault();
  }, useCapture:c});
}, _emscripten_set_visibilitychange_callback_on_thread = function(a, b, c, d) {
  return registerVisibilityChangeEventCallback(specialHTMLTargets[1], a, b, c, 21, "visibilitychange", d);
}, registerWebGlEventCallback = function(a, b, c, d, e, f, g) {
  a = {target:findEventTarget(a), eventTypeString:f, callbackfunc:d, handlerFunc:function(h) {
    h = void 0 === h ? event : h;
    getWasmTableEntry(d)(e, 0, b) && h.preventDefault();
  }, useCapture:c};
  JSEvents.registerOrRemoveHandler(a);
}, _emscripten_set_webglcontextlost_callback_on_thread = function(a, b, c, d, e) {
  registerWebGlEventCallback(a, b, c, d, 31, "webglcontextlost", e);
  return 0;
}, registerWheelEventCallback = function(a, b, c, d, e, f, g) {
  JSEvents.wheelEvent || (JSEvents.wheelEvent = _malloc(104));
  g = function(l) {
    l = void 0 === l ? event : l;
    var k = JSEvents.wheelEvent;
    fillMouseEventData(k, l, a);
    HEAPF64[k + 72 >> 3] = l.deltaX;
    HEAPF64[k + 80 >> 3] = l.deltaY;
    HEAPF64[k + 88 >> 3] = l.deltaZ;
    HEAP32[k + 96 >> 2] = l.deltaMode;
    getWasmTableEntry(d)(e, k, b) && l.preventDefault();
  };
  var h = function(l) {
    l = void 0 === l ? event : l;
    fillMouseEventData(JSEvents.wheelEvent, l, a);
    HEAPF64[JSEvents.wheelEvent + 72 >> 3] = l.wheelDeltaX || 0;
    HEAPF64[JSEvents.wheelEvent + 80 >> 3] = -(l.wheelDeltaY || l.wheelDelta);
    HEAPF64[JSEvents.wheelEvent + 88 >> 3] = 0;
    HEAP32[JSEvents.wheelEvent + 96 >> 2] = 0;
    getWasmTableEntry(d)(e, JSEvents.wheelEvent, b) && l.preventDefault();
  };
  return JSEvents.registerOrRemoveHandler({target:a, allowsDeferredCalls:!0, eventTypeString:f, callbackfunc:d, handlerFunc:"wheel" == f ? g : h, useCapture:c});
}, _emscripten_set_wheel_callback_on_thread = function(a, b, c, d, e) {
  return (a = findEventTarget(a)) ? "undefined" != typeof a.onwheel ? registerWheelEventCallback(a, b, c, d, 9, "wheel", e) : "undefined" != typeof a.onmousewheel ? registerWheelEventCallback(a, b, c, d, 9, "mousewheel", e) : -1 : -4;
}, emscripten_webgl_power_preferences = ["default", "low-power", "high-performance"], _emscripten_webgl_do_create_context = function(a, b) {
  b >>= 2;
  b = {alpha:!!HEAP32[b + 0], depth:!!HEAP32[b + 1], stencil:!!HEAP32[b + 2], antialias:!!HEAP32[b + 3], premultipliedAlpha:!!HEAP32[b + 4], preserveDrawingBuffer:!!HEAP32[b + 5], powerPreference:emscripten_webgl_power_preferences[HEAP32[b + 6]], failIfMajorPerformanceCaveat:!!HEAP32[b + 7], majorVersion:HEAP32[b + 8], minorVersion:HEAP32[b + 9], enableExtensionsByDefault:HEAP32[b + 10], explicitSwapControl:HEAP32[b + 11], proxyContextToMainThread:HEAP32[b + 12], renderViaOffscreenBackBuffer:HEAP32[b + 
  13]};
  a = findCanvasEventTarget(a);
  return !a || b.explicitSwapControl ? 0 : GL.createContext(a, b);
}, _emscripten_webgl_create_context = _emscripten_webgl_do_create_context, _emscripten_webgl_destroy_context = function(a) {
  GL.currentContext == a && (GL.currentContext = 0);
  GL.deleteContext(a);
}, _emscripten_webgl_init_context_attributes = function(a) {
  a >>= 2;
  for (var b = 0; 14 > b; ++b) {
    HEAP32[a + b] = 0;
  }
  HEAP32[a + 0] = HEAP32[a + 1] = HEAP32[a + 3] = HEAP32[a + 4] = HEAP32[a + 8] = HEAP32[a + 10] = 1;
}, _emscripten_webgl_make_context_current = function(a) {
  return GL.makeContextCurrent(a) ? 0 : -5;
};
function _fd_close(a) {
  try {
    var b = SYSCALLS.getStreamFromFD(a);
    FS.close(b);
    return 0;
  } catch (c) {
    if ("undefined" == typeof FS || "ErrnoError" !== c.name) {
      throw c;
    }
    return c.errno;
  }
}
var doReadv = function(a, b, c, d) {
  for (var e = 0, f = 0; f < c; f++) {
    var g = HEAPU32[b >> 2], h = HEAPU32[b + 4 >> 2];
    b += 8;
    g = FS.read(a, HEAP8, g, h, d);
    if (0 > g) {
      return -1;
    }
    e += g;
    if (g < h) {
      break;
    }
    "undefined" !== typeof d && (d += g);
  }
  return e;
};
function _fd_read(a, b, c, d) {
  try {
    var e = SYSCALLS.getStreamFromFD(a), f = doReadv(e, b, c);
    HEAPU32[d >> 2] = f;
    return 0;
  } catch (g) {
    if ("undefined" == typeof FS || "ErrnoError" !== g.name) {
      throw g;
    }
    return g.errno;
  }
}
var convertI32PairToI53Checked = function(a, b) {
  return b + 2097152 >>> 0 < 4194305 - !!a ? (a >>> 0) + 4294967296 * b : NaN;
};
function _fd_seek(a, b, c, d, e) {
  b = convertI32PairToI53Checked(b, c);
  try {
    if (isNaN(b)) {
      return 61;
    }
    var f = SYSCALLS.getStreamFromFD(a);
    FS.llseek(f, b, d);
    tempI64 = [f.position >>> 0, (tempDouble = f.position, 1 <= +Math.abs(tempDouble) ? 0 < tempDouble ? +Math.floor(tempDouble / 4294967296) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)];
    HEAP32[e >> 2] = tempI64[0];
    HEAP32[e + 4 >> 2] = tempI64[1];
    f.getdents && 0 === b && 0 === d && (f.getdents = null);
    return 0;
  } catch (g) {
    if ("undefined" == typeof FS || "ErrnoError" !== g.name) {
      throw g;
    }
    return g.errno;
  }
}
var doWritev = function(a, b, c, d) {
  for (var e = 0, f = 0; f < c; f++) {
    var g = HEAPU32[b >> 2], h = HEAPU32[b + 4 >> 2];
    b += 8;
    g = FS.write(a, HEAP8, g, h, d);
    if (0 > g) {
      return -1;
    }
    e += g;
    "undefined" !== typeof d && (d += g);
  }
  return e;
};
function _fd_write(a, b, c, d) {
  try {
    var e = SYSCALLS.getStreamFromFD(a), f = doWritev(e, b, c);
    HEAPU32[d >> 2] = f;
    return 0;
  } catch (g) {
    if ("undefined" == typeof FS || "ErrnoError" !== g.name) {
      throw g;
    }
    return g.errno;
  }
}
var _glAttachShader = function(a, b) {
  GLctx.attachShader(GL.programs[a], GL.shaders[b]);
}, _glBindAttribLocation = function(a, b, c) {
  GLctx.bindAttribLocation(GL.programs[a], b, UTF8ToString(c));
}, _glBindBuffer = function(a, b) {
  GLctx.bindBuffer(a, GL.buffers[b]);
}, _glBindTexture = function(a, b) {
  GLctx.bindTexture(a, GL.textures[b]);
};
function _glBlendFunc(a, b) {
  GLctx.blendFunc(a, b);
}
var _glBufferData = function(a, b, c, d) {
  GLctx.bufferData(a, c ? HEAPU8.subarray(c, c + b) : b, d);
}, _glBufferSubData = function(a, b, c, d) {
  GLctx.bufferSubData(a, b, HEAPU8.subarray(d, d + c));
};
function _glClear(a) {
  GLctx.clear(a);
}
function _glClearColor(a, b, c, d) {
  GLctx.clearColor(a, b, c, d);
}
var _glColorMask = function(a, b, c, d) {
  GLctx.colorMask(!!a, !!b, !!c, !!d);
}, _glCompileShader = function(a) {
  GLctx.compileShader(GL.shaders[a]);
}, _glCreateProgram = function() {
  var a = GL.getNewId(GL.programs), b = GLctx.createProgram();
  b.name = a;
  b.maxUniformLength = b.maxAttributeLength = b.maxUniformBlockNameLength = 0;
  b.uniformIdCounter = 1;
  GL.programs[a] = b;
  return a;
}, _glCreateShader = function(a) {
  var b = GL.getNewId(GL.shaders);
  GL.shaders[b] = GLctx.createShader(a);
  return b;
}, _glDeleteBuffers = function(a, b) {
  for (var c = 0; c < a; c++) {
    var d = HEAP32[b + 4 * c >> 2], e = GL.buffers[d];
    e && (GLctx.deleteBuffer(e), e.name = 0, GL.buffers[d] = null);
  }
}, _glDeleteProgram = function(a) {
  if (a) {
    var b = GL.programs[a];
    b ? (GLctx.deleteProgram(b), b.name = 0, GL.programs[a] = null) : GL.recordError(1281);
  }
}, _glDeleteShader = function(a) {
  if (a) {
    var b = GL.shaders[a];
    b ? (GLctx.deleteShader(b), GL.shaders[a] = null) : GL.recordError(1281);
  }
}, _glDeleteTextures = function(a, b) {
  for (var c = 0; c < a; c++) {
    var d = HEAP32[b + 4 * c >> 2], e = GL.textures[d];
    e && (GLctx.deleteTexture(e), e.name = 0, GL.textures[d] = null);
  }
};
function _glDepthFunc(a) {
  GLctx.depthFunc(a);
}
var _glDepthMask = function(a) {
  GLctx.depthMask(!!a);
}, _glDetachShader = function(a, b) {
  GLctx.detachShader(GL.programs[a], GL.shaders[b]);
};
function _glDisable(a) {
  GLctx.disable(a);
}
var _glDisableVertexAttribArray = function(a) {
  GLctx.disableVertexAttribArray(a);
}, _glDrawArrays = function(a, b, c) {
  GLctx.drawArrays(a, b, c);
}, _glDrawElements = function(a, b, c, d) {
  GLctx.drawElements(a, b, c, d);
};
function _glEnable(a) {
  GLctx.enable(a);
}
var _glEnableVertexAttribArray = function(a) {
  GLctx.enableVertexAttribArray(a);
}, __glGenObject = function(a, b, c, d) {
  for (var e = 0; e < a; e++) {
    var f = GLctx[c](), g = f && GL.getNewId(d);
    f ? (f.name = g, d[g] = f) : GL.recordError(1282);
    HEAP32[b + 4 * e >> 2] = g;
  }
}, _glGenBuffers = function(a, b) {
  __glGenObject(a, b, "createBuffer", GL.buffers);
}, _glGenTextures = function(a, b) {
  __glGenObject(a, b, "createTexture", GL.textures);
}, writeI53ToI64 = function(a, b) {
  HEAPU32[a >> 2] = b;
  HEAPU32[a + 4 >> 2] = (b - HEAPU32[a >> 2]) / 4294967296;
}, emscriptenWebGLGet = function(a, b, c) {
  if (b) {
    var d = void 0;
    switch(a) {
      case 36346:
        d = 1;
        break;
      case 36344:
        0 != c && 1 != c && GL.recordError(1280);
        return;
      case 36345:
        d = 0;
        break;
      case 34466:
        var e = GLctx.getParameter(34467);
        d = e ? e.length : 0;
    }
    if (void 0 === d) {
      switch(e = GLctx.getParameter(a), typeof e) {
        case "number":
          d = e;
          break;
        case "boolean":
          d = e ? 1 : 0;
          break;
        case "string":
          GL.recordError(1280);
          return;
        case "object":
          if (null === e) {
            switch(a) {
              case 34964:
              case 35725:
              case 34965:
              case 36006:
              case 36007:
              case 32873:
              case 34229:
              case 34068:
                d = 0;
                break;
              default:
                GL.recordError(1280);
                return;
            }
          } else {
            if (e instanceof Float32Array || e instanceof Uint32Array || e instanceof Int32Array || e instanceof Array) {
              for (a = 0; a < e.length; ++a) {
                switch(c) {
                  case 0:
                    HEAP32[b + 4 * a >> 2] = e[a];
                    break;
                  case 2:
                    HEAPF32[b + 4 * a >> 2] = e[a];
                    break;
                  case 4:
                    HEAP8[b + a >> 0] = e[a] ? 1 : 0;
                }
              }
              return;
            }
            try {
              d = e.name | 0;
            } catch (f) {
              GL.recordError(1280);
              err("GL_INVALID_ENUM in glGet" + c + "v: Unknown object returned from WebGL getParameter(" + a + ")! (error: " + f + ")");
              return;
            }
          }
          break;
        default:
          GL.recordError(1280);
          err("GL_INVALID_ENUM in glGet" + c + "v: Native code calling glGet" + c + "v(" + a + ") and it returns " + e + " of type " + typeof e + "!");
          return;
      }
    }
    switch(c) {
      case 1:
        writeI53ToI64(b, d);
        break;
      case 0:
        HEAP32[b >> 2] = d;
        break;
      case 2:
        HEAPF32[b >> 2] = d;
        break;
      case 4:
        HEAP8[b >> 0] = d ? 1 : 0;
    }
  } else {
    GL.recordError(1281);
  }
}, _glGetIntegerv = function(a, b) {
  return emscriptenWebGLGet(a, b, 0);
}, _glGetProgramInfoLog = function(a, b, c, d) {
  a = GLctx.getProgramInfoLog(GL.programs[a]);
  null === a && (a = "(unknown error)");
  b = 0 < b && d ? stringToUTF8(a, d, b) : 0;
  c && (HEAP32[c >> 2] = b);
}, _glGetProgramiv = function(a, b, c) {
  if (c) {
    if (a >= GL.counter) {
      GL.recordError(1281);
    } else {
      if (a = GL.programs[a], 35716 == b) {
        a = GLctx.getProgramInfoLog(a), null === a && (a = "(unknown error)"), HEAP32[c >> 2] = a.length + 1;
      } else if (35719 == b) {
        if (!a.maxUniformLength) {
          for (b = 0; b < GLctx.getProgramParameter(a, 35718); ++b) {
            a.maxUniformLength = Math.max(a.maxUniformLength, GLctx.getActiveUniform(a, b).name.length + 1);
          }
        }
        HEAP32[c >> 2] = a.maxUniformLength;
      } else if (35722 == b) {
        if (!a.maxAttributeLength) {
          for (b = 0; b < GLctx.getProgramParameter(a, 35721); ++b) {
            a.maxAttributeLength = Math.max(a.maxAttributeLength, GLctx.getActiveAttrib(a, b).name.length + 1);
          }
        }
        HEAP32[c >> 2] = a.maxAttributeLength;
      } else if (35381 == b) {
        if (!a.maxUniformBlockNameLength) {
          for (b = 0; b < GLctx.getProgramParameter(a, 35382); ++b) {
            a.maxUniformBlockNameLength = Math.max(a.maxUniformBlockNameLength, GLctx.getActiveUniformBlockName(a, b).length + 1);
          }
        }
        HEAP32[c >> 2] = a.maxUniformBlockNameLength;
      } else {
        HEAP32[c >> 2] = GLctx.getProgramParameter(a, b);
      }
    }
  } else {
    GL.recordError(1281);
  }
}, _glGetShaderInfoLog = function(a, b, c, d) {
  a = GLctx.getShaderInfoLog(GL.shaders[a]);
  null === a && (a = "(unknown error)");
  b = 0 < b && d ? stringToUTF8(a, d, b) : 0;
  c && (HEAP32[c >> 2] = b);
}, _glGetShaderiv = function(a, b, c) {
  c ? 35716 == b ? (a = GLctx.getShaderInfoLog(GL.shaders[a]), null === a && (a = "(unknown error)"), HEAP32[c >> 2] = a ? a.length + 1 : 0) : 35720 == b ? (a = GLctx.getShaderSource(GL.shaders[a]), HEAP32[c >> 2] = a ? a.length + 1 : 0) : HEAP32[c >> 2] = GLctx.getShaderParameter(GL.shaders[a], b) : GL.recordError(1281);
}, stringToNewUTF8 = function(a) {
  var b = lengthBytesUTF8(a) + 1, c = _malloc(b);
  c && stringToUTF8(a, c, b);
  return c;
}, _glGetString = function(a) {
  var b = GL.stringCache[a];
  if (!b) {
    switch(a) {
      case 7939:
        b = stringToNewUTF8(GL.getExtensions().join(" "));
        break;
      case 7936:
      case 7937:
      case 37445:
      case 37446:
        (b = GLctx.getParameter(a)) || GL.recordError(1280);
        b = b ? stringToNewUTF8(b) : 0;
        break;
      case 7938:
        b = GLctx.getParameter(7938);
        b = stringToNewUTF8("OpenGL ES 2.0 (" + b + ")");
        break;
      case 35724:
        b = GLctx.getParameter(35724);
        var c = b.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
        null !== c && (3 == c[1].length && (c[1] += "0"), b = "OpenGL ES GLSL ES " + c[1] + " (" + b + ")");
        b = stringToNewUTF8(b);
        break;
      default:
        GL.recordError(1280);
    }
    GL.stringCache[a] = b;
  }
  return b;
}, jstoi_q = function(a) {
  return parseInt(a);
}, webglGetLeftBracePos = function(a) {
  return "]" == a.slice(-1) && a.lastIndexOf("[");
}, webglPrepareUniformLocationsBeforeFirstUse = function(a) {
  var b = a.uniformLocsById, c = a.uniformSizeAndIdsByName, d;
  if (!b) {
    for (a.uniformLocsById = b = {}, a.uniformArrayNamesById = {}, d = 0; d < GLctx.getProgramParameter(a, 35718); ++d) {
      var e = GLctx.getActiveUniform(a, d);
      var f = e.name;
      e = e.size;
      var g = webglGetLeftBracePos(f);
      g = 0 < g ? f.slice(0, g) : f;
      var h = a.uniformIdCounter;
      a.uniformIdCounter += e;
      c[g] = [e, h];
      for (f = 0; f < e; ++f) {
        b[h] = f, a.uniformArrayNamesById[h++] = g;
      }
    }
  }
}, _glGetUniformLocation = function(a, b) {
  b = UTF8ToString(b);
  if (a = GL.programs[a]) {
    webglPrepareUniformLocationsBeforeFirstUse(a);
    var c = a.uniformLocsById, d = 0, e = b, f = webglGetLeftBracePos(b);
    0 < f && (d = jstoi_q(b.slice(f + 1)) >>> 0, e = b.slice(0, f));
    if ((e = a.uniformSizeAndIdsByName[e]) && d < e[0] && (d += e[1], c[d] = c[d] || GLctx.getUniformLocation(a, b))) {
      return d;
    }
  } else {
    GL.recordError(1281);
  }
  return -1;
}, _glLinkProgram = function(a) {
  a = GL.programs[a];
  GLctx.linkProgram(a);
  a.uniformLocsById = 0;
  a.uniformSizeAndIdsByName = {};
}, _glShaderSource = function(a, b, c, d) {
  b = GL.getSource(a, b, c, d);
  GLctx.shaderSource(GL.shaders[a], b);
}, computeUnpackAlignedImageSize = function(a, b, c, d) {
  return b * (a * c + d - 1 & -d);
}, colorChannelsInGlTextureFormat = function(a) {
  return {5:3, 6:4, 8:2, 29502:3, 29504:4}[a - 6402] || 1;
}, heapObjectForWebGLType = function(a) {
  a -= 5120;
  return 1 == a ? HEAPU8 : 4 == a ? HEAP32 : 6 == a ? HEAPF32 : 5 == a || 28922 == a ? HEAPU32 : HEAPU16;
}, heapAccessShiftForWebGLHeap = function(a) {
  return 31 - Math.clz32(a.BYTES_PER_ELEMENT);
}, emscriptenWebGLGetTexPixelData = function(a, b, c, d, e, f) {
  a = heapObjectForWebGLType(a);
  f = heapAccessShiftForWebGLHeap(a);
  var g = 1 << f;
  b = colorChannelsInGlTextureFormat(b) * g;
  c = computeUnpackAlignedImageSize(c, d, b, GL.unpackAlignment);
  return a.subarray(e >> f, e + c >> f);
}, _glTexImage2D = function(a, b, c, d, e, f, g, h, l) {
  GLctx.texImage2D(a, b, c, d, e, f, g, h, l ? emscriptenWebGLGetTexPixelData(h, g, d, e, l, c) : null);
};
function _glTexParameteri(a, b, c) {
  GLctx.texParameteri(a, b, c);
}
var _glTexSubImage2D = function(a, b, c, d, e, f, g, h, l) {
  var k = null;
  l && (k = emscriptenWebGLGetTexPixelData(h, g, e, f, l, 0));
  GLctx.texSubImage2D(a, b, c, d, e, f, g, h, k);
}, webglGetUniformLocation = function(a) {
  var b = GLctx.currentProgram;
  if (b) {
    var c = b.uniformLocsById[a];
    "number" == typeof c && (b.uniformLocsById[a] = c = GLctx.getUniformLocation(b, b.uniformArrayNamesById[a] + (0 < c ? "[" + c + "]" : "")));
    return c;
  }
  GL.recordError(1282);
}, _glUniform1f = function(a, b) {
  GLctx.uniform1f(webglGetUniformLocation(a), b);
}, _glUniform2f = function(a, b, c) {
  GLctx.uniform2f(webglGetUniformLocation(a), b, c);
}, _glUniform3f = function(a, b, c, d) {
  GLctx.uniform3f(webglGetUniformLocation(a), b, c, d);
}, miniTempWebGLFloatBuffers = [], _glUniformMatrix4fv = function(a, b, c, d) {
  if (18 >= b) {
    var e = miniTempWebGLFloatBuffers[16 * b - 1], f = HEAPF32;
    d >>= 2;
    for (var g = 0; g < 16 * b; g += 16) {
      var h = d + g;
      e[g] = f[h];
      e[g + 1] = f[h + 1];
      e[g + 2] = f[h + 2];
      e[g + 3] = f[h + 3];
      e[g + 4] = f[h + 4];
      e[g + 5] = f[h + 5];
      e[g + 6] = f[h + 6];
      e[g + 7] = f[h + 7];
      e[g + 8] = f[h + 8];
      e[g + 9] = f[h + 9];
      e[g + 10] = f[h + 10];
      e[g + 11] = f[h + 11];
      e[g + 12] = f[h + 12];
      e[g + 13] = f[h + 13];
      e[g + 14] = f[h + 14];
      e[g + 15] = f[h + 15];
    }
  } else {
    e = HEAPF32.subarray(d >> 2, d + 64 * b >> 2), GL.currentContext.cannotHandleOffsetsInUniformArrayViews && (e = new Float32Array(e));
  }
  GLctx.uniformMatrix4fv(webglGetUniformLocation(a), !!c, e);
}, _glUseProgram = function(a) {
  a = GL.programs[a];
  GLctx.useProgram(a);
  GLctx.currentProgram = a;
}, _glVertexAttribPointer = function(a, b, c, d, e, f) {
  GLctx.vertexAttribPointer(a, b, c, !!d, e, f);
};
function _glViewport(a, b, c, d) {
  GLctx.viewport(a, b, c, d);
}
function _interop_AddClipboardListeners() {
  window.addEventListener("copy", function(a) {
    window.getSelection && window.getSelection().toString() || (_interop_callVoidFunc("Window_RequestClipboardText"), window.cc_copyText && (a.clipboardData && (a.clipboardData.setData("text/plain", window.cc_copyText), a.preventDefault()), window.cc_copyText = null));
  });
  window.addEventListener("paste", function(a) {
    a.clipboardData && (a = a.clipboardData.getData("text/plain"), _interop_callStringFunc("Window_GotClipboardText", a));
  });
}
function _interop_AdjustXY(a, b) {
  var c = Module.canvas.getBoundingClientRect();
  HEAP32[a >> 2] -= c.left;
  HEAP32[b >> 2] -= c.top;
}
function _fetchTexturePackAsync(a, b, c) {
  var d = new XMLHttpRequest();
  d.open("GET", a);
  d.responseType = "arraybuffer";
  d.onerror = c;
  d.onload = function() {
    200 == d.status ? b(d.response) : c();
  };
  d.send();
}
function _interop_AsyncDownloadTexturePack(a) {
  var b = UTF8ToString(a);
  Module.setStatus("Downloading textures.. (1/2)");
  _fetchTexturePackAsync("texpacks/default.zip", function(c) {
    CCFS.writeFile(b, new Uint8Array(c));
    _interop_callVoidFunc("main_phase1");
  }, function() {
    _interop_callVoidFunc("main_phase1");
  });
}
function _IDBFS_getDB(a) {
  var b = window.IDBFS_db;
  if (b) {
    return a(null, b);
  }
  IDBFS_DB_VERSION = 21;
  IDBFS_DB_STORE_NAME = "FILE_DATA";
  var c = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  if (!c) {
    return a("IndexedDB unsupported");
  }
  try {
    var d = c.open("/classicube", IDBFS_DB_VERSION);
  } catch (e) {
    return a(e);
  }
  if (!d) {
    return a("Unable to connect to IndexedDB");
  }
  d.onupgradeneeded = function(e) {
    var f = e.target.result;
    e = e.target.transaction;
    f = f.objectStoreNames.contains(IDBFS_DB_STORE_NAME) ? e.objectStore(IDBFS_DB_STORE_NAME) : f.createObjectStore(IDBFS_DB_STORE_NAME);
    f.indexNames.contains("timestamp") || f.createIndex("timestamp", "timestamp", {unique:!1});
  };
  d.onsuccess = function() {
    b = d.result;
    window.IDBFS_db = b;
    b.onclose = function(e) {
      console.log("IndexedDB connection closed unexpectedly!");
      window.IDBFS_db = null;
    };
    a(null, b);
  };
  d.onerror = function(e) {
    a(this.error);
    e.preventDefault();
  };
}
function _IDBFS_getRemoteSet(a) {
  var b = {};
  _IDBFS_getDB(function(c, d) {
    if (c) {
      return a(c);
    }
    try {
      var e = d.transaction([IDBFS_DB_STORE_NAME], "readonly");
      e.onerror = function(f) {
        a(this.error);
        f.preventDefault();
      };
      e.objectStore(IDBFS_DB_STORE_NAME).index("timestamp").openKeyCursor().onsuccess = function(f) {
        f = f.target.result;
        if (!f) {
          return a(null, {type:"remote", db:d, entries:b});
        }
        b[f.primaryKey] = {timestamp:f.key};
        f.continue();
      };
    } catch (f) {
      return a(f);
    }
  });
}
function _IDBFS_loadRemoteEntry(a, b, c) {
  a = a.get(b);
  a.onsuccess = function(d) {
    c(null, d.target.result);
  };
  a.onerror = function(d) {
    c(this.error);
    d.preventDefault();
  };
}
function _IDBFS_storeLocalEntry(a, b, c) {
  try {
    CCFS.isFile(b.mode) && (CCFS.writeFile(a, b.contents), CCFS.utime(a, b.timestamp));
  } catch (d) {
    return c(d);
  }
  c(null);
}
function _IDBFS_reconcile(a, b) {
  function c(h) {
    if (h) {
      if (!c.errored) {
        return c.errored = !0, b(h);
      }
    } else {
      if (++f >= d) {
        return b(null);
      }
    }
  }
  var d = 0, e = [];
  Object.keys(a.entries).forEach(function(h) {
    e.push(h);
    d++;
  });
  if (!d) {
    return b(null);
  }
  var f = 0;
  a = a.db.transaction([IDBFS_DB_STORE_NAME], "readwrite");
  var g = a.objectStore(IDBFS_DB_STORE_NAME);
  a.onerror = function(h) {
    c(this.error);
    h.preventDefault();
  };
  e.sort().forEach(function(h) {
    _IDBFS_loadRemoteEntry(g, h, function(l, k) {
      if (l) {
        return c(l);
      }
      _IDBFS_storeLocalEntry(h, k, c);
    });
  });
}
function _IDBFS_loadFS(a) {
  _IDBFS_getRemoteSet(function(b, c) {
    if (b) {
      return a(b);
    }
    _IDBFS_reconcile(c, a);
  });
}
function _interop_AsyncLoadIndexedDB() {
  Module.setStatus("Preloading filesystem.. (2/2)");
  _IDBFS_loadFS(function(a) {
    a && (window.cc_idbErr = a);
    Module.setStatus("");
    _interop_callVoidFunc("main_phase2");
  });
}
function _interop_AudioClose(a) {
  var b = AUDIO.sources[a - 1 | 0];
  b.source && b.source.stop();
  AUDIO.sources[a - 1 | 0] = null;
}
function _interop_AudioCreate() {
  var a = {source:null, gain:AUDIO.context.createGain(), playing:!1};
  AUDIO.sources.push(a);
  return AUDIO.sources.length | 0;
}
function _interop_AudioDescribe(a, b, c) {
  return a > AUDIO.errors.length ? 0 : stringToUTF8(AUDIO.errors[a - 1], b, c);
}
function _interop_AudioDownload(a) {
  var b = new XMLHttpRequest();
  b.open("GET", "/static/sounds/" + a + ".wav", !0);
  b.responseType = "arraybuffer";
  b.onload = function() {
    AUDIO.context.decodeAudioData(b.response, function(c) {
      AUDIO.buffers[a] = c;
    });
  };
  b.send();
}
function _interop_AudioPlay(a, b, c) {
  a = AUDIO.sources[a - 1 | 0];
  b = UTF8ToString(b);
  if (!AUDIO.seen.hasOwnProperty(b)) {
    return AUDIO.seen[b] = !0, _interop_AudioDownload(b), 0;
  }
  b = AUDIO.buffers[b];
  if (!b) {
    return 0;
  }
  try {
    return a.source = AUDIO.context.createBufferSource(), a.source.buffer = b, a.source.playbackRate.value = c / 100, a.source.connect(a.gain), a.gain.connect(AUDIO.context.destination), a.source.start(), 0;
  } catch (d) {
    return _interop_AudioLog(d);
  }
}
function _interop_AudioPoll(a, b) {
  HEAP32[b >> 2] = AUDIO.sources[a - 1 | 0].playing;
  return 0;
}
function _interop_AudioVolume(a, b) {
  AUDIO.sources[a - 1 | 0].gain.gain.value = b / 100;
}
function _interop_CanvasHeight() {
  return Module.canvas.height;
}
function _interop_CanvasWidth() {
  return Module.canvas.width;
}
function _interop_CloseKeyboard() {
  window.cc_inputElem && (window.cc_container.removeChild(window.cc_divElem), window.cc_container.removeChild(window.cc_inputElem), window.cc_divElem = null, window.cc_inputElem = null);
}
function _interop_DirectoryIter(a) {
  a = UTF8ToString(a);
  try {
    for (var b = CCFS.readdir(a), c = 0; c < b.length; c++) {
      a = b[c], 0 === a.indexOf(CCFS.currentPath) && (a = a.substring(CCFS.currentPath.length + 1)), _interop_callStringFunc("Directory_IterCallback", a);
    }
    return 0;
  } catch (d) {
    return d instanceof CCFS.ErrnoError || abort(d), -d.errno;
  }
}
function _interop_DirectorySetWorking(a) {
  a = UTF8ToString(a);
  CCFS.chdir(a);
}
function _interop_DownloadAsync(a, b, c) {
  a = UTF8ToString(a);
  var d = Module._Http_OnFinishedAsync, e = Module._Http_OnUpdateProgress, f = new XMLHttpRequest();
  try {
    f.open(1 == b ? "HEAD" : "GET", a);
  } catch (g) {
    return console.log(g), 1;
  }
  f.responseType = "arraybuffer";
  f.onload = function(g) {
    var h = new Uint8Array(f.response), l = h.byteLength, k = _malloc(l);
    HEAPU8.set(h, k);
    if (!(h = l)) {
      if (g.total) {
        h = g.total;
      } else {
        try {
          var m = f.getResponseHeader("Content-Length");
          h = parseInt(m, 10);
        } catch (n) {
          h = 0;
        }
      }
    }
    d(c, k, h, f.status);
  };
  f.onerror = function(g) {
    d(c, 0, 0, f.status);
  };
  f.ontimeout = function(g) {
    d(c, 0, 0, f.status);
  };
  f.onprogress = function(g) {
    e(c, g.loaded, g.total);
  };
  try {
    f.send();
  } catch (g) {
    d(c, 0, 0, 0);
  }
  return 0;
}
function _interop_SaveBlob(a, b) {
  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(a, b);
  } else {
    a = window.URL.createObjectURL(a);
    var c = document.createElement("a");
    c.href = a;
    c.download = b;
    c.style.display = "none";
    document.body.appendChild(c);
    c.click();
    document.body.removeChild(c);
    window.URL.revokeObjectURL(a);
  }
}
function _interop_ShowSaveDialog(a, b, c) {
  if (!window.showSaveFilePicker) {
    return 0;
  }
  for (var d = [], e = 0; HEAP32[(b >> 2) + e | 0]; e++) {
    var f = HEAP32[(b >> 2) + e | 0];
    f = {description:UTF8ToString(HEAP32[(c >> 2) + e | 0]), accept:{"application/octet-stream":[UTF8ToString(f)]}};
    d.push(f);
  }
  var g = null;
  a = {suggestedName:UTF8ToString(a), types:d};
  window.showSaveFilePicker(a).then(function(h) {
    g = "Downloads/" + h.name;
    return h.createWritable();
  }).then(function(h) {
    _interop_callStringFunc("Window_OnFileUploaded", g);
    var l = CCFS.readFile(g);
    h.write(l);
    return h.close();
  }).catch(function(h) {
    _interop_callStringFunc("Platform_LogError", "&cError downloading file");
    _interop_callStringFunc("Platform_LogError", "   &c" + h);
  }).finally(function(h) {
    g && CCFS.unlink(g);
  });
  return 1;
}
function _interop_DownloadFile(a, b, c) {
  try {
    if (_interop_ShowSaveDialog(a, b, c)) {
      return 0;
    }
    var d = "Downloads/" + UTF8ToString(a);
    _interop_callStringFunc("Window_OnFileUploaded", d);
    var e = CCFS.readFile(d), f = new Blob([e], {type:"application/octet-stream"});
    _interop_SaveBlob(f, UTF8ToString(a));
    CCFS.unlink(d);
    return 0;
  } catch (g) {
    return g instanceof CCFS.ErrnoError || abort(g), g.errno;
  }
}
function _interop_EnterFullscreen() {
  var a = Module.canvas;
  a.style.width = "100%";
  a.style.height = "100%";
  try {
    navigator.keyboard.lock(["Escape"]);
  } catch (b) {
  }
}
function _interop_FS_Init() {
  window.CCFS || (window.MEMFS = {createNode:function(a) {
    a = CCFS.createNode(a);
    a.usedBytes = 0;
    a.contents = null;
    a.timestamp = Date.now();
    return a;
  }, getFileDataAsTypedArray:function(a) {
    return a.contents ? a.contents.subarray ? a.contents.subarray(0, a.usedBytes) : new Uint8Array(a.contents) : new Uint8Array();
  }, expandFileStorage:function(a, b) {
    var c = a.contents ? a.contents.length : 0;
    c >= b || (b = Math.max(b, c * (1048576 > c ? 2 : 1.125) | 0), 0 != c && (b = Math.max(b, 256)), c = a.contents, a.contents = new Uint8Array(b), 0 < a.usedBytes && a.contents.set(c.subarray(0, a.usedBytes), 0));
  }, clearFileStorage:function(a) {
    a.contents = null;
    a.usedBytes = 0;
  }, stream_read:function(a, b, c, d, e) {
    var f = a.node.contents;
    if (e >= a.node.usedBytes) {
      return 0;
    }
    a = Math.min(a.node.usedBytes - e, d);
    assert(0 <= a);
    if (8 < a && f.subarray) {
      b.set(f.subarray(e, e + a), c);
    } else {
      for (d = 0; d < a; d++) {
        b[c + d] = f[e + d];
      }
    }
    return a;
  }, stream_write:function(a, b, c, d, e, f) {
    if (!d) {
      return 0;
    }
    a = a.node;
    b = b.subarray(c, c + d);
    a.timestamp = Date.now();
    f ? (assert(0 === e, "canOwn must imply no weird position inside the file"), a.contents = b, a.usedBytes = d) : 0 === a.usedBytes && 0 === e ? (a.contents = new Uint8Array(b), a.usedBytes = d) : e + d <= a.usedBytes ? a.contents.set(b, e) : (MEMFS.expandFileStorage(a, e + d), a.contents.set(b, e), a.usedBytes = Math.max(a.usedBytes, e + d));
    return d;
  }}, window.CCFS = {streams:[], entries:{}, currentPath:"/", ErrnoError:null, resolvePath:function(a) {
    "/" !== a.charAt(0) && (a = CCFS.currentPath + "/" + a);
    return a;
  }, lookupPath:function(a) {
    a = CCFS.resolvePath(a);
    var b = CCFS.entries[a];
    if (!b) {
      throw new CCFS.ErrnoError(2);
    }
    return {path:a, node:b};
  }, createNode:function(a) {
    var b = {path:a};
    return CCFS.entries[a] = b;
  }, MODE_TYPE_FILE:32768, isFile:function(a) {
    return (a & 61440) === CCFS.MODE_TYPE_FILE;
  }, nextfd:function() {
    for (var a = 0; 4096 >= a; a++) {
      if (!CCFS.streams[a]) {
        return a;
      }
    }
    throw new CCFS.ErrnoError(24);
  }, getStream:function(a) {
    return CCFS.streams[a];
  }, createStream:function(a) {
    var b = CCFS.nextfd();
    a.fd = b;
    return CCFS.streams[b] = a;
  }, readdir:function(a) {
    a = CCFS.resolvePath(a) + "/";
    var b = [], c;
    for (c in CCFS.entries) {
      0 === c.indexOf(a) && b.push(c);
    }
    return b;
  }, unlink:function(a) {
    a = CCFS.lookupPath(a);
    delete CCFS.entries[a.path];
  }, utime:function(a, b) {
    CCFS.lookupPath(a).node.timestamp = b;
  }, open:function(a, b) {
    a = CCFS.resolvePath(a);
    var c = CCFS.entries[a];
    if (b & 64) {
      if (c) {
        if (b & 128) {
          throw new CCFS.ErrnoError(17);
        }
      } else {
        c = MEMFS.createNode(a);
      }
    }
    if (!c) {
      throw new CCFS.ErrnoError(2);
    }
    b & 512 && (MEMFS.clearFileStorage(c), c.timestamp = Date.now());
    return CCFS.createStream({node:c, path:a, flags:b & -641, position:0});
  }, close:function(a) {
    if (CCFS.isClosed(a)) {
      throw new CCFS.ErrnoError(9);
    }
    CCFS.streams[a.fd] = null;
    a.fd = null;
  }, isClosed:function(a) {
    return null === a.fd;
  }, llseek:function(a, b, c) {
    if (CCFS.isClosed(a)) {
      throw new CCFS.ErrnoError(9);
    }
    0 !== c && (1 === c ? b += a.position : 2 === c && (b += a.node.usedBytes));
    if (0 > b) {
      throw new CCFS.ErrnoError(22);
    }
    a.position = b;
    return a.position;
  }, read:function(a, b, c, d) {
    if (0 > d) {
      throw new CCFS.ErrnoError(22);
    }
    if (CCFS.isClosed(a)) {
      throw new CCFS.ErrnoError(9);
    }
    if (1 === (a.flags & 2097155)) {
      throw new CCFS.ErrnoError(9);
    }
    b = MEMFS.stream_read(a, b, c, d, a.position);
    a.position += b;
    return b;
  }, write:function(a, b, c, d, e) {
    if (0 > d) {
      throw new CCFS.ErrnoError(22);
    }
    if (CCFS.isClosed(a)) {
      throw new CCFS.ErrnoError(9);
    }
    if (0 === (a.flags & 2097155)) {
      throw new CCFS.ErrnoError(9);
    }
    a.flags & 1024 && CCFS.llseek(a, 0, 2);
    b = MEMFS.stream_write(a, b, c, d, a.position, e);
    a.position += b;
    return b;
  }, readFile:function(a, b) {
    b = b || "binary";
    a = CCFS.open(a, 0);
    var c = a.node.usedBytes, d = new Uint8Array(c);
    CCFS.read(a, d, 0, c);
    if ("utf8" === b) {
      b = UTF8ArrayToString(d, 0);
    } else if ("binary" === b) {
      b = d;
    } else {
      throw Error("Invalid encoding: " + b);
    }
    CCFS.close(a);
    return b;
  }, writeFile:function(a, b) {
    a = CCFS.open(a, 577);
    if ("string" === typeof b) {
      var c = new Uint8Array(lengthBytesUTF8(b) + 1);
      b = stringToUTF8Array(b, c, 0, c.length);
      CCFS.write(a, c, 0, b, !0);
    } else if (ArrayBuffer.isView(b)) {
      CCFS.write(a, b, 0, b.byteLength, !0);
    } else {
      throw Error("Unsupported data type");
    }
    CCFS.close(a);
  }, chdir:function(a) {
    CCFS.currentPath = CCFS.resolvePath(a);
  }, ensureErrnoError:function() {
    CCFS.ErrnoError = function(a, b) {
      this.node = b;
      this.errno = a;
    };
    CCFS.ErrnoError.prototype = Error();
    CCFS.ErrnoError.prototype.constructor = CCFS.ErrnoError;
  }}, CCFS.ensureErrnoError());
}
function _IDBFS_storeRemoteEntry(a, b, c, d) {
  a = a.put(c, b);
  a.onsuccess = function() {
    d(null);
  };
  a.onerror = function(e) {
    d(this.error);
    e.preventDefault();
  };
}
function _interop_SaveNode(a) {
  var b = function(e) {
    e && (console.log(e), _interop_callStringFunc("Platform_LogError", "&cError saving " + a), _interop_callStringFunc("Platform_LogError", "   &c" + e));
  };
  try {
    var c = CCFS.lookupPath(a).node;
    c.contents = MEMFS.getFileDataAsTypedArray(c);
    var d = {timestamp:c.timestamp, mode:CCFS.MODE_TYPE_FILE, contents:c.contents};
  } catch (e) {
    return b(e);
  }
  _IDBFS_getDB(function(e, f) {
    if (e) {
      return b(e);
    }
    try {
      var g = f.transaction([IDBFS_DB_STORE_NAME], "readwrite");
      var h = g.objectStore(IDBFS_DB_STORE_NAME);
    } catch (l) {
      return b(l);
    }
    g.onerror = function(l) {
      b(this.error);
      l.preventDefault();
    };
    _IDBFS_storeRemoteEntry(h, a, d, b);
  });
}
function _interop_FileClose(a) {
  try {
    var b = CCFS.getStream(a);
    CCFS.close(b);
    2 == (b.flags & 3) && _interop_SaveNode(b.path);
    return 0;
  } catch (c) {
    return c instanceof CCFS.ErrnoError || abort(c), -c.errno;
  }
}
function _interop_FileCreate(a, b) {
  a = UTF8ToString(a);
  try {
    return CCFS.open(a, b).fd | 0;
  } catch (c) {
    return c instanceof CCFS.ErrnoError || abort(c), -c.errno;
  }
}
function _interop_FileExists(a) {
  a = UTF8ToString(a);
  a = CCFS.resolvePath(a);
  return a in CCFS.entries;
}
function _interop_FileLength(a) {
  try {
    return CCFS.getStream(a).node.usedBytes | 0;
  } catch (b) {
    return b instanceof CCFS.ErrnoError || abort(b), -b.errno;
  }
}
function _interop_FileRead(a, b, c) {
  try {
    var d = CCFS.getStream(a);
    return CCFS.read(d, HEAP8, b, c) | 0;
  } catch (e) {
    return e instanceof CCFS.ErrnoError || abort(e), -e.errno;
  }
}
function _interop_FileSeek(a, b, c) {
  try {
    var d = CCFS.getStream(a);
    return CCFS.llseek(d, b, c) | 0;
  } catch (e) {
    return e instanceof CCFS.ErrnoError || abort(e), -e.errno;
  }
}
function _interop_FileWrite(a, b, c) {
  try {
    var d = CCFS.getStream(a);
    return CCFS.write(d, HEAP8, b, c) | 0;
  } catch (e) {
    return e instanceof CCFS.ErrnoError || abort(e), -e.errno;
  }
}
function _interop_ForceTouchPageLayout() {
  "function" === typeof forceTouchLayout && forceTouchLayout();
}
function _interop_GetContainerID() {
  return document.getElementById("canvas_wrapper") ? 1 : 0;
}
function _interop_GetLocalTime(a) {
  var b = new Date();
  HEAP32[(a | 0) >> 2] = b.getFullYear();
  HEAP32[(a | 4) >> 2] = b.getMonth() + 1 | 0;
  HEAP32[(a | 8) >> 2] = b.getDate();
  HEAP32[(a | 12) >> 2] = b.getHours();
  HEAP32[(a | 16) >> 2] = b.getMinutes();
  HEAP32[(a | 20) >> 2] = b.getSeconds();
}
function _interop_AudioLog(a) {
  console.log(a);
  window.AUDIO.errors.push("" + a);
  return window.AUDIO.errors.length | 0;
}
function _interop_InitAudio() {
  window.AUDIO = window.AUDIO || {context:null, sources:[], buffers:{}, errors:[], seen:{}};
  if (window.AUDIO.context) {
    return 0;
  }
  try {
    return AUDIO.context = window.AudioContext ? new window.AudioContext() : new window.webkitAudioContext(), 0;
  } catch (a) {
    return _interop_AudioLog(a);
  }
}
function _interop_InitContainer() {
  var a = navigator.userAgent, b = Module.canvas;
  window.cc_container = document.body;
  /Android/i.test(a) && (a = document.createElement("div"), a.id = "canvas_wrapper", b.parentNode.insertBefore(a, b), a.appendChild(b), window.cc_container = a);
}
function _interop_InitFilesystem(a) {
  window.cc_idbErr && _interop_callStringFunc("Platform_LogError", "Error preloading IndexedDB:" + window.cc_idbErr + "\n\nPreviously saved settings/maps will be lost");
}
function _interop_callVoidFunc(a) {
  Module["_" + a]();
}
function _interop_callStringFunc(a, b) {
  var c = 0, d = stackSave();
  if (null !== b && void 0 !== b) {
    var e = 4 * b.length + 1;
    c = stackAlloc(e);
    stringToUTF8(b, c, e);
  }
  Module["_" + a](c);
  stackRestore(d);
}
function _interop_InitModule() {
  window.ERRNO_CODES = {ENOENT:2, EBADF:9, EAGAIN:11, ENOMEM:12, EEXIST:17, EINVAL:22};
}
function _interop_InitSockets() {
  window.SOCKETS = {EBADF:-8, EISCONN:-30, ENOTCONN:-53, EAGAIN:-6, EHOSTUNREACH:-23, EINPROGRESS:-26, EALREADY:-7, ECONNRESET:-15, EINVAL:-28, ECONNREFUSED:-14, sockets:[]};
}
function _interop_IsAndroid() {
  return /Android/i.test(navigator.userAgent);
}
function _interop_IsHttpsOnly() {
  return "https:" === location.protocol;
}
function _interop_IsIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) || "MacIntel" === navigator.platform && navigator.maxTouchPoints && 2 < navigator.maxTouchPoints;
}
function _interop_LoadIndexedDB() {
}
Module._interop_LoadIndexedDB = _interop_LoadIndexedDB;
function _interop_Log(a, b) {
  Module.print(UTF8ArrayToString(HEAPU8, a, b));
}
function _interop_OpenFileDialog(a, b, c) {
  var d = window.cc_uploadElem, e = UTF8ToString(c);
  d || (d = document.createElement("input"), d.setAttribute("type", "file"), d.setAttribute("style", "display: none"), d.accept = UTF8ToString(a), d.addEventListener("change", function(f) {
    f = f.target.files;
    for (var g = 0; g < f.length; g++) {
      var h = new FileReader(), l = f[g].name;
      h.onload = function(k) {
        k = new Uint8Array(k.target.result);
        var m = e + "/" + l;
        CCFS.writeFile(m, k);
        _interop_callStringFunc("Window_OnFileUploaded", m);
        0 == b && CCFS.unlink(m);
        1 == b && _interop_SaveNode(m);
      };
      h.readAsArrayBuffer(f[g]);
    }
    window.cc_container.removeChild(window.cc_uploadElem);
    window.cc_uploadElem = null;
  }, !1), window.cc_uploadElem = d, window.cc_container.appendChild(d));
  d.click();
}
function _interop_OpenKeyboard(a, b, c) {
  var d = window.cc_inputElem, e = !0, f = b & 255;
  d || (1 == f ? (d = document.createElement("input"), d.setAttribute("type", "text"), d.setAttribute("inputmode", "decimal")) : 3 == f ? (d = document.createElement("input"), d.setAttribute("type", "text"), d.setAttribute("inputmode", "numeric"), d.setAttribute("pattern", "[0-9]*")) : d = document.createElement("textarea"), e = !1);
  b & 256 && d.setAttribute("enterkeyhint", "send");
  d.setAttribute("style", "position:absolute; left:0; bottom:0; margin: 0px; width: 100%; background-color: #222222; border: none; color: white;");
  d.setAttribute("placeholder", UTF8ToString(c));
  d.value = UTF8ToString(a);
  e || (d.addEventListener("touchstart", function(g) {
    g.stopPropagation();
  }, !1), d.addEventListener("touchmove", function(g) {
    g.stopPropagation();
  }, !1), d.addEventListener("mousedown", function(g) {
    g.stopPropagation();
  }, !1), d.addEventListener("mousemove", function(g) {
    g.stopPropagation();
  }, !1), d.addEventListener("input", function(g) {
    _interop_callStringFunc("Window_OnTextChanged", g.target.value);
  }, !1), window.cc_inputElem = d, window.cc_divElem = document.createElement("div"), window.cc_divElem.setAttribute("style", "position:absolute; left:0; top:0; width:100%; height:100%; background-color: black; opacity:0.4; resize:none; pointer-events:none;"), window.cc_container.appendChild(window.cc_divElem), window.cc_container.appendChild(d));
  d.focus();
  d.click();
}
function _interop_OpenTab(a) {
  try {
    window.open(UTF8ToString(a));
  } catch (b) {
    return console.log(b), 1;
  }
  return 0;
}
function _interop_RequestCanvasResize() {
  "function" === typeof resizeGameCanvas && resizeGameCanvas();
}
function _interop_ScreenHeight() {
  return screen.height;
}
function _interop_ScreenWidth() {
  return screen.width;
}
function _interop_SetFont(a, b, c) {
  window.FONT_CANVAS || (window.FONT_CANVAS = document.createElement("canvas"), window.FONT_CONTEXT = window.FONT_CANVAS.getContext("2d"));
  var d = "";
  c & 1 && (d += "Bold ");
  b += 4;
  a = UTF8ToString(a);
  c = window.FONT_CONTEXT;
  c.font = d + b + "px " + a;
  c.textAlign = "left";
  c.textBaseline = "top";
  return c;
}
function _interop_SetKeyboardText(a) {
  if (window.cc_inputElem) {
    a = UTF8ToString(a);
    var b = window.cc_inputElem.value;
    b.length && "\n" == b[b.length - 1] && (b = b.substring(0, b.length - 1));
    a != b && (window.cc_inputElem.value = a);
  }
}
function _interop_SetPageTitle(a) {
  document.title = UTF8ToString(a);
}
function _interop_ShowDialog(a, b) {
  alert(UTF8ToString(a) + "\n\n" + UTF8ToString(b));
}
function _interop_SocketClose(a) {
  a = SOCKETS.sockets[a];
  if (!a) {
    return SOCKETS.EBADF;
  }
  try {
    a.socket.close();
  } catch (b) {
  }
  delete a.socket;
  return 0;
}
function _interop_SocketConnect(a, b, c) {
  b = UTF8ToString(b);
  var d = SOCKETS.sockets[a];
  if (!d) {
    return SOCKETS.EBADF;
  }
  if (a = d.socket) {
    return a.readyState === a.CONNECTING ? SOCKETS.EALREADY : SOCKETS.EISCONN;
  }
  try {
    var e = b.split("/"), f = (_interop_IsHttpsOnly() ? "wss://" : "ws://") + e[0] + ":" + c + "/" + e.slice(1).join("/");
    a = new WebSocket(f, "ClassiCube");
    a.binaryType = "arraybuffer";
  } catch (g) {
    return SOCKETS.EHOSTUNREACH;
  }
  d.socket = a;
  a.onopen = function() {
  };
  a.onclose = function() {
  };
  a.onmessage = function(g) {
    g = g.data;
    if ("string" === typeof g) {
      g = (new TextEncoder()).encode(g);
    } else {
      assert(void 0 !== g.byteLength);
      if (0 == g.byteLength) {
        return;
      }
      g = new Uint8Array(g);
    }
    d.recv_queue.push(g);
  };
  a.onerror = function(g) {
    d.error = SOCKETS.ECONNREFUSED;
  };
  return SOCKETS.EINPROGRESS;
}
function _interop_SocketCreate() {
  SOCKETS.sockets.push({error:null, recv_queue:[], socket:null});
  return SOCKETS.sockets.length - 1 | 0;
}
function _interop_SocketLastError(a) {
  return (a = SOCKETS.sockets[a]) ? a.socket ? a.error || 0 : SOCKETS.ENOTCONN : SOCKETS.EBADF;
}
function _interop_SocketRecv(a, b, c) {
  a = SOCKETS.sockets[a];
  if (!a) {
    return SOCKETS.EBADF;
  }
  var d = a.recv_queue.shift();
  if (!d) {
    return (b = a.socket) && b.readyState != b.CLOSING && b.readyState != b.CLOSED ? SOCKETS.EAGAIN : SOCKETS.ENOTCONN;
  }
  var e = d.byteLength || d.length, f = d.byteOffset || 0;
  d = d.buffer || d;
  var g = Math.min(c, e);
  c = new Uint8Array(d, f, g);
  g < e && (d = new Uint8Array(d, f + g, e - g), a.recv_queue.unshift(d));
  HEAPU8.set(c, b);
  return c.byteLength;
}
function _interop_SocketSend(a, b, c) {
  a = SOCKETS.sockets[a];
  if (!a) {
    return SOCKETS.EBADF;
  }
  a = a.socket;
  if (!a || a.readyState === a.CLOSING || a.readyState === a.CLOSED) {
    return SOCKETS.ENOTCONN;
  }
  if (a.readyState === a.CONNECTING) {
    return SOCKETS.EAGAIN;
  }
  for (var d = new Uint8Array(c), e = 0; e < c; e++) {
    d[e] = HEAP8[b + e];
  }
  try {
    return a.send(d), c;
  } catch (f) {
    return SOCKETS.EINVAL;
  }
}
function _interop_SocketWritable(a, b) {
  HEAPU8[b | 0] = 0;
  a = SOCKETS.sockets[a];
  if (!a) {
    return SOCKETS.EBADF;
  }
  a = a.socket;
  if (!a) {
    return SOCKETS.ENOTCONN;
  }
  if (a.readyState === a.OPEN || a.readyState == a.CLOSED) {
    HEAPU8[b | 0] = 1;
  }
  return 0;
}
function _interop_TakeScreenshot(a) {
  var b = UTF8ToString(a);
  a = Module.canvas;
  a.toBlob ? a.toBlob(function(c) {
    _interop_SaveBlob(c, b);
  }) : a.msToBlob && _interop_SaveBlob(a.msToBlob(), b);
}
function _interop_TextDraw(a, b, c, d, e, f, g) {
  a = UTF8ArrayToString(HEAPU8, a, b);
  var h = UTF8ArrayToString(HEAPU8, g, 7);
  b = window.FONT_CONTEXT;
  g = b.measureText(a);
  var l = Math.ceil(g.width) | 0;
  if (l > b.canvas.width) {
    var k = b.font;
    b.canvas.width = l;
    b.font = k;
    b.textAlign = "left";
    b.textBaseline = "top";
  }
  l = 0;
  b.fillStyle = h;
  f && (l = 1.3);
  b.clearRect(0, 0, b.canvas.width, b.canvas.height);
  b.fillText(a, l, l);
  c |= 0;
  d |= 0;
  e |= 0;
  f = HEAP32[(c + 0 | 0) >> 2] + (d << 2);
  a = HEAP32[(c + 4 | 0) >> 2];
  c = HEAP32[(c + 8 | 0) >> 2];
  k = b.getImageData(0, 0, b.canvas.width, b.canvas.height);
  b = k.data;
  h = k.width | 0;
  l = Math.min(h, a);
  k = Math.min(k.height | 0, c);
  for (var m = 0; m < k; m++) {
    var n = m + e;
    if (!(0 > n || n >= c)) {
      var p = m * (h << 2) | 0;
      n = f + n * (a << 2) | 0;
      for (var q = 0; q < l; q++) {
        var r = q + d;
        if (!(0 > r || r >= a)) {
          r = b[p + (q << 2) + 3];
          var t = 255 - r | 0;
          HEAPU8[n + (q << 2) + 0] = (b[p + (q << 2) + 0] * r >> 8) + (HEAPU8[n + (q << 2) + 0] * t >> 8);
          HEAPU8[n + (q << 2) + 1] = (b[p + (q << 2) + 1] * r >> 8) + (HEAPU8[n + (q << 2) + 1] * t >> 8);
          HEAPU8[n + (q << 2) + 2] = (b[p + (q << 2) + 2] * r >> 8) + (HEAPU8[n + (q << 2) + 2] * t >> 8);
          HEAPU8[n + (q << 2) + 3] = r + (HEAPU8[n + (q << 2) + 3] * t >> 8);
        }
      }
    }
  }
  return g.width;
}
function _interop_TextWidth(a, b) {
  a = UTF8ArrayToString(HEAPU8, a, b);
  return window.FONT_CONTEXT.measureText(a).width;
}
function _interop_TryGetClipboardText() {
  if (window.clipboardData) {
    var a = window.clipboardData.getData("Text");
    _interop_callStringFunc("Window_StoreClipboardText", a);
  }
}
function _interop_TrySetClipboardText(a) {
  window.clipboardData ? window.getSelection && window.getSelection().toString() || window.clipboardData.setData("Text", UTF8ToString(a)) : window.cc_copyText = UTF8ToString(a);
}
function _interop_isInFullscreen() {
  return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
}
var getCFunc = function(a) {
  return Module["_" + a];
}, writeArrayToMemory = function(a, b) {
  HEAP8.set(a, b);
}, ccall = function(a, b, c, d, e) {
  e = {string:function(k) {
    var m = 0;
    null !== k && void 0 !== k && 0 !== k && (m = stringToUTF8OnStack(k));
    return m;
  }, array:function(k) {
    var m = stackAlloc(k.length);
    writeArrayToMemory(k, m);
    return m;
  }};
  a = getCFunc(a);
  var f = [], g = 0;
  if (d) {
    for (var h = 0; h < d.length; h++) {
      var l = e[c[h]];
      l ? (0 === g && (g = stackSave()), f[h] = l(d[h])) : f[h] = d[h];
    }
  }
  c = a.apply(null, f);
  return c = function(k) {
    0 !== g && stackRestore(g);
    k = "string" === b ? UTF8ToString(k) : "boolean" === b ? !!k : k;
    return k;
  }(c);
}, cwrap = function(a, b, c, d) {
  var e = !c || c.every(function(f) {
    return "number" === f || "boolean" === f;
  });
  return "string" !== b && e && !d ? getCFunc(a) : function() {
    return ccall(a, b, c, arguments, d);
  };
}, FSNode = function(a, b, c, d) {
  a || (a = this);
  this.parent = a;
  this.mount = a.mount;
  this.mounted = null;
  this.id = FS.nextInode++;
  this.name = b;
  this.mode = c;
  this.node_ops = {};
  this.stream_ops = {};
  this.rdev = d;
}, readMode = 365, writeMode = 146;
Object.defineProperties(FSNode.prototype, {read:{get:function() {
  return (this.mode & readMode) === readMode;
}, set:function(a) {
  a ? this.mode |= readMode : this.mode &= ~readMode;
}}, write:{get:function() {
  return (this.mode & writeMode) === writeMode;
}, set:function(a) {
  a ? this.mode |= writeMode : this.mode &= ~writeMode;
}}, isFolder:{get:function() {
  return FS.isDir(this.mode);
}}, isDevice:{get:function() {
  return FS.isChrdev(this.mode);
}}});
FS.FSNode = FSNode;
FS.createPreloadedFile = FS_createPreloadedFile;
FS.staticInit();
Module.requestFullscreen = Browser.requestFullscreen;
Module.requestAnimationFrame = Browser.requestAnimationFrame;
Module.setCanvasSize = Browser.setCanvasSize;
Module.pauseMainLoop = Browser.mainLoop.pause;
Module.resumeMainLoop = Browser.mainLoop.resume;
Module.getUserMedia = Browser.getUserMedia;
Module.createContext = Browser.createContext;
for (var preloadedImages = {}, preloadedAudios = {}, GLctx, miniTempWebGLFloatBuffersStorage = new Float32Array(288), i = 0; 288 > i; ++i) {
  miniTempWebGLFloatBuffers[i] = miniTempWebGLFloatBuffersStorage.subarray(0, i + 1);
}
var wasmImports = {Eb:_CC_gpu_getRenderer, ub:___syscall_dup3, W:___syscall_fcntl64, wb:___syscall_ioctl, xb:___syscall_openat, sb:___syscall_rmdir, tb:___syscall_unlinkat, m:_emscripten_cancel_main_loop, yb:_emscripten_date_now, qa:_emscripten_exit_fullscreen, l:_emscripten_exit_pointerlock, g:_emscripten_get_device_pixel_ratio, Ab:_emscripten_get_element_css_size, Pb:_emscripten_get_gamepad_status, Ta:_emscripten_get_now, Qb:_emscripten_get_num_gamepads, Db:_emscripten_get_pointerlock_status, Gb:_emscripten_is_webgl_context_lost, 
zb:_emscripten_memcpy_js, Ub:_emscripten_request_fullscreen_strategy, Cb:_emscripten_request_pointerlock, rb:_emscripten_resize_heap, bc:_emscripten_resume_main_loop, Rb:_emscripten_sample_gamepad_data, ia:_emscripten_set_beforeunload_callback_on_thread, ka:_emscripten_set_blur_callback_on_thread, $:_emscripten_set_canvas_element_size, ac:_emscripten_set_element_css_size, la:_emscripten_set_focus_callback_on_thread, $b:_emscripten_set_fullscreenchange_callback_on_thread, ga:_emscripten_set_keydown_callback_on_thread, 
ea:_emscripten_set_keypress_callback_on_thread, fa:_emscripten_set_keyup_callback_on_thread, va:_emscripten_set_main_loop, y:_emscripten_set_main_loop_timing, oa:_emscripten_set_mousedown_callback_on_thread, ma:_emscripten_set_mousemove_callback_on_thread, na:_emscripten_set_mouseup_callback_on_thread, ja:_emscripten_set_resize_callback_on_thread, aa:_emscripten_set_touchcancel_callback_on_thread, ba:_emscripten_set_touchend_callback_on_thread, ca:_emscripten_set_touchmove_callback_on_thread, da:_emscripten_set_touchstart_callback_on_thread, 
ha:_emscripten_set_visibilitychange_callback_on_thread, X:_emscripten_set_webglcontextlost_callback_on_thread, pa:_emscripten_set_wheel_callback_on_thread, Ib:_emscripten_webgl_create_context, Fb:_emscripten_webgl_destroy_context, Jb:_emscripten_webgl_init_context_attributes, Hb:_emscripten_webgl_make_context_current, Fa:_exit, U:_fd_close, vb:_fd_read, qb:_fd_seek, V:_fd_write, Q:_glAttachShader, r:_glBindAttribLocation, d:_glBindBuffer, A:_glBindTexture, nb:_glBlendFunc, v:_glBufferData, E:_glBufferSubData, 
ab:_glClear, pb:_glClearColor, N:_glColorMask, cb:_glCompileShader, lb:_glCreateProgram, R:_glCreateShader, S:_glDeleteBuffers, T:_glDeleteProgram, t:_glDeleteShader, _b:_glDeleteTextures, mb:_glDepthFunc, b:_glDepthMask, O:_glDetachShader, s:_glDisable, Oa:_glDisableVertexAttribArray, eb:_glDrawArrays, k:_glDrawElements, u:_glEnable, q:_glEnableVertexAttribArray, i:_glGenBuffers, Bb:_glGenTextures, f:_glGetIntegerv, jb:_glGetProgramInfoLog, P:_glGetProgramiv, bb:_glGetShaderInfoLog, L:_glGetShaderiv, 
e:_glGetString, h:_glGetUniformLocation, kb:_glLinkProgram, db:_glShaderSource, w:_glTexImage2D, j:_glTexParameteri, z:_glTexSubImage2D, M:_glUniform1f, gb:_glUniform2f, fb:_glUniform3f, hb:_glUniformMatrix4fv, ib:_glUseProgram, c:_glVertexAttribPointer, ob:_glViewport, ua:_interop_AddClipboardListeners, x:_interop_AdjustXY, ya:_interop_AsyncDownloadTexturePack, wa:_interop_AsyncLoadIndexedDB, Xa:_interop_AudioClose, Ya:_interop_AudioCreate, Za:_interop_AudioDescribe, H:_interop_AudioPlay, J:_interop_AudioPoll, 
I:_interop_AudioVolume, Z:_interop_CanvasHeight, _:_interop_CanvasWidth, Kb:_interop_CloseKeyboard, Sa:_interop_DirectoryIter, za:_interop_DirectorySetWorking, Ua:_interop_DownloadAsync, Nb:_interop_DownloadFile, Tb:_interop_EnterFullscreen, Aa:_interop_FS_Init, Pa:_interop_FileClose, n:_interop_FileCreate, o:_interop_FileExists, Na:_interop_FileLength, Ra:_interop_FileRead, F:_interop_FileSeek, Qa:_interop_FileWrite, ra:_interop_ForceTouchPageLayout, Vb:_interop_GetContainerID, G:_interop_GetLocalTime, 
Wa:_interop_InitAudio, Zb:_interop_InitContainer, Ca:_interop_InitFilesystem, Da:_interop_InitModule, Ba:_interop_InitSockets, ta:_interop_IsAndroid, Va:_interop_IsHttpsOnly, sa:_interop_IsIOS, xa:_interop_LoadIndexedDB, p:_interop_Log, Ob:_interop_OpenFileDialog, Mb:_interop_OpenKeyboard, Ea:_interop_OpenTab, Sb:_interop_RequestCanvasResize, B:_interop_ScreenHeight, C:_interop_ScreenWidth, K:_interop_SetFont, Lb:_interop_SetKeyboardText, Yb:_interop_SetPageTitle, D:_interop_ShowDialog, Ia:_interop_SocketClose, 
La:_interop_SocketConnect, Ma:_interop_SocketCreate, Ga:_interop_SocketLastError, Ka:_interop_SocketRecv, Ja:_interop_SocketSend, Ha:_interop_SocketWritable, cc:_interop_TakeScreenshot, _a:_interop_TextDraw, $a:_interop_TextWidth, Xb:_interop_TryGetClipboardText, Wb:_interop_TrySetClipboardText, Y:_interop_isInFullscreen, a:wasmMemory}, wasmExports = createWasm(), ___wasm_call_ctors = function() {
  return (___wasm_call_ctors = wasmExports.dc)();
}, _Http_OnUpdateProgress = Module._Http_OnUpdateProgress = function(a, b, c) {
  return (_Http_OnUpdateProgress = Module._Http_OnUpdateProgress = wasmExports.fc)(a, b, c);
}, _Http_OnFinishedAsync = Module._Http_OnFinishedAsync = function(a, b, c, d) {
  return (_Http_OnFinishedAsync = Module._Http_OnFinishedAsync = wasmExports.gc)(a, b, c, d);
}, _malloc = function(a) {
  return (_malloc = wasmExports.hc)(a);
}, _free = function(a) {
  return (_free = wasmExports.free)(a);
}, _Directory_IterCallback = Module._Directory_IterCallback = function(a) {
  return (_Directory_IterCallback = Module._Directory_IterCallback = wasmExports.ic)(a);
}, _Platform_LogError = Module._Platform_LogError = function(a) {
  return (_Platform_LogError = Module._Platform_LogError = wasmExports.jc)(a);
}, _main = Module._main = function(a, b) {
  return (_main = Module._main = wasmExports.kc)(a, b);
}, _main_phase1 = Module._main_phase1 = function() {
  return (_main_phase1 = Module._main_phase1 = wasmExports.lc)();
}, _main_phase2 = Module._main_phase2 = function() {
  return (_main_phase2 = Module._main_phase2 = wasmExports.mc)();
}, _Window_RequestClipboardText = Module._Window_RequestClipboardText = function() {
  return (_Window_RequestClipboardText = Module._Window_RequestClipboardText = wasmExports.nc)();
}, _Window_StoreClipboardText = Module._Window_StoreClipboardText = function(a) {
  return (_Window_StoreClipboardText = Module._Window_StoreClipboardText = wasmExports.oc)(a);
}, _Window_GotClipboardText = Module._Window_GotClipboardText = function(a) {
  return (_Window_GotClipboardText = Module._Window_GotClipboardText = wasmExports.pc)(a);
}, _Window_OnFileUploaded = Module._Window_OnFileUploaded = function(a) {
  return (_Window_OnFileUploaded = Module._Window_OnFileUploaded = wasmExports.qc)(a);
}, _Window_OnTextChanged = Module._Window_OnTextChanged = function(a) {
  return (_Window_OnTextChanged = Module._Window_OnTextChanged = wasmExports.rc)(a);
}, ___errno_location = function() {
  return (___errno_location = wasmExports.sc)();
}, stackSave = function() {
  return (stackSave = wasmExports.tc)();
}, stackRestore = function(a) {
  return (stackRestore = wasmExports.uc)(a);
}, stackAlloc = function(a) {
  return (stackAlloc = wasmExports.vc)(a);
};
Module.ccall = ccall;
Module.cwrap = cwrap;
var calledRun;
dependenciesFulfilled = function runCaller() {
  calledRun || run();
  calledRun || (dependenciesFulfilled = runCaller);
};
function callMain(a) {
  a = void 0 === a ? [] : a;
  var b = _main;
  a.unshift(thisProgram);
  var c = a.length, d = stackAlloc(4 * (c + 1)), e = d;
  a.forEach(function(g) {
    HEAPU32[e >> 2] = stringToUTF8OnStack(g);
    e += 4;
  });
  HEAPU32[e >> 2] = 0;
  try {
    var f = b(c, d);
    exitJS(f, !0);
    return f;
  } catch (g) {
    return handleException(g);
  }
}
function run(a) {
  function b() {
    if (!calledRun && (calledRun = !0, Module.calledRun = !0, !ABORT)) {
      initRuntime();
      preMain();
      if (Module.onRuntimeInitialized) {
        Module.onRuntimeInitialized();
      }
      shouldRunNow && callMain(a);
      postRun();
    }
  }
  a = void 0 === a ? arguments_ : a;
  0 < runDependencies || (preRun(), 0 < runDependencies || (Module.setStatus ? (Module.setStatus("Running..."), setTimeout(function() {
    setTimeout(function() {
      Module.setStatus("");
    }, 1);
    b();
  }, 1)) : b()));
}
if (Module.preInit) {
  for ("function" == typeof Module.preInit && (Module.preInit = [Module.preInit]); 0 < Module.preInit.length;) {
    Module.preInit.pop()();
  }
}
var shouldRunNow = !0;
Module.noInitialRun && (shouldRunNow = !1);
run();


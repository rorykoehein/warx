'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var deprecationsSeen = {};

var deprecate = exports.deprecate = (typeof console === 'undefined' ? 'undefined' : _typeof(console)) === 'object' && typeof console.warn === 'function' ? function (msg) {
  if (!deprecationsSeen[msg]) {
    deprecationsSeen[msg] = true;
    console.warn('redux-observable | DEPRECATION: ' + msg);
  }
} : function () {};
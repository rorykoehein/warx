'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ofType = ofType;

var _filter = require('rxjs/operator/filter');

var keyHasType = function keyHasType(type, key) {
  return type === key || typeof key === 'function' && type === key.toString();
};

function ofType() {
  for (var _len = arguments.length, keys = Array(_len), _key = 0; _key < _len; _key++) {
    keys[_key] = arguments[_key];
  }

  return function ofTypeOperatorFunction(source) {
    return _filter.filter.call(source, function (_ref) {
      var type = _ref.type;

      var len = keys.length;
      if (len === 1) {
        return keyHasType(type, keys[0]);
      } else {
        for (var i = 0; i < len; i++) {
          if (keyHasType(type, keys[i])) {
            return true;
          }
        }
      }
      return false;
    });
  };
}
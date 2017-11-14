'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// setup socket.io, this should only be used within network-messages (to translate messages to observables) and in
// bin/www/index (to attach socket.io to the http server)
var io = (0, _socket2.default)();
exports.default = io;
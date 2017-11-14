'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.all = exports.broadcast = exports.send = undefined;

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var send = exports.send = function send(id, eventName, data) {
    var sockets = _socket2.default.sockets.sockets;
    var socket = sockets[id];
    // send the current game state to the client when he logs in
    socket.emit(eventName, data);
};

var broadcast = exports.broadcast = function broadcast(id, eventName, data) {
    var sockets = _socket2.default.sockets.sockets;
    var socket = sockets[id];
    // send the current game state to the client when he logs in
    socket.broadcast.emit(eventName, data);
};

var all = exports.all = function all(eventName, data) {
    _socket2.default.emit(eventName, data);
};
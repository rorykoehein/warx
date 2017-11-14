'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _store = require('../game/store');

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// the redux server store

// socket.io default
var eventActionMap = {
    connect: 'CONNECT',
    disconnect: 'DISCONNECT'
};

exports.default = function (messages) {
    // respond to new connections
    messages.subscribe(function (_ref) {
        var id = _ref.id,
            event = _ref.event,
            _ref$payload = _ref.payload,
            payload = _ref$payload === undefined ? {} : _ref$payload;
        var type = payload.type,
            _payload$data = payload.data,
            data = _payload$data === undefined ? {} : _payload$data;
        // the 'type' in case the event is 'action', else try to get the action from the map

        var action = event === 'action' ? type : eventActionMap[event];
        if (action) {
            _store2.default.dispatch({
                type: action,
                origin: 'client',
                sendToClient: false, // don't send any incoming messages to clients
                data: _extends({}, data, {
                    // overwrite the player id with that of the connection, so the client can't just send any id
                    playerId: id
                })
            });
        }
    });
};
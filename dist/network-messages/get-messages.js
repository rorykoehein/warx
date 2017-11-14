'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _rxjs = require('rxjs');

var _rxjs2 = _interopRequireDefault(_rxjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// map socket.io messages to an observable
exports.default = function (io) {
    return _rxjs2.default.Observable.create(function (observer) {
        io.on('connection', function (socket) {
            var id = socket.id;
            observer.next({ id: id, time: Date.now(), event: 'connect' });

            socket.on('action', function (payload) {
                observer.next({ id: id, time: Date.now(), event: 'action', payload: payload });
            });

            socket.on('disconnect', function () {
                observer.next({ id: id, time: Date.now(), event: 'disconnect' });
            });
        });
    });
};
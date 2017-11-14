'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

var _getMessages = require('./get-messages');

var _getMessages2 = _interopRequireDefault(_getMessages);

var _mapMessagesToActions = require('../messages-actions/map-messages-to-actions');

var _mapMessagesToActions2 = _interopRequireDefault(_mapMessagesToActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// translate messages from the network to actions
exports.default = function (app) {
  return (0, _mapMessagesToActions2.default)((0, _getMessages2.default)(_socket2.default, app));
};
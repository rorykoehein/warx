'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _app = require('../app/app');

var _app2 = _interopRequireDefault(_app);

var _socket = require('../network-messages/socket');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// we must bypass the app layer to connect to socket to the http here

var port = process.env.PORT || 5000;
var server = _http2.default.createServer(_app2.default);
_socket2.default.attach(server);
server.listen(port);
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _setupMessages = require('../network-messages/setup-messages');

var _setupMessages2 = _interopRequireDefault(_setupMessages);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create the express app and socket io server, export them so we can use them in bin/www
var app = (0, _express2.default)();
exports.default = app;

// attach network messaging to our express app

(0, _setupMessages2.default)(app);

// serve static assets from ./public
app.use(_express2.default.static(_path2.default.join(__dirname, '../public')));
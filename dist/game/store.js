'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

var _reduxNodeLogger = require('redux-node-logger');

var _reduxNodeLogger2 = _interopRequireDefault(_reduxNodeLogger);

var _reduxObservable = require('redux-observable');

var _epics = require('./epics');

var _epics2 = _interopRequireDefault(_epics);

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = (0, _redux.createStore)(_reducers2.default, (0, _redux.applyMiddleware)((0, _reduxNodeLogger2.default)({}), (0, _reduxObservable.createEpicMiddleware)(_epics2.default)));

exports.default = store;
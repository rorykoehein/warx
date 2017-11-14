'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reduxObservable = require('redux-observable');

var _mapActionsToMessagesEpic = require('../messages-actions/map-actions-to-messages-epic');

var _gameEpic = require('./game-epic');

exports.default = (0, _reduxObservable.combineEpics)(_mapActionsToMessagesEpic.connects, _mapActionsToMessagesEpic.pings, _mapActionsToMessagesEpic.disconnects, _gameEpic.spawnConnects, _gameEpic.shots, _gameEpic.requestedShots, _gameEpic.moves, _gameEpic.hits, _mapActionsToMessagesEpic.networkActions);
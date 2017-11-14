'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _defaultRules = require('./default-rules');

var _defaultRules2 = _interopRequireDefault(_defaultRules);

var _movePlayer = require('./move-player');

var _movePlayer2 = _interopRequireDefault(_movePlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var initialState = {
    players: {},
    rules: _extends({}, _defaultRules2.default)
};

// todo: server state and action types
var reducer = function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    switch (action.type) {
        case 'CONNECT':
            {
                var players = state.players,
                    rest = _objectWithoutProperties(state, ['players']);var playerId = action.data.playerId;

                return _extends({
                    players: _extends({}, players, _defineProperty({}, '' + playerId, {
                        id: playerId,
                        name: 'Player ' + playerId,
                        alive: false // todo: don't set alive until after spawn
                    }))
                }, rest);
            }

        case 'SPAWN':
            {
                // todo call spawn after connecting and after hits
                var _players = state.players,
                    _rest = _objectWithoutProperties(state, ['players']);var _action$data = action.data,
                    _playerId = _action$data.playerId,
                    x = _action$data.x,
                    y = _action$data.y;

                var player = _players[_playerId];
                return _extends({
                    players: _extends({}, _players, _defineProperty({}, '' + _playerId, _extends({}, player, {
                        x: x,
                        y: y,
                        alive: true // todo: don't set alive until after spawn
                    })))
                }, _rest);
            }

        case 'HIT':
            {
                var _players2 = state.players,
                    _rest2 = _objectWithoutProperties(state, ['players']);var _playerId2 = action.data.playerId;

                var _player = _players2[_playerId2];
                return _extends({
                    players: _extends({}, _players2, _defineProperty({}, '' + _playerId2, _extends({}, _player, {
                        alive: false // todo: don't set alive until after spawn
                    })))
                }, _rest2);
            }

        case 'DISCONNECT':
            {
                var _players3 = state.players,
                    restState = _objectWithoutProperties(state, ['players']);var _playerId3 = action.data.playerId;
                var playerToRemove = _players3[_playerId3],
                    restPlayers = _objectWithoutProperties(_players3, [_playerId3]);
                return _extends({
                    players: restPlayers
                }, restState);
            }

        case 'MOVE':
            {
                var _players4 = state.players,
                    _rest3 = _objectWithoutProperties(state, ['players']);var _action$data2 = action.data,
                    direction = _action$data2.direction,
                    _playerId4 = _action$data2.playerId;

                var _player2 = _players4[_playerId4];
                if (!_player2) return state;
                return _extends({}, _rest3, {
                    players: _extends({}, _players4, _defineProperty({}, _playerId4, (0, _movePlayer2.default)(_player2, direction, _defaultRules2.default.moveDistance)))
                });
            }

        default:
            return state;
    }
};

exports.default = reducer;
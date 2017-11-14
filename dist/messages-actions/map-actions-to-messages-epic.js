'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.disconnects = exports.networkActions = exports.pings = exports.connects = undefined;

var _sendMessages = require('../network-messages/send-messages');

var connects = exports.connects = function connects(action$, store) {
    return action$.ofType('CONNECT').do(function (payload) {
        var playerId = payload.data.playerId;

        var _store$getState = store.getState(),
            players = _store$getState.players,
            rules = _store$getState.rules;

        // send the current game state to the client when he logs in


        (0, _sendMessages.send)(playerId, 'action', {
            type: 'CONNECTED',
            origin: 'server',
            data: {
                playerId: playerId
            }
        });

        // send the current game state to the client when he logs in
        (0, _sendMessages.send)(playerId, 'action', {
            type: 'GAME_STATE_CHANGED',
            origin: 'server',
            data: {
                state: {
                    players: players,
                    currentPlayerId: playerId,
                    rules: rules
                }
            }
        });

        // let the other cients know a new player has joined
        (0, _sendMessages.broadcast)(playerId, 'action', {
            type: 'PLAYER_JOINED',
            origin: 'server',
            data: {
                player: players[playerId]
            }
        });
    }).ignoreElements();
};
// possibly inject these functions from network-messages on setup, but for now this is decoupled enough
var pings = exports.pings = function pings(action$, store) {
    return action$.ofType('PING').do(function (payload) {
        var _payload$data = payload.data,
            playerId = _payload$data.playerId,
            time = _payload$data.time;

        (0, _sendMessages.send)(playerId, 'action', { type: 'PONG', data: { playerId: playerId, time: time } });
    }).ignoreElements();
};

var networkActions = exports.networkActions = function networkActions(action$, store) {
    return action$.filter(function (_ref) {
        var sendToClient = _ref.sendToClient;
        return sendToClient;
    })
    // .bufferTime(16) todo buffertime to send multiple actions within one tick (16ms)
    .do(function (payload) {
        var type = payload.type,
            data = payload.data,
            toAll = payload.toAll;

        toAll ? (0, _sendMessages.all)('actions', { type: type, data: data }) : (0, _sendMessages.broadcast)(data.playerId, 'actions', { type: type, data: data });
    }).ignoreElements();
};

var disconnects = exports.disconnects = function disconnects(action$, store) {
    return action$.ofType('DISCONNECT').do(function (_ref2) {
        var playerId = _ref2.data.playerId;

        // let all users know this player is now gone
        (0, _sendMessages.all)('action', {
            type: 'PLAYER_LEFT',
            origin: 'server',
            data: {
                playerId: playerId
            }
        });
    }).ignoreElements();
};
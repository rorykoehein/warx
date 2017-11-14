'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.moves = exports.requestedShots = exports.shots = exports.hits = exports.spawnConnects = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('rxjs');

var _actions = require('./actions');

var isHit = function isHit(shooter, opponent) {
    var direction = shooter.direction,
        x = shooter.x,
        y = shooter.y;
    var opponentX = opponent.x,
        opponentY = opponent.y,
        alive = opponent.alive;

    return alive && (direction === 'left' && opponentY === y && opponentX < x || direction === 'right' && opponentY === y && opponentX > x || direction === "down" && opponentX === x && opponentY > y || direction === "up" && opponentX === x && opponentY < y);
};

var spawnConnects = exports.spawnConnects = function spawnConnects(action$, store) {
    return action$.ofType('CONNECT').map(function (_ref) {
        var playerId = _ref.data.playerId;

        var _store$getState = store.getState(),
            _store$getState$rules = _store$getState.rules,
            worldWidth = _store$getState$rules.worldWidth,
            worldHeight = _store$getState$rules.worldHeight,
            moveDistance = _store$getState$rules.moveDistance;

        return (0, _actions.spawn)({ playerId: playerId, worldWidth: worldWidth, worldHeight: worldHeight, moveDistance: moveDistance });
    });
};

var hits = exports.hits = function hits(action$, store) {
    return action$.ofType('HIT').delay(function () {
        return store.getState().rules.respawnTime;
    }).flatMap(function (_ref2) {
        var hits = _ref2.data.hits;
        return hits.map(function (playerId) {
            var _store$getState2 = store.getState(),
                _store$getState2$rule = _store$getState2.rules,
                worldWidth = _store$getState2$rule.worldWidth,
                worldHeight = _store$getState2$rule.worldHeight,
                moveDistance = _store$getState2$rule.moveDistance;

            return (0, _actions.spawn)({ playerId: playerId, worldWidth: worldWidth, worldHeight: worldHeight, moveDistance: moveDistance });
        });
    });
};

var shots = exports.shots = function shots(action$, store) {
    return action$.ofType('SHOT_FIRED').map(function (_ref3) {
        var playerId = _ref3.data.playerId;

        var _store$getState3 = store.getState(),
            players = _store$getState3.players;

        var shooter = players[playerId];
        var hits = Object.keys(players).filter(function (key) {
            return isHit(shooter, players[key]);
        });
        return { hits: hits, playerId: playerId };
    }).filter(function (_ref4) {
        var hits = _ref4.hits,
            playerId = _ref4.playerId;
        return hits.length > 0;
    }).map(function (_ref5) {
        var hits = _ref5.hits,
            playerId = _ref5.playerId;

        // todo: HIT is not helpful for clients? maybe send the complete new state of the client?
        return {
            type: 'HIT',
            origin: 'server', // todo fugly
            sendToClient: true, // todo fugly
            toAll: true, // todo fugly
            data: {
                shooter: playerId,
                hits: hits
            }
        };
    });
};

var requestedShots = exports.requestedShots = function requestedShots(action$, store) {
    return action$.ofType('SHOT_REQUESTED').groupBy(function (payload) {
        return payload.data.playerId;
    }).flatMap(function (group) {
        return group.throttleTime(store.getState().rules.reloadTime).map(function (payload) {
            return _extends({}, payload, {
                type: 'SHOT_FIRED',
                origin: 'server',
                sendToClient: true
            });
        });
    });
};

var moves = exports.moves = function moves(action$, store) {
    return action$.ofType('MOVE_REQUESTED').groupBy(function (payload) {
        return payload.data.playerId;
    }).flatMap(function (group) {
        return group.throttleTime(store.getState().rules.moveTime).map(function (_ref6) {
            var _ref6$data = _ref6.data,
                playerId = _ref6$data.playerId,
                direction = _ref6$data.direction;

            var _store$getState4 = store.getState(),
                rules = _store$getState4.rules,
                players = _store$getState4.players;

            var moveDistance = rules.moveDistance,
                worldWidth = rules.worldWidth,
                worldHeight = rules.worldHeight;

            var player = players[playerId]; // todo use selector function for getting players?
            var x = player.x,
                y = player.y;

            var canMove = direction === 'left' && x - moveDistance >= 0 || direction === 'right' && x + moveDistance < worldWidth || direction === 'up' && y - moveDistance >= 0 || direction === 'down' && y + moveDistance < worldHeight;

            if (!canMove) {
                // todo only send move to the spefic client
                return {
                    type: 'MOVE_REJECTED',
                    origin: 'server', // todo fugly
                    // sendToClient: true, // todo fugly
                    // toAll: false, // todo fugly
                    data: {
                        playerId: playerId,
                        direction: direction
                    }
                };
            }

            return {
                type: 'MOVE',
                origin: 'server', // todo fugly
                sendToClient: true, // todo fugly
                toAll: true, // todo fugly
                data: {
                    playerId: playerId,
                    direction: direction
                }
            };
        });
    });
};
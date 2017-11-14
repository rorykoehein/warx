'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getRandomPosition = function getRandomPosition(size, step) {
    var min = 0;
    return Math.floor(Math.random() * (size - min) / step) * step + min;
};

var spawn = exports.spawn = function spawn(_ref) {
    var playerId = _ref.playerId,
        worldWidth = _ref.worldWidth,
        worldHeight = _ref.worldHeight,
        moveDistance = _ref.moveDistance;
    return {
        type: 'SPAWN',
        origin: 'server',
        sendToClient: true,
        toAll: true,
        data: {
            playerId: playerId,
            x: getRandomPosition(worldWidth, moveDistance),
            y: getRandomPosition(worldHeight, moveDistance)
        }
    };
};
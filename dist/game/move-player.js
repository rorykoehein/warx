'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var movePlayer = function movePlayer(player, direction, step) {
    return _extends({}, player, {
        direction: direction,
        x: direction === 'left' ? player.x - step : direction === 'right' ? player.x + step : player.x,
        y: direction === 'up' ? player.y - step : direction === 'down' ? player.y + step : player.y
    });
};

exports.default = movePlayer;
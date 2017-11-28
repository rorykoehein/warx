import type { Player, Direction } from '../types/game';

export const movePlayer = (player: Player, direction: Direction, step: number, time: number): Player => ({
    ...player,
    direction,
    x: direction === 'left' ? player.x - step : direction === 'right' ? player.x + step : player.x,
    y: direction === 'up' ? player.y - step : direction === 'down' ? player.y + step : player.y,
    lastMove: time
});

export const canMove = (player: Player, direction: Direction, rules, time: number): Boolean => {
    const { moveDistance, worldWidth, worldHeight, moveTime } = rules;
    const { x, y, lastMove } = player;
    return (!lastMove || time - lastMove >= moveTime) && (
        (direction === 'left' && x - moveDistance >= 0) ||
        (direction === 'right' && x + moveDistance < worldWidth) ||
        (direction === 'up' && y - moveDistance >= 0) ||
        (direction === 'down' && y + moveDistance < worldHeight)
    );
};

import type { Player, Direction, Rules } from '../types/game';


export const calculateMovement = (
    startX: number, startY: number, startTime: number, endTime: number, rules: Rules, direction: Direction
) => {
    const { moveTime, moveDistance } = rules;
    const deltaTime = endTime - startTime;
    const distance = Math.round(deltaTime/moveTime * moveDistance);
    const newX = direction === 'right'
        ? startX + distance
        : direction === 'left'
            ? startX - distance
            : startX;

    const newY = direction === 'down'
        ? startY + distance
        : direction === 'up'
            ? startY - distance
            : startY;

    return { x: newX, y: newY }
};

export const canMove = (player: Player, direction: Direction, rules): Boolean => {
    const { moveDistance, worldWidth, worldHeight } = rules;
    const { x, y } = player;
    return (direction === 'left' && x - moveDistance >= 0) ||
        (direction === 'right' && x + moveDistance < worldWidth) ||
        (direction === 'up' && y - moveDistance >= 0) ||
        (direction === 'down' && y + moveDistance < worldHeight);
};

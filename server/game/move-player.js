import type { Player, Direction } from '../../client/src/types/game';

const movePlayer = (player: Player, direction: Direction, step: number): Player => ({
    ...player,
    direction,
    x: direction === 'left' ? player.x - step : direction === 'right' ? player.x + step : player.x,
    y: direction === 'up' ? player.y - step : direction === 'down' ? player.y + step : player.y,
});

export default movePlayer;

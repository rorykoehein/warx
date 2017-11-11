// @flow

import type { Player } from '../../client/src/app/types/game';

const initialState = {
    players: {},
};

const step = 10; // share this
const getRandomPosition = () => {
    const min = step;
    const max = 800;
    return Math.floor(Math.random() * (max - min) / step) * step + min;
};

// todo: share this
const move = (player: Player, direction): Player => ({
    ...player,
    direction,
    x: direction === 'left' ? player.x - step : direction === 'right' ? player.x + step : player.x,
    y: direction === 'up' ? player.y - step : direction === 'down' ? player.y + step : player.y,
});

// todo: server state and action types
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CONNECT': {
            const { players, ...rest } = state;
            const { data: { playerId } } = action;
            return {
                players: {
                    ...players,
                    [`${playerId}`]: {
                        id: playerId,
                        name: `Player ${playerId}`,
                        x: getRandomPosition(),
                        y: getRandomPosition(),
                        alive: true, // todo: don't set alive until after spawn
                    }
                },
                ...rest,
            };
        }

        case 'DISCONNECT': {
            const { players, ...restState } = state;
            const { data: { playerId } } = action;
            const { [playerId]: playerToRemove, ...restPlayers } = players;
            return {
                players: restPlayers,
                ...restState,
            };
        }

        case 'MOVE': {
            const { players, ...rest } = state;
            const { data: { direction, playerId } } = action;
            const player = players[playerId];
            if(!player) return state;
            return {
                ...rest,
                players: {
                    ...players,
                    [playerId]: move(player, direction),
                },
            };
        }

        case 'SPAWN': {
            // todo call spawn after connecting and after hits
        }

        default:
            return state;
    }
};

export default reducer;

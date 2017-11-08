// @flow

import type { Player } from '../client/src/app/types/game';

const initialState = {
    players: {},
};

const getRandomPosition = () => {
    const min = 10;
    const max = 800;
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

// todo: share this?
const move = (player: Player, direction): Player => ({
    ...player,
    direction,
    x: direction === 'left' ? player.x - 10 : direction === 'right' ? player.x + 10 : player.x,
    y: direction === 'up' ? player.y - 10 : direction === 'down' ? player.y + 10 : player.y,
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
        default:
            return state;
    }
};

export default reducer;

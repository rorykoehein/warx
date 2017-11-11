// @flow

import type { Player } from '../../client/src/app/types/game';
import rules from './rules';

const initialState = {
    players: {},
    rules: {},
};

// todo: share this
const move = (player: Player, direction, step): Player => ({
    ...player,
    direction,
    x: direction === 'left' ? player.x - step : direction === 'right' ? player.x + step : player.x,
    y: direction === 'up' ? player.y - step : direction === 'down' ? player.y + step : player.y,
});

// todo: server state and action types
const reducer = (state = initialState, action) => {
    console.log('reduce', action);
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
                        alive: false, // todo: don't set alive until after spawn
                    }
                },
                ...rest,
            };
        }

        case 'SPAWN': {
            // todo call spawn after connecting and after hits
            const { players, ...rest } = state;
            const { data: { playerId, x, y } } = action;
            const player = players[playerId];
            return {
                players: {
                    ...players,
                    [`${playerId}`]: {
                        ...player,
                        x,
                        y,
                        alive: true, // todo: don't set alive until after spawn
                    }
                },
                ...rest,
            };
        }

        case 'HIT': {
            const { players, ...rest } = state;
            const { data: { playerId } } = action;
            const player = players[playerId];
            return {
                players: {
                    ...players,
                    [`${playerId}`]: {
                        ...player,
                        alive: false, // todo: don't set alive until after spawn
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
                    [playerId]: move(player, direction, rules.moveDistance),
                },
            };
        }

        default:
            return state;
    }
};

export default reducer;

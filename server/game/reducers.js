// @flow

import rules from './default-rules';
import movePlayer from './move-player';

const initialState = {
    players: {},
    rules: { ...rules },
};

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
            const { data: { hits } } = action;

            const deadPlayers = hits.reduce((acc, playerId) => ({
                ...acc,
                [playerId]: {
                    ...players[playerId],
                    alive: false,
                }
            }), {});

            return {
                players: {
                    ...players,
                    ...deadPlayers,
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
                    [playerId]: movePlayer(player, direction, rules.moveDistance),
                },
            };
        }

        default:
            return state;
    }
};

export default reducer;

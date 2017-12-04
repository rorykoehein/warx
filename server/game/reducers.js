// @flow

import rules from './default-rules';
import { movePlayer } from '../../client/src/state/move-helpers';

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

        case 'SELF_JOIN': { // todo: rename to join request
            const { players, ...rest } = state;
            const { data: { playerId, playerName } } = action;
            const player = players[playerId];
            return {
                players: {
                    ...players,
                    [`${playerId}`]: {
                        ...player,
                        name: playerName,
                    }
                },
                ...rest,
            };
        }

        case 'SPAWN': {
            // todo call spawn after connecting and after hits
            const { players, ...rest } = state;
            const { data: { playerId, x, y, playerName } } = action;
            const player = players[playerId];
            return {
                players: {
                    ...players,
                    [`${playerId}`]: {
                        ...player,
                        x,
                        y,
                        name: playerName, // todo: why have player name is spawn
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

        case 'MOVE_TO': {
            const { players, ...rest } = state;
            const { data: { direction, playerId, x, y } } = action;
            const player = players[playerId];
            if(!player) return state;
            return {
                ...rest,
                players: {
                    ...players,
                    [playerId]: {
                        ...player,
                        direction,
                        x,
                        y,
                    },
                },
            };
        }

        case 'PING_LATENCY': {
            const { players, ...rest } = state;
            const { data: { latency = 50, playerId } } = action;
            const player = players[playerId];
            if(!player) return state;
            return {
                ...rest,
                players: {
                    ...players,
                    [playerId]: {
                        ...player,
                        latency
                    },
                },
            };
        }

        default:
            return state;
    }
};

export default reducer;

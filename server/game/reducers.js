// @flow

import rules from '../../client/src/shared/default-rules';

const initialState = {
    players: {},
    rules: { ...rules },
};

const replacePlayerProps = (state, playerId, props) => {
    const { players, ...rest } = state;
    const player = players[playerId];
    if(!player) return state;
    return {
        ...rest,
        players: {
            ...players,
            [playerId]: {
                ...player,
                ...props,
            },
        },
    };
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
                        alive: false,
                        frags: 0,
                        deaths: 0,
                    }
                },
                ...rest,
            };
        }

        case 'SELF_JOINED': { // todo: rename to join request
            const { players, ...rest } = state;
            const { data: { playerId, playerName } } = action;
            const player = players[playerId];
            return {
                players: {
                    ...players,
                    [`${playerId}`]: {
                        ...player,
                        name: playerName.trim().substring(0, 20),
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
                        alive: true,
                    }
                },
                ...rest,
            };
        }

        case 'HIT': {
            const { players, ...rest } = state;
            const { data: { shooter, hits } } = action;

            const deadPlayers = hits.reduce((acc, playerId) => ({
                ...acc,
                [playerId]: {
                    ...players[playerId],
                    alive: false,
                    deaths: players[playerId].deaths + 1,
                }
            }), {});

            const selfKill = hits.includes(shooter);

            const shooterPlayer = selfKill ? {
                ...players[shooter],
                alive: false,
                deaths: players[shooter].deaths + 1,
                frags: players[shooter].frags + hits.length - 1,
            } : {
                ...players[shooter],
                frags: players[shooter].frags + hits.length,
            };

            return {
                players: {
                    ...players,
                    ...deadPlayers,
                    [shooter]: shooterPlayer,
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

        case 'MOVE_STARTED': {
            const { data: { direction, playerId } } = action;
            return replacePlayerProps(state, playerId, {
                direction,
                isMoving: true,
            });
        }

        case 'MOVE_STOPPED': {
            const { data: { direction, playerId } } = action;
            return replacePlayerProps(state, playerId, {
                direction,
                isMoving: true,
            });
        }

        case 'MOVE_TO': {
            const { data: { direction, playerId, x, y } } = action;
            return replacePlayerProps(state, playerId, {
                direction,
                x,
                y,
            });
        }

        case 'PING_LATENCY': {
            const { data: { latency = 50, playerId } } = action;
            return replacePlayerProps(state, playerId, {
                latency
            });
        }

        default:
            return state;
    }
};

export default reducer;

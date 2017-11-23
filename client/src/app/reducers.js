// @flow

import type { Player, State } from './types/game';
import type { Action } from './types/actions';
import initialState from './initial-state';

const move = (player: Player, direction, step): Player => ({
    ...player,
    direction,
    x: direction === 'left' ? player.x - step : direction === 'right' ? player.x + step : player.x,
    y: direction === 'up' ? player.y - step : direction === 'down' ? player.y + step : player.y,
});

const reducer = (state: State = initialState, action: Action): State => {
    const { players, currentPlayerId, rules } = state;
    switch (action.type) {
        case 'GAME_STATE_CHANGED': {
            const { data: { state: { players, currentPlayerId, rules } } } = action;
            return {
                ...state,
                players,
                currentPlayerId,
                rules,
            };
        }

        case 'PLAYER_JOINED': {
            const { data: { player } } = action;
            return {
                ...state,
                isSignedIn: state.isSignedIn || player.id === currentPlayerId,
                players: {
                    ...players,
                    [player.id]: player,
                }
            };
        }

        // todo respawned player is not rendered
        case 'SPAWN': {
            const { data: { playerId, x, y } } = action;
            const player = players[playerId];
            return {
                ...state,
                players: {
                    ...players,
                    [playerId]: {
                        ...player,
                        x,
                        y,
                        alive: true,
                        weaponLoaded: true,
                    },
                }
            };
        }

        case 'PLAYER_LEFT': {
            const { data: { playerId } } = action;
            const { [playerId]: leftPlayer, ...restPlayers } = players;
            return {
                ...state,
                players: restPlayers,
            };
        }

        case 'MOVE': {
            const { data: { direction, playerId } } = action;
            const player = players[playerId];
            if(!player) return state;
            return {
                ...state,
                players: {
                    ...players,
                    [playerId]: move(player, direction, rules.moveDistance),
                },
            };
        }

        case 'SHOT_FIRED': {
            const { data: { playerId } } = action;
            const { shots } = state;
            const { direction, x, y } = players[playerId];
            return {
                ...state,
                shots: {
                    ...shots,
                    [playerId] : { direction, x, y, playerId }
                },
                players: {
                    ...players,
                    [playerId]: {
                        ...players[playerId],
                        weaponLoaded: false,
                    }
                },
            };
        }

        case 'SHOT_COOLED': {
            const { data: { playerId } } = action;
            const { shots } = state;
            const { [playerId]: removeShot, ...restShots } = shots;
            return {
                ...state,
                shots: restShots,
            };
        }

        case 'WEAPON_RELOADED': {
            const { data: { playerId } } = action;
            const player = players[playerId];
            if(!player) return state;
            return {
                ...state,
                players: {
                    ...players,
                    [playerId]: {
                        ...player,
                        weaponLoaded: true,
                    }
                },
            };
        }

        case 'HIT': {
            const { data: { hits } } = action;
            const newPlayers = Object.keys(players).reduce((acc, key) => {
                const player = players[key];
                acc[key] = !hits.includes(key) ? player : ({ ...player, alive: false });
                return acc;
            }, {});

            return {
                ...state,
                players: newPlayers
            };
        }

        case 'PING_LATENCY': {
            const { data: { latency } } = action;
            return {
                ...state,
                latency: latency
            };
        }

        case 'MESSAGE_ADDED': {
            const { data: { message = '' } } = action;
            const { messages = {} } = state;
            const nextId = Object.keys(messages).length;
            return {
                ...state,
                messages: {
                    ...messages,
                    [nextId]: message,
                },
            };
        }

        case 'MESSAGE_CLEANUP': {
            const { data: { messageId } } = action;
            const { [messageId]: removeMessage, ...messages } = state.messages;
            return {
                ...state,
                messages,
            };
        }

        default:
            return state;
    }
};

export default reducer;

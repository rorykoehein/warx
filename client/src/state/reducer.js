// @flow

import type { State } from '../types/game';
import type { Action } from '../types/actions';
import { reduceReducers } from './helpers';
import initialState from './initial-state';
import { reducer as scoresReducer } from "./scores";
import { reducer as movementReducer } from "./movement";
import { reducer as playersReducer } from "./players";

const coreReducer = (state: State = initialState, action: Action): State => {
    const { players } = state;
    switch (action.type) {
        // core
        case 'GAME_STATE_CHANGED': {
            const { data: { state: { players, currentPlayerId, rules } } } = action;
            return {
                ...state,
                players,
                currentPlayerId,
                rules,
            };
        }

        case 'PING_LATENCY': {
            const { data: { latency } } = action;
            return {
                ...state,
                latency: latency
            };
        }

        // shots
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

        // explosions
        case 'EXPLOSION_ADDED': {
            const { data: { id, x, y, size } } = action;
            const { explosions } = state;
            return {
                ...state,
                explosions: {
                    ...explosions,
                    [id] : { id, x, y, size }
                },
            };
        }

        case 'EXPLOSION_REMOVED': {
            const { data: { id } } = action;
            const { explosions } = state;
            const { [`${id}`]: removeExplosion, ...restExplosions } = explosions;
            return {
                ...state,
                explosions: restExplosions,
            };
        }

        // messages
        case 'MESSAGE_ADDED': {
            const { data: { message = '', id } } = action;
            const { messages = {} } = state;
            return {
                ...state,
                messages: {
                    ...messages,
                    [`${id}`]: message,
                },
            };
        }

        case 'MESSAGE_CLEANUP': {
            const { data: { id } } = action;
            const { [`${id}`]: removeMessage, ...messages } = state.messages;
            return {
                ...state,
                messages: messages,
            };
        }

        default:
            return state;
    }
};

export default reduceReducers(
    scoresReducer,
    movementReducer,
    playersReducer,
    coreReducer
);

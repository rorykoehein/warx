// @flow

import 'rxjs';
import { combineEpics } from 'redux-observable';
import rules from '../shared/default-rules';
import type { Store } from '../../client/src/types/framework';
import { getRandomPosition, replacePlayerProps } from "./helpers";

// this module describes the core behaviors of the game: players connect, join,
// spawn, latency, etc.

export const initialState = {
    players: {},
    rules: { ...rules },
};

export const spawn = ({ playerId, worldWidth, worldHeight, moveDistance, playerName }) => ({
    type: 'SPAWN',
    origin: 'server',
    sendToClient: true,
    toAll: true,
    data: {
        playerId,
        x: getRandomPosition(worldWidth, moveDistance),
        y: getRandomPosition(worldHeight, moveDistance),
        playerName,
    }
});

// todo: server state and action types
export const reducer = (state, action) => {
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

        case 'DISCONNECT': {
            const { players, ...restState } = state;
            const { data: { playerId } } = action;
            const { [playerId]: playerToRemove, ...restPlayers } = players;
            return {
                players: restPlayers,
                ...restState,
            };
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

export const getRules = store => store.getState().rules;

export const spawnJoins = (action$, store: Store) =>
    action$
        .ofType('SELF_JOINED')
        .map(({ data: { playerId } }) => {
            const { rules: { worldWidth, worldHeight, moveDistance }} = store.getState();
            return spawn({ playerId, worldWidth, worldHeight, moveDistance });
        });

export const broadcastJoins = (action$, store: Store) =>
    action$
        .ofType('SELF_JOINED')
        .map(({ data: { playerId, playerName } }) => {
            const player = store.getState().players[playerId];
            return {
                type: 'PLAYER_JOINED',
                origin: 'server', // todo fugly
                sendToClient: true, // todo fugly
                toAll: true, // todo fugly
                data: {
                    player: { ...player, name: playerName, } // todo: this is ugly, dp SELF_JOINED -> state update -> broadcast
                },
            };
        });


export const epic = combineEpics(
    broadcastJoins,
    spawnJoins,
);

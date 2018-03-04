// @flow

import 'rxjs';
import { combineEpics } from 'redux-observable';
import rules from '../shared/default-rules';
import { toList } from '../shared/helpers';
import { getRandomPosition, replacePlayerProps } from "./helpers";
import { getCurrentServer } from './module-servers';
import type { Store } from '../../client/src/types/framework';
import type { Players, Player, PlayerId, PlayerList } from '../../client/src/types/game';
import type { ActionInterface } from './types';

// this module describes the core behaviors of the game: players connect, join,
// spawn, latency, etc.

const playerIsSignedIn = (state, playerId) => {
    const player = getPlayerById(state, playerId);
    return player && player.isSignedIn;
};

const canJoin = state => {
    // the player can only join if the server is not full
    const server = getCurrentServer(state);
    return server && server.maxPlayers > getSignedInPlayers(state).length;
};

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
        case 'CONNECTION_REQUESTED': {
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
                        isSignedIn: false,
                    }
                },
                ...rest,
            };
        }

        case 'JOIN_REQUESTED': {
            const { players, ...rest } = state;
            const { data: { playerId, playerName } } = action;
            const player = players[playerId];
            return canJoin(state)
                ? {
                    players: {
                        ...players,
                        [`${playerId}`]: {
                            ...player,
                            name: playerName.trim().substring(0, 20),
                            isSignedIn: true,
                        }
                    },
                    ...rest,
                } : state;
        }

        case 'PLAYER_SIGN_OUT_REQUEST': {
            const { players, ...rest } = state;
            const { data: { playerId } } = action;
            const player = players[playerId];
            return {
                players: {
                    ...players,
                    [`${playerId}`]: {
                        ...player,
                        isSignedIn: false,
                        alive: false,
                    }
                },
                ...rest,
            };
        }

        case 'SPAWN': {
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

        case 'DISCONNECTION_REQUESTED': {
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

// selectors
export const getRules = state => state.rules;
export const getPlayers = (state): Players => state.players;
export const getPlayerById = (state, id: ?PlayerId): ?Player =>
    (id !== null && id !== undefined) ? getPlayers(state)[id] : null;
export const getSignedInPlayers = (state): PlayerList =>
    toList(state.players).filter(player => player.isSignedIn);

// epics
export const spawnJoins = (action$: ActionInterface, store: Store) =>
    action$
        .ofType('JOIN_REQUESTED')
        .filter(({ data: { playerId } }) => playerIsSignedIn(store.getState(), playerId))
        .map(({ data: { playerId } }) => {
            const { rules: { worldWidth, worldHeight, moveDistance }} = store.getState();
            return spawn({ playerId, worldWidth, worldHeight, moveDistance });
        });

export const broadcastJoins = (action$: ActionInterface, store: Store) =>
    action$
        .ofType('JOIN_REQUESTED')
        .filter(({ data: { playerId } }) => playerIsSignedIn(store.getState(), playerId))
        .map(({ data: { playerId, playerName } }) => {
            const player = store.getState().players[playerId];
            return {
                type: 'PLAYER_JOINED',
                origin: 'server',
                sendToClient: true,
                toAll: true,
                data: {
                    player: { ...player, name: playerName, } // todo: this is ugly, dp JOIN_REQUESTED -> state update -> broadcast
                },
            };
        });

export const broadcastSignOuts = (action$: ActionInterface, store: Store) =>
    action$
        .ofType('PLAYER_SIGN_OUT_REQUEST')
        .map(({ data: { playerId }}) => store.getState().players[playerId])
        .filter(player => player)
        .map(player => ({
            type: 'PLAYER_SIGNED_OUT',
            origin: 'server',
            sendToClient: true,
            toAll: true,
            data: {
                player,
            }
        }));

export const epic = combineEpics(
    broadcastJoins,
    spawnJoins,
    broadcastSignOuts,
);

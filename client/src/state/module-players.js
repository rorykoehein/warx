// @flow

import { createSelector } from 'reselect';
import { combineEpics } from 'redux-observable';
import type { State, Player, PlayerId, Players, PlayerList } from '../types/game';
import { toList } from '../shared/helpers';

// local types
type SelfJoinAction = {
    +type: 'JOIN_REQUESTED',
    +origin: 'client',
    +data: {
        +playerName: string
    }
};

type PlayerJoinAction = {
    +type: 'PLAYER_JOINED',
    +origin: 'server',
    +data: {
        +player: Player
    }
};

type PlayerSignOutRequestAction = {
    +type: 'PLAYER_SIGN_OUT_REQUEST',
    +origin: 'server',
    +data: {
        +player: Player
    }
};

type PlayerSignedOutAction = {
    +type: 'PLAYER_SIGNED_OUT',
    +origin: 'server',
    +data: {
        +player: Player
    }
};

type PlayerLeftAction = {
    +type: 'PLAYER_LEFT',
    +origin: 'server',
    +data: {
        +playerId: PlayerId,
    }
};

type PlayerUpdatedAction = {
    +type: 'PLAYERS_UPDATED',
    +origin: 'server',
    +data: {
        +players: Players,
    }
};

type SpawnAction = {
    +type: 'SPAWN',
    +origin: 'server',
    +data: {
        +playerId: PlayerId,
        +x: number,
        +y: number,
    }
};

type Action = SelfJoinAction | PlayerJoinAction | PlayerSignedOutAction |
    PlayerLeftAction | PlayerUpdatedAction | SpawnAction;

// the part of the state this module is responsible for
export type PlayersState = {
    +currentPlayerId: ?PlayerId,
    +players: Players,
    +isSignedIn: boolean,
};

// initial state
export const initialState: PlayersState = {
    currentPlayerId: null,
    players: {},
    isSignedIn: false,
};

// actions
export const selfJoin = ({ playerName }: { playerName: string }): SelfJoinAction => {
    return {
        type: 'JOIN_REQUESTED',
        origin: 'client',
        sendToServer: true, // todo replace by epic?
        data: {
            playerName
        }
    };
};

// reducer
// all though the reducer returns and gets passed more than just PlayersState
// we only should know about PlayersState in here
export const reducer = (state: PlayersState, action: Action): PlayersState => {
    const { players, currentPlayerId } = state;
    switch (action.type) {
        // when a player signs in
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

        // when a player signs out (back to sign in screen)
        case 'PLAYER_SIGNED_OUT': {
            const { data: { player } } = action;
            const isCurrentPlayer = player.id === currentPlayerId;
            return {
                ...state,
                isSignedIn: isCurrentPlayer ? false : state.isSignedIn,
                players: {
                    ...players,
                    [player.id]: {
                        ...player,
                        alive: false,
                        isSignedIn: false,
                    },
                }
            };
        }

        // when a player leaves the server (remove the player)
        case 'PLAYER_LEFT': {
            const { data: { playerId } } = action;
            const { [playerId]: leftPlayer, ...restPlayers } = players;
            return {
                ...state,
                players: restPlayers,
            };
        }

        case 'PLAYERS_UPDATED': {
            const { data: { players: newPlayers } } = action;
            return {
                ...state,
                players: {
                    ...players,
                    ...newPlayers
                }
            };
        }

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

        default:
            return state;
    }
};

// selectors
export const isSignedIn = (state: State) => state.isSignedIn;
export const getPlayers = (state: State): Players => state.players;
export const getPlayerById = (state: State, id: ?PlayerId): ?Player =>
    (id !== null && id !== undefined) ? getPlayers(state)[id] : null;
export const getCurrentPlayerId = (state: State): ?PlayerId => state.currentPlayerId;
export const getCurrentPlayer = (state: State): ?Player => getPlayerById(state, getCurrentPlayerId(state));

export const getAlivePlayers = createSelector(
    getPlayers,
    (players: Players): PlayerList => toList(players).filter(player => player.alive)
);

const keyDownEsc = (action$, store) => action$
    .ofType('KEY_DOWN')
    .filter(({ data: { key } }) => console.log('key', key) || key === 'Escape')
    .map(({ data: { key: escKey } }) => ({
        type: 'PLAYER_SIGN_OUT_REQUEST',
        sendToServer: true,
        origin: 'client',
        data: {}
    }));

export const epic = combineEpics(
    keyDownEsc,
);

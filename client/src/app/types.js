// @flow

import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';

export type PlayerId = string;

export type Direction = 'up' | 'right' | 'down' | 'left';

export type Player = {
    +id: PlayerId,
    +name: string,
    +x: number,
    +y: number,
    +direction: Direction,
}

export type Players = {
    +[id: PlayerId]: Player
};

export type State = {
    +players: Players,
    +currentPlayerId?: PlayerId,
};

export type ReduxInitAction = { type: '@@INIT' };

export type JoinPlayerAction = {
    type: 'PLAYER_JOINED',
    +player: Player,
};

export type JoinLeftAction = {
    type: 'PLAYER_LEFT',
    +id: PlayerId,
};

export type MoveAction = {
    type: 'MOVE',
    +id: PlayerId,
    +direction: Direction,
};

export type SetCurrentPlayerAction = {
    type: 'CURRENT_PLAYER_SET',
    +currentPlayer: PlayerId,
};

export type SetGameState = {
    type: 'GAME_STATE_CHANGED',
    +state: State, // todo client and server state?
};

export type Action = ReduxInitAction | JoinPlayerAction | JoinLeftAction | MoveAction | SetCurrentPlayerAction |
    SetGameState;

export type Store = ReduxStore<State, Action>;

export type Dispatch = ReduxDispatch<Action>;

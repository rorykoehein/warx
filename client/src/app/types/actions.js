// @flow
import type { State, Player, PlayerId, Direction } from './game.js'

export type ActionOrigin = 'server' | 'client' | 'all';

// todo figure out subtypes or interfaces for this
export type ActionInterface = {
    +type: string,
    +origin: ActionOrigin,
    +sendToServer: boolean,
    +data: any,
}

export type ReduxInitAction = {
    +type: '@@INIT',
    +origin: 'client',
};

export type PlayerJoinAction = {
    +type: 'PLAYER_JOINED',
    +origin: 'server',
    +data: {
        +player: Player
    }
};

export type PlayerLeftAction = {
    +type: 'PLAYER_LEFT',
    +origin: 'server',
    +data: {
        +playerId: PlayerId,
    }
};

export type MoveAction = {
    +type: 'MOVE',
    +origin: ActionOrigin,
    +data: {
        +playerId: PlayerId,
        +direction: Direction,
    }
};

export type ShootAction = {
    +type: 'SHOOT',
    +origin: ActionOrigin,
    +data: {
        +playerId: PlayerId,
    }
};

export type ShootRemoveAction = {
    +type: 'SHOOT_REMOVE',
    +origin: ActionOrigin,
    +data: {
        +playerId: PlayerId,
    }
};

export type GameStateChangedAction = {
    +type: 'GAME_STATE_CHANGED',
    +origin: 'server',
    +data: {
        +state: State, // todo client and server state?
    }
};

export type Action = ReduxInitAction | PlayerJoinAction | PlayerLeftAction | MoveAction | ShootAction |
    ShootRemoveAction | GameStateChangedAction;

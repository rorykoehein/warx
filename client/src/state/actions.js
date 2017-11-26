// @flow

import type { Direction, PlayerId } from '../types/game';
import type {
    MoveAction, SelfShotFireAction, ShotFireAction, ShotCoolAction, ActionOrigin, ActionInterface,
    KeyDownAction, KeyUpAction, AddMessageAction, RemoveMessageAction, SelfJoinAction, RemoveExplosionAction
} from '../types/actions';

export const move = ({ direction, playerId } : { direction: Direction, playerId: PlayerId }): MoveAction => {
    return {
        type: 'MOVE',
        origin: 'client',
        data: {
            direction,
            playerId,
        }
    };
};

// to be used from the UI
export const selfMove = ({ direction } : { direction: Direction }): ActionInterface => {
    return {
        type: 'SELF_MOVED',
        origin: 'client',
        data: {
            direction
        }
    };
};

// to be used from the UI
export const selfShotFire = (): SelfShotFireAction => {
    return {
        type: 'SELF_SHOT_FIRED',
        origin: 'client',
    };
};

// to eceive from server
export const shotFire = (payload : { playerId: PlayerId, origin: ActionOrigin }): ShotFireAction => {
    return {
        type: 'SHOT_FIRED',
        origin: payload.origin,
        data: {
            playerId: payload.playerId,
        }
    };
};

// to send to server
export const shotFireToServer = (): ActionInterface => {
    return {
        type: 'SHOT_REQUESTED',
    };
};

// to send to server
export const moveToServer = ({ direction }: { direction: Direction }): ActionInterface => {
    return {
        type: 'MOVE_REQUESTED',
        data: {
            direction
        }
    };
};

export const shotCool = ({ playerId } : { playerId: PlayerId }): ShotCoolAction => {
    return {
        type: 'SHOT_COOLED',
        origin: 'client',
        data: {
            playerId,
        }
    };
};

export const weaponReload = ({ playerId } : { playerId: PlayerId }): ActionInterface => {
    return {
        type: 'WEAPON_RELOADED',
        origin: 'client',
        data: {
            playerId,
        }
    };
};

export const keyDown = ({ key }: { key: string }): KeyDownAction => {
    return {
        type: 'KEY_DOWN',
        origin: 'client',
        data: {
            key
        }
    };
};

export const keyUp = ({ key }: { key: string }): KeyUpAction => {
    return {
        type: 'KEY_UP',
        origin: 'client',
        data: {
            key
        }
    };
};

export const addMessage = ({ message, id }: { message: string, id: number }): AddMessageAction => {
    return {
        type: 'MESSAGE_ADDED',
        origin: 'client',
        data: {
            message,
            id,
        }
    };
};

export const cleanupMessage = ({ id }: { id: number }): RemoveMessageAction => {
    return {
        type: 'MESSAGE_CLEANUP',
        origin: 'client',
        data: {
            id
        }
    };
};

export const selfJoin = ({ playerName }: { playerName: string }): SelfJoinAction => {
    return {
        type: 'SELF_JOINED',
        origin: 'client',
        sendToServer: true, // todo replace by epic?
        data: {
            playerName
        }
    };
};


export const removeExplosion = ({ id }: { id: number }): RemoveExplosionAction => {
    return {
        type: 'EXPLOSION_REMOVED',
        origin: 'client',
        sendToClient: true,
        toAll: true,
        data: {
            id
        }
    };
};

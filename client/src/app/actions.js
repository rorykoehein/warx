// @flow

import type { Direction, PlayerId } from './types/game';
import type { MoveAction, SelfShotFireAction, ShotFireAction, ShotCoolAction, ActionOrigin, ActionInterface } from './types/actions';

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

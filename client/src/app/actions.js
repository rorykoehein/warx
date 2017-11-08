// @flow

import type { Direction, PlayerId } from './types/game';
import type { MoveAction, ShootAction, ShootRemoveAction } from './types/actions';

export const move = ({ direction, playerId } : { direction: Direction, playerId: PlayerId }): MoveAction => {
    return {
        type: 'MOVE',
        origin: 'client',
        sendToServer: true,
        data: {
            direction,
            playerId,
        }
    };
};

export const shoot = ({ playerId } : { playerId: PlayerId }): ShootAction => {
    return {
        type: 'SHOOT',
        origin: 'client',
        sendToServer: true,
        data: {
            playerId,
        }
    };
};

export const shootRemove = ({ playerId } : { playerId: PlayerId }): ShootRemoveAction => {
    return {
        type: 'SHOOT_REMOVE',
        origin: 'client',
        sendToServer: false,
        data: {
            playerId,
        }
    };
};

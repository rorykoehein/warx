// @flow

import type { Direction, PlayerId } from './types/game';
import type { MoveAction, ShootAction } from './types/actions';

export const move = ({ direction, id } : { direction: Direction, id: PlayerId }): MoveAction => {
    return {
        type: 'MOVE',
        origin: 'client',
        network: true,
        data: {
            direction,
            id,
        }
    };
};

export const shoot = ({ id } : { id: PlayerId }): ShootAction => {
    return {
        type: 'SHOOT',
        origin: 'client',
        network: true,
        data: {
            id,
        }
    };
};

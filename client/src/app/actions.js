// @flow

import type { Direction, PlayerId } from './types/game';
import type { MoveAction } from './types/actions';

export const move = ({ direction, id } : { direction: Direction, id: PlayerId }): MoveAction => {
    return {
        type: 'MOVE',
        origin: 'client',
        data: {
            direction,
            id,
        }
    };
};

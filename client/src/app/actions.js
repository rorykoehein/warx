// @flow

import { sendAction } from './socket';
import type { MoveAction, Direction, PlayerId } from './types';

export const move = ({ direction, id } : { direction: Direction, id: PlayerId }): MoveAction => {
    const action = {
        type: 'MOVE',
        direction,
        id,
    };

    sendAction(action); // todo: move to middleware, rxjs or sagas

    return action
};

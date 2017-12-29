import { combineEpics } from 'redux-observable';
import { connects, pings, disconnects, networkActions } from '../messages-actions/map-actions-to-messages-epic';

export const epic = combineEpics(
    connects,
    pings,
    disconnects,
    networkActions,
);

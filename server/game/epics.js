import { combineEpics } from 'redux-observable';
import { connects, disconnects, networkActions } from '../messages-actions/map-actions-to-messages-epic';
import { shots } from './game-epic';

export default combineEpics(
    connects,
    disconnects,
    shots,
    networkActions,
);

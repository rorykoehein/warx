import { combineEpics } from 'redux-observable';
import { connects, disconnects, networkActions } from '../messages-actions/map-actions-to-messages-epic';
import { shots, moves } from './game-epic';

export default combineEpics(
    connects,
    disconnects,
    shots,
    moves,
    networkActions,
);

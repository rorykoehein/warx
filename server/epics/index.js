import { combineEpics } from 'redux-observable';
import { connects, disconnects } from './network';
import { shots } from './game';

export default combineEpics(
    connects,
    disconnects,
    shots,
);

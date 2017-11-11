import { combineEpics } from 'redux-observable';
import { connects, disconnects, networkActions } from '../messages-actions/map-actions-to-messages-epic';
import { spawnConnects, shots, moves, hits, requestedShots } from './game-epic';

export default combineEpics(
    connects,
    disconnects,
    spawnConnects,
    shots,
    requestedShots,
    moves,
    hits,
    networkActions,
);

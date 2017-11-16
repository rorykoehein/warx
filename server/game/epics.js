import { combineEpics } from 'redux-observable';
import { connects, pings, disconnects, networkActions } from '../messages-actions/map-actions-to-messages-epic';
import { spawnConnects, shots, moves, hits, requestedShots } from './game-epic';

export default combineEpics(
    connects,
    pings,
    disconnects,
    spawnConnects,
    hits,
    shots,
    requestedShots,
    moves,
    networkActions,
);

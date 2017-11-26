import { combineEpics } from 'redux-observable';
import { connects, pings, disconnects, networkActions } from '../messages-actions/map-actions-to-messages-epic';
import { spawnJoins, broadcastJoins, shots, moves, hits, requestedShots, hitsExplosions,
    explosionsHits, } from './game-epic';

export default combineEpics(
    connects,
    pings,
    disconnects,
    broadcastJoins,
    spawnJoins,
    hits,
    shots,
    requestedShots,
    moves,
    networkActions,
    hitsExplosions,
    explosionsHits,
);

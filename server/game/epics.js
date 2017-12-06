import { combineEpics } from 'redux-observable';
import { connects, pings, disconnects, networkActions } from '../messages-actions/map-actions-to-messages-epic';
import { spawnJoins, broadcastJoins, shots, hits, requestedShots, hitsExplosions,
    explosionsHits, hitsNewPlayerState } from './game-epic';
import { moveStarts, moveStops, moves, moveSyncs } from './movement';

export default combineEpics(
    connects,
    pings,
    disconnects,
    broadcastJoins,
    spawnJoins,
    hits,
    shots,
    requestedShots,
    moveStarts,
    moveStops,
    moves,
    moveSyncs,
    networkActions,
    hitsExplosions,
    explosionsHits,
    hitsNewPlayerState,
);

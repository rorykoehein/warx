import { combineEpics } from 'redux-observable';
import { connects, pings, disconnects, networkActions } from '../messages-actions/map-actions-to-messages-epic';
import { spawnJoins, broadcastJoins, shots, hits, requestedShots, hitsExplosions,
    explosionsHits, hitsNewPlayerState } from './game-epic';

export default combineEpics(
    connects,
    pings,
    disconnects,
    broadcastJoins,
    spawnJoins,
    hits,
    shots,
    requestedShots,
    networkActions,
    hitsExplosions,
    explosionsHits,
    hitsNewPlayerState,
);

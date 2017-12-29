// @flow

import { combineEpics } from 'redux-observable';
import { getRules } from './module-game';
import { hit } from './module-hits';
import type { AddExplosionAction, RemoveExplosionAction } from
    '../../client/src/types/actions';

// other modules may this module when players are hit, bombs explode, etc.
// if any player is located within the radius of an explosion, that player will
// be 'hit', which will cause another explosion

// helpers
const pointCircleCollision = (point, circle, radius) => {
    if (radius === 0) return false;
    const dx = circle[0] - point[0];
    const dy = circle[1] - point[1];
    return dx * dx + dy * dy <= radius * radius
};

// actions
export const addExplosion = (
    { id, x, y, size, causedBy }: { id: number, x: number, y: number, size: number, causedBy: PlayerId })
    : AddExplosionAction =>
    ({
        type: 'EXPLOSION_ADDED',
        origin: 'server',
        sendToClient: true,
        toAll: true,
        data: {
            id,
            x,
            y,
            size,
            causedBy,
        }
    });

// epics
export const hitsExplosions = (action$, store: Store) => {
    return action$
        .ofType('HIT')
        .flatMap(({ data: { shooter, hits } }) => {
            const players = store.getState().players;
            return hits.map(playerId => {
                const player = players[playerId];
                const size = getRules(store.getState()).explosionSize;
                return addExplosion({ id: playerId, x: player.x, y: player.y, size, causedBy: shooter });
            });
        });
};

export const explosionsHits = (action$, store: Store) => {
    return action$
        .ofType('EXPLOSION_ADDED')
        .delay(100)
        .map(({ data: { x, y, size, causedBy } }) => {
            const players = store.getState().players;
            const collisions = Object.keys(players).filter(id => {
                const { alive, x: playerX, y: playerY } = players[id];
                return alive && pointCircleCollision([playerX, playerY], [x, y], size/2);
            });
            return hit({ hits: collisions, shooter: causedBy });
        })
        .filter(({ data: { hits } }) => hits.length > 0);
};

export const epic = combineEpics(
    hitsExplosions,
    explosionsHits,
);

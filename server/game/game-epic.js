import 'rxjs';
import { Observable } from 'rxjs/Observable';
import rules from './rules';
import type { Store } from '../../client/src/app/types/framework';

const isHit = (shooter, opponent) => {
    const { direction, x, y } = shooter;
    const { x: opponentX, y: opponentY } = opponent ;
    return (direction === 'left' && opponentY === y && opponentX < x)
        || (direction === 'right' && opponentY === y && opponentX > x)
        || (direction === "down" && opponentX === x && opponentY > y)
        || (direction === "up" && opponentX === x && opponentY < y);
};

/**
 * search products epic
 * @param action$
 * @param store
 * @returns {any|*|Observable}
 */
export const shots = (action$, store: Store) =>
    // todo: split in shot fired request and shot fired action?
    action$
        .ofType('SHOT_FIRED')
        .groupBy(payload => payload.data.playerId)
        .flatMap(group => group
            .throttleTime(rules.reloadTime)
            .map(({ data: { playerId } }) => {
                const { players } = store.getState();
                const shooter = players[playerId];
                const hits = Object.keys(players).filter(key => isHit(shooter, players[key]));
                return { hits, playerId };
            })
            .filter(({ hits, playerId }) => hits.length > 0)
            .map(({ hits, playerId }) => {
                // todo: HIT is not helpful for clients? maybe send the complete new state of the client?
                return {
                    type: 'HIT',
                    origin: 'server', // todo fugly
                    sendToClient: true, // todo fugly
                    toAll: true, // todo fugly
                    data: {
                        shooter: playerId,
                        hits
                    },
                };
            })
        );

export const moves = (action$, store: Store) =>
    // todo: split in shot fired request and shot fired action?
    action$
        .ofType('MOVE_REQUESTED')
        .groupBy(payload => payload.data.playerId)
        .flatMap(group => group
            .throttleTime(rules.moveTime)
            .map(({ data: { playerId, direction } }) => {
                // todo: HIT is not helpful for clients? maybe send the complete new state of the client?
                return {
                    type: 'MOVE',
                    origin: 'server', // todo fugly
                    sendToClient: true, // todo fugly
                    toAll: false, // todo fugly
                    data: {
                        playerId,
                        direction
                    },
                };
            })
        );

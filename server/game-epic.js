import 'rxjs';
import { Observable } from 'rxjs/Observable';
import type { Store } from '../client/src/app/types/framework';

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
    action$
        .ofType('SHOT_FIRED')
        .map(({ data: { playerId } }) => {
            const { players } = store.getState();
            const shooter = players[playerId];
            const hits = Object.keys(players).filter(key => isHit(shooter, players[key]));
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
        });
        // send respawn after 250ms?

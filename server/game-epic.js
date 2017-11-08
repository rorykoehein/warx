import 'rxjs';
import { Observable } from 'rxjs/Observable';
import type { Store } from '../client/src/app/types/framework';

/**
 * search products epic
 * @param action$
 * @param store
 * @returns {any|*|Observable}
 */
export const shots = (action$, store: Store) =>
    action$
        .ofType('SHOOT')
        .filter(action => action.origin === 'client')
        .forEach(({ data: { id } }) => {
            // todo types
            const { players } = store.getState();
            // const shooter = players[id];
            // const { direction, x, y } = shooter;
            // if(direction === 'up') {
                // todo:
                // 1. get all players that collide with y higher than shooter and the same x
                // 2. if we have a hit, fire HIT action, with shooter, hit player
                // 3. process HIT/KILL in the the store: change score and respawn hit player to a new place
            // }
        });

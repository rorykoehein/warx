import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import type { State, PlayerId } from './types/game.js'
import type { Store } from './types/framework.js'
import { sendAction } from './socket';
import { shotCool, shotFire, shotFireToServer } from './actions';

/**
 * search products epic
 * @param action$
 * @returns {any|*|Observable}
 */
// todo: remove this automated stuff, in favor of explicit server actions for now
const sendToServer = (action$) => {
    return action$
        .filter(action => action.origin === 'client' && action.sendToServer === true)
        .do(action => {
            sendAction(action);
        })
        .ignoreElements();
};

const selfShots = (action$, store: Store) => {
    // todo this time needs to come from the server
    return action$
        .ofType('SELF_SHOT_FIRED')
        .map(() => {
            // convert the action to something the store understands
            const state = store.getState();
            const currentPlayerId = state.currentPlayerId;
            return shotFire({
                playerId: currentPlayerId,
                origin: 'client'
            })
        })
        .do(() => {
            // tell the server about this client initiated action
            sendAction(shotFireToServer());
        })
};


const shots = (action$) => {
    // todo this time needs to come from the server
    return action$
        .ofType('SHOT_FIRED')
        .delay(250)
        .map(({ data: { playerId } }) => shotCool({ playerId }));
};

export const rootEpic = combineEpics(
    sendToServer,
    selfShots,
    shots,
);
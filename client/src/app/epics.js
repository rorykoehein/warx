import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { sendAction } from './socket';
import { shootRemove } from './actions';

/**
 * search products epic
 * @param action$
 * @param store
 * @returns {any|*|Observable}
 */
const sendToServer = (action$) => {
    return action$
        .filter(action => action.origin === 'client' && action.sendToServer === true)
        .forEach(action => {
            sendAction(action);
        });
};

const shots = (action$) => {
    return action$
        .ofType('SHOOT') // todo rename to SHOT_FIRED
        .delay(250)
        .map(({ data: { playerId } }) => shootRemove({ playerId }))
};

export const rootEpic = combineEpics(
    sendToServer,
    shots,
);
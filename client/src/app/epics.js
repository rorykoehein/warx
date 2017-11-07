import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { sendAction } from './socket';
import * as actions from './actions';

/**
 * search products epic
 * @param action$
 * @param store
 * @returns {any|*|Observable}
 */
const sendToServer = (action$) => {
    return action$
        .filter(action => action.origin === 'client' && action.network === true)
        .forEach(action => {
            sendAction(action);
        });
};

export const rootEpic = combineEpics(
    sendToServer
);
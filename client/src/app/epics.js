import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import type { State, PlayerId } from './types/game.js'
import type { Store } from './types/framework.js'
import { sendAction } from './socket';
import { weaponReload, move, shotCool, shotFire, shotFireToServer, moveToServer } from './actions';

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


const selfMoves = (action$, store: Store) => {
    // todo this time needs to come from the server
    return action$
        .ofType('SELF_MOVED')
        .throttle(() => Observable.interval(store.getState().rules.moveTime))
        // todo: right now we wait for the server to reply to move, because the server tells if we can move
        // todo: client should also have this canMove logic, and server's MOVE_REJECTED should be a failsafe
        // .map(({ data: { direction } }) => {
        //     // convert the action to something the store understands
        //     const state = store.getState();
        //     const currentPlayerId = state.currentPlayerId;
        //     return move({
        //         playerId: currentPlayerId,
        //         direction
        //     })
        // })
        .do(({ data: { direction }}) => {
            // tell the server about this client initiated action
            sendAction(moveToServer({ direction }));
        })
        .ignoreElements();
};

const selfShots = (action$, store: Store) => {
    // todo this time needs to come from the server
    return action$
        .ofType('SELF_SHOT_FIRED')
        .throttle(() => Observable.interval(store.getState().rules.reloadTime))
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


const shots = (action$, store: Store) => {
    return action$
        .ofType('SHOT_FIRED')
        .delayWhen(() => Observable.timer(store.getState().rules.coolTime))
        .map(({ data: { playerId } }) => shotCool({ playerId }));
};

const reloads = (action$, store: Store) => {
    return action$
        .ofType('SHOT_FIRED')
        .delayWhen(() => Observable.timer(store.getState().rules.reloadTime))
        .map(({ data: { playerId } }) => weaponReload({ playerId }));
};

export const rootEpic = combineEpics(
    sendToServer,
    selfShots,
    selfMoves,
    shots,
    reloads,
);
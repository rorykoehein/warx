import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { isScoreboardVisible } from './selectors';
import type { Store } from '../types/framework.js';
import { sendAction } from '../socket';
import sounds from './sounds';
import { weaponReload, shotCool, shotFire, shotFireToServer, addMessage, cleanupMessage,
    removeExplosion, showScores, hideScores } from './actions';
import { selfStartMoves, selfStopMoves, keyDownMoves, keyUpMoves } from './movement';

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

const connected = (action$, store: Store) => {
    // todo this time needs to come from the server
    return action$
        .ofType('CONNECTED')
        .switchMap(() =>
            Observable.timer(0, 30000) // todo add ping time to config/rules
                .takeUntil(action$.ofType('DISCONNECTED'))
                .map(() => ({ type: 'PING', origin: 'client', data: { sendTime: new Date() } }))
                .do(action => sendAction(action))
        )
};

const pings = (action$, store: Store) =>
    Observable
        .combineLatest(
            action$.ofType('PING'),
            action$.ofType('PONG')
                .map(({ data, ...rest }) => ({ ...rest, data: { ...data, receiveTime: new Date() }}))
        )
        .map(([ping, pong]) =>
            ping.type === 'PING' && pong.type === 'PONG' ?
                ({
                    type: 'PING_LATENCY',
                    origin: 'client',
                    data: {
                        latency: pong.data.receiveTime - ping.data.sendTime
                    }
                }) : ({
                    type: 'PING_CORRUPT', // TODO
                    origin: 'client',
                })
        ).do(action => sendAction(action));

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


const actionMessageMap = {
    PLAYER_LEFT: () => 'Player left', // todo: at this moment the player who left is removed from the state
    PLAYER_JOINED: ({ data: { player } }) => `${player.name} joined the game`,
    HIT: ({ data: { shooter, hits } }, store) => {
        const players = store.getState().players;
        const killedPlayers = hits.map(id => players[id].name).join(', ');
        const killer = players[shooter];
        return `${killer.name} killed ${killedPlayers}`;
    }
};

let nextMessageId = 0;

const messages = (action$, store) => {
    return action$
        .filter(({ type }) => actionMessageMap[type])
        .map(action => addMessage({
            message: actionMessageMap[action.type](action, store),
            id: nextMessageId++,
        }));
};

const messagesCleanup = (action$) => {
    return action$
        .ofType('MESSAGE_ADDED')
        .delayWhen(() => Observable.timer(7000))
        .map(({ data: { id }}) => cleanupMessage({ id }));
};

export const explosionsCleanup = (action$, store: Store) => {
    return action$
        .ofType('EXPLOSION_ADDED')
        .delay(32)
        .map(({ data: { id }}) => removeExplosion({ id }));
};

export const toggleScores = (action$, store: Store) =>
    action$
        .ofType('KEY_DOWN')
        .filter(({ data: { key } }) => key === 'h')
        .map(() => isScoreboardVisible(store.getState()) ? hideScores() : showScores());

export const rootEpic = combineEpics(
    connected,
    pings,
    sendToServer,
    selfShots,
    shots,
    reloads,
    sounds,
    messages,
    messagesCleanup,
    explosionsCleanup,
    keyDownMoves,
    keyUpMoves,
    selfStartMoves,
    selfStopMoves,
    toggleScores,
);
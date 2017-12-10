// @flow

import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { sendAction } from "../socket";

import type { Store } from '../types/framework';
import type { State } from '../types/game';

// local types
type GameStateChangedAction = {
    +type: 'GAME_STATE_CHANGED',
    +origin: 'server',
    +data: {
        +state: State, // todo client and server state?
    }
};

type PingLatencyAction = {
    +type: 'PING_LATENCY',
    +origin: 'client',
    +data: {
        +latency: number,
    }
};

type KeyDownAction = {
    +type: 'KEY_DOWN',
    +origin: 'client',
    +data: {
        +key: string,
    }
};

type KeyUpAction = {
    +type: 'KEY_UP',
    +origin: 'client',
    +data: {
        +key: string,
    }
};

type Action = GameStateChangedAction | PingLatencyAction | KeyDownAction | KeyUpAction;

export const initialState = {
    rules: null,
    latency: null,
    isSignedIn: false,
};

// actions
export const keyDown = ({ key }: { key: string }): KeyDownAction => {
    return {
        type: 'KEY_DOWN',
        origin: 'client',
        data: {
            key
        }
    };
};

export const keyUp = ({ key }: { key: string }): KeyUpAction => {
    return {
        type: 'KEY_UP',
        origin: 'client',
        data: {
            key
        }
    };
};

// reducer
export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'GAME_STATE_CHANGED': {
            const { data: { state: newState } } = action;
            return {
                ...state,
                ...newState,
            };
        }

        case 'PING_LATENCY': {
            const { data: { latency } } = action;
            return {
                ...state,
                latency: latency
            };
        }

        default:
            return state;
    }
};

// selectors
// ping latency
export const getLatency = (state: State) => state.latency;

// sign in
export const isSignedIn = (state: State) => state.isSignedIn;

// rules
export const getRules = (state: State) => state.rules || {};


// epics

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

const connected = (action$) => {
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

export const epic = combineEpics(
    sendToServer,
    connected,
    pings,
);

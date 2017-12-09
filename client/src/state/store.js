// @flow

import 'rxjs';
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { combineEpics, createEpicMiddleware } from 'redux-observable';

// import modules
import { epic as soundsEpic } from './sounds';
import { epic as movementEpic, reducer as movementReducer } from './movement';
import { epic as scoresEpic, reducer as scoresReducer } from './scores';
import { epic as shotsEpic, reducer as shotsReducer } from './shots';
import { epic as explosionsEpic, reducer as explosionsReducer } from './explosions';
import { epic as messagesEpic, reducer as messagesReducer } from './messages';
import { epic as gameEpic, reducer as gameReducer } from './game';
import { reducer as playersReducer } from "./players";
import { dispatchActions as dispatchNetworkActions } from "./network";

import type { Store } from '../types/framework';
import type { State } from '../types/game';
import type { ActionInterface } from '../types/actions';

// initial state todo: figure out how to modularize properly with State types
const initialState: State = {
    rules: null,
    latency: null,
    currentPlayerId: null,
    players: {},
    shots: {},
    explosions: {},
    messages: {},
    isSignedIn: false,
    isScoreboardVisible: false,
};

// setup observable/epics
const epic = combineEpics(
    gameEpic,
    messagesEpic,
    explosionsEpic,
    soundsEpic,
    movementEpic,
    shotsEpic,
    scoresEpic,
);

const reduceReducers = (...reducers) => (previous, current) => reducers.reduce((p, r) => r(p, current), previous);
const coreReducer = (state: State = initialState, action: ActionInterface): State => state;

const reducer = reduceReducers(
    coreReducer,
    gameReducer,
    scoresReducer,
    messagesReducer,
    movementReducer,
    playersReducer,
    shotsReducer,
    explosionsReducer,
);

// setup store
const store: Store = createStore(
    reducer,
    applyMiddleware(createLogger({}), createEpicMiddleware(epic)),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// setup outside dispatchers
dispatchNetworkActions(store);

export default store;

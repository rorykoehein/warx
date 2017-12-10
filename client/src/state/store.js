// @flow

import 'rxjs';
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { reduceReducers } from './helpers';
import modules from './modules';

import type { Store } from '../types/framework';
import type { State } from '../types/game';
import type { ActionInterface } from '../types/actions';

export const reducer = reduceReducers(
    ...modules
        .filter(module => module.reducer)
        .map(module => module.reducer)
);

export const epic = combineEpics(
    ...modules
        .filter(module => module.epic)
        .map(module => module.epic)
);

export const initialState = {
    ...modules
        .filter(module => module.initialState)
        .map(module => module.initialState)
};

const coreReducer = (state: State = initialState, action: ActionInterface): State => state;

// setup store
const store: Store = createStore(
    reduceReducers(coreReducer, reducer),
    applyMiddleware(createLogger({}), createEpicMiddleware(epic)),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// setup outside dispatchers: for outside stuff that needs to call store.dispatch, i.e. network actions
modules
    .filter(module => module.dispatchActions)
    .forEach(module => module.dispatchActions(store));

export default store;

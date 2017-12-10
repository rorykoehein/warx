// @flow

import 'rxjs';
import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { reduceReducers, toList } from './helpers';
import * as moduleMap from './modules';

import type { Store } from '../types/framework';
import type { ActionInterface } from '../types/actions';

const modules = toList(moduleMap);

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
        .reduce((acc, next) => ({ ...acc, ...next}), {})
};

const coreReducer = (state = initialState, action: ActionInterface) => state;

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

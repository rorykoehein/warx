// @flow

import { applyMiddleware, createStore } from 'redux';
import createNodeLogger from 'redux-node-logger'
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { reduceReducers, toList } from '../shared/helpers';
import * as moduleMap from './modules';
import { ActionInterface } from './types';

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

// setup outside dispatchers: for outside stuff that needs to call store.dispatch, i.e. network actions
modules
    .filter(module => module.dispatchActions)
    .forEach(module => module.dispatchActions(store));

// setup store
const store = createStore(
    reduceReducers(coreReducer, reducer),
    applyMiddleware(createNodeLogger({ }), createEpicMiddleware(epic))
);

export default store;

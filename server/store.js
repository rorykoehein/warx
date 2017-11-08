import { applyMiddleware, createStore } from 'redux';
import createNodeLogger from 'redux-node-logger'
import { createEpicMiddleware } from 'redux-observable';
import epic from './epics/index';
import type { Store } from '../client/src/app/types/framework';
import reducers from './reducers';

console.log('epic', epic);

const store: Store = createStore(
    reducers,
    applyMiddleware(createNodeLogger({ }), createEpicMiddleware(epic))
);

export default store;

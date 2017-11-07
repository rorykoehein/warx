import { applyMiddleware, createStore } from 'redux';
import createNodeLogger from 'redux-node-logger'
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic } from './epics';
import type { Store } from '../client/src/app/types/framework';
import reducers from './reducers';

const store: Store = createStore(
    reducers,
    applyMiddleware(createNodeLogger({ }), createEpicMiddleware(rootEpic))
);

export default store;

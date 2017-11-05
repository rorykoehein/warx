import { applyMiddleware, createStore } from 'redux';
import createNodeLogger from 'redux-node-logger'
import type { Store } from './client/src/app/types/framework';
import reducers from './reducers';

const store: Store = createStore(
    reducers,
    applyMiddleware(createNodeLogger({ }))
);

export default store;

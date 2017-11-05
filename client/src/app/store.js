import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger'
import type { Store } from './types';
import reducers from './reducers';

const store: Store = createStore(
    reducers,
    applyMiddleware(createLogger({ })),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

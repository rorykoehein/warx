import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger'
import { createEpicMiddleware } from 'redux-observable';
import type { Store } from '../types/framework';
import reducers from './reducers';
import { rootEpic } from './epics';

const store: Store = createStore(
    reducers,
    applyMiddleware(createLogger({}), createEpicMiddleware(rootEpic)),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger'
import { createEpicMiddleware } from 'redux-observable';
import type { Store } from '../types/framework';
import reducer from './reducer'
import epics from './epics';

const store: Store = createStore(
    reducer,
    applyMiddleware(createLogger({}), createEpicMiddleware(epics)),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;

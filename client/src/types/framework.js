// @flow
import type { State } from './game';
import type { ActionInterface } from './actions';

import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';

export type Store = ReduxStore<State, ActionInterface>;

export type Dispatch = ReduxDispatch<ActionInterface>;

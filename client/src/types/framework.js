// @flow
import type { State } from './game';
import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';

export type ActionInterface = {
    +type: string,
    +origin?: ActionOrigin,
    +sendToServer?: boolean,
    +data?: any,
}

export type Store = ReduxStore<State, ActionInterface>;

export type Dispatch = ReduxDispatch<ActionInterface>;

export type ActionOrigin = 'server' | 'client' | 'all';

export type ReduxInitAction = {
    +type: '@@INIT',
    +origin: 'client',
};

export type Action = ReduxInitAction;

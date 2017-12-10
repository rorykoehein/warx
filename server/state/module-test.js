// @flow

import { combineEpics } from 'redux-observable';
import type { State as FullState, ActionInterface } from './types';

// local types
export type ModuleState = {

};

// initial state
export const initialState: ModuleState = {

};

// actions
// export const doThing = (): ActionType => ({
//      type: 'THING_DONE',
//      origin: 'client',
//      data: {}
// });

// reducer
export const reducer = (state: FullState, action: ActionInterface): FullState => {
    switch (action.type) {
        // case 'THING_DONE': {
        //     return state;
        // }

        default:
            return state;
    }
};

// selectors
// const getMap = (state: ModuleState) => state.thing;

// epics
export const epic = combineEpics(

);

// dispatch outside actions
// export const dispatchActions = (store: Store) => ());

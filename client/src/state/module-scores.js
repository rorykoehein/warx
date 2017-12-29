// @flow

import { Observable } from 'rxjs/Observable';
import { createSelector } from 'reselect';
import { getPlayers } from './module-players';
import { toList } from '../shared/helpers';

import type { Store } from '../types/framework';
import type { ActionInterface } from '../types/framework';
import type { State, PlayerList, Players } from '../types/game';

// types
export type ShowScoresAction = {
    +type: 'SCORES_SHOWN',
    +origin: 'client',
    +data: {}
};

export type HideScoresAction = {
    +type: 'SCORES_HIDDEN',
    +origin: 'client',
    +data: {}
};

export type ScoresActions = ShowScoresAction | HideScoresAction;

// initial state
export const initialState = {
    isScoreboardVisible: false
};

// actions
export const showScores = (): ShowScoresAction => {
    return {
        type: 'SCORES_SHOWN',
        origin: 'client',
        data: {}
    };
};

export const hideScores = (): HideScoresAction => {
    return {
        type: 'SCORES_HIDDEN',
        origin: 'client',
        data: {}
    };
};

// reducer
export const reducer = (state: State, action: ScoresActions): State => {
    switch (action.type) {
        case 'SCORES_SHOWN': {
            return {
                ...state,
                isScoreboardVisible: true,
            };
        }

        case 'SCORES_HIDDEN': {
            return {
                ...state,
                isScoreboardVisible: false,
            };
        }

        default: return state;
    }
};

// selectors
export const selectIsScoreboardVisible = (state: State) => state.isScoreboardVisible;
export const selectPlayerScores = createSelector(
    getPlayers,
    (players: Players): PlayerList => toList(players).sort((a, b) => b.frags - a.frags ||  a.deaths - b.deaths)
);

// epics
export const epic = (action$: Observable<ActionInterface>, store: Store) =>
    action$
        .ofType('KEY_DOWN')
        .filter(({ data: { key } }) => key === 'h')
        .map(() => selectIsScoreboardVisible(store.getState()) ? hideScores() : showScores());

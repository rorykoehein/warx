// @flow

import { combineEpics } from 'redux-observable';
import { createSelector } from 'reselect';
import { toList } from '../shared/helpers';

import type { State as FullState, ExplosionsType, Explosion, PlayerId } from '../types/game';

// local types
export type AddExplosionAction = {
    +type: 'EXPLOSION_ADDED',
    +origin: 'server',
    +data: {
        +id: number,
        +x: number,
        +y: number,
        +size: number,
        +causedBy: PlayerId,
    }
};

export type RemoveExplosionAction = {
    +type: 'EXPLOSION_REMOVED',
    +origin: 'client',
    +data: {
        +id: number,
    }
};

type Action = AddExplosionAction | RemoveExplosionAction;

export type ModuleState = {
    +explosions: ExplosionsType,
};

export const initialState: ModuleState = {
    explosions: {}
};

// actions
export const removeExplosion = ({ id }: { id: number }): RemoveExplosionAction => {
    return {
        type: 'EXPLOSION_REMOVED',
        origin: 'client',
        data: {
            id
        }
    };
};

// reducer
export const reducer = (state: FullState, action: Action): FullState => {
    switch (action.type) {
        case 'EXPLOSION_ADDED': {
            const { data: { id, x, y, size } } = action;
            const { explosions } = state;
            return {
                ...state,
                explosions: {
                    ...explosions,
                    [id] : { id, x, y, size }
                },
            };
        }

        case 'EXPLOSION_REMOVED': {
            const { data: { id } } = action;
            const { explosions } = state;
            const { [`${id}`]: removeExplosion, ...restExplosions } = explosions;
            return {
                ...state,
                explosions: restExplosions,
            };
        }

        default:
            return state;
    }
};

// selectors
export const getExplosions = (state: FullState) => state.explosions;

export const getExplosionsList = createSelector(
    getExplosions,
    (explosions: ExplosionsType): Array<Explosion> => toList(explosions)
);


// epics
const explosionsCleanup = (action$) => {
    return action$
        .ofType('EXPLOSION_ADDED')
        .delay(32)
        .map(({ data: { id }}) => removeExplosion({ id }));
};

export const epic = combineEpics(
    explosionsCleanup
);

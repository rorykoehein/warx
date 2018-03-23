import { combineEpics } from 'redux-observable';
import type { Store } from "../../client/src/types/framework";
import {getPlayerById, getRules} from "./module-game";
import {addExplosion} from "./module-explosions";

export const bombSet = (bomb) => ({
    type: 'BOMB_SET',
    data: bomb,
    origin: 'server',
});

export const bombDetonate = (bomb) => ({
    type: 'BOMB_DETONATED',
    data: bomb,
    origin: 'server',
});

export const reducer = (state, action) => {
    const { bombs } = state;
    switch (action.type) {
        case 'BOMB_SET': {
            const { data: bomb } = action;
            console.log('BOMB_SET', action);
            return {
                ...state,
                bombs: {
                    ...bombs,
                    [bomb.id]: bomb,
                }
            }
        }

        case 'BOMB_DETONATED': {
            const { data: { id } } = action;
            const { bombs: { [id]: bombToRemove, ...restBombs } } = state;
            console.log('BOMB_DETONATED', action, state, restBombs);
            return {
                ...state,
                bombs: restBombs
            }
        }
    }

    return state;
};

const bombSetResponses = (action$, store) =>
    action$
        .ofType('BOMB_SET_REQUESTED')
        // .throttle(() => Observable.interval(store.getState().rules.reloadTime))
        .map((action) => {
            // convert the action to something the store understands
            const state = store.getState();
            const playerId = action.data.playerId;
            // todo: player might be null
            const player = getPlayerById(state, playerId);
            return bombSet({
                id: playerId, // todo for now: 1 player 1 bomb
                playerId,
                x: player.x,
                y: player.y,
            })
        });

const bombDetonateResponses = (action$, store: Store) =>
    action$
        .ofType('BOMB_DETONATE_REQUESTED')
        // todo: check if bomb detonating is allowed
        .map(({ data: { id } }) => {
            const bomb = store.getState().bombs[id]; // todo selector
            console.log('BOMB_DETONATE_REQUESTED for id', id, bomb)
            return bombDetonate(bomb);
        });

export const bombsExplosions = (action$, store: Store) => {
    return action$
        .ofType('BOMB_DETONATED')
        .map(({ data: { id, x, y, } }) => {
            // todo: ignore if bomb doesn't exist
            const size = getRules(store.getState()).explosionSize;
            console.log('BOMB_DETONATED to explosion', id, x, y);
            return addExplosion({
                id: `${id}bomb`, // todo: explosion id can be same as player id?
                x,
                y,
                size,
                causedBy: id
            });
        });
};

export const epic = combineEpics(
    bombSetResponses,
    bombDetonateResponses,
    bombsExplosions
);

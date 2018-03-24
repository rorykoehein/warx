import { combineEpics } from 'redux-observable';
import type { Store } from "../../client/src/types/framework";
import { getPlayerById, getRules } from "./module-game";
import { addExplosion } from "./module-explosions";
import { isHit } from "./module-shots";
import { pointCircleCollision } from './module-explosions';

export const bombSetRequest = ({ playerId }) => ({
    type: 'BOMB_SET_REQUESTED',
    data: {
        playerId,
    },
    origin: 'server',
});

export const bombSet = (bomb) => ({
    type: 'BOMB_SET',
    data: bomb,
    origin: 'server',
    sendToClient: true,
    toAll: true,
});

export const bombDetonate = (bomb) => ({
    type: 'BOMB_DETONATED',
    data: bomb,
    origin: 'server',
    sendToClient: true,
    toAll: true,
});

export const initialState = {
    bombs: {},
};

export const reducer = (state, action) => {
    const { bombs } = state;
    switch (action.type) {
        case 'BOMB_SET': {
            const { data: bomb } = action;
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
            return {
                ...state,
                bombs: restBombs
            }
        }
    }

    return state;
};

const getBombCoords = ({ x, y, direction: dir }, step) => ({
    x: dir === 'left' ? x + step : dir === 'right' ? x - step : x,
    y: dir === 'up' ? y + step : dir === 'down' ? y - step : y,
});

// reply to a bomb set (drop) request, only allow if there is no previous bomb
// dropped by this player
const bombSetResponses = (action$, store) =>
    action$
        .ofType('BOMB_SET_REQUESTED')
        .map(action => {
            const state = store.getState();
            const playerId = action.data.playerId;
            const player = getPlayerById(state, playerId);
            const existingBomb = store.getState().bombs[playerId];
            return { player, existingBomb };
        })
        .filter(({ player, existingBomb }) => player && !existingBomb)
        .map(({ player }) => {
            const { rules: { moveDistance }} = store.getState();
            const { x, y } = getBombCoords(player, moveDistance);
            return bombSet({ id: player.id, x, y });
        });

// reply to a detonation request, with a detonation (response), but don't allow
// detonating, when we don't have bomb for this player
const bombDetonateResponses = (action$, store: Store) =>
    action$
        .ofType('BOMB_DETONATE_REQUESTED')
        .map(({ data: { id } }) => store.getState().bombs[id])
        .filter(bomb => bomb)
        .map(bombDetonate);

export const bombsExplosions = (action$, store: Store) =>
    action$
        .ofType('BOMB_DETONATED')
        .map(({ data: { id, x, y, } }) => {
            const size = getRules(store.getState()).explosionSize;
            return addExplosion({
                id: `${id}bomb`, // todo: explosion id can be same as player id?
                x,
                y,
                size,
                causedBy: id
            });
        });

const bombShots = (action$, store) =>
    action$
        .ofType('SHOT_FIRED')
        .map(({ data: { playerId } }) => {
            const { players } = store.getState();
            const { bombs } = store.getState();
            const shooter = players[playerId];
            return Object.values(bombs).filter(bomb => isHit(shooter, bomb));
        })
        .flatMap((bombs) => bombs.map(bombDetonate));

const bombPlayerLeaves = (action$, store) =>
    action$
        .filter(({ type }) =>
            type === 'PLAYER_SIGN_OUT_REQUEST' ||
            type === 'DISCONNECTION_REQUESTED'
        )
        .map(({ data: { playerId } }) => store.getState().bombs[playerId])
        .filter(bomb => bomb)
        .map(bombDetonate);

// explode when other explosions hit this bomb
export const explosionsBombsExplosions = (action$, store: Store) =>
    action$
        .ofType('EXPLOSION_ADDED')
        .delay(250)
        .flatMap(({ data: { x, y, size } }) =>
            Object
                .values(store.getState().bombs)
                .filter(({ x: bombX, y: bombY }) =>
                    pointCircleCollision([bombX, bombY], [x, y], size/2)
                )
                .map(bombDetonate)
        );

export const epic = combineEpics(
    bombSetResponses,
    bombDetonateResponses,
    bombsExplosions,
    bombShots,
    bombPlayerLeaves,
    explosionsBombsExplosions,
);

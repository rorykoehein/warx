// @flow

import { createSelector } from 'reselect';
import { combineEpics } from 'redux-observable';
import { getPlayerById, getRules } from "./module-game";
import { addExplosion } from "./module-explosions";
import { isHit } from "./module-shots";
import { pointCircleCollision } from './module-explosions';
import type { PlayerId, Player } from '../../client/src/types/game';
import type { Store } from "../../client/src/types/framework";
import { toList } from '../shared/helpers';

// this module handles bombs in the game world. the client sends a request
// action to the server, the server then determines if a bomb can be set or
// detonated by this user, and updates all the users with a 'set' or 'detonate'
// action. an explosions from module-explosions occurs after detonating or
// shooting a bomb.

type Bomb = {
    +id: string,
    +x: number,
    +y: number,
}

type Bombs = {
    [bombId: string]: Bomb,
}

type BombList = Array<Bomb>;

type BombSetRequestAction = {
    +type: 'BOMB_SET_REQUESTED',
    +origin: 'server',
    +data: {
        +playerId: PlayerId,
    }
};

type BombSetAction = {
    +type: 'BOMB_SET',
    +origin: 'server',
    +sendToClient: true,
    +toAll: true,
    +data: Bomb
};

type BombDetonateAction = {
    +type: 'BOMB_DETONATED',
    +origin: 'server',
    +sendToClient: true,
    +toAll: true,
    +data: Bomb
};

type BombState = {
    bombs: Bombs,
};

type Coords = {
    x: number,
    y: number,
}

type Action = BombSetRequestAction | BombSetAction | BombDetonateAction;

export const bombSetRequest = ({ playerId }: { playerId: PlayerId }): BombSetRequestAction => ({
    type: 'BOMB_SET_REQUESTED',
    data: {
        playerId,
    },
    origin: 'server',
});

export const bombSet = (bomb: Bomb): BombSetAction => ({
    type: 'BOMB_SET',
    data: bomb,
    origin: 'server',
    sendToClient: true,
    toAll: true,
});

export const bombDetonate = (bomb: Bomb): BombDetonateAction => ({
    type: 'BOMB_DETONATED',
    data: bomb,
    origin: 'server',
    sendToClient: true,
    toAll: true,
});

export const initialState: BombState = {
    bombs: {},
};

export const reducer = (state: BombState, action: Action): BombState => {
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

const getBombCoords = ({ direction: dir, x, y }: Player, step: number) : Coords => ({
    x: dir === 'left' ? x + step : dir === 'right' ? x - step : x,
    y: dir === 'up' ? y + step : dir === 'down' ? y - step : y,
});

// selectors
export const getBombs = (state: BombState): Bombs => state.bombs;
export const getBombList = createSelector(
    getBombs,
    (bombs: Bombs): BombList => toList(bombs)
);

// epics

// reply to a bomb set (drop) request, only allow if there is no previous bomb
// dropped by this player
const bombSetResponses = (action$, store) =>
    action$
        .ofType('BOMB_SET_REQUESTED')
        .map(action => {
            const state = store.getState();
            const playerId = action.data.playerId;
            const player = getPlayerById(state, playerId);
            const existingBomb = getBombs(state)[playerId];
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
        .map(({ data: { id } }) => getBombs(store.getState())[id])
        .filter(bomb => bomb)
        .map(bombDetonate);

export const bombsExplosions = (
    // $FlowFixMe
    action$,
    store: Store
) =>
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

const bombShots = (
    // $FlowFixMe
    action$,
    store: Store
) =>
    action$
        .ofType('SHOT_FIRED')
        .map(({ data: { playerId } }) => {
            const state = store.getState();
            const { players } = state;
            const shooter = players[playerId];
            return getBombList(state).filter(bomb => isHit(shooter, bomb));
        })
        .flatMap((bombs) => bombs.map(bombDetonate));

const bombPlayerLeaves = (
    // $FlowFixMe
    action$,
    store: Store
) =>
    action$
        .filter(({ type }) =>
            type === 'PLAYER_SIGN_OUT_REQUEST' ||
            type === 'DISCONNECTION_REQUESTED'
        )
        .map(({ data: { playerId } }) => getBombs(store.getState())[playerId])
        .filter(bomb => bomb)
        .map(bombDetonate);

// explode when other explosions hit this bomb
export const explosionsBombsExplosions = (
    // $FlowFixMe
    action$,
    store: Store
) =>
    action$
        .ofType('EXPLOSION_ADDED')
        .delay(250)
        .flatMap(({ data: { x, y, size } }) =>
            getBombList(store.getState())
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

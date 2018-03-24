// @flow

// rename to lasers
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { sendAction } from '../socket';
import { toList } from '../shared/helpers';

import type { Store } from '../types/framework';
import type { State, PlayerId } from '../types/game';
import type { ActionOrigin } from '../types/framework';
import { createKeyHandlerEpic } from "./module-game";

// local types
// when the current client fires a shot
type SelfShotFireAction = {
    +type: 'SELF_SHOT_FIRED',
    +origin: 'client',
};

// when the server
type ShotFireAction = {
    +type: 'SHOT_FIRED',
    +origin: ActionOrigin,
    +data: {
        +playerId: PlayerId,
    }
};

type ShotCoolAction = {
    +type: 'SHOT_COOLED',
    +origin: ActionOrigin,
    +data: {
        +playerId: PlayerId,
    }
};

type WeaponReloadAction = {
    +type: 'WEAPON_RELOADED',
    +origin: ActionOrigin,
    +data: {
        +playerId: PlayerId,
    }
};

type ShotRequestAction = {
    +type: 'SHOT_REQUESTED',
};

type Action = SelfShotFireAction | ShotFireAction | ShotCoolAction | WeaponReloadAction | ShotRequestAction;

// initial state
export const initialState = {
    shots: {},
};

// actions

// to be used from the UI
export const selfShotFire = (): SelfShotFireAction => ({
    type: 'SELF_SHOT_FIRED',
    origin: 'client',
    data: {},
    sendToServer: false,
});

// to receive from server
export const shotFire = (payload : { playerId: PlayerId, origin: ActionOrigin }): ShotFireAction => ({
    type: 'SHOT_FIRED',
    origin: payload.origin,
    data: {
        playerId: payload.playerId,
    }
});

export const weaponReload = ({ playerId } : { playerId: PlayerId }): WeaponReloadAction => ({
    type: 'WEAPON_RELOADED',
    origin: 'client',
    data: {
        playerId,
    }
});

// to send to server
export const shotFireToServer = (): ShotRequestAction => ({
    type: 'SHOT_REQUESTED',
    origin: 'client',
    data: {}
});

export const shotCool = ({ playerId } : { playerId: PlayerId }): ShotCoolAction => ({
    type: 'SHOT_COOLED',
    origin: 'client',
    data: {
        playerId,
    }
});

// reducer
export const reducer = (state: State, action: Action): State => {
    const { players } = state;
    switch (action.type) {
        case 'SHOT_FIRED': {
            const { data: { playerId } } = action;
            const { shots } = state;
            const { direction, x, y } = players[playerId];
            return {
                ...state,
                shots: {
                    ...shots,
                    [playerId] : { direction, x, y, playerId }
                },
                players: {
                    ...players,
                    [playerId]: {
                        ...players[playerId],
                        weaponLoaded: false,
                    }
                },
            };
        }

        case 'SHOT_COOLED': {
            const { data: { playerId } } = action;
            const { shots } = state;
            const { [playerId]: removeShot, ...restShots } = shots;
            return {
                ...state,
                shots: restShots,
            };
        }

        case 'WEAPON_RELOADED': {
            const { data: { playerId } } = action;
            const player = players[playerId];
            if(!player) return state;
            return {
                ...state,
                players: {
                    ...players,
                    [playerId]: {
                        ...player,
                        weaponLoaded: true,
                    }
                },
            };
        }

        default:
            return state;
    }
};

// selectors
export const getShots = (state: State) => state.shots;
export const getShotsList = (state: State) => toList(getShots(state));

// epics
const selfShots = (action$, store: Store) =>
    action$
        .ofType('SELF_SHOT_FIRED')
        .throttle(() => Observable.interval(store.getState().rules.reloadTime))
        .map(() => {
            // convert the action to something the store understands
            const state = store.getState();
            const currentPlayerId = state.currentPlayerId;
            return shotFire({
                playerId: currentPlayerId,
                origin: 'client'
            })
        })
        .do(() => sendAction(shotFireToServer()));

const shots = (action$, store: Store) =>
    action$
        .ofType('SHOT_FIRED')
        .delayWhen(() => Observable.timer(store.getState().rules.coolTime))
        .map(({ data: { playerId } }) => shotCool({ playerId }));

const reloads = (action$, store: Store) =>
    action$
        .ofType('SHOT_FIRED')
        .delayWhen(() => Observable.timer(store.getState().rules.reloadTime))
        .map(({ data: { playerId } }) => weaponReload({ playerId }));

const keyDownShots = createKeyHandlerEpic({ ' ': selfShotFire }, true);

export const epic = combineEpics(
    keyDownShots,
    selfShots,
    shots,
    reloads,
);

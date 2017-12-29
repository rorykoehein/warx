// @flow

import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { spawn } from './module-game';
import type { State as FullState, ActionInterface } from './types';

// the hits module is covers players hitting/fragging/killing each other,
// without touching on the methods/weapons to do this. other modules may rely
// on this module, like: laser and explosions

// local types
export type ModuleState = {

};

// initial state
export const initialState: ModuleState = {

};

// actions
export const hit = ({ shooter, hits }) => ({
    type: 'HIT',
    origin: 'server',
    sendToClient: true,
    toAll: true,
    data: {
        shooter,
        hits
    },
});

// reducer
export const reducer = (state: FullState, action: ActionInterface): FullState => {
    switch (action.type) {

        case 'HIT': {
            const { players, ...rest } = state;
            const { data: { shooter, hits } } = action;

            const deadPlayers = hits.reduce((acc, playerId) => ({
                ...acc,
                [playerId]: {
                    ...players[playerId],
                    alive: false,
                    deaths: players[playerId].deaths + 1,
                }
            }), {});

            const selfKill = hits.includes(shooter);

            const shooterPlayer = selfKill ? {
                ...players[shooter],
                alive: false,
                deaths: players[shooter].deaths + 1,
                frags: players[shooter].frags + hits.length - 1,
            } : {
                ...players[shooter],
                frags: players[shooter].frags + hits.length,
            };

            return {
                players: {
                    ...players,
                    ...deadPlayers,
                    [shooter]: shooterPlayer,
                },
                ...rest,
            };
        }

        default:
            return state;
    }
};

// selectors
// const getMap = (state: ModuleState) => state.thing;

// epics

export const hits = (action$, store: Store) =>
    action$
        .ofType('HIT')
        .delayWhen(() => Observable.timer(store.getState().rules.respawnTime))
        .flatMap(({ data: { hits }}) =>
            hits.map(playerId => {
                const { rules: { worldWidth, worldHeight, moveDistance }} = store.getState();
                return spawn({ playerId, worldWidth, worldHeight, moveDistance });
            })
        );


export const hitsNewPlayerState = (action$, store: Store) =>
    action$
        .ofType('HIT')
        .map(({ data: { shooter, hits } }) => {
            const players = store.getState().players;
            const newPlayers = Object.keys(players)
                .filter(id => id === shooter || hits.includes(id))
                .map(id => players[id])
                .reduce((players, player) => ({
                    ...players,
                    [player.id]: player
                }), {});

            return {
                type: 'PLAYERS_UPDATED',
                origin: 'server',
                sendToClient: true,
                toAll: true,
                data: {
                    players: newPlayers
                }
            }
        });

export const epic = combineEpics(
    hits,
    hitsNewPlayerState,
);

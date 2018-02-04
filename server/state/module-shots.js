// @flow

import { combineEpics } from 'redux-observable';
import { hit } from './module-hits';

// todo rename to laser in server and client

const isHit = (shooter, opponent) => {
    const { direction, x, y } = shooter;
    const { x: opponentX, y: opponentY, alive } = opponent ;
    return alive && ((direction === 'left' && opponentY === y && opponentX < x)
        || (direction === 'right' && opponentY === y && opponentX > x)
        || (direction === "down" && opponentX === x && opponentY > y)
        || (direction === "up" && opponentX === x && opponentY < y));
};

// epics
const shots = (action$, store) =>
    action$
        .ofType('SHOT_FIRED')
        .map(({ data: { playerId } }) => {
            const { players } = store.getState();
            const shooter = players[playerId];
            const hits = Object.keys(players).filter(key => isHit(shooter, players[key]));
            return { hits, playerId };
        })
        .filter(({ hits, playerId }) => hits.length > 0)
        .map(({ hits, playerId }) => hit({ hits, shooter: playerId }));

const requestedShots = (action$, store: Store) =>
    action$
        .ofType('SHOT_REQUESTED')
        .groupBy(payload => payload.data.playerId)
        .flatMap(group => group
            .throttleTime(store.getState().rules.reloadTime)
            .filter(payload => {
                const { data: { playerId } } = payload;
                const { players } = store.getState();
                const player = players[playerId];
                return player && player.alive;
            })
            .map(payload => {
                const { data: { playerId } } = payload;
                const { players } = store.getState();
                const isBot = players[playerId].isBot;
                return {
                    ...payload,
                    type: 'SHOT_FIRED',
                    origin: 'server',
                    sendToClient: true,
                    toAll: isBot, // todo, maybe send shot_fired to all players always, needs change on client
                }
            })
        );

export const epic = combineEpics(
    shots,
    requestedShots,
);

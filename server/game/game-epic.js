import 'rxjs';
import { Observable } from 'rxjs/Observable';
import rules from './rules';
import { spawn } from './actions';
import type { Store } from '../../client/src/app/types/framework';


const isHit = (shooter, opponent) => {
    const { direction, x, y } = shooter;
    const { x: opponentX, y: opponentY, alive } = opponent ;
    return alive && ((direction === 'left' && opponentY === y && opponentX < x)
        || (direction === 'right' && opponentY === y && opponentX > x)
        || (direction === "down" && opponentX === x && opponentY > y)
        || (direction === "up" && opponentX === x && opponentY < y));
};

export const spawnConnects = (action$, store: Store) =>
    action$
        .ofType('CONNECT')
        .map(({ data: { playerId } }) =>
            spawn({ playerId })
        );

export const hits = (action$, store: Store) =>
    action$
        .ofType('HIT')
        .delay(rules.respawnTime)
        .flatMap(({ data: { hits }}) =>
            hits.map(playerId =>
                spawn({ playerId })
            )
        );

export const shots = (action$, store: Store) =>
    action$
        .ofType('SHOT_FIRED')
        .map(({ data: { playerId } }) => {
            const { players } = store.getState();
            const shooter = players[playerId];
            const hits = Object.keys(players).filter(key => isHit(shooter, players[key]));
            return { hits, playerId };
        })
        .filter(({ hits, playerId }) => hits.length > 0)
        .map(({ hits, playerId }) => {
            // todo: HIT is not helpful for clients? maybe send the complete new state of the client?
            return {
                type: 'HIT',
                origin: 'server', // todo fugly
                sendToClient: true, // todo fugly
                toAll: true, // todo fugly
                data: {
                    shooter: playerId,
                    hits
                },
            };
        });

export const requestedShots = (action$, store: Store) =>
    action$
        .ofType('SHOT_REQUESTED')
        .groupBy(payload => payload.data.playerId)
        .flatMap(group => group
            .throttleTime(rules.reloadTime)
            .map(payload => ({
                ...payload,
                type: 'SHOT_FIRED',
                origin: 'server',
                sendToClient: true,
            }))
        );

export const moves = (action$, store: Store) =>
    action$
        .ofType('MOVE_REQUESTED')
        .groupBy(payload => payload.data.playerId)
        .flatMap(group => group
            .throttleTime(rules.moveTime)
            .map(({ data: { playerId, direction } }) => {
                return {
                    type: 'MOVE',
                    origin: 'server', // todo fugly
                    sendToClient: true, // todo fugly
                    toAll: false, // todo fugly
                    data: {
                        playerId,
                        direction
                    },
                };
            })
        );

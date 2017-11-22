import 'rxjs';
import { Observable } from 'rxjs/Observable';
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

export const spawnJoins = (action$, store: Store) =>
    action$
        .ofType('SELF_JOINED')
        .map(({ data: { playerId, playerName } }) => {
            const { rules: { worldWidth, worldHeight, moveDistance }} = store.getState();
            return spawn({ playerId, worldWidth, worldHeight, moveDistance, playerName });
        });

export const broadcastJoins = (action$, store: Store) =>
    action$
        .ofType('SELF_JOINED')
        .map(({ data: { playerId, playerName } }) => {
            const player = store.getState().players[playerId];

            return {
                type: 'PLAYER_JOINED',
                origin: 'server', // todo fugly
                sendToClient: true, // todo fugly
                toAll: true, // todo fugly
                data: {
                    player: { ...player, name: playerName, } // todo: this is ugly, dp SELF_JOINED -> state update -> broadcast
                },
            };
        });

export const hits = (action$, store: Store) =>
    action$
        .ofType('HIT')
        .do(action => console.log('spawn respawnTime', store.getState().rules.respawnTime))
        .delayWhen(() => Observable.timer(store.getState().rules.respawnTime))
        .flatMap(({ data: { hits }}) => console.log('spawn hits', hits) ||
            hits.map(playerId => {
                const { rules: { worldWidth, worldHeight, moveDistance }} = store.getState();
                console.log('spawn ', { playerId, worldWidth, worldHeight, moveDistance });
                return spawn({ playerId, worldWidth, worldHeight, moveDistance });
            })
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
            .throttleTime(store.getState().rules.reloadTime)
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
            .throttleTime(store.getState().rules.moveTime)
            .map(({ data: { playerId, direction } }) => {
                console.log('move req');
                const { rules, players } = store.getState();
                const { moveDistance, worldWidth, worldHeight } = rules;
                const player = players[playerId]; // todo use selector function for getting players?
                const { x, y } = player;
                const canMove =
                    (direction === 'left' && x - moveDistance >= 0) ||
                    (direction === 'right' && x + moveDistance < worldWidth) ||
                    (direction === 'up' && y - moveDistance >= 0) ||
                    (direction === 'down' && y + moveDistance < worldHeight);

                if(!canMove) {
                    // todo only send move to the spefic client
                    return {
                        type: 'MOVE_REJECTED',
                        origin: 'server', // todo fugly
                        // sendToClient: true, // todo fugly
                        // toAll: false, // todo fugly
                        data: {
                            playerId,
                            direction
                        },
                    };
                }

                return {
                    type: 'MOVE',
                    origin: 'server', // todo fugly
                    sendToClient: true, // todo fugly
                    toAll: true, // todo fugly
                    data: {
                        playerId,
                        direction
                    },
                };
            })
        );

import 'rxjs';
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
        .map(({ data: { playerId } }) => {
            const { rules: { worldWidth, worldHeight, moveDistance }} = store.getState();
            return spawn({ playerId, worldWidth, worldHeight, moveDistance });
        });

export const hits = (action$, store: Store) =>
    action$
        .ofType('HIT')
        .delay(() => store.getState().rules.respawnTime)
        .flatMap(({ data: { hits }}) =>
            hits.map(playerId => {
                const { rules: { worldWidth, worldHeight, moveDistance }} = store.getState();
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

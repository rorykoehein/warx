// @flow

import 'rxjs';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { spawn, addExplosion, hit } from './actions';
import rules from '../shared/default-rules';
import type { Store } from '../../client/src/types/framework';

export const initialState = {
    players: {},
    rules: { ...rules },
};

const replacePlayerProps = (state, playerId, props) => {
    const { players, ...rest } = state;
    const player = players[playerId];
    if(!player) return state;
    return {
        ...rest,
        players: {
            ...players,
            [playerId]: {
                ...player,
                ...props,
            },
        },
    };
};

// todo: server state and action types
export const reducer = (state, action) => {
    switch (action.type) {
        case 'CONNECT': {
            const { players, ...rest } = state;
            const { data: { playerId } } = action;
            return {
                players: {
                    ...players,
                    [`${playerId}`]: {
                        id: playerId,
                        name: `Player ${playerId}`,
                        alive: false,
                        frags: 0,
                        deaths: 0,
                    }
                },
                ...rest,
            };
        }

        case 'SELF_JOINED': { // todo: rename to join request
            const { players, ...rest } = state;
            const { data: { playerId, playerName } } = action;
            const player = players[playerId];
            return {
                players: {
                    ...players,
                    [`${playerId}`]: {
                        ...player,
                        name: playerName.trim().substring(0, 20),
                    }
                },
                ...rest,
            };
        }

        case 'SPAWN': {
            // todo call spawn after connecting and after hits
            const { players, ...rest } = state;
            const { data: { playerId, x, y } } = action;
            const player = players[playerId];

            return {
                players: {
                    ...players,
                    [`${playerId}`]: {
                        ...player,
                        x,
                        y,
                        alive: true,
                    }
                },
                ...rest,
            };
        }

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

        case 'DISCONNECT': {
            const { players, ...restState } = state;
            const { data: { playerId } } = action;
            const { [playerId]: playerToRemove, ...restPlayers } = players;
            return {
                players: restPlayers,
                ...restState,
            };
        }

        case 'MOVE_STARTED': {
            const { data: { direction, playerId } } = action;
            return replacePlayerProps(state, playerId, {
                direction,
                isMoving: true,
            });
        }

        case 'MOVE_STOPPED': {
            const { data: { direction, playerId } } = action;
            return replacePlayerProps(state, playerId, {
                direction,
                isMoving: true,
            });
        }

        case 'MOVE_TO': {
            const { data: { direction, playerId, x, y } } = action;
            return replacePlayerProps(state, playerId, {
                direction,
                x,
                y,
            });
        }

        case 'PING_LATENCY': {
            const { data: { latency = 50, playerId } } = action;
            return replacePlayerProps(state, playerId, {
                latency
            });
        }

        default:
            return state;
    }
};

const getRules = store => store.getState().rules;

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
        .map(({ data: { playerId } }) => {
            debugger;
            const { rules: { worldWidth, worldHeight, moveDistance }} = store.getState();
            return spawn({ playerId, worldWidth, worldHeight, moveDistance });
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
        .delayWhen(() => Observable.timer(store.getState().rules.respawnTime))
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
        .map(({ hits, playerId }) => hit({ hits, shooter: playerId }));

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

export const hitsExplosions = (action$, store: Store) => {
    return action$
        .ofType('HIT')
        .flatMap(({ data: { shooter, hits } }) => {
            const players = store.getState().players;
            return hits.map(playerId => {
                const player = players[playerId];
                const size = getRules(store).explosionSize;
                return addExplosion({ id: playerId, x: player.x, y: player.y, size, causedBy: shooter });
            });
        });
};

const pointCircleCollision = (point, circle, radius) => {
    if (radius === 0) return false;
    const dx = circle[0] - point[0];
    const dy = circle[1] - point[1];
    return dx * dx + dy * dy <= radius * radius
};

export const explosionsHits = (action$, store: Store) => {
    return action$
        .ofType('EXPLOSION_ADDED')
        .delay(100)
        .map(({ data: { x, y, size, causedBy } }) => {
            const players = store.getState().players;
            const collisions = Object.keys(players).filter(id => {
                const { alive, x: playerX, y: playerY } = players[id];
                return alive && pointCircleCollision([playerX, playerY], [x, y], size/2);
            });
            return hit({ hits: collisions, shooter: causedBy });
        })
        .filter(({ data: { hits } }) => hits.length > 0);
};

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
                origin: 'server', // todo fugly
                sendToClient: true, // todo fugly
                toAll: true, // todo fugly
                data: {
                    players: newPlayers
                }
            }
        });


export const epic = combineEpics(
    broadcastJoins,
    spawnJoins,
    hits,
    shots,
    requestedShots,
    hitsExplosions,
    explosionsHits,
    hitsNewPlayerState,
);

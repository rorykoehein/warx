// @flow

import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { getRandomPosition } from "./helpers";
import { generateId } from "../shared/helpers";

import type { Store } from '../../client/src/types/framework';

export const initialState = {
    bots: {}
};

export const botAdd = ({ playerId, worldWidth, worldHeight, moveDistance }) => ({
    type: 'ADD_BOT',
    origin: 'server',
    data: {
        playerId,
        x: getRandomPosition(worldWidth, moveDistance),
        y: getRandomPosition(worldHeight, moveDistance),
    }
});

export const botSetTarget = ({ botId, playerId }) => ({
    type: 'SET_TARGET',
    origin: 'server',
    data: {
        playerId,
        botId,
    }
});

export const reducer = (state, action) => {
    switch (action.type) {

        case 'ADD_BOT': {
            const { players, bots, ...rest } = state;
            const { data: { playerId, x, y, } } = action;
            const player = players[playerId];
            return {
                players: {
                    ...players,
                    [`${playerId}`]: {
                        ...player,
                        alive: true,
                        id: playerId,
                        name: `Bot ${playerId}`,
                        frags: 0,
                        deaths: 0,
                        x,
                        y,
                        isBot: true,
                    }
                },
                bots: {
                    ...bots,
                    [`${playerId}`]: {
                        id: playerId,
                        target: null,
                    }
                },
                ...rest,
            };
        }

        case 'SET_TARGET': {
            const { bots, ...rest } = state;
            const { data: { playerId, botId, } } = action;
            if(botId === playerId) {
                return state;
            }
            return {
                bots: {
                    ...bots,
                    [`${botId}`]: {
                        id: botId,
                        target: playerId,
                    }
                },
                ...rest,
            };
        }

        default:
            return state;
    }
};

const numBots = 2;

// epics
export const addBots = (action$, store: Store) =>
    action$
        .ofType('GAME_STARTED')
        .flatMap(() => {
            const { rules: { worldWidth, worldHeight, moveDistance }} = store.getState();
            return Array.from({ length: numBots })
                .map(() =>
                    botAdd({
                        playerId: generateId(),
                        worldWidth,
                        worldHeight,
                        moveDistance,
                    })
                );
        });

export const setTargets = (action$, store: Store) =>
    action$
        .ofType('ADD_BOT')
        .flatMap(({ data: { playerId: botId }}) => {
            const randTime = Math.round(Math.random() * 10000 + 10000);
            return Observable.timer(250, randTime)
                .map(() => {
                    const { players } = store.getState();
                    const playerIds = Object.keys(players).filter(id => id !== botId);
                    const randomIndex = Math.floor(Math.random() * playerIds.length);
                    const playerId = playerIds[randomIndex] || null;
                    return botSetTarget({
                        botId, playerId
                    });
                });
        });

export const driveBot = (action$, store: Store) =>
    action$
        .ofType('ADD_BOT')
        .flatMap(({ data: { playerId: botId }}) => {
            const randTime = Math.round(Math.random() * 1000 + 500);
            return Observable.interval(randTime)
                .map(() => {
                    const { bots, players, rules } = store.getState();
                    const { explosionSize } = rules;
                    const bot = bots[botId];
                    const botPlayer = players[botId];
                    const target = players[bot.target];

                    if(!botPlayer.alive || !target || botPlayer.x === target.x || botPlayer.y === target.y) {
                        return {
                            type: 'VOID',
                            data: {},
                        };
                    } else if (botPlayer.isMoving) {
                        return {
                            type: 'MOVE_STOP_REQUESTED',
                            data: {
                                playerId: botId,
                                direction: botPlayer.direction,
                            }
                        }
                    }

                    // we want to move the bot in the direction of the player
                    // find out if the target player is further away from X or Y
                    const xDelta = target.x - botPlayer.x;
                    const yDelta = target.y - botPlayer.y;
                    const axis = Math.abs(xDelta) < Math.abs(yDelta) ? 'x' : 'y';
                    const direction =
                        axis === 'x' && xDelta < 0 && xDelta > explosionSize ? 'left'
                            : axis === 'x' && xDelta > 0 && xDelta > explosionSize ? 'right'
                            : axis === 'y' && yDelta < 0 && yDelta > explosionSize ? 'up'
                                : axis === 'y' && yDelta > 0 && yDelta > explosionSize ? 'down'
                                    : ['left', 'right', 'up', 'down'][Math.floor(Math.random() * 3)];

                    if(direction) {
                        return {
                            type: 'MOVE_START_REQUESTED',
                            data: {
                                direction: direction,
                                playerId: botId
                            }
                        }
                    }

                    return {
                        type: 'VOID',
                        data: {},
                    };
                })
        });

export const botShots = (action$, store: Store) =>
    action$
        .ofType('MOVE_TO')
        .map(({ data: { playerId: botId } }) => {
            const { bots, players } = store.getState();
            const bot = bots[botId];
            const botPlayer = bot && players[botId];
            const target = bot && players[bot.target];
            return { bot, botPlayer, target };
        })
        .filter(({ bot, botPlayer, target }) => {
            return bot && botPlayer.alive && target && target.alive &&
                (botPlayer.x === target.x || botPlayer.y === target.y);
        })
        .flatMap(({ bot, botPlayer, target }) => {
            const direction =
                botPlayer.x === target.x && botPlayer.y > target.y ? 'up'
                    : botPlayer.x === target.x && botPlayer.y <= target.y ? 'down'
                    : botPlayer.y === target.y && botPlayer.x > target.x ? 'left'
                        : botPlayer.y === target.y && botPlayer.x <= target.x ? 'right' : 'right';
            const obs = Observable.of(null);
            const randTime = Math.round(Math.random() * 1000 + 750);
            return Observable.merge(
                obs.mapTo({
                    type: 'MOVE_START_REQUESTED',
                    data: {
                        playerId: bot.id,
                        direction: direction,
                    }
                }),
                obs.mapTo({
                    type: 'MOVE_STOP_REQUESTED',
                    data: {
                        playerId: bot.id,
                        direction: direction,
                    }
                }).delay(randTime),
                obs.mapTo({
                    type: 'SHOT_REQUESTED',
                    data: {
                        playerId: bot.id,
                    }
                }).delay(randTime),
            );
        });

export const epic = combineEpics(
    addBots,
    driveBot,
    setTargets,
    botShots,
);

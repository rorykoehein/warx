// @flow

import 'rxjs';
import { Observable, TestScheduler } from 'rxjs';
import { ActionsObservable } from 'redux-observable';
import { addBots, reducer, setTargets } from '../module-bots';

const R = (observable) => ActionsObservable.from(observable);
const deepEquals = (actual, expected) => expect(actual).toEqual(expected);
const createTestScheduler = () => new TestScheduler(deepEquals);

// mock
const getId = () => '1';
const getPos = () => 10;
const store = ({
    getState: () => ({
        rules: {
            worldWidth: 200,
            worldHeight: 100,
            moveDistance: 1,
        }
    })
});

describe('module-bots', () => {

    it('should add the configured amount of bot on game start', () => {
        const env = { numBots: 5 };
        const values = {
            a: { type: 'GAME_STARTED' },
            b: {
                type: 'ADD_BOT',
                origin: 'server',
                data: {
                    playerId: '1',
                    x: 10,
                    y: 10,
                }
            },
            c: { type: 'UNKNOWN_ACTION' },
        };

        const input  = 'c--a--c';
        const output = '---(bbbbb)'; // add 5 bots on game start

        const ts = createTestScheduler();
        const source = R(ts.createColdObservable(input, values));
        const actual = addBots(source, store, env, getPos, getId);
        ts.expectObservable(actual).toBe(output, values);
        ts.flush();
    });

    it('should persist a bot and player to the state on ADD_BOT', () => {
        const resultState1 = reducer({ players: {}, bots: {} }, {
            type: 'ADD_BOT',
            origin: 'server',
            data: {
                playerId: '1',
                x: 20,
                y: 30,
            }
        });

        expect(resultState1).toEqual({
            players: {
                '1': {
                    alive: true, id: '1', name: `Bot 1`, frags: 0, deaths: 0,
                    x: 20, y: 30, isBot: true,
                },
            },
            bots: {
                '1': {
                    id: '1', target: null,
                }
            },
        });

        const resultState2 = reducer(resultState1, {
            type: 'ADD_BOT',
            origin: 'server',
            data: {
                playerId: '2',
                x: 30,
                y: 40,
            }
        });

        expect(resultState2).toEqual({
            players: {
                '1': {
                    alive: true, id: '1', name: `Bot 1`, frags: 0, deaths: 0,
                    x: 20, y: 30, isBot: true,
                },
                '2': {
                    alive: true, id: '2', name: `Bot 2`, frags: 0, deaths: 0,
                    x: 30, y: 40, isBot: true,
                },
            },
            bots: {
                '1': {
                    id: '1', target: null,
                },
                '2': {
                    id: '2', target: null,
                },
            },
        });
    });

    it('should set the target after adding a bot', () => {
        const timer = () => Observable.range(1, 2); // mock Observable.timer
        // mock the random id generator so it returns 0 or 1
        let nextId = 0;
        const random = () => {
            nextId = nextId === 1 ? 0 : 1;
            return nextId;
        };

        // note: setTargets will call random twice for every ADD_BOT, once to
        // add time
        const store = ({
            getState: () => ({
                players: {
                    '1': {
                        name: 'Player 1'
                    },
                    '2': {
                        name: 'Player 2'
                    },
                }
            })
        });

        const values = {
            a: {
                type: 'ADD_BOT',
                origin: 'server',
                data: { playerId: '5', x: 10, y: 10 }
            },
            b: {
                type: 'SET_TARGET',
                origin: 'server',
                data: { playerId: '1', botId: '5' }
            },
            c: {
                type: 'SET_TARGET',
                origin: 'server',
                data: { playerId: '2', botId: '5' }
            },
        };

        const input  = '---a---';
        const output = '---(bc)';

        const ts = createTestScheduler();
        const source = R(ts.createColdObservable(input, values));
        const actual = setTargets(source, store, random, timer);
        ts.expectObservable(actual).toBe(output, values);
        ts.flush();
    });

    it('should persist the target when the target it set', () => {
        // todo
    });

    it('should find a new target when the target is dead', () => {
        // todo
    });

    it('should find a new target when the target leaves', () => {
        // todo
    });

    it('should move towards the target', () => {
        // todo
    });

    it('should shoot the target when in sight', () => {
        // todo
    });
});
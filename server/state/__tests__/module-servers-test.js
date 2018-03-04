// @flow

import 'rxjs';
import { Observable, TestScheduler } from 'rxjs';
import { ActionsObservable } from 'redux-observable';
import {
    initialState, reducer, gameStarts, hubServerRegisterRequests,
    serverRegisterRequests, createServerCheckReceived, serverReregisterRequests,
} from '../module-servers';

// todo: merge epics and run multiple actions at once
// import { merge } from 'rxjs/observable/merge';

const R = (observable) => ActionsObservable.from(observable);
const deepEquals = (actual, expected) => expect(actual).toEqual(expected);
const createTestScheduler = () => new TestScheduler(deepEquals);

const getEnv = () => ({
    hub: 'http://www.warx.io',
    location: 'us',
    name: 'warx-us',
    address: 'http://us.warx.io',
    numBots: 2,
    maxPlayers: 6,
});

describe('module-servers', () => {
    describe('epics', () => {
        describe('gameStarts', () => {

            it('should initialize the server on startup only once', () => {
                expect.hasAssertions();
                const values = {
                    a: { type: 'GAME_STARTED' },
                    b: { type: 'SERVERS_INITIALIZED', data: getEnv() },
                    c: { type: 'UNKNOWN_ACTION' },
                    d: { type: 'SERVERS_REGISTER_REQUEST', data: getEnv() },
                };

                const input = '-a--c--a--';
                const output = '-(b|)';

                const ts = createTestScheduler();
                const source = R(
                    ts.createColdObservable(input, values)
                );
                const actual = gameStarts(source, {}, getEnv());
                ts.expectObservable(actual).toBe(output, values);
                ts.flush();
            });
        });

        describe('serverRegisterRequests', () => {
            const now = () => 999;
            const timer = () => Observable.of([1]); // mock Observable.timer
            const store = {
                getState: () => ({
                    isHub: false,
                })
            };

            // mock fetch
            const successPost = (url, data) => Observable.create(observer => {
                observer.next({
                    servers: {
                        'http://x.com': {
                            address: 'http://x.com'
                        }
                    }
                });
                observer.complete();
            });

            it('should register itself with on SERVERS_REGISTER_REQUEST', () => {
                expect.hasAssertions();

                const values = {
                    a: {
                        type: 'SERVERS_REGISTER_REQUEST',
                        data: getEnv(),
                    },
                    b: {
                        type: 'SERVERS_REGISTER_RESPONSE',
                        data: {
                            servers: {
                                'http://x.com': {
                                    address: 'http://x.com',
                                }
                            },
                            lastUpdated: now(),
                        }
                    }

                };

                const timer = () => Observable.of([1]); // mock Observable.timer

                const input = '-a-a--a';
                const output = '-b-b--b';
                const ts = createTestScheduler();
                const source = R(ts.createColdObservable(input, values));
                const actual = serverRegisterRequests(
                    source, store, successPost, now, timer, 0
                );
                ts.expectObservable(actual).toBe(output, values);
                ts.flush();
            });

            it('should no nothing if there is no hub', () => {
                expect.hasAssertions();
                const values = {
                    a: {
                        type: 'SERVERS_REGISTER_REQUEST',
                        data: {},
                    },
                };

                const input = '-a';
                const output = '--';
                const ts = createTestScheduler();
                const source = R(ts.createColdObservable(input, values));
                const actual = serverRegisterRequests(
                    source, store, successPost, now
                );
                ts.expectObservable(actual).toBe(output, values);
                ts.flush();
            });
        });

        describe('hubServerRegisterRequests ', () => {
            expect.hasAssertions();
            const timer = () => Observable.range(1, 4); // mock Observable.timer
            const now = () => 9999; // mock Observable.timer
            // mock fetch
            const successFetch = (url, data) => Observable.create(observer => {
                observer.next({
                    numPlayers: 5,
                    maxPlayers: 6,
                    numBots: 2,
                    address: 'http://x.com',
                    location: 'y',
                    name: 'z'
                });
                observer.complete();
            });

            const errorFetch = (url, data) => Observable.create(observer => {
                observer.error({
                    options: {
                        url: 'http://x.com/check'
                    }
                });
                observer.complete();
            });

            const store = {
                getState: () => ({
                    servers: {},
                })
            };

            it('should check on the servers every X seconds (success)', () => {
                expect.hasAssertions();
                const values = {
                    a: {
                        type: 'SERVERS_HUB_REGISTRATION_RECEIVED',
                        data: {
                            address: 'http://x.com',
                        },
                    },
                    b: {
                        type: 'SERVERS_HUB_CHECK_SUCCESS',
                        data: {
                            address: 'http://x.com',
                            location: 'y',
                            name: 'z',
                            lastUpdated: 9999,
                            maxPlayers: 6,
                            numPlayers: 5,
                            numBots: 2,
                        },
                    },
                };

                const input = '-a----';
                const output = '-(bbbb)';

                const ts = createTestScheduler();
                const source = R(ts.createColdObservable(input, values));
                const actual = hubServerRegisterRequests(source, store, 0, successFetch, timer, now);
                ts.expectObservable(actual).toBe(output, values);
                ts.flush();
            });


            it('should check on the servers every X seconds (error)', () => {
                expect.hasAssertions();
                const values = {
                    a: {
                        type: 'SERVERS_HUB_REGISTRATION_RECEIVED',
                        data: {
                            address: 'http://x.com',
                        },
                    },
                    b: {
                        type: 'SERVERS_HUB_CHECK_ERROR',
                        data: {
                            address: 'http://x.com',
                        },
                    },
                };

                const input = '-a----';
                const output = '-(bbbb)';

                const ts = createTestScheduler();
                const source = R(ts.createColdObservable(input, values));
                const actual = hubServerRegisterRequests(source, store, 0, errorFetch, timer, now);
                ts.expectObservable(actual).toBe(output, values);
                ts.flush();
            });
        });
    });

    describe('reducer', () => {
        const initialStateWithPlayers = {
            players: {},
            bots: { '1': {}, '2': {}},
            ...initialState,
        };

        describe('server', () => {
            const stateAfterInitialization = {
                servers: {
                    'http://us.warx.io': {
                        address: 'http://us.warx.io',
                        location: 'us',
                        name: 'warx-us',
                        numPlayers: 0,
                        maxPlayers: 6,
                        numBots: 2,
                    }
                },
                bots: {
                    '1': {},
                    '2': {},
                },
                currentServer: 'http://us.warx.io',
                isLoadingServers: true,
                isHub: false,
                isRegistered: false,
                players: {},
                lastHubCheck: 0,
                isConnectedToHubNetwork: true,
            };

            it('should add itself to the list of servers on SERVERS_INITIALIZED', () => {
                expect.hasAssertions();
                const resultState = reducer(initialStateWithPlayers, {
                    type: 'SERVERS_INITIALIZED',
                    origin: 'server',
                    data: {
                        address: 'http://us.warx.io',
                        location: 'us',
                        name: 'warx-us',
                        hub: 'http://www.warx.io',
                        numBots: 2,
                        maxPlayers: 6,
                        numPlayers: 0,
                        isTrusted: true,
                    }
                });

                expect(resultState).toEqual(stateAfterInitialization);
            });

            describe('should save the time after a checkup from the hub', () => {
                expect.hasAssertions();
                const now = Number(Date.now());
                const resultState = reducer(
                    stateAfterInitialization,
                    createServerCheckReceived({
                        time: now,
                    })
                );
                expect(resultState.lastHubCheck).toEqual(now);
            });

            it('should save the servers after SERVERS_REGISTER_RESPONSE', () => {
                expect.hasAssertions();
                const resultState = reducer(stateAfterInitialization, {
                    type: 'SERVERS_REGISTER_RESPONSE',
                    origin: 'server',
                    data: {
                        servers: {
                            'http://us2.warx.io': {
                                address: 'http://us2.warx.io',
                                location: 'us',
                                name: 'warx-us2',
                                numPlayers: 2,
                                maxPlayers: 6,
                                numBots: 2,
                            },
                            'http://www.warx.io': {
                                address: 'http://www.warx.io',
                                location: 'eu',
                                name: 'warx',
                                numPlayers: 10,
                                maxPlayers: 10,
                                numBots: 2,
                            },
                        }
                    }
                });

                expect(resultState).toEqual({
                    servers: {
                        'http://us.warx.io': {
                            address: 'http://us.warx.io',
                            location: 'us',
                            name: 'warx-us',
                            maxPlayers: 6,
                            numBots: 2,
                            numPlayers: 0,
                        },
                        'http://us2.warx.io': {
                            address: 'http://us2.warx.io',
                            location: 'us',
                            name: 'warx-us2',
                            numPlayers: 2,
                            maxPlayers: 6,
                            numBots: 2,
                        },
                        'http://www.warx.io': {
                            address: 'http://www.warx.io',
                            location: 'eu',
                            name: 'warx',
                            numPlayers: 10,
                            maxPlayers: 10,
                            numBots: 2,
                        },
                    },
                    currentServer: 'http://us.warx.io',
                    isLoadingServers: false,
                    isHub: false,
                    isRegistered: true,
                    players: {},
                    lastHubCheck: 0,
                    isConnectedToHubNetwork: true,
                    bots: {
                        '1': {},
                        '2': {},
                    },
                });
            });
        });

        describe('hub', () => {

            const resultState = reducer(initialStateWithPlayers, {
                type: 'SERVERS_INITIALIZED',
                origin: 'server',
                data: {
                    address: 'http://www.warx.io',
                    location: 'eu',
                    name: 'warx-eu',
                    hub: 'http://www.warx.io',
                    numBots: 2,
                    numPlayers: 5,
                    maxPlayers: 6,
                    isTrusted: true,
                }
            });

            it('should add itself to the list of servers on SERVERS_INITIALIZED', () => {
                expect.hasAssertions();
                expect(resultState).toEqual({
                    servers: {
                        'http://www.warx.io': {
                            address: 'http://www.warx.io',
                            location: 'eu',
                            name: 'warx-eu',
                            numPlayers: 5,
                            numBots: 2,
                            maxPlayers: 6,
                        }
                    },
                    currentServer: 'http://www.warx.io',
                    isLoadingServers: false,
                    isHub: true,
                    isRegistered: true,
                    players: {},
                    lastHubCheck: 0,
                    isConnectedToHubNetwork: true,
                    bots: {
                        '1': {},
                        '2': {},
                    },
                });
            });

            const now1 = Number(Date.now());
            const checkResult1 = reducer(resultState, {
                type: 'SERVERS_HUB_CHECK_SUCCESS',
                origin: 'server',
                data: {
                    lastUpdated: now1,
                    address: 'http://us.warx.io',
                    location: 'us',
                    name: 'warx-us',
                    numPlayers: 5,
                    maxPlayers: 4,
                    numBots: 1,
                }
            });

            it('should add the server on SERVERS_HUB_CHECK_SUCCESS', () => {
                expect.hasAssertions();
                expect(checkResult1).toEqual({
                    servers: {
                        'http://www.warx.io': {
                            address: 'http://www.warx.io',
                            location: 'eu',
                            name: 'warx-eu',
                            numPlayers: 5,
                            numBots: 2,
                            maxPlayers: 6,
                        },
                        'http://us.warx.io': {
                            address: 'http://us.warx.io',
                            location: 'us',
                            name: 'warx-us',
                            numPlayers: 5,
                            maxPlayers: 4,
                            numBots: 1,
                            lastUpdated: now1,
                        },
                    },
                    currentServer: 'http://www.warx.io',
                    isLoadingServers: false,
                    isHub: true,
                    isRegistered: true,
                    players: {},
                    lastHubCheck: 0,
                    isConnectedToHubNetwork: true,
                    bots: { '1': {}, '2': {}}
                });
            });

            const now2 = Number(Date.now());
            const checkResult2 = reducer(checkResult1, {
                type: 'SERVERS_HUB_CHECK_SUCCESS',
                origin: 'server',
                data: {
                    lastUpdated: now2,
                    address: 'http://us.warx.io',
                    location: 'us',
                    name: 'warx-us',
                    numPlayers: 8,
                    numBots: 1,
                    maxPlayers: 8,
                }
            });

            it('should update an existing server on SERVERS_HUB_CHECK_SUCCESS', () => {
                expect.hasAssertions();
                expect(checkResult2).toEqual({
                    servers: {
                        'http://www.warx.io': {
                            address: 'http://www.warx.io',
                            location: 'eu',
                            name: 'warx-eu',
                            numPlayers: 5,
                            numBots: 2,
                            maxPlayers: 6,
                        },
                        'http://us.warx.io': {
                            address: 'http://us.warx.io',
                            location: 'us',
                            name: 'warx-us',
                            numPlayers: 8,
                            numBots: 1,
                            maxPlayers: 8,
                            lastUpdated: now2,
                        },
                    },
                    currentServer: 'http://www.warx.io',
                    isLoadingServers: false,
                    isHub: true,
                    isRegistered: true,
                    players: {},
                    lastHubCheck: 0,
                    isConnectedToHubNetwork: true,
                    bots: { '1': {}, '2': {}}
                });
            });

            const checkResult3 = reducer(checkResult2, {
                type: 'SERVERS_HUB_CHECK_ERROR',
                origin: 'server',
                data: {
                    address: 'http://us.warx.io',
                }
            });

            it('should remove the server on SERVERS_HUB_CHECK_ERROR', () => {
                expect.hasAssertions();
                expect(checkResult3).toEqual({
                    servers: {
                        'http://www.warx.io': {
                            address: 'http://www.warx.io',
                            location: 'eu',
                            name: 'warx-eu',
                            numPlayers: 5,
                            numBots: 2,
                            maxPlayers: 6,
                        },
                    },
                    currentServer: 'http://www.warx.io',
                    isLoadingServers: false,
                    isHub: true,
                    isRegistered: true,
                    players: {},
                    lastHubCheck: 0,
                    isConnectedToHubNetwork: true,
                    bots: {'1':{}, '2':{}}
                });
            });
        });
    });
});
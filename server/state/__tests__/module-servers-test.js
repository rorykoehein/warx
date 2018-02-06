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
                const output = '-(bd|)';

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

                const input = '-a-a--a';
                const output = '-b-b--b';
                const ts = createTestScheduler();
                const source = R(ts.createColdObservable(input, values));
                const actual = serverRegisterRequests(
                    source, store, successPost, now
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

            let errorPostCalled = 0; // keep track of this for retry test
            const errorPost = (url, data) => Observable.create(observer => {
                errorPostCalled++;
                observer.error({});
                observer.complete();
            });

            it('should retry if the registration request fails', () => {
                expect.hasAssertions();
                const values = {
                    a: {
                        type: 'SERVERS_REGISTER_REQUEST',
                        data: getEnv()
                    }
                };

                const input = '-a-';
                const output = '---';
                const retryTimes = 20;
                const ts = createTestScheduler();
                const source = R(ts.createColdObservable(input, values));
                const actual = serverRegisterRequests(
                    source, store, errorPost, now, timer, retryTimes
                );
                ts.expectObservable(actual).toBe(output, values);
                ts.flush();
                expect(errorPostCalled).toBe(retryTimes);
            });
        });

        describe('serverReregisterRequests', () => {
            expect.hasAssertions();
            const now = (time) => () => time;
            const timer = () => Observable.of([1]); // mock Observable.timer

            const values = {
                a: {
                    type: 'SERVERS_INITIALIZED',
                    data: {
                        hub: 'http://www.warx.io',
                    },
                },
                b: {
                    type: 'SERVERS_REGISTER_REQUEST',
                    data: {
                        hub: 'http://www.warx.io',
                    },
                },
            };

            const store = lastCheckedTime => ({
                getState: () => ({
                    lastHubCheck: lastCheckedTime,
                    isHub: false,
                })
            });

            it('should not reregister if recently checked on', () => {
                const input = '-a';
                const output = '--';

                const ts = createTestScheduler();
                const source = R(
                    ts.createColdObservable(input, values)
                );
                // last checked = 10
                // now = 20
                // check time = 6
                // should have been checked at 16 and 22, missed just one check
                const actual = serverReregisterRequests(source, store(10), 6, timer, now(20));
                ts.expectObservable(actual).toBe(output, values);
                ts.flush();


            });

            it('should reregister if not checked on for longer than' +
                ' checkTime *2', () => {
                expect.hasAssertions();
                const input = '-a';
                const output = '-b';

                const ts = createTestScheduler();
                const source = R(
                    ts.createColdObservable(input, values)
                );

                // last checked = 10
                // now = 20
                // check time = 4
                // should have been checked at 4 and 8, missed two checks
                const actual = serverReregisterRequests(source, store(10), 4, timer, now(20));
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
                    players: 5, address: 'http://x.com', location: 'y', name: 'z'
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
                            players: 5,
                            lastUpdated: 9999,
                        },
                    },
                };

                const input = '-a----';
                const output = '-(bbbb)';

                const ts = createTestScheduler();
                const source = R(ts.createColdObservable(input, values));
                const actual = hubServerRegisterRequests(source, {}, 0, successFetch, timer, now);
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
                const actual = hubServerRegisterRequests(source, {}, 0, errorFetch, timer, now);
                ts.expectObservable(actual).toBe(output, values);
                ts.flush();
            });
        });
    });

    describe('reducer', () => {
        const initialStateWithPlayers = {
            players: {},
            ...initialState,
        };

        describe('server', () => {
            const stateAfterInitialization = {
                servers: {
                    'http://us.warx.io': {
                        address: 'http://us.warx.io',
                        location: 'us',
                        name: 'warx-us',
                        players: 0,
                    }
                },
                currentServer: 'http://us.warx.io',
                isLoadingServers: true,
                isHub: false,
                isRegistered: false,
                players: {},
                lastHubCheck: 0,
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
                                players: 2,
                            },
                            'http://www.warx.io': {
                                address: 'http://www.warx.io',
                                location: 'eu',
                                name: 'warx',
                                players: 10,
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
                            players: 0,
                        },
                        'http://us2.warx.io': {
                            address: 'http://us2.warx.io',
                            location: 'us',
                            name: 'warx-us2',
                            players: 2,
                        },
                        'http://www.warx.io': {
                            address: 'http://www.warx.io',
                            location: 'eu',
                            name: 'warx',
                            players: 10,
                        },
                    },
                    currentServer: 'http://us.warx.io',
                    isLoadingServers: false,
                    isHub: false,
                    isRegistered: true,
                    players: {},
                    lastHubCheck: 0,
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
                            players: 0,
                        }
                    },
                    currentServer: 'http://www.warx.io',
                    isLoadingServers: false,
                    isHub: true,
                    isRegistered: true,
                    players: {},
                    lastHubCheck: 0,
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
                    players: 5,
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
                            players: 0,
                        },
                        'http://us.warx.io': {
                            address: 'http://us.warx.io',
                            location: 'us',
                            name: 'warx-us',
                            players: 5,
                            lastUpdated: now1,
                        },
                    },
                    currentServer: 'http://www.warx.io',
                    isLoadingServers: false,
                    isHub: true,
                    isRegistered: true,
                    players: {},
                    lastHubCheck: 0,
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
                    players: 8,
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
                            players: 0,
                        },
                        'http://us.warx.io': {
                            address: 'http://us.warx.io',
                            location: 'us',
                            name: 'warx-us',
                            players: 8,
                            lastUpdated: now2,
                        },
                    },
                    currentServer: 'http://www.warx.io',
                    isLoadingServers: false,
                    isHub: true,
                    isRegistered: true,
                    players: {},
                    lastHubCheck: 0,
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
                            players: 0,
                        },
                    },
                    currentServer: 'http://www.warx.io',
                    isLoadingServers: false,
                    isHub: true,
                    isRegistered: true,
                    players: {},
                    lastHubCheck: 0,
                });
            });
        });
    });
});
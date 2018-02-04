// @flow

import 'rxjs';
import { Observable, TestScheduler } from 'rxjs';
import { ActionsObservable } from 'redux-observable';
import {
    initialState, reducer, gameStarts, hubServerRegisterRequests,
    serverRegisterRequests
} from '../module-servers';
import type {PlayerId} from "../../../client/src/types/game";

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
                const values = {
                    a: { type: 'GAME_STARTED' },
                    b: { type: 'SERVERS_INITIALIZED', data: getEnv() },
                    c: { type: 'UNKNOWN_ACTION' },
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

            const errorPost = (url, data) => Observable.create(observer => {
                observer.error({});
                observer.complete();
            });

            it('should register itself with the hub on initializing if there is a hub', () => {
                const values = {
                    a: {
                        type: 'SERVERS_INITIALIZED',
                        data: {
                            hub: 'http://x.com',
                        },
                    },
                    b: {
                        type: 'SERVERS_REGISTER_RESPONSE',
                        data: {
                            lastUpdated: 999,
                            servers: {
                                'http://x.com': {
                                    address: 'http://x.com',
                                },
                            },
                        },
                    },
                };

                const input = '-a';
                const output = '-b';
                const ts = createTestScheduler();
                const source = R(ts.createColdObservable(input, values));
                const actual = serverRegisterRequests(
                    source, store, successPost, now
                );
                ts.expectObservable(actual).toBe(output, values);
                ts.flush();
            });

            it('should no nothing if there is no hub', () => {
                const values = {
                    a: {
                        type: 'SERVERS_INITIALIZED',
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

            it('should retry if the registration request fails', () => {
                const values = {
                    a: {
                        type: 'SERVERS_INITIALIZED',
                        data: {
                            hub: 'http://x.com',
                        },
                    },
                    b: {
                        type: 'SERVERS_REGISTRATION_FAILED',
                        data: {},
                    },
                };

                const input = '-a-';
                const output = '-b-';
                const ts = createTestScheduler();
                const source = R(ts.createColdObservable(input, values));
                const actual = serverRegisterRequests(
                    source, store, errorPost, now
                );
                ts.expectObservable(actual).toBe(output, values);
                ts.flush();
            });
        });

        describe('hubServerRegisterRequests ', () => {
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
            };

            it('should add itself to the list of servers on SERVERS_INITIALIZED', () => {
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

            it('should save the servers after SERVERS_REGISTER_RESPONSE', () => {
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
                });
            });
        });
    });
});
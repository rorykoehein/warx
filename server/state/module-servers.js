// @flow

import os from 'os';
import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { createSelector } from 'reselect';
import { fetch, post,  } from '../shared/http';
import { fibonacci } from '../shared/helpers';
import { getSignedInPlayers } from './module-game';
import type { ActionInterface, Store } from  '../../client/src/types/framework';

// there is one central hub and X servers, each server registers itself at the
// central hub on startup. the hub 'checks' on the servers on interval, on every
// check the hub receives the latest info for the server
// map-server-messages listens to endpoints and transforms to actions which are
// handles in this module

// local types

export type InitializedAction = {
    +type: 'SERVERS_INITIALIZED',
    +origin: 'server',
    +data: {
        address: string,
        location: string,
        name: string,
        hub: string,
        maxPlayers: number,
        numBots: number,
        isTrusted: boolean,
    }
};

export type RegisterRequestAction = {
    +type: 'SERVERS_REGISTER_REQUEST',
    +origin: 'server',
    +data: {
        address: string,
        location: string,
        name: string,
        hub: string,
        maxPlayers: number,
        numBots: number,
        isTrusted: boolean,
    }
};

export type RegisterResponseAction = {
    +type: 'SERVERS_REGISTER_RESPONSE',
    +origin: 'server',
    +data: {
        +servers: Servers,
    }
};

export type HubCheckSuccessAction = {
    +type: 'SERVERS_HUB_CHECK_SUCCESS',
    +origin: 'server',
    +data: Server,
};

export type HubCheckErrorAction = {
    +type: 'SERVERS_HUB_CHECK_ERROR',
    +origin: 'server',
    +data: {
        +address: string,
    }
};

export type RegistrationFailedAction = {
    +type: 'SERVERS_REGISTRATION_FAILED',
    +origin: 'server',
    +data: Server
};

export type HubRegistrationReceivedAction = {
    +type: 'SERVERS_HUB_REGISTRATION_RECEIVED',
    +origin: 'server',
    +data: {
        +address: string,
    },
};

export type CheckReceivedAction = {
    +type: 'SERVERS_CHECK_RECEIVED',
    +origin: 'server',
    +data: {
        +time: number,
    },
};

export type ServersChangedAction = {
    +type: 'SERVERS_CHANGED',
    +origin: 'server',
    +sendToClient: true,
    +toAll: true,
    +data: {
        +servers: Servers,
    },
};

export type Action = InitializedAction | RegisterRequestAction |
    RegisterResponseAction | HubCheckSuccessAction| HubCheckErrorAction |
    HubRegistrationReceivedAction | RegistrationFailedAction |
    CheckReceivedAction | ServersChangedAction;

export type Env = {
    +hub: ?string,
    +location: ?string,
    +name: ?string,
    +address: ?string,
    +maxPlayers: ?number,
    +numBots: ?number,
};

export type Server = {
    +address: string,
    +location: string,
    +name: string,
    +maxPlayers: number,
    +numPlayers: ?number,
    +numBots: number,
};

export type Servers = {
    +[address: string]: Server,
};

export type State = {
    servers: Servers,
    isLoadingServers: boolean,
    isHub: boolean,
    currentServer: ?string,
    isRegistered: boolean,
    lastHubCheck: 0,
};

// returns env vars which describe this server
const getServersEnv = (): Env => ({
    hub: process.env.HUB,
    location: process.env.LOCATION || 'n/a',
    name: process.env.SERVER_NAME || os.hostname(),
    address: process.env.ADDRESS, // todo see if it makes sense to use npm public-ip
    maxPlayers: Number(process.env.MAX_PLAYERS) || 16,
    numBots: Number(process.env.NUM_BOTS) || 0,
});

// initial state for this module
export const initialState: State = {
    servers: {},
    isLoadingServers: false,
    isHub: false,
    isRegistered: false,
    currentServer: null,
    lastHubCheck: 0,
};

// actions

// hub: when a server requests to register on this hub
export const createHubRegistrationReceived = ({ address }: { address: string }):
    HubRegistrationReceivedAction => ({
        type: 'SERVERS_HUB_REGISTRATION_RECEIVED',
        origin: 'server',
        data: {
            address,
        },
    });

// hub: when a server requests to register on this hub
export const createServerCheckReceived = ({ time }: { time: number }):
    CheckReceivedAction => ({
        type: 'SERVERS_CHECK_RECEIVED',
        origin: 'server',
        data: {
            time
        },
    });

// reducer
// todo: update the hub's state as well, so it shows the correct amount of players, etc.
export const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'SERVERS_INITIALIZED': {
            // both on server and hub to initialize
            const {
                data: { address, location, name, hub, maxPlayers, numBots }
            } = action;
            console.log('SERVERS_INITIALIZED', action);
            return {
                ...state,
                servers: {
                    [address]: {
                        address,
                        location,
                        name,
                        maxPlayers,
                        numBots,
                        numPlayers: 0,
                    }
                },
                currentServer: address,
                isLoadingServers: hub !== address,
                isHub: hub === address,
                isRegistered: hub === address,
            };
        }

        case 'SERVERS_REGISTER_REQUEST': {
            return {
                ...state,
                isRegistered: false,
            };
        }

        case 'SERVERS_REGISTER_RESPONSE': {
            // on the server when the hub responded to our registration
            const currentServer = getCurrentServer(state);
            const { data: { servers } } = action;
            const address = state.currentServer;
            return address && currentServer ? {
                ...state,
                servers: {
                    [address]: currentServer,
                    ...servers,
                },
                isLoadingServers: false,
                isRegistered: true,
            } : {
                ...state,
                isRegistered: false,
            };
        }

        case 'SERVERS_CHECK_RECEIVED': {
            // on the server when the hub has checked up with us
            const { data: { time } } = action;
            return {
                ...state,
                lastHubCheck: time,
            };
        }

        case 'SERVERS_HUB_CHECK_SUCCESS': {
            // on the hub after a server answers the check request
            const { data: { address, ...rest } } = action;
            return {
                ...state,
                servers: {
                    ...state.servers,
                    [address]: {
                        address: address,
                        ...rest,
                    }
                },
            };
        }

        case 'SERVERS_HUB_CHECK_ERROR': {
            // on the hub after an error from the server after a check:
            // remove the server from the list
            const { data: { address } } = action;
            const { servers: { [address]: addressToRemove, ...rest } } = state;
            return {
                ...state,
                servers: rest,
            };
        }

        default:
            return state;
    }
};

// sagas

export const gameStarts = (action$, store, serverEnv = getServersEnv()) =>
    action$
        .ofType('GAME_STARTED')
        .first()
        .map(() => ({
            type: 'SERVERS_INITIALIZED',
            data: serverEnv
        }));

const hubServerCheckTime = 30000; // todo check on the server every 30 seconds?

// checkTime the interval at which the hubs should 'check' on the servers
export const hubServerRegisterRequests = (
    action$: ActionInterface, // todo: special redux-observable Action$ type?
    store: Store,
    checkTime: number = 30000,
    httpFetch: Function = fetch,
    timer: Function = Observable.timer,
    now: Function = () => Number(Date.now())
) =>
    action$
        .ofType('SERVERS_HUB_REGISTRATION_RECEIVED')
        .filter(({ data: { address }}) => {
            // only register server if we don't know about it yet
            const currentServers = getServers(store.getState());
            return !currentServers[address];
        })
        .flatMap(action =>
            timer(0, checkTime)
                .map(() => action)
        )
        .mergeMap(({ data: { address }}) => {
            return httpFetch(`${address}/check`)
                .map(({ maxPlayers, numPlayers, address, location, name, numBots }) => ({
                    type: 'SERVERS_HUB_CHECK_SUCCESS',
                    data: {
                        lastUpdated: now(),
                        address,
                        location,
                        name,
                        numPlayers,
                        maxPlayers,
                        numBots,
                    }
                }))
                .catch(error => Observable.of({
                    type: 'SERVERS_HUB_CHECK_ERROR',
                    data: {
                        address
                    }
                }));
        });

// when we know new information about servers, send this to the client
// todo: optimize: only send when server data has changes
// todo: optimize: only send to clients that are on server screen
export const sendServersToClients = (action$: ActionInterface, store: Store) =>
    action$
        .filter(({ type }) =>
            type === 'CONNECTION_REQUESTED' ||
            type === 'SERVERS_HUB_CHECK_SUCCESS' ||
            type === 'SERVERS_HUB_REGISTRATION_RECEIVED' ||
            type === 'SERVERS_HUB_CHECK_ERROR'
        )
        .map(() => ({
            type: 'SERVERS_CHANGED',
            sendToClient: true,
            toAll: true,
            data: {
                currentServer: store.getState().currentServer,
                servers: getServers(store.getState()),
            },
        })
    );

// on the server: reregister with the hub it's not checking on us anymore
export const serverReregisterRequests = (
    action$: ActionInterface,
    store: Store,
    checkTime: number = hubServerCheckTime,
    timer: Function = Observable.timer,
    now: Function = () => Number(Date.now()),
) =>
    action$
        .ofType('SERVERS_INITIALIZED')
        .filter(({ data: { hub, ...rest }}) => !store.getState().isHub && hub)
        .flatMap(action => timer(0, checkTime * 2).map(() => action))
        .filter(() => {
            const time = now();
            const state: State = store.getState();
            return checkTime * 2 < time - state.lastHubCheck;
        })
        .map(({ data }) => ({
            type: 'SERVERS_REGISTER_REQUEST',
            data: data,
        }));


// todo: what if the hub stops 'checking' on us? re-register after not
// receiving a check for x seconds?
export const serverRegisterRequests = (
    // $FlowFixMe
    action$,
    store: Store,
    httpPost: Function = post,
    now: Function = () => Number(Date.now()),
    timer: Function = Observable.timer,
    retryTimes: number = 20,
) =>
    action$
        .ofType('SERVERS_REGISTER_REQUEST')
        .filter(({ data: { hub, ...rest }}) => !store.getState().isHub && hub)
        .mergeMap(({ data: { hub, ...rest }}) =>
            httpPost(`${hub}/register`, rest)
                .map(({ servers }) => ({
                    type: 'SERVERS_REGISTER_RESPONSE',
                    data: {
                        lastUpdated: now(),
                        servers
                    }
                }))
                .retryWhen(attempts =>
                    Observable.range(1, retryTimes - 1)
                        .zip(attempts, i => i)
                        .flatMap(i => timer(fibonacci(i) * 1000))
                )
        );


export const updateHub = (
    action$,
    store: Store,
    now: Function = () => Number(Date.now())
) =>
    action$
        .filter(({ type }) =>
            type === 'DISCONNECTION_REQUESTED' ||
            type === 'PLAYER_JOINED'
        )
        .map(() => getCurrentServer(store.getState()))
        .filter(currentServer => currentServer)
        .map(currentServer => {
            return {
                type: 'SERVERS_HUB_CHECK_SUCCESS',
                data: {
                    lastUpdated: now(),
                    address: currentServer.address,
                    location: currentServer.location,
                    name: currentServer.name,
                    numPlayers: currentServer.numPlayers,
                    maxPlayers: currentServer.maxPlayers,
                    numBots: currentServer.numBots,
                }
            }
        });


export const epic = combineEpics(
    gameStarts,
    hubServerRegisterRequests,
    serverRegisterRequests,
    serverReregisterRequests,
    sendServersToClients,
    updateHub,
);

// selectors

// todo createSelector and get players from players module
export const getCurrentServer = (state: State): ?Server => {
    return state.currentServer ? {
        ...state.servers[state.currentServer],
        numPlayers: getSignedInPlayers(state).length,
    } : null;
};

export const getServers = (state: State): Servers => state.servers;

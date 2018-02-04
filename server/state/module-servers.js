// @flow

import { combineEpics } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { createSelector } from 'reselect';
import { fetch, post } from '../shared/http';
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
        address: string, location: string, name: string, hub: string
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

export type CheckReceivedAction = {
    +type: 'SERVERS_CHECK_RECEIVED',
    +origin: 'server',
    +data: {}
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

export type Action = InitializedAction | RegisterResponseAction |
    HubCheckSuccessAction| HubCheckErrorAction | HubRegistrationReceivedAction |
    RegistrationFailedAction;

export type Env = {
    +hub: ?string,
    +location: ?string,
    +name: ?string,
    +address: ?string,
};

export type Server = {
    +address: string,
    +location: string,
    +name: string,
    +players: number,
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
};

// returns env vars which describe this server
const getServersEnv = (): Env => ({
    hub: process.env.HUB,
    location: process.env.LOCATION,
    name: process.env.SERVER_NAME,
    address: process.env.ADDRESS,
});

// initial state for this module
export const initialState: State = {
    servers: {},
    isLoadingServers: false,
    isHub: false,
    isRegistered: false,
    currentServer: null,
};

// actions

// hub: when a server requests to register on this hub
export const createHubRegistrationReceived = ({ address }: { address: string }): HubRegistrationReceivedAction => ({
    type: 'SERVERS_HUB_REGISTRATION_RECEIVED',
    origin: 'server',
    data: {
        address,
    },
});

// hub: when a server requests to register on this hub
export const createServerCheckReceived = (): CheckReceivedAction => ({
    type: 'SERVERS_CHECK_RECEIVED',
    origin: 'server',
    data: {},
});

// reducer

export const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case 'SERVERS_INITIALIZED': {
            const { data: { address, location, name, hub } } = action;
            return {
                ...state,
                servers: {
                    [address]: {
                        address,
                        location,
                        name,
                        players: 0,
                    }
                },
                currentServer: address,
                isLoadingServers: hub !== address,
                isHub: hub === address,
                isRegistered: hub === address,
            };
        }

        case 'SERVERS_REGISTER_RESPONSE': {
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

        case 'SERVERS_HUB_CHECK_SUCCESS': {
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
        .map(() => ({
            type: 'SERVERS_INITIALIZED',
            data: serverEnv
        }))
        .take(1);

// checkTime the interval at which the hubs should 'check' on the servers
export const hubServerRegisterRequests =
    (action$: ActionInterface, // todo: special redux-observable Action$ type?
     store: Store,
     checkTime: number = 10000,
     httpFetch: Function = fetch,
     timer: Function = Observable.timer,
     now: Function = () => Number(Date.now())
    ) => (
        action$
            .ofType('SERVERS_HUB_REGISTRATION_RECEIVED')
            .flatMap(action =>
                timer(0, checkTime)
                    .map(() => action)
            )
            .mergeMap(({ data: { address }}) =>
                httpFetch(`${address}/check`)
                    .map(({ players, address, location, name }) => ({
                        type: 'SERVERS_HUB_CHECK_SUCCESS',
                        data: {
                            lastUpdated: now(),
                            address,
                            location,
                            name,
                            players,
                        }
                    }))
                    .catch(error => Observable.of({
                        type: 'SERVERS_HUB_CHECK_ERROR',
                        data: {
                            address: error.options.url.replace('/check', '')
                        }
                    }))
            )
    );


// todo: what if this call doesn't work? retry the register every x seconds
// todo: what if the hub stops 'checking' on us? re-register after not receiving a check for x seconds
export const serverRegisterRequests = (
    action$,
    store, getEnv = getServersEnv,
    httpPost = post
) =>
    action$
        .ofType('SERVERS_INITIALIZED')
        .filter(() => !store.getState().isHub)
        .mergeMap(({ data: { hub, ...rest }}) =>
            httpPost(`${hub}/register`, rest)
                .map(({ servers }) => ({
                    // todo: registration_success?
                    type: 'SERVERS_REGISTER_RESPONSE',
                    data: {
                        lastUpdated: Number(Date.now()),
                        servers
                    }
                }))
                .catch(error => Observable.of({
                    type: 'SERVERS_REGISTRATION_FAILED',
                    data: {}
                }))
        );


export const epic = combineEpics(
    gameStarts,
    hubServerRegisterRequests,
    serverRegisterRequests,
);

// selectors

// todo createSelector and get players from players module
export const getCurrentServer = (state: State): ?Server => {
    return state.currentServer ? {
        ...state.servers[state.currentServer],
        players: Object.keys(state.players).length,
    } : null;
};

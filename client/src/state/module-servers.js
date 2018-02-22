// @flow

import { Observable } from 'rxjs/Observable';
import { createSelector } from 'reselect';
import { toList } from '../shared/helpers';

export type Server = {
    +address: string,
    +location: string,
    +name: string,
    +numPlayers: number,
    +maxPlayers: number,
};

export type ServerList = Array<Server>;

type State = {
    currentServer: ?string,
    servers: {
        [string]: Server,
    }
};

// initial state
export const initialState = {
    servers: {},
    currentServer: null,
};

// reducer
export const reducer = (state: State, action) => {
    switch (action.type) {
        case 'SERVERS_CHANGED': {
            return {
                ...state,
                currentServer: action.data.currentServer,
                servers: action.data.servers,
            };
        }

        default: return state;
    }
};

export const getServerList = (state: State): ServerList => toList(state.servers);
export const getCurrentServer = (state: State): ?string => state.currentServer;
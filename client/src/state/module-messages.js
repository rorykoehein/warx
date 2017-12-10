// @flow

import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import { createSelector } from 'reselect';
import { emptyList } from './helpers';

import type { State, MessagesType, MessageList } from '../types/game';

// local types
type AddMessageAction = {
    +type: 'MESSAGE_ADDED',
    +origin: 'client',
    +data: {
        +message: string,
        +id: number,
    }
};

type RemoveMessageAction = {
    +type: 'MESSAGE_CLEANUP',
    +origin: 'client',
    +data: {
        +id: number,
    }
};

type Action = AddMessageAction | RemoveMessageAction;

export const initialState = {
    messages: {},
};

// actions
export const addMessage = ({ message, id }: { message: string, id: number }): AddMessageAction => {
    return {
        type: 'MESSAGE_ADDED',
        origin: 'client',
        data: {
            message,
            id,
        }
    };
};

export const cleanupMessage = ({ id }: { id: number }): RemoveMessageAction => {
    return {
        type: 'MESSAGE_CLEANUP',
        origin: 'client',
        data: {
            id
        }
    };
};

// reducer
export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'MESSAGE_ADDED': {
            const { data: { message = '', id } } = action;
            const { messages = {} } = state;
            return {
                ...state,
                messages: {
                    ...messages,
                    [`${id}`]: message,
                },
            };
        }

        case 'MESSAGE_CLEANUP': {
            const { data: { id } } = action;
            const { [`${id}`]: removeMessage, ...messages } = state.messages;
            return {
                ...state,
                messages: messages,
            };
        }
        default:
            return state;
    }
};

// selectors
export const getMessages = (state: State) => state.messages;

export const getMessagesByLatest = createSelector(
    getMessages,
    (messages: MessagesType): MessageList =>
        messages &&
        Object.keys(messages)
            .sort((a, b) => Number(b) - Number(a))
            .map(key => ({
                id: key,
                text: messages[key],
            }))
        || emptyList
);


// epics
const actionMessageMap = {
    PLAYER_LEFT: () => 'Player left', // todo: at this moment the player who left is removed from the state
    PLAYER_JOINED: ({ data: { player } }) => `${player.name} joined the game`,
    HIT: ({ data: { shooter, hits } }, store) => {
        const players = store.getState().players;
        const killedPlayers = hits.map(id => players[id].name).join(', ');
        const killer = players[shooter];
        return `${killer.name} killed ${killedPlayers}`;
    }
};

let nextMessageId = 0;

const messages = (action$, store) => {
    return action$
        .filter(({ type }) => actionMessageMap[type])
        .map(action => addMessage({
            message: actionMessageMap[action.type](action, store),
            id: nextMessageId++,
        }));
};

const messagesCleanup = (action$) => {
    return action$
        .ofType('MESSAGE_ADDED')
        .delayWhen(() => Observable.timer(7000))
        .map(({ data: { id }}) => cleanupMessage({ id }));
};


export const epic = combineEpics(
    messages,
    messagesCleanup,
);

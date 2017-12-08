import { createSelector } from 'reselect';
import { toList, emptyList } from './helpers';
import type { MessageList, MessagesType, ExplosionsType, Explosion } from "../types/game";

// shots
export const getShots = state => state.shots;
export const getShotsList = state => toList(getShots(state));

// ping latency
export const getLatency = state => state.latency;

// sign in
export const isSignedIn = state => state.isSignedIn;

// rules
export const getRules = state => state.rules;

// explosions
export const getExplosions = state => state.explosions;

export const getExplosionsList = createSelector(
    getExplosions,
    (explosions: ExplosionsType): Array<Explosion> => toList(explosions)
);

// messages
export const getMessages = state => state.messages;

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

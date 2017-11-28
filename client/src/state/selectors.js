import { createSelector } from 'reselect'
import { PlayerList, MessageList, MessagesType, Players, ExplosionsType, Explosion } from "../types/game";

const emptyList = [];
const toList = object => object && Object.keys(object).map(key => object[key]) || emptyList;

// shots
export const getShots = state => state.shots;
export const getShotsList = state => toList(getShots(state));

// ping latency
export const getLatency = state => state.latency;

// sign in
export const isSignedIn = state => state.isSignedIn;

// rules
export const getRules = state => state.rules;

// players
export const getPlayers = state => state.players;
export const getCurrentPlayerId = state => state.currentPlayerId;
export const getCurrentPlayer = state => getPlayers(state)[getCurrentPlayerId(state)];

export const getAlivePlayers = createSelector(
    getPlayers,
    (players: Players): PlayerList => toList(players).filter(player => player.alive)
);

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

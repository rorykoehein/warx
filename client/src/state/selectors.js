import { createSelector } from 'reselect'
import { PlayerList, MessageList, MessagesType, Players, ExplosionsType, Explosion } from "../types/game";

const emptyList = [];

// rules
export const getRules = state => state.rules;

// players
export const getPlayers = state => state.players;
export const getCurrentPlayerId = state => state.currentPlayerId;
export const getCurrentPlayer = state => getPlayers(state)[getCurrentPlayerId(state)];

export const getAlivePlayers = createSelector(
    getPlayers,
    (players: Players): PlayerList =>
        players &&
        Object.keys(players)
            .map(playerId => players[playerId])
            .filter(player => player.alive)
        || emptyList
);

// explosions
export const getExplosions = state => state.explosions;

export const getExplosionsList = createSelector(
    getExplosions,
    (explosions: ExplosionsType): Array<Explosion> =>
        explosions &&
        Object.keys(explosions)
            .map(key => explosions[key])
        || emptyList
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

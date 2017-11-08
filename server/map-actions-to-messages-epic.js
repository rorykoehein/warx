import type { Store } from '../client/src/app/types/framework';
import { send, broadcast, all } from "./socket/send-messages";

export const connects = (action$, store: Store) =>
    action$
        .ofType('CONNECT')
        .forEach(({ data: { playerId } }) => {
            console.log('connect epic runs');
            const { players } = store.getState();

            // send the current game state to the client when he logs in
            send(playerId, 'action', {
                type: 'GAME_STATE_CHANGED',
                origin: 'server',
                data: {
                    state: {
                        players,
                        currentPlayerId: playerId,
                    },
                },
            });

            // let the other cients know a new player has joined
            broadcast(playerId, 'action', {
                type: 'PLAYER_JOINED',
                origin: 'server',
                data: {
                    player: players[playerId],
                },
            });
        });

export const networkActions = (action$, store: Store) =>
    action$
        .filter(({ sendToClient }) => sendToClient)
        .forEach(({ type, data }) => {
            // todo: these are only broadcast actions
            console.log('broadcast', data.playerId, type, data);
            broadcast(data.playerId, 'action', {
                type,
                data
            });
        });

export const disconnects = (action$, store: Store) =>
    action$
        .ofType('DISCONNECT')
        .forEach(({ data: { playerId } }) => {
            // let all users know this player is now gone
            all('action', {
                type: 'PLAYER_LEFT',
                origin: 'server',
                data: {
                    id: playerId,
                },
            });
        });
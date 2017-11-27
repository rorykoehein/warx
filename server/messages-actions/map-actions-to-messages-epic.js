import type { Store } from '../../client/src/types/framework';
// possibly inject these functions from network-messages on setup, but for now this is decoupled enough
import { send, broadcast, all } from "../network-messages/send-messages";

export const connects = (action$, store: Store) =>
    action$
        .ofType('CONNECT')
        .do(payload => {
            const { data: { playerId } } = payload;
            const { players, rules } = store.getState();

            // todo: replace playerIds by numberic ids to save network space, communicate this number id once on join
            console.log('CONNECTOR playerId', playerId, {
                type: 'CONNECTED',
                origin: 'server',
                data: {
                    playerId,
                },
            });

            // send the current game state to the client when he logs in
            send(playerId, 'action', {
                type: 'CONNECTED',
                origin: 'server',
                data: {
                    playerId,
                },
            });

            // send the current game state to the client when he logs in
            send(playerId, 'action', {
                type: 'GAME_STATE_CHANGED',
                origin: 'server',
                data: {
                    state: {
                        players,
                        currentPlayerId: playerId,
                        rules,
                    },
                },
            });
        })
        .ignoreElements();

export const pings = (action$, store: Store) =>
    action$
        .ofType('PING')
        .do(payload => {
            const { data: { playerId } } = payload;
            send(playerId, 'action', { type: 'PONG', data: {} })
        })
        .ignoreElements();

export const networkActions = (action$, store: Store) =>
    action$
        .filter(({ sendToClient }) => sendToClient)
        .do(payload => {
            const { type, data, toAll } = payload;
            toAll ? all('action', { type, data }) : broadcast(data.playerId, 'action', { type, data });
        })
        .ignoreElements();

export const disconnects = (action$, store: Store) =>
    action$
        .ofType('DISCONNECT')
        .do(({ data: { playerId } }) => {
            // let all users know this player is now gone
            all('action', {
                type: 'PLAYER_LEFT',
                origin: 'server',
                data: {
                    playerId,
                },
            });
        })
        .ignoreElements();
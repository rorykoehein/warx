import type { Store } from '../../client/src/app/types/framework';
// possibly inject these functions from network-messages on setup, but for now this is decoupled enough
import { send, broadcast, all } from "../network-messages/send-messages";
import rules from '../game/rules';

export const connects = (action$, store: Store) =>
    action$
        .ofType('CONNECT')
        .do(payload => {
            const { data: { playerId } } = payload;
            const { players } = store.getState();

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

            // let the other cients know a new player has joined
            broadcast(playerId, 'action', {
                type: 'PLAYER_JOINED',
                origin: 'server',
                data: {
                    player: players[playerId],
                },
            });
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
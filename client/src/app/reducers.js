// @flow

import type { Player, State } from './types/game';
import type { Action } from './types/actions';
import initialState from './initial-state';

const move = (player: Player, direction): Player => ({
    ...player,
    direction,
    x: direction === 'left' ? player.x - 10 : direction === 'right' ? player.x + 10 : player.x,
    y: direction === 'up' ? player.y - 10 : direction === 'down' ? player.y + 10 : player.y,
});

const reducer = (state: State = initialState, action: Action): State => {
    const { players } = state;

    switch (action.type) {
        case 'GAME_STATE_CHANGED': {
            const { data: { state: { players, currentPlayerId } } } = action;
            return {
                ...state,
                players,
                currentPlayerId
            };
        }

        case 'PLAYER_JOINED': {
            const { data: { player } } = action;
            return {
                ...state,
                players: {
                    ...players,
                    [player.id]: player,
                }
            };
        }

        case 'PLAYER_LEFT': {
            const { data: { playerId } } = action;
            const { [playerId]: leftPlayer, ...restPlayers } = players;
            return {
                ...state,
                players: restPlayers,
            };
        }

        case 'MOVE': {
            const { data: { direction, playerId } } = action;
            const player = players[playerId];
            if(!player) return state;
            return {
                ...state,
                players: {
                    ...players,
                    [playerId]: move(player, direction),
                },
            };
        }

        case 'SHOOT': {
            const { data: { playerId } } = action;
            const { shots } = state;
            const { direction, x, y } = players[playerId];
            return {
                ...state,
                shots: {
                    ...shots,
                    [playerId] : { direction, x, y, playerId }
                },
            };
        }

        case 'SHOOT_REMOVE': {
            const { data: { playerId } } = action;
            const { shots } = state;
            const { [playerId]: removeShot, ...restShots } = shots;
            return {
                ...state,
                shots: restShots,
            };
        }

        default:
            return state;
    }
};

export default reducer;

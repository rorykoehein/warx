// @flow

import type { Player, Action, State } from './types';
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
            const { state: { players, currentPlayerId } } = action;
            return {
                ...state,
                players,
                currentPlayerId
            };
        }

        case 'PLAYER_JOINED': {
            const { player } = action;
            return {
                ...state,
                players: {
                    ...players,
                    [player.id]: player,
                }
            };
        }

        case 'PLAYER_LEFT': {
            const { id } = action;
            const { [id]: leftPlayer, ...restPlayers } = players;
            return {
                ...state,
                players: restPlayers,
            };
        }

        case 'MOVE': {
            const { direction, id } = action;
            const player = players[id];
            if(!player) return state;
            return {
                ...state,
                players: {
                    ...players,
                    [id]: move(player, direction),
                },
            };
        }
        default:
            return state;
    }
};

export default reducer;

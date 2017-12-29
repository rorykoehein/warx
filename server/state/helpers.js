// @flow

export const replacePlayerProps = (state, playerId, props) => {
    const { players, ...rest } = state;
    const player = players[playerId];
    if(!player) return state;
    return {
        ...rest,
        players: {
            ...players,
            [playerId]: {
                ...player,
                ...props,
            },
        },
    };
};

export const getRandomPosition = (size, step) => {
    const min = 0;
    return Math.floor(Math.random() * (size - min) / step) * step + min;
};
const getRandomPosition = (size, step) => {
    const min = 0;
    return Math.floor(Math.random() * (size - min) / step) * step + min;
};

export const spawn = ({ playerId, worldWidth, worldHeight, moveDistance }) => ({
    type: 'SPAWN',
    origin: 'server',
    sendToClient: true,
    toAll: true,
    data: {
        playerId,
        x: getRandomPosition(worldWidth, moveDistance),
        y: getRandomPosition(worldHeight, moveDistance),
    }
});

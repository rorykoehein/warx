import rules from './rules';

const getRandomPosition = (size, step) => {
    const min = 0;
    return Math.floor(Math.random() * (size - min) / step) * step + min;
};

export const spawn = ({ playerId }) => ({
    type: 'SPAWN',
    origin: 'server',
    sendToClient: true,
    toAll: true,
    data: {
        playerId,
        x: getRandomPosition(rules.worldWidth, rules.moveDistance),
        y: getRandomPosition(rules.worldHeight, rules.moveDistance),
    }
});

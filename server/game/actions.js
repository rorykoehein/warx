import rules from './rules';

const getRandomPosition = (ratio, step) => {
    const min = 0;
    const max = 100 * ratio;
    return Math.floor(Math.random() * (max - min) / step) * step + min;
};

export const spawn = ({ playerId }) => ({
    type: 'SPAWN',
    origin: 'server',
    sendToClient: true,
    toAll: true,
    data: {
        playerId,
        x: getRandomPosition(1, rules.moveDistance),
        y: getRandomPosition(rules.worldRatio, rules.moveDistance),
    }
});

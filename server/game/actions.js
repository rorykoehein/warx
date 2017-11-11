import rules from './rules';

const getRandomPosition = (step) => {
    const min = step;
    const max = 800;
    return Math.floor(Math.random() * (max - min) / step) * step + min;
};

export const spawn = ({ playerId }) => ({
    type: 'SPAWN',
    origin: 'server',
    sendToClient: true,
    toAll: true,
    data: {
        playerId,
        x: getRandomPosition(rules.moveDistance),
        y: getRandomPosition(rules.moveDistance),
    }
});

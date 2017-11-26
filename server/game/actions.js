import { PlayerId } from '../../client/src/types/game';
import { AddExplosionAction, RemoveExplosionAction } from '../../client/src/types/actions'; // todo move

const getRandomPosition = (size, step) => {
    const min = 0;
    return Math.floor(Math.random() * (size - min) / step) * step + min;
};

export const spawn = ({ playerId, worldWidth, worldHeight, moveDistance, playerName }) => ({
    type: 'SPAWN',
    origin: 'server',
    sendToClient: true,
    toAll: true,
    data: {
        playerId,
        x: getRandomPosition(worldWidth, moveDistance),
        y: getRandomPosition(worldHeight, moveDistance),
        playerName,
    }
});

export const addExplosion = (
    { id, x, y, size, causedBy }: { id: number, x: number, y: number, size: number, causedBy: PlayerId })
    : AddExplosionAction =>
({
    type: 'EXPLOSION_ADDED',
    origin: 'server',
    sendToClient: true,
    toAll: true,
    data: {
        id,
        x,
        y,
        size,
        causedBy,
    }
});

export const hit = ({ shooter, hits }) => ({
    type: 'HIT',
    origin: 'server', // todo fugly
    sendToClient: true, // todo fugly
    toAll: true, // todo fugly
    data: {
        shooter,
        hits
    },
});

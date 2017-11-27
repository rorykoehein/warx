
const socketIdPlayerIdMap = {};
const playerIdSocketIdMap = {};

export const getSocketId = (playerId) => playerIdSocketIdMap[playerId];
export const getPlayerId = (socketId) => socketIdPlayerIdMap[socketId];

export const setIds = (socketId, playerId) => {
    socketIdPlayerIdMap[socketId] = playerId;
    playerIdSocketIdMap[playerId] = socketId;
};

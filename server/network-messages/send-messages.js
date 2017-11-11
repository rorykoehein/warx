import io from './socket';

export const send = (id, eventName, data) => {
    const sockets = io.sockets.sockets;
    const socket = sockets[id];
    // send the current game state to the client when he logs in
    socket.emit(eventName, data);
};

export const broadcast = (id, eventName, data) => {
    const sockets = io.sockets.sockets;
    const socket = sockets[id];
    // send the current game state to the client when he logs in
    socket.broadcast.emit(eventName, data);
};

export const all = (eventName, data) => {
    io.emit(eventName, data);
};

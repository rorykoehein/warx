import { io } from './app';

export const send = (id, eventName, data) => {
    const sockets = io.sockets.sockets;
    const socket = sockets[id];
    console.log('io.sockets', id, io.sockets.sockets);
    // send the current game state to the client when he logs in
    socket.emit(eventName, data);
};

export const broadcast = (id, eventName, data) => {
    const sockets = io.sockets.sockets;
    const socket = sockets[id];
    // send the current game state to the client when he logs in
    socket.broadcast.emit(eventName, data);
};

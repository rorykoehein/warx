import io from './socket';
import { pack, packKey } from '../shared/pack-messages';
import { getSocketId } from "./socket-id-maps";

export const send = (id, eventName, data) => {
    const sockets = io.sockets.sockets;
    const socket = sockets[getSocketId(id)];
    // send the current game state to the client when he logs in
    if(socket) socket.emit(packKey(eventName), pack(data));
};

export const broadcast = (id, eventName, data) => {
    const sockets = io.sockets.sockets;
    const socket = sockets[getSocketId(id)];
    // send the current game state to the client when he logs in
    if(socket) socket.broadcast.emit(packKey(eventName), pack(data));
};

export const all = (eventName, data) => {
    io.emit(packKey(eventName), pack(data));
};

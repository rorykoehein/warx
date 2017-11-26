import io from 'socket.io-client';
import store from './state/store';
import { pack, unpack, packKey } from './pack-messages';

const address = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : null;
const socket = io(address);

socket.on(packKey('action'), (action) => {
    // listen to server actions and map them to redux actions
    store.dispatch({
        ...unpack(action),
        origin: 'server',
        sendToServer: false,
    });
});

export const sendAction = (data) => {
    socket.emit(packKey('action'), pack(data));
};
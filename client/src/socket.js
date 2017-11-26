import io from 'socket.io-client';
import store from './state/store';

const address = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : null;
const socket = io(address);

socket.on('action', (action) => {
    // listen to server actions and map them to redux actions
    store.dispatch({
        ...action,
        origin: 'server',
        sendToServer: false,
    });
});

export const sendAction = (data) => {
    socket.emit('action', data);
};
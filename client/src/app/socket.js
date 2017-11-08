import io from 'socket.io-client';
import store from './store';

const address = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : null;
const socket = io(address);

// todo use rxjs for socket communication

console.log('socket', socket);

socket.on('connect', (data) => {
    console.log('connect', socket.id);
});

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
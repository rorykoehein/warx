import io from 'socket.io-client';
import store from './store';

const socket = io('http://localhost:5000');

// todo use rxjs for socket communication

console.log('socket', socket);

socket.on('connect', (data) => {
    console.log('connect', socket.id);
});

socket.on('action', (action) => {
    console.log('action', action);
    store.dispatch(action);
});

export const sendAction = (data) => {
    socket.emit('action', data);
};
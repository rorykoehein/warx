import socket from 'socket.io';
import express from 'express';
import http from 'http';
import path from 'path';
import store from './store'; // the redux server store

// create a http and websocket server
const app = express();
const server = http.createServer(app);
const io = socket(server);
const port = process.env.PORT || 5000;

// serve static assets from ./public
app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

// listen to new client websocket connections, and then to actions sent by each client
io.on('connection', socket => {
    const playerId = socket.id;
    console.log('new socket connection', playerId);

    // tell the server store that we have a new connection
    store.dispatch({
        type: 'CONNECT',
        playerId: playerId,
    });

    const players = store.getState().players;

    // send the current game state to the client when he logs in
    socket.emit('action', {
        type: 'GAME_STATE_CHANGED',
        state: {
            players,
            currentPlayerId: playerId,
        },
    });

    // let the other cients know a new player has joined
    socket.broadcast.emit('action', {
        type: 'PLAYER_JOINED',
        player: players[playerId],
    });

    // listen to actions from the users and dispatch them on the store
    socket.on('action', ({ type, ...data }) => {
        console.log('action', type, data);
        store.dispatch({
            type,
            ...data,
            // always overwrite the player id with that of the connection, so the client can't just send any id
            id: playerId,
        });

        // broadcast action to all other users
        socket.broadcast.emit('action', { type, ...data });
    });

    // dispatch disconnect actions to the store to remove the disconnected player
    socket.on('disconnect', () => {
        store.dispatch({
            type: 'DISCONNECT',
            playerId,
        });

        // let all users know this player is now gone
        socket.broadcast.emit('action', {
            type: 'PLAYER_LEFT',
            id: playerId,
        });
    })
});

import socketio from 'socket.io';
import express from 'express';
import http from 'http';
import path from 'path';
import Rx from 'rxjs';
import store from './store'; // the redux server store

// create a http and websocket server
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 5000;

// serve static assets from ./public
app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

const messages = Rx.Observable.create(observer => {
    io.on('connection', socket => {
        const id = socket.id;
        // socket.emit('my socketId', {'socketId': socket.id, 'connectTime': Date.now()});
        observer.next({ id, socket, time: Date.now(), event: 'connect' });

        socket.on('action', (payload) => {
            observer.next({ id, socket, time: Date.now(), event: 'action', payload });
        });

        socket.on('disconnect', () => {
            observer.next({ id, socket, time: Date.now(), event: 'disconnect' });
        });
    });
});

// todo: see if we can move socket.emits to redux-observable, which responds to dispatched actions?

// respond to new connections
messages
    .filter(message => message.event === 'connect')
    .subscribe(({ id, socket }) => {
        const players = store.getState().players;

        // tell the server store that we have a new connection
        store.dispatch({
            type: 'CONNECT',
            origin: 'client',
            data: {
                playerId: id,
            },
        });

        // send the current game state to the client when he logs in
        socket.emit('action', {
            type: 'GAME_STATE_CHANGED',
            origin: 'server',
            data: {
                state: {
                    players,
                    currentPlayerId: id,
                },
            },
        });

        // let the other cients know a new player has joined
        socket.broadcast.emit('action', {
            type: 'PLAYER_JOINED',
            origin: 'server',
            data: {
                player: players[id],
            },
        });
    });

// listen to actions from the users and dispatch them on the store
messages
    .filter(message => message.event === 'action')
    .subscribe(({ id, socket, payload }) => {
        const { type, data } = payload;

        store.dispatch({
            type,
            origin: 'client',
            data: {
                ...data,
                // always overwrite the player id with that of the connection, so the client can't just send any id
                id,
            },
        });

        // broadcast action to all other users
        socket.broadcast.emit('action', {
            type,
            origin: 'server',
            data
        });
    });

// respond to disconnect events
messages
    .filter(message => message.event === 'disconnect')
    .subscribe(({ id, socket }) => {
        // dispatch disconnect actions to the store to remove the disconnected player
        socket.on('disconnect', () => {
            store.dispatch({
                type: 'DISCONNECT',
                origin: 'client',
                data: {
                    playerId: id,
                },
            });

            // let all users know this player is now gone
            socket.broadcast.emit('action', {
                type: 'PLAYER_LEFT',
                origin: 'server',
                data: {
                    id,
                },
            });
        })
    });

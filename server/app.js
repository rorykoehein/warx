import socketio from 'socket.io';
import express from 'express';
import path from 'path';
import getMessages from './socket/get-messages';
import mapMessagesToActions from './map-messages-to-actions';

// create the express app and socket io server, export them so we can use them in bin/www
const app = express();
export const io = socketio();
export default app;

const messages = getMessages(io, app); // get messages from io as an observables
mapMessagesToActions(messages);

// serve static assets from ./public
app.use(express.static(path.join(__dirname, 'public')));

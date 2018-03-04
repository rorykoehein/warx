import 'babel-polyfill';
import http from 'http';
import app  from '../app/app';
import socket  from '../network-messages/socket'; // we must bypass the app layer to connect to socket to the http here

const port = process.env.PORT || 5000;
const server = http.createServer(app);
socket.attach(server);
server.listen(port);

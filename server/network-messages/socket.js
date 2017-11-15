import socketio from 'socket.io';
// setup socket.io, this should only be used within network-messages (to translate messages to observables) and in
// bin/www/index (to attach socket.io to the http server)
const io = socketio();
export default io;
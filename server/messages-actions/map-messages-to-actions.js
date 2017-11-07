import store from '../game/store'; // the redux server store

// socket.io default
const eventActionMap = {
    connect: 'CONNECT',
    disconnect: 'DISCONNECT',
};

export default (messages) => {
    // respond to new connections
    messages
        .subscribe(({ id, event, payload = {} }) => {
            const { type, data = {} } = payload;
            // the 'type' in case the event is 'action', else try to get the action from the map
            const action = event === 'action' ? type : eventActionMap[event];
            if(action) {
                store.dispatch({
                    type: action,
                    origin: 'client',
                    sendToClient: false, // don't send any incoming messages to clients
                    data: {
                        ...data,
                        // overwrite the player id with that of the connection, so the client can't just send any id
                        playerId: id,
                    },
                });
            }
        });
}

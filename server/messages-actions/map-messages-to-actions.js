import store from '../state/store'; // the redux server store

// socket.io default
const eventActionMap = {
    connect: 'CONNECTION_REQUESTED',
    disconnect: 'DISCONNECTION_REQUESTED',
};

const allowedActions = {
    PING: 1,
    PING_LATENCY: 1,
    DISCONNECTION_REQUESTED: 1,
    CONNECTION_REQUESTED: 1,
    JOIN_REQUESTED: 1,
    MOVE_START_REQUESTED: 1,
    MOVE_STOP_REQUESTED: 1,
    SHOT_REQUESTED: 1,
    PLAYER_SIGN_OUT_REQUEST: 1,
};

export default (messages) => {
    // respond to new connections
    messages
        .subscribe(({ id, event, payload = {} }) => {
            const { type, data = {} } = payload;
            // the 'type' in case the event is 'action', else try to get the action from the map
            const action = event === 'action' ? type : eventActionMap[event];

            if(!allowedActions[action]){
                // todo: record cheat action?
                console.log('not allowed:', action);
                return;
            }

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

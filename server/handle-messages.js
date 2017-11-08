import store from './store'; // the redux server store
import { broadcast } from './send-messages'; // todo move to epics/network

export default (messages) => {
    // respond to new connections
    messages
        .filter(message => message.event === 'connect')
        .subscribe(({ id }) => {
            // tell the server store that we have a new connection
            store.dispatch({
                type: 'CONNECT',
                origin: 'client',
                data: {
                    playerId: id,
                },
            });
        });

    // listen to actions from the users and dispatch them on the store
    messages
        .filter(message => message.event === 'action')
        .subscribe(({ id, payload }) => {
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

            // todo: this should be moved to epics/network which listens to actions and responds by emitting

            // broadcast action to all other users
            broadcast(id, 'action', {
                type,
                origin: 'server',
                data
            });
        });

    // respond to disconnect events
    messages
        .filter(message => message.event === 'disconnect')
        .subscribe(({ id }) => {
            // dispatch disconnect actions to the store to remove the disconnected player
            store.dispatch({
                type: 'DISCONNECT',
                origin: 'client',
                data: {
                    playerId: id,
                },
            });
        });
}

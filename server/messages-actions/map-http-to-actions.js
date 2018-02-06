// @flow

import store from '../state/store'; // the redux server store
import {
    createHubRegistrationReceived, createServerCheckReceived, getCurrentServer
} from '../state/module-servers';

// servers will call the central hub to register themselves
// the central hub will call a /check on the server to get the server details
// after each check the server will re-register themselves with the hub

const getEnv = () => ({
    hub: process.env.HUB,
    address: process.env.ADDRESS,
});

export default (app, env = getEnv()) => {
    // this is where each server will register itself to
    const hub = env.hub; // todo set default HUB
    const isHub = env.hub === env.address;
    if(!hub) return;

    if(isHub) {
        // other servers can register to hubs by calling this
        app.post('/register', (req, res) => {
            const { servers } = store.getState();
            res.json({ servers });

            store.dispatch(createHubRegistrationReceived({
                address: req.body.address,
            }));
        });
    } else {
        // the central hub will check on servers by calling this
        app.get('/check', (req, res) => {
            const state = store.getState();
            const { players, location, name, address } = getCurrentServer(state);
            console.log('check back', { players, location, name, address });
            res.json({ players, location, name, address });

            store.dispatch(createServerCheckReceived({
                time: Number(Date.now()),
            }));
        });
    }

};

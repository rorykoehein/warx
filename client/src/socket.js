// @flow

import io from 'socket.io-client';
import { pack, unpack, packKey } from './shared/pack-messages';

const env = process.env;
// if this env var is undefined, io will connect to the existing http address
const address = env.REACT_APP_DEV_SOCKET_ADDRESS;
const socket = io(address, /*{ transports: ['polling']}*/);

export const onNetworkAction = (callback: Function) => {
    socket.on(packKey('action'), (action) => callback(unpack(action)));
};

export const sendAction = (data: any) => {
    socket.emit(packKey('action'), pack(data));
};

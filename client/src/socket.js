// @flow

import io from 'socket.io-client';
import { pack, unpack, packKey } from './shared/pack-messages';

const address = process.env.REACT_APP_SOCKET_ADDRESS || undefined;
const socket = io(address, /*{ transports: ['polling']}*/);

export const onNetworkAction = (callback: Function) => {
    socket.on(packKey('action'), (action) => callback(unpack(action)));
};

export const sendAction = (data: any) => {
    socket.emit(packKey('action'), pack(data));
};

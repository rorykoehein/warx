import Rx from 'rxjs';
import { packKey, unpack } from '../../client/src/shared/pack-messages';
import generateId from './generate-id';
import { setIds } from './socket-id-maps';

// map socket.io messages to an observable
export default (io) => {
    return Rx.Observable.create(observer => {
        io.on('connection', socket => {
            const socketId = socket.id;
            const id = generateId();
            setIds(socketId, id);

            observer.next({ id, time: Date.now(), event: 'connect' });

            socket.on(packKey('action'), (payload) => {
                observer.next({ id, time: Date.now(), event: 'action', payload: unpack(payload) });
            });

            socket.on('disconnect', () => {
                observer.next({ id, time: Date.now(), event: 'disconnect' });
            });
        });
    });
}

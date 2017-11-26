import Rx from 'rxjs';
import { packKey, unpackKey, unpack } from '../../client/src/pack-messages';

// map socket.io messages to an observable
export default (io) => {
    return Rx.Observable.create(observer => {
        io.on('connection', socket => {
            const id = socket.id;
            observer.next({ id, time: Date.now(), event: 'connect' });

            socket.on(packKey('action'), (payload) => {
                console.log('unpack(payload)', unpack(payload));

                observer.next({ id, time: Date.now(), event: 'action', payload: unpack(payload) });
            });

            socket.on('disconnect', () => {
                observer.next({ id, time: Date.now(), event: 'disconnect' });
            });
        });
    });
}

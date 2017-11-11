import Rx from 'rxjs';

// map socket.io messages to an observable
export default (io) => {
    return Rx.Observable.create(observer => {
        io.on('connection', socket => {
            const id = socket.id;
            observer.next({ id, time: Date.now(), event: 'connect' });

            socket.on('action', (payload) => {
                observer.next({ id, time: Date.now(), event: 'action', payload });
            });

            socket.on('disconnect', () => {
                observer.next({ id, time: Date.now(), event: 'disconnect' });
            });
        });
    });
}

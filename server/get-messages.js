import Rx from 'rxjs';

export default (io) => {
    return Rx.Observable.create(observer => {
        io.on('connection', socket => {
            const id = socket.id;
            // socket.emit('my socketId', {'socketId': socket.id, 'connectTime': Date.now()});
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

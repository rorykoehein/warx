import 'rxjs';
import { Observable } from 'rxjs/Observable';
import type { Store } from '../../client/src/types/framework';
import type { Player, Direction } from '../../client/src/types/game';

const moveInterval = Observable.interval(32);

export const movePlayer = (player: Player, direction: Direction, step: number): Player => ({
    ...player,
    direction,
    x: direction === 'left' ? player.x - step : direction === 'right' ? player.x + step : player.x,
    y: direction === 'up' ? player.y - step : direction === 'down' ? player.y + step : player.y,
});

const canMove = (player: Player, direction: Direction, rules): Boolean => {
    const { moveDistance, worldWidth, worldHeight } = rules;
    const { x, y } = player;
    return (direction === 'left' && x - moveDistance >= 0) ||
        (direction === 'right' && x + moveDistance < worldWidth) ||
        (direction === 'up' && y - moveDistance >= 0) ||
        (direction === 'down' && y + moveDistance < worldHeight);
};

export const moves = (action$, store: Store) => action$
    .ofType('MOVE_STARTED')
    .switchMap(({ data: { direction, playerId } }) => {
        let m = 0;
        return moveInterval
            .map(() => {
                const { rules, players } = store.getState();
                const player = players[playerId]; // todo use selector function for getting players?
                m++;
                console.log('mmmmm', m);
                return canMove(player, direction, rules) ? {
                    type: 'MOVE',
                    origin: 'server', // todo fugly
                    sendToClient: false, // todo fugly
                    toAll: false, // todo fugly
                    data: {
                        playerId,
                        direction
                    },
                } : {
                    type: 'MOVE_STOPPED',
                    origin: 'server', // todo fugly
                    sendToClient: true, // todo fugly
                    toAll: true, // todo fugly
                    data: {
                        playerId,
                        direction,
                        x: player.x,
                        y: player.y,
                    },
                };
            })
            .takeUntil(action$
                .filter(({ type, data: { direction: stopDirection, playerId: stopPlayerId } }) =>
                    type === 'MOVE_STOPPED' &&
                    stopDirection === direction && playerId === stopPlayerId
                )
            )
    });

export const moveStarts = (action$, store: Store) => action$
    .ofType('MOVE_START_REQUESTED')
    .map(({ data: { direction, playerId }}) => {
        return {
            type: 'MOVE_STARTED',
            origin: 'server', // todo fugly
            sendToClient: true, // todo fugly
            toAll: true, // todo fugly
            data: {
                playerId,
                direction
            },
        };
    });


export const moveStops = (action$, store: Store) => action$
    .ofType('MOVE_STOP_REQUESTED')
    .map(({ data: { direction, playerId }}) => {
        const { players } = store.getState();
        const player = players[playerId]; // todo use selector function for getting players?
        return {
            type: 'MOVE_STOPPED',
            origin: 'server', // todo fugly
            sendToClient: true, // todo fugly
            toAll: true, // todo fugly
            data: {
                playerId,
                direction,
                x: player.x,
                y: player.y,
            },
        };
    });


export const moveSyncs = (action$, store: Store) => action$
    .ofType('MOVE')
    .groupBy(payload => payload.data.playerId)
    .flatMap(group => group
        .throttleTime(500)
        .map(({ data: { playerId }}) => {
            const player = store.getState().players[playerId];
            return {
                data: {
                    playerId,
                    x: player.x,
                    y: player.y,
                },
                type: 'MOVE_SYNC',
                origin: 'server',
                sendToClient: true,
                toAll: true, // todo fugly
            };
        })
    );

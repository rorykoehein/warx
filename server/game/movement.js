import 'rxjs';
import loop from '../../client/src/loop';
import type { Store } from '../../client/src/types/framework';
import { canMove } from '../../client/src/state/move-helpers';

export const moves = (action$, store: Store) => action$
    .ofType('MOVE_STARTED')
    .switchMap(({ data: { direction, playerId } }) => {
        return loop
            .map(() => Number(Date.now()))
            .filter(time => {
                const { rules, players } = store.getState();
                const player = players[playerId]; // todo use selector function for getting players?
                return player && canMove(player, direction, rules, time);
            })
            .map(() => {
                return {
                    type: 'MOVE',
                    origin: 'server', // todo fugly
                    sendToClient: false, // todo fugly
                    toAll: false, // todo fugly
                    data: {
                        playerId,
                        direction,
                        time: Number(new Date()),
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

// todo: or just loop every 1000ms and send all the player x/y which have moved since the last iteration using lastMove
export const moveSyncs = (action$, store: Store) => action$
    .ofType('MOVE')
    .groupBy(payload => payload.data.playerId)
    .flatMap(group => group
        .throttleTime(1000)
        .map(({ data: { playerId }}) => store.getState().players[playerId])
        .delay(32) // todo: delay with the ping time? send old state to all clients?
        .map(player => {
            return {
                data: {
                    playerId: player.id,
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

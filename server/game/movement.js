import 'rxjs';
import { Observable } from 'rxjs/Observable';
import loop from '../../client/src/shared/loop';
import type { Store } from '../../client/src/types/framework';
import { canMove, calculateMovement } from '../../client/src/state/move-helpers';

export const moves = (action$, store: Store) => action$
    .ofType('MOVE_STARTED')
    .switchMap(({ data: { direction, playerId } }) => {
        const startTime = Number(Date.now());
        const player = store.getState().players[playerId];
        const { x: startX, y: startY } = player;
        let i = 0;
        return loop
            .filter(time => {
                const { rules, players } = store.getState();
                const player = players[playerId]; // todo use selector function for getting players?
                return player && canMove(player, direction, rules, time);
            })
            .map(() => {
                const endTime = Number(Date.now());
                const rules = store.getState().rules;
                const { x, y } = calculateMovement(startX, startY, startTime, endTime, rules, direction);
                i++;
                return {
                    type: 'MOVE_TO',
                    sendToClient: false, // todo fugly
                    toAll: false, // todo fugly
                    data: {
                        direction,
                        playerId,
                        x,
                        y,
                        step: i
                    }
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
        const { players } = store.getState();
        const player = players[playerId]; // todo use selector function for getting players?
        return {
            type: 'MOVE_STARTED',
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
    .ofType('MOVE_TO')
    .groupBy(payload => payload.data.playerId)
    .flatMap(group => group
        .throttleTime(50)
        // .map(({ data: { playerId }}) => store.getState().players[playerId])
        // .delayWhen(({ latency = 50 }) => Observable.timer(latency/2)) // todo: delay with the ping time? send old state to all clients?
        .map(payload => {
            const { direction,
                playerId,
                x,
                y,
                step } = payload.data;
            // console.log('latency/2', player.latency/2);
            return {
                data: {
                    direction,
                    playerId,
                    x,
                    y,
                    step,
                },
                type: 'MOVE_SYNC',
                origin: 'server',
                sendToClient: true,
                toAll: true, // todo fugly
            };
        })
    );

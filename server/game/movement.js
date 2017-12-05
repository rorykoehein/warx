import 'rxjs';
import loop from '../../client/src/shared/loop';
import type { Store } from '../../client/src/types/framework';
import { canMove, calculateMovement } from './move-helpers';

export const moves = (action$, store: Store) => action$
    .ofType('MOVE_STARTED')
    .switchMap(({ data: { direction, playerId } }) => {
        const startTime = Number(Date.now());
        const player = store.getState().players[playerId];
        const { x: startX, y: startY } = player;
        return loop
            .map(() => {
                const { rules, players } = store.getState();
                const player = players[playerId]; // todo use selector function for getting players?
                const endTime = Number(Date.now());
                const { x, y } = calculateMovement(startX, startY, startTime, endTime, rules, direction);
                return canMove(player, direction, rules) ? {
                    type: 'MOVE_TO',
                    sendToClient: false,
                    toAll: false,
                    data: {
                        direction,
                        playerId,
                        x,
                        y,
                    }
                } : {
                    type: 'MOVE_STOPPED',
                    origin: 'server',
                    sendToClient: true,
                    toAll: true,
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
        .throttleTime(store.getState().rules.syncTime)
        .map(payload => {
            const { direction, playerId, x, y, step } = payload.data;
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
                toAll: true,
            };
        })
    );

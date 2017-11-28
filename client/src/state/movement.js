import 'rxjs';
import loop from '../loop';
import type { Store } from '../types/framework';
import { sendAction } from '../socket';
import { selfMoveStart, selfMoveStop, selfShotFire, moveStartToServer, moveStopToServer, move } from './actions';
import { canMove } from "./move-helpers";

export const keyDownActionMap = {
    ArrowLeft: () => selfMoveStart({ direction: 'left' }),
    ArrowUp: () => selfMoveStart({ direction: 'up' }),
    ArrowRight: () => selfMoveStart({ direction: 'right' }),
    ArrowDown: () => selfMoveStart({ direction: 'down' }),
    ' ': () => selfShotFire(), // todo: move to shot-epics.js
};

export const keyDownMoves = (action$) => action$
    .ofType('KEY_DOWN')
    .filter(({ data: { key } }) => keyDownActionMap[key])
    .map(({ data: { key: downKey } }) => keyDownActionMap[downKey]());

export const keyUpActionMap = {
    ArrowLeft: () => selfMoveStop({ direction: 'left' }),
    ArrowUp: () => selfMoveStop({ direction: 'up' }),
    ArrowRight: () => selfMoveStop({ direction: 'right' }),
    ArrowDown: () => selfMoveStop({ direction: 'down' }),
};

export const keyUpMoves = (action$) => action$
    .ofType('KEY_UP')
    .filter(({ data: { key } }) => keyUpActionMap[key])
    .map(({ data: { key: downKey } }) => keyUpActionMap[downKey]());

export const selfStartMoves = (action$) => action$
    .ofType('SELF_MOVE_STARTED')
    .do(({ data: { direction }}) => sendAction(moveStartToServer({ direction })))
    .ignoreElements();

export const selfStopMoves = (action$) => action$
    .ofType('SELF_MOVE_STOPPED')
    .do(({ data: { direction }}) => sendAction(moveStopToServer({ direction })))
    .ignoreElements();

export const moveStarts = (action$, store: Store) => action$
    .ofType('MOVE_STARTED')
    .switchMap(({ data: { direction, playerId } }) => {
        return loop
            .map(() => Number(Date.now()))
            .filter(time => {
                const { rules, players } = store.getState();
                const player = players[playerId]; // todo use selector function for getting players?
                // todo: the client only rejects moves, but doesn't correct it's own x/y if it's too little, maybe
                // calculate here if the x/y is still correct from start time until this moment and correct the move
                return player && canMove(player, direction, rules, time);
            })
            .map(time => move({ direction, playerId, time }))
            .takeUntil(
                action$
                    .ofType('MOVE_STOPPED')
                    .filter(({ type, data: { direction: stopDirection, playerId: stopPlayerId } }) =>
                        stopDirection === direction && playerId === stopPlayerId
                    )
            );

    });

import 'rxjs';
import { Observable } from 'rxjs/Observable';
import type { Store } from '../types/framework';
import type { Player, Direction } from '../types/game';
import { sendAction } from '../socket';
import { selfMoveStart, selfMoveStop, selfShotFire, moveStartToServer, moveStopToServer, move } from './actions';

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
        return moveInterval
            .filter(() => {
                const { rules, players } = store.getState();
                const player = players[playerId]; // todo use selector function for getting players?
                return canMove(player, direction, rules);
            })
            .map(() => move({ direction, playerId }))
            .takeUntil(
                action$.filter(({ type, data: { direction: stopDirection, playerId: stopPlayerId } }) =>
                    type === 'MOVE_STOPPED' &&
                    stopDirection === direction && playerId === stopPlayerId
                )
            );

    });

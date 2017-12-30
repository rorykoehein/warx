// @flow

import { reducer } from '../module-game';

describe('module-game', () => {
    describe('reducer', () => {
        it('should handle CONNECTION_REQUESTED', () => {
            const resultState = reducer({
                players: {},
                rules: {},
            }, {
                type: 'CONNECTION_REQUESTED',
                origin: 'client',
                data: {
                    playerId: '1',
                }
            });

            expect(resultState).toEqual({
                rules: {},
                players: {
                    '1': {
                        id: '1',
                        name: `Player 1`,
                        alive: false,
                        frags: 0,
                        deaths: 0,
                    },
                }
            });
        });
    });
});
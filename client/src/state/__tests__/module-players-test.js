// @flow

import { reducer } from '../module-players';
import type { Player } from '../../types/game';

describe('module-movement', () => {
    describe('reducer', () => {
        const playerZero: Player = {
            id: '0',
            name: 'dummy',
            alive: false,
            frags: 0,
            deaths: 0,
            x: 10,
            y: 20,
            direction: 'right',
            isMoving: false,
            weaponLoaded: true,
        };

        const playerOne: Player = {
            id: '1',
            name: 'test',
            alive: false,
            frags: 0,
            deaths: 0,
            x: 10,
            y: 20,
            direction: 'right',
            isMoving: false,
            weaponLoaded: true,
        };

        it('should handle the current PLAYER_JOINED', () => {
            const resultState = reducer({
                currentPlayerId: '1',
                players: {
                    '0': playerZero,
                },
                isSignedIn: false,
            }, {
                type: 'PLAYER_JOINED',
                origin: 'server',
                data: { player: playerOne }
            });

            expect(resultState).toEqual({
                isSignedIn: true,
                currentPlayerId: '1',
                players: {
                    '0': playerZero,
                    '1': playerOne,
                }
            });
        });

        it('should handle another PLAYER_JOINED', () => {
            const resultState = reducer({
                currentPlayerId: '0',
                players: {
                    '0': playerZero,
                },
                isSignedIn: true,
            }, {
                type: 'PLAYER_JOINED',
                origin: 'server',
                data: { player: playerOne }
            });

            expect(resultState).toEqual({
                isSignedIn: true,
                currentPlayerId: '0',
                players: {
                    '0': playerZero,
                    '1': playerOne
                }
            });
        });


        it('should handle PLAYER_LEFT', () => {
            const resultState = reducer({
                isSignedIn: true,
                currentPlayerId: '0',
                players: {
                    '0': playerZero,
                    '1': playerOne,
                }
            }, {
                type: 'PLAYER_LEFT',
                origin: 'server',
                data: { playerId: '1' }
            });

            expect(resultState).toEqual({
                isSignedIn: true,
                currentPlayerId: '0',
                players: {
                    '0': playerZero,
                }
            });
        });
    });
});
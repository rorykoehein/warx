import { reducer } from '../module-players';
import type { PlayerJoinAction } from '../module-players';

describe('module-movement', () => {
    describe('reducer', () => {
        describe('reducer', () => {
            const dummyPlayer = {
                id: 0,
                name: 'dummy',
            };

            const player = {
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

            it('should handle PLAYER_JOINED on empty state', () => {
                const resultState = reducer({
                    currentPlayerId: 1,
                }, {
                    type: 'PLAYER_JOINED',
                    origin: 'server',
                    data: { player }
                });

                expect(resultState).toEqual({
                    isSignedIn: false,
                    currentPlayerId: 1,
                    players: {
                        1: player
                    }
                });
            });

            it('should handle PLAYER_JOINED on existing state', () => {
                const resultState = reducer({
                    isSignedIn: true,
                    players: {
                        0: dummyPlayer
                    }
                }, {
                    type: 'PLAYER_JOINED',
                    origin: 'server',
                    data: { player }
                });

                expect(resultState).toEqual({
                    isSignedIn: true,
                    players: {
                        0: dummyPlayer,
                        1: player
                    }
                });
            });


            it('should handle PLAYER_LEFT', () => {
                const resultState = reducer({
                    isSignedIn: true,
                    players: {
                        0: dummyPlayer,
                        1: player,
                    }
                }, {
                    type: 'PLAYER_LEFT',
                    origin: 'server',
                    data: { playerId: '1' }
                });

                expect(resultState).toEqual({
                    isSignedIn: true,
                    players: {
                        0: dummyPlayer,
                    }
                });
            });
        });
    });
});
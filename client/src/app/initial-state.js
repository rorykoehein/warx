import type { State } from './types/game';

const initialState: State = {
    players: {},
    currentPlayerId: null,
    explosions: {
        bla: {
            x: 40,
            y: 40,
            size: 1,
        }
    },
    rules: {},
    shots: [],
    latency: null,
    messages: {},
    isSignedIn: false,
};

export default initialState;

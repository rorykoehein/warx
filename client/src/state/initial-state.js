import type { State } from '../types/game';

const initialState: State = {
    players: {},
    currentPlayerId: null,
    explosions: {},
    rules: {},
    shots: [],
    latency: null,
    messages: {},
    isSignedIn: false,
    isScoreboardVisible: false,
};

export default initialState;

import type { State } from '../types/game';

// todo: find solution for modularized initial state
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

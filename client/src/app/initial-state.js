import type { State } from './types/game';

const initialState: State = {
    players: {},
    currentPlayerId: null,
    rules: {},
    shots: [],
    latency: null,
    messages: {},
    isSignedIn: false,
};

export default initialState;

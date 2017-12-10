// @flow


// local types

// type Action = PlayerJoinAction | PlayerLeftAction | PlayerUpdatedAction | SpawnAction;

// reducer
export const reducer = (state: State, action: Action): State => {
    const { players, currentPlayerId } = state;
    switch (action.type) {


        default:
            return state;
    }
};

// selectors

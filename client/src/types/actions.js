// @flow
export type ActionOrigin = 'server' | 'client' | 'all';

// todo figure out subtypes or interfaces for this
export type ActionInterface = {
    +type: string,
    +origin?: ActionOrigin,
    +sendToServer?: boolean,
    +data?: any,
}

export type ReduxInitAction = {
    +type: '@@INIT',
    +origin: 'client',
};

export type Action = ReduxInitAction;

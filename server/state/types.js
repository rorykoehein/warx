export type ActionOrigin = 'server' | 'client' | 'all';

export type State = {

};

export type ActionInterface = {
    +type: string,
    +origin?: ActionOrigin,
    +data?: any,
}
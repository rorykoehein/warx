export type ActionOrigin = 'server' | 'client' | 'all';

export type ActionInterface = {
    +type: string,
    +origin?: ActionOrigin,
    +data?: any,
}
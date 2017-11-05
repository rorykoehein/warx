// @flow

export type PlayerId = string;

export type Direction = 'up' | 'right' | 'down' | 'left';

export type Player = {
    +id: PlayerId,
    +name: string,
    +x: number,
    +y: number,
    +direction: Direction,
}

export type Players = {
    +[id: PlayerId]: Player
};

export type State = {
    +players: Players,
    +currentPlayerId?: PlayerId,
};
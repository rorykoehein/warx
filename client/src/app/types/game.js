// @flow

export type PlayerId = string;

export type Direction = 'up' | 'right' | 'down' | 'left';

export type Player = {
    +id: PlayerId,
    +name: string,
    +x: number,
    +y: number,
    +direction: Direction,
    +alive: boolean,
    +weaponLoaded: boolean,
}

export type Shot = {
    +playerId: PlayerId,
    +x: number,
    +y: number,
    +direction: Direction,
}

export type Shots = {
    +[playerId: PlayerId]: Shot
};

export type Players = {
    +[id: PlayerId]: Player
};

export type Rules = {
    reloadTime: number, // time to reload the weapon after shooting
    coolTime: number, // time the shot stays visible
    moveTime: number,
    moveDistance: number, // px
    worldWidth: number,
    worldHeight: number,
    playerSize: number, //
};

export type MessagesType = {
    +[number]: string,
}

export type State = {
    +players: Players,
    +rules: Rules,
    +shots: Shots,
    +currentPlayerId: PlayerId,
    +latency: number,
    +messages: MessagesType,
};
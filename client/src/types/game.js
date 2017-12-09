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
    +frags: number,
    +deaths: number,
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

export type PlayerList = Array<Player>;

export type Rules = {
    +reloadTime: number, // time to reload the weapon after shooting
    +coolTime: number, // time the shot stays visible
    +moveTime: number,
    +moveDistance: number, // px
    +worldWidth: number,
    +worldHeight: number,
    +playerSize: number, //
};

export type MessagesType = {
    +[id: string]: string,
}

export type MessageList = Array<{
    +id: string,
    +text: string,
}>;

export type Explosion = {
    +x: number,
    +y: number,
    +size: number,
    +id: string,
};

export type ExplosionsType = {
    +[id: string]: Explosion,
}

export type State = {
    +rules: ?Rules,
    +latency: ?number,
    +currentPlayerId: ?PlayerId,
    +isSignedIn: boolean,
    +players: Players,
    +shots: Shots,
    +messages: MessagesType,
    +explosions: ExplosionsType,
    +isScoreboardVisible: boolean,
};

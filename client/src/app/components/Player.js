// @flow

import React, { PureComponent } from 'react';
import PlayerSprite from '../../lib/styled/PlayerSprite';
import type { Direction } from '../types/game';

type Props = {
    x: number,
    y: number,
    direction: Direction,
};

const getRotation = (d) =>
    d === 'up' ? 0 :
        d === 'right' ? 90 :
            d === 'down' ? 180 : 270;

class Player extends PureComponent<Props> {
    render() {
        const { x, y, direction } = this.props;
        const style = {
            transform: `translate(${x}px, ${y}px) rotate(${getRotation(direction)}deg)`
        };
        return <PlayerSprite style={style} />;
    }
}

export default Player;
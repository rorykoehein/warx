// @flow

import React, { PureComponent } from 'react';
import ShotSprite from '../../lib/styled/ShotSprite';
import type { Direction } from '../types/game';

type Props = {
    x: number,
    y: number,
    direction: Direction,
};

const getRotation = (d) =>
    d === 'up' ? 180 :
        d === 'right' ? 270 :
            d === 'down' ? 0 : 90;

class Shot extends PureComponent<Props> {
    render() {
        const { x, y, direction } = this.props;
        const style = {
            transform: `translate(${x}px, ${y}px) rotate(${getRotation(direction)}deg)`
        };
        return <ShotSprite style={style} />;
    }
}

export default Shot;
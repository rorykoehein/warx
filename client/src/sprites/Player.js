// @flow

import React, { PureComponent } from 'react';
import { Transition } from 'react-transition-group';
import PlayerSprite from './PlayerSprite';
import type { Direction } from '../types/game';
import styles from './styles';

type Props = {
    x: number,
    y: number,
    size: number,
    direction: Direction,
    isCurrent: boolean,
};

const getRotation = (d) =>
    d === 'up' ? 0 :
        d === 'right' ? 90 :
            d === 'down' ? 180 : 270;

const time = 500;
const maxOpacity = '1';
const opacityStyles = { entering: '0', entered: maxOpacity, exiting: '0', exited: '0', none: maxOpacity, };

const transformStyles = {
    entering: `scale(10)`,
    entered: `scale(1)`,
    exiting: `scale(1)`,
    exited: `scale(0)`,
    none: ``,
};

const getStyles = ({ x, y, direction, state, hasEntered, size }) => ({
    transition: hasEntered ? 'transform .1s ease, opacity 1s ease' : 'transform 1s ease, opacity 1s ease',
    opacity: opacityStyles[state],
    transform: `translate(${x - size/2}px, ${y - size/2}px) rotate(${getRotation(direction)}deg) ${transformStyles[state]}`,
});

class Player extends PureComponent<Props> {

    hasEntered = true;

    render() {
        const { x, y, direction, size, isCurrent, ...rest } = this.props;
        // todo styles should be in the style layer
        return (
            <Transition timeout={time} {...rest}>
                {state => {
                    const hasEntered = this.hasEntered;
                    this.hasEntered = state === 'entered';
                    return (
                        <PlayerSprite
                            size={size}
                            isCurrent={isCurrent}
                            style={getStyles({ x, y, direction, state, hasEntered, size })}
                        />
                    );
                }}
            </Transition>
        );
    }
}

export default Player;
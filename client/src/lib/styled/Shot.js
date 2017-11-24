// @flow

import React, { PureComponent } from 'react';
import { Transition } from 'react-transition-group';
import ShotSprite from '../../lib/styled/ShotSprite';
import { transparentize } from 'polished';
import styles from './styles';
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

const duration = 60;

const transformStyles = {
    entering: 'scaleY(0)',
    entered: 'scaleY(1)',
    exiting: 'scaleY(1)',
    exited: 'scaleY(1)',
    none: 'scaleY(1)',
};

const opacityStyles = {
    entering: '0',
    entered: '1',
    exiting: '1',
    exited: '0',
    none: '1',
};


const getStyles = ({ x, y, size, duration, direction, state }) => ({
    position: 'absolute',
    background: transparentize(0.25, styles.shotRed),
    width: `${size}rem`,
    height: '200%',
    transformOrigin: `${size/2}rem ${size/2}rem`,
    transition: `transform ${duration}ms ease-in, opacity ${duration}ms ease-in`,
    opacity: opacityStyles[state],
    transform: `translate(${x}px, ${y}px) rotate(${getRotation(direction)}deg)`, //  ${transformStyles[state]}
});

class Shot extends PureComponent<Props> {
    render() {
        const { x, y, direction, size, ...rest } = this.props;
        return (
            <Transition timeout={duration} {...rest}>
                {state => {
                    return (
                        <ShotSprite
                            duration={duration}
                            style={getStyles({
                                x: x,
                                y: y,
                                size: size,
                                duration,
                                direction,
                                state
                            })}
                        />
                    );
                }}
            </Transition>
        );
    }
}

export default Shot;
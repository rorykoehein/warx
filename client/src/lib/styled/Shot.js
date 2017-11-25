// @flow

import React, { PureComponent } from 'react';
import { Transition } from 'react-transition-group';
import { transparentize } from 'polished';
import styles from './styles';
import type { Direction } from '../../app/types/game';

type Props = {
    x: number,
    y: number,
    size: number,
    direction: Direction,
};

const getRotation = d =>
    d === 'up' ? 180 :
        d === 'right' ? 270 :
            d === 'down' ? 0 : 90;

const time = 250;
const maxOpacity = .75;
const opacityStyles = { entering: maxOpacity, entered: maxOpacity, exiting: '0', exited: '0', none: maxOpacity, };
const transitions = { entering: ``, entered: ``, exiting: `opacity ${time}ms ease-out`, exited: ``, none: ``, };

const getStyles = ({ x, y, size, duration, direction, state }) => ({
    position: 'absolute',
    background: transparentize(0.25, styles.shotRed),
    width: `${size}px`,
    height: '200%',
    transformOrigin: `${size/2}px ${size/2}px`,
    transition: transitions[state],
    opacity: opacityStyles[state],
    transform: `translate(${x}px, ${y}px) rotate(${getRotation(direction)}deg)`, //  ${transformStyles[state]}
});

class Shot extends PureComponent<Props> {
    render() {
        const { x, y, direction, size, ...rest } = this.props;
        return (
            <Transition timeout={time} {...rest}>
                {state => (
                    <div
                        style={getStyles({
                            x: x,
                            y: y,
                            size: size,
                            time,
                            direction,
                            state
                        })}
                    />
                )}
            </Transition>
        );
    }
}

export default Shot;
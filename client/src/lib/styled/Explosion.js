// @flow

import React, { PureComponent } from 'react';
import { Transition } from 'react-transition-group';

type Props = {
    x: number,
    y: number,
    size: number,
};

const time = 500;
const opacityStyles = { entering: '1', entered: '1', exiting: '0', exited: '0', none: '1', };

const transformStyles = {
    entering: `scale(0)`,
    entered: `scale(15)`,
    exiting: `scale(15)`,
    exited: `scale(15)`,
    none: ``,
};

const getStyles = ({ x, y, direction, size, state }) => ({
    position: 'absolute',
    transition: `transform ${time/4}ms ease, opacity ${time}ms ease-out`,
    opacity: opacityStyles[state],
    borderRadius: '50%',
    background: 'white',
    width: `${size}px`,
    height: `${size}px`,
    transform: `translate(${x}px, ${y}px) ${transformStyles[state]}`,
});

class Explosion extends PureComponent<Props> {

    render() {
        const { x, y, size, ...rest } = this.props;
        // todo styles should be in the style layer
        return (
            <Transition timeout={time} {...rest}>
                {state => {
                    return (
                        <div
                            style={getStyles({x, y, size, state})}
                        />
                    );
                }}
            </Transition>
        );
    }
}

export default Explosion;
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Transition } from 'react-transition-group';
import styles from './styles';

const time = 200;

const pulse = keyframes`
  from { transform: scale3d(.5, .5, .5); }
  50% { transform: scale3d(1, 1, 1); }
  to { transform: scale3d(.5, .5, .5); }
`;

const transformStyles = {
    entering: `scale(0)`,
    entered: `scale(1)`,
    exiting: `scale(1)`,
    exited: `scale(1)`,
    none: ``,
};

const BombOuter = styled.div`
  position: absolute;
  width: ${({ size = 5 }) => `${size}px`};
  height: ${({ size = 5 }) => `${size}px`};
  transform: ${({ x, y, size = 5, state }) => `translate(${x - size/2}px, ${y - size/2}px) ${transformStyles[state]}`}; 
  transition: transform 200ms ease;
  z-index: 1;
`;

const BombInner = styled.div`
    width: ${({ size = 5 }) => `${size}px`};
    height: ${({ size = 5 }) => `${size}px`};
    animation: ${({ state }) => state === 'entered' ? `${pulse} 1s ease infinite` : ''};
    border-radius: 50%;
    background-color: ${({ isCurrent }) => isCurrent ? styles.meColor : styles.colorSecondary};
    
`;

const Bomb = ({ ...rest }) => (
    <Transition timeout={time} {...rest}>
        {state => (
            <BombOuter {...rest} state={state} >
                <BombInner {...rest} state={state} />
            </BombOuter>
        )}
    </Transition>
);


export default Bomb;
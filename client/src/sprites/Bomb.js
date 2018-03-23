import styled from 'styled-components';
import styles from './styles';

export default styled.div`
    position: absolute;
    width: ${({ size = 5 }) => `${size}px`};
    height: ${({ size = 5 }) => `${size}px`};
    transform: ${({ x, y, size = 5 }) => `translate(${x - size/2}px, ${y - size/2}px)`};
    border-radius: 50%;
    z-index: 1;
    background-color: ${({ isCurrent }) => isCurrent ? styles.meColor : styles.colorSecondary};
`;

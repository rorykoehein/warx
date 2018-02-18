import styled from 'styled-components';
import styles from './styles';
import ship from '../graphics/ship.svg';

export default styled.div`
    position: absolute;
    width: ${({ size = 5 }) => `${size}px`};
    height: ${({ size = 5 }) => `${size}px`};
    z-index: 1;
    background-color: ${({ isCurrent }) => isCurrent ? styles.meColor : styles.colorSecondary};
    mask: url(${ship}) no-repeat 0 0;
    mask-size: cover;
`;

import styled from 'styled-components';
import { transparentize } from 'polished';
import styles from './styles';

export default styled.div`
    position: absolute;
    background: ${transparentize(0.25, styles.shotRed)};
    width: ${({ size = .5 }) => `${size}rem`};
    height: 200%;
    transform-origin: ${({ size = .5 }) => `${size/2}rem ${size/2}rem`};
    transition: ${({ duration = 100 }) => `transform ${duration}ms   ease`};
    box-shadow: ${({ size = .5 }) => `0 0 0 ${size/2}rem ${transparentize(0.75, styles.shotRed)}`};
`;

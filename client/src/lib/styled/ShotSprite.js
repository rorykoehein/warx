import styled from 'styled-components';
import styles from './styles';

export default styled.div`
    position: absolute;
    background: ${styles.shotRed};
    width: ${({ size = .5 }) => `${size/5}rem`};
    height: 9999rem;
    transform-origin: 0 0;
    margin-left: ${({ size = .5 }) => `${size}rem`}; // fix the positioning of the shot
    margin-top: ${({ size = .5 }) => `${size/2}rem`}; // fix the positioning of the shot
    box-shadow: 0 0 1em 0.2em ${styles.shotRed};
`;

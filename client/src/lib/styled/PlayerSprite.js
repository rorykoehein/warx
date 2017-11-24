import styled from 'styled-components';
import styles from './styles';

export default styled.div`
    position: absolute;
    width: ${({ size = .5 }) => `${size}rem`};
    height: ${({ size = .5 }) => `${size}rem`};
    background: white;
    transition: transform .05s ease;
    z-index: 1;
`;

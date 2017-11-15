import styled from 'styled-components';
import styles from './styles';

export default styled.div`
    position: absolute; 
    border-left: ${({ size = .5 }) => `${size}rem`} solid transparent;
    border-right: ${({ size = .5 }) => `${size}rem`} solid transparent;
    border-bottom: ${({ size = .5 }) => `${size}rem`} solid #fff;
    transition: transform .1s ease;
    z-index: 1;
    border-radius: 100%;
`;

import styled from 'styled-components';
import styles from './styles';

export default styled.div`
    position: absolute;
    width: 0; 
    height: 0; 
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid yellow;
    transition: transform .1s ease;
`;

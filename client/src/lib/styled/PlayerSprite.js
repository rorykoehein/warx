import styled from 'styled-components';
import styles from './styles';

export default styled.div`
    position: absolute;
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid yellow;
    transition: transform .1s ease;
`;

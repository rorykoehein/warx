import styled from 'styled-components';
import styles from './styles';

export default styled.input`
    position: absolute;
    width: 54rem;
    font-size: 3.2rem;
    padding: 1.2rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    outline: 0;
    color: white;
    background: ${styles.colorTertiary};
    border: 0;
    font-family: 'Roboto Condensed', sans-serif;
    text-transform: uppercase;
    box-shadow: 0 0 0 .5vw rgba(56, 201, 255, 0.2);
    
    &::placeholder {
      color: black;
    }
`;
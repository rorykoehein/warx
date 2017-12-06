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
    color: ${styles.colorPrimary};
    background: ${styles.colorTertiary};
    border: 0;
    font-family: 'Roboto Condensed', sans-serif;
`;
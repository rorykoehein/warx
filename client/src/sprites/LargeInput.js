import styled from 'styled-components';
import styles from './styles';
import { darken } from 'polished';

export default styled.input`
    display: inline-block;
    width: 45rem;
    height: 7rem;
    font-size: 3.2rem;
    margin-right: 2rem;
    margin-bottom: 2rem;
    padding: 1.6rem;
    outline: 0;
    color: white;
    background: ${darken(0.5, styles.colorPrimary)};
    border: 1px solid ${styles.colorTertiary};
    font-family: 'Roboto Condensed', sans-serif;
    text-transform: uppercase;
    //box-shadow: 0 0 0 .8rem rgba(56, 201, 255, 0.4);
    
    &::placeholder {
      color: grey;
    }
`;
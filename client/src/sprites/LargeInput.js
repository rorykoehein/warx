import styled from 'styled-components';
import styles from './styles';
import { darken, transparentize } from 'polished';

export default styled.input`
    display: inline-block;
    width: 45rem;
    height: 7rem;
    font-size: 3.2rem;
    margin-right: 2rem;
    padding: 1.6rem;
    outline: 0;
    color: white;
    background: ${darken(0.5, styles.colorPrimary)};
    border: 1px solid ${styles.colorTertiary};
    font-family: 'Roboto Condensed', sans-serif;
    text-transform: uppercase;
    box-shadow: 0 0 0 .25vw ${transparentize(.8, styles.colorTertiary)};
    
    &::placeholder {
      color: grey;
    }
`;
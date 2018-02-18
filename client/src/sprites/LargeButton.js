import styled from 'styled-components';
import styles from './styles';
import { lighten, transparentize } from 'polished';

export default styled.button`
    display: inline-block;
    width: 7rem;
    height: 7rem;
    font-size: 3.2rem;
    padding: .8rem;
    outline: 0;
    color: white;
    background: ${lighten(0, styles.colorPrimary)};
    border: 1px solid ${lighten(.5, styles.colorPrimary)};
    font-family: 'Roboto Condensed', sans-serif;
    text-transform: uppercase;
    cursor: pointer;
    box-shadow: 0 0 0 .25vw ${transparentize(.8, lighten(.5, styles.colorPrimary))};
    
    &:hover {
      background: ${lighten(.1, styles.colorPrimary)};
    }    
    
    &:active {
      background: ${lighten(.0, styles.colorPrimary)};
    }
`;
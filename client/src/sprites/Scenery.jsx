import styled from 'styled-components';
import styles from './styles';
import { darken } from 'polished';

const sunSize = 100;

export default styled.div`
    content: "";
    position: absolute;
    overflow: hidden;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-image: linear-gradient(#00011c, #361a84);
    background-position: 0 0vh;
    background-repeat: no-repeat;
    transition: background 10s; // todo start animate on game start, run for game time
    
    &:hover {
      background-position: 0 100vh;
      
      &::before {
        top: 100%;
      }
    }
    
    &::before {
        // sun
        content: "";
        position: absolute;
        transition: top 10s;
        top: 50%;
        width: ${sunSize}vh;
        height: ${sunSize}vh;
        bottom: -${sunSize / 2}vh;
        margin-left: -${sunSize / 2}vh;
        left: 50%;
        border-radius: 50%;
        background: ${styles.colorFire};
        opacity: .2;
    }
    
    &::after {
        // grid
        content: "";
        background-image: linear-gradient(0deg, transparent 24%, ${styles.colorTertiary} 25%, 
        ${styles.colorTertiary} 26%, transparent 27%, transparent 74%, 
        ${styles.colorTertiary} 75%, 
        ${styles.colorTertiary} 76%, transparent 77%, transparent), 
        linear-gradient(90deg, transparent 24%, ${styles.colorTertiary} 25%, 
        ${styles.colorTertiary} 26%, transparent 27%, transparent 74%, 
        ${styles.colorTertiary} 75%, ${styles.colorTertiary} 76%, transparent 77%, 
        transparent);
        opacity: 0.2;
        height:100%;
        background-size: 50px 50px;
        position: absolute;
        left: 0;
        top: 0%;
        right: 0;
    }
`
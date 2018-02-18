import styled from 'styled-components';
import grid from './grid.svg';

export default styled.div`
    content: "";
    position: absolute;
    overflow: hidden;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-image: radial-gradient(circle at bottom, rgba(255, 0, 117, 0.4) -50%, #361a84 10%, #00011c 70%);
    background-repeat: no-repeat;
    
    &::after {
        // grid
        content: "";
        background-image: url(${grid});
        background-size: 100%;
        opacity: 0.2;
        background-position: center center;
        background-repeat: repeat-y;
        position: absolute;
        width: 100%;
        height: 100%;
    }
`
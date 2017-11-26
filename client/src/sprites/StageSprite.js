import styled, { injectGlobal } from 'styled-components';
import dirty from '../graphics/dirty_old_shirt.png';

injectGlobal`
  @font-face {
    font-family: 'VT323';
    src: url('../fonts/VT323-Regular.ttf');
  }

  body {
    margin: 0;
    font-family: 'VT323', monospace;
    padding: 0;
    background: url(${dirty}) black;
  }
  
  html, body {
    height: 100%;
    font-size: 10px;
  }

  * {
    box-sizing: border-box;
  }
`;

export default styled.div``;

import styled, { injectGlobal } from 'styled-components';
import Roboto from '../fonts/Roboto-Regular.ttf';
import RobotoCondensed from '../fonts/RobotoCondensed-Regular.ttf';
import styles from './styles';

injectGlobal`
  @font-face {
    font-family: 'Roboto';
    src: url(${Roboto});
  }
  
  @font-face {
    font-family: 'Roboto Condensed';
    src: url(${RobotoCondensed});
  }

  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    text-transform: uppercase;
    padding: 0;
  }
    
  html, body {
    height: 100%;
    font-size: 10px;
    background: ${styles.background};
    //background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fad134' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
  }

  * {
    box-sizing: border-box;
  }
`;

export default styled.div``;

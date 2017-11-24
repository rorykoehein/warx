import styled from 'styled-components';
import { transparentize } from 'polished';
import styles from './styles';

export default styled.div`
    position: relative;
    display: inline-block;
    max-width: 100%;
    width: ${({ width = 32 }) => `${width}rem`};
    height: ${({ height = 1.6 }) => `${height}rem`};
    background: ${({ color = 'white' }) => transparentize(0.5, color)};
    border-radius: ${({ height = 1 }) => `${height}rem`};

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: ${({ color = 'white' }) => color};
      width: ${({ percentage = 0 }) => `${percentage}%`};
      transition: ${({ loadTime = .1 }) => `width cubic-bezier(0.550, 0.055, 0.675, 0.190)`};
      transition-duration: ${({ loadTime = .1 }) => `${loadTime}s`}; 
      border-radius: ${({ height = 1 }) => `${height}rem`};
    }
`;

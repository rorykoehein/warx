import styled from 'styled-components';
import styles from './styles';

export default styled.div`
    position: relative;
    display: inline-block;
    max-width: 100%;
    width: ${({ width = 24 }) => `${width}vw`};
    height: ${({ height = 1 }) => `${height}vw`};
    background: ${styles.colorPrimary};
    border: .1rem solid ${styles.colorPrimary};
    box-shadow: 0 0 0 .25vw rgba(56, 201, 255, 0.2);

    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: ${({ color = styles.colorTertiary }) => color};
      width: ${({ percentage = 0 }) => `${percentage}%`};
      transition: ${({ loadTime = .1 }) => `width cubic-bezier(0.550, 0.055, 0.675, 0.190)`};
      transition-duration: ${({ loadTime = .1 }) => `${loadTime}s`}; 
    }
`;

import styled from 'styled-components';
import styles from './styles';
import { lighten } from 'polished';

export default styled.div`
    display: block;
    color: white;
    background: ${lighten(0, styles.colorPrimary)};
    border: 1px solid ${lighten(.4, styles.colorPrimary)};
    overflow: auto;
    height: ${({height}) => `${height}rem`};
    padding: 1rem;
    
    &::-webkit-scrollbar {
        -webkit-appearance: none;
        width: 1.6rem;
        height: 1.4rem;
        background: rgba(255,255,255,0);
        box-shadow: none;
    }
    
    &::-webkit-scrollbar-track {
        background: rgba(255,255,255,0);
        box-shadow: none;
    }
    
    &::-webkit-scrollbar-corner {
      background-color: ${styles.colorPrimary};
    }
    
    &::-webkit-scrollbar-thumb {
        border-radius: 1.4rem;
        border: .4rem solid rgba(255, 255, 255, 0);
        background-clip: content-box;
        background-color: ${lighten(.4, styles.colorPrimary)};
        
        &:hover {
          background-color: ${lighten(.6, styles.colorPrimary)};
        }
        
        &:active {
          background-color: ${lighten(.8, styles.colorPrimary)};
        }
    }
`;
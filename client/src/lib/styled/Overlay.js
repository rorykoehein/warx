import styled from 'styled-components';
import styles from './styles';

export default styled.div`
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.6);
    z-index: ${styles.overlayIndex};
`;
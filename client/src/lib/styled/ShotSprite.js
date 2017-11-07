import styled from 'styled-components';
import styles from './styles';

export default styled.div`
    position: absolute;
    background: ${styles.shotRed};
    width: 1px;
    height: 9999rem;
    transform-origin: 0 0;
    margin-left: .6rem;
    margin-top: .3rem;
    box-shadow: 0 0 1em 0.2em ${styles.shotRed};
`;

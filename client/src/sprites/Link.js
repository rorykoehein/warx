import styled from 'styled-components';
import styles from './styles';

export default styled.a`
    color: ${styles.colorTertiary};
    text-decoration: none;
    
    &:hover {
      color: white;
    }
`;
import styled from 'styled-components';
import { lighten } from 'polished';
import styles from './styles';

export default styled.label`
    font-size: 1.2rem;
    display: block;
    padding: .4rem;
    color: ${lighten(.5, styles.colorPrimary)}
`;

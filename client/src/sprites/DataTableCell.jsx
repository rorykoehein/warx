import styled from 'styled-components';
import styles from './styles';

export default styled.td`
    color: ${({ main }) => main ? 'white' : '#ccc'};
    text-align: ${({ right }) => right ? 'right' : 'left'};
    padding: .5rem 1rem;
    max-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;
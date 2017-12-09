import React from 'react';
import styled from 'styled-components';
import styles from './styles';

const Row = styled.tr`
    &:nth-child(odd) {
      background: rgba(255, 255, 255, 0.1)
    }
`;

const Cell = styled.td`
    padding: 1vw;
    font-size: 2vw;
    color: white;
    text-align: ${({ isNumber }) => isNumber ? 'right': 'left'}
`;

const Score = ({ name, frags, deaths, latency }) => {
    return (
        <Row>
            <Cell>{name}</Cell>
            <Cell isNumber>{frags}</Cell>
            <Cell isNumber>{deaths}</Cell>
            <Cell isNumber>{latency}</Cell>
        </Row>
    );
};

export default Score;

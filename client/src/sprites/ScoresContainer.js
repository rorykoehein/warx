import React from 'react';
import styled from 'styled-components';
import styles from './styles';

const Table = styled.table`
    position: absolute;
    width: 54rem;
    font-size: 3.2rem;
    padding: 1.2rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: white;
    border-spacing: 0;
    border-collapse: separate;
`;

const Head = styled.th`
    text-transform: uppercase;
    text-align: ${({ isNumber }) => isNumber ? 'right': 'left'};
    padding: 1rem;
`;

const ScoresContainer = ({ children }) => {
    return (
        <Table>
            <thead>
                <tr>
                    <Head>Player</Head>
                    <Head isNumber>Frags</Head>
                    <Head isNumber>Deaths</Head>
                    <Head isNumber>Ping</Head>
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </Table>
    );
};

export default ScoresContainer;

import React from 'react';
import styled from 'styled-components';
import styles from './styles';

const Container = styled.div`
    position: absolute;
    width: 60vw;
    font-size: 3vw;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: auto;
    max-height: 100%;
`;

const Table = styled.table`
    color: white;
    border-spacing: 0;
    border-collapse: separate;
    width: 100%;
`;

const Head = styled.th`
    text-transform: uppercase;
    text-align: ${({ isNumber }) => isNumber ? 'right': 'left'};
    padding: 1vw;
`;

const ScoresContainer = ({ children }) => {
    return (
        <Container>
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
        </Container>
    );
};

export default ScoresContainer;

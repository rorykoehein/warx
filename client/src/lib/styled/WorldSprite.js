import styled from 'styled-components';

export default styled.div`
    position: absolute;
    width: ${({ ratio = 2 }) => `calc((100vh - 1vw) * ${ratio})`};
    height: ${({ ratio = 2 }) => `calc((100vw - 1vw) * ${1/ratio})`};
    max-height: calc(100vh - 1vw);
    max-width: calc(100vw - 1vw);
    background: linear-gradient(#282630, #111);
    overflow: hidden;
    box-shadow: 0 0 .2rem rgba(255, 255, 255, 0.75);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

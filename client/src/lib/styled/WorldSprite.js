import styled from 'styled-components';

export default styled.div`
    position: absolute;
    width: calc((100vh - 20px) * 1.7777);
    max-height: calc(100vh - 20px);
    max-width: calc(100vw - 20px);
    height: calc((100vw - 20px) * 0.5625);
    background: linear-gradient(#282630, #111);
    overflow: hidden;
    box-shadow: 0 0 .2rem rgba(255, 255, 255, 0.75);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
`;

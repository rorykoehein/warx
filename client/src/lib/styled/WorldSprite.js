import styled from 'styled-components';
import ep from '../graphics/ep_naturalblack.png';

export default styled.div`
    position: absolute;
    width: ${({ ratio = 2 }) => `calc((100vh - 1vw) * ${ratio})`};
    height: ${({ ratio = 2 }) => `calc((100vw - 1vw) * ${1/ratio})`};
    max-height: calc(100vh - 1vw);
    max-width: calc(100vw - 1vw);
    background: url(${ep});
    overflow: hidden;
    border: .2rem solid #999;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-sizing: content-box;
`;

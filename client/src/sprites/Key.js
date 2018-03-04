import styled from 'styled-components';

const size = 3;
const textSize = size/2;

export default styled.div`
    display: inline-block;
    border: .2rem white solid;
    border-radius: ${size/4}rem;
    min-width: ${size}rem;
    height: ${size}rem;
    font-size: ${textSize}rem;
    line-height: 1em;
    padding: ${(size - textSize)/ 2}rem;
    text-align: center;
    margin-right: 1rem;
    text-transform: uppercase;
`;
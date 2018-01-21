import styled from 'styled-components';

export default styled.div`
    margin: 0 auto;
    width: 54rem;
    font-size: 2.4rem;
    padding: 1rem;
    color: white;
    font-family: 'Roboto Condensed', sans-serif;
    
    &::before {
      display: inline-block;
      content: ${({ instruction }) => `'${instruction}'`};
      padding-right: 2rem;
      box-sizing: border-box;
      width: 50%;
      text-align: right;
    }
`;
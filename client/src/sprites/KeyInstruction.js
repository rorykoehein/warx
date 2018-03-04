import styled from 'styled-components';

export default styled.div`
    margin: 0 auto;
    width: 54rem;
    font-size: 1.5rem;
    padding: 1rem;
    color: white;
    font-family: 'Roboto Condensed', sans-serif;
    
    &::before {
      display: inline-block;
      color: grey;
      content: ${({ instruction }) => `'${instruction}'`};
      padding-right: 2rem;
      box-sizing: border-box;
      width: 50%;
      text-align: right;
    }
`;
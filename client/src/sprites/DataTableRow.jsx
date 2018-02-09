import React from 'react';
import styled from 'styled-components';
import { lighten, darken } from 'polished';
import styles from './styles';

const backColor = styles.colorPrimary;
const hoverColor = lighten(.1, backColor);
const selectedColor = lighten(.2, backColor);
const activeColor = darken(.3, backColor);

const StyledRow = styled.tr`
    background-color: ${({ isSelected }) => isSelected ? selectedColor : backColor};
    cursor: ${({ onClick }) => onClick ? 'pointer': 'default'};
    
    &:hover {
      background-color: ${({ isSelected }) => isSelected ? selectedColor : hoverColor};
    }
    
    &:active {
      background-color: ${activeColor};
    }
`;

const DataTableRow = (props) => (
    <StyledRow
        role="button"
        {...props}
    />
);

export default DataTableRow;
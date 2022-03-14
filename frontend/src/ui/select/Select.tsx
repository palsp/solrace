import React from "react";
import styled from "styled-components";
import { getDisplayedValue } from "./utils";
import { ChevronDown } from "react-feather";

interface Props {
  label?: any;
  value?: any;
  onChange?: any;
  children?: any;
}
const Select: React.FC<Props> = ({ label, value, onChange, children }) => {
  const displayedValue = getDisplayedValue(value, children);
  return (
    <Wrapper>
      <NativeSelect value={value} onChange={onChange}>
        {children}
      </NativeSelect>
      <PresentationalBit>
        {displayedValue ? displayedValue : "Select Garage"}
        <IconWrapper style={{ "--size": 24 + "px" }}>
          <ChevronDown />
        </IconWrapper>
      </PresentationalBit>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 300px;
`;

const NativeSelect = styled.select`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  /* Allow the select to span the full height in Safari */
  -webkit-appearance: none;
`;

const PresentationalBit = styled.div`
  color: var(--color-black);
  background-color: var(--color-primary-light);
  font-size: ${16 / 16}rem;
  padding: 12px 16px;
  padding-right: 52px;
  border-radius: 8px;
  ${NativeSelect}:focus + & {
    outline: 1px dotted #212121;
    outline: 5px auto var(--color-primary-light);
  }
  ${NativeSelect}:hover + & {
    color: var(--color-black);
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 10px;
  margin: auto;
  width: var(--size);
  height: var(--size);
  pointer-events: none;
`;

export default Select;

import React, { useState } from "react";
import styled from "styled-components";
interface Props {
  value1?: string;
  value2?: string;
  width: string;
  is1Click?: any;
  is2Click?: any;
}

const ToggleButtonGroup = ({ value1, value2, width }: Props) => {
  const [is1Click, setIs1Click] = useState<boolean>(false);
  const [is2Click, setIs2Click] = useState<boolean>(false);

  const handleButton1Click = () => {
    setIs1Click(true);
    setIs2Click(false);
  };
  const handleButton2Click = () => {
    setIs1Click(false);
    setIs2Click(true);
  };
  return (
    <WrapperToggleButtonGroup>
      <WrapperButton1
        width={width}
        is1Click={is1Click}
        onClick={handleButton1Click}
      >
        <Span>{value1}</Span>
      </WrapperButton1>
      <WrapperButton2
        width={width}
        is2Click={is2Click}
        onClick={handleButton2Click}
      >
        <Span>{value2}</Span>
      </WrapperButton2>
    </WrapperToggleButtonGroup>
  );
};

const Span = styled.span`
  color: black;
  position: relative;
  z-index: 1;
  transition: color 0.6s cubic-bezier(0.53, 0.21, 0, 1);

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const WrapperButton = styled.div`
  border: none;
  width: ${(props: Props) => props.width || "auto"};
  background-color: var(--color-primary-light);
  color: var(--color-black);
  padding: 0.25rem 0;
  font-weight: bold;
  cursor: pointer;
  box-shadow: var(--shadow-elevation-high-primary);
  position: relative;
  overflow: hidden;
  transition: background-color 0.75s ease;
  &:hover {
    background-color: var(--color-primary);
  }
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    border-radius: 6px;
    transform: translate(-100%, -50%);
    width: 100%;
    height: 100%;
    background-color: var(--color-primary-dark);
    transition: transform 0.6s cubic-bezier(0.53, 0.21, 0, 1);
  }
`;

const WrapperButton1 = styled(WrapperButton)`
  ${(props: Props) => {
    if (props.is1Click) {
      return `
      &:active ${Span} {
    color: var(--color-white);
  }
      &::before {
    transform: translate(0, -50%);
    }`;
    }
  }}
`;

const WrapperButton2 = styled(WrapperButton)`
  &::before {
    transform: translate(100%, -50%);
  }
  ${(props: Props) => {
    if (props.is2Click) {
      return `
      &:active ${Span} {
    color: var(--color-white);
  }
      &::before {
    transform: translate(0, -50%);
    }`;
    }
  }}
`;
const WrapperToggleButtonGroup = styled.div`
  display: flex;
  border-radius: 0.25rem;
  overflow: hidden;
  margin-top: 0.5rem;
`;
export default ToggleButtonGroup;

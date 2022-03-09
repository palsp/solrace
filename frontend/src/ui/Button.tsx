import React from "react";
import styled from "styled-components";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  width?: string;
}
const Button = styled.button`
  border: none;
  padding: 1rem;
  width: ${(props: Props) => props.width || "auto"};
  background-color: var(--color-primary);
  color: var(--color-black);
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.25rem;
  box-shadow: var(--shadow-elevation-medium);
`;

export default Button;

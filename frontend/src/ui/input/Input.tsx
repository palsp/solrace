import React from "react";
import styled from "styled-components";

const Input = styled.input`
  width: 100%;
  border-radius: 0.25rem;
  border: none;
  padding: 0.3rem 1rem;
  box-shadow: var(--shadow-elevation-medium-primary);
  background: var(--background-gradient-1);
  opacity: 0.9;
  &:focus {
    outline: 2px solid var(--color-secondary);
  }
`;

export default Input;

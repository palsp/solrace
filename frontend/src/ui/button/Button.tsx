import React from 'react';
import styled from 'styled-components';

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  width?: string;
  color: string;
}

const Button = ({ width, color, children }: Props) => {
  return (
    <WrapperButton width={width} color={color}>
      <Span>{children}</Span>
    </WrapperButton>
  );
};

const Span = styled.span`
  color: black;
  position: relative;
  z-index: 1;
  transition: color 0.6s cubic-bezier(0.53, 0.21, 0, 1);
`;

const WrapperButton = styled.button`
  border: none;
  padding: 1rem;
  width: ${(props: Props) => props.width || 'auto'};
  background-color: ${(props: Props) => `var(--color-${props.color})`};
  color: var(--color-black);
  font-weight: bold;
  cursor: pointer;
  border-radius: 0.25rem;
  box-shadow: ${(props: Props) =>
    `var(--shadow-elevation-medium-${props.color})`};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    border-radius: 6px;
    transform: translate(-100%, -50%);
    width: 100%;
    height: 100%;
    background-color: ${(props: Props) => `var(--color-${props.color}-dark)`};
    transition: transform 0.6s cubic-bezier(0.53, 0.21, 0, 1);
  }

  &:hover ${Span} {
    color: var(--color-white);
  }

  &:hover::before {
    transform: translate(0, -50%);
  }
`;

export default Button;

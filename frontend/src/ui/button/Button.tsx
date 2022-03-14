import React from "react";
import styled from "styled-components";
import AppImage from "../appImage";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  width?: string;
  color: string;
  border?: string;
  icon?: string;
  padding?: string;
  outline?: boolean;
}

const Button = ({ width, color, children, icon, outline, padding }: Props) => {
  let Icon;
  if (icon) {
    Icon = (
      <AppImage
        src={`/${icon}-white.png`}
        width="40px"
        height="40px"
      ></AppImage>
    );
  }
  return (
    <WrapperButton
      width={width}
      color={color}
      outline={outline}
      padding={padding}
    >
      <Span>
        {Icon}
        {children}
      </Span>
    </WrapperButton>
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

const WrapperButton = styled.button`
  border: none;
  padding: ${(props: Props) => props.padding || "1rem"};
  width: ${(props: Props) => props.width || "auto"};
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
    content: "";
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

  ${(props: Props) => {
    if (props.outline) {
      return `&:hover {
    outline: 2px solid white;
      }`;
    }
  }}
`;

export default Button;

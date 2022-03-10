import styled from "styled-components";
import Column from "../column";

const Card = styled(Column)`
  position: relative;
  overflow: hidden;
  width: clamp(200px, 100%, 400px);
  height: 100%;
  background: var(--color-white);
  box-shadow: var(--shadow-elevation-medium-secondary);
  gap: 1rem;
  border-radius: 0.5rem;
  padding: 1rem;

  &:hover {
    box-shadow: var(--shadow-elevation-high-secondary);
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    background: var(--background-gradient-2);
    transition: all 0.5s ease-in;
  }
  &:hover::before {
    opacity: 1;
  }
`;

export default Card;

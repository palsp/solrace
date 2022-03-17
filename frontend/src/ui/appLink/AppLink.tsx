import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

interface Props {
  href: string;
  color?: string;
  textColor?: string;
  target?: string;
}
const AppLink: React.FC<Props> = ({
  children,
  href,
  color,
  textColor,
  target,
}) => {
  const { pathname } = useRouter();

  const getActiveClassName = () => {
    return pathname === href ? "active" : "";
  };

  return (
    <Link href={href} passHref>
      <A className={getActiveClassName()} color={color} target={target}>
        <Span textColor={textColor}>{children}</Span>
      </A>
    </Link>
  );
};
interface SpanProps {
  textColor?: string;
}
const Span = styled.span`
  color: ${(props: SpanProps) => `var(--color-${props.textColor})`};
`;
const A = styled.a`
  position: relative;
  cursor: pointer;
  ${Span} {
    position: relative;
  }

  &::before {
    content: "";
    position: absolute;
    left: -0.1px;
    right: -0.1px;
    bottom: 0;
    height: 100%;
    transform: scaleY(0.3);
    transition: transform 0.6s cubic-bezier(0.53, 0.21, 0, 1);
    transform-origin: bottom;
    background-color: ${(props) =>
      props.color
        ? `var(--color-${props.color}-dark)`
        : "var(--color-secondary-dark)"};
    opacity: 0.6;
  }

  &:hover::before {
    transform: scaleY(1);
  }
`;

export default AppLink;

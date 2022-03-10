import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

interface Props {
  href: string;
  color?: string;
}
const AppLink: React.FC<Props> = ({ children, href, color }) => {
  const { pathname } = useRouter();

  const getActiveClassName = () => {
    return pathname === href ? "active" : "";
  };

  return (
    <Link href={href} passHref>
      <A className={getActiveClassName()} color={color}>
        <Span>{children}</Span>
      </A>
    </Link>
  );
};

const Span = styled.span``;
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
      props.color ? `var(--color-${props.color})` : "var(--color-secondary)"};
    opacity: 0.6;
  }

  &:hover::before {
    transform: scaleY(1);
  }
`;

export default AppLink;

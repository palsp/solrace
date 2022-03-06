import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import theme from '~/ui/theme'

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const A = styled.a`
  cursor: pointer;

  &.active {
    font-weight: bold;
    color: ${theme.color.primary};
  }

  &:hover {
    font-weight: bold;
    color: ${theme.color.primary};
  }
`

interface Props {
  href: string
}
export const AppLink: React.FC<Props> = ({ children, href }) => {
  const { pathname } = useRouter()

  const getActiveClassName = () => {
    return pathname === href ? 'active' : ''
  }

  return (
    <Link href={href} passHref>
      <A className={getActiveClassName()}>{children}</A>
    </Link>
  )
}

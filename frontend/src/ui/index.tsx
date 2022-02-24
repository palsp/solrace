import styled from 'styled-components'

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

export const AppLink = styled.a`
  & .active {
    font-weight: bold;
  }

  &::hover {
    font-weight: bold;
  }
`

import styled from 'styled-components'

const Container = styled.div`
  display: grid;
  padding-left: 10px;
  border-left: 1px solid grey;
  align-items: center;
  grid-template-columns: 1fr;
  grid-column-gap: 15px;
  grid-row-gap: 8px;
  width: ${props => props.width};
`

const ButtonContainer = styled.div`
  max-width: ${props => props.maxWidth};

  @media screen and (max-width: 670px) {
    max-width: unset;
  }
`

export { Container, ButtonContainer }

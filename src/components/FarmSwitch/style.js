import styled from 'styled-components'

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));

  @media screen and (max-width: 550px) {
    padding: 0 30px 30px;
  }
`

const Chain = styled.div`
  display: flex;
  align-items: center;
  border-bottom: ${props => (props.selected ? '4px solid #ffba5b' : '1px solid #dadfe6')};
  justify-content: center;
  padding: 30px 0px;

  cursor: ${props => (props.selected ? 'not-allowed' : 'pointer')};
  transition: 0.25s;

  &:hover {
    span {
      text-decoration: ${props => (!props.selected ? 'underline' : 'unset')};
    }
  }

  span {
    font-weight: ${props => (props.selected ? '800' : '500')};
    font-size: 20px;
    line-height: 24px;
    margin-right: ${props => (props.new ? '10px' : 'unset')};
  }

  img {
    margin-right: 10px;
  }

  @media screen and (max-width: 550px) {
    justify-content: flex-start;
  }
`

const ExternalLink = styled.div`
  margin-left: 10px;
  margin-top: 6px;
`

export { Container, Chain, ExternalLink }

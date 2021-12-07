import styled from 'styled-components'

const Container = styled.div`
  overflow: visible;
  background: linear-gradient(180deg, #ffffff 66.17%, rgba(255, 255, 255, 0.5) 100%);
  border-radius: 20px;
  padding-bottom: 1px;

  @media screen and (max-width: 860px) {
    background: transparent;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #dadfe6;
  padding: 20px 0;
  margin-bottom: 10px;

  @media screen and (max-width: 860px) {
    display: none;
  }
`

const HeaderCol = styled.div`
  display: flex;
  align-items: center;
  width: ${props => props.width || 'auto'};
  text-align: ${props => props.textAlign || 'center'};
  margin: ${props => props.margin || 'unset'};
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  cursor: pointer;

  img {
    margin-left: 10px;
  }
`
export { Container, Header, HeaderCol }

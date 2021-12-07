import styled from 'styled-components'

const HeaderContainer = styled.div`
  width: auto;
  padding: 10px 0;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid black;
  border-right 0;
  border-left: 0;
  padding: 10px;
  flex-wrap: wrap;

  b {
    margin-right: 5px;
  }

  a {
    margin-right: 5px;
    margin-left: 5px;
    color: black;
    font-weight: bold;
  }
`

const HeaderItem = styled.p`
  font-weight: bold;
  margin-top: 0px;
  margin-bottom: 5px;
  text-align: center;

  @media screen and (min-width: 812px) {
    margin-bottom: 0;
  }

  &:after {
    margin: 0 5px;
    content: '|';

    @media screen and (max-width: 812px) {
      content: '';
    }
  }

  &:last-child {
    &:after {
      content: '';
    }
  }

  a {
    margin: 0;
  }
`

export { HeaderContainer, HeaderItem }

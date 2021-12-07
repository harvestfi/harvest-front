import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: ${props => props.justify};
  align-items: center;
  position: relative;

  input {
    width: 100%;
    background: #ffffff;
    border: 2px solid #dadfe6;
    box-sizing: border-box;
    border-radius: 20px;
    height: 41px;
    margin: 0;
    padding: 0px 0px 0px 60px;
    outline: 0;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;

    &:disabled {
      background-color: #fffce6;
      opacity: 0.9;
      cursor: not-allowed;
    }

    &::placeholder {
      color: #a9aeb3;
    }
  }

  @media screen and (max-width: 550px) {
    width: 100%;

    input {
      height: 45px;
    }
  }
`

const Icon = styled.img`
  position: absolute;
  z-index: 1;
  left: 22px;
`

export { Container, Icon }

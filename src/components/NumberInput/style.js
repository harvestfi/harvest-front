import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-grow: ${props => props.grow};
  justify-content: ${props => props.justify};
  align-items: baseline;
  position: relative;
  width: ${props => props.width || 'auto'};
  flex-direction: column;
  align-items: baseline;

  input {
    width: inherit;
    border-radius: 10px;
    border: 2px solid #dadfe6;
    height: 43px;
    margin: 0;
    padding: 0px 0px 0px 10px;
    outline: 0;
    font-family: Montserrat;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
    background-color: #ffffff;
    padding-right: ${props => (props.hasButton ? '65px' : 'unset')};
    box-sizing: border-box;
    color: ${props => (props.invalidAmount ? 'red' : 'unset')};

    &:disabled {
      background-color: #f1f1f1;
      opacity: 0.9;
      cursor: not-allowed;
    }

    &::placeholder {
      color: #a9aeb3;
    }
  }

  button {
    position: absolute;
    z-index: 1;
    right: 7px;
    top: 8px;
    height: 29px;
    width: 48px;
    font-family: Montserrat;
    font-weight: 800;
    font-size: 14px;
    line-height: 17px;
    color: #664a24;
  }
`

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: inherit;
  margin-bottom: 10px;
  flex-wrap: wrap;
`

const Label = styled.span`
  font-family: Montserrat;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: black;
`

const InputContainer = styled.div`
  position: relative;
  width: inherit;
`

export { Container, LabelContainer, Label, InputContainer }

import styled from 'styled-components'

const BoostContainer = styled.div`
  max-width: 750px;
  margin: 0 auto;
  text-align: center;

  p {
    font-size: 16px;
    line-height: 1.42;
  }

  @media screen and (max-width: 850px) {
    margin: 0 30px;
  }
`

const BoostPanelContainer = styled.div`
  display: flex;
  font-size: 16px;
  flex-direction: column;
  transition: 0.25s;
  position: relative;
  margin-bottom: 5px;
  transition: 0.25s;
  border: 2px solid black;
  background-color: #fffce694;
  border: 2px solid black;
  background-color: #fffce694;
  cursor: pointer;

  span {
    font-size: 16px;
  }

  &:hover {
    box-shadow: 3px 3px black;
  }

  .Collapsible {
    z-index: 2;
  }
`

const BoostPanelBody = styled.div`
  padding: 10px;
  cursor: auto;
`

const InputControl = styled.div`
  display: flex;
  position: relative;
  flex-direction: ${props => props.flexDirection || 'unset'};
  justify-content: ${props => props.justifyContent || 'unset'};
  height: ${props => props.height || 'unset'};
  align-items: center;
  width: 100%;

  button {
    white-space: pre;
    margin-left: 10px !important;

    &:last-child {
      margin-left: ${props => (props.boostView ? '0' : '10px')} !important;
    }
  }

  @media screen and (max-width: 670px) {
    button {
      &:last-child {
        margin-right: 0;
      }
    }
  }
`

const FormGroup = styled.div`
  display: flex;
  border-bottom: ${props => props.borderBottom || 'unset'};
  padding: ${props => props.padding || 'unset'};
  justify-content: ${props => props.justifyContent || 'unset'};

  @media screen and (max-width: 670px) {
    justify-content: space-between;
    height: 120px;
    flex-direction: column;
    align-items: ${props => props.alignItemsMobile || 'unset'};

    div {
      border-left: unset;
      padding: 0;
    }

    button {
      width: 100%;
    }
  }
`

const Alert = styled.p`
  margin: 0px auto 10px auto;
  max-width: 600px;
  line-height: 1.22;
`

const HeroContainer = styled.div`
  h2 {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const TokenLogo = styled.img`
  max-width: 30px;
  margin-right: 5px;
`

export {
  BoostContainer,
  BoostPanelContainer,
  BoostPanelBody,
  InputControl,
  FormGroup,
  Alert,
  HeroContainer,
  TokenLogo,
}

import styled from 'styled-components'

const TooltipContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    margin-top: 10px;
    text-align: left;
  }
`

const TooltipTriggerContainer = styled.div`
  width: 100%;
`

const TooltipTriggerText = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: baseline;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;

  ${props =>
    props.isSpecialVault
      ? `
flex-direction: row;
align-items: center;

img {
  margin-top: 0px !important;
}
`
      : ``}

  img {
    width: 38px;
    height: 38px;
    margin-top: 10px;
    margin-right: 10px;
  }

  @media screen and (max-width: 850px) {
    flex-direction: row;
    align-items: center;
    justify-content: center;

    img {
      margin-top: 0;
    }
  }
`

const DetailsContainer = styled.div`
  min-width: 300px;
  max-width: 300px;
`

const InfoContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
  align-items: ${props => props.alignItems || 'center'};
  flex-direction: ${props => props.flexDirection || 'unset'};
  justify-content: left;
`

const Url = styled.a`
  display: flex;
  align-items: center;
  text-align: left;
  color: black;

  svg {
    margin-left: 5px;
  }
`
const PercentagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  text-align: left;
  line-height: 1.22;
  margin-top: 10px;
`

const BreakdownContainer = styled.div`
  font-size: 13px;
`

export {
  TooltipContainer,
  DetailsContainer,
  Url,
  InfoContainer,
  PercentagesContainer,
  BreakdownContainer,
  TooltipTriggerContainer,
  TooltipTriggerText,
}

import styled from 'styled-components'

const PanelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;

  @media screen and (max-width: 860px) {
    flex-direction: column;
    align-items: baseline;
  }
`

const TokenLogo = styled.img`
  max-width: 30px;
  float: left;
  margin-left: 5px;
  margin-right: 5px;

  @media screen and (max-width: 860px) {
    margin-left: 0;
  }
`

const TokenNameContainer = styled.div`
  display: flex;
  align-items: center;
`

const TokenDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;

  small {
    font-size: 13px;
  }
`

const RewardsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  span {
    font-size: 20px;
  }

  b {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`

const ValueContainer = styled.div`
  font-weight: bold;
  width: ${props => props.width || 'auto'};
  min-width: ${props => props.minWidth || 'auto'};
  text-align: ${props => props.textAlign || 'unset'};
`

const TokenLogoContainer = styled.div`
  width: ${props => (props.width ? props.width : 'auto')};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: bold;
  margin-right: 5px;
  text-align: left;
  position: relative;
`

const TooltipText = styled.div`
  font-weight: normal;
  width: ${props => props.width || 'auto'};
  text-align: ${props => props.textAlign || 'unset'};
`

const NewBadge = styled.img`
  position: absolute;
  top: -4px;
  left: -4px;
  width: 35px;
  height: 35px;
`

const AdditionalBadge = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 5px;
`

const ArrowContainer = styled.div`
  padding: 0px 5.4px;
  background: ${props => (props.open ? '#f2b435' : '#FFFCE6')};
  border-radius: 4px;
  margin-right: 5px;

  svg {
    width: 9px;
    height: 9px;
    transition: 0.25s;
    transform: ${props => (props.open ? 'rotate(-180deg)' : 'unset')};

    path {
      fill: ${props => (props.open ? '#4C351B' : '#F2B435')};
    }
  }
`

const MobileVaultInfoContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
  align-items: center;
`

const MobileVaultValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  line-height: 2;
  font-size: 12px;

  * {
    font-size: 12px !important;
  }

  div {
    font-weight: bold;
  }

  img {
    width: 12px;
    height: 12px;
  }
`

export {
  PanelContainer,
  TokenLogo,
  RewardsContainer,
  TokenLogoContainer,
  ValueContainer,
  NewBadge,
  AdditionalBadge,
  TooltipText,
  ArrowContainer,
  TokenNameContainer,
  MobileVaultInfoContainer,
  MobileVaultValueContainer,
  TokenDescriptionContainer,
}

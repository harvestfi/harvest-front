import styled from 'styled-components'

const PanelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`

const TokenLogo = styled.img`
  max-width: 30px;
  float: left;
  margin-left: 5px;
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

  img {
    margin-right: 5px;
  }
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

export { PanelContainer, TokenLogo, TokenLogoContainer, NewBadge, TooltipText }

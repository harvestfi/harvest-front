import React from 'react'
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NewBadge, PanelContainer, TokenLogo, TokenLogoContainer } from './style'
import newBadgeImage from '../../assets/images/ui/new-badge.png'

const BoostPanelHeader = ({ token, open, boostView }) => {
  const tokenName = boostView ? token.amplifierTokenDisplayName : token.displayName
  return (
    <PanelContainer>
      <div>
        {token.isNew ? <NewBadge src={newBadgeImage} /> : null}
        <TokenLogoContainer width="235px" data-tip="" data-for={`token-info-${token.symbol}`}>
          {open ? (
            <FontAwesomeIcon size="lg" icon={faAngleUp} />
          ) : (
            <FontAwesomeIcon size="lg" icon={faAngleDown} />
          )}
          <TokenLogo
            src={boostView ? token.amplifierTokenLogoUrl : token.logoUrl}
            alt={tokenName}
          />{' '}
          {tokenName}
        </TokenLogoContainer>
      </div>
    </PanelContainer>
  )
}

export default BoostPanelHeader

import React from 'react'
import { ReactSVG } from 'react-svg'
import { IFARM_TOKEN_SYMBOL } from '../../constants'
import {
  ArrowContainer,
  NewBadge,
  PanelContainer,
  TokenLogo,
  TokenLogoContainer,
  ValueContainer,
} from './style'
import newBadgeImage from '../../assets/images/ui/new-badge.png'
import arrowIcon from '../../assets/images/ui/arrow.svg'
import { tokens } from '../../data'
import VaultName from './sub-components/VaultName'
import VaultApy from './sub-components/VaultApy'
import VaultValue from './sub-components/VaultValue'
import VaultUserBalance from './sub-components/VaultUserBalance'

const DesktopPanelHeader = ({
  token,
  tokenSymbol,
  vaultPool,
  useIFARM,
  isIFARM,
  setTooltipContent,
  open,
  fAssetSymbol,
  isSpecialVault,
  multipleAssets,
  amountsForPosition,
  loadedVault,
  loadingFarmingBalance,
}) => (
  <PanelContainer>
    <div>
      {token.isNew ? <NewBadge src={newBadgeImage} /> : null}
      <TokenLogoContainer width="290px" data-tip="" data-for={`token-info-${tokenSymbol}`}>
        <ArrowContainer open={open}>
          <ReactSVG src={arrowIcon} />
        </ArrowContainer>
        <TokenLogo
          src={useIFARM ? tokens[IFARM_TOKEN_SYMBOL].logoUrl : token.logoUrl}
          alt={tokenSymbol}
        />{' '}
        <VaultName
          token={token}
          tokenSymbol={tokenSymbol}
          vaultPool={vaultPool}
          useIFARM={useIFARM}
          isIFARM={isIFARM}
          setTooltipContent={setTooltipContent}
          isSpecialVault={isSpecialVault}
          fAssetSymbol={fAssetSymbol}
          loadedVault={loadedVault}
        />
      </TokenLogoContainer>
    </div>
    <ValueContainer width="150px">
      <VaultApy
        token={token}
        tokenSymbol={tokenSymbol}
        vaultPool={vaultPool}
        setTooltipContent={setTooltipContent}
        isSpecialVault={isSpecialVault}
      />
    </ValueContainer>
    <ValueContainer width="167px">
      <VaultValue token={token} tokenSymbol={tokenSymbol} setTooltipContent={setTooltipContent} />
    </ValueContainer>
    <ValueContainer minWidth="135px" textAlign="right">
      <VaultUserBalance
        token={token}
        tokenSymbol={tokenSymbol}
        amountsForPosition={amountsForPosition}
        multipleAssets={multipleAssets}
        setTooltipContent={setTooltipContent}
        isSpecialVault={isSpecialVault}
        loadingFarmingBalance={loadingFarmingBalance}
        vaultPool={vaultPool}
        loadedVault={loadedVault}
      />
    </ValueContainer>
  </PanelContainer>
)

export default DesktopPanelHeader

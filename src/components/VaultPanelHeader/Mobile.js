import React from 'react'
import { ReactSVG } from 'react-svg'
import { IFARM_TOKEN_SYMBOL } from '../../constants'
import {
  ArrowContainer,
  NewBadge,
  PanelContainer,
  TokenLogo,
  TokenLogoContainer,
  MobileVaultInfoContainer,
  MobileVaultValueContainer,
} from './style'
import newBadgeImage from '../../assets/images/ui/new-badge.png'
import arrowIcon from '../../assets/images/ui/arrow.svg'
import { tokens } from '../../data'
import VaultName from './sub-components/VaultName'
import VaultApy from './sub-components/VaultApy'
import VaultValue from './sub-components/VaultValue'
import VaultUserBalance from './sub-components/VaultUserBalance'

const MobilePanelHeader = ({
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
    <MobileVaultInfoContainer>
      <MobileVaultValueContainer>
        Harvest APY
        <VaultApy
          token={token}
          tokenSymbol={tokenSymbol}
          vaultPool={vaultPool}
          setTooltipContent={setTooltipContent}
          isSpecialVault={isSpecialVault}
        />
      </MobileVaultValueContainer>
      <MobileVaultValueContainer>
        TVL
        <VaultValue token={token} tokenSymbol={tokenSymbol} setTooltipContent={setTooltipContent} />
      </MobileVaultValueContainer>
      <MobileVaultValueContainer>
        Your Balance
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
      </MobileVaultValueContainer>
      <ArrowContainer open={open}>
        <ReactSVG src={arrowIcon} />
      </ArrowContainer>
    </MobileVaultInfoContainer>
  </PanelContainer>
)

export default MobilePanelHeader

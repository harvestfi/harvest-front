import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { get } from 'lodash'
import React from 'react'
import {
  DEGEN_WARNING_TOOLTIP_TEXT,
  FARM_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
} from '../../../constants'
import { usePools } from '../../../providers/Pools'
import { useWallet } from '../../../providers/Wallet'
import { addresses, tokens } from '../../../data'
import { hasAmountGreaterThanZero } from '../../../utils'
import {
  AdditionalBadge,
  TokenNameContainer,
  TokenDescriptionContainer,
  TooltipText,
} from '../style'

const VaultName = ({
  token,
  tokenSymbol,
  vaultPool,
  useIFARM,
  isIFARM,
  setTooltipContent,
  isSpecialVault,
  fAssetSymbol,
  loadedVault,
}) => {
  const { connected, balances } = useWallet()
  const { userStats } = usePools()
  const totalUnstakedInPool = isSpecialVault
    ? get(balances, tokenSymbol)
    : get(userStats, `[${get(vaultPool, 'id')}]['lpTokenBalance']`, 0)

  return (
    <TokenDescriptionContainer>
      <TokenNameContainer>
        {useIFARM ? tokens[IFARM_TOKEN_SYMBOL].displayName : token.displayName || tokenSymbol}
        {token.isDegen ? (
          <AdditionalBadge
            data-tip=""
            data-for={`tooltip-${tokenSymbol}`}
            src="./icons/degen-logo.png"
            onMouseOver={() =>
              setTooltipContent(
                <TooltipText width="320px">{DEGEN_WARNING_TOOLTIP_TEXT}</TooltipText>,
              )
            }
            onMouseLeave={() => setTooltipContent(undefined)}
          />
        ) : null}
        {token.isNFT ? (
          <AdditionalBadge
            data-tip=""
            data-for={`tooltip-${tokenSymbol}`}
            src="./icons/nft.png"
            onMouseOver={() =>
              setTooltipContent(
                <TooltipText>
                  This pair and vault is powered by <b>NFTs</b>!
                </TooltipText>,
              )
            }
            onMouseLeave={() => setTooltipContent(undefined)}
          />
        ) : null}
        {vaultPool.rewardTokens.includes(addresses.BSC.ampliFARM) ? (
          <AdditionalBadge
            data-tip=""
            data-for={`tooltip-${tokenSymbol}`}
            src="./icons/amplifarm.png"
            onMouseOver={() =>
              setTooltipContent(
                <TooltipText width="auto">
                  This vault rewards in <b>ampliFARM</b>
                </TooltipText>,
              )
            }
            onMouseLeave={() => setTooltipContent(undefined)}
          />
        ) : null}
        {token.isMultisigManaged ? (
          <AdditionalBadge
            data-tip=""
            data-for={`tooltip-${tokenSymbol}`}
            src="./icons/multisig.png"
            onMouseOver={() => (
              <TooltipText textAlign="center">
                <b>{token.apyTokenSymbols}</b> rewards are claimed by the community&apos;s multisig
                wallet.
                <br />
                Depositors are rewarded with{' '}
                <b>
                  {isIFARM
                    ? tokens[IFARM_TOKEN_SYMBOL].displayName
                    : tokens[FARM_TOKEN_SYMBOL].displayName}
                </b>
                .
              </TooltipText>
            )}
            onMouseLeave={() => setTooltipContent(undefined)}
          />
        ) : null}
        {connected && loadedVault && hasAmountGreaterThanZero(totalUnstakedInPool) ? (
          <FontAwesomeIcon
            size="1x"
            icon={faExclamationCircle}
            data-tip=""
            data-for={`tooltip-${tokenSymbol}`}
            onMouseOver={() =>
              setTooltipContent(<>You have {fAssetSymbol} in your wallet that is not staked.</>)
            }
            onMouseLeave={() => setTooltipContent(undefined)}
          />
        ) : null}
      </TokenNameContainer>
      {token.subLabel && <small>{token.subLabel}</small>}
    </TokenDescriptionContainer>
  )
}

export default VaultName

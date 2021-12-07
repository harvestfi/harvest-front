import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { find, get, toArray } from 'lodash'
import ReactTooltip from 'react-tooltip'
import uuid from 'react-uuid'
import ReactHtmlParser from 'react-html-parser'
import { Divider } from '../GlobalStyle'
import {
  TooltipContainer,
  DetailsContainer,
  InfoContainer,
  Url,
  PercentagesContainer,
  TooltipTriggerContainer,
  TooltipTriggerText,
} from './style'
import { formatAddress, displayAPY, getRewardsText, getTotalApy } from '../../utils'
import { DEFAULT_CLAIM_HELP_MESSAGES, IFARM_TOKEN_SYMBOL, SPECIAL_VAULTS } from '../../constants'
import { useVaults } from '../../providers/Vault'
import AnimatedDots from '../AnimatedDots'
import { getExplorerLink } from '../../services/web3'
import infoIcon from '../../assets/images/ui/info.svg'

const { addresses, tokens } = require('../../data')

const getClaimHelpMessage = (token, pool) => {
  if (pool.claimHelpMessage) {
    return pool.claimHelpMessage
  }

  switch (true) {
    case pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID:
      return null
    case !!token.hodlVaultId:
      return DEFAULT_CLAIM_HELP_MESSAGES.MIGRATED_TO_HODL
    case token.tokenAddress !== addresses.V2.SUSHI.Underlying && token.sushiHodl:
    case pool.hodlVaultId:
      return DEFAULT_CLAIM_HELP_MESSAGES.HODL
    case pool.rewardTokens.includes(addresses.iFARM):
      return DEFAULT_CLAIM_HELP_MESSAGES.IFARM
    case pool.rewardTokens.includes(addresses.FARM):
      return DEFAULT_CLAIM_HELP_MESSAGES.FARM
    case pool.rewardTokens.includes(addresses.BSC.bFARM):
      return DEFAULT_CLAIM_HELP_MESSAGES.bFARM
    case pool.rewardTokens.includes(addresses.MATIC.miFARM):
      return DEFAULT_CLAIM_HELP_MESSAGES.miFARM
    default:
      return null
  }
}

const VaultPanelDetailsTooltip = ({ token, fAssetSymbol, pool }) => {
  const { vaultsData, loadingVaults } = useVaults()

  const farmAPY = get(pool, 'totalRewardAPY', 0)
  const tradingAPY = get(pool, 'tradingApy', 0)
  const boostedEstimatedAPY = get(
    find(vaultsData, vault => vault.tokenAddress === token.tokenAddress, {}),
    `boostedEstimatedAPY`,
  )

  const boostedRewardAPY = get(pool, 'boostedRewardAPY', 0)

  const isSpecialVault = token.liquidityPoolVault || token.poolVault

  const totalApy = getTotalApy(pool, token, isSpecialVault)

  const assetName = token.displayName

  return (
    <TooltipContainer>
      <ReactTooltip
        id={`details-${pool.id}`}
        backgroundColor="white"
        borderColor="black"
        border
        textColor="black"
        effect="solid"
        delayHide={50}
        clickable
      >
        <DetailsContainer>
          <InfoContainer>
            Asset:&nbsp;
            <b>
              {pool.externalPoolURL ? (
                <Url
                  onClick={e => e.stopPropagation()}
                  href={pool.externalPoolURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {assetName}
                  <FontAwesomeIcon size="xs" icon={faExternalLinkAlt} />
                </Url>
              ) : (
                assetName
              )}
            </b>
          </InfoContainer>
          {token.pricesInfo &&
            toArray(token.pricesInfo).map((info, infoIdx) => {
              const tokenSymbol = Object.keys(token.pricesInfo)[infoIdx]
              return (
                <InfoContainer key={tokenSymbol} alignItems="baseline" flexDirection="column">
                  <div>
                    <b>{tokenSymbol}</b> price info:
                  </div>
                  <Divider height="5px" />
                  {info.map(priceInfo => (
                    <div key={uuid()}>{priceInfo}</div>
                  ))}
                </InfoContainer>
              )
            })}
          {token.vaultAddress && (
            <InfoContainer>
              Vault address:&nbsp;
              <b>
                <Url
                  onClick={e => e.stopPropagation()}
                  href={`${getExplorerLink(token.chain)}/address/${token.vaultAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formatAddress(token.vaultAddress)}
                  <FontAwesomeIcon size="xs" icon={faExternalLinkAlt} />
                </Url>{' '}
              </b>
            </InfoContainer>
          )}
          <InfoContainer>
            Pool address:&nbsp;
            <b>
              <Url
                onClick={e => e.stopPropagation()}
                href={`${getExplorerLink(token.chain)}/address/${
                  pool.autoStakePoolAddress || pool.contractAddress
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {formatAddress(pool.autoStakePoolAddress || pool.contractAddress)}
                <FontAwesomeIcon size="xs" icon={faExternalLinkAlt} />
              </Url>
            </b>
          </InfoContainer>
          {pool.autoStakePoolAddress && (
            <InfoContainer>
              AutoStake pool address:&nbsp;
              <b>
                <Url
                  onClick={e => e.stopPropagation()}
                  href={`${getExplorerLink(token.chain)}/address/${pool.contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formatAddress(pool.contractAddress)}
                  <FontAwesomeIcon size="xs" icon={faExternalLinkAlt} />
                </Url>{' '}
              </b>
            </InfoContainer>
          )}
          {token.uniswapV3PositionId && (
            <InfoContainer>
              Position Token:&nbsp;
              <b>
                <Url
                  onClick={e => e.stopPropagation()}
                  href={`https://app.uniswap.org/#/pool/${token.uniswapV3PositionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {token.uniswapV3PositionId}
                  <FontAwesomeIcon size="xs" icon={faExternalLinkAlt} />
                </Url>{' '}
              </b>
            </InfoContainer>
          )}
          {pool.id !== SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID ? (
            <InfoContainer>
              fToken:&nbsp;
              <b>{fAssetSymbol}</b>
            </InfoContainer>
          ) : (
            <InfoContainer>
              {tokens[IFARM_TOKEN_SYMBOL].displayName} address:&nbsp;
              <b>
                <Url
                  onClick={e => e.stopPropagation()}
                  href={`${getExplorerLink(token.chain)}/address/${addresses.iFARM}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formatAddress(addresses.iFARM)}
                  <FontAwesomeIcon size="xs" icon={faExternalLinkAlt} />
                </Url>{' '}
              </b>
            </InfoContainer>
          )}
          {!token.inactive ? (
            <PercentagesContainer>
              APY{' '}
              {loadingVaults ? (
                <div>
                  <AnimatedDots />
                </div>
              ) : (
                <>
                  <b style={{ display: 'contents' }}>{displayAPY(totalApy)}</b>
                  {pool.id !== SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID ? (
                    <>
                      :&nbsp;
                      {getRewardsText(
                        token,
                        tokens,
                        pool,
                        tradingAPY,
                        farmAPY,
                        totalApy,
                        isSpecialVault,
                        boostedEstimatedAPY,
                        boostedRewardAPY,
                      )}
                    </>
                  ) : null}
                </>
              )}
            </PercentagesContainer>
          ) : null}
          {ReactHtmlParser(pool.stakeAndDepositHelpMessage)}
          {getClaimHelpMessage(token, pool)}
        </DetailsContainer>
      </ReactTooltip>
      <TooltipTriggerContainer>
        <TooltipTriggerText
          data-tip=""
          data-for={`details-${pool.id}`}
          isSpecialVault={isSpecialVault}
        >
          <img src={infoIcon} alt="Vault details" />
          Vault Details
        </TooltipTriggerText>
      </TooltipTriggerContainer>
    </TooltipContainer>
  )
}

export default VaultPanelDetailsTooltip

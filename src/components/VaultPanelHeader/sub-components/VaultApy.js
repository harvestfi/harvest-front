import BigNumber from 'bignumber.js'
import { get, size } from 'lodash'
import React from 'react'
import { DECIMAL_PRECISION } from '../../../constants'
import { useVaults } from '../../../providers/Vault'
import { addresses, tokens } from '../../../data'
import { VAULT_CATEGORIES_IDS } from '../../../data/constants'
import { stringToArray, displayAPY, getRewardsText, getTotalApy } from '../../../utils'
import AnimatedDots from '../../AnimatedDots'
import { SmallLogo } from '../../GlobalStyle'
import { RewardsContainer } from '../style'

const FARMIcon = ({ token, vaultPool, farmAPY }) => {
  if (token.inactive) {
    return null
  }

  switch (true) {
    case vaultPool.rewardTokens.includes(addresses.iFARM):
    case vaultPool.rewardTokens.includes(addresses.MATIC.miFARM):
      return (token.hideiFarmSymbol || new BigNumber(farmAPY).lte(0)) &&
        vaultPool.dataFetched ? null : (
        <SmallLogo margin="0px 5px 0px 0px" src="./icons/ifarm.png" />
      )
    case vaultPool.rewardTokens.includes(addresses.BSC.bFARM):
    case vaultPool.rewardTokens.includes(addresses.FARM):
      return (token.hideFarmSymbol || new BigNumber(farmAPY).lte(0)) &&
        vaultPool.dataFetched ? null : (
        <SmallLogo margin="0px 5px 0px 0px" src="./icons/farm.png" />
      )
    default:
      return null
  }
}

const VaultApy = ({ token, tokenSymbol, vaultPool, setTooltipContent, isSpecialVault }) => {
  const { loadingVaults, vaultsData } = useVaults()
  const tokenVault = get(vaultsData, token.hodlVaultId || tokenSymbol)

  const rewardAPY = get(vaultPool, 'rewardAPY', [0])
  const farmAPY = get(vaultPool, 'totalRewardAPY', 0)
  const tradingApy = get(vaultPool, 'tradingApy', 0)
  const boostedEstimatedAPY = get(tokenVault, 'boostedEstimatedAPY', 0)
  const boostedRewardAPY = get(vaultPool, 'boostedRewardAPY', 0)
  const totalApy = isSpecialVault
    ? getTotalApy(null, token, true)
    : getTotalApy(vaultPool, tokenVault)

  const isAmpliFARM = get(vaultPool, 'rewardTokens', []).includes(addresses.BSC.ampliFARM)
  const isHodlVault =
    stringToArray(token.category).includes(VAULT_CATEGORIES_IDS.SUSHI_HODL) || token.hodlVaultId

  if (token.excludeVaultStats) {
    return 'N/A'
  }

  return isSpecialVault ? (
    token.data && token.data.loaded && (token.data.dataFetched === false || totalApy !== null) ? (
      <div
        data-tip=""
        data-for={`tooltip-${tokenSymbol}`}
        onFocus={() => {
          if (!token.inactive && token.data.dataFetched) {
            setTooltipContent(
              getRewardsText(
                token,
                tokens,
                vaultPool,
                tradingApy,
                farmAPY,
                totalApy,
                true,
                boostedEstimatedAPY,
                boostedRewardAPY,
              ),
            )
          }
        }}
        onMouseOver={() => {
          if (!token.inactive && token.data.dataFetched) {
            setTooltipContent(
              getRewardsText(
                token,
                tokens,
                vaultPool,
                tradingApy,
                farmAPY,
                totalApy,
                true,
                boostedEstimatedAPY,
                boostedRewardAPY,
              ),
            )
          }
        }}
        onMouseLeave={() => setTooltipContent(undefined)}
      >
        <RewardsContainer>
          {token.inactive ? (
            'Inactive'
          ) : (
            <>
              {totalApy ? displayAPY(totalApy) : null}
              <FARMIcon token={token} vaultPool={vaultPool} farmAPY={rewardAPY[0]} />
              {size(vaultPool.rewardTokenSymbols) >= 2 &&
                vaultPool.rewardTokenSymbols.map((symbol, symbolIdx) =>
                  symbolIdx !== 0 && symbolIdx < vaultPool.rewardTokens.length ? (
                    <SmallLogo
                      key={symbol}
                      margin="0px 5px 0px 0px"
                      src={`./icons/${symbol.toLowerCase()}.png`}
                    />
                  ) : null,
                )}
            </>
          )}
        </RewardsContainer>
      </div>
    ) : (
      <div>
        <AnimatedDots />
      </div>
    )
  ) : vaultPool.loaded && totalApy !== null && !loadingVaults ? (
    <div
      data-tip=""
      data-for={`tooltip-${tokenSymbol}`}
      onFocus={() => {
        if ((!token.hideTokenApy || !token.hideFarmApy) && !token.inactive && token.dataFetched) {
          setTooltipContent(
            getRewardsText(
              token,
              tokens,
              vaultPool,
              tradingApy,
              farmAPY,
              totalApy,
              isSpecialVault,
              boostedEstimatedAPY,
              boostedRewardAPY,
            ),
          )
        }
      }}
      onMouseOver={() => {
        if ((!token.hideTokenApy || !token.hideFarmApy) && !token.inactive && token.dataFetched) {
          setTooltipContent(
            getRewardsText(
              token,
              tokens,
              vaultPool,
              tradingApy,
              farmAPY,
              totalApy,
              isSpecialVault,
              boostedEstimatedAPY,
              boostedRewardAPY,
            ),
          )
        }
      }}
      onMouseLeave={() => setTooltipContent(undefined)}
    >
      <RewardsContainer>
        {token.inactive || token.testInactive || token.hideTotalApy || !token.dataFetched ? (
          token.inactive || token.testInactive ? (
            'Inactive'
          ) : null
        ) : (
          <>
            <b>
              {isAmpliFARM
                ? `${displayAPY(
                    new BigNumber(totalApy).minus(get(vaultPool, 'boostedRewardAPY', 0)).toFixed(2),
                    DECIMAL_PRECISION,
                    10,
                  )}→${displayAPY(totalApy, DECIMAL_PRECISION, 10)}`
                : displayAPY(totalApy, DECIMAL_PRECISION, 10)}
              &nbsp;
            </b>
            {token.apyIconUrls
              ? token.apyIconUrls.map(url => (
                  <SmallLogo key={url} margin="0px 5px 0px 0px" src={url} />
                ))
              : null}
            {!token.inactive &&
              !isHodlVault &&
              size(vaultPool.rewardTokenSymbols) >= 2 &&
              vaultPool.rewardTokenSymbols.map((symbol, symbolIdx) =>
                symbolIdx !== 0 && symbolIdx < vaultPool.rewardTokens.length ? (
                  <SmallLogo
                    key={symbol}
                    margin="0px 5px 0px 0px"
                    src={`./icons/${symbol.toLowerCase()}.png`}
                  />
                ) : null,
              )}
            <FARMIcon token={token} vaultPool={vaultPool} farmAPY={rewardAPY[0]} />
          </>
        )}
      </RewardsContainer>
    </div>
  ) : (
    <div>
      <AnimatedDots />
    </div>
  )
}

export default VaultApy

import React, { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { get } from 'lodash'
import { FARM_TOKEN_SYMBOL, IFARM_TOKEN_SYMBOL, SPECIAL_VAULTS } from '../../../constants'
import { useVaults } from '../../../providers/Vault'
import { tokens } from '../../../data'
import { fromWei } from '../../../services/web3'
import { formatNumber } from '../../../utils'
import AnimatedDots from '../../AnimatedDots'

const getVaultValue = token => {
  const poolId = get(token, 'data.id')

  switch (poolId) {
    case SPECIAL_VAULTS.FARM_WETH_POOL_ID:
      return get(token, 'data.lpTokenData.liquidity')
    case SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID: {
      if (!get(token, 'data.lpTokenData.price')) {
        return null
      }

      return new BigNumber(get(token, 'data.totalValueLocked', 0))
    }
    case SPECIAL_VAULTS.FARM_GRAIN_POOL_ID:
    case SPECIAL_VAULTS.FARMSTEAD_USDC_POOL_ID:
    case SPECIAL_VAULTS.FARM_USDC_POOL_ID:
      return get(token, 'data.totalValueLocked')
    default:
      return token.usdPrice
        ? new BigNumber(token.underlyingBalanceWithInvestment)
            .times(token.usdPrice)
            .dividedBy(new BigNumber(10).pow(token.decimals))
        : null
  }
}

const VaultValue = ({ token, tokenSymbol, setTooltipContent }) => {
  const { vaultsData } = useVaults()
  const [vaultValue, setVaultValue] = useState(null)
  const [iFARMTotalDeposit, setIFARMTotalDeposit] = useState(null)

  useEffect(() => {
    if (tokenSymbol === FARM_TOKEN_SYMBOL) {
      const iFARMUnderlyingBalanceWithInvestment = get(
        vaultsData,
        `[${IFARM_TOKEN_SYMBOL}].underlyingBalanceWithInvestment`,
        0,
      )
      const farmDecimals = get(token, 'data.lpTokenData.decimals', 18)
      const farmPriceInUSD = get(token, 'data.lpTokenData.price')

      setIFARMTotalDeposit(
        fromWei(
          new BigNumber(iFARMUnderlyingBalanceWithInvestment).times(farmPriceInUSD),
          farmDecimals,
        ),
      )
    }

    setVaultValue(getVaultValue(token))
  }, [token, vaultsData, tokenSymbol])

  return (
    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
    <div
      data-tip=""
      data-for={`tooltip-${tokenSymbol}`}
      onMouseOver={() => {
        if (!token.excludeVaultStats) {
          setTooltipContent(
            tokenSymbol === FARM_TOKEN_SYMBOL ? (
              Number(iFARMTotalDeposit) ? (
                <>
                  Including <b>${formatNumber(iFARMTotalDeposit, 2)}</b> in{' '}
                  <b>{tokens[IFARM_TOKEN_SYMBOL].displayName}</b>
                  <br />
                  (Updates hourly)
                </>
              ) : (
                <AnimatedDots />
              )
            ) : (
              <>Updates hourly</>
            ),
          )
        }
      }}
      onMouseLeave={() => setTooltipContent(undefined)}
    >
      {token.excludeVaultStats ? (
        'N/A'
      ) : vaultValue ? (
        <>{formatNumber(vaultValue, 2)}</>
      ) : (
        <AnimatedDots />
      )}
    </div>
  )
}

export default VaultValue

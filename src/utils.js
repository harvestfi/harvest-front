import BigNumber from 'bignumber.js'
import { get, isArray, isEmpty, size as arraySize, sumBy, sum } from 'lodash'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import ReactHtmlParser from 'react-html-parser'
import mobile from 'is-mobile'
import { addresses } from './data/index'
import {
  KEY_CODES,
  DECIMAL_PRECISION,
  HARVEST_LAUNCH_DATE,
  FARM_TOKEN_SYMBOL,
  DISABLED_DEPOSITS,
  DISABLED_WITHDRAWS,
  MAX_APY_DISPLAY,
  FARM_WETH_TOKEN_SYMBOL,
  FARM_GRAIN_TOKEN_SYMBOL,
  FARM_USDC_TOKEN_SYMBOL,
  SPECIAL_VAULTS,
  ROUTES,
  FARMSTEAD_USDC_TOKEN_SYMBOL,
  AMPLIFARM_TOKEN_SYMBOL,
  UNIV3_POOL_ID_REGEX,
  IFARM_TOKEN_SYMBOL,
  BFARM_TOKEN_SYMBOL,
  MIFARM_TOKEN_SYMBOL,
} from './constants'
import { CHAINS_ID, VAULT_CATEGORIES_IDS } from './data/constants'

axiosRetry(axios, {
  retries: 1,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: error =>
    error.code !== 'ECONNABORTED' && (!error.response || error.response.status >= 303),
})

export const preventNonNumericInput = e =>
  (e.keyCode === KEY_CODES.MINUS || e.keyCode === KEY_CODES.E) && e.preventDefault()

export const preventNonNumericPaste = e => {
  const pastedData = e.clipboardData.getData('Text')
  if (!/^\d*\.?\d+$/.test(pastedData)) {
    e.preventDefault()
  }
}

export const toAPYPercentage = number => {
  let percentage = '0'

  if (number) {
    percentage = new BigNumber(number).toFixed(2, 1)
  }

  return `${percentage}%`
}

export const abbreaviteNumber = (number, decPlaces) => {
  const signs = ['K', 'M', 'B', 'T']
  const adjDecPlaces = 10 ** decPlaces

  if (number < 1 / adjDecPlaces) {
    return number.toFixed(decPlaces)
  }

  for (let i = signs.length - 1; i >= 0; i -= 1) {
    const size = 10 ** ((i + 1) * 3)
    if (size <= number) {
      number = (Math.floor((number * adjDecPlaces) / size) / adjDecPlaces).toFixed(decPlaces)
      number += signs[i]
      break
    }
  }

  if (typeof number === 'number' && number < 1000) {
    return number.toFixed(decPlaces)
  }

  return number
}

export const countDecimals = value => {
  if (typeof value === 'string' && value.split('.').length > 1) {
    return value.split('.')[1].length
  }
  return 0
}

export const truncateNumberString = (
  numberString,
  decimals = DECIMAL_PRECISION,
  maxDigits = false,
) => {
  let truncatedNumberAsBN = new BigNumber(numberString)

  if (truncatedNumberAsBN.dp() > decimals) {
    truncatedNumberAsBN = truncatedNumberAsBN.dp(decimals)
  }

  const truncatedNumberAsString = truncatedNumberAsBN.toString(10)

  if (maxDigits && truncatedNumberAsString && truncatedNumberAsString.length > maxDigits) {
    return `${truncatedNumberAsString.substring(0, maxDigits)}...`
  }

  return truncatedNumberAsBN.isNaN() ? '0' : truncatedNumberAsBN.toFixed(2)
}

export const formatNumber = (number, decimals = DECIMAL_PRECISION) => {
  let result = number

  if (countDecimals(result) > decimals) {
    result = result.substring(0, result.indexOf('.') + decimals + 1)
  }

  return abbreaviteNumber(Number(result), decimals)
}

export const formatAddress = address => {
  if (address) {
    return `${address.substring(0, mobile() ? 4 : 6)}...${address.substring(
      address.length - 4,
      address.length,
    )}`
  }
  return '0x...0'
}

export const getTotalFARMSupply = () => {
  const earlyEmissions = [57569.1, 51676.2, 26400.0, 24977.5]
  const weeksSinceLaunch = Math.floor(
    (new Date() - HARVEST_LAUNCH_DATE) / (7 * 24 * 60 * 60 * 1000),
  ) // Get number of weeks (including partial) between now, and the launch date
  let thisWeeksSupply = 690420

  if (weeksSinceLaunch <= 208) {
    const emissionsWeek5 = 23555.0
    const emissionsWeeklyScale = 0.95554375

    const totalOfEarlyEmissions = sum(earlyEmissions)

    thisWeeksSupply =
      totalOfEarlyEmissions +
      (emissionsWeek5 * (1 - emissionsWeeklyScale ** (weeksSinceLaunch - 4))) /
        (1 - emissionsWeeklyScale)
  }

  return thisWeeksSupply
}

export const getNextEmissionsCutDate = () => {
  const result = new Date()
  result.setUTCHours(19)
  result.setUTCMinutes(0)
  result.setUTCSeconds(0)
  result.setUTCMilliseconds(0)
  result.setUTCDate(result.getUTCDate() + ((2 - result.getUTCDay() + 7) % 7))
  return result
}

export const stringToArray = value => (isArray(value) ? value : [value])

export const getUserVaultBalance = (
  tokenSymbol,
  farmingBalances,
  totalStakedInPool,
  iFARMinFARM,
) => {
  switch (tokenSymbol) {
    case FARM_TOKEN_SYMBOL:
      return new BigNumber(totalStakedInPool).plus(iFARMinFARM).toString()
    case FARM_WETH_TOKEN_SYMBOL:
    case FARM_GRAIN_TOKEN_SYMBOL:
    case FARM_USDC_TOKEN_SYMBOL:
    case FARMSTEAD_USDC_TOKEN_SYMBOL:
      return totalStakedInPool
    default:
      return farmingBalances[tokenSymbol]
        ? farmingBalances[tokenSymbol] === 'error'
          ? false
          : farmingBalances[tokenSymbol]
        : '0'
  }
}

export const getVaultValue = token => {
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
    case SPECIAL_VAULTS.FARMSTEAD_USDC_POOL_ID:
    case SPECIAL_VAULTS.FARM_GRAIN_POOL_ID:
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

const getRewardSymbol = (vault, isIFARM, vaultPool) => {
  switch (true) {
    case !stringToArray(vault.category).includes(VAULT_CATEGORIES_IDS.SUSHI_HODL) &&
      vaultPool &&
      vaultPool.rewardTokenSymbols.length > 1:
      return vaultPool.rewardTokenSymbols
        .filter((_, symbolIdx) => Number(get(vaultPool, `rewardAPY[${symbolIdx}]`, 0)) !== 0)
        .join(', ')
    case vault.chain === CHAINS_ID.BSC_MAINNET:
      return 'bFARM'
    case vault.chain === CHAINS_ID.MATIC_MAINNET:
      return 'miFARM'
    case isIFARM:
      return 'iFARM'
    default:
      return 'FARM'
  }
}

export const displayAPY = (apy, ...args) =>
  new BigNumber(apy).isGreaterThan(MAX_APY_DISPLAY)
    ? `${MAX_APY_DISPLAY}%+`
    : `${truncateNumberString(apy, ...args)}%`

export const getRewardsText = (
  token,
  tokens,
  vaultPool,
  tradingApy,
  farmAPY,
  specialVaultApy,
  isSpecialVault,
  boostedEstimatedAPY,
  boostedRewardAPY,
) => {
  const components = []

  const isUniv3Vault = !!(vaultPool && new RegExp(UNIV3_POOL_ID_REGEX).test(vaultPool.id))
  const hasAmplifarmReward = !!(
    vaultPool && vaultPool.rewardTokenSymbols.find(symbol => symbol === AMPLIFARM_TOKEN_SYMBOL)
  )

  if (
    vaultPool &&
    (isUniv3Vault || (vaultPool.rewardTokenSymbols.length > 1 && !hasAmplifarmReward))
  ) {
    const rewardSymbols = !isUniv3Vault
      ? token.apyTokenSymbols
      : token.apyTokenSymbols.filter(symbol => symbol !== 'UNI')

    if (rewardSymbols && rewardSymbols.length) {
      rewardSymbols.forEach((symbol, i) => {
        if (get(token, `estimatedApyBreakdown[${i}]`)) {
          components.push(
            `${
              new BigNumber(token.estimatedApyBreakdown[i]).gt(0)
                ? `<b>${displayAPY(token.estimatedApyBreakdown[i])}</b>:`
                : `...:`
            } ${get(
              token,
              `apyDescriptionOverride[${i}]`,
              `Auto harvested <b>${
                rewardSymbols.length > 1 && token.estimatedApyBreakdown.length === 1
                  ? rewardSymbols.join(', ')
                  : symbol
              }</b>`,
            )}`,
          )
        }
      })
    }

    const hasBoostedApy = new BigNumber(boostedRewardAPY).isGreaterThan(0)

    if (hasBoostedApy) {
      components.push(
        `<b>${displayAPY(boostedRewardAPY)}</b> <b>iFARM</b> auto-compounding rewards`,
      )
    }

    if (Number(farmAPY) > 0) {
      vaultPool.rewardTokenSymbols.forEach((symbol, symbolIdx) => {
        const farmSymbols = [
          FARM_TOKEN_SYMBOL,
          IFARM_TOKEN_SYMBOL,
          BFARM_TOKEN_SYMBOL,
          MIFARM_TOKEN_SYMBOL,
        ]

        if (token.hideFarmApy && farmSymbols.includes(symbol)) {
          return
        }

        if (
          (!hasBoostedApy || !!symbolIdx) &&
          new BigNumber(get(vaultPool, `rewardAPY[${symbolIdx}]`, 0)).isGreaterThan(0)
        ) {
          components.push(
            `<b>${displayAPY(
              get(vaultPool, `rewardAPY[${symbolIdx}]`, 0),
            )}</b>: <b>${symbol}</b> rewards`,
          )

          if (Object.keys(get(vaultPool, 'vestingDescriptionOverride', [])).includes(symbol)) {
            components.push(vaultPool.vestingDescriptionOverride[symbol])
          }
        }
      })
    }

    if (isUniv3Vault) {
      components.push(
        `Earn Uniswap v3 trading fees ${
          new BigNumber(tradingApy).gt(0) ? `estimated at <b>${displayAPY(tradingApy)}</b>` : ``
        }`,
      )
    } else if (Number(tradingApy) > 0) {
      components.push(`<b>${displayAPY(tradingApy)}</b>: Liquidity Provider APY<br/>`)
    }

    const tooltipText = `<ul style="margin: 5px; padding-left: 15px; text-align: left;">${components
      .filter(c => !isEmpty(c))
      .map(c => `<li align="left" style="margin: -5px;">${c}</li>`)
      .join('<br />')}</ul>`

    return ReactHtmlParser(tooltipText)
  }

  if (vaultPool.id === 'fweth-farm') {
    components.push(`<b>${displayAPY(farmAPY)}:</b> <b>FARM</b> rewards`)
    if (Object.keys(get(vaultPool, 'vestingDescriptionOverride', [])).includes(FARM_TOKEN_SYMBOL)) {
      components.push(vaultPool.vestingDescriptionOverride[FARM_TOKEN_SYMBOL])
    }
    components.push(
      `<b>${displayAPY(token.estimatedApy)}</b>: Auto harvested <b>${token.apyTokenSymbols.join(
        ', ',
      )}</b>`,
    )

    const tooltipText = `<ul style="margin: 5px; padding-left: 15px; text-align: left;">${components
      .filter(c => !isEmpty(c))
      .map(c => `<li align="left" style="margin: -5px;">${c}</li>`)
      .join('<br />')}</ul>`

    return ReactHtmlParser(tooltipText)
  }

  const isIFARM = vaultPool.rewardTokens[0] === addresses.iFARM
  const isAmpliFARM = get(vaultPool, 'rewardTokens').includes(addresses.BSC.ampliFARM)
  const isHodlVault =
    stringToArray(token.category).includes(VAULT_CATEGORIES_IDS.SUSHI_HODL) || token.hodlVaultId

  if (isSpecialVault && vaultPool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID) {
    components.push(
      `<b> ${specialVaultApy > 0 ? `<b>${displayAPY(specialVaultApy)}</b>` : 'N/A'}: ${
        token.rewardSymbol
      }</b> rewards<br/>`,
    )
  } else {
    if (!token.hideTokenApy) {
      if (Number(tradingApy) > 0) {
        components.push(`<b>${displayAPY(tradingApy)}</b>: Liquidity Provider APY<br/>`)
      }

      if (arraySize(token.apyTokenSymbols)) {
        if (token.apyOverride) {
          components.push(`<b>${token.apyOverride}</b>`)
        } else if (Number(token.estimatedApy) > 0) {
          let apyString = ''

          if (token.apyDescriptionOverride && token.apyDescriptionOverride.length) {
            token.apyTokenSymbols.forEach((symbol, symbolIdx) => {
              const extraDescription = token.apyDescriptionOverride[symbolIdx]

              apyString += `<b>${
                token.estimatedApyBreakdown
                  ? displayAPY(token.estimatedApyBreakdown[symbolIdx])
                  : '...'
              }</b>: Auto harvested <b>${symbol}</b>`

              if (extraDescription) {
                apyString += ` ${extraDescription}<br/>`
              } else {
                apyString += `<br/>`
              }
            })
          } else {
            apyString += `<b>${
              isIFARM && token.fullBuyback
                ? displayAPY(boostedEstimatedAPY)
                : displayAPY(token.estimatedApy)
            }</b>: Auto ${
              isHodlVault ? 'hodling <b>SUSHI<b> in' : 'harvested'
            } <b>${token.apyTokenSymbols.join(', ')}${
              isIFARM && token.fullBuyback ? ` <b>(${displayAPY(token.estimatedApy)})</b>` : ``
            }</b>${
              token.fullBuyback ||
              (token.tokenAddress !== addresses.V2.SUSHI.Underlying && isHodlVault)
                ? ``
                : `<br/>`
            }`
          }

          if (token.fullBuyback) {
            if (isIFARM) {
              apyString += ` claimable as auto-compounded <b>${getRewardSymbol(
                token,
                true,
              )}</b> boosting APY to <b>${displayAPY(boostedEstimatedAPY)}</b><br/>`
            } else {
              apyString += ` (claimable as <b>${getRewardSymbol(
                token,
              )}</b> using <b>Claim Rewards</b>)<br/>`
            }
          }

          if (token.tokenAddress !== addresses.V2.SUSHI.Underlying && isHodlVault) {
            if (
              token.migrated &&
              (token.vaultAddress === addresses.V2.oneInch_ETH_DAI.NewVault ||
                token.vaultAddress === addresses.V2.oneInch_ETH_USDC.NewVault ||
                token.vaultAddress === addresses.V2.oneInch_ETH_USDT.NewVault ||
                token.vaultAddress === addresses.V2.oneInch_ETH_WBTC.NewVault)
            ) {
              apyString += ` (sent as <b>fSUSHI</b> alongside with <b>${getRewardSymbol(
                token,
                isIFARM,
              )}</b> <u>upon withdrawal</u>)<br/>`
            } else {
              apyString += ` (claimable as <b>fSUSHI</b> using <b>Claim Rewards</b>)<br/>`
            }
          }

          components.push(apyString)
        }
      }
    }

    if (!token.hideFarmApy && Number(farmAPY) > 0) {
      let apyString = `<b>${
        isIFARM || (isAmpliFARM && Number(boostedRewardAPY) > 0)
          ? displayAPY(boostedRewardAPY)
          : displayAPY(farmAPY)
      }</b>: <b>${getRewardSymbol(token, isIFARM, vaultPool)}</b> rewards${
        isIFARM || isAmpliFARM ? `` : `<br/>`
      }${
        isIFARM || (isAmpliFARM && Number(boostedRewardAPY) > 0)
          ? ` (<b>${displayAPY(farmAPY)})</b>`
          : ''
      }`

      if (Number(boostedRewardAPY) > 0) {
        if (isIFARM) {
          apyString += ` boosted to <b>${displayAPY(
            boostedRewardAPY,
          )}</b> by <b style="display: contents;">${getRewardSymbol(
            token,
            true,
          )}</b> auto-compounding`
        }

        if (isAmpliFARM) {
          apyString += ` boosted to <b>${displayAPY(
            boostedRewardAPY,
          )}</b> when <b>${truncateNumberString(
            vaultPool.amountToStakeForBoost,
          )}</b> <b>bFARM</b> is <a href='${
            ROUTES.AMPLIFARM
          }'>staked for 2 years on the Booster page</a>`
        }
      }

      components.push(apyString)
    }
  }

  const tooltipText = `<div align="left">${components.join('')}</div>`

  return ReactHtmlParser(tooltipText)
}

export const getTotalApy = (vaultPool, token, isSpecialVault) => {
  const vaultData = isSpecialVault ? token.data : vaultPool

  if (isSpecialVault && vaultData.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID) {
    if (Number(token.profitShareAPY) <= 0) {
      return null
    }
    return Number.isNaN(Number(token.profitShareAPY)) ? 0 : Number(token.profitShareAPY).toFixed(2)
  }

  let farmAPY = token.hideFarmApy
      ? sumBy(
          vaultPool.rewardAPY.filter((_, index) => index !== 0),
          apy => Number(apy),
        )
      : get(vaultData, 'totalRewardAPY', 0),
    total

  const tradingAPY = get(vaultData, 'tradingApy', 0)
  const estimatedApy = get(token, 'estimatedApy', 0)
  const boostedEstimatedApy = get(token, 'boostedEstimatedAPY', 0)
  const boostedRewardApy = get(vaultData, 'boostedRewardAPY', 0)

  if (new BigNumber(farmAPY).gte(MAX_APY_DISPLAY)) {
    farmAPY = MAX_APY_DISPLAY
  }

  total = new BigNumber(tradingAPY).plus(
    token.fullBuyback && new BigNumber(boostedEstimatedApy).gt(0)
      ? boostedEstimatedApy
      : estimatedApy,
  )

  if (new BigNumber(farmAPY).gt(0)) {
    if (new BigNumber(boostedRewardApy).gt(0)) {
      total = total.plus(boostedRewardApy)

      if (vaultPool && vaultPool.rewardTokenSymbols.length >= 2) {
        total = total.plus(sumBy(vaultPool.rewardAPY.slice(1), apy => Number(apy)))
      }
    } else {
      total = total.plus(farmAPY)
    }
  }

  if (total.isNaN()) {
    return null
  }

  return total.toFixed(2)
}

export const hasValidAmountForInputAndMaxButton = (
  userBalance,
  lpTokenBalance,
  totalStaked,
  tokenSymbol,
  withdrawMode,
  isSpecialVault,
  iFARMBalance,
  useIFARM,
) => {
  if (tokenSymbol === FARM_TOKEN_SYMBOL && withdrawMode && !useIFARM) {
    return false
  }

  if (!withdrawMode) {
    return (
      new BigNumber(isSpecialVault ? lpTokenBalance : userBalance).isGreaterThan(0) &&
      DISABLED_DEPOSITS.indexOf(tokenSymbol) === -1
    )
  }

  if (isSpecialVault) {
    return (
      new BigNumber(useIFARM ? iFARMBalance : totalStaked).isGreaterThan(0) &&
      DISABLED_WITHDRAWS.indexOf(tokenSymbol) === -1
    )
  }
  return (
    new BigNumber(totalStaked).plus(lpTokenBalance).isGreaterThan(0) &&
    DISABLED_WITHDRAWS.indexOf(tokenSymbol) === -1
  )
}

export const hasValidAmountForWithdraw = (
  amountToExecute,
  unstakedBalance,
  totalStaked,
  autoUnStake,
) => {
  const amountToExecuteInBN = new BigNumber(amountToExecute)
  const unstakedBalanceInBN = new BigNumber(unstakedBalance)
  const totalBalanceInBN = new BigNumber(unstakedBalance).plus(totalStaked)

  if (amountToExecuteInBN.isGreaterThan(0)) {
    if (autoUnStake && amountToExecuteInBN.isGreaterThan(unstakedBalanceInBN)) {
      const amountToUnStake = amountToExecuteInBN.minus(unstakedBalanceInBN)
      return (
        totalBalanceInBN.isGreaterThanOrEqualTo(amountToExecuteInBN) &&
        amountToUnStake.isLessThanOrEqualTo(totalStaked)
      )
    }
    return unstakedBalanceInBN.isGreaterThanOrEqualTo(amountToExecute)
  }
  return false
}

export const hasAmountLessThanOrEqualTo = (primaryAmount, secondaryAmount) =>
  new BigNumber(secondaryAmount).isGreaterThanOrEqualTo(primaryAmount)

export const hasAmountGreaterThanZero = amount => new BigNumber(amount).isGreaterThan(0)

export const hasRequirementsForInteraction = (loaded, pendingAction, vaultsData, loadingBalances) =>
  loaded === true && pendingAction === null && !isEmpty(vaultsData) && !loadingBalances

export const convertAmountToFARM = (token, balance, decimals, vaultsData) => {
  const pricePerFullShare = get(vaultsData, `[${token}].pricePerFullShare`, 0)

  return new BigNumber(balance)
    .times(pricePerFullShare)
    .dividedBy(new BigNumber(10).exponentiatedBy(decimals))
    .toString()
}

export function CustomException(message, code) {
  this.message = message
  this.code = code
}

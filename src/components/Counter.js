import BigNumber from 'bignumber.js'
import { get, toArray } from 'lodash'
import React from 'react'
import CountUp from 'react-countup'
import { POOL_BALANCES_DECIMALS } from '../constants'
import { fromWei } from '../services/web3'
import { formatNumber } from '../utils'

const { tokens } = require('../data')
const { POOL_TYPES } = require('../data/constants')

const nowInSeconds = Date.now() / 1000

const Counter = ({
  pool,
  totalTokensEarned,
  totalStaked,
  ratePerDay,
  rewardPerToken,
  rewardTokenAddress,
}) => {
  if (!!pool.autoStakePoolAddress && Number(totalStaked) <= 0) {
    return 'Auto-Compounding'
  }

  if (!pool.autoStakePoolAddress && Number(totalTokensEarned) <= 0) {
    return '0.00000000'
  }

  const rewardToken = toArray(tokens).find(token => token.tokenAddress === rewardTokenAddress)

  const rewardPerTokenInEther = new BigNumber(rewardPerToken).dividedBy(
    new BigNumber(10).exponentiatedBy(get(rewardToken, 'decimals', 18)),
  )

  const sharingPoolEndTarget = fromWei(
    new BigNumber(totalStaked).multipliedBy(rewardPerTokenInEther).toNumber(),
    pool.lpTokenData.decimals,
  )

  const totalStakedInEther = fromWei(totalStaked, pool.lpTokenData.decimals)

  switch (true) {
    case pool.type === POOL_TYPES.UNIV3:
    case pool.type === POOL_TYPES.INCENTIVE:
    case pool.type === POOL_TYPES.INCENTIVE_BUYBACK:
      return (
        <CountUp
          start={Number(totalTokensEarned)}
          end={Number(totalTokensEarned) + Number(totalTokensEarned) * Number(ratePerDay)}
          useEasing={false}
          separator=","
          formattingFn={number => formatNumber(number, POOL_BALANCES_DECIMALS)}
          delay={0}
          decimals={POOL_BALANCES_DECIMALS}
          duration={86400}
        />
      )
    case pool.type === POOL_TYPES.PROFIT_SHARING && !!pool.autoStakePoolAddress:
      return (
        <CountUp
          start={Number(totalStakedInEther)}
          end={Number(totalStakedInEther) + Number(totalStakedInEther) * Number(ratePerDay)}
          useEasing={false}
          separator=","
          formattingFn={number => formatNumber(number, POOL_BALANCES_DECIMALS)}
          delay={0}
          decimals={POOL_BALANCES_DECIMALS}
          duration={86400}
        />
      )
    case pool.finishTime > nowInSeconds && pool.type === POOL_TYPES.PROFIT_SHARING:
      return (
        <CountUp
          start={Number(totalTokensEarned)}
          end={sharingPoolEndTarget}
          useEasing={false}
          separator=","
          formattingFn={number => formatNumber(number, POOL_BALANCES_DECIMALS)}
          delay={0}
          decimals={POOL_BALANCES_DECIMALS}
          duration={pool.finishTime - nowInSeconds}
        />
      )
    default:
      return '0.000000000'
  }
}

export default Counter

import equal from 'fast-deep-equal/react'
import { get } from 'lodash'
import { forEach } from 'promised-loops'
import BigNumber from 'bignumber.js'
import tokenContract from '../../services/web3/contracts/token/contract.json'
import tokenMethods from '../../services/web3/contracts/token/methods'
import poolMethods from '../../services/web3/contracts/pool/methods'
import { newContractInstance } from '../../services/web3'
import { POLL_POOL_USER_DATA_INTERVAL_MS } from '../../constants'

const { pools, tokens } = require('../../data')

export const calculateTotalRewardsEarned = async (account, contractInstance) => {
  const { totalEarned: earned } = poolMethods

  let totalEarned = '0'

  if (account) {
    totalEarned = await earned(account, contractInstance)
  }

  return totalEarned
}

export const calculateRewardsEarned = async (rewardAddress, account, contractInstance) => {
  const { earned } = poolMethods

  let totalEarned = '0'

  if (account) {
    totalEarned = await earned(rewardAddress, account, contractInstance)
  }

  return totalEarned
}

export const getTotalStaked = async (account, contractInstance) => {
  const { balanceOf } = poolMethods

  if (account) {
    const fetchedBalance = await balanceOf(account, contractInstance)

    return fetchedBalance
  }

  return '0'
}

export const getLpTokenData = async (poolInstance, web3Provider) => {
  const { lpToken } = poolMethods

  const { abi: tokenAbi } = tokenContract
  const { getDecimals, getSymbol } = tokenMethods

  const lpAddress = await lpToken(poolInstance)
  const lpInstance = await newContractInstance(null, lpAddress, tokenAbi, web3Provider)

  const lpDecimals = await getDecimals(lpInstance)
  const lpSymbol = await getSymbol(lpInstance)

  return {
    address: lpAddress,
    decimals: lpDecimals,
    symbol: lpSymbol,
  }
}

export const getUserStats = async (
  poolContractInstance,
  lpTokenContractInstance,
  poolContractAddress,
  autoStakePoolAddress,
  account,
  autoStakeContractInstance,
) => {
  let lpTokenBalance = '0',
    lpTokenApprovedBalance = '0',
    totalStaked = '0',
    totalRewardsEarned = '0'

  const rewardsEarned = {}

  if (account) {
    totalStaked = await getTotalStaked(account, autoStakeContractInstance || poolContractInstance)

    const rewardTokenSymbols = get(
      pools.find(pool => pool.contractAddress === poolContractAddress),
      'rewardTokenSymbols',
      [],
    )

    const rewardTokens = get(
      pools.find(pool => pool.contractAddress === poolContractAddress),
      'rewardTokens',
      [],
    )

    if (rewardTokenSymbols.length > 1) {
      totalRewardsEarned = new BigNumber(0)

      await forEach(rewardTokenSymbols, async (symbol, index) => {
        const rewardAddress = rewardTokens[index] || tokens[symbol].tokenAddress

        rewardsEarned[symbol] = await calculateRewardsEarned(
          rewardAddress,
          account,
          poolContractInstance,
        )
        totalRewardsEarned = totalRewardsEarned.plus(new BigNumber(rewardsEarned[symbol]))
      })

      totalRewardsEarned = totalRewardsEarned.toFixed()
    } else {
      totalRewardsEarned = await calculateTotalRewardsEarned(account, poolContractInstance)
    }

    lpTokenBalance = await tokenMethods.getBalance(account, lpTokenContractInstance)
    lpTokenApprovedBalance = await tokenMethods.getApprovedAmount(
      account,
      autoStakePoolAddress || poolContractAddress,
      lpTokenContractInstance,
    )
  }

  return {
    lpTokenBalance,
    lpTokenApprovedBalance,
    totalStaked,
    totalRewardsEarned,
    rewardsEarned,
  }
}

export const pollUpdatedUserStats = (method, currStats, onTimeout, onSuccess, maxRetries = 2) =>
  new Promise((resolve, reject) => {
    let retries = 0
    const pollStats = setInterval(() => {
      if (retries >= maxRetries) {
        clearInterval(pollStats)
        resolve(onTimeout())
      }

      retries += 1

      method
        .then(fetchedStats => {
          if (!equal(fetchedStats, currStats)) {
            resolve(onSuccess(fetchedStats))
            clearInterval(pollStats)
          }
        })
        .catch(err => {
          console.error(err)
          reject(err)
        })
    }, POLL_POOL_USER_DATA_INTERVAL_MS)
  })

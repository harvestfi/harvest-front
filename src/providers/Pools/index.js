import React, { useCallback, createContext, useContext, useState, useMemo, useRef } from 'react'
// eslint-disable-next-line import/no-unresolved
import { useInterval } from 'react-interval-hook'
import isEqual from 'fast-deep-equal/react'
import axios from 'axios'
import { filter, get, map, sumBy } from 'lodash'
import useEffectWithPrevious from 'use-effect-with-previous'
import { toast } from 'react-toastify'
import { forEach } from 'promised-loops'
import { getLpTokenData, getUserStats, pollUpdatedUserStats } from './utils'
import { POLL_POOL_DATA_INTERVAL_MS, POOLS_API_ENDPOINT, SPECIAL_VAULTS } from '../../constants'
import { truncateNumberString } from '../../utils'
import { newContractInstance, getWeb3 } from '../../services/web3'
import tokenContract from '../../services/web3/contracts/token/contract.json'
import tokenMethods from '../../services/web3/contracts/token/methods'
import poolContractData from '../../services/web3/contracts/pool/contract.json'
import { useWallet } from '../Wallet'
import { useContracts } from '../Contracts'
import { CHAINS_ID } from '../../data/constants'

const { pools: defaultPools, tokens } = require('../../data')

const PoolsContext = createContext()
const usePools = () => useContext(PoolsContext)

const getReader = (selectedChain, contracts) => {
  switch (String(selectedChain)) {
    case CHAINS_ID.BSC_MAINNET:
      return contracts.readerBsc
    case CHAINS_ID.MATIC_MAINNET:
      return contracts.readerMatic
    default:
      return contracts.readerEth
  }
}

const PoolsProvider = _ref => {
  const { children } = _ref
  const { account, chain, balances: walletBalances } = useWallet()
  const { contracts } = useContracts()
  const [pools, setPools] = useState(defaultPools)
  const [userStats, setUserStats] = useState([])
  const [loadingUserPoolStats, setLoadingUserPoolStats] = useState(false)
  const loadedUserPoolsWeb3Provider = useRef(false)
  const loadedInitialStakedAndUnstakedBalances = useRef(false)
  const loadedPools = useMemo(() => filter(pools, pool => pool.chain === chain), [chain, pools])
  const formatPoolsData = useCallback(
    async apiData => {
      const formattedPools = await Promise.all(
        defaultPools.map(async pool => {
          const web3Client = getWeb3(pool.chain, account)
          let rewardAPY = ['0'],
            rewardAPR = ['0'],
            autoStakeContractInstance = null,
            lpTokenData,
            rewardPerToken = ['0'],
            totalSupply = '0',
            finishTime = '0',
            totalValueLocked = '0',
            tradingApy = '0',
            boostedRewardAPY = '0',
            lpTokenInstance = null,
            amountToStakeForBoost = null,
            dataFetched = null
          const contractInstance = await newContractInstance(
            null,
            pool.contractAddress,
            poolContractData.abi,
            web3Client,
          )
          const apiPool =
            apiData && apiData.find(fetchedPool => fetchedPool && fetchedPool.id === pool.id)

          if (apiPool) {
            rewardAPY = map(apiPool.rewardAPY, apy => truncateNumberString(apy))
            rewardAPR = map(apiPool.rewardAPR, apr => truncateNumberString(apr))
            tradingApy = truncateNumberString(apiPool.tradingApy)
            lpTokenData = apiPool.lpTokenData
            rewardPerToken = apiPool.rewardPerToken
            totalSupply = apiPool.totalSupply
            finishTime = apiPool.finishTime
            totalValueLocked = apiPool.totalValueLocked
            boostedRewardAPY = apiPool.boostedRewardAPY
            amountToStakeForBoost = apiPool.amountToStakeForBoost
            lpTokenInstance = await newContractInstance(
              null,
              apiPool.lpTokenData.address,
              tokenContract.abi,
              web3Client,
            )
            dataFetched = true
          } else if (!pool.breadPage && !pool.fake) {
            lpTokenData = await getLpTokenData(contractInstance, web3Client)
            lpTokenInstance = await newContractInstance(
              null,
              lpTokenData.address,
              tokenContract.abi,
              web3Client,
            )
            dataFetched = false
          }

          if (pool.autoStakePoolAddress) {
            autoStakeContractInstance = await newContractInstance(
              null,
              pool.autoStakePoolAddress,
              poolContractData.abi,
              web3Client,
            )
          }

          return {
            ...pool,
            rewardAPY,
            amountToStakeForBoost,
            totalRewardAPY: sumBy(rewardAPY, apy => Number(apy)),
            rewardAPR,
            tradingApy,
            contractInstance,
            autoStakeContractInstance,
            lpTokenData: { ...lpTokenData, instance: lpTokenInstance },
            rewardPerToken,
            totalSupply,
            finishTime,
            totalValueLocked,
            loaded: true,
            boostedRewardAPY,
            dataFetched,
          }
        }),
      )

      if (account) {
        loadedUserPoolsWeb3Provider.current = true
      }

      return formattedPools
    },
    [account],
  )
  const getPoolsData = useCallback(async () => {
    let newPools = []

    try {
      const apiResponse = await axios.get(POOLS_API_ENDPOINT)
      const apiData = get(apiResponse, 'data')
      newPools = await formatPoolsData([...apiData.bsc, ...apiData.eth, ...apiData.matic])
    } catch (err) {
      console.error(err)

      if (!toast.isActive('pool-api-error')) {
        toast.error(
          'FARM APYs are temporarily unavailable. Also, please check your internet connection',
          {
            toastId: 'pool-api-error',
          },
        )
      }

      newPools = await formatPoolsData()
    }

    setPools(newPools)
  }, [formatPoolsData])
  useEffectWithPrevious(
    _ref2 => {
      const [prevAccount] = _ref2

      if (account !== prevAccount && account && !loadedUserPoolsWeb3Provider.current) {
        const setCurrentPoolsWithUserProvider = async () => {
          const poolsWithUpdatedProvider = await formatPoolsData(pools)
          setPools(poolsWithUpdatedProvider)
        }

        setCurrentPoolsWithUserProvider()
      }
    },
    [account, pools],
  )
  useEffectWithPrevious(
    _ref3 => {
      const [prevChain, prevAccount] = _ref3
      const hasSwitchedChain = chain !== prevChain
      const hasSwitchedAccount = account !== prevAccount && account

      if (
        (hasSwitchedChain ||
          hasSwitchedAccount ||
          !loadedInitialStakedAndUnstakedBalances.current) &&
        loadedUserPoolsWeb3Provider.current
      ) {
        const loadInitialStakedAndUnstakedBalances = async () => {
          loadedInitialStakedAndUnstakedBalances.current = true
          const readerType = getReader(chain, contracts)
          const poolAddresses = []
          const vaultAddresses = []
          loadedPools.forEach(pool => {
            poolAddresses.push(pool.contractAddress)

            if (!Object.values(SPECIAL_VAULTS).includes(pool.id)) {
              vaultAddresses.push(pool.lpTokenData.address)
            }
          })
          const readerInstance = readerType.instance
          const readerMethods = readerType.methods
          const balances = await readerMethods.getAllInformation(
            account,
            vaultAddresses,
            poolAddresses,
            readerInstance,
          )
          const stats = {}
          await forEach(loadedPools, async (pool, i) => {
            let lpTokenBalance
            const isSpecialVault = !vaultAddresses.includes(pool.lpTokenData.address)

            if (isSpecialVault) {
              const lpSymbol = Object.keys(tokens).filter(
                symbol => tokens[symbol].tokenAddress === pool.lpTokenData.address,
              )
              lpTokenBalance = !walletBalances[lpSymbol]
                ? await tokenMethods.getBalance(account, pool.lpTokenData.instance)
                : walletBalances[lpSymbol]
            } else {
              const lpTokenBalanceIdx = vaultAddresses.findIndex(
                address => address === pool.lpTokenData.address,
              )
              lpTokenBalance = balances[0][lpTokenBalanceIdx]
            }

            stats[pool.id] = {
              lpTokenBalance,
              totalStaked: balances[1][i],
            }
          })
          setUserStats(currStats => ({ ...currStats, ...stats }))
        }

        loadInitialStakedAndUnstakedBalances()
      }
    },
    [chain, account, loadedPools, contracts, walletBalances],
  )
  useInterval(() => getPoolsData(), POLL_POOL_DATA_INTERVAL_MS, {
    immediate: true,
  })
  // eslint-disable-next-line func-names
  const fetchUserPoolStats = useCallback(async function (
    selectedPools,
    selectedAccount,
    currentStats,
  ) {
    // eslint-disable-next-line no-void
    if (currentStats === void 0) {
      currentStats = []
    }

    const stats = {}

    if (loadedUserPoolsWeb3Provider.current) {
      setLoadingUserPoolStats(true)
      await Promise.all(
        selectedPools.map(async pool => {
          const fetchedStats = await getUserStats(
            pool.contractInstance,
            pool.lpTokenData.instance,
            pool.contractAddress,
            pool.autoStakePoolAddress,
            selectedAccount,
            pool.autoStakeContractInstance,
          )

          if (!isEqual(fetchedStats, currentStats[pool.id])) {
            stats[pool.id] = fetchedStats
          } else {
            await pollUpdatedUserStats(
              getUserStats(
                pool.contractInstance,
                pool.lpTokenData.instance,
                pool.contractAddress,
                pool.autoStakePoolAddress,
                selectedAccount,
                pool.autoStakeContractInstance,
              ),
              currentStats,
              () => {
                console.error(`Something went wrong during the fetching of ${pool.id} user stats`)
              },
              updatedStats => {
                stats[pool.id] = updatedStats
              },
            )
          }
        }),
      )
      setUserStats(currStats => ({ ...currStats, ...stats }))
      setLoadingUserPoolStats(false)
    }

    return stats
  },
  [])
  return React.createElement(
    PoolsContext.Provider,
    {
      value: {
        pools: loadedPools,
        fetchUserPoolStats,
        userStats,
        loadedUserPoolsWeb3Provider: loadedUserPoolsWeb3Provider.current,
        loadingUserPoolStats,
      },
    },
    children,
  )
}

export { PoolsProvider, usePools }

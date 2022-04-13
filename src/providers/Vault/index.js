import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react'
import BigNumber from 'bignumber.js'
import { forEach } from 'promised-loops'
import axios from 'axios'
import { get, pickBy, merge, isArray } from 'lodash'
import { toast } from 'react-toastify'
import useEffectWithPrevious from 'use-effect-with-previous'
import { calculateFarmingBalance, filterVaults } from './utils'
import { IFARM_TOKEN_SYMBOL, VAULTS_API_ENDPOINT } from '../../constants'
import { useWallet } from '../Wallet'
import { usePools } from '../Pools'
import vaultContractData from '../../services/web3/contracts/vault/contract.json'
import vaultMethods from '../../services/web3/contracts/vault/methods'
import univ3ContractData from '../../services/web3/contracts/uniswap-v3/contract.json'
import {
  getWeb3,
  hasValidUpdatedBalance,
  newContractInstance,
  pollUpdatedBalance,
} from '../../services/web3'
import { abbreaviteNumber } from '../../utils'

const { tokens, addresses } = require('../../data')

const VaultsContext = createContext()
const useVaults = () => useContext(VaultsContext)

const importedVaults = pickBy(
  tokens,
  token => token.vaultAddress || token.tokenAddress === addresses.iFARM,
)

const { getUnderlyingBalanceWithInvestment, getPricePerFullShare, getTotalSupply } = vaultMethods

const VaultsProvider = _ref => {
  const { children } = _ref
  const { account, chain } = useWallet()
  const { pools, userStats } = usePools()
  const [loadingVaults, setLoadingVaults] = useState(true)
  const [loadingFarmingBalances, setLoadingFarmingBalances] = useState(false)
  const [farmingBalances, setFarmingBalances] = useState({})
  const [vaultsData, setVaults] = useState(importedVaults)
  const loadedVaults = useMemo(() => pickBy(vaultsData, vault => vault.chain === chain), [
    chain,
    vaultsData,
  ])
  const initialFetch = useRef(true)
  const loadedUserVaultsWeb3Provider = useRef(false)
  const setFormattedVaults = useCallback(
    async (apiData, apiFailed) => {
      const formattedVaults = {}
      await forEach(Object.keys(importedVaults), async vaultSymbol => {
        const vaultChain = get(importedVaults, `[${vaultSymbol}].chain`)
        const web3Client = getWeb3(vaultChain, account)
        const tokenPool = pools.find(
          pool => pool.collateralAddress === importedVaults[vaultSymbol].vaultAddress,
        )
        let estimatedApy = null,
          estimatedApyBreakdown = [],
          usdPrice = null,
          underlyingBalanceWithInvestment = '0',
          pricePerFullShare = '0',
          totalSupply = '0',
          boostedEstimatedAPY = null,
          uniswapV3PositionId = null,
          uniswapV3UnderlyingTokenPrices = [],
          { subLabel } = importedVaults[vaultSymbol],
          uniswapV3ManagedData = null,
          dataFetched = false

        const isIFARM = vaultSymbol === IFARM_TOKEN_SYMBOL
        const hasMultipleAssets = isArray(importedVaults[vaultSymbol].tokenAddress)
        const instance = await newContractInstance(
          null,
          isIFARM
            ? importedVaults[vaultSymbol].tokenAddress
            : importedVaults[vaultSymbol].vaultAddress,
          hasMultipleAssets ? univ3ContractData.abi : vaultContractData.abi,
          web3Client,
        )

        if (apiData && apiData[vaultSymbol]) {
          estimatedApy = apiData[vaultSymbol].estimatedApy
          estimatedApyBreakdown = apiData[vaultSymbol].estimatedApyBreakdown
          boostedEstimatedAPY = apiData[vaultSymbol].boostedEstimatedAPY
          usdPrice = apiData[vaultSymbol].usdPrice
          underlyingBalanceWithInvestment = apiData[vaultSymbol].underlyingBalanceWithInvestment
          totalSupply = apiData[vaultSymbol].totalSupply
          pricePerFullShare = importedVaults[vaultSymbol].pricePerFullShareOverride
            ? importedVaults[vaultSymbol].pricePerFullShareOverride
            : apiData[vaultSymbol].pricePerFullShare
          uniswapV3PositionId = apiData[vaultSymbol].uniswapV3PositionId
          uniswapV3UnderlyingTokenPrices = apiData[vaultSymbol].uniswapV3UnderlyingTokenPrices
          if (apiData[vaultSymbol].uniswapV3ManagedData) {
            const { capLimit, currentCap, ranges } = apiData[vaultSymbol].uniswapV3ManagedData
            const upper = abbreaviteNumber(Math.floor(ranges[0].upperBound / 100) * 100, 1)
            const lower = abbreaviteNumber(
              Math.floor(ranges[ranges.length - 1].lowerBound / 100) * 100,
              1,
            )
            subLabel = `${lower.toString()}⟷${upper.toString()}`
            uniswapV3ManagedData = {
              ...apiData[vaultSymbol].uniswapV3ManagedData,
              capLimit,
              currentCap,
              maxToDeposit: new BigNumber(capLimit).minus(new BigNumber(currentCap)),
              ranges,
            }
          }
          dataFetched = !apiFailed
        } else if (isIFARM) {
          totalSupply = await getTotalSupply(instance, web3Client)
          underlyingBalanceWithInvestment = await getUnderlyingBalanceWithInvestment(
            instance,
            web3Client,
          )
          pricePerFullShare = importedVaults[vaultSymbol].pricePerFullShareOverride
            ? importedVaults[vaultSymbol].pricePerFullShareOverride
            : await getPricePerFullShare(instance, web3Client)
        }

        formattedVaults[vaultSymbol] = {
          ...importedVaults[vaultSymbol],
          vaultAddress: isIFARM
            ? importedVaults[vaultSymbol].tokenAddress
            : importedVaults[vaultSymbol].vaultAddress,
          estimatedApy,
          estimatedApyBreakdown,
          boostedEstimatedAPY,
          apyIconUrls: importedVaults[vaultSymbol].apyIconUrls,
          apyTokenSymbols: importedVaults[vaultSymbol].apyTokenSymbols,
          usdPrice,
          underlyingBalanceWithInvestment,
          pricePerFullShare,
          totalSupply,
          instance,
          uniswapV3PositionId,
          dataFetched,
          uniswapV3UnderlyingTokenPrices,
          pool: tokenPool,
          subLabel,
          uniswapV3ManagedData,
        }
      })

      if (account) {
        loadedUserVaultsWeb3Provider.current = true
      }

      setVaults(formattedVaults)
    },
    [pools, account],
  )
  const getFarmingBalances = useCallback(
    // eslint-disable-next-line func-names
    async function (selectedVaults, selectedBalances, updatedUserStats) {
      // eslint-disable-next-line no-void
      if (selectedBalances === void 0) {
        selectedBalances = {}
      }

      const fetchedBalances = {}

      if (loadedUserVaultsWeb3Provider.current) {
        setLoadingFarmingBalances(true)
        await Promise.all(
          filterVaults(selectedVaults).map(async vaultSymbol => {
            const fetchedBalance = await calculateFarmingBalance(
              pools,
              updatedUserStats || userStats,
              vaultSymbol,
              loadedVaults,
            )
            const currentBalance = selectedBalances[vaultSymbol]

            if (hasValidUpdatedBalance(fetchedBalance, currentBalance)) {
              fetchedBalances[vaultSymbol] = fetchedBalance
            } else {
              await pollUpdatedBalance(
                calculateFarmingBalance(
                  pools,
                  updatedUserStats || userStats,
                  vaultSymbol,
                  loadedVaults,
                ),
                currentBalance,
                () => {
                  fetchedBalances[vaultSymbol] = 'error'
                },
                farmedBalance => {
                  fetchedBalances[vaultSymbol] = farmedBalance
                },
              )
            }
          }),
        )
        setFarmingBalances(currBalances => ({ ...currBalances, ...fetchedBalances }))
        setLoadingFarmingBalances(false)
      }
    },
    [pools, userStats, loadedVaults],
  )
  useEffect(() => {
    const formatVaults = async () => {
      try {
        const apiResponse = await axios.get(VAULTS_API_ENDPOINT)
        const apiData = get(apiResponse, 'data')
        await setFormattedVaults(merge(apiData.bsc, apiData.eth, apiData.matic))
        setLoadingVaults(false)
      } catch (err) {
        console.log(err)

        if (!toast.isActive('api-error')) {
          toast.error(
            'Updates are in progress. Vaults APY and AUM stats are temporarily unavailable. Also, please check your internet connection',
            {
              toastId: 'api-error',
            },
          )
        }

        await setFormattedVaults(importedVaults, true)
        setLoadingVaults(false)
      }
    }

    if (initialFetch.current) {
      initialFetch.current = false
      setLoadingVaults(true)
      formatVaults()
    }
  }, [setFormattedVaults])
  useEffectWithPrevious(
    _ref2 => {
      const [prevAccount] = _ref2

      if (account !== prevAccount && account && !loadedUserVaultsWeb3Provider.current) {
        setFormattedVaults(vaultsData)
      }
    },
    [account, vaultsData],
  )
  return React.createElement(
    VaultsContext.Provider,
    {
      value: {
        loadingVaults,
        loadingFarmingBalances,
        vaultsData: loadedVaults,
        symbols: Object.keys(loadedVaults),
        farmingBalances,
        getFarmingBalances,
        loadedUserVaultsWeb3Provider: loadedUserVaultsWeb3Provider.current,
      },
    },
    children,
  )
}

export { VaultsProvider, useVaults }

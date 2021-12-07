import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import BigNumber from 'bignumber.js'
import axios from 'axios'
import { find, get } from 'lodash'
import { useContracts } from './Contracts'
import { getTotalFARMSupply } from '../utils'
import { getFarmPriceFromUniswap } from '../data/utils'
import {
  CMC_API_ENDPOINT,
  REVENUE_MONTHLY_API_ENDPOINT,
  SPECIAL_VAULTS,
  TOKEN_STATS_API_ENDPOINT,
} from '../constants'
import { usePools } from './Pools'

const StatsContext = createContext()
const useStats = () => useContext(StatsContext)

const fetchDataFromAPI = (endpoint, defaultValue = null) =>
  axios
    .get(endpoint)
    .then(res => get(res, 'data', defaultValue))
    .catch(err => {
      console.error(err)
      return defaultValue
    })

const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState({
    farmPrice: null,
    farmMarketCap: null,
    monthlyProfit: null,
    totalValueLocked: null,
    profitShareAPY: null,
    profitShareAPYFallback: null,
    totalGasSaved: null,
    percentStaked: null,
  })

  const { contracts } = useContracts()
  const { pools } = usePools()

  const firstStatsRender = useRef(true)

  useEffect(() => {
    const fetchStats = async () => {
      const farmPool = find(pools, pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID)
      if (contracts.FARM && farmPool && farmPool.loaded) {
        firstStatsRender.current = false

        const cmcApiResponse = await fetchDataFromAPI(CMC_API_ENDPOINT, { pools: [] })
        const tokensStatsApiResponse = await fetchDataFromAPI(TOKEN_STATS_API_ENDPOINT)
        const monthlyProfit = await fetchDataFromAPI(REVENUE_MONTHLY_API_ENDPOINT)

        const totalValueLocked = cmcApiResponse.pools.reduce(
          (acc, pool) => acc + Number(pool.totalStaked),
          0,
        )
        const farmTotalSupply = getTotalFARMSupply()
        const farmPrice = await getFarmPriceFromUniswap()

        const historicalAverageProfitSharingAPY = get(
          tokensStatsApiResponse,
          'historicalAverageProfitSharingAPY',
          null,
        )

        let profitShareAPY,
          profitShareAPYFallback = false

        if (!historicalAverageProfitSharingAPY) {
          profitShareAPYFallback = true
          profitShareAPY = get(farmPool, 'rewardAPY')
        } else {
          profitShareAPY = historicalAverageProfitSharingAPY
        }

        setStats({
          farmPrice,
          farmMarketCap: new BigNumber(farmTotalSupply).times(farmPrice).toString(),
          monthlyProfit,
          totalValueLocked,
          profitShareAPY,
          profitShareAPYFallback,
          totalGasSaved: get(tokensStatsApiResponse, 'totalGasSaved'),
          percentOfFarmStaked: get(tokensStatsApiResponse, 'percentStaked'),
        })
      }
    }

    if (firstStatsRender.current) {
      fetchStats()
    }
  }, [contracts.FARM, pools])

  return <StatsContext.Provider value={{ ...stats }}>{children}</StatsContext.Provider>
}

export { StatsProvider, useStats }

import React, { useMemo, useRef, useState } from 'react'
import { find, get, isArray, isEqual, keys, orderBy, sortBy, uniq } from 'lodash'
import move from 'lodash-move'
import useEffectWithPrevious from 'use-effect-with-previous'
import ReactTooltip from 'react-tooltip'
import BigNumber from 'bignumber.js'
import { useVaults } from '../../providers/Vault'
import {
  FARM_TOKEN_SYMBOL,
  FARM_USDC_TOKEN_SYMBOL,
  FARM_WETH_TOKEN_SYMBOL,
  FARM_GRAIN_TOKEN_SYMBOL,
  FARMSTEAD_USDC_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  SPECIAL_VAULTS,
} from '../../constants'
import { usePools } from '../../providers/Pools'
import { useWallet } from '../../providers/Wallet'
import { Container, Header, HeaderCol } from './style'
import VaultPanel from '../VaultPanel'
import {
  convertAmountToFARM,
  stringToArray,
  getTotalApy,
  getUserVaultBalance,
  getVaultValue,
} from '../../utils'
import VaultListHeader from '../VaultsListHeader'
import sortAscIcon from '../../assets/images/ui/asc.svg'
import sortDescIcon from '../../assets/images/ui/desc.svg'
import sortIcon from '../../assets/images/ui/sort.svg'
import { CHAINS_ID, VAULT_CATEGORIES_IDS } from '../../data/constants'

const { tokens } = require('../../data')

const formatVaults = (
  groupOfVaults,
  pools,
  userStats,
  balances,
  farmingBalances,
  chain,
  searchQuery = '',
  sortParam,
  sortOrder,
  selectedCategory,
  depositedOnly,
) => {
  let vaultsSymbol = sortBy(keys(groupOfVaults), [
    // eslint-disable-next-line consistent-return
    key => {
      if (get(groupOfVaults, `[${key}].isNew`, get(groupOfVaults, `[${key}].data.isNew`))) {
        return groupOfVaults[key]
      }
    },
    // eslint-disable-next-line consistent-return
    key => {
      if (
        !get(groupOfVaults, `[${key}].isNew`, get(groupOfVaults, `[${key}].data.isNew`)) &&
        stringToArray(groupOfVaults[key].category).includes(VAULT_CATEGORIES_IDS.GENERAL)
      ) {
        return groupOfVaults[key]
      }
    },
  ])

  if (chain === CHAINS_ID.ETH_MAINNET) {
    const farmIdx = vaultsSymbol.findIndex(symbol => symbol === FARM_TOKEN_SYMBOL)
    vaultsSymbol = move(vaultsSymbol, farmIdx, 0)

    const wethIdx = vaultsSymbol.findIndex(symbol => symbol === 'WETH')
    vaultsSymbol = move(vaultsSymbol, wethIdx, 1)
  }

  vaultsSymbol = vaultsSymbol.filter(
    tokenSymbol =>
      tokenSymbol !== IFARM_TOKEN_SYMBOL &&
      (groupOfVaults[tokenSymbol].chain === chain ||
        (groupOfVaults[tokenSymbol].data && groupOfVaults[tokenSymbol].data.chain === chain)),
  )

  if (searchQuery) {
    vaultsSymbol = vaultsSymbol.filter(
      symbol =>
        symbol.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (get(groupOfVaults[symbol], 'tokenAddress') &&
          !isArray(groupOfVaults[symbol].tokenAddress) &&
          groupOfVaults[symbol].tokenAddress.toLowerCase() === searchQuery.toLowerCase()) ||
        (get(groupOfVaults[symbol], 'displayName') &&
          groupOfVaults[symbol].displayName
            .toLowerCase()
            .includes(searchQuery.toLowerCase().trim())),
    )
  }

  if (sortParam) {
    switch (sortParam) {
      case 'displayName':
        vaultsSymbol = orderBy(
          vaultsSymbol,
          v => get(groupOfVaults, `${v}.${sortParam}`),
          sortOrder,
        )
        break
      case 'deposits':
        vaultsSymbol = orderBy(
          vaultsSymbol,
          v => Number(getVaultValue(groupOfVaults[v])),
          sortOrder,
        )
        break
      case 'apy':
        vaultsSymbol = orderBy(
          vaultsSymbol,
          v => {
            const isSpecialVault = groupOfVaults[v].liquidityPoolVault || groupOfVaults[v].poolVault

            const tokenVault = get(groupOfVaults, groupOfVaults[v].hodlVaultId || v)
            let vaultPool

            if (isSpecialVault) {
              vaultPool = groupOfVaults[v].data
            } else {
              vaultPool = find(
                pools,
                pool => pool.collateralAddress === get(tokenVault, `vaultAddress`),
              )
            }

            return Number(
              isSpecialVault
                ? getTotalApy(null, groupOfVaults[v], true)
                : getTotalApy(vaultPool, tokenVault),
            )
          },
          sortOrder,
        )
        break
      case 'balance':
        vaultsSymbol = orderBy(
          vaultsSymbol,
          v => {
            let iFARMinFARM, vaultPool

            if (v === FARM_TOKEN_SYMBOL) {
              const iFARMBalance = get(balances, IFARM_TOKEN_SYMBOL, 0)
              iFARMinFARM = convertAmountToFARM(
                IFARM_TOKEN_SYMBOL,
                iFARMBalance,
                tokens[FARM_TOKEN_SYMBOL].decimals,
                groupOfVaults,
              )
            }
            const isSpecialVault = groupOfVaults[v].liquidityPoolVault || groupOfVaults[v].poolVault

            const tokenVault = get(groupOfVaults, groupOfVaults[v].hodlVaultId || v)

            if (isSpecialVault) {
              vaultPool = groupOfVaults[v].data
            } else {
              vaultPool = find(
                pools,
                pool => pool.collateralAddress === get(tokenVault, `vaultAddress`),
              )
            }
            const poolId = get(vaultPool, 'id')
            const totalStakedInPool = get(userStats, `[${poolId}]['totalStaked']`, 0)
            return Number(getUserVaultBalance(v, farmingBalances, totalStakedInPool, iFARMinFARM))
          },
          sortOrder,
        )
        break
      default:
        break
    }
  }

  if (selectedCategory) {
    vaultsSymbol = vaultsSymbol.filter(tokenSymbol => {
      if (
        selectedCategory === VAULT_CATEGORIES_IDS.INACTIVE ||
        selectedCategory === VAULT_CATEGORIES_IDS.INACTIVE_BSC ||
        selectedCategory === VAULT_CATEGORIES_IDS.INACTIVE_POLYGON ||
        depositedOnly
      ) {
        return (
          stringToArray(groupOfVaults[tokenSymbol].category).includes(selectedCategory) ||
          groupOfVaults[tokenSymbol].inactive ||
          groupOfVaults[tokenSymbol].testInactive
        )
      }
      return stringToArray(groupOfVaults[tokenSymbol].category).includes(selectedCategory)
    })
  } else if (!depositedOnly && chain !== CHAINS_ID.BSC_MAINNET) {
    vaultsSymbol = vaultsSymbol.filter(
      tokenSymbol =>
        !groupOfVaults[tokenSymbol].inactive && !groupOfVaults[tokenSymbol].testInactive,
    )
  }

  if (depositedOnly) {
    const vaultsWithStakedBalances = Object.keys(userStats)
      .filter(
        poolId =>
          new BigNumber(userStats[poolId].totalStaked).gt(0) ||
          new BigNumber(userStats[poolId].lpTokenBalance).gt(0) ||
          (poolId === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID &&
            new BigNumber(balances[IFARM_TOKEN_SYMBOL]).gt(0)),
      )
      .map(poolId => {
        const selectedPool = find(pools, pool => pool.id === poolId)
        const collateralAddress = get(selectedPool, 'collateralAddress', poolId)

        const vaultSymbol = vaultsSymbol.find(
          tokenKey =>
            groupOfVaults[tokenKey].vaultAddress === collateralAddress ||
            (groupOfVaults[tokenKey].data &&
              groupOfVaults[tokenKey].data.collateralAddress === collateralAddress),
        )

        return vaultSymbol
      })

    vaultsSymbol = vaultsSymbol.filter(tokenSymbol =>
      vaultsWithStakedBalances.includes(tokenSymbol),
    )
  }

  return vaultsSymbol
}

const SortingIcon = ({ sortType, sortField, selectedField }) => {
  switch (true) {
    case sortType === 'asc' && selectedField === sortField:
      return <img src={sortAscIcon} alt="Sort ASC" />
    case sortType === 'desc' && selectedField === sortField:
      return <img src={sortDescIcon} alt="Sort DESC" />
    default:
      return <img src={sortIcon} alt="Sort" />
  }
}

const VaultList = ({ profitShareAPY }) => {
  const {
    vaultsData,
    getFarmingBalances,
    loadedUserVaultsWeb3Provider,
    farmingBalances,
  } = useVaults()
  const { pools, fetchUserPoolStats, userStats, loadedUserPoolsWeb3Provider } = usePools()
  const { account, chain, getWalletBalances, balances } = useWallet()
  const [openVault, setOpen] = useState(null)
  const [loaded, setLoaded] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)
  const [sortParam, setSortParam] = useState(null)
  const [sortOrder, setSortOrder] = useState('desc')
  const [selectedCategory, selectCategory] = useState(null)
  const [depositedOnly, selectDepositedOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const farmProfitSharingPool = pools.find(
    pool => pool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID,
  )
  const farmUsdcPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARM_USDC_POOL_ID)
  const farmWethPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARM_WETH_POOL_ID)
  const farmGrainPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARM_GRAIN_POOL_ID)
  const farmSteadUSDCPool = pools.find(pool => pool.id === SPECIAL_VAULTS.FARMSTEAD_USDC_POOL_ID)

  const poolVaults = useMemo(
    () => ({
      [FARM_TOKEN_SYMBOL]: {
        poolVault: true,
        profitShareAPY,
        data: farmProfitSharingPool,
        logoUrl: './icons/farm.png',
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_TOKEN_SYMBOL].isNew,
        newDetails: tokens[FARM_TOKEN_SYMBOL].newDetails,
        category: VAULT_CATEGORIES_IDS.GENERAL,
      },
      [FARM_WETH_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        displayName: 'FARM/ETH',
        data: farmWethPool,
        logoUrl: './icons/farm-weth.png',
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_WETH_TOKEN_SYMBOL].isNew,
        category: VAULT_CATEGORIES_IDS.LIQUIDITY,
      },
      [FARMSTEAD_USDC_TOKEN_SYMBOL]: {
        poolVault: true,
        displayName: 'FARMStead USDC-24',
        subLabel: 'fUSDC-24',
        data: farmSteadUSDCPool,
        logoUrl: './icons/farmstead-usdc.png',
        rewardSymbol: IFARM_TOKEN_SYMBOL,
        isNew: tokens[FARMSTEAD_USDC_TOKEN_SYMBOL].isNew,
        category: VAULT_CATEGORIES_IDS.GENERAL,
      },
      [FARM_GRAIN_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        displayName: 'FARM/GRAIN',
        data: farmGrainPool,
        logoUrl: './icons/farm-grain.png',
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_GRAIN_TOKEN_SYMBOL].isNew,
        category: VAULT_CATEGORIES_IDS.LIQUIDITY,
      },
      [FARM_USDC_TOKEN_SYMBOL]: {
        liquidityPoolVault: true,
        inactive: true,
        displayName: 'FARM/USDC',
        data: farmUsdcPool,
        logoUrl: './icons/farm-usdc.png',
        rewardSymbol: FARM_TOKEN_SYMBOL,
        isNew: tokens[FARM_USDC_TOKEN_SYMBOL].isNew,
      },
    }),
    [
      farmGrainPool,
      farmWethPool,
      farmUsdcPool,
      farmProfitSharingPool,
      farmSteadUSDCPool,
      profitShareAPY,
    ],
  )

  const groupOfVaults = { ...vaultsData, ...poolVaults }

  const vaultsSymbol = useMemo(
    () =>
      formatVaults(
        groupOfVaults,
        pools,
        userStats,
        balances,
        farmingBalances,
        chain,
        searchQuery,
        sortParam,
        sortOrder,
        selectedCategory,
        depositedOnly,
      ),
    [
      groupOfVaults,
      pools,
      userStats,
      balances,
      farmingBalances,
      chain,
      searchQuery,
      sortParam,
      sortOrder,
      selectedCategory,
      depositedOnly,
    ],
  )

  const hasLoadedSpecialEthPools =
    !!get(farmUsdcPool, 'contractInstance') &&
    !!get(farmWethPool, 'contractInstance') &&
    !!get(farmGrainPool, 'contractInstance') &&
    !!get(farmProfitSharingPool, 'contractInstance')

  const firstPoolsBalancesLoad = useRef(true)
  const firstVaultsBalancesLoad = useRef(true)
  const firstFarmingBalancesLoad = useRef(true)

  useEffectWithPrevious(
    ([prevChain, prevAccount, prevOpenVault]) => {
      const hasSwitchedChain = chain !== prevChain
      const hasSwitchedChainToETH = hasSwitchedChain && chain === CHAINS_ID.ETH_MAINNET
      const hasSwitchedAccount = account !== prevAccount && account
      const hasSwitchedVault = openVault !== prevOpenVault

      if (hasSwitchedChain) {
        selectCategory(null)
        setOpen(null)
      }

      if (
        (hasSwitchedChainToETH || hasSwitchedAccount || firstPoolsBalancesLoad.current) &&
        loadedUserPoolsWeb3Provider &&
        hasLoadedSpecialEthPools
      ) {
        const fetchUserTotalStakedInFarmAndFarmUsdc = async () => {
          firstPoolsBalancesLoad.current = false
          await fetchUserPoolStats(
            [farmUsdcPool, farmWethPool, farmGrainPool, farmProfitSharingPool],
            account,
            userStats,
          )
        }

        fetchUserTotalStakedInFarmAndFarmUsdc()
      }

      if (
        (hasSwitchedVault ||
          hasSwitchedChain ||
          hasSwitchedAccount ||
          firstVaultsBalancesLoad.current) &&
        loadedUserVaultsWeb3Provider
      ) {
        const loadUserVaultBalances = async selectedVault => {
          let balancesToLoad = selectedVault ? [selectedVault] : []

          if (
            firstVaultsBalancesLoad.current &&
            !selectedVault &&
            chain === CHAINS_ID.ETH_MAINNET
          ) {
            firstVaultsBalancesLoad.current = false
            balancesToLoad = [
              FARM_TOKEN_SYMBOL,
              IFARM_TOKEN_SYMBOL,
              FARM_GRAIN_TOKEN_SYMBOL,
              FARM_WETH_TOKEN_SYMBOL,
              FARMSTEAD_USDC_TOKEN_SYMBOL,
            ]
          } else if (selectedVault) {
            if (isArray(tokens[selectedVault].tokenAddress)) {
              const multipleAssets = tokens[selectedVault].tokenAddress.map(address => {
                const selectedSymbol = Object.keys(tokens).find(
                  tokenSymbol =>
                    !isArray(tokens[tokenSymbol].tokenAddress) &&
                    tokens[tokenSymbol].tokenAddress.toLowerCase() === address.toLowerCase(),
                )
                return selectedSymbol
              })
              balancesToLoad = [...balancesToLoad, ...multipleAssets]
            }

            if (chain === CHAINS_ID.ETH_MAINNET) {
              balancesToLoad = [
                ...balancesToLoad,
                FARM_TOKEN_SYMBOL,
                IFARM_TOKEN_SYMBOL,
                FARM_GRAIN_TOKEN_SYMBOL,
                FARM_WETH_TOKEN_SYMBOL,
                FARMSTEAD_USDC_TOKEN_SYMBOL,
              ]
            }
          }

          if (balancesToLoad.length) {
            setLoaded(!!selectedVault)
            await getWalletBalances(uniq(balancesToLoad), account, true)
            setLoaded(true)
          }
        }

        loadUserVaultBalances(openVault)
      }
    },
    [
      chain,
      account,
      openVault,
      loadedUserPoolsWeb3Provider,
      loadedUserVaultsWeb3Provider,
      farmProfitSharingPool,
      farmUsdcPool,
      farmWethPool,
      farmGrainPool,
      fetchUserPoolStats,
      userStats,
      chain,
      hasLoadedSpecialEthPools,
      selectCategory,
    ],
  )

  useEffectWithPrevious(
    ([prevChain, prevAccount, prevUserStats]) => {
      const hasSwitchedChain = chain !== prevChain
      const hasSwitchedAccount = account !== prevAccount && account

      if (
        (hasSwitchedChain ||
          hasSwitchedAccount ||
          firstFarmingBalancesLoad.current ||
          (userStats && !isEqual(userStats, prevUserStats))) &&
        loadedUserVaultsWeb3Provider
      ) {
        setLoaded(false)
        const loadUserFarmingBalances = async () => {
          firstFarmingBalancesLoad.current = false
          await getFarmingBalances(vaultsSymbol)
          setLoaded(true)
        }
        loadUserFarmingBalances()
      }
    },
    [chain, account, userStats],
  )

  const setSortingParams = param => {
    if (sortParam === param) {
      if (sortOrder === 'desc') {
        setSortOrder('asc')
      } else {
        setSortOrder('desc')
      }
    } else {
      setSortOrder('desc')
      setSortParam(param)
    }
  }

  return (
    <Container>
      <VaultListHeader
        setSearchQuery={setSearchQuery}
        onCategoryClick={selectCategory}
        onDepositedOnlyClick={selectDepositedOnly}
        depositedOnly={depositedOnly}
        selectedCategory={selectedCategory}
      />
      <Header>
        <HeaderCol
          width="210px"
          margin="0 0 0 63px"
          textAlign="left"
          onClick={() => setSortingParams('displayName')}
        >
          Asset{' '}
          <SortingIcon sortType={sortOrder} sortField={sortParam} selectedField="displayName" />
        </HeaderCol>
        <HeaderCol onClick={() => setSortingParams('apy')}>
          Harvest APY <SortingIcon sortType={sortOrder} sortField={sortParam} selectedField="apy" />
        </HeaderCol>
        <HeaderCol
          data-tip
          data-for="total-deposits-column-header"
          width="109px"
          textAlign="left"
          onClick={() => setSortingParams('deposits')}
          margin="0 0 0 30px"
        >
          Deposits ($){' '}
          <SortingIcon sortType={sortOrder} sortField={sortParam} selectedField="deposits" />
        </HeaderCol>
        <ReactTooltip
          id="total-deposits-column-header"
          backgroundColor="white"
          borderColor="black"
          border
          textColor="black"
        >
          Refreshes hourly
        </ReactTooltip>
        <HeaderCol
          onClick={() => setSortingParams('balance')}
          width="128px"
          textAlign="left"
          margin="0 10px 0"
        >
          Your balance{' '}
          <SortingIcon sortType={sortOrder} sortField={sortParam} selectedField="balance" />
        </HeaderCol>
      </Header>
      <div>
        {vaultsSymbol.map(vaultSymbol => {
          const token = groupOfVaults[vaultSymbol]
          return (
            <VaultPanel
              key={vaultSymbol}
              loaded={loaded}
              token={token}
              setOpen={setOpen}
              openVault={openVault}
              setPendingAction={setPendingAction}
              setLoaded={setLoaded}
              pendingAction={pendingAction}
              tokenSymbol={vaultSymbol}
            />
          )
        })}
      </div>
    </Container>
  )
}

export default VaultList

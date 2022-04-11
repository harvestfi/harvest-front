import React, { useCallback, useState } from 'react'
import { find, get, isEmpty, isNaN } from 'lodash'
import useDeepCompareEffect from 'use-deep-compare-effect'
import BigNumber from 'bignumber.js'
import {
  BFARM_TOKEN_SYMBOL,
  FARM_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  MIFARM_TOKEN_SYMBOL,
  PANEL_ACTIONS_TYPE,
  POOL_BALANCES_DECIMALS,
  SPECIAL_VAULTS,
} from '../../constants'
import { fromWei, newContractInstance, toWei } from '../../services/web3'
import { convertAmountToFARM, stringToArray } from '../../utils'
import { useWallet } from '../../providers/Wallet'
import { usePools } from '../../providers/Pools'
import { useVaults } from '../../providers/Vault'
import tokenContract from '../../services/web3/contracts/token/contract.json'
import tokenMethods from '../../services/web3/contracts/token/methods'
import poolMethods from '../../services/web3/contracts/pool/methods'
import vaultMethods from '../../services/web3/contracts/vault/methods'
import { calculateRewardsEarned } from '../../providers/Pools/utils'
import UniV3ManagedVaultActions from './UniV3ManagedVaultActions'
import VaultFooterActions from './VaultFooterActions'
import VaultBodyActions from './VautBodyActions'
import VaultHeadActions from './VaultHeadActions'
import PoolHeadActions from './PoolHeadActions'
import PoolFooterActions from './PoolFooterActions'
import PoolBodyActions from './PoolBodyActions'
import VaultHeadActionsMigrate from './VaultHeadActionsMigrate'
import { CHAINS_ID, VAULT_CATEGORIES_IDS } from '../../data/constants'

const { addresses, tokens } = require('../../data')

const getPoolRewardSymbol = chain => {
  switch (Number(chain)) {
    case CHAINS_ID.BSC_MAINNET:
      return BFARM_TOKEN_SYMBOL
    case CHAINS_ID.MATIC_MAINNET:
      return MIFARM_TOKEN_SYMBOL
    default:
      return FARM_TOKEN_SYMBOL
  }
}

const VaultPanelActions = ({
  type,
  token,
  tokenSymbol,
  tokenDecimals,
  amountsToExecute,
  isSpecialVault,
  multipleAssets,
  withdrawMode,
  fAssetPool,
  loadingBalances,
  ...props
}) => {
  const { account, balances, chain } = useWallet()
  const { userStats, pools } = usePools()
  const { vaultsData } = useVaults()
  const [loadingRewards, setLoadingRewards] = useState(false)
  const [rewardsEarned, setRewardsEarned] = useState({})
  const [rewardTokenSymbols, setRewardTokenSymbols] = useState([])

  let totalTokensEarned = '0',
    iFARMBalance,
    iFARMBalanceToEther,
    iFARMinFARMInEther

  const ratesPerDay = []

  if (fAssetPool) {
    const [, selectedToken] = find(Object.entries(tokens), ([, tokenValues]) =>
      fAssetPool.rewardTokens.includes(tokenValues.tokenAddress),
    )

    fAssetPool.rewardAPY.forEach(rewardApy => {
      const ratePerDay = new BigNumber(rewardApy).dividedBy(365).dividedBy(100)
      ratesPerDay.push(
        isNaN(ratePerDay.toNumber()) ? 0 : ratePerDay.gte(1) ? 1 : ratePerDay.toFixed(),
      )
    })

    totalTokensEarned = fromWei(
      get(userStats, `[${fAssetPool.id}]['totalRewardsEarned']`, 0),
      selectedToken.decimals,
      4,
    )
  }

  if (fAssetPool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID) {
    iFARMBalance = get(balances, IFARM_TOKEN_SYMBOL, 0)
    iFARMBalanceToEther = fromWei(
      get(balances, IFARM_TOKEN_SYMBOL, 0),
      tokens[IFARM_TOKEN_SYMBOL].decimals,
      POOL_BALANCES_DECIMALS,
      true,
    )

    iFARMinFARMInEther = fromWei(
      convertAmountToFARM(
        IFARM_TOKEN_SYMBOL,
        iFARMBalance <= 0 ? toWei(1, tokens[IFARM_TOKEN_SYMBOL].decimals) : iFARMBalance,
        tokens[FARM_TOKEN_SYMBOL].decimals,
        vaultsData,
      ),
      tokens[FARM_TOKEN_SYMBOL].decimals,
      POOL_BALANCES_DECIMALS,
      true,
    )
  }

  const getRewardsEarned = useCallback(
    async (hodlVaultId, mainRewardsEarned, hodlRewardTokenSymbols, hodlPool) => {
      if (hodlVaultId) {
        const userBalanceInVault = new BigNumber(
          await tokenMethods.getBalance(account, vaultsData[tokenSymbol].instance),
        )
        const userBalanceInPool = await poolMethods.balanceOf(account, fAssetPool.contractInstance)
        const totalBalance = userBalanceInVault.plus(userBalanceInPool)

        const vaultStrategyAddress = await vaultMethods.getStrategy(
          vaultsData[tokenSymbol].instance,
        )

        await Promise.all(
          Object.keys(hodlRewardTokenSymbols).map(async (rewardSymbolIdx, index) => {
            const hodlReward = new BigNumber(
              await calculateRewardsEarned(index, vaultStrategyAddress, hodlPool.contractInstance),
            )
            const rewardTokenBalance = await tokenMethods.getBalance(
              vaultStrategyAddress,
              await newContractInstance(
                null,
                addresses[hodlRewardTokenSymbols[rewardSymbolIdx]],
                tokenContract.abi,
              ),
            )
            mainRewardsEarned[hodlRewardTokenSymbols[rewardSymbolIdx]] = totalBalance
              .multipliedBy(hodlReward.plus(rewardTokenBalance))
              .dividedBy(vaultsData[tokenSymbol].totalSupply)
              .toString()
          }),
        )
        setRewardsEarned(mainRewardsEarned)
      } else {
        setRewardsEarned(mainRewardsEarned)
      }
    },
    [account, tokenSymbol, vaultsData, fAssetPool.contractInstance],
  )

  const hodlVaultId = get(vaultsData, `[${tokenSymbol}].hodlVaultId`)

  useDeepCompareEffect(() => {
    const fetchRewards = async () => {
      setLoadingRewards(true)
      const hodlVaultData = get(vaultsData, hodlVaultId)
      const hodlPool = hodlVaultData
        ? find(pools, selectedPool => selectedPool.collateralAddress === hodlVaultData.vaultAddress)
        : {}

      const mainRewardsEarned = get(userStats, `[${get(fAssetPool, 'id')}].rewardsEarned`)
      const mainRewardTokenSymbols = get(fAssetPool, 'rewardTokenSymbols', [])
      const hodlRewardTokenSymbols = get(hodlPool, 'rewardTokenSymbols', [])

      setRewardTokenSymbols([...mainRewardTokenSymbols, ...hodlRewardTokenSymbols])

      if (mainRewardsEarned) {
        await getRewardsEarned(hodlVaultId, mainRewardsEarned, hodlRewardTokenSymbols, hodlPool)
      }

      setLoadingRewards(false)
    }

    fetchRewards()
  }, [hodlVaultId, userStats, fAssetPool, pools, vaultsData, getRewardsEarned, setLoadingRewards])

  const amountsToExecuteInWei = amountsToExecute.map((amount, amountIdx) => {
    if (isEmpty(amount)) {
      return null
    }

    if (multipleAssets) {
      return toWei(
        amount,
        withdrawMode ? token.decimals : tokens[multipleAssets[amountIdx]].decimals,
        0,
      )
    }
    return toWei(amount, isSpecialVault ? tokenDecimals : token.decimals)
  })

  const isLoadingData = loadingBalances || loadingRewards || !fAssetPool.loaded

  const hasHodlCategory = stringToArray(get(vaultsData, `[${tokenSymbol}].category`)).includes(
    VAULT_CATEGORIES_IDS.SUSHI_HODL,
  )

  const componentsProps = {
    token,
    amountsToExecuteInWei,
    multipleAssets,
    withdrawMode,
    isLoadingData,
    fAssetPool,
    tokenSymbol,
    rewardsEarned,
    rewardTokenSymbols,
    ratesPerDay,
    totalTokensEarned,
    iFARMBalanceToEther,
    iFARMinFARMInEther,
    loadingBalances,
    isSpecialVault,
    hasHodlCategory,
    poolRewardSymbol: getPoolRewardSymbol(chain),
    ...props,
  }

  if (type === PANEL_ACTIONS_TYPE.UNIV3MANAGED) {
    return <UniV3ManagedVaultActions {...token} />
  }

  if (type === PANEL_ACTIONS_TYPE.HEAD && isSpecialVault) {
    return <PoolHeadActions {...componentsProps} />
  }

  if (type === PANEL_ACTIONS_TYPE.HEAD) {
    return <VaultHeadActions {...componentsProps} />
  }

  if (type === PANEL_ACTIONS_TYPE.MIGRATE) {
    return <VaultHeadActionsMigrate {...componentsProps} />
  }

  if (isSpecialVault) {
    return (
      <>
        <PoolBodyActions {...componentsProps} />
        <PoolFooterActions {...componentsProps} />
      </>
    )
  }

  return (
    <>
      <VaultBodyActions {...componentsProps} />
      <VaultFooterActions {...componentsProps} />
    </>
  )
}

export default VaultPanelActions

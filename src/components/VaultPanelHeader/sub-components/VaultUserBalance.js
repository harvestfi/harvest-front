import React, { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { get } from 'lodash'
import {
  FARM_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  MIGRATION_STEPS,
  SPECIAL_VAULTS,
} from '../../../constants'
import { useVaults } from '../../../providers/Vault'
import { tokens } from '../../../data'
import { fromWei, newContractInstance } from '../../../services/web3'
import { convertAmountToFARM, formatNumber, getUserVaultBalance } from '../../../utils'
import AnimatedDots from '../../AnimatedDots'
import { useWallet } from '../../../providers/Wallet'
import { Monospace } from '../../GlobalStyle'
import { usePools } from '../../../providers/Pools'
import tokenData from '../../../services/web3/contracts/token/contract.json'
import tokenMethods from '../../../services/web3/contracts/token/methods'
import poolContractData from '../../../services/web3/contracts/pool/contract.json'
import poolContractMethods from '../../../services/web3/contracts/pool/methods'
import PoolMigrationButton from '../../PoolMigrationButton'
import { getUserStats } from '../../../providers/Pools/utils'

const getMigrationStep = (userStats, setStep, newPoolApprovedBalance) => {
  switch (true) {
    case new BigNumber(userStats.totalStaked).isGreaterThan(0):
      return setStep(MIGRATION_STEPS.UNSTAKE)
    case new BigNumber(userStats.lpTokenBalance).isGreaterThan(0) &&
      new BigNumber(newPoolApprovedBalance).isLessThan(userStats.lpTokenBalance):
      return setStep(MIGRATION_STEPS.APPROVE)
    case new BigNumber(userStats.lpTokenBalance).isGreaterThan(0):
      return setStep(MIGRATION_STEPS.MIGRATE)
    default:
      throw new Error('Something went wrong during the migration check')
  }
}

const VaultUserBalance = ({
  token,
  tokenSymbol,
  amountsForPosition,
  multipleAssets,
  setTooltipContent,
  isSpecialVault,
  loadingFarmingBalance,
  vaultPool,
  loadedVault,
}) => {
  const { vaultsData, farmingBalances } = useVaults()
  const { connected, balances, account } = useWallet()
  const { userStats } = usePools()
  const [iFARMinFARM, setIFARMinFARM] = useState(null)
  const [userVaultBalance, setUserVaultBalance] = useState(null)
  const [totalStakedInPool, setTotalStakedInPool] = useState(null)

  const [migrationStep, setMigrationStep] = useState(null)

  const [hasToBeMigrated, setToBeMigrated] = useState(false)
  const [oldPoolUserStats, setOldPoolUserStats] = useState({
    lpTokenBalance: '0',
    lpTokenApprovedBalance: '0',
    totalStaked: '0',
    totalRewardsEarned: '0',
  })
  const [oldPoolInstances, setOldPoolInstances] = useState(null)

  const refreshOldPoolUserStats = useCallback(async () => {
    const { oldPoolContractAddress } = vaultPool

    const oldPoolContractInstance = await newContractInstance(
      null,
      oldPoolContractAddress,
      poolContractData.abi,
    )

    const oldPoolLpTokenAddress = await poolContractMethods.lpToken(oldPoolContractInstance)

    const oldPoolLpTokenInstance = await newContractInstance(
      null,
      oldPoolLpTokenAddress,
      tokenData.abi,
    )

    const fetchedStats = await getUserStats(
      oldPoolContractInstance,
      oldPoolLpTokenInstance,
      oldPoolContractAddress,
      null,
      account,
    )

    setOldPoolInstances({
      lpTokenInstance: oldPoolLpTokenInstance,
      contractInstance: oldPoolContractInstance,
    })

    setOldPoolUserStats(fetchedStats)
  }, [account, vaultPool])

  const verifyMigrationStep = useCallback(async () => {
    const newPoolApprovedBalance = await tokenMethods.getApprovedAmount(
      account,
      vaultPool.contractAddress,
      oldPoolInstances.lpTokenInstance,
    )
    getMigrationStep(oldPoolUserStats, setMigrationStep, newPoolApprovedBalance)
  }, [oldPoolUserStats, vaultPool, account, oldPoolInstances])

  useEffect(() => {
    if (account && vaultPool.oldPoolContractAddress) {
      refreshOldPoolUserStats()
    }
  }, [account, vaultPool, refreshOldPoolUserStats])

  useEffect(() => {
    if (hasToBeMigrated) {
      verifyMigrationStep()
    }
  }, [hasToBeMigrated, verifyMigrationStep])

  useEffect(() => {
    if (new BigNumber(oldPoolUserStats.totalStaked).isGreaterThan(0)) {
      setToBeMigrated(true)
    }
  }, [oldPoolUserStats])

  useEffect(() => {
    if (tokenSymbol === FARM_TOKEN_SYMBOL) {
      const iFARMBalance = get(balances, IFARM_TOKEN_SYMBOL, 0)
      setIFARMinFARM(
        convertAmountToFARM(
          IFARM_TOKEN_SYMBOL,
          iFARMBalance,
          tokens[FARM_TOKEN_SYMBOL].decimals,
          vaultsData,
        ),
      )
    }

    const totalStaked = get(userStats, `[${get(vaultPool, 'id')}]['totalStaked']`, 0)
    setTotalStakedInPool(totalStaked)
    setUserVaultBalance(getUserVaultBalance(tokenSymbol, farmingBalances, totalStaked, iFARMinFARM))
  }, [vaultsData, tokenSymbol, vaultPool, userStats, farmingBalances, balances, iFARMinFARM])

  const isLoadingUserBalance =
    loadedVault === false ||
    loadingFarmingBalance ||
    (isSpecialVault
      ? connected &&
        (!token.data ||
          !get(userStats, `[${token.data.id}]['totalStaked']`) ||
          (token.data.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID &&
            !balances[IFARM_TOKEN_SYMBOL]))
      : userVaultBalance === false)

  if (hasToBeMigrated) {
    return (
      <PoolMigrationButton
        refreshOldPoolUserStats={refreshOldPoolUserStats}
        migrationStep={migrationStep}
        setToBeMigrated={setToBeMigrated}
        setMigrationStep={setMigrationStep}
        pool={vaultPool}
        oldPoolInstances={oldPoolInstances}
        lpTokenBalance={oldPoolUserStats.lpTokenBalance}
      />
    )
  }

  return (
    <Monospace
      data-tip=""
      data-for={`tooltip-${tokenSymbol}`}
      borderBottom={connected && !isLoadingUserBalance && multipleAssets && '1px dotted black'}
      onMouseOver={() => {
        if (multipleAssets && amountsForPosition !== null) {
          setTooltipContent(
            multipleAssets.map((symbol, symbolIdx) => (
              <div key={symbol} style={{ textAlign: 'left' }}>
                {symbol}:{' '}
                {formatNumber(
                  fromWei(
                    get(amountsForPosition, symbolIdx),
                    tokens[symbol].decimals,
                    5,
                    false,
                    null,
                  ),
                  9,
                )}
                <br />
              </div>
            )),
          )
        } else if ((connected || !loadingFarmingBalance) && tokenSymbol === FARM_TOKEN_SYMBOL) {
          setTooltipContent(
            <>
              Your combined{' '}
              {formatNumber(fromWei(totalStakedInPool, tokens[FARM_TOKEN_SYMBOL].decimals, 5), 9)}{' '}
              {FARM_TOKEN_SYMBOL} +{' '}
              {formatNumber(fromWei(iFARMinFARM, tokens[FARM_TOKEN_SYMBOL].decimals, 5), 9)} (in{' '}
              {tokens[IFARM_TOKEN_SYMBOL].displayName})
            </>,
          )
        }
      }}
      onMouseLeave={() => setTooltipContent(undefined)}
    >
      {isLoadingUserBalance ? (
        <AnimatedDots />
      ) : (
        <b>
          {multipleAssets
            ? `$${formatNumber(
                new BigNumber(fromWei(userVaultBalance, token.decimals, 3))
                  .multipliedBy(token.usdPrice || 1)
                  .toString(),
                2,
              )}`
            : formatNumber(
                fromWei(
                  userVaultBalance,
                  isSpecialVault ? get(token, 'data.watchAsset.decimals', 18) : token.decimals,
                  5,
                ),
                9,
              )}
        </b>
      )}
    </Monospace>
  )
}

export default VaultUserBalance

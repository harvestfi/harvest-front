import React, { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import Button from '../Button'
import { MIGRATION_STEPS } from '../../constants'
import { toWei } from '../../services/web3'
import tokenMethods from '../../services/web3/contracts/token/methods'
import poolMethods from '../../services/web3/contracts/pool/methods'
import { useWallet } from '../../providers/Wallet'

const PoolMigrationButton = ({
  migrationStep,
  setMigrationStep,
  refreshOldPoolUserStats,
  pool,
  setToBeMigrated,
  oldPoolInstances,
}) => {
  const { account } = useWallet()
  const [loading, setLoading] = useState(false)

  const handleMigration = useCallback(async () => {
    const lpTokenBalance = await tokenMethods.getBalance(account, oldPoolInstances.lpTokenInstance)
    poolMethods
      .stake(lpTokenBalance, account, pool.contractInstance)
      .then(() => {
        toast.success(`${pool.lpTokenData.symbol} amount migrated`)
        setToBeMigrated(false)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [
    account,
    pool.contractInstance,
    pool.lpTokenData.symbol,
    setLoading,
    setToBeMigrated,
    oldPoolInstances.lpTokenInstance,
  ])

  const handleApproval = useCallback(
    () =>
      tokenMethods
        .approve(
          pool.contractAddress,
          account,
          toWei(1000000000000, pool.lpTokenData.decimals),
          oldPoolInstances.lpTokenInstance,
        )
        .then(() => {
          toast.success(`${pool.lpTokenData.symbol} approval completed`)
          setMigrationStep(MIGRATION_STEPS.MIGRATE)
          handleMigration()
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        }),
    [
      account,
      pool.contractAddress,
      pool.lpTokenData.decimals,
      pool.lpTokenData.symbol,
      oldPoolInstances,
      setLoading,
      setMigrationStep,
      handleMigration,
    ],
  )

  const handleUnstake = useCallback(
    () =>
      poolMethods
        .exit(account, oldPoolInstances.contractInstance)
        .then(async () => {
          await refreshOldPoolUserStats()
          toast.success('Unstake & claim completed')
          handleApproval()
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        }),
    [
      account,
      oldPoolInstances.contractInstance,
      setLoading,
      refreshOldPoolUserStats,
      handleApproval,
    ],
  )

  return (
    <Button
      width="150px"
      height="30px"
      onClick={() => {
        setLoading(true)
        if (migrationStep === MIGRATION_STEPS.UNSTAKE) {
          handleUnstake()
        } else if (migrationStep === MIGRATION_STEPS.APPROVE) {
          handleApproval()
        } else {
          handleMigration()
        }
      }}
      disabled={loading}
      style={{ zIndex: 999, backgroundColor: '#F2B435' }}
    >
      {loading ? 'MIGRATING...' : 'MIGRATE'}
    </Button>
  )
}

export default PoolMigrationButton

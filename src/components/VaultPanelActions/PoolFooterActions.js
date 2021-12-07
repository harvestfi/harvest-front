import React from 'react'
import { get } from 'lodash'
import { ACTIONS, SPECIAL_VAULTS } from '../../constants'
import { useActions } from '../../providers/Actions'
import { usePools } from '../../providers/Pools'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet'
import Button from '../Button'
import { formatNumber, hasAmountGreaterThanZero, hasRequirementsForInteraction } from '../../utils'
import {
  SelectedVaultContainer,
  SelectedVault,
  SelectedVaultLabel,
  SelectedVaultNumber,
} from './style'
import VaultPanelDetailsTooltip from '../VaultPanelDetailsTooltip'
import VaultPanelModeSwitch from '../VaultPanelModeSwitch'
import { Monospace } from '../GlobalStyle'
import Counter from '../Counter'
import { fromWei } from '../../services/web3'
import AnimatedDots from '../AnimatedDots'

const { tokens } = require('../../data')

const PoolFooterActions = ({
  fAssetPool,
  totalTokensEarned,
  token,
  rewardTokenSymbols,
  isLoadingData,
  rewardsEarned,
  ratesPerDay,
  tokenSymbol,
  totalRewardsEarned,
  loadingBalances,
  setLoadingDots,
  setPendingAction,
  pendingAction,
  loaded,
  withdrawMode,
  setWithdrawMode,
  setIFARM,
  poolRewardSymbol,
  fAssetSymbol,
}) => {
  const { fetchUserPoolStats, userStats } = usePools()
  const { account, getWalletBalances, connected } = useWallet()
  const { vaultsData } = useVaults()
  const { handleClaim } = useActions()

  return (
    <SelectedVaultContainer maxWidth="100%" margin="0px" padding="0px" borderWidth="0px">
      <SelectedVault>
        <VaultPanelDetailsTooltip token={token} fAssetSymbol={fAssetSymbol} pool={fAssetPool} />
      </SelectedVault>
      {fAssetPool.id !== SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID &&
        rewardTokenSymbols.map((symbol, symbolIdx) => (
          <>
            <SelectedVault key={`${symbol}-rewards-earned`}>
              <SelectedVaultLabel>
                Total <b>{symbol}</b> Earned
              </SelectedVaultLabel>
              <SelectedVaultNumber>
                <Monospace>
                  {!connected ? (
                    formatNumber(0, 8)
                  ) : !isLoadingData &&
                    get(userStats, `[${get(fAssetPool, 'id')}].rewardsEarned`) ? (
                    <Counter
                      pool={fAssetPool}
                      totalTokensEarned={
                        rewardTokenSymbols.length > 1
                          ? fromWei(
                              get(rewardsEarned, symbol, 0),
                              get(tokens[symbol], 'decimals', 18),
                              4,
                            )
                          : totalTokensEarned
                      }
                      totalStaked={get(userStats, `[${fAssetPool.id}]['totalStaked']`, 0)}
                      ratePerDay={get(ratesPerDay, symbolIdx, ratesPerDay[0])}
                      rewardPerToken={get(
                        fAssetPool,
                        `rewardPerToken[${symbolIdx}]`,
                        fAssetPool.rewardPerToken[0],
                      )}
                      rewardTokenAddress={get(
                        fAssetPool,
                        `rewardTokens[${symbolIdx}]`,
                        fAssetPool.rewardTokens[0],
                      )}
                    />
                  ) : (
                    <AnimatedDots />
                  )}
                </Monospace>
              </SelectedVaultNumber>
            </SelectedVault>
            <SelectedVault alignItems="center">
              <SelectedVaultLabel fontSize="14px" lineHeight="17px" color="black">
                Rewards
              </SelectedVaultLabel>
              <Button
                width="50%"
                height="38px"
                size="md"
                onClick={() =>
                  handleClaim(account, fAssetPool, setPendingAction, async () => {
                    await getWalletBalances([poolRewardSymbol])
                    setLoadingDots(false, true)
                    await fetchUserPoolStats([fAssetPool], account, userStats)
                    setLoadingDots(false, false)
                  })
                }
                disabled={
                  !hasRequirementsForInteraction(
                    loaded,
                    pendingAction,
                    vaultsData,
                    loadingBalances,
                  ) || !hasAmountGreaterThanZero(totalRewardsEarned)
                }
              >
                {pendingAction === ACTIONS.CLAIM ? 'Processing...' : 'Claim'}
              </Button>
            </SelectedVault>
          </>
        ))}
      <SelectedVault justifyContent="flex-end" alignItems="flex-end" flexDirection="unset">
        <VaultPanelModeSwitch
          token={token}
          tokenSymbol={tokenSymbol}
          fAssetPool={fAssetPool}
          withdrawMode={withdrawMode}
          loaded={loaded}
          pendingAction={pendingAction}
          loadingBalances={loadingBalances}
          setWithdrawMode={setWithdrawMode}
          setIFARM={setIFARM}
        />
      </SelectedVault>
    </SelectedVaultContainer>
  )
}

export default PoolFooterActions

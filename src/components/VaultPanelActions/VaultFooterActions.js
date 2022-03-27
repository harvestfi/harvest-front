import React from 'react'
import { get } from 'lodash'
import ReactTooltip from 'react-tooltip'
import {
  SelectedVaultContainer,
  SelectedVault,
  SelectedVaultLabel,
  SelectedVaultNumber,
} from './style'
import { fromWei } from '../../services/web3'
import { formatNumber, hasAmountGreaterThanZero, hasRequirementsForInteraction } from '../../utils'
import { Monospace } from '../GlobalStyle'
import AnimatedDots from '../AnimatedDots'
import VaultPanelDetailsTooltip from '../VaultPanelDetailsTooltip'
import Counter from '../Counter'
import { useWallet } from '../../providers/Wallet'
import { usePools } from '../../providers/Pools'
import { ACTIONS } from '../../constants'
import { useVaults } from '../../providers/Vault'
import { useActions } from '../../providers/Actions'
import Button from '../Button'
import VaultPanelModeSwitch from '../VaultPanelModeSwitch'

const { tokens } = require('../../data')

const VaultFooterActions = ({
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
      {rewardTokenSymbols.slice(0, 1).map((symbol, symbolIdx) => (
        <SelectedVault key={`${symbol}-rewards-earned`}>
          <SelectedVaultLabel>
            Total <b>{symbol}</b> Earned
          </SelectedVaultLabel>
          <SelectedVaultNumber>
            <Monospace>
              {!connected ? (
                formatNumber(0, 8)
              ) : !isLoadingData && get(userStats, `[${get(fAssetPool, 'id')}].rewardsEarned`) ? (
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
      ))}
      <SelectedVault alignItems="center">
        <SelectedVaultLabel fontSize="14px" lineHeight="17px" color="black">
          Rewards
        </SelectedVaultLabel>
        <ReactTooltip
          id={`claim-tooltip-${tokenSymbol}`}
          backgroundColor="#fffce6"
          borderColor="black"
          border
          textColor="black"
          getContent={() =>
            token.hodlVaultId ? (
              <>
                <b>iFARM</b> and <b>fSUSHI</b> amount is claimed upon withdrawal only.
              </>
            ) : (
              <>
                Claims all non-compounded reward tokens.
                <br />
                All pending rewards are automatically claimed when withdrawing the full value of a
                position.
              </>
            )
          }
        />
        <Button
          data-for={`claim-tooltip-${tokenSymbol}`}
          data-tip=""
          color="primary"
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
            !hasRequirementsForInteraction(loaded, pendingAction, vaultsData, loadingBalances) ||
            !hasAmountGreaterThanZero(totalRewardsEarned)
          }
        >
          {pendingAction === ACTIONS.CLAIM ? 'Processing...' : 'Claim'}
        </Button>
      </SelectedVault>
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

export default VaultFooterActions

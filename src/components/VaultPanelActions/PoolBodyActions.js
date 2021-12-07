import React from 'react'
import { get, size } from 'lodash'
import ReactTooltip from 'react-tooltip'
import BigNumber from 'bignumber.js'
import {
  ACTIONS,
  FARM_TOKEN_SYMBOL,
  POOL_BALANCES_DECIMALS,
  IFARM_TOKEN_SYMBOL,
  SPECIAL_VAULTS,
} from '../../constants'
import { useActions } from '../../providers/Actions'
import { useContracts } from '../../providers/Contracts'
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
import { fromWei } from '../../services/web3'
import AnimatedDots from '../AnimatedDots'
import { Monospace, SmallLogo } from '../GlobalStyle'
import Counter from '../Counter'

const { addresses, tokens } = require('../../data')

const getStakeButtonText = action => {
  switch (action) {
    case ACTIONS.STAKE:
      return 'Staking...'
    case ACTIONS.APPROVE_STAKE:
      return 'Approving...'
    default:
      return 'Stake All'
  }
}

const PoolBodyActions = ({
  token,
  tokenSymbol,
  fAssetPool,
  lpTokenApprovedBalance,
  lpTokenBalance,
  setLoadingDots,
  setPendingAction,
  setAmountsToExecute,
  pendingAction,
  loaded,
  loadingBalances,
  multipleAssets,
  fAssetSymbol,
  isLoadingData,
  iFARMBalanceToEther,
  totalTokensEarned,
  ratesPerDay,
  iFARMinFARMInEther,
  rewardTokenSymbols,
  rewardsEarned,
  isSpecialVault,
  hasHodlCategory,
}) => {
  const { contracts } = useContracts()
  const { fetchUserPoolStats, userStats } = usePools()
  const { account, getWalletBalances, connected, balancesToLoad } = useWallet()
  const { vaultsData } = useVaults()
  const { handleStake } = useActions()

  const hodlVaultId = get(vaultsData, `[${tokenSymbol}].hodlVaultId`)

  return (
    <SelectedVaultContainer maxWidth="100%">
      <ReactTooltip
        id={`${fAssetPool.id}-unstaked-details`}
        backgroundColor="#fffce6"
        borderColor="black"
        border
        textColor="black"
        disable={fAssetPool.id !== SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID}
        clickable
        effect="solid"
        offset={{ top: -10 }}
      >
        The regular <b>{FARM_TOKEN_SYMBOL}</b> in your wallet (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://app.uniswap.org/#/swap?outputCurrency=${addresses.FARM}&use=V2`}
        >
          buy more
        </a>
        )
      </ReactTooltip>
      {size(rewardTokenSymbols) >= 2 ? (
        rewardTokenSymbols.slice(1, size(rewardTokenSymbols)).map((symbol, symbolIdx) =>
          !hodlVaultId &&
          !hasHodlCategory &&
          rewardTokenSymbols.length > 1 &&
          ((account &&
            Number(fAssetPool.rewardAPY[symbolIdx] || 0) === 0 &&
            new BigNumber(get(rewardsEarned, symbol, 0)).eq(0)) ||
            (!account && Number(fAssetPool.rewardAPY[symbolIdx] || 0) === 0)) ? null : (
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
          ),
        )
      ) : !hodlVaultId ? (
        <SelectedVault data-tip="" data-for={`${fAssetPool.id}-unstaked-details`}>
          <SelectedVaultLabel>
            Your Unstaked <b>{fAssetSymbol}</b>
          </SelectedVaultLabel>
          <SelectedVaultNumber>
            <Monospace>
              {!connected ? (
                formatNumber(0, 8)
              ) : !isLoadingData && get(userStats, `[${fAssetPool.id}]['lpTokenBalance']`) ? (
                fromWei(
                  get(userStats, `[${fAssetPool.id}]['lpTokenBalance']`, 0),
                  fAssetPool.lpTokenData.decimals,
                  POOL_BALANCES_DECIMALS,
                  true,
                )
              ) : (
                <AnimatedDots />
              )}
            </Monospace>
          </SelectedVaultNumber>
        </SelectedVault>
      ) : null}
      {!isSpecialVault && (
        <SelectedVault flexDirection="unset" justifyContent="center" alignItems="center">
          <Button
            width="50%"
            height="38px"
            size="md"
            onClick={() =>
              handleStake(
                token,
                account,
                tokenSymbol,
                lpTokenBalance,
                lpTokenApprovedBalance,
                fAssetPool,
                contracts,
                setPendingAction,
                multipleAssets,
                async () => {
                  setAmountsToExecute(['', ''])
                  setLoadingDots(false, true)
                  await fetchUserPoolStats([fAssetPool], account, userStats)
                  await getWalletBalances([tokenSymbol], false, true)
                  setLoadingDots(false, false)
                },
                async () => {
                  await fetchUserPoolStats([fAssetPool], account, userStats)
                },
              )
            }
            disabled={
              !hasRequirementsForInteraction(loaded, pendingAction, vaultsData, loadingBalances) ||
              !hasAmountGreaterThanZero(lpTokenBalance) ||
              token.inactive
            }
          >
            {getStakeButtonText(pendingAction)}
          </Button>
        </SelectedVault>
      )}
      <ReactTooltip
        id={`${fAssetPool.id}-staked-details`}
        backgroundColor="#fffce6"
        borderColor="black"
        border
        textColor="black"
        disable={fAssetPool.id !== SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID}
      >
        <b>{FARM_TOKEN_SYMBOL}</b> staked directly into <b>Profit Sharing</b>
      </ReactTooltip>
      <SelectedVault
        data-tip=""
        data-for={`${fAssetPool.id}-staked-details`}
        order={hodlVaultId ? 2 : 0}
      >
        <SelectedVaultLabel>Total Staked</SelectedVaultLabel>
        <SelectedVaultNumber>
          <Monospace>
            {!connected ? (
              formatNumber(0, 8)
            ) : !isLoadingData && get(userStats, `[${fAssetPool.id}]['totalStaked']`) ? (
              fAssetPool.autoStakePoolAddress ? (
                <Counter
                  pool={fAssetPool}
                  totalTokensEarned={totalTokensEarned}
                  totalStaked={get(userStats, `[${fAssetPool.id}]['totalStaked']`, 0)}
                  ratePerDay={ratesPerDay[0]}
                  rewardPerToken={fAssetPool.rewardPerToken[0]}
                  rewardTokenAddress={fAssetPool.rewardTokens[0]}
                />
              ) : (
                fromWei(
                  get(userStats, `[${fAssetPool.id}]['totalStaked']`, 0),
                  fAssetPool.lpTokenData.decimals,
                  POOL_BALANCES_DECIMALS,
                  true,
                )
              )
            ) : (
              <AnimatedDots />
            )}
          </Monospace>
        </SelectedVaultNumber>
      </SelectedVault>
      {fAssetPool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID ? (
        <>
          <ReactTooltip
            id="ifarm-details"
            backgroundColor="#fffce6"
            borderColor="black"
            border
            textColor="black"
          >
            <b>
              {tokens[IFARM_TOKEN_SYMBOL].displayName}: Interest-bearing {FARM_TOKEN_SYMBOL}
            </b>
            <br />
            <>
              {iFARMBalanceToEther <= 0 ? '1' : iFARMBalanceToEther}{' '}
              <b>{tokens[IFARM_TOKEN_SYMBOL].displayName}</b> = {iFARMinFARMInEther}{' '}
              <b>{FARM_TOKEN_SYMBOL}</b>
            </>
          </ReactTooltip>
          <SelectedVault data-tip="" data-for="ifarm-details">
            <SelectedVaultLabel>
              Your <b>{tokens[IFARM_TOKEN_SYMBOL].displayName}</b>&nbsp;
              <SmallLogo src="./icons/ifarm.png" alt={tokens[IFARM_TOKEN_SYMBOL].displayName} />
            </SelectedVaultLabel>
            <SelectedVaultNumber>
              <Monospace>
                {!connected ? (
                  formatNumber(0, 8)
                ) : !balancesToLoad.includes(FARM_TOKEN_SYMBOL) ? (
                  iFARMBalanceToEther
                ) : (
                  <AnimatedDots />
                )}
              </Monospace>
            </SelectedVaultNumber>
          </SelectedVault>
        </>
      ) : null}
    </SelectedVaultContainer>
  )
}

export default PoolBodyActions

import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { find, get, isArray, isEmpty, sumBy } from 'lodash'
import useDeepCompareEffect from 'use-deep-compare-effect'
import Collapsible from 'react-collapsible'
import ReactTooltip from 'react-tooltip'
import { usePools } from '../../providers/Pools'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet'
import { fromWei, newContractInstance, toWei } from '../../services/web3'
import { InputControl, FormGroup, VaultContainer, VaultBody, MigrationLabel } from './style'
import {
  DISABLED_DEPOSITS,
  FARM_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  MIGRATING_VAULTS,
  MINIMUM_DEPOSIT_AUTOFILL_AMOUNT_USD,
  PANEL_ACTIONS_TYPE,
  SPECIAL_VAULTS,
  UNIV3_POOL_ID_REGEX,
} from '../../constants'
import NumberInput from '../NumberInput'
import VaultPanelHeader from '../VaultPanelHeader'
import {
  hasValidAmountForInputAndMaxButton,
  hasAmountGreaterThanZero,
  hasRequirementsForInteraction,
  truncateNumberString,
  formatNumber,
  hasAmountLessThanOrEqualTo,
} from '../../utils'
import VaultPanelActions from '../VaultPanelActions'
import WithdrawInputTooltip from '../WithdrawInputTooltip'
import uniStatusViewerContractData from '../../services/web3/contracts/unistatus-viewer/contract.json'
import uniStatusViewerContractMethods from '../../services/web3/contracts/unistatus-viewer/methods'
import tokenContractMethods from '../../services/web3/contracts/token/methods'
import tokenContractData from '../../services/web3/contracts/token/contract.json'
import { CHAINS_ID } from '../../data/constants'

const { tokens } = require('../../data')

const getDepositOrWithdrawPrice = (
  token,
  lpTokenPrice,
  poolId,
  vaultsData,
  useIFARM,
  withdrawMode,
  isSpecialVault,
) => {
  if (withdrawMode || isSpecialVault) {
    if (withdrawMode && poolId === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID && useIFARM) {
      return get(vaultsData, `[${IFARM_TOKEN_SYMBOL}].usdPrice`, 0)
    }

    return lpTokenPrice
  }

  return token.usdPrice
}

const VaultPanel = ({
  token,
  setOpen,
  openVault,
  loaded,
  pendingAction,
  setPendingAction,
  tokenSymbol,
  ...props
}) => {
  const { pools, fetchUserPoolStats, userStats } = usePools()
  const { account, balances, chain, connected } = useWallet()
  const { vaultsData } = useVaults()

  const [withdrawMode, setWithdrawMode] = useState(false)
  const [amountsToExecute, setAmountsToExecute] = useState([''])
  const [loadingFarmingBalance, setFarmingLoading] = useState(false)
  const [loadingLpStats, setLpStatsloading] = useState(false)
  const [autoStake, setAutoStake] = useState(true)
  const [autoUnStake, setUnAutoStake] = useState(true)
  const [zap, selectZapMode] = useState(!token.disableAutoSwap)
  const [useIFARM, setIFARM] = useState(tokenSymbol === FARM_TOKEN_SYMBOL)
  const [amountsForUserShare, setAmountsForUserShare] = useState(null)
  const [amountsForPosition, setAmountsForPosition] = useState(null)
  const [oldLpTokenBalance, setOldLpTokenBalance] = useState(null)
  const [oldAmountToExecute, setOldAmountToExecute] = useState(null)

  const isSpecialVault = token.liquidityPoolVault || token.poolVault

  const isUniV3ManagedVault = !!(
    token.uniswapV3ManagedData?.capToken && token.uniswapV3ManagedData.capToken !== ''
  )

  const tokenDecimals = token.decimals || tokens[tokenSymbol].decimals

  const fAssetSymbol = isSpecialVault ? tokenSymbol : `f${tokenSymbol}`

  const fAssetPool = isSpecialVault
    ? token.data
    : find(pools, pool => pool.collateralAddress === tokens[tokenSymbol].vaultAddress)

  const userBalance = get(balances, tokenSymbol, 0)
  const iFARMBalance = get(balances, IFARM_TOKEN_SYMBOL, 0)
  const lpTokenBalance = get(userStats, `[${fAssetPool.id}]['lpTokenBalance']`, 0)
  const lpTokenApprovedBalance = get(userStats, `[${fAssetPool.id}]['lpTokenApprovedBalance']`, 0)
  const lpTokenPrice = get(fAssetPool, 'lpTokenData.price')
  const totalRewardsEarned = get(userStats, `[${fAssetPool.id}]['totalRewardsEarned']`, 0)
  const totalStaked = get(userStats, `[${fAssetPool.id}]['totalStaked']`, 0)
  const totalBalanceToWithdraw = new BigNumber(totalStaked).plus(lpTokenBalance)
  const totalAmountToExecute = useMemo(() => sumBy(amountsToExecute, amount => Number(amount)), [
    amountsToExecute,
  ])

  const multipleAssets = useMemo(
    () =>
      isArray(tokens[tokenSymbol].tokenAddress) &&
      tokens[tokenSymbol].tokenAddress.map(address => {
        const selectedSymbol = Object.keys(tokens).find(
          symbol =>
            !isArray(tokens[symbol].tokenAddress) &&
            tokens[symbol].tokenAddress.toLowerCase() === address.toLowerCase(),
        )
        return selectedSymbol
      }),
    [tokenSymbol],
  )

  const depositOrWithdrawPrice =
    !multipleAssets &&
    getDepositOrWithdrawPrice(
      token,
      lpTokenPrice,
      fAssetPool.id,
      vaultsData,
      useIFARM,
      withdrawMode,
      isSpecialVault,
    )

  const assetBalance = hasAmountGreaterThanZero(totalAmountToExecute)
    ? new BigNumber(token.underlyingBalanceWithInvestment)
        .multipliedBy(totalAmountToExecute)
        .dividedBy(token.totalSupply)
        .toString(10)
    : '0'

  const maxAssetsAmountToDisplay = useRef([])

  useEffect(() => {
    if (multipleAssets && !withdrawMode) {
      maxAssetsAmountToDisplay.current = []
      multipleAssets.forEach(symbol => {
        maxAssetsAmountToDisplay.current = [
          ...maxAssetsAmountToDisplay.current,
          get(balances, symbol, 0),
        ]
      })
    } else if (!withdrawMode) {
      maxAssetsAmountToDisplay.current = [
        fromWei(isSpecialVault ? lpTokenBalance : userBalance, tokenDecimals),
      ]
    } else if (isSpecialVault) {
      maxAssetsAmountToDisplay.current = [
        fromWei(useIFARM ? iFARMBalance : totalStaked, tokenDecimals),
      ]
    } else {
      maxAssetsAmountToDisplay.current = [
        fromWei(autoUnStake ? totalBalanceToWithdraw : lpTokenBalance, tokenDecimals),
      ]
    }
  }, [
    withdrawMode,
    isSpecialVault,
    autoUnStake,
    iFARMBalance,
    totalStaked,
    tokenDecimals,
    totalBalanceToWithdraw,
    lpTokenBalance,
    useIFARM,
    userBalance,
    multipleAssets,
    balances,
  ])

  useEffect(() => {
    const fetchAmountsForPosition = async () => {
      const viewerContractInstance = await newContractInstance(
        null,
        uniStatusViewerContractData.address,
        uniStatusViewerContractData.abi,
      )
      const amounts = await uniStatusViewerContractMethods.getAmountsForPosition(
        token.uniswapV3PositionId,
        viewerContractInstance,
      )

      setAmountsForPosition(amounts)
    }

    if (
      multipleAssets &&
      connected &&
      chain === CHAINS_ID.ETH_MAINNET &&
      openVault === tokenSymbol
    ) {
      fetchAmountsForPosition()
    }
  }, [multipleAssets, token, chain, connected, openVault, tokenSymbol])

  useEffect(() => {
    const fetchUserPositions = async () => {
      const viewerContractInstance = await newContractInstance(
        null,
        uniStatusViewerContractData.address,
        uniStatusViewerContractData.abi,
      )
      const amounts = await uniStatusViewerContractMethods.getAmountsForUserShare(
        token.vaultAddress,
        toWei(totalAmountToExecute, token.decimals, 0),
        viewerContractInstance,
      )

      if (token.migrationInfo) {
        const { lpTokenAddress, lpTokenDecimals } = token.migrationInfo

        const tokenInstance = await newContractInstance(null, lpTokenAddress, tokenContractData.abi)

        const fetchedOldLpTokenBalance = await tokenContractMethods.getBalance(
          account,
          tokenInstance,
        )

        setOldLpTokenBalance(fromWei(fetchedOldLpTokenBalance, lpTokenDecimals))
        setOldAmountToExecute(fromWei(fetchedOldLpTokenBalance, lpTokenDecimals))
      }

      setAmountsForUserShare(amounts)
    }

    if (multipleAssets && connected && chain === CHAINS_ID.ETH_MAINNET) {
      fetchUserPositions()
    }
  }, [totalAmountToExecute, multipleAssets, token, chain, account, connected])

  useEffect(() => {
    if (
      account &&
      fAssetPool &&
      fAssetPool.lpTokenData &&
      openVault === tokenSymbol &&
      !isEmpty(userStats)
    ) {
      const loadUserPoolsStats = async () => {
        const poolsToLoad = [fAssetPool]
        const hodlVaultId = get(vaultsData, `[${tokenSymbol}].hodlVaultId`)

        if (hodlVaultId) {
          const hodlVaultData = get(vaultsData, hodlVaultId)
          const hodlPool = find(
            pools,
            selectedPool => selectedPool.collateralAddress === hodlVaultData.vaultAddress,
          )

          poolsToLoad.push(hodlPool)
        }

        await fetchUserPoolStats(poolsToLoad, account, userStats)
      }
      loadUserPoolsStats()
    }
  }, [
    account,
    fAssetPool,
    openVault,
    fetchUserPoolStats,
    pools,
    vaultsData,
    tokenSymbol,
    userStats,
  ])

  const setUniV3AssetRatio = useCallback(
    (assetChangedIdx, newAmountsToExecute) => {
      if (!zap) {
        const assetToChangeIdx = !assetChangedIdx ? 1 : 0
        const { amount0, amount1 } = amountsForPosition
        const amountsToInsert = [...newAmountsToExecute]

        const amount0InEther = fromWei(amount0, tokens[multipleAssets[0]].decimals)
        const amount1InEther = fromWei(amount1, tokens[multipleAssets[1]].decimals)

        amountsToInsert[assetToChangeIdx] = new BigNumber(newAmountsToExecute[assetChangedIdx])
          .multipliedBy(!assetChangedIdx ? amount1InEther : amount0InEther)
          .div(!assetChangedIdx ? amount0InEther : amount1InEther)
          .toFixed()
        setAmountsToExecute(amountsToInsert)
      }
    },
    [amountsForPosition, zap, multipleAssets],
  )

  useDeepCompareEffect(() => {
    if (loaded && openVault === tokenSymbol) {
      let tokensAmounts, vault

      if (isSpecialVault) {
        if (withdrawMode) {
          tokensAmounts = [
            fromWei(
              useIFARM ? iFARMBalance : totalStaked,
              useIFARM
                ? tokens[IFARM_TOKEN_SYMBOL].decimals
                : get(fAssetPool, 'lpTokenData.decimals', 18),
            ),
          ]
        } else {
          tokensAmounts = [
            fromWei(
              tokenSymbol === FARM_TOKEN_SYMBOL ? userBalance : lpTokenBalance,
              get(fAssetPool, 'lpTokenData.decimals', 18),
            ),
          ]
        }
      } else {
        vault = vaultsData[tokenSymbol]
        if (withdrawMode) {
          tokensAmounts = [
            fromWei(
              new BigNumber(autoUnStake ? totalStaked : 0).plus(lpTokenBalance),
              vault.decimals,
            ),
          ]
        } else {
          tokensAmounts = multipleAssets
            ? multipleAssets.map(symbol => fromWei(balances[symbol], tokens[symbol].decimals))
            : [fromWei(userBalance, vault.decimals)]
        }
      }

      const amountsToInsert = []

      tokensAmounts.every((amount, amountIdx) => {
        const isUniV3 = new RegExp(UNIV3_POOL_ID_REGEX).test(fAssetPool.id)

        if (
          (isSpecialVault ||
            new BigNumber(
              multipleAssets
                ? get(
                    vaultsData,
                    `[${multipleAssets[amountIdx]}].usdPrice`,
                    MINIMUM_DEPOSIT_AUTOFILL_AMOUNT_USD + 1,
                  )
                : vault.usdPrice,
            )
              .times(amount)
              .gte(MINIMUM_DEPOSIT_AUTOFILL_AMOUNT_USD)) &&
          DISABLED_DEPOSITS.indexOf(tokenSymbol) === -1 &&
          MIGRATING_VAULTS.indexOf(tokenSymbol) === -1
        ) {
          if (isUniV3 && !withdrawMode && amountsForPosition) {
            const hasFirstAsset = new BigNumber(balances[multipleAssets[amountIdx]]).isGreaterThan(
              0,
            )

            setUniV3AssetRatio(hasFirstAsset ? 0 : 1, [
              fromWei(balances[multipleAssets[0]], tokens[multipleAssets[0]].decimals),
              fromWei(balances[multipleAssets[1]], tokens[multipleAssets[1]].decimals),
            ])
            return false
          }
          amountsToInsert.push(amount)
          return true
        }
        amountsToInsert.push('')
        return true
      })

      if (amountsToInsert.length) {
        setAmountsToExecute(amountsToInsert)
      }
    }
  }, [
    setAmountsToExecute,
    withdrawMode,
    vaultsData,
    loaded,
    openVault,
    tokenSymbol,
    isSpecialVault,
    useIFARM,
    amountsForPosition,
  ])

  const setLoadingDots = (loadingFarm, loadingLp) => {
    setFarmingLoading(loadingFarm)
    setLpStatsloading(loadingLp)
  }

  const viewComponentProps = {
    token,
    tokenSymbol,
    tokenDecimals,
    fAssetPool,
    fAssetSymbol,
    amountsToExecute,
    multipleAssets,
    lpTokenBalance,
    lpTokenApprovedBalance,
    totalRewardsEarned,
    totalStaked,
    withdrawMode,
    pendingAction,
    autoStake,
    autoUnStake,
    useIFARM,
    setAmountsToExecute,
    setLoadingDots,
    setPendingAction,
    setAutoStake,
    setUnAutoStake,
    setIFARM,
    setWithdrawMode,
    loaded,
    loadingBalances: loadingLpStats || loadingFarmingBalance,
    isSpecialVault,
    totalAmountToExecute,
    zap,
    selectZapMode,
  }

  return (
    <>
      <ReactTooltip
        id={`vault-panel-tooltop-${tokenSymbol}`}
        backgroundColor="white"
        borderColor="black"
        border
        textColor="black"
        disable={!token.rowTooltip}
        getContent={() => <>{token.rowTooltip}</>}
        clickable
        effect="solid"
        offset={{ top: -5 }}
      />
      <VaultContainer
        data-for={`vault-panel-tooltop-${tokenSymbol}`}
        data-tip
        open={openVault === tokenSymbol}
      >
        <Collapsible
          open={openVault === tokenSymbol}
          transitionTime={200}
          triggerDisabled={pendingAction !== null || token.disableVaultPanel}
          onOpening={() => setOpen(tokenSymbol)}
          onClosing={() => {
            if (openVault === tokenSymbol) {
              setOpen(null)
            }
          }}
          trigger={
            <VaultPanelHeader
              isSpecialVault={isSpecialVault}
              token={token}
              tokenSymbol={tokenSymbol}
              loadingFarmingBalance={loadingFarmingBalance}
              loadedVault={loaded}
              useIFARM={useIFARM}
              fAssetSymbol={fAssetSymbol}
              multipleAssets={multipleAssets}
              {...props}
            />
          }
          triggerWhenOpen={
            <VaultPanelHeader
              isSpecialVault={isSpecialVault}
              token={token}
              tokenSymbol={tokenSymbol}
              loadingFarmingBalance={loadingFarmingBalance}
              loadedVault={loaded}
              useIFARM={useIFARM}
              fAssetSymbol={fAssetSymbol}
              multipleAssets={multipleAssets}
              open
              {...props}
            />
          }
          overflowWhenOpen="visible"
          lazyRender
        >
          <VaultBody>
            {isUniV3ManagedVault && (
              <VaultPanelActions type={PANEL_ACTIONS_TYPE.UNIV3MANAGED} {...viewComponentProps} />
            )}
            <FormGroup>
              <InputControl
                flexDirection={!withdrawMode && multipleAssets ? 'column' : 'row'}
                justifyContent={!withdrawMode && multipleAssets ? 'space-between' : 'unset'}
                gap={!withdrawMode && multipleAssets ? '20px' : 'unset'}
              >
                {!withdrawMode && multipleAssets ? (
                  multipleAssets.map((symbol, symbolIdx) => {
                    const symbolToDisplay = withdrawMode ? fAssetSymbol : symbol
                    const maxBalanceToDisplay = get(maxAssetsAmountToDisplay.current, symbolIdx, 0)
                    const priceInUsd = get(
                      vaultsData,
                      `[${tokenSymbol}].uniswapV3UnderlyingTokenPrices[${symbolIdx}]`,
                    )

                    return (
                      <FormGroup width="100%" key={symbolToDisplay}>
                        <NumberInput
                          data-tip=""
                          data-for={`input-${symbolToDisplay}`}
                          width="100%"
                          label={`Balance <b>${symbolToDisplay}</b>`}
                          secondaryLabel={`${fromWei(
                            maxBalanceToDisplay,
                            tokens[symbol].decimals,
                          )} ${
                            priceInUsd
                              ? `($${formatNumber(
                                  new BigNumber(
                                    fromWei(maxBalanceToDisplay, tokens[symbol].decimals),
                                  ).multipliedBy(priceInUsd),
                                  9,
                                )})`
                              : ''
                          }`}
                          onChange={e => {
                            const newAmountsToExecute = amountsToExecute.slice()
                            newAmountsToExecute[symbolIdx] = e.target.value

                            setAmountsToExecute(newAmountsToExecute)

                            if (fAssetPool && new RegExp(UNIV3_POOL_ID_REGEX).test(fAssetPool.id)) {
                              setUniV3AssetRatio(symbolIdx, newAmountsToExecute)
                            }
                          }}
                          value={amountsToExecute[symbolIdx]}
                          disabled={
                            !hasRequirementsForInteraction(
                              loaded,
                              pendingAction,
                              vaultsData,
                              loadingLpStats || loadingFarmingBalance,
                            ) ||
                            !hasValidAmountForInputAndMaxButton(
                              get(balances, symbol, 0),
                              null,
                              null,
                              symbol,
                            )
                          }
                          onClick={() => {
                            const newAmountsToExecute = amountsToExecute.slice()
                            newAmountsToExecute[symbolIdx] = fromWei(
                              get(balances, symbol, 0),
                              tokens[symbol].decimals,
                            )
                            setAmountsToExecute(newAmountsToExecute)

                            if (fAssetPool && new RegExp(UNIV3_POOL_ID_REGEX).test(fAssetPool.id)) {
                              setUniV3AssetRatio(symbolIdx, newAmountsToExecute)
                            }
                          }}
                          invalidAmount={
                            new RegExp(UNIV3_POOL_ID_REGEX).test(fAssetPool.id) &&
                            !hasAmountLessThanOrEqualTo(
                              amountsToExecute[symbolIdx],
                              fromWei(get(balances, symbol, 0), tokens[symbol].decimals),
                            )
                          }
                          placeholder="0"
                        />
                      </FormGroup>
                    )
                  })
                ) : (
                  <>
                    <WithdrawInputTooltip
                      id={`input-${tokenSymbol}`}
                      backgroundColor="white"
                      borderColor="black"
                      border
                      textColor="black"
                      place="left"
                      effect="solid"
                      disable={
                        !withdrawMode ||
                        !hasRequirementsForInteraction(
                          loaded,
                          pendingAction,
                          vaultsData,
                          loadingLpStats || loadingFarmingBalance,
                        ) ||
                        isSpecialVault
                      }
                      className="w-190 fixed-tooltip"
                      event="mouseenter"
                      eventOff="mouseleave"
                      getContent={() => (
                        <>
                          {multipleAssets ? (
                            multipleAssets.map((symbol, symbolIdx) => (
                              <div key={symbol} style={{ textAlign: 'left' }}>
                                {symbol}:{' '}
                                {formatNumber(
                                  fromWei(
                                    get(amountsForUserShare, symbolIdx),
                                    tokens[symbol].decimals,
                                    5,
                                    false,
                                    null,
                                  ),
                                  9,
                                )}
                                <br />
                              </div>
                            ))
                          ) : (
                            <>
                              {truncateNumberString(
                                amountsToExecute[0],
                                Math.min(token.decimals, 9),
                              )}{' '}
                              Shares <br />
                              Estimated&nbsp;
                              {token.displayName ? token.displayName : tokenSymbol}:<br />
                              {assetBalance
                                ? truncateNumberString(assetBalance, Math.min(token.decimals, 9))
                                : 'N/A'}
                            </>
                          )}
                        </>
                      )}
                      hide={!hasAmountGreaterThanZero(amountsToExecute[0])}
                    />
                    <NumberInput
                      data-tip=""
                      data-for={`input-${tokenSymbol}`}
                      width="100%"
                      label={`Balance <b>${
                        withdrawMode
                          ? fAssetPool.id === SPECIAL_VAULTS.NEW_PROFIT_SHARING_POOL_ID && useIFARM
                            ? 'iFARM'
                            : fAssetSymbol
                          : tokenSymbol
                      }</b>`}
                      secondaryLabel={`${get(maxAssetsAmountToDisplay.current, '[0]', '-')} ${
                        depositOrWithdrawPrice
                          ? `($${formatNumber(
                              new BigNumber(
                                get(maxAssetsAmountToDisplay.current, '[0]'),
                              ).multipliedBy(depositOrWithdrawPrice),
                              9,
                            )})`
                          : ''
                      }`}
                      onChange={e => setAmountsToExecute([e.target.value])}
                      value={amountsToExecute[0]}
                      disabled={
                        !hasRequirementsForInteraction(
                          loaded,
                          pendingAction,
                          vaultsData,
                          loadingLpStats || loadingFarmingBalance,
                        ) ||
                        !hasValidAmountForInputAndMaxButton(
                          userBalance,
                          lpTokenBalance,
                          totalStaked,
                          tokenSymbol,
                          withdrawMode,
                          isSpecialVault,
                          iFARMBalance,
                          useIFARM,
                        )
                      }
                      onClick={() => {
                        let amount
                        if (!withdrawMode) {
                          amount = fromWei(
                            isSpecialVault ? lpTokenBalance : userBalance,
                            tokenDecimals,
                          )
                        } else if (isSpecialVault) {
                          amount = fromWei(useIFARM ? iFARMBalance : totalStaked, tokenDecimals)
                        } else {
                          amount = fromWei(
                            autoUnStake ? totalBalanceToWithdraw : lpTokenBalance,
                            tokenDecimals,
                          )
                        }

                        setAmountsToExecute([amount])
                      }}
                      placeholder="0"
                    />
                  </>
                )}
              </InputControl>
              <VaultPanelActions type={PANEL_ACTIONS_TYPE.HEAD} {...viewComponentProps} />
            </FormGroup>
            {multipleAssets &&
            !withdrawMode &&
            tokens[tokenSymbol].migrationInfo &&
            new BigNumber(oldLpTokenBalance).gt(0) ? (
              <FormGroup padding="20px 0 0 0" margin="20px 0 0 0" borderTop="1px solid #dadfe6">
                <InputControl
                  flexDirection={!withdrawMode && multipleAssets ? 'column' : 'row'}
                  justifyContent={!withdrawMode && multipleAssets ? 'space-between' : 'unset'}
                >
                  <MigrationLabel>Migrate liquidity from Uniswap V2</MigrationLabel>
                  <NumberInput
                    data-tip=""
                    data-for="input-migrate"
                    width="100%"
                    label={`Balance <b>${tokens[tokenSymbol].migrationInfo.lpTokenName}</b>`}
                    secondaryLabel={`${oldLpTokenBalance} ${
                      get(vaultsData, `[${tokenSymbol}].usdPrice`)
                        ? `($${formatNumber(
                            new BigNumber(oldLpTokenBalance).multipliedBy(
                              get(vaultsData, `[${tokenSymbol}].usdPrice`),
                            ),
                            9,
                          )})`
                        : ''
                    }`}
                    onChange={e => {
                      setOldAmountToExecute(e.target.value)
                    }}
                    value={oldAmountToExecute}
                    disabled={
                      !hasRequirementsForInteraction(
                        loaded,
                        pendingAction,
                        vaultsData,
                        loadingLpStats || loadingFarmingBalance,
                      ) ||
                      !hasValidAmountForInputAndMaxButton(
                        oldLpTokenBalance,
                        null,
                        null,
                        tokenSymbol,
                      )
                    }
                    placeholder="0"
                    onClick={() => setOldAmountToExecute(oldLpTokenBalance)}
                  />
                </InputControl>
                <VaultPanelActions
                  type={PANEL_ACTIONS_TYPE.MIGRATE}
                  migrationInfo={token.migrationInfo}
                  lpAmount={toWei(oldAmountToExecute, 18)}
                  {...viewComponentProps}
                />
              </FormGroup>
            ) : null}
            <VaultPanelActions {...viewComponentProps} />
          </VaultBody>
        </Collapsible>
      </VaultContainer>
    </>
  )
}

export default VaultPanel

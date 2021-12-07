import BigNumber from 'bignumber.js'
import { find, get, isUndefined } from 'lodash'
import React, { createContext, useCallback, useContext } from 'react'
import { toast } from 'react-toastify'
import { forEach } from 'promised-loops'
import axios from 'axios'
import {
  ACTIONS,
  FARM_TOKEN_SYMBOL,
  IFARM_TOKEN_SYMBOL,
  UNIV3_SLIPPAGE_TOLERANCE,
  UNIV3_TOLERANCE,
  ZAPPER_FI_ZAP_IN_ENDPOINT,
} from '../constants'
import { formatWeb3PluginErrorMessage, mainWeb3, newContractInstance } from '../services/web3'
import tokenMethods from '../services/web3/contracts/token/methods'
import tokenContractData from '../services/web3/contracts/token/contract.json'
import poolMethods from '../services/web3/contracts/pool/methods'
import poolContractData from '../services/web3/contracts/pool/contract.json'
import vaultMethods from '../services/web3/contracts/vault/methods'
import univ3Methods from '../services/web3/contracts/uniswap-v3/methods'
import uniStatusViewerContractData from '../services/web3/contracts/unistatus-viewer/contract.json'
import uniStatusViewerContractMethods from '../services/web3/contracts/unistatus-viewer/methods'
import boostStakingMethods from '../services/web3/contracts/boost-staking/methods'
import amplifierMethods from '../services/web3/contracts/amplifier/methods'
import { CustomException } from '../utils'

const { addresses, tokens, pools } = require('../data')

const ActionsContext = createContext()
const useActions = () => useContext(ActionsContext)

const ActionsProvider = ({ children }) => {
  const handleApproval = useCallback(
    async (
      account,
      contracts,
      tokenSymbol,
      vaultAddress,
      poolData,
      setPendingAction,
      onSuccessApproval = () => {},
    ) => {
      const address = vaultAddress || tokens[tokenSymbol].vaultAddress

      try {
        if (poolData) {
          const totalSupply = await tokenMethods.getTotalSupply(poolData.lpTokenData.instance)
          await tokenMethods.approve(
            poolData.autoStakePoolAddress || poolData.contractAddress,
            account,
            totalSupply,
            poolData.lpTokenData.instance,
          )
        } else {
          const { methods, instance } = contracts[
            tokenSymbol === IFARM_TOKEN_SYMBOL ? FARM_TOKEN_SYMBOL : tokenSymbol
          ]

          const totalSupply = await tokenMethods.getTotalSupply(instance)
          await methods.approve(address, account, totalSupply, instance)
        }

        await onSuccessApproval()

        toast.success(
          `${get(tokens, `[${tokenSymbol}].displayName`, tokenSymbol)} approval completed`,
        )

        return false
      } catch (err) {
        setPendingAction(null)
        const errorMessage = formatWeb3PluginErrorMessage(err)
        toast.error(errorMessage)

        return true
      }
    },
    [],
  )

  const handleMigrate = useCallback(
    async (
      setPendingAction,
      migrationInfo,
      lpAmount,
      vaultData,
      fAssetSymbol,
      account,
      onSuccess = () => {},
      autoStake,
      zap,
    ) => {
      const { lpTokenAddress, lpTokenName } = migrationInfo

      const tokenInstance = await newContractInstance(null, lpTokenAddress, tokenContractData.abi)

      const currApprovedBalance = await tokenMethods.getApprovedAmount(
        account,
        vaultData.vaultAddress,
        tokenInstance,
      )

      let approved = true
      if (new BigNumber(currApprovedBalance).lt(lpAmount)) {
        setPendingAction(ACTIONS.APPROVE_MIGRATE)

        try {
          const totalSupply = await tokenMethods.getTotalSupply(tokenInstance)
          await tokenMethods.approve(vaultData.vaultAddress, account, totalSupply, tokenInstance)

          toast.success(`${lpTokenName} approval completed`)

          approved = true
        } catch (err) {
          setPendingAction(null)
          const errorMessage = formatWeb3PluginErrorMessage(err)
          toast.error(errorMessage)
          approved = false
        }
      }

      if (approved) {
        try {
          setPendingAction(ACTIONS.MIGRATE)
          const viewerContractInstance = await newContractInstance(
            null,
            uniStatusViewerContractData.address,
            uniStatusViewerContractData.abi,
          )

          const quote = await uniStatusViewerContractMethods.quoteV2Migration(
            vaultData.tokenAddress[0],
            vaultData.tokenAddress[1],
            lpAmount,
            viewerContractInstance,
          )
          const sqrtRatioX96 = await univ3Methods.getSqrtPriceX96(vaultData.instance)

          if (vaultData.zapFrontrunProtection) {
            let actualAmount0, actualAmount1

            try {
              const {
                0: simulationAmount0,
                1: simulationAmount1,
              } = await univ3Methods.migrateToNftFromV2(
                lpAmount,
                new BigNumber(quote[0]).times(0.95).toFixed(0),
                new BigNumber(quote[1]).times(0.95).toFixed(0),
                zap,
                sqrtRatioX96,
                UNIV3_TOLERANCE,
                undefined,
                undefined,
                account,
                vaultData.instance,
                true,
              )
              actualAmount0 = simulationAmount0
              actualAmount1 = simulationAmount1
            } catch (err) {
              console.error(err)
              throw new CustomException(
                `Could not simulate the transaction. Try specifying different amounts.`,
                'MIGRATE_TO_NFT_SIMULATION',
              )
            }

            await univ3Methods.migrateToNftFromV2(
              lpAmount,
              new BigNumber(quote[0]).times(UNIV3_SLIPPAGE_TOLERANCE).toFixed(0),
              new BigNumber(quote[1]).times(UNIV3_SLIPPAGE_TOLERANCE).toFixed(0),
              zap,
              sqrtRatioX96,
              UNIV3_TOLERANCE,
              !isUndefined(actualAmount0)
                ? new BigNumber(actualAmount0).times(UNIV3_SLIPPAGE_TOLERANCE).toFixed(0)
                : undefined,
              !isUndefined(actualAmount1)
                ? new BigNumber(actualAmount1).times(UNIV3_SLIPPAGE_TOLERANCE).toFixed(0)
                : undefined,
              account,
              vaultData.instance,
            )
          } else {
            await univ3Methods.migrateToNftFromV2Legacy(
              lpAmount,
              new BigNumber(quote[0]).times(UNIV3_SLIPPAGE_TOLERANCE).toFixed(0),
              new BigNumber(quote[1]).times(UNIV3_SLIPPAGE_TOLERANCE).toFixed(0),
              zap,
              true,
              sqrtRatioX96,
              UNIV3_TOLERANCE,
              account,
              vaultData.instance,
            )
          }

          toast.success(`${lpTokenName} migration completed`)
          await onSuccess()

          if (autoStake) {
            const stakingPool = find(
              pools,
              pool => pool.collateralAddress === vaultData.vaultAddress,
            )

            const stakingTokenInstance = await newContractInstance(
              null,
              vaultData.vaultAddress,
              tokenContractData.abi,
            )

            const stakingTokenApprovedBalance = await tokenMethods.getApprovedAmount(
              account,
              stakingPool.contractAddress,
              stakingTokenInstance,
            )

            const stakingTokenBalance = await tokenMethods.getBalance(account, stakingTokenInstance)

            if (new BigNumber(stakingTokenApprovedBalance).lt(stakingTokenBalance)) {
              setPendingAction(ACTIONS.APPROVE_MIGRATE)

              const totalSupply = await tokenMethods.getTotalSupply(stakingTokenInstance)

              await tokenMethods.approve(
                stakingPool.contractAddress,
                account,
                totalSupply,
                stakingTokenInstance,
              )

              toast.success(`${fAssetSymbol} approval completed`)
            }

            const poolInstance = await newContractInstance(
              null,
              stakingPool.contractAddress,
              poolContractData.abi,
            )
            setPendingAction(ACTIONS.STAKE_MIGRATE)

            await poolMethods.stake(stakingTokenBalance, account, poolInstance)

            await onSuccess()

            setPendingAction(null)
            toast.success(`${fAssetSymbol} approval completed`)
          }
        } catch (err) {
          const errorMessage = formatWeb3PluginErrorMessage(err)
          toast.error(errorMessage)
        }

        setPendingAction(null)
      }
    },
    [],
  )

  const handleDeposit = useCallback(
    async (
      token,
      account,
      tokenSymbol,
      amountsToExecute,
      approvedBalance,
      contracts,
      vaultData,
      setPendingAction,
      autoStake,
      fAssetPool,
      multipleAssets,
      zap,
      onSuccessDeposit = () => {},
      onSuccessApproval = () => {},
    ) => {
      let hasDeniedRequest = false,
        updatedLpTokenBalance,
        updatedLpTokenApprovedBalance

      await forEach(amountsToExecute, async (amount, amountIdx) => {
        let hasEnoughApprovedAmount

        if (multipleAssets) {
          if (amount !== null) {
            const tokenInstance = await newContractInstance(
              null,
              addresses[multipleAssets[amountIdx]],
              tokenContractData.abi,
            )

            const currApprovedBalance = await tokenMethods.getApprovedAmount(
              account,
              token.vaultAddress,
              tokenInstance,
            )

            hasEnoughApprovedAmount = new BigNumber(amount).isLessThanOrEqualTo(
              new BigNumber(currApprovedBalance),
            )
          }
        } else {
          hasEnoughApprovedAmount = new BigNumber(amount).isLessThanOrEqualTo(
            new BigNumber(approvedBalance),
          )
        }

        if (amount !== null && !hasEnoughApprovedAmount && !hasDeniedRequest) {
          setPendingAction(ACTIONS.APPROVE_DEPOSIT)

          hasDeniedRequest = await handleApproval(
            account,
            contracts,
            multipleAssets ? multipleAssets[amountIdx] : tokenSymbol,
            vaultData.vaultAddress,
            null,
            setPendingAction,
            onSuccessApproval,
          )
        }
      })

      if (!hasDeniedRequest) {
        setPendingAction(ACTIONS.DEPOSIT)

        try {
          if (multipleAssets) {
            const firstAmount =
              amountsToExecute[0] === null || amountsToExecute[0] === undefined
                ? 0
                : amountsToExecute[0]
            const secondAmount =
              amountsToExecute[1] === null || amountsToExecute[1] === undefined
                ? 0
                : amountsToExecute[1]
            const sqrtRatioX96 = await univ3Methods.getSqrtPriceX96(vaultData.instance)

            if (zap && token.zapFrontrunProtection) {
              let actualAmount0, actualAmount1

              try {
                const { 0: simulationAmount0, 1: simulationAmount1 } = await univ3Methods.deposit(
                  firstAmount,
                  secondAmount,
                  zap,
                  sqrtRatioX96,
                  UNIV3_TOLERANCE,
                  undefined,
                  undefined,
                  account,
                  vaultData.instance,
                  true,
                )
                actualAmount0 = simulationAmount0
                actualAmount1 = simulationAmount1
              } catch (err) {
                console.error(err)
                throw new CustomException(
                  `Could not simulate the transaction with inputs ${firstAmount} and ${secondAmount}. Try specifying different amounts.`,
                  'DEPOSIT_SIMULATION',
                )
              }

              await univ3Methods.deposit(
                firstAmount,
                secondAmount,
                zap,
                sqrtRatioX96,
                UNIV3_TOLERANCE,
                !isUndefined(actualAmount0)
                  ? new BigNumber(actualAmount0).times(UNIV3_SLIPPAGE_TOLERANCE).toFixed(0)
                  : undefined,
                !isUndefined(actualAmount1)
                  ? new BigNumber(actualAmount1).times(UNIV3_SLIPPAGE_TOLERANCE).toFixed(0)
                  : undefined,
                account,
                vaultData.instance,
              )
            } else {
              await univ3Methods.legacyDeposit(
                firstAmount,
                secondAmount,
                zap,
                true,
                sqrtRatioX96,
                UNIV3_TOLERANCE,
                account,
                vaultData.instance,
              )
            }
          } else {
            await vaultMethods.deposit(amountsToExecute[0], account, vaultData.instance)
          }

          toast.success('Deposit completed')

          if (autoStake) {
            const { instance: lpTokenInstance } = fAssetPool.lpTokenData
            updatedLpTokenBalance = await tokenMethods.getBalance(account, lpTokenInstance)
            updatedLpTokenApprovedBalance = await tokenMethods.getApprovedAmount(
              account,
              fAssetPool.contractAddress,
              lpTokenInstance,
            )
          } else {
            setPendingAction(null)
          }

          await onSuccessDeposit(updatedLpTokenBalance, updatedLpTokenApprovedBalance)
        } catch (err) {
          setPendingAction(null)

          const errorMessage = formatWeb3PluginErrorMessage(err, get(err, 'message'))
          toast.error(errorMessage)
        }
      }
    },
    [handleApproval],
  )

  const handleStake = useCallback(
    async (
      token,
      account,
      tokenSymbol,
      lpTokenBalance,
      lpTokenApprovedBalance,
      poolData,
      contracts,
      setPendingAction,
      multipleAssets,
      onSuccessStake = () => {},
      onSuccessApproval = () => {},
      action = ACTIONS.STAKE,
    ) => {
      const poolInstance = poolData.autoStakeContractInstance || poolData.contractInstance
      const tokenDisplayName = get(tokens, `[${tokenSymbol}].displayName`, tokenSymbol)

      let hasDeniedRequest = false

      if (poolData && lpTokenBalance > 0) {
        try {
          const hasEnoughApprovedAmount = new BigNumber(lpTokenBalance).isLessThanOrEqualTo(
            new BigNumber(lpTokenApprovedBalance),
          )

          if (!hasEnoughApprovedAmount) {
            if (!hasEnoughApprovedAmount && !hasDeniedRequest) {
              setPendingAction(ACTIONS.APPROVE_STAKE)
              hasDeniedRequest = await handleApproval(
                account,
                contracts,
                tokenSymbol,
                multipleAssets ? token.vaultAddress : null,
                poolData,
                setPendingAction,
                onSuccessApproval,
              )
            }
          }

          if (!hasDeniedRequest) {
            setPendingAction(action)
            await poolMethods.stake(lpTokenBalance, account, poolInstance)
            setPendingAction(null)
            toast.success(`${tokenDisplayName} stake completed`)
            await onSuccessStake()
          }
        } catch (err) {
          setPendingAction(null)
          const errorMessage = formatWeb3PluginErrorMessage(err)
          toast.error(errorMessage)
        }
      }
    },
    [handleApproval],
  )

  const handleClaim = useCallback(
    async (account, poolData, setPendingAction, onSuccess = () => {}, action = ACTIONS.CLAIM) => {
      const poolInstance = poolData.autoStakeContractInstance || poolData.contractInstance

      if (poolData) {
        setPendingAction(action)
        try {
          if (poolData.rewardTokenSymbols.length > 1) {
            await poolMethods.claimAll(account, poolInstance)
          } else {
            await poolMethods.claim(account, poolInstance)
          }

          setPendingAction(null)
          toast.success('Claim completed')
          await onSuccess()
        } catch (err) {
          setPendingAction(null)
          const errorMessage = formatWeb3PluginErrorMessage(err)
          toast.error(errorMessage)
        }
      }
    },
    [],
  )

  const handleExit = useCallback(
    async (
      account,
      poolData,
      partialExit,
      amountsToExecute,
      setPendingAction,
      onSuccess = () => {},
      action = ACTIONS.EXIT,
    ) => {
      const poolInstance = poolData.autoStakeContractInstance || poolData.contractInstance

      if (poolData) {
        setPendingAction(action)
        try {
          if (partialExit) {
            await poolMethods.withdraw(account, amountsToExecute, poolInstance)
            toast.success('Unstake completed')
          } else {
            await poolMethods.exit(account, poolInstance)
            toast.success('Unstake & claim completed')
          }

          setPendingAction(null)

          await onSuccess()
        } catch (err) {
          setPendingAction(null)
          const errorMessage = formatWeb3PluginErrorMessage(err)
          toast.error(errorMessage)
        }
      }
    },
    [],
  )

  const handleWithdraw = useCallback(
    async (
      account,
      tokenSymbol,
      depositedAmount,
      vaultsData,
      setPendingAction,
      multipleAssets,
      selectedAsset,
      onSuccess = () => {},
      action = ACTIONS.WITHDRAW,
    ) => {
      setPendingAction(action)

      try {
        if (multipleAssets) {
          const withdrawFirstAsset = selectedAsset === 0 || selectedAsset === -1
          const withdrawSecondAsset = selectedAsset === 1 || selectedAsset === -1
          const sqrtRatioX96 = await univ3Methods.getSqrtPriceX96(vaultsData[tokenSymbol].instance)

          if (vaultsData[tokenSymbol].zapFrontrunProtection) {
            let actualAmount0, actualAmount1

            try {
              const { 0: simulationAmount0, 1: simulationAmount1 } = await univ3Methods.withdraw(
                depositedAmount,
                withdrawFirstAsset,
                withdrawSecondAsset,
                sqrtRatioX96,
                UNIV3_TOLERANCE,
                undefined,
                undefined,
                account,
                vaultsData[tokenSymbol].instance,
                true,
              )
              actualAmount0 = simulationAmount0
              actualAmount1 = simulationAmount1
            } catch (err) {
              console.error(err)
              throw new CustomException(
                `Could not simulate the transaction with inputs ${withdrawFirstAsset} and ${withdrawSecondAsset}. Try specifying different amounts.`,
                'WITHDRAW_SIMULATION',
              )
            }

            await univ3Methods.withdraw(
              depositedAmount,
              withdrawFirstAsset,
              withdrawSecondAsset,
              sqrtRatioX96,
              UNIV3_TOLERANCE,
              !isUndefined(actualAmount0)
                ? new BigNumber(actualAmount0).times(UNIV3_SLIPPAGE_TOLERANCE).toFixed(0)
                : undefined,
              !isUndefined(actualAmount1)
                ? new BigNumber(actualAmount1).times(UNIV3_SLIPPAGE_TOLERANCE).toFixed(0)
                : undefined,
              account,
              vaultsData[tokenSymbol].instance,
            )
          } else {
            await univ3Methods.legacyWithdraw(
              depositedAmount,
              withdrawFirstAsset,
              withdrawSecondAsset,
              sqrtRatioX96,
              UNIV3_TOLERANCE,
              account,
              vaultsData[tokenSymbol].instance,
            )
          }
        } else {
          await vaultMethods.withdraw(depositedAmount, account, vaultsData[tokenSymbol].instance)
        }

        setPendingAction(null)
        toast.success('Withdraw completed')
        await onSuccess()
      } catch (err) {
        setPendingAction(null)
        const errorMessage = formatWeb3PluginErrorMessage(err)
        toast.error(errorMessage)
      }
    },
    [],
  )

  const handleBoostStake = useCallback(
    async (
      token,
      account,
      amountToExecute,
      setPendingAction,
      contracts,
      onSuccessStake = () => {},
      action = ACTIONS.STAKE,
    ) => {
      let hasDeniedRequest = false

      try {
        const currApprovedBalance = await tokenMethods.getApprovedAmount(
          account,
          token.proxyAddress,
          contracts.tokenInstance,
        )

        const hasEnoughApprovedAmount = new BigNumber(amountToExecute).isLessThanOrEqualTo(
          new BigNumber(currApprovedBalance),
        )

        if (!hasEnoughApprovedAmount) {
          if (!hasEnoughApprovedAmount && !hasDeniedRequest) {
            setPendingAction(ACTIONS.APPROVE_STAKE)
            hasDeniedRequest = await handleApproval(
              account,
              {
                [token.symbol]: {
                  instance: contracts.tokenInstance,
                  methods: tokenMethods,
                },
              },
              token.symbol,
              token.proxyAddress,
              null,
              setPendingAction,
            )
          }
        }

        if (!hasDeniedRequest) {
          setPendingAction(action)

          await boostStakingMethods.stake(amountToExecute, account, contracts.boostStakingInstance)
          setPendingAction(null)
          toast.success(`${token.displayName} stake completed`)
          await onSuccessStake()
        }
      } catch (err) {
        setPendingAction(null)
        const errorMessage = formatWeb3PluginErrorMessage(err)
        toast.error(errorMessage)
      }
    },
    [handleApproval],
  )

  const handleBoostUnstake = useCallback(
    async (
      token,
      account,
      amountToExecute,
      setPendingAction,
      contracts,
      onSuccessUnstake = () => {},
      action = ACTIONS.EXIT,
    ) => {
      try {
        setPendingAction(action)
        await boostStakingMethods.unstake(amountToExecute, account, contracts.boostStakingInstance)
        setPendingAction(null)
        toast.success(`${token.displayName} unstake completed`)
        await onSuccessUnstake()
      } catch (err) {
        setPendingAction(null)
        const errorMessage = formatWeb3PluginErrorMessage(err)
        toast.error(errorMessage)
      }
    },
    [],
  )

  const handleBoostReedem = useCallback(
    async (
      token,
      account,
      amountToExecute,
      setPendingAction,
      contracts,
      onSuccessRedeem = () => {},
      action = ACTIONS.REDEEM,
    ) => {
      try {
        setPendingAction(action)
        await amplifierMethods.withdraw(amountToExecute, account, contracts.amplifierInstance)
        setPendingAction(null)
        toast.success(`${token.amplifierTokenDisplayName} redeem completed`)
        await onSuccessRedeem()
      } catch (err) {
        setPendingAction(null)
        const errorMessage = formatWeb3PluginErrorMessage(err)
        toast.error(errorMessage)
      }
    },
    [],
  )

  const handleZapAllowanceCheck = useCallback(async (selectedToken, ownerAddress) => {
    try {
      const apiResponse = await axios.get(`${ZAPPER_FI_ZAP_IN_ENDPOINT}/approval-state`, {
        params: {
          sellTokenAddress: selectedToken.value,
          ownerAddress,
          api_key: process.env.REACT_APP_ZAPPERFI_API_KEY,
        },
      })
      return get(apiResponse, 'data.isApproved')
    } catch (err) {
      console.error(err)
      toast.error('Error checking your allowance. Please make sure your connection is stable')
      return null
    }
  }, [])

  const handleZapAllowanceUpgrade = useCallback(
    async (selectedToken, ownerAddress, setPendingAction, action = ACTIONS.APPROVE_DEPOSIT) => {
      try {
        setPendingAction(action)
        const gasPrice = await mainWeb3.eth.getGasPrice()
        const apiResponse = await axios.get(`${ZAPPER_FI_ZAP_IN_ENDPOINT}/approval-transaction`, {
          params: {
            gasPrice,
            sellTokenAddress: selectedToken.value,
            ownerAddress,
            api_key: process.env.REACT_APP_ZAPPERFI_API_KEY,
          },
        })
        const apiData = get(apiResponse, 'data')
        await mainWeb3.eth.sendTransaction(apiData)
        toast.success(`${selectedToken.symbol} approval completed`)
        setPendingAction(null)
      } catch (err) {
        console.error(err)
        toast.error('Error checking your allowance. Please make sure your connection is stable')
        setPendingAction(null)
      }
    },
    [],
  )

  const handleZapIn = useCallback(
    async (
      selectedToken,
      selectedVault,
      slippagePercentage,
      sellAmount,
      ownerAddress,
      setPendingAction,
      onSuccess = Promise.resolve(),
      action = ACTIONS.DEPOSIT,
    ) => {
      try {
        setPendingAction(action)
        const gasPrice = await mainWeb3.eth.getGasPrice()
        const apiResponse = await axios.get(`${ZAPPER_FI_ZAP_IN_ENDPOINT}/transaction`, {
          params: {
            slippagePercentage,
            gasPrice,
            poolAddress: selectedVault.value,
            sellTokenAddress: selectedToken.value,
            sellAmount,
            ownerAddress,
            api_key: process.env.REACT_APP_ZAPPERFI_API_KEY,
          },
        })
        const apiData = get(apiResponse, 'data')
        await mainWeb3.eth.sendTransaction(apiData)
        toast.success(`${selectedToken.symbol} deposit completed`)
        await onSuccess()
      } catch (err) {
        console.error(err)
        toast.error(
          'Error creating your deposit transaction. Please make sure your connection is stable',
        )
        setPendingAction(null)
      }
    },
    [],
  )

  return (
    <ActionsContext.Provider
      value={{
        handleApproval,
        handleDeposit,
        handleStake,
        handleBoostStake,
        handleBoostUnstake,
        handleBoostReedem,
        handleClaim,
        handleExit,
        handleWithdraw,
        handleMigrate,
        zapperFi: {
          handleZapAllowanceCheck,
          handleZapAllowanceUpgrade,
          handleZapIn,
        },
      }}
    >
      {children}
    </ActionsContext.Provider>
  )
}

export { ActionsProvider, useActions }

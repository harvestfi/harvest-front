import React, { useCallback, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { get, isEmpty, toArray } from 'lodash'
import useEffectWithPrevious from 'use-effect-with-previous'
import Button from '../../components/Button'
import { Divider } from '../../components/GlobalStyle'
import { useWallet } from '../../providers/Wallet'
import { Container, Title, FormContainer, FormGroup, ZapperLogoLink, Paragrah } from './style'
import { fromWei, toWei } from '../../services/web3'
import NumberInput from '../../components/NumberInput'
import Select from '../../components/Select'
import { pools, tokens as importedTokens } from '../../data'
import { formatNumber } from '../../utils'
import { useVaults } from '../../providers/Vault'
import AnimatedDots from '../../components/AnimatedDots'
import { useActions } from '../../providers/Actions'
import { ACTIONS } from '../../constants'
import { CHAINS_ID } from '../../data/constants'
import poweredByZapperLogo from '../../assets/images/logos/powered_by_zap_gray.svg'

const DEPOSIT_SLIPPAGE = 0.01

const getButtonText = action => {
  switch (action) {
    case ACTIONS.DEPOSIT:
      return 'Depositing...'
    case ACTIONS.APPROVE_DEPOSIT:
      return 'Approving...'
    default:
      return 'Deposit'
  }
}

const Zapper = () => {
  const { account, chain, balances, getWalletBalances } = useWallet()
  const { zapperFi } = useActions()
  const { vaultsData, loadingVaults } = useVaults()
  const [supportedVaults, setSupportedVaults] = useState(null)
  const [supportedTokens, setSupportedTokens] = useState(null)
  const [selectedVault, selectVault] = useState(null)
  const [selectedToken, selectToken] = useState(null)
  const [amountToExecute, setAmountToExecute] = useState('')
  const [loadingBalances, setLoadingBalances] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)

  const selectedTokenBalance = get(balances, get(selectedToken, 'symbol'), 0)
  const selectedTokenBalanceInEther = fromWei(
    selectedTokenBalance,
    get(selectedToken, 'decimals', 18),
  )

  useEffect(() => {
    const getSupportedVaults = () => {
      const vaults = pools
        .filter(pool => !isEmpty(pool.zapperFiTokens))
        .map(pool => {
          const vaultData = toArray(importedTokens).find(
            token =>
              token.vaultAddress &&
              token.vaultAddress.toLowerCase() === pool.collateralAddress.toLowerCase(),
          )

          return {
            value: get(vaultData, 'vaultAddress', pool.contractAddress),
            availableTokens: pool.zapperFiTokens,
            label: `${get(vaultData, 'displayName', pool.displayName)} Vault`,
          }
        })
      setSupportedVaults(vaults)
    }
    getSupportedVaults()
  }, [])

  useEffect(() => {
    const getSupportedTokens = () => {
      const selectedTokens = {}
      supportedVaults.forEach(vault => {
        const tokens = Object.keys(vaultsData)
          .filter(tokenSymbol => vault.availableTokens.includes(tokenSymbol))
          .map(tokenSymbol => {
            return {
              value: vaultsData[tokenSymbol].tokenAddress,
              symbol: tokenSymbol,
              decimals: vaultsData[tokenSymbol].decimals,
              usdPrice: vaultsData[tokenSymbol].usdPrice,
              label: `${vaultsData[tokenSymbol].displayName} Token`,
            }
          })

        selectedTokens[vault.value] = tokens
      })
      setSupportedTokens(selectedTokens)
    }

    if (supportedVaults && !supportedTokens && !loadingVaults) {
      getSupportedTokens()
    }
  }, [supportedVaults, supportedTokens, loadingVaults, vaultsData])

  useEffectWithPrevious(
    ([prevSelectedVault, prevAccount]) => {
      const getUserBalances = async balancesToLoad => {
        setLoadingBalances(true)
        await getWalletBalances(balancesToLoad, account, true)
        setLoadingBalances(false)
      }

      if (
        get(selectedVault, 'value', '').toLowerCase() !==
          get(prevSelectedVault, 'value', '').toLowerCase() &&
        selectedVault
      ) {
        getUserBalances(selectedVault.availableTokens)
      }

      if (account && prevAccount && account !== prevAccount) {
        setAmountToExecute('')
        setPendingAction(null)
        selectVault(null)
        selectToken(null)
      }
    },
    [selectedVault, account, getWalletBalances],
  )

  const handleDeposit = useCallback(async () => {
    setPendingAction(ACTIONS.DEPOSIT)

    const isApproved = await zapperFi.handleZapAllowanceCheck(selectedToken, account)

    if (isApproved === false) {
      await zapperFi.handleZapAllowanceUpgrade(selectedToken, account, setPendingAction)
    }

    await zapperFi.handleZapIn(
      selectedToken,
      selectedVault,
      DEPOSIT_SLIPPAGE,
      toWei(amountToExecute, selectedToken.decimals),
      account,
      setPendingAction,
      async () => {
        setAmountToExecute('')
        await getWalletBalances([selectedToken.symbol], account, true)
        setPendingAction(null)
      },
    )
  }, [selectedToken, selectedVault, zapperFi, amountToExecute, account, getWalletBalances])

  return (
    <Container>
      <Title>Deposit anything into Harvest using Zapper.fi</Title>
      <Paragrah>
        Zapper.fi performs swapping of assets to streamline depositing into Harvest. <br /> For
        example, if you have <b>DAI</b> but would like to deposit into <b>USDC</b> vault, Zapper.fi
        can help you swap&nbsp;
        <b>DAI</b>&nbsp;&nbsp;➡️ <b>USDC</b> and deposit into Harvest in one go.
      </Paragrah>
      <Divider height="25px" />
      <FormContainer>
        {account && chain !== CHAINS_ID.ETH_MAINNET ? (
          <p>
            Connect your wallet to <b>Ethereum Mainnet</b> to use this feature.
          </p>
        ) : (
          <>
            <FormGroup>
              Deposit into{' '}
              <Select
                options={supportedVaults}
                value={selectedVault}
                onChange={vault => {
                  selectVault(vault)
                  selectToken(null)
                }}
                placeholder="Select vault"
                isDisabled={!account || pendingAction !== null}
                isSearchable={false}
              />{' '}
              using my{' '}
              <Select
                options={!selectedVault ? [] : supportedTokens[selectedVault.value]}
                value={selectedToken}
                onChange={token => {
                  if (amountToExecute) {
                    setAmountToExecute('')
                  }

                  selectToken(token)
                }}
                placeholder={loadingBalances ? <AnimatedDots /> : 'Select token'}
                isDisabled={!account || !selectedVault || loadingBalances || pendingAction !== null}
                isSearchable={false}
              />
            </FormGroup>
            <NumberInput
              data-tip=""
              data-for={`input-${selectedToken}`}
              label={
                !account
                  ? 'Please connect your wallet'
                  : `Balance <b>${(selectedToken && selectedToken.symbol) || 'N/A'}</b>`
              }
              secondaryLabel={`${selectedTokenBalanceInEther || '-'} ${
                selectedToken && selectedToken.usdPrice
                  ? `($${formatNumber(
                      new BigNumber(selectedTokenBalanceInEther).multipliedBy(
                        selectedToken.usdPrice,
                      ),
                      9,
                    )})`
                  : ''
              }`}
              width="100%"
              placeholder="0"
              onChange={e => setAmountToExecute(e.target.value)}
              value={amountToExecute}
              onClick={() => setAmountToExecute(selectedTokenBalanceInEther)}
              disabled={
                !account ||
                !selectedVault ||
                !selectedToken ||
                pendingAction !== null ||
                new BigNumber(selectedTokenBalance).eq(0)
              }
            />
            <Divider height="15px" />
            <Button
              onClick={handleDeposit}
              disabled={
                !amountToExecute ||
                pendingAction !== null ||
                new BigNumber(amountToExecute).isGreaterThan(selectedTokenBalanceInEther)
              }
              width="197px"
              margin="auto"
            >
              {getButtonText(pendingAction)}
            </Button>
          </>
        )}
        <Divider height="25px" />
        <ZapperLogoLink href="https://zapper.fi" target="_blank" rel="noopener noreferrer">
          <img src={poweredByZapperLogo} alt="zapperFi" />
        </ZapperLogoLink>
      </FormContainer>
    </Container>
  )
}

export default Zapper

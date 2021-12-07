import React, { useEffect, useRef, useState } from 'react'
import Collapsible from 'react-collapsible'
import { get } from 'lodash'
import BigNumber from 'bignumber.js'
// eslint-disable-next-line import/no-unresolved
import { useInterval } from 'react-interval-hook'
import useEffectWithPrevious from 'use-effect-with-previous'
import {
  BoostContainer,
  BoostPanelContainer,
  BoostPanelBody,
  FormGroup,
  InputControl,
  Alert,
  TokenLogo,
  HeroContainer,
} from './style'
import { Divider } from '../GlobalStyle'
import BoostPanelHeader from '../BoostPanelHeader'
import { BOOST_PANEL_MODES, POLL_BOOST_USER_DATA_INTERVAL_MS } from '../../constants'
import NumberInput from '../NumberInput'
import Button from '../Button'
import { fromWei, getWeb3, newContractInstance, toWei } from '../../services/web3'
import TextToggle from '../TextToggle'
import BoostPanelActions from '../BoostPanelActions'
import BoostStats from '../BoostStats'
import { useWallet } from '../../providers/Wallet'
import tokenContractData from '../../services/web3/contracts/token/contract.json'
import tokenMethods from '../../services/web3/contracts/token/methods'
import boostStakingContractData from '../../services/web3/contracts/boost-staking/contract.json'
import boostStakingMethods from '../../services/web3/contracts/boost-staking/methods'
import amplifierContractData from '../../services/web3/contracts/amplifier/contract.json'
import amplifierViewerContractData from '../../services/web3/contracts/amplifier-viewer/contract.json'
import amplifierViewerMethods from '../../services/web3/contracts/amplifier-viewer/methods'
import {
  hasRequirementsForInteraction,
  hasValidAmountForInputAndMaxButton,
  truncateNumberString,
} from '../../utils'
import { CHAINS_ID } from '../../data/constants'
import AnimatedDots from '../AnimatedDots'

const WarningAlert = ({ token, mode, userBalances, amountToExecute }) => {
  switch (true) {
    case mode === BOOST_PANEL_MODES.UNSTAKE:
      return (
        <Alert>
          You will be earning boost slower after you unstake. <br /> You will reach your normal
          boost earning speed <b>30 days</b> after last unstaking.
        </Alert>
      )
    case Number(amountToExecute) > 0 &&
      get(userBalances, 'currentAmplifierBoostedAmount', 0) &&
      mode === BOOST_PANEL_MODES.REDEEM:
      return (
        <Alert>
          You are redeeming <b>{amountToExecute}</b> {token.amplifierTokenDisplayName} that will be
          boosted to{' '}
          <b>
            {fromWei(
              get(userBalances, 'currentAmplifierBoostedAmount', 0),
              token.decimals,
              null,
              false,
              10,
            )}
          </b>{' '}
          {token.displayName} based on your earned boost.
        </Alert>
      )
    default:
      return null
  }
}

const BoostPanel = ({ token, setPendingAction, pendingAction, boostView }) => {
  const { connected, chain, account } = useWallet()
  const [open, setOpen] = useState(true)
  const [amountToExecute, setAmountToExecute] = useState('')
  const [mode, setMode] = useState(boostView ? BOOST_PANEL_MODES.REDEEM : BOOST_PANEL_MODES.STAKE)
  const [userBalances, setUserBalances] = useState(null)
  const [amplifierStats, setAmplifierStats] = useState(null)
  const [contracts, setContracts] = useState(null)
  const [reload, reloadBalances] = useState(true)

  const loadedUserWeb3Provider = useRef(false)

  useEffectWithPrevious(
    ([prevAccount]) => {
      const setBoostContracts = async () => {
        const tokenInstance = await newContractInstance(
          null,
          token.tokenAddress,
          tokenContractData.abi,
          getWeb3(token.chain, account),
        )
        const boostStakingInstance = await newContractInstance(
          null,
          token.proxyAddress,
          boostStakingContractData.abi,
          getWeb3(token.chain, account),
        )
        const amplifierInstance = await newContractInstance(
          null,
          token.amplifierTokenAddress,
          amplifierContractData.abi,
          getWeb3(token.chain, account),
        )
        const amplifierViewerInstance = await newContractInstance(
          null,
          token.amplifierViewerAddress,
          amplifierViewerContractData.abi,
          getWeb3(token.chain, account),
        )

        if (account) {
          loadedUserWeb3Provider.current = true
        }

        setContracts({
          tokenInstance,
          amplifierInstance,
          boostStakingInstance,
          amplifierViewerInstance,
        })
      }

      const getAmplifierStats = async () => {
        const amplifierAmount = new BigNumber(
          await tokenMethods.getBalance(token.amplifierContractAddress, contracts.tokenInstance),
        )

        const totalStakedbFarm = new BigNumber(
          await tokenMethods.getBalance(token.proxyAddress, contracts.tokenInstance),
        )
          .dividedBy(new BigNumber(10).pow(token.decimals))
          .toFixed(2)

        const totalSupply = await tokenMethods.getTotalSupply(contracts.amplifierInstance)
        const estimatedBonusAmount = truncateNumberString(
          amplifierAmount.dividedBy(totalSupply).toString(),
        )
        const boost = new BigNumber(1).plus(estimatedBonusAmount).toString()

        setAmplifierStats(prevStats => ({
          ...prevStats,
          totalSupply,
          totalStakedbFarm,
          estimatedBonusAmount,
          boost,
        }))
      }

      if (!contracts || (account !== prevAccount && !loadedUserWeb3Provider.current)) {
        setBoostContracts()
      }

      if (contracts) {
        getAmplifierStats()
      }
    },
    [
      account,
      token.chain,
      contracts,
      token.tokenAddress,
      token.proxyAddress,
      token.amplifierTokenAddress,
      token.amplifierViewerAddress,
    ],
  )

  useEffect(() => {
    const getUserBalances = async () => {
      const unstakedAmount = new BigNumber(
        await tokenMethods.getBalance(account, contracts.tokenInstance),
      )
      const stakedAmount = new BigNumber(
        await boostStakingMethods.getStakedAmount(account, contracts.boostStakingInstance),
      )
      const tokenAmount = new BigNumber(
        await tokenMethods.getBalance(account, contracts.amplifierInstance),
      )
      const boostStakingAmount = new BigNumber(
        await boostStakingMethods.getBoostAmount(account, contracts.boostStakingInstance),
      )

      const maximumAmplifierBoostedAmount = await amplifierViewerMethods.calculateBoostedAmount(
        token.amplifierTokenAddress,
        tokenAmount.toString(),
        account,
        contracts.amplifierViewerInstance,
      )

      const boostStakingWithBonus = BigNumber.min(
        tokenAmount,
        boostStakingAmount.div(amplifierStats.estimatedBonusAmount),
      ).decimalPlaces(0)

      const estimatedRedeemAmount = tokenAmount.plus(
        BigNumber.min(
          boostStakingAmount.plus(stakedAmount),
          tokenAmount.multipliedBy(amplifierStats.estimatedBonusAmount),
        ),
      )

      const additionalEstimatedRedeemAmount = tokenAmount
        .multipliedBy(amplifierStats.estimatedBonusAmount)
        .plus(tokenAmount)
      const additionalEstimatedStakedAmount = tokenAmount
        .multipliedBy(amplifierStats.estimatedBonusAmount)
        .minus(boostStakingAmount)
        .minus(stakedAmount)

      let amplifierAmounts = {}

      amplifierAmounts = {
        tokenAmount,
        boostStakingWithBonus,
        maximumAmplifierBoostedAmount: {
          ...maximumAmplifierBoostedAmount,
          total: new BigNumber(maximumAmplifierBoostedAmount[0]).plus(
            maximumAmplifierBoostedAmount[2],
          ),
        },
      }
      setUserBalances(prevBalances => ({
        ...prevBalances,
        unstakedAmount,
        stakedAmount,
        amplifierAmounts,
        estimatedRedeemAmount,
        additionalEstimatedRedeemAmount,
        additionalEstimatedStakedAmount,
        boostStakingAmount,
      }))
    }

    if (connected && chain !== CHAINS_ID.ETH_MAINNET && loadedUserWeb3Provider.current) {
      if (open && reload && contracts) {
        reloadBalances(false)

        if (userBalances === null) {
          setUserBalances(false)
        }

        getUserBalances()
      }
    }
  }, [
    connected,
    chain,
    account,
    token,
    reload,
    open,
    contracts,
    userBalances,
    boostView,
    amplifierStats,
  ])

  useEffect(() => {
    if (
      connected &&
      chain === CHAINS_ID.BSC_MAINNET &&
      mode === BOOST_PANEL_MODES.REDEEM &&
      contracts &&
      new BigNumber(amountToExecute).isGreaterThan(0)
    ) {
      const getCurrentAmplifierBoostedAmount = async () => {
        const currentAmplifierBoostedAmount = await amplifierViewerMethods.calculateBoostedAmount(
          token.amplifierTokenAddress,
          toWei(amountToExecute, token.decimals, 0),
          account,
          contracts.amplifierViewerInstance,
        )

        setUserBalances(prevBalances => ({
          ...prevBalances,
          currentAmplifierBoostedAmount: new BigNumber(currentAmplifierBoostedAmount[0]).plus(
            currentAmplifierBoostedAmount[1],
          ),
        }))
      }

      getCurrentAmplifierBoostedAmount()
    }
  }, [connected, chain, account, token, setUserBalances, mode, amountToExecute, contracts])

  useInterval(
    () => {
      reloadBalances(true)
    },
    POLL_BOOST_USER_DATA_INTERVAL_MS,
    {
      autoStart: true,
    },
  )

  const isLoadingRequirements = !contracts || !amplifierStats

  return (
    <BoostContainer>
      <Divider height="20px" />
      {!boostView && (
        <HeroContainer>
          <h2>
            <TokenLogo src={token.amplifierTokenLogoUrl} alt={token.amplifierTokenDisplayName} />1{' '}
            {token.amplifierTokenDisplayName} = 1 {token.displayName} +{' '}
            {isLoadingRequirements ? '...' : get(amplifierStats, 'estimatedBonusAmount', '0.00')}{' '}
            possible bonus {token.displayName}
          </h2>
          <p>
            On <b>Binance Smart Chain</b>, get{' '}
            <b>
              {isLoadingRequirements ? '...' : get(amplifierStats, 'estimatedBonusAmount', '0.00')}{' '}
              {token.displayName}
            </b>{' '}
            boost on <b>1 {token.amplifierTokenDisplayName}</b>, by staking
            <b>
              {' '}
              {isLoadingRequirements
                ? '...'
                : get(amplifierStats, 'estimatedBonusAmount', '0.00')}{' '}
              {token.displayName}
            </b>{' '}
            for 2 years.
            <br />
            Or stake more to earn faster. There is no lock up. You can unstake whenever.
          </p>
          <p>
            Total Staked <b>{token.displayName}:</b>{' '}
            <b>{get(amplifierStats, 'totalStakedbFarm', <AnimatedDots />)}</b>
          </p>
        </HeroContainer>
      )}
      <BoostPanelContainer open={open}>
        <Collapsible
          open={open}
          transitionTime={200}
          triggerDisabled={pendingAction !== null}
          onOpening={() => setOpen(true)}
          onClosing={() => setOpen(false)}
          trigger={<BoostPanelHeader token={token} boostView={boostView} />}
          triggerWhenOpen={<BoostPanelHeader token={token} boostView={boostView} open />}
          overflowWhenOpen="visible"
          lazyRender
        >
          <BoostPanelBody>
            <WarningAlert
              mode={mode}
              userBalances={userBalances}
              token={token}
              amountToExecute={amountToExecute}
            />
            <FormGroup padding="10px 0" borderBottom="1px solid grey">
              <InputControl boostView={boostView}>
                <NumberInput
                  hideButton
                  data-tip=""
                  data-for={`input-${token.symbol}`}
                  width="100%"
                  onChange={e => setAmountToExecute(e.target.value)}
                  value={amountToExecute}
                  placeholder="0"
                  disabled={
                    !hasRequirementsForInteraction(
                      true,
                      pendingAction,
                      userBalances,
                      userBalances === false,
                    ) ||
                    !hasValidAmountForInputAndMaxButton(
                      userBalances.unstakedAmount,
                      0,
                      mode === BOOST_PANEL_MODES.REDEEM
                        ? get(userBalances, 'amplifierAmounts.tokenAmount')
                        : userBalances.stakedAmount,
                      token.symbol,
                      mode === BOOST_PANEL_MODES.UNSTAKE || mode === BOOST_PANEL_MODES.REDEEM,
                    )
                  }
                />
                <Button
                  width="100%"
                  maxHeight="34px"
                  onClick={() => {
                    let amount
                    if (mode === BOOST_PANEL_MODES.STAKE) {
                      amount = fromWei(userBalances.unstakedAmount, token.decimals)
                    } else if (mode === BOOST_PANEL_MODES.UNSTAKE) {
                      amount = fromWei(userBalances.stakedAmount, token.decimals)
                    } else {
                      amount = fromWei(
                        get(userBalances, 'amplifierAmounts.tokenAmount'),
                        token.decimals,
                      )
                    }

                    setAmountToExecute(amount)
                  }}
                  margin="0 10px 0 0"
                  disabled={
                    !hasRequirementsForInteraction(
                      true,
                      pendingAction,
                      userBalances,
                      userBalances === false,
                    ) ||
                    !hasValidAmountForInputAndMaxButton(
                      userBalances.unstakedAmount,
                      0,
                      mode === BOOST_PANEL_MODES.REDEEM
                        ? get(userBalances, 'amplifierAmounts.tokenAmount')
                        : userBalances.stakedAmount,
                      token.symbol,
                      mode === BOOST_PANEL_MODES.UNSTAKE || mode === BOOST_PANEL_MODES.REDEEM,
                    )
                  }
                >
                  MAX
                </Button>
                {boostView && (
                  <Button
                    width="100%"
                    maxHeight="34px"
                    onClick={() =>
                      setAmountToExecute(
                        fromWei(
                          get(userBalances, 'amplifierAmounts.boostStakingWithBonus'),
                          token.decimals,
                        ),
                      )
                    }
                    margin="0 10px 0 0"
                    disabled={
                      !hasRequirementsForInteraction(
                        true,
                        pendingAction,
                        userBalances,
                        userBalances === false,
                      ) ||
                      !hasValidAmountForInputAndMaxButton(
                        get(userBalances, 'amplifierAmounts.boostStakingWithBonus').toString(),
                        null,
                        null,
                        token.symbol,
                      )
                    }
                  >
                    Boost MAX
                  </Button>
                )}
              </InputControl>
              <BoostPanelActions
                token={token}
                amountToExecute={amountToExecute}
                mode={mode}
                pendingAction={pendingAction}
                userBalances={userBalances}
                setPendingAction={setPendingAction}
                contracts={contracts}
                reloadBalances={reloadBalances}
                setAmountToExecute={setAmountToExecute}
              />
            </FormGroup>
            <BoostStats
              token={token}
              userBalances={userBalances}
              boostView={boostView}
              amplifierStats={amplifierStats}
            />
            {!boostView && (
              <FormGroup justifyContent="flex-end" alignItemsMobile="center">
                <TextToggle
                  checked={mode === BOOST_PANEL_MODES.UNSTAKE}
                  options={{
                    checked: {
                      label: 'Stake',
                    },
                    unchecked: {
                      label: 'Unstake',
                    },
                  }}
                  setChecked={checked => {
                    setMode(checked ? BOOST_PANEL_MODES.UNSTAKE : BOOST_PANEL_MODES.STAKE)
                    setAmountToExecute('')
                  }}
                />
              </FormGroup>
            )}
          </BoostPanelBody>
        </Collapsible>
      </BoostPanelContainer>
      {!boostView && (
        <p>
          {get(userBalances, 'amplifierAmounts.tokenAmount', new BigNumber(0)).isGreaterThan(0) ? (
            <>
              You have{' '}
              <b>
                {fromWei(
                  get(userBalances, 'amplifierAmounts.tokenAmount', 0),
                  token.decimals,
                  3,
                  true,
                )}
                &nbsp;
              </b>
            </>
          ) : (
            <>
              If you have <b>10</b>&nbsp;
            </>
          )}
          <b>{token.amplifierTokenDisplayName}</b>, you can redeem it for up to{' '}
          <b>
            {get(userBalances, 'amplifierAmounts.tokenAmount', new BigNumber(0)).isGreaterThan(
              0,
            ) ? (
              fromWei(get(userBalances, 'amplifierAmounts.tokenAmount', 0), token.decimals, 3, true)
            ) : (
              <>
                up to&nbsp;
                {get(amplifierStats, 'estimatedBonusAmount', 0)
                  ? new BigNumber(10)
                      .multipliedBy(get(amplifierStats, 'estimatedBonusAmount', 0))
                      .plus(10)
                      .toString()
                  : '...'}
              </>
            )}{' '}
            {token.displayName}
          </b>{' '}
          depending on your staking duration.
          {account && userBalances && userBalances.amplifierAmounts && (
            <>
              {get(userBalances, 'stakedAmount', new BigNumber(0)).isGreaterThan(0) && (
                <>
                  <br /> If you keep your current stake of{' '}
                  <b>
                    {fromWei(get(userBalances, 'stakedAmount', 0), token.decimals, 3, true)}{' '}
                    {token.displayName}
                  </b>{' '}
                  for 2 years, you will be able to redeem it for{' '}
                  <b>
                    {fromWei(userBalances.estimatedRedeemAmount, token.decimals, 3, true)}{' '}
                    {token.displayName}
                  </b>
                  .
                </>
              )}
              <br />
              {userBalances.stakedAmount.isGreaterThan(
                userBalances.boostStakingAmount.plus(
                  userBalances.amplifierAmounts.tokenAmount.multipliedBy(
                    amplifierStats.estimatedBonusAmount,
                  ),
                ),
              ) ? (
                <>You can stake more to earn the boost faster.</>
              ) : (
                <>
                  {' '}
                  If you stake additional{' '}
                  <b>
                    {userBalances.additionalEstimatedStakedAmount.isNegative(0)
                      ? '0'
                      : fromWei(
                          userBalances.additionalEstimatedStakedAmount,
                          token.decimals,
                          3,
                          true,
                        )}{' '}
                    {token.displayName}
                  </b>{' '}
                  for 2 years, you will be able to redeem it for{' '}
                  <b>
                    {fromWei(userBalances.additionalEstimatedRedeemAmount, token.decimals, 3, true)}{' '}
                    {token.displayName}
                  </b>
                  .
                </>
              )}
            </>
          )}
        </p>
      )}
    </BoostContainer>
  )
}

export default BoostPanel

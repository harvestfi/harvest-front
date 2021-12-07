import React from 'react'
import { ACTIONS, BOOST_PANEL_MODES, DISABLED_DEPOSITS, DISABLED_WITHDRAWS } from '../../constants'
import Button from '../Button'
import { Container, ButtonContainer } from './style'
import {
  hasAmountGreaterThanZero,
  hasAmountLessThanOrEqualTo,
  hasRequirementsForInteraction,
} from '../../utils'
import { toWei } from '../../services/web3'
import { useActions } from '../../providers/Actions'
import { useWallet } from '../../providers/Wallet'

const getSelectedBalance = (mode, userBalances) => {
  switch (mode) {
    case BOOST_PANEL_MODES.STAKE:
      return userBalances.unstakedAmount
    case BOOST_PANEL_MODES.UNSTAKE:
      return userBalances.stakedAmount
    case BOOST_PANEL_MODES.REDEEM:
      return userBalances.amplifierAmounts.tokenAmount
    default:
      return '0'
  }
}

const BoostPanelActions = ({
  token,
  amountToExecute,
  mode,
  pendingAction,
  setPendingAction,
  userBalances,
  contracts,
  reloadBalances,
  setAmountToExecute,
}) => {
  const { handleBoostStake, handleBoostUnstake, handleBoostReedem } = useActions()
  const { account } = useWallet()

  const amountToExecuteInWei = toWei(amountToExecute, token.decimals, 0)

  const hasEnoughAmountToExecute =
    hasAmountGreaterThanZero(amountToExecuteInWei) &&
    hasAmountLessThanOrEqualTo(amountToExecuteInWei, getSelectedBalance(mode, userBalances))

  return (
    <Container width={mode === BOOST_PANEL_MODES.STAKE ? '100%' : 'unset'}>
      {mode === BOOST_PANEL_MODES.STAKE ? (
        <>
          <Button
            width="100%"
            maxHeight="34px"
            onClick={async () => {
              await handleBoostStake(
                token,
                account,
                amountToExecuteInWei,
                setPendingAction,
                contracts,
                () => {
                  reloadBalances(true)
                  setAmountToExecute('')
                },
              )
            }}
            disabled={
              !hasRequirementsForInteraction(
                true,
                pendingAction,
                userBalances,
                userBalances === false,
              ) ||
              token.inactive ||
              DISABLED_DEPOSITS.includes(token.symbol) ||
              !hasEnoughAmountToExecute
            }
          >
            {pendingAction === ACTIONS.STAKE
              ? 'Staking...'
              : pendingAction === ACTIONS.APPROVE_STAKE
              ? 'APPROVING...'
              : 'Stake'}
          </Button>
        </>
      ) : mode === BOOST_PANEL_MODES.UNSTAKE ? (
        <>
          <Button
            width="100%"
            onClick={async () => {
              await handleBoostUnstake(
                token,
                account,
                amountToExecuteInWei,
                setPendingAction,
                contracts,
                () => {
                  reloadBalances(true)
                  setAmountToExecute('')
                },
              )
            }}
            disabled={
              !hasRequirementsForInteraction(
                true,
                pendingAction,
                userBalances,
                userBalances === false,
              ) ||
              token.inactive ||
              DISABLED_WITHDRAWS.includes(token.symbol) ||
              !hasEnoughAmountToExecute
            }
          >
            {pendingAction === ACTIONS.EXIT || pendingAction === ACTIONS.WITHDRAW
              ? 'PROCESSING...'
              : 'Unstake'}
          </Button>
        </>
      ) : (
        <ButtonContainer maxWidth="50%">
          <Button
            width="auto"
            onClick={async () => {
              await handleBoostReedem(
                token,
                account,
                amountToExecuteInWei,
                setPendingAction,
                contracts,
                () => {
                  reloadBalances(true)
                  setAmountToExecute('')
                },
              )
            }}
            disabled={
              !hasRequirementsForInteraction(
                true,
                pendingAction,
                userBalances,
                userBalances === false,
              ) ||
              token.inactive ||
              !hasEnoughAmountToExecute
            }
          >
            {pendingAction === ACTIONS.REDEEM ? 'PROCESSING...' : 'Redeem'}
          </Button>
        </ButtonContainer>
      )}
    </Container>
  )
}

export default BoostPanelActions

import React from 'react'
import { get } from 'lodash'
import ReactTooltip from 'react-tooltip'
import BigNumber from 'bignumber.js'
import {
  SelectedBoostContainer,
  SelectedBoost,
  SelectedBoostLabel,
  SelectedBoostNumber,
} from './style'
import { formatNumber } from '../../utils'
import { Monospace } from '../GlobalStyle'
import { useWallet } from '../../providers/Wallet'
import { fromWei } from '../../services/web3'
import AnimatedDots from '../AnimatedDots'

const BoostStats = ({ token, userBalances, boostView, amplifierStats }) => {
  const { connected } = useWallet()

  const estimatedBoost = fromWei(
    get(userBalances, 'amplifierAmounts.maximumAmplifierBoostedAmount[2]', 0),
    token.decimals,
    8,
    true,
  )

  const hasAmplifierAmount = get(
    userBalances,
    'amplifierAmounts.tokenAmount',
    new BigNumber(0),
  ).isGreaterThan(0)

  return (
    <SelectedBoostContainer>
      <ReactTooltip
        id={`amplifier-${token.amplifierTokenDisplayName}`}
        backgroundColor="#fffce6"
        borderColor="black"
        border
        textColor="black"
        disable={!connected || !hasAmplifierAmount}
      >
        <>
          You could redeem{' '}
          <b>
            {fromWei(get(userBalances, 'amplifierAmounts.tokenAmount', 0), token.decimals, 8, true)}
          </b>{' '}
          {token.amplifierTokenDisplayName} for{' '}
          <b>
            {fromWei(
              get(userBalances, 'amplifierAmounts.maximumAmplifierBoostedAmount.total', 0),
              token.decimals,
              8,
              true,
            )}
          </b>{' '}
          {token.displayName} if you had <b>{estimatedBoost}</b>
          &nbsp;boost. <br /> You can earn more boost by staking {token.displayName}.
        </>
      </ReactTooltip>
      {!boostView ? (
        <>
          <SelectedBoost>
            <SelectedBoostLabel>
              Your Unstaked <b>{token.displayName}</b>
            </SelectedBoostLabel>
            <SelectedBoostNumber>
              <Monospace>
                {!connected ? (
                  formatNumber(0, 8)
                ) : userBalances === false ? (
                  <AnimatedDots />
                ) : (
                  formatNumber(fromWei(get(userBalances, 'unstakedAmount', 0), 18, 8, true), 8)
                )}
              </Monospace>
            </SelectedBoostNumber>
          </SelectedBoost>
          <SelectedBoost order={0}>
            <SelectedBoostLabel>
              Your Staked <b>{token.displayName}</b>
            </SelectedBoostLabel>
            <SelectedBoostNumber>
              <Monospace>
                {!connected ? (
                  formatNumber(0, 8)
                ) : userBalances === false ? (
                  <AnimatedDots />
                ) : (
                  formatNumber(fromWei(get(userBalances, 'stakedAmount', 0), 18, 8, true), 8)
                )}
              </Monospace>
            </SelectedBoostNumber>
          </SelectedBoost>
        </>
      ) : (
        <>
          <SelectedBoost
            data-tip=""
            data-for={`amplifier-${token.amplifierTokenDisplayName}`}
            order={0}
          >
            <SelectedBoostLabel>
              Your <b>{token.amplifierTokenDisplayName}</b> with{' '}
              <b>{amplifierStats ? amplifierStats.boost : <AnimatedDots />}x</b> boost
            </SelectedBoostLabel>
            <SelectedBoostNumber>
              <Monospace borderBottom={hasAmplifierAmount ? '1px dotted black' : 'unset'}>
                {!connected ? (
                  formatNumber(0, token.decimals)
                ) : userBalances === false || !get(userBalances, 'amplifierAmounts') ? (
                  <AnimatedDots />
                ) : (
                  formatNumber(
                    fromWei(
                      get(userBalances, 'amplifierAmounts.boostStakingWithBonus', 0),
                      token.decimals,
                      token.decimals,
                      true,
                    ),
                    token.decimals,
                  )
                )}
              </Monospace>
            </SelectedBoostNumber>
          </SelectedBoost>
          <SelectedBoost
            data-tip=""
            data-for={`amplifier-${token.amplifierTokenDisplayName}`}
            order={0}
          >
            <SelectedBoostLabel>
              Your <b>{token.amplifierTokenDisplayName}</b>
            </SelectedBoostLabel>
            <SelectedBoostNumber>
              <Monospace borderBottom={hasAmplifierAmount ? '1px dotted black' : 'unset'}>
                {!connected ? (
                  formatNumber(0, 8)
                ) : userBalances === false || !get(userBalances, 'amplifierAmounts') ? (
                  <AnimatedDots />
                ) : (
                  formatNumber(
                    fromWei(get(userBalances, 'amplifierAmounts.tokenAmount', 0), 18, 8, true),
                    8,
                  )
                )}
              </Monospace>
            </SelectedBoostNumber>
          </SelectedBoost>
        </>
      )}
    </SelectedBoostContainer>
  )
}

export default BoostStats

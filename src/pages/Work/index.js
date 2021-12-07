import React, { useEffect, useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import BigNumber from 'bignumber.js'
import Button from '../../components/Button'
import { Divider, SmallLogo } from '../../components/GlobalStyle'
import WorkCharacters from '../../components/WorkCharacters'
import { useWallet } from '../../providers/Wallet'
import {
  WorkContainer,
  WorkHeader,
  WorkSubHeader,
  WorkExplinatonBox,
  WorkExplinatonHeader,
  WorkRedeemStatsContainer,
  WorkConnectionBox,
} from './style'
import { fromWei, newContractInstance } from '../../services/web3'

import apTokenContractData from '../../services/web3/contracts/token/contract.json'
import apTokenContractMethods from '../../services/web3/contracts/token/methods'

import apRedemtionContractData from '../../services/web3/contracts/ap-redemption/contract.json'
import apRedemtionContractMethods from '../../services/web3/contracts/ap-redemption/methods'

import AnimatedDots from '../../components/AnimatedDots'

import { CHAINS_ID } from '../../data/constants'

const { addresses, tokens } = require('../../data')

const Work = () => {
  const { account, chain, connected } = useWallet()

  const [redemptionAmount, setRedemptionAmount] = useState(null)
  const [apBalance, setApBalance] = useState(null)
  const [pendingRedeem, setPendingRedeem] = useState(false)

  const redeemAP = useCallback(async () => {
    const { redeem } = apRedemtionContractMethods
    const apRedemptionContractInstance = await newContractInstance(
      null,
      apRedemtionContractData.address,
      apRedemtionContractData.abi,
    )

    try {
      setPendingRedeem(true)
      await redeem(apBalance, account, apRedemptionContractInstance)
      toast.success('Successfully redeemed your Action Points for FARM')
      setApBalance('0')
      setRedemptionAmount('0')
    } catch (err) {
      console.error(err)
      toast.error(
        'Error redeeming your Action Points, make sure you confirmed the transaction in your wallet',
      )
    } finally {
      setPendingRedeem(false)
    }
  }, [apBalance, account])

  useEffect(() => {
    const getAPData = async () => {
      const { getBalance } = apTokenContractMethods
      const apTokenContractInstance = await newContractInstance(
        null,
        addresses.HARVEST_AP,
        apTokenContractData.abi,
      )

      const { calcRedemption } = apRedemtionContractMethods
      const apRedemptionContractInstance = await newContractInstance(
        null,
        apRedemtionContractData.address,
        apRedemtionContractData.abi,
      )

      const balance = await getBalance(account, apTokenContractInstance)
      setApBalance(balance)

      const amount = await calcRedemption(balance, apRedemptionContractInstance)

      setRedemptionAmount(amount)
    }

    if (connected && chain === CHAINS_ID.ETH_MAINNET) {
      getAPData()
    }
  }, [account, chain, connected])

  return (
    <WorkContainer>
      <WorkHeader>
        Contribute to Harvest and Redeem Action Points for&nbsp;
        <SmallLogo src="./icons/farm.png" width="25px" height="25px" />
        &nbsp;<b>FARM</b>
      </WorkHeader>
      <WorkExplinatonBox>
        <WorkExplinatonHeader>Paid Contributor Jobs</WorkExplinatonHeader>
        <p align="left">
          <ul align="left">
            <li>
              Community-run front-end tools, such as the{' '}
              <a href="https://farmdashboard.xyz/" target="_blank" rel="noopener noreferrer">
                Stats Dashboard
              </a>{' '}
              and the{' '}
              <a href="https://harvest-dashboard.xyz/" target="_blank" rel="noopener noreferrer">
                Harvest Dashboard.
              </a>{' '}
            </li>
            <li> Work on the new BSC smart contracts and farms.</li>
            <li>
              {' '}
              Development of new farming strategies in the new{' '}
              <a
                href="https://github.com/harvest-finance/harvest-strategy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Harvest Strategy repository.
              </a>{' '}
            </li>
            <li>Work on bots for Telegram and Discord.</li>
            <li>
              Non-technical contributions, including Wiki write-ups, organizing the notion board,
              ecosystem development, etc.
            </li>
          </ul>
          The contributors are rewarded with <b>Harvest Action Points (AP)</b>. The Harvest Actions
          Point (AP) is an ERC-20 token that can be redeemed for <b>FARM</b> on this page. Payments
          are done weekly by a community-builder-only multisig.
        </p>
      </WorkExplinatonBox>
      <Divider height="25px" />
      <WorkExplinatonBox>
        <WorkExplinatonHeader>How to Contribute</WorkExplinatonHeader>
        <p align="left">
          The work is organized using the{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.notion.so/harvestfinance/Harvest-Work-Board-8aceaef04302408c87f8e17fed589ffc"
          >
            Notion Builder Board.
          </a>
          <ul align="left">
            <li>
              {' '}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.notion.so/harvestfinance/Backlog-List-dbe07e3afc454f6e84e65308231b011f"
              >
                Backlog.
              </a>{' '}
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.notion.so/harvestfinance/Kanban-Board-c5a1f2345d3c430ca73d9377564b2073"
              >
                Kanban board
              </a>{' '}
              updated regularly during planning.
            </li>
            <li>
              Pick up tasks during community-led sprint planning in the{' '}
              <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/gzWAG3Wx7Y">
                #dev channel.
              </a>
            </li>
          </ul>
          <br />
          Contributors are welcome to apply on the{' '}
          <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/gzWAG3Wx7Y">
            #dev channel
          </a>{' '}
          in Discord.
        </p>
      </WorkExplinatonBox>
      <Divider height="25px" />
      <WorkConnectionBox account={account}>
        {account && chain === CHAINS_ID.ETH_MAINNET ? (
          <>
            <WorkRedeemStatsContainer>
              You currently have{' '}
              <b>
                {apBalance ? fromWei(apBalance, tokens.HARVEST_AP.decimals) : <AnimatedDots />} AP
              </b>
              <br /> Which can be redeemed for{' '}
              <b>
                {redemptionAmount ? (
                  fromWei(redemptionAmount, tokens.FARM.decimals)
                ) : (
                  <AnimatedDots />
                )}{' '}
                FARM
              </b>
            </WorkRedeemStatsContainer>
            <Button
              onClick={redeemAP}
              disabled={
                !account ||
                !redemptionAmount ||
                new BigNumber(redemptionAmount).lte(0) ||
                pendingRedeem
              }
              width="197px"
            >
              {pendingRedeem ? 'Redeeming...' : 'Redeem AP'}
            </Button>
          </>
        ) : (
          'Connect a wallet to redeem your Action Points'
        )}
      </WorkConnectionBox>
      <Divider height="10px" />
      <WorkSubHeader>The D&D Player&apos;s Handbook at Harvest</WorkSubHeader>
      <WorkCharacters />
    </WorkContainer>
  )
}

export default Work

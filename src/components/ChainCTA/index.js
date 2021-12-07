import { isEmpty } from 'lodash'
import React from 'react'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { usePools } from '../../providers/Pools'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet/index'
import { getChainName, isMobileWeb3 } from '../../services/web3'
import Button from '../Button'
import { Container } from './style'
import { CHAINS_ID } from '../../data/constants'

const ChainDescription = ({ chainId }) => {
  const { pathname } = useLocation()

  switch (true) {
    case pathname === ROUTES.WORK && chainId === CHAINS_ID.ETH_MAINNET:
      return <div>You haven&apos;t connected a wallet.</div>
    case pathname === ROUTES.WORK && chainId !== CHAINS_ID.ETH_MAINNET:
      return <div>Switch wallet to Ethereum Mainnet in order to claim AP points</div>
    case pathname === ROUTES.BOOST && chainId !== CHAINS_ID.BSC_MAINNET:
      return <div>Switch wallet to Binance Smart Chain in order to use this boost staking</div>
    default:
      return (
        <div>
          You are viewing <b>{getChainName(chainId)}</b> farms.
        </div>
      )
  }
}

const ChainCTA = () => {
  const { connect, chain, account, balancesToLoad } = useWallet()
  const { loadingVaults, loadingFarmingBalances } = useVaults()
  const { loadingUserPoolStats } = usePools()
  const { pathname } = useLocation()

  if (account && pathname === ROUTES.WORK && chain === CHAINS_ID.ETH_MAINNET) {
    return null
  }

  const isLoading =
    loadingVaults || !isEmpty(balancesToLoad) || loadingFarmingBalances || loadingUserPoolStats

  return (
    <Container>
      <ChainDescription chainId={chain} account={account} />
      {isMobileWeb3 && account ? null : (
        <Button
          disabled={isLoading}
          type="button"
          width="160px"
          height="40px"
          onClick={() => connect(account)}
        >
          {account ? 'Switch' : 'Connect'} Wallet
        </Button>
      )}
    </Container>
  )
}

export default ChainCTA

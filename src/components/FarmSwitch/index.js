import React from 'react'
import { Container, Chain } from './style'
import { useWallet } from '../../providers/Wallet'
import { NewBadgeLabel } from '../GlobalStyle'
import ethLogo from '../../assets/images/logos/eth.svg'
import bscLogo from '../../assets/images/logos/bsc.svg'
import maticLogo from '../../assets/images/logos/matic.svg'
import { CHAINS_ID } from '../../data/constants'

const ChainImage = ({ id, label }) => {
  switch (id) {
    case CHAINS_ID.ETH_MAINNET:
      return <img src={ethLogo} alt={label} />
    case CHAINS_ID.BSC_MAINNET:
      return <img src={bscLogo} alt={label} />
    case CHAINS_ID.MATIC_MAINNET:
      return <img src={maticLogo} alt={label} />
    default:
      return null
  }
}

const FarmSwitch = ({ chains }) => {
  const { connected, setChain, chain: selectedChain } = useWallet()

  return !connected ? (
    <Container>
      {chains.map(chain => (
        <Chain
          key={chain.id}
          width="240px"
          onClick={() => setChain(chain.id)}
          selected={selectedChain === chain.id}
          new={chain.isNew}
        >
          <ChainImage id={chain.id} label={chain.label} />
          <span>{chain.label}</span> {chain.isNew ? <NewBadgeLabel /> : null}
        </Chain>
      ))}
    </Container>
  ) : null
}

export default FarmSwitch

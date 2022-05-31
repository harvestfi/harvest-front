import React from 'react'
import { Container, Chain, ExternalLink } from './style'
import { useWallet } from '../../providers/Wallet'
import { NewBadgeLabel } from '../GlobalStyle'
import ethLogo from '../../assets/images/logos/eth.svg'
import bscLogo from '../../assets/images/logos/bsc.svg'
import maticLogo from '../../assets/images/logos/matic.svg'
import arbitrumLogo from '../../assets/images/logos/arbitrum.svg'
import externalLink from '../../assets/images/ui/external-link.png'
import { CHAINS_ID } from '../../data/constants'

const ChainImage = ({ id, label }) => {
  switch (id) {
    case CHAINS_ID.ETH_MAINNET:
      return <img src={ethLogo} alt={label} />
    case CHAINS_ID.BSC_MAINNET:
      return <img src={bscLogo} alt={label} />
    case CHAINS_ID.MATIC_MAINNET:
      return <img src={maticLogo} alt={label} />
    case 'ARBITRUM_MAINNET':
      return <img src={arbitrumLogo} alt={label} />
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
          onClick={() => (chain.link ? window.open(chain.link) : setChain(chain.id))}
          selected={selectedChain === chain.id}
          new={chain.isNew}
        >
          <ChainImage id={chain.id} label={chain.label} />
          <span>{chain.label}</span>
          {chain.link ? (
            <ExternalLink>
              <img src={externalLink} width="16" alt="" />
            </ExternalLink>
          ) : null}
          {chain.isNew ? <NewBadgeLabel /> : null}
        </Chain>
      ))}
    </Container>
  ) : null
}

export default FarmSwitch

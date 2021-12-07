import React, { useState } from 'react'
import { ConnectionMessageContainer, Container } from './style'
import BoostPanel from '../../components/BoostPanel'
import { useWallet } from '../../providers/Wallet'
import { CHAINS_ID } from '../../data/constants'

const { tokens: importedTokens } = require('../../data')

const Boost = () => {
  const [pendingAction, setPendingAction] = useState(null)

  const { account, chain } = useWallet()

  const tokens = Object.keys(importedTokens)
    .filter(tokenSymbol => importedTokens[tokenSymbol].proxyAddress)
    .map(selectedSymbol => {
      importedTokens[selectedSymbol].symbol = selectedSymbol
      importedTokens[selectedSymbol].displayName =
        importedTokens[selectedSymbol].displayName || selectedSymbol
      return importedTokens[selectedSymbol]
    })

  return (
    <Container>
      {(account && chain === CHAINS_ID.BSC_MAINNET) || !account ? (
        tokens.map(token => (
          <div key={token.symbol}>
            <BoostPanel
              token={token}
              setPendingAction={setPendingAction}
              pendingAction={pendingAction}
            />
            <BoostPanel
              token={token}
              setPendingAction={setPendingAction}
              pendingAction={pendingAction}
              boostView
            />
          </div>
        ))
      ) : (
        <ConnectionMessageContainer>
          Please switch your wallet to the Binance Smart Chain network to use this page
        </ConnectionMessageContainer>
      )}
    </Container>
  )
}

export default Boost

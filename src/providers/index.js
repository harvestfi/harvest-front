import React from 'react'
import { WalletProvider } from './Wallet'
import { ContractsProvider } from './Contracts'
import { PoolsProvider } from './Pools'
import { VaultsProvider } from './Vault'
import { ActionsProvider } from './Actions'
import { StatsProvider } from './Stats'

const Providers = ({ children }) => (
  <ContractsProvider>
    <WalletProvider>
      <PoolsProvider>
        <VaultsProvider>
          <ActionsProvider>
            <StatsProvider>{children}</StatsProvider>
          </ActionsProvider>
        </VaultsProvider>
      </PoolsProvider>
    </WalletProvider>
  </ContractsProvider>
)

export default Providers

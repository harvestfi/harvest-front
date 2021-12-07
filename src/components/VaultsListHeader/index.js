import React from 'react'
import { HeaderContainer } from './style'
import FarmSwitch from '../FarmSwitch'
import QuickFilter from '../QuickFilter'
import { CHAINS_ID } from '../../data/constants'

const VaultListHeader = ({ ...props }) => (
  <HeaderContainer>
    <FarmSwitch
      chains={[
        {
          id: CHAINS_ID.ETH_MAINNET,
          label: 'Ethereum Mainnet',
        },
        {
          id: CHAINS_ID.BSC_MAINNET,
          label: 'Binance Smart Chain',
        },
        {
          id: CHAINS_ID.MATIC_MAINNET,
          label: 'Polygon (Matic)',
          isNew: true,
        },
      ]}
    />
    <QuickFilter {...props} />
  </HeaderContainer>
)

export default VaultListHeader

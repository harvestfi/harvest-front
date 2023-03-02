import React from 'react'
import { CHAINS_ID } from '../../data/constants'
import FarmSwitch from '../FarmSwitch'
import QuickFilter from '../QuickFilter'
import { HeaderContainer } from './style'

const VaultListHeader = ({ ...props }) => (
  <HeaderContainer>
    <FarmSwitch
      chains={[
        {
          id: CHAINS_ID.ETH_MAINNET,
          label: 'Ethereum',
        },
        {
          id: CHAINS_ID.MATIC_MAINNET,
          label: 'Polygon',
        },
        {
          id: CHAINS_ID.ARBITRUM_ONE,
          label: 'Arbitrum',
          isNew: true,
        },
        {
          id: CHAINS_ID.BSC_MAINNET,
          label: 'BSC',
        },
      ]}
    />
    <QuickFilter {...props} />
  </HeaderContainer>
)

export default VaultListHeader

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
          label: 'Ethereum',
        },
        {
          id: CHAINS_ID.MATIC_MAINNET,
          label: 'Polygon',
        },
        {
          id: 'ARBITRUM_MAINNET',
          label: 'Arbitrum',
          isNew: true,
          link: 'https://harvest.dolomite.io/',
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

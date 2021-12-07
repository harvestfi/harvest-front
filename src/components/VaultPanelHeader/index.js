import React, { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import BigNumber from 'bignumber.js'
import { find, get, isEqual } from 'lodash'
import useEffectWithPrevious from 'use-effect-with-previous'
import { useMediaQuery } from 'react-responsive'
import { useWallet } from '../../providers/Wallet'
import { usePools } from '../../providers/Pools'
import { useVaults } from '../../providers/Vault'
import uniStatusViewerContractData from '../../services/web3/contracts/unistatus-viewer/contract.json'
import uniStatusViewerContractMethods from '../../services/web3/contracts/unistatus-viewer/methods'
import poolMethods from '../../services/web3/contracts/pool/methods'
import tokenMethods from '../../services/web3/contracts/token/methods'
import DesktopPanelHeader from './Desktop'
import MobilePanelHeader from './Mobile'
import { newContractInstance } from '../../services/web3/index'

const { addresses } = require('../../data')

const VaultPanelHeader = ({
  token,
  tokenSymbol,
  open,
  isSpecialVault,
  loadedVault,
  loadingFarmingBalance,
  useIFARM,
  fAssetSymbol,
  multipleAssets,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 860px)' })
  const { account } = useWallet()
  const { pools } = usePools()
  const { vaultsData } = useVaults()
  const [amountsForPosition, setAmountsForPosition] = useState(null)
  const [tooltipContent, setTooltipContent] = useState(null)

  let vaultPool

  const tokenVault = get(vaultsData, token.hodlVaultId || tokenSymbol)

  if (isSpecialVault) {
    vaultPool = token.data
  } else {
    vaultPool = find(pools, pool => pool.collateralAddress === get(tokenVault, `vaultAddress`))
  }

  const isIFARM = get(vaultPool, 'rewardTokens[0]', false) === addresses.iFARM

  useEffect(() => {
    const fetchUserPositions = async () => {
      const viewerContractInstance = await newContractInstance(
        null,
        uniStatusViewerContractData.address,
        uniStatusViewerContractData.abi,
      )
      const { balanceOf: poolBalance } = poolMethods
      const { getBalance } = tokenMethods

      const userBalanceInPool = new BigNumber(
        await poolBalance(account, vaultPool.contractInstance),
      )
      const userBalanceInVault = new BigNumber(await getBalance(account, tokenVault.instance))
      const userShare = userBalanceInPool.plus(userBalanceInVault).toFixed()

      const amounts = await uniStatusViewerContractMethods.getAmountsForUserShare(
        tokenVault.vaultAddress,
        userShare,
        viewerContractInstance,
      )

      setAmountsForPosition(amounts)
    }

    if (multipleAssets && loadedVault === true && !loadingFarmingBalance && account) {
      fetchUserPositions()
    }
  }, [
    multipleAssets,
    tokenVault,
    loadedVault,
    loadingFarmingBalance,
    vaultPool.contractInstance,
    account,
  ])

  useEffectWithPrevious(
    ([prevTooltipContent]) => {
      if (tooltipContent && !isEqual(tooltipContent, prevTooltipContent)) {
        ReactTooltip.rebuild()
      }
    },
    [tooltipContent],
  )

  const componentsProps = {
    token,
    tokenSymbol,
    vaultPool,
    useIFARM,
    isIFARM,
    tooltipContent,
    setTooltipContent,
    open,
    fAssetSymbol,
    isSpecialVault,
    multipleAssets,
    amountsForPosition,
    loadedVault,
    loadingFarmingBalance,
  }

  return (
    <>
      {tooltipContent && (
        <ReactTooltip
          id={`tooltip-${tokenSymbol}`}
          backgroundColor="white"
          borderColor="black"
          border
          textColor="black"
          getContent={() => tooltipContent}
        />
      )}
      {isMobile ? (
        <MobilePanelHeader {...componentsProps} />
      ) : (
        <DesktopPanelHeader {...componentsProps} />
      )}
    </>
  )
}

export default VaultPanelHeader

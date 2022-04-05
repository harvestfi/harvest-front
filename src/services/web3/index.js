import Web3 from 'web3'
import { SafeAppWeb3Modal } from '@gnosis.pm/safe-apps-web3modal'
import BigNumber from 'bignumber.js'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { BscConnector } from '@binance-chain/bsc-connector'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import mobile from 'is-mobile'
import { get } from 'lodash'
import contracts from './contracts'
import { formatNumber } from '../../utils'
import {
  BSCSCAN_URL,
  BSC_URL,
  ETHERSCAN_URL,
  INFURA_URL,
  POLL_BALANCES_INTERVAL_MS,
  isDebugMode,
  MATIC_URL,
  MATICSCAN_URL,
} from '../../constants'
import ethLogo from '../../assets/images/logos/eth.png'
import bscLogo from '../../assets/images/logos/bsc.png'
import bswLogo from '../../assets/images/logos/bsw.png'
import maticLogo from '../../assets/images/logos/matic.svg'
import { CHAINS_ID } from '../../data/constants'

const providerOptions = {
  injected: {
    package: null,
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: 'Harvest Finance',
      rpc: {
        [CHAINS_ID.ETH_MAINNET]: INFURA_URL,
        [CHAINS_ID.BSC_MAINNET]: BSC_URL,
        [CHAINS_ID.MATIC_MAINNET]: MATIC_URL,
      },
    },
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: process.env.REACT_APP_INFURA_KEY,
      rpc: {
        [CHAINS_ID.BSC_MAINNET]: BSC_URL,
      },
    },
  },
  'custom-bnb': {
    package: BscConnector,
    display: {
      logo: bswLogo,
      name: 'Binance Chain Wallet',
      description: 'Connect to your Binance Chain Wallet',
    },
    options: {
      chainsSupported: [
        Number(CHAINS_ID.ETH_MAINNET),
        Number(CHAINS_ID.BSC_MAINNET),
        Number(CHAINS_ID.MATIC_MAINNET),
      ],
    },
    connector: async (ProviderPackage, options) => {
      const provider = new ProviderPackage(options)
      await provider.activate()
      return window.BinanceChain
    },
  },
}

const chains = {
  [CHAINS_ID.ETH_MAINNET]: {
    name: 'Ethereum',
    logo: ethLogo,
  },
  [CHAINS_ID.BSC_MAINNET]: {
    name: 'Binance Smart Chain',
    logo: bscLogo,
  },
  [CHAINS_ID.MATIC_MAINNET]: {
    name: 'Polygon (Matic)',
    logo: maticLogo,
  },
}

export const getChainHexadecimal = chainId => `0x${Number(chainId).toString(16)}`

export const web3Modal = new SafeAppWeb3Modal({
  network: 'mainnet',
  cacheProvider: false,
  disableInjectedProvider: false,
  providerOptions,
  chains,
})

export const mainWeb3 = new Web3(window.ethereum || INFURA_URL)
export const infuraWeb3 = new Web3(INFURA_URL)
export const bscWeb3 = new Web3(BSC_URL)
export const maticWeb3 = new Web3(MATIC_URL)

export const connectWeb3 = async () => {
  const loadedAsSafeApp = await web3Modal.isSafeApp()
  const loadedAsImTokenApp = !!get(window, 'ethereum.isImToken')

  let provider, chain

  if (!loadedAsSafeApp && !loadedAsImTokenApp) {
    const { provider: selectedProvider, selectedChain } = await web3Modal.requestProvider()
    provider = selectedProvider
    chain = selectedChain
  }

  if (loadedAsSafeApp || loadedAsImTokenApp) {
    provider = loadedAsSafeApp ? await web3Modal.requestProvider() : mainWeb3.currentProvider
    chain = (await mainWeb3.eth.getChainId()).toString()
  }

  mainWeb3.setProvider(provider)
  return chain
}

export const getContract = contractName => {
  return !!Object.keys(contracts).find(contractKey => contractKey === contractName)
}

export const newContractInstance = async (contractName, address, customAbi, web3Provider) => {
  const contractAddress = getContract(contractName)
    ? contracts[contractName].contract.address
    : address
  const contractAbi = getContract(contractName) ? contracts[contractName].contract.abi : customAbi

  if (contractAddress) {
    const web3Instance = web3Provider || mainWeb3
    return new web3Instance.eth.Contract(contractAbi, contractAddress)
  }
  return null
}

export const getAccount = () =>
  mainWeb3.eth
    .getAccounts()
    .then(accounts => {
      if (!accounts || (accounts && !accounts.length)) {
        return null
      }

      return accounts[0]
    })
    .catch(err => {
      console.error(err)
      return null
    })

export const fromWei = (wei, decimals, decimalsToDisplay = 2, format = false, radix = 10) => {
  const weiAmountInBN = new BigNumber(wei)
  let result = '0'

  if (typeof decimals !== 'undefined' && weiAmountInBN.isGreaterThan(0)) {
    result = weiAmountInBN.div(new BigNumber(10).exponentiatedBy(decimals)).toString(radix)

    if (format) {
      result = formatNumber(result, decimalsToDisplay)
    }
  }
  return result
}

export const toWei = (token, decimals, decimalsToDisplay) => {
  let tokenAmountInBN = new BigNumber(token)

  if (typeof decimals !== 'undefined' && tokenAmountInBN.isGreaterThan(0)) {
    tokenAmountInBN = tokenAmountInBN.multipliedBy(new BigNumber(10).exponentiatedBy(decimals))

    if (typeof decimalsToDisplay !== 'undefined') {
      tokenAmountInBN = tokenAmountInBN.decimalPlaces(decimalsToDisplay)
    }

    return tokenAmountInBN.toString(10)
  }
  return '0'
}

export const formatWeb3PluginErrorMessage = (error, customMessage) => {
  console.error(error)

  return (
    customMessage || 'Error submitting transaction, please make sure it was approved in your wallet'
  )
}

export const hasValidUpdatedBalance = (newBalance, currentBalance, fresh) =>
  fresh ||
  newBalance === 'error' ||
  new BigNumber(newBalance).eq(0) ||
  !new BigNumber(newBalance).eq(new BigNumber(currentBalance))

export const pollUpdatedBalance = (method, currentBalance, onTimeout, onSuccess, maxRetries = 2) =>
  new Promise((resolve, reject) => {
    let retries = 0
    const pollBalance = setInterval(() => {
      if (retries >= maxRetries) {
        clearInterval(pollBalance)
        resolve(onTimeout())
      }

      retries += 1

      method
        .then(fetchedBalance => {
          if (hasValidUpdatedBalance(fetchedBalance, currentBalance)) {
            resolve(onSuccess(fetchedBalance))
            clearInterval(pollBalance)
          }
        })
        .catch(err => {
          console.error(err)
          reject(err)
        })
    }, POLL_BALANCES_INTERVAL_MS)
  })

export const getChainName = chainId => {
  switch (Number(chainId)) {
    case Number(CHAINS_ID.BSC_MAINNET):
    case getChainHexadecimal(CHAINS_ID.BSC_MAINNET):
      return 'Binance Smart Chain'
    case Number(CHAINS_ID.ETH_MAINNET):
    case getChainHexadecimal(CHAINS_ID.ETH_MAINNET):
      return 'Ethereum Mainnet'
    case Number(CHAINS_ID.ETH_ROPSTEN):
    case getChainHexadecimal(CHAINS_ID.ETH_ROPSTEN):
      return 'Ethereum Ropsten'
    case Number(CHAINS_ID.MATIC_MAINNET):
    case getChainHexadecimal(CHAINS_ID.MATIC_MAINNET):
      return 'Polygon (Matic)'
    default:
      return `Unknown(${chainId})`
  }
}

export const getWeb3 = (chainId, account) => {
  if (account) {
    return mainWeb3
  }

  if (chainId === CHAINS_ID.BSC_MAINNET) {
    return bscWeb3
  }

  if (chainId === CHAINS_ID.MATIC_MAINNET) {
    return maticWeb3
  }

  return infuraWeb3
}

export const getExplorerLink = chainId => {
  switch (chainId) {
    case CHAINS_ID.MATIC_MAINNET:
      return MATICSCAN_URL
    case CHAINS_ID.BSC_MAINNET:
      return BSCSCAN_URL
    default:
      return ETHERSCAN_URL
  }
}

export const isMobileWeb3 = get(window, 'ethereum') && mobile()

export const handleWeb3ReadMethod = (methodName, params, instance) => {
  if (isDebugMode) {
    console.debug(`
Provider: ${get(instance, 'currentProvider.host') ? 'Infura/HttpProvider' : 'Injected web3'}
Contract address: ${get(instance, '_address')}
Method: ${methodName}
Params: ${params}
    `)
  }

  const contractMethod = instance.methods[methodName]
  return contractMethod(...params).call()
}

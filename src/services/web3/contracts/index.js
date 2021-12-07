import { isArray } from 'lodash'
import TokenContract from './token/contract.json'
import TokenMethods from './token/methods'

import DepositHelperContract from './deposit-helper/contract.json'
import DepositHelperMethods from './deposit-helper/methods'

import UniswapContract from './uniswap/contract.json'
import UniswapMethods from './uniswap/methods'

import APRedemptionContract from './ap-redemption/contract.json'
import APRedemptionMethods from './ap-redemption/methods'

import ReaderEthContract from './reader-eth/contract.json'
import ReaderEthMethods from './reader-eth/methods'

import ReaderBscContract from './reader-bsc/contract.json'
import ReaderBscMethods from './reader-bsc/methods'

import ReaderMaticContract from './reader-matic/contract.json'
import ReaderMaticMethods from './reader-matic/methods'

import { CHAINS_ID } from '../../../data/constants'

const { tokens } = require('../../../data')

const getTokensContracts = () => {
  const tokenContracts = {}

  Object.keys(tokens).forEach(token => {
    if (!isArray(tokens[token].tokenAddress)) {
      tokenContracts[token] = {
        contract: {
          address: tokens[token].tokenAddress,
          abi: TokenContract.abi,
        },
        methods: TokenMethods,
        chain: tokens[token].chain,
      }
    }
  })

  return tokenContracts
}

export default {
  depositHelper: {
    contract: DepositHelperContract,
    methods: DepositHelperMethods,
    chain: CHAINS_ID.ETH_MAINNET,
  },
  uniswap: {
    contract: UniswapContract,
    methods: UniswapMethods,
    chain: CHAINS_ID.ETH_MAINNET,
  },
  apRedemtion: {
    contract: APRedemptionContract,
    methods: APRedemptionMethods,
    chain: CHAINS_ID.ETH_MAINNET,
  },
  readerEth: {
    contract: ReaderEthContract,
    methods: ReaderEthMethods,
    chain: CHAINS_ID.ETH_MAINNET,
  },
  readerBsc: {
    contract: ReaderBscContract,
    methods: ReaderBscMethods,
    chain: CHAINS_ID.BSC_MAINNET,
  },
  readerMatic: {
    contract: ReaderMaticContract,
    methods: ReaderMaticMethods,
    chain: CHAINS_ID.MATIC_MAINNET,
  },
  ...getTokensContracts(),
}

import BigNumber from 'bignumber.js'
import { infuraWeb3, newContractInstance } from '../services/web3'
import addresses from './harvest-api/data/mainnet/addresses.json'
import uniswapContract from '../services/web3/contracts/uniswap/contract.json'
import uniswapMethods from '../services/web3/contracts/uniswap/methods'

// eslint-disable-next-line import/prefer-default-export
export const getFarmPriceFromUniswap = async () => {
  const uniswapInstance = await newContractInstance(
    null,
    uniswapContract.address,
    uniswapContract.abi,
    infuraWeb3,
  )

  const result = await uniswapMethods.getAmountsOut(
    new BigNumber(10).pow(18).toString(),
    [addresses.FARM, addresses.WETH, addresses.USDC],
    uniswapInstance,
  )

  const price = new BigNumber(result[2]).dividedBy(new BigNumber(10).pow(6))

  return price.toString()
}

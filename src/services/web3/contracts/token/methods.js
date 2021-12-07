import { handleWeb3ReadMethod } from '../../index'

const getBalance = (address, instance) => handleWeb3ReadMethod('balanceOf', [address], instance)

const getApprovedAmount = (address, contractAddress, instance) =>
  handleWeb3ReadMethod('allowance', [address, contractAddress], instance)

const approve = (address, userAddress, amount, instance) =>
  instance.methods.approve(address, amount).send({ from: userAddress })

const getDecimals = instance => handleWeb3ReadMethod('decimals', [], instance)

const getSymbol = instance => handleWeb3ReadMethod('symbol', [], instance)

const getTotalSupply = instance => handleWeb3ReadMethod('totalSupply', [], instance)

export default {
  getBalance,
  getApprovedAmount,
  approve,
  getDecimals,
  getSymbol,
  getTotalSupply,
}

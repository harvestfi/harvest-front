import { handleWeb3ReadMethod } from '../..'

const getUnderlyingBalanceWithInvestment = instance =>
  handleWeb3ReadMethod('underlyingBalanceWithInvestment', [], instance)

const getUnderlyingBalanceWithInvestmentForHolder = (userAddress, instance) =>
  handleWeb3ReadMethod('underlyingBalanceWithInvestmentForHolder', [userAddress], instance)

const getPricePerFullShare = instance => handleWeb3ReadMethod('getPricePerFullShare', [], instance)

const getUnderlyingToken = instance => handleWeb3ReadMethod('underlying', [], instance)

const decimals = instance => handleWeb3ReadMethod('decimals', [], instance)

const getStrategy = instance => handleWeb3ReadMethod('strategy', [], instance)

const getTotalSupply = instance => handleWeb3ReadMethod('totalSupply', [], instance)

const withdraw = (amount, address, instance) =>
  instance.methods.withdraw(amount).send({ from: address })

const deposit = (amount, address, instance) =>
  instance.methods.deposit(amount).send({ from: address })

export default {
  getUnderlyingBalanceWithInvestment,
  getUnderlyingBalanceWithInvestmentForHolder,
  getPricePerFullShare,
  getUnderlyingToken,
  decimals,
  withdraw,
  getStrategy,
  getTotalSupply,
  deposit,
}

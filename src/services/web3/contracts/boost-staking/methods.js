import { handleWeb3ReadMethod } from '../..'

const getStakedAmount = (userAddress, instance) =>
  handleWeb3ReadMethod('balance', [userAddress], instance)

const getBoostAmount = (userAddress, instance) =>
  handleWeb3ReadMethod('limitOf', [userAddress], instance)

const stake = (amount, address, instance) => instance.methods.stake(amount).send({ from: address })

const unstake = (amount, address, instance) =>
  instance.methods.unstake(amount).send({ from: address })

export default {
  getStakedAmount,
  getBoostAmount,
  stake,
  unstake,
}

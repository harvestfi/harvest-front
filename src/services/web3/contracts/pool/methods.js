import { handleWeb3ReadMethod } from '../..'

const balanceOf = (address, instance) => handleWeb3ReadMethod('balanceOf', [address], instance)

const periodFinish = instance => handleWeb3ReadMethod('periodFinish', [], instance)

const rewardPerToken = instance => handleWeb3ReadMethod('rewardPerToken', [], instance)

const rewardRate = instance => handleWeb3ReadMethod('rewardRate', [], instance)

const totalSupply = instance => handleWeb3ReadMethod('totalSupply', [], instance)

const lpToken = instance => handleWeb3ReadMethod('lpToken', [], instance)

const earned = (rewardAddress, address, instance) =>
  handleWeb3ReadMethod('earned', [rewardAddress, address], instance)

const totalEarned = (address, instance) => handleWeb3ReadMethod('earned', [address], instance)

const stake = (amount, address, instance) => instance.methods.stake(amount).send({ from: address })

const exit = (address, instance) => instance.methods.exit().send({ from: address })

const claim = (address, instance) => instance.methods.getReward().send({ from: address })

const claimAll = (address, instance) => instance.methods.getAllRewards().send({ from: address })

const migrate = (address, instance) => instance.methods.migrate().send({ from: address })

const withdraw = (address, amount, instance) =>
  instance.methods.withdraw(amount).send({ from: address })

export default {
  balanceOf,
  periodFinish,
  rewardPerToken,
  rewardRate,
  totalSupply,
  lpToken,
  totalEarned,
  earned,
  stake,
  exit,
  claim,
  claimAll,
  migrate,
  withdraw,
}

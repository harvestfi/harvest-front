import { handleWeb3ReadMethod } from '../..'

const calculateBoostedAmount = (amplifierAddress, amount, userAddress, instance) =>
  handleWeb3ReadMethod('calculateBoostedAmount', [amplifierAddress, amount, userAddress], instance)

export default {
  calculateBoostedAmount,
}

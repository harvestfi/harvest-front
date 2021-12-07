import { handleWeb3ReadMethod } from '../..'

const redeem = (balance, address, instance) =>
  instance.methods.redeem(balance).send({ from: address })

const calcRedemption = (balance, instance) =>
  handleWeb3ReadMethod('calcRedemption', [balance], instance)

export default {
  redeem,
  calcRedemption,
}

import { handleWeb3ReadMethod } from '../..'

const getAmountsOut = (amountsIn, path, instance) =>
  handleWeb3ReadMethod('getAmountsOut', [amountsIn, path], instance)

export default {
  getAmountsOut,
}

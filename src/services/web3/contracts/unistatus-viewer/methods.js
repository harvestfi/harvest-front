const { handleWeb3ReadMethod } = require('../..')

const getAmountsForUserShare = (vaultAddress, userShare, instance) =>
  handleWeb3ReadMethod('getAmountsForUserShare', [vaultAddress, userShare], instance)

const quoteV2Migration = (token0, token1, amount, instance) =>
  handleWeb3ReadMethod('quoteV2Migration', [token0, token1, amount], instance)

const getAmountsForPosition = (posId, instance) =>
  handleWeb3ReadMethod('getAmountsForPosition', [posId], instance)

export default { getAmountsForUserShare, quoteV2Migration, getAmountsForPosition }

import { handleWeb3ReadMethod } from '../..'

const zapSqrtPriceLimitX96 = 0

const getSqrtPriceX96 = instance => handleWeb3ReadMethod('getSqrtPriceX96', [], instance)
const deposit = (
  firstAmount,
  secondAmount,
  zapFunds,
  sqrtRatioX96,
  tolerance,
  zapAmount0OutMin = 0,
  zapAmount1OutMin = 0,
  address,
  instance,
  simulate,
) => {
  const funcParams = [
    firstAmount,
    secondAmount,
    zapFunds,
    sqrtRatioX96,
    tolerance,
    zapAmount0OutMin,
    zapAmount1OutMin,
    zapSqrtPriceLimitX96,
  ]

  return simulate
    ? instance.methods.deposit(...funcParams).call({ from: address })
    : instance.methods.deposit(...funcParams).send({ from: address })
}

const legacyDeposit = (
  firstAmount,
  secondAmount,
  zapFunds,
  sweep,
  sqrtRatioX96,
  tolerance,
  address,
  instance,
) =>
  instance.methods
    .deposit(firstAmount, secondAmount, zapFunds, sweep, sqrtRatioX96, tolerance)
    .send({ from: address })

const withdraw = (
  amount,
  withdrawFirstAsset,
  withdrawSecondAsset,
  sqrtRatioX96,
  tolerance,
  amount0OutMinForZap = 0,
  amount1OutMinForZap = 0,
  address,
  instance,
  simulate,
) => {
  const funcParams = [
    amount,
    withdrawFirstAsset,
    withdrawSecondAsset,
    sqrtRatioX96,
    tolerance,
    amount0OutMinForZap,
    amount1OutMinForZap,
    zapSqrtPriceLimitX96,
  ]

  return simulate
    ? instance.methods.withdraw(...funcParams).call({ from: address })
    : instance.methods.withdraw(...funcParams).send({ from: address })
}

const legacyWithdraw = (
  amount,
  withdrawFirstAsset,
  withdrawSecondAsset,
  sqrtRatioX96,
  tolerance,
  address,
  instance,
) =>
  instance.methods
    .withdraw(amount, withdrawFirstAsset, withdrawSecondAsset, sqrtRatioX96, tolerance)
    .send({ from: address })

const migrateToNftFromV2 = (
  amount,
  minAmount0,
  minAmount1,
  zapFunds,
  sqrtRatioX96,
  tolerance,
  amount0OutMinForZap = 0,
  amount1OutMinForZap = 0,
  address,
  instance,
  simulate,
) => {
  const funcParams = [
    amount,
    minAmount0,
    minAmount1,
    zapFunds,
    sqrtRatioX96,
    tolerance,
    amount0OutMinForZap,
    amount1OutMinForZap,
    zapSqrtPriceLimitX96,
  ]

  return simulate
    ? instance.methods.migrateToNftFromV2(...funcParams).call({ from: address })
    : instance.methods.migrateToNftFromV2(...funcParams).send({ from: address })
}

const migrateToNftFromV2Legacy = (
  amount,
  minAmount0,
  minAmount1,
  zapFunds,
  sweep,
  sqrtRatioX96,
  tolerance,
  address,
  instance,
) =>
  instance.methods
    .migrateToNftFromV2(amount, minAmount0, minAmount1, zapFunds, sweep, sqrtRatioX96, tolerance)
    .send({ from: address })

export default {
  getSqrtPriceX96,
  deposit,
  legacyDeposit,
  withdraw,
  legacyWithdraw,
  migrateToNftFromV2,
  migrateToNftFromV2Legacy,
}

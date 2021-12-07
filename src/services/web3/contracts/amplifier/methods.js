const withdraw = (amount, address, instance) =>
  instance.methods.withdraw(amount).send({ from: address })

export default {
  withdraw,
}

const depositAll = (amounts, vaultAddresses, userAddress, instance) =>
  instance.methods.depositAll(amounts, vaultAddresses).send({ from: userAddress })

export default {
  depositAll,
}

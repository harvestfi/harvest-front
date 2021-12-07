export const validateChain = async (
  currentWalletNetwork,
  currentChain,
  onSuccess = Promise.resolve(),
  onInvalid = () => {},
) => {
  if (Number(currentWalletNetwork) !== Number(currentChain)) {
    onInvalid()
  } else {
    await onSuccess()
  }
}

export const validateAccount = (accounts, setAccount) => {
  if (accounts.length) {
    setAccount(accounts[0])
  } else {
    setAccount(null)
  }
}

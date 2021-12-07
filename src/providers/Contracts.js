import React, { createContext, useContext, useState, useEffect } from 'react'
import promiseObject from 'promise-all-object'
import importedContracts from '../services/web3/contracts'
import { newContractInstance, getWeb3 } from '../services/web3'

const ContractsContext = createContext()
const useContracts = () => useContext(ContractsContext)

const ContractsProvider = _ref => {
  const { children } = _ref
  const [contracts, setContracts] = useState({})
  useEffect(() => {
    const initializeContracts = async () => {
      const temporaryGroupOfContracts = {}
      Object.keys(importedContracts).forEach(contract => {
        Object.assign(temporaryGroupOfContracts, {
          [contract]: {
            instance: newContractInstance(
              contract,
              null,
              null,
              getWeb3(importedContracts[contract].chain, true),
            ),
            methods: importedContracts[contract].methods,
            address: importedContracts[contract].contract.address,
          },
        })
      })
      const initializedContracts = await promiseObject(temporaryGroupOfContracts)
      setContracts(initializedContracts)
    }

    initializeContracts()
  }, [])
  return React.createElement(
    ContractsContext.Provider,
    {
      value: {
        contracts,
      },
    },
    Object.keys(contracts).length ? children : 'loading',
  )
}

export { ContractsProvider, useContracts }

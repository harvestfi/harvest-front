import React from 'react'
import { debounce, flatMapDeep, isEmpty, toArray, uniq } from 'lodash'
import Toggle from 'react-toggle'
import {
  QuickFilterContainer,
  CategoriesContainer,
  DepositedOnlyContainer,
  InputsContainer,
} from './style'
import Button from '../Button'
import { useVaults } from '../../providers/Vault'
import { useWallet } from '../../providers/Wallet'
import { usePools } from '../../providers/Pools'
import SearchBar from '../SearchBar'
import { CHAINS_ID, VAULT_CATEGORIES_IDS, VAULT_CATEGORIES_NAMES } from '../../data/constants'

const getInactiveCategoryIdByChain = chain => {
  switch (chain) {
    case CHAINS_ID.ETH_MAINNET:
      return VAULT_CATEGORIES_IDS.INACTIVE
    case CHAINS_ID.BSC_MAINNET:
      return VAULT_CATEGORIES_IDS.INACTIVE_BSC
    default:
      return undefined
  }
}

const QuickFilter = ({
  onCategoryClick = () => {},
  onDepositedOnlyClick = () => {},
  depositedOnly,
  selectedCategory,
  setSearchQuery,
}) => {
  const { vaultsData } = useVaults()
  const { connected, balancesToLoad, chain } = useWallet()
  const { loadingVaults, loadingFarmingBalances } = useVaults()
  const { loadingUserPoolStats } = usePools()
  const categories = uniq(flatMapDeep(toArray(vaultsData), 'category'))

  const isLoading =
    loadingVaults || !isEmpty(balancesToLoad) || loadingFarmingBalances || loadingUserPoolStats

  const updateSearchQuery = event => {
    event.persist()

    const debouncedFn = debounce(() => {
      const searchString = event.target.value
      setSearchQuery(searchString)
    }, 300)

    debouncedFn()
  }

  const inactiveCategoryId = getInactiveCategoryIdByChain(chain)

  const hasInactiveVaults = categories.find(categoryId => categoryId === inactiveCategoryId)

  return (
    <QuickFilterContainer>
      <CategoriesContainer>
        {chain !== CHAINS_ID.BSC_MAINNET ? (
          <Button
            color={selectedCategory === null ? 'secondary' : 'info'}
            size="sm"
            fontWeight="500"
            onClick={() => onCategoryClick(null)}
            width="max-content"
          >
            All
          </Button>
        ) : (
          <Button
            color={selectedCategory === 'All' ? 'secondary' : 'info'}
            size="sm"
            fontWeight="500"
            onClick={() => onCategoryClick('All')}
            width="max-content"
          >
            All
          </Button>
        )}
        {categories
          .filter(categoryId => categoryId !== inactiveCategoryId)
          .map((categoryId, i) => {
            if (categoryId) {
              return (
                <Button
                  key={i}
                  color={selectedCategory === categoryId ? 'secondary' : 'info'}
                  size="sm"
                  fontWeight="500"
                  onClick={() => onCategoryClick(categoryId)}
                  width="max-content"
                >
                  {VAULT_CATEGORIES_NAMES[categoryId]}
                </Button>
              )
            }
            return null
          })}
        {hasInactiveVaults ? (
          <Button
            color={
              selectedCategory === inactiveCategoryId ||
              (selectedCategory !== 'All' && chain === CHAINS_ID.BSC_MAINNET)
                ? 'secondary'
                : 'info'
            }
            size="sm"
            fontWeight="500"
            onClick={() => onCategoryClick(inactiveCategoryId)}
            width="max-content"
          >
            Inactive
          </Button>
        ) : null}
      </CategoriesContainer>
      <InputsContainer>
        <SearchBar onChange={updateSearchQuery} />
        <DepositedOnlyContainer>
          <span>Deposited Only</span>
          <Toggle
            id="deposited-only"
            defaultChecked={depositedOnly}
            onChange={e => onDepositedOnlyClick(e.target.checked)}
            disabled={!connected || isLoading}
          />
        </DepositedOnlyContainer>
      </InputsContainer>
    </QuickFilterContainer>
  )
}

export default QuickFilter

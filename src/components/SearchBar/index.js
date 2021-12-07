import React from 'react'
import { Container, Icon } from './style'
import searchIcon from '../../assets/images/ui/search.svg'

const VaultSearchBar = ({ onChange = () => {} }) => (
  <Container>
    <Icon src={searchIcon} alt="Search" />
    <input onChange={onChange} placeholder="Search" />
  </Container>
)

export default VaultSearchBar

import React from 'react'
import { HeaderContainer, HeaderItem } from './style'

const HeaderBanner = ({ children }) => (
  <HeaderContainer>
    <HeaderItem>{children}</HeaderItem>
  </HeaderContainer>
)

export default HeaderBanner

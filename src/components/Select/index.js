import React from 'react'
import RSelect, { components } from 'react-select'
import { ReactSVG } from 'react-svg'
import { ArrowContainer, Container } from './style'
import arrowIcon from '../../assets/images/ui/arrow.svg'

const DropdownIndicator = ({ isFocused, ...props }) => (
  <components.DropdownIndicator {...props} isFocused={isFocused}>
    <ArrowContainer open={isFocused}>
      <ReactSVG src={arrowIcon} />
    </ArrowContainer>
  </components.DropdownIndicator>
)

const Select = ({ ...props }) => (
  <Container>
    <RSelect classNamePrefix="hv-select" components={{ DropdownIndicator }} {...props} />
  </Container>
)

export default Select

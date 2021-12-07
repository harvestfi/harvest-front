import React from 'react'
import { Container, Label } from './style'

const TextToggle = ({ checked, options, setChecked, arrowAlign }) => {
  const disabled = checked ? options.checked.disabled : options.unchecked.disabled
  const label = checked ? options.checked.label : options.unchecked.label

  return (
    <Container
      onClick={() => {
        if (!disabled) {
          setChecked(!checked)
        }
      }}
      disabled={disabled}
      arrowAlign={arrowAlign}
    >
      <Label>{label}</Label>
    </Container>
  )
}

export default TextToggle

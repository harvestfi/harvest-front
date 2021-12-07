import React from 'react'
import Button from '../Button'
import Arrow from './style'
import arrow from '../../assets/images/ui/lg-r-arrow.svg'
import arrowGrey from '../../assets/images/ui/lg-r-arrow-grey.svg'

const ButtonSwitch = ({ checked, setChecked, options }) => {
  const disabled = checked ? options.checked.disabled : options.unchecked.disabled
  const label = checked ? options.checked.label : options.unchecked.label

  return (
    <Button
      color="secondary"
      size="md"
      height="38px"
      onClick={() => {
        if (!disabled) {
          setChecked(!checked)
        }
      }}
      disabled={disabled}
    >
      {label}
      <Arrow src={disabled ? arrowGrey : arrow} alt={label} />
    </Button>
  )
}

export default ButtonSwitch

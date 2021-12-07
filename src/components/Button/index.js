import React from 'react'
import ButtonStyle from './style'

const Button = ({ type, children, ...props }) => (
  <ButtonStyle type={type} {...props}>
    {children}
  </ButtonStyle>
)

export default Button

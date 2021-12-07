import React from 'react'
import { CountdownContainer, DaysLabel } from './style'

const CountdownLabel = ({ days, hours, minutes, seconds, milliseconds, ...props }) => (
  <CountdownContainer {...props}>
    {days}
    <DaysLabel>Days</DaysLabel>
    {hours}:{minutes}:{seconds}.{milliseconds.toString().slice(0, 2).padStart(2, '0')}
  </CountdownContainer>
)

export default CountdownLabel

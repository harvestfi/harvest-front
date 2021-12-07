import React from 'react'
import ReactTooltip from 'react-tooltip'
import Container from './style'

const WithdrawInputTooltip = ({ hide, ...props }) => (
  <Container hide={hide}>
    <ReactTooltip {...props} />
  </Container>
)

export default WithdrawInputTooltip

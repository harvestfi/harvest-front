import styled from 'styled-components'

const Container = styled.div`
  opacity: ${props => (props.hide ? '0' : '1')};
`

export default Container

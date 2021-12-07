import styled from 'styled-components'

const CountdownContainer = styled.div`
  display: ${props => (props.display ? props.display : 'flex')};
  font-family: 'Lato';
  font-weight: 900;
  font-size: 25px;
  line-height: 30px;
`

const DaysLabel = styled.label`
  margin-left: 5px;
  margin-right: 5px;
`

export { CountdownContainer, DaysLabel }

import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => (props.arrowAlign === 'left' ? 'flex-start' : 'flex-end')};
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${props => (props.disabled ? '0.5' : '1')};
  width: 100px;

  ${props =>
    props.arrowAlign === 'left'
      ? `
  &:before {
    content: '←';
    display: block;
  }`
      : `
  &:after {
    content: '→';
    display: block;
  }`}
`

const Label = styled.span`
  text-decoration: underline;
`

export { Container, Label }

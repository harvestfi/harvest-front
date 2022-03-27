import styled from 'styled-components'

const ButtonStyle = styled.button`
  border: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${props => props.width || 'auto'};
  min-width: ${props => props.minWidth || 'unset'};
  max-width: ${props => props.maxWidth || 'unset'};
  height: ${props => props.height || 'unset'};
  margin: ${props => props.margin || 'unset'};
  border-radius: 10px;
  font-weight: 800;
  cursor: pointer;
  outline: 0;
  transition: 0.25s;
  font-family: Montserrat;
  padding: 10px;

  ${props =>
    props.size === 'lg'
      ? `
  font-weight: 800;
  font-size: 20px;
  line-height: 24px;`
      : ''}

  ${props =>
    props.fontWeight
      ? `
  font-weight: ${props.fontWeight};`
      : ''}
    
${props =>
  props.size === 'md'
    ? `
  font-size: 16px;
  line-height: 20px;`
    : ''}

${props =>
  props.size === 'sm'
    ? `
  font-size: 14px;
  line-height: 17px;`
    : ''}


  ${props =>
    props.color === 'primary'
      ? `
  background-color: #F2B435;
  color: #4C351B;

  ${
    !props.disabled
      ? `
  &:hover {
    background: #FFC87C;
  }`
      : ''
  }

  &:active {
    background-color: #cc9549;
  }
  `
      : ''}

  ${props =>
    props.color === 'secondary'
      ? `
      background-color: #FFF1DE;
      border: 2px solid #F2B435;
      color: #4C351B;
    
      ${
        !props.disabled
          ? `
      &:hover {
        border: 2px solid #FFD69D;
        color: #CC9549;
        background: white;
      }`
          : ''
      }
    
      &:active {
        border: 2px solid #997037;
        color: #4C351B;
        background: white;
      }
      `
      : ''}


      ${props =>
        props.color === 'info'
          ? `
          background-color: white;
          border: 2px solid #DADFE6;
          color: black;
          `
          : ''}
      

    &:disabled {
      cursor: not-allowed;
      color: #a9aeb3;
      background-color: #dadfe6;
      border-color: #dadfe6;
    }

    @media screen and (max-width: 860px) {
      font-size: 14px;
    }
  }
`

export default ButtonStyle

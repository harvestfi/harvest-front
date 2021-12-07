import styled from 'styled-components'
import { ArrowContainer } from '../VaultPanelHeader/style'

const VaultContainer = styled.div`
  display: flex;
  font-size: 16px;
  flex-direction: column;
  transition: 0.25s;
  position: relative;
  margin-bottom: 5px;
  transition: 0.25s;
  border-radius: 10px;
  background: ${props => (props.open ? '#daeff0' : 'transparent')};
  padding: 0 20px;
  margin: 0px 10px 20px;

  span {
    font-size: 16px;
  }

  .Collapsible__contentOuter {
    ${props =>
      props.open
        ? `
    background: #ffffff80;
    padding: 30px;
    margin-bottom: 20px;
    border-radius: 4px;
    `
        : ''};
  }

  &:hover {
    background: #deeef0;
    cursor: pointer;

    ${ArrowContainer} {
      background: #f2b435;

      path {
        fill: #4c351b;
      }
    }
  }

  @media screen and (max-width: 860px) {
    background-color: white;
    overflow: hidden;
    position: relative;

    .Collapsible__contentOuter {
      padding: 0;
    }

    span {
      font-size: 14px !important;
    }
  }
`

const VaultBody = styled.div`
  padding: 10px;
  cursor: auto;
`

const InputControl = styled.div`
  display: flex;
  position: relative;
  flex-direction: ${props => props.flexDirection || 'unset'};
  justify-content: ${props => props.justifyContent || 'unset'};
  gap: ${props => props.gap || 'unset'};
  align-items: baseline;
  flex: 0 0 55%;

  button {
    margin-left: 10px !important;
  }
`

const FormGroup = styled.div`
  display: flex;
  border-top: ${props => props.borderTop || 'unset'};
  border-bottom: ${props => props.borderBottom || 'unset'};
  padding: ${props => props.padding || 'unset'};
  margin: ${props => props.padding || 'unset'};
  width: ${props => props.width || 'unset'};

  @media screen and (max-width: 575px) {
    flex-direction: column;
  }
`

const MigrationLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 30px;
  font-weight: 700;
  width: 100%;
  height: 100%;
`

export { VaultContainer, VaultBody, FormGroup, InputControl, MigrationLabel }

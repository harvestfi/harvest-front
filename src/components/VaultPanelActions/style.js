import styled from 'styled-components'

const UniV3VaultContainer = styled.div`
  display: flex;
  padding-top: 10px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #dadfe6;

  @media screen and (max-width: 670px) {
    justify-content: center;
    flex-direction: column;
  }
`

const PrimaryActionsContainer = styled.div`
  display: grid;
  padding-left: 30px;
  margin-left: 30px;
  border-left: 1px solid #dadfe6;
  align-items: ${props => props.alignItems || 'center'};
  grid-template-columns: repeat(${props => props.gridItems || '2'}, 1fr);
  grid-column-gap: ${props => props.gridColGap || '15px'};
  grid-row-gap: ${props => props.gridRowGap || '15px'};
  width: 100%;

  @media screen and (max-width: 575px) {
    margin-top: 20px;
    padding-left: 0;
    margin-left: 0;
    border-left: 0;
  }
`

const DepositOptionsContainer = styled.div`
  display: flex;
  grid-column: 1/3;
`

const MigrateOptionsContainer = styled.div`
  display: flex;
  grid-column: 2/3;
`

const SelectedVaultContainer = styled.div`
  display: flex;
  width: 100%;
  padding: ${props => props.padding || '20px 0px'};
  max-width: ${props => props.maxWidth || '500px'};
  border-color: #dadfe6;
  border-style: solid;
  border-width: ${props => props.borderWidth || '1px 0px'};
  margin: ${props => props.margin || '30px 0px'};
  gap: 20px;

  button {
    font-weight: 800;
    width: auto;
  }

  @media screen and (max-width: 670px) {
    justify-content: center;
    flex-direction: column;
  }
`

const SelectedVault = styled.div`
  display: flex;
  flex-basis: 50%;
  flex-direction: ${props => props.flexDirection || 'column'};
  justify-content: ${props => props.justifyContent || 'space-between'};
  align-items: ${props => props.alignItems || 'unset'};
  order: ${props => props.order};
  border-right: 1px solid #dadfe6;

  &:last-child {
    border: unset;
  }

  &:first-of-type {
    @media screen and (max-width: 670px) {
      order: 10;
      border-right: unset;
      align-items: center;
      border-top: 1px solid #dadfe6;
      padding-top: 20px;
    }
  }

  &:last-child {
    @media screen and (max-width: 670px) {
      order: 11;
      border-right: unset;
      border-top: 1px solid #dadfe6;
      padding-top: 20px;
      justify-content: center;
      margin-top: 10px;
    }
  }

  @media screen and (max-width: 670px) {
    border-right: unset;
    justify-content: center;
  }
`
const SelectedVaultLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  white-space: pre;
  flex-wrap: wrap;
  font-family: Montserrat;
  font-weight: 500;
  font-size: ${props => props.fontSize || '16px'} !important;
  line-height: ${props => props.lineHeight || '24px'};
  color: ${props => props.color || 'black'};
  text-decoration: ${props => (props.link ? 'underline' : 'unset')};
  cursor ${props => (props.link ? 'pointer' : 'unset')};
`

const SelectedVaultNumber = styled.span`
  font-weight: bold;
  font-size: 15px;
  text-align: center;
`

const RangeGroup = styled.div`
  display: flex;
  flex-direction: row;
  flex-basis: 50%;
  justify-content: space-between;
  align-items: center;
  padding: 5px;

  @media screen and (max-width: 670px) {
    align-items: center;
    border-left: unset;
    border-top: 1px solid #dadfe6;
    padding-top: 20px;
    margin-top: 15px;
  }
`

const VaultRangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 16px;
`

const VaultRange = styled.span`
  font-weight: 500;
  font-size: 14px !important;
  color: ${props => props.color || 'black'};
  text-align: left;
`

const SelectedVaultTokenInfo = styled.div`
  margin-left: 10px;
  display: flex;
  align-items: center;
`

export {
  UniV3VaultContainer,
  PrimaryActionsContainer,
  DepositOptionsContainer,
  SelectedVaultTokenInfo,
  SelectedVaultContainer,
  SelectedVault,
  SelectedVaultLabel,
  SelectedVaultNumber,
  RangeGroup,
  VaultRangeContainer,
  VaultRange,
  MigrateOptionsContainer,
}

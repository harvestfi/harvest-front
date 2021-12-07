import styled from 'styled-components'

const SelectedBoostContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  grid-gap: 10px;
  width: 100%;
  padding: 20px 0px;
`

const SelectedBoost = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  order: ${props => props.order};
`
const SelectedBoostLabel = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-bottom: 10px;
  white-space: pre;
  flex-wrap: wrap;
`

const SelectedBoostNumber = styled.span`
  font-weight: bold;
  font-size: 15px;
  text-align: center;
`

export { SelectedBoostContainer, SelectedBoost, SelectedBoostLabel, SelectedBoostNumber }

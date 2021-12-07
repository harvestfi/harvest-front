import styled from 'styled-components'

const QuickFilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 25px 40px;

  @media screen and (max-width: 950px) {
    background: white;
    padding: 30px;
    overflow: hidden;
    flex-direction: column;
    grid-gap: 20px;
  }

  @media screen and (max-width: 860px) {
    margin-bottom: 20px;
  }
`

const CategoriesContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  button {
    margin-right: 20px;
    margin-bottom: 10px;
  }

  @media screen and (max-width: 950px) {
    flex-wrap: unset;
    overflow: overlay;

    button {
      white-space: pre;
      margin-bottom: 0;
    }
  }
`

const DepositedOnlyContainer = styled.div`
  display: flex;
  flex: 0 0 12%;
  align-items: center;
  margin: 10px 0;

  span {
    font-weight: 500;
    font-size: 14px;
    line-height: 17px;
    margin-right: 10px;
  }
`

const InputsContainer = styled.div`
  width: 25%;
  min-width: 25%;

  @media screen and (max-width: 950px) {
    width: 100%;
  }
`

export { QuickFilterContainer, DepositedOnlyContainer, CategoriesContainer, InputsContainer }

import styled from 'styled-components'

const HomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 85vh;
`

const HomeHeroContainer = styled.div`
  margin-top: 140px;
  font-size: 28px;
  text-align: center;
`

const HomeHeroText = styled.h1`
  margin-top: 20px;
  font-size: 28px;

  &:last-of-type {
    margin-bottom: 30px;
  }
`

export { HomeContainer, HomeHeroContainer, HomeHeroText }

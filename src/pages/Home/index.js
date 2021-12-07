import React from 'react'
import { useHistory } from 'react-router-dom'
import Socials from '../../components/Socials/index'
import { HomeContainer, HomeHeroText, HomeHeroContainer } from './style'
import { ROUTES } from '../../constants'
import Button from '../../components/Button/index'

const Home = () => {
  const { push } = useHistory()

  return (
    <HomeContainer>
      <Socials />
      <HomeHeroContainer>
        <HomeHeroText>Harvest.</HomeHeroText>
        <HomeHeroText>Automated Yield Farming.</HomeHeroText>
        <Button width="200px" height="30px" onClick={() => push(ROUTES.EARN)}>
          Launch App
        </Button>
      </HomeHeroContainer>
    </HomeContainer>
  )
}

export default Home

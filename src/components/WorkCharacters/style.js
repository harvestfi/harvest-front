import styled from 'styled-components'

const WorkCharactersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
`

const WorkCharacter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  flex-basis: 380px;

  @media screen and (max-width: 1200px) {
    flex-basis: 100%;
  }
`

const WorkCharacterHeader = styled.div`
  color: #292722;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Lato;
  font-style: normal;
  font-weight: 900;
  font-size: 30px;
  line-height: 36px;
`

const WorkCharacterSubHeader = styled.div`
  color: #292722;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 800;
  font-size: 16px;
  line-height: 20px;
  margin-top: 15px;
  margin-bottom: 10px;
`

const WorkCharacterDescription = styled.p`
  margin: 30px;
  text-align: left;
  line-height: 26px;

  @media screen and (max-width: 800px) {
    font-size: 14px;
  }
`

const WorkCharacterIcon = styled.img`
  width: 84px;
  height 74px;
  margin-top: 40px;
  margin-bottom: 45px;
  object-fit: contain;
`

export {
  WorkCharacterIcon,
  WorkCharactersContainer,
  WorkCharacter,
  WorkCharacterHeader,
  WorkCharacterDescription,
  WorkCharacterSubHeader,
}

import React from 'react'
import { WORK_CHARACTERS } from '../../constants'
import {
  WorkCharacter,
  WorkCharactersContainer,
  WorkCharacterHeader,
  WorkCharacterDescription,
  WorkCharacterSubHeader,
  WorkCharacterIcon,
} from './style'

const WorkCharacters = () => (
  <WorkCharactersContainer>
    {WORK_CHARACTERS.map(character => (
      <WorkCharacter
        key={`${character.title}-${character.subtitle}`}
        gridPosition={character.gridPosition}
      >
        <WorkCharacterHeader>
          <WorkCharacterIcon src={character.icon} />
          {character.title}
          <WorkCharacterSubHeader>{character.subtitle}</WorkCharacterSubHeader>
        </WorkCharacterHeader>
        <WorkCharacterDescription>{character.description}</WorkCharacterDescription>
      </WorkCharacter>
    ))}
  </WorkCharactersContainer>
)

export default WorkCharacters

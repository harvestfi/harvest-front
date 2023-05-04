import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faDiscord, faMedium } from '@fortawesome/free-brands-svg-icons'
import { SocialsContainer, Social } from './style'
import { SOCIAL_LINKS } from '../../constants'

const Socials = () => (
  <SocialsContainer>
    <Social href={SOCIAL_LINKS.TWITTER} target="_blank">
      <FontAwesomeIcon size="2x" color="white" icon={faTwitter} />
    </Social>
    <Social href={SOCIAL_LINKS.DISCORD} target="_blank">
      <FontAwesomeIcon size="2x" color="white" icon={faDiscord} />
    </Social>
    <Social href={SOCIAL_LINKS.MEDIUM} target="_blank">
      <FontAwesomeIcon size="2x" color="white" icon={faMedium} />
    </Social>
  </SocialsContainer>
)

export default Socials

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTwitter,
  faDiscord,
  faMedium,
  faReddit,
  faTelegram,
} from '@fortawesome/free-brands-svg-icons'
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
    <Social href={SOCIAL_LINKS.TELEGRAM} target="_blank">
      <FontAwesomeIcon size="2x" color="white" icon={faTelegram} />
    </Social>
    <Social href={SOCIAL_LINKS.MEDIUM} target="_blank">
      <FontAwesomeIcon size="2x" color="white" icon={faMedium} />
    </Social>
    <Social href={SOCIAL_LINKS.REDDIT} target="_blank">
      <FontAwesomeIcon size="2x" color="white" icon={faReddit} />
    </Social>
  </SocialsContainer>
)

export default Socials

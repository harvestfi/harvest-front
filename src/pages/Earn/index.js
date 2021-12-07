import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { ROUTES } from '../../constants'
import { Container, FakeLink } from './style'

const Earn = () => {
  const [seconds, setSecond] = useState(5)
  const { push } = useHistory()

  useEffect(() => {
    const secondsInterval = setInterval(() => {
      if (seconds === 0) {
        push(ROUTES.FARM)
      } else {
        setSecond(seconds - 1)
      }
    }, 1000)

    return () => {
      clearInterval(secondsInterval)
    }
  })

  return (
    <Container>
      <p>
        This page functionality has been moved to the{' '}
        <FakeLink onClick={() => push(ROUTES.FARM)}>front page</FakeLink>, redirect in {seconds}{' '}
        seconds.
      </p>
    </Container>
  )
}

export default Earn

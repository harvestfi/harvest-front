import styled from 'styled-components'

const SocialsContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: calc(50% - 150px);
  right: 0;

  @media screen and (max-width: 1200px) {
    flex-direction: row;
    position: unset;
    margin-bottom: 40px;
  }

  z-index: 99999;
`

const Social = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 50px;
  text-decoration: none;
  color: black;
`

export { SocialsContainer, Social }

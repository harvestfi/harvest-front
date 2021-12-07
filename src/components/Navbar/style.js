import styled from 'styled-components'
import Button from '../Button/index'

const Container = styled.div`
  background-color: white;
`

const Layout = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1790px;
  margin: auto;
  padding: 25px;
  margin-bottom: 30px;

  @media screen and (max-width: 1200px) {
    padding: 10px 30px;
    flex-wrap: wrap;
    justify-content: ${props => (props.openHambuger ? 'flex-end' : 'space-between')};
    margin: 0;
    background-color: transparent;
    align-items: unset;
    overflow: overlay;
  }

  @media screen and (max-width: 400px) {
    padding: 10px;
  }
`

const LinksContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 10px auto;

  @media screen and (max-width: 1200px) {
    display: ${props => (props.openHambuger ? 'flex' : 'none')};
    margin: 100px 0 80px 0;
    grid-auto-columns: unset;
    flex-direction: column;
    align-items: baseline;
  }
`

const LinkContainer = styled.div`
  position: relative;

  @media screen and (min-width: 1200px) {
    display: ${props => (props.hideOnDesktop ? 'none' : 'flex')};
  }
`

const Link = styled.button`
  font-family: Montserrat;
  font-weight: 800;
  font-size: 16px;
  color: black;
  line-height: ${props => (props.subItem ? '22px' : '16px')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: #f2b435;
  border-style: solid;
  background-color: transparent;
  cursor: pointer;
  ${props =>
    props.active
      ? `
    opacity: 1;
    margin-bottom: -4px;
    border-width: 0 0 4px 0;
  `
      : `
    border-width: 0 0 0 0;
    opacity: 0.85;
  `}

  @media screen and (max-width: 1200px) {
    padding: 30px 0 20px 30px;
    ${props =>
      props.active
        ? `
        font-weight: bold;
        border-width: 0 0 0 4px;
    `
        : `
        font-weight: 500;
    `}
    color: white;
    display: ${props => (props.isDropdownLink ? 'none' : 'flex')};
  }

  &:hover {
    opacity: 1;
  }
`

const LogoContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 180px;
  left: 30px;
  z-index: 13;
  align-items: center;
  ${props =>
    props.openHambuger
      ? `
  position: absolute;
  justify-content: space-between;
  flex-direction: row-reverse;
  `
      : `
  justify-content:flex-start;
  `};

  a {
    display: inherit;
    align-items: inherit;
    text-decoration: none;
    font-weight: bold;
    font-size: 24px;

    &:after {
      display: block;
      content: 'Harvest';
    }

    img {
      margin-right: 10px;
    }
  }

  @media screen and (max-width: 1200px) {
    max-width: ${props => (props.openHambuger ? '230px' : '0')};

    a {
      &:after {
        display: ${props => (props.openHambuger ? 'block' : 'none')};
        content: 'Harvest';
      }

      img {
        width: 35px;
        height: 35px;
      }
    }
  }
`

const DropdownBox = styled.div`
  display: ${props => (props.open ? 'flex' : 'none')};
  flex-direction: column;
  top: 18px;
  position: absolute;
  padding: 10px;
  min-width: 60px;
  max-width: 120px;
  border: 2px solid black;
  border-radius: 8px;
  background-color: white;
  z-index: 10;

  span {
    display: block;
    text-align: center;
    text-decoration: underline;
    width: unset;
    height: unset;
    margin: unset;
  }

  @media screen and (max-width: 1200px) {
    display: none;
  }
`

const StatsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: #a9aeb3;
  filter: ${props => (props.openHambuger ? 'blur(5px)' : 'unset')};
  flex-basis: 575px;
  flex-direction: column;
  line-height: 1.22;

  b {
    font-family: Lato;
    font-size: 19px;
    margin-left: 10px;
    color: black;
  }

  @media screen and (max-width: 1200px) {
    flex-basis: 100%;
    justify-content: center;
    margin: 20px 0;
    line-height: 1.22;
    flex-direction: column;
    order: 3;
  }
`

const ConnectButton = styled(Button)`
  font-size: 16px;
  ${props =>
    props.openHambuger
      ? `
  filter: blur(5px);
  pointer-events: none;
  `
      : ``};

  img {
    margin-right: 12px;
  }
`

const HambugerIcon = styled.div`
  display: block;
  margin-right: ${props => (!props.openHambuger ? '20px' : '0')};

  @media screen and (min-width: 1200px) {
    display: none;
  }
`

const MiddleActionsContainer = styled.div`
  ${props =>
    props.openHambuger
      ? `
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    box-shadow: 20px 4px 80px rgb(0 0 0 / 20%);
    background-image: url(/static/media/background-sky.a3abb736.png),
      linear-gradient(179.64deg, #ffffff 0.32%, #0086c4 20.07%);
    max-width: 230px;
    background-size: cover;
    z-index: 10;
    overflow: scroll;
    padding: 30px;
    flex-direction: column;
    animation: fadeIn;
    animation-duration: 0.45s;
    `
      : `
      flex-basis: 520px;

      @media screen and (max-width: 1200px) {
       display: none;
      }
      `}
`

const InfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-width: 63%;
  align-items: center;

  @media screen and (max-width: 1305px) {
    &:first-child {
      min-width: unset;
      flex-direction: column;
    }
  }

  @media screen and (max-width: 1200px) {
    min-width: unset;
    flex-direction: column;

    b {
      margin: 0 0 10px 0;
    }
  }
`

const InfoLabel = styled.span`
  flex-basis: 30%;
  display: block;
`

export {
  Container,
  Layout,
  LinksContainer,
  LinkContainer,
  Link,
  LogoContainer,
  DropdownBox,
  StatsContainer,
  ConnectButton,
  HambugerIcon,
  MiddleActionsContainer,
  InfoContainer,
  InfoLabel,
}

import React, { useState, Fragment, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import CountUp from 'react-countup'
import { useWindowWidth } from '@react-hook/window-size'
import {
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
} from './style'
import { CURVE_APY, ROUTES } from '../../constants'
import { useWallet } from '../../providers/Wallet'
import Socials from '../Socials'
import logoNew from '../../assets/images/logos/tractor-new.svg'
import walletIcon from '../../assets/images/ui/wallet-icon.svg'
import { formatAddress, formatNumber } from '../../utils'
import AnimatedDots from '../AnimatedDots'
import { Monospace } from '../GlobalStyle'
import closeIcon from '../../assets/images/ui/close-icon.svg'
import openIcon from '../../assets/images/ui/open-icon.svg'
import { useStats } from '../../providers/Stats'

const navLinks = [
  {
    path: ROUTES.FARM,
    name: 'Farm',
  },
  {
    path: ROUTES.STATS,
    name: 'Stats',
    newTab: true,
  },
  {
    path: ROUTES.WORK,
    name: 'Work',
  },
  {
    path: ROUTES.VESTING,
    name: 'Vesting',
    newTab: true,
  },
  {
    path: '#',
    name: 'Help',
    subItems: [
      { path: ROUTES.AMPLIFARM, name: 'Booster' },
      { path: ROUTES.FAQ, name: 'FAQ' },
      { path: ROUTES.WIKI, newTab: true, name: 'Docs' },
      { path: ROUTES.WIKI_ZH, newTab: true, name: '策略' },
      { path: ROUTES.CLAIM_EXT, newTab: true, name: 'Grain' },
    ],
  },
]

const NavLink = ({ item, subItem, openHambuger, isDropdownLink }) => {
  const { push } = useHistory()
  const { pathname } = useLocation()

  return (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <Link
      onClick={() => {
        if (item.newTab) {
          window.open(item.path, '_blank')
        } else {
          push(item.path)
        }
        openHambuger(false)
      }}
      active={pathname === item.path}
      subItem={subItem}
      isDropdownLink={isDropdownLink}
    >
      {item.name}
    </Link>
  )
}

const Navbar = () => {
  const { account, connect } = useWallet()
  const { totalValueLocked, farmPrice } = useStats()
  const [openedDropdown, openDropdown] = useState(null)
  const [openedHambuger, openHambuger] = useState(null)
  const onlyWidth = useWindowWidth()

  useEffect(() => {
    if (onlyWidth >= 1200 && openedHambuger) {
      openHambuger(false)
    }
  }, [onlyWidth, openedHambuger])

  useEffect(() => {
    document.getElementsByTagName('body')[0].style.overflow = openedHambuger ? 'hidden' : 'unset'
    document
      .getElementById('page-content')
      .setAttribute(
        'style',
        `overflow: ${openedHambuger ? 'hidden' : 'unset'}; filter: ${
          openedHambuger ? 'blur(5px);' : 'unset;'
        }`,
      )
  }, [openedHambuger])

  const MemoizedCounter = React.memo(CountUp)
  const ratePerDay = Number(CURVE_APY) / 365 / 100

  return (
    <Container>
      <Layout openHambuger={openedHambuger}>
        <LogoContainer openHambuger={openedHambuger}>
          <HambugerIcon onClick={() => openHambuger(!openedHambuger)} openHambuger={openedHambuger}>
            <img src={openedHambuger ? closeIcon : openIcon} alt="Mobile  icon" />
          </HambugerIcon>
          <a href="/">
            <img src={logoNew} alt="Harvest" />
          </a>
        </LogoContainer>
        <MiddleActionsContainer openHambuger={openedHambuger}>
          <LinksContainer totalItems={navLinks.length} openHambuger={openedHambuger}>
            {navLinks.map(item => (
              <Fragment key={item.name}>
                <LinkContainer
                  onMouseOver={() => {
                    if (item.subItems && openedDropdown !== item.name) {
                      openDropdown(item.name)
                    } else {
                      openDropdown(null)
                    }
                  }}
                  onMouseOut={() => openDropdown(null)}
                >
                  <NavLink
                    item={item}
                    openHambuger={openHambuger}
                    isDropdownLink={item.path === '#'}
                  />
                  <DropdownBox open={openedDropdown === item.name}>
                    {item.subItems &&
                      item.subItems.map(subItem => (
                        <NavLink
                          key={subItem.name}
                          item={subItem}
                          subItem
                          openHambuger={openHambuger}
                        />
                      ))}
                  </DropdownBox>
                </LinkContainer>
                {item.subItems ? (
                  <LinkContainer hideOnDesktop>
                    {item.subItems.map(subItem => (
                      <NavLink
                        key={subItem.name}
                        item={subItem}
                        subItem
                        openHambuger={openHambuger}
                      />
                    ))}
                  </LinkContainer>
                ) : null}
              </Fragment>
            ))}
          </LinksContainer>
          <Socials />
        </MiddleActionsContainer>
        <StatsContainer openHambuger={openedHambuger}>
          <InfoContainer>
            <InfoLabel>Deposits:</InfoLabel>{' '}
            <b>
              {Number(totalValueLocked) === 0 ? (
                <AnimatedDots />
              ) : (
                <Monospace>
                  <MemoizedCounter
                    start={Number(totalValueLocked)}
                    end={Number(totalValueLocked) + Number(totalValueLocked) * Number(ratePerDay)}
                    separator=","
                    useEasing={false}
                    delay={0}
                    decimals={2}
                    duration={86400}
                  />{' '}
                  USD
                </Monospace>
              )}
            </b>
          </InfoContainer>
          <InfoContainer>
            <InfoLabel>FARM Price:</InfoLabel>
            <b>{farmPrice ? `${formatNumber(farmPrice, 2)} USD` : <AnimatedDots />}</b>
          </InfoContainer>
        </StatsContainer>
        <ConnectButton
          color={account ? 'secondary' : 'primary'}
          openHambuger={openedHambuger}
          onClick={() => connect(account)}
          minWidth="190px"
        >
          <img src={walletIcon} alt="Wallet icon" />{' '}
          {account ? <div>Connected {formatAddress(account)}</div> : <>Connect Wallet</>}
        </ConnectButton>
      </Layout>
    </Container>
  )
}

export default Navbar

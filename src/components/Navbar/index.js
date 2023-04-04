import { useWindowWidth } from '@react-hook/window-size'
import React, { Fragment, useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { useHistory, useLocation } from 'react-router-dom'
import logoNew from '../../assets/images/logos/tractor-new.svg'
import closeIcon from '../../assets/images/ui/close-icon.svg'
import openIcon from '../../assets/images/ui/open-icon.svg'
import walletIcon from '../../assets/images/ui/wallet-icon.svg'
import { CURVE_APY, ROUTES } from '../../constants'
import { useStats } from '../../providers/Stats'
import { useWallet } from '../../providers/Wallet'
import { isLedgerProvider } from '../../services/web3'
import { formatAddress, formatNumber } from '../../utils'
import AnimatedDots from '../AnimatedDots'
import { Monospace } from '../GlobalStyle'
import Socials from '../Socials'
import {
  ConnectButton,
  Container,
  DropdownBox,
  HambugerIcon,
  InfoContainer,
  InfoLabel,
  Layout,
  Link,
  LinkContainer,
  LinksContainer,
  LogoContainer,
  MiddleActionsContainer,
  StatsContainer,
} from './style'

const navLinks = [
  {
    path: ROUTES.FARM,
    name: 'Farm',
  },
  {
    path: ROUTES.FAQ,
    name: 'FAQ',
  },
  {
    path: ROUTES.WORK,
    name: 'Work',
  },
  {
    path: ROUTES.WIKI,
    name: 'Docs',
    newTab: true,
  },
  {
    path: ROUTES.WIKI_ZH,
    name: '策略',
    newTab: true,
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
        {!isLedgerProvider ? (
          <LogoContainer openHambuger={openedHambuger}>
            <HambugerIcon
              onClick={() => openHambuger(!openedHambuger)}
              openHambuger={openedHambuger}
            >
              <img src={openedHambuger ? closeIcon : openIcon} alt="Mobile  icon" />
            </HambugerIcon>
            <a href="/">
              <img src={logoNew} alt="Harvest" />
            </a>
          </LogoContainer>
        ) : (
          <LogoContainer>
            <img src={logoNew} alt="Harvest" />
          </LogoContainer>
        )}
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
        {!isLedgerProvider ? (
          <ConnectButton
            color={account ? 'secondary' : 'primary'}
            openHambuger={openedHambuger}
            onClick={() => connect(account)}
            minWidth="190px"
          >
            <img src={walletIcon} alt="Wallet icon" />{' '}
            {account ? <div>Connected {formatAddress(account)}</div> : <>Connect Wallet</>}
          </ConnectButton>
        ) : (
          <ConnectButton color={account ? 'secondary' : 'primary'} minWidth="190px">
            <img src={walletIcon} alt="Wallet icon" />{' '}
            {account ? <div>Connected {formatAddress(account)}</div> : <>Connect Wallet</>}
          </ConnectButton>
        )}
      </Layout>
    </Container>
  )
}

export default Navbar

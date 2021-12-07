import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import axios from 'axios'
import { get } from 'lodash'
import Navbar from './components/Navbar/index'
import Farm from './pages/Farm'
import Work from './pages/Work'
import FAQ from './pages/FAQ'
import { RESTRICTED_COUNTRIES, ROUTES } from './constants'
import { Body, GlobalStyle, WorkPageLink } from './components/GlobalStyle'
import Earn from './pages/Earn'
import Boost from './pages/Boost'
import Zapper from './pages/Zapper'
import Modal from './components/Modal'
import HeaderBanner from './components/HeaderBanner'
import Providers from './providers'

const RestrictCountries = () => {
  const [open, setOpen] = useState(false)
  const RCountriesAcknowledgedField = localStorage.getItem('RCountriesAcknowledged')

  useEffect(() => {
    const checkIPLocation = async () => {
      const geoResponse = await axios.get('https://geolocation-db.com/json/')
      const countryCode = get(geoResponse, 'data.country_code')

      if (RESTRICTED_COUNTRIES.includes(countryCode)) {
        setOpen(true)
      }
    }

    if (!RCountriesAcknowledgedField) {
      checkIPLocation()
    }
  }, [RCountriesAcknowledgedField])

  return (
    <>
      {RCountriesAcknowledgedField ? (
        <HeaderBanner>
          You indicated that you are not from a restricted country.{' '}
          <span
            role="tab"
            tabIndex={0}
            aria-hidden="true"
            style={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => {
              localStorage.removeItem('RCountriesAcknowledged')
              setOpen(true)
            }}
          >
            Click here for details
          </span>
        </HeaderBanner>
      ) : null}
      {!RCountriesAcknowledgedField ? (
        <Modal
          title="Warning"
          confirmationLabel="I confirm I am not subject to these restrictions"
          open={open}
          onClose={() => {
            localStorage.setItem('RCountriesAcknowledged', true)
            setOpen(false)
          }}
        >
          Due to regulatory uncertainty, <b>Harvest</b> is not available to people or companies who
          are residents in the <b>United States</b> or a restricted territory, or are subject to
          other restrictions.
        </Modal>
      ) : null}
    </>
  )
}

const App = () => (
  <Router>
    <GlobalStyle />
    <ToastContainer />
    <Providers>
      <RestrictCountries />
      <Navbar />
      <Body id="page-content">
        <Switch>
          <Route exact path={ROUTES.FARM} component={Farm} />
          <Route exact path={ROUTES.EARN} component={Earn} />
          <Route path={ROUTES.FAQ} component={FAQ} />
          <Route path={ROUTES.WORK} component={Work} />
          <Route path={ROUTES.AMPLIFARM} component={Boost} />
          <Route path={ROUTES.ZAPPER} component={Zapper} />
        </Switch>
      </Body>
    </Providers>
    <WorkPageLink href="/work" />
  </Router>
)

export default App

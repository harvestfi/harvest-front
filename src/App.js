import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/Navbar/index'
import Farm from './pages/Farm'
import Work from './pages/Work'
import FAQ from './pages/FAQ'
import { ROUTES } from './constants'
import { Body, GlobalStyle } from './components/GlobalStyle'
import Boost from './pages/Boost'
import Modal from './components/Modal'
import Providers from './providers'

const ExperimentalSoftware = () => {
  const [open, setOpen] = useState(false)
  const ExperimentalSoftwareAcknowledgedField = localStorage.getItem(
    'ExperimentalSoftwareAcknowledged',
  )

  useEffect(() => {
    if (!ExperimentalSoftwareAcknowledgedField) {
      setOpen(true)
    }
  }, [ExperimentalSoftwareAcknowledgedField])

  return (
    <>
      {!ExperimentalSoftwareAcknowledgedField ? (
        <Modal
          title="Warning"
          confirmationLabel="I certify that I read and agree with this warning"
          open={open}
          onClose={() => {
            localStorage.setItem('ExperimentalSoftwareAcknowledged', true)
            setOpen(false)
          }}
        >
          <p>
            Due to regulatory uncertainty, <b>Harvest Finance</b> is not available to people or
            companies, who are residents in the <b>United States</b> or other restricted territory,
            or who are subject to other restrictions.
          </p>
          <p>
            By interacting with the Harvest Finance website and/or smart contracts, the user
            acknowledges the experimental nature of yield farming with Harvest Finance, its
            dependency on 3rd party protocols, and{' '}
            <b>the potential for total loss of funds deposited.</b> The user accepts full liability
            for their usage of Harvest Finance, and no financial responsibility is placed on the
            protocol developers and contributors.
          </p>
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
      <ExperimentalSoftware />
      <Navbar />
      <Body id="page-content">
        <Switch>
          <Route exact path={ROUTES.FARM} component={Farm} />
          <Route path={ROUTES.FAQ} component={FAQ} />
          <Route path={ROUTES.WORK} component={Work} />
          <Route path={ROUTES.AMPLIFARM} component={Boost} />
        </Switch>
      </Body>
    </Providers>
  </Router>
)

export default App

require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const path = require('path')

const builtDirectory = path.join(__dirname, 'build')
const PORT = process.env.PORT || '5000'
const app = express()

app.disable('x-powered-by')
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
    // contentSecurityPolicy: {
    //   directives: {
    //     frameAncestors: ['https://dapp-browser.apps.ledger.com'],
    //     'script-src': ["'self'", 'data:', 'cdn.usefathom.com', "'unsafe-inline'"],
    //   },
    // },
    // frameguard: false,
  }),
)
app.use(express.static(builtDirectory))
app.get('*', (req, res) => res.sendFile(path.join(builtDirectory, 'index.html')))
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

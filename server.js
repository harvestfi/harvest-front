const express = require('express')
const https = require('https')
const http = require('http')
const helmet = require('helmet')
const path = require('path')

const builtDirectory = path.join(__dirname, 'prod')
const app = express()

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        frameAncestors: ['https://dapp-browser.apps.ledger.com'],
      },
    },
    frameguard: false,
  }),
)

app.use(express.static(builtDirectory))
app.get('*', (req, res) => res.sendFile(path.join(builtDirectory, 'index.html')))

const httpsPort = process.env.HTTPS_PORT || 443
const httpPort = process.env.HTTP_PORT || 80

const server = https.createServer(
  {
    cert: process.env.ORIGIN_SERVER_CERT?.replace(/\n/g, '\n'),
    key: process.env.ORIGIN_SERVER_KEY?.replace(/\n/g, '\n'),
    ca: process.env.ORIGIN_SERVER_CA?.replace(/\n/g, '\n'),
    requestCert: true,
    rejectUnauthorized: true,
  },
  app,
)

http
  .createServer((req, res) => {
    res.writeHead(301, {
      Location: `https://${req.headers.host}${req.url}`,
    })
    res.end()
  })
  .listen(httpPort, () => console.log(`HTTP->HTTPS Redirect is ready on port ${httpPort}`))

server.listen(httpsPort, () => console.log(`Server started on port ${httpsPort}`))

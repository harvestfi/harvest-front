const express = require('express')
const helmet = require('helmet')
const path = require('path')

const builtDirectory = path.join(__dirname, 'build')
const builtDirectory = path.join(__dirname, 'prod')
const PORT = process.env.PORT || '5000'
const app = express()

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        frameAncestors: ['https://dapp-browser.apps.ledger.com'],
      },
    },
    frameguard: false,  }),
)
app.use(express.static(builtDirectory))
app.get('*', (req, res) => res.sendFile(path.join(builtDirectory, 'index.html')))
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

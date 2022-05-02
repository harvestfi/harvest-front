const {
  addBabelPlugins,
  addWebpackPlugin,
  override,
  setWebpackOptimizationSplitChunks,
} = require('customize-cra')
const PrebuildPlugin = require('prebuild-webpack-plugin')
const fs = require('fs-extra')
const { tokens, pools } = require('../src/data')
const { formatItems, saveFormattedData } = require('./utils.js')

const isDevMode = process.env.NODE_ENV === 'development'
const publicDir = `${isDevMode ? 'public' : 'build'}`

const fetchIconsFromAPI = () => {
  console.log(`Copying icons from harvest-api repo into ./${publicDir}/icons...`)
  fs.copy('./src/data/harvest-api/data/icons', `./${publicDir}/icons`).catch(err =>
    console.error(err),
  )
}

const generateVaultsAndPoolsData = () => {
  console.log('Generating tokens list...')
  const formattedTokens = formatItems(tokens, [
    'pricesInfo',
    'hideFarmSymbol',
    'hideNativeApy',
    'hideFarmApy',
    'hideTokenApy',
    'hideiFarmSymbol',
    'testInactive',
    'disableAutoSwap',
    'fake',
    'disabledDepositTooltip',
    'disabledWithdrawTooltip',
    'rowTooltip',
    'disableVaultPanel',
  ])
  saveFormattedData(formattedTokens, `./${publicDir}/data/tokens.json`)

  console.log('Generating pools list...')
  const formattedPools = formatItems(pools, [
    'stakeAndDepositHelpMessage',
    'info',
    'watchAsset',
    'hideFarmApy',
    'hideNativeApy',
    'rewardAPY',
    'rewardAPR',
  ])
  saveFormattedData(formattedPools, `./${publicDir}/data/pools.json`)
}

module.exports = override(
  setWebpackOptimizationSplitChunks({
    chunks: 'all',
    minSize: 30000,
    maxSize: 500000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10,
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true,
      },
    },
  }),
  ...addBabelPlugins([
    'babel-plugin-styled-components',
    {
      displayName: false,
      namespace: 'hv',
    },
  ]),
  addWebpackPlugin(
    new PrebuildPlugin({
      build: () => {
        fetchIconsFromAPI()
        generateVaultsAndPoolsData()
      },
      watch: () => {
        fetchIconsFromAPI()
        generateVaultsAndPoolsData()
      },
      files: { pattern: '**/src/data/**', options: {}, addFilesAsDependencies: true },
    }),
  ),
)

import React from 'react'
import defiPulseLogo from './assets/images/logos/defi-pulse.png'
import deBankLogo from './assets/images/logos/debank.svg'
import defiPrimeLogo from './assets/images/logos/defiprime.png'
import zapperFiLogo from './assets/images/logos/zapperfi.png'
import coingeckoLogo from './assets/images/logos/coingecko.png'
import okLinkLogo from './assets/images/logos/oklink.png'
import peckshieldLogo from './assets/images/logos/peckshield.png'
import haechiLogo from './assets/images/logos/haechi.png'
import certikLogo from './assets/images/logos/certik.png'
import leastAuthorityLogo from './assets/images/logos/least-authority.png'

import builderIcon from './assets/images/work/builder.svg'
import rangerIcon from './assets/images/work/ranger.svg'
import yeomanIcon from './assets/images/work/yeoman.svg'
import artisanIcon from './assets/images/work/artisan.svg'
import craftsmanIcon from './assets/images/work/craftsman.svg'
import gardenerIcon from './assets/images/work/gardener.svg'
import cultivatorIcon from './assets/images/work/cultivator.svg'
import { addresses } from './data'

export const HARVEST_LAUNCH_DATE = new Date(1598986800000)

export const SOCIAL_LINKS = {
  TELEGRAM: 'https://t.me/Breadforthepeople',
  TWITTER: 'https://twitter.com/harvest_finance',
  MEDIUM: 'https://medium.com/harvest-finance',
  DISCORD: 'https://discord.gg/gzWAG3Wx7Y',
  REDDIT: 'https://www.reddit.com/r/HarvestFinance/',
  GITHUB: 'https://github.com/harvest-finance',
  WIKI: 'https://harvest-finance.gitbook.io/harvest-finance',
  WIKI_CHINEESE: 'https://farm.chainwiki.dev/zh/%E7%AD%96%E7%95%A5',
  AUDITS: 'https://github.com/harvest-finance/harvest/tree/master/audits',
  BUG_BOUNTY: 'https://immunefi.com/bounty/harvest/',
}

export const ROUTES = {
  FARM: '/',
  AMPLIFARM: '/amplifarm',
  EARN: '/earn',
  WORK: '/work',
  POOL: '/pool',
  FAQ: '/faq',
  ZAPPER: '/zapper',
  ARBITRUM: 'https://harvest.dolomite.io/',
  VESTING: 'https://vest.harvest.finance/',
  WIKI: 'https://harvest-finance.gitbook.io/harvest-finance/',
  WIKI_ZH: 'https://farm.chainwiki.dev/zh/%E7%AD%96%E7%95%A5',
  CLAIM_EXT: 'https://claim.harvest.finance',
  STATS: 'https://farmdashboard.xyz',
}

export const KEY_CODES = {
  MINUS: 189,
  E: 69,
}

export const POLL_BALANCES_INTERVAL_MS = 2000
export const POLL_POOL_DATA_INTERVAL_MS = window.ethereum ? 900000 : 36000000
export const POLL_POOL_USER_DATA_INTERVAL_MS = 2000
export const POLL_BOOST_USER_DATA_INTERVAL_MS = 5000

export const INFURA_URL = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
export const BSC_URL = 'https://bsc-dataseed2.defibit.io'
export const MATIC_URL = `https://polygon-mainnet.infura.io/v3/${process.env.REACT_APP_MATIC_INFURA_KEY}`

export const ETHERSCAN_URL = 'https://etherscan.io'

export const BSCSCAN_URL = 'https://bscscan.com'

export const MATICSCAN_URL = 'https://polygonscan.com'

export const DECIMAL_PRECISION = 2

export const FAQ_ITEMS = [
  {
    question: 'What is Harvest?',
    answer: (
      <>
        Harvest is an international cooperative of humble farmers pooling resources together in
        order to earn DeFi yields.
        <br />
        <br />
        When farmers deposit, Harvest automatically farms the <b>highest yields</b> with these
        deposits using the <b>latest farming techniques.</b>
      </>
    ),
  },
  {
    question: 'Why Harvest?',
    answer: (
      <>
        <ul>
          <li style={{ marginBottom: '20px' }}>
            Farming was highly manual and inconvenient for people that had a normal job and didn’t
            want to keep up with DeFi 24/7. We automate farming by doing regular harvesting of crops
            on <a href="https://harvest.finance">over 100</a> different farms.
          </li>
          <li style={{ marginBottom: '20px' }}>
            Manual farming is very expensive because gas prices are really high. We’ve saved{' '}
            <b>over $50m</b> in gas costs for our users via automation.
          </li>
        </ul>
      </>
    ),
  },
  {
    question: 'How to use Harvest?',
    answer: (
      <>
        The following community-made video explains how to deposit USDC for farming on Harvest.
        <br />
        <br />
        <iframe
          title="tutorial"
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/9kxPiPj9sFc"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </>
    ),
  },

  {
    question: 'What are FARM, iFARM, and bFARM?',
    answer: (
      <>
        Both <b>FARM</b> and <b>iFARM</b> are ERC-20 tokens on Ethereum.
        <br />
        <br />
        <ul>
          <li>
            <a
              href="https://www.coingecko.com/en/coins/harvest-finance"
              target="_blank"
              rel="noopener noreferrer"
            >
              FARM
            </a>{' '}
            is a cashflow token for Harvest. It is available on{' '}
            <a
              href={`https://app.bancor.network/eth/swap?from=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&to=${addresses.FARM}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Bancor
            </a>
            .
          </li>

          <li>
            <a
              href="https://etherscan.io/token/0x1571eD0bed4D987fe2b498DdBaE7DFA19519F651"
              target="_blank"
              rel="noopener noreferrer"
            >
              iFARM
            </a>{' '}
            is a yield-bearing token for Harvest. It can be acquired by depositing into FARM on the
            front page with <b>Use iFARM</b> checkbox.
          </li>
        </ul>
        <br />
        <a
          href="https://bscscan.com/token/0x4B5C23cac08a567ecf0c1fFcA8372A45a5D33743"
          target="_blank"
          rel="noopener noreferrer"
        >
          bFARM
        </a>{' '}
        is the equivalent of FARM on Binance Smart Chain. bFARM can be swapped to FARM and back
        using{' '}
        <a href="https://anyswap.exchange/bridge" target="_blank" rel="noopener noreferrer">
          Anyswap bridge
        </a>
      </>
    ),
  },
  {
    question: 'What are fDAI, fUSDC, and fWBTC?',
    answer: (
      <>
        <b>fDAI</b>, <b>fUSDC</b>, <b>fWBTC</b>, and other <i>f-tokens</i> are the yield-bearing
        versions of the corresponding assets which are being automatically farmed by Harvest. When
        Harvest generates yields, 70% of these yields are used to increase the value of these
        tokens.
        <br />
        You can redeem them at any time for <b>DAI</b>, <b>USDC</b>, <b>WBTC</b>, and so on.
      </>
    ),
  },
  {
    question: 'How does the FARM Pool work?',
    answer: (
      <>
        <a
          href="https://www.coingecko.com/en/coins/harvest-finance"
          target="_blank"
          rel="noopener noreferrer"
        >
          FARM
        </a>{' '}
        is a cashflow token for Harvest. When Harvest generates yields, 70% of these yields are used
        to increase the value of the deposits. The other 30% are converted into <b>FARM</b> tokens
        which are used for:
        <br />
        <br />
        <ul>
          <li>Rewarding farmers who staked their FARM into the FARM pool on the front page.</li>
          <li>
            Increasing the value of <b>iFARM</b> - the <b>yield-bearing FARM</b>. iFARM is using the
            FARM pool under the hood.
          </li>
        </ul>
        <br />
        In addition, the FARM pool also receives weekly FARM emissions from the total supply of
        690,420. For detailed mechanics of FARM and the FARM pool, you can{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href=" https://redmption.medium.com/flight-of-the-aggregator-1a687a1662ed"
        >
          read more here.
        </a>
      </>
    ),
  },
  {
    lazyRender: false,
    question: 'What are the token economics for FARM?',
    answer: (
      <ul>
        <li style={{ marginBottom: '20px' }}>
          FARM holders receive cashflow as described in the section above.
        </li>
        <li style={{ marginBottom: '20px' }}>
          Circulating supply at launch: <b>0</b>.
        </li>
        <li style={{ marginBottom: '20px' }}>
          FARM has a current circulating supply of <b id="total-supply">...</b>.
        </li>
        <li style={{ marginBottom: '20px' }}>
          FARM has a total supply over 4 years of <b>690,420.</b>
        </li>
        <li>Harvest was completely bootstrapped, with no VCs and no premine.</li>
      </ul>
    ),
  },
  {
    question: 'Is Harvest audited?',
    answer: (
      <>
        <ul>
          <li style={{ marginBottom: '20px' }}>
            The Harvest smart contracts have been designed from the ground up with security in mind,
            by using as many audited components as possible. Please review the smart contracts
            before depositing funds.
          </li>
          <li style={{ marginBottom: '20px' }}>
            The Harvest smart contracts are{' '}
            <a target="_blank" rel="noopener noreferrer" href={SOCIAL_LINKS.GITHUB}>
              here
            </a>
            , and audit reports are{' '}
            <a target="_blank" rel="noopener noreferrer" href={SOCIAL_LINKS.AUDITS}>
              here.
            </a>
          </li>
          <li style={{ marginBottom: '20px' }}>
            We would like to thank Least Authority, Haechi, Peckshield and CertiK for their hard
            work on the audits.
          </li>
        </ul>
        <div style={{ marginTop: 10 }} />
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '40px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
            justifyContent: 'center',
            gridGap: 40,
          }}
        >
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://leastauthority.com/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              height: '136px',
            }}
          >
            <img src={leastAuthorityLogo} alt="LeastAuthority" style={{ width: '135px' }} />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://certik.io/security-audits/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              height: '136px',
            }}
          >
            <img src={certikLogo} alt="CertiK" style={{ width: '135px' }} />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://peckshield.com/en"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              height: '136px',
            }}
          >
            <img src={peckshieldLogo} alt="Peckshield" style={{ width: '135px' }} />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://haechi.io/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FFFFFF',
              borderRadius: '20px',
              width: '100%',
              height: '136px',
            }}
          >
            <img src={haechiLogo} alt="Haechi" style={{ width: '135px' }} />
          </a>
        </div>
      </>
    ),
  },
  {
    question: 'What is the road map for Harvest?',
    answer: `Yield farming is not going away, and gas prices are not getting lower. Our goal is to
          simply provide an easy way for people to benefit, and make your hard work much easier,
          while looking for safe projects to add to the farming repertoire.`,
  },
  {
    question: 'Acknowledgements',
    answer: (
      <>
        Thanks to the hundreds of contributors, builders, and mods for actively working on this
        farming cooperative iterative experiment together, thank you!
      </>
    ),
  },
  {
    question: 'Where can I learn more about Harvest?',
    answer: (
      <span>
        <span role="img" aria-label="emoji">
          👩‍🌾
        </span>{' '}
        The Harvest Community Documentation has a wealth of up-to-date information <br />
        <a target="_blank" rel="noopener noreferrer" href={SOCIAL_LINKS.WIKI}>
          {SOCIAL_LINKS.WIKI}
        </a>
      </span>
    ),
  },
  {
    question: 'Links',
    answer: (
      <ul style={{ wordBreak: 'break-word' }}>
        <li style={{ marginBottom: 20 }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={SOCIAL_LINKS.GITHUB}
            style={{ marginRight: 20, display: 'inline-block' }}
          >
            GitHub
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={SOCIAL_LINKS.TWITTER}
            style={{ marginRight: 20, display: 'inline-block' }}
          >
            Twitter
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={SOCIAL_LINKS.DISCORD}
            style={{ marginRight: 20, display: 'inline-block' }}
          >
            Discord
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={SOCIAL_LINKS.MEDIUM}
            style={{ marginRight: 20, display: 'inline-block' }}
          >
            Medium
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={SOCIAL_LINKS.REDDIT}
            style={{ wordBreak: 'initial' }}
          >
            Reddit
          </a>
        </li>
        <li style={{ marginBottom: 20 }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={SOCIAL_LINKS.WIKI}
            style={{ marginRight: 20 }}
          >
            Wiki
          </a>
          <a target="_blank" rel="noopener noreferrer" href={SOCIAL_LINKS.WIKI_CHINEESE}>
            策略
          </a>
        </li>
        <li style={{ marginBottom: 20 }}>
          <a target="_blank" rel="noopener noreferrer" href={SOCIAL_LINKS.AUDITS}>
            Audits
          </a>
        </li>
        <li style={{ marginBottom: 20 }}>
          <a target="_blank" rel="noopener noreferrer" href={SOCIAL_LINKS.BUG_BOUNTY}>
            Security Bug Bounty
          </a>
        </li>
      </ul>
    ),
  },
  {
    question: 'Harvest is proud to be listed on:',
    answer: (
      <div
        style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          justifyContent: 'center',
          gridGap: 40,
        }}
      >
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://defipulse.com/harvest-finance"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFFFFF',
            borderRadius: '20px',
            height: '136px',
          }}
        >
          <img src={defiPulseLogo} alt="DeFi Pulse" style={{ width: '230px' }} />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://debank.com/projects/harvest"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFFFFF',
            borderRadius: '20px',
            height: '136px',
          }}
        >
          <img src={deBankLogo} alt="DeBank" style={{ width: '230px' }} />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.oklink.com/eth/defi-detail/Harvest"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFFFFF',
            borderRadius: '20px',
            height: '136px',
          }}
        >
          <img src={okLinkLogo} alt="OkLink" style={{ width: '200px' }} />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://defiprime.com/product/harvest"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFFFFF',
            borderRadius: '20px',
            height: '136px',
          }}
        >
          <img src={defiPrimeLogo} alt="Defi Prime" style={{ width: '230px' }} />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.coingecko.com/en/coins/harvest-finance"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFFFFF',
            borderRadius: '20px',
            height: '136px',
          }}
        >
          <img src={coingeckoLogo} alt="Coingecko" style={{ width: '230px' }} />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://zapper.fi/"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFFFFF',
            borderRadius: '20px',
            height: '136px',
          }}
        >
          <img src={zapperFiLogo} alt="Zapper" style={{ width: '230px' }} />
        </a>
      </div>
    ),
  },
  {
    question: 'Disclaimer',
    answer: (
      <div>
        The stated APR/APY (the &apos;Rate&apos;) is denominated in terms of relevant underlying
        tokens in the vaults. The Rate is a forward-looking projection based on our good faith
        belief of how to reasonably project results over the relevant period, but such belief is
        subject to numerous assumptions, risks and uncertainties (including smart contract security
        risks and third-party actions) which could result in a materially different (lower or
        higher) token-denominated APR/APY. The Rate is not a promise, guarantee or undertaking on
        the part of any person or group of persons, but depends entirely on the results of operation
        of smart contracts and other autonomous systems (including third-party systems) and how
        third parties interact with those systems after the time of your deposit. Even if the Rate
        is achieved as projected, you may still suffer a financial loss in fiat-denominated terms if
        the fiat-denominated value of the relevant tokens (your deposit and any tokens allocated or
        distributed to you pursuant to the Rate) declines during the deposit period.
      </div>
    ),
  },
]

export const CURVE_APY = 79.02

export const HARVEST_API_URL =
  process.env.REACT_APP_HARVEST_API_URL || 'https://api-ui.harvest.finance'

export const HARVEST_EXTERNAL_API_URL =
  process.env.REACT_APP_HARVEST_EXTERNAL_API_URL || 'https://api.harvest.finance'

export const TOKEN_STATS_API_ENDPOINT = `${HARVEST_EXTERNAL_API_URL}/token-stats?key=${process.env.REACT_APP_EXTERNAL_API_KEY}`
export const POOLS_API_ENDPOINT = `${HARVEST_API_URL}/pools?key=${process.env.REACT_APP_API_KEY}`
export const VAULTS_API_ENDPOINT = `${HARVEST_API_URL}/vaults?key=${process.env.REACT_APP_API_KEY}`
export const REVENUE_MONTHLY_API_ENDPOINT = `${HARVEST_EXTERNAL_API_URL}/revenue/monthly?key=${process.env.REACT_APP_EXTERNAL_API_KEY}`
export const CMC_API_ENDPOINT = `${HARVEST_EXTERNAL_API_URL}/cmc?key=${process.env.REACT_APP_EXTERNAL_API_KEY}`

export const POOL_BALANCES_DECIMALS = 9

export const MIGRATING_VAULTS = []

export const FARM_TOKEN_SYMBOL = 'FARM'
export const FARM_USDC_TOKEN_SYMBOL = 'UNI_FARM_USDC'
export const FARM_WETH_TOKEN_SYMBOL = 'FARM_WETH_LP'
export const FARM_GRAIN_TOKEN_SYMBOL = 'FARM_GRAIN_LP'
export const IFARM_TOKEN_SYMBOL = 'IFARM'
export const BFARM_TOKEN_SYMBOL = 'bFARM'
export const MIFARM_TOKEN_SYMBOL = 'miFARM'
export const FARMSTEAD_USDC_TOKEN_SYMBOL = 'FARMSteadUSDC'
export const AMPLIFARM_TOKEN_SYMBOL = 'ampliFARM'

export const SPECIAL_VAULTS = {
  NEW_PROFIT_SHARING_POOL_ID: 'profit-sharing-farm',
  FARM_WETH_POOL_ID: 'farm-weth',
  FARM_GRAIN_POOL_ID: 'farm-grain',
  FARM_USDC_POOL_ID: 'uni-farm-usdc',
  FARMSTEAD_USDC_POOL_ID: 'farmstead-usdc',
}

export const DISABLED_DEPOSITS = [
  '1INCH-ETH-DAI',
  '1INCH-ETH-USDT',
  '1INCH-ETH-USDC',
  '1INCH-ETH-WBTC',
]
export const DISABLED_WITHDRAWS = []

export const MINIMUM_DEPOSIT_AUTOFILL_AMOUNT_USD = 5

export const POOL_DETAILS_ACTIONS = {
  STAKE: 1,
  STAKE_WITH_AUTOSTAKING: 2,
  WITHDRAW_ALL: 3,
  WITHDRAW_ALL_WITH_AUTOSTAKING: 4,
  CLAIM_ALL: 5,
}

export const MAX_APY_DISPLAY = 10000

export const DEGEN_WARNING_TOOLTIP_TEXT = (
  <>
    Chad embodies the animal spirits of Degens. These pools may be more volatile. <b>doHardWork</b>{' '}
    helps to auto-harvest these pools for you, saving you gas.
  </>
)

export const ACTIONS = {
  DEPOSIT: 0,
  CLAIM: 1,
  EXIT: 2,
  WITHDRAW: 3,
  STAKE: 4,
  APPROVE_DEPOSIT: 5,
  APPROVE_STAKE: 6,
  APPROVE_MIGRATE: 7,
  STAKE_MIGRATE: 8,
  MIGRATE: 9,
  REDEEM: 10,
}

export const PANEL_ACTIONS_TYPE = {
  HEAD: 0,
  BODY: 1,
  FOOTER: 2,
  MIGRATE: 3,
  UNIV3MANAGED: 4,
}

export const IFARM_DEPOSIT_TOOLTIP = (
  <>
    When unchecked, <b>FARM</b> is deposited into <b>FARM</b> Pool directly.
    <br /> When checked, <b>FARM</b> is converted into <b>iFARM</b>: the interest-bearing{' '}
    <b>FARM</b> which grows in value over time
  </>
)
export const IFARM_WITHDRAW_TOOLTIP = (
  <>
    If you own <b>iFARM</b>, check to withdraw from the <b>iFARM</b> vault.
    <br /> Uncheck to withdraw all <b>FARM</b> staked into <b>FARM Pool</b> directly
  </>
)

export const SPECIAL_REWARD_TOKENS = []

export const DEFAULT_CLAIM_HELP_MESSAGES = {
  FARM: (
    <div className="help-message">
      <b>Claim rewards:</b>
      <ol className="numeric-list">
        <li>
          Hit &quot;Claim rewards&quot; to claim your <b>FARM</b>
        </li>
        <li>
          To earn additional interest on your <b>FARM</b>, stake your claimed <b>FARM</b> into the{' '}
          <b>FARM</b> pool. We recommend claiming and re-staking your <b>FARM</b> rewards into the{' '}
          <b>FARM</b> pool periodically (for example, weekly)
        </li>
      </ol>
    </div>
  ),
  MIGRATED_TO_HODL: (
    <div className="help-message">
      <b>Claim rewards:</b>
      <ol className="numeric-list">
        <li>
          Hit &quot;Claim FARM&quot; to claim your <b>FARM</b>
        </li>
        <li>
          To earn additional interest on your <b>FARM</b>, stake your claimed <b>FARM</b> into the{' '}
          <b>FARM</b> pool. We recommend claiming and re-staking your <b>FARM</b> rewards into the{' '}
          <b>FARM</b> pool periodically (for example, weekly)
        </li>
      </ol>
    </div>
  ),
  IFARM: (
    <div className="help-message">
      <b>Claim rewards:</b>
      <ol className="numeric-list">
        <li>
          Hit &quot;Claim rewards&quot; to claim your <b>iFARM</b>
        </li>
        <li>
          Your <b>iFARM</b> earns interest automatically, you do not need to stake it
        </li>
      </ol>
    </div>
  ),
  HODL: (
    <div className="help-message">
      <b>Claim rewards:</b>
      <ol className="numeric-list">
        <li>
          Hit &quot;Claim rewards&quot; to claim your <b>iFARM</b> and <b>fSUSHI</b>
        </li>
        <li>
          To redeem <b>fSUSHI</b> for <b>SUSHI</b>, withdraw from the <b>SUSHI</b> vault on the same
          page
        </li>
      </ol>
    </div>
  ),
  bFARM: (
    <div className="help-message">
      <b>Claim rewards:</b>
      <ol className="numeric-list">
        <li>
          Hit &quot;Claim rewards&quot; to claim your <b>bFARM</b>
        </li>
        <li>
          To earn additional interest on your <b>bFARM</b>, you can bridge <b>bFARM</b> into{' '}
          <b>FARM</b> using{' '}
          <a href="https://anyswap.exchange/bridge" target="_blank" rel="noopener noreferrer">
            Anyswap
          </a>{' '}
          and stake it into the <b>FARM</b> pool. We recommend doing so periodically (for example,
          weekly)
        </li>
      </ol>
    </div>
  ),
  miFARM: (
    <div className="help-message">
      <b>Claim rewards:</b>
      <ol className="numeric-list">
        <li>
          Hit &quot;Claim rewards&quot; to claim your <b>miFARM</b>
        </li>
        <li>
          Your <b>miFARM</b> earns interest automatically, you do not need to stake it
        </li>
      </ol>
    </div>
  ),
}

export const isDebugMode = process.env.REACT_APP_MODE === 'debug'

export const WORK_CHARACTERS = [
  {
    gridPosition: 'a',
    title: 'BUILDER',
    subtitle: '(ENGINEERS/DEVELOPERS)',
    icon: builderIcon,
    description: `As a Builder, you’re willing to get your hands dirty to keep our farming infrastructure in top condition. Hit up the task board to get a notion of which fields to plow, machines to repair, sheds to thatch up, and so on. Don’t forget your toolkit as you head on out to help develop our growing farm.`,
  },
  {
    gridPosition: 'b',
    icon: rangerIcon,
    title: 'RANGER',
    subtitle: '(SECURITY/STRATEGY)',
    description: `Far from the commotion of farmers celebrating after a long day’s work, beyond the greedy gaze of bandits lurking in the woods, the Ranger keep their ceaseless watch. If you’re the first to step up for the farm’s most vital tasks, like protecting our perimeter or selecting which crops to bring to market, then a Ranger's white hat just might fit you.`,
  },
  {
    gridPosition: 'c',
    icon: yeomanIcon,
    title: 'YEOMAN',
    subtitle: '(BUSINESS OPS/DEVELOPMENT)',
    description: `Whether it means getting down in the mud with the team or shaking hands with a neighbour, a Yeoman knows exactly what it takes to run a successful farm. You have a way with people, and an extensive knowledge of the farming community past our borders. When a deal needs to be struck with another farm, you’ll be among the first we holler for.`,
  },
  {
    gridPosition: 'd',
    icon: artisanIcon,
    title: 'ARTISAN',
    subtitle: '(DESIGNER/CREATIVE)',
    description: `For an Artisan, no farm is complete without a fresh coat of paint. You have an eye for design, and can turn any old barn into a palace of wonder. On top of making things look pretty, you’re a natural at creating signage to make our farm an easier place to navigate.`,
  },
  {
    gridPosition: 'e',
    icon: craftsmanIcon,
    title: 'CRAFTSMAN',
    subtitle: '(DESIGNER/DEVELOPER)',
    description:
      'Regardless of which discipline they took up first, Craftsman are united in their boundless creativity and in-depth knowledge of farming development. While one farmer can retool a shed and another can give it a paint job, as a Craftsman you know how to do both. For you, a hammer and a paint roller both belong in the same kit.',
  },
  {
    gridPosition: 'f',
    icon: gardenerIcon,
    title: 'GARDENER',
    subtitle: '(COMMUNITY MANAGER)',
    description: `A Gardener is at the heart of every farming community. Word of your bountiful harvests bring in traders and wanderers from far and wide. You can sense when morale is low amongst our farmers and, as a result, you know precisely when to schedule the next festive gathering to keep our spirits high.`,
  },
  {
    gridPosition: 'g',
    icon: cultivatorIcon,
    title: 'CULTIVATOR',
    subtitle: '(TRANSLATOR)',
    description: `Cultivators pick up new languages as frequently as most other farmers pick up crops. Whether it's translating tomes of knowledge or scribing announcements in other tongues, you’ll use your gifts to keep every farmer on equal footing. Above all else, you want to build a community where farmers feel welcome regardless of their origin.`,
  },
]

export const UNIV3_TOLERANCE = 150
export const UNIV3_SLIPPAGE_TOLERANCE = 0.95

export const BOOST_PANEL_MODES = {
  STAKE: 0,
  UNSTAKE: 1,
  REDEEM: 2,
}

export const AUDIT_FILE_LINKS = {
  LEAST_AUTHORITY:
    'https://github.com/harvest-finance/harvest/blob/master/audits/LeastAuthority-Harvest.pdf',
  CERTIK: 'https://github.com/harvest-finance/harvest/blob/master/audits/CertiK-Harvest.pdf',
  HAECHI: 'https://github.com/harvest-finance/harvest/blob/master/audits/Haechi-Harvest.pdf',
  PECKSHIELD:
    'https://github.com/harvest-finance/harvest/blob/master/audits/PeckShield-Harvest.pdf',
}

export const ZAPPER_FI_ZAP_IN_ENDPOINT = 'https://api.zapper.fi/v1/zap-in/harvest'

export const UNIV3_POOL_ID_REGEX = '[uU]ni[vV]3'

export const RESTRICTED_COUNTRIES = ['US']

export const MIGRATION_STEPS = {
  UNSTAKE: 0,
  APPROVE: 1,
  MIGRATE: 2,
}

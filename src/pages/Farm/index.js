import React from 'react'
import { find, get } from 'lodash'
import BigNumber from 'bignumber.js'
import CountUp from 'react-countup'
import Countdown from 'react-countdown'
import ReactTooltip from 'react-tooltip'
import {
  FarmContainer,
  FarmStatsContainer,
  FarmSubTitle,
  FarmAuditsContainer,
  FarmAnnouncementsContainer,
  FarmAuditsLogosContainer,
  FarmAnnouncement,
  StatsBox,
  StatsContainer,
  StatsTooltip,
  EmissionsCountdownText,
  StatsBoxTitle,
  StatsContainerRow,
  BigStats,
  BigStatsImage,
  BigStatsSubheader,
  FarmAuditLogo,
} from './style'
import VaultList from '../../components/VaultList/index'
import { AUDIT_FILE_LINKS, CURVE_APY, SPECIAL_VAULTS } from '../../constants'
import Button from '../../components/Button/index'
import { Divider, Monospace, TextContainer } from '../../components/GlobalStyle'
import { useWallet } from '../../providers/Wallet'
import { usePools } from '../../providers/Pools'
import AnimatedDots from '../../components/AnimatedDots'
import CountdownLabel from '../../components/CountdownLabel'
import { formatNumber, truncateNumberString, getNextEmissionsCutDate } from '../../utils'
import peckshieldLogo from '../../assets/images/logos/peckshield.png'
import haechiLogo from '../../assets/images/logos/haechi.png'
import certikLogo from '../../assets/images/logos/certik.png'
import leastAuthorityLogo from '../../assets/images/logos/least-authority.png'
import GasSavedImage from '../../assets/images/ui/gas-fees.svg'
import TotalDepositsImage from '../../assets/images/ui/deposits.svg'
import { useVaults } from '../../providers/Vault'
import { useStats } from '../../providers/Stats'

const { addresses, tokens } = require('../../data')

const MemoizedCounter = React.memo(CountUp)
const MemoizedCountdown = React.memo(Countdown)

const Farm = () => {
  const { vaultsData } = useVaults()
  const { connected, balances } = useWallet()
  const { pools, userStats } = usePools()
  const {
    monthlyProfit,
    farmPrice,
    farmMarketCap,
    totalValueLocked,
    percentOfFarmStaked,
    profitShareAPY,
    totalGasSaved,
    profitShareAPYFallback,
  } = useStats()

  const ratePerDay = Number(CURVE_APY) / 365 / 100

  const fAssetsWithBalances = pools
    .map(pool => {
      if (Object.values(SPECIAL_VAULTS).includes(pool.id)) {
        const tokenSymbol = find(
          Object.keys(tokens),
          symbol => tokens[symbol].tokenAddress === pool.collateralAddress,
        )

        if (new BigNumber(get(balances, tokenSymbol, 0)).gt(0)) {
          return tokenSymbol
        }

        return null
      }

      const vaultSymbol = find(
        Object.keys(vaultsData),
        symbol =>
          vaultsData[symbol].vaultAddress &&
          vaultsData[symbol].vaultAddress === pool.collateralAddress,
      )

      if (new BigNumber(get(userStats, `[${pool.id}]['lpTokenBalance']`, 0)).gt(0)) {
        return `f${vaultSymbol}`
      }
      return null
    })
    .filter(symbol => symbol)

  return (
    <FarmContainer>
      <VaultList profitShareAPY={profitShareAPY} />
      <Divider height="15px" />
      <FarmAnnouncementsContainer>
        {connected && fAssetsWithBalances.length > 0 ? (
          <FarmAnnouncement>
            <span>
              You have <b>{fAssetsWithBalances.join(', ')}</b> in your wallet that{' '}
              {fAssetsWithBalances.length > 1 ? 'are' : 'is'} not staked.
            </span>
          </FarmAnnouncement>
        ) : null}
      </FarmAnnouncementsContainer>
      <Divider height="20px" />
      <FarmStatsContainer>
        <StatsBox align="flex-start" mobileOrder="1">
          <StatsBoxTitle>
            Deposits in <b>Harvest</b>: <br />
          </StatsBoxTitle>
          <FarmSubTitle>
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
          </FarmSubTitle>
          <Divider height="40px" />
          <ReactTooltip
            id="profits-to-farmers"
            backgroundColor="white"
            borderColor="black"
            border
            textColor="black"
            effect="float"
            getContent={() => (
              <TextContainer textAlign="left" margin="0px">
                <b>70%</b> of profits goes to farmers depositing in <b>asset pools</b>
                <br /> <b>30%</b> goes to those farmers staking <b>FARM</b>
              </TextContainer>
            )}
          />
          <StatsBoxTitle>
            {' '}
            Monthly <b>Profits</b> to Farmers:{' '}
          </StatsBoxTitle>
          <FarmSubTitle data-tip data-for="profits-to-farmers">
            <b>
              {!monthlyProfit ? (
                <AnimatedDots />
              ) : (
                <Monospace>
                  {Number(truncateNumberString(monthlyProfit)).toLocaleString('en-US')}&nbsp;USD
                </Monospace>
              )}
            </b>
          </FarmSubTitle>
        </StatsBox>
        <StatsBox border="unset" boxShadow="unset">
          <MemoizedCountdown
            intervalDelay={50}
            precision={2}
            date={getNextEmissionsCutDate()}
            renderer={({
              formatted: { days, hours, minutes, seconds },
              milliseconds,
              completed,
            }) => {
              if (completed) {
                return (
                  <span>
                    Join the <b>Harvest</b>
                  </span>
                )
              }
              return (
                <>
                  <EmissionsCountdownText>Next Emissions Decrease In:</EmissionsCountdownText>
                  <CountdownLabel
                    display="block"
                    days={days}
                    hours={hours}
                    minutes={minutes}
                    seconds={seconds}
                    milliseconds={milliseconds}
                  />
                </>
              )
            }}
          />
          <Divider height="47px" />
          <Button
            color="primary"
            onClick={() =>
              window.open(
                `https://app.bancor.network/eth/swap?from=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&to=${addresses.FARM}`,
                '_blank',
              )
            }
            shadow
            width="182px"
            height="48px"
          >
            Buy FARM
          </Button>
        </StatsBox>
        <ReactTooltip
          id="details-box"
          backgroundColor="white"
          borderColor="black"
          border
          textColor="black"
          effect="float"
          getContent={() => (
            <StatsTooltip>
              <b>FARM</b> stakers receive <b>30%</b> of profits generated by all other pools
              <br />
              {profitShareAPYFallback ? (
                <>
                  <b>FARM</b> staking APY is a <b>realtime estimate</b>, updated <b>hourly</b>
                </>
              ) : (
                <>
                  <b>FARM</b> staking APY is a <b>7 day</b> historical average
                </>
              )}
            </StatsTooltip>
          )}
        />
        <StatsBox align="flex-start" data-tip="" data-for="details-box">
          <StatsContainerRow>
            <StatsContainer>
              <span>
                <b>FARM</b> price:
              </span>
              <b>{farmPrice ? `${formatNumber(farmPrice, 2)} USD` : <AnimatedDots />}</b>
            </StatsContainer>
            <StatsContainer>
              <span>Market cap:</span>
              <b>{farmMarketCap ? `${formatNumber(farmMarketCap, 2)} USD` : <AnimatedDots />}</b>
            </StatsContainer>
          </StatsContainerRow>
          <Divider height="50px;" />
          <StatsContainerRow>
            <StatsContainer>
              <span>
                <b>FARM</b> staking APY:
              </span>
              <b>{profitShareAPY ? `${Number(profitShareAPY).toFixed(2)}%` : <AnimatedDots />}</b>
            </StatsContainer>

            <StatsContainer>
              <span>
                <b>FARM</b> staked:
              </span>
              <b>
                {percentOfFarmStaked ? (
                  `${Math.round(Number(percentOfFarmStaked))}%`
                ) : (
                  <AnimatedDots />
                )}
              </b>
            </StatsContainer>
          </StatsContainerRow>
        </StatsBox>
      </FarmStatsContainer>
      <Divider height="35px" />
      <FarmStatsContainer>
        <StatsBox width="-webkit-fill-available" height="80px">
          <StatsContainerRow width="auto">
            <BigStatsImage width="77px" height="87px" src={GasSavedImage} />
            <StatsContainer>
              <BigStats>
                <Monospace>
                  {!Number(totalGasSaved) ? (
                    <AnimatedDots />
                  ) : (
                    <b>
                      $
                      <MemoizedCounter
                        start={Number(totalGasSaved)}
                        end={Number(totalGasSaved) + Number(totalGasSaved) * Number(ratePerDay)}
                        separator=" , "
                        useEasing={false}
                        delay={0}
                        decimals={2}
                        duration={86400}
                      />
                    </b>
                  )}
                </Monospace>
              </BigStats>
              <Divider height="15px" />
              <BigStatsSubheader>in gas fees saved.</BigStatsSubheader>
            </StatsContainer>
          </StatsContainerRow>
        </StatsBox>
        <StatsBox width="-webkit-fill-available" height="auto" minHheight="80px">
          <StatsContainerRow width="auto">
            <BigStatsImage width="77px" height="87px" src={TotalDepositsImage} />
            <StatsContainer>
              <BigStats>
                <Monospace>
                  {!Number(totalValueLocked) ? (
                    <AnimatedDots />
                  ) : (
                    <b>
                      $
                      <MemoizedCounter
                        start={Number(totalValueLocked)}
                        end={
                          Number(totalValueLocked) + Number(totalValueLocked) * Number(ratePerDay)
                        }
                        separator=" , "
                        useEasing={false}
                        delay={0}
                        decimals={2}
                        duration={86400}
                      />
                    </b>
                  )}
                </Monospace>
              </BigStats>
              <Divider height="15px" />
              <BigStatsSubheader>of deposits are auto harvesting yields.</BigStatsSubheader>
            </StatsContainer>
          </StatsContainerRow>
        </StatsBox>
      </FarmStatsContainer>
      <Divider height="40px" />
      <FarmAuditsContainer>
        <FarmSubTitle lineHeight="24px" size="20px">
          <b>Audited by:</b>
        </FarmSubTitle>
        <Divider height="36px" />
        <FarmAuditsLogosContainer>
          <a rel="noreferrer noopener" target="_blank" href={AUDIT_FILE_LINKS.LEAST_AUTHORITY}>
            <FarmAuditLogo
              src={leastAuthorityLogo}
              alt="leastauthority"
              width={262}
              height="auto"
            />
          </a>
          <a rel="noreferrer noopener" target="_blank" href={AUDIT_FILE_LINKS.HAECHI}>
            <FarmAuditLogo src={haechiLogo} alt="haechi" width={250} height="auto" />
          </a>
          <a rel="noreferrer noopener" target="_blank" href={AUDIT_FILE_LINKS.PECKSHIELD}>
            <FarmAuditLogo src={peckshieldLogo} alt="pecksheild" width={209} height="auto" />
          </a>
          <a rel="noreferrer noopener" target="_blank" href={AUDIT_FILE_LINKS.CERTIK}>
            <FarmAuditLogo src={certikLogo} alt="certik" width={195} height="auto" />
          </a>
        </FarmAuditsLogosContainer>
      </FarmAuditsContainer>
    </FarmContainer>
  )
}

export default Farm

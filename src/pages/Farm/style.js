import styled from 'styled-components'

const FarmContainer = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  text-align: center;
`

const FarmHeroContainer = styled.div`
  margin: 40px 0 0px;
  text-align: center;
`

const FarmAuditsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  font-weight: bold;
`

const FarmAuditsLogosContainer = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-left: 20px;
  font-weight: bold;

  @media screen and (max-width: 480px) {
    justify-content: space-around;
  }
`

const FarmStatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;

  @media screen and (max-width: 950px) {
    flex-direction: column;
    margin: 0 10px;
  }
`

const FarmButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  position: sticky;
  bottom: 10px;
  padding: 10px;
  border: 2px solid black;
  background-color: rgb(247, 241, 199);
  box-shadow: 3px 3px black;

  button {
    margin-right: 10px;
  }

  @media screen and (max-width: 860px) {
    button {
      &:first-child {
        margin-right: 5px;
      }
      &:last-child {
        margin-left: 5px;
        margin-right: 0;
      }
    }
  }
`

const FarmTitle = styled.h1`
  display: flex;
  font-size: 25px;
  font-weight: normal;
  margin: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`

const FarmSmallTitle = styled.h2`
  font-size: 20px;
  font-weight: normal;
  margin: 0;

  @media screen and (max-width: 860px) {
    margin-top: 10px;
  }
`

const FarmSubTitle = styled.h2`
  position: relative;

  font-size: ${props => (props.size ? props.size : '16px')};
  font-weight: ${props => (props.bold ? 'bold' : 'normal')};
  line-height: ${props => (props.lineHeight ? props.lineHeight : 'auto')};
  height: ${props => (props.height ? props.height : 'auto')};

  margin: 0;

  a {
    color: black;
  }
`

const FarmAuditLogo = styled.img`
  filter: grayscale(1);
  margin-right: 20px;
  width: ${props => (props.width ? props.width : '32px')};
  height: ${props => (props.height ? props.height : '32px')};
  border-radius: ${props => (props.borderRadius ? '50px' : null)};
`

const FarmAnnouncementsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const FarmAnnouncement = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid black;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: white;
  padding: 10px;

  a {
    color: black;
    font-weight: bold;
  }

  span {
    text-align: left;
    line-height: 20px;
  }
`

const EmissionsCountdownText = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 17.07px;
  margin-bottom: 10px;
`

const StatsBoxTitle = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  margin-bottom: 10px;
`

const StatsBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: ${props => props.align || 'center'};
  background: #ffffff;
  box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 40px 30px;
  margin-bottom: 10px;
  width: -webkit-fill-available;
  height: ${props => props.height || '152px'};
  min-height: ${props => props.minHeight || '152px'};
  margin: ${props => props.margin || 'unset'};

  h2 {
    text-align: left;
    font-weight: 900;
    font-size: 25px;
    line-height: 30px;
  }

  @media screen and (max-width: 710px) {
    order: ${props => props.mobileOrder || 'unset'};
  }
`

const ModeToggleContainer = styled.div`
  display: flex;

  @media screen and (max-width: 860px) {
    width: 100%;
    justify-content: center;
  }
`

const ActionButtonsContainer = styled.div`
  display: flex;
  width: 80%;

  @media screen and (max-width: 860px) {
    margin-bottom: 10px;
    width: 100%;

    button {
      width: 100%;
    }
  }
`

const StatsContainerRow = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
  text-align: left;

  div:first-child {
    width: ${props => props.width || '135px'};
    margin-right: 38px;
  }

  @media screen and (max-width: 840px) {
    flex-direction: column;
    align-items: baseline;

    div:first-child {
      margin-right: 0;
    }
  }
`

const BigStats = styled.div`
  font-size: 30px !important;
  font-weight: 900 !important;
  font-size: 30px !important;
  line-height: 36px !important;

  b {
    font-weight: 900 !important;
    font-size: 30px !important;
    line-height: 36px !important;
  }
`

const BigStatsImage = styled.img`
  width: ${props => props.width || '80px'};
  height: ${props => props.height || '75px'};
  margin-right: 40px;
  margin-left: 20px;

  @media screen and (max-width: 840px) {
    margin: 0;
  }
`

const BigStatsSubheader = styled.span`
  ont-weight: 500;
  font-size: 16px;
  line-height: 20px;
`

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 14px;
  line-height: 17px;

  span {
    text-align: left;
    margin-bottom: 10px;

    b {
      font-size: 14px;
      line-height: 17px;
    }
  }

  b {
    text-align: start;
    font-weight: 900;
    font-size: 20px;
    line-height: 24px;
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media screen and (max-width: 840px) {
    span {
      margin-bottom: 5px;
    }

    b {
      line-height: unset;
    }

    margin-bottom: 10px !important;
  }
`

const StatsTooltip = styled.div`
  text-align: left;
`

const NetworkLogo = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`
export {
  FarmSmallTitle,
  FarmContainer,
  NetworkLogo,
  FarmHeroContainer,
  FarmStatsContainer,
  FarmButtonsContainer,
  FarmTitle,
  FarmSubTitle,
  FarmAnnouncementsContainer,
  FarmAnnouncement,
  StatsBox,
  StatsContainer,
  ModeToggleContainer,
  ActionButtonsContainer,
  StatsTooltip,
  FarmAuditsContainer,
  FarmAuditsLogosContainer,
  EmissionsCountdownText,
  StatsBoxTitle,
  StatsContainerRow,
  BigStats,
  BigStatsImage,
  BigStatsSubheader,
  FarmAuditLogo,
}

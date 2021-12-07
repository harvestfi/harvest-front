import styled from 'styled-components'

const WorkContainer = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  width: auto;
  text-align: center;
  margin-bottom: 40px;
  padding: 0 30px;
`

const WorkHeader = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  margin-bottom: 50px;
  flex-wrap: wrap;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 30px;
  line-height: 37px;

  @media screen and (max-width: 800px) {
    font-size: 20px;
    line-height: 24px;
    margin: 40px 0 30px 0;
  }
`

const WorkSubHeader = styled.h3`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  flex-wrap: wrap;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 30px;
  line-height: 37px;
  text-align: center;
  color: #ffffff;

  @media screen and (max-width: 800px) {
    font-size: 20px;
    margin-top: 45px;
  }
`

const WorkConnectionBox = styled.div`
  box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.1);
  padding: 50px 40px;
  background: #ffffff;
  border: 2px solid #f2f8ff;
  box-sizing: border-box;
  border-radius: 8px;
  display: flex;
  justify-content: ${props => (props.account ? 'space-between' : 'center')};
  align-items: center;
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 25px;
  line-height: 30px;

  @media screen and (max-width: 1200px) {
    line-height: ${props => (props.account ? '55px' : '25px')};
    margin-bottom: 25px;
    flex-direction: column;
    justify-content: center;
    font-size: 16px;
  }
`

const WorkMainText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`

const WorkRedeemStatsContainer = styled.div`
  text-align: left;
  font-family: Lato;
  font-style: normal;
  font-weight: normal;
  font-size: 25px;
  line-height: 30px;
  margin-right: 10px;

  @media screen and (max-width: 1200px) {
    text-align: center;
  }
`

const WorkExplinatonBox = styled.div`
  width: auto;
  padding: 50px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  background: linear-gradient(180deg, #daeff0 0%, #ffffff 119.49%);
  border: 2px solid #f2f8ff;
  box-sizing: border-box;
  border-radius: 8px;
  word-break: break-word;

  ul {
    li {
      margin-bottom: 10px;
    }
  }

  p {
    margin: 0 !important;
  }

  @media screen and (max-width: 1200px) {
    padding: 30px;
  }

  @media screen and (max-width: 800px) {
    font-size: 14px;
  }
`

const WorkExplinatonHeader = styled.div`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;

  @media screen and (max-width: 800px) {
    font-size: 14px;
  }
`

export {
  WorkContainer,
  WorkHeader,
  WorkSubHeader,
  WorkMainText,
  WorkExplinatonBox,
  WorkExplinatonHeader,
  WorkConnectionBox,
  WorkRedeemStatsContainer,
}

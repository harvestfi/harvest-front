import styled from 'styled-components'

const Container = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  width: auto;
  text-align: center;
  margin-bottom: 40px;
`

const Title = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  margin-bottom: 10px;
  flex-wrap: wrap;
  font-family: Montserrat;
  font-style: normal;
  font-weight: 500;
  font-size: 30px;
  line-height: 37px;
`

const Paragrah = styled.p`
  max-width: 650px;
  margin: auto;
  line-height: 1.22;
`

const FormContainer = styled.div`
  position: relative;
  background: linear-gradient(rgb(218, 239, 240) 0%, rgb(255, 255, 255) 119.49%);
  border: 2px solid rgb(242, 248, 255);
  box-sizing: border-box;
  border-radius: 8px;
  padding: 50px;
  max-width: 630px;
  margin: auto;

  span {
    font-size: 16px;
  }
`

const FormGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 20px;
`

const ZapperLogoLink = styled.a`
  position: absolute;
  right: 5px;
  bottom: 4px;
  height: 32px;

  img {
    height: inherit;
  }
`

export { Container, Title, Paragrah, FormGroup, FormContainer, ZapperLogoLink }

import styled from 'styled-components'

const FAQContainer = styled.div`
  max-width: 1184px;
  margin: 100px auto;
  position: relative;
  z-index: 2;
  padding: 0 30px;

  @media screen and (max-width: 800px) {
    margin: 40px auto;
  }
`

const FAQBox = styled.div`
  background: #daeff0;
  border-radius: 8px;
  width: 100%;
`

const QuestionContainer = styled.div`
  margin-bottom: 25px;
  border-radius: 8px;
  background: linear-gradient(180deg, #daeff0 0%, #ffffff 119.49%);
  cursor: pointer;
  z-index: 3;

  ul {
    margin: 0px;
  }

  @media screen and (max-width: 800px) {
    ul {
      padding: 0 5px 0px;
      list-style-type: none;
    }
  }
`

const Question = styled.div`
  display: flex;
  align-items: center;
  jusify-content: flex-start;
  font-weight: 900;
  font-size: 25px;
  line-height: 30px;
  font-family: Lato;
  padding: 40px;

  ${props =>
    props.open
      ? `
  border-bottom-left-radius: 0px; 
  border-bottom-right-radius: 0px;
  `
      : ``}

  @media screen and (max-width: 800px) {
    padding: 25px;
    font-size: 14px;
    line-height: 17px;
  }
`

const DropdownToggle = styled.img`
  margin-right: 40px;

  @media screen and (max-width: 800px) {
    margin-right: 15px;
  }
`

const Answer = styled.div`
  padding: 0 100px 50px;

  @media screen and (max-width: 800px) {
    padding: 0 20px 20px;
    font-size: 12px;
  }
`

export { FAQContainer, FAQBox, Question, Answer, DropdownToggle, QuestionContainer }

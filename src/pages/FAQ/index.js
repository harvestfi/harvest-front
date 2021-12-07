import React, { useEffect } from 'react'
import Collapsible from 'react-collapsible'
import uuid from 'react-uuid'
import { FAQContainer, DropdownToggle, Question, Answer, QuestionContainer } from './style'
import { FAQ_ITEMS } from '../../constants'
import { getTotalFARMSupply } from '../../utils'
import DropdownToggleImageClosed from '../../assets/images/ui/dropdown-toggle-closed.png'
import DropdownToggleImageOpen from '../../assets/images/ui/dropdown-toggle-open.png'

const FAQ = () => {
  useEffect(() => {
    const totalSupplyContainer = window.document.getElementById('total-supply')

    if (totalSupplyContainer) {
      totalSupplyContainer.innerText = Math.trunc(Number(getTotalFARMSupply())).toLocaleString(
        'en-US',
      )
    }
  }, [])

  return (
    <FAQContainer>
      {FAQ_ITEMS.map(item => (
        <QuestionContainer key={uuid()}>
          <Collapsible
            lazyRender={item.lazyRender !== undefined ? item.lazyRender : true}
            triggerWhenOpen={
              <Question open>
                <DropdownToggle open src={DropdownToggleImageOpen} />
                {item.question}
              </Question>
            }
            trigger={
              <Question>
                <DropdownToggle src={DropdownToggleImageClosed} />
                {item.question}
              </Question>
            }
          >
            <Answer>{item.answer}</Answer>
          </Collapsible>
        </QuestionContainer>
      ))}
    </FAQContainer>
  )
}

export default FAQ

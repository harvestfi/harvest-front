import React from 'react'
import ReactHtmlParser from 'react-html-parser'
import { isUndefined } from 'lodash'
import { Container, LabelContainer, Label, InputContainer } from './style'
import { preventNonNumericInput, preventNonNumericPaste } from '../../utils'
import Button from '../Button'

const NumberInput = ({
  label,
  secondaryLabel,
  interactiveButton,
  buttonLabel,
  onClick,
  disabled,
  hideButton,
  invalidAmount,
  ...props
}) => (
  <Container
    label={label}
    invalidAmount={invalidAmount}
    hasButton={!isUndefined(onClick)}
    {...props}
  >
    {label || secondaryLabel ? (
      <LabelContainer>
        {label ? <Label>{ReactHtmlParser(label)}</Label> : null}
        {secondaryLabel ? <Label>{ReactHtmlParser(secondaryLabel)}</Label> : null}
      </LabelContainer>
    ) : null}

    <InputContainer>
      {!hideButton ? (
        <Button color="secondary" size="sm" onClick={onClick} disabled={disabled}>
          {buttonLabel || 'MAX'}
        </Button>
      ) : null}
      <input
        type="number"
        min="0"
        onKeyDown={preventNonNumericInput}
        onPaste={preventNonNumericPaste}
        disabled={disabled || invalidAmount}
        {...props}
      />
    </InputContainer>
  </Container>
)

export default NumberInput

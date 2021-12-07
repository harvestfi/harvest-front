import React from 'react'
import RModal from 'react-modal'
import Button from './Button'

RModal.setAppElement('body')

const Modal = ({ title, open, onClose, children, confirmationLabel }) => (
  <RModal isOpen={open} onRequestClose={onClose} shouldCloseOnOverlayClick={false}>
    <h2>{title}</h2>
    {children}
    <Button size="sm" onClick={onClose} margin="20px auto auto">
      {confirmationLabel}
    </Button>
  </RModal>
)

export default Modal

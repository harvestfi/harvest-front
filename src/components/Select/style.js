import styled from 'styled-components'

const Container = styled.div`
  .hv-select__control {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-end;
    background: unset;
    padding: unset;
    border-radius: unset;
    border: unset;
    font-family: Montserrat;
    font-weight: 500;
    font-size: 18px;
    margin-right: 3px;
    margin-left: 3px;

    &:hover {
      border: unset;
      box-shadow: unset;
    }
  }

  .hv-select__control {
    cursor: pointer;
    box-shadow: unset;
  }

  .hv-select--is-disabled {
    opacity: 0.4;
  }

  .hv-select__value-container {
    flex: unset;
    padding: 0;
  }

  .hv-select__placeholder {
    position: unset;
    transform: unset;
    color: black;
  }

  .hv-select__indicator-separator {
    background: unset;
  }

  .hv-select__single-value {
    position: unset;
    transform: unset;
    max-width: unset;
    color: black;
  }

  .hv-select__menu {
    background: linear-gradient(rgb(218, 239, 240) 0%, rgba(218, 239, 240, 0.9) 100%);
    z-index: 2;
  }

  .hv-select__option {
    cursor: pointer;
  }

  .hv-select__option--is-selected,
  .hv-select__option--is-focused {
    background-color: rgb(128, 180, 209);
  }

  .hv-select__single-value {
    text-decoration: underline;
    font-weight: bold;
  }

  .hv-select__indicator {
    padding-left: 0px;
    padding-right: 4px;
  }
`

const ArrowContainer = styled.div`
  padding: 0px 5.4px;
  background: ${props => (props.open ? '#f2b435' : '#FFFCE6')};

  svg {
    width: 9px;
    height: 9px;
    transition: 0.25s;
    transform: ${props => (props.open ? 'rotate(-180deg)' : 'unset')};

    path {
      fill: ${props => (props.open ? '#4C351B' : '#F2B435')};
    }
  }
`

export { Container, ArrowContainer }

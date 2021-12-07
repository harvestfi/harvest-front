import styled, { createGlobalStyle } from 'styled-components'
import backgroundLandscape from '../assets/images/ui/background-landscape.png'
import backgroundSky from '../assets/images/ui/background-sky.png'

const GlobalStyle = createGlobalStyle`
html {
  background-image: url(${backgroundSky}), linear-gradient(180deg, #FFFFFF 0%, #DAEFF0 14.35%, #0D8CC7 77.32%, #0086C4 100%);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: contain;
  background-position: bottom left;
  height: 100%;

  body {
    font-family: 'Montserrat', 'Helvetica', sans-serif;
    background-image: url(${backgroundLandscape});
    background-repeat: no-repeat;
    margin: 0px;
    min-height: 100%;
    background-size: 100vw auto;
    background-position: bottom left;
    padding-bottom: 1%;
  }

  #root {
    position: relative;

    @media screen and (max-width: 1200px) {
      position: unset;
    }
  }


  @media screen and (max-width: 1200px) {
    background-position: top left;
  }
}

.Collapsible, .Collapsible__contentInner {
  @media screen and (max-width: 860px) {
    overflow: initial;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

  a {
    color: black;
    font-weight: bold;
  }

  .fixed-tooltip {
    top: 0px !important;
    left: -250px !important;
    position: absolute !important;

    &::after, &::before {
      top: 20% !important;
    }
  }

  .Toastify__close-button {
    color: black !important;
  }

  .Toastify__progress-bar {
    background-color: hsl(0deg 0% 0% / 18%) !important;
  }
  
  .Toastify__toast--error, .Toastify__toast--success {
    box-shadow: 3px 3px black !important;
    color: white !important;
    font-family: Lato;
    font-size: 14px;
    padding: 20px;
    text-align: left;
    font-size: 14px;
    line-height: 17px;
    border-radius: 10px;
  }

  .Toastify__toast--error {
    background: #FF5733 !important;
  }

  .Toastify__toast--success {
    background: #1BC27C !important;
  }

  .react-toggle {
    touch-action: pan-x;
    display: inline-block;
    position: relative;
    cursor: pointer;
    background-color: transparent;
    border: 0;
    padding: 0;
    user-select: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    -webkit-tap-highlight-color: transparent;
  }

  .w-190 {
    min-width: 190px;
    max-width: 190px;
    word-break: break-all;
  }

  .react-toggle-screenreader-only {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
  
  .react-toggle--disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transition: opacity 0.25s;
  }
  
  .react-toggle-track {
    width: 30px;
    height: 16px;
    border: 1px solid #DADFE6;
    padding: 0;
    border-radius: 30px;
    background-color: #F2F8FF;
    transition: all 0.2s ease;
  }
  
  .react-toggle:hover:not(.react-toggle--disabled) .react-toggle-track {
    background-color: unset;
  }
  
  .react-toggle--checked .react-toggle-track {
    background-color: #FFE3BD;
    border: 1px solid #FFC87C;
  }
  
  .react-toggle--checked:hover:not(.react-toggle--disabled) .react-toggle-track {
    background-color: unset;
  }
  
  .react-toggle--checked .react-toggle-track-check {
    opacity: 1;
    transition: opacity 0.25s ease;
  }
  
  .react-toggle-track-x, .react-toggle-track-check  {
    display: none;
  }
  
  .react-toggle--checked .react-toggle-track-x {
    opacity: 0;
  }
  
  .react-toggle-thumb {
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    position: absolute;
    top: 1px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #A9AEB3;
    box-sizing: border-box;
    transition: all 0.25s ease;
  }
  
  .react-toggle--checked .react-toggle-thumb {
    left: 16px;
    background-color: #F2B435;
    border-color: unset;
  }
  
  .react-toggle--focus .react-toggle-thumb {
    box-shadow: unset;
  }
  
  .react-toggle:active:not(.react-toggle--disabled) .react-toggle-thumb {
    box-shadow: unset;
  }

  .__react_component_tooltip {
    border: 2px solid black !important;
    border-radius: 8px !important;
    background-color: white !important;
    padding: 8px !important;
    padding-left: 12px !important;
    padding-right: 12px !important;

    @media screen and (max-width: 450px) {
      left: 0 !important;

      ul, div {
        font-size: 13px !important;
      }

      &:before, &:after {
        display: none;
      }
    }
  }

  .web3modal-modal-lightbox {
    z-index: 20;
  }

  .web3modal-modal-card {
    border-radius: 8px;
    background: linear-gradient(rgb(218,239,240) 0%,rgb(218 239 240 / 90%) 100%);
  }

  .web3modal-provider-container, .web3modal-chain-container  {
    background: transparent;
  }

  .web3modal-provider-wrapper, .web3modal-chain-wrapper {
    border: unset;
    padding: 0;
  }

  .active {
    background-color: rgb(128, 180, 209);
    border-radius: 0px;
  }

  .web3modal-provider-description {
    color: black;
  }

  .web3modal-provider-container, .web3modal-chain-wrapper {
    border-radius: 0px;

    &:hover {
      background-color: rgb(128, 180, 209) !important;
      border-radius: 0px;
    }
  }

  .is-disabled {
    cursor: not-allowed;
    pointer-events: none;
  }

  .numeric-list {
    padding-left: 10px;
    margin: 5px 0;
    
    li {
      line-height: 1.22;
      margin-top: 3px;
    }
  }

  .help-message {
    text-align: left;
    margin-top: 10px;
  }

  .ReactModal__Overlay {
    background-color: rgb(121 121 121 / 75%) !important;
    z-index: 199999;
  }

  .ReactModal__Content {
    max-width: 500px !important;
    min-height: 100px;
    height: fit-content;
    border: 1px solid rgb(204, 204, 204);
    background: linear-gradient(rgb(218,239,240) 0%,rgb(255 255 255 / 70%) 100%) !important;
    border-radius: 20px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;

    h2 {
      margin-top: 0;
    }
  }
`

const Divider = styled.div`
  height: ${props => (props.height ? props.height : '20px')};

  @media screen and (max-width: 860px) {
    height: ${props => (props.height ? `${parseInt(props.height, 10) - 10}px` : '20px')};
  }
`

const ClickGate = styled.div`
  cursor: ${props => (props.disabled ? 'not-allowed' : 'auto')};
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  a {
    pointer-events: ${props => (props.disabled ? 'none' : 'all')};
  }
`

const TableContainer = styled.div`
  display: table;
  width: 100%;
  table-layout: fixed;
`

const TableHead = styled.div`
  margin-bottom: ${props => (props.invisible ? '-20px' : 'unset')};
  display: table-header-group;
`

const TableBody = styled.div`
  display: table-row-group;
`

const TableRow = styled.div`
  display: table-row;
`

const TableCell = styled.div`
  position: relative;
  width: ${props => (props.width ? props.width : 'auto')};
  display: table-cell;
  vertical-align: middle;
  text-align: ${props => (props.textAlign ? props.textAlign : 'center')};
  font-weight: ${props => (props.fontWeight ? props.fontWeight : 'normal')};
  padding: 10px 0px;
  margin-right: 20px;
`

const Monospace = styled.span`
  font-family: 'Lato', monospace;
  border-bottom: ${props => props.borderBottom || 'unset'};
`

const Box = styled.div`
  width: ${props => (props.width ? props.width : 'auto')};
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid black;
  background-color: #fffce6;

  padding: 10px;

  b {
    margin-right: 5px;
  }

  a {
    margin-right: 5px;
    margin-left: 5px;
    color: black;
    font-weight: bold;
  }
`

const TextContainer = styled.div`
  text-align: ${props => props.textAlign || 'center'};
  margin: ${props => props.margin || '20px 0px'};
`

const SmallLogo = styled.img`
  width: ${props => props.width || '20px'};
  height: ${props => props.height || '20px'};
  margin: ${props => props.margin || '0px'};
`

const Body = styled.div`
  position: relative;
  margin-bottom: 420px;

  @media screen and (max-width: 860px) {
    margin-bottom: 160px;
  }
`

const ScrollArrow = styled.div`
  position: absolute;
  right: -8.5px;
  top: 40%;
  display: ${props => (props.hide ? 'none' : 'block')};

  @media screen and (min-width: 730px) {
    display: none !important;
  }
`

const NewBadgeLabel = styled.div`
  padding: 4px 6px;
  background-color: #ff5235;
  color: white;
  border-radius: 4px;
  margin-left: 5px;
  font-family: Lato;
  font-weight: 900;
  font-size: 11px;
  line-height: 13px;

  &:before {
    content: 'NEW';
    display: block;
  }
`

const NewBadgeRibbon = styled.img`
  position: absolute;
  right: -4px;
  top: -4px;
  width: 34px;
`

const WorkPageLink = styled.a`
  position: absolute;
  left: 6%;
  bottom: 1%;
  width: 30%;
  height: 18vw;
  z-index: 1;

  @media screen and (max-width: 1200px) {
    display: none;
  }
`

export {
  Divider,
  ClickGate,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Monospace,
  GlobalStyle,
  SmallLogo,
  TextContainer,
  Box,
  Body,
  ScrollArrow,
  NewBadgeLabel,
  NewBadgeRibbon,
  WorkPageLink,
}

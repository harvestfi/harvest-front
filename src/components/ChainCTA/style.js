import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border: 2px solid black;
  text-align: center;
  background-color: #fffce6;
  box-shadow: 3px 3px black;
  flex-wrap: wrap;

  div {
    text-align: center;
  }

  button {
    font-weight: bold;
    margin-left: 20px;
    background-color: #eebf65;
  }

  @media screen and (max-width: 750px) {
    div {
      max-width: 100%;
    }

    button {
      width: 100%;
      margin-top: 10px;
      margin-left: 0px;
    }
  }
`

// eslint-disable-next-line import/prefer-default-export
export { Container }

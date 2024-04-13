import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import MyCanvas from './components/MyCanvas';
import billiard from './utils/billiard';
import './App.css';

function App() {
  const [number, setNumber] = useState('');
  const newGame = document.querySelector('.newGame');

  const handleChange = (e) => {
    if (![2, 3, 4, 5, 6].includes(+e.target.value)) {
      setNumber('');
      return;
    }
    setNumber(e.target.value);
  };

  const newgame = () => {
    newGame.classList.remove('visible');
  };

  useEffect(() => {
    billiard(number);
  }, [number]);

  return (
    <>
      <div className="chooseColor">
        <input type="color" id="col" />
      </div>
      <div className="wrap d-flex justify-content-evenly mt-4 ms-4">
        <div className="container-form w-25 p-4">
          <Form className="form d-flex flex-column align-items-center">
            <Button
              variant="success"
              type="submit"
              className="newGame w-50 mb-3"
              onClick={newgame}
            >
              New game
            </Button>
            <Form.Group className="mb-3 text-center d-flex flex-column">
              <Form.Label>Number of balls (2...6)</Form.Label>
              <Form.Control
                type="text"
                className="numberInput d-inline-block w-100"
                value={number}
                onChange={handleChange}
                autoFocus
              />
              <div className="stopGame w-100 mt-3">Stop game</div>
            </Form.Group>
          </Form>
          <div className="shadow mt-4 ps-4">
            <h5>To start game, enter number of balls, 2...6</h5>
            <ul>
              <li>catch any ball with your mouse and push it</li>
              <li>
                the goal of the game is to drive any ball into the central
                pocket
              </li>
              <li>
                after this the message will appear: &quot;Game over!&quot;
              </li>
              <li>to start a new game press the button &quot;New game&quot;</li>
            </ul>
          </div>
        </div>
        <div className="canvas w-75">
          <MyCanvas />
        </div>
      </div>
    </>
  );
}

export default App;

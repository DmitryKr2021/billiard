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
      <div className="wrap d-flex justify-content-around mt-4">
        <div className="container-form">
          <Form className="form d-flex flex-column align-items-center">
            <Button
              variant="success"
              type="submit"
              className="newGame w-50 mb-3"
              onClick={newgame}
            >
              New game
            </Button>
            <Form.Group className="mb-3 text-center">
              <Form.Label>Number of balls (2...6)</Form.Label>
              <Form.Control
                type="text"
                className="numberInput d-inline-block w-50"
                value={number}
                onChange={handleChange}
                autoFocus
              />
            </Form.Group>
            <div className="stopGame w-50 mb-3">Stop game</div>
          </Form>
        </div>
        <MyCanvas />
      </div>
    </>
  );
}

export default App;

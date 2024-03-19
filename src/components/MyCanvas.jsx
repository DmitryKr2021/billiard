/* eslint-disable react/function-component-definition */
import React from 'react';

const MyCanvas = () => (
  <div className="canvas position-relative">
    <div className="over">Game over!</div>
    <canvas id="canvas" />
  </div>
);

export default MyCanvas;

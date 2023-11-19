import { useState } from 'react'
import './App.css'

export default function App() {

  return (
    <div id="calc-main" className='calc-grid'>
      <CalcDisplay />
      <CalcKeys />
    </div>
  )
}

const CalcKeys = () => {

  return(
    <div className="calc-keys">
      <button className="op1">+</button>
      <button className="op2">-</button>
      <button className="op3">x</button>
      <button className="op4">÷</button>
      <button>7</button>
      <button>8</button>
      <button>9</button>
      <button>4</button>
      <button>5</button>
      <button>6</button>
      <button>1</button>
      <button>2</button>
      <button>3</button>
      <button>0</button>
      <button className="op5">.</button>
      <button id="AC-key" className="op6">C</button>
      <button className="op7">=</button>
    </div>
  )
};

const CalcDisplay = () => {
  return(
    <div className="calc-display">
        <div id="menu-icon-place" className="storage-window"></div>
        <div className="calc-current"></div>
        <div className="calc-mem"></div>
        <div className="save-button hide"><span id="save-icon-place" style={{fontFamily: 'wingdings'}}></span></div>
    </div>
  )
}
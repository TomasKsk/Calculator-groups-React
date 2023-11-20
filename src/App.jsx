import { useState, useEffect, setState } from 'react'
import './App.css'
const operandArr = ["÷", "x", "-", "+"];

export default function App() {
  const [calcMem, setCalcMem] = useState([]);
  const [calcDisp, setCalcDisp] = useState('');
  const [calcOp, setCalcOp] = useState('')

  useEffect(() => {
    const handleClick = (e) => {
      // console.log(e.target)
      let num = e.target.innerHTML;

      // if afer parsing the content to number is not NaN or typeof is number concat the text; user input: 7
      if (!isNaN(+(num)) && typeof +(num) === 'number') {
        setCalcDisp((prevDisp) => prevDisp + num);
        if (calcOp !== '') {
          setCalcOp('');
        }
      }

      // if user uses a comma, it has to be only once per the whole number; user input: .
      if (num === '.' && !calcDisp.includes('.')) {
        setCalcDisp((prevDisp) => prevDisp + num);
      }

      // if user clicks on a operand; user input: +
      if (operandArr.includes(num)) {
        console.log(num)
        // if the display has a number
        if (calcDisp !== '') {
            setCalcOp(num);
            setCalcMem((prev) => [...prev, calcDisp, num]);
            setCalcDisp('');
        } else {
          setCalcOp(num);
          setCalcMem((prev) => [...prev.slice(0,-1), num]);
        }
      }
    }

    const sel = document.querySelector('.container');
    sel.addEventListener('click', handleClick);
    return () => {
      sel.removeEventListener('click', handleClick);
      console.log('number', calcDisp, calcMem);
    }
  }, [calcDisp, calcMem, calcOp]);



  return (
    <div id="calc-main" className='calc-grid'>
      <CalcDisplay calcDisp={calcDisp} calcMem={calcMem}/>
      <CalcKeys />
      <CalcMemory />
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

// eslint-disable-next-line react/prop-types
const CalcDisplay = ({ calcDisp, calcMem }) => {
  return(
    <div className="calc-display">
        <div id="menu-icon-place" className="storage-window"></div>
        <div className="calc-current">{calcDisp}</div>
        <div className="calc-mem">{calcMem}</div>
        <div className="save-button hide saveIcon"><span id="save-icon-place"></span></div>
    </div>
  )
}

const CalcMemory = () => {
  return(
    <div id="calc-mem-storage" className="calc-mem-storage">
    
    </div>
  )
}
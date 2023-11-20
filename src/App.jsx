import { useState, useEffect, setState } from 'react'
import './App.css'
const operandArr = ["÷", "x", "-", "+"];

export default function App() {
  const [calcMem, setCalcMem] = useState([]);
  const [calcStorage, setCalcStorage] = useState({});
  const [calcDisp, setCalcDisp] = useState('');
  const [calcOp, setCalcOp] = useState('')

  useEffect(() => {
    const handleClick = (e) => {
      // console.log(e.target)
      let num = e.target.innerHTML;

      // if afer parsing the content to number is not NaN or typeof is number concat the text; user input: 7
      if (!isNaN(+(num)) && typeof +(num) === 'number') {
        if (!calcMem.includes('=')) {
          setCalcDisp((prevDisp) => prevDisp + num);
          // reset the operand if there is any
          if (calcOp !== '') {
            setCalcOp('');
          }
        } else {
          setCalcDisp('');
          setCalcMem([]);
          setCalcDisp((prevDisp) => prevDisp + num);
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

      if (num === '=') {
        if (calcDisp !== '' && calcMem.length > 1) {
          let tempMem = [...calcMem, calcDisp];
          let tempDisp = recalc(tempMem);
          setCalcMem((prev) => [...prev, calcDisp, '=', tempDisp]);
          setCalcDisp(tempDisp);
        }
      }
    };

    const parseOp = (num1, op, num2) => {
      num1 = +(num1);
      num2 = +(num2);
      if (op === '+') return num1 + num2;
      if (op === '-') return num1 - num2;
      if (op === 'x' || op === '*') return num1 * num2;
      if (op === '÷' || op === '/') return num1 / num2;
    };

    const recalc = (arr) => {
      let temp2 = [].concat(arr);
      let temp = parseOp(temp2[0], temp2[1], temp2[2]);
      console.log(temp2, temp)
      temp2.splice(0,3)
  
      while(temp2.length > 0 && temp2[0] !== '=') {
          let cur = temp2.splice(0,2);
          console.log(cur);
          temp = parseOp(temp, cur[0], cur[1]);
      }
      return temp;
    };

    const sel = document.querySelector('.container');
    sel.addEventListener('click', handleClick);
    return () => {
      sel.removeEventListener('click', handleClick);
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
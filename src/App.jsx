import { useState, useEffect } from 'react'
import './App.css'
const operandArr = ["÷", "x", "-", "+"];
const dataTypes = ['header', 'number', 'comment', 'operator'];

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
  console.log(temp2);
  temp2.splice(0,3)

  while(temp2.length > 0 && temp2[0] !== '=') {
      let cur = temp2.splice(0,2);
      temp = parseOp(temp, cur[0], cur[1]);
  }
  console.log(temp);
  return temp;
};

export default function App() {
  const [calcMem, setCalcMem] = useState([]);
  const [calcStorage, setCalcStorage] = useState({});
  const [calcMemCount, setCalcMemCount] = useState(0);
  const [menuIcon, setMenuIcon] = useState('≡');
  const [saveIco, setSaveIco] = useState('');
  const [calcDisp, setCalcDisp] = useState('');
  const [calcOp, setCalcOp] = useState('');
  const [delKey, setDelKey] = useState('C');

  useEffect(() => {
    const handleClick = (e) => {
      let num = e.target.innerHTML;
      let numId = e.target.id;
      let dataT = e.target.dataset;

      if (dataT.type) {
        handleStorage(e);
      } 
      if (!isNaN(+(num)) && typeof +(num) === 'number') {
        handleNumberClick(num, e);
      } else if (num === '.') {
        handleDotClick();
      } else if (operandArr.includes(num) && calcDisp !== '' && numId !== 'menu-icon-place') {
        handleOperandClick(num, e);
      } else if (num === '=') {
        handleEqualClick();
      } else if (num === 'C' || num === 'CE') {
        handleDel(num);
      } else if (numId === 'save-icon-place') {
        saveCalc();
      } else if (numId === 'menu-icon-place') {
        handleMenu(e);
      } 
    };

    // remove save icon if there is no 
    if (!calcMem.includes('=')) {
      setSaveIco('')
    }

    const selectMe = (e) => {
      e.target.setAttribute('contenteditable', true);
      document.execCommand('selectAll',false,null);
    }

    const handleStorage = (e) => {
      let dataT = e.target.dataset.type;
      if (dataTypes.includes(dataT)) {
        selectMe(e)
      }
    }

    const handleMenu = (e) => {
      let sel = e.target.innerHTML;
      if (sel === '≡' || sel === 'x') {
        let sel = document.querySelector('.calc-mem-storage')
        let condi = sel !== null;
        setMenuIcon((prev) => (prev === '≡' && condi) ? 'x' : '≡');
        if (condi) return sel.classList.toggle('visible');
      }
    }

    const handleNumberClick = (num, e) => {
      console.log(e.target.matches('button'))
      if (e.target.matches('button')) {
        if (!calcMem.includes('=')) {
          setCalcDisp((prevDisp) => prevDisp + num);
          if (calcOp !== '') {
            setCalcOp('');
          }
          if (delKey === 'CE') {
            setDelKey('C');
          }
        } else {
          if (delKey === 'CE') {
            setDelKey('C');
          }
          setCalcDisp('');
          setCalcMem([]);
          setCalcDisp((prevDisp) => prevDisp + num);
        }
      }
    };

    const handleDotClick = () => {
      if (!calcDisp.includes('.')) {
        setCalcDisp((prevDisp) => prevDisp + '.');
      }
    };

    const handleOperandClick = (num, e) => {
      if (e.target.matches('button')) {
        if (calcDisp !== '') {
          if (calcMem.includes('=')) {
            setCalcOp(num);
            setCalcMem([calcDisp, num]);
            setCalcDisp('');
          } else {
            setCalcOp(num);
            setCalcMem((prev) => [...prev, calcDisp, num]);
            setCalcDisp('');
          }
        } else {
          setCalcOp(num);
          setCalcMem((prev) => [...prev.slice(0, -1), num]);
        }
      }
    };

    const handleEqualClick = () => {
      if (calcDisp !== '' && calcMem.length > 1) {
        let tempMem = [...calcMem, calcDisp];
        let tempDisp = recalc(tempMem);
        setCalcMem((prev) => [...prev, calcDisp, '=', tempDisp]);
        setCalcDisp(tempDisp);
        setSaveIco('<');
      }
    };

    const handleDel = (operand) => {
      if (operand === 'C' && calcDisp !== '') {
        setCalcDisp('');
        setDelKey(calcMem.length > 0 ? 'CE' : 'C');
      } else if (operand === 'CE') {
        if (calcDisp !== '') {
          setCalcDisp('');
          setDelKey('CE');
        } else {
          setCalcMem([]);
          setDelKey('C');
        }
      }
    };

    const saveCalc = () => {
      let name = `calc_${calcMemCount}`;
      let newCalc = calcMem.map(a => (typeof +(a) == 'number' && !isNaN(a)) ? +(a) : a);
      setCalcStorage((prev) => ({
        ...prev,
        [name]: {
          'calculation': newCalc,
          'comments': newCalc.slice(0,-2).map(a => (typeof a == 'number' && a !== '=') ? '...' : null).concat(null, null),
          'name': name
        }
      }));
      setCalcMemCount((prev) => prev + 1);
      setSaveIco('');
      setCalcMem([]);
      setCalcDisp('')
    };

    const sel = document.querySelector('.container');
    sel.addEventListener('click', handleClick);

    return () => {
      sel.removeEventListener('click', handleClick);
    }
    
  }, [calcDisp, calcMem, calcOp, delKey, saveIco, calcStorage, calcMemCount]);

  // handle KEYDOWNS
  useEffect(() => {
    const handleKey = (e) => {
      const data = e.target.dataset;
      const type = data.type;
      const parent = data.idparent;
      const index = data.index;
      const inner = e.target.innerHTML;
      
      if (e.key === 'Enter') {
        e.target.setAttribute('contenteditable', false);

        if (type === 'header') {
          console.log(calcStorage[parent]['name']);
          calcStorage[parent]['name'] = inner;
        }

        if (type === 'comment') {
          console.log(calcStorage[parent]['comments'][index]);
          console.log(calcStorage);
          calcStorage[parent]['comments'][index] = inner;
        }

        if (type === 'number') {
          let thisCalc = calcStorage[parent]['calculation'].map((a,b) => (b == index) ? +(inner) : a);
          let newObj = {
            ...calcStorage[parent],
            calculation: [...thisCalc.slice(0,-1), recalc(thisCalc)]
          }
          setCalcStorage((prev) => ({
            ...prev,
            [parent]: newObj
          }))
          console.log(calcStorage);
        }
      }
    };

    const sel = document.querySelector('.container');
    sel.addEventListener('keydown', handleKey);

    return () => {
      sel.removeEventListener('keydown', handleKey)
    }
  }, [calcStorage])

  useEffect(() => {
    console.log(calcStorage);
  }, [calcStorage]);

  return (
    <div id="calc-main" className='calc-grid'>
      <CalcMemory calcGenStorage={calcStorage}/>
      <CalcDisplay saveIco={saveIco} calcDisp={calcDisp} calcMem={calcMem} menuIcon={menuIcon} />
      <CalcKeys delKey={delKey}/>
    </div>
  )
}

// eslint-disable-next-line react/prop-types
const CalcKeys = ({ delKey }) => {

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
      <button id="AC-key" className="op6">{delKey}</button>
      <button className="op7">=</button>
    </div>
  )
};

// eslint-disable-next-line react/prop-types
const CalcDisplay = ({ calcDisp, calcMem, saveIco, menuIcon }) => {
  return(
    <div className="calc-display">
        <div id="menu-icon-place" className="storage-window">{menuIcon}</div>
        <div className="calc-current">{calcDisp}</div>
        <div className="calc-mem">{calcMem}</div>
        <div><span className="save-button saveIcon" id="save-icon-place">{saveIco}</span></div>
    </div>
  )
}

const CalcMemory = ( { calcGenStorage } ) => {
  return(
    <div id="calc-mem-storage" className="calc-mem-storage">
      {
        Object.entries(calcGenStorage).map(([key, { calculation, comments, name }]) => (
          <div className='storage-item' key={key} id={key}>
            <div>
              <h3>
                <span className="editable" data-type="header" data-idparent={key}>{ name }</span> 
                <button className="delete-mem" data-type="deleteButton" data-idparent={key}>x</button>
              </h3>
            </div>
            {calculation.map((a,b) => {
              if (typeof a === 'number') {
                return (
                  <div key={b}>
                    <strong>
                      <span className="editable" data-type="number" data-idparent={key} data-index={b}>
                        {a}
                      </span>
                    </strong>
                    <span className="editable" data-type="comment" data-idparent={key} data-index={b}>
                      {comments[b]}
                    </span>
                  </div>
                )
              } else {
                return (
                <span key={b} className="editable" data-type="operator" data-idparent={key} data-index={b}>
                  {a}
                </span>
                )
              }

            })}

          </div>
        ))
      }
    </div>
  )
}
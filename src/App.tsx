import React, {useEffect, useState} from 'react';
import {ReactComponent as Icon} from './logo.svg';
import './App.css';
import data from './data/data.json'
import {Box, Button} from "@mui/material";

function App() {
  const COLORS = {
    wrong: "#e95a5a",
    true: "#62cd62",
    default: "#61DAFB",
  }

  const [answerIndexes, setAnswerIndexes] = useState([0, 1, 2, 3]);
  const [taskIndex, setTaskIndex] = useState(randomInteger(0, data.lessonTasks.length - 1));
  const [trueAnswerIndex, setTrueAnswerIndex] = useState(randomInteger(0, Object.keys(data.lessonTasks[taskIndex]).length - 1));
  const [currentColor, setCurrentColor] = useState(COLORS.default);
  const [lastWasWrong, setLastWasWrong] = useState(false);


  useEffect(() => {
    setNewWord();
  }, [])

  function handleClick(i: number) {
    if (checkAnswer(i)) {
      setCurrentColor(() => COLORS.true)
      setNewWord()
    } else {
      setCurrentColor(() => COLORS.wrong)
      setLastWasWrong(() => true)
    }
  }

  function handleGotIt() {
    setLastWasWrong(() => false)
    setCurrentColor(() => COLORS.default)
    setNewWord()
  }


  function setNewWord() {
    const taskIndex = randomInteger(0, data.lessonTasks.length - 1);
    const wordIndex = randomInteger(0, Object.keys(data.lessonTasks[taskIndex]).length - 1);

    setAnswerIndexes(() => getAnswerIndexes(taskIndex, wordIndex))
    setTaskIndex(taskIndex);
    setTrueAnswerIndex(wordIndex);
  }


  function getAnswerIndexes(taskIndex: number, wordIndex: number): number[] {
    let counter = 1;
    const arr = new Array(4).fill(null)
    let emptyIndexes: number[] = [0,1,2,3];

    const truePosition = randomInteger(0, 3)
    arr[truePosition] = wordIndex;
    emptyIndexes = emptyIndexes.filter((el) => el !== truePosition)

    while(counter < 4) {
      const i = randomInteger(0, Object.keys(data.lessonTasks[taskIndex]).length - 1)

      if (!arr.includes(i)) {
        arr[emptyIndexes.pop() as number] = i;
        counter++
      }
    }

    return arr;
  }

  function checkAnswer(i: number) {
    if (trueAnswerIndex === i) {
      return true
    }

    return false
  }


  return (
    <div className="App">
      <header className="App-header">
        <Icon style={{fill: currentColor, transition: "0.5s"}} className="App-logo"/>
        <h2>{Object.keys(data.lessonTasks[taskIndex])[trueAnswerIndex]}</h2>
        {!lastWasWrong ?
        <>
          <Box style={{minWidth: "90%"}} component="div" sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            {answerIndexes.map((el, i) => (
                <Button key={i} size="small" style={{ minHeight: "40px"}} sx={{ m: 0.5}} onClick={() => handleClick(el)} variant="contained">{Object.values(data.lessonTasks[taskIndex])[el]}</Button>
            ))}
          </Box>
        </> :
        <>
          <h3>{Object.values(data.lessonTasks[taskIndex])[trueAnswerIndex]}</h3>
          <Button style={{minWidth: "50%", minHeight: "40px"}} sx={{ m: 0.5}} onClick={() => handleGotIt()} variant="outlined">Got it!</Button>
        </>
        }
      </header>
    </div>
  );
}

function randomInteger(min: number, max: number): number {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

export default App;

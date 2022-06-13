import React, {useEffect, useState} from 'react';
import {ReactComponent as Icon} from './logo.svg';
import './App.css';
import data1 from './data/1A.json'
import data2 from './data/1B.json'
import data3 from './data/2A.json'
import data4 from './data/2B.json'
import data5 from './data/zero.json'
import {Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select} from "@mui/material";
import VolumeMuteRoundedIcon from '@mui/icons-material/VolumeMuteRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

function App() {
  const COLORS = {
    wrong: "#e95a5a",
    true: "#62cd62",
    default: "#61DAFB",
  }

  const wordsAll = [
    {
      name: "zero",
      data: data1
    },
    {
      name: "1A",
      data: data2
    },
    {
      name: "1B",
      data: data3
    },
    {
      name: "2A",
      data: data4
    },
    {
      name: "2B",
      data: data5
    },
  ]

  const [wordsId, setWordsId] = useState(0);
  const [answerIndexes, setAnswerIndexes] = useState([0, 1, 2, 3]);
  const [wordIndex, setWordIndex] = useState(randomInteger(0, wordsAll[wordsId].data.length - 1));
  const [currentColor, setCurrentColor] = useState(COLORS.default);
  const [mute, setMute] = useState(true);
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

  function handleFormClick(e: any) {
    setWordsId(() => e.target.value)
    setNewWord(e.target.value)
  }

  function handleGotIt() {
    setLastWasWrong(() => false)
    setCurrentColor(() => COLORS.default)
    setNewWord()
  }

  function handleSoundButtonClick(data: boolean) {
    setMute(() => data)
  }

  function setNewWord(i?: number) {
    let index = i || wordsId;
    const trueAnswerIndex = randomInteger(0, wordsAll[index].data.length - 1);

    setAnswerIndexes(() => getAnswerIndexes(trueAnswerIndex, i))
    setWordIndex(() => trueAnswerIndex)

    playSound(trueAnswerIndex)
  }

  function playSound(index: number) {
    if (!mute) {
      new Audio("https://friends-storage.ams3.digitaloceanspaces.com/words_audio/1_wavenet/" + wordsAll[wordsId].data[index].soundName).play()
    }
  }

  function getAnswerIndexes(trueAnswerIndex: number, i?: number): number[] {
    const index = i || wordsId;
    let counter = 1;
    const arr = new Array(4).fill(null)
    let emptyIndexes: number[] = [0,1,2,3];

    const truePosition = randomInteger(0, 3)
    arr[truePosition] = trueAnswerIndex;
    emptyIndexes = emptyIndexes.filter((el) => el !== truePosition)

    while(counter < 4) {
      const i = randomInteger(0, wordsAll[index].data.length - 1)

      if (!arr.includes(i)) {
        arr[emptyIndexes.pop() as number] = i;
        counter++
      }
    }

    return arr
  }

  function checkAnswer(i: number) {
    if (wordIndex === i) {
      return true
    }

    return false
  }


  return (
    <div className="App">
      <header className="App-header">
        <div className="formWrapper">
          <FormControl fullWidth color="primary">
            <InputLabel id="demo-simple-select-label">Unit</InputLabel>
            <Select
                style={{color: "white"}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={wordsId}
                label="Unit"
                onChange={handleFormClick}
            >
              {
                wordsAll.map((el, i) => (
                    <MenuItem key={i} value={i}>{el.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        <div className="muteWrapper">
          <IconButton onClick={() => playSound(wordIndex)} color="primary" size="large">
            <PlayArrowRoundedIcon fontSize="inherit" />
          </IconButton>
          {mute ? <IconButton onClick={() => handleSoundButtonClick(false)} color="primary" size="large">
            <VolumeMuteRoundedIcon fontSize="inherit" />
          </IconButton> :
            <IconButton onClick={() => handleSoundButtonClick(true)} color="primary" size="large">
              <VolumeUpRoundedIcon fontSize="inherit" />
            </IconButton>
          }

        </div>
        <Icon style={{fill: currentColor, transition: "0.5s"}} className="App-logo"/>
        <h2>{wordsAll[wordsId].data[wordIndex].word}</h2>
        {!lastWasWrong ?
        <>
          <Box style={{minWidth: "90%"}} component="div" sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            {answerIndexes.map((el, i) => (
                <Button key={i} size="small" style={{ minHeight: "40px"}} sx={{ m: 0.5}} onClick={() => handleClick(el)} variant="contained">{wordsAll[wordsId].data[el].translation}</Button>
            ))}
          </Box>
        </> :
        <>
          <h3>{wordsAll[wordsId].data[wordIndex].translation}</h3>
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

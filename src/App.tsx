import React, {useEffect, useState} from 'react';
import {ReactComponent as Icon} from './logo.svg';
import './App.css';
import data1 from './data/1A.json'
import data2 from './data/1B.json'
import data3 from './data/2A.json'
import data4 from './data/2B.json'
import data5 from './data/zero.json'
import {Box, Button, IconButton} from "@mui/material";
import VolumeMuteRoundedIcon from '@mui/icons-material/VolumeMuteRounded';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';

function App() {
  const COLORS = {
    wrong: "#e95a5a",
    true: "#62cd62",
    default: "#61DAFB",
  }

  const words = [
    ...data1,
    ...data2,
    ...data3,
    ...data4,
    ...data5
  ];

  const [answerIndexes, setAnswerIndexes] = useState([0, 1, 2, 3]);
  const [wordIndex, setWordIndex] = useState(randomInteger(0, words.length - 1));
  const [currentColor, setCurrentColor] = useState(COLORS.default);
  const [mute, setMute] = useState(true);


  useEffect(() => {
    setNewWord();
  }, [])

  function handleClick(i: number) {
    if (checkAnswer(i)) {
      setCurrentColor(() => COLORS.true)
    } else {
      setCurrentColor(() => COLORS.wrong)
    }

    setNewWord()
  }

  function handleSoundButtonClick(data: boolean) {
    setMute(() => data)
  }

  function setNewWord() {
    const trueAnswerIndex = randomInteger(0, words.length - 1);

    setAnswerIndexes(() => getAnswerIndexes(trueAnswerIndex))
    setWordIndex(() => trueAnswerIndex)

    playSound(trueAnswerIndex)
  }

  function playSound(index: number) {
    if (!mute) {
      new Audio("https://friends-storage.ams3.digitaloceanspaces.com/words_audio/1_wavenet/" + words[index].soundName).play()
    }
  }

  function getAnswerIndexes(trueAnswerIndex: number): number[] {
    let counter = 1;
    const arr = new Array(4).fill(null)
    let emptyIndexes: number[] = [0,1,2,3];

    const truePosition = randomInteger(0, 3)
    arr[truePosition] = trueAnswerIndex;
    emptyIndexes = emptyIndexes.filter((el) => el !== truePosition)

    while(counter < 4) {
      const index = randomInteger(0, words.length - 1)

      if (!arr.includes(index)) {
        arr[emptyIndexes.pop() as number] = index;
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
        <h2>{words[wordIndex].word}</h2>
        <Box style={{minWidth: "90%"}} component="div" sx={{ display: 'flex', justifyContent: 'center' }}>
          {answerIndexes.slice(0, 2).map((el, i) => (
            <Button key={i} style={{minWidth: "50%", minHeight: "40px"}} sx={{ m: 0.5}} onClick={() => handleClick(el)} variant="outlined">{words[el].translation}</Button>
          ))}
        </Box>
        <Box style={{minWidth: "90%"}} component="div" sx={{ display: 'flex', justifyContent: 'center' }}>
          {answerIndexes.slice(2, 4).map((el, i) => (
            <Button key={i} style={{minWidth: "50%", minHeight: "40px"}} sx={{ m: 0.5}} onClick={() => handleClick(el)} variant="outlined">{words[el].translation}</Button>
          ))}
        </Box>
      </header>
    </div>
  );
}

function randomInteger(min: number, max: number): number {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

export default App;

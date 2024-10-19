import React from 'react';
import './App.css';

import GameScreen from './components/GameScreen.jsx';
import StartScreen from './components/StartScreen.jsx';
import HotKeys from './components/HotKeys.jsx';
import History from './components/History.jsx';
import Settings from './components/Settings.jsx';

/**
 * SOURCES
 */
// https://en.wikipedia.org/wiki/Doomsday_rule
// https://davecturner.github.io/2021/12/27/doomsday-rule.html

const generateQuestion = (mode, difficulty) => {
  const CENTURIES = {
    easy: [18, 19, 19, 19, 20, 20, 20, 21],
    normal: [16, 17, 18, 19, 19, 20, 20, 21],
    hard: [12, 13, 14, 15, 16, 17, 17, 18, 18, 19, 19, 19, 20, 20, 20, 21, 21, 22, 22, 23, 24, 25, 26],
  }

  const MONTHS = {
    easy: [1, 2, 10],
    normal: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    hard: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  }
  const MONTH_DAYS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const MONTH_DOOMS = [4, 0, 0, 3, 5, 1, 3, 6, 2, 4, 0, 2];


  let century = 0;
  let year = 0;
  let month = 0;
  let date = 0;
  let leapYear = 0;

  switch (mode) {
    case 'game':
      century = CENTURIES[difficulty][Math.floor(Math.random() * CENTURIES[difficulty].length)]
      year = Math.floor(Math.random() * 100);
      month = MONTHS[difficulty][Math.floor(Math.random() * MONTHS[difficulty].length)];
      date = Math.ceil(Math.random() * MONTH_DAYS[month]);
      leapYear = ((century * 100 + year) % 4 === 0) && ((century * 100 + year) % 100 !== 0);
      break;

    case 'century':
      century = CENTURIES[difficulty][Math.floor(Math.random() * CENTURIES[difficulty].length)]
      year = 0;
      month = 10;
      date = 7;
      break;

    case 'year':
      century = 21;
      year = Math.floor(Math.random() * 100);
      month = 10;
      date = 7;
      break;

    case 'month':
      century = 21;
      year = 0;
      month = MONTHS[difficulty][Math.floor(Math.random() * MONTHS[difficulty].length)];
      date = 7;
      break;

    default:
      break;
  }
  const centuryHint = (((century % 4) * 5) + 2) % 7;
  const yearHint = Math.floor(year / 12) + (year % 12) + Math.floor((year % 12) / 4);
  const monthHint = MONTH_DOOMS[month];
  const dateHint = date % 7;
  const leapYearHint = (leapYear && [0, 1].includes(month)) ? -1 : 0;

  const doomsday = (centuryHint + yearHint + monthHint + dateHint + leapYearHint) % 7;

  return {
    century,
    centuryHint,

    year,
    yearHint,

    month,
    monthHint,

    date,
    dateHint,

    leapYear,
    leapYearHint,

    doomsday,
    mode,
    difficulty,

    fullDate: new Date(century * 100 + year, month, date),
  }
}

const defaultSettings = {
  difficulty: 'normal',
  hints: false,
  mode: 'game',

  locale: 'en-US',
  firstDay: 'monday',
};

const settingsOptions = {
  difficulty: [
    {
      id: 'difficulty-easy',
      value: 'easy',
      label: 'Easy',
    },
    {
      id: 'difficulty-normal',
      value: 'normal',
      label: 'Normal',
    },
    {
      id: 'difficulty-hard',
      value: 'hard',
      label: 'Hard',
    },
  ],
  locale: [
    {
      id: 'locale-US',
      value: 'en-US',
      label: 'Month Day, Year'
    },
    {
      id: 'locale-UK',
      value: 'en-UK',
      label: 'Day Month, Year'
    },
  ],
  hints: [
    {
      id: 'hints-off',
      value: false,
      label: 'Off',
    },
    {
      id: 'hints-on',
      value: true,
      label: 'On',
    },
  ],
  mode: [
    {
      id: 'mode-game',
      value: 'game',
      label: 'Full Date',
    },
    {
      id: 'mode-month',
      value: 'month',
      label: 'Month Only',
    },
    {
      id: 'mode-century',
      value: 'century',
      label: 'Century Only',
    },
    {
      id: 'mode-year',
      value: 'year',
      label: 'Year Only',
    },
  ],
  firstDay: [
    {
      id: 'firstDay-monday',
      value: 'monday',
      label: 'Monday',
    },
    {
      id: 'firstDay-Sunday',
      value: 'sunday',
      label: 'Sunday',
    },
  ],
};

export default function App() {

  const [screen, setScreen] = React.useState('start');
  const [settings, setSettings] = React.useState(defaultSettings);

  const [question, setQuestion] = React.useState({});
  const [guesses, setGuesses] = React.useState([]);

  const [history, setHistory] = React.useState([]);

  const onStart = () => {
    setHistory([]);
    setGuesses([]);
    setQuestion(generateQuestion(settings?.mode, settings?.difficulty));
    setScreen('game');
  };

  const onNext = () => {
    commitHistory();
    setGuesses([]);
    setQuestion(generateQuestion(settings?.mode, settings?.difficulty));
  }

  const onGuess = (newGuess) => {
    setGuesses([
      ...guesses,
      newGuess,
    ]);
  };

  const commitHistory = () => {
    setHistory([
      {
        ...question,
        result: guesses?.[0] === question.doomsday ? 'correct' : 'incorrect',
      },
      ...history,
    ]);
  }

  const updateSetting = (key = undefined, value = undefined, regenerateQuestion = true) => {
    if (value === undefined) {
      let nextSetting = settingsOptions[key].map((v) => v.value).findIndex((v) => v === settings[key]);
      nextSetting = settingsOptions[key][(nextSetting + 1) % settingsOptions[key].length]['value'];

      let newSettings = { ...settings };
      newSettings[key] = nextSetting;

      setSettings(newSettings);
      if(regenerateQuestion){
        setQuestion(generateQuestion(newSettings.mode, newSettings.difficulty));
      }
    } else if (key === undefined) {
      setSettings(value)
      if(regenerateQuestion){
        setQuestion(generateQuestion(value?.mode, value?.difficulty));
      }
    } else {
      let newSettings = { ...settings };
      newSettings[key] = value;

      setSettings(newSettings);
      if(regenerateQuestion){
        setQuestion(generateQuestion(newSettings.mode, newSettings.difficulty));
      }
    }
  }

  return (
    <>
      <StartScreen
        screen={screen}
        started={question?.fullDate}
        onStart={onStart}
        setScreen={setScreen}
      />

      <GameScreen
        screen={screen}

        settings={settings}

        question={question}
        onNext={onNext}

        guesses={guesses}
        onGuess={onGuess}
      />

      <History
        screen={screen}
        history={history}
        settings={settings}
      />

      <Settings
        screen={screen}
        setScreen={setScreen}

        started={question?.fullDate}

        settings={settings}
        updateSetting={updateSetting}
        settingsOptions={settingsOptions}
      />

      <HotKeys 
        screen={screen}
        setScreen={setScreen}

        question={question}
        onStart={onStart}
        onNext={onNext}

        updateSetting={updateSetting}

        guesses={guesses}
        onGuess={onGuess}
      />

    </>
  );
}
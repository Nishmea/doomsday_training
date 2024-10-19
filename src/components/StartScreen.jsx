import React from 'react';
import './StartScreen.css';

export default function StartScreen({
  screen,
  started,
  onStart,
  setScreen,
}) {

  // React.useEffect(() => {
  //   if (screen !== 'start') {
  //     return;
  //   }

  //   function keyDownHandler(event) {
  //     if (['Enter', ' '].includes(event.key)) {
  //       event.preventDefault();
  //       if (started) {
  //         setScreen('game');
  //         console.debug('Resume Game Key')
  //       } else {
  //         onStart();
  //         console.debug('New Game Key')
  //       }
  //     }
  //     if (event.code === 'KeyS' && event.altKey) {
  //       event.preventDefault();
  //       setScreen('settings');
  //     }
  //   }

  //   document.addEventListener("keydown", keyDownHandler);

  //   return () => {
  //     document.removeEventListener("keydown", keyDownHandler);
  //   };
  // }, [screen, started, onStart, setScreen]);

  if (screen !== 'start') {
    return null;
  }

  return (
    <div className={'start-screen'}>

      <h1>
        Doomsday Practice
      </h1>

      <h2>
        Inspired by John Conway's `Doomsday Algorithm` for calculating the day of week for any date.
      </h2>

      <button onClick={started ? () => setScreen('game') : onStart}>
        {started ? 'RESUME' : 'START'}
      </button>

    </div>
  );
}
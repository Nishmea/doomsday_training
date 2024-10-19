import React from 'react';
import './GameScreen.css';

const DAYS_OF_WEEK = {
  'monday': [
    {id: 1, label: 'Monday'},
    {id: 2, label: 'Tuesday'},
    {id: 3, label: 'Wednesday'},
    {id: 4, label: 'Thursday'},
    {id: 5, label: 'Friday'},
    {id: 6, label: 'Saturday'},
    {id: 0, label: 'Sunday'},
  ],
  'sunday': [
    {id: 0, label: 'Sunday'},
    {id: 1, label: 'Monday'},
    {id: 2, label: 'Tuesday'},
    {id: 3, label: 'Wednesday'},
    {id: 4, label: 'Thursday'},
    {id: 5, label: 'Friday'},
    {id: 6, label: 'Saturday'},
  ],
};

// Number of attempts before allowed to skip
const SKIP_THRESHOLD = 2;

export default function GameScreen({
  screen,
  settings,
  question,
  guesses,
  onGuess,
  onNext,
}) {

  /**
   * Current Guess
   * Gets the latest guess from the list of guesses
   */
  const currentGuess = React.useMemo(() => {
    return guesses.length > 0 ? guesses[guesses.length - 1] : false;
  }, [guesses]);

  const isDone = React.useMemo(() => {
    return currentGuess === question.doomsday;
  }, [currentGuess, question]);

  const canSkip = React.useMemo(() => {
    return !isDone && (guesses.length >= SKIP_THRESHOLD);
  }, [isDone, guesses]);

  const renderChallenge = React.useMemo(() => {
    if (!question?.fullDate) {
      return '-';
    }
    switch (question?.mode) {
      case 'game':
        return question.fullDate.toLocaleString(settings.locale, { month: 'long', day: 'numeric', year: 'numeric' });
      case 'century':
        return question.fullDate.toLocaleString('en-US', { year: 'numeric' });
      case 'year':
        return `'${question.fullDate.toLocaleString('en-US', { year: '2-digit' })}`;
      case 'month':
        return question.fullDate.toLocaleString('en-US', { month: 'long' });
      default:
        return question.fullDate.toLocaleDateString();
    }
  }, [question, settings]);

  const renderHint = React.useMemo(() => {
    if (!settings.hints) {
      return null;
    }
    if (!question?.fullDate) {
      return '-';
    }
    switch (settings.locale) {
      case 'en-US':
        return `${question.monthHint} ${question.dateHint} ${question.centuryHint} ${question.yearHint} ${question.leapYearHint ? '!' : ''}`;
      case 'en-UK':
        return `${question.dateHint} ${question.monthHint} ${question.centuryHint} ${question.yearHint} ${question.leapYearHint ? '!' : ''}`;
      default:
        return `${question.monthHint} ${question.dateHint} ${question.centuryHint} ${question.yearHint} ${question.leapYearHint ? '!' : ''}`;
    }
  }, [question, settings]);

  if (screen !== 'game') {
    return null;
  }

  return (
    <div className={'game-screen'}>

      <h1>
        {renderChallenge}
      </h1>

      <h2>
        {renderHint}
      </h2>

      <div className={'control-buttons'}>
        {DAYS_OF_WEEK[settings.firstDay].map((day) => (
          <button
            key={day.id}
            className={!guesses.includes(day.id) ? 'skipped' : (question?.doomsday === day.id ? 'correct' : 'incorrect')}
            onClick={() => onGuess(day.id)}
            disabled={isDone}
          >
            {day.label}
          </button>
        ))}

        {(isDone || canSkip) && (
          <button className={isDone ? 'next' : 'skip'} onClick={onNext}>
            {isDone ? 'next' : 'skip'}
          </button>
        )}

      </div>
    </div>
  );
}
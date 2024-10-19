import React from "react";

// Number of attempts before allowed to skip
const SKIP_THRESHOLD = 2;

export default function HotKeys({
    screen,
    setScreen,
    onNext,
    updateSetting,
    question,
    guesses,
    onGuess,
    onStart,
}) {

    const currentGuess = React.useMemo(() => {
        return guesses.length > 0 ? guesses[guesses.length - 1] : false;
    }, [guesses]);

    const isDone = React.useMemo(() => {
        return currentGuess === question.doomsday;
    }, [currentGuess, question]);

    const canSkip = React.useMemo(() => {
        return !isDone && (guesses.length >= SKIP_THRESHOLD);
    }, [isDone, guesses]);

    React.useEffect(() => {

        function onStartGame(event) {
            if (['start'].includes(screen) && ['Enter', ' '].includes(event.key)) {
                event.preventDefault();
                if (question?.fullDate) {
                    setScreen('game');
                } else {
                    onStart();
                }
            }
        }

        function onEscapeGame(event) {
            if (['Escape'].includes(event.key)) {
                event.preventDefault();
                setScreen('start');
            }
        }

        /**
         * Submit a Guess
         * @param {React.KeyboardEvent} event 
         */
        function onSubmitGuess(event) {
            if (['game'].includes(screen) && !isDone && RegExp('\\d{1}').test(event.key)) {
                event.preventDefault();
                onGuess(Number(event.key) % 7);
            }
        }

        function onNextQuestion(event) {
            if (['game'].includes(screen) && ['Enter', ' '].includes(event.key)) {
                event.preventDefault();
                if (isDone || canSkip) {
                    onNext();
                }
            }
        }

        function onOpenSettings(event) {
            if (event.code === 'KeyS' && event.altKey) {
                event.preventDefault();
                setScreen('settings');
            }
        }

        function onChangeSettings(event) {
            if (['KeyD', 'KeyF', 'KeyH', 'KeyL', 'KeyM'].includes(event.code)) {
                event.preventDefault();
                switch (event.code) {
                    case 'KeyD':
                        updateSetting('difficulty');
                        break;
                    case 'KeyF':
                        updateSetting('firstDay', undefined, false);
                        break;
                    case 'KeyH':
                        updateSetting('hints', undefined, false);
                        break;
                    case 'KeyL':
                        updateSetting('locale', undefined, false);
                        break;
                    case 'KeyM':
                        updateSetting('mode');
                        break;
                }
            }
        }

        document.addEventListener("keydown", onStartGame);
        document.addEventListener("keydown", onEscapeGame);
        document.addEventListener("keydown", onSubmitGuess);
        document.addEventListener("keydown", onNextQuestion);
        document.addEventListener("keydown", onOpenSettings);
        document.addEventListener("keydown", onChangeSettings);

        return () => {
            document.removeEventListener("keydown", onStartGame);
            document.removeEventListener("keydown", onEscapeGame);
            document.removeEventListener("keydown", onSubmitGuess);
            document.removeEventListener("keydown", onNextQuestion);
            document.removeEventListener("keydown", onOpenSettings);
            document.removeEventListener("keydown", onChangeSettings);
        };
    }, [screen, question, isDone, canSkip, setScreen, onStart, onGuess, onNext, updateSetting]);


    return null;
}
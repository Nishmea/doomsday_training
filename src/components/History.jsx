import React from "react";
import './History.css';

export default function History({
    screen,
    history,
    settings,
}) {
    const modeHistory = React.useMemo(() => {
        return history.filter((h) => h.mode === settings.mode);
    }, [history, settings]);

    const score = React.useMemo(() => {
        return modeHistory.filter((h) => h.result === 'correct').length;
    }, [modeHistory, settings]);

    const streak = React.useMemo(() => {
        const streakString = modeHistory.map((h) => (h?.result === 'correct' ? '1' : '0')).join('');
        const streaks = (streakString.match(/^(1)\1*/g) || []).map(str => str.length);
        const longestStreak = Math.max(0, ...streaks);
        return longestStreak;
    }, [modeHistory]);

    const longestStreak = React.useMemo(() => {
        const streakString = modeHistory.map((h) => (h?.result === 'correct' ? '1' : '0')).join('');
        const streaks = (streakString.match(/(1)\1*/g) || []).map(str => str.length);
        const longestStreak = Math.max(0, ...streaks);
        return longestStreak;
    }, [modeHistory]);

    const renderChallenge = (date, mode) => {
        switch (mode) {
            case 'game':
                return date.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', weekday: 'short' })
            case 'century':
                return date.toLocaleString('en-US', { weekday: 'short', year: 'numeric' })
            case 'year':
                return date.toLocaleString('en-US', { weekday: 'short', year: '2-digit' })
            case 'month':
                return date.toLocaleString('en-US', { weekday: 'short', month: 'short' })
            default:
                return date.toLocaleDateString();
        }
    }

    if (screen !== 'game') {
        return null;
    }

    return (
        <>
            <div className={'history'}>
                {history.filter((h) => h?.mode === settings.mode).map((val, ind, arr) => (
                    <div className={'history-item'} key={ind}>
                        <h5>{arr.length - ind}</h5>
                        <h4 className={val.result}>
                            {renderChallenge(val.fullDate, val.mode)}
                        </h4>
                    </div>
                ))}
            </div>

            <div className={'high-score'}>
                <h4>{`Streak`}</h4>
                <h5>{streak}</h5>

                <h4>{`Longest`}</h4>
                <h5>{longestStreak}</h5>

                <h4>{`Overall`}</h4>
                <h5>{`${(Number(score / modeHistory.length) * 100).toFixed(0)}%`}</h5>
                {/* <h5>{`${score}`}</h5> */}

                <h4>{`Difficulty`}</h4>
                <h5>{settings.difficulty}</h5>

                <h4>{`Mode`}</h4>
                <h5>{settings.mode}</h5>
            </div>
        </>
    );
}
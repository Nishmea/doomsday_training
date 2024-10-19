import React from "react";

import './Settings.css';

export default function Settings({
    screen,
    started,
    settings,
    settingsOptions,
    setScreen,
    updateSetting,
}) {

    React.useEffect(() => {
        if (screen !== 'settings') {
            return;
        }

        function keyDownHandler(event) {
            if (['Escape'].includes(event.key)) {
                event.preventDefault();
                setScreen(started ? 'game' : 'start');
            }
            if (['KeyD'].includes(event.code)) {
                event.preventDefault();
                updateSetting('difficulty');
            }
            if (['KeyM'].includes(event.code)) {
                event.preventDefault();
                updateSetting('mode');
            }
            if (['KeyL'].includes(event.code)) {
                event.preventDefault();
                updateSetting('locale', undefined, false);
            }
            if (['KeyH'].includes(event.code)) {
                event.preventDefault();
                updateSetting('hints', undefined, false);
            }
        }

        // document.addEventListener("keydown", keyDownHandler);

        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, [screen, settings, started, setScreen, updateSetting]);

    if (screen !== 'settings') {
        return (
            <div className="settings-icon">
                <span
                    className="material-symbols-outlined"
                    onClick={() => setScreen('settings')}
                >
                    settings
                </span>
            </div>
        );
    }

    return (
        <div className={'settings'}>

            <h1>Settings</h1>

            <h2>
                Inspired by John Conway's `Doomsday Algorithm` for calculating the day of week for any date.
            </h2>

            <div className={'settings-bay'}>
                <fieldset className={'settings-item'}>
                    <legend>Difficulty</legend>

                    {settingsOptions.difficulty.map((d, i) => (
                        <div key={d.id} className={'settings-option'}>
                            <input
                                type='radio'
                                name="difficulty"
                                id={d.id}
                                value={d.value}
                                checked={settings.difficulty === d.value}
                                onChange={() => updateSetting('difficulty', d.value)}
                            />
                            <label htmlFor={d.id}>
                                {d.label}
                            </label>
                        </div>
                    ))}
                </fieldset>

                <fieldset className={'settings-item'}>
                    <legend>Mode</legend>

                    {settingsOptions.mode.map((d, i) => (
                        <div key={d.id} className={'settings-option'}>
                            <input
                                type='radio'
                                name="mode"
                                id={d.id}
                                value={d.value}
                                checked={settings.mode === d.value}
                                onChange={() => updateSetting('mode', d.value)}
                            />
                            <label htmlFor={d.id}>
                                {d.label}
                            </label>
                        </div>
                    ))}
                </fieldset>

                <fieldset className={'settings-item'} disabled={settings?.mode !== 'game'}>
                    <legend>Date Style</legend>

                    {settingsOptions.locale.map((d, i) => (
                        <div key={d.id} className={'settings-option'}>
                            <input
                                type='radio'
                                name="locale"
                                id={d.id}
                                value={d.value}
                                checked={settings.locale === d.value}
                                onChange={() => updateSetting('locale', d.value)}
                            />
                            <label htmlFor={d.id}>
                                {d.label}
                            </label>
                        </div>
                    ))}
                </fieldset>

                <fieldset className={'settings-item'}>
                    <legend>Week Start</legend>

                    {settingsOptions.firstDay.map((d, i) => (
                        <div key={d.id} className={'settings-option'}>
                            <input
                                type='radio'
                                name="firstDay"
                                id={d.id}
                                value={d.value}
                                checked={settings.firstDay === d.value}
                                onChange={() => updateSetting('firstDay', d.value)}
                            />
                            <label htmlFor={d.id}>
                                {d.label}
                            </label>
                        </div>
                    ))}
                </fieldset>

                <fieldset className={'settings-item'}>
                    <legend>Hints</legend>

                    {settingsOptions.hints.map((d, i) => (
                        <div key={d.id} className={'settings-option'}>
                            <input
                                type='radio'
                                name="hints"
                                id={d.id}
                                value={d.value}
                                checked={settings.hints === d.value}
                                onChange={() => updateSetting('hints', d.value)}
                            />
                            <label htmlFor={d.id}>
                                {d.label}
                            </label>
                        </div>
                    ))}
                </fieldset>
            </div>

            <div className={'settings-icon'}>
                <span
                    className="material-symbols-outlined"
                    onClick={() => setScreen(started ? 'game' : 'start')}
                >
                    {started ? 'reply' : 'home'}
                </span>
            </div>
        </div>
    );

}
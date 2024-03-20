import React, { useState, useEffect } from 'react';
import './game.css';
import generateGreenSq from './generaterandomsq';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
import { faFaceFrown, faFaceSmile } from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import ConfettiExplosion from 'react-confetti-explosion';
import { useNavigate } from "react-router-dom";
import { useCountdown } from './CountdownContext';
import { useSound } from 'use-sound';
import CorrectAudio from './audios-img/success.mp3';
import WrongAudio from './audios-img/fail.mp3';

function Game({newCountdown, resetGame}) {

    const { countdown, updateCountdown } = useCountdown();

    const [level,setLevel] = useState(1);
    // var levels = [[''],[3,3],[3,4],[4,4],[4,5],[4,6],[5,5],[5,6],[5,7],[6,6],[7,7]];
    var levels = [[''],[3,3],[3,4]];
    var gridSize = levels[level][0] ** 2;

    const [greensq, setGreenSq] = useState([]);
    const [timerActive, setTimerActive] = useState(false);
    const [correctsq, setCorrectSq] = useState([]);
    const [isDisabled, setIsDisabled] = useState(true);
    const [clicks, setClicks] = useState(0);
    const [score, setScore] = useState(0);
    const [chosensq, setChosenSq] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [feedback, setFeedback] = useState({});
    const [isExploding, setIsExploding] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [timeTaken, setTimeTaken] = useState(0);
    const [timeRunning, SetTimeRunning] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState('');
    const [play] = useSound(audio);
    const [animateContainer, setAnimateContainer] = useState(true);
    const [gameCompleted, setGameCompleted] = useState(false);

    useEffect(() => {
        updateCountdown(newCountdown); // Update countdown when newCountdown prop changes
        if (resetGame) {
            retryLevel();
        }
    }, [newCountdown]); // Run this effect whenever newCountdown changes

    useEffect(() => {
        setGreenSq(generateGreenSq(levels[level][1], gridSize));
        setTimerActive(true);
    }, [gridSize, level]);

    useEffect(() => {
        let interval;
        if (timerActive && countdown > 0) {
            interval = setInterval(() => {
                updateCountdown(countdown - 1);
            }, 1000);
        } else if (countdown === 0) {
            clearInterval(interval);
            setCorrectSq(greensq);
            setGreenSq([]);
            setIsDisabled(false);
            SetTimeRunning(true);
        }

        // Cleanup interval on unmount or when countdown reaches 0
        return () => clearInterval(interval);
    }, [timerActive, countdown]);

    useEffect(() => {
        let interval;

        // Update time elapsed every second if timer is running
        if (timeRunning) {
            interval = setInterval(() => {
                setTimeTaken(prevTime => prevTime + 1);
            }, 1000);
        }

        // Cleanup interval
        return () => clearInterval(interval);
    }, [timeRunning]);

    // checking if the num of clicks === num of green sq
    useEffect(() => {
        if (clicks === levels[level][1]) {
            setIsDisabled(true);
            const correctClicks = chosensq.filter(sq => correctsq.includes(sq)).length; // checking how many clicks were correct
            setScore(correctClicks);
            setShowModal(true);
        }
    }, [clicks, greensq, correctsq, level]);

    useEffect(() => {
        if (level === levels[level].length-1) {
            setIsExploding(true);
        }
    }, [isExploding]);

    // stop the timer when the modal is shown
    useEffect(() => {
        if (showModal) {
            SetTimeRunning(false);
        }
    }, [showModal]);

    // when player clicks on a sq
    const handleGridItemClick = (index) => {
        const audioContext = new AudioContext();
        audioContext.resume();
        if (!chosensq.includes(index)) { // checking if player clicked sq before
            if (correctsq.includes(index)) { // checking if player clicked the correct sq
                setChosenSq(chosensq => [...chosensq, index]);
                setFeedback({...feedback, [index]:'correct'});
                setAudio(CorrectAudio);
            } else {
                setFeedback({...feedback, [index]:'wrong'});
                setAudio(WrongAudio);
            }
            setIsPlaying(true);
            setClicks(prevClicks => prevClicks + 1);
        }
    };

    // supposed audio to work when player clicks on the cards
    useEffect(() => {
        if (isPlaying && audio !== '') {
            play();
            setIsPlaying(false);
        }
    }, [isPlaying]);

    // reset
    const resetGameState = () => {
        setShowModal(false);
        updateCountdown(newCountdown);
        setChosenSq([]);
        setClicks(0);
        setScore(0);
        setFeedback({});
        setTimeTaken(0);
        setAnimateContainer(true);
    };

    const retryLevel = () => {
        resetGameState();
        setTimerActive(true);
        setGreenSq(prevGreenSq => generateGreenSq(levels[level][1], gridSize));
        setAttempts(prevAttempt => prevAttempt + 1);
    };

    const levelUp = () => {
        resetGameState();
        setLevel(prevLevel => prevLevel + 1);
        if (level === levels.length-1) {
            // setShowModal(true);
            setIsExploding(true);
        } else {
            setTimerActive(false);
            setAttempts(1);
        }
    };

    const resetNewGame = () => {
        setLevel(1);
        setGameCompleted(false);
        resetGameState();
        setTimerActive(false);
        setAttempts(1);
        setIsExploding(false);
    };

    const onAnimationEnd = () => {
        setAnimateContainer(false); // Reset animation state after it completes
    };

    const gridColumns = `repeat(${levels[level][0]}, 1fr)`;

    const navigate = useNavigate();

    return (
        <div className={`container ${animateContainer ? 'slidein' : ''}`} onAnimationEnd={onAnimationEnd}>
            <div className='top'>
                <h1>Level {level}</h1>
                <h1><FontAwesomeIcon icon={faStopwatch} />  {countdown}</h1>
            </div>
            <div className="grid-container" style={{ gridTemplateColumns: gridColumns }}>
                {Array.from({ length: gridSize }, (_, index) => {
                    const isGreen = greensq.includes(index + 1);
                    const isCorrect = feedback[index + 1] === 'correct'
                    return (
                        <div
                            className={`grid-item ${(isDisabled) ? 'is-disabled' : ''}`}
                            key={index + 1}
                            style={isGreen ? { backgroundColor: '#32cd32aa', filter: 'drop-shadow(0px 0px 0px #000)' } : null}
                            onClick={() => handleGridItemClick(index + 1)}
                            aria-disabled={isDisabled}
                        >
                            {feedback[index+1] && <div className='feedback' style={isCorrect ? {backgroundColor: 'green'} : {backgroundColor: 'red'}}></div>}
                        </div>
                    );
                })}
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>{level === levels.length-1 ? 'Congratulations! You have successfully completed all levels' : score === levels[level][1] ? 'Level Passed!' : 'Level Failed'}</h2>
                            {isExploding && <ConfettiExplosion force={0.9} duration={5000} particleCount={250} width={2000}/>}
                            {level !== levels.length-1 && <p>Your score: {score}/{levels[level][1]} {score !== levels[level][1] ? <FontAwesomeIcon icon={faFaceFrown} /> : <FontAwesomeIcon icon={faFaceSmile} />}</p>}
                            {attempts > 1 && score === levels[level][1] && <p style={{fontSize:'small'}}>No. of Attemps: {attempts}</p>}
                            <p style={{fontSize:'small'}}>Time Taken: {timeTaken} second</p>
                            <div className="modal-buttons">
                                {level !== levels.length-1 && score !== levels[level][1] && <button onClick={retryLevel}>Retry</button>}
                                {score === levels[level][1] && level !== levels.length-1 && (
                                    <button onClick={levelUp}>Level Up</button>
                                )}
                                {level === levels.length-1 && <button onClick={() => navigate("/")}>Close</button>}
                                {level === levels.length-1 && (<button onClick={resetNewGame}>Play Again</button>
)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Game;
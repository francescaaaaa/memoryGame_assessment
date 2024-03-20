import './App.css';
import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { faGear, faHouse, faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { CountdownProvider } from './components/CountdownContext';
import bgMusic from './components/audios-img/bgmusic.mp3';
import Game from './components/game';
import LandingPage from './components/landingpage';

function App() {

  const audioRef = useRef(null);

  const [showSettings, setShowSettings] = useState(false);
  const [newCountdown, setNewCountdown] = useState(10);
  const [updateCountdown, setUpdateCountdown] = useState(10);
  const [resetGame, setResetGame] = useState(false);
  const [back, setBack] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const navigate = useNavigate();

  // when player clicks 'update' to change the default timer
  const handleCountdownChange = (newCountdownValue) => {
    if (newCountdownValue >= 3) {
      setUpdateCountdown(newCountdownValue);
      setShowSettings(false);
      setResetGame(true);
    } else {
      alert('Please enter a value that is more than 2');
    }
  };

  // when player clicks 'start game', make 'return to home' visible
  const handleStartGame = () => {
    setBack(true);
  };

  // redirect player to home
  const handleReturnToHome = () => {
    navigate("/");
    setBack(false);
  };

  // when the music play/stop icon is pressed
  const handleToggleMusic = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        setIsMusicPlaying(true)
        audioRef.current.play();
      } else {
        setIsMusicPlaying(false)
        audioRef.current.pause();
      }
    }
  };

  useEffect(() => {
    const audio = document.getElementById('audio');
    if (isMusicPlaying) {
      audio.play().catch(error => {
        // Handle error, for example:
        console.error('Failed to play audio:', error);
      });
    } else {
      audio.pause();
    }
  }, [isMusicPlaying]);

  return (
    <div className="App">
      <CountdownProvider>
        <audio id="audio" loop autoPlay ref={(audioRef)}>
          <source src={bgMusic} type='audio/mpeg'/>
        </audio>
        <div className='nav'>
          {back && (
            <div className='navitem' onClick={handleReturnToHome}>
              <FontAwesomeIcon icon={faHouse} size="lg"/>
              <div className='navitem-text'>
                <h3>Return to Home</h3>
              </div>
            </div> )
          }
          <div className='navitem'>
            <div className='navitem' onClick={()=>setShowSettings(true)}>
              <FontAwesomeIcon icon={faGear} size="lg"/>
              <div className='navitem-text'>
                <h3>Settings</h3>
              </div>
            </div>
            <div className='navitem' style={{marginLeft:"30px"}} onClick={handleToggleMusic}>
              <FontAwesomeIcon icon={isMusicPlaying ? faVolumeXmark : faVolumeHigh} size="lg" />
              <div className='navitem-text'>
                <h3>{isMusicPlaying ? 'Stop Music' : 'Play Music'}</h3>
              </div>
            </div>
          </div>
        </div>
        {showSettings && (
          <div className={`modal ${showSettings ? 'show' : ''}`}>
            <div className="modal-content">
              <h3 style={{marginBottom:'0px'}}>Game Settings</h3>
              <i className='info'>If you feel like the countdown timer is moving too quickly or too slowly, don't worry! <br></br> You can adjust the timer to your liking at any time</i>
              <p className='timerupdate'>
                Countdown Timing: <input value={newCountdown} onChange={(e) => setNewCountdown(e.target.value)}></input> seconds
              </p>
              <div className='settingbtn'>
                <button style={{backgroundColor:'orange'}} onClick={() => handleCountdownChange(newCountdown)}>Update</button>
                <button style={{backgroundColor:'white'}} onClick={() => setShowSettings(false)}>Close</button>
              </div>
            </div>
          </div>
        )}
          <Routes>
            <Route path="/" element={<LandingPage onStartGame={handleStartGame}/>} />
            <Route path="/game" element={<Game newCountdown={updateCountdown} resetGame={resetGame}/>} />
          </Routes>
      </CountdownProvider>
    </div>
  );
}

export default App;

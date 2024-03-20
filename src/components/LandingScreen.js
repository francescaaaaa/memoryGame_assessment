import React from 'react'
import { useNavigate } from "react-router-dom";
import './landingscreen.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBrain} from '@fortawesome/free-solid-svg-icons'

function LandingPage({onStartGame}) {
    const navigate = useNavigate();
    return (
        <div className='card'>
            <h1 className="card-header">Memory Game <FontAwesomeIcon icon={faBrain} /></h1>
            <div className="card-body">
            <div className='title'>
                <h3 className="card-title">Game Rules</h3>
            </div>
            <p className="card-text">
                <b>1. Remember the Green Squares:</b> You'll see a grid of squares, some colored <b style={{color:'green'}}>green</b>. <br></br><br></br>

                <b>2. Memorize Quickly:</b> Try to remember where the green squares are before the timer runs out. <br></br><br></br>

                <b>3. Click the Right Squares:</b> After the timer stops, the green squares disappear. Click on the squares where the green ones were. <br></br><br></br>

                <b>4. Level Up by Remembering:</b> If you remember all the green squares, you'll move to the next level. Each level gets a bit harder.
            </p>
            <button onClick={() => {navigate("/game"); onStartGame();}}>Start Game</button>
            </div>
        </div>
    );
}

export default LandingPage;
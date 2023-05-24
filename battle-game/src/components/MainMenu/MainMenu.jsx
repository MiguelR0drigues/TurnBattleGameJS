import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import hoverSoundFile from "../../assets/audio/button-hover.mp3";
import correctOptionSoundFile from "../../assets/audio/correct-option.mp3";

import "./MainMenu.css";

const MainMenu = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const hoverSoundRef = useRef(null);
  const correctOptionSoundRef = useRef(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const playHoverSound = () => {
    hoverSoundRef.current.currentTime = 0; // Reset the audio to the beginning
    hoverSoundRef.current.play();
  };

  const handleContinue = () => {
    correctOptionSoundRef.current.currentTime = 0;
    correctOptionSoundRef.current.play();
    navigate("./selection");
  };

  useEffect(() => {
    hoverSoundRef.current = new Audio(hoverSoundFile);
    hoverSoundRef.current.volume = 0.1;

    correctOptionSoundRef.current = new Audio(correctOptionSoundFile);
    correctOptionSoundRef.current.volume = 1.0;
  }, []);

  return (
    <div className="main-container">
      <div className="menu-container">
        <h1>Bem vindo!</h1>
        <div className="name-container">
          <label htmlFor="username">Escreve o teu nome</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            autoComplete="off"
            spellCheck="false"
          />
        </div>
        <button
          className={`continue-btn ${!username ? "disabled" : ""}`}
          onClick={handleContinue}
          disabled={!username}
          onMouseEnter={playHoverSound}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default MainMenu;

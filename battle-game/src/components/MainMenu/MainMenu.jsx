import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import hoverSoundFile from "../../assets/audio/button-hover.mp3";
import correctOptionSoundFile from "../../assets/audio/correct-option.mp3";

import "./MainMenu.css";

const MainMenu = () => {
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(undefined);
  const navigate = useNavigate();

  const hoverSoundRef = useRef(null);
  const correctOptionSoundRef = useRef(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    localStorage.setItem("username", event.target.value);
  };

  const handleAgeChange = (groupID) => {
    setAge(groupID);
    localStorage.setItem("ageGroupID", groupID);
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

    localStorage.setItem("ageGroupID", 1);
    localStorage.setItem("levelNumber", 1);
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
            maxLength={60}
          />
        </div>
        <h4 style={{ margin: 0, marginBottom: "-20px" }}>
          Seleciona a sua idade:
        </h4>
        <div className="groups-btns">
          <button
            className={`continue-btn  ${
              JSON.parse(localStorage.getItem("ageGroupID")) === 0
                ? " selected"
                : ""
            }`}
            onClick={() => handleAgeChange(1)}
            onMouseEnter={playHoverSound}
          >
            - 11
          </button>

          <button
            className={`continue-btn  ${
              JSON.parse(localStorage.getItem("ageGroupID")) === 1
                ? " selected"
                : ""
            }`}
            onClick={() => handleAgeChange(2)}
            onMouseEnter={playHoverSound}
          >
            11 - 13
          </button>

          <button
            className={`continue-btn  ${
              JSON.parse(localStorage.getItem("ageGroupID")) === 2
                ? "selected"
                : ""
            }`}
            onClick={() => handleAgeChange(3)}
            onMouseEnter={playHoverSound}
          >
            13 +
          </button>
        </div>
        <button
          className={`continue-btn ${!username || !age ? "disabled" : ""}`}
          onClick={handleContinue}
          disabled={!username || !age}
          onMouseEnter={playHoverSound}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default MainMenu;

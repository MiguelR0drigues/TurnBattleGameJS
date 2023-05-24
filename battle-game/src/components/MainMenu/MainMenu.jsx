import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./MainMenu.css";

const MainMenu = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

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
        <button className="continue-btn" onClick={() => navigate("/selection")}>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default MainMenu;

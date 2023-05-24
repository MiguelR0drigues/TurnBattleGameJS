import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import hoverSoundFile from "../../assets/audio/button-hover.mp3";
import correctOptionSoundFile from "../../assets/audio/correct-option.mp3";
import "./selection.css";

const Selection = () => {
  const [characters, setCharacters] = useState([]);
  const [selectedChar, setSelectedChar] = useState(undefined);
  const navigate = useNavigate();

  const hoverSoundRef = useRef(null);
  const correctOptionSoundRef = useRef(null);

  const chars = [
    { id: 1, name: "Eevee", image: "eevee.png" },
    { id: 2, name: "Meowth", image: "meowth.webp" },
    { id: 3, name: "Pikachu", image: "pikachu.png" },
    // Add more characters as needed
  ];

  const playHoverSound = () => {
    hoverSoundRef.current.currentTime = 0; // Reset the audio to the beginning
    hoverSoundRef.current.play();
  };

  const handleContinue = () => {
    correctOptionSoundRef.current.currentTime = 0;
    correctOptionSoundRef.current.play();
    navigate("/battle");
  };

  useEffect(() => {
    hoverSoundRef.current = new Audio(hoverSoundFile);
    hoverSoundRef.current.volume = 0.1;

    correctOptionSoundRef.current = new Audio(correctOptionSoundFile);
    correctOptionSoundRef.current.volume = 1.0;
  }, []);

  useEffect(() => {
    fetchCharacterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCharacterData = async () => {
    try {
      const charactersWithImages = chars.map((character) => {
        const imagePromise = import(`../../assets/avatars/${character.image}`);
        return { ...character, imagePromise, selected: false };
      });

      const charactersWithResolvedImages = await Promise.all(
        charactersWithImages.map(async (character) => ({
          ...character,
          image: (await character.imagePromise).default,
        }))
      );

      setCharacters(charactersWithResolvedImages);
    } catch (error) {
      console.log("Error fetching character data:", error);
    }
  };

  const handleCharacterSelect = (character) => {
    setCharacters((prevCharacters) =>
      prevCharacters.map((prevCharacter) => ({
        ...prevCharacter,
        selected: prevCharacter.id === character.id,
      }))
    );
    correctOptionSoundRef.current.currentTime = 0;
    correctOptionSoundRef.current.play();
    setSelectedChar(character);
  };

  return (
    <div className="main-container">
      <h1>Escolhe a tua personagem</h1>
      <div className="character-grid">
        {characters.map((character) => (
          <div
            key={character.id}
            className={`character-card ${character.selected ? "selected" : ""}`}
            onClick={() => handleCharacterSelect(character)}
            onMouseEnter={playHoverSound}
          >
            {character.selected && (
              <div className="selected-text">Selecionado</div>
            )}
            <img
              src={character.image}
              alt={character.name}
              className="character-image"
            />
            <span className="character-name">{character.name}</span>
          </div>
        ))}
      </div>
      <button
        className={`continue-btn ${!selectedChar ? "disabled" : ""}`}
        onClick={handleContinue}
        disabled={!selectedChar}
        onMouseEnter={playHoverSound}
      >
        Continuar
      </button>
    </div>
  );
};

export default Selection;

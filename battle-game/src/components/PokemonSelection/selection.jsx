import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./selection.css";

const Selection = () => {
  const [characters, setCharacters] = useState([]);
  const navigate = useNavigate();

  const chars = [
    { id: 1, name: "Eevee", image: "eevee.png" },
    { id: 2, name: "Meowth", image: "meowth.webp" },
    { id: 3, name: "Pikachu", image: "pikachu.png" },
    // Add more characters as needed
  ];

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
      <button className="continue-btn" onClick={() => navigate("/battle")}>
        Continuar
      </button>
    </div>
  );
};

export default Selection;

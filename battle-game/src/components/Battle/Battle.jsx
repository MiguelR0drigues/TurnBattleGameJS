import React, { useEffect, useRef, useState } from "react";
import "./Battle.css";
import opponentPokemon from "./charmander.png";
import yourPokemon from "./pikachu.png";

const Battle = () => {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [opponentHealth, setOpponentHealth] = useState(100);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState("");
  const [isPlayerShaking, setPlayerShaking] = useState(false);
  const [isOpponentShaking, setOpponentShaking] = useState(false);
  const [playerDamageTaken, setPlayerDamageTaken] = useState(false);
  const [opponentDamageTaken, setOpponentDamageTaken] = useState(false);

  const opponentHealthRef = useRef(null);
  const playerHealthRef = useRef(null);
  const opponentImageRef = useRef(null);
  const playerImageRef = useRef(null);

  useEffect(() => {
    // Fetch question and options from API
    fetchQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchQuestion = () => {
    // Make API call to fetch question and options
    // Replace this with your own API call implementation

    // Example API response structure
    const response = {
      question: "What is the capital of France?",
      incorrectOptions: ["London", "Berlin", "Rome"],
      correctOption: "Paris",
    };

    // Extract question, options, and correct option from the API response
    const { question, incorrectOptions, correctOption } = response;

    // Shuffle the options randomly
    const shuffledOptions = shuffleOptions([
      ...incorrectOptions,
      correctOption,
    ]);

    // Update state with the fetched question, shuffled options, and correct option
    setQuestion(question);
    setOptions(shuffledOptions);
    setCorrectOption(correctOption);
  };

  const shuffleOptions = (array) => {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  };

  const handlePlayerAnswer = (selectedOption) => {
    const isCorrect = selectedOption === correctOption;

    if (isCorrect) {
      // Calculate damage for correct answer
      const baseDamage = Math.floor(Math.random() * 21) + 15;
      const isCritical = Math.random() <= 0.05;
      const totalDamage = isCritical ? baseDamage + 10 : baseDamage;

      // Update opponent's health based on player's attack
      setOpponentHealth((prevHealth) => prevHealth - totalDamage);
      setOpponentDamageTaken(totalDamage);

      // Trigger animation by adding class to opponent health bar
      opponentHealthRef.current.classList.add("health-bar-animation");
      setTimeout(() => {
        // Remove animation class after animation duration (in milliseconds)
        opponentHealthRef.current.classList.remove("health-bar-animation");
      }, 1000); // Change the duration to match your animation duration

      // Shake your image by setting the state variable
      setPlayerShaking(true);
    } else {
      // Player answered incorrectly, opponent attacks
      const opponentDamage = calculateOpponentDamage();
      setPlayerHealth((prevHealth) => prevHealth - opponentDamage);
      setPlayerDamageTaken(opponentDamage);

      // Trigger animation by adding class to player health bar
      playerHealthRef.current.classList.add("health-bar-animation");
      setTimeout(() => {
        // Remove animation class after animation duration (in milliseconds)
        playerHealthRef.current.classList.remove("health-bar-animation");
      }, 1000); // Change the duration to match your animation duration

      // Shake opponent's image by setting the state variable
      setOpponentShaking(true);
    }

    // Fetch the next question for the player
    fetchQuestion();

    // Remove the shaking animation state after the animation finishes
    setTimeout(() => {
      setOpponentShaking(false);
      setPlayerShaking(false);
      setOpponentDamageTaken(undefined);
      setPlayerDamageTaken(undefined);
    }, 500); // Adjust the duration to match the animation duration
  };

  const calculateOpponentDamage = () => {
    const baseDamage = Math.floor(Math.random() * 21) + 5;
    const isCritical = Math.random() <= 0.05;

    if (isCritical) {
      const criticalDamage = Math.floor(Math.random() * 14) + 25;
      return criticalDamage;
    }

    return baseDamage;
  };

  return (
    <div className="battle-container">
      <div className="battle-background">
        <div className="opponent-container">
          <div className="opponent-health">
            <div className="pokemon-name">Charmander (Opponent)</div>
            <div className="pokemon-health-bar">
              <label htmlFor="opponent-health">HP </label>
              <progress
                ref={opponentHealthRef}
                id="opponent-health"
                value={opponentHealth}
                max="100"
              ></progress>
            </div>
            <div className="pokemon-health-number">{opponentHealth} / 100</div>
          </div>
          <div className="opponent-pokemon">
            {opponentDamageTaken && (
              <div className="damage-taken dt-opponent">
                -{opponentDamageTaken}
              </div>
            )}
            <img
              ref={opponentImageRef}
              src={opponentPokemon}
              alt="opponent pokemon"
              className={
                isOpponentShaking
                  ? "shake-animation"
                  : opponentDamageTaken
                  ? "blink-animation"
                  : ""
              }
            />
          </div>
        </div>
        <div className="player-container">
          <div className="your-pokemon">
            {playerDamageTaken && (
              <div className="damage-taken dt-player">-{playerDamageTaken}</div>
            )}
            <img
              ref={playerImageRef}
              src={yourPokemon}
              alt="your pokemon choice"
              className={
                isPlayerShaking
                  ? "shake-animation"
                  : playerDamageTaken
                  ? "blink-animation"
                  : ""
              }
            />
          </div>
          <div className="your-health">
            <div className="pokemon-name">Pikachu (You)</div>
            <div className="pokemon-health-bar">
              <label htmlFor="player-health">HP </label>
              <progress
                ref={playerHealthRef}
                id="player-health"
                value={playerHealth}
                max="100"
              ></progress>
            </div>
            <div className="pokemon-health-number">{playerHealth} / 100</div>
          </div>
        </div>
        <div className="bottom-container">
          <div className="question-container">{question}</div>
          <div className="options-container">
            {options.map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  option === correctOption ? "correct-option" : ""
                }`}
                onClick={() => handlePlayerAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Battle;

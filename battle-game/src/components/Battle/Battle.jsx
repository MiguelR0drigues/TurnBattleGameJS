import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import hoverSoundFile from "../../assets/audio/button-hover.mp3";
import correctOptionSoundFile from "../../assets/audio/correct-option.mp3";
import wrongOptionSoundFile from "../../assets/audio/wrong-option.mp3";
import opponentPokemon from "../../assets/charmander.png";
import yourPokemon from "../../assets/pikachu.png";
import { getEveryQuestionForLevelOfAgeGroup } from "../../utils";
import Loader from "../Loader/Loader"; // Replace "../Loader/Loader" with the correct path to your Loader component
import "./Battle.css";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPageDisabled, setIsPageDisabled] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [level, setLevel] = useState();
  const [showLoader, setShowLoader] = useState(true);

  const opponentHealthRef = useRef(null);
  const playerHealthRef = useRef(null);
  const opponentImageRef = useRef(null);
  const playerImageRef = useRef(null);
  const hoverSoundRef = useRef(null);
  const correctOptionSoundRef = useRef(null);
  const wrongOptionSoundRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    setIsModalOpen(false);
    setIsPageDisabled(false);
    setShowLoader(true);
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  useEffect(() => {
    if (allQuestions.length > 0) {
      // Fetch the next question for the player
      fetchData();
      setShowLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allQuestions]);
  useEffect(() => {
    setLevel(JSON.parse(localStorage.getItem("levelNumber")));
  }, []);

  useEffect(() => {
    hoverSoundRef.current = new Audio(hoverSoundFile);
    hoverSoundRef.current.volume = 0.1;

    correctOptionSoundRef.current = new Audio(correctOptionSoundFile);
    correctOptionSoundRef.current.volume = 1.0;

    wrongOptionSoundRef.current = new Audio(wrongOptionSoundFile);
    wrongOptionSoundRef.current.volume = 0.2;
  }, []);

  useEffect(() => {
    if (playerHealth <= 0) {
      handlePlayerDefeat();
    }
    if (opponentHealth <= 0) {
      handleOpponentDefeat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerHealth, opponentHealth]);

  const handleMainMenuClick = () => {
    navigate("/");
  };

  const fetchData = async () => {
    try {
      if (allQuestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        const selectedQuestion = allQuestions[randomIndex];

        // Destructure question, options, and correct option from the selected question
        const { question, incorrectOptions, correctOption } = selectedQuestion;

        // Shuffle the options randomly
        const shuffledOptions = shuffleOptions([
          ...incorrectOptions,
          correctOption,
        ]);

        // Update state with the fetched question, shuffled options, and correct option
        setQuestion(question);
        setOptions(shuffledOptions);
        setCorrectOption(correctOption);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const ageGroupID = JSON.parse(localStorage.getItem("ageGroupID"));
      const result = await getEveryQuestionForLevelOfAgeGroup(
        ageGroupID,
        level
      );
      setAllQuestions(result);
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error; // Rethrow the error to be caught in the useEffect
    }
  };

  const shuffleOptions = (array) => {
    const [question, ...options] = array; // Destructure the question and options
    const shuffledOptions = [...options];

    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[randomIndex]] = [
        shuffledOptions[randomIndex],
        shuffledOptions[i],
      ];
    }

    return [question, ...shuffledOptions]; // Combine the shuffled options with the question
  };

  const handlePlayerAnswer = (selectedOption) => {
    const isCorrect = selectedOption === correctOption;

    if (isCorrect) {
      // Calculate damage for correct answer
      const baseDamage = Math.floor(Math.random() * 21) + 15;
      const isCritical = Math.random() <= 0.05;
      const totalDamage = isCritical ? baseDamage + 10 : baseDamage;

      // Update opponent's health based on player's attack
      const newOpponentHealth = opponentHealth - totalDamage;
      const clampedOpponentHealth =
        newOpponentHealth < 0 ? 0 : newOpponentHealth;
      setOpponentHealth(clampedOpponentHealth);
      setOpponentDamageTaken(totalDamage);

      // Trigger animation by adding class to opponent health bar
      opponentHealthRef.current.classList.add("health-bar-animation");
      setTimeout(() => {
        // Remove animation class after animation duration (in milliseconds)
        opponentHealthRef.current.classList.remove("health-bar-animation");
      }, 1000); // Change the duration to match your animation duration

      // is correct, play sound
      correctOptionSoundRef.current.currentTime = 0;
      correctOptionSoundRef.current.play();

      // Shake your image by setting the state variable
      setPlayerShaking(true);
    } else {
      // Player answered incorrectly, opponent attacks
      const opponentDamage = calculateOpponentDamage();
      const newPlayerHealth = playerHealth - opponentDamage;
      const clampedPlayerHealth = newPlayerHealth < 0 ? 0 : newPlayerHealth;
      setPlayerHealth(clampedPlayerHealth);
      setPlayerDamageTaken(opponentDamage);

      // Trigger animation by adding class to player health bar
      playerHealthRef.current.classList.add("health-bar-animation");
      setTimeout(() => {
        // Remove animation class after animation duration (in milliseconds)
        playerHealthRef.current.classList.remove("health-bar-animation");
      }, 1000); // Change the duration to match your animation duration

      // answer is wrong, play sound
      wrongOptionSoundRef.current.currentTime = 0;
      wrongOptionSoundRef.current.play();

      // Shake opponent's image by setting the state variable
      setOpponentShaking(true);
    }

    // Fetch the next question for the player
    fetchData();

    // Remove the shaking animation state after the animation finishes
    setTimeout(() => {
      setOpponentShaking(false);
      setPlayerShaking(false);
      setOpponentDamageTaken(undefined);
      setPlayerDamageTaken(undefined);
    }, 1000); // Adjust the duration to match the animation duration
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

  const playHoverSound = () => {
    hoverSoundRef.current.currentTime = 0; // Reset the audio to the beginning
    hoverSoundRef.current.play();
  };

  const handlePlayerDefeat = () => {
    setIsModalOpen(true);
    setIsPageDisabled(true);
  };

  const handleOpponentDefeat = () => {
    localStorage.setItem("levelNumber", level + 1);
    setIsModalOpen(true);
    setIsPageDisabled(true);
  };

  const handleNextLevelClick = () => {
    setPlayerHealth(100);
    setOpponentHealth(100);
    setLevel(level + 1);
    localStorage.setItem("levelNumber", level + 1);
  };
  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        <div className="battle-container">
          <div className="battle-background">
            <div className="opponent-container">
              <div className="opponent-health">
                <div className="pokemon-name">Charmander (Adversário)</div>
                <div className="pokemon-health-bar">
                  <label htmlFor="opponent-health">HP </label>
                  <progress
                    ref={opponentHealthRef}
                    id="opponent-health"
                    value={opponentHealth}
                    max="100"
                  ></progress>
                </div>
                <div className="pokemon-health-number">
                  {opponentHealth} / 100
                </div>
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
                  <div className="damage-taken dt-player">
                    -{playerDamageTaken}
                  </div>
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
                <div className="pokemon-name">Pikachu (Tu)</div>
                <div className="pokemon-health-bar">
                  <label htmlFor="player-health">HP </label>
                  <progress
                    ref={playerHealthRef}
                    id="player-health"
                    value={playerHealth}
                    max="100"
                  ></progress>
                </div>
                <div className="pokemon-health-number">
                  {playerHealth} / 100
                </div>
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
                    onMouseEnter={playHoverSound}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && playerHealth <= 0 && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Perdeste</h2>
            <p>Foste derrotado desta vez!</p>
            <button onClick={handleMainMenuClick} onMouseEnter={playHoverSound}>
              Voltar ao início
            </button>
          </div>
        </div>
      )}
      {isModalOpen && opponentHealth <= 0 && (
        <div className="modal-overlay">
          <div className="modal-content-success">
            <h2>Venceste</h2>
            <p>Parabéns, avança para o próximo nível!</p>
            <button
              onClick={handleNextLevelClick}
              onMouseEnter={playHoverSound}
            >
              Avançar para o próximo nível
            </button>
          </div>
        </div>
      )}

      {isPageDisabled && <div className="page-overlay" />}
    </>
  );
};

export default Battle;

import "./styles.css";
import React, { useState, useRef } from "react";

export default function App() {
  // Screen changing code
  const [ScreenState, SetScreen] = useState(0);

  const ChangeScreen = () => {
    if (ScreenState === 0) {
      SetScreen(1);
    } else if (ScreenState === 1) {
      SetScreen(0);
    }
  };

  // Audio Loading and Playing Code
  const audioSource =
    "https://github.com/kevbrnen/Cs385Project/raw/main/AudioFiles/groove.mp3";
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }

      setIsPlaying(!isPlaying);
    }
  };

  // Play Screen
  if (ScreenState === 0) {
    return (
      <div className="App">
        <h1> Screen 1 </h1>
        <button onClick={playAudio}>{isPlaying ? "Pause" : "Play"}</button>

        {isPlaying && <p> Playing song </p>}
        {!isPlaying && <p> not playing </p>}

        <audio ref={audioRef}>
          <source src={audioSource} type="audio/mp3" />
        </audio>

        <button onClick={ChangeScreen}>Change Screen</button>
      </div>
    );
  } else if (ScreenState === 1) {
    // Second Screen
    return (
      <div className="App">
        <h1> Screen 2 </h1>
        <button onClick={ChangeScreen}>Change Screen</button>
      </div>
    );
  }
}

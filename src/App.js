import "./styles.css";
import React, { useState, useRef } from "react";

export default function App() {
  const audioSource =
    "https://github.com/kevbrnen/Cs385Project/raw/main/groove.mp3";
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

  return (
    <div className="App">
      <button onClick={playAudio}>{isPlaying ? "Pause" : "Play"}</button>

      {isPlaying && <p> Playing song </p>}
      {!isPlaying && <p> not playing </p>}

      <audio ref={audioRef}>
        <source src={audioSource} type="audio/mp3" />
      </audio>
    </div>
  );
}

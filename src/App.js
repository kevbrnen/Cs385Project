import "./styles.css";
import React, { useState, useRef, useEffect } from "react";
//import soundFiles from "./jsonFiles/soundFiles.json";

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
  const [audioUrl, setAudioUrl] = useState("");
  const [audioLoaded, setAudioLoaded] = useState(false); //keeps track of wether audio has been loaded from URL
  const audioRef = useRef(null);

  // Home Screen
  if (ScreenState === 0) {
    //Code For Home Screen
    return (
      <div className="App">
        <h1> Main Screen </h1>

        <button onClick={ChangeScreen}>Search Screen</button>
      </div>
    );
  } else if (ScreenState === 1) {
    //Code for Search Screen
    //Calls children "ResultsComponent" (for displaying json file)
    //And "AudioPlayer" (for loading audio player and handling playback)
    return (
      <div className="App">
        <h1> Search Screen </h1>

        <ResultsComponent
          setAudioUrl={setAudioUrl}
          setAudioLoaded={setAudioLoaded}
        />
        <></>
        <AudioPlayer
          audioUrl={audioUrl}
          audioRef={audioRef}
          audioLoaded={audioLoaded}
          setAudioLoaded={setAudioLoaded}
        />

        <button onClick={ChangeScreen}>Main Screen</button>
      </div>
    );
  }
}

/***** Playback only works so far by selecting the groove audio file, changing to 
      the main Screen, changing back to the search screen then pressing play *****/
//Function to handle displaying audio player and audio playback
function AudioPlayer(props) {
  //Audio Playback state
  const [isPlaying, setIsPlaying] = useState(false);

  //handles button press to pause and play audio
  const playAudio = () => {
    if (props.audioRef.current) {
      if (isPlaying) {
        props.audioRef.current.pause();
      } else {
        props.audioRef.current.play();
      }

      setIsPlaying(!isPlaying);
    }
  };

  //checking if audio has loaded from URL
  const checkAudioLoad = () => {
    props.setAudioLoaded(true);
  };

  //Audio Player Component Display
  return (
    <>
      <audio ref={props.audioRef} onLoadedData={checkAudioLoad}>
        <source src={props.audioUrl} type="audio/mp3" />
      </audio>

      {props.audioLoaded ? (
        <p>Audio has been loaded!</p>
      ) : (
        <p>Loading audio... Please wait.</p>
      )}

      <button onClick={playAudio}>{isPlaying ? "Pause" : "Play"}</button>

      {isPlaying && <p> Playing song </p>}
      {!isPlaying && <p> not playing </p>}
    </>
  );
}

//Function to Display audio files in JSON file
function ResultsComponent(props) {
  //Code for Loading JSON from github, including checks and error handling
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [error, setError] = useState(null);

  useEffect(() => {
    const jsonURL =
      "https://raw.githubusercontent.com/kevbrnen/Cs385Project/main/src/jsonFiles/soundFiles.json";

    async function fetchData() {
      try {
        const response = await fetch(jsonURL);
        const json = await response.json();
        setData(json.soundFiles);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const selectAudio = (audioUrl) => {
    props.setAudioUrl(audioUrl);
    props.setAudioLoaded(false);
  };

  //Conditional rendering of json file, including buttons to select different audio URLs (need to be included in JSON)
  //to play from
  if (error) {
    return <h1>Oops! An error has occurred: {error.toString()}</h1>;
  } else if (loading) {
    return <h1>Loading Data... Please wait!</h1>;
  } else {
    return (
      <>
        {Array.isArray(data) &&
          data.map((a, index) => (
            <p key={index}>
              <b>{a.title}</b>, <i>{a.environment.location}</i>,{" "}
              <button onClick={() => selectAudio(a.URL)}> Select </button>
            </p>
          ))}
      </>
    );
  }
}

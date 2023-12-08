import "./styles.css";
import React, { useState, useRef, useEffect } from "react";
//import soundFiles from "./jsonFiles/soundFiles.json";

export default function App() {
  // Screen changing code
  // 0 => Main Screen
  // 1 => Search Screen
  // 2 => Audio Player Screen
  const [ScreenState, SetScreen] = useState(0);

  const ChangeScreen = (screen) => {
    SetScreen(screen);
  };

  // text input for filter function
  const [searchTerm, setSearchTerm] = useState("");

  function onSearchFormChange(event) {
    setSearchTerm(event.target.value);
  }

  // filter function
  function filterFunction(searchTerm) {
    return function (filterObject) {
      let title = filterObject.title.toLowerCase();

      return searchTerm !== "" && title.includes(searchTerm.toLowerCase());
    };
  }

  // Audio Loading and Playing Code
  const [audioUrl, setAudioUrl] = useState(null); // The URL from the JSON file for the selected audio file
  const [audioLoaded, setAudioLoaded] = useState(false); // Keeps track of whether audio has been loaded from URL
  const [fileName, setFileName] = useState(""); // The file name of the selected audio file
  const audioRef = useRef(null); // Reference to selected audio element

  // Home Screen
  if (ScreenState === 0) {
    //Code For Home Screen
    return (
      <div className="App">
        <h1> Main Screen </h1>

        <button onClick={() => ChangeScreen(1)}>Search Screen</button>
      </div>
    );
  }

  //Search Screen
  else if (ScreenState === 1) {
    // Code for Search Screen
    // Calls children "ResultsComponent" (for displaying json file and selecting individual files)
    // And "AudioPlayer" (for loading audio, handling playback and displaying playback components)
    // searchFormChange is for text input/filtering, declared initially in App function

    return (
      <div className="App">
        <h1> Search Screen </h1>

        <p>Your current search term is: {searchTerm}</p>

        <form>
          <h3>Type your search here: </h3>
          <input onChange={onSearchFormChange} type="text" />
        </form>
        <hr />

        <ResultsComponent
          searchTermFromParent={searchTerm}
          setAudioUrl={setAudioUrl}
          setAudioLoaded={setAudioLoaded}
          setFileName={setFileName}
          ChangeScreen={ChangeScreen}
        />
        <button onClick={() => ChangeScreen(0)}>Main Screen</button>
      </div>
    );
  }
  // Audio Player Screen
  else if (ScreenState === 2) {
    // Rendered if an audio file is selected from the search screen
    return (
      <div className="App">
        <h1> Audio Player </h1>
        <AudioPlayer
          audioUrl={audioUrl}
          audioRef={audioRef}
          audioLoaded={audioLoaded}
          setAudioLoaded={setAudioLoaded}
          fileName={fileName}
        />
        <></>
        <button onClick={() => ChangeScreen(0)}>Main Screen</button>{" "}
        <button onClick={() => ChangeScreen(1)}>Search Screen</button>
      </div>
    );
  }
}

// Function to Display audio files in JSON file
// Rendered from screen 1
function ResultsComponent(props) {
  //Code for Loading JSON from github, including checks and error handling

  //maybe data has to be switched w filteredData
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //
  const filteredData = data.filter(filterFunction(props.searchTermFromParent));

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

  // Called from onClick, sets the hooks that need to be set with the correct
  // information for the selected audio file
  // Also changes the screen state to 2 to render the Audio Player Screen
  const selectAudio = (audioUrl, title) => {
    props.setAudioUrl(audioUrl);
    props.setAudioLoaded(false);
    props.setFileName(title);
    props.ChangeScreen(2);
  };

  //Conditional rendering of json file, including buttons to select different audio URLs (need to be included in JSON)
  //to play from
  if (error) {
    return <h1>Oops! An error has occurred: {error.toString()}</h1>;
  } else if (loading) {
    return <h1>Loading Data... Please wait!</h1>;
  } else {
    // Print all files in JSON with their titles, location and a button
    // button can be used to select that audio file, selecting a file
    // passes the URL of that file (contained within the JSON file) to the
    // parent "App" function. From there all necessary information (title, URL and other necessary hooks)
    // is passed to the AudioPlayer function which handles loading of files and playback

    return (
      <>
        {Array.isArray(filteredData) &&
          filteredData.map((a, index) => (
            <p key={index}>
              <b>{a.title}</b>, <i>{a.environment.location}</i>,{" "}
              <button>
                disabled={a.available ? false : true}
                onClick={() => selectAudio(a.URL, a.title)}
                {a.available ? "Select" : "Unavailable"}
              </button>
            </p>
          ))}
      </>
    );
  }
}

// Function to handle displaying audio player and audio playback
// Rendered from screen 2
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
  //Chacks to make sure the URL field is not empty
  if (props.audioUrl == null) {
    //If null in json, render invalid URL
    return (
      <>
        <p>
          {" "}
          Invalid URL for: "<i>{props.fileName}</i>"
        </p>
      </>
    );
  } else {
    //If URL field is not null, attemp to load the audio and display any playback components
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
        <p> {props.fileName} </p>
        <button onClick={playAudio}>{isPlaying ? "Pause" : "Play"}</button>
        {isPlaying && <p> Playing song </p>}
        {!isPlaying && <p> not playing </p>}


      </>
    );
  }
}

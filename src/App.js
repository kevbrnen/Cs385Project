import "./styles.css";
import React, { useState, useRef, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";

//External functions, rendering for different screen states
import Dock from "./Functions/Dock.js";
import AudioPlayer from "./Functions/AudioPlayer.js";
import ResultsComponent from "./Functions/ResultsComponent.js";
import Recommended from "./Functions/Recommended.js";
import LikedAudioScreen from "./Functions/LikedAudio.js";

export default function App() {
  // Screen changing code //
  // 0 => Main Screen
  // 1 => Search Screen
  // 2 => Audio Player Screen
  // 3 => Liked Audio Screen
  const [ScreenState, SetScreen] = useState(0);

  const ChangeScreen = (screen) => {
    SetScreen(screen);
  };

  // Filtering Code //
  // text input for filename filtering
  const [searchTerm, setSearchTerm] = useState("");
  function onSearchFormChange(event) {
    setSearchTerm(event.target.value);
  }

  // filter function
  function filterFunction(searchTerm) {
    return function (filterObject) {
      let title = filterObject.title.toLowerCase();
      // if no input render all, else render files that contain search term
      return searchTerm === "" || title.includes(searchTerm.toLowerCase());
    };
  }

  // Tags //
  // Tag variables
  const [typeSelect, setType] = useState("");
  const [timeSelect, setTime] = useState("");
  const [weatherSelect, setWeather] = useState("");
  const [locationSelect, setLocation] = useState("");

  // filter by tags: environment type, time of day, weather and location/country
  function tagFilter(typeSelect, timeSelect, weatherSelect, locationSelect) {
    return function (audioFile) {
      let type = audioFile.environment.type
        ? audioFile.environment.type.toLowerCase()
        : "";
      let time = audioFile.environment.time
        ? audioFile.environment.time.toLowerCase()
        : "";
      let weather = audioFile.environment.weather
        ? audioFile.environment.weather.toLowerCase()
        : "";
      let location = audioFile.environment.location
        ? audioFile.environment.location.toLowerCase()
        : "";

      return (
        (typeSelect === "" || type.includes(typeSelect.toLowerCase())) &&
        (timeSelect === "" || time.includes(timeSelect.toLowerCase())) &&
        (weatherSelect === "" ||
          weather.includes(weatherSelect.toLowerCase())) &&
        (locationSelect === "" ||
          location.includes(locationSelect.toLowerCase()))
      );
    };
  }

  // Audio State Code //
  // Audio Loading and Playing Code
  const [audioUrl, setAudioUrl] = useState(null); // The URL from the JSON file for the selected audio file
  const [ImageURL, setImageURL] = useState(null);
  const [audioLoaded, setAudioLoaded] = useState(false); // Keeps track of whether audio has been loaded from URL
  const [fileName, setFileName] = useState(""); // The file name of the selected audio file
  const [trackID, setTrackID] = useState(""); // track ID of selected audio file
  const audioRef = useRef(null); // Reference to selected audio element

  // Audio Liking Code //
  // variables for liking audio files
  const [liked, setLiked] = useState([]);

  // add audio to liked array
  function addLiked(title, trackID, audioUrl, ImageURL) {
    // spread operator
    setLiked([...liked, { title, trackID, audioUrl, ImageURL }]);
  }

  // find trackID of audio
  function findAudioIndex(needle) {
    return function (haystack) {
      return haystack.trackID === needle.trackID;
    };
  }

  function removeLiked(trackID) {
    const updatedLiked = liked.filter((audio) => audio.trackID !== trackID);
    setLiked(updatedLiked);
  }

  // Time Of Day Code//
  // Time of day based on current hour
  let timeOfDay;
  const date = new Date();
  const hours = date.getHours();
  if (hours >= 4 && hours < 12) {
    timeOfDay = "Morning";
  } else if (hours >= 12 && hours < 18) {
    timeOfDay = "Afternoon";
  } else {
    timeOfDay = "Night";
  }

  // Screen Rendering //
  // Home Screen
  if (ScreenState === 0) {
    // Code For Home Screen
    // Calls recommended function which shows 4 Tracks
    // Filtered by the current time of day (Day/night)
    return (
      <div className="App">
        {" "}
        <h1> Main Screen </h1>
        <hr />
        <h1> Recommended {timeOfDay} Tracks</h1>
        <Recommended
          timeOfDay_FromParent={timeOfDay}
          setAudioUrl={setAudioUrl}
          setAudioLoaded={setAudioLoaded}
          setFileName={setFileName}
          ChangeScreen={ChangeScreen}
          filterFunction={filterFunction}
          tagFilter={tagFilter}
          setImageURL={setImageURL}
        />
        <Dock ChangeScreen={ChangeScreen} />
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
        {" "}
        <h1> Search Screen </h1>
        <p>Your current search term is: {searchTerm}</p>
        <form>
          <h3>Type your search here: </h3>
          <input onChange={onSearchFormChange} type="text" />
        </form>
        <h4>Filter by tag:</h4>
        <Dropdown onSelect={(typeValue) => setType(typeValue)}>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Environment Type
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey="forest">Forest</Dropdown.Item>
            <Dropdown.Item eventKey="beach">Beach</Dropdown.Item>
            <Dropdown.Item eventKey="jungle">Jungle</Dropdown.Item>
            <Dropdown.Item eventKey="city">City</Dropdown.Item>
            <Dropdown.Item eventKey="plains">Plains</Dropdown.Item>
            <Dropdown.Item eventKey="unknown">Unknown</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown onSelect={(timeValue) => setTime(timeValue)}>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Time of Day
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey="day">Day</Dropdown.Item>
            <Dropdown.Item eventKey="night">Night</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown onSelect={(weatherValue) => setWeather(weatherValue)}>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Weather Conditions
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey="clear">Clear</Dropdown.Item>
            <Dropdown.Item eventKey="windy">Windy</Dropdown.Item>
            <Dropdown.Item eventKey="raining">Raining</Dropdown.Item>
            <Dropdown.Item eventKey="snowing">Snowing</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown onSelect={(locationValue) => setLocation(locationValue)}>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Location
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item eventKey="Ireland">Ireland</Dropdown.Item>
            <Dropdown.Item eventKey="England">England</Dropdown.Item>
            <Dropdown.Item eventKey="America">America</Dropdown.Item>
            <Dropdown.Item eventKey="Finland">Finland</Dropdown.Item>
            <Dropdown.Item eventKey="Brazil">Brazil</Dropdown.Item>
            <Dropdown.Item eventKey="Spain">Spain</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <hr />
        <ResultsComponent
          searchTermFromParent={searchTerm}
          typeFromParent={typeSelect}
          timeFromParent={timeSelect}
          weatherFromParent={weatherSelect}
          locationFromParent={locationSelect}
          setAudioUrl={setAudioUrl}
          setAudioLoaded={setAudioLoaded}
          setTrackID={setTrackID}
          setFileName={setFileName}
          ChangeScreen={ChangeScreen}
          filterFunction={filterFunction}
          tagFilter={tagFilter}
          addLiked={addLiked}
          setImageURL={setImageURL}
        />
        <Dock ChangeScreen={ChangeScreen} />
      </div>
    );
  }
  // Audio Player Screen
  else if (ScreenState === 2) {
    // Rendered if an audio file is selected from the search screen
    return (
      <div className="App">
        {" "}
        <p>{audioUrl}</p>
        <h1> Audio Player </h1>
        <AudioPlayer
          audioUrl={audioUrl}
          audioRef={audioRef}
          audioLoaded={audioLoaded}
          setAudioLoaded={setAudioLoaded}
          trackID={trackID}
          fileName={fileName}
          ImageURL={ImageURL}
          addLiked={addLiked}
        />
        <Dock ChangeScreen={ChangeScreen} />
      </div>
    );
  }
  // liked audio screen
  else if (ScreenState === 3) {
    return (
      <div className="App">
        <h1> Liked Audio </h1>
        <LikedAudioScreen
          liked={liked}
          removeLiked={removeLiked}
          setAudioUrl={setAudioUrl}
          setAudioLoaded={setAudioLoaded}
          setFileName={setFileName}
          setImageURL={setImageURL}
          ChangeScreen={ChangeScreen}
          setTrackID={setTrackID}
        />
        <Dock ChangeScreen={ChangeScreen} />
      </div>
    );
  }
}

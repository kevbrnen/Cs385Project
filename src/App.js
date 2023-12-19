import "./styles.css";
import React, { useState, useRef, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";

export default function App() {
  // Screen changing code
  // 0 => Main Screen
  // 1 => Search Screen
  // 2 => Audio Player Screen
  // 3 => Liked Audio Screen
  const [ScreenState, SetScreen] = useState(0);

  const ChangeScreen = (screen) => {
    SetScreen(screen);
  };

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

  // Audio Loading and Playing Code
  const [audioUrl, setAudioUrl] = useState(null); // The URL from the JSON file for the selected audio file
  const [audioLoaded, setAudioLoaded] = useState(false); // Keeps track of whether audio has been loaded from URL
  const [fileName, setFileName] = useState(""); // The file name of the selected audio file
  const [trackID, setTrackID] = useState(""); // track ID of selected audio file
  const audioRef = useRef(null); // Reference to selected audio element

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

  // variables for liking audio files
  const [liked, setLiked] = useState([]);

  // add audio to liked array
  function addLiked(title, trackID, audioUrl) {
    // spread operator
    setLiked([...liked, { title, trackID, audioUrl }]);
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
        <h1> Audio Player </h1>
        <AudioPlayer
          audioUrl={audioUrl}
          audioRef={audioRef}
          audioLoaded={audioLoaded}
          setAudioLoaded={setAudioLoaded}
          trackID={trackID}
          fileName={fileName}
          addLiked={addLiked}
        />
        <button onClick={() => addLiked(fileName, trackID, audioUrl)}>
          Like
        </button>
        <Dock ChangeScreen={ChangeScreen} />
      </div>
    );
  }
  // liked audio screen
  else if (ScreenState === 3) {
    return (
      <div className="App">
        <h1> Liked Audio </h1>
        <LikedAudioScreen liked={liked} removeLiked={removeLiked} />
        <Dock ChangeScreen={ChangeScreen} />
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

  // text search filter
  const filteredData = data.filter(
    props.filterFunction(props.searchTermFromParent),
  );

  //tag filtration, re-add props for other variables once working
  const tagData = filteredData.filter(
    props.tagFilter(
      props.typeFromParent,
      props.timeFromParent,
      props.weatherFromParent,
      props.locationFromParent,
    ),
  );

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
  const selectAudio = (audioUrl, title, trackID) => {
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
        <Container>
          <Row>
            {Array.isArray(tagData) &&
              tagData.map((a, index) => (
                <div key={index} className="col-6 mb-4">
                  <Card className="d-flex flex-column h-100">
                    <Card.Img
                      variant="top"
                      src="holder.js/100px180"
                      margin="auto"
                    />
                    <Card.Body>
                      <Card.Title>{a.title}</Card.Title>
                      <Card.Text>{a.environment.location}</Card.Text>
                      <Button
                        variant="primary"
                        disabled={a.available ? false : true}
                        onClick={() => selectAudio(a.URL, a.title, a.trackID)}
                      >
                        {a.available ? "Select" : "Unavailable"}
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
          </Row>
        </Container>
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
        <hr />

        <Image src="..." fluid className="rounded mx-auto d-block" />

        <hr />

        <audio ref={props.audioRef} onLoadedData={checkAudioLoad} controls>
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

// Exact same code as ResultsComponent, however here we take in the time of day and use that as
// the only filter for sounds
function Recommended(props) {
  //Code for Loading JSON from github, including checks and error handling

  //maybe data has to be switched w filteredData
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Called from onClick, sets the hooks that need to be set with the correct
  // information for the selected audio file
  // Also changes the screen state to 2 to render the Audio Player Screen
  const selectAudio = (audioUrl, title, trackID) => {
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
    // Variable to hold string value of current time of day
    let TOD;
    if (props.timeOfDay_FromParent === "Morning" || "Afternoon") {
      TOD = "day";
    } else {
      TOD = "night";
    }

    // Conditional rendering using filter function that checks if the current
    // TOD matches the "timestamp" for each track in the JSON file
    // Slices the result to only show 4 recommended tracks
    return (
      <>
        <Container>
          <Row>
            {Array.isArray(data) &&
              data
                .filter((a) => a.environment.time === TOD)
                .slice(0, 4)
                .map((a, index) => (
                  <div key={index} className="col-6 mb-4">
                    <Card className="d-flex flex-column h-100">
                      <Card.Img
                        variant="top"
                        src="holder.js/100px180"
                        margin="auto"
                      />
                      <Card.Body>
                        <Card.Title>{a.title}</Card.Title>
                        <Card.Text>{a.environment.location}</Card.Text>
                        <Button
                          variant="primary"
                          disabled={a.available ? false : true}
                          onClick={() => selectAudio(a.URL, a.title, a.trackID)}
                        >
                          {a.available ? "Select" : "Unavailable"}
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                ))}
          </Row>
        </Container>
      </>
    );
  }
}

function Dock(props) {
  return (
    <>
      <hr />{" "}
      <Button variant="success" onClick={() => props.ChangeScreen(0)}>
        {" "}
        Home{" "}
      </Button>{" "}
      <Button variant="info" onClick={() => props.ChangeScreen(1)}>
        {" "}
        Search{" "}
      </Button>{" "}
      <Button variant="warning" onClick={() => props.ChangeScreen(3)}>
        {" "}
        Likes{" "}
      </Button>{" "}
      <hr />
    </>
  );
}

function LikedAudioScreen({ liked, removeLiked }) {
  return (
    <>
      {liked.length === 0 ? (
        <p>No liked audio files.</p>
      ) : (
        <Container>
          <Row>
            {Array.isArray(liked) &&
              liked.map((a, index) => (
                // Replace `data` with your actual data source
                <div key={index} className="col-6 mb-4">
                  <Card className="d-flex flex-column h-100">
                    <Card.Img
                      variant="top"
                      src="holder.js/100px180"
                      margin="auto"
                    />
                    <Card.Body>
                      <Card.Title>{a.title}</Card.Title>
                      <Card.Text>{a.trackID}</Card.Text>
                      <Button
                        variant="primary"
                        disabled={a.available ? false : true}
                        onClick={() => selectAudio(a.URL, a.title, a.trackID)}
                      >
                        {a.available ? "Select" : "Unavailable"}
                      </Button>
                    </Card.Body>
                    <Button
                      variant="danger"
                      onClick={() => removeLiked(a.trackID)}
                    >
                      Unlike
                    </Button>
                  </Card>
                </div>
              ))}
          </Row>
        </Container>
      )}
    </>
  );
}

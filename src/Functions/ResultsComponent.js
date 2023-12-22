import React, { useState, useRef, useEffect } from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";

// Function to Display audio files in JSON file
// Rendered from screen 1
const ResultsComponent = (props) => {
  //Code for Loading JSON from github, including checks and error handling

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
  const selectAudio = (audioUrl, title, trackID, ImageURL, info) => {
    props.setAudioUrl(audioUrl);
    props.setAudioLoaded(false);
    props.setFileName(title);
    props.setTrackID(trackID);
    props.setImageURL(ImageURL);
    props.setInfo(info);
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
                      src={a.ImageURL}
                      margin="auto"
                      style={{
                        width: "100%",
                        height: "40vw",
                        object_fit: "cover",
                      }}
                      type="image/png"
                    />
                    <Card.Body>
                      <Card.Title>{a.title}</Card.Title>
                      <Card.Text>{a.environment.location}</Card.Text>
                      <Button
                        variant="primary"
                        disabled={a.available ? false : true}
                        onClick={() =>
                          selectAudio(a.URL, a.title, a.trackID, a.ImageURL, a.info)
                        }
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
};

export default ResultsComponent;

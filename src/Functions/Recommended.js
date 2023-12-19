import React, { useState, useRef, useEffect } from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";

// Exact same code as ResultsComponent, however here we take in the time of day and use that as
// the only filter for sounds
const Recommended = (props) => {
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
  const selectAudio = (audioUrl, title, trackID, ImageURL) => {
    props.setAudioUrl(audioUrl);
    props.setAudioLoaded(false);
    props.setFileName(title);
    props.setImageURL(ImageURL);
    props.setTrackID(trackID);
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
    if (
      props.timeOfDay_FromParent === "Morning" ||
      props.timeOfDay_FromParent === "Afternoon"
    ) {
      TOD = "day";
    } else if (props.timeOfDay_FromParent === "Night") {
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
                .filter((a) => a.environment && a.environment.time === TOD)
                .slice(0, 4)
                .map((a, index) => (
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
                            selectAudio(a.URL, a.title, a.trackID, a.ImageURL)
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

export default Recommended;

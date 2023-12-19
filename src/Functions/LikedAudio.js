import React, { useState, useRef, useEffect } from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";

//Screen to show liked audio
const LikedAudioScreen = (props) => {
  //Code for Loading JSON from github, including checks and error handling
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

  const selectAudio = (audioUrl, title, trackID, ImageURL) => {
    props.setAudioUrl(audioUrl);
    props.setAudioLoaded(false);
    props.setFileName(title);
    props.setImageURL(ImageURL);
    props.ChangeScreen(2);
  };

  if (error) {
    return <h1>Oops! An error has occurred: {error.toString()}</h1>;
  } else if (loading) {
    return <h1>Loading Data... Please wait!</h1>;
  } else {
    return (
      <>
        {props.liked.length === 0 ? (
          <p>No liked audio files.</p>
        ) : (
          <Container>
            <Row>
              {Array.isArray(data) &&
                data.map((a, index) =>
                  props.liked.includes(a.trackID) ? (
                    // Replace `data` with your actual data source
                    <div key={index} className="col-6 mb-4">
                      <Card className="d-flex flex-column h-100">
                        <Card.Img
                          variant="top"
                          src={a.ImageURL}
                          margin="auto"
                          style={{ width: "100%", height: "auto" }}
                          type="image/png"
                        />
                        <Card.Body>
                          <Card.Title>{a.title}</Card.Title>
                          <Card.Text>{a.environment.location}</Card.Text>
                          <Button
                            variant="primary"
                            onClick={() =>
                              selectAudio(a.URL, a.title, a.trackID, a.ImageURL)
                            }
                          >
                            {"Select"}
                          </Button>
                        </Card.Body>
                        <Button
                          variant="danger"
                          onClick={() => props.removeLiked(a.trackID)}
                        >
                          Unlike
                        </Button>
                      </Card>
                    </div>
                  ) : null,
                )}
            </Row>
          </Container>
        )}
      </>
    );
  }
};

export default LikedAudioScreen;

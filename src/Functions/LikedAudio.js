import React, { useState, useRef, useEffect } from "react";

import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";

//Screen to show liked audio
const LikedAudioScreen = (props) => {
  const selectAudio = (audioUrl, title, trackID, ImageURL) => {
    props.setAudioUrl(audioUrl);
    props.setAudioLoaded(false);
    props.setFileName(title);
    props.setImageURL(ImageURL);
    props.ChangeScreen(2);
  };

  return (
    <>
      {props.liked.length === 0 ? (
        <p>No liked audio files.</p>
      ) : (
        <Container>
          <Row>
            {Array.isArray(props.liked) &&
              props.liked.map((a, index) => (
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
                      <Card.Text>{a.trackID}</Card.Text>
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
              ))}
          </Row>
        </Container>
      )}
    </>
  );
};

export default LikedAudioScreen;
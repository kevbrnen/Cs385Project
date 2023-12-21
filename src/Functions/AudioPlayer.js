import React, { useState, useRef, useEffect } from "react";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";

// Function to handle displaying audio player and audio playback
// Rendered from screen 2
const AudioPlayer = (props) => {
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
          Invalid URL for: "<i>{props.fileName}</i>"
        </p>
      </>
    );
  } else {
    //If URL field is not null, attemp to load the audio and display any playback components
    return (
      <>
        <hr />
        <Image
          fluid
          className="rounded mx-auto d-block"
          style={{ width: "55%", height: "auto" }}
          src={props.ImageURL}
          type="image/png"
        />
        <hr />
        <audio ref={props.audioRef} onLoadedData={checkAudioLoad} controls>
          <source src={props.audioUrl} type="audio/mp3" />
        </audio>
        {props.audioLoaded ? (
          <p>Audio has been loaded!</p>
        ) : (
          <p>Loading audio... Please wait.</p>
        )}
        <p>
          {" "}
          <span style={{ fontWeight: "bold" }}>{props.fileName}</span>{" "}
        </p>
        <h6>Environmental Information:</h6>
        <p>{props.info} </p>
        <Button onClick={playAudio}>{isPlaying ? "Pause" : "Play"}</Button>{" "}
        {isPlaying && <p> Playing song </p>}
        {!isPlaying && <p> not playing </p>}{" "}
        <Button onClick={() => props.addLiked(props.trackID)}>Like</Button>
      </>
    );
  }
};

export default AudioPlayer;

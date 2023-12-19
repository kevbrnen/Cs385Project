import React, { useState, useRef, useEffect } from "react";
import Image from "react-bootstrap/Image";

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
          {props.audioUrl} Invalid URL for: "<i>{props.fileName}</i>"
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
          style={{ width: "100%", height: "auto" }}
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
        <p> {props.fileName} </p>
        <button onClick={playAudio}>{isPlaying ? "Pause" : "Play"}</button>
        {isPlaying && <p> Playing song </p>}
        {!isPlaying && <p> not playing </p>}

        {props.audioUrl}

        <button
          onClick={() =>
            props.addLiked(
              props.fileName,
              props.trackID,
              props.audioUrl,
              props.ImageURL,
            )
          }
        >
          Like
        </button>
      </>
    );
  }
};

export default AudioPlayer;

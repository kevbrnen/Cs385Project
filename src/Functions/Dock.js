import React from "react";
import Button from "react-bootstrap/Button";

const Dock = (props) => {
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
};

export default Dock;

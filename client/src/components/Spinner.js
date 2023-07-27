import React from "react";
import { Audio } from "react-loader-spinner";

const Spinner = ({ text }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Audio
        height={80}
        width={80}
        radius={9}
        color="blue"
        ariaLabel="loading"
      />
      <p>Loading {text} Please Wait...</p>
    </div>
  );
};

export default Spinner;

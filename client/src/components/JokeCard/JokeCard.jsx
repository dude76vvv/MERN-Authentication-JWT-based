import React from "react";
import "./index.scss";

const JokeCard = ({ jokeId, setup, delivery }) => {
  const toggleSpolier = (spoilerId) => {
    const spoilerEl = document.getElementById(spoilerId);

    if (spoilerEl.style.display === "none") {
      spoilerEl.style.display = "";
    } else {
      spoilerEl.style.display = "none";
    }
  };

  return (
    <div className="card">
      <div className="ask">
        <h3>{setup}</h3>
      </div>

      <div
        id={"spoiler-" + jokeId}
        className="spoiler"
        style={{ display: "none" }}
      >
        <h2>{delivery}</h2>
      </div>

      <button
        onClick={() => {
          var targetId = `spoiler-${jokeId}`;
          toggleSpolier(targetId);
        }}
      >
        Show/Hide
      </button>
    </div>
  );
};

export default JokeCard;

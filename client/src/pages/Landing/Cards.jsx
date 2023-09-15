import React, { useEffect, useState } from "react";
import JokeCard from "../../components/JokeCard/JokeCard";
import BeatLoader from "react-spinners/BeatLoader";
import { Link, Navigate, useNavigate } from "react-router-dom";

import "./index.scss";

// https://sv443.net/jokeapi/v2/

const JOKE_API =
  "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart&amount=3";

const Cards = () => {
  //fetch from joke api

  const [jokes, setjokes] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    generateJokes();
  }, []);

  const generateJokes = () => {
    setLoading(true);

    fetch(JOKE_API)
      .then((data) => data.json())
      .then((result) => {
        setLoading(false);
        if (!result?.error) {
          setjokes(result.jokes);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message);
      });
  };

  return (
    <>
      {isLoading && (
        <BeatLoader color={"#00a796"} loading={isLoading} size={20} />
      )}

      {jokes.length < 1 ? (
        <h1>No Jokes available temporary</h1>
      ) : (
        <div className="jokeContainer">
          <div className="header">
            <h1>Some jokes here</h1>
            <button className="refreshBtn" onClick={generateJokes}>
              Refresh
            </button>
          </div>

          <div className="cardSection">
            {jokes.map((joke) => (
              <JokeCard
                key={joke.id}
                setup={joke.setup}
                delivery={joke.delivery}
                jokeId={joke.id}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Cards;

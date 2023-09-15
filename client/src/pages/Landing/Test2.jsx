import React, { useEffect } from "react";
import { useUser } from "../../context/UserContext";
import axios from "../../api/axios";

//to collect user information if succssful login to google authentication
const SUCCESS_GOOGLE_URL = "oauth/google/success";

const Test2 = () => {
  const { user, setUser } = useUser();

  //cannot use async  in  useEffect
  //create async function and call it oR
  //use .then
  useEffect(() => {
    console.log("landed");

    axios
      .get(SUCCESS_GOOGLE_URL)
      .then((response) => {
        if (response.status === 200) {
          console.log(response);
          console.log(response.data);
          //set the state
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("done");
      });
  }, []);

  return (
    <div>
      <p>hello {user?.name}</p>
    </div>
  );
};

export default Test2;

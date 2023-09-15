import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
import { googleLogout } from "@react-oauth/google";

import "./index.scss";

import { useUser } from "../../context/UserContext";

const LOG_OUT_URL = "/users/logout";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [errMsg, setErrMsg] = useState("");

  const logoutUser = async () => {
    try {
      setUser(null);
      googleLogout();

      //destroy cookie
      const response = await axios.post(LOG_OUT_URL);

      if (response.status === 200) {
        toast.success("Logout Success.", {
          style: {
            color: "#fff",
            background: "green",
            border: "1px solid #000",
            fontSize: "20px",
          },
        });
      }

      navigate("/login");
    } catch (error) {
      console.log(error);

      navigate("/login");

      if (!error?.response) {
        setErrMsg("Failed to logout.No server response");
      } else {
        setErrMsg("Failed to logout.Error");
      }

      toast.error(errMsg, {
        style: {
          color: "#fff",
          background: "red",
          border: "1px solid #000",
          fontSize: "20px",
        },
      });
    }
  };

  return (
    <>
      <div className="navbar">
        <span className="logo">
          <Link className="link" to="/home">
            App
          </Link>
        </span>

        {user ? (
          <ul className="list">
            <li className="listItem">
              {/* <img src={user.photos[0].value} alt="" className="avatar" /> */}
              <img
                src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"
                alt=""
                className="avatar"
              />

              {/* {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="googleProfile"
                  className="avatar"
                />
              ) : (
                <img
                  src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg"
                  alt=""
                  className="avatar"
                />
              )} */}
            </li>
            <li className="listItem">{user.name}</li>
            <button onClick={logoutUser}>Logout</button>
          </ul>
        ) : (
          <Link className="link" to="/login">
            Login
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;

import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const CURR_USER_URL = "users/currentuser";

const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const response = await axios.post(CURR_USER_URL);
      if (response.status === 200 && response.data) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
      console.log(error?.response?.data);
      return null;
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/users/currentuser",
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();

      console.log(data);
    } catch (error) {
      console.log(error);
      setUser(null);
    }
  };

  return (
    //expose the state to childrene
    <UserContext.Provider value={{ user, setUser, getUser, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};

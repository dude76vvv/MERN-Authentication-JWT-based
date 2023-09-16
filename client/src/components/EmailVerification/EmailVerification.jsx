import React, { useEffect, useState } from "react";
import "./index.scss";
import axios from "../../api/axios";
import success from "../../assets/success.png";
import { Link, useParams } from "react-router-dom";

const EmailVerification = () => {
  const [validUrl, setValidUrl] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const param = useParams();
  //   check with backend if link is correct
  useEffect(() => {
    const verifyEmail = async () => {
      if (!validUrl) {
        try {
          const response = await axios.get(
            `/users/${param.id}/verify/${param.token}`
          );

          if (response.status === 201) {
            setValidUrl(true);
            setErrMsg("");
          }

          //error code such as 500,400 will be in catch block
        } catch (error) {
          console.log(`error is ${error}`);
          setValidUrl(false);

          if (!error?.response) {
            setErrMsg("No Server Response");
          } else {
            setErrMsg(error.response.data?.error);
          }
        }
      }
    };

    verifyEmail();
  }, [param.id, param.token, validUrl]);

  return (
    <div className="successFail">
      {!validUrl ? (
        <div className="failContainer">
          <h1>Email verification Failed.Pls contact the admin</h1>
          <h2>{errMsg}</h2>
          <Link to="/register">Back to Register</Link>
        </div>
      ) : (
        <div className="successContainer">
          <img src={success} alt="success_img" className="succesImg" />
          <h1>Email verification success</h1>
          <Link to="/login">Back to login</Link>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;

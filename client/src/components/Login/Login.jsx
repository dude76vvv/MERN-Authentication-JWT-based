import React from "react";
import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { axiosExternal } from "../../api/axios";

import { loginSchema } from "../../schema";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import BeatLoader from "react-spinners/BeatLoader";
import googleImage from "../../assets/google1.png";

import "./index.scss";
import { useUser } from "../../context/UserContext";

import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";

const LOGIN_URL = "users/login";
const GOOGLE_LOGIN_URL = "http://localhost:5000/api/v1/oauth/google/login";
const GOOGLE_REACT_START_URL = "/reactoauth/google";
const GOOGLE_REACT_LOGIN_URL = "/reactoauth/google/login";

const Login = () => {
  const navigate = useNavigate();

  const { user: user1, setUser } = useUser();

  const [errMsg, setErrMsg] = useState("");

  const [isLoading, setLoading] = useState(false);

  //passport google sign
  const googleSignIn = async (e) => {
    e.preventDefault();
    try {
      console.log("google sign in !!");
      window.open(GOOGLE_LOGIN_URL, "_self");
    } catch (error) {
      console.log(error);
      console.log(error);
    }
  };

  // react-oauth google sign in
  const reactGoogleOauth_login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (tokenResponse) => {
      setLoading(true);

      try {
        const response = await axios.post(GOOGLE_REACT_START_URL, {
          tokenResponse,
        });

        if (response.data && response.status === 200) {
          console.log(response.data);

          const userData = response.data.user;

          //we want to attached a cookie with jwt to it before signining in
          //cookie is expected to send back
          const response2 = await axios.post(GOOGLE_REACT_LOGIN_URL, {
            userData,
          });

          setLoading(false);

          if (response2.data && response2.status === 200) {
            console.log(response2.data);
            setUser(response2.data.user);

            toast.success("Login Success.", {
              style: {
                color: "#fff",
                background: "green",
                border: "1px solid #000",
                fontSize: "20px",
              },
            });

            //redirect to login page
            navigate("/home");
          } else {
            setErrMsg("Google Login failed2");
          }
        }
      } catch (error) {
        setLoading(false);

        console.log(error);

        if (!error?.response) {
          setErrMsg("No Server Response");
        } else if (error.response.data?.error) {
          // console.log(response.data.error);
          setErrMsg(error.response.data.error);
        } else {
          setErrMsg("Google Login failed");
        }
      }
    },
  });

  const onSubmit = async (values, actions) => {
    try {
      setLoading(true);

      const { email, password } = values;

      const response = await axios.post(LOGIN_URL, {
        email,
        password,
      });

      console.log(response);

      setLoading(false);

      if (response.status === 200 && response.data) {
        toast.success("Login Success.", {
          style: {
            color: "#fff",
            background: "green",
            border: "1px solid #000",
            fontSize: "20px",
          },
        });

        setUser(response.data.user);

        console.log(user1);
        //redirect to login page
        navigate("/home");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);

      if (!error?.response) {
        setErrMsg("No Server Response");
      } else if (error.response.data?.error) {
        // console.log(response.data.error);
        setErrMsg(error.response.data.error);
      } else {
        setErrMsg("Login failed");
      }

      toast.error("Login failed.", {
        style: {
          color: "#fff",
          background: "red",
          border: "1px solid #000",
          fontSize: "20px",
        },
      });
    }
  };

  const {
    values,
    errors,
    touched,
    dirty,
    isValid,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit,
  });

  //when page loads , clear everything
  useEffect(() => {
    setErrMsg("");
  }, []);

  //clear error message when fields retyped
  useEffect(() => {
    setErrMsg("");
  }, [values.email, values.password]);

  return (
    <>
      <div className="middle">
        <div className="greetings">
          <h1>Welcome to App 😀</h1>
        </div>

        <div className="auth">
          <div className="auth__box">
            <div className="auth__header">
              <h2>Login</h2>
              <section>
                {isLoading ? (
                  <BeatLoader color={"#00a796"} loading={isLoading} size={20} />
                ) : (
                  ""
                )}

                {/* {success && <h4>Success! Please verify email to continue</h4>} */}
                {errMsg && (
                  <div className="errorMsg">
                    <h4>{errMsg}</h4>
                  </div>
                )}
              </section>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="auth__field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.email && touched.email ? "input-error" : ""}
                />
                {errors.email && touched.email && (
                  <p className="errorYup">{errors.email}</p>
                )}
              </div>

              <div className="auth__field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password ? "input-error" : ""
                  }
                />

                {errors.password && touched.password && (
                  <p className="errorYup">{errors.password}</p>
                )}
              </div>

              <footer className="auth__footer">
                <button
                  disabled={!(isValid && dirty) || isSubmitting}
                  type="submit"
                >
                  Login
                </button>

                {/* for passport js */}
                {/* <div className="googleContainer" onClick={googleSignIn}>
                  <img src={googleImage} alt="googleIcon" />
                  <p>Login With Google</p>
                </div> */}

                {/* react google oauth login */}
                <div
                  className="googleContainer"
                  onClick={reactGoogleOauth_login}
                >
                  <img src={googleImage} alt="googleIcon" />
                  <p>Login With Google</p>
                </div>

                <div className="bottom">
                  <div>
                    <p>
                      No account? <Link to="/register">Register here</Link>
                    </p>
                  </div>
                  <div>
                    <p>
                      <Link to="/resetpwd/form">Forgot password?</Link>
                    </p>
                  </div>
                </div>
              </footer>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { registerSchema } from "../../schema";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import BeatLoader from "react-spinners/BeatLoader";

import "./index.scss";

const REGISTER_URL = "users/register";

const Register = () => {
  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (values, actions) => {
    try {
      // console.log(values);

      setLoading(true);

      const { email, name, password, confirmPassword } = values;

      const response = await axios.post(REGISTER_URL, {
        email,
        name,
        password,
        repeat_password: confirmPassword,
      });

      setLoading(false);

      console.log(response);

      if (response.status === 200) {
        actions.resetForm();
        toast.success("Success.Email sent. Please verify email to continue", {
          style: {
            color: "#fff",
            background: "green",
            border: "1px solid #000",
            fontSize: "20px",
          },
        });

        //redirect to login page
        navigate("/login");
      }
      console.log(`${isLoading} , ${errMsg}`);
    } catch (error) {
      console.log(error);

      if (!error?.response) {
        setErrMsg("No Server Response");
      } else if (error?.response?.data) {
        setErrMsg(error.response.data);
      } else {
        setErrMsg("Registration failed");
      }
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
      name: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit,
  });

  //when page loads , clear everything
  useEffect(() => {
    setSuccess(false);
    setErrMsg("");
  }, []);

  //clear error message when fields retyped
  useEffect(() => {
    setErrMsg("");
  }, [values.email, values.name, values.password]);

  return (
    <>
      <div className="middle">
        <div className="auth">
          <div className="auth__box">
            <div className="auth__header">
              <h2>Register</h2>
              <section>
                {isLoading ? (
                  <BeatLoader color={"#00a796"} loading={isLoading} size={20} />
                ) : (
                  ""
                )}

                {/* {success && <h4>Success! Please verify email to continue</h4>} */}
                {errMsg && (
                  <p className="errorMsg">
                    <h4>{errMsg}</h4>
                  </p>
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
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.name && touched.name ? "input-error" : ""}
                />
                {errors.name && touched.name && (
                  <p className="errorYup">{errors.name}</p>
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

              <div className="auth__field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.confirmPassword && touched.confirmPassword
                      ? "input-error"
                      : ""
                  }
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="errorYup">{errors.confirmPassword}</p>
                )}
              </div>

              <footer className="auth__footer">
                <button
                  disabled={!(isValid && dirty) || isSubmitting}
                  type="submit"
                >
                  Register
                </button>

                <div className="login">
                  <p>
                    Already registered? <Link to="/login">Login</Link>
                  </p>
                </div>
              </footer>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

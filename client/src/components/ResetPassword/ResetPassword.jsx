import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import BeatLoader from "react-spinners/BeatLoader";

import "./index.scss";
import { newPwdSchema } from "../../schema";

const RESET_PWD_URL_2 = "reset/resetnewpassword/user";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");

  const [isLoading, setLoading] = useState(false);

  const { id, unique } = useParams();

  const onSubmit = async (values, actions) => {
    try {
      setLoading(true);
      const { password, confirmPassword } = values;

      if (!(password === confirmPassword)) {
        setLoading(false);
        setErrMsg("3.Reset Password failed");
      } else {
        const urlReset = `${RESET_PWD_URL_2}/${id}/${unique}`;

        const response = await axios.put(urlReset, { password });

        if (response.status === 200 && response.data) {
          toast.success("Password reset successful.", {
            style: {
              color: "#fff",
              background: "green",
              border: "1px solid #000",
              fontSize: "20px",
            },
          });

          navigate("/");
        }
      }
    } catch (error) {
      setLoading(false);

      console.log(error);

      if (!error?.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("3.Reset Password failed");
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
      password: "",
      confirmPassword: "",
    },
    validationSchema: newPwdSchema,
    onSubmit,
  });

  //when page loads , clear everything
  useEffect(() => {
    setErrMsg("");
  }, []);

  //clear error message when fields retyped
  useEffect(() => {
    setErrMsg("");
  }, [values.email]);

  return (
    <>
      <div className="middle">
        <div className="greetings">
          <h1>3.Reset password 🤩</h1>
        </div>

        <div className="auth">
          <div className="auth__box">
            <div className="auth__header">
              <h5>Enter new password</h5>
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
                  submit
                </button>

                <div className="bottom">
                  <div>
                    <p>
                      <Link to="/login">Cancel</Link>
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

export default ResetPassword;

import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { resetSchema } from "../../schema";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import BeatLoader from "react-spinners/BeatLoader";

import "./index.scss";

const RESET_PWD_URL_0 = "reset/forgotpassword";

const EmailFormReset = () => {
  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const onSubmit = async (values, actions) => {
    try {
      setLoading(true);

      const { email } = values;

      const response = await axios.post(RESET_PWD_URL_0, {
        email,
      });

      setLoading(false);

      console.log(response);

      if (response.status === 200 && response.data) {
        const { userId, uniqueString } = response.data;

        actions.resetForm();
        toast.success("Success. OTP Email sent.", {
          style: {
            color: "#fff",
            background: "green",
            border: "1px solid #000",
            fontSize: "20px",
          },
        });

        // pass props throug navigate
        navigate(`/resetpwd/otp/${userId}/${uniqueString}`, {
          state: { email: email },
        });
      }
    } catch (error) {
      setLoading(false);
      console.log(error);

      if (!error?.response) {
        setErrMsg("No Server Response");
      } else if (error.response.data?.error) {
        setErrMsg(error.response.data.error);
      } else {
        setErrMsg("1.Reset Password failed");
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
    },
    validationSchema: resetSchema,
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
  }, [values.email]);

  return (
    <>
      <div className="middle">
        <div className="greetings">
          <h1>1.Reset password 😰</h1>
        </div>

        <div className="auth">
          <div className="auth__box">
            <div className="auth__header">
              <h5>Enter email to begin password reset</h5>
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

              <footer className="auth__footer">
                <button
                  disabled={!(isValid && dirty) || isSubmitting}
                  type="submit"
                >
                  Send email
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

export default EmailFormReset;

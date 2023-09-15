import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
import BeatLoader from "react-spinners/BeatLoader";
import OtpInput from "react-otp-input";

import "./index.scss";

const OTP_URL = "reset/verifyotp/user";
const Resend_URL = "reset/forgotpassword";

const Otp = () => {
  const [errMsg, setErrMsg] = useState("");

  const [isLoading, setLoading] = useState(false);

  const [otp, setOtp] = useState("");

  // get the param of current url  eg baseUrl/:id/:unique
  const { id, unique } = useParams();

  //retrieve props passed in by navigate
  const location = useLocation();

  const targetEmail = location.state?.email;

  const navigate = useNavigate();

  const resendOtp = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (targetEmail) {
        const response = await axios.post(Resend_URL, { email: targetEmail });

        if (response.status === 200 && response.data) {
          const userId = response.data.userId;
          const uniqueString = response.data.uniqueString;

          toast.success("Success. OTP Email resend.", {
            style: {
              color: "#fff",
              background: "green",
              border: "1px solid #000",
              fontSize: "20px",
            },
          });

          setOtp("");

          navigate(`/resetpwd/otp/${userId}/${uniqueString}`, {
            state: { email: targetEmail },
          });
        }
      } else {
        setErrMsg("Unable to resend OTP.");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);

      if (!error.response) {
        setErrMsg("No Server Response");
      } else if (error.response.data?.error) {
        setErrMsg(error.response.data.error);
      } else {
        setErrMsg("Unable to resend OTP");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      //front end validation
      if (otp.length < 4 || !otp) {
        setLoading(false);

        setErrMsg("invalid OTP");
      } else {
        const urlVerify = `${OTP_URL}/${id}/${unique}`;
        const response = await axios.post(urlVerify, { otp });

        setLoading(false);

        if (response.status === 200 && response.data) {
          const newUniqueString = response.data.uniqueString;

          //navigate to next page
          navigate(`/resetpwd/reset/${id}/${newUniqueString}`);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (!error?.response) {
        setErrMsg("No Server Response");
      } else if (error.response.data?.error) {
        setErrMsg(error.response.data.error);
      } else {
        setErrMsg("2.Reset Password failed");
      }
    }
  };

  useEffect(() => {
    setErrMsg("");
  }, [otp]);

  return (
    <>
      <div className="middle">
        <div className="greetings">
          <h1>2.Reset password 😰</h1>
        </div>

        <div className="auth">
          <div className="auth__box">
            <div className="auth__header">
              <h5>
                Enter OTP code sent to{" "}
                {targetEmail ? "xxx" + targetEmail.slice(3) : "email"}
              </h5>
              <section>
                {isLoading ? (
                  <BeatLoader color={"#00a796"} loading={isLoading} size={20} />
                ) : (
                  ""
                )}

                {errMsg && (
                  <div className="errorMsg">
                    <h4>{errMsg}</h4>
                  </div>
                )}
              </section>

              <form onSubmit={handleSubmit}>
                <div className="otp-field">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    renderInput={(props) => <input {...props} />}
                    renderSeparator={<span style={{ width: "10px" }}></span>}
                    inputStyle={{
                      border: "1px solid",
                      borderRadius: "8px",
                      width: "54px",
                      height: "54px",
                      fontSize: "2rem",
                      color: "#000",
                      fontWeight: "400",
                      caretColor: "black",
                      textAlign: "center",
                      paddingLeft: "15px",
                    }}
                    placeholder="0000"
                    inputType="number"
                  />
                </div>

                <footer className="auth__footer">
                  <button className="otp-btn" type="submit">
                    Verify OTP
                  </button>

                  <h5>
                    Didn't received code?{" "}
                    <a href="#/" onClick={resendOtp}>
                      ResendOTP
                    </a>
                  </h5>

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
      </div>
    </>
  );
};

export default Otp;

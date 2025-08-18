import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { loginApiSlice } from "../../reduxToolkit/Slices/Auth/auth";
import OtpVerification from "./OtpVerification";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signUpState } from "../../reduxToolkit/Slices/ProductList/listApis";
import "../../assets/css/signup.css";

const SignUp = ({ iState, updateState }) => {
  const { signUpModal } = iState;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getSignUpState } = useSelector((state) => state.productList);
  const [cookies, setCookie] = useCookies(["LennyPhone_number", "LennyCheck"]);

  const signState = {
    phone: cookies?.LennyPhone_number?.toString() || "",
    check: cookies?.LennyCheck || false,
    phone_valid: true,
    disable: false,
    otpModal: false,
    errors: {},
    otp: "",
    init: "temp",
  };

  const [states, updateSignState] = useState(signState);
  const { phone, check, phone_valid, disable, errors, otpModal } = states;

  const handleClose = () => {
    updateState({ ...iState, signUpModal: false });
    window.localStorage.setItem("LoginTimer", true);
    dispatch(signUpState(false));
    updateSignState(signState);
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      updateSignState({ ...states, phone: digitsOnly, errors: {} });
    } else {
      updateSignState({ ...states, [name]: checked });
    }
  };

  const handleValidation = () => {
    const error = {};
    let valid = true;
    const trimmedPhone = String(phone).trim();

    if (!trimmedPhone || trimmedPhone.length !== 10) {
      error.phoneError = "*Phone Number must be 10 digits";
      valid = false;
    }

    updateSignState({ ...states, errors: error });
    return valid;
  };

  const handleSignIn = () => {
    if (!handleValidation()) return;

    dispatch(loginApiSlice({ phone }))
      .then((res) => {
        if (res?.payload?.status === 200) {
          updateSignState({
            ...states,
            otp: res.payload.data.otp,
            otpModal: true,
            init: 59,
          });
          toast.success(`${res?.payload?.data?.message}`);
          updateState({ ...iState, signUpModal: false }); // close signup modal
        }
      })
      .catch((err) => console.log(err));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && e.target.name === "phone") {
      updateSignState({ ...states, phone_valid: true });
    }
  };

  useEffect(() => {
    if (phone?.length >= 10) {
      updateSignState((prev) => ({ ...prev, phone_valid: false }));
    }
  }, [phone]);

  useEffect(() => {
    if (getSignUpState) {
      updateState({ ...iState, signUpModal: true });
    }
  }, [getSignUpState]);

  return (
    <>
      {signUpModal && (
        <div className="signup-overlay top-aligned">
          <div className="signup-modal">
            <button onClick={handleClose} className="signup-close-btn">
              <svg className="signup-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="logo-img">
              <img src={require("../../assets/images/Header_Logo.png")} />
            </div>

            <h2 className="signup-title">Mobile Login</h2>

            <input
              type="text"
              name="phone"
              placeholder="Enter 10 digit Mobile Number Eg: 8010679679"
              className="signup-input"
              value={phone}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              maxLength="10"
              pattern="[0-9]*"
              inputMode="numeric"
            />
            <span className="signup-error">{errors?.phoneError}</span>

            <button
              onClick={handleSignIn}
              className="signup-primary-btn"
              disabled={disable}
            >
              LOG IN VIA OTP
            </button>

            <div className="signup-divider">
              <div className="signup-line" />
              <span className="signup-or">or</span>
              <div className="signup-line" />
            </div>

            <div className="signup-social">
              <button className="signup-btn signup-fb">
                <i className="fa-brands fa-facebook mr-2"></i> Facebook Login
              </button>
              <button className="signup-btn signup-google">
                <i className="fa-brands fa-google mr-2"></i> Google Login
              </button>
              <button className="signup-btn signup-email">
                <i className="fa-solid fa-envelope mr-2"></i>Email Login
              </button>
            </div>

            <p className="signup-terms">
              By Logging in you are agreeing to our{" "}
              <a href="#" className="signup-link">Terms and Conditions</a> and{" "}
              <a href="#" className="signup-link">Privacy Policy</a>.
            </p>
          </div>
        </div>
      )}

      {otpModal && (
        <OtpVerification
          states={states}
          updateSignState={updateSignState}
          editModal={iState}
          editUpdate={updateState}
          cookies={cookies}
          setCookie={setCookie}
        />
      )}
    </>
  );
};

export default SignUp;

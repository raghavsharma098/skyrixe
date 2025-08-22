import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OtpVerification from "./OtpVerification";

// Redux
import { loginApiSlice } from "../../reduxToolkit/Slices/Auth/auth";
import { signUpState, userDetailState } from "../../reduxToolkit/Slices/ProductList/listApis";

// Utils
import {
  handleFacebookLogin,
  handleGoogleLogin,
  handleGoogleLoginPopup,
  handleSocialLoginSuccess,
  handleSocialLoginError,
  validateSocialAuthEnvironment,
} from "../../Utils/SocialAuthUtil";

// CSS
import "../../assets/css/signup.css";

const SignUp = ({ iState, updateState }) => {
  const { signUpModal } = iState;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getSignUpState } = useSelector((state) => state.productList);
  const [cookies, setCookie] = useCookies(["LennyPhone_number", "LennyCheck"]);

  const initialState = {
    phone: cookies?.LennyPhone_number?.toString() || "",
    check: cookies?.LennyCheck || false,
    email: "",
    password: "",
    useEmail: false,
    phone_valid: true,
    disable: false,
    otpModal: false,
    errors: {},
    otp: "",
    init: "temp",
  };

  const [states, updateSignState] = useState(initialState);
  const { phone, email, password, useEmail, disable, errors, otpModal } = states;

  useEffect(() => {
    validateSocialAuthEnvironment();
  }, []);

  const handleClose = () => {
    updateState({ ...iState, signUpModal: false });
    window.localStorage.setItem("LoginTimer", true);
    dispatch(signUpState(false));
    updateSignState(initialState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      updateSignState({ ...states, phone: digitsOnly, errors: {} });
    } else {
      updateSignState({ ...states, [name]: value, errors: {} });
    }
  };

  const toggleLoginMode = () => {
    updateSignState({ ...states, useEmail: !useEmail, errors: {} });
  };

  const handlePhoneValidation = () => {
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

  const handleEmailValidation = () => {
    const error = {};
    let valid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      error.emailError = "*Valid email required";
      valid = false;
    }
    if (!password || password.length < 6) {
      error.passwordError = "*Password must be at least 6 characters";
      valid = false;
    }

    updateSignState({ ...states, errors: error });
    return valid;
  };

  const handleSignIn = async () => {
    if (useEmail) {
      if (!handleEmailValidation()) return;

      try {
        // Simulate email login (replace this with real API)
        const userData = {
          _id: `email_${Date.now()}`,
          userId: `email_${Date.now()}`,
          data: {
            personalInfo: {
              name: "Email User",
              email,
              photo: "",
              phone: "",
              gender: "",
              dob: "",
            },
            addresses: [],
            authMethod: "email",
          },
        };

        window.localStorage.setItem("LennyUserDetail", JSON.stringify(userData));
        window.localStorage.setItem("LoginTimer", "false");
        setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
        dispatch(userDetailState(true));

        toast.success("Email login successful!");
        updateState({ ...iState, signUpModal: false });
      } catch (error) {
        toast.error("Email login failed.");
      }
    } else {
      if (!handlePhoneValidation()) return;

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
            updateState({ ...iState, signUpModal: false }); // hide modal
          }
        })
        .catch((err) => {
          toast.error("OTP request failed.");
          console.log(err);
        });
    }
  };

  const handleSocialLogin = async (method) => {
    try {
      if (method === "google") {
        try {
          const result = await handleGoogleLoginPopup();
          console.log(result);
          const { userData } = result;
          window.localStorage.setItem("LennyUserDetail", JSON.stringify(userData));
          window.localStorage.setItem("LoginTimer", "false");
          setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
          dispatch(userDetailState(true));

          toast.success("Google login successful!");
          updateState({ ...iState, signUpModal: false });
        } catch (popupError) {
          const fallbackResult = await handleGoogleLogin();
          handleSocialLoginSuccess(fallbackResult, setCookie, dispatch, () => {
            toast.success("Google login successful!");
            updateState({ ...iState, signUpModal: false });
          });
        }
      } else if (method === "facebook") {
        const result = await handleFacebookLogin();
        handleSocialLoginSuccess(result, setCookie, dispatch, () => {
          toast.success("Facebook login successful!");
          updateState({ ...iState, signUpModal: false });
        });
      }
    } catch (error) {
      handleSocialLoginError(error, method);
    }
  };

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
              <img src={require("../../assets/images/Header_Logo.png")} alt="Logo" />
            </div>

            <h2 className="signup-title">{useEmail ? "Email Login" : "Mobile Login"}</h2>

            {!useEmail ? (
              <>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter 10 digit Mobile Number"
                  className="signup-input"
                  value={phone}
                  onChange={handleInputChange}
                  maxLength="10"
                  inputMode="numeric"
                />
                <span className="signup-error">{errors?.phoneError}</span>
              </>
            ) : (
              <>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  className="signup-input"
                  value={email}
                  onChange={handleInputChange}
                />
                <span className="signup-error">{errors?.emailError}</span>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  className="signup-input"
                  value={password}
                  onChange={handleInputChange}
                />
                <span className="signup-error">{errors?.passwordError}</span>
              </>
            )}

            <button onClick={handleSignIn} className="signup-primary-btn" disabled={disable}>
              {useEmail ? "LOG IN WITH EMAIL" : "LOG IN VIA OTP"}
            </button>

            <div className="signup-divider">
              <div className="signup-line" />
              <span className="signup-or">or</span>
              <div className="signup-line" />
            </div>

            <div className="signup-social">
              <button className="signup-btn signup-fb" onClick={() => handleSocialLogin("facebook")}>
                <i className="fa-brands fa-facebook mr-2"></i> Facebook Login
              </button>
              <button className="signup-btn signup-google" onClick={() => handleSocialLogin("google")}>
                <i className="fa-brands fa-google mr-2"></i> Google Login
              </button>
              <button className="signup-btn signup-email" onClick={toggleLoginMode}>
                <i className="fa-solid fa-envelope mr-2"></i> {useEmail ? "Use OTP Instead" : "Email Login"}
              </button>
            </div>

            <p className="signup-terms">
              By Logging in you are agreeing to our{" "}
              <a href="/terms-conditions" className="signup-link">Terms and Conditions</a> and{" "}
              <a href="/privacy-policy" className="signup-link">Privacy Policy</a>.
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

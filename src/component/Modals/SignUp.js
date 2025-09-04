import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
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
import { credAndUrl } from "../../config/config";

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
    confirmPassword: "",
    fullName: "",
    useEmail: false,
    isSignUp: false, // New state to toggle between login/signup
    phone_valid: true,
    disable: false,
    otpModal: false,
    errors: {},
    otp: "",
    init: "temp",
  };

  const [states, updateSignState] = useState(initialState);
  const {
    phone,
    email,
    password,
    confirmPassword,
    fullName,
    useEmail,
    isSignUp,
    disable,
    errors,
    otpModal
  } = states;

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
    updateSignState({
      ...states,
      useEmail: !useEmail,
      isSignUp: false,
      errors: {},
      email: "",
      password: "",
      confirmPassword: "",
      fullName: ""
    });
  };

  const toggleSignUpMode = () => {
    updateSignState({
      ...states,
      isSignUp: !isSignUp,
      errors: {},
      password: "",
      confirmPassword: "",
      fullName: ""
    });
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

    // Additional validation for signup
    if (isSignUp) {
      if (!fullName || fullName.trim().length < 2) {
        error.nameError = "*Full name is required (minimum 2 characters)";
        valid = false;
      }
      if (password !== confirmPassword) {
        error.confirmPasswordError = "*Passwords do not match";
        valid = false;
      }
    }

    updateSignState({ ...states, errors: error });
    return valid;
  };

  // Simulate user database - In real app, this would be API calls

const handleEmailSignUp = async ({ name, email, password, cnfPassword, phone}) => {
  try {
    // Frontend validation
    if (!fullName || !email || !password || !cnfPassword || !phone) {
      toast.error("Please fill all required fields");
      return;
    }
    if (password !== cnfPassword) {
      toast.error("Passwords do not match");
      return;
    }

    handleEmailValidation();
    // Call backend signup API
    const response = await axios.post(`${credAndUrl.BASE_URL}customer/auth/email-signup`, {
      name: fullName,
      email,
      password,
      cnfPassword,
      phone: phone || null,
      gender: "",
      dob: null,
    });

    const data = response.data;

    if (data.status !== 201) {
      toast.error(data.message || "Signup failed");
      return;
    }

    // Store session in localStorage + cookie
    window.localStorage.setItem("LennyUserDetail", JSON.stringify(data.data));
    window.localStorage.setItem("LoginTimer", "false");
    setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
    dispatch(userDetailState(true));

    toast.success("Account created successfully!");
    updateState({ ...iState, signUpModal: false });

  } catch (error) {
    console.error("Email signup error:", error);
    toast.error(error.response?.data?.message || "Failed to create account. Please try again.");
  }
};

const handleEmailLogin = async ({ email, password }) => {
  try {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    // Call backend login API
    const response = await axios.post(`${credAndUrl.BASE_URL}customer/auth/email-login`, {
      email,
      password,
    });

    const data = response.data;

    if (data.status !== 200) {
      toast.error(data.message || "Login failed");
      return;
    }

    // Store session in localStorage + cookie
    window.localStorage.setItem("LennyUserDetail", JSON.stringify(data.data));
    window.localStorage.setItem("LoginTimer", "false");
    setCookie("LennyCheck", true, { path: "/" }, { expires: new Date("9999-12-31") });
    dispatch(userDetailState(true));

    toast.success("Login successful!");
    updateState({ ...iState, signUpModal: false });

  } catch (error) {
    console.error("Email login error:", error);
    toast.error(error.response?.data?.message || "Login failed. Please try again.");
  }
};

  const handleSignIn = async () => {
    if (useEmail) {
      if (isSignUp) {
        await handleEmailSignUp({ name: fullName, password, cnfPassword: confirmPassword, email, phone });
      } else {
        await handleEmailLogin({ email, password });
      }
    } else {
      if (!handlePhoneValidation()) return;

      dispatch(loginApiSlice({ phone }))
        .then((res) => {
          if (res?.payload?.status === 200) {
            updateSignState({
              ...states,
              otp: res.payload.otp,
              otpModal: true,
              init: 59,
            });
            toast.success(`${res?.payload?.message}`);
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

  const getModalTitle = () => {
    if (useEmail) {
      return isSignUp ? "Create Account" : "Email Login";
    }
    return "Mobile Login";
  };

  const getSubmitButtonText = () => {
    if (useEmail) {
      return isSignUp ? "CREATE ACCOUNT" : "LOG IN WITH EMAIL";
    }
    return "LOG IN VIA OTP";
  };

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

            <h2 className="signup-title">{getModalTitle()}</h2>

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
                {isSignUp && (
                  <>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter Full Name"
                      className="signup-input"
                      value={fullName}
                      onChange={handleInputChange}
                    />
                    <span className="signup-error">{errors?.nameError}</span>
                  </>
                )}

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

                {isSignUp && (
                  <>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="signup-input"
                      value={confirmPassword}
                      onChange={handleInputChange}
                    />
                    <span className="signup-error">{errors?.confirmPasswordError}</span>



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
                )}

                {/* Toggle between Login/Signup */}
                <div style={{ textAlign: 'center', margin: '10px 0' }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    <button
                      type="button"
                      onClick={toggleSignUpMode}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#007bff',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      {isSignUp ? "Login here" : "Sign up here"}
                    </button>
                  </span>
                </div>
              </>
            )}

            <button onClick={handleSignIn} className="signup-primary-btn" disabled={disable}>
              {getSubmitButtonText()}
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
        </div >
      )}

      {
        otpModal && (
          <OtpVerification
            states={states}
            updateSignState={updateSignState}
            editModal={iState}
            editUpdate={updateState}
            cookies={cookies}
            setCookie={setCookie}
          />
        )
      }
    </>
  );
};

export default SignUp;
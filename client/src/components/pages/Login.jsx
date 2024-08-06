import React, { useState } from "react";
import "../../assets/css/login.css";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="container">
        <div className="login-box">
          <h1>Login to Your Account</h1>
          <form action="#" method="POST">
            <div className="textbox">
              <label htmlFor="email">ID</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="textbox">
              <label htmlFor="password">Password</label>
              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                />
                <span
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                >
                  <i
                    className={`fa ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                </span>
              </div>
            </div>
            <button type="submit" className="btn">
              Login
            </button>
            <div className="or-container mt-4">
              <hr className="line" />
              <span className="or-text">or</span>
              <hr className="line" />
            </div>

            <div className="d-flex mt-4 align-items-center justify-content-center">
              <span className="text-secondary">Already Have an Account ? </span>
              <a href="#" className="forgot mt-0">
                &nbsp; Create Account
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;

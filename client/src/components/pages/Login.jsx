import React, { useState } from "react";
import "../../assets/css/login.css";
import { post } from "../../libs/http-hydrate";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    let errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setApiError("");

    try {
      const form = new FormData();
      form.append("email", formData?.email);
      form.append("password", formData?.password);
      const response = await post("/api/user/login", formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      if (response?.status === 200) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            name:response.data.user.name,
            email:response.data.user.email,
            role:response.data.user.role,
            username:response.data.user.username,
            token:response.data.token,
          })
        );
        navigate("/")
      } else {
        setApiError("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      console.log(error);
      setApiError(error?.response?.data?.error ? error?.response?.data?.error : "An error occurred during login. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h1>Login to Your Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="textbox">
            <label htmlFor="email">ID</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <span className="api-error">{errors.email}</span>}
          </div>
          <div className="textbox">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
            {errors.password && <span className="api-error">{errors.password}</span>}
          </div>
          {apiError && <div className="api-error">{apiError}</div>}
          <button type="submit" className="btn mt-3" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
          <div className="or-container mt-4">
            <hr className="line" />
            <span className="or-text">or</span>
            <hr className="line" />
          </div>
          <div className="d-flex mt-4 align-items-center justify-content-center">
            <span className="text-secondary">Already Have an Account? </span>
            <a href="#" className="forgot mt-0">&nbsp; Create Account</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

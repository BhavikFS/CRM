import { post } from "./http-hydrate";

const register = async (formdata) => {
  //  validate first
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await post("/register", formdata, config);
    if (response?.status === 200 && response.data.type === "OK") {
      localStorage.setItem("user", JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    console.error("REGISTER ERROR!!!");
    return new Error("ERROR occured while registering new user");
  }
};

const login = async (formdata) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await post("/login", formdata, config);
    if (response?.status === 200) {
      const userData = response.data.data;
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id:userData?._id,
          email:userData.email,
          mobile_number:userData.mobile_number,
          name: userData.name,
          token: userData.token,
          verified:userData?.verified
        })
      );

      if(sessionStorage.getItem("redirect")){
        window.location.pathname = sessionStorage.getItem("url");
        sessionStorage.removeItem("redirect");
        sessionStorage.removeItem("url")
      }
    }
    return response.data;
  } catch (error) {
    console.error("LOGIN ERROR!!!", error);
    return error.response;
  }
};

const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("dark");
  localStorage.getItem("logoutThemeDark");
};

const getAuthToken = () => {
  return localStorage.getItem("user")
    ? `${JSON.parse(localStorage.getItem("user")).token}`
    : null;
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const Auth = { register, login, logout, getCurrentUser, getAuthToken };

export default Auth;

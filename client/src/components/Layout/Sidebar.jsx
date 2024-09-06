import React, { useState } from "react";
import logo from "../../assets/images/CRMLogo.png";
import Home from "../../assets/images/Home.svg";
import History from "../../assets/images/History.svg";
import Logout from "../../assets/images/Logout.svg";

import "../../assets/css/sidebar.css";
import { useLocation, Link, useNavigate } from "react-router-dom";
import LogoutModal from "../Modal/LogoutModal";
import Auth from "../../libs/auth";

const Sidebar = () => {
  const location = useLocation();
  const activePage = location.pathname.replace("/", "");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const handleHistoryClick = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };
  const handleFinanceClick = () => {
    setIsFinanceOpen(!isFinanceOpen);
  };
  const user = Auth.getCurrentUser();
  const navigate = useNavigate();

  return (
    <>
      <div className="sidebar-main">
        <div className="logo-part">
          <Link to={"/"}>
            <img src={logo} alt="docpy-logo" className="img-fluid" />
          </Link>
        </div>

        <div className="nav-part">
          <div className="top-navpart">
            <div className="form">
              <i className="fa fa-search"></i>
              <input
                type="text"
                className="form-control form-input"
                placeholder="Search "
              />
            </div>
{ user?.role === "Manager" ?

            
<>

<div className={`nav-items ${isFinanceOpen ? "active" : ""}`}>
  <div
    onClick={handleFinanceClick}
    style={{
      textDecoration: "none",
      color: "inherit",
      cursor: "pointer",
    }}
    className={`nav-btns ${isFinanceOpen ? "active activebg" : ""}`}
  >
    <div className="nav-btn">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeWidth="1.5"
          d="M20.9999 5.81195C20.9999 6.26331 20.78 6.71025 20.3529 7.12725C19.9257 7.54425 19.2996 7.92315 18.5103 8.24231C17.721 8.56146 16.784 8.81463 15.7527 8.98736C14.7214 9.16009 13.6161 9.24899 12.4999 9.24899C10.2455 9.24899 8.08353 8.88688 6.48947 8.24231C4.89541 7.59774 3.99988 6.72351 3.99988 5.81195C3.99988 5.36059 4.21974 4.91365 4.6469 4.49665C5.07407 4.07965 5.70017 3.70075 6.48947 3.38159C7.27877 3.06244 8.2158 2.80927 9.24707 2.63654C10.2783 2.46381 11.3836 2.37491 12.4999 2.37491C13.6161 2.37491 14.7214 2.46381 15.7527 2.63654C16.784 2.80927 17.721 3.06244 18.5103 3.38159C19.2996 3.70075 19.9257 4.07965 20.3529 4.49665C20.78 4.91365 20.9999 5.36059 20.9999 5.81195Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeWidth="1.5"
          d="M20.9999 18.1853C20.9999 18.7886 20.6071 19.3813 19.8611 19.9038C19.1151 20.4263 18.042 20.8602 16.7499 21.1619C15.4577 21.4635 13.9919 21.6223 12.4999 21.6223C11.0078 21.6223 9.54204 21.4635 8.24988 21.1619C6.95771 20.8602 5.88469 20.4263 5.13866 19.9038C4.39263 19.3813 3.99988 18.7886 3.99988 18.1853"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeWidth="1.5"
          d="M20.9999 14.0609C20.9999 14.6642 20.6071 15.2569 19.8611 15.7794C19.1151 16.3019 18.042 16.7358 16.7499 17.0374C15.4577 17.3391 13.9919 17.4979 12.4999 17.4979C11.0078 17.4979 9.54204 17.3391 8.24988 17.0374C6.95771 16.7358 5.88469 16.3019 5.13866 15.7794C4.39263 15.2569 3.99988 14.6642 3.99988 14.0609"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeWidth="1.5"
          d="M20.9999 9.9364C20.9999 10.5397 20.6071 11.1324 19.8611 11.6549C19.1151 12.1774 18.042 12.6113 16.7499 12.913C15.4577 13.2146 13.9919 13.3734 12.4999 13.3734C11.0078 13.3734 9.54204 13.2146 8.24988 12.913C6.95771 12.6113 5.88469 12.1774 5.13866 11.6549C4.39263 11.1324 3.99988 10.5397 3.99988 9.9364"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeWidth="1.5"
          d="M3.99988 5.81197V18.1853"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeWidth="1.5"
          d="M21 5.81192V18.1853"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p onClick={() => navigate("/history")} className="text">
        Finance
      </p>
      <i
        className={`fa fa-angle-${
          isFinanceOpen ? "up" : "down"
        } dropdown-icon`}
      ></i>
    </div>
  </div>
  {isFinanceOpen && (
    <div className="sub-menu">
      <Link to="/Pending-stageForCO" className="sub-item">
        Pending
      </Link>
      <Link to="/Approved-stageForCO" className="sub-item">
Approved
      </Link>
      <Link to="/Rejected-stageForCO" className="sub-item">
Rejected
      </Link>
    </div>
  )}
</div>
<div className={`nav-items ${isHistoryOpen ? "active" : ""}`}>
  <div
    onClick={handleHistoryClick}
    style={{
      textDecoration: "none",
      color: "inherit",
      cursor: "pointer",
    }}
    className={`nav-btns ${isHistoryOpen ? "active activebg" : ""}`}
  >
    <div className="nav-btn">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeWidth="1.5"
          d="M20.9999 5.81195C20.9999 6.26331 20.78 6.71025 20.3529 7.12725C19.9257 7.54425 19.2996 7.92315 18.5103 8.24231C17.721 8.56146 16.784 8.81463 15.7527 8.98736C14.7214 9.16009 13.6161 9.24899 12.4999 9.24899C10.2455 9.24899 8.08353 8.88688 6.48947 8.24231C4.89541 7.59774 3.99988 6.72351 3.99988 5.81195C3.99988 5.36059 4.21974 4.91365 4.6469 4.49665C5.07407 4.07965 5.70017 3.70075 6.48947 3.38159C7.27877 3.06244 8.2158 2.80927 9.24707 2.63654C10.2783 2.46381 11.3836 2.37491 12.4999 2.37491C13.6161 2.37491 14.7214 2.46381 15.7527 2.63654C16.784 2.80927 17.721 3.06244 18.5103 3.38159C19.2996 3.70075 19.9257 4.07965 20.3529 4.49665C20.78 4.91365 20.9999 5.36059 20.9999 5.81195Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeWidth="1.5"
          d="M20.9999 18.1853C20.9999 18.7886 20.6071 19.3813 19.8611 19.9038C19.1151 20.4263 18.042 20.8602 16.7499 21.1619C15.4577 21.4635 13.9919 21.6223 12.4999 21.6223C11.0078 21.6223 9.54204 21.4635 8.24988 21.1619C6.95771 20.8602 5.88469 20.4263 5.13866 19.9038C4.39263 19.3813 3.99988 18.7886 3.99988 18.1853"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeWidth="1.5"
          d="M20.9999 14.0609C20.9999 14.6642 20.6071 15.2569 19.8611 15.7794C19.1151 16.3019 18.042 16.7358 16.7499 17.0374C15.4577 17.3391 13.9919 17.4979 12.4999 17.4979C11.0078 17.4979 9.54204 17.3391 8.24988 17.0374C6.95771 16.7358 5.88469 16.3019 5.13866 15.7794C4.39263 15.2569 3.99988 14.6642 3.99988 14.0609"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeWidth="1.5"
          d="M20.9999 9.9364C20.9999 10.5397 20.6071 11.1324 19.8611 11.6549C19.1151 12.1774 18.042 12.6113 16.7499 12.913C15.4577 13.2146 13.9919 13.3734 12.4999 13.3734C11.0078 13.3734 9.54204 13.2146 8.24988 12.913C6.95771 12.6113 5.88469 12.1774 5.13866 11.6549C4.39263 11.1324 3.99988 10.5397 3.99988 9.9364"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeWidth="1.5"
          d="M3.99988 5.81197V18.1853"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          strokeWidth="1.5"
          d="M21 5.81192V18.1853"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p onClick={() => navigate("/history")} className="text">
        PC
      </p>
      <i
        className={`fa fa-angle-${
          isHistoryOpen ? "up" : "down"
        } dropdown-icon`}
      ></i>
    </div>
  </div>
  {isHistoryOpen && (
    <div className="sub-menu">
      <Link to="/Pending-stageForPC" className="sub-item">
        Pendig
      </Link>
      <Link to="/Approved-stageForPC" className="sub-item">
       Approved
      </Link>
      <Link to="/Rejected-stageForPC" className="sub-item">
       Rejected
      </Link>
    </div>
  )}
</div>
</> : !(user?.role === 'CO' || user?.role === 'PC') ? <>
            <Link
              to="/"
              style={{ textDecoration: "none", color: "inherit" }}
              className={` ${activePage === "" ? "activebg" : ""} `}
            >
              <div
                className={` ${
                  activePage === "dashboard" || activePage === "doctorList"
                    ? "nav-btn active"
                    : "nav-btn"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 21H5C3.89543 21 3 20.1046 3 19V12.2969C3 11.7852 3.19615 11.2929 3.54809 10.9215L10.5481 3.53257C11.3369 2.69989 12.663 2.69989 13.4519 3.53257L20.4519 10.9215C20.8038 11.2929 21 11.7852 21 12.2969V19C21 20.1046 20.1046 21 19 21H14M10 21V15.5C10 15.2239 10.2239 15 10.5 15H13.5C13.7761 15 14 15.2239 14 15.5V21M10 21H14"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>

                <p className="text">Home</p>
              </div>
            </Link>

            <div className={`nav-items ${isHistoryOpen ? "active" : ""}`}>
              <div
                onClick={handleHistoryClick}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
                className={`nav-btns ${isHistoryOpen ? "active activebg" : ""}`}
              >
                <div className="nav-btn">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeWidth="1.5"
                      d="M20.9999 5.81195C20.9999 6.26331 20.78 6.71025 20.3529 7.12725C19.9257 7.54425 19.2996 7.92315 18.5103 8.24231C17.721 8.56146 16.784 8.81463 15.7527 8.98736C14.7214 9.16009 13.6161 9.24899 12.4999 9.24899C10.2455 9.24899 8.08353 8.88688 6.48947 8.24231C4.89541 7.59774 3.99988 6.72351 3.99988 5.81195C3.99988 5.36059 4.21974 4.91365 4.6469 4.49665C5.07407 4.07965 5.70017 3.70075 6.48947 3.38159C7.27877 3.06244 8.2158 2.80927 9.24707 2.63654C10.2783 2.46381 11.3836 2.37491 12.4999 2.37491C13.6161 2.37491 14.7214 2.46381 15.7527 2.63654C16.784 2.80927 17.721 3.06244 18.5103 3.38159C19.2996 3.70075 19.9257 4.07965 20.3529 4.49665C20.78 4.91365 20.9999 5.36059 20.9999 5.81195Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      strokeWidth="1.5"
                      d="M20.9999 18.1853C20.9999 18.7886 20.6071 19.3813 19.8611 19.9038C19.1151 20.4263 18.042 20.8602 16.7499 21.1619C15.4577 21.4635 13.9919 21.6223 12.4999 21.6223C11.0078 21.6223 9.54204 21.4635 8.24988 21.1619C6.95771 20.8602 5.88469 20.4263 5.13866 19.9038C4.39263 19.3813 3.99988 18.7886 3.99988 18.1853"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      strokeWidth="1.5"
                      d="M20.9999 14.0609C20.9999 14.6642 20.6071 15.2569 19.8611 15.7794C19.1151 16.3019 18.042 16.7358 16.7499 17.0374C15.4577 17.3391 13.9919 17.4979 12.4999 17.4979C11.0078 17.4979 9.54204 17.3391 8.24988 17.0374C6.95771 16.7358 5.88469 16.3019 5.13866 15.7794C4.39263 15.2569 3.99988 14.6642 3.99988 14.0609"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      strokeWidth="1.5"
                      d="M20.9999 9.9364C20.9999 10.5397 20.6071 11.1324 19.8611 11.6549C19.1151 12.1774 18.042 12.6113 16.7499 12.913C15.4577 13.2146 13.9919 13.3734 12.4999 13.3734C11.0078 13.3734 9.54204 13.2146 8.24988 12.913C6.95771 12.6113 5.88469 12.1774 5.13866 11.6549C4.39263 11.1324 3.99988 10.5397 3.99988 9.9364"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      strokeWidth="1.5"
                      d="M3.99988 5.81197V18.1853"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      strokeWidth="1.5"
                      d="M21 5.81192V18.1853"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p onClick={() => navigate("/history")} className="text">
                    History
                  </p>
                  <i
                    className={`fa fa-angle-${
                      isHistoryOpen ? "up" : "down"
                    } dropdown-icon`}
                  ></i>
                </div>
              </div>
              {isHistoryOpen && (
                <div className="sub-menu">
                  <Link to="/partyData" className="sub-item">
                    Party Data
                  </Link>
                  <Link to="/grpData" className="sub-item">
                    Group Data
                  </Link>
                </div>
              )}
            </div>
            </> :  
            <>
            <Link
              to="/pending"
              style={{ textDecoration: "none", color: "inherit" }}
              className={` ${activePage === "pending" ? "activebg" : ""} `}
            >
              <div
                className={` ${
                  activePage === "pending" ? "nav-btn active" : "nav-btn"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.3603 7.31551V11.2277L15.611 13.1779C15.7747 13.2763 15.8927 13.4356 15.9389 13.6209C15.9852 13.8063 15.9559 14.0024 15.8576 14.1661C15.7592 14.3298 15.5999 14.4478 15.4145 14.4941C15.2292 14.5403 15.0331 14.511 14.8694 14.4127L11.2695 12.2528C11.1629 12.1887 11.0748 12.0982 11.0136 11.9901C10.9524 11.8819 10.9203 11.7597 10.9203 11.6354V7.31551C10.9203 7.12456 10.9962 6.94143 11.1312 6.80641C11.2662 6.67138 11.4493 6.59553 11.6403 6.59553C11.8312 6.59553 12.0144 6.67138 12.1494 6.80641C12.2844 6.94143 12.3603 7.12456 12.3603 7.31551ZM20.28 5.15557C20.0891 5.15557 19.9059 5.23143 19.7709 5.36645C19.6359 5.50147 19.56 5.6846 19.56 5.87555V7.4955C18.9886 6.83312 18.4054 6.19504 17.7493 5.53086C16.5486 4.33003 15.0207 3.50966 13.3564 3.17226C11.6921 2.83486 9.96529 2.99538 8.39173 3.63378C6.81816 4.27217 5.46761 5.36013 4.50883 6.7617C3.55006 8.16328 3.02557 9.81632 3.00091 11.5143C2.97625 13.2122 3.45251 14.8798 4.37017 16.3086C5.28784 17.7375 6.60622 18.8642 8.16058 19.548C9.71494 20.2318 11.4364 20.4424 13.1097 20.1535C14.7831 19.8646 16.3342 19.0889 17.5693 17.9235C17.6381 17.8585 17.6934 17.7806 17.7321 17.6942C17.7707 17.6078 17.792 17.5147 17.7947 17.4201C17.7974 17.3255 17.7814 17.2313 17.7477 17.1428C17.7139 17.0544 17.6631 16.9735 17.5981 16.9047C17.5331 16.8359 17.4552 16.7806 17.3688 16.742C17.2824 16.7033 17.1893 16.682 17.0947 16.6793C17.0001 16.6767 16.9059 16.6926 16.8175 16.7264C16.729 16.7601 16.6481 16.8109 16.5793 16.8759C15.5498 17.8462 14.2573 18.4916 12.8631 18.7316C11.4689 18.9717 10.035 18.7957 8.74022 18.2256C7.44548 17.6556 6.34737 16.7167 5.58302 15.5263C4.81867 14.3359 4.42195 12.9467 4.4424 11.5322C4.46285 10.1177 4.89956 8.74051 5.698 7.5727C6.49644 6.40488 7.62123 5.49817 8.9319 4.96578C10.2426 4.43339 11.681 4.29892 13.0677 4.57916C14.4543 4.8594 15.7277 5.54194 16.7287 6.54153C17.4613 7.28311 18.103 7.99769 18.7501 8.75546H16.6801C16.4892 8.75546 16.306 8.83132 16.171 8.96634C16.036 9.10136 15.9602 9.28449 15.9602 9.47544C15.9602 9.66639 16.036 9.84952 16.171 9.98454C16.306 10.1196 16.4892 10.1954 16.6801 10.1954H20.28C20.471 10.1954 20.6541 10.1196 20.7891 9.98454C20.9241 9.84952 21 9.66639 21 9.47544V5.87555C21 5.6846 20.9241 5.50147 20.7891 5.36645C20.6541 5.23143 20.471 5.15557 20.28 5.15557Z"
                    fill="currentColor"
                  />
                </svg>

                <p className="text">Pending</p>
              </div>
            </Link>

            <Link
              to="/approved"
              style={{ textDecoration: "none", color: "inherit" }}
              className={` ${activePage === "approved" ? "activebg" : ""} `}
            >
              <div
                className={` ${
                  activePage === "approved" ? "nav-btn active" : "nav-btn"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.55665 15.9177L4.8286 12.1896C4.62771 11.9887 4.35526 11.8759 4.07117 11.8759C3.78708 11.8759 3.51462 11.9887 3.31374 12.1896C3.11285 12.3905 3 12.663 3 12.9471C3 13.0877 3.02771 13.227 3.08154 13.357C3.13537 13.4869 3.21427 13.605 3.31374 13.7045L7.8046 18.1953C8.2236 18.6143 8.90045 18.6143 9.31945 18.1953L20.6863 6.82853C20.8871 6.62764 21 6.35519 21 6.0711C21 5.78701 20.8871 5.51455 20.6863 5.31367C20.4854 5.11279 20.2129 4.99993 19.9288 4.99993C19.6447 4.99993 19.3723 5.11279 19.1714 5.31367L8.55665 15.9177Z"
                    fill="currentcolor"
                    fill-opacity="0.8"
                  />
                </svg>

                <p className="text">Approved</p>
              </div>
            </Link>

            <Link
              to="/ReviewRequired"
              style={{ textDecoration: "none", color: "inherit" }}
              className={` ${
                activePage === "ReviewRequired" ? "activebg" : ""
              } `}
            >
              <div
                className={` ${
                  activePage === "ReviewRequired" ? "nav-btn active" : "nav-btn"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 17.4916V18.8659H7.93945L5.67285 21.1314L6.63965 22.0977L10.5605 18.1788L6.63965 14.2599L5.67285 15.2262L7.93945 17.4916H1ZM9.12109 12.8426L10.0664 13.8411C10.7038 13.2399 11.4235 12.7818 12.2256 12.4668C13.0277 12.1519 13.8691 11.9944 14.75 11.9944C15.3802 11.9944 15.9889 12.0767 16.5762 12.2414C17.1634 12.406 17.7113 12.635 18.2197 12.9285C18.7282 13.222 19.1901 13.5799 19.6055 14.0022C20.0208 14.4245 20.3789 14.8898 20.6797 15.398C20.9805 15.9062 21.2132 16.4537 21.3779 17.0407C21.5426 17.6276 21.625 18.236 21.625 18.8659H23C23 18.0285 22.8747 17.2089 22.624 16.4072C22.3734 15.6055 22.0117 14.8647 21.5391 14.1847C21.0664 13.5047 20.5042 12.8999 19.8525 12.3702C19.2008 11.8405 18.474 11.4361 17.6719 11.1569C18.0729 10.8993 18.431 10.6022 18.7461 10.2658C19.0612 9.92937 19.3333 9.56074 19.5625 9.1599C19.7917 8.75906 19.96 8.33675 20.0674 7.89296C20.1748 7.44917 20.2357 6.98391 20.25 6.49718C20.25 5.73845 20.1068 5.02624 19.8203 4.36056C19.5339 3.69488 19.1436 3.11152 18.6494 2.61047C18.1553 2.10942 17.5716 1.71574 16.8984 1.42943C16.2253 1.14311 15.5091 0.999954 14.75 0.999954C13.9909 0.999954 13.2783 1.14311 12.6123 1.42943C11.9463 1.71574 11.3626 2.10584 10.8613 2.59973C10.36 3.09362 9.96615 3.67699 9.67969 4.34983C9.39323 5.02266 9.25 5.73845 9.25 6.49718C9.25 7.47781 9.47559 8.36538 9.92676 9.1599C10.3779 9.95442 11.0117 10.6201 11.8281 11.1569C11.3268 11.343 10.8506 11.5793 10.3994 11.8656C9.94824 12.1519 9.52214 12.4776 9.12109 12.8426ZM18.875 6.49718C18.875 7.06981 18.7676 7.60307 18.5527 8.09696C18.3379 8.59085 18.0443 9.02748 17.6719 9.40685C17.2995 9.78621 16.8626 10.0833 16.3613 10.298C15.86 10.5127 15.3229 10.6201 14.75 10.6201C14.1842 10.6201 13.6507 10.5127 13.1494 10.298C12.6481 10.0833 12.2113 9.78979 11.8389 9.41758C11.4665 9.04537 11.1693 8.60875 10.9473 8.1077C10.7253 7.60665 10.6178 7.06981 10.625 6.49718C10.625 5.93171 10.7324 5.39845 10.9473 4.8974C11.1621 4.39635 11.4557 3.95972 11.8281 3.58752C12.2005 3.21531 12.641 2.91826 13.1494 2.69636C13.6579 2.47447 14.1914 2.3671 14.75 2.37426C15.3229 2.37426 15.8564 2.48163 16.3506 2.69636C16.8447 2.9111 17.2816 3.20457 17.6611 3.57678C18.0407 3.94899 18.3379 4.38919 18.5527 4.8974C18.7676 5.40561 18.875 5.93887 18.875 6.49718Z"
                    fill="currentcolor"
                    fill-opacity="0.8"
                  />
                </svg>

                <p className="text">Send to Manager</p>
              </div>
            </Link>
            <Link
              to="/rejected"
              style={{ textDecoration: "none", color: "inherit" }}
              className={` ${activePage === "rejected" ? "activebg" : ""} `}
            >
              <div
                className={` ${
                  activePage === "rejected" ? "nav-btn active" : "nav-btn"
                }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 18.9999L5 4.99991M19 4.99991L5 18.9999"
                    stroke="currentcolor"
                    stroke-opacity="0.8"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>

                <p className="text">Rejected</p>
              </div>
            </Link>
            </>}
          </div>
        </div>
        <div
          style={{ textDecoration: "none", color: "inherit" }}
          onClick={() => {
            setLogoutModal(true);
          }}
          className="mb-5"
        >
          <div className={`logout-btn-sidebar`}>
            <img src={Logout} alt="" className={`icon`} />
            <p className="text m-0">Logout</p>
          </div>
        </div>
      </div>

      <LogoutModal show={logoutModal} hide={() => setLogoutModal(false)} />
    </>
  );
};

export default Sidebar;

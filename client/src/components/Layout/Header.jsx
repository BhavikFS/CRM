import React, { useState } from "react";
import "../../assets/css/header.css";
import notificationIcon from "../../assets/images/Notification.svg";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import logo from "../../assets/images/CRMLogo.png";
import profile from "../../assets/images/Avatar.png";
import { Dropdown } from "react-bootstrap";
import Auth from "../../libs/auth";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activePage = location.pathname.replace("/", "");
  const CurrentUser = Auth.getCurrentUser();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleHistoryClick = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };
  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="white"
        variant="white"
        className="w-100 header-main"
      >
        <Navbar.Brand onClick={() => navigate("/")} className="cursor-pointer">
          <div className="w-100 text-center mobile-logo">
            <img src={logo} alt="docpy-logo" className="img-fluid" />
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav "
          style={{ backgroundColor: "white" }}
        >
          <Nav className="w-100">
            <div className="sidebar-main">
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

                  <Link
                    to="/"
                    style={{ textDecoration: "none", color: "inherit" }}
                    className={` ${activePage === "" ? "activebg" : ""} `}
                  >
                    <div
                      className={` ${
                        activePage === "dashboard" ||
                        activePage === "doctorList"
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
                      className={`nav-btns ${
                        isHistoryOpen ? "active activebg" : ""
                      }`}
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
                            strokeWidth="2"
                            d="M20.9999 5.81195C20.9999 6.26331 20.78 6.71025 20.3529 7.12725C19.9257 7.54425 19.2996 7.92315 18.5103 8.24231C17.721 8.56146 16.784 8.81463 15.7527 8.98736C14.7214 9.16009 13.6161 9.24899 12.4999 9.24899C10.2455 9.24899 8.08353 8.88688 6.48947 8.24231C4.89541 7.59774 3.99988 6.72351 3.99988 5.81195C3.99988 5.36059 4.21974 4.91365 4.6469 4.49665C5.07407 4.07965 5.70017 3.70075 6.48947 3.38159C7.27877 3.06244 8.2158 2.80927 9.24707 2.63654C10.2783 2.46381 11.3836 2.37491 12.4999 2.37491C13.6161 2.37491 14.7214 2.46381 15.7527 2.63654C16.784 2.80927 17.721 3.06244 18.5103 3.38159C19.2996 3.70075 19.9257 4.07965 20.3529 4.49665C20.78 4.91365 20.9999 5.36059 20.9999 5.81195Z"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            strokeWidth="2"
                            d="M20.9999 18.1853C20.9999 18.7886 20.6071 19.3813 19.8611 19.9038C19.1151 20.4263 18.042 20.8602 16.7499 21.1619C15.4577 21.4635 13.9919 21.6223 12.4999 21.6223C11.0078 21.6223 9.54204 21.4635 8.24988 21.1619C6.95771 20.8602 5.88469 20.4263 5.13866 19.9038C4.39263 19.3813 3.99988 18.7886 3.99988 18.1853"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            strokeWidth="2"
                            d="M20.9999 14.0609C20.9999 14.6642 20.6071 15.2569 19.8611 15.7794C19.1151 16.3019 18.042 16.7358 16.7499 17.0374C15.4577 17.3391 13.9919 17.4979 12.4999 17.4979C11.0078 17.4979 9.54204 17.3391 8.24988 17.0374C6.95771 16.7358 5.88469 16.3019 5.13866 15.7794C4.39263 15.2569 3.99988 14.6642 3.99988 14.0609"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            strokeWidth="2"
                            d="M20.9999 9.9364C20.9999 10.5397 20.6071 11.1324 19.8611 11.6549C19.1151 12.1774 18.042 12.6113 16.7499 12.913C15.4577 13.2146 13.9919 13.3734 12.4999 13.3734C11.0078 13.3734 9.54204 13.2146 8.24988 12.913C6.95771 12.6113 5.88469 12.1774 5.13866 11.6549C4.39263 11.1324 3.99988 10.5397 3.99988 9.9364"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            strokeWidth="2"
                            d="M3.99988 5.81197V18.1853"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            strokeWidth="2"
                            d="M21 5.81192V18.1853"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p className="text">History</p>
                        <i
                          className={`fa fa-angle-${
                            isHistoryOpen ? "up" : "down"
                          } dropdown-icon`}
                        ></i>
                      </div>
                    </div>
                    {isHistoryOpen && (
                      <div className="sub-menu">
                        <Link to="/history/item1" className="sub-item">
                          Party Data
                        </Link>
                        <Link to="/history/item2" className="sub-item">
                          Group Data
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-part">
              <div
                className="notification-block"
                style={{ cursor: "pointer" }}
                onClick={(e) => {}}
              >
                <Dropdown>
                  <Dropdown.Toggle
                    id="dropdown-profile"
                    className="notificaitondrp"
                  >
                    <img
                      src={notificationIcon}
                      alt="notification-icon"
                      width="20px"
                    />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={(e) => {
                        navigate("/doctorDetailsForm");
                      }}
                    >
                      
                      <div className="d-flex justify-content-between">
                        <div className="">
                          <span style={{fontSize:"16px",fontWeight:"500"}}>Party Name</span><br />
                          <span style={{fontSize:"13px"}}>Model Name</span>
                        </div>

                        <div class="alert alert-success p-2" role="alert">
                          Approved
                        </div>
                      </div>

                      <div className="d-flex justify-content-end">
                        <span style={{color:"#ABABAB"}}>3 Hours Ago</span>
                      </div>
                      <hr />
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={(e) => {
                        navigate("/doctorDetailsForm");
                      }}
                    >
                      
                      <div className="d-flex justify-content-between">
                        <div className="">
                          <span style={{fontSize:"16px",fontWeight:"500"}}>Party Name</span><br />
                          <span style={{fontSize:"13px"}}>Model Name</span>
                        </div>

                        <div class="alert alert-danger p-2" role="alert">
                          Rejected
                        </div>
                      </div>

                      <div className="d-flex justify-content-end">
                        <span style={{color:"#ABABAB"}}>3 Hours Ago</span>
                      </div>
                      <hr />
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={(e) => {
                        navigate("/doctorDetailsForm");
                      }}
                    >
                      
                      <div className="d-flex justify-content-between">
                        <div className="">
                          <span style={{fontSize:"16px",fontWeight:"500"}}>Party Name</span><br />
                          <span style={{fontSize:"13px"}}>Model Name</span>
                        </div>

                        <div class="alert alert-warning p-2" role="alert">
                          Pending
                        </div>
                      </div>

                      <div className="d-flex justify-content-end">
                        <span style={{color:"#ABABAB"}}>3 Hours Ago</span>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                {/* <div className="noti-no">
                  99
                </div> */}
              </div>
              <div className="profile">
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img
                    src={profile}
                    style={{ borderRadius: "55%" }}
                    height={"40px"}
                    width={"40px"}
                    alt="User Profile"
                  />
                </div>
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-profile" className="btn-custom">
                    <span className="font-weight-bold">
                      {CurrentUser?.username}
                    </span>
                    <br />
                    <span className="text-secondary">{CurrentUser?.email}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={(e) => {
                        navigate("/doctorDetailsForm");
                      }}
                    >
                      Account
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={(e) => {
                        navigate("/allPatient");
                      }}
                    >
                      Patients{" "}
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={(e) => {
                        e.preventDefault();
                        Auth.logout();
                        navigate("/login");
                      }}
                    >
                      Logout{" "}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

export default Header;

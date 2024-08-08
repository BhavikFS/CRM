import React from "react";
import "../../assets/css/header.css";
import notificationIcon from "../../assets/images/Notification.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import logo from "../../assets/images/CRMLogo.png";
import profile from "../../assets/images/Avatar.png";
import { Dropdown } from "react-bootstrap";
import Auth from "../../libs/auth";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activePage = location.pathname.replace("/", "");
  const CurrentUser = Auth.getCurrentUser()

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
            <img src={logo} alt="docpy-logo" width={180} height={50} />
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          id="responsive-navbar-nav "
          style={{ backgroundColor: "white" }}
        >
          <Nav className="w-100">

            <div className="profile-part">
              <div
                className="notification-block"
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                }}
              >
                <img
                  src={notificationIcon}
                  alt="notification-icon"
                  width="20px"
                />
                {/* <div className="noti-no">
                  99
                </div> */}
              </div>

              <div className="profile">
                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
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
                  <span className="font-weight-bold">{CurrentUser?.username}</span>               
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

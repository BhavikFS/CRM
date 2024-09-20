import { useNavigate } from "react-router-dom";
import AdminProfileIcon from "./assets/Admin.png";

function SideBar(props) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    navigate("/login"); // Redirect to the login page
  };
  return (
    <>
      <div className="page-wrapper chiller-theme toggled">
        <a id="show-sidebar" className="btn btn-sm btn-dark" href="#">
          <i className="fas fa-bars"></i>
        </a>
        <nav id="sidebar" className="sidebar-wrapper">
          <div className="sidebar-content">
            <div className="sidebar-brand">
              <a href="#">Admin Panel</a>
            </div>
            <div className="sidebar-header">
              <div className="user-pic">
                <img
                  className="img-responsive img-rounded"
                  src={AdminProfileIcon}
                  alt="User picture"
                />
              </div>
              <div className="user-info">
                <span className="user-name">
                  <strong>CRM-Admin</strong>
                </span>
                <span className="user-role">Administrator</span>
                <span className="user-status">
                  <i className="fa fa-circle"></i>
                  <span>Online</span>
                </span>
              </div>
            </div>
            <div className="sidebar-menu">
              <ul>
                <li className="header-menu">
                  <span>Extra</span>
                </li>
                <li onClick={() => navigate("/maintain")}>
                  <a href="#">
                    <i className="fa fa-folder"></i>
                    <span>Maintenance Mode</span>
                  </a>
                </li>
                <li onClick={() => navigate("/party")}>
                  <a href="#">
                    <i className="fa fa-book"></i>
                    <span>Party</span>
                  </a>
                </li>
                <li onClick={() => navigate("/subparty")}>
                  <a href="#">
                    <i className="fa fa-calendar"></i>
                    <span>SubParty</span>
                  </a>
                </li>
                <li onClick={() => navigate("/sales")}>
                  <a href="#">
                    <i className="fa fa-folder"></i>
                    <span>Sales</span>
                  </a>
                </li>
                <li onClick={() => navigate("/stock")}> 
                  <a href="#">
                    <i className="fa fa-folder"></i>
                    <span>Stock</span>
                  </a>
                </li>
                <li onClick={() => navigate("/payment")}>
                  <a href="#">
                    <i className="fa fa-folder"></i>
                    <span>Payment</span>
                  </a>
                </li>
                <li onClick={() => navigate("/purchase")}>
                  <a href="#">
                    <i className="fa fa-folder"></i>
                    <span>Purchase</span>
                  </a>
                </li>
                <li onClick={handleLogout}>
              <a href="#">
                <i className="fa fa-folder"></i>
                <span>Logout</span>
              </a>
            </li>
              </ul>
            </div>
          </div>
        </nav>
        <main className="page-content">{props.children}</main>
      </div>
    </>
  );
}

export default SideBar;

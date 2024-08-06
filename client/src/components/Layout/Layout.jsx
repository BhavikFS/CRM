import Header from "./Header";
import Sidebar from "./Sidebar";
import "../../assets/css/layout.css"
function Layout(props) {
  return (
    <>
      <div className="layout-main">
        <div className="sider">
          <Sidebar />
        </div>
        <div className="content-part" style={{ position: "relative" }}>
          <div className="header-part">
            <Header/>
          </div>
          <div className="content">
            {props.children}
          </div>
        </div>
      </div>
    </>
  );
}

export default Layout;

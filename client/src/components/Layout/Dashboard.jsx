import { useNavigate } from "react-router-dom";
import DataTableComponent from "../pages/DataTableComponent";
import Layout from "./Layout";

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="d-flex justify-content-between p-3">
        <h1>DashBoard</h1>
        <div className="btn-wrapper" style={{ display: "inline-block" }}>
          <button
            className="btn btn-primary addBtn"
            onClick={(e) => {
              e.preventDefault();
              navigate("/addItem");
            }}
          >
            + Add Item
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

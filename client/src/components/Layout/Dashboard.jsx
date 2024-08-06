import DataTableComponent from "../pages/DataTableComponent";
import Layout from "./Layout";

const Dashboard = () => {
  return <Layout>
    <h1>DashBoard</h1>
    <div className="container px-5">
    <DataTableComponent />
    </div>
  </Layout>;
};

export default Dashboard
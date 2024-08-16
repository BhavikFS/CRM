import { Dropdown, Form } from "react-bootstrap";
import Layout from "../../Layout/Layout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";

const GroupData = () => {
    const [customers, setCustomers] = useState([
        {
          id: 1,
          name: "James Butt",
          date: "20/04/2024",
          subParty: "Name",
          listPrice: "$10,000",
          discount: "20%",
          netPrice: "$10,000",
          reqPrice: "$10,000",
          reqDiscount: "$10,000",
          qty: "10kg",
          reasons: "4",
          stockQTY: "10",
          status: "rejected",
          action: "true",
        },
        {
          id: 2,
          name: "James Butt",
          date: "20/04/2024",
          subParty: "Name",
          listPrice: "$10,000",
          discount: "20%",
          netPrice: "$10,000",
          reqPrice: "$10,000",
          reqDiscount: "$10,000",
          qty: "10kg",
          reasons: "4",
          stockQTY: "10",
          status: "approved",
          action: "true",
        },
        {
          id: 3,
          name: "James Butt",
          date: "20/04/2024",
          subParty: "Name",
          listPrice: "$10,000",
          discount: "20%",
          netPrice: "$10,000",
          reqPrice: "$10,000",
          reqDiscount: "$10,000",
          qty: "10kg",
          reasons: "4",
          stockQTY: "10",
          status: "approved",
          action: "true",
        },
        {
          id: 4,
          name: "James Butt",
          date: "20/04/2024",
          subParty: "Name",
          listPrice: "$10,000",
          discount: "20%",
          netPrice: "$10,000",
          reqPrice: "$10,000",
          reqDiscount: "$10,000",
          qty: "10kg",
          reasons: "4",
          stockQTY: "10",
          status: "pending",
          action: "true",
        },  {
          id: 5,
          name: "James Butt",
          date: "20/04/2024",
          subParty: "Name",
          listPrice: "$10,000",
          discount: "20%",
          netPrice: "$10,000",
          reqPrice: "$10,000",
          reqDiscount: "$10,000",
          qty: "10kg",
          reasons: "4",
          stockQTY: "10",
          status: "revision",
          action: "true",
        },
        // ... other data
      ]);
  return (
    <Layout>
      <div className="p-2 p-md-5 p-sm-3">
        <div className="row mb-3">
          <h1 className="mb-0 col-lg-6" style={{ textAlign: "left" }}>
            Party Data
          </h1>
          <div className="btn-wrapper col-lg-6">
            <div className="form align-items-center d-flex">
              <i className="fa fa-search" style={{ top: "13px" }}></i>
              <input
                type="text"
                className="form-control form-input"
                style={{ fontSize: "0.75rem", height: "40px" }}
                placeholder="Search by Name or Type .... "
              />
            </div>
          </div>
        </div>

        <div className="card">
          <DataTable
            value={customers}
            tableStyle={{ minWidth: "50rem" }}
            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink "
          >
            <Column field="id" header="" style={{ width: "20%" }}></Column>
            <Column
              field="name"
              header="Party Name"
              style={{ width: "20%" }}
            ></Column>
            <Column
              field="name"
              header="Party Type"
              style={{ width: "20%" }}
            ></Column>
            <Column
              field="subParty"
              header="Party Flage"
              style={{ width: "20%" }}
            ></Column>
            <Column
              field="listPrice"
              header="Sales QTY."
              style={{ width: "20%" }}
            ></Column>
            <Column
              field="discount"
              header="Sales Amount"
              style={{ width: "10%" }}
            ></Column>
          </DataTable>
        </div>

        <div className="row">
          <div className="col-md-12 col-lg-6 col-sm-12">
            <div className="footerPagination">
              Show :&nbsp; | &nbsp;
              <Dropdown>
                <Dropdown.Toggle id="dropdown-profile" className="btn-custom">
                  <span className="font-weight-bold">1-10</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>10-20</Dropdown.Item>
                  <Dropdown.Item>20-30</Dropdown.Item>
                  <Dropdown.Item>30-40</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              &nbsp; | &nbsp; per pages &nbsp;| &nbsp; 1-25 of 1000
            </div>
          </div>
          <div className="col-md-12 col-lg-6 col-sm-12 d-flex justify-content-end">
            <nav data-pagination>
              <a disabled>prev</a>
              <ul>
                <li class="current">
                  <a>1</a>
                </li>
                <li>
                  <a>2</a>{" "}
                </li>
                <li>
                  <a>3</a>
                </li>
                <li>
                  <a>…</a>
                </li>
                <li>
                  <a>10</a>
                </li>
              </ul>
              <a>next</a>
            </nav>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GroupData;

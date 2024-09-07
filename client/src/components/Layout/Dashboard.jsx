import { useNavigate } from "react-router-dom";
import DataTableComponent from "../pages/DataTableComponent";
import Layout from "./Layout";
import { Dropdown, Form } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { Column } from "primereact/column";
import { get } from "../../libs/http-hydrate";
import { getAuthConfig } from "../../libs/http-hydrate";
import moment from "moment";

const Dashboard = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await get("/api/request/requests-list", {
          params: {
            page,
            limit,
            sortBy,
            search,
          },
          ...getAuthConfig(),
        });

        setCustomers(response.data.requests);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, limit, sortBy, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleLimitChange = (e) => {
    setLimit(e.target.value);
  };
  const statusBodyTemplate = (rowData) => {
    return rowData.status === "approved" ? (
      <div
        className="alert alert-success d-flex align-items-center"
        role="alert"
      >
        <span
          style={{
            height: "10px",
            width: "10px",
            backgroundColor: "#28a745",
            borderRadius: "50%",
            display: "inline-block",
            marginRight: "8px",
          }}
        ></span>
        Completed
      </div>
    ) : rowData.status === "ReviewRequired" ? (
      <div
        className="alert alert-dark d-flex align-items-center"
        role="alert"
        style={{ whiteSpace: "nowrap" }}
      >
        <span
          style={{
            height: "10px",
            width: "10px",
            backgroundColor: "black",
            borderRadius: "50%",
            display: "inline-block",
            marginRight: "8px",
          }}
        ></span>
        Revision required
      </div>
    ) : rowData.status === "pending" ? (
      <div
        className="alert alert-warning d-flex align-items-center"
        role="alert"
        style={{ whiteSpace: "nowrap" }}
      >
        <span
          style={{
            height: "10px",
            width: "10px",
            backgroundColor: "#FFA500",
            borderRadius: "50%",
            display: "inline-block",
            marginRight: "8px",
          }}
        ></span>
        Pending
      </div>
    ) : (
      <div
        className="alert alert-danger d-flex align-items-center"
        role="alert"
      >
        <span
          style={{
            height: "10px",
            width: "10px",
            backgroundColor: "#dc3545",
            borderRadius: "50%",
            display: "inline-block",
            marginRight: "8px",
          }}
        ></span>
        Rejected
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        {/* // <span onClick={() => handleShowModal(rowData)}>
      //   <i className="fas fa-eye"></i>
      // </span> */}
        {rowData?.status === "revision" ? (
          <svg
            width="18"
            height="21"
            viewBox="0 0 18 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.8 0.300003V5.7C10.8 6.17739 10.9896 6.63523 11.3272 6.9728C11.6648 7.31036 12.1226 7.5 12.6 7.5H18V17.7C18 18.1774 17.8104 18.6352 17.4728 18.9728C17.1352 19.3104 16.6774 19.5 16.2 19.5H10.4916C11.3878 18.4147 11.9136 17.0712 11.9922 15.6659C12.0708 14.2605 11.698 12.8669 10.9283 11.6884C10.1586 10.51 9.03233 9.60842 7.71392 9.11548C6.39551 8.62253 4.95404 8.56399 3.6 8.9484V2.1C3.6 1.62261 3.78964 1.16478 4.12721 0.827211C4.46477 0.489645 4.92261 0.300003 5.4 0.300003H10.8ZM12 0.600003V5.7C12 5.85913 12.0632 6.01174 12.1757 6.12427C12.2883 6.23679 12.4409 6.3 12.6 6.3H17.7L12 0.600003ZM10.8 15.3C10.8 16.7322 10.2311 18.1057 9.21838 19.1184C8.20568 20.1311 6.83217 20.7 5.4 20.7C3.96783 20.7 2.59432 20.1311 1.58162 19.1184C0.568927 18.1057 0 16.7322 0 15.3C0 13.8678 0.568927 12.4943 1.58162 11.4816C2.59432 10.4689 3.96783 9.9 5.4 9.9C6.83217 9.9 8.20568 10.4689 9.21838 11.4816C10.2311 12.4943 10.8 13.8678 10.8 15.3ZM2.5764 14.8752L2.5728 14.8788C2.46297 14.9902 2.40097 15.14 2.4 15.2964V15.3036C2.40098 15.4612 2.46391 15.612 2.5752 15.7236L4.9752 18.1236C5.03091 18.1794 5.09706 18.2237 5.16987 18.2539C5.24268 18.2841 5.32074 18.2997 5.39958 18.2997C5.47841 18.2998 5.55649 18.2843 5.62935 18.2542C5.7022 18.2241 5.76841 18.1799 5.8242 18.1242C5.87999 18.0685 5.92425 18.0023 5.95447 17.9295C5.98469 17.8567 6.00028 17.7787 6.00033 17.6998C6.00039 17.621 5.98492 17.5429 5.9548 17.4701C5.92468 17.3972 5.88051 17.331 5.8248 17.2752L4.4484 15.9H7.8C7.95913 15.9 8.11174 15.8368 8.22426 15.7243C8.33679 15.6117 8.4 15.4591 8.4 15.3C8.4 15.1409 8.33679 14.9883 8.22426 14.8757C8.11174 14.7632 7.95913 14.7 7.8 14.7H4.4484L5.8248 13.3248C5.93746 13.2121 6.00076 13.0593 6.00076 12.9C6.00076 12.7407 5.93746 12.5879 5.8248 12.4752C5.71214 12.3625 5.55933 12.2992 5.4 12.2992C5.24067 12.2992 5.08786 12.3625 4.9752 12.4752L2.5764 14.8752Z"
              fill="#010101"
              fill-opacity="0.8"
            />
          </svg>
        ) : rowData?.status === "pending" ? (
          <span onClick={() => handleShowModal(rowData)}>
            <i className="fas fa-eye"></i>
          </span>
        ) : (
          <svg
            width="18"
            height="21"
            viewBox="0 0 18 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.8 0.300003V5.7C10.8 6.17739 10.9896 6.63523 11.3272 6.9728C11.6648 7.31036 12.1226 7.5 12.6 7.5H18V17.7C18 18.1774 17.8104 18.6352 17.4728 18.9728C17.1352 19.3104 16.6774 19.5 16.2 19.5H10.4916C11.3878 18.4147 11.9136 17.0712 11.9922 15.6659C12.0708 14.2605 11.698 12.8669 10.9283 11.6884C10.1586 10.51 9.03233 9.60842 7.71392 9.11548C6.39551 8.62253 4.95404 8.56399 3.6 8.9484V2.1C3.6 1.62261 3.78964 1.16478 4.12721 0.827211C4.46477 0.489645 4.92261 0.300003 5.4 0.300003H10.8ZM12 0.600003V5.7C12 5.85913 12.0632 6.01174 12.1757 6.12427C12.2883 6.23679 12.4409 6.3 12.6 6.3H17.7L12 0.600003ZM5.4 20.7C6.83217 20.7 8.20568 20.1311 9.21838 19.1184C10.2311 18.1057 10.8 16.7322 10.8 15.3C10.8 13.8678 10.2311 12.4943 9.21838 11.4816C8.20568 10.4689 6.83217 9.9 5.4 9.9C3.96783 9.9 2.59432 10.4689 1.58162 11.4816C0.568927 12.4943 0 13.8678 0 15.3C0 16.7322 0.568927 18.1057 1.58162 19.1184C2.59432 20.1311 3.96783 20.7 5.4 20.7ZM5.8248 18.1248C5.71214 18.2375 5.55933 18.3008 5.4 18.3008C5.24067 18.3008 5.08786 18.2375 4.9752 18.1248C4.86254 18.0121 4.79924 17.8593 4.79924 17.7C4.79924 17.5407 4.86254 17.3879 4.9752 17.2752L6.3516 15.9H3C2.84087 15.9 2.68826 15.8368 2.57574 15.7243C2.46321 15.6117 2.4 15.4591 2.4 15.3C2.4 15.1409 2.46321 14.9883 2.57574 14.8757C2.68826 14.7632 2.84087 14.7 3 14.7H6.3516L4.9752 13.3248C4.86254 13.2121 4.79924 13.0593 4.79924 12.9C4.79924 12.7407 4.86254 12.5879 4.9752 12.4752C5.08786 12.3625 5.24067 12.2992 5.4 12.2992C5.55933 12.2992 5.71214 12.3625 5.8248 12.4752L8.2248 14.8752C8.33638 14.9871 8.39933 15.1384 8.4 15.2964V15.3036C8.39903 15.46 8.33703 15.6098 8.2272 15.7212L8.2236 15.7248L5.8248 18.1248Z"
              fill="#025FE0"
            />
          </svg>
        )}
      </>
    );
  };

  return (
    <Layout>
      <div className="p-2 p-md-5 p-sm-3">
        <div className="d-flex justify-content-between">
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

        <div className="row mb-3">
          <h1 className="mb-0 col-md-5" style={{ textAlign: "left" }}></h1>
          <div className="btn-wrapper col-lg-3">
            <div className="form align-items-center d-flex">
              <i className="fa fa-search" style={{ top: "13px" }}></i>
              <input
                type="text"
                className="form-control form-input"
                style={{ fontSize: "0.75rem", height: "40px" }}
                placeholder="Search by Name .... "
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="col-lg-2 d-flex align-items-center border-left-lg">
            <label style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>
              {" "}
              Sort by : &nbsp;{" "}
            </label>
            <Form.Control
              as="select"
              style={{ fontSize: "0.75rem", height: "40px" }}
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="newest">↑ Newest</option>
              <option value="oldest">↓ Oldest</option>
            </Form.Control>
          </div>
          <div className="col-lg-2 d-flex align-items-center border-left-lg">
            <label style={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}>
              {" "}
              Filter by : &nbsp;
            </label>
            <Form.Control
              as="select"
              style={{ fontSize: "0.75rem", height: "40px" }}
            >
              <option value="">Select Filter</option>
              <option value="Saathi UIUX Design Company 1">
                Saathi UIUX Design Company 1
              </option>
              <option value="Saathi UIUX Design Company 2">
                Saathi UIUX Design Company 2
              </option>
              <option value="Saathi UIUX Design Company 3">
                Saathi UIUX Design Company 3
              </option>
              <option value="Saathi UIUX Design Company 4">
                Saathi UIUX Design Company 4
              </option>
            </Form.Control>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">Error: {error}</p>
        ) : (
          <div className="card">
            <DataTable
              value={customers}
              rows={limit}
              totalRecords={totalPages * limit}
              tableStyle={{ minWidth: "50rem" }}
            >
              <Column
                field="id"
                header="ID"
                style={{ width: "10%" }}
                body={(rowData, { rowIndex }) => {
                  return (page - 1) * limit + rowIndex + 1;
                }}
              ></Column>
              <Column
                field="name"
                header="Name"
                style={{ width: "15%" }}
                body={(rowData) => rowData?.party?.name}
              ></Column>
              <Column
                field="date"
                header="Date"
                style={{ width: "15%" }}
                body={(rowData) =>
                  moment(rowData?.createdAt).format("DD - MM - YYYY")
                }
              />
              <Column
                field="subParty"
                header="Sub Party"
                style={{ width: "15%" }}
                body={(rowData) => rowData?.subParty?.name}
              ></Column>
              <Column
                field="listPrice"
                header="List Price"
                style={{ width: "10%" }}
                body={(rowData) => rowData?.subParty?.name}
              ></Column>
              <Column
                field="status"
                header="Status"
                body={statusBodyTemplate}
                style={{ width: "15%" }}
              ></Column>
              <Column
                field="action"
                header="Action"
                body={actionBodyTemplate}
                style={{ width: "20%" }}
              ></Column>
            </DataTable>
          </div>
        )}

        <div className="row">
          <div className="col-md-12 col-lg-6 col-sm-12">
            <div className="footerPagination">
              Show :&nbsp; | &nbsp;
              <Dropdown>
                <Dropdown.Toggle id="dropdown-profile" className="btn-custom">
                  <span className="font-weight-bold">1-{limit}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setLimit(10)}>
                    1-10
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setLimit(20)}>
                    1-20
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setLimit(30)}>
                    1-30
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              &nbsp; | &nbsp; per pages &nbsp;| &nbsp; {(page - 1) * limit + 1}-
              {Math.min(page * limit, totalPages * limit)} of{" "}
              {totalPages * limit}
            </div>
          </div>

          <div className="col-md-12 col-lg-6 col-sm-12 d-flex justify-content-end">
            <nav data-pagination>
              <a disabled={page === 1} onClick={() => setPage(page - 1)}>
                prev
              </a>
              <ul className="pagination">
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i}
                    className={`${i + 1 === page ? "current" : ""}`}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </li>
                ))}
              </ul>
              <a
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                next
              </a>
            </nav>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

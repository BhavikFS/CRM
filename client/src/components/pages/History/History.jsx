import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Modal, Form, Row, Col, Card, Dropdown } from "react-bootstrap";
import Layout from "../../Layout/Layout";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "../../../assets/css/History.css";
import CheckSalesModal from "../CheckSalesModal";
import UserCard from "../UserCard";
import profile from "../../../assets/images/Avatar.png";

export default function History() {
  const [checkSalesModal, setCheckSalesModal] = useState(false);
  const users = [
    { id: 1, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 2, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 3, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 4, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 5, name: "Saathi G.", email: "abc@gmail.com" },
  ];
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
    // ... other data
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleShowModal = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
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
      <span onClick={() => handleShowModal(rowData)}>
        <i className="fas fa-eye"></i>
      </span>
    );
  };

  return (
    <Layout>
      <div className="p-2 p-md-5 p-sm-3 history">
        <div className="d-flex justify-content-between align-items-center mb-3 w-100">
          <h1 className="mb-0 w-25" style={{ textAlign: "left" }}>
            History
          </h1>
          <div className="btn-wrapper w-50" style={{ display: "inline-block" }}>
            <div className="form align-items-center d-flex">
              <i className="fa fa-search" style={{ top: "13px" }}></i>
              <input
                type="text"
                className="form-control form-input"
                style={{ fontSize: "0.75rem", height: "40px" }}
                placeholder="Search Name or Type .... "
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
              header="Name"
              style={{ width: "20%" }}
            ></Column>
            <Column
              field="date"
              header="Date"
              style={{ width: "20%" }}
            ></Column>
            <Column
              field="subParty"
              header="Sub Party"
              style={{ width: "20%" }}
            ></Column>
            <Column
              field="listPrice"
              header="List Price"
              style={{ width: "20%" }}
            ></Column>
            <Column
              field="discount"
              header="Discount"
              style={{ width: "10%" }}
            ></Column>
            <Column
              field="netPrice"
              header="Net Price"
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="reqPrice"
              header="Req Price"
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="reqDiscount"
              header="Req Discount"
              style={{ width: "25%" }}
            ></Column>
            <Column field="qty" header="Qty" style={{ width: "25%" }}></Column>
            <Column
              field="reasons"
              header="Reasons"
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="stockQTY"
              header="Stock QTY"
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="status"
              header="Status"
              body={statusBodyTemplate}
              style={{ width: "25%" }}
            ></Column>
            <Column
              field="action"
              header=""
              body={actionBodyTemplate}
              style={{ width: "25%" }}
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
                    <Dropdown.Item
                    >
                      10-20
                    </Dropdown.Item>
                    <Dropdown.Item
                    >
                     20-30
                    </Dropdown.Item>
                    <Dropdown.Item
                    >
                     30-40
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>


                &nbsp; | &nbsp; per pages &nbsp;| &nbsp; 1-25 of 1000
                </div>
  </div>
        <div className="col-md-12 col-lg-6 col-sm-12 d-flex justify-content-end">
              <nav data-pagination>
                <a disabled>Prev</a>
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
                <a>Next</a>
              </nav>
            </div>

            </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        size="lg"
        className="ModalInformation" 
        dialogClassName="viewmodal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Model Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3">
            <Form.Group as={Col} xs={12} md={4} controlId="formModelName">
              <Form.Label>Model Name</Form.Label>
              <Form.Control as="select" disabled>
                <option value="">Select Model</option>
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
            </Form.Group>

            <Form.Group as={Col} xs={12} md={4} controlId="formSubParty">
              <Form.Label>Sub-Party</Form.Label>
              <Form.Control
                type="text"
                placeholder="Saathi UIUX Design Company"
                disabled
              />
            </Form.Group>

            <Form.Group
              as={Col}
              xs={12}
              md={4}
              controlId="formListPrice"
              disabled
            >
              <Form.Label>List Price (₹)</Form.Label>
              <Form.Control type="text" placeholder="10,100" disabled />
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} xs={12} md={4} controlId="formDiscount">
              <Form.Label>Discount (%)</Form.Label>
              <Form.Control type="text" placeholder="10%" disabled />
            </Form.Group>

            <Form.Group as={Col} xs={12} md={4} controlId="formNetPrice">
              <Form.Label>Net Price (₹)</Form.Label>
              <Form.Control type="text" placeholder="15,000" disabled />
            </Form.Group>

            <Form.Group as={Col} xs={12} md={4} controlId="formRequestPrice">
              <Form.Label>Request Price (₹)</Form.Label>
              <Form.Control type="text" placeholder="15,000" disabled />
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} xs={12} md={4} controlId="formRequestDiscount">
              <Form.Label>Request Discount (₹)</Form.Label>
              <Form.Control type="text" placeholder="20,200" disabled />
            </Form.Group>

            <Form.Group as={Col} xs={12} md={4} controlId="formQuantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="text" placeholder="20,200" disabled />
            </Form.Group>

            <Form.Group as={Col} xs={12} md={4} controlId="formStockQuantity">
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control type="text" placeholder="20,200" disabled />
            </Form.Group>
          </Row>

          <Row className="mb-3 align-items-center">
            <Form.Group as={Col} xs={12} md={10} controlId="formReasons">
              <Form.Label>Reasons</Form.Label>
              <Form.Control as="select">
                <option>Select Reasons</option>
                <option>Reason 1</option>
                <option>Reason 2</option>
                <option>Reason 3</option>
              </Form.Control>
            </Form.Group>

            <Col className="d-flex justify-content-end  mt-4" xs={12} md={2}>
              <div className="btn-wrapper" style={{ display: "inline-block" }}>
                <button
                  className="btn btn-outline-primary addBtn"
                  style={{ whiteSpace: "nowrap" }}
                  onClick={(e) => {
                    e.preventDefault();
                    setCheckSalesModal(true);
                  }}
                >
                  Check Sales
                </button>
              </div>
            </Col>
          </Row>

          <Row className="mt-1 gap-2 mb-5">
            <Col>
              <Card className="p-3">
                <Row className="my-2">
                  <Col className="d-flex justify-content-between align-items-center ">
                    <h6>Pricing Coordinator</h6>
                  </Col>
                </Row>

                <Card
                  className=""
                  style={{ backgroundColor: "#01010108", border: "none" }}
                >
                  <div className="d-flex flex-row align-items-center mb-3">
                    <Card.Img
                      variant="left"
                      src={profile}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginLeft: "5px",
                      }}
                    />
                    <Card.Body className="d-flex flex-column align-items-start">
                      <span className="mb-0 nameUser">Sathi G.</span>
                      <span className="mb-0 nameUserSub">sathi@gmail.com</span>
                    </Card.Body>
                  </div>
                  <Card.Footer
                    className="bg-transparent"
                    style={{ borderTop: "#e9e9e9e 1px solid " }}
                  >
                    <button className="btnreason">Reason</button>{" "}
                    <button className="btnreason">Reason</button>
                  </Card.Footer>
                </Card>
              </Card>
            </Col>

            <Col>
              <Card className="p-3">
                <Row className="my-2">
                  <Col className="d-flex justify-content-between align-items-center ">
                    <h6>Compliance Officer</h6>
                  </Col>
                </Row>

                <Card
                  className=""
                  style={{ backgroundColor: "#01010108", border: "none" }}
                >
                  <div className="d-flex flex-row align-items-center mb-3">
                    <Card.Img
                      variant="left"
                      src={profile}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        marginLeft: "5px",
                      }}
                    />
                    <Card.Body className="d-flex flex-column align-items-start">
                      <span className="mb-0 nameUser">Sathi G.</span>
                      <span className="mb-0 nameUserSub">sathi@gmail.com</span>
                    </Card.Body>
                  </div>
                  <Card.Footer
                    className="bg-transparent"
                    style={{ borderTop: "#e9e9e9 1px solid " }}
                  >
                    <button className="btnreason">Reason</button>{" "}
                    <button className="btnreason">Reason</button>
                  </Card.Footer>
                </Card>
              </Card>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <CheckSalesModal
        show={checkSalesModal}
        onHide={() => setCheckSalesModal(false)}
      />
    </Layout>
  );
}

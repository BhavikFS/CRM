import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  Form,
} from "react-bootstrap";
import "../../../assets/css/stage.css";
import Layout from "../../Layout/Layout";
const Stage3 = () => {
  return (
    <Layout>
      <div className="p-2 p-md-5 p-sm-3 stage3">
        <div className="row mb-3">
          <h1 className="mb-0 col-md-5" style={{ textAlign: "left" }}>
            Stage_3_A
          </h1>
          <div className="btn-wrapper col-lg-3">
            <div className="form align-items-center d-flex">
              <i className="fa fa-search" style={{ top: "13px" }}></i>
              <input
                type="text"
                className="form-control form-input"
                style={{ fontSize: "0.75rem", height: "40px" }}
                placeholder="Search by Name .... "
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
            >
              <option value=""> ↑ Newest </option>
              <option value=""> ↓ Oldest </option>
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
        <div className="credit-card-container">
          <Card className="credit-card">
            <div className="credit-card-header">
              <h5>Saathi UIUX Design Company</h5> &nbsp;| &nbsp;
              <p>Designer</p>
            </div>
            <div className="credit-card-body row">
              <div className="col-md-12 col-lg-6 col-sm-12">
              <div className="credit-card-details ">
                <Row>
                  <Col lg="2" md="6" sm="12" xs="12">
                    <p>
                      <span className="nameUser">City </span> <br />{" "}
                      <span className="nameUserSub">Ahmed...</span>
                    </p>{" "}
                  </Col>
                  <Col lg="2" md="6" sm="12" xs="12">
                    {" "}
                    <p>
                      <span className="nameUser">Credit Days</span> <br />{" "}
                      <span className="nameUserSub"> 15</span>{" "}
                    </p>{" "}
                  </Col>
                  <Col lg="3" md="6" sm="12" xs="12">
                    {" "}
                    <p>
                      <span className="nameUser">Credit Limit</span> <br />{" "}
                      <span className="nameUserSub"> 15,000 </span>{" "}
                    </p>{" "}
                  </Col>
                  <Col lg="2" md="6" sm="12" xs="12">
                    {" "}
                    <p>
                      <span className="nameUser"> Total Debit </span> <br />{" "}
                      <span className="nameUserSub"> 15,000 </span>
                    </p>{" "}
                  </Col>
                  <Col lg="3" md="6" sm="12" xs="12">
                    {" "}
                    <p>
                      <span className="nameUser">Total Credit </span>
                      <br /> <span className="nameUserSub"> 20,200 </span>
                    </p>{" "}
                  </Col>
                </Row>
                <Row>
                  <Col lg="2" md="6" sm="12" xs="12">
                    <p>
                      <span className="nameUser">Total Overdue </span> <br />
                      <span className="nameUserSub"> 12,020 </span>
                    </p>{" "}
                  </Col>
                  <Col lg="2" md="6" sm="12" xs="12">
                    {" "}
                    <p>
                      {" "}
                      <span className="nameUser">Lock Party</span> <br />{" "}
                      <span className="text-danger">Yes</span>
                    </p>{" "}
                  </Col>
                  <Col lg="3" md="6" sm="12" xs="12">
                    {" "}
                    <p>
                      <span className="nameUser">Days</span> <br />
                      <span className="nameUserSub"> 12,020 </span>
                    </p>{" "}
                  </Col>
                  <Col lg="2" md="6" sm="12" xs="12">
                    {" "}
                    <p>
                      <span className="nameUser">Reason User </span> <br />{" "}
                      <span className="nameUserSub">16 </span>
                    </p>
                  </Col>
                </Row>
              </div></div>
              <div className="col-md-12 col-lg-4 col-sm-12">
              <div className="credit-card-status ">
                <Card>
                  <Card.Header className="bg-white">
                    <h6>
                      <i className="fa fa-info-circle"></i> Details
                    </h6>{" "}
                  </Card.Header>
                  <Card.Body className="p-1">
                    <Row className="g-1">
                      <Col md="6" lg="6" sm="12">
                        <div className="COPO">
                          <h6 className="d-flex justify-content-between">
                            {" "}
                            <span className="prmclor">CO </span>{" "}
                            <Badge bg="danger">Review Required</Badge>
                          </h6>
                          <button className="btnreason Satgebtnreason">
                            Reasons
                          </button>
                          <button className="btnreason Satgebtnreason">
                            Reasons
                          </button>
                          <button className="btnreason Satgebtnreason">
                            Reasons
                          </button>
                        </div>
                      </Col>
                      <Col md="6" lg="6" sm="12">
                        <div className="COPO">
                          <h6 className="d-flex justify-content-between">
                            <span className="prmclor">PC </span>
                            <Badge bg="success">Approved</Badge>
                          </h6>
                          <button className="btnreason Satgebtnreason ">
                            Reasons
                          </button>
                          <button className="btnreason Satgebtnreason">
                            Reasons
                          </button>
                          <button className="btnreason Satgebtnreason">
                            Reasons
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div></div>
              <div className="col-md-12 col-lg-2 col-sm-12">
              <div className="credit-card-actions ">
                <button className="w-100 btn btn-primary">✓</button>
                <button className="w-100 btn btn-secondary">✕</button>
              </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Stage3;

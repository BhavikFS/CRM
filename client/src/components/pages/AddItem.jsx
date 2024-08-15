import React, { useState } from "react";
import { Container,Card, Form, Row, Col, Button } from "react-bootstrap";
import Layout from "../Layout/Layout";
import "../../assets/css/AddItem.css";
import UserCard from "./UserCard";
import CheckSalesModal from "./CheckSalesModal";
import DataTableComponent from "./DataTableComponent";
import SelectUserModal from "./SelectUserModal";

function AddItem() {
  const [partyName, setPartyName] = useState("");
  const [modelName, setModelName] = useState("");
  const [checkSalesModal,setCheckSalesModal] = useState(false)
  const [selectUserModal,setSelectUserModal] = useState(false)

  const users = [
    { id: 1, name: 'Saathi G.', email: 'abc@gmail.com' },
    { id: 2, name: 'Saathi G.', email: 'abc@gmail.com' },
    { id: 3, name: 'Saathi G.', email: 'abc@gmail.com' },
    { id: 4, name: 'Saathi G.', email: 'abc@gmail.com' },
    { id: 5, name: 'Saathi G.', email: 'abc@gmail.com' }
  ];
  const handlePartyNameChange = (event) => {
    setPartyName(event.target.value);
  };

  const handleModelNameChange = (event) => {
    setModelName(event.target.value);
  };
  
  const PricingCoordinator = () => {
    const handleRemove = (id) => {
      console.log(`Remove user with id: ${id}`);
    };
  }

  return (
    <>
      <Layout>
        <div className="m-3">
          <h4>Add New Item</h4>
          <div className="mx-3   addItemSection p-4 p-md-3 p-sm-0">
            <Card
              className="mb-4 p-2 p-sm-0"
              style={{ borderRadius: "10px" }}
            >
              <Card.Body>
                <Card.Title>Party Information</Card.Title>
                <Form>
                  <Row className="mb-3">
                    <Form.Group
                      as={Col}
                      xs={12}
                      md={partyName ? 4 : 12}
                      controlId="formPartyName"
                    >
                      <Form.Label>Party Name</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={handlePartyNameChange}
                      >
                        <option value="">Select Party</option>
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

                    {partyName && (
                      <>
                        <Form.Group
                          as={Col}
                          xs={12}
                          md={4}
                          controlId="formSubParty"
                        >
                          <Form.Label>Sub-Party</Form.Label>
                          <Form.Control
                        as="select"
                        onChange={handlePartyNameChange}
                        disabled
                      >
                        <option value=""> Saathi UIUX Design Company 1</option>
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

                        <Form.Group
                          as={Col}
                          xs={12}
                          md={4}
                          controlId="formCity"
                        >
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ahmedabad"
                            disabled
                          />
                        </Form.Group>
                      </>
                    )}
                  </Row>

                  {partyName && (
                    <>
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          xs={12}
                          md={4}
                          controlId="formCreditDays"
                        >
                          <Form.Label>Credit Days</Form.Label>
                          <Form.Control type="text" placeholder="15" disabled />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          xs={12}
                          md={4}
                          controlId="formCreditLimit"
                        >
                          <Form.Label>Credit Limit</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="15,000"
                            disabled
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          xs={12}
                          md={4}
                          controlId="formTotalDebit"
                        >
                          <Form.Label>Total Debit</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="15,000"
                            disabled
                          />
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          xs={12}
                          md={4}
                          controlId="formTotalCredit"
                        >
                          <Form.Label>Total Credit</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="20,200"
                            disabled
                          />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          xs={12}
                          md={4}
                          controlId="formTotalOverdue"
                        >
                          <Form.Label>Total Overdue</Form.Label>
                          <Form.Control type="text" placeholder="16" disabled />
                        </Form.Group>

                        <Form.Group
                          as={Col}
                          xs={12}
                          md={4}
                          controlId="formLockParty"
                        >
                          <Form.Label>Lock Party</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Yes"
                            disabled
                          />
                        </Form.Group>
                      </Row>
                    </>
                  )}
                </Form>
              </Card.Body>
            </Card>
            {partyName && (
              <Card
                className="mb-3 p-2 p-sm-0"
                style={{ borderRadius: "10px" }}
              >
                <Card.Body>
                  <Card.Title>Model Information</Card.Title>

                  <Card>
                  <Card.Title className="p-3">Your Models</Card.Title>
                  <Card.Body>

                  <DataTableComponent />
                  </Card.Body>
                  </Card>

                  <Form>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        xs={12}
                        md={modelName ? 6 : 12}
                        controlId="formModelName"
                      >
                        <Form.Label>Model Name</Form.Label>
                        <Form.Control
                          as="select"
                          onChange={handleModelNameChange}
                        >
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

                      {modelName && (
                        <>
                          <Form.Group
                            as={Col}
                            xs={12}
                            md={6}
                            controlId="formListPrice"
                          >
                            <Form.Label>List Price (₹)</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="10,100"
                              disabled
                            />
                          </Form.Group>
                        </>
                      )}
                    </Row>

                    {modelName && (
                      <>
                        <Row className="mb-3">
                          <Form.Group
                            as={Col}
                            xs={12}
                            md={4}
                            controlId="formDiscount"
                          >
                            <Form.Label>Discount (%)</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="10%"
                              disabled
                            />
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            xs={12}
                            md={4}
                            controlId="formNetPrice"
                          >
                            <Form.Label>Net Price (₹)</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="15,000"
                              disabled
                            />
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            xs={12}
                            md={4}
                            controlId="formRequestPrice"
                          >
                            <Form.Label>Request Price (₹)</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="15,000"
                              readOnly
                            />
                          </Form.Group>
                        </Row>

                        <Row className="mb-3">
                          <Form.Group
                            as={Col}
                            xs={12}
                            md={4}
                            controlId="formRequestDiscount"
                          >
                            <Form.Label>Request Discount (₹)</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="20,200"
                              readOnly
                            />
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            xs={12}
                            md={4}
                            controlId="formQuantity"
                          >
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="20,200"
                              readOnly
                            />
                          </Form.Group>

                          <Form.Group
                            as={Col}
                            xs={12}
                            md={4}
                            controlId="formStockQuantity"
                          >
                            <Form.Label>Stock Quantity</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="20,200"
                              disabled
                            />
                          </Form.Group>
                        </Row>
                      </>
                    )}
                    {modelName && (
                      <>
                        <Row className="mb-3">
                          <Form.Group as={Col} xs={12} controlId="formReasons">
                            <Form.Label>Reasons</Form.Label>
                            <Form.Control as="select">
                              <option>Select Reasons</option>
                              <option>Reason 1</option>
                              <option>Reason 2</option>
                              <option>Reason 3</option>
                            </Form.Control>
                          </Form.Group>
                        </Row>

                        <Row className="mb-1">
                          <Col className="d-flex justify-content-start" xs={12}>
                            <div
                              className="btn-wrapper"
                              style={{ display: "inline-block" }}
                            >
                              <button className="btn btn-outline-primary addBtn" onClick={(e) =>{
                                e.preventDefault();
                                setCheckSalesModal(true)
                              }}>
                                Check Sales
                              </button>
                            </div>
                          </Col>
                        </Row>

                        <hr />

                        <Row>
                          <Col className="d-flex justify-content-end" xs={12}>
                            <div
                              className="btn-wrapper"
                              style={{ display: "inline-block" }}
                            >
                              <button className="btn btn-primary addBtn">
                                Confirm Modal
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            )}
{  modelName && 
<Row className="mt-1 gap-2 mb-5">
  <Col>
  <Card className="p-3">
      <Row className="my-4">
        <Col className="d-flex justify-content-between align-items-center ">
          <h5>Pricing Coordinator</h5>
          <div
                              className="btn-wrapper"
                              style={{ display: "inline-block" }}
                            >
          <button  className="btn btnSelect" onClick={(e) =>{
            e.preventDefault();
            setSelectUserModal(true)
          }}>Select Users</button></div>
        </Col>
      </Row>
      <Row className="">
        {users.map(user => (
          <Col key={user.id} xs={12} md={6} lg={6}>
            <UserCard 
              name={user.name}
              email={user.email}
              onRemove={() => handleRemove(user.id)}
            />
          </Col>
        ))}
      </Row>
      </Card></Col>
      <Col>
<Card className="p-3">
      <Row className="my-4">
        <Col className="d-flex justify-content-between align-items-center ">
          <h5>Pricing Coordinator</h5>
          <div
                              className="btn-wrapper"
                              style={{ display: "inline-block" }}
                            >
          <button  className="btn btnSelect" onClick={(e) =>{
            e.preventDefault();
            setSelectUserModal(true)
          }}>Select Users</button></div>
        </Col>
      </Row>
      <Row className="">
        {users.map(user => (
          <Col key={user.id} xs={12} md={6} lg={6}>
            <UserCard 
              name={user.name}
              email={user.email}
              onRemove={() => handleRemove(user.id)}
            />
          </Col>
        ))}
      </Row>
      </Card></Col>
</Row>
}

          </div>
        </div>

      </Layout>
      <CheckSalesModal show={checkSalesModal} onHide={() => setCheckSalesModal(false)}/>

      <SelectUserModal show={selectUserModal} onHide={() =>{
        setSelectUserModal(false)
      }} />
    </>
  );
}

export default AddItem;

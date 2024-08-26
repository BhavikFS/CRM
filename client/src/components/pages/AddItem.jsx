import { useEffect, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../Layout/Layout";
import "../../assets/css/AddItem.css";
import UserCard from "./UserCard";
import CheckSalesModal from "./CheckSalesModal";
import DataTableComponent from "./DataTableComponent";
import SelectUserModal from "./SelectUserModal";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";

function AddItem() {
  const [checkSalesModal, setCheckSalesModal] = useState(false);
  const [selectUserModal, setSelectUserModal] = useState(false);
  const [partyList, setPartyList] = useState([]);
  const [partyListLoading, setPartyListLoading] = useState(true);
  const [selectedParty, setSelectedParty] = useState("");
  const [selectedPartyDetail, setSelectedPartyDetail] = useState({});
  const [subPartyList, setSubPartyList] = useState([]);
  const [subPartyListLoading, setSubPartyListLoading] = useState(true);
  const [selectedSubParty, setSelectedSubParty] = useState("");
  const [modalList, setModalList] = useState([]);
  const [modalListLoading, setModalListLoading] = useState(true);
  const [selectedModal, setSelectedModal] = useState("");
  const [selectedModalDetail, setSelectedModalDetail] = useState({});
  const [modalInfoData, setModalInfoData] = useState({
    requestPrice: 0,
    requestDiscount: 0,
    quantity: 0,
  });
  const [modalInfoLoading, setModalInfoLoading] = useState(false);

  const handleChange = (e) => {
    setModalInfoData({ ...modalInfoData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setModalInfoLoading(true);
    try {
      const payload = {
        modelId: selectedModal,
        requestPrice: modalInfoData.requestPrice,
        requestDiscount: modalInfoData.requestDiscount,
        requestQuantity: modalInfoData.quantity,
        reasons: ["Bulk order"],
      };

      const response = await axios.post(
        `${BASE_URL}/info/create-model-info`,
        payload
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setModalInfoLoading(false);
    }
  };

  const users = [
    { id: 1, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 2, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 3, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 4, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 5, name: "Saathi G.", email: "abc@gmail.com" },
  ];
  const handlePartyNameChange = (event) => {
    setSelectedParty(event.target.value);
    setSelectedSubParty("");
    setSubPartyList([]);
    setSelectedModal("");
    setSelectedModalDetail({});
    setModalList([]);
  };

  const handleSubPartyNameChange = (event) => {
    setSelectedSubParty(event.target.value);
    setSelectedModal("");
    setSelectedModalDetail({});
  };

  const handleModelNameChange = (event) => {
    setSelectedModal(event.target.value);
  };

  // const PricingCoordinator = () => {
  //   const handleRemove = (id) => {
  //     console.log(`Remove user with id: ${id}`);
  //   };
  // };

  useEffect(() => {
    const fetchPartyData = async () => {
      setPartyListLoading(true);
      try {
        const response = await axios.get(`${BASE_URL}/party/get-parties`);
        setPartyList(response.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setPartyListLoading(false);
      }
    };

    fetchPartyData();
  }, []);

  useEffect(() => {
    if (selectedParty !== "") {
      const findParty = partyList.find((item) => item._id === selectedParty);
      setSelectedPartyDetail(findParty);
      console.log(findParty, "findParty");
    } else {
      setSelectedPartyDetail({});
    }
  }, [selectedParty]);

  useEffect(() => {
    if (selectedParty !== "") {
      const fetchSubPartyData = async () => {
        setSubPartyListLoading(true);
        try {
          const response = await axios.get(
            `${BASE_URL}/party/get-sub-parties/${selectedParty}`
          );
          setSubPartyList(response.data.data);
        } catch (error) {
          console.log(error);
        } finally {
          setSubPartyListLoading(false);
        }
      };

      fetchSubPartyData();
    } else {
      setSubPartyList([]);
      setSelectedSubParty("");
    }
  }, [selectedParty]);

  useEffect(() => {
    if (selectedParty !== "") {
      if (selectedSubParty !== "") {
        console.log(selectedSubParty, "selectedSubParty---");
        const fetchModalData = async () => {
          setModalListLoading(true);
          try {
            const response = await axios.get(
              `${BASE_URL}/party/get-models/${selectedSubParty}`
            );
            setModalList(response.data.data);
          } catch (error) {
            console.log(error);
          } finally {
            setModalListLoading(false);
          }
        };

        fetchModalData();
      }
    } else {
      setModalList([]);
      setSelectedModal("");
    }
  }, [selectedParty, selectedSubParty]);

  useEffect(() => {
    if (selectedParty !== "") {
      if (selectedSubParty !== "") {
        console.log(selectedModal, "selectedModal-0");
        const findModal = modalList.find((item) => item._id === selectedModal);
        console.log(findModal, modalList, selectedModal, "findModal");
        setSelectedModalDetail(findModal);
      } else {
        setSelectedModalDetail({});
      }
    }
  }, [selectedModal]);

  return (
    <>
      <Layout>
        <div className="m-3">
          <h4>Add New Item</h4>
          <div className="mx-3   addItemSection p-4 p-md-3 p-sm-0">
            <Card className="mb-4 p-2 p-sm-0" style={{ borderRadius: "10px" }}>
              <Card.Body>
                <Card.Title>Party Information</Card.Title>
                <Form>
                  <Row className="mb-3">
                    <Form.Group
                      as={Col}
                      xs={12}
                      md={selectedParty ? 4 : 12}
                      controlId="formPartyName"
                    >
                      <Form.Label>Party Name</Form.Label>
                      <Form.Control
                        as="select"
                        onChange={handlePartyNameChange}
                        value={selectedParty}
                        disabled={partyListLoading}
                      >
                        {partyList && partyList.length > 0 ? (
                          <>
                            <option value="">Select Party</option>
                            {partyList.map((item) => (
                              <option key={item._id} value={item._id}>
                                {item.name}
                              </option>
                            ))}
                          </>
                        ) : (
                          <option value="">No parties found</option>
                        )}
                      </Form.Control>
                    </Form.Group>

                    {selectedParty && (
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
                            onChange={handleSubPartyNameChange}
                            value={selectedSubParty}
                            disabled={
                              subPartyListLoading || selectedParty === ""
                            }
                          >
                            {subPartyList && subPartyList.length > 0 ? (
                              <>
                                <option value="">Select Sub-Party</option>
                                {subPartyList.map((item) => (
                                  <option key={item?._id} value={item?._id}>
                                    {item.name}
                                  </option>
                                ))}
                              </>
                            ) : (
                              <option value="">No sub-parties found</option>
                            )}
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
                            disabled
                            value={selectedPartyDetail.city}
                          />
                        </Form.Group>
                      </>
                    )}
                  </Row>

                  {selectedParty && (
                    <>
                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          xs={12}
                          md={4}
                          controlId="formCreditDays"
                        >
                          <Form.Label>Credit Days</Form.Label>
                          <Form.Control
                            type="text"
                            value={
                              selectedPartyDetail.creditDays
                                ? selectedPartyDetail.creditDays
                                : 0
                            }
                            disabled
                          />
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
                            value={
                              selectedPartyDetail.creditLimit
                                ? selectedPartyDetail.creditLimit
                                : 0
                            }
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
                          <Form.Control
                            type="text"
                            value={
                              selectedPartyDetail.totalOverdue
                                ? selectedPartyDetail.totalOverdue
                                : 0
                            }
                            disabled
                          />
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
            {selectedParty && (
              <Card
                className="mb-3 p-2 p-sm-0"
                style={{ borderRadius: "10px" }}
              >
                <Card.Body>
                  <Card.Title>Model Information</Card.Title>

                  {/* <Card>
                    <Card.Title className="p-3">Your Models</Card.Title>
                    <Card.Body>
                      <DataTableComponent />
                    </Card.Body>
                  </Card> */}

                  <Form>
                    <Row className="mb-3">
                      <Form.Group
                        as={Col}
                        xs={12}
                        md={selectedModal ? 6 : 12}
                        controlId="formModelName"
                      >
                        <Form.Label>Model Name</Form.Label>
                        <Form.Control
                          as="select"
                          onChange={handleModelNameChange}
                          value={selectedModal}
                          disabled={modalListLoading || selectedParty === ""}
                        >
                          {modalList && modalList.length > 0 ? (
                            <>
                              <option value="">Select Model</option>
                              {modalList.map((item) => (
                                <option key={item?._id} value={item?._id}>
                                  {item.name}
                                </option>
                              ))}
                            </>
                          ) : (
                            <option value="">No models found</option>
                          )}
                        </Form.Control>
                      </Form.Group>

                      {selectedModal !== "" && (
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
                              value={
                                selectedModalDetail?.listPrice
                                  ? selectedModalDetail?.listPrice
                                  : 0
                              }
                              disabled
                            />
                          </Form.Group>
                        </>
                      )}
                    </Row>

                    {selectedModal && (
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
                              onChange={handleChange}
                              name="requestPrice"
                              value={modalInfoData.requestPrice}
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
                              onChange={handleChange}
                              name="requestDiscount"
                              value={modalInfoData.requestDiscount}
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
                              onChange={handleChange}
                              name="quantity"
                              value={modalInfoData.quantity}
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
                    {selectedModal && (
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
                              <button
                                className="btn btn-outline-primary addBtn"
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

                        {/* <hr /> */}

                        <Row>
                          <Col className="d-flex justify-content-end" xs={12}>
                            <div
                              className="btn-wrapper"
                              style={{ display: "inline-block" }}
                            >
                              <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={modalInfoLoading}
                                className="btn btn-primary addBtn"
                              >
                                {modalInfoLoading
                                  ? "Processsing..."
                                  : "Confirm Modal"}
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
            {selectedModal && (
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
                          <button
                            className="btn btnSelect"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectUserModal(true);
                            }}
                          >
                            Select Users
                          </button>
                        </div>
                      </Col>
                    </Row>
                    <Row className="">
                      {users.map((user) => (
                        <Col key={user.id} xs={12} md={6} lg={6}>
                          <UserCard
                            name={user.name}
                            email={user.email}
                            onRemove={() => handleRemove(user.id)}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </Col>
                <Col>
                  <Card className="p-3">
                    <Row className="my-4">
                      <Col className="d-flex justify-content-between align-items-center ">
                        <h5>Pricing Coordinator</h5>
                        <div
                          className="btn-wrapper"
                          style={{ display: "inline-block" }}
                        >
                          <button
                            className="btn btnSelect"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectUserModal(true);
                            }}
                          >
                            Select Users
                          </button>
                        </div>
                      </Col>
                    </Row>
                    <Row className="">
                      {users.map((user) => (
                        <Col key={user.id} xs={12} md={6} lg={6}>
                          <UserCard
                            name={user.name}
                            email={user.email}
                            onRemove={() => handleRemove(user.id)}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </Col>
              </Row>
            )}
          </div>
        </div>
      </Layout>
      <CheckSalesModal
        show={checkSalesModal}
        onHide={() => setCheckSalesModal(false)}
      />

      <SelectUserModal
        show={selectUserModal}
        onHide={() => {
          setSelectUserModal(false);
        }}
      />
    </>
  );
}

export default AddItem;

import { useState, useEffect } from "react";
import { Modal, Form, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import profile from "../../assets/images/Avatar.png";
import { getAuthConfig, put } from "../../libs/http-hydrate"; // Import the 'put' function for API request

const EditModal = ({ show, hide, selectedModel ,setReload}) => {
  console.log(selectedModel, "editmodaldata");
  const [modelName, setModelName] = useState("");
  const [subParty, setSubParty] = useState("");
  const [requestPrice, setRequestPrice] = useState("");
  const [requestDiscount, setRequestDiscount] = useState("");
  const [requestQuantity, setRequestQuantity] = useState("");
  const [reasons, setReasons] = useState([]);
  const [availableReasons, setAvailableReasons] = useState([
    "Reason 1",
    "Reason 2",
    "Reason 3",
  ]);

  const [loading, setLoading] = useState(false); // State to handle loading spinner
  const [errorMessage, setErrorMessage] = useState(""); // State to handle error message
  const [successMessage, setSuccessMessage] = useState(""); // State to handle success message

  // Prefill the modal form with selected model data when it opens
  useEffect(() => {
    if (selectedModel) {
      setModelName(selectedModel?.modelInfo?.model?.name || "");
      setSubParty(selectedModel.subParty?.name || "");
      setRequestPrice(selectedModel?.modelInfo?.requestPrice || "");
      setRequestDiscount(selectedModel?.modelInfo?.requestDiscount || "");
      setRequestQuantity(selectedModel?.modelInfo?.requestQuantity || "");
      setReasons(selectedModel?.modelInfo?.reasons || []);
    }
  }, [selectedModel]);

  const handleReasonSelect = (e) => {
    const reason = e.target.value;
    if (!reasons.includes(reason)) {
      setReasons((prev) => [...prev, reason]);
    }
  };

  const handleRemoveReason = (reasonToRemove) => {
    setReasons(reasons.filter((reason) => reason !== reasonToRemove));
  };

  const handleSubmit = async () => {
    setLoading(true); // Show the spinner
    setErrorMessage(""); // Reset error message
    setSuccessMessage(""); // Reset success message

    try {
      const response = await put(
        `/api/info/update-model-info/${selectedModel?.modelInfo?._id}`,
        {
          modelId: selectedModel?.modelInfo?.model?._id,
          requestPrice,
          requestDiscount,
          requestQuantity,
          reasons,
        },
        getAuthConfig()
      );

   
        setSuccessMessage("Model updated successfully!");
        setReload(true)
        hide(); // Close the modal after showing the success message

    
    } catch (error) {
      setErrorMessage("Error updating model info: " + error.message);
    } finally {
      setSuccessMessage("")
      setLoading(false); // Hide the spinner
    }
  };
  const isPendingStatus = selectedModel?.status === "pending"; // Check if the status is pending

  return (
    <Modal
      show={show}
      onHide={hide}
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
            <Form.Control
              as="select"
             // value={modelName}
             // onChange={(e) => setModelName(e.target.value)}
             disabled
            >
              <option value="">{selectedModel?.modelInfo?.model?.name}</option>
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} xs={12} md={4} controlId="formSubParty">
            <Form.Label>Sub-Party</Form.Label>
            <Form.Control
              as="select"
              //value={subParty}
             // onChange={(e) => setSubParty(e.target.value)}
             disabled
            >
                            <option value="">{selectedModel?.subParty?.name}</option>

            </Form.Control>
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
            <Form.Control
              type="text"
              placeholder={`${selectedModel?.modelInfo?.model?.discount} %`}
              disabled
            />
          </Form.Group>

          <Form.Group as={Col} xs={12} md={4} controlId="formNetPrice">
            <Form.Label>Net Price (₹)</Form.Label>
            <Form.Control type="text" placeholder="15,000" disabled />
          </Form.Group>

          <Form.Group as={Col} xs={12} md={4} controlId="formRequestPrice">
            <Form.Label>Request Price (₹)</Form.Label>
            <Form.Control
              type="text"
              value={requestPrice}
              disabled={isPendingStatus}
              onChange={(e) => setRequestPrice(e.target.value)}
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} xs={12} md={4} controlId="formRequestDiscount">
            <Form.Label>Request Discount (%)</Form.Label>
            <Form.Control
              type="text"
              value={requestDiscount}
              onChange={(e) => setRequestDiscount(e.target.value)}
              disabled={isPendingStatus}
            />
          </Form.Group>

          <Form.Group as={Col} xs={12} md={4} controlId="formRequestQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="text"
              value={requestQuantity}
              onChange={(e) => setRequestQuantity(e.target.value)}
              disabled={isPendingStatus}
            />
          </Form.Group>

          <Form.Group as={Col} xs={12} md={4} controlId="formStockQuantity">
            <Form.Label>Stock Quantity</Form.Label>
            <Form.Control type="text" placeholder="20,200"                disabled={isPendingStatus}
/>
          </Form.Group>
        </Row>

        <Row className="mb-3 align-items-center">
          <Form.Group as={Col} xs={12} md={10} controlId="formReasons">
            <Form.Label>Reasons</Form.Label>
            <Form.Control as="select" onChange={handleReasonSelect}               disabled={isPendingStatus}
>
              <option>Select Reasons</option>
              {availableReasons.map((reason, index) => (
                <option key={index} value={reason}>
                  {reason}
                </option>
              ))}
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

        <div className="d-flex justify-content-start">
          {reasons.map((reason, index) => (
            <button
              key={index}
              className="btnreason d-flex justify-content-between align-items-center"
              style={{ padding: "5px" }}
            >
              {reason}
              <span
                className="closebtn"
                style={{
                  marginRight: "5px",
                  marginLeft: "5px",
                  height: "20px",
                  width: "20px",
                }}
                onClick={() => handleRemoveReason(reason)}
              >
                <i className="fa fa-xmark"></i>
              </span>
            </button>
          ))}
        </div>

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
                    <span className="mb-0 nameUser">
                      {selectedModel?.pricingUsers?.user?.username}
                    </span>
                    <span className="mb-0 nameUserSub">
                      {selectedModel?.pricingUsers?.user?.email}
                    </span>
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
                  <h6>Finance & Accounts</h6>
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
                    <span className="mb-0 nameUser">
                      {selectedModel?.financeUsers?.user?.username}
                    </span>
                    <span className="mb-0 nameUserSub">
                      {selectedModel?.financeUsers?.user?.email}
                    </span>
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
        {/* Show success message */}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        {/* Show error message */}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

{!isPendingStatus && 
        <div className="d-flex justify-content-end mt-2">
          <button className="btnscndry" onClick={hide}>
            Cancel
          </button>
          <button className="btnprm" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <Spinner animation="border" variant="light" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>}
      </Modal.Body>
    </Modal>
  );
};

export default EditModal;

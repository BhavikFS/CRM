import { Card, Col, Form, Modal, Row } from "react-bootstrap";
import Layout from "../../Layout/Layout";
import "../../../assets/css/Stage4.css";
import UserCard from "../UserCard";
import { useState } from "react";
function Stage4() {
  const [modalSubmit, setmodalSubmit] = useState(false);
  const users = [
    { id: 1, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 2, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 3, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 4, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 5, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 6, name: "Saathi G.", email: "abc@gmail.com" },
  ];
  return (
    <>
      <Layout>
        <div className="p-2 p-md-5">
          <h5>Stage_4</h5>
          <div className="p-3 bg-white cardstage4">
            <Card className="p-2 cardstage4">
              <Card.Body>
                <Row className="stage4container p-2 ">
                  <Col lg="2" md="6" sm="12" xs="12">
                    {" "}
                    <p>
                      <span className="nameUser">Party Name</span> <br />{" "}
                      <span className="nameUserSub"> Sathi UI/UX....</span>{" "}
                    </p>{" "}
                  </Col>
                  <Col lg="2" md="6" sm="12" xs="12">
                    {" "}
                    <p>
                      <span className="nameUser">Model Name</span> <br />{" "}
                      <span className="nameUserSub"> Sathi UI/UX.... </span>{" "}
                    </p>{" "}
                  </Col>
                  <Col lg="2" md="6" sm="12" xs="12">
                    {" "}
                    <p>
                      <span className="nameUser"> Group Code </span> <br />{" "}
                      <span className="nameUserSub"> 12345667...</span>
                    </p>{" "}
                  </Col>
                  <Col lg="2" md="6" sm="12" xs="12">
                    {" "}
                    <p>
                      <span className="nameUser">Item Code </span>
                      <br /> <span className="nameUserSub"> 12345667...</span>
                    </p>{" "}
                  </Col>
                  <Col lg="2" md="6" sm="12" xs="12">
                    {" "}
                    <p>
                      <span className="nameUser">Qty. </span>
                      <br /> <span className="nameUserSub"> 10kG </span>
                    </p>{" "}
                  </Col>
                  <Col lg="2" md="6" sm="12" xs="12">
                    {" "}
                    <p>
                      <span className="nameUser">Amount </span>
                      <br /> <span className="nameUserSub"> $20,200 </span>
                    </p>{" "}
                  </Col>
                </Row>
                <Form className="mt-2">
                  <Row>
                    <Form.Group
                      as={Col}
                      xs={12}
                      md={6}
                      controlId="formPartyName"
                    >
                      <Form.Label>Freight Charge Rate </Form.Label>
                      <Form.Control type="text" placeholder="$12000" />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      xs={12}
                      md={6}
                      controlId="formPartyName"
                    >
                      <Form.Label>Material Insurance Rate </Form.Label>
                      <Form.Control type="text" placeholder="$12000" />
                    </Form.Group>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
            <Card className="p-2 cardstage4 mt-3">
              <Card.Header className="d-flex justify-content-between bg-white">
                <h5>Select Recipients</h5>
                <button className="selectbtn">Select Recipients </button>
              </Card.Header>
              <Card.Body>
                <Row>
                  {users.map((user) => (
                    <Col key={user.id} xs={12} md={12} lg={4}>
                      <UserCard
                        name={user.name}
                        email={user.email}
                        onRemove={() => handleRemove(user.id)}
                      />
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-end mt-2">
              <button className="btnscndry">Cancel</button>
              <button
                className="btnprm"
                onClick={(e) => {
                  e.preventDefault();
                  setmodalSubmit(true);
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </Layout>
      <Modal
        show={modalSubmit}
        onHide={() => {
          setmodalSubmit(false);
        }}
        centered
        className="stage4modal"
      >
        <Modal.Header closeButton className="border-0">
          <svg
            width="70"
            height="70"
            viewBox="0 0 70 70"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="70"
              height="70"
              rx="35"
              fill="#025FE0"
              fill-opacity="0.1"
            />
            <path
              d="M31.3333 23C30.5554 23 29.8093 23.309 29.2592 23.8592C28.709 24.4093 28.4 25.1554 28.4 25.9333V33.5703C28.8795 33.4347 29.3704 33.3439 29.8667 33.2989V25.9333C29.8667 25.5443 30.0212 25.1713 30.2962 24.8962C30.5713 24.6212 30.9443 24.4667 31.3333 24.4667H37.2V29.6C37.2 30.1835 37.4318 30.7431 37.8444 31.1556C38.2569 31.5682 38.8165 31.8 39.4 31.8H44.5333V43.5333C44.5333 43.9223 44.3788 44.2954 44.1038 44.5704C43.8287 44.8455 43.4557 45 43.0667 45H37.7867C37.5198 45.5225 37.1966 46.0143 36.8231 46.4667H43.0667C43.8446 46.4667 44.5907 46.1576 45.1408 45.6075C45.691 45.0574 46 44.3113 46 43.5333V30.9405C45.9995 30.3573 45.7674 29.7981 45.3547 29.3859L39.6141 23.6439C39.2017 23.2317 38.6425 23.0001 38.0595 23H31.3333ZM44.2297 30.3333H39.4C39.2055 30.3333 39.019 30.2561 38.8815 30.1185C38.7439 29.981 38.6667 29.7945 38.6667 29.6V24.7703L44.2297 30.3333ZM37.2 41.3333C37.2 43.0838 36.5046 44.7625 35.2669 46.0002C34.0292 47.238 32.3504 47.9333 30.6 47.9333C28.8496 47.9333 27.1708 47.238 25.9331 46.0002C24.6954 44.7625 24 43.0838 24 41.3333C24 39.5829 24.6954 37.9042 25.9331 36.6664C27.1708 35.4287 28.8496 34.7333 30.6 34.7333C32.3504 34.7333 34.0292 35.4287 35.2669 36.6664C36.5046 37.9042 37.2 39.5829 37.2 41.3333ZM34.0525 38.6141C33.9844 38.5458 33.9035 38.4917 33.8144 38.4547C33.7253 38.4177 33.6298 38.3987 33.5333 38.3987C33.4369 38.3987 33.3414 38.4177 33.2523 38.4547C33.1632 38.4917 33.0823 38.5458 33.0141 38.6141L29.1333 42.4964L28.1859 41.5475C28.0482 41.4098 27.8614 41.3324 27.6667 41.3324C27.4719 41.3324 27.2852 41.4098 27.1475 41.5475C27.0098 41.6852 26.9324 41.8719 26.9324 42.0667C26.9324 42.2614 27.0098 42.4482 27.1475 42.5859L28.6141 44.0525C28.6823 44.1208 28.7632 44.175 28.8523 44.212C28.9414 44.2489 29.0369 44.268 29.1333 44.268C29.2298 44.268 29.3253 44.2489 29.4144 44.212C29.5035 44.175 29.5844 44.1208 29.6525 44.0525L34.0525 39.6525C34.1208 39.5844 34.175 39.5035 34.212 39.4144C34.2489 39.3253 34.268 39.2298 34.268 39.1333C34.268 39.0369 34.2489 38.9414 34.212 38.8523C34.175 38.7632 34.1208 38.6823 34.0525 38.6141Z"
              fill="#025FE0"
            />
          </svg>
        </Modal.Header>
        <Modal.Body className="w-75">
          <h3>Submitted Successfully</h3>
          <span style={{ color: "#0A122A99" }}>
            Your application has been submitted Successfully.
          </span>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btnprm w-100"
            onClick={(e) => {
              e.preventDefault();
              setmodalSubmit(true);
            }}
          >
            Okay
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default Stage4;

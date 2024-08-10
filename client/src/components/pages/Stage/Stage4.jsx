import { Card, Col, Form, Row } from "react-bootstrap";
import Layout from "../../Layout/Layout";
import "../../../assets/css/Stage4.css";
import UserCard from "../UserCard";
function Stage4() {
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
                    <Col key={user.id} xs={12} md={6} lg={4}>
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
                        <button className="btnscndry">
                            Cancel
                        </button>
                        <button className="btnprm">
                            Submit
                        </button>
                        </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
export default Stage4;

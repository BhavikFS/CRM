import React from "react";
import { Col, Modal, Row, Table } from "react-bootstrap";
import UserCard from "./UserCard";

function SelectUserModal({ show, onHide }) {
  const users = [
    { id: 1, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 2, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 3, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 4, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 5, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 6, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 7, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 8, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 9, name: "Saathi G.", email: "abc@gmail.com" },
    { id: 10, name: "Saathi G.", email: "abc@gmail.com" },
  ];
  const handleRemove = (id) => {
    console.log(`Remove user with id: ${id}`);
  };
  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="md"
        centered
        dialogClassName="custom-modal-width" // Apply the custom class here
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <h6>Select Pricing Coordinator </h6>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {users.map((user) => (
              <Col key={user.id} xs={12} md={6} lg={6}>
                <UserCard
                  name={user.name}
                  email={user.email}
                  onRemove={() => handleRemove(user.id)}
                  icon={"righticon"}
                />
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#EAEAEA" }} className="d-flex justify-content-between align-items-center">
            <div>
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
            <div className="btn-wrapper" style={{ display: "inline-block" }}>
              <button className="btn btn-primary addBtn">Confirm (5)</button>
            </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default SelectUserModal;

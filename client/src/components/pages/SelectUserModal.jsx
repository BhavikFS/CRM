import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Modal, Row } from "react-bootstrap";
import { BASE_URL } from "../../constants/constants"; // Adjust the import path
import { get, getAuthConfig } from "../../libs/http-hydrate";
import profile from "../../assets/images/Avatar.png";

function SelectUserModal({ show, onHide, role, pricingUser, complianceUser, setComplianceUser, setPricingUser }) {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      fetchUsers();
    }
  }, [show, currentPage]); // Fetch users when modal opens or page changes

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await get(
        `/api/user/get-users?role=${role}&limit=10&page=${currentPage}`,
        getAuthConfig()
      );

      setUsers(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user) => {
    if (role === "PC") {
      if (pricingUser?._id === user._id) {
        // Deselect user if already selected
        setPricingUser(null);
      } else {
        // Select the user (replacing the previous selection)
        setPricingUser(user);
      }
    } else if (role === "CO") {
      if (complianceUser?._id === user._id) {
        // Deselect user if already selected
        setComplianceUser(null);
      } else {
        // Select the user (replacing the previous selection)
        setComplianceUser(user);
      }
    }
  };
  
  const isSelected = (user) => {
    if (role === "PC") {
      return pricingUser?._id === user._id;
    } else if (role === "CO") {
      return complianceUser?._id === user._id;
    }
    return false;
  };
  

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      centered
      dialogClassName="custom-modal-width"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h6>Select {role === "PC" ? "Pricing Coordinator" : "Compliance Officer"}</h6>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Row>
            {users.map((user) => (
              <Col key={user._id} xs={12} md={6} lg={6}>
                <Card className="d-flex flex-row align-items-center mb-3">
                  <Card.Img variant="left" src={profile} style={{ width: '40px', height: '40px', borderRadius: '50%', marginLeft: "5px" }} />
                  <Card.Body className="d-flex flex-column align-items-start">
                    <span className="mb-0 nameUser">{user?.username}</span>
                    <span className="mb-0 nameUserSub">{user?.email}</span>
                  </Card.Body>
                  <button
                    className={isSelected(user) ? 'closebtnSelected' : 'closebtn'}
                    onClick={() => handleSelectUser(user)}
                  >
                    <i className={`fa ${isSelected(user) ? 'fa-check' : 'fa-check'}`} style={isSelected(user) ? { color: "white" } : {}}></i>
                  </button>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: "#EAEAEA" }} className="d-flex justify-content-between align-items-center">
        <div>
          <nav data-pagination>
            <a disabled={currentPage === 1} onClick={handlePrevPage}>Prev</a>
            <ul>
              {Array.from({ length: totalPages }).map((_, index) => (
                <li key={index} className={currentPage === index + 1 ? "current" : ""}>
                  <a onClick={() => setCurrentPage(index + 1)}>{index + 1}</a>
                </li>
              ))}
            </ul>
            <a disabled={currentPage === totalPages} onClick={handleNextPage}>Next</a>
          </nav>
        </div>
        <div className="btn-wrapper" style={{ display: "inline-block" }}>
          <button className="btn btn-primary addBtn" onClick={onHide}>            Confirm ( {role === "PC" ? (pricingUser ? 1 : 0) : (complianceUser ? 1 : 0)} )
</button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default SelectUserModal;

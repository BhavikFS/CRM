import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RejectModal = ({ show, hide, onReject, onReturnForRevision }) => {
  const navigate = useNavigate();
  return (
    <Modal show={show} onHide={hide} centered className="stage4modal">
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
            fill="#FF0000"
            fillOpacity="0.1"
          />
          <path
            d="M35 49V48.2M35 43.4C35 35.24 43 37.28 43 29.1216C43 18.2928 27 18.2928 27 29.1216"
            stroke="#DC3545"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Modal.Header>
      <Modal.Body className="w-75">
        <h4>Reject/Return for Revision</h4>
        <span style={{ color: "#0A122A99" }}>
          Before making a decision, would you like to consider asking the user
          to resubmit the application?{" "}
        </span>
      </Modal.Body>
      <Modal.Footer>
        <div
          className="row w-100"
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <button
            className="btn"
            style={{
              fontWeight: "500",
              flex: "1",
              width: "50%",
              margin: "0",
              color: "#DC3545",
              border: "1px solid #DC3545",
              backgroundColor: "white",
            }}
            onClick={() => {
              onReturnForRevision();
              hide();
            }}
          >
            Return for Revision
          </button>
          <button
            className="btn"
            style={{
              fontWeight: "500",
              flex: "1",
              width: "50%",
              backgroundColor: "#DC3545",
            }}
            onClick={() => {
              onReject();
              hide();
            }}
          >
            Reject
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default RejectModal;

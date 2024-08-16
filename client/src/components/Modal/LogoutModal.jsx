import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LogoutModal = ({show,hide}) =>{
    const navigate = useNavigate()
    return(

        <Modal
        show={show}
        onHide={hide}
        centered
        className="stage4modal"
      >
        <Modal.Header closeButton className="border-0">
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="69" height="69" rx="34.5" fill="#025FE0" fill-opacity="0.1"/>
<rect x="0.5" y="0.5" width="69" height="69" rx="34.5" stroke="#025FE0"/>
<path d="M31.8571 35.1429L46 35.1429M46 35.1429L42.8571 32M46 35.1429L42.8571 38.2857M39.7143 41.4286V46.1429C39.7143 47.8786 38.3072 49.2857 36.5714 49.2857H27.1429C25.4071 49.2857 24 47.8786 24 46.1429L24 24.1429C24 22.4071 25.4071 21 27.1429 21L36.5714 21C38.3072 21 39.7143 22.4071 39.7143 24.1429V28.8571" stroke="#025FE0" stroke-width="1.5" stroke-linecap="round"/>
</svg>

        </Modal.Header>
        <Modal.Body className="w-75">
          <h4>Logout</h4>
          <span style={{ color: "#0A122A99" }}>
          Are you sure you want to log out? You'll need to log in again to access your account.          </span>
        </Modal.Body>
        <Modal.Footer>
  <div className="row w-100" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
    <button className="btnscndry" style={{ flex: '1', width: '50%', margin: '0' }}>
      Cancel
    </button>
    <button
      className="btnprm"
      style={{ flex: '1', width: '50%' }}
      onClick={(e) => {
        e.preventDefault();
        navigate("/login")
      }}
    >
      Okay
    </button>
  </div>
</Modal.Footer>

      </Modal>
    )
}

export default LogoutModal
import { Modal, Table } from "react-bootstrap";

function CheckSalesModal({ show, onHide }) {
  // Example sales data
  const salesData = [
    {
      id: 1,
      date: "20/06/2021",
      lastPrice: "UPI",
      quantity: "₹2000",
      itemRate: "₹2000",
    },
    {
      id: 2,
      date: "20/06/2021",
      lastPrice: "UPI",
      quantity: "₹2000",
      itemRate: "₹2000",
    },
  ];

  return (
    <>
      <Modal show={show} onHide={onHide} size="md" centered className="salesModal">
        <Modal.Header closeButton>
          <Modal.Title>Check Sales</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <tbody>
              {salesData.map((sale, index) => (
                <tr key={index}>
                  <td className="pt-3">{sale.id}</td>
                  <td> <span>Date</span> <p> {sale.date} </p></td>
                  <td> <span>Total Amount </span><p> {sale.lastPrice}</p></td>
                  <td><span> Quantity </span><p>{sale.quantity}</p></td>
                  <td> <span>Item Rate </span> <p>{sale.itemRate}</p></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CheckSalesModal;

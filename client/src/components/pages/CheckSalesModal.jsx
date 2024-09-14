import axios from "axios";
import { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { BASE_URL } from "../../constants/constants";
import { getAuthConfig } from "../../libs/http-hydrate";
import moment from "moment";

function CheckSalesModal({ show, onHide, selectedModal }) {
  const [salesData, setSalesData] = useState([]);
  useEffect(() => {
    if (selectedModal) {
      const fetchSalesData = async () => {
        const itemCode = Number(selectedModal);
        try {
          const response = await axios.get(
            `${BASE_URL}/sales?itemCode=${itemCode}`,
            getAuthConfig()
          );
          setSalesData(response.data.sales);
          console.log(response, "response====");
        } catch (error) {
          console.log(error, "Error getting sales data");
        }
      };

      fetchSalesData();
    }
  }, [selectedModal]);

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="md"
        centered
        className="salesModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Check Sales</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!salesData.length ? (
            "No Data found"
          ) : (
            <Table>
              <tbody>
                {salesData.map((sale, index) => (
                  <tr key={index}>
                    <td className="pt-3">{sale.id}</td>
                    <td>
                      {" "}
                      <span>Date</span>{" "}
                      <p> {moment(sale.salesDate).format("DD - MM - YYYY")} </p>
                    </td>
                    <td>
                      {" "}
                      <span>invoice Number </span>
                      <p> {sale.invoiceNumber}</p>
                    </td>
                    <td>
                      {" "}
                      <span>Total Amount </span>
                      <p> {sale.totalAmount.toFixed(2)}</p>
                    </td>
                    <td>
                      <span> Quantity </span>
                      <p>{sale.salesQuantity}</p>
                    </td>
                    <td>
                      {" "}
                      <span>Item Rate </span> <p>{sale.itemRate.toFixed(2)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CheckSalesModal;

import { useEffect, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import Layout from "../Layout/Layout";
import "../../assets/css/AddItem.css";
// import UserCard from "./UserCard";
import CheckSalesModal from "./CheckSalesModal";
// import DataTableComponent from "./DataTableComponent";
import SelectUserModal from "./SelectUserModal";
import axios from "axios";
import { BASE_URL } from "../../constants/constants";
import { getAuthConfig } from "../../libs/http-hydrate";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";
import profile from "../../assets/images/Avatar.png";
import { useNavigate } from "react-router-dom";

function AddItem() {
  const navigate = useNavigate();
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
    reasons: [],
  });
  const [modalInfoLoading, setModalInfoLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // For success messages
  const [ModalInfoList, setModalInfoList] = useState([]);
  const [ModalInfoListLoading, setModalInfoListLoading] = useState(false);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [pricingUser, setPricingUser] = useState([]);
  const [complianceUser, setComplianceUser] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);

  const [role, setRole] = useState("");
  const handleEdit = (rowData) => {
    setEditMode(true);
    setEditItemId(rowData?._id);
    setSelectedModalDetail(rowData?.model);
    setSelectedModal(rowData?.model._id);
    setModalInfoData({
      requestPrice: rowData?.requestPrice,
      requestDiscount: rowData?.requestDiscount,
      quantity: rowData?.requestQuantity,
    });

    // Show the form
    setShowAddItemForm(true);
  };

  const handleDeleteSelected = async () => {
    if (selectedCustomers.length === 0) {
      setErrorMessage("No items selected for deletion.");
      return;
    }

    setDeleteLoading(true);
    setErrorMessage("");

    try {
      await axios.delete(`${BASE_URL}/info/delete-model-info`, {
        data: { ids: selectedCustomers },
        ...getAuthConfig(),
      });

      // Filter out the deleted items from the list
      setModalInfoList((prevList) =>
        prevList.filter((item) => !selectedCustomers.includes(item._id))
      );

      // Clear selected customers after deletion
      setSelectedCustomers([]);
    } catch (error) {
      console.error("Error deleting model info:", error);
      setErrorMessage(
        error.response?.data?.error ||
          "An error occurred during deletion. Please try again."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert the value to a float or default to 0 if the value is empty
    const parsedValue = value === "" ? 0 : parseFloat(value);

    if (name === "requestPrice") {
      const requestPrice = isNaN(parsedValue) ? 0 : parsedValue;

      // Ensure requestPrice does not exceed listPrice
      if (requestPrice > selectedModalDetail?.listPrice) {
        setErrorMessage("Request price cannot be more than the list price.");
        setModalInfoData({
          ...modalInfoData,
          requestPrice: selectedModalDetail?.listPrice,
          requestDiscount: 0, // Reset discount
        });
      } else {
        const requestDiscount =
          ((selectedModalDetail?.listPrice - requestPrice) /
            selectedModalDetail?.listPrice) *
          100;
        setModalInfoData({
          ...modalInfoData,
          requestPrice,
          requestDiscount: isNaN(requestDiscount)
            ? 0
            : requestDiscount.toFixed(2),
        });
        setErrorMessage(""); // Clear error message
      }
    } else if (name === "requestDiscount") {
      const requestDiscount = isNaN(parsedValue) ? 0 : parsedValue;

      // Ensure requestDiscount does not exceed 100%
      if (requestDiscount > 100) {
        setErrorMessage("Discount cannot be more than 100%.");
        setModalInfoData({
          ...modalInfoData,
          requestDiscount: 100,
          requestPrice: 0, // 100% discount means price is 0
        });
      } else {
        const requestPrice =
          selectedModalDetail?.listPrice * (1 - requestDiscount / 100);
        setModalInfoData({
          ...modalInfoData,
          requestDiscount,
          requestPrice: isNaN(requestPrice) ? 0 : requestPrice.toFixed(2),
        });
        setErrorMessage(""); // Clear error message
      }
    } else {
      setModalInfoData({
        ...modalInfoData,
        [name]: parsedValue, // Ensure parsed value is set to 0 if the input is empty
      });
      setErrorMessage("");
    }
  };

  const handleSubmit = async () => {
    setModalInfoLoading(true);
    setErrorMessage("");
    try {
      if (
        !modalInfoData.requestPrice ||
        !modalInfoData.requestDiscount ||
        !modalInfoData.quantity
      ) {
        setErrorMessage(
          "All fields (price, discount, and quantity) must be filled out."
        );
        setModalInfoLoading(false);
        return;
      }

      const payload = {
        modelId: selectedModal,
        requestPrice: modalInfoData.requestPrice,
        requestDiscount: modalInfoData.requestDiscount,
        requestQuantity: modalInfoData.quantity,
        reasons: ["Bulk order"],
      };

      if (editMode) {
        // Update existing ModelInfo
        const response = await axios.put(
          `${BASE_URL}/info/update-model-info/${editItemId}`,
          payload,
          getAuthConfig()
        );

        // Update the item in the list
        setModalInfoList((prevList) =>
          prevList.map((item) =>
            item._id === editItemId ? response.data.data : item
          )
        );
      } else {
        const response = await axios.post(
          `${BASE_URL}/info/create-model-info`,
          payload,
          getAuthConfig()
        );

        setModalInfoList((prevList) => [response.data.data, ...prevList]);
      }
    } catch (error) {
      console.error("Error creating model info:", error);
      setErrorMessage(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setModalInfoLoading(false);
      // Reset form and states
      setEditMode(false);
      setEditItemId(null);
      setModalInfoData({
        requestPrice: 0,
        requestDiscount: 0,
        quantity: 0,
      });
      setShowAddItemForm(false);
    }
  };
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
    fetchModelInfoList(event.target.value);
  };

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
        const findModal = modalList?.find((item) => item?._id === selectedModal);
        setSelectedModalDetail(findModal);
      } else {
        setSelectedModalDetail({});
      }
    }
  }, [selectedModal]);

  const fetchModelInfoList = async (modelID) => {
    setModalInfoListLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/info/model-info-list`, {
        params: {
          modelID: modelID,
          party: selectedParty,
          subParty: selectedSubParty,
        },
        ...getAuthConfig(),
      });
      setModalInfoList(response.data);
    } catch (error) {
      console.error("Error fetching model info list:", error);
      setErrorMessage("An error occurred while fetching model info list.");
    } finally {
      setModalInfoListLoading(false);
    }
  };
  const statusBodyTemplate = () => {
    
    return (
      <button
        className="btn btn-outline-primary addBtn"
        style={{ whiteSpace: "nowrap", fontSize: "11px", padding: "7px" }}
        onClick={(e) => {
          e.preventDefault();
          setCheckSalesModal(true);
        }}
      >
        Check Sales
      </button>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="d-flex justify-content-between">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "#147F4A1A",
            height: "30px",
            width: "30px",
          }}
          onClick={() => handleEdit(rowData)}
        >
          <i
            className="fa fa-pen"
            style={{ color: "#147F4A", fontSize: "12px" }}
          ></i>
        </div>

        <div
          className="d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#FDECEA", height: "30px", width: "30px" }}
          onClick={() => handleDeleteSelected([rowData._id])}
        >
          <i
            className="fa fa-trash"
            style={{ color: "#DC3545", fontSize: "12px", cursor: "pointer" }}
          ></i>
        </div>
      </div>
    );
  };


  const onHeaderCheckboxChange = (e) => {
    let _selectedCustomers = [];

    if (e.checked) {
      _selectedCustomers = ModalInfoList.map((customer) => customer._id);
    }

    setSelectedCustomers(_selectedCustomers);
  };

  const onCheckboxChange = (e, id) => {
    let _selectedCustomers = [...selectedCustomers];

    if (e.checked) {
      _selectedCustomers.push(id);
    } else {
      _selectedCustomers = _selectedCustomers.filter(
        (customerId) => customerId !== id
      );
    }

    setSelectedCustomers(_selectedCustomers);
  };

  const isAllSelected =
    ModalInfoList.length > 0 &&
    selectedCustomers.length === ModalInfoList.length;
  const handleSubmitRequest = async () => {
    setModalInfoLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!pricingUser._id) {
      setErrorMessage("Please select at least one Pricing Coordinator.");
      setModalInfoLoading(false);
      return;
    }

    if (!complianceUser._id) {
      setErrorMessage("Please select at least one Compliance Officer.");
      setModalInfoLoading(false);
      return;
    }

    const payload = {
      party: selectedParty,
      subParty: selectedSubParty,
      modelInfo: ModalInfoList.map((item) => item._id),
      pricingUsers: pricingUser._id,
      financeUsers: complianceUser._id,
      status: "Pending", // Default status, adjust as necessary
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/request/request-generate`,
        payload,
        getAuthConfig()
      );

      setSuccessMessage("Request created successfully!");

      setTimeout(() => {
        navigate("/");
      }, 3000);
      // Handle any additional success actions like resetting forms
    } catch (error) {
      console.error("Error creating request:", error);
      setErrorMessage(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setModalInfoLoading(false);
    }
  };
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
                            disabled
                            value={
                              selectedPartyDetail.totalDebit
                                ? selectedPartyDetail.totalDebit
                                : 0
                            }
                          />
                        </Form.Group>
                      </Row>

                      <Row className="mb-3">
                        <Form.Group
                          as={Col}
                          xs={12}
                          md={4}
                          controlId="formDiffDays"
                        >
                          <Form.Label>Diff. Days</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="20,200"
                            disabled
                            value={
                              selectedPartyDetail.diffDays
                                ? selectedPartyDetail.diffDays
                                : 0
                            }
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

                  {ModalInfoList && ModalInfoList?.length > 0 && (
                    <div className="card">
                      <Card>
                        <Card.Title className="p-3">
                          <div className="d-flex justify-content-between">
                            <h5>Your Models</h5>
                            <div>
                              <button
                                className="btn btnSelect"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setShowAddItemForm(true); // Show the form when "+ Add Item" is clicked
                                }}
                              >
                                + Add Item
                              </button>
                            </div>
                          </div>
                        </Card.Title>
                        <Card.Body>
                          <DataTable
                            value={ModalInfoList}
                            tableStyle={{ minWidth: "50rem" }}
                            paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink "
                          >
                            <Column
                              header={
                                <Checkbox
                                  checked={isAllSelected}
                                  onChange={onHeaderCheckboxChange}
                                />
                              }
                              body={(rowData) => (
                                <Checkbox
                                  checked={selectedCustomers.includes(
                                    rowData._id
                                  )}
                                  onChange={(e) =>
                                    onCheckboxChange(e, rowData._id)
                                  }
                                />
                              )}
                              style={{ width: "5%" }}
                            />
                            <Column
                              field="id"
                              header=""
                              style={{ width: "20%" }}
                            ></Column>
                            <Column
                              header="NAME"
                              style={{ width: "20%" }}
                              body={(rowData) => rowData?.model?.name}
                            ></Column>
                            <Column
                              field="date"
                              header="ITEM NO."
                              style={{ width: "20%" }}
                              body={(rowData) => rowData?.model?.itemCode}
                            ></Column>
                            <Column
                              field="subParty"
                              header="SUB-PARTY"
                              style={{ width: "20%" }}
                              body={(rowData) => rowData?.model?.subParty?.name}
                            ></Column>
                            <Column
                              field="listPrice"
                              header="LIST PRICE"
                              style={{ width: "20%" }}
                              body={(rowData) =>
                                "₹" + rowData?.model?.listPrice
                              }
                            ></Column>
                            <Column
                              field="discount"
                              header="DISCOUNT"
                              style={{ width: "10%" }}
                              body={(rowData) => rowData?.model?.discount + "%"}
                            ></Column>
                            <Column
                              field="netPrice"
                              header="NET PRICE"
                              style={{ width: "25%" }}
                              body={(rowData) =>
                                "₹" +
                                (
                                  (rowData?.model?.listPrice *
                                    rowData?.model?.discount) /
                                  100
                                ).toFixed(2)
                              }
                            ></Column>
                            <Column
                              field="reqPrice"
                              header="REQ. PRICE"
                              style={{ width: "25%" }}
                              body={(rowData) => "₹" + rowData?.requestPrice}
                            ></Column>
                            <Column
                              field="reqDiscount"
                              header="REQ DISCOUNT"
                              style={{ width: "25%" }}
                              body={(rowData) => rowData?.requestDiscount + "%"}
                            ></Column>
                            <Column
                              field="qty"
                              header="QTY"
                              style={{ width: "25%" }}
                              body={(rowData) => rowData?.requestQuantity}
                            ></Column>
                            <Column
                              field="reasons"
                              header="Reasons"
                              style={{ width: "25%" }}
                            ></Column>
                            <Column
                              field="stockQTY"
                              header="STOCK QTY"
                              style={{ width: "25%" }}
                              body={(rowData) => rowData?.model?.quantity}
                            ></Column>
                            <Column
                              field="status"
                              header="Status"
                              body={(rowData) =>
                                statusBodyTemplate(rowData)
                              }
                              style={{ width: "25%" }}
                            ></Column>
                            <Column
                              field="action"
                              header={
                                <div
                                  className="d-flex align-items-center justify-content-center"
                                  style={{
                                    backgroundColor: "#FDECEA",
                                    height: "30px",
                                    width: "30px",
                                  }}
                                >
                                  <i
                                    className="fa fa-trash"
                                    style={{
                                      color: "#DC3545",
                                      fontSize: "12px",
                                    }}
                                  ></i>
                                </div>
                              } // Using PrimeIcons
                              body={(rowData) => actionBodyTemplate(rowData)}
                              style={{ width: "25%" }}
                            ></Column>
                          </DataTable>{" "}
                        </Card.Body>
                      </Card>
                    </div>
                  )}
                  {(editMode ||
                    showAddItemForm ||
                    ModalInfoList?.length === 0) && (
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
                                value={
                                  selectedModalDetail?.discount
                                    ? selectedModalDetail?.discount
                                    : 0
                                }
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
                                placeholder="Net Price"
                                disabled
                                value={
                                  (selectedModalDetail?.listPrice *
                                    selectedModalDetail?.discount) /
                                    100 || 0
                                }
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
                                value={
                                  selectedModalDetail?.quantity
                                    ? selectedModalDetail?.quantity
                                    : 0
                                }
                              />
                            </Form.Group>
                          </Row>
                        </>
                      )}
                      {selectedModal && (
                        <>
                          <Row className="mb-3">
                            <Form.Group
                              as={Col}
                              xs={12}
                              controlId="formReasons"
                            >
                              <Form.Label>Reasons</Form.Label>
                              <Form.Control as="select">
                                <option>Select Reasons</option>
                                <option value="reason 1">Reason 1</option>
                                <option value="reason 2">Reason 2</option>
                                <option value="reason 3">Reason 3</option>
                              </Form.Control>
                            </Form.Group>
                          </Row>

                          <Row className="mb-1">
                            <Col
                              className="d-flex justify-content-start"
                              xs={12}
                            >
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
                                {errorMessage && (
                                  <div className="text-danger">
                                    {errorMessage}
                                  </div>
                                )}
                              </div>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Form>
                  )}
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
                              setRole("PC");
                              setSelectUserModal(true);
                            }}
                          >
                            Select Users
                          </button>
                        </div>
                      </Col>
                    </Row>
                    <Row className="">
                      {!pricingUser?._id && (
                        <div className="text-center">No User Selected</div>
                      )}
                      {pricingUser?._id && (
                        <Col key={pricingUser.id} xs={12} md={6} lg={6}>
                          <Card className="d-flex flex-row align-items-center mb-3">
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
                                {pricingUser?.username}
                              </span>
                              <span className="mb-0 nameUserSub">
                                {pricingUser?.email}
                              </span>
                            </Card.Body>
                            <button
                              className={"closebtn"}
                              onClick={() => {
                                setPricingUser(null);
                              }}
                            >
                              <i className={"fa fa-xmark"}></i>
                            </button>
                          </Card>
                        </Col>
                      )}
                    </Row>
                  </Card>
                </Col>
                <Col>
                  <Card className="p-3">
                    <Row className="my-4">
                      <Col className="d-flex justify-content-between align-items-center ">
                        <h5>Finance & Accounts</h5>
                        <div
                          className="btn-wrapper"
                          style={{ display: "inline-block" }}
                        >
                          <button
                            className="btn btnSelect"
                            onClick={(e) => {
                              e.preventDefault();
                              setRole("CO");
                              setSelectUserModal(true);
                            }}
                          >
                            Select Users
                          </button>
                        </div>
                      </Col>
                    </Row>
                    <Row className="">
                      {!complianceUser?._id && (
                        <div className="text-center">No User Selected</div>
                      )}

                      {complianceUser?._id && (
                        <Col key={complianceUser.id} xs={12} md={6} lg={6}>
                          <Card className="d-flex flex-row align-items-center mb-3">
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
                                {complianceUser?.username}
                              </span>
                              <span className="mb-0 nameUserSub">
                                {complianceUser?.email}
                              </span>
                            </Card.Body>
                            <button
                              className={"closebtn"}
                              onClick={() => {
                                setComplianceUser(null);
                              }}
                            >
                              <i className={"fa fa-xmark"}></i>
                            </button>
                          </Card>
                        </Col>
                      )}
                    </Row>
                  </Card>
                </Col>
              </Row>
            )}
            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}

            <div className="d-flex justify-content-end mt-2">
              <button className="btnscndry">Cancel</button>
              <button
                className="btnprm"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmitRequest(); // Call the function to submit the request
                }}
                disabled={modalInfoLoading}
              >
                {modalInfoLoading ? "Processing..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </Layout>
      <CheckSalesModal
        show={checkSalesModal}
        onHide={() => setCheckSalesModal(false)}
        selectedModal={selectedModalDetail.itemCode}
      />

      <SelectUserModal
        role={role}
        pricingUser={pricingUser}
        complianceUser={complianceUser}
        setPricingUser={setPricingUser}
        setComplianceUser={setComplianceUser}
        show={selectUserModal}
        onHide={() => {
          setSelectUserModal(false);
        }}
      />
    </>
  );
}

export default AddItem;

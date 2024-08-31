import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Badge, Form } from "react-bootstrap";
import "../../../assets/css/stage.css";
import Layout from "../../Layout/Layout";
import "../../../assets/css/pricingCO.css";
import { get , getAuthConfig} from "../../../libs/http-hydrate";

const PricingCo = ({ status }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await get('/api/request/pc/requests-list', {
          params: {
            status:status,
            search,
          },
          ...getAuthConfig(),
        });

        setCustomers(response.data.requests);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search,status
  ]);

  return (
    <Layout>
            <div className="p-2 p-md-5 p-sm-3">

         <div className="d-flex justify-content-between align-items-center mb-3 w-100">
          <h1 className="mb-0 w-25" style={{ textAlign: "left" }}>
            Pricing Coordinator
          </h1>
          <div className="btn-wrapper w-50" style={{ display: "inline-block" }}>
            <div className="form align-items-center d-flex">
              <i className="fa fa-search" style={{ top: "13px" }}></i>
              <input
                type="text"
                className="form-control form-input"
                style={{ fontSize: "0.75rem", height: "40px" }}
                placeholder="Search Name or Type .... "
              />
            </div>
          </div>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-danger">Error: {error}</p>
        ) : (
      <div className="credit-card-container  pricingCO">
{customers?.length <=0 && <div className="text-center"> No Records Found</div>}
{ customers?.length > 0 && customers.map(customer => (
        <Card className="credit-card mb-4">
          <div className="credit-card-header">
            <h5>{customer?.party?.name} ( {customer?.subParty?.name} )</h5> &nbsp;| &nbsp;
            <p>{customer?.party?.name} </p>
          </div>
          <div className="credit-card-body row">
            <div className="col-md-12 col-lg-6 col-sm-12">
            <div className="credit-card-details ">
              <Row>
                <Col lg="2" md="6" sm="12" xs="12">
                  <p>
                    <span className="nameUser">City </span> <br />{" "}
                    <span className="nameUserSub">Ahmed...</span>
                  </p>{" "}
                </Col>
                <Col lg="2" md="6" sm="12" xs="12">
                  {" "}
                  <p>
                    <span className="nameUser">Credit Days</span> <br />{" "}
                    <span className="nameUserSub"> 15</span>{" "}
                  </p>{" "}
                </Col>
                <Col lg="3" md="6" sm="12" xs="12">
                  {" "}
                  <p>
                    <span className="nameUser">Credit Limit</span> <br />{" "}
                    <span className="nameUserSub"> 15,000 </span>{" "}
                  </p>{" "}
                </Col>
                <Col lg="2" md="6" sm="12" xs="12">
                  {" "}
                  <p>
                    <span className="nameUser"> Total Debit </span> <br />{" "}
                    <span className="nameUserSub"> 15,000 </span>
                  </p>{" "}
                </Col>
                <Col lg="3" md="6" sm="12" xs="12">
                  {" "}
                  <p>
                    <span className="nameUser">Total Credit </span>
                    <br /> <span className="nameUserSub"> 20,200 </span>
                  </p>{" "}
                </Col>
              </Row>
              <Row>
                <Col lg="2" md="6" sm="12" xs="12">
                  <p>
                    <span className="nameUser">Total Overdue </span> <br />
                    <span className="nameUserSub"> 12,020 </span>
                  </p>{" "}
                </Col>
                <Col lg="2" md="6" sm="12" xs="12">
                  {" "}
                  <p>
                    {" "}
                    <span className="nameUser">Lock Party</span> <br />{" "}
                    <span className="text-danger">Yes</span>
                  </p>{" "}
                </Col>
                <Col lg="3" md="6" sm="12" xs="12">
                  {" "}
                  <p>
                    <span className="nameUser">Days</span> <br />
                    <span className="nameUserSub"> 12,020 </span>
                  </p>{" "}
                </Col>
                <Col lg="2" md="6" sm="12" xs="12">
                  {" "}
                  <p>
                    <span className="nameUser">Reason User </span> <br />{" "}
                    <span className="nameUserSub">16 </span>
                  </p>
                </Col>
              </Row>
            </div></div>
            <div className="col-md-12 col-lg-2 col-sm-12">
                <div className="bgscrn p-2">
                <Form.Group
                      controlId="formPartyName"
                    >
                      <Form.Label>Min-Rate </Form.Label>
                      <Form.Control type="text" placeholder="$12000" />
                    </Form.Group>
                </div>
                <div className="d-flex justify-content-center">
                  <button className="btn mrdetailsbtn w-75">More Details</button>
                </div>
            </div>
            <div className=" col-md-12 col-lg-3 col-sm-12">
            <div className="bgscrn p-2">
                <Form.Group
                      controlId="formPartyName"
                    >
                      <Form.Label>Reasons  </Form.Label>
                      <Form.Control type="text" placeholder="$12000" />
                    </Form.Group>
                </div>
                <div className=" p-2 d-flex" style={{overflowX:"scroll"}}>

                <button className="btnreason mx-1 d-flex justify-content-between">Reason <span className="closebtn"><i className='fa fa-xmark'></i></span> </button>
                <button className="btnreason mx-1  d-flex justify-content-between">Reason <span className="closebtn"><i className='fa fa-xmark'></i></span> </button>
                <button className="btnreason mx-1  d-flex justify-content-between">Reason <span className="closebtn"><i className='fa fa-xmark'></i></span> </button>

                </div>
             </div>
             <div className="col-md-12 col-lg-1 col-sm-12">
            <div className="credit-card-actions ">
              <button className="w-100 btn btn-primary">✓</button>
              <button className="w-100 btn btn-heighlights"><svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 16.9428V18.3171H6.93945L4.67285 20.5826L5.63965 21.5489L9.56055 17.63L5.63965 13.711L4.67285 14.6773L6.93945 16.9428H0ZM8.12109 12.2938L9.06641 13.2923C9.70378 12.691 10.4235 12.2329 11.2256 11.918C12.0277 11.6031 12.8691 11.4456 13.75 11.4456C14.3802 11.4456 14.9889 11.5279 15.5762 11.6925C16.1634 11.8572 16.7113 12.0862 17.2197 12.3797C17.7282 12.6731 18.1901 13.031 18.6055 13.4534C19.0208 13.8757 19.3789 14.3409 19.6797 14.8491C19.9805 15.3573 20.2132 15.9049 20.3779 16.4919C20.5426 17.0788 20.625 17.6872 20.625 18.3171H22C22 17.4796 21.8747 16.6601 21.624 15.8584C21.3734 15.0567 21.0117 14.3159 20.5391 13.6359C20.0664 12.9559 19.5042 12.351 18.8525 11.8214C18.2008 11.2917 17.474 10.8873 16.6719 10.6081C17.0729 10.3504 17.431 10.0534 17.7461 9.71696C18.0612 9.38054 18.3333 9.01191 18.5625 8.61107C18.7917 8.21023 18.96 7.78792 19.0674 7.34413C19.1748 6.90035 19.2357 6.43509 19.25 5.94835C19.25 5.18962 19.1068 4.47742 18.8203 3.81174C18.5339 3.14606 18.1436 2.56269 17.6494 2.06164C17.1553 1.56059 16.5716 1.16691 15.8984 0.880597C15.2253 0.594283 14.5091 0.451126 13.75 0.451126C12.9909 0.451126 12.2783 0.594283 11.6123 0.880597C10.9463 1.16691 10.3626 1.55701 9.86133 2.0509C9.36003 2.5448 8.96615 3.12816 8.67969 3.801C8.39323 4.47384 8.25 5.18962 8.25 5.94835C8.25 6.92898 8.47559 7.81655 8.92676 8.61107C9.37793 9.40559 10.0117 10.0713 10.8281 10.6081C10.3268 10.7942 9.85059 11.0304 9.39941 11.3167C8.94824 11.6031 8.52214 11.9287 8.12109 12.2938ZM17.875 5.94835C17.875 6.52098 17.7676 7.05424 17.5527 7.54813C17.3379 8.04202 17.0443 8.47865 16.6719 8.85802C16.2995 9.23738 15.8626 9.53443 15.3613 9.74917C14.86 9.9639 14.3229 10.0713 13.75 10.0713C13.1842 10.0713 12.6507 9.9639 12.1494 9.74917C11.6481 9.53443 11.2113 9.24096 10.8389 8.86875C10.4665 8.49655 10.1693 8.05992 9.94727 7.55887C9.72526 7.05782 9.61784 6.52098 9.625 5.94835C9.625 5.38288 9.73242 4.84962 9.94727 4.34857C10.1621 3.84752 10.4557 3.4109 10.8281 3.03869C11.2005 2.66648 11.641 2.36943 12.1494 2.14754C12.6579 1.92564 13.1914 1.81827 13.75 1.82543C14.3229 1.82543 14.8564 1.9328 15.3506 2.14754C15.8447 2.36227 16.2816 2.65574 16.6611 3.02795C17.0407 3.40016 17.3379 3.84037 17.5527 4.34857C17.7676 4.85678 17.875 5.39004 17.875 5.94835Z" fill="#025FE0"/>
</svg>
</button>
              <button className="w-100 btn btn-secondary">✕</button>
            </div></div>
          </div>
        </Card> 
))}
      </div>)}
      </div>
    </Layout>
  );
};

export default PricingCo;

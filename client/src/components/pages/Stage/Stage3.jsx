import React from 'react';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import "../../../assets/css/stage.css"
import Layout from '../../Layout/Layout';
const Stage3 = () => {
  return (
    <Layout>
    <div className="credit-card-container p-3">
      <Card className="credit-card">
        <div className="credit-card-header">
            <h5>Saathi UIUX Design Company</h5> &nbsp;| &nbsp;
            <p>Designer</p>
        </div>
        <div className="credit-card-body row">
          <div className="credit-card-details col-md-8 col-lg-8 col-sm-12">
            <Row>
              <Col lg="2"  md="6" sm="12" xs="12">
                <p><span className='nameUser'>City </span> <br /> <span className='nameUserSub'>Ahmed...</span></p> </Col>
                <Col lg="2" md="6" sm="12" xs="12">   <p><span className='nameUser'>Credit  Days</span > <br /> <span className='nameUserSub'> 15</span> </p> </Col>
                <Col  lg="3" md="6" sm="12" xs="12">   <p><span className='nameUser'>Credit Limit</span> <br /> <span className='nameUserSub'>  15,000 </span> </p> </Col>
                <Col lg="2" md="6" sm="12" xs="12">  <p><span className='nameUser'> Total Debit  </span> <br /> <span className='nameUserSub'>  15,000 </span></p> </Col>
                <Col lg="3" md="6" sm="12" xs="12">    <p><span className='nameUser'>Total Credit </span><br /> <span className='nameUserSub'>  20,200 </span></p> </Col>
             </Row>
                <Row>

              <Col lg="2" md="6" sm="12" xs="12">
               <p><span className='nameUser'>Total Overdue </span> <br /><span className='nameUserSub'>  12,020 </span></p> </Col>
                <Col lg="2" md="6" sm="12" xs="12">   <p> <span className='nameUser'>Lock Party</span> <br /> <span className="text-danger">Yes</span></p> </Col>
                <Col lg="3" md="6" sm="12" xs="12">  <p><span className='nameUser'>Days</span> <br /><span className='nameUserSub'> 12,020 </span></p> </Col>
                <Col lg="2"  md="6" sm="12" xs="12">  <p><span className='nameUser'>Reason User </span> <br /> <span className='nameUserSub'>16 </span></p>
              </Col>
            </Row>
          </div>
          <div className="credit-card-status col-md-4 col-lg-2 col-sm-12">
            <Card>
                <Card.Header className='bg-white'>
            <h6><i className="fa fa-info-circle"></i> Details</h6>                 </Card.Header>
        <Card.Body>
            <Row className='g-1' >
              <Col  md="6" lg="6" sm="12">
                <div className='COPO'>
                <h6 className='d-flex justify-content-between'> <span className='prmclor'>CO </span> <Badge bg="danger">Review Required</Badge></h6>
                <button className='btnreason Satgebtnreason'>Reasons</button>
                <button className='btnreason Satgebtnreason'>Reasons</button>
                <button className='btnreason Satgebtnreason'>Reasons</button>
                </div>
              </Col>
              <Col   md="6" lg="6" sm="12">
              <div className='COPO'>

                <h6 className='d-flex justify-content-between'><span className='prmclor'>PC </span><Badge bg="success">Approved</Badge></h6>
                <button className='btnreason Satgebtnreason '>Reasons</button>
                <button className='btnreason Satgebtnreason'>Reasons</button>
                <button className='btnreason Satgebtnreason'>Reasons</button>
                </div>
              </Col>
            </Row>
            </Card.Body>
            </Card>
          </div>
          <div className="credit-card-actions col-md-12 col-lg-2 col-sm-12">
          <button className='w-100 btn btn-primary'>✓</button>
          <button  className='w-100 btn btn-secondary'>✕</button>
        </div>
        </div>
     
      </Card>
    </div>
    </Layout>
  );
};

export default Stage3;

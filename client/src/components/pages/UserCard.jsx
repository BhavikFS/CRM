import React from 'react';
import { Card, Button } from 'react-bootstrap';
import profile from "../../assets/images/Avatar.png";

const UserCard = ({ name, email, onRemove, icon }) => {
  return (
    <Card className="d-flex flex-row align-items-center mb-3">
      <Card.Img variant="left" src={profile} style={{ width: '40px', height: '40px', borderRadius: '50%',marginLeft:"5px" }} />
      <Card.Body className="d-flex flex-column align-items-start">
        <span className="mb-0 nameUser">{name}</span>
        <span className="mb-0 nameUserSub">{email}</span>
      </Card.Body>
        <button className='closebtn'>
          {icon ?  <i className='fa fa-check'></i> :<i className='fa fa-xmark'></i>}
        </button>

        {/* <button className='closebtnSelected'>
          {icon ?  <i className='fa fa-check' style={{color:"white"}}></i> :<i className='fa fa-xmark'></i>}
        </button> */}
    </Card>
  );
};

export default UserCard;

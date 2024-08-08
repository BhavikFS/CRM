import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import UserCard from './UserCard'; // Assuming the UserCard component is in the same directory

const users = [
  { id: 1, name: 'Saathi G.', email: 'abc@gmail.com' },
  { id: 2, name: 'Saathi G.', email: 'abc@gmail.com' },
  { id: 3, name: 'Saathi G.', email: 'abc@gmail.com' },
  { id: 4, name: 'Saathi G.', email: 'abc@gmail.com' },
  { id: 5, name: 'Saathi G.', email: 'abc@gmail.com' }
];

const PricingCoordinator = () => {
  const handleRemove = (id) => {
    console.log(`Remove user with id: ${id}`);
  };

  return (
    <Container>
      <Row className="my-4">
        <Col className="d-flex justify-content-between align-items-center">
          <h2>Pricing Coordinator</h2>
          <Button variant="primary">Select Users</Button>
        </Col>
      </Row>
      <Row>
        {users.map(user => (
          <Col key={user.id} xs={12} md={6} lg={4}>
            <UserCard 
              name={user.name}
              email={user.email}
              onRemove={() => handleRemove(user.id)}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PricingCoordinator;

/* client/src/pages/HomePage.js */
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

/**
 * Placeholder component for the application's home page.
 */
const HomePage = () => {
  return (
    <Container>
      <Row className="justify-content-md-center text-center mt-5">
        <Col md={8}>
          <h1>Welcome to BloodBank Connect</h1>
          <p className="mt-3">
            Connecting donors, recipients, and hospitals to save lives. Find donation centers, request blood, or manage inventory efficiently.
          </p>
          <div className="mt-4">
            {/* Example Buttons linking to Login/Register */}
            <LinkContainer to="/register" className="m-2">
              <Button variant="success" size="lg">Register Now</Button>
            </LinkContainer>
            <LinkContainer to="/login" className="m-2">
              <Button variant="primary" size="lg">Login</Button>
            </LinkContainer>
            {/* Add more content or components here as needed for the homepage */}
            {/* e.g., Search for donation centers, view available blood types summary */}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;

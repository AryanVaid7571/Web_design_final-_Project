/* client/src/components/Footer.js */
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap'; // Import Bootstrap components

/**
 * A simple footer component for the application.
 * Displays copyright information centered at the bottom of the page.
 */
const Footer = () => {
  return (
    <footer> {/* HTML5 footer semantic tag */}
      <Container>
        <Row>
          {/* Center column content using text-center */}
          <Col className="text-center py-3">
            {/* Display current year dynamically */}
            Copyright &copy; {new Date().getFullYear()} BloodBank Connect
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;

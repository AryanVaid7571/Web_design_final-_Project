import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { getMyDonations } from '../features/donations/donationSlice';

const MyDonations = () => {
  const dispatch = useDispatch();
  const { myDonations, isLoading, isError, message } = useSelector(
    (state) => state.donations
  );

  useEffect(() => {
    dispatch(getMyDonations());
  }, [dispatch]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container className="mt-4">
        <div className="alert alert-danger" role="alert">
          {message}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="text-center mb-4">My Donations</h2>
      {myDonations.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <Card.Text>You haven't made any donations yet.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {myDonations.map((donation) => (
            <Col key={donation._id} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>
                    Blood Type: {donation.bloodType}
                    <Badge
                      bg={getStatusBadgeVariant(donation.status)}
                      className="float-end"
                    >
                      {donation.status}
                    </Badge>
                  </Card.Title>
                  <Card.Text>
                    <strong>Scheduled Date:</strong>{' '}
                    {new Date(donation.scheduledDate).toLocaleDateString()}
                    <br />
                    {donation.completedDate && (
                      <>
                        <strong>Completed Date:</strong>{' '}
                        {new Date(donation.completedDate).toLocaleDateString()}
                        <br />
                      </>
                    )}
                    {donation.notes && (
                      <>
                        <strong>Notes:</strong> {donation.notes}
                      </>
                    )}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">
                  Created: {new Date(donation.createdAt).toLocaleDateString()}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyDonations;

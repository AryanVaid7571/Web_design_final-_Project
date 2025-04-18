import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Table, Badge, Spinner } from 'react-bootstrap';
import { getMyDonations } from '../features/donations/donationSlice';

const MyDonationsPage = () => {
  const dispatch = useDispatch();
  const { myDonations, isLoading } = useSelector((state) => state.donations);

  useEffect(() => {
    dispatch(getMyDonations());
  }, [dispatch]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Pending':
        return 'badge-pending';
      case 'Completed':
        return 'badge-completed';
      case 'Cancelled':
        return 'badge-cancelled';
      default:
        return 'badge-pending';
    }
  };

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container>
      <div className="page-header">
        <h1>My Donations</h1>
        <p>View and track your blood donation history</p>
      </div>

      <Row>
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h2 className="h5 mb-0">Donation History</h2>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-container">
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Blood Type</th>
                      <th>Status</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myDonations.length > 0 ? (
                      myDonations.map((donation) => (
                        <tr key={donation._id}>
                          <td>{new Date(donation.scheduledDate).toLocaleDateString()}</td>
                          <td>{donation.bloodType}</td>
                          <td>
                            <Badge className={getStatusBadgeVariant(donation.status)}>
                              {donation.status}
                            </Badge>
                          </td>
                          <td>{donation.notes || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No donations found. Schedule your first donation today!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyDonationsPage;

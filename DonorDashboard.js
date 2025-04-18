import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Table, Badge, Spinner } from 'react-bootstrap';
import { getMyDonations } from '../features/donations/donationSlice';

/**
 * Donor Dashboard component.
 * Fetches and displays the logged-in donor's donation history.
 * Provides a link/button to schedule a new donation.
 */
const DonorDashboard = () => {
  const dispatch = useDispatch();

  // Select user info from auth slice to ensure user is logged in
  const { user } = useSelector((state) => state.auth);

  // Select the relevant state from the donations slice
  const { myDonations, isLoading } = useSelector(
    (state) => state.donations // Ensure 'donations' matches the key in store.js
  );

  // useEffect hook to fetch donations when the component mounts
  useEffect(() => {
    // Only fetch if user is logged in (should be guaranteed by PrivateRoute, but good check)
    if (user) {
      dispatch(getMyDonations());
    }
  }, [dispatch, user]); // Dependency array

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
        <h1>Donor Dashboard</h1>
        <p>Welcome back, {user.name}!</p>
      </div>

      <Row className="mb-4">
        <Col md={4}>
          <div className="stats-card">
            <h3>{myDonations.length}</h3>
            <p>Total Donations</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="stats-card">
            <h3>{myDonations.filter(d => d.status === 'Completed').length}</h3>
            <p>Completed Donations</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="stats-card">
            <h3>{myDonations.filter(d => d.status === 'Pending').length}</h3>
            <p>Pending Donations</p>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="dashboard-card">
            <Card.Header>
              <h2 className="h5 mb-0">Recent Donations</h2>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-container">
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Blood Type</th>
                      <th>Status</th>
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
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center">
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

export default DonorDashboard;

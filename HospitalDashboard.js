/* client/src/pages/HospitalDashboard.js */
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Spinner, Alert, Button, Form, Modal, Nav, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import actions
import { getAllDonations, updateDonationStatus } from '../features/donations/donationSlice';
import { getAllRequests, updateRequestStatus } from '../features/requests/requestSlice';

const HospitalDashboard = () => {
  console.log('Rendering HospitalDashboard');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get state from Redux store
  const { allDonations, isLoading: donationsLoading, isError: donationsError, message: donationsMessage } = useSelector((state) => state.donations);
  const { requests, isLoading: requestsLoading, isError: requestsError, message: requestsMessage } = useSelector((state) => state.requests);
  const { user } = useSelector((state) => state.auth);

  // Local state
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [activeTab, setActiveTab] = useState('donations');

  // Fetch data on component mount
  useEffect(() => {
    console.log('HospitalDashboard useEffect running, user:', user);
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'hospital_staff') {
      navigate('/login');
      return;
    }

    console.log('Dispatching getAllDonations and getAllRequests');
    dispatch(getAllDonations());
    dispatch(getAllRequests());
  }, [dispatch, user, navigate]);

  // Log state changes
  useEffect(() => {
    console.log('Donations state:', { allDonations, donationsLoading, donationsError, donationsMessage });
    console.log('Requests state:', { requests, requestsLoading, requestsError, requestsMessage });
  }, [allDonations, donationsLoading, donationsError, donationsMessage, requests, requestsLoading, requestsError, requestsMessage]);

  // Handle donation status update
  const handleDonationUpdate = () => {
    if (selectedDonation && newStatus) {
      dispatch(updateDonationStatus({
        donationId: selectedDonation._id,
        updateData: { status: newStatus }
      }));
      setShowDonationModal(false);
    }
  };

  // Handle request status update
  const handleRequestUpdate = () => {
    if (selectedRequest && newStatus) {
      dispatch(updateRequestStatus({
        requestId: selectedRequest._id,
        status: newStatus
      }));
      setShowRequestModal(false);
    }
  };

  // Render donations table
  const renderDonationsTable = () => (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Date</th>
          <th>Donor</th>
          <th>Blood Type</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {allDonations && allDonations.length > 0 ? (
          allDonations.map((donation) => (
            <tr key={donation._id}>
              <td>{new Date(donation.scheduledDate).toLocaleDateString()}</td>
              <td>{donation.donor?.name || 'N/A'}</td>
              <td>{donation.bloodType}</td>
              <td>
                <span className={`badge bg-${
                  donation.status === 'Pending' ? 'warning' :
                  donation.status === 'Completed' ? 'success' :
                  donation.status === 'Cancelled' ? 'danger' : 'info'
                }`}>
                  {donation.status}
                </span>
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedDonation(donation);
                    setNewStatus(donation.status);
                    setShowDonationModal(true);
                  }}
                >
                  Update Status
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">No donations found</td>
          </tr>
        )}
      </tbody>
    </Table>
  );

  // Render blood requests table
  const renderRequestsTable = () => (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Date</th>
          <th>Recipient</th>
          <th>Blood Type</th>
          <th>Quantity</th>
          <th>Urgency</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {requests && requests.length > 0 ? (
          requests.map((request) => (
            <tr key={request._id}>
              <td>{new Date(request.createdAt).toLocaleDateString()}</td>
              <td>{request.recipient?.name || 'N/A'}</td>
              <td>{request.bloodType}</td>
              <td>{request.quantity} units</td>
              <td>
                <span className={`badge bg-${
                  request.urgency === 'Critical' ? 'danger' :
                  request.urgency === 'High' ? 'warning' :
                  request.urgency === 'Medium' ? 'info' : 'success'
                }`}>
                  {request.urgency}
                </span>
              </td>
              <td>
                <span className={`badge bg-${
                  request.status === 'Pending' ? 'warning' :
                  request.status === 'Approved' ? 'info' :
                  request.status === 'Fulfilled' ? 'success' : 'danger'
                }`}>
                  {request.status}
                </span>
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(request);
                    setNewStatus(request.status);
                    setShowRequestModal(true);
                  }}
                >
                  Update Status
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center">No requests found</td>
          </tr>
        )}
      </tbody>
    </Table>
  );

  if (donationsLoading || requestsLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mb-4">Hospital Staff Dashboard</h2>

      {(donationsError || requestsError) && (
        <Alert variant="danger" className="mb-4">
          {donationsMessage || requestsMessage}
        </Alert>
      )}

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="donations">Manage Donations</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="requests">Blood Requests</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="donations">
            {renderDonationsTable()}
          </Tab.Pane>
          <Tab.Pane eventKey="requests">
            {renderRequestsTable()}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Donation Status Modal */}
      <Modal show={showDonationModal} onHide={() => setShowDonationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Donation Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDonationModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDonationUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Request Status Modal */}
      <Modal show={showRequestModal} onHide={() => setShowRequestModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Request Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Fulfilled">Fulfilled</option>
                <option value="Rejected">Rejected</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRequestModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRequestUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HospitalDashboard;

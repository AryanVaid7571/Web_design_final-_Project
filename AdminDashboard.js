/* client/src/pages/AdminDashboard.js */
import React, { useEffect } from 'react';
import { Container, Table, Spinner, Alert, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

// Import the action to fetch users from the userList slice
import { fetchUsers, resetUserListState } from '../features/admin/userListSlice';

/**
 * Admin Dashboard component.
 * Fetches and displays a list of all users.
 * Requires admin privileges (handled by routing/PrivateRoute).
 */
const AdminDashboard = () => {
  const dispatch = useDispatch();

  // Select the relevant state from the userList slice in the Redux store
  const { users, isLoading, isError, message } = useSelector(
    (state) => state.userList // Make sure 'userList' matches the key in store.js
  );

  // Select authentication state to ensure user is admin (optional check within component)
  const { user: loggedInUser } = useSelector((state) => state.auth);

  // useEffect hook to dispatch the fetchUsers action when the component mounts
  useEffect(() => {
    if (loggedInUser?.role === 'admin') {
      dispatch(fetchUsers());
    } else {
      console.error("Access denied: Admin privileges required.");
    }
    // Optional: Cleanup function to reset state when component unmounts
    // return () => {
    //   dispatch(resetUserListState());
    // }
  }, [dispatch, loggedInUser]); // Dependency array includes dispatch and loggedInUser

  // Handler for deleting a user (implement backend logic first)
  const deleteHandler = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // TODO: Dispatch delete user action
      console.log('Delete user:', id);
    }
  };

  return (
    <Container>
      <h1>Admin Dashboard - User List</h1>

      {isLoading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : isError ? (
        <Alert variant="danger">{message || 'Failed to load users.'}</Alert>
      ) : (
        <Table striped bordered hover responsive className="table-sm mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>PHONE</th>
              <th>CREATED AT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                  <td>{user.role}</td>
                  <td>{user.phoneNumber || 'N/A'}</td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    {/* --- CHANGE HERE: Temporarily removed icon --- */}
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-1">
                         Edit {/* Display text instead of icon for now */}
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm mx-1"
                      onClick={() => deleteHandler(user._id)}
                      disabled={loggedInUser?._id === user._id}
                    >
                      <i className="fas fa-trash"></i> {/* Delete Icon */}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No users found</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminDashboard;

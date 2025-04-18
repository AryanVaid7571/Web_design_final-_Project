/* client/src/components/Header.js */
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';

/**
 * Header component displaying the navigation bar.
 * Shows different links based on user authentication status and role.
 * Uses React-Bootstrap for styling and layout.
 * Integrates with Redux for user state and logout action.
 */
const Header = () => {
  const dispatch = useDispatch(); // Hook to dispatch Redux actions
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Select the 'user' object from the 'auth' slice of the Redux state
  const { user } = useSelector((state) => state.auth);

  // Handler function for logging out the user
  const logoutHandler = () => {
    dispatch(logout()); // Dispatch the logout async thunk
    dispatch(reset()); // Dispatch the reset action to clear auth state (e.g., errors)
    navigate('/login'); // Redirect the user to the login page after logout
  };

  const handleScheduleDonation = () => {
    navigate('/donor/schedule-donation');
  };

  return (
    <header>
      {/* React-Bootstrap Navbar */}
      <Navbar bg="danger" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          {/* Brand/Logo - links to homepage */}
          <LinkContainer to="/">
            <Navbar.Brand>BloodBank Connect</Navbar.Brand>
          </LinkContainer>

          {/* Hamburger button for smaller screens */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          {/* Collapsible Navbar content */}
          <Navbar.Collapse id="basic-navbar-nav">
            {/* ms-auto aligns navigation links to the right */}
            <Nav className="ms-auto">
              {user ? (
                <>
                  {/* Admin Links */}
                  {user.role === 'admin' && (
                    <>
                      <LinkContainer to="/dashboard/admin">
                        <Nav.Link>
                          <i className="fas fa-chart-line"></i> Dashboard
                        </Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <Nav.Link>
                          <i className="fas fa-users-cog"></i> Users
                        </Nav.Link>
                      </LinkContainer>
                    </>
                  )}

                  {/* Donor Links */}
                  {user.role === 'donor' && (
                    <>
                      <LinkContainer to="/dashboard/donor">
                        <Nav.Link>
                          <i className="fas fa-hand-holding-heart"></i> Dashboard
                        </Nav.Link>
                      </LinkContainer>
                      <Nav.Link onClick={handleScheduleDonation}>
                        <i className="fas fa-plus-circle"></i> Schedule Donation
                      </Nav.Link>
                      <LinkContainer to="/donor/my-donations">
                        <Nav.Link>
                          <i className="fas fa-history"></i> My Donations
                        </Nav.Link>
                      </LinkContainer>
                    </>
                  )}

                  {/* Recipient Links */}
                  {user.role === 'recipient' && (
                    <>
                      <LinkContainer to="/dashboard/recipient">
                        <Nav.Link>
                          <i className="fas fa-user-plus"></i> Dashboard
                        </Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/recipient/create-request">
                        <Nav.Link>
                          <i className="fas fa-plus-circle"></i> Request Blood
                        </Nav.Link>
                      </LinkContainer>
                    </>
                  )}

                  {/* Hospital Staff Links */}
                  {user.role === 'hospital_staff' && (
                    <>
                      <LinkContainer to="/dashboard/hospital">
                        <Nav.Link>
                          <i className="fas fa-hospital"></i> Dashboard
                        </Nav.Link>
                      </LinkContainer>
                    </>
                  )}

                  {/* User Profile & Logout */}
                  <LinkContainer to="/profile">
                    <Nav.Link>
                      <i className="fas fa-user"></i> Profile
                    </Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={logoutHandler}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <i className="fas fa-sign-in-alt"></i> Login
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <i className="fas fa-user-plus"></i> Register
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;

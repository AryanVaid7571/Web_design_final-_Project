import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';

// Import Bootstrap and Custom CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/custom.css';

// Import Core Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Import Route Protection Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import HospitalStaffRoute from './components/HospitalStaffRoute';
import DonorRoute from './components/DonorRoute';
import RecipientRoute from './components/RecipientRoute';

// Import Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import DonorDashboard from './pages/DonorDashboard';
import RecipientDashboard from './pages/RecipientDashboard';
import CreateRequestPage from './pages/CreateRequestPage';
import ScheduleDonationPage from './pages/ScheduleDonationPage';
import MyDonationsPage from './pages/MyDonationsPage';
import UsersPage from './pages/UsersPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * The main application component.
 * Sets up the router, defines routes, and renders the overall layout.
 * Includes private routes for authenticated users.
 */
function App() {
  return (
    <Router>
      <div className="App min-vh-100 d-flex flex-column">
        <Header />
        <main className="flex-grow-1 py-4">
          <Container>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
              
              {/* Donor Routes - More specific routes first */}
              <Route path="/donor/schedule-donation" element={<DonorRoute><ScheduleDonationPage /></DonorRoute>} />
              <Route path="/donor/my-donations" element={<DonorRoute><MyDonationsPage /></DonorRoute>} />
              <Route path="/dashboard/donor" element={<DonorRoute><DonorDashboard /></DonorRoute>} />
              
              {/* Recipient Routes */}
              <Route path="/recipient/create-request" element={<RecipientRoute><CreateRequestPage /></RecipientRoute>} />
              <Route path="/dashboard/recipient" element={<RecipientRoute><RecipientDashboard /></RecipientRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin/users" element={<AdminRoute><UsersPage /></AdminRoute>} />
              <Route path="/dashboard/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              
              {/* Hospital Staff Routes */}
              <Route path="/dashboard/hospital" element={<HospitalStaffRoute><HospitalDashboard /></HospitalStaffRoute>} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

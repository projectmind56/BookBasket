import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/authentications/Login';
import Home from './components/home/Home';
import StudentRegister from './components/authentications/StudentRegister';
import DonorRegister from './components/authentications/DonorRegister';
import AdminDashboard from './components/dashboards/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import AcceptStudent from './components/admin/AcceptStudent';
import ViewReports from './components/admin/ViewReports';
import ViewDonors from './components/admin/ViewDonors';
import DonorDahsboard from './components/dashboards/DonorDahsboard';
import AddBooks from './components/donor/AddBooks';
import AddEBooks from './components/donor/AddEBooks';
import ViewOrders from './components/donor/ViewOrders';
import ViewDonorBooks from './components/donor/ViewDonorBooks';
import ViewDonorEbooks from './components/donor/ViewDonorEbooks';
import StudentDashboard from './components/dashboards/StudentDashboard';
import ViewBooks from './components/student/ViewBooks';

function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) {
    console.error('Invalid token:', e);
    return null;
  }
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={< Login />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path="/donor-register" element={<DonorRegister />} />
        <Route path="/home" element={<Home />} />

        {/* Admin protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />}>
            <Route index element={<AcceptStudent />} />
            <Route path="accept-student" element={<AcceptStudent />} />
            <Route path="view-reports" element={<ViewReports />} />
            <Route path="view-donors" element={<ViewDonors />} />
          </Route>
        </Route>

        {/* Donor protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['donor']} />}>
          <Route path="/donor-dashboard" element={<DonorDahsboard />}>
            <Route index element={<AddBooks />} />
            <Route path="add-books" element={<AddBooks />} />
            <Route path="add-e-books" element={<AddEBooks />} />
            <Route path="view-orders" element={<ViewOrders />} />
            <Route path="view-books" element={<ViewDonorBooks />} />
            <Route path="view-e-books" element={<ViewDonorEbooks />} />
          </Route>
        </Route>

        {/* Student protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student-dashboard" element={<StudentDashboard />}>
            <Route index element={<ViewBooks />} />
            <Route path="view-books" element={<ViewBooks />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
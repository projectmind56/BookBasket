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
        <Route path="/login" element={< Login/>} />
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

        {/* Staff protected routes */}
        {/* <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
          <Route path="/staff" element={<Staff />}>
            <Route index element={<AcceptHallAllocation />} />
            <Route path="accept-hall-arrangement" element={<AcceptHallAllocation />} />
            <Route path="accept-hall-re-arrangement" element={<AcceptHallReAllocation />} />
            <Route path="add-time-table" element={<AddTimeTable />} />
          </Route>
        </Route> */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
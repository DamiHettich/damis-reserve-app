import { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Calendar from './pages/client/Calendar';
import Dashboard from './pages/client/Dashboard';
import Profile from './pages/client/Profile';
import AdminCalendar from './pages/admin/Calendar';
import AdminAvailability from './pages/admin/Availability';
import AdminBookings from './pages/admin/Booking';
import Configuration from './pages/admin/Configuration';
import BookingConfirmation from './pages/client/BookingConfirmation';
import BookingSuccess from './pages/client/BookingSuccess';
import BookingFailure from './pages/client/BookingFailure';
import DashboardLayout from './components/layout/DashboardLayout';

// Protected Route wrapper component
function ProtectedRoute({ children, allowedRoles }: { children: ReactNode, allowedRoles: string[] }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/" />;
  
  return <>{children}</>;
}

export default function Router() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<DashboardLayout />}>
        {/* Protected Client Routes */}
        <Route
            path="/calendar"
            element={
              <ProtectedRoute allowedRoles={['client', 'admin']}>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/confirm"
            element={
              <ProtectedRoute allowedRoles={['client', 'admin']}>
                <BookingConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/success"
            element={
              <ProtectedRoute allowedRoles={['client', 'admin']}>
                <BookingSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/failure"
            element={
              <ProtectedRoute allowedRoles={['client', 'admin']}>
                <BookingFailure />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['client', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['client', 'admin']}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/calendar"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/availability"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminAvailability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/configuration"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Configuration />
              </ProtectedRoute>
            }
          />
        
      

      
      </Route>
    </Routes>
  );
}

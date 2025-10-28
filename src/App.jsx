import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Logout from './components/Logout'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ManageItems from "./pages/ManageItems";
import ViewSales from "./pages/ViewSales";
import AddItems from "./pages/AddItems";
import ViewItems from "./pages/ViewItems";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-items"
          element={
            <ProtectedRoute>
              <ManageItems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-sales"
          element={
            <ProtectedRoute>
              <ViewSales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-item"
          element={
            <ProtectedRoute>
              <AddItems />
            </ProtectedRoute>
          }
        />
        <Route
            path="/view-item"
            element={
              <ProtectedRoute>
                  <ViewItems />
              </ProtectedRoute>
            }
        />
        <Route path="/logout" element={<Logout />} />
        {/* Other routes like login will go here */}
      </Routes>
    </Router>
  );
}

export default App;

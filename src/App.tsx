import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Portal } from './Portal';
import { Admin } from './Admin';
import { Login } from './Login';
import { UploadSuccess } from './UploadSuccess';
import { CMSProvider, useCMS } from './CMSContext';
import './index.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useCMS();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <CMSProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Portal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/admin/success" element={
            <ProtectedRoute>
              <UploadSuccess />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </CMSProvider>
  );
};

export default App;

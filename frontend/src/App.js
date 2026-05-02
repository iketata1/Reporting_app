import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics';
import AdminDashboard from './pages/AdminDashboard';
import ReportList from './pages/ReportList';
import CreateMouldReport from './pages/CreateMouldReport';
import ReportDetail from './pages/ReportDetail';

function App() {
  const isAuthenticated = localStorage.getItem('token');

  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={isAuthenticated ? <Layout><AdminDashboard /></Layout> : <Navigate to="/login" />} 
            />
            <Route 
              path="/statistics" 
              element={isAuthenticated ? <Layout><Statistics /></Layout> : <Navigate to="/login" />} 
            />
            <Route 
              path="/reports" 
              element={isAuthenticated ? <Layout><ReportList /></Layout> : <Navigate to="/login" />} 
            />
            <Route 
              path="/reports/new-mould" 
              element={isAuthenticated ? <Layout><CreateMouldReport /></Layout> : <Navigate to="/login" />} 
            />
            <Route 
              path="/reports/:id" 
              element={isAuthenticated ? <Layout><ReportDetail /></Layout> : <Navigate to="/login" />} 
            />
            <Route 
              path="/reports/:id/edit" 
              element={isAuthenticated ? <Layout><CreateMouldReport /></Layout> : <Navigate to="/login" />} 
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminDashboard.css';

// API URL configuration
const API_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5002/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('overview'); // 'overview', 'users', 'reports'

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Check if user is admin
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
    }
  };

  const fetchUserReports = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/admin/users/${userId}/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserReports(response.data.reports);
      setSelectedUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user reports:', error);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.patch(
        `${API_URL}/admin/users/${userId}/status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  if (loading) {
    return <div className="admin-dashboard"><div className="loading">Loading...</div></div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🔐 Admin Dashboard</h1>
        <p>System Overview & User Management</p>
      </div>

      <div className="view-tabs">
        <button 
          className={view === 'overview' ? 'active' : ''}
          onClick={() => setView('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={view === 'users' ? 'active' : ''}
          onClick={() => setView('users')}
        >
          👥 Users
        </button>
        <button 
          className={view === 'reports' ? 'active' : ''}
          onClick={() => setView('reports')}
        >
          📋 All Reports
        </button>
      </div>

      {view === 'overview' && stats && (
        <div className="overview-section">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Total Users</h3>
                <p className="stat-value">{stats.totalUsers}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Active Users</h3>
                <p className="stat-value">{stats.activeUsers}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-content">
                <h3>Total Reports</h3>
                <p className="stat-value">{stats.totalReports}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <h3>Draft Reports</h3>
                <p className="stat-value">{stats.reportsByStatus?.draft || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'users' && (
        <div className="users-section">
          <div className="section-header">
            <h2>All Users ({users.length})</h2>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Reports</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="user-name">
                      {u.firstName} {u.lastName}
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role}`}>{u.role}</span>
                    </td>
                    <td>{u.department}</td>
                    <td className="center">
                      <button 
                        className="btn-link"
                        onClick={() => {
                          fetchUserReports(u._id);
                          setView('user-reports');
                        }}
                      >
                        {u.reportCount} reports
                      </button>
                    </td>
                    <td>
                      <span className={`status-badge ${u.isActive ? 'active' : 'inactive'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className={`btn-toggle ${u.isActive ? 'deactivate' : 'activate'}`}
                        onClick={() => toggleUserStatus(u._id, u.isActive)}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {view === 'user-reports' && selectedUser && (
        <div className="user-reports-section">
          <div className="section-header">
            <button className="btn-back" onClick={() => setView('users')}>
              ← Back to Users
            </button>
            <h2>Reports by {selectedUser.firstName} {selectedUser.lastName}</h2>
          </div>

          <div className="user-info-card">
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Department:</strong> {selectedUser.department}</p>
            <p><strong>Total Reports:</strong> {userReports.length}</p>
          </div>

          <div className="reports-table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Report Number</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {userReports.map((report) => (
                  <tr key={report._id}>
                    <td><strong>{report.reportNumber}</strong></td>
                    <td>{report.reportTitle}</td>
                    <td>{report.reportType}</td>
                    <td>{report.clientName}</td>
                    <td>{new Date(report.reportDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${report.status}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-view"
                        onClick={() => navigate(`/reports/${report._id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

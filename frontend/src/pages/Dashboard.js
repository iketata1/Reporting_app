import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import BuildingStatistics from '../components/BuildingStatistics';
import '../styles/Dashboard.css';

function Dashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    approved: 0,
    pending: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await reportAPI.getAll({ limit: 100 }); // Get more for statistics
      const reports = response.data.reports;
      
      setAllReports(reports);
      setRecentReports(reports.slice(0, 5));
      setStats({
        total: response.data.total,
        draft: reports.filter(r => r.status === 'draft').length,
        approved: reports.filter(r => r.status === 'approved').length,
        pending: reports.filter(r => r.status === 'pending-review').length
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>{t('welcome')}, {user.firstName}!</h1>
        <p>Manage your mould investigation reports</p>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{t('totalReports')}</h3>
              <p className="stat-number">{stats.total}</p>
            </div>
          </div>
          <div className="stat-card draft">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>{t('draft')}</h3>
              <p className="stat-number">{stats.draft}</p>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{t('pendingReview')}</h3>
              <p className="stat-number">{stats.pending}</p>
            </div>
          </div>
          <div className="stat-card approved">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{t('approved')}</h3>
              <p className="stat-number">{stats.approved}</p>
            </div>
          </div>
        </div>

        {/* Building Statistics Component */}
        <BuildingStatistics reports={allReports} />

        <div className="recent-reports-section">
          <div className="section-header">
            <h2>{t('recentReports')}</h2>
            <button className="btn-view-all" onClick={() => navigate('/reports')}>
              {t('viewAll') || 'View All'} →
            </button>
          </div>
          
          <div className="reports-table-container">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Report Number</th>
                  <th>Title</th>
                  <th>{t('type')}</th>
                  <th>{t('date')}</th>
                  <th>{t('status')}</th>
                  <th>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.length > 0 ? (
                  recentReports.map(report => (
                    <tr key={report._id}>
                      <td><strong>{report.reportNumber}</strong></td>
                      <td>{report.reportTitle}</td>
                      <td><span className="type-badge">{report.reportType}</span></td>
                      <td>{new Date(report.reportDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge ${report.status}`}>
                          {report.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-action"
                          onClick={() => navigate(`/reports/${report._id}`)}
                        >
                          {t('view')}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      {t('noData')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

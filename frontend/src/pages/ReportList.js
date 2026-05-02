import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportAPI } from '../services/api';
import '../styles/ReportList.css';

function ReportList() {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    reportType: '',
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await reportAPI.getAll(filters);
      setReports(response.data.reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportAPI.delete(id);
        fetchReports();
      } catch (error) {
        alert('Error deleting report');
      }
    }
  };

  return (
    <div className="report-list">
      <nav className="navbar">
        <h1>Reports</h1>
        <div className="nav-right">
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/reports/new-mould')}>New Report</button>
        </div>
      </nav>

      <div className="filters">
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending-review">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select name="reportType" value={filters.reportType} onChange={handleFilterChange}>
          <option value="">All Types</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="annual">Annual</option>
          <option value="custom">Custom</option>
        </select>

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          placeholder="Start Date"
        />

        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          placeholder="End Date"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="reports-table">
          <thead>
            <tr>
              <th>Report Number</th>
              <th>Title</th>
              <th>Type</th>
              <th>Date</th>
              <th>Author</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(report => (
              <tr key={report._id}>
                <td>{report.reportNumber}</td>
                <td>{report.reportTitle}</td>
                <td>{report.reportType}</td>
                <td>{new Date(report.reportDate).toLocaleDateString()}</td>
                <td>{report.authorName}</td>
                <td>
                  <span className={`status-badge ${report.status}`}>
                    {report.status}
                  </span>
                </td>
                <td className="actions">
                  <button onClick={() => navigate(`/reports/${report._id}`)}>View</button>
                  <button onClick={() => navigate(`/reports/${report._id}/edit`)}>Edit</button>
                  <button onClick={() => handleDelete(report._id)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ReportList;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reportAPI } from '../services/api';
import '../styles/ReportForm.css';

function ReportForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reportTitle: '',
    reportType: 'monthly',
    periodStart: '',
    periodEnd: '',
    summary: '',
    description: '',
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    budget: 0,
    performanceScore: 0,
    completionRate: 0,
    qualityScore: 0,
    projectName: '',
    projectCode: '',
    status: 'draft',
    priority: 'normal',
    visibility: 'private'
  });

  useEffect(() => {
    if (id) {
      fetchReport();
    }
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await reportAPI.getById(id);
      setFormData(response.data.report);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await reportAPI.update(id, formData);
      } else {
        await reportAPI.create(formData);
      }
      navigate('/reports');
    } catch (error) {
      alert('Error saving report: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-form-page">
      <nav className="navbar">
        <h1>{id ? 'Edit Report' : 'New Report'}</h1>
        <button onClick={() => navigate('/reports')}>Back to Reports</button>
      </nav>

      <form className="report-form" onSubmit={handleSubmit}>
        <section className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label>Report Title *</label>
            <input
              type="text"
              name="reportTitle"
              value={formData.reportTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Report Type *</label>
              <select name="reportType" value={formData.reportType} onChange={handleChange} required>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Period Start *</label>
              <input
                type="date"
                name="periodStart"
                value={formData.periodStart?.split('T')[0] || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Period End *</label>
              <input
                type="date"
                name="periodEnd"
                value={formData.periodEnd?.split('T')[0] || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Project Details</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Project Code</label>
              <input
                type="text"
                name="projectCode"
                value={formData.projectCode}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Content</h2>
          
          <div className="form-group">
            <label>Summary *</label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>
        </section>

        <section className="form-section">
          <h2>Financial Data</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Total Revenue</label>
              <input
                type="number"
                name="totalRevenue"
                value={formData.totalRevenue}
                onChange={handleChange}
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Total Expenses</label>
              <input
                type="number"
                name="totalExpenses"
                value={formData.totalExpenses}
                onChange={handleChange}
                step="0.01"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Net Profit</label>
              <input
                type="number"
                name="netProfit"
                value={formData.netProfit}
                onChange={handleChange}
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Budget</label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                step="0.01"
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Performance Metrics</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Performance Score (0-100)</label>
              <input
                type="number"
                name="performanceScore"
                value={formData.performanceScore}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label>Completion Rate (0-100)</label>
              <input
                type="number"
                name="completionRate"
                value={formData.completionRate}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label>Quality Score (0-100)</label>
              <input
                type="number"
                name="qualityScore"
                value={formData.qualityScore}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Status</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="draft">Draft</option>
                <option value="pending-review">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="form-group">
              <label>Visibility</label>
              <select name="visibility" value={formData.visibility} onChange={handleChange}>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="restricted">Restricted</option>
              </select>
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/reports')} className="cancel-btn">
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (id ? 'Update Report' : 'Create Report')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReportForm;

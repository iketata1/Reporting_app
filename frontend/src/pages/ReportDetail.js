import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reportAPI } from '../services/api';
import '../styles/ReportDetail.css';

function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await reportAPI.getById(id);
      setReport(response.data.report);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    try {
      await reportAPI.addComment(id, comment);
      setComment('');
      fetchReport();
    } catch (error) {
      alert('Error adding comment');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await reportAPI.downloadPDF(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${report.reportNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Error downloading PDF');
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await reportAPI.downloadExcel(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${report.reportNumber}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Error downloading Excel');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!report) return <div>Report not found</div>;

  return (
    <div className="report-detail">
      <nav className="navbar">
        <h1>Report Details</h1>
        <div className="nav-right">
          <button onClick={() => navigate('/reports')}>Back</button>
          <button onClick={() => navigate(`/reports/${id}/edit`)}>Edit</button>
          <button onClick={handleDownloadPDF}>Download PDF</button>
          <button onClick={handleDownloadExcel}>Download Excel</button>
        </div>
      </nav>

      <div className="report-content">
        <div className="report-header">
          <h1>{report.reportTitle}</h1>
          <span className={`status-badge ${report.status}`}>{report.status}</span>
        </div>

        <div className="report-info-grid">
          <div className="info-item">
            <label>Report Number:</label>
            <span>{report.reportNumber}</span>
          </div>
          <div className="info-item">
            <label>Report Type:</label>
            <span>{report.reportType}</span>
          </div>
          <div className="info-item">
            <label>Report Date:</label>
            <span>{new Date(report.reportDate).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <label>Period:</label>
            <span>
              {new Date(report.periodStart).toLocaleDateString()} - {new Date(report.periodEnd).toLocaleDateString()}
            </span>
          </div>
          <div className="info-item">
            <label>Author:</label>
            <span>{report.authorName}</span>
          </div>
          <div className="info-item">
            <label>Department:</label>
            <span>{report.department}</span>
          </div>
        </div>

        {report.projectName && (
          <section className="report-section">
            <h2>Project Information</h2>
            <p><strong>Project Name:</strong> {report.projectName}</p>
            {report.projectCode && <p><strong>Project Code:</strong> {report.projectCode}</p>}
          </section>
        )}

        <section className="report-section">
          <h2>Summary</h2>
          <p>{report.summary}</p>
        </section>

        <section className="report-section">
          <h2>Description</h2>
          <p>{report.description}</p>
        </section>

        {(report.totalRevenue || report.totalExpenses) && (
          <section className="report-section">
            <h2>Financial Overview</h2>
            <div className="financial-grid">
              <div className="financial-item">
                <label>Total Revenue</label>
                <span>${report.totalRevenue?.toLocaleString() || 0}</span>
              </div>
              <div className="financial-item">
                <label>Total Expenses</label>
                <span>${report.totalExpenses?.toLocaleString() || 0}</span>
              </div>
              <div className="financial-item">
                <label>Net Profit</label>
                <span>${report.netProfit?.toLocaleString() || 0}</span>
              </div>
              <div className="financial-item">
                <label>Budget</label>
                <span>${report.budget?.toLocaleString() || 0}</span>
              </div>
            </div>
          </section>
        )}

        {(report.performanceScore || report.completionRate || report.qualityScore) && (
          <section className="report-section">
            <h2>Performance Metrics</h2>
            <div className="metrics-grid">
              {report.performanceScore > 0 && (
                <div className="metric-item">
                  <label>Performance Score</label>
                  <span>{report.performanceScore}%</span>
                </div>
              )}
              {report.completionRate > 0 && (
                <div className="metric-item">
                  <label>Completion Rate</label>
                  <span>{report.completionRate}%</span>
                </div>
              )}
              {report.qualityScore > 0 && (
                <div className="metric-item">
                  <label>Quality Score</label>
                  <span>{report.qualityScore}%</span>
                </div>
              )}
            </div>
          </section>
        )}

        {report.keyFindings && report.keyFindings.length > 0 && (
          <section className="report-section">
            <h2>Key Findings</h2>
            {report.keyFindings.map((finding, index) => (
              <div key={index} className="finding-item">
                <p><strong>Finding:</strong> {finding.finding}</p>
                <p><strong>Impact:</strong> {finding.impact}</p>
                {finding.recommendation && <p><strong>Recommendation:</strong> {finding.recommendation}</p>}
              </div>
            ))}
          </section>
        )}

        <section className="report-section">
          <h2>Comments</h2>
          <div className="comments-list">
            {report.comments && report.comments.map((c, index) => (
              <div key={index} className="comment-item">
                <strong>{c.userName}</strong>
                <span className="comment-date">{new Date(c.commentDate).toLocaleString()}</span>
                <p>{c.comment}</p>
              </div>
            ))}
          </div>
          
          <div className="add-comment">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              rows="3"
            />
            <button onClick={handleAddComment}>Add Comment</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ReportDetail;

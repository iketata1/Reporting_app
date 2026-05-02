const express = require('express');
const router = express.Router();
const {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
  addComment,
  updateStatus,
  generatePDF,
  generateExcel
} = require('../controllers/reportController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth, createReport);
router.get('/', auth, getAllReports);
router.get('/:id', auth, getReportById);
router.put('/:id', auth, updateReport);
router.delete('/:id', auth, authorize('admin', 'manager'), deleteReport);
router.post('/:id/comments', auth, addComment);
router.patch('/:id/status', auth, authorize('admin', 'manager'), updateStatus);
router.get('/:id/pdf', auth, generatePDF);
router.get('/:id/excel', auth, generateExcel);

module.exports = router;

const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const {
  getDepartments,
  getServicesByDepartment,
  getServiceDetails
} = require('../controllers/servicesController');

// Get all departments
router.get('/departments', getDepartments);

// Get services by department
router.get('/departments/:departmentId/services', getServicesByDepartment);

// Get service details
router.get('/services/:serviceId', getServiceDetails);

module.exports = router;

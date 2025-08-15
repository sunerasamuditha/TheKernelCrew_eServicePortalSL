const prisma = require('../lib/prisma');

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      include: {
        services: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            code: true,
            description: true,
            fee: true,
            processingDays: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ departments });
  } catch (error) {
    console.error('Departments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Get services by department
const getServicesByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    const services = await prisma.service.findMany({
      where: {
        departmentId,
        isActive: true
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ services });
  } catch (error) {
    console.error('Services fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

// Get service details
const getServiceDetails = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true,
            description: true
          }
        }
      }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ service });
  } catch (error) {
    console.error('Service details fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch service details' });
  }
};

module.exports = {
  getDepartments,
  getServicesByDepartment,
  getServiceDetails
};

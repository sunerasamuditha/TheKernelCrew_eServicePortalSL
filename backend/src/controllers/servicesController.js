const prisma = require('../lib/prisma');

// Demo data for when database is not available
const DEMO_DEPARTMENTS = [
  {
    id: '1',
    name: 'Immigration and Emigration',
    code: 'IMM',
    description: 'Immigration and emigration services',
    isActive: true,
    services: [
      {
        id: '1',
        name: 'New ePassport Application',
        code: 'PASS_NEW',
        description: 'Apply for a new electronic passport',
        fee: 7500.00,
        processingDays: 14,
        requiredDocuments: ['Birth Certificate', 'NIC', 'Photo']
      },
      {
        id: '2',
        name: 'ePassport Renewal',
        code: 'PASS_RENEW',
        description: 'Renew your existing electronic passport',
        fee: 7500.00,
        processingDays: 10,
        requiredDocuments: ['Old Passport', 'NIC', 'Photo']
      }
    ]
  },
  {
    id: '2',
    name: 'Registrar General',
    code: 'RG',
    description: 'Civil registration services',
    isActive: true,
    services: [
      {
        id: '3',
        name: 'Birth Certificate',
        code: 'BIRTH_CERT',
        description: 'Obtain birth certificate',
        fee: 100.00,
        processingDays: 7,
        requiredDocuments: ['Application Form', 'ID Proof']
      }
    ]
  }
];

// Check if database is available
const isDatabaseAvailable = async () => {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.log('⚠️ Database not available for services, using demo data');
    return false;
  }
};

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const dbAvailable = await isDatabaseAvailable();
    
    if (dbAvailable) {
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
    } else {
      res.json({ departments: DEMO_DEPARTMENTS });
    }
  } catch (error) {
    console.error('Departments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
};

// Get services by department
const getServicesByDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const dbAvailable = await isDatabaseAvailable();
    
    if (dbAvailable) {
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
    } else {
      const department = DEMO_DEPARTMENTS.find(d => d.id === departmentId);
      const services = department ? department.services.map(service => ({
        ...service,
        department: {
          id: department.id,
          name: department.name,
          code: department.code
        }
      })) : [];
      
      res.json({ services });
    }
  } catch (error) {
    console.error('Services fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

// Get service details
const getServiceDetails = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const dbAvailable = await isDatabaseAvailable();
    
    if (dbAvailable) {
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
    } else {
      let service = null;
      for (const dept of DEMO_DEPARTMENTS) {
        const foundService = dept.services.find(s => s.id === serviceId);
        if (foundService) {
          service = {
            ...foundService,
            department: {
              id: dept.id,
              name: dept.name,
              code: dept.code,
              description: dept.description
            }
          };
          break;
        }
      }

      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      res.json({ service });
    }
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

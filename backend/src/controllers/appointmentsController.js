const prisma = require('../lib/prisma');
const notificationService = require('../services/notificationService');

// Demo appointments data
const DEMO_APPOINTMENTS = [
  {
    id: '1',
    userId: '3',
    serviceId: '1',
    appointmentNumber: 'APP2024001',
    appointmentDate: new Date('2024-09-15'),
    appointmentTime: '10:00 AM',
    officeLocation: 'Colombo Main Office',
    status: 'SCHEDULED',
    notes: 'Please bring all required documents',
    service: {
      id: '1',
      name: 'New ePassport Application',
      department: {
        id: '1',
        name: 'Immigration and Emigration'
      }
    }
  }
];

// Check if database is available
const isDatabaseAvailable = async () => {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.log('⚠️ Database not available for appointments, using demo data');
    return false;
  }
};

// Create new appointment
const createAppointment = async (req, res) => {
  try {
    const { serviceId, appointmentDate, appointmentTime, officeLocation } = req.body;
    const userId = req.user.id;
    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable) {
      // Database implementation
      const today = new Date();
      const year = today.getFullYear();
      const count = await prisma.appointment.count({
        where: {
          createdAt: {
            gte: new Date(year, 0, 1),
            lt: new Date(year + 1, 0, 1)
          }
        }
      });
      const appointmentNumber = `APP${year}${String(count + 1).padStart(6, '0')}`;

      const appointment = await prisma.appointment.create({
        data: {
          userId,
          serviceId,
          appointmentNumber,
          appointmentDate: new Date(appointmentDate),
          appointmentTime,
          officeLocation,
          status: 'SCHEDULED'
        },
        include: {
          service: {
            include: {
              department: true
            }
          }
        }
      });

      // Send confirmation notification
      if (notificationService) {
        await notificationService.sendNotification(req.user, 'appointment_confirmation', {
          service: appointment.service.name,
          date: appointmentDate,
          time: appointmentTime,
          location: officeLocation,
          reference: appointmentNumber
        });
      }

      res.status(201).json({
        message: 'Appointment created successfully',
        appointment
      });
    } else {
      // Demo implementation
      const appointmentNumber = `APP2024${String(DEMO_APPOINTMENTS.length + 1).padStart(3, '0')}`;
      
      const appointment = {
        id: String(DEMO_APPOINTMENTS.length + 1),
        userId,
        serviceId,
        appointmentNumber,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        officeLocation,
        status: 'SCHEDULED',
        notes: 'Appointment confirmed',
        service: {
          id: serviceId,
          name: 'Demo Service',
          department: {
            id: '1',
            name: 'Demo Department'
          }
        }
      };

      DEMO_APPOINTMENTS.push(appointment);

      res.status(201).json({
        message: 'Appointment created successfully (demo mode)',
        appointment
      });
    }
  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

// Get user appointments
const getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable) {
      const appointments = await prisma.appointment.findMany({
        where: { userId },
        include: {
          service: {
            include: {
              department: true
            }
          },
          documents: true,
          feedback: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ appointments });
    } else {
      const appointments = DEMO_APPOINTMENTS.filter(app => app.userId === userId);
      res.json({ appointments });
    }
  } catch (error) {
    console.error('Appointments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// Get appointment details
const getAppointmentDetails = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;
    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable) {
      const appointment = await prisma.appointment.findFirst({
        where: {
          id: appointmentId,
          userId
        },
        include: {
          service: {
            include: {
              department: true
            }
          },
          documents: true,
          feedback: true,
          statusHistory: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.json({ appointment });
    } else {
      const appointment = DEMO_APPOINTMENTS.find(app => app.id === appointmentId && app.userId === userId);
      
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      res.json({ appointment });
    }
  } catch (error) {
    console.error('Appointment details fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch appointment details' });
  }
};

// Officer: Get appointments for today
const getOfficerAppointments = async (req, res) => {
  try {
    const officerId = req.user.id;
    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable) {
      const departmentId = req.user.departmentId;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const appointments = await prisma.appointment.findMany({
        where: {
          appointmentDate: {
            gte: today,
            lt: tomorrow
          },
          service: {
            departmentId
          }
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              mobile: true,
              nic: true
            }
          },
          service: {
            include: {
              department: true
            }
          },
          documents: true
        },
        orderBy: { appointmentTime: 'asc' }
      });

      res.json({ appointments });
    } else {
      // Return demo appointments for officer
      res.json({ appointments: DEMO_APPOINTMENTS });
    }
  } catch (error) {
    console.error('Officer appointments fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// Officer: Update appointment status
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;
    const officerId = req.user.id;
    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable) {
      // Get current appointment
      const currentAppointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
          user: true,
          service: { include: { department: true } }
        }
      });

      if (!currentAppointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      // Update appointment
      const appointment = await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          status,
          notes,
          officerId
        }
      });

      // Record status history
      await prisma.appointmentStatusHistory.create({
        data: {
          appointmentId,
          previousStatus: currentAppointment.status,
          newStatus: status,
          changedBy: officerId,
          notes
        }
      });

      // Send status update notification
      if (notificationService) {
        await notificationService.sendNotification(currentAppointment.user, 'status_update', {
          service: currentAppointment.service.name,
          status: status,
          reference: currentAppointment.appointmentNumber,
          notes: notes
        });
      }

      res.json({
        message: 'Appointment status updated successfully',
        appointment
      });
    } else {
      // Demo implementation
      const appointmentIndex = DEMO_APPOINTMENTS.findIndex(app => app.id === appointmentId);
      
      if (appointmentIndex === -1) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      DEMO_APPOINTMENTS[appointmentIndex] = {
        ...DEMO_APPOINTMENTS[appointmentIndex],
        status,
        notes,
        officerId
      };

      res.json({
        message: 'Appointment status updated successfully (demo mode)',
        appointment: DEMO_APPOINTMENTS[appointmentIndex]
      });
    }
  } catch (error) {
    console.error('Appointment update error:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

// Admin: Get appointment analytics
const getAppointmentAnalytics = async (req, res) => {
  try {
    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable) {
      const { startDate, endDate } = req.query;
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      // Peak booking hours
      const hourlyBookings = await prisma.$queryRaw`
        SELECT 
          EXTRACT(hour FROM appointment_time::time) as hour,
          COUNT(*) as count
        FROM appointments 
        WHERE appointment_date BETWEEN ${start} AND ${end}
        GROUP BY EXTRACT(hour FROM appointment_time::time)
        ORDER BY hour
      `;

      // Appointments per department
      const departmentStats = await prisma.$queryRaw`
        SELECT 
          d.name as department,
          COUNT(a.id) as count
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        JOIN departments d ON s.department_id = d.id
        WHERE a.appointment_date BETWEEN ${start} AND ${end}
        GROUP BY d.id, d.name
        ORDER BY count DESC
      `;

      // Completion vs no-show rates
      const statusStats = await prisma.appointment.groupBy({
        by: ['status'],
        where: {
          appointmentDate: {
            gte: start,
            lte: end
          }
        },
        _count: true
      });

      // Average feedback ratings
      const feedbackStats = await prisma.$queryRaw`
        SELECT 
          d.name as department,
          AVG(f.rating) as avg_rating,
          COUNT(f.id) as feedback_count
        FROM feedback f
        JOIN appointments a ON f.appointment_id = a.id
        JOIN services s ON a.service_id = s.id
        JOIN departments d ON s.department_id = d.id
        WHERE a.appointment_date BETWEEN ${start} AND ${end}
        GROUP BY d.id, d.name
        HAVING COUNT(f.id) > 0
        ORDER BY avg_rating DESC
      `;

      res.json({
        analytics: {
          peakHours: hourlyBookings,
          departmentStats,
          statusStats,
          feedbackStats
        }
      });
    } else {
      // Demo analytics data
      res.json({
        analytics: {
          peakHours: [
            { hour: 9, count: 15 },
            { hour: 10, count: 25 },
            { hour: 11, count: 20 },
            { hour: 14, count: 18 },
            { hour: 15, count: 22 }
          ],
          departmentStats: [
            { department: 'Immigration and Emigration', count: 45 },
            { department: 'Registrar General', count: 23 }
          ],
          statusStats: [
            { status: 'COMPLETED', _count: 35 },
            { status: 'SCHEDULED', _count: 25 },
            { status: 'NO_SHOW', _count: 8 }
          ],
          feedbackStats: [
            { department: 'Immigration and Emigration', avg_rating: 4.2, feedback_count: 28 }
          ]
        }
      });
    }
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};

module.exports = {
  createAppointment,
  getUserAppointments,
  getAppointmentDetails,
  getOfficerAppointments,
  updateAppointmentStatus,
  getAppointmentAnalytics
};

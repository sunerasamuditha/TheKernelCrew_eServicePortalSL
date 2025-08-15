const prisma = require('../lib/prisma');

// Submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;
    const userId = req.user.id;

    // Check if appointment exists and belongs to user
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        userId,
        status: 'COMPLETED'
      }
    });

    if (!appointment) {
      return res.status(404).json({ 
        error: 'Appointment not found or not completed' 
      });
    }

    // Check if feedback already exists
    const existingFeedback = await prisma.feedback.findUnique({
      where: { appointmentId }
    });

    if (existingFeedback) {
      return res.status(400).json({ 
        error: 'Feedback already submitted for this appointment' 
      });
    }

    const feedback = await prisma.feedback.create({
      data: {
        appointmentId,
        userId,
        rating,
        comment
      },
      include: {
        appointment: {
          include: {
            service: {
              include: {
                department: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

// Get user's feedback
const getUserFeedback = async (req, res) => {
  try {
    const userId = req.user.id;

    const feedback = await prisma.feedback.findMany({
      where: { userId },
      include: {
        appointment: {
          include: {
            service: {
              include: {
                department: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ feedback });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};

// Admin: Get all feedback with analytics
const getAllFeedback = async (req, res) => {
  try {
    const { departmentId, startDate, endDate } = req.query;
    
    const where = {};
    if (departmentId) {
      where.appointment = {
        service: {
          departmentId
        }
      };
    }
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const feedback = await prisma.feedback.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true
          }
        },
        appointment: {
          include: {
            service: {
              include: {
                department: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate summary statistics
    const totalFeedback = feedback.length;
    const averageRating = totalFeedback > 0 
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / totalFeedback 
      : 0;
    
    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: feedback.filter(f => f.rating === rating).length
    }));

    res.json({
      feedback,
      summary: {
        totalFeedback,
        averageRating: Math.round(averageRating * 100) / 100,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('All feedback fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
};

module.exports = {
  submitFeedback,
  getUserFeedback,
  getAllFeedback
};

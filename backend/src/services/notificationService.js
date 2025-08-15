// Notification service for email and SMS
const notificationService = {
  // Mock email service
  sendEmail: async (to, subject, content, type = 'appointment') => {
    // In production, integrate with services like SendGrid, AWS SES, or similar
    console.log('\n=== EMAIL NOTIFICATION ===');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Type: ${type}`);
    console.log(`Content: ${content}`);
    console.log('=========================\n');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      messageId: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
  },

  // Mock SMS service
  sendSMS: async (phoneNumber, message, type = 'appointment') => {
    // In production, integrate with services like Twilio, AWS SNS, or Dialog Axiata
    console.log('\n=== SMS NOTIFICATION ===');
    console.log(`Phone: ${phoneNumber}`);
    console.log(`Type: ${type}`);
    console.log(`Message: ${message}`);
    console.log('=======================\n');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      messageId: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
  },

  // Combined notification sender
  sendNotification: async (user, type, data) => {
    const notifications = [];
    
    try {
      switch (type) {
        case 'appointment_confirmation':
          const emailResult = await notificationService.sendEmail(
            user.email,
            `Appointment Confirmation - ${data.service}`,
            `Dear ${user.fullName},\n\nYour appointment has been confirmed:\n\nService: ${data.service}\nDate: ${data.date}\nTime: ${data.time}\nLocation: ${data.location}\nReference: ${data.reference}\n\nPlease arrive 15 minutes early with required documents.\n\nThank you,\nGovernment Services Portal`,
            'appointment_confirmation'
          );
          notifications.push({ type: 'email', result: emailResult });

          if (user.phoneNumber) {
            const smsResult = await notificationService.sendSMS(
              user.phoneNumber,
              `Appointment confirmed for ${data.service} on ${data.date} at ${data.time}. Ref: ${data.reference}. Arrive 15 mins early.`,
              'appointment_confirmation'
            );
            notifications.push({ type: 'sms', result: smsResult });
          }
          break;

        case 'appointment_reminder':
          const reminderEmail = await notificationService.sendEmail(
            user.email,
            `Appointment Reminder - Tomorrow`,
            `Dear ${user.fullName},\n\nThis is a reminder for your appointment tomorrow:\n\nService: ${data.service}\nDate: ${data.date}\nTime: ${data.time}\nLocation: ${data.location}\nReference: ${data.reference}\n\nRequired documents: ${data.documents.join(', ')}\n\nThank you,\nGovernment Services Portal`,
            'appointment_reminder'
          );
          notifications.push({ type: 'email', result: reminderEmail });

          if (user.phoneNumber) {
            const reminderSms = await notificationService.sendSMS(
              user.phoneNumber,
              `Reminder: Appointment tomorrow for ${data.service} at ${data.time}. Ref: ${data.reference}. Don't forget documents!`,
              'appointment_reminder'
            );
            notifications.push({ type: 'sms', result: reminderSms });
          }
          break;

        case 'status_update':
          const statusEmail = await notificationService.sendEmail(
            user.email,
            `Appointment Status Update - ${data.status}`,
            `Dear ${user.fullName},\n\nYour appointment status has been updated:\n\nService: ${data.service}\nNew Status: ${data.status}\nReference: ${data.reference}\n\n${data.notes ? `Notes: ${data.notes}\n\n` : ''}Thank you,\nGovernment Services Portal`,
            'status_update'
          );
          notifications.push({ type: 'email', result: statusEmail });

          if (user.phoneNumber) {
            const statusSms = await notificationService.sendSMS(
              user.phoneNumber,
              `Status update: ${data.service} appointment is now ${data.status}. Ref: ${data.reference}`,
              'status_update'
            );
            notifications.push({ type: 'sms', result: statusSms });
          }
          break;

        case 'document_verification':
          const docEmail = await notificationService.sendEmail(
            user.email,
            `Document Verification Update`,
            `Dear ${user.fullName},\n\nDocument verification update for appointment ${data.reference}:\n\nDocument: ${data.documentName}\nStatus: ${data.verificationStatus}\n\n${data.notes ? `Notes: ${data.notes}\n\n` : ''}${data.verificationStatus === 'REJECTED' ? 'Please resubmit the corrected document.\n\n' : ''}Thank you,\nGovernment Services Portal`,
            'document_verification'
          );
          notifications.push({ type: 'email', result: docEmail });

          if (user.phoneNumber) {
            const docSms = await notificationService.sendSMS(
              user.phoneNumber,
              `Document ${data.documentName} ${data.verificationStatus.toLowerCase()} for appointment ${data.reference}`,
              'document_verification'
            );
            notifications.push({ type: 'sms', result: docSms });
          }
          break;

        case 'feedback_request':
          const feedbackEmail = await notificationService.sendEmail(
            user.email,
            `Service Feedback Request`,
            `Dear ${user.fullName},\n\nThank you for using our services. We would appreciate your feedback on your recent experience:\n\nService: ${data.service}\nDate: ${data.date}\nReference: ${data.reference}\n\nPlease visit our portal to submit your feedback and help us improve our services.\n\nThank you,\nGovernment Services Portal`,
            'feedback_request'
          );
          notifications.push({ type: 'email', result: feedbackEmail });
          break;

        default:
          throw new Error(`Unknown notification type: ${type}`);
      }

      return {
        success: true,
        notifications,
        totalSent: notifications.length
      };

    } catch (error) {
      console.error('Notification service error:', error);
      return {
        success: false,
        error: error.message,
        notifications
      };
    }
  }
};

module.exports = notificationService;

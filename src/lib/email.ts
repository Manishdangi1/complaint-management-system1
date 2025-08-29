import nodemailer from 'nodemailer';
import { Complaint } from '@/types';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendNewComplaintEmail(complaint: Complaint, adminEmail: string) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: adminEmail,
    subject: `New Complaint: ${complaint.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Complaint Submitted</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #555;">${complaint.title}</h3>
          <p><strong>Category:</strong> ${complaint.category}</p>
          <p><strong>Priority:</strong> <span style="color: ${
            complaint.priority === 'High' ? '#e74c3c' : 
            complaint.priority === 'Medium' ? '#f39c12' : '#27ae60'
          };">${complaint.priority}</span></p>
          <p><strong>Description:</strong></p>
          <p style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db;">
            ${complaint.description}
          </p>
          <p><strong>Date Submitted:</strong> ${new Date(complaint.dateSubmitted).toLocaleString()}</p>
        </div>
        <p style="color: #666; font-size: 14px;">
          Please review and take appropriate action on this complaint.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('New complaint email sent successfully');
  } catch (error) {
    console.error('Error sending new complaint email:', error);
  }
}

export async function sendStatusUpdateEmail(complaint: Complaint, adminEmail: string, oldStatus: string) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: adminEmail,
    subject: `Complaint Status Updated: ${complaint.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Complaint Status Updated</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #555;">${complaint.title}</h3>
          <p><strong>Previous Status:</strong> <span style="color: #e74c3c;">${oldStatus}</span></p>
          <p><strong>New Status:</strong> <span style="color: #27ae60;">${complaint.status}</span></p>
          <p><strong>Category:</strong> ${complaint.category}</p>
          <p><strong>Priority:</strong> ${complaint.priority}</p>
          <p><strong>Date Updated:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <p style="color: #666; font-size: 14px;">
          The complaint status has been successfully updated.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Status update email sent successfully');
  } catch (error) {
    console.error('Error sending status update email:', error);
  }
}

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: userEmail,
    subject: 'Welcome to Complaint Management System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome, ${userName}!</h2>
        <p>Thank you for registering with our Complaint Management System.</p>
        <p>You can now submit complaints and track their progress.</p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #555;">Getting Started</h3>
          <ul>
            <li>Submit new complaints through the complaint form</li>
            <li>Track the status of your submitted complaints</li>
            <li>Receive updates on complaint progress</li>
          </ul>
        </div>
        <p style="color: #666; font-size: 14px;">
          If you have any questions, please contact our support team.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

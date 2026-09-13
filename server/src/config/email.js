import nodemailer from 'nodemailer';
import config from './env.js';
import logger from '../utils/logger.js';

const transporter = nodemailer.createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  secure: config.smtp.port === 465, // true for 465, false for other ports
  auth: {
    user: config.smtp.user,
    pass: config.smtp.password,
  },
});

// Verify connection configuration
if (config.smtp.user && config.smtp.password) {
  transporter.verify((error) => {
    if (error) {
      logger.warn(`SMTP connection failed: ${error.message}`);
    } else {
      logger.info('SMTP server ready to send emails');
    }
  });
} else {
  logger.warn('SMTP credentials missing. Email features will not work.');
}

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} [options.html] - HTML body
 * @param {string} [options.text] - Plain text body
 * @returns {Promise<boolean>} Success status
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  if (!config.smtp.user || !config.smtp.password) {
    logger.warn('Email sending skipped: SMTP credentials missing');
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: config.smtp.from,
      to,
      subject,
      html,
      text,
    });
    logger.info(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    return false;
  }
};

/**
 * Send contact notification to admin and auto-reply to user
 * @param {Object} data - Contact form data
 * @param {string} data.name - Sender name
 * @param {string} data.email - Sender email
 * @param {string} data.message - Message content
 */
export const handleContactForm = async ({ name, email, message }) => {
  // Notify admin
  await sendEmail({
    to: config.smtp.to,
    subject: `New Contact Request from ${name}`,
    html: `
      <h2>New Contact Request</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });

  // Auto-reply to user
  await sendEmail({
    to: email,
    subject: 'Thank you for your message',
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for reaching out. I have received your message and will get back to you as soon as possible.</p>
      <p>Best regards,</p>
      <p>Your Portfolio Team</p>
    `,
  });
};

import { sendEmail } from '../config/email.js';
import config from '../config/env.js';
import logger from '../utils/logger.js';

export const sendContactNotification = async (message) => {
  try {
    await sendEmail({
      to: config.smtp.to || config.admin.email,
      subject: `New Contact Message: ${message.subject || 'Portfolio Inquiry'}`,
      html: `
        <h2>New Message Received</h2>
        <p><strong>From:</strong> ${message.name} (${message.email})</p>
        <p><strong>Subject:</strong> ${message.subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <div style="background:#f4f4f4;padding:12px;border-radius:6px;">${message.message}</div>
      `,
      text: `Name: ${message.name}\nEmail: ${message.email}\nSubject: ${message.subject || 'N/A'}\n\nMessage:\n${message.message}`,
    });
  } catch (error) {
    logger.warn(`Failed to send contact notification: ${error.message}`);
  }
};

export const sendAutoReply = async (to, name) => {
  try {
    await sendEmail({
      to,
      subject: 'Thank you for reaching out!',
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for getting in touch. I have received your message and will get back to you shortly.</p>
        <p>Best regards,<br/>Portfolio Team</p>
      `,
      text: `Hi ${name},\n\nThank you for getting in touch. I have received your message and will get back to you shortly.\n\nBest regards,\nPortfolio Team`,
    });
  } catch (error) {
    logger.warn(`Failed to send auto-reply: ${error.message}`);
  }
};

export const sendReply = async (to, name, replyMessage) => {
  try {
    await sendEmail({
      to,
      subject: 'Re: Your Portfolio Contact Message',
      html: `
        <h2>Hi ${name},</h2>
        <p>${replyMessage.replace(/\n/g, '<br/>')}</p>
        <p>Best regards,<br/>Admin</p>
      `,
      text: `Hi ${name},\n\n${replyMessage}\n\nBest regards,\nAdmin`,
    });
  } catch (error) {
    logger.warn(`Failed to send reply email: ${error.message}`);
  }
};

export const sendOtpEmail = async (to, otpCode) => {
  try {
    await sendEmail({
      to,
      subject: `Admin Two-Step Verification Code: ${otpCode}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; background: #141a16; color: #f5f0e8; border-radius: 12px; padding: 32px; border: 1px solid rgba(255,255,255,0.1);">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: #c66a3d; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
              Admin 2-Step Verification
            </div>
          </div>
          <h2 style="font-size: 22px; color: #f5f0e8; text-align: center; margin-bottom: 8px;">Your Security Code</h2>
          <p style="color: #a3a89f; font-size: 14px; text-align: center; line-height: 1.5; margin-bottom: 24px;">
            Use the 6-digit one-time passcode below to verify your login to the Portfolio Admin Panel.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <div style="display: inline-block; background: #1c251f; border: 2px solid #c66a3d; padding: 16px 36px; border-radius: 12px; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #f5f0e8;">
              ${otpCode}
            </div>
          </div>
          <p style="color: #a3a89f; font-size: 12px; text-align: center; margin-top: 24px;">
            This code will expire in <strong>10 minutes</strong>. If you did not request this code, please secure your credentials immediately.
          </p>
        </div>
      `,
      text: `Your Admin Two-Step Verification Code is: ${otpCode}\n\nThis code expires in 10 minutes. If you did not request this, please secure your account.`,
    });
    logger.info(`2FA OTP email sent successfully to ${to}`);
  } catch (error) {
    logger.warn(`Failed to send 2FA OTP email: ${error.message}`);
  }
};

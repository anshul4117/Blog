import nodemailer from 'nodemailer';
import config from './index.js';

const transporter = nodemailer.createTransport({
    service: config.MAIL_SERVICE,
    auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS
    }
});

/**
 * Send an email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML)
 */
const sendEmail = async (to, subject, html) => {
    const mailOptions = {
        from: `"Blog App" <${config.MAIL_USER}>`,
        to,
        subject,
        html
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;

import nodemailer from 'nodemailer';

const trancporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
});

export const sendEmail = async (message) => {
  trancporter.sendMail(message);
};

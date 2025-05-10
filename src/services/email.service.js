import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'timefourthe@gmail.com',
    pass: `${process.env.EMAIL_PASS}`,
  }
});

async function sendEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: 'timefourthe@gmail.com',
    to: Array.isArray(to) ? to.join(', ') : to,
    subject,
    text,
    html
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
}

export default sendEmail;
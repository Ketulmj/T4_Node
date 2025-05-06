import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'timefourthe@gmail.com',
    pass: 'abde gvek uswd fhzx'
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
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export default sendEmail;
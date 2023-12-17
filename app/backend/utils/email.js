const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1. Napravi transporter (ono sto salje email)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //2. Napravi email opcije
  const mailOptions = {
    from: 'Merkur app <reset@merkur.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3. Salji email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

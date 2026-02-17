import nodemailer from 'nodemailer';

const generateTemplate = (username, resetUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #333;">Reset your password</h2>
      <p>Hi Dear ${username},</p>
      <p>Please click the button below to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #cc0c0c; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px;">Reset Password</a>
      </div>
      <p style="font-size: 12px; color: #777;">This link expires in 10 minutes.</p>
    </div>
  `;
  return html;
};

export const sendEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const html = generateTemplate(user.username, user.resetURL);
  const emailOption = {
    from: process.env.EMAIL_FROM || 'test@example.com',
    to: user.email,
    subject: user.subject,
    html: html,
  };

  await transporter.sendMail(emailOption);
};

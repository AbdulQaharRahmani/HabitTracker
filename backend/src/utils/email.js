import nodemailer from 'nodemailer';

const generateTemplate = (username, resetUrl) => {
  const html = `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      @media only screen and (max-width: 600px) {
        .container {
          width: 100% !important;
          padding: 20px !important;
        }
        .content {
          padding: 20px !important;
        }
        .btn {
          width: 100% !important;
          padding: 15px 0 !important;
        }
        .footer {
          width: 100% !important;
        }
      }
    </style>
  </head>

  <body style="margin: 0; padding: 0; background-color: #fff7ed; font-family: Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0">
      <tr>
        <td align="center">
          <table
            class="container"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width: 600px;
              background: #ffffff;
              border-radius: 12px;
              box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
            "
          >
            <tr>
              <td class="content" style="padding: 40px">
                <h2
                  style="
                    margin: 0;
                    color: #f97316;
                    font-size: 24px;
                    text-align: center;
                  "
                >
                  Habit Tracker
                </h2>

                <hr
                  style="
                    border: none;
                    border-top: 1px solid #bbb;
                    margin: 20px 0;
                  "
                />

                <div style="color: #1f2937; font-size: 14px; line-height: 1.7">
                  <p>Hi Dear ${username},</p>

                  <p>
                    We received a request to reset your password for your
                    account.
                  </p>

                  <p>Please click the button below to set a new one:</p>

                  <div style="text-align: center; margin: 35px 0">
                    <a
                      href="${resetUrl}"
                      class="btn"
                      style="
                        background-color: #f97316;
                        color: #ffffff;
                        text-decoration: none;
                        padding: 15px 30px;
                        border-radius: 8px;
                        font-weight: bold;
                        font-size: 16px;
                        display: inline-block;
                      "
                    >
                      Reset My Password
                    </a>
                  </div>

                  <p>This link will expire in <strong>10 minutes</strong>.</p>

                  <p>
                    If you did not request a password reset, please ignore this
                    email. Your account remains secure.
                  </p>

                  <p style="margin-top: 30px">
                    Stay consistent 🔥<br />
                    Habit Tracker Team
                  </p>
                </div>
              </td>
            </tr>
          </table>

          <!-- Footer -->
          <table
            class="footer"
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width: 600px;
              background-color: #1f2937;
              border-radius: 0 0 12px 12px;
            "
          >
            <tr>
              <td
                style="
                  text-align: center;
                  font-size: 12px;
                  color: #9ca3af;
                  padding: 20px;
                "
              >
                © 2026 Habit Tracker. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
  return html;
};

export const sendEmail = async ({ to, subject, username, resetUrl }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const html = generateTemplate(username, resetUrl);
  const emailOption = {
    from: process.env.EMAIL_FROM || 'test@example.com',
    to,
    subject,
    html,
  };

  await transporter.sendMail(emailOption);
};

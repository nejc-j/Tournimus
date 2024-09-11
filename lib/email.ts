import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10), // Added radix parameter
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 0;
          margin: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .email-header h1 {
          font-size: 24px;
          margin: 0;
          color: #333;
        }
        .email-content {
          font-size: 16px;
          color: #555;
        }
        .email-content p {
          margin: 10px 0;
        }
        .btn {
          display: inline-block;
          padding: 10px 20px;
          margin-top: 20px;
          color: #fff;
          background-color: #007bff;
          text-decoration: none;
          border-radius: 4px;
        }
        .btn:hover {
          background-color: #0056b3;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 12px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Verify Your Email</h1>
        </div>
        <div class="email-content">
          <p>Hi there,</p>
          <p>Thank you for registering with our service. Please click the button below to verify your email address and activate your account.</p>
          <a href="${verificationUrl}" class="btn">Verify Email</a>
          <p>If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: '"Your App" <no-reply@yourapp.com>',
    to: email,
    subject: 'Verify Your Email',
    text: htmlContent,
    html: htmlContent,
  });
}

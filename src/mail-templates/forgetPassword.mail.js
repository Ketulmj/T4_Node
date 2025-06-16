import sendEmail from '../services/email.service.js';
import env from 'dotenv';
env.config();

const sendForgetPasswordMail = async (email, encodedLink) => {
  const senderName = "Time Fourthe";
  const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Password Reset Request</title>
      </head>
      <body style='font-family:Arial, sans-serif; margin:0; padding:0; background:#f3f2f0;'>
        <table role='presentation' cellspacing='0' cellpadding='0' border='0' align='center' width='100%'>
          <tr>
            <td align='center' style='padding:15px;'>
              <table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0' style='
                max-width: 600px;
                background: #000000;
                border: 1px solid #FFFFFF;
                border-radius: 15px;
                overflow:hidden;'>
                <!-- Header -->
                <tr>
                  <td style='padding:15px; text-align:center;'>
                    <span style='font-size:20px; font-weight:600; color:#FFFFFF;'> 🔒 Secure Access</span>
                  </td>
                </tr>
                <!-- Banner -->
                <tr>
                  <td style='background: #333333; padding:20px; text-align:center; color:#FFFFFF;'>
                    <h1 style='font-size:24px; margin:0; font-weight:bold;'>🔑 Reset Your Password</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style='padding:20px; text-align:center;'>
                    <h2 style='color:#FFFFFF; font-size:20px; margin-bottom:10px;'>Forgot Your Password?</h2>
                    <p style='background: #222222; padding:12px; border-radius:8px; font-size:16px; font-weight:350; color:#FFFFFF;'>
                      Dear User, we have received a request to reset your password.
                    </p>
                    <p style='font-size:14px; margin-top:12px; color:#CCCCCC;'>
                      Click the button below to reset your password. If you did not request this, please ignore this email.
                    </p>
                    <!-- Reset Button -->
                    <div style='text-align:center; margin-top:20px;'>
                      <a href='${process.env.CLIENT_ORIGIN}/reset-password?id=${encodedLink}'
                         style='display:inline-block; background: #FFFFFF; padding:12px 30px; color:#000000; text-decoration:none; font-weight:bold; border-radius:6px; font-size:14px; box-shadow: 0px 4px 15px rgba(255, 255, 255, 0.3); transition: all 0.3s ease;'>
                        🔑 Reset Password
                      </a>
                    </div>
                    <!-- Footer -->
                    <div style='text-align:center; margin-top:20px; padding-top:8px; border-top:1px solid #666666;'>
                      <p style='color:#FFFFFF; font-weight:500; margin-bottom:8px;'>Best Regards,</p>
                      <p style='color:#FFFFFF;'>TimeFourthe Team</p>
                      <img src='https://gateway.pinata.cloud/ipfs/bafkreidecqcdb6vxrzdqrii5rsff2vmxmc3y2mi5hxpkvh4ubkmu2pr4qe' width='50' height='50' alt='Logo'>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
  try {
    await sendEmail({
      to: email,
      subject: 'Reset your Password',
      html: htmlContent
    });
    console.log('Forget password email sent successfully');
  } catch (error) {
    console.error('Error sending forget password email:', error);
  }
}

export default sendForgetPasswordMail;
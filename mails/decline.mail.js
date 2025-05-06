import sendEmail from '../services/email.service.js';

const sendDeclineMail = async (email) => {
  const senderName = "Time Fourthe";
  const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Application Declined</title>
      </head>
      <body style='font-family:Arial, sans-serif; margin:0; padding:0; background: #f3f2f0;'>
        <table role='presentation' cellspacing='0' cellpadding='0' border='0' align='center' width='100%'>
          <tr>
            <td align='center' style='padding:15px;'>
              <table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0' style='
                max-width: 600px;
                background: #000000;
                border-radius: 15px;
                overflow:hidden;'>
                <!-- Header -->
                <tr>
                  <td style='padding:15px; text-align:center;'>
                    <span style='font-size:20px; font-weight:600; color:#FFFFFF;'>💡 ${senderName}</span>
                  </td>
                </tr>
                <!-- Banner -->
                <tr>
                  <td style='background: #333333; padding:20px; text-align:center; color:#FFFFFF;'>
                    <h1 style='font-size:24px; margin:0; font-weight:bold;'>❌ Application Declined</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style='padding:8px; text-align:center;'>
                    <h2 style='color:#FFFFFF; font-size:20px; margin: 15px;'>We Apologize</h2>
                    <p style='background: #222222; padding:12px; border-radius:8px; font-size:18px; font-weight:350; color:#FFFFFF;'>
                      Dear Applicant, we regret to inform you that your application has not been approved.
                    </p>
                    <p style='font-size:14px; margin-top:12px; color:#CCCCCC;'>
                      Unfortunately, your application does not meet our terms and conditions. 
                      We appreciate your interest and encourage you to review our requirements before applying again.
                    </p>
                    <!-- Footer -->
                    <div style='text-align:center; margin-top:20px; padding:8px 0px; border-top:1px solid #666666;'>
                      <p style='color:#FFFFFF; font-weight:500;'>Best Regards,</p>
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
      subject: 'Application Declined',
      html: htmlContent
    });
    console.log('Decline email sent successfully');
  } catch (error) {
    console.error('Error sending decline email:', error);
  }
}

export default sendDeclineMail;
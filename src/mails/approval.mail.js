import sendEmail from '../services/email.service.js';

const sendApprovalSuccessEmail = async (orgName, email) => {
  const htmlContent = `
      <!DOCTYPE html>
      <html lang='en'>
      <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Request Approval</title>
      </head>
      <body style='font-family:Arial, sans-serif; margin:0; padding:0; background:#f3f2f0;'>
        <table role='presentation' width='100%' cellspacing='0' cellpadding='0' border='0' align='center'>
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
                    <span style='font-size:20px; font-weight:600; color:#FFFFFF;'>✅ ${orgName}</span>
                  </td>
                </tr>

                <!-- Banner -->
                <tr>
                  <td style='background: #333333; padding:20px; text-align:center; color:#FFFFFF;'>
                    <h1 style='font-size:24px; margin:0; font-weight:bold;'>🎉 Approval Successful</h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style='padding:8px 20px; text-align:center;'>
                    <h2 style='color:#FFFFFF; font-size:20px; margin-bottom:8px;'>Request Approval Confirmation</h2>
                    
                    <p style='
                      background: #222222;
                      padding:12px;
                      border-radius:8px;
                      font-size:18px;
                      font-weight:350;
                      color:#FFFFFF;'>
                      Dear <span style='color:#4F46E5; font-weight:600;'>${orgName}</span>, your request has been successfully approved.
                    </p>

                    <p style='font-size:14px; margin-top:15px; color:#CCCCCC;'>
                      Now that your request is approved, you can proceed with the next steps. Click the button below to access your account:
                    </p>

                    <div style='text-align:center; margin:20px;'>
                      <a href='http://localhost:5173/login' style='
                        display:inline-block;
                        background: #4CAF50;
                        color: #FFFFFF;
                        text-decoration: none;
                        padding:12px 24px;
                        border-radius:6px;
                        font-weight:600;
                        font-size:14px;
                        transition: opacity 0.3s;'>
                        Go to Login Page
                      </a>
                    </div>

                    <p style='font-size:14px; margin-top:15px; color:#CCCCCC;'>
                      If you need assistance, our support team is happy to help.
                    </p>

                    <div style='padding-top: 5px; border-top:1px solid #666666; margin-top:10px; text-align:center;'>
                      <p style='color:#FFFFFF; font-weight:500; margin-bottom:5px;'>Best Regards</p>
                      <p style='color:#FFFFFF;'>TimeFourthe Team</p>
                    </div>

                    <!-- Logo -->
                    <div style='text-align:center; margin:10px 15px;'>
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
      subject: 'Authentication of Organization',
      html: htmlContent
    });
    console.log('Approval success email sent successfully');
  } catch (error) {
    console.error('Error sending approval success email:', error);
  }
}

export default sendApprovalSuccessEmail;
import sendEmail from '../services/email.service.js';

const sendAuthMail = async (org) => {
  const orgName = org[1];
  const orgId = org[0];
  const recipients = ['timefourthe@gmail.com'];
  const htmlContent = `
      <!DOCTYPE html>
      <html lang='en'>
      <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Organization Signup Request</title>
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
                    <span style='font-size:20px; font-weight:600; color:#FFFFFF;'>🔐 Time Fourthe</span>
                  </td>
                </tr>
                <!-- Banner -->
                <tr>
                  <td style='background: #333333; padding:20px; text-align:center; color:#FFFFFF;'>
                    <h1 style='font-size:24px; margin:0; font-weight:bold;'>🚀 Signup Request</h1>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style='padding:8px 20px; text-align:center;'>
                    <h2 style='color:#FFFFFF; font-size:20px; margin-bottom:8px;'>Organization Authorization</h2>
                    <p style='background: #222222; padding:12px; border-radius:8px; font-size:18px; font-weight:350; color:#FFFFFF;'>
                      <strong><span style='font-weight: bold; font-size:20px;'>${orgName}</span></strong> is requesting to sign up for our platform.
                    </p>
                    <p style='font-size:14px; margin-top:12px; color:#CCCCCC;'>
                      Please review the request and choose whether to approve or deny this organization's signup request.
                    </p>
                    <!-- Buttons -->
                    <div style='text-align:center; margin-top:20px;'>
                      <a href='http://localhost:3000/api/get/auth?id=${orgId}&answer=true' 
                         style='display:inline-block; background: #4CAF50; padding:10px 30px; color:#fff; text-decoration:none; font-weight:bold; border-radius:6px; font-size:14px; box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3); transition: all 0.3s ease;'>
                        Approve
                      </a>
                      <a href='http://localhost:3000/api/get/auth?id=${orgId}&answer=false' 
                         style='display:inline-block; background: #E53935; padding:10px 40px; color:#fff; text-decoration:none; font-weight:bold; border-radius:6px; font-size:14px; box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3); transition: all 0.3s ease; margin-left:10px;'>
                        Deny
                      </a>
                    </div>
                    <!-- Footer -->
                    <div style='text-align:center; margin-top:20px; padding-top:15px; border-top:1px solid #666666;'>
                      <p style='color:#FFFFFF; font-weight:500; margin-bottom:8px;'>Best Regards,</p>
                      <p style='color:#FFFFFF;'>Time Fourthe Team</p>
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
      to: recipients,
      subject: 'Authentication of Organization',
      html: htmlContent
    });
    console.log(`Authentication email for ${orgName} sent successfully`);
  } catch (error) {
    console.error('Error sending authentication email:', error);
  }
}

export default sendAuthMail;
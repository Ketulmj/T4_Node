import { encodeJwt } from '../utils/auth.js'
import sendForgetPasswordMail from '../mails/forgetPassword.mail.js'
import { getUserByEmail } from '../services/user.service.js'

export const forgotMail = async (req, res) => {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.json({ status: 400, result: "Given email is not associated with any account" });
    sendForgetPasswordMail(chg.email, encodeJwt(email));
    return res.json({ status: 200, result: "Mail is sent, Check your Inbox" });
};
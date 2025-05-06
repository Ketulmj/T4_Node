import { Router } from 'express'
const router = Router()
import { encodeJwt } from '../utils/auth.js'
import sendAuthMail from '../mails/auth.mail.js'
import sendDeclineMail from '../mails/decline.mail.js'
import sendApprovalSuccessEmail from '../mails/approval.mail.js'
import sendForgetPasswordMail from '../mails/forgetPassword.mail.js'
import { getUserByEmail } from '../services/user.service.js'

router.post('/decline', async (req, res) => {
    const { email } = req.body;
    sendDeclineMail(email);
    return res.json({ id: 'f' });
});

router.post('/user/forgot/mail', async (req, res) => {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.json({ status: 400, result: "Given email is not associated with any account" });
    sendForgetPasswordMail(chg.email, encodeJwt(email));
    return res.json({ status: 200, result: "Mail is sent, Check your Inbox" });
});

router.post('/approve', async (req, res) => {
    sendApprovalSuccessEmail("NextGen Academy", "vasavadhruvin123@gmail.com");
    return res.json({ id: 'f' });
});

router.post('/send/mail', async (req, res) => {
    sendAuthMail(["ORG82469235952", "Web University"]);
    return res.json({ id: 'f' });
});

export default router;
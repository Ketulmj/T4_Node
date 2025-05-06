import { Router } from 'express';
const router = Router();
import { createPendingUser, getPendingUser, deletePendingUser } from '../services/pendingUser.service.js';
import { createUser, getUserByEmail, getOrganizationByOrgId } from '../services/user.service.js';
import { encodeJwt } from '../utils/auth.js';
import sendApprovalSuccessEmail from '../mails/approval.mail.js';
import sendDeclineMail from '../mails/decline.mail.js';
import sendAuthMail from '../mails/auth.mail.js';
import User from '../models/user.js';

router.post('/user/signup', async (req, res) => {
    const usr = req.body
    console.log(usr)
    const user = new User({
        Name: usr.name,
        Email: usr.email,
        Password: usr.password,
        Role: usr.role,
        OrgId: usr.orgId,
        Class: usr.class,
        UserId: usr.userId
    });
    const userExist = await getUserByEmail(user.Email);
    if (userExist) return res.json({ error: true, message: "User already exists" });

    if (user.Role !== "organization") {
        const orgExist = await getOrganizationByOrgId(user.OrgId);
        if (!orgExist) return res.json({ error: true, message: "This Organization does not exist" });

        try {
            await createUser(user);
            const token = encodeJwt({
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.Role,
                orgId: user.OrgId,
                className: user.class
            });
            res.cookie('auth', token, { expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
        } catch (error) {
            throw error;
        }
        return res.json({
            message: "User created successfully",
            // userData: {
            //     name: user.name,
            //     userId: user.userId,
            //     role: user.Role,
            //     email: user.email,
            //     orgId: user.OrgId,
            //     className: user.class
            // }
        });
    } else {
        const pendingUserExist = await getPendingUser(user.email);
        if (pendingUserExist) return res.json({ error: true, message: "Your request has not been approved yet" });

        const org = await createPendingUser(user);
        sendAuthMail(org);
        return res.json({
            error: false,
            message: "Logged In",
            userData: {
                name: user.name,
                userId: user.userId,
                role: user.Role,
                email: user.email,
            }
        });
    }
});

router.get('/get/auth', async (req, res) => {
    const orgId = req.query.id;
    const approve = req.query.answer;
    const deletedUser = (await deletePendingUser(orgId)).value;

    if (approve === "true") {
        await createUser(deletedUser);
        sendApprovalSuccessEmail(deletedUser.Name, deletedUser.Email);
        return res.json({ message: "Your application is approved by authority" });
    } else {
        sendDeclineMail(deletedUser.Email);
        return res.json({ message: "Your application is not approved by authority" });
    }
});

export default router;
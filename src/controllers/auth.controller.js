import { createPendingUser, getPendingUser, deletePendingUser } from '../services/pendingUser.service.js';
import { createUser, getUserByEmail, getOrganizationByOrgId } from '../services/user.service.js';
import { encodeJwt } from '../utils/auth.js';
import sendApprovalSuccessEmail from '../mails/approval.mail.js';
import sendDeclineMail from '../mails/decline.mail.js';
import sendAuthMail from '../mails/auth.mail.js';

export const getAuth = async (req, res) => {
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
};

export const userSignup = async (req, res) => {
    const user = req.body
    // console.log(user)
    const userExist = await getUserByEmail(user.email);
    if (userExist) return res.json({ error: true, message: "User already exists" });
    
    const pendingUserExist = await getPendingUser(user.email);
    if (pendingUserExist) return res.json({ error: true, message: "Your request has not been approved yet" });

    if (user.role !== "organization") {
        const orgExist = await getOrganizationByOrgId(user.orgId);
        if (!orgExist) return res.json({ error: true, message: "This Organization does not exist" });

        try {
            const newUser = {
                Name: user.name,
                Email: user.email,
                Password: user.password,
                Role: user.role,
                OrgId: user.orgId
            }
            user.role == 'student' ? newUser.Class = user.class : newUser.Schedule = []
            await createUser(newUser);
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
            message: "User created successfully"
        });
    } else {
        const newUser = {
            Name: user.name,
            Email: user.email,
            Password: user.password,
            Role: user.role,
            OrgType: user.orgType
        }
        const org = await createPendingUser(newUser);
        sendAuthMail(org);
        return res.json({
            error: false,
            message: "Logged In"
        });
    }
};

// For login
export const userLogin = async (req, res) => {
    const user = req.body;
    const userExist = await getUserByEmail(user.email);
    if (userExist) {
        if (userExist.Password === user.password) {
            // console.log(userExist);
            const userdata = {
                userId: userExist.UserId,
                name: userExist.Name,
                email: userExist.Email,
                role: userExist.Role,
                orgId: userExist.OrgId,
                className: userExist.Class
            };
            const token = encodeJwt(userdata);
            res.cookie('auth', token, { expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) });
            return res.json({
                error: false,
                redirectUrl: "/timetable",
                message: "Successfully Login",
                userData: userdata
            });
        } else {
            return res.json({ error: true, redirectUrl: "/login", message: "Password Incorrect" });
        }
    }
    return res.json({ error: true, redirectUrl: "/login", message: "User not exists" });
};

// Logout
export const userLogout = (req, res) => {
    const auth = req.cookies.auth;
    if (auth) {
        res.clearCookie('auth');
    }
    return res.json({ status: true });
};

import bcrypt from 'bcryptjs';
import { createPendingUser, getPendingUser, deletePendingUser } from '../services/pendingUser.service.js';
import { createUser, getUserByEmail, getOrganizationByOrgId } from '../services/user.service.js';
import { encodeJwt } from '../utils/auth.js';
import sendApprovalSuccessEmail from '../mail-templates/approval.mail.js';
import sendDeclineMail from '../mail-templates/decline.mail.js';
import sendAuthMail from '../mail-templates/auth.mail.js';

export const getAuth = async (req, res) => {
    try {
        const orgId = req.query.id;
        const approve = req.query.answer;
        const deletedUser = await deletePendingUser(orgId);

        if (approve === "true") {
            const user = {
                Name: deletedUser.Name,
                Email: deletedUser.Email,
                Password: deletedUser.Password,
                Role: deletedUser.Role,
                UserId: deletedUser.UserId,
                OrgType: deletedUser.OrgType
            }
            await createUser(user);
            sendApprovalSuccessEmail(user.Name, user.Email);
            return res.json({ message: "Application is approved" });
        } else {
            sendDeclineMail(deletedUser.Email);
            return res.json({ message: "Application is declined" });
        }
    } catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).send("Internal Server Error");
    }
};

export const userSignup = async (req, res) => {
    try {
        const user = req.body;
        const userExist = await getUserByEmail(user.email);
        if (userExist) { return res.status(400).json({ error: true, message: "User already exists" }); }

        const pendingUserExist = await getPendingUser(user.email);
        if (pendingUserExist) { return res.status(400).json({ error: true, message: "Your request has not been approved yet" }); }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);

        if (user.role === "organization") {
            const newUser = {
                Name: user.name,
                Email: user.email,
                Password: hashedPassword,
                Role: user.role,
                OrgType: user.orgType
            }
            const org = await createPendingUser(newUser);
            sendAuthMail(org);
            return res.json({ error: false, message: "Application sent successfully!" });
        }
        else if (user.role === "teacher" || user.role === "student") {
            const orgExist = await getOrganizationByOrgId(user.orgId);
            if (!orgExist) { return res.json({ error: true, message: "This Organization does not exist" }); }
            const newUser = {
                Name: user.name,
                Email: user.email,
                Password: hashedPassword,
                Role: user.role,
                OrgId: user.orgId
            }
            if (user.role === "student")
                newUser.Class = user.class;
            else
                newUser.Schedule = [];
            const usr = await createUser(newUser);
            const token = {
                name: usr.Name,
                email: usr.Email,
                role: usr.Role,
                orgId: usr.OrgId,
                className: usr.Class,
                userId: usr.UserId
            };
            return res.cookie('auth', encodeJwt(token), {
                  httpOnly: true,
                  secure: true,
                  sameSite: 'None',
                  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                })
                .json({ error: false, message: "Successfully Signup", userData: token });
        }
        else {
            return res.json({ error: true, message: "Invalid Role" });
        }
    } catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).send("Internal Server Error");
    }
};

// For login
export const userLogin = async (req, res) => {
    try {
        const user = req.body;
        const userExist = await getUserByEmail(user.email);
        if (userExist) {
            const password = await bcrypt.compare(user.password, userExist.Password);
            if (password) {
                const userdata = {
                    userId: userExist.UserId,
                    name: userExist.Name,
                    email: userExist.Email,
                    role: userExist.Role,
                    orgId: userExist.OrgId,
                    className: userExist.Class
                };
                const token = encodeJwt(userdata);
                return res.cookie('auth', encodeJwt(token), {
                      secure: true,
                      httpOnly: true,
                      sameSite: 'None',
                      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })
                    .json({
                        error: false,
                        redirectUrl: "/dashboard",
                        message: "Successfully Login",
                        userData: userdata
                    });
            } else {
                return res.json({ error: true, redirectUrl: "/login", message: "Password Incorrect" });
            }
        } else {
            return  res.status(400).json({ error: true, redirectUrl: "/login", message: "User not exists" });
        }
    } catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).send("Internal Server Error");
    }
};

// Logout
export const userLogout = (req, res) => {
    const auth = req.cookies.auth;
    if (auth) {
        res.clearCookie('auth');
        res.json({ status: true });
    }
};

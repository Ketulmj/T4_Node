import mongoose from 'mongoose';

const pendingUserSchema = new mongoose.Schema({
    UserId: String,
    Name: String,
    Email: String,
    Password: String,
    Role: String,
    OrgType: {
        type: [Number],
        default: []
    }
})

const pendingUser = mongoose.model('PendingUsers', pendingUserSchema);
export default pendingUser;